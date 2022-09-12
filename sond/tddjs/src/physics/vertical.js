/*! vertical.js - v1.0.0 - 2020-11-26
* Copyright (c) 2020 mgomezm@aemet.es; 
* 
* Vertical
* */

//import * as d3 from './d3.js';


/**
 * Vertical profile class 
 * ----------------------
 * Requires a list of Objects
 * Data is sorted in ascending pressure.
 * Provides the necessary operators to manage a vertical profile 
 * TODO:
 * If new values are added above or below, this.top and this.bot need to be defined again
 * 
 * Input data:
 * p  press 975.0  [hPa]
 * z  hght  346.0  [m]
 * T  temp  16.3   [ºC]
 * Td dwpt  8.2    [ºC]
 * wD wdir  254.0  [º]
 * wS wspd  0.5144 [m/s]
 * Derived data:
 * r:
 * rw:
 */
class Vertical {

	// bisectors: return the bottom level index for the given value
	bisectp  = d3.bisector(d => d.p).left
	bisectz  = d3.bisector((d, x) => x - d.z ).left
	bisectzg = d3.bisector((d, x) => x - d.zg).left

	
	/**
	 * Create a vertial object
	 * @param {Object[]} data - Data required
	 * @returns
	 */
	constructor(data){
		this.data  = data.sort((a,b) => a.p-b.p) // ascending pressure
		this.top   = this.data[0]
		this.bot   = this.data[this.len()-1]
	}
	
	
	/**
	 * Load new data
	 * @param {Object[]} data - Data required
	 * @returns
	 */
	start(data){
		//console.log(data)
		this.data  = data.sort((a,b) => a.p-b.p) // ascending pressure
		this.top   = this.data[0]
		this.bot   = this.data[this.len()-1]
	}
	
	
	/** Data length */
	len(){ return this.data.length }

	
	/** Class testing */
	test(){
		console.log("======== test vertial ========")
		this.info()
		
		console.log("==== test interpolación ====")
		for (let p of [940,950,960,975,980,1000,1050]){ //,975,1000,1050
			let t = this.interp(p, 'T')
			console.log(p, t)
		}
		
		console.log("==== test top bot ====")
		for (let p of [940,950,960,975,980,1000,1050]){ //,975,1000,1050
			console.log(p, this._top_i(p), this._bot_i(p), this._exists(p))
		}
		
		console.log("==== test new level ====")
		// this.new_level(980, true)
		// this.new_level(960, true)
		
		//this.add(1050)
		console.log("==== test levels ====")
		//for (let l of this.levels(960, 980, 'exact')){ console.log(l) }
		//for (let l of this.levels(950, 980, 'exact')){ console.log(l) }
		//for (let l of this.levels(960, 980, 'inner')){ console.log(l) }
		//for (let l of this.levels(960, 980, 'inner')){ console.log(l) }
		
		console.log("==== test layers ====")
		//for (let l of this.layers(960, 980, 'exact')){ console.log(l) }
	}

	
	/** */
	trace(){
		console.log("==== Vertical profile info ====")
		if (this.data.length==0) {console.log("sin datos"); return}
		console.log("data:",   this.data)
		console.log("length:", this.len())
		console.log("top:   ", this.top.p, this.top)
		console.log("bottom:", this.bot.p, this.bot)
	}
	
	
	/**
	 * Sort data in pressure order
	 * @param {string} order - 'a' for ascending and 'd' for descending order 
	 * @returns
	 */
	sort(order='a'){
		if      (order=='a') this.data.sort((a,b) => a.p-b.p)
		else if (order=='d') this.data.sort((a,b) => b.p-a.p)
	}
	
	
	/**
	 * Delete all levels above or below pressure p
	 * @param {number} p - pressure value
	 * @param {string} mode - 'above' or 'below' the pressure level
	 * @returns
	 */
	cut(p, mode='above'){
		let i = this.bisectp(this.data, p)
		// remove before the index
		if (mode=='above') this.data.splice(0, i)
		// remove after the index
		else if (mode=='below') this.data.length = i
		this.top = this.data[0]
		this.bot = this.data[this.len()-1]
	}
	
	
	/**
	 * Create a new pressure level with optional parameters to interpolate. 
	 * @param {number} p - pressure [hPa]
	 * @param {(boolean|string[])} params - all params of surrounding levels or list of params if provided
	 * @param {boolean} insert - insert new level in data or return it
	 * @returns {(boolean|string[])}
	 */
	new_level(p, params=false, insert=true){
		//console.log("new level", p, params, insert)
		// bounds
		if      (p<this.top.p) return null
		else if (p>this.bot.p) return null
		// check exact level
		let i = this.bisectp(this.data, p)
		if (this.data[i].p==p) return null //DEBUG
		// find layer and interpolate
		let top = this._top_l(p)
		let bot = this._bot_l(p)
		//console.log("    top bot", top, bot)
		let d = {'p': p}
		if      (params==true)  params=Object.keys(top)
		else if (params==false) params=[]
		for (let param of params){
			if (param=='p') continue
			d[param] = this.inter2x(top, bot, param, 'p', p)
		}
		if (insert)	{ this.data.splice(i, 0, d); return i; }
		else        { return d }
	}
	
	
	/**
	 * Return all cases where param==value as a list of
	 * objects with the pressure value and the 'sign' meaning:
	 *     0 for exact matching with a level
	 * 	   1 for top value<bottom value
	 *    -1 for top value>bottom value
	 * @param {string} param - parameter  
	 * @param {number} value - value to look for
	 * @returns {Object[]}
	 */
	find_all(param, value){
		var all = []
		for (var i=0; i<this.data.length-1; i++){
			let prev = this.data[i][param]
			let next = this.data[i+1][param]
			if (prev==value)                    { all.push({'sign': 0, 'p': this.data[i].p   }) }
			else if (next==value)               { all.push({'sign': 0, 'p': this.data[i+1].p }) }
			else if (prev<value && next>=value) { all.push({'sign': 1, 'p': this.inter2y(this.data[i], this.data[i+1], 'p', param, value)}) }
			else if (prev>value && next<=value) { all.push({'sign':-1, 'p': this.inter2y(this.data[i], this.data[i+1], 'p', param, value)}) }
			//else if (prev<value && next>=value) { all.push({'sign': 1, 'p': this.linter(this.data[i], this.data[i+1], 'p', param, value, mode)}) }
			//else if (prev>value && next<=value) { all.push({'sign':-1, 'p': this.linter(this.data[i], this.data[i+1], 'p', param, value, mode)}) }
		}
		return all
	}
	
	
	/**
	 * Find top level where param==value
	 * @param param
	 * @param value
	 * @param mode
	 * @returns
	 */
	find_top(param, value){
		for (var i=0; i<this.data.length-1; i++){
			let prev = this.data[i][param]
			let next = this.data[i+1][param]
			if (prev==value)                     { return this.data[i].p }
			else if (prev<value && next>=value)  { return this.inter2y(this.data[i], this.data[i+1], 'p', param, value) }
			else if (prev>value && next<=value)  { return this.inter2y(this.data[i], this.data[i+1], 'p', param, value) }
			//else if (prev<value && next>=value)  { return this.linter(this.data[i], this.data[i+1], 'p', param, value, mode) }
			//else if (prev>value && next<=value)  { return this.linter(this.data[i], this.data[i+1], 'p', param, value, mode) }
		}
		return null
	}
	
	/**
	 * Finds bot level where param==value
	 */
	find_bot(param, value){
		for (var i=this.data.length-1; i>0; i--){
			let prev = this.data[i-1][param]
			let next = this.data[i][param]
			if (prev==value)                     { return this.data[i].p }
			else if (prev<value && next>=value)  { return this.inter2y(this.data[i-1], this.data[i], 'p', param, value) }
			else if (prev>value && next<=value)  { return this.inter2y(this.data[i-1], this.data[i], 'p', param, value) }
			//else if (prev<value && next>=value)  { return this.linter(this.data[i-1], this.data[i], 'p', param, value, mode) }
			//else if (prev>value && next<=value)  { return this.linter(this.data[i-1], this.data[i], 'p', param, value, mode) }
		}
		return null
	}
	
	
	/**
	 * Finds bot level where param==value
	 */
	find_botz(param, value){
		for (var i=this.data.length-1; i>0; i--){
			let prev = this.data[i-1][param]
			let next = this.data[i  ][param]
			if (prev==value)                     { return this.data[i-1].z }
			else if (prev<value && next>=value)  { return this.inter2y(this.data[i-1], this.data[i], 'z', param, value) }
			else if (prev>value && next<=value)  { return this.inter2y(this.data[i-1], this.data[i], 'z', param, value) }
		}
		return null
	}
	

	_selection(method='exact', params=false){}	
	
	
	/**
	 * Iterator of levels between top and bot pressure
	 * @param {Object} top - top data level
	 * @param {Object} bot - bottom data level
	 * @param {('exact'|'inner'|'outer')} selection - level selection
	 * 	  exact: add two levels at the exact pressures. Interpolate all the variables. Deletes them at the end.
	 *    inner: selects first levels below 'top' and above 'bot'
	 *    outer: selects first levels above 'top' and below 'bot'
	 * @param {(boolean|string[])} params - true for all params of surrounding levels or list of params if provided
	 * @yields {Object} - data level
	 */
	*levels(top=null, bot=null, selection='exact', params=false, reverse=false){
		//console.log("*levels", top, bot, selection, params, this.data.length)
		// level selection
		if (!top) top = this.top.p
		if (!bot) bot = this.bot.p
		let it,ib
		if (selection=='inner'){
			it = this._bot_i(top)
			ib = this._top_i(bot)
		} else if (selection=='outer'){
			it = this._top_i(top)
			ib = this._bot_i(bot)
		} else if (selection=='exact'){
			if (this._exists(top))  {it = this._top_i(top);                  var del_it=false}
			else 					{it = this.new_level(top, params, true); var del_it=true }
			if (this._exists(bot))  {ib = this._bot_i(bot);                  var del_ib=false}
			else                    {ib = this.new_level(bot, params, true); var del_ib=true }		
		}
		// generator
		if (reverse==true){
			for (var i=ib; i>=it; i--){
				yield this.data[i]
			}	
		}else{
			for (var i=it; i<=ib; i++){
				yield this.data[i]
			}				
		}
		// delete biggest index first
		if (selection=='exact'){
			if (del_ib) this.data.splice(ib, 1);
			if (del_it) this.data.splice(it, 1);
		}
	}
	
	
	/**
	 * Iterator of layers between top and bot pressure
	 * @param {number} top - top pressure [hPa]
	 * @param {number} bot - bottom pressure [hPa]
	 * @param {('exact'|'inner'|'outer')} selection - level selection
	 * 	  exact: add two levels at the exact pressures. Interpolate all the variables.
	 *    inner: selects first levels below 'top' and above 'bot'
	 *    outer: selects first levels above 'top' and below 'bot'
	 * @param {(boolean|string[])} params - true for all params of surrounding levels or list of params if provided
	 * @yields {Object[]} - top and bottom data levels
	 */
	*layers(top=null, bot=null, selection='exact', params=false){
		// level selection
		if (!top) top = this.top.p
		if (!bot) bot = this.bot.p
		let it,ib
		if (selection=='inner'){
			it = this._bot_i(top)
			ib = this._top_i(bot)
		} else if (selection=='outer'){
			it = this._top_i(top)
			ib = this._bot_i(bot)
		} else if (selection=='exact'){
			if (this._exists(top))  {it = this._top_i(top);                  var del_it=false}
			else 					{it = this.new_level(top, params, true); var del_it=true }
			if (this._exists(bot))  {ib = this._bot_i(bot);                  var del_ib=false}
			else                    {ib = this.new_level(bot, params, true); var del_ib=true }		
		}
		// generator
		for (var i=it; i<ib; i++){
			yield [this.data[i], this.data[i+1]]
		}		
		// delete biggest index first
		if (selection=='exact'){
			if (del_ib) this.data.splice(ib, 1);
			if (del_it) this.data.splice(it, 1);
		}
	}
	
	
	layer(p){
		if      (p<this.top.p) return null
		else if (p>this.bot.p) return null 
		let i = this.bisectp(this.data, p) //, 1, lines.length-1);
		// exact level
		if (this.data[i].p==p) return [this.data[i],   this.data[i]]
		else                   return [this.data[i-1], this.data[i]]
	}
	
	
	/**
	 * Returns the mean of the parameter over all levels between ptop and btop.
	 * @param {string} param - parameter 
	 * @param {number} ptop - top pressure [hPa]
	 * @param {number} pbot - bottom pressure [hPa]
	 * @param {('exact'|'inner'|'outer')}
	 * @returns {number} mean
	 */
	mean(param, ptop, pbot, selection='exact'){
		let s = 0 // sum
		let n = 0 // number of levels
		for (let l of this.levels(ptop, pbot, selection, [param])){
			s += l[param]
			n += 1
			//console.log("  ", l[param], s, l.p, l.zg)
		}
		//console.log(s,n)
		return s/parseFloat(n)
	}

	
	/**
	 * 
	 */
	inter2(x0,x1,x,y0,y1){
		return (y0*(x1-x)+y1*(x-x0)) / (x1-x0)
	}
	
	
	/**
	 * Interpolation between 2 levels
	 * @param {Object} dt - top data level
	 * @param {Object} db - bottom data level
	 * @param {string} y_param - variable to interpolate
	 * @param {string} x_param - ordinate variable (p,z,zg)
	 * @param {number} x_value - ordinate value
	 * @param {string} fn - function to linearize x_param and y_param (linear,ln,exp) 
	 * @returns
	 */
//	linter(dt, db, y_param, x_param, x_value, fn='linear'){
//		let x  = x_value
//		let x0 = dt[x_param]
//		let x1 = db[x_param]
//		if (fn==='ln'){
//			x  = Math.log(x)
//			x0 = Math.log(x0)
//			x1 = Math.log(x1)
//		} else if (fn==='exp'){
//			x  = Math.exp(x)
//			x0 = Math.exp(x0)
//			x1 = Math.exp(x1)
//		}
//		let y0 = dt[y_param]
//		let y1 = db[y_param]
//		let y = (y0*(x1-x)+y1*(x-x0)) / (x1-x0)
//		return y
//	}
	
	
	/**
	 * Interpolate variable between 2 levels
	 * @param {Object} dt - top data level
	 * @param {Object} db - bottom data level
	 * @param {string} param - variable to interpolate
	 * @param {string} ordinate - ordinate variable (p,z,zg)
	 * @param {number} value - ordinate value
	 * @returns {number} - param value
	 */
	inter2x(dt, db, param, ordinate, value){
		// abscissa axis
		let x0 = dt[param]
		let x1 = db[param]
		// ordinate axis
		let y  = value
		let y0 = dt[ordinate]
		let y1 = db[ordinate]
		if (ordinate=='p'){
			y  = Math.log(y)
			y0 = Math.log(y0)
			y1 = Math.log(y1)
		}
		// result
		let x = (x0*(y1-y)+x1*(y-y0)) / (y1-y0)
		return x
	}
	
	
	/**
	 * Interpolate ordinate variable between 2 levels
	 * @param {Object} dt - top data level
	 * @param {Object} db - bottom data level
	 * @param {string} ordinate - ordinate axis to interpolate (p,z,zg)
	 * @param {string} param - abscissa variable 
	 * @param {number} value - abscissa value
	 * @returns {number} - ordinate value
	 */
	inter2y(dt, db, ordinate, param, value){
		// abscissa axis
		let x  = value
		let x0 = dt[param]
		let x1 = db[param]
		// ordinate axis
		let y0 = dt[ordinate]
		let y1 = db[ordinate]
		if (ordinate=='p'){
			y0 = Math.log(y0)
			y1 = Math.log(y1)
		}
		// result
		let y = (y0*(x1-x)+y1*(x-x0)) / (x1-x0)
		if (ordinate=='p') return Math.exp(y)
		else               return y
	}

	
	/**
	 * Interpolation of 'param' at presure 'p'
	 * @param {number} p - pressure [hPa]
	 * @param {string} param - name of the variable to be interpolated
	 * @param {string} fn - function to linearize p and param 
	 * @returns {null|number} 
	 */
	interp(p, param, fn='ln'){
		// bounds
		if      (p<this.top.p) return null
		else if (p>this.bot.p) return null 
		// bottom level index 
		let i = this.bisectp(this.data, p)
    	// exact level
		if (this.data[i].p==p) return this.data[i][param]
		// ordinate axis
		let y  = p
		let y0 = this.data[i-1].p
		let y1 = this.data[i  ].p
		// function to linearize p and param
		if (fn=='ln'){
			y  = Math.log(y)
			y0 = Math.log(y0)
			y1 = Math.log(y1)
		}
		// abscissa axis
		let x0 = this.data[i-1][param]
		let x1 = this.data[i  ][param]
		let x  = (x0*(y1-y)+x1*(y-y0)) / (y1-y0)	
		return x
	}
	
	/**
	 * Interpolation of 'param' at altitude 'z'
	 * @param {number} z - altitude [m]
	 * @param {string} param - name of the variable to be interpolated
	 * @returns {null|number} 
	 */
	interz(z, param){
		// bounds
		if      (z>this.top.z) return null
		else if (z<this.bot.z) return null
		// bottom level index 
		let i = this.bisectz(this.data, z)
		// exact level
		if (this.data[i].z==z) return this.data[i][param]
		// ordinate axis
		let y  = z
		let y0 = this.data[i-1].z
		let y1 = this.data[i  ].z
		// abscissa axis
		let x0 = this.data[i-1][param]
		let x1 = this.data[i  ][param]
		let x  = (x0*(y1-y)+x1*(y-y0)) / (y1-y0)	
		return x
	}
	
	
	/**
	 * Interpolation of 'param' at height 'zg'
	 * @param {number} zg - altitude [m]
	 * @param {string} param - name of the variable to be interpolated
	 * @returns {null|number} 
	 */
	interzg(zg, param){
		// bounds
		if      (zg>this.top.zg) return null
		else if (zg<this.bot.zg) return null
		// bottom level index 
		let i = this.bisectzg(this.data, zg)
		// exact level
		if (this.data[i].zg==zg) return this.data[i][param]
		// ordinate axis
		let y  = zg
		let y0 = this.data[i-1].zg
		let y1 = this.data[i  ].zg
		// abscissa axis
		let x0 = this.data[i-1][param]
		let x1 = this.data[i  ][param]
		let x  = (x0*(y1-y)+x1*(y-y0)) / (y1-y0)	
		return x
	}
	
	
	/**
	 * Closest level to pressure p
	 * @param {number} p - pressure [hPa]
	 * @returns {Object} data level
	 */
	closest(p){
		// bounds
		if      (p<this.top.p) return this.data[0]
		else if (p>this.bot.p) return this.data[this.len()-1]
		// closest
		let i = this._top_i(p)
		if ( (p-this.data[i].p) < (this.data[i+1].p-p) ) { return this.data[i] }
		else { return this.data[i+1]}
	}
	
	
	/** Determines if pressure level exists */
	_exists(p){
		if      (p<this.top.p) return false
		else if (p>this.bot.p) return false
		let i = this.bisectp(this.data, p)
        if (i>=this.len())     return false // debug: test016
        //console.log(i,p,this.data[i],this.data.length)
		if (this.data[i].p==p) return true
		return false
	}
	
	
	/** Get top pressure index */
	_top_i(p){
		if (p<this.top.p) return null
		let i = this.bisectp(this.data, p)
		if      (i==this.len())     return i-1
		else if (this.data[i].p==p) return i
		else                        return i-1 
	}
	
	
	/** Get top pressure level */
	_top_l(p){
		let i = this._top_i(p)
		return this.data[i]
	}

	
	/** Get bottom pressure index */
	_bot_i(p){
		if (p>this.bot.p) return null
		let i = this.bisectp(this.data, p)	
		if (i>=this.len()-1) return this.len()-1 
		else 	             return i 
	}
	
	
	/** Get bottom pressure level */
	_bot_l(p){
		let i = this._bot_i(p)
		return this.data[i]
	}
}


//==== test vertical ====//
//var v = new Vertical(sond)
//v.test()











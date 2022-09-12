'use strict';

/*! adiablift.js - v1.0.0 - 2020-12-14
* Copyright (c) 2020 mgomezm@aemet.es; 
* 
* AdiabLift
* */



/**
 */
class AdiabLift extends Vertical{
	
	constructor(p, T ,r){
		super([])

		// initial parcel values
		this.p0  = p
		this.T0  = T
		this.r0  = r //rwc(Td,p)
		this.Td0 = t_from_prw(p,r)
		this.TH  = thc(T,p)       // potential temperature
		this.THE = thec(T,p,r)    // equivalent potential temperature
        
		// computed in this class
		// parcel leveles
		this.LCL  // Lifted Condensation Level
		this.LCLv // Lifted Condensation Level with virutal temperatures
		this.LFC  // Level of Free Convection
		this.LFCv // Level of Free Convection with virutal temperatures
		this.EL   // Equilibrium Level
		this.ELv  // Equilibrium Level with virutal temperatures
		
		// parcel altitudes
		this.zLCL
		this.zLCLv
		this.zLFC
		this.zLFCv
		this.zEL
		this.zELv
		
		// energies
		this.CIN
		this.CINv
		this.CAPE
		this.CAPEv
		this.CAPE3
		this.CAPE3v
		
		// indexes
		this.LIFT
		this.LIFTv
		this.LIFT7
		this.LIFT7v
		
		// computed in souding
		// convective condensation 
		this.CCL  // Convective Condesation Level
		this.zCCL // Convective Condesation Level Altitude
		this.CCLv // Convective Condesation Level
		this.CCLv // Convective Condesation Level Altitude
		this.CCT  // Convective Condesation Temperature (at CCL)
		this.CCTv // Convective Condesation Temperature (at CCL)
		this.CT   // Convective Temperature
		this.CTv  // Convective Temperature
		
		// BRN, VGP, EHI*
		this.BRN   // Bulk Richardson Number
		this.BRNv 
		this.VGP   // Vorticity Generation Parameter
		this.VGPv  
		this.EHIL1 // Energy Helicity Index (Indice de helicidad-energia)
		this.EHIR1
		this.EHIL3
		this.EHIR3
		this.EHIL1v
		this.EHIR1v
		this.EHIL3v
		this.EHIR3v	
		
		// STP - Significant Tornado Parameter
		this.STPL  
		this.STPLv 
		this.STPR  
		this.STPRv 

		// STP2 - Significant Tornado Parameter 2 (requires ESRH & CIZEs)
		this.STP2L  
		this.STP2Lv 
		this.STP2R  
		this.STP2Rv 

        // SCP - Supercell Composite Parameter
    	this.SCPL 
    	this.SCPLv 
    	this.SCPR  
    	this.SCPRv 

		this.set()
		//console.log(this.data)
	}
	
	trace(){
		console.log("==== adiablift ====")
		console.log("lenght:", this.len())
		console.log("p0:", this.p0)
		console.log("T0:", this.T0)
		console.log("r0:", this.r0)	
        // DEBUG
		console.log("LCL", this.LCL, "LCLv", this.LCLv)
		console.log("LFC", this.LFC, "LFCv", this.LFCv)
		console.log("EL", this.EL, "ELv", this.ELv)
		console.log("zLCL", this.zLCL, "zLCLv", this.zLCLv)
		console.log("zLFC", this.zLFC, "zLFCv", this.zLFCv)
		console.log("zEL", this.zEL, "zELv", this.zELv)	
        // DEBUG
		console.log("CIN",  this.CIN,  this.CINv)
		console.log("CAPE", this.CAPE, this.CAPEv)
		console.log("CAPE3", this.CAPE3, this.CAPE3v)
		// DEBUG
        console.log("LIFT", this.LIFT, this.LIFTv)
		console.log("LIFT7", this.LIFT7, this.LIFT7v)
	}
	
	/**
	 * Constructor overload
	 */
	static from_pTTd(p,T,Td){
		let r = rwc(Td, p)
        return new AdiabLift(p,T,r)
    }
	
	/**
	 * Calculate vertical temperature profile and LCL
	 */
	set(){
		// dry adiabat
        var dd = getDryAdiabaticCelsius(this.T0, this.p0, this.r0, DP, false) // improved LCL
        //var dd = getDryAdiabaticCelsius(this.T0, this.p0, this.r0, DP, true)  
        // LCL
        this.LCL  = dd[dd.length-1].p
        this.LCLv = this.LCL
        // pseudoadiabt 
        let tc = dd[dd.length-1].T
        var ds = getSaturatedAdiabaticCelsius(tc, this.LCL, 100.)
        
        // debug: values at LCL
//        console.log("T", this.T0, dd[dd.length-1].T)
//        console.log("p", this.p0, dd[dd.length-1].p)
//        console.log("r", this.r0, dd[dd.length-1].r)
        
        // total
        this.data = dd.concat(ds)
        this.sort()
        this.top   = this.data[0]
		this.bot   = this.data[this.len()-1]
        console.log(this.data.length, this.top.p, this.bot.p, this.LCL)
        
        // debug
//        let midthw = thwc(tc, this.LCL, this.bot.r)
//        let botthw = thwc(this.bot.T, this.bot.p, this.bot.r)
//        let topthw = thwc(this.top.T, this.top.p, this.top.r)
//        let botthe = thec(this.bot.T, this.bot.p, this.bot.r)
//        let topthe = thec(this.top.T, this.top.p, this.top.r)
//        this.diffthw = topthw-botthw
        //console.log("adiablift:", this.p0, botthw, topthw, topthw-botthw, topthw>botthw, botthe, topthe, topthe-botthe, topthe>botthe)
        //console.log("adiablift:", this.p0, botthw, topthw, topthw-botthw, topthw>botthw)

        //console.log("adiablift:", this.p0, midthw, topthw, topthw-midthw, topthw>midthw)

        //console.log("adiablift data: lcl:", this.LCL, 'rw:', rwc(tc, pc), 'n:', dd.length)
	}
	
	
	/**
	 * Data creation
	 * Calculates CIN, CAPEs, LFC, EL for the sounding data provided
	 * 1. Completes the sounding and parcel data in each other's levels
	 * 2. Calculates
	 * @param sdata - list of sounding data 
	 */
	comp(sond){
		//return
		// Data asimilation
		let sdata = sond.data 
		
		// completa los datos de la burbuja con los niveles del sondeo.
		sdata.forEach(function(d){
			if (this._exists(d.p)) { return	}
			let t = this.interp(d.p, 'T')
			if (!(t)) return
			let r = this.interp(d.p, 'r')
			if (d.p>=this.LCL) { r=this.r0 }
			this.data.push({'T':t, 'p':d.p, 'r': r, 'Tv': tvc(t, r)})
			this.sort()
		}, this)
		//console.log("SOND->AD DATA:", this.data.length, sdata.length)	

		// interpola los datos del sondeo en los niveles de la burbuja
		this.data.forEach(function(d){
			let t  = sond.interp(d.p, 'T')
			let tv = sond.interp(d.p, 'Tv') 
			let z  = sond.interp(d.p, 'z')
			//console.log(t,tv,z)
			if (t===null) return
			//console.log(t,tv,z)
			d.z   = z
			d.T2  = t            // sounding temperature
			d.T2v = tv           // sounding virtual temperature
			d.iT  = d.T2  - d.T  // temperature interval
			d.iTv = d.T2v - d.Tv // virtual temperature interval
			//DEBUG.
			//console.log("Thw", thwc(d.T, d.p, d.r), d.p)
		}, this)
		//console.log(this.data.length)
        this.cut(sond.top.p, 'above')
        
        
		
		// add new levels in every intersection of iT and iTv
		let all
		all = this.find_all('iT', 0.).reverse()
		all.forEach(function(d, i){
			this.new_level(d.p, true, true)
		},this)
		all = this.find_all('iTv', 0.).reverse()
		all.forEach(function(d, i){
			this.new_level(d.p, true, true)
		},this)
		
        // DEBUG
//        this.data.forEach(function(d){ 
//            d.The = thec(d.T, d.p, d.r)  // setThe
//            d.Thw = thwc(d.T, d.p, d.r)  // setThw
//        })            

        // zLCL, zLCLv
        this.zLCL  = sond.interp(this.LCL, 'zg') //this.interp(this.LCL, 'z')
        this.zLCLv = this.zLCL 
        this.TLCL  = this.interp(this.LCL, 'T')
        this.TLCLv = this.interp(this.LCL, 'Tv')
		
		// LFC and EL
		all = this.find_all('iT', 0).reverse()
		let cintop, cintopv // last level before EL. Sometimes CIN areas are above LFC and this variables account for it.
		all.forEach(function(d, i){
			if (d.p<this.LCL && !(this.LFC) && (d.sign==1 | d.sign==0)) {
				this.LFC  = d.p
				this.zLFC = sond.interp(d.p, 'zg')
			}
			if (d.p<this.LFC && (d.sign==-1 | d.sign==0))  {
				this.EL  = d.p;  
				this.zEL = sond.interp(d.p, 'zg') 
				cintop   = all[i-1].p // get the previous level for CIN calculations
			} 
		},this)

		// LFCv and ELv
		all = this.find_all('iTv', 0).reverse()
		all.forEach(function(d, i){
			if (d.p<this.LCLv && !(this.LFCv) && (d.sign==1 | d.sign==0)) {
				this.LFCv  = d.p
				this.zLFCv = sond.interp(d.p, 'zg')
			}
			if (d.p<this.LFCv && (d.sign==-1 | d.sign==0))  {
				this.ELv  = d.p;  
				this.zELv = sond.interp(d.p, 'zg') 
				cintopv   = all[i-1].p // get the previous level for CIN calculations
			} // get the last one
		},this)
		
		// CAPE, CAPE3, CIN
		// TODO:ADAPTAR, no sé si es necesario???
		//    if  ne.v<self.p0:		
		//console.log(this.LFC, this.EL, this.LFC && this.EL)
		if (this.LFC && this.EL){ 
			this.CIN  = this.cin(cintop, this.p0) // from 0 to LFC
			this.CAPE = this.cape(this.EL, this.LFC)
			let z3 = sond.bot.z + 3000
			let p3 = this.find_bot('z', z3)
			this.CAPE3 = this.cape(p3, this.LFC)
		}	
		
		// CAPEv, CAPE3v, CINv
		if (this.LFCv && this.ELv){ 
			this.CINv  = this.cin(cintopv, this.p0, 'iTv') // from 0 to LFC
			this.CAPEv = this.cape(this.ELv, this.LFCv, 'iTv')
			let z3 = sond.bot.z + 3000
			let p3 = this.find_bot('z', z3)
			this.CAPE3v = this.cape(p3, this.LFCv, 'iTv')
		}	

		// LIFT, LIFTv
		let p5 = 500.
        let p7 = 700.
        this.LIFT   = sond.interp(p5, 'T')  - this.interp(p5, 'T')
        this.LIFTv  = sond.interp(p5, 'Tv') - this.interp(p5, 'Tv')
        this.LIFT7  = sond.interp(p7, 'T')  - this.interp(p7, 'T')
        this.LIFT7v = sond.interp(p7, 'Tv') - this.interp(p7, 'Tv')
	}
	
	/**
	 * Returns the CAPE and CIN sections to be plotted in different colors
	 */
	cape_sections(param='iT'){
		if (param=='iT'){
			if (this.CAPE==null) return null
			if (this.EL  ==null) return null
		} else if (param=='iTv'){
			if (this.CAPEv==null) return null
			if (this.ELv  ==null) return null
		} else {
			return null
		}
		let capes = [] 
		let cins  = []
		let positive = true // starts from top with CAPE
		let all = this.find_all(param, 0).reverse()
		let it
		let ib
		for (let i=all.length-1; i>=0; i--){
			it = this._bot_i(all[i].p)
			// last level in odd number of intersections
			if (positive==true && i==0) {
				break
			// last level in even number of intersections
			} else if (positive==false && i==0){
				ib = this.len()-1
			} else {
				ib = this._bot_i(all[i-1].p)	
			}
			if (positive) { capes.push(this.data.slice(it, ib+1)) }
			else          { cins.push(this.data.slice(it, ib+1)) }
			positive = !positive
		}
		return {'capes': capes, 'cins': cins}
	}
	
	
	cin(ptop, pbot, param='iT'){
		let CIN = 0
		for (let l of this.layers(ptop, pbot, 'exact')){ 
			if (Layer.half(l,param)>0){
				// equivalente a: def dpe(self,i): return Th.RD*self.p.deltaln(i)*self.T.half(i)
				//console.log(l, RD*Layer.deltaln(l,'p')*Layer.half(l,param), CIN )
				CIN -= RD*Layer.deltaln(l,'p')*Layer.half(l,param)	
			}
		}		
		return CIN
	}
	
	cape(ptop, pbot, param='iT'){
		let CAPE  = 0
		for (let l of this.layers(ptop, pbot, 'exact')){ 
			if (Layer.half(l,param)<0){
				CAPE += RD*Layer.deltaln(l,'p')*Layer.half(l,param)
			}
		}	
		return CAPE
	}
}	

/**
 * Utilities for layer operations.
 * Layer: list of two levels (object) in ascending pressure order
 */
class Layer{
	static half(l, param){
		return (l[0][param]+l[1][param])*0.5
	}
	
	static deltaln(l, param){
		return Math.log(l[0][param]/l[1][param])
	}
}

/**
 * https://github.com/wesbos/es6-articles/blob/master/54%20-%20Extending%20Arrays%20with%20Classes%20for%20Custom%20Collections.md
 */
class La extends Array{
	
	constructor(l){
		super(...l)
		//this.l = l
	}
	
	half(){
		return (this[0]+this[1])*0.5
	}
}





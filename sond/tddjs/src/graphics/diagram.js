/*! tdd.js - v1.0.0 - 2021-03-26
* Copyright (c) 2020 mgomezm@aemet.es; 
* 
* tdd
* */

//https://observablehq.com/@d3/d3v6-migration-guide

var info = {
	K : { name: 'Indice K (KI)'	},	
	LIFT : { name: 'Indice Lifted (LI)'	},
	LIFTv : { name: 'Indice Lifted (LIv)'	},
	LIFT7 : { name: 'Indice Lifted (LI7)'	},
	LIFT7v : { name: 'Indice Lifted (LI7v)'	},
	SHOW : { name: 'Indice Showalter (SHI)'	},
	TT : { name: 'Total de Totales (TT)'	},
	DTZ75 : { name: 'Gradiente Vertical de Temperatura 700-500 hPa'	},
	ISOC : { name: 'Isocero del seco   (ISOC)  '	},
	ISOW : { name: 'Isocero del humedo (ISOH)'	},
	COTANIE : { name: 'Cota de nieve (COTANIE)'	},
	PW : { name: 'Agua precipitable hasta 300 hPa (PW)'	},
	PW8 : { name: 'Agua precipitable SFC-850 (PW8)'	},
	PW7 : { name: 'Agua precipitable 850-700 (PW7)'	},
	PW5 : { name: 'Agua precipitable 700-500 (PW5)'	},
	
	MUCAPE : { name: 'CAPEv maxima por debajo de 350 hPa (MUCAPE)'	},	
	MUCIN : { name: 'CINv  de la burbuja mas inestable  (MUCIN)'	},	
	LPL : { name: 'Nivel en el que se obtiene el valor de mucape (LPL)'	},	
	HEFFTOP : { name: 'Capa Efectiva: altura Tope'	},	
	HEFFBAS : { name: 'Capa Efectiva: altura Base'	},	
	WSM06 : { name: 'Viento medio 0-6km'	},	
	WDM06 : { name: 'Dirección Viento medio 0-6km'	},
	BUNKERSLWS : { name: 'Viento Supercelula Bunkers LM'	},
	BUNKERSLWD : { name: 'Dirección Viento Supercelula Bunkers LM'	},
	BUNKERSRWS : { name: 'Viento Supercelula Bunkers RM'	},
	BUNKERSRWD : { name: 'Dirección Viento Supercelula Bunkers RM'	},	
	ciz08  : { name: 'Cizalladura 0-8km (CIZ8)'	},
	ciz06  : { name: 'Cizalladura 0-6km (CIZ6)'	},	
	ciz03  : { name: 'Cizalladura 0-3km (CIZ3)'	},	
	ciz01  : { name: 'Cizalladura 0-1km (CIZ1)'	},	
	cizE   : { name: 'Cizalladura efectiva (CIZE)'	},	
	SRHL1  : { name: 'Helicidad relativa a la tormenta (SRH) hacia la izquierda (LM) 0-1km'	},	
	SRHR1  : { name: 'Helicidad relativa a la tormenta (SRH) hacia la derecha   (RM) 0-1km'	},	
	SRHL3  : { name: 'Helicidad relativa a la tormenta (SRH) hacia la izquierda (LM) 0-3km'	},	
	SRHR3  : { name: 'Helicidad relativa a la tormenta (SRH) hacia la derecha   (RM) 0-3km'	},	
	SRHL13 : { name: 'Helicidad relativa a la tormenta (SRH) hacia la izquierda (LM) 1-3km'	},	
	SRHR13 : { name: 'Helicidad relativa a la tormenta (SRH) hacia la derecha   (RM) 1-3km'	},	
	SRHL6  : { name: 'Helicidad relativa a la tormenta (SRH) hacia la izquierda (LM) 0-6km'	},	
	SRHR6  : { name: 'Helicidad relativa a la tormenta (SRH) hacia la derecha   (RM) 0-6km'	},	
	ESRHL  : { name: 'Helicidad Efectiva relativa a la tormenta (ESRH) hacia la izquierda (LM)'	},	
	ESRHR  : { name: 'Helicidad Efectiva relativa a la tormenta (ESRH) hacia la derecha   (RM)'	},	
	SCP2L  : { name: 'Parametro Compuesto de Supercelulas (Thompson, 2004) hacia la izquierda (SCP2L)'	},	
	SCP2R  : { name: 'Parametro Compuesto de Supercelulas (Thompson, 2004) hacia la derecha   (SCP2R)'	},
	// Indices relativos a la cota de nieve	
	cotanie0 : { name: 'Cota de inicio de la fusion de la nieve (COTANIE0)',unit:'m'	},
	zs : { name: 'Altitud ',unit:'m'	},
	ip : { name: 'Intensidad de precipitacion (r)',unit:'mm/h'	},
	a : { name: 'Cota de nieve como funcion de r (COTANIE)',unit:'m'	},
	b : { name: 'Espesor de la capa de fusion',unit:'m'	},
	c : { name: 'Probabilidad de fusion de la nevada',unit:'%'	},
	d : { name: 'Area ',unit:''	},    
}    


// reference to load /doc/*html
var scripts   = document.getElementsByTagName("script")
var tddscript = scripts[scripts.length-1].src

/** 
 * Main Thermodynamic Diagram Class 
 * */
class TDD{

	// default dimensions
	default_height = 580 // default height
	height = 580 
	width  = 963 
	aratio = this.width/this.height 
	scale  = 1   
	dims = {
		diag: 	{
			create: true,
			aratio : 1,
			margin : {top: 10, right: 5, bottom: 20, left: 30}
		},
		hodo: {
			create: true,
			aratio : 1,
			margin : {top: 10, right: 5, bottom: 20, left: null}
		},
		wind: {
			create: true,
			aratio : 0.10,
			margin : {top: 10, right: 5, bottom: 20, left: 5}
		},
		lgnd: {
			create: true,
			aratio : 0.50,
			margin : {top: 10, right: 10, bottom: 20, left: 5}
		},
		info: {
			create: true,
			aratio: null,
			margin : {top: 10, right: 10, bottom: 20, left: 30}
		}
	}

	// default visualization
	lines = {
		'T'  : {id:'T',  name:'T',  visible:true,   tooltip:true ,  x:9, y:0},
		'Td' : {id:'Td', name:'Td', visible:true,   tooltip:false,  x:-35, y:0},
		'Tw' : {id:'Tw', name:'Tw', visible:true,   tooltip:false,  x:0, y:9},
		'Tv' : {id:'Tv', name:'Tv', visible:true,   tooltip:false,  x:9, y:9},
		'Te' : {id:'Te', name:'Te', visible:false,  tooltip:false,  x:9, y:0},
		'Tf' : {id:'Tf', name:'Tf', visible:false,  tooltip:false,  x:9, y:-9},
	}
	parcels = [0,30,60,100,'MU','X'] // parcel buttons
	parcel  = 60         // default parcel  	//parcelX = null  // user parcel
	lift    = 'TTv'      // default lift visualization T,Tv,TTv.
	cota    = 'COTANIE1' // default COTANIE1
		
	// sounding		
	s = null  
	loader = null
		
	/**
	 * Create a Thermodynamic Diagram Object
	 * @param {string} id - HTML id attribut
	 * @param {Object} options -
	 * @returns
	 */
	constructor(id, options={}){
		//console.log("======== TDD ========")
		
		// HTML id attribute
		this.id = "#" + id 
		this.elem = document.getElementById(id)
		
		// overwrite options
		for (let k in options){
			eval("this."+k+" = "+options[k]);
		}
		
		// block default dimensions
		this._block_dims(this.dims.diag)
		this._block_dims(this.dims.wind)
		this._block_dims(this.dims.lgnd)

		// tdd deafult dimensions
		this.width  = this.dims.diag.fullwidth + this.dims.wind.fullwidth + this.dims.lgnd.fullwidth
		this.aratio = this.width / this.height
    
        // geometry adjustment
        if ("height" in options && "width" in options){
            let twidth = this.aratio*options.height           
            if (twidth>options.width){
                this.width  = options.width
                this.height = this.width/this.aratio
                this.scale  = this.height/this.default_height
            } else {
                this.height = options.height
                this.scale  = this.height/this.default_height
                this.width  = this.aratio*this.height
            }
		} else if ("height" in options){
			this.height = options.height
			this.scale  = this.height/this.default_height
			this.width  = this.aratio*this.height
		} else if ("width" in options){
			this.width  = options.width
			this.height = this.width/this.aratio
			this.scale  = this.height/this.default_height
		}
		
        // block adjusted dimensions
        this._block_dims(this.dims.diag)
        this._block_dims(this.dims.wind)
        this._block_dims(this.dims.lgnd)
        
		this._build()		
		//this._trace()
	}
	
	_block_dims(block){
		block.fullheight = this.height
		block.height     = this.height  - block.margin.top  - block.margin.bottom
		block.width      = block.height * block.aratio
		block.fullwidth  = block.width  + block.margin.left + block.margin.right	
	}
	

	_trace(){
		console.log("TDD -", "width:", this.width, "height:", this.height, "aratio:", this.aratio, "scale:", this.scale)
	}
	
	
	/**
	 * Create svg object and different parts objects
	 */
	_build(){
		// main svg
		this.svg = d3.select(this.id).append("svg")
			.attr("width",  this.width)  
			.attr("height", this.height) 
			.attr("display", "block") // matches parent div height
			.attr("class", "svgtdd")
			
		// background
		this.svg.append('rect')
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("fill", "lightgrey")				
		// log
		this.log = this.svg.append('g').attr("id", "logtext")
			
		// objects
		let x_diag = 0
		let x_wind = this.dims.diag.fullwidth
		let x_lgnd = this.dims.diag.fullwidth + this.dims.wind.fullwidth 
		let x_hodo = this.dims.diag.fullwidth
		let x_info = 0
		this.diag = new Skewt      (this, x_diag, this.dims.diag, this.scale)
		this.wind = new WindDiagram(this, x_wind, this.dims.wind, this.scale)
		this.lgnd = new Legend     (this, x_lgnd, this.dims.lgnd, this.scale)
		this.hodo = new Hodograph  (this, x_hodo, this.dims.hodo, this.scale)
		this.info = new InfoWindow (this, x_info, this.dims.info, this.scale) 
			
		// loader object
        this.loader = new Loaderd3({width: 50, height: 50, x: 70, y: 50, container: ".svgtdd", id: "loadertdd"})
        
        // hide bottom-left corner
/*        this.svg.append('rect')
            .attr("x", 0)
            .attr("y", this.height - this.dims.diag.margin.bottom)
            .attr("width", this.dims.diag.margin.left)
            .attr("height", this.dims.diag.margin.bottom)
            .attr("fill", "lightgrey")*/
	}
	
	
	load(model, index, date, run, step){
		this.loadtime = null
		this.calctime = null
		this.loadstart = performance.now()
        this.loader.start() // show loader
		query_model(model, index, date, run, step, this.calc_sounding.bind(this))		
	}	
	
	load_json(file){
		this.loadtime = null
		this.calctime = null
		this.rendtime = null
		this.loadstart = performance.now()
        this.loader.start() // show loader
		query_json(file, this.calc_sounding.bind(this))		
	}	
	
	load_test(){
		query_table(this.calc_sounding.bind(this))	
	}
	
	calc_sounding(sond){
        this.loader.stop() // hide loader
		this.loadtime = performance.now() - this.loadstart

		if ("ERROR" in sond) {
			console.log(sond)
			this.s = null
			this.error(sond['ERROR'])
			return
		}
        
        if (sond.data.length==0){
            console.log(sond)
            this.s = null
            this.error("Error: No hay datos para esta petición")
            return
        }
        
		// sounding
		let t0 = performance.now()
		this.s = new Sounding(sond.data, sond.meta)
		this.s.start()
		this.s.COTA = this.s.COTANIE[this.cota]
		this.calctime = performance.now() - t0
		this.plot()
	}
	
	
	/**
	 * First plot
	 */
	plot(){
		let t0 = performance.now()
		this.clear()
		
		for (let l of Object.values(this.lines)){
			this.diag.line(this.s.data, l.name)
			if (l.visible==false){ 
				l.visible=true
				this.lgnd.line_change(l)
			}
			if (l.tooltip==false){ 
				l.tooltip=true
				this.lgnd.tool_change(l)
			}
		}	

		this.lgnd.lift_change(this.lift) // set controls, plot parcel, plot info
        this.diag.plot_ground()
        this.diag.plot_insthw()
        this.hodo.plot()
        this.wind.plot()
        this.rendtime = performance.now() - t0
        this._log()
	}
	
	
	_log(){
		let total = this.loadtime + this.calctime + this.rendtime
		let t = "datos:" + rnd(this.loadtime,0) + ", cálculo:" + rnd(this.calctime,0) + ", render:"  + rnd(this.rendtime,0) + ", total:" + rnd(total,0) +  " ms"
		//console.log(t)
		this.log.html(null)
		this.log.append("text")
	    	.attr("id", "logtext")
			.attr("x", this.width - this.lgnd.width)
			.attr("y", this.height - 8)
			.text(t)
//		.attr("dy", ".3em")
//		.attr("dx", "-.2em")
			.attr("fill", "#585858")
			.style("font-size", 10 + "px") 
	}
	
	
	error(error){
		this.clear()
		this.lgnd.error(error)
	}
	
	
	clear(){
		this.diag.clear()
		this.wind.clear()
		this.lgnd.clear()
		this.hodo.clear()
	}
	
	
	destroy(){
		this.s = null
		this.svg.html(null)
		d3.select("svg").remove();
	}
}



/**
 * Common base class for TDD parts
 */
class AbstractDiagram {
	

	/**
	 * Create a diagram object
	 * @param {Object} tdd - Main diagram object 
	 * @param {number} start - Reference x position in the main tdd object
	 * @param {number} aratio - Aspect ratio 
	 * @param {Object} margin - Margins
	 * @param {number} scale - Scale to apply to some elements like fontsize.
	 * @returns
	 */
	constructor(tdd, start, dims, scale){
		this.tdd    = tdd
		this.start  = start
		this.aratio = dims.aratio
		this.margin = dims.margin
		this.scale  = scale
	}
	
	/** */
	_trace(){
		console.log(this.constructor.name, "- width:",this.width, "height:",this.height, "full width:",this.fullwidth, "full height:",this.fullheight)
	}
	
	/** Set up the object dimensions */
	_dims(){}
	
	/** */
	_build(){}
	
	/** */
	plot(){}
	
	/** */
	clear(){}
}


/**
 * InfoWindow class
 */
class InfoWindow extends AbstractDiagram {
	
	fontsize = 14
	
	constructor(tdd, start, aratio, margin=null, scale=1){
		super(tdd, start, aratio, margin, scale)
		this._dims()
		this._build()
		//this._trace()
	}	
	
	_dims(){
		this.fontsize   = this.fontsize * this.scale 
		this.height     = this.tdd.height - this.margin.top  - this.margin.bottom
		this.width      = this.tdd.width  - this.margin.left - this.margin.right
		this.fullheight = this.tdd.height
		this.fullwidth  = this.width + this.margin.left + this.margin.right  
	}
	
	_build(){
		this.main = this.tdd.svg.append("g") 
			.attr("id", "infowindow")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
	}
	
	load(param){
		param = param.trim()
		//console.log(tddscript)
		let url = "doc/"+param+".html"
        let img = "doc/img/"+param+".bmp"
		// dev
		if (tddscript.includes('diagram.js')){
			url = "doc/"+param+".html"
		// merged lib as used in panel
		} else if (tddscript.includes('tdd.js')){
			url = tddscript.replace('tdd.js', '') + "doc/"+param+".html"
            img = tddscript.replace('tdd.js', '') + "doc/img/"+param+".bmp"
		}

	    fetch(url).then((response) => {
		  if (response.ok) return response.text()
		  else             throw new Error('Something went wrong')
		})
	    .catch(error => {console.log('Error:', error); return Promise.reject()})
	    .then(response => {
	    	
		    this.main.append('rect')                       
		    	.attr('x', 0).attr('y', 0)
		    	.attr('width', this.width)
		    	.attr('height', this.height)
		    	.attr("class", "mediumline")
		    	.style('fill', 'white')
		
		    this.main.append("g").attr("id", "infobox").append("foreignObject")
		    	.attr("width", this.width)
		    	.attr("height", this.height)
                .style("overflow-y", "auto")
		    	.append("xhtml:div")
    		    	.style("margin", "10px")
    		    	.style("font-size", this.fontsize+"px")
    		    	.html(response);
		
			MathJax.typeset()
            
            d3.select(".closetdd").on("click", (function(){ this.clear()}).bind(this))
            
            // change path to img
            if (d3.select(".infowindowimg").empty()==false){
                d3.select(".infowindowimg").attr('src', img)
            }
	    });
	}
	
	clear(){ 
		this.main.html(null)
	}
}


/** 
 * Hodograph diagram class 
 * Locates the hodograph in the top right corner of the thermodynamic diagram.
 * Offers zoom options with "+" and "-" buttons. (full size, 1/3 size, none)
 * */
class Hodograph extends AbstractDiagram {
	
	aratio   = 1     // aspect ratio
	dratio   = 1/3   // default size compared with the thermodynamic diagram
	fontdef  = 7     // default fontsize
	fontsize = 7     // adjusted fontsize depending on dratio
	bsize    = 15    // button size 
	circles  = 10    // draw circles and labels (only in 3rd quadrant) every "circles" (kt)
	maxw     = 60    // max value (kt)
	maxh     = 8000  // max height above ground (m)
	htags    = [.5,1,2,3,4,5,6,7,8] // height above ground tags (km)
	// segment colors (some are repeated in order to match htags length, and use utag and vtag information from sounding)
	hlimits = [0,        500,      1000,     2000,     3000,     4000,     5000,     6000,     7000,     8000     ] // 10000,    12000    ]
	hcolors = ['#FF0000','#008000','#0000FF','#0000FF','#CC8000','#CC8000','#FF00FF','#D0C080','#D0C080','#808000'] //,'#555555','#AAAAAA']	

	
	constructor(tdd, start, aratio, margin=null, scale=1){
		super(tdd, start, aratio, margin, scale)
		this._dims()
		this._build()
		//this._trace()
	}	

	
	_dims(){
		this.fontsize = (4.5*this.dratio+5.5)*this.scale // adjust fontsize: 7->1/3, 10->1 dratio
		this.height   = (this.tdd.height - this.margin.top - this.margin.bottom) * this.dratio
		this.width    = this.aratio * this.height
		this.fullheight = this.height
		this.fullwidth  = this.width
		// min size for buttons
		if (this.height==0) this.height = this.fullheight = this.bsize
		if (this.width==0)  this.width  = this.fullwidth  = this.bsize
	}
	
	
	/** Delete every svg element */
	_destroy(){	this.main.html(null) }
	
	
	/** Create the main elements structure */
	_build(){
		
		// main element
		if (!(this.main)){
			this.main = this.tdd.svg.append("g").attr("id", "hodo")
		}		
		this.main.attr("transform", "translate(" +  (this.start - this.width - this.margin.right) + "," + this.margin.top + ")");
		
		// background		
		this.main.append('rect')                       
	    	.attr('x', 0).attr('y', 0)
	    	.attr('width',  this.width)
	    	.attr('height', this.height)
	    	.attr("class", "mediumline")
	    	.style('fill', 'white')
	    	
	    // clip
		this.aux = this.main.append('g').attr("id", "auxhodo")	   
		this.clip = this.aux.append("clipPath")
			.attr("id", "cliphodo")
			.append("rect")
			.attr("width",  this.width )
			.attr("height", this.height )
			.attr("x", 0)
			.attr("y", 0);

		// axes
	    this._axes()
		
		// front group
		this.ft = this.main.append("g").attr("id", "hodoft").attr("clip-path", "url(#cliphodo)")
		this.hodocircle = this.ft.append('g').attr('id', 'hodocircles')
		this.hodoline   = this.ft.append("g").attr("id", "hodoline")
		this.bunkers    = this.ft.append("g").attr("id", "bunkers")
		this.lareas     = this.ft.append("g").attr("id", "lhodoareas")
		this.rareas     = this.ft.append("g").attr("id", "rhodoareas")
		this.buttons    = this.ft.append("g").attr("id", "hodobuttons")
		
		// buttons
		this._buttons()
	}
	
	
	/*
	 * Creates scales and axes
	 */
	_axes(){
		// axes group
		this.axes = this.main.append('g').attr("id", "hodoaxes")

		// u
		this.x = d3.scaleLinear()
			.range([0, this.width])
			.domain([-this.maxw, this.maxw])

		this.ax = d3.axisBottom(this.x)
			.tickSize(0)
			.ticks(0)

		this.axx = this.axes.append('g')
			.attr("transform", "translate(0," + this.height/2 + ")")
			.call(this.ax)
		
		// v
		this.y = d3.scaleLinear()
			.range([0, this.height])
			.domain([this.maxw, -this.maxw])

		this.ay = d3.axisLeft(this.y)
			.tickSize(0)
			.ticks(0)
		
		this.ayy = this.axes.append('g')
			.attr("transform", "translate(" + this.width/2 + ",0)") 
			.call(this.ay);
	}
	
	
	clear(){
		this.hodocircle.html(null)
		this.hodoline.html(null)
		this.bunkers.html(null)
		this.lareas.html(null)
		this.rareas.html(null)
	}

	
	_buttons(){
		
		// dec
		//this.dec = this.ft.append("g").attr("id", "hododec")
		this.buttons.append("text")
		    .attr("id", "hododectext")
			.attr("x", this.width-this.bsize/2)
			.attr("y", this.bsize/2)
			.text('-')
			.attr("dy", ".3em")
			.attr("dx", "-.2em")
			.attr("fill", "grey")
			.style("font-size", this.fontdef*2) 
		
		this.buttons.append("rect")
			.attr("id", "hododec")
			.attr("width", this.bsize)
			.attr("height", this.bsize)
			.attr("x", this.width-this.bsize)
			.attr("y", 0)
			.attr("class", "hodocircle")
			.style("pointer-events", "all")

		// inc
		this.buttons.append("text")
			.attr("x", this.bsize/2)
			.attr("y", this.height-this.bsize/2)
			.text('+')
			.attr("dy", ".3em")
			.attr("dx", "-.3em")
			.attr("fill", "grey")
			.style("font-size", this.fontdef*2) 
			
		this.buttons.append("rect")
			.attr("id", "hodoinc")	
			.attr("width",  this.bsize)
			.attr("height", this.bsize)
			.attr("x", 0)
			.attr("y", this.height-this.bsize)
			.attr("class", "hodocircle")
			.style("pointer-events", "all")

		// events
		d3.select('#hodoinc').on("click", (function(d){	this._inc()	}).bind(this))
		d3.select('#hododec').on("click", (function(d){	this._dec()	}).bind(this))
	}
	
	_inc(){
		if      (this.dratio==0)   this.dratio=1/3
		else if (this.dratio==1/3) this.dratio=1
		else                           return
		this._dims()
		this._destroy()
		this._build()
		this.plot()
	}

	_dec(){
		if (this.dratio==1)   {
			this.dratio=1/3
			this._dims()
			this._destroy()
			this._build()
			this.plot()
		}
		else if (this.dratio==1/3) {
			this.dratio=0
			this._dims()
			this._destroy()
			this._build()
			//this._buttons()
			this.axes.remove()
			d3.select('#hododec').remove()
			d3.select('#hododectext').remove()
		}
		else                           return
	}
	
	plot(){

		this.clear()
		
		let s = this.tdd.s
		
		// adjust axis 
		this.fit_to_data(true)
		
		// 
		for (let i=10; i<=this.currmaxw; i+=10){
			this.hodocircle.append('circle')
		    	.style("stroke", "gray")
		    	.style("fill", "none")
		    	.attr("class", "hodocircle")
			    .attr('r',  d=>this.x(i)-this.x(0))
			    .attr('cx', d=>this.x(0))
			    .attr('cy', d=>this.y(0)) //this.height/2)
			    
			this.hodocircle.append("text")
				.attr("x", this.x(-i*0.7071))
				.attr("y", this.y(-i*0.7071))
				.text(i)
				.attr("dy", ".3em")
				.attr("dx", "-.3em")
			    //.attr("fill", "red")
				.style("font-size", this.fontsize + "px")   
			    
		}
		
		// circles
		this.hodocircle.selectAll('.circle')
		    .data(this.circles)
		    .enter().append('circle')
		    	.style("stroke", "gray")
		    	.style("fill", "none")
		    	.attr("class", "hodocircle")
			    .attr('r',  d=>this.x(d)-this.x(0))
			    .attr('cx', d=>this.x(0))
			    .attr('cy', d=>this.y(0)) //this.height/2)
		
		// wind: diferent colors
	    for (let i=1; i<this.hlimits.length; i ++){
	    	let toplimit = this.hlimits[i]
	    	let botlimit = this.hlimits[i-1]
	    	let color    = this.hcolors[i-1]
	    	
	    	// add levels at exact height
	    	let tract = [s.data.filter(d=>(d.zg>=botlimit) && (d.zg<=toplimit))]
	    	tract[0].unshift({u:s.utags[i-1],v:s.vtags[i-1],zg:toplimit})
	    	if (i>1) tract[0].push({u:s.utags[i-2],v:s.vtags[i-2],zg:botlimit})
	    		    	
			this.hodoline.append("path")
				.data(tract)
				.attr("d", d3.line()
					.x(d => this.x(d.u*MKNOT) ) 
					.y(d => this.y(d.v*MKNOT) )
				)
				.attr("class", "windline")
				.style("stroke", color)
	    }
			
		// height tags
		for (let i in this.htags){
			let u = s.utags[i]*MKNOT
			let v = s.vtags[i]*MKNOT
			let t = this.htags[i]
			this.hodoline.append("text")
				.attr("x", this.x(u))
				.attr("y", this.y(v))
				.text(t)
                .style("font-size", this.fontsize + "px")  
		}
			
		// bunkers
		// LM point
		this.bunkers.append("circle")
			.attr("cx", this.x(s.BUNKERSLU*MKNOT))
			.attr("cy", this.y(s.BUNKERSLV*MKNOT))
			.attr("fill", "red")
		 	.attr("r", 2);
		// LM tag
		this.bunkers.append("text")
			.attr("x", this.x(s.BUNKERSLU*MKNOT))
			.attr("y", this.y(s.BUNKERSLV*MKNOT))
			.text("LM")
			.attr("dy", "-.30em")
		    .attr("fill", "red")
		    .style("font-size", this.fontsize + "px") 	
		// RM point
		this.bunkers.append("circle")
			.attr("cx", this.x(s.BUNKERSRU*MKNOT))
			.attr("cy", this.y(s.BUNKERSRV*MKNOT))
			.attr("fill", "green")
		 	.attr("r", 2);
		// RM tag	
		this.bunkers.append("text")
			.attr("x", this.x(s.BUNKERSRU*MKNOT))
			.attr("y", this.y(s.BUNKERSRV*MKNOT))
			.text("LR")
			.attr("dy", "-.30em")
		    .attr("fill", "green")
		    .style("font-size", this.fontsize + "px")
	    // Mid point LM-RM
		this.bunkers.append("circle")
			.attr("cx", this.x((s.BUNKERSRU*MKNOT+s.BUNKERSLU*MKNOT)*0.5))
			.attr("cy", this.y((s.BUNKERSRV*MKNOT+s.BUNKERSLV*MKNOT)*0.5))
			.attr("fill", "none")
			.attr("stroke", "black")
			.attr("stroke-width", "1")
		 	.attr("r", 2);    
	    // line
		this.bunkers.append("line")
			.attr("x1", this.x(s.BUNKERSRU*MKNOT))
			.attr("x2", this.x(s.BUNKERSLU*MKNOT))
			.attr("y1", this.y(s.BUNKERSRV*MKNOT))
			.attr("y2", this.y(s.BUNKERSLV*MKNOT))
			.attr("class", "bunkersline");
		// shear 05-56
		this.bunkers.append("line")
			.attr("x1", this.x(s.um005*MKNOT))
			.attr("x2", this.x(s.um556*MKNOT))
			.attr("y1", this.y(s.vm005*MKNOT))
			.attr("y2", this.y(s.vm556*MKNOT))
			.attr("class", "bunkersline");

	}
	
	
	fit_to_data(fit=true){
		let data = this.tdd.s.data.filter(d=>d.zg<8000)
		this.currmaxw = this.maxw
		if (fit==true){
			// find max value
			let maxu = d3.max(data, d=>Math.abs(d.u*MKNOT)) 
			let maxv = d3.max(data, d=>Math.abs(d.v*MKNOT))
			let max  = Math.max(maxu, maxv)
			this.currmaxw = (Math.floor(max/10)+1)*10
		}
		// update axis
		this.x.domain([-this.currmaxw,this.currmaxw])
		this.y.domain([this.currmaxw,-this.currmaxw])
		this.axx.call(this.ax.scale(this.x))
		this.ayy.call(this.ay.scale(this.y))	
	}	
}



class WindDiagram extends AbstractDiagram{
		
	barbsize = 25 
	barbnumb = 30    // maximum number of vertical barbs shown
	ptop     = 100   // default top pressure [hPa]   
	pbot     = 1050  // default bottom pressure [hPa]
	newpbot  = this.pbot // bottom pressure when zooming
	
	constructor(tdd, start, dims, scale){
		super(tdd, start, dims, scale)
		// geometry
		//this.barbsize = this.barbsize*this.scale
		this.height = dims.height 
		this.width  = dims.width 
		this.fullheight = dims.fullheight
		this.fullwidth  = dims.fullwidth
		// build
		this._build()
		//this._trace()
	}
	
	_build(){
		
		// main element
		this.main = this.tdd.svg.append("g") 
			.attr("id",    "wind")
			.attr("transform", "translate(" +  (this.start + this.margin.left) + "," + this.margin.top + ")");
		
		// background		
		this.main.append('rect')                       
	    	.attr('x', 0).attr('y', 0)
	    	.attr('width', this.width)
	    	.attr('height', this.height)
	    	.attr("class", "mediumline")
	    	.style('fill', 'white')
	    	
	    // clip
		this.aux = this.main.append('g').attr("id", "auxwind")	   
		this.clip = this.aux.append("clipPath")
			.attr("id", "clipwind")
			.append("rect")
			.attr("width", this.width )
			.attr("height", this.height )
			.attr("x", 0)
			.attr("y", 0);
	    	
		// groups
	    this.hrline  = this.main.append("g")
			.attr("class", "hrline")
			.attr("clip-path", "url(#clipwind)")
		
		this.barbs  = this.main.append("g")
			.attr("class", "windbarb") // put barbs in this group	
			.attr("clip-path", "url(#clipwind)")
		
		// axes
	    this._axes()
	    
		this._barb_templates()
	}
	

	/**
	 * Filter levels for barb ploting. 
	 * @param {number} n - number of visible levels
	 * @param {Object} s - sounding 
	 * @returns
	 */
	_filter(n, s){
		let pbot = this.newY.domain()[0]
		let ptop = this.newY.domain()[1]
		let lnt  = Math.log(ptop)
		let lnb  = Math.log(pbot)
		let inc  = (lnb-lnt)/(n-1)
		let data = []
		let lvls = [] // keep track of exiting levels
		for (let i in d3.range(n)){
			let lnp = lnt+i*inc
			let d = s.closest(Math.exp(lnp))
			if (lvls.includes(d.p)) continue
			lvls.push(d.p)
			data.push(d)
		}
		return data
	}
	
	clear(){
		this.hrline.html(null)
		this.barbs.html(null)
	}
	
	plot(){
		
		this.clear()
		
		let s = this.tdd.s
		//barbs stuff
		// note: transform rotation in same direction as meteorological wind direction.
		let barbs = this._filter(this.barbnumb, s).filter(d => ( d.wS >= 0 && d.p >= s.top.p) ); // && d.wD >= 0
		this.barbs.selectAll("barbs")
			.data(barbs).enter().append("use")
			.attr("xlink:href", d => "#barb"+Math.round(convert_wind(d.wS,'kt')/5)*5 ) // 0,5,10,15,... always in kt
			.attr("transform",  d => "translate("+this.width/2+","+this.newY(d.p)+") rotate("+(math2met(d.wD*RAD2DEG)-180)+") scale(0.75)" ) // Because of barb definition: 0 rotation == South wind, so subtract 180
		// hr
		this.hrline.append("path")
			.data([s.data])
			.attr("d", d3.line()
				.x(d => this.x((d.r/d.rw)*100) ) 
				.y(d => this.newY(d.p) )
				.curve(d3.curveLinear)
			)
	}

	_barb_templates(){
		let barbdef = this.main.append('defs')
		let speeds = d3.range(5,175,5);
		let that = this
		speeds.forEach(function(d) {
			var thisbarb = barbdef.append('g').attr('id', 'barb'+d);
			var flags = Math.floor(d/50);
			var pennants = Math.floor((d - flags*50)/10);
			var halfpennants = Math.floor((d - flags*50 - pennants*10)/5);
			var px = that.barbsize;
			//console.log(d, flags, pennants, halfpennants)
			// 5kt offset
			if (flags==0 && pennants==0 && halfpennants==1){ px -= 3 }
			// Draw wind barb stems
			thisbarb.append("line").attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", that.barbsize);
			// Draw wind barb flags and pennants for each stem
			for (var i=0; i<flags; i++) {
				thisbarb.append("polyline")
					.attr("points", "0,"+px+" -10,"+(px)+" 0,"+(px-4))
					.attr("class", "flag");
				px -= 7;
			}
			// Draw pennants on each barb
			for (i=0; i<pennants; i++) {
				thisbarb.append("line")
					.attr("x1", 0)
					.attr("x2", -10)
					.attr("y1", px)
					.attr("y2", px+4)
				px -= 3;
			}
			// Draw half-pennants on each barb
			for (i=0; i<halfpennants; i++) {
				thisbarb.append("line")
					.attr("x1", 0)
					.attr("x2", -5)
					.attr("y1", px)
					.attr("y2", px+2)
				px -= 3;
			}
		});		
		// 0
		barbdef.append('g').attr('id', 'barb0').append("circle").attr("r", 4);
	}
	
	
	_zoomed(newY, trans){
		
		//let aaa = trans.rescaleY(this.y);
		this.newY = newY
		this.ayy.call(this.ay.scale(this.newY))
		
		this.plot()
	}
	
	/*
	 * Creates scales and axes
	 */
	_axes(){
		// axes group
		this.axes = this.main.append('g').attr("id", "axes")

		// pressure
		this.y = d3.scaleLog()
			.range([0, this.height])
			.domain([this.ptop, this.pbot]);
		this.newY = this.y // used in tooltips
		
		this.ay = d3.axisLeft(this.y)
			.tickSize(0,0)
			.ticks(0)
		
		this.ayy = this.axes.append('g')
			.call(this.ay);
	
		// hr
		this.x = d3.scaleLinear()
			.range([0, this.width])
			.domain([0, 100])

		this.ax = d3.axisBottom(this.x)
			.ticks(2)
			.tickSize(0,0)

		this.axx = this.axes.append('g')
			.attr("transform", "translate(0," + this.height + ")") // move the axis down
			.call(this.ax);
	}
}


class Legend extends AbstractDiagram {
	
	fval = "DD/MM/YYYY HH" // date format for run
	frun = "DD/MM/YYYY HH" // date format for day
	fonttitle = 16.0       // title font-size
	fonttable = 11.1 //10.8       // table font-size
	op = 0.3               // button opacity when deactivated	
	
	
	constructor(tdd, start, dims, scale){
		super(tdd, start, dims, scale)
		// geometry
		this.height = dims.height 
		this.width  = dims.width 
		this.fullheight = dims.fullheight
		this.fullwidth  = dims.fullwidth
		this.lines   = tdd.lines
		this.parcels = tdd.parcels
		// scale
		this.fonttitle = this.fonttitle * this.scale
		this.fonttable = this.fonttable * this.scale
		// build
		this._build()
		//this._trace()
	}
	
	
	_build(){

		// main element
		this.main = this.tdd.svg.append("g") 
			.attr("id", "lgnd")
			.attr("transform", "translate(" +  (this.start + this.margin.left) + "," + this.margin.top + ")");
	
		// background		
		this.main.append('rect')                       
	    	.attr('x', 0).attr('y', 0)
	    	.attr('width', this.width)
	    	.attr('height', this.height)
	    	.attr('fill', 'white')
	    	.attr('stroke','black')
	    	.attr('stroke-width', '1')
	    	
	    // html
	    this.main.append('g').attr("id", "legendgroup").append("foreignObject")
	    	.attr("width", this.width)
	    	.attr("height", this.height)
	    	.append("xhtml:body")
	    	.style("font-size", this.fonttable+"px")
	    	.style("margin", "2px")
	    	.attr("id", "foreinglegend")
	    	.html('<div id="infolegendgroup"></div><div id="ctrllegendgroup"></div>');	    	
	    	
	    this.info = d3.select('#infolegendgroup')
	    this.ctrl = d3.select('#ctrllegendgroup')
		
	    this._add_controls()
	}	

	
	plot(){
		this._add_table()
	}
	
	
	error(error=null){
		let title = '<span class="titlelegend" style="word-break: break-all; white-space: normal; font-size : '+this.fonttitle+'px">'
		if (error) title += error
		else title       += 'Error'
		title += '</span>'
		this.info.html(title)			
	}

	
	_add_table(){
		// clear group
		this.info.html(null)
		
		let s  = this.tdd.s                          // sounding
		let ad = this.tdd.s.parcels[this.tdd.parcel] // std parcel
		let as = this.tdd.s.parcels[0]               // SFC parcel
		let am = this.tdd.s.parcels['MU']            // MU parcel

		//s.COTA = s.COTANIE[this.tdd.cota]
		
		// title
		let run = moment.utc(s.date, "YYYY/MM/DD")
		run.add(s.run, 'hours')
		let val = run.clone().add(parseInt(s.step), 'hours')
		let title = '<span class="titlelegend" style="font-size : '+this.fonttitle+'px">'
        if (s.name) {title += s.name+'<br>'} 
		title += (s.lat).toFixed(2)+"  "+(s.lon).toFixed(2)+"  zs "+s.zs.toFixed(1)+" m"
		title += '<br>' + run.format(this.frun)+" UTC. H+"+s.step
		title += '<br>' + val.format(this.fval)+" UTC. "+s.model
		title += '</span>'

		// indexes 
		let t = '<table class="tablelegend" id="tableindexinstability">'
		t += '<tr           ><td colspan="3"><b>Índices de inestabilidad</b></td></tr>'
		t += '<tr class="ri"><td>K         </td><td class="tdr" colspan="2">'+round(s, 'K', 1)+'</td><td>   </td></tr>'
		t += '<tr class="ri"><td>SHOW      </td><td class="tdr" colspan="2">'+round(s, 'SHOW', 1)+'</td></tr>'
		t += '<tr class="ri"><td>TT        </td><td class="tdr" colspan="2">'+round(s, 'TT', 1)+'</td></tr>'
		t += '<tr class="ri"><td>ISOC      </td><td class="tdr" colspan="2">'+round(s, 'ISOC',0)+'</td></tr>'
		t += '<tr class="ri"><td>ISOW      </td><td class="tdr" colspan="2">'+round(s, 'ISOW',0)+'</td></tr>'
		t += '<tr class="ri"><td>COTANIE   </td><td class="tdr" colspan="2">'+round(s, 'COTA', 0)+'</td></tr>'
		t += '<tr class="ri"><td data-param="PW">PW sfc-300</td><td class="tdr" colspan="2">'+round(s, 'PW',  1)+'</td></tr>'
		t += '<tr class="ri"><td data-param="PW">PW 700-500</td><td class="tdr" colspan="2">'+round(s, 'PW5', 1)+'</td></tr>'
		t += '<tr class="ri"><td data-param="PW">PW 850-700</td><td class="tdr" colspan="2">'+round(s, 'PW7', 1)+'</td></tr>'
		t += '<tr class="ri"><td data-param="PW">PW sfc-850</td><td class="tdr" colspan="2">'+round(s, 'PW8', 1)+'</td></tr>'
		t += '<tr           ><td colspan="3"><b>Índices cinemáticos</b></td></tr>'
		t += '<tr class="ri"><td data-param="CIZ">CIZ08     </td><td class="tdr" colspan="2">'+round(s, 'CIZ08', 1, MKNOT)+'</td></tr>'
		t += '<tr class="ri"><td data-param="CIZ">CIZ06     </td><td class="tdr" colspan="2">'+round(s, 'CIZ06', 1, MKNOT)+'</td></tr>'
		t += '<tr class="ri"><td data-param="CIZ">CIZ03     </td><td class="tdr" colspan="2">'+round(s, 'CIZ03', 1, MKNOT)+'</td></tr>'
		t += '<tr class="ri"><td data-param="CIZ">CIZ01     </td><td class="tdr" colspan="2">'+round(s, 'CIZ01', 1, MKNOT)+'</td></tr>'
		t += '<tr class="ri"><td>CIZE      </td><td class="tdr" colspan="2">'+round(s, 'CIZE',  1, MKNOT)+'</td></tr>'
		t += '<tr class="ri"><td data-param="MEAN">MEAN W06  </td><td class="tdr" colspan="2">'+round(s, 'WSM06', 1, MKNOT)+'/'+rnd(math2met(s.WDM06),0)+'</td></tr>'
		t += '<tr class="ri"><td data-param="HEFF">HEFFTOP   </td><td class="tdr" colspan="2">'+round(s, 'HEFFTOP', 1)+'</td></tr>'
		t += '<tr class="ri"><td data-param="HEFF">HEFFBAS   </td><td class="tdr" colspan="2">'+round(s, 'HEFFBAS', 1)+'</td></tr>'
		
        // supercell and tornados (only virtual parcel for parameters BRN,VGP,STP2,EHI1,EHI3)
		t += '<tr ><td data-param="sc_title" colspan="3"><b>Supercélulas y tornados</b></td></tr>'
		t += '<tr class="ri"><td>BRN   </td><td class="tdr" colspan="2">'+round(ad, 'BRNv',  1)+'</td></tr>'
		t += '<tr class="ri"><td>VGP   </td><td class="tdr" colspan="2">'+round(ad, 'VGPv',  2)+'</td></tr>'		
		t += '<tr><td>      </td><td class="tdr2">Izq.                    </td><td class="tdr2">Dch.                     </td></tr>'
		t += '<tr class="ri"><td>BUNK  </td><td class="tdr2">'+round(s, 'BUNKERSLWS', 1, MKNOT)+'/'+rnd(math2met(s.BUNKERSLWD),0)+'<td class="tdr2">'+round(s, 'BUNKERSRWS', 1, MKNOT)+'/'+rnd(math2met(s.BUNKERSRWD),0)+'</td></tr>'
		t += '<tr class="ri"><td data-param="SRH">SRH 1 </td><td class="tdr2">'+round(s, 'SRHL1',   1)+'</td><td class="tdr2">'+round(s, 'SRHR1',   1)+'</td></tr>'
		t += '<tr class="ri"><td data-param="SRH">SRH 3 </td><td class="tdr2">'+round(s, 'SRHL3',   1)+'</td><td class="tdr2">'+round(s, 'SRHR3',   1)+'</td></tr>'
		t += '<tr class="ri"><td>ESRH  </td><td class="tdr2">'+round(s, 'ESRHL',   1)+'</td><td class="tdr2">'+round(s, 'ESRHR',   1)+'</td></tr>'
		t += '<tr class="ri"><td>SCP   </td><td class="tdr2">'+round(s, 'SCP2L',   1)+'</td><td class="tdr2">'+round(s, 'SCP2R',   1)+'</td></tr>'
		t += '<tr class="ri"><td>STP   </td><td class="tdr2">'+round(ad, 'STP2Lv', 1)+'</td><td class="tdr2">'+round(ad, 'STP2Rv', 1)+'</td></tr>'
		t += '<tr class="ri"><td data-param="EHI">EHI1  </td><td class="tdr2">'+round(ad, 'EHIL1v', 1)+'</td><td class="tdr2">'+round(ad, 'EHIR1v', 1)+'</td></tr>'
		t += '<tr class="ri"><td data-param="EHI">EHI3  </td><td class="tdr2">'+round(ad, 'EHIL3v', 1)+'</td><td class="tdr2">'+round(ad, 'EHIR3v', 1)+'</td></tr>'
		t += '</table>'				
			
		// parcel
		let tp = '<table class="tablelegend">'
		tp += '<tr><td colspan="5"><b>Análisis de la burbuja</b></td></tr>'
		tp += '<tr><td>      </td><td class="tdr" colspan="2">Normal</td><td class="tdr" colspan="2">Virtual</td></tr>'
		tp += '<tr class="ri"><td data-param="TD">Td    </td><td class="tdr" colspan="2">'+round(ad, 'Td0', 1)      +'</td></tr>'
		tp += '<tr class="ri"><td data-param="TH">&Theta;   </td><td class="tdr" colspan="2">'+round(ad, 'TH', 1)      +'</td></tr>'
		tp += '<tr class="ri"><td>MIX   </td><td class="tdr" colspan="2">'+round(ad, 'r0', 1, 1000)+'</td></tr>'
		tp += '<tr class="ri"><td data-param="THE">&Theta;e </td><td class="tdr" colspan="2">'+round(ad, 'THE',   1)   +'</td></tr>'
		tp += '<tr class="ri"><td>TCC   </td><td class="tdr" colspan="2">'+round(ad, 'CCT',   1)+'</td><td class="tdr" colspan="2">'+round(ad, 'CCTv',   1)+'</td></tr>'
		tp += '<tr class="ri"><td>TDIS  </td><td class="tdr" colspan="2">'+round(ad, 'CT',    1)+'</td><td class="tdr" colspan="2">'+round(ad, 'CTv',    1)+'</td></tr>'
		tp += '<tr class="ri"><td>TNCA  </td><td class="tdr" colspan="2">'+round(ad, 'TLCL',  1)+'</td><td class="tdr" colspan="2">'+round(ad, 'TLCLv',  1)+'</td></tr>'
		tp += '<tr class="ri"><td>NE    </td><td class="tdr" colspan="2">'+round(ad, 'zEL',   0)+'</td><td class="tdr" colspan="2">'+round(ad, 'zELv',   0)+'</td></tr>'
		tp += '<tr class="ri"><td>NCL   </td><td class="tdr" colspan="2">'+round(ad, 'zLFC',  0)+'</td><td class="tdr" colspan="2">'+round(ad, 'zLFCv',  0)+'</td></tr>'
		tp += '<tr class="ri"><td>NCC   </td><td class="tdr" colspan="2">'+round(ad, 'zCCL',  0)+'</td><td class="tdr" colspan="2">'+round(ad, 'zCCLv',  0)+'</td></tr>'
		tp += '<tr class="ri"><td>NCA   </td><td class="tdr" colspan="2">'+round(ad, 'zLCL',  0)+'</td><td class="tdr" colspan="2">'+round(ad, 'zLCLv',  0)+'</td></tr>'
		tp += '<tr class="ri"><td data-param="LIFT">LIFT  </td><td class="tdr" colspan="2">'+round(ad, 'LIFT',  1)+'</td><td class="tdr" colspan="2">'+round(ad, 'LIFTv',  1)+'</td></tr>'
		tp += '<tr class="ri"><td data-param="LIFT">LIFT7 </td><td class="tdr" colspan="2">'+round(ad, 'LIFT7', 1)+'</td><td class="tdr" colspan="2">'+round(ad, 'LIFT7v', 1)+'</td></tr>'
		tp += '<tr class="ri"><td>CAPE3 </td><td class="tdr" colspan="2">'+round(ad, 'CAPE3', 1)+'</td><td class="tdr" colspan="2">'+round(ad, 'CAPE3v', 1)+'</td></tr>'
		tp += '<tr class="ri"><td>CAPE  </td><td class="tdr" colspan="2">'+round(ad, 'CAPE',  1)+'</td><td class="tdr" colspan="2">'+round(ad, 'CAPEv',  1)+'</td></tr>'
		tp += '<tr class="ri"><td>CIN   </td><td class="tdr" colspan="2">'+round(ad, 'CIN',   1)+'</td><td class="tdr" colspan="2">'+round(ad, 'CINv',   1)+'</td></tr>'
		tp += '<tr class="ri"><td>SBCAPE</td><td class="tdr" colspan="2">'+round(as, 'CAPE',  1)+'</td><td class="tdr" colspan="2">'+round(as, 'CAPEv',  1)+'</td></tr>'
		tp += '<tr class="ri"><td>SBCIN </td><td class="tdr" colspan="2">'+round(as, 'CIN',   1)+'</td><td class="tdr" colspan="2">'+round(as, 'CINv',   1)+'</td></tr>'
		tp += '<tr class="ri"><td>MUCAPE</td><td class="tdr" colspan="2">'+round(am, 'CAPE',  1)+'</td><td class="tdr" colspan="2">'+round(am, 'CAPEv',  1)+'</td></tr>'
		tp += '<tr class="ri"><td>MUCIN </td><td class="tdr" colspan="2">'+round(am, 'CIN',   1)+'</td><td class="tdr" colspan="2">'+round(am, 'CINv',   1)+'</td></tr>'		
		tp += '</table>'	
		
		//controls
		let tc = '<table id="maincontrols" class="tablelegend">'
		tc += '<tr><td >  </td><td><input id="mainhelp"   class="" type="button" value="Ayuda"   /></tr>'
		tc += '<tr><td >  </td><td><input id="maincolors" class="" type="button" value="Colores" /></tr>'
		tc += '<tr><td >  </td><td><input id="maindoc"    class="" type="button" value="Docum"   /></tr>'
		tc += '</table>'
		//tp += tc
			
		// parece demasiada información, se condensa en la tabla de supercélulas con únicamente el ascenso virtual
		//tp += '<tr><td>     </td><td class="tdr">Izq.                    </td><td class="tdr">Dch.                    </td><td class="tdr">Izq.                     </td><td class="tdr">Dch.                     </td></tr>'  
		//tp += '<tr><td>SCP  </td><td class="tdr">'+round(s, 'SCPL',  1)+'</td><td class="tdr">'+round(s, 'SCPR',  1)+'</td><td class="tdr">'+round(s, 'SCPLv',  1)+'</td><td class="tdr">'+round(s, 'SCPRv',  1)+'</td></tr>'
		//tp += '<tr><td>STP  </td><td class="tdr">'+round(s, 'STPL',  1)+'</td><td class="tdr">'+round(s, 'STPR',  1)+'</td><td class="tdr">'+round(s, 'STPLv',  1)+'</td><td class="tdr">'+round(s, 'STPRv',  1)+'</td></tr>'
		//tp += '<tr><td>STP2 </td><td class="tdr">'+round(s, 'STP2L', 1)+'</td><td class="tdr">'+round(s, 'STP2R', 1)+'</td><td class="tdr">'+round(s, 'STP2Lv', 1)+'</td><td class="tdr">'+round(s, 'STP2Rv', 1)+'</td></tr>'
		//tp += '<tr><td>EHI1 </td><td class="tdr">'+round(s, 'EHIL1', 1)+'</td><td class="tdr">'+round(s, 'EHIR1', 1)+'</td><td class="tdr">'+round(s, 'EHIL1v', 1)+'</td><td class="tdr">'+round(s, 'EHIR1v', 1)+'</td></tr>'
		//tp += '<tr><td>EHI3 </td><td class="tdr">'+round(s, 'EHIL3', 1)+'</td><td class="tdr">'+round(s, 'EHIR3', 1)+'</td><td class="tdr">'+round(s, 'EHIL3v', 1)+'</td><td class="tdr">'+round(s, 'EHIR3v', 1)+'</td></tr>'
				
		let tm = ''
		tm += title
		tm += '<table class="tablelegend">'
		tm += '<tr><td style="vertical-align:top">'+t+'</td><td style="vertical-align:top">'+tp+'</td></tr>'	
		tm += '</table>'			
			
		d3.select('#infolegendgroup').html(tm)				

		
		// tooltips
		//d3.select('#mainhelp').classed("btnact", true)
		//d3.select('#mainhelp').classed("btnact", !d3.select('#mainhelp').classed("btnact"))
		//d3.select("td").on("click", (function(){ this.show_info() }).bind(this))
		//d3.select("td").on("click", (function(){ this.show_info() }))

		// help callback
		let that = this
		d3.selectAll(".tablelegend .ri").each(function(d, i) {
			d3.select(this).on("click", function(){
                let param = d3.select(this).select("td").attr("data-param")
                param = param || d3.select(this).select("td").text() 
				that.tdd.info.load(param)
			})
		})
	}
	
	show_info(){
		console.log(this)
	}
	
	
	_add_controls(){

		let margin = 3
		let bw = (this.width - 10)/(margin*2)-2 // button width. -2 due to td padding
		
		// html
		let t = '<div id="ctrlegend">'
		t += '<hr class="hrlegend">'
		t += '<table id="parcelcontrols" class="tablectr">'
		t += '<tr>'
		t += '<td colspan="2">Ascenso</td>'
		t += '<td><input id="Tliftlegend"  class="parcelbtn" type="button" style="width:'+bw+'px;" value="T" /></td>'
		t += '<td><input id="Tvliftlegend" class="parcelbtn" type="button" style="width:'+bw+'px;" value="Tv" /></td>'
		t += '<td colspan="2"><input id="TTvliftlegend" class="parcelbtn" type="button" style="width:'+(bw*2+1+2)+'px;" value="T-Tv"/></td>'
		t += '</tr>'
		t += '<tr>'
		t += '<td><input class="parcelbtn" type="button" style="width:'+bw+'px;" value="0"  /></td>'
		t += '<td><input class="parcelbtn" type="button" style="width:'+bw+'px;" value="30" /></td>'
		t += '<td><input class="parcelbtn" type="button" style="width:'+bw+'px;" value="60" /></td>'
		t += '<td><input class="parcelbtn" type="button" style="width:'+bw+'px;" value="100"/></td>'
		t += '<td><input class="parcelbtn" type="button" style="width:'+bw+'px;" value="MU" /></td>'
		t += '<td><input class="parcelbtn" type="button" style="width:'+bw+'px;" value="X"  /></td>'	
		t += '</tr>'
		t += '</table>'
		t += '<hr class="hrlegend">'
		t += '<table id="linecontrols" class="tablectr">'
		t += '<tr>'
		t += '<td><input id="Tdlinelegend" class="linebtn Tdbtn" type="button" style="width:'+bw+'px;" value="Td"  /></td>'
		t += '<td><input id="Twlinelegend" class="linebtn Twbtn" type="button" style="width:'+bw+'px;" value="Tw" /></td>'
		t += '<td><input id="Tflinelegend" class="linebtn Tfbtn" type="button" style="width:'+bw+'px;" value="Tf" /></td>'
		t += '<td><input id="Tlinelegend"  class="linebtn  Tbtn" type="button" style="width:'+bw+'px;" value="T"  /></td>'
		t += '<td><input id="Tvlinelegend" class="linebtn Tvbtn" type="button" style="width:'+bw+'px;" value="Tv" /></td>'
		t += '<td><input id="Telinelegend" class="linebtn Tebtn" type="button" style="width:'+bw+'px;" value="Te" /></td>'	
		t += '</tr>'
		t += '<tr>'
		t += '<td><input id="Tdtoollegend" class="toolbtn Tdbtn Tdtoolbtn" type="button" style="width:'+bw+'px;" value="&#9679" /></td>'
		t += '<td><input id="Twtoollegend" class="toolbtn Twbtn Twtoolbtn" type="button" style="width:'+bw+'px;" value="&#9679" /></td>'
		t += '<td><input id="Tftoollegend" class="toolbtn Tfbtn Tftoolbtn" type="button" style="width:'+bw+'px;" value="&#9679" /></td>'
		t += '<td><input id="Ttoollegend"  class="toolbtn  Tbtn Ttoolbtn"  type="button" style="width:'+bw+'px;" value="&#9679" /></td>'
		t += '<td><input id="Tvtoollegend" class="toolbtn Tvbtn Tvtoolbtn" type="button" style="width:'+bw+'px;" value="&#9679" /></td>'
		t += '<td><input id="Tetoollegend" class="toolbtn Tebtn Tetoolbtn" type="button" style="width:'+bw+'px;" value="&#9679" /></td>'	
		t += '</tr>'			
		t += '</table>'
		t += '</div>'
		this.ctrl.html(t)

		// lift btns handlers
		d3.select('#Tliftlegend'  ).on("click", (function(){ this.lift_change('T')   }).bind(this))
		d3.select('#Tvliftlegend' ).on("click", (function(){ this.lift_change('Tv')  }).bind(this))
		d3.select('#TTvliftlegend').on("click", (function(){ this.lift_change('TTv') }).bind(this))		
		// parcel btns handlers
		for (let p of this.tdd.parcels){
			d3.select('.parcelbtn[value="'+p+'"]').on("click", (function(){	this.parcel_change(p) }).bind(this))
		}
		// lines and tools btns handlers
		for (let l of Object.values(this.lines)){
			d3.select('#'+l.name+'linelegend').on("click", (function(){	this.line_change(l) }).bind(this))
			d3.select('#'+l.name+'toollegend').on("click", (function(){	this.tool_change(l) }).bind(this))
		}
	}

	
	/**
	 * 
	 */
	lift_change(lift){
		//console.log("lift_change", lift)
		d3.select('#'+this.tdd.lift+'liftlegend').classed("btnact", false) // previous btn
		d3.select('#'+lift+'liftlegend').classed("btnact", true) 
		this.tdd.lift = lift
		this.parcel_change(this.tdd.parcel, true)
	}
	
	
	/**
	 * 
	 */
	parcel_change(level, keepactive=false){
		//console.log("parcel_change", level, this)
		let active = this.tdd.parcel==level
		if (keepactive) active=false
		let rect  = d3.select('.parcelbtn[value="'+level+'"]')
		if (active){
			rect.classed("btnact", false)
			this.tdd.parcel = null
		} else {
			if (this.tdd.parcel != null){
				d3.select('.parcelbtn[value="'+(this.tdd.parcel).toString()+'"]')
					.classed("btnact", false)
			}
			rect.classed("btnact", true);
			this.tdd.parcel = level
		}
		//this.tdd.plot_parcel()
		this.tdd.diag.plot_parcel(this.tdd.parcel, this.tdd.lift)
		this.plot()
	}
	
	
	/**
	 * 
	 */
	line_change(line){
		//console.log("line_change", line)
		let id     = line.name            // line name
		let idline = line.name + "line"   // diagram line id
		let idtool = line.name + "label"  // diagram tooltip id 
		let idlinelegend = line.name + "linelegend"   // control line id 
		let idtoollegend = line.name + "toollegend"   // control tool id
		var lineactive = this.lines[id].visible
		// hide or show the elements
		if (lineactive){
			d3.select("#"+idline      ).style("opacity", 0);
			d3.select('#'+idtool      ).style("opacity", 0);
			d3.select("#"+idlinelegend).style("opacity", this.op);
			d3.select("#"+idtoollegend).style("opacity", this.op);
			this.lines[id].tooltip = false
		} else {
			d3.select("#"+idline      ).style("opacity", 1);
			d3.select("#"+idlinelegend).style("opacity", 1);
		}
		// update whether or not the elements are active
		this.lines[id].visible = !lineactive
	}
	
	
	/**
	 * 
	 */
	tool_change(line){
		//console.log("tool_change", line)
		let id     = line.name            // line name
		let idline = line.name + "line"   // diagram line id
		let idtool = line.name + "label"  // diagram tooltip id 
		let idlinelegend = line.name + "linelegend"   // control line id 
		let idtoollegend = line.name + "toollegend"   // control tool id
		var lineactive = this.lines[id].visible
		var toolactive = this.lines[id].tooltip

		// hide or show the elements
		if (toolactive){
			d3.select("#"+idtoollegend).style("opacity", this.op);
			d3.select('#'+idtool      ).style("opacity", 0);
		} else {
			d3.select('#'+idtool      ).style("opacity", 1);
			d3.select("#"+idtoollegend).style("opacity", 1);
			if (lineactive==false){
				d3.select('#'+idtool      ).style("opacity", 1);	
				d3.select("#"+idline      ).style("opacity", 1);
				d3.select("#"+idlinelegend).style("opacity", 1);
				this.lines[id].visible = !lineactive
			}
		}
		// update whether or not the elements are active
		this.lines[id].tooltip = !toolactive
	}
}





/**
 * 
 */
class Skewt extends AbstractDiagram {
	
	// geometry
	zoom_max = 300
	
	// X axis definitions
	tmin   = -35
	tmax   = 45
	tinc   = 5
	tticks = d3.range(this.tmin-100,this.tmax+1,this.tinc)
	insposx = 50 // instability line position
	
	// Y axis definitions
	ptop    = 100
	pbot    = 1050
	newpbot = this.pbot // bottom pressure when zooming
	plines  = [1000,850,700,500,300,200,100];
	pticks  = [950,900,800,750,650,600,550,450,400,350,250,150];
	pticks  = [1050,1000,950,900,850,800,750,700,650,600,550,500,450,400,350,300,250,200,220,190,180,170,160,150,140,130,120,110,100]
	
	// diagram properties
	alpha   = 45
	deg2rad = (Math.PI/180);
	tan     =  1. //Math.tan(this.alpha*this.deg2rad);
	
	// font
	ft_fontsize = 11
	bg_fontsize = 7
	ft_r = 3 // radius of tooltip points
	ft_y = 9 // height separation for text lines of ft_fontsize
	ft_x = 2 // x separation for height tooltip
	ft_w = 50 // height tooltip line width
	
	// background
	bg_mixing  = [0.2,0.4,0.6,1,1.5,2,3,4,5,7,9,12,16,20,28,36,48,66] // mixing ratio (g/kg)  
	bg_mixing_ptop = 250
	bg_tlines = d3.range(-120, this.tmax+1, this.tinc)
	bg_dryad  = d3.range(this.tmin,100,5).concat(d3.range(100,220,10)) // potential temperatures
	bg_psead  = [-20,-16,-12,-8,-4,0,4,8,12,16,20,24,28,32,36] 
	//bg_dryad  = [30]
	
	
	/**
	 * 
	 */
	constructor(tdd, start, dims, scale){
		super(tdd, start, dims, scale)
		// geometry
		this.height = dims.height 
		this.width  = dims.width 
		this.fullheight = dims.fullheight
		this.fullwidth  = dims.fullwidth
		this.tinc = this.tmax-this.tmin
		this.lnpinc = Math.log(this.pbot/this.ptop)
		// build
		this.lines = tdd.lines
		this._scale()
	    this._build()
	    this._axes()
	    this._background()
	    this._zoom()
	    this._tooltips()
	    //this._trace()
	}
	
	
	_scale(){
		this.insposx = this.insposx*this.scale
		this.ft_fontsize = this.ft_fontsize*this.scale
		this.bg_fontsize = this.bg_fontsize*this.scale
		this.ft_r = this.ft_r*this.scale
		this.ft_y = this.ft_y*this.scale
		this.ft_x = this.ft_x*this.scale
		this.ft_w = this.ft_w*this.scale
	}
	
	
	clear(){
		
		this.clear_parcel()
		
		for (let l of Object.keys(this.lines).reverse()){
			//console.log89
			d3.select('#'+l+'line').html(null)
			//this.fttext.append("g").attr("id", l+'label')
		}
	}
	
	
	/**
	 * Plot lines and tooltips as specified in this.lines
	 */
	plot(){
		// lines		
		for (let l of Object.values(this.lines)){
			//console.log("plot line", l)
			this.line(this.tdd.s.data, l.name)
			if (l.visible==false){ this.hide_line(l.name)    }
			if (l.tooltip==false){ this.hide_tooltip(l.name) }
		}	
	}
	
	

	
	
	plot_ground(){
		// color
		let classcolor = 'ground_soil'
		if (this.tdd.s.zs<1.) classcolor = 'ground_sea'
		if (this.tdd.s.COTA<this.tdd.s.zs) classcolor = 'ground_snow'
		// rect
		let y = this.y(this.tdd.s.ps)
		let h = this.y(this.pbot) - y
		d3.select('#ground').html(null)
		d3.select('#ground').append('rect')                       
	    	.attr('x', 0)
	    	.attr('y', y)
	    	.attr('width', this.width)
	    	.attr('height', h)
	    	.attr('class', classcolor)
	}
	
	
	clear_parcel(){
		d3.select('#capearea').html(null)
		d3.select('#capevarea').html(null)
		d3.select('#cinarea').html(null)
		d3.select('#cinvarea').html(null)
		d3.select('#Tlift').html(null)
		d3.select('#Tvlift').html(null)
		d3.select('#rlift').html(null)
	}
	
	plot_parcel(parcel, lift){

		this.clear_parcel()
		
		if (parcel==null) return
		let ad = this.tdd.s.parcels[parcel]
		if (ad===undefined) return

		switch (lift) {
		  case 'T': 
			this.plot_parcel_normal(ad)
		    break;
		  case 'Tv':
			this.plot_parcel_virtual(ad)
		    break;
		  case 'TTv':
			this.plot_parcel_normal(ad)
			this.plot_parcel_virtual(ad)
		    break;
		}
        
        // DEBUG
        //this.vline(ad.data, 'Thw', 'Twline')
        //this.vline(ad.data, 'The', 'Teline')
	}
	
	plot_parcel_virtual(ad){
		// areas
		let areas = ad.cape_sections('iTv')
		if (areas!=null){
			for (let s of areas.capes){ this.area(s, ad.ELv, 'Tv', 'T2v', 'capevarea') }
			for (let s of areas.cins) { this.area(s, ad.ELv, 'Tv', 'T2v', 'cinvarea') }
		}
		// Tv line
		this.line(ad.data, 'Tv',  'Tlift')
		this.line(ad.data, 'T2v', 'Tlift')
		// LCL point ??
	}
	
	plot_parcel_normal(ad){
		// areas
		let areas = ad.cape_sections('iT')
		if (areas!=null){
			for (let s of areas.capes){ this.area(s, ad.EL, 'T', 'T2', 'capearea') }
			for (let s of areas.cins) { this.area(s, ad.EL, 'T', 'T2', 'cinarea') }
		}		
		// T line
		this.line(ad.data, 'T',   'Tlift')
		this.line(ad.data, 'T2',  'Tlift')
		// r line
		let p1 = {p:ad.p0,T:ad.Td0}
		let p2 = {p:ad.LCL,T:t_from_prw(ad.LCL,ad.r0)}
		this.line2p(p1,p2)
		// LCL point ?
	}

	area(data, top, param_left, param_right, cl=null){
		var area = d3.area()
			.defined(d => d.p>=top)
			.y(d => this.y(d.p) )
			.x0(d => this.skewx(d[param_left], d.p) )
			.x1(d => this.skewx(d[param_right], d.p) )

		d3.select('#'+cl).append("path")				
		    .data([data])
		    .attr("class", cl)
		    .attr("d", area)
	}
	
	
	plot_insthw(){
		this.insthw.html(null)
		for (let l of this.tdd.s.layers()){		
			if (l[1].insthw == 0) continue
			this.insthw.append("line")
				.attr("x1", this.insposx) 
				.attr("x2", this.insposx)
				.attr("y1", this.newY(l[0].p))
				.attr("y2", this.newY(l[1].p))
				.attr("class", "insthw")
		}
	}
	
	 /**
     * Plot vertical line. For debug purposes  
     */
    vline(data, param, cl=null){
        cl = cl || param+'line'
        //console.log("line", param, cl)
        if (param=='Tf') param='TSn'
        d3.select('#'+cl).append("path")
            .data([data])
            .attr("class", cl) 
            .attr("d", d3.line()
                .x(d => this.x(d[param], d.p) ) 
                .y(d => this.y(d.p) )
                .curve(d3.curveLinear)
            )        
    }
    
    
	/**
	 * 
	 */
	line(data, param, cl=null){
		cl = cl || param+'line'
		//console.log("line", param, cl)
		if (param=='Tf') param='TSn'
		d3.select('#'+cl).append("path")
			.data([data])
			.attr("class", cl) 
			.attr("d", d3.line()
				.x(d => this.skewx(d[param], d.p) ) 
				.y(d => this.y(d.p) )
				.curve(d3.curveLinear)
			)	
		// DEBUG
//		this.ftlines.append("g").attr("id", cl+'point').selectAll("circle")
//			.data(data)			
//     	      .enter().append("circle")
//		        .attr("r", 0.03)
//		        .attr("cx", d => this.skewx(d[param], d.p) ) 
//		        .attr("cy", d => this.y(d.p) )
//				.style("fill", "#61a3a9")
//				.style("opacity", 0.8)		
	}
	
	hide_line(param){
		this.lines[param].visible = false 
		d3.select('#'+param+'line').style("opacity", 0);
	}

	hide_tooltip(param){
		this.lines[param].tooltip = false 
		d3.select('#'+param+'label').style("opacity", 0);
	}
	
	
	line2p(p1, p2, cl=null){
		cl = cl || 'rlift'
		d3.select('#'+cl).append("line")
		//this.ftlines.append("g").attr("id", cl).append("line")
			.attr("x1", this.skewx(p1.T, p1.p)) 
			.attr("x2", this.skewx(p2.T, p2.p))
			.attr("y1", this.y(p1.p))
			.attr("y2", this.y(p2.p))
			.attr("class", cl)
	}
	
	
	/**
	 * Add necessary groups
	 */
	_build(){
		
		this.main = this.tdd.svg.append("g") 
			.attr("id",    "diag")
			.attr("class", "diag")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		// group for clip and events
	    // background	
		this.aux = this.main.append('g').attr("id", "aux")
		this.aux.append('rect')                       
	    	.attr('x', 0).attr('y', 0)
	    	.attr('width', this.width)
	    	.attr('height', this.height)
	    	.attr('fill', 'white')
	    	
	    // clips
		this.clip = this.aux.append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", this.width )
			.attr("height", this.height )
			.attr("x", 0)
			.attr("y", 0);	  
	    
		this.clipfull = this.aux.append("clipPath")
			.attr("id", "clipfull")
			.append("rect")
			.attr("transform", "translate(-" + this.margin.left + ",-" + this.margin.top + ")")
			.attr("width", this.fullwidth)
			.attr("height", this.fullheight)
			.attr("x", 0)
			.attr("y", 0);
	    	
		// front group (cliped)
		this.ft = this.main.append("g").attr("id", "ft").attr("clip-path", "url(#clip)")
		this.ftareas = this.ft.append("g").attr("id", "ftareas")
		this.ftlines = this.ft.append("g").attr("id", "ftlines")
		this.fttext  = this.ft.append("g").attr("id", "fttext")
		this.ftfix   = this.ft.append("g").attr("id", "ftfix") // doesn't scale
		this.ftlines.append("g").attr("id", 'Tlift')
	    this.ftlines.append("g").attr("id", 'Tvlift')
	    this.ftlines.append("g").attr("id", 'rlift')
	    
	    this.insthw = this.ftlines.append("g").attr("id", 'insthw')
	    
		for (let l of Object.keys(this.lines).reverse()){
			this.ftlines.append("g").attr("id", l+'line')
			this.fttext.append("g").attr("id", l+'label')
		}
	    this.Htool = this.ftfix.append("g").attr("id", 'Hlabel')
	    this.Wtool = this.ftfix.append("g").attr("id", 'Wlabel')
	    
	    this.ftareas.append("g").attr("id", 'capearea')
		this.ftareas.append("g").attr("id", 'capevarea')
	    this.ftareas.append("g").attr("id", 'cinarea')
		this.ftareas.append("g").attr("id", 'cinvarea')
		this.ftareas.append("g").attr("id", 'ground')
		
		// background group (cliped)
		this.bg      = this.main.append("g").attr("id", "bg").attr("clip-path", "url(#clip)") 
		this.bglines = this.bg.append("g").attr("id", "bglines") //.attr("class", "bglines")
		this.bgtext  = this.bg.append("g").attr("id", "bgtext") //.attr("class", "bgtext")	
	}
	
	
	_tooltips() {
		
		// add line tooltips
		for (let l of Object.values(this.lines)){
			d3.select('#'+l.name+'label').append("circle")
				.attr("r", 3)
				.attr("class", l.name+'legend') // for the color
			d3.select('#'+l.name+'label').append("text")
				.attr("x", l.x)
				.attr("y", l.y)
				.attr("dy", ".35em")
				.style("font-size", this.ft_fontsize+"px")
		}
		
		// height tooltip
		this.Htool.append("line")
			.attr("class", "normalline")
		this.Htool.append("text")
			.attr("id", "HmLabel")
			.attr("x", this.ft_x)
			.attr("y", this.ft_y)
			.attr("text-anchor", "start")
			.attr("dy", ".35em")
			.style("font-size", this.ft_fontsize+"px")
		this.Htool.append("text")
			.attr("id", "HPaLabel")
			.attr("x", this.ft_x)
			.attr("y", -this.ft_y)
			.attr("text-anchor", "start")
			.attr("dy", ".35em")
			.style("font-size", this.ft_fontsize+"px")
		
		// wind tooltip
		this.Wtool.append("line")
			.attr("class", "normalline")
		this.Wtool.append("text")
			.attr("id", "WmsLabel")
			.attr("x", this.width - this.ft_w)
			.attr("y", this.ft_y)
			.attr("text-anchor", "start")
			.attr("dy", ".35em")	  
			.style("font-size", this.ft_fontsize+"px")
		this.Wtool.append("text")
			.attr("id", "WktLabel")
			.attr("x", this.width - this.ft_w)
			.attr("y", -this.ft_y)
			.attr("text-anchor", "start")
			.attr("dy", ".35em")
			.style("font-size", this.ft_fontsize+"px")

		// events
		this.main.append("rect")
			.attr("id", "toolrect")
		    .attr("width", this.width)
		    .attr("height", this.height)
		    .style("fill", "none")
		    .style("pointer-events", "all")
		    .on("mousemove",this._tooltiped.bind(this))
		    .on("click", this._new_parcel.bind(this))
	}
	
	_new_parcel(){
		
		// y mouse position
		var rect = this.tdd.elem.getBoundingClientRect()
		let y = event.y - rect.top
		
		// closest level 
		let p = this.newY.invert(y - this.margin.top); // get y value of mouse pointer in pressure space
		let d = this.tdd.s.closest(p)
		let ad = this.tdd.s.compute_parcel(d.p, d.T, d.r)
		this.tdd.s.parcels['X'] = ad 
		
		this.tdd.lgnd.parcel_change('X', true) // change control button
		this.tdd.lgnd.plot()
	}
	
	
	_tooltiped(){

		if (this.tdd.s==null) return
		
		// y mouse position
		var rect = this.tdd.elem.getBoundingClientRect()
		let y = event.y - rect.top
		
		// closest level 
		let p = this.newY.invert(y - this.margin.top); // get y value of mouse pointer in pressure space
		let d = this.tdd.s.closest(p)
		// set temperatures' tooltips
		for (let l in this.lines){
			let x = l
			if (l=='Tf') x='TSn'
			if (d[x]===undefined) continue
			d3.select('#'+l+'label')
				.attr("transform", "translate(" + this.skewx(d[x], d.p) + "," + this.y(d.p) + ")")
				.select("text").text((d[x]).toFixed(1) +"°C");
		}
		// height tooltip
		this.Htool.attr("transform", "translate(0," + this.newY(d.p) + ")");
		this.Htool.select("#HmLabel").text(Math.round(d.zg)+" m"); 
		this.Htool.select("#HPaLabel").text(Math.round(d.p)+" hPa");
		this.Htool.select("line")
			.attr("x1", 0)
			.attr("x2", this.ft_w)
			.attr("y1", 0)
			.attr("y2", 0)

		// wind tooltip
		this.Wtool.attr("transform", "translate(0," + this.newY(d.p) + ")");
		this.Wtool.select("#WmsLabel").text(Math.round(convert_wind(d.wS, "kt")*10)/10 + " " + "kt");
		this.Wtool.select("#WktLabel").text(Math.round(d.wS*10)/10 +" m/s");
		this.Wtool.select("line")
			.attr("x1", this.width)
			.attr("x2", this.width - this.ft_w)
			.attr("y1", 0)
			.attr("y2", 0)
	}
	
	_zoom(){

		// Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom	      
		var zoom = d3.zoom()
			.scaleExtent([1., this.zoom_max])  // This control how much you can unzoom (x1.0) and zoom (x20)
			.extent([[0, 0], [this.width, this.height]])
			.translateExtent([[0, 0], [this.width, this.height]])
			.on("zoom", this._zoomed.bind(this))

		this.main.call(zoom)
	}
	
	_zoomed(event){
		//console.log(event.transform)
		let newY  = event.transform.rescaleY(this.y);
		this.newY = newY
		let newX  = event.transform.rescaleX(this.x);
		// adjust domain: move x scale with incT when pbot is different from the start
		this.newpbot = newY.domain()[1]
		let incT = Math.log(this.pbot/this.newpbot) * this.tinc / this.lnpinc
		newX.domain([newX.domain()[0]-incT, newX.domain()[1]-incT])
		this.axx.call(this.ax.scale(newX))
		this.ayy.call(this.ay.scale(newY))
		// update positions
		this.ftareas.attr('transform', event.transform)
		this.ftlines.attr('transform', event.transform)
		this.bglines.attr('transform', event.transform)
		this.insthw.selectAll('line')
			.attr("x1", this.skewx(newX.domain()[0],newY.domain()[1]) + this.insposx/event.transform.k)
			.attr("x2", this.skewx(newX.domain()[0],newY.domain()[1]) + this.insposx/event.transform.k)
		// update labels, resize text, lines and points to original size
		this.fttext.attr('transform', event.transform)
		this.bgtext.attr('transform', event.transform)
		this.bgtext.selectAll('text').style("font-size", (this.bg_fontsize/event.transform.k)+"px")
		this.fttext.selectAll('text').style("font-size", (this.ft_fontsize/event.transform.k)+"px")
		this.fttext.selectAll('circle').attr("r", this.ft_r/event.transform.k)
		for (let l of Object.values(this.lines)){
			this.fttext.select('#'+l.name+'label').select("text")
				.attr('x', l.x/event.transform.k)
				.attr('y', l.y/event.transform.k)
		}
		// apply zoom to wind diagram
		this.tdd.wind._zoomed(newY, event.transform)
	}

	/*
	 * Add background lines
	 */
	_background(){
			
		// logarithmic pressure lines
		this.bglines.append("g").attr("id", "bgpress").selectAll(".pressbg")
			.data(this.pticks)
			.enter().append("line")
			.attr("x1", 0)
			.attr("x2", this.width)
			.attr("y1", d => this.y(d))
			.attr("y2", d => this.y(d))
			.attr("class", "pressbg")			
		
		// skewed temperature lines
		this.bglines.append("g").attr("id", "bgtemp").selectAll(".tempbg")
			.data(this.bg_tlines)
			.enter().append("line")
			.attr("x1", d => this.skewx(d, this.ptop))
			.attr("x2", d => this.x(d) )
			.attr("y1", 0)
			.attr("y2", this.height)
			.attr("class", function(d) { if (d == 0) { return "mediumline"; } else { return "tempbg"}})

		// mixing ratio lines
		this._bg_mixing_ratio()
		
		// dry adiabat lines
		this._bg_dry_adiabats()
		
		// pseudoadiabat lines
		this._bg_pse_adiabats()

	}

	
	/*
	 * Mixing ratio line
	 */
	_bg_mixing_ratio(){
		
		this.bglines.append("g").attr("id", "bgmixing").selectAll(".mixingbg")
			.data(this.bg_mixing)
			.enter().append("line")
			.attr("x1", r => this.skewx(t_from_prw(this.pbot,r/1000.), this.pbot) ) 
			.attr("x2", r => this.skewx(t_from_prw(this.bg_mixing_ptop,r/1000.), this.bg_mixing_ptop) )
			.attr("y1", this.y(this.pbot) )
			.attr("y2", this.y(this.bg_mixing_ptop))
			.attr("class", "mixingbg")
			
		this.bgtext.append("g").attr("id", "bgmixingtext").selectAll(".mixinglabel")
			.data(this.bg_mixing)
			.enter().append("text")
			//.attr("x", r => this.skewx(t_from_prw(this.pbot,r/1000.), this.pbot) )
			.attr("x", r => this.skewx(t_from_prw(this.bg_mixing_ptop,r/1000.), this.bg_mixing_ptop) ) 
			.attr("y", this.y(this.bg_mixing_ptop))
			//.attr("y", this.y(this.pbot))
			.text(r => r)
			.attr("dy", "-.30em")
		    .attr("class", "mixinglabel")
		    .style("font-size", this.bg_fontsize) // overwrite class			
	}
	
	
	/*
	 * Dry adiabats
	 */
	_bg_dry_adiabats(){
		
		this.bglines.append("g").attr("id", "bgdryad").selectAll(".dryadbg")
		.data(this.bg_dryad)
		.enter().append("path")
			.datum(d => Thlines.dry_adiab(d, this.ptop, 1000., 30))
			.attr("class", "dryadbg")
			.attr("d", d3.line()
				.x(d => this.skewx(d.T, d.p) ) 
				.y(d => this.y(d.p) )
				.curve(d3.curveLinear)
	        )
	     // DEBUG 
//	    this.bglines.append("g").attr("id", "bgdryad").selectAll(".dryadbg")
//		.data(this.bg_dryad)
//		.enter().append("path")
//			.datum(d => Thlines.dry_adiab(d, this.ptop, this.pbot, 1000))
//			.attr("class", "debug")
//			.attr("d", d3.line()
//				.x(d => this.skewx(d.T, d.p) ) 
//				.y(d => this.y(d.p) )
//				.curve(d3.curveLinear)
//	        )   
	}
	
	
	/*
	 * Pseudoadiabats
	 * Calculate lapse rate
	 */
	_bg_pse_adiabats(){
		
		//this.pseadrange = [32]
	    let PBOT = 1000.
	    let PTOP = this.ptop
	    let DP   = -0.3  // pressure differential 
	    let TMIN = -50

	    let bgpsead     = this.bglines.append("g").attr("id", "bgpsead")    //.selectAll(".pseadbg")
	    let bgpseadtext = this.bgtext.append("g").attr("id", "bgpseadtext") //.selectAll(".pseadlabel")
	    
	    for (let T of this.bg_psead){
	    	
	    	let data = Thlines.pse_adaib(T, PBOT, PTOP, TMIN, 0.004702)

	    	bgpsead.append("path")
				.data([data])
				.attr("class", "pseadbg")
				.attr("d", d3.line()
					.x(d => this.skewx(d.T, d.p) ) 
					.y(d => this.y(d.p) )
					.curve(d3.curveLinear)
		        )
		        
		    bgpseadtext.append("text")
		    	.data([data.slice(-1)[0]])
				.attr('class', 'pseadlabel')
				.attr("x", d => this.skewx(d.T, d.p) ) 
				.attr("y", d => this.y(d.p))
				.text(T)
				.attr("dx", "-.3em")
				.attr("dy", "-.3em")   
				.style("font-size", this.bg_fontsize) // overwrite class		
	    }
	}
	
	
	/*
	 * Creates scales and axes
	 */
	_axes(){
		// axes group
		this.axes = this.main.append('g').attr("id", "axes").attr("clip-path", "url(#clipfull)")

		// pressure
		this.y = d3.scaleLog()
			.range([0, this.height])
			.domain([this.ptop, this.pbot]);
		this.newY = this.y // used in tooltips
		
		this.ay = d3.axisLeft(this.y)
			.tickSize(0,0)
			.tickValues(this.pticks)
			.tickFormat(d3.format(".0d"))
		
		this.ayy = this.axes.append('g')
			.call(this.ay);
	
		// temperature
		this.x = d3.scaleLinear()
			.range([0, this.width])
			.domain([this.tmin,this.tmax])

		this.ax = d3.axisBottom(this.x)
			.tickValues(this.tticks)
			.tickSize(0,0)

		this.axx = this.axes.append('g')
			.attr("transform", "translate(0," + this.height + ")") // move the axis down
			.call(this.ax);
		
		// skew temperature function
		this.skewx = function(t,p){
			return this.x(t) + (this.y(this.pbot)-this.y(p))/this.tan;
		}
		

		// Line along right edge of plot
		this.axes.append("line")
			.attr("x1", this.width)
			.attr("x2", this.width)
			.attr("y1", 0)
			.attr("y2", this.height)
			.attr("class", "mediumline");
		
		// Line on top
		this.axes.append("line")
			.attr("x1", 0)
			.attr("x2", this.width)
			.attr("y1", 0)
			.attr("y2", 0)
			.attr("class", "mediumline");
	}
}



class Loaderd3 {
    
    constructor(config){
        this.radius = Math.min(config.width, config.height) / 2;
        this.tau = 2 * Math.PI;
        this.duration = 800
        this.timer // ID value of the timer returned by the setTimeout() method

        this.arc = d3.arc()
            .innerRadius(this.radius*0.5)
            .outerRadius(this.radius*0.9)
            .startAngle(0);

        this.svg = d3.select(config.container).append("g")
            .attr("id", config.id)
            .attr("width", config.width)
            .attr("height", config.height)
            .append("g")
                .attr("transform", "translate(" + config.x + "," + config.y + ")")

        this.background = this.svg.append("path")
                .datum({endAngle: 0.33*this.tau})
                .style("fill", "#4D4D4D")
                .style('opacity', 0)
                .attr("d", this.arc)
                //.call(spin, duration)
    }

    spin() {
        //console.log("spin", this.background, this.duration)
        this.background.transition()
            .ease(d3.easeLinear)
            .duration(this.duration)
            .attrTween("transform", function() {
                return d3.interpolateString("rotate(0)", "rotate(360)");
            }); 
        this.timer = setTimeout( (function(){this.spin()}).bind(this), this.duration ); 
    }
    
    start(){
        //console.log("loader start")
        this.background.style('opacity', 1);
        this.spin()
    }
    
    stop(){
        //console.log("loader stop")
        this.background.style('opacity', 0);
        clearTimeout(this.timer)
    }
}


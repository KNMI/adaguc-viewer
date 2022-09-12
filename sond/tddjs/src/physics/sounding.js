/*! sounding.js - v1.0.0 - 2020-11-26
* Copyright (c) 2020 mgomezm@aemet.es; 
* 
* Sounding
* */


var testad // debug variable 


/**
 * Sounding class
 * --------------
 * Every variable is linearly interpolated with altitude (z), height (zg) or logarithmic pressure (ln(p))
 */
class Sounding extends Vertical{
	
	low_layer_parcels = [0,30,60,100]
	
	parcels = {}
		
	constructor(data, meta=null){
		super(data)
		// meta
		if (meta){
			this.model = meta.model
			this.index = meta.index
			this.date  = meta.date
			this.run   = meta.run
			this.step  = meta.step
			this.lon   = meta.lon
			this.lat   = meta.lat
			this.ps    = meta.ps
			this.zs    = meta.zs
            this.name  = meta.name
		}
        // DEBUG
        this.Thwm = 999 // minimum Thw DEBUG
        this.pThwm      // pressure of Thwm DEBUG
        this.Thwsm = 999 // minimum Thw DEBUG
        this.pThwsm      // pressure of Thwm DEBUG        
        this.Thwvsm = 999 // minimum Thw DEBUG
        this.pThvwsm      // pressure of Thwm DEBUG 
        
        
		// data: complete sounding
		this.data.forEach(function(d){ 
			this.set(d)
		}, this);
		// instability
		this._insThw()
		
	}
	
	
	set(d){
		d.T   = d.T || d.t
		d.Td  = d.td // tdc(d.p, d.r)
		d.r   = rwc(d.Td,d.p) //rfromq(d.q)  // setR...	
		d.rw  = rwc(d.T ,d.p)
		d.h   = d.r/d.rw
		//d.q   = qfromr(d.r)
		d.Tv  = tvc(d.T, d.r)
		d.rwv = rwc(d.Tv, d.p) // nuevo: equivale a tpv = self.getTPv() de computeIndex(), para calcular CCLv.
		d.Te  = tec(d.T, d.r) 		 // setTe
		d.Tw  = twc(d.T, d.p, d.r)   // setTw
		d.Th  = thc(d.T, d.p)        // setTh
		d.The = thec(d.T, d.p, d.r)  // setThe
		d.Thw = thwc(d.T, d.p, d.r)  // setThw
		//d.insthw // se establece en setThw. inestabilidad. Comprueba con el valor siguiente o anterior
		d.zg = d.z - this.zs // height from ground
		// cota
        d.TSn  = tsneF0(d.T,d.h,d.p)
        d.Twsn = d.TSn*Math.pow((d.p*c0)/((c0+d.T)*PSEA),0.54)
        if (d.Twsn<0) d.Twsn=0.
		// wind speed and math direction
		d.wS = Math.sqrt(d.u*d.u+d.v*d.v)
		//d.wD = Math.atan(d.u/d.v)
		d.wD = Math.atan2(d.v,d.u)
		// clean
		delete d.t		
        
        
		// DEBUG: Thw minimum
		let Thwsm = thwc(d.T, d.p, d.rw)
		if (Thwsm<this.Thwsm){
			this.Thwsm = Thwsm
			this.pThwsm = d.p
		}
        if (d.Thw<this.Thwm){
            this.Thwm = d.Thw
            this.pThwm = d.p
        } 
        
        let Thwvsm = thwc(d.Tv, d.p, d.rw)
        if (Thwvsm<this.Thwvsm){
            this.Thwvsm = Thwvsm
            this.pThwvsm = d.p
        }
         
	}
	
	_insThw(){
		//console.log("_insThw")
		for (let l of this.layers()){
			//console.log(l)
			if ((l[0].Thw-l[1].Thw)<0) { // unstable 
				l[1].insthw = 1
			} else {
				l[1].insthw = 0
			}
		}
	}
	
	start(){
		//console.log("======== test sounding ========")
		//this.trace()

		//console.log("==== test cota ====")	
		this.calc_cota()
		
		//console.log("==== test index ====")
		this.compute_index()
		
		//console.log("==== test shear ====")
		this.compute_shear()

		//console.log("==== test advanced index ====") // needs shear
		this.compute_advanced_index()
		
		//console.log("==== test parcels ====") // needs ad.Index & shear
		this.compute_parcels(this.low_layer_parcels)
        
        //this.test_debug()
	}
    
    
    test_debug(){
        

        for (let p=1000; p>300; p-=100){
            let maxdif = -999
            let maxt
            for (let t = -50; t < 150; t++) {
                let r = rwc(t,p)
                let ad = new AdiabLift(p, t, r)
                console.log(p, t, r, ad.diffthw)
                if (ad.diffthw>maxdif) {
                    maxdif=ad.diffthw
                    maxt = t
                }
            }
            break
            console.log("maxdiff", p, maxt, maxdif)
        }
        
    }

	// DEBUG TODO: repasar. calcualr sin el loop de umbrales. Repasar las primeras lineas donde interpola...
	calc_cota(){
		this.COTANIE0 = null
		this.COTANIE  = {}
		this.areath   = {}
		this.sfcphi   = {}
        this.sfcprsn  = {}
		
		//let p = this.find_bot('TSn', 0)
		let p = this.find_bot('TSn', 0)
		if (p==null) { return }
		//TODO: check p
		
		
		let [top,bot] = this.layer(p)
		//let z = this.linter(top, bot, 'z', 'TSn', 0)
		let z = this.inter2y(top, bot, 'z', 'TSn', 0)
		let zli = this.interp(p, 'z', 'linear')
		let zln = this.interp(p, 'z', 'ln')
//		console.log("cota",p)
//		console.log("capa",top, bot)
//		console.log("z",z)
//		console.log("zli",zli)
//		console.log("zln",zln)
		let gam=0.45
        let ddl=1.6
        let ph1=28.
        let aaa=Math.log(20.)
        for (let rr of [0.2,0.5,1.,3.,10.]){
        	let tag = 'COTANIE'+String(rr).replace('.','')
        	//console.log(rr, tag)
        	let aph = Math.pow(ph1*Math.pow(rr,gam),ddl)
        	this.areath[tag] = aph
        	let area = 0.5*bot.Twsn*(z-bot.z)
        	this.sfcarea       = area
        	this.sfcareamelt   = area
        	this.sfcareameltmx = area
        	this.sfcareadiff   = 0.
        	if (aph<area) this.COTANIE[tag] = bot.z + Math.sqrt(aph/area)*(z-bot.z)
        	for (let l of this.layers(bot.p, this.bot.p, 'exact')){ 
        		let a9   = this.sfcareamelt
        		let tw5  = (l[0].Twsn+l[1].Twsn)*0.5
        		let twdz = (l[0].z-l[1].z)*tw5
            	this.sfcarea     += twdz
            	this.sfcareamelt += twdz
                if (this.sfcareamelt<0) this.sfcareamelt=0
                this.sfcareameltmx=Math.max(this.sfcareameltmx,this.sfcareamelt)
                let dmelt = this.sfcareameltmx-this.sfcareamelt
                if (this.sfcareadiff<dmelt) this.sfcareadiff=dmelt
                if (aph<this.sfcareamelt){
                	if (this.COTANIE[tag]==undefined){
                		this.COTANIE[tag] = this.inter2(a9,this.sfcareamelt,aph,l[0].z,l[1].z)
                		//console.log(tag,this.COTANIE[tag])
                	}
                }
        		if (this.sfcareameltmx){
                    this.sfcphi [tag]=Math.pow(this.sfcareameltmx,1./ddl)/Math.pow(rr,gam)
                    this.sfcprsn[tag]=1./(1.+Math.exp(aaa*((this.sfcphi[tag]/ph1)-1.)))
        		}
        	}
        }
	}
	
	
	get_cota(tag){
		if (this.COTANIE[tag]!=undefined){
			let p = this.find_bot('z', this.COTANIE[tag])
			let t = this.interp(p, 'TSn', 'linear')
			return [p,t]
		}
		return null
	}
	
    
	compute_index(){
		//console.log("compute_index")
		let p3   = 300.
		let p5   = 500.
		let p7   = 700.
		let p8   = 850.
		let ps   = this.bot.p
		let Ts   = this.interp(ps, 'T') 
		let Tds  = this.interp(ps, 'Td')
		let T5   = this.interp(p5, 'T') 
		let Td5  = this.interp(p5, 'Td')
		let T7   = this.interp(p7, 'T') 
		let Td7  = this.interp(p7, 'Td')
		let T8   = this.interp(p8, 'T') 
		let Td8  = this.interp(p8, 'Td')
		let r8   = this.interp(p8, 'r')
		let z5   = this.interp(p5, 'z')
		let z7   = this.interp(p7, 'z')
		let T5v  = this.interp(p5, 'Tv') 
		let Td5v = this.interp(p5, 'Td')
		let T7v  = this.interp(p7, 'Tv') 
		let Td7v = this.interp(p7, 'Td')

		//console.log( p3,p5,p7,p8,ps)
		// console.log( 'Ts', Ts, Tds)
		// console.log( T5, Td5)
		// console.log( T7, Td7)
		// console.log( T8, Td8)
		// console.log( z7,z5)
		// console.log( T5v, Td5v)
		// console.log( T7v, Td7v)
			
        this.K     = T8 - T5 + Td8 - T7 + Td7
        this.TT    = Td8 + T8 - 2.*T5
        this.ISOC  = this.find_botz('T', 0)
        this.ISOW  = this.find_botz('Tw', 0)
        this.PW    = this.pw(p3,ps)
        this.PW5   = this.pw(p5,p7)
        this.PW7   = this.pw(p7,p8)
        this.PW8   = this.pw(p8,ps)
        this.DTZ75 = (T7-T5)/(z7-z5) // gradiente 700-500 hPa
		let ad85   = AdiabLift.from_pTTd(p8,T8,Td8) //let ad85 = new AdiabLift(p8, T8, r8)
		this.SHOW  = T5 - ad85.interp(p5, 'T')

        //this.trace_index()
	}
	

    /** 
    * ECMWF CAPE
    */
    cape_ecmwf(p,t,r, ptop, pbot){
        //console.log("================== CAPE ECMWF ===============")
        //console.log(p,t,r, ptop, pbot)
        //t = tv(t,r)
        let thep = thec(t,p,r) // Equivalent potential temperature of the parcel
        let CAPE  = 0
        for (let l of this.layers(ptop, pbot, 'inner')){ 
            //if (Layer.half(l,param)<0){
            let thesattop = thec(l[0].T, l[0].p, l[0].rw) // Environmental saturated equivalent potential temperature
            let thesatbot = thec(l[1].T, l[1].p, l[1].rw) // Environmental saturated equivalent potential temperature
            //let thesattop = thec(l[0].Tv, l[0].p, l[0].rwv) 
            //let thesatbot = thec(l[1].Tv, l[1].p, l[1].rwv) 
            let thesatmed = 0.5*(thesattop+thesatbot)
            let incCAPE = RD*Layer.deltaln(l,'p')*(thesatmed-thep)
            CAPE += incCAPE
            //console.log(incCAPE, CAPE, l[0].p, l[1].p)
        }   
        return CAPE
        

//        let thep = thec(t,p,r) // Equivalent potential temperature of the parcel
//        let CAPE  = 0
//        for (let l of this.layers(ptop, pbot, 'inner')){ 
//            let incz = l[0].z - l[1].z
//            let thesattop = thec(l[0].T, l[0].p, l[0].rw) // Environmental saturated equivalent potential temperature
//            let thesatbot = thec(l[1].T, l[1].p, l[1].rw) // Environmental saturated equivalent potential temperature
//            let thesatmed = 0.5*(thesattop+thesatbot)
//            let incCAPE = G*incz*(thep-thesatmed)/thesatmed
//            CAPE += incCAPE
//            console.log(incCAPE, CAPE, l[0].p, l[1].p)
//        }   
//        return CAPE
    }


	
	mucape_modellevels(pmin){
       
		
		// surface effective shear
		let ad = new AdiabLift(this.bot.p, this.bot.T, this.bot.r)
		ad.comp(this)
		if (ad.CAPEv && ad.ELv){
        	this.HEFFSHEARBs = this.interp(this.bot.p, 'zg')
            this.HEFFSHEARTs = this.interp((this.bot.p+ad.ELv)*0.5, 'zg')
		}

		// mix conditions for initial levels
		let mixlimit = 60 // 60
		let mixthick = 30 // 30
		
		for (let l of this.levels(pmin, this.bot.p, 'inner', true, true)){
			
			let px 
			let Tx
			let rx
            let mixed = false
			
			// IFS: first 60 hPa - mixed layer of 30 hPa thickness
			if ((this.bot.p-l.p)<mixlimit){
				let pbot = l.p
				let ptop = l.p-mixthick
				px = (pbot+ptop)/2
				let Thx = this.mean('Th', ptop, pbot, 'exact')
				Tx = tc_from_thcp(Thx,px)
				rx = this.mean('r',  ptop, pbot, 'exact')
				mixed = true
                //console.log("mucape mix", px, Tx, rx)
                
			} else {
				px = l.p
				Tx = l.T
				rx = l.r
				//console.log("mucape lvl", px, Tx, rx)
			}
			
			// adiabat lift
            console.log("mucape lvl", px, Tx, rx, mixed)
			let ad = new AdiabLift(px, Tx, rx)
            if (ad==null) continue
			ad.comp(this)
            
            // cape IFS
            //cape_ecmwf(px, Tx, rx, ad.LFC, ad.EL)

			
            // DEBUG: optimización de ascensos
            let l0 = ad.bot
            let adthw = ad.bot.Thw //thwc(Tx, px, rx)
            let adthe = ad.bot.The //thec(Tx, px, rx)
            //console.log(l.n,l.p, this.Thwsm, adthw, ad.diffthw, adthw<this.Thwsm, ad.CAPE, ad.CAPEv) //adthe
            //console.log(l.n,l.p, this.Thwsm, this.Thwvsm, adthw, ad.diffthw, adthw<this.Thwvsm, ad.CAPE, ad.CAPEv) //adthe
            if (px<this.pThwvsm && ad.CAVEv){
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!! px<this.pThwvsm && ad.CAVEv")
            }
            
            
			// MUCAPE
			if (ad.CAPEv){
				// MUCAPE
				if (ad.CAPEv>this.MUCAPE) {
					this.MUCAPE = ad.CAPEv
					this.MUCIN  = ad.CINv
					this.MUp = px
					this.MUT = Tx
					this.MUr = rx
					
					// Effective Bulk Shear
					if ((this.bot.p-l.p)<=300 && ad.ELv){
						this.HEFFSHEARB = this.interp(px, 'zg')
	                    this.HEFFSHEART = this.interp((px+ad.ELv)*0.5, 'zg')
					}
				}
			}
			
			// ESRH - Effective Storm-Relative Helicity Heights
            // All parcel lifts from model levels 
            if (mixed==true){
                px = l.p
                Tx = l.T
                rx = l.r
                ad = new AdiabLift(px, Tx, rx)
                ad.comp(this)
            }
           
			if (ad.CINv<250. && ad.CAPEv>100.){
                 if (this.EFFBAS==null){ 
                     this.EFFBAS  = px
                     this.HEFFBAS = this.interp(px, 'zg')
                 }
			} else {
                 if (this.EFFBAS!=null && this.EFFTOP==null){
                    this.EFFTOP  = px
	                this.HEFFTOP = this.interp(px, 'zg')
                 } 
			}
		} // for
	}
	
	
	/** */
	compute_advanced_index(){
		//console.log("compute_advanced_index")
		
        this.MUCAPE  = null // Most Unstable Convective Available Potential Energy
        this.MUCIN   = null // CIN of MUCAPE parcel
        this.MUp     = null // Pressure of MU parcel
        this.MUT     = null // Temperature of MU parcel
        this.MUr     = null // Mixing ratio of MU parcel
        
        // Effective Storm-Relative Helicity
        this.ESRHL   = null // Effective Storm-Relative Helicity Left
        this.ESRHR   = null // Effective Storm-Relative Helicity Right
        this.EFFBAS  = null // Base for ESRH (First level with CINv<250. && CAPEv>100.)
        this.HEFFBAS = null // Height above ground of EFFBAS
        this.EFFTOP  = null // Top for ESRH (Doesn't comply CINv<250. && CAPEv>100., and EFFBAS exists)
        this.HEFFTOP = null // Height above ground of EFFTOP
        
        this.CIZE  = null // Effective Bulk Shear 
        this.CIZEs = null // Effective Bulk Shear for surface parcel
        this.HEFFSHEARB  = null // Base for CIZE
        this.HEFFSHEART  = null // Top for CIZE (1/2 height of MU parcel to EL)
        this.HEFFSHEARBs = null // Surface height for CIZEs (first level)
        this.HEFFSHEARTs = null // Top for CIZEs
 
        this.SCP2L = null // Supercell Composite Parameter
        this.SCP2R = null // Supercell Composite Parameter
		
		// MUCAPE
        //console.log("=================== MUCAPE START===================")
        let pmin = 350.
        this.mucape_modellevels(pmin)
        //console.log("===================MUCAPE END===================")
		
        // assign EFFTOP in case is missing 
		if (this.EFFBAS!=null && this.EFFTOP==null){
            this.EFFTOP  = pmin
            this.HEFFTOP = this.interp(pmin, 'zg')
        } 
		// ESRH - Effective Storm-Relative Helicity
		if (this.HEFFTOP>(this.HEFFBAS+Number.EPSILON)){
            this.ESRHL = this.computeSRH(this.HEFFBAS,this.HEFFTOP,this.BUNKERSLU,this.BUNKERSLV)
            this.ESRHR = this.computeSRH(this.HEFFBAS,this.HEFFTOP,this.BUNKERSRU,this.BUNKERSRV)
		}

		// CIZE - Effective Bulk Shear
		if (this.HEFFSHEARB){
			let ub = this.interzg(this.HEFFSHEARB,  'u')
			let vb = this.interzg(this.HEFFSHEARB,  'v')
			let ut = this.interzg(this.HEFFSHEART,  'u')
			let vt = this.interzg(this.HEFFSHEART,  'v')
			this.CIZE = Math.hypot(ut-ub,vt-vb)
		}
		if (this.HEFFSHEARBs){
			let ub = this.interzg(this.HEFFSHEARBs,  'u')
			let vb = this.interzg(this.HEFFSHEARBs,  'v')
			let ut = this.interzg(this.HEFFSHEARTs,  'u')
			let vt = this.interzg(this.HEFFSHEARTs,  'v')
			this.CIZEs = Math.hypot(ut-ub,vt-vb)
		}
//		console.log( "HEFFSHEAR", this.HEFFSHEARB, this.HEFFSHEART)
//        console.log( "HEFFSHEARs", this.HEFFSHEARBs, this.HEFFSHEARTs)
//        console.log( "CIZE", this.CIZE*MKNOT)
//        console.log( "CIZEs", this.CIZEs*MKNOT)
		
        // SCP2 
        if (this.MUCAPE){
        	// Close Proximity Soundings within Supercell Environments Obtained from the Rapid Update Cycle
            // Thompson, Edwards, Hart, Elmore, Markowski
            // American Meteorological Society
            // Pag. 1256

            let cte = 1E-6
            let shearterm = null
            
            if (this.CIZE){
            	shearterm = this.CIZE ///MKNOT
                if      (shearterm < 10) shearterm = 0.0
                else if (shearterm > 20) shearterm = 20.0
            }
            if (shearterm!=null && this.ESRHL) {
            	this.SCP2L = cte*this.MUCAPE*shearterm*(-this.ESRHL)
            	if (this.SCP2L<0) this.SCP2L = 0
            }
            if (shearterm!=null && this.ESRHR) {
            	this.SCP2R = cte*this.MUCAPE*shearterm*(this.ESRHR)
            	if (this.SCP2R<0) this.SCP2R = 0
            }
        }
        
		// MU parcel
		//console.log("MUPARCEL", this.MUp, this.MUT, this.MUr)
		if (this.MUT!=null){
			this.parcels['MU'] = this.compute_parcel(this.MUp, this.MUT, this.MUr)
			//console.log("dd","MU","pl",this.MUp,"Tl", this.MUT, "rl", this.MUr)
            
            let cape2 = this.cape_ecmwf(this.MUp, this.MUT, this.MUr, this.parcels['MU'].ELv, this.parcels['MU'].LFCv)

            console.log("MUCAPE TDDJS:", this.parcels['MU'].CAPEv)
            console.log("MUCAPE ECMWF:", cape2)
            
		} else {
			//this.parcels['MU'] = null
		}
		

        
	}	
	

	/**
	 * 
	 */
	compute_parcels(parcels){
		for (let dd of parcels){
            let pmed,rl,Tl
            if (dd==0){
                pmed = this.bot.p
                rl   = this.bot.r
                Tl   = this.bot.T
            } else {
    			// mean p,T,r in layer 
    			let pbot = this.bot.p
    			let ptop = pbot - dd
    			pmed = pbot - dd/2.			
    			let Thl = this.mean('Th', ptop, pbot, 'exact') // skewt-> inner
    			rl  = this.mean('r',  ptop, pbot, 'exact') // skewt-> inner
    			Tl  = tc_from_thcp(Thl,pmed)
            }
            
			// adiablift
			let ad = this.compute_parcel(pmed, Tl, rl)
			this.parcels[dd] = ad
            
            // debug
            //if (dd!=0) continue
            //this.cape_ecmwf(pmed, Tl, rl, ad.EL, ad.LFC)
            //console.log(ad.CAPE, ad.CAPEv)
		}
	}
	
	/**
	 * 
	 */
	compute_parcel(p, T, r){
		
		let ad = new AdiabLift(p, T, r)
		ad.comp(this) 
		
		// CCL, CCT, CT 	
		ad.CCL = this.find_top('rw', ad.r0)
		if (ad.CCL) {
			ad.CCT  = this.interp(ad.CCL, 'T')
			ad.zCCL = this.interp(ad.CCL, 'zg')
			ad.CT   = (ad.CCT + c0)*Math.pow(this.bot.p/ad.CCL, XI) - c0 
		}

		// CCLv, CCTv, CTv
		ad.CCLv = this.find_top('rwv', ad.r0)
		if (ad.CCLv) {
			ad.CCTv  = this.interp(ad.CCLv, 'Tv')
			ad.zCCLv = this.interp(ad.CCLv, 'zg')
			ad.CTv   = (ad.CCTv + c0)*Math.pow(this.bot.p/ad.CCLv, XI) - c0 
		}
		//console.log("NCC", ad.CCL,ad.CCLv)
		//console.log("zNCC", ad.zCCL,ad.zCCLv)
		//console.log("TCC", ad.CCT, ad.CCTv)
		//console.log("TDIS", ad.CT, ad.CTv)
		//console.log("TCC", ad.CCT, "TCC", ad.CCT, "TDIS", ad.CT)
		
		// BRN, VGP, EHI*
		if (ad.CAPE){
			if (this.qqq>0) ad.BRN = ad.CAPE*2./this.qqq
			ad.VGPold   = Math.sqrt(ad.CAPE)*this.CIZ06/((6000.-this.bot.zg)*MKNOT)
            ad.VGP   = Math.sqrt(ad.CAPE)*this.MCIZ06
			ad.EHIL1 = ad.CAPE*(-this.SRHL1)/160000
            ad.EHIR1 = ad.CAPE*( this.SRHR1)/160000
            ad.EHIL3 = ad.CAPE*(-this.SRHL3)/160000
            ad.EHIR3 = ad.CAPE*( this.SRHR3)/160000
		}
		if (ad.CAPEv){
			if (this.qqq>0) ad.BRNv = ad.CAPEv*2./this.qqq
			ad.VGPvold = Math.sqrt(ad.CAPEv)*this.CIZ06/((6000.-this.bot.zg)*MKNOT)
            ad.VGPv   = Math.sqrt(ad.CAPEv)*this.MCIZ06
			ad.EHIL1v = ad.CAPEv*(-this.SRHL1)/160000
            ad.EHIR1v = ad.CAPEv*( this.SRHR1)/160000
            ad.EHIL3v = ad.CAPEv*(-this.SRHL3)/160000
            ad.EHIR3v = ad.CAPEv*( this.SRHR3)/160000
		}
		if (ad.EHIL1 <0) ad.EHIL1 =0.0
		if (ad.EHIL1v<0) ad.EHIL1v=0.0
		if (ad.EHIR1 <0) ad.EHIR1 =0.0
		if (ad.EHIR1v<0) ad.EHIR1v=0.0
		if (ad.EHIL3 <0) ad.EHIL3 =0.0
		if (ad.EHIL3v<0) ad.EHIL3v=0.0
		if (ad.EHIR3 <0) ad.EHIR3 =0.0
		if (ad.EHIR3v<0) ad.EHIR3v=0.0
		
//		console.log("BRN", ad.BRN,ad.BRNv)
//		console.log("VGP", ad.VGP,ad.VGPv, ad.VGPvold)
//		console.log("EHIL1", ad.EHIL1,ad.EHIL1v)
//		console.log("EHIR1", ad.EHIR1,ad.EHIR1v)
//		console.log("EHIL3", ad.EHIL3,ad.EHIL3v)
//		console.log("EHIR3", ad.EHIR3,ad.EHIR3v)
        
		// STP - Significant Tornado Parameter
        let cte = 1./3E9
        if (this.SRHL1){
           let ctl = this.CIZ06/MKNOT*(-this.SRHL1)*cte
           if (ad.CAPE)  ad.STPL  = ctl*ad.CAPE *(2000.-ad.zLCL)
           if (ad.CAPEv) ad.STPLv = ctl*ad.CAPEv*(2000.-ad.zLCL)
           if (ad.STPL<0)  ad.STPL = 0
           if (ad.STPLv<0) ad.STPLv = 0
        }
        if (this.SRHR1){
            let ctr = this.CIZ06/MKNOT*(-this.SRHR1)*cte
            if (ad.CAPE)  ad.STPR  = ctr*ad.CAPE *(2000.-ad.zLCL)
            if (ad.CAPEv) ad.STPRv = ctr*ad.CAPEv*(2000.-ad.zLCL)
            if (ad.STPR<0)  ad.STPR = 0
            if (ad.STPRv<0) ad.STPRv = 0
        }
        
		// STP2 - Significant Tornado Parameter 2 (requires Effective Layer)
        let cte2 = 1./1.35E12
        var shearterm = null
        if (this.CIZEs){
        	shearterm = this.CIZEs ///MKNOT
            if      (shearterm < 10.0)  shearterm = 0.0
            else if (shearterm > 30.0)  shearterm = 30.0
        }
        //console.log("STP2", this.CIZEs, shearterm, this.ESRHL, this.ESRHR)
        if (shearterm!=null && this.ESRHL) { 
        	let ctl2=(-this.ESRHL)*shearterm*cte2 
            if (ad.CAPE)  ad.STP2L  = ctl2*ad.CAPE *(2000.-ad.zLCL)*(250-ad.CIN)
            if (ad.CAPEv) ad.STP2Lv = ctl2*ad.CAPEv*(2000.-ad.zLCL)*(250-ad.CINv)
            if (ad.STP2L<0)  ad.STP2L  = 0
            if (ad.STP2Lv<0) ad.STP2Lv = 0
        }
        if (shearterm!=null && this.ESRHR) { 
        	let ctr2=(this.ESRHR)*shearterm*cte2 
            if (ad.CAPE)  ad.STP2R  = ctr2*ad.CAPE *(2000.-ad.zLCL)*(250-ad.CIN)
            if (ad.CAPEv) ad.STP2Rv = ctr2*ad.CAPEv*(2000.-ad.zLCL)*(250-ad.CINv)
            if (ad.STP2R<0)  ad.STP2R  = 0
            if (ad.STP2Rv<0) ad.STP2Rv = 0
        }
        
        // SCP (SCP2 in compute_advanced_index)
        if (this.MUCAPE){
        	// Close Proximity Soundings within Supercell Environments Obtained from the Rapid Update Cycle
            // Thompson, Edwards, Hart, Elmore, Markowski
            // American Meteorological Society
            // Pag. 1256

        	// SCP
            cte = 1./4000000.
            if (this.SRHL3){
                let ctl=this.MUCAPE*(-self.SRHL3)*cte
                if (this.BRN)  ad.SCPL  = cte*this.ad.CAPE /this.BRN
                if (this.BRNv) ad.SCPLv = cte*this.ad.CAPEv/this.BRNv
                if (ad.SCPL<0)  ad.SCPL  = 0
                if (ad.SCPLv<0) ad.SCPLv = 0
        	} 
            if (this.SRHL3){
                let ctr=this.MUCAPE*(-self.SRHR3)*cte
                if (this.BRN)  ad.SCPR  = cte*this.ad.CAPE /this.BRN
                if (this.BRNv) ad.SCPRv = cte*this.ad.CAPEv/this.BRNv
                if (ad.SCPR<0)  ad.SCPR  = 0
                if (ad.SCPRv<0) ad.SCPRv = 0
        	}    
        }
		
		//ad.trace()
		
		return ad
	}
	
	
	compute_shear(){
		//console.log("compute_shear")
		
		// wind at different heights
		let v0  = this.bot.v
		let u0  = this.bot.u
		let u05 = this.interzg(500.,  'u')
		let v05 = this.interzg(500.,  'v')
		let u1  = this.interzg(1000., 'u')
		let v1  = this.interzg(1000., 'v')
		let u2  = this.interzg(2000., 'u')
		let v2  = this.interzg(2000., 'v')
		let u3  = this.interzg(3000., 'u')
		let v3  = this.interzg(3000., 'v')
		let u4  = this.interzg(4000., 'u')
		let v4  = this.interzg(4000., 'v')
		let u5  = this.interzg(5000., 'u')
		let v5  = this.interzg(5000., 'v')		
		let u55 = this.interzg(5500., 'u')
		let v55 = this.interzg(5500., 'v')
		let u6  = this.interzg(6000., 'u')
		let v6  = this.interzg(6000., 'v')
		let u7  = this.interzg(7000., 'u')
		let v7  = this.interzg(7000., 'v')
		let u8  = this.interzg(8000., 'u')
		let v8  = this.interzg(8000., 'v')
		// values for hodograph 
		this.utags = [u05,u1,u2,u3,u4,u5,u6,u7,u8]
		this.vtags = [v05,v1,v2,v3,v4,v5,v6,v7,v8]
		// mean wind density
		let wd05 = this.mean_wind2(this.bot.zg,  500., 10)
		let wd6  = this.mean_wind2(this.bot.zg, 6000., 50)
		this.CIZD056 = Math.hypot(wd6[0]-wd05[0],wd6[1]-wd05[1])
        this.qqq=(this.CIZD056)**2 //this.qqq=(CIZD056/MKNOT)**2
		// mean wind
		let wm6  = this.mean_wind(this.bot.zg, 6000., 50)
		this.um6 = wm6[0]
		this.vm6 = wm6[1]
		// wind shear
		this.CIZ08 = Math.hypot(u8-u0,v8-v0)
        this.CIZ06 = Math.hypot(u6-u0,v6-v0)
        this.CIZ03 = Math.hypot(u3-u0,v3-v0)
        this.CIZ01 = Math.hypot(u1-u0,v1-v0)
        // mean shear
        this.MCIZ06 = this.mean_shear(this.bot.zg, 6000)
		// bunkers
        this.um005 = 0.5*(u0+u05)
        this.vm005 = 0.5*(v0+v05)
        this.um556 = 0.5*(u6+u55)
        this.vm556 = 0.5*(v6+v55)
        let aa1 = this.um556-this.um005
        let bb1 = this.vm556-this.vm005
        let fff = 7.5/Math.hypot(aa1,bb1) // la perpendicular de (a,b) a la derecha es (b,-a)  //let fff = 7.5*MKNOT/Math.hypot(aa1,bb1)
        let aa2 = bb1*fff
        let bb2 = -aa1*fff
        this.BUNKERSRU  = this.um6+aa2
        this.BUNKERSRV  = this.vm6+bb2
        this.BUNKERSLU  = this.um6-aa2
        this.BUNKERSLV  = this.vm6-bb2
        this.BUNKERSLWS = Math.hypot(this.BUNKERSLU,this.BUNKERSLV)
        this.BUNKERSLWD = Math.atan2(this.BUNKERSLV,this.BUNKERSLU)*RAD2DEG
        this.BUNKERSRWS = Math.hypot(this.BUNKERSRU,this.BUNKERSRV)
        this.BUNKERSRWD = Math.atan2(this.BUNKERSRV,this.BUNKERSRU)*RAD2DEG
        this.WSM06 = Math.hypot(this.um6,this.vm6)
        this.WDM06 = Math.atan2(this.vm6,this.um6)*RAD2DEG
        this.SRHL1  = this.computeSRH(this.bot.zg, 1000.,this.BUNKERSLU,this.BUNKERSLV)
        this.SRHR1  = this.computeSRH(this.bot.zg, 1000.,this.BUNKERSRU,this.BUNKERSRV)
        this.SRHL3  = this.computeSRH(this.bot.zg, 3000.,this.BUNKERSLU,this.BUNKERSLV)
        this.SRHR3  = this.computeSRH(this.bot.zg, 3000.,this.BUNKERSRU,this.BUNKERSRV)
        this.SRHL6  = this.computeSRH(this.bot.zg, 6000.,this.BUNKERSLU,this.BUNKERSLV)
        this.SRHR6  = this.computeSRH(this.bot.zg, 6000.,this.BUNKERSRU,this.BUNKERSRV)
        this.SRHL13 = this.computeSRH(1000.,       3000.,this.BUNKERSLU,this.BUNKERSLV)
        this.SRHR13 = this.computeSRH(1000.,       3000.,this.BUNKERSRU,this.BUNKERSRV)
        
        //_trace_shear()
	}

	
	_trace_shear(){
		console.log("== trace shear ==")
        console.log("um6", this.um6)
		console.log("vm6", this.vm6)
		console.log("CIZ08", this.CIZ08)
		console.log("CIZ06", this.CIZ06)
		console.log("CIZ03", this.CIZ03)
		console.log("CIZ01", this.CIZ01)
        console.log("SRHL1", this.SRHL1)
        console.log("SRHR1", this.SRHR1)
        console.log("SRHL3", this.SRHL3)
        console.log("SRHR3", this.SRHR3)
        console.log("SRHL6", this.SRHL6)
        console.log("SRHR6", this.SRHR6)
        console.log("SRHL13", this.SRHL13)
        console.log("SRHR13", this.SRHR13)
	}
	
	/**
	 * 
	 */
	computeSRH(zgbot, zgtop, uref, vref, k=30){
		//SRH = Sum [(un+1 − cx)(vn − cy) − (un − cx)(vn+1 − cy)], (8.15)
        let srh = 0.
        let zginc = (zgtop-zgbot)/(k-1)
        let u9= null // previous ui value 
        let v9= null // previous vi value
		for (let i=0; i<k; i++){
			let pi = this.find_bot('zg', zgbot + zginc*i)
			let ui = this.interp(pi, 'u')
			let vi = this.interp(pi, 'v')
			if (i>0){ srh += (ui-uref)*(v9-vref)-(vi-vref)*(u9-uref) } 				            
            u9 = ui
            v9 = vi
		}
        //return srh/(MKNOT**2)
        return srh
	}
    
    /**
     * 
     */
    computeSRH2(zgbot, zgtop, uref, vref, k=30){
        //SRH = Sum [(un+1 − cx)(vn − cy) − (un − cx)(vn+1 − cy)], (8.15)
        let srh = 0.
        let zginc = (zgtop-zgbot)/(k-1)
        let u9= null // previous ui value 
        let v9= null // previous vi value
        for (let i=0; i<k; i++){
            let pi = this.find_bot('zg', zgbot + zginc*i)
            let ui = this.interp(pi, 'u')
            let vi = this.interp(pi, 'v')
            if (i>0){ srh += (ui-uref)*(v9-vref)-(vi-vref)*(u9-uref) }                          
            u9 = ui
            v9 = vi
        }
        //return srh/(MKNOT**2)
        return srh
    }
	
    
    /**
     * Mean shear. Length of the hodograph divided by the depth.
     * Typically calculated between first height level and 6000 m AGL.  
     * @param {number} zgtop - top height above ground [m]
     * @param {number} zgbot - bottom height above ground [m]
     */
    mean_shear(zgbot, zgtop){
        //let pbot = this.bot.p 
        let pbot = this.find_bot('zg', zgbot)
        if (pbot>this.bot.p) pbot=this.bot.p  
        let ptop = this.find_bot('zg', zgtop)
        let hlon = 0        
        for (let l of this.layers(ptop, pbot, 'exact', true)){
            hlon += Math.hypot(l[0].u-l[1].u, l[0].v-l[1].v)
        }     
        //console.log(hlon, this.CIZ06, pbot, ptop)        
        return hlon/(zgtop-zgbot)          
    }
    
	
	/**
	 * Mean wind for Bunkers calculations
	 * Typically calculated between first height level and 6000 m.  
	 * @param {number} zgtop - top height above ground [m]
	 * @param {number} zgbot - bottom height above ground [m]
	 * @param {number} k - number of levels between zgbot and zgtop 
	 * @returns {number} mean wind in the layer 
	 */
	mean_wind(zgbot, zgtop, k=50){
		let zginc = (zgtop-zgbot)/(k-1)
		let um = 0
		let vm = 0
		for (let i=0; i<k; i++){
            let zi = zgbot + zginc*i
            um += this.interzg(zi, 'u')
            vm += this.interzg(zi, 'v')
		}
		um /= k
		vm /= k
		return [um, vm]
	}
	
	
	/*
	 * Mean wind density weighted
	 * sounding.py L.570-610 
	 */
	mean_wind2(zgbot, zgtop, k=50){
		let zginc = (zgtop-zgbot)/(k-1)
		let sr = 0
		let ru = 0
		let rv = 0
		for (let i=0; i<k; i++){
			//console.log(i, zgbot + inczg*i)
			let pi  = this.find_bot('zg', zgbot + zginc*i)
			let ui  = this.interp(pi, 'u')
			let vi  = this.interp(pi, 'v')
	        let tvi = this.interp(pi, 'Tv')+c0
	        let rhoi = pi/(RD*tvi)
	        sr += rhoi
	        ru += ui*rhoi
	        rv += vi*rhoi
		}
		return [ru/sr, rv/sr]
	}

	
	/**
	 * Precipitable Water [mm]
	 * @param {number} pt - Top pressure [hPa]
	 * @param {number} pb - Bottom pressure [hPa]
	 * @returns {number} - Precipitable Water [mm]
	 */
	pw(pt,pb){
		let pw_sum = 0
		for (let l of this.layers(pt, pb, 'exact', true)){
			//let q_med = (l[0].q + l[1].q) / 2 ??? q or r
			let r_med = (l[0].r + l[1].r) / 2 
			let p_inc = (l[0].p - l[1].p)*1000 // hPa to Pa
			pw_sum  += -(r_med*p_inc) // [kg/m²]
		}		
		let t_sfc = this.bot.T 
		let rho = waterDensity(t_sfc) * 1000 // [kg/m³]
		return (100*pw_sum) / (rho*G) // factor 100 [m]->[mm]
	}
	
	
	/**	 */
	trace_index(){
		console.log("== trace index ==")
		console.log('K', this.K)
		console.log('SI', this.SHOW)
		console.log('TT', this.TT)
		console.log('ISOC', this.ISOC)
		console.log('ISOW', this.ISOW)
		console.log('PW', this.PW)
		console.log('PW5', this.PW5)
		console.log('PW7', this.PW7)
		console.log('PW8', this.PW8)
		console.log('DTZ75', this.DTZ75)
		//console.log("ciz056",this.ciz056)
        console.log("qqq", this.qqq)
	}
	
	/** Version skewt */
	mucape_eqpress(){

		console.log("==== MUCAPE ====")
		let ps = this.bot.p // bottom level pressure
		let pt = 350. // top level pressure
		let tt = 50 // number of parcels
		let qq = (pt-ps)/(tt-1) // pressure interval
		for (let cc=0; cc<tt; cc++){
			//console.log("cc", cc)
			let pres = ps+cc*qq
			let Tm = this.interp(pres, "T")
			let rm = this.interp(pres, "r")
			ad = new AdiabLift(pres, Tm, rm)
			ad.comp(this)

			//let ef = false
			if (ad.CAPEv){
				
				console.log("MUCAPE", this.MUCAPE, ad.CAPEv)
				// MUCAPE
				if (ad.CAPEv>this.MUCAPE) {
					this.MUCAPE = ad.CAPEv
					this.MUCIN  = ad.CINv
					this.MUp = pres
					this.MUT = Tm
					this.MUr = rm
					
					if ((ps-pres)<=300){
						console.log("XXX", pres)
						this.HEFFSHEARB = this.interp(pres, 'zg')
	                    this.HEFFSHEART = this.interp((pres+ad.EL)*0.5, 'zg')
					}
                    if (cc==0){
                    	this.HEFFSHEARBs = this.interp(pres, 'zg')
                        this.HEFFSHEARTs = this.interp((pres+ad.EL)*0.5, 'zg')
                    }  
				}
				if (ad.CINv<250. && ad.CAPEv>100.){
	                 if (this.EFFBAS==null){ 
	                     this.EFFBAS  = pres
	                     this.HEFFBAS = this.interp(pres, 'zg')
	                 }
				} else {
	                 if (this.EFFBAS!=null && this.EFFTOP==null){
                        this.EFFTOP  = pres
		                this.HEFFTOP = this.interp(pres, 'zg')
	                 } 
				}
			}
			
		} // for
	}
}














///** COPIA !!*/
//compute_advanced_index(){
//	console.log("compute_advanced_index")
//	
//    this.MUCAPE  = null // Most Unstable Convective Available Potential Energy
//    this.MUCIN   = null // CIN at 
//    this.LPL     = null // Pressure level of MU parcel
//    
//    // Effective Storm-Relative Helicity
//    this.ESRHL   = null // Effective Storm-Relative Helicity Left
//    this.ESRHR   = null // Effective Storm-Relative Helicity Right
//    this.EFFBAS  = null // Base for ESRH (First level with CINv<250. && CAPEv>100.)
//    this.HEFFBAS = null // Height above ground of EFFBAS
//    this.EFFTOP  = null // Top for ESRH (Doesn't comply CINv<250. && CAPEv>100., and EFFBAS exists)
//    this.HEFFTOP = null // Height above ground of EFFTOP
//    
//    
//    this.CIZE = null  // Effective Bulk Shear 
//    this.CIZEs = null // Effective Bulk Shear for surface parcel
//    this.HEFFSHEARB  = null // Base for CIZE
//    this.HEFFSHEART  = null // Top for CIZE (1/2 height of MU parcel to EL)
//    this.HEFFSHEARBs = null // Surface height for CIZEs (first level)
//    this.HEFFSHEARTs = null // Top for CIZEs
//  
//    // movido aqui arriba
//    this.SCP2L = null
//    this.SCP2R = null
//	
//	
//	let ps = this.bot.p // bottom level pressure
//	let pt = 350. // top level pressure
//	let tt = 50 // number of parcels
//	let qq = (pt-ps)/(tt-1) // pressure interval
//	//let mcpd = null
//	for (let cc=0; cc<tt; cc++){
//		//console.log("cc", cc)
//		let pres = ps+cc*qq
//		let Tm = this.interp(pres, "T")
//		let rm = this.interp(pres, "r")
//		ad = new AdiabLift(pres, Tm, rm)
//		ad.comp(this)
//
////		// DEBUG 1: filter some parcels by Thw 
////		let TLCL = ad.interp(ad.LCL, "T")
////		let rLCL = ad.interp(ad.LCL, "r")
////		let ThwLCL = thwc(TLCL, ad.LCL, rLCL)  // setThw
////		let TLCLv = ad.interp(ad.LCLv, "Tv")
////		let rLCLv = ad.interp(ad.LCLv, "r")
////		let ThwLCLv = thwc(TLCLv, ad.LCLv, rLCLv)  // setThw
////		//console.log("pres",pres,"Tm",Tm,"rm",rm,"CAPE", ad.CAPE, ad.CAPEv, ThwLCL, ThwLCLv, this.Thwm, this.pThwm, ad.LCL)			
////		// DEBUG 2: comparte This.Thwm con Thwm al nivel this.pThwm, efectivamente para diferencias negativas no hay cape
////		//Se puede descartar ascensos por encima del pThwm. tiene pinta que no darán cape ,pero puede que acaben cruzando!!!
////		let Taaa = ad.interp(this.pThwm, "T")
////		let raaa = ad.interp(this.pThwm, "r")
////		let Thwm = thwc(Taaa, this.pThwm, raaa)  // setThw
////		console.log("pres",pres,"CAPE", ad.CAPE, ad.CAPEv, Thwm, this.Thwm, this.Thwm-Thwm)
////		// nDEBUG 3: diff ThwLCL y THwEL tratar de deducir incrementso de Thw desde LCL
////		let TLCL = ad.interp(ad.LCL, "T")
////		let rLCL = ad.interp(ad.LCL, "r")
////		let ThwLCL = thwc(TLCL, ad.LCL, rLCL)  // setThw		
////		let ThwTop = thwc(ad.top.T, ad.top.p, ad.top.r)  // setThw	
////		console.log("Thw",ThwLCL,ThwTop,ThwTop-ThwLCL)
//
//		let ef = false
//		if (ad.CAPEv){
//			
//			// MUCAPE
//			if (ad.CAPEv>this.MUCAPE) {
//				this.MUCAPE = ad.CAPEv
//				this.MUCIN  = ad.CINv
//				this.LPL = pres
//				this.parcels['MU'] = ad
//				if ((ps-pres)<=300){
//					this.HEFFSHEARB = this.interp(pres, 'zg')
//                    this.HEFFSHEART = this.interp((pres+ad.EL)*0.5, 'zg')
//				}
//                if (cc==0){
//                	this.HEFFSHEARBs = this.interp(pres, 'zg')
//                    this.HEFFSHEARTs = this.interp((pres+ad.EL)*0.5, 'zg')
//                }  
//			}
//			if (ad.CINv<250. && ad.CAPEv>100.){
//                 if (this.EFFBAS==null){ 
//                     this.EFFBAS  = pres
//                     this.HEFFBAS = this.interp(pres, 'zg')
//                 }
//			} else {
//                 if (this.EFFBAS!=null && this.EFFTOP==null){
//                    this.EFFTOP  = pres
//	                this.HEFFTOP = this.interp(pres, 'zg')
//                 } 
//			}
//		}
//		
//	} // for
//	
//    // assign EFFTOP in case is missing 
//	if (this.EFFBAS!=null && this.EFFTOP==null){
//        this.EFFTOP  = ptop
//        this.HEFFTOP = this.interp(ptop, 'zg')
//    } 
//	// ESRH - Effective Storm-Relative Helicity
//	if (this.HEFFTOP>(this.HEFFBAS+Number.EPSILON)){
//        this.ESRHL = this.computeSRH(this.HEFFBAS,this.HEFFTOP,this.BUNKERSLU,this.BUNKERSLV)
//        this.ESRHR = this.computeSRH(this.HEFFBAS,this.HEFFTOP,this.BUNKERSRU,this.BUNKERSRV)
//	}
//	// CIZE - Effective Bulk Shear
//	if (this.HEFFSHEARB){
//		let pb  = this.find_bot('zg', this.HEFFSHEARB)
//		let ub  = this.interp(pb, 'u')
//		let vb  = this.interp(pb, 'v')
//		let pt  = this.find_bot('zg', this.HEFFSHEART)
//		let ut  = this.interp(pt, 'u')
//		let vt  = this.interp(pt, 'v')		
//		this.CIZE = Math.hypot(ut-ub,vt-vb)
//	}
//	if (this.HEFFSHEARBs){
//		let pb  = this.find_bot('zg', this.HEFFSHEARBs)
//		let ub  = this.interp(pb, 'u')
//		let vb  = this.interp(pb, 'v')
//		let pt  = this.find_bot('zg', this.HEFFSHEARTs)
//		let ut  = this.interp(pt, 'u')
//		let vt  = this.interp(pt, 'v')		
//		this.CIZEs = Math.hypot(ut-ub,vt-vb)
//	}
//    // SCP2 
//    if (this.MUCAPE){
//    	// Close Proximity Soundings within Supercell Environments Obtained from the Rapid Update Cycle
//        // Thompson, Edwards, Hart, Elmore, Markowski
//        // American Meteorological Society
//        // Pag. 1256
//
//        let cte = 1E-6
//        let shearterm = null
//        
//        if (this.CIZE){
//        	shearterm = this.CIZE ///MKNOT
//            if      (shearterm < 10)  shearterm = 0.0
//            else if (shearterm > 20)  shearterm = 20.0
//        }
//        if (shearterm!=null && this.ESRHL) {
//        	this.SCP2L = cte*this.MUCAPE*shearterm*(-this.ESRHL)
//        	if (this.SCP2L<0) this.SCP2L = 0
//        }
//        if (shearterm!=null && this.ESRHR) {
//        	this.SCP2R = cte*this.MUCAPE*shearterm*(this.ESRHR)
//        	if (this.SCP2R<0) this.SCP2R = 0
//        }
//    }
//    
//}	

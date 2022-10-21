

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js from "tdd_list" begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/* Last merge : mié ago 24 12:10:50 UTC 2022  */

/* Merging order :

- ../src/physics/thermo.js
- ../src/physics/thlines.js
- ../src/physics/vertical.js
- ../src/physics/adiablift.js
- ../src/physics/sounding.js
- ../src/utils/io.js
- ../src/graphics/diagram.js

*/


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../src/physics/thermo.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


// Copyright 2018 Alvaro Subias Diaz-Blanco (AEMet)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/*
 * Notas:
Métodos acabaods en 
c: indican que la temperatura ha de pasarse en ºC, ej. ew() y ewc().
d: derivada
ld: derivada logarítmica
dc:
ldc:

t: temperature (ºC)
T: temperature (K)
p: pressure (hPa)
th: potential temperature (K)
thc: potential temperature (ºC)

Temperaturas:
=============
T: temperatura

Temperaturas secas:
-------------------
Tv: temperatura virutal 
Te o Tie: temperatura equivalente (isobárica)
Tae: temperatura adiabática equivalente o seudo-equivalente

Tempertaruas de saturación:
---------------------------
Td:  temperatura del punto de rocío
Tw:  temperatura del termómetro húmedo (denominada isobárica o termodinámica)
Taw: temperatura adiabática o pseudoadiabática del termómetro húmedo
Ts:  Temperatura de saturación


Ts < Td < Taw < Tw < T < Tv < Te < Tae

*/



c0 = 273.15 // - cero absoluto de temperatura [ºC]
RAD2DEG=180./Math.PI
DEG2RAD=1./RAD2DEG

RD = 287.05 // constante de los gases para el aire seco [J/kg*K]
RV = 461.51 // constante de los gases para el aire húmedo [J/kg*K]

CPD = 1005. // specific heats at constant pressure for dry air [J/kg*K] // calor específico a presión constante para el aire seco [J/kg*K]
CPV = 1850. // specific heats at constant pressure for water vapor [J/kg*K] // calor específico a presión constante para el aire húmedo [J/kg*K)]

CVD = CPD-RD // specific heats at constant volume for dry air [J/kg*K] // calor específico a volumen constante para el aire seco [J/kg*K]
CVV = CPV-RV // specific heats at constant volume for water vapor [J/kg*K] // calor específico a volumen constante para el aire húmedo [J/kg*K)]

G = 9.80665 // gravity acceleration [m/s²]

DP = -0.33333333 // pressure increment for parcel lifting [hPa] 
OFFSET_FAHRENHEIT_K = 459.67
OFFSET_FAHRENHEIT_C =   32.0
SCALE_FAHRENHEIT    =    1.8

PSEA = 1013.25 // pressure at sea level [hPa]
PST  = 1000.   // reference pressure [hPa]
PTOP =  100.   // top pressure [hPa]
PSTL = Math.log(PST)
   
// m/s = [MKNOT] kt
MKNOT = 1.94384 // m/s to kt conversion

EPS  = RD/RV
XI   = RD/CPD
XII  = 1./XI
XIDP = XI*DP

Z1 = 1./EPS
Z2 = EPS/CPD
Z8 = EPS/(CPD*PST)
Z9 = Z8/RV
RG = RD/G

KP   = null
KT   = null

AERK = true

A=[]
A.push(6.107799961)
A.push(4.436518521e-1)
A.push(1.428945805e-2)
A.push(2.650648471e-4)
A.push(3.031240396e-6)
A.push(2.034080948e-8)
A.push(6.136820929e-11)

B=[]
B.push(A[1])
B.push(A[2]*2.)
B.push(A[3]*3.)
B.push(A[4]*4.)
B.push(A[5]*5.)
B.push(A[6]*6.)


// An Efficient and Accurate Method for Computing the Wet-Bulb Temperature along Pseudoadiabats. Robert Davies-Jones (2007). eq. 3.8
// used in thwc()
DJA=[7.101574, -20.68208, 16.11182,   2.574631,   -5.20568]
DJB=[     1.0, -3.552497, 3.781782, -0.6899655, -0.5929340]

AERK0   = 6.1094
AERKA   = 17.625
AERKB   = 243.04
AERKAB  = AERKA *AERKB
AERKAB0 = AERKAB*AERK0
AERKABI = 1.0/AERKAB
AERKBI  = 1.0/AERKB

TETEN0  = 6.108
TETENA  = 7.4475
TETENB  = 234.07
TETENAB = TETENA*TETENB*Math.log(10)

//DLNP = Math.log(Conf.diagram_pmax/Conf.diagram_pmin)/Conf.adiab_lift_steps
DLNP = 0.004702 //0.004702 
KP = (2-DLNP)/(2+DLNP)
KT = KP-1
//console.log("KP", KP)
//console.log("KT", KT)

// Water density [l/m2] table [g/cm^3]
// https://water.usgs.gov/edu/density.html
TA1  = [  -99.0,     0.0,     4.0,     4.4,    10.0,    15.6,    21.0,    26.7,    32.3,    37.8,    48.9,    60.0,    71.1,    82.2,    93.3,   100.0]
RHOL = [0.99987, 0.99987, 1.00000, 0.99999, 0.99975, 0.99907, 0.99802, 0.99669, 0.99510, 0.99318, 0.98870, 0.98338, 0.97729, 0.97056, 0.96333, 0.95865]

// Calor latente de vaporización (Lv) [J/kg] y  calor específico del agua (Cw) [J/kg*K]
// Iribarne-Godson (pag. 279)
TA2 = [     -99,      -50,      -40,      -30,      -20,      -10,        0,        5,       10,       15,       20,       25,       30,       35,       40,       45,       50,      999]
LVA = [2.6348e6, 2.6348e6, 2.6030e6, 2.5749e6, 2.5494e6, 2.5247e6, 2.5008e6, 2.4891e6, 2.4774e6, 2.4656e6, 2.4535e6, 2.4418e6, 2.4300e6, 2.4183e6, 2.4062e6, 2.3945e6, 2.3823e6, 2.3823e6]
CPA = [    5400,     5400,     4770,     4520,     4350,     4270,     4218,     4202,     4192,     4186,     4182,     4180,     4179,     4178,     4178,     4179,     4181,     4181]



function test(){
	var p = 900
	var e = ewc(10)
	console.log("ew", e)
	
	var t = t_from_ew(e)
	console.log("t", t)
	
	var r1 = r(p, e)
	console.log("rw", r1)
	
	//e_from_pr(p,r)
	console.log("t_from_prw", t_from_prw(p, r1))
}



//********************************************************************
// PSEUDOADABATIC ****************************************************
//********************************************************************

/*
 * 
 */

/**
 * Pseudoadiabatic lapse rate
 * http://glossary.ametsoc.org/wiki/Pseudoadiabatic_lapse_rate
 * @param t - temperature [ºC]
 * @param p - pressure [hPa]
 * @returns Pseudoadiabatic lapse rate [ºC/hPa]
 */
function pseudoadiabatic_lapse_rate(t,p){
	//	where Γps is the pseudoadiabatic lapse rate, g is gravitational acceleration, 
	//	rv is the mixing ratio of water vapor, cpd and cpv are the specific heats at 
	//	constant pressure of dry air and water vapor, Lv is the latent heat of vaporization, 
	//	R is the dry air gas constant, ε ≈ 0.62 is the ratio of the gas constants of dry air and water vapor, 
	//	and T is temperature. The above lapse rate is usually within 1 percent of those shown under 
	//	moist-adiabatic lapse rate and reversible moist-adiabatic lapse rate.
	
	// ºC to K
	var T = t+c0
	
	// r saturación
	var rv = rw(T,p)
	//console.log(rv, t, p)
	
	// Lv = Cte
//	var num = G*(1 + rv)*(1 + (Lv*rv)/(RD*T))
//	var den = CPD + rv*CPV + (Lv*Lv*rv*(EPS+rv))/(RD*T*T)
	
	// lv = Alvaro
	var Lv = lv(T)
	//var LV = lv_table(t)
	var num = G*(1 + rv)*(1 + (Lv*rv)/(RD*T))
	var den = CPD + rv*CPV + (Lv*Lv*rv*(EPS+rv))/(RD*T*T)
	
//	console.log(rv)
//	console.log(num)
//	console.log(den)
//	console.log("dT/dz:",num/den)
	
	//dT/dz [ºC/m]
	//return num/den
	
	// dT/dp [ºC/hPa]
	var Tv = T*(1 + rv/EPS)/(1 + rv)
	return -(num/den)*(RD*Tv)/(G*p)
} 







//********************************************************************
// SATURATION VAPOUR PRESSURE ******************************************
//********************************************************************
function ____vapor_pressure____(){}

/**
 * Saturation vapor pressure
 * 
 * @param t - temperature [ºC]
 * @returns saturation vapor pressure [hPa]
 */
function ewc(t){
	if (AERK){
		// Alduchov, Oleg; Eskridge, Robert (April 1996)
		// "Improved Magnus' Form Approximation of Saturation Vapor Pressure", Journal of Applied Meteorology. Equation 21
		// AERK approximantion. Range [-40, 50]
		return AERK0 * Math.exp(AERKA*t/(AERKB+t))
	} else {
	    // formula de Magnus-Teten:
	    return TETEN0 * Math.pow(10, TETENA*t/(TETENB+t) )
	}
}


/**
 * 
 * @param t - temperature [K]
 * @returns saturation vapor pressure [hPa]
 */
function ew(t){ return ewc(t-c0) }


/**
 * Derivative of ew: (d ew)/(dt)
 * @param t [K]
 * @returns
 */
function ewdc(t){
	// derivada (d ew)/(dt)
	if (AERK){
	  tb=AERKB+t
	  return AERKAB0 * Math.exp(AERKA*t/tb) / (tb**2)
	}else{
	  return ewc(t) * TETENAB / (TETENB+t)**2
	}
}
function ewd(t){ return ewdc(t-c0) }




/**
 * Logaritmic derivative of ew(): (d ln ew)/(dt)
 * 
 * @param t - temperature [ºC]
 * @returns
 */
function ewldc(t){
	if (AERK){
	  return AERKAB/(AERKB+t)**2
	}else{
	  return TETENAB / (TETENB+t)**2
	}
}
function ewld(t){ return ewldc(t-c0) }
  


//Presion Total Saturante Celsius
//function ewtsc(t,rw){ return ewc(t) * (rw+EPS)/rw }


/**
 * 
 * @param ew - saturation vapor pressure [hPa]
 * @returns temperature [ºC]
 */
function t_from_ew(ew){
	return (AERKB*Math.log(ew/AERK0)) / (AERKA - Math.log(ew/AERK0))
}



/**
 * Formula de Clausius-Clapeyron: ew(T)
 * Notar que usa lvc() que indicretamente usa ewc()
 * @param t [K]
 * @returns saturation vapor pressure [hPa]
 */
//function ewclausius(t){ return 6.107 * Math.exp( (lvc(t)/RV) * ((1./c0)-(1./t))) }



//function getVaporPressure(t,U){ return ew(t) * U } // no veo que alvarlo lo use



//********************************************************************
// MIXING RATIO ******************************************************
//********************************************************************
/**
 * 
 *                 e
 *  r = epsilon --------  
 *               p - e
 */
function ____mixing_ratio____(){}


/**
 * Mixing ratio
 * @param p - dry air pressure [hPa]
 * @param e - water vapor pressure [hPa]
 * @returns mixing ratio [kg/kg]
 */
function r(p,e){ return EPS * e/(p-e) }


/**
 * Saturation mixing ratio
 * @param t - temperature [K]
 * @param p - pressure [hPa]
 * @returns mixing ratio [kg/kg]
 */
function rw(t,p){ return r(p, ew(t)) }


/**
 * Saturation mixing ratio
 * @param t - temperature [ºC]
 * @param p - pressure [hPa]
 * @returns mixing ratio [kg/kg]
 */
function rwc(t,p){ return r(p, ewc(t)) }

/**
 * Specific humidity
 * @param r - mixing ratio [kg/kg]
 * @returns specific humidity [kg/kg]
 */   
function qfromr(r){ return r/(1+r) }

/**
 * Specific humidity
 * @param q - specific humidity [kg/kg]
 * @returns mixing ratio [kg/kg]
 */   
function rfromq(q){ return q/(1-q) }

function q(p,e){ return EPS * e / ( p+ (EPS-1.)*e ) }
function efrompr(p,r){ return p * r / ( r + EPS ) } 
function efrompq(p,q){ return efrompr(p, rfromq(q)) }

/**
 * 
 * @param p - pressure [hPa]
 * @param r - mixing ratio at saturation [kg/kg]
 * @returns temperature [?]
 */
function t_from_prw(p,r){ 
	return t_from_ew(e_from_pr(p,r))
}

/**
 * 
 * @param p - pressure [hPa]
 * @param r - mixing ratio [kg/kg]
 * @returns saturated vapor pressure [hPa]
 */
function e_from_pr(p,r){ 
	return p * r / ( r + EPS ) 
}


//********************************************************************
// ADIABATIC LIFT ****************************************************
//********************************************************************


//function getCondensationPointCelsius( T, Td, p{
//    //                *   (Tc,pc)  
//    // equisaturated /  \
//    //              /     \   dry adiabatic  
//    //             /        \
//    //            /           \
//    //   (Td,p)  * _____________* (T,p)
//    rw = rwc(Td, p)
//    tr = T+c0
//    pr = p
//    tarr=[T]
//    parr=[pr]
//    while rw<rw(tr, pr{
//          tr+=XIDP*tr/pr
//          pr+=DP
//          tc =tr-c0
//          tarr.push(tc)
//          parr.push(pr)
//    return tc, pr, tarr, parr
//
//

/**
 * Generates the p-T profile of pseudoadiabatic
 * @param T - temperature [ºC]
 * @param p - pressure [hPa]
 * @param pf - final pressure [hPa]
 * @returns list of data objects [{T: 1, p: 1},...]
 */
function getSaturatedAdiabaticCelsius( T, p, ptop){
    //          \
    //             \    saturated adiabatic
    //               \
    //                \
    //                * (T,p)
	
//	DLNP = 0.004702 //0.004702 
//	KP = (2-DLNP)/(2+DLNP)
//	KT = KP-1
	
    let tc = T
    let tr = T+c0
    let pr = p
    let d = [] // list of data

    //let r = rwc(tc,pr)
    //d.push({'T':tc, 'p':pr, 'r': r, 'Tv': tvc(tc, r)})
    while (ptop<pr){
         //tr+=getXiPseudoAdiabatic(tr,pr)*DP*tr/pr
         //pr+=DP
	    tr *= 1.0 + getXiPseudoAdiabatic(tr,pr)*KT
	    pr *= KP
	    tc = tr-c0
	    //d.push({'T':tc,'p':pr})
	    let r  = rwc(tc,pr)
        d.push({'T':tc, 'p':pr, 'r': r, 'Tv': tvc(tc, r)})
    }
    return d
}

/**
 * 
 * @param T
 * @param p
 * @param {number} ptop - top pressure [hPa]
 * @param {null|number} tmin - minimum temperature. Second condition to stop the lift. [C]
 * @param DLNP 
 * @returns
 */
function getSaturatedAdiabaticCelsiusBackground( T, p, ptop, tmin=null, DLNP=0.004702){
	
    KP = (2-DLNP)/(2+DLNP)
    KT = KP-1
	//console.log("DLNP", DLNP, "KP", KP, "KT", KT)
	
    let tc = T
    let tr = T+c0
    let pr = p
    let d = [] // list of data
    d.push({'T':T,'p':pr})
    while (ptop<pr){
	    tr *= 1.0 + getXiPseudoAdiabatic(tr,pr)*KT
	    pr *= KP
	    tc = tr-c0
        d.push({'T':tc, 'p':pr})
        if (tmin && tc<tmin) { break }
    }
    //console.log(d.length)
    return d
}


/**
 * MOVED HERE FROM ADIABLIDF
 * @param T0
 * @param p0
 * @param r0
 * @param DP
 * @returns
 */
function getDryAdiabaticCelsius(T0, p0, r0, DP=-0.33333333, oldcalc=false){
	let rw9  = r0 - Number.EPSILON
	let tc   = T0
	let tr   = T0 + c0 // to K
	let pr   = p0
	let pc   = p0
	let dd = [] // list of data for dry levels
	let r  = rwc(tc,pr) // r for saturation
	dd.push({'T':tc, 'p':pr, 'r': r0, 'Tv': tvc(tc, r0)})
	while (rw9<rw(tr, pr)){
		tr += XI*DP*tr/pr
		pr += DP
		tc = tr-c0
		pc = pr
		r  = rwc(tc,pr)
		//console.log("   ", pc, tc, r, this.r0, r<this.r0, 100*(r-this.r0)/this.r0)
		dd.push({'T':tc, 'p':pc, 'r': r0, 'Tv': tvc(tc, r0)})
	}
	if (oldcalc) return dd

	// saturation at first level
	if (dd.length<2) return dd
	
	// new LCL tuning
	// line 1: dry ad
	let p1 = {x:dd[dd.length-2].T, y:Math.log(dd[dd.length-2].p)}
	let p2 = {x:dd[dd.length-1].T, y:Math.log(dd[dd.length-1].p)}
	// line 2: mixing r0
	let p3 = {x:t_from_prw(dd[dd.length-2].p,r0), y:Math.log(dd[dd.length-2].p)}
	let p4 = {x:t_from_prw(dd[dd.length-1].p,r0), y:Math.log(dd[dd.length-1].p)}
	// intersection of line 1 and line 2
	let px = ((p1.x*p2.y-p1.y*p2.x)*(p3.x-p4.x)-(p1.x-p2.x)*(p3.x*p4.y-p3.y*p4.x)) / ((p1.x-p2.x)*(p3.y-p4.y)-(p1.y-p2.y)*(p3.x-p4.x))
	let py = Math.exp(((p1.x*p2.y-p1.y*p2.x)*(p3.y-p4.y)-(p1.y-p2.y)*(p3.x*p4.y-p3.y*p4.x)) / ((p1.x-p2.x)*(p3.y-p4.y)-(p1.y-p2.y)*(p3.x-p4.x)))
    // modification of last level
	dd[dd.length-1].p  = py
	dd[dd.length-1].r  = r0
	dd[dd.length-1].T  = px
	dd[dd.length-1].Tv = tvc(px, r0)
	return dd
}

//********************************************************************
// VIRTUAL TEMPERATURE ***********************************************
//********************************************************************
function ____virtual_temperature____(){}
    
/**
 * http://glossary.ametsoc.org/wiki/Virtual_temperature
 * @param {number} T - temperature [K]
 * @param {number} r - mixing ratio [kg/kg]
 * @returns {number} virtual temperature [K]
 */
function tv(t,r){ return t * (1.+r/EPS) / (1+r) }

/**
 * 
 * @param {number} t - temperature [ºC]
 * @param {number} r - mixing ratio [kg/kg]
 * @returns {number} virutal temperature [ºC]
 */
function tvc(t,r){ return tv(t+c0, r)-c0 }

//function tvFromTdc(t,td,p{ return tvc(t, rwc(td, p))


//********************************************************************
// POTENTIAL TEMPERATURE *********************************************
//********************************************************************
function ____potential_temperature____(){}

/**
 * Potential temperature 	     
 * th =  t*(1000/p)^(RD/CPD)
 *         
 * @param t - temperature [K]
 * @param p - pressure [hPa]
 * @returns potential temperature [K]
 */
function th(t,p){ return t * Math.pow(PST/p, XI) }

// docstring
function thc(t,p){ return th(t+c0, p) - c0 }

// docstring
function t_from_thp(th,p){ return th * Math.pow(p/PST, XI) } 	// function getTemperatureFromPotentialTemperature(th,p{ return th * Math.pow(p/PST, XI)

// docstring
function tc_from_thcp(thc,p){ return t_from_thp(thc+c0, p) - c0 } 	//function getTemperatureFromPotentialTemperatureCelsius(th_c,p{ return getTemperatureFromPotentialTemperature(th_c+c0, p) - c0

//    function getPressureFromPotentialTemperature(th,t{ return PST * Math.pow(t/th, XII)
//    function getPressureFromPotentialTemperatureCelsius(th,t{ return getPressureFromPotentialTemperature(th+c0, t+c0)
//    function getTemperatureFromPseudoAdiabaticTemperature(th,p{ return th * Math.pow(p/PST, 0.285)
//    function getTemperatureFromPseudoAdiabaticTemperatureCelsius(th_c,p{ return getTemperatureFromPseudoAdiabaticTemperature(th_c+c0, p) - c0


//********************************************************************
// EQUIVALENT TEMPERATURE ********************************************
//********************************************************************
function ____equivalent_temperature____(){}

/**    
 * Equivalent temperature
 * @param t - temperature [K]
 * @param r - mixing ratio [kg/kg]
 * @returns equivalent temperature [K]
 */
function te(t,r){ return t * Math.exp( lv(t) * r / (CPD * t) ) } 
function tec(t,r){ return te(t + c0, r) - c0 }

/**    
 * Equivalent potential temperature
 * @param t - temperature [K]
 * @param p - pressure [hPa]
 * @param r - mixing ratio [kg/kg]
 * @returns equivalent potential temperature [K]
 */
function the(t,p,r){ return th(t, p) * Math.exp( lv(t)*r/(CPD * t) ) }
function thec(t,p,r){ return the(t + c0, p, r) - c0 }

    
function tecfromlvr(t,lvr){ return (t+c0) * Math.exp(lvr/(CPD*(t+c0))) - c0 }   



//********************************************************************
// WET-BULB TEMPERATURE **********************************************
//********************************************************************
function ____wetbulb_temperature____(){}

function twc(t,p,r){
	ZE4 = 1.e-4
    lvr=lvc(t)*r
   
    if (500.<p) tw=twc_stull(t,p,r)
    else     	tw=twc_daviesjones(t,p,lvr)
    
	//console.log("primer tw", tw)
    for (var i=0; i<3; i++){ //i in range(3{
        fb=twc_newton_f(p,t,lvr,tw+ZE4)
        fa=twc_newton_f(p,t,lvr,tw)
        //console.log("newton", fa*ZE4/(fb-fa))
        tw-=fa*ZE4/(fb-fa)
    }
	//console.log("tras newton tw", tw)
    return tw
}


function twc_newton_f(p,t,lvr,tw){
    // Mesoscale Meteorology in Midlatitudes
    // Royal Meteorology Society
    // Markowski, Richardson (2010)
    // eq 2.26
	//[cpd + rvs(Tw)cl](T − Tw) = lv(Tw)rvs(Tw) − lv(T)rv
    let rw=rwc(tw,p)
    return (CPD+rw*cpw_table(tw))*(t-tw)-lvc(tw)*rw+lvr
}


function twc_stull(t,p,r){
    // http://journals.ametsoc.org/doi/full/10.1175/JAMC-D-11-0143.1
    // Wet-Bulb Temperature from Relative Humidity and Air Temperature 
    // Stull (2011)
    // eq. 1
    rh  = 100.0*r/rwc(t,p)
    tw  = t*Math.atan(0.151977*Math.sqrt(rh+8.313659))
    tw += Math.atan(t+rh) 
    tw -= Math.atan(rh-1.676331) 
    tw += 0.00391838*Math.pow(rh,1.5)*Math.atan(0.023101*rh)
    return tw-4.686035
}


function twc_daviesjones(t,p,lvr){
   // http://journals.ametsoc.org/doi/abs/10.1175/2007MWR2224.1
   // An Efficient and Accurate Method for Computing the Wet-Bulb Temperature along Pseudoadiabats
   // Robert Davies-Jones (2007)
   // eq. 4.8, 4.9, 4.10, 4.11
   let lam = 3.504
   let pp0 = p/PST
   let tec = tecfromlvr(t,lvr)
   //pi  = Math.pow(pp0,XI)
   let pi  = Math.pow(pp0,1.0/lam)
   //ctl = Math.pow(c0/te,XII)
   let ctl = Math.pow(c0/(tec+c0),lam)
   let D   = 1.0/(0.1859*pp0+0.6512)

   if (D<ctl){
      let Ar=2675.0*rwc(tec,p)
      return tec-Ar/(1.0+Ar*ewldc(tec))
   }else{
      let pi2 = pi*pi
      let k1  =-38.5 *pi2 + 137.81*pi - 53.737
      let k2  =-4.392*pi2 + 56.831*pi -  0.384
      if      (0.99999<ctl){ return k1-k2*ctl }
      else if (0.39999<ctl){ return k1-1.21-(k2-1.21)*ctl }
      else                 { return k1-2.66-(k2-1.21)*ctl+0.58/ctl }
   }
}


function thwc(t,p,r){
    // http://journals.ametsoc.org/doi/abs/10.1175/2007MWR2224.1
    // An Efficient and Accurate Method for Computing the Wet-Bulb Temperature along Pseudoadiabats
    // Robert Davies-Jones (2007)
    // eq. 3.8
	let theV= the(t+c0, p, r) // the = the() conflict
    let thw= theV-c0
    if (theV>173.15){
       let x  = theV/c0
       let px = 1.
       let num= DJA[0]
       let den= DJB[0]
       for (i=1; i<5; i++){ // in range(1,5)
           px*=x  
           num+=DJA[i]*px
           den+=DJB[i]*px
       }
       thw-=Math.exp(num/den)
    }
    return thw
}    
  
function tsneG(t)     { return Math.exp(AERKA*t/(AERKB+t)) / (1.+t/c0) }
function tsneF0(t,h,p){ return t*(1.0+0.003309*t-0.0001441*t*t)+10.6*Math.pow(1.0+(t/c0),1.94)*(h*tsneG(t)-1.)*(PSEA/p) }

//   //********************************************************************
//   // WIND CHILL TEMPERATURE INDEX **************************************
//   //********************************************************************
//
//    
//    function wcti(tc,vkmh{ 
//        if 10.0<tc:
//           return null
//        else:
//           vexp=(1.852*vkmh)**0.16
//           return 13.1267+0.6215*tc-11.37*vexp+0.3965*tc*vexp
//
//   //********************************************************************
//   // ENTROPY ***********************************************************
//   //********************************************************************
//
//    
//    function phi(t,p{ return CPD * Math.log(th(t,p))
//
//    
//    function phic(t,p{ return phi(t+c0, p)
//  
//    
//    function getPressureFromTePhi(t,phi{ return PST * Math.pow(t*Math.exp(-phi/CPD), XII)
//
//    
//    function getPressureFromTePhiCelsius(t,phi{ return getPressureFromTePhi(t+c0, phi)
//

//********************************************************************
// DEW POINT *********************************************************
//********************************************************************
function ____dewpoint____(){}

function tdc(p,r){

    let ew=efrompr(p,r)
    let dp=0.
    // Metodo de Newton x-=f/f'
    if (AERK){
    	x=AERKABI*Math.log(AERK0/ew)
        for (let i in [0,1,2]){ 
        	dpb = AERKB + dp
            dp -= (AERKBI*dp+x*dpb)*dpb
        }
    } else {
    	for (let i in [0,1,2]){
    		dp-=Math.log(ewc(dp)/ew)/ewldc(dp)
    	}
    }
    return dp
}        	

    

function tdcfromq(p,q){ return tdc(p, rfromq(q)) }



//********************************************************************
// PSEUDOADIABATIC ****************************************************
//********************************************************************
function ____pseudoadiabatic____(){}

function getXiPseudoAdiabatic(t,p){
    let LV = lv(t)
    let cc = LV * rw(t, p) / (RD*t)
    return XI * (1.+cc) / (1.+Z2*LV*cc/t)
}    


//********************************************************************
// TABLES ************************************************************
//********************************************************************
function ____tables____(){}

function line_interp(X, Y, x){
	let i  = s3.bisect(X, x) // left index 
 	let x0 = X[i-1]
	let x1 = X[i]
	let y0 = Y[i-1]
	let y1 = Y[i]
	let y  = (y0*(x1-x)+y1*(x-x0)) / (x1-x0)	
	//console.log("line_interp",i,x,x0,x1,y0,y1,y)
	return y
}


/**
 * Water density [g/cm³]
 * @param {number} t - Temperature [ºC]
 * @returns {number} - Water density [g/cm³]
 */
function waterDensity(t){
	return line_interp(TA1, RHOL, t)
}

//function lvc_table(t{ return Layer.getv2(t,TA2,LVA)


/**
 * Water specific heat at constant pressure [J/kg*K]
 * @param {number} t - Temperature [ºC]
 * @returns {number} - Water specific heat at constant pressure [J/kg*K]
 */
function cpw_table(t){ 
	return line_interp(TA2, CPA, t)
//	let i  = s3.bisectLeft(TA2, t) // find index to insert t 
//	let x  = t
//	let x0 = TA2[i-1]
//	let x1 = TA2[i]
//	let y0 = CPA[i-1]
//	let y1 = CPA[i]
//	let y  = (y0*(x1-x)+y1*(x-x0)) / (x1-x0)	
//	//console.log(x,x0,x1,y0,y1,y)
//	return y
}



/**
 * Latent Heat of Vaporization/Condensation
 * 
 * ec.Clausis-Clapeyron: d(ew)/dt = L*ew/RV*t^2
 * 
 *     d(ew)*RV*t²    d(ln(ew))  
 * L = ----------- =  --------- * RV * t² 
 *     dt * ew           dt
 * 
 * @param t [K]
 * @returns Latent Heat of Vaporization/Condensation [J/g]
 */
function lvc(t){ return ewldc(t) * RV * (t+c0)**2 }

function lv(t){ return ewld(t) * RV * t**2 }




//********************************************************************
// UNITS ******************************************************
//********************************************************************


/**
 * Change m/s to kt or km/h
 * @param msvalue - wind speed [m/s]
 * @param {'kt'|'kmh'} unit 
 * @returns wind speed [kt|kmh]
 */
function convert_wind(msvalue, unit){
	switch(unit) {
		case "kt":
			return msvalue*1.943844492;
		break;
		case "kmh":
			return msvalue*3.6;
		break;
		default:
			return msvalue;
	}		
}

/**
 * Change wind from mathematical direction to meteorological direction 
 * @param md - mathematical direction [º]
 * @returns meteorological direction [º]
 */
function math2met(md){
	if (0>270-md) return 270-md+360
	else          return 270-md  
}


function rangedeg(deg,ref=180.){
    if (deg<ref-180.) return deg+360.
    if (ref+180.<deg) return deg-360.
    return deg
}    


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../src/physics/thlines.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/*! thlines.js - v1.0.0 - 2020-12-14
* Copyright (c) 2020 mgomezm@aemet.es; 
* 
* AdiabLift
* */


/**
 */
class Thlines {
	
	
	static equidistant_pressure_range(ptop, pbot, n){
		var ps = []
		var lntop = Math.log(ptop)
		var lnbot = Math.log(pbot)
		var inc = (lnbot-lntop)/(n-1)
		//console.log(ptop, pbot, n, lntop, lnbot)
		for (let i=0;i<n;i++){
			let lnp = lntop+i*inc
			ps.push(Math.exp(lnp))
		}
		return ps
	}
	

	static dry_adiab(Th, ptop, pbot, n){
		let ps = Thlines.equidistant_pressure_range(ptop, pbot, n)
		let d = []
		for (let p of ps){
			d.push({'p': p, 'T': tc_from_thcp(Th,p)})
		}
		return d
	}
	
	
	static pse_adaib(T, p, ptop, tmin=null, DLNP=0.004702){
		return getSaturatedAdiabaticCelsiusBackground(T, p, ptop, tmin, DLNP)
	}
}	






/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../src/physics/vertical.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/*! vertical.js - v1.0.0 - 2020-11-26
* Copyright (c) 2020 mgomezm@aemet.es; 
* 
* Vertical
* */

//import * as d3 from '../vendor/d3-6.7.js';
//Se cambia la d3 por s3 por incompativilidad con las series temporales de adaguc

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
	bisectp  = s3.bisector(d => d.p).left
	bisectz  = s3.bisector((d, x) => x - d.z ).left
	bisectzg = s3.bisector((d, x) => x - d.zg).left

	
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












/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../src/physics/adiablift.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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






/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../src/physics/sounding.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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
		//d.wS = Math.sqrt(d.u*d.u+d.v*d.v)

		//d.wD = Math.atan(d.u/d.v)
		//d.wD = Math.atan2(d.v,d.u)
		// clean
		d.u=d.wS*Math.cos(d.wD)
		d.v=d.wS*Math.sin(d.wD)
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
		console.log("PLOT FIN")
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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../src/utils/io.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/*! io.js - v1.0.0 - 2021-03-26
* Copyright (c) 2020 mgomezm@aemet.es; 
* 
* input/output library
* --------------------
* */


/**
 * Use sounding API REST (sREST) to query model data. 
 * @param model
 * @param index
 * @param date
 * @param run
 * @param step
 * @param callback
 * @returns
 */
function query_model(model, index, date, run, step, callback){
	$.ajax({ 
		type : 'GET',
		dataType: 'json',
		url : `http://brisa.aemet.es/webtools/sREST/modelo/${model}/indice/${index}/fecha/${date}/pasada/${run}/alcance/${step}`,
		success: function(sond){
			callback(sond)
		},
		error: function ( xhr ) { console.log( "error: " + xhr ) }
	});	
}


/**
 * 
 * @param file
 * @param callback
 * @returns
 */
function query_json(file, callback){
	$.ajax({ 
		type : 'GET',
		dataType: 'json',
		url : file,
		success: function(sond){
			callback(sond)
		},
		error: function ( xhr ) { console.log( "error: " + xhr ) }
	});	
}


/**
 * 
 * @param callback
 * @returns
 */
function query_table(callback){
	//console.log("START")
	$.ajax({ 
		type : 'GET',
		dataType: 'text',
		url : '../data/table.txt',
		success: function(data){
			let sond = parse_table(data)
			callback(sond)
			//return sond
		},
		error: function ( xhr ) { console.log( "error: " + xhr ) }
	});	
}


/**
 * Parse Álvaro's skewt table and returns tdd data object.
 * @param text
 * @returns {Object}
 */
function parse_table(text){
	var lines = text.split('\n');

	let meta = {}
	meta.ps  = parseFloat(lines[0].split('=')[1])
	meta.zs  = parseFloat(lines[1].split('=')[1])
	meta.lat = parseFloat(lines[2].split('lat ')[1])
	meta.lon = parseFloat(lines[3].split('lon ')[1])
	console.log("meta", meta)
	
	var data = []
	for(var i=4; i<lines.length-1; i++){
		d = {}
		//console.log(i, lines[i])
		l = lines[i]
		e = l.split(/\s+/) // elements
		for (var j=0; j<e.length; j+=2){
			k = (j==0) ? 'n' : e[j] 
			v = parseFloat(e[j+1])
			d[k] = v
		}
		//console.log(d)
		data.push(d)
	}
	// debug: change wind units k
	//	data.forEach(function(d){ 
	//		d.wS = d.wS/1.94384 
	//	});
	
	//console.log(data)
	//array1.forEach(element => console.log(element));
	return {'data':data, 'meta': meta}	
}


function rnd(value, prec, mult=1.0){
	//var tmp = Math.round( obj[prop] * mult * Math.pow(10, prec) ) 
    //return tmp / Math.pow(10, prec)
	return (value*mult).toFixed(prec)
}


function round(obj, prop, prec, mult=1.0){
	if (obj==null)       return ""
	if (obj[prop]==null) return ""
	
	//var tmp = Math.round( obj[prop] * mult * Math.pow(10, prec) ) 
    //return tmp / Math.pow(10, prec)
	return (obj[prop]*mult).toFixed(prec)
}


//Closure
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../src/graphics/diagram.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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
		this.svg = s3.select(this.id).append("svg")
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
	
	load_temp(file){
		this.loadtime = null
		this.calctime = null
		this.rendtime = null
		this.loadstart = performance.now()
        this.loader.start() // show loader
		this.calc_sounding(file)		
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
		s3.select("svg").remove();
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
            
            s3.select(".closetdd").on("click", (function(){ this.clear()}).bind(this))
            
            // change path to img
            if (s3.select(".infowindowimg").empty()==false){
                s3.select(".infowindowimg").attr('src', img)
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
		this.x = s3.scaleLinear()
			.range([0, this.width])
			.domain([-this.maxw, this.maxw])

		this.ax = s3.axisBottom(this.x)
			.tickSize(0)
			.ticks(0)

		this.axx = this.axes.append('g')
			.attr("transform", "translate(0," + this.height/2 + ")")
			.call(this.ax)
		
		// v
		this.y = s3.scaleLinear()
			.range([0, this.height])
			.domain([this.maxw, -this.maxw])

		this.ay = s3.axisLeft(this.y)
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
		s3.select('#hodoinc').on("click", (function(d){	this._inc()	}).bind(this))
		s3.select('#hododec').on("click", (function(d){	this._dec()	}).bind(this))
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
			s3.select('#hododec').remove()
			s3.select('#hododectext').remove()
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
				.attr("d", s3.line()
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
			let maxu = s3.max(data, d=>Math.abs(d.u*MKNOT)) 
			let maxv = s3.max(data, d=>Math.abs(d.v*MKNOT))
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
		for (let i in s3.range(n)){
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
			//.attr("transform",  d => "translate("+this.width/2+","+this.newY(d.p)+") rotate("+(math2met(d.wD*RAD2DEG)-180)+") scale(0.75)" ) // Because of barb definition: 0 rotation == South wind, so subtract 180
			.attr("transform",  d => "translate("+this.width/2+","+this.newY(d.p)+") rotate("+((d.wD*RAD2DEG)-180)+") scale(0.75)" ) // Because of barb definition: 0 rotation == South wind, so subtract 180
			// hr
		this.hrline.append("path")
			.data([s.data])
			.attr("d", s3.line()
				.x(d => this.x((d.r/d.rw)*100) ) 
				.y(d => this.newY(d.p) )
				.curve(s3.curveLinear)
			)
	}

	_barb_templates(){
		let barbdef = this.main.append('defs')
		let speeds = s3.range(5,175,5);
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
		this.y = s3.scaleLog()
			.range([0, this.height])
			.domain([this.ptop, this.pbot]);
		this.newY = this.y // used in tooltips
		
		this.ay = s3.axisLeft(this.y)
			.tickSize(0,0)
			.ticks(0)
		
		this.ayy = this.axes.append('g')
			.call(this.ay);
	
		// hr
		this.x = s3.scaleLinear()
			.range([0, this.width])
			.domain([0, 100])

		this.ax = s3.axisBottom(this.x)
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
	    	
	    this.info = s3.select('#infolegendgroup')
	    this.ctrl = s3.select('#ctrllegendgroup')
		
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
		//t += '<tr class="ri"><td data-param="MEAN">MEAN W06  </td><td class="tdr" colspan="2">'+round(s, 'WSM06', 1, MKNOT)+'/'+rnd(math2met(s.WDM06),0)+'</td></tr>'
		t += '<tr class="ri"><td data-param="MEAN">MEAN W06  </td><td class="tdr" colspan="2">'+round(s, 'WSM06', 1, MKNOT)+'/'+rnd((s.WDM06),0)+'</td></tr>'
		t += '<tr class="ri"><td data-param="HEFF">HEFFTOP   </td><td class="tdr" colspan="2">'+round(s, 'HEFFTOP', 1)+'</td></tr>'
		t += '<tr class="ri"><td data-param="HEFF">HEFFBAS   </td><td class="tdr" colspan="2">'+round(s, 'HEFFBAS', 1)+'</td></tr>'
		
        // supercell and tornados (only virtual parcel for parameters BRN,VGP,STP2,EHI1,EHI3)
		t += '<tr ><td data-param="sc_title" colspan="3"><b>Supercélulas y tornados</b></td></tr>'
		t += '<tr class="ri"><td>BRN   </td><td class="tdr" colspan="2">'+round(ad, 'BRNv',  1)+'</td></tr>'
		t += '<tr class="ri"><td>VGP   </td><td class="tdr" colspan="2">'+round(ad, 'VGPv',  2)+'</td></tr>'		
		t += '<tr><td>      </td><td class="tdr2">Izq.                    </td><td class="tdr2">Dch.                     </td></tr>'
		//t += '<tr class="ri"><td>BUNK  </td><td class="tdr2">'+round(s, 'BUNKERSLWS', 1, MKNOT)+'/'+rnd(math2met(s.BUNKERSLWD),0)+'<td class="tdr2">'+round(s, 'BUNKERSRWS', 1, MKNOT)+'/'+rnd(math2met(s.BUNKERSRWD),0)+'</td></tr>'
		t += '<tr class="ri"><td>BUNK  </td><td class="tdr2">'+round(s, 'BUNKERSLWS', 1, MKNOT)+'/'+rnd((s.BUNKERSLWD),0)+'<td class="tdr2">'+round(s, 'BUNKERSRWS', 1, MKNOT)+'/'+rnd((s.BUNKERSRWD),0)+'</td></tr>'
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
			
		s3.select('#infolegendgroup').html(tm)				

		
		// tooltips
		//s3.select('#mainhelp').classed("btnact", true)
		//s3.select('#mainhelp').classed("btnact", !s3.select('#mainhelp').classed("btnact"))
		//s3.select("td").on("click", (function(){ this.show_info() }).bind(this))
		//s3.select("td").on("click", (function(){ this.show_info() }))

		// help callback
		let that = this
		s3.selectAll(".tablelegend .ri").each(function(d, i) {
			s3.select(this).on("click", function(){
                let param = s3.select(this).select("td").attr("data-param")
                param = param || s3.select(this).select("td").text() 
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
		s3.select('#Tliftlegend'  ).on("click", (function(){ this.lift_change('T')   }).bind(this))
		s3.select('#Tvliftlegend' ).on("click", (function(){ this.lift_change('Tv')  }).bind(this))
		s3.select('#TTvliftlegend').on("click", (function(){ this.lift_change('TTv') }).bind(this))		
		// parcel btns handlers
		for (let p of this.tdd.parcels){
			s3.select('.parcelbtn[value="'+p+'"]').on("click", (function(){	this.parcel_change(p) }).bind(this))
		}
		// lines and tools btns handlers
		for (let l of Object.values(this.lines)){
			s3.select('#'+l.name+'linelegend').on("click", (function(){	this.line_change(l) }).bind(this))
			s3.select('#'+l.name+'toollegend').on("click", (function(){	this.tool_change(l) }).bind(this))
		}
	}

	
	/**
	 * 
	 */
	lift_change(lift){
		//console.log("lift_change", lift)
		s3.select('#'+this.tdd.lift+'liftlegend').classed("btnact", false) // previous btn
		s3.select('#'+lift+'liftlegend').classed("btnact", true) 
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
		let rect  = s3.select('.parcelbtn[value="'+level+'"]')
		if (active){
			rect.classed("btnact", false)
			this.tdd.parcel = null
		} else {
			if (this.tdd.parcel != null){
				s3.select('.parcelbtn[value="'+(this.tdd.parcel).toString()+'"]')
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
			s3.select("#"+idline      ).style("opacity", 0);
			s3.select('#'+idtool      ).style("opacity", 0);
			s3.select("#"+idlinelegend).style("opacity", this.op);
			s3.select("#"+idtoollegend).style("opacity", this.op);
			this.lines[id].tooltip = false
		} else {
			s3.select("#"+idline      ).style("opacity", 1);
			s3.select("#"+idlinelegend).style("opacity", 1);
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
			s3.select("#"+idtoollegend).style("opacity", this.op);
			s3.select('#'+idtool      ).style("opacity", 0);
		} else {
			s3.select('#'+idtool      ).style("opacity", 1);
			s3.select("#"+idtoollegend).style("opacity", 1);
			if (lineactive==false){
				s3.select('#'+idtool      ).style("opacity", 1);	
				s3.select("#"+idline      ).style("opacity", 1);
				s3.select("#"+idlinelegend).style("opacity", 1);
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
	tticks = s3.range(this.tmin-100,this.tmax+1,this.tinc)
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
	bg_tlines = s3.range(-120, this.tmax+1, this.tinc)
	bg_dryad  = s3.range(this.tmin,100,5).concat(s3.range(100,220,10)) // potential temperatures
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
			s3.select('#'+l+'line').html(null)
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
		s3.select('#ground').html(null)
		s3.select('#ground').append('rect')                       
	    	.attr('x', 0)
	    	.attr('y', y)
	    	.attr('width', this.width)
	    	.attr('height', h)
	    	.attr('class', classcolor)
	}
	
	
	clear_parcel(){
		s3.select('#capearea').html(null)
		s3.select('#capevarea').html(null)
		s3.select('#cinarea').html(null)
		s3.select('#cinvarea').html(null)
		s3.select('#Tlift').html(null)
		s3.select('#Tvlift').html(null)
		s3.select('#rlift').html(null)
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
		var area = s3.area()
			.defined(d => d.p>=top)
			.y(d => this.y(d.p) )
			.x0(d => this.skewx(d[param_left], d.p) )
			.x1(d => this.skewx(d[param_right], d.p) )

		s3.select('#'+cl).append("path")				
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
        s3.select('#'+cl).append("path")
            .data([data])
            .attr("class", cl) 
            .attr("d", s3.line()
                .x(d => this.x(d[param], d.p) ) 
                .y(d => this.y(d.p) )
                .curve(s3.curveLinear)
            )        
    }
    
    
	/**
	 * 
	 */
	line(data, param, cl=null){
		cl = cl || param+'line'
		//console.log("line", param, cl)
		if (param=='Tf') param='TSn'
		s3.select('#'+cl).append("path")
			.data([data])
			.attr("class", cl) 
			.attr("d", s3.line()
				.x(d => this.skewx(d[param], d.p) ) 
				.y(d => this.y(d.p) )
				.curve(s3.curveLinear)
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
		s3.select('#'+param+'line').style("opacity", 0);
	}

	hide_tooltip(param){
		this.lines[param].tooltip = false 
		s3.select('#'+param+'label').style("opacity", 0);
	}
	
	
	line2p(p1, p2, cl=null){
		cl = cl || 'rlift'
		s3.select('#'+cl).append("line")
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
			s3.select('#'+l.name+'label').append("circle")
				.attr("r", 3)
				.attr("class", l.name+'legend') // for the color
			s3.select('#'+l.name+'label').append("text")
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
			s3.select('#'+l+'label')
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
		var zoom = s3.zoom()
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
			.attr("d", s3.line()
				.x(d => this.skewx(d.T, d.p) ) 
				.y(d => this.y(d.p) )
				.curve(s3.curveLinear)
	        )
	     // DEBUG 
//	    this.bglines.append("g").attr("id", "bgdryad").selectAll(".dryadbg")
//		.data(this.bg_dryad)
//		.enter().append("path")
//			.datum(d => Thlines.dry_adiab(d, this.ptop, this.pbot, 1000))
//			.attr("class", "debug")
//			.attr("d", s3.line()
//				.x(d => this.skewx(d.T, d.p) ) 
//				.y(d => this.y(d.p) )
//				.curve(s3.curveLinear)
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
				.attr("d", s3.line()
					.x(d => this.skewx(d.T, d.p) ) 
					.y(d => this.y(d.p) )
					.curve(s3.curveLinear)
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
		this.y = s3.scaleLog()
			.range([0, this.height])
			.domain([this.ptop, this.pbot]);
		this.newY = this.y // used in tooltips
		
		this.ay = s3.axisLeft(this.y)
			.tickSize(0,0)
			.tickValues(this.pticks)
			.tickFormat(s3.format(".0d"))
		
		this.ayy = this.axes.append('g')
			.call(this.ay);
	
		// temperature
		this.x = s3.scaleLinear()
			.range([0, this.width])
			.domain([this.tmin,this.tmax])

		this.ax = s3.axisBottom(this.x)
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

        this.arc = s3.arc()
            .innerRadius(this.radius*0.5)
            .outerRadius(this.radius*0.9)
            .startAngle(0);

        this.svg = s3.select(config.container).append("g")
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
            .ease(s3.easeLinear)
            .duration(this.duration)
            .attrTween("transform", function() {
                return s3.interpolateString("rotate(0)", "rotate(360)");
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


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

DP = -0.33333333 // pressure increment [hPa] 
OFFSET_FAHRENHEIT_K = 459.67
OFFSET_FAHRENHEIT_C =   32.0
SCALE_FAHRENHEIT    =    1.8

PSEA = 1013.25 // pressure at sea level [hPa]
PST  = 1000.
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
	let r  = rwc(tc,pr)
	dd.push({'T':tc, 'p':pr, 'r': r, 'Tv': tvc(tc, r0)})
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
	
//	// new LCL tuning
//	// line 1: dry ad
//	let p1 = {x:dd[dd.length-2].T, y:dd[dd.length-2].p}
//	let p2 = {x:dd[dd.length-1].T, y:dd[dd.length-1].p}
//	// line 2: mixing r0
//	let p3 = {x:t_from_prw(dd[dd.length-2].p,r0), y:dd[dd.length-2].p}
//	let p4 = {x:t_from_prw(dd[dd.length-1].p,r0), y:dd[dd.length-1].p}
//	// intersection of line 1 and line 2
//	let px = ((p1.x*p2.y-p1.y*p2.x)*(p3.x-p4.x)-(p1.x-p2.x)*(p3.x*p4.y-p3.y*p4.x)) / ((p1.x-p2.x)*(p3.y-p4.y)-(p1.y-p2.y)*(p3.x-p4.x))
//	let py = ((p1.x*p2.y-p1.y*p2.x)*(p3.y-p4.y)-(p1.y-p2.y)*(p3.x*p4.y-p3.y*p4.x)) / ((p1.x-p2.x)*(p3.y-p4.y)-(p1.y-p2.y)*(p3.x-p4.x))
	
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
	var i = d3.bisect(X, x) // left index 
 	x0 = X[i-1]
	x1 = X[i]
	y0 = Y[i-1]
	y1 = Y[i]
	y = (y0*(x1-x)+y1*(x-x0)) / (x1-x0)	
	//console.log("line_interp",i,x,x0,x1,y0,y1,y)
	return y
}

/**
 * Water density [g/cm³]
 * @param t
 * @returns
 */
function waterDensity(t){
	return line_interp(TA1, RHOL, t)
}

	//function lvc_table(t{ return Layer.getv2(t,TA2,LVA)

/**
 * Apply linear interpolation to vector TA2 and CPA
 * @param t
 * @returns
 */
function cpw_table(t){ 
	i = d3.bisectLeft(TA2, t) // find index to insert t 
	x = t
	x0 = TA2[i-1]
	x1 = TA2[i]
	y0 = CPA[i-1]
	y1 = CPA[i]
	y = (y0*(x1-x)+y1*(x-x0)) / (x1-x0)	
	//console.log(x,x0,x1,y0,y1,y)
	return y
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

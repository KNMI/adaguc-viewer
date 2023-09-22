

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js from "tdd_list" begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/* Last merge : mié feb 1 12:09:00 CET 2023  */

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

//Mod pluciag: Se cambia d3 por s3 por imcopatibilidad de las series temporales de adaguc

//********************************************************************
// CALSS TH **********************************************************
//********************************************************************
function ____class_th____() { }


/** 
 * Th
 * --
 * Contains all the thermodynamic basis 
 */
class Th {

    static c0 = 273.15 // - cero absoluto de temperatura (ºC)
    static RAD2DEG = 180. / Math.PI
    static DEG2RAD = 1. / this.RAD2DEG

    static RD = 287.05 // constante de los gases para el aire seco (J/kg*K)
    static RV = 461.51 // constante de los gases para el aire húmedo (J/kg*K)

    static CPD = 1005. // specific heats at constant pressure for dry air (J/kg*K) // calor específico a presión constante para el aire seco (J/kg*K)
    static CPV = 1850. // specific heats at constant pressure for water vapor (J/kg*K) // calor específico a presión constante para el aire húmedo [J/kg*K)]

    static CVD = this.CPD - this.RD // specific heats at constant volume for dry air (J/kg*K) // calor específico a volumen constante para el aire seco (J/kg*K)
    static CVV = this.CPV - this.RV // specific heats at constant volume for water vapor (J/kg*K) // calor específico a volumen constante para el aire húmedo [J/kg*K)]

    static G = 9.80665 // gravity acceleration [m/s²]

    static DP = -0.33333333 // pressure increment for parcel lifting (hPa) 
    static OFFSET_FAHRENHEIT_K = 459.67
    static OFFSET_FAHRENHEIT_C = 32.0
    static SCALE_FAHRENHEIT = 1.8

    static PSEA = 1013.25 // pressure at sea level (hPa)
    static PST = 1000.    // reference pressure (hPa)
    static PTOP = 100.    // top pressure (hPa)
    static PSTL = Math.log(this.PST)

    static MKNOT = 1.94384 // m/s to kt conversion. m/s = [MKNOT] kt
    static FT2M = 0.3048 // ft to m conversion. ft = [FT2M] m

    static EPS = this.RD / this.RV
    static XI = this.RD / this.CPD
    static XII = 1. / this.XI
    static XIDP = this.XI * this.DP

    static Z1 = 1. / this.EPS
    static Z2 = this.EPS / this.CPD
    static Z8 = this.EPS / (this.CPD * this.PST)
    static Z9 = this.Z8 / this.RV
    static RG = this.RD / this.G

    static KP = null
    static KT = null

    static A = [6.107799961, 4.436518521e-1, 1.428945805e-2, 2.650648471e-4, 3.031240396e-6, 2.034080948e-8, 6.136820929e-11]
    static B = [this.A[1], this.A[2] * 2., this.A[3] * 3., this.A[4] * 4., this.A[5] * 5., this.A[6] * 6.]

    // An Efficient and Accurate Method for Computing the Wet-Bulb Temperature along Pseudoadiabats. Robert Davies-Jones (2007). eq. 3.8. (used in thwc())
    static DJA = [7.101574, -20.68208, 16.11182, 2.574631, -5.20568]
    static DJB = [1.0, -3.552497, 3.781782, -0.6899655, -0.5929340]

    // Alduchov, Oleg; Eskridge, Robert (April 1996)
    // "Improved Magnus Form Approximation of Saturation Vapor Pressure", Journal of Applied Meteorology. Equation 21
    // AERK approximantion. Range [-40, 50]
    static AERK = true
    static AERK0 = 6.1094
    static AERKA = 17.625
    static AERKB = 243.04
    static AERKAB = this.AERKA * this.AERKB
    static AERKAB0 = this.AERKAB * this.AERK0
    static AERKABI = 1.0 / this.AERKAB
    static AERKBI = 1.0 / this.AERKB

    static TETEN0 = 6.108
    static TETENA = 7.4475
    static TETENB = 234.07
    static TETENAB = this.TETENA * this.TETENB * Math.log(10)

    //DLNP = Math.log(Conf.diagram_pmax/Conf.diagram_pmin)/Conf.adiab_lift_steps
    static DLNP = 0.004702 //0.004702 
    static KP = (2 - this.DLNP) / (2 + this.DLNP)
    static KT = this.KP - 1

    // Water density [l/m2] table [g/cm^3]
    // https://water.usgs.gov/edu/density.html
    static TA1 = [-99.0, 0.0, 4.0, 4.4, 10.0, 15.6, 21.0, 26.7, 32.3, 37.8, 48.9, 60.0, 71.1, 82.2, 93.3, 100.0]
    static RHOL = [0.99987, 0.99987, 1.00000, 0.99999, 0.99975, 0.99907, 0.99802, 0.99669, 0.99510, 0.99318, 0.98870, 0.98338, 0.97729, 0.97056, 0.96333, 0.95865]

    // Calor latente de vaporización (Lv) [J/kg] y  calor específico del agua (Cw) (J/kg*K)
    // Iribarne-Godson (pag. 279)
    static TA2 = [-99, -50, -40, -30, -20, -10, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 999]
    static LVA = [2.6348e6, 2.6348e6, 2.6030e6, 2.5749e6, 2.5494e6, 2.5247e6, 2.5008e6, 2.4891e6, 2.4774e6, 2.4656e6, 2.4535e6, 2.4418e6, 2.4300e6, 2.4183e6, 2.4062e6, 2.3945e6, 2.3823e6, 2.3823e6]
    static CPA = [5400, 5400, 4770, 4520, 4350, 4270, 4218, 4202, 4192, 4186, 4182, 4180, 4179, 4178, 4178, 4179, 4181, 4181]


    //********************************************************************
    // HYPSOMETRIC ****************************************************
    //********************************************************************


    /**
     * Returns the thickness of the layer
     * @param {number} tv - virtual temperature (ºC) 
     * @param {number} ptop - top pressure (hPa)
     * @param {number} pbot - bottom pressure (hPa)
     * @returns {number} thickness (m)
     */
    static hypsometric_ec(tv, ptop, pbot) {
        return this.RD * (tv + this.c0) * Math.log(pbot / ptop) / this.G
    }


    //********************************************************************
    // PSEUDOADABATIC ****************************************************
    //********************************************************************
    // NOT IN USE!!!

    /**
     * Pseudoadiabatic lapse rate
     * http://glossary.ametsoc.org/wiki/Pseudoadiabatic_lapse_rate
     * @param {number} t - temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @returns {number} Pseudoadiabatic lapse rate (ºC/hPa)
     */
    static pseudoadiabatic_lapse_rate(t, p) {
        //	where Γps is the pseudoadiabatic lapse rate, g is gravitational acceleration, 
        //	rv is the mixing ratio of water vapor, cpd and cpv are the specific heats at 
        //	constant pressure of dry air and water vapor, Lv is the latent heat of vaporiztion, 
        //	R is the dry air gas constant, ε ≈ 0.62 is the ratio of the gas constants of dry air and water vapor, 
        //	and T is temperature. The above lapse rate is usually within 1 percent of those shown under 
        //	moist-adiabatic lapse rate and reversible moist-adiabatic lapse rate.

        // ºC to K
        var T = t + this.c0

        // r saturación
        var rv = rw(T, p)
        //console.log(rv, t, p)

        // Lv = Cte
        //	var num = G*(1 + rv)*(1 + (Lv*rv)/(RD*T))
        //	var den = CPD + rv*CPV + (Lv*Lv*rv*(EPS+rv))/(RD*T*T)

        // lv = Alvaro
        var Lv = lv(T)
        //var LV = lv_table(t)
        var num = G * (1 + rv) * (1 + (Lv * rv) / (RD * T))
        var den = CPD + rv * CPV + (Lv * Lv * rv * (EPS + rv)) / (RD * T * T)

        //	console.log(rv)
        //	console.log(num)
        //	console.log(den)
        //	console.log("dT/dz:",num/den)

        //dT/dz [ºC/m]
        //return num/den

        // dT/dp [ºC/hPa]
        var Tv = T * (1 + rv / EPS) / (1 + rv)
        return -(num / den) * (RD * Tv) / (G * p)
    }


    //********************************************************************
    // SATURATION VAPOUR PRESSURE ****************************************
    //********************************************************************
    ____vapor_pressure____() { }


    /**
     * Saturation vapor pressure
     * @param {number} t - temperature (ºC)
     * @returns {number} saturation vapor pressure (hPa)
     */
    static ewc(t) {
        if (this.AERK) {
            // Alduchov, Oleg; Eskridge, Robert (April 1996)
            // "Improved Magnus' Form Approximation of Saturation Vapor Pressure", Journal of Applied Meteorology. Equation 21
            // AERK approximantion. Range [-40, 50]
            return this.AERK0 * Math.exp(this.AERKA * t / (this.AERKB + t))
        } else {
            // formula de Magnus-Teten:
            return this.TETEN0 * Math.pow(10, this.TETENA * t / (this.TETENB + t))
        }
    }


    /**
     * Saturation vapor pressure
     * @param {number} t - temperature (K)
     * @returns {number} saturation vapor pressure (hPa)
     */
    static ew(t) { return this.ewc(t - this.c0) }


    /**
     * Derivative of ew: (d ew)/(dt)
     * @param {number} t - temperature (ºC)
     * @returns {number} derivative of ew (hPa/ºC)
     */
    static ewdc(t) {
        // derivada (d ew)/(dt)
        if (this.AERK) {
            tb = this.AERKB + t
            return this.AERKAB0 * Math.exp(this.AERKA * t / tb) / (tb ** 2)
        } else {
            return this.ewc(t) * this.TETENAB / (this.TETENB + t) ** 2
        }
    }


    /**
     * Derivative of ew: (d ew)/(dt)
     * @param {number} t - temperature (K)
     * @returns {number} derivative of ew (hPa/K)
     */
    static ewd(t) { return this.ewdc(t - this.c0) }


    /**
     * Logaritmic derivative of ew(): (d ln ew)/(dt)
     * @param {number} t - temperature (ºC)
     * @returns {number} 
     */
    static ewldc(t) {
        if (this.AERK) {
            return this.AERKAB / (this.AERKB + t) ** 2
        } else {
            return this.TETENAB / (this.TETENB + t) ** 2
        }
    }


    /**
     * Logaritmic derivative of ew(): (d ln ew)/(dt)
     * @param {number} t - temperature (K)
     * @returns {number} 
     */
    static ewld(t) { return this.ewldc(t - this.c0) }


    /**
     * Temperature for the saturation vapor pressure
     * @param {number} ew - saturation vapor pressure (hPa)
     * @returns {number} temperature (ºC)
     */
    static t_from_ew(ew) {
        return (this.AERKB * Math.log(ew / this.AERK0)) / (this.AERKA - Math.log(ew / this.AERK0))
    }


    // /**
    //  * Formula de Clausius-Clapeyron: ew(T)
    //  * Notar que usa lvc() que indirectamente usa ewc()
    //  * @param t (K)
    //  * @returns saturation vapor pressure (hPa)
    //  */
    //ewclausius(t){ return 6.107 * Math.exp( (lvc(t)/RV) * ((1./c0)-(1./t))) }


    //getVaporPressure(t,U){ return ew(t) * U } // no veo que alvarlo lo use


    //********************************************************************
    // MIXING RATIO ******************************************************
    //********************************************************************
    /**
     * 
     *                 e
     *  r = epsilon --------  
     *               p - e
     */
    ____mixing_ratio____() { }


    /**
     * Mixing ratio
     * @param {number} p - dry air pressure (hPa)
     * @param {number} e - water vapor pressure (hPa)
     * @returns {number} mixing ratio (kg/kg)
     */
    static r(p, e) { return this.EPS * e / (p - e) }


    /**
     * Saturation mixing ratio
     * @param {number} t - temperature (K)
     * @param {number} p - pressure (hPa)
     * @returns {number} mixing ratio (kg/kg)
     */
    static rw(t, p) { return this.r(p, this.ew(t)) }


    /**
     * Saturation mixing ratio
     * @param {number} t - temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @returns {number} mixing ratio (kg/kg)
     */
    static rwc(t, p) { return this.r(p, this.ewc(t)) }


    /**
     * Specific humidity
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} specific humidity (kg/kg)
     */
    static q_from_r(r) { return r / (1 + r) }


    /**
     * Mixing ratio
     * @param {number} q - specific humidity (kg/kg)
     * @returns {number} mixing ratio (kg/kg)
     */
    static r_from_q(q) { return q / (1 - q) }


    /**
     * Specific humidity
     * @param {number} p - dry air pressure (hPa)
     * @param {number} e - water vapor pressure (hPa)
     * @returns {number} specific humidity (kg/kg)
     */
    static q(p, e) { return this.EPS * e / (p + (this.EPS - 1.) * e) }


    /**
     * Vapor pressure
     * @param {number} p - dry air pressure (hPa)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} vapor pressure (hPa)
     */
    static e_from_pr(p, r) { return p * r / (r + this.EPS) }


    /**
     * Vapor pressure
     * @param {number} p - dry air pressure (hPa)
     * @param {number} q - specific humidity (kg/kg)
     * @returns {number} vapor pressure (hPa)
     */
    static e_from_pq(p, q) { return this.e_from_pr(p, this.r_from_q(q)) }


    /**
     * Temperature from pressure and saturation mixing ratio
     * @param {number} p - pressure (hPa)
     * @param {number} r - mixing ratio at saturation (kg/kg)
     * @returns {number} temperature [?]
     */
    static t_from_prw(p, r) { return this.t_from_ew(this.e_from_pr(p, r)) }


    /**
     * Vapor pressure
     * @param {number} p - pressure (hPa)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} saturation vapor pressure (hPa)
     */
    static e_from_pr(p, r) { return p * r / (r + this.EPS) }


    /**
     * Relative humidity
     * @param {number} p - pressure (hPa)
     * @param {number} t - temperature (ºC)
     * @param {number} td - dew point (ºC)
     * @returns {number} relative humidity (%)
     */
    static rhc(p, t, td) { return 100.0 * this.rwc(td, p) / this.rwc(t, p) }


    //********************************************************************
    // ADIABATIC LIFT ****************************************************
    //********************************************************************
    ____adiabatic_lift____() { }

    //getCondensationPointCelsius( T, Td, p{
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


    /**
     * Generates the p-T profile of pseudoadiabatic lift
     * @param {number} T - temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @param {number} pf - final pressure (hPa)
     * @returns {Object} list of data objects [{T: 1, p: 1},...]
     */
    static getSaturatedAdiabaticCelsius(T, p, ptop) {
        //          \
        //             \    saturated adiabatic
        //               \
        //                \
        //                * (T,p)

        //	DLNP = 0.004702 //0.004702 
        //	KP = (2-DLNP)/(2+DLNP)
        //	KT = KP-1

        let tc = T
        let tr = T + this.c0
        let pr = p
        let d = [] // list of data

        //let r = rwc(tc,pr)
        //d.push({'T':tc, 'p':pr, 'r': r, 'Tv': tvc(tc, r)})
        while (ptop < pr) {
            //tr+=getXiPseudoAdiabatic(tr,pr)*DP*tr/pr
            //pr+=DP
            tr *= 1.0 + this.getXiPseudoAdiabatic(tr, pr) * this.KT
            pr *= this.KP
            tc = tr - this.c0
            let r = this.rwc(tc, pr)
            //d.push({ 'T': tc, 'p': pr, 'r': r, 'Tv': tvc(tc, r) })
            d.push({ 'T': tc, 'p': pr, 'r': r, 'Tv': this.tvc(tc, r), 'Td': this.t_from_prw(pr, r) })
        }
        return d
    }


    /**
     * Generates the p-T profile of pseudoadiabatic from an upper to lower presure level.
     * Used in DCAPE.
     * @param {number} T - temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @param {number} pbot - final pressure (hPa)
     * @returns {Object} list of data objects [{T: 1, p: 1},...]
     */
    static getSaturatedAdiabaticDownCelsius(T, p, pbot) {
        //          * (T,p)
        //             \    saturated adiabatic
        //               \
        //                \
        let KPI = 1. / this.KP
        let tr = T + this.c0 // K 
        let pt = p
        let pb = pt * KPI
        let kp
        let d = [] // list of data
        d.push({ 'T': T, 'p': p })
        let lastlevel = true // help run while loop one last time
        while (pb <= pbot) {
            kp = pb / pt
            tr *= 1.0 + this.getXiPseudoAdiabatic(tr, pb) * (kp - 1.)
            d.push({ 'T': tr - this.c0, 'p': pb })
            pt = pb
            pb *= KPI
            if (lastlevel && pb > pbot) {
                pb = pbot
                lastlevel = false
            }
        }
        return d
    }


    /**
     * Generates the p-T profile of pseudoadiabatic lift.
     * Differs from other getSaturatedAdiabatic* methods in the tmin argument.
     * @param {number} T - temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @param {number} ptop - top pressure (hPa)
     * @param {null|number} tmin - minimum temperature. Second condition to stop the lift. (ºC)
     * @param {number} DLNP - pressure increment
     * @returns {Object} list of data objects [{T: 1, p: 1},...]
     */
    static getSaturatedAdiabaticCelsiusBackground(T, p, ptop, tmin = null, DLNP = 0.004702) {

        let KP = (2 - DLNP) / (2 + DLNP)
        let KT = KP - 1
        //console.log("DLNP", DLNP, "KP", KP, "KT", KT)

        let tc = T
        let tr = T + this.c0
        let pr = p
        let d = [] // list of data
        d.push({ 'T': T, 'p': pr })
        while (ptop < pr) {
            tr *= 1.0 + this.getXiPseudoAdiabatic(tr, pr) * KT
            pr *= KP
            tc = tr - this.c0
            d.push({ 'T': tc, 'p': pr })
            if (tmin && tc < tmin) { break }
        }
        return d
    }


    /**
     * Generates the p-T profile of a dry adiabatic lift. 
     * (MOVED HERE FROM ADIABLIDF)
     * @param {number} T0 - temperature (ºC)
     * @param {number} p0 - pressure (hPa)
     * @param {number} r0 - mixing ratio (kg/kg)
     * @param {number} DP - pressure increment (Pa)
     * @param {boolean} oldcal - true to stop in the next level after requirements are met. false to fine adjustment. 
     * @returns {Object} list of data objects [{T: 1, p: 1},...]
     */
    static getDryAdiabaticCelsius(T0, p0, r0, DP = -0.33333333, oldcalc = false) {
        let rw9 = r0 - Number.EPSILON
        let tc = T0
        let tr = T0 + this.c0 // to K
        let pr = p0
        let pc = p0
        let dd = [] // list of data for dry levels
        let r = this.rwc(tc, pr) // r for saturation
        dd.push({ 'T': tc, 'p': pr, 'r': r0, 'Tv': this.tvc(tc, r0), 'Td': this.t_from_prw(pr, r0) })
        while (rw9 < this.rw(tr, pr)) {
            tr += this.XI * DP * tr / pr
            pr += DP
            tc = tr - this.c0
            pc = pr
            r = this.rwc(tc, pr)
            dd.push({ 'T': tc, 'p': pc, 'r': r0, 'Tv': this.tvc(tc, r0), 'Td': this.t_from_prw(pc, r0) })
        }
        if (oldcalc) return dd

        // saturation at first level
        if (dd.length < 2) return dd

        // new LCL tuning
        // line 1: dry ad
        let p1 = { x: dd[dd.length - 2].T, y: Math.log(dd[dd.length - 2].p) }
        let p2 = { x: dd[dd.length - 1].T, y: Math.log(dd[dd.length - 1].p) }
        // line 2: mixing r0
        let p3 = { x: this.t_from_prw(dd[dd.length - 2].p, r0), y: Math.log(dd[dd.length - 2].p) }
        let p4 = { x: this.t_from_prw(dd[dd.length - 1].p, r0), y: Math.log(dd[dd.length - 1].p) }
        // intersection of line 1 and line 2
        let px = ((p1.x * p2.y - p1.y * p2.x) * (p3.x - p4.x) - (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x)) / ((p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x))
        let py = Math.exp(((p1.x * p2.y - p1.y * p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x)) / ((p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x)))
        // modification of last level
        dd[dd.length - 1].p = py
        dd[dd.length - 1].r = r0
        dd[dd.length - 1].T = px
        dd[dd.length - 1].Tv = this.tvc(px, r0)
        dd[dd.length - 1].Td = this.t_from_prw(py, r0)
        return dd
    }


    //********************************************************************
    // VIRTUAL TEMPERATURE ***********************************************
    //********************************************************************
    ____virtual_temperature____() { }


    /**
     * Virtual temperature
     * http://glossary.ametsoc.org/wiki/Virtual_temperature
     * @param {number} T - temperature (K)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} virtual temperature (K)
     */
    static tv(t, r) { return t * (1. + r / this.EPS) / (1 + r) }


    /**
     * Virtual temperature
     * @param {number} t - temperature (ºC)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} virutal temperature (ºC)
     */
    static tvc(t, r) { return this.tv(t + this.c0, r) - this.c0 }

    //tvFromTdc(t,td,p{ return tvc(t, rwc(td, p))


    //********************************************************************
    // POTENTIAL TEMPERATURE *********************************************
    //********************************************************************
    ____potential_temperature____() { }


    /**
     * Potential temperature 	     
     * th =  t*(1000/p)^(RD/CPD)       
     * @param {number} t - temperature (K)
     * @param {number} p - pressure (hPa)
     * @returns {number} potential temperature (K)
     */
    static th(t, p) { return t * Math.pow(this.PST / p, this.XI) }


    /**
     * Potential temperature 	     
     * th =  t*(1000/p)^(RD/CPD)       
     * @param {number} t - temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @returns {number} potential temperature (ºC)
     */
    static thc(t, p) { return this.th(t + this.c0, p) - this.c0 }


    /**
     * Temperature from potential temperature 	          
     * @param {number} th - potential temperature (K)
     * @param {number} p - pressure (hPa)
     * @returns {number} temperature (K)
     */
    static t_from_thp(th, p) { return th * Math.pow(p / this.PST, this.XI) } 	// getTemperatureFromPotentialTemperature(th,p{ return th * Math.pow(p/PST, XI)


    /**
     * Temperature from potential temperature 	          
     * @param {number} th - potential temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @returns {number} temperature (ºC)
     */
    static tc_from_thcp(thc, p) { return this.t_from_thp(thc + this.c0, p) - this.c0 } 	//getTemperatureFromPotentialTemperatureCelsius(th_c,p{ return getTemperatureFromPotentialTemperature(th_c+c0, p) - c0


    //    getPressureFromPotentialTemperature(th,t{ return PST * Math.pow(t/th, XII)
    //    getPressureFromPotentialTemperatureCelsius(th,t{ return getPressureFromPotentialTemperature(th+c0, t+c0)
    //    getTemperatureFromPseudoAdiabaticTemperature(th,p{ return th * Math.pow(p/PST, 0.285)
    //    getTemperatureFromPseudoAdiabaticTemperatureCelsius(th_c,p{ return getTemperatureFromPseudoAdiabaticTemperature(th_c+c0, p) - c0


    //********************************************************************
    // EQUIVALENT TEMPERATURE ********************************************
    //********************************************************************
    ____equivalent_temperature____() { }


    /**    
     * Equivalent temperature
     * @param {number} t - temperature (K)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} equivalent temperature (K)
     */
    static te(t, r) { return t * Math.exp(this.lv(t) * r / (this.CPD * t)) }


    /**    
     * Equivalent temperature
     * @param {number} t - temperature (ºC)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} equivalent temperature (ºC)
     */
    static tec(t, r) { return this.te(t + this.c0, r) - this.c0 }


    /**    
     * Equivalent potential temperature
     * @param {number} t - temperature (K)
     * @param {number} p - pressure (hPa)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} equivalent potential temperature (K)
     */
    static the(t, p, r) { return this.th(t, p) * Math.exp(this.lv(t) * r / (this.CPD * t)) }


    /**    
     * Equivalent potential temperature
     * @param {number} t - temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} equivalent potential temperature (ºC)
     */
    static thec(t, p, r) { return this.the(t + this.c0, p, r) - this.c0 }


    /**    
     * Equivalent temperature from temperature and lvr
     * @param {number} t - temperature (ºC)
     * @param {number} lvr - latent heat of vaporization/condensation (J/g)
     * @returns {number} equivalent temperature (ºC)
     */
    static tec_from_lvr(t, lvr) { return (t + this.c0) * Math.exp(lvr / (this.CPD * (t + this.c0))) - this.c0 }


    //********************************************************************
    // WET-BULB TEMPERATURE **********************************************
    //********************************************************************
    ____wetbulb_temperature____() { }


    /**
     * Wet-bulb temperatrue
     * @param {number} t - temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} wet-bulb temperatrue (ºC)
     */
    static twc(t, p, r) {
        let ZE4 = 1.e-4
        let lvr = this.lvc(t) * r
        
        let tw
        if (500. < p) { tw = this.twc_stull(t, p, r) }
        else { tw = this.twc_daviesjones(t, p, lvr) }

        //console.log("TW",p,tw)
        let fb, fa
        for (var i = 0; i < 3; i++) {
            fb = this.twc_newton_f(p, t, lvr, tw + ZE4)
            fa = this.twc_newton_f(p, t, lvr, tw)
            tw -= fa * ZE4 / (fb - fa)
        }
        return tw
    }


    /**
     * Wet-bulb temperatrue
     * @param {number} p - pressure (hPa)
     * @param {number} t - temperature (ºC)
     * @param {number} lvr - latent heat of vaporization/condensation (J/g)
     * @param {number} tw - wet-bulb temperatrue (ºC)
     * @returns {number} wet-bulb temperatrue (ºC)
     */
    static twc_newton_f(p, t, lvr, tw) {
        // Mesoscale Meteorology in Midlatitudes
        // Royal Meteorology Society
        // Markowski, Richardson (2010)
        // eq 2.26
        //[cpd + rvs(Tw)cl](T − Tw) = lv(Tw)rvs(Tw) − lv(T)rv
        let rw = this.rwc(tw, p)
        return (this.CPD + rw * this.cpw_table(tw)) * (t - tw) - this.lvc(tw) * rw + lvr
    }


    /**
     * Wet-bulb temperatrue
     * @param {number} t - temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} wet-bulb temperatrue (ºC)
     */
    static twc_stull(t, p, r) {
        // http://journals.ametsoc.org/doi/full/10.1175/JAMC-D-11-0143.1
        // Wet-Bulb Temperature from Relative Humidity and Air Temperature 
        // Stull (2011)
        // eq. 1
        let rh = 100.0 * r / this.rwc(t, p)
        let tw = t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659))
        tw += Math.atan(t + rh)
        tw -= Math.atan(rh - 1.676331)
        tw += 0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh)
        return tw - 4.686035
    }


    /**
     * Wet-bulb temperatrue
     * @param {number} t - temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @param {number} lvr - latent heat of vaporization/condensation (J/g)
     * @returns {number} wet-bulb temperatrue (ºC)
     */
    static twc_daviesjones(t, p, lvr) {
        // http://journals.ametsoc.org/doi/abs/10.1175/2007MWR2224.1
        // An Efficient and Accurate Method for Computing the Wet-Bulb Temperature along Pseudoadiabats
        // Robert Davies-Jones (2007)
        // eq. 4.8, 4.9, 4.10, 4.11
        let lam = 3.504
        let pp0 = p / this.PST
        let tec = this.tec_from_lvr(t, lvr)
        //pi  = Math.pow(pp0,XI)
        let pi = Math.pow(pp0, 1.0 / lam)
        //ctl = Math.pow(c0/te,XII)
        let ctl = Math.pow(this.c0 / (tec + this.c0), lam)
        let D = 1.0 / (0.1859 * pp0 + 0.6512)

        if (D < ctl) {
            let Ar = 2675.0 * this.rwc(tec, p)
            return tec - Ar / (1.0 + Ar * this.ewldc(tec))
        } else {
            let pi2 = pi * pi
            let k1 = -38.5 * pi2 + 137.81 * pi - 53.737
            let k2 = -4.392 * pi2 + 56.831 * pi - 0.384
            if (0.99999 < ctl) { return k1 - k2 * ctl }
            else if (0.39999 < ctl) { return k1 - 1.21 - (k2 - 1.21) * ctl }
            else { return k1 - 2.66 - (k2 - 1.21) * ctl + 0.58 / ctl }
        }
    }


    /**
     * Potential Wet-bulb temperatrue
     * @param {number} t - temperature (ºC)
     * @param {number} p - pressure (hPa)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} potential wet-bulb temperatrue (ºC)
     */
    static thwc(t, p, r) {
        // http://journals.ametsoc.org/doi/abs/10.1175/2007MWR2224.1
        // An Efficient and Accurate Method for Computing the Wet-Bulb Temperature along Pseudoadiabats
        // Robert Davies-Jones (2007)
        // eq. 3.8
        let theV = this.the(t + this.c0, p, r) // the = the() conflict
        let thw = theV - this.c0
        if (theV > 173.15) {
            let x = theV / this.c0
            let px = 1.
            let num = this.DJA[0]
            let den = this.DJB[0]
            for (let i = 1; i < 5; i++) { // in range(1,5)
                px *= x
                num += this.DJA[i] * px
                den += this.DJB[i] * px
            }
            thw -= Math.exp(num / den)
        }
        return thw
    }


    /**
     * 
     * @param {number} t 
     * @returns {number} tsneG
     */
    static tsneG(t) { return Math.exp(this.AERKA * t / (this.AERKB + t)) / (1. + t / this.c0) }


    /**
     * 
     * @param {number} t 
     * @param {number} h 
     * @param {number} p 
     * @returns {number} tsneF0
     */
    static tsneF0(t, h, p) { return t * (1.0 + 0.003309 * t - 0.0001441 * t * t) + 10.6 * Math.pow(1.0 + (t / this.c0), 1.94) * (h * this.tsneG(t) - 1.) * (this.PSEA / p) }


    //********************************************************************
    // WIND CHILL TEMPERATURE INDEX **************************************
    //********************************************************************
    //    wcti(tc,vkmh{ 
    //        if 10.0<tc:
    //           return null
    //        else:
    //           vexp=(1.852*vkmh)**0.16
    //           return 13.1267+0.6215*tc-11.37*vexp+0.3965*tc*vexp

    //********************************************************************
    // ENTROPY ***********************************************************
    //********************************************************************
    // phi(t,p{ return CPD * Math.log(th(t,p))
    // phic(t,p{ return phi(t+c0, p)
    // getPressureFromTePhi(t,phi{ return PST * Math.pow(t*Math.exp(-phi/CPD), XII)
    // getPressureFromTePhiCelsius(t,phi{ return getPressureFromTePhi(t+c0, phi)


    //********************************************************************
    // DEW POINT *********************************************************
    //********************************************************************
    ____dewpoint____() { }


    /**
     * Dew point
     * @param {number} t - temperature (ºC)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {number} dew point (ºC)
     */
    static tdc(p, r) {
        let ew = this.e_from_pr(p, r)
        let dp = 0.
        // Metodo de Newton x-=f/f'
        if (this.AERK) {
            let x = this.AERKABI * Math.log(this.AERK0 / ew)
            for (let i in [0, 1, 2]) {
                let dpb = this.AERKB + dp
                dp -= (this.AERKBI * dp + x * dpb) * dpb
            }
        } else {
            for (let i in [0, 1, 2]) {
                dp -= Math.log(this.ewc(dp) / ew) / this.ewldc(dp)
            }
        }
        return dp
    }


    /**
     * Dew point from specific humidity
     * @param {number} t - temperature (ºC)
     * @param {number} q - specific humidity (kg/kg)
     * @returns {number} dew point (ºC)
     */
    static tdc_from_q(p, q) { return this.tdc(p, this.r_from_q(q)) }


    //********************************************************************
    // PSEUDOADIABATIC ****************************************************
    //********************************************************************
    ____pseudoadiabatic____() { }


    /**
     * 
     * @param {number} t - temperature (ºC)
     * @param {number} p - pressure (hPa) 
     * @returns {number}
     */
    static getXiPseudoAdiabatic(t, p) {
        let LV = this.lv(t)
        let cc = LV * this.rw(t, p) / (this.RD * t)
        return this.XI * (1. + cc) / (1. + this.Z2 * LV * cc / t)
    }


    //********************************************************************
    // TABLES ************************************************************
    //********************************************************************
    ____tables____() { }


    /**
     * Linear interpolation for array values
     * @param {Array} X - array for x values
     * @param {Array} Y - array for y values
     * @param {number} x - value x to find
     * @returns {number} interpolated y value
     */
    static line_interp(X, Y, x) {
        let i = s3.bisect(X, x) // left index 
        let x0 = X[i - 1]
        let x1 = X[i]
        let y0 = Y[i - 1]
        let y1 = Y[i]
        let y = (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0)
        //console.log("line_interp",i,x,x0,x1,y0,y1,y)
        return y
    }


    /**
     * Water density
     * @param {number} t - Temperature (ºC)
     * @returns {number} - water density (g/cm³)
     */
    static water_density(t) {
        return this.line_interp(this.TA1, this.RHOL, t)
    }


    /**
     * Water specific heat at constant pressure (J/kg*K)
     * @param {number} t - Temperature (ºC)
     * @returns {number} - Water specific heat at constant pressure (J/kg*K)
     */
    static cpw_table(t) {
        return this.line_interp(this.TA2, this.CPA, t)
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
     * @param {number} t - temperatrue (K)
     * @returns {number} latent heat of vaporization/condensation (J/g)
     */
    static lvc(t) { return this.ewldc(t) * this.RV * (t + this.c0) ** 2 }


    /**
     * Latent Heat of Vaporization/Condensation
     * @param {number} t - temperatrue (ºC)
     * @returns {number} latent heat of vaporization/condensation (J/g)
     */
    static lv(t) { return this.ewld(t) * this.RV * t ** 2 }


    //********************************************************************
    // UNITS ******************************************************
    //********************************************************************
    ____units____() { }


    /**
     * Change m/s to kt or km/h
     * @param msvalue - wind speed [m/s]
     * @param {'kt'|'kmh'} unit 
     * @returns wind speed [kt|kmh]
     */
    static convert_wind(msvalue, unit) {
        switch (unit) {
            case "kt":
                return msvalue * 1.943844492;
                break;
            case "kmh":
                return msvalue * 3.6;
                break;
            default:
                return msvalue;
        }
    }


    /**
     * Change wind from mathematical direction to meteorological direction 
     * @param {number} md - mathematical direction (º)
     * @returns {number} meteorological direction (º)
     */
    static math2met(md) {
        if (0 > 270 - md) return 270 - md + 360
        else return 270 - md
    }


    /**
     * 
     * @param {number} deg - degrees 
     * @param {number} ref - reference
     * @returns {number}
     */
    static rangedeg(deg, ref = 180.) {
        if (deg < ref - 180.) return deg + 360.
        if (ref + 180. < deg) return deg - 360.
        return deg
    }


} // Th class


//********************************************************************
// Standard Atmosphere ***********************************************
//********************************************************************
function ____standard_atmosphere____() { }


/** 
 * Standard Atmosphere Layer
 * Defines a layer of the standard atmosphere
 */
class SAL {
    constructor(name, altitude, geometric, gradient, temperature, pressure, density) {
        this.n = name          // name of the layer
        this.h = altitude      // geopotencial altitude (mgp)
        this.z = geometric     // geometric altitude (m)
        this.g = gradient / 1000 // vertical gradient (K/km)
        this.t = temperature   // temperature at lower lim it of the layer (K)
        this.p = pressure      // pressure at lower lim it of the layer (Pa)
        this.d = density       // density at lower lim it of the layer (kg/m³)
    }
}


/**
 *   International Standard Atmosphere 1976
 *    --------------------------------------
 *    #   Capa         Altura geopotencial h0 (msnm)   Altura geométrica z0 (msnm)   Gradiente térmico a (K/km)    Temperatura base T0 (K)  Presión base p0 (Pa) Densidad base ρ0 (kg/m3)
 *    1   Troposfera       0      0  −6.5    288.15  101325  1.2250
 *    2   Tropopausa   11000  11019   0.0    216.65   22632  0.3639
 *    3   Estratosfera 20000  20063  +1.0    216.65  5474,9  0.0880
 *    4   Estratosfera 32000  32162  +2,8    228.65  868,02  0.0132
 *    5   Estratopausa 47000  47350   0.0    270.65  110,91  0.0020
 *    6   Mesosfera    51000  51413  −2.8    270.65  66,939  
 *    7   Mesosfera    71000  71802  −2.0    214.65  3,9564  
 *    
 *    References:
 *    https://www.mide.com/air-pressure-at-altitude-calculator
 *    https://www.digitaldutch.com/atmoscalc/US_Standard_Atmosphere_1976.pdf
 */
class SA {

    static layers = [
        new SAL('Troposfera', 0, 0, -6.5, 288.15, 101325, 1.2250),
        new SAL('Tropopausa', 11000, 11019, 0.0, 216.65, 22632, 0.3639),
        new SAL('Estratosfera', 20000, 20063, +1.0, 216.65, 5474.9, 0.0880),
        new SAL('Estratosfera', 32000, 32162, +2.8, 228.65, 868.02, 0.0132),
        new SAL('Estratopausa', 47000, 47350, 0.0, 270.65, 110.91, 0.0020),
        new SAL('Mesosfera', 51000, 51413, -2.8, 270.65, 66.939, 0),
        new SAL('Mesosfera', 71000, 71802, -2.0, 214.65, 3.9564, 0),
    ]

    static G = 9.80665     // aceleartion of gravity adoptet constant [m/s²]
    static Rt = 6356766     // earth radius [m]
    static Rc = 8.31432     // universal gas constant [J/kg*K*mol]        
    static R = 287.05287   // gas constant for dry air (J/kg*K) [m²/K*s²]
    static M = 0.028964420 // air molar mass at sea level [kg/mol]

    static METERS_TO_FEET = 3.28083989501312;
    static HPA_TO_PSI = 0.014503773773;


    /**
     * Geopotential altitude from pressure
     * @param p - pressure (Pa)
     * @returns geopotential altitude [m]
     */
    static altitudeAtPressure(p) {
        for (let l of this.layers.reverse()) {
            if (p > l.p) { continue }
            if (l.g == 0) {
                return l.h - (this.Rc * l.t * Math.log(p / l.p)) / (this.G * this.M)
            } else {
                return l.h + (l.t / l.g) * (Math.pow((p / l.p), -this.Rc * l.g / (this.G * this.M)) - 1)
            }
        }
        return null
    }


    /**
     * Pressure at geopotential altitude
     * @param h - geopotential altitude [m]
     * @returns pressure (Pa)
     */
    static pressureAtAltitude(h) {
        for (let l of this.layers.reverse()) {
            if (h < l.h) { continue }
            if (l.g == 0) {
                return l.p * Math.exp(-this.G * this.M * (h - l.h) / (this.Rc * l.t))
            } else {
                return l.p * Math.pow(1 + l.g * (h - l.h) / l.t, -this.G * this.M / (this.Rc * l.g))
            }
        }
        return null
    }
}



//// https://github.com/robbykraft/StandardAtmosphere/blob/master/standardAtmosphere.js
//
//// international standard atmosphere, good to 20,000 m
//// robby kraft
//// mit open source software license
//
//var EARTH_RADIUS = 6371000.0;   // meters
//var REAL_GAS_CONSTANT = 287.04 // earth air, m^2/Ksec^2
//var E = 2.71828182845904523536028747135266250;
//var METERS_TO_FEET = 3.28083989501312;
//var HPA_TO_PSI = 0.014503773773;
//// CONDITIONS AT ALTITUDE 0
//var SEA_LEVEL_PRESSURE = 1013.25;
//var SEA_LEVEL_TEMPERATURE = 15;
//var SEA_LEVEL_GRAVITY = 9.80665;
//var SEA_LEVEL_DENSITY = 1.225;
//var SEA_LEVEL_SPEED_OF_SOUND = 340.294;
//
//Atmosphere(){
//    var temperature;    // celsius (288.15 in K)
//    var pressure;       // psi  (101325 N/m^2) or (1013.25 hPa)
//    var density;        // kg/m^3
//    var gravity;        // m/sec^2
//    var speed_of_sound; // m/sec
//};
//
//
//// altitude in meters
//atmosphereAtAltitude(altitude){
//    var a = new Atmosphere();
//    if(altitude < 0.0 || altitude > 20000.0) return a;   // calculations only valid between sea level and 20,000m
//    a.gravity = SEA_LEVEL_GRAVITY * Math.pow( EARTH_RADIUS / (EARTH_RADIUS+altitude), 2);
//    if(altitude < 11000.0){ // meters, (36,089 ft)
//        a.temperature = SEA_LEVEL_TEMPERATURE - 6.5 * altitude / 1000.0; // -= 1.98 * altitude / 1000.0; if using feet
//        a.pressure = SEA_LEVEL_PRESSURE * Math.pow(1 - (0.0065 * altitude / (SEA_LEVEL_TEMPERATURE+273.15)), 5.2561 );
//    }
//    else{  // above the troposphere
//        a.temperature = -56.5;  // C, or 216.65 K
//        a.pressure = 226.32 * Math.pow(E, -a.gravity*(altitude-11000)/(REAL_GAS_CONSTANT*216.65));
//    }
//    a.density = a.pressure/(REAL_GAS_CONSTANT*(a.temperature+273.15))*100.0;
//    a.speed_of_sound = 331 + ( 0.6 * a.temperature );
//    a.pressure *= HPA_TO_PSI;
//    return a;
//}
//
//// altitude in meters
//speedOfSoundAtAltitude(altitude){
//    if(altitude < 0.0 || altitude > 20000.0)
//        return -1;
//    else if(altitude < 11000.0)
//        return 331 + ( 0.6 * (SEA_LEVEL_TEMPERATURE - 6.5 * altitude / 1000.0) );
//    else
//        return 331 + ( 0.6 * -56.5 );
//}
//
//// altitude in meters
//gravityAtAltitude(altitude){
//    return SEA_LEVEL_GRAVITY * Math.pow( EARTH_RADIUS / (EARTH_RADIUS+altitude), 2);
//}
//
//// altitude in meters
//temperatureAtAltitude(altitude){
//    if(altitude < 0.0 || altitude > 20000.0)
//        return -1;
//    else if(altitude < 11000.0)
//        return SEA_LEVEL_TEMPERATURE - 6.5 * altitude / 1000.0;
//    else
//        return -56.5;
//}
//
//// altitude in meters
//pressureAtAltitude(altitude){
//    if(altitude < 0.0 || altitude > 20000.0)
//        return -1;
//    else if(altitude < 11000.0)
//        return SEA_LEVEL_PRESSURE * Math.pow(1 - (0.0065 * altitude / ((SEA_LEVEL_TEMPERATURE-(6.5*altitude/1000.0) )+273.15)), 5.2561 ) * HPA_TO_PSI;
//    else
//        return 226.32 * Math.pow(E, -(SEA_LEVEL_GRAVITY * Math.pow( EARTH_RADIUS / (EARTH_RADIUS+altitude), 2))*(altitude-11000)/(REAL_GAS_CONSTANT*216.65)) * HPA_TO_PSI;
//}
//
//// altitude in meters
//densityAtAltitude(altitude){
//    var temperature = SEA_LEVEL_TEMPERATURE;
//    var pressure = SEA_LEVEL_PRESSURE;
//    var gravity = SEA_LEVEL_GRAVITY;
//    if(altitude < 0.0 || altitude > 20000.0)
//        return -1;
//    else if(altitude < 11000.0){
//        temperature -= 6.5 * altitude / 1000.0;
//        pressure *= Math.pow(1 - (0.0065 * altitude / (SEA_LEVEL_TEMPERATURE+273.15)), 5.2561 );
//    }
//    else{
//        temperature = -56.5;
//        pressure = 226.32 * Math.pow(E, -gravity*(altitude-11000)/(REAL_GAS_CONSTANT*216.65));
//    }
//    return pressure/(REAL_GAS_CONSTANT*(temperature+273.15))*100.0;
//}







/**
 * Exact expression for the LCL
 * https://en.wikipedia.org/wiki/Lifted_condensation_level
 *
 * @param p - pressure (Pa)
 * @param t - temperature (K)
 * @param rh - relative humidity with respect to liquid water if T >= 273.15 K and with respect to ice if T < 273.15 K [from 0 to 1]
 * @param rhl - relative humidity with respect to liquid water [from 0 to 1]
 * @param rhs - relative humidity with respect to liquid water [from 0 to 1]
 * @param return_ldl - optional logical flag.  If true, the lifting deposition level (LDL) is returned instead of the LCL. 
 * @param return_min_lcl_ldl - optional logical flag.  If true, the minimum of the LCL and LDL is returned.
 * @returns t_lcl,p_lcl - temperature and pressure at LCL
 *
 * https://romps.berkeley.edu/papers/pubs-2016-lcl.html
 * Version 1.0 released by David Romps on September 12, 2017.
 * Version 1.1 vectorized lcl.R, released on May 24, 2021.
 * 
 * When using this code, please cite:
 * 
 * @article{16lcl,
 *   Title   = {Exact expression for the lifting condensation level},
 *   Author  = {David M. Romps},
 *   Journal = {Journal of the Atmospheric Sciences},
 *   Year    = {2017},
 *   Month   = dec,
 *   Number  = {12},
 *   Pages   = {3891--3900},
 *   Volume  = {74}
 * }
 *
 * This lcl returns the height of the lifting condensation level
 * (LCL) in meters.  The inputs are:
 * - p in Pascals
 * - T in Kelvins
 * - Exactly one of rh, rhl, and rhs (dimensionless, from 0 to 1):
 *    * The value of rh is interpreted to be the relative humidity with
 *      respect to liquid water if T >= 273.15 K and with respect to ice if
 *      T < 273.15 K. 
 *    * The value of rhl is interpreted to be the relative humidity with
 *      respect to liquid water
 *    * The value of rhs is interpreted to be the relative humidity with
 *      respect to ice
 * - return_ldl is an optional logical flag.  If true, the lifting deposition
 *   level (LDL) is returned instead of the LCL. 
 * - return_min_lcl_ldl is an optional logical flag.  If true, the minimum of the
 *   LCL and LDL is returned.
 * Nota: se modifica para calcular p y T y devolver un objecto con las 3 variables
 */
function lcl(p, T, rh = null, rhl = null, rhs = null, return_ldl = false, return_min_lcl_ldl = false) {

    // Parameters
    let Ttrip = 273.16     // K
    let ptrip = 611.65     // Pa
    let E0v = 2.3740e6   // J/kg
    let E0s = 0.3337e6   // J/kg
    let ggr = 9.81       // m/s^2
    let rgasa = 287.04     // J/kg/K 
    let rgasv = 461        // J/kg/K 
    let cva = 719        // J/kg/K
    let cvv = 1418       // J/kg/K 
    let cvl = 4119       // J/kg/K 
    let cvs = 1861       // J/kg/K 
    let cpa = cva + rgasa
    let cpv = cvv + rgasv

    // The saturation vapor pressure over liquid water
    function pvstarl(T) {
        return ptrip * (T / Ttrip) ** ((cpv - cvl) / rgasv) *
            Math.exp((E0v - (cvv - cvl) * Ttrip) / rgasv * (1 / Ttrip - 1 / T))
    }

    // The saturation vapor pressure over solid ice
    function pvstars(T) {
        return ptrip * (T / Ttrip) ** ((cpv - cvs) / rgasv) *
            Math.exp((E0v + E0s - (cvv - cvs) * Ttrip) / rgasv * (1 / Ttrip - 1 / T))
    }

    // Calculate pv from rh, rhl, or rhs
    let rh_counter = 0
    if (rh !== null) { rh_counter = rh_counter + 1 }
    if (rhl !== null) { rh_counter = rh_counter + 1 }
    if (rhl !== null) { rh_counter = rh_counter + 1 }
    if (rh_counter != 1) {
        alert('Error in lcl: Exactly one of rh, rhl, and rhs must be specified')
        return null
    }
    if (rh !== null) {
        // The variable rh is assumed to be 
        // with respect to liquid if T > Ttrip and 
        // with respect to solid if T < Ttrip
        if (T > Ttrip) { pv = rh * pvstarl(T) }
        else { pv = rh * pvstars(T) }
        rhl = pv / pvstarl(T)
        rhs = pv / pvstars(T)

    } else if (rhl !== null) {
        pv = rhl * pvstarl(T)
        rhs = pv / pvstars(T)
        if (T > Ttrip) { rh = rhl }
        else { rh = rhs }

    } else if (rhs !== null) {
        pv = rhs * pvstars(T)
        rhl = pv / pvstarl(T)
        if (T > Ttrip) { rh = rhl }
        else { rh = rhs }
    }
    if (pv > p) {
        return NaN
    }

    // Calculate lcl_liquid and lcl_solid
    let qv = rgasa * pv / (rgasv * p + (rgasa - rgasv) * pv)
    let rgasm = (1 - qv) * rgasa + qv * rgasv
    let cpm = (1 - qv) * cpa + qv * cpv
    if (rh == 0) { return cpm * T / ggr }
    let aL = -(cpv - cvl) / rgasv + cpm / rgasm
    let bL = -(E0v - (cvv - cvl) * Ttrip) / (rgasv * T)
    let cL = pv / pvstarl(T) * Math.exp(-(E0v - (cvv - cvl) * Ttrip) / (rgasv * T))
    let aS = -(cpv - cvs) / rgasv + cpm / rgasm
    let bS = -(E0v + E0s - (cvv - cvs) * Ttrip) / (rgasv * T)
    let cS = pv / pvstars(T) * Math.exp(-(E0v + E0s - (cvv - cvs) * Ttrip) / (rgasv * T))

    let COEFlcl = bL / (aL * gsl_sf_lambert_Wm1(bL / aL * cL ** (1 / aL)))
    let COEFldl = bS / (aS * gsl_sf_lambert_Wm1(bS / aS * cS ** (1 / aS)))

    let Tlcl = T * COEFlcl
    let Tldl = T * COEFldl
    let plcl = p * Math.pow(Tlcl / T, cpm / rgasm)
    let pldl = p * Math.pow(Tldl / T, cpm / rgasm)
    let zlcl = cpm * T / ggr * (1 - COEFlcl)
    let zldl = cpm * T / ggr * (1 - COEFldl)
    //let zlcl = cpm*T/ggr*( 1 - bL/(aL*gsl_sf_lambert_Wm1(bL/aL*cL**(1/aL)) ))
    //let zldl = cpm*T/ggr*( 1 - bS/(aS*gsl_sf_lambert_Wm1(bS/aS*cS**(1/aS)) ))

    let lcl = { 'p': plcl, 't': Tlcl - Ttrip, 'z': zlcl }
    let ldl = { 'p': pldl, 't': Tldl - Ttrip, 'z': zldl }

    // Return either lcl or ldl
    if (return_ldl && return_min_lcl_ldl) { exit('return_ldl and return_min_lcl_ldl cannot both be true') }
    else if (return_ldl) {
        return ldl
    } else if (return_min_lcl_ldl) {
        if (zlcl < zldl) { return lcl }
        else { return ldl }
    } else {
        return lcl
    }
}




//********************************************************************
// TEST **************************************************************
//********************************************************************
function ____test____() { }

function test() {
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


/**
 * test LCL with different methods
 */
function test_lcl() {

    //let skew  = [397.5459297187024, 447.56381142177344, 480.9548165736661, 506.96625928110694, 528.3867585873681, 546.8413110397585, 563.2840585518163, 578.0448342994891, 591.797922547493, 604.170257222768, 615.6428939128748, 626.4497820642703, 636.8448494834807, 646.5020957515515, 655.6877714204333, 664.3777538749137, 672.868481761084, 680.826016337804, 688.5540729664838, 696.0407507601035, 703.2800422989419, 710.2603717074546, 716.972253560232, 723.7475619531924, 729.8989338507913, 736.104378033717, 742.0138771376896, 747.9693300453356, 753.6180860890931, 759.311017494428, 764.684547207394, 770.0995126661327, 775.1854396124118, 780.3065124353085, 785.4612379624416, 790.2763595184681, 795.1238143747414, 800.0002916560546, 804.5271701541458, 809.0789503692971, 813.6584637998563, 817.8789959660209, 822.1212382296186, 826.385301485042, 830.6712971897575, 834.5869442153854, 838.9152917812246, 842.8697996330427, 846.8429483804352, 850.8348258934993, 854.4437913202227, 858.4714979490275, 862.1126650881656, 865.7690845068388, 869.4408190908966, 873.1279319801488, 876.418229952772, 880.1362944621067, 883.4547635678045, 886.7849612658995, 890.1269243925112, 893.4806898704287, 896.849272010118, 900.2307557875281, 903.6241908725008, 906.6025593180437, 910.0190031788351, 913.0214765046877, 916.0320353184807, 919.0506891318532, 922.082551544192, 925.1236014764572, 928.1728325292509, 931.2333457056136, 934.3051941876092, 936.9439630034431, 940.0333976903771, 942.6908465473591, 945.7979796892323, 948.4710906914413, 951.1515520453343, 953.8372636504293, 956.5345802555642, 959.2361317799995, 961.9472230623259, 964.6657691321097, 967.3896400500776, 970.125280855047, 972.4069482174426, 975.1565594139223, 977.9115711154609, 980.2137147893125, 982.983883544939, 985.2968791430827, 987.6175068961542, 990.4061853080879, 992.739943011097, 995.0747961614841, 997.4195548120877, 999.7654140738262]
    let skewt = [397.5459297187024, 447.56381142177344, 480.9548165736661, 506.96625928110694, 528.3867585873681, 546.8413110397585, 563.2840585518163, 578.0448342994891, 591.797922547493, 604.170257222768, 615.6428939128748, 626.4497820642703, 636.8448494834807, 646.5020957515515, 655.6877714204333, 664.3777538749137, 672.868481761084, 680.826016337804, 688.5540729664838, 696.0407507601035, 703.2800422989419, 710.2603717074546, 716.972253560232, 723.7475619531924, 729.8989338507913, 736.104378033717, 742.0138771376896, 747.9693300453356, 753.6180860890931, 759.311017494428, 764.684547207394, 770.0995126661327, 775.1854396124118, 780.3065124353085, 785.4612379624416, 790.2763595184681, 795.1238143747414, 800.0002916560546, 804.5271701541458, 809.0789503692971, 813.6584637998563, 817.8789959660209, 822.1212382296186, 826.385301485042, 830.6712971897575, 834.5869442153854, 838.9152917812246, 842.8697996330427, 846.8429483804352, 850.8348258934993, 854.4437913202227, 858.4714979490275, 862.1126650881656, 865.7690845068388, 869.4408190908966, 873.1279319801488, 876.418229952772, 880.1362944621067, 883.4547635678045, 886.7849612658995, 890.1269243925112, 893.4806898704287, 896.849272010118, 900.2307557875281, 903.6241908725008, 906.6025593180437, 910.0190031788351, 913.0214765046877, 916.0320353184807, 919.0506891318532, 922.082551544192, 925.1236014764572, 928.1728325292509, 931.2333457056136, 934.3051941876092, 936.9439630034431, 940.0333976903771, 942.6908465473591, 945.7979796892323, 948.4710906914413, 951.1515520453343, 953.8372636504293, 956.5345802555642, 959.2361317799995, 961.9472230623259, 964.6657691321097, 967.3896400500776, 970.125280855047, 972.4069482174426, 975.1565594139223, 977.9115711154609, 980.2137147893125, 982.983883544939, 985.2968791430827, 987.6175068961542, 990.4061853080879, 992.739943011097, 995.0747961614841, 997.4195548120877, 999.7654140738262]

    let data = []
    for (let i = 1; i <= 100; i += 1) {
        // console.log("RH ",i, "%")

        let p = 100000
        let hp = p / 100.
        let T = 300
        let t = T - c0
        let rh = i / 100.

        let p1 = lcl(p, T, rh).p
        let z1 = SA.altitudeAtPressure(p1)
        let p2 = AdiabLift.from_pTRH(hp, t, rh, 'tdd').LCL
        let z2 = SA.altitudeAtPressure(p2 * 100)
        let p3 = AdiabLift.from_pTRH(hp, t, rh, 'skewt').LCL
        let z3 = SA.altitudeAtPressure(p3 * 100)

        let p4 = skewt[i - 1] * 100
        let z4 = SA.altitudeAtPressure(p4)

        data.push([z1 - z2, z1 - z3, z1 - z4, z1, z2, z3, z4, rh])
        //data.push([z2-z3, z1-z2,z1-z3,z1,z2,z3,rh])        
        //console.log(z1-z2,z1-z3,z1,z2,z3,rh)
        //console.log(p1-p2,z1-z2,p1,p2,rh)
    }
    console.table(data)
}


function test_lcl1(p = 1000., t = 26.85, rh = 0.5) {
    console.log('=== comparación métodos LCL ====')
    console.log('* p=', p, ' hPa')
    console.log('* t=', t, ' ºC')
    console.log('* RH=', rh, ' %')
    let p1 = lcl(p * 100., t + 273.15, rh).p
    let z1 = SA.altitudeAtPressure(p1)

    let p2 = AdiabLift.from_pTRH(p, t, rh, 'tdd').LCL
    let z2 = SA.altitudeAtPressure(p2 * 100.)

    let p3 = AdiabLift.from_pTRH(p, t, rh, 'skewt').LCL
    let z3 = SA.altitudeAtPressure(p3 * 100.)

    let data = []
    data.push(['exacto', p1 / 100., z1])
    data.push(['tdd', p2, z2])
    data.push(['skewt', p3, z3])

    console.table(data)
    console.log('diferencia z1-z2:', z1 - z2)
    console.log('diferencia z1-z3:', z1 - z3)
}



/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../src/physics/thlines.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/*! thlines.js - v1.0.0 - 2020-12-14
* Copyright (c) 2020 mgomezm@aemet.es; 
* Based on skewt library by Álvaro Subías: https://gitlab.aemet.es/asubiasd/skewt.
* Thlines
* */


/**
 * 
 */
class Thlines {


    static equidistant_pressure_range(ptop, pbot, n) {
        var ps = []
        var lntop = Math.log(ptop)
        var lnbot = Math.log(pbot)
        var inc = (lnbot - lntop) / (n - 1)
        //console.log(ptop, pbot, n, lntop, lnbot)
        for (let i = 0; i < n; i++) {
            let lnp = lntop + i * inc
            ps.push(Math.exp(lnp))
        }
        return ps
    }


    static dry_adiab(th, ptop, pbot, n) {
        let ps = this.equidistant_pressure_range(ptop, pbot, n)
        let d = []
        for (let p of ps) {
            d.push({ 'p': p, 'T': Th.tc_from_thcp(th, p) })
        }
        return d
    }


    static pse_adaib(T, p, ptop, tmin = null, DLNP = 0.004702) {
        return Th.getSaturatedAdiabaticCelsiusBackground(T, p, ptop, tmin, DLNP)
    }


    static mixing_ratio(r, ptop, pbot, n) {
        let ps = this.equidistant_pressure_range(ptop, pbot, n)
        let d = []
        for (let p of ps) {
            d.push({ 'p': p, 'T': Th.t_from_prw(p, r / 1000.) })
        }
        return d
    }
}






/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../src/physics/vertical.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/*! vertical.js - v1.0.0 - 2020-11-26
* Copyright (c) 2020 mgomezm@aemet.es; 
* Based on skewt library by Álvaro Subías: https://gitlab.aemet.es/asubiasd/skewt.
* Vertical
* */

//import * as s3 from './s3.js';


/**
 * Vertical profile class 
 * ----------------------
 * Provides the necessary operators to manage a vertical profile 
 * Requires a list of Objects
 * Data is sorted in ascending pressure.
 * 
 * TODO:
 * If new values are added above or below, this.top and this.bot need to be defined again
 * 
 * Input data:
 * p  press 975.0  (hPa)
 * z  hght  346.0  (m)
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
    bisectp = s3.bisector(d => d.p).left
    bisectz = s3.bisector((d, x) => x - d.z).left
    bisectzg = s3.bisector((d, x) => x - d.zg).left


    /**
     * Create a vertial object
     * @param {Object[]} data - Data required
     * @returns
     */
    constructor(data) {
        this.data = data.sort((a, b) => a.p - b.p) // ascending pressure
        this.top = this.data[0]
        this.bot = this.data[this.len() - 1]
    }


    /**
     * Load new data
     * @param {Object[]} data - Data required
     * @returns
     */
    start(data) {
        //console.log(data)
        this.data = data.sort((a, b) => a.p - b.p) // ascending pressure
        this.top = this.data[0]
        this.bot = this.data[this.len() - 1]
    }


    /** Data length */
    len() { return this.data.length }


    /** Class testing */
    test() {
        console.log("======== test vertial ========")
        this.info()

        console.log("==== test interpolación ====")
        for (let p of [940, 950, 960, 975, 980, 1000, 1050]) { //,975,1000,1050
            let t = this.interp(p, 'T')
            console.log(p, t)
        }

        console.log("==== test top bot ====")
        for (let p of [940, 950, 960, 975, 980, 1000, 1050]) { //,975,1000,1050
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
    trace() {
        console.log("==== Vertical profile info ====")
        if (this.data.length == 0) { console.log("sin datos"); return }
        console.log("data:", this.data)
        console.log("length:", this.len())
        console.log("top:   ", this.top.p, this.top)
        console.log("bottom:", this.bot.p, this.bot)
    }


    /**
     * Sort data in pressure order
     * @param {string} order - 'a' for ascending and 'd' for descending order 
     * @returns
     */
    sort(order = 'a') {
        if (order == 'a') this.data.sort((a, b) => a.p - b.p)
        else if (order == 'd') this.data.sort((a, b) => b.p - a.p)
    }


    /**
     * Delete all levels above or below pressure p
     * @param {number} p - pressure value (hPa)
     * @param {string} mode - 'above' or 'below' the pressure level
     * @returns
     */
    cut(p, mode = 'above') {
        let i = this.bisectp(this.data, p)
        // remove before the index
        if (mode == 'above') this.data.splice(0, i)
        // remove after the index
        else if (mode == 'below') this.data.length = i
        this.top = this.data[0]
        this.bot = this.data[this.len() - 1]
    }


    /**
     * Create a new pressure level with optional parameters to interpolate. 
     * @param {number} p - pressure (hPa)
     * @param {(boolean|string[])} params - all params of surrounding levels or list of params if provided
     * @param {boolean} insert - insert new level in data or return it
     * @returns {(null|number|Object)} null if the pressure is out of range or and exact level. Index where the new level is inserted or Object level if insert is false.
     */
    new_level(p, params = false, insert = true) {
        // bounds
        if (p < this.top.p) return null
        else if (p > this.bot.p) return null
        // check exact level
        let i = this.bisectp(this.data, p)
        if (this.data[i].p == p) return null //DEBUG
        // find layer and interpolate
        let top = this._top_l(p)
        let bot = this._bot_l(p)
        let d = { 'p': p }
        if (params == true) params = Object.keys(top)
        else if (params == false) params = []
        for (let param of params) {
            if (param == 'p') continue
            d[param] = this.inter2x(top, bot, param, 'p', p)
        }
        // insert in data or return the new level
        if (insert) { this.data.splice(i, 0, d); return i; }
        else { return d }
    }


    /**
     * Return all cases where param==value as a list of
     * objects with the pressure value and the 'sign' meaning:
     *     0 for exact matching with a level
     * 	   1 for top value<bottom value
     *    -1 for top value>bottom value
     * @param {string} param - parameter to look for
     * @param {number} value - value of the parameter (units of the parameter)
     * @returns {Object[]}
     */
    find_all(param, value) {
        var all = []
        for (var i = 0; i < this.data.length - 1; i++) {
            let prev = this.data[i][param]
            let next = this.data[i + 1][param]
            if (prev == value) { all.push({ 'sign': 0, 'p': this.data[i].p }) }
            else if (next == value) { all.push({ 'sign': 0, 'p': this.data[i + 1].p }) }
            else if (prev < value && next >= value) { all.push({ 'sign': 1, 'p': this.inter2y(this.data[i], this.data[i + 1], 'p', param, value) }) }
            else if (prev > value && next <= value) { all.push({ 'sign': -1, 'p': this.inter2y(this.data[i], this.data[i + 1], 'p', param, value) }) }
        }
        return all
    }


    /**
     * Finds top pressure where param==value. Interpolates if needed. 
     * @param {string} param - parameter to look for
     * @param {number} value - value of the parameter (units of the parameter)
     * @returns {null|number} pressure level (hPa)
     */
    find_top(param, value) {
        for (var i = 0; i < this.data.length - 1; i++) {
            let prev = this.data[i][param]
            let next = this.data[i + 1][param]
            if (prev == value) { return this.data[i].p }
            else if (prev < value && next >= value) { return this.inter2y(this.data[i], this.data[i + 1], 'p', param, value) }
            else if (prev > value && next <= value) { return this.inter2y(this.data[i], this.data[i + 1], 'p', param, value) }
        }
        return null
    }


    /**
     * Finds bottom pressure where param==value. Interpolates if needed. 
     * @param {string} param - parameter to look for
     * @param {number} value - value of the parameter (units of the parameter)
     * @returns {null|number} pressure level (hPa)
     */
    find_bot(param, value) {
        for (var i = this.data.length - 1; i > 0; i--) {
            let prev = this.data[i - 1][param]
            let next = this.data[i][param]
            if (prev == value) { return this.data[i].p }
            else if (prev < value && next >= value) { return this.inter2y(this.data[i - 1], this.data[i], 'p', param, value) }
            else if (prev > value && next <= value) { return this.inter2y(this.data[i - 1], this.data[i], 'p', param, value) }
        }
        return null
    }


    /**
     * Finds bottom altitude where param==value. Interpolates if needed. 
     * @param {string} param - parameter to look for
     * @param {number} value - value of the parameter (units of the parameter)
     * @returns {null|number} altitude (m)
     */
    find_botz(param, value) {
        for (var i = this.data.length - 1; i > 0; i--) {
            let prev = this.data[i - 1][param]
            let next = this.data[i][param]
            if (prev == value) { return this.data[i - 1].z }
            else if (prev < value && next >= value) { return this.inter2y(this.data[i - 1], this.data[i], 'z', param, value) }
            else if (prev > value && next <= value) { return this.inter2y(this.data[i - 1], this.data[i], 'z', param, value) }
        }
        return null
    }


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
    *levels(top = null, bot = null, selection = 'exact', params = false, reverse = false) {
        // level selection
        if (!top) top = this.top.p
        if (!bot) bot = this.bot.p
        let it, ib
        if (selection == 'inner') {
            it = this._bot_i(top)
            ib = this._top_i(bot)
        } else if (selection == 'outer') {
            it = this._top_i(top)
            ib = this._bot_i(bot)
        } else if (selection == 'exact') {
            if (this._exists(top)) { it = this._top_i(top); var del_it = false }
            else { it = this.new_level(top, params, true); var del_it = true }
            if (this._exists(bot)) { ib = this._bot_i(bot); var del_ib = false }
            else { ib = this.new_level(bot, params, true); var del_ib = true }
        }
        // generator
        if (reverse == true) {
            for (var i = ib; i >= it; i--) {
                yield this.data[i]
            }
        } else {
            for (var i = it; i <= ib; i++) {
                yield this.data[i]
            }
        }
        // delete new levels. Biggest index first
        if (selection == 'exact') {
            if (del_ib) this.data.splice(ib, 1);
            if (del_it) this.data.splice(it, 1);
        }
    }


    /**
     * Iterator of layers between top and bot pressure
     * @param {number} top - top pressure (hPa)
     * @param {number} bot - bottom pressure (hPa)
     * @param {('exact'|'inner'|'outer')} selection - level selection
     * 	  exact: add two levels at the exact pressures. Interpolate all the variables.
     *    inner: selects first levels below 'top' and above 'bot'
     *    outer: selects first levels above 'top' and below 'bot'
     * @param {(boolean|string[])} params - true for all params of surrounding levels or list of params if provided
     * @yields {Object[]} - top and bottom data levels
     */
    *layers(top = null, bot = null, selection = 'exact', params = false) {
        // level selection
        if (!top || top < this.top.p) { top = this.top.p }
        if (!bot || bot > this.bot.p) { bot = this.bot.p }
        //if (top<this.top.p) top = this.top.p
        let it, ib
        if (selection == 'inner') {
            it = this._bot_i(top)
            ib = this._top_i(bot)
        } else if (selection == 'outer') {
            it = this._top_i(top)
            ib = this._bot_i(bot)
        } else if (selection == 'exact') {
            if (this._exists(top)) { it = this._top_i(top); var del_it = false }
            else { it = this.new_level(top, params, true); var del_it = true }
            if (this._exists(bot)) { ib = this._bot_i(bot); var del_ib = false }
            else { ib = this.new_level(bot, params, true); var del_ib = true }
        }
        // generator
        for (var i = it; i < ib; i++) {
            yield [this.data[i], this.data[i + 1]]
        }
        // delete new levels. Biggest index first
        if (selection == 'exact') {
            if (del_ib) this.data.splice(ib, 1);
            if (del_it) this.data.splice(it, 1);
        }
    }


    /**
     * Returns the layer which contains the pressure value.
     * layer: top and bottom levels.
     * Same levels are returned if pressure is in the data.
     * @param {number} p - pressure (hPa)
     * @returns {layer} - list of two levels
     */
    layer(p) {
        if (p < this.top.p) return null
        else if (p > this.bot.p) return null
        let i = this.bisectp(this.data, p) //, 1, lines.length-1);
        // exact level
        if (this.data[i].p == p) return [this.data[i], this.data[i]]
        else return [this.data[i - 1], this.data[i]]
    }


    /**
     * Returns the mean of the parameter over all levels between ptop and btop.
     * @param {string} param - parameter 
     * @param {number} ptop - top pressure (hPa)
     * @param {number} pbot - bottom pressure (hPa)
     * @param {('exact'|'inner'|'outer')}
     * @returns {number} mean
     */
    mean(param, ptop, pbot, selection = 'exact') {
        let s = 0 // sum
        let n = 0 // number of levels
        for (let l of this.levels(ptop, pbot, selection, [param])) {
            s += l[param]
            n += 1
        }
        return s / parseFloat(n)
    }


    /**
     * Linear interpolation
     * @param {number} x0 
     * @param {number} x1 
     * @param {number} x - value to interpolate
     * @param {number} y0 
     * @param {number} y1 
     * @returns {number} y value
     */
    inter2(x0, x1, x, y0, y1) {
        return (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0)
    }


    // /**
    //  * Interpolation between 2 levels
    //  * @param {Object} dt - top data level
    //  * @param {Object} db - bottom data level
    //  * @param {string} y_param - variable to interpolate
    //  * @param {string} x_param - ordinate variable (p,z,zg)
    //  * @param {number} x_value - ordinate value
    //  * @param {string} fn - function to linearize x_param and y_param (linear,ln,exp) 
    //  * @returns
    //  */
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
     * Interpolates parameter between 2 levels
     * @param {Object} dt - top data level
     * @param {Object} db - bottom data level
     * @param {string} param - parameter to interpolate
     * @param {string} ordinate - ordinate variable (p,z,zg)
     * @param {number} value - ordinate value (units of the ordinate)
     * @returns {number} - parameter value
     */
    inter2x(dt, db, param, ordinate, value) {
        // abscissa axis
        let x0 = dt[param]
        let x1 = db[param]
        // ordinate axis
        let y = value
        let y0 = dt[ordinate]
        let y1 = db[ordinate]
        if (ordinate == 'p') {
            y = Math.log(y)
            y0 = Math.log(y0)
            y1 = Math.log(y1)
        }
        // result
        let x = (x0 * (y1 - y) + x1 * (y - y0)) / (y1 - y0)
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
    inter2y(dt, db, ordinate, param, value) {
        // abscissa axis
        let x = value
        let x0 = dt[param]
        let x1 = db[param]
        // ordinate axis
        let y0 = dt[ordinate]
        let y1 = db[ordinate]
        if (ordinate == 'p') {
            y0 = Math.log(y0)
            y1 = Math.log(y1)
        }
        // result
        let y = (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0)
        if (ordinate == 'p') return Math.exp(y)
        else return y
    }


    /**
     * Interpolation of 'param' at presure 'p'
     * @param {number} p - pressure (hPa)
     * @param {string} param - name of the variable to be interpolated
     * @param {string} fn - function to linearize p and param 
     * @returns {null|number} 
     */
    interp(p, param, fn = 'ln') {
        //console.log("interp", p, param)
        // bounds
        if (p < this.top.p) return null
        else if (p > this.bot.p) return null
        // bottom level index 
        let i = this.bisectp(this.data, p)
        // exact level
        if (this.data[i].p == p) return this.data[i][param]
        // ordinate axis
        let y = p
        let y0 = this.data[i - 1].p
        let y1 = this.data[i].p
        // function to linearize p and param
        if (fn == 'ln') {
            y = Math.log(y)
            y0 = Math.log(y0)
            y1 = Math.log(y1)
        }
        // abscissa axis
        let x0 = this.data[i - 1][param]
        let x1 = this.data[i][param]
        let x = (x0 * (y1 - y) + x1 * (y - y0)) / (y1 - y0)
        return x
    }


    /**
     * Interpolation of 'param' at altitude 'z'
     * @param {number} z - altitude (m)
     * @param {string} param - name of the variable to be interpolated
     * @returns {null|number} 
     */
    interz(z, param) {
        // bounds
        if (z > this.top.z) return null
        else if (z < this.bot.z) return null
        // bottom level index 
        let i = this.bisectz(this.data, z)
        // exact level
        if (this.data[i].z == z) return this.data[i][param]
        // ordinate axis
        let y = z
        let y0 = this.data[i - 1].z
        let y1 = this.data[i].z
        // abscissa axis
        let x0 = this.data[i - 1][param]
        let x1 = this.data[i][param]
        let x = (x0 * (y1 - y) + x1 * (y - y0)) / (y1 - y0)
        return x
    }


    /**
     * Interpolation of 'param' at height 'zg'
     * @param {number} zg - altitude (m)
     * @param {string} param - name of the variable to be interpolated
     * @returns {null|number} 
     */
    interzg(zg, param) {
        // bounds
        if (zg > this.top.zg) return null
        else if (zg < this.bot.zg) return null
        // bottom level index 
        let i = this.bisectzg(this.data, zg)
        // exact level
        if (this.data[i].zg == zg) return this.data[i][param]
        // ordinate axis
        let y = zg
        let y0 = this.data[i - 1].zg
        let y1 = this.data[i].zg
        // abscissa axis
        let x0 = this.data[i - 1][param]
        let x1 = this.data[i][param]
        let x = (x0 * (y1 - y) + x1 * (y - y0)) / (y1 - y0)
        return x
    }


    /**
     * Closest level to pressure p
     * @param {number} p - pressure (hPa)
     * @returns {Object} data level
     */
    closest(p) {
        // bounds
        if (p < this.top.p) return this.data[0]
        else if (p > this.bot.p) return this.data[this.len() - 1]
        // closest
        let i = this._top_i(p)
        if (i == this.len() - 1) { return this.data[i] }
        else if ((p - this.data[i].p) < (this.data[i + 1].p - p)) { return this.data[i] }
        else { return this.data[i + 1] }
    }


    /**
     * Determines if pressure level exists
     * @param {*} p - pressure (hPa)
     * @returns {boolean}
     */
    _exists(p) {
        if (p < this.top.p) return false
        else if (p > this.bot.p) return false
        let i = this.bisectp(this.data, p)
        if (i >= this.len()) return false // debug: test016
        if (this.data[i].p == p) return true
        return false
    }


    /**
     * Get top pressure index
     * @param {number} p - pressure (hPa)
     * @returns {number} index in the data list
     */
    _top_i(p) {
        if (p < this.top.p) return null
        let i = this.bisectp(this.data, p)
        if (i == this.len()) return i - 1
        else if (this.data[i].p == p) return i
        else return i - 1
    }


    /**
     * Get top pressure level
     * @param {number} p - pressure (hPa)
     * @returns {number} level
     */
    _top_l(p) {
        let i = this._top_i(p)
        return this.data[i]
    }


    /**
     * Get bottom pressure index
     * @param {number} p - pressure (hPa)
     * @returns {number} index in the data list
     */
    _bot_i(p) {
        if (p > this.bot.p) return null
        let i = this.bisectp(this.data, p)
        if (i >= this.len() - 1) return this.len() - 1
        else return i
    }


    /**
     * Get bottom pressure level
     * @param {number} p - pressure (hPa)
     * @returns {number} level
     */
    _bot_l(p) {
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
* Based on skewt library by Álvaro Subías: https://gitlab.aemet.es/asubiasd/skewt.
* AdiabLift
* */


/**
 * AdiabLift class 
 * ----------------------
 * Computes a parcel lifting and derived indexes. 
 */
class AdiabLift extends Vertical {


    /** 
     * Constructor
     * @param {number} p - pressure (hPa)
     * @param {number} T - temperature (ºC)
     * @param {number} r - mixing ratio (kg/kg)
     * @param {string} calc - debug parameter: 'tdd' para buscar LCL más exacto. 'skewt' para hacerlo igual que en skewt.
     */
    constructor(p, T, r, calc="tdd") {
        super([])

        this.calc = calc // debug variable

        // initial parcel values
        this.p0 = p
        this.T0 = T
        this.r0 = r //rwc(Td,p)
        this.Td0 = Th.t_from_prw(p, r) // dew point
        this.TH = Th.thc(T, p)        // potential temperature
        this.THE = Th.thec(T, p, r)     // equivalent potential temperature

        // computed in this class
        // parcel leveles
        this.LCL  // Lifted Condensation Level
        this.LCLv // Lifted Condensation Level with virutal temperatures
        this.LFC  // Level of Free Convection
        this.LFCv // Level of Free Convection with virutal temperatures
        this.EL   // Equilibrium Level
        this.ELv  // Equilibrium Level with virutal temperatures

        // parcel altitudes
        this.zLC
        this.zLCLv
        this.zLFC
        this.zLFCv
        this.zEL
        this.zELv

        // parcel temperatures
        this.TLCL
        this.TLCLv
        this.TLFC
        this.TLFCv
        this.TEL
        this.TELv

        // energies
        this.CIN
        this.CINv
        this.CAPE
        this.CAPEv
        this.CAPE3
        this.CAPE3v
        this.DCAPE
        this.DCAPEv

        // indexes
        this.LIFT
        this.LIFTv
        this.LIFT7
        this.LIFT7v

        // computed in souding
        // convective condensation 
        this.CCL   // Convective Condesation Level
        this.zCCL  // Convective Condesation Level Altitude
        this.CCLv  // Convective Condesation Level
        this.CCLv  // Convective Condesation Level Altitude
        this.CCT   // Convective Condesation Temperature (at CCL)
        this.CCTv  // Convective Condesation Temperature (at CCL)
        this.TCCL  // Convective Condesation Temperature (at CCL) (duplicated for display)
        this.TCCLv // Convective Condesation Temperature (at CCL) (duplicated for display)
        this.CT    // Convective Temperature
        this.CTv   // Convective Temperature

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


    /** */
    trace() {
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
        console.log("CIN", this.CIN, this.CINv)
        console.log("CAPE", this.CAPE, this.CAPEv)
        console.log("CAPE3", this.CAPE3, this.CAPE3v)
        // DEBUG
        console.log("LIFT", this.LIFT, this.LIFTv)
        console.log("LIFT7", this.LIFT7, this.LIFT7v)
    }


    /** */
    trace_area() {
        console.log("==== adiablift areas ====")
        console.log("CIN", this.CIN, this.CINv, this.CINN, this.CINNv)
        console.log("CAPE", this.CAPE, this.CAPEv, this.CAPEN, this.CAPENv)
        if (this.CAPEv != this.CAPENv) console.log("DIFERENCIA!!!")
    }


    /**
     * Returns the initial values p,Td and T.
     * @returns {Array} - list with initial values
     */
    starting_values() {
        return [this.p0, this.Td0, this.T0]
    }


    /**
     * Constructor overload
     * @param p - pressure (hPa)
     * @param T - temperature (ºC)
     * @param Td - dew point temperature (ºC)
     */
    static from_pTTd(p, T, Td, calc) {
        let r = Th.rwc(Td, p)
        return new AdiabLift(p, T, r, calc)
    }


    /**
     * Constructor overload
     * @param p - pressure (hPa)
     * @param T - temperature (ºC)
     * @param RH- relative humidity (from 0 to 1)
     */
    static from_pTRH(p, T, RH, calc) {
        let rw = Th.rwc(T, p) // saturation mixing ratio
        let r = RH * rw
        return new AdiabLift(p, T, r, calc)
    }


    /**
     * Calculate vertical temperature profile and LCL
     */
    set() {

        // dry adiabat
        if (this.calc == 'tdd') {
            var dd = Th.getDryAdiabaticCelsius(this.T0, this.p0, this.r0, Th.DP, false) // improved LCL
        } else if (this.calc == 'skewt') {
            var dd = Th.getDryAdiabaticCelsius(this.T0, this.p0, this.r0, Th.DP, true) // skewt LCL
        }

        // LCL
        this.LCL = dd[dd.length - 1].p
        this.LCLv = this.LCL

        // pseudoadiabt 
        let tc = dd[dd.length - 1].T
        var ds = Th.getSaturatedAdiabaticCelsius(tc, this.LCL, 100.)

        // debug: values at LCL
        // console.log("T", this.T0, dd[dd.length-1].T)
        // console.log("p", this.p0, dd[dd.length-1].p)
        // console.log("r", this.r0, dd[dd.length-1].r)

        // total
        this.data = dd.concat(ds)
        this.sort()
        this.top = this.data[0]
        this.bot = this.data[this.len() - 1]

        // debug
        // let midthw = thwc(tc, this.LCL, this.bot.r)
        // let botthw = thwc(this.bot.T, this.bot.p, this.bot.r)
        // let topthw = thwc(this.top.T, this.top.p, this.top.r)
        // let botthe = thec(this.bot.T, this.bot.p, this.bot.r)
        // let topthe = thec(this.top.T, this.top.p, this.top.r)
        // this.diffthw = topthw-botthw
        // console.log("adiablift:", this.p0, botthw, topthw, topthw-botthw, topthw>botthw, botthe, topthe, topthe-botthe, topthe>botthe)
        // console.log("adiablift:", this.p0, botthw, topthw, topthw-botthw, topthw>botthw)
        // console.log("adiablift:", this.p0, midthw, topthw, topthw-midthw, topthw>midthw)
        // console.log("adiablift data: lcl:", this.LCL, 'rw:', rwc(tc, pc), 'n:', dd.length)
    }


    /**
     * Data creation
     * Calculates CIN, CAPEs, LFC, EL for the sounding data provided
     * 1. Completes the sounding and parcel data in each other's levels
     * 2. Calculates everything
     * @param {Object} sond - Sounding Object with a data list
     */
    comp(sond) {

        // soudning data
        let sdata = sond.data

        // completa los datos de la burbuja con los niveles del sondeo.
        sdata.forEach(function(d) {
            // check p already exists or has some interpolation problems
            if (this._exists(d.p)) { return }
            let t = this.interp(d.p, 'T')
            if (!(t)) return
            // add new data
            let r = this.r0
            if (d.p < this.LCL) { r = this.interp(d.p, 'r') }
            this.data.push({ 'T': t, 'p': d.p, 'r': r, 'Tv': Th.tvc(t, r), 'Td': Th.t_from_prw(d.p, r) })
            // sort
            this.sort()
        }, this)

        // interpola los datos del sondeo en los niveles de la burbuja
        this.data.forEach(function(d) {
            let t = sond.interp(d.p, 'T')
            let tv = sond.interp(d.p, 'Tv')
            let z = sond.interp(d.p, 'z')
            if (t === null) return
            d.z = z
            d.T2 = t            // sounding temperature
            d.T2v = tv           // sounding virtual temperature
            d.iT = d.T2 - d.T  // temperature interval
            d.iTv = d.T2v - d.Tv // virtual temperature interval
        }, this)

        this.cut(sond.top.p, 'above')

        // add new levels in every intersection of iT and iTv
        let all
        all = this.find_all('iT', 0.).reverse()
        all.forEach(function(d, i) {
            this.new_level(d.p, true, true)
        }, this)
        all = this.find_all('iTv', 0.).reverse()
        all.forEach(function(d, i) {
            this.new_level(d.p, true, true)
        }, this)

        // DEBUG
        // this.data.forEach(function(d){ 
        //     d.The = thec(d.T, d.p, d.r)  // setThe
        //     d.Thw = thwc(d.T, d.p, d.r)  // setThw
        // })            

        // zLCL, zLCLv
        this.zLCL = sond.interp(this.LCL, 'zg')
        this.zLCLv = this.zLCL
        this.TLCL = this.interp(this.LCL, 'T')
        this.TLCLv = this.interp(this.LCL, 'Tv')

        this.set_LFC_EL(sond)

        // CAPE, CAPE3, CIN
        if (this.LFC && this.EL) {
            let z3 = sond.bot.z + 3000
            let p3 = this.find_bot('z', z3)
            this.CAPE3 = this.cape(p3, this.LFC)
            // integral neta
            this.CAPE = this.area(this.EL, this.LFC, 'iT')
            this.CIN = -this.area(this.LFC, this.p0, 'iT')
            // old
            //this.CIN  = this.cin(cintop, this.p0) // from 0 to LFC
            //this.CAPE = this.cape(this.EL, this.LFC)
        }

        // CAPEv, CAPE3v, CINv
        if (this.LFCv && this.ELv) {
            let z3 = sond.bot.z + 3000
            let p3 = this.find_bot('z', z3)
            this.CAPE3v = this.cape(p3, this.LFCv, 'iTv')
            // integral neta
            this.CAPEv = this.area(this.ELv, this.LFCv, 'iTv')
            this.CINv = -this.area(this.LFCv, this.p0, 'iTv')
            // old
            //this.CINv  = this.cin(cintopv, this.p0, 'iTv') // from 0 to LFC
            //this.CAPEv = this.cape(this.ELv, this.LFCv, 'iTv')
        }

        // LIFT, LIFTv
        let p5 = 500.
        let p7 = 700.
        this.LIFT = sond.interp(p5, 'T') - this.interp(p5, 'T')
        this.LIFTv = sond.interp(p5, 'Tv') - this.interp(p5, 'Tv')
        this.LIFT7 = sond.interp(p7, 'T') - this.interp(p7, 'T')
        this.LIFT7v = sond.interp(p7, 'Tv') - this.interp(p7, 'Tv')
    }
    
    
    /**
     * Computes LFC and EL
     * debug test022 SB: añadido para contemplar las burbujas que ascienden desde la derecha y solo tienen un corte. 
     * O las burbujas de SB que se mantienen siempre a la derecha hasta EL.
     * Es posible reorganizar el código para hacerlo más sencillo y lógico, contemplando todos los casos.
     * note: sign==1: changes from negative to positiva area, the parcel crosses left to right the sounding (e.g. the LFC) 
     * @param {Object} sond - Sounding Object with a data list
     */
    set_LFC_EL(sond){
        let all
        // LFC and EL
        all = this.find_all('iT', 0).reverse()

        all.forEach(function(d, i) {
            if (d.p < this.LCL && !(this.LFC) && (d.sign == 1 || d.sign == 0)) {
                this.LFC = d.p
                this.zLFC = sond.interp(this.LFC, 'zg')
                this.TLFC = this.interp(this.LFC, 'T')
            }
            if (d.p < this.LFC && (d.sign == -1 || d.sign == 0)) {
                this.EL = d.p
                this.zEL = sond.interp(this.EL, 'zg')
                this.TEL = this.interp(this.EL, 'T')
            }
        }, this)
        // debug test022 SB
        // si solo hay un corte la burbuja sale ya saturada y el LFC es el LCL. El corte es el EL
        if (!this.LFC && all.length==1) {
            let p = all[0].p
            if (p<this.LCL){
                this.LFC  = this.LCL
                this.zLFC = sond.interp(this.LFC, 'zg')
                this.TLFC = this.interp(this.LFC, 'T')
                this.EL   = p
                this.zEL  = sond.interp(this.EL, 'zg')
                this.TEL  = this.interp(this.EL, 'T')
            }
        // si hay dos cortes la burbuja sale ya saturada en el primer corte, el LFC es el LCL y el segundo corte es el EL
        } else if (!this.LFC && all.length==2){
            if (this.LCL== all[0].p){
                let p     = all[1].p
                this.LFC  = this.LCL
                this.zLFC = sond.interp(this.LFC, 'zg')
                this.TLFC = this.interp(this.LFC, 'T')
                this.EL   = p
                this.zEL  = sond.interp(this.EL, 'zg')
                this.TEL  = this.interp(this.EL, 'T')
            }
        }

        // LFCv and ELv
        all = this.find_all('iTv', 0).reverse()
        all.forEach(function(d, i) {
            if (d.p < this.LCLv && !(this.LFCv) && (d.sign == 1 | d.sign == 0)) {
                this.LFCv = d.p
                this.zLFCv = sond.interp(this.LFCv, 'zg')
                this.TLFCv = this.interp(this.LFCv, 'Tv')
            }
            if (d.p < this.LFCv && (d.sign == -1 | d.sign == 0)) {
                this.ELv = d.p;
                this.zELv = sond.interp(this.ELv, 'zg')
                this.TELv = this.interp(this.ELv, 'Tv')
            } // get the last one
        }, this)
        
        // debug test022 SB
        // si solo hay un corte la burbuja sale ya saturada y el LFC es el LCL. El corte es el EL
        if (!this.LFCv && all.length==1) {
            let p = all[0].p
            if (p<this.LCLv){
                this.LFCv  = this.LCLv
                this.zLFCv = sond.interp(this.LFCv, 'zg')
                this.TLFCv = this.interp(this.LFCv, 'Tv')
                this.ELv   = p
                this.zELv  = sond.interp(this.ELv, 'zg')
                this.TELv  = this.interp(this.ELv, 'Tv')
            }
        // si hay dos cortes la burbuja sale ya saturada en el primer corte, el LFC es el LCL y el segundo corte es el EL
        } else if (!this.LFCv && all.length==2){
            if (this.LCLv== all[0].p){
                let p     = all[1].p
                this.LFCv  = this.LCLv
                this.zLFCv = sond.interp(this.LFCv, 'zg')
                this.TLFCv = this.interp(this.LFCv, 'Tv')
                this.ELv   = p
                this.zELv  = sond.interp(this.ELv, 'zg')
                this.TELv  = this.interp(this.ELv, 'Tv')
            }
        }
    }


    /**
     * Calculates the area for the given param
     * @param {string} param 
     */
    debug_areas(param = 'CAPE') {
        let ptop, pbot, source
        if (param == 'CAPE') { ptop = this.EL; pbot = this.LFC; source = 'iT' }
        if (param == 'CAPEv') { ptop = this.ELv; pbot = this.LFCv; source = 'iTv' }
        if (param == 'CIN') { ptop = this.LFC; pbot = this.p0; source = 'iT' }
        if (param == 'CINv') { ptop = this.LFCv; pbot = this.p0; source = 'iTv' }
        console.log('ptop:', ptop, 'pbot:', pbot, source)
        let AREA = 0
        for (let l of this.layers(ptop, pbot, 'exact', true)) {
            //let increment = RD*Layer.deltaln(l,'p')*Layer.half(l,source)
            AREA += RD * Layer.deltaln(l, 'p') * Layer.half(l, source)
        }
        console.log("AREA", AREA)
    }


    /**
     * Returns the CAPE and CIN sections to be plotted in different colors
     */
    cape_sections(param = 'iT') {
        if (param == 'iT') {
            if (this.CAPE == null) return null
            if (this.EL == null) return null
        } else if (param == 'iTv') {
            if (this.CAPEv == null) return null
            if (this.ELv == null) return null
        } else {
            return null
        }
        let capes = []
        let cins = []
        let positive = true // starts from top with CAPE
        let all = this.find_all(param, 0).reverse()
        let it
        let ib
        for (let i = all.length - 1; i >= 0; i--) {
            it = this._bot_i(all[i].p)
            // last level in odd number of intersections
            if (positive == true && i == 0) {
                ib = this.len() - 1 // debug test022 SB
                //break
            // last level in even number of intersections
            } else if (positive == false && i == 0) {
                ib = this.len() - 1
            } else {
                ib = this._bot_i(all[i - 1].p)
            }
            if (positive) { capes.push(this.data.slice(it, ib + 1)) }
            else          { cins.push(this.data.slice(it, ib + 1)) }
            positive = !positive
        }
        return { 'capes': capes, 'cins': cins }
    }


    /**
     * Calculates area bewteen the given pressures for a parameter which is a temperature difference.
     * iT for temperature difference
     * iTv for virtual temperature differenice
     * @param {number} ptop - pressure (hPa)
     * @param {number} pbot - pressure (hPa)
     * @param {string} param - parameter to evaluate, typicaly 'iT' or 'iTv'
     * @returns 
     */
    area(ptop, pbot, param = 'iT') {
        let AREA = 0
        for (let l of this.layers(ptop, pbot, 'exact', true)) {
            AREA += Th.RD * Layer.deltaln(l, 'p') * Layer.half(l, param)
        }
        return AREA
    }


    cin(ptop, pbot, param = 'iT') {
        let CIN = 0
        for (let l of this.layers(ptop, pbot, 'exact')) {
            if (Layer.half(l, param) > 0) {
                // equivalente a: def dpe(self,i): return Th.RD*self.p.deltaln(i)*self.T.half(i)
                //console.log(l, RD*Layer.deltaln(l,'p')*Layer.half(l,param), CIN )
                CIN -= Th.RD * Layer.deltaln(l, 'p') * Layer.half(l, param)
            }
        }
        return CIN
    }

    cape(ptop, pbot, param = 'iT') {
        let CAPE = 0
        for (let l of this.layers(ptop, pbot, 'exact')) {
            if (Layer.half(l, param) < 0) {
                CAPE += Th.RD * Layer.deltaln(l, 'p') * Layer.half(l, param)
            }
        }
        return CAPE
    }


    /**
     * Downward Convective Available Potential Energy (DCAPE)
     * https://www.weather.gov/media/lmk/soo/DCAPE_Web.pdf
     * @param {Obejct} sond - Sounding object
     */
    dcape(sond) {

        // debug: test
        //TLCL = 12.521414833905396 
        //LCL  = 901.1745396600302 
        //PBOT = 1014.3182
        //DCAPE = 335.30964432614616
        //console.log("dcape", TLCL, LCL, PBOT)

        this.dcapedata = Th.getSaturatedAdiabaticDownCelsius(this.TLCL, this.LCL, sond.bot.p)

        let DCAPE = 0
        let DCAPEv = 0
        let pprev = this.LCL
        let tprev = sond.interp(this.dcapedata[0].p, 'T')
        let rprev = sond.interp(this.dcapedata[0].p, 'r')
        let tvprev = Th.tvc(tprev, rprev)
        let twprev = this.TLCL
        let twvprev = Th.tvc(twprev, this.r0)

        this.dcapedata.forEach(function(d, i) {

            let p = d.p
            let t = sond.interp(d.p, 'T')
            let r = sond.interp(d.p, 'r')
            let tv = Th.tvc(t, r)
            let tw = d.T
            let twv = Th.tvc(tw, this.r0)

            d.Tv = twv          // adiablift virutal temperature
            d.T2 = t            // sounding temperature
            d.T2v = tv           // sounding virtual temperature

            if (i == 0) { return }

            DCAPE += Math.log(pprev / p) * ((t - tw) + (tprev - twprev))
            DCAPEv += Math.log(pprev / p) * ((tv - twv) + (tvprev - twvprev))

            pprev = p
            tprev = t
            rprev = r
            tvprev = tv
            twprev = tw
            twvprev = twv
        }, this);

        this.DCAPE = -DCAPE * Th.RD * 0.5
        this.DCAPEv = -DCAPEv * Th.RD * 0.5
        //console.log(this.DCAPEv, this.DCAPE)
    }
}


/**
 * Utilities for layer operations.
 * Layer: list of two levels (object) in ascending pressure order
 */
class Layer {
    static half(l, param) {
        return (l[0][param] + l[1][param]) * 0.5
    }

    static deltaln(l, param) {
        return Math.log(l[0][param] / l[1][param])
    }
}


// /**
//  * https://github.com/wesbos/es6-articles/blob/master/54%20-%20Extending%20Arrays%20with%20Classes%20for%20Custom%20Collections.md
//  */
// class La extends Array{
// 	constructor(l){
// 		super(...l)
// 		//this.l = l
// 	}
// 	half(){
// 		return (this[0]+this[1])*0.5
// 	}
// }


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../src/physics/sounding.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/*! sounding.js - v1.0.0 - 2020-11-26
* Copyright (c) 2020 mgomezm@aemet.es; 
* Based on skewt library by Álvaro Subías: https://gitlab.aemet.es/asubiasd/skewt.
* Sounding
* */


var testad // debug variable 


/**
 * Sounding class
 * --------------
 * Every variable is linearly interpolated with altitude (z), height (zg) or logarithmic pressure (ln(p))
 */
class Sounding extends Vertical {

    low_layer_parcels = [30, 50, 100]

    parcels = {}

    /**
     * Constructor
     * @param {Array.<Obejct>} data - array of levels
     * @param {Obejct} meta - metadata 
     * @param {Array} parcels - list of parcels to replace the default low_layer_parcels
     */
    constructor(data, meta = null, parcels = null) {
        super(data)
	// parcels
        if (parcels != null) this.low_layer_parcels = parcels
        // meta
        if (meta) {
            this.model = meta.model
            this.index = meta.index
            this.date = meta.date
            this.run = meta.run
            this.step = meta.step
            this.lon = meta.lon
            this.lat = meta.lat
            this.ps = meta.ps
            this.zs = meta.zs
            this.name = meta.name
        }
        // DEBUG MUCAPE OPT
        // this.Thwm = 999 // minimum Thw DEBUG
        // this.pThwm      // pressure of Thwm DEBUG
        // this.Thwsm = 999 // minimum Thw DEBUG
        // this.pThwsm      // pressure of Thwm DEBUG        
        // this.Thwvsm = 999 // minimum Thw DEBUG
        // this.pThvwsm      // pressure of Thwm DEBUG 

        // data: complete sounding
        this.data.forEach(function(d, i) {
	    //console.log(this.name)
            this.set(d)
        }, this);
        this.set_z()

        // instability
        this._insThw()
        // inversion
        this._invT()
    }


    /**
     * Set all the variables from the basic data
     * @param {Obecjt} d - data level
     */
    set(d) {
    d.T = d.T || d.t
        //d.r = Th.r_from_q(d.q)
	if (this.model == "OBSERVACION") {
      d.Td = d.td
	  d.r = Th.rwc(d.Td,d.p)
	} else if (this.model.includes("ECMWF")) {
      d.rh = d.RH
      d.r = d.rh * Th.rwc(d.T, d.p) / 100.
      d.q=Th.q_from_r(d.r)
      d.Td = Th.tdc(d.p, d.r)
      d.wS = Math.sqrt(d.u * d.u + d.v * d.v)
      d.wD = Math.atan2(d.v, d.u)
    } else {  
	  d.r = Th.r_from_q(d.q)
	  d.Td = Th.tdc(d.p, d.r)
    }
    //console.log(d.p,d.T,d.RH,d.Td)
    d.rw = Th.rwc(d.T, d.p)
    d.h = d.r / d.rw
    d.Tv = Th.tvc(d.T, d.r)
    d.rwv = Th.rwc(d.Tv, d.p)
    d.Te = Th.tec(d.T, d.r)
    d.Tw = Th.twc(d.T, d.p, d.r)
    //console.log("TW",d.T,d.p,d.r,d.Tw)
    d.Th = Th.thc(d.T, d.p)
    d.The = Th.thec(d.T, d.p, d.r)
    d.Thw = Th.thwc(d.T, d.p, d.r)
        // cota
    d.TSn = Th.tsneF0(d.T, d.h, d.p)
    d.Twsn = d.TSn * Math.pow((d.p * Th.c0) / ((Th.c0 + d.T) * Th.PSEA), 0.54)
    if (d.Twsn < 0) d.Twsn = 0.
        // wind speed and math direction
        //d.wS = Math.sqrt(d.u * d.u + d.v * d.v)
        //d.wD = Math.atan2(d.v, d.u)
    d.u=d.wS*Math.cos(d.wD)
    d.v=d.wS*Math.sin(d.wD)
	//d.zg = d.z - this.zs // height from ground
        // clean
        delete d.t

        // DEBUG MUCAPE OPT
        // let Thwsm = Th.thwc(d.T, d.p, d.rw)
        // if (Thwsm<this.Thwsm){
        // 	this.Thwsm = Thwsm
        // 	this.pThwsm = d.p
        // }
        // if (d.Thw<this.Thwm){
        //     this.Thwm = d.Thw
        //     this.pThwm = d.p
        // } 
        // let Thwvsm = Th.thwc(d.Tv, d.p, d.rw)
        // if (Thwvsm<this.Thwvsm){
        //     this.Thwvsm = Thwvsm
        //     this.pThwvsm = d.p
        // }
    }


    /**
     * Computes thickness with the hypsometric ecuation
     */
    set_z() {
        let z = this.zs
        let p = this.ps
        let Tv = this.data[this.len() - 1].Tv
        let Tv_half = Tv
        let d
        for (let i = this.data.length - 1; i >= 0; i--) {
            d = this.data[i]
	    //console.log("D",d)
            Tv_half = (d.Tv + Tv) / 2.
            z += Th.hypsometric_ec(Tv_half, d.p, p)
            d.z = z
            d.zg = d.z - this.zs                   // height from ground
            d.zs = SA.altitudeAtPressure(d.p * 100.) // height of standard atmosphere            
            //console.log(i,d.p,z,d.z, d.z-z)
            p = d.p
            Tv = d.Tv
        } //, this);
    }


    /** 
     * Returns the meta and data in an object.
     */
    get_data() {
        let res = {}
        res.meta = {}
        res.meta.model = this.model
        res.meta.index = this.index
        res.meta.date = this.date
        res.meta.run = this.run
        res.meta.step = this.step
        res.meta.lon = this.lon
        res.meta.lat = this.lat
        res.meta.ps = this.ps
        res.meta.zs = this.zs
        res.meta.name = this.name
        res.data = this.data
        return res
    }


    /** Inversions */
    _invT() {
        for (let l of this.layers()) {
            if ((l[0].T - l[1].T) > 0.) { l[1].invt = 1 } // inversion
            else { l[1].invt = 0 }
        }
    }


    /** */
    _insThw() {
        for (let l of this.layers()) {
            if ((l[0].Thw - l[1].Thw) < 0) { l[1].insthw = 1 } // unstable 
            else { l[1].insthw = 0 }
        }
    }


    /**
     * Computes everything
     */
    start() {
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


    /** */
    test_debug() {
        for (let p = 1000; p > 300; p -= 100) {
            let maxdif = -999
            let maxt
            for (let t = -50; t < 150; t++) {
                let r = rwc(t, p)
                let ad = new AdiabLift(p, t, r)
                console.log(p, t, r, ad.diffthw)
                if (ad.diffthw > maxdif) {
                    maxdif = ad.diffthw
                    maxt = t
                }
            }
            break
            console.log("maxdiff", p, maxt, maxdif)
        }

    }


    // DEBUG TODO: repasar. calcualr sin el loop de umbrales. Repasar las primeras lineas donde interpola...
    calc_cota() {
        this.COTANIE0 = null
        this.COTANIE = {}
        this.areath = {}
        this.sfcphi = {}
        this.sfcprsn = {}

        //let p = this.find_bot('TSn', 0)
        let p = this.find_bot('TSn', 0)
        if (p == null) { return }
        //TODO: check p

        let [top, bot] = this.layer(p)
        //let z = this.linter(top, bot, 'z', 'TSn', 0)
        let z = this.inter2y(top, bot, 'z', 'TSn', 0)
        let zli = this.interp(p, 'z', 'linear')
        let zln = this.interp(p, 'z', 'ln')
        // console.log("cota",p)
        // console.log("capa",top, bot)
        // console.log("z",z)
        // console.log("zli",zli)
        // console.log("zln",zln)
        let gam = 0.45
        let ddl = 1.6
        let ph1 = 28.
        let aaa = Math.log(20.)
        for (let rr of [0.2, 0.5, 1., 3., 10.]) {
            let tag = 'COTANIE' + String(rr).replace('.', '')
            //console.log(rr, tag)
            let aph = Math.pow(ph1 * Math.pow(rr, gam), ddl)
            this.areath[tag] = aph
            let area = 0.5 * bot.Twsn * (z - bot.z)
            this.sfcarea = area
            this.sfcareamelt = area
            this.sfcareameltmx = area
            this.sfcareadiff = 0.
            if (aph < area) this.COTANIE[tag] = bot.z + Math.sqrt(aph / area) * (z - bot.z)
            for (let l of this.layers(bot.p, this.bot.p, 'exact')) {
                let a9 = this.sfcareamelt
                let tw5 = (l[0].Twsn + l[1].Twsn) * 0.5
                let twdz = (l[0].z - l[1].z) * tw5
                this.sfcarea += twdz
                this.sfcareamelt += twdz
                if (this.sfcareamelt < 0) this.sfcareamelt = 0
                this.sfcareameltmx = Math.max(this.sfcareameltmx, this.sfcareamelt)
                let dmelt = this.sfcareameltmx - this.sfcareamelt
                if (this.sfcareadiff < dmelt) this.sfcareadiff = dmelt
                if (aph < this.sfcareamelt) {
                    if (this.COTANIE[tag] == undefined) {
                        this.COTANIE[tag] = this.inter2(a9, this.sfcareamelt, aph, l[0].z, l[1].z)
                        //console.log(tag,this.COTANIE[tag])
                    }
                }
                if (this.sfcareameltmx) {
                    this.sfcphi[tag] = Math.pow(this.sfcareameltmx, 1. / ddl) / Math.pow(rr, gam)
                    this.sfcprsn[tag] = 1. / (1. + Math.exp(aaa * ((this.sfcphi[tag] / ph1) - 1.)))
                }
            }
        }
    }


    /**
     * Returns the pressure and temperature for COTANIE tag.
     * @param {string} tag 
     * @returns 
     */
    get_cota(tag) {
        if (this.COTANIE[tag] != undefined) {
            let p = this.find_bot('z', this.COTANIE[tag])
            let t = this.interp(p, 'TSn', 'linear')
            return [p, t]
        }
        return null
    }


    /**
     * Computes basic indexes
     */
    compute_index() {

        let p3 = 300.
        let p5 = 500.
        let p7 = 700.
        let p8 = 850.
        let ps = this.bot.p
        let Ts = this.interp(ps, 'T')
        let Tds = this.interp(ps, 'Td')
        let T5 = this.interp(p5, 'T')
        let Td5 = this.interp(p5, 'Td')
        let T7 = this.interp(p7, 'T')
        let Td7 = this.interp(p7, 'Td')
        let T8 = this.interp(p8, 'T')
        let Td8 = this.interp(p8, 'Td')
        let r8 = this.interp(p8, 'r')
        let z5 = this.interp(p5, 'z')
        let z7 = this.interp(p7, 'z')
        let T5v = this.interp(p5, 'Tv')
        let Td5v = this.interp(p5, 'Td')
        let T7v = this.interp(p7, 'Tv')
        let Td7v = this.interp(p7, 'Td')

        // console.log( p3,p5,p7,p8,ps)
        // console.log( 'Ts', Ts, Tds)
        // console.log( T5, Td5)
        // console.log( T7, Td7)
        // console.log( T8, Td8)
        // console.log( z7,z5)
        // console.log( T5v, Td5v)
        // console.log( T7v, Td7v)

        this.K = T8 - T5 + Td8 - T7 + Td7
        this.TT = Td8 + T8 - 2. * T5
        this.ISOC = this.find_botz('T', 0)
        this.ISOW = this.find_botz('Tw', 0)
        this.PW = this.pw(p3, ps)
        this.PW5 = this.pw(p5, p7)
        this.PW7 = this.pw(p7, p8)
        this.PW8 = this.pw(p8, ps)
        this.DTZ75 = (T7 - T5) / (z7 - z5) // gradient 700-500 hPa
        let ad85 = AdiabLift.from_pTTd(p8, T8, Td8) //let ad85 = new AdiabLift(p8, T8, r8)
        this.SHOW = T5 - ad85.interp(p5, 'T')
        //        let ad7 = AdiabLift.from_pTTd(p7, T7, Td7)
        //        ad7.comp(this)
        //        ad7.dcape(this)
        //        this.DCAPE7 = ad7.DCAPE // DCAPE at 700 hPa. Used as fixed index in table
    }


    /** 
    * ECMWF CAPE
    * Work in progress...
    */
    cape_ecmwf(p, t, r, ptop, pbot) {
        //console.log("================== CAPE ECMWF ===============")
        //console.log(p,t,r, ptop, pbot)
        //t = tv(t,r)
        let thep = thec(t, p, r) // Equivalent potential temperature of the parcel
        let CAPE = 0
        for (let l of this.layers(ptop, pbot, 'inner')) {
            //if (Layer.half(l,param)<0){
            let thesattop = thec(l[0].T, l[0].p, l[0].rw) // Environmental saturated equivalent potential temperature
            let thesatbot = thec(l[1].T, l[1].p, l[1].rw) // Environmental saturated equivalent potential temperature
            //let thesattop = thec(l[0].Tv, l[0].p, l[0].rwv) 
            //let thesatbot = thec(l[1].Tv, l[1].p, l[1].rwv) 
            let thesatmed = 0.5 * (thesattop + thesatbot)
            let incCAPE = RD * Layer.deltaln(l, 'p') * (thesatmed - thep)
            CAPE += incCAPE
            //console.log(incCAPE, CAPE, l[0].p, l[1].p)
        }
        return CAPE

        // let thep = thec(t,p,r) // Equivalent potential temperature of the parcel
        // let CAPE  = 0
        // for (let l of this.layers(ptop, pbot, 'inner')){ 
        //     let incz = l[0].z - l[1].z
        //     let thesattop = thec(l[0].T, l[0].p, l[0].rw) // Environmental saturated equivalent potential temperature
        //     let thesatbot = thec(l[1].T, l[1].p, l[1].rw) // Environmental saturated equivalent potential temperature
        //     let thesatmed = 0.5*(thesattop+thesatbot)
        //     let incCAPE = G*incz*(thep-thesatmed)/thesatmed
        //     CAPE += incCAPE
        //     console.log(incCAPE, CAPE, l[0].p, l[1].p)
        // }   
        // return CAPE
    }


    /**
     * Computes MUCAPE ascending from model levels.
     * mixlimit and mixthick are meant to replcate IFS calculations. 
     * From the Technical Memo 852:
     * "Most unstable parcel of any model levels up to 350 hPa pressure level; 
     *  surface (lowest model level) parcel not considered, instead mixed layer 
     *  30-hPa parameters used in the lowest 60 hPa"
     * 
     * @param {number} pmin - minimum pressure (hPa)
     * @param {number} mixlimit - pressure limit for the mixed layer(hPa)
     * @param {number} mixthick - mixed layer thickness (hPa)
     * @returns geopotential altitude (m)
     */
    mucape_model_levels(pmin = 350, mixlimit = 60, mixthick = 30) {

        let MC = null // variable used to return the net result of this method

        // surface effective shear
        let ad = new AdiabLift(this.bot.p, this.bot.T, this.bot.r)
        ad.comp(this)
        if (ad.CAPEv && ad.ELv) {
            this.HEFFSHEARBs = this.interp(this.bot.p, 'zg')
            this.HEFFSHEARTs = this.interp((this.bot.p + ad.ELv) * 0.5, 'zg')
        }

        // mix conditions for initial levels
        //let mixlimit = 0 // 60
        //let mixthick = 0 // 30

        for (let l of this.levels(pmin, this.bot.p, 'inner', true, true)) {

            let px
            let Tx
            let rx
            let mixed = false

            // IFS: first 60 hPa - mixed layer of 30 hPa thickness
            if ((this.bot.p - l.p) < mixlimit) {
                let pbot = l.p
                let ptop = l.p - mixthick
                px = (pbot + ptop) / 2
                let Thx = this.mean('Th', ptop, pbot, 'exact')
                Tx = tc_from_thcp(Thx, px)
                rx = this.mean('r', ptop, pbot, 'exact')
                mixed = true
                //console.log("mucape mix", px, Tx, rx)

            } else {
                px = l.p
                Tx = l.T
                rx = l.r
                //console.log("mucape lvl", px, Tx, rx)
            }

            // adiabat lift
            //console.log("mucape lvl", px, Tx, rx, mixed)
            let ad = new AdiabLift(px, Tx, rx)
            //if (ad==null) continue
            ad.comp(this)

            // cape IFS
            //cape_ecmwf(px, Tx, rx, ad.LFC, ad.EL)


            // DEBUG: optimización de ascensos
            let l0 = ad.bot
            let adthw = ad.bot.Thw //thwc(Tx, px, rx)
            let adthe = ad.bot.The //thec(Tx, px, rx)
            //console.log(l.n,l.p, this.Thwsm, adthw, ad.diffthw, adthw<this.Thwsm, ad.CAPE, ad.CAPEv) //adthe
            //console.log(l.n,l.p, this.Thwsm, this.Thwvsm, adthw, ad.diffthw, adthw<this.Thwvsm, ad.CAPE, ad.CAPEv) //adthe
            if (px < this.pThwvsm && ad.CAVEv) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!! px<this.pThwvsm && ad.CAVEv")
            }


            // MUCAPE
            if (ad.CAPEv) {

                // local variable 
                if (ad.CAPEv > MC) { MC = ad.CAPEv }

                // MUCAPE
                if (ad.CAPEv > this.MUCAPE) {
                    this.MUCAPE = ad.CAPEv
                    this.MUCIN = ad.CINv
                    this.MUp = px
                    this.MUT = Tx
                    this.MUr = rx

                    // Effective Bulk Shear
                    if ((this.bot.p - l.p) <= 300 && ad.ELv) {
                        this.HEFFSHEARB = this.interp(px, 'zg')
                        this.HEFFSHEART = this.interp((px + ad.ELv) * 0.5, 'zg')
                    }
                }
            }

            // ESRH - Effective Storm-Relative Helicity Heights
            // lift parcel from model level in case it's mixed.
            if (mixed == true) {
                px = l.p
                Tx = l.T
                rx = l.r
                ad = new AdiabLift(px, Tx, rx)
                ad.comp(this)
            }

            if (ad.CINv < 250. && ad.CAPEv > 100.) {
                if (this.EFFBAS == null) {
                    this.EFFBAS = px
                    this.HEFFBAS = this.interp(px, 'zg')
                }
            } else {
                if (this.EFFBAS != null && this.EFFTOP == null) {
                    this.EFFTOP = px
                    this.HEFFTOP = this.interp(px, 'zg')
                }
            }
        } // for

        return MC
    }


    /**
     * Computes advanced indexes
     */
    compute_advanced_index() {
        //console.log("compute_advanced_index")

        // MUCAPE
        this.MUCAPE = null // Most Unstable Convective Available Potential Energy
        this.MUCIN = null // CIN of MUCAPE parcel
        this.MUp = null // Pressure of MU parcel
        this.MUT = null // Temperature of MU parcel
        this.MUr = null // Mixing ratio of MU parcel

        // Effective Storm-Relative Helicity
        this.ESRHL = null // Effective Storm-Relative Helicity Left
        this.ESRHR = null // Effective Storm-Relative Helicity Right
        this.EFFBAS = null // Base for ESRH (First level with CINv<250. && CAPEv>100.)
        this.HEFFBAS = null // Height above ground of EFFBAS
        this.EFFTOP = null // Top for ESRH (Doesn't comply CINv<250. && CAPEv>100., and EFFBAS exists)
        this.HEFFTOP = null // Height above ground of EFFTOP

        this.CIZE = null // Effective Bulk Shear 
        this.CIZEs = null // Effective Bulk Shear for surface parcel
        this.HEFFSHEARB = null // Base for CIZE
        this.HEFFSHEART = null // Top for CIZE (1/2 height of MU parcel to EL)
        this.HEFFSHEARBs = null // Surface height for CIZEs (first level)
        this.HEFFSHEARTs = null // Top for CIZEs

        this.SCP2L = null // Supercell Composite Parameter
        this.SCP2R = null // Supercell Composite Parameter

        // MUCAPE
        //console.log("=================== MUCAPE START===================")
        let pmin = 350.
        // this.mucape_eqpress(20)
        // console.log("eqpress 20", this.MUCAPE, this.MUp)
        // this.mucape_eqpress(50)
        // console.log("eqpress 50", this.MUCAPE, this.MUp)
        // this.mucape_eqpress(100)
        // console.log("eqpress 100", this.MUCAPE, this.MUp)
        // this.mucape_eqpress(1000)
        // console.log("eqpress 1000", this.MUCAPE, this.MUp)
        this.mucape_model_levels(pmin, 0, 0) // 0,0 => no mixing
        //console.log("model levels ", this.MUCAPE, this.MUp)
        //console.log("===================MUCAPE END===================")

        // assign EFFTOP in case is missing 
        if (this.EFFBAS != null && this.EFFTOP == null) {
            this.EFFTOP = pmin
            this.HEFFTOP = this.interp(pmin, 'zg')
        }
        // ESRH - Effective Storm-Relative Helicity
        if (this.HEFFTOP > (this.HEFFBAS + Number.EPSILON)) {
            this.ESRHL = this.compute_SRH(this.HEFFBAS, this.HEFFTOP, this.BUNKERSLU, this.BUNKERSLV)
            this.ESRHR = this.compute_SRH(this.HEFFBAS, this.HEFFTOP, this.BUNKERSRU, this.BUNKERSRV)
        }

        // CIZE - Effective Bulk Shear
        if (this.HEFFSHEARB) {
            let ub = this.interzg(this.HEFFSHEARB, 'u')
            let vb = this.interzg(this.HEFFSHEARB, 'v')
            let ut = this.interzg(this.HEFFSHEART, 'u')
            let vt = this.interzg(this.HEFFSHEART, 'v')
            this.CIZE = Math.hypot(ut - ub, vt - vb)
        }
        if (this.HEFFSHEARBs) {
            let ub = this.interzg(this.HEFFSHEARBs, 'u')
            let vb = this.interzg(this.HEFFSHEARBs, 'v')
            let ut = this.interzg(this.HEFFSHEARTs, 'u')
            let vt = this.interzg(this.HEFFSHEARTs, 'v')
            this.CIZEs = Math.hypot(ut - ub, vt - vb)
        }

        // SCP2 
        if (this.MUCAPE) {
            // Close Proximity Soundings within Supercell Environments Obtained from the Rapid Update Cycle
            // Thompson, Edwards, Hart, Elmore, Markowski
            // American Meteorological Society
            // Pag. 1256

            let cte = 1E-6
            let shearterm = null

            if (this.CIZE) {
                shearterm = this.CIZE ///MKNOT
                if (shearterm < 10) shearterm = 0.0
                else if (shearterm > 20) shearterm = 20.0
            }
            if (shearterm != null && this.ESRHL) {
                this.SCP2L = cte * this.MUCAPE * shearterm * (-this.ESRHL)
                if (this.SCP2L < 0) this.SCP2L = 0
            }
            if (shearterm != null && this.ESRHR) {
                this.SCP2R = cte * this.MUCAPE * shearterm * (this.ESRHR)
                if (this.SCP2R < 0) this.SCP2R = 0
            }
        }

        // MU parcel
        //console.log("MUPARCEL", this.MUp, this.MUT, this.MUr)
        if (this.MUT != null) {
            this.parcels['MU'] = this.compute_parcel(this.MUp, this.MUT, this.MUr)
            //console.log("dd","MU","pl",this.MUp,"Tl", this.MUT, "rl", this.MUr)

            // DEBUG MUCAPE OPT calculo de cape segun formula de ecmwf
            // let cape2 = this.cape_ecmwf(this.MUp, this.MUT, this.MUr, this.parcels['MU'].ELv, this.parcels['MU'].LFCv)
            // console.log("MUCAPE TDDJS:", this.parcels['MU'].CAPEv)
            // console.log("MUCAPE ECMWF:", cape2)
        }

        this.compute_windex()
    }


    /**
     * Compute basic parcels
     * @param {Array} parcels - list of mix layer thickness (hPa)
     * @return
     */
    compute_parcels(parcels = []) {

        // surface based
        //console.log("==================SB=================")
        this.parcels['SB'] = this.compute_parcel(this.bot.p, this.bot.T, this.bot.r)
        //console.log("------------------SB-----------------")
        
        // mixed layers
        if (parcels.length === 0) return
        for (let dd of parcels) {
            let pmed, rl, Tl
            if (dd == 0){
                // surface based
                pmed = this.bot.p
                rl = this.bot.r
                Tl = this.bot.T
            } else {
                // mean p,T,r in layer 
                let pbot = this.bot.p
                let ptop = pbot - dd
                pmed = pbot - dd / 2.
                let Thl = this.mean('Th', ptop, pbot, 'exact') // skewt-> inner
                rl = this.mean('r', ptop, pbot, 'exact') // skewt-> inner
                Tl = Th.tc_from_thcp(Thl, pmed)
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
     * Computes a parcel and related indexes not computed in Adiablift class
     * @param {number} p - pressure (hPa)
     * @param {number} T - temperature (ºC)
     * @param {number} r - mixing ratio (kg/kg)
     * @returns {Object} - Adiablift object
     */
    compute_parcel(p, T, r) {

        let ad = new AdiabLift(p, T, r)
        ad.comp(this)
        ad.dcape(this)

        // CCL, CCT, CT 	
        ad.CCL = this.find_top('rw', ad.r0)
        if (ad.CCL) {
            ad.CCT = this.interp(ad.CCL, 'T')
            ad.TCCL = ad.CCT // duplicated
            ad.zCCL = this.interp(ad.CCL, 'zg')
            ad.CT = (ad.CCT + Th.c0) * Math.pow(this.bot.p / ad.CCL, Th.XI) - Th.c0
        }

        // CCLv, CCTv, CTv
        ad.CCLv = this.find_top('rwv', ad.r0)
        if (ad.CCLv) {
            ad.CCTv = this.interp(ad.CCLv, 'Tv')
            ad.TCCLv = ad.CCTv // duplicated
            ad.zCCLv = this.interp(ad.CCLv, 'zg')
            ad.CTv = (ad.CCTv + Th.c0) * Math.pow(this.bot.p / ad.CCLv, Th.XI) - Th.c0
        }
        //console.log("NCC", ad.CCL,ad.CCLv)
        //console.log("zNCC", ad.zCCL,ad.zCCLv)
        //console.log("TCC", ad.CCT, ad.CCTv)
        //console.log("TDIS", ad.CT, ad.CTv)
        //console.log("TCC", ad.CCT, "TCC", ad.CCT, "TDIS", ad.CT)

        // BRN, VGP, EHI*
        if (ad.CAPE) {
            if (this.qqq > 0) ad.BRN = ad.CAPE * 2. / this.qqq
            //ad.VGPold   = Math.sqrt(ad.CAPE)*this.CIZ06/((6000.-this.bot.zg)*Th.MKNOT)
            ad.VGP = Math.sqrt(ad.CAPE) * this.MCIZ06
            ad.EHIL1 = ad.CAPE * (-this.SRHL1) / 160000
            ad.EHIR1 = ad.CAPE * (this.SRHR1) / 160000
            ad.EHIL3 = ad.CAPE * (-this.SRHL3) / 160000
            ad.EHIR3 = ad.CAPE * (this.SRHR3) / 160000
        }
        if (ad.CAPEv) {
            if (this.qqq > 0) ad.BRNv = ad.CAPEv * 2. / this.qqq
            //ad.VGPvold = Math.sqrt(ad.CAPEv)*this.CIZ06/((6000.-this.bot.zg)*Th.MKNOT)
            ad.VGPv = Math.sqrt(ad.CAPEv) * this.MCIZ06
            ad.EHIL1v = ad.CAPEv * (-this.SRHL1) / 160000
            ad.EHIR1v = ad.CAPEv * (this.SRHR1) / 160000
            ad.EHIL3v = ad.CAPEv * (-this.SRHL3) / 160000
            ad.EHIR3v = ad.CAPEv * (this.SRHR3) / 160000
        }
        if (ad.EHIL1 < 0) ad.EHIL1 = 0.0
        if (ad.EHIL1v < 0) ad.EHIL1v = 0.0
        if (ad.EHIR1 < 0) ad.EHIR1 = 0.0
        if (ad.EHIR1v < 0) ad.EHIR1v = 0.0
        if (ad.EHIL3 < 0) ad.EHIL3 = 0.0
        if (ad.EHIL3v < 0) ad.EHIL3v = 0.0
        if (ad.EHIR3 < 0) ad.EHIR3 = 0.0
        if (ad.EHIR3v < 0) ad.EHIR3v = 0.0

        // console.log("BRN", ad.BRN,ad.BRNv)
        // console.log("VGP", ad.VGP,ad.VGPv, ad.VGPvold)
        // console.log("EHIL1", ad.EHIL1,ad.EHIL1v)
        // console.log("EHIR1", ad.EHIR1,ad.EHIR1v)
        // console.log("EHIL3", ad.EHIL3,ad.EHIL3v)
        // console.log("EHIR3", ad.EHIR3,ad.EHIR3v)

        // STP - Significant Tornado Parameter
        let cte = 1. / 3E9
        if (this.SRHL1) {
            let ctl = this.CIZ06 / Th.MKNOT * (-this.SRHL1) * cte
            if (ad.CAPE) ad.STPL = ctl * ad.CAPE * (2000. - ad.zLCL)
            if (ad.CAPEv) ad.STPLv = ctl * ad.CAPEv * (2000. - ad.zLCL)
            if (ad.STPL < 0) ad.STPL = 0
            if (ad.STPLv < 0) ad.STPLv = 0
        }
        if (this.SRHR1) {
            let ctr = this.CIZ06 / Th.MKNOT * (-this.SRHR1) * cte
            if (ad.CAPE) ad.STPR = ctr * ad.CAPE * (2000. - ad.zLCL)
            if (ad.CAPEv) ad.STPRv = ctr * ad.CAPEv * (2000. - ad.zLCL)
            if (ad.STPR < 0) ad.STPR = 0
            if (ad.STPRv < 0) ad.STPRv = 0
        }

        // STP2 - Significant Tornado Parameter 2 (requires Effective Layer)
        let cte2 = 1. / 1.35E12
        var shearterm = null
        if (this.CIZEs) {
            shearterm = this.CIZEs ///MKNOT
            if (shearterm < 10.0) shearterm = 0.0
            else if (shearterm > 30.0) shearterm = 30.0
        }
        //console.log("STP2", this.CIZEs, shearterm, this.ESRHL, this.ESRHR)
        if (shearterm != null && this.ESRHL) {
            let ctl2 = (-this.ESRHL) * shearterm * cte2
            if (ad.CAPE) ad.STP2L = ctl2 * ad.CAPE * (2000. - ad.zLCL) * (250 - ad.CIN)
            if (ad.CAPEv) ad.STP2Lv = ctl2 * ad.CAPEv * (2000. - ad.zLCL) * (250 - ad.CINv)
            if (ad.STP2L < 0) ad.STP2L = 0
            if (ad.STP2Lv < 0) ad.STP2Lv = 0
        }
        if (shearterm != null && this.ESRHR) {
            let ctr2 = (this.ESRHR) * shearterm * cte2
            if (ad.CAPE) ad.STP2R = ctr2 * ad.CAPE * (2000. - ad.zLCL) * (250 - ad.CIN)
            if (ad.CAPEv) ad.STP2Rv = ctr2 * ad.CAPEv * (2000. - ad.zLCL) * (250 - ad.CINv)
            if (ad.STP2R < 0) ad.STP2R = 0
            if (ad.STP2Rv < 0) ad.STP2Rv = 0
        }

        // SCP (SCP2 in compute_advanced_index)
        if (this.MUCAPE) {
            // Close Proximity Soundings within Supercell Environments Obtained from the Rapid Update Cycle
            // Thompson, Edwards, Hart, Elmore, Markowski
            // American Meteorological Society
            // Pag. 1256

            // SCP
            cte = 1. / 4000000.
            if (this.SRHL3) {
                let ctl = this.MUCAPE * (-self.SRHL3) * cte
                if (this.BRN) ad.SCPL = cte * this.ad.CAPE / this.BRN
                if (this.BRNv) ad.SCPLv = cte * this.ad.CAPEv / this.BRNv
                if (ad.SCPL < 0) ad.SCPL = 0
                if (ad.SCPLv < 0) ad.SCPLv = 0
            }
            if (this.SRHL3) {
                let ctr = this.MUCAPE * (-self.SRHR3) * cte
                if (this.BRN) ad.SCPR = cte * this.ad.CAPE / this.BRN
                if (this.BRNv) ad.SCPRv = cte * this.ad.CAPEv / this.BRNv
                if (ad.SCPR < 0) ad.SCPR = 0
                if (ad.SCPRv < 0) ad.SCPRv = 0
            }
        }

        //ad.trace()
        return ad
    }


    /**
     * Computes all shear related indexes
     */
    compute_shear() {
        // wind at different heights
        let v0 = this.bot.v
        let u0 = this.bot.u
        let u05 = this.interzg(500., 'u')
        let v05 = this.interzg(500., 'v')
        let u1 = this.interzg(1000., 'u')
        let v1 = this.interzg(1000., 'v')
        let u2 = this.interzg(2000., 'u')
        let v2 = this.interzg(2000., 'v')
        let u3 = this.interzg(3000., 'u')
        let v3 = this.interzg(3000., 'v')
        let u4 = this.interzg(4000., 'u')
        let v4 = this.interzg(4000., 'v')
        let u5 = this.interzg(5000., 'u')
        let v5 = this.interzg(5000., 'v')
        let u55 = this.interzg(5500., 'u')
        let v55 = this.interzg(5500., 'v')
        let u6 = this.interzg(6000., 'u')
        let v6 = this.interzg(6000., 'v')
        let u7 = this.interzg(7000., 'u')
        let v7 = this.interzg(7000., 'v')
        let u8 = this.interzg(8000., 'u')
        let v8 = this.interzg(8000., 'v')
        // values for hodograph 
        this.utags = [u05, u1, u2, u3, u4, u5, u6, u7, u8]
        this.vtags = [v05, v1, v2, v3, v4, v5, v6, v7, v8]
        // mean wind density
        let wd05 = this.mean_wind2(this.bot.zg, 500., 10)
        let wd6 = this.mean_wind2(this.bot.zg, 6000., 50)
        this.CIZD056 = Math.hypot(wd6[0] - wd05[0], wd6[1] - wd05[1])
        this.qqq = (this.CIZD056) ** 2 //this.qqq=(CIZD056/MKNOT)**2
        // mean wind
        let wm6 = this.mean_wind(this.bot.zg, 6000., 50)
        this.um6 = wm6[0]
        this.vm6 = wm6[1]
        // wind shear
        this.CIZ08 = Math.hypot(u8 - u0, v8 - v0)
        this.CIZ06 = Math.hypot(u6 - u0, v6 - v0)
        this.CIZ03 = Math.hypot(u3 - u0, v3 - v0)
        this.CIZ01 = Math.hypot(u1 - u0, v1 - v0)
        // mean shear
        this.MCIZ06 = this.mean_shear(this.bot.zg, 6000)
        // bunkers
        this.um005 = 0.5 * (u0 + u05)
        this.vm005 = 0.5 * (v0 + v05)
        this.um556 = 0.5 * (u6 + u55)
        this.vm556 = 0.5 * (v6 + v55)
        let aa1 = this.um556 - this.um005
        let bb1 = this.vm556 - this.vm005
        let fff = 7.5 / Math.hypot(aa1, bb1) // la perpendicular de (a,b) a la derecha es (b,-a)  //let fff = 7.5*MKNOT/Math.hypot(aa1,bb1)
        let aa2 = bb1 * fff
        let bb2 = -aa1 * fff
        this.BUNKERSRU = this.um6 + aa2
        this.BUNKERSRV = this.vm6 + bb2
        this.BUNKERSLU = this.um6 - aa2
        this.BUNKERSLV = this.vm6 - bb2
        this.BUNKERSLWS = Math.hypot(this.BUNKERSLU, this.BUNKERSLV)
        this.BUNKERSLWD = Math.atan2(this.BUNKERSLV, this.BUNKERSLU) * Th.RAD2DEG
        this.BUNKERSRWS = Math.hypot(this.BUNKERSRU, this.BUNKERSRV)
        this.BUNKERSRWD = Math.atan2(this.BUNKERSRV, this.BUNKERSRU) * Th.RAD2DEG
        this.WSM06 = Math.hypot(this.um6, this.vm6)
        this.WDM06 = Math.atan2(this.vm6, this.um6) * Th.RAD2DEG
        this.SRHL1 = this.compute_SRH(this.bot.zg, 1000., this.BUNKERSLU, this.BUNKERSLV)
        this.SRHR1 = this.compute_SRH(this.bot.zg, 1000., this.BUNKERSRU, this.BUNKERSRV)
        this.SRHL3 = this.compute_SRH(this.bot.zg, 3000., this.BUNKERSLU, this.BUNKERSLV)
        this.SRHR3 = this.compute_SRH(this.bot.zg, 3000., this.BUNKERSRU, this.BUNKERSRV)
        this.SRHL6 = this.compute_SRH(this.bot.zg, 6000., this.BUNKERSLU, this.BUNKERSLV)
        this.SRHR6 = this.compute_SRH(this.bot.zg, 6000., this.BUNKERSRU, this.BUNKERSRV)
        this.SRHL13 = this.compute_SRH(1000., 3000., this.BUNKERSLU, this.BUNKERSLV)
        this.SRHR13 = this.compute_SRH(1000., 3000., this.BUNKERSRU, this.BUNKERSRV)
        //_trace_shear()
    }


    /**
     * WINDEX - a new index for forecasting microbust potential 
         * Donald W. McCann
     * Weather and forecasting, volume 9, 1994
     * equation num. 6
     * WI = 5*[HM*RQ(Lr^2-30+QL-2*QM)]^0.5
     * Where:
     * HM = height ot the melting level in km above the ground (km)
     * Lr = Lapse rate in degrees Celsius per kilometer from the surface to the meling this.levels (ºC/km)
     * QL = mean mixing ratio in the lowest 1km abote the surface (g/kg)
     * QM = the mixing ratio in the metling level (g/kg)
     * RQ = QL/12 but no greater than 1
     * WI is set to 0 when radicand is negative
     * debug example: Dalas TX, HM=4.85, QM=1.8, QL=13.8, RQ = Math.min(QL/12., 1), Lr=7.79, WI=70
     * @returns {null|number} - null if ISOC doesn3't exist
     */
    compute_windex() {
        if (this.ISOC == null) return

        let HM = (this.ISOC - this.zs) / 1000.
        let p1 = this.interzg(1000, 'p') // pressure at 1000m above the surface
        let QL = this.mean('r', p1, this.bot.p, 'exact') * 1000.
        let RQ = Math.min(QL / 12., 1)
        let QM = this.interz(this.ISOC, 'r') * 1000. // same as this.interzg(this.ISOC - this.zs, 'r')
        let Lr = (this.bot.T - this.interz(this.ISOC, 'T')) / HM

        let Ra = HM * RQ * (Lr ** 2 - 30. + QL - 2 * QM) // radicand
        if (Ra < 0) this.WINDEX = 0
        else this.WINDEX = 5. * Math.sqrt(Ra)

        // console.log("HM", HM)
        // console.log("QL", QL)
        // console.log("p1", p1)
        // console.log("RQ", RQ)
        // console.log("QM", QM)
        // console.log("Lr", Lr)
        // console.log("WI", this.WINDEX)
    }


    /** */
    _trace_shear() {
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
     * Storm Relative Helicity
     * @param {number} zgbot - bottom height above ground (m)
     * @param {number} zgtop - top height above ground (m)
     * @param {number} uref -
     * @param {number} vref -
     * @param {number} k - number of levels bewteen zgbot and zgbot
     * @returns {number}
     */
    compute_SRH(zgbot, zgtop, uref, vref, k = 30) {
        //SRH = Sum [(un+1 − cx)(vn − cy) − (un − cx)(vn+1 − cy)], (8.15)
        let srh = 0.
        let zginc = (zgtop - zgbot) / (k - 1)
        let u9 = null // previous ui value 
        let v9 = null // previous vi value
        for (let i = 0; i < k; i++) {
            let pi = this.find_bot('zg', zgbot + zginc * i)
            let ui = this.interp(pi, 'u')
            let vi = this.interp(pi, 'v')
            if (i > 0) { srh += (ui - uref) * (v9 - vref) - (vi - vref) * (u9 - uref) }
            u9 = ui
            v9 = vi
        }
        //return srh/(MKNOT**2)
        return srh
    }

    /**
     * ??? NO se usa. Es lo mismo que compute_SRH, no recuerdo que iba a modificar.
     */
    compute_SRH2(zgbot, zgtop, uref, vref, k = 30) {
        //SRH = Sum [(un+1 − cx)(vn − cy) − (un − cx)(vn+1 − cy)], (8.15)
        let srh = 0.
        let zginc = (zgtop - zgbot) / (k - 1)
        let u9 = null // previous ui value 
        let v9 = null // previous vi value
        for (let i = 0; i < k; i++) {
            let pi = this.find_bot('zg', zgbot + zginc * i)
            let ui = this.interp(pi, 'u')
            let vi = this.interp(pi, 'v')
            if (i > 0) { srh += (ui - uref) * (v9 - vref) - (vi - vref) * (u9 - uref) }
            u9 = ui
            v9 = vi
        }
        //return srh/(MKNOT**2)
        return srh
    }


    /**
     * Mean shear. Length of the hodograph divided by the depth.
     * Typically calculated between first height level and 6000 m AGL.  
     * @param {number} zgtop - top height above ground (m)
     * @param {number} zgbot - bottom height above ground (m)
     * @returns {number} mean shear
     */
    mean_shear(zgbot, zgtop) {
        //let pbot = this.bot.p 
        let pbot = this.find_bot('zg', zgbot)
        if (pbot > this.bot.p) pbot = this.bot.p
        let ptop = this.find_bot('zg', zgtop)
        let hlon = 0
        for (let l of this.layers(ptop, pbot, 'exact', true)) {
            hlon += Math.hypot(l[0].u - l[1].u, l[0].v - l[1].v)
        }
        return hlon / (zgtop - zgbot)
    }


    /**
     * Mean wind for Bunkers calculations
     * Typically calculated between first height level and 6000 m.  
     * @param {number} zgtop - top height above ground (m)
     * @param {number} zgbot - bottom height above ground (m)
     * @param {number} k - number of levels between zgbot and zgtop 
     * @returns {number} mean wind in the layer 
     */
    mean_wind(zgbot, zgtop, k = 50) {
        let zginc = (zgtop - zgbot) / (k - 1)
        let um = 0
        let vm = 0
        for (let i = 0; i < k; i++) {
            let zi = zgbot + zginc * i
            um += this.interzg(zi, 'u')
            vm += this.interzg(zi, 'v')
        }
        um /= k
        vm /= k
        return [um, vm]
    }


    /**
     * Mean wind density weighted
     * sounding.py L.570-610
     * @param {number} zgtop - top height above ground (m)
     * @param {number} zgbot - bottom height above ground (m)
     * @param {number} k - number of levels between zgbot and zgtop 
     * @returns {number} mean wind in the layer
     */
    mean_wind2(zgbot, zgtop, k = 50) {
        let zginc = (zgtop - zgbot) / (k - 1)
        let sr = 0
        let ru = 0
        let rv = 0
        for (let i = 0; i < k; i++) {
            //console.log(i, zgbot + inczg*i)
            let pi = this.find_bot('zg', zgbot + zginc * i)
            let ui = this.interp(pi, 'u')
            let vi = this.interp(pi, 'v')
            let tvi = this.interp(pi, 'Tv') + Th.c0
            let rhoi = pi / (Th.RD * tvi)
            sr += rhoi
            ru += ui * rhoi
            rv += vi * rhoi
        }
        return [ru / sr, rv / sr]
    }


    /**
     * Precipitable Water [mm]
     * @param {number} pt - Top pressure (hPa)
     * @param {number} pb - Bottom pressure (hPa)
     * @returns {number} Precipitable Water (mm)
     */
    pw(pt, pb) {
        let pw_sum = 0
        if (pt > pb) { return null } // e.g. pw(ps,850) in mountains. 
        for (let l of this.layers(pt, pb, 'exact', true)) {
            //let q_med = (l[0].q + l[1].q) / 2 ??? q or r
            let r_med = (l[0].r + l[1].r) / 2
            let p_inc = (l[0].p - l[1].p) * 1000 // hPa to Pa
            pw_sum += -(r_med * p_inc) // (kg/m²)
        }
        let t_sfc = this.bot.T
        let rho = Th.water_density(t_sfc) * 1000 // (kg/m³)
        return (100 * pw_sum) / (rho * Th.G) // factor 100 (m)->(mm)
    }


    /**	 */
    trace_index() {
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
    mucape_eqpress(pmin = 350, n = 50) {

        let MC = null // variable used to return the net result of this method

        //console.log("==== MUCAPE ====")
        let ps = this.bot.p // bottom level pressure
        let pt = pmin // top level pressure
        let tt = n // number of parcels
        let qq = (pt - ps) / (tt - 1) // pressure interval
        for (let cc = 0; cc < tt; cc++) {
            //console.log("cc", cc)
            let pres = ps + cc * qq
            let Tm = this.interp(pres, "T")
            let rm = this.interp(pres, "r")
            let ad = new AdiabLift(pres, Tm, rm)
            ad.comp(this)

            //let ef = false
            if (ad.CAPEv) {

                // local variable 
                if (ad.CAPEv > MC) { MC = ad.CAPEv }

                // MUCAPE
                if (ad.CAPEv>this.MUCAPE) {
                    console.log("NEW MUCAPE", this.MUCAPE, ad.CAPEv, pres)
                    this.MUCAPE = ad.CAPEv
                    this.MUCIN = ad.CINv
                    this.MUp = pres
                    this.MUT = Tm
                    this.MUr = rm

                    if ((ps - pres) <= 300) {
                        this.HEFFSHEARB = this.interp(pres, 'zg')
                        this.HEFFSHEART = this.interp((pres + ad.EL) * 0.5, 'zg')
                    }
                    if (cc == 0) {
                        this.HEFFSHEARBs = this.interp(pres, 'zg')
                        this.HEFFSHEARTs = this.interp((pres + ad.EL) * 0.5, 'zg')
                    }
                }
                if (ad.CINv < 250. && ad.CAPEv > 100.) {
                    if (this.EFFBAS == null) {
                        this.EFFBAS = pres
                        this.HEFFBAS = this.interp(pres, 'zg')
                    }
                } else {
                    if (this.EFFBAS != null && this.EFFTOP == null) {
                        this.EFFTOP = pres
                        this.HEFFTOP = this.interp(pres, 'zg')
                    }
                }
            }

        } // for
        return MC
    }
}



/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../src/utils/io.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/*! io.js - v1.0.0 - 2021-03-26
* Copyright (c) 2020 mgomezm@aemet.es; 
* Based on skewt library by Álvaro Subías: https://gitlab.aemet.es/asubiasd/skewt.
* input/output library
* --------------------
* */


/**
 * Use sounding API REST (sREST) to query model data. 
 * @param {string} model
 * @param {string} index
 * @param {string} date
 * @param {string} run
 * @param {string} step
 * @param {function} callback
 * @returns
 */
function query_model(model, index, date, run, step, callback) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: `http://brisa.aemet.es/webtools/sREST/modelo/${model}/indice/${index}/fecha/${date}/pasada/${run}/alcance/${step}`,
        success: function(sond) {
            callback(sond)
        },
        error: function(xhr) { console.log("error: " + xhr) }
    });
}


/**
 * 
 * @param file
 * @param callback
 * @returns
 */
function query_json(file, callback) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: file,
        success: function(sond) {
            callback(sond)
        },
        error: function(xhr) { console.log("error: " + xhr) }
    });
}


/**
 * 
 * @param callback
 * @returns
 */
function query_table(callback) {
    //console.log("START")
    $.ajax({
        type: 'GET',
        dataType: 'text',
        url: '../data/table.txt',
        success: function(data) {
            let sond = parse_table(data)
            callback(sond)
            //return sond
        },
        error: function(xhr) { console.log("error: " + xhr) }
    });
}


/**
 * Parse Álvaro's skewt table and returns tdd data object.
 * @param text
 * @returns {Object}
 */
function parse_table(text) {
    var lines = text.split('\n');

    let meta = {}
    meta.ps = parseFloat(lines[0].split('=')[1])
    meta.zs = parseFloat(lines[1].split('=')[1])
    meta.lat = parseFloat(lines[2].split('lat ')[1])
    meta.lon = parseFloat(lines[3].split('lon ')[1])
    console.log("meta", meta)

    var data = []
    for (var i = 4; i < lines.length - 1; i++) {
        d = {}
        //console.log(i, lines[i])
        l = lines[i]
        e = l.split(/\s+/) // elements
        for (var j = 0; j < e.length; j += 2) {
            k = (j == 0) ? 'n' : e[j]
            v = parseFloat(e[j + 1])
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
    return { 'data': data, 'meta': meta }
}


/**
 * Round number
 * @param {number} value 
 * @param {number} prec 
 * @param {number} mult 
 * @returns 
 */
function rnd(value, prec, mult = 1.0) {
    //var tmp = Math.round( obj[prop] * mult * Math.pow(10, prec) ) 
    //return tmp / Math.pow(10, prec)
    return (value * mult).toFixed(prec)
}


/**
 * 
 * @param {*} obj 
 * @param {*} prop 
 * @param {*} prec 
 * @param {*} mult 
 * @returns 
 */
function round(obj, prop, prec, mult = 1.0) {
    if (obj == null) return ""
    if (obj[prop] == null) return ""

    //var tmp = Math.round( obj[prop] * mult * Math.pow(10, prec) ) 
    //return tmp / Math.pow(10, prec)
    return (obj[prop] * mult).toFixed(prec)
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
* Based on skewt library by Álvaro Subías: https://gitlab.aemet.es/asubiasd/skewt.
* tdd
* */

//https://observablehq.com/@d3/d3v6-migration-guide




// reference to load /doc/*html
var scripts = document.getElementsByTagName("script")
var tddscript = scripts[scripts.length - 1].src


class TDDConfig {
    default_height = 580 // default height
    height = 580
    width = 940

    //==== wind diagram ====
    barbsize = 25
    barbnumb = 30    // maximum number of vertical barbs shown
    ptop = 100   // default top pressure [hPa]   
    pbot = 1050  // default bottom pressure [hPa]


    //==== diagram ====//
    // geometry
    zoom_max = 300

    // X axis definitions
    tmin = -35
    tmax = 45
    tinc = 5
    tticks = s3.range(this.tmin - 100, this.tmax + 1, this.tinc)
    insposx = 50 // instability line position

    // Y axis definitions
    ptop = 100
    pbot = 1050
    newpbot = this.pbot // bottom pressure when zooming
    plines = [1000, 850, 700, 500, 300, 200, 100];
    pticks = [950, 900, 800, 750, 650, 600, 550, 450, 400, 350, 250, 150];
    pticks = [1050, 1000, 950, 900, 850, 800, 750, 700, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 220, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100]

    // diagram properties
    alpha = 45
    deg2rad = (Math.PI / 180);
    tan = 1. //Math.tan(this.alpha*this.deg2rad);

    // font
    ft_fontsize = 11
    bg_fontsize = 7
    ft_r = 3  // radius of tooltip points
    ft_y = 9  // height separation for text lines of ft_fontsize
    ft_x = 2  // x separation for height tooltip
    ft_w = 50 // height tooltip line width

    // background
    bg_mixing = [0.2, 0.4, 0.6, 1, 1.5, 2, 3, 4, 5, 7, 9, 12, 16, 20, 28, 36, 48, 66] // mixing ratio (g/kg)  
    bg_mixing_ptop = 250
    bg_tlines = s3.range(-120, this.tmax + 1, this.tinc)
    bg_dryad = s3.range(this.tmin, 100, 5).concat(s3.range(100, 220, 10)) // potential temperatures
    bg_psead = [-20, -16, -12, -8, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 36]
    //bg_dryad  = [30]

    // levels
    zoomlastevent = null
    arrowlenght = -50
    labeldx = -25 // label position for normal. 0 for virtual

    set_options(options) { }
}


/** 
 * Main Thermodynamic Diagram Class
 * --------------------------------
 * Manage objects, geometry and general live cycle. 
 * */
class TDD {

    // default dimensions
    default_height = 580 // default height
    height = 580
    width = 940
    aratio = this.width / this.height
    scale = 1
    dims = {
        diag: {
            create: true,
            aratio: 1,
            margin: { top: 10, right: 5, bottom: 20, left: 30 }
        },
        hodo: {
            create: true,
            aratio: 1,
            margin: { top: 10, right: 5, bottom: 20, left: null }
        },
        wind: {
            create: true,
            aratio: 0.10,
            margin: { top: 10, right: 5, bottom: 20, left: 5 }
        },
        lgnd: {
            create: true,
            aratio: 0.50,
            margin: { top: 10, right: 10, bottom: 20, left: 5 }
        },
        info: {
            create: true,
            aratio: null,
            margin: { top: 10, right: 10, bottom: 20, left: 30 }
        }
    }

    // default visualization. x and y are the offset for the labels in the diagram class, so they don't overlap.
    lines = {
        'T': { id: 'T', name: 'T', visible: true, tooltip: true, x: 9, y: 0 },
        'Td': { id: 'Td', name: 'Td', visible: true, tooltip: false, x: -35, y: 0 },
        'Tw': { id: 'Tw', name: 'Tw', visible: true, tooltip: false, x: 0, y: 9 },
        'Tv': { id: 'Tv', name: 'Tv', visible: true, tooltip: false, x: 9, y: 9 },
        'Te': { id: 'Te', name: 'Te', visible: false, tooltip: false, x: 9, y: 0 },
        'Tf': { id: 'Tf', name: 'Tf', visible: false, tooltip: false, x: 9, y: -9 },
    }

    // default area visualization
    areas = [
        { id: 'ftlevels', visible: false },
        { id: 'invtarea', visible: false },
        { id: 'dcapearea', visible: false },
        { id: 'hodoareas', visible: true },
    ]

    // levels to draw with arrows in the diagram
    levels = {
        'LCL': 'NCA',
        'LFC': 'NCL',
        'EL': 'NE',
        'CCL': 'NCC'
    }

    // defines the parcels leyend buttons
    parcels = [
        { value: 'SB', text: 'SB', title: 'Burbuja con base en superficie' },
        { value: 30, text: '30', title: 'Burbuja de mezcla de los 30 hPa más cercanos a la superficie' },
        { value: 50, text: '50', title: 'Burbuja de mezcla de los 50 hPa más cercanos a la superficie' },
        { value: 100, text: '100', title: 'Burbuja de mezcla de los 100 hPa más cercanos a la superficie' },
        { value: 'MU', text: 'MU', title: 'Burbuja más inestable' },
        { value: 'X', text: 'X', title: 'Burbuja creada por el usuario' }
    ]
    low_level_parcels = [] // list of mixing layers. Created from the "parcels" with numeric "value"
    parcel = 50           // default parcel
    lift = 'Tv'         // default lift visualization: T,Tv,TTv
    cota = 'COTANIE1'   // default COTANIE1

    // sounding	object
    s = null

    // loader
    loader = null


    /**
     * Create a Thermodynamic Diagram Object
     * @param {string} id - HTML id attribut
     * @param {Object} options -
     * @returns
     */
    constructor(id, options = {}) {

        // some config
        this._config()

        // HTML id attribute
        this.id = "#" + id
        this.elem = document.getElementById(id)

        // overwrite options
        //console.log("options", options)
        for (const [k, v] of Object.entries(options)) {
            //console.log("->",k,v)
            if (eval('this.' + k) === undefined) {
                console.warn("option not recognized:", k)
                continue
            }
            // else {
            // 	console.log(eval('this.'+k))
            // }
            //this.config = {...this.def, ...JSON.parse(JSON.stringify(config))}

            if (typeof (v) == 'string') {
                eval('this.' + k + ' = "' + options[k] + '"')
            } else {
                eval('this.' + k + ' = ' + options[k])
            }
        }

        // block default dimensions
        this._block_dims(this.dims.diag)
        this._block_dims(this.dims.wind)
        this._block_dims(this.dims.lgnd)

        // tdd default dimensions
        this.width = this.dims.diag.fullwidth + this.dims.wind.fullwidth + this.dims.lgnd.fullwidth
        this.aratio = this.width / this.height

        // geometry adjustment
        if ("height" in options && "width" in options) {
            let twidth = this.aratio * options.height
            if (twidth > options.width) {
                this.width = options.width
                this.height = this.width / this.aratio
                this.scale = this.height / this.default_height
            } else {
                this.height = options.height
                this.scale = this.height / this.default_height
                this.width = this.aratio * this.height
            }
        } else if ("height" in options) {
            this.height = options.height
            this.scale = this.height / this.default_height
            this.width = this.aratio * this.height
        } else if ("width" in options) {
            this.width = options.width
            this.height = this.width / this.aratio
            this.scale = this.height / this.default_height
        }

        // block adjusted dimensions
        this._block_dims(this.dims.diag)
        this._block_dims(this.dims.wind)
        this._block_dims(this.dims.lgnd)

        this._build()
        //this._trace()
    }


    /** 
     * Do some configuration
     */
    _config() {
        // parcels
        for (let p of this.parcels) {
            if (typeof (p.value) == 'number') { this.low_level_parcels.push(p.value) }
        }
    }


    /**
     * Defines the dimensions of the block that use full height.
     * @param {Object} block - block object like diagram, legend or wind diagram 
     */
    _block_dims(block) {
        block.fullheight = this.height
        block.height = this.height - block.margin.top - block.margin.bottom
        block.width = block.height * block.aratio
        block.fullwidth = block.width + block.margin.left + block.margin.right
    }


    /** */
    _trace() {
        console.log("TDD -", "width:", this.width, "height:", this.height, "aratio:", this.aratio, "scale:", this.scale)
    }


    /**
     * Create svg object and different parts objects
     */
    _build() {
        // main svg
        this.svg = s3.select(this.id).append("svg")
            .attr("width", this.width)
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
        this.diag = new Skewt(this, x_diag, this.dims.diag, this.scale)
        this.wind = new WindDiagram(this, x_wind, this.dims.wind, this.scale)
        this.lgnd = new Legend(this, x_lgnd, this.dims.lgnd, this.scale)
        this.hodo = new Hodograph(this, x_hodo, this.dims.hodo, this.scale)
        this.info = new InfoWindow(this, x_info, this.dims.info, this.scale)

        // loader object
        this.loader = new Loaderd3({ width: 50, height: 50, x: 70, y: 50, container: ".svgtdd", id: "loadertdd" })

        // i/o
        this._io()

        // controls and visibility
        this._set_controls()
    }


    /** 
     * Creates download and upload arrows and position them in the lower left corner.
     */
    _io() {

        this.download = this.svg.append('g').attr("id", "download")
        this.upload = this.svg.append('g').attr("id", "upload")

        this.download.append("text")
            .text("⇓")
            .attr("x", this.width - this.lgnd.margin.left - 25)
            .attr("y", this.height - 6)
            .style("font-size", 16 + "px")
            .style("cursor", "pointer")
            .attr("fill", "#585858")
            .on("click", this._download_json.bind(this))
            .append("title")
            .text("Descarga los datos del sondeo")

        this.upload.append("text")
            .text("⇑")
            .attr("x", this.width - this.lgnd.margin.left - 10)
            .attr("y", this.height - 6)
            .style("font-size", 16 + "px")
            .style("cursor", "pointer")
            .attr("fill", "#585858")
            .on("click", this._upload_json.bind(this))
            .append("title")
            .text("Carga un sondeo a partir de un fichero local")

        // reading stuff on html
        this.input = document.createElement('input')
        this.input.type = "file"
        document.body.appendChild(this.input)
        this.input.addEventListener('change', this._onChange.bind(this))
    }


    /** */
    _onChange(event) {
        var reader = new FileReader()
        reader.onload = this._onReaderLoad.bind(this)
        reader.readAsText(event.target.files[0])
    }


    /** */
    _onReaderLoad(event) {
        var obj = JSON.parse(event.target.result)
        this.comp(obj)
    }


    /**
     * Set controls and visibility from the starting configuration
     */
    _set_controls() {
        this.lgnd.set_controls()
    }


    /**
     * 
     * @param {*} model 
     * @param {*} index 
     * @param {*} date 
     * @param {*} run 
     * @param {*} step 
     */
    load(model, index, date, run, step) {
        this.loadtime = null
        this.calctime = null
        this.loadstart = performance.now()
        this.loader.start() // show loader
        query_model(model, index, date, run, step, this.comp.bind(this))
    }


    /**
     * 
     * @param {*} file 
     */
    load_json(file) {
        this.loadtime = null
        this.calctime = null
        this.rendtime = null
        this.loadstart = performance.now()
        this.loader.start() // show loader
        query_json(file, this.comp.bind(this))
    }

    load_temp(file){
        this.loadtime = null
        this.calctime = null
        this.rendtime = null
        this.loadstart = performance.now()
        this.loader.start() // show loader
        //this.calc_sounding(file)
	this.comp(file)
    }


    /**
     * 
     */
    load_test() {
        query_table(this.comp.bind(this))
    }


    

    /**
     * Compute a sounding object and plot it
     * @param {Object} sond - Sounding data object
     */
    comp(sond) {
        this.loader.stop() // hide loader
        this.loadtime = performance.now() - this.loadstart

        if ("ERROR" in sond) {
            //console.log(sond)
            this.s = null
            this.error(sond['ERROR'])
            return
        }

        if (sond.data.length == 0) {
            //console.log(sond)
            this.s = null
            this.error("Error: No hay datos para esta petición")
            return
        }

        // sounding
        let t0 = performance.now()
        console.log("DATA",sond.data)
        console.log("META",sond.meta)
        this.s = new Sounding(sond.data, sond.meta, this.low_level_parcels)
        this.s.start()
        this.s.COTA = this.s.COTANIE[this.cota]
        this.calctime = performance.now() - t0
        this.plot()
    }


    /**
     * First plot
     */
    plot() {
        let t0 = performance.now()
        this.clear()
        this.diag.plot()   // plot sounding, ground, insth
        this.plot_parcel() // plot parcel, calls legend plot
        this.hodo.plot()
        this.wind.plot()
        this.rendtime = performance.now() - t0
        this._log()
    }


    /** */
    _log() {
        let total = this.loadtime + this.calctime + this.rendtime
        let t = "datos:" + rnd(this.loadtime, 0) + ", cálculo:" + rnd(this.calctime, 0) + ", render:" + rnd(this.rendtime, 0) + ", total:" + rnd(total, 0) + " ms"
        this.log.html(null)
        this.log.append("text")
            .attr("id", "logtext")
            .attr("x", this.width - this.lgnd.width)
            .attr("y", this.height - 8)
            .text(t)
            // .attr("dy", ".3em")
            // .attr("dx", "-.2em")
            .attr("fill", "#585858")
            .style("font-size", 10 + "px")
    }


    /** */
    _upload_json() {
        this.input.click()
    }


    /** */
    _download_json() {

        if (this.s == null) {
            alert("No hay datos para descargar")
            return
        }

        let res = this.s.get_data()
        let file_name = res.meta.date + res.meta.run.toString().padStart(2, 0) + '_' + res.meta.step.toString().padStart(3, 0) + '_' + res.meta.model + '_' + res.meta.index + '.json'
        let content = JSON.stringify(res);
        let file = new Blob([content], { type: "application/json" });
        let url = URL.createObjectURL(file)
        let tmp_node = document.createElement('a');
        tmp_node.setAttribute("href", url);
        tmp_node.setAttribute("download", file_name);
        document.body.appendChild(tmp_node); // required for firefox
        tmp_node.click();
        tmp_node.remove();
    }


    /** Clear all the elements adn display error in legend */
    error(error) {
        this.clear()
        this.lgnd.error(error)
    }


    /** Clear all the elements */
    clear() {
        this.diag.clear()
        this.wind.clear()
        this.lgnd.clear()
        this.hodo.clear()
    }


    /** */
    destroy() {
        this.s = null
        this.svg.html(null)
        s3.select("svg").remove();
    }


    /** */
    get_parcel() {
        return this.s.parcels[this.parcel] || null
    }


    /**
     * New user parcel
     * Calls sounding parcel and stores it in with 'X' key
     * @param {number} p - pressure [hPa]
     * @param {number} T - temperature [ºC]
     * @param {number} r - mixing ration [kg/kg]
     * @param {number} Td - dew point [ºC]
     * @param {number} RH - relative humidity [%]
     */
    new_parcel(p, T, r = null, Td = null, RH = null) {
        if (r) { }
        else if (Td) { r = Th.rwc(Td, p) }
        else if (RH) { r = RH * Th.rwc(T, p) / 100. }

        let ad = this.s.compute_parcel(p, T, r)
        this.s.parcels['X'] = ad
        this.lgnd.parcel_change('X', true, false) // sets tdd.parcel
        this.plot_parcel()
    }


    /** */
    plot_parcel() {
        //console.log("plot_parcel", this.parcel, this.lift)
        this.diag.plot_parcel(this.parcel, this.lift)
        this.lgnd.plot() // update table legend
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
    constructor(tdd, start, dims, scale) {
        this.tdd = tdd
        this.start = start
        this.aratio = dims.aratio
        this.margin = dims.margin
        this.scale = scale
    }


    /** */
    _trace() {
        console.log(this.constructor.name, "- width:", this.width, "height:", this.height, "full width:", this.fullwidth, "full height:", this.fullheight)
    }


    /** Set up the object dimensions */
    _dims() { }


    /** */
    _build() { }


    /** */
    plot() { }


    /** */
    clear() { }
}


/**
 * InfoWindow class
 */
class InfoWindow extends AbstractDiagram {

    fontsize = 14

    /**
     * Constructor
     * @param {*} tdd 
     * @param {*} start 
     * @param {*} aratio 
     * @param {*} margin 
     * @param {*} scale 
     */
    constructor(tdd, start, aratio, margin = null, scale = 1) {
        super(tdd, start, aratio, margin, scale)
        this._dims()
        this._build()
        //this._trace()
    }


    /** */
    _dims() {
        this.fontsize = this.fontsize * this.scale
        this.height = this.tdd.height - this.margin.top - this.margin.bottom
        this.width = this.tdd.width - this.margin.left - this.margin.right
        this.fullheight = this.tdd.height
        this.fullwidth = this.width + this.margin.left + this.margin.right
    }


    /** */
    _build() {
        this.main = this.tdd.svg.append("g")
            .attr("id", "infowindow")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }


    /**
     * 
     * @param {*} param 
     */
    load(param) {
        param = param.trim()
        //console.log(tddscript)
        let url = "doc/" + param + ".html"
        let img = "doc/img/" + param + ".bmp"
        // dev
        if (tddscript.includes('diagram.js')) {
            console.log("dev: loading from ../src/doc/" + param + ".html")
            url = "../src/doc/" + param + ".html"
            // merged lib as used in panel
        } else if (tddscript.includes('tdd.js')) {
            url = tddscript.replace('tdd.js', '') + "doc/" + param + ".html"
            img = tddscript.replace('tdd.js', '') + "doc/img/" + param + ".bmp"
        }

        fetch(url).then((response) => {
            if (response.ok) return response.text()
            else throw new Error('Something went wrong')
        })
            .catch(error => { console.log('Error:', error); return Promise.reject() })
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
                    .style("font-size", this.fontsize + "px")
                    .html(response);

                MathJax.typeset()

                s3.select(".closetdd").on("click", (function() { this.clear() }).bind(this))

                // change path to img
                if (s3.select(".infowindowimg").empty() == false) {
                    s3.select(".infowindowimg").attr('src', img)
                }
            });
    }

    clear() {
        this.main.html(null)
    }
}


/** 
 * Hodograph diagram class 
 * Locates the hodograph in the top right corner of the thermodynamic diagram.
 * Offers zoom options with "+" and "-" buttons. (full size, 1/3 size, none)
 * */
class Hodograph extends AbstractDiagram {

    aratio = 1     // aspect ratio
    dratio = 1 / 3   // default size compared with the thermodynamic diagram
    fontdef = 7     // default fontsize
    fontsize = 7     // adjusted fontsize depending on dratio
    bsize = 15    // button size 
    circles = 10    // draw circles and labels (only in 3rd quadrant) every "circles" (kt)
    maxw = 60    // max value (kt)
    maxh = 8000  // max height above ground (m)
    htags = [.5, 1, 2, 3, 4, 5, 6, 7, 8] // height above ground tags (km)
    // segment colors (some are repeated in order to match htags length, and use utag and vtag information from sounding)
    hlimits = [0, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000] // 10000,    12000    ]
    hcolors = ['#FF0000', '#008000', '#0000FF', '#0000FF', '#CC8000', '#CC8000', '#FF00FF', '#D0C080', '#D0C080', '#808000'] //,'#555555','#AAAAAA']	

    /**
     * 
     * @param {*} tdd 
     * @param {*} start 
     * @param {*} aratio 
     * @param {*} margin 
     * @param {*} scale 
     */
    constructor(tdd, start, aratio, margin = null, scale = 1) {
        super(tdd, start, aratio, margin, scale)
        this._dims()
        this._build()
        //this._trace()
    };


    /** */
    _dims() {
        this.fontsize = (4.5 * this.dratio + 5.5) * this.scale // adjust fontsize: 7->1/3, 10->1 dratio
        this.height = (this.tdd.height - this.margin.top - this.margin.bottom) * this.dratio
        this.width = this.aratio * this.height
        this.fullheight = this.height
        this.fullwidth = this.width
        // min size for buttons
        if (this.height == 0) this.height = this.fullheight = this.bsize
        if (this.width == 0) this.width = this.fullwidth = this.bsize
    }


    /** Delete every svg element */
    _destroy() { this.main.html(null) }


    /** Create the main elements structure */
    _build() {

        // main element
        if (!(this.main)) {
            this.main = this.tdd.svg.append("g").attr("id", "hodo")
        }
        this.main.attr("transform", "translate(" + (this.start - this.width - this.margin.right) + "," + this.margin.top + ")");

        // background		
        this.main.append('rect')
            .attr('x', 0).attr('y', 0)
            .attr('width', this.width)
            .attr('height', this.height)
            .attr("class", "mediumline")
            .style('fill', 'white')

        // clip
        this.aux = this.main.append('g').attr("id", "auxhodo")
        this.clip = this.aux.append("clipPath")
            .attr("id", "cliphodo")
            .append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("x", 0)
            .attr("y", 0);

        // axes
        this._axes()

        // front group
        this.ft = this.main.append("g").attr("id", "hodoft").attr("clip-path", "url(#cliphodo)")
        this.hodocircle = this.ft.append('g').attr('id', 'hodocircles')
        this.hodoline = this.ft.append("g").attr("id", "hodoline")
        this.bunkers = this.ft.append("g").attr("id", "bunkers")
        this.areas = this.ft.append("g").attr("id", "hodoareas")
        this.lareas = this.areas.append("g").attr("id", "lhodoareas")
        this.rareas = this.areas.append("g").attr("id", "rhodoareas")
        this.buttons = this.ft.append("g").attr("id", "hodobuttons")

        // buttons
        this._buttons()
    }


    /*
     * Creates scales and axes
     */
    _axes() {
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
            .attr("transform", "translate(0," + this.height / 2 + ")")
            .call(this.ax)

        // v
        this.y = s3.scaleLinear()
            .range([0, this.height])
            .domain([this.maxw, -this.maxw])

        this.ay = s3.axisLeft(this.y)
            .tickSize(0)
            .ticks(0)

        this.ayy = this.axes.append('g')
            .attr("transform", "translate(" + this.width / 2 + ",0)")
            .call(this.ay);
    }


    /** */
    clear() {
        this.hodocircle.html(null)
        this.hodoline.html(null)
        this.bunkers.html(null)
        this.lareas.html(null)
        this.rareas.html(null)
    }


    /** */
    _buttons() {

        // dec
        //this.dec = this.ft.append("g").attr("id", "hododec")
        this.buttons.append("text")
            .attr("id", "hododectext")
            .attr("x", this.width - this.bsize / 2)
            .attr("y", this.bsize / 2)
            .text('-')
            .attr("dy", ".3em")
            .attr("dx", "-.2em")
            .attr("fill", "grey")
            .style("font-size", this.fontdef * 2)

        this.buttons.append("rect")
            .attr("id", "hododec")
            .attr("width", this.bsize)
            .attr("height", this.bsize)
            .attr("x", this.width - this.bsize)
            .attr("y", 0)
            .attr("class", "hodocircle")
            .style("pointer-events", "all")

        // inc
        this.buttons.append("text")
            .attr("x", this.bsize / 2)
            .attr("y", this.height - this.bsize / 2)
            .text('+')
            .attr("dy", ".3em")
            .attr("dx", "-.3em")
            .attr("fill", "grey")
            .style("font-size", this.fontdef * 2)

        this.buttons.append("rect")
            .attr("id", "hodoinc")
            .attr("width", this.bsize)
            .attr("height", this.bsize)
            .attr("x", 0)
            .attr("y", this.height - this.bsize)
            .attr("class", "hodocircle")
            .style("pointer-events", "all")

        // events
        s3.select('#hodoinc').on("click", (function(d) { this._inc() }).bind(this))
        s3.select('#hododec').on("click", (function(d) { this._dec() }).bind(this))
    }


    /** */
    _inc() {
        if (this.dratio == 0) this.dratio = 1 / 3
        else if (this.dratio == 1 / 3) this.dratio = 1
        else return
        this._dims()
        this._destroy()
        this._build()
        this.plot()
    }


    /** */
    _dec() {
        if (this.dratio == 1) {
            this.dratio = 1 / 3
            this._dims()
            this._destroy()
            this._build()
            this.plot()
        }
        else if (this.dratio == 1 / 3) {
            this.dratio = 0
            this._dims()
            this._destroy()
            this._build()
            //this._buttons()
            this.axes.remove()
            s3.select('#hododec').remove()
            s3.select('#hododectext').remove()
        }
        else return
    }


    /** */
    plot() {

        this.clear()

        let s = this.tdd.s

        // adjust axis 
        this.fit_to_data(true)

        for (let i = 10; i <= this.currmaxw; i += 10) {
            this.hodocircle.append('circle')
                .style("stroke", "gray")
                .style("fill", "none")
                .attr("class", "hodocircle")
                .attr('r', d => this.x(i) - this.x(0))
                .attr('cx', d => this.x(0))
                .attr('cy', d => this.y(0)) //this.height/2)

            this.hodocircle.append("text")
                .attr("x", this.x(-i * 0.7071))
                .attr("y", this.y(-i * 0.7071))
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
            .attr('r', d => this.x(d) - this.x(0))
            .attr('cx', d => this.x(0))
            .attr('cy', d => this.y(0)) //this.height/2)

        // wind: diferent colors
        for (let i = 1; i < this.hlimits.length; i++) {
            let toplimit = this.hlimits[i]
            let botlimit = this.hlimits[i - 1]
            let color = this.hcolors[i - 1]

            // add levels at exact height
            let tract = [s.data.filter(d => (d.zg >= botlimit) && (d.zg <= toplimit))]
            tract[0].unshift({ u: s.utags[i - 1], v: s.vtags[i - 1], zg: toplimit })
            if (i > 1) tract[0].push({ u: s.utags[i - 2], v: s.vtags[i - 2], zg: botlimit })

            this.hodoline.append("path")
                .data(tract)
                .attr("d", s3.line()
                    .x(d => this.x(d.u * Th.MKNOT))
                    .y(d => this.y(d.v * Th.MKNOT))
                )
                .attr("class", "windline")
                .style("stroke", color)
        }

        // height tags
        for (let i in this.htags) {
            let u = s.utags[i] * Th.MKNOT
            let v = s.vtags[i] * Th.MKNOT
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
            .attr("cx", this.x(s.BUNKERSLU * Th.MKNOT))
            .attr("cy", this.y(s.BUNKERSLV * Th.MKNOT))
            .attr("fill", "red")
            .attr("r", 2);
        // LM tag
        this.bunkers.append("text")
            .attr("x", this.x(s.BUNKERSLU * Th.MKNOT))
            .attr("y", this.y(s.BUNKERSLV * Th.MKNOT))
            .text("LM")
            .attr("dy", "-.30em")
            .attr("fill", "red")
            .style("font-size", this.fontsize + "px")
        // RM point
        this.bunkers.append("circle")
            .attr("cx", this.x(s.BUNKERSRU * Th.MKNOT))
            .attr("cy", this.y(s.BUNKERSRV * Th.MKNOT))
            .attr("fill", "green")
            .attr("r", 2);
        // RM tag	
        this.bunkers.append("text")
            .attr("x", this.x(s.BUNKERSRU * Th.MKNOT))
            .attr("y", this.y(s.BUNKERSRV * Th.MKNOT))
            .text("LR")
            .attr("dy", "-.30em")
            .attr("fill", "green")
            .style("font-size", this.fontsize + "px")
        // Mid point LM-RM
        this.bunkers.append("circle")
            .attr("cx", this.x((s.BUNKERSRU * Th.MKNOT + s.BUNKERSLU * Th.MKNOT) * 0.5))
            .attr("cy", this.y((s.BUNKERSRV * Th.MKNOT + s.BUNKERSLV * Th.MKNOT) * 0.5))
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", "1")
            .attr("r", 2);
        // line
        this.bunkers.append("line")
            .attr("x1", this.x(s.BUNKERSRU * Th.MKNOT))
            .attr("x2", this.x(s.BUNKERSLU * Th.MKNOT))
            .attr("y1", this.y(s.BUNKERSRV * Th.MKNOT))
            .attr("y2", this.y(s.BUNKERSLV * Th.MKNOT))
            .attr("class", "bunkersline");
        // shear 05-56
        this.bunkers.append("line")
            .attr("x1", this.x(s.um005 * Th.MKNOT))
            .attr("x2", this.x(s.um556 * Th.MKNOT))
            .attr("y1", this.y(s.vm005 * Th.MKNOT))
            .attr("y2", this.y(s.vm556 * Th.MKNOT))
            .attr("class", "bunkersline");
        // SRH areas
        if (s.MUCAPE !== null) {
            if (100 < s.MUCAPE) {
                if (s.CIZ06 * Th.MKNOT > 24) {
                    if (s.SRHR3 > 42) { this.fill_srh("right", 0, 3000, "srhr3") }
                    if (s.SRHL3 * Th.MKNOT < -34) { this.fill_srh("left", 0, 3000, "srhl3") }
                }
                if (s.CIZE * Th.MKNOT > 15) {
                    if (s.ESRHR > 0) { this.fill_srh("right", s.HEFFBAS, s.HEFFTOP, "esrhr") }
                    if (s.ESRHL < 0) { this.fill_srh("left", s.HEFFBAS, s.HEFFTOP, "esrhl") }
                }
            }
        }
    }


    /**
     * Fill the polygon of the hodograph with the bunkers point
     * Markowski P.230: 
     * SRH can be evaluated graphically from a hodograph. The
     * magnitude of the SRH is equal to twice the area bounded
     * by a hodograph and the tip of the storm motion vector (Figure 8.33).
     * @param direction {String} - left or right
     * @param bot {Float} - zg bottom [m]
     * @param top {Float} - zg top [m]
     * @param cssclass {String} - css clase name
     */
    fill_srh(direction, bot, top, cssclass) {
        // prepare the data - add Bunkers point to hodograph
        let s = this.tdd.s
        let poly = [s.data.filter(d => (d.zg >= bot) && (d.zg <= top))]
        let element = null
        if (direction == 'left') {
            poly[0].push({ u: s.BUNKERSLU, v: s.BUNKERSLV })
            element = this.lareas
        } else if (direction == 'right') {
            poly[0].push({ u: s.BUNKERSRU, v: s.BUNKERSRV })
            element = this.rareas
        }

        // DEBUG: area verification
        //console.log(direction, bot, top, cssclass, poly)<
        //let parray = []
        //for (let p of poly[0]){
        //    parray.push([p.u, p.v])
        //}
        //console.log(s3.polygonArea(parray)*2)

        // plot area
        element.append("path")
            .data(poly)
            .attr("d", s3.line()
                .x(d => this.x(d.u * Th.MKNOT))
                .y(d => this.y(d.v * Th.MKNOT))
            )
            .attr("class", cssclass)
    }


    /** */
    fit_to_data(fit = true) {
        let data = this.tdd.s.data.filter(d => d.zg < 8000)
        this.currmaxw = this.maxw
        if (fit == true) {
            // find max value
            let maxu = s3.max(data, d => Math.abs(d.u * Th.MKNOT))
            let maxv = s3.max(data, d => Math.abs(d.v * Th.MKNOT))
            let max = Math.max(maxu, maxv)
            this.currmaxw = (Math.floor(max / 10) + 1) * 10
        }
        // update axis
        this.x.domain([-this.currmaxw, this.currmaxw])
        this.y.domain([this.currmaxw, -this.currmaxw])
        this.axx.call(this.ax.scale(this.x))
        this.ayy.call(this.ay.scale(this.y))
    }
}



class WindDiagram extends AbstractDiagram {

    barbsize = 25
    barbnumb = 30    // maximum number of vertical barbs shown
    ptop = 100   // default top pressure [hPa]   
    pbot = 1050  // default bottom pressure [hPa]
    newpbot = this.pbot // bottom pressure when zooming


    /**
     * 
     * @param {*} tdd 
     * @param {*} start 
     * @param {*} dims 
     * @param {*} scale 
     */
    constructor(tdd, start, dims, scale) {
        super(tdd, start, dims, scale)
        // geometry
        //this.barbsize = this.barbsize*this.scale
        this.height = dims.height
        this.width = dims.width
        this.fullheight = dims.fullheight
        this.fullwidth = dims.fullwidth
        // build
        this._build()
        //this._trace()
    }


    /** */
    _build() {

        // main element
        this.main = this.tdd.svg.append("g")
            .attr("id", "wind")
            .attr("transform", "translate(" + (this.start + this.margin.left) + "," + this.margin.top + ")");

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
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("x", 0)
            .attr("y", 0);

        // groups
        this.hrline = this.main.append("g")
            .attr("class", "hrline")
            .attr("clip-path", "url(#clipwind)")

        this.barbs = this.main.append("g")
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
    _filter(n, s) {
        let pbot = this.newY.domain()[0]
        let ptop = this.newY.domain()[1]
        let lnt = Math.log(ptop)
        let lnb = Math.log(pbot)
        let inc = (lnb - lnt) / (n - 1)
        let data = []
        let lvls = [] // keep track of exiting levels
        for (let i in s3.range(n)) {
            let lnp = lnt + i * inc
            let d = s.closest(Math.exp(lnp))
            if (lvls.includes(d.p)) continue
            lvls.push(d.p)
            data.push(d)
        }
        return data
    }


    /** */
    clear() {
        this.hrline.html(null)
        this.barbs.html(null)
    }


    /** */
    plot() {

        this.clear()

        let s = this.tdd.s
        //barbs stuff
        // note: transform rotation in same direction as meteorological wind direction.
        let barbs = this._filter(this.barbnumb, s).filter(d => (d.wS >= 0 && d.p >= s.top.p)); // && d.wD >= 0
        this.barbs.selectAll("barbs")
            .data(barbs).enter().append("use")
            .attr("xlink:href", d => "#barb" + Math.round(Th.convert_wind(d.wS, 'kt') / 5) * 5) // 0,5,10,15,... always in kt
	    //.attr("transform", d => "translate(" + this.width / 2 + "," + this.newY(d.p) + ") rotate(" + (Th.math2met(d.wD * Th.RAD2DEG) - 180) + ") scale(0.75)") 
            .attr("transform", d => "translate(" + this.width / 2 + "," + this.newY(d.p) + ") rotate(" + ((d.wD * Th.RAD2DEG) - 180) + ") scale(0.75)") // Because of barb definition: 0 rotation == South wind, so subtract 180
        // hr
        this.hrline.append("path")
            .data([s.data])
            .attr("d", s3.line()
                .x(d => this.x((d.r / d.rw) * 100))
                .y(d => this.newY(d.p))
                .curve(s3.curveLinear)
            )
    }


    /** */
    _barb_templates() {
        let barbdef = this.main.append('defs')
        let speeds = s3.range(5, 175, 5);
        let that = this
        speeds.forEach(function(d) {
            var thisbarb = barbdef.append('g').attr('id', 'barb' + d);
            var flags = Math.floor(d / 50);
            var pennants = Math.floor((d - flags * 50) / 10);
            var halfpennants = Math.floor((d - flags * 50 - pennants * 10) / 5);
            var px = that.barbsize;
            //console.log(d, flags, pennants, halfpennants)
            // 5kt offset
            if (flags == 0 && pennants == 0 && halfpennants == 1) { px -= 3 }
            // Draw wind barb stems
            thisbarb.append("line").attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", that.barbsize);
            // Draw wind barb flags and pennants for each stem
            for (var i = 0; i < flags; i++) {
                thisbarb.append("polyline")
                    .attr("points", "0," + px + " -10," + (px) + " 0," + (px - 4))
                    .attr("class", "flag");
                px -= 7;
            }
            // Draw pennants on each barb
            for (i = 0; i < pennants; i++) {
                thisbarb.append("line")
                    .attr("x1", 0)
                    .attr("x2", -10)
                    .attr("y1", px)
                    .attr("y2", px + 4)
                px -= 3;
            }
            // Draw half-pennants on each barb
            for (i = 0; i < halfpennants; i++) {
                thisbarb.append("line")
                    .attr("x1", 0)
                    .attr("x2", -5)
                    .attr("y1", px)
                    .attr("y2", px + 2)
                px -= 3;
            }
        });
        // 0
        barbdef.append('g').attr('id', 'barb0').append("circle").attr("r", 4);
    }


    /**
     * 
     * @param {*} newY 
     * @param {*} trans 
     */
    _zoomed(newY, trans) {

        //let aaa = trans.rescaleY(this.y);
        this.newY = newY
        this.ayy.call(this.ay.scale(this.newY))

        this.plot()
    }


    /*
     * Creates scales and axes
     */
    _axes() {
        // axes group
        this.axes = this.main.append('g').attr("id", "axes")

        // pressure
        this.y = s3.scaleLog()
            .range([0, this.height])
            .domain([this.ptop, this.pbot]);
        this.newY = this.y // used in tooltips

        this.ay = s3.axisLeft(this.y)
            .tickSize(0, 0)
            .ticks(0)

        this.ayy = this.axes.append('g')
            .call(this.ay);

        // hr
        this.x = s3.scaleLinear()
            .range([0, this.width])
            .domain([0, 100])

        this.ax = s3.axisBottom(this.x)
            .ticks(2)
            .tickSize(0, 0)

        this.axx = this.axes.append('g')
            .attr("transform", "translate(0," + this.height + ")") // move the axis down
            .call(this.ax);
    }
}


class Legend extends AbstractDiagram {

    fval = "DD/MM/YYYY HH" // date format for run
    frun = "DD/MM/YYYY HH" // date format for day
    fonttitle = 15.0       // title font-size
    fonttable = 11.1 //10.8       // table font-size
    fontfull = 13
    op = 0.3               // button opacity when deactivated	


    /**
     * 
     * @param {*} tdd 
     * @param {*} start 
     * @param {*} dims 
     * @param {*} scale 
     */
    constructor(tdd, start, dims, scale) {
        super(tdd, start, dims, scale)
        // geometry
        this.height = dims.height
        this.width = dims.width
        this.fullheight = dims.fullheight
        this.fullwidth = dims.fullwidth
        //this.lines   = tdd.lines
        //this.parcels = tdd.parcels
        // scale
        this.fonttitle = this.fonttitle * this.scale
        this.fonttable = this.fonttable * this.scale
        this.fontfull = this.fontfull * this.scale
        // build
        this._build()
        //this._trace()
    }


    /** */
    _build() {

        // main element
        this.main = this.tdd.svg.append("g")
            .attr("id", "lgnd")
            .attr("transform", "translate(" + (this.start + this.margin.left) + "," + this.margin.top + ")");

        // background		
        this.main.append('rect')
            .attr('x', 0).attr('y', 0)
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', '1')

        // html
        this.main.append('g').attr("id", "legendgroup").append("foreignObject")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("xhtml:body")
            .style("font-size", this.fonttable + "px")
            .style("margin", "2px")
            .attr("id", "foreinglegend")
            .style("width", "98%") // adjustment for panel
            .style("font-family", "Helvetica Neue,Helvetica,Arial,sans-serif") // adjustment for panel
            .html('<div id="infolegendgroup"></div><div id="ctrllegendgroup"></div>');

        this.info = s3.select('#infolegendgroup')
        this.ctrl = s3.select('#ctrllegendgroup')

        this._add_controls()
    }


    /** */
    plot() {
        this._add_table()
        this._set_parcel_inputs()
    }


    /**
     * 
     * @param {*} error 
     */
    error(error = null) {
        let title = '<span class="titlelegend" style="word-break: break-all; white-space: normal; font-size : ' + this.fonttitle + 'px">'
        if (error) title += error
        else title += 'Error'
        title += '</span>'
        this.info.html(title)
    }


    /** */
    _add_table() {
        // clear group
        this.info.html(null)

        let s = this.tdd.s                          // sounding
        let ad = this.tdd.s.parcels[this.tdd.parcel] // selected parcel
        let as = this.tdd.s.parcels['SB']            // SFC parcel
        let am = this.tdd.s.parcels['MU']            // MU parcel

        //s.COTA = s.COTANIE[this.tdd.cota]

        // title
        let run = moment.utc(s.date, "YYYY/MM/DD")
        run.add(s.run, 'hours')
        let val = run.clone().add(parseInt(s.step), 'hours')
        let title = '<span class="titlelegend" style="font-size : ' + this.fonttitle + 'px">'
        if (s.name) { title += s.name + '<br>' }
        title += (s.lat).toFixed(2) + "  " + (s.lon).toFixed(2) + "  zs " + s.zs.toFixed(1) + " m"
        title += '<br>' + run.format(this.frun) + " UTC. H+" + s.step
        title += '<br>' + val.format(this.fval) + " UTC. " + s.model
        title += '</span>'

        // indexes 
        let t = '<table class="tablelegend" id="tableindexinstability">'
        t += '<tr           ><td colspan="3"><b>Índices de inestabilidad</b></td></tr>'
        t += '<tr class="ri"><td>K         </td><td class="tdr" colspan="2">' + round(s, 'K', 1) + '</td><td>   </td></tr>'
        t += '<tr class="ri"><td>SHOW      </td><td class="tdr" colspan="2">' + round(s, 'SHOW', 1) + '</td></tr>'
        t += '<tr class="ri"><td>TT        </td><td class="tdr" colspan="2">' + round(s, 'TT', 1) + '</td></tr>'
        t += '<tr class="ri"><td>ISOC      </td><td class="tdr" colspan="2">' + round(s, 'ISOC', 0) + '</td></tr>'
        t += '<tr class="ri"><td>ISOW      </td><td class="tdr" colspan="2">' + round(s, 'ISOW', 0) + '</td></tr>'
        t += '<tr class="ri"><td>COTANIE   </td><td class="tdr" colspan="2">' + round(s, 'COTA', 0) + '</td></tr>'
        t += '<tr class="ri"><td data-param="PW">PW sfc-300</td><td class="tdr" colspan="2">' + round(s, 'PW', 1) + '</td></tr>'
        t += '<tr class="ri"><td data-param="PW">PW 700-500</td><td class="tdr" colspan="2">' + round(s, 'PW5', 1) + '</td></tr>'
        t += '<tr class="ri"><td data-param="PW">PW 850-700</td><td class="tdr" colspan="2">' + round(s, 'PW7', 1) + '</td></tr>'
        t += '<tr class="ri"><td data-param="PW">PW sfc-850</td><td class="tdr" colspan="2">' + round(s, 'PW8', 1) + '</td></tr>'
        t += '<tr class="ri"><td>WINDEX    </td><td class="tdr" colspan="2">' + round(s, 'WINDEX', 1) + '</td></tr>'
        t += '<tr           ><td colspan="3"><b>Índices cinemáticos</b></td></tr>'

        // CIZ as rows
        //		t += '<tr class="ri"><td data-param="CIZ">CIZ08     </td><td class="tdr" colspan="2">'+round(s, 'CIZ08', 1, Th.MKNOT)+'</td></tr>'
        //		t += '<tr class="ri"><td data-param="CIZ">CIZ06     </td><td class="tdr" colspan="2">'+round(s, 'CIZ06', 1, Th.MKNOT)+'</td></tr>'
        //		t += '<tr class="ri"><td data-param="CIZ">CIZ03     </td><td class="tdr" colspan="2">'+round(s, 'CIZ03', 1, Th.MKNOT)+'</td></tr>'
        //		t += '<tr class="ri"><td data-param="CIZ">CIZ01     </td><td class="tdr" colspan="2">'+round(s, 'CIZ01', 1, Th.MKNOT)+'</td></tr>'
        //		t += '<tr class="ri"><td>CIZE                       </td><td class="tdr" colspan="2">'+round(s, 'CIZE',  1, Th.MKNOT)+'</td></tr>'

        // CIZ as cols
        t += '<tr class="ri"><td colspan="3">'
        t += '<table class="tablelegend" id="tableciz">'
        t += '<tr class="ri"><td data-param="CIZ">CIZ8</td><td>CIZ6</td><td>CIZ3</td><td>CIZ1</td><td>CIZE</td></td></tr>'
        t += '<tr class="ri">'
        t += '<td >' + round(s, 'CIZ08', 1, Th.MKNOT) + '</td>'
        t += '<td >' + round(s, 'CIZ06', 1, Th.MKNOT) + '</td>'
        t += '<td >' + round(s, 'CIZ03', 1, Th.MKNOT) + '</td>'
        t += '<td >' + round(s, 'CIZ01', 1, Th.MKNOT) + '</td>'
        t += '<td >' + round(s, 'CIZE', 1, Th.MKNOT) + '</td>'
        t += '</tr>'
        t += '</table>'
        t += '</td></tr>'

        //t += '<tr class="ri"><td data-param="MEAN">MEAN W06  </td><td class="tdr" colspan="2">' + round(s, 'WSM06', 1, Th.MKNOT) + '/' + rnd(Th.math2met(s.WDM06), 0) + '</td></tr>'
        t += '<tr class="ri"><td data-param="MEAN">MEAN W06  </td><td class="tdr" colspan="2">' + round(s, 'WSM06', 1, Th.MKNOT) + '/' + rnd((s.WDM06), 0) + '</td></tr>'
	//t += '<tr class="ri"><td data-param="HEFF">HEFFTOP   </td><td class="tdr" colspan="2">'+round(s, 'HEFFTOP', 1)+'</td></tr>'
        //t += '<tr class="ri"><td data-param="HEFF">HEFFBAS   </td><td class="tdr" colspan="2">'+round(s, 'HEFFBAS', 1)+'</td></tr>'
        t += '<tr class="ri"><td data-param="HEFF">HEFF B/T  </td><td class="tdr" colspan="2">' + round(s, 'HEFFBAS', 1) + '/' + round(s, 'HEFFTOP', 1) + '</td></tr>'

        // supercell and tornados (only virtual parcel for parameters BRN,VGP,STP2,EHI1,EHI3)
        t += '<tr ><td data-param="sc_title" colspan="3"><b>Supercélulas y tornados</b></td></tr>'
        t += '<tr class="ri"><td>BRN   </td><td class="tdr" colspan="2">' + round(ad, 'BRNv', 1) + '</td></tr>'
        t += '<tr class="ri"><td>VGP   </td><td class="tdr" colspan="2">' + round(ad, 'VGPv', 2) + '</td></tr>'
        t += '<tr><td>      </td><td class="tdr2">Izq.                    </td><td class="tdr2">Dch.                     </td></tr>'
        ///t += '<tr class="ri"><td>BUNK  </td><td class="tdr2">' + round(s, 'BUNKERSLWS', 1, Th.MKNOT) + '/' + rnd(Th.math2met(s.BUNKERSLWD), 0) + '<td class="tdr2">' + round(s, 'BUNKERSRWS', 1, Th.MKNOT) + '/' + rnd(Th.math2met(s.BUNKERSRWD), 0) + '</td></tr>'
        t += '<tr class="ri"><td>BUNK  </td><td class="tdr2">' + round(s, 'BUNKERSLWS', 1, Th.MKNOT) + '/' + rnd((s.BUNKERSLWD), 0) + '<td class="tdr2">' + round(s, 'BUNKERSRWS', 1, Th.MKNOT) + '/' + rnd((s.BUNKERSRWD), 0) + '</td></tr>'
	t += '<tr class="ri"><td data-param="SRH">SRH 1 </td><td class="tdr2">' + round(s, 'SRHL1', 1) + '</td><td class="tdr2">' + round(s, 'SRHR1', 1) + '</td></tr>'
        t += '<tr class="ri"><td data-param="SRH">SRH 3 </td><td class="tdr2">' + round(s, 'SRHL3', 1) + '</td><td class="tdr2">' + round(s, 'SRHR3', 1) + '</td></tr>'
        t += '<tr class="ri"><td>ESRH  </td><td class="tdr2">' + round(s, 'ESRHL', 1) + '</td><td class="tdr2">' + round(s, 'ESRHR', 1) + '</td></tr>'
        t += '<tr class="ri"><td>SCP   </td><td class="tdr2">' + round(s, 'SCP2L', 1) + '</td><td class="tdr2">' + round(s, 'SCP2R', 1) + '</td></tr>'
        t += '<tr class="ri"><td>STP   </td><td class="tdr2">' + round(ad, 'STP2Lv', 1) + '</td><td class="tdr2">' + round(ad, 'STP2Rv', 1) + '</td></tr>'
        t += '<tr class="ri"><td data-param="EHI">EHI1  </td><td class="tdr2">' + round(ad, 'EHIL1v', 1) + '</td><td class="tdr2">' + round(ad, 'EHIR1v', 1) + '</td></tr>'
        t += '<tr class="ri"><td data-param="EHI">EHI3  </td><td class="tdr2">' + round(ad, 'EHIL3v', 1) + '</td><td class="tdr2">' + round(ad, 'EHIR3v', 1) + '</td></tr>'
        t += '</table>'

        // parcel
        let tp = this._add_table_parcel(this.tdd.lift, s, ad, as, am)


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
        tm += '<tr><td style="vertical-align:top">' + t + '</td><td style="vertical-align:top">' + tp + '</td></tr>'
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
            s3.select(this).on("click", function() {
                let param = s3.select(this).select("td").attr("data-param")
                param = param || s3.select(this).select("td").text()
                that.tdd.info.load(param)
            })
        })
    }


    _add_table_parcel(lift, s, ad, as, am) {
        let tp = ''
        if (lift == 'TTv') {
            tp += '<table class="tablelegend">'
            tp += '<tr><td colspan="5"><b>Análisis de la burbuja</b></td></tr>'
            tp += '<tr><td>      </td><td class="tdr" colspan="2">Normal</td><td class="tdr" colspan="2">Virtual</td></tr>'
            tp += '<tr class="ri"><td data-param="TD">Td    </td><td class="tdr" colspan="2">' + round(ad, 'Td0', 1) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="TH">&Theta;   </td><td class="tdr" colspan="2">' + round(ad, 'TH', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>MIX   </td><td class="tdr" colspan="2">' + round(ad, 'r0', 1, 1000) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="THE">&Theta;e </td><td class="tdr" colspan="2">' + round(ad, 'THE', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>TCC   </td><td class="tdr" colspan="2">' + round(ad, 'CCT', 1) + '</td><td class="tdr" colspan="2">' + round(ad, 'CCTv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>TDIS  </td><td class="tdr" colspan="2">' + round(ad, 'CT', 1) + '</td><td class="tdr" colspan="2">' + round(ad, 'CTv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>TNCA  </td><td class="tdr" colspan="2">' + round(ad, 'TLCL', 1) + '</td><td class="tdr" colspan="2">' + round(ad, 'TLCLv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>NE    </td><td class="tdr" colspan="2">' + round(ad, 'zEL', 0) + '</td><td class="tdr" colspan="2">' + round(ad, 'zELv', 0) + '</td></tr>'
            tp += '<tr class="ri"><td>NCL   </td><td class="tdr" colspan="2">' + round(ad, 'zLFC', 0) + '</td><td class="tdr" colspan="2">' + round(ad, 'zLFCv', 0) + '</td></tr>'
            tp += '<tr class="ri"><td>NCC   </td><td class="tdr" colspan="2">' + round(ad, 'zCCL', 0) + '</td><td class="tdr" colspan="2">' + round(ad, 'zCCLv', 0) + '</td></tr>'
            tp += '<tr class="ri"><td>NCA   </td><td class="tdr" colspan="2">' + round(ad, 'zLCL', 0) + '</td><td class="tdr" colspan="2">' + round(ad, 'zLCLv', 0) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="LIFT">LIFT  </td><td class="tdr" colspan="2">' + round(ad, 'LIFT', 1) + '</td><td class="tdr" colspan="2">' + round(ad, 'LIFTv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="LIFT">LIFT7 </td><td class="tdr" colspan="2">' + round(ad, 'LIFT7', 1) + '</td><td class="tdr" colspan="2">' + round(ad, 'LIFT7v', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>CAPE3 </td><td class="tdr" colspan="2">' + round(ad, 'CAPE3', 1) + '</td><td class="tdr" colspan="2">' + round(ad, 'CAPE3v', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>CAPE  </td><td class="tdr" colspan="2">' + round(ad, 'CAPE', 1) + '</td><td class="tdr" colspan="2">' + round(ad, 'CAPEv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>CIN   </td><td class="tdr" colspan="2">' + round(ad, 'CIN', 1) + '</td><td class="tdr" colspan="2">' + round(ad, 'CINv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>DCAPE </td><td class="tdr" colspan="2">' + round(ad, 'DCAPE', 1) + '</td><td class="tdr" colspan="2">' + round(ad, 'DCAPEv', 1) + '</td></tr>'
            tp += '<tr><td colspan="5"><b>Superficie</b></td></tr>'
            tp += '<tr class="ri"><td>SBCAPE</td><td class="tdr" colspan="2">' + round(as, 'CAPE', 1) + '</td><td class="tdr" colspan="2">' + round(as, 'CAPEv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>SBCIN </td><td class="tdr" colspan="2">' + round(as, 'CIN', 1) + '</td><td class="tdr" colspan="2">' + round(as, 'CINv', 1) + '</td></tr>'
            tp += '<tr><td colspan="5"><b>Más inestable</b></td></tr>'
            tp += '<tr class="ri"><td>MUCAPE</td><td class="tdr" colspan="2">' + round(am, 'CAPE', 1) + '</td><td class="tdr" colspan="2">' + round(am, 'CAPEv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>MUCIN </td><td class="tdr" colspan="2">' + round(am, 'CIN', 1) + '</td><td class="tdr" colspan="2">' + round(am, 'CINv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td>DCAPE </td><td class="tdr" colspan="2">' + round(am, 'DCAPE', 1) + '</td><td class="tdr" colspan="2">' + round(am, 'DCAPEv', 1) + '</td></tr>'
            tp += '</table>'
            return tp
        } else if (lift == 'Tv') {
            tp += '<table class="tablelegend">'
            tp += '<tr><td colspan="2"><b>Análisis de la burbuja</b></td></tr>'
            tp += '<tr           ><td>                           </td><td class="tdr">Virtual                        </td></tr>'
            tp += '<tr class="ri"><td data-param="TD"  >Td       </td><td class="tdr">' + round(ad, 'Td0', 1) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="TH"  >&Theta;  </td><td class="tdr">' + round(ad, 'TH', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >MIX      </td><td class="tdr">' + round(ad, 'r0', 1, 1000) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="THE" >&Theta;e </td><td class="tdr">' + round(ad, 'THE', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >TCC      </td><td class="tdr">' + round(ad, 'CCTv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >TDIS     </td><td class="tdr">' + round(ad, 'CTv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >TNCA     </td><td class="tdr">' + round(ad, 'TLCLv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >NE       </td><td class="tdr">' + round(ad, 'zELv', 0) + '</td></tr>'
            tp += '<tr class="ri"><td                  >NCL      </td><td class="tdr">' + round(ad, 'zLFCv', 0) + '</td></tr>'
            tp += '<tr class="ri"><td                  >NCC      </td><td class="tdr">' + round(ad, 'zCCLv', 0) + '</td></tr>'
            tp += '<tr class="ri"><td                  >NCA      </td><td class="tdr">' + round(ad, 'zLCLv', 0) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="LIFT">LIFT     </td><td class="tdr">' + round(ad, 'LIFTv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="LIFT">LIFT7    </td><td class="tdr">' + round(ad, 'LIFT7v', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >CAPE3    </td><td class="tdr">' + round(ad, 'CAPE3v', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >CAPE     </td><td class="tdr">' + round(ad, 'CAPEv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >CIN      </td><td class="tdr">' + round(ad, 'CINv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >DCAPE    </td><td class="tdr">' + round(ad, 'DCAPEv', 1) + '</td></tr>'
            tp += '<tr><td colspan="2"><b>Superficie</b></td></tr>'
            tp += '<tr class="ri"><td                  >SBCAPE   </td><td class="tdr">' + round(as, 'CAPEv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >SBCIN    </td><td class="tdr">' + round(as, 'CINv', 1) + '</td></tr>'
            tp += '<tr><td colspan="2"><b>Más inestable</b></td></tr>'
            tp += '<tr class="ri"><td                  >MUCAPE   </td><td class="tdr">' + round(am, 'CAPEv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >MUCIN    </td><td class="tdr">' + round(am, 'CINv', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >DCAPE    </td><td class="tdr">' + round(am, 'DCAPEv', 1) + '</td></tr>'
            tp += '</table>'
            return tp
        } else if (lift == 'T') {
            tp += '<table class="tablelegend">'
            tp += '<tr><td colspan="2"><b>Análisis de la burbuja</b></td></tr>'
            tp += '<tr           ><td>                           </td><td class="tdr">Normal</td></tr>'
            tp += '<tr class="ri"><td data-param="TD"  >Td       </td><td class="tdr">' + round(ad, 'Td0', 1) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="TH"  >&Theta;  </td><td class="tdr">' + round(ad, 'TH', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >MIX      </td><td class="tdr">' + round(ad, 'r0', 1, 1000) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="THE" >&Theta;e </td><td class="tdr">' + round(ad, 'THE', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >TCC      </td><td class="tdr">' + round(ad, 'CCT', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >TDIS     </td><td class="tdr">' + round(ad, 'CT', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >TNCA     </td><td class="tdr">' + round(ad, 'TLCL', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >NE       </td><td class="tdr">' + round(ad, 'zEL', 0) + '</td></tr>'
            tp += '<tr class="ri"><td                  >NCL      </td><td class="tdr">' + round(ad, 'zLFC', 0) + '</td></tr>'
            tp += '<tr class="ri"><td                  >NCC      </td><td class="tdr">' + round(ad, 'zCCL', 0) + '</td></tr>'
            tp += '<tr class="ri"><td                  >NCA      </td><td class="tdr">' + round(ad, 'zLCL', 0) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="LIFT">LIFT     </td><td class="tdr">' + round(ad, 'LIFT', 1) + '</td></tr>'
            tp += '<tr class="ri"><td data-param="LIFT">LIFT7    </td><td class="tdr">' + round(ad, 'LIFT7', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >CAPE3    </td><td class="tdr">' + round(ad, 'CAPE3', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >CAPE     </td><td class="tdr">' + round(ad, 'CAPE', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >CIN      </td><td class="tdr">' + round(ad, 'CIN', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >DCAPE    </td><td class="tdr">' + round(ad, 'DCAPE', 1) + '</td></tr>'
            tp += '<tr><td colspan="2"><b>Superficie</b></td></tr>'
            tp += '<tr class="ri"><td                  >SBCAPE   </td><td class="tdr">' + round(as, 'CAPE', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >SBCIN    </td><td class="tdr">' + round(as, 'CIN', 1) + '</td></tr>'
            tp += '<tr><td colspan="2"><b>Más inestable</b></td></tr>'
            tp += '<tr class="ri"><td                  >MUCAPE   </td><td class="tdr">' + round(am, 'CAPE', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >MUCIN    </td><td class="tdr">' + round(am, 'CIN', 1) + '</td></tr>'
            tp += '<tr class="ri"><td                  >DCAPE    </td><td class="tdr">' + round(am, 'DCAPE', 1) + '</td></tr>'
            //tp += '<tr class="ri"><td data-param="DCAPE">DCAPE    </td><td class="tdr">'+round(s, 'DCAPE7', 1)      +'</td></tr>'        
            tp += '</table>'
            return tp
        }
    }


    /** */
    show_info() {
        console.log(this)
    }


    /** */
    _add_controls() {

        let mar = 2 // foreinglegend margin
        let tdp = 0 // .tablectr td padding
        let bor = 2 // .tablectr border-spacing 

        // button witdh for 6 equal buttons
        let num = 6 // number of buttons
        let bw = (this.width - 2 * mar - (num + 1) * bor - num * tdp) / num

        // button width for parcel inputs. 4 inputs, 1 button with an arrow.
        let wavail5 = (this.width - 2 * mar - (num + 1) * bor - 5 * tdp)
        let bwb = wavail5 * .05    // 5%
        let bwi = wavail5 * .95 / 4. // 95%

        // button width for extra visualization options
        let nextra = 4
        let bwe = (this.width - 2 * mar - (nextra + 1) * bor - nextra * tdp) / nextra


        let t = '<div id="ctrlegend">'
        t += '<td><input id="togglectrlegend"  class="parcelbtn" type="button" value="" /></td>'
        t += '<hr id="hrtogglectrlegend" class="hrlegend">'
        t += '<div id="colapsectrlegend">'

        // lift and parcels

        t += '<table id="parcelcontrols" class="tablectr">'
        t += '<tr>'
        t += '<td colspan="2">Ascenso</td>'
        t += '<td><input id="Tliftlegend"  class="parcelbtn" type="button" style="width:' + bw + 'px;" value="T" /></td>'
        t += '<td><input id="Tvliftlegend" class="parcelbtn" type="button" style="width:' + bw + 'px;" value="Tv" /></td>'
        t += '<td colspan="2"><input id="TTvliftlegend" class="parcelbtn" type="button" style="width:' + (bw * 2 + 2) + 'px;" value="T-Tv"/></td>'
        t += '</tr>'
        t += '<tr>'
        // parcels
        for (let p of this.tdd.parcels) {
            t += '<td><input class="parcelgroup parcelbtn" type="button" style="width:' + bw + 'px;" value="' + p.value + '" title="' + p.title + '" /></td>'
        }
        t += '</tr>'
        t += '</table>'


        // inputs
        t += '<hr class="hrlegend">'
        t += '<table id="inputcontrols" class="tablectr">'
        t += '<tr>'
        t += '<td><input id="pinputlegend"  class="parcelinputbtn" style="width:' + bwi + 'px;" type="number"  min="100"  max="1050" value="0" title="Presión (hPa)"        /></td>'
        t += '<td><input id="tdinputlegend" class="parcelinputbtn" style="width:' + bwi + 'px;" type="number"  min="-100" max="100"  value="0" title="Punto de rocío (ºC)"  /></td>'
        t += '<td><input id="tinputlegend"  class="parcelinputbtn" style="width:' + bwi + 'px;" type="number"  min="-100" max="100"  value="0" title="Temperatura (ºC)"     /></td>'
        t += '<td><input id="rhinputlegend" class="parcelinputbtn" style="width:' + bwi + 'px;" type="number"  min="0"    max="100"  value="0" title="Humedad relativa (%)" /></td>'
        t += '<td><input id="goinputlegend" class="parcelinputbtn" style="width:' + bwb + 'px;" type="button"                   value="&#8593" title="Calcular"/></td>'
        t += '</tr>'
        t += '</table>'

        // lines
        t += '<hr class="hrlegend">'
        t += '<table id="linecontrols" class="tablectr">'
        t += '<tr>'
        t += '<td><input id="Tdlinelegend" class="linebtn Tdbtn" type="button" style="width:' + bw + 'px;" value="Td"  /></td>'
        t += '<td><input id="Twlinelegend" class="linebtn Twbtn" type="button" style="width:' + bw + 'px;" value="Tw" /></td>'
        t += '<td><input id="Tflinelegend" class="linebtn Tfbtn" type="button" style="width:' + bw + 'px;" value="Tf" /></td>'
        t += '<td><input id="Tlinelegend"  class="linebtn  Tbtn" type="button" style="width:' + bw + 'px;" value="T"  /></td>'
        t += '<td><input id="Tvlinelegend" class="linebtn Tvbtn" type="button" style="width:' + bw + 'px;" value="Tv" /></td>'
        t += '<td><input id="Telinelegend" class="linebtn Tebtn" type="button" style="width:' + bw + 'px;" value="Te" /></td>'
        t += '</tr>'
        t += '<tr>'
        t += '<td><input id="Tdtoollegend" class="toolbtn Tdbtn Tdtoolbtn" type="button" style="width:' + bw + 'px;" value="&#9679" /></td>'
        t += '<td><input id="Twtoollegend" class="toolbtn Twbtn Twtoolbtn" type="button" style="width:' + bw + 'px;" value="&#9679" /></td>'
        t += '<td><input id="Tftoollegend" class="toolbtn Tfbtn Tftoolbtn" type="button" style="width:' + bw + 'px;" value="&#9679" /></td>'
        t += '<td><input id="Ttoollegend"  class="toolbtn  Tbtn Ttoolbtn"  type="button" style="width:' + bw + 'px;" value="&#9679" /></td>'
        t += '<td><input id="Tvtoollegend" class="toolbtn Tvbtn Tvtoolbtn" type="button" style="width:' + bw + 'px;" value="&#9679" /></td>'
        t += '<td><input id="Tetoollegend" class="toolbtn Tebtn Tetoolbtn" type="button" style="width:' + bw + 'px;" value="&#9679" /></td>'
        t += '</tr>'
        t += '</table>'

        // extra
        t += '<hr class="hrlegend">'
        t += '<table id="extracontrols" class="tablectr">'
        t += '<tr>'
        t += '<td><input id="ftlevelslegend"    class="parcelbtn btnact" type="button" style="width:' + bwe + 'px;" value="Niv"   title="Niveles significativos" /></td>'
        t += '<td><input id="invtarealegend"  class="parcelbtn btnact" type="button" style="width:' + bwe + 'px;" value="Inv"   title="Inversiones" /></td>'
        t += '<td><input id="dcapearealegend" class="parcelbtn btnact" type="button" style="width:' + bwe + 'px;" value="DCAPE" title="Downward Convective Available Potential Energy" /></td>'
        t += '<td><input id="hodoareaslegend" class="parcelbtn btnact" type="button" style="width:' + bwe + 'px;" value="SRH"   title="Área proporcional a la helicidad relativa a la tormenta en 0-3 km y en la capa efectiva" /></td>'
        t += '</tr>'
        t += '</table>'

        t += '</div>'
        t += '</div>'
        this.ctrl.html(t)

        // hide/show controls
        s3.select('#togglectrlegend').on("click", (function() { this.toggle_ctrlegend() }).bind(this))

        // lift btns handlers
        s3.select('#Tliftlegend').on("click", (function() { this.lift_change('T') }).bind(this))
        s3.select('#Tvliftlegend').on("click", (function() { this.lift_change('Tv') }).bind(this))
        s3.select('#TTvliftlegend').on("click", (function() { this.lift_change('TTv') }).bind(this))
        // parcel btns handlers
        for (let p of this.tdd.parcels) {
            s3.select('.parcelbtn[value="' + p.value + '"]').on("click", (function() { this.parcel_change(p.value) }).bind(this))
        }
        // lines and tools btns handlers
        for (let l of Object.values(this.tdd.lines)) {
            s3.select('#' + l.name + 'linelegend').on("click", (function() { this.line_change(l) }).bind(this))
            s3.select('#' + l.name + 'toollegend').on("click", (function() { this.tool_change(l) }).bind(this))
        }
        // input handler
        s3.select('#goinputlegend').on("click", (function() { this.parcel_input_change() }).bind(this))
        s3.select('#pinputlegend').on("change", (function() { this._update_rhinput() }).bind(this))
        s3.select('#tdinputlegend').on("change", (function() { this._update_rhinput() }).bind(this))
        s3.select('#tinputlegend').on("change", (function() { this._update_rhinput() }).bind(this))
        s3.select('#rhinputlegend').on("change", (function() { this._update_tdinput() }).bind(this))
        // extra handler   
        s3.select('#ftlevelslegend').on("click", (function() { this.visual_change('ftlevels') }).bind(this))
        s3.select('#invtarealegend').on("click", (function() { this.visual_change('invtarea') }).bind(this))
        s3.select('#hodoareaslegend').on("click", (function() { this.visual_change('hodoareas') }).bind(this))
        s3.select('#dcapearealegend').on("click", (function() { this.visual_change('dcapearea') }).bind(this))
    }


    /** */
    toggle_ctrlegend() {
        let elem = s3.select('#colapsectrlegend')
        let vis = elem.style('visibility')
        console.log(vis)
        if (vis == 'collapse') {
            elem.style('visibility', 'visible')
            elem.style('height', '')
            //s3.select('.tablelegend').style("font-size", this.fonttable+"px")

        } else {
            elem.style('visibility', 'collapse')
            elem.style('height', '0px')
            //s3.select('.tablelegend').style("font-size", this.fontfull+"px")
        }
    }


    /**
     * 
     */
    visual_change(id) {
        //console.log("visual_change", id)
        let act = s3.select('#' + id + 'legend').classed("btnact")
        if (act) {
            s3.select('#' + id + 'legend').classed("btnact", !act)
            s3.select('#' + id).style('visibility', 'hidden')
        } else {
            s3.select('#' + id + 'legend').classed("btnact", !act)
            s3.select('#' + id).style('visibility', 'visible')
        }
    }


    /** */
    _update_rhinput() {
        let p0 = parseFloat(s3.select('#pinputlegend').property('value'))
        let Td0 = parseFloat(s3.select('#tdinputlegend').property('value'))
        let T0 = parseFloat(s3.select('#tinputlegend').property('value'))
        if (p0 > this.tdd.s.bot.p) {
            p0 = this.tdd.s.bot.p
            s3.select('#pinputlegend').property('value', p0)
        }
        if (Td0 > T0) {
            Td0 = T0
            s3.select('#tdinputlegend').property('value', Td0)
        }
        s3.select('#rhinputlegend').property('value', Th.rhc(p0, T0, Td0))
    }


    /** */
    _update_tdinput() {
        let p0 = parseFloat(s3.select('#pinputlegend').property('value'))
        let RH = parseFloat(s3.select('#rhinputlegend').property('value'))
        let T0 = parseFloat(s3.select('#tinputlegend').property('value'))
        let r0 = RH * Th.rwc(T0, p0) / 100.
        let Td0 = Th.tdc(p0, r0)
        s3.select('#tdinputlegend').property('value', Td0)
    }


    /**
     * Set controls and visibility
     */
    set_controls() {

        // line and tooltips visibility
        for (let l of Object.values(this.tdd.lines)) {
            if (l.visible == false) {
                l.visible = true
                this.line_change(l)
            }
            if (l.tooltip == false) {
                l.tooltip = true
                this.tool_change(l)
            }
        }

        // set pressed buttons. All areas visible by default
        for (let a of this.tdd.areas) {
            if (a.visible == false) {
                this.visual_change(a.id)
            }
        }

        // lift button
        let lift = this.tdd.lift
        s3.select('#' + lift + 'liftlegend').classed("btnact", true)

        // parcel button
        let parcel = this.tdd.parcel
        s3.select('.parcelbtn[value="' + parcel + '"]').classed("btnact", true)
    }


    /** */
    _set_parcel_inputs() {
        let p = this.tdd.get_parcel()

        s3.select('#pinputlegend').property('value', p ? p.p0 : '')
        s3.select('#tdinputlegend').property('value', p ? p.Td0 : '')
        s3.select('#tinputlegend').property('value', p ? p.T0 : '')
        s3.select('#rhinputlegend').property('value', p ? Th.rhc(p.p0, p.T0, p.Td0) : '')
    }


    /** */
    parcel_input_change() {
        // retrive values
        let p0 = parseFloat(s3.select('#pinputlegend').property('value'))
        let Td0 = parseFloat(s3.select('#tdinputlegend').property('value'))
        let T0 = parseFloat(s3.select('#tinputlegend').property('value'))
        //console.log(p0, Td0, T0)
        this.parcel_change('X', true, false)
        this.tdd.new_parcel(p0, T0, null, Td0, null)
    }


    /**
     * 
     * @param {*} lift 
     */
    lift_change(lift) {
        //console.log("lift_change", lift)
        s3.select('#' + this.tdd.lift + 'liftlegend').classed("btnact", false) // previous btn
        s3.select('#' + lift + 'liftlegend').classed("btnact", true)
        this.tdd.lift = lift
        this.tdd.plot_parcel()
        //this.parcel_change(this.tdd.parcel, true)
    }



    /**
     * Change parcel buttons and set TDD.parcel to the new selection.
     * Called from .parcelgroup buttons, from #goinputlegend and from skewt clicks.
     * @param {String} level -   
     * @param {boolean} keepactive - keep the button active if it's already active.  
     */
    parcel_change(level, keepactive = false, triggerplot = true) {
        //console.log("parcel_change", level, keepactive, triggerplot)

        let active = this.tdd.parcel == level
        if (keepactive) active = false
        let rect = s3.select('.parcelbtn[value="' + level + '"]')
        s3.selectAll('.parcelgroup').classed("btnact", false)
        if (active) {
            rect.classed("btnact", false)
            this.tdd.parcel = null
        } else {
            this.tdd.parcel = level
            rect.classed("btnact", true);
        }
        //        else {
        //            if (this.tdd.parcel != null){
        //                s3.select('.parcelbtn[value="'+(this.tdd.parcel).toString()+'"]')
        //                    .classed("btnact", false)
        //            }
        //            rect.classed("btnact", true);
        //            this.tdd.parcel = level
        //        }

        if (triggerplot) {
            //this._set_parcel_inputs()
            this.tdd.plot_parcel()
        }
    }


    /**
     * @param {String} level -   
     * @param {boolean} keepactive - keep the button active if it's already active. 
     * @param {boolean} triggerplot - 
     */
    parcel_change_old(level, keepactive = false, triggerplot = true) {
        //console.log("parcel_change", level, keepactive, triggerplot)

        let active = this.tdd.parcel == level
        if (keepactive) active = false
        let rect = s3.select('.parcelbtn[value="' + level + '"]')
        if (active) {
            rect.classed("btnact", false)
            this.tdd.parcel = null
        } else {
            if (this.tdd.parcel != null) {
                s3.select('.parcelbtn[value="' + (this.tdd.parcel).toString() + '"]')
                    .classed("btnact", false)
            }
            rect.classed("btnact", true);
            this.tdd.parcel = level
        }

        if (triggerplot) {
            this._set_parcel_inputs()
            this.tdd.plot_parcel()
        }
    }


    /**
     * Set line visibility. 
     * Changes buttons and visbility of the diagram using its ids.
     * @param {*} line 
     */
    line_change(line) {

        let id = line.name                        // line name
        let idline = line.name + "line"               // diagram line id
        let idtool = line.name + "label"              // diagram tooltip id 
        let idlinelegend = line.name + "linelegend"   // control line id 
        let idtoollegend = line.name + "toollegend"   // control tooltip id
        var lineactive = this.tdd.lines[id].visible

        // hide or show the elements
        if (lineactive) {
            s3.select("#" + idline).style("opacity", 0);
            s3.select('#' + idtool).style("opacity", 0);
            s3.select("#" + idlinelegend).style("opacity", this.op);
            s3.select("#" + idtoollegend).style("opacity", this.op);
            this.tdd.lines[id].tooltip = false
        } else {
            s3.select("#" + idline).style("opacity", 1);
            s3.select("#" + idlinelegend).style("opacity", 1);
        }
        // update whether or not the elements are active
        this.tdd.lines[id].visible = !lineactive
    }


    /**
     * Set tooltip visibility. 
     * Changes buttons and visbility of the diagram using its ids.
     * @param {Object} line 
     */
    tool_change(line) {

        let id = line.name                        // line name
        let idline = line.name + "line"               // diagram line id
        let idtool = line.name + "label"              // diagram tooltip id 
        let idlinelegend = line.name + "linelegend"   // control line id 
        let idtoollegend = line.name + "toollegend"   // control tooltip id
        var lineactive = this.tdd.lines[id].visible
        var toolactive = this.tdd.lines[id].tooltip

        // hide or show the elements
        if (toolactive) {
            s3.select("#" + idtoollegend).style("opacity", this.op);
            s3.select('#' + idtool).style("opacity", 0);
        } else {
            s3.select('#' + idtool).style("opacity", 1);
            s3.select("#" + idtoollegend).style("opacity", 1);
            if (lineactive == false) {
                s3.select('#' + idtool).style("opacity", 1);
                s3.select("#" + idline).style("opacity", 1);
                s3.select("#" + idlinelegend).style("opacity", 1);
                this.tdd.lines[id].visible = !lineactive
            }
        }
        // update whether or not the elements are active
        this.tdd.lines[id].tooltip = !toolactive
    }
}


/**
 * 
 */
class Skewt extends AbstractDiagram {

    // geometry
    zoom_max = 300

    // X axis definitions
    tmin = -35
    tmax = 45
    tinc = 5
    tticks = s3.range(this.tmin - 100, this.tmax + 1, this.tinc)
    insposx = 50 // instability line position

    // Y axis definitions
    ptop = 100
    pbot = 1050
    newpbot = this.pbot // bottom pressure when zooming
    plines = [1000, 850, 700, 500, 300, 200, 100];
    pticks = [950, 900, 800, 750, 650, 600, 550, 450, 400, 350, 250, 150];
    pticks = [1050, 1000, 950, 900, 850, 800, 750, 700, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 220, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100]

    // diagram properties
    alpha = 45
    deg2rad = (Math.PI / 180)
    tan = 1. //Math.tan(this.alpha*this.deg2rad);

    // font
    ft_fontsize = 11
    bg_fontsize = 7
    ft_r = 3  // radius of tooltip points
    ft_y = 9  // height separation for text lines of ft_fontsize
    ft_x = 2  // x separation for height tooltip
    ft_w = 50 // height tooltip line width

    // background
    bg_mixing = [0.2, 0.4, 0.6, 1, 1.5, 2, 3, 4, 5, 7, 9, 12, 16, 20, 28, 36, 48, 66] // mixing ratio (g/kg)  
    bg_mixing_ptop = 250
    bg_tlines = s3.range(-120, this.tmax + 1, this.tinc)
    bg_dryad = s3.range(this.tmin, 100, 5).concat(s3.range(100, 220, 10)) // potential temperatures
    bg_psead = [-20, -16, -12, -8, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 36]
    //bg_dryad  = [30]

    // levels
    zoomlastevent = null
    arrowlenght = -50
    labeldx = -25 // label position for normal. 0 for virtual

    /**
     * 
     * @param {*} tdd 
     * @param {*} start 
     * @param {*} dims 
     * @param {*} scale 
     */
    constructor(tdd, start, dims, scale) {
        super(tdd, start, dims, scale)
        // geometry
        this.height = dims.height
        this.width = dims.width
        this.fullheight = dims.fullheight
        this.fullwidth = dims.fullwidth
        this.tinc = this.tmax - this.tmin
        this.lnpinc = Math.log(this.pbot / this.ptop)
        // build
        this.lines = tdd.lines
        this.levels = tdd.levels
        this._scale()
        this._build()
        this._axes()
        this._background()
        this._zoom()
        this._tooltips()
        //this._trace()
    }


    /** */
    _scale() {
        this.insposx = this.insposx * this.scale
        this.ft_fontsize = this.ft_fontsize * this.scale
        this.bg_fontsize = this.bg_fontsize * this.scale
        this.ft_r = this.ft_r * this.scale
        this.ft_y = this.ft_y * this.scale
        this.ft_x = this.ft_x * this.scale
        this.ft_w = this.ft_w * this.scale
    }


    /** */
    clear() {

        this.clear_parcel()

        // clear lines
        for (let l of Object.keys(this.lines).reverse()) {
            //console.log89
            s3.select('#' + l + 'line').html(null)
            //this.fttext.append("g").attr("id", l+'label')
        }
        //s3.select('#insthw').html(null)
    }


    /**
     * Plot lines and tooltips as specified in this.lines
     */
    plot() {
        // lines		
        for (let l of Object.values(this.lines)) {
            //console.log("plot line", l)
            this.line(this.tdd.s.data, l.name)
            //			if (l.visible==false){ this.hide_line(l.name)    }
            //			if (l.tooltip==false){ this.hide_tooltip(l.name) }
        }

        this.plot_ground()
        this.plot_insthw()
        this.plot_invt()
    }


    /** */
    plot_ground() {
        // color
        let classcolor = 'ground_soil'
        if (this.tdd.s.zs < 1.) classcolor = 'ground_sea'
        if (this.tdd.s.COTA < this.tdd.s.zs) classcolor = 'ground_snow'
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


    /** */
    clear_parcel() {
        s3.select('#ftlevels').html(null)
        s3.select('#dcapearea').html(null)
        s3.select('#capearea').html(null)
        s3.select('#capevarea').html(null)
        s3.select('#cinarea').html(null)
        s3.select('#cinvarea').html(null)
        s3.select('#Tlift').html(null)
        s3.select('#Tvlift').html(null)
        s3.select('#rlift').html(null)
    }


    /**
     * 
     * @param {*} parcel 
     * @param {*} lift 
     * @returns 
     */
    plot_parcel(parcel, lift) {

        this.clear_parcel()

        if (parcel == null) return
        let ad = this.tdd.s.parcels[parcel]
        if (ad === undefined) return

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


    /**
     * 
     * @param {*} ad 
     */
    plot_parcel_virtual(ad) {
        // areas
        let areas = ad.cape_sections('iTv')
        if (areas != null) {
            for (let s of areas.capes) { this.area(s, ad.ELv, 'Tv', 'T2v', 'capevarea') }
            for (let s of areas.cins) { this.area(s, ad.ELv, 'Tv', 'T2v', 'cinvarea') }
        }
        // Tv line
        this.line(ad.data, 'Tv', 'Tlift')
        this.line(ad.data, 'T2v', 'Tlift')
        // LCL point ??
        // plot r and T to LCL
        let adLCL = ad.data.filter(d => (d.p >= ad.LCL))
        this.line(adLCL, 'Td', 'rlift')
        this.line(adLCL, 'T', 'Tlift')
        // horizontal line
        let lcl = ad.closest(ad.LCL)
        let p1 = { p: lcl.p, T: lcl.T }
        let p2 = { p: lcl.p, T: lcl.Tv }
        this.line2p(p1, p2, 'Tlift')
        // dcape
        this.area(ad.dcapedata, ad.LCL, 'Tv', 'T2v', 'dcapearea')
        // levels
        this.plot_levels(ad, 'v')
    }


    /**
     * 
     * @param {*} ad 
     */
    plot_parcel_normal(ad) {
        // areas
        let areas = ad.cape_sections('iT')
        if (areas != null) {
            for (let s of areas.capes) { this.area(s, ad.EL, 'T', 'T2', 'capearea') }
            for (let s of areas.cins) { this.area(s, ad.EL, 'T', 'T2', 'cinarea') }
        }
        // T line
        this.line(ad.data, 'T', 'Tlift')
        this.line(ad.data, 'T2', 'Tlift')
        // r line
        let adLCL = ad.data.filter(d => (d.p >= ad.LCL))
        this.line(adLCL, 'Td', 'rlift')
        // dcape
        this.area(ad.dcapedata, ad.LCL, 'T', 'T2', 'dcapearea')
        // levels
        this.plot_levels(ad, '')
    }


    /**
     * Plot levels and arrows
     * Note: arrow lenght and dx attribue of the labels are rescaled in the _zoombed method.
     * font-size es scaled here with the last zoom event. Otherwise it may be created with some zoom already and in consecuence with wrong size. 
     * @param {Object} ad - adablift object
     * @param {String} type - '' for normal and 'v' for virtual parcel.
     */
    plot_levels(ad, type = '') {


        // default for normal
        let arrowlenght = this.arrowlenght
        let dx = this.labeldx

        let scale = 1.
        if (this.zoomlastevent) scale = this.zoomlastevent.transform.k

        if (type == 'v') {
            arrowlenght = -arrowlenght
            dx = 0
        }

        for (let lvl in this.levels) {
            let etq = lvl // original name to use as label
            lvl = lvl + type
            //console.log(lvl, ad[lvl], this.ft_fontsize)
            if (ad[lvl] == null) { continue }
            let lvlg = this.ftlevels.append("g").attr("id", 'level_' + lvl)
            let p = ad[lvl]
            let t = ad['T' + lvl]
            //console.log(p,t)
            lvlg.append("line")
                .attr("x1", this.skewx(t, p) + arrowlenght / scale)
                .attr("x2", this.skewx(t, p))
                .attr("y1", this.y(p))
                .attr("y2", this.y(p))
                .attr("class", "arrowline")
                .attr("marker-end", "url(#arrow)");

            lvlg.append("text")
                .attr("x", this.skewx(t, p) + arrowlenght / scale)
                .attr("y", this.y(p))
                .attr("dy", ".35em")
                .attr("dx", dx / scale)
                .style("font-size", (this.ft_fontsize / scale) + "px")
                .text(this.levels[etq]);
        }


    }


    /**
     * 
     * @param {*} data 
     * @param {*} top 
     * @param {*} param_left 
     * @param {*} param_right 
     * @param {*} cl 
     */
    area(data, top, param_left, param_right, cl = null) {
        var area = s3.area()
            .defined(d => d.p >= top)
            .y(d => this.y(d.p))
            .x0(d => this.skewx(d[param_left], d.p))
            .x1(d => this.skewx(d[param_right], d.p))

        s3.select('#' + cl).append("path")
            .data([data])
            .attr("class", cl)
            .attr("d", area)
    }


    /**
     * 
     * @param {*} ad 
     */
    plot_dcape(ad) {
        // T line
        //this.line(ad.dcapedata, 'T', 'T2')
        //this.line(ad.dcapedatav, 'T', 'T2v')

        //this.area(ad.dcapedata, ad.EL, 'T', 'T2', 'dcapearea')
        //this.area(ad.dcapedatav, ad.EL, 'T', 'T2v', 'dcapearea')
    }


    /** */
    plot_insthw() {

        this.insthw.html(null)
        for (let l of this.tdd.s.layers()) {
            if (l[1].insthw == 0) continue

            this.insthw.append("line")
                .attr("x1", this.insposx)
                .attr("x2", this.insposx)
                // .attr("y1", this.newY(l[0].p)) // debug insthw
                // .attr("y2", this.newY(l[1].p)) // debug insthw
                .attr("y1", this.y(l[0].p))
                .attr("y2", this.y(l[1].p))
                .attr("class", "insthw")
        }

        // debug insthw after zoom and new .load
        if (this.zoomlastevent) {
            let scale = this.zoomlastevent.transform.k
            this.plot_update_insthw(scale)
            //            let newx = this.skewx(this.newX.domain()[0],this.newY.domain()[1]) + this.insposx/scale
            //            this.insthw.selectAll('line')
            //                .attr("x1", newx)
            //                .attr("x2", newx)
        }
    }


    /**
     * When the diagram is zoomed and new data is loaded (.load()) the x position of insthw needs to be recalculated.
     * This function is callesd only if this.zoomlastevent exists (zoom exists)
     * Called from _zoomed and from plot_insthw.
     * @param {number} scale - scale of the event (event.transform.k)
     */
    plot_update_insthw(scale) {
        let newx = this.skewx(this.newX.domain()[0], this.newY.domain()[1]) + this.insposx / scale
        this.insthw.selectAll('line')
            .attr("x1", newx)
            .attr("x2", newx)
    }


    /** */
    plot_invt() {
        this.invt.html(null)
        for (let l of this.tdd.s.layers()) {
            if (l[1].invt == 0) continue

            let h = this.y(l[1].p) - this.y(l[0].p)
            this.invt.append('rect')
                .attr('x', 0)
                .attr('y', this.y(l[0].p))
                .attr('width', this.width)
                .attr('height', h)
                .attr('class', "invtarea")
        }
    }


    /**
     * Plot vertical line. For debug purposes  
     * @param {*} data 
     * @param {*} param 
     * @param {*} cl 
     */
    vline(data, param, cl = null) {
        cl = cl || param + 'line'
        //console.log("line", param, cl)
        if (param == 'Tf') param = 'TSn'
        s3.select('#' + cl).append("path")
            .data([data])
            .attr("class", cl)
            .attr("d", s3.line()
                .x(d => this.x(d[param], d.p))
                .y(d => this.y(d.p))
                .curve(s3.curveLinear)
            )
    }


    /**
     * 
     * @param {*} data 
     * @param {*} param 
     * @param {*} cl 
     */
    line(data, param, cl = null) {
        cl = cl || param + 'line'
        //console.log("line", param, cl)
        if (param == 'Tf') {
            param = 'TSn'

        }
        s3.select('#' + cl).append("path")
            .data([data])
            .attr("class", cl)
            .attr("d", s3.line()
                .x(d => this.skewx(d[param], d.p))
                .y(d => this.y(d.p))
                .curve(s3.curveLinear)
            )
        // DEBUG
        // this.ftlines.append("g").attr("id", cl+'point').selectAll("circle")
        // 	.data(data)			
        //       .enter().append("circle")
        //         .attr("r", 0.03)
        //         .attr("cx", d => this.skewx(d[param], d.p) ) 
        //         .attr("cy", d => this.y(d.p) )
        // 		.style("fill", "#61a3a9")
        // 		.style("opacity", 0.8)		
    }


    /**
     * 
     * @param {*} param 
     */
    hide_line(param) {
        this.lines[param].visible = false
        s3.select('#' + param + 'line').style("opacity", 0);
    }


    /**
     * 
     * @param {*} param 
     */
    hide_tooltip(param) {
        this.lines[param].tooltip = false
        s3.select('#' + param + 'label').style("opacity", 0);
    }


    /**
     * 
     * @param {*} p1 
     * @param {*} p2 
     * @param {*} cl 
     */
    line2p(p1, p2, cl = null) {
        cl = cl || 'rlift'
        s3.select('#' + cl).append("line")
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
    _build() {

        this.main = this.tdd.svg.append("g")
            .attr("id", "diag")
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
            .attr("width", this.width)
            .attr("height", this.height)
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
        this.fttext = this.ft.append("g").attr("id", "fttext")
        this.ftfix = this.ft.append("g").attr("id", "ftfix") // doesn't scale
        this.ftlines.append("g").attr("id", 'Tlift')
        this.ftlines.append("g").attr("id", 'Tvlift')
        this.ftlines.append("g").attr("id", 'rlift')

        this.insthw = this.ftlines.append("g").attr("id", 'insthw')

        for (let l of Object.keys(this.lines).reverse()) {
            this.ftlines.append("g").attr("id", l + 'line')
            this.fttext.append("g").attr("id", l + 'label')
        }
        this.ftlevels = this.fttext.append("g").attr("id", 'ftlevels')

        this.Htool = this.ftfix.append("g").attr("id", 'Hlabel')
        this.Wtool = this.ftfix.append("g").attr("id", 'Wlabel')

        this.ftareas.append("g").attr("id", 'capearea')
        this.ftareas.append("g").attr("id", 'capevarea')
        this.ftareas.append("g").attr("id", 'cinarea')
        this.ftareas.append("g").attr("id", 'cinvarea')
        this.ftareas.append("g").attr("id", 'ground')
        this.invt = this.ftareas.append("g").attr("id", 'invtarea')
        this.ftareas.append("g").attr("id", 'dcapearea')
        this.ftareas.append("g").attr("id", 'dcapevarea')

        // background group (cliped)
        this.bg = this.main.append("g").attr("id", "bg").attr("clip-path", "url(#clip)")
        this.bglines = this.bg.append("g").attr("id", "bglines") //.attr("class", "bglines")
        this.bgtext = this.bg.append("g").attr("id", "bgtext") //.attr("class", "bgtext")

        // marker
        this.defs = this.main.append("defs")
        this.defs.append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 10)
            .attr("markerHeight", 7)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("class", "arrowHead");
    }


    /** */
    _tooltips() {

        // add line tooltips
        for (let l of Object.values(this.lines)) {
            s3.select('#' + l.name + 'label').append("circle")
                .attr("r", 3)
                .attr("class", l.name + 'legend') // for the color
            s3.select('#' + l.name + 'label').append("text")
                .attr("x", l.x)
                .attr("y", l.y)
                .attr("dy", ".35em")
                .style("font-size", this.ft_fontsize + "px")
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
            .style("font-size", this.ft_fontsize + "px")
        this.Htool.append("text")
            .attr("id", "HPaLabel")
            .attr("x", this.ft_x)
            .attr("y", -this.ft_y)
            .attr("text-anchor", "start")
            .attr("dy", ".35em")
            .style("font-size", this.ft_fontsize + "px")

        // wind tooltip
        this.Wtool.append("line")
            .attr("class", "normalline")
        this.Wtool.append("text")
            .attr("id", "WmsLabel")
            .attr("x", this.width - this.ft_w)
            .attr("y", this.ft_y)
            .attr("text-anchor", "start")
            .attr("dy", ".35em")
            .style("font-size", this.ft_fontsize + "px")
        this.Wtool.append("text")
            .attr("id", "WktLabel")
            .attr("x", this.width - this.ft_w)
            .attr("y", -this.ft_y)
            .attr("text-anchor", "start")
            .attr("dy", ".35em")
            .style("font-size", this.ft_fontsize + "px")

        // events
        this.main.append("rect")
            .attr("id", "toolrect")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mousemove", this._tooltiped.bind(this))
            .on("click", this._new_parcel.bind(this))
    }


    /** */
    _new_parcel() {

        // y mouse position
        var rect = this.tdd.elem.getBoundingClientRect()
        let y = event.y - rect.top

        // closest level 
        let p = this.newY.invert(y - this.margin.top); // get y value of mouse pointer in pressure space
        let d = this.tdd.s.closest(p)

        this.tdd.new_parcel(d.p, d.T, d.r)

        // let ad = this.tdd.s.compute_parcel(d.p, d.T, d.r)
        // this.tdd.s.parcels['X'] = ad 

        // this.tdd.lgnd.parcel_change('X', true) // change control button
        // this.tdd.lgnd.plot()
    }


    /** */
    _tooltiped() {

        if (this.tdd.s == null) return

        // y mouse position
        var rect = this.tdd.elem.getBoundingClientRect()
        let y = event.y - rect.top

        // closest level 
        let p = this.newY.invert(y - this.margin.top); // get y value of mouse pointer in pressure space
        let d = this.tdd.s.closest(p)
        // set temperatures' tooltips
        for (let l in this.lines) {
            let x = l
            if (l == 'Tf') x = 'TSn'
            if (d[x] === undefined) continue
            s3.select('#' + l + 'label')
                .attr("transform", "translate(" + this.skewx(d[x], d.p) + "," + this.y(d.p) + ")")
                .select("text").text((d[x]).toFixed(1) + "°C");
        }
        // height tooltip
        this.Htool.attr("transform", "translate(0," + this.newY(d.p) + ")");
        this.Htool.select("#HmLabel").text(Math.round(d.zg) + "/" + Math.round(d.z) + " m");
        this.Htool.select("#HPaLabel").text(Math.round(d.p) + " hPa/FL" + Math.round(d.zs / Th.FT2M / 100.));
        this.Htool.select("line")
            .attr("x1", 0)
            .attr("x2", this.ft_w)
            .attr("y1", 0)
            .attr("y2", 0)

        // wind tooltip
        this.Wtool.attr("transform", "translate(0," + this.newY(d.p) + ")");
        this.Wtool.select("#WmsLabel").text(Math.round(Th.convert_wind(d.wS, "kt") * 10) / 10 + " " + "kt");
        this.Wtool.select("#WktLabel").text(Math.round(d.wS * 10) / 10 + " m/s");
        this.Wtool.select("line")
            .attr("x1", this.width)
            .attr("x2", this.width - this.ft_w)
            .attr("y1", 0)
            .attr("y2", 0)
    }


    /** */
    _zoom() {

        // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom	      
        var zoom = s3.zoom()
            .scaleExtent([1., this.zoom_max])  // This control how much you can unzoom (x1.0) and zoom (x20)
            .extent([[0, 0], [this.width, this.height]])
            .translateExtent([[0, 0], [this.width, this.height]])
            .on("zoom", this._zoomed.bind(this))

        this.main.call(zoom)
    }


    /**
     * 
     * @param {*} event 
     */
    _zoomed(event) {
        //console.log("zoomed", event.transform)

        this.zoomlastevent = event
        let newY = event.transform.rescaleY(this.y);
        this.newY = newY
        let newX = event.transform.rescaleX(this.x);
        this.newX = newX
        // adjust domain: move x scale with incT when pbot is different from the start
        this.newpbot = newY.domain()[1]
        let incT = Math.log(this.pbot / this.newpbot) * this.tinc / this.lnpinc
        newX.domain([newX.domain()[0] - incT, newX.domain()[1] - incT])
        this.axx.call(this.ax.scale(newX))
        this.ayy.call(this.ay.scale(newY))
        // update positions
        this.ftareas.attr('transform', event.transform)
        this.ftlines.attr('transform', event.transform)
        this.bglines.attr('transform', event.transform)
        this.plot_update_insthw(event.transform.k)
        // update labels, resize text, lines and points to original size
        this.fttext.attr('transform', event.transform)
        this.bgtext.attr('transform', event.transform)
        this.bgtext.selectAll('text').style("font-size", (this.bg_fontsize / event.transform.k) + "px")
        this.fttext.selectAll('text').style("font-size", (this.ft_fontsize / event.transform.k) + "px")
        this.fttext.selectAll('circle').attr("r", this.ft_r / event.transform.k)
        for (let l of Object.values(this.lines)) {
            this.fttext.select('#' + l.name + 'label').select("text")
                .attr('x', l.x / event.transform.k)
                .attr('y', l.y / event.transform.k)
        }
        // resize level arrows and reposition text
        this.ftlevels.selectAll('g').each((function(d, i, n) {
            let elem = s3.select(n[i])
            //let id    = elem.attr('id')
            //let param = id.split('_')[1]
            let line = elem.select('line')
            let text = elem.select('text')
            let dx = parseFloat(text.attr('dx'))
            let x1 = parseFloat(line.attr('x1'))
            let x2 = parseFloat(line.attr('x2'))
            let sign = Math.sign(x1 - x2)
            let newx1 = x2 - sign * this.arrowlenght / event.transform.k
            line.attr('x1', newx1)
            text.attr('x', newx1)
            if (dx != 0) text.attr('dx', this.labeldx / event.transform.k)
        }).bind(this));

        // apply zoom to wind diagram
        this.tdd.wind._zoomed(newY, event.transform)
    }


    /** Add background lines */
    _background() {

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
            .attr("x2", d => this.x(d))
            .attr("y1", 0)
            .attr("y2", this.height)
            .attr("class", function(d) { if (d == 0) { return "mediumline"; } else { return "tempbg" } })

        // mixing ratio lines
        this._bg_mixing_ratio()

        // dry adiabat lines
        this._bg_dry_adiabats()

        // pseudoadiabat lines
        this._bg_pse_adiabats()

    }


    /** Mixing ratio line */
    _bg_mixing_ratio() {


        // DEBUG: r are not straight
        this.bglines.append("g").attr("id", "bgmixing").selectAll(".mixingbg")
            .data(this.bg_mixing)
            .enter().append("path")
            .datum(d => Thlines.mixing_ratio(d, this.bg_mixing_ptop, this.pbot, 30))
            .attr("class", "mixingbg")
            .attr("d", s3.line()
                .x(d => this.skewx(d.T, d.p))
                .y(d => this.y(d.p))
                .curve(s3.curveLinear)
            )

        // this.bglines.append("g").attr("id", "bgmixing").selectAll(".mixingbg")
        // 	.data(this.bg_mixing)
        // 	.enter().append("line")
        // 	.attr("x1", r => this.skewx(t_from_prw(this.pbot,r/1000.), this.pbot) ) 
        // 	.attr("x2", r => this.skewx(t_from_prw(this.bg_mixing_ptop,r/1000.), this.bg_mixing_ptop) )
        // 	.attr("y1", this.y(this.pbot) )
        // 	.attr("y2", this.y(this.bg_mixing_ptop))
        // 	.attr("class", "mixingbg")

        this.bgtext.append("g").attr("id", "bgmixingtext").selectAll(".mixinglabel")
            .data(this.bg_mixing)
            .enter().append("text")
            //.attr("x", r => this.skewx(t_from_prw(this.pbot,r/1000.), this.pbot) )
            .attr("x", r => this.skewx(Th.t_from_prw(this.bg_mixing_ptop, r / 1000.), this.bg_mixing_ptop))
            .attr("y", this.y(this.bg_mixing_ptop))
            //.attr("y", this.y(this.pbot))
            .text(r => r)
            .attr("dy", "-.30em")
            .attr("class", "mixinglabel")
            .style("font-size", this.bg_fontsize) // overwrite class			
    }


    /** Dry adiabats */
    _bg_dry_adiabats() {

        this.bglines.append("g").attr("id", "bgdryad").selectAll(".dryadbg")
            .data(this.bg_dryad)
            .enter().append("path")
            .datum(d => Thlines.dry_adiab(d, this.ptop, 1000., 30))
            .attr("class", "dryadbg")
            .attr("d", s3.line()
                .x(d => this.skewx(d.T, d.p))
                .y(d => this.y(d.p))
                .curve(s3.curveLinear)
            )

        // DEBUG 
        // this.bglines.append("g").attr("id", "bgdryad").selectAll(".dryadbg")
        // .data(this.bg_dryad)
        // .enter().append("path")
        // 	.datum(d => Thlines.dry_adiab(d, this.ptop, this.pbot, 1000))
        // 	.attr("class", "debug")
        // 	.attr("d", s3.line()
        // 		.x(d => this.skewx(d.T, d.p) ) 
        // 		.y(d => this.y(d.p) )
        // 		.curve(s3.curveLinear)
        //     )   
    }


    /**
     * Pseudoadiabats
     * Calculate lapse rate
     */
    _bg_pse_adiabats() {

        //this.pseadrange = [32]
        let PBOT = 1000.
        let PTOP = this.ptop
        let DP = -0.3  // pressure differential 
        let TMIN = -50

        let bgpsead = this.bglines.append("g").attr("id", "bgpsead")    //.selectAll(".pseadbg")
        let bgpseadtext = this.bgtext.append("g").attr("id", "bgpseadtext") //.selectAll(".pseadlabel")

        for (let T of this.bg_psead) {

            let data = Thlines.pse_adaib(T, PBOT, PTOP, TMIN, 0.004702)

            bgpsead.append("path")
                .data([data])
                .attr("class", "pseadbg")
                .attr("d", s3.line()
                    .x(d => this.skewx(d.T, d.p))
                    .y(d => this.y(d.p))
                    .curve(s3.curveLinear)
                )

            bgpseadtext.append("text")
                .data([data.slice(-1)[0]])
                .attr('class', 'pseadlabel')
                .attr("x", d => this.skewx(d.T, d.p))
                .attr("y", d => this.y(d.p))
                .text(T)
                .attr("dx", "-.3em")
                .attr("dy", "-.3em")
                .style("font-size", this.bg_fontsize) // overwrite class		
        }
    }


    /**
     * Creates scales and axes
     */
    _axes() {
        // axes group
        this.axes = this.main.append('g').attr("id", "axes").attr("clip-path", "url(#clipfull)")

        // pressure
        this.y = s3.scaleLog()
            .range([0, this.height])
            .domain([this.ptop, this.pbot]);
        this.newY = this.y // used in tooltips

        this.ay = s3.axisLeft(this.y)
            .tickSize(0, 0)
            .tickValues(this.pticks)
            .tickFormat(s3.format(".0d"))

        this.ayy = this.axes.append('g')
            .call(this.ay);

        // temperature
        this.x = s3.scaleLinear()
            .range([0, this.width])
            .domain([this.tmin, this.tmax])

        this.ax = s3.axisBottom(this.x)
            .tickValues(this.tticks)
            .tickSize(0, 0)

        this.axx = this.axes.append('g')
            .attr("transform", "translate(0," + this.height + ")") // move the axis down
            .call(this.ax);

        // skew temperature function
        this.skewx = function(t, p) {
            return this.x(t) + (this.y(this.pbot) - this.y(p)) / this.tan;
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


    /**
     * 
     * @param {*} config 
     */
    constructor(config) {
        this.radius = Math.min(config.width, config.height) / 2;
        this.tau = 2 * Math.PI;
        this.duration = 800
        this.timer = false // ID value of the timer returned by the setTimeout() method

        this.arc = s3.arc()
            .innerRadius(this.radius * 0.5)
            .outerRadius(this.radius * 0.9)
            .startAngle(0);

        this.svg = s3.select(config.container).append("g")
            .attr("id", config.id)
            .attr("width", config.width)
            .attr("height", config.height)
            .append("g")
            .attr("transform", "translate(" + config.x + "," + config.y + ")")

        this.background = this.svg.append("path")
            .datum({ endAngle: 0.33 * this.tau })
            .style("fill", "#4D4D4D")
            .style('opacity', 0)
            .attr("d", this.arc)
        //.call(spin, duration)
    }


    /** */
    spin() {
        //console.log("spin", this.background, this.duration)
        this.background.transition()
            .ease(s3.easeLinear)
            .duration(this.duration)
            .attrTween("transform", function() {
                return s3.interpolateString("rotate(0)", "rotate(360)");
            });
        //this.timer = setTimeout( (function(){this.spin()}).bind(this), this.duration); 
    }


    /** */
    start() {
        //console.log("loader start")
        this.background.style('opacity', 1);
        if (this.timer == false) {
            this.spin()
            this.timer = setInterval((function() { this.spin() }).bind(this), this.duration);
        }
    }


    /** */
    stop() {
        //console.log("loader stop")
        this.background.style('opacity', 0);
        //clearTimeout(this.timer)
        clearInterval(this.timer)
        this.timer = false
    }
}


/** Not used so far */
var info = {
    K: { name: 'Indice K (KI)' },
    LIFT: { name: 'Indice Lifted (LI)' },
    LIFTv: { name: 'Indice Lifted (LIv)' },
    LIFT7: { name: 'Indice Lifted (LI7)' },
    LIFT7v: { name: 'Indice Lifted (LI7v)' },
    SHOW: { name: 'Indice Showalter (SHI)' },
    TT: { name: 'Total de Totales (TT)' },
    DTZ75: { name: 'Gradiente Vertical de Temperatura 700-500 hPa' },
    ISOC: { name: 'Isocero del seco   (ISOC)  ' },
    ISOW: { name: 'Isocero del humedo (ISOH)' },
    COTANIE: { name: 'Cota de nieve (COTANIE)' },
    PW: { name: 'Agua precipitable hasta 300 hPa (PW)' },
    PW8: { name: 'Agua precipitable SFC-850 (PW8)' },
    PW7: { name: 'Agua precipitable 850-700 (PW7)' },
    PW5: { name: 'Agua precipitable 700-500 (PW5)' },
    MUCAPE: { name: 'CAPEv maxima por debajo de 350 hPa (MUCAPE)' },
    MUCIN: { name: 'CINv  de la burbuja mas inestable  (MUCIN)' },
    LPL: { name: 'Nivel en el que se obtiene el valor de mucape (LPL)' },
    HEFFTOP: { name: 'Capa Efectiva: altura Tope' },
    HEFFBAS: { name: 'Capa Efectiva: altura Base' },
    WSM06: { name: 'Viento medio 0-6km' },
    WDM06: { name: 'Dirección Viento medio 0-6km' },
    BUNKERSLWS: { name: 'Viento Supercelula Bunkers LM' },
    BUNKERSLWD: { name: 'Dirección Viento Supercelula Bunkers LM' },
    BUNKERSRWS: { name: 'Viento Supercelula Bunkers RM' },
    BUNKERSRWD: { name: 'Dirección Viento Supercelula Bunkers RM' },
    ciz08: { name: 'Cizalladura 0-8km (CIZ8)' },
    ciz06: { name: 'Cizalladura 0-6km (CIZ6)' },
    ciz03: { name: 'Cizalladura 0-3km (CIZ3)' },
    ciz01: { name: 'Cizalladura 0-1km (CIZ1)' },
    cizE: { name: 'Cizalladura efectiva (CIZE)' },
    SRHL1: { name: 'Helicidad relativa a la tormenta (SRH) hacia la izquierda (LM) 0-1km' },
    SRHR1: { name: 'Helicidad relativa a la tormenta (SRH) hacia la derecha   (RM) 0-1km' },
    SRHL3: { name: 'Helicidad relativa a la tormenta (SRH) hacia la izquierda (LM) 0-3km' },
    SRHR3: { name: 'Helicidad relativa a la tormenta (SRH) hacia la derecha   (RM) 0-3km' },
    SRHL13: { name: 'Helicidad relativa a la tormenta (SRH) hacia la izquierda (LM) 1-3km' },
    SRHR13: { name: 'Helicidad relativa a la tormenta (SRH) hacia la derecha   (RM) 1-3km' },
    SRHL6: { name: 'Helicidad relativa a la tormenta (SRH) hacia la izquierda (LM) 0-6km' },
    SRHR6: { name: 'Helicidad relativa a la tormenta (SRH) hacia la derecha   (RM) 0-6km' },
    ESRHL: { name: 'Helicidad Efectiva relativa a la tormenta (ESRH) hacia la izquierda (LM)' },
    ESRHR: { name: 'Helicidad Efectiva relativa a la tormenta (ESRH) hacia la derecha   (RM)' },
    SCP2L: { name: 'Parametro Compuesto de Supercelulas (Thompson, 2004) hacia la izquierda (SCP2L)' },
    SCP2R: { name: 'Parametro Compuesto de Supercelulas (Thompson, 2004) hacia la derecha   (SCP2R)' },
    // Indices relativos a la cota de nieve	
    cotanie0: { name: 'Cota de inicio de la fusion de la nieve (COTANIE0)', unit: 'm' },
    zs: { name: 'Altitud ', unit: 'm' },
    ip: { name: 'Intensidad de precipitacion (r)', unit: 'mm/h' },
    a: { name: 'Cota de nieve como funcion de r (COTANIE)', unit: 'm' },
    b: { name: 'Espesor de la capa de fusion', unit: 'm' },
    c: { name: 'Probabilidad de fusion de la nevada', unit: '%' },
    d: { name: 'Area ', unit: '' },
}

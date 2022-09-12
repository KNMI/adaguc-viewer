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





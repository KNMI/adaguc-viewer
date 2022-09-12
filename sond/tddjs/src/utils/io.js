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
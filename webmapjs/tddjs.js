const WMSVersion = {
  version100: '1.0.0',
  version111: '1.1.1',
  version130: '1.3.0'
};

class tddjs {

  constructor(element, webmapjs) {
    var _this = this;

    var enabled = true;
    var currentOptions = [];
    currentOptions.set = false;
    var data ="";

    var pointOnMapClicked = function (options) {
      console.log(d3.scaleLog());
      html = ""
      document.getElementById("info").innerHTML = html
      if (enabled == false)
        return;
      currentOptions.x = options.x;
      currentOptions.y = options.y;
      currentOptions.set = true;
      var lalo = webmapjs.getLatLongFromPixelCoord({
        x: options.x,
        y: options.y
      });
      document.getElementById("mitdd").innerHTML = "";
      var layers = webmapjs.getLayers();
      if (!isDefined(layers)) {
        $("#info").html("No valid data received:<br/>" + data);
        return;
      }
      info=webmapjs.getLayers().getFeatureInfoUrl;
      var html = "";
      //var info=webmapjs.getPointInfo({
      //   x: options.x,
      //   y: options.y 
      //});

      //Comprobamos que hay alguna capa cargada.
      if (webmapjs.layers.length == 0){
        html = "No layer: Load a valid sounding layer."
        document.getElementById("info").innerHTML = html
      } 
      let myLayer=null;
      for (let j = 0; j < webmapjs.layers.length; j++) {
        //let myLayer = webmapjs.layers[webmapjs.layers.length - j - 1];
        
        let servtxt=webmapjs.layers[webmapjs.layers.length - j - 1].service;
        if(servtxt.includes("TEMP")){
          myLayer = webmapjs.layers[webmapjs.layers.length - j - 1];
        } 
      } 
      if (myLayer!= null && myLayer.getFeatureInfoUrl !== "") {
        if (myLayer.queryable === false) {
          webmapjs.featureInfoRequestReady("Layer is not queryable.", myLayer);
        } else { 
          html =  "<img src=\"./img/ajax-loader.gif\" alt=\"Loading...\"/>";  
          document.getElementById("info").innerHTML = html; 
          getJSONdata(myLayer, webmapjs, currentOptions.x,currentOptions.y,"text/plain",function(iURL){
            if (iURL != null){ 
              //console.log("JSON",iURL);
              document.getElementById("mitdd").innerHTML = "";
              var tdd = new TDD('mitdd');
              //tdd.load("AIB",'510646','20211110','06','003');
              //tdd.load_json("AEMET_IB_TEMPS_002Z.json")
              try{ 
                tdd.load_temp(iURL);
              } catch (e){
                window.alert('Exception occured:' + e);
              }  
              html = "Profile for location [" + Math.round(lalo.x * 100) / 100 + "," + Math.round(lalo.y * 100) / 100 + "]";
              html += " - Station:" + iURL.meta.name +"<br/>";
              document.getElementById("info").innerHTML = html;
            } else {
              html = "No valid data: Click on the map to load a profile."
              document.getElementById("info").innerHTML = html;
              } 
            });
        }
      } else {
        html = "Wrong layer: Load a valid sounding layer."
        document.getElementById("info").innerHTML = html
      } 
      //Fin capturar la estacion de sondeo 
    };
    webmapjs.addListener('mouseclicked', pointOnMapClicked, true);

    var init = function () {
      element.html('<div id="info"></div><div id="mitdd"></div>');
      $("#info").html("Click on the map to load a profile.");
      //console.log('init sondeo');
      webmapjs.enableInlineGetFeatureInfo(false);
    };

    this.enable = function () {
      init();
      enabled = true;
    };
    this.disable = function () {
      enabled = false;
      webmapjs.enableInlineGetFeatureInfo(true);
      currentOptions.set = false;
    };
    this.resize = function (w, h) {
      //console.log("w=" + w);
      $("#mitdd").width(w);
      if (currentOptions.set) {
        pointOnMapClicked(currentOptions);
      }
    };
    _this.enable();
  }

}

try{
  WMJSExtApplications["Sondeo"]=tddjs;
}catch(e){}

function createXHR (){ 
  try { return new XMLHttpRequest(); } catch (e) {}
  try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch (e) {}
  try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch (e) {}
  try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch (e) {}
  try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch (e) {}
  return false;
}

function MakeHTTPRequest(fname, callbackfunction,useredirect, requestProxy) {
  if (fname.indexOf('?') === -1) {
    fname += '?';
  } else {
    fname += '&';
  }
  fname += 'rand=' + Math.random();
  function requestError (errorMessage) {
    if (errorfunction)errorfunction(errorMessage, pointer);
    else callbackfunction(undefined, pointer);
  }
  function redirRequest () {
    // Let try an alternative way: redirect using PHP
    if (useredirect === false) {
      // alert(fname);
      fname = requestProxy + 'REQUEST=' + URLEncode(fname);
      // alert(fname);
      MakeHTTPRequest(fname, callbackfunction, errorfunction, pointer, true, requestProxy);
    } else {
      requestError('status(' + xhr.status + ') to ' + fname);
    }
  }
  if (!useredirect)useredirect = false;
  try {
    var xhr = createXHR();
    xhr.open('GET', fname, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            var data = xhr.responseText;
          } catch (err) {
            requestError('Exception occured:' + err);
            return;
          }
          if (data === undefined || data === '') {
            requestError('request returned no data');
          } else {
            callbackfunction(null, xhr.response);
          }
        } else {
          window.alert("ALLI")
          redirRequest();
        }
      }
    };
    xhr.send(null);
  } catch (err) {
    window.alert("AQUI")
    redirRequest();
  }
};

function getJSONdata(layer, webmapjs, x, y, format = "text/html", callBack) {
  let request = WMJScheckURL(layer.service);
  request += "&SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=" + layer.version;
  request += "&LAYERS=" + URLEncode(layer.name);

  let baseLayers = layer.name.split(",");
  //request += "&QUERY_LAYERS=" + URLEncode(baseLayers[baseLayers.length - 1]);
  let rm=request;
  
  let req_end=""
  request += "&QUERY_LAYERS=" +'p,z,t,td,u,v' + "&INFO_FORMAT=" + "application/json";
  rm += "&QUERY_LAYERS=" +'station_name,ps,alt,station_cname' +"&INFO_FORMAT=" + "application/json";
  req_end += "&" + getBBOXandProjString(layer,webmapjs);
  req_end += "WIDTH=" + webmapjs.width;
  req_end += "&HEIGHT=" + webmapjs.height;
  if (
    layer.version === WMSVersion.version100 ||
    layer.version === WMSVersion.version111
  ) {
    req_end += "&X=" + x;
    req_end += "&Y=" + y;
  }
  if (layer.version === WMSVersion.version130) {
    req_end += "&I=" + x;
    req_end += "&J=" + y;
  }
  req_end += "&FORMAT=image/gif";
  req_end += "&STYLES=";

  try {
    req_end += "&" + webmapjs._getMapDimURL(layer);
    request += req_end;
    rm += req_end;
  } catch (e) {
    callback(null,undefined);
  }
  debug(
    '<a target="_blank" href="' + request + '">' + request + "</a>",
    false
  );
  
  let rl=layer.service+"&SERVICE=WMS&REQUEST=GetMetaData&VERSION=" + layer.version;
  rl += "&LAYERS=" + URLEncode(layer.name)
  rl += "&LAYER=z"
  rl += "&FORMAT=application/json"

  

  getMeta(rm,function(meta) {
    if (meta != null){
      //console.log("META",meta)
      //callBack(meta)
      //console.log("META",meta);
      getData(rl,request,function(dat) {
        if (dat != null ){
          let tJson={"meta":meta,"data":dat}; 
          callBack(tJson)
        } 
      } )
    } else{
      console.log("no valid data");
      callBack(null);
    }  
  } );
  //return request;
}

function WMJScheckURL(url) {
  if (!isDefined(url)) return '?';
  url = url.trim();
  if (url.indexOf('?') === -1) {
    url += '?';
  }
  return url;
};

function isDefined(variable) {
  if (typeof variable === 'undefined') {
    return false;
  }
  return true;
};

function URLEncode(plaintext) {
  if (!plaintext) return plaintext;
  if (plaintext === undefined) return plaintext;
  if (plaintext === '') return plaintext;
  if (typeof (plaintext) !== 'string') return plaintext;
  var SAFECHARS = '0123456789' + // Numeric
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + // Alphabetic
      'abcdefghijklmnopqrstuvwxyz' +
      "%-_.!~*'()"; // RFC2396 Mark characters
  var HEX = '0123456789ABCDEF';

  plaintext = plaintext.replace(/%/g, '%25');
  plaintext = plaintext.replace(/\+/g, '%2B');
  plaintext = plaintext.replace(/ /g, '%20');
  plaintext = plaintext.replace(/\^/g, '%5E');
  plaintext = plaintext.replace(/&/g, '%26');
  plaintext = plaintext.replace(/\?/g, '%3F');
  plaintext = plaintext.replace(/>/g, '%3E');
  plaintext = plaintext.replace(/</g, '%3C');
  plaintext = plaintext.replace(/\\/g, '%5C');

  var encoded = '';
  for (var i = 0; i < plaintext.length; i++) {
    var ch = plaintext.charAt(i);
    if (ch === ' ') {
      encoded += '%20'; // x-www-urlencoded, rather than %20
    } else if (SAFECHARS.indexOf(ch) !== -1) {
      encoded += ch;
    } else {
      var charCode = ch.charCodeAt(0);
      if (charCode > 255) {
        alert("Unicode Character '" +
            ch +
            "' cannot be encoded using standard URL encoding.\n" +
            '(URL encoding only supports 8-bit characters.)\n' +
            'A space (+) will be substituted.');
        encoded += '+';
      } else {
        encoded += '%';
        encoded += HEX.charAt((charCode >> 4) & 0xF);
        encoded += HEX.charAt(charCode & 0xF);
      }
    }
  }
  return encoded;
};

function getBBOXandProjString(layer,webmapjs) {
  let request = "";
  if (
    layer.version === WMSVersion.version100 ||
    layer.version === WMSVersion.version111
  ) {
    request += "SRS=" + URLEncode(webmapjs.srs) + "&";
    request +=
      "BBOX=" +
      webmapjs.bbox.left +
      "," +
      webmapjs.bbox.bottom +
      "," +
      webmapjs.bbox.right +
      "," +
      webmapjs.bbox.top +
      "&";
  }
  if (layer.version === WMSVersion.version130) {
    request += "CRS=" + URLEncode(webmapjs.srs) + "&";

    if (
      webmapjs.srs === "EPSG:4326" &&
      layer.wms130bboxcompatibilitymode === false
    ) {
      request +=
        "BBOX=" +
        webmapjs.bbox.bottom +
        "," +
        webmapjs.bbox.left +
        "," +
        webmapjs.bbox.top +
        "," +
        webmapjs.bbox.right +
        "&";
    } else {
      request +=
        "BBOX=" +
        webmapjs.bbox.left +
        "," +
        webmapjs.bbox.bottom +
        "," +
        webmapjs.bbox.right +
        "," +
        webmapjs.bbox.top +
        "&";
    }
  }
  return request;
}

function getLevels(request,callback){
 // console.log("GETLEVEL",request)
  MakeHTTPRequest(request,function(err,data){

      if (err != null) {
        console.error(err);
      } else { 
        let i=data.indexOf("lev");
        let subdata=data.slice(i)
        let j=subdata.indexOf(";")
        subdata=subdata.slice(0,j)
        let arr=subdata.split("=");
        let lev=parseInt(arr[1])-1;
        //console.log("LEV",lev) 
        callback(lev)
      } 
  } );
} 

function getMeta(rm,callback){
  let request=rm;
  MakeHTTPRequest(request,function(err,data){

      if (err != null) {
        console.error(err);
      } else {  
        let meta=[]; 
        try {
          let dats=JSON.parse(data)   
          let latlon=dats[0].point.coords
          latlon=latlon.split(',')
          let lon=parseFloat(latlon[0]);
          let lat=parseFloat(latlon[1]);
          //console.log(lat,lon)
          let key=Object.keys(dats[1].data)
          let date=key.toString()
          date=date.split("T");
          let day=date[0].replaceAll("-","");
          day=parseInt(day)
          let hour=parseInt(date[1].substring(0,2));
          let station=dats[1].data[key] 
          if (station != "nodata"){
            let station_c=dats[5].data[key]  
            station += " " + station_c;
            key=Object.keys(dats[2].data)
            let ps=dats[2].data[key] 
            ps=ps/100;

            key=Object.keys(dats[3].data)
            let zs=dats[3].data[key] 
            zs=parseFloat(zs);
            //meta=[date,station,ps,zs] 
            meta={"model":"OBSERVACION","index":station,"date":day,
              "run":hour,"step":0,"lon":lon,"lat":lat,"ps":ps,"zs":zs,"name":station}
            //console.log("META",meta)
            callback(meta)
          } else {
            callback(null)
          }
        } catch(e){
          console.log(e)
          callback(null)
        }  
      } 
  } );
}


function getData(rl,request,callback){
    getLevels(rl,function(lev){
      if (lev != null){
          request += "&DIM_lev=0/" + lev;
          //console.log("LEVEL REQ",request)
      } 

        MakeHTTPRequest(request,function(err,data){
  
          if (err != null) {
            console.error(err);
          } else {  
            let datarr=[] 
            let dats=JSON.parse(data)
            let key=Object.keys(dats[0].data)
            let parr=dats[0].data 
            let zarr=dats[1].data 
            let tarr=dats[2].data
            let tdarr=dats[3].data
            let uarr=dats[4].data
            let varr=dats[5].data
            //p,z,t,td,u,v

            let keyd=Object.keys(parr[0]) 
            for (let i in parr) {
              let p=parr[i]
              let z=zarr[i]
              let t=tarr[i]
              let td=tdarr[i]
              let u=uarr[i]
              let v=varr[i]
              p=p[keyd] 
              if (p >= 999999999999.0){
                break;
              } 
              p=parseFloat(p)/100; 
              z=parseFloat(z[keyd]);  
              t=parseFloat(t[keyd])-273.15 
              td=parseFloat(td[keyd])-273.15  
              u=parseFloat(u[keyd])  
              v=parseFloat(v[keyd])  
              let j=parseInt(i)
              let dat={"n":j,"p":p,"z":z,"t":t,"td":td,"u":u,"v":v} 
              datarr.push(dat);
            };
            //console.log("DATA",dataJson)

            callback(datarr)
          } 
      } );
    });
}
 
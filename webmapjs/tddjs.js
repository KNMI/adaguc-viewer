const WMSVersion = {
  version100: '1.0.0',
  version111: '1.1.1',
  version130: '1.3.0'
};

var htmlTabS=""
var htmlTabM=""

class tddjs {

  constructor(element, webmapjs) {
    var _this = this;

    var enabled = true;
    var currentOptions = [];
    currentOptions.set = false;
    var openedSondM = false;
    var openedSondS = false;
    var wm=null;
    var ws=null;

    var pointOnMapClicked = async function (options) {
      //console.log(s3.scaleLog());

      html = ""
      if (openedSondM){
        wm.close();
        openedSondM=false;
        //cerrrar
      } 
      if (openedSondS){
        ws.close();
        openedSondS=false;
        //cerrrar
      } 
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
        html = "No layer: Load a valid layer."
        document.getElementById("info").innerHTML = html
      } else { document.getElementById("info").innerHTML = "";} 
      let myLayers=[]; 
      let sondType=""
      //let myLayer=null;
      for (let j = 0; j < webmapjs.layers.length; j++) {
        //let myLayer = webmapjs.layers[webmapjs.layers.length - j - 1];
        
        let servtxt=webmapjs.layers[webmapjs.layers.length - j - 1].service;
        let layername=webmapjs.layers[webmapjs.layers.length - j - 1].name
        if(servtxt.includes("TEMP") || layername == "sond_station" ){
          myLayers.push(webmapjs.layers[webmapjs.layers.length - j - 1])
          //myLayer = webmapjs.layers[webmapjs.layers.length - j - 1];
        } else if (servtxt.includes("ECMWF") ){
          myLayers.push(webmapjs.layers[webmapjs.layers.length - j - 1])
        } 
      } 

      if (myLayers.length==0){
        html = "No Sounding or Model Layer: Load a valid layer."
        document.getElementById("info").innerHTML = html
      } else { document.getElementById("info").innerHTML = "";} 

      
      for (let i in myLayers){
        console.log(i,myLayers.length)
        if (myLayers[i].service.includes("ECMWF")){
          let tempLayer=myLayers[i] ;
          getJSONModel(tempLayer,webmapjs,currentOptions.x,currentOptions.y,"text/plain",function(iURL){
            if (iURL != null){ 
              console.log(iURL) 
              if (iURL.data != null){  
                let meta=iURL.meta
                meta.lat=Math.round(lalo.y * 100) / 100
                meta.lon=Math.round(lalo.x * 100) / 100
                wm=window.open("sondModel.html","Sondeo MODEL", 'itemId="sondM",toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=1040,height=600')
                //console.log("WINDIW",wm)
                wm.myvarM=iURL
                openedSondM=true;
                html += "Profile for location [" + Math.round(lalo.x * 100) / 100 + "," + Math.round(lalo.y * 100) / 100 + "]";
                html += " - Model:" + iURL.meta.model +"<br/>";
                //document.getElementById("info").innerHTML = "";
                document.getElementById("info").innerHTML = html;
                document.getElementById("table").innerHTML = "";
                document.getElementById("table").innerHTML = htmlTabM;
              } else {
                html += "Profile for location [" + Math.round(lalo.x * 100) / 100 + "," + Math.round(lalo.y * 100) / 100 + "]";
                html += " - Station:" + iURL.meta.name +"<br/>";
                //document.getElementById("info").innerHTML = "";
                document.getElementById("info").innerHTML = html;
                document.getElementById("table").innerHTML = "";
                htmlTabM += "</TABLE>"
                document.getElementById("table").innerHTML = htmlTabM;
                //console.log(htmlTab)
              }  
            } else {
              html +="MOD:No valid data<br/>"
              document.getElementById("info").innerHTML = html;
            }      
          } );
        } else if (myLayers[i].service.includes("TEMP") || myLayers[i].name == "sond_station" ) {
          console.log("MYLAYER_TEXT",myLayers[i].name )
          let myLayer=myLayers[i]; 
          //console.log("LAYER",myLayer)    
          getJSONdata(myLayer, webmapjs, currentOptions.x,currentOptions.y,"text/plain",function(iURL){
            if (iURL != null){ 
              console.log(iURL) 
              if (iURL.data != null){  
                ws=window.open("sondTemp.html","Sondeo", 'itemId="sond",toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=1040,height=600')
                ws.myvar=iURL 
                //console.log("DATOS",iURL)
                openedSondS=true;
                html= ""
                html += "Profile for location [" + Math.round(lalo.x * 100) / 100 + "," + Math.round(lalo.y * 100) / 100 + "]";
                html += " - Station:" + iURL.meta.name +"<br/>";
                //document.getElementById("info").innerHTML = "";
                document.getElementById("info").innerHTML = html;
                document.getElementById("table").innerHTML = "";
                document.getElementById("table").innerHTML = htmlTabS;
              } else {
                html += "Profile for location [" + Math.round(lalo.x * 100) / 100 + "," + Math.round(lalo.y * 100) / 100 + "]";
                html += " - Station:" + iURL.meta.name +"<br/>";
                //document.getElementById("info").innerHTML = "";
                document.getElementById("info").innerHTML = html;
                document.getElementById("table").innerHTML = "";
                htmlTabS += "</TABLE>"
                document.getElementById("table").innerHTML = htmlTabS;
                //console.log(htmlTabS)
              }  
            } else {
              html +="OBS: No valid data<br/>"
              document.getElementById("info").innerHTML = html;
            }  
          });
        }  
      } 
      //Fin capturar la estacion de sondeo 
    };
    webmapjs.addListener('mouseclicked', pointOnMapClicked, true);

    var init = function () {
      //console.log("ALTO",element)
      element.html('<div id="info"></div><div id="table"></div>');
      $("#info").html("Click on the map to load a profile.<br/> A Sounding or ECMWF Model layer loaded is necessary");

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
      if (openedSondM){ 
        wm.close();
        openedSondM=false;
      } 
      if (openedSondS){ 
        ws.close();
        openedSondS=false;
      }
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

function MakeHTTPRequest_s(fname, callbackfunction,useredirect, requestProxy) {
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
      MakeHTTPRequest_s(fname, callbackfunction, errorfunction, pointer, true, requestProxy);
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
          //window.alert("ALLI")
          console.log("ERROR",fname)
          callbackfunction(null, xhr.response);
          //redirRequest();
        }
      }
    };
    xhr.send(null);
  } catch (err) {
    window.alert("AQUI")
    redirRequest();
  }
};

async function getJSONModel(layer,webmapjs,x,y,format = "text/html", callback){
  let serv=layer.service.split("=")[1]
  serv=serv.replace("&","") 
   
  document.getElementById("info").innerHTML = "Procesando<br>";
  document.getElementById("table").innerHTML = "";

  let request = WMJScheckURL(layer.service);
  request += "&SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=" + layer.version;
  request += "&LAYERS=" + URLEncode(layer.name);

  //let req_meta=WMJScheckURL(layer.service)+"&SERVICE=WMS&REQUEST=getmetadata&VERSION=" + layer.version+"&LAYER=" + URLEncode(layer.name);
  let rm=request;
  let req_end=""
  request += "&QUERY_LAYERS=" +'mean_sea_level_pressure' + "&INFO_FORMAT=" + "application/json";
  //req_meta += "&FORMAT=" + "application/json"+"&" + webmapjs._getMapDimURL(layer);;
  rm += "&QUERY_LAYERS=" +'geopotential_height,temperature,relative_humidity,wind_barbs_vectors'+"&INFO_FORMAT=" + "application/json";
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
  
  console.log("SERV",serv)
  try {
    req_end += "&" + webmapjs._getMapDimURL(layer);
    request += req_end;
    rm += req_end; 
  }  catch (e) {
    //window.errorMessage("Error al procesar una capa!")
    //console.log(webmapjs)
    callback(null,undefined);
  }
  let rl=layer.service+"&SERVICE=WMS&REQUEST=getCapabilities&VERSION=" + layer.version; 
  req_list=[] 
  getAllLevels(rl,function(levels){
     
     if (levels == null) {  
         window.errorMessage("No hay niveles!")
         callback(null)
     } else {
      levels=levels.split(",")
      //console.log("LEV",levels)
      for (let i = 0; i < levels.length; i++) { 
        let lev=levels[i]  
        let rml = rm + "&elevation=" + lev 
        req_list.push(rml)
      }
      req_list.reverse() 
      htmlTabM="<TABLE BORDER>"
      htmlTabM+= "<TR> <TD>Nivel</TD> <TD>P</TD> <TD>Z</TD> <TD>T</TD> <TD>RH</TD> <TD>U</TD> <TD>V</TD> </TR>"
      let datarr=[] 
      getMeta_Model(request,function(meta)  {
        if (meta!=null){    
          meta.model=serv   
          getDataN_Model(req_list,datarr,0,function(dat){ 
            let tJson={"meta":meta,"data":dat}; 
            callback(tJson) 
          })         
        } else {
          callback(null)
        }       
      });
     } 
  })  
} 

function getJSONdata(layer, webmapjs, x, y, format = "text/html", callBack) {
  document.getElementById("info").innerHTML = "Procesando<br>";
  document.getElementById("table").innerHTML = "";
  let request = WMJScheckURL(layer.service);
  request += "&SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=" + layer.version;
  request += "&LAYERS=" + URLEncode(layer.name);

  let baseLayers = layer.name.split(",");
  //request += "&QUERY_LAYERS=" + URLEncode(baseLayers[baseLayers.length - 1]);
  let rm=request;
  
  let req_end=""
  request += "&QUERY_LAYERS=" +'p,z,t,td,windSpd,windDir,eVSS' + "&INFO_FORMAT=" + "application/json";
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
    //window.errorMessage("Error al procesar una capa!")
    //console.log(webmapjs)
    callback(null,undefined);
  }
  debug(
    '<a target="_blank" href="' + request + '">' + request + "</a>",
    false
  );
  
  /*let rl=layer.service+"&SERVICE=WMS&REQUEST=GetMetaData&VERSION=" + layer.version;
  rl += "&LAYERS=" + URLEncode(layer.name)
  rl += "&LAYER=station_name"
  rl += "&FORMAT=application/json"
  */
  let rl=layer.service+"&SERVICE=WMS&REQUEST=getCapabilities&VERSION=" + layer.version; 
 
  getMeta(rm,function(meta) {
    if (meta != null){
      console.log("META",meta)
      getData(rl,meta,request,function(dat) {
        let tJson={"meta":meta,"data":dat}; 
        callBack(tJson)  
      } )
    } else{
      //console.log("no valid data");
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
  var parser = new ol.format.WMSCapabilities()
  fetch(request).then(function(response) {
    return response.text();
  }).then(function(text) {
    const result = parser.read(text);
    var capLayers = result.Capability.Layer.Layer
    for (let layer of capLayers) {
      if (layer.Name=='t'|| layer.Name=='temperature' ) {
        for (let dim of layer.Dimension){
          if (dim.name=="elevation" ){
            callback(dim.default)
          } 
        }  
      } 
    } 
  })
} 

function getAllLevels(request,callback){
  var parser = new ol.format.WMSCapabilities()
  fetch(request).then(function(response) {
    return response.text();
  }).then(function(text) {
    const result = parser.read(text);
    var capLayers = result.Capability.Layer.Layer
    for (let layer of capLayers) {
      if (layer.Name=='t'|| layer.Name=='temperature' ) {
        for (let dim of layer.Dimension){
          if (dim.name=="elevation" ){
            callback(dim.values)
          } 
        }  
      } 
    } 
  })
} 

function getMeta(rm,callback){
  let request=rm;
  console.log("REQ META",rm)
  MakeHTTPRequest_s(request,function(err,data){
      //console.log("AQUI",data)
      if (err != null) {
        console.error(err);
      } else {  
        let meta=[]; 
        try {
          let dats=JSON.parse(data)   
          //console.log(dats)
          let latlon=dats[0].point.coords
          latlon=latlon.split(',')
          let lon=parseFloat(latlon[0]);
          let lat=parseFloat(latlon[1]);
          //console.log(lat,lon)
          let key=Object.keys(dats[0].data)
          /*let fecha=key[0].replaceAll("-","") 
          fecha=fecha.replaceAll(":","")
          let file="AEMET_IB_TEMP_"+fecha+".nc"
          */
          let date=key.toString()
          date=date.split("T");
          let day=date[0].replaceAll("-","");
          day=parseInt(day)
          let hour=parseInt(date[1].substring(0,2));
          let station
          let ps
          let zs
          let station_c
          
          for (let i=0;i<dats.length;i++){
            //console.log(dats[i])
            if (dats[i].name=="station_name_backup" ){ 
              if (isDefined(station)) continue
              station=dats[i].data[key];   
            } 
            if (dats[i].name=="ps" ){
              if (isDefined(ps)) continue
              ps=dats[i].data[key]/100
              if (isNaN(ps)) ps=dats[i].data[0]/100
               
            } 
            if (dats[i].name=="alt" ){ 
              if (isDefined(zs)) continue 
              zs=parseFloat(dats[i].data[key])
              if (isNaN(zs)) zs=parseFloat(dats[i].data[0])
              
             }
            if (dats[i].name=="station_cname_backup" ){ 
              if (isDefined(station_c)) continue
              station_c=dats[i].data[key]} 
          } 
          
          if (isDefined(station) && (station != "nodata") ){         
            if (isNaN(zs)){
              zs=0.0
              //console.log("SOY NAN")
            } 
            //meta=[date,station,ps,zs] 
            station_c=station+" "+station_c
            meta={"model":"OBSERVACION","index":station,"date":day,
              "run":hour,"step":0,"lon":lon,"lat":lat,"ps":ps,"zs":zs,"name":station_c}
            //console.log("META",meta)
            callback(meta)
          } else {
            callback(null)
          }
        } catch(e){
          //console.log(e)
          callback(null)
        }  
      } 
  } );
}


function getData(rl,meta,request,callback){
    let  z_dim="&elevation="
      
    //console.log("ZLEV=",z_dim)
    htmlTabS="<TABLE BORDER>"
    htmlTabS+= "<TR> <TD>Nivel</TD> <TD>P</TD> <TD>Z</TD> <TD>T</TD> <TD>TD</TD> <TD>WD</TD> <TD>WS</TD> </TR>"

    getLevels(rl,function(lev){
     // console.log("LEV",lev)
      if (lev == null) {  
          window.errorMessage("No hay niveles!")
          callback(null)
      }
      let levf=parseInt(lev)
      let numCenLev=Math.floor(levf/100)
      let restoLev=levf%100
      let lev0=0
      let levn=0
      let req=[] 
      for (let i=0;i<numCenLev;i++){
        levn=lev0+99
        //console.log("De",lev0,"a",levn)
        let requestn =request + z_dim +lev0+"/" + levn;
        req.push(requestn);
        lev0=levn+1;
      } 
      levn=lev0+restoLev
      //console.log("De",lev0,"a",levn)
      let requestn =request + z_dim +lev0+"/" + levn;
      req.push(requestn);

      req=req.reverse();

      let datarr=[]
      //for (let requestn in req) { 
      getDataN(req,lev,meta,datarr,function(data){
        if (data == null) {  
            window.errorMessage("No hay niveles!")
            callback(null)
        }
        //datarr=datarr.concat(data) 
        //console.log(datarr)
        if (datarr.length == 0){
          window.alert("El sondeo no tiene datos validos para este diagrama")
          callback(null)
        } else { 
          let l=datarr.length-1;
          let plim=parseFloat(datarr[l].p)
          let pini=parseFloat(datarr[0].p)
          if (pini <= 850){
            //console.log("Ini",pini)
            window.alert("El primer nivel esta demasiado alto! - P0: " + pini +"hpa\n\n "+"El primer nivel debe ser mayor de 850hPa")
            callback(null)
          } else {  
            if (plim > 300.0){ 
              //console.log("Last",plim)
              window.alert("Ultimo nivel demasiado bajo! - Pn: " + plim +"hpa\n\n "+"El ultimo nivel debe ser menor de 300hPa")
              callback(null)
            } else{ 
          htmlTabS+="</TABLE>"
          callback(datarr)
            }
          } 
        }  
      })  
    });
}

function getDataN(req,lev,meta,datarr,callback){
  //console.log(req)
  if (req.length != 0) {  
    //console.log(req) 
    let request=req.pop()
    let lindex=request.indexOf("elevation")
    let levstr=request.slice(lindex)
    let iindex=levstr.indexOf("=")+1
    let eindex=levstr.indexOf("/")
    let lev0=levstr.slice(iindex,eindex)
    console.log("Procesando nivles",lev0,"a",parseInt(lev0)+99,"de",lev)
    $("#tableinfo").html("") 
    $("#info").html("")
    $("#table").html("")
    $("#tableM").html("")
    $("#tableS").html("")
    document.getElementById("info").innerHTML = "";
    var htmlTime =  "<img src=\"./img/ajax-loader.gif\" alt=\"Loading...\"/>";  
    document.getElementById("info").innerHTML = htmlTime;
    //document.getElementById("info").innerHTML += "Procesando niviles " + lev0 +" a "+(parseInt(lev0)+99)+" de " + lev +"<br>";
    MakeHTTPRequest_s(request,function(err,data){  
        if (err != null) {
          console.error(err);
        } else {  
          //console.log("REQ",request,"DATA",data)
          if (!data.includes("ServiceException")){
            let zs=meta.zs 
            let ps=meta.ps
            let div=100
            if (ps<150){
              div=100
            } 
            //console.log("PRESION SF",ps)
            let dats=JSON.parse(data)
            let parr
            let zarr
            let tarr
            let tdarr
            let wsarr
            let wdarr
            let eVarr
            for (dat of dats){
              if (dat.name=="p"){parr=dat.data } 
              if (dat.name=="z"){zarr=dat.data } 
              if (dat.name=="t"){tarr=dat.data } 
              if (dat.name=="td"){tdarr=dat.data } 
              if (dat.name=="windSpd"){wsarr=dat.data } 
              if (dat.name=="windDir"){wdarr=dat.data } 
              if (dat.name=="eVSS"){eVarr=dat.data }  
            } 
            //p,z,t,td,ws,wd
            let cont=parseInt(lev0)
            let fin=parr 
            if (!isDefined(parr[cont])){
              cont=cont+1
            } 
            //console.log(parr)
            let keyd=Object.keys(parr[cont]) 
            let j=datarr.length
          
            for (let i in parr) {
              let p=parr[i]
              let z=zarr[i]
              let t=tarr[i]
              let td=tdarr[i]
              let wS=wsarr[i]
              let wD=wdarr[i]

              let eVSS=eVarr[i]
              eVSS=eVSS[keyd]
              eVSS=parseFloat(eVSS) 

              p=p[keyd] 
              p=parseFloat(p)
              p=p/div
              if ((p > 999999999) || (p<0)){
                //req=[]; 
                //break;
                continue
              } 

              //if ((lev > 1000) & (eVSS < 20000)){
              //  console.log(j,eVSS,p)
              //  continue;
              //} 

              z=parseFloat(z[keyd]);
            
              //if (isNaN(z)) {
                //console.log(i,z)
              //  continue;
              //} 
              //if (z < (zs)){
                //console.log(z,"<",zs)
              //  continue;
              //} 
              
              t=parseFloat(t[keyd])
              //if (isNaN(t)){
              //  console.log(i,"NIVEL SIGW")
              //  continue;
              //} 
              t=t-273.15
              
              td=parseFloat(td[keyd])-273.15
              //if (isNaN(td)){
              // continue;
              //} 
              wS=parseFloat(wS[keyd])
              //if (ws < 0.0){
              //  continue;
              //}               
              wD=parseFloat(wD[keyd])
              let wDg=wD
              //if (wDg < 0){
              //  continue;
              //}
              wD=wD*(Math.PI / 180)
              wD=wD%(2*Math.PI)
              //if (ws < 0.0){
              //  continue;
              //} 
              //let u=(ws*Math.cos(wd/(Math.PI / 180)))*1.944
              //let v=(ws*Math.sin(wd/(Math.PI / 180)))*1.944 
              if ( (z < zs) || isNaN(t)|| isNaN(td)|| (wDg < 0) ){ continue} 
              htmlTabS += "<TR><TD>"+j+"</TD> <TD>"+p+"</TD> <TD>"+z+"</TD> <TD>"+t.toFixed(2)+"</TD> <TD>"+td.toFixed(2)+"</TD> <TD>"+wDg.toFixed(0)+"</TD> <TD>"+wS.toFixed(2)+"</TD></TR>" 
              //if ( (z < zs) || isNaN(t)|| isNaN(td)|| (wDg < 0) ){ continue} 
              
              let dat={"n":j,"p":p,"z":z,"t":t,"td":td,"wD":wD,"wS":wS} 
              j=j+1
              datarr.push(dat);
            };
            //console.log("DATA",datarr)
            //callback(datarr)
          }
        } 
    getDataN(req,lev,meta,datarr,callback)
        //callback(datarr)
    });
  } else { 
    callback(datarr)
  } 
}
 

function getMeta_Model(req,callback){ 
  let rml = req
  console.log(rml)
    MakeHTTPRequest_s(rml,function(err,data){
      if (err != null) {
        console.error(err);
      } else {
        try { 
          let dats=JSON.parse(data) 
          let timePas=Object.keys(dats[0].data)[0]
          fi=new Date(timePas).getTime();
          date=timePas.split("T");
          let day=date[0].replaceAll("-","");
          day=parseInt(day)
          let hour=parseInt(date[1].substring(0,2));  
          let ref_time=Object.keys(dats[0].data[timePas])[0]
          let ff=new Date(ref_time).getTime();
          let step=(ff-fi)/(1000*60*60)
          let ps=dats[0].data[timePas][ref_time]  
          ps=parseFloat(ps)
          //let meta={"model":"ECMWF","run":timePas,"step":ref_time} 
          meta={"model":"ECMWF","index":"MODEL","date":day,
              "run":hour,"step":step,"lon":0,"lat":0,"ps":ps,"zs":0.0,"name":"MODEL"}
          callback(meta)
        } catch(e){
          //console.log(e)
          callback(null)
        }
      }
    } ); 
}

function getDataN_Model(req_ls,datarr,i,callback){ 
  if (req_ls.length > 0) {
    rml=req_ls.pop() 
    $("#tableinfo").html("") 
    $("#info").html("")
    $("#table").html("")
    $("#tableM").html("")
    $("#tableS").html("")
    document.getElementById("info").innerHTML = "";
    var htmlTime =  "<img src=\"./img/ajax-loader.gif\" alt=\"Loading...\"/>";  
    document.getElementById("info").innerHTML = htmlTime;
    //document.getElementById("info").innerHTML += "Procesando capas del modelo "+i+"<br>";
    MakeHTTPRequest_s(rml,function(err,data){
      if (err != null) {
        console.error(err);
      } else {
        let dats=JSON.parse(data) 
        let timePas=Object.keys(dats[0].data)[0] 
        let lev= Object.keys(dats[0].data[timePas])[0] 
        let ref_time=Object.keys(dats[0].data[timePas][lev])[0]  
        let z=parseFloat(dats[0].data[timePas][lev][ref_time])  
        let t=parseFloat(dats[1].data[timePas][lev][ref_time]    )
        let RH=parseFloat(dats[2].data[timePas][lev][ref_time]  )
        let v=-1*parseFloat(dats[3].data[timePas][lev][ref_time] )
        let u=-1*parseFloat(dats[4].data[timePas][lev][ref_time])
        let p=parseFloat(lev)
        htmlTabM += "<TR><TD>"+i+"</TD> <TD>"+p+"</TD> <TD>"+z+"</TD> <TD>"+t.toFixed(2)+"</TD> <TD>"+RH.toFixed(2)+"</TD> <TD>"+u.toFixed(2)+"</TD> <TD>"+v.toFixed(2)+"</TD></TR>" 
        let dat={"n":i,"p":p,"z":z,"t":t,"RH":RH,"u":u,"v":v}
        datarr.push(dat)
        datarr.sort((a,b) => a.p - b.p)     
      }
      i++
      getDataN_Model(req_ls,datarr,i,callback)  
    });
  } else {  
    htmlTabM+="</TABLE>"
    callback(datarr)
  }  
}   
 
        
class wsond {

  constructor(tdd) {
    var TDD;
  } 
} 
 

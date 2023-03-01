const WMSVersion = {
  version100: '1.0.0',
  version111: '1.1.1',
  version130: '1.3.0'
};

var htmlTab=""

class tddjs {

  constructor(element, webmapjs) {
    var _this = this;

    var enabled = true;
    var currentOptions = [];
    currentOptions.set = false;
    var openedSond = false;
    var w=null;

    var pointOnMapClicked = function (options) {
      //console.log(s3.scaleLog());

      html = ""
      if (openedSond){
        w.close();
        openedSond=false;
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
        html = "No layer: Load a valid sounding layer."
        document.getElementById("info").innerHTML = html
      } 
      let myLayers=[]; 
      //let myLayer=null;
      for (let j = 0; j < webmapjs.layers.length; j++) {
        //let myLayer = webmapjs.layers[webmapjs.layers.length - j - 1];
        
        let servtxt=webmapjs.layers[webmapjs.layers.length - j - 1].service;
        if(servtxt.includes("TEMP")){
          myLayers.push(webmapjs.layers[webmapjs.layers.length - j - 1])
          //myLayer = webmapjs.layers[webmapjs.layers.length - j - 1];
        } 
      } 

      if (myLayers.length==0){
        html = "No Sounding Layer: Load a valid sounding layer."
        document.getElementById("info").innerHTML = html
      } 
      
      let myLayer=null;
      for (let i in myLayers){
        console.log(i,myLayers.length)
        myLayer=myLayers[i]; 
        //console.log("LAYER",myLayer) 
        if (myLayer!= null && myLayer.getFeatureInfoUrl !== "") {
          if (myLayer.queryable === false) {
            webmapjs.featureInfoRequestReady("Layer is not queryable.", myLayer);
          } else { 
            html =  "<img src=\"./img/ajax-loader.gif\" alt=\"Loading...\"/>";  
            document.getElementById("info").innerHTML = html; 
            getJSONdata(myLayer, webmapjs, currentOptions.x,currentOptions.y,"text/plain",function(iURL){
              if (iURL != null){  
                if (iURL.data != null){  
                  w=window.open("sondTemp.html","Sondeo", 'itemId="sond",toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=1040,height=600')
                  w.myvar=iURL 
                  //console.log("DATOS",iURL)
                  openedSond=true;
                  html = "Profile for location [" + Math.round(lalo.x * 100) / 100 + "," + Math.round(lalo.y * 100) / 100 + "]";
                  html += " - Station:" + iURL.meta.name +"<br/>";
                  document.getElementById("info").innerHTML = "";
                  document.getElementById("info").innerHTML = html;
                  document.getElementById("table").innerHTML = "";
                  document.getElementById("table").innerHTML = htmlTab;
                  //i=myLayers.length;
                  //break;
                } else {
                  html = "Profile for location [" + Math.round(lalo.x * 100) / 100 + "," + Math.round(lalo.y * 100) / 100 + "]";
                  html += " - Station:" + iURL.meta.name +"<br/>";
                  document.getElementById("info").innerHTML = "";
                  document.getElementById("info").innerHTML = html;
                  document.getElementById("table").innerHTML = "";
                  htmlTab += "</TABLE>"
                  document.getElementById("table").innerHTML = htmlTab;
                  //console.log(htmlTab)
                }  
              } else {
                //html = "No valid data: Click on the map to load a profile."
                html = "No valid data"
                document.getElementById("info").innerHTML = html;
              } 
              });
          }
        } else {
          html = "Wrong layer: Load a valid sounding layer."
          document.getElementById("info").innerHTML = html
        } 

      } 
      //Fin capturar la estacion de sondeo 
    };
    webmapjs.addListener('mouseclicked', pointOnMapClicked, true);

    var init = function () {
      //console.log("ALTO",element)
      element.html('<div id="info"></div><div id="table"></div>');
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
      if (openedSond){ 
        w.close();
        openedSond=false;
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
          //console.log(fname)
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
  
  let rl=layer.service+"&SERVICE=WMS&REQUEST=GetMetaData&VERSION=" + layer.version;
  rl += "&LAYERS=" + URLEncode(layer.name)
  rl += "&LAYER=station_name"
  rl += "&FORMAT=application/json"

  
  console.log("META",rm)
  console.log("DATA",rl)
  getMeta(rm,function(meta) {
    if (meta != null){
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

function getLevels(request,meta,callback){
  //console.log("REQ LEVEL",request)
  //Trampeo porque de alguna forma no lee los dataset -\o/-
  /* 
  if (!(request.includes("source")) ) {
    let server=request.split("?")
    let fields=server[1].split("&&")
    //console.log("F",fields)
    let fich=meta.file
    let req_1=server[0];
    let req_2=fields[1]; 
    let mid="source=files/TEMP/"+fich 
    request=(req_1+"?"+mid+"&"+req_2)
  }*/
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
  //console.log("REQ META",rm)
  MakeHTTPRequest(request,function(err,data){

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
          let key=Object.keys(dats[1].data)
          /*let fecha=key[0].replaceAll("-","") 
          fecha=fecha.replaceAll(":","")
          let file="AEMET_IB_TEMP_"+fecha+".nc"
          */
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
            if (isNaN(zs)){
              zs=0.0
              //console.log("SOY NAN")
            } 
            //meta=[date,station,ps,zs] 
            meta={"model":"OBSERVACION","index":station,"date":day,
              "run":hour,"step":0,"lon":lon,"lat":lat,"ps":ps,"zs":zs,"name":station}
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
    let z_dim="&DIM_lev="
    if(request.includes("files")){  
      z_dim="&elevation="
    }   
    //console.log("ZLEV=",z_dim)
    htmlTab="<TABLE BORDER>"
    htmlTab+= "<TR> <TD>Nivel</TD> <TD>P</TD> <TD>Z</TD> <TD>T</TD> <TD>TD</TD> <TD>WD</TD> <TD>WS</TD> </TR>"

    getLevels(rl,meta,function(lev){
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
          htmlTab+="</TABLE>"
          callback(datarr)
            }
          } 
        }  
      })  
    });
}

function getDataN(req,lev,meta,datarr,callback){
  if (req.length != 0) {  
    //console.log(req) 
    let request=req.pop()
    let lindex=request.indexOf("lev")
    let levstr=request.slice(lindex)
    let iindex=levstr.indexOf("=")+1
    let eindex=levstr.indexOf("/")
    let lev0=levstr.slice(iindex,eindex)
    //console.log("Procesando nivles",lev0,"a",parseInt(lev0)+99,"de",lev)
    document.getElementById("info").innerHTML += "Procesando niviles " + lev0 +" a "+(parseInt(lev0)+99)+" de " + lev +"<br>";
    MakeHTTPRequest(request,function(err,data){  
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
            console.log("PRESION SF",ps)
            let dats=JSON.parse(data)
            let key=Object.keys(dats[0].data)
            let parr=dats[0].data 
            let zarr=dats[1].data 
            let tarr=dats[2].data
            let tdarr=dats[3].data
            let wsarr=dats[4].data
            let wdarr=dats[5].data
            let eVarr=dats[6].data 
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
              if (z < (zs)){
                //console.log(z,"<",zs)
                continue;
              } 
              
              t=parseFloat(t[keyd])
              if (isNaN(t)){
              //  console.log(i,"NIVEL SIGW")
                continue;
              } 
              t=t-273.15
              
              td=parseFloat(td[keyd])-273.15
              if (isNaN(td)){
               continue;
              } 
              wS=parseFloat(wS[keyd])
              //if (ws < 0.0){
              //  continue;
              //}               
              wD=parseFloat(wD[keyd])
              let wDg=wD
              if (wDg < 0){
                continue;
              }
              wD=wD*(Math.PI / 180)
              wD=wD%(2*Math.PI)
              //if (ws < 0.0){
              //  continue;
              //} 
              //let u=(ws*Math.cos(wd/(Math.PI / 180)))*1.944
              //let v=(ws*Math.sin(wd/(Math.PI / 180)))*1.944 
              htmlTab += "<TR><TD>"+j+"</TD> <TD>"+p+"</TD> <TD>"+z+"</TD> <TD>"+t.toFixed(2)+"</TD> <TD>"+td.toFixed(2)+"</TD> <TD>"+wDg.toFixed(0)+"</TD> <TD>"+wS.toFixed(2)+"</TD></TR>" 
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
 
     
        
class wsond {

  constructor(tdd) {
    var TDD;
  } 
} 
 
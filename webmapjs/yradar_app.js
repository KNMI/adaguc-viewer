var table=""
var wmjsond

class yradar {

  constructor(element, webmapjs) {
    wmjsond=webmapjs
    var _this = this;
    var enabled = true;
    var load_time ="";  
    var currentOptions = [];
    var openedYRAD = false;
    var initLayers=[] ;
    currentOptions.set = false;
    var w=null;

    //Metodo cuando se piche en el mapa
    var pointOnMapClicked = function (options) {

      //zoomYRAD()

      if (openedYRAD){
        w.close();
        openedYRAD=false;
        //cerrrar
      } 
      var layers_YR =[]; 
      //console.log(s3.scaleLog());
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
        html = "No layer: Load a valid YRADAR layer."
        document.getElementById("info").innerHTML = html
      }
      var myLayers=[]; 
      //let myLayer=null;
      for (let j = 0; j < webmapjs.layers.length; j++) {
        //let myLayer = webmapjs.layers[webmapjs.layers.length - j - 1];
        
        let servtxt=webmapjs.layers[webmapjs.layers.length - j - 1].service;
	      if(servtxt.includes("YRAD")){
          myLayers.push(webmapjs.layers[webmapjs.layers.length - j - 1])
          //myLayer = webmapjs.layers[webmapjs.layers.length - j - 1];
        } 
      } 
    
      var myLayer=null;
      for (let i in myLayers){
        myLayer=myLayers[i]; 
        if (myLayer!= null && myLayer.getFeatureInfoUrl !== "") {
          if (myLayer.queryable === false) {
            webmapjs.featureInfoRequestReady("Layer is not queryable.", myLayer);
          } else { 
            document.getElementById("table").innerHTML = "";
            if (myLayer.name.includes("2D")) {
              layers_YR.push(myLayer)
            } else if (myLayer.name.includes("3D")) {
              layers_YR.push(myLayer)
            }
          }  
        } else {
          html = "Wrong layer: Load a valid yradar layer."
          document.getElementById("info").innerHTML = html
          if (openedYRAD){w.close()} 
        } 
      } 
      console.log("YR",layers_YR)
      if (layers_YR.length>0) { 
        w=window.open("YRADAR.html","YRADAR", 'itemId="sond",toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=800,height=600')
        for (var i=0;i<layers_YR.length;i++){
          myLayer=layers_YR[i]; 
          getCells(myLayer, webmapjs, currentOptions.x,currentOptions.y,function(htl) {
            
            if (htl!=null) {
              w.document.getElementById("info").insertAdjacentHTML('afterbegin',htl);
              w.focus();                         
            } 
          }); 
        }
        openedYRAD=true;     
      }  
    };

    var onImageRefresh = async function (options) { 

        var lays = getYRADLayers()
        if(!equals(lays,initLayers) ){
          imageRefresh()
        } 
    } 

    function equals(a,b){
      if(a.length!=b.length){return false}
      for (let i=0;i<a.length;i++){
        if(!b.includes(a[i])){return false} 
      }  
      for (let i=0;i<b.length;i++){
        if(!a.includes(b[i])){return false} 
      }
      return true
    } 

    function imageRefresh(){
      console.log("IMG REFRESH!!!")
      init()
    } 


    var onDimRefresh = async function (option){
      if(openedYRAD){w.close()} 
      $("#tableinfo").html("") 
      $("#info").html("")
      $("#table").html("")
      document.getElementById("info").innerHTML = "";
      var html =  "<img src=\"./img/ajax-loader.gif\" alt=\"Loading...\"/>";  
      document.getElementById("info").innerHTML = html;
      await new Promise(resolve => setTimeout(resolve, 500));
      dimesionRefresh() 
    }
    
    function dimesionRefresh(){
      console.log("DIM REFRESH!!!")
      init()
    } 

    function getYRADLayers(){
      var myLays=[]; 
      for (let j = 0; j < webmapjs.layers.length; j++) {   
        let servtxt=webmapjs.layers[webmapjs.layers.length - j - 1].service;
	      if(servtxt.includes("YRAD")){
          myLays.push(webmapjs.layers[webmapjs.layers.length - j - 1].name)
        } 
      }
      return myLays
    } 

    //Añadir listener para actualizar
    webmapjs.addListener('mouseclicked', pointOnMapClicked, true);
    webmapjs.addListener('ondimchange', onDimRefresh,true);
    webmapjs.addListener('onimageload', onImageRefresh,true);

    /*
      Funcion init de la clase
    */
    var init = function () {
   
      //wmjsond=webmapjs
      initLayers=getYRADLayers()

      

      element.html('<div id="tableinfo"></div><div id="info"></div><div id="table"></div>');
      $("#tableinfo").html("") 
      $("#info").html("")
      $("#table").html("")
      var html =  "<img src=\"./img/ajax-loader.gif\" alt=\"Loading...\"/>";  
      document.getElementById("info").innerHTML = html;

      var myLayers=[]; 
      //let myLayer=null;
      for (let j = 0; j < webmapjs.layers.length; j++) {
        //let myLayer = webmapjs.layers[webmapjs.layers.length - j - 1];
        
        let servtxt=webmapjs.layers[webmapjs.layers.length - j - 1].service;
	      if(servtxt.includes("YRAD")){
          myLayers.push(webmapjs.layers[webmapjs.layers.length - j - 1])
          //myLayer = webmapjs.layers[webmapjs.layers.length - j - 1];
        } 
      } 

      if (myLayers.length==0){
        html = "No YRADAR Layer: Load a valid YRADAR layer."
        document.getElementById("info").innerHTML = html
      }

      var mylayer
  
      for (let i in myLayers){
        let layer=myLayers[i]; 
        if (layer!= null && layer.getFeatureInfoUrl !== "") {
          if (layer.queryable === false) {
            webmapjs.featureInfoRequestReady("Layer is not queryable.", layer);
          } else { 
            if (layer.name.includes("2D") || layer.name.includes("3D") ){
              mylayer=myLayers[i] 
              let path=""
              let rad=mylayer.name.substr(-3,3)
              let dim="2D"
              
              if (mylayer.name.includes("3D") ){dim="3D"} 
              
              path="http://brisa.aemet.es/webtools/visor/prod/data/"
              getJSONdate(mylayer, webmapjs,"text/plain",function(date) { 
                let day=date.substring(0,date.indexOf("T"))
                let time=date.substring(date.indexOf("T")+1,date.indexOf("Z")-2)
                if (load_time != day+time){load_time = day+time}  
                if (dim=="3D"){
                  path+=day+"/yradar/"+day+time+"REG3D"
                } else {
                  if (mylayer.name.includes("NAC")){
                    path+=day+"/yradar/"+day+time+"NAC2D"
                  } else {  
                    path+=day+"/yradar/"+day+time+"REG2D"
                  }
                }
                 
                $.ajax(
    	          {
        	            url : path,
			                dataType: "text",
			                success : function (data) 
			                {
                        document.getElementById("info").innerHTML = ""; 
                        //document.getElementById("tableinfo").innerHTML = ""; 
                        let datarows=data.split(/\r?\n|\r/);
                        let table_r = "<b> RADAR: "+rad+"</b><br>"
                        if (dim=="3D"){
                          table ="<b>YRADAR3D</b><br>"
                        } else {
                          table ="<b>YRADAR2D</b><br>"
                        }
                        if ((rad != "COM") && (rad != "NAC") ) {  
                          let radrows=[] 
                          for (var i = 0; i < datarows.length; i++) {
                            if (i===0){
                              radrows.push(datarows[i])
                            } 
                            if (datarows[i].includes(rad)){
                              radrows.push(datarows[i])
                            } 
                          }
                          datarows=radrows;
                        }
                        
                        var table_e=getTable(datarows,rad,dim,webmapjs)
                        
                        $("#tableinfo").append(table+table_r+table_e);
                        $("#info").html("Click on the map to load a profile.<br>");
			                }
		            });
                
              });  
              
            } 
          }
        }
      }    
      //console.log("ALTO",element)
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
      if (openedYRAD) { 
        w.close();
        openedYRAD=false;
      } 
    };

    this.resize = function (w, h) {
      $("#mitdd").width(w);
      if (currentOptions.set) {
        pointOnMapClicked(currentOptions);
      }
    };
  

  }

}

try{
  WMJSExtApplications["Yradar"]=yradar;
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
    redirRequest();
  }
};

function getCells(myLayer, webmapjs, x, y, callBack) {
  var name=myLayer.name
  if (name.includes("2D")) { 
    getJSONdata2D(myLayer, webmapjs, x,y,"text/plain",function(yrad) {
      document.getElementById("info").innerHTML = "";
      if (yrad != null){   
        var ana=yrad["ANA"]  
        var ray=yrad["RAYOS"] 
        var mov=yrad["MOV"] 
        var html=""
        var html2D= "<br>"
        html2D += "CENTROIDE 2D <b>"+ana["ID"]+"</b> : [" + ana["LATCEN"]+  "," +ana["LONCEN"]+ "]";
                    //html += " - Station:" + iURL.meta.name +"<br/>";
                  
        var htmlTab="<TABLE BORDER>"
        htmlTab+= "<TR> <TD>ID</TD> <TD>NUPIX</TD> <TD>ZMAX</TD> <TD>ZMED</TD> <TD>RADIOE</TD> <TD>ECTOP</TD> <TD>VIL</TD> </TR>"
        htmlTab += "<TR><TD><b>"+ana["ID"] +"</b></TD> <TD>"+ana["NUPIX"]+"</TD> <TD>"+ana["ZMAX"]+"</TD> <TD>"+ana["ZMED"]+"</TD> <TD>"
                 +ana["RADIOE"]+"</TD> <TD>"+ana["ECTOP"]+"</TD> <TD>"+ana["VIL"]+"</TD></TR>"
        htmlTab += "</TABLE>"

        var htmlRAY ="<div><p><b>RAYOS TOTALES:</b>"+ray["RAY"]+"<br>"
        htmlRAY +="<b>POSITIVOS:</b>"+ray["POS"]+"<br>"
        htmlRAY +="<b>NEGATIVOS:</b>"+ray["NEG"]+"<br>"
        htmlRAY +="<b>INTRANUBE:</b>"+ray["INT"]+"<br>"
        htmlRAY +="<b>LATCENR:</b>"+ray["LATCENR"]+"<b> LONCENR:</b>"+ray["LONCENR"]+"<br>"
        htmlRAY +="<b>DISTMAX:</b>"+ray["DISTMAX"]+"<b> DISTMED:</b>"+ray["DISTMED"]+"<b> RAYOS/KM2:</b>"+ray["RY/KM"]+"<br></p>"
        htmlRAY +="</div>"

        var htmlMOV ="<div><p><b>MOVIMIENTO:</b> V(Km/h):"+mov["VKMH"]+" DIRN:"+mov["DIRN"]+"</p></div>"

        var htmlADV =""
        if (isDefined(ana["ADV"]) ){
          htmlADV ="<div><p><b>ADVERSIDAD: </b>"+ana["ADV"]+"</p></div>"
        } 

        html2D += htmlTab + htmlRAY +htmlMOV + htmlADV
        callBack(html2D)
 
      } else {
        var html2D= "<br>"
        html2D += name+ " Wrong point!!! <b>"
        callBack(html2D)
      }   
    });
  } 
  if (name.includes("3D")){
    getJSONdata3D(myLayer, webmapjs, x, y,"text/plain",function(yrad){
      document.getElementById("info").innerHTML = "";
      if (yrad != null){   
        let ana=yrad["ANA"]
        let gra=yrad["GRANIZO"] 
        let mov=yrad["MOV"] 
        var html=""
        var html3D=""
        html3D += "CENTROIDE 3D <b>"+ana["ID"]+"</b> : [" + ana["LATCEN"]+  "," +ana["LONCEN"]+ "]";
        
        var htmlTab3D="<TABLE BORDER>"
        htmlTab3D+= "<TR> <TD>ID</TD> <TD>ZMAX</TD> <TD>ESPE</TD> <TD>ECTOP</TD> <TD>DVIL</TD> <TD>DVGR</TD> <TD>HB45</TD> <TD>HBAS</TD> <TD>DVCE</TD> </TR>"
        htmlTab3D += "<TR><TD><b>"+ana["ID"] +"</b></TD> <TD>"+ana["ZMAX"]+"</TD> <TD>"+ana["ESPE"]+"</TD> <TD>"+ana["ECTOP"]+"</TD> <TD>"
                    +ana["DVIL"]+"</TD> <TD>"+ana["DVGR"]+"</TD> <TD>"+ana["HB45"]+"</TD> <TD>"+ana["HBAS"]+"</TD> <TD>"
                    +ana["DVCE"]+"</TD></TR>"
        htmlTab3D += "</TABLE>"
  
        var g=gra["GRA"]
        var color="color:#00FF00"
        if (g=="g"){ color="color:#AAAA00"} 
        if (g=="G"){ color="color:#FF0000"} 
        var htmlRAY3D ="<div><p><b>GRANIZO:</b><b style="+color+">"+g+"</b><br>"
        htmlRAY3D +="<b>ORG-PER:</b>"+gra["ORG"]+"<br>"
        htmlRAY3D +="<b>PGR:</b>"+gra["PGR"]+"<br>"
        htmlRAY3D +="<b>TAM(mm):</b>"+gra["TAM"]+"<br>"
        htmlRAY3D +="</p></div>"
  
        var adv3=parseInt(ana["ADV"])
        color="color:#00FF00"
        var adv_t="Sin Pot. Adv."
        if (adv3==1){ color="color:#AAAA00"; adv_t="Alto Pot. Adv."}
        if (adv3==2){ color="color:#FF0000"; adv_t="Muy alto Pot. Adv"}
        
        var htmlADV3D ="<div><p><b>ADVERSIDAD: </b><b style="+color+">"+adv_t+"</b><br>"
        htmlADV3D +="<b>CELULA 2D: </b>"+ parseInt(ana["N2D"])+"<br>"
        htmlADV3D +="</p></div></br>"
  
        var htmlMOV3D ="<div><p><b>MOVIMIENTO:</b></br>"
        htmlMOV3D += "<b>V(Km/h):</b>"+mov["VKMH"]+"<b> DIRN:</b>"+mov["DIRN"]+"</p></div>"
      
        html3D += htmlTab3D + htmlMOV3D + htmlRAY3D +htmlADV3D 
        callBack(html3D)
      } else {
        var html3D= "<br>"
        html3D += name+ " wrong point!!!<b>"
        callBack(html3D)
      }  
    });  
  } 
}

function getJSONdate(layer, webmapjs, format = "text/html", callBack) {
  //document.getElementById("info").innerHTML = "Procesando<br>";
  var request = WMJScheckURL(layer.service);
  request += "&SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=" + layer.version;
  request += "&LAYERs=" + URLEncode(layer.name);
  request += "&QUERY_LAYERS=" +URLEncode(layer.name) + "&INFO_FORMAT=application/json" + "&FORMAT=application/json";
  request += "&" + getBBOXandProjString(layer,webmapjs) + "&WIDTH=400";
  request += "&" + webmapjs._getMapDimURL(layer);

  MakeHTTPRequest(request,function(err,meta){
    if (err != null) {
      console.error(err);
      callBack(null)
    } else { 
      var mets=JSON.parse(meta) 
      var dats=(Object.keys(mets[0].data)[0])
      dats=dats.replaceAll(":","")
      dats=dats.replaceAll("-","")
      callBack(dats)
    }
  });
}


function getJSONdata2D(layer, webmapjs, x, y, format = "text/html", callBack) {
  document.getElementById("info").innerHTML = "Procesando<br>";
  document.getElementById("table").innerHTML = "";
  var request = WMJScheckURL(layer.service);
  request += "&SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=" + layer.version;
  request += "&LAYERS=" + URLEncode(layer.name);

  var baseLayers = layer.name.split(",");
  //request += "&QUERY_LAYERS=" + URLEncode(baseLayers[baseLayers.length - 1]);
  
  var req_end=""
  //request += "&QUERY_LAYERS=" +'YRAD2D_NAC' + "&INFO_FORMAT=" + "application/json";
  request += "&QUERY_LAYERS=" +URLEncode(layer.name) + "&INFO_FORMAT=" + "application/json";
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
  } catch (e){
    callBack(null)
  }  

  MakeHTTPRequest(request,function(err,data){
    if (err != null) {
      console.error(err);
      callBack(null)
    } else {  
      var dats=JSON.parse(data);
      var id_d
      var nupix_d
      var radioe_d
      var latcen_d
      var loncen_d
      var ectop_d
      var vil_d
      var zmax_d
      var zmed_d
      var rmax_d
      var rmed_d
      var rk_d
      var adv_d

      var ray_d
      var pos_d
      var neg_d
      var int_d
      var latcenr_d
      var loncenr_d

      var vkmh_d
      var dirn_d

      for (let i in dats){
        var dat=dats[i] 
        //Analisis
        if (dat.name=="RADIOE") { 
          if ( (!isDefined(radioe_d)) || (radioe_d[Object.keys(radioe_d)]=="nodata") ){ radioe_d=dat.data}  ;
        }   
        if (dat.name=="NUPIX") { nupix_d=dat.data} ;
        if (dat.name=="LATCEN") { latcen_d=dat.data} ;
        if (dat.name=="LONCEN") { loncen_d=dat.data} ;
        if (dat.name=="ECTOP") { ectop_d=dat.data} ;
        if (dat.name=="VIL") { vil_d=dat.data} ;
        if (dat.name=="id"){
          if ( (!isDefined(id_d)) || (id_d[Object.keys(id_d)]=="nodata") || (id_d[Object.keys(id_d)]=="nan") ) {
            id_d=dat.data 
          }
        }  
        if (dat.name=="ZMAX") {
          if ( (!isDefined(zmax_d)) || (zmax_d[Object.keys(zmax_d)]=="nodata") || (isNaN(parseFloat(zmax_d[Object.keys(zmax_d)]))) ) {
             zmax_d=dat.data;
            }  
        } 
        if (dat.name=="ZMED") { zmed_d=dat.data} ;
        if (dat.name=="ADV") { adv_d=dat.data} ;
        
        //Rayos
        if (dat.name=="RAY") { ray_d=dat.data} ;
        if (dat.name=="POS") { pos_d=dat.data} ;
        if (dat.name=="NEG") { neg_d=dat.data} ;
        if (dat.name=="RAYo") { int_d=dat.data} ;
        if (dat.name=="DISTMAX") { rmax_d=dat.data} ;
        if (dat.name=="DISTME") { rmed_d=dat.data} ;
        if (dat.name=="RY/K") { rk_d=dat.data} ;
        if (dat.name=="LATCENR") { latcenr_d=dat.data} ;
        if (dat.name=="LONCENR") { loncenr_d=dat.data} ;
        //Movimiento
        if (dat.name=="DIRN") { dirn_d=dat.data} ;
        if (dat.name=="V(KMH)") { vkmh_d=dat.data} ;
      } 
      //Analisis
      try { 
        var radioe=radioe_d[Object.keys(radioe_d)] 
        var nupix=nupix_d[Object.keys(nupix_d)]  
        if (isDefined(latcen_d)) { var latcen=latcen_d[Object.keys(latcen_d)] } 
        if (isDefined(loncen_d)) {var loncen=loncen_d[Object.keys(loncen_d)] }  
        if (isDefined(ectop_d)) {var ectop=ectop_d[Object.keys(ectop_d)] } 
        if (isDefined(vil_d)) {var vil=vil_d[Object.keys(vil_d)] } 
        var zmax=zmax_d[Object.keys(zmax_d)]  
        var zmed=zmed_d[Object.keys(zmed_d)]
      
        //Rayos
        var ray=ray_d[Object.keys(ray_d)] 
        var pos=pos_d[Object.keys(pos_d)]  
        var neg=neg_d[Object.keys(neg_d)] 
        var int=int_d[Object.keys(int_d)] 
        var rmax=rmax_d[Object.keys(rmax_d)]  
        var rmed=rmed_d[Object.keys(rmed_d)] 
        var rk=rk_d[Object.keys(rk_d)]
        if (isDefined(latcenr_d)) {var latcenr=latcenr_d[Object.keys(latcenr_d)]} 
        if (isDefined(loncenr_d)) {var loncenr=loncenr_d[Object.keys(loncenr_d)]} 
      
        //Movimiento
        if (isDefined(dirn_d)) {var dirn=dirn_d[Object.keys(dirn_d)]} 
          if (isDefined(vkmh_d)) {var vkmh=vkmh_d[Object.keys(vkmh_d)]} 

        var id=id_d[Object.keys(id_d)] 
        var analisis
        if (isDefined(adv_d)) {
          var adv=adv_d[Object.keys(adv_d)]
          analisis={"LATCEN":latcen,"LONCEN":loncen,"ID":id,"NUPIX":nupix,"ZMAX":zmax,"ZMED":zmed,"RADIOE":radioe,"ADV":adv,"ECTOP":ectop,"VIL":vil}  
        } else {
          analisis={"LATCEN":latcen,"LONCEN":loncen,"ID":id,"NUPIX":nupix,"ZMAX":zmax,"ZMED":zmed,"RADIOE":radioe,"ECTOP":ectop,"VIL":vil}  
        }   
        var rayos={"RAY":ray,"POS":pos,"NEG":neg,"INT":int,"DISTMAX":rmax,"DISTMED":rmed,"RY/KM":rk,"LATCENR":latcenr,"LONCENR":loncenr}

        var mov={"DIRN":dirn,"VKMH":vkmh} 
        var yradar_l={"ANA":analisis,"RAYOS":rayos,"MOV":mov}
        callBack(yradar_l)
      } catch (e) {
        console.log(e)
        callBack(null)
      }  
    } 
  } );
 
  debug(
    '<a target="_blank" href="' + request + '">' + request + "</a>",
    false
  );
  //return request;
}

function getJSONdata3D(layer, webmapjs, x, y, format = "text/html", callBack) {

  document.getElementById("info").innerHTML = "Procesando<br>";
  document.getElementById("table").innerHTML = "";
  var request = WMJScheckURL(layer.service);
  request += "&SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=" + layer.version;
  request += "&LAYERS=" + URLEncode(layer.name);

  var baseLayers = layer.name.split(",");
  //request += "&QUERY_LAYERS=" + URLEncode(baseLayers[baseLayers.length - 1]);
  
  var req_end=""
  //request += "&QUERY_LAYERS=" +'YRAD2D_NAC' + "&INFO_FORMAT=" + "application/json";
  request += "&QUERY_LAYERS=" +URLEncode(layer.name) + "&INFO_FORMAT=" + "application/json";
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
  } catch (e){
    callBack(null)
  }  

  MakeHTTPRequest(request,function(err,data){
    if (err != null) {
      console.error(err);
      callBack(null)
    } else {
      var dats=JSON.parse(data);
      var id_d
      var dvce_d
      var dvgr_d
      var latcen_d
      var loncen_d
      var ectop_d
      var dvil_d
      var espe_d
      var gra_d
      var hb45_d
      var hbas_d
      var zmax_d
      var adv_d
      var n2d_d

      var vkmh_d
      var dirn_d

      var org_d
      var pgr_d
      var tam_d

      for (let i in dats){
        var dat=dats[i] 
        //console.log(i,dat)
        //Analisis 
        if (dat.name=="ID_backup"){id_d=dat.data}   
        if (dat.name=="LATCEN") { latcen_d=dat.data} ;
        if (dat.name=="LONCEN") { loncen_d=dat.data} ;
        if (dat.name=="DVCE") { dvce_d=dat.data} ;
        if (dat.name=="DVGR") { dvgr_d=dat.data} ;
        if (dat.name=="ECTOP") { ectop_d=dat.data} ;
        
        if (dat.name=="ESPE") {
          if ( (!isDefined(espe_d)) || (espe_d[Object.keys(espe_d)]=="nodata") ) {
            espe_d=dat.data;
            }  
        } 
        if (dat.name=="GRA") { gra_d=dat.data} ;
        if (dat.name=="HB45") { hb45_d=dat.data} ;
        if (dat.name=="HBAS") { hbas_d=dat.data} ;
        if (dat.name=="DVIL") {
          if ( (!isDefined(dvil_d)) || (dvil_d[Object.keys(dvil_d)]=="nodata") ) {
            dvil_d=dat.data;
            }  
        } 
        if (dat.name=="ZMAX") {
          if ( (!isDefined(zmax_d)) || (zmax_d[Object.keys(zmax_d)]=="nodata") || (zmax_d[Object.keys(zmax_d)]==id_d[Object.keys(id_d)] ) ) {
             zmax_d=dat.data;
            }  
        } 
        if (dat.name=="ADV") { adv_d=dat.data} ;
        if (dat.name=="NUM2D") { n2d_d=dat.data} ;
        //GRANIZO
        if (dat.name=="ORG-PER") { org_d=dat.data} ;
        if (dat.name=="PGR") { pgr_d=dat.data} ;
        if (dat.name=="TAM(mm)") { tam_d=dat.data} ;

        //Movimiento
        if (dat.name=="DIRN") { dirn_d=dat.data} ;
        if (dat.name=="V(KMH)") { vkmh_d=dat.data} ;
      } 
      //Analisis 
      try {  
        var latcen=latcen_d[Object.keys(latcen_d)] 
        var loncen=loncen_d[Object.keys(loncen_d)]
        var dvce=dvce_d[Object.keys(dvce_d)] 
        var dvgr=dvgr_d[Object.keys(dvgr_d)] 
        var ectop=ectop_d[Object.keys(ectop_d)] 
        var espe=espe_d[Object.keys(espe_d)] 
        var gra="0"
        if (isDefined(gra_d)) {gra=gra_d[Object.keys(gra_d)]}  
        var hb45=hb45_d[Object.keys(hb45_d)] 
        var hbas=hbas_d[Object.keys(hbas_d)] 
        var dvil=dvil_d[Object.keys(dvil_d)] 
        var zmax=zmax_d[Object.keys(zmax_d)]  
        var n2d="0"
        if (isDefined(n2d_d)){n2d=n2d_d[Object.keys(n2d_d)]}   
        //GRANIZO
        var org="0"
        if (isDefined(org_d)){org=org_d[Object.keys(org_d)] } 
        var pgr=pgr_d[Object.keys(pgr_d)]
        var tam=tam_d[Object.keys(tam_d)] 

        //Movimiento
        var dirn=dirn_d[Object.keys(dirn_d)] 
        var vkmh=vkmh_d[Object.keys(vkmh_d)]
      
        var id=id_d[Object.keys(id_d)] 
        var analisis
        var adv="0"
        if (isDefined(adv_d)){adv=adv_d[Object.keys(adv_d)]}  
        analisis={"LATCEN":latcen,"LONCEN":loncen,"ID":id,"DVCE":dvce,"DVGR":dvgr,"ESPE":espe,"HB45":hb45,"HBAS":hbas,"ECTOP":ectop,"DVIL":dvil,
                  "ZMAX":zmax,"N2D":n2d,"ADV":adv}  
        granizo={"GRA":gra,"ORG":org,"PGR":pgr,"TAM":tam} 

        var mov={"DIRN":dirn,"VKMH":vkmh} 
        var yradar_l={"ANA":analisis,"GRANIZO":granizo,"MOV":mov}
        callBack(yradar_l)  
      } catch  (e) {
        //console.log(e) 
        callBack(null)
      }  
    } 
  
  } );
  
  debug(
    '<a target="_blank" href="' + request + '">' + request + "</a>",
    false
  );
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

function getnum(lat,lon){
  //var webmapjs=wmjs
  console.log(wmjsond)
  console.log("PULSE!!",lat,lon,50000)
  wmjsond.calculateBoundingBoxAndZoom(lat,-1*lon,100000)
} 

function getTable(datarows,rad,dim,wmjs){
  //wmjs.calculateBoundingBoxAndZoom(0,-1*0,100000)
  var cab2D_REG=["NUM","RAD","NUPIX","ZMAX","ZMED","VIL","ZMXV","DIRN","V(KMH)","NEG","POS","RAYo","RAY","ADV"]
  var cab2D_NAC=["NUM","NUPIX","ZMAX","ZMED","VIL","DIRN","V(KMH)","NEG","POS","RAYo","RAY"] 
  var cab3D=["NUM","RAD","ZMAX","ESPE","ECTOP","DVIL","ADV","GRA"] 
  var cabLALO=["LATCEN","LONCEN"]  
  var cab2D
  
  if (dim=="2D") { 
    if (rad == "NAC"){ 
      cab2D=cab2D_NAC
    } else {
      cab2D=cab2D_REG
    }
  } else {
    cab2D=cab3D
  }  
  
  var cab_data=datarows[0].split(",")
  
  var cab_index=[]
  for (var i=0; i<cab2D.length; i++) {
    if (cab_data.includes(cab2D[i])){
      cab_index.push(cab_data.indexOf(cab2D[i]))
    } 
  } 
  
  var lalo_index=[]
  for (var i=0; i<cabLALO.length; i++) {
    if (cab_data.includes(cabLALO[i])){
      lalo_index.push(cab_data.indexOf(cabLALO[i]))
    } 
  } 

  var newrows =[] 
  var lalorows=[] 
  for (var i=0; i<datarows.length; i++) {
    var line=datarows[i].split(",")
    var new_l=[]
    var lalo_l=[ line[lalo_index[0]],line[lalo_index[1]]] 
    lalorows.push(lalo_l)
    for (var j=0;j<cab_index.length;j++) {
      new_l.push(line[cab_index[j]])
    }   
    if (isDefined(new_l[1])){  
      newrows.push(new_l)
    } 
  } 

  var table_e=""
  table_e += '<table id="my-table">';
  for (var singleRow = 0; singleRow < newrows.length; singleRow++) {
    if (singleRow === 0) {
      table_e += '<thead>';
      table_e += '<tr>';
    } else {
      table_e += '<tr>';
    }
    var rowCells = newrows[singleRow];
    var laloCells = lalorows[singleRow]
    for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
      
      if (singleRow === 0) {
        table_e += '<th>';
        table_e += rowCells[rowCell];
        table_e += '</th>';
      } else {
        if (rowCell === 0){
          table_e += '<td style="cursor:pointer;color:#00f" onclick="getnum('+laloCells[0]+','+laloCells[1]+')">';  
          //table_e += '<td style="cursor:pointer;color:#00f" onclick="wmjs.calculateBoundingBoxAndZoom('+laloCells[0]+','+-1*laloCells[1]+','+100000+')">';   
          table_e += rowCells[rowCell];
          table_e += '</td>';
        } else { 
        table_e += '<td>';     
        table_e += rowCells[rowCell];
        table_e += '</td>';
        } 
      }
    }
    if (singleRow === 0) {
      table_e += '</tr>';
      table_e += '</thead>';
      table_e += '<tbody>';
    } else {
      table_e += '</tr>';
    }
  } 
  table_e += '</tbody>';
  table_e += '</table>';

  if (newrows.length==1){table_e="<b>NO CELLS</b></br>"}
  return table_e 
}






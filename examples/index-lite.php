<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
 
  <link rel="icon" type="image/png" href="../img/adaguc-logo-favicon-16x16.png" sizes="16x16">
  <link rel="icon" type="image/png" href="../img/adaguc-logo-favicon-32x32.png" sizes="32x32">

  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>ADAGUC Viewer</title>

    <!-- Style sheets -->
  <link rel="stylesheet" href="../libs/node_modules/jquery-ui-dist/jquery-ui.css" />
  <link rel="stylesheet" type="text/css" href="../libs/extjs-4.2.1/resources/css/ext-all.css" />
  <link rel="stylesheet" type="text/css" href="../webmapjsext/WMJSExtStyles.css" /> 
  <link rel="stylesheet" type="text/css" href="../webmapjs/WMJSStyles.css" />
  <link rel="stylesheet" type="text/css" href="../webmapjs_h/WMJSTimeSelector.css" />
  <link rel="stylesheet" type="text/css" href="../webmapjs_h/WMJS_GFITimeElevation.css" />
  <link rel="stylesheet" type="text/css" href="../libs/d3/c3.css">
  <link rel="stylesheet" href="../apps/gfiapp_d3c3.css" />
  <link rel="stylesheet" href="../apps/autowms_app.css" />

  
  <!-- Configuration -->
  <script type="text/javascript" src="../config.js"></script>
  
  <script type="text/javascript" src="../libs/node_modules/moment/moment.js"></script>
  <script type="text/javascript" src="../libs/node_modules/proj4/dist/proj4.js"></script>
  <script type="text/javascript" src="../libs/node_modules/jquery/dist/jquery.min.js"></script>
  <script type="text/javascript" src="../libs/node_modules/jquery-ui-dist/jquery-ui.min.js"></script>

  <script type="text/javascript" src="../builds/WMJS.min.js"></script>
  
  <script type="text/javascript" src="../webmapjs_h/WMJSDefineGlobals.js"></script>

  <script type="text/javascript">
    
  initWMJS();
  var initializeWebMapJS=function(){
    var a = new newMap('webmap1');
    var b = new newMap('webmap2');
    var a = new newMap('webmap3');
    var b = new newMap('webmap4');
  }
  function newMap(element){
      var baseLayer = new WMJSLayer({
        service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
        name:"world_raster",
        title:"World base layer",
        format:"image/gif",
        enabled:true
        });
      var topLayer = new WMJSLayer({
        service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
        name:"world_line",
        format:"image/png",
        title:"World country borders",
        keepOnTop:true,
        enabled:true
      });

      var modisLayer=new WMJSLayer({
        service:"http://geoservices.knmi.nl/cgi-bin/MODIS_Netherlands.cgi?",
        name:"modis_250m_netherlands_8bit",
        format:"image/gif",
        title:"Modis base layer - The Netherlands",
        enabled:true,
        opacity:0.75
      });
      
      var osmLayer=new WMJSLayer({
        service:"http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?",
        name:"streetmap",
        format:"image/jpg",
        title:"ok",
        enabled:true,
        opacity:0.75
      });
      
      var naturalEarthLayer = new WMJSLayer({
        service:"http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?",
        name:"naturalearth2",
        format:"image/jpg",
        title:"ok",
        enabled:true
      });
      
      var webMapJS  = new WMJSMap(document.getElementById(element));
      
      if(element=='webmap1'){
        webMapJS.setBaseLayers([baseLayer,modisLayer,topLayer]);
      }else if(element=='webmap3'){
        webMapJS.setBaseLayers([osmLayer]);
      }else if(element=='webmap4'){
        webMapJS.setBaseLayers([naturalEarthLayer]);
      }else{
        webMapJS.setBaseLayers([baseLayer,topLayer]);
      }
     if(element=='webmap6'){
        var layer2 = new WMJSLayer({service:'http://msgcpp-ogc-realtime.knmi.nl/msgrt.cgi?',name:'lwe_precipitation_rate'});
        webMapJS.addLayer(layer2);
        layer2.setOpacity(0.6);
      }
      
      var layer = new WMJSLayer({service:'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?',name:'RADNL_OPER_R___25PCPRR_L3_COLOR'});
      layer.onReady=function(){
        //alert(layer.dimensions[0].value);
        layer.dimensions[0].defaultValue="2012-12-26T20:45:00Z";
        
        if(element=='webmap3'){
          //alert(layer.projectionProperties[9].srs);
          webMapJS.setProjection(layer.projectionProperties[9]);
        }else{
          webMapJS.setProjection(layer.projectionProperties[6]);
          if(element=='webmap4'){
            webMapJS.zoomIn();
          }
        }
        if(element=='webmap1'){
          webMapJS.setDimension('time','2012-12-26T20:45:00Z');
        }
        if(element=='webmap2'){
          webMapJS.setDimension('time','2013-01-21T07:35:00Z');
        }
         if(element=='webmap4'){
           layer.setOpacity(0.6);
          webMapJS.setDimension('time','2012-12-07T00:00:00Z');
        }
        
        //alert(webMapJS.getDimension('time'));
        webMapJS.draw();
      }
      webMapJS.addLayer(layer);
  
      //webMapJS.addControls();
     // webMapJS.draw();
    };
  </script>
</head>
<body onLoad="initializeWebMapJS()">

<table><tr><td>

<div id="webmap1" style="width:450px;height:400px;"></div>
</td><td>
<div id="webmap2" style="width:450px;height:400px;"></div>
</td></tr>
<tr><td>

<div id="webmap3" style="width:450px;height:400px;"></div>
</td><td>
<div id="webmap4" style="width:450px;height:400px;"></div>
</td></tr>
</table>
<div id="debug">t</div>
</body >
</html>

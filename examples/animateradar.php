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
    
    
    
    var initializeWebMapJS = function(){
      initWMJS();
      var a = new newMap('webmap1');
    }

    var newMap = function(element){
    
      var webMapJS  = new WMJSMap(document.getElementById(element));
      webMapJS.setBaseURL("../webmapjs");
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

      var modisLayer = new WMJSLayer({
        service:"http://geoservices.knmi.nl/cgi-bin/MODIS_Netherlands.cgi?",
        name:"modis_250m_netherlands_8bit",
        format:"image/gif",
        title:"Modis base layer - The Netherlands",
        enabled:true,
        opacity:0.75
      });
      
      var layer = new WMJSLayer({
        service:'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?',
        name:'RADNL_OPER_R___25PCPRR_L3_COLOR'
      });
      
      /*var layer = new WMJSLayer({
        service:'http://msgcpp-ogc-archive.knmi.nl/msgar.cgi?',
        name:'air_temperature_at_cloud_top'
      });*/
  
      layer.onReady = function(){
        var timeDim = layer.getDimension('time');
        webMapJS.setProjection(layer.getProjection("EPSG:28992"));  
        var dates = [];
        for(var j=0;j<48;j++){
          dates.push({name:'time', value:layer.getDimension('time').getValueForIndex((layer.getDimension('time').size() - 48) + j)});
        }
        webMapJS.setAnimationDelay(100);
        webMapJS.zoomIn();
        webMapJS.draw(dates);
        // webMapJS.draw();
      }

      webMapJS.setBaseLayers([baseLayer,modisLayer,topLayer]);
      
      webMapJS.addLayer(layer);
    
    };
  </script>
</head>
<body onLoad="initializeWebMapJS()">

<table><tr><td>

<div id="webmap1" style="width:800px;height:600px;"></div>
</td></tr>
</table>
<div id="debug"/>

<div id="divcont"/>
</body >
</html>

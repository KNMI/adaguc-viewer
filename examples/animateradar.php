<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Mapviewer</title>
  
    <!-- Proj4 -->
    <script type="text/javascript" src="../proj4js/lib/proj4js.js"></script>

    <!-- JQuery -->
    <link rel="stylesheet" href="../jquery/jquery-ui.css" />
    <script src="../jquery/jquery-1.8.3.js"></script>
    <script src="../jquery/jquery-ui.js"></script>
    <script src="../jquery/jquery.mousewheel.js"></script>
    <script src="../jquery/jquery-ui-timepicker-addon.js"></script>
    <script src="../jquery/globalize.js"></script>
    <script src="../jquery/hammer.min.js"></script>

     <!-- webmapjs -->
    <?php include 'webmapjsfiles.php'?>

  <script type="text/javascript">
    
    setBaseURL("../webmapjs");
    
    var initializeWebMapJS = function(){
      var a = new newMap('webmap1');
    }

    var newMap = function(element){
    
      var webMapJS  = new WMJSMap(document.getElementById(element));
    
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
          dates.push({name:'time', value:layer.getDimension('time').getValueForIndex(j+20)});
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

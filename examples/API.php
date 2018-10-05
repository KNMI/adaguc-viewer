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
    
    
 $( document ).ready(function() {
      initWMJS();
      var serviceURL = 'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?';

      var service = WMJSGetServiceFromStore(serviceURL);

      var failed = function(msg){
        alert(msg);
      };
      
      var showLayerInfo = function(layer){
        
        
        
        var dim = layer.dimensions[0]; // Use the first dimension 
        console.log(dim);
        var html="Available dates for "+dim.name+" with units "+dim.units+" and values "+dim.values+"<br/>First 100 dates of total "+dim.size()+" dates:<br/>";
        for(var j=0;j<100&&j<dim.size();j++){
          html+=dim.getValueForIndex(j)+"</br>";
        };

        $('#layerproperties').html(html);
      };

      var success = function(layerNames){
        console.log("layerNames obtained");
        console.log(layerNames);
        
        var layer = new WMJSLayer({service:serviceURL,name:layerNames[0],onReady:showLayerInfo});
      };

      service.getLayerNames(success,failed);
    });

  </script>
</head>
<body>
<div id="layerproperties">Loading</div>
  
</body >
</html>

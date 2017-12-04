<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Mapviewer</title>
  
    <!-- Proj4 -->
    <script type="text/javascript" src="../proj4js/lib/proj4js.js"></script>

    <!-- JQuery -->
    <link rel="stylesheet" href="../jquery/jquery-ui.css" />
    <script src="../jquery/jquery-1.12.4.min.js"></script>
    <script src="../jquery/jquery-ui.min.js"></script>
    <script src="../jquery/jquery.mousewheel.js"></script>
    <script src="../jquery/jquery-ui-timepicker-addon.js"></script>
    <script src="../jquery/globalize.js"></script>
    <script src="../jquery/hammer.min.js"></script>

     <!-- webmapjs -->
    <?php include 'webmapjsfiles.php'?>

  <script type="text/javascript">
    setBaseURL("../webmapjs");
    
 $( document ).ready(function() {
      var serviceURL = 'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?';

      var service = WMJSgetServiceFromStore(serviceURL);

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

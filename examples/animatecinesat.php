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
    var webMapJS;
    setBaseURL("../webmapjs");
    
    var initializeWebMapJS = function(){
      var a = new newMap('webmap1');
    }

    var newMap = function(element){
    
      webMapJS  = new WMJSMap(document.getElementById(element));
      webMapJS.setSize($(window).width(),$(window).height());
      var baseLayer = new WMJSLayer({
        service:"http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?",
        name:"satellite",
        title:"World base layer",
        format:"image/jpg",
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

      var layer = new WMJSLayer({
        service:'http://geoservices.knmi.nl/cgi-bin/CSService.cgi?',
        name:'24h_air_polar_subtrop'
      });
      
      layer.onReady = function(){
        var timeDim = layer.getDimension('time');
        webMapJS.setProjection(layer.getProjection("EPSG:4326"));  
        var dates = [];
        
        var timeDim = layer.getDimension('time');
        var start = timeDim.size()-20;
        if(start<0)start = 0;
        for(var j=start;j<timeDim.size();j++){
          dates.push({name:'time', value:timeDim.getValueForIndex(j)});
        }
        webMapJS.setAnimationDelay(100);
        webMapJS.draw(dates);
      }

      var nextAnimationStepEvent = function(map){
        $('#debug').html("Current: "+map.getDimension('time').getValue());
      };

      webMapJS.addListener("onnextanimationstep", nextAnimationStepEvent, true);

      webMapJS.setBaseLayers([baseLayer,topLayer]);
      
      webMapJS.addLayer(layer);
    
    };
    
    $(window).resize(function() {
      webMapJS.setSize($(window).width(),$(window).height());
    });
  </script>
</head>
<body onLoad="initializeWebMapJS()">

<div id="webmap1" style="position:absolute;top:0px;left:0px;margin:0px;padding:0px;"></div>
<div id="debug" style="position:absolute;top:0px;right:0px;z-Index:2000;background:#FFF;"/>



</body >
</html>

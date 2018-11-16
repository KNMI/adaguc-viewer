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
    $(function() {
    var webMapJS;
    
    
    var initializeWebMapJS = function(){
      var a = new newMap('webmap1');
    }

    var newMap = function(element){
    console.log(WMJSMap);
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
    initializeWebMapJS();
    });
  </script>
</head>
<body >

<div id="webmap1" style="position:absolute;top:0px;left:0px;margin:0px;padding:0px;"></div>
<div id="debug" style="position:absolute;top:0px;right:0px;z-Index:2000;background:#FFF;"/>



</body >
</html>

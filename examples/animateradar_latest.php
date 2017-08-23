<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="viewport" content="width=device-width, initial-scale=0.5, user-scalable=no">
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
 <link rel="stylesheet" href="animateradar_latest.css" />
  <script type="text/javascript">
    
    setBaseURL("../webmapjs");
    var scaleBarURL        = "http://euro4mvis.knmi.nl/adagucviewer/webmapjs/php/makeScaleBar.php?";
    var initializeWebMapJS = function(){
      var a = new newMap('webmap1');
      
    }

   
    
    var newMap = function(element){
  
        var el = document.getElementById(element);
         var webMapJS  = new WMJSMap(document.getElementById(element));
       
// $( document ).ready(function() {
//  
// 
//     webMapJS.setMapModePan();
//     webMapJS.enableInlineGetFeatureInfo(false);
//     var mc = new Hammer.Manager(document.body);
//     mc.add(new Hammer.Pan());
//     mc.add(new Hammer.Pinch());
//     mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
//     mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
//     mc.on('panstart', function(ev) { ev.preventDefault();webMapJS.mouseDown(ev.center.x,ev.center.y,ev);});
//     mc.on('panmove', function(ev) { ev.preventDefault();webMapJS.mouseMove(ev.center.x,ev.center.y,ev);});
//     mc.on('panend', function(ev) { ev.preventDefault();webMapJS.mouseUp(ev.center.x,ev.center.y,ev);});
//     mc.on('pinchstart', function(ev) {ev.preventDefault();webMapJS.pinchStart(ev.center.x,ev.center.y,ev);});
//     mc.on('pinchmove', function(ev) {ev.preventDefault();webMapJS.pinchMove(ev.center.x,ev.center.y,ev);});
//     mc.on('pinchend', function(ev) {ev.preventDefault();webMapJS.pinchEnd(ev.center.x,ev.center.y,ev);});
//  
// });
//return;
    
     
      $( window ).resize(function() {
        webMapJS.setSize($( window ).width(),$( document ).height())
        webMapJS.draw('resize');
      });
      webMapJS.setSize($( window ).width(),$( document ).height())
      var baseLayer = new WMJSLayer({
        service:"http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?",
        name:"streetmap",
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
      
      var radarlayer = new WMJSLayer({
        service:'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?',
        name:'RADNL_OPER_R___25PCPRR_L3_COLOR'
      });
      
        var layer = new WMJSLayer({
        service:'http://msgcpp-ogc-realtime.knmi.nl/msgrt.cgi?',
        name:'air_temperature_at_cloud_top',
        opacity:0.75
      });
      
      
      var currentLatestDate = undefined;
      var currentBeginDate = undefined;
      
      /**
       * Function which updates the map with the latest dates.
       */
      var updateAnimation = function(layer){
        var timeDim = layer.getDimension('time');
        var numTimeSteps = timeDim.size();
        
        if(timeDim.getValueForIndex(numTimeSteps-1) != currentLatestDate){
          currentLatestDate = timeDim.getValueForIndex(numTimeSteps-1);
          currentBeginDate = timeDim.getValueForIndex(numTimeSteps-12);
          //$('#debug').html("Latest date: "+currentLatestDate);
          
          var dates = [];
          for(var j=numTimeSteps-12;j<numTimeSteps;j++){
            dates.push({name:'time', value:timeDim.getValueForIndex(j)});
          }
          webMapJS.draw(dates);
        }
        
        setTimeout(function(){layer.parseLayer(updateAnimation,true);},10000);
      };
      
      /**
       * Callback function which can optionally be used to give info about the current animation step
       */
      var nextAnimationStepEvent = function(map){
      //console.log(map.getDimension('time'));
        //$('#debug').html("Dates: "+currentBeginDate+" till "+currentLatestDate+"<br/>"+"Current: "+map.getDimension('time').currentValue);
      };
      
      /**
       * Callback called when the layer is ready to use
       */
      radarlayer.onReady = function(layer){
        //webMapJS.setProjection({'srs':layer.getProjection("EPSG:3857"),bbox:'29109.947643979103,6500000,1190890.052356021,7200000'});
        webMapJS.setProjection(layer.getProjection("EPSG:3857"));
        webMapJS.setBBOX('314909.3659069278,6470493.345653814,859527.2396033217,7176664.533565958');
        //webMapJS.setBBOX('-540921.1566791167,6023950.180221762,2353698.88646846,7768027.240919513');  
        
        webMapJS.setAnimationDelay(200);
        //webMapJS.zoomIn(0.5);
        updateAnimation(layer);  
        layer.onReady = undefined;
        // webMapJS.draw('radarlayerready');
      };
      
      webMapJS.addListener("onnextanimationstep",nextAnimationStepEvent,true);

      webMapJS.setBaseLayers([baseLayer]);
      //webMapJS.setBaseLayers([topLayer]);
      //webMapJS.draw();
      webMapJS.addLayer(radarlayer);
    

    };
  </script>
</head>
<body onLoad="initializeWebMapJS()">
<div id="webmap1" style="width:1024px;height:768px;"></div>
</body >
</html>

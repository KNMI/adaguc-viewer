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
  
  <link rel="stylesheet" href="animateradar_latest.css" />
  
  <script type="text/javascript">
    
    
    var scaleBarURL        = "http://euro4mvis.knmi.nl/adagucviewer/webmapjs/php/makeScaleBar.php?";
    var initializeWebMapJS = function(){
      initWMJS();
      var a = new newMap('webmap1');
      
    }

   
    
    var newMap = function(element){
  
        var el = document.getElementById(element);
        var webMapJS  = new WMJSMap(document.getElementById(element));
        webMapJS.setBaseURL("../webmapjs");
       
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
        webMapJS.setSize(window.innerWidth,window.innerHeight);
        webMapJS.draw('resize');
      });
      webMapJS.setSize(window.innerWidth,window.innerHeight);
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
          console.log('drawing dates');
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

      webMapJS.setBaseLayers([baseLayer, modisLayer, topLayer]);
      //webMapJS.draw();
      webMapJS.addLayer(radarlayer);
    

    };
  </script>
</head>
<body onLoad="initializeWebMapJS()">

<div style="overflow: 'visible', width:0; height:0;" >
<div id="webmap1" ></div>

</div>
</body >
</html>

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
    
    
    
    var initializeWebMapJS = function(){
      var a = new newMap('webmap1');
    }

    var newMap = function(element){
    
      var webMapJS  = new WMJSMap(document.getElementById(element));
    
      var wmjstimecallback = function(value){
        webMapJS.setDimension("time",value);
        webMapJS.draw();
      };
      var timeselector = new WMJSTimeSelector($("#timeselector"),wmjstimecallback,32);
      webMapJS.addListener("onmapdimupdate",function(){timeselector.dimensionUpdate(webMapJS);},true);
      webMapJS.addListener("ondimchange",function(){timeselector.dimensionChange(webMapJS);},true);
      webMapJS.addListener("onimageload",function(){timeselector.loadingComplete(webMapJS);},true);
      
      timeselector.dimensionUpdate(webMapJS);
      
      
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
      
      
      var currentLatestDate = undefined;
      var currentBeginDate = undefined;
      
      /**
       * Function which updates the map with the latest dates.
       */
      var updateAnimation = function(){
        var timeDim = layer.getDimension('time');
        var numTimeSteps = timeDim.size();
        
        if(timeDim.getValueForIndex(numTimeSteps-1) != currentLatestDate){
          currentLatestDate = timeDim.getValueForIndex(numTimeSteps-1);
          currentBeginDate = timeDim.getValueForIndex(numTimeSteps-12);
          //$('#debug').html("Latest date: "+currentLatestDate);
          
          var dates = [];
          for(var j=numTimeSteps-24;j<numTimeSteps;j++){
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
        $('#debug').html("Dates: "+currentBeginDate+" till "+currentLatestDate+"<br/>"+"Current: "+map.getDimension('time').currentValue);
      };
      
      /**
       * Callback called when the layer is ready to use
       */
      layer.onReady = function(){
        webMapJS.setProjection(layer.getProjection("EPSG:28992"));  
        webMapJS.setAnimationDelay(200);
        webMapJS.zoomIn(0.5);
        updateAnimation();  
        layer.onReady = undefined;
      };
      
      
      webMapJS.addListener("ondimchange",function(){nextAnimationStepEvent(webMapJS);},true);

      webMapJS.setBaseLayers([baseLayer,modisLayer,topLayer]);
      
      webMapJS.addLayer(layer);
      

      $('#startanimation').button().click(function(){currentLatestDate="";updateAnimation();});
      $('#stopanimation').button().click(function(){webMapJS.stopAnimating();});
    
    };
  </script>
</head>
<body onLoad="initializeWebMapJS()">

<h2>Realtime weather radar above the Netherlands</h2>
<table><tr><td><div id="timeselector" style="width:300px;height:768px;border:1px solid gray;"></div></td><td>
<div id="webmap1" style="width:920px;height:768px;"></div>
</td></tr>
</table>
<div id="startanimation">Play</div><div id="stopanimation">Stop</div>

<div id="debug"/>

<div id="divcont"/>
</body >
</html>

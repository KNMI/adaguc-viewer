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

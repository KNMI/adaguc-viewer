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
    
    //Global layer variable with our radar service
    var radarLayer = new WMJSLayer({
      service:'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?',
      name:'RADNL_OPER_R___25PCPRR_L3_COLOR'
    });
  

    var newMap = function(element){
    
      //Define baselayers
      var baseLayer = new WMJSLayer({service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",name:"world_raster",title:"World base layer",format:"image/gif",enabled:true});
      var topLayer = new WMJSLayer({service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",name:"world_line",format:"image/png",title:"World country borders",keepOnTop:true,enabled:true});
      var modisLayer = new WMJSLayer({service:"http://geoservices.knmi.nl/cgi-bin/MODIS_Netherlands.cgi?",name:"modis_250m_netherlands_8bit",format:"image/gif",title:"Modis base layer - The Netherlands",enabled:true,opacity:0.75});

      //Create new webmapjs mapping element
      var webMapJS  = new WMJSMap(document.getElementById(element));

      //Callback called when the layer is ready (Getcapabilities is parsed and layers attributes are configured)
      radarLayer.onReady = function(layer){
        //Set to dutch projection
        webMapJS.setProjection(layer.getProjection("EPSG:28992"));
        
        //Create animation
        var dates = [];
        for(var j=0;j<48;j++){
          dates.push({name:'time', value:layer.getDimension('time').getValueForIndex(j+20)});
        }
        
        //Set delay and draw the animation
        webMapJS.setAnimationDelay(100);
        webMapJS.draw(dates);
      };

      //Set baselayers and add our radarlayer
      webMapJS.setBaseLayers([baseLayer,modisLayer,topLayer]);
      webMapJS.addLayer(radarLayer);
  
      //Create a service element based on our layers service
      var service = WMJSgetServiceFromStore(radarLayer.service);
      
      //Get all layernames, when ready the callback function is called with layerNames as argument
      service.getLayerNames(
        function(layerNames){
          //Create some HTML to display the layernames
          var html = '<ul>';
          for(var j=0;j<layerNames.length;j++){
            html+='<li><a href="#" onclick=setLayer(radarLayer,"'+layerNames[j]+'");>'+layerNames[j]+'</a></li>';
          }
          html += '</ul>';
          $('#availablelayers').html(html);
        }
      );
    };
    
    //Called by onclick from hyperlink
    var setLayer = function(layer,layerName){
      layer.onReady = undefined;
      layer.setName(layerName);
    };
      
  </script>
</head>
<body onLoad="initializeWebMapJS()">

<table><tr><td>

<div id="webmap1" style="width:800px;height:600px;"></div>
</td></tr>
</table>
<div id="debug"></div>

<div id="availablelayers"></div>
</body >
</html>

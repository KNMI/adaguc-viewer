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
    
    var show = function(productName){
      
      var $f = $('#webmapframe');
      var myFrame = $f[0].contentWindow;
      if(myFrame == undefined) myFrame=$f[0];
      
      myFrame.webMapJS.removeAllLayers();
      
      if(productName == 'radar'){
        var layer = new WMJSLayer({
          service:'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?',
          name:'RADNL_OPER_R___25PCPRR_L3_COLOR',
          onReady:function(l){l.zoomToLayer();l.draw();}
        });
      }
      
       if(productName == 'cot'){
        var layer = new WMJSLayer({
          service:'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?',
          name:'RADNL_OPER_R___25PCPRR_L3_COLOR',
          onReady:function(l){l.zoomToLayer();l.draw();}
        });
      }
      
      
      myFrame.webMapJS.setLayer(layer);
      
      //myFrame.webMapJS.zoomIn();  // run function
      
      
    };
  </script>
</head>
<body>

<h2>Realtime weather radar above the Netherlands</h2>
<table>
<tr><td>
<table>

<tr><td><input type="button" value="Radar" onclick="show('radar');"/></td></tr>

<tr><td><input type="button" value="Cloud Optical Thickness" onclick="show('cot');"/></td></tr>

<tr><td><input type="button" value="Precipitation" onclick="show('precip');"/></td></tr>

<tr><td><input type="button" value="Solar radiation" onclick="show('solrrad');"/></td></tr>

</table>
</td><td><iframe id="webmapframe" style="width:650px;height:350px;border:none;padding:0;margin:0" src="chooselayersframe.php"></iframe></td></tr>
</table>

<div id="debug"/>

<div id="divcont"/>
</body >
</html>

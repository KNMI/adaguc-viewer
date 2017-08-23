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
    <script src="../webmapjs/WMJS_GFITimeElevation.js"></script>
    <link rel="stylesheet" type="text/css" href="../webmapjs/WMJS_GFITimeElevation.css" />

    <!-- webmapjs -->
    <?php include 'webmapjsfiles.php'?>
<style>
body { margin: 10 }
.row, .col { overflow: hidden; position: absolute; }
.row { left: 0; right: 0; }
.col { top: 0; bottom: 0; }
.scroll-x { overflow-x: auto; }
.scroll-y { overflow-y: auto; }
</style>

<script type="text/javascript">

  setBaseURL("../webmapjs");

  var gfiWindow1,gfiWindow2;
  
  var createGFIWindow = function(elementID){
    var gfiWindow =new GFITimeElevationWindow($("#"+elementID));

    var webMapJS = gfiWindow.getWebMapJS();

    var layer = new WMJSLayer({
      service:'http://bhw485.knmi.nl:8080/cgi-bin/eprofile.cgi?',
      name:'beta_raw'
    });

    layer.onReady = function(){
      webMapJS.draw();
    }

    webMapJS.addLayer(layer);
    return gfiWindow;
  };
  
  $( document ).ready(function() {
    gfiWindow1 = createGFIWindow('gfiwindow1');
    gfiWindow1.setSize($( window ).width(),$( window ).height());
 
    
  });
  
  $( window ).resize(function() {
    gfiWindow1.setSize($( window ).width(),$( window ).height());
  });
</script>


</head>
<body >
<div id="gfiwindow1" ></div>


<div id="debug"/>

<div id="divcont"/>
</body >
</html>

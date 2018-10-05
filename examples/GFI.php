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

    
    
<style>
body { margin: 10 }
.row, .col { overflow: hidden; position: absolute; }
.row { left: 0; right: 0; }
.col { top: 0; bottom: 0; }
.scroll-x { overflow-x: auto; }
.scroll-y { overflow-y: auto; }
</style>

<script type="text/javascript">
  initWMJS();
  
  

  var gfiWindow1,gfiWindow2;
  
  var createGFIWindow = function(elementID){
    var gfiWindow =new GFITimeElevationWindow($("#"+elementID));

    var webMapJS = gfiWindow.getWebMapJS();
    webMapJS.setBaseURL("../webmapjs");
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

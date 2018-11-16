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
    
    var services = [
    'http://msgcpp-ogc-realtime.knmi.nl/msgrt.cgi?',
    'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?'
    ];
      
    var queryLayer = function(serviceURL,layerNameEncoded){
      var layerName = decodeURIComponent(layerNameEncoded);

      var showLayerInfo = function(layer){
       
        var html="<table border=1>";
        html+="<tr><td>service</td><td>"+layer.service+"</td></tr>";
        html+="<tr><td>name</td><td>"+layer.name+"</td></tr>";
        html+="<tr><td>title</td><td>"+layer.title+"</td></tr>";
        
        
        //Styles
        html+="<tr><td>styles</td><td><ul>";
        for(var j=0;j<layer.styles.length;j++){
          html+="<li>"+layer.styles[j].name+"</li>";
        }
        html+="</ul></td></tr>";
        
        //Projections
        html+="<tr><td>projections</td><td><ol>";
        for(var j=0;j<layer.projectionProperties.length;j++){
          html+="<li>"+layer.projectionProperties[j].srs;
          html+="<ul><li>bbox: "+layer.projectionProperties[j].bbox.toString()+"</li></ul>";
          html+="</li>";
        }
        html+="</ol></td></tr>";
        
        
        //Dimensions
        html+="<tr><td>dimensions</td><td><ol>";
        for(var j=0;j<layer.dimensions.length;j++){
          html+="<li>"+layer.dimensions[j].name;
          html+="<ul><li>values: "+layer.dimensions[j].values+"</li></ul>";
          html+="<ul><li>units: "+layer.dimensions[j].units+"</li></ul>";
          html+="</li>";
        }
        html+="</ol></td></tr>";
        
        html+="</table>";
        
        //var getmaprequest = serviceURL+"service=WMS&request=GetMap&format=image/png&layers="+layerName+"&width=300&height=300&srs=EPSG:4326&BBOX=-180,-90,180,90&STYLES=";
        //html+="<a href=\""+getmaprequest+"\">"+getmaprequest+"<img src=\""+getmaprequest+"\"/>";
        $('#layerproperties').html(html);
      };
      
      var layer = new WMJSLayer({service:serviceURL,name:layerName,onReady:showLayerInfo});
    };
    
    var queryService = function(serviceURL){
       $('#layers').html('<img src="../webmapjs/img/ajax-loader.gif"/>');
       $('#layerproperties').html("");
      var service = WMJSGetServiceFromStore(serviceURL);
      //Get all layernames, when ready the callback function is called with layerNames as argument
      service.getLayerNames(
        function(layerNames){
          //Create some HTML to display the layernames
          var html = '<ul>';
	  var showLayerInfo2 = function(layerInfo){
	    html+='<li><a href="#" onclick=queryLayer("'+serviceURL+'","'+URLEncode(layerInfo.name)+'");>'+layerInfo.name+'</a>' +' - '+layerInfo.title+'</li>';
         
	  };
          for(var j=0;j<layerNames.length;j++){
            new WMJSLayer({service:serviceURL,name:layerNames[j],onReady:showLayerInfo2});
          }
          
          html += '</ul>';
          $('#layers').html(html);
        
        }
      );
    };
    
    var do_onload = function(){
      var createButton = function (service){
        var test = $('<button/>',{text: service,click: function () { queryService(service); }});
        var br = $('<br/>');
        console.log("service: "+service);
        $('#services').append(test);
        $('#services').append(br);
      };

      for(var j=0;j<services.length;j++){
        createButton(services[j]);
      }

      $('#service_input').change(function() {
        createButton($('#service_input').val());
      });
    }

    //queryLayer('http://msgcpp-ogc-realtime.knmi.nl/msgrt.cgi?','thermodynamic_phase_of_cloud_water_particles_at_cloud_top_defined_by_near_infrared_radiance');
    
  </script>
</head>
<body onLoad="do_onload()">
<!-- style="width:100%; height: 100%"> -->
<div id="services"></div><br/>
<div>Add url: <input id="service_input" size="80" type="url" value=""/></div><br/>
<table >
<tr>
    <td style="vertical-align: top; width: 40%"><div id="layers"></div></td>
    <td style="vertical-align: top;">Information:<br/><div id="layerproperties">info</div></td>
</tr>
</table>

  
</body >
</html>

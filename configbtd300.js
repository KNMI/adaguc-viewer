var baseLayerConfiguration = [
  {
    service:"http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?",
    name:"topo",
    title:"NL Topo",
    enabled: true,
    format:"image/png"
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?",
    name:"naturalearth2",
    title:"World base layer Natural Earth ",
    enabled: false,
    format:"image/gif"
  }, {
    service:"http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?",
    name:"streetmap",
    title:"Open streetmap",
    enabled: false,
    format:"image/png"
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/MODIS_Netherlands.cgi?",
    name:"modis_250m_netherlands_8bit",
    title:"Static Modis image of the Netherlands",
    enabled: false,
    format:"image/png"
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"ne_10m_admin_0_countries_simplified",
    format:"image/png",
    title:"World country borders",
    enabled: false,
    keepOnTop:true
  },{
    service:"http://birdexp02.knmi.nl/cgi-bin/adaguc/btd300.cgi?",
    name:"grid1",
    format:"image/png",
    title:"Grid 1x1 degrees",
    enabled: false,
    keepOnTop:true
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"grid2x2",
    format:"image/png",
    title:"Grid 2x2 degrees",
    enabled: false,
    keepOnTop:true
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"grid5x5",
    format:"image/png",
    title:"Grid 5x5 degrees",
    enabled: false,
    keepOnTop:true
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"grid10x10",
    format:"image/png",
    title:"Grid 10x10 degrees",
    enabled: false,
    keepOnTop:true
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"nl_raster_latlon",
    format:"image/png",
    title:"KNMI baselayer of the Netherlands",
    enabled: false,
    keepOnTop:false
  },{
    service: "http://birdexp02.knmi.nl/cgi-bin/adaguc/btd300.cgi?",
    name:"btd300crosshair",
    title:"btd300crosshair",
    enabled: true,
    opacity:0.75,
    format:"image/png"
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"world_country_names",
    format:"image/png",
    title:"Country names",
    enabled: false,
    keepOnTop:true
  }
];

var defaultProjection = {srs:'EPSG:28992',bbox:'-546.226737236284,365365.10001525236,278955.6698584832,549135.460162285'};

var hashLocationNotfiyAddLayer = true;

var getFeatureInfoApplications = [
  //{name:'Time series mode',iconCls:'button_getfeatureinfo',location:'apps/gfiapp.html'},
  {name:'Time series mode C3',iconCls:'button_getfeatureinfo',location:'apps/gfiapp_d3c3.html'}
  //,{name:'Glameps application',iconCls:'button_getfeatureinfo',location:'../gfiapps/GLAMEPS_gfiapp.html'}
];

var dataChooserConfiguration = [
  {
    title:'BTD300 warning flag',
    thumbnail:'http://birdexp02.knmi.nl/adaguc/btd300/BTD-300-warningflag.png',
    service:'http://birdexp02.knmi.nl/cgi-bin/adaguc/btd300.cgi?',
    layer:'warningflag'
  },{
    title:'BTD300 warning indicator',
    thumbnail:'http://birdexp02.knmi.nl/adaguc/btd300/BTD-300-warningindicator.png',
    service:'http://birdexp02.knmi.nl/cgi-bin/adaguc/btd300.cgi?',
    layer:'warningindicator'
  },{
    title:'KNMI realtime precipitation radar',
    thumbnail:'http://birdexp02.knmi.nl/adaguc/btd300/knmi_radar_icon.png',
    service:'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?',
    layer:'RADNL_OPER_R___25PCPRR_L3_KNMI',
    opacity:0.5
  },{
    title:'MSGCPP realtime',
    thumbnail:'http://msgcpp.knmi.nl/mediawiki/images/thumb/d/d9/MSG-CPP_Screenshot-Google_Earth-cwp.png/750px-MSG-CPP_Screenshot-Google_Earth-cwp.png',
    service:'http://msgcpp-ogc-realtime.knmi.nl/msgrt.cgi?',
    layer:'lwe_precipitation_rate',
    style:'precip-blue-transparent/nearest'
  },{
    title:'MSGCPP archive',
    thumbnail:'http://msgcpp.knmi.nl/mediawiki/images/thumb/d/d9/MSG-CPP_Screenshot-Google_Earth-cwp.png/750px-MSG-CPP_Screenshot-Google_Earth-cwp.png',
    service:'http://msgcpp-ogc-archive.knmi.nl/msgar.cgi?',
    layer:'lwe_precipitation_rate',
    style:'precip-blue-transparent/nearest'
  },{
    title:'KNMI realtime KMDS observations',
    thumbnail:'http://www.knmi.nl/research/weather_observations/observations.jpg',
    service:'http://birdexp03.knmi.nl/cgi-bin/plieger/kmds.cgi?',
    layer:'10M/ta'
  },
  {
    title:'KNMI LGT KLDN LAM',
    thumbnail:'http://birdexp02.knmi.nl/adaguc/btd300/lgt.jpg',
    service:'http://birdexp02.knmi.nl/cgi-bin/adaguc/lgt.cgi?',
    layer:'LGT_NL23_LAM_05M'
  }
];

var mapTypeConfiguration = [ 
  { 
    title: 'Canvas', 
    bbox: [220000,6500000,1000000,7200000],
    srs: 'EPSG:3857',
    baselayer:{service:'http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?',name:'canvas'}
  },{ 
    title: 'Topography ', 
    bbox: [-546.226737236284,365365.10001525236,278955.6698584832,549135.460162285 ],
    srs: 'EPSG:28992',
    baselayer:{service:'http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?',name:'topo'}
  },{ 
    title: 'Aerial Mercator', 
    bbox: [220000,6500000,1000000,7200000],
    srs: 'EPSG:3857',
    baselayer:{service:'http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?',name:'satellite'}
  },{ 
    title: 'Topo Mercator ', 
    bbox: [220000,6500000,1000000,7200000],
    srs: 'EPSG:3857',
    baselayer:{service:'http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?',name:'topo'}
  }/*,{ 
    title: 'Openstreetmap NL', 
    bbox: [220000,6500000,1000000,7200000],   
    srs: 'EPSG:3857', 
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'streetmap'}
  },{ 
    title: 'MWSMap (28992)', 
    bbox: [-350000,125000,700000,900000 ],
    srs: 'EPSG:28992',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?',name:'mwsmap',format:'image/png'}
  },{ 
    title: 'World WGS84', 
    bbox: [-180,-90,180,90], 
    srs: 'EPSG:4326',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },{ 
    title: 'Robinson', 
    bbox: [-17036744.451383516,-10711364.114367772,16912038.081015453,10488456.659686875],
    srs: 'EPSG:54030',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },{ 
    title: 'World Mercator', 
    bbox: [-19000000,-19000000,19000000,19000000],
    srs: 'EPSG:3857',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },{ 
    title: 'Openstreetmap', 
    bbox: [-19000000,-19000000,19000000,19000000],   
    srs: 'EPSG:3857', 
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'streetmap'}
  },{ 
    title: 'Northern Hemisphere', 
    bbox: [-5661541.927991125,-3634073.745615984,5795287.923063262,2679445.334384017],
    srs: 'EPSG:3411',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },{ 
    title: 'Southern Hemisphere', 
    bbox: [-4589984.273212382,-2752857.546211313,5425154.657417289,2986705.2537886878],
    srs: 'EPSG:3412',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },{ 
    title: 'Europe North Pole', 
    bbox: [-13000000,-13000000,13000000,13000000],
    srs: 'EPSG:3575',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },
  
  
  
 
  
  { 
    title: 'Europe stereographic', 
    bbox: [-2776118.977564746,-6499490.259201691,9187990.785775745,971675.53185069], 
    srs: 'EPSG:32661',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  }, { 
    title: 'North America', 
    bbox: [-2015360.8716608454,-697107.5349683464,9961718.159421016,6782157.107682772],
    srs: 'EPSG:50001',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  }*/
];

    
      
//FOR JSP:
/*
var scaleBarURL        = "http://webgis.nmdc.eu/viewer2.0/webmapjs/php/makeScaleBar.php?";
var xml2jsonrequestURL = "/impactportal/AdagucViewer?SERVICE=XML2JSON&";
var requestProxy = "/impactportal/AdagucViewer?SERVICE=PROXY&";
*/

//For PHP:
var scaleBarURL        = "webmapjs/php/makeScaleBar.php?";
var requestProxy       = "webmapjs/php/MakeRequest.php?";
var xml2jsonrequestURL = "webmapjs/php/xml2jsonrequest.php?"

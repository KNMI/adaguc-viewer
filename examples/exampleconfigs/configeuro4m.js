var baseLayerConfiguration = [
  {
    service: "https://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name: "world_raster",
    title: "World base layer",
    enabled: true,
    format: "image/gif",
  },
  {
    service: "https://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name: "world_line",
    format: "image/png",
    title: "World country borders",
    enabled: true,
    keepOnTop: true,
  },
];

var dataChooserConfiguration = [
  {
    title: "KNMI realtime precipitation radar",
    thumbnail:
      "http://adaguc.knmi.nl/contents/webservices/RADNL_OPER_R___25PCPRR_L3.jpg",
    service:
      "https://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?",
    layer: "RADNL_OPER_R___25PCPRR_L3_COLOR",
    srs: "EPSG:3857",
    bbox: "220000,6500000,1000000,7200000",
    baselayerservice:
      "https://geoservices.knmi.nl/cgi-bin/MODIS_Netherlands.cgi?",
    baselayername: "modis_250m_netherlands_8bit",
  } /*,{
    title:'MSGCPP realtime cloud physical properties service',
    thumbnail:'http://msgcpp.knmi.nl/mediawiki/images/thumb/d/d9/MSG-CPP_Screenshot-Google_Earth-cwp.png/750px-MSG-CPP_Screenshot-Google_Earth-cwp.png',
    service:'http://msgcpp-ogc-realtime.knmi.nl/msgrt.cgi?'
  },{
    title:'MSGCPP archive cloud physical properties service',
    thumbnail:'http://msgcpp.knmi.nl/mediawiki/images/thumb/d/d9/MSG-CPP_Screenshot-Google_Earth-cwp.png/750px-MSG-CPP_Screenshot-Google_Earth-cwp.png',
    service:'http://msgcpp-ogc-archive.knmi.nl/msgar.cgi?'
  },{
    title:'OMI daily total sulfur dioxide (OMI TDCSO2)',
    thumbnail:'http://adaguc.knmi.nl/contents/webservices/OMI_TDCSO2_L3.jpg',
    service:'https://geoservices.knmi.nl/cgi-bin/OMI___OPER_R___TDCSO2__L3.cgi?',
    layer:'OMI_L3_TDCSO2'
  }*/,
];

var mapTypeConfiguration = [
  {
    title: "Europe Latitude/Longitude WGS84",
    bbox: [-20, 40, 50, 65],
    srs: "EPSG:4326",
    baselayer: {
      service: "http://cib-dev.knmi.nl/cgi-bin/worldmaps_e4m.cgi?",
      name: "world_polygons",
      format: "image/gif",
      transparent: false,
    },
  },
  {
    title: "World Latitude/Longitude WGS84",
    bbox: [-180, -90, 180, 90],
    srs: "EPSG:4326",
    baselayer: {
      service: "https://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
      name: "world_raster",
    },
  },
  {
    title: "World Mercator",
    bbox: [-19000000, -10000000, 19000000, 10000000],
    srs: "EPSG:3857",
    baselayer: {
      service: "https://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
      name: "world_raster",
    },
  },
  /*,{ 
    title: 'Schiphol Modis', 
    bbox: [515813.2988839851,6850485.5537392385,544160.8241851525,6869318.449956324],   
    srs: 'EPSG:3857', 
    baselayer:{service:'https://geoservices.knmi.nl/cgi-bin/MODIS_Netherlands.cgi?',name:'modis_250m_netherlands_8bit'}
  },{ 
    title: 'NL Modis Mercator', 
    bbox: [220000,6500000,1000000,7200000],
    srs: 'EPSG:3857',
    baselayer:{service:'https://geoservices.knmi.nl/cgi-bin/MODIS_Netherlands.cgi?',name:'modis_250m_netherlands_8bit'}
  },{ 
    title: 'NL Base Mercator', 
    bbox: [220000,6500000,1000000,7200000],
    srs: 'EPSG:3857',
    baselayer:{service:'https://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?',name:'world_raster'}
  },{ 
    title: 'The Netherlands RD projection', 
    bbox: [-5000,300000,300000,630000],
    srs: 'EPSG:28992'
  },{ 
    title: 'The Netherlands Mercator', 
    bbox: [220000,6500000,1000000,7200000], 
    srs: 'EPSG:3857'
  },{ 
    title: 'The Netherlands+North Sea', 
    bbox: [-600000,200000,900000,1400000], 
    srs: 'EPSG:28992'
  },*/ {
    title: "Western Europe",
    bbox: [1200000, -3000000, 3250000, -1000000],
    srs: "EPSG:32661",
    baselayer: {
      service: "https://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
      name: "world_raster",
    },
  },
  {
    title: "Europe",
    bbox: [-0.2e6, -4e6, 5.5e6, 0.2e6],
    srs: "EPSG:32661",
    baselayer: {
      service: "https://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
      name: "world_raster",
    },
  },
  {
    title: "Europe+N.Atl.Oc.",
    bbox: [-3e6, -4e6, 4.5e6, 0.5e6],
    srs: "EPSG:32661",
    baselayer: {
      service: "https://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
      name: "world_raster",
    },
  },
];

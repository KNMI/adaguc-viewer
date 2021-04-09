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
    baselayerservice: "http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?",
    baselayername: "topo",
  },
  {
    title: "MSGCPP realtime cloud physical properties service",
    thumbnail:
      "http://msgcpp.knmi.nl/mediawiki/images/thumb/d/d9/MSG-CPP_Screenshot-Google_Earth-cwp.png/750px-MSG-CPP_Screenshot-Google_Earth-cwp.png",
    service: "http://msgcpp-ogc-realtime.knmi.nl/msgrt.cgi?",
  },
  {
    title: "MSGCPP archive cloud physical properties service",
    thumbnail:
      "http://msgcpp.knmi.nl/mediawiki/images/thumb/d/d9/MSG-CPP_Screenshot-Google_Earth-cwp.png/750px-MSG-CPP_Screenshot-Google_Earth-cwp.png",
    service: "http://msgcpp-ogc-archive.knmi.nl/msgar.cgi?",
  },
  {
    title: "OMI daily total sulfur dioxide (OMI TDCSO2)",
    thumbnail: "http://adaguc.knmi.nl/contents/webservices/OMI_TDCSO2_L3.jpg",
    service:
      "https://geoservices.knmi.nl/cgi-bin/OMI___OPER_R___TDCSO2__L3.cgi?",
    layer: "OMI_L3_TDCSO2",
  },
  {
    title: "GLAMEPS",
    thumbnail: "http://folk.uio.no/trondi/outgoing/GLAMEPS/GLAMEPS.png",
    service: "http://bvmlab-218-41.knmi.nl/cgi-bin/GLAMEPS2.cgi?",
  },
  {
    title: "KNMI realtime KMDS observations",
    thumbnail:
      "http://www.knmi.nl/research/weather_observations/observations.jpg",
    service: "http://birdexp03.knmi.nl/cgi-bin/plieger/kmds.cgi?",
    layer: "1M/NIm",
    srs: "EPSG:28992",
    bbox: "108000,476000,116000,488000",
    baselayerservice: "http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?",
    baselayername: "topo",
  },
];

var mapTypeConfiguration = [
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
  },
  {
    title: "Schiphol Openstreetmap Mercator",
    bbox: [
      515813.2988839851,
      6850485.5537392385,
      544160.8241851525,
      6869318.449956324,
    ],
    srs: "EPSG:3857",
    baselayer: {
      service: "http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?",
      name: "streetmap",
    },
  },
  {
    title: "Schiphol Satellite + Aerial Mercator",
    bbox: [
      522402.16196646384,
      6852917.910540686,
      537831.8792436487,
      6863959.075064662,
    ],
    srs: "EPSG:3857",
    baselayer: {
      service: "http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?",
      name: "satellite",
    },
  },
  {
    title: "Topographic Mercator in NL",
    bbox: [220000, 6500000, 1000000, 7200000],
    srs: "EPSG:3857",
    baselayer: {
      service: "http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?",
      name: "topo",
    },
  },
  {
    title: "Canvas Mercator in NL",
    bbox: [220000, 6500000, 1000000, 7200000],
    srs: "EPSG:3857",
    baselayer: {
      service: "http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?",
      name: "canvas",
    },
  },
  {
    title: "The Netherlands RD projection",
    bbox: [-5000, 300000, 300000, 630000],
    srs: "EPSG:28992",
  },
  {
    title: "The Netherlands Mercator",
    bbox: [220000, 6500000, 1000000, 7200000],
    srs: "EPSG:3857",
  },
  {
    title: "The Netherlands+North Sea",
    bbox: [-600000, 200000, 900000, 1400000],
    srs: "EPSG:28992",
  },
  {
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

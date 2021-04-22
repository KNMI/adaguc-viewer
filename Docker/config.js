var baseLayerConfiguration = [
  {
    service: "", // TODO We need to copy the natural earth tiles to S3
    name: "naturalearth2",
    title: "World base layer Natural Earth ",
    enabled: false,
    type: "twms",
    format: "image/gif",
  },
  {
    title: "KNMI Basemap",
    name: "WorldMap",
    type: "twms",
    enabled: true,
  },
  {
    title: "ESRI ArcGis Canvas",
    name: "arcGisCanvas",
    type: "twms",
    enabled: false,
  },
  {
    title: "ESRI ArcGis Satellite",
    name: "arcGisSat",
    type: "twms",
    enabled: false,
  },
  {
    title: "ESRI ArcGis Topography",
    name: "arcGisTopo",
    type: "twms",
    enabled: false,
  },
  {
    title: "ESRI ArcGis Ocean",
    name: "arcGisOceanBaseMap",
    type: "twms",
    enabled: false,
  },
  {
    name: "OpenStreetMap_Service",
    title: "Open streetmap",
    type: "twms",
    enabled: false,
  },
  {
    service: "https://geoservices.knmi.nl/cgi-bin/MODIS_Netherlands.cgi?",
    name: "modis_250m_netherlands_8bit",
    title: "Static Modis image of the Netherlands",
    enabled: false,
    format: "image/png",
  },
  {
    service: "https://geoservices.knmi.nl/wms?DATASET=baselayers&",
    name: "countryborders",
    format: "image/png",
    title: "World country borders",
    enabled: true,
    keepOnTop: true,
  },
  {
    service: "https://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name: "nl_raster_latlon",
    format: "image/png",
    title: "KNMI baselayer of the Netherlands",
    enabled: false,
    keepOnTop: false,
  },
];

// var defaultProjection = {srs:'EPSG:4326',bbox:'-180,-90,180,90'};

var defaultProjection = {
  srs: "EPSG:3857",
  bbox: "-19000000,-19000000,19000000,19000000",
};

var hashLocationNotfiyAddLayer = false;

var getFeatureInfoApplications = [
  {
    name: "Time series mode",
    iconCls: "button_getfeatureinfo",
    location: "apps/gfiapp_d3c3.html",
  },
  //,{name:'Glameps application',iconCls:'button_getfeatureinfo',location:'../gfiapps/GLAMEPS_gfiapp.html'}
];

var dataChooserConfiguration = [
  {
    title: "KNMI realtime precipitation radar",
    thumbnail: "img/knmi_radar_icon.png",
    service: "https://geoservices.knmi.nl/adagucserver?dataset=RADAR&",
    layer: "RAD_NL25_PCP_CM",
    srs: "EPSG:3857",
    bbox: "220000,6500000,1000000,7200000",
    baselayerservice: "https://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?",
    baselayername: "streetmap",
    opacity: 0.8,
  },
  {
    title: "KNMI: Actuele 10min observaties",
    thumbnail:
      "https://geoservices.knmi.nl/wms?DATASET=OBS&SERVICE=WMS&&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10M%2Fta&WIDTH=200&HEIGHT=150&CRS=EPSG%3A3857&BBOX=322115.66902323,6737567.801887248,800549.41514577,7306708.317720752&STYLES=observation.temperature%2Fpoint&FORMAT=image/png&TRANSPARENT=FALSE&time=current&showdims=true&title=Stations",
    service: "https://geoservices.knmi.nl/wms?DATASET=OBS&",
    layer: "10M/ta",
  },
  {
    title: "KNMI: Dagelijks geinterpoleerde grids",
    thumbnail:
      "https://geoservices.knmi.nl/adagucserver?dataset=gridded_interpolations&service=WMS&request=getmap&format=image/png&layers=daily_temperature/INTER_OPER_R___TAVGD___L3__0005_prediction&width=200&height=150&CRS=EPSG:4326&STYLES=&EXCEPTIONS=INIMAGE&showlegend=true&0.9718626831038963&Title=Grids",
    service:
      "https://geoservices.knmi.nl/adagucserver?dataset=gridded_interpolations&",
    layer: "daily_temperature/INTER_OPER_R___TAVGD___L3__0005_prediction",
  },
];

var mapTypeConfiguration = [
  {
    title: "World WGS84",
    bbox: [-180, -90, 180, 90],
    srs: "EPSG:4326",
    baselayer: {
      service: "",
      name: "WorldMap",
      type: "twms",
    },
  } /*{ 
    title: 'Mollweide (7399)', 
    bbox: [-18157572.744146045,-11212941.682924412,18085661.018022258,11419683.192411266],
    srs: 'EPSG:7399',
    baselayer:{service:'https://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2',type: 'wms'}
  },*/,
  {
    title: "Robinson",
    bbox: [
      -17036744.451383516,
      -10711364.114367772,
      16912038.081015453,
      10488456.659686875,
    ],
    srs: "EPSG:54030",
    baselayer: {
      service: "",
      name: "WorldMap",
      type: "twms",
    },
  },
  {
    title: "World Mercator",
    bbox: [-19000000, -19000000, 19000000, 19000000],
    srs: "EPSG:3857",
    baselayer: {
      service: "",
      name: "WorldMap",
      type: "twms",
    },
  },
  {
    title: "Openstreetmap",
    bbox: [-19000000, -19000000, 19000000, 19000000],
    srs: "EPSG:3857",
    baselayer: {
      service: "",
      name: "OpenStreetMap_Service",
      type: "twms",
    },
  },
  {
    title: "Northern Hemisphere",
    bbox: [
      -5661541.927991125,
      -3634073.745615984,
      5795287.923063262,
      2679445.334384017,
    ],
    srs: "EPSG:3411",
    baselayer: {
      service: "",
      name: "NaturalEarth2",
      type: "twms",
    },
  },
  {
    title: "Southern Hemisphere",
    bbox: [
      -4589984.273212382,
      -2752857.546211313,
      5425154.657417289,
      2986705.2537886878,
    ],
    srs: "EPSG:3412",
    baselayer: {
      service: "",
      name: "NaturalEarth2",
      type: "twms",
    },
  },
  {
    title: "Europe North Pole",
    bbox: [-13000000, -13000000, 13000000, 13000000],
    srs: "EPSG:3575",
    baselayer: {
      service: "",
      name: "NaturalEarth2",
      type: "twms",
    },
  },

  {
    title: "Europe stereographic",
    bbox: [
      -2776118.977564746,
      -6499490.259201691,
      9187990.785775745,
      971675.53185069,
    ],
    srs: "EPSG:32661",
    baselayer: {
      service: "",
      name: "NaturalEarth2",
      type: "twms",
    },
  },
  {
    title: "North America",
    bbox: [
      -2015360.8716608454,
      -697107.5349683464,
      9961718.159421016,
      6782157.107682772,
    ],
    srs: "EPSG:50001",
    baselayer: {
      service: "",
      name: "NaturalEarth2",
      type: "twms",
    },
  },

  {
    title: "Openstreetmap NL",
    bbox: [220000, 6500000, 1000000, 7200000],
    srs: "EPSG:3857",
    baselayer: {
      service: "",
      name: "OpenStreetMap_Service",
      type: "twms",
    },
  } /*{ 
    title: 'PDOK BRT NL', 
    bbox: [-350000,125000,700000,900000],   
    srs: 'EPSG:28992', 
    baselayer:{service:'https://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'streetmap',type: 'wms'}
  },*/ /*{ 
    title: 'Openstreetmap Schiphol', 
    bbox: [515813.2988839851,6850485.5537392385,544160.8241851525,6869318.449956324],   
    srs: 'EPSG:3857', 
    baselayer:{service:'https://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'streetmap',type: 'wms'}
  }*/,

  /*,{ 
    title: 'The Netherlands (28992)', 
    bbox: [-350000,125000,700000,900000 ],
    srs: 'EPSG:28992',
    baselayer:{service:'https://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2',type: 'wms'}
  },*/

  /*,{ 
    title: 'Schiphol Satellite + Aerial Mercator', 
    bbox: [522402.16196646384,6852917.910540686,537831.8792436487,6863959.075064662],
    srs: 'EPSG:3857',
    baselayer:{service:'http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?',name:'satellite'}
  },{ 
    title: 'Topographic Mercator in NL', 
    bbox: [220000,6500000,1000000,7200000],
    srs: 'EPSG:3857',
    baselayer:{service:'http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?',name:'topo'}
  },{ 
    title: 'Canvas Mercator in NL', 
    bbox: [220000,6500000,1000000,7200000],
    srs: 'EPSG:3857',
    baselayer:{service:'http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?',name:'canvas'}
  }*/
];

var defaultLanguage = { language: "en" }; // <-- Language for the ADAGUC viewer.
var defaultUsernameSearch = "adaguc"; // <-- Username for the GeoNames API. 1
var geoNamesURL =
  "http://api.geonames.org/search?q={searchTerm}&username={username}&maxRows=1"; // <-- URL for the GeoNames API. Requires 'defaultUsernameSearch'

var webMapJSSettings = {
  enableTouchDevice: true,
};

//FOR JSP:
/*
var xml2jsonrequestURL = "/impactportal/AdagucViewer?SERVICE=XML2JSON&";
var requestProxy = "/impactportal/AdagucViewer?SERVICE=PROXY&";
*/

//For PHP:
var requestProxy = "./webmapjs_php/MakeRequest.php?";
var xml2jsonrequestURL = "./webmapjs_php/xml2jsonrequest.php?";

// getFeatureInfoApplications.push({name:'EProfile',iconCls:'button_getfeatureinfo'});
getFeatureInfoApplications.push({
  name: "AutoWMS",
  iconCls: "button_getfeatureinfo",
});
getFeatureInfoApplications.open = "AutoWMS";
// getFeatureInfoApplications.open = 'EProfile';
// xml2jsonrequestURL = 'http://localhost:8080/adaguc-services/xml2json?'
// autowmsURL = 'http://localhost:8080/adaguc-services/autowms?';
// getFeatureInfoApplications.push({name:'AutoWMS',iconCls:'button_getfeatureinfo'});

var WMJSTileRendererTileSettings = {
  WorldMap_Light_Grey_Canvas: {
    "EPSG:3857": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/WorldMap_Light_Grey_Canvas/EPSG3857/",
      minLevel: 0,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
  },
  OpenStreetMap_NL: {
    "EPSG:3857": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/OpenStreetMap_NL/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | Ingmapping",
    },
  },
  OpenStreets_NL: {
    "EPSG:3857": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/OpenStreets_NL/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | Ingmapping",
    },
    "EPSG:28992": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/OpenStreets_NL/EPSG28992/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
  },
  Positron_NL: {
    "EPSG:3857": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/Positron_NL/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | OpenMapTiles | Ingmapping",
    },
  },
  Positron_NL_NoLabels: {
    "EPSG:3857": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/Positron_NL_NoLabels/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | OpenMapTiles | Ingmapping",
    },
  },
  Klokantech_Basic_NL: {
    "EPSG:3857": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/Klokantech_Basic_NL/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | OpenMapTiles | Ingmapping",
    },
  },
  Klokantech_Basic_NL_NoLabels: {
    "EPSG:3857": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/Klokantech_Basic_NL_NoLabels/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | OpenMapTiles | Ingmapping",
    },
  },
  OSM_Blossom_NL: {
    "EPSG:3857": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/OSM_Blossom_NL/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | Ingmapping",
    },
  },
  WorldMap: {
    "EPSG:3857": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/WorldMap/EPSG3857/",
      minLevel: 0,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "TODO__EPSG:4326": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/WorldMap/EPSG4326/",
      minLevel: 0,
      maxLevel: 9,
      origX: -180,
      origY: 90,
      resolution: 1.422222,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:3411": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/WorldMap/EPSG3411/",
      minLevel: 3,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:28992": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/WorldMap/EPSG28992/",
      minLevel: 5,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:3412": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/WorldMap/EPSG3412/",
      minLevel: 3,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:32661": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/WorldMap/EPSG32661/",
      minLevel: 4,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:54030": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/WorldMap/EPSG54030/",
      minLevel: 3,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:3575": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/WorldMap/EPSG3575/",
      minLevel: 5,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
  },
  OSM_Antarctica: {
    "EPSG:3412": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/OSM_Antarctica/EPSG3412/",
      minLevel: 1,
      maxLevel: 7,
      origX: -3000000,
      origY: 3000000,
      resolution: 23437.5,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | Ingmapping",
    },
  },
  arcGisCanvas: {
    title: "ArcGIS canvas map",
    "EPSG:3857": {
      home:
        "//services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/",
      minLevel: 1,
      maxLevel: 16,
      tileServerType: "arcgisonline",
      copyRight: "Basemap copyright: 2013 ESRI, DeLorme, NAVTEQ",
    },
    "EPSG:28992": {
      home:
        "//services.arcgisonline.com/arcgis/rest/services/Basiskaarten/Canvas/MapServer/tile/",
      minLevel: 1,
      maxLevel: 12,
      origX: -285401.92,
      origY: 903401.92,
      resolution: 3440.64,
      tileServerType: "arcgisonline",
      copyRight:
        "Basiskaart bronnen: ESRI Nederland, ESRI, Kadaster, CBS en Rijkswaterstaat",
    },
  },
  arcGisTopo: {
    title: "ArcGIS topo map",
    "EPSG:3857": {
      home:
        "//services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/",
      minLevel: 1,
      maxLevel: 19,
      tileServerType: "arcgisonline",
      copyRight:
        "Basemap sources: ESRI, DeLorme, NAVTEQ, TomTom, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, ESRI Japan, METI, ESRI China (Hong Kong), and the GIS User Community",
    },
    "EPSG:28992": {
      home:
        "//services.arcgisonline.com/arcgis/rest/services/Basiskaarten/Topo/MapServer/tile/",
      minLevel: 1,
      maxLevel: 12,
      origX: -285401.92,
      origY: 903401.92,
      resolution: 3440.64,
      tileServerType: "arcgisonline",
      copyRight:
        "Basiskaart bronnen: ESRI Nederland, ESRI, Kadaster, CBS, Min VROM, Rijkswaterstaat en gemeenten: Rotterdam, Breda, Tilburg",
    },
  },
  arcGisOceanBaseMap: {
    title: "ArcGIS ocean map",
    "EPSG:3857": {
      home:
        "//services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/",
      minLevel: 1,
      maxLevel: 19,
      tileServerType: "arcgisonline",
      copyRight:
        "Basemap sources: ESRI, GEBCO, NOAA, National Geographic, DeLorme, NAVTEQ, Geonames.org, and other contributors",
    },
  },
  arcGisSat: {
    title: "ArcGIS satellite map",
    "EPSG:4326": {
      home:
        "//services.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer/tile/",
      minLevel: 1,
      maxLevel: 15,
      tileServerType: "arcgisonline",
      origX: -180,
      origY: 90,
      resolution: 0.3515625,
      tileSize: 512,
      copyRight: "ESRI",
    },
    "EPSG:3857": {
      home:
        "//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/",
      minLevel: 1,
      maxLevel: 18,
      tileServerType: "arcgisonline",
      copyRight: "ESRI",
    },
  },
  OpenStreetMap_Service: {
    title: "OpenStreetMap Service",
    "EPSG:3857": {
      home: "//b.tile.openstreetmap.org/",
      minLevel: 1,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors",
    },
    "EPSG:28992": {
      home:
        "//services.arcgisonline.com/ArcGIS/rest/services/Basiskaarten/PDOK_BRT/MapServer/tile/",
      minLevel: 1,
      maxLevel: 12,
      origX: -285401.92,
      origY: 903401.92,
      resolution: 3440.64,
      tileServerType: "arcgisonline",
      copyRight: "Basiskaart bronnen: PDOK, Kadaster, OpenStreetMap",
    },
  },
  NaturalEarth2: {
    "EPSG:3411": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/NaturalEarth2/EPSG3411/",
      minLevel: 1,
      maxLevel: 6,
      origX: -12400000,
      origY: 12400000,
      resolution: 96875,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:3412": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/NaturalEarth2/EPSG3412/",
      minLevel: 1,
      maxLevel: 6,
      origX: -12400000,
      origY: 12400000,
      resolution: 96875,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:3575": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/NaturalEarth2/EPSG3575/",
      minLevel: 1,
      maxLevel: 6,
      origX: -13000000,
      origY: 13000000,
      resolution: 101562.5,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:3857": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/NaturalEarth2/EPSG3857/",
      minLevel: 1,
      maxLevel: 7,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:4258": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/NaturalEarth2/EPSG4326/",
      minLevel: 1,
      maxLevel: 6,
      origX: -180,
      origY: 90,
      resolution: 0.703125,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:4326": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/NaturalEarth2/EPSG4326/",
      minLevel: 1,
      maxLevel: 6,
      origX: -180,
      origY: 90,
      resolution: 0.703125,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:28992": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/NaturalEarth2/EPSG28992/",
      minLevel: 1,
      maxLevel: 5,
      origX: -2999000,
      origY: 2995500,
      resolution: 23437,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:32661": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/NaturalEarth2/EPSG32661/",
      minLevel: 1,
      maxLevel: 7,
      origX: -5000000,
      origY: 4000000,
      resolution: 58593.75,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:54030": {
      home:
        "https://knmi-geoweb-assets.s3-eu-west-1.amazonaws.com/NaturalEarth2/EPSG54030/",
      minLevel: 1,
      maxLevel: 7,
      origX: -17000000,
      origY: 8625830,
      resolution: 132812.5,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
  },
};

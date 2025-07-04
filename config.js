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
    service: "https://geoservices.knmi.nl/wms?DATASET=baselayers&",
    name: "countryborders",
    format: "image/png",
    title: "World country borders",
    enabled: true,
    keepOnTop: true,
  },
  {
    service:
      "https://geoservices.knmi.nl/adagucserver?dataset=knmi_animated_gif_baselayers&&service=WMS&request=GetCapabilities",
    name: "knmi_animated_gif_background_europe_elevation_1km_combined",
    format: "image/png",
    title: "Radar baselayer",
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
  {
    name: "Histogram mode",
    iconCls: "button_getfeatureinfo",
    location: "apps/gfiapp_histogram.html",
  },

  {
    name: "EProfile",
    iconCls: "button_getfeatureinfo",
    location: "apps/test_gfiapp_eprofile.html",
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
    baselayerservice: "",
    baselayername: "streetmap",
    opacity: 0.8,
  },
  {
    title: "KNMI: Actuele 10min observaties",
    thumbnail: "img/knmi-10mobs.png",
    service: "https://geoservices.knmi.nl/wms?DATASET=OBS&",
    layer: "10M/ta",
  },
  {
    title: "KNMI: Dagelijks geinterpoleerde grids",
    thumbnail: "img/knmi-grids.png",
    service:
      "https://geoservices.knmi.nl/adagucserver?dataset=gridded_interpolations&",
    layer: "daily_temperature/INTER_OPER_R___TAVGD___L3__0005_prediction",
  },
  {
    title: "KNMI: Waarneemstations",
    thumbnail: "img/knmi-waarneemstations.png",
    service:
      "https://geoservices.knmi.nl/adagucserver?dataset=knmi_waarneemstations&",
    layer: "obs_temp",
  },
  {
    title: "KNMI: Harmonie Model DINI",
    thumbnail:
      "https://geoservices.knmi.nl/adaguc-server?dataset=uwcw_ha43_dini_5p5km&SERVICE=WMS&&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=air_temperature_hagl,total_precipitation_rate_hagl,air_pressure_at_mean_sea_level_hagl&WIDTH=1000&HEIGHT=1000&CRS=EPSG%3A3857&STYLES=temperature_wow%2Fshaded&FORMAT=image/png",
    service:
      "https://geoservices.knmi.nl/adagucserver?dataset=uwcw_ha43_dini_5p5km&&service=WMS&request=GetCapabilities",
    layer: "air_temperature_hagl",
    srs: "EPSG:32661",
    bbox: "-1426149.6740167392,-3952624.8700028625,4853185.34363064,13733.803609137563",
    style: "temperature_wow/shadedcontour",
  },
  {
    title: "KNMI: Harmonie Model NL",
    thumbnail:
      "https://geoservices.knmi.nl/adaguc-server?DATASET=uwcw_ha43_nl_2km&SERVICE=WMS&&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=air_temperature_hagl,total_precipitation_rate_hagl,air_pressure_at_mean_sea_level_hagl&WIDTH=1000&HEIGHT=1000&CRS=EPSG%3A3857&STYLES=temperature_wow%2Fshaded&FORMAT=image/png",
    service:
      "https://geoservices.knmi.nl/adagucserver?dataset=uwcw_ha43_nl_2km&&service=WMS&request=GetCapabilities",
    srs: "EPSG:28992",
    bbox: "-464237.8366878504,113616.90792712737,797134.670088837,910366.2084261273",
    layer: "air_temperature_hagl",
    style: "temperature_wow/shadedcontour",
  },
  {
    title: "KNMI: Testdata set",
    thumbnail:
      "https://geoservices.knmi.nl/adaguc-server?DATASET=testdata&SERVICE=WMS&&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=testdata&WIDTH=1000&HEIGHT=1000&CRS=EPSG%3A32661&STYLES=testdata_style_manycontours%2Fnearestcontour&FORMAT=image/png",
    service:
      "https://geoservices.knmi.nl/adagucserver?dataset=testdata&&service=WMS&request=GetCapabilities",
    layer: "testdata",
    style: "testdata_style_manycontours/nearestcontour",
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
  },
  {
    title: "Robinson",
    bbox: [
      -17036744.451383516, -10711364.114367772, 16912038.081015453,
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
      -5661541.927991125, -3634073.745615984, 5795287.923063262,
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
      -4589984.273212382, -2752857.546211313, 5425154.657417289,
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
      -2776118.977564746, -6499490.259201691, 9187990.785775745,
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
      -2015360.8716608454, -697107.5349683464, 9961718.159421016,
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
  },
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
// getFeatureInfoApplications.open = 'EProfile';
// xml2jsonrequestURL = 'http://localhost:8080/adaguc-services/xml2json?'
// autowmsURL = 'http://localhost:8080/adaguc-services/autowms?';
// getFeatureInfoApplications.push({name:'AutoWMS',iconCls:'button_getfeatureinfo'});

getFeatureInfoApplications.open = "AutoWMS";

var WMJSTileRendererTileSettings = {
  WorldMap_Light_Grey_Canvas: {
    "EPSG:3857": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/WorldMap_Light_Grey_Canvas/EPSG3857/",
      minLevel: 0,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
  },
  OpenStreetMap_NL: {
    "EPSG:3857": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/OpenStreetMap_NL/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | Ingmapping",
    },
  },
  OpenStreets_NL: {
    "EPSG:3857": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/OpenStreets_NL/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | Ingmapping",
    },
    "EPSG:28992": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/OpenStreets_NL/EPSG28992/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
  },
  Positron_NL: {
    "EPSG:3857": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/Positron_NL/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | OpenMapTiles | Ingmapping",
    },
  },
  Positron_NL_NoLabels: {
    "EPSG:3857": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/Positron_NL_NoLabels/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | OpenMapTiles | Ingmapping",
    },
  },
  Klokantech_Basic_NL: {
    "EPSG:3857": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/Klokantech_Basic_NL/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | OpenMapTiles | Ingmapping",
    },
  },
  Klokantech_Basic_NL_NoLabels: {
    "EPSG:3857": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/Klokantech_Basic_NL_NoLabels/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | OpenMapTiles | Ingmapping",
    },
  },
  OSM_Blossom_NL: {
    "EPSG:3857": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/OSM_Blossom_NL/EPSG3857/",
      minLevel: 0,
      maxLevel: 16,
      tileServerType: "osm",
      copyRight: "OpenStreetMap - contributors | Ingmapping",
    },
  },
  WorldMap: {
    "EPSG:3857": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/WorldMap/EPSG3857/",
      minLevel: 0,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "TODO__EPSG:4326": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/WorldMap/EPSG4326/",
      minLevel: 0,
      maxLevel: 9,
      origX: -180,
      origY: 90,
      resolution: 1.422222,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:3411": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/WorldMap/EPSG3411/",
      minLevel: 3,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:28992": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/WorldMap/EPSG28992/",
      minLevel: 5,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:3412": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/WorldMap/EPSG3412/",
      minLevel: 3,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:32661": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/WorldMap/EPSG32661/",
      minLevel: 4,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:54030": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/WorldMap/EPSG54030/",
      minLevel: 3,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
    "EPSG:3575-disabled": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/WorldMap/EPSG3575/",
      minLevel: 5,
      maxLevel: 9,
      tileServerType: "osm",
      copyRight: "Natural Earth II | Ingmapping",
    },
  },
  OSM_Antarctica: {
    "EPSG:3412": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/OSM_Antarctica/EPSG3412/",
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
      home: "//services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/",
      minLevel: 1,
      maxLevel: 16,
      tileServerType: "arcgisonline",
      copyRight: "Basemap copyright: 2013 ESRI, DeLorme, NAVTEQ",
    },
    "EPSG:28992": {
      home: "//services.arcgisonline.com/arcgis/rest/services/Basiskaarten/Canvas/MapServer/tile/",
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
      home: "//services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/",
      minLevel: 1,
      maxLevel: 19,
      tileServerType: "arcgisonline",
      copyRight:
        "Basemap sources: ESRI, DeLorme, NAVTEQ, TomTom, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, ESRI Japan, METI, ESRI China (Hong Kong), and the GIS User Community",
    },
    "EPSG:28992": {
      home: "//services.arcgisonline.com/arcgis/rest/services/Basiskaarten/Topo/MapServer/tile/",
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
      home: "//services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/",
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
      home: "//services.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer/tile/",
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
      home: "//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/",
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
      home: "//services.arcgisonline.com/ArcGIS/rest/services/Basiskaarten/PDOK_BRT/MapServer/tile/",
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
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/NaturalEarth2/EPSG3411/",
      minLevel: 1,
      maxLevel: 6,
      origX: -12400000,
      origY: 12400000,
      resolution: 96875,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:3412": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/NaturalEarth2/EPSG3412/",
      minLevel: 1,
      maxLevel: 6,
      origX: -12400000,
      origY: 12400000,
      resolution: 96875,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:3575": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/NaturalEarth2/EPSG3575/",
      minLevel: 1,
      maxLevel: 6,
      origX: -13000000,
      origY: 13000000,
      resolution: 101562.5,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:3857": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/NaturalEarth2/EPSG3857/",
      minLevel: 1,
      maxLevel: 7,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:4258": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/NaturalEarth2/EPSG4326/",
      minLevel: 1,
      maxLevel: 6,
      origX: -180,
      origY: 90,
      resolution: 0.703125,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:4326": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/NaturalEarth2/EPSG4326/",
      minLevel: 1,
      maxLevel: 6,
      origX: -180,
      origY: 90,
      resolution: 0.703125,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:28992": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/NaturalEarth2/EPSG28992/",
      minLevel: 1,
      maxLevel: 5,
      origX: -2999000,
      origY: 2995500,
      resolution: 23437,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:32661": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/NaturalEarth2/EPSG32661/",
      minLevel: 1,
      maxLevel: 7,
      origX: -5000000,
      origY: 4000000,
      resolution: 58593.75,
      tileServerType: "wmst",
      copyRight: "NPS - Natural Earth II",
    },
    "EPSG:54030": {
      home: "https://geoweb-maps-assets.pmc.knmi.cloud/NaturalEarth2/EPSG54030/",
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

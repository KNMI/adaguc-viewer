var baseLayerConfiguration = [
  {
    name:"OSM",
    title:"Open streetmap",
    type: 'twms',
    enabled:true
  },
  {
    name:"TERRAIN",
    title:"terrain",
    type: 'twms',
    enabled:false
  },
  {
    name:"LITE",
    title:"toner-lite",
    type: 'twms',
    enabled:false
  },
  {
    service: "https://geoservices.knmi.nl/wms?DATASET=baselayers&",
    name: "countryborders",
    format: "image/png",
    title: "World country borders",
    enabled: true,
    keepOnTop: true,
  },

];

//var defaultProjection = {srs:'EPSG:4326',bbox:'-180,-90,180,90'};

//var defaultProjection = {srs:'EPSG:3857',bbox:'-19000000,-12000000,19000000,16000000'};

var defaultProjection = {srs:'EPSG:3857',bbox:'-3900000,3000000,3500000,8300000'};

var hashLocationNotfiyAddLayer = false;

var logo ="./logo_AEMET.png"
//var logo =""
//var logo="./calabaza.png"

//var server1 = "http://dorsal.aemet.es:8080/adaguc-services/" 
//Docker
var server = "https://dorsal.aemet.es/"

var getFeatureInfoApplications = [
  {name:'Time series mode',iconCls:'button_getfeatureinfo',location:'apps/gfiapp_d3c3.html'}
  //,{name:'Glameps application',iconCls:'button_getfeatureinfo',location:'../gfiapps/GLAMEPS_gfiapp.html'}
];
var dataChooserConfiguration = [];

var dataChooserConfigurationFolder =[]; 

var dataChooserConfigurationAdd = [
  {
    title:'VIS ALTA RES',
        thumbnail:server + '/adagucserver?dataset=SEVIRI-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=HRV,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
        service:server + '/adagucserver?dataset=SEVIRI-HRV&',
        layer:'HRV'
  },{
    title:'VIS006',
        thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=VIS006-REF,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
        service:server + '/adagucserver?dataset=SEVIRI-3Km&',
        layer:'VIS006-REF'
  },{
    title:'WV062',
        thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=WV062-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
        service:server + '/adagucserver?dataset=SEVIRI-3Km&',
        layer:'WV062-BT'
  },{
    title:'IR108',
        thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR108-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
        service:server + '/adagucserver?dataset=SEVIRI-3Km&',
        layer:'IR108-BT'
  },{
    title:'LIGHTNING',
    thumbnail:server + '/wms?DATASET=LIGHTNING&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,LIGHTNING_lightningAddLayers&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=LIGHTNING&',
    layer:'LIGHTNING',
  },{ 
    title:'METAR',
    thumbnail:server + '/adagucserver?dataset=METAR&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,T_Td_Vis&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=METAR&&service=WMS&request=GetCapabilities',
    layer:'T_Td_Vis'
  },{ 
    title:'OPERA-RATE',
    thumbnail:server + '/adagucserver?dataset=OPERA-COMP-RATE&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,OPERA_rainfall_rate&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=OPERA-COMP-RATE&&service=WMS&request=GetCapabilities',
    layer:'OPERA_rainfall_rate'
  },{
    title:'CRR',
        thumbnail:server + '/adagucserver?dataset=CRR&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CRR_crr_intensity,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=CRR&',
        layer:'CRR_crr_intensity'
  },{
    title:'CRRPh',
        thumbnail:server + '/adagucserver?dataset=CRRPh&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CRRPh_crrph_intensity,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=CRRPh&',
        layer:'CRRPh_crrph_intensity'
  },{
    title:'PC',
        thumbnail:server + '/adagucserver?dataset=PC&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=PC_pc,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=PC&',
        layer:'PC_pc'
  },{
    title:'CI',
        thumbnail:server + '/adagucserver?dataset=CI&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CI_ci_prob90,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=CI&',
        layer:'CI_ci_prob90'
  },{
    title:'LIFTED INDEX',
        thumbnail:server + '/adagucserver?dataset=iSHAI&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=iSHAI_IR_band,iSHAI_ishai_li,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=PRECONV&',
        layer:'LIFTED'
  },{
    title:'HUMIDITY DIF NWP/MSG',
        thumbnail:server + '/adagucserver?dataset=iSHAI&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=iSHAI_IR_band,iSHAI_ishai_diffml,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=PRECONV&',
        layer:'DIFFERENCES'
  },{
    title:'RDT',
        thumbnail:server + '/adagucserver?dataset=RDT_NOW&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,RDT&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/wms?DATASET=RDT_NOW&',
        layer:'RDT'  
  },{
    title:'CTTH-FL',
        thumbnail:server + '/adagucserver?dataset=IMASK&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IMASK_imask_ctth_FL,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=IMASK&',
        layer:'IMASK_imask_ctth_FL'
  },{
    title:'ASII-TF',
        thumbnail:server + '/adagucserver?dataset=ASII-TF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=ASII-TF_asii_turb_trop_prob,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=ASII-TF&',
        layer:'ASII-TF_asii_turb_trop_prob'
  },{
    title:'ASII-GW',
        thumbnail:server + '/adagucserver?dataset=ASII-GW&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=ASII-GW_asii_turb_wave_prob,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=ASII-GW&',
        layer:'ASII-GW_asii_turb_wave_prob'
  },{
    title:'IMASK',
        thumbnail:server + '/adagucserver?dataset=IMASK&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IMASK_imask,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=IMASK&',
        layer:'IMASK_imask'
  },{
    title:'WIND',
        thumbnail:server + '/adagucserver?dataset=HRW&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,windHRW&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=HRW&',
        layer:'Wind_pressure'
  },{
    title:'CT',
        thumbnail:server + '/adagucserver?dataset=CT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CT_ct,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=CT&',
        layer:'CT_ct'
  },{
    title:'EXIM-CT',
        thumbnail:server + '/adagucserver?dataset=CT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CT_ct,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=EXIM-CT&',
        layer:'EXIM_CT_ct'
  },{
    title:'EMAS',
    thumbnail:'http://oberon.aemet.es/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multiLayer&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:'http://oberon.aemet.es/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multiLayer'
  }
  
];

var dataChooserConfigurationNWC = [];

var dataChooserConfigurationIRIS = [];

var dataChooserConfigurationECMWF = [
{
      title:'Mean sea level pressure',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=mean_sea_level_pressure,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'mean_sea_level_pressure',
      abs:'MEAN SEA LEVEL PRESSURE',
},{
      title:'Geopotential height',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=geopotential_height,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'geopotential_height',
      abs:'Geopotential Height in meters ',
},{
      title:'Temperature',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=temperature,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'temperature',
      abs:'Presion Level Temperature',
},{
      title:'Relative humidity',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=relative_humidity,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'relative_humidity',
      abs:'Presion Level Relative Humedity',
},{
      title:'Wind',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=wind,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'wind',
      abs:'Pressure Level Wind in m/s',
},{
      title:'Wind barbs & vectors',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=wind_barbs_vectors,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'wind_barbs_vectors',
      abs:'Pressure Level Wind barbs & vectors',
},{
      title:'Wind_kt',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=wind_kt,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'wind_kt',
      abs:'Pressure Level Wind in Knots',
},{
      title:'10m Wind',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'10_meter_wind',
      abs:'10meters Wind in m/s',
},{
      title:'10m Wind barbs & vectors',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind_barbs_vectors,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'10_meter_wind_barbs_vectors',
      abs:'10meters Wind barbs & vectors',
},{
      title:'10m Wind_kt',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind_kt,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'10_meter_wind_kt',
      abs:'10meters Wind in Knots',
},{
      title:'2m Temperature',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=2_meter_temperature,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'2_meter_temperature',
      abs:'2 meters temperature',
},{
      title:'2m dewpoint Temperature',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=2_meter_dewpoint_temperature,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'2_meter_dewpoint_temperature',
      abs:'2 meters dewpoint temperature',
},{
      title:'Composed cloud cover',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=composed_cloud_cover,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'composed_cloud_cover',
      abs:'Composed Cloud Cover',
},{
      title:'High cloud cover',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=high_cloud_cover,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'high_cloud_cover',
      abs:'High Cloud Cover',
},{
      title:'Medium cloud cover',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=medium_cloud_cover,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'medium_cloud_cover',
      abs:'Medium Cloud Cover',
},{
      title:'Low cloud cover',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=low_cloud_cover,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'low_cloud_cover',
      abs:'Low Cloud Cover',
},{
      title:'Total cloud cover',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=total_cloud_cover,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'total_cloud_cover',
      abs:'Total Cloud Cover',
},{
      title:'Vertical velocity',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=vertical_velocity,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'vertical_velocity',
      abs:'vertical_velocity',
},{
      title:'Convective accumulated precipitation',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=convective_accumulated_precipitation,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'convective_accumulated_precipitation',
      abs:'Convective Accumulated Precipitation',
},{
      title:'Convective precipitation last 6H',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=convective_precipitation_during_last_6_hours,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'convective_precipitation_during_last_6_hours',
      abs:'Convective Accumulated Precipitation in last 6 hours',
},{
      title:'Large scale accumulated precipitation',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=large-scale_accumulated_precipitation,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'large-scale_accumulated_precipitation',
      abs:'Large Scale Accumulated Precipitation',
},{
      title:'Large scale accumulated predipitation last 6H',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=large-scale_precipitation_during_last_6_hours,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'large-scale_precipitation_during_last_6_hours',
      abs:'Large Scale Accumulated Precipitation in last 6 hours',
},{
      title:'Total accumulated precipitation',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=total_accumulated_precipitation,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'total_accumulated_precipitation',
      abs:'Total Acumulated Precipitation',
},{
      title:'Total accumulated precipitation last 6H',
      thumbnail:server + '/adagucserver?dataset=ECMWF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=total_precipitation_during_last_6_hours,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF&',
      layer:'total_precipitation_during_last_6_hours',
      abs:'Total Acumulated Precipitation in last 6 hours',
}

];

var dataChooserConfigurationECMWFHRES = [
{
      title:'Mean sea level pressure',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=mean_sea_level_pressure,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'mean_sea_level_pressure',
      abs:'MEAN SEA LEVEL PRESSURE',
},{
      title:'Geopotential height',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=geopotential_height,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'geopotential_height',
      abs:'Geopotential Height in meters ',
},{
      title:'Temperature', thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=temperature,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'temperature',
      abs:'Presion Level Temperature',
},{
      title:'Relative humidity',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=relative_humidity,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'relative_humidity',
      abs:'Presion Level Relative Humedity',
},{
      title:'Wind',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=wind,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'wind',
      abs:'Pressure Level Wind in m/s',
},{
      title:'Wind barbs & vectors',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=wind_barbs_vectors,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'wind_barbs_vectors',
      abs:'Pressure Level Wind barbs & vectors',
},{
      title:'Wind_kt',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=wind_kt,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'wind_kt',
      abs:'Pressure Level Wind in Knots',
},{
      title:'10m Wind',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'10_meter_wind',
      abs:'10meters Wind in m/s',
},{
      title:'10m Wind barbs & vectors',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind_barbs_vectors,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'10_meter_wind_barbs_vectors',
      abs:'10meters Wind barbs & vectors',
},{
      title:'10m Wind_kt',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind_kt,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'10_meter_wind_kt',
      abs:'10meters wind in Knots',
},{
      title:'Maximum 10m gust during last 6H',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind_gust_during_last_6_hours_kt,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'10_meter_wind_gust_during_last_6_hours_kt',
      abs:'10m wind gust during last 6 hours kt',
},{
      title:'2m Temperature',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=2_meter_temperature,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'2_meter_temperature',
      abs:'2 meters temperature',
},{
      title:'2m dewpoint Temperature',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=2_meter_dewpoint_temperature,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'2_meter_dewpoint_temperature',
      abs:'2 meters dewpoint temperature',
},{
      title:'Minimum Temperature 2m in last 6H',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=2_meter_min_temperature_during_last_6_hours,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'2_meter_min_temperature_during_last_6_hours',
      abs:'2 meter min temperature during last 6 hours',
},{
      title:'Maximum Temperature 2m in last 6H',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=2_meter_max_temperature_during_last_6_hours,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'2_meter_max_temperature_during_last_6_hours',
      abs:'2 meter max temperature during last 6 hours',
},{
      title:'Composed cloud cover',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=composed_cloud_cover,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'composed_cloud_cover',
      abs:'Composed Cloud Cover',
},{
      title:'High cloud cover',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=high_cloud_cover,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'high_cloud_cover',
      abs:'High Cloud Cover',
},{
      title:'Medium cloud cover',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=medium_cloud_cover,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'medium_cloud_cover',
      abs:'Medium Cloud Cover',
},{
      title:'Low cloud cover',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=low_cloud_cover,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'low_cloud_cover',
      abs:'Low Cloud Cover',
},{
      title:'Total cloud cover',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=total_cloud_cover,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'total_cloud_cover',
      abs:'Total Cloud Cover',
},{
      title:'Vertical velocity',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=vertical_velocity,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'vertical_velocity',
      abs:'vertical_velocity',
},{
      title:'Convective accumulated precipitation',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=convective_accumulated_precipitation,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'convective_accumulated_precipitation',
      abs:'Convective Accumulated Precipitation',
},{
      title:'Convective precipitation last 6H',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=convective_precipitation_during_last_6_hours,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'convective_precipitation_during_last_6_hours',
      abs:'Convective Accumulated Precipitation in last 6 hours',
},{
      title:'Large scale accumulated precipitation',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=large-scale_accumulated_precipitation,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'large-scale_accumulated_precipitation',
      abs:'Large Scale Accumulated Precipitation',
},{
      title:'Large scale accumulated predipitation last 6H',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=large-scale_precipitation_during_last_6_hours,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'large-scale_precipitation_during_last_6_hours',
      abs:'Large Scale Accumulated Precipitation in last 6 hours',
},{
      title:'Total accumulated precipitation',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=total_accumulated_precipitation,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'total_accumulated_precipitation',
      abs:'Total Acumulated Precipitation',
},{
      title:'Total accumulated precipitation last 6H',
      thumbnail:server + '/adagucserver?dataset=ECMWF-HRES&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=total_precipitation_during_last_6_hours,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=ECMWF-HRES&',
      layer:'total_precipitation_during_last_6_hours',
      abs:'Total Acumulated Precipitation in last 6 hours',
}

];

var dataChooserConfigurationNWP = [
      {title:'Ceiling_ground_00',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Ceiling_Ground_IFS_HRES_00,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&',
      layer:'Ceiling_Ground_IFS_HRES_00'
},{title:'Ceiling_sea_00',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Ceiling_Sea_IFS_HRES_00,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&',
      layer:'Ceiling_Sea_IFS_HRES_00'
},{title:'Low_clouds_00',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Low_Clouds_IFS_HRES_00,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&',
      layer:'Low_Clouds_IFS_HRES_00'
},{title:'Medium_clouds_00',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Medium_Clouds_IFS_HRES_00,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&',
      layer:'Medium_Clouds_IFS_HRES_00'
},
/*{title:'IR108_00',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR108_IFS_00,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&',
      layer:'IR108_IFS_00'
},
{title:'Enhanced_IR108_00',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Enhanced_IR108_IFS_00,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&',
      layer:'Enhanced_IR108_IFS_00'
},{title:'WV62_00',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=WV62_IFS_00,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&',
      layer:'WV62_IFS_00'
},*/
{title:'Boundary_Layer_Height_00',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Turbulence&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Boundary_Layer_Height_IFS-HRES_00,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Turbulence&',
      layer:'Boundary_Layer_Height_IFS-HRES_00'
},{title:'Surface_Turbulence_00',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Turbulence&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=SFC_TURB_IFS-HRES_00,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Turbulence&',
      layer:'SFC_TURB_IFS-HRES_00'
},/*{title:'TI1_00',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Turbulence&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=TI1_IFS-HRES_00,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Turbulence&',
      layer:'TI1_IFS-HRES_00'
},{title:'TI2_00',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Turbulence&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=TI2_IFS-HRES_00,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Turbulence&',
      layer:'TI2_IFS-HRES_00'
},*/
{title:'Ceiling_ground_12',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Ceiling_Ground_IFS_HRES_12,overlay&WIDTH=412&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&',
      layer:'Ceiling_Ground_IFS_HRES_12'
},{title:'Ceiling_sea_12',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Ceiling_Sea_IFS_HRES_12,overlay&WIDTH=412&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&',
      layer:'Ceiling_Sea_IFS_HRES_12'
},{title:'Low_clouds_12',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Low_Clouds_IFS_HRES_12,overlay&WIDTH=412&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&',
      layer:'Low_Clouds_IFS_HRES_12'
},{title:'Medium_clouds_12',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Medium_Clouds_IFS_HRES_12,overlay&WIDTH=412&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Cloudiness&',
      layer:'Medium_Clouds_IFS_HRES_12'
},
/*{title:'IR108_12',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR108_IFS_12,overlay&WIDTH=412&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&',
      layer:'IR108_IFS_12'
},{title:'Enhanced_IR108_12',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Enhanced_IR108_IFS_12,overlay&WIDTH=412&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&',
      layer:'Enhanced_IR108_IFS_12'
},{title:'WV62_12',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=WV62_IFS_12,overlay&WIDTH=412&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Pseudoimages&',
      layer:'WV62_IFS_12'
},*/
{title:'Boundary_Layer_Height_12',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Turbulence&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Boundary_Layer_Height_IFS-HRES_12,overlay&WIDTH=412&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Turbulence&',
      layer:'Boundary_Layer_Height_IFS-HRES_12'
},{title:'Surface_Turbulence_12',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Turbulence&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=SFC_TURB_IFS-HRES_12,overlay&WIDTH=412&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Turbulence&',
      layer:'SFC_TURB_IFS-HRES_12'
},
/*{title:'TI1_12',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Turbulence&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=TI1_IFS-HRES_12,overlay&WIDTH=412&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Turbulence&',
      layer:'TI1_IFS-HRES_12'
},{title:'TI2_12',
      thumbnail:server + '/adagucserver?dataset=IFS-HRES_Turbulence&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=TI2_IFS-HRES_12,overlay&WIDTH=412&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IFS-HRES_Turbulence&',
      layer:'TI2_IFS-HRES_12'
}*/
];

var dataChooserConfigurationHARMONIE_AIB = [
{
      title:'Medium sea level pressure',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=medium_sea_level_pressure,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIB&',
      layer:'medium_sea_level_pressure',
      abs:'MEDIUM SEA LEVEL PRESSURE',
},{
      title:'10m Wind B/V',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind_barbs_vectors,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIB&',
      layer:'10_meter_wind_barbs_vectors',
      abs:'10 meter wind last hour (Barbs/Vectors)',

},{
      title:'10m Wind Kt',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind_kt,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIB&',
      layer:'10_meter_wind_kt',
      abs:'10 meter wind last hour (Knots)',

},{
      title:'10m Wind m/s',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIB&',
      layer:'10_meter_wind',
      abs:'10 meter max gust last hour (m/s)',

},{
      title:'10m MaxGust B/V',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_max_gust_during_last_hour_barbs_vectors,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIB&',
      layer:'10_meter_max_gust_during_last_hour_barbs_vectors',
      abs:'10 meter max gust last hour (Barbs/Vectors)',

},{
      title:'10m MaxGust Kt',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_max_gust_during_last_hour_kt,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIB&',
      layer:'10_meter_max_gust_during_last_hour_kt',
      abs:'10 meter max gust last hour (Knots)',

},{
      title:'10m MaxGust m/s',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_max_gust_during_last_hour_ms,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIB&',
      layer:'10_meter_max_gust_during_last_hour_ms',
      abs:'10 meter max gust last hour (m/s)',

},{
      title:'Total precipitation 1h',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=total_precipitation_during_last_hour,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIB&',
      layer:'total_precipitation_during_last_hour',
      abs:'Total precipitation during last hour',

},
]
var dataChooserConfigurationHARMONIE_AIC = [
{
      title:'Medium sea level pressure',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIC&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=medium_sea_level_pressure,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=23,-25,32,-5&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIC&',
      layer:'medium_sea_level_pressure',
      abs:'MEDIUM SEA LEVEL PRESSURE',
},{
      title:'10m Wind B/V',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIC&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind_barbs_vectors,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=23,-25,31,-5&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIC&',
      layer:'10_meter_wind_barbs_vectors',
      abs:'10 meter max gust last hour (Barbs/Vectors)',

},{
      title:'10m Wind Kt',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIC&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind_kt,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=23,-25,31,-5&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIC&',
      layer:'10_meter_wind_kt',
      abs:'10 meter max gust last hour (Knots)',

},{
      title:'10m Wind m/s',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIC&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=23,-25,31,-5&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIC&',
      layer:'10_meter_wind',
      abs:'10 meter max gust last hour (m/s)',

},{
      title:'10m MaxGust B/V',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIC&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_max_gust_during_last_hour_barbs_vectors,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=23,-25,31,-5&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIC&',
      layer:'10_meter_max_gust_during_last_hour_barbs_vectors',
      abs:'10 meter max gust last hour (Barbs/Vectors)',

},{
      title:'10m MaxGust Kt',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIC&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_max_gust_during_last_hour_kt,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=23,-25,31,-5&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIC&',
      layer:'10_meter_max_gust_during_last_hour_kt',
      abs:'10 meter max gust last hour (Knots)',

},{
      title:'10m MaxGust m/s',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIC&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_max_gust_during_last_hour_ms,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=23,-25,31,-5&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIC&',
      layer:'10_meter_max_gust_during_last_hour_ms',
      abs:'10 meter max gust last hour (m/s)',

},{
      title:'Total precipitation 1h',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIC&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=total_precipitation_during_last_hour,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=23,-25,31,-5&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIC&',
      layer:'total_precipitation_during_last_hour',
      abs:'Total precipitation during last hour',

},
]

var dataChooserConfigurationHARMONIE_AIN = [
{
      title:'Medium sea level pressure',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIN&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=medium_sea_level_pressure,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIN&',
      layer:'medium_sea_level_pressure',
      abs:'MEDIUM SEA LEVEL PRESSURE',
      
},{
      title:'10m Wind B/V',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIN&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind_barbs_vectors,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIN&',
      layer:'10_meter_wind_barbs_vectors',
      abs:'10 meter wind last hour (Barbs/Vectors)',

},{
      title:'10m Wind Kt',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIN&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind_kt,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIN&',
      layer:'10_meter_wind_kt',
      abs:'10 meter wind last hour (Knots)',

},{
      title:'10m Wind m/s',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIN&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_wind,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIN&',
      layer:'10_meter_wind',
      abs:'10 meter max gust last hour (m/s)',

},{
      title:'10m MaxGust B/V',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIN&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_max_gust_during_last_hour_barbs_vectors,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIN&',
      layer:'10_meter_max_gust_during_last_hour_barbs_vectors',
      abs:'10 meter max gust last hour (Barbs/Vectors)',

},{
      title:'10m MaxGust Kt',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIN&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_max_gust_during_last_hour_kt,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIN&',
      layer:'10_meter_max_gust_during_last_hour_kt',
      abs:'10 meter max gust last hour (Knots)',

},{
      title:'10m MaxGust m/s',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIN&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=10_meter_max_gust_during_last_hour_ms,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIN&',
      layer:'10_meter_max_gust_during_last_hour_ms',
      abs:'10 meter max gust last hour (m/s)',

},{
      title:'Total precipitation 1h',
      thumbnail:server + '/adagucserver?dataset=HARMONIE_AIN&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=total_precipitation_during_last_hour,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=29,-20,49,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HARMONIE_AIN&',
      layer:'total_precipitation_during_last_hour',
      abs:'Total precipitation during last hour',

},
]


//----------------------------------- CARPETA OBS -----------------------------------------------------
//CONTENIDO de subcarpeta Sondeo
var dataChooserConfigurationTEMP = [
  {
    title:'Europa-SUR',
    thumbnail:server + 'adagucserver?dataset=TEMP-LXXX&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,station_name&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,61,25&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + 'adagucserver?dataset=TEMP-LXXX&&service=WMS&request=GetCapabilities',
    abs:'TEMP-LXXX',
    layer:'station_name'
  }
]

//Contenido de OBS ALTURA.
var dataChooserConfigurationMAND = [
  {
    title:'Temperature',
    thumbnail:server + 'adagucserver?dataset=SOND&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Temperature&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,61,25&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + 'adagucserver?dataset=SOND&&service=WMS&request=GetCapabilities',
    abs:'Temperature',
    layer:'Temperature'
  },{
    title:'Z Geopotencial',
    thumbnail:server + 'adagucserver?dataset=SOND&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Z&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,61,25&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + 'adagucserver?dataset=SOND&&service=WMS&request=GetCapabilities',
    abs:'Altura del Geopotencial',
    layer:'Z'
  }//,{
   // title:'Viento',
   // thumbnail:server + 'adagucserver?dataset=SOND&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Wind&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,61,25&FORMAT=image/png&TRANSPARENT=TRUE&',
   // service:server + 'adagucserver?dataset=SOND&&service=WMS&request=GetCapabilities',
   // abs:'Barbas de viento',
   // layer:'Wind'
  //}
]
//Contenido de subcarpeta TAJO
var dataChooserConfigurationTAJO = [
  {
    title:'Temperatura',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Temp_TAJO&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Temp_TAJO'
  },{
    title:'HumedadR',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,HR_TAJO&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'HR_TAJO'
    },{
    title:'PREC_ACUM_10m',
    thumbnail:server + 'adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Prec_TAJO&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Prec_TAJO'
    },{
    title:'PRES',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,PRES_TAJO&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'PRES_TAJO'
    },{
    title:'VIENTO',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Wind_TAJO&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Wind_TAJO'
    },{
    title:'COMB',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multiLayer_TAJO&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multiLayer_TAJO'
    }
];
//Contenido de subcarpeta XUNTA
var dataChooserConfigurationXUNTA = [
  {
    title:'Temperatura',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Temp_XUNTA&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Temp_XUNTA'
  },{
    title:'HumedadR',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,HR_XUNTA&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'HR_XUNTA'
    },{
    title:'PREC_ACUM_10m',
    thumbnail:server + 'adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Prec_XUNTA&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Prec_XUNTA'
    },{
    title:'PRES',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,PRES_XUNTA&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'PRES_XUNTA'
    },{
    title:'VIENTO',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Wind_XUNTA&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Wind_XUNTA'
    },{
    title:'COMB',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multiLayer_XUNTA&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multiLayer_XUNTA'
    }

/*{
    title:'SEACV2',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multi_SEACV2&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multi_SEACV2'
  },{
    title:'VAISALA',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multi_VAISALA&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multi_VAISALA'
  },{
title:'ESOC',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multi_ESOC&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multi_ESOC'
  },{
title:'ESOS',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multi_ESOS&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multi_ESOS'
  },{
title:'NSIM',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multi_NSIM&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multi_NSIM'
  },{
title:'IP-PROXY',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multi_IPPROXY&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multi_IPPROXY'
  },{
title:'SIMAS',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multi_SIMAS&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multi_SIMAS'
  },{
title:'SOSS',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multi_SOSS&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multi_SOSS'
  },{
	  title:'VAISALAhor',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multi_VAISALAhor&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multi_VAISALAhor'
  },{
	  title:'RESTO',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multi_RESTO&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multi_RESTO'
  }*/
];

//Contenido subcarpeta AEMET
var dataChooserConfigurationAEMET = [
    {
    title:'PREC_ACUM_10m',
    thumbnail:server + 'adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Prec&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Prec'
    },{
    title:'VIENTO',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Wind&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Wind'
    },{
    title:'Temperatura',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Temp&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Temp'
    },{
    title:'HumedadR',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,HR&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'HR'
    },{
    title:'PRES',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,PRES&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'PRES'
    },{
    title:'COMB',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,multiLayer&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'multiLayer'
    }

]

//Contenido subcarpeta VISOR
var dataChooserConfigurationVISOR = [
    {
    title:'PREC_ACUM_10m',
    abs: "Precipitacion Acumulada en 10 minutos",
    thumbnail:server + 'adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Prec_V&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Prec_V'
    },{
    title:'PREC_ACUM_1H',
    abs: "Precipitacion Acumulada en 1 Hora",
    thumbnail:server + 'adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,P1H_V&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'P1H_V'
    },{
    title:'PREC_ACUM_3H',
    abs: "Precipitacion Acumulada en 3 Horas",
    thumbnail:server + 'adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,P3H_V&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'P3H_V'
    },{
    title:'PREC_ACUM_6H',
    abs: "Precipitacion Acumulada en 6 Horas",
    thumbnail:server + 'adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,P6H_V&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'P6H_V'
    },{
    title:'PREC_ACUM_12H',
    abs: "Precipitacion Acumulada en 12 Horas",
    thumbnail:server + 'adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,P12H_V&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'P12H_V'
    },{
    title:'PREC_ACUM_24H',
    abs: "Precipitacion Acumulada en 24 Horas",
    thumbnail:server + 'adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,P24H_V&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'P24H_V'
    },{
    title:'VIENTO',
    abs: "Viento medio 10m",
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Wind_V&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Wind_V'
    },{
    title:'Temperatura',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Temp_V&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Temp_V'
    }

]


//Contenido subcarpeta METAR
var dataChooserConfigurationMETAR = [
  {
    title:'METAR',
    thumbnail:server + '/adagucserver?dataset=METAR&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,T_Td_Vis&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=METAR&&service=WMS&request=GetCapabilities',
    layer:'T_Td_Vis'
  }
]

var dataChooserConfigurationBOYAS_E = [
{
    title:'WIND',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Wind_BOYAS&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Wind_BOYAS'
  },{
    title:'MAR_FONDO',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,Corriente&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'Corriente'
  },{
    title:'TA',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,TA_BOYAS&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'TA_BOYAS'

  },{
    title:'TA_MAR',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,TA_MAR&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'TA_MAR'
  }, {
    title:'ALT_OLAS',
    thumbnail:server + '/adagucserver?dataset=EMAS&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,ALT_OLAS&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    abs:"Altura de las Olas",
    service:server + '/adagucserver?dataset=EMAS&&service=WMS&request=GetCapabilities',
    layer:'ALT_OLAS'
  }
]


//Contenido carpeta del menu OBS
var dataChooserConfigurationFoldersOBS = [
  { title:"VISOR",
    thumbnail:'./img/open-file-folder.png',
    abs:"Estaciones Automaticas de la aplicación VISOR",
    dataChooserConfiguration: dataChooserConfigurationVISOR
  },
  {
    title:"AEMET",
    thumbnail:'./img/open-file-folder.png',
    abs:"Parametros generales de todas las EMAS",
    dataChooserConfiguration: dataChooserConfigurationAEMET
  },{
    title:"TAJO",
    thumbnail:'./img/open-file-folder.png',
    abs:"EMAS de Conf Hidro TAJO",
    dataChooserConfiguration: dataChooserConfigurationTAJO
  },{
    title:"XUNTA",
    thumbnail:'./img/open-file-folder.png',
    abs:"EMAS de Conf Hidro XUNTA",
    dataChooserConfiguration: dataChooserConfigurationXUNTA
  },{
    title:"METAR",
    thumbnail:'./img/open-file-folder.png',
    abs:"Productos METAR",
    dataChooserConfiguration: dataChooserConfigurationMETAR
  },{
    title:"BOYAS",
    thumbnail:'./img/open-file-folder.png',
    dataChooserConfiguration: dataChooserConfigurationBOYAS_E
  },{
    title:"SONDEOS",
    thumbnail:'./img/open-file-folder.png',
    dataChooserConfiguration: dataChooserConfigurationTEMP
  },{
    title:"OBS ALTURA",
    abs:"T,Z,humedad y viento en niveles mandatory de sondeos",
    thumbnail:'./img/open-file-folder.png',
    dataChooserConfiguration: dataChooserConfigurationMAND
  }

];

//--------------------------------------- FIN CARPETA OBS -----------------------------------------------------------------

//--------------------------------------- CARPETA TEL (Teledeteccion) -----------------------------------------------------

//Contenido de la subcarpeta RAYOS
var dataChooserConfigurationRAY = [
  {
title:'RAYOS',
    thumbnail:server + '/wms?DATASET=LIGHTNING&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,LIGHTNING_lightningAddLayers&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=LIGHTNING&',
    layer:'LIGHTNING',
  }
]

//Contenido de la subcarpeta PPI
var dataChooserConfigurationPPI = [
  {
    title:'PPI-ALM',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_ALM_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_ALM_mask',
  },
  {
    title:'PPI-BAD',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_BAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_BAD_mask',
  },
  {
    title:'PPI-BAR',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_BAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_BAR_mask',
  },
  {
    title:'PPI-COR',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_COR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_COR_mask',
  },
  {
    title:'PPI-LID',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_LID_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_LID_mask',
  },
  {
    title:'PPI-MAD',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_MAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_MAD_mask',
  },
  {
    title:'PPI-MAL',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_MAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_MAL_mask',
  },
  {
    title:'PPI-MUR',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_MUR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_MUR_mask',
  },
  {
    title:'PPI-PMA',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_PMA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_PMA_mask',
  },
  {
    title:'PPI-SAN',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_SAN_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_SAN_mask',
  },
  {
    title:'PPI-SEV',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_SEV_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_SEV_mask',
  },
  {
    title:'PPI-SSE',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_SSE_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_SSE_mask',
  },
  {
    title:'PPI-VAL',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_VAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_VAL_mask',
  },
  {
    title:'PPI-ZAR',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_ZAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_ZAR_mask',
  },
  {
    title:'PPI-LPA',
    thumbnail:server + '/wms?DATASET=IRIS-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_LPA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPI&',
    layer:'irisPPI_LPA_mask',
  },
  {
    title:'PPI-COMP-NAC',
    thumbnail:server + '/wms?DATASET=IRIS-COM-PPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPI_COM_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-COM-PPI&',
    layer:'irisPPI_COM_mask',
  }


]
//contenido de la subcarpeta CAPPI
var dataChooserConfigurationCAPPI = [
  {
    title:'CAPPI-ALM',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_ALM_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_ALM_mask',
  },
  {
    title:'CAPPI-BAD',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_BAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_BAD_mask',
  },
  {
    title:'CAPPI-BAR',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_BAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_BAR_mask',
  },
  {
    title:'CAPPI-COR',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_COR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_COR_mask',
  },
  {
    title:'CAPPI-LID',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_LID_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_LID_mask',
  },
  {
    title:'CAPPI-MAD',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_MAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_MAD_mask',
  },
  {
    title:'CAPPI-MAL',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_MAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_MAL_mask',
  },
  {
    title:'CAPPI-MUR',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_MUR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_MUR_mask',
  },
  {
    title:'CAPPI-PMA',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_PMA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_PMA_mask',
  },
  {
    title:'CAPPI-SAN',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_SAN_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_SAN_mask',
  },
  {
    title:'CAPPI-SEV',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_SEV_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_SEV_mask',
  },
  {
    title:'CAPPI-SSE',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_SSE_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_SSE_mask',
  },
  {
    title:'CAPPI-VAL',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_VAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_VAL_mask',
  },
  {
    title:'CAPPI-ZAR',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_ZAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_ZAR_mask',
  },
  {
    title:'CAPPI-LPA',
    thumbnail:server + '/wms?DATASET=IRIS-CAPPI&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisCAPPI_LPA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-CAPPI&',
    layer:'irisCAPPI_LPA_mask',
  }
]

//contenido de la subcarpeta ECHO-TOP
var dataChooserConfigurationTOPS = [
   {
    title:'TOPS-ALM',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_ALM_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_ALM_mask',
  },
  {
    title:'TOPS-BAD',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_BAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_BAD_mask',
  },
  {
    title:'TOPS-BAR',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_BAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_BAR_mask',
  },
  {
    title:'TOPS-COR',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_COR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_COR_mask',
  },
  {
    title:'TOPS-LID',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_LID_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_LID_mask',
  },
  {
    title:'TOPS-MAD',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_MAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_MAD_mask',
  },
  {
    title:'TOPS-MAL',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_MAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_MAL_mask',
  },
  {
    title:'TOPS-MUR',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_MUR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_MUR_mask',
  },
  {
    title:'TOPS-PMA',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_PMA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_PMA_mask',
  },
   {
    title:'TOPS-SAN',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_SAN_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_SAN_mask',
  },
  {
    title:'TOPS-SEV',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_SEV_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_SEV_mask',
  },
  {
    title:'TOPS-SSE',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_SSE_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_SSE_mask',
  },
  {
    title:'TOPS-VAL',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_VAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_VAL_mask',
  },
  {
    title:'TOPS-ZAR',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_ZAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_ZAR_mask',
  },
  {
    title:'TOPS-LPA',
    thumbnail:server + '/wms?DATASET=IRIS-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_LPA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-TOPS&',
    layer:'irisTOPS_LPA_mask',
  },
  {
    title:'TOPS-COM-NAC',
    thumbnail:server + '/wms?DATASET=IRIS-COM-TOPS&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisTOPS_COM_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-COM-TOPS&',
    layer:'irisTOPS_COM_mask',
  }
]

//contenido carpeta ACUM1H
var dataChooserConfigurationAC1H = [
  {
    title:'ACUM1H-ALM',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_ALM_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_ALM_fullRange',
  },
  {
    title:'ACUM1H-BAD',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_BAD_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_BAD_fullRange',
  },
  {
    title:'ACUM1H-BAR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_BAR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_BAR_fullRange',
  },
  {
    title:'ACUM1H-COR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_COR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_COR_fullRange',
  },
  {
    title:'ACUM1H-LID',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_LID_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_LID_fullRange',
  },
  {
    title:'ACUM1H-MAD',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_MAD_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_MAD_fullRange',
  },
  {
    title:'ACUM1H-MAL',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_MAL_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_MAL_fullRange',
  },
  {
    title:'ACUM1H-MUR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_MUR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_MUR_fullRange',
  },
  {
    title:'ACUM1H-PMA',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_PMA_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_PMA_fullRange',
  },
  {
    title:'ACUM1H-SAN',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_SAN_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_SAN_fullRange',
  },
  {
    title:'ACUM1H-SEV',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_SEV_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_SEV_fullRange',
  },
  {
    title:'ACUM1H-SSE',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_SSE_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_SSE_fullRange',
  },
  {
    title:'ACUM1H-VAL',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_VAL_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_VAL_fullRange',
  },
  {
    title:'ACUM1H-ZAR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_ZAR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_ZAR_fullRange',
  },
  {
    title:'ACUM1H-LPA',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_LPA_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM1H&',
    layer:'irisACUM1H_LPA_fullRange',
  },
  {
    title:'ACUM1H-COMP-NAC',
    thumbnail:server + '/wms?DATASET=IRIS-COM-ACUM1H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM1H_COM_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-COM-ACUM1H&',
    layer:'irisACUM1H_COM_fullRange',
  }

]

//contenido carpeta ACUM6H
var dataChooserConfigurationAC6H = [
  {
    title:'ACUM6H-ALM',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_ALM_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_ALM_fullRange',
  },
  {
    title:'ACUM6H-BAD',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_BAD_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_BAD_fullRange',
  },
  {
    title:'ACUM6H-BAR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_BAR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_BAR_fullRange',
  },
  {
    title:'ACUM6H-COR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_COR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_COR_fullRange',
  },
  {
    title:'ACUM6H-LID',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_LID_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_LID_fullRange',
  },
  {
    title:'ACUM6H-MAD',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_MAD_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_MAD_fullRange',
  },
  {
    title:'ACUM6H-MAL',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_MAL_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_MAL_fullRange',
  },
  {
    title:'ACUM6H-MUR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_MUR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_MUR_fullRange',
  },
  {
    title:'ACUM6H-PMA',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_PMA_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_PMA_fullRange',
  }, 
  {
    title:'ACUM6H-SAN',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_SAN_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_SAN_fullRange',
  },
  {
    title:'ACUM6H-SEV',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_SEV_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_SEV_fullRange',
  },
  {
    title:'ACUM6H-SSE',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_SSE_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_SSE_fullRange',
  },
  {
    title:'ACUM6H-VAL',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_VAL_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_VAL_fullRange',
  },
  {
    title:'ACUM6H-ZAR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_ZAR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_ZAR_fullRange',
  },
  {
    title:'ACUM6H-LPA',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_LPA_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM6H&',
    layer:'irisACUM6H_LPA_fullRange',
  },
  {
    title:'ACUM6H-COMP-NAC',
    thumbnail:server + '/wms?DATASET=IRIS-COM-ACUM6H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM6H_COM_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-COM-ACUM6H&',
    layer:'irisACUM6H_COM_fullRange',
  }

]

//contenido carpeta ACUM24H
var dataChooserConfigurationAC24H = [
  {
    title:'ACUM24H-ALM',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_ALM_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_ALM_fullRange',
  },
  {
    title:'ACUM24H-BAD',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_BAD_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_BAD_fullRange',
  },
  {
    title:'ACUM24H-BAR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_BAR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_BAR_fullRange',
  },
  {
    title:'ACUM24H-COR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_COR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_COR_fullRange',
  },
  {
    title:'ACUM24H-LID',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_LID_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_LID_fullRange',
  },
  {
    title:'ACUM24H-MAD',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_MAD_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_MAD_fullRange',
  },
  {
    title:'ACUM24H-MAL',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_MAL_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_MAL_fullRange',
  },
  {
    title:'ACUM24H-MUR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_MUR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_MUR_fullRange',
  },
  {
    title:'ACUM24H-PMA',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_PMA_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_PMA_fullRange',
  },  
  {
    title:'ACUM24H-SAN',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_SAN_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_SAN_fullRange',
  },
  {
    title:'ACUM24H-SEV',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_SEV_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_SEV_fullRange',
  },
  {
    title:'ACUM24H-SSE',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_SSE_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_SSE_fullRange',
  },
  {
    title:'ACUM24H-VAL',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_VAL_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_VAL_fullRange',
  },
  {
    title:'ACUM24H-ZAR',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_ZAR_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_ZAR_fullRange',
  },
  {
    title:'ACUM24H-LPA',
    thumbnail:server + '/wms?DATASET=IRIS-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_LPA_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-ACUM24H&',
    layer:'irisACUM24H_LPA_fullRange',
  },
  {
    title:'ACUM24H-COMP-NAC',
    thumbnail:server + '/wms?DATASET=IRIS-COM-ACUM24H&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisACUM24H_COM_fullRange&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-COM-ACUM24H&',
    layer:'irisACUM24H_COM_fullRange',
  }

]


//contenido carpeta VIL
var dataChooserConfigurationVIL = [
  {
    title:'VIL-ALM',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_ALM_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_ALM_mask',
  },
  {
    title:'VIL-BAD',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_BAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_BAD_mask',
  },
  {
    title:'VIL-BAR',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_BAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_BAR_mask',
  },
  {
    title:'VIL-COR',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_COR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_COR_mask',
  },
   {
    title:'VIL-LID',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_LID_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_LID_mask',
  },
  {
    title:'VIL-MAD',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_MAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_MAD_mask',
  },
  {
    title:'VIL-MAL',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_MAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_MAL_mask',
  },
  {
    title:'VIL-MUR',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_MUR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_MUR_mask',
  },
  {
    title:'VIL-PMA',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_PMA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_PMA_mask',
  },
  {
    title:'VIL-SAN',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_SAN_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_SAN_mask',
  },
  {
    title:'VIL-SEV',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_SEV_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_SEV_mask',
  },
  {
    title:'VIL-SSE',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_SSE_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_SSE_mask',
  },
  {
    title:'VIL-VAL',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_VAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_VAL_mask',
  },
  {
    title:'VIL-ZAR',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_ZAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_ZAR_mask',
  },
  {
    title:'VIL-LPA',
    thumbnail:server + '/wms?DATASET=IRIS-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_LPA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-VIL&',
    layer:'irisVIL_LPA_mask',
  },
  {
    title:'VIL-COMP-NAC',
    thumbnail:server + '/wms?DATASET=IRIS-COM-VIL&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisVIL_COM_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-COM-VIL&',
    layer:'irisVIL_COM_mask',
  }

]

//contenido carpeta PPID
var dataChooserConfigurationPPID = [
  {
    title:'PPID-ALM',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_ALM_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_ALM_mask',
  },
  {
    title:'PPID-BAD',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_BAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_BAD_mask',
  },
  {
    title:'PPID-BAR',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_BAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_BAR_mask',
  },
  {
    title:'PPID-COR',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_COR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_COR_mask',
  },
   {
    title:'PPID-LID',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_LID_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_LID_mask',
  },
  {
    title:'PPID-MAD',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_MAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_MAD_mask',
  },
  {
    title:'PPID-MAL',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_MAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_MAL_mask',
  },
  {
    title:'PPID-MUR',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_MUR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_MUR_mask',
  },
  {
    title:'PPID-PMA',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_PMA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_PMA_mask',
  },
  {
    title:'PPID-SAN',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_SAN_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_SAN_mask',
  },
  {
    title:'PPID-SEV',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_SEV_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_SEV_mask',
  },
  {
    title:'PPID-SSE',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_SSE_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_SSE_mask',
  },
  {
    title:'PPID-VAL',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_VAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_VAL_mask',
  },
  {
    title:'PPID-ZAR',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_ZAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_ZAR_mask',
  },
  {
    title:'PPID-LPA',
    thumbnail:server + '/wms?DATASET=IRIS-PPID&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPID_LPA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPID&',
    layer:'irisPPID_LPA_mask',
  },
]

//contenido carpeta PPIW
var dataChooserConfigurationPPIW = [
  {
    title:'PPIW-ALM',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_ALM_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_ALM_mask',
  },
  {
    title:'PPIW-BAD',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_BAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_BAD_mask',
  },
  {
    title:'PPIW-BAR',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_BAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_BAR_mask',
  },
  {
    title:'PPIW-COR',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_COR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_COR_mask',
  },
   {
    title:'PPIW-LID',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_LID_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_LID_mask',
  },
  {
    title:'PPIW-MAD',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_MAD_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_MAD_mask',
  },
  {
    title:'PPIW-MAL',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_MAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_MAL_mask',
  },
  {
    title:'PPIW-MUR',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_MUR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_MUR_mask',
  },
  {
    title:'PPIW-PMA',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_PMA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_PMA_mask',
  },
  {
    title:'PPIW-SAN',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_SAN_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_SAN_mask',
  },
  {
    title:'PPIW-SEV',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_SEV_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_SEV_mask',
  },
  {
    title:'PPIW-SSE',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_SSE_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_SSE_mask',
  },
  {
    title:'PPIW-VAL',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_VAL_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_VAL_mask',
  },
  {
    title:'PPIW-ZAR',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_ZAR_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_ZAR_mask',
  },
  {
    title:'PPIW-LPA',
    thumbnail:server + '/wms?DATASET=IRIS-PPIW&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,irisPPIW_LPA_mask&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=IRIS-PPIW&',
    layer:'irisPPIW_LPA_mask',
  },
]

//Contenido carpeta YRADAR
var dataChooserConfigurationYRAD2D = [
  {
    title:'YRAD2D-ALM',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_ALM&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_ALM',
  },
  {
    title:'YRAD2D-BAD',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_BAD&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_BAD',
  },
  {
    title:'YRAD2D-BAR',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_BAR&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_BAR',
  },
  {
    title:'YRAD2D-COR',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_COR&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_COR',
  },
   {
    title:'YRAD2D-LID',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_LID&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_LID',
  },
  {
    title:'YRAD2D-MAD',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_MAD&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_MAD',
  },
  {
    title:'YRAD2D-MAL',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_MAL&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_MAL',
  },
  {
    title:'YRAD2D-MUR',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_MUR&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_MUR',
  },
  {
    title:'YRAD2D-PMA',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_PMA&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_PMA',
  },
  {
    title:'YRAD2D-SAN',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_SAN&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_SAN',
  },
  {
    title:'YRAD2D-SEV',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_SEV&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_SEV',
  },
  {
    title:'YRAD2D-SSE',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_SSE&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_SSE',
  },
  {
    title:'YRAD2D-VAL',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_VAL&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_VAL',
  },
  {
    title:'YRAD2D-ZAR',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_ZAR&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_ZAR',
  },
  {
    title:'YRAD2D-LPA',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_LPA&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD2D_LPA',
  },{
    title:'YRAD2D-NAC',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_NAC&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    abs:'Composicion yradr a partir de la composicion nacional radar',
    layer:'YRAD2D_NAC',
  },{
    title:'YRAD2D-COM',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD2D_COM&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    abs:'Composicion de todos los YRADAR REG',
    layer:'YRAD2D_COM',
  }
]

//Contenido carpeta YRADAR3D
var dataChooserConfigurationYRAD3D = [
  {
    title:'YRAD3D-ALM',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_ALM&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_ALM',
  },
  {
    title:'YRAD3D-BAD',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_BAD&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_BAD',
  },
  {
    title:'YRAD3D-BAR',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_BAR&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_BAR',
  },
  {
    title:'YRAD3D-COR',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_COR&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_COR',
  },
   {
    title:'YRAD3D-LID',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_LID&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_LID',
  }, {
    title:'YRAD3D-MAD',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_MAD&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_MAD',
  },
  {
    title:'YRAD3D-MAL',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_MAL&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_MAL',
  },
  {
    title:'YRAD3D-MUR',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_MUR&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_MUR',
  },
  {
    title:'YRAD3D-PMA',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_PMA&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_PMA',
  },
  {
    title:'YRAD3D-SAN',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_SAN&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_SAN',
  },
  {
    title:'YRAD3D-SEV',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_SEV&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_SEV',
  },
  {
    title:'YRAD3D-SSE',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_SSE&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_SSE',
  },
  {
    title:'YRAD3D-VAL',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_VAL&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_VAL',
  },
  {
    title:'YRAD3D-ZAR',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_ZAR&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_ZAR',
  },
  {
    title:'YRAD3D-LPA',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_LPA&&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    layer:'YRAD3D_LPA',
  },{
    title:'YRAD3D-COM',
    thumbnail:server + '/wms?DATASET=YRADAR&SERVICE=WMS&REQUEST=GetMap&&VERSION=1.1.1&SRS=EPSG:4326&LAYERS=overlay,YRAD3D_COM&BBOX=-20,25,10,50WIDTH=900&HEIGHT=800&FORMAT=image/png&TRANSPARENT=TRUE',
    service:server + '/adagucserver?dataset=YRADAR&',
    abs:'Composicion de todos los YRADAR REG',
    layer:'YRAD3D_COM',
  }
]


//Contenido carpeta OPERA
var dataChooserConfigurationMSGOPE = [
  {
    title:'OPERA-RATE',
    thumbnail:server + '/adagucserver?dataset=OPERA-COMP-RATE&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,OPERA_rainfall_rate&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=OPERA-COMP-RATE&&service=WMS&request=GetCapabilities',
    layer:'OPERA_rainfall_rate'
  },
  {
    title:'OPERA-REF',
    thumbnail:server + '/adagucserver?dataset=OPERA&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,OPERA_reflectivity&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=OPERA&&service=WMS&request=GetCapabilities',
    layer:'OPERA_reflectivity'
  },
  {
    title:'OPERA-ACUM',
    thumbnail:server + '/adagucserver?dataset=OPERA&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,OPERA_accumulated_precipitation&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=OPERA&&service=WMS&request=GetCapabilities',
    layer:'OPERA_accumulated_precipitation'
  }
]


//Contenido carpeta SST
var dataChooserConfigurationSST = [
  {
    title:'SST-CON',
    thumbnail:server + '/adagucserver?dataset=SST&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,sea_surface_temperature_contour&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=SST&&service=WMS&request=GetCapabilities',
    layer:'sea_surface_temperature_contour'
  },
  {
    title:'SST',
    thumbnail:server + '/adagucserver?dataset=SST&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,sea_surface_temperature&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:server + '/adagucserver?dataset=SST&&service=WMS&request=GetCapabilities',
    layer:'sea_surface_temperature'
  }
]

//Contenido carpeta del menu TEL
var dataChooserConfigurationFoldersTEL = [
  {
  title:"RAYOS",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationRAY
  },	
  {
  title:"PPI",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationPPI
  },
  {
  title:"CAPPI",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationCAPPI
  },
  {
  title:"ECHO-TOP",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationTOPS
  },
  {
  title:"ACUM1H",
  thumbnail:'./img/open-file-folder.png',
  abs:"RADAR IRIS ACUMULACION 1H",
  dataChooserConfiguration: dataChooserConfigurationAC1H
  },
  {
  title:"ACUM6H",
  thumbnail:'./img/open-file-folder.png',
  abs:"RADAR IRIS ACUMULACION 6H",
  dataChooserConfiguration: dataChooserConfigurationAC6H
  },
  {
  title:"ACUM24H",
  thumbnail:'./img/open-file-folder.png',
  abs:"RADAR IRIS ACUMULACION 24H",
  dataChooserConfiguration: dataChooserConfigurationAC24H
  },

  {
  title:"VIL",
  thumbnail:'./img/open-file-folder.png',
  abs:"RADAR IRIS VIL",
  dataChooserConfiguration: dataChooserConfigurationVIL
  },
  {
  title:"PPID",
  thumbnail:'./img/open-file-folder.png',
  abs:"RADAR IRIS PPI short range",
  dataChooserConfiguration: dataChooserConfigurationPPID
  },
  {
  title:"PPIW",
  thumbnail:'./img/open-file-folder.png',
  abs:"RADAR IRIS radial doppler wind",
  dataChooserConfiguration: dataChooserConfigurationPPIW
  },
  {
  title:"OPERA",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationMSGOPE
  },
  {
  title:"SST",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationSST
  },
  {
  title:"YRAD2D",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration:dataChooserConfigurationYRAD2D
  },
  {
  title:"YRAD3D",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration:dataChooserConfigurationYRAD3D
  },

]

//--------------------------------------------------- FIN CARPETA TEL ----------------------------------------------------

//--------------------------------------------------- CARPETA MSG --------------------------------------------------------

//Contenido de la subcarpeta MSG-IMG
var dataChooserConfigurationMSGIMG = [
{
  title:'HIGH RES',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=HRV,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-HRV&',
      layer:'HRV'
},{
  title:'VIS006',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=VIS006-REF,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-3Km&',
      layer:'VIS006-REF'
},{
  title:'VIS008',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=VIS008-REF,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-3Km&',
      layer:'VIS008-REF'
},{
  title:'IR016-REF',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR016-REF,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-3Km&',
      layer:'IR016-REF'
},{
  title:'IR039-BT',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR039-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-3Km&',
      layer:'IR039-BT'
},{
  title:'IR087-BT',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR087-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-3Km&',
      layer:'IR087-BT'
},{
  title:'IR097-BT',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR097-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-3Km&',
      layer:'IR097-BT'
},{
  title:'IR108-BT',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR108-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-3Km&',
      layer:'IR108-BT'
},{
  title:'IR120-BT',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR120-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-3Km&',
      layer:'IR120-BT'
},{
  title:'IR134-BT',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR134-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-3Km&',
      layer:'IR134-BT'
},{
  title:'WV062-BT',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=WV062-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-3Km&',
      layer:'WV062-BT'
},{
  title:'WV073-BT',
      thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=WV073-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=SEVIRI-3Km&',
      layer:'WV073-BT'
}
]

//Contenido de la subcarpeta MSG-RSS
var dataChooserConfigurationMSGRSS = [
{
  title:'HIGH RES',
      thumbnail:server + '/adagucserver?dataset=RSS-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=HRV,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-HRV&',
      layer:'HRV'
},{
  title:'VIS006',
      thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=VIS006-REF,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-3Km&',
      layer:'VIS006-REF'
},{
  title:'VIS008',
      thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=VIS008-REF,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-3Km&',
      layer:'VIS008-REF'
},{
  title:'IR016-REF',
      thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR016-REF,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-3Km&',
      layer:'IR016-REF'
},{
  title:'IR039-BT',
      thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR039-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-3Km&',
      layer:'IR039-BT'
},{
  title:'IR087-BT',
      thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR087-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-3Km&',
      layer:'IR087-BT'
},{
  title:'IR097-BT',
      thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR097-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-3Km&',
      layer:'IR097-BT'
},{
  title:'IR108-BT',
      thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR108-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-3Km&',
      layer:'IR108-BT'
},{
  title:'IR120-BT',
      thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR120-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-3Km&',
      layer:'IR120-BT'
},{
  title:'IR134-BT',
      thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR134-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-3Km&',
      layer:'IR134-BT'
},{
  title:'WV062-BT',
      thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=WV062-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-3Km&',
      layer:'WV062-BT'
},{
  title:'WV073-BT',
      thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=WV073-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RSS-3Km&',
      layer:'WV073-BT'
}
]

//Contenido de la subcarpeta MSG-RSS
var dataChooserConfigurationMSGIODC = [
{
  title:'HIGH RES',
      thumbnail:server + '/adagucserver?dataset=IODC-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=HRV,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-HRV&',
      layer:'HRV'
},{
  title:'VIS006',
      thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=VIS006-REF,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-3Km&',
      layer:'VIS006-REF'
},{
  title:'VIS008',
      thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=VIS008-REF,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-3Km&',
      layer:'VIS008-REF'
},{
  title:'IR016-REF',
      thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR016-REF,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-3Km&',
      layer:'IR016-REF'
},{
  title:'IR039-BT',
      thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR039-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-3Km&',
      layer:'IR039-BT'
},{
  title:'IR087-BT',
      thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR087-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-3Km&',
      layer:'IR087-BT'
},{
  title:'IR097-BT',
      thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR097-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-3Km&',
      layer:'IR097-BT'
},{
  title:'IR108-BT',
      thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR108-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-3Km&',
      layer:'IR108-BT'
},{
  title:'IR120-BT',
      thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR120-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-3Km&',
      layer:'IR120-BT'
},{
  title:'IR134-BT',
      thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR134-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-3Km&',
      layer:'IR134-BT'
},{
  title:'WV062-BT',
      thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=WV062-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-3Km&',
      layer:'WV062-BT'
},{
  title:'WV073-BT',
      thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=WV073-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IODC-3Km&',
      layer:'WV073-BT'
}
]


//Contenido carpeta MSG-RGB
var dataChooserConfigurationMSGRGB = [
  {title:'Airmass',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Airmass,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'Airmass'
},{
  title:'Ash',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Ash,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'Ash'
},{
  title:'CloudtopDaytime',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CloudtopDaytime,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'CloudtopDaytime'
},{
  title:'Cloudtop',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Cloudtop,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'Cloudtop'
},{
  title:'ColorizedIrClouds',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=ColorizedIrClouds,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'ColorizedIrClouds'
},{
  title:'Convection',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Convection,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'Convection'
},{
  title:'DayMicrophysics',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=DayMicrophysics,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'DayMicrophysics'
},{
  title:'DayMicrophysicsWinter',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=DayMicrophysicsWinter,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'DayMicrophysicsWinter'
},{
  title:'Dust',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Dust,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'Dust'
},{
  title:'Fog',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Fog,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'Fog'
},{
  title:'Snow',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Snow,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'Snow'
},{
  title:'NaturalColor',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=NaturalColor,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'NaturalColor'
},{
  title:'NaturalWithNightFog',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=NaturalWithNightFog,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'NaturalWithNightFog'
},{
  title:'NightFog',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=NightFog,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'NightFog'
},{
  title:'NightMicrophysics',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=NightMicrophysics,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'NightMicrophysics'
},{
  title:'Dust',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Dust,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'Dust'
},{
  title:'Fog',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Fog,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'Fog'
},{
  title:'IrOverview',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IrOverview,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'IrOverview'
},{
  title:'NaturalColorNoCorr',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=NaturalColorNocorr,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'NaturalColorNocorr'
},{
  title:'NaturalColorRaw',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=NaturalColorRaw,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'NaturalColorRaw'
},{
  title:'NaturalColor',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=NaturalColor,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'NaturalColor'
},{
  title:'NaturalEnh',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=NaturalEnh,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'NaturalEnh'
},{
  title:'NaturalWithNightFog',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=NaturalWithNightFog,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'NaturalWithNightFog'
},{
  title:'NightFog',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=NightFog,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'NightFog'
},{
  title:'NightIrAlpha',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=NightIrAlpha,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'NightIrAlpha'
},{
  title:'Overview',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Overview,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'Overview'
},{
  title:'Snow',
      thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Snow,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB&',
      layer:'Snow'
},{
  title:'Sandwich',
      thumbnail:server + '/adagucserver?dataset=RGB-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IrSandwich,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB-HRV&',
      layer:'IrSandwich'
},{
  title:'HrvFog',
      thumbnail:server + '/adagucserver?dataset=RGB-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=HrvFog,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB-HRV&',
      layer:'HrvFog'
}

]

//Contenido carpeta MSG-HighRGB
var dataChooserConfigurationMSGHRGB = [
{
  title:'GreenSnow',
      thumbnail:server + '/adagucserver?dataset=RGB-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=GreenSnow,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB-HRV&',
      layer:'GreenSnow'
},{
  title:'HrvClouds',
      thumbnail:server + '/adagucserver?dataset=RGB-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=HrvClouds,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB-HRV&',
      layer:'HrvClouds'
},{
  title:'HrvFog',
      thumbnail:server + '/adagucserver?dataset=RGB-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=HrvFog,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB-HRV&',
      layer:'HrvFog'
},{
  title:'HrvSevereStormsMasked',
      thumbnail:server + '/adagucserver?dataset=RGB-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=HrvSevereStormsMasked,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB-HRV&',
      layer:'HrvSevereStormsMasked'
},{
  title:'HrvSevereStorms',
      thumbnail:server + '/adagucserver?dataset=RGB-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=HrvSevereStorms,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB-HRV&',
      layer:'HrvSevereStorms'
},{
  title:'Sandwich',
      thumbnail:server + '/adagucserver?dataset=RGB-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IrSandwich,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB-HRV&',
      layer:'IrSandwich'
},{
  title:'RealisticColors',
      thumbnail:server + '/adagucserver?dataset=RGB-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=RealisticColors,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB-HRV&',
      layer:'RealisticColors'
},{
  title:'VisSharpenedIr',
      thumbnail:server + '/adagucserver?dataset=RGB-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=VisSharpenedIr,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=RGB-HRV&',
      layer:'VisSharpenedIr'
}

]

//Contenido carpeta MSG-SAF
var dataChooserConfigurationMSGSAF = [
  {
  title:'HIGH RES',
      thumbnail:server + '/adagucserver?dataset=HRV-REFN&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=HRV-REFN_data,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=HRV-REFN&',
      layer:'HRV-REFN_data'
  },{
  title:'VIS06',
      thumbnail:server + '/adagucserver?dataset=VIS06-REFN&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=VIS06-REFN_data,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=VIS06-REFN&',
      layer:'VIS06-REFN_data'
  },{
  title:'VIS08',
      thumbnail:server + '/adagucserver?dataset=VIS08-REFN&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=VIS08-REFN_data,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=VIS08-REFN&',
      layer:'VIS08-REFN_data'
  },{
  title:'IR38 BT',
      thumbnail:server + '/adagucserver?dataset=IR38-BT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR38-BT_data,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IR38-BT&',
      layer:'IR38-BT_data'
  },{
  title:'IR87 BT',
      thumbnail:server + '/adagucserver?dataset=IR87-BT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR87-BT_data,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IR87-BT&',
      layer:'IR87-BT_data'
  },{
  title:'IR97 BT',
      thumbnail:server + '/adagucserver?dataset=IR97-BT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR97-BT_data,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IR97-BT&',
      layer:'IR97-BT_data'
  },{
  title:'IR108 BT',
      thumbnail:server + '/adagucserver?dataset=IR108-BT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR108-BT_data,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IR108-BT&',
      layer:'IR108-BT_data'
  },{
  title:'IR120 BT',
      thumbnail:server + '/adagucserver?dataset=IR120-BT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR120-BT_data,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IR120-BT&',
      layer:'IR120-BT_data'
  },{
  title:'IR134 BT',
      thumbnail:server + '/adagucserver?dataset=IR134-BT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR134-BT_data,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=IR134-BT&',
      layer:'IR134-BT_data'
  },{
  title:'WV62 RAD',
      thumbnail:server + '/adagucserver?dataset=WV62-BT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=WV62-BT_data,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=WV62-BT&',
      layer:'WV62-BT_data'
  },{
  title:'WV73 RAD',
      thumbnail:server + '/adagucserver?dataset=WV73-BT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=WV73-BT_data,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
      service:server + '/adagucserver?dataset=WV73-BT&',
      layer:'WV73-BT_data'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/cma_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>Cloud Mask</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=CMA&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CMA_cma_cloudsnow,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=CMA&',
        layer:'CMA_cma_cloudsnow'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/ct_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>Cloud Type</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=CT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CT_ct,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=CT&',
        layer:'CT_ct'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/exim_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>EXIM CT</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=CT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CT_ct,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=EXIM-CT&',
        layer:'EXIM_CT_ct'
  },{
    title:"<body> <table><tr><td><a href='https://en.wikipedia.org/wiki/Flight_level' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>CTTH FL</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=IMASK&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IMASK_imask_ctth_FL,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=IMASK&',
        layer:'IMASK_imask_ctth_FL'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/ctth_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>CTTH meters</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=CTTH&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CTTH_ctth_alti,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=CTTH&',
        layer:'CTTH_ctth_alti'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/cmic_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>CMIC</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=CMIC&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CMIC_cmic_phase,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=CMIC&',
        layer:'CMIC_cmic_phase'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/crr_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>CRR</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=CRR&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CRR_crr_intensity,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=CRR&',
        layer:'CRR_crr_intensity'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/crr-ph_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>CRR Ph</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=CRRPh&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CRRPh_crrph_intensity,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=CRRPh&',
        layer:'CRRPh_crrph_intensity'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/pc_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>PC</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=PC&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=PC_pc,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=PC&',
        layer:'PC_pc'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/pc-ph_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>PCPh</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=PC-Ph&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=PC-Ph_pcph,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=PC-Ph&',
        layer:'PC-Ph_pcph'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/rdt_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>RDT-CW</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=RDT_NOW&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,RDT&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/wms?DATASET=RDT_NOW&',
        layer:'RDT'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/ci_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>CI</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=CI&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CI_ci_prob90,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=CI&',
        layer:'CI_ci_prob90'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/ishai_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>LIFTED INDEX</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=iSHAI&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=iSHAI_IR_band,iSHAI_ishai_li,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=PRECONV&',
        layer:'LIFTED'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/ishai_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>HUMIDITY DIF NWP/MSG</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=iSHAI&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=iSHAI_IR_band,iSHAI_ishai_diffml,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=PRECONV&',
        layer:'DIFFERENCES'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/hrw_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>WIND</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=HRW&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=overlay,windHRW&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=HRW&',
        layer:'Wind_pressure'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/asii-ng_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>ASII TF</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=ASII-TF&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=ASII-TF_asii_turb_trop_prob,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=ASII-TF&',
        layer:'ASII-TF_asii_turb_trop_prob'
  },{
    title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/asii-ng_description' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td>ASII GW</td><td>&nbsp;&nbsp;</td><td></td></tr></table></body>",
        thumbnail:server + '/adagucserver?dataset=ASII-GW&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=ASII-GW_asii_turb_wave_prob,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=ASII-GW&',
        layer:'ASII-GW_asii_turb_wave_prob'
  },{
    title:'IMASK',
        thumbnail:server + '/adagucserver?dataset=IMASK&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IMASK_imask,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
        service:server + '/adagucserver?dataset=IMASK&',
        layer:'IMASK_imask'
  }
]


//Contenido carpeta del menu MSG
var dataChooserConfigurationFoldersMSG = [
  {
  title:"<body> <table><tr><td><a href='https://www.eumetsat.int/mfg-calibration' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td><b>&nbsp;&nbsp;METEOSAT 0DEG IMAGES /Refl.</b></td><td>&nbsp;&nbsp;</td><td><h1 ><img src='./img/folder-icon-transparent.png' width='30' height='30'></h1></td></tr></table></body>",
  thumbnail:server + '/adagucserver?dataset=SEVIRI-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR108-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
  dataChooserConfiguration: dataChooserConfigurationMSGIMG
  },
  {
  title:"<body> <table><tr><td><a href='https://www.eumetsat.int/mfg-calibration' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td><b>&nbsp;&nbsp;METEOSAT RSS IMAGES /Refl.</b></td><td>&nbsp;&nbsp;</td><td><h1 ><img src='./img/folder-icon-transparent.png' width='30' height='30'></h1></td></tr></table></body>",
  thumbnail:server + '/adagucserver?dataset=RSS-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR108-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
  dataChooserConfiguration: dataChooserConfigurationMSGRSS
  },
  {
  title:"<body> <table><tr><td><a href='https://www.eumetsat.int/mfg-calibration' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td><b>&nbsp;&nbsp;METEOSAT IODC IMAGES /Refl.</b></td><td>&nbsp;&nbsp;</td><td><h1 ><img src='./img/folder-icon-transparent.png' width='30' height='30'></h1></td></tr></table></body>",
  thumbnail:server + '/adagucserver?dataset=IODC-3Km&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=IR108-BT,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=15,40,36,70&FORMAT=image/png&TRANSPARENT=TRUE&',
  dataChooserConfiguration: dataChooserConfigurationMSGIODC
  },
  {
  title:"<body> <table><tr><td><a href='http://www.eumetrain.org/RGBguide/rgbs.html' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td><b>&nbsp;&nbsp;     METEOSAT RGB</b></td><td>&nbsp;&nbsp;</td><td><h1 ><img src='./img/folder-icon-transparent.png' width='30' height='30'></h1></td></tr></table></body>",
  thumbnail:server + '/adagucserver?dataset=RGB&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Ash,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=26,-20,30,-13&FORMAT=image/png&TRANSPARENT=TRUE&',
  dataChooserConfiguration: dataChooserConfigurationMSGRGB
  },
  {
  title:"<body> <table><tr><td><a href='http://www.eumetrain.org/RGBguide/rgbs.html'  target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td><b>&nbsp;&nbsp;METEOSAT hight Resolution RGB</b></td><td>&nbsp;&nbsp;</td><td><h1 ><img src='./img/folder-icon-transparent.png' width='30' height='30'></h1></td></tr></table></body>",
  thumbnail:server + '/adagucserver?dataset=RGB-HRV&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=HrvFog,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE&',
  dataChooserConfiguration: dataChooserConfigurationMSGHRGB
  },
  {
  title:"<body> <table><tr><td><a href='https://www.nwcsaf.org/' target='_blank' rel='noopener noreferrer'>info</a></td><td>&nbsp;&nbsp;</td><td><b>&nbsp;&nbsp;NWC SAF METEOSAT Based</b></td><td>&nbsp;&nbsp;</td><td><h1 ><img src='./img/folder-icon-transparent.png' width='30' height='30'></h1></td></tr></table></body>",
  thumbnail:server + '/adagucserver?dataset=CT&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=CT_ct,overlay&WIDTH=400&HEIGHT=350&CRS=EPSG:4326&BBOX=25,-20,46,10&FORMAT=image/png&TRANSPARENT=TRUE',
  dataChooserConfiguration: dataChooserConfigurationMSGSAF
  },
]
//----------------------------------------FIN CARPETA TEL ----------------------------------------------

//----------------------------------------CARPETA NWP --------------------------------------------------
//Contenido carpeta del menu NWP
//var dataChooserConfigurationFoldersNWP = [
//  {
//  title:"NWP",
//  thumbnail:'./img/open-file-folder.png',
//  dataChooserConfiguration: dataChooserConfigurationNWP
//  }
//]
//---------------------------------------FIN CARPETA NWP ------------------------------------------------
//
//----------------------------------------CARPETA MENU NWP --------------------------------------------------
//Contenido carpeta del menu NWP
var dataChooserConfigurationFoldersNWP = [
  {
  title:"ECMWF",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationECMWF
  },
  {
  title:"ECMWF-HRES",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationECMWFHRES
  },
  {
  title:"HARMONIE_AIB",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationHARMONIE_AIB
  },
  {
  title:"HARMONIE_AIC",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationHARMONIE_AIC
  },
  {
  title:"HARMONIE_AIN",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationHARMONIE_AIN
  },

  {
  title:"NWP",
  thumbnail:'./img/open-file-folder.png',
  dataChooserConfiguration: dataChooserConfigurationNWP
  }

]

//Definimos el nombre y contenido de los botones de la toolbar
var dataChooser =[
 /* {
    title: "NWP",
    dataChooserConfiguration: dataChooserConfigurationNWP
  }*/ 
];

//Definimos el nombre y el contenido de las carpetas de la toolbar
var folderChooser =[
 { 
   title: "NWP",
   dataChooserConfigurationFolder: dataChooserConfigurationFoldersNWP
 },
 {
   title: "MSG",
   dataChooserConfigurationFolder: dataChooserConfigurationFoldersMSG
 },
 {
   title: "OBS",
   dataChooserConfigurationFolder: dataChooserConfigurationFoldersOBS
 },
 {
 title: "TEL",
 dataChooserConfigurationFolder: dataChooserConfigurationFoldersTEL
 }
];


var mapTypeConfiguration = [  {
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
    
];

var defaultLanguage = { language: 'en' }; // <-- Language for the ADAGUC viewer.
var defaultUsernameSearch = "adaguc"; // <-- Username for the GeoNames API. 1
var geoNamesURL = "http://api.geonames.org/search?q={searchTerm}&username={username}&maxRows=1"; // <-- URL for the GeoNames API. Requires 'defaultUsernameSearch'    

var webMapJSSettings = {
  enableTouchDevice:true
}

//FOR JSP:
/*
var xml2jsonrequestURL = "/impactportal/AdagucViewer?SERVICE=XML2JSON&";
var requestProxy = "/impactportal/AdagucViewer?SERVICE=PROXY&";
*/

//For PHP:
var requestProxy       = "./webmapjs_php/MakeRequest.php?";
var xml2jsonrequestURL = "./webmapjs_php/xml2jsonrequest.php?"

//getFeatureInfoApplications.push({name:'EProfile',iconCls:'button_getfeatureinfo'});
getFeatureInfoApplications.push({name:'AutoWMS',iconCls:'button_getfeatureinfo'});
//getFeatureInfoApplications.push({name:'Hipatia',iconCls:'button_getfeatureinfo'});
getFeatureInfoApplications.open = "AutoWMS";
//getFeatureInfoApplications.open = "Hipatia";
//getFeatureInfoApplications.push({name:'Sondeo',iconCls:'button_getfeatureinfo',location:'apps/tddjs.html'});
getFeatureInfoApplications.push({name:'VertProfiles',iconCls:'button_getfeatureinfo',location:'apps/tddjs.html'});
getFeatureInfoApplications.push({name:'Yradar',iconCls:'button_getfeatureinfo',location:'apps/yradar.html'});
//getFeatureInfoApplications.open = 'EProfile';
// xml2jsonrequestURL = 'http://localhost:8080/adaguc-services/xml2json?'
// autowmsURL = 'http://localhost:8080/adaguc-services/autowms?';
// getFeatureInfoApplications.push({name:'AutoWMS',iconCls:'button_getfeatureinfo'});

var WMJSTileRendererTileSettings = {
 
  OSM: {
    'EPSG:3857': {
      home: 'https://b.tile.openstreetmap.org/',
      minLevel: 1,
      maxLevel: 16,
      tileServerType: 'osm',
      copyRight: 'Open Street Map'
    },
    'EPSG:28992': {
      home: 'http://services.arcgisonline.nl/ArcGIS/rest/services/Basiskaarten/PDOK_BRT/MapServer/tile/',
      minLevel: 1,
      maxLevel: 12,
      origX:-285401.92,
      origY:903401.92,
      resolution:3440.64,
      tileServerType: 'arcgisonline',
      copyRight: 'Basiskaart bronnen: PDOK, Kadaster, OpenStreetMap'
    }
  },
 TERRAIN: {
    'EPSG:3857': {
      home: 'http://d.tile.stamen.com/terrain/',
      minLevel: 1,
      maxLevel: 20,
      tileServerType: 'osm',
      copyRight: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    },
    'EPSG:28992': {
      home: 'http://services.arcgisonline.nl/ArcGIS/rest/services/Basiskaarten/PDOK_BRT/MapServer/tile/',
      minLevel: 1,
      maxLevel: 12,
      origX:-285401.92,
      origY:903401.92,
      resolution:3440.64,
      tileServerType: 'arcgisonline',
      copyRight: 'Basiskaart bronnen: PDOK, Kadaster, OpenStreetMap'
    }
  },
 LITE: {
    'EPSG:3857': {
      home: 'http://b.tile.stamen.com/toner-lite/',
      minLevel: 1,
      maxLevel: 20,
      tileServerType: 'osm',
      copyRight: 'Open Street Map'
    },
    'EPSG:28992': {
      home: 'http://services.arcgisonline.nl/ArcGIS/rest/services/Basiskaarten/PDOK_BRT/MapServer/tile/',
      minLevel: 1,
      maxLevel: 12,
      origX:-285401.92,
      origY:903401.92,
      resolution:3440.64,
      tileServerType: 'arcgisonline',
      copyRight: 'Basiskaart bronnen: PDOK, Kadaster, OpenStreetMap'
    }
  },
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
    "EPSG:3575-disabled": {
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
//Default of sinc of layers
sync_layer=false
//Default of Auto reload of layers
auto_load=true

xml2jsonrequestURL = '/adaguc-services/xml2json?'
//autowmsURL = '/adaguc-services/autowms?';
autowmsURL = server+'/autowms?';

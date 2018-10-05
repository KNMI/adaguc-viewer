export const WMJSEmptyLayerName = 'empty_layer';
export const WMJSEmptyLayerTitle = 'empty layer';
export const WMJSDateOutSideRange = 'outside range';
export const WMJSDateTooEarlyString = 'date too early';
export const WMJSDateTooLateString = 'date too late';
export const error = (e) => {
  console.log('error:' + e);
};
export const debug = (e) => {
  // console.log(e);
};

export const WMSVersion = {
  version100: '1.0.0',
  version111: '1.1.1',
  version130: '1.3.0'
};
export const WMJSProj4Defs = [
  [
    'EPSG:4326',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
  [
    'EPSG:4269',
    '+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees'
  ],
  [
    'EPSG:3575',
    '+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
  ],
  [
    'EPSG:3785',
    '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
  ],
  [
    'EPSG:3857',
    '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
  ],
  [
    'EPSG:3411',
    '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs'
  ],
  [
    'EPSG:3412',
    '+proj=stere +lat_0=-90 +lat_ts=-70 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs'
  ],
  [
    'EPSG:28992',
    '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs  <>'
  ],
  [
    'EPSG:32661',
    '+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
  ],
  [
    'EPSG:102100',
    '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
  ]
];

export const epsgDescriptionLookup = {
  'EPSG:3411': 'NSIDC Sea Ice Polar Stereographic North',
  'EPSG:3412': 'NSIDC Sea Ice Polar Stereographic South',
  'EPSG:3575': 'Lambert azimuthal equal-area projection Europe',
  'EPSG:3785': 'Mercator (deprecated)',
  'EPSG:3857': 'Mercator',
  'EPSG:4258': 'ETRS89',
  'EPSG:4326': 'World Lat lon WGS84',
  'CRS:84': 'World Lat lon WGS84',
  'EPSG:25831': 'ETRS89 / UTM zone 31N',
  'EPSG:25832': 'ETRS89 / UTM zone 32N',
  'EPSG:28992': 'Dutch Amersfoort / RD New',
  'EPSG:32661': 'Polar Stereographic WGS 84 / UPS North'
};

import WMJSBBOX from './WMJSBBOX.js';
/**
  * WMJSProjection Class
  * Keep all projection information, by a bbox and an srs value.
  */
export default class WMJSProjection {
  constructor () {
    this.bbox = new WMJSBBOX();
    this.srs = 'EPSG:4326';
  }
};

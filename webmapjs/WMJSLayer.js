import I18n from './I18n/lang.en.js';
import { isDefined, isNull, toArray, WMJScheckURL } from './WMJSTools.js';
import { WMJSEmptyLayerTitle, WMSVersion, error, debug } from './WMJSConstants.js';
import WMJSDimension from './WMJSDimension.js';
import WMJSProjection from './WMJSProjection.js';
import WMJSBBOX from './WMJSBBOX.js';
import WMJSGetServiceFromStore from './WMJSGetServiceFromStore.js';
export default class WMJSLayer {
  init () {
    this.autoupdate = false;
    this.timer = undefined;
    // options.failure is called when failed.
    this.service = undefined; // URL of the WMS Service
    this.WMJSService = undefined; // Corresponding WMJSService
    this.getmapURL = undefined;
    this.getfeatureinfoURL = undefined;
    this.getlegendgraphicURL = undefined;
    // this.getgraphinfoURL = undefined;
    this.keepOnTop = false;
    this.transparent = true;
    this.hasError = false;
    this.legendIsDimensionDependant = true;
    this.wms130bboxcompatibilitymode = false;
    this.version = WMSVersion.version111;
    this.path = '';
    this.type = 'wms';
    this.objectpath = [];
    this.wmsextensions.url = '';
    this.jsonlayer_v1_1_1 = undefined; // JSON data for this layer from getcapabilities XML file.
    this.name = undefined;
    this.title = WMJSEmptyLayerTitle;
    this.abstract = undefined;
    this.dimensions = [];// Array of Dimension
    this.legendGraphic = '';
    this.projectionProperties = [];// Array of WMJSProjections
    this.queryable = false;

    this.enabled = true;
    this.styles = undefined;
    this.currentStyle = '';
    this.id = -1;
    this.opacity = 1.0; // Ranges from 0.0-1.0
    this.getCapabilitiesDoc = undefined;
    this.serviceTitle = 'not defined';
    this.parentMaps = [];
  }

  constructor (options) {
    this.init = this.init.bind(this);
    this.wmsextensions = this.wmsextensions.bind(this);
    this.getLayerName = this.getLayerName.bind(this);
    this.toggleAutoUpdate = this.toggleAutoUpdate.bind(this);
    this.setAutoUpdate = this.setAutoUpdate.bind(this);
    this.setOpacity = this.setOpacity.bind(this);
    this.remove = this.remove.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.zoomToLayer = this.zoomToLayer.bind(this);
    this.draw = this.draw.bind(this);
    this.handleReferenceTime = this.handleReferenceTime.bind(this);
    this.setDimension = this.setDimension.bind(this);
    this.configureDimensions = this.configureDimensions.bind(this);
    this.parseLayer = this.parseLayer.bind(this);
    this.cloneLayer = this.cloneLayer.bind(this);
    this.setName = this.setName.bind(this);
    this.getLayerRelative = this.getLayerRelative.bind(this);
    this.autoSelectLayer = this.autoSelectLayer.bind(this);
    this.getNextLayer = this.getNextLayer.bind(this);
    this.getPreviousLayer = this.getPreviousLayer.bind(this);
    this.setStyle = this.setStyle.bind(this);
    this.getStyles = this.getStyles.bind(this);
    this.getStyleObject = this.getStyleObject.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.setService = this.setService.bind(this);
    this.getDimension = this.getDimension.bind(this);
    this.getProjection = this.getProjection.bind(this);
    this.display = this.display.bind(this);
    this.init();
    this._options = options;
    if (options) {
      // alert("WMJSLAYER:"+options.service);
      this.service = options.service;
      this.getmapURL = options.service;
      this.getfeatureinfoURL = options.service;
      this.getlegendgraphicURL = options.service;
      // this.name=options.layer;
      this.name = options.name;
      if (options.getgraphinfoURL) this.getgraphinfoURL = options.getgraphinfoURL;

      if (options.style) {
        this.currentStyle = options.style;
      }
      if (options.format) this.format = options.format; else this.format = 'image/png';
      if (options.opacity) {
        // alert(options.opacity);
        this.opacity = options.opacity;
      }
      if (options.title) this.title = options.title;
      this.abstract = I18n.not_available_message.text;

      if (options.enabled === false) this.enabled = false;

      if (options.keepOnTop === true) this.keepOnTop = true;
      if (options.transparent === true) { this.transparent = true; }
      if (options.transparent === false) { this.transparent = false; }
      if (isDefined(options.onReady)) { this.onReady = options.onReady; this.parseLayer(undefined, undefined, 'WMJSLayer::configOptions'); }
      if (isDefined(options.type)) { this.type = options.type; }
      if (options.parentMaps) { console.log(options.parentMaps); this.parentMaps = options.parentMaps; }
    }
  }
  // Extensions compatible with ncWMS WMS extensions on http://www.resc.rdg.ac.uk/trac/ncWMS/wiki/WmsExtensions
  wmsextensions (options) {
    this.wmsextensions.colorscalerange = '';
    if (isDefined(options.colorscalerange)) {
      this.wmsextensions.colorscalerange = options.colorscalerange;
    }
    this.wmsextensions.url = '';
    if (this.wmsextensions.colorscalerange.length > 2) {
      this.wmsextensions.url += '&COLORSCALERANGE=' + this.wmsextensions.colorscalerange;
    }
  }
  getLayerName () {
    return this.name;
  }

  toggleAutoUpdate () {
    this.autoupdate = !this.autoupdate;
    if (this.autoupdate) {
      let numDeltaMS = 60000;
      this.timer = setInterval(
        (function (self) {
          return function () {
            self.parseLayer(undefined, true, 'WMJSLayer::autoupdate');
          };
        })(this), numDeltaMS);
    } else {
      clearInterval(this.timer);
    }
  }

  setAutoUpdate (val, interval, callback) {
    if (val !== this.autoupdate) {
      this.autoupdate = val;
      if (!val) {
        clearInterval(this.timer);
      } else {
        this.timer = setInterval((function (self) {
          return function () {
            self.parseLayer(callback, true, 'WMJSLayer::autoupdate');
          };
        })(this), interval);
      }
    }
  }

  setOpacity (opacityValue) {
    this.opacity = parseFloat(opacityValue);
    if (this.parentMaps.length === 0) {
      console.error('Layer has no parent maps');
    }
    for (let j = 0; j < this.parentMaps.length; j++) {
      this.parentMaps[j].redrawBuffer();
    }
  }

  remove () {
    for (let j = 0; j < this.parentMaps.length; j++) {
      this.parentMaps[j].deleteLayer(this);
      this.parentMaps[j].draw('WMJSLayer::remove');
    }
    clearInterval(this.timer);
  };

  moveUp () {
    for (let j = 0; j < this.parentMaps.length; j++) {
      this.parentMaps[j].moveLayerUp(this);
      this.parentMaps[j].draw('WMJSLayer::moveUp');
    }
  }

  moveDown () {
    for (let j = 0; j < this.parentMaps.length; j++) {
      this.parentMaps[j].moveLayerDown(this);
      this.parentMaps[j].draw('WMJSLayer::moveDown');
    }
  }

  zoomToLayer () {
    for (let j = 0; j < this.parentMaps.length; j++) {
      this.parentMaps[j].zoomToLayer(this);
    }
  };

  draw (e) {
    for (let j = 0; j < this.parentMaps.length; j++) {
      this.parentMaps[j].draw('WMJSLayer::draw::' + e);
    }
  }

  handleReferenceTime (name, value) {
    if (name === 'reference_time') {
      let timeDim = this.getDimension('time');
      if (timeDim) {
        timeDim.__setStartTime(value);
        if (this.parentMaps && this.parentMaps.length > 0) {
          this.parentMaps[0].getListener().triggerEvent('ondimchange', 'time');
        }
      }
    }
  }

  setDimension (name, value) {
    let dim;
    for (let j = 0; j < this.dimensions.length; j++) {
      if (this.dimensions[j].name === name) {
        dim = this.dimensions[j];
      }
    }
    if (isDefined(dim) === false) { return; }
    if (isDefined(value) === false) { return; }
    dim.setValue(value);

    this.handleReferenceTime(name, value);

    if (dim.linked === true) {
      for (let j = 0; j < this.parentMaps.length; j++) {
        this.parentMaps[j].setDimension(name, dim.getValue());
      }
    }
  }

  configureDimensions () {
    let layer = this;
    let currentLayer = this.cloneLayer();
    let jsonlayer = layer.jsonlayer_v1_1_1;
    // alert(dump(layer.objectpath.length));//getCapabilitiesDoc
    if (!jsonlayer) return;
    // Fill in dimensions
    let dimensions = toArray(jsonlayer.Dimension);

    // Add dims from parentlayers
    for (let j = layer.objectpath.length - 1; j >= 0; j--) {
      let parentDims = layer.objectpath[j].Dimension;
      if (!isNull(parentDims) && isDefined(parentDims)) {
        for (let d = 0; d < parentDims.length; d++) {
          let parentDim = parentDims[d];
          if (!isNull(parentDim) && isDefined(parentDim)) {
            let foundDim = false;
            for (let i = 0; i < dimensions.length; i++) {
              if (parentDim.attr.name.toLowerCase() === dimensions[j].attr.name.toLowerCase()) {
                foundDim = true;
                break;
              }
            }
            if (!foundDim) {
              dimensions.push(parentDim);
            }
          }
        }
      }
    }

    let extents = toArray(jsonlayer.Extent);
    layer.dimensions = [];
    let hasRefTimeDimension = false;

    for (let j = 0; j < dimensions.length; j++) {
      let dim;
      if (dimensions[j].attr.name.toLowerCase() === 'reference_time') {
        hasRefTimeDimension = true;
        dim = new WMJSDimension({ linked: false });
      } else {
        dim = new WMJSDimension();
      }
      dim.name = dimensions[j].attr.name.toLowerCase();
      dim.units = dimensions[j].attr.units;
      // WMS 1.1.1 Mode:
      for (let i = 0; i < extents.length; i++) {
        if (extents[i].attr.name.toLowerCase() === dim.name) {
          // Check if a value is given:
          if (!extents[i].value) { dim.values = ''; } else { dim.values = extents[i].value.trim(); }
          // Check for default
          if (extents[i].attr['default']) {
            dim.defaultValue = extents[i].attr['default'].trim();
          } else {
            let s = dim.values.split('/');
            if (s.length > 1)dim.defaultValue = s[1]; else
            if (s.length > 0)dim.defaultValue = s[0];
          }
          // If no values are given, provide the defaults.
          if (!extents[i].value) {
            error('No extent defined for dim ' + dim.name + ' in layer ' + layer.title);
            error('Using default value ' + dim.defaultValue);
            dim.values = dim.defaultValue;
          }
        }
      }

      // WMS 1.3.0 Mode:
      if (layer.version === WMSVersion.version130) {
        dim.values = dimensions[j].value;
        dim.defaultValue = dimensions[j].attr['default'];
      }

      let defaultValue = dim.defaultValue;

      if (layer.parentMaps.length > 0) {
        let mapDim = layer.parentMaps[0].getDimension(dim.name);
        if (isDefined(mapDim) && mapDim.linked) {
          if (isDefined(mapDim.currentValue)) {
            defaultValue = dim.getClosestValue(mapDim.currentValue);
            debug('WMJSLayer::configureDimensions Dimension ' + dim.name + ' default value [' + defaultValue + '] is based on map value [' + mapDim.currentValue + ']');
          } else {
            debug('WMJSLayer::configureDimensions Map dimension currentValue for ' + dim.name + ' does not exist.');
          }
        }
      } else {
        debug('WMJSLayer::configureDimensions Layer has no parentMaps');
      }
      if (currentLayer.dimensions.filter((d) => d.name === dim.name).length === 1) {
        const oldDim = currentLayer.dimensions.filter((d) => d.name === dim.name)[0];
        if (isDefined(oldDim.currentValue)) {
          dim.setValue(oldDim.currentValue);
        } else {
          dim.setValue(defaultValue);
        }
      } else {
        dim.setValue(defaultValue);
      }

      dim.parentLayer = layer;
      if (isDefined(dim.values)) {
        layer.dimensions.push(dim);
      } else {
        error('Skipping dimension ' + dim.name);
      }
    }

    if (hasRefTimeDimension) {
      let refTimeDimension = layer.getDimension('reference_time');
      this.handleReferenceTime('reference_time', refTimeDimension.getValue());
    }
  };

  /**
    * Calls success with a configured layer object
    * Calls options.failure with error message.
    * Throws string exceptions when someting goes wrong
    */
  parseLayer (_layerDoneCallback, forceReload, whoIsCalling, xml2jsonrequest) {
    // debug(">Layer enabled is "+this.enabled+" by "+whoIsCalling);
    // let isEnabled = this.enabled;
    // this.enabled = false;
    let _this = this;
    _this.hasError = false;

    let layerDoneCallback = (layer) => {
      // _this.enabled = isEnabled;
      // debug("<Layer enabled is "+_this.enabled);
      if (isDefined(_layerDoneCallback)) {
        _layerDoneCallback(layer);
      }
    };
    let fail = (layer, message) => {
      _this.hasError = true;
      _this.lastError = message;
      _this.title = I18n.service_has_error.text;
      error(message);
      layerDoneCallback(layer);
      if (isDefined(this._options.failure)) {
        this._options.failure(layer, message);
      }
    };

    let callback = (data) => {
      let parseGetCapForLayer = (layer, getcapabilitiesjson) => {
        let jsondata = getcapabilitiesjson;
        if (jsondata === 0 || jsondata === undefined) {
          layer.title = I18n.service_has_error.text;
          layer.abstract = I18n.not_available_message.text;
          fail(layer, I18n.unable_to_connect_server.text);
          return;
        }

        let j = 0;
        /* Get the Capability object, Get the rootLayer */
        let capabilityObject;
        try {
          capabilityObject = layer.WMJSService.getCapabilityElement(getcapabilitiesjson);
        } catch (e) {
          fail(layer, e);
          return;
        }

        layer.version = layer.WMJSService.version;

        // Get the rootLayer
        let rootLayer = capabilityObject.Layer;
        if (!isDefined(rootLayer)) {
          fail(layer, 'No Layer element in service'); return;
        }

        try {
          layer.serviceTitle = rootLayer.Title.value;
        } catch (e) {
          // fail(layer,'Service has no title');return;
          layer.serviceTitle = 'Unnamed service';
        }

        this.optimalFormat = 'image/png';
        // Get the optimal image format for this layer
        try {
          let serverFormats = capabilityObject.Request.GetMap.Format;
          for (let f = 0; f < serverFormats.length; f++) {
            if (serverFormats[f].value.indexOf('24') > 0) this.optimalFormat = serverFormats[f].value;
            if (serverFormats[f].value.indexOf('32') > 0) this.optimalFormat = serverFormats[f].value;
          }
        } catch (e) {
          error('This WMS service has no getmap formats listed: using image/png');
        }

        if (layer.name === undefined || layer.name.length < 1) {
          layer.title = WMJSEmptyLayerTitle;
          layer.abstract = I18n.not_available_message.text;
          layerDoneCallback(layer);
          return;
        }

        let foundLayer = 0;
        // Function will be called when the layer with the right name is found in the getcap doc
        let foundLayerFunction = (jsonlayer, path, objectpath) => {
          layer.jsonlayer_v1_1_1 = jsonlayer;

          layer.getmapURL = undefined;
          try { layer.getmapURL = capabilityObject.Request.GetMap.DCPType.HTTP.Get.OnlineResource.attr['xlink:href']; } catch (e) {}
          if (!isDefined(layer.getmapURL)) { layer.getmapURL = layer.service; error('GetMap OnlineResource is not specified. Using default.'); }

          layer.getfeatureinfoURL = undefined;
          try { layer.getfeatureinfoURL = capabilityObject.Request.GetFeatureInfo.DCPType.HTTP.Get.OnlineResource.attr['xlink:href']; } catch (e) {}
          if (!isDefined(layer.getfeatureinfoURL)) { layer.getfeatureinfoURL = layer.service; error('GetFeatureInfo OnlineResource is not specified. Using default.'); }

          layer.getlegendgraphicURL = undefined;
          try { layer.getlegendgraphicURL = capabilityObject.Request.GetLegendGraphic.DCPType.HTTP.Get.OnlineResource.attr['xlink:href']; } catch (e) {}

          if (!isDefined(layer.getlegendgraphicURL)) { layer.getlegendgraphicURL = layer.service; error('GetLegendGraphic OnlineResource is not specified. Using default.'); }

          // TODO Should be arranged also for the other services:
          layer.getmapURL = WMJScheckURL(layer.getmapURL);
          layer.getfeatureinfoURL = WMJScheckURL(layer.getfeatureinfoURL);
          layer.getlegendgraphicURL = WMJScheckURL(layer.getlegendgraphicURL);

          layer.getCapabilitiesDoc = jsondata;
          layer.title = jsonlayer.Title.value;
          try {
            layer.abstract = jsonlayer.Abstract.value;
          } catch (e) {
            layer.abstract = I18n.not_available_message.text;
          }
          layer.path = path;
          layer.objectpath = objectpath;

          layer.styles = undefined;
          // layer.format=optimalFormat;
          layer.jsonlayer = layer;
          // layer.currentStyle='';
          // alert('foundLayerFunction 1');
          try {
            let layerStyles = '';
            if (jsonlayer.Style) {
              layerStyles = toArray(jsonlayer.Style);
            }
            layer.styles = layerStyles;

            // parse styles

            for (let j = 0; j < layer.styles.length; j++) {
              let style = layer.styles[j];
              style.index = j;
              style.nrOfStyles = layer.styles.length;
              style.title = 'default';
              style.name = 'default';
              style.legendURL = '';
              style['abstracttext'] = 'No abstract available';

              try { style.title = style.Title.value; } catch (e) {}
              try { style.name = style.Name.value; } catch (e) {}
              try { style.legendURL = style.LegendURL.OnlineResource.attr['xlink:href']; } catch (e) {}
              try { style['abstracttext'] = style.Abstract.value; } catch (e) {}
            }

            if (layer.currentStyle === '') {
              layer.currentStyle = layer.styles[0].Name.value;
            }

            layer.setStyle(layer.currentStyle);
          } catch (e) {
            layer.currentStyle = '';
            layer.styles = '';
            error('No styles found for layer ' + layer.title);
          }
          layer.configureDimensions();
          // alert('foundLayerFunction 3_'+layer.dimensions.length);
          let gp = toArray(jsonlayer.SRS);

          if (isDefined(jsonlayer.CRS)) {
            gp = toArray(jsonlayer.CRS);
          }

          layer.projectionProperties = [];

          let tempSRS = [];

          let getgpbbox = (data) => {
            if (isDefined(data.BoundingBox)) {
              // Fill in SRS and BBOX on basis of BoundingBox attribute
              let gpbbox = toArray(data.BoundingBox);
              for (j = 0; j < gpbbox.length; j++) {
                let srs;
                srs = gpbbox[j].attr.SRS;

                if (isDefined(gpbbox[j].attr.CRS)) {
                  srs = gpbbox[j].attr.CRS;
                }
                if (srs) {
                  if (srs.length > 0) {
                    srs = decodeURIComponent(srs);
                  }
                }
                let alreadyAdded = false;
                for (let i = 0; i < layer.projectionProperties.length; i++) {
                  if (srs === layer.projectionProperties[i].srs) {
                    alreadyAdded = true;
                    break;
                  }
                }

                if (alreadyAdded === false) {
                  let geoProperty = new WMJSProjection();

                  geoProperty.srs = srs;
                  let swapBBOX = false;
                  if (layer.version === WMSVersion.version130) {
                    if (geoProperty.srs === 'EPSG:4326' && layer.wms130bboxcompatibilitymode === false) {
                      swapBBOX = true;
                    }
                  }
                  if (swapBBOX === false) {
                    geoProperty.bbox.left = parseFloat(gpbbox[j].attr.minx);
                    geoProperty.bbox.bottom = parseFloat(gpbbox[j].attr.miny);
                    geoProperty.bbox.right = parseFloat(gpbbox[j].attr.maxx);
                    geoProperty.bbox.top = parseFloat(gpbbox[j].attr.maxy);
                  } else {
                    geoProperty.bbox.left = parseFloat(gpbbox[j].attr.miny);
                    geoProperty.bbox.bottom = parseFloat(gpbbox[j].attr.minx);
                    geoProperty.bbox.right = parseFloat(gpbbox[j].attr.maxy);
                    geoProperty.bbox.top = parseFloat(gpbbox[j].attr.maxx);
                  }

                  layer.projectionProperties.push(geoProperty);
                  tempSRS.push(geoProperty.srs);
                }
              }
            }
            /* for(let j=0;j<layer.projectionProperties.length;j++){
              let geoProperty = layer.projectionProperties[j];
              if(geoProperty.srs === "EPSG:4326" || geoProperty.srs === "CRS:84"){
                if(isDefined(data.EX_GeographicBoundingBox)){
                  let left   = data.EX_GeographicBoundingBox.westBoundLongitude.value;
                  let bottom = data.EX_GeographicBoundingBox.southBoundLatitude.value;
                  let right  = data.EX_GeographicBoundingBox.eastBoundLongitude.value;
                  let top    = data.EX_GeographicBoundingBox.northBoundLatitude.value;
                  if(isDefined(left) && isDefined(left) && isDefined(left) && isDefined(left)){
                    geoProperty.bbox.left =   parseFloat(left);
                    geoProperty.bbox.bottom = parseFloat(bottom);
                    geoProperty.bbox.right =  parseFloat(right);
                    geoProperty.bbox.top =    parseFloat(top);
                  }
                }
              }
            } */
          };

          getgpbbox(jsonlayer);
          getgpbbox(rootLayer);

          // Fill in SRS  on basis of SRS attribute
          for (j = 0; j < gp.length; j++) {
            if (tempSRS.indexOf(gp[j].value) === -1) {
              let geoProperty = new WMJSProjection();
              error('Warning: BoundingBOX missing for SRS ' + gp[j].value);
              geoProperty.bbox.left = -180;
              geoProperty.bbox.bottom = -90;
              geoProperty.bbox.right = 180;
              geoProperty.bbox.top = 90;
              geoProperty.srs = gp[j].value;
              layer.projectionProperties.push(geoProperty);
            }
          }
          tempSRS = '';
          /* Check if layer is queryable */
          layer.queryable = false;
          try {
            if (parseInt(jsonlayer.attr.queryable) === 1)layer.queryable = true; else layer.queryable = false;
          } catch (e) {
            error('Unable to detect whether this layer is queryable (for layer ' + layer.title + ')');
          }
          foundLayer = 1;
        };// [/FoundLayer]

        // Try to recursively find the name in the getcap doc
        let JSONLayers = toArray(rootLayer.Layer);
        let path = '';
        let objectpath = [];

        function recursivelyFindLayer (JSONLayers, path, _objectpath) {
          let objectpath = [];
          for (let i = 0; i < _objectpath.length; i++) {
            objectpath.push(_objectpath[i]);
          }
          objectpath.push(JSONLayers);

          for (let j = 0; j < JSONLayers.length; j++) {
            if (JSONLayers[j].Layer) {
              let pathnew = path;

              try {
                pathnew += JSONLayers[j].Title.value + '/';
              } catch (e) {
              }

              recursivelyFindLayer(toArray(JSONLayers[j].Layer), pathnew, objectpath);
            } else {
              if (JSONLayers[j].Name) {
                if (JSONLayers[j].Name.value === layer.name) { foundLayerFunction(JSONLayers[j], path, objectpath); return; }
              }
            }
          }
        }
        objectpath.push(rootLayer);
        recursivelyFindLayer(JSONLayers, path, objectpath);

        if (foundLayer === 0) {
          // Layer was not found...
          let message = '';
          if (layer.name) {
            message = ("Unable to find layer '" + layer.name + "' in service '" + layer.service + "'");
          } else {
            message = ("Unable to find layer '" + layer.title + "' in service '" + layer.service + "'");
          }
          layer.title = '--- layer not found in service ---';
          layer.abstract = I18n.not_available_message.text;
          fail(layer, message);
          return layer;
        } else {
          /* Layer was found */
          if (layer.onReady) {
            layer.onReady(layer);
          }
        }
        layerDoneCallback(layer);
        return layer;
      };// [/parseGetCapForLayer]
      var layer = parseGetCapForLayer(_this, data);
    };

    let requestfail = (data) => {
      fail(_this, data);
    };

    let _xml2jsonrequest = xml2jsonrequest;
    if (!xml2jsonrequest) {
      _xml2jsonrequest = _this.parentMaps && _this.parentMaps.length > 0 ? _this.parentMaps[0].xml2jsonrequest : undefined
    }
    _this.WMJSService = WMJSGetServiceFromStore(this.service, _xml2jsonrequest);
    _this.WMJSService.getCapabilities(callback, requestfail, forceReload);
  };

  cloneLayer () {
    let layer = {} ;//new WMJSLayer(this); TODO WILL CAUSE LOOP?
    for (let i in this) {
      layer[i] = this[i];
    }
    return layer;
  }

  setName (layer) {
    this.name = layer;
    this.parseLayer(undefined, undefined, 'WMJSLayer::setName');
  };

  getLayerRelative (success, failure, prevNext) {
    if (!isDefined(prevNext)) {
      prevNext = 0;
    }
    let _this = this;
    let getLayerObjectsFinished = (layerObjects) => {
      let currentLayerIndex = -1;
      for (let j = 0; j < layerObjects.length; j++) {
        if (layerObjects[j].name === _this.name) {
          currentLayerIndex = j;
          break;
        }
      }
      if (currentLayerIndex === -1) {
        failure('Current layer [' + _this.name + '] not in this service');
        return;
      }

      if (prevNext === -1)currentLayerIndex--;
      if (prevNext === 1)currentLayerIndex++;
      if (currentLayerIndex > layerObjects.length - 1)currentLayerIndex = 0;
      if (currentLayerIndex < 0)currentLayerIndex = layerObjects.length - 1;
      success(layerObjects[currentLayerIndex], currentLayerIndex, layerObjects.length);
    };
    _this.WMJSService.getLayerObjectsFlat(getLayerObjectsFinished, failure);
  };

  autoSelectLayer (success, failure) {
    let _this = this;
    let getLayerObjectsFinished = (layerObjects) => {
      for (let j = 0; j < layerObjects.length; j++) {
        if (isDefined(layerObjects[j].name)) {
          if (layerObjects[j].name.indexOf('baselayer') === -1) {
            if (layerObjects[j].path.indexOf('baselayer') === -1) {
              success(layerObjects[j]);
              return;
            }
          }
        }
      }
    };
    _this.WMJSService.getLayerObjectsFlat(getLayerObjectsFinished, failure);
  };

  getNextLayer (success, failure) {
    this.getLayerRelative(success, failure, 1);
  };

  getPreviousLayer (success, failure) {
    this.getLayerRelative(success, failure, -1);
  };

  /**
   * Sets the style by its name
   * @param style: The name of the style (not the object)
   */
  setStyle (styleName) {
    debug('WMJSLayer::setStyle: ' + styleName);

    if (this.styles.length === 0) {
      this.currentStyle = '';
      this.legendGraphic = '';
      debug('Layer has no styles.');
      return;
    }

    for (let j = 0; j < this.styles.length; j++) {
      // debug("Comparing "+this.styles[j].name+" with " +styleName);
      if (this.styles[j].name === styleName) {
        // debug("WMJSLayer::setStyle: Setting style "+this.styles[j].name);
        this.legendGraphic = this.styles[j].legendURL;
        this.currentStyle = this.styles[j].name;
        return;
      }
    }
    debug('WMJSLayer::setStyle: Style ' + styleName + ' not found, setting style ' + this.styles[0].name);
    this.currentStyle = this.styles[0].name;
    this.legendGraphic = this.styles[0].legendURL;

    // throw("Style "+styleName+" not found");
  };

  getStyles () {
    if (this.styles) {
      return this.styles;
    } else return [];
  }

  /**
   * Get the styleobject by name
   * @param styleName The name of the style
   * @param nextPrev, can be -1 or +1 to get the next or previous style object in circular manner.
   */
  getStyleObject (styleName, nextPrev) {
    if (isDefined(this.styles) === false) {
      return undefined;
    }
    for (let j = 0; j < this.styles.length; j++) {
      if (this.styles[j].name === styleName) {
        if (nextPrev === -1)j--;
        if (nextPrev === 1)j++;
        if (j < 0)j = this.styles.length - 1;
        if (j > this.styles.length - 1)j = 0;
        this.styles[j].nrOfStyles = this.styles.length;
        this.styles[j].index = j;
        return this.styles[j];
      }
    }
    return undefined;
  }

  /*
   *Get the current stylename as used in the getmap request
   */
  getStyle () {
    return this.currentStyle;
  }

  setService (service) {
    this.service = service;
    this.getmapURL = service;
    this.getfeatureinfoURL = service;
    this.getlegendgraphicURL = service;
    this.getgraphinfoURL = service;
  }

  getDimension (name) {
    for (let i = 0; i < this.dimensions.length; i++) {
      if (this.dimensions[i].name === name) {
        return this.dimensions[i];
      }
    }
    return undefined;
  }

  getProjection (srsName) {
    for (let j = 0; j < this.projectionProperties.length; j++) {
      if (this.projectionProperties[j].srs === srsName) {
        let returnSRS = [];
        returnSRS.srs = this.projectionProperties[j].srs + '';
        returnSRS.bbox = new WMJSBBOX(
          this.projectionProperties[j].bbox.left,
          this.projectionProperties[j].bbox.bottom,
          this.projectionProperties[j].bbox.right,
          this.projectionProperties[j].bbox.top);
        return returnSRS;
      }
    }
  }

  display (displayornot) {
    this.enabled = displayornot;
    for (let j = 0; j < this.parentMaps.length; j++) {
      this.parentMaps[j].displayLayer(this, this.enabled);
    }
  }
};

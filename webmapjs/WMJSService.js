import I18n from './I18n/lang.en.js';
import { WMSVersion, error, debug } from './WMJSConstants.js';
import { URLEncode, isDefined, toArray, isNull } from './WMJSTools.js';
import WMJSXMLParser from './WMJSXMLParser.js';

import { $ } from './WMJSExternalDependencies.js';

let config = {
  xml2jsonrequestURL: 'Check WMJSService line 8'
};

let loadGetCapabilitiesViaProxy = (url, succes, fail, xml2jsonrequestURL) => {
  let getcapreq = xml2jsonrequestURL + 'request=';

  let errormessage = (message) => {
    fail(I18n.unable_to_do_getcapabilities.text + ':\n' + getcapreq + '\n' + I18n.result.text + ':\n' + message);
  };

  debug("<a target='_blank' href='" + url + "'>" + url + '</a>', false);
  getcapreq += URLEncode(url);
  /* Error message in case the request goes wrong */
  try {
    $.ajax({
      url: getcapreq,
      crossDomain:true,
      dataType:'jsonp'
    }).done((d) => {
      debug('loadGetCapabilitiesViaProxy succesfully finished');
      succes(d);
    }).fail(() => {
      errormessage({ 'error':'Request failed for ' + getcapreq });
    });
  } catch (e) {
    error(e);
    errormessage({ 'error': 'Request failed for ' + getcapreq });
  }
};
// import WMJSXMLParser from './WMJSXMLParser.js';
/**
  * Global getcapabilities function
  */
export const WMJSGetCapabilities = (service, forceReload, succes, fail, xml2jsonrequestURL = this.xml2jsonrequestURL) => {
  /* Make the regetCapabilitiesJSONquest */
  if (!isDefined(service)) {
    fail(I18n.no_service_defined.text);
    return;
  }
  if (service.length === 0) {
    error('Service is empty');
    fail(I18n.service_url_empty.text);
    return;
  }
  
  /* Allow relative URL's */
  if (service.startsWith('/') && !service.startsWith('//')){
    let splittedHREF = window.location.href.split('/').filter(e => e.length > 0);
    let hostName = splittedHREF[0] + '//' + splittedHREF[1] + '/';
    service = hostName + service;
  }
  
  if (!service.startsWith('http://') && !service.startsWith('https:') && !service.startsWith('//')) {
    error('Service does not start with HTTPS');
    fail(I18n.service_url_empty.text);
    return;
  }

  if (service.indexOf('?') === -1) {
    service += '?';
  }
  debug('GetCapabilities:');

  let url = service + '&service=WMS&request=GetCapabilities';

  let _xml2jsonrequestURL = xml2jsonrequestURL;

  WMJSXMLParser(url).then((data) => {
    try {
      succes(data);
    } catch (e) {
      console.error(e);
    }
  }).catch((e) => {
    debug('Unable to use browser based XML reading, trying proxy: ', e);
    loadGetCapabilitiesViaProxy(url, succes,
      () => {
        fail('Request failed for ' + url);
      }, _xml2jsonrequestURL);
  });
};

/**
  * WMJSService Class
  *
  * options:
  *   service
  *   title (optional)
  */

export class WMJSService {
  constructor (options) {
    this.service = undefined;
    this.title = undefined;
    this.onlineresource = undefined;
    this.abstract = undefined;
    this.version = WMSVersion.version111;
    this.getcapabilitiesDoc = undefined;
    this.busy = false;
    this._flatLayerObject = undefined;
    if (options) {
      this.service = options.service;
      this.title = options.title;
    }
    this.checkVersion111 = this.checkVersion111.bind(this);
    this.checkVersion130 = this.checkVersion130.bind(this);
    this.getCapabilityElement = this.getCapabilityElement.bind(this);
    this.checkVersion = this.checkVersion.bind(this);
    this.getCapabilities = this.getCapabilities.bind(this);
    this.checkException = this.checkException.bind(this);
    this.getNodes = this.getNodes.bind(this);
    this.getLayerNames = this.getLayerNames.bind(this);
    this.getLayerObjectsFlat = this.getLayerObjectsFlat.bind(this);
    this.xml2jsonrequestURL = options.xml2jsonrequestURL ? options.xml2jsonrequestURL : config.xml2jsonrequestURL;
    this.functionCallbackList = [];
  }

  checkVersion111 (jsonData) {
    try {
      let rootLayer = jsonData.WMT_MS_Capabilities.Capability.Layer;
      if (!rootLayer) throw new Error('No 111 layer');
    } catch (e) {
      let message = this.checkException(jsonData);
      if (message !== undefined) {
        throw (message);
      }
      if (!jsonData.WMT_MS_Capabilities.Capability) { throw (I18n.no_wms_capability_element_found.text); }
      if (!jsonData.WMT_MS_Capabilities.Capability.Layer) { throw (I18n.no_wms_layer_element_found.text); }
    }
  };

  setXML2JSONProxy (xml2jsonrequestURL) {
    this.xml2jsonrequestURL = xml2jsonrequestURL;
  }

  checkVersion130 (jsonData) {
    try {
      let rootLayer = jsonData.WMS_Capabilities.Capability.Layer;
      if (!rootLayer) throw new Error('No 130 layer');
    } catch (e) {
      let message = this.checkException(jsonData);
      if (message !== undefined) {
        throw (message);
      }
      if (!jsonData.WMS_Capabilities.Capability) { throw (I18n.no_wms_capability_element_found.text); }
      if (!jsonData.WMS_Capabilities.Capability.Layer) { throw (I18n.no_wms_layer_element_found.text); }
    }
  };

  getCapabilityElement (jsonData) {
    let capabilityObject;
    try {
      capabilityObject = jsonData.WMT_MS_Capabilities.Capability;
    } catch (e) {
      try {
        capabilityObject = jsonData.WMS_Capabilities.Capability;
      } catch (e) {
        throw (I18n.no_capability_element_found.text);
      }
    }
    if (!isDefined(capabilityObject)) {
      throw (I18n.no_capability_element_found.text);
    }
    return capabilityObject;
  };

  checkVersion (jsonData) {
    let version = null;
    try {
      if (WMSVersion.version100 === jsonData.WMT_MS_Capabilities.attr.version)version = WMSVersion.version100;
      if (WMSVersion.version111 === jsonData.WMT_MS_Capabilities.attr.version)version = WMSVersion.version111;
      if (WMSVersion.version130 === jsonData.WMT_MS_Capabilities.attr.version)version = WMSVersion.version130;
    } catch (e) {
      try {
        if (WMSVersion.version100 === jsonData.WMS_Capabilities.attr.version)version = WMSVersion.version100;
        if (WMSVersion.version111 === jsonData.WMS_Capabilities.attr.version)version = WMSVersion.version111;
        if (WMSVersion.version130 === jsonData.WMS_Capabilities.attr.version)version = WMSVersion.version130;
      } catch (e) {
        let message = this.checkException(jsonData);
        if (message) {
          throw (new Error(message));
        } else {
          throw (new Error('Unable to determine WMS version'));
        }
      }
    }
    if (version === null) {
      throw (new Error('Unable to determine WMS version'));
    }
    if (version === WMSVersion.version111) {
      this.checkVersion111(jsonData);
      return version;
    }
    if (version === WMSVersion.version130) {
      this.checkVersion130(jsonData);
      return version;
    }
    return WMSVersion.version111;
  };

  /**
    * Does getcapabilities for a service.
    * When multple getCapabilities for the same service are made,
    * this method makes one get request and fires all callbacks with the same result.
    * @param succescallback Function called upon succes, cannot be left blank
    * @param failcallback Function called upon failure, cannot be left blank
    */
  getCapabilities (succescallback, failcallback, forceReload, xml2jsonrequestURL = this.xml2jsonrequestURL) {
    if (this.busy) {
      let cf = { callback:succescallback, fail:failcallback };
      this.functionCallbackList.push(cf);
      return;
    }

    this._flatLayerObject = undefined;

    if (!this.getcapabilitiesDoc || forceReload === true) {
      this.busy = true;
      let fail = (jsonData) => {
        this.busy = false;
        for (let j = 0; j < this.functionCallbackList.length; j++) {
          this.functionCallbackList[j].fail(jsonData);
          this.functionCallbackList[j].fail = function () {};
        }
        this.functionCallbackList.length = 0;
      };
      let succes = (jsonData) => {
        this.busy = false;
        this.getcapabilitiesDoc = jsonData;

        try {
          this.version = this.checkVersion(jsonData);
        } catch (e) {
          fail(e.message);
          return;
        }

        let WMSCapabilities = jsonData.WMS_Capabilities;
        if (!WMSCapabilities) {
          WMSCapabilities = jsonData.WMT_MS_Capabilities;
        }

        // Get Abstract
        try {
          this.abstract = WMSCapabilities.Service.Abstract.value;
        } catch (e) {
          this.abstract = I18n.not_available_message.text;
        }

        // Get Title
        try {
          this.title = WMSCapabilities.Service.Title.value;
        } catch (e) {
          this.title = I18n.not_available_message.text;
        }

        // Get OnlineResource
        try {
          if (WMSCapabilities.Service.OnlineResource.value) {
            this.onlineresource = WMSCapabilities.Service.OnlineResource.value;
          } else {
            this.onlineresource = WMSCapabilities.Service.OnlineResource.attr['xlink:href'];
          }
        } catch (e) {
          this.onlineresource = I18n.not_available_message.text;
        }

        for (let j = 0; j < this.functionCallbackList.length; j++) {
          this.functionCallbackList[j].callback(jsonData);
          this.functionCallbackList[j].callback = () => {};
        }
        this.functionCallbackList.length = 0;
        this.functionCallbackList = [];
        this.busy = false;
      };
      let cf = { callback:succescallback, fail:failcallback };
      this.functionCallbackList.push(cf);

      WMJSGetCapabilities(this.service, false, succes, fail, xml2jsonrequestURL);
    } else {
      succescallback(this.getcapabilitiesDoc);
    }
  };

  checkException (jsonData) {
    try {
      if (jsonData.ServiceExceptionReport) {
        let code = 'Undefined';
        let value = code;
        let se = jsonData.ServiceExceptionReport.ServiceException;
        if (se) {
          try {
            if (se.attr.code)code = se.attr.code;
          } catch (e) {}
          if (se.value) {
            value = se.value;
            return ('Exception: ' + code + '.\n' + value);
          }
        }
        return (I18n.wms_service_exception_code.text + code);
      }
    } catch (e) {}
    return undefined;
  };

  _sortByKey (array, key) {
    return array.sort((a, b) => {
      let x = a[key]; let y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  };
  /**
    * Calls succes with a hierarchical node structure
    * Calls failure with a string when someting goes wrong
    */
  getNodes (succes, failure, forceReload, xml2jsonrequestURL = config.xml2jsonrequestURL) {
    /* if(forceReload !== true){
      if(isDefined(this.getcapabilitiesDoc)){
        if(isDefined(this.nodeCache)){
          succes(this.nodeCache);

          return;
        }
      }
    } */

    this.nodeCache = undefined;
    if (!failure) { failure = (msg) => { error(msg); }; }

    let parse = (jsonData) => {
      var nodeStructure = {
        leaf: false,
        expanded: true,
        children: []
      };
      let rootLayer = this.getCapabilityElement(jsonData).Layer;

      try {
        this.version = this.checkVersion(jsonData);
      } catch (e) {
        failure(e);
        return;
      }

      let WMSLayers = toArray(rootLayer.Layer);
      try {
        nodeStructure.text = rootLayer.Title.value;
      } catch (e) {
        nodeStructure.text = I18n.unnamed_service.text;
      }
      let recursivelyFindLayer = (WMSLayers, rootNode, path) => {
        for (let j = 0; j < WMSLayers.length; j++) {
          let isleaf = false;
          if (WMSLayers[j].Name)isleaf = true;
          try { if (WMSLayers[j].Layer)isleaf = false; } catch (e) {}
          let nodeObject = {};

          if (WMSLayers[j].Name) {
            nodeObject = { name:WMSLayers[j].Name.value, text:WMSLayers[j].Title.value, leaf:isleaf, path:path };
          } else {
            if (isNull(WMSLayers[j].Title)) {
              WMSLayers[j].Title = [];
              WMSLayers[j].Title.value = 'Layer';
            }

            nodeObject = { text:WMSLayers[j].Title.value, leaf:isleaf };
          }
          rootNode.push(nodeObject);
          if (WMSLayers[j].Layer) {
            nodeObject.children = [];
            recursivelyFindLayer(toArray(WMSLayers[j].Layer), nodeObject.children, path + WMSLayers[j].Title.value);
          }
        }
        // Sort nodes alphabetically.
        this._sortByKey(rootNode, 'text');
      };
      recursivelyFindLayer(WMSLayers, nodeStructure.children, '');
      succes(nodeStructure);
    };

    let callback = (jsonData) => {
      parse(jsonData);
    };

    let fail = (data) => {
      failure(data);
    };
    this.getCapabilities(callback, fail, forceReload, xml2jsonrequestURL);
  };

  /** Calls succes with an array of all layernames
   * Calls failure when something goes wrong
   */
  getLayerNames (succes, failure, forceReload, xml2jsonrequestURL = this.xml2jsonrequestURL) {
    let callback = (data) => {
      let layerNames = [];
      let getNames = (layers) => {
        // alert(layers.children);
        for (let j = 0; j < layers.length; j++) {
          if (layers[j].name) {
            layerNames.push(layers[j].name);
          }
          if (layers[j].children) {
            getNames(layers[j].children);
          }
        }
      };
      getNames(data.children);
      succes(layerNames);
    };
    this.getNodes(callback, failure, forceReload, xml2jsonrequestURL);
  };

  /** Calls succes with an array of all layerobjects
   * Calls failure when something goes wrong
   */
  getLayerObjectsFlat (succes, failure, forceReload, xml2jsonrequestURL = this.xml2jsonrequestURL) {
    if (isDefined(this._flatLayerObject)) {
      succes(this._flatLayerObject);
      return;
    }

    let callback = (data) => {
      this._flatLayerObject = [];
      let getNames = (layers) => {
        // alert(layers.children);
        for (let j = 0; j < layers.length; j++) {
          if (layers[j].name) {
            this._flatLayerObject.push(layers[j]);
          }
          if (layers[j].children) {
            getNames(layers[j].children);
          }
        }
      };
      getNames(data.children);

      succes(this._flatLayerObject);
    };
    this.getNodes(callback, failure, forceReload, xml2jsonrequestURL);
  }
};

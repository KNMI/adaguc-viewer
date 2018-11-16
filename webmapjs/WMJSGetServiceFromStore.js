import { WMJSServiceStore, WMJSServiceStoreXML2JSONRequest } from './WMJSGlobals.js';
import { WMJSService } from './WMJSService.js';
const WMJSGetServiceFromStore = (serviceName, xml2jsonrequestURL) => {
  for (let j = 0; j < WMJSServiceStore.length; j++) {
    if (WMJSServiceStore[j].service === serviceName) {
      return WMJSServiceStore[j];
    }
  }
  if (xml2jsonrequestURL) {
    WMJSServiceStoreXML2JSONRequest.proxy = xml2jsonrequestURL;
  }
  let service = new WMJSService({ service:serviceName, xml2jsonrequestURL: WMJSServiceStoreXML2JSONRequest.proxy });
  WMJSServiceStore.push(service);
  return service;
};
export default WMJSGetServiceFromStore;

var isDefined, WMJSMap, WMJSLayer, getUrlVars, checkIfHashTagChanged, WMJSTimer, WMJSGetServiceFromStore, WMJScheckURL, URLEncode, URLDecode, WMJSDateOutSideRange, WMJSDateTooEarlyString, WMJSDateTooLateString, WMJSEmptyLayerName, WMJSEmptyLayerTitle, parseISO8601DateToDate, I18n, removeMouseWheelEvent, addMouseWheelEvent, WMJSKVP, composeUrlObjectFromURL, WMJSBBOX, toArray;
var initWMJS = function () {
  let wmjs = window.wmjs;
  if (!wmjs) {
   $( document ).ready(function() {
      initWMJS();
    });
    return;
  }
  isDefined = wmjs.isDefined;
  WMJSMap = wmjs.WMJSMap;
  WMJSLayer = wmjs.WMJSLayer;
  getUrlVars = wmjs.getUrlVars;
  checkIfHashTagChanged = wmjs.checkIfHashTagChanged;
  WMJSTimer = wmjs.WMJSTimer;
  WMJSGetServiceFromStore = wmjs.WMJSGetServiceFromStore;
  WMJScheckURL = wmjs.WMJScheckURL;
  URLEncode = wmjs.URLEncode;
  URLDecode = wmjs.URLDecode;
  WMJSDateOutSideRange = wmjs.WMJSDateOutSideRange;
  WMJSDateTooEarlyString = wmjs.WMJSDateTooEarlyString;
  WMJSDateTooLateString = wmjs.WMJSDateTooLateString;
  WMJSEmptyLayerName = wmjs.WMJSEmptyLayerName;
  WMJSEmptyLayerTitle = wmjs.WMJSEmptyLayerTitle;
  parseISO8601DateToDate = wmjs.parseISO8601DateToDate;
  I18n = wmjs.I18n;
  removeMouseWheelEvent = wmjs.removeMouseWheelEvent;
  addMouseWheelEvent = wmjs.addMouseWheelEvent;
  WMJSKVP = wmjs.WMJSKVP;
  composeUrlObjectFromURL = wmjs.composeUrlObjectFromURL;
  WMJSBBOX = wmjs.WMJSBBOX;
  toArray = wmjs.toArray;
};

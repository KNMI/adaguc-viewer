import { WMJSMap } from '../webmapjs/WebMapJS.js'
import { isDefined, getUrlVars, checkIfHashTagChanged, WMJScheckURL, URLDecode, URLEncode, addMouseWheelEvent, removeMouseWheelEvent } from '../webmapjs/WMJSTools.js'
import WMJSLayer from '../webmapjs/WMJSLayer.js'
import WMJSTimer from '../webmapjs/WMJSTimer.js';
import WMJSGetServiceFromStore from '../webmapjs/WMJSGetServiceFromStore.js';
import { WMJSDateOutSideRange, WMJSDateTooEarlyString, WMJSDateTooLateString, WMJSEmptyLayerName, WMJSEmptyLayerTitle } from '../webmapjs/WMJSConstants.js';
import { parseISO8601DateToDate } from  '../webmapjs/WMJSTime.js';
import I18n from  '../webmapjs/I18n/lang.en.js';
window.wmjs = {
	WMJSMap: WMJSMap,
	isDefined: isDefined,
	WMJSLayer: WMJSLayer,
	getUrlVars: getUrlVars,
	checkIfHashTagChanged: checkIfHashTagChanged,
	WMJSTimer: WMJSTimer,
	WMJSGetServiceFromStore: WMJSGetServiceFromStore,
	WMJScheckURL: WMJScheckURL,
	URLEncode: URLEncode,
	URLDecode: URLDecode,
	WMJSDateOutSideRange: WMJSDateOutSideRange,
	WMJSDateTooEarlyString: WMJSDateTooEarlyString,
	WMJSDateTooLateString: WMJSDateTooLateString,
	WMJSEmptyLayerName: WMJSEmptyLayerName,
	WMJSEmptyLayerTitle: WMJSEmptyLayerTitle,
	parseISO8601DateToDate: parseISO8601DateToDate,
        I18n: I18n,
        addMouseWheelEvent: addMouseWheelEvent,
        removeMouseWheelEvent: removeMouseWheelEvent        
}

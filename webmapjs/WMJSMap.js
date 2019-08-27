/*
 * Name        : WMJSMap.js
 * Author      : MaartenPlieger (plieger at knmi.nl)
 * Version     : 3.2.0 (September 2018)
 * Description : This is a basic interface for portrayal of OGC WMS services
 * Copyright KNMI
 */

/*
  Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

  Copyright (C) 2011 by Royal Netherlands Meteorological Institute (KNMI)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

import WMJSImageStore from './WMJSImageStore.js';
import { isDefined, preventdefaultEvent, URLEncode, toArray, deleteEvent, attachEvent, WMJScheckURL,
  MakeHTTPRequest, getMouseXCoordinate, getMouseYCoordinate, addMouseWheelEvent, removeMouseWheelEvent } from './WMJSTools.js';
import WMJSBBOX from './WMJSBBOX.js';
import WMJSProjection from './WMJSProjection.js';
import WMJSListener from './WMJSListener.js';
import WMJSTimer from './WMJSTimer.js';
import WMJSDebouncer from './WMJSDebouncer.js';
import WMJSCanvasBuffer from './WMJSCanvasBuffer.js';
import WMJSAnimate from './WMJSAnimate.js';
import WMJSTileRenderer from './WMJSTileRenderer.js';
import WMJSDrawMarker from './WMJSDrawMarker.js';
import I18n from './I18n/lang.en.js';
import { jquery, proj4, moment } from './WMJSExternalDependencies.js';

import WMJSDialog from './WMJSDialog.js';
import { WMJSDateOutSideRange, WMJSDateTooEarlyString, WMJSDateTooLateString, WMSVersion, WMJSProj4Defs } from './WMJSConstants.js';
// var Hammer = require(['hammerjs']);
//var pjson = require('../package.json');

let enableConsoleDebugging = false;
let enableConsoleErrors = true;
/**
 * Set base URL of several sources used wihtin webmapjs
 */

let debug = (message) => {
  if (enableConsoleDebugging) { console.log(message); }
};
let error = (message) => {
  if (enableConsoleErrors) { console.log('WebMapJS warning: ', message); }
};

/* Global vars */
let WebMapJSMapNo = 0;
/* Global image stores */
let maxAnimationSteps = 72;
var legendImageStore = new WMJSImageStore(maxAnimationSteps * 6, 'wmjslegendbuffer');
var getMapImageStore = new WMJSImageStore(maxAnimationSteps * 6, 'wmjsimagebuffer');
var bgMapImageStore = new WMJSImageStore(360, 'wmjsimagebuffer', { randomizer:false });

/* GetFeature info handling */
class GetFeatureInfoObject {
  constructor (layer, data) {
    this.layer = layer;
    this.data = data;
  }
};

/**
/**
  * WMJSMap class
  */
export default class WMJSMap {
  constructor (_element, _xml2jsonrequestURL) {
    this.WebMapJSMapVersion = '3.3.6';
//    if (pjson && pjson.version) this.WebMapJSMapVersion = pjson.version;
    this.base = './';
    this.noimage = undefined;
    this.showDialog = true;
    this.loadingImageSrc = undefined;
    this.WMSControlsImageSrc = undefined;
    this.mainElement = _element;
    this.baseDiv = undefined;
    this.mainTimeSlider = undefined;
    this.srs = undefined;
    this.resizeBBOX = new WMJSBBOX();
    this.defaultBBOX = new WMJSBBOX();
    this.width = 2;
    this.height = 2;
    this.layers = [];
    this.busy = 0;
    this.mapdimensions = [];// Array of Dimension;
    this.baseLayers = '';
    this.numBaseLayers = 0;
    this._map = this;
    this.renderer = 'WMJSCanvasBuffer';
    this.layersBusy = 0;
    this.mapBusy = false;
    this.hasGeneratedId = false;
    this.divZoomBox = document.createElement('div');
    this.divBoundingBox = document.createElement('div');
    this.divDimInfo = document.createElement('div');
    this.divMapPin = {
      displayMapPin: true
    };
    this._displayLegendInMap = true;
    this.messageDiv = undefined;
    this.timeoffsetContainerDiv = undefined;
    this.timeoffsetDiv = undefined;
    this.bbox = new WMJSBBOX(); // Boundingbox that will be used for map loading
    this.updateBBOX = new WMJSBBOX(); // Boundingbox to move map without loading anything
    this.loadedBBOX = new WMJSBBOX(); // Boundingbox that is used for current map
    this.loadingBBOX = new WMJSBBOX(); // Boundingbox that is used when map is loading
    this.drawnBBOX = new WMJSBBOX(); // Boundingbox that is used when map is drawn
    this.updateSRS = '';

    this.divBuffer = [];

    this.mapHeader = {
      height:0,
      fill:{
        color:'#EEE',
        opacity:0.4
      },
      hover:{
        color:'#017daf',
        opacity:0.9
      },
      selected:{
        color:'#017daf',
        opacity:1.0
      },
      hoverSelected:{
        color:'#017daf',
        opacity:1.0
      },
      cursorSet:false,
      prevCursor:'default',
      hovering:false
    };

    this.currentCursor = 'default';
    this.mapIsActivated = false;
    this.isMapHeaderEnabled = false;
    this.showScaleBarInMap = true;
    this.mouseHoverAnimationBox = false;
    this.callBack = new WMJSListener();

    this.initialized = 0;
    this.newSwapBuffer = 0;
    this.currentSwapBuffer = 1;
    this.suspendDrawing = false;
    this.activeLayer = undefined;
    /* Undo: */
    this.MaxUndos = 3;
    this.NrOfUndos = 0;
    this.UndoPointer = 0;
    this.DoUndo = 0;
    this.DoRedo = 0;
    this.NrRedos = 0;
    this.NrUndos = 0;
    this.WMJSProjection_undo = new Array(this.MaxUndos);
    this.WMJSProjection_tempundo = new Array(this.MaxUndos);
    for (let j = 0; j < this.MaxUndos; j++) { this.WMJSProjection_undo[j] = new WMJSProjection(); this.WMJSProjection_tempundo[j] = new WMJSProjection(); }
    this.inlineGetFeatureInfo = true;

    this.setBaseURL('./');
    /* Contains the event values for when the mouse was pressed down (used for checking the shiftKey); */
    this.gfiDialogList = [];
    this.legendBusy = false;
    this.setTimeOffsetValue = '';
    this.setMessageValue = '';
    this.canvasErrors = [];

    this.resizeWidth = -1;
    this.resizeHeight = -1;
    this._resizeTimerBusy = false;
    this._resizeTimer = new WMJSTimer();
    this.zoomBeforeLoadBBOX = undefined;
    this.srsBeforeLoadBBOX = undefined;
    this.drawTimer = new WMJSDebouncer();
    this.drawTimerBusy = false;
    this.drawTimerPending = false;
    this.drawTimerAnimationList = undefined;
    this.wmjsAnimate = undefined;
    this.loadingDivTimer = new WMJSTimer();

    this.mouseWheelBusy = 0;
    this.flyZoomToBBOXTimerStart = 1;
    this.flyZoomToBBOXTimerSteps = 5;
    this.flyZoomToBBOXTimerLoop = undefined;
    this.flyZoomToBBOXTimer = new WMJSDebouncer();
    this.flyZoomToBBOXScaler = 0;
    this.flyZoomToBBOXCurrent = new WMJSBBOX();
    this.flyZoomToBBOXFly = new WMJSBBOX();
    this.flyZoomToBBOXNew = new WMJSBBOX();
    this.flyZoomToBBOXContinueNew = new WMJSBBOX();
    this.flyZoomToBBOXTimerFuncBusy = 0;
    this.flyZoomToBBOXTimerFuncBusyAndContinue = 0;
    this.mouseWheelEventBBOXCurrent = new WMJSBBOX();
    this.mouseWheelEventBBOXNew = new WMJSBBOX();
    this.pinchStart1 = undefined;
    this.pinchStart2 = undefined;
    this.pinchBox = undefined;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDownX = -10000;
    this.mouseDownY = -10000;
    this.mouseUpX = 10000;
    this.mouseUpY = 10000;
    this.mouseDragging = 0;
    this.controlsBusy = false;
    this.mouseDownPressed = 0;
    this.elementPosition = undefined;
    this.mapMode = 'pan'; /* pan,zoom,zoomout,info */

    this.numGetFeatureInfoRequests = 0;
    this.getFeatureInfoResult = [];

    this.numGetPointInfoRequests = 0;
    this.getPointInfoResult = [];

    this.getPointInfoBusy = false;
    this.requestProxy = undefined; // TODO
    this.oldMapMode = undefined;
    this.InValidMouseAction = 0;
    this.resizingBBOXCursor = false;
    this.resizingBBOXEnabled = false;
    this.mouseGeoCoordXY = undefined;
    this.mouseUpdateCoordinates = undefined;
    this.mapPanning = 0;
    this.mapPanStartGeoCoords = undefined;
    this.mapZooming = 0;
    this.proj4 = {}; /* proj4 remembers current projection */
    this.proj4.srs = 'empty';
    this.proj4.projection = undefined;
    this.longlat = 'EPSG:4326';
    proj4.defs(WMJSProj4Defs);
    this.knmiGeoNamesURL = undefined;
    this.geoNamesURL = undefined;
    this.defaultUsernameSearch = 'adaguc';
    this.setDebugFunction = (debugFunction) => { debug = debugFunction; };
    this.setErrorFunction = (errorFunction) => { error = errorFunction; };

    /* Binds */
    this.setBaseURL = this.setBaseURL.bind(this);
    this.showDialogs = this.showDialogs.bind(this);
    this.setXML2JSONURL = this.setXML2JSONURL.bind(this);
    this.setWMJSTileRendererTileSettings = this.setWMJSTileRendererTileSettings.bind(this);
    this.getLegendStore = this.getLegendStore.bind(this);
    this.makeComponentId = this.makeComponentId.bind(this);
    this.enableInlineGetFeatureInfo = this.enableInlineGetFeatureInfo.bind(this);
    this.dialogClosed = this.dialogClosed.bind(this);
    this.closeAllGFIDialogs = this.closeAllGFIDialogs.bind(this);
    this.onLegendCallbackFunction = this.onLegendCallbackFunction.bind(this);
    this.loadLegendInline = this.loadLegendInline.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.setTimeOffset = this.setTimeOffset.bind(this);
    this.init = this.init.bind(this);
    this.rebuildMapDimensions = this.rebuildMapDimensions.bind(this);
    this.getLayerByServiceAndName = this.getLayerByServiceAndName.bind(this);
    this.getLayers = this.getLayers.bind(this);
    this.setLayer = this.setLayer.bind(this);
    this.setActive = this.setActive.bind(this);
    this.setActiveLayer = this.setActiveLayer.bind(this);
    this.calculateNumBaseLayers = this.calculateNumBaseLayers.bind(this);
    this.enableLayer = this.enableLayer.bind(this);
    this.disableLayer = this.disableLayer.bind(this);
    this.toggleLayer = this.toggleLayer.bind(this);
    this.displayLayer = this.displayLayer.bind(this);
    this._getLayerIndex = this._getLayerIndex.bind(this);
    this.removeAllLayers = this.removeAllLayers.bind(this);
    this.deleteLayer = this.deleteLayer.bind(this);
    this.moveLayerDown = this.moveLayerDown.bind(this);
    this.swapLayers = this.swapLayers.bind(this);
    this.moveLayerUp = this.moveLayerUp.bind(this);
    this.addLayer = this.addLayer.bind(this);
    this.getActiveLayer = this.getActiveLayer.bind(this);
    this.setProjection = this.setProjection.bind(this);
    this.getBBOX = this.getBBOX.bind(this);
    this.getProjection = this.getProjection.bind(this);
    this.getSize = this.getSize.bind(this);
    this.getWidth = this.getWidth.bind(this);
    this.getHeight = this.getHeight.bind(this);
    this.repositionLegendGraphic = this.repositionLegendGraphic.bind(this);
    this.setSize = this.setSize.bind(this);
    this._setSize = this._setSize.bind(this);
    this.getBBOXandProjString = this.getBBOXandProjString.bind(this);
    this.isTouchDevice = this.isTouchDevice.bind(this);
    this.getDimensionRequestString = this.getDimensionRequestString.bind(this);
    this.dateToISO8601 = this.dateToISO8601.bind(this);
    this.buildWMSGetMapRequest = this.buildWMSGetMapRequest.bind(this);
    this.abort = this.abort.bind(this);
    this.isBusy = this.isBusy.bind(this);
    this._makeInfoHTML = this._makeInfoHTML.bind(this);
    this.getLegendGraphicURLForLayer = this.getLegendGraphicURLForLayer.bind(this);
    this.showScaleBar = this.showScaleBar.bind(this);
    this.hideScaleBar = this.hideScaleBar.bind(this);
    this.getMaxNumberOfAnimations = this.getMaxNumberOfAnimations.bind(this);
    this.drawLastTimes = this.drawLastTimes.bind(this);
    this.drawAutomatic = this.drawAutomatic.bind(this);
    this.display = this.display.bind(this);
    this.draw = this.draw.bind(this);
    this._draw = this._draw.bind(this);
    this._drawAndLoad = this._drawAndLoad.bind(this);
    this._drawReady = this._drawReady.bind(this);
    this._onLayersReadyCallbackFunction = this._onLayersReadyCallbackFunction.bind(this);
    this._onMapReadyCallbackFunction = this._onMapReadyCallbackFunction.bind(this);
    this._onResumeSuspendCallbackFunction = this._onResumeSuspendCallbackFunction.bind(this);
    this._animFrameRedraw = this._animFrameRedraw.bind(this);
    this.getWMSRequests = this.getWMSRequests.bind(this);
    this.prefetch = this.prefetch.bind(this);
    this.getImageStore = this.getImageStore.bind(this);
    this.isThisRequestLoaded = this.isThisRequestLoaded.bind(this);
    this._pdraw = this._pdraw.bind(this);
    this._updateBoundingBox = this._updateBoundingBox.bind(this);
    this.flipBuffers = this.flipBuffers.bind(this);
    this.getBackBufferCanvasContext = this.getBackBufferCanvasContext.bind(this);
    this.getFrontBufferCanvasContext = this.getFrontBufferCanvasContext.bind(this);
    this.redrawBuffer = this.redrawBuffer.bind(this);
    this.addBaseLayers = this.addBaseLayers.bind(this);
    this.setBaseLayers = this.setBaseLayers.bind(this);
    this.getBaseLayers = this.getBaseLayers.bind(this);
    this.getNumLayers = this.getNumLayers.bind(this);
    this.getBaseElement = this.getBaseElement.bind(this);
    this.flyZoomToBBOXTimerFunc = this.flyZoomToBBOXTimerFunc.bind(this);
    this.flyZoomToBBOXStop = this.flyZoomToBBOXStop.bind(this);
    this.flyZoomToBBOXStartZoom = this.flyZoomToBBOXStartZoom.bind(this);
    this.mouseWheelEvent = this.mouseWheelEvent.bind(this);
    this.pinchStart = this.pinchStart.bind(this);
    this.pinchMove = this.pinchMove.bind(this);
    this.pinchEnd = this.pinchEnd.bind(this);
    this.destroy = this.destroy.bind(this);
    this.detachEvents = this.detachEvents.bind(this);
    this.attachEvents = this.attachEvents.bind(this);
    this._getCorrectWMSDimName = this._getCorrectWMSDimName.bind(this);
    this._getMapDimURL = this._getMapDimURL.bind(this);
    this._buildLayerDims = this._buildLayerDims.bind(this);
    this.getMapMode = this.getMapMode.bind(this);
    this.getWMSMetaDataRequestURL = this.getWMSMetaDataRequestURL.bind(this);
    this.getPointInfoRequestURL = this.getPointInfoRequestURL.bind(this);
    this.getWMSGetFeatureInfoRequestURL = this.getWMSGetFeatureInfoRequestURL.bind(this);
    this.featureInfoRequestReady = this.featureInfoRequestReady.bind(this);
    this.newGetPointInfo = this.newGetPointInfo.bind(this);
    this.getPointInfo = this.getPointInfo.bind(this);
    this.newGetFeatureInfo = this.newGetFeatureInfo.bind(this);
    this.getFeatureInfo = this.getFeatureInfo.bind(this);
    this.getGetFeatureInfoObjectAsHTML = this.getGetFeatureInfoObjectAsHTML.bind(this);
    this.getMapPinXY = this.getMapPinXY.bind(this);
    this.positionMapPinByLatLon = this.positionMapPinByLatLon.bind(this);
    this.repositionMapPin = this.repositionMapPin.bind(this);
    this.setMapPin = this.setMapPin.bind(this);
    this.isMapPinVisible = this.isMapPinVisible.bind(this);
    this.showMapPin = this.showMapPin.bind(this);
    this.hideMapPin = this.hideMapPin.bind(this);
    this.setMapModeGetInfo = this.setMapModeGetInfo.bind(this);
    this.setMapModeZoomBoxIn = this.setMapModeZoomBoxIn.bind(this);
    this.setMapModeZoomOut = this.setMapModeZoomOut.bind(this);
    this.setMapModePan = this.setMapModePan.bind(this);
    this.setMapModePoint = this.setMapModePoint.bind(this);
    this.setMapModeNone = this.setMapModeNone.bind(this);
    this.getMouseCoordinatesForDocument = this.getMouseCoordinatesForDocument.bind(this);
    this.getMouseCoordinatesForElement = this.getMouseCoordinatesForElement.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this._checkInvalidMouseAction = this._checkInvalidMouseAction.bind(this);
    this.updateMouseCursorCoordinates = this.updateMouseCursorCoordinates.bind(this);
    this.mouseDownEvent = this.mouseDownEvent.bind(this);
    this.mouseMoveEvent = this.mouseMoveEvent.bind(this);
    this.mouseUpEvent = this.mouseUpEvent.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this._mouseDragStart = this._mouseDragStart.bind(this);
    this.mouseDrag = this.mouseDrag.bind(this);
    this.mouseDragEnd = this.mouseDragEnd.bind(this);
    this._mapPanStart = this._mapPanStart.bind(this);
    this._mapPan = this._mapPan.bind(this);
    this._mapPanEnd = this._mapPanEnd.bind(this);
    this._mapZoomStart = this._mapZoomStart.bind(this);
    this._mapZoom = this._mapZoom.bind(this);
    this._mapZoomEnd = this._mapZoomEnd.bind(this);
    this.setCursor = this.setCursor.bind(this);
    this.getId = this.getId.bind(this);
    this.zoomTo = this.zoomTo.bind(this);
    this.pixelCoordinatesToXY = this.pixelCoordinatesToXY.bind(this);
    this.getGeoCoordFromPixelCoord = this.getGeoCoordFromPixelCoord.bind(this);
    this.getProj4 = this.getProj4.bind(this);
    this.getPixelCoordFromLatLong = this.getPixelCoordFromLatLong.bind(this);
    this.WCJSSearchRequest = this.WCJSSearchRequest.bind(this);
    this.WCJSSearchRequestGeoNames = this.WCJSSearchRequestGeoNames.bind(this);
    this.calculateBoundingBoxAndZoom = this.calculateBoundingBoxAndZoom.bind(this);
    this.getLatLongFromPixelCoord = this.getLatLongFromPixelCoord.bind(this);
    this.getPixelCoordFromGeoCoord = this.getPixelCoordFromGeoCoord.bind(this);
    this.addListener = this.addListener.bind(this);
    this.removeListener = this.removeListener.bind(this);
    this.getListener = this.getListener.bind(this);
    this.suspendEvent = this.suspendEvent.bind(this);
    this.resumeEvent = this.resumeEvent.bind(this);
    this.getDimensionList = this.getDimensionList.bind(this);
    this.getDimension = this.getDimension.bind(this);
    this.setDimension = this.setDimension.bind(this);
    this.setLayerOpacity = this.setLayerOpacity.bind(this);
    this.zoomToLayer = this.zoomToLayer.bind(this);
    this.setPreviousExtent = this.setPreviousExtent.bind(this);
    this.setNextExtent = this.setNextExtent.bind(this);
    this.setBBOX = this.setBBOX.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.searchForLocation = this.searchForLocation.bind(this);
    this.displayLegendInMap = this.displayLegendInMap.bind(this);
    this.showBoundingBox = this.showBoundingBox.bind(this);
    this.hideBoundingBox = this.hideBoundingBox.bind(this);
    this.clearImageStore = this.clearImageStore.bind(this);
    if (!jquery) { console.warn('WMJSMap: jquery is not defined, assuming unit test is running'); return; }
    this.loadingDiv = jquery('<div class="WMJSDivBuffer-loading"/>', {});
    this.init();
  };

  setBaseURL (_baseURL) {
    this.base = _baseURL;
    this.noimage = this.base + '/img/blank.gif?';
    this.loadingImageSrc = this.base + '/img/ajax-loader.gif';
    this.WMSControlsImageSrc = this.base + '/img/mapcontrols.gif';
  };

  showDialogs (shouldShow) {
    this.showDialog = shouldShow;
  };

  setXML2JSONURL (_xml2jsonrequest) {
    this.xml2jsonrequest = _xml2jsonrequest;
  };

  setWMJSTileRendererTileSettings (_WMJSTileRendererTileSettings) {
    this.tileRenderSettings = _WMJSTileRendererTileSettings;
  };

  getLegendStore () {
    return legendImageStore;
  };

  /**
   * Function which make a component ID which is unique over several WebMapJS instances
   * @param the desired id
   * @return the unique id
   */
  makeComponentId (id) {
    if (!this.mainElement.id) {
      this.mainElement.id = 'WebMapJSMapNo_' + WebMapJSMapNo;
    }
    if (this.hasGeneratedId === false) {
      this.hasGeneratedId = true;
      WebMapJSMapNo++;
    }
    return this.mainElement.id + '_' + id;
  };

  enableInlineGetFeatureInfo (trueOrFalse) {
    this.inlineGetFeatureInfo = trueOrFalse;
  };

  dialogClosed (dialog) {
    for (let j = 0; j < this.gfiDialogList.length; j++) {
      if (this.gfiDialogList[j] === dialog) {
        this.gfiDialogList.splice(j, 1);
        j--;
      }
    }
  };

  closeAllGFIDialogs () {
    new WMJSDialog().closeAllDialogs(this.gfiDialogList);
  };

  onLegendCallbackFunction () {
    if (enableConsoleDebugging)console.log('onlegendready called');
    this.loadLegendInline();
  };

  /* Load legend inline of the map */
  loadLegendInline (somethingchanged) {

    //     try {
    //       if (isDefined(somethingchanged) === false) {
    //         somethingchanged = false;
    //       }
    //       if (this.legendBusy === true && isDefined(this.onLegendCallbackFunction)) {
    //         if (this.callBack.addToCallback('onlegendready', this.onLegendCallbackFunction) === true) {
    //           if (enableConsoleDebugging)console.log('Suspending on onlegendready');
    //         }
    //         return;
    //       }
    //       this.legendBusy = true;
    //       if (this.loadedLegendUrls.length !== this.layers.length) {
    //         somethingchanged = true;
    //       } else {
    //         for (let j = 0; j < this.layers.length; j++) {
    //           let legendUrl = this.getLegendGraphicURLForLayer(this.layers[j]);
    //           if (isDefined(legendUrl)) {
    //             if (this.loadedLegendUrls[j] !== legendUrl) {
    //               this.loadedLegendUrls[j] = legendUrl;
    //               somethingchanged = true;
    //             }
    //           }
    //         }
    //       }
    //       if (somethingchanged) {
    //         this.loadedLegendUrls = [];
    //         for (let j = 0; j < this.layers.length; j++) {
    //           if (this.layers[j].enabled !== false) {
    //             let legendUrl = this.getLegendGraphicURLForLayer(this.layers[j]);
    //
    //             if (isDefined(legendUrl)) {
    //               this.loadedLegendUrls[j] = legendUrl;
    //             }
    //           }
    //         }
    //
    //         if (somethingchanged){
    //           console.log( this.loadedLegendUrls);
    //         }
    //         return;
    //       }
    //
    //     } catch (e) {
    //       console.log(e);
    //     }
    //     this.legendBusy = false;
    //     this.callBack.triggerEvent('onlegendready');
  };

  setMessage (message) {
    if (!message || message === '') {
      this.setMessageValue = '';
    } else {
      this.setMessageValue = message;
    }
  };

  setTimeOffset (message) {
    if (!message || message === '') {
      this.setTimeOffsetValue = '';
    } else {
      this.setTimeOffsetValue = message;
    }
  };

  /* Is called when the WebMapJS object is created */
  init () {
    try {
      if (geoNamesURL) {
        this.geoNamesURL = geoNamesURL;
      }
    } catch (e) {
    }
    try {
      if (defaultUsernameSearch) {
        this.defaultUsernameSearch = defaultUsernameSearch;
      }
    } catch (e) {
    }

    try {
      if (xml2jsonrequestURL) {
        this.setXML2JSONURL(xml2jsonrequestURL);
      }
    } catch (e) {
    }

    try {
      if (WMJSTileRendererTileSettings) {
        this.setWMJSTileRendererTileSettings(WMJSTileRendererTileSettings);
      }
    } catch (e) {
    }
    if (!this.mainElement) {
      return;
    }
    if (this.mainElement.style) {
      if (!this.mainElement.style.height) {
        this.mainElement.style.height = '1px';
      }
      if (!this.mainElement.style.width) {
        this.mainElement.style.width = '1px';
      }
    }
    this.baseDivId = this.makeComponentId('baseDiv');
    jquery('<div/>', {
      id:this.baseDivId,
      css: {
        position:'relative',
        overflow:'hidden',
        width: this.mainElement.clientWidth,
        height: this.mainElement.clientHeight,
        border:'0px  solid black',
        margin:0,
        padding:0,
        clear:'both',
        left:'0px',
        top:'0px'
      }
    }).appendTo(this.mainElement);
    this.baseDiv = jquery('#' + this.baseDivId);

    this.baseDiv.css('cursor', 'default');

    this.mainElement.style.margin = '0px';
    this.mainElement.style.padding = '0px';
    this.mainElement.style.border = 'none';// "1px solid gray";
    this.mainElement.style.lineHeight = '0px';
    this.mainElement.style.display = 'inline-block';

    // Attach zoombox
    this.divZoomBox.style.position = 'absolute';
    this.divZoomBox.style.display = 'none';
    this.divZoomBox.style.border = '2px dashed #000000';
    this.divZoomBox.style.margin = '0px';
    this.divZoomBox.style.padding = '0px';
    this.divZoomBox.style.lineHeight = '0';
    this.divZoomBox.style.background = '#AFFFFF';
    this.divZoomBox.style.opacity = '0.3'; // Gecko
    this.divZoomBox.style.filter = 'alpha(opacity=30)'; // Windows
    this.divZoomBox.style.left = '0px';
    this.divZoomBox.style.top = '0px';
    this.divZoomBox.style.width = '100px';
    this.divZoomBox.style.height = '100px';
    this.divZoomBox.style.zIndex = 1000;
    this.divZoomBox.oncontextmenu = () => { return false; };
    this.baseDiv.append(this.divZoomBox);

    // Attach bbox box
    this.divBoundingBox.style.position = 'absolute';
    this.divBoundingBox.style.display = 'none';
    this.divBoundingBox.style.border = '3px solid #6060FF';
    this.divBoundingBox.style.margin = '0px';
    this.divBoundingBox.style.padding = '0px';
    this.divBoundingBox.style.lineHeight = '0';
    this.divBoundingBox.style.left = '0px';
    this.divBoundingBox.style.top = '0px';
    this.divBoundingBox.style.width = '100px';
    this.divBoundingBox.style.height = '100px';
    this.divBoundingBox.style.zIndex = 1000;
    this.divBoundingBox.oncontextmenu = () => { return false; };
    this.baseDiv.append(this.divBoundingBox);

    /* Attach divDimInfo */
    this.divDimInfo.style.position = 'absolute';
    this.divDimInfo.style.zIndex = 1000;
    this.divDimInfo.style.width = 'auto';
    this.divDimInfo.style.height = 'auto';
    this.divDimInfo.style.background = 'none';

    this.divDimInfo.oncontextmenu = () => { return false; };
    this.divDimInfo.innerHTML = '';
    this.baseDiv.append(this.divDimInfo);

    /* Attach loading image */

    this.baseDiv.append(this.loadingDiv);

    /* ONLY VISIBLE IF USERNAME FOR GEONAMES API IS SET */
    if (typeof (defaultUsernameSearch) !== 'undefined') {
      /* Creating the div for the input */
      jquery('<div/>', {
        id: this.makeComponentId('searchboxdiv'),
        mousedown:(event) => { event.stopPropagation(); }
      }).addClass('webmapjs_searchboxdiv').html('<input class=\'webmapjs_locationfield\' type=\'text\' name=\'searchtextfield\'' +
        ' id=\'searchtextfield\' placeholder=' + I18n.place_search_term.text + ' />', {
        mousedown:(event) => { event.stopPropagation(); preventdefaultEvent(event); } })
        .appendTo(this.baseDiv);

      jquery('<button/>', {
        id: this.makeComponentId('searchboxbutton'),
        mousedown:(event) => { event.stopPropagation(); },
        click:() => {
          let value = jquery('#searchtextfield').val();
          this.searchForLocation(value);
        } }).addClass('webmapjs_locationbutton').appendTo(this.baseDiv);

      /* On Enter */
      jquery('#searchtextfield').keypress((e) => {
        if (e.which === 13) {
          let value = jquery('#searchtextfield').val();
          this.searchForLocation(value);
          return false;
        }
      });
    }
    /* Attach events */
    this.attachEvents();

    this.bbox.left = -180;
    this.bbox.bottom = -90;
    this.bbox.right = 180;
    this.bbox.top = 90;
    this.srs = 'EPSG:4326';
    this.setSize(this.mainElement.clientWidth, this.mainElement.clientHeight);
    // IMAGE buffers
    for (let j = 0; j < 2; j++) {
      let d = new WMJSCanvasBuffer(this.callBack, 'imagebuffer', getMapImageStore, this.getWidth(), this.getHeight());
      getMapImageStore.addLoadEventCallback(d.imageLoadComplete);
      this.baseDiv.append(d.getBuffer());
      this.divBuffer.push(d);
    }

    legendImageStore.addLoadEventCallback(() => {
      this.draw('legendImageStore loaded');
    });

    this.callBack.addToCallback('display', this.display, true);
    this.callBack.addToCallback('draw', () => {
      console.log('draw event triggered externally, skipping');
    }, true);
    // callBack.addToCallback("drawbuffers",this.flipBuffers,true);

    bgMapImageStore.addLoadEventCallback(() => {
      this.draw('bgMapImageStore loaded');
    });
    let adagucBeforeDraw = (ctx) => {
      if (this.baseLayers) {
        for (let l = 0; l < this.baseLayers.length; l++) {
          if (this.baseLayers[l].enabled) {
            if (this.baseLayers[l].keepOnTop === false) {
              if (this.baseLayers[l].type && this.baseLayers[l].type !== 'twms') continue;
              if (!this.tileRenderSettings) { console.log('tileRenderSettings not set'); continue; }
              const { attributionText } = this.wmjsTileRenderer.render(
                this.bbox,
                this.updateBBOX,
                this.srs,
                this.width,
                this.height,
                ctx,
                bgMapImageStore,
                this.tileRenderSettings,
                this.baseLayers[l].name
              );
              {
                const adagucAttribution = ('ADAGUC webmapjs ' + this.WebMapJSMapVersion);
                const txt = attributionText ? (adagucAttribution + ' | ' + attributionText) : adagucAttribution;
                const x = this.width - 8;
                const y = this.height - 8;
                ctx.font = '10px Arial';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#FFF';
                ctx.globalAlpha = 0.75;
                const width = ctx.measureText(txt).width;
                ctx.fillRect(x - (width), y - 6, (width) + 8, parseInt(14));
                ctx.fillStyle = '#444';
                ctx.globalAlpha = 1.0;
                ctx.fillText(txt, x + 4, y + 2);
              }
            }
          }
        }
      }
    };

    this.addListener('beforecanvasstartdraw', adagucBeforeDraw, true);

    let drawTextBG = (ctx, txt, x, y, fontSize) => {
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFF';
      ctx.globalAlpha = 0.75;
      const width = ctx.measureText(txt).width;
      ctx.fillRect(x - 8, y - 8, width + 16, parseInt(fontSize) + 14);
      ctx.fillStyle = '#444';
      ctx.globalAlpha = 1.0;
      ctx.fillText(txt, x, y + 2);
    };

    let adagucBeforeCanvasDisplay = (ctx) => {
      // console.log('adagucBeforeCanvasDisplay' + this.getId());
      /* Map Pin */
      if (this.divMapPin.displayMapPin) {
        WMJSDrawMarker(ctx, this.divMapPin.x, this.divMapPin.y, '#9090FF', '#000');
      }

      if (this._displayLegendInMap) {
        /* Draw legends */
        let legendPosX = 0;
        for (let j = 0; j < this.layers.length; j++) {
          if (this.layers[j].enabled !== false) {
            let legendUrl = this.getLegendGraphicURLForLayer(this.layers[j]);
            if (isDefined(legendUrl)) {
              let image = legendImageStore.getImage(legendUrl);
              if (image.hasError() === false) {
                if (image.isLoaded() === false && image.isLoading() === false) {
                  image.load();
                } else {
                  let el = image.getElement()[0];
                  let legendW = parseInt(el.width) + 4;
                  let legendH = parseInt(el.height) + 4;
                  legendPosX += (legendW + 4);
                  let legendX = this.width - legendPosX + 2;
                  let legendY = this.height - (legendH) - 2 - 13;
                  ctx.beginPath();
                  ctx.fillStyle = '#FFFFFF';
                  ctx.lineWidth = 0.3;
                  ctx.globalAlpha = 0.5;
                  ctx.strokeStyle = '#000000';
                  ctx.rect(parseInt(legendX) + 0.5, parseInt(legendY) + 0.5, legendW, legendH);
                  ctx.fill();
                  ctx.stroke();
                  ctx.globalAlpha = 1.0;
                  ctx.drawImage(el, legendX, legendY);
                }
              }
            }
          }
        }
      }

      /* Map header */
      if (this.isMapHeaderEnabled) {
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.mapHeader.height);
        if (this.mapIsActivated === false) {
          ctx.globalAlpha = this.mapHeader.hovering ? this.mapHeader.hover.opacity : this.mapHeader.fill.opacity;
          ctx.fillStyle = this.mapHeader.hovering ? this.mapHeader.hover.color : this.mapHeader.fill.color;
        } else {
          ctx.globalAlpha = this.mapHeader.hovering ? this.mapHeader.hoverSelected.opacity : this.mapHeader.selected.opacity;
          ctx.fillStyle = this.mapHeader.hovering ? this.mapHeader.hoverSelected.color : this.mapHeader.selected.color;
        }
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      /* Gather errors */
      for (let i = 0; i < this.layers.length; i++) {
        // let request = '';
        for (let j = 0; j < this.layers[i].dimensions.length; j++) {
          // request += '&' + this._getCorrectWMSDimName(this.layers[i].dimensions[j].name);
          // request += '=' + URLEncode(this.layers[i].dimensions[j].currentValue);
          if (this.layers[i].dimensions[j].currentValue === WMJSDateOutSideRange) {
            this.canvasErrors.push({ linkedInfo: { layer:this.layers[i], message: 'Time outside range' } });
          } else if (this.layers[i].dimensions[j].currentValue === WMJSDateTooEarlyString) {
            this.canvasErrors.push({ linkedInfo:{ layer:this.layers[i], message: 'Time too early' } });
          } else if (this.layers[i].dimensions[j].currentValue === WMJSDateTooLateString) {
            this.canvasErrors.push({ linkedInfo:{ layer:this.layers[i], message: 'Time too late' } });
          }
        }
      }

      /* Display errors found during drawing canvas */
      if (this.canvasErrors && this.canvasErrors.length > 0) {
        let mw = this.width / 2;
        let mh = 6 + this.canvasErrors.length * 15;
        let mx = this.width - mw;
        let my = this.isMapHeaderEnabled ? this.mapHeader.height : 0;
        ctx.beginPath();
        ctx.rect(mx, my, mx + mw, my + mh);
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'black';
        ctx.font = '10pt Helvetica';
        ctx.textAlign = 'left';

        for (let j = 0; j < this.canvasErrors.length; j++) {
          if (this.canvasErrors[j].linkedInfo) {
            let message = this.canvasErrors[j].linkedInfo.message ? ', ' + this.canvasErrors[j].linkedInfo.message : '';
            ctx.fillText('Layer with title ' + this.canvasErrors[j].linkedInfo.layer.title + ' failed to load' + message, mx + 5, my + 11 + j * 15);
          } else {
            ctx.fillText('Layer failed to load.', mx + 5, my + 11 + j * 15);
          }
        }
        this.canvasErrors = [];
      }

      // Time offset message
      if (this.setTimeOffsetValue !== '') {
        ctx.font = '20px Helvetica';
        drawTextBG(ctx, this.setTimeOffsetValue, (this.width / 2) - 70, this.height - 26, 20);
      }

      // Set message value
      if (this.setMessageValue !== '') {
        ctx.font = '15px Helvetica';
        drawTextBG(ctx, this.setMessageValue, (this.width / 2) - 70, 2, 15);
      }

      // ScaleBar
      if (this.showScaleBarInMap === true) {
        let getScaleBarProperties = () => {
          let desiredWidth = 25;
          let realWidth = 0;
          let numMapUnits = 1.0 / 10000000.0;

          let boxWidth = this.updateBBOX.right - this.updateBBOX.left;
          let pixelsPerUnit = this.width / boxWidth;
          if (pixelsPerUnit <= 0) {
            return;
          }

          let a = desiredWidth / pixelsPerUnit;

          let divFactor = 0;
          do {
            numMapUnits *= 10.0;
            divFactor = a / numMapUnits;
            if (divFactor === 0) return;
            realWidth = desiredWidth / divFactor;
          } while (realWidth < desiredWidth);

          do {
            numMapUnits /= 2.0;
            divFactor = a / numMapUnits;
            if (divFactor === 0) return;
            realWidth = desiredWidth / divFactor;
          } while (realWidth > desiredWidth);

          do {
            numMapUnits *= 1.2;
            divFactor = a / numMapUnits;
            if (divFactor === 0) return;
            realWidth = desiredWidth / divFactor;
          } while (realWidth < desiredWidth);

          let roundedMapUnits = numMapUnits;

          let d = Math.pow(10, Math.round(Math.log10(numMapUnits) + 0.5) - 1);

          roundedMapUnits = Math.round(roundedMapUnits / d);
          if (roundedMapUnits < 2.5)roundedMapUnits = 2.5;
          if (roundedMapUnits > 2.5 && roundedMapUnits < 7.5)roundedMapUnits = 5;
          if (roundedMapUnits > 7.5)roundedMapUnits = 10;
          roundedMapUnits = (roundedMapUnits * d);
          divFactor = (desiredWidth / pixelsPerUnit) / roundedMapUnits;
          realWidth = desiredWidth / divFactor;
          return { width:parseInt(realWidth), mapunits: roundedMapUnits };
        };
        let scaleBarProps = getScaleBarProperties();
        if (scaleBarProps) {
          let offsetX = 7.5;
          let offsetY = this.height - 25.5;
          let scaleBarHeight = 23;
          ctx.beginPath();
          ctx.lineWidth = 2.5;
          ctx.fillStyle = '#000';
          ctx.strokeStyle = '#000';
          ctx.font = '9px Helvetica';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'left';
          for (let j = 0; j < 2; j++) {
            ctx.moveTo(offsetX, scaleBarHeight - 2 - j + offsetY);
            ctx.lineTo(scaleBarProps.width * 2 + offsetX + 1, scaleBarHeight - 2 - j + offsetY);
          }

          let subDivXW = parseInt(Math.round(scaleBarProps.width / 5));
          ctx.lineWidth = 0.5;
          for (let j = 1; j < 5; j++) {
            ctx.moveTo(offsetX + subDivXW * j, scaleBarHeight - 2 + offsetY);
            ctx.lineTo(offsetX + subDivXW * j, scaleBarHeight - 2 - 5 + offsetY);
          }
          ctx.lineWidth = 1.0;
          ctx.moveTo(offsetX, scaleBarHeight - 2 + offsetY);
          ctx.lineTo(offsetX, scaleBarHeight - 2 - 7 + offsetY);
          ctx.moveTo(offsetX + scaleBarProps.width, scaleBarHeight - 2 + offsetY);
          ctx.lineTo(offsetX + scaleBarProps.width, scaleBarHeight - 2 - 7 + offsetY);
          ctx.moveTo(offsetX + scaleBarProps.width * 2 + 1, scaleBarHeight - 2 + offsetY);
          ctx.lineTo(offsetX + scaleBarProps.width * 2 + 1, scaleBarHeight - 2 - 7 + offsetY);

          let units = '';
          if (this.srs === 'EPSG:3411') units = 'meter';
          if (this.srs === 'EPSG:3412') units = 'meter';
          if (this.srs === 'EPSG:3575') units = 'meter';
          if (this.srs === 'EPSG:4326') units = 'degrees';
          if (this.srs === 'EPSG:28992') units = 'meter';
          if (this.srs === 'EPSG:32661') units = 'meter';
          if (this.srs === 'EPSG:3857') units = 'meter';
          if (this.srs === 'EPSG:900913') units = 'meter';
          if (this.srs === 'EPSG:102100') units = 'meter';

          if (units === 'meter') {
            if (scaleBarProps.mapunits > 1000) {
              scaleBarProps.mapunits /= 1000;
              units = 'km';
            }
          }
          ctx.fillText('0', offsetX - 3, 12 + offsetY);

          // valueStr.print("%g",(p.mapunits));
          let valueStr = scaleBarProps.mapunits.toPrecision() + '';
          ctx.fillText(valueStr, offsetX + scaleBarProps.width - valueStr.length * 2.5 + 0, 12 + offsetY);
          valueStr = (scaleBarProps.mapunits * 2).toPrecision() + '';
          ctx.fillText(valueStr, offsetX + scaleBarProps.width * 2 - valueStr.length * 2.5 + 0, 12 + offsetY);
          ctx.fillText(units, offsetX + scaleBarProps.width * 2 + 10, 18 + offsetY);
          ctx.stroke();
        }
      }

      // Mouse projected coords
      ctx.font = '10px Helvetica';
      ctx.textBaseline = 'middle';
      if (isDefined(this.mouseGeoCoordXY)) {
        let roundingFactor = 1.0 / Math.pow(10, parseInt(Math.log((this.bbox.right - this.bbox.left) / this.width) / Math.log(10)) - 2);
        if (roundingFactor < 1)roundingFactor = 1;
        ctx.fillStyle = '#000000';
        let xText = Math.round(this.mouseGeoCoordXY.x * roundingFactor) / roundingFactor;
        let yText = Math.round(this.mouseGeoCoordXY.y * roundingFactor) / roundingFactor;
        let units = '';
        if (this.srs === 'EPSG:3857') {
          units = 'meter';
        }
        ctx.fillText('CoordYX: (' + yText + ', ' + xText + ') ' + units, 5, this.height - 50);
      }
      // Mouse latlon coords
      if (isDefined(this.mouseUpdateCoordinates)) {
        let llCoord = this.getLatLongFromPixelCoord(this.mouseUpdateCoordinates);

        if (isDefined(llCoord)) {
          let roundingFactor = 100;
          ctx.fillStyle = '#000000';
          let xText = Math.round(llCoord.x * roundingFactor) / roundingFactor;
          let yText = Math.round(llCoord.y * roundingFactor) / roundingFactor;
          ctx.fillText('Lat/Lon: (' + yText.toFixed(2) + ', ' + xText.toFixed(2) + ') ' + ' degrees', 5, this.height - 38);
        }
      }
      ctx.fillStyle = '#000000';
      ctx.fillText('Map projection: ' + this.srs, 5, this.height - 26);

      // ctx.font = '7px Helvetica';
      // ctx.fillText('ADAGUC webmapjs ' + this.WebMapJSMapVersion, this.width - 85, this.height - 5);
    };
    this.addListener('beforecanvasdisplay', (ctx) => {
      adagucBeforeCanvasDisplay(ctx);
      //       window.requestAnimationFrame(() => {
      //         this.draw();
      //       });
    }, true);
    this.addListener('canvasonerror', (e) => { this.canvasErrors = e; }, true);
    this._updateBoundingBox(this.bbox);
    this.wmjsAnimate = new WMJSAnimate(this);
    this.wmjsTileRenderer = new WMJSTileRenderer();
    this.initialized = 1;
  };

  rebuildMapDimensions () {
    for (let j = 0; j < this.mapdimensions.length; j++) {
      this.mapdimensions[j].used = false;
    }

    for (let i = 0; i < this.layers.length; i++) {
      for (let j = 0; j < this.layers[i].dimensions.length; j++) {
        let dim = this.layers[i].dimensions[j];

        let mapdim = this.getDimension(dim.name);
        if (isDefined(mapdim)) {
          mapdim.used = true;
        } else {
          let newdim = dim.clone();
          newdim.used = true;
          this.mapdimensions.push(newdim);
        }
      }
    }

    for (let j = 0; j < this.mapdimensions.length; j++) {
      if (this.mapdimensions[j].used === false) {
        this.mapdimensions.splice(j, 1);
        j--;
      }
    }
    this.callBack.triggerEvent('onmapdimupdate');
  };

  getLayerByServiceAndName (layerService, layerName) {
    for (let j = 0; j < this.layers.length; j++) {
      let layer = this.layers[this.layers.length - j - 1];
      if (layer.name === layerName) {
        if (layer.service === layerService) {
          return layer;
        }
      }
    }
  };

  getLayers () {
    /* Provide layers in reverse order */
    let returnlayers = [];
    for (let j = 0; j < this.layers.length; j++) {
      let layer = this.layers[this.layers.length - j - 1];
      returnlayers.push(layer);
    }
    return returnlayers;
  };

  setLayer (layer, getcapdoc) {
    return this.addLayer(layer, getcapdoc, layer);
  };

  /* Indicate weather this map component is active or not */
  setActive (active) {
    this.mapIsActivated = active;
    this.isMapHeaderEnabled = true;
  };

  setActiveLayer (layer) {
    for (let j = 0; j < this.layers.length; j++) {
      this.layers[j].active = false;
    }
    this.activeLayer = layer;
    this.activeLayer.active = true;
    this.loadLegendInline();
    this.callBack.triggerEvent('onchangeactivelayer');
  };

  // Calculates how many baselayers there are.
  // Useful when changing properties for a divbuffer index (for example setLayerOpacity)
  calculateNumBaseLayers () {
    this.numBaseLayers = 0;
    if (this.baseLayers) {
      for (let l = 0; l < this.baseLayers.length; l++) {
        if (this.baseLayers[l].enabled) {
          if (this.baseLayers[l].keepOnTop === false) {
            this.numBaseLayers++;
          }
        }
      }
    }
  };

  enableLayer (layer) {
    layer.enabled = true;
    this.calculateNumBaseLayers();
    this.rebuildMapDimensions();
    this.loadLegendInline(true);
  };
  disableLayer (layer) {
    layer.enabled = false;
    this.calculateNumBaseLayers();
    this.rebuildMapDimensions();
    this.loadLegendInline(true);
  };
  toggleLayer (layer) {
    if (layer.enabled === true) {
      layer.enabled = false;
    } else layer.enabled = true;
    this.calculateNumBaseLayers();
    this.rebuildMapDimensions();
    this.loadLegendInline(true);
  };

  displayLayer (layer, enabled) {
    layer.enabled = enabled;
    this.calculateNumBaseLayers();
    this.rebuildMapDimensions();
    this.loadLegendInline(true);
  };

  _getLayerIndex (layer) {
    if (!layer) return;
    for (let j = 0; j < this.layers.length; j++) {
      if (this.layers[j] === layer) {
        return j;
      }
    }
    return -1;
  };

  removeAllLayers () {
    for (let i = 0; i < this.layers.length; ++i) {
      this.layers[i].setAutoUpdate(false);
    }
    this.layers.length = 0;
    this.mapdimensions.length = 0;
    this.callBack.triggerEvent('onlayeradd');
  };

  deleteLayer (layerToDelete) {
    if (this.layers.length <= 0) return;
    layerToDelete.setAutoUpdate(false);
    let layerIndex = this._getLayerIndex(layerToDelete);
    if (layerIndex >= 0) {
      // move everything up with id's higher than this layer
      for (let j = layerIndex; j < this.layers.length - 1; j++) {
        this.layers[j] = this.layers[j + 1];
      }
      this.layers.length--;

      this.activeLayer = undefined;
      if (layerIndex >= 0 && layerIndex < this.layers.length) {
        this.rebuildMapDimensions();
        this.setActiveLayer(this.layers[layerIndex]);
      } else {
        if (this.layers.length > 0) {
          this.rebuildMapDimensions();
          this.setActiveLayer(this.layers[this.layers.length - 1]);
        }
      }
    }
    this.callBack.triggerEvent('onlayerchange');
    this.rebuildMapDimensions();
  };

  moveLayerDown (layerToMove) {
    let layerIndex = this._getLayerIndex(layerToMove);
    if (layerIndex > 0) {
      let layerToMoveDown = this.layers[layerIndex - 1];
      let layer = this.layers[layerIndex];
      if (layerToMoveDown && layer) {
        this.layers[layerIndex] = layerToMoveDown;
        this.layers[layerIndex - 1] = layer;
      }
    } else {
      try {
        error('moveLayerDown: layer \'' + layerToMove.name + '\' not found.');
      } catch (e) {
        error('moveLayerDown: layer invalid.');
      }
    }
  };

  swapLayers (layerA, layerB) {
    // console.log('--- swap layers ---');
    // for(let j = 0;j < this.layers.length; j++ ) {
    //   console.log(j + '). Name: ' + this.layers[j].name);
    // }
    let layerIndexA = this._getLayerIndex(layerA);
    let layerIndexB = this._getLayerIndex(layerB);
    // console.log(layerIndexA, layerIndexB);
    if (layerIndexA >= 0 && layerIndexB >= 0) {
      let layerA = this.layers[layerIndexA];
      let layerB = this.layers[layerIndexB];
      // console.log(layerA.name, layerB.name);
      if (layerB && layerA) {
        this.layers[layerIndexA] = layerB;
        this.layers[layerIndexB] = layerA;
      }
    } else {
      try {
        error('moveLayers: layer \'' + layerA.name + '\' not found.');
      } catch (e) {
        error('moveLayers: layer invalid.');
      }
    }
    // console.log('---');
    // for(let j = 0;j < this.layers.length; j++ ) {
    //   console.log(j + '). Name: ' + this.layers[j].name);
    // }
  }

  moveLayerUp (layerToMove) {
    let layerIndex = this._getLayerIndex(layerToMove);
    if (layerIndex < this.layers.length - 1) {
      let layerToMoveUp = this.layers[layerIndex + 1];
      let layer = this.layers[layerIndex];
      if (layerToMoveUp && layer) {
        this.layers[layerIndex] = layerToMoveUp;
        this.layers[layerIndex + 1] = layer;
      }
    } else {
      try {
        error('moveLayerUp: layer \'' + layerToMove.name + '\' not found.');
      } catch (e) {
        error('moveLayerUp: layer invalid.');
      }
    }
  };

  /**
   * @param layer of type WMJSLayer
   */
  addLayer (layer) {
    if (!isDefined(layer)) {
      console.warn('addLayer: undefined layer');
      return;
    }

    if (!layer.constructor) {
      console.warn('addLayer: layer has no constructor, skipping addLayer.');
      return;
    }

    if (!layer.parentMaps.includes(this)) {
      layer.parentMaps.push(this);
    }
    this.layers.push(layer);
    let done = (layerCallback) => {
      for (let j = 0; j < layerCallback.dimensions.length; j++) {
        let mapDim = this.getDimension(layerCallback.dimensions[j].name);
        if (isDefined(mapDim)) {
          if (isDefined(mapDim.currentValue)) {
            if (layerCallback.dimensions[j].linked === true) {
              layerCallback.dimensions[j].setClosestValue(mapDim.currentValue);
            }
          }
        }
      }

      this.rebuildMapDimensions();
      this.callBack.triggerEvent('onlayeradd');
    };
    layer.parseLayer(done, undefined, 'WMJSLayer::addLayer');
  };

  getActiveLayer () {
    return this.activeLayer;
  };

  /**
    * setProjection
    * Set the projection of the current webmap object
    *_srs also accepts a projectionProperty object
    */
  setProjection (_srs, _bbox) {
    this.hideMapPin();
    if (!_srs)_srs = 'EPSG:4326';
    if (typeof (_srs) === 'object') {
      _bbox = _srs.bbox;
      _srs = _srs.srs;
    }
    if (!_srs)_srs = 'EPSG:4326';
    this.srs = _srs;
    this.updateSRS = this.srs;

    if (this.proj4.srs !== this.srs || !isDefined(this.proj4.projection)) {
      if (this.srs === 'GFI:TIME_ELEVATION') {
        this.proj4.projection = ('EPSG:4326');
      } else {
        this.proj4.projection = (this.srs);
      }
      this.proj4.srs = this.srs;
    }
    this.setBBOX(_bbox);
    this.defaultBBOX.setBBOX(_bbox);
    this.updateMouseCursorCoordinates();
    this.callBack.triggerEvent('onsetprojection', [this.srs, this.bbox]);
  };

  getBBOX () {
    return this.updateBBOX;
  };

  getProjection (srsName) {
    return { srs: this.srs, bbox: this.bbox };
  };

  getSize () {
    return { width: this.width, height: this.height };
  };

  getWidth () {
    return this.width;
  };

  getHeight () {
    return this.height;
  };

  repositionLegendGraphic (force) {
    if (this._displayLegendInMap) {
      this.loadLegendInline(force);
    } else {
      this.draw();
    }
  };

  setSize (w, h, nodraw) {
    if (enableConsoleDebugging)console.log('setSize', w, h);
    if (parseInt(w) < 4 || parseInt(h) < 4) {
      return;
    }
    this.resizeWidth = parseInt(w);
    this.resizeHeight = parseInt(h);
    /**
      Enable following line to enable smooth scaling during resize transitions. Is heavier for browser:
      this._setSize((this.resizeWidth) | 0, (this.resizeHeight) | 0);
    */

    if (nodraw === true) {
      this._setSize(this.resizeWidth, this.resizeHeight);
      return;
    }
    if (this._resizeTimerBusy === false) {
      this._resizeTimerBusy = true;
      this._setSize(this.resizeWidth, this.resizeHeight);
      return;
    }
    this._resizeTimer.init(200, () => {
      this._resizeTimerBusy = false;
      this._setSize(this.resizeWidth, this.resizeHeight);
      this.draw('resizeTimer');
    });
  };

  _setSize (w, h) {
    if (!w || !h) return;
    if (parseInt(w) < 4 || parseInt(h) < 4) {
      return;
    }

    if (enableConsoleDebugging)console.log('setSize(' + w + ',' + h + ')');
    let projinfo = this.getProjection();
    this.width = parseInt(w);
    this.height = parseInt(h);
    if (this.width < 4 || isNaN(this.width)) this.width = 4;
    if (this.height < 4 || isNaN(this.height)) this.height = 4;
    if (!projinfo.srs || !projinfo.bbox) {
      error('this.setSize: Setting default projection (EPSG:4326 with (-180,-90,180,90)');
      projinfo.srs = 'EPSG:4326';
      projinfo.bbox.left = -180;
      projinfo.bbox.bottom = -90;
      projinfo.bbox.right = 180;
      projinfo.bbox.top = 90;
      this.setProjection(projinfo.srs, projinfo.bbox);
    }
    this.baseDiv.css({ width:this.width, height:this.height });
    if (!this.mainElement.style) return;
    this.mainElement.style.width = this.width + 'px';
    this.mainElement.style.height = this.height + 'px';
    this.setBBOX(this.resizeBBOX);
    this.repositionMapPin();
    this.showBoundingBox();
    if (this.divBuffer.length > 1) {
      this.divBuffer[0].resize(this.getWidth(), this.getHeight());
      this.divBuffer[1].resize(this.getWidth(), this.getHeight());
    }

    this.repositionLegendGraphic(true);

    if (this.divBuffer[this.currentSwapBuffer]) {
      this.divBuffer[this.currentSwapBuffer].display();
    }

    /* Fire the onresize event, to notify listeners that something happened. */
    this.callBack.triggerEvent('onresize', [this.width, this.height]);
  };

  getBBOXandProjString (layer) {
    let request = '';
    if (layer.version === WMSVersion.version100 || layer.version === WMSVersion.version111) {
      request += 'SRS=' + URLEncode(this.srs) + '&';
      request += 'BBOX=' + this.bbox.left + ',' + this.bbox.bottom + ',' + this.bbox.right + ',' + this.bbox.top + '&';
    }
    if (layer.version === WMSVersion.version130) {
      request += 'CRS=' + URLEncode(this.srs) + '&';

      if (this.srs === 'EPSG:4326' && layer.wms130bboxcompatibilitymode === false) {
        request += 'BBOX=' + this.bbox.bottom + ',' + this.bbox.left + ',' + this.bbox.top + ',' + this.bbox.right + '&';
      } else {
        request += 'BBOX=' + this.bbox.left + ',' + this.bbox.bottom + ',' + this.bbox.right + ',' + this.bbox.top + '&';
      }
    }
    return request;
  };

  isTouchDevice () {
    return false; // TODO touch is not working properly on Max
    // let _webMapJSSettings = null;
    // try {
    //   _webMapJSSettings = webMapJSSettings; // eslint-disable-line no-undef
    // } catch (e) {
    // }
    // if (_webMapJSSettings !== null && _webMapJSSettings.enableTouchDevice === true) {
    //   return typeof window.ontouchstart !== 'undefined';
    // }
    // return false;
  };

  getDimensionRequestString (layer) {
    return this._getMapDimURL(layer);
  };

  dateToISO8601 (date) {
    let prf = (input, width) => {
      // print decimal with fixed length (preceding zero's)
      let string = input + '';
      let len = width - string.length;
      let j;
      let zeros = '';
      for (j = 0; j < len; j++)zeros += '0' + zeros;
      string = zeros + string;
      return string;
    };
    let iso = prf(date.getUTCFullYear(), 4) +
        '-' + prf(date.getUTCMonth() + 1, 2) +
            '-' + prf(date.getUTCDate(), 2) +
                'T' + prf(date.getUTCHours(), 2) +
                    ':' + prf(date.getUTCMinutes(), 2) +
                        ':' + prf(date.getUTCSeconds(), 2) + 'Z';
    return iso;
  };

  // Build a valid WMS request for a certain layer
  buildWMSGetMapRequest (layer) {
    if (!isDefined(layer.name)) return;
    if (!layer.format) { layer.format = 'image/png'; error('layer format missing!'); }
    if (layer.name.length < 1) return;

    // GetFeatureInfo timeseries in the mapview
    if (this.srs === 'GFI:TIME_ELEVATION') {
      let x = 707;
      let y = 557;
      let _bbox = '29109.947643979103,6500000,1190890.052356021,7200000';
      let _srs = 'EPSG:3857';

      let request = layer.getmapURL;
      request += '&SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=' + layer.version;

      request += '&LAYERS=' + URLEncode(layer.name);

      let baseLayers = layer.name.split(',');
      request += '&QUERY_LAYERS=' + URLEncode(baseLayers[baseLayers.length - 1]);
      request += '&BBOX=' + _bbox;
      if (layer.version === WMSVersion.version100 || layer.version === WMSVersion.version111) {
        request += '&SRS=' + URLEncode(_srs) + '&';
      }
      if (layer.version === WMSVersion.version130) {
        request += '&CRS=' + URLEncode(_srs) + '&';
      }
      request += 'WIDTH=' + this.width;
      request += '&HEIGHT=' + this.height;
      if (layer.version === WMSVersion.version100 || layer.version === WMSVersion.version111) {
        request += '&X=' + x;
        request += '&Y=' + y;
      }
      if (layer.version === WMSVersion.version130) {
        request += '&I=' + x;
        request += '&J=' + y;
      }

      if (layer.sldURL) {
        request += '&SLD=' + URLEncode(layer.sldURL);
      }

      request += '&FORMAT=image/gif';
      request += '&INFO_FORMAT=image/png';
      request += '&STYLES=';

      let startDate = this.dateToISO8601(new Date(this.bbox.left));
      let stopDate = this.dateToISO8601(new Date(this.bbox.right));

      request += '&time=' + startDate + '/' + stopDate;
      request += '&elevation=' + this.bbox.bottom + '/' + this.bbox.top;

      return request;
    }

    let request = layer.getmapURL;
    request += '&SERVICE=WMS&';
    request += 'VERSION=' + layer.version + '&';
    request += 'REQUEST=GetMap&';
    request += 'LAYERS=' + URLEncode(layer.name) + '&';
    request += 'WIDTH=' + this.width + '&';
    request += 'HEIGHT=' + (this.height) + '&';

    request += this.getBBOXandProjString(layer);

    if (layer.sldURL) {
      request += 'SLD=' + URLEncode(layer.sldURL) + '&';
    }
    request += 'STYLES=' + URLEncode(layer.currentStyle) + '&';
    request += 'FORMAT=' + layer.format + '&';
    if (layer.transparent === true) {
      request += 'TRANSPARENT=TRUE&';
    } else {
      request += 'TRANSPARENT=FALSE&';
    }
    // Handle dimensions
    try {
      request += this._getMapDimURL(layer);
    } catch (e) {
      return undefined;
    }
    // Handle WMS extensions
    request += layer.wmsextensions.url;
    return request;
  };

  abort () {
    this.callBack.triggerEvent('onmapready');
    this.mapBusy = false;
    this.callBack.triggerEvent('onloadingcomplete');
  };

  isBusy () {
    if (this.suspendDrawing === true || this.mapBusy || this.layersBusy === 1) {
      return true;
    }
    if (this.divBuffer[0].ready === false || this.divBuffer[1].ready === false) return true;
    return false;
  };

  _makeInfoHTML () {
    try {
      // Create the layerinformation table
      let infoHTML = '<table class="myTable">';
      let infoHTMLHasValidContent = false;
      // Make first a header with 'Layer' and the dimensions
      infoHTML += '<tr><th>Layer</th>';
      if (this.mapdimensions) {
        for (let d = 0; d < this.mapdimensions.length; d++) {
          infoHTML += '<th>' + this.mapdimensions[d].name + '</th>';
        }
      }
      infoHTML += '</tr>';
      infoHTML += '<tr><td>Map</tdh>';
      if (this.mapdimensions) {
        for (let d = 0; d < this.mapdimensions.length; d++) {
          infoHTML += '<td>' + this.mapdimensions[d].currentValue + '</td>';
        }
      }
      infoHTML += '</tr>';
      let l = 0;
      for (l = 0; l < this.getNumLayers(); l++) {
        let j = (this.getNumLayers() - 1) - l;
        if (this.layers[j].service && this.layers[j].enabled) {
          let layerDimensionsObject = this.layers[j].dimensions;
          if (layerDimensionsObject) {
            let layerTitle = '';
            layerTitle += this.layers[j].title;
            infoHTML += '<tr><td>' + layerTitle + '</td>';
            for (let mapdim = 0; mapdim < this.mapdimensions.length; mapdim++) {
              let foundDim = false;
              for (let layerdim = 0; layerdim < layerDimensionsObject.length; layerdim++) {
                if (layerDimensionsObject[layerdim].name.toUpperCase() === this.mapdimensions[mapdim].name.toUpperCase()) {
                  infoHTML += '<td>' + layerDimensionsObject[layerdim].currentValue + '</td>';
                  foundDim = true;
                  infoHTMLHasValidContent = true;
                  break;
                }
              }
              if (foundDim === false)infoHTML += '<td>-</td>';
            }
            infoHTML += '</tr>';
          }
        }
      }
      infoHTML += '</table>';
      if (infoHTMLHasValidContent === true) {
        this.divDimInfo.style.display = '';
        this.divDimInfo.innerHTML = infoHTML;
        let cx = 8;
        let cy = 8;
        this.divDimInfo.style.width = (Math.min((this.width - parseInt(this.divDimInfo.style.marginLeft) - 210), 350)) + 'px';
        this.divDimInfo.style.left = cx + 'px';
        this.divDimInfo.style.top = cy + 'px';
      } else {
        this.divDimInfo.style.display = 'none';
      }
    } catch (e) {
      error('Exception' + e);
    }
  };

  getLegendGraphicURLForLayer (layer) {
    if (layer) {
      let legendURL = layer.legendGraphic;
      if (!legendURL) return undefined;
      // For THREDDS WMS we need to add layers=
      legendURL += '&layers=' + URLEncode(layer.name) + '&';
      try {
        if (layer.legendIsDimensionDependant === true) {
          legendURL += this.getDimensionRequestString(layer) + '&';
        }
        if (layer.sldURL) {
          legendURL += '&SLD=' + URLEncode(layer.sldURL);
        }
        legendURL += '&transparent=true&width=90&height=250&';
      } catch (e) {
        return undefined;
      }

      // Handle WMS extensions
      legendURL += layer.wmsextensions.url;

      return legendURL;
    }
    return undefined;
  };

  showScaleBar () {
    this.showScaleBarInMap = true;
    console.log('todo showScaleBar');
  };

  hideScaleBar () {
    this.showScaleBarInMap = false;
    console.log('todo hideScaleBar');
  };

  getMaxNumberOfAnimations () {
    return maxAnimationSteps;
  };

  // Animate between last point and point up to `n` time-units ago of the active layer
  // E.g. Draw the last three hours of a layer
  drawLastTimes (hoursAgo, timeUnit) {
    if (!timeUnit) {
      timeUnit = 'hours';
    }
    if (this.layers.length === 0) return;
    let layer = this.getActiveLayer();
    if (!layer) {
      console.warn('drawLastTimes: No active layers');
      return;
    }
    let timeDimension = layer.getDimension('time');
    if (!timeDimension) {
      console.warn('drawLastTimes: No time dimension');
      return;
    }
    let lastIndex = timeDimension.size() - 1;
    let drawDates = [];
    let lastTime = moment.utc(timeDimension.getValueForIndex(lastIndex));
    let begin = lastTime.subtract(hoursAgo, timeUnit);
    while (lastIndex >= 0) {
      lastTime = timeDimension.getValueForIndex(lastIndex--);
      if (!lastTime || lastTime === WMJSDateTooEarlyString || begin.isAfter(moment.utc(lastTime))) break;
      drawDates.unshift({ name: 'time', value: lastTime });
    }
    this.stopAnimating();
    this.draw(drawDates);
  };
  /* Animate between start and end dates with the smallest available resolution */
  drawAutomatic (start, end) {
    if (this.layers.length === 0) {
      return;
    }
    let currentTime = start.format('YYYY-MM-DDTHH:mm:ss[Z]');
    let drawDates = [];
    let iter = 0;
    // Fetch all dates within the time interval with a dynamic frequency
    while (moment(currentTime) < end && iter < 1000) {
      iter++;
      let smallestTime = null;
      for (let i = this.layers.length - 1; i >= 0; i--) {
        let timeDim = this.layers[i].getDimension('time');
        if (!timeDim) {
          continue;
        }
        let layerTime = timeDim.getNextClosestValue(currentTime);
        if (!layerTime || layerTime === 'date too early') {
          continue;
        }

        if (smallestTime === null || moment(layerTime) < moment(smallestTime)) {
          smallestTime = layerTime;
        }
      }
      if (smallestTime === null) {
        break;
      }
      let smallestTimeObj = { name: 'time', value: smallestTime };
      drawDates.push(smallestTimeObj);
      currentTime = smallestTime;
    }

    // If there are times in the interval, animate them all,
    // Otherwise, fall back to "dumb" animation and draw the last 100 dates from the first layer
    if (drawDates.length > 0) {
      this.draw(drawDates);
    } else {
      let firstTimeDim = this.layers[0].getDimension('time');
      if (!firstTimeDim) {
        return;
      }
      let numTimeSteps = firstTimeDim.size();

      let numStepsBack = Math.min(firstTimeDim.size(), 100);

      let dates = [];
      for (let j = numTimeSteps - numStepsBack; j < numTimeSteps; ++j) {
        dates.push({ name:firstTimeDim.name, value:firstTimeDim.getValueForIndex(j) });
      }
      this.draw(dates);
    }
  };

  display () {
    if (!this.divBuffer[this.currentSwapBuffer]) return;
    this.divBuffer[this.currentSwapBuffer].display(this.updateBBOX, this.loadedBBOX);
    if (enableConsoleDebugging) console.log('drawnBBOX.setBBOX(bbox)');
    this.drawnBBOX.setBBOX(this.bbox);
  };

  _animFrameRedraw () {
    this._draw(this._animationList);
  }
  draw (animationList) {
    // console.log('**************** draw', animationList);
    if (typeof (animationList) === 'object') {
      if (animationList.length > 0) {
        this._animationList = animationList;
      }
    }
    if (this.isAnimating) {
      if (enableConsoleDebugging)console.log('ANIMATING: Skipping draw:' + animationList);
      return;
    }
    if (this.drawPending) {
      this.needsRedraw = true;
      return;
    }
    this.drawPending = true;
    // window.requestAnimationFrame();
    this._animFrameRedraw();
  };
  /**
   * API Function called to draw the layers, fires getmap request and shows the layers on the screen
   */
  _draw (animationList) {
    if (enableConsoleDebugging)console.log('draw:' + animationList);
    if (enableConsoleDebugging)console.log('drawnBBOX.setBBOX(bbox)');
    this.drawnBBOX.setBBOX(this.bbox);
    this._drawAndLoad(animationList);
  };

  _drawReady () {
    this.drawPending = false;
    this.drawBusy = 0;
    if (this.needsRedraw) {
      this.needsRedraw = false;
      this.draw(this._animationList);
    }
  }

  _drawAndLoad (animationList) {
    if (this.width < 4 || this.height < 4) {
      this._drawReady();
      return;
    }

    this.callBack.triggerEvent('beforedraw');

    if (this.isAnimating === false) {
      if (animationList !== undefined) {
        if (typeof (animationList) === 'object') {
          if (animationList.length > 0) {
            if (animationList.length > maxAnimationSteps) {
              error('Too many animations given, max is ' + maxAnimationSteps + ' animating last steps only');
              animationList = animationList.splice(-maxAnimationSteps);
            }
            this.isAnimating = true;
            this.callBack.triggerEvent('onstartanimation', this);
            this.currentAnimationStep = 0;
            this.animationList = [];
            this.mouseHoverAnimationBox = false;
            for (let j = 0; j < animationList.length; j++) {
              let animationListObject = { name:animationList[j].name, value:animationList[j].value };
              this.setDimension(animationList[j].name, animationList[j].value, false);
              animationListObject.requests = this.getWMSRequests();
              this.animationList.push(animationListObject);
            }
            this.setDimension(this.animationList[this.currentAnimationStep].name, this.animationList[this.currentAnimationStep].value, false);
            this.wmjsAnimate.checkAnimation();
          }
        }
      }
    }
    this._pdraw();
  };

  _onLayersReadyCallbackFunction () {
    this.draw('onlayersready callback');
  };

  _onMapReadyCallbackFunction () {
    debug('--> onmapready event called');
    this.draw('onmapready callback');
  };

  _onResumeSuspendCallbackFunction () {
    this.draw('onresumesuspend callback');
  };

  getWMSRequests () {
    let requests = [];
    let n = this.getNumLayers();
    for (let j = 0; j < n; j++) {
      if (this.layers[j].service && this.layers[j].enabled) {
        let request = this.buildWMSGetMapRequest(this.layers[j]);
        if (request) {
          requests.push(request);
        }
      }
    }
    return requests;
  };

  /**
   * Prefetches given requests
   *
   * @param requests An array of requests to prefetch
   * @return The list of images in prefetch
   */
  prefetch (requests) {
    let prefetching = [];
    for (let j = 0; j < requests.length; j++) {
      let image = getMapImageStore.getImage(requests[j]);
      if (image.isLoaded() === false && image.isLoading() === false) {
        prefetching.push(image);
        image.load();
      }
    }
    return prefetching;
  };

  getImageStore () {
    return getMapImageStore;
  };

  /* Returns 0: not loaded, 1 loading, 2 loaded */
  isThisRequestLoaded (request) {
    let image = getMapImageStore.getImageForSrc(request);
    if (image === undefined) return 0;
    if (image.isLoaded()) return 2;
    if (image.isLoading()) return 1;
  };

  _pdraw () {
    if (this.initialized === 0) return;

    if (this.suspendDrawing === true) {
      if (this.callBack.addToCallback('onresumesuspend', this._onResumeSuspendCallbackFunction) === true) {
        debug('Suspending on onresumesuspend');
      }
      this._drawReady();
      return;
    }

    let loadLayers = () => {
      if (enableConsoleDebugging)console.log('loadLayers');
      let request;

      let currentLayerIndex = 0;
      this.numBaseLayers = 0;
      if (this.baseLayers) {
        for (let l = 0; l < this.baseLayers.length; l++) {
          if (this.baseLayers[l].enabled) {
            if (this.baseLayers[l].keepOnTop === false) {
              if (this.baseLayers[l].type && this.baseLayers[l].type === 'twms') continue;
              this.numBaseLayers++;
              request = this.buildWMSGetMapRequest(this.baseLayers[l]);

              if (request) {
                this.divBuffer[this.newSwapBuffer].setSrc(currentLayerIndex, request, this.getWidth(), this.getHeight(), { layer: this.baseLayers[l] }, this.baseLayers[l].opacity);
                currentLayerIndex++;
              }
            }
          }
        }
      }
      /* Loop through all layers */
      for (let j = 0; j < this.getNumLayers(); j++) {
        if (this.layers[j].service && this.layers[j].enabled) {
          /* Get the dimension object for this layer */
          let layerDimensionsObject = this.layers[j].dimensions;// getLayerDimensions(layers[j]);
          request = this.buildWMSGetMapRequest(this.layers[j], layerDimensionsObject);
          if (request) {
            this.divBuffer[this.newSwapBuffer].setSrc(currentLayerIndex, request, this.getWidth(), this.getHeight(), { layer: this.layers[j] }, this.layers[j].opacity);
            this.layers[j].image = this.divBuffer[this.newSwapBuffer].layers[currentLayerIndex];
            currentLayerIndex++;
          }
        }
      }

      if (this.baseLayers) {
        for (let l = 0; l < this.baseLayers.length; l++) {
          if (this.baseLayers[l].enabled) {
            if (this.baseLayers[l].keepOnTop === true) {
              request = this.buildWMSGetMapRequest(this.baseLayers[l]);
              if (request) {
                this.divBuffer[this.newSwapBuffer].setSrc(currentLayerIndex, request, this.getWidth(), this.getHeight(), { layer:this.baseLayers[l] }, this.baseLayers[l].opacity);
                currentLayerIndex++;
              }
            }
          }
        }
      }

      this.flipBuffers();
      /* Make info HTML */
      // makeInfoHTML();
    };

    /* if layers are not ready yet, wait for them */
    if (this.layersBusy === 1) {
      if (this.callBack.addToCallback('onlayersready', this._onLayersReadyCallbackFunction) === true) {
        debug('Suspending on onlayersready');
      }
      return;
    }
    if (this.mapBusy) {
      if (this.callBack.addToCallback('onmapready', this._onMapReadyCallbackFunction) === true) {
        debug('Suspending on onmapready');
      }
      return;
    }

    loadLayers();
    this.callBack.triggerEvent('ondrawready', this.map);
    this.loadLegendInline();
  };

  _updateBoundingBox (_mapbbox) {
    if (this.divBuffer.length === 0) return;
    let mapbbox = this.bbox; if (isDefined(_mapbbox))mapbbox = _mapbbox;
    this.updateBBOX.copy(mapbbox);
    this.divBuffer[this.currentSwapBuffer].setBBOX(this.updateBBOX, this.loadedBBOX);
    this.divBuffer[this.currentSwapBuffer].mapbbox = this.updateBBOX;
    this.showBoundingBox(this.divBoundingBox.bbox, this.updateBBOX);
    this.callBack.triggerEvent('onupdatebbox', this.updateBBOX);
    this.repositionMapPin(_mapbbox);
  };

  flipBuffers () {
    if (enableConsoleDebugging)console.log('flipBuffers');
    let prev = this.currentSwapBuffer;
    let current = this.newSwapBuffer;
    this.callBack.triggerEvent('onmapstartloading');
    this.mapBusy = true;
    this.loadingDivTimer.init(500, () => { this.loadingDiv.show(); });
    this.loadingBBOX.setBBOX(this.bbox);

    if (!this.divBuffer[current]) return;
    this.divBuffer[current].load(
      () => {
        if (enableConsoleDebugging)console.log('flipBuffers loadcomplete');
        try {
          this.divBuffer[prev].srs = this.srs;
          this.divBuffer[current].bbox = this.bbox.clone();
          this.divBuffer[current].srs = this.srs;
          if (enableConsoleDebugging)console.log('loadedBBOX.setBBOX(bbox)');
          this.loadedBBOX.setBBOX(this.loadingBBOX);
          if (enableConsoleDebugging)console.log('-----------------------');

          this.divBuffer[current].display(this.updateBBOX, this.loadedBBOX);

          this.divMapPin.oldx = this.divMapPin.exactX;
          this.divMapPin.oldy = this.divMapPin.exactY;
          this.divBuffer[prev].hide();
          this.currentSwapBuffer = current;
          this.newSwapBuffer = prev;
        } catch (e) {
          console.log(e);
        }
        this.mapBusy = false;

        this.callBack.triggerEvent('onmaploadingcomplete', this);
        this.callBack.triggerEvent('onloadingcomplete', this);
        this.callBack.triggerEvent('onmapready', this);
        this.loadingDiv.hide();
        this.loadingDivTimer.stop();
        this._drawReady();
      }
    );
  };

  getBackBufferCanvasContext () {
    return this.divBuffer[this.newSwapBuffer].getCanvasContext();
  };

  getFrontBufferCanvasContext () {
    return this.divBuffer[this.currentSwapBuffer].getCanvasContext();
  };

  redrawBuffer () {
    this.divBuffer[this.currentSwapBuffer].display();
    if (enableConsoleDebugging)console.log('drawnBBOX.setBBOX(bbox)');
    this.drawnBBOX.setBBOX(this.bbox);
    this.draw();
  };

  addBaseLayers (layer) {
    if (layer) {
      this.numBaseLayers = 0;
      layer = toArray(layer);
      this.baseLayers.push(layer);
      for (let j = 0; j < this.baseLayers.length; j++) {
        if (this.baseLayers.keepOnTop === true) {
          this.numBaseLayers++;
        }
      }
      this.callBack.triggerEvent('onlayeradd');
    } else this.baseLayers = undefined;
  };

  setBaseLayers (layer) {
    // TODO use calculate baselayer instead...
    if (layer) {
      this.numBaseLayers = 0;
      // layer=toArray(layer);
      this.baseLayers = layer;
      for (let j = 0; j < this.baseLayers.length; j++) {
        if (this.baseLayers.keepOnTop === true) {
          this.numBaseLayers++;
        }
      }
      this.callBack.triggerEvent('onlayerchange');
    } else this.baseLayers = undefined;
  };

  getBaseLayers () {
    return this.baseLayers;
  };

  getNumLayers () {
    return this.layers.length;
  };

  getBaseElement () {
    return this.baseDiv;
  };

  flyZoomToBBOXTimerFunc () {
    this.flyZoomToBBOXScaler = (this.flyZoomToBBOXTimerLoop / this.flyZoomToBBOXTimerSteps);
    let z1 = 1 - this.flyZoomToBBOXScaler;
    this.flyZoomToBBOXFly.left = this.flyZoomToBBOXCurrent.left * z1 + this.flyZoomToBBOXNew.left * this.flyZoomToBBOXScaler;
    this.flyZoomToBBOXFly.bottom = this.flyZoomToBBOXCurrent.bottom * z1 + this.flyZoomToBBOXNew.bottom * this.flyZoomToBBOXScaler;
    this.flyZoomToBBOXFly.right = this.flyZoomToBBOXCurrent.right * z1 + this.flyZoomToBBOXNew.right * this.flyZoomToBBOXScaler;
    this.flyZoomToBBOXFly.top = this.flyZoomToBBOXCurrent.top * z1 + this.flyZoomToBBOXNew.top * this.flyZoomToBBOXScaler;
    this._updateBoundingBox(this.flyZoomToBBOXFly);

    this.flyZoomToBBOXTimerLoop += 1;

    if (this.flyZoomToBBOXTimerLoop > this.flyZoomToBBOXTimerSteps) {
      this.flyZoomToBBOXTimerLoop = this.flyZoomToBBOXTimerStart;
      this.setBBOX(this.flyZoomToBBOXFly);
      this.display();
      if (this.flyZoomToBBOXTimerFuncBusyAndContinue === 0) {
        this.flyZoomToBBOXTimerFuncBusyAndContinue = 0;
        this.flyZoomToBBOXTimerFuncBusy = 0;
        this.draw('flyZoomToBBOXTimerFunc');
      } else {
        this.flyZoomToBBOXTimerFuncBusyAndContinue = 0;
        this.flyZoomToBBOXTimerFuncBusy = 0;
        this.flyZoomToBBOXStartZoom(this.updateBBOX, this.flyZoomToBBOXContinueNew);
      }
      return;
    }
    // window.requestAnimationFrame(() => { this.flyZoomToBBOXTimerFunc(); });
    this.flyZoomToBBOXTimer.init(10, this.flyZoomToBBOXTimerFunc);
  }

  flyZoomToBBOXStop (currentbox, newbox) {
    if (this.flyZoomToBBOXTimerFuncBusy) {
      this.setBBOX(this.flyZoomToBBOXFly);
    }
    this.flyZoomToBBOXTimerFuncBusyAndContinue = 0;
    this.flyZoomToBBOXTimerFuncBusy = 0;
    this.flyZoomToBBOXTimer.stop();
  }

  flyZoomToBBOXStartZoom (currentbox, newbox) {
    if (this.flyZoomToBBOXTimerFuncBusy === 1) {
      this.flyZoomToBBOXContinueNew.copy(newbox);
      this.flyZoomToBBOXTimerFuncBusyAndContinue = 1;
      return;
    }
    this.flyZoomToBBOXCurrent.copy(currentbox);
    this.flyZoomToBBOXNew.copy(newbox);
    this.flyZoomToBBOXTimerLoop = this.flyZoomToBBOXTimerStart;
    this.flyZoomToBBOXTimerFuncBusyAndContinue = 0;
    if (this.flyZoomToBBOXTimerFuncBusy === 0) {
      this.flyZoomToBBOXTimerFuncBusy = 1;
      this.flyZoomToBBOXTimerFunc();
    }
  };

  mouseWheelEvent (event) {
    preventdefaultEvent(event);
    if (this.mouseWheelBusy === 1) return;
    let delta = -event.deltaY;
    this.mouseWheelBusy = 1;
    let w = (this.updateBBOX.right - this.updateBBOX.left);
    let h = (this.updateBBOX.bottom - this.updateBBOX.top);
    let geoMouseXY = this.getGeoCoordFromPixelCoord({ x:this.mouseX, y:this.mouseY }, this.drawnBBOX);
    let nx = (geoMouseXY.x - this.updateBBOX.left) / w;// Normalized to 0-1
    let ny = (geoMouseXY.y - this.updateBBOX.top) / h;

    let zoomW;
    let zoomH;
    if (delta < 0) {
      zoomW = w * -0.25;
      zoomH = h * -0.25;
    } else {
      zoomW = w * 0.20;
      zoomH = h * 0.20;
    }
    let newLeft = this.updateBBOX.left + zoomW;
    let newTop = this.updateBBOX.top + zoomH;
    let newRight = this.updateBBOX.right - zoomW;
    let newBottom = this.updateBBOX.bottom - zoomH;

    let newW = newRight - newLeft;
    let newH = newBottom - newTop;

    let newX = nx * newW + newLeft;
    let newY = ny * newH + newTop;

    let panX = (newX - geoMouseXY.x);

    let panY = (newY - geoMouseXY.y);
    newLeft -= panX;
    newRight -= panX;
    newTop -= panY;
    newBottom -= panY;
    this.mouseWheelEventBBOXCurrent.copy(this.updateBBOX);
    this.mouseWheelEventBBOXNew.left = newLeft;
    this.mouseWheelEventBBOXNew.bottom = newBottom;
    this.mouseWheelEventBBOXNew.right = newRight;
    this.mouseWheelEventBBOXNew.top = newTop;
    this.mouseWheelBusy = 0;
    this.flyZoomToBBOXStartZoom(this.mouseWheelEventBBOXCurrent, this.mouseWheelEventBBOXNew);
  };

  pinchStart (x, y, e) {
    this.pinchStart1 = { x:e.pointers[0].clientX, y:e.pointers[0].clientY };
    this.pinchStart2 = { x:e.pointers[1].clientX, y:e.pointers[1].clientY };
    this.pinchBox = this.bbox.clone();
    this.controlsBusy = true;
    this.mouseDownPressed = 0;
    this.mouseDragging = 1;
    this.mouseWheelBusy = 1;
  };

  pinchMove (x, y, e) {
    this.mouseDownPressed = 0;
    this.pinchMove1 = { x:e.pointers[0].clientX, y:e.pointers[0].clientY };
    this.pinchMove2 = { x:e.pointers[1].clientX, y:e.pointers[1].clientY };
    let dX1 = (this.pinchMove2.x - this.pinchMove1.x);
    let dX2 = (this.pinchStart2.x - this.pinchStart1.x);
    let dY1 = (this.pinchMove2.y - this.pinchMove1.y);
    let dY2 = (this.pinchStart2.y - this.pinchStart1.y);

    if (dX2 === 0)dX2 = 1;
    if (dY2 === 0)dY2 = 1;

    if (dX1 * dX1 > dY1 * dY1) {
      let sx = dX1 / dX2;
      let newxr = ((this.width - this.pinchMove1.x) / sx) + this.pinchStart1.x;
      let newxl = this.pinchStart1.x - (this.pinchMove1.x / sx);
      this.bbox.right = (newxr / this.width) * (this.pinchBox.right - this.pinchBox.left) + this.pinchBox.left;
      this.bbox.left = (newxl / this.width) * (this.pinchBox.right - this.pinchBox.left) + this.pinchBox.left;
      let aspect = (this.pinchBox.right - this.pinchBox.left) / (this.pinchBox.top - this.pinchBox.bottom);
      let centerH = (this.bbox.top + this.bbox.bottom) / 2;
      let extentH = ((this.bbox.left - this.bbox.right) / 2) / aspect;
      this.bbox.bottom = centerH + extentH;
      this.bbox.top = centerH - extentH;
    } else {
      let sy = dY1 / dY2;
      let newyb = ((this.height - this.pinchMove1.y) / sy) + this.pinchStart1.y;
      let newyt = this.pinchStart1.y - (this.pinchMove1.y / sy);
      this.bbox.bottom = (newyb / this.height) * (this.pinchBox.bottom - this.pinchBox.top) + this.pinchBox.top;
      this.bbox.top = (newyt / this.height) * (this.this.pinchBox.bottom - this.pinchBox.top) + this.pinchBox.top;
      let aspect = (this.pinchBox.right - this.pinchBox.left) / (this.pinchBox.top - this.pinchBox.bottom);
      let centerW = (this.bbox.right + this.bbox.left) / 2;
      let extentW = ((this.bbox.bottom - this.bbox.top) / 2) * aspect;
      this.bbox.left = centerW + extentW;
      this.bbox.right = centerW - extentW;
    }
    this._updateBoundingBox(this.bbox);
  };

  pinchEnd (x, y, e) {
    this.controlsBusy = false;
    this.mouseDownPressed = 0;
    this.mouseDragging = 0;
    this.mouseWheelBusy = 0;
    this.zoomTo(this.bbox);
    this.draw('pinchEnd');
  };

  destroy () {
    this.stopAnimating();
    for (let i = this.layers.length - 1; i >= 0; i--) {
      this.layers[i].setAutoUpdate(false);
    }
    this.detachEvents();

    this.callBack.destroy();
  };

  detachEvents () {
    this.baseDiv.off('mousedown');
    // this.baseDiv.off('mousewheel');
    removeMouseWheelEvent(jquery(this.baseDiv).get(0), this.mouseWheelEvent);
    deleteEvent(document, 'mouseup', this.mouseUpEvent);
    deleteEvent(document, 'mousemove', this.mouseMoveEvent);
  };

  attachEvents () {
    this.baseDiv.on('mousedown', this.mouseDownEvent);
    // this.baseDiv.on('mousewheel', this.mouseWheelEvent);
    addMouseWheelEvent(jquery(this.baseDiv).get(0), this.mouseWheelEvent);
    attachEvent(document, 'mouseup', this.mouseUpEvent);
    attachEvent(document, 'mousemove', this.mouseMoveEvent);
    if (this.isTouchDevice()) {
      this.enableInlineGetFeatureInfo(false);
      // let mc = new Hammer.Manager(document.body);
      // mc.add(new Hammer.Pan());
      // mc.add(new Hammer.Pinch());
      // mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
      // mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
      mc.on('panstart', (ev) => { ev.preventDefault(); this.mouseDown(ev.center.x, ev.center.y, ev); });
      mc.on('panmove', (ev) => { ev.preventDefault(); this.mouseMove(ev.center.x, ev.center.y, ev); });
      mc.on('panend', (ev) => { ev.preventDefault(); this.mouseUp(ev.center.x, ev.center.y, ev); });
      mc.on('pinchstart', (ev) => { ev.preventDefault(); this.pinchStart(ev.center.x, ev.center.y, ev); });
      mc.on('pinchmove', (ev) => { ev.preventDefault(); this.pinchMove(ev.center.x, ev.center.y, ev); });
      mc.on('pinchend', (ev) => { ev.preventDefault(); this.pinchEnd(ev.center.x, ev.center.y, ev); });
    }

    this.setMapModePan();
  };

  /* Adds DIM_ for certain dims */
  _getCorrectWMSDimName (origDimName) {
    /* Adds DIM_ for dimensions other than height or time */
    if (origDimName.toUpperCase() === 'TIME') return origDimName;
    if (origDimName.toUpperCase() === 'ELEVATION') return origDimName;
    return 'DIM_' + origDimName;
  };

  /* Returns all dimensions with its current values as URL */
  _getMapDimURL (layer) {
    let request = '';
    for (let j = 0; j < layer.dimensions.length; j++) {
      let currentValue = layer.dimensions[j].getValue();
      request += '&' + this._getCorrectWMSDimName(layer.dimensions[j].name);
      request += '=' + URLEncode(currentValue);
      if (currentValue === WMJSDateOutSideRange ||
        currentValue === WMJSDateTooEarlyString ||
        currentValue === WMJSDateTooLateString) {
        throw (WMJSDateOutSideRange);
      }
    }
    return request;
  };

  /* Returns all dimensions with its current values as object */
  _buildLayerDims () {
    if (this.buildLayerDimsBusy === true) {
      return;
    }
    for (let k = 0; k < this.mapdimensions.length; k++) {
      let mapDim = this.mapdimensions[k];
      for (let j = 0; j < this.layers.length; j++) {
        for (let i = 0; i < this.layers[j].dimensions.length; i++) {
          let layerDim = this.layers[j].dimensions[i];
          if (layerDim.linked === true) {
            if (layerDim.name === mapDim.name) {
              if (mapDim.currentValue === 'current' ||
                mapDim.currentValue === 'default' ||
                mapDim.currentValue === '' ||
                mapDim.currentValue === 'earliest' ||
                mapDim.currentValue === 'middle' ||
                mapDim.currentValue === 'latest'
              ) {
                mapDim.currentValue = layerDim.getClosestValue(mapDim.currentValue);
              }
              this.buildLayerDimsBusy = true;
              layerDim.setClosestValue(mapDim.currentValue);
              this.buildLayerDimsBusy = false;
            }
          }
        }
      }
    }
  };

  getMapMode () {
    return this.mapMode;
  };

  /* GetMetaData handling */
  getWMSMetaDataRequestURL (layer) {
    let request = layer.service;
    request += '&SERVICE=WMS&REQUEST=GetMetaData&VERSION=' + layer.version;
    request += '&LAYER=' + URLEncode(layer.name);
    request += '&FORMAT=text/html';
    try {
      request += '&' + this._getMapDimURL(layer);
    } catch (e) {
      return undefined;
    }
    debug('<a target="_blank" href="' + request + '">' + request + '</a>', false);
    return request;
  };

  getPointInfoRequestURL (layer, x, y, service, style) {
    let request = service;
    request += '&GRAPHSTYLE=' + style;
    request += '&' + this.getBBOXandProjString(layer);
    request += '&LAYERS=' + URLEncode(layer.name);
    request += 'WIDTH=' + this.width;
    request += '&HEIGHT=' + this.height;
    request += '&X=' + x;
    request += '&Y=' + y;
    request += '&FORMAT=image/png';
    request += '&INFO_FORMAT=text/html';
    request += '&STYLES=';
    try {
      request += '&' + this._getMapDimURL(layer);
    } catch (e) {
      return undefined;
    }
    debug('<a target="_blank" href="' + request + '">' + request + '</a>', false);
    return request;
  };

  // Makes a valid getfeatureinfoURL for each layer
  getWMSGetFeatureInfoRequestURL (layer, x, y, format = 'text/html') {
    let request = WMJScheckURL(layer.service);
    request += '&SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=' + layer.version;

    request += '&LAYERS=' + URLEncode(layer.name);

    let baseLayers = layer.name.split(',');
    request += '&QUERY_LAYERS=' + URLEncode(baseLayers[baseLayers.length - 1]);
    request += '&' + this.getBBOXandProjString(layer);
    request += 'WIDTH=' + this.width;
    request += '&HEIGHT=' + this.height;
    if (layer.version === WMSVersion.version100 || layer.version === WMSVersion.version111) {
      request += '&X=' + x;
      request += '&Y=' + y;
    }
    if (layer.version === WMSVersion.version130) {
      request += '&I=' + x;
      request += '&J=' + y;
    }
    request += '&FORMAT=image/gif';
    request += '&INFO_FORMAT=' + format;
    request += '&STYLES=';
    try {
      request += '&' + this._getMapDimURL(layer);
    } catch (e) {
      return undefined;
    }
    debug('<a target="_blank" href="' + request + '">' + request + '</a>', false);
    return request;
  };

  /* Called when a HTTP request is finished */
  featureInfoRequestReady (data, layer) {
    this.numGetFeatureInfoRequests--;
    let result;
    if (layer) {
      if (layer.queryable === true) {
        result = new GetFeatureInfoObject(layer, data);
      } else {
        result = new GetFeatureInfoObject(layer, 'not queryable');
      }
    } else result = new GetFeatureInfoObject(layer, 'Query failed...');
    this.getFeatureInfoResult.push(result);
    if (this.numGetFeatureInfoRequests <= 0) {
      this.numGetFeatureInfoRequests = 0;
      this.callBack.triggerEvent('ongetfeatureinfoready', this.getFeatureInfoResult);
    }
  };

  newGetPointInfo () {
    debug('resuming on ongetpointinfoready');
    this.getPointInfo(this.mouseDownX, this.mouseDownY);
  };

  getPointInfo (x, y) {
    if (this.getPointInfoBusy) {
      debug('suspending on ongetpointinfoready');
      this.addListener('ongetpointinfoready', this.newGetPointInfo, false);
      return;
    }
    this.getPointInfoBusy = true;
    this.callBack.triggerEvent('beforegetpointinfo', { x: x, y: y });

    let gr = this.getGraphingData();

    if (gr === undefined) {
      error('getPointInfo getGraphingData is undefined');
      this.getPointInfoBusy = false;
      return;
    }
    debug('getPointInfo(' + x + ',' + y + ')' + ' ' + gr.layer.name);
    let url = this.getPointInfoRequestURL(gr.layer, x, y, gr.service, gr.style);
    debug('GetPointInfo: ' + url);

    let graphingImage = new Image();
    graphingImage.loadEvent = () => {
      this.getPointInfoBusy = false;
      let getPointInfoResult = {};
      getPointInfoResult.url = url;
      getPointInfoResult.layer = gr.layer;
      getPointInfoResult.img = graphingImage;

      this.callBack.triggerEvent('ongetpointinfoready', getPointInfoResult);
    };
    graphingImage.src = url;
  };

  newGetFeatureInfo () {
    debug('resuming on ongetfeatureinfoready');
    this.callBack.triggerEvent('beforegetfeatureinfo');
    this.getFeatureInfo(this.mouseDownX, this.mouseDownY);
  };

  getFeatureInfo (x, y) {
    if (this.numGetFeatureInfoRequests > 0) {
      debug('suspending on ongetfeatureinfoready');
      this.addListener('ongetfeatureinfoready', this.newGetFeatureInfo, false);
      return;
    }
    debug('GetFeatureInfo:');
    this.getFeatureInfoResult = [];
    this.numGetFeatureInfoRequests = 0;
    for (let j = 0; j < this.layers.length; j++) {
      let layer = this.layers[this.layers.length - j - 1];
      layer.getFeatureInfoUrl = '';
      if (layer.service && layer.enabled && layer.queryable === true) {
        layer.getFeatureInfoUrl = this.getWMSGetFeatureInfoRequestURL(layer, x, y);
        if (!isDefined(layer.getFeatureInfoUrl)) {
          layer.getFeatureInfoUrl = '';
        } else {
          this.numGetFeatureInfoRequests++;
        }
      }
    }
    if (this.numGetFeatureInfoRequests === 0) {
      this.callBack.triggerEvent('ongetfeatureinfoready', ['No layers to query']);
    }
    for (let j = 0; j < this.layers.length; j++) {
      let myLayer = this.layers[this.layers.length - j - 1];

      if (myLayer.getFeatureInfoUrl !== '') {
        if (myLayer.queryable === false) {
          this.featureInfoRequestReady('Layer is not queryable.', myLayer);
        } else {
          try {
            MakeHTTPRequest(myLayer.getFeatureInfoUrl, this.featureInfoRequestReady, (data, myLayer) => {
              this.featureInfoRequestReady(data, myLayer); error(data);
            }, myLayer, false, this.requestProxy);
          } catch (e) {
            console.log(e);
            this.featureInfoRequestReady('Exception: ' + e, myLayer);
          }
        }
      }
    }
  };

  getGetFeatureInfoObjectAsHTML (data) {
    let html = '';
    try {
      html += '<div class="getfeatureinfo">';
      for (let j = 0; j < this.layers.length; j++) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].layer === this.layers[j]) {
            html += '<div class="getfeatureinfolayer">';
            html += "<b><a target='_blank' href='" + data[i].layer.getFeatureInfoUrl + "'>" + data[i].layer.title + '</a></b><br/>';
            html += data[i].data;
            html += '</div>';
          }
        }
      }
      html += '</div>';
    } catch (e) { html = 'No layers to query.'; }
    return html;
  };

  /* End of GetFeature info handling */

  getMapPinXY () {
    return [this.divMapPin.exactX, this.divMapPin.exactY];
  };

  positionMapPinByLatLon (coord) {
    debug('positionMapPinByLatLon at ' + coord.x + ',' + coord.y);
    let newpos = this.getPixelCoordFromLatLong(coord);
    this.setMapPin(newpos.x, newpos.y);
    this.showMapPin();
  };

  repositionMapPin (_bbox) {
    let b = this.bbox;
    if (isDefined(_bbox)) b = _bbox;
    let newpos = this.getPixelCoordFromGeoCoord({ x:this.divMapPin.geoPosX, y:this.divMapPin.geoPosY }, b);
    this.setMapPin(newpos.x, newpos.y, b);
  };

  setMapPin (_x, _y, _bbox) {
    let x = _x;
    let y = _y;
    if (typeof (_x) === 'object') {
      x = _x.x;
      y = _x.y;
    }
    if (!x || !y) return;
    this.divMapPin.x = parseInt(x);
    this.divMapPin.y = parseInt(y);
    this.divMapPin.exactX = parseFloat(x);
    this.divMapPin.exactY = parseFloat(y);
    let geopos = this.getGeoCoordFromPixelCoord({ x:this.divMapPin.exactX, y:this.divMapPin.exactY }, _bbox);
    this.divMapPin.geoPosX = geopos.x;
    this.divMapPin.geoPosY = geopos.y;
  };

  isMapPinVisible () {
    return this.divMapPin.displayMapPin;
  };

  showMapPin () {
    this.divMapPin.displayMapPin = true;
    this.draw();
  };

  hideMapPin () {
    this.divMapPin.displayMapPin = false;
    this.draw();
  };

  setMapModeGetInfo () {
    this.mapMode = 'info';
    this.baseDiv.css('cursor', 'default');
  };

  setMapModeZoomBoxIn (e) {
    this.mapMode = 'zoom';
    this.baseDiv.css('cursor', 'default');
  };

  setMapModeZoomOut (e) {
    this.mapMode = 'zoomout';
    this.baseDiv.css('cursor', 'default');
  };

  setMapModePan (e) {
    this.mapMode = 'pan';
    this.baseDiv.css('cursor', 'default');
  };

  setMapModePoint (e, graphWin) {
    this.mapMode = 'point';
    this.baseDiv.css('cursor', 'url(webmapjs/img/aero_pen.cur), default');
  };

  setMapModeNone (e) {
    this.mapMode = 'none';
    this.baseDiv.css('cursor', 'default');
  };

  getMouseCoordinatesForDocument (e) {
    if (isDefined(e.changedTouches)) {
      return { x:parseInt(e.changedTouches[0].screenX), y:parseInt(e.changedTouches[0].screenY) };
    }
    let parentOffset = jquery(this.mainElement).parent().offset();
    let pageX = e.pageX;
    let pageY = e.pageY;
    if (pageX === undefined) { pageX = getMouseXCoordinate(e); }
    if (pageY === undefined) { pageY = getMouseYCoordinate(e); }
    let relX = pageX - parentOffset.left;
    let relY = pageY - parentOffset.top;
    return { x:relX, y:relY };
  };

  getMouseCoordinatesForElement (e) {
    if (isDefined(e.changedTouches)) {
      return { x:parseInt(e.changedTouches[0].screenX), y:parseInt(e.changedTouches[0].screenY) };
    }
    let parentOffset = jquery(this.mainElement).parent().offset();
    let pageX = e.pageX;
    let pageY = e.pageY;
    if (pageX === undefined) { pageX = getMouseXCoordinate(e); }
    if (pageY === undefined) { pageY = getMouseYCoordinate(e); }
    let relX = pageX - parentOffset.left;
    let relY = pageY - parentOffset.top;
    return { x:relX, y:relY };
  };

  mouseDown (mouseCoordX, mouseCoordY, event) {
    let shiftKey = false;
    if (event) {
      if (event.shiftKey === true) {
        shiftKey = true;
      }
    }

    let detectLeftButton = (evt) => {
      evt = evt || window.event;
      if ('buttons' in evt) {
        return evt.buttons === 1;
      }
      let button = evt.which || evt.button;
      return button === 1;
    };

    this.mouseDownX = mouseCoordX;
    this.mouseDownY = mouseCoordY;
    this.mouseDownPressed = 1;
    if (this.mouseDragging === 0) {
      if (this._checkInvalidMouseAction(this.mouseDownX, this.mouseDownY) === 0) {
        let triggerResults = this.callBack.triggerEvent(
          'beforemousedown',
          { mouseX:mouseCoordX,
            mouseY:mouseCoordY,
            mouseDown:true,
            event:event,
            leftButton: detectLeftButton(event),
            shiftKey: shiftKey
          }
        );
        for (let j = 0; j < triggerResults.length; j++) {
          if (triggerResults[j] === false) {
            return;
          }
        }
      }
    }
    this.controlsBusy = true;
    if (!shiftKey) {
      if (this.oldMapMode !== undefined) {
        this.mapMode = this.oldMapMode;
        this.oldMapMode = undefined;
      }
    } else {
      if (this.oldMapMode === undefined) this.oldMapMode = this.mapMode;
      this.mapMode = 'zoom';
    }
    this.callBack.triggerEvent('mousedown', { map:this, x:this.mouseDownX, y:this.mouseDownY });

    if (this.mapMode === 'info') {
      debug('GetFeatureInfo');
      this.setMapPin(this.mouseDownX, this.mouseDownY);
      this.showMapPin();

      this.callBack.triggerEvent('beforegetfeatureinfo', { map:this, x:this.mouseDownX, y:this.mouseDownY });
      this.getFeatureInfo(this.mouseDownX, this.mouseDownY);
    } else if (this.mapMode === 'point') {
      this.setMapPin(this.mouseDownX, this.mouseDownY);
      this.showMapPin();
      this.getPointInfo(this.mouseDownX, this.mouseDownY);
    }
  };

  _checkInvalidMouseAction (MX, MY) {
    if (MY < 0 | MX < 0 | MX > this.width | MY > this.height) { this.InValidMouseAction = 1; return -1; }
    return 0;
  };

  updateMouseCursorCoordinates (coordinates) {
    this.mouseUpdateCoordinates = coordinates;
    this.mouseGeoCoordXY = this.getGeoCoordFromPixelCoord(coordinates);
    this.display('updateMouseCursorCoordinates');
  };

  mouseDownEvent (e) {
    preventdefaultEvent(e);
    let mouseCoords = this.getMouseCoordinatesForDocument(e);
    if (this.mapHeader.cursorSet && mouseCoords.y < this.mapHeader.height) {
      return;
    }
    this.mouseDown(mouseCoords.x, mouseCoords.y, e);
  };

  mouseMoveEvent (e) {
    preventdefaultEvent(e);
    let mouseCoords = this.getMouseCoordinatesForDocument(e);
    if (this.mouseDownPressed === 0 && mouseCoords.y >= 0 && mouseCoords.y < this.mapHeader.height && mouseCoords.x >= 0 && mouseCoords.x <= this.width) {
      if (this.mapHeader.cursorSet === false) {
        this.mapHeader.cursorSet = true;
        this.mapHeader.prevCursor = this.currentCursor;
        this.mapHeader.hovering = true;
        this.setCursor('pointer');
        this.draw('mouseMoveEvent');
      }
    } else {
      if (this.mapHeader.cursorSet === true) {
        this.mapHeader.cursorSet = false;
        this.mapHeader.hovering = false;
        this.setCursor(this.mapHeader.prevCursor);
        this.draw('mouseMoveEvent');
      }
    }
    this.mouseMove(mouseCoords.x, mouseCoords.y, e);
  };

  mouseUpEvent (e) {
    preventdefaultEvent(e);
    let mouseCoords = this.getMouseCoordinatesForDocument(e);
    this.mouseUp(mouseCoords.x, mouseCoords.y, e);
  };

  mouseMove (mouseCoordX, mouseCoordY) {
    this.mouseX = mouseCoordX;
    this.mouseY = mouseCoordY;
    if (this.mouseDragging === 0) {
      let triggerResults = this.callBack.triggerEvent(
        'beforemousemove', {
          mouseX:this.mouseX,
          mouseY:this.mouseY,
          mouseDown:this.mouseDownPressed === 1
        }
      );
      for (let j = 0; j < triggerResults.length; j++) {
        if (triggerResults[j] === false) {
          return;
        }
      }
    }
    if (this.divBoundingBox.displayed === true && this.mapPanning === 0) {
      let tlpx = this.getPixelCoordFromGeoCoord({ x:this.divBoundingBox.bbox.left, y:this.divBoundingBox.bbox.top });
      let brpx = this.getPixelCoordFromGeoCoord({ x:this.divBoundingBox.bbox.right, y:this.divBoundingBox.bbox.bottom });

      let foundBBOXRib = false;

      if (this.mouseDownPressed === 0) {
        if (this.resizingBBOXEnabled === false) this.resizingBBOXCursor = this.baseDiv.css('cursor');
        // Find left rib
        if (Math.abs(this.mouseX - tlpx.x) < 6 && this.mouseY > tlpx.y && this.mouseY < brpx.y) {
          foundBBOXRib = true; this.baseDiv.css('cursor', 'col-resize'); this.resizingBBOXEnabled = 'left';
        }
        // Find top rib
        if (Math.abs(this.mouseY - tlpx.y) < 6 && this.mouseX > tlpx.x && this.mouseX < brpx.x) {
          foundBBOXRib = true; this.baseDiv.css('cursor', 'row-resize'); this.resizingBBOXEnabled = 'top';
        }
        // Find right rib
        if (Math.abs(this.mouseX - brpx.x) < 6 && this.mouseY > tlpx.y && this.mouseY < brpx.y) {
          foundBBOXRib = true; this.baseDiv.css('cursor', 'col-resize'); this.resizingBBOXEnabled = 'right';
        }
        // Find bottom rib
        if (Math.abs(this.mouseY - brpx.y) < 6 && this.mouseX > tlpx.x && this.mouseX < brpx.x) {
          foundBBOXRib = true; this.baseDiv.css('cursor', 'row-resize'); this.resizingBBOXEnabled = 'bottom';
        }
        // Find topleft corner
        if (Math.abs(this.mouseX - tlpx.x) < 6 && Math.abs(this.mouseY - tlpx.y) < 6) {
          foundBBOXRib = true; this.baseDiv.css('cursor', 'nw-resize'); this.resizingBBOXEnabled = 'topleft';
        }
        // Find topright corner
        if (Math.abs(this.mouseX - brpx.x) < 6 && Math.abs(this.mouseY - tlpx.y) < 6) {
          foundBBOXRib = true; this.baseDiv.css('cursor', 'ne-resize'); this.resizingBBOXEnabled = 'topright';
        }
        // Find bottomleft corner
        if (Math.abs(this.mouseX - tlpx.x) < 6 && Math.abs(this.mouseY - brpx.y) < 6) {
          foundBBOXRib = true; this.baseDiv.css('cursor', 'sw-resize'); this.resizingBBOXEnabled = 'bottomleft';
        }
        // Find bottomright corner
        if (Math.abs(this.mouseX - brpx.x) < 6 && Math.abs(this.mouseY - brpx.y) < 6) {
          foundBBOXRib = true; this.baseDiv.css('cursor', 'se-resize'); this.resizingBBOXEnabled = 'bottomright';
        }
      }

      if (foundBBOXRib === true || (this.resizingBBOXEnabled !== false && this.mouseDownPressed === 1)) {
        if (this.mouseDownPressed === 1) {
          if (this.resizingBBOXEnabled === 'left')tlpx.x = this.mouseX;
          if (this.resizingBBOXEnabled === 'top')tlpx.y = this.mouseY;
          if (this.resizingBBOXEnabled === 'right')brpx.x = this.mouseX;
          if (this.resizingBBOXEnabled === 'bottom')brpx.y = this.mouseY;
          if (this.resizingBBOXEnabled === 'topleft') { tlpx.x = this.mouseX; tlpx.y = this.mouseY; }
          if (this.resizingBBOXEnabled === 'topright') { brpx.x = this.mouseX; tlpx.y = this.mouseY; }
          if (this.resizingBBOXEnabled === 'bottomleft') { tlpx.x = this.mouseX; brpx.y = this.mouseY; }
          if (this.resizingBBOXEnabled === 'bottomright') { brpx.x = this.mouseX; brpx.y = this.mouseY; }

          tlpx = this.getGeoCoordFromPixelCoord(tlpx);
          brpx = this.getGeoCoordFromPixelCoord(brpx);
          this.divBoundingBox.bbox.left = tlpx.x;
          this.divBoundingBox.bbox.top = tlpx.y;
          this.divBoundingBox.bbox.right = brpx.x;
          this.divBoundingBox.bbox.bottom = brpx.y;
          this.showBoundingBox(this.divBoundingBox.bbox);

          let data = { map: this, bbox: this.divBoundingBox.bbox };
          this.callBack.triggerEvent('bboxchanged', data);
        }
        return;
      } else {
        this.resizingBBOXEnabled = false;
        this.baseDiv.css('cursor', this.resizingBBOXCursor);
      }
    }

    if (this._checkInvalidMouseAction(this.mouseX, this.mouseY) === -1) {
      try {
        this.callBack.triggerEvent('onmousemove', [undefined, undefined]);
        this.updateMouseCursorCoordinates(undefined);
      } catch (e) {
        console.error(e);
      }
      this.mouseUpX = this.mouseX;
      this.mouseUpY = this.mouseY;
      if (this.mapPanning === 0) return;
      if (this.mouseDownPressed === 1) if (this.mapMode === 'zoomout') this.zoomOut();
      this.mouseDownPressed = 0;
      if (this.mouseDragging === 1) {
        this.mouseDragEnd(this.mouseUpX, this.mouseUpY);
      }
      return;
    }

    if (this.mouseDownPressed === 1) {
      if (!(Math.abs(this.mouseDownX - this.mouseX) < 3 && Math.abs(this.mouseDownY - this.mouseY) < 3)) {
        this.mouseDrag(this.mouseX, this.mouseY);
      }
    }
    this.callBack.triggerEvent('onmousemove', [this.mouseX, this.mouseY]);
    this.updateMouseCursorCoordinates({ x: this.mouseX, y:this.mouseY });
  };

  mouseUp (mouseCoordX, mouseCoordY, e) {
    this.controlsBusy = false;
    this.mouseUpX = mouseCoordX;
    this.mouseUpY = mouseCoordY;
    if (this.mouseDragging === 0) {
      if (this._checkInvalidMouseAction(this.mouseUpX, this.mouseUpY) === 0) {
        let triggerResults = this.callBack.triggerEvent('beforemouseup', { mouseX:mouseCoordX, mouseY:mouseCoordY, mouseDown:false, event:e });
        for (let j = 0; j < triggerResults.length; j++) {
          if (triggerResults[j] === false) {
            this.mouseDownPressed = 0;
            return;
          }
        }
      }
    }
    if (this.mouseDownPressed === 1) {
      if (this.mapMode === 'zoomout') { this.zoomOut(); }
      if (this.mouseDragging === 0) {
        if (Math.abs(this.mouseDownX - this.mouseUpX) < 3 && Math.abs(this.mouseDownY - this.mouseUpY) < 3) {
          if (isDefined(e)) {
            this.callBack.triggerEvent('mouseclicked', { map:this, x:this.mouseUpX, y:this.mouseUpY, shiftKeyPressed: (e.shiftKey === true) });
          }
          if (this.inlineGetFeatureInfo === true) {
            let dialog;
            if (this.gfiDialogList.length === 0) {
              dialog = new WMJSDialog().createDialog({ show: this.showDialog, x:this.mouseUpX, y:this.mouseUpY, autoDestroy:false }, this.baseDiv, this, this.loadingImageSrc);
              this.gfiDialogList.push(dialog);
            } else {
              dialog = this.gfiDialogList[0];
            }
            if (dialog.hasBeenDragged === false) {
              if (dialog.moveToMouseCursor === true) {
                dialog.setXY(this.mouseUpX, this.mouseUpY);
              } else {
                dialog.setXY(5, 45);
              }
            }

            dialog.on('hide', (event, ui) => {
              dialog.hasBeenDragged = false;
            });
            dialog.setLoading();
            dialog.show();
            let ongetfeatureinfoready = (data) => {
              dialog.setHTML(this.getGetFeatureInfoObjectAsHTML(data));
            };

            this.addListener('ongetfeatureinfoready', ongetfeatureinfoready, true);
            this.setMapPin(this.mouseDownX, this.mouseDownY);
            this.showMapPin();
            this.callBack.triggerEvent('beforegetfeatureinfo');
            this.getFeatureInfo(this.mouseDownX, this.mouseDownY);
          } else {
            this.setMapPin(this.mouseDownX, this.mouseDownY);
            this.showMapPin();
          }
        }
      }
      this.callBack.triggerEvent('mouseup', { map: this, x: this.mouseUpX, y: this.mouseUpY });
    }
    this.mouseDownPressed = 0;
    if (this.mouseDragging === 1) {
      this.mouseDragEnd(this.mouseUpX, this.mouseUpY);
    }
  };

  /* Derived mouse methods */
  _mouseDragStart (x, y) {
    if (this.mapMode === 'pan') this._mapPanStart(x, y);
    if (this.mapMode === 'zoom') this._mapZoomStart(x, y);
  };

  mouseDrag (x, y) {
    if (this.mouseDragging === 0) { this._mouseDragStart(x, y); this.mouseDragging = 1; }
    if (this.mapMode === 'pan') this._mapPan(x, y);
    if (this.mapMode === 'zoom') this._mapZoom(x, y);
  };

  mouseDragEnd (x, y) {
    if (this.mouseDragging === 0) return;
    this.mouseDragging = 0;
    if (this.mapMode === 'pan') this._mapPanEnd(x, y);
    if (this.mapMode === 'zoom') this._mapZoomEnd(x, y);
    this.callBack.triggerEvent('mapdragend', { map:this, x:this.mouseUpX, y:this.mouseUpY });
  };

  /* Map zoom and pan methodss */
  _mapPanStart (_x, _y) {
    this.flyZoomToBBOXStop();
    this.baseDiv.css('cursor', 'move');
    let x = parseInt(_x); let y = parseInt(_y);

    this.divMapPin.oldx = this.divMapPin.exactX;
    this.divMapPin.oldy = this.divMapPin.exactY;
    for (let j = 0; j < this.gfiDialogList.length; j++) {
      this.gfiDialogList[j].origX = this.gfiDialogList[j].x;
      this.gfiDialogList[j].origY = this.gfiDialogList[j].y;
    }
    this.mapPanning = 1;
    if (enableConsoleDebugging)console.log('updateBBOX.setBBOX(drawnBBOX)');
    this.updateBBOX.setBBOX(this.drawnBBOX);
    this.mapPanStartGeoCoords = this.getGeoCoordFromPixelCoord({ x:x, y:y }, this.bbox);
  };

  _mapPan (_x, _y) {
    if (this.mapPanning === 0) return;
    let x = parseInt(_x); let y = parseInt(_y);

    if (this.mouseX < 0 || this.mouseY < 0 || this.mouseX > parseInt(this.mainElement.clientWidth) || this.mouseY > parseInt(this.mainElement.clientHeight)) {
      this.mapPanEnd(x, y);
      return;
    }
    let mapPanGeoCoords = this.getGeoCoordFromPixelCoord({ x:x, y:y }, this.updateBBOX);
    let diffX = mapPanGeoCoords.x - this.mapPanStartGeoCoords.x;
    let diffY = mapPanGeoCoords.y - this.mapPanStartGeoCoords.y;
    this.updateBBOX.left = this.updateBBOX.left - diffX;
    this.updateBBOX.bottom = this.updateBBOX.bottom - diffY;
    this.updateBBOX.right = this.updateBBOX.right - diffX;
    this.updateBBOX.top = this.updateBBOX.top - diffY;
    this._updateBoundingBox(this.updateBBOX);
  };

  _mapPanEnd (_x, _y) {
    this.baseDiv.css('cursor', 'default');
    let x = parseInt(_x);
    let y = parseInt(_y);
    if (this.mapPanning === 0) return;
    this.mapPanning = 0;

    let mapPanGeoCoords = this.getGeoCoordFromPixelCoord({ x:x, y:y }, this.drawnBBOX);
    let diffX = mapPanGeoCoords.x - this.mapPanStartGeoCoords.x;
    let diffY = mapPanGeoCoords.y - this.mapPanStartGeoCoords.y;
    this.updateBBOX.left = this.drawnBBOX.left - diffX;
    this.updateBBOX.bottom = this.drawnBBOX.bottom - diffY;
    this.updateBBOX.right = this.drawnBBOX.right - diffX;
    this.updateBBOX.top = this.drawnBBOX.top - diffY;
    this._updateBoundingBox(this.updateBBOX);
    this.zoomTo(this.updateBBOX);
    this.draw('mapPanEnd');
  };

  _mapZoomStart (x, y) {
    this.baseDiv.css('cursor', 'crosshair');
    this.mapZooming = 1;
  };
  _mapZoom (x, y) {
    if (this.mapZooming === 0) return;
    x = this.mouseX - this.mouseDownX;
    y = this.mouseY - this.mouseDownY;
    if (x < 0 && y < 0) {
      this.baseDiv.css('cursor', 'not-allowed');
    } else {
      this.baseDiv.css('cursor', 'crosshair');
    }
    let w = x;
    let h = y;
    this.divZoomBox.style.display = '';
    if (w < 0) {
      w = -w;
      this.divZoomBox.style.left = (this.mouseX) + 'px';
    } else this.divZoomBox.style.left = (this.mouseDownX) + 'px';
    if (h < 0) {
      h = -h;
      this.divZoomBox.style.top = (this.mouseY) + 'px';
    } else this.divZoomBox.style.top = (this.mouseDownY) + 'px';
    this.divZoomBox.style.width = w + 'px';
    this.divZoomBox.style.height = h + 'px';
  };

  _mapZoomEnd (x, y) {
    x = this.mouseUpX - this.mouseDownX;
    y = this.mouseUpY - this.mouseDownY;
    this.baseDiv.css('cursor', 'default');
    if (this.mapZooming === 0) return;
    this.mapZooming = 0;
    this.divZoomBox.style.display = 'none';
    if (x < 0 && y < 0) return;
    let zoomBBOXPixels = new WMJSBBOX();

    if (x < 0) {
      zoomBBOXPixels.left = this.mouseDownX + x;
      zoomBBOXPixels.right = this.mouseDownX;
    } else {
      zoomBBOXPixels.left = this.mouseDownX;
      zoomBBOXPixels.right = this.mouseDownX + x;
    }
    if (y < 0) {
      zoomBBOXPixels.top = this.mouseDownY + y;
      zoomBBOXPixels.bottom = this.mouseDownY;
    } else {
      zoomBBOXPixels.top = this.mouseDownY;
      zoomBBOXPixels.bottom = this.mouseDownY + y;
    }
    let p1 = this.pixelCoordinatesToXY({ x:zoomBBOXPixels.left, y:zoomBBOXPixels.bottom });
    let p2 = this.pixelCoordinatesToXY({ x:zoomBBOXPixels.right, y:zoomBBOXPixels.top });

    zoomBBOXPixels.left = p1.x;
    zoomBBOXPixels.bottom = p1.y;
    zoomBBOXPixels.right = p2.x;
    zoomBBOXPixels.top = p2.y;
    this.zoomTo(zoomBBOXPixels);
    this.draw('mapZoomEnd');
  };

  setCursor (cursor) {
    if (cursor) {
      this.currentCursor = cursor;
    } else {
      this.currentCursor = 'default';
    }
    this.baseDiv.css('cursor', this.currentCursor);
  };

  getId () {
    return this.makeComponentId('webmapjsinstance');
  };

  zoomTo (_newbbox) {
    if (enableConsoleDebugging)console.log('zoomTo');
    let setOrigBox = false;

    let newbbox = new WMJSBBOX(_newbbox);
    // Maintain aspect ratio
    let ratio = 1;
    try {
      ratio = (this.resizeBBOX.left - this.resizeBBOX.right) / (this.resizeBBOX.bottom - this.resizeBBOX.top);
    } catch (e) {
      setOrigBox = true;
    }
    // Check whether we have had valid bbox values
    if (isNaN(ratio)) {
      setOrigBox = true;
    }
    if (setOrigBox === true) {
      error('Invalid bbox: setting ratio to 1');
      ratio = 1;
    }
    if (ratio < 0)ratio = -ratio;

    let screenRatio = this.width / this.height;

    // Is W > H?
    if (ratio > screenRatio) {
      // W is more than H, so calc H
      let centerH = (newbbox.top + newbbox.bottom) / 2;
      let extentH = ((newbbox.left - newbbox.right) / 2) / ratio;
      newbbox.bottom = centerH + extentH;
      newbbox.top = centerH - extentH;
    } else {
      // H is more than W, so calc W
      let centerW = (newbbox.right + newbbox.left) / 2;
      let extentW = ((newbbox.bottom - newbbox.top) / 2) * ratio;
      newbbox.left = centerW + extentW;
      newbbox.right = centerW - extentW;
    }

    this.setBBOX(newbbox);
    this._updateBoundingBox(this.bbox);
    this.drawnBBOX.setBBOX(this.bbox);

    let resetMapPinAndDialogs = () => {
      // let newpos = this.getPixelCoordFromGeoCoord({ x:divMapPin.geoPosX, y:divMapPin.geoPosY });
      for (let j = 0; j < this.gfiDialogList.length; j++) {
        let newpos = this.getPixelCoordFromGeoCoord({ x:this.gfiDialogList[j].geoPosX, y:this.gfiDialogList[j].geoPosY });
        if (this.gfiDialogList[j].hasBeenDragged === false) {
          if (this.gfiDialogList[j].moveToMouseCursor === true) {
            this.gfiDialogList[j].setXY(this.gfiDialogList[j].origX + newpos.x, this.gfiDialogList[j].origY + newpos.y);
          }
        }
      }
    };
    resetMapPinAndDialogs();
  };

  pixelCoordinatesToXY (coordinates) {
    return this.getGeoCoordFromPixelCoord(coordinates);
  };

  getGeoCoordFromPixelCoord (coordinates, _bbox) {
    let mybbox = this.bbox;
    if (_bbox)mybbox = _bbox;
    if (!isDefined(coordinates)) return undefined;
    try {
      let lon = (coordinates.x / this.width) * (mybbox.right - mybbox.left) + mybbox.left;
      let lat = (coordinates.y / this.height) * (mybbox.bottom - mybbox.top) + mybbox.top;
      return { x:lon, y:lat };
    } catch (e) {
      return undefined;
    }
  };

  getProj4 () {
    if (!this.srs || this.srs === 'GFI:TIME_ELEVATION') {
      return null;
    }
    if (this.proj4.srs !== this.srs || !isDefined(this.proj4.projection)) {
      this.proj4.projection = (this.srs);
      this.proj4.srs = this.srs;
    }
    return { lonlat: this.longlat, crs: this.proj4.projection, proj4: proj4 };
  };

  getPixelCoordFromLatLong (coordinates) {
    if (!this.srs || this.srs === 'GFI:TIME_ELEVATION') {
      return coordinates;
    }
    let result;
    try {
      let p = {};
      p.x = parseFloat(coordinates.x);
      p.y = parseFloat(coordinates.y);
      if (this.proj4.srs !== this.srs || !isDefined(this.proj4.projection)) {
        this.proj4.projection = (this.srs);
        this.proj4.srs = this.srs;
      }
      result = proj4(this.longlat, this.proj4.projection, [p.x, p.y]);
    } catch (e) {
      error('error in getPixelCoordFromLatLong ' + e);
      return undefined;
    }
    return this.getPixelCoordFromGeoCoord({ x: result[0], y: result[1] });
  };

  WCJSSearchRequest (searchDefinition) {
    console.log(searchDefinition);
    /* ------------ */
    /*  Validation  */
    /* ------------ */
    /* Is it a coordinate search? No Ajax calls needed. */
    if (searchDefinition.trim().match(/^(-?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?),-?(?:180(?:\.0+)?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d+)?))jquery/)) {
      let splitted = searchDefinition.split(',');
      let lat = splitted[0];
      let lng = splitted[1];
      console.log('LATLON');
      this.calculateBoundingBoxAndZoom(lat, lng);
      return;
    }

    if (typeof (geoNamesURL) === 'undefined' && typeof (knmiGeoNamesURL) === 'undefined') {
      error(I18n.no_urls_in_config.text);
      return;
    }

    /* If there is no search term */
    if (!searchDefinition.trim()) {
      debug(I18n.no_search_definition.text);
      // Reset value, in case there are only spaces.
      jquery('#searchtextfield').attr('value', '');
      return;
    }

    let searchDef = searchDefinition.trim().match(/^[a-zA-Z0-9 ]*jquery/);

    /* Only Alphanumeric characters are allowed */
    if (!searchDef) {
      debug(I18n.only_alpha_num_allowed.text);
      jquery('#searchtextfield').attr('value', '');
      return;
    }

    /*
     * First attempt if getting the lat/lng from GeoNames.org.
     * If not succesful, try our own SQLite3 DB.
     */
    let urlKNMIGeoNames;
    if (typeof (knmiGeoNamesURL) !== 'undefined') {
      urlKNMIGeoNames = this.knmiGeoNamesURL.replace('{searchTerm}', searchDef);
    } else {
      /* If only geonames is configured, try this instead */
      let urlApiGeonames = this.geoNamesURL.replace('{searchTerm}', searchDef).replace('{username}', this.defaultUsernameSearch);
      this.WCJSSearchRequestGeoNames(urlApiGeonames);
      return;
    }

    /* Debugging text */
    debug(I18n.debug_searching_location.text);
    debug('<a target="_blank" href="' + urlKNMIGeoNames + '">' + urlKNMIGeoNames + '</a>', false);

    let errormessage = (jqXHR, textStatus, errorThrown) => {
      error(I18n.geonames_api_call_failed.text);
    };

    let succes = (obj) => {
      /* If there is no result from the API, search the SQLite DB */
      if (jquery(obj).length === 0) {
        let urlApiGeonames = this.geoNamesURL.replace('{searchTerm}', searchDef)
          .replace('{username}', this.defaultUsernameSearch);
        console.log('urlApiGeonames', urlApiGeonames);
        this.WCJSSearchRequestGeoNames(urlApiGeonames);
        return;
      }
      console.log('ok');
      let lat = parseFloat(jquery(obj)[0].lat);
      let lng = parseFloat(jquery(obj)[0].lon);

      this.calculateBoundingBoxAndZoom(lat, lng);
    };
    jquery.ajax({
      dataType: 'jsonp',
      contentType: 'application/jsonp',
      jsonpCallback: 'resultGeo',
      crossDomain: true,
      type: 'GET',
      url: urlKNMIGeoNames,
      success: succes,
      error:errormessage
    });
  };

  WCJSSearchRequestGeoNames (url) {
    debug(I18n.debug_searching_sqlite_location.text);
    debug('<a target="_blank" href="' + url + '">' + url + '</a>', false);
    let errormessage = (jqXHR, textStatus, errorThrown) => {
      error(I18n.geonames_sqlite_call_failed.text);
    };
    let succes = (obj) => {
      console.log('ok', obj);
      /* If there is no result */
      if (jquery(obj).find('totalResultsCount').text() === '0') {
        error(I18n.no_results_search.text);
        /* Reset value */
        return;
      }
      let lat = parseFloat(jquery(obj).find('geoname').find('lat').text());
      let lng = parseFloat(jquery(obj).find('geoname').find('lng').text());
      this.calculateBoundingBoxAndZoom(lat, lng);
    };
    jquery.ajax({
      dataType: 'xml',
      type: 'GET',
      url: url,
      success: succes,
      error:errormessage
    });
  };

  calculateBoundingBoxAndZoom (lat, lng) {
    let lengthToBBOX = 500000;
    if (this.srs === 'EPSG:4326' ||
      this.srs === 'EPSG:50001') {
      lengthToBBOX = 5;
    }
    console.log(lat, lng);
    let latlng = this.getPixelCoordFromLatLong({ x:lng, y:lat });
    console.log(latlng);
    let geolatlng = this.getGeoCoordFromPixelCoord(latlng);
    console.log(geolatlng);

    let searchZoomBBOX = new WMJSBBOX();

    /* Making the boundingbox. */
    searchZoomBBOX.left = geolatlng.x - lengthToBBOX;
    searchZoomBBOX.bottom = geolatlng.y - lengthToBBOX;
    searchZoomBBOX.right = geolatlng.x + lengthToBBOX;
    searchZoomBBOX.top = geolatlng.y + lengthToBBOX;

    this.zoomTo(searchZoomBBOX);
    this.positionMapPinByLatLon({ x:lng, y:lat });
    this.draw('zoomIn');
  };

  getLatLongFromPixelCoord (coordinates) {
    if (!this.srs || this.srs === 'GFI:TIME_ELEVATION') {
      return coordinates;
    }
    try {
      let p = {};
      p.x = (coordinates.x / this.width) * (this.bbox.right - this.bbox.left) + this.bbox.left;
      p.y = (coordinates.y / this.height) * (this.bbox.bottom - this.bbox.top) + this.bbox.top;
      if (this.proj4.srs !== this.srs) {
        this.proj4.projection = (this.srs);
        this.proj4.srs = this.srs;
      }
      let result = proj4(this.proj4.projection, this.longlat, [p.x, p.y]);
      return { x:result[0], y:result[1] };
    } catch (e) {
      return undefined;
    }
  };

  getPixelCoordFromGeoCoord (coordinates, _bbox, _width, _height) {
    let w = this.width;
    let h = this.height;
    let b = this.updateBBOX;
    if (isDefined(_width))w = _width;
    if (isDefined(_height))h = _height;
    if (isDefined(_bbox))b = _bbox;

    let x = (w * (coordinates.x - b.left)) / (b.right - b.left);
    let y = (h * (coordinates.y - b.top)) / (b.bottom - b.top);
    // Was parseInt, but we require sub-pixel precision
    return { x:parseFloat(x), y:parseFloat(y) };
  };

  // listeners:
  addListener (name, f, keep) {
    return this.callBack.addToCallback(name, f, keep);
  };

  removeListener (name, f) {
    return this.callBack.removeEvents(name, f);
  };

  getListener (name) {
    return this.callBack;
  };

  suspendEvent (name) {
    this.callBack.suspendEvent(name);
  };

  resumeEvent (name) {
    this.callBack.resumeEvent(name);
  };

  getDimensionList () {
    return this.mapdimensions;
  };

  getDimension (name) {
    for (let i = 0; i < this.mapdimensions.length; i++) {
      if (this.mapdimensions[i].name === name) {
        return this.mapdimensions[i];
      }
    }
    return undefined;
  };

  setDimension (name, value, triggerEvent) {
    debug('WebMapJS::setDimension(' + name + ',' + value + ')');
    if (!isDefined(name) || !isDefined(value)) {
      error('Unable to set dimension with undefined value or name');
      return;
    }
    let dim = this.getDimension(name);

    if (isDefined(dim) === false) {
      dim = { name:name, currentValue:value };
      this.mapdimensions.push(dim);
    }

    if (isDefined(this.mainTimeSlider)) {
      this.mainTimeSlider.setValue(name, value);
    }

    if (dim.currentValue !== value) {
      dim.currentValue = value;
      this._buildLayerDims();
      if (triggerEvent !== false) {
        triggerEvent = true;
      }
      if (triggerEvent === true) {
        this.callBack.triggerEvent('ondimchange', name);
      }
    }
  };

  /* Layer handling */
  setLayerOpacity (_layer, _opacity) {
    if (!_layer) return;
    _layer.opacity = _opacity;
    let currentLayerIndex = this.numBaseLayers;
    for (let j = 0; j < this.getNumLayers(); j++) {
      if (this.layers[j].service && this.layers[j].enabled) {
        if (_layer === this.layers[j]) {
          this.setBufferImageOpacity(this.newSwapBuffer, currentLayerIndex, _opacity);
          return;
        }
        currentLayerIndex++;
      }
    }
  };

  zoomToLayer (_layer) {
    // Tries to zoom to the layers boundingbox corresponding to the current map projection
    // If something fails, the defaultBBOX is used instead.
    let layer = _layer;
    if (!layer) {
      layer = this.activeLayer;
    }
    if (!layer) {
      this.zoomTo(this.defaultBBOX);
      this.draw('zoomTolayer');
      return;
    }
    for (let j = 0; j < layer.projectionProperties.length; j++) {
      if (layer.projectionProperties[j].srs === this.srs) {
        let w = layer.projectionProperties[j].bbox.right - layer.projectionProperties[j].bbox.left;
        let h = layer.projectionProperties[j].bbox.top - layer.projectionProperties[j].bbox.bottom;
        let newBBOX = layer.projectionProperties[j].bbox.clone();
        newBBOX.left -= w / 100;
        newBBOX.right += w / 100;
        newBBOX.bottom -= h / 100;
        newBBOX.top += h / 100;

        this.zoomTo(newBBOX);
        this.draw('zoomTolayer');
        return;
      }
    }
    error('Unable to find the correct bbox with current map projection ' + this.srs + ' for layer ' + layer.title + '. Using default bbox instead.');
    this.zoomTo(this.defaultBBOX);
    this.draw('zoomTolayer');
  };

  setPreviousExtent () {
    this.DoUndo = 1;
    this.UndoPointer++;
    if (this.UndoPointer >= this.NrOfUndos) this.UndoPointer = this.NrOfUndos - 1;
    this.setProjection(this.WMJSProjection_undo[this.UndoPointer].srs, this.WMJSProjection_undo[this.UndoPointer].bbox);
    this.draw('setPreviousExtent');
  };

  setNextExtent () {
    this.DoRedo = 1;
    this.UndoPointer--; if (this.UndoPointer < 0) this.UndoPointer = 0;
    this.setProjection(this.WMJSProjection_undo[this.UndoPointer].srs, this.WMJSProjection_undo[this.UndoPointer].bbox);
    this.draw('setNextExtent');
  };

  setBBOX (left, bottom, right, top) {
    if (enableConsoleDebugging)console.log('setBBOX');
    this.bbox.setBBOX(left, bottom, right, top);
    this.resizeBBOX.setBBOX(this.bbox);

    if (this.srs !== 'GFI:TIME_ELEVATION') {
      let divRatio = (this.width / this.height);
      let bboxRatio = (this.bbox.right - this.bbox.left) / (this.bbox.top - this.bbox.bottom);
      if (bboxRatio > divRatio) {
        let centerH = (this.bbox.top + this.bbox.bottom) / 2;
        let extentH = ((this.bbox.left - this.bbox.right) / 2) / divRatio;
        this.bbox.bottom = centerH + extentH;
        this.bbox.top = centerH - extentH;
      } else {
        /* H is more than W, so calc W */
        let centerW = (this.bbox.right + this.bbox.left) / 2;
        let extentW = ((this.bbox.bottom - this.bbox.top) / 2) * divRatio;
        this.bbox.left = centerW + extentW;

        this.bbox.right = centerW - extentW;
      }
    }
    this.updateBBOX.setBBOX(this.bbox);
    this.drawnBBOX.setBBOX(this.bbox);
    /* Undo part */
    if (this.DoRedo === 0 && this.DoUndo === 0) {
      if (this.UndoPointer !== 0) {
        for (let j = 0; j <= this.UndoPointer; j++) this.WMJSProjection_tempundo[j] = this.WMJSProjection_undo[j];
        for (let j = 0; j <= this.UndoPointer; j++) this.WMJSProjection_undo[j] = this.WMJSProjection_tempundo[this.UndoPointer - j];
        this.UndoPointer = 0;
      }
      for (let j = this.MaxUndos - 1; j > 0; j--) {
        this.WMJSProjection_undo[j].bbox.setBBOX(this.WMJSProjection_undo[j - 1].bbox);
        this.WMJSProjection_undo[j].srs = this.WMJSProjection_undo[j - 1].srs;
      }
      this.WMJSProjection_undo[0].bbox.setBBOX(this.bbox);
      this.WMJSProjection_undo[0].srs = this.srs;
      this.NrOfUndos++;
      if (this.NrOfUndos > this.MaxUndos) this.NrOfUndos = this.MaxUndos;
    }
    this.DoRedo = 0;
    this.DoUndo = 0;
    if (this.bbox.equals(left, bottom, right, top) === true) {
      return false;
    }
    this.callBack.triggerEvent('aftersetbbox', this);
    return true;
  };

  zoomOut () {
    let a = (this.resizeBBOX.right - this.resizeBBOX.left) / 6;
    this.zoomTo(new WMJSBBOX(this.resizeBBOX.left - a, this.resizeBBOX.bottom - a, this.resizeBBOX.right + a, this.resizeBBOX.top + a));
    this.draw('zoomOut');
  };

  zoomIn (ratio) {
    let a = (this.resizeBBOX.left - this.resizeBBOX.right) / 8;
    if (isDefined(ratio) === false) {
      ratio = 1;
    } else {
      if (ratio === 0) return;
    }
    a = a * ratio;
    this.zoomTo(new WMJSBBOX(this.resizeBBOX.left - a, this.resizeBBOX.bottom - a, this.resizeBBOX.right + a, this.resizeBBOX.top + a));
    this.draw('zoomIn');
  };

  searchForLocation (searchParam) {
    this.WCJSSearchRequest(searchParam);
  };

  displayLegendInMap (_displayLegendInMap) {
    this._displayLegendInMap = _displayLegendInMap;
    this.repositionLegendGraphic();
  };

  showBoundingBox (_bbox, _mapbbox) {
    if (isDefined(_bbox)) {
      this.divBoundingBox.bbox = _bbox;
      this.divBoundingBox.style.display = '';
      this.divBoundingBox.displayed = true;
    }
    if (this.divBoundingBox.displayed !== true) return;

    let b = this.bbox;
    if (isDefined(_mapbbox))b = _mapbbox;
    let coord1 = this.getPixelCoordFromGeoCoord({ x:this.divBoundingBox.bbox.left, y:this.divBoundingBox.bbox.top }, b);
    let coord2 = this.getPixelCoordFromGeoCoord({ x:this.divBoundingBox.bbox.right, y:this.divBoundingBox.bbox.bottom }, b);

    this.divBoundingBox.style.left = (coord1.x - 1) + 'px';
    this.divBoundingBox.style.top = (coord1.y - 2) + 'px';
    this.divBoundingBox.style.width = (coord2.x - coord1.x) + 'px';
    this.divBoundingBox.style.height = (coord2.y - coord1.y - 1) + 'px';
  };

  hideBoundingBox () {
    this.divBoundingBox.style.display = 'none';
    this.divBoundingBox.displayed = false;
  };

  clearImageStore () {
    this.getLegendStore().clear();
    this.getImageStore().clear();
  };
};

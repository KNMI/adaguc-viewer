import WMJSImage from './WMJSImage.js';
import { error, debug } from './WMJSConstants.js';
import { isDefined } from './WMJSTools.js';
import { jquery } from './WMJSExternalDependencies.js';
export default class WMJSCanvasBuffer {
  constructor (webmapJSCallback, _type, _imageStore, w, h) {
    if (!jquery) { console.warn('WMJSCanvasBuffer: jquery is not defined, assuming unit test is running'); return; }
    this.canvas = jquery('<canvas/>', { 'class':'WMJSCanvasBuffer' }).width(w).height(h);
    this._ctx = this.canvas[0].getContext('2d');
    this._ctx.canvas.width = w;
    this._ctx.canvas.height = h;
    // TODO: Check if this really gives sharper instead of blurier images...
    // this._ctx.webkitImageSmoothingEnabled = true;
    // this._ctx.imageSmoothingQuality igh';
    // this._ctx.msImageSmoothingEnabled = true;
    // this._ctx.imageSmoothingEnabled = tr
    this._imageStore = _imageStore;
    this.ready = true;
    this.hidden = true;
    this.layerstodisplay = [];
    this.layers = [];
    this._defaultImage = new WMJSImage('webmapjs/img/stoploading.png', () => {
      console.log('no image loaded');
      this._statDivBufferImageLoaded();
    }, this._type);
    this._currentbbox = undefined;
    this._currentnewbbox = undefined;

    this._width = w;
    this._height = h;
    this._type = _type;
    this._webmapJSCallback = webmapJSCallback;
    if (this._type === 'imagebuffer') {
      this.canvas.addClass('wmjsimagebuffer');
    }
    if (this._type === 'legendbuffer') {
      this.canvas.addClass('wmjslegendbuffer');
    }

    this.canvas.addClass('WMJSCanvasBuffer-noselect');
    /* Bind */
    this.getCanvasContext = this.getCanvasContext.bind(this);
    this.imageLoadComplete = this.imageLoadComplete.bind(this);
    this._statDivBufferImageLoaded = this._statDivBufferImageLoaded.bind(this);
    this.hide = this.hide.bind(this);
    this.display = this.display.bind(this);
    this.finishedLoading = this.finishedLoading.bind(this);
    this.resize = this.resize.bind(this);
    this.load = this.load.bind(this);
    this.setSrc = this.setSrc.bind(this);
    this._getPixelCoordFromGeoCoord = this._getPixelCoordFromGeoCoord.bind(this);
    this.setBBOX = this.setBBOX.bind(this);
    this.getBuffer = this.getBuffer.bind(this);
  }

  getCanvasContext () {
    return this._ctx;
  };

  imageLoadComplete (image) {
    this._statDivBufferImageLoaded();
    this._webmapJSCallback.triggerEvent('onimageload');
    if (this._type === 'imagebuffer') {
      this._webmapJSCallback.triggerEvent('onimagebufferimageload', image);
    }
  };

  _statDivBufferImageLoaded () {
    for (let j = 0; j < this.layers.length; j++) {
      if (this.layers[j].image.isLoaded() === false) {
        return;
      }
    }
    this.finishedLoading();
  };

  hide () {
    this.hidden = true;
    this.canvas.hide();
    this.layers.length = 0;
    this.layerstodisplay.length = 0;
  };

  display (newbbox, loadedbbox) {
    let errorList = [];
    if ((newbbox && !loadedbbox)) {
      console.error('skipping WMJSCanvasBuffer:display because newbbox is undefined');
      return;
    }

    this.hidden = false;
    this._ctx.globalAlpha = 1;

    if (this._type === 'legendbuffer') {
      this._ctx.clearRect(0, 0, this._width, this._height);
    }
    if (this._type === 'imagebuffer') {
      this._ctx.beginPath();
      this._ctx.rect(0, 0, this._width, this._height);
      this._ctx.fillStyle = 'white';
      this._ctx.fill();
      this._webmapJSCallback.triggerEvent('beforecanvasstartdraw', this._ctx);
    }

    /* Calculcate new pos */
    let coord1, coord2;
    if (newbbox) {
      let b1 = loadedbbox;// this.bbox;
      // if(newbbox == undefined)newbbox=b1;
      let b2 = newbbox;
      coord1 = this._getPixelCoordFromGeoCoord({ x:b1.left, y:b1.top }, b2);
      coord2 = this._getPixelCoordFromGeoCoord({ x:b1.right, y:b1.bottom }, b2);
    }

    let legendPosX = 0;
    for (let j = 0; j < this.layerstodisplay.length; j++) {
      this.layerstodisplay[j].image.setSize(this._width, this._height);
      if (this.layerstodisplay[j].image.hasError() === false) {
        // Draw
        let op = this.layerstodisplay[j].opacity;
        this._ctx.globalAlpha = op;
        let el = this.layerstodisplay[j].image.getElement()[0];
        if (this._type === 'legendbuffer') {
          let legendW = parseInt(el.width) + 4;
          let legendH = parseInt(el.height) + 4;
          legendPosX += (legendW + 4);
          let legendX = this._width - legendPosX + 2;
          let legendY = this._height - (legendH) - 2;
          this._ctx.beginPath();
          this._ctx.fillStyle = '#FFFFFF';
          this._ctx.lineWidth = 0.3;
          this._ctx.globalAlpha = 0.5;
          this._ctx.strokeStyle = '#000000';

          this._ctx.rect(parseInt(legendX) + 0.5, parseInt(legendY) + 0.5, legendW, legendH);
          this._ctx.fill();
          this._ctx.stroke();
          this._ctx.globalAlpha = 1.0;
          this._ctx.drawImage(el, legendX, legendY);
        } else {
          if (newbbox) {
            let imageX = parseInt(coord1.x + 0.5);
            let imageY = parseInt(coord1.y + 0.5);
            let imageW = parseInt((coord2.x - coord1.x) + 0.5);
            let imageH = parseInt((coord2.y - coord1.y) + 0.5);

            if ((imageW) === parseInt(this._ctx.canvas.width) && (imageH) === parseInt(this._ctx.canvas.height)) {
              this._ctx.drawImage(el, imageX, imageY);
            } else {
              this._ctx.drawImage(el, imageX, imageY, imageW, imageH);
            }
          } else {
            this._ctx.drawImage(el, 0, 0, this._width, this._height);
          }
        }
      } else {
        errorList.push(this.layerstodisplay[j]);
      }
    }
    this._ctx.globalAlpha = 1;

    /* Display errors */
    if (this._type === 'imagebuffer') {
      if (errorList.length > 0) {
        this._webmapJSCallback.triggerEvent('canvasonerror', errorList);
      }
    }
    if (this._type === 'imagebuffer') {
      this._webmapJSCallback.triggerEvent('beforecanvasdisplay', this._ctx);
    }

    this.canvas.show();
    if (this._type === 'imagebuffer') {
      this._webmapJSCallback.triggerEvent('aftercanvasdisplay', this._ctx);
    }
  };

  finishedLoading () {
    if (this.ready) return;
    this.ready = true;
    this.layerstodisplay.length = 0;
    for (let j = 0; j < this.layers.length; j++) {
      this.layerstodisplay.push(this.layers[j]);
      if (this.layers[j].image.hasError()) {
        error('Unable to get image <a target="_blank" href="' +
          this.layerstodisplay[j].image.getSrc() + '">' + this.layerstodisplay[j].image.getSrc() + '</a>', false);
      }
    }
    try {
      if (isDefined(this.onLoadReadyFunction)) {
        this.onLoadReadyFunction(this);
      }
    } catch (e) {
      error('Exception in Divbuffer::finishedLoading: ' + e);
    }
  };

  resize (w, h) {
    w = parseInt(w);
    h = parseInt(h);
    if (this._width === w && this._height === h) return;
    this._width = w;
    this._height = h;
    this.canvas.width(w);
    this.canvas.height(h);
    this._ctx.canvas.height = h;
    this._ctx.canvas.width = w;
  };

  load (callback) {
    if (this.ready === false) {
      // console.log(" ===== Still busy ====== ");
      return;
    }
    this.ready = false;
    this.layerstodisplay.length = 0;

    // console.log("WMJSCanvasBuffer:load");
    // this.setPosition(0,0);
    if (callback) { this.onLoadReadyFunction = callback; } else this.onLoadReadyFunction = {};
    this.nrLoading = 0;
    // console.log("WMJSCanvasBuffer:this.layers.length = "+this.layers.length);

    for (let j = 0; j < this.layers.length; j++) {
      this.layers[j].loadThisOne = false;

      if (this.layers[j].image.isLoaded() === false) {
        this.layers[j].loadThisOne = true;
        this.nrLoading++;
      }
    }
    // console.log("WMJSCanvasBuffer.nrLoading = "+this.nrLoading +" nrImages = "+this.layers.length );
    if (this.nrLoading === 0) {
      this._statDivBufferImageLoaded();
    } else {
      if (this._type === 'imagebuffer') { debug('GetMap:'); }
      if (this._type === 'legendbuffer') { debug('GetLegendGraphic:'); }
      for (let j = 0; j < this.layers.length; j++) {
        if (this.layers[j].loadThisOne === true) {
          debug("<a target='_blank' href='" + this.layers[j].image.getSrc() + "'>" + this.layers[j].image.getSrc() + '</a>', false);
        }
      }

      for (let j = 0; j < this.layers.length; j++) {
        if (this.layers[j].loadThisOne === true) {
          // console.log('WMJSCanvasBuffer.loading = ' + this.layers[j].getSrc());
          this.layers[j].image.load();
        }
      }
    }
  };

  setSrc (layerIndex, imageSource, width, height, linkedInfo, opacity) {
    if (!isDefined(imageSource)) { console.log('undefined'); return; }
    while (layerIndex >= this.layers.length) {
      this.layers.push({ image:this._defaultImage, opacity: opacity, linkedInfo: linkedInfo, loadThisOne: false });
    }
    let image = this._imageStore.getImage(imageSource);

    // image.setZIndex(layerIndex);

    this.layers[layerIndex].image = image;
  };

  _getPixelCoordFromGeoCoord (coordinates, b) {
    let x = (this._width * (coordinates.x - b.left)) / (b.right - b.left);
    let y = (this._height * (coordinates.y - b.top)) / (b.bottom - b.top);
    return { x:x, y:y };
  };

  setBBOX (newbbox, loadedbbox) {
    if (this._currentbbox === loadedbbox + '' && this._currentnewbbox === newbbox + '') return;
    this._currentbbox = loadedbbox + '';
    this._currentnewbbox = newbbox + '';
    if (this.hidden === false) {
      this.display(newbbox, loadedbbox);
    }
  };

  getBuffer () {
    return this.canvas;
  };
};

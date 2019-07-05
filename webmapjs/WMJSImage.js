import { jquery } from './WMJSExternalDependencies.js';

import { isDefined } from './WMJSTools.js';

var numImagesLoading = 0;

/*
 * WMJSImage
  * image.this.srcToLoad the source to load
  * image._srcLoaded the loaded source
  */

export default class WMJSImage {
  constructor (src, callback, __type, options) {
    this.randomize = true;
    this._srcLoaded = undefined;
    this._isLoaded = undefined;
    this._isLoading = undefined;
    this._hasError = undefined;
    this._opacity = undefined;
    if (isDefined(options) && isDefined(options.randomizer)) {
      if (options.randomizer === false) {
        this.randomize = false;
      }
    }
    this.init = this.init.bind(this);

    this.isLoaded = this.isLoaded.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.checkIfThisSourceIsSet = this.checkIfThisSourceIsSet.bind(this);
    this.setSource = this.setSource.bind(this);
    this.clear = this.clear.bind(this);
    this.getSrc = this.getSrc.bind(this);
    this.hasError = this.hasError.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    this._load = this._load.bind(this);
    this.load = this.load.bind(this);
    this.loadEvent = this.loadEvent.bind(this);
    this.setOpacity = this.setOpacity.bind(this);
    this.getOpacity = this.getOpacity.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.setSize = this.setSize.bind(this);
    this.setZIndex = this.setZIndex.bind(this);
    this.getElement = this.getElement.bind(this);

    this.init();
    this.srcToLoad = src;
    this._type = __type;
    this.loadEventCallback = callback;
    if (!jquery) { console.warn('WMJSImage: jquery is not defined, assuming unit test is running'); return; }
    this.el = jquery(document.createElement('img'));
    this.el.on('load', () => {
      this.loadEvent(this, false);
    });
    this.el.on('error', (e) => {
      this.loadEvent(this, true);
    });
    this.el.onselectstart = () => { return false; };
    this.el.ondrag = () => { return false; };
  }
  init () {
    this._srcLoaded = 'undefined image';
    this._isLoaded = false;
    this._isLoading = false;
    this._hasError = false;
    this._opacity = 1;
    this._stopLoading = false;
  }

  isLoaded () {
    if (this._isLoading) return false;
    return this._isLoaded;
  }

  isLoading () {
    return this._isLoading;
  }

  checkIfThisSourceIsSet (src) {
    if (this._srcLoaded === src || this.srcToLoad === src) {
      return true;
    }
    return false;
  }
  /**
   * Set source of image, does not load yet.
   */
  setSource (src) {
    if (this._isLoading) {
      console.error('-------------------------> Source set while still loading!!! ');
      return;
    }
    this.srcToLoad = src;
    if (this._srcLoaded === this.srcToLoad) {
      this._isLoaded = true;
      return;
    }

    this._isLoaded = false;
  }

  clear () {
    this.init();
    this._stopLoading = true;
  }

  stopLoading () {
    this._stopLoading = true;
  }

  getSrc () {
    return this.srcToLoad;
  };

  hasError () {
    return this._hasError;
  };

  /**
   *
   * Load image *
   */
  load () {
    this._stopLoading = false;
    this._load();
  }

  _load () {
    this._hasError = false;
    if (this._isLoaded === true) {
      this.loadEvent(this, false);
      return;
    }
    this._isLoading = true;
    if (!this.srcToLoad) {
      console.error('Source not set');
      this.loadEvent(this, true);
      return;
    }

    /* Allow relative URL's */
    if (this.srcToLoad.startsWith('/') && !this.srcToLoad.startsWith('//')) {
      let splittedHREF = window.location.href.split('/').filter(e => e.length > 0);
      let hostName = splittedHREF[0] + '//' + splittedHREF[1] + '/';
      this.srcToLoad = hostName + this.srcToLoad;
    }

    if (this.srcToLoad.startsWith('http') === false && this.srcToLoad.startsWith('//') === false) {
      console.error('Source does not start with http');
      this.loadEvent(this, true);
      return;
    }

    if (this.srcToLoad === this._srcLoaded) {
      this.loadEvent(this, false);
      return;
    }

    if (this.timerIsRunning === true) return;
    if (numImagesLoading >= 4) {
      if (this._stopLoading === false) {
        this.timerIsRunning = true;
        setTimeout(() => {
          this.timerIsRunning = false;
          this._load();
        }, 10);
      } else {
        /* Cancel loading */
        this.init();
      }
      return;
    }
    numImagesLoading++;
    // console.log("WMJSImage:load "+this.srcToLoad);

    if (this.randomize) {
      this.getElement()[0].src = this.srcToLoad + '&' + Math.random();
      // this.el.attr('src', this.srcToLoad + '&' + Math.random());
    } else {
      this.getElement()[0].src = this.srcToLoad;
      // this.el.attr('src', this.srcToLoad);
    }
  };

  loadEvent (image, hasError) {
    numImagesLoading--;
    this._hasError = hasError;
    this._isLoading = false;
    this._isLoaded = true;
    this._srcLoaded = this.srcToLoad;
    if (isDefined(this.loadEventCallback)) {
      this.loadEventCallback(this);
    }
  }

  setOpacity (__opacity) {
    this._opacity = parseFloat(__opacity);
    this.el.css('opacity', this._opacity);
  };

  getOpacity (opacity) {
    return this._opacity;
  };

  setPosition (x, y) {
    this.el.css({ top: parseInt(y) + 'px', left: parseInt(x) + 'px', position:'absolute' });
  };

  setSize (w, h) {
    w = parseInt(w);
    h = parseInt(h);
    if (w === 0 || h === 0) return;
    if (isNaN(w) || isNaN(h)) return;
    this.el.width(parseInt(w) + 'px');
    this.el.height(parseInt(h) + 'px');
  };

  setZIndex (z) {
    this.el.zIndex = z;
  }

  getElement () {
    return this.el;
  }
};

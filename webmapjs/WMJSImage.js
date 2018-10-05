

import { isDefined } from './WMJSTools.js';

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
    this.el = $(document.createElement('img'));
    this.el.onselectstart = () => { return false; };
    this.el.ondrag = () => { return false; };
  }
  init () {
    this._srcLoaded = 'undefined image';
    this._isLoaded = false;
    this._isLoading = false;
    this._hasError = false;
    this._opacity = 1;
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
    // console.log("WMJSImage:load "+this.srcToLoad);

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

    if (this.srcToLoad.startsWith('http') === false && this.srcToLoad.startsWith('//') === false) {
      console.error('Source does not start with http');
      this.loadEvent(this, true);
      return;
    }

    if (this.srcToLoad === this._srcLoaded) {
      this.loadEvent(this, false);
      return;
    }

    this.el.on('load', () => {
      this.loadEvent(this, false);
    });
    this.el.on('error', (e) => {
      this.loadEvent(this, true);
    });
    if (this.randomize) {
      this.el.attr('src', this.srcToLoad + '&' + Math.random());
    } else {
      this.el.attr('src', this.srcToLoad);
    }
  };

  loadEvent (image, hasError) {
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

import WMJSImage from './WMJSImage.js';
import { WMJSKVP } from './WMJSTools.js';
export default class WMJSImageStore {
  constructor (maxNumberOfImages, _type, options) {
    this.imagesbysrc = {};
    this.imageLife = 0;
    this._imageLifeCounter = 0;
    this._type = _type;
    this._loadEventCallbackList = []; // Array of callbacks, as multiple instances can register listeners
    this._maxNumberOfImages = maxNumberOfImages;
    this._options = options;
    this.imageLoadEventCallback = this.imageLoadEventCallback.bind(this);
    this.getImageForSrc = this.getImageForSrc.bind(this);
    this.clear = this.clear.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    this.addLoadEventCallback = this.addLoadEventCallback.bind(this);
    this.getNumImagesLoading = this.getNumImagesLoading.bind(this);
    this.getImage = this.getImage.bind(this);
    this.emptyImage = new WMJSImage();
  }

  imageLoadEventCallback (_img, hasError) {
    for (let j = 0; j < this._loadEventCallbackList.length; j++) {
      this._loadEventCallbackList[j](_img);
    }
  }

  _getKeys (obj) {
    if (!Object.keys) {
      let keys = [];
      let k;
      for (k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          keys.push(k);
        }
      }
      return keys;
    } else {
      return Object.keys(obj);
    }
  };

  /**
   * Check if we have similar images with the same source in the pipeline
   */
  getImageForSrc (src) {
    if (this.imagesbysrc[src]) {
      return this.imagesbysrc[src];
    }
    return undefined;
  }

  clear () {
    for (let property in this.imagesbysrc) {
      if (this.imagesbysrc.hasOwnProperty(property)) {
        this.imagesbysrc[property].clear();
      }
    }
  };
  
  stopLoading () {
    for (let property in this.imagesbysrc) {
      if (this.imagesbysrc.hasOwnProperty(property)) {
        this.imagesbysrc[property].stopLoading();
      }
    }
  }

  addLoadEventCallback (callback) {
    this._loadEventCallbackList.push(callback);
  };

  getNumImagesLoading () {
    let numLoading = 0;
    for (let property in this.imagesbysrc) {
      if (this.imagesbysrc.hasOwnProperty(property)) {
        if (this.imagesbysrc[property].isLoading()) {
          numLoading++;
        }
      }
    }
    return numLoading;
  };

  getImage (src) {
    /** Check if we have an image in the pipeline **/
    let image = this.getImageForSrc(src);
    if (image !== undefined) {
      image.imageLife = this._imageLifeCounter++;
      // console.log("Found image");
      return image;
    }

    /** Create or reuse an image **/
    if (this._getKeys(this.imagesbysrc).length < this._maxNumberOfImages) {
      // console.log("Creating new image: "+this.images.length);
      // console.log(type);
      image = new WMJSImage(src, this.imageLoadEventCallback, this._type, this._options);
      image.setSource(src);
      image.KVP = new WMJSKVP(src);
      this.imagesbysrc[src] = image;
      image.imageLife = this._imageLifeCounter++;
      return image;
    } else {
      /* We have to reuse an image */
      let imageId = -1;
      let minImageLife = this._imageLifeCounter;
      Object.keys(this.imagesbysrc).forEach((property) => {
        let img = this.imagesbysrc[property];
        if (img.isLoading() === false) {// && img.isLoaded() === true) {
          if (minImageLife >= img.imageLife) {
            minImageLife = img.imageLife;
            imageId = property;
          }
        }
      });
      // console.log('Reusing image ' + imageId + ' with lifetime ' + minImageLife);
      if (imageId === -1) {
        console.error('not enough cache for ' + this._type);
        return this.emptyImage;
      }

      image = this.imagesbysrc[imageId];
      delete this.imagesbysrc[imageId];
      image.clear();
      image.setSource(src);
      image.KVP = new WMJSKVP(src);
      this.imagesbysrc[src] = image;
      image.imageLife = this._imageLifeCounter++;
      return image;
    }
  };
};

import { error } from './WMJSConstants.js';
import WMJSTimer from './WMJSTimer.js';
import { $ } from './WMJSExternalDependencies.js';
export default class WMJSAnimate {
  constructor (_map) {
    _map.animationDelay = 100;
    this._callBack = _map.getListener();
    this._imageStore = _map.getImageStore();
    this._divAnimationInfo = document.createElement('div');
    _map.currentAnimationStep = 0;
    _map.animationList = undefined;
    _map.isAnimating = false;
    _map.setAnimationDelay = (delay) => {
      if (delay < 1)delay = 1;
      _map.animationDelay = delay;
    };

    this._divAnimationInfo.style.zIndex = 10000;
    this._divAnimationInfo.style.background = 'none';
    this._divAnimationInfo.style.position = 'absolute';
    this._divAnimationInfo.style.border = 'none';
    this._divAnimationInfo.style.margin = '0px';
    this._divAnimationInfo.style.padding = '0px';
    this._divAnimationInfo.style.lineHeight = '14px';
    this._divAnimationInfo.style.fontFamily = '"Courier New", "Lucida Console", Monospace';
    this._divAnimationInfo.style.fontSize = '10px';
    _map.getBaseElement().append(this._divAnimationInfo);
    if (!$) { console.warn('WMJSAnimate: jquery is not defined, assuming unit test is running'); return; }
    $(this._divAnimationInfo).mouseout(() => {
      _map.mouseHoverAnimationBox = false;
    });
    _map.isAnimatingLoopRunning = false;
    this._map = _map;

    /* Bind */
    this._removeAllChilds = this._removeAllChilds.bind(this);
    this._drawAnimationBar = this._drawAnimationBar.bind(this);
    this._animate = this._animate.bind(this);
    this._animateLoop = this._animateLoop.bind(this);
    this.checkAnimation = this.checkAnimation.bind(this);
    this.stopAnimating = this.stopAnimating.bind(this);
    _map.stopAnimating = this.stopAnimating;
    _map.checkAnimation = this.checkAnimation;
  }

  _removeAllChilds (element) {
    try {
      if (element.hasChildNodes()) {
        while (element.childNodes.length >= 1) {
          element.removeChild(element.firstChild);
        }
      }
    } catch (e) {}
  }

  _drawAnimationBar (h) { };// drawAnimationBar

  _animate () {
    if (this._map.isAnimating === false) return;
    if (this._map.animateBusy === true) return;

    let animationStep = this._map.animationList[this._map.currentAnimationStep];
    if (!animationStep) {
      error('No animation step for ' + this._map.currentAnimationStep);
      return;
    }
    this._map.setDimension(animationStep.name, animationStep.value, false);
    this._callBack.triggerEvent('ondimchange');
    this._callBack.triggerEvent('onnextanimationstep', this._map);
    this._map._pdraw();
    this._map.animateBusy = false;
    // TODO: drawAnimationBar();
  };

  _animateLoop () {
    if (this._map.isAnimating === false) {
      this._map.isAnimatingLoopRunning = false;
      return;
    }


    let animationDelay = this._map.animationDelay;
    if (this._map.currentAnimationStep === 0) {
      animationDelay = animationDelay * 3;// 800;
    }
    if (this._map.currentAnimationStep === this._map.animationList.length - 1) {
      animationDelay = animationDelay * 5;// 800;
    }
    this._map.animationTimer.init(animationDelay, this._animateLoop);
    this.checkAnimation();


    if (this._map.mouseHoverAnimationBox === false) {
      this._animate();

      let nextStep = this._map.currentAnimationStep + 1;
      if (nextStep >= this._map.animationList.length) {
        nextStep = 0;
      }

      let continueAnimation = false;
      let numReady = 0;

      let animationStep = this._map.animationList[nextStep];
      this._map.setDimension(animationStep.name, animationStep.value, false);
      this._map.animationList[nextStep].requests = this._map.getWMSRequests();
      animationStep = this._map.animationList[this._map.currentAnimationStep];
      this._map.setDimension(animationStep.name, animationStep.value, false);
      for (let i = 0; i < this._map.animationList[nextStep].requests.length; i++) {
        let url = this._map.animationList[nextStep].requests[i];
        let image = this._map.getImageStore().getImageForSrc(url);
        if (image && image.isLoaded()) {
          numReady++;
        }
      }
      if (numReady === this._map.animationList[nextStep].requests.length) {
        continueAnimation = true;
      }

      if (continueAnimation) {
        this._map.currentAnimationStep = nextStep;
      }
    }
  };

  checkAnimation () {
    if (this._map.isAnimating === false) {
      this._map.isAnimatingLoopRunning = false;
      return;
    }
    if (!this._map.animationTimer) {
      this._map.animationTimer = new WMJSTimer();
    }
    // TODO: drawAnimationBar();
    if (this._map.mouseHoverAnimationBox === false) {
      let maxSimultaneousLoads = 4;
      let getNumImagesLoading = this._imageStore.getNumImagesLoading();
      if (getNumImagesLoading < maxSimultaneousLoads) {
        let numberPreCacheSteps = this._map.animationList.length;
        if (this._map.animationList.length > 0) {
          for (let j = 0; j < numberPreCacheSteps; j++) {
            let index = j + this._map.currentAnimationStep;
            while (index < 0)index += this._map.animationList.length;
            while (index >= this._map.animationList.length)index -= this._map.animationList.length;
            if (index < 0)index = 0;

            if (index >= 0) {
              let animationStep = this._map.animationList[index];

              this._map.setDimension(animationStep.name, animationStep.value, false);
              this._map.animationList[index].requests = this._map.getWMSRequests();

              animationStep = this._map.animationList[this._map.currentAnimationStep];

              this._map.setDimension(animationStep.name, animationStep.value, false);

              this._map.animationList[index].imagesInPrefetch = this._map.prefetch(this._map.animationList[index].requests);

              getNumImagesLoading += this._map.animationList[index].imagesInPrefetch.length;// imageStore.getNumImagesLoading();
              if (getNumImagesLoading > maxSimultaneousLoads - 1) break;
            }
          }
        }
      }
    }

    if (this._map.isAnimatingLoopRunning === false) {
      this._map.isAnimatingLoopRunning = true;
      this._animateLoop();
    }
  };

  stopAnimating () {
    if (this._map.isAnimating === false) return;
    this._map._animationList = undefined;
    this._divAnimationInfo.style.display = 'none';
    this._map.isAnimating = false;
    this._map.animateBusy = false;
    this._map.rebuildMapDimensions();
    this._callBack.triggerEvent('onstopanimation', this._map);
  };
};

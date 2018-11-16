export default class WMJSDebouncer {
  constructor () {
    this._isRunning = false;
    this._milliseconds = 10;
    this._stop = false;
    this.init = this.init.bind(this);
    this.stop = this.stop.bind(this);
  }
  init (ms, functionhandler) {
    this._stop = false;
    this._milliseconds = ms;
    if (this._milliseconds < 10) this._milliseconds = 50;
    if (this._isRunning === false) {
      self.setTimeout(() => {
        this._isRunning = false;
        if (this._stop === false) {
          functionhandler();
        }
      }, this._milliseconds);
      this._isRunning = true;
    }
  };

  stop () {
    this._stop = true;
  };
};

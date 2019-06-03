/*
 * Name        : WMJSListener
 * Description : Provides basic functionality for a callback mechanism
 * Author      : MaartenPlieger (plieger at knmi.nl)
 * Copyright KNMI
 */
class CallBackFunction {
  constructor () {
    this.name = undefined;
    this.functionpointer = undefined;
    this.finished = 0;
    this.keepOnCall = false;
  }
};

export default class WMJSListener {
  constructor () {
    this._callBacks = [];
    this._suspendedEvents = [];
    this.addToCallback = this.addToCallback.bind(this);
    this.removeEvents = this.removeEvents.bind(this);
    this.suspendEvent = this.suspendEvent.bind(this);
    this.resumeEvent = this.resumeEvent.bind(this);
    this.triggerEvent = this.triggerEvent.bind(this);
    this.destroy = this.destroy.bind(this);
  }
  /* Add multiple functions which will be called after the event with the same name is triggered */
  addToCallback (name, functionpointer, keepOnCall) {
    let cbp = -1; /* callbackpointer */
    if (!keepOnCall) {
      keepOnCall = false;
    }
    for (let j = 0; j < this._callBacks.length; j++) {
      // A callback list index pointer. if finished==1, then this index may be replaced by a new one.
      if (this._callBacks[j].finished === 1) { cbp = j; break; }
      // If the current callback already exist, we will simply keep it
      if (this._callBacks[j].name === name && this._callBacks[j].functionpointer === functionpointer) {
        // this._callBacks[j].timesAdded++;
        // console.log('listener already added: ', name);
        this._callBacks[j].keepOnCall = keepOnCall;
        return false;
      }
    }
    if (cbp === -1) {
      cbp = this._callBacks.length;
      this._callBacks.push(new CallBackFunction());
    } else {
      // console.log('replacing old unused listener: ', name);
    }
    this._callBacks[cbp].name = name;
    this._callBacks[cbp].functionpointer = functionpointer;
    this._callBacks[cbp].finished = 0;
    this._callBacks[cbp].keepOnCall = keepOnCall;
    return true;
  };

  removeEvents (name, f) {
    for (let j = 0; j < this._callBacks.length; j++) {
      if (this._callBacks[j].finished === 0) {
        if (this._callBacks[j].name === name) {
          if (!f) {
            this._callBacks[j].finished = 1;
          } else if (this._callBacks[j].functionpointer === f) {
            this._callBacks[j].finished = 1;
          }
        }
      }
    }
  };

  destroy () {
    this._callBacks.length = 0;
  }

  suspendEvent (name) {
    this._suspendedEvents[name] = true;
  };

  resumeEvent (name) {
    this._suspendedEvents[name] = false;
  };

  // Trigger an event with a name
  triggerEvent (name, param) {
    if (this._suspendedEvents[name] === true) {
      return;
    }
    let returnList = [];
    for (let j = 0; j < this._callBacks.length; j++) {
      if (this._callBacks[j].finished === 0) {
        if (this._callBacks[j].name === name) {
          if (this._callBacks[j].keepOnCall === false) {
            this._callBacks[j].finished = 1;
          }
          try {
            returnList.push(this._callBacks[j].functionpointer(param, this));
          } catch (e) {
            console.log('Error for event [' + name + ']: ', param, e);
          }
        }
      }
    }
    return returnList;
  };
};

import { WMJSDateOutSideRange, WMJSDateTooEarlyString, WMJSDateTooLateString, error } from './WMJSConstants.js';
import { isDefined } from './WMJSTools.js';
import { parseISO8601DateToDate, parseISO8601IntervalToDateInterval, ParseISOTimeRangeDuration } from './WMJSTime.js';
/**
  * WMJSDimension Class
  * Keep all information for a single dimension, like time.
  * Author : MaartenPlieger (plieger at knmi.nl)
   * Copyright KNMI
  */
export default class WMJSDimension {
  constructor (config) {
    this.name = undefined; // Name of the dimension, e.g. 'time'
    this.units = undefined; // Units of the dimension, e.g. 'ISO8601'
    this.values = undefined; // Values of the dimension, according to values defined in WMS specification, e.g. 2011-01-01T00:00:00Z/2012-01-01T00:00:00Z/P1M or list of values.
    this.currentValue = undefined; // The current value of the dimension, changed by setValue and read by getValue
    this.defaultValue = undefined;
    this.parentLayer = undefined;
    this.timeRangeDuration = undefined;
    this.linked = true;

    /* Private starts with _ */
    this._initialized = false;
    this._timeRangeDurationDate = null; // Used for timerange (start/stop/res)
    this._allDates = []; // Used for individual timevalues
    this._type = null; // Can be 'timestartstopres', 'timevalues' or 'anyvalue'
    this._allValues = [];

    /* Deprecated starts with __ */
    this.__setStartTime = this.__setStartTime.bind(this);

    this.generateAllValues = this.generateAllValues.bind(this);
    this.reInitializeValues = this.reInitializeValues.bind(this);
    this.initialize = this.initialize.bind(this);
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
    this.setClosestValue = this.setClosestValue.bind(this);
    this.getNextClosestValue = this.getNextClosestValue.bind(this);
    this.addTimeRangeDurationToValue = this.addTimeRangeDurationToValue.bind(this);
    this.setTimeRangeDuration = this.setTimeRangeDuration.bind(this);
    this.getClosestValue = this.getClosestValue.bind(this);
    this.getValueForIndex = this.getValueForIndex.bind(this);
    this.get = this.get.bind(this);
    this.getIndexForValue = this.getIndexForValue.bind(this);
    this.size = this.size.bind(this);
    this.clone = this.clone.bind(this);

    if (isDefined(config)) {
      if (isDefined(config.name)) { this.name = config.name; }
      if (isDefined(config.units)) { this.units = config.units; }
      if (isDefined(config.values)) { this.values = config.values; }
      if (isDefined(config.currentValue)) { this.currentValue = config.currentValue; }
      if (isDefined(config.defaultValue)) { this.defaultValue = config.defaultValue; }
      if (isDefined(config.parentLayer)) { this.parentLayer = config.parentLayer; }
      if (isDefined(config.linked)) { this.linked = config.linked; }
    }
  }

  generateAllValues () {
    const vals = [];
    if (this.size() > 5000) {
      throw new Error('Error: Dimension too large to query all possible values at once');
    }
    for (let i = 0; i < this.size(); i++) {
      vals.push(this.getValueForIndex(i));
    }
    return vals;
  }

  /* The setStartTime function set the first value of the dimension to given value
   * This is useful when a reference_time is used in combination with time.
   * By default the time values prior to the reference_time will not give valid results.
   * This function can be used to remove the first time values from the dimension by setting the start date
   * a bit later in time
   */
  __setStartTime (_val) {
    if (!this._initialized) {
      this.initialize();
    }
    let val = _val;
    if (!val || val.length === 0) {
      this.reInitializeValues(this.values);
      this.setClosestValue(true); /* TODO: Check, was timeDim. */
      console.log('returning');
      return;
    }
    val = parseISO8601DateToDate(val).toISO8601();
    if (this._type === 'timestartstopres') {
      let v = this.values;
      /* Adjust the first value for start/stop/res */
      let newValue = val + v.substring(v.indexOf('/'));
      this.reInitializeValues(newValue);
      this.setClosestValue();
    } else if (this._type === 'timevalues') {
      /* Filter all dates from the array which are lower than given start value */
      let newValue = parseISO8601DateToDate(val);
      let newArray = this._allDates.filter(function (x) {
        return x >= newValue;
      });
      let newValues = '';
      for (let j = 0; j < newArray.length; j++) {
        if (j > 0) newValues += ',';
        newValues += newArray[j].toISO8601();
      }
      this.reInitializeValues(newValues);
      this.setClosestValue();
    }
  }

  reInitializeValues (values) {
    this._initialized = false;
    this.initialize(values);
  }

  initialize (forceothervalues) {
    if (this._initialized === true) return;
    let ogcdimvalues = this.values;
    if (forceothervalues) {
      ogcdimvalues = forceothervalues;
    }
    if (!isDefined(ogcdimvalues)) return;
    this._allValues = [];
    this._initialized = true;
    if (this.units === 'ISO8601') {
      if (ogcdimvalues.indexOf('/') > 0) {
        this._type = 'timestartstopres';
        this._timeRangeDurationDate = new ParseISOTimeRangeDuration(ogcdimvalues);
      } else {
        // TODO Parse 2007-03-27T00:00:00.000Z/2007-03-31T00:00:00.000Z/PT1H,2007-04-07T00:00:00.000Z/2007-04-11T00:00:00.000Z/PT1H
        this._type = 'timevalues';
      }
    } else {
      this._type = 'anyvalue';
      this.linked = false;
    }
    if (this._type !== 'timestartstopres') {
      let values = ogcdimvalues.split(',');
      for (let j = 0; j < values.length; j++) {
        let valuesRanged = values[j].split('/');
        if (valuesRanged.length === 3) {
          let start = parseFloat(valuesRanged[0]);
          let stop = parseFloat(valuesRanged[1]);
          let res = parseFloat(valuesRanged[2]);
          stop += res;
          if (start > stop)stop = start;
          if (res <= 0)res = 1;
          for (let j = start; j < stop; j = j + res) {
            this._allValues.push(j);
          }
        } else {
          this._allValues.push(values[j]);
        }
      }

      if (this._type === 'timevalues') {
        for (let j = 0; j < this._allValues.length; j++) {
          this._allDates[j] = parseISO8601DateToDate(this._allValues[j]);
        }
      }
    }

    if (!isDefined(this.defaultValue)) {
      this.defaultValue = this.getValueForIndex(0);
    }
    if (!isDefined(this.currentValue)) {
      this.currentValue = this.getValueForIndex(0);
    }

    this.dimMinValue = this.getValueForIndex(0);
    this.dimMaxValue = this.getValueForIndex(this.size() - 1);
  }

  /**
    * Returns the current value of this dimensions
    */
  getValue () {
    if (!this._initialized) {
      this.initialize();
    }
    let value = this.defaultValue;
    if (isDefined(this.currentValue)) {
      value = this.currentValue;
    }
    value = this.addTimeRangeDurationToValue(value);
    return value;
  };

  /**
    * Set current value of this dimension
    */
  setValue (value) {
    if (!this._initialized) {
      this.initialize();
    }

    if (value === WMJSDateOutSideRange ||
        value === WMJSDateTooEarlyString ||
        value === WMJSDateTooLateString) {
      return;
    }
    this.currentValue = value;
  };

  setClosestValue (newValue, evenWhenOutsideRange) {
    if (!newValue) {
      newValue = this.getValue();
      evenWhenOutsideRange = true;
    }
    this.currentValue = this.getClosestValue(newValue, evenWhenOutsideRange);
  };

  getNextClosestValue (newValue) {
    let closestValue = this.getClosestValue(newValue);
    let index = this.getIndexForValue(closestValue);
    let nextValue = this.getValueForIndex(index + 1);
    // Only return future dates
    if (!nextValue || nextValue === 'date too early' || moment(newValue) >= moment(nextValue)) {
      return null;
    }
    return nextValue;
  };

  addTimeRangeDurationToValue (value) {
    if (value === WMJSDateOutSideRange ||
      value === WMJSDateTooEarlyString ||
      value === WMJSDateTooLateString) {
      return value;
    }
    if (this.timeRangeDuration && this.timeRangeDuration.length > 0) {
      let interval = parseISO8601IntervalToDateInterval(this.timeRangeDuration);
      let value2date = parseISO8601DateToDate(value);
      value2date.add(interval);
      let value2 = value2date.toISO8601();
      return value + '/' + value2;
    }
    return value;
  }

  setTimeRangeDuration (duration) {
    this.timeRangeDuration = duration;
    if (duration && duration.length > 0) {
      this.reInitializeValues(this.values);
      let startDate = parseISO8601DateToDate(this.dimMinValue);
      let stopDate = (this.dimMaxValue);
      let interval = parseISO8601IntervalToDateInterval(this.timeRangeDuration);
      if (interval.second !== 0) startDate.setUTCSeconds(0);
      if (interval.minute !== 0) { startDate.setUTCSeconds(0); startDate.setUTCMinutes(0); }
      if (interval.hour !== 0) { startDate.setUTCSeconds(0); startDate.setUTCMinutes(0); startDate.setUTCSHours(0); }
      if (interval.day !== 0) { startDate.setUTCSeconds(0); startDate.setUTCMinutes(0); startDate.setUTCSHours(0); startDate.setUTCDate(0); }
      if (interval.month !== 0) { startDate.setUTCSeconds(0); startDate.setUTCMinutes(0); startDate.setUTCSHours(0); startDate.setUTCDate(0); }
      this.reInitializeValues(startDate.toISO8601() + '/' + stopDate + '/' + this.timeRangeDuration);
    } else {
      this.reInitializeValues(this.values);
    }
  };

  getClosestValue (newValue, evenWhenOutsideRange) {
    if (newValue && newValue.indexOf('/') !== -1) {
      newValue = newValue.split('/')[0];
    }
    evenWhenOutsideRange = typeof evenWhenOutsideRange !== 'undefined' ? evenWhenOutsideRange : false;
    let index = -1;
    let _value = WMJSDateOutSideRange;
    try {
      index = this.getIndexForValue(newValue);
      _value = this.getValueForIndex(index);
    } catch (e) {
      if (typeof (e) === 'number') {
        if (e === 0)_value = WMJSDateTooEarlyString; else _value = WMJSDateTooLateString;
      }
    }

    if (newValue === 'current' || newValue === 'default' || newValue === '') {
      _value = this.defaultValue;
    } else if (newValue === 'latest' || (evenWhenOutsideRange && _value === WMJSDateTooLateString)) {
      _value = this.getValueForIndex(this.size() - 1);
    } else if (newValue === 'earliest' || (evenWhenOutsideRange && _value === WMJSDateTooEarlyString)) {
      _value = this.getValueForIndex(0);
    } else if (newValue === 'middle') {
      let middleIndex = (this.size() / 2) - 1;
      if (middleIndex < 0) middleIndex = 0;
      _value = this.getValueForIndex(middleIndex);
    }
    // alert(_value);
    return _value;
  };

  /**
    * Get dimension value for specified index
    */
  getValueForIndex (index) {
    this.initialize();
    if (index < 0) {
      if (index === -1) {
        return WMJSDateTooEarlyString;
      }
      if (index === -2) {
        return WMJSDateTooLateString;
      }
      return -1;
    }
    if (this._type === 'timestartstopres') {
      try {
        return this._timeRangeDurationDate.getDateAtTimeStep(index).toISO8601();
      } catch (e) {}
      return this._timeRangeDurationDate.getDateAtTimeStep(index);
    }
    if (this._type === 'timevalues') return this._allValues[index];
    if (this._type === 'anyvalue') return this._allValues[index];
  };

  /**
    * same as getValueForIndex
    */
  get (index) {
    return this.getValueForIndex(index);
  };

  /**
    * Get index value for specified value. Returns the index in the store for the given time value, either a date or a iso8601 string can be passes as input.
    * @param value Either a JS Date object or an ISO8601 String
    * @return The index of the value.  If outSideOfRangeFlag is false, a valid index will
    * always be returned. If outSideOfRangeFlag is true: -1 if the index is not in the store,
    * but is lower than available values, -2 if the index is not in store, but is higher than available values
    */
  getIndexForValue (value, outSideOfRangeFlag) {
    this.initialize();
    if (!isDefined(outSideOfRangeFlag))outSideOfRangeFlag = true;
    if (typeof (value) === 'string') {
      if (value === 'current' && this.defaultValue !== 'current') {
        return this.getIndexForValue(this.defaultValue);
      }
    }

    if (this._type === 'timestartstopres') {
      try {
        if (typeof (value) === 'string') {
          return this._timeRangeDurationDate.getTimeStepFromISODate(value, outSideOfRangeFlag);
        }
        return this._timeRangeDurationDate.getTimeStepFromDate(value, outSideOfRangeFlag);
      } catch (e) {
        // error("WMSJDimension::getIndexForValue,1: "+e);
        if (parseInt(e) === 0) return -1; else return -2;
      }
    }
    if (this._type === 'timevalues') {
      try {
        let dateToFind = parseISO8601DateToDate(value).getTime();
        let minDistance;
        let foundIndex = 0;
        for (let j = 0; j < this._allValues.length; j++) {
          let distance = (this._allDates[j].getTime() - dateToFind);
          if (distance < 0)distance = -distance;
          // debug(j+" = "+distance+" via "+allDates[j].getTime()+" and "+dateToFind);
          if (j === 0)minDistance = distance;
          if (distance < minDistance) {
            minDistance = distance;
            foundIndex = j;
          }
        }
        return foundIndex;
      } catch (e) {
        error('WMSJDimension::getIndexForValue,2: ' + e);
        return -1;
      }

      /* let dateToFind = parseISO8601DateToDate(value).getTime();
      allValues[j]
      let max = allValues.length-1;
      let min = 0;

      let average = parseInt((max-min)/2); */
    }

    if (this._type === 'anyvalue') {
      for (let j = 0; j < this._allValues.length; j++) {
        if (this._allValues[j] === value) return j;
      }
    }

    return -1;
  }

  /**
    * Get number of values
    */
  size () {
    this.initialize();
    if (this._type === 'timestartstopres') return this._timeRangeDurationDate.getTimeSteps();
    if (this._type === 'timevalues' || this._type === 'anyvalue') {
      return this._allValues.length;
    }
  }

  /**
   * Clone this dimension
   */
  clone () {
    let dim = new WMJSDimension();
    dim.name = this.name;
    dim.units = this.units;
    dim.values = this.values;
    dim.initialize();
    dim.currentValue = this.currentValue;
    dim.defaultValue = this.defaultValue;
    dim.parentLayer = this.parentLayer;
    dim.linked = this.linked;
    return dim;
  }
};

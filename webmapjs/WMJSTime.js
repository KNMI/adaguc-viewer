import { isDefined } from './WMJSTools.js';

// ============================================================================
// Name        : ISO8601_datefunctions.js
// Author      : MaartenPlieger (plieger at knmi.nl)
// Version     : 3.2.0 (September 2018)
// Description : Functions to calculate with ISO8601 dates in javascript
// ============================================================================

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

/***************************************************/
/* Object to store a time duration / time interval */
/***************************************************/
export class DateInterval {
  constructor (year, month, day, hour, minute, second) {
    this.year = parseInt(year);
    this.month = parseInt(month);
    this.day = parseInt(day);
    this.hour = parseInt(hour);
    this.minute = parseInt(minute);
    this.second = parseInt(second);
    this.isRegularInterval = false;
    if (this.month === 0 && this.year === 0) this.isRegularInterval = true;
    this.getTime = this.getTime.bind(this);
    this.toISO8601 = this.toISO8601.bind(this);
  }
  getTime () {
    let timeres = 0;
    /* Months and years are unequally distributed in time
       So get time is not possible */
    if (this.month !== 0) throw new Error('month !== 0');
    if (this.year !== 0) throw new Error('year !== 0');
    timeres += this.day * 60 * 60 * 24;
    timeres += this.hour * 60 * 60;
    timeres += this.minute * 60;
    timeres += this.second;
    timeres *= 1000;
    return timeres;
  };
  toISO8601 () {
    let isoTime = 'P';
    if (this.year !== 0)isoTime += this.year + 'Y';
    if (this.month !== 0)isoTime += this.month + 'M';
    if (this.day !== 0)isoTime += this.day + 'D';
    if (this.hour !== 0 && this.minute !== 0 && this.second !== 0) { isoTime += 'T'; }
    if (this.hour !== 0)isoTime += this.hour + 'H';
    if (this.minute !== 0)isoTime += this.minute + 'M';
    if (this.second !== 0)isoTime += this.second + 'S';
    return isoTime;
  };
};

/****************************************************/
/* Parses ISO8601 times to a Javascript Date Object */
/****************************************************/
export const parseISO8601DateToDate = (_isotime) => {
  /*
  The following functions are added to the standard Date object:
    - add(dateInterval) adds a DateInterval time to this time
    - substract(dateInterval) substracts a DateInterval time to this time
    - toISO8601() returns the date object as iso8601 string
    - clone() creates a copy of this object
  */
  let isotime = _isotime;
  if (!isotime) {
    console.log('Warning: no date given to parseISO8601DateToDate');
    return;
  }

  // let isotime = "2009--03-27T13:-5:00Z"
  // console.log(isotime);

  let splittedOnT = isotime.split('T');

  splittedOnT[0] = splittedOnT[0].replace(/-/g, ':');
  splittedOnT[0] = splittedOnT[0].replace(/::/g, ':-');
  let left = splittedOnT[0].split(':');
  let right = splittedOnT[1].split(':');
  let date = new Date(Date.UTC(left[0], left[1] - 1, left[2], right[0], right[1], right[2].split('Z')[0]));

  date.add = function (dateInterval) {
    if (dateInterval.isRegularInterval === false) {
      if (dateInterval.year !== 0) this.setUTCFullYear(this.getUTCFullYear() + dateInterval.year);
      if (dateInterval.month !== 0) this.setUTCMonth(this.getUTCMonth() + dateInterval.month);
      if (dateInterval.day !== 0) this.setUTCDate(this.getUTCDate() + dateInterval.day);
      if (dateInterval.hour !== 0) this.setUTCHours(this.getUTCHours() + dateInterval.hour);
      if (dateInterval.minute !== 0) this.setUTCMinutes(this.getUTCMinutes() + dateInterval.minute);
      if (dateInterval.second !== 0) this.setUTCSeconds(this.getUTCSeconds() + dateInterval.second);
    } else {
      this.setTime(this.getTime() + dateInterval.getTime());
    }
  };
  date.substract = function (dateInterval) {
    if (dateInterval.isRegularInterval === false) {
      if (dateInterval.year !== 0) this.setUTCFullYear(this.getUTCFullYear() - dateInterval.year);
      if (dateInterval.month !== 0) this.setUTCMonth(this.getUTCMonth() - dateInterval.month);
      if (dateInterval.day !== 0) this.setUTCDate(this.getUTCDate() - dateInterval.day);
      if (dateInterval.hour !== 0) this.setUTCHours(this.getUTCHours() - dateInterval.hour);
      if (dateInterval.minute !== 0) this.setUTCMinutes(this.getUTCMinutes() - dateInterval.minute);
      if (dateInterval.second !== 0) this.setUTCSeconds(this.getUTCSeconds() - dateInterval.second);
    } else {
      this.setTime(this.getTime() - dateInterval.getTime());
    }
  };
  date.addMultipleTimes = function (dateInterval, numberOfSteps) {
    if (dateInterval.isRegularInterval === false) {
      if (dateInterval.year !== 0) this.setUTCFullYear(this.getUTCFullYear() + dateInterval.year * numberOfSteps);
      if (dateInterval.month !== 0) this.setUTCMonth(this.getUTCMonth() + dateInterval.month * numberOfSteps);
      if (dateInterval.day !== 0) this.setUTCDate(this.getUTCDate() + dateInterval.day * numberOfSteps);
      if (dateInterval.hour !== 0) this.setUTCHours(this.getUTCHours() + dateInterval.hour * numberOfSteps);
      if (dateInterval.minute !== 0) this.setUTCMinutes(this.getUTCMinutes() + dateInterval.minute * numberOfSteps);
      if (dateInterval.second !== 0) this.setUTCSeconds(this.getUTCSeconds() + dateInterval.second * numberOfSteps);
    } else {
      this.setTime(this.getTime() + dateInterval.getTime() * numberOfSteps);
    }
  };
  date.substractMultipleTimes = function (dateInterval, numberOfSteps) {
    if (dateInterval.isRegularInterval === false) {
      if (dateInterval.year !== 0) this.setUTCFullYear(this.getUTCFullYear() - dateInterval.year * numberOfSteps);
      if (dateInterval.month !== 0) this.setUTCMonth(this.getUTCMonth() - dateInterval.month * numberOfSteps);
      if (dateInterval.day !== 0) this.setUTCDate(this.getUTCDate() - dateInterval.day * numberOfSteps);
      if (dateInterval.hour !== 0) this.setUTCHours(this.getUTCHours() - dateInterval.hour * numberOfSteps);
      if (dateInterval.minute !== 0) this.setUTCMinutes(this.getUTCMinutes() - dateInterval.minute * numberOfSteps);
      if (dateInterval.second !== 0) this.setUTCSeconds(this.getUTCSeconds() - dateInterval.second * numberOfSteps);
    } else {
      this.setTime(this.getTime() - dateInterval.getTime() * numberOfSteps);
    }
  };

  date.toISO8601 = function () {
    function prf (input, width) {
      // print decimal with fixed length (preceding zero's)
      let string = input + '';
      let len = width - string.length;
      let j;
      let zeros = '';
      for (j = 0; j < len; j++)zeros += '0' + zeros;
      string = zeros + string;
      return string;
    }
    let iso = prf(this.getUTCFullYear(), 4) +
        '-' + prf(this.getUTCMonth() + 1, 2) +
            '-' + prf(this.getUTCDate(), 2) +
                'T' + prf(this.getUTCHours(), 2) +
                    ':' + prf(this.getUTCMinutes(), 2) +
                        ':' + prf(this.getUTCSeconds(), 2) + 'Z';
    return iso;
  };
  date.clone = function () {
    return parseISO8601DateToDate(date.toISO8601());
  };
  return date;
};

/*********************************************************/
/* Parses ISO8601 time duration to a DateInterval Object */
/*********************************************************/
export const parseISO8601IntervalToDateInterval = (isotime) => {
  if (isotime.charAt(0) === 'P') {
    let splittedOnT = isotime.split('T');
    let years = 0;
    let months = 0;
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let YYYYMMDDPart = splittedOnT[0].split('P')[1];

    // Parse the left part
    if (YYYYMMDDPart) {
      let yearIndex = YYYYMMDDPart.indexOf('Y');
      let monthIndex = YYYYMMDDPart.indexOf('M');
      let dayIndex = YYYYMMDDPart.indexOf('D');
      if (yearIndex !== -1) {
        years = (YYYYMMDDPart.substring(0, yearIndex));
      }
      if (monthIndex !== -1) {
        months = (YYYYMMDDPart.substring(yearIndex + 1, monthIndex));
      }
      if (dayIndex !== -1) {
        let start = yearIndex;
        if (monthIndex !== -1)start = monthIndex;
        days = (YYYYMMDDPart.substring(start + 1, dayIndex));
      }
    }
    // parse the right part

    if (splittedOnT.length > 0) {
      if (isDefined(splittedOnT[1])) {
        let HHMMSSPart = splittedOnT[1];
        if (HHMMSSPart) {
          let hourIndex = HHMMSSPart.indexOf('H');
          let minuteIndex = HHMMSSPart.indexOf('M');
          let secondIndex = HHMMSSPart.indexOf('S');
          if (hourIndex !== -1) {
            hours = (HHMMSSPart.substring(0, hourIndex));
          }
          if (minuteIndex !== -1) {
            minutes = (HHMMSSPart.substring(hourIndex + 1, minuteIndex));
          }
          if (secondIndex !== -1) {
            let start = hourIndex;
            if (minuteIndex !== -1)start = minuteIndex;
            seconds = (HHMMSSPart.substring(start + 1, secondIndex));
          }
        }
      }
    }

    // Assemble the dateInterval object
    let dateInterval = new DateInterval(years, months, days, hours, minutes, seconds);
    return dateInterval;
  }
};

/**********************************************************/
/* Calculates the number of time steps with this interval */
/**********************************************************/
function getNumberOfTimeSteps (starttime /* Date */, stoptime /* Date */, interval /* DateInterval */) {
  let steps = 0;
  if (interval.month !== 0 || interval.year !== 0) {
    // In case of unequally distributed time steps, where the number of days leties within a month:
    let testtime = starttime.clone();
    let timestopms = stoptime.getTime();
    while (testtime.getTime() < timestopms) {
      testtime.add(interval);
      steps++;
    };
    steps++;
    return steps;
  } else {
    // In case of equally distributed time steps
    steps = parseInt(((stoptime.getTime() - starttime.getTime()) / interval.getTime()) + 0.5) + 1;

    return steps;
  }
}

// Takes "1999-01-01T00:00:00Z/2009-12-01T00:00:00Z/PT60S" as input
export class ParseISOTimeRangeDuration {
  constructor (isoTimeRangeDuration) {
    let times = isoTimeRangeDuration.split('/');
    // let timeStepDateArray = [];
    // Some safety checks
    if (times[2] === undefined)times[2] = 'PT1M';
    if (times[1] === undefined) { times[1] = times[0]; times[2] = 'PT1M'; }
    // Convert the dates
    this.startTime = parseISO8601DateToDate(times[0]);
    this.stopTime = parseISO8601DateToDate(times[1]);
    this.timeInterval = parseISO8601IntervalToDateInterval(times[2]);
    // Calculate the number if steps
    this.timeSteps = getNumberOfTimeSteps(this.startTime, this.stopTime, this.timeInterval);

    this.getTimeSteps = this.getTimeSteps.bind(this);
    this.getDateAtTimeStep = this.getDateAtTimeStep.bind(this);
    this.getTimeStepFromISODate = this.getTimeStepFromISODate.bind(this);
    this.getTimeStepFromDate = this.getTimeStepFromDate.bind(this);
    this.getTimeStepFromDateWithinRange = this.getTimeStepFromDateWithinRange.bind(this);
    this.getTimeStepFromDateClipped = this.getTimeStepFromDateClipped.bind(this);
  }
  getTimeSteps () {
    return this.timeSteps;
  };
  getDateAtTimeStep (currentStep) {
    if (this.timeInterval.isRegularInterval === false) {
      let temptime = this.startTime.clone();
      temptime.addMultipleTimes(this.timeInterval, currentStep);
      return temptime;
    } else {
      let temptime = this.startTime.clone();
      let dateIntervalTime = this.timeInterval.getTime();
      dateIntervalTime *= currentStep;
      temptime.setTime(temptime.getTime() + dateIntervalTime);
      return temptime;
    }
  }
  getTimeStepFromISODate (currentISODate, throwIfOutsideRange) {
    let currentDate = null;
    try {
      currentDate = parseISO8601DateToDate(currentISODate);
    } catch (e) {
      throw new Error('The date ' + currentISODate + ' is not a valid date');
    }
    return this.getTimeStepFromDate(currentDate, throwIfOutsideRange);
  };

  /* Calculates the time step at the given date  */
  getTimeStepFromDate (currentDate, throwIfOutsideRange) {
    if (!throwIfOutsideRange)throwIfOutsideRange = false;

    let currentDateTime = currentDate.getTime();
    if (currentDateTime < this.startTime.getTime()) {
      if (throwIfOutsideRange === true) {
        throw new Error(0);
      }
      return 0;
    }
    let myStopTime = this.stopTime.clone();
    myStopTime.add(this.timeInterval);

    if (currentDateTime >= myStopTime.getTime()) {
      if (throwIfOutsideRange === true) {
        throw new Error(this.timeSteps - 1);
      }
      return this.timeSteps - 1;
    }
    if (currentDateTime > this.stopTime.getTime()) return this.timeSteps - 1;
    let timeStep = 0;
    if (this.timeInterval.isRegularInterval === false) {
      let temptime = this.startTime.clone();
      for (let j = 0; j < this.timeSteps; j++) {
        let temptimeTime = temptime.getTime();
        temptime.add(this.timeInterval);
        let temptimeTimeIsOneStepFurther = temptime.getTime();
        if (currentDateTime >= temptimeTime && currentDateTime < temptimeTimeIsOneStepFurther) return j;
      }
      throw new Error('Date ' + currentDate.toISO8601() + ' not found!');
    } else {
      timeStep = (currentDate.getTime() - this.startTime.getTime()) / this.timeInterval.getTime();
      timeStep = parseInt(timeStep);
      return timeStep;
    }
    // throw new Error('Date ' + currentDate.toISO8601() + ' not found');
  }
  /* Returns the timestep at the currentDate, if currentdate is outside the range,
  a exception is thrown.  */
  getTimeStepFromDateWithinRange (currentDate) {
    return this.getTimeStepFromDate(currentDate, true);
  };
  /* Returns the timestep at the currentDate, if currentdate is outside the range,
  a minimum or maximum step which lies within the time range is returned.  */
  getTimeStepFromDateClipped (currentDate) {
    return this.getTimeStepFromDate(currentDate, false);
  }
};

export const getCurrentDateIso8601 = () => {
  let d = new Date();
  return parseISO8601DateToDate(d.toISOString().substring(0, 19) + 'Z');
};

/* Example:
function init(){
  let isodate="1999-01-01T00:00:00Z/2009-12-01T00:00:00Z/PT60S";
  //Split on '/'
  let times=isodate.split('/');
  //Some safety checks
  if(times[1]==undefined){times[1]=times[0];times[2]='PT1M';}
  //Convert the dates
  starttime=parseISO8601DateToDate(times[0]);
  stoptime=parseISO8601DateToDate(times[1]);
  interval=parseISO8601IntervalToDateInterval(times[2]);
  //Calculate the number if steps
  steps=getNumberOfTimeSteps(starttime,stoptime,interval);
}
*/

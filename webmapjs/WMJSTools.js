// ============================================================================
// Name        : WMJSTools
// Author      : MaartenPlieger (plieger at knmi.nl)
// Version     : 3.2.0 (September 2018)
// Description : WMJSTools provides a set of useful JS functions
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

// ============================================================================
// Name        : tools
// Author      : MaartenPlieger (plieger at knmi.nl)
// Version     : 0.5 (September 2010)
// Description : All kinds of small usable functions
// ============================================================================

/**
  * Checks if variable is defined or not
  * @param variable The variable to check
  * @returns true if variable is indeed defined, otherwise false.
  */
export const isDefined = (variable) => {
  if (typeof variable === 'undefined') {
    return false;
  }
  return true;
};

/**
 * Checks if a variable is null or not
 * @param variable The variable to check
 * @returns true if variable is indeed null, otherwise false.
*/
export const isNull = (variable) => {
  if (variable === null) {
    return true;
  }
  return false;
};

/**
 * Converts a variable to an array. If the variable is not an array it will be pushed to
 * as the first entry in a new array. If the variable is already an array, nothing will  be done.
 * @param array The variable to convert
 * @returns Always an array
 */
export const toArray = (array) => {
  if (!array) return [];
  if (array.length) {
    return array;
  } else {
    var newArray = [];
    newArray[0] = array;
    return newArray;
  }
};

/**
  * Function which checks wether URL contains a ? token. If not, it is assumed that this token was not provided by the user,
  * manually add the token later.
  * @param url The URL to check
  * @return the fixed URL
  */
export const WMJScheckURL = function (url) {
  if (!isDefined(url)) return '?';
  url = url.trim();
  if (url.indexOf('?') === -1) {
    url += '?';
  }
  return url;
};

/**
* A normal unordered set, e.g. a list containing no duplicates.
*/
var WMJSSet = function () {};
WMJSSet.prototype.add = function (o) { this[o] = true; };
WMJSSet.prototype.remove = function (o) { delete this[o]; };

/**
 * Splits a url into key value pairs.
 */
export class WMJSKVP {
  constructor (query) {
    this.kvplist = [];
    this.kvplist = this._parse(query);
    return this.kvplist;
  }
  _parse (query) {
    var kvplist = [];
    var splittedKVP = query.split('&');
    if (splittedKVP) {
      for (var kvpkey in splittedKVP) {
        var kvp = splittedKVP[kvpkey];
        var kvps = kvp.split('=');
        if (kvps.length === 2) {
          var key = kvps[0];
          var value = kvps[1];
          if (!(kvplist[key] instanceof Array))kvplist[key] = [];
          kvplist[key].push(value);
        }
      }
    }
    return kvplist;
  }
  getKeys () {
    var keys = new WMJSSet();
    for (let key in this.kvplist) {
      keys.add(key);
    }
    return keys;
  }
  getValues (key) {
    return this.kvplist[key];
  }
  getKeyValues () {
    return this.kvplist;
  }
};

export const preventdefaultEvent = (e) => {
  var event = e || window.event;
  if (event.preventDefault) { // Firefox
    event.preventDefault();
  } else { // IE
    event.returnValue = false;
  }
};

export const attachEvent = (obj, evType, fn) => {
  if (!obj) return;
  // Attach event that works on all browsers
  if (evType == 'mousewheel') {
    function wheel (event, handler) {
      var delta = 0;
      if (!event) { /* For IE. */
        event = window.event;
        window.event.cancelBubble = true;
        window.event.returnValue = false;
      }

      if (event.wheelDelta) { /* IE/Opera. */
        delta = event.wheelDelta / 120;
      } else if (event.detail) { /** Mozilla case. */
        /** In Mozilla, sign of delta is different than in IE.
        * Also, delta is multiple of 3.
        */
        delta = -event.detail / 3;
      }
      /** If delta is nonzero, handle it.
        * Basically, delta is now positive if wheel was scrolled up,
        * and negative, if wheel was scrolled down.
        */
      if (delta) { handler(delta); }
      /** Prevent default actions caused by mouse wheel.
        * That might be ugly, but we handle scrolls somehow
        * anyway, so don't bother here..
        */
      if (event.preventDefault) { event.preventDefault(); }
      event.returnValue = false;
    }
    if (obj.addEventListener) { obj.addEventListener('DOMMouseScroll', function (e) { wheel(e, fn); }, false); }
    obj.onmousewheel = document.onmousewheel = function (e) { wheel(e, fn); };
    return;
  }

  if (browser.isNS) {
    obj.addEventListener(evType, fn, true);
  } else {
    obj.attachEvent(('on' + evType), fn);
    if (window.event == undefined) return;
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
};

export const deleteEvent = (obj, eventId, funct) => {
  var flag = true; if (browser.isOP) { flag = false; }
  if (obj.removeEventListener) {
    obj.removeEventListener(eventId, funct, flag);
  } else if (obj.detachEvent) {
    obj.detachEvent(eventId, funct);
    obj.detachEvent('on' + eventId, funct);
  }
};
export const getMouseXCoordinate = (event) => {
  let myX;
  if (browser.isNS) {
    myX = event.clientX + window.scrollX;
  } else {
    myX = window.event.clientX + document.documentElement.scrollLeft +
         document.body.scrollLeft;
  }
  return myX;
};

export const getMouseYCoordinate = (event) => {
  let myY;
  if (browser.isNS) {
    myY = event.clientY + window.scrollY;
  } else {
    myY = window.event.clientY + document.documentElement.scrollTop +
         document.body.scrollTop;
  }
  return myY;
};

var findElementPos = function (obj) {
  var el = obj;
  var curleft = curtop = 0;
  while (obj) {
    curleft += obj.offsetLeft;
    curtop += obj.offsetTop;
    obj = obj.offsetParent;
  }
  return [curleft, curtop, parseInt(el.style.width + curleft), parseInt(el.style.height + curtop)];
};

function Browser () {
  var ua, s, i;
  this.isIE = false;
  this.isNS = false;
  this.isOP = false;
  this.isKonqueror = false;
  this.name = navigator.appName;
  this.version = null;

  ua = navigator.userAgent;
  if ((navigator.userAgent).indexOf('Opera') != -1) {
    this.isOP = true;
  } else
  if (navigator.appName == 'Netscape' || navigator.appName == 'Konqueror') {
    this.isNS = true;
    this.isKonqueror = true;
  } else
  if ((navigator.appName).indexOf('Microsoft') != -1) {
    this.isIE = true;
  }
}
var browser = new Browser();

function IsNumeric (sText) {
  var ValidChars = '0123456789.';
  var IsNumber = true;
  var Char;
  for (i = 0; i < sText.length && IsNumber == true; i++) {
    Char = sText.charAt(i);
    if (ValidChars.indexOf(Char) == -1) {
      IsNumber = false;
    }
  }
  return IsNumber;
}

function dump (arr, level, path) {
  var dumped_text = '';
  if (!path)path = '';
  if (!level) level = 0;
  var level_padding = path;
  if (typeof (arr) === 'object') { // Array/Hashes/Objects
    for (var item in arr) {
      var value = arr[item];
      var newpath = path;
      if (IsNumeric(item)) {
        item = '[' + item + ']';
        newpath = path.substr(0, path.length - 1) + item;
      } else {
        newpath = path + item;
      }
      if (typeof (value) === 'object') { // If it is an array,
        //         dumped_text += newpath + "=object<br>\n";
        dumped_text += dump(value, level + 1, newpath + '.');
      } else {
        dumped_text += newpath + '="' + value + '"<br>\n';
      }
    }
  } else { // Stings/Chars/Numbers etc.
    dumped_text = '===>' + arr + '<===(' + typeof (arr) + ')';
  }
  return dumped_text;
}

var Url = {

  // public method for url encoding
  encode : function (string) {
    return escape(this._utf8_encode(string));
  },

  // public method for url decoding
  decode : function (string) {
    alert('Deprecated function !!! WMJSTools line 325 with [' + string + ']');
    return this._utf8_decode(unescape(string));
  },

  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
    string = string.replace(/\r\n/g, '\n');
    var utftext = '';

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
    var string = '';
    var i = 0;
    var c = c1 = c2 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }

    return string;
  }

};

// ============================================================================
// Name        : HTTP_RequestFunctions.js
// Author      : MaartenPlieger (plieger at knmi.nl)
// Version     : 0.5 (September 2010)
// Description : Functions to make HTTP requests
// ============================================================================

function createXHR () {
  try { return new XMLHttpRequest(); } catch (e) {}
  try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch (e) {}
  try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch (e) {}
  try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch (e) {}
  try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch (e) {}
  return false;
}

function MakeJSONRequest (fname, callbackfunction, errorfunction, pointer, useredirect) {
  if (fname.indexOf('?') == -1) {
    fname += '?';
  } else {
    fname += '&';
  }
  fname += 'rand=' + Math.random();
  function requestError (errorMessage) {
    if (errorfunction)errorfunction(errorMessage, pointer);
    else callbackfunction(undefined, pointer);
  }

  function redirRequest () {
    // Let try an alternative way: redirect using PHP
    if (useredirect == false) {
      fname = requestProxy + 'REQUEST=' + URLEncode(fname);
      MakeJSONRequest(fname, callbackfunction, errorfunction, pointer, true);
    } else {
      requestError('status(' + xhr.status + ') to ' + fname);
    }
  }
  if (!useredirect)useredirect = false;
  try {
    var xhr = createXHR();
    xhr.open('GET', fname, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          try {
            var data = eval('(' + xhr.responseText + ')');
          } catch (err) {
            requestError("Invalid JSON: '" + xhr.responseText + "'");
            return;
          }
          if (data == undefined) {
            requestError('request returned no data:' + fname);
          } else {
            callbackfunction(data, pointer);
          }
        } else {
          redirRequest();
        }
      }
    };
    xhr.send(null);
  } catch (err) {
    redirRequest();
  }
}

export const MakeHTTPRequest = (fname, callbackfunction, errorfunction, pointer, useredirect, requestProxy) => {
  if (fname.indexOf('?') === -1) {
    fname += '?';
  } else {
    fname += '&';
  }
  fname += 'rand=' + Math.random();
  function requestError (errorMessage) {
    if (errorfunction)errorfunction(errorMessage, pointer);
    else callbackfunction(undefined, pointer);
  }
  function redirRequest () {
    // Let try an alternative way: redirect using PHP
    if (useredirect === false) {
      // alert(fname);
      fname = requestProxy + 'REQUEST=' + URLEncode(fname);
      // alert(fname);
      MakeHTTPRequest(fname, callbackfunction, errorfunction, pointer, true, requestProxy);
    } else {
      requestError('status(' + xhr.status + ') to ' + fname);
    }
  }
  if (!useredirect)useredirect = false;
  try {
    var xhr = createXHR();
    xhr.open('GET', fname, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            var data = xhr.responseText;
          } catch (err) {
            requestError('Exception occured:' + err);
            return;
          }
          if (data === undefined || data === '') {
            requestError('request returned no data');
          } else {
            callbackfunction(data, pointer);
          }
        } else {
          redirRequest();
        }
      }
    };
    xhr.send(null);
  } catch (err) {
    redirRequest();
  }
};

export const URLDecode = (encodedURL) => {
  if (!isDefined(encodedURL)) return '';
  encodedURL = encodedURL.replaceAll('+', ' ');
  encodedURL = encodedURL.replaceAll('%2B', '+');
  encodedURL = encodedURL.replaceAll('%20', ' ');
  encodedURL = encodedURL.replaceAll('%5E', '^');
  encodedURL = encodedURL.replaceAll('%26', '&');
  encodedURL = encodedURL.replaceAll('%3F', '?');
  encodedURL = encodedURL.replaceAll('%3E', '>');
  encodedURL = encodedURL.replaceAll('%3C', '<');
  encodedURL = encodedURL.replaceAll('%5C', '\\');
  encodedURL = encodedURL.replaceAll('%2F', '/');
  encodedURL = encodedURL.replaceAll('%25', '%');
  encodedURL = encodedURL.replaceAll('%3A', ':');
  encodedURL = encodedURL.replaceAll('%27', "'");
  encodedURL = encodedURL.replaceAll('%24', '$');

  return encodedURL;
};

// Encodes plain text to URL encoding
export const URLEncode = (plaintext) => {
  if (!plaintext) return plaintext;
  if (plaintext === undefined) return plaintext;
  if (plaintext === '') return plaintext;
  if (typeof (plaintext) !== 'string') return plaintext;
  var SAFECHARS = '0123456789' + // Numeric
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + // Alphabetic
      'abcdefghijklmnopqrstuvwxyz' +
      "%-_.!~*'()"; // RFC2396 Mark characters
  var HEX = '0123456789ABCDEF';

  plaintext = plaintext.replace(/%/g, '%25');
  plaintext = plaintext.replace(/\+/g, '%2B');
  plaintext = plaintext.replace(/ /g, '%20');
  plaintext = plaintext.replace(/\^/g, '%5E');
  plaintext = plaintext.replace(/&/g, '%26');
  plaintext = plaintext.replace(/\?/g, '%3F');
  plaintext = plaintext.replace(/>/g, '%3E');
  plaintext = plaintext.replace(/</g, '%3C');
  plaintext = plaintext.replace(/\\/g, '%5C');

  var encoded = '';
  for (var i = 0; i < plaintext.length; i++) {
    var ch = plaintext.charAt(i);
    if (ch === ' ') {
      encoded += '%20'; // x-www-urlencoded, rather than %20
    } else if (SAFECHARS.indexOf(ch) !== -1) {
      encoded += ch;
    } else {
      var charCode = ch.charCodeAt(0);
      if (charCode > 255) {
        alert("Unicode Character '" +
            ch +
            "' cannot be encoded using standard URL encoding.\n" +
            '(URL encoding only supports 8-bit characters.)\n' +
            'A space (+) will be substituted.');
        encoded += '+';
      } else {
        encoded += '%';
        encoded += HEX.charAt((charCode >> 4) & 0xF);
        encoded += HEX.charAt(charCode & 0xF);
      }
    }
  }
  return encoded;
};

// Replaces all instances of the given substring.
String.prototype.replaceAll = function (
  strTarget, // The substring you want to replace
  strSubString // The string you want to replace in.
) {
  var strText = this;
  var intIndexOfMatch = strText.indexOf(strTarget);
  // Keep looping while an instance of the target string
  // still exists in the string.
  while (intIndexOfMatch != -1) {
    // Relace out the current instance.
    strText = strText.replace(strTarget, strSubString);
    // Get the index of any next matching substring.
    intIndexOfMatch = strText.indexOf(strTarget);
  }
  // Return the updated string with ALL the target strings
  // replaced out with the new substring.
  return (strText);
};

// Trims the spaces from the string
String.prototype.trim = function () {
  var value = this;
  value = value.replace(/^\s+/, '');
  value = value.replace(/\s+$/, '');
  return value;
};

function checkValidInputTokens (stringToCheck) {
  var filter = /^([a-zA-Z'_:~%?\$,\.\0-9 \-=/&])+$/;
  if (filter.test(stringToCheck)) {
    var t = URLDecode(stringToCheck);

    if (filter.test(t)) {
      return true;
    }
  }

  return false;
};

// Read a page's GET URL variables and return them as an associative array (From Roshambo's code snippets)
export const getUrlVars = () => {
  var vars = []; var hash;

  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');

    hash[1] = URLDecode(hash[1]);
    // vars.push({hash[0]:hash[1]});
    if (checkValidInputTokens(hash[0]) == false || checkValidInputTokens(hash[1]) == false) {

    } else {
      vars[hash[0]] = hash[1] + '';
    }
  }
  return vars;
};

// Read a page's GET URL variables and return them as an associative array (From Roshambo's code snippets)
function getUrlVarsFromHashTag () {
  var vars = []; var hash;
  var splitloc = window.location.hash.indexOf('#');
  if (window.location.hash[splitloc + 1] == '?')splitloc++;
  var hashString = window.location.hash.slice(splitloc + 1);

  var hashes = hashString.split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');

    hash[1] = URLDecode(hash[1]);
    // vars.push({hash[0]:hash[1]});
    if (checkValidInputTokens(hash[0]) == false || checkValidInputTokens(hash[1]) == false) {

    } else {
      vars[hash[0]] = hash[1] + '';
    }
  }
  return vars;
}

// Splits a URL in a location part and separate Key Value Pairs (kvp).
export const composeUrlObjectFromURL = (url) => {
  var vars = [];
  if (!isDefined(url)) {
    return vars;
  }

  var location = '';
  var hashes = [];
  var urlParts = url.split('?');

  if (urlParts.length > 1) {
    location = urlParts[0];
    hashes = urlParts[1].split('&');
  } else {
    hashes = urlParts[0].split('&');
  }

  for (var i = 0; i < hashes.length; i++) {
    let hash = hashes[i].split('=');

    if (isDefined(hash[1])) {
      hash[1] = URLDecode(hash[1]);
      if (checkValidInputTokens(hash[0]) == false || checkValidInputTokens(hash[1]) == false) {
      } else {
        if (isDefined(hash[1])) {
          if (hash[1].length > 0) {
            vars[hash[0].toLowerCase()] = hash[1] + '';
          }
        }
      }
    } else {
      hash = hashes[i].split('%3D');
      if (isDefined(hash[1])) {
        hash[1] = URLDecode(hash[1]);
        if (checkValidInputTokens(hash[0]) == false || checkValidInputTokens(hash[1]) == false) {
        } else {
          if (isDefined(hash[1])) {
            if (hash[1].length > 0) {
              vars[hash[0].toLowerCase()] = hash[1] + '';
            }
          }
        }
      }
    }
  }
  if (hashes[0].indexOf('=') == -1) {
    //     if(checkValidInputTokens(hashes[0])){
    //       location = hashes[0];

    //     }
  }
  return { location:location, kvp:vars };
};

// Check for hash tag changes.
var currentLocationHash = '';
var hashTagCheckerInUse = false;
var hashTagTimerIsRunning = false;
var _checkIfHashTagChanged = function (callback) {
  var identifier = window.location.hash; // gets everything after the hashtag i.e. #home
  if (currentLocationHash != identifier && identifier.length > 0) {
    currentLocationHash = identifier;
    if (window.location.href.indexOf('#') != -1) {
      var hashLocation = (window.location.href.split('#')[1]); // Firefox automatically urldecodes the hashtag, so use href instead.
      hashLocation = hashLocation.replaceAll('%27', "'"); // Firefox automatically encodes ' tokens into %27 for some reason. We can safely decode.
      let urlVars = getUrlVarsFromHashTag();
      if (isDefined(urlVars.clearhash)) {
        if (urlVars.clearhash == '1') {
          window.location.hash = '';
          currentLocationHash = '';
        }
      }
      // alert(hashLocation);

      // alert(identifier+"\n"+window.location.href);
      callback(hashLocation, urlVars);
    }
  }

  if (hashTagTimerIsRunning === true) return;
  hashTagTimerIsRunning = true;
  setTimeout(function () {
    hashTagTimerIsRunning = false;
    _checkIfHashTagChanged(callback);
  }, 500);
};

export const checkIfHashTagChanged = (callback) => {
  if (!isDefined(callback)) return;
  if (hashTagCheckerInUse == true) {
    alert('checkIfHashTagChanged is in use');
    return;
  }
  hashTagCheckerInUse = true;
  _checkIfHashTagChanged(callback);
};

var decodeBase64 = function (s) {
  var e = {}; var i; var b = 0; var c; var x; var l = 0; var a; var r = ''; var w = String.fromCharCode; var L = s.length;
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (i = 0; i < 64; i++) { e[A.charAt(i)] = i; }
  for (x = 0; x < L; x++) {
    c = e[s.charAt(x)]; b = (b << 6) + c; l += 6;
    while (l >= 8) { ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a)); }
  }
  return r;
};

export const addMouseWheelEvent = (element, mouseWheelHandler) => {
  if (!element) return;
  /* https://developer.mozilla.org/en-US/docs/Web/Events/wheel#Browser_compatibility */
  if (!window.addWheelListener) {
    var prefix = ''; var _addEventListener; var support;

    // detect event model
    if (window.addEventListener) {
      _addEventListener = 'addEventListener';
    } else {
      _addEventListener = 'attachEvent';
      prefix = 'on';
    }

    // detect available wheel event
    support = 'onwheel' in document.createElement('div') ? 'wheel' // Modern browsers support "wheel"
      : document.onmousewheel !== undefined ? 'mousewheel' // Webkit and IE support at least "mousewheel"
        : 'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

    window.addWheelListener = function (elem, callback, useCapture) {
      _addWheelListener(elem, support, callback, useCapture);

      // handle MozMousePixelScroll in older Firefox
      if (support == 'DOMMouseScroll') {
        _addWheelListener(elem, 'MozMousePixelScroll', callback, useCapture);
      }
    };

    function _addWheelListener (elem, eventName, callback, useCapture) {
      elem[ _addEventListener ](prefix + eventName, support == 'wheel' ? callback : function (originalEvent) {
        !originalEvent && (originalEvent = window.event);

        // create a normalized event object
        var event = {
          // keep a ref to the original event object
          originalEvent: originalEvent,
          target: originalEvent.target || originalEvent.srcElement,
          type: 'wheel',
          deltaMode: originalEvent.type == 'MozMousePixelScroll' ? 0 : 1,
          deltaX: 0,
          deltaY: 0,
          deltaZ: 0,
          preventDefault: function () {
            originalEvent.preventDefault
              ? originalEvent.preventDefault()
              : originalEvent.returnValue = false;
          }
        };

        // calculate deltaY (and deltaX) according to the event
        if (support == 'mousewheel') {
          event.deltaY = -1 / 40 * originalEvent.wheelDelta;
          // Webkit also support wheelDeltaX
          originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
        } else {
          event.deltaY = originalEvent.deltaY || originalEvent.detail;
        }

        // it's time to fire the callback
        return callback(event);
      }, useCapture || false);
    }
  }
  window.addWheelListener(element, mouseWheelHandler);
};

export const removeMouseWheelEvent = (element, mouseWheelHandler) => {
  console.warn('TODO: Implement removeMouseWheelEvent in WMJSTools.js');
};

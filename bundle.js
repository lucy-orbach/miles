(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _airports = require('./modules/airports.js');

var _input = require('./modules/input.js');

var _library = require('./modules/library.js');

var _trackMap = require('./modules/trackMap.js');

var _submitButton = require('./modules/submitButton.js');

var _autoComplete = require('./plugins/auto-complete.js');

var _autoComplete2 = _interopRequireDefault(_autoComplete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
	// Loads map...
	window.setTimeout(function () {
		(0, _trackMap.initMap)();
	}, 100);
	// Loads airports data...
	(0, _airports.loadAirports)();

	// Setup autocomplete and eventlistener on input texts...
	var inputs = document.querySelectorAll('.input-text');
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var value = _step.value;

			(0, _input.setUpInput)(value);
		}

		// Adds click handler to the start button...
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	document.getElementById('startBtn').addEventListener('click', function () {
		//removes banner
		(0, _library.removeElement)(document.getElementById('banner'));
		// adds class to slide in dashboard
		document.getElementById('dashboard').className += " show-dash";
	});

	// Adds click handler to submit button ...
	document.getElementById('submitBtn').addEventListener('click', function (event) {
		(0, _submitButton.getDistance)(event);
	});

	//END OF APP IIFE
})();

},{"./modules/airports.js":2,"./modules/input.js":3,"./modules/library.js":4,"./modules/submitButton.js":6,"./modules/trackMap.js":7,"./plugins/auto-complete.js":8}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.apTitles = exports.airports = undefined;
exports.loadAirports = loadAirports;

var _library = require('./library.js');

var airports = exports.airports = [];
var apTitles = exports.apTitles = [];

function loadAirports() {
	var myURL = "http://cors.io/?u=https://airport.api.aero/airport?user_key=9568a415ae0ff16eddd37c8ed4c801f3";
	//creates XMLHttpRequest w Promise...
	(0, _library.getData)(myURL).then(function (response) {
		exports.airports = airports = filterAirports(response);
	}).then(function () {
		setTitles(airports);
	});
};

// Filters US airports...
function filterAirports(response) {
	var data = parseData(response);
	var airports = data.airports;
	return airports.filter(function (airport) {
		return airport.country === 'United States';
	});
}
// Clears out response...
function parseData(response) {
	return JSON.parse(response.replace('callback(', '').slice(0, -1));
}

// Set AirportList for autocomplete...
function setTitles(airports) {
	exports.apTitles = apTitles = airports.map(function (a) {
		return a.code + ' - ' + a.name;
	});
}

},{"./library.js":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.setUpInput = setUpInput;

var _library = require('./library.js');

var _airports = require('./airports.js');

var _submitButton = require('./submitButton.js');

var _parameters = require('./parameters.js');

var _autoComplete = require('../plugins/auto-complete.js');

var _autoComplete2 = _interopRequireDefault(_autoComplete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setUpInput(input, airports) {
	setAutoComplete(input);
	input.addEventListener('blur', function (event) {
		enterInput(event, airports);
	});
	input.addEventListener('keyup', function (event) {
		if (!event.target.value) {
			(0, _parameters.resetParam)(event.target.name);
		}
	});
}

// PRIVATE FUNCTIONS...
// Adds Input value after validation.
function enterInput(event) {
	(0, _submitButton.resetCalc)();
	var _event$target = event.target;
	var name = _event$target.name;
	var value = _event$target.value;
	// Substracts 3 character code...

	value = value.substring(0, 3).toUpperCase();
	// If value has content ...
	if (value.length > 0) {
		var targetedParam = _parameters.params[name];
		// Finds value in airports or returns -1
		var i = getAirportIndex(value, _airports.airports);
		// If value is in airports...
		if (airportIsValid(i)) {
			var airport = _airports.airports[i];
			// Checks opposite value is not the same...
			if (isDifferentFromOpposite(name, value)) {
				// Checks is there is a value to replace and prevents reseting from autocomplete...
				if (!paramIsEmpty(targetedParam) && isDifferentFromCurrentParam(targetedParam.code, value)) {
					(0, _parameters.resetParam)(name);
				}
				(0, _parameters.setParams)(event.target, airport);
			} else {
				(0, _library.displayError)(event.target, 'Origin and Destination can\'t be the same');
			}
		} else {
			(0, _library.displayError)(event.target, 'Airport is not valid');
		}
	} else {
		(0, _parameters.resetParam)(name);
	}
}

// Initializes autocomplete
function setAutoComplete(input) {
	new _autoComplete2.default({
		selector: 'input[name=' + input.name + ']',
		minChars: 2,
		parent: input.name + 'List',
		menuClass: 'drop-down drop-down-active',
		source: function source(term, suggest) {
			term = term.toUpperCase();
			var choices = _airports.apTitles;
			var matches = [];
			for (var i = 0; i < choices.length; i++) {
				if (~choices[i].indexOf(term)) matches.push(choices[i]);
			}suggest(matches);
		}
	});
}

// Gets value's index in airports...
function getAirportIndex(value, airports) {
	return airports.findIndex(function (airport) {
		return airport.code === value;
	});
}

// Checks that value enter is inside airports...
function airportIsValid(index) {
	return index !== -1;
}

// Checks if params already has value
function paramIsEmpty(paramObj) {
	return Object.keys(paramObj).length === 0;
}

// Verifies input is not included in params already
function isDifferentFromCurrentParam(paramCode, value) {
	return paramCode !== value;
}

// Verifies input is not included in opposite param...
function isDifferentFromOpposite(name, value) {
	var oppositeParamName = name === 'origin' ? 'destination' : 'origin';
	return _parameters.params[oppositeParamName].code !== value;
}

},{"../plugins/auto-complete.js":8,"./airports.js":2,"./library.js":4,"./parameters.js":5,"./submitButton.js":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = getData;
exports.removeElement = removeElement;
exports.displayError = displayError;
exports.hideError = hideError;
var errorLabel = document.getElementById('error');

// XMLHttpRequest //
function getData(url) {
  return new Promise(function (resolve, reject) {
    //start request...
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    // xhr.send(null);
    xhr.onload = function () {
      // so check the status
      if (xhr.status == 200) {
        // Resolve the promise with the response text
        resolve(xhr.response);
      } else {
        reject(Error(xhr.statusText));
      }
    };
    // Handle networkd errors
    xhr.onerror = function () {
      reject(Error("Error"));
    };
    // Make the request
    xhr.send();
  });
}

//Fades out and removes element from DOM
function removeElement(element) {
  element.style.opacity = '0';
  setTimeout(function () {
    element.parentNode.removeChild(element);
  }, 1000);
}

//ERRORS...
function displayError(element, message) {
  var errorLabel = document.getElementById('error');
  errorLabel.innerHTML = message;
  errorLabel.className += " errorIcon";

  window.setTimeout(function () {
    resetInput(element);
  }, 2000);
}
// Clears input value
function resetInput(element) {
  //clears value
  element.value = '';
  //hides error Message
  hideError();
}
// Hides error Message
function hideError() {
  var errorLabel = document.getElementById('error');
  errorLabel.innerHTML = '';
  errorLabel.className = "errorMessage";
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.params = undefined;
exports.setParams = setParams;
exports.resetParam = resetParam;

var _submitButton = require('./submitButton.js');

var _trackMap = require('./trackMap.js');

// Adds Input value after validation...
var params = exports.params = {
	origin: {},
	destination: {}
};

// Sets Input value in params...
function setParams(element, airport) {
	// Adds param...
	params[element.name] = {
		code: airport.code,
		name: airport.code + ' - ' + airport.name,
		lat: airport.lat,
		lng: airport.lng
	};
	// Sets value in parameter
	setInput(element, params[element.name]);
	// Add marker to map...
	(0, _trackMap.addMarker)(params[element.name]);
	// Checks if form is valid
	(0, _submitButton.validateButton)();
}

// Clears data on Params...
function resetParam(name) {
	(0, _trackMap.deleteMarker)(params[name].name);
	params[name] = {};
	(0, _submitButton.resetCalc)();
}

//PRIVATE...
// Sets accurate input value...
function setInput(element, data) {
	return element.value = data.name;
}

},{"./submitButton.js":6,"./trackMap.js":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getDistance = getDistance;
exports.validateButton = validateButton;
exports.setDistance = setDistance;
exports.resetCalc = resetCalc;

var _parameters = require('./parameters.js');

var _trackMap = require('./trackMap.js');

var button = document.getElementById('submitBtn');
var container = document.getElementById('milesContainer');
var qtyLabel = document.getElementById('qty');

// Calculates distance...
function getDistance(event) {
	event.preventDefault();
	//calculate...
	var radlat1 = Math.PI * (_parameters.params.origin.lat / 180);
	var radlat2 = Math.PI * (_parameters.params.destination.lat / 180);
	var theta = _parameters.params.origin.lng - _parameters.params.destination.lng;
	var radtheta = Math.PI * (theta / 180);
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * (180 / Math.PI);
	var miles = dist * 60 * 1.1515;
	var nMiles = miles * 0.8684;
	nMiles = Math.round(nMiles * 1000) / 1000; //displays 3 decimals only
	setDistance(nMiles);
}

// Enables submit button when both inputs are set...
function validateButton() {
	button.disabled = !(!_parameters.params.origin.code === false && !_parameters.params.destination.code === false);
}

// Displays result
function setDistance(distance) {
	(0, _trackMap.addPolyline)(_parameters.params);
	if (distance !== 0) {
		container.className += ' show-miles';
	} else {
		container.className = 'miles-container';
	}
	qtyLabel.innerHTML = distance;
}

// Resets Calculation
function resetCalc() {
	container.className = 'miles-container';
	qtyLabel.innerHTML = '';
	button.disabled = true;;
}

},{"./parameters.js":5,"./trackMap.js":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMap = initMap;
exports.addMarker = addMarker;
exports.deleteMarker = deleteMarker;
exports.addPolyline = addPolyline;
var DESK = {
  coords: { lat: 40.0902, lng: -110.7129 },
  zoom: 4
};
var MOBILE = {
  coords: { lat: 5.0902, lng: -95.7129 },
  zoom: 3
};

var map = void 0;
var markers = [];
var myPath = void 0;

function initMap() {
  var mobileMedia = isMobile();
  var zoomValue = mobileMedia ? MOBILE.zoom : DESK.zoom;
  var coords = mobileMedia ? MOBILE.coords : DESK.coords;
  //creates map
  map = new google.maps.Map(document.getElementById('mapCanvas'), {
    center: coords,
    zoom: zoomValue,
    zoomControl: false,
    scaleControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true
  });
  //styles map
  map.set('styles', [{ "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#e0efef" }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "hue": "#1900ff" }, { "color": "#c0e8e8" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 100 }, { "visibility": "simplified" }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "visibility": "on" }, { "lightness": 700 }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#7dcdcd" }] }]);
}

// adds new marker
function addMarker(param) {
  var icon = './src/img/aMarker.png';
  if (findMarkerIndex(param.name) === -1) {
    //if marker is new
    var latLng = new google.maps.LatLng(param.lat, param.lng);
    // Creates marker...
    var marker = new google.maps.Marker({
      position: latLng,
      title: param.name,
      draggable: false,
      animation: google.maps.Animation.DROP,
      icon: icon,
      map: map
    });
    // Register marker...
    markers.push(marker);
  }
}

//deletes marker
function deleteMarker(paramName) {
  if (paramName) {
    var markerIndex = findMarkerIndex(paramName);
    // Removes it from map...
    markers[markerIndex].setMap(null);
    // Removes it from our register...
    markers.splice(markerIndex, 1);
    // Deletes Polyline
    if (myPath !== undefined) {
      deletePolyline();
    }
  }
}

// traces path between airports
function addPolyline(params) {
  var pathCoords = [{ lat: params.origin.lat, lng: params.origin.lng }, { lat: params.destination.lat, lng: params.destination.lng }];
  myPath = new google.maps.Polyline({
    path: pathCoords,
    geodesic: true,
    strokeColor: '#f4733d',
    strokeOpacity: 1.0,
    strokeWeight: 4
  });
  myPath.setMap(map);
}

// detects if marker exist and gets its index
function findMarkerIndex(name) {
  //name 'SFO - San Fr...'
  return markers.findIndex(function (m) {
    return m.title === name;
  });
}

// removes path between airports
function deletePolyline() {
  myPath.setMap(null);
}

// Detects if screen is mobile
function isMobile() {
  return window.matchMedia('(max-width: 767px)').matches;
}

// Resets coords and zoom on resize
// window.onresize = function() {
//   let newMobile = isMobile();
//   let zoomValue = newMobile ? MOBILE.zoom : DESK.zoom;
//   let coords = newMobile ? MOBILE.coords : DESK.coords;
//     map.setCenter(coords);
//     map.setZoom(zoomValue);
// };

},{}],8:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

var autoComplete = function () {
    // "use strict";
    function autoComplete(options) {
        if (!document.querySelector) return;

        // helpers
        function hasClass(el, className) {
            return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
        }

        function addEvent(el, type, handler) {
            if (el.attachEvent) el.attachEvent('on' + type, handler);else el.addEventListener(type, handler);
        }
        function removeEvent(el, type, handler) {
            // if (el.removeEventListener) not working in IE11
            if (el.detachEvent) el.detachEvent('on' + type, handler);else el.removeEventListener(type, handler);
        }
        function live(elClass, event, cb, context) {
            addEvent(context || document, event, function (e) {
                var found,
                    el = e.target || e.srcElement;
                while (el && !(found = hasClass(el, elClass))) {
                    el = el.parentElement;
                }if (found) cb.call(el, e);
            });
        }
        //modification: adds parent key
        var o = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            parent: 0,
            renderItem: function renderItem(item, search) {
                // escape special characters
                search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                return '<div class="autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
            },
            onSelect: function onSelect(e, term, item) {}
        };
        for (var k in options) {
            if (options.hasOwnProperty(k)) o[k] = options[k];
        }

        // init
        var elems = _typeof(o.selector) == 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (var i = 0; i < elems.length; i++) {
            var that = elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = 'autocomplete-suggestions ' + o.menuClass;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = function (resize, next) {
                var rect = that.getBoundingClientRect();
                // that.sc.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + o.offsetLeft) + 'px';
                // that.sc.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + o.offsetTop) + 'px';
                //modification: removes style...
                that.sc.style.left = '0 px';
                that.sc.style.top = '0 px';
                that.sc.style.width = '100%'; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) {
                        that.sc.maxHeight = parseInt((window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle).maxHeight);
                    }
                    if (!that.sc.suggestionHeight) that.sc.suggestionHeight = that.sc.querySelector('.autocomplete-suggestion').offsetHeight;
                    if (that.sc.suggestionHeight) if (!next) that.sc.scrollTop = 0;else {
                        var scrTop = that.sc.scrollTop,
                            selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                        if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0) that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;else if (selTop < 0) that.sc.scrollTop = selTop + scrTop;
                    }
                }
            };
            addEvent(window, 'resize', that.updateSC);
            //modification: appends element to parent instaed of body
            var parent = document.getElementById(o.parent);
            parent.appendChild(that.sc);

            live('autocomplete-suggestion', 'mouseleave', function (e) {
                var sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) setTimeout(function () {
                    sel.className = sel.className.replace('selected', '');
                }, 20);
            }, that.sc);

            live('autocomplete-suggestion', 'mouseover', function (e) {
                var sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) sel.className = sel.className.replace('selected', '');
                this.className += ' selected';
            }, that.sc);

            live('autocomplete-suggestion', 'mousedown', function (e) {
                if (hasClass(this, 'autocomplete-suggestion')) {
                    // else outside click
                    var v = this.getAttribute('data-val');
                    that.value = v;
                    o.onSelect(e, v, this);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = function () {
                try {
                    var over_sb = document.querySelector('.autocomplete-suggestions:hover');
                } catch (e) {
                    var over_sb = 0;
                }
                if (!over_sb) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(function () {
                        that.sc.style.display = 'none';
                    }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(function () {
                    that.focus();
                }, 20);
            };
            addEvent(that, 'blur', that.blurHandler);

            var suggest = function suggest(data) {
                var val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    var s = '';
                    for (var i = 0; i < data.length; i++) {
                        s += o.renderItem(data[i], val);
                    }that.sc.innerHTML = s;
                    that.updateSC(0);
                } else that.sc.style.display = 'none';
            };

            that.keydownHandler = function (e) {
                var key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key == 40 || key == 38) && that.sc.innerHTML) {
                    var next,
                        sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (!sel) {
                        next = key == 40 ? that.sc.querySelector('.autocomplete-suggestion') : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = key == 40 ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        } else {
                            sel.className = sel.className.replace('selected', '');that.value = that.last_val;next = 0;
                        }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                else if (key == 27) {
                        that.value = that.last_val;that.sc.style.display = 'none';
                    }
                    // enter
                    else if (key == 13 || key == 9) {
                            var sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                            if (sel && that.sc.style.display != 'none') {
                                o.onSelect(e, sel.getAttribute('data-val'), sel);setTimeout(function () {
                                    that.sc.style.display = 'none';
                                }, 20);
                            }
                        }
            };
            addEvent(that, 'keydown', that.keydownHandler);

            that.keyupHandler = function (e) {
                var key = window.event ? e.keyCode : e.which;
                if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
                    var val = that.value;
                    if (val.length >= o.minChars) {
                        if (val != that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) {
                                    suggest(that.cache[val]);return;
                                }
                                // no requests if previous suggestions were empty
                                for (var i = 1; i < val.length - o.minChars; i++) {
                                    var part = val.slice(0, val.length - i);
                                    if (part in that.cache && !that.cache[part].length) {
                                        suggest([]);return;
                                    }
                                }
                            }
                            that.timer = setTimeout(function () {
                                o.source(val, suggest);
                            }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            addEvent(that, 'keyup', that.keyupHandler);

            that.focusHandler = function (e) {
                that.last_val = '\n';
                that.keyupHandler(e);
            };
            if (!o.minChars) addEvent(that, 'focus', that.focusHandler);
        }

        // public destroy method
        this.destroy = function () {
            for (var i = 0; i < elems.length; i++) {
                var that = elems[i];
                removeEvent(window, 'resize', that.updateSC);
                removeEvent(that, 'blur', that.blurHandler);
                removeEvent(that, 'focus', that.focusHandler);
                removeEvent(that, 'keydown', that.keydownHandler);
                removeEvent(that, 'keyup', that.keyupHandler);
                if (that.autocompleteAttr) that.setAttribute('autocomplete', that.autocompleteAttr);else that.removeAttribute('autocomplete');
                document.body.removeChild(that.sc);
                that = null;
            }
        };
    }
    return autoComplete;
}();

(function () {
    if (typeof define === 'function' && define.amd) define('autoComplete', function () {
        return autoComplete;
    });else if (typeof module !== 'undefined' && module.exports) module.exports = autoComplete;else window.autoComplete = autoComplete;
})();

},{}]},{},[1]);

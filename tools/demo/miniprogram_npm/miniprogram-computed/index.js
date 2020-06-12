module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(1).behavior;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var deepClone = __webpack_require__(2)({ proto: true });
var deepEqual = __webpack_require__(3);
var dataPath = __webpack_require__(4);
var dataTracer = __webpack_require__(5);

var TYPES = [String, Number, Boolean, Object, Array, null];
var TYPE_DEFAULT_VALUES = ['', 0, false, null, [], null];

var getDataOnPath = function getDataOnPath(data, path) {
  var ret = data;
  path.forEach(function (s) {
    if ((typeof ret === 'undefined' ? 'undefined' : _typeof(ret)) !== 'object' || ret === null) ret = undefined;else ret = ret[s];
  });
  return ret;
};

var setDataOnPath = function setDataOnPath(data, path, value) {
  var cur = data;
  var index = 0;
  while (index < path.length - 1) {
    var s = path[index++];
    if (typeof s === 'number') {
      if (!(cur[s] instanceof Array)) {
        cur[s] = [];
      }
    } else if (_typeof(cur[s]) !== 'object' || cur[s] === null) {
      cur[s] = {};
    }
    cur = cur[s];
  }
  cur[path[index]] = value;
};

var getDataDefinition = function getDataDefinition(data, properties) {
  var ret = {};
  Object.keys(data).forEach(function (key) {
    ret[key] = data[key];
  });
  if (properties) {
    Object.keys(properties).forEach(function (key) {
      var value = null;
      var def = properties[key];
      var typeIndex = TYPES.indexOf(def);
      if (typeIndex >= 0) {
        value = TYPE_DEFAULT_VALUES[typeIndex];
      } else if (def.value) {
        value = def.value;
      } else {
        var _typeIndex = TYPES.indexOf(def.type);
        if (_typeIndex >= 0) {
          value = TYPE_DEFAULT_VALUES[_typeIndex];
        }
      }
      ret[key] = value;
    });
  }
  return ret;
};

exports.behavior = Behavior({
  lifetimes: {
    created: function created() {
      this._initComputedWatchInfo();
    }
  },
  definitionFilter: function definitionFilter(defFields) {
    var computedDef = defFields.computed || {};
    var watchDef = defFields.watch || {};

    var observersItems = [];
    if (!defFields.methods) {
      defFields.methods = {};
    }
    if (!defFields.data) {
      defFields.data = {};
    }
    if (defFields.methods._initComputedWatchInfo) {
      throw new Error('Please do not use this behavior more than once in a single component');
    }

    // initialize status, executed on created
    var initFuncs = [];
    defFields.methods._initComputedWatchInfo = function () {
      var _this = this;

      if (this._computedWatchInfo) return;
      this._computedWatchInfo = {
        computedRelatedPathValues: {},
        watchCurVal: {}
      };
      initFuncs.forEach(function (func) {
        return func.call(_this);
      });
    };

    // handling computed
    var computedUpdaters = [];
    Object.keys(computedDef).forEach(function (targetField) {
      var _dataPath$parseSingle = dataPath.parseSingleDataPath(targetField),
          targetPath = _dataPath$parseSingle.path;

      var updateMethod = computedDef[targetField];
      // update value and calculate related paths
      var updateValueAndRelatedPaths = function updateValueAndRelatedPaths() {
        var _setData;

        var oldPathValues = this._computedWatchInfo.computedRelatedPathValues[targetField];
        var needUpdate = false;
        for (var i = 0; i < oldPathValues.length; i++) {
          var _oldPathValues$i = oldPathValues[i],
              path = _oldPathValues$i.path,
              oldVal = _oldPathValues$i.value;

          var curVal = getDataOnPath(this.data, path);
          if (oldVal !== curVal) {
            needUpdate = true;
            break;
          }
        }
        if (!needUpdate) return false;
        var relatedPathValues = [];
        var val = updateMethod(dataTracer.create(this.data, relatedPathValues));
        this.setData((_setData = {}, _setData[targetField] = val, _setData));
        this._computedWatchInfo.computedRelatedPathValues[targetField] = relatedPathValues;
        return true;
      };
      // calculate value on registration
      var relatedPathValuesOnDef = [];
      var initData = getDataDefinition(defFields.data, defFields.properties);
      var val = updateMethod(dataTracer.create(initData, relatedPathValuesOnDef));
      setDataOnPath(defFields.data, targetPath, dataTracer.unwrap(val));
      initFuncs.push(function () {
        var _this2 = this;

        var pathValues = relatedPathValuesOnDef.map(function (_ref) {
          var path = _ref.path;
          return {
            path: path,
            value: getDataOnPath(_this2.data, path)
          };
        });
        this._computedWatchInfo.computedRelatedPathValues[targetField] = pathValues;
      });
      // calculate value on setData
      computedUpdaters.push(updateValueAndRelatedPaths);
    });
    if (computedUpdaters.length) {
      // add a single observer for all computed fields
      observersItems.push({
        fields: '**',
        observer: function observer() {
          var _this3 = this;

          if (!this._computedWatchInfo) return;
          var changed = void 0;
          do {
            changed = false;
            // eslint-disable-next-line no-loop-func
            computedUpdaters.forEach(function (func) {
              if (func.call(_this3)) changed = true;
            });
          } while (changed);
        }
      });
    }

    // handling watch
    Object.keys(watchDef).forEach(function (watchPath) {
      var paths = dataPath.parseMultiDataPaths(watchPath);
      // record the original value of watch targets
      initFuncs.push(function () {
        var _this4 = this;

        var curVal = paths.map(function (_ref2) {
          var path = _ref2.path,
              options = _ref2.options;

          var val = getDataOnPath(_this4.data, path);
          return options.deepCmp ? deepClone(val) : val;
        });
        this._computedWatchInfo.watchCurVal[watchPath] = curVal;
      });
      // add watch observer
      observersItems.push({
        fields: watchPath,
        observer: function observer() {
          var _this5 = this;

          if (!this._computedWatchInfo) return;
          var oldVal = this._computedWatchInfo.watchCurVal[watchPath];
          var originalCurValWithOptions = paths.map(function (_ref3) {
            var path = _ref3.path,
                options = _ref3.options;

            var val = getDataOnPath(_this5.data, path);
            return {
              val: val,
              options: options
            };
          });
          var curVal = originalCurValWithOptions.map(function (_ref4) {
            var val = _ref4.val,
                options = _ref4.options;
            return options.deepCmp ? deepClone(val) : val;
          });
          this._computedWatchInfo.watchCurVal[watchPath] = curVal;
          var changed = false;
          for (var i = 0; i < curVal.length; i++) {
            var options = paths[i].options;
            var deepCmp = options.deepCmp;
            if (deepCmp ? !deepEqual(oldVal[i], curVal[i]) : oldVal[i] !== curVal[i]) {
              changed = true;
              break;
            }
          }
          if (changed) {
            watchDef[watchPath].apply(this, originalCurValWithOptions.map(function (_ref5) {
              var val = _ref5.val;
              return val;
            }));
          }
        }
      });
    });

    // register to observers
    if (_typeof(defFields.observers) !== 'object') {
      defFields.observers = {};
    }
    if (defFields.observers instanceof Array) {
      var _defFields$observers;

      (_defFields$observers = defFields.observers).push.apply(_defFields$observers, observersItems);
    } else {
      observersItems.forEach(function (item) {
        defFields.observers[item.fields] = item.observer;
      });
    }
  }
});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("rfdc");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("fast-deep-equal");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var WHITE_SPACE_CHAR_REGEXP = /^\s/;

var throwParsingError = function throwParsingError(path, index) {
  throw new Error('Parsing data path "' + path + '" failed at char "' + path[index] + '" (index ' + index + ')');
};

var parseArrIndex = function parseArrIndex(path, state) {
  var startIndex = state.index;
  while (state.index < state.length) {
    var ch = path[state.index];
    if (/^[0-9]/.test(ch)) {
      state.index++;
      continue;
    }
    break;
  }
  if (startIndex === state.index) {
    throwParsingError(path, state.index);
  }
  return parseInt(path.slice(startIndex, state.index), 10);
};

var parseIdent = function parseIdent(path, state) {
  var startIndex = state.index;
  var ch = path[startIndex];
  if (/^[_a-zA-Z$]/.test(ch)) {
    state.index++;
    while (state.index < state.length) {
      var _ch = path[state.index];
      if (/^[_a-zA-Z0-9$]/.test(_ch)) {
        state.index++;
        continue;
      }
      break;
    }
  } else {
    throwParsingError(path, state.index);
  }
  return path.slice(startIndex, state.index);
};

var parseSinglePath = function parseSinglePath(path, state) {
  var paths = [parseIdent(path, state)];
  var options = {
    deepCmp: false
  };
  while (state.index < state.length) {
    var ch = path[state.index];
    if (ch === '[') {
      state.index++;
      paths.push(parseArrIndex(path, state));
      var nextCh = path[state.index];
      if (nextCh !== ']') throwParsingError(path, state.index);
      state.index++;
    } else if (ch === '.') {
      state.index++;
      var _ch2 = path[state.index];
      if (_ch2 === '*') {
        state.index++;
        var _ch3 = path[state.index];
        if (_ch3 === '*') {
          state.index++;
          options.deepCmp = true;
          break;
        }
        throwParsingError(path, state.index);
      }
      paths.push(parseIdent(path, state));
    } else {
      break;
    }
  }
  return { path: paths, options: options };
};

var parseMultiPaths = function parseMultiPaths(path, state) {
  while (WHITE_SPACE_CHAR_REGEXP.test(path[state.index])) {
    state.index++;
  }
  var ret = [parseSinglePath(path, state)];
  var splitted = false;
  while (state.index < state.length) {
    var ch = path[state.index];
    if (WHITE_SPACE_CHAR_REGEXP.test(ch)) {
      state.index++;
    } else if (ch === ',') {
      splitted = true;
      state.index++;
    } else if (splitted) {
      splitted = false;
      ret.push(parseSinglePath(path, state));
    } else {
      throwParsingError(path, state.index);
    }
  }
  return ret;
};

var parseEOF = function parseEOF(path, state) {
  if (state.index < state.length) throwParsingError(path, state.index);
};

exports.parseSingleDataPath = function (path) {
  var state = {
    length: path.length,
    index: 0
  };
  var ret = parseSinglePath(path, state);
  parseEOF(path, state);
  return ret;
};

exports.parseMultiDataPaths = function (path) {
  var state = {
    length: path.length,
    index: 0
  };
  var ret = parseMultiPaths(path, state);
  parseEOF(path, state);
  return ret;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var wrapData = function wrapData(data, relatedPathValues, basePath) {
  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || data === null) return data;
  var isArray = data instanceof Array;
  var propDef = {};
  Object.keys(data).forEach(function (key) {
    var keyWrapper = null;
    propDef[key] = {
      get: function get() {
        if (!keyWrapper) {
          var keyPath = basePath.concat(key);
          relatedPathValues.push({
            path: keyPath,
            value: data[key]
          });
          keyWrapper = wrapData(data[key], relatedPathValues, keyPath);
        }
        return keyWrapper;
      },
      set: function set() {
        throw new Error('Setting data is not allowed');
      },

      enumerable: true
    };
  });
  if (isArray) {
    propDef.length = {
      value: data.length,
      enumerable: false
    };
  }
  propDef.__rawObject__ = {
    get: function get() {
      return data;
    },
    set: function set() {
      throw new Error('Setting data is not allowed');
    },

    enumerable: false
  };
  var proto = isArray ? Array.prototype : Object.prototype;
  return Object.create(proto, propDef);
};

exports.create = function (data, relatedPathValues) {
  return wrapData(data, relatedPathValues, []);
};

exports.unwrap = function (wrapped) {
  if ((typeof wrapped === 'undefined' ? 'undefined' : _typeof(wrapped)) !== 'object' || wrapped === null || _typeof(wrapped.__rawObject__) !== 'object') {
    return wrapped;
  }
  return wrapped.__rawObject__;
};

/***/ })
/******/ ]);
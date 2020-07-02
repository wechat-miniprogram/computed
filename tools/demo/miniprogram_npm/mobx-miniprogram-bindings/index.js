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


exports.__esModule = true;
exports.storeBindingsBehavior = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createStoreBindings = createStoreBindings;

var _mobxMiniprogram = __webpack_require__(1);

function _createActions(methods, options) {
  var store = options.store,
      actions = options.actions;


  if (!actions) return;

  // for array-typed fields definition
  if (typeof store === 'undefined') {
    throw new Error('[mobx-miniprogram] no store specified');
  }

  if (actions instanceof Array) {
    // eslint-disable-next-line arrow-body-style
    actions.forEach(function (field) {
      methods[field] = function () {
        return store[field].apply(store, arguments);
      };
    });
  } else if ((typeof actions === 'undefined' ? 'undefined' : _typeof(actions)) === 'object') {
    // for object-typed fields definition
    Object.keys(actions).forEach(function (field) {
      var def = actions[field];
      if (typeof field !== 'string' && typeof field !== 'number') {
        throw new Error('[mobx-miniprogram] unrecognized field definition');
      }
      methods[field] = function () {
        return store[def].apply(store, arguments);
      };
    });
  }
}

function _createDataFieldsReactions(target, options) {
  var store = options.store,
      fields = options.fields;

  // setData combination

  var pendingSetData = null;
  function applySetData() {
    if (pendingSetData === null) return;
    var data = pendingSetData;
    pendingSetData = null;
    target.setData(data);
  }
  function scheduleSetData(field, value) {
    if (!pendingSetData) {
      pendingSetData = {};
      wx.nextTick(applySetData);
    }
    pendingSetData[field] = value;
  }

  // handling fields
  var reactions = [];
  if (fields instanceof Array) {
    // for array-typed fields definition
    if (typeof store === 'undefined') {
      throw new Error('[mobx-miniprogram] no store specified');
    }
    // eslint-disable-next-line arrow-body-style
    reactions = fields.map(function (field) {
      return (0, _mobxMiniprogram.reaction)(function () {
        return store[field];
      }, function (value) {
        scheduleSetData(field, value);
      }, {
        fireImmediately: true
      });
    });
  } else if ((typeof fields === 'undefined' ? 'undefined' : _typeof(fields)) === 'object' && fields) {
    // for object-typed fields definition
    reactions = Object.keys(fields).map(function (field) {
      var def = fields[field];
      if (typeof def === 'function') {
        return (0, _mobxMiniprogram.reaction)(function () {
          return def.call(target, store);
        }, function (value) {
          scheduleSetData(field, value);
        }, {
          fireImmediately: true
        });
      }
      if (typeof field !== 'string' && typeof field !== 'number') {
        throw new Error('[mobx-miniprogram] unrecognized field definition');
      }
      if (typeof store === 'undefined') {
        throw new Error('[mobx-miniprogram] no store specified');
      }
      return (0, _mobxMiniprogram.reaction)(function () {
        return store[def];
      }, function (value) {
        scheduleSetData(String(field), value);
      }, {
        fireImmediately: true
      });
    });
  }

  var destroyStoreBindings = function destroyStoreBindings() {
    reactions.forEach(function (reaction) {
      return reaction();
    });
  };

  return {
    updateStoreBindings: applySetData,
    destroyStoreBindings: destroyStoreBindings
  };
}

function createStoreBindings(target, options) {
  _createActions(target, options);
  return _createDataFieldsReactions(target, options);
}

var storeBindingsBehavior = exports.storeBindingsBehavior = Behavior({
  definitionFilter: function definitionFilter(defFields) {
    if (!defFields.methods) {
      defFields.methods = {};
    }
    var storeBindings = defFields.storeBindings;

    defFields.methods._mobxMiniprogramBindings = function () {
      return storeBindings;
    };
    if (storeBindings) {
      if (Array.isArray(storeBindings)) {
        storeBindings.forEach(function (binding) {
          _createActions(defFields.methods, binding);
        });
      } else {
        _createActions(defFields.methods, storeBindings);
      }
    }
  },
  attached: function attached() {
    if (typeof this._mobxMiniprogramBindings !== 'function') return;
    var storeBindings = this._mobxMiniprogramBindings();
    if (!storeBindings) {
      this._mobxMiniprogramBindings = null;
      return;
    }
    if (Array.isArray(storeBindings)) {
      var that = this;
      this._mobxMiniprogramBindings = storeBindings.map(function (item) {
        return _createDataFieldsReactions(that, item);
      });
    } else {
      this._mobxMiniprogramBindings = _createDataFieldsReactions(this, storeBindings);
    }
  },
  detached: function detached() {
    if (this._mobxMiniprogramBindings) {
      if (Array.isArray(this._mobxMiniprogramBindings)) {
        this._mobxMiniprogramBindings.forEach(function (bd) {
          bd.destroyStoreBindings();
        });
      } else {
        this._mobxMiniprogramBindings.destroyStoreBindings();
      }
    }
  },

  methods: {
    updateStoreBindings: function updateStoreBindings() {
      if (this._mobxMiniprogramBindings && typeof this._mobxMiniprogramBindings !== 'function') {
        if (Array.isArray(this._mobxMiniprogramBindings)) {
          this._mobxMiniprogramBindings.forEach(function (bd) {
            bd.updateStoreBindings();
          });
        } else {
          this._mobxMiniprogramBindings.updateStoreBindings();
        }
      }
    }
  }
});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mobx-miniprogram");

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map
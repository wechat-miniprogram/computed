var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// swc_build/data-path.js
var require_data_path = __commonJS({
  "swc_build/data-path.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true }), exports2.parseMultiDataPaths = exports2.getDataOnPath = void 0;
    var WHITE_SPACE_CHAR_REGEXP = /^\s/;
    var throwParsingError = function(a, b) {
      throw new Error('Parsing data path "' + a + '" failed at char "' + a[b] + '" (index ' + b + ")");
    };
    var parseArrIndex = function(c, d) {
      for (var e = d.index; d.index < d.length; ) {
        var f = c[d.index];
        if (/^[0-9]/.test(f)) {
          d.index++;
          continue;
        }
        break;
      }
      return e === d.index && throwParsingError(c, d.index), parseInt(c.slice(e, d.index), 10);
    };
    var parseIdent = function(g, h) {
      var i = h.index, j = g[i];
      if (/^[_a-zA-Z$]/.test(j))
        for (h.index++; h.index < h.length; ) {
          var k = g[h.index];
          if (/^[_a-zA-Z0-9$]/.test(k)) {
            h.index++;
            continue;
          }
          break;
        }
      else
        throwParsingError(g, h.index);
      return g.slice(i, h.index);
    };
    var parseSinglePath = function(l, m) {
      for (var n = [parseIdent(l, m)], o = { deepCmp: false }; m.index < m.length; ) {
        var p = l[m.index];
        if (p === "[")
          m.index++, n.push("".concat(parseArrIndex(l, m))), l[m.index] !== "]" && throwParsingError(l, m.index), m.index++;
        else if (p === ".") {
          if (m.index++, l[m.index] === "*") {
            if (m.index++, l[m.index] === "*") {
              m.index++, o.deepCmp = true;
              break;
            }
            throwParsingError(l, m.index);
          }
          n.push(parseIdent(l, m));
        } else
          break;
      }
      return { path: n, options: o };
    };
    var parseMultiPaths = function(q, r) {
      for (; WHITE_SPACE_CHAR_REGEXP.test(q[r.index]); )
        r.index++;
      for (var s = [parseSinglePath(q, r)], t = false; r.index < r.length; ) {
        var u = q[r.index];
        WHITE_SPACE_CHAR_REGEXP.test(u) ? r.index++ : u === "," ? (t = true, r.index++) : t ? (t = false, s.push(parseSinglePath(q, r))) : throwParsingError(q, r.index);
      }
      return s;
    };
    var parseEOF = function(v, w) {
      w.index < w.length && throwParsingError(v, w.index);
    };
    var parseMultiDataPaths = function(x) {
      var y = { length: x.length, index: 0 }, z = parseMultiPaths(x, y);
      return parseEOF(x, y), z;
    };
    exports2.parseMultiDataPaths = parseMultiDataPaths;
    var getDataOnPath = function(A, B) {
      var C = A;
      return B.forEach(function(D) {
        C = typeof C != "object" || C === null ? void 0 : C[D];
      }), C;
    };
    exports2.getDataOnPath = getDataOnPath;
  }
});

// node_modules/proxy-polyfill/src/proxy.js
var require_proxy = __commonJS({
  "node_modules/proxy-polyfill/src/proxy.js"(exports2, module2) {
    module2.exports = function proxyPolyfill() {
      let lastRevokeFn = null;
      let ProxyPolyfill;
      function isObject(o) {
        return o ? typeof o === "object" || typeof o === "function" : false;
      }
      function validateProto(proto) {
        if (proto !== null && !isObject(proto)) {
          throw new TypeError("Object prototype may only be an Object or null: " + proto);
        }
      }
      const $Object = Object;
      const canCreateNullProtoObjects = Boolean($Object.create) || !({ __proto__: null } instanceof $Object);
      const objectCreate = $Object.create || (canCreateNullProtoObjects ? function create(proto) {
        validateProto(proto);
        return { __proto__: proto };
      } : function create(proto) {
        validateProto(proto);
        if (proto === null) {
          throw new SyntaxError("Native Object.create is required to create objects with null prototype");
        }
        var T = function T2() {
        };
        T.prototype = proto;
        return new T();
      });
      const noop = function() {
        return null;
      };
      const getProto = $Object.getPrototypeOf || ([].__proto__ === Array.prototype ? function getPrototypeOf(O) {
        const proto = O.__proto__;
        return isObject(proto) ? proto : null;
      } : noop);
      ProxyPolyfill = function(target, handler) {
        const newTarget = this && this instanceof ProxyPolyfill ? this.constructor : void 0;
        if (newTarget === void 0) {
          throw new TypeError("Constructor Proxy requires 'new'");
        }
        if (!isObject(target) || !isObject(handler)) {
          throw new TypeError("Cannot create proxy with a non-object as target or handler");
        }
        let throwRevoked = function() {
        };
        lastRevokeFn = function() {
          target = null;
          throwRevoked = function(trap) {
            throw new TypeError(`Cannot perform '${trap}' on a proxy that has been revoked`);
          };
        };
        setTimeout(function() {
          lastRevokeFn = null;
        }, 0);
        const unsafeHandler = handler;
        handler = { "get": null, "set": null, "apply": null, "construct": null };
        for (let k in unsafeHandler) {
          if (!(k in handler)) {
            throw new TypeError(`Proxy polyfill does not support trap '${k}'`);
          }
          handler[k] = unsafeHandler[k];
        }
        if (typeof unsafeHandler === "function") {
          handler.apply = unsafeHandler.apply.bind(unsafeHandler);
        }
        const proto = getProto(target);
        let proxy;
        let isMethod = false;
        let isArray = false;
        if (typeof target === "function") {
          proxy = function ProxyPolyfill2() {
            const usingNew = this && this.constructor === proxy;
            const args = Array.prototype.slice.call(arguments);
            throwRevoked(usingNew ? "construct" : "apply");
            if (usingNew && handler["construct"]) {
              return handler["construct"].call(this, target, args);
            } else if (!usingNew && handler.apply) {
              return handler["apply"](target, this, args);
            }
            if (usingNew) {
              args.unshift(target);
              const f = target.bind.apply(target, args);
              return new f();
            }
            return target.apply(this, args);
          };
          isMethod = true;
        } else if (target instanceof Array) {
          proxy = [];
          isArray = true;
        } else {
          proxy = canCreateNullProtoObjects || proto !== null ? objectCreate(proto) : {};
        }
        const getter = handler.get ? function(prop) {
          throwRevoked("get");
          return handler.get(this, prop, proxy);
        } : function(prop) {
          throwRevoked("get");
          return this[prop];
        };
        const setter = handler.set ? function(prop, value) {
          throwRevoked("set");
          const status = handler.set(this, prop, value, proxy);
        } : function(prop, value) {
          throwRevoked("set");
          this[prop] = value;
        };
        const propertyNames = $Object.getOwnPropertyNames(target);
        const propertyMap = {};
        propertyNames.forEach(function(prop) {
          if ((isMethod || isArray) && prop in proxy) {
            return;
          }
          const real = $Object.getOwnPropertyDescriptor(target, prop);
          const desc = {
            enumerable: Boolean(real.enumerable),
            get: getter.bind(target, prop),
            set: setter.bind(target, prop)
          };
          $Object.defineProperty(proxy, prop, desc);
          propertyMap[prop] = true;
        });
        let prototypeOk = true;
        if (isMethod || isArray) {
          const setProto = $Object.setPrototypeOf || ([].__proto__ === Array.prototype ? function setPrototypeOf(O, proto2) {
            validateProto(proto2);
            O.__proto__ = proto2;
            return O;
          } : noop);
          if (!(proto && setProto(proxy, proto))) {
            prototypeOk = false;
          }
        }
        if (handler.get || !prototypeOk) {
          for (let k in target) {
            if (propertyMap[k]) {
              continue;
            }
            $Object.defineProperty(proxy, k, { get: getter.bind(target, k) });
          }
        }
        $Object.seal(target);
        $Object.seal(proxy);
        return proxy;
      };
      ProxyPolyfill.revocable = function(target, handler) {
        const p = new ProxyPolyfill(target, handler);
        return { "proxy": p, "revoke": lastRevokeFn };
      };
      return ProxyPolyfill;
    };
  }
});

// swc_build/data-tracer.js
var require_data_tracer = __commonJS({
  "swc_build/data-tracer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true }), exports2.create = create, exports2.unwrap = unwrap;
    var _proxy = _interopRequireDefault(require_proxy());
    function _interopRequireDefault(a) {
      return a && a.__esModule ? a : { default: a };
    }
    var ProxyPolyfill = _proxy.default();
    var wrapData = function(b, c, d) {
      if (typeof b != "object" || b === null)
        return b;
      var e = { get: function(f, g) {
        if (g === "__rawObject__")
          return f;
        var h = d.concat(g), i = f[g];
        return c.push({ path: h, value: i }), wrapData(i, c, h);
      } };
      try {
        return new Proxy(b, e);
      } catch (j) {
        return new ProxyPolyfill(b, e);
      }
    };
    function create(k, l) {
      return wrapData(k, l, []);
    }
    function unwrap(m) {
      if (m !== null && typeof m == "object" && typeof m.__rawObject__ != "object") {
        if (Array.isArray(m))
          return m.map(function(n) {
            return unwrap(n);
          });
        var o = {};
        return Object.keys(m).forEach(function(p) {
          o[p] = unwrap(m[p]);
        }), o;
      }
      return typeof m != "object" || m === null || typeof m.__rawObject__ != "object" ? m : m.__rawObject__;
    }
  }
});

// swc_build/behavior.js
var require_behavior = __commonJS({
  "swc_build/behavior.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true }), exports2.behavior = void 0;
    var ComputedWatchInitStatus;
    var _observers;
    var ComputedWatchInitStatus1;
    var _rfdc = _interopRequireDefault(require("rfdc"));
    var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));
    var dataPath = _interopRequireWildcard(require_data_path());
    var dataTracer = _interopRequireWildcard(require_data_tracer());
    function _defineProperty(a, b, c) {
      return b in a ? Object.defineProperty(a, b, { value: c, enumerable: true, configurable: true, writable: true }) : a[b] = c, a;
    }
    function _interopRequireDefault(a) {
      return a && a.__esModule ? a : { default: a };
    }
    function _interopRequireWildcard(a) {
      if (a && a.__esModule)
        return a;
      var d = {};
      if (a != null) {
        for (var b in a)
          if (Object.prototype.hasOwnProperty.call(a, b)) {
            var e = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(a, b) : {};
            e.get || e.set ? Object.defineProperty(d, b, e) : d[b] = a[b];
          }
      }
      return d.default = a, d;
    }
    var deepClone = _rfdc.default({ proto: true });
    (ComputedWatchInitStatus = ComputedWatchInitStatus1 || (ComputedWatchInitStatus1 = {}))[ComputedWatchInitStatus.CREATED = 0] = "CREATED", ComputedWatchInitStatus[ComputedWatchInitStatus.ATTACHED = 1] = "ATTACHED";
    var computedWatchDefIdInc = 0;
    var behavior = Behavior({ lifetimes: { attached: function() {
      this.setData({ _computedWatchInit: ComputedWatchInitStatus1.ATTACHED });
    }, created: function() {
      this.setData({ _computedWatchInit: ComputedWatchInitStatus1.CREATED });
    } }, definitionFilter: function(f) {
      var g = f.computed, h = f.watch, i = [], j = computedWatchDefIdInc++;
      i.push({ fields: "_computedWatchInit", observer: function() {
        var k = this.data._computedWatchInit;
        if (k === ComputedWatchInitStatus1.CREATED) {
          var l = { computedUpdaters: [], computedRelatedPathValues: {}, watchCurVal: {}, _triggerFromComputedAttached: {} };
          this._computedWatchInfo || (this._computedWatchInfo = {}), this._computedWatchInfo[j] = l, h && Object.keys(h).forEach(function(m) {
            var n = dataPath.parseMultiDataPaths(m).map(function(o) {
              var p = o.path, q = o.options, r = dataPath.getDataOnPath(this.data, p);
              return q.deepCmp ? deepClone(r) : r;
            }.bind(this));
            l.watchCurVal[m] = n;
          }.bind(this));
        } else if (k === ComputedWatchInitStatus1.ATTACHED) {
          var s = this._computedWatchInfo[j];
          g && Object.keys(g).forEach(function(t) {
            var u = g[t], v = [], w = u(dataTracer.create(this.data, v)), x = v.map(function(y) {
              var z = y.path;
              return { path: z, value: dataPath.getDataOnPath(this.data, z) };
            }.bind(this));
            this.setData(_defineProperty({}, t, dataTracer.unwrap(w))), s._triggerFromComputedAttached[t] = true, s.computedRelatedPathValues[t] = x;
            var A = function() {
              for (var B = s.computedRelatedPathValues[t], C = false, D = 0; D < B.length; D++) {
                var E = B[D], F = E.path;
                if (E.value !== dataPath.getDataOnPath(this.data, F)) {
                  C = true;
                  break;
                }
              }
              if (!C)
                return false;
              var G = [], H = u(dataTracer.create(this.data, G));
              this.setData(_defineProperty({}, t, dataTracer.unwrap(H)));
              var I = G.map(function(J) {
                var K = J.path;
                return { path: K, value: dataPath.getDataOnPath(this.data, K) };
              }.bind(this));
              return s.computedRelatedPathValues[t] = I, true;
            }.bind(this);
            s.computedUpdaters.push(A);
          }.bind(this));
        }
      } }), g && i.push({ fields: "**", observer: function() {
        if (this._computedWatchInfo) {
          var L, M = this._computedWatchInfo[j];
          if (M)
            do
              L = M.computedUpdaters.some(function(N) {
                return N.call(this);
              }.bind(this));
            while (L);
        }
      } }), h && Object.keys(h).forEach(function(O) {
        var P = dataPath.parseMultiDataPaths(O);
        i.push({ fields: O, observer: function() {
          if (this._computedWatchInfo) {
            var Q = this._computedWatchInfo[j];
            if (Q) {
              if (Object.keys(Q._triggerFromComputedAttached).length) {
                var R = {};
                for (var S in P.forEach(function(T) {
                  return R[T.path[0]] = true;
                }), Q._triggerFromComputedAttached)
                  if (Q._triggerFromComputedAttached.hasOwnProperty(S) && R[S] && Q._triggerFromComputedAttached[S])
                    return void (Q._triggerFromComputedAttached[S] = false);
              }
              var U = Q.watchCurVal[O], V = P.map(function(W) {
                var X = W.path, Y = W.options;
                return { val: dataPath.getDataOnPath(this.data, X), options: Y };
              }.bind(this)), Z = V.map(function($) {
                var _ = $.val;
                return $.options.deepCmp ? deepClone(_) : _;
              });
              Q.watchCurVal[O] = Z;
              for (var aa = false, ba = 0; ba < Z.length; ba++)
                if (P[ba].options.deepCmp ? !_fastDeepEqual.default(U[ba], Z[ba]) : U[ba] !== Z[ba]) {
                  aa = true;
                  break;
                }
              aa && h[O].apply(this, V.map(function(ca) {
                return ca.val;
              }));
            }
          }
        } });
      }), typeof f.observers != "object" && (f.observers = {}), Array.isArray(f.observers) ? (_observers = f.observers).push.apply(_observers, i) : i.forEach(function(da) {
        var ea = f.observers[da.fields];
        ea ? f.observers[da.fields] = function() {
          da.observer.call(this), ea.call(this);
        } : f.observers[da.fields] = da.observer;
      });
    } });
    exports2.behavior = behavior;
  }
});

// swc_build/index.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true }), Object.defineProperty(exports, "behavior", { enumerable: true, get: function() {
  return _behavior.behavior;
} }), exports.ComponentWithComputed = ComponentWithComputed, exports.BehaviorWithComputed = BehaviorWithComputed, exports.DataTracerMode = exports.setCurrentDataTracerMode = exports.getCurrentDataTracerMode = void 0;
var DataTracerMode;
var DataTracerMode1;
var _behavior = require_behavior();
function ComponentWithComputed(a) {
  return Array.isArray(a.behaviors) || (a.behaviors = []), a.behaviors.unshift(_behavior.behavior), Component(a);
}
function BehaviorWithComputed(b) {
  return Array.isArray(b.behaviors) || (b.behaviors = []), b.behaviors.unshift(_behavior.behavior), Behavior(b);
}
exports.DataTracerMode = DataTracerMode1, (DataTracerMode = DataTracerMode1 || (exports.DataTracerMode = DataTracerMode1 = {}))[DataTracerMode.Auto = 0] = "Auto", DataTracerMode[DataTracerMode.Proxy = 1] = "Proxy", DataTracerMode[DataTracerMode.DefineProperty = 2] = "DefineProperty";
var currentDataTracerMode = DataTracerMode1.Auto;
var getCurrentDataTracerMode = function() {
  return currentDataTracerMode;
};
exports.getCurrentDataTracerMode = getCurrentDataTracerMode;
var setCurrentDataTracerMode = function(c) {
  currentDataTracerMode = c;
};
exports.setCurrentDataTracerMode = setCurrentDataTracerMode;

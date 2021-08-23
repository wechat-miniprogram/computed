function __spack_require__(mod) {
    var cache;
    if (cache) {
        return cache;
    }
    var module = {
        exports: {
        }
    };
    mod(module, module.exports);
    cache = module.exports;
    return cache;
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
var load = __spack_require__.bind(void 0, function(module, exports) {
    'use strict';
    module.exports = rfdc;
    function rfdc(opts) {
        opts = opts || {
        };
        if (opts.circles) return rfdcCircles(opts);
        function cloneArray(a, fn) {
            var keys = Object.keys(a);
            var a2 = new Array(keys.length);
            for(var i = 0; i < keys.length; i++){
                var k = keys[i];
                var cur = a[k];
                if (typeof cur !== 'object' || cur === null) {
                    a2[k] = cur;
                } else if (cur instanceof Date) {
                    a2[k] = new Date(cur);
                } else {
                    a2[k] = fn(cur);
                }
            }
            return a2;
        }
        function clone(o) {
            if (typeof o !== 'object' || o === null) return o;
            if (o instanceof Date) return new Date(o);
            if (Array.isArray(o)) return cloneArray(o, clone);
            var o2 = {
            };
            for(var k in o){
                if (Object.hasOwnProperty.call(o, k) === false) continue;
                var cur = o[k];
                if (typeof cur !== 'object' || cur === null) {
                    o2[k] = cur;
                } else if (cur instanceof Date) {
                    o2[k] = new Date(cur);
                } else {
                    o2[k] = clone(cur);
                }
            }
            return o2;
        }
        function cloneProto(o) {
            if (typeof o !== 'object' || o === null) return o;
            if (o instanceof Date) return new Date(o);
            if (Array.isArray(o)) return cloneArray(o, cloneProto);
            var o2 = {
            };
            for(var k in o){
                var cur = o[k];
                if (typeof cur !== 'object' || cur === null) {
                    o2[k] = cur;
                } else if (cur instanceof Date) {
                    o2[k] = new Date(cur);
                } else {
                    o2[k] = cloneProto(cur);
                }
            }
            return o2;
        }
        return opts.proto ? cloneProto : clone;
    }
    function rfdcCircles(opts) {
        var refs = [];
        var refsNew = [];
        function cloneArray(a, fn) {
            var keys = Object.keys(a);
            var a2 = new Array(keys.length);
            for(var i = 0; i < keys.length; i++){
                var k = keys[i];
                var cur = a[k];
                if (typeof cur !== 'object' || cur === null) {
                    a2[k] = cur;
                } else if (cur instanceof Date) {
                    a2[k] = new Date(cur);
                } else {
                    var index = refs.indexOf(cur);
                    if (index !== -1) {
                        a2[k] = refsNew[index];
                    } else {
                        a2[k] = fn(cur);
                    }
                }
            }
            return a2;
        }
        function clone(o) {
            if (typeof o !== 'object' || o === null) return o;
            if (o instanceof Date) return new Date(o);
            if (Array.isArray(o)) return cloneArray(o, clone);
            var o2 = {
            };
            refs.push(o);
            refsNew.push(o2);
            for(var k in o){
                if (Object.hasOwnProperty.call(o, k) === false) continue;
                var cur = o[k];
                if (typeof cur !== 'object' || cur === null) {
                    o2[k] = cur;
                } else if (cur instanceof Date) {
                    o2[k] = new Date(cur);
                } else {
                    var i = refs.indexOf(cur);
                    if (i !== -1) {
                        o2[k] = refsNew[i];
                    } else {
                        o2[k] = clone(cur);
                    }
                }
            }
            refs.pop();
            refsNew.pop();
            return o2;
        }
        function cloneProto(o) {
            if (typeof o !== 'object' || o === null) return o;
            if (o instanceof Date) return new Date(o);
            if (Array.isArray(o)) return cloneArray(o, cloneProto);
            var o2 = {
            };
            refs.push(o);
            refsNew.push(o2);
            for(var k in o){
                var cur = o[k];
                if (typeof cur !== 'object' || cur === null) {
                    o2[k] = cur;
                } else if (cur instanceof Date) {
                    o2[k] = new Date(cur);
                } else {
                    var i = refs.indexOf(cur);
                    if (i !== -1) {
                        o2[k] = refsNew[i];
                    } else {
                        o2[k] = cloneProto(cur);
                    }
                }
            }
            refs.pop();
            refsNew.pop();
            return o2;
        }
        return opts.proto ? cloneProto : clone;
    }
});
var load1 = __spack_require__.bind(void 0, function(module, exports) {
    'use strict';
    var isArray = Array.isArray;
    var keyList = Object.keys;
    var hasProp = Object.prototype.hasOwnProperty;
    module.exports = function equal(a, b) {
        if (a === b) return true;
        if (a && b && typeof a == 'object' && typeof b == 'object') {
            var arrA = isArray(a), arrB = isArray(b), i, length, key;
            if (arrA && arrB) {
                length = a.length;
                if (length != b.length) return false;
                for(i = length; (i--) !== 0;)if (!equal(a[i], b[i])) return false;
                return true;
            }
            if (arrA != arrB) return false;
            var dateA = a instanceof Date, dateB = b instanceof Date;
            if (dateA != dateB) return false;
            if (dateA && dateB) return a.getTime() == b.getTime();
            var regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
            if (regexpA != regexpB) return false;
            if (regexpA && regexpB) return a.toString() == b.toString();
            var keys = keyList(a);
            length = keys.length;
            if (length !== keyList(b).length) return false;
            for(i = length; (i--) !== 0;)if (!hasProp.call(b, keys[i])) return false;
            for(i = length; (i--) !== 0;){
                key = keys[i];
                if (!equal(a[key], b[key])) return false;
            }
            return true;
        }
        return a !== a && b !== b;
    };
});
var load2 = __spack_require__.bind(void 0, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.parseMultiDataPaths = parseMultiDataPaths, exports.getDataOnPath = void 0;
    var WHITE_SPACE_CHAR_REGEXP = /^\s/, throwParsingError = function(a, b) {
        throw new Error("Parsing data path \"" + a + "\" failed at char \"" + a[b] + "\" (index " + b + ")");
    }, parseArrIndex = function(c, d) {
        for(var e = d.index; d.index < d.length;){
            var f = c[d.index];
            if (/^[0-9]/.test(f)) {
                d.index++;
                continue;
            }
            break;
        }
        return e === d.index && throwParsingError(c, d.index), parseInt(c.slice(e, d.index), 10);
    }, parseIdent = function(g, h) {
        var i = h.index, j = g[i];
        if (/^[_a-zA-Z$]/.test(j)) for(h.index++; h.index < h.length;){
            var k = g[h.index];
            if (/^[_a-zA-Z0-9$]/.test(k)) {
                h.index++;
                continue;
            }
            break;
        }
        else throwParsingError(g, h.index);
        return g.slice(i, h.index);
    }, parseSinglePath = function(l, m) {
        for(var n = [
            parseIdent(l, m)
        ], o = {
            deepCmp: !1
        }; m.index < m.length;){
            var p = l[m.index];
            if ("[" === p) m.index++, n.push(parseArrIndex(l, m)), "]" !== l[m.index] && throwParsingError(l, m.index), m.index++;
            else if ("." === p) {
                if (m.index++, "*" === l[m.index]) {
                    if (m.index++, "*" === l[m.index]) {
                        m.index++, o.deepCmp = !0;
                        break;
                    }
                    throwParsingError(l, m.index);
                }
                n.push(parseIdent(l, m));
            } else break;
        }
        return {
            path: n,
            options: o
        };
    }, parseMultiPaths = function(q, r) {
        for(; WHITE_SPACE_CHAR_REGEXP.test(q[r.index]);)r.index++;
        for(var s = [
            parseSinglePath(q, r)
        ], t = !1; r.index < r.length;){
            var u = q[r.index];
            WHITE_SPACE_CHAR_REGEXP.test(u) ? r.index++ : "," === u ? (t = !0, r.index++) : t ? (t = !1, s.push(parseSinglePath(q, r))) : throwParsingError(q, r.index);
        }
        return s;
    }, parseEOF = function(v, w) {
        w.index < w.length && throwParsingError(v, w.index);
    };
    function parseMultiDataPaths(x) {
        var y = {
            length: x.length,
            index: 0
        }, z = parseMultiPaths(x, y);
        return parseEOF(x, y), z;
    }
    var getDataOnPath = function(A, B) {
        var C = A;
        return B.forEach(function(D) {
            C = "object" != typeof C || null === C ? void 0 : C[D];
        }), C;
    };
    exports.getDataOnPath = getDataOnPath;
});
var load3 = __spack_require__.bind(void 0, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.create = create, exports.unwrap = unwrap;
    var wrapData = function(a, b, c) {
        if ("object" != typeof a || null === a) return a;
        var d = {
            get: function(e, f) {
                if ("__rawObject__" === f) return a;
                var g = c.concat(f), h = a[f];
                return b.push({
                    path: g,
                    value: h
                }), wrapData(h, b, g);
            }
        };
        return new Proxy(a, d);
    };
    function create(i, j) {
        return wrapData(i, j, []);
    }
    function unwrap(k) {
        return "object" != typeof k || null === k || "object" != typeof k.__rawObject__ ? k : k.__rawObject__;
    }
});
var load4 = __spack_require__.bind(void 0, function(module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.behavior = void 0;
    var _observers, _rfdc = _interopRequireDefault(load()), _fastDeepEqual = _interopRequireDefault(load1()), dataPath = _interopRequireWildcard(load2()), dataTracer = _interopRequireWildcard(load3()), deepClone = _rfdc.default({
        proto: !0
    }), computedWatchDefIdInc = 0, behavior = Behavior({
        lifetimes: {
            attached: function() {
                this.setData({
                    _computedWatchInit: "attached"
                });
            },
            created: function() {
                this.setData({
                    _computedWatchInit: "created"
                });
            }
        },
        definitionFilter: function(a) {
            var b = a.computed, c = a.watch, d = [], e = computedWatchDefIdInc++;
            d.push({
                fields: "_computedWatchInit",
                observer: function() {
                    var f = this.data._computedWatchInit;
                    if ("created" === f) {
                        // init data fields
                        var g = {
                            computedUpdaters: [],
                            computedRelatedPathValues: {
                            },
                            watchCurVal: {
                            }
                        };
                        this._computedWatchInfo || (this._computedWatchInfo = {
                        }), this._computedWatchInfo[e] = g, c && Object.keys(c).forEach((function(h) {
                            var i = dataPath.parseMultiDataPaths(h).map((function(j) {
                                var k = j.path, l = j.options, m = dataPath.getDataOnPath(this.data, k);
                                return l.deepCmp ? deepClone(m) : m;
                            }).bind(this));
                            g.watchCurVal[h] = i;
                        }).bind(this));
                    } else if ("attached" === f) {
                        // handling computed
                        // 1. push to initFuncs
                        // 2. push to computedUpdaters
                        var n = this._computedWatchInfo[e];
                        b && Object.keys(b).forEach((function(o) {
                            var p = b[o], q = [], r = p(dataTracer.create(this.data, q)), s = q.map((function(t) {
                                var u = t.path;
                                return {
                                    path: u,
                                    value: dataPath.getDataOnPath(this.data, u)
                                };
                            }).bind(this));
                            // here we can do small setDatas
                            // because observer handlers will force grouping small setDatas together
                            this.setData(_defineProperty({
                            }, o, dataTracer.unwrap(r))), n.computedRelatedPathValues[o] = s;
                            // will be invoked when setData is called
                            var v = (function() {
                                // check whether its dependency updated
                                for(var w = n.computedRelatedPathValues[o], x = !1, y = 0; y < w.length; y++){
                                    var z = w[y], A = z.path;
                                    if (z.value !== dataPath.getDataOnPath(this.data, A)) {
                                        x = !0;
                                        break;
                                    }
                                }
                                if (!x) return !1;
                                var B = [], C = p(dataTracer.create(this.data, B));
                                return this.setData(_defineProperty({
                                }, o, dataTracer.unwrap(C))), n.computedRelatedPathValues[o] = B, !0;
                            }).bind(this);
                            n.computedUpdaters.push(v);
                        }).bind(this));
                    }
                }
            }), b && d.push({
                fields: "**",
                observer: function() {
                    if (this._computedWatchInfo) {
                        var D, E = this._computedWatchInfo[e];
                        if (E) do D = E.computedUpdaters.some((function(F) {
                            return F.call(this);
                        }).bind(this));
                        while (D)
                    }
                }
            }), c && Object.keys(c).forEach(function(G) {
                var H = dataPath.parseMultiDataPaths(G);
                d.push({
                    fields: G,
                    observer: function() {
                        if (this._computedWatchInfo) {
                            var I = this._computedWatchInfo[e];
                            if (I) {
                                var J = I.watchCurVal[G], K = H.map((function(L) {
                                    var M = L.path, N = L.options;
                                    return {
                                        val: dataPath.getDataOnPath(this.data, M),
                                        options: N
                                    };
                                }).bind(this)), O = K.map(function(P) {
                                    var Q = P.val;
                                    return P.options.deepCmp ? deepClone(Q) : Q;
                                });
                                I.watchCurVal[G] = O;
                                for(var R = !1, S = 0; S < O.length; S++)if (H[S].options.deepCmp ? !_fastDeepEqual.default(J[S], O[S]) : J[S] !== O[S]) {
                                    R = !0;
                                    break;
                                }
                                R && c[G].apply(this, K.map(function(T) {
                                    return T.val;
                                }));
                            }
                        }
                    }
                });
            }), "object" != typeof a.observers && (a.observers = {
            }), Array.isArray(a.observers) ? (_observers = a.observers).push.apply(_observers, d) : d.forEach(function(U) {
                // defFields.observers[item.fields] = item.observer
                var V = a.observers[U.fields];
                V ? a.observers[U.fields] = function() {
                    U.observer.call(this), V.call(this);
                } : a.observers[U.fields] = U.observer;
            });
        }
    });
    exports.behavior = behavior;
});
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "behavior", {
    enumerable: !0,
    get: function() {
        return _behavior.behavior;
    }
}), exports.ComponentWithComputed = ComponentWithComputed, exports.BehaviorWithComputed = BehaviorWithComputed;
var _behavior = load4();
function ComponentWithComputed(a) {
    return Array.isArray(a.behaviors) || (a.behaviors = []), a.behaviors.unshift(_behavior.behavior), Component(a);
}
function BehaviorWithComputed(b) {
    return Array.isArray(b.behaviors) || (b.behaviors = []), b.behaviors.unshift(_behavior.behavior), Behavior(b);
}

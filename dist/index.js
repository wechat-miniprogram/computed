'use strict'
var E = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports)
var U = E((F) => {
  'use strict'
  Object.defineProperty(F, '__esModule', { value: !0 }),
    (function (t, e) {
      for (var r in e) Object.defineProperty(t, r, { enumerable: !0, get: e[r] })
    })(F, {
      getDataOnPath: function () {
        return ie
      },
      parseMultiDataPaths: function () {
        return ae
      },
    })
  var N = /^\s/,
    g = function (t, e) {
      throw Error('Parsing data path "' + t + '" failed at char "' + t[e] + '" (index ' + e + ')')
    },
    re = function (t, e) {
      for (var r = e.index; e.index < e.length; ) {
        var o = t[e.index]
        if (/^[0-9]/.test(o)) {
          e.index++
          continue
        }
        break
      }
      return r === e.index && g(t, e.index), parseInt(t.slice(r, e.index), 10)
    },
    $ = function (t, e) {
      var r = e.index,
        o = t[r]
      if (/^[_a-zA-Z$]/.test(o))
        for (e.index++; e.index < e.length; ) {
          var s = t[e.index]
          if (/^[_a-zA-Z0-9$]/.test(s)) {
            e.index++
            continue
          }
          break
        }
      else g(t, e.index)
      return t.slice(r, e.index)
    },
    H = function (t, e) {
      for (var r = [$(t, e)], o = { deepCmp: !1 }; e.index < e.length; ) {
        var s = t[e.index]
        if (s === '[')
          e.index++, r.push('' + re(t, e)), t[e.index] !== ']' && g(t, e.index), e.index++
        else if (s === '.') {
          if ((e.index++, t[e.index] === '*')) {
            if ((e.index++, t[e.index] === '*')) {
              e.index++, (o.deepCmp = !0)
              break
            }
            g(t, e.index)
          }
          r.push($(t, e))
        } else break
      }
      return { path: r, options: o }
    },
    ne = function (t, e) {
      for (; N.test(t[e.index]); ) e.index++
      for (var r = [H(t, e)], o = !1; e.index < e.length; ) {
        var s = t[e.index]
        N.test(s)
          ? e.index++
          : s === ','
            ? ((o = !0), e.index++)
            : o
              ? ((o = !1), r.push(H(t, e)))
              : g(t, e.index)
      }
      return r
    },
    oe = function (t, e) {
      e.index < e.length && g(t, e.index)
    },
    ae = function (t) {
      var e = { length: t.length, index: 0 },
        r = ne(t, e)
      return oe(t, e), r
    },
    ie = function (t, e) {
      var r = t
      return (
        e.forEach(function (o) {
          r = typeof r != 'object' || r === null ? void 0 : r[o]
        }),
        r
      )
    }
})
var Z = E((me, z) => {
  z.exports = function () {
    let e = null,
      r
    function o(n) {
      return n ? typeof n == 'object' || typeof n == 'function' : !1
    }
    function s(n) {
      if (n !== null && !o(n))
        throw new TypeError('Object prototype may only be an Object or null: ' + n)
    }
    let c = Object,
      i = !!c.create || !({ __proto__: null } instanceof c),
      d =
        c.create ||
        (i
          ? function (a) {
              return s(a), { __proto__: a }
            }
          : function (a) {
              if ((s(a), a === null))
                throw new SyntaxError(
                  'Native Object.create is required to create objects with null prototype',
                )
              var h = function () {}
              return (h.prototype = a), new h()
            }),
      x = function () {
        return null
      },
      l =
        c.getPrototypeOf ||
        ([].__proto__ === Array.prototype
          ? function (a) {
              let h = a.__proto__
              return o(h) ? h : null
            }
          : x)
    return (
      (r = function (n, a) {
        if ((this && this instanceof r ? this.constructor : void 0) === void 0)
          throw new TypeError("Constructor Proxy requires 'new'")
        if (!o(n) || !o(a))
          throw new TypeError('Cannot create proxy with a non-object as target or handler')
        let y = function () {}
        ;(e = function () {
          ;(n = null),
            (y = function (u) {
              throw new TypeError(`Cannot perform '${u}' on a proxy that has been revoked`)
            })
        }),
          setTimeout(function () {
            e = null
          }, 0)
        let v = a
        a = { get: null, set: null, apply: null, construct: null }
        for (let u in v) {
          if (!(u in a)) throw new TypeError(`Proxy polyfill does not support trap '${u}'`)
          a[u] = v[u]
        }
        typeof v == 'function' && (a.apply = v.apply.bind(v))
        let _ = l(n),
          f,
          p = !1,
          P = !1
        typeof n == 'function'
          ? ((f = function () {
              let m = this && this.constructor === f,
                b = Array.prototype.slice.call(arguments)
              if ((y(m ? 'construct' : 'apply'), m && a.construct))
                return a.construct.call(this, n, b)
              if (!m && a.apply) return a.apply(n, this, b)
              if (m) {
                b.unshift(n)
                let k = n.bind.apply(n, b)
                return new k()
              }
              return n.apply(this, b)
            }),
            (p = !0))
          : n instanceof Array
            ? ((f = []), (P = !0))
            : (f = i || _ !== null ? d(_) : {})
        let w = a.get
            ? function (u) {
                return y('get'), a.get(this, u, f)
              }
            : function (u) {
                return y('get'), this[u]
              },
          A = a.set
            ? function (u, m) {
                y('set')
                let b = a.set(this, u, m, f)
              }
            : function (u, m) {
                y('set'), (this[u] = m)
              },
          I = c.getOwnPropertyNames(n),
          C = {}
        I.forEach(function (u) {
          if ((p || P) && u in f) return
          let b = {
            enumerable: !!c.getOwnPropertyDescriptor(n, u).enumerable,
            get: w.bind(n, u),
            set: A.bind(n, u),
          }
          c.defineProperty(f, u, b), (C[u] = !0)
        })
        let D = !0
        if (p || P) {
          let u =
            c.setPrototypeOf ||
            ([].__proto__ === Array.prototype
              ? function (b, k) {
                  return s(k), (b.__proto__ = k), b
                }
              : x)
          ;(_ && u(f, _)) || (D = !1)
        }
        if (a.get || !D) for (let u in n) C[u] || c.defineProperty(f, u, { get: w.bind(n, u) })
        return c.seal(n), c.seal(f), f
      }),
      (r.revocable = function (n, a) {
        return { proxy: new r(n, a), revoke: e }
      }),
      r
    )
  }
})
var G = E((q) => {
  'use strict'
  Object.defineProperty(q, '__esModule', { value: !0 }),
    (function (t, e) {
      for (var r in e) Object.defineProperty(t, r, { enumerable: !0, get: e[r] })
    })(q, {
      create: function () {
        return ce
      },
      unwrap: function () {
        return function t(e) {
          if (e !== null && typeof e == 'object' && typeof e.__rawObject__ != 'object') {
            if (Array.isArray(e))
              return e.map(function (o) {
                return t(o)
              })
            var r = {}
            return (
              Object.keys(e).forEach(function (o) {
                r[o] = t(e[o])
              }),
              r
            )
          }
          return typeof e != 'object' || e === null || typeof e.__rawObject__ != 'object'
            ? e
            : e.__rawObject__
        }
      },
    })
  var T,
    ue = (0, ((T = Z()) && T.__esModule ? T : { default: T }).default)(),
    S = function (t, e, r) {
      if (typeof t != 'object' || t === null) return t
      var o = {
        get: function (s, c) {
          if (c === '__rawObject__') return s
          var i = r.concat(c),
            d = s[c]
          return e.push({ path: i, value: d }), S(d, e, i)
        },
      }
      try {
        return new Proxy(t, o)
      } catch {
        return new ue(t, o)
      }
    }
  function ce(t, e) {
    return S(t, e, [])
  }
})
var ee = E((R) => {
  'use strict'
  Object.defineProperty(R, '__esModule', { value: !0 }),
    Object.defineProperty(R, 'behavior', {
      enumerable: !0,
      get: function () {
        return le
      },
    })
  var M,
    J,
    fe = Q(require('rfdc')),
    se = Q(require('fast-deep-equal')),
    O = Y(U()),
    W = Y(G())
  function Q(t) {
    return t && t.__esModule ? t : { default: t }
  }
  function X(t) {
    if (typeof WeakMap != 'function') return null
    var e = new WeakMap(),
      r = new WeakMap()
    return (X = function (o) {
      return o ? r : e
    })(t)
  }
  function Y(t, e) {
    if (!e && t && t.__esModule) return t
    if (t === null || (typeof t != 'object' && typeof t != 'function')) return { default: t }
    var r = X(e)
    if (r && r.has(t)) return r.get(t)
    var o = { __proto__: null },
      s = Object.defineProperty && Object.getOwnPropertyDescriptor
    for (var c in t)
      if (c !== 'default' && Object.prototype.hasOwnProperty.call(t, c)) {
        var i = s ? Object.getOwnPropertyDescriptor(t, c) : null
        i && (i.get || i.set) ? Object.defineProperty(o, c, i) : (o[c] = t[c])
      }
    return (o.default = t), r && r.set(t, o), o
  }
  var K = (0, fe.default)({ proto: !0 })
  ;((M = J || (J = {}))[(M.CREATED = 0)] = 'CREATED'), (M[(M.ATTACHED = 1)] = 'ATTACHED')
  var pe = 0
  function L(t, e) {
    return t === e || (t != t && e != e)
  }
  var le = Behavior({
    lifetimes: {
      attached: function () {
        this.setData({ _computedWatchInit: 1 })
      },
      created: function () {
        this.setData({ _computedWatchInit: 0 })
      },
    },
    definitionFilter: function (t) {
      var e,
        r = t.computed,
        o = t.watch,
        s = [],
        c = pe++
      s.push({
        fields: '_computedWatchInit',
        observer: function () {
          var i = this,
            d = this.data._computedWatchInit
          if (d === 0) {
            var x = {
              computedUpdaters: [],
              computedRelatedPathValues: {},
              watchCurVal: {},
              _triggerFromComputedAttached: {},
            }
            this._computedWatchInfo || (this._computedWatchInfo = {}),
              (this._computedWatchInfo[c] = x),
              o &&
                Object.keys(o).forEach(function (n) {
                  var a = O.parseMultiDataPaths(n).map(function (h) {
                    var y = h.path,
                      v = h.options,
                      _ = O.getDataOnPath(i.data, y)
                    return v.deepCmp ? K(_) : _
                  })
                  x.watchCurVal[n] = a
                })
          } else if (d === 1) {
            var l = this._computedWatchInfo[c]
            r &&
              Object.keys(r).forEach(function (n) {
                var a,
                  h = r[n],
                  y = [],
                  v = h(W.create(i.data, y)),
                  _ = y.map(function (f) {
                    var p = f.path
                    return { path: p, value: O.getDataOnPath(i.data, p) }
                  })
                i.setData((((a = {})[n] = W.unwrap(v)), a)),
                  (l._triggerFromComputedAttached[n] = !0),
                  (l.computedRelatedPathValues[n] = _),
                  l.computedUpdaters.push(function () {
                    for (
                      var f, p = l.computedRelatedPathValues[n], P = !1, w = 0;
                      w < p.length;
                      w++
                    ) {
                      var A = p[w],
                        I = A.path
                      if (!L(A.value, O.getDataOnPath(i.data, I))) {
                        P = !0
                        break
                      }
                    }
                    if (!P) return !1
                    var C = [],
                      D = h(W.create(i.data, C))
                    i.setData((((f = {})[n] = W.unwrap(D)), f))
                    var u = C.map(function (m) {
                      var b = m.path
                      return { path: b, value: O.getDataOnPath(i.data, b) }
                    })
                    return (l.computedRelatedPathValues[n] = u), !0
                  })
              })
          }
        },
      }),
        r &&
          s.push({
            fields: '**',
            observer: function () {
              var i,
                d = this
              if (this._computedWatchInfo) {
                var x = this._computedWatchInfo[c]
                if (x)
                  do
                    i = x.computedUpdaters.some(function (l) {
                      return l.call(d)
                    })
                  while (i)
              }
            },
          }),
        o &&
          Object.keys(o).forEach(function (i) {
            var d = O.parseMultiDataPaths(i)
            s.push({
              fields: i,
              observer: function () {
                var x = this
                if (this._computedWatchInfo) {
                  var l = this._computedWatchInfo[c]
                  if (l) {
                    if (Object.keys(l._triggerFromComputedAttached).length) {
                      var n = {}
                      for (var a in (d.forEach(function (p) {
                        return (n[p.path[0]] = !0)
                      }),
                      l._triggerFromComputedAttached))
                        if (
                          l._triggerFromComputedAttached.hasOwnProperty(a) &&
                          n[a] &&
                          l._triggerFromComputedAttached[a]
                        ) {
                          l._triggerFromComputedAttached[a] = !1
                          return
                        }
                    }
                    var h = l.watchCurVal[i],
                      y = d.map(function (p) {
                        var P = p.path,
                          w = p.options
                        return { val: O.getDataOnPath(x.data, P), options: w }
                      }),
                      v = y.map(function (p) {
                        var P = p.val
                        return p.options.deepCmp ? K(P) : P
                      })
                    l.watchCurVal[i] = v
                    for (var _ = !1, f = 0; f < v.length; f++)
                      if (d[f].options.deepCmp ? !(0, se.default)(h[f], v[f]) : !L(h[f], v[f])) {
                        _ = !0
                        break
                      }
                    _ &&
                      o[i].apply(
                        this,
                        y.map(function (p) {
                          return p.val
                        }),
                      )
                  }
                }
              },
            })
          }),
        typeof t.observers != 'object' && (t.observers = {}),
        Array.isArray(t.observers)
          ? (e = t.observers).push.apply(e, [].concat(s))
          : s.forEach(function (i) {
              var d = t.observers[i.fields]
              d
                ? (t.observers[i.fields] = function () {
                    i.observer.call(this), d.call(this)
                  })
                : (t.observers[i.fields] = i.observer)
            })
    },
  })
})
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (function (t, e) {
    for (var r in e) Object.defineProperty(t, r, { enumerable: !0, get: e[r] })
  })(exports, {
    BehaviorWithComputed: function () {
      return he
    },
    ComponentWithComputed: function () {
      return de
    },
    DataTracerMode: function () {
      return V
    },
    behavior: function () {
      return B.behavior
    },
    getCurrentDataTracerMode: function () {
      return ye
    },
    setCurrentDataTracerMode: function () {
      return ve
    },
  })
var j,
  V,
  B = ee()
function de(t) {
  return (
    Array.isArray(t.behaviors) || (t.behaviors = []), t.behaviors.unshift(B.behavior), Component(t)
  )
}
function he(t) {
  return (
    Array.isArray(t.behaviors) || (t.behaviors = []), t.behaviors.unshift(B.behavior), Behavior(t)
  )
}
;((j = V || (V = {}))[(j.Auto = 0)] = 'Auto'),
  (j[(j.Proxy = 1)] = 'Proxy'),
  (j[(j.DefineProperty = 2)] = 'DefineProperty')
var te = 0,
  ye = function () {
    return te
  },
  ve = function (t) {
    te = t
  }

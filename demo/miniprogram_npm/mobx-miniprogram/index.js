'use strict'
Object.defineProperty(exports, '__esModule', { value: !0 })
var extendStatics = function (e, t) {
  return (extendStatics =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function (e, t) {
        e.__proto__ = t
      }) ||
    function (e, t) {
      for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
    })(e, t)
}
function __extends(e, t) {
  function r() {
    this.constructor = e
  }
  extendStatics(e, t),
    (e.prototype =
      null === t ? Object.create(t) : ((r.prototype = t.prototype), new r()))
}
var __assign = function () {
  return (__assign =
    Object.assign ||
    function (e) {
      for (var t, r = 1, n = arguments.length; r < n; r++)
        for (var o in (t = arguments[r]))
          Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
      return e
    }).apply(this, arguments)
}
function __read(e, t) {
  var r = 'function' == typeof Symbol && e[Symbol.iterator]
  if (!r) return e
  var n,
    o,
    a = r.call(e),
    i = []
  try {
    for (; (void 0 === t || t-- > 0) && !(n = a.next()).done; ) i.push(n.value)
  } catch (e) {
    o = { error: e }
  } finally {
    try {
      n && !n.done && (r = a.return) && r.call(a)
    } finally {
      if (o) throw o.error
    }
  }
  return i
}
function __spread() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e = e.concat(__read(arguments[t]))
  return e
}
var OBFUSCATED_ERROR =
    'An invariant failed, however the error is obfuscated because this is an production build.',
  EMPTY_ARRAY = []
Object.freeze(EMPTY_ARRAY)
var EMPTY_OBJECT = {}
function getGlobal() {
  return 'undefined' != typeof window ? window : global
}
function getNextId() {
  return ++globalState.mobxGuid
}
function fail(e) {
  throw (invariant(!1, e), 'X')
}
function invariant(e, t) {
  if (!e) throw new Error('[mobx] ' + (t || OBFUSCATED_ERROR))
}
Object.freeze(EMPTY_OBJECT)
var deprecatedMessages = []
function deprecated(e, t) {
  return !1
}
function once(e) {
  var t = !1
  return function () {
    if (!t) return (t = !0), e.apply(this, arguments)
  }
}
var noop = function () {}
function unique(e) {
  var t = []
  return (
    e.forEach(function (e) {
      ;-1 === t.indexOf(e) && t.push(e)
    }),
    t
  )
}
function isObject(e) {
  return null !== e && 'object' == typeof e
}
function isPlainObject(e) {
  if (null === e || 'object' != typeof e) return !1
  var t = Object.getPrototypeOf(e)
  return t === Object.prototype || null === t
}
function convertToMap(e) {
  return isES6Map(e) || isObservableMap(e)
    ? e
    : Array.isArray(e)
    ? new Map(e)
    : isPlainObject(e)
    ? new Map(Object.entries(e))
    : fail("Cannot convert to map from '" + e + "'")
}
function makeNonEnumerable(e, t) {
  for (var r = 0; r < t.length; r++) addHiddenProp(e, t[r], e[t[r]])
}
function addHiddenProp(e, t, r) {
  Object.defineProperty(e, t, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: r,
  })
}
function addHiddenFinalProp(e, t, r) {
  Object.defineProperty(e, t, {
    enumerable: !1,
    writable: !1,
    configurable: !0,
    value: r,
  })
}
function createInstanceofPredicate(e, t) {
  var r = 'isMobX' + e
  return (
    (t.prototype[r] = !0),
    function (e) {
      return isObject(e) && !0 === e[r]
    }
  )
}
function areBothNaN(e, t) {
  return 'number' == typeof e && 'number' == typeof t && isNaN(e) && isNaN(t)
}
function isArrayLike(e) {
  return Array.isArray(e) || isObservableArray(e)
}
function isES6Map(e) {
  return void 0 !== getGlobal().Map && e instanceof getGlobal().Map
}
function isES6Set(e) {
  return e instanceof Set
}
function iteratorToArray(e) {
  for (var t = []; ; ) {
    var r = e.next()
    if (r.done) break
    t.push(r.value)
  }
  return t
}
function primitiveSymbol() {
  return ('function' == typeof Symbol && Symbol.toPrimitive) || '@@toPrimitive'
}
function toPrimitive(e) {
  return null === e ? null : 'object' == typeof e ? '' + e : e
}
function iteratorSymbol() {
  return ('function' == typeof Symbol && Symbol.iterator) || '@@iterator'
}
function declareIterator(e, t) {
  addHiddenFinalProp(e, iteratorSymbol(), t)
}
function makeIterable(e) {
  return (e[iteratorSymbol()] = self), e
}
function toStringTagSymbol() {
  return ('function' == typeof Symbol && Symbol.toStringTag) || '@@toStringTag'
}
function self() {
  return this
}
var Atom = (function () {
    function e(e) {
      void 0 === e && (e = 'Atom@' + getNextId()),
        (this.name = e),
        (this.isPendingUnobservation = !1),
        (this.isBeingObserved = !1),
        (this.observers = []),
        (this.observersIndexes = {}),
        (this.diffValue = 0),
        (this.lastAccessedBy = 0),
        (this.lowestObserverState = exports.IDerivationState.NOT_TRACKING)
    }
    return (
      (e.prototype.onBecomeUnobserved = function () {}),
      (e.prototype.onBecomeObserved = function () {}),
      (e.prototype.reportObserved = function () {
        return reportObserved(this)
      }),
      (e.prototype.reportChanged = function () {
        startBatch(), propagateChanged(this), endBatch()
      }),
      (e.prototype.toString = function () {
        return this.name
      }),
      e
    )
  })(),
  isAtom = createInstanceofPredicate('Atom', Atom)
function createAtom(e, t, r) {
  void 0 === t && (t = noop), void 0 === r && (r = noop)
  var n = new Atom(e)
  return onBecomeObserved(n, t), onBecomeUnobserved(n, r), n
}
function identityComparer(e, t) {
  return e === t
}
function structuralComparer(e, t) {
  return deepEqual(e, t)
}
function defaultComparer(e, t) {
  return areBothNaN(e, t) || identityComparer(e, t)
}
var comparer = {
    identity: identityComparer,
    structural: structuralComparer,
    default: defaultComparer,
  },
  enumerableDescriptorCache = {},
  nonEnumerableDescriptorCache = {}
function createPropertyInitializerDescriptor(e, t) {
  var r = t ? enumerableDescriptorCache : nonEnumerableDescriptorCache
  return (
    r[e] ||
    (r[e] = {
      configurable: !0,
      enumerable: t,
      get: function () {
        return initializeInstance(this), this[e]
      },
      set: function (t) {
        initializeInstance(this), (this[e] = t)
      },
    })
  )
}
function initializeInstance(e) {
  if (!0 !== e.__mobxDidRunLazyInitializers) {
    var t = e.__mobxDecorators
    if (t)
      for (var r in (addHiddenProp(e, '__mobxDidRunLazyInitializers', !0), t)) {
        var n = t[r]
        n.propertyCreator(
          e,
          n.prop,
          n.descriptor,
          n.decoratorTarget,
          n.decoratorArguments,
        )
      }
  }
}
function createPropDecorator(e, t) {
  return function () {
    var r,
      n = function (n, o, a, i) {
        if (!0 === i) return t(n, o, a, n, r), null
        if (!Object.prototype.hasOwnProperty.call(n, '__mobxDecorators')) {
          var s = n.__mobxDecorators
          addHiddenProp(n, '__mobxDecorators', __assign({}, s))
        }
        return (
          (n.__mobxDecorators[o] = {
            prop: o,
            propertyCreator: t,
            descriptor: a,
            decoratorTarget: n,
            decoratorArguments: r,
          }),
          createPropertyInitializerDescriptor(o, e)
        )
      }
    return quacksLikeADecorator(arguments)
      ? ((r = EMPTY_ARRAY), n.apply(null, arguments))
      : ((r = Array.prototype.slice.call(arguments)), n)
  }
}
function quacksLikeADecorator(e) {
  return (
    ((2 === e.length || 3 === e.length) && 'string' == typeof e[1]) ||
    (4 === e.length && !0 === e[3])
  )
}
function deepEnhancer(e, t, r) {
  return isObservable(e)
    ? e
    : Array.isArray(e)
    ? observable.array(e, { name: r })
    : isPlainObject(e)
    ? observable.object(e, void 0, { name: r })
    : isES6Map(e)
    ? observable.map(e, { name: r })
    : isES6Set(e)
    ? observable.set(e, { name: r })
    : e
}
function shallowEnhancer(e, t, r) {
  return null == e
    ? e
    : isObservableObject(e) ||
      isObservableArray(e) ||
      isObservableMap(e) ||
      isObservableSet(e)
    ? e
    : Array.isArray(e)
    ? observable.array(e, { name: r, deep: !1 })
    : isPlainObject(e)
    ? observable.object(e, void 0, { name: r, deep: !1 })
    : isES6Map(e)
    ? observable.map(e, { name: r, deep: !1 })
    : isES6Set(e)
    ? observable.set(e, { name: r, deep: !1 })
    : fail(!1)
}
function referenceEnhancer(e) {
  return e
}
function refStructEnhancer(e, t, r) {
  return deepEqual(e, t) ? t : e
}
function createDecoratorForEnhancer(e) {
  var t = createPropDecorator(!0, function (t, r, n, o, a) {
      defineObservableProperty(
        t,
        r,
        n ? (n.initializer ? n.initializer.call(t) : n.value) : void 0,
        e,
      )
    }),
    r = ('undefined' != typeof process && process.env, t)
  return (r.enhancer = e), r
}
var defaultCreateObservableOptions = {
    deep: !0,
    name: void 0,
    defaultDecorator: void 0,
  },
  shallowCreateObservableOptions = {
    deep: !1,
    name: void 0,
    defaultDecorator: void 0,
  }
function asCreateObservableOptions(e) {
  return null == e
    ? defaultCreateObservableOptions
    : 'string' == typeof e
    ? { name: e, deep: !0 }
    : e
}
function getEnhancerFromOptions(e) {
  return e.defaultDecorator
    ? e.defaultDecorator.enhancer
    : !1 === e.deep
    ? referenceEnhancer
    : deepEnhancer
}
Object.freeze(defaultCreateObservableOptions),
  Object.freeze(shallowCreateObservableOptions)
var deepDecorator = createDecoratorForEnhancer(deepEnhancer),
  shallowDecorator = createDecoratorForEnhancer(shallowEnhancer),
  refDecorator = createDecoratorForEnhancer(referenceEnhancer),
  refStructDecorator = createDecoratorForEnhancer(refStructEnhancer)
function createObservable(e, t, r) {
  if ('string' == typeof arguments[1])
    return deepDecorator.apply(null, arguments)
  if (isObservable(e)) return e
  var n = isPlainObject(e)
    ? observable.object(e, t, r)
    : Array.isArray(e)
    ? observable.array(e, t)
    : isES6Map(e)
    ? observable.map(e, t)
    : isES6Set(e)
    ? observable.set(e, t)
    : e
  if (n !== e) return n
  fail(!1)
}
var observableFactories = {
    box: function (e, t) {
      arguments.length > 2 && incorrectlyUsedAsDecorator('box')
      var r = asCreateObservableOptions(t)
      return new ObservableValue(
        e,
        getEnhancerFromOptions(r),
        r.name,
        !0,
        r.equals,
      )
    },
    shallowBox: function (e, t) {
      return (
        arguments.length > 2 && incorrectlyUsedAsDecorator('shallowBox'),
        deprecated(
          'observable.shallowBox',
          'observable.box(value, { deep: false })',
        ),
        observable.box(e, { name: t, deep: !1 })
      )
    },
    array: function (e, t) {
      arguments.length > 2 && incorrectlyUsedAsDecorator('array')
      var r = asCreateObservableOptions(t)
      return new ObservableArray(e, getEnhancerFromOptions(r), r.name)
    },
    shallowArray: function (e, t) {
      return (
        arguments.length > 2 && incorrectlyUsedAsDecorator('shallowArray'),
        deprecated(
          'observable.shallowArray',
          'observable.array(values, { deep: false })',
        ),
        observable.array(e, { name: t, deep: !1 })
      )
    },
    map: function (e, t) {
      arguments.length > 2 && incorrectlyUsedAsDecorator('map')
      var r = asCreateObservableOptions(t)
      return new ObservableMap(e, getEnhancerFromOptions(r), r.name)
    },
    shallowMap: function (e, t) {
      return (
        arguments.length > 2 && incorrectlyUsedAsDecorator('shallowMap'),
        deprecated(
          'observable.shallowMap',
          'observable.map(values, { deep: false })',
        ),
        observable.map(e, { name: t, deep: !1 })
      )
    },
    set: function (e, t) {
      arguments.length > 2 && incorrectlyUsedAsDecorator('set')
      var r = asCreateObservableOptions(t)
      return new ObservableSet(e, getEnhancerFromOptions(r), r.name)
    },
    object: function (e, t, r) {
      return (
        'string' == typeof arguments[1] && incorrectlyUsedAsDecorator('object'),
        extendObservable({}, e, t, asCreateObservableOptions(r))
      )
    },
    shallowObject: function (e, t) {
      return (
        'string' == typeof arguments[1] &&
          incorrectlyUsedAsDecorator('shallowObject'),
        deprecated(
          'observable.shallowObject',
          'observable.object(values, {}, { deep: false })',
        ),
        observable.object(e, {}, { name: t, deep: !1 })
      )
    },
    ref: refDecorator,
    shallow: shallowDecorator,
    deep: deepDecorator,
    struct: refStructDecorator,
  },
  observable = createObservable
function incorrectlyUsedAsDecorator(e) {
  fail(
    'Expected one or two arguments to observable.' +
      e +
      '. Did you accidentally try to use observable.' +
      e +
      ' as decorator?',
  )
}
Object.keys(observableFactories).forEach(function (e) {
  return (observable[e] = observableFactories[e])
})
var computedDecorator = createPropDecorator(!1, function (e, t, r, n, o) {
    var a = r.get,
      i = r.set,
      s = o[0] || {}
    defineComputedProperty(e, t, __assign({ get: a, set: i }, s))
  }),
  computedStructDecorator = computedDecorator({ equals: comparer.structural }),
  computed = function (e, t, r) {
    if ('string' == typeof t) return computedDecorator.apply(null, arguments)
    if (null !== e && 'object' == typeof e && 1 === arguments.length)
      return computedDecorator.apply(null, arguments)
    var n = 'object' == typeof t ? t : {}
    return (
      (n.get = e),
      (n.set = 'function' == typeof t ? t : n.set),
      (n.name = n.name || e.name || ''),
      new ComputedValue(n)
    )
  }
function createAction(e, t) {
  var r = function () {
    return executeAction(e, t, this, arguments)
  }
  return (r.isMobxAction = !0), r
}
function executeAction(e, t, r, n) {
  var o = startAction(e, t, r, n),
    a = !0
  try {
    var i = t.apply(r, n)
    return (a = !1), i
  } finally {
    a
      ? ((globalState.suppressReactionErrors = a),
        endAction(o),
        (globalState.suppressReactionErrors = !1))
      : endAction(o)
  }
}
function startAction(e, t, r, n) {
  var o = isSpyEnabled() && !!e,
    a = 0
  if (o) {
    a = Date.now()
    var i = (n && n.length) || 0,
      s = new Array(i)
    if (i > 0) for (var c = 0; c < i; c++) s[c] = n[c]
    spyReportStart({ type: 'action', name: e, object: r, arguments: s })
  }
  var l = untrackedStart()
  return (
    startBatch(),
    {
      prevDerivation: l,
      prevAllowStateChanges: allowStateChangesStart(!0),
      notifySpy: o,
      startTime: a,
    }
  )
}
function endAction(e) {
  allowStateChangesEnd(e.prevAllowStateChanges),
    endBatch(),
    untrackedEnd(e.prevDerivation),
    e.notifySpy && spyReportEnd({ time: Date.now() - e.startTime })
}
function allowStateChanges(e, t) {
  var r,
    n = allowStateChangesStart(e)
  try {
    r = t()
  } finally {
    allowStateChangesEnd(n)
  }
  return r
}
function allowStateChangesStart(e) {
  var t = globalState.allowStateChanges
  return (globalState.allowStateChanges = e), t
}
function allowStateChangesEnd(e) {
  globalState.allowStateChanges = e
}
function allowStateChangesInsideComputed(e) {
  var t,
    r = globalState.computationDepth
  globalState.computationDepth = 0
  try {
    t = e()
  } finally {
    globalState.computationDepth = r
  }
  return t
}
computed.struct = computedStructDecorator
var ObservableValue = (function (e) {
  function t(t, r, n, o, a) {
    void 0 === n && (n = 'ObservableValue@' + getNextId()),
      void 0 === o && (o = !0),
      void 0 === a && (a = comparer.default)
    var i = e.call(this, n) || this
    return (
      (i.enhancer = r),
      (i.name = n),
      (i.equals = a),
      (i.hasUnreportedChange = !1),
      (i.value = r(t, void 0, n)),
      o &&
        isSpyEnabled() &&
        spyReport({ type: 'create', name: i.name, newValue: '' + i.value }),
      i
    )
  }
  return (
    __extends(t, e),
    (t.prototype.dehanceValue = function (e) {
      return void 0 !== this.dehancer ? this.dehancer(e) : e
    }),
    (t.prototype.set = function (e) {
      var t = this.value
      if ((e = this.prepareNewValue(e)) !== globalState.UNCHANGED) {
        var r = isSpyEnabled()
        r &&
          spyReportStart({
            type: 'update',
            name: this.name,
            newValue: e,
            oldValue: t,
          }),
          this.setNewValue(e),
          r && spyReportEnd()
      }
    }),
    (t.prototype.prepareNewValue = function (e) {
      if ((checkIfStateModificationsAreAllowed(this), hasInterceptors(this))) {
        var t = interceptChange(this, {
          object: this,
          type: 'update',
          newValue: e,
        })
        if (!t) return globalState.UNCHANGED
        e = t.newValue
      }
      return (
        (e = this.enhancer(e, this.value, this.name)),
        this.equals(this.value, e) ? globalState.UNCHANGED : e
      )
    }),
    (t.prototype.setNewValue = function (e) {
      var t = this.value
      ;(this.value = e),
        this.reportChanged(),
        hasListeners(this) &&
          notifyListeners(this, {
            type: 'update',
            object: this,
            newValue: e,
            oldValue: t,
          })
    }),
    (t.prototype.get = function () {
      return this.reportObserved(), this.dehanceValue(this.value)
    }),
    (t.prototype.intercept = function (e) {
      return registerInterceptor(this, e)
    }),
    (t.prototype.observe = function (e, t) {
      return (
        t &&
          e({
            object: this,
            type: 'update',
            newValue: this.value,
            oldValue: void 0,
          }),
        registerListener(this, e)
      )
    }),
    (t.prototype.toJSON = function () {
      return this.get()
    }),
    (t.prototype.toString = function () {
      return this.name + '[' + this.value + ']'
    }),
    (t.prototype.valueOf = function () {
      return toPrimitive(this.get())
    }),
    t
  )
})(Atom)
ObservableValue.prototype[primitiveSymbol()] = ObservableValue.prototype.valueOf
var isObservableValue = createInstanceofPredicate(
    'ObservableValue',
    ObservableValue,
  ),
  ComputedValue = (function () {
    function e(e) {
      ;(this.dependenciesState = exports.IDerivationState.NOT_TRACKING),
        (this.observing = []),
        (this.newObserving = null),
        (this.isBeingObserved = !1),
        (this.isPendingUnobservation = !1),
        (this.observers = []),
        (this.observersIndexes = {}),
        (this.diffValue = 0),
        (this.runId = 0),
        (this.lastAccessedBy = 0),
        (this.lowestObserverState = exports.IDerivationState.UP_TO_DATE),
        (this.unboundDepsCount = 0),
        (this.__mapid = '#' + getNextId()),
        (this.value = new CaughtException(null)),
        (this.isComputing = !1),
        (this.isRunningSetter = !1),
        (this.isTracing = TraceMode.NONE),
        (this.derivation = e.get),
        (this.name = e.name || 'ComputedValue@' + getNextId()),
        e.set && (this.setter = createAction(this.name + '-setter', e.set)),
        (this.equals =
          e.equals ||
          (e.compareStructural || e.struct
            ? comparer.structural
            : comparer.default)),
        (this.scope = e.context),
        (this.requiresReaction = !!e.requiresReaction),
        (this.keepAlive = !!e.keepAlive)
    }
    return (
      (e.prototype.onBecomeStale = function () {
        propagateMaybeChanged(this)
      }),
      (e.prototype.onBecomeUnobserved = function () {}),
      (e.prototype.onBecomeObserved = function () {}),
      (e.prototype.get = function () {
        this.isComputing &&
          fail(
            'Cycle detected in computation ' +
              this.name +
              ': ' +
              this.derivation,
          ),
          0 !== globalState.inBatch ||
          0 !== this.observers.length ||
          this.keepAlive
            ? (reportObserved(this),
              shouldCompute(this) &&
                this.trackAndCompute() &&
                propagateChangeConfirmed(this))
            : shouldCompute(this) &&
              (this.warnAboutUntrackedRead(),
              startBatch(),
              (this.value = this.computeValue(!1)),
              endBatch())
        var e = this.value
        if (isCaughtException(e)) throw e.cause
        return e
      }),
      (e.prototype.peek = function () {
        var e = this.computeValue(!1)
        if (isCaughtException(e)) throw e.cause
        return e
      }),
      (e.prototype.set = function (e) {
        if (this.setter) {
          invariant(
            !this.isRunningSetter,
            "The setter of computed value '" +
              this.name +
              "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?",
          ),
            (this.isRunningSetter = !0)
          try {
            this.setter.call(this.scope, e)
          } finally {
            this.isRunningSetter = !1
          }
        } else invariant(!1, !1)
      }),
      (e.prototype.trackAndCompute = function () {
        isSpyEnabled() &&
          spyReport({ object: this.scope, type: 'compute', name: this.name })
        var e = this.value,
          t = this.dependenciesState === exports.IDerivationState.NOT_TRACKING,
          r = this.computeValue(!0),
          n =
            t ||
            isCaughtException(e) ||
            isCaughtException(r) ||
            !this.equals(e, r)
        return n && (this.value = r), n
      }),
      (e.prototype.computeValue = function (e) {
        var t
        if (((this.isComputing = !0), globalState.computationDepth++, e))
          t = trackDerivedFunction(this, this.derivation, this.scope)
        else if (!0 === globalState.disableErrorBoundaries)
          t = this.derivation.call(this.scope)
        else
          try {
            t = this.derivation.call(this.scope)
          } catch (e) {
            t = new CaughtException(e)
          }
        return globalState.computationDepth--, (this.isComputing = !1), t
      }),
      (e.prototype.suspend = function () {
        this.keepAlive || (clearObserving(this), (this.value = void 0))
      }),
      (e.prototype.observe = function (e, t) {
        var r = this,
          n = !0,
          o = void 0
        return autorun(function () {
          var a = r.get()
          if (!n || t) {
            var i = untrackedStart()
            e({ type: 'update', object: r, newValue: a, oldValue: o }),
              untrackedEnd(i)
          }
          ;(n = !1), (o = a)
        })
      }),
      (e.prototype.warnAboutUntrackedRead = function () {}),
      (e.prototype.toJSON = function () {
        return this.get()
      }),
      (e.prototype.toString = function () {
        return this.name + '[' + this.derivation.toString() + ']'
      }),
      (e.prototype.valueOf = function () {
        return toPrimitive(this.get())
      }),
      e
    )
  })()
ComputedValue.prototype[primitiveSymbol()] = ComputedValue.prototype.valueOf
var TraceMode,
  isComputedValue = createInstanceofPredicate('ComputedValue', ComputedValue)
!(function (e) {
  ;(e[(e.NOT_TRACKING = -1)] = 'NOT_TRACKING'),
    (e[(e.UP_TO_DATE = 0)] = 'UP_TO_DATE'),
    (e[(e.POSSIBLY_STALE = 1)] = 'POSSIBLY_STALE'),
    (e[(e.STALE = 2)] = 'STALE')
})(exports.IDerivationState || (exports.IDerivationState = {})),
  (function (e) {
    ;(e[(e.NONE = 0)] = 'NONE'),
      (e[(e.LOG = 1)] = 'LOG'),
      (e[(e.BREAK = 2)] = 'BREAK')
  })(TraceMode || (TraceMode = {}))
var CaughtException = (function () {
  return function (e) {
    this.cause = e
  }
})()
function isCaughtException(e) {
  return e instanceof CaughtException
}
function shouldCompute(e) {
  switch (e.dependenciesState) {
    case exports.IDerivationState.UP_TO_DATE:
      return !1
    case exports.IDerivationState.NOT_TRACKING:
    case exports.IDerivationState.STALE:
      return !0
    case exports.IDerivationState.POSSIBLY_STALE:
      for (
        var t = untrackedStart(), r = e.observing, n = r.length, o = 0;
        o < n;
        o++
      ) {
        var a = r[o]
        if (isComputedValue(a)) {
          if (globalState.disableErrorBoundaries) a.get()
          else
            try {
              a.get()
            } catch (e) {
              return untrackedEnd(t), !0
            }
          if (e.dependenciesState === exports.IDerivationState.STALE)
            return untrackedEnd(t), !0
        }
      }
      return changeDependenciesStateTo0(e), untrackedEnd(t), !1
  }
}
function isComputingDerivation() {
  return null !== globalState.trackingDerivation
}
function checkIfStateModificationsAreAllowed(e) {
  var t = e.observers.length > 0
  globalState.computationDepth > 0 && t && fail(!1),
    globalState.allowStateChanges ||
      (!t && 'strict' !== globalState.enforceActions) ||
      fail(!1)
}
function trackDerivedFunction(e, t, r) {
  changeDependenciesStateTo0(e),
    (e.newObserving = new Array(e.observing.length + 100)),
    (e.unboundDepsCount = 0),
    (e.runId = ++globalState.runId)
  var n,
    o = globalState.trackingDerivation
  if (
    ((globalState.trackingDerivation = e),
    !0 === globalState.disableErrorBoundaries)
  )
    n = t.call(r)
  else
    try {
      n = t.call(r)
    } catch (e) {
      n = new CaughtException(e)
    }
  return (globalState.trackingDerivation = o), bindDependencies(e), n
}
function bindDependencies(e) {
  for (
    var t = e.observing,
      r = (e.observing = e.newObserving),
      n = exports.IDerivationState.UP_TO_DATE,
      o = 0,
      a = e.unboundDepsCount,
      i = 0;
    i < a;
    i++
  ) {
    0 === (s = r[i]).diffValue &&
      ((s.diffValue = 1), o !== i && (r[o] = s), o++),
      s.dependenciesState > n && (n = s.dependenciesState)
  }
  for (r.length = o, e.newObserving = null, a = t.length; a--; ) {
    0 === (s = t[a]).diffValue && removeObserver(s, e), (s.diffValue = 0)
  }
  for (; o--; ) {
    var s
    1 === (s = r[o]).diffValue && ((s.diffValue = 0), addObserver(s, e))
  }
  n !== exports.IDerivationState.UP_TO_DATE &&
    ((e.dependenciesState = n), e.onBecomeStale())
}
function clearObserving(e) {
  var t = e.observing
  e.observing = []
  for (var r = t.length; r--; ) removeObserver(t[r], e)
  e.dependenciesState = exports.IDerivationState.NOT_TRACKING
}
function untracked(e) {
  var t = untrackedStart(),
    r = e()
  return untrackedEnd(t), r
}
function untrackedStart() {
  var e = globalState.trackingDerivation
  return (globalState.trackingDerivation = null), e
}
function untrackedEnd(e) {
  globalState.trackingDerivation = e
}
function changeDependenciesStateTo0(e) {
  if (e.dependenciesState !== exports.IDerivationState.UP_TO_DATE) {
    e.dependenciesState = exports.IDerivationState.UP_TO_DATE
    for (var t = e.observing, r = t.length; r--; )
      t[r].lowestObserverState = exports.IDerivationState.UP_TO_DATE
  }
}
var persistentKeys = [
    'mobxGuid',
    'spyListeners',
    'enforceActions',
    'computedRequiresReaction',
    'disableErrorBoundaries',
    'runId',
    'UNCHANGED',
  ],
  MobXGlobals = (function () {
    return function () {
      ;(this.version = 5),
        (this.UNCHANGED = {}),
        (this.trackingDerivation = null),
        (this.computationDepth = 0),
        (this.runId = 0),
        (this.mobxGuid = 0),
        (this.inBatch = 0),
        (this.pendingUnobservations = []),
        (this.pendingReactions = []),
        (this.isRunningReactions = !1),
        (this.allowStateChanges = !0),
        (this.enforceActions = !1),
        (this.spyListeners = []),
        (this.globalReactionErrorHandlers = []),
        (this.computedRequiresReaction = !1),
        (this.computedConfigurable = !1),
        (this.disableErrorBoundaries = !1),
        (this.suppressReactionErrors = !1)
    }
  })(),
  canMergeGlobalState = !0,
  isolateCalled = !1,
  globalState = (function () {
    var e = getGlobal()
    return (
      e.__mobxInstanceCount > 0 &&
        !e.__mobxGlobals &&
        (canMergeGlobalState = !1),
      e.__mobxGlobals &&
        e.__mobxGlobals.version !== new MobXGlobals().version &&
        (canMergeGlobalState = !1),
      canMergeGlobalState
        ? e.__mobxGlobals
          ? ((e.__mobxInstanceCount += 1),
            e.__mobxGlobals.UNCHANGED || (e.__mobxGlobals.UNCHANGED = {}),
            e.__mobxGlobals)
          : ((e.__mobxInstanceCount = 1), (e.__mobxGlobals = new MobXGlobals()))
        : (setTimeout(function () {
            isolateCalled ||
              fail(
                'There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`',
              )
          }, 1),
          new MobXGlobals())
    )
  })()
function isolateGlobalState() {
  ;(globalState.pendingReactions.length ||
    globalState.inBatch ||
    globalState.isRunningReactions) &&
    fail(
      'isolateGlobalState should be called before MobX is running any reactions',
    ),
    (isolateCalled = !0),
    canMergeGlobalState &&
      (0 == --getGlobal().__mobxInstanceCount &&
        (getGlobal().__mobxGlobals = void 0),
      (globalState = new MobXGlobals()))
}
function getGlobalState() {
  return globalState
}
function resetGlobalState() {
  var e = new MobXGlobals()
  for (var t in e) -1 === persistentKeys.indexOf(t) && (globalState[t] = e[t])
  globalState.allowStateChanges = !globalState.enforceActions
}
function hasObservers(e) {
  return e.observers && e.observers.length > 0
}
function getObservers(e) {
  return e.observers
}
function addObserver(e, t) {
  var r = e.observers.length
  r && (e.observersIndexes[t.__mapid] = r),
    (e.observers[r] = t),
    e.lowestObserverState > t.dependenciesState &&
      (e.lowestObserverState = t.dependenciesState)
}
function removeObserver(e, t) {
  if (1 === e.observers.length)
    (e.observers.length = 0), queueForUnobservation(e)
  else {
    var r = e.observers,
      n = e.observersIndexes,
      o = r.pop()
    if (o !== t) {
      var a = n[t.__mapid] || 0
      a ? (n[o.__mapid] = a) : delete n[o.__mapid], (r[a] = o)
    }
    delete n[t.__mapid]
  }
}
function queueForUnobservation(e) {
  !1 === e.isPendingUnobservation &&
    ((e.isPendingUnobservation = !0), globalState.pendingUnobservations.push(e))
}
function startBatch() {
  globalState.inBatch++
}
function endBatch() {
  if (0 == --globalState.inBatch) {
    runReactions()
    for (var e = globalState.pendingUnobservations, t = 0; t < e.length; t++) {
      var r = e[t]
      ;(r.isPendingUnobservation = !1),
        0 === r.observers.length &&
          (r.isBeingObserved &&
            ((r.isBeingObserved = !1), r.onBecomeUnobserved()),
          r instanceof ComputedValue && r.suspend())
    }
    globalState.pendingUnobservations = []
  }
}
function reportObserved(e) {
  var t = globalState.trackingDerivation
  return null !== t
    ? (t.runId !== e.lastAccessedBy &&
        ((e.lastAccessedBy = t.runId),
        (t.newObserving[t.unboundDepsCount++] = e),
        e.isBeingObserved || ((e.isBeingObserved = !0), e.onBecomeObserved())),
      !0)
    : (0 === e.observers.length &&
        globalState.inBatch > 0 &&
        queueForUnobservation(e),
      !1)
}
function propagateChanged(e) {
  if (e.lowestObserverState !== exports.IDerivationState.STALE) {
    e.lowestObserverState = exports.IDerivationState.STALE
    for (var t = e.observers, r = t.length; r--; ) {
      var n = t[r]
      n.dependenciesState === exports.IDerivationState.UP_TO_DATE &&
        (n.isTracing !== TraceMode.NONE && logTraceInfo(n, e),
        n.onBecomeStale()),
        (n.dependenciesState = exports.IDerivationState.STALE)
    }
  }
}
function propagateChangeConfirmed(e) {
  if (e.lowestObserverState !== exports.IDerivationState.STALE) {
    e.lowestObserverState = exports.IDerivationState.STALE
    for (var t = e.observers, r = t.length; r--; ) {
      var n = t[r]
      n.dependenciesState === exports.IDerivationState.POSSIBLY_STALE
        ? (n.dependenciesState = exports.IDerivationState.STALE)
        : n.dependenciesState === exports.IDerivationState.UP_TO_DATE &&
          (e.lowestObserverState = exports.IDerivationState.UP_TO_DATE)
    }
  }
}
function propagateMaybeChanged(e) {
  if (e.lowestObserverState === exports.IDerivationState.UP_TO_DATE) {
    e.lowestObserverState = exports.IDerivationState.POSSIBLY_STALE
    for (var t = e.observers, r = t.length; r--; ) {
      var n = t[r]
      n.dependenciesState === exports.IDerivationState.UP_TO_DATE &&
        ((n.dependenciesState = exports.IDerivationState.POSSIBLY_STALE),
        n.isTracing !== TraceMode.NONE && logTraceInfo(n, e),
        n.onBecomeStale())
    }
  }
}
function logTraceInfo(e, t) {
  if (
    (console.log(
      "[mobx.trace] '" +
        e.name +
        "' is invalidated due to a change in: '" +
        t.name +
        "'",
    ),
    e.isTracing === TraceMode.BREAK)
  ) {
    var r = []
    printDepTree(getDependencyTree(e), r, 1),
      new Function(
        "debugger;\n/*\nTracing '" +
          e.name +
          "'\n\nYou are entering this break point because derivation '" +
          e.name +
          "' is being traced and '" +
          t.name +
          "' is now forcing it to update.\nJust follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update\nThe stackframe you are looking for is at least ~6-8 stack-frames up.\n\n" +
          (e instanceof ComputedValue
            ? e.derivation.toString().replace(/[*]\//g, '/')
            : '') +
          '\n\nThe dependencies for this derivation are:\n\n' +
          r.join('\n') +
          '\n*/\n    ',
      )()
  }
}
function printDepTree(e, t, r) {
  t.length >= 1e3
    ? t.push('(and many more)')
    : (t.push('' + new Array(r).join('\t') + e.name),
      e.dependencies &&
        e.dependencies.forEach(function (e) {
          return printDepTree(e, t, r + 1)
        }))
}
var Reaction = (function () {
  function e(e, t, r) {
    void 0 === e && (e = 'Reaction@' + getNextId()),
      (this.name = e),
      (this.onInvalidate = t),
      (this.errorHandler = r),
      (this.observing = []),
      (this.newObserving = []),
      (this.dependenciesState = exports.IDerivationState.NOT_TRACKING),
      (this.diffValue = 0),
      (this.runId = 0),
      (this.unboundDepsCount = 0),
      (this.__mapid = '#' + getNextId()),
      (this.isDisposed = !1),
      (this._isScheduled = !1),
      (this._isTrackPending = !1),
      (this._isRunning = !1),
      (this.isTracing = TraceMode.NONE)
  }
  return (
    (e.prototype.onBecomeStale = function () {
      this.schedule()
    }),
    (e.prototype.schedule = function () {
      this._isScheduled ||
        ((this._isScheduled = !0),
        globalState.pendingReactions.push(this),
        runReactions())
    }),
    (e.prototype.isScheduled = function () {
      return this._isScheduled
    }),
    (e.prototype.runReaction = function () {
      if (!this.isDisposed) {
        if ((startBatch(), (this._isScheduled = !1), shouldCompute(this))) {
          this._isTrackPending = !0
          try {
            this.onInvalidate(),
              this._isTrackPending &&
                isSpyEnabled() &&
                spyReport({ name: this.name, type: 'scheduled-reaction' })
          } catch (e) {
            this.reportExceptionInDerivation(e)
          }
        }
        endBatch()
      }
    }),
    (e.prototype.track = function (e) {
      startBatch()
      var t,
        r = isSpyEnabled()
      r &&
        ((t = Date.now()),
        spyReportStart({ name: this.name, type: 'reaction' })),
        (this._isRunning = !0)
      var n = trackDerivedFunction(this, e, void 0)
      ;(this._isRunning = !1),
        (this._isTrackPending = !1),
        this.isDisposed && clearObserving(this),
        isCaughtException(n) && this.reportExceptionInDerivation(n.cause),
        r && spyReportEnd({ time: Date.now() - t }),
        endBatch()
    }),
    (e.prototype.reportExceptionInDerivation = function (e) {
      var t = this
      if (this.errorHandler) this.errorHandler(e, this)
      else {
        if (globalState.disableErrorBoundaries) throw e
        var r =
          "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" +
          this +
          "'"
        globalState.suppressReactionErrors
          ? console.warn(
              "[mobx] (error in reaction '" +
                this.name +
                "' suppressed, fix error of causing action below)",
            )
          : console.error(r, e),
          isSpyEnabled() &&
            spyReport({
              type: 'error',
              name: this.name,
              message: r,
              error: '' + e,
            }),
          globalState.globalReactionErrorHandlers.forEach(function (r) {
            return r(e, t)
          })
      }
    }),
    (e.prototype.dispose = function () {
      this.isDisposed ||
        ((this.isDisposed = !0),
        this._isRunning || (startBatch(), clearObserving(this), endBatch()))
    }),
    (e.prototype.getDisposer = function () {
      var e = this.dispose.bind(this)
      return (e.$mobx = this), e
    }),
    (e.prototype.toString = function () {
      return 'Reaction[' + this.name + ']'
    }),
    (e.prototype.trace = function (e) {
      void 0 === e && (e = !1), trace(this, e)
    }),
    e
  )
})()
function onReactionError(e) {
  return (
    globalState.globalReactionErrorHandlers.push(e),
    function () {
      var t = globalState.globalReactionErrorHandlers.indexOf(e)
      t >= 0 && globalState.globalReactionErrorHandlers.splice(t, 1)
    }
  )
}
var MAX_REACTION_ITERATIONS = 100,
  reactionScheduler = function (e) {
    return e()
  }
function runReactions() {
  globalState.inBatch > 0 ||
    globalState.isRunningReactions ||
    reactionScheduler(runReactionsHelper)
}
function runReactionsHelper() {
  globalState.isRunningReactions = !0
  for (var e = globalState.pendingReactions, t = 0; e.length > 0; ) {
    ++t === MAX_REACTION_ITERATIONS &&
      (console.error(
        "Reaction doesn't converge to a stable state after " +
          MAX_REACTION_ITERATIONS +
          ' iterations. Probably there is a cycle in the reactive function: ' +
          e[0],
      ),
      e.splice(0))
    for (var r = e.splice(0), n = 0, o = r.length; n < o; n++)
      r[n].runReaction()
  }
  globalState.isRunningReactions = !1
}
var isReaction = createInstanceofPredicate('Reaction', Reaction)
function setReactionScheduler(e) {
  var t = reactionScheduler
  reactionScheduler = function (r) {
    return e(function () {
      return t(r)
    })
  }
}
function isSpyEnabled() {
  return !!globalState.spyListeners.length
}
function spyReport(e) {
  if (globalState.spyListeners.length)
    for (var t = globalState.spyListeners, r = 0, n = t.length; r < n; r++)
      t[r](e)
}
function spyReportStart(e) {
  spyReport(__assign({}, e, { spyReportStart: !0 }))
}
var END_EVENT = { spyReportEnd: !0 }
function spyReportEnd(e) {
  spyReport(e ? __assign({}, e, { spyReportEnd: !0 }) : END_EVENT)
}
function spy(e) {
  return (
    globalState.spyListeners.push(e),
    once(function () {
      globalState.spyListeners = globalState.spyListeners.filter(function (t) {
        return t !== e
      })
    })
  )
}
function dontReassignFields() {
  fail(!1)
}
function namedActionDecorator(e) {
  return function (t, r, n) {
    if (n) {
      if (n.value)
        return {
          value: createAction(e, n.value),
          enumerable: !1,
          configurable: !0,
          writable: !0,
        }
      var o = n.initializer
      return {
        enumerable: !1,
        configurable: !0,
        writable: !0,
        initializer: function () {
          return createAction(e, o.call(this))
        },
      }
    }
    return actionFieldDecorator(e).apply(this, arguments)
  }
}
function actionFieldDecorator(e) {
  return function (t, r, n) {
    Object.defineProperty(t, r, {
      configurable: !0,
      enumerable: !1,
      get: function () {},
      set: function (t) {
        addHiddenProp(this, r, action(e, t))
      },
    })
  }
}
function boundActionDecorator(e, t, r, n) {
  return !0 === n
    ? (defineBoundAction(e, t, r.value), null)
    : r
    ? {
        configurable: !0,
        enumerable: !1,
        get: function () {
          return (
            defineBoundAction(this, t, r.value || r.initializer.call(this)),
            this[t]
          )
        },
        set: dontReassignFields,
      }
    : {
        enumerable: !1,
        configurable: !0,
        set: function (e) {
          defineBoundAction(this, t, e)
        },
        get: function () {},
      }
}
var action = function (e, t, r, n) {
  return 1 === arguments.length && 'function' == typeof e
    ? createAction(e.name || '<unnamed action>', e)
    : 2 === arguments.length && 'function' == typeof t
    ? createAction(e, t)
    : 1 === arguments.length && 'string' == typeof e
    ? namedActionDecorator(e)
    : !0 !== n
    ? namedActionDecorator(t).apply(null, arguments)
    : void (e[t] = createAction(e.name || t, r.value))
}
function runInAction(e, t) {
  return executeAction(
    'string' == typeof e ? e : e.name || '<unnamed action>',
    'function' == typeof e ? e : t,
    this,
    void 0,
  )
}
function isAction(e) {
  return 'function' == typeof e && !0 === e.isMobxAction
}
function defineBoundAction(e, t, r) {
  addHiddenProp(e, t, createAction(t, r.bind(e)))
}
function autorun(e, t) {
  void 0 === t && (t = EMPTY_OBJECT)
  var r,
    n = (t && t.name) || e.name || 'Autorun@' + getNextId()
  if (!t.scheduler && !t.delay)
    r = new Reaction(
      n,
      function () {
        this.track(i)
      },
      t.onError,
    )
  else {
    var o = createSchedulerFromOptions(t),
      a = !1
    r = new Reaction(
      n,
      function () {
        a ||
          ((a = !0),
          o(function () {
            ;(a = !1), r.isDisposed || r.track(i)
          }))
      },
      t.onError,
    )
  }
  function i() {
    e(r)
  }
  return r.schedule(), r.getDisposer()
}
action.bound = boundActionDecorator
var run = function (e) {
  return e()
}
function createSchedulerFromOptions(e) {
  return e.scheduler
    ? e.scheduler
    : e.delay
    ? function (t) {
        return setTimeout(t, e.delay)
      }
    : run
}
function reaction(e, t, r) {
  void 0 === r && (r = EMPTY_OBJECT),
    'boolean' == typeof r &&
      ((r = { fireImmediately: r }),
      deprecated(
        "Using fireImmediately as argument is deprecated. Use '{ fireImmediately: true }' instead",
      ))
  var n,
    o = r.name || 'Reaction@' + getNextId(),
    a = action(o, r.onError ? wrapErrorHandler(r.onError, t) : t),
    i = !r.scheduler && !r.delay,
    s = createSchedulerFromOptions(r),
    c = !0,
    l = !1,
    u = r.compareStructural
      ? comparer.structural
      : r.equals || comparer.default,
    p = new Reaction(
      o,
      function () {
        c || i ? b() : l || ((l = !0), s(b))
      },
      r.onError,
    )
  function b() {
    if (((l = !1), !p.isDisposed)) {
      var t = !1
      p.track(function () {
        var r = e(p)
        ;(t = c || !u(n, r)), (n = r)
      }),
        c && r.fireImmediately && a(n, p),
        c || !0 !== t || a(n, p),
        c && (c = !1)
    }
  }
  return p.schedule(), p.getDisposer()
}
function wrapErrorHandler(e, t) {
  return function () {
    try {
      return t.apply(this, arguments)
    } catch (t) {
      e.call(this, t)
    }
  }
}
function onBecomeObserved(e, t, r) {
  return interceptHook('onBecomeObserved', e, t, r)
}
function onBecomeUnobserved(e, t, r) {
  return interceptHook('onBecomeUnobserved', e, t, r)
}
function interceptHook(e, t, r, n) {
  var o = 'string' == typeof r ? getAtom(t, r) : getAtom(t),
    a = 'string' == typeof r ? n : r,
    i = o[e]
  return 'function' != typeof i
    ? fail(!1)
    : ((o[e] = function () {
        i.call(this), a.call(this)
      }),
      function () {
        o[e] = i
      })
}
function configure(e) {
  var t = e.enforceActions,
    r = e.computedRequiresReaction,
    n = e.computedConfigurable,
    o = e.disableErrorBoundaries,
    a = e.arrayBuffer,
    i = e.reactionScheduler
  if ((!0 === e.isolateGlobalState && isolateGlobalState(), void 0 !== t)) {
    ;('boolean' != typeof t && 'strict' !== t) ||
      deprecated(
        "Deprecated value for 'enforceActions', use 'false' => '\"never\"', 'true' => '\"observed\"', '\"strict\"' => \"'always'\" instead",
      )
    var s = void 0
    switch (t) {
      case !0:
      case 'observed':
        s = !0
        break
      case !1:
      case 'never':
        s = !1
        break
      case 'strict':
      case 'always':
        s = 'strict'
        break
      default:
        fail(
          "Invalid value for 'enforceActions': '" +
            t +
            "', expected 'never', 'always' or 'observed'",
        )
    }
    ;(globalState.enforceActions = s),
      (globalState.allowStateChanges = !0 !== s && 'strict' !== s)
  }
  void 0 !== r && (globalState.computedRequiresReaction = !!r),
    void 0 !== n && (globalState.computedConfigurable = !!n),
    void 0 !== o &&
      (!0 === o &&
        console.warn(
          'WARNING: Debug feature only. MobX will NOT recover from errors if this is on.',
        ),
      (globalState.disableErrorBoundaries = !!o)),
    'number' == typeof a && reserveArrayBuffer(a),
    i && setReactionScheduler(i)
}
function decorate(e, t) {
  var r = 'function' == typeof e ? e.prototype : e,
    n = function (e) {
      var n = t[e]
      Array.isArray(n) || (n = [n])
      var o = Object.getOwnPropertyDescriptor(r, e),
        a = n.reduce(function (t, n) {
          return n(r, e, t)
        }, o)
      a && Object.defineProperty(r, e, a)
    }
  for (var o in t) n(o)
  return e
}
function extendShallowObservable(e, t, r) {
  return (
    deprecated(
      "'extendShallowObservable' is deprecated, use 'extendObservable(target, props, { deep: false })' instead",
    ),
    extendObservable(e, t, r, shallowCreateObservableOptions)
  )
}
function extendObservable(e, t, r, n) {
  var o =
    (n = asCreateObservableOptions(n)).defaultDecorator ||
    (!1 === n.deep ? refDecorator : deepDecorator)
  initializeInstance(e), asObservableObject(e, n.name, o.enhancer), startBatch()
  try {
    for (var a in t) {
      var i = Object.getOwnPropertyDescriptor(t, a)
      0
      var s = r && a in r ? r[a] : i.get ? computedDecorator : o
      0
      var c = s(e, a, i, !0)
      c && Object.defineProperty(e, a, c)
    }
  } finally {
    endBatch()
  }
  return e
}
function getDependencyTree(e, t) {
  return nodeToDependencyTree(getAtom(e, t))
}
function nodeToDependencyTree(e) {
  var t = { name: e.name }
  return (
    e.observing &&
      e.observing.length > 0 &&
      (t.dependencies = unique(e.observing).map(nodeToDependencyTree)),
    t
  )
}
function getObserverTree(e, t) {
  return nodeToObserverTree(getAtom(e, t))
}
function nodeToObserverTree(e) {
  var t = { name: e.name }
  return (
    hasObservers(e) && (t.observers = getObservers(e).map(nodeToObserverTree)),
    t
  )
}
var generatorId = 0
function flow(e) {
  1 !== arguments.length &&
    fail('Flow expects one 1 argument and cannot be used as decorator')
  var t = e.name || '<unnamed flow>'
  return function () {
    var r,
      n = arguments,
      o = ++generatorId,
      a = action(t + ' - runid: ' + o + ' - init', e).apply(this, n),
      i = void 0,
      s = new Promise(function (e, n) {
        var s = 0
        function c(e) {
          var r
          i = void 0
          try {
            r = action(t + ' - runid: ' + o + ' - yield ' + s++, a.next).call(
              a,
              e,
            )
          } catch (e) {
            return n(e)
          }
          u(r)
        }
        function l(e) {
          var r
          i = void 0
          try {
            r = action(t + ' - runid: ' + o + ' - yield ' + s++, a.throw).call(
              a,
              e,
            )
          } catch (e) {
            return n(e)
          }
          u(r)
        }
        function u(t) {
          if (!t || 'function' != typeof t.then)
            return t.done
              ? e(t.value)
              : (i = Promise.resolve(t.value)).then(c, l)
          t.then(u, n)
        }
        ;(r = n), c(void 0)
      })
    return (
      (s.cancel = action(t + ' - runid: ' + o + ' - cancel', function () {
        try {
          i && cancelPromise(i)
          var e = a.return(),
            t = Promise.resolve(e.value)
          t.then(noop, noop), cancelPromise(t), r(new Error('FLOW_CANCELLED'))
        } catch (e) {
          r(e)
        }
      })),
      s
    )
  }
}
function cancelPromise(e) {
  'function' == typeof e.cancel && e.cancel()
}
function interceptReads(e, t, r) {
  var n
  if (isObservableMap(e) || isObservableArray(e) || isObservableValue(e))
    n = getAdministration(e)
  else {
    if (!isObservableObject(e)) return fail(!1)
    if ('string' != typeof t) return fail(!1)
    n = getAdministration(e, t)
  }
  return void 0 !== n.dehancer
    ? fail(!1)
    : ((n.dehancer = 'function' == typeof t ? t : r),
      function () {
        n.dehancer = void 0
      })
}
function intercept(e, t, r) {
  return 'function' == typeof r
    ? interceptProperty(e, t, r)
    : interceptInterceptable(e, t)
}
function interceptInterceptable(e, t) {
  return getAdministration(e).intercept(t)
}
function interceptProperty(e, t, r) {
  return getAdministration(e, t).intercept(r)
}
function _isComputed(e, t) {
  if (null == e) return !1
  if (void 0 !== t) {
    if (!1 === isObservableObject(e)) return !1
    if (!e.$mobx.values[t]) return !1
    var r = getAtom(e, t)
    return isComputedValue(r)
  }
  return isComputedValue(e)
}
function isComputed(e) {
  return arguments.length > 1 ? fail(!1) : _isComputed(e)
}
function isComputedProp(e, t) {
  return 'string' != typeof t ? fail(!1) : _isComputed(e, t)
}
function _isObservable(e, t) {
  if (null == e) return !1
  if (void 0 !== t) {
    if (isObservableObject(e)) {
      var r = e.$mobx
      return r.values && !!r.values[t]
    }
    return !1
  }
  return (
    isObservableObject(e) ||
    !!e.$mobx ||
    isAtom(e) ||
    isReaction(e) ||
    isComputedValue(e)
  )
}
function isObservable(e) {
  return 1 !== arguments.length && fail(!1), _isObservable(e)
}
function isObservableProp(e, t) {
  return 'string' != typeof t ? fail(!1) : _isObservable(e, t)
}
function keys(e) {
  return isObservableObject(e)
    ? e.$mobx.getKeys()
    : isObservableMap(e)
    ? e._keys.slice()
    : isObservableSet(e)
    ? iteratorToArray(e.keys())
    : isObservableArray(e)
    ? e.map(function (e, t) {
        return t
      })
    : fail(!1)
}
function values(e) {
  return isObservableObject(e)
    ? keys(e).map(function (t) {
        return e[t]
      })
    : isObservableMap(e)
    ? keys(e).map(function (t) {
        return e.get(t)
      })
    : isObservableSet(e)
    ? iteratorToArray(e.values())
    : isObservableArray(e)
    ? e.slice()
    : fail(!1)
}
function entries(e) {
  return isObservableObject(e)
    ? keys(e).map(function (t) {
        return [t, e[t]]
      })
    : isObservableMap(e)
    ? keys(e).map(function (t) {
        return [t, e.get(t)]
      })
    : isObservableSet(e)
    ? iteratorToArray(e.entries())
    : isObservableArray(e)
    ? e.map(function (e, t) {
        return [t, e]
      })
    : fail(!1)
}
function set(e, t, r) {
  if (2 !== arguments.length || isObservableSet(e))
    if (isObservableObject(e)) {
      var n = e.$mobx
      n.values[t]
        ? n.write(e, t, r)
        : defineObservableProperty(e, t, r, n.defaultEnhancer)
    } else if (isObservableMap(e)) e.set(t, r)
    else if (isObservableSet(e)) e.add(t)
    else {
      if (!isObservableArray(e)) return fail(!1)
      'number' != typeof t && (t = parseInt(t, 10)),
        invariant(t >= 0, "Not a valid index: '" + t + "'"),
        startBatch(),
        t >= e.length && (e.length = t + 1),
        (e[t] = r),
        endBatch()
    }
  else {
    startBatch()
    var o = t
    try {
      for (var a in o) set(e, a, o[a])
    } finally {
      endBatch()
    }
  }
}
function remove(e, t) {
  if (isObservableObject(e)) e.$mobx.remove(t)
  else if (isObservableMap(e)) e.delete(t)
  else if (isObservableSet(e)) e.delete(t)
  else {
    if (!isObservableArray(e)) return fail(!1)
    'number' != typeof t && (t = parseInt(t, 10)),
      invariant(t >= 0, "Not a valid index: '" + t + "'"),
      e.splice(t, 1)
  }
}
function has(e, t) {
  if (isObservableObject(e)) {
    var r = getAdministration(e)
    return r.getKeys(), !!r.values[t]
  }
  return isObservableMap(e)
    ? e.has(t)
    : isObservableSet(e)
    ? e.has(t)
    : isObservableArray(e)
    ? t >= 0 && t < e.length
    : fail(!1)
}
function get(e, t) {
  if (has(e, t))
    return isObservableObject(e)
      ? e[t]
      : isObservableMap(e)
      ? e.get(t)
      : isObservableArray(e)
      ? e[t]
      : fail(!1)
}
function observe(e, t, r, n) {
  return 'function' == typeof r
    ? observeObservableProperty(e, t, r, n)
    : observeObservable(e, t, r)
}
function observeObservable(e, t, r) {
  return getAdministration(e).observe(t, r)
}
function observeObservableProperty(e, t, r, n) {
  return getAdministration(e, t).observe(r, n)
}
var defaultOptions = {
  detectCycles: !0,
  exportMapsAsObjects: !0,
  recurseEverything: !1,
}
function cache(e, t, r, n) {
  return n.detectCycles && e.set(t, r), r
}
function toJSHelper(e, t, r) {
  if (!t.recurseEverything && !isObservable(e)) return e
  if ('object' != typeof e) return e
  if (null === e) return null
  if (e instanceof Date) return e
  if (isObservableValue(e)) return toJSHelper(e.get(), t, r)
  if (
    (isObservable(e) && keys(e),
    !0 === t.detectCycles && null !== e && r.has(e))
  )
    return r.get(e)
  if (isObservableArray(e) || Array.isArray(e)) {
    var n = cache(r, e, [], t),
      o = e.map(function (e) {
        return toJSHelper(e, t, r)
      })
    n.length = o.length
    for (var a = 0, i = o.length; a < i; a++) n[a] = o[a]
    return n
  }
  if (isObservableSet(e) || Object.getPrototypeOf(e) === Set.prototype) {
    if (!1 === t.exportMapsAsObjects) {
      var s = cache(r, e, new Set(), t)
      return (
        e.forEach(function (e) {
          s.add(toJSHelper(e, t, r))
        }),
        s
      )
    }
    var c = cache(r, e, [], t)
    return (
      e.forEach(function (e) {
        c.push(toJSHelper(e, t, r))
      }),
      c
    )
  }
  if (isObservableMap(e) || Object.getPrototypeOf(e) === Map.prototype) {
    if (!1 === t.exportMapsAsObjects) {
      var l = cache(r, e, new Map(), t)
      return (
        e.forEach(function (e, n) {
          l.set(n, toJSHelper(e, t, r))
        }),
        l
      )
    }
    var u = cache(r, e, {}, t)
    return (
      e.forEach(function (e, n) {
        u[n] = toJSHelper(e, t, r)
      }),
      u
    )
  }
  var p = cache(r, e, {}, t)
  for (var b in e) p[b] = toJSHelper(e[b], t, r)
  return p
}
function toJS(e, t) {
  var r
  return (
    'boolean' == typeof t && (t = { detectCycles: t }),
    t || (t = defaultOptions),
    (t.detectCycles =
      void 0 === t.detectCycles
        ? !0 === t.recurseEverything
        : !0 === t.detectCycles),
    t.detectCycles && (r = new Map()),
    toJSHelper(e, t, r)
  )
}
function trace() {
  for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t]
  var r = !1
  'boolean' == typeof e[e.length - 1] && (r = e.pop())
  var n = getAtomFromArgs(e)
  if (!n) return fail(!1)
  n.isTracing === TraceMode.NONE &&
    console.log("[mobx.trace] '" + n.name + "' tracing enabled"),
    (n.isTracing = r ? TraceMode.BREAK : TraceMode.LOG)
}
function getAtomFromArgs(e) {
  switch (e.length) {
    case 0:
      return globalState.trackingDerivation
    case 1:
      return getAtom(e[0])
    case 2:
      return getAtom(e[0], e[1])
  }
}
function transaction(e, t) {
  void 0 === t && (t = void 0), startBatch()
  try {
    return e.apply(t)
  } finally {
    endBatch()
  }
}
function when(e, t, r) {
  return 1 === arguments.length || (t && 'object' == typeof t)
    ? whenPromise(e, t)
    : _when(e, t, r || {})
}
function _when(e, t, r) {
  var n
  'number' == typeof r.timeout &&
    (n = setTimeout(function () {
      if (!a.$mobx.isDisposed) {
        a()
        var e = new Error('WHEN_TIMEOUT')
        if (!r.onError) throw e
        r.onError(e)
      }
    }, r.timeout)),
    (r.name = r.name || 'When@' + getNextId())
  var o = createAction(r.name + '-effect', t),
    a = autorun(function (t) {
      e() && (t.dispose(), n && clearTimeout(n), o())
    }, r)
  return a
}
function whenPromise(e, t) {
  var r,
    n = new Promise(function (n, o) {
      var a = _when(e, n, __assign({}, t, { onError: o }))
      r = function () {
        a(), o('WHEN_CANCELLED')
      }
    })
  return (n.cancel = r), n
}
function hasInterceptors(e) {
  return void 0 !== e.interceptors && e.interceptors.length > 0
}
function registerInterceptor(e, t) {
  var r = e.interceptors || (e.interceptors = [])
  return (
    r.push(t),
    once(function () {
      var e = r.indexOf(t)
      ;-1 !== e && r.splice(e, 1)
    })
  )
}
function interceptChange(e, t) {
  var r = untrackedStart()
  try {
    var n = e.interceptors
    if (n)
      for (
        var o = 0, a = n.length;
        o < a &&
        (invariant(
          !(t = n[o](t)) || t.type,
          'Intercept handlers should return nothing or a change object',
        ),
        t);
        o++
      );
    return t
  } finally {
    untrackedEnd(r)
  }
}
function hasListeners(e) {
  return void 0 !== e.changeListeners && e.changeListeners.length > 0
}
function registerListener(e, t) {
  var r = e.changeListeners || (e.changeListeners = [])
  return (
    r.push(t),
    once(function () {
      var e = r.indexOf(t)
      ;-1 !== e && r.splice(e, 1)
    })
  )
}
function notifyListeners(e, t) {
  var r = untrackedStart(),
    n = e.changeListeners
  if (n) {
    for (var o = 0, a = (n = n.slice()).length; o < a; o++) n[o](t)
    untrackedEnd(r)
  }
}
var MAX_SPLICE_SIZE = 1e4,
  safariPrototypeSetterInheritanceBug = (function () {
    var e = !1,
      t = {}
    return (
      Object.defineProperty(t, '0', {
        set: function () {
          e = !0
        },
      }),
      (Object.create(t)[0] = 1),
      !1 === e
    )
  })(),
  OBSERVABLE_ARRAY_BUFFER_SIZE = 0,
  StubArray = (function () {
    return function () {}
  })()
function inherit(e, t) {
  void 0 !== Object.setPrototypeOf
    ? Object.setPrototypeOf(e.prototype, t)
    : void 0 !== e.prototype.__proto__
    ? (e.prototype.__proto__ = t)
    : (e.prototype = t)
}
inherit(StubArray, Array.prototype),
  Object.isFrozen(Array) &&
    [
      'constructor',
      'push',
      'shift',
      'concat',
      'pop',
      'unshift',
      'replace',
      'find',
      'findIndex',
      'splice',
      'reverse',
      'sort',
    ].forEach(function (e) {
      Object.defineProperty(StubArray.prototype, e, {
        configurable: !0,
        writable: !0,
        value: Array.prototype[e],
      })
    })
var ObservableArrayAdministration = (function () {
    function e(e, t, r, n) {
      ;(this.array = r),
        (this.owned = n),
        (this.values = []),
        (this.lastKnownLength = 0),
        (this.atom = new Atom(e || 'ObservableArray@' + getNextId())),
        (this.enhancer = function (r, n) {
          return t(r, n, e + '[..]')
        })
    }
    return (
      (e.prototype.dehanceValue = function (e) {
        return void 0 !== this.dehancer ? this.dehancer(e) : e
      }),
      (e.prototype.dehanceValues = function (e) {
        return void 0 !== this.dehancer && e.length > 0
          ? e.map(this.dehancer)
          : e
      }),
      (e.prototype.intercept = function (e) {
        return registerInterceptor(this, e)
      }),
      (e.prototype.observe = function (e, t) {
        return (
          void 0 === t && (t = !1),
          t &&
            e({
              object: this.array,
              type: 'splice',
              index: 0,
              added: this.values.slice(),
              addedCount: this.values.length,
              removed: [],
              removedCount: 0,
            }),
          registerListener(this, e)
        )
      }),
      (e.prototype.getArrayLength = function () {
        return this.atom.reportObserved(), this.values.length
      }),
      (e.prototype.setArrayLength = function (e) {
        if ('number' != typeof e || e < 0)
          throw new Error('[mobx.array] Out of range: ' + e)
        var t = this.values.length
        if (e !== t)
          if (e > t) {
            for (var r = new Array(e - t), n = 0; n < e - t; n++) r[n] = void 0
            this.spliceWithArray(t, 0, r)
          } else this.spliceWithArray(e, t - e)
      }),
      (e.prototype.updateArrayLength = function (e, t) {
        if (e !== this.lastKnownLength)
          throw new Error(
            '[mobx] Modification exception: the internal structure of an observable array was changed. Did you use peek() to change it?',
          )
        ;(this.lastKnownLength += t),
          t > 0 &&
            e + t + 1 > OBSERVABLE_ARRAY_BUFFER_SIZE &&
            reserveArrayBuffer(e + t + 1)
      }),
      (e.prototype.spliceWithArray = function (e, t, r) {
        var n = this
        checkIfStateModificationsAreAllowed(this.atom)
        var o = this.values.length
        if (
          (void 0 === e
            ? (e = 0)
            : e > o
            ? (e = o)
            : e < 0 && (e = Math.max(0, o + e)),
          (t =
            1 === arguments.length
              ? o - e
              : null == t
              ? 0
              : Math.max(0, Math.min(t, o - e))),
          void 0 === r && (r = EMPTY_ARRAY),
          hasInterceptors(this))
        ) {
          var a = interceptChange(this, {
            object: this.array,
            type: 'splice',
            index: e,
            removedCount: t,
            added: r,
          })
          if (!a) return EMPTY_ARRAY
          ;(t = a.removedCount), (r = a.added)
        }
        var i =
          (r =
            0 === r.length
              ? r
              : r.map(function (e) {
                  return n.enhancer(e, void 0)
                })).length - t
        this.updateArrayLength(o, i)
        var s = this.spliceItemsIntoValues(e, t, r)
        return (
          (0 === t && 0 === r.length) || this.notifyArraySplice(e, r, s),
          this.dehanceValues(s)
        )
      }),
      (e.prototype.spliceItemsIntoValues = function (e, t, r) {
        var n
        if (r.length < MAX_SPLICE_SIZE)
          return (n = this.values).splice.apply(n, __spread([e, t], r))
        var o = this.values.slice(e, e + t)
        return (
          (this.values = this.values
            .slice(0, e)
            .concat(r, this.values.slice(e + t))),
          o
        )
      }),
      (e.prototype.notifyArrayChildUpdate = function (e, t, r) {
        var n = !this.owned && isSpyEnabled(),
          o = hasListeners(this),
          a =
            o || n
              ? {
                  object: this.array,
                  type: 'update',
                  index: e,
                  newValue: t,
                  oldValue: r,
                }
              : null
        n && spyReportStart(__assign({}, a, { name: this.atom.name })),
          this.atom.reportChanged(),
          o && notifyListeners(this, a),
          n && spyReportEnd()
      }),
      (e.prototype.notifyArraySplice = function (e, t, r) {
        var n = !this.owned && isSpyEnabled(),
          o = hasListeners(this),
          a =
            o || n
              ? {
                  object: this.array,
                  type: 'splice',
                  index: e,
                  removed: r,
                  added: t,
                  removedCount: r.length,
                  addedCount: t.length,
                }
              : null
        n && spyReportStart(__assign({}, a, { name: this.atom.name })),
          this.atom.reportChanged(),
          o && notifyListeners(this, a),
          n && spyReportEnd()
      }),
      e
    )
  })(),
  ObservableArray = (function (e) {
    function t(t, r, n, o) {
      void 0 === n && (n = 'ObservableArray@' + getNextId()),
        void 0 === o && (o = !1)
      var a = e.call(this) || this,
        i = new ObservableArrayAdministration(n, r, a, o)
      if ((addHiddenFinalProp(a, '$mobx', i), t && t.length)) {
        var s = allowStateChangesStart(!0)
        a.spliceWithArray(0, 0, t), allowStateChangesEnd(s)
      }
      return (
        safariPrototypeSetterInheritanceBug &&
          Object.defineProperty(i.array, '0', ENTRY_0),
        a
      )
    }
    return (
      __extends(t, e),
      (t.prototype.intercept = function (e) {
        return this.$mobx.intercept(e)
      }),
      (t.prototype.observe = function (e, t) {
        return void 0 === t && (t = !1), this.$mobx.observe(e, t)
      }),
      (t.prototype.clear = function () {
        return this.splice(0)
      }),
      (t.prototype.concat = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t]
        return (
          this.$mobx.atom.reportObserved(),
          Array.prototype.concat.apply(
            this.peek(),
            e.map(function (e) {
              return isObservableArray(e) ? e.peek() : e
            }),
          )
        )
      }),
      (t.prototype.replace = function (e) {
        return this.$mobx.spliceWithArray(0, this.$mobx.values.length, e)
      }),
      (t.prototype.toJS = function () {
        return this.slice()
      }),
      (t.prototype.toJSON = function () {
        return this.toJS()
      }),
      (t.prototype.peek = function () {
        return (
          this.$mobx.atom.reportObserved(),
          this.$mobx.dehanceValues(this.$mobx.values)
        )
      }),
      (t.prototype.find = function (e, t, r) {
        void 0 === r && (r = 0),
          3 === arguments.length &&
            deprecated(
              'The array.find fromIndex argument to find will not be supported anymore in the next major',
            )
        var n = this.findIndex.apply(this, arguments)
        return -1 === n ? void 0 : this.get(n)
      }),
      (t.prototype.findIndex = function (e, t, r) {
        void 0 === r && (r = 0),
          3 === arguments.length &&
            deprecated(
              'The array.findIndex fromIndex argument to find will not be supported anymore in the next major',
            )
        for (var n = this.peek(), o = n.length, a = r; a < o; a++)
          if (e.call(t, n[a], a, this)) return a
        return -1
      }),
      (t.prototype.splice = function (e, t) {
        for (var r = [], n = 2; n < arguments.length; n++)
          r[n - 2] = arguments[n]
        switch (arguments.length) {
          case 0:
            return []
          case 1:
            return this.$mobx.spliceWithArray(e)
          case 2:
            return this.$mobx.spliceWithArray(e, t)
        }
        return this.$mobx.spliceWithArray(e, t, r)
      }),
      (t.prototype.spliceWithArray = function (e, t, r) {
        return this.$mobx.spliceWithArray(e, t, r)
      }),
      (t.prototype.push = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t]
        var r = this.$mobx
        return r.spliceWithArray(r.values.length, 0, e), r.values.length
      }),
      (t.prototype.pop = function () {
        return this.splice(Math.max(this.$mobx.values.length - 1, 0), 1)[0]
      }),
      (t.prototype.shift = function () {
        return this.splice(0, 1)[0]
      }),
      (t.prototype.unshift = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t]
        var r = this.$mobx
        return r.spliceWithArray(0, 0, e), r.values.length
      }),
      (t.prototype.reverse = function () {
        var e = this.slice()
        return e.reverse.apply(e, arguments)
      }),
      (t.prototype.sort = function (e) {
        var t = this.slice()
        return t.sort.apply(t, arguments)
      }),
      (t.prototype.remove = function (e) {
        var t = this.$mobx.dehanceValues(this.$mobx.values).indexOf(e)
        return t > -1 && (this.splice(t, 1), !0)
      }),
      (t.prototype.move = function (e, t) {
        function r(e) {
          if (e < 0)
            throw new Error(
              '[mobx.array] Index out of bounds: ' + e + ' is negative',
            )
          var t = this.$mobx.values.length
          if (e >= t)
            throw new Error(
              '[mobx.array] Index out of bounds: ' +
                e +
                ' is not smaller than ' +
                t,
            )
        }
        if (
          (deprecated(
            'observableArray.move is deprecated, use .slice() & .replace() instead',
          ),
          r.call(this, e),
          r.call(this, t),
          e !== t)
        ) {
          var n,
            o = this.$mobx.values
          ;(n =
            e < t
              ? __spread(
                  o.slice(0, e),
                  o.slice(e + 1, t + 1),
                  [o[e]],
                  o.slice(t + 1),
                )
              : __spread(o.slice(0, t), [o[e]], o.slice(t, e), o.slice(e + 1))),
            this.replace(n)
        }
      }),
      (t.prototype.get = function (e) {
        var t = this.$mobx
        if (t) {
          if (e < t.values.length)
            return t.atom.reportObserved(), t.dehanceValue(t.values[e])
          console.warn(
            '[mobx.array] Attempt to read an array index (' +
              e +
              ') that is out of bounds (' +
              t.values.length +
              '). Please check length first. Out of bound indices will not be tracked by MobX',
          )
        }
      }),
      (t.prototype.set = function (e, t) {
        var r = this.$mobx,
          n = r.values
        if (e < n.length) {
          checkIfStateModificationsAreAllowed(r.atom)
          var o = n[e]
          if (hasInterceptors(r)) {
            var a = interceptChange(r, {
              type: 'update',
              object: this,
              index: e,
              newValue: t,
            })
            if (!a) return
            t = a.newValue
          }
          ;(t = r.enhancer(t, o)) !== o &&
            ((n[e] = t), r.notifyArrayChildUpdate(e, t, o))
        } else {
          if (e !== n.length)
            throw new Error(
              '[mobx.array] Index out of bounds, ' +
                e +
                ' is larger than ' +
                n.length,
            )
          r.spliceWithArray(e, 0, [t])
        }
      }),
      t
    )
  })(StubArray)
declareIterator(ObservableArray.prototype, function () {
  this.$mobx.atom.reportObserved()
  var e = this,
    t = 0
  return makeIterable({
    next: function () {
      return t < e.length
        ? { value: e[t++], done: !1 }
        : { done: !0, value: void 0 }
    },
  })
}),
  Object.defineProperty(ObservableArray.prototype, 'length', {
    enumerable: !1,
    configurable: !0,
    get: function () {
      return this.$mobx.getArrayLength()
    },
    set: function (e) {
      this.$mobx.setArrayLength(e)
    },
  }),
  addHiddenProp(ObservableArray.prototype, toStringTagSymbol(), 'Array'),
  [
    'every',
    'filter',
    'forEach',
    'indexOf',
    'join',
    'lastIndexOf',
    'map',
    'reduce',
    'reduceRight',
    'slice',
    'some',
    'toString',
    'toLocaleString',
  ].forEach(function (e) {
    var t = Array.prototype[e]
    invariant(
      'function' == typeof t,
      "Base function not defined on Array prototype: '" + e + "'",
    ),
      addHiddenProp(ObservableArray.prototype, e, function () {
        return t.apply(this.peek(), arguments)
      })
  }),
  makeNonEnumerable(ObservableArray.prototype, [
    'constructor',
    'intercept',
    'observe',
    'clear',
    'concat',
    'get',
    'replace',
    'toJS',
    'toJSON',
    'peek',
    'find',
    'findIndex',
    'splice',
    'spliceWithArray',
    'push',
    'pop',
    'set',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'remove',
    'move',
    'toString',
    'toLocaleString',
  ])
var ENTRY_0 = createArrayEntryDescriptor(0)
function createArrayEntryDescriptor(e) {
  return {
    enumerable: !1,
    configurable: !1,
    get: function () {
      return this.get(e)
    },
    set: function (t) {
      this.set(e, t)
    },
  }
}
function createArrayBufferItem(e) {
  Object.defineProperty(
    ObservableArray.prototype,
    '' + e,
    createArrayEntryDescriptor(e),
  )
}
function reserveArrayBuffer(e) {
  for (var t = OBSERVABLE_ARRAY_BUFFER_SIZE; t < e; t++)
    createArrayBufferItem(t)
  OBSERVABLE_ARRAY_BUFFER_SIZE = e
}
reserveArrayBuffer(1e3)
var isObservableArrayAdministration = createInstanceofPredicate(
  'ObservableArrayAdministration',
  ObservableArrayAdministration,
)
function isObservableArray(e) {
  return isObject(e) && isObservableArrayAdministration(e.$mobx)
}
var ObservableMapMarker = {},
  ObservableMap = (function () {
    function e(e, t, r) {
      if (
        (void 0 === t && (t = deepEnhancer),
        void 0 === r && (r = 'ObservableMap@' + getNextId()),
        (this.enhancer = t),
        (this.name = r),
        (this.$mobx = ObservableMapMarker),
        (this._keys = new ObservableArray(
          void 0,
          referenceEnhancer,
          this.name + '.keys()',
          !0,
        )),
        'function' != typeof Map)
      )
        throw new Error(
          'mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js',
        )
      ;(this._data = new Map()), (this._hasMap = new Map()), this.merge(e)
    }
    return (
      (e.prototype._has = function (e) {
        return this._data.has(e)
      }),
      (e.prototype.has = function (e) {
        var t = this
        if (!globalState.trackingDerivation) return this._has(e)
        var r = this._hasMap.get(e)
        if (!r) {
          var n = (r = new ObservableValue(
            this._has(e),
            referenceEnhancer,
            this.name + '.' + stringifyKey(e) + '?',
            !1,
          ))
          this._hasMap.set(e, n),
            onBecomeUnobserved(n, function () {
              return t._hasMap.delete(e)
            })
        }
        return r.get()
      }),
      (e.prototype.set = function (e, t) {
        var r = this._has(e)
        if (hasInterceptors(this)) {
          var n = interceptChange(this, {
            type: r ? 'update' : 'add',
            object: this,
            newValue: t,
            name: e,
          })
          if (!n) return this
          t = n.newValue
        }
        return r ? this._updateValue(e, t) : this._addValue(e, t), this
      }),
      (e.prototype.delete = function (e) {
        var t = this
        if (
          hasInterceptors(this) &&
          !(o = interceptChange(this, {
            type: 'delete',
            object: this,
            name: e,
          }))
        )
          return !1
        if (this._has(e)) {
          var r = isSpyEnabled(),
            n = hasListeners(this),
            o =
              n || r
                ? {
                    type: 'delete',
                    object: this,
                    oldValue: this._data.get(e).value,
                    name: e,
                  }
                : null
          return (
            r && spyReportStart(__assign({}, o, { name: this.name, key: e })),
            transaction(function () {
              t._keys.remove(e),
                t._updateHasMapEntry(e, !1),
                t._data.get(e).setNewValue(void 0),
                t._data.delete(e)
            }),
            n && notifyListeners(this, o),
            r && spyReportEnd(),
            !0
          )
        }
        return !1
      }),
      (e.prototype._updateHasMapEntry = function (e, t) {
        var r = this._hasMap.get(e)
        r && r.setNewValue(t)
      }),
      (e.prototype._updateValue = function (e, t) {
        var r = this._data.get(e)
        if ((t = r.prepareNewValue(t)) !== globalState.UNCHANGED) {
          var n = isSpyEnabled(),
            o = hasListeners(this),
            a =
              o || n
                ? {
                    type: 'update',
                    object: this,
                    oldValue: r.value,
                    name: e,
                    newValue: t,
                  }
                : null
          n && spyReportStart(__assign({}, a, { name: this.name, key: e })),
            r.setNewValue(t),
            o && notifyListeners(this, a),
            n && spyReportEnd()
        }
      }),
      (e.prototype._addValue = function (e, t) {
        var r = this
        transaction(function () {
          var n = new ObservableValue(
            t,
            r.enhancer,
            r.name + '.' + stringifyKey(e),
            !1,
          )
          r._data.set(e, n),
            (t = n.value),
            r._updateHasMapEntry(e, !0),
            r._keys.push(e)
        })
        var n = isSpyEnabled(),
          o = hasListeners(this),
          a =
            o || n ? { type: 'add', object: this, name: e, newValue: t } : null
        n && spyReportStart(__assign({}, a, { name: this.name, key: e })),
          o && notifyListeners(this, a),
          n && spyReportEnd()
      }),
      (e.prototype.get = function (e) {
        return this.has(e)
          ? this.dehanceValue(this._data.get(e).get())
          : this.dehanceValue(void 0)
      }),
      (e.prototype.dehanceValue = function (e) {
        return void 0 !== this.dehancer ? this.dehancer(e) : e
      }),
      (e.prototype.keys = function () {
        return this._keys[iteratorSymbol()]()
      }),
      (e.prototype.values = function () {
        var e = this,
          t = 0
        return makeIterable({
          next: function () {
            return t < e._keys.length
              ? { value: e.get(e._keys[t++]), done: !1 }
              : { value: void 0, done: !0 }
          },
        })
      }),
      (e.prototype.entries = function () {
        var e = this,
          t = 0
        return makeIterable({
          next: function () {
            if (t < e._keys.length) {
              var r = e._keys[t++]
              return { value: [r, e.get(r)], done: !1 }
            }
            return { done: !0 }
          },
        })
      }),
      (e.prototype.forEach = function (e, t) {
        var r = this
        this._keys.forEach(function (n) {
          return e.call(t, r.get(n), n, r)
        })
      }),
      (e.prototype.merge = function (e) {
        var t = this
        return (
          isObservableMap(e) && (e = e.toJS()),
          transaction(function () {
            isPlainObject(e)
              ? Object.keys(e).forEach(function (r) {
                  return t.set(r, e[r])
                })
              : Array.isArray(e)
              ? e.forEach(function (e) {
                  var r = __read(e, 2),
                    n = r[0],
                    o = r[1]
                  return t.set(n, o)
                })
              : isES6Map(e)
              ? e.constructor !== Map
                ? fail(
                    'Cannot initialize from classes that inherit from Map: ' +
                      e.constructor.name,
                  )
                : e.forEach(function (e, r) {
                    return t.set(r, e)
                  })
              : null != e && fail('Cannot initialize map from ' + e)
          }),
          this
        )
      }),
      (e.prototype.clear = function () {
        var e = this
        transaction(function () {
          untracked(function () {
            e._keys.slice().forEach(function (t) {
              return e.delete(t)
            })
          })
        })
      }),
      (e.prototype.replace = function (e) {
        var t = this
        return (
          transaction(function () {
            for (
              var r = convertToMap(e),
                n = t._keys,
                o = Array.from(r.keys()),
                a = !1,
                i = 0;
              i < n.length;
              i++
            ) {
              var s = n[i]
              n.length === o.length && s !== o[i] && (a = !0),
                r.has(s) || ((a = !0), t.delete(s))
            }
            r.forEach(function (e, r) {
              t._data.has(r) || (a = !0), t.set(r, e)
            }),
              a && t._keys.replace(o)
          }),
          this
        )
      }),
      Object.defineProperty(e.prototype, 'size', {
        get: function () {
          return this._keys.length
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.toPOJO = function () {
        var e = this,
          t = {}
        return (
          this._keys.forEach(function (r) {
            return (t['symbol' == typeof r ? r : stringifyKey(r)] = e.get(r))
          }),
          t
        )
      }),
      (e.prototype.toJS = function () {
        var e = this,
          t = new Map()
        return (
          this._keys.forEach(function (r) {
            return t.set(r, e.get(r))
          }),
          t
        )
      }),
      (e.prototype.toJSON = function () {
        return this.toPOJO()
      }),
      (e.prototype.toString = function () {
        var e = this
        return (
          this.name +
          '[{ ' +
          this._keys
            .map(function (t) {
              return stringifyKey(t) + ': ' + e.get(t)
            })
            .join(', ') +
          ' }]'
        )
      }),
      (e.prototype.observe = function (e, t) {
        return registerListener(this, e)
      }),
      (e.prototype.intercept = function (e) {
        return registerInterceptor(this, e)
      }),
      e
    )
  })()
function stringifyKey(e) {
  return e && e.toString ? e.toString() : new String(e).toString()
}
declareIterator(ObservableMap.prototype, function () {
  return this.entries()
}),
  addHiddenFinalProp(ObservableMap.prototype, toStringTagSymbol(), 'Map')
var isObservableMap = createInstanceofPredicate('ObservableMap', ObservableMap),
  ObservableSetMarker = {},
  ObservableSet = (function () {
    function e(e, t, r) {
      if (
        (void 0 === t && (t = deepEnhancer),
        void 0 === r && (r = 'ObservableSet@' + getNextId()),
        (this.name = r),
        (this.$mobx = ObservableSetMarker),
        (this._data = new Set()),
        (this._atom = createAtom(this.name)),
        'function' != typeof Set)
      )
        throw new Error(
          'mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js',
        )
      ;(this.enhancer = function (e, n) {
        return t(e, n, r)
      }),
        e && this.replace(e)
    }
    return (
      (e.prototype.dehanceValue = function (e) {
        return void 0 !== this.dehancer ? this.dehancer(e) : e
      }),
      (e.prototype.clear = function () {
        var e = this
        transaction(function () {
          untracked(function () {
            e._data.forEach(function (t) {
              e.delete(t)
            })
          })
        })
      }),
      (e.prototype.forEach = function (e, t) {
        var r = this
        this._data.forEach(function (n) {
          e.call(t, n, n, r)
        })
      }),
      Object.defineProperty(e.prototype, 'size', {
        get: function () {
          return this._atom.reportObserved(), this._data.size
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.add = function (e) {
        var t = this
        if (
          (checkIfStateModificationsAreAllowed(this._atom),
          hasInterceptors(this)) &&
          !(o = interceptChange(this, {
            type: 'add',
            object: this,
            newValue: e,
          }))
        )
          return this
        if (!this.has(e)) {
          transaction(function () {
            t._data.add(t.enhancer(e, void 0)), t._atom.reportChanged()
          })
          var r = isSpyEnabled(),
            n = hasListeners(this),
            o = n || r ? { type: 'add', object: this, newValue: e } : null
          0, n && notifyListeners(this, o)
        }
        return this
      }),
      (e.prototype.delete = function (e) {
        var t = this
        if (
          hasInterceptors(this) &&
          !(o = interceptChange(this, {
            type: 'delete',
            object: this,
            oldValue: e,
          }))
        )
          return !1
        if (this.has(e)) {
          var r = isSpyEnabled(),
            n = hasListeners(this),
            o = n || r ? { type: 'delete', object: this, oldValue: e } : null
          return (
            transaction(function () {
              t._atom.reportChanged(), t._data.delete(e)
            }),
            n && notifyListeners(this, o),
            !0
          )
        }
        return !1
      }),
      (e.prototype.has = function (e) {
        return this._atom.reportObserved(), this._data.has(this.dehanceValue(e))
      }),
      (e.prototype.entries = function () {
        var e = 0,
          t = iteratorToArray(this.keys()),
          r = iteratorToArray(this.values())
        return makeIterable({
          next: function () {
            var n = e
            return (
              (e += 1),
              n < r.length ? { value: [t[n], r[n]], done: !1 } : { done: !0 }
            )
          },
        })
      }),
      (e.prototype.keys = function () {
        return this.values()
      }),
      (e.prototype.values = function () {
        this._atom.reportObserved()
        var e,
          t = this,
          r = 0
        return (
          void 0 !== this._data.values
            ? (e = iteratorToArray(this._data.values()))
            : ((e = []),
              this._data.forEach(function (t) {
                return e.push(t)
              })),
          makeIterable({
            next: function () {
              return r < e.length
                ? { value: t.dehanceValue(e[r++]), done: !1 }
                : { done: !0 }
            },
          })
        )
      }),
      (e.prototype.replace = function (e) {
        var t = this
        return (
          isObservableSet(e) && (e = e.toJS()),
          transaction(function () {
            Array.isArray(e)
              ? (t.clear(),
                e.forEach(function (e) {
                  return t.add(e)
                }))
              : isES6Set(e)
              ? (t.clear(),
                e.forEach(function (e) {
                  return t.add(e)
                }))
              : null != e && fail('Cannot initialize set from ' + e)
          }),
          this
        )
      }),
      (e.prototype.observe = function (e, t) {
        return registerListener(this, e)
      }),
      (e.prototype.intercept = function (e) {
        return registerInterceptor(this, e)
      }),
      (e.prototype.toJS = function () {
        return new Set(this)
      }),
      (e.prototype.toString = function () {
        return this.name + '[ ' + iteratorToArray(this.keys()).join(', ') + ' ]'
      }),
      e
    )
  })()
declareIterator(ObservableSet.prototype, function () {
  return this.values()
}),
  addHiddenFinalProp(ObservableSet.prototype, toStringTagSymbol(), 'Set')
var isObservableSet = createInstanceofPredicate('ObservableSet', ObservableSet),
  ObservableObjectAdministration = (function () {
    function e(e, t, r) {
      ;(this.target = e),
        (this.name = t),
        (this.defaultEnhancer = r),
        (this.values = {})
    }
    return (
      (e.prototype.read = function (e, t) {
        if (this.target === e || (this.illegalAccess(e, t), this.values[t]))
          return this.values[t].get()
      }),
      (e.prototype.write = function (e, t, r) {
        var n = this.target
        n !== e && this.illegalAccess(e, t)
        var o = this.values[t]
        if (o instanceof ComputedValue) o.set(r)
        else {
          if (hasInterceptors(this)) {
            if (
              !(s = interceptChange(this, {
                type: 'update',
                object: n,
                name: t,
                newValue: r,
              }))
            )
              return
            r = s.newValue
          }
          if ((r = o.prepareNewValue(r)) !== globalState.UNCHANGED) {
            var a = hasListeners(this),
              i = isSpyEnabled(),
              s =
                a || i
                  ? {
                      type: 'update',
                      object: n,
                      oldValue: o.value,
                      name: t,
                      newValue: r,
                    }
                  : null
            i && spyReportStart(__assign({}, s, { name: this.name, key: t })),
              o.setNewValue(r),
              a && notifyListeners(this, s),
              i && spyReportEnd()
          }
        }
      }),
      (e.prototype.remove = function (e) {
        if (this.values[e]) {
          var t = this.target
          if (hasInterceptors(this))
            if (
              !(a = interceptChange(this, {
                object: t,
                name: e,
                type: 'remove',
              }))
            )
              return
          try {
            startBatch()
            var r = hasListeners(this),
              n = isSpyEnabled(),
              o = this.values[e].get()
            this.keys && this.keys.remove(e),
              delete this.values[e],
              delete this.target[e]
            var a =
              r || n
                ? { type: 'remove', object: t, oldValue: o, name: e }
                : null
            n && spyReportStart(__assign({}, a, { name: this.name, key: e })),
              r && notifyListeners(this, a),
              n && spyReportEnd()
          } finally {
            endBatch()
          }
        }
      }),
      (e.prototype.illegalAccess = function (e, t) {
        console.warn(
          "Property '" +
            t +
            "' of '" +
            e +
            "' was accessed through the prototype chain. Use 'decorate' instead to declare the prop or access it statically through it's owner",
        )
      }),
      (e.prototype.observe = function (e, t) {
        return registerListener(this, e)
      }),
      (e.prototype.intercept = function (e) {
        return registerInterceptor(this, e)
      }),
      (e.prototype.getKeys = function () {
        var e = this
        return (
          void 0 === this.keys &&
            (this.keys = new ObservableArray(
              Object.keys(this.values).filter(function (t) {
                return e.values[t] instanceof ObservableValue
              }),
              referenceEnhancer,
              'keys(' + this.name + ')',
              !0,
            )),
          this.keys.slice()
        )
      }),
      e
    )
  })()
function asObservableObject(e, t, r) {
  void 0 === t && (t = ''), void 0 === r && (r = deepEnhancer)
  var n = e.$mobx
  return (
    n ||
    (isPlainObject(e) ||
      (t = (e.constructor.name || 'ObservableObject') + '@' + getNextId()),
    t || (t = 'ObservableObject@' + getNextId()),
    addHiddenFinalProp(
      e,
      '$mobx',
      (n = new ObservableObjectAdministration(e, t, r)),
    ),
    n)
  )
}
function defineObservableProperty(e, t, r, n) {
  var o = asObservableObject(e)
  if (hasInterceptors(o)) {
    var a = interceptChange(o, {
      object: e,
      name: t,
      type: 'add',
      newValue: r,
    })
    if (!a) return
    r = a.newValue
  }
  ;(r = (o.values[t] = new ObservableValue(r, n, o.name + '.' + t, !1)).value),
    Object.defineProperty(e, t, generateObservablePropConfig(t)),
    o.keys && o.keys.push(t),
    notifyPropertyAddition(o, e, t, r)
}
function defineComputedProperty(e, t, r) {
  var n = asObservableObject(e)
  ;(r.name = n.name + '.' + t),
    (r.context = e),
    (n.values[t] = new ComputedValue(r)),
    Object.defineProperty(e, t, generateComputedPropConfig(t))
}
var observablePropertyConfigs = Object.create(null),
  computedPropertyConfigs = Object.create(null)
function generateObservablePropConfig(e) {
  return (
    observablePropertyConfigs[e] ||
    (observablePropertyConfigs[e] = {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return this.$mobx.read(this, e)
      },
      set: function (t) {
        this.$mobx.write(this, e, t)
      },
    })
  )
}
function getAdministrationForComputedPropOwner(e) {
  var t = e.$mobx
  return t || (initializeInstance(e), e.$mobx)
}
function generateComputedPropConfig(e) {
  return (
    computedPropertyConfigs[e] ||
    (computedPropertyConfigs[e] = {
      configurable: globalState.computedConfigurable,
      enumerable: !1,
      get: function () {
        return getAdministrationForComputedPropOwner(this).read(this, e)
      },
      set: function (t) {
        getAdministrationForComputedPropOwner(this).write(this, e, t)
      },
    })
  )
}
function notifyPropertyAddition(e, t, r, n) {
  var o = hasListeners(e),
    a = isSpyEnabled(),
    i = o || a ? { type: 'add', object: t, name: r, newValue: n } : null
  a && spyReportStart(__assign({}, i, { name: e.name, key: r })),
    o && notifyListeners(e, i),
    a && spyReportEnd()
}
var isObservableObjectAdministration = createInstanceofPredicate(
  'ObservableObjectAdministration',
  ObservableObjectAdministration,
)
function isObservableObject(e) {
  return (
    !!isObject(e) &&
    (initializeInstance(e), isObservableObjectAdministration(e.$mobx))
  )
}
function getAtom(e, t) {
  if ('object' == typeof e && null !== e) {
    if (isObservableArray(e)) return void 0 !== t && fail(!1), e.$mobx.atom
    if (isObservableSet(e)) return e.$mobx
    if (isObservableMap(e)) {
      var r = e
      return void 0 === t
        ? getAtom(r._keys)
        : ((n = r._data.get(t) || r._hasMap.get(t)) || fail(!1), n)
    }
    var n
    if ((initializeInstance(e), t && !e.$mobx && e[t], isObservableObject(e)))
      return t ? ((n = e.$mobx.values[t]) || fail(!1), n) : fail(!1)
    if (isAtom(e) || isComputedValue(e) || isReaction(e)) return e
  } else if ('function' == typeof e && isReaction(e.$mobx)) return e.$mobx
  return fail(!1)
}
function getAdministration(e, t) {
  return (
    e || fail('Expecting some object'),
    void 0 !== t
      ? getAdministration(getAtom(e, t))
      : isAtom(e) || isComputedValue(e) || isReaction(e)
      ? e
      : isObservableMap(e) || isObservableSet(e)
      ? e
      : (initializeInstance(e), e.$mobx ? e.$mobx : void fail(!1))
  )
}
function getDebugName(e, t) {
  return (
    void 0 !== t
      ? getAtom(e, t)
      : isObservableObject(e) || isObservableMap(e) || isObservableSet(e)
      ? getAdministration(e)
      : getAtom(e)
  ).name
}
var g,
  toString = Object.prototype.toString
function deepEqual(e, t) {
  return eq(e, t)
}
function eq(e, t, r, n) {
  if (e === t) return 0 !== e || 1 / e == 1 / t
  if (null == e || null == t) return !1
  if (e != e) return t != t
  var o = typeof e
  return (
    ('function' === o || 'object' === o || 'object' == typeof t) &&
    deepEq(e, t, r, n)
  )
}
function deepEq(e, t, r, n) {
  ;(e = unwrap(e)), (t = unwrap(t))
  var o = toString.call(e)
  if (o !== toString.call(t)) return !1
  switch (o) {
    case '[object RegExp]':
    case '[object String]':
      return '' + e == '' + t
    case '[object Number]':
      return +e != +e ? +t != +t : 0 == +e ? 1 / +e == 1 / t : +e == +t
    case '[object Date]':
    case '[object Boolean]':
      return +e == +t
    case '[object Symbol]':
      return (
        'undefined' != typeof Symbol &&
        Symbol.valueOf.call(e) === Symbol.valueOf.call(t)
      )
  }
  var a = '[object Array]' === o
  if (!a) {
    if ('object' != typeof e || 'object' != typeof t) return !1
    var i = e.constructor,
      s = t.constructor
    if (
      i !== s &&
      !(
        'function' == typeof i &&
        i instanceof i &&
        'function' == typeof s &&
        s instanceof s
      ) &&
      'constructor' in e &&
      'constructor' in t
    )
      return !1
  }
  n = n || []
  for (var c = (r = r || []).length; c--; ) if (r[c] === e) return n[c] === t
  if ((r.push(e), n.push(t), a)) {
    if ((c = e.length) !== t.length) return !1
    for (; c--; ) if (!eq(e[c], t[c], r, n)) return !1
  } else {
    var l = Object.keys(e),
      u = void 0
    if (((c = l.length), Object.keys(t).length !== c)) return !1
    for (; c--; ) if (!has$1(t, (u = l[c])) || !eq(e[u], t[u], r, n)) return !1
  }
  return r.pop(), n.pop(), !0
}
function unwrap(e) {
  return isObservableArray(e)
    ? e.peek()
    : isES6Map(e) || isObservableMap(e)
    ? iteratorToArray(e.entries())
    : isES6Set(e) || isObservableSet(e)
    ? iteratorToArray(e.entries())
    : e
}
function has$1(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t)
}
var $mobx = '$mobx'
'object' == typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ &&
  __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
    spy: spy,
    extras: { getDebugName: getDebugName },
    $mobx: $mobx,
  }),
  (exports.$mobx = $mobx),
  (exports.ObservableMap = ObservableMap),
  (exports.ObservableSet = ObservableSet),
  (exports.Reaction = Reaction),
  (exports._allowStateChanges = allowStateChanges),
  (exports._allowStateChangesInsideComputed = allowStateChangesInsideComputed),
  (exports._getAdministration = getAdministration),
  (exports._getGlobalState = getGlobalState),
  (exports._interceptReads = interceptReads),
  (exports._isComputingDerivation = isComputingDerivation),
  (exports._resetGlobalState = resetGlobalState),
  (exports.action = action),
  (exports.autorun = autorun),
  (exports.comparer = comparer),
  (exports.computed = computed),
  (exports.configure = configure),
  (exports.createAtom = createAtom),
  (exports.decorate = decorate),
  (exports.entries = entries),
  (exports.extendObservable = extendObservable),
  (exports.extendShallowObservable = extendShallowObservable),
  (exports.flow = flow),
  (exports.get = get),
  (exports.getAtom = getAtom),
  (exports.getDebugName = getDebugName),
  (exports.getDependencyTree = getDependencyTree),
  (exports.getObserverTree = getObserverTree),
  (exports.has = has),
  (exports.intercept = intercept),
  (exports.isAction = isAction),
  (exports.isArrayLike = isArrayLike),
  (exports.isBoxedObservable = isObservableValue),
  (exports.isComputed = isComputed),
  (exports.isComputedProp = isComputedProp),
  (exports.isObservable = isObservable),
  (exports.isObservableArray = isObservableArray),
  (exports.isObservableMap = isObservableMap),
  (exports.isObservableObject = isObservableObject),
  (exports.isObservableProp = isObservableProp),
  (exports.isObservableSet = isObservableSet),
  (exports.keys = keys),
  (exports.observable = observable),
  (exports.observe = observe),
  (exports.onBecomeObserved = onBecomeObserved),
  (exports.onBecomeUnobserved = onBecomeUnobserved),
  (exports.onReactionError = onReactionError),
  (exports.reaction = reaction),
  (exports.remove = remove),
  (exports.runInAction = runInAction),
  (exports.set = set),
  (exports.spy = spy),
  (exports.toJS = toJS),
  (exports.trace = trace),
  (exports.transaction = transaction),
  (exports.untracked = untracked),
  (exports.values = values),
  (exports.when = when)

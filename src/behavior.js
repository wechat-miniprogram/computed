const deepClone = require('rfdc')({proto: true})
const deepEqual = require('fast-deep-equal')
const dataPath = require('./data-path')
const dataTracer = require('./data-tracer')

const behaviorComputedWatchDefs = {}
const getDataOnPath = function (data, path) {
  let ret = data
  path.forEach((s) => {
    if (typeof ret !== 'object' || ret === null) ret = undefined
    else ret = ret[s]
  })
  return ret
}

exports.behavior = Behavior({
  lifetimes: {
    attached() {
      const {_computedWatchDefinition} = this
      const computedDef = _computedWatchDefinition().computedDef || {}

      // handling computed
      const setDataObj = {}
      Object.keys(computedDef).forEach((targetField) => {
        const updateMethod = computedDef[targetField]
        const relatedPathValuesOnDef = []
        const val = updateMethod(dataTracer.create(this.data, relatedPathValuesOnDef))
        const pathValues = relatedPathValuesOnDef.map(({path}) => ({
          path,
          value: getDataOnPath(this.data, path)
        }))
        setDataObj[targetField] = val
        this._computedWatchInfo.computedRelatedPathValues[targetField] = pathValues
        const updateValueAndRelatedPaths = function () {
          const oldPathValues = this._computedWatchInfo.computedRelatedPathValues[targetField]
          let needUpdate = false
          for (let i = 0; i < oldPathValues.length; i++) {
            const {path, value: oldVal} = oldPathValues[i]
            const curVal = getDataOnPath(this.data, path)
            if (oldVal !== curVal) {
              needUpdate = true
              break
            }
          }
          if (!needUpdate) return false
          const relatedPathValues = []
          const val = updateMethod(dataTracer.create(this.data, relatedPathValues))
          this.setData({
            [targetField]: val
          })
          this._computedWatchInfo.computedRelatedPathValues[targetField] = relatedPathValues
          return true
        }
        this.__computedUpdaters__.push(updateValueAndRelatedPaths)
      })

      this.setData(setDataObj)
    },

    created() {
      const {_computedWatchDefinition} = this
      const watchDef = _computedWatchDefinition().watchDef || {}
      // initialize status, executed on created
      const initFuncs = []
      if (this._initComputedWatchInfo) {
        throw new Error('Please do not use this behavior more than once in a single component')
      }
      this.__computedUpdaters__ = []

      // handling watch
      Object.keys(watchDef).forEach((watchPath) => {
        const paths = dataPath.parseMultiDataPaths(watchPath)
        // record the original value of watch targets
        initFuncs.push(function () {
          const curVal = paths.map(({path, options}) => {
            const val = getDataOnPath(this.data, path)
            return options.deepCmp ? deepClone(val) : val
          })
          this._computedWatchInfo.watchCurVal[watchPath] = curVal
        })
      })
      this._initComputedWatchInfo = function () {
        if (this._computedWatchInfo) return
        this._computedWatchInfo = {
          computedRelatedPathValues: {},
          watchCurVal: {},
        }
        initFuncs.forEach((func) => func.call(this))
      }
      this._initComputedWatchInfo()
    }
  },

  definitionFilter(defFields) {
    const computedDef = defFields.computed || {}
    const watchDef = defFields.watch || {}
    if (defFields.is) {
      behaviorComputedWatchDefs[defFields.is] = {
        computedDef,
        watchDef,
      }
    }
    const observersItems = []
    if (!defFields.methods) defFields.methods = {}
    defFields.methods._computedWatchDefinition = () => (defFields.behaviors || [])
      .reduce(({computedDef, watchDef}, behaviorId) => {
        const dependedComputedWatchDefinition = behaviorComputedWatchDefs[behaviorId] || {}
        return {
          computedDef: Object.assign(dependedComputedWatchDefinition.computedDef || {}, computedDef),
          watchDef: Object.assign(dependedComputedWatchDefinition.watchDef || {}, watchDef),
        }
      }, {
        computedDef,
        watchDef,
      })
    if (computedDef) {
      observersItems.push({
        fields: '**',
        observer() {
          if (!this._computedWatchInfo) return
          let changed
          do {
            changed = false
            // eslint-disable-next-line no-loop-func
            this.__computedUpdaters__.forEach((func) => {
              if (func.call(this)) changed = true
            })
          } while (changed)
        }
      })
    }
    if (watchDef) {
      Object.keys(watchDef).forEach((watchPath) => {
        const paths = dataPath.parseMultiDataPaths(watchPath)
        observersItems.push({
          fields: watchPath,
          observer() {
            if (!this._computedWatchInfo) return
            const oldVal = this._computedWatchInfo.watchCurVal[watchPath]
            const originalCurValWithOptions = paths.map(({path, options}) => {
              const val = getDataOnPath(this.data, path)
              return {
                val,
                options,
              }
            })
            const curVal = originalCurValWithOptions.map(({val, options}) => (
              options.deepCmp ? deepClone(val) : val
            ))
            this._computedWatchInfo.watchCurVal[watchPath] = curVal
            let changed = false
            for (let i = 0; i < curVal.length; i++) {
              const options = paths[i].options
              const deepCmp = options.deepCmp
              if (deepCmp ? !deepEqual(oldVal[i], curVal[i]) : oldVal[i] !== curVal[i]) {
                changed = true
                break
              }
            }
            if (changed) {
              watchDef[watchPath].apply(this, originalCurValWithOptions.map(({val}) => val))
            }
          }
        })
      })
    }
    if (typeof defFields.observers !== 'object') {
      defFields.observers = {}
    }
    if (defFields.observers instanceof Array) {
      defFields.observers.push(...observersItems)
    } else {
      observersItems.forEach((item) => {
        const f = defFields.observers[item.fields]
        if (!f) {
          defFields.observers[item.fields] = item.observer
        } else {
          defFields.observers[item.fields] = function () {
            item.observer.call(this)
            f.call(this)
          }
        }
      })
    }
  },
})

const deepClone = require('rfdc')({proto: true})
const deepEqual = require('fast-deep-equal')
const dataPath = require('./data-path')
const dataTracer = require('./data-tracer')

const TYPES = [String, Number, Boolean, Object, Array, null]
const TYPE_DEFAULT_VALUES = ['', 0, false, null, [], null]

const getDataOnPath = function (data, path) {
  let ret = data
  path.forEach((s) => {
    if (typeof ret !== 'object' || ret === null) ret = undefined
    else ret = ret[s]
  })
  return ret
}

const setDataOnPath = function (data, path, value) {
  let cur = data
  let index = 0
  while (index < path.length - 1) {
    const s = path[index++]
    if (typeof s === 'number') {
      if (!(cur[s] instanceof Array)) {
        cur[s] = []
      }
    } else if (typeof cur[s] !== 'object' || cur[s] === null) {
      cur[s] = {}
    }
    cur = cur[s]
  }
  cur[path[index]] = value
}

const getDataDefinition = function (data, properties) {
  const ret = {}
  Object.keys(data).forEach((key) => {
    ret[key] = data[key]
  })
  if (properties) {
    Object.keys(properties).forEach((key) => {
      let value = null
      const def = properties[key]
      const typeIndex = TYPES.indexOf(def)
      if (typeIndex >= 0) {
        value = TYPE_DEFAULT_VALUES[typeIndex]
      } else if (def.value) {
        value = def.value
      } else {
        const typeIndex = TYPES.indexOf(def.type)
        if (typeIndex >= 0) {
          value = TYPE_DEFAULT_VALUES[typeIndex]
        }
      }
      ret[key] = value
    })
  }
  return ret
}

exports.behavior = Behavior({
  lifetimes: {
    created() {
      this._initComputedWatchInfo()
    }
  },
  definitionFilter(defFields) {
    const computedDef = defFields.computed || {}
    const watchDef = defFields.watch || {}

    const observersItems = []
    if (!defFields.methods) {
      defFields.methods = {}
    }
    if (!defFields.data) {
      defFields.data = {}
    }
    if (defFields.methods._initComputedWatchInfo) {
      throw new Error('Please do not use this behavior more than once in a single component')
    }

    // initialize status, executed on created
    const initFuncs = []
    defFields.methods._initComputedWatchInfo = function () {
      if (this._computedWatchInfo) return
      this._computedWatchInfo = {
        computedRelatedPathValues: {},
        watchCurVal: {},
      }
      initFuncs.forEach((func) => func.call(this))
    }

    // handling computed
    const computedUpdaters = []
    Object.keys(computedDef).forEach((targetField) => {
      const {path: targetPath} = dataPath.parseSingleDataPath(targetField)
      const updateMethod = computedDef[targetField]
      // update value and calculate related paths
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
      // calculate value on registration
      const relatedPathValuesOnDef = []
      const initData = getDataDefinition(defFields.data, defFields.properties)
      const val = updateMethod(dataTracer.create(initData, relatedPathValuesOnDef))
      setDataOnPath(defFields.data, targetPath, dataTracer.unwrap(val))
      initFuncs.push(function () {
        const pathValues = relatedPathValuesOnDef.map(({path}) => ({
          path,
          value: getDataOnPath(this.data, path)
        }))
        this._computedWatchInfo.computedRelatedPathValues[targetField] = pathValues
      })
      // calculate value on setData
      computedUpdaters.push(updateValueAndRelatedPaths)
    })
    if (computedUpdaters.length) {
      // add a single observer for all computed fields
      observersItems.push({
        fields: '**',
        observer() {
          if (!this._computedWatchInfo) return
          let changed
          do {
            changed = false
            // eslint-disable-next-line no-loop-func
            computedUpdaters.forEach((func) => {
              if (func.call(this)) changed = true
            })
          } while (changed)
        }
      })
    }

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
      // add watch observer
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

    // register to observers
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

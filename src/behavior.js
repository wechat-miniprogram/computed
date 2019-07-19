const dataPath = require('./data-path')
const dataTracer = require('./data-tracer')

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
  path.forEach((s, index) => {
    if (typeof s === 'number') {
      if (!(cur instanceof Array)) {
        cur[s] = []
      }
    } else if (typeof cur !== 'object' || cur === null) {
      cur[s] = {}
    }
    if (index === path.length - 1) {
      cur[s] = value
      return false
    }
    cur = cur[s]
    return undefined
  })
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
    let initFuncs = []
    defFields.methods._initComputedWatchInfo = function () {
      if (this._computedWatchInfo) return
      this._computedWatchInfo = {
        computedRelatedPaths: {},
        computedNeedUpdate: {},
        watchCurVal: {},
        originalSetData: this.setData
      }
      initFuncs.forEach((func) => func.call(this))
      initFuncs = null
    }

    // handling computed
    const computedUpdaters = []
    Object.keys(computedDef).forEach((targetField) => {
      const targetPath = dataPath.parseSingleDataPath(targetField)
      const updateMethod = computedDef[targetField]
      // update value and calculate related paths
      const updateValueAndRelatedPaths = function () {
        if (!this._computedWatchInfo.computedNeedUpdate[targetField]) return
        const relatedPaths = []
        const val = updateMethod(dataTracer.create(this.data, relatedPaths))
        this._computedWatchInfo.originalSetData.call(this, {
          [targetField]: val
        })
        this._computedWatchInfo.computedRelatedPaths[targetField] = relatedPaths
        this._computedWatchInfo.computedNeedUpdate[targetField] = false
      }
      // calculate value on registration
      const relatedPaths = []
      const val = updateMethod(dataTracer.create(defFields.data, relatedPaths))
      setDataOnPath(defFields.data, targetPath, val)
      initFuncs.push(function () {
        // here re-use same relatedPaths for all component instances
        this._computedWatchInfo.computedRelatedPaths[targetField] = relatedPaths
        this._computedWatchInfo.computedNeedUpdate[targetField] = false
      })
      // calculate value on setData
      computedUpdaters.push(updateValueAndRelatedPaths)
    })
    if (computedUpdaters.length) {
      // add a single observer for all computed fields
      observersItems.push({
        fields: '**',
        observer() {
          computedUpdaters.forEach((func) => {
            func.call(this)
          })
        }
      })
      // hooks setData to get which fields are actually updated
      initFuncs.push(function () {
        this.setData = function (...args) {
          const dataExpr = args[0]
          const {computedRelatedPaths, computedNeedUpdate} = this._computedWatchInfo
          Object.keys(computedRelatedPaths).forEach((targetField) => {
            if (computedNeedUpdate[targetField]) return
            const relatedPaths = computedRelatedPaths[targetField]
            Object.keys(dataExpr).forEach((key) => {
              const relatedPath = dataPath.parseSingleDataPath(key).join('\n')
              if (relatedPaths.indexOf(relatedPath) >= 0) {
                computedNeedUpdate[targetField] = true
                return false
              }
              return undefined
            })
          })
          this._computedWatchInfo.originalSetData.apply(this, args)
        }
      })
    }

    // handling watch
    Object.keys(watchDef).forEach((watchPath) => {
      const paths = dataPath.parseMultiDataPaths(watchPath)
      // record the original value of watch targets
      initFuncs.push(function () {
        const curVal = paths.map((path) => getDataOnPath(this.data, path))
        this._computedWatchInfo.watchCurVal[watchPath] = curVal
      })
      // add watch observer
      observersItems.push({
        fields: watchPath,
        observer() {
          const oldVal = this._computedWatchInfo.watchCurVal[watchPath]
          const curVal = paths.map((path) => getDataOnPath(this.data, path))
          this._computedWatchInfo.watchCurVal[watchPath] = curVal
          let changed = false
          for (let i = 0; i < curVal.length; i++) {
            if (oldVal[i] !== curVal[i]) {
              changed = true
              break
            }
          }
          if (changed) watchDef[watchPath].apply(this, curVal)
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
        defFields.observers[item.fields] = item.observer
      })
    }

    // defFields.methods._computedWatchSetData =
  },
})

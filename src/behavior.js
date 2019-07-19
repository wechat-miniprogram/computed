const dataPath = require('./data-path')

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
    created() {
      this._initComputedWatchInfo()
    }
  },
  definitionFilter(defFields) {
    // const computedDef = defFields.computed
    const watchDef = defFields.watch || {}

    const observersItems = []
    if (!defFields.methods) {
      defFields.methods = {}
    }
    if (defFields.methods._initComputedWatchInfo) {
      throw new Error('Please do not use this behavior more than once in a single component')
    }

    // execute on created
    let initFuncs = []
    defFields.methods._initComputedWatchInfo = function () {
      if (this._computedWatchInfo) return
      this._computedWatchInfo = {
        watchCurVal: {},
      }
      initFuncs.forEach((func) => func.call(this))
      initFuncs = null
    }

    // record the original value of watch targets
    Object.keys(watchDef).forEach((watchPath) => {
      const paths = dataPath.parseMultiDataPaths(watchPath)
      initFuncs.push(function () {
        const curVal = paths.map((path) => getDataOnPath(this.data, path))
        this._computedWatchInfo.watchCurVal[watchPath] = curVal
      })
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

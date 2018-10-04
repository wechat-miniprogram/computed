module.exports = Behavior({
  lifetimes: {
    created() {
      this._computedCache = {}
      this._originalSetData = this.setData
      this.setData = this._setData
    }
  },
  definitionFilter(defFields) {
    const computed = defFields.computed || {}
    const computedKeys = Object.keys(computed)
    let doingSetData = false

    // 计算 computed
    const calcComputed = (scope, insertToData) => {
      const needUpdate = {}
      const data = defFields.data = defFields.data || {}
      const computedCache = scope._computedCache || scope.data

      for (let i = 0, len = computedKeys.length; i < len; i++) {
        const key = computedKeys[i]
        const getter = computed[key]

        if (typeof getter === 'function') {
          const value = getter.call(scope)

          if (computedCache[key] !== value) {
            needUpdate[key] = value
            computedCache[key] = value
          }
        }

        if (insertToData) {
          data[key] = needUpdate[key]
        }
      }

      return needUpdate
    }

    // 初始化 computed
    const initComputed = () => {
      doingSetData = true

      // 计算 computed
      calcComputed(defFields, true)

      doingSetData = false
    }

    initComputed()

    defFields.methods = defFields.methods || {}
    defFields.methods._setData = function (data, callback) {
      const originalSetData = this._originalSetData

      if (doingSetData) {
        // eslint-disable-next-line no-console
        console.warn('can\'t call setData in computed getter function!')
        return
      }

      doingSetData = true

      // TODO 过滤掉 data 中的 computed 字段
      const dataKeys = Object.keys(data)
      for (let i = 0, len = dataKeys.length; i < len; i++) {
        const key = dataKeys[i]

        if (computed[key]) delete data[key]
      }

      // 做 data 属性的 setData
      originalSetData.call(this, data, callback)

      // 计算 computed
      const needUpdate = calcComputed(this)

      // 做 computed 属性的 setData
      originalSetData.call(this, needUpdate)

      doingSetData = false
    }
  }
})

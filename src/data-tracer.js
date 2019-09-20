const wrapData = (data, relatedPathValues, basePath) => {
  if (typeof data !== 'object' || data === null) return data
  const isArray = data instanceof Array
  const propDef = {}
  Object.keys(data).forEach((key) => {
    let keyWrapper = null
    propDef[key] = {
      get() {
        if (!keyWrapper) {
          const keyPath = basePath.concat(key)
          relatedPathValues.push({
            path: keyPath,
            value: data[key]
          })
          keyWrapper = wrapData(data[key], relatedPathValues, keyPath)
        }
        return keyWrapper
      },
      set() {
        throw new Error('Setting data is not allowed')
      },
      enumerable: true
    }
  })
  if (isArray) {
    propDef.length = {
      value: data.length,
      enumerable: false
    }
  }
  propDef.__rawObject__ = {
    get() {
      return data
    },
    set() {
      throw new Error('Setting data is not allowed')
    },
    enumerable: false
  }
  const proto = isArray ? Array.prototype : Object.prototype
  return Object.create(proto, propDef)
}

exports.create = (data, relatedPathValues) => wrapData(data, relatedPathValues, [])

exports.unwrap = (wrapped) => {
  if (typeof wrapped !== 'object' || wrapped === null || typeof wrapped.__rawObject__ !== 'object') {
    return wrapped
  }
  return wrapped.__rawObject__
}

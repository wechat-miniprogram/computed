const wrapData = (data, relatedPathValues, basePath) => {
  if (typeof data !== 'object' || data === null) return data
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
      }
    }
  })
  return Object.create(Object.prototype, propDef)
}

exports.create = (data, relatedPathValues) => wrapData(data, relatedPathValues, [])

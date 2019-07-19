const wrapData = (data, relatedPaths, basePath) => {
  if (typeof data !== 'object' || data === null) return data
  const propDef = {}
  Object.keys(data).forEach((key) => {
    let keyWrapper = null
    propDef[key] = {
      get() {
        if (!keyWrapper) {
          const keyPath = basePath.concat(key)
          relatedPaths.push(keyPath.join('\n'))
          keyWrapper = wrapData(data[key], relatedPaths, keyPath)
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

exports.create = (data, relatedPaths) => wrapData(data, relatedPaths, [])

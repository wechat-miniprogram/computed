import ProxyPolyfillBuilder from 'proxy-polyfill/src/proxy'
const ProxyPolyfill = ProxyPolyfillBuilder()

const wrapData = (data, relatedPathValues, basePath) => {
  if (typeof data !== 'object' || data === null) return data
  const handler = {
    get(obj, key) {
      if (key === '__rawObject__') return obj
      let keyWrapper = null
      const keyPath = basePath.concat(key)
      const value = obj[key]
      relatedPathValues.push({
        path: keyPath,
        value,
      })
      keyWrapper = wrapData(value, relatedPathValues, keyPath)
      return keyWrapper
    },
  }
  let propDef
  try {
    propDef = new Proxy(data, handler)
  } catch (e) {
    propDef = new ProxyPolyfill(data, handler)
  }
  return propDef
}

export function create(data, relatedPathValues) {
  return wrapData(data, relatedPathValues, [])
}

export function unwrap(wrapped) {
  // @ts-ignore
  if (Array.isArray(wrapped) && typeof wrapped.__rawObject__ !== 'object') {
    return wrapped.map((i) => unwrap(i))
  }
  if (
    typeof wrapped !== 'object' ||
    wrapped === null ||
    typeof wrapped.__rawObject__ !== 'object'
  ) {
    return wrapped
  }
  return wrapped.__rawObject__
}

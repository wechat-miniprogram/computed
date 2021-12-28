import ProxyPolyfillBuilder from 'proxy-polyfill/src/proxy'
const ProxyPolyfill = ProxyPolyfillBuilder()

interface IWrappedData { 
  __rawObject__: unknown;
}

export interface IRelatedPathValue {
  path: Array<string>;
  value: unknown;
}

const wrapData = (data: unknown, relatedPathValues: Array<IRelatedPathValue>, basePath: Array<string>) => {
  if (typeof data !== 'object' || data === null) return data
  const handler = {
    get(obj: unknown, key: string) {
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

export function create(data: unknown, relatedPathValues: Array<IRelatedPathValue>) {
  return wrapData(data, relatedPathValues, [])
}

export function unwrap(wrapped: IWrappedData) {
  // #70
  if (typeof wrapped.__rawObject__ !== 'object' && typeof wrapped === 'object' && wrapped !== null) {
    if (Array.isArray(wrapped)) {
      return wrapped.map((i) => unwrap(i))
    }
    const ret = {}
    Object.keys(wrapped).forEach(k => {
      ret[k] = unwrap(wrapped[k])
    })
    return ret
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

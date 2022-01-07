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
  try {
    return new Proxy(data, handler)
  } catch (e) {
    return new ProxyPolyfill(data, handler)
  }
}

export function create(data: unknown, relatedPathValues: Array<IRelatedPathValue>) {
  return wrapData(data, relatedPathValues, [])
}

export function unwrap(wrapped: IWrappedData) {
  // #70
  if (wrapped !== null && typeof wrapped === 'object' && typeof wrapped.__rawObject__ !== 'object' ) {
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

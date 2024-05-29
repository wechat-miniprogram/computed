import ProxyPolyfillBuilder from 'proxy-polyfill/src/proxy'
const ProxyPolyfill = ProxyPolyfillBuilder()

interface WrappedData {
  __rawObject__: unknown
}

export type RelatedPathValue =
  | {
      kind: 'value'
      path: Array<string>
      value: unknown
    }
  | {
      kind: 'keys'
      path: Array<string>
      keys: Array<string>
    }

const wrapData = (
  data: unknown,
  relatedPathValues: Array<RelatedPathValue>,
  basePath: Array<string>,
) => {
  if (typeof data !== 'object' || data === null) return data
  const handler = {
    get(obj: unknown, key: string) {
      if (key === '__rawObject__') return obj
      let keyWrapper = null
      const keyPath = basePath.concat(key)
      const value = obj[key]
      relatedPathValues.push({
        kind: 'value',
        path: keyPath,
        value,
      })
      keyWrapper = wrapData(value, relatedPathValues, keyPath)
      return keyWrapper
    },
    ownKeys(obj: unknown) {
      const keyPath = basePath.slice()
      const keys = Object.keys(obj).sort()
      relatedPathValues.push({
        kind: 'keys',
        path: keyPath,
        keys,
      })
      return keys
    },
  }
  try {
    return new Proxy(data, handler)
  } catch (e) {
    return new ProxyPolyfill(data, handler)
  }
}

export function create(data: unknown, relatedPathValues: Array<RelatedPathValue>) {
  return wrapData(data, relatedPathValues, [])
}

export function unwrap(wrapped: unknown) {
  // #70
  if (
    wrapped !== null &&
    typeof wrapped === 'object' &&
    typeof (wrapped as WrappedData).__rawObject__ !== 'object'
  ) {
    if (Array.isArray(wrapped)) {
      return wrapped.map((i) => unwrap(i))
    }
    const ret = {}
    Object.keys(wrapped).forEach((k) => {
      ret[k] = unwrap(wrapped[k])
    })
    return ret
  }
  if (
    typeof wrapped !== 'object' ||
    wrapped === null ||
    typeof (wrapped as WrappedData).__rawObject__ !== 'object'
  ) {
    return wrapped
  }
  return (wrapped as WrappedData).__rawObject__
}

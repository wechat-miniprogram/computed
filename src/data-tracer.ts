type WrappedData<T> = T & {
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

const wrapData = <T>(
  data: T,
  relatedPathValues: Array<RelatedPathValue>,
  basePath: Array<string>,
): T => {
  if (typeof data !== 'object' || data === null) return data
  const handler = {
    get(obj: object, key: string) {
      if (key === '__rawObject__') return obj
      let keyWrapper: any = null
      const keyPath = basePath.concat(key)
      const value = (obj as { [key: string]: unknown })[key]
      relatedPathValues.push({
        kind: 'value',
        path: keyPath,
        value,
      })
      keyWrapper = wrapData(value, relatedPathValues, keyPath)
      return keyWrapper as T
    },
    ownKeys(obj: object) {
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
  return new Proxy(data, handler) as T
}

export function create<T>(data: T, relatedPathValues: Array<RelatedPathValue>): T {
  return wrapData(data, relatedPathValues, [])
}

export function unwrap<T>(wrapped: T): T {
  // #70
  if (
    wrapped !== null &&
    typeof wrapped === 'object' &&
    typeof (wrapped as WrappedData<T>).__rawObject__ !== 'object'
  ) {
    if (Array.isArray(wrapped)) {
      return wrapped.map((i: unknown) => unwrap(i)) as T
    }
    const ret = {} as T
    Object.keys(wrapped).forEach((k) => {
      ;(ret as { [key: string]: unknown })[k] = unwrap((wrapped as { [key: string]: unknown })[k])
    })
    return ret
  }
  if (
    typeof wrapped !== 'object' ||
    wrapped === null ||
    typeof (wrapped as WrappedData<T>).__rawObject__ !== 'object'
  ) {
    return wrapped
  }
  return (wrapped as WrappedData<T>).__rawObject__ as T
}

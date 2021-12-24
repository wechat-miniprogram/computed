import ProxyPolyfillBuilder from "proxy-polyfill/src/proxy";
const ProxyPolyfill = ProxyPolyfillBuilder();

const wrapData = (data, relatedPathValues, basePath) => {
  if (typeof data !== "object" || data === null) return data;
  const handler = {
    get(_obj, key) {
      if (key === "__rawObject__") return data;
      let keyWrapper = null;
      const keyPath = basePath.concat(key);
      const value = data[key];
      relatedPathValues.push({
        path: keyPath,
        value,
      });
      keyWrapper = wrapData(value, relatedPathValues, keyPath);
      return keyWrapper;
    },
  };
  // for test
  // const Proxy = undefined;

  let propDef;
  try {
    propDef = new Proxy(data, handler);
  } catch (e) {
    // console.log("[miniprogram-computed]: use Proxy Polyfill");
    propDef = new ProxyPolyfill(data, handler);
  }
  return propDef;
};

export function create(data, relatedPathValues) {
  return wrapData(data, relatedPathValues, []);
}

export function unwrap(wrapped) {
  if (
    typeof wrapped !== "object" ||
    wrapped === null ||
    typeof wrapped.__rawObject__ !== "object"
  ) {
    return wrapped;
  }
  return wrapped.__rawObject__;
}

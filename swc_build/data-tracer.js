"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.create=create,exports.unwrap=unwrap;var wrapData=function(a,b,c){if("object"!=typeof a||null===a)return a;var d={get:function(e,f){if("__rawObject__"===f)return a;var g=c.concat(f),h=a[f];return b.push({path:g,value:h}),wrapData(h,b,g)}};return new Proxy(a,d)};function create(i,j){return wrapData(i,j,[])}function unwrap(k){return"object"!=typeof k||null===k||"object"!=typeof k.__rawObject__?k:k.__rawObject__}
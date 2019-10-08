const WHITE_SPACE_CHAR_REGEXP = /^\s/
const OPT_KEY_LIST = ['deepCmp', 'dc']

const throwParsingError = function (path, index) {
  throw new Error('Parsing data path "' + path + '" failed at char "' + path[index] + '" (index ' + index + ')')
}

const testOptKey = function (key) {
  if (OPT_KEY_LIST.indexOf(key) >= 0) return
  throw new Error('Unrecorgnized data path option: ' + key)
}

const parseArrIndex = function (path, state) {
  const startIndex = state.index
  while (state.index < state.length) {
    const ch = path[state.index]
    if (/^[0-9]/.test(ch)) {
      state.index++
      continue
    }
    break
  }
  if (startIndex === state.index) {
    throwParsingError(path, state.index)
  }
  return parseInt(path.slice(startIndex, state.index), 10)
}

const parseIdent = function (path, state) {
  const startIndex = state.index
  const ch = path[startIndex]
  if (/^[_a-zA-Z$]/.test(ch)) {
    state.index++
    while (state.index < state.length) {
      const ch = path[state.index]
      if (/^[_a-zA-Z0-9$]/.test(ch)) {
        state.index++
        continue
      }
      break
    }
  } else {
    throwParsingError(path, state.index)
  }
  return path.slice(startIndex, state.index)
}

const parseOpts = function (path, state, options) {
  const key = parseIdent(path, state)
  testOptKey(key)
  options[key] = true
  // while (state.index < state.length) {
  //   const ch = path[state.index]
  //   if (ch === '-') {
  //     state.index++
  //     const key = parseIdent(path, state)
  //     testOptKey(key)
  //     options[key] = true
  //   } else {
  //     break
  //   }
  // }
  return options
}

const parseSinglePath = function (path, state) {
  const paths = [parseIdent(path, state)]
  const options = {}
  while (state.index < state.length) {
    const ch = path[state.index]
    if (ch === '[') {
      state.index++
      paths.push(parseArrIndex(path, state))
      const nextCh = path[state.index]
      if (nextCh !== ']') throwParsingError(path, state.index)
      state.index++
    } else if (ch === '.') {
      state.index++
      paths.push(parseIdent(path, state))
    } else if (ch === ':') {
      state.index++
      parseOpts(path, state, options)
      break
    } else {
      break
    }
  }
  return {path: paths, options}
}

const parseMultiPaths = function (path, state) {
  while (WHITE_SPACE_CHAR_REGEXP.test(path[state.index])) {
    state.index++
  }
  const ret = [parseSinglePath(path, state)]
  let splitted = false
  while (state.index < state.length) {
    const ch = path[state.index]
    if (WHITE_SPACE_CHAR_REGEXP.test(ch)) {
      state.index++
    } else if (ch === ',') {
      splitted = true
      state.index++
    } else if (splitted) {
      splitted = false
      ret.push(parseSinglePath(path, state))
    }
  }
  return ret
}

const parseEOF = function (path, state) {
  if (state.index < state.length) throwParsingError(path, state.index)
}

exports.parseSingleDataPath = function (path) {
  const state = {
    length: path.length,
    index: 0
  }
  const ret = parseSinglePath(path, state)
  parseEOF(path, state)
  return ret
}

exports.parseMultiDataPaths = function (path) {
  const state = {
    length: path.length,
    index: 0
  }
  const ret = parseMultiPaths(path, state)
  parseEOF(path, state)
  return ret
}

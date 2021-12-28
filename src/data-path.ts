const WHITE_SPACE_CHAR_REGEXP = /^\s/

interface IParserState { 
  index: number;
  length: number;
}

const throwParsingError = (path: string, index: number) => {
  throw new Error(
    'Parsing data path "' +
      path +
      '" failed at char "' +
      path[index] +
      '" (index ' +
      index +
      ')',
  )
}

const parseArrIndex = (path: string, state: IParserState) => {
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

const parseIdent = (path: string, state: IParserState) => {
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

const parseSinglePath = (path: string, state: IParserState) => {
  const paths = [parseIdent(path, state)]
  const options = {
    deepCmp: false,
  }
  while (state.index < state.length) {
    const ch = path[state.index]
    if (ch === '[') {
      state.index++
      paths.push(`${parseArrIndex(path, state)}`)
      const nextCh = path[state.index]
      if (nextCh !== ']') throwParsingError(path, state.index)
      state.index++
    } else if (ch === '.') {
      state.index++
      const ch = path[state.index]
      if (ch === '*') {
        state.index++
        const ch = path[state.index]
        if (ch === '*') {
          state.index++
          options.deepCmp = true
          break
        }
        throwParsingError(path, state.index)
      }
      paths.push(parseIdent(path, state))
    } else {
      break
    }
  }
  return { path: paths, options }
}

const parseMultiPaths = (path: string, state: IParserState) => {
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
    } else {
      throwParsingError(path, state.index)
    }
  }
  return ret
}

const parseEOF = (path: string, state: IParserState) => {
  if (state.index < state.length) throwParsingError(path, state.index)
}

export const parseMultiDataPaths = (path: string) => {
  const state = {
    length: path.length,
    index: 0,
  }
  const ret = parseMultiPaths(path, state)
  parseEOF(path, state)
  return ret
}

export const getDataOnPath = (data: unknown, path: Array<string>) => {
  let ret = data
  path.forEach((s) => {
    if (typeof ret !== 'object' || ret === null) ret = undefined
    else ret = ret[s]
  })
  return ret
}

const fs = require('fs')
const path = require('path')

// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const through = require('through2')

/**
 * async function wrapper
 */
function wrap(func, scope) {
  return function (...args) {
    if (args.length) {
      const temp = args.pop()
      if (typeof temp !== 'function') {
        args.push(temp)
      }
    }

    return new Promise(function (resolve, reject) {
      args.push(function (err, data) {
        if (err) reject(err)
        else resolve(data)
      })

      func.apply((scope || null), args)
    })
  }
}

const accessSync = wrap(fs.access)
const statSync = wrap(fs.stat)
const renameSync = wrap(fs.rename)
const mkdirSync = wrap(fs.mkdir)
const readFileSync = wrap(fs.readFile)
const writeFileSync = wrap(fs.writeFile)

/**
 * transform path segment separator
 */
function transformPath(filePath, sep = '/') {
  return filePath.replace(/[\\/]/g, sep)
}

/**
 * check file exists
 */
async function checkFileExists(filePath) {
  try {
    await accessSync(filePath)
    return true
  } catch (err) {
    return false
  }
}

/**
 * create folder
 */
async function recursiveMkdir(dirPath) {
  const prevDirPath = path.dirname(dirPath)
  try {
    await accessSync(prevDirPath)
  } catch (err) {
    // prevDirPath is not exist
    await recursiveMkdir(prevDirPath)
  }

  try {
    await accessSync(dirPath)

    const stat = await statSync(dirPath)
    if (stat && !stat.isDirectory()) {
      // dirPath already exists but is not a directory
      await renameSync(dirPath, `${dirPath}.bak`) // rename to a file with the suffix ending in '.bak'
      await mkdirSync(dirPath)
    }
  } catch (err) {
    // dirPath is not exist
    await mkdirSync(dirPath)
  }
}

/**
 * read json
 */
function readJson(filePath) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const content = require(filePath)
    delete require.cache[require.resolve(filePath)]
    return content
  } catch (err) {
    return null
  }
}

/**
 * read file
 */
async function readFile(filePath) {
  try {
    return await readFileSync(filePath, 'utf8')
  } catch (err) {
    // eslint-disable-next-line no-console
    return console.error(err)
  }
}

/**
 * write file
 */
async function writeFile(filePath, data) {
  try {
    await recursiveMkdir(path.dirname(filePath))
    return await writeFileSync(filePath, data, 'utf8')
  } catch (err) {
    // eslint-disable-next-line no-console
    return console.error(err)
  }
}

/**
 * time format
 */
function format(time, reg) {
  const date = typeof time === 'string' ? new Date(time) : time
  const map = {}
  map.yyyy = date.getFullYear()
  map.yy = ('' + map.yyyy).substr(2)
  map.M = date.getMonth() + 1
  map.MM = (map.M < 10 ? '0' : '') + map.M
  map.d = date.getDate()
  map.dd = (map.d < 10 ? '0' : '') + map.d
  map.H = date.getHours()
  map.HH = (map.H < 10 ? '0' : '') + map.H
  map.m = date.getMinutes()
  map.mm = (map.m < 10 ? '0' : '') + map.m
  map.s = date.getSeconds()
  map.ss = (map.s < 10 ? '0' : '') + map.s

  return reg.replace(/\byyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s\b/g, $1 => map[$1])
}

/**
 * logger plugin
 */
function logger(action = 'copy') {
  return through.obj(function (file, enc, cb) {
    const type = path.extname(file.path).slice(1).toLowerCase()

    // eslint-disable-next-line no-console
    console.log(`[${format(new Date(), 'yyyy-MM-dd HH:mm:ss').grey}] [${action.green} ${type.green}] ${'=>'.cyan} ${file.path}`)

    this.push(file)
    cb()
  })
}

/**
 * compare arrays
 */
function compareArray(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false
  if (arr1.length !== arr2.length) return false

  for (let i = 0, len = arr1.length; i < len; i++) {
    if (arr1[i] !== arr2[i]) return false
  }

  return true
}

/**
 * merge two object
 */
function merge(obj1, obj2) {
  Object.keys(obj2).forEach(key => {
    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      obj1[key] = obj1[key].concat(obj2[key])
    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      obj1[key] = Object.assign(obj1[key], obj2[key])
    } else {
      obj1[key] = obj2[key]
    }
  })

  return obj1
}

/**
 * get random id
 */
let seed = +new Date()
function getId() {
  return ++seed
}

module.exports = {
  wrap,
  transformPath,

  checkFileExists,
  readJson,
  readFile,
  writeFile,

  logger,
  format,
  compareArray,
  merge,
  getId,
}

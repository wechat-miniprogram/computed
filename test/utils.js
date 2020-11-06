const path = require('path')
const simulate = require('miniprogram-simulate')
const exparser = require('miniprogram-exparser')

const config = require('../tools/config')

const srcPath = config.srcPath
const oldLoad = simulate.load
simulate.load = function (componentPath, ...args) {
  if (typeof componentPath === 'string') componentPath = path.join(srcPath, componentPath)
  return oldLoad(componentPath, ...args)
}

simulate.exparser = exparser
module.exports = simulate

// adjust the simulated wx api
const oldGetSystemInfoSync = global.wx.getSystemInfoSync
global.wx.getSystemInfoSync = function () {
  const res = oldGetSystemInfoSync()
  res.SDKVersion = '2.4.1'

  return res
}

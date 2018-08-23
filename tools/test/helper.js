const path = require('path')

const jComponent = require('j-component')

const config = require('../config')
const _ = require('../utils')

const srcPath = config.srcPath
const componentMap = {}
let nowLoad = null

/**
 * register custom component
 */
global.Component = options => {
  const component = nowLoad
  const definition = Object.assign({
    template: component.wxml,
    usingComponents: component.json.usingComponents,
    tagName: component.tagName,
  }, options)

  component.id = jComponent.register(definition)
}

/**
 * register behavior
 */
global.Behavior = options => jComponent.behavior(options)

/**
 * register global components
 */
// eslint-disable-next-line semi-style
;[
  'view', 'scroll-view', 'swiper', 'movable-view', 'cover-view', 'cover-view',
  'icon', 'text', 'rich-text', 'progress',
  'button', 'checkbox', 'form', 'input', 'label', 'picker', 'picker', 'picker-view', 'radio', 'slider', 'switch', 'textarea',
  'navigator', 'function-page-navigator',
  'audio', 'image', 'video', 'camera', 'live-player', 'live-pusher',
  'map',
  'canvas',
  'open-data', 'web-view', 'ad'
].forEach(name => {
  jComponent.register({
    id: name,
    tagName: `wx-${name}`,
    template: '<slot/>'
  })
})

/**
 * Touch polyfill
 */
class Touch {
  constructor(options = {}) {
    this.clientX = 0
    this.clientY = 0
    this.identifier = 0
    this.pageX = 0
    this.pageY = 0
    this.screenX = 0
    this.screenY = 0
    this.target = null

    Object.keys(options).forEach(key => {
      this[key] = options[key]
    })
  }
}
global.Touch = window.Touch = Touch

/**
 * load component
 */
async function load(componentPath, tagName) {
  if (typeof componentPath === 'object') {
    const definition = componentPath

    return jComponent.register(definition)
  }

  const wholePath = path.join(srcPath, componentPath)

  const oldLoad = nowLoad
  const component = nowLoad = {}

  component.tagName = tagName
  component.wxml = await _.readFile(`${wholePath}.wxml`)
  component.wxss = await _.readFile(`${wholePath}.wxss`)
  component.json = _.readJson(`${wholePath}.json`)

  if (!component.json) {
    throw new Error(`invalid component: ${wholePath}`)
  }

  // preload using components
  const usingComponents = component.json.usingComponents || {}
  const usingComponentKeys = Object.keys(usingComponents)
  for (let i = 0, len = usingComponentKeys.length; i < len; i++) {
    const key = usingComponentKeys[i]
    const usingPath = path.join(path.dirname(componentPath), usingComponents[key])
    // eslint-disable-next-line no-await-in-loop
    const id = await load(usingPath)

    usingComponents[key] = id
  }

  // require js
  // eslint-disable-next-line import/no-dynamic-require
  require(wholePath)

  nowLoad = oldLoad
  componentMap[wholePath] = component

  return component.id
}

/**
 * render component
 */
function render(componentId, properties) {
  if (!componentId) throw new Error('you need to pass the componentId')

  return jComponent.create(componentId, properties)
}

/**
 * test a dom is similar to the html
 */
function match(dom, html) {
  if (!(dom instanceof window.Element) || !html || typeof html !== 'string') return false

  // remove some
  html = html.trim()
    .replace(/(>)[\n\r\s\t]+(<)/g, '$1$2')

  const a = dom.cloneNode()
  const b = dom.cloneNode()

  a.innerHTML = dom.innerHTML
  b.innerHTML = html

  return a.isEqualNode(b)
}

/**
 * wait for some time
 */
function sleep(time = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

module.exports = {
  load,
  render,
  match,
  sleep,
}

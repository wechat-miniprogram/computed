const _ = require('./utils')

let componentId
let component

beforeAll(async () => {
  componentId = await _.load('index')
})

test('render', async () => {
  component = _.render(componentId, {prop: 'index.test.properties'})
  _.attach(component)

  expect(_.match(component.dom, '<wx-view class="index">index.test.properties</wx-view>')).toBe(true)
})

const _ = require('./utils')
const computedBehavior = require('../src/index')

test('computed: setData', async () => {
  let componentId = await _.load({
    template: '<view>{{a}}-{{b}}</view>',
    behaviors: [computedBehavior],
    data: {
      a: 0,
    },
    computed: {
      b() {
        return this.data.a + 100
      },
    },
  })
  let component = _.render(componentId)

  expect(_.match(component.dom, '<wx-view>0-100</wx-view>')).toBe(true)

  component.setData({a: 1})
  expect(_.match(component.dom, '<wx-view>1-101</wx-view>')).toBe(true)

  component.setData({a: 9})
  expect(_.match(component.dom, '<wx-view>9-109</wx-view>')).toBe(true)
})

test('computed: properties', async () => {
  let componentId1 = await _.load({
    template: '<view>{{a}}-{{b}}</view>',
    behaviors: [computedBehavior],
    properties: {
      a: {
        type: Number,
        value: 0,
      },
    },
    computed: {
      b() {
        return this.data.a + 100
      },
    },
  })
  let componentId2 = await _.load({
    template: '<comp a="{{a}}"></comp>',
    usingComponents: {
      'comp': componentId1,
    },
    data: {
      a: 0,
    },
  })
  let component = _.render(componentId2)

  expect(_.match(component.dom, '<comp><wx-view>0-100</wx-view></comp>')).toBe(true)
  
  component.setData({a: 1})
  expect(_.match(component.dom, '<comp><wx-view>1-101</wx-view></comp>')).toBe(true)

  component.setData({a: 9})
  expect(_.match(component.dom, '<comp><wx-view>9-109</wx-view></comp>')).toBe(true)
})

const _ = require('./utils')
const computedBehavior = require('../src/index')

test('computed: setData', async () => {
  let componentId = await _.load({
    template: '<view>{{a}}-{{b}}-{{c}}</view>',
    behaviors: [computedBehavior],
    properties: {
      c: {
        type: Number,
        value: 0,
      },
    },
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

  expect(_.match(component.dom, '<wx-view>0-100-0</wx-view>')).toBe(true)

  component.setData({a: 1})
  expect(_.match(component.dom, '<wx-view>1-101-0</wx-view>')).toBe(true)

  component.setData({a: 9})
  expect(_.match(component.dom, '<wx-view>9-109-0</wx-view>')).toBe(true)

  component.setData({c: 88})
  expect(_.match(component.dom, '<wx-view>9-109-88</wx-view>')).toBe(true)
})

test('computed: properties', async () => {
  let observeNewVal = 0
  let observeOldVal = 0
  let componentId1 = await _.load({
    template: '<view>{{a}}-{{b}}</view>',
    behaviors: [computedBehavior],
    properties: {
      a: {
        type: Number,
        value: 0,
        observer(newVal, oldVal) {
          observeNewVal = newVal
          observeOldVal = oldVal
        },
      },
    },
    computed: {
      b() {
        return this.data.a + 100
      },
    },
  })
  let componentId2 = await _.load({
    template: '<comp id="child" a="{{a}}"></comp>',
    usingComponents: {
      'comp': componentId1,
    },
    data: {
      a: 0,
    },
  })
  let component = _.render(componentId2)

  expect(_.match(component.dom, '<comp><wx-view>0-100</wx-view></comp>')).toBe(true)
  expect(observeNewVal).toBe(0)
  expect(observeOldVal).toBe(0)
  
  component.setData({a: 1})
  expect(_.match(component.dom, '<comp><wx-view>1-101</wx-view></comp>')).toBe(true)
  expect(observeNewVal).toBe(1)
  expect(observeOldVal).toBe(0)

  component.setData({a: 9})
  expect(_.match(component.dom, '<comp><wx-view>9-109</wx-view></comp>')).toBe(true)
  expect(observeNewVal).toBe(9)
  expect(observeOldVal).toBe(1)

  component.querySelector('#child').setData({a: 100})
  expect(_.match(component.dom, '<comp><wx-view>100-200</wx-view></comp>')).toBe(true)
  expect(observeNewVal).toBe(100)
  expect(observeOldVal).toBe(9)
})

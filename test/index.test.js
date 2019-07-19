const _ = require('./utils')
const computedBehavior = require('../src/index')

test('watch basics', () => {
  let funcTriggeringCount = 0
  const componentId = _.load({
    template: '<view>{{a}}+{{b}}={{c}}</view>',
    behaviors: [computedBehavior],
    data: {
      a: 1,
      b: 2,
      c: 3,
    },
    watch: {
      'a, b': function (a, b) {
        funcTriggeringCount++
        this.setData({
          c: a + b
        })
      }
    },
  })
  const component = _.render(componentId)

  expect(_.match(component.dom, '<wx-view>1+2=3</wx-view>')).toBe(true)
  expect(funcTriggeringCount).toBe(0)

  component.setData({a: 10})
  expect(_.match(component.dom, '<wx-view>10+2=12</wx-view>')).toBe(true)
  expect(funcTriggeringCount).toBe(1)

  component.setData({b: 20})
  expect(_.match(component.dom, '<wx-view>10+20=30</wx-view>')).toBe(true)
  expect(funcTriggeringCount).toBe(2)

  component.setData({a: 100, b: 200})
  expect(_.match(component.dom, '<wx-view>100+200=300</wx-view>')).toBe(true)
  expect(funcTriggeringCount).toBe(3)

  component.setData({c: -1})
  expect(_.match(component.dom, '<wx-view>100+200=-1</wx-view>')).toBe(true)
  expect(funcTriggeringCount).toBe(3)
})

test('watch data path', () => {
  let func1TriggeringCount = 0
  let func2TriggeringCount = 0
  const componentId = _.load({
    template: '<view>{{a.d}}+{{b[0]}}={{c}}</view>',
    behaviors: [computedBehavior],
    data: {
      a: {d: 1},
      b: [2],
      c: 3,
    },
    watch: {
      a() {
        func1TriggeringCount++
      },
      ' a.d  ,b[0] ': function (ad, b0) {
        func2TriggeringCount++
        this.setData({
          c: ad + b0
        })
      }
    },
  })
  const component = _.render(componentId)

  expect(_.match(component.dom, '<wx-view>1+2=3</wx-view>')).toBe(true)
  expect(func1TriggeringCount).toBe(0)
  expect(func2TriggeringCount).toBe(0)

  component.setData({a: {d: 10}})
  expect(_.match(component.dom, '<wx-view>10+2=12</wx-view>')).toBe(true)
  expect(func1TriggeringCount).toBe(1)
  expect(func2TriggeringCount).toBe(1)

  component.setData({b: [20]})
  expect(_.match(component.dom, '<wx-view>10+20=30</wx-view>')).toBe(true)
  expect(func1TriggeringCount).toBe(1)
  expect(func2TriggeringCount).toBe(2)

  component.setData({'a.d': 100})
  expect(_.match(component.dom, '<wx-view>100+20=120</wx-view>')).toBe(true)
  expect(func1TriggeringCount).toBe(1)
  expect(func2TriggeringCount).toBe(3)

  component.setData({'b[0]': 200})
  expect(_.match(component.dom, '<wx-view>100+200=300</wx-view>')).toBe(true)
  expect(func1TriggeringCount).toBe(1)
  expect(func2TriggeringCount).toBe(4)

  component.setData({'a.e': -1})
  expect(_.match(component.dom, '<wx-view>100+200=300</wx-view>')).toBe(true)
  expect(func1TriggeringCount).toBe(1)
  expect(func2TriggeringCount).toBe(4)

  component.setData({'b[2]': -1})
  expect(_.match(component.dom, '<wx-view>100+200=300</wx-view>')).toBe(true)
  expect(func1TriggeringCount).toBe(1)
  expect(func2TriggeringCount).toBe(4)
})

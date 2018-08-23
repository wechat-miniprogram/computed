const _ = require('./utils')
const computedBehavior = require('../src/index')

test('computed', async () => {
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

import * as adapter from 'glass-easel-miniprogram-adapter'
import { BehaviorWithComputed } from '../src'
import { behavior as computedBehavior, computed, watch } from '../src'
import { defineComponent, renderComponent } from './env'

const innerHTML = (component: adapter.component.GeneralComponent) => {
  return (component._$.$$ as unknown as HTMLElement).innerHTML
}

adapter.glassEasel.globalOptions.throwGlobalError = true

const behaviorA = Behavior({
  data: {
    b: 2,
    c: {
      d: 3,
      e: [1, 2, 3],
    },
  },
  attached() {
    this.setData({
      attachedData: 10,
    })
  },
})

describe('computed behavior', () => {
  test('watch basics', () => {
    let funcTriggeringCount = 0

    const component = renderComponent(undefined, '<view>{{a}}+{{b}}={{c}}</view>', (Component) => {
      Component({
        behaviors: [computedBehavior],
        properties: {
          a: {
            type: Number,
            value: 1,
          },
        },
        data: {
          b: 2,
          c: 3,
        },
        watch: {
          'a, b': function (a, b) {
            funcTriggeringCount++
            this.setData({
              c: a + b,
            })
          },
        },
      } as any)
    }) as any
    expect(innerHTML(component)).toBe('<view>1+2=3</view>')
    expect(funcTriggeringCount).toBe(0)

    component.setData({ a: 10 })
    expect(innerHTML(component)).toBe('<view>10+2=12</view>')
    expect(funcTriggeringCount).toBe(1)

    component.setData({ b: 20 })
    expect(innerHTML(component)).toBe('<view>10+20=30</view>')
    expect(funcTriggeringCount).toBe(2)

    component.setData({ a: 100, b: 200 })
    expect(innerHTML(component)).toBe('<view>100+200=300</view>')
    expect(funcTriggeringCount).toBe(3)

    component.setData({ c: -1 })
    expect(innerHTML(component)).toBe('<view>100+200=-1</view>')
    expect(funcTriggeringCount).toBe(3)
  })

  test('watch with chaining API', () => {
    const component = renderComponent(
      undefined,
      '<view>{{a}}+{{b}}={{c}}</view>',
      (Component) => {
        Component()
          .property('a', {
            type: Number,
            value: 1,
          })
          .data(() => ({
            b: 2,
            c: 0,
          }))
          .init((ctx) => {
            watch(ctx, 'a, b', (a: number, b: number) => {
              ctx.setData({ c: a + b })
            })
          })
          .register()
      },
    ) as any
    expect(innerHTML(component)).toBe('<view>1+2=0</view>')

    component.setData({ a: 10 })
    expect(innerHTML(component)).toBe('<view>10+2=12</view>')
  })

  test('watch property changes', () => {
    let funcTriggeringCount = 0
    const innerComponent = defineComponent(
      'inner',
      '<view>{{a}}+{{b}}={{c}}</view>',
      (Component) => {
        Component({
          behaviors: [computedBehavior],
          properties: {
            a: {
              type: Number,
              value: -1,
            },
            b: String,
          },
          watch: {
            'a, b': function (a, b) {
              funcTriggeringCount++
              this.setData({
                c: a + Number(b || 0),
              })
            },
          },
        } as any)
      },
    ) as any
    const component = renderComponent(
      undefined,
      '<inner a="{{a}}" b="{{b}}"></inner>',
      (Component) => {
        Component({
          usingComponents: {
            inner: innerComponent,
          },
          data: {
            a: 1,
            b: 2,
          },
        } as any)
      },
    ) as any

    expect(innerHTML(component)).toBe('<inner><view>1+2=3</view></inner>')
    expect(funcTriggeringCount).toBe(1)

    component.setData({ a: 100, b: 200 })
    expect(innerHTML(component)).toBe('<inner><view>100+200=300</view></inner>')
    expect(funcTriggeringCount).toBe(2)
  })

  test('watch data paths', () => {
    let func1TriggeringCount = 0
    let func2TriggeringCount = 0
    const component = renderComponent(
      undefined,
      '<view>{{a.d}}+{{b[0]}}={{c}}</view>',
      (Component) => {
        Component({
          behaviors: [computedBehavior],
          data: {
            a: { d: 1 },
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
                c: ad + b0,
              })
            },
          },
        } as any)
      },
    ) as any

    expect(innerHTML(component)).toBe('<view>1+2=3</view>')
    expect(func1TriggeringCount).toBe(0)
    expect(func2TriggeringCount).toBe(0)

    component.setData({ a: { d: 10 } })
    expect(innerHTML(component)).toBe('<view>10+2=12</view>')
    expect(func1TriggeringCount).toBe(1)
    expect(func2TriggeringCount).toBe(1)

    component.setData({ b: [20] })
    expect(innerHTML(component)).toBe('<view>10+20=30</view>')
    expect(func1TriggeringCount).toBe(1)
    expect(func2TriggeringCount).toBe(2)

    component.setData({ 'a.d': 100 })
    expect(innerHTML(component)).toBe('<view>100+20=120</view>')
    expect(func1TriggeringCount).toBe(1)
    expect(func2TriggeringCount).toBe(3)

    component.setData({ 'b[0]': 200 })
    expect(innerHTML(component)).toBe('<view>100+200=300</view>')
    expect(func1TriggeringCount).toBe(1)
    expect(func2TriggeringCount).toBe(4)

    component.setData({ 'a.e': -1 })
    expect(innerHTML(component)).toBe('<view>100+200=300</view>')
    expect(func1TriggeringCount).toBe(1)
    expect(func2TriggeringCount).toBe(4)

    component.setData({ 'b[2]': -1 })
    expect(innerHTML(component)).toBe('<view>100+200=300</view>')
    expect(func1TriggeringCount).toBe(1)
    expect(func2TriggeringCount).toBe(4)
  })

  test('watch data deep comparison', () => {
    let func1TriggeringCount = 0
    let func2TriggeringCount = 0
    let func3TriggeringCount = 0
    const component = renderComponent(
      undefined,
      '<view>{{obj.a}}+{{obj.b}}={{c}}</view>',
      (Component) => {
        Component({
          behaviors: [computedBehavior],
          data: {
            obj: {
              a: 1,
              b: 2,
            },
            c: 3,
          },
          watch: {
            obj() {
              func1TriggeringCount++
            },
            'obj.b': function () {
              func2TriggeringCount++
            },
            'obj.**': function (obj) {
              func3TriggeringCount++
              this.setData({
                c: obj.a + obj.b,
              })
            },
          },
        } as any)
      },
    ) as any

    expect(innerHTML(component)).toBe('<view>1+2=3</view>')
    expect(func1TriggeringCount).toBe(0)
    expect(func2TriggeringCount).toBe(0)
    expect(func3TriggeringCount).toBe(0)

    component.setData({ obj: { a: 10, b: 2 } })
    expect(innerHTML(component)).toBe('<view>10+2=12</view>')
    expect(func1TriggeringCount).toBe(1)
    expect(func2TriggeringCount).toBe(0)
    expect(func3TriggeringCount).toBe(1)

    component.setData({ 'obj.b': 2 })
    expect(innerHTML(component)).toBe('<view>10+2=12</view>')
    expect(func1TriggeringCount).toBe(1)
    expect(func2TriggeringCount).toBe(0)
    expect(func3TriggeringCount).toBe(1)

    component.setData({ 'obj.a': 100 })
    expect(innerHTML(component)).toBe('<view>100+2=102</view>')
    expect(func1TriggeringCount).toBe(1)
    expect(func2TriggeringCount).toBe(0)
    expect(func3TriggeringCount).toBe(2)
  })

  test('computed basics', () => {
    let func1TriggeringCount = 0
    let func2TriggeringCount = 0
    const component = renderComponent(
      undefined,
      '<view>{{a}}+{{b}}={{c}}, {{a}}*2={{d}}</view>',
      (Component) => {
        Component({
          behaviors: [computedBehavior],
          properties: {
            a: {
              type: Number,
              value: 1,
            },
            nullProp: null,
          },
          data: {
            b: 2,
          },
          computed: {
            c(data) {
              expect(data.nullProp).toBe(null)
              func1TriggeringCount++
              return data.a + data.b
            },
            d(data) {
              func2TriggeringCount++
              return data.a * 2
            },
          },
        } as any)
      },
    ) as any
    expect(innerHTML(component)).toBe('<view>1+2=3, 1*2=2</view>')
    expect(func1TriggeringCount).toBe(1)
    expect(func2TriggeringCount).toBe(1)

    component.setData({ a: 10 })
    expect(innerHTML(component)).toBe('<view>10+2=12, 10*2=20</view>')
    expect(func1TriggeringCount).toBe(2)
    expect(func2TriggeringCount).toBe(2)

    component.setData({ b: 20 })
    expect(innerHTML(component)).toBe('<view>10+20=30, 10*2=20</view>')
    expect(func1TriggeringCount).toBe(3)
    expect(func2TriggeringCount).toBe(2)

    component.setData({ a: 100, b: 200 })
    expect(innerHTML(component)).toBe('<view>100+200=300, 100*2=200</view>')
    expect(func1TriggeringCount).toBe(4)
    expect(func2TriggeringCount).toBe(3)
  })

  test('computed with chaining API', () => {
    const component = renderComponent(
      undefined,
      '<view>{{a}}+{{b}}={{c}}, {{d}}+1={{e}}</view>',
      (Component) => {
        Component()
          .property('a', {
            type: Number,
            value: 1,
          })
          .data(() => ({
            b: 2,
          }))
          .init((ctx) => {
            const data = computed(ctx, {
              c: (data) => data.a + data.b,
              d: (data) => data.a * 2,
            }, {
              e: (data) => data.d + 1,
            })
            ctx.lifetime('attached', () => {
              expect(data.e).toBe(3)
            })
          })
          .register()
      },
    ) as any
    expect(innerHTML(component)).toBe('<view>1+2=3, 2+1=3</view>')

    component.setData({ a: 10 })
    expect(innerHTML(component)).toBe('<view>10+2=12, 20+1=21</view>')
  })

  test('computed property changes', () => {
    let funcTriggeringCount = 0
    const innerComponent = defineComponent(
      'inner',
      '<view>{{a}}+{{b}}={{c}}</view>',
      (Component) => {
        Component({
          behaviors: [computedBehavior],
          properties: {
            a: {
              type: Number,
              value: -1,
            },
            b: String,
          },
          computed: {
            c(data) {
              funcTriggeringCount++
              return data.a + Number(data.b)
            },
          },
        } as any)
      },
    ) as any
    const component = renderComponent(
      undefined,
      '<inner a="{{a}}" b="{{b}}"></inner>',
      (Component) => {
        Component({
          usingComponents: {
            inner: innerComponent,
          },
          data: {
            a: 1,
            b: 2,
          },
        } as any)
      },
    ) as any

    expect(innerHTML(component)).toBe('<inner><view>1+2=3</view></inner>')
    expect(funcTriggeringCount).toBe(1)

    component.setData({ a: 100, b: 200 })
    expect(innerHTML(component)).toBe('<inner><view>100+200=300</view></inner>')
    expect(funcTriggeringCount).toBe(2)
  })

  test('computed chains', () => {
    let func1TriggeringCount = 0
    let func2TriggeringCount = 0
    const component = renderComponent(
      undefined,
      '<view>{{a}}+{{b}}={{c}}, {{a}}+{{c}}={{d}}</view>',
      (Component) => {
        Component({
          behaviors: [computedBehavior],
          data: {
            a: 1,
            b: 2,
          },
          computed: {
            c(data) {
              func1TriggeringCount++
              return data.a + data.b
            },
            d(data) {
              func2TriggeringCount++
              return data.a + data.c
            },
          },
        } as any)
      },
    ) as any
    expect(innerHTML(component)).toBe('<view>1+2=3, 1+3=4</view>')
    expect(func1TriggeringCount).toBe(1)
    expect(func2TriggeringCount).toBe(1)

    component.setData({ a: 10 })
    expect(innerHTML(component)).toBe('<view>10+2=12, 10+12=22</view>')
    expect(func1TriggeringCount).toBe(2)
    expect(func2TriggeringCount).toBe(2)

    component.setData({ b: 20 })
    expect(innerHTML(component)).toBe('<view>10+20=30, 10+30=40</view>')
    expect(func1TriggeringCount).toBe(3)
    expect(func2TriggeringCount).toBe(3)

    component.setData({ a: 100, b: 200 })
    expect(innerHTML(component)).toBe('<view>100+200=300, 100+300=400</view>')
    expect(func1TriggeringCount).toBe(4)
    expect(func2TriggeringCount).toBe(4)
  })

  test('computed conditions', () => {
    let funcTriggeringCount = 0
    const component = renderComponent(
      undefined,
      '<view>{{a}}, {{b}}, {{c}}, {{d}}</view>',
      (Component) => {
        Component({
          behaviors: [computedBehavior],
          data: {
            a: 0,
            b: 1,
            c: 2,
          },
          computed: {
            d(data) {
              funcTriggeringCount++
              return data.a ? data.b : data.c
            },
          },
        } as any)
      },
    ) as any
    expect(innerHTML(component)).toBe('<view>0, 1, 2, 2</view>')
    expect(funcTriggeringCount).toBe(1)

    component.setData({ b: 10 })
    expect(innerHTML(component)).toBe('<view>0, 10, 2, 2</view>')
    expect(funcTriggeringCount).toBe(1)

    component.setData({ c: 20 })
    expect(innerHTML(component)).toBe('<view>0, 10, 20, 20</view>')
    expect(funcTriggeringCount).toBe(2)

    component.setData({ a: -1 })
    expect(innerHTML(component)).toBe('<view>-1, 10, 20, 10</view>')
    expect(funcTriggeringCount).toBe(3)

    component.setData({ b: 100 })
    expect(innerHTML(component)).toBe('<view>-1, 100, 20, 100</view>')
    expect(funcTriggeringCount).toBe(4)

    component.setData({ c: 200 })
    expect(innerHTML(component)).toBe('<view>-1, 100, 200, 100</view>')
    expect(funcTriggeringCount).toBe(4)
  })

  test('computed data paths', () => {
    let funcTriggeringCount = 0
    const component = renderComponent(
      undefined,
      '<view>{{a.d}}+{{b[0]}}={{c[1].f}}</view>',
      (Component) => {
        Component({
          behaviors: [computedBehavior],
          data: {
            a: { d: 1 },
            b: [2],
          },
          computed: {
            'c[1]': function (data) {
              funcTriggeringCount++
              return {
                f: data.a.d + data.b[0],
              }
            },
          },
        } as any)
      },
    ) as any
    expect(innerHTML(component)).toBe('<view>1+2=3</view>')
    expect(funcTriggeringCount).toBe(1)

    component.setData({ a: { d: 10 } })
    expect(innerHTML(component)).toBe('<view>10+2=12</view>')
    expect(funcTriggeringCount).toBe(2)

    component.setData({ b: [20] })
    expect(innerHTML(component)).toBe('<view>10+20=30</view>')
    expect(funcTriggeringCount).toBe(3)

    component.setData({ 'a.d': 100 })
    expect(innerHTML(component)).toBe('<view>100+20=120</view>')
    expect(funcTriggeringCount).toBe(4)

    component.setData({ 'b[0]': 200 })
    expect(innerHTML(component)).toBe('<view>100+200=300</view>')
    expect(funcTriggeringCount).toBe(5)

    component.setData({ 'a.e': -1 })
    expect(innerHTML(component)).toBe('<view>100+200=300</view>')
    expect(funcTriggeringCount).toBe(5)

    component.setData({ 'b[2]': -1 })
    expect(innerHTML(component)).toBe('<view>100+200=300</view>')
    expect(funcTriggeringCount).toBe(5)
  })

  test('computed array read operations', () => {
    const component = renderComponent(undefined, '<view>{{r}}</view>', (Component) => {
      Component({
        behaviors: [computedBehavior],
        data: {
          a: ['a', 'b', 'c'],
        },
        computed: {
          r(data) {
            const oriArr = ['a', 'b', 'c']
            expect(
              data.a
                .filter((item, index) => {
                  expect(item).toBe(oriArr[index])
                  return true
                })
                .join(),
            ).toBe('a,b,c')
            data.a.forEach((item, index) => {
              expect(item).toBe(oriArr[index])
            })
            expect(data.a.includes('b')).toBe(true)
            expect(data.a.indexOf('b')).toBe(1)
            expect(data.a.indexOf('b')).toBe(1)
            expect(
              data.a
                .map((item, index) => {
                  expect(item).toBe(oriArr[index])
                  return item + '1'
                })
                .join(),
            ).toBe('a1,b1,c1')
            expect(
              data.a.reduce((res, item, index) => {
                expect(item).toBe(oriArr[index])
                return res + item
              }, ''),
            ).toBe('abc')
            return ''
          },
        },
      } as any)
    }) as any
    expect(innerHTML(component)).toBe('<view></view>')
  })

  test('computed object tracer', () => {
    const component = renderComponent(
      undefined,
      '<view>{{newArr[0] + newArr[1]}}</view><view>{{newObj.f0 + newObj.f1}}</view>',
      (Component) => {
        Component({
          behaviors: [computedBehavior],
          data: {
            arr: [1, 2],
            obj: {
              f0: 10,
              f1: 20,
            },
          },
          computed: {
            newArr(data) {
              return data.arr
            },
            newObj(data) {
              return data.obj
            },
          },
        } as any)
      },
    ) as any
    expect(innerHTML(component)).toBe('<view>3</view><view>30</view>')
  })

  test('computed behaviors data', () => {
    const component = renderComponent(undefined, '<view>{{a}}+{{b}}={{c}}</view>', (Component) => {
      Component({
        behaviors: [behaviorA, computedBehavior],
        data: {
          a: 1,
        },
        computed: {
          c(data) {
            return data.a + data.b
          },
        },
      } as any)
    }) as any
    expect(innerHTML(component)).toBe('<view>1+2=3</view>')
  })

  test('computed behaviors data deep comparison', () => {
    const component = renderComponent(
      undefined,
      '<view>{{a}}+{{c.d}}+{{c.e[0]}}={{f}}</view>',
      (Component) => {
        Component({
          behaviors: [behaviorA, computedBehavior],
          data: {
            a: 1,
          },
          computed: {
            f(data) {
              return data.a + data.c.d + data.c.e[0]
            },
          },
        } as any)
      },
    ) as any
    expect(innerHTML(component)).toBe('<view>1+3+1=5</view>')
  })

  test('computed behavior lifetimes', () => {
    const component = renderComponent(
      undefined,
      '<view>{{a}}+{{attachedData}}={{g}}</view>',
      (Component) => {
        Component({
          behaviors: [behaviorA, computedBehavior],
          data: {
            a: 1,
          },
          computed: {
            g(data) {
              return data.a + data.attachedData
            },
          },
        } as any)
      },
    ) as any
    expect(innerHTML(component)).toBe('<view>1+10=11</view>')
  })

  test('computed with wildcard observers', () => {
    const component = renderComponent(undefined, '<view>{{c}}</view>', (Component) => {
      Component({
        behaviors: [computedBehavior],
        data: {
          a: 1,
          c: 1,
        },
        computed: {
          b(data) {
            return data.a
          },
        },
        observers: {
          '**': function () {
            if (this.data.c === 1) this.setData({ c: 2 })
          },
        },
      } as any)
    }) as any
    expect(innerHTML(component)).toBe('<view>2</view>')
  })

  test('multiple usage in a single component', () => {
    let a1TriggerCount = 0
    let a2TriggerCount = 0
    let b1TriggerCount = 0
    let b2TriggerCount = 0
    let c1TriggerCount = 0
    let c2TriggerCount = 0
    const behA = BehaviorWithComputed({
      data: {
        a1: 1,
      },
      computed: {
        a2(data) {
          a2TriggerCount += 1
          return data.a1 * 2
        },
      },
      watch: {
        a1() {
          a1TriggerCount += 1
        },
      },
      attached() {
        this.setData({
          a1: 3,
        })
      },
    })
    const behB = BehaviorWithComputed({
      behaviors: [behA],
      data: {
        b1: 10,
      },
      computed: {
        b2(data) {
          b2TriggerCount += 1
          return data.a2 + data.b1 * 2
        },
      },
      watch: {
        b1() {
          b1TriggerCount += 1
        },
      },
      attached() {
        this.setData({
          b1: 30,
        })
      },
    })
    const component = renderComponent(
      undefined,
      '<view>{{a2}} {{b2}} {{c2}}</view>',
      (Component) => {
        Component({
          behaviors: [behB, computedBehavior],
          data: {
            c1: 100,
          },
          computed: {
            c2(data) {
              c2TriggerCount += 1
              return data.b2 + data.c1 * 2
            },
          },
          watch: {
            c1() {
              c1TriggerCount += 1
            },
          },
          attached() {
            this.setData({
              c1: 300,
            })
          },
        } as any)
      },
    ) as any
    expect(innerHTML(component)).toBe('<view>6 66 666</view>')
    expect(a1TriggerCount).toBe(1)
    expect(a2TriggerCount).toBe(2)
    expect(b1TriggerCount).toBe(1)
    expect(b2TriggerCount).toBe(3)
    expect(c1TriggerCount).toBe(1)
    expect(c2TriggerCount).toBe(4)
  })

  test('multiple usage in a single component (with conflicted computed fields)', () => {
    let c1TriggerCount = 0
    let c2TriggerCount = 0
    const behA = BehaviorWithComputed({
      data: {
        a: 1,
      },
      computed: {
        c(data) {
          c1TriggerCount += 1
          return data.a * 2
        },
      },
      attached() {
        this.setData({
          a: 2,
        })
      },
    })
    const component = renderComponent(undefined, '<view>{{c}}</view>', (Component) => {
      Component({
        behaviors: [behA, computedBehavior],
        data: {
          b: 10,
        },
        computed: {
          c(data) {
            c2TriggerCount += 1
            return data.b * 2
          },
        },
        attached() {
          this.setData({
            b: 20,
          })
        },
      } as any)
    }) as any
    expect(innerHTML(component)).toBe('<view>40</view>')
    expect(c1TriggerCount).toBe(2)
    expect(c2TriggerCount).toBe(2)
  })

  test('ignore watch func when trigger by computed attached', () => {
    let cTriggerCount = 0
    let dTriggerCount = 0
    const behA = BehaviorWithComputed({
      data: {
        a: 1,
      },
      computed: {
        d() {
          return 10
        },
        c(data) {
          return data.b * 2
        },
      },
      watch: {
        c() {
          cTriggerCount += 1
        },
        d() {
          dTriggerCount += 1
        },
      },
      attached() {
        this.setData({
          a: 2,
        })
      },
    })
    const component = renderComponent(undefined, '<view>{{c}}</view>', (Component) => {
      Component({
        behaviors: [behA, computedBehavior],
        data: {
          b: 10,
        },
        attached() {
          this.setData({
            b: 20,
          })
        },
      } as any)
    }) as any
    expect(innerHTML(component)).toBe('<view>40</view>')
    expect(cTriggerCount).toBe(1)
    expect(dTriggerCount).toBe(0)
  })

  test('computed Array', () => {
    let aTriggerCount = 0
    let bTriggerCount = 0
    let cTriggerCount = 0
    let dTriggerCount = 0
    const component = renderComponent(undefined, '<view></view>', (Component) => {
      Component({
        behaviors: [computedBehavior],
        data: {
          root: [
            {
              values: [1, 2, 3],
            },
          ],
        },
        computed: {
          computedWithRoot(data) {
            aTriggerCount++
            const res = data.root
            return res
          },
          computedWithRootClone(data) {
            bTriggerCount++
            const res = data.root.map((v) => v)
            return res
          },
          computedWithCWR(data) {
            cTriggerCount++
            const res = data.computedWithRoot[0].values
            return res
          },
          computedWithCWRC(data) {
            dTriggerCount++
            const res = data.computedWithRootClone[0].values
            return res
          },
        },
      } as any)
    }) as any
    expect(aTriggerCount).toBe(1)
    expect(bTriggerCount).toBe(1)
    expect(cTriggerCount).toBe(1)
    expect(dTriggerCount).toBe(1)

    component.data.root[0].values = [1, 2, 3, 1]
    component.setData({
      'root[0].values': component.data.root[0].values,
    })
    expect(aTriggerCount).toBe(1)
    expect(bTriggerCount).toBe(1)
    expect(cTriggerCount).toBe(2)
    expect(dTriggerCount).toBe(2)

    component.data.root.push(2)
    component.setData({
      root: component.data.root,
    })
    expect(aTriggerCount).toBe(1)
    expect(bTriggerCount).toBe(2)
    expect(cTriggerCount).toBe(2)
    expect(dTriggerCount).toBe(3)
  })

  test('computed Object', () => {
    let aTriggerCount = 0
    let bTriggerCount = 0
    let cTriggerCount = 0
    let dTriggerCount = 0
    const component = renderComponent(undefined, '<view></view>', (Component) => {
      Component({
        behaviors: [computedBehavior],
        data: {
          root: { values: { arr: [1, 2, 3] } },
        },
        computed: {
          computedWithRoot(data) {
            aTriggerCount++
            const res = data.root
            return res
          },
          computedWithRootClone(data) {
            bTriggerCount++
            const res = Object.assign({}, data.root)
            return res
          },
          computedWithCWR(data) {
            cTriggerCount++
            const res = data.computedWithRoot.values?.arr
            return res
          },
          computedWithCWRC(data) {
            dTriggerCount++
            const res = data.computedWithRootClone.values?.arr
            return res
          },
        },
      } as any)
    }) as any

    expect(aTriggerCount).toBe(1)
    expect(bTriggerCount).toBe(1)
    expect(cTriggerCount).toBe(1)
    expect(dTriggerCount).toBe(1)

    component.data.root.values.arr = [1, 2, 3, 1]
    component.setData({
      'root.values.arr': component.data.root.values.arr,
    })
    expect(aTriggerCount).toBe(1)
    expect(bTriggerCount).toBe(1)
    expect(cTriggerCount).toBe(2)
    expect(dTriggerCount).toBe(2)

    component.data.root.values['new_obj'] = { a: 1 }
    component.setData({
      'root.values': component.data.root.values,
    })
    expect(aTriggerCount).toBe(1)
    expect(bTriggerCount).toBe(1)
    expect(cTriggerCount).toBe(2)
    expect(dTriggerCount).toBe(2)

    component.data.root['new_obj'] = { a: 1 }
    component.setData({
      root: component.data.root,
    })
    expect(aTriggerCount).toBe(1)
    expect(bTriggerCount).toBe(2)
    expect(cTriggerCount).toBe(2)
    expect(dTriggerCount).toBe(3)
  })
})

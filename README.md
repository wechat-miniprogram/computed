# computed

小程序自定义组件扩展 behavior，计算属性 `computed` 和监听器 `watch` 的实现。在 data 或者 properties 改变时，会重新计算 `computed` 字段并触发 `watch` 监听器。

> 此 behavior 依赖开发者工具的 npm 构建。具体详情可查阅[官方 npm 文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

注意： 4.0.0 大版本变更了最基本的接口名，从低版本升级到 4.0.0 以上时请注意 [#60](https://github.com/wechat-miniprogram/computed/issues/60) 的问题。

## 使用方法

### 方式一 代码片段

需要小程序基础库版本 >= 2.11.0 的环境。

可以直接体验一下这个代码片段，它包含了基本用法示例：[https://developers.weixin.qq.com/s/4KYn6TmJ7osP](https://developers.weixin.qq.com/s/4KYn6TmJ7osP)

体验该代码片段前，需要先安装并构建相对应的 npm 包。

```shell
npm install --save miniprogram-computed
```

### 方式二 本地构建

将本仓库 clone 到本地，进入根目录安装 npm 依赖。

```shell
npm install
```

安装完成后执行

```shell
npm run dev // 构建 dev 版本
```

构建完毕后，根目录下的 `demo` 即为小程序代码根目录，可以将此 demo 导入开发者工具中进行体验。

### computed 基本用法

```js
// component.js
const computedBehavior = require('miniprogram-computed').behavior
const behaviorTest = require('./behavior-test') // 引入自定义 behavior

Component({
  behaviors: [behaviorTest, computedBehavior],
  data: {
    a: 1,
    b: 1,
  },
  computed: {
    sum(data) {
      // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
      // 这个函数的返回值会被设置到 this.data.sum 字段中
      return data.a + data.b + data.c // data.c 为自定义 behavior 数据段
    },
  },
  methods: {
    onTap() {
      this.setData({
        a: this.data.b,
        b: this.data.a + this.data.b,
      })
    },
  },
})
```

```js
//behavior-test.js
module.exports = Behavior({
  data: {
    c: 2,
  },
})
```

```xml
<view>A = {{a}}</view>
<view>B = {{b}}</view>
<view>SUM = {{sum}}</view>
<button bindtap="onTap">click</button>
```

### watch 基本用法

```js
const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [computedBehavior],
  data: {
    a: 1,
    b: 1,
    sum: 2,
  },
  watch: {
    'a, b': function (a, b) {
      this.setData({
        sum: a + b,
      })
    },
  },
  methods: {
    onTap() {
      this.setData({
        a: this.data.b,
        b: this.data.a + this.data.b,
      })
    },
  },
})
```

```xml
<view>A = {{a}}</view>
<view>B = {{b}}</view>
<view>SUM = {{sum}}</view>
<button bindtap="onTap">click</button>
```

### glass-easel Chaining API 支持

使用 glass-easel Chaining API 时，可以用更友好的 `computed` `watch` 函数。

```js
import { computed, watch } from 'miniprogram-computed'

Component()
  .data(() => ({
    a: 1,
    b: 2,
  }))
  .init((ctx) => {
    const data = computed(ctx, {
      c: (data) => data.a + data.b,
      d: (data) => data.a * 2,
    }, {
      e: (data) => data.c + data.d,
    })
    watch(ctx, 'a, b', (a: number, b: number) => {
      // ...
    })
  })
  .register()
```

### 非 chaining API 的 TypeScript 支持

由于通过 behavior 的方式引入不能获得类型支持, 因此为了获得类型的支持, 可以使用一个辅助组件构造器：

```ts
import { ComponentWithComputed } from 'miniprogram-computed'

ComponentWithComputed({
  data: {
    a: 1,
    b: 1,
    sum: 2,
  },
  watch: {
    'a, b': function (a, b) {
      this.setData({
        sum: a + b,
      })
    },
  },
  computed: {
    sum(data) {
      // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
      // 这个函数的返回值会被设置到 this.data.sum 字段中
      return data.a + data.b + data.sum // data.c 为自定义 behavior 数据段
    },
  },
})
```

当使用该构造器的时候, 编译器可以给 `computed` 和 `watch` 提供自动提示和类型支持。

**注意: 当使用该构造器的时候, 无需手动加入 `computedBehavior` , 该构造器会自动引入该 behavior 。**

（类似地，也有 `BehaviorWithComputed` 构造器对应于 `Bahavior` 。）

**关于 TS 兼容问题**

若在小程序中用 `TypeScript` 进行开发并使用到了 `Component` 构造器。这时定义 `computed` 或 `watch` 字段会出现类型报错。

针对此问题，推荐使用 `ComponentWithComputed` 构造器代替 `Component` 构造器。

## 常见问题说明

### 我应该使用 computed 还是 watch ？

从原理上说， `watch` 的性能比 `computed` 更好；但 `computed` 的用法更简洁干净。

此外， `computed` 字段状态只能依赖于 `data` 和其他 `computed` 字段，不能访问 `this` 。如果不可避免要访问 `this` ，则必须使用 `watch` 代替。

### watch 和小程序基础库本身的 observers 有什么区别？

- 无论字段是否真的改变， `observers` 都会被触发，而 `watch` 只在字段值改变了的时候触发，并且触发时带有参数。

### 关于 \*\* 通配符

在 `watch` 字段上可以使用 `**` 通配符，它能够监听这个字段下的子字段的变化（类似于小程序基础库本身的 observers ）。

```js
const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [computedBehavior],
  data: {
    obj: {
      a: 1,
      b: 2,
    },
  },
  watch: {
    'obj.**': function (obj) {
      this.setData({
        sum: obj.a + obj.b,
      })
    },
  },
  methods: {
    onTap() {
      this.setData({
        'obj.a': 10,
      })
    },
  },
})
```

除此以外：

- 对于没有使用 `**` 通配符的字段，在 `watch` 检查值是否发生变化时，只会进行粗略的浅比较（使用 `===` ）；
- 对于使用了 `**` 通配符的字段，则会进行深比较，来尝试精确检测对象是否真的发生了变化，这要求对象字段不能包含循环（类似于 `JSON.stringify` ）。

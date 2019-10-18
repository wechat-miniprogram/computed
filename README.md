# computed

小程序自定义组件扩展 behavior，计算属性 `computed` 和监听器 `watch` 的实现。在 data 或者 properties 改变时，会重新计算 `computed` 字段并触发 `watch` 监听器。

> 此 behavior 依赖开发者工具的 npm 构建。具体详情可查阅[官方 npm 文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

## 使用方法

需要小程序基础库版本 >= 2.6.1 的环境。

你可以直接体验一下这个代码片段，它包含了基本用法示例：[https://developers.weixin.qq.com/s/kKu4U9mX78a8](https://developers.weixin.qq.com/s/kKu4U9mX78a8)

### 安装

```
npm install --save miniprogram-computed
```

### computed 基本用法

```js
const computedBehavior = require('miniprogram-computed')

Component({
  behaviors: [computedBehavior],
  data: {
    a: 1,
    b: 1,
  },
  computed: {
    sum(data) {
      // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
      // 这个函数的返回值会被设置到 this.data.sum 字段中
      return data.a + data.b
    },
  },
  methods: {
    onTap() {
      this.setData({
        a: this.data.b,
        b: this.data.a + this.data.b,
      })
    }
  }
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
const computedBehavior = require('miniprogram-computed')

Component({
  behaviors: [computedBehavior],
  data: {
    a: 1,
    b: 1,
    sum: 2,
  },
  watch: {
    'a, b': function(a, b) {
      this.setData({
        sum: a + b
      })
    },
  },
  methods: {
    onTap() {
      this.setData({
        a: this.data.b,
        b: this.data.a + this.data.b,
      })
    }
  }
})
```

```xml
<view>A = {{a}}</view>
<view>B = {{b}}</view>
<view>SUM = {{sum}}</view>
<button bindtap="onTap">click</button>
```

## ^1.0.0 与 ^2.0.0 版本差异

这个 behavior 的 ^1.0.0 版本和 ^2.0.0 版本有较大差异。 ^2.0.0 版本基于小程序基础库 2.6.1 开始支持的 observers 定义段实现，具有较好的性能。以下是版本之间主要区别的比较。

| 项目 | ^1.0.0 | ^2.0.0 |
| ---- | ------ | ------ |
| 支持的基础库最低版本 | 2.2.3 | 2.6.1 |
| 支持 `watch` 定义段 | 否 | 是 |
| 性能 | 相对较差 | 相对较好 |

## 常见问题说明

### 我应该使用 computed 还是 watch ？

从原理上说， `watch` 的性能比 `computed` 更好；但 `computed` 的用法更简洁干净。

此外， `computed` 字段状态只能依赖于 `data` 和其他 `computed` 字段，不能访问 `this` 。如果不可避免要访问 `this` ，则必须使用 `watch` 代替。

### watch 和小程序基础库本身的 observers 有什么区别？

* 无论字段是否真的改变， `observers` 都会被触发，而 `watch` 只在字段值改变了的时候触发，并且触发时带有参数。

### 关于 ** 通配符

在 `watch` 字段上可以使用 `**` 通配符，是它能够监听这个字段下的子字段的变化（类似于小程序基础库本身的 observers）。[示例代码片段](https://developers.weixin.qq.com/s/frOEpcm27Ac7)

```js
const computedBehavior = require('miniprogram-computed')

Component({
  behaviors: [computedBehavior],
  data: {
    obj: {
      a: 1,
      b: 2,
    }
  },
  watch: {
    'obj.**': function(obj) {
      this.setData({
        sum: obj.a + obj.b
      })
    },
  },
  methods: {
    onTap() {
      this.setData({
        'obj.a': 10
      })
    }
  }
})
```

除此以外：

* 对于没有使用 `**` 通配符的字段，在 `watch` 检查值是否发生变化时，只会进行粗略的浅比较（使用 `===` ）；
* 对于使用了 `**` 通配符的字段，则会进行深比较，来尝试精确检测对象是否真的发生了变化，这要求对象字段不能包含循环（类似于 `JSON.stringify` ）。

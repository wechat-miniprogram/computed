# computed

小程序自定义组件扩展 behavior，计算属性实现

> 使用此 behavior 需要依赖小程序基础库 2.2.3 以上版本，同时依赖开发者工具的 npm 构建。具体详情可查阅[官方 npm 文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

## 使用方法

1. 安装 computed：

```
npm install --save miniprogram-computed
```

2. 作为 behavior 引入

```js
const computedBehavior = require('miniprogram-computed')

Component({
  behaviors: [computedBehavior],
  data: {
    a: 0,
  },
  computed: {
    b() {
      // 计算属性同样挂在 data 上，每当进行 setData 的时候会重新计算
      // 比如此字段可以通过 this.data.b 获取到
      return this.data.a + 100
    },
  },
  methods: {
    onTap() {
      this.setData({
        a: ++this.data.a,
      })
    }
  }
})
```

```xml
<view>data: {{a}}</view>
<view>computed: {{b}}</view>
<button bindtap="onTap">click</button>
```

// store.js
import { observable, action } from 'mobx-miniprogram'

export const store = observable({
  // 数据字段
  numA: 4,
  numB: 5,

  // actions
  update: action(function () {
    console.log('action')
    this.numA = this.numA + 1
    this.numB = this.numA + 1
  }),
})

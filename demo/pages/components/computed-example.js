import { behavior as computedBehavior } from '../../computed/index'
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from './store'
const behaviorTest = require('./behavior')

Component({
  behaviors: [behaviorTest, storeBindingsBehavior, computedBehavior],
  data: {
    a: 1,
    b: 1,
  },
  storeBindings: {
    store,
    fields: {
      numA: (store) => store.numA,
      numB: (store) => store.numB,
    },
    actions: {
      buttonTap: 'update',
    },
  },
  computed: {
    sum(data) {
      return data.numA + data.numB + data.a + data.b + data.behaviorTestData
    },
  },
  methods: {
    onTap() {
      this.buttonTap()
      this.setData({
        a: this.data.a + 1,
        b: this.data.b + 1,
        behaviorTestData: this.data.behaviorTestData + 1,
      })
    },
  },
})

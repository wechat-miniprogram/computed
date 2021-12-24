import { behavior as computedBehavior } from '../../computed/index'
const behaviorTest = require('./behavior')
Component({
  behaviors: [behaviorTest, computedBehavior],
  data: {
    a: 1,
    sum: 1001,
  },
  computed: {
    b(data) {
      return data.a
    },
  },
  watch: {
    'a, behaviorTestData, b': function (a, behaviorTestData) {
      console.log('123')
      this.setData({
        sum: a + behaviorTestData,
      })
    },
  },
  methods: {
    onTap() {
      this.setData({
        a: this.data.a + 1,
        behaviorTestData: this.data.behaviorTestData + 1,
      })
    },
  },
})

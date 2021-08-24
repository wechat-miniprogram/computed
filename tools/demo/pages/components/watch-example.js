const computedBehavior = require('../../components/index').behavior
const behaviorTest = require('./behavior')
Component({
  behaviors: [behaviorTest, computedBehavior],
  data: {
    a: 1,
    sum: 1001
  },
  watch: {
    'a, behaviorTestData': function (a, behaviorTestData) {
      this.setData({
        sum: a + behaviorTestData
      })
    },
  },
  methods: {
    onTap() {
      this.setData({
        a: this.data.a + 1,
        behaviorTestData: this.data.behaviorTestData + 1,
      })
    }
  }
})

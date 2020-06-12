const computedBehavior = require('../../components/index')

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

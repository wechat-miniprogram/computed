const computedBehavior = require('../../src/index')

module.exports = Behavior({
  behaviors: [computedBehavior],
  data: {
    b: 0,
    c: 0,
  },
  watch: {
    'b': function (b) {
      this.setData({ c: b })
    }
  },
})

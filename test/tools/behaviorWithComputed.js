const computedBehavior = require('../../src/index')

module.exports = Behavior({
  behaviors: [computedBehavior],
  data: {
    b: 3
  },
  computed: {
    d(data) {
      return data.a + data.b
    }
  }
})

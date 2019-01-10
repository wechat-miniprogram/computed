const computedBehavior = require('../../../components/index')

Component({
  behaviors: [computedBehavior],
  properties: {
    propA: {
      type: Number,
      value: 0,
    }
  },
  data: {
    a: 0,
  },
  computed: {
    b() {
      return this.data.a + 100
    },
    c() {
      return this.data.b + 100
    },
    propB() {
      return this.data.propA + this.data.a
    },
  },
  methods: {
    onTap() {
      this.setData({
        a: ++this.data.a,
      })
      this.triggerEvent('update')
    },
    onTap2() {
      this.setData({
        propA: 9999,
      })
    },
  }
})

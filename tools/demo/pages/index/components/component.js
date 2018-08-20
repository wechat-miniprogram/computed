const computedBehavior = require('../../../components/index')

Component({
  behaviors: [computedBehavior],
  data: {
    a: 0,
  },
  computed: {
    b() {
      return this.data.a + 100
    },
    c() {
      return this.data.b + 100
    }
  },
  methods: {
    onTap() {
      this.setData({
        a: ++this.data.a,
      })
    }
  }
})

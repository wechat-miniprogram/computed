module.exports = Behavior({
  data: {
    b: 2,
    c: {
      d: 3,
      e: [1, 2, 3]
    },
  },
  attached() {
    this.setData({
      f: 10
    })
  }
})

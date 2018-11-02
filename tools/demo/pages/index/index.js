Page({
  data: {
    propA: 0,
  },
  onUpdate() {
    this.setData({
      propA: ++this.data.propA,
    })
  }
})

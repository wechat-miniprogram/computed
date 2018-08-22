const _ = require('./utils')

let componentId
let component

beforeAll(async () => {
  componentId = await _.load('index')
})

test('computed', async () => {
  // TODO
})

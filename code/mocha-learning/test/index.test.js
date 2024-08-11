import { add } from '../index.ts'

describe('add', function () {
  it('add(1, 3) should return 4', function () {
    expect(add(1, 3)).equal(4)
  })
  it('add(1, 6) should return 7', function () {
    expect(add(1, 6)).equal(7)
  })
})

import assert from 'assert'
import add from '../add.js'
// import { expect } from 'chai'

describe('add', function () {
  it('add(1, 3) should return 4', function () {
    expect(add(1, 3)).equal(4)
  })
  it('add(1, 6) should return 7', function () {
    expect(add(1, 6)).equal(7)
  })
})

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})

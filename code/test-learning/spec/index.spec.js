import { multiple } from '../index.js'

describe('Multiple', () => {
  it('should be a function', () => {
    expect(multiple).toBeInstanceOf(Function)
  })

  it('should 7 * 2 = 14', () => {
    expect(multiple(7, 2)).toEqual(14)
  })

  it('should 7 * -2 = -14', () => {
    expect(multiple(7, -2)).toEqual(-14)
  })
})

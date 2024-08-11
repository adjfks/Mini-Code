import { assert, expect } from 'chai'
import add from './add.ts'

const foo = 'bar'
const beverages = { tea: ['chai', 'matcha', 'oolong'] }

assert.typeOf(foo, 'string')
// assert.typeOf(foo, 'number', 'foo is a number') // with optional message
assert.equal(foo, 'bar', 'foo equal `bar`')
assert.lengthOf(foo, 3, 'foo`s value has a length of 3')
assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea')
assert.equal(add(1, 2), 3, 'add(1,2) should return 3')

expect(foo).to.be.a('string')
expect(foo).to.equal('bar')

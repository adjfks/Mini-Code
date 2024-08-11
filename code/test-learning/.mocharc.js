require('@babel/register')
require('ts-node/register')
const chaiPromise = import('chai')
chaiPromise.then((chai) => {
  global.expect = chai.expect
})

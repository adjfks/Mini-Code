require('@babel/register') // 支持import export语法，在不设置type: modules的情况下
require('ts-node/register') // 支持ts

import('chai').then((chai) => {
  global.expect = chai.expect // 使得expect在测试文件中可直接使用
})

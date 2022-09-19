const getCommonStyle = require('./getCommonStyle')
const h = require('./h')

const styleTree1 = h('class01', { color: 'red', backgroundColor: 'green' }, {
  class02: h('class02', { display: 'none' }),
  class03: h('class03', { textAlign: 'center', display: 'flex', justifyContent: 'center' }, {
    class04: h('class04', { flex: 1 }, {}),
    class05: h('class05', { flex: 1 }, {
      class06: h('class06', { lineHeight: '20px' }, {})
    })
  }),
  class07: h('class07', { color: 'purple' }, {})
})

const styleTree2 = h('class01', { color: 'red' }, {
  class02: h('class02', { color: 'pink', lineHeight: '2' }, {
    class08: h('class08', { height: '40px' }, {}),
    class09: h('class09', { display: 'none' }, {})
  }),
  class03: h('class03', { textAlign: 'center', display: 'flex', justifyContent: 'spaceBetween' }, {
    class04: h('class04', { flex: 1 }, {}),
    class05: h('class05', { flex: 1 }, {
      class06: h('class06', { lineHeight: '21px' }, {})
    })
  }),
  class07: h('class07', { color: 'purple' }, {})
})

const resTree = h('class01', { color: 'red' }, {
  class03: h('class03', { textAlign: 'center', display: 'flex' }, {
    class04: h('class04', { flex: 1 }, {}),
    class05: h('class05', { flex: 1 }, {
      class06: h('class06', {}, {})
    })
  }),
  class07: h('class07', { color: 'purple' }, {})
})

test('样式树提取公共部分算法', () => {
  const res = getCommonStyle(styleTree1, styleTree2)
  console.log(res);
  console.log(resTree);
  expect(res).toEqual(resTree)
})

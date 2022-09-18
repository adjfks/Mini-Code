const getCommonStyle = require('./getCommonStyle')
const { styleTree1, styleTree2 } = require('./data')

const resTree = {
  name: 'class01',
  styles: {
    color: 'red',
    backgroundColor: '#add',
  },
  children: [
    {
      name: 'class02',
      styles: {
        height: '15px',
      },
      children: [],
    },
    {
      name: 'class03',
      styles: {
        color: 'red',
        height: '15px',
      },
      children: [
        {
          name: 'class04',
          styles: {
            textAlign: 'center',
            backgroundColor: 'pink',
          },
          children: [],
        },
      ],
    },
    {
      name: 'class05',
      styles: {
        height: '15px',
      },
      children: [],
    },
  ],
}

test('样式树提取公共部分算法', () => {
  expect(getCommonStyle(styleTree1, styleTree2)).toEqual(resTree)
})

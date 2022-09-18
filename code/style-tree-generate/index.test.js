const { getCommonStyle } = require('./index.js')

const tree1 = {
  name: 'class01',
  styles: {
    color: 'red',
    height: '23px',
    backgroundColor: '#add',
  },
  children: [
    {
      name: 'class02',
      styles: {
        color: 'red',
        height: '15px',
        backgroundColor: 'pink',
      },
      children: [],
    },
    {
      name: 'class03',
      styles: {
        color: 'red',
        height: '15px',
        backgroundColor: 'pink',
      },
      children: [
        {
          name: 'class04',
          styles: {
            color: '#fff',
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
        color: 'red',
        height: '15px',
        backgroundColor: 'pink',
      },
      children: [],
    },
  ],
}
const tree2 = {
  name: 'class01',
  styles: {
    color: 'red',
    height: '100px',
    backgroundColor: '#add',
  },
  children: [
    {
      name: 'class02',
      styles: {
        color: 'white',
        height: '15px',
        backgroundColor: 'green',
        textAlign: 'center',
      },
      children: [],
    },
    {
      name: 'class03',
      styles: {
        color: 'red',
        height: '15px',
        width: '200px',
      },
      children: [
        {
          name: 'class04',
          styles: {
            color: 'blue',
            textAlign: 'center',
            backgroundColor: 'pink',
            display: 'none',
          },
          children: [],
        },
      ],
    },
    {
      name: 'class05',
      styles: {
        height: '15px',
        backgroundColor: 'red',
      },
      children: [],
    },
  ],
}
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
  expect(getCommonStyle(tree1, tree2)).toEqual(resTree)
})

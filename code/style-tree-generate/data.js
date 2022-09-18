const styleTree1 = {
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
const styleTree2 = {
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

module.exports = {
  styleTree1,
  styleTree2,
}

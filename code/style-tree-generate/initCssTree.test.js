const initCssTree = require('./initCssTree')

const componentSetLibNode = {
  name: 'xxx',
  exportType: 'COMPSET',
  completedTree: {
    name: 'container',
    children: [
      { name: 'xxx1', children: [] },
      {
        name: 'xxx2',
        children: [
          {
            name: 'xxx3',
            children: [{ name: 'xxx7', children: [] }],
          },
        ],
      },
      {
        name: 'xxx4',
        children: [
          { name: 'xxx5', children: [] },
          { name: 'xxx6', children: [] },
          { name: 'xxx8', children: [] },
        ],
      },
    ],
  },
  propOptions: {
    type: ['primary', 'secondary'],
    shape: ['standard', 'circle'],
  },
  stateChildren: [
    {
      name: 'Type=primary, Shape=standard',
      style: { backgroundColor: 'blue' },
      children: [
        { name: 'xxx1' },
        {
          name: 'xxx2',
          style: { color: 'red' },
          children: [
            {
              name: 'xxx3',
              style: { lineHeight: '20px', width: '40px' },
              children: [],
            },
          ],
        },
        {
          name: 'xxx4',
          style: { width: '36px', height: '50px' },
          children: [
            { name: 'xxx5', style: { lineHeight: '20px' }, children: [] },
            { name: 'xxx6', style: { color: 'red' }, children: [] },
          ],
        },
      ],
    },
    {
      name: 'Type=primary, Shape=circle',
      style: { backgroundColor: 'yellow', textAlign: 'center' },
      children: [
        {
          name: 'xxx2',
          style: { color: 'red', width: '20px' },
          children: [
            {
              name: 'xxx3',
              style: { lineHeight: '20px', width: '100px' },
              children: [
                { name: 'xxx7', style: { width: '100px' }, children: [] },
              ],
            },
          ],
        },
        {
          name: 'xxx4',
          style: { width: '20px', height: '50px' },
          children: [
            { name: 'xxx5', style: { lineHeight: '20px' }, children: [] },
            { name: 'xxx6', style: { color: 'red' }, children: [] },
            { name: 'xxx8', style: { color: 'pink' }, children: [] },
          ],
        },
      ],
    },
    {
      name: 'Type=secondary, Shape=standard',
      style: {
        backgroundColor: 'blue',
        color: 'pink',
        width: '100px',
        height: '100px',
      },
      children: [
        {
          name: 'xxx2',
          style: { color: 'red', width: '20px', height: '100px' },
          children: [],
        },
        {
          name: 'xxx4',
          style: { width: '20px', height: '50px' },
          children: [
            {
              name: 'xxx5',
              style: {
                lineHeight: '50px',
                display: 'flex',
                alignItems: 'center',
              },
              children: [],
            },
            { name: 'xxx8', style: { color: 'pink' }, children: [] },
          ],
        },
      ],
    },
    {
      name: 'Type=secondary, Shape=circle',
      style: {
        textAlign: 'center',
        color: 'pink',
        width: '100px',
        height: '200px',
      },
      children: [
        {
          name: 'xxx2',
          style: { color: 'purple', width: '20px', height: '100%' },
          children: [
            {
              name: 'xxx3',
              style: { lineHeight: '20px', width: '100px' },
              children: [
                {
                  name: 'xxx7',
                  style: {
                    width: '150px',
                    lineHeight: '20px',
                    textAlign: 'center',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: 'xxx4',
          style: { width: '40px', height: '50px' },
          children: [
            { name: 'xxx8', style: { color: 'yellow' }, children: [] },
          ],
        },
      ],
    },
  ],
}

const initTree = {
  selector: '.xxx',
  styleBody: {
  },
  children: [
    {
      selector: '&[type="primary"]',
      styleBody: {
      },
      children: [
        {
          selector: '&[shape="standard"]',
          styleBody: {
            backgroundColor: 'blue',
          },
          children: {
            xxx1: {
              selector: '.xxx1',
              styleBody: undefined,
              children: {
              },
            },
            xxx2: {
              selector: '.xxx2',
              styleBody: {
                color: 'red',
              },
              children: {
                xxx3: {
                  selector: '.xxx3',
                  styleBody: {
                    lineHeight: '20px',
                    width: '40px',
                  },
                  children: {
                    xxx7: {
                      selector: '.xxx7',
                      styleBody: {
                        display: 'none',
                      },
                      children: {
                      },
                    },
                  },
                },
              },
            },
            xxx4: {
              selector: '.xxx4',
              styleBody: {
                width: '36px',
                height: '50px',
              },
              children: {
                xxx5: {
                  selector: '.xxx5',
                  styleBody: {
                    lineHeight: '20px',
                  },
                  children: {
                  },
                },
                xxx6: {
                  selector: '.xxx6',
                  styleBody: {
                    color: 'red',
                  },
                  children: {
                  },
                },
                xxx8: {
                  selector: '.xxx8',
                  styleBody: {
                    display: 'none',
                  },
                  children: {
                  },
                },
              },
            },
          },
        },
        {
          selector: '&[shape="circle"]',
          styleBody: {
            backgroundColor: 'yellow',
            textAlign: 'center',
          },
          children: {
            xxx2: {
              selector: '.xxx2',
              styleBody: {
                color: 'red',
                width: '20px',
              },
              children: {
                xxx3: {
                  selector: '.xxx3',
                  styleBody: {
                    lineHeight: '20px',
                    width: '100px',
                  },
                  children: {
                    xxx7: {
                      selector: '.xxx7',
                      styleBody: {
                        width: '100px',
                      },
                      children: {
                      },
                    },
                  },
                },
              },
            },
            xxx4: {
              selector: '.xxx4',
              styleBody: {
                width: '20px',
                height: '50px',
              },
              children: {
                xxx5: {
                  selector: '.xxx5',
                  styleBody: {
                    lineHeight: '20px',
                  },
                  children: {
                  },
                },
                xxx6: {
                  selector: '.xxx6',
                  styleBody: {
                    color: 'red',
                  },
                  children: {
                  },
                },
                xxx8: {
                  selector: '.xxx8',
                  styleBody: {
                    color: 'pink',
                  },
                  children: {
                  },
                },
              },
            },
            xxx1: {
              selector: '.xxx1',
              styleBody: {
                display: 'none',
              },
              children: {
              },
            },
          },
        },
      ],
    },
    {
      selector: '&[type="secondary"]',
      styleBody: {
      },
      children: [
        {
          selector: '&[shape="standard"]',
          styleBody: {
            backgroundColor: 'blue',
            color: 'pink',
            width: '100px',
            height: '100px',
          },
          children: {
            xxx2: {
              selector: '.xxx2',
              styleBody: {
                color: 'red',
                width: '20px',
                height: '100px',
              },
              children: {
                xxx3: {
                  selector: '.xxx3',
                  styleBody: {
                    display: 'none',
                  },
                  children: {
                  },
                },
              },
            },
            xxx4: {
              selector: '.xxx4',
              styleBody: {
                width: '20px',
                height: '50px',
              },
              children: {
                xxx5: {
                  selector: '.xxx5',
                  styleBody: {
                    lineHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                  children: {
                  },
                },
                xxx8: {
                  selector: '.xxx8',
                  styleBody: {
                    color: 'pink',
                  },
                  children: {
                  },
                },
                xxx6: {
                  selector: '.xxx6',
                  styleBody: {
                    display: 'none',
                  },
                  children: {
                  },
                },
              },
            },
            xxx1: {
              selector: '.xxx1',
              styleBody: {
                display: 'none',
              },
              children: {
              },
            },
          },
        },
        {
          selector: '&[shape="circle"]',
          styleBody: {
            textAlign: 'center',
            color: 'pink',
            width: '100px',
            height: '200px',
          },
          children: {
            xxx2: {
              selector: '.xxx2',
              styleBody: {
                color: 'purple',
                width: '20px',
                height: '100%',
              },
              children: {
                xxx3: {
                  selector: '.xxx3',
                  styleBody: {
                    lineHeight: '20px',
                    width: '100px',
                  },
                  children: {
                    xxx7: {
                      selector: '.xxx7',
                      styleBody: {
                        width: '150px',
                        lineHeight: '20px',
                        textAlign: 'center',
                      },
                      children: {
                      },
                    },
                  },
                },
              },
            },
            xxx4: {
              selector: '.xxx4',
              styleBody: {
                width: '40px',
                height: '50px',
              },
              children: {
                xxx8: {
                  selector: '.xxx8',
                  styleBody: {
                    color: 'yellow',
                  },
                  children: {
                  },
                },
                xxx5: {
                  selector: '.xxx5',
                  styleBody: {
                    display: 'none',
                  },
                  children: {
                  },
                },
                xxx6: {
                  selector: '.xxx6',
                  styleBody: {
                    display: 'none',
                  },
                  children: {
                  },
                },
              },
            },
            xxx1: {
              selector: '.xxx1',
              styleBody: {
                display: 'none',
              },
              children: {
              },
            },
          },
        },
      ],
    },
  ],
}

const cssTree = initCssTree(componentSetLibNode)
test('组件样式树初始化', () => {
  console.log(JSON.stringify(cssTree));
  expect(cssTree).toEqual(initTree)
})

const getCommonStyle = require('./getCommonStyle')
const getCssTree = require('./index')
const h = require('./h')

const componentSetLibNode = {
  name: 'xxx',
  exportType: 'COMPSET',
  completedTree: {
    name: 'container', children: [
      { name: 'xxx1', children: [] },
      {
        name: 'xxx2', children: [
          {
            name: 'xxx3', children: [
              { name: 'xxx7', children: [] }
            ]
          }
        ]
      },
      {
        name: 'xxx4', children: [
          { name: 'xxx5', children: [] },
          { name: 'xxx6', children: [] },
          { name: 'xxx8', children: [] }
        ]
      }
    ]
  },
  propOptions: {
    type: ['primary', 'secondary'],
    shape: ['standard', 'circle']
  },
  stateChildren: [
    {
      name: 'Type=primary, Shape=standard', style: { backgroundColor: 'blue' }, children: [
        { name: 'xxx1' },
        {
          name: 'xxx2', style: { color: 'red' }, children: [
            { name: 'xxx3', style: { lineHeight: '20px', width: '40px' }, children: [] }
          ]
        },
        {
          name: 'xxx4', style: { width: '36px', height: '50px' }, children: [
            { name: 'xxx5', style: { lineHeight: '20px' }, children: [] },
            { name: 'xxx6', style: { color: 'red' }, children: [] }
          ]
        }
      ]
    },
    {
      name: 'Type=primary, Shape=circle', style: { backgroundColor: 'yellow', textAlign: 'center' }, children: [
        {
          name: 'xxx2', style: { color: 'red', width: '20px' }, children: [
            {
              name: 'xxx3', style: { lineHeight: '20px', width: '100px' }, children: [
                { name: 'xxx7', style: { width: '100px' }, children: [] }
              ]
            }
          ]
        },
        {
          name: 'xxx4', style: { width: '20px', height: '50px' }, children: [
            { name: 'xxx5', style: { lineHeight: '20px' }, children: [] },
            { name: 'xxx6', style: { color: 'red' }, children: [] },
            { name: 'xxx8', style: { color: 'pink' }, children: [] }
          ]
        }
      ]
    },
    {
      name: 'Type=secondary, Shape=standard', style: { backgroundColor: 'blue', color: 'pink', width: '100px', height: '100px' }, children: [
        {
          name: 'xxx2', style: { color: 'red', width: '20px', height: '100px' }, children: []
        },
        {
          name: 'xxx4', style: { width: '20px', height: '50px' }, children: [
            { name: 'xxx5', style: { lineHeight: '50px', display: 'flex', alignItems: 'center' }, children: [] },
            { name: 'xxx8', style: { color: 'pink' }, children: [] }
          ]
        }
      ]
    },
    {
      name: 'Type=secondary, Shape=circle', style: { textAlign: 'center', color: 'pink', width: '100px', height: '200px' }, children: [
        {
          name: 'xxx2', style: { color: 'purple', width: '20px', height: '100%' }, children: [
            {
              name: 'xxx3', style: { lineHeight: '20px', width: '100px' }, children: [
                { name: 'xxx7', style: { width: '150px', lineHeight: '20px', textAlign: 'center' }, children: [] }
              ]
            }
          ]
        },
        {
          name: 'xxx4', style: { width: '40px', height: '50px' }, children: [
            { name: 'xxx8', style: { color: 'yellow' }, children: [] }
          ]
        }
      ]
    },
  ]
}

const cssTree = {
  selector: 'xxx',
  styleBody: {},
  children: [
    {
      selector: '[Type="primary"]',
      styleBody: {},
      children: [
        {
          selector: '[Shape="standard"]',
          styleBody: { backgroundColor: 'blue' },
          children: [

          ]
        }
      ]
    }
  ]
}

const res = getCssTree(componentSetLibNode)
console.log(res);

// test('组件样式生成', () => { })

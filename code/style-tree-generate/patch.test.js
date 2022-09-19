const patch = require('./patch')
const fullTree = {
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
}

const target = {
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
}

const res = {
  name: 'Type=primary, Shape=standard', style: { backgroundColor: 'blue' }, children: {
    xxx1: { name: "xxx1" },
    xxx2: {
      name: "xxx2", style: { color: "red" }, children: {
        xxx3: {
          name: "xxx3", style: { lineHeight: "20px", width: "40px" }, children: {
            xxx7: { name: "xxx7", style: { display: "none" } }
          }
        }
      }
    },
    xxx4: {
      name: "xxx4", style: { width: "36px", height: "50px" }, children: {
        xxx5: { name: "xxx5", style: { lineHeight: "20px" }, children: {} },
        xxx6: { name: "xxx6", style: { color: "red" }, children: {} },
        xxx8: { name: "xxx8", style: { display: "none" } }
      }
    }
  }
}

test('测试patch函数', () => {
  expect(patch(fullTree, target)).toEqual(res)
})
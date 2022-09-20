import findMinArrowShots from './index.js'

const points = [
  [10, 16],
  [2, 8],
  [1, 6],
  [7, 12],
]

test('452.用最少数量的箭引爆气球', () => {
  const res = findMinArrowShots(points)
  expect(res).toEqual(2)
})

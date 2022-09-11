import { threeSum1, threeSum2 } from './index.js'

const nums1 = [-1, 0, 1, 2, -1, -4]
const nums2 = [-5, 1, -3, -1, -4, -2, 4, -1, -1]

test('三数之和', () => {
  expect(threeSum1(nums1)).toEqual([
    [-1, -1, 2],
    [-1, 0, 1],
  ])
  expect(threeSum1(nums2)).toEqual([
    [-5, 1, 4],
    [-3, -1, 4],
  ])
})

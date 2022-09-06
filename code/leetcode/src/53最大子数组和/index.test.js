import maxSubArray from './index.js'

test('最大子数组和', () => {
  const nums1 = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
  expect(maxSubArray(nums1)).toEqual(6)
})

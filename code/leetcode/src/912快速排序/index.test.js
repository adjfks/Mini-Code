import { sortArray1, sortArray2 } from './index.js'

test('快速排序', () => {
  const nums1 = [5, 1, 1, 2, 0, 0]
  expect(sortArray1(nums1)).toEqual([0, 0, 1, 1, 2, 5])
  expect(sortArray2(nums1)).toEqual([0, 0, 1, 1, 2, 5])
})

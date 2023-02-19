/**
 *快速排序简洁版本（升序）
 *
 * @param {Number} l 左边界下标
 * @param {Number} r 右边界下标
 * @param {Array} arr 待排序数组
 */
function quicksort(l, r, arr) {
  if (l >= r) return
  //   const idx = l + Math.floor(Math.random() * (r - l))
  //   swap(l, idx, arr)
  const pivot = arr[l]
  let i = l + 1,
    x = l,  // 左边界为l，不是l+1，因为需要把这个数排到正确位置
    y = r
  while (i <= y) {
    if (arr[i] <= pivot) {
      swap(x++, i++, arr)
    } else {
      swap(i, y--, arr)
    }
  }
  quicksort(l, x - 1, arr)  // 注意：x位置已经排好，不需要再排
  quicksort(x + 1, r, arr)
}

function swap(i, j, arr) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

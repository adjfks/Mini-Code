# Sort
常见排序算法总结
[leetcode 912.排序数组](https://leetcode.cn/problems/sort-an-array/)
1. 快排

# Theory
## 快排
尝试给出一种比较简洁的实现方式，对于partition部分使用三个指针i,j,k,
- i: 小于等于区右边界下标（小于等于区包含i）
- j: 大于区左边界下标（大于区不包含j）
- k: 遍历数组的指针
i,j初始化时为入参，即要排序的数组左右边界下标。
基准值可以直接选定为arr[i]，或者random一下后与arr[i]交换位置。
k从第二项开始依次遍历数组，遇到小于等于基准值的数就和i下标处交换位置，然后i++, k++，
遇到大于基准值的数，k位置和j位置交换，然后j--，由于此时换过来的k位置的数还没有判断过，故k不变。
上述过程的结束条件为`j > i`或`k <= j`
之后左边partition,右边partition.
```js
function quicksort(l, r, arr) {
  if (l >= r) return
  //   const idx = l + Math.floor(Math.random() * (r - l))
  //   swap(l, idx, arr)
  const pivot = arr[l]
  let i = l + 1,
    x = l,
    y = r
  while (i <= y) {
    if (arr[i] <= pivot) {
      swap(x++, i++, arr)
    } else {
      swap(i, y--, arr)
    }
  }
  quicksort(l, x - 1, arr)
  quicksort(x + 1, r, arr)
}
```

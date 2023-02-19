# Sort
常见排序算法总结
[leetcode 912.排序数组](https://leetcode.cn/problems/sort-an-array/)
1. 快排
2. 归并排序

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

时间复杂度：最好或平均：O(nlgn) 最坏情况：O(n^2)

空间复杂度：O(lgn) 栈空间

稳定性：不稳定

## 归并排序

利用分治的思想：
1. 将大问题分为两个子问题：在这里是将排序一个大数组变成排序2个小数组。
2. 分别解决2个子问题：分别排序2个子数组
3. 合并结果：将两个已排好序的数组合并

整个递归过程其实就是一棵高度为lgN的树。

```js
function mergeSort(arr, l, r) {
  if (l === r) return [arr[l]]
  const mid = l + ((r - l) >> 1)
  const left = mergeSort(arr, l, mid)
  const right = mergeSort(arr, mid + 1, r)
  return merge(left, right)
}
function merge(arr1, arr2) {
  const len1 = arr1.length
  const len2 = arr2.length
  const res = []
  let i = 0
  let j = 0
  while (i < len1 && j < len2) {
    if (arr1[i] <= arr2[j]) res.push(arr1[i++])
    else res.push(arr2[j++])
  }
  while (i < len1) res.push(arr1[i++])
  while (j < len2) res.push(arr2[j++])
  return res
}
```

时间复杂度：每一层都需要遍历原记录且树层数为lgn O(nlogn)

空间复杂度：需要与原记录同样的存储空间n且需要lgn的递归栈空间 O(n + lgn)

稳定性：稳定


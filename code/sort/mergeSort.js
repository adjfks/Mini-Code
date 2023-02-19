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

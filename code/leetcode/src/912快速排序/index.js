const sortArray1 = function (nums) {
  const swap = (nums, i, j) => {
    const temp = nums[i]
    nums[i] = nums[j]
    nums[j] = temp
  }
  const partition = (nums, startIndex, endIndex) => {
    // 得到基准值的索引,这里不加分号出大问题？
    let pivotIndex =
      Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex
    // 将基准值放到数组第一个位置
    swap(nums, startIndex, pivotIndex)
    // [nums[startIndex] , nums[pivotIndex]] = [nums[pivotIndex] , nums[startIndex]]
    // 小于区左边界
    let j = startIndex
    // 遍历数组
    for (let i = j + 1; i <= endIndex; i++) {
      if (nums[i] < nums[startIndex]) {
        // 当前数小于基准值，小于区右扩,该数放到小于区最右侧位置
        j++
        // [nums[j] , nums[i]] = [nums[i] , nums[j]]
        swap(nums, i, j)
      }
    }
    // 将基准值放到中间
    // [nums[startIndex] , nums[j]] = [nums[j] , nums[startIndex]]
    swap(nums, startIndex, j)
    // 返回中间索引
    return j
  }
  const quickSort = (nums, startIndex, endIndex) => {
    if (startIndex > endIndex) return
    const midIndex = partition(nums, startIndex, endIndex)
    quickSort(nums, startIndex, midIndex - 1)
    quickSort(nums, midIndex + 1, endIndex)
  }

  quickSort(nums, 0, nums.length - 1)
  return nums
}

// 第二版实现
var sortArray2 = function (nums) {
  quickSort(nums, 0, nums.length - 1)
  return nums

  function quickSort(nums, start, end) {
    if (start >= end) {
      return
    }
    const mid = partition(nums, start, end)
    quickSort(nums, start, mid - 1)
    quickSort(nums, mid + 1, end)
  }
  function partition(nums, start, end) {
    const pivot = nums[start]
    let left = start + 1
    let right = end
    while (left < right) {
      while (left < right && nums[left] <= pivot) {
        left++
      }
      while (left < right && nums[right] >= pivot) {
        right--
      }
      if (left < right) {
        ;[nums[left], nums[right]] = [nums[right], nums[left]]
        left++
        right--
      }
    }
    if (left === right && nums[right] > pivot) {
      right--
    }
    if (right !== start) {
      ;[nums[start], nums[right]] = [nums[right], nums[start]]
    }
    return right
  }
}

export { sortArray1, sortArray2 }

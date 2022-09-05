// 暴力解法 三重循环
export function threeSum1(nums) {
  // 排序
  nums.sort((a, b) => a - b)
  const len = nums.length
  const ans = []
  for (let i = 0; i < len; i++) {
    if (i > 0 && nums[i - 1] === nums[i]) continue
    for (let j = i + 1; j < len; j++) {
      if (j > i + 1 && nums[j - 1] === nums[j]) continue
      for (let k = j + 1; k < len; k++) {
        if (k > j + 1 && nums[k - 1] === nums[k]) continue
        if (nums[i] + nums[j] + nums[k] === 0)
          ans.push([nums[i], nums[j], nums[k]])
      }
    }
  }
  return ans
}

// 使用双指针 二重循环
export function threeSum2(nums) {
  const ans = []
  nums.sort((a, b) => a - b)
  for (let i = 0, len = nums.length; i < len; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue
    let k = len - 1
    for (let j = i + 1; j < len; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue
      while (k > j + 1 && nums[i] + nums[j] + nums[k] > 0) {
        k--
      }
      if (k <= j) break
      if (nums[i] + nums[j] + nums[k] === 0)
        ans.push([nums[i], nums[j], nums[k]])
    }
  }
  return ans
}

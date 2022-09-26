function fn(nums, n) {
  const temp = Array(n + 1).fill(0)
  for (let i = 0, len = nums.length; i < len; i++) {
    const num = nums[i]
    temp[num]++
  }
  let ans = 0
  for (let i = 1; i < n + 1; i++) {
    if (temp[i] === 0) {
      break
    } else {
      ans = i
    }
  }
  return ans
}

console.log(fn([1, 2, 3, 2, 1], 5))
console.log(fn([1, 5, 2, 5, 3, 1], 6))

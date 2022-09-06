var maxSubArray = function (nums) {
  const len = nums.length
  const dp = Array(len).fill(nums[0])
  let res = dp[0]
  for (let i = 1; i < len; i++) {
    dp[i] = Math.max(nums[i], dp[i - 1] + nums[i])
    res = Math.max(res, dp[i])
  }
  return res
}

export default maxSubArray

// const n = parseInt(read_line())
function fn(s) {
  const len = s.length
  const arr = Array(26).fill(0)
  const base = 'a'.charCodeAt(0)
  let ans = 0
  for (let i = 0; i < len; i++) {
    const idx = s[i].charCodeAt(0) - base
    arr[idx]++
  }
  for (let i = 0; i < 26; i++) {
    if (arr[i] % 2 !== 0) {
      ans += arr[i] - 1
    } else {
      ans += arr[i]
    }
  }
  return ans === len ? ans : ans + 1
}

console.log(fn('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'))

// while (n--) {
//   const s = gets(10000).trim()
//   const len = s.length
//   const dp = Array(len)
//     .fill(0)
//     .map((x) => Array(len).fill(0))
//   let ans = 0
//   for (let i = len - 1; i >= 0; i--) {
//     for (let j = i; j < len - 1; j++) {
//       if (s[i] === s[j]) {
//         if (i === j) dp[i][j] = 1
//         else if (j - i <= 1) dp[i][j] = 2
//         else dp[i][j] = dp[i + 1][j - 1] + 2
//       } else {
//         dp[i][j] = Math.max(dp[i][j - 1], dp[i + 1][j])
//       }
//       ans = Math.max(ans, dp[i][j])
//     }
//   }
//   console.log(ans)

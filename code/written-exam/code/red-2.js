function fn(s1, s2) {
  const len1 = s1.length,
    len2 = s2.length
  if ((len1 === 0 && len2 === 0) || (len1 !== 0 && len2 === 0)) return 'yes'
  if (len1 === 0 && len2 > 0) return 'no'
  const dp = Array(len1)
    .fill(false)
    .map((x) => Array(len2).fill(false))
  dp[0][0] = s1[0] === s2[0]
  // for (let k = 1; k < len1; k++) {
  //   dp[k][0] = dp[0][0]
  // }
  for (let i = 1; i < len1; i++) {
    for (let j = 0; j < len2; j++) {
      if (s1[i] === s2[j]) {
        dp[i][j] = dp[i - 1][j - 1] || dp[i - 1][j - 1] === undefined
      } else {
        dp[i][j] = dp[i - 1][j]
      }
    }
  }
  return dp[len1 - 1][len2 - 1] ? 'yes' : 'no'
}
console.log(fn('yesyes', 'yes'))
console.log(fn('yyyeeesss', 'yes'))
console.log(fn('yeyeyeseses', 'yes'))
console.log(fn('sey', 'yes'))
console.log(fn('yssssssseyyyy', 'yes'))
console.log(fn('ab', 'b'))

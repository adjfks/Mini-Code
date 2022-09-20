// https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/

// 超时代码
function findMinArrowShots1(points) {
  points.sort((a, b) => {
    if (a[0] === b[0]) return a[1] - b[1]
    else return a[0] - b[0]
  })
  for (let i = 1; i < points.length; i++) {
    const [preStart, preEnd] = points[i - 1]
    const [curStart, curEnd] = points[i]
    if (curStart <= preEnd) {
      points[i] = [curStart, Math.min(preEnd, curEnd)]
      points.splice(i - 1, 1)
      i--
    }
  }
  return points.length
}

export default function findMinArrowShots2(points) {
  points.sort((a, b) => {
    if (a[0] === b[0]) return a[1] - b[1]
    else return a[0] - b[0]
  })
  let ans = 0
  while (points.length) {
    const tmp = points.pop()[0]
    while (points.length && points[points.length - 1][1] >= tmp) {
      points.pop()
    }
    ans++
  }
  return ans
}

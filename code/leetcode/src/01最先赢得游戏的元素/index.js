// 输入一个元素都唯一且只包含整数的数组arr和一个数字k
// 每次游戏由arr[0]和arr[1]参与，大的数字获得该游戏回合胜利，放到数组第一个位置，小的数字移到数组末尾
// 当某个元素获胜次数为k时就结束游戏，返回该数字
export default function getWinNumber(arr, k) {
  let winner = null
  const hash = {}
  while (winner === null || hash[winner] < k) {
    const n1 = arr[0]
    const n2 = arr[1]
    if (n1 > n2) {
      winner = n1
      arr.splice(1, 1)
      arr.push(n2)
    } else {
      winner = n2
      arr.shift()
      arr.push(n1)
    }
    hash[winner] = hash[winner] ? hash[winner] + 1 : 1
    console.log(winner, hash[winner])
  }
  return winner
}

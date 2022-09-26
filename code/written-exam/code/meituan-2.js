// let [n, m] = read_line()
//   .split(' ')
//   .map((x) => parseInt(x))
const map = [
  [0, 1, 0],
  [1, 1, 0],
  [1, 0, 0],
]
// TODO: 未完成
function fn(map, x, y, k) {
  let count = 0
  const n = map.length
  const m = map[0].length
  while (x < n && x >= 0 && y < m && y >= 0) {
    const direction = [
      [x + 1, y],
      [x, y + 1],
      [x - 1, y],
      [x, y - 1],
    ]
    let canGo = false
    for (const [a, b] of direction) {
      if (x < n && x >= 0 && y < m && y >= 0 && map[x][y] !== map[a][b]) {
        count++
        x = a
        y = b
        canGo = true
        break
      }
    }
    if (!canGo || count === k) break
  }
  console.log(`${x} ${y}`)
}

fn(map, 0, 2, 3)

// while (n--) {
//   const row = read_line()
//     .split('')
//     .map((x) => parseInt(x))
//   map.push(row)
// }
// const t = parseInt(read_line())
// while (t--) {
//   let [x, y, k] = read_line()
//     .split(' ')
//     .map((x) => parseInt(x))
//   let count = 0
//   while (x < n && x >= 0 && y < m && y >= 0) {
//     const direction = [
//       [x + 1, y],
//       [x, y + 1],
//       [x - 1, y],
//       [x, y - 1],
//     ]
//     let canGo = false
//     for (const [a, b] of direction) {
//       if (x < n && x >= 0 && y < m && y >= 0 && map[x][y] !== map[a][b]) {
//         count++
//         x = a
//         y = b
//         canGo = true
//         break
//       }
//     }
//     if (!canGo || count === k) break
//   }
//   console.log(`${x} ${y}`)
// }

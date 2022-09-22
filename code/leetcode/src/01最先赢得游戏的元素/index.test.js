import getWinNumber from './index.js'

test('最先赢得游戏的元素1', () => {
  const arr = [2, 1, 4, 3, 6, 5, 0, 7, 3]
  const ans = getWinNumber(arr, 1)
  expect(ans).toEqual(2)
})
test('最先赢得游戏的元素2', () => {
  const arr = [2, 1, 4, 3, 6, 5, 0, 7, 3]
  const ans = getWinNumber(arr, 2)
  expect(ans).toEqual(4)
})
test('最先赢得游戏的元素3', () => {
  const arr = [2, 1, 4, 3, 6, 5, 0, 7, 3]
  const ans = getWinNumber(arr, 3)
  expect(ans).toEqual(6)
})
test('最先赢得游戏的元素4', () => {
  const arr = [2, 1, 4, 3, 6, 5, 0, 7, 3]
  const ans = getWinNumber(arr, 4)
  expect(ans).toEqual(7)
})

import AsyncPool from '../index.js'
const task = (no, delay) => {
  return () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`${no}号 任务 ${delay}秒后 请求成功`)
        resolve(delay)
      }, delay * 1000)
    })
  }
}

const task1 = task(7, 1)

const tasks = [
  task(1, 5),
  task(2, 6),
  task(3, 3),
  task(4, 1.5),
  task(5, 1),
  task(6, 1),
]
const asyncPool = new AsyncPool(3, tasks)
asyncPool.unshiftTask(task1)

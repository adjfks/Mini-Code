export default class AsyncPool {
  constructor(limit = 6, tasks = []) {
    this.limit = limit
    this.taskQueue = [].concat(tasks)
    this.executingQueue = []
    this.startSchedule()
  }

  async startSchedule() {
    while (this.taskQueue.length) {
      const task = this.taskQueue.shift()
      if (this.executingQueue.length >= this.limit) {
        console.log('开始等待...')
        await Promise.race(this.executingQueue)
        console.log('等待结束...')
      }
      const executingTask = Promise.resolve(task()).then(() =>
        this.executingQueue.splice(
          this.executingQueue.indexOf(executingTask),
          1
        )
      )
      this.executingQueue.push(executingTask)
      console.log('加入一个执行任务')
    }
    Promise.all(this.executingQueue).then(() => console.log('全部执行完毕'))
  }
}

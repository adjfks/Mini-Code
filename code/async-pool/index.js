export default class AsyncPool {
  constructor(limit = 6) {
    this.limit = limit
    this.taskQueue = []
    this.executingQueue = []
    this.scheduling = false
  }

  async startSchedule() {
    this.scheduling = true
    while (this.taskQueue.length) {
      if (this.executingQueue.length >= this.limit) {
        console.log('开始等待...')
        await Promise.race(this.executingQueue)
        console.log('等待结束...')
      }
      const task = this.taskQueue.shift()
      const executingTask = this.resolveTask(task)
      this.executingQueue.push(executingTask)
      console.log('加入一个执行任务')
    }
    this.scheduling = false
    if (this.executingQueue.length) {
      Promise.all(this.executingQueue).then(() => {
        console.log('全部执行完毕')
      })
    }
  }

  resolveTask(task) {
    const executingTask = Promise.resolve(task()).finally(() =>
      this.executingQueue.splice(this.executingQueue.indexOf(executingTask), 1)
    )
    return executingTask
  }

  insertTask(task, index) {
    this.taskQueue.splice(index, 0, task)
    if (!this.scheduling) this.startSchedule()
  }

  unshiftTask(task) {
    this.insertTask(task, 0)
  }

  appendTask(task) {
    this.insertTask(task, this.taskQueue.length)
  }
}

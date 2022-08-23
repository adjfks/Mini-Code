export default class AsyncPool {
  constructor(limit = 6, tasks = []) {
    this.limit = limit
    this.taskQueue = [].concat(tasks)
    this.executingQueue = []
    this.scheduling = false
    this.startSchedule()
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
    if (this.executingQueue.length) {
      Promise.all(this.executingQueue).then(() => {
        console.log('全部执行完毕')
        this.scheduling = false
      })
    }
  }

  resolveTask(task) {
    const executingTask = Promise.resolve(task()).then(() =>
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

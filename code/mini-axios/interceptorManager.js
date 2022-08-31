import utils from './utils'

// 拦截器调度类
export default class InterceptorManager {
  constructor() {
    this.handlers = []
  }

  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      // 是否同步执行，默认为异步
      synchronous: options ? options.synchronous : false,
    })
  }

  // 暴露一个接口，用于提供handlers
  forEach(fn) {
    utils.forEach(this.handlers, (h) => {
      if (h !== null) {
        fn(h)
      }
    })
  }
}

import InterceptorManager from './interceptorManager'

export default class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    }
  }

  // 发起请求的方法
  request(config) {
    config = config || {}
    config.method = (config.method || 'get').toLowerCase()

    // 请求拦截器队列
    const requestInterceptorChain = []
    let synchronousRequestInterceptors = true
    // // 青铜写法：直接在外部访问实例内部变量
    // this.interceptors.request.handlers.forEach((interceptor) => {
    //   requestInterceptorChain.unshift(
    //     interceptor.fulfilled,
    //     interceptor.rejected
    //   )
    // })

    // 高级写法：类中暴露一个接口
    // 请求拦截器：先注册的后执行
    this.interceptors.request.forEach((interceptor) => {
      // 是否所有请求拦截器都为同步执行
      synchronousRequestInterceptors =
        synchronousRequestInterceptors && interceptor.synchronous
      requestInterceptorChain.unshift(
        interceptor.fulfilled,
        interceptor.rejected
      )
    })

    // 响应拦截器队列
    // 先注册的先执行
    const responseInterceptorChain = []
    this.interceptors.response.forEach((interceptor) => {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected)
    })

    let promise
    let len
    let i = 0
    // 异步拦截器
    if (!synchronousRequestInterceptors) {
      // 准备调用链数组
      const chain = ['待补充的请求函数', undefined]
      // 添加请求队列
      chain.unshift.apply(chain, requestInterceptorChain) // 将数组中的每一项添加到数组头部
      // 添加响应队列
      chain.push.apply(chain, requestInterceptorChain)
      len = chain.length
      promise = Promise.resolve()
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]) // 这里妙啊！！！
      }
      return promise
    }

    // TODO: 同步逻辑待补充
  }
}

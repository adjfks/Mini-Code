var nextTick = (function () {
  var callbacks = []; // 用于存放延迟回调的数组
  var pending = false;  // 为false表示是本轮循环中第一次调用nextTick,需要将延迟回调挂载到promise.then上.
  var p = Promise.resolve()

  var handler = function () {
    pending = true // 本轮nextTick开始执行,将pending设置为false
    const copies = callbacks.slice()  // 拷贝队列
    callbacks.length = 0  // 清空队列
    copies.forEach(cb => cb())  // 依次执行延迟回调
  }

  var timeFunc = function () {
    p.then(handler)
  }

  return function nextTick(cb) {
    callbacks.push(() => cb())
    if (!pending) {
      pending = true
      timeFunc()
    }
  }
})()

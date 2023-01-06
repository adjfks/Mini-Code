// 发布订阅模式的通用实现
var event = (function () {
  // 存放各种事件的订阅者
  var cache = {}
  // 订阅事件的方法
  var listen = function (key, fn) {
    if (!cache[key]) {
      cache[key] = []
    }
    cache[key].push(fn)
  }
  // 触发事件的方法
  var trigger = function (key, ...args) {
    if (!cache[key] || !cache[key].length) return
    cache[key].forEach(fn => fn(...args))
  }
  // 移除事件的方法
  var remove = function (key, fn) {
    if (!cache[key]) return
    var index = cache[key].findIndex(item => item === fn)
    if (index !== -1) cache[key].splice(index, 1)
  }
  return {
    listen,
    trigger,
    remove
  }
})()

// 实现一个installEvent方法用于给某对象安装发布订阅功能
function installEvent(obj) {
  for (var i in event) {
    obj[i] = event[i]
  }
}

// 使用
var salesOffices = {}
installEvent(salesOffices)

salesOffices.listen('squareMeter88', function (price) {
  console.log(`价格 = ${price}`);
})

salesOffices.listen('squareMeter100', function (price) {
  console.log(`价格 = ${price}`);
})

salesOffices.trigger('squareMeter88', 200000)
salesOffices.trigger('squareMeter100', 400000)

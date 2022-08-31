// 遍历数组或对象，将 值、键、原对象 作为参数调用传入的函数
function forEach(obj, fn) {
  if (typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    for (let i = 0, len = obj.length; i < len; i++) {
      fn.call(null, obj[i], i, obj)
    }
  } else {
    const keys = Object.keys(obj)
    const len = keys.length
    for (let i = 0; i < len; i++) {
      key = keys[i]
      fn.call(null, obj[key], i, obj)
    }
  }
}

export default {
  forEach,
}

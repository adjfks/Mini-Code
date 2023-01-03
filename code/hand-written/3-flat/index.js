/* 
  第一种实现方式，不使用ES6方法，支持传入展开层数
  当传入Infinity时全部展开
  当传入的数字小于等于0时不作任何操作
*/
Array.prototype.myFlat = function (layer = 1) {
  let result = this
  if (typeof layer !== 'number' || layer <= 0) {
    return result
  }
  if (!Number.isFinite(layer)) {
    return flat(result, true)
  }
  while (layer--) {
    result = flat(result)
  }
  return result

  function flat(arr, infinity = false) {
    const res = []
    for (let item of arr) {
      if (Object.prototype.toString.call(item) === '[object Array]') {
        if (infinity) {
          item = flat(item, infinity)
        }
        for (const value of item) {
          res.push(value)
        }
      } else {
        res.push(item)
      }
    }
    return res
  }
}

/* 
  第二种方式使用reduce + concat实现
  reduce用于遍历数组，concat实现一层展开
*/
Array.prototype.myFlat1 = function (layer = 1) {
  let result = this
  if (layer) {
    result = result.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? cur.myFlat1(--layer) : cur), [])
  }
  return result
}

/* 
 第三种方法使用栈实现，暂不支持指定展开层数
*/
Array.prototype.myFlat2 = function () {
  const stack = [].concat(this)
  const result = []
  while (stack.length) {
    const item = stack.pop()
    if (Array.isArray(item)) {
      stack.push(...item)
    } else {
      result.unshift(item)
    }
  }
  return result
}

/* 
  第四种方法使用Generator实现，使用时需要搭配扩展运算符
*/
function* flat(arr, layer) {
  if (layer === undefined) layer = 1;
  for (const item of arr) {
    if (Array.isArray(item) && layer > 0) {   // layer > 0
      yield* flat(item, layer - 1);
    } else {
      yield item;
    }
  }
}

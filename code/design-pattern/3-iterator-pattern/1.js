// 内部迭代器
function each(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    const value = callback.call(arr[i], i, arr[i])
    if (value === false) {
      break
    }
  }
}

const arr1 = [1, 3, 4, 5, 6, 8, 7, 0, 6]
each(arr1, (index, item) => {
  console.log('index, item: ', index, item);
  if (index > 3) return false
})

// 外部迭代器
function iterator(obj) {
  var current = 0
  var next = function () {
    current++
  }
  var isDone = function () {
    return current >= obj.length
  }
  var getCurrentItem = function () {
    return obj[current]
  }
  return {
    next,
    isDone,
    getCurrentItem,
    length: obj.length
  }
}

// 比较两个数组的元素是否相同
const arr2 = [1, 2, 4, 6, 1, 9, 7, 0, 2]
const arr3 = [1, 2, 4, 6, 1, 9, 7, 0, 2]
const arr4 = [3, 5, 6, 9, 0, 1, 2, 0, 9]

// 使用内部迭代器
function inside_compare(a, b) {
  if (a.length !== b.length) {
    throw new Error('Not equal!')
  }
  each(a, function (index, item) {
    if (b[index] !== item) {
      throw new Error('Not equal!')
    }
  })
  console.log('Equal!');
}

inside_compare(arr2, arr3)
// inside_compare(arr2, arr4)

// 使用外部迭代器
function outside_iterator(i1, i2) {
  if (i1.length !== i2.length) {
    throw new Error('Not equal!')
  }
  while (!i1.isDone() && !i2.isDone()) {
    if (i1.getCurrentItem() !== i2.getCurrentItem()) {
      throw new Error('Not equal!')
    }
    i1.next()
    i2.next()
  }
  console.log('Equal!');
}
const iterator2_1 = iterator(arr2)
const iterator3 = iterator(arr3)
outside_iterator(iterator2_1, iterator3)

const iterator2_2 = iterator(arr2)
const iterator4 = iterator(arr4)
outside_iterator(iterator2_2, iterator4)

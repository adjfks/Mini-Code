import h from './h'

const vdom1 = h('p', {}, h('span', {}, '哈哈'))
const vdom2 = h('ul', {}, [
  h('li', {}, '嘻嘻'),
  h('li', {}, '哈哈'),
  h('li', {}, '呵呵'),
])

console.log(vdom1)
console.log(vdom2)

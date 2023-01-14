// 手写Promise.race

Promise.my_race = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      p.then(res => resolve(res), err => reject(err))
    })
  })
}


const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('p1')
  }, 1000)
})
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('p2')
  }, 100)
})
const p3 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('p3')
  }, 500)
})
Promise.race([p1, p2, p3]).then(res => console.log(res), err => console.log(err)).catch(err => console.log(err))
Promise.race([p1, p2, p3]).catch(err => console.log(err))
// Promise.my_race([p1, p2, p3]).then(res => console.log(res), err => console.log(err))


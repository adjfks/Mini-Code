function findFactor(num) {
  let res = [-1, -1];
  if (num > 0) {
    for (let i = 1; i <= Math.ceil(i / 2); i++) {
      if (num % i === 0) {
        res = [i, num / i];
        break;
      }
    }
  }
  return res;
}

const res = []
for (let i = 1; i < 100; i++) {
  res.push(findFactor(i));
}
console.log(res)

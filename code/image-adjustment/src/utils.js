export const throttle = (fn, delay = 100) => {
  let time;
  return function() {
    if (time) return
    time = setTimeout(() => {
      fn()
      clearTimeout(time)
      time = null
    }, delay);
  }
}
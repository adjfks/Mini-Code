class App {
  // inner
  /* 块级 */
  // 123
  inClass() {
    // buried-0
    console.log(213)
    // afterConsole
    const b = 2
  }
}
// 外边的猴嘴

function fn() {
  // fn右边
  // buried-1
  const a = 1
  // 猴嘴
}
fn()

const a = () => {
  // buried-7
}
a()

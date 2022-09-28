import saveAs from 'file-saver'

const aBtn = document.querySelector('#a-btn')
const fsBtn = document.querySelector('#fs-btn')
const canvas = document.querySelector('#chart')

aBtn.addEventListener('click', downloadA)
fsBtn.addEventListener('click', downloadFileSaver)

function downloadA() {
  // 创建一个 a 标签，并设置 href 和 download 属性
  const el = document.createElement('a')
  // 设置 href 为图片经过 base64 编码后的字符串，默认为 png 格式
  el.href = canvas.toDataURL()
  el.download = 'a-bg'

  // 创建一个点击事件并对 a 标签进行触发
  const event = new MouseEvent('click')
  el.dispatchEvent(event)
}

function downloadFileSaver() {
  // 如果 toBlob 方法出现兼容性问题建议引入 https://github.com/eligrey/canvas-toBlob.js
  canvas.toBlob(function (blob) {
    saveAs(blob, 'fs-bg')
  })
}

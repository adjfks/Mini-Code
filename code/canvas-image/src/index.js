import saveAs from 'file-saver'

// const aBtn = document.querySelector('#a-btn')
// const fsBtn = document.querySelector('#fs-btn')
// const canvas = document.querySelector('#chart')

// aBtn.addEventListener('click', downloadA)
// fsBtn.addEventListener('click', downloadFileSaver)

const canvas = document.querySelector('#badge-canvas')
const bgImg = document.querySelector('#badge-bg')
const badgeImg = document.querySelector('#badge-img')
const data = {}
draw(canvas, bgImg, badgeImg, data)
function draw(canvas, bgImg, showImg, data) {
  const width = canvas.width
  console.log('width: ', width)
  const height = canvas.height
  console.log('height: ', height)
  const ctx = canvas.getContext('2d', {
    antialias: true, // 使画质更清晰  其他配置可以参考文档
  })
  // 绘制背景图片
  ctx.drawImage(bgImg, 0, 0, width, height)

  // 填充文字
  ctx.fillStyle = '#fff'
  ctx.font = '60px Montserrat'
  ctx.fillText('Sndel K. Cypress', 17, 69)

  // 展示结果
  const dataUrl = canvas.toDataURL('image/png')
  showImg.src = dataUrl

  // // 绘制价格
  // ctx.fillStyle = '#E85700' // 设置字体颜色
  // ctx.font = '24px PingFang SC' // 字体、字体大小
  // ctx.fillText('￥', 50, 720) // 文字内容和位置  相当于绝对定位left 和top值  定位参照位置是canvas区域左上角

  // ctx.drawImage(img, 211, 872, 209, 209)

  // let Url = document.getElementById('mycanvas').toDataURL('image/png') // 转base64
  // document.querySelector('.postImg').src = Url // 展示图片
}

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

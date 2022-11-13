import img1 from '../assets/1.jpg'
import img2 from '../assets/2.jpg'
import { calcImage, loadImg, getCanvas, drawImageCentered } from './util'
import { rotateImage } from './rotate'
// 获取容器宽高
const { width, height } = document
  .getElementById('origin-container')
  .getBoundingClientRect()

// 居中绘制原图
loadImg(img2, (img) => {
  // 设置宽高
  const oCanvas = getCanvas(width, height, '#origin-canvas')
  const ctx = oCanvas.getContext('2d')
  const { x, y, w, h } = calcImage(oCanvas, img)
  ctx.drawImage(img, x, y, w, h)
})

// 旋转图片
loadImg(img2, (img) => {
  // 接收用户输入角度，步长为90度
  const input = document.createElement('input')
  input.type = 'range'
  input.min = -180
  input.max = 180
  input.step = 90
  document.querySelector('.angle-input').appendChild(input)
  document.querySelector('.angle-text').innerHTML = input.value

  const rCanvas = getCanvas(width, height, '#rotate-canvas')
  const imageCanvas = rotateImage(img, 0)
  drawImageCentered(rCanvas, imageCanvas)

  // input 变化时旋转图片
  input.addEventListener('change', (e) => {
    const angle = e.target.value % 360
    document.querySelector('.angle-text').innerHTML = angle
    const imageCanvas = rotateImage(img, angle)
    drawImageCentered(rCanvas, imageCanvas)
    // const image = document.createElement('img')
    // image.src = imageCanvas.toDataURL()
    // document.querySelector('body').appendChild(image)
  })
})

import { calcImage, loadImg } from './util'
import img1 from '../assets/1.jpg'
import img2 from '../assets/1.jpg'
// 获取容器宽高
const { width, height } = document
  .querySelector('.canvas-container')
  .getBoundingClientRect()
const canvas = document.getElementById('image-canvas')
// 给canvas设置宽高 默认为 300 * 150
canvas.width = width
canvas.height = height
// 获取上下文 多次获取同种类型的上下文，返回同一个
const ctx = canvas.getContext('2d')

// 加载图片
loadImg(img2, (img) => {
  const { x, y, w, h } = calcImage(canvas, img)
  ctx.drawImage(img, x, y, w, h)
})

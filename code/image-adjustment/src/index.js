import img1 from '../assets/1.jpg'
import img2 from '../assets/2.jpg'
import img3 from '../assets/3.jpg'

import AdjustCanvasExt from './adjust'
import { throttle } from './utils';

const CROP = 'crop';
const ROTATE = 'rotate';

// 切换图片按钮
const IMAGE_LIST = [img1, img2, img3];
let curIndex = 0;
let IMAGE = IMAGE_LIST[curIndex];

// switch mode button
const oBtn = document.querySelector('.origin-btn')
const rBtn = document.querySelector('.rotate-btn')
const cBtn = document.querySelector('.crop-btn')

const title = document.querySelector('.title')

const adjustContainer = document.querySelector('.adjust-container')
const { width: adjustWidth, height: adjustHeight } = adjustContainer.getBoundingClientRect()
const previewContainer = document.querySelector('.preview-container')
const { width: previewWidth, height: previewHeight } = previewContainer.getBoundingClientRect()

const adjustCanvas = document.querySelector('.adjust-canvas')
const previewCanvas = document.querySelector('.preview-canvas')

let adjustCanvasExt
let previewCanvasExt

main()
const sBtn = document.querySelector('.switch-image')
sBtn.addEventListener('click', () => {
  curIndex = (curIndex + 1) % IMAGE_LIST.length
  IMAGE = IMAGE_LIST[curIndex]
  main()
})

function main() {
  // adjust canvas
  adjustCanvasExt = new AdjustCanvasExt({
    canvas: adjustCanvas,
    image: {
      src: IMAGE,
      name: '1.jpeg'
    },
    operation: ROTATE,
    width: adjustWidth,
    height: adjustHeight,
  })

  previewCanvasExt = new AdjustCanvasExt({
    canvas: previewCanvas,
    image: {
      src: IMAGE,
      name: '1.jpeg'
    },
    operation: ROTATE,
    width: previewWidth,
    height: previewHeight
  })
}

oBtn.addEventListener('click', () => {
  title.innerHTML = 'Origin'
  document.querySelector('.angle-input').innerHTML = '';
  document.querySelector('.angle-text').innerHTML = '';
  clear()
  main()
})
rBtn.addEventListener('click', () => {
  title.innerHTML = 'Rotate'

  // 接收用户输入角度，步长为90度
  const input = document.createElement('input')
  input.type = 'range'
  input.min = -180
  input.max = 180
  input.step = 90
  input.value = 0;
  document.querySelector('.angle-input').innerHTML = '';
  document.querySelector('.angle-input').appendChild(input);
  document.querySelector('.angle-text').innerHTML = input.value

  previewCanvasExt.switchOperation(ROTATE, { angle: input.value })

  // 角度值变换
  input.addEventListener('change', () => {
    document.querySelector('.angle-text').innerHTML = input.value
    previewCanvasExt.rotateAndDraw(input.value)
  })
})
cBtn.addEventListener('click', () => {
  title.innerHTML = 'Crop'
  document.querySelector('.angle-input').innerHTML = '';
  document.querySelector('.angle-text').innerHTML = '';
  adjustCanvasExt.switchOperation(CROP)
  previewCanvasExt.switchOperation(ROTATE)
  
  adjustCanvasExt.imageCanvas.addEventListener('mousemove', throttle(() => {
    const canvas = adjustCanvasExt.getCroppedCanvas()
    previewCanvasExt._drawImageCentered(previewCanvasExt.imageCanvas, canvas)
  }, 100))
})

function clear() {
  adjustCanvasExt.resetAdjustData()
  previewCanvasExt.resetAdjustData()
}
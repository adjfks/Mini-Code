import img1 from '../assets/1.jpg'
import img2 from '../assets/2.jpg'
import img3 from '../assets/3.jpg'

import AdjustCanvasExt from './adjust'
import { throttle } from './utils';

const CROP = 'crop';
const ROTATE = 'rotate';
const BLUR = 'blur';
const MOSAIC = 'mosaic';

// 切换图片按钮
const IMAGE_LIST = [img1, img3, img2];
let curIndex = 0;
let IMAGE = IMAGE_LIST[curIndex];

// switch mode button
const oBtn = document.querySelector('.origin-btn')
const rBtn = document.querySelector('.rotate-btn')
const cBtn = document.querySelector('.crop-btn')
const bBtn = document.querySelector('.blur-btn')
const mBtn = document.querySelector('.mosaic-btn')

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
sBtn.addEventListener('click', (e) => {
  if (e.target !== sBtn) return;
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

// origin
oBtn.addEventListener('click', () => {
  title.innerHTML = 'Origin'
  document.querySelector('.input').innerHTML = '';
  document.querySelector('.text').innerHTML = '';
  clear()
  main()
})

// rotate
rBtn.addEventListener('click', () => {
  title.innerHTML = 'Rotate'

  // 接收用户输入角度，步长为90度
  const input = document.createElement('input')
  input.type = 'range'
  input.min = -180
  input.max = 180
  input.step = 90
  input.value = 0;
  document.querySelector('.input').innerHTML = '';
  document.querySelector('.input').appendChild(input);
  document.querySelector('.text').innerHTML = input.value

  previewCanvasExt.switchOperation(ROTATE, { angle: input.value })

  // 角度值变换
  input.addEventListener('change', () => {
    document.querySelector('.text').innerHTML = input.value
    previewCanvasExt.rotateAndDraw(input.value)
  })
})

// crop
cBtn.addEventListener('click', () => {
  title.innerHTML = 'Crop'
  document.querySelector('.input').innerHTML = '';
  document.querySelector('.text').innerHTML = '';
  adjustCanvasExt.switchOperation(CROP)
  previewCanvasExt.switchOperation(ROTATE)
  
  adjustCanvasExt.imageCanvas.addEventListener('mousemove', throttle(() => {
    const canvas = adjustCanvasExt.getCroppedCanvas()
    previewCanvasExt._drawImageCentered(previewCanvasExt.imageCanvas, canvas)
  }, 100))
})

// blur
bBtn.addEventListener('click', () => {
  title.innerHTML = 'Blur'
  const input = document.createElement('input')
  input.type = 'range'
  input.min = 1;
  input.max = 120;
  input.step = 1;
  input.value = 1;
  document.querySelector('.input').innerHTML = '';
  document.querySelector('.input').appendChild(input);
  document.querySelector('.text').innerHTML = input.value
  input.addEventListener('input', () => {
    document.querySelector('.text').innerHTML = input.value;
    adjustCanvasExt.setRadius(input.value)
  });

  // delete button
  const delBtn = document.createElement('button');
  delBtn.innerHTML = 'delete'
  delBtn.addEventListener('click', () => {
    adjustCanvasExt.removeSeletedAnnotation();
  });
  document.querySelector('.blur').innerHTML = '';
  document.querySelector('.blur').appendChild(delBtn);

  // adjust button
  const adjustBtn = document.createElement('button');
  adjustBtn.innerHTML = 'adjust';
  adjustBtn.addEventListener('click', () => {
    adjustCanvasExt.adjustAllAnnotation();
  });
  document.querySelector('.blur').appendChild(adjustBtn);

  adjustCanvasExt.switchOperation(BLUR, { radius: input.value });
})

// mosaic
mBtn.addEventListener('click', () => {
  title.innerHTML = 'Mosaic'
  const input = document.createElement('input')
  input.type = 'range'
  input.min = 10;
  input.max = 20;
  input.step = 1;
  input.value = 1;
  document.querySelector('.input').innerHTML = '';
  document.querySelector('.input').appendChild(input);
  document.querySelector('.text').innerHTML = input.value
  input.addEventListener('input', () => {
    document.querySelector('.text').innerHTML = input.value;
    adjustCanvasExt.setRadius(input.value)
  });

  // delete button
  const delBtn = document.createElement('button');
  delBtn.innerHTML = 'delete'
  delBtn.addEventListener('click', () => {
    adjustCanvasExt.removeSeletedAnnotation();
  });
  document.querySelector('.blur').innerHTML = '';
  document.querySelector('.blur').appendChild(delBtn);

  // adjust button
  const adjustBtn = document.createElement('button');
  adjustBtn.innerHTML = 'adjust';
  adjustBtn.addEventListener('click', () => {
    adjustCanvasExt.adjustAllAnnotation();
  });
  document.querySelector('.blur').appendChild(adjustBtn);

  adjustCanvasExt.switchOperation(MOSAIC, { radius: input.value });
})

function clear() {
  adjustCanvasExt.resetAdjustData()
  previewCanvasExt.resetAdjustData()
}

import img1 from '../assets/1.jpg'
import img2 from '../assets/2.jpg'
import { calcImage, loadImg, getCanvas, drawImageCentered, getPixelRatio, initCanvas } from './util'
import { rotateImage } from './rotate'
import { drawMask, drawSelect } from './crop'
// 切换图片按钮
const IMAGE_LIST = [img1, img2];
let curIndex = 0;
let IMAGE = IMAGE_LIST[curIndex];
const operationEl = document.querySelector('.operation')
const btn = document.createElement('button');
btn.innerHTML = 'Toogle Image';
operationEl.appendChild(btn);
btn.addEventListener('click', () => {
  curIndex = (curIndex + 1) % IMAGE_LIST.length;
  IMAGE = IMAGE_LIST[curIndex];
  main();
})

main();

function main() {
  // 获取容器宽高
  const { width, height } = document
    .getElementById('origin-container')
    .getBoundingClientRect()

  // 居中绘制原图
  loadImg(IMAGE, (img) => {
    // 设置宽高
    const oCanvas = getCanvas(width, height, '#origin-canvas')
    const ctx = oCanvas.getContext('2d')
    const { x, y, w, h } = calcImage(oCanvas, img)
    ctx.drawImage(img, x, y, w, h)
  })

  // 旋转图片
  loadImg(IMAGE, (img) => {
    // 接收用户输入角度，步长为90度
    const input = document.createElement('input')
    input.type = 'range'
    input.min = -180
    input.max = 180
    input.step = 90
    document.querySelector('.angle-input').innerHTML = input
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
    })
  })

  // 裁剪图片
  loadImg(IMAGE, (img) => {
    // 获取容器大小
    const { width, height } = document
      .getElementById('crop-container')
      .getBoundingClientRect();
    // 获取裁剪的canvas
    const cropCanvas = initCanvas(document.getElementById('crop-canvas'), width, height);
    const ctx = cropCanvas.getContext('2d');

    // 计算图片绘制参数
    let {x, y, w, h} = calcImage(cropCanvas, img, 3);
    const cropStatus = {
      x,
      y,
      w,
      h
    }

    // 绘制蒙层
    drawMask(ctx, x, y, w, h);
    // 绘制选择框
    drawSelect(ctx, x, y, 100, 400);
    // 绘制图片
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over'
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
  })
}



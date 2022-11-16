import img1 from '../assets/1.jpg'
import img2 from '../assets/2.jpg'
import { calcImage, loadImg, getCanvas, drawImageCentered, initCanvas } from './util'
import { rotateImage } from './rotate'
import { crop } from './crop'
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
    document.querySelector('.angle-input').innerHTML = '';
    document.querySelector('.angle-input').appendChild(input);
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
    const cropCanvas = document.getElementById('crop-canvas');
    const cropObj = crop({
      canvas: cropCanvas,
      img,
      width,
      height,
    });
    const cropBtn = document.getElementById('crop-btn');
    cropBtn.addEventListener('click', () => {
      const { imageData, width, height } = cropObj.getData();
      const canvas2 = getCanvas(width, height, '#crop-preview');
      const ctx2 = canvas2.getContext('2d');
      ctx2.clearRect(0, 0, width, height);
      ctx2.putImageData(imageData, 0, 0);
    })
    // const ctx = cropCanvas.getContext('2d');

    // // 计算图片绘制参数
    // let {x, y, w, h} = calcImage(cropCanvas, img, 3);
    // const initImage = { x, y, w, h };

    // /* 数据 */
    // // canvas中鼠标的信息
    // const mouse = { x: 0, y: 0, down: false, cursor: 'default', cursorIndex: 10, start: [0, 0] };
    // // 选择框信息
    // const select = { x, y, w, h, borderWidth: 3, lineLen: 16, start: [0, 0, 0, 0] };
    
    // // 绘制蒙层
    // drawMask(ctx, initImage);
    // // 绘制选择框
    // drawSelect(ctx, select);
    // // 绘制图片
    // ctx.save();
    // ctx.globalCompositeOperation = 'destination-over'
    // ctx.drawImage(img, x, y, w, h);
    // ctx.restore();

    // // 添加mousemove事件
    // cropCanvas.addEventListener('mousemove', (e) => {
    //   const rect = cropCanvas.getBoundingClientRect();
    //   mouse.x = (e.pageX - rect.left);
    //   mouse.y = (e.pageY - rect.top);
    //   if (!checkInPath(mouse.x, mouse.y, originImageRect)) {
    //     mouse.down = false;
    //   }

    //   if (!mouse.down) {
    //     // 获取鼠标可能所在区域
    //     const areas = getMouseArea(select);
    //     areas.push([0, 0, width, height]);
    //     for (let i = 0; i < areas.length; i++) {
    //       if (checkInPath(ctx, mouse.x, mouse.y, areas[i])) {
    //         // 设置鼠标样式
    //         mouse.cursor = getMouseStyle(i);
    //         mouse.cursorIndex = i;
    //         cropCanvas.style.cursor = mouse.cursor;
    //         break;
    //       }
    //     }
    //   }

    //   // 判断是否在控制区域
    //   if (
    //     mouse.down && 
    //     mouse.cursorIndex < 9 &&
    //     checkInPath(ctx, mouse.x, mouse.y, [initImage.x, initImage.y, initImage.w, initImage.h])
    //   ) {
    //     const distanceX =  mouse.x - mouse.start[0];
    //     const distanceY =  mouse.y - mouse.start[1];
    //     let selectPosition = getSelectionPosition(select.start, { distanceX, distanceY }, mouse.cursorIndex);
    //     selectPosition = checkBoundary(initImage, selectPosition);
    //     select.x = selectPosition.x;
    //     select.y = selectPosition.y;
    //     select.w = selectPosition.w;
    //     select.h = selectPosition.h;
    //     // 清空画布
    //     ctx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
    //     // 绘制蒙层
    //     drawMask(ctx, initImage);
    //     // 绘制选择框
    //     drawSelect(ctx, select);
    //     // 绘制图片
    //     ctx.save();
    //     ctx.globalCompositeOperation = 'destination-over'
    //     ctx.drawImage(img, x, y, w, h);
    //     ctx.restore();
    //   }
    // });

    // // 添加mousedown事件
    // cropCanvas.addEventListener('mousedown', (e) => {
    //   const rect = cropCanvas.getBoundingClientRect();
    //   mouse.x = (e.pageX - rect.left);
    //   mouse.y = (e.pageY - rect.top);
    //   mouse.down = true;
    //   // 记录down时选择框及鼠标信息
    //   mouse.start = [mouse.x, mouse.y];
    //   select.start = [select.x, select.y, select.w, select.h];
    // });

    // // 添加mouseup事件
    // cropCanvas.addEventListener('mouseup', (e) => {
    //   mouse.down = false;
    // });

    // 获取图片数据
    // const cropBtn = document.getElementById('crop-btn');
    // cropBtn.addEventListener('click', () => {
    //   // 绘制原图
    //   let { x, y, w, h } = select;
    //   const { x: ox, y: oy, w: ow, h: oh } = initImage;
    //   const widthRatio = img.width / ow;
    //   const heightRatio = img.height / oh;
    //   x = (x - ox) * widthRatio;
    //   y = (y - oy) * heightRatio;
    //   w *= widthRatio;
    //   h *= heightRatio;
    //   const canvas = document.createElement('canvas');
    //   canvas.width = img.width;
    //   canvas.height = img.height;
    //   const ctx = canvas.getContext('2d');
    //   ctx.drawImage(img, 0, 0);
    //   // 获取截取部分图片并绘制到canvas上
    //   const imageData = ctx.getImageData(x, y, w, h);
    //   const canvas2 = getCanvas(w, h, '#crop-preview');
    //   const ctx2 = canvas2.getContext('2d');
    //   ctx2.clearRect(0, 0, w, h)
    //   ctx2.putImageData(imageData, 0, 0);
      // 得到File文件
      // canvas2.toBlob((blob) => {
      //   const file = new File(
      //     [blob],
      //     'image.jpeg',
      //     { type: 'image/jpeg' }
      //   );
      // }, 'image/jpeg', 1.0);
    // })
  })
}



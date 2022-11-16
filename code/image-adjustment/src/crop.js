/* 
Crop
*/
import { calcImage, initCanvas } from './util'
// 绘制蒙层
export const drawMask = (ctx, select) => {
  const {x, y, w, h} = select;
  ctx.save();
  ctx.fillStyle = 'rgba(217, 217, 217, 0.3)';
  ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = 'source-atop';
  ctx.restore();
}
// 绘制选择框
export const drawSelect = (ctx, select) => {
  let { x, y, w, h, borderWidth, lineLen } = select;
  ctx.save();
  // 清空对应区域画布
  ctx.clearRect(x, y, w, h);
  // 绘制边框
  ctx.fillStyle = '#000';
  ctx.fillRect(x - borderWidth, y - borderWidth, borderWidth, lineLen + borderWidth);
  ctx.fillRect(x, y - borderWidth, lineLen, borderWidth);
  ctx.fillRect(x + w - lineLen, y - borderWidth, lineLen, borderWidth);
  ctx.fillRect(x + w, y -borderWidth, borderWidth, lineLen + borderWidth);
  ctx.fillRect(x - borderWidth, y + h - lineLen, borderWidth, lineLen);
  ctx.fillRect(x - borderWidth, y + h, lineLen + borderWidth, borderWidth);
  ctx.fillRect(x + w -lineLen, y + h, lineLen + borderWidth, borderWidth);
  ctx.fillRect(x + w, y + h - lineLen, borderWidth, lineLen);
  ctx.fillRect(x - borderWidth, y + (h - lineLen) / 2, borderWidth, lineLen + borderWidth);
  ctx.fillRect(x + w, y + (h - lineLen) / 2, borderWidth, lineLen + borderWidth);
  // 上下
  ctx.fillRect(x + (w - lineLen) / 2, y -borderWidth, lineLen, borderWidth);
  ctx.fillRect(x + (w - lineLen) / 2, y + h, lineLen, borderWidth);
  ctx.restore();
}

export const getMouseStyle = (i) => {
  // 鼠标样式
  // 与getMouseArea获得的数组索引对应
  switch (i) {
    case 0:
    case 3:
      return 'nwse-resize'
    case 4:
    case 5:
      return 'ns-resize'
    case 1:
    case 2:
      return 'nesw-resize'
    case 6:
    case 7:
      return 'ew-resize'
    case 8:
      return 'move'
    default:
      return 'default'
  }
}

// 获取鼠标所有可能所在区域
export const getMouseArea = (select, size = 20) => {
  const {x, y, w, h} = select;
  const halfSize = size / 2;
  return [
    // 左上，右上，左下，右下四个区域
    [x - halfSize, y - halfSize, size, size],
    [x + w - halfSize, y - halfSize, size, size],
    [x - halfSize, y + h - halfSize, size, size],
    [x + w -halfSize, y + h - halfSize, size, size],
    // 上下左右四条边
    [x, y - halfSize, w, size],
    [x, y + h -halfSize, w, size],
    [x - halfSize, y, size, h],
    [x + w - halfSize, y, size, h],
    // 最后是整个选择框
    [x, y, w, h]
  ]
}

// 判断某个坐标是否在select路径上
export const checkInPath = (ctx, x, y, rectPosi) => {
  if (!Array.isArray(rectPosi)) {
    const { x, y, w, h }  = rectPosi;
    rectPosi = [x, y, w, h];
  }
  ctx.beginPath();
  ctx.rect(...rectPosi);
  const result = ctx.isPointInPath(x, y);
  ctx.closePath();
  return result;
}

// 获取select最新位置
export const getSelectionPosition = (select, distance, cursorIndex) => {
  let [x, y, w, h] = select;
  const { distanceX, distanceY } = distance;
  switch (cursorIndex) {
    // 左上
    case 0:
      x += distanceX;
      y += distanceY;
      w -= distanceX;
      h -= distanceY;
      break;
    // 右上
    case 1:
      y += distanceY;
      w += distanceX;
      h -= distanceY;
      break;
    // 右下
    case 3:
      w += distanceX;
      h += distanceY;
      break;
    // 左下
    case 2:
      x += distanceX;
      w -= distanceX;
      h += distanceY;
      break;
    // 上
    case 4:
      y += distanceY;
      h -= distanceY;
      break;
    // 下
    case 5:
      h += distanceY;
      break;
    // 左
    case 6:
      x += distanceX;
      w -= distanceX;
      break;
    // 右
    case 7:
      w += distanceX;
      break;
    // 中间
    case 8:
      x += distanceX;
      y += distanceY;
      break;
    default:  
      break;
  }
  if (w < 0) {
    x += w;
    w = -w;
  }
  if (h < 0) {
    y += h;
    h = -h;
  }
  return {x, y, w, h};
}

// 监测是否到达边缘区域
export const checkBoundary = (initImage, selectPosition) => {
  const {x, y, w, h} = initImage;
  const select = {...selectPosition};
  select.x < x && (select.x = x);
  select.y < y && (select.y = y);
  select.x + select.w > x + w && (select.x -= select.x + select.w - (x + w));
  select.y + select.h > y + h && (select.y -= select.y + select.h - (y + h));
  return select;
}

// 获取图像数据
export const getCroppedImageData = (select, originImageRect, img) => {
  // 绘制原图
  let { x, y, w, h } = select;
  const { x: ox, y: oy, w: ow, h: oh } = originImageRect;
  const widthRatio = img.width / ow;
  const heightRatio = img.height / oh;
  x = (x - ox) * widthRatio;
  y = (y - oy) * heightRatio;
  w *= widthRatio;
  h *= heightRatio;
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // 获取截取部分图片并绘制到canvas上
  const imageData = ctx.getImageData(x, y, w, h);
  return {
    imageData,
    width: w,
    height: h
  };
}

// 裁剪主函数
export const crop = (option) => {
  let {
    img,
    canvas,
    borderWidth,
    lineLen,
    width,
    height
  } = option;
  borderWidth = borderWidth || 3;
  lineLen = lineLen || 16;
  width = width || canvas.width;
  height = height || canvas.height;
  const cropCanvas = initCanvas(canvas, width, height);
  const ctx = cropCanvas.getContext('2d');

  /* 数据 */
  // 计算绘图初始参数
  const { x, y, w, h } = calcImage(cropCanvas, img, 3);
  // 得到原始图像在canvas中的区域
  const originImageRect = { x, y, w, h };
  const rect = cropCanvas.getBoundingClientRect();
  // canvas中鼠标的信息
  const mouse = { x: 0, y: 0, down: false, cursor: 'default', cursorIndex: 10, start: [0, 0] };
  // 选择框信息
  const select = { x, y, w, h, borderWidth, lineLen, start: [0, 0, 0, 0] };

  // 绘制蒙层
  drawMask(ctx, originImageRect);
  // 绘制选择框
  drawSelect(ctx, select);
  // 绘制图片
  ctx.save();
  ctx.globalCompositeOperation = 'destination-over'
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();

  // 添加mousemove事件
  cropCanvas.addEventListener('mousemove', (e) => {
    // 得到鼠标在canvas中的位置
    mouse.x = (e.pageX - rect.left);
    mouse.y = (e.pageY - rect.top);

    // 当鼠标移除图片区域
    if (!checkInPath(ctx, mouse.x, mouse.y, originImageRect)) {
      mouse.down = false;
    }

    // 鼠标没有按下时更新鼠标样式
    if (!mouse.down) {
      // 获取鼠标可能所在区域
      const areas = getMouseArea(select);
      areas.push([0, 0, canvas.width, canvas.height]);
      for (let i = 0; i < areas.length; i++) {
        if (checkInPath(ctx, mouse.x, mouse.y, areas[i])) {
          mouse.cursor = getMouseStyle(i);
          mouse.cursorIndex = i;
          cropCanvas.style.cursor = mouse.cursor;
          break;
        }
      }
    }

    // 判断是否在控制区域
    if (
      mouse.down && 
      mouse.cursorIndex < 9 &&
      checkInPath(ctx, mouse.x, mouse.y, originImageRect)
    ) {
      const distanceX =  mouse.x - mouse.start[0];
      const distanceY =  mouse.y - mouse.start[1];
      let selectPosition = getSelectionPosition(select.start, { distanceX, distanceY }, mouse.cursorIndex);
      selectPosition = checkBoundary(originImageRect, selectPosition);
      select.x = selectPosition.x;
      select.y = selectPosition.y;
      select.w = selectPosition.w;
      select.h = selectPosition.h;
      // 清空画布
      ctx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
      // 绘制蒙层
      drawMask(ctx, originImageRect);
      // 绘制选择框
      drawSelect(ctx, select);
      // 绘制图片
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over'
      ctx.drawImage(img, x, y, w, h);
      ctx.restore();
    }
  });

  // 添加mousedown事件
  cropCanvas.addEventListener('mousedown', (e) => {
    const rect = cropCanvas.getBoundingClientRect();
    mouse.x = (e.pageX - rect.left);
    mouse.y = (e.pageY - rect.top);
    mouse.down = true;
    // 记录down时选择框及鼠标信息
    mouse.start = [mouse.x, mouse.y];
    select.start = [select.x, select.y, select.w, select.h];
  });

  // 添加mouseup事件
  cropCanvas.addEventListener('mouseup', (e) => {
    mouse.down = false;
  });

  return {
    getData: () => {
      return getCroppedImageData(select, originImageRect, img);
    }
  }
}
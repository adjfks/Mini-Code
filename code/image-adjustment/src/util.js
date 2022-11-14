// 这里写一些工具函数
// 加载图片
export const loadImg = (src, callback) => {
  const image = new Image()
  image.onload = () => {
    callback(image)
  }
  image.onerror = (err) => {
    console.log('err:', err)
  }
  image.src = src
}
// 计算居中绘制图片的参数
export const calcImage = (canvas, img, padding = 0) => {
  const cw = canvas.width - padding * 2
  const ch = canvas.height - padding * 2
  const iw = img.width
  const ih = img.height
  const cRatio = cw / ch
  const iRatio = iw / ih
  let x = 0 + padding,
    y = 0 + padding,
    w = cw,
    h = ch
  if (cRatio > iRatio) {
    // 若canvas比较宽，则绘制出的图片宽高分别为 (iRatio * ch, ch)
    x = (cw - iRatio * ch) / 2
    w = iRatio * ch
  } else {
    // 若canvas比较高，则绘制出的图片宽高分别为 (cw, cw / iRatio)
    y = (ch - cw / iRatio) / 2
    h = cw / iRatio
  }
  x = Math.floor(x);
  y = Math.floor(y);
  w = Math.floor(w);
  h = Math.floor(h);
  return { x, y, w, h }
}
// 获取canvas
export const getCanvas = (width, height, selector = '') => {
  let canvas
  if (!selector) {
    canvas = document.createElement('canvas')
  } else {
    canvas = document.querySelector(selector)
  }
  canvas.width = width
  canvas.height = height
  return canvas
}

// 居中绘制图片
export const drawImageCentered = (canvas, img) => {
  const ctx = canvas.getContext('2d')
  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const { x, y, w, h } = calcImage(canvas, img)
  ctx.drawImage(img, x, y, w, h)
  ctx.restore()
  return { x, y, w, h }
}

// 获取填充满（canvas中某一部分）的canvas
export const getFilledCanvas = (canvas, x, y, w, h) => {
  const filledCanvas = getCanvas(w, h)
  const ctx = filledCanvas.getContext('2d')
  ctx.drawImage(canvas, x, y, w, h, 0, 0, w, h)
  return filledCanvas
}

// 获取window.devicePixelRatio设备的物理像素分辨率与CSS像素分辨率的比值。
export const getPixelRatio = (context) => {
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
};

// 初始化canvas
export const initCanvas = (canvas, width, height) => {
  // 设置css大小
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // 获取dpr与canvas像素比的比值，并对画布进行缩放
  const ctx = canvas.getContext('2d');
  const dprRatio = getPixelRatio(ctx);
  // 设置画布大小
  canvas.width = width * dprRatio;
  canvas.height = height * dprRatio;
  ctx.scale(dprRatio, dprRatio);
  return canvas
}
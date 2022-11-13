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
export const calcImage = (canvas, img) => {
  const cw = canvas.width
  const ch = canvas.height
  const iw = img.width
  const ih = img.height
  const cRatio = cw / ch
  const iRatio = iw / ih
  let x = 0,
    y = 0,
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
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const { x, y, w, h } = calcImage(canvas, img)
  ctx.drawImage(img, x, y, w, h)
  return { x, y, w, h }
}

// 获取填充满（canvas中某一部分）的canvas
export const getFilledCanvas = (canvas, x, y, w, h) => {
  const filledCanvas = getCanvas(w, h)
  const ctx = filledCanvas.getContext('2d')
  ctx.drawImage(canvas, x, y, w, h, 0, 0, w, h)
  return filledCanvas
}

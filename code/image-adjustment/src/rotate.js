/* 
Rotate Image
*/
import { getCanvas } from './util'

export const rotateImage = (img, angle = 0) => {
  angle = angle % 360
  // 需要创建一个canvas用于旋转图片
  const canvas = document.createElement('canvas')
  const canvasWidth = img.width
  const canvasHeight = img.height

  // 由于图片长宽不一致时，旋转后的长宽互换，所以将canvas的宽高设为图片宽高的最大值
  const cSize = Math.max(canvasWidth, canvasHeight)
  canvas.width = cSize
  canvas.height = cSize

  const ctx = canvas.getContext('2d')

  // 将画布左上角移动到canvas的中心点
  ctx.translate(cSize / 2, cSize / 2)
  // 旋转
  const rotate = (Math.PI / 180) * angle
  ctx.rotate(rotate)
  // 将画布移动回去
  ctx.translate(-cSize / 2, -cSize / 2)
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    0,
    0,
    canvasWidth,
    canvasHeight
  )

  // 获取旋转后图片的x,y,w,h
  let x = 0,
    y = 0,
    w = canvasWidth,
    h = canvasHeight
  if (angle === -90 || angle === 90 || angle === -270 || angle === 270) {
    const temp = w
    w = h
    h = temp
  }
  if (angle === 180 || angle === -180) {
    y = cSize - h
  } else if (angle === 90 || angle === -270) {
    x = cSize - w
  }

  const canvas2 = getCanvas(w, h)
  const ctx2 = canvas2.getContext('2d')
  // 只绘制canvas上有图片的部分
  ctx2.drawImage(canvas, x, y, w, h, 0, 0, w, h)
  return canvas2
}

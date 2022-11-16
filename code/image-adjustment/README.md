# Image Adjustment
Rotate, Crop, Blur

## Draw an Image Or Canvas
在画布中居中绘制一张图片或Canvas非常简单:
```js
const { calcImage, getCanvas } = './src/util.js'
const canvas = getCanvas(200, 100, '.canvas')
const ctx = canvas.getContext('2d')
const { x, y, w, h } = calcImage(canvas, img)
ctx.drawImage(img, x, y, w, h)
```

## Rotate
旋转支持90度步长,调用rotateImage得到包含旋转后图片的canvas,然后调用drawImageCentered将图片居中绘制在目标区域
```js
import { rotateImage } from './src/rotate.js'
import { drawImageCentered } from './src/util.js'
const angle = 90
const canvas = getCanvas(200, 100, '.canvas')
const imageCanvas = rotateImage(img, angle)
drawImageCentered(rCanvas, imageCanvas)
```

## Crop
调用crop传入图片，目标canvas即可
```js
import { crop } from './crop'
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

// 通过cropObj.getData()获取裁剪图片的imageData数据和宽高
const { imageData, width, height } = cropObj.getData();
```
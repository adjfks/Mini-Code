# Image Adjustment
Rotate, Crop, Blur

```js
import AdjustCanvasExt from './adjust'
const adjustCanvas = document.querySelector('.adjust-canvas')
const = adjustCanvasExt = new AdjustCanvasExt({
  canvas: adjustCanvas,
  image: {
    src: IMAGE,
    name: '1.jpeg'
  },
  operation: 'rotate',
  width: adjustCanvas.width,
  height: adjustCanvas.height,
})
```
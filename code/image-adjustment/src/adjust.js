const CROP = 'crop';
const ROTATE = 'rotate';

export default class AdjustCanvasExt {
  image = null;  // { src: '', name: '' }

  // canvas
  imageCanvas = null;
  imageCtx = null;
  canvasPadding = 0;
  canvasWidth = 300;
  canvasHeight = 150;

  // image adjust
  imageOperation = null;  // rotate crop
  operatingImage = null;
  imageAdjusted = false;
  imageLoading = false;

  // rotate
  angle = 0;

  // crop
  _mouse = { 
    x: 0, 
    y: 0, 
    down: false,
    cursorIndex: 10,
    start: [0, 0]
  };
  _originImageRect = {};
  _select = { 
    borderWidth: 4, 
    lineLen: 30,
    start: [0, 0, 0, 0] 
  };
  _mouseAreas = [];

  constructor(option) {
    const {
      canvas,
      image,
      operation,
      width,
      height,
      angle
    } = option;
    this.imageCanvas = canvas;
    this.image = image;
    this.imageOperation = operation;
    this.canvasWidth = width || this.canvasHeight;
    this.canvasHeight = height || this.canvasHeight;
    this.switchOperation(operation);
  }

  async switchOperation(operation, option = {}) {
    try {
      this.imageLoading = true;
      this.operatingImage = await this._loadImg(this.image.src);
    } catch (err) {
      console.log('err: ', err);
    }

    switch (operation) {
      case CROP:
        this._setupCrop(option);
        break;
      case ROTATE:
        this._setupRotate(option);
        break;
      default:
        break;
    }

    this.imageLoading = false;
  }

  /* Rotate */
  async _setupRotate(option) {
    const {
      angle
    } = option;
    this.imageCanvas.width = this.canvasWidth;
    this.imageCanvas.height = this.canvasHeight;
    this.imageCtx = this.imageCanvas.getContext('2d');
    this.rotateAndDraw(angle);
  }

  rotateAndDraw(angle) {
    this.angle = angle || 0;
    console.log('this.angle: ', this.angle);
    this.imageLoading = true;
    const rotateCanvas = this._rotateImage(this.operatingImage, this.angle);
    this._drawImageCentered(this.imageCanvas, rotateCanvas);
    // this._drawImageCentered(this.imageCanvas, rotateCanvas);
    this._checkAdujusted();
    this.imageLoading = false;
  }

  _rotateImage(img, angle = 0) {
    angle = angle % 360 || 0;
    const canvas = document.createElement('canvas');
    const imageWidth = img.width;
    const imageHeight = img.height;

    const cSize = Math.max(imageWidth, imageHeight);
    canvas.width = cSize;
    canvas.height = cSize;

    const ctx = canvas.getContext('2d');

    ctx.translate(cSize / 2, cSize / 2);
    const rotate = (Math.PI / 180) * angle;
    ctx.rotate(rotate);
    ctx.translate(-cSize / 2, -cSize / 2);
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, imageWidth, imageHeight);

    let x = 0;
    let y = 0;
    let w = imageWidth;
    let h = imageHeight;
    if (angle % 180 !== 0) {
      const temp = w;
      w = h;
      h = temp;
      if (angle === -90 || angle === 270) {
        y = cSize - h;
      } else {
        x = cSize - w;
      }
    } else if (angle) {
      x = cSize - w;
      y = cSize - h;
    }
    const canvas2 = this._getCanvas(w, h);
    const ctx2 = canvas2.getContext('2d');
    ctx2.drawImage(canvas, x, y, w, h, 0, 0, w, h);

    return canvas2;
  }

  _drawImageCentered(canvas, img) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { x, y, w, h } = this._calcImage(canvas, img);
    ctx.drawImage(img, x, y, w, h);
    return { x, y, w, h };
  }

  /* Crop */
  _setupCrop(option) {
    const {
      borderWidth,
      lineLen,
      canvasPadding
    } = option;
    this._select.borderWidth = borderWidth ?? this._select.borderWidth;
    this._select.lineLen = lineLen ?? this._select.lineLen;
    this.canvasPadding = canvasPadding ?? this._select.borderWidth;
    this.imageCanvas = this._initCanvas(this.imageCanvas, this.canvasWidth, this.canvasHeight);
    this.imageCtx = this.imageCanvas.getContext('2d');
    const { x, y, w, h } = this._calcImage(this.imageCanvas, this.operatingImage, this.canvasPadding);
    this._originImageRect = { x, y, w, h };
    this._select = { ...this._select, x, y, w, h };
    // draw
    this._drawMask();
    this._drawSelect();
    this._drawImage();
    // setup event listener
    this._setupCropEventListener();
  }

  _initCanvas(canvas, width, height) {
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    const dprRatio = this._getPixelRatio(ctx);
    canvas.width = width * dprRatio;
    canvas.height = height * dprRatio;
    ctx.scale(dprRatio, dprRatio);
    return canvas
  }

  _getPixelRatio(context) {
    const backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  }

  _drawMask() {
    const { x, y, w, h } = this._originImageRect;
    this.imageCtx.save();
    this.imageCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.imageCtx.fillRect(x, y, w, h);
    this.imageCtx.globalCompositeOperation = 'source-atop';
    this.imageCtx.restore();
  }

  _drawSelect() {
    const { x, y, w, h, borderWidth, lineLen } = this._select;
    const ctx = this.imageCtx;
    ctx.save();
    ctx.clearRect(x, y, w, h);
    ctx.fillStyle = '#000';
    ctx.strokeStyle = 'rgba(217, 217, 217, 0.3)';
    ctx.strokeRect(x, y, w, h);
    ctx.fillRect(x - borderWidth, y - borderWidth, borderWidth, lineLen + borderWidth);
    ctx.fillRect(x, y - borderWidth, lineLen, borderWidth);
    ctx.fillRect(x + w - lineLen, y - borderWidth, lineLen, borderWidth);
    ctx.fillRect(x + w, y - borderWidth, borderWidth, lineLen + borderWidth);
    ctx.fillRect(x - borderWidth, y + h - lineLen, borderWidth, lineLen);
    ctx.fillRect(x - borderWidth, y + h, lineLen + borderWidth, borderWidth);
    ctx.fillRect(x + w - lineLen, y + h, lineLen + borderWidth, borderWidth);
    ctx.fillRect(x + w, y + h - lineLen, borderWidth, lineLen);
    ctx.fillRect(x - borderWidth, y + (h - lineLen) / 2, borderWidth, lineLen + borderWidth);
    ctx.fillRect(x + w, y + (h - lineLen) / 2, borderWidth, lineLen + borderWidth);
    ctx.fillRect(x + (w - lineLen) / 2, y - borderWidth, lineLen, borderWidth);
    ctx.fillRect(x + (w - lineLen) / 2, y + h, lineLen, borderWidth);
    ctx.restore();
  }

  _drawImage() {
    const ctx = this.imageCtx;
    const { x, y, w, h } = this._originImageRect;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over'
    ctx.drawImage(this.operatingImage, x, y, w, h);
    ctx.restore();
  }

  _setupCropEventListener() {
    this._cropMousemoveHandler = this._cropMousemoveHandler.bind(this);
    this._cropMouseupHandler = this._cropMouseupHandler.bind(this);
    this._cropMousedownHandler = this._cropMousedownHandler.bind(this);
    this.imageCanvas.addEventListener('mousemove', this._cropMousemoveHandler);
    window.addEventListener('mouseup', this._cropMouseupHandler);
    this.imageCanvas.addEventListener('mousedown', this._cropMousedownHandler);
  }

  _cropMouseupHandler() {
    this._mouse.down = false;
  }

  _cropMousedownHandler(e) {
    this._mouse.down = true;
    const rect = this.imageCanvas?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    this._mouse.x = (e.pageX - rect.left);
    this._mouse.y = (e.pageY - rect.top);
    this._updateDownStart();
  }

  _updateDownStart() {
    this._mouse.start = [this._mouse.x, this._mouse.y];
    this._select.start = [this._select.x, this._select.y, this._select.w, this._select.h];
  }

  _cropMousemoveHandler(e) {
    // update mouse position in canvas
    const rect = this.imageCanvas?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    this._mouse.x = (e.pageX - rect.left);
    this._mouse.y = (e.pageY - rect.top);

    // update cursor style
    if (!this._mouse.down) {
      // update areas
      this._mouseAreas = this._getMouseArea(this._select);
      this._mouseAreas.push([0, 0, this.imageCanvas.width, this.imageCanvas.height]);
      for (let i = 0; i < this._mouseAreas.length; i++) {
        if (this._checkInPath(this._mouse.x, this._mouse.y, this._mouseAreas[i])) {
          this._mouse.cursorIndex = i;
          this.imageCanvas.style.cursor = this._getMouseStyle();
          break;
        }
      }
    }
    // update select
    if (
      this._mouse.down &&
      this._mouse.cursorIndex < 9
    ) {
      const distanceX = this._mouse.x - this._mouse.start[0];
      const distanceY = this._mouse.y - this._mouse.start[1];
      let selectPosition = this._getSelectionPosition({ distanceX, distanceY });
      selectPosition = this._checkBoundary(selectPosition);
      this._select.x = selectPosition.x;
      this._select.y = selectPosition.y;
      this._select.w = selectPosition.w;
      this._select.h = selectPosition.h;
      this._updateDownStart();
      this.imageCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
      this._drawMask();
      this._drawSelect();
      this._drawImage();
    }

    // check if image 
    this._checkAdujusted();
  }

  _removeCropEventListener() {
    if (this.imageOperation !== CROP || !this.imageCanvas) {
      return;
    }
    this.imageCanvas.removeEventListener('mousemove', this._cropMousemoveHandler);
    this.imageCanvas.removeEventListener('mouseup', this._cropMouseupHandler);
    this.imageCanvas.removeEventListener('mousedown', this._cropMousedownHandler);
    window.removeEventListener('mouseup', this._cropMouseupHandler);
  }

  _checkInPath(x, y, rect) {
    if (!Array.isArray(rect)) {
      const { x, y, w, h } = rect;
      rect = [x, y, w, h];
    }
    const ctx = this.imageCtx;
    ctx.beginPath();
    ctx.rect(...rect);
    const result = ctx.isPointInPath(x, y);
    ctx.closePath();
    return result;
  }

  _getMouseArea(select, size = 20) {
    const { x, y, w, h } = select;
    const halfSize = size / 2;
    return [
      // top left, top right, bottom left, bottom right
      [x - halfSize, y - halfSize, size, size],
      [x + w - halfSize, y - halfSize, size, size],
      [x - halfSize, y + h - halfSize, size, size],
      [x + w - halfSize, y + h - halfSize, size, size],
      // top, bottom, left, right
      [x, y - halfSize, w, size],
      [x, y + h - halfSize, w, size],
      [x - halfSize, y, size, h],
      [x + w - halfSize, y, size, h],
      // whole select
      [x, y, w, h]
    ]
  }

  _getMouseStyle() {
    switch (this._mouse.cursorIndex) {
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

  _getSelectionPosition(distance) {
    const { x: ox, y: oy, w: ow, h: oh } = this._originImageRect;
    let [x, y, w, h] = this._select.start;
    const { distanceX, distanceY } = distance;
    const leftX = Math.max(distanceX, ox - x);
    const topY = Math.max(distanceY, oy - y);
    const rightW = Math.min(distanceX, ox + ow - x - w);
    const bottomH = Math.min(distanceY, oy + oh - y - h);
    switch (this._mouse.cursorIndex) {
      // top left
      case 0:
        x += leftX;
        w -= leftX;
        y += topY;
        h -= topY;
        break;
      // top right
      case 1:
        y += topY;
        w += rightW;
        h -= topY;
        break;
      // bottom left
      case 2:
        x += leftX;
        w -= leftX;
        h += bottomH;
        break;
      // bottom right
      case 3:
        w += rightW;
        h += bottomH;
        break;
      // top
      case 4:
        y += topY;
        h -= topY;
        break;
      // bottom
      case 5:
        h += bottomH;
        break;
      // left
      case 6:
        x += leftX;
        w -= leftX;
        break;
      // right
      case 7:
        w += rightW;
        break;
      // middle
      case 8:
        x += distanceX;
        y += distanceY;
        break;
      default:  
        break;
    }
    this._updateCursor(w, h);
    if (w < 0) {
      x += w;
      w = -w;
    }
    if (h < 0) {
      y += h;
      h = -h;
    }
    return { x, y, w, h };
  }

  _updateCursor(w, h) {
    const oppositeCursorMap = {
      w: {
        0: 1,
        1: 0,
        3: 2,
        2: 3,
        6: 7,
        7: 6
      },
      h: {
        0: 2,
        2: 0,
        1: 3,
        3: 1,
        4: 5,
        5: 4
      },
      wh:  {
        0: 3,
        3: 0,
        1: 2,
        2: 1
      }
    };
    const currentIndex = this._mouse.cursorIndex;
    if (w < 0 && h < 0) {
      this._mouse.cursorIndex = oppositeCursorMap.wh[currentIndex];
    } else if (w < 0) {
      this._mouse.cursorIndex = oppositeCursorMap.w[currentIndex];
    } else if (h < 0) {
      this._mouse.cursorIndex  = oppositeCursorMap.h[currentIndex];
    }
    this.imageCanvas.style.cursor = this._getMouseStyle();
  }

  _checkBoundary(selectPosition) {
    const { x, y, w, h } = this._originImageRect;
    const select = { ...selectPosition };
    select.x < x && (select.x = x);
    select.y < y && (select.y = y);
    select.x + select.w > x + w && (select.x -= select.x + select.w - (x + w));
    select.y + select.h > y + h && (select.y -= select.y + select.h - (y + h));
    return select;
  }

  getCropedImage() {
    return new Promise((resolve) => {
      try {
        const canvas2 = getCroppedCanvas();
        canvas2.toBlob((blob) => {
          const file = new File(
            [blob],
            this.image.name,
            { type: 'image/jpeg' }
          );
          resolve({
            file,
            width: w,
            height: h
          });
        }, 'image/jpeg', 1.0);
      } catch (e) {
        resolve();
      }
    })
  }

  getCroppedCanvas() {
    // draw origin image
    let { x, y, w, h } = this._select;
    const { x: ox, y: oy, w: ow, h: oh } = this._originImageRect;
    const widthRatio = this.operatingImage.width / ow;
    const heightRatio = this.operatingImage.height / oh;
    x = (x - ox) * widthRatio;
    y = (y - oy) * heightRatio;
    w *= widthRatio;
    h *= heightRatio;
    const canvas = document.createElement('canvas');
    canvas.width = this.operatingImage.width;
    canvas.height = this.operatingImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.operatingImage, 0, 0);
    // get cropped part of orign image
    const imageData = ctx.getImageData(x, y, w, h);
    const canvas2 = document.createElement('canvas');
    canvas2.width = w;
    canvas2.height = h;
    const ctx2 = canvas2.getContext('2d');
    ctx2.putImageData(imageData, 0, 0);
    return canvas2;
  }

  /* common methods */
  resetAdjustData() {
    switch (this.imageOperation) {
      case ROTATE:
        this.angle = 0;
        break;
      case CROP:
        this._originImageRect = {};
        this._mouse = { x: 0, y: 0, down: false, cursorIndex: 10, start: [0, 0] };
        this._select = { borderWidth: 4, lineLen: 30, start: [0, 0, 0, 0] };
        this._mouseAreas = [];
        this.canvasPadding = 0;
        this._removeCropEventListener();
        break;
      default:
        break;
    }
    this.imageCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.image = null;
    this.imageOperation = null;
    this.imageCanvas = null;
    this.imageCtx = null;
    this.operatingImage = null;
    this.imageAdjusted = false;
    this.canvasWidth = 300;
    this.canvasHeight = 150;
    this.imageLoading = false;
  }

  _checkAdujusted() {
    switch (this.imageOperation) {
      case CROP:
        const { x: sx, y: sy, w: sw, h: sh } = this._select;
        const { x, y, w, h } = this._originImageRect;
        this.imageAdjusted =  !(
          sx === x &&
          sy === y &&
          sw === w &&
          sh === h
        );
        break;
      case ROTATE:
        this.imageAdjusted = this.angle !== 0;
        break;
      default:
        break;
    }
  }

  _loadImg(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'Anonymous');
      img.src = src;
      img.onload = function () {
        resolve(img);
      };
      img.onerror = function () {
        resolve();
        console.log('Error: image error!');
      };
    });
  }

  _calcImage(canvas, img, padding = 0) {
    const cw = canvas.width - padding * 2;
    const ch = canvas.height - padding * 2;
    const iw = img.width;
    const ih = img.height;
    const cRatio = cw / ch;
    const iRatio = iw / ih;
    let x = 0 + padding;
    let y = 0 + padding;
    let w = cw;
    let h = ch;
    if (cRatio > iRatio) {
      x = (cw - iRatio * ch) / 2;
      w = iRatio * ch;
    } else {
      y = (ch - cw / iRatio) / 2;
      h = cw / iRatio;
    }
    return { x, y, w, h };
  }

  _getCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
}
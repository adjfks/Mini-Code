import * as StackBlur from './stack-blur.js';

const CROP = 'crop';
const ROTATE = 'rotate';
const BLUR = 'blur';
const MOSAIC = 'mosaic';

const CURSOR = {
  MOVE: 8,
  CROSSHAIR: 10,
  GRAB: 11,
  DEFAULT: 9
};

export default class AdjustCanvasExt {
  projectId = null;
  image = null;

  eventElement = null;

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

  // blur & mosaic
  _radius = 1;
  _annotations = [];
  _drawing = false;

  constructor(option) {
    const {
      projectId,
      canvas,
      image,
      operation,
      width,
      height,
      angle,
      radius,
      eventClassName
    } = option;
    this.imageCanvas = canvas;
    this.projectId = projectId;
    this.image = image;
    this.imageOperation = operation;
    this.canvasWidth = width || this.canvasHeight;
    this.canvasHeight = height || this.canvasHeight;
    this.eventElement = this.imageCanvas.closest(`.${eventClassName}`) || this.imageCanvas;
    this.switchOperation(operation, { angle, radius });
  }

  async switchOperation(operation, option = {}) {
    try {
      this.imageLoading = true;
      this.operatingImage = await this._loadImg(this.image.src);
    
      if (!this.imageCanvas) {
        return;
      }

      switch (operation) {
        case CROP:
          this.imageOperation = CROP;
          this._setupCrop(option);
          break;
        case ROTATE:
          this.imageOperation = ROTATE;
          this._setupRotate(option);
          break;
        case BLUR:
        case MOSAIC:
          this._setupBlur({operation, ...option});
          break;
        default:
          break;
      }

      this.removeKeyboardEvent();
      this.setupKeyboardEvent();
      this.imageLoading = false;
    } catch (err) {
      this.imageLoading = false;
      console.error('Something went wrong.');
    }
  }

  /* Blur & Mosaic */
  _setupBlur(option) {
    const {
      radius,
      operation
    } = option;
    this.imageOperation = operation || BLUR;
    this.imageCanvas.width = this.canvasWidth;
    this.imageCanvas.height = this.canvasHeight;
    this.imageCtx = this.imageCanvas.getContext('2d');
    const { x, y, w, h } = this._calcImage(this.imageCanvas, this.operatingImage, this.canvasPadding);
    this._originImageRect = { x, y, w, h };
    // init blur & mosaic
    this.setRadius(radius);
    this._annotations = [];

    // draw image
    this._updateCanvas();

    // update cursor style
    this._mouse.cursorIndex = CURSOR.CROSSHAIR;
    this.imageCanvas.style.cursor = this._getMouseStyle();

    // setup listener
    this._setupBlurEventListener();
  }

  setRadius(radius) {
    radius = +radius;
    this.radius = Number.isNaN(radius) ? 1 : radius;
    if (this._annotations.some(anno => anno.selected)) {
      // update selected annotation's radius
      this._annotations.forEach((anno) => {
        anno.selected && (anno.radius = this.radius);
      });
      this._updateCanvas();
    }
  }

  _setupBlurEventListener() {
    this._blurMousemoveHandler = this._blurMousemoveHandler.bind(this);
    this._blurMousedownHandler = this._blurMousedownHandler.bind(this);
    this._blurMouseupHandler = this._blurMouseupHandler.bind(this);
    this.eventElement.addEventListener('mousedown', this._blurMousedownHandler);
    this.eventElement.addEventListener('mousemove', this._blurMousemoveHandler);
    this.eventElement.addEventListener('mouseup', this._blurMouseupHandler);
  }

  _removeBlurEventLisener() {
    this.eventElement.removeEventListener('mousedown', this._blurMousedownHandler);
    this.eventElement.removeEventListener('mousemove', this._blurMousemoveHandler);
    this.eventElement.removeEventListener('mouseup', this._blurMouseupHandler);
  }

  setupKeyboardEvent() {
    this.eventElement && this.eventElement.addEventListener('keydown', this.keydownHandler.bind(this));
  }

  removeKeyboardEvent() {
    this.eventElement && this.eventElement.removeEventListener('keydown', this.keydownHandler.bind(this));
  }

  // down
  _blurMousedownHandler(e) {
    this._mouse.down = true;
    const { mx, my } = this._updateMousePosition(e);
    this._mouse.start = [mx, my];

    if (this._mouse.cursorIndex === CURSOR.CROSSHAIR) {
      this._drawing = true;
      // init select
      this._initSelect();
    }
  }

  // move
  _blurMousemoveHandler(e) {
    // update mouse position in canvas
    this._updateMousePosition(e);

    if (this._mouse.cursorIndex === CURSOR.CROSSHAIR && this._mouse.down) {
      // update select
      this._updateSelect();
      // draw select
      this._strokeSelect();
    }
  }

  // up
  _blurMouseupHandler(e) {
    this._mouse.down = false;
    const { mx, my } = this._updateMousePosition(e);
    const rect = this._checkSelect(this._select);
    if (
      [BLUR, MOSAIC].includes(this.imageOperation) &&
      this._drawing &&
      rect
    ) {
      const { x, y, w, h } = rect;
      if (
        this._mouse.start[0] === mx &&
        this._mouse.start[1] === my &&
        this._checkInPath(mx, my, this._originImageRect)
      ) {
        this._annotations.forEach(anno => anno.adjust && (anno.selected = false));
        this._annotations = this._annotations.filter(anno => !anno.selected);
      } else {
        this._annotations = this._annotations.filter(anno => (!anno.selected && anno.adjust) || !this._isOverlaping(rect, anno));
        this._annotations.push({ x, y, w, h, type: this.imageOperation, radius: this.radius, selected: true, adjust: false });
      }
    };

    this._updateCanvas();
    this._drawing = false;
    this._checkAdujusted();
  }

  // keyup
  keydownHandler(e) {
    e.stopPropagation();
    switch (e.keyCode) {
      case 46:
      case 8:
        if ([BLUR, MOSAIC].includes(this.imageOperation)) {
          this.removeSeletedAnnotation();
        }
        break;
      default:
        break;
    }
  }

  adjustAllAnnotation() {
    this._annotations.forEach(anno => anno.adjust = true);
    this._checkAdujusted();
    this._updateCanvas();
  }

  removeSeletedAnnotation() {
    if (![BLUR, MOSAIC].includes(this.imageOperation)) {
      return;
    };
    this._annotations = this._annotations.filter(anno => !anno.selected);
    this._updateCanvas();
    this._checkAdujusted();
  }

  // init select when blur
  _initSelect() {
    if (![BLUR, MOSAIC].includes(this.imageOperation)) {
      return;
    };
    if (
      this._mouse.cursorIndex === CURSOR.CROSSHAIR
    ) {
      this._select.x = this._mouse.x;
      this._select.y = this._mouse.y;
      this._select.w = 0;
      this._select.h = 0;
    };
  }

  // update blur cursor
  _updateMoveCursor() {
    if (![BLUR, MOSAIC].includes(this.imageOperation)) {
      return;
    };
    const { x: mx, y: my } = this._mouse;
    const inAnno = this._annotations.some(anno => {
      const { x, y, w, h } = anno;
      return this._checkInPath(mx, my, [x, y, w, h]);
    })
    const inImage = this._checkInPath(mx, my, this._originImageRect);
    // grab: 11 crosshair: 10 default: 9
    this._mouse.cursorIndex =  inAnno ? CURSOR.GRAB : inImage ? CURSOR.CROSSHAIR : CURSOR.DEFAULT;
    this.imageCanvas.style.cursor = this._getMouseStyle();
  }

  // update select when move
  _updateSelect() {
    if (![BLUR, MOSAIC].includes(this.imageOperation)) {
      return;
    };
    const { x: ax, y: ay } = this._select;
    this._select.w = this._mouse.x - ax;
    this._select.h = this._mouse.y - ay;
  }

  _checkSelect(rect = this._select) {
    if (!Array.isArray(rect)) {
      const { x, y, w, h } = rect;
      rect = [x, y, w, h];
    }
    let [x, y, w, h] = rect;
    const { x: ox, y: oy, w: ow, h: oh } = this._originImageRect;
    if (w < 0) {
      x = x + w;
      w = -w;
    }
    if (h < 0) {
      y = y + h;
      h = -h;
    }
    if (x + w <= ox || y + h <= oy || x >= ox + ow || y >= oy + oh) {
      return null;
    }
    if (x < ox) {
      w = x + w - ox;
      x = ox;
    }
    if (y < oy) {
      h = y + h - oy;
      y = oy;
    }
    x + w > ox + ow && (w = ox + ow - x);
    y + h > oy + oh  && (h = oy + oh - y);

    if (rect === this._select) {
      this._select.x = x;
      this._select.y = y;
      this._select.w = w;
      this._select.h = h;
    }
    return { x, y, w, h };
  }

  _isOverlaping(rect1, rect2) {
    if (!Array.isArray(rect1)) {
      const { x, y, w, h } = rect1;
      rect1 = [x, y, w, h];
    }
    if (!Array.isArray(rect2)) {
      const { x, y, w, h } = rect2;
      rect2 = [x, y, w, h];
    }
    const [x1, y1, w1, h1] = rect1;
    const [x2, y2, w2, h2] = rect2;
    const center1 = [(x1 + x1 + w1) / 2, (y1 + y1 + h1) / 2];
    const center2 = [(x2 + x2 + w2) / 2, (y2 + y2 + h2) / 2];
    const points1  = [[x1, y1], [x1, y1 + h1], [x1 + w1, y1], [x1 + w1, y1 + h1]];
    const points2  = [[x2, y2], [x2, y2 + h2], [x2 + w2, y2], [x2 + w2, y2 + h2]];
    return (
      Math.abs(center1[0] - center2[0]) <= Math.abs(w1 / 2 + w2 / 2) &&
      Math.abs(center1[1] - center2[1]) <= Math.abs(h1 / 2 + h2 / 2)
    ) || points1.some(p => this._checkInPath(p[0], p[1], rect2)) ||
    points2.some(p => this._checkInPath(p[0], p[1], rect1));
  }

  // draw blured image
  _strokeSelect() {
    const ctx = this.imageCtx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    // get exist annotation canvas
    this._updateCanvas();
    // draw select
    const { x, y, w, h } = this._select;
    this._drawRect([x, y, w - 1, h - 1]);
  }

  _drawRect(rect, canvas = this.imageCanvas) {
    if (!Array.isArray(rect)) {
      const { x, y, w, h } = rect;
      rect = [x, y, w, h];
    }
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(...rect);
    ctx.lineDashOffset = 5;
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(...rect);
    ctx.restore();
  }

  // draw exist annotations
  _drawExistAnnotation(width, height, drawSelect = true) {
    let canvas = this._getCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.operatingImage, 0, 0, width, height);

    this._annotations.forEach(anno => {
      let { x, y, w, h, type, radius, selected, adjust } = anno;
      const { x: ox, y: oy, w: ow, h: oh } = this._originImageRect;
      const widthRatio = width / ow;
      const heightRatio = height / oh;
      x = Math.floor((x - ox) * widthRatio);
      y = Math.floor((y - oy) * heightRatio);
      w = Math.floor(w * widthRatio);
      h = Math.floor(h * heightRatio);
      radius = Math.floor(radius * widthRatio);
      if (adjust && type === BLUR) {
        StackBlur.canvasRGBA(canvas, x, y, w, h, radius);
      } else if (adjust && type === MOSAIC) {
        canvas = this._localMosaic(canvas, radius, [x, y, w, h]);
      };
      if (drawSelect && selected) {
        this._drawRect([x, y, w - 1, h - 1], canvas);
      };
    });

    return canvas;
  }

  _localMosaic(canvas, size, rect) {
    if (!canvas || !canvas.getContext) {
      return;
    }

    if (!Array.isArray(rect)) {
      const { x, y, w, h } = rect;
      rect = [x, y, w, h];
    }

    let [x, y, w, h] = rect;

    x = Math.floor(x);
    y = Math.floor(y);
    w = Math.floor(w);
    h = Math.floor(h);
    size = Math.floor(size);

    if (!w || !h) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const reslutCanvas = this._getCanvas(width, height);
    const resultCtx = reslutCanvas.getContext('2d');
    // draw background
    resultCtx.drawImage(canvas, 0, 0, width, height);

    // do mosaic
    const offCanvas = this._getCanvas(w, h);
    const offCtx = offCanvas.getContext('2d');
    offCtx.drawImage(canvas, x, y, w, h, 0, 0, w, h);
    const data = offCtx.getImageData(0, 0, w, h);
    for (let py = 0; py < h; py += size) {
      for (let px = 0; px < w; px += size) {
        const index = (py * w + px) * 4
        let cR = data.data[index],
            cG = data.data[index + 1],
            cB = data.data[index + 2];
        offCtx.save();
        offCtx.fillStyle = `rgb(${cR},${cG},${cB})`;
        offCtx.fillRect(px, py, px + size, py + size);
        offCtx.restore();
      }
    }

    resultCtx.drawImage(offCanvas, 0, 0, w, h, x, y, w, h);
    return reslutCanvas;
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
    this.imageLoading = true;
    this.angle = (this.angle + angle) % 360;
    const rotateCanvas = this._rotateImage(this.operatingImage, this.angle);
    this._drawImageCentered(this.imageCanvas, rotateCanvas);
    this._checkAdujusted();
    this.imageLoading = false;
  }

  _rotateImage(img, angle = 0) {
    angle = angle % 360;
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
    this.imageCanvas.width = this.canvasWidth;
    this.imageCanvas.height = this.canvasHeight;
    this.imageCtx = this.imageCanvas.getContext('2d');
    const { x, y, w, h } = this._calcImage(this.imageCanvas, this.operatingImage, this.canvasPadding);
    this._originImageRect = { x, y, w, h };
    this._select = { ...this._select, x, y, w, h };
    // draw
    this._drawMask();
    this._drawSelect();
    this._drawImage('destination-over');
    // setup event listener
    this._setupCropEventListener();
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

  _drawImage(type = 'source-over') {
    const ctx = this.imageCtx;
    const { x, y, w, h } = this._originImageRect;
    ctx.save();
    ctx.globalCompositeOperation = type;
    ctx.drawImage(this.operatingImage, x, y, w, h);
    ctx.restore();
  }

  _setupCropEventListener() {
    this._cropMousemoveHandler = this._cropMousemoveHandler.bind(this);
    this._cropMouseupHandler = this._cropMouseupHandler.bind(this);
    this._cropMousedownHandler = this._cropMousedownHandler.bind(this);
    this.imageCanvas.addEventListener('mousemove', this._cropMousemoveHandler);
    this.eventElement.addEventListener('mouseup', this._cropMouseupHandler);
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
      this._drawImage('destination-over');
    }

    // check if image 
    this._checkAdujusted();
  }

  _removeCropEventListener() {
    if (this.imageOperation !== CROP || !this.imageCanvas) {
      return;
    }
    this.imageCanvas.removeEventListener('mousemove', this._cropMousemoveHandler);
    this.eventElement.removeEventListener('mouseup', this._cropMouseupHandler);
    this.imageCanvas.removeEventListener('mousedown', this._cropMousedownHandler);
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
      case 10:
        return 'crosshair'
      case 11:
        return 'grab'
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
    this._updateDragCursor(w, h);
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

  _updateDragCursor(w, h) {
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

  getAdjustedImage() {
    let canvas2,
      w,
      h;
    switch (this.imageOperation) {
      case CROP:
        const { canvas, width, height } = this.getCroppedCanvas();
        canvas2 = canvas;
        w = width;
        h = height;
        break;
      case BLUR:
      case MOSAIC:
        canvas2 = this._drawExistAnnotation(this.operatingImage.width, this.operatingImage.height, false);
        w = this.operatingImage.width;
        h = this.operatingImage.height
        break;
      default:
        return null;
    }
    return new Promise((resolve) => {
      try {
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
        console.error('Failed, something went wrong.');
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
    return {
      canvas: canvas2,
      width: w,
      height: h
    };
  }

  /* common methods */
  resetAdjustData() {
    switch (this.imageOperation) {
      case ROTATE:
        this.angle = 0;
        break;
      case CROP:
        this._mouseAreas = [];
        this.canvasPadding = 0;
        this._removeCropEventListener();
        break;
      case BLUR:
      case MOSAIC:
        this._annotations = [];
        this.radius = 1;
        this._removeBlurEventLisener();
      default:
        break;
    }
    this._originImageRect = {};
    this._mouse = { x: 0, y: 0, down: false, cursorIndex: CURSOR.DEFAULT, start: [0, 0], ctrl: false };
    this._select = { borderWidth: 4, lineLen: 30, start: [0, 0, 0, 0] };
    this._drawing = false;
    this.imageCtx && this.imageCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.projectId = null;
    this.image = null;
    this.imageOperation = null;
    this.imageCanvas = null;
    this.imageCtx = null;
    this.operatingImage = null;
    this.imageAdjusted = false;
    this.imageLoading = false;
    this.canvasWidth = 300;
    this.canvasHeight = 150;
    this.removeKeyboardEvent();
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
      case BLUR:
      case MOSAIC:
        this.imageAdjusted = !!this._annotations.length && this._annotations.some(anno => anno.adjust);
      default:
        break;
    }
  }

  _loadImg(fileName) {
    return new Promise((resolve) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'Anonymous');
      img.src = fileName;
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
      x += (cw - iRatio * ch) / 2;
      w = iRatio * ch;
    } else {
      y += (ch - cw / iRatio) / 2;
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

  _updateCanvas() {
    if (!this.imageCanvas) {
      return;
    };
    if ([BLUR, MOSAIC].includes(this.imageOperation)) {
      const canvas = this._drawExistAnnotation(this._originImageRect.w, this._originImageRect.h);
      canvas && this._drawImageCentered(this.imageCanvas, canvas);
    };
  }

  _updateMousePosition(e) {
    const rect = this.imageCanvas?.getBoundingClientRect();
    if (e && rect) {
      this._mouse.x = (e.pageX - rect.left);
      this._mouse.y = (e.pageY - rect.top);
    };
    return { mx: this._mouse.x, my: this._mouse.y };
  }
}
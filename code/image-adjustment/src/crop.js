/* 
Crop
*/
// 绘制蒙层
export const drawMask = (ctx, x, y, w, h) => {
  ctx.save();
  ctx.fillStyle = 'rgba(217, 217, 217, 0.3)';
  ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = 'source-atop';
  ctx.restore();
}
// 绘制选择框
export const drawSelect = (ctx, x, y, w, h) => {
  ctx.save();
  // 清空对应区域画布
  ctx.clearRect(x, y, w, h);
  // 绘制边框
  const borderWidth = 3;
  const len = 16;
  ctx.fillStyle = '#000';
  ctx.fillRect(x - borderWidth, y - borderWidth, borderWidth, len + borderWidth);
  ctx.fillRect(x, y - borderWidth, len, borderWidth);
  ctx.fillRect(x + w - len, y - borderWidth, len, borderWidth);
  ctx.fillRect(x + w, y -borderWidth, borderWidth, len + borderWidth);
  ctx.fillRect(x - borderWidth, y + h - len, borderWidth, len);
  ctx.fillRect(x - borderWidth, y + h, len + borderWidth, borderWidth);
  ctx.fillRect(x + w -len, y + h, len + borderWidth, borderWidth);
  ctx.fillRect(x + w, y + h - len, borderWidth, len);
  ctx.fillRect(x - borderWidth, y + (h - len) / 2, borderWidth, len + borderWidth);
  ctx.fillRect(x + w, y + (h - len) / 2, borderWidth, len + borderWidth);
  ctx.restore();
}
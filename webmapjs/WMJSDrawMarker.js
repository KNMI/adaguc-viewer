const WMJSDrawMarker = (ctx, coordx, coordy, fillColor = '#FFF', outlineColor = '#000') => {
  let coord = { x: parseInt(coordx), y: parseInt(coordy) };
  ctx.fillStyle = fillColor;
  ctx.globalAlpha = 1.0;
  ctx.beginPath();
  let topRadius = 9;
  let topHeight = 2.5 * topRadius;
  ctx.arc(coord.x, coord.y - topHeight, topRadius, Math.PI, Math.PI * 2);
  ctx.bezierCurveTo(coord.x + topRadius, coord.y - topHeight, coord.x + (topRadius / 1.6), coord.y - topRadius, coord.x, coord.y);
  ctx.bezierCurveTo(coord.x, coord.y, coord.x - (topRadius / 1.6), coord.y - topRadius, coord.x - topRadius, coord.y - topHeight);
  ctx.stroke();
  ctx.fill();
  /* Fill center circle */
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(coord.x, coord.y - topHeight, topRadius / 2, Math.PI * 2, 0);
  ctx.fill();

  /* Fill marker exact location */
  ctx.fillStyle = outlineColor;
  ctx.beginPath();
  ctx.arc(coord.x, coord.y, 2, Math.PI * 2, 0);
  ctx.fill();
};
export default WMJSDrawMarker;

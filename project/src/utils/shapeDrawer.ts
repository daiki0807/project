import { DrawingObject } from '../types';

export const drawShape = (ctx: CanvasRenderingContext2D, shape: DrawingObject) => {
  ctx.beginPath();
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (shape.type === 'dashed') {
    ctx.setLineDash([5, 5]);
  } else {
    ctx.setLineDash([]);
  }

  switch (shape.type) {
    case 'pen':
    case 'dashed':
      if (shape.points && shape.points.length > 0) {
        const [first, ...rest] = shape.points;
        ctx.moveTo(first.x, first.y);
        rest.forEach(point => ctx.lineTo(point.x, point.y));
      }
      break;

    case 'circle':
      ctx.ellipse(
        shape.x,
        shape.y,
        shape.width / 2,
        shape.height / 2,
        0,
        0,
        Math.PI * 2
      );
      break;

    case 'square':
      ctx.rect(
        shape.x - shape.width / 2,
        shape.y - shape.height / 2,
        shape.width,
        shape.height
      );
      break;

    case 'triangle':
      const halfWidth = shape.width / 2;
      const halfHeight = shape.height / 2;
      ctx.moveTo(shape.x, shape.y - halfHeight);
      ctx.lineTo(shape.x + halfWidth, shape.y + halfHeight);
      ctx.lineTo(shape.x - halfWidth, shape.y + halfHeight);
      ctx.closePath();
      break;

    case 'text':
      ctx.font = '16px sans-serif'; // Adjust as needed
      ctx.fillStyle = shape.color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      if (shape.text) {
        ctx.fillText(shape.text, shape.x, shape.y);
      }
      break;
  }
  
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash pattern
};
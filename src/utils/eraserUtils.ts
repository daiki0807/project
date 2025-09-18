import { DrawingObject, Point } from '../types';

const ERASER_RADIUS = 10;

export const isPointNearLine = (point: Point, line: Point[], threshold: number): boolean => {
  for (let i = 1; i < line.length; i++) {
    const start = line[i - 1];
    const end = line[i];
    
    const a = end.y - start.y;
    const b = start.x - end.x;
    const c = end.x * start.y - start.x * end.y;
    
    const distance = Math.abs(a * point.x + b * point.y + c) / Math.sqrt(a * a + b * b);
    
    const minX = Math.min(start.x, end.x) - threshold;
    const maxX = Math.max(start.x, end.x) + threshold;
    const minY = Math.min(start.y, end.y) - threshold;
    const maxY = Math.max(start.y, end.y) + threshold;
    
    if (distance <= threshold && 
        point.x >= minX && point.x <= maxX && 
        point.y >= minY && point.y <= maxY) {
      return true;
    }
  }
  return false;
};

export const shouldEraseDrawing = (point: Point, drawing: DrawingObject): boolean => {
  switch (drawing.type) {
    case 'pen':
    case 'dashed':
      return drawing.points ? isPointNearLine(point, drawing.points, ERASER_RADIUS) : false;
      
    case 'circle':
    case 'square':
    case 'triangle':
      const dx = point.x - drawing.x;
      const dy = point.y - drawing.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= Math.max(drawing.width, drawing.height) / 2 + ERASER_RADIUS;
      
    default:
      return false;
  }
};
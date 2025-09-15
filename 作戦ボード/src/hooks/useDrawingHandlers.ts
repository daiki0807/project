import { DrawingMode, DrawingElement, DrawingColor } from '../types';
import { drawLine, drawArrow, drawCircle } from '../utils/drawingUtils';

export const useDrawingHandlers = (
  onDrawingComplete: (element: DrawingElement) => void
) => {
  const handleDrawing = (
    mode: DrawingMode,
    startPos: { x: number; y: number },
    endPos: { x: number; y: number },
    color: DrawingColor,
    width: number,
    ctx?: CanvasRenderingContext2D
  ) => {
    const element: DrawingElement = {
      id: Math.random().toString(36).substring(2),
      type: mode,
      startX: startPos.x,
      startY: startPos.y,
      endX: endPos.x,
      endY: endPos.y,
      color,
      width,
    };

    if (ctx) {
      switch (mode) {
        case 'line':
          drawLine(ctx, startPos.x, startPos.y, endPos.x, endPos.y, color, width);
          break;
        case 'arrow':
          drawArrow(ctx, startPos.x, startPos.y, endPos.x, endPos.y, color, width);
          break;
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(endPos.x - startPos.x, 2) + 
            Math.pow(endPos.y - startPos.y, 2)
          );
          drawCircle(ctx, startPos.x, startPos.y, radius, color, width);
          break;
      }
    }

    onDrawingComplete(element);
  };

  return { handleDrawing };
};
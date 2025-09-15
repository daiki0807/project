import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DrawingMode, DrawingElement, DrawingColor } from '../../types';

interface DrawingCanvasProps {
  mode: DrawingMode;
  color: DrawingColor;
  width: number;
  onDrawingComplete: (element: DrawingElement) => void;
  existingDrawings: DrawingElement[];
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  mode,
  color,
  width,
  onDrawingComplete,
  existingDrawings,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number>();

  const getMousePos = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const drawExistingElements = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    existingDrawings.forEach(drawing => {
      if (drawing.type === 'eraser') return;
      
      ctx.beginPath();
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = drawing.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.moveTo(drawing.startX, drawing.startY);
      ctx.lineTo(drawing.endX, drawing.endY);
      ctx.stroke();
    });
  }, [existingDrawings]);

  const draw = useCallback((currentPos: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !isDrawing) return;

    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (mode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = width * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
    }

    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();

    setLastPos(currentPos);
  }, [isDrawing, mode, color, width, lastPos]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode === 'none') return;
    setIsDrawing(true);
    const pos = getMousePos(e);
    setLastPos(pos);
  }, [mode, getMousePos]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || mode === 'none') return;
    const currentPos = getMousePos(e);
    
    requestRef.current = requestAnimationFrame(() => {
      draw(currentPos);
    });
  }, [isDrawing, mode, getMousePos, draw]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || mode === 'none') {
      setIsDrawing(false);
      return;
    }

    const endPos = getMousePos(e);
    if (mode !== 'eraser') {
      onDrawingComplete({
        id: Math.random().toString(36).substring(2),
        type: mode,
        startX: lastPos.x,
        startY: lastPos.y,
        endX: endPos.x,
        endY: endPos.y,
        color,
        width,
      });
    }
    setIsDrawing(false);
  }, [isDrawing, mode, lastPos, color, width, getMousePos, onDrawingComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        drawExistingElements();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [drawExistingElements]);

  useEffect(() => {
    drawExistingElements();
  }, [existingDrawings, drawExistingElements]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDrawing(false)}
    />
  );
};
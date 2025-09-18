import React, { useCallback, useRef, useState, useEffect } from 'react';
import { DrawingObject, DrawingShape, Point } from '../types';
import { smoothPath } from '../utils/drawingUtils';
import { drawShape } from '../utils/shapeDrawer';

interface DrawingCanvasProps {
  drawings: DrawingObject[];
  selectedTool: DrawingShape;
  selectedColor: string;
  onAddDrawing: (drawing: DrawingObject) => void;
  onEraseDrawings: (x: number, y: number) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  drawings,
  selectedTool,
  selectedColor,
  onAddDrawing,
  onEraseDrawings,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const startPoint = useRef<Point | null>(null);
  const [tempShape, setTempShape] = useState<DrawingObject | null>(null);
  const points = useRef<Point[]>([]);
  const lastPoint = useRef<Point | null>(null);

  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawings.forEach(drawing => {
      drawShape(ctx, drawing);
    });

    if (tempShape) {
      drawShape(ctx, tempShape);
    }
  }, [drawings, tempShape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!selectedTool || (e.target as HTMLElement).closest('.player')) return;
    e.preventDefault();
    
    const point = getCanvasPoint(e);
    isDrawing.current = true;
    startPoint.current = point;
    points.current = [point];
    lastPoint.current = point;

    if (selectedTool === 'eraser') {
      onEraseDrawings(point.x, point.y);
    } else if (selectedTool === 'pen' || selectedTool === 'dashed') {
      setTempShape({
        id: 'temp',
        type: selectedTool,
        points: [point],
        color: selectedColor,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    }
  }, [selectedTool, selectedColor, getCanvasPoint, onEraseDrawings]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!selectedTool || !isDrawing.current || !startPoint.current) return;
    e.preventDefault();

    const currentPoint = getCanvasPoint(e);

    if (selectedTool === 'eraser') {
      if (lastPoint.current) {
        const dx = currentPoint.x - lastPoint.current.x;
        const dy = currentPoint.y - lastPoint.current.y;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        
        if (steps > 0) {
          for (let i = 0; i <= steps; i++) {
            const x = lastPoint.current.x + (dx * i / steps);
            const y = lastPoint.current.y + (dy * i / steps);
            onEraseDrawings(x, y);
          }
        }
      }
      lastPoint.current = currentPoint;
    } else if (selectedTool === 'pen' || selectedTool === 'dashed') {
      points.current.push(currentPoint);
      setTempShape({
        id: 'temp',
        type: selectedTool,
        points: smoothPath(points.current),
        color: selectedColor,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    } else {
      const width = Math.abs(currentPoint.x - startPoint.current.x);
      const height = Math.abs(currentPoint.y - startPoint.current.y);
      const x = Math.min(currentPoint.x, startPoint.current.x) + width / 2;
      const y = Math.min(currentPoint.y, startPoint.current.y) + height / 2;

      setTempShape({
        id: 'temp',
        type: selectedTool,
        x,
        y,
        width,
        height,
        color: selectedColor,
      });
    }
  }, [selectedTool, selectedColor, getCanvasPoint, onEraseDrawings]);

  const handleEnd = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!selectedTool || !isDrawing.current || !startPoint.current) return;
    e.preventDefault();

    if ((selectedTool === 'pen' || selectedTool === 'dashed') && points.current.length > 1) {
      onAddDrawing({
        id: Math.random().toString(36).substring(2),
        type: selectedTool,
        points: smoothPath(points.current),
        color: selectedColor,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    } else if (selectedTool !== 'eraser' && tempShape) {
      onAddDrawing({
        ...tempShape,
        id: Math.random().toString(36).substring(2),
      });
    }

    isDrawing.current = false;
    startPoint.current = null;
    lastPoint.current = null;
    points.current = [];
    setTempShape(null);
  }, [selectedTool, selectedColor, onAddDrawing, tempShape]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${
        selectedTool ? 'cursor-crosshair' : 'cursor-default'
      }`}
      style={{ zIndex: 1 }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    />
  );
};
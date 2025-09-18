import React from 'react';
import { DrawingElement } from '../types';

export const renderDrawings = (drawings: DrawingElement[]) => {
  return drawings.map((drawing) => {
    if (drawing.type === 'eraser') return null;

    const key = drawing.id;
    const style = {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none' as const,
    };

    return (
      <svg key={key} style={style}>
        {drawing.type === 'line' && (
          <line
            x1={drawing.startX}
            y1={drawing.startY}
            x2={drawing.endX}
            y2={drawing.endY}
            stroke={drawing.color}
            strokeWidth={drawing.width}
          />
        )}
        {drawing.type === 'arrow' && (
          <g>
            <line
              x1={drawing.startX}
              y1={drawing.startY}
              x2={drawing.endX}
              y2={drawing.endY}
              stroke={drawing.color}
              strokeWidth={drawing.width}
            />
            <polygon
              points={`${drawing.endX},${drawing.endY} 
                      ${drawing.endX - 10},${drawing.endY - 5} 
                      ${drawing.endX - 10},${drawing.endY + 5}`}
              fill={drawing.color}
              transform={`rotate(${Math.atan2(drawing.endY - drawing.startY, drawing.endX - drawing.startX) * 180 / Math.PI} ${drawing.endX} ${drawing.endY})`}
            />
          </g>
        )}
        {drawing.type === 'circle' && (
          <circle
            cx={drawing.startX}
            cy={drawing.startY}
            r={Math.sqrt(
              Math.pow(drawing.endX - drawing.startX, 2) +
              Math.pow(drawing.endY - drawing.startY, 2)
            )}
            stroke={drawing.color}
            strokeWidth={drawing.width}
            fill="none"
          />
        )}
      </svg>
    );
  });
};
import React, { useRef } from 'react';
import { PlayerShape, PlayerTeam } from '../types';

interface PlayerProps {
  id: string;
  x: number;
  y: number;
  team: PlayerTeam;
  shape: PlayerShape;
  number?: number;
  onMove: (id: string, x: number, y: number) => void;
}

export const Player: React.FC<PlayerProps> = ({
  id,
  x,
  y,
  team,
  shape,
  number,
  onMove,
}) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const touchOffset = useRef({ x: 0, y: 0 });

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(playerRef.current, e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      touchOffset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging.current || !playerRef.current) return;

    const touch = e.touches[0];
    const parent = playerRef.current.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const x = touch.clientX - rect.left - touchOffset.current.x + (playerRef.current.offsetWidth / 2);
    const y = touch.clientY - rect.top - touchOffset.current.y + (playerRef.current.offsetHeight / 2);

    // 範囲内に制限
    const boundedX = Math.max(0, Math.min(rect.width, x));
    const boundedY = Math.max(0, Math.min(rect.height, y));

    onMove(id, boundedX, boundedY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = false;
  };

  const teamColors = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    ball: 'bg-white border-2 border-black',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
    triangle: 'clip-path-triangle',
  };

  return (
    <div
      ref={playerRef}
      draggable
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`player absolute w-6 h-6 sm:w-8 sm:h-8 ${teamColors[team]} ${shapeClasses[shape]} cursor-move flex items-center justify-center ${team === 'ball' ? 'text-black' : 'text-white'} font-bold select-none touch-none text-xs sm:text-base`}
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        touchAction: 'none'
      }}
    >
      {team === 'ball' ? 'ボ' : number}
    </div>
  );
};
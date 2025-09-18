import React from 'react';

export const BaseballField: React.FC = () => {
  return (
    <div className="w-full h-full relative bg-white">
      <div className="absolute inset-4">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          stroke="black"
          strokeWidth="0.5"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Vertical foul line */}
          <line x1="10" y1="90" x2="10" y2="10" />
          
          {/* Horizontal foul line */}
          <line x1="10" y1="90" x2="90" y2="90" />

          {/* Triangle at the corner */}
          <path
            d="M 10,90 L 25,90 L 10,75 Z"
            fill="black"
            stroke="none"
          />
        </svg>
      </div>
    </div>
  );
};
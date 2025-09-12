import React from 'react';

export const Basketball3Court: React.FC = () => {
  return (
    <div className="w-full h-full relative bg-white rounded-lg">
      <div className="absolute inset-4">
        <svg 
          viewBox="0 0 100 50" 
          className="w-full h-full"
          stroke="black"
          strokeWidth="0.5"
          fill="none"
        >
          {/* Court outline */}
          <rect x="0" y="0" width="100" height="50" />
          
          {/* Center line */}
          <line x1="50" y1="0" x2="50" y2="50" />
          
          {/* Center circle */}
          <circle cx="50" cy="25" r="8" />
          
          {/* Left key - Trapezoid and semicircle */}
          <path d="M 0,10 L 15,15 L 15,35 L 0,40 Z" />
          <path d="M 15,15 A 10,10 0 0 1 15,35" />
          
          {/* Right key - Trapezoid and semicircle */}
          <path d="M 100,10 L 85,15 L 85,35 L 100,40 Z" />
          <path d="M 85,15 A 10,10 0 0 0 85,35" />
        </svg>
      </div>
    </div>
  );
};
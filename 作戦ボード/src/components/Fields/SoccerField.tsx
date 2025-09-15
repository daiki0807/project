import React from 'react';

export const SoccerField: React.FC = () => {
  return (
    <div className="w-full h-full relative bg-green-200 rounded-lg">
      {/* Field lines */}
      <div className="absolute inset-4 border-2 border-white">
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full" />
        {/* Center line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white" />
        {/* Penalty areas */}
        <div className="absolute top-1/4 left-0 w-24 h-1/2 border-2 border-l-0 border-white" />
        <div className="absolute top-1/4 right-0 w-24 h-1/2 border-2 border-r-0 border-white" />
      </div>
    </div>
  );
};
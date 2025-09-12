import React from 'react';

export const BasketballCourt: React.FC = () => {
  return (
    <div className="w-full h-full relative bg-orange-100 rounded-lg">
      {/* Court lines */}
      <div className="absolute inset-4 border-2 border-orange-500">
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-orange-500 rounded-full" />
        {/* Center line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-orange-500" />
        {/* Three point lines */}
        <div className="absolute top-1/4 left-0 w-32 h-1/2 border-2 border-l-0 border-orange-500 rounded-r-full" />
        <div className="absolute top-1/4 right-0 w-32 h-1/2 border-2 border-r-0 border-orange-500 rounded-l-full" />
      </div>
    </div>
  );
};
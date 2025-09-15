import React from 'react';

export const Court2: React.FC = () => {
  return (
    <div className="w-full h-full relative bg-white rounded-lg">
      <div className="absolute inset-4">
        <div className="w-full h-full border-4 border-black rounded-lg grid grid-cols-2">
          <div className="border-r-4 border-black" />
          <div />
        </div>
      </div>
    </div>
  );
};
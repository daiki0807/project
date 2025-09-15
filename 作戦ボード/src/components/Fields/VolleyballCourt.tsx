import React from 'react';

export const VolleyballCourt: React.FC = () => {
  return (
    <div className="w-full h-full relative bg-yellow-50 rounded-lg">
      {/* Court lines */}
      <div className="absolute inset-4 border-2 border-yellow-600">
        {/* Net line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-yellow-600" />
        {/* Attack lines */}
        <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-yellow-600" />
        <div className="absolute top-0 bottom-0 right-1/3 w-0.5 bg-yellow-600" />
      </div>
    </div>
  );
};
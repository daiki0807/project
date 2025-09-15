import { useState } from 'react';
import { DrawingShape } from '../types';

export const useDrawing = () => {
  const [selectedTool, setSelectedTool] = useState<DrawingShape>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');

  return {
    selectedTool,
    selectedColor,
    setSelectedTool,
    setSelectedColor,
  };
};
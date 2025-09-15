import React from 'react';
import { Circle, Square, Triangle, Eraser, Pen, MousePointer, Minus, Type } from 'lucide-react';
import { DrawingShape } from '../types';

interface DrawingToolsProps {
  selectedTool: DrawingShape | null;
  onToolChange: (tool: DrawingShape | null) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const DrawingTools: React.FC<DrawingToolsProps> = ({
  selectedTool,
  onToolChange,
  selectedColor,
  onColorChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">図形ツール</h3>
        <button
          onClick={() => onToolChange(selectedTool ? null : 'pen')}
          className={`p-2 rounded-lg flex items-center gap-2 ${
            selectedTool ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title={selectedTool ? 'ツールを無効化' : 'ツールを有効化'}
        >
          <MousePointer className="w-5 h-5" />
          <span className="text-sm">{selectedTool ? 'オフ' : 'オン'}</span>
        </button>
      </div>
      
      <div className={`grid grid-cols-3 gap-2 mb-4 ${!selectedTool ? 'opacity-50 pointer-events-none' : ''}`}>
        <button
          onClick={() => onToolChange('pen')}
          className={`p-2 rounded-lg flex items-center justify-center ${
            selectedTool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="ペン"
        >
          <Pen className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToolChange('circle')}
          className={`p-2 rounded-lg flex items-center justify-center ${
            selectedTool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="円"
        >
          <Circle className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToolChange('square')}
          className={`p-2 rounded-lg flex items-center justify-center ${
            selectedTool === 'square' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="四角形"
        >
          <Square className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToolChange('triangle')}
          className={`p-2 rounded-lg flex items-center justify-center ${
            selectedTool === 'triangle' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="三角形"
        >
          <Triangle className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToolChange('dashed')}
          className={`p-2 rounded-lg flex items-center justify-center ${
            selectedTool === 'dashed' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="点線"
        >
          <Minus className="w-5 h-5" strokeDasharray="4" />
        </button>
        <button
          onClick={() => onToolChange('eraser')}
          className={`p-2 rounded-lg flex items-center justify-center ${
            selectedTool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="消しゴム"
        >
          <Eraser className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToolChange('text')}
          className={`p-2 rounded-lg flex items-center justify-center ${
            selectedTool === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="テキスト"
        >
          <Type className="w-5 h-5" />
        </button>
      </div>

      <div className={`space-y-2 ${!selectedTool ? 'opacity-50 pointer-events-none' : ''}`}>
        <label className="block text-sm font-medium">色</label>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-full h-8 rounded cursor-pointer"
          disabled={selectedTool === 'eraser'}
        />
      </div>
    </div>
  );
};
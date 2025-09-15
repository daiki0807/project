import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

interface HistoryControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        title="元に戻る"
      >
        <Undo2 className="w-5 h-5" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        title="やり直し"
      >
        <Redo2 className="w-5 h-5" />
      </button>
    </div>
  );
};
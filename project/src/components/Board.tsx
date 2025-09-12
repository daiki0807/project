import React, { useRef, useEffect } from 'react';
import { useBoard } from '../hooks/useBoard';
import { SoccerField, BasketballCourt, VolleyballCourt, BaseballField, Court, Court2, Basketball2Court, Basketball3Court } from './Fields';
import { Player } from './Player';
import { TeamControls } from './TeamControls';
import { DrawingTools } from './DrawingTools';
import { DrawingCanvas } from './DrawingCanvas';
import { useDrawing } from '../hooks/useDrawing';
import { HistoryControls } from './HistoryControls';
import { ExportButton } from './ExportButton';
import { exportToPDF } from '../utils/pdfExport';

export const Board: React.FC = () => {
  const fieldRef = useRef<HTMLDivElement>(null);
  
  const {
    selectedField,
    setSelectedField,
    players,
    addPlayer,
    removePlayer,
    movePlayer,
    reset,
    teamCounts,
    drawings,
    addDrawing,
    eraseDrawingsAt,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useBoard();

  const {
    selectedTool,
    selectedColor,
    setSelectedTool,
    setSelectedColor,
  } = useDrawing();

  useEffect(() => {
    const updateFieldSize = () => {
      if (fieldRef.current) {
        const parent = fieldRef.current.parentElement;
        if (parent) {
          const width = parent.clientWidth;
          const height = width * 0.75; // 4:3のアスペクト比を維持
          fieldRef.current.style.height = `${height}px`;
        }
      }
    };

    updateFieldSize();
    window.addEventListener('resize', updateFieldSize);
    return () => window.removeEventListener('resize', updateFieldSize);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    movePlayer(id, x, y);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-2 sm:p-4">
      <div className="w-full lg:w-3/4">
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['soccer', 'basketball', 'basketball2', 'basketball3', 'volleyball', 'baseball', 'court', 'court2'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedField(type)}
                className={`px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base rounded-lg transition-colors ${
                  selectedField === type ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {type === 'soccer' ? 'サッカー' :
                 type === 'basketball' ? 'バスケ' :
                 type === 'basketball2' ? 'バスケ2' :
                 type === 'basketball3' ? 'バスケ3' :
                 type === 'volleyball' ? 'バレー' :
                 type === 'baseball' ? '野球' :
                 type === 'court' ? 'コート' : 'コート2'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <HistoryControls
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
            <div className="flex items-center gap-2">
              <ExportButton onClick={() => fieldRef.current && exportToPDF(fieldRef.current, selectedField)} />
              <button
                onClick={reset}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-xs sm:text-base whitespace-nowrap"
              >
                リセット
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <div 
            ref={fieldRef}
            className="relative aspect-[4/3] rounded-lg overflow-hidden touch-none"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onTouchMove={handleTouchMove}
          >
            {selectedField === 'soccer' && <SoccerField />}
            {selectedField === 'basketball' && <BasketballCourt />}
            {selectedField === 'basketball2' && <Basketball2Court />}
            {selectedField === 'basketball3' && <Basketball3Court />}
            {selectedField === 'volleyball' && <VolleyballCourt />}
            {selectedField === 'baseball' && <BaseballField />}
            {selectedField === 'court' && <Court />}
            {selectedField === 'court2' && <Court2 />}
            
            <DrawingCanvas
              drawings={drawings}
              selectedTool={selectedTool}
              selectedColor={selectedColor}
              onAddDrawing={addDrawing}
              onEraseDrawings={eraseDrawingsAt}
            />
            
            {players.map((player) => (
              <Player
                key={player.id}
                {...player}
                onMove={movePlayer}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/4 space-y-4">
        <DrawingTools
          selectedTool={selectedTool}
          onToolChange={setSelectedTool}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />
        <TeamControls 
          onAddPlayer={addPlayer} 
          onRemovePlayer={removePlayer}
          teamCounts={teamCounts}
        />
      </div>
    </div>
  );
};
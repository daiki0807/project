import React from 'react';
import { PlayerTeam, PlayerShape } from '../types';
import { isMaxPlayersReached } from '../utils/playerPosition';

interface TeamControlsProps {
  onAddPlayer: (team: PlayerTeam, shape: PlayerShape, number?: number) => void;
  onRemovePlayer: (team: PlayerTeam) => void;
  teamCounts: Record<PlayerTeam, number>;
}

export const TeamControls: React.FC<TeamControlsProps> = ({ 
  onAddPlayer, 
  onRemovePlayer,
  teamCounts 
}) => {
  const handleAddPlayer = (team: PlayerTeam) => {
    if (!isMaxPlayersReached(teamCounts[team])) {
      onAddPlayer(team, 'circle', team === 'ball' ? undefined : teamCounts[team] + 1);
    }
  };

  return (
    <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
      <h3 className="font-bold mb-4 text-sm sm:text-base">チーム設定</h3>
      <div className="space-y-2 sm:space-y-3">
        {(['red', 'blue', 'yellow', 'ball'] as PlayerTeam[]).map(team => (
          <div key={team} className="flex items-center justify-between">
            <span className="text-xs sm:text-base whitespace-nowrap">
              {team === 'red' ? '赤チーム' : 
               team === 'blue' ? '青チーム' : 
               team === 'yellow' ? '黄チーム' : 'ボール'}
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onRemovePlayer(team)}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-100 flex items-center justify-center disabled:opacity-50 text-xs sm:text-base"
                disabled={teamCounts[team] === 0}
              >
                -
              </button>
              <span className="w-5 sm:w-8 text-center text-xs sm:text-base">{teamCounts[team]}</span>
              <button
                onClick={() => handleAddPlayer(team)}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-100 flex items-center justify-center disabled:opacity-50 text-xs sm:text-base"
                disabled={isMaxPlayersReached(teamCounts[team])}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mt-2">※1チーム最大10個まで</p>
    </div>
  );
};
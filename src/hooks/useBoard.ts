import { useCallback } from 'react';
import { PlayerTeam, PlayerShape, FieldType } from '../types';
import { calculateInitialPosition } from '../utils/playerPosition';
import { useHistory } from './useHistory';
import { shouldEraseDrawing } from '../utils/eraserUtils';

interface Player {
  id: string;
  x: number;
  y: number;
  team: PlayerTeam;
  shape: PlayerShape;
  number?: number;
}

interface BoardState {
  selectedField: FieldType;
  players: Player[];
  teamCounts: Record<PlayerTeam, number>;
  drawings: any[];
}

export const useBoard = () => {
  const {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<BoardState>({
    selectedField: 'soccer',
    players: [],
    teamCounts: { red: 0, blue: 0, yellow: 0, ball: 0 },
    drawings: [],
  });

  const { selectedField, players, teamCounts, drawings } = state;

  const setSelectedField = useCallback((field: FieldType) => {
    setState({ ...state, selectedField: field });
  }, [state, setState]);

  const addPlayer = useCallback((team: PlayerTeam, shape: PlayerShape, number?: number) => {
    const position = calculateInitialPosition(team, teamCounts[team], selectedField);
    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      ...position,
      team,
      shape,
      number,
    };

    setState({
      ...state,
      players: [...players, newPlayer],
      teamCounts: {
        ...teamCounts,
        [team]: teamCounts[team] + 1
      }
    });
  }, [state, setState, selectedField, teamCounts, players]);

  const removePlayer = useCallback((team: PlayerTeam) => {
    if (teamCounts[team] > 0) {
      const teamPlayers = players.filter(p => p.team === team);
      const lastPlayer = teamPlayers[teamPlayers.length - 1];
      
      setState({
        ...state,
        players: players.filter(p => p.id !== lastPlayer.id),
        teamCounts: {
          ...teamCounts,
          [team]: teamCounts[team] - 1
        }
      });
    }
  }, [state, setState, players, teamCounts]);

  const movePlayer = useCallback((id: string, x: number, y: number) => {
    setState({
      ...state,
      players: players.map(p =>
        p.id === id ? { ...p, x, y } : p
      )
    });
  }, [state, setState, players]);

  const reset = useCallback(() => {
    if (window.confirm('本当にリセットしますか？')) {
      setState({
        ...state,
        players: [],
        teamCounts: { red: 0, blue: 0, yellow: 0, ball: 0 },
        drawings: [],
      });
    }
  }, [state, setState]);

  const addDrawing = useCallback((drawing: any) => {
    setState({
      ...state,
      drawings: [...drawings, drawing],
    });
  }, [state, setState, drawings]);

  const eraseDrawingsAt = useCallback((x: number, y: number) => {
    setState({
      ...state,
      drawings: drawings.filter(drawing => !shouldEraseDrawing({ x, y }, drawing)),
    });
  }, [state, setState, drawings]);

  return {
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
  };
};
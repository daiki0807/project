import { PlayerTeam, FieldType } from '../types';

interface Position {
  x: number;
  y: number;
}

const FIELD_PADDING = 32; // px
const PLAYER_SPACING = 48; // px
const MAX_PLAYERS_PER_TEAM = 10;

export const calculateInitialPosition = (
  team: PlayerTeam,
  playerIndex: number,
  fieldType: FieldType
): Position => {
  // フィールドの基準サイズ
  const baseWidth = 600;
  const baseHeight = 400;

  // チームごとの相対的な位置（0-1の範囲）
  const relativePositions: Record<PlayerTeam, Position> = {
    red: { x: 0.25, y: 0.5 },    // 左側
    blue: { x: 0.5, y: 0.5 },    // 中央
    yellow: { x: 0.75, y: 0.5 }, // 右側
    ball: { x: 0.5, y: 0.75 },   // ボールは下側中央
  };

  if (team === 'ball') {
    return {
      x: baseWidth * relativePositions.ball.x,
      y: baseHeight * relativePositions.ball.y,
    };
  }

  // 1行あたりの最大プレイヤー数を3人に制限
  const playersPerRow = 3;
  const row = Math.floor(playerIndex / playersPerRow);
  const col = playerIndex % playersPerRow;

  const base = relativePositions[team];
  return {
    x: baseWidth * base.x + (col * PLAYER_SPACING - PLAYER_SPACING),
    y: baseHeight * base.y + (row * PLAYER_SPACING - PLAYER_SPACING),
  };
};

export const isMaxPlayersReached = (currentCount: number): boolean => {
  return currentCount >= MAX_PLAYERS_PER_TEAM;
};
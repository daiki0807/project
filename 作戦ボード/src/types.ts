export type PlayerTeam = 'red' | 'blue' | 'yellow' | 'ball';
export type PlayerShape = 'circle' | 'square' | 'triangle';
export type FieldType = 'soccer' | 'basketball' | 'volleyball' | 'baseball' | 'court' | 'court2' | 'basketball2' | 'basketball3';

export type DrawingShape = 'circle' | 'square' | 'triangle' | 'eraser' | 'pen' | 'dashed' | 'text' | null;

export interface Point {
  x: number;
  y: number;
}

export interface DrawingObject {
  id: string;
  type: Exclude<DrawingShape, null>;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points?: Point[];
  isDashed?: boolean;
  text?: string;
}
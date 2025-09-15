import { Point } from '../types';

// パスの平滑化処理
export const smoothPath = (points: Point[]): Point[] => {
  if (points.length < 3) return points;

  const smoothed: Point[] = [];
  
  // 最初の点は保持
  smoothed.push(points[0]);

  // 中間点を平滑化
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const current = points[i];
    const next = points[i + 1];

    // 3点の平均を取る
    smoothed.push({
      x: (prev.x + current.x + next.x) / 3,
      y: (prev.y + current.y + next.y) / 3,
    });
  }

  // 最後の点は保持
  smoothed.push(points[points.length - 1]);

  return smoothed;
};
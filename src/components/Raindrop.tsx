import type { CSSProperties } from 'react';
import type { DropState } from '../types';

interface RaindropProps {
  drop: DropState;
  fallDuration: number;
  onClick: (dropId: string) => void;
}

function getHorizontalPosition(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return 10 + (Math.abs(hash) % 81);
}

export function Raindrop({ drop, fallDuration, onClick }: RaindropProps) {
  const horizontalPos = getHorizontalPosition(drop.id);

  const classList = [
    'raindrop',
    drop.status === 'falling' && 'raindrop-falling',
    drop.status === 'popped' && 'raindrop-pop',
    drop.status === 'splashed' && 'raindrop-splash',
    drop.status === 'wrong' && 'raindrop-wrong',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classList}
      style={{
        '--fall-duration': `${fallDuration}ms`,
        left: `${horizontalPos}%`,
      } as CSSProperties}
      onClick={() => onClick(drop.id)}
    >
      {drop.correctCompound}
    </div>
  );
}

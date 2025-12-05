import type { Direction } from '@/types/game';
import { cn } from '@/lib/utils';

interface DPadProps {
  onDirectionStart: (direction: Direction) => void;
  onDirectionEnd: (direction: Direction) => void;
  activeDirections: Set<Direction>;
}

export function DPad({ onDirectionStart, onDirectionEnd, activeDirections }: DPadProps) {
  const handlePointerDown = (direction: Direction) => (e: React.PointerEvent) => {
    e.preventDefault();
    onDirectionStart(direction);
  };

  const handlePointerUp = (direction: Direction) => (e: React.PointerEvent) => {
    e.preventDefault();
    onDirectionEnd(direction);
  };

  const handlePointerLeave = (direction: Direction) => (e: React.PointerEvent) => {
    e.preventDefault();
    if (activeDirections.has(direction)) {
      onDirectionEnd(direction);
    }
  };

  const buttonClass = (direction: Direction) =>
    cn(
      'w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center',
      'transition-all duration-100 touch-none select-none',
      'bg-[#2a2a3e] border-2 border-[#4a4a6a]',
      'active:bg-[#4a4a6a]',
      activeDirections.has(direction) && 'bg-[#ffd700] border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.5)]'
    );

  const arrowClass = (direction: Direction) =>
    cn(
      'font-retro text-lg sm:text-xl transition-colors',
      activeDirections.has(direction) ? 'text-[#0f0f1e]' : 'text-[#ffd700]'
    );

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Retro D-pad container */}
      <div className="bg-[#0f0f1e] border-2 border-[#ffd700] p-1 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
        <div className="grid grid-cols-3 gap-0.5">
          {/* Empty top-left */}
          <div className="w-12 h-12 sm:w-14 sm:h-14" />

          {/* Up button */}
          <button
            className={buttonClass('up')}
            onPointerDown={handlePointerDown('up')}
            onPointerUp={handlePointerUp('up')}
            onPointerLeave={handlePointerLeave('up')}
          >
            <span className={arrowClass('up')}>▲</span>
          </button>

          {/* Empty top-right */}
          <div className="w-12 h-12 sm:w-14 sm:h-14" />

          {/* Left button */}
          <button
            className={buttonClass('left')}
            onPointerDown={handlePointerDown('left')}
            onPointerUp={handlePointerUp('left')}
            onPointerLeave={handlePointerLeave('left')}
          >
            <span className={arrowClass('left')}>◄</span>
          </button>

          {/* Center */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#1a1a2e] border-2 border-[#4a4a6a]">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#4a4a6a] rounded-sm" />
          </div>

          {/* Right button */}
          <button
            className={buttonClass('right')}
            onPointerDown={handlePointerDown('right')}
            onPointerUp={handlePointerUp('right')}
            onPointerLeave={handlePointerLeave('right')}
          >
            <span className={arrowClass('right')}>►</span>
          </button>

          {/* Empty bottom-left */}
          <div className="w-12 h-12 sm:w-14 sm:h-14" />

          {/* Down button */}
          <button
            className={buttonClass('down')}
            onPointerDown={handlePointerDown('down')}
            onPointerUp={handlePointerUp('down')}
            onPointerLeave={handlePointerLeave('down')}
          >
            <span className={arrowClass('down')}>▼</span>
          </button>

          {/* Empty bottom-right */}
          <div className="w-12 h-12 sm:w-14 sm:h-14" />
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';

interface PixelCharacterProps {
  color?: string;
  size?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  isMoving?: boolean;
  variant?: 'player' | 'villager';
}

// Pixel art character using CSS
export function PixelCharacter({
  color = '#ffd700',
  size = 32,
  direction = 'down',
  isMoving = false,
  variant = 'player',
}: PixelCharacterProps) {
  const pixelSize = size / 16; // Base unit for pixel art

  return (
    <div
      className={cn(
        'relative',
        isMoving && 'animate-bounce'
      )}
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
      }}
    >
      {/* Character body using CSS pixels */}
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Hair */}
        <rect x="5" y="1" width="6" height="2" fill={variant === 'player' ? '#8B4513' : '#654321'} />
        <rect x="4" y="2" width="8" height="2" fill={variant === 'player' ? '#8B4513' : '#654321'} />

        {/* Face */}
        <rect x="5" y="3" width="6" height="4" fill="#FFDAB9" />
        <rect x="4" y="4" width="8" height="2" fill="#FFDAB9" />

        {/* Eyes */}
        <rect x="6" y="4" width="1" height="1" fill="#000" />
        <rect x="9" y="4" width="1" height="1" fill="#000" />

        {/* Mouth */}
        <rect x="7" y="6" width="2" height="1" fill="#000" />

        {/* Body/Tunic */}
        <rect x="4" y="7" width="8" height="5" fill={color} />
        <rect x="5" y="7" width="6" height="1" fill={color} />

        {/* Belt */}
        <rect x="4" y="9" width="8" height="1" fill="#654321" />
        <rect x="7" y="9" width="2" height="1" fill="#ffd700" />

        {/* Arms */}
        <rect x="2" y="8" width="2" height="3" fill="#FFDAB9" />
        <rect x="12" y="8" width="2" height="3" fill="#FFDAB9" />

        {/* Legs */}
        <rect x="5" y="12" width="2" height="3" fill="#8B4513" />
        <rect x="9" y="12" width="2" height="3" fill="#8B4513" />

        {/* Feet */}
        <rect x="4" y="14" width="3" height="2" fill="#4a3728" />
        <rect x="9" y="14" width="3" height="2" fill="#4a3728" />
      </svg>

      {/* Direction indicator (cape flow or facing) */}
      {direction === 'left' && (
        <div
          className="absolute top-1/3 -right-1"
          style={{
            width: pixelSize * 2,
            height: pixelSize * 4,
            backgroundColor: color,
            opacity: 0.5,
          }}
        />
      )}
      {direction === 'right' && (
        <div
          className="absolute top-1/3 -left-1"
          style={{
            width: pixelSize * 2,
            height: pixelSize * 4,
            backgroundColor: color,
            opacity: 0.5,
          }}
        />
      )}
    </div>
  );
}

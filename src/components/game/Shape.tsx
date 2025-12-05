import type { ShapeType } from '@/types/game';

interface ShapeProps {
  type: ShapeType;
  color: string;
  size: number;
}

export function Shape({ type, color, size }: ShapeProps) {
  const renderShape = () => {
    switch (type) {
      case 'circle':
        return (
          <div
            className="rounded-full shadow-lg"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              boxShadow: `0 0 20px ${color}80`,
            }}
          />
        );

      case 'square':
        return (
          <div
            className="rounded-sm shadow-lg"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              boxShadow: `0 0 20px ${color}80`,
            }}
          />
        );

      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
              filter: `drop-shadow(0 0 10px ${color}80)`,
            }}
          />
        );

      case 'star':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={color}
            style={{ filter: `drop-shadow(0 0 10px ${color}80)` }}
          >
            <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
          </svg>
        );

      case 'hexagon':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={color}
            style={{ filter: `drop-shadow(0 0 10px ${color}80)` }}
          >
            <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" />
          </svg>
        );

      case 'diamond':
        return (
          <div
            style={{
              width: size * 0.7,
              height: size * 0.7,
              backgroundColor: color,
              transform: 'rotate(45deg)',
              boxShadow: `0 0 20px ${color}80`,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderShape()}
    </div>
  );
}

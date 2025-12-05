import { useEffect, useCallback, useRef } from 'react';
import type { Direction } from '@/types/game';

interface UseGameControlsProps {
  onMove: (direction: Direction) => void;
}

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
};

export function useGameControls({ onMove }: UseGameControlsProps) {
  const activeKeysRef = useRef<Set<Direction>>(new Set());
  const animationFrameRef = useRef<number | null>(null);

  const processMovement = useCallback(() => {
    activeKeysRef.current.forEach((direction) => {
      onMove(direction);
    });

    if (activeKeysRef.current.size > 0) {
      animationFrameRef.current = requestAnimationFrame(processMovement);
    }
  }, [onMove]);

  const startMovement = useCallback(
    (direction: Direction) => {
      if (!activeKeysRef.current.has(direction)) {
        activeKeysRef.current.add(direction);
        if (activeKeysRef.current.size === 1) {
          animationFrameRef.current = requestAnimationFrame(processMovement);
        }
      }
    },
    [processMovement]
  );

  const stopMovement = useCallback((direction: Direction) => {
    activeKeysRef.current.delete(direction);
    if (activeKeysRef.current.size === 0 && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    const isInputElement = (target: EventTarget | null): boolean => {
      if (!target) return false;
      const tagName = (target as HTMLElement).tagName?.toLowerCase();
      return tagName === 'input' || tagName === 'textarea' || (target as HTMLElement).isContentEditable;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keys when typing in input fields
      if (isInputElement(e.target)) return;

      const direction = KEY_MAP[e.key];
      if (direction) {
        e.preventDefault();
        startMovement(direction);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Don't intercept keys when typing in input fields
      if (isInputElement(e.target)) return;

      const direction = KEY_MAP[e.key];
      if (direction) {
        e.preventDefault();
        stopMovement(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startMovement, stopMovement]);

  return {
    startMovement,
    stopMovement,
    activeKeys: activeKeysRef.current,
  };
}

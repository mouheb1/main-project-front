import { Shape } from './Shape';
import type { NPC } from '@/types/game';
import { NPC_SIZE } from '@/types/game';
import { cn } from '@/lib/utils';

interface NPCCharacterProps {
  npc: NPC;
  isNearPlayer: boolean;
  isCompleted: boolean;
}

export function NPCCharacter({ npc, isNearPlayer, isCompleted }: NPCCharacterProps) {
  return (
    <div
      className="absolute"
      style={{
        left: npc.position.x,
        top: npc.position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Completed checkmark indicator */}
      {isCompleted && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="font-retro text-[#00ff00] text-sm drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]">
            ✓
          </div>
        </div>
      )}

      {/* "Press ENTER" interaction prompt - only show when near and not completed */}
      {isNearPlayer && !isCompleted && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-pulse">
          <div className="font-retro text-[8px] text-[#ffd700] bg-[#0f0f1e] border border-[#ffd700] px-2 py-1 whitespace-nowrap shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            PRESS ENTER
          </div>
        </div>
      )}

      {/* "Already helped" prompt for completed NPCs when near */}
      {isNearPlayer && isCompleted && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="font-retro text-[6px] text-[#888] bg-[#1a1a2e] border border-[#4a4a6a] px-2 py-1 whitespace-nowrap">
            QUEST DONE
          </div>
        </div>
      )}

      {/* NPC shape with completed state styling */}
      <div
        className={cn(
          'transition-all duration-300',
          isNearPlayer && !isCompleted && 'animate-pulse'
        )}
        style={{
          opacity: isCompleted ? 0.4 : 1,
          filter: isNearPlayer && !isCompleted
            ? `drop-shadow(0 0 15px ${npc.quest.npcColor}) drop-shadow(0 0 30px ${npc.quest.npcColor}80)`
            : isCompleted
            ? 'grayscale(70%) drop-shadow(0 0 5px rgba(0,0,0,0.3))'
            : 'drop-shadow(0 0 5px rgba(0,0,0,0.5))',
        }}
      >
        <Shape
          type={npc.quest.npcShape}
          color={isCompleted ? '#666666' : npc.quest.npcColor}
          size={NPC_SIZE}
        />
      </div>

      {/* Retro NPC name label */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span
          className={cn(
            'font-retro text-[8px] px-2 py-1 transition-all duration-300 border',
            isCompleted
              ? 'bg-[#1a1a2e]/60 text-[#666] border-[#444]'
              : isNearPlayer
              ? 'bg-[#0f0f1e] text-[#ffd700] border-[#ffd700]'
              : 'bg-[#1a1a2e]/80 text-[#888] border-[#4a4a6a]'
          )}
        >
          {npc.quest.npcName}
        </span>
      </div>
    </div>
  );
}

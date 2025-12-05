import { NPCSprite, getNPCType } from './NPCSprite';
import type { NPC } from '@/types/game';
import { NPC_SIZE } from '@/types/game';
import { cn } from '@/lib/utils';

interface NPCCharacterProps {
  npc: NPC;
  isNearPlayer: boolean;
  isCompleted: boolean;
}

export function NPCCharacter({ npc, isNearPlayer, isCompleted }: NPCCharacterProps) {
  const npcType = getNPCType(npc.quest.id);

  return (
    <div
      className="absolute"
      style={{
        left: npc.position.x,
        top: npc.position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* "Press ENTER" interaction prompt - only show when near and not completed */}
      {isNearPlayer && !isCompleted && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="font-retro text-[8px] text-[#ffd700] bg-[#0f0f1e] border-2 border-[#ffd700] px-2 py-1 whitespace-nowrap shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            APPUYER ENTRÉE
          </div>
        </div>
      )}

      {/* "Already helped" prompt for completed NPCs when near */}
      {isNearPlayer && isCompleted && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2">
          <div className="font-retro text-[6px] text-[#888] bg-[#1a1a2e] border border-[#4a4a6a] px-2 py-1 whitespace-nowrap">
            QUÊTE TERMINÉE
          </div>
        </div>
      )}

      {/* NPC character sprite */}
      <div
        className={cn(
          'transition-all duration-300',
          isNearPlayer && !isCompleted && 'animate-pulse'
        )}
        style={{
          filter: isNearPlayer && !isCompleted
            ? `drop-shadow(0 0 15px ${npc.quest.npcColor}) drop-shadow(0 0 30px ${npc.quest.npcColor}80)`
            : isCompleted
            ? 'drop-shadow(0 0 5px rgba(0,0,0,0.3))'
            : 'drop-shadow(0 0 8px rgba(0,0,0,0.5))',
        }}
      >
        <NPCSprite
          type={npcType}
          size={NPC_SIZE}
          isCompleted={isCompleted}
          isNear={isNearPlayer}
        />
      </div>

      {/* Retro NPC name label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
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

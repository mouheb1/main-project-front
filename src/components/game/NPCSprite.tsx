import { cn } from '@/lib/utils';

type NPCType =
  | 'druid'      // Druide du Libre
  | 'guardian'   // Gardien des Données
  | 'witch'      // Sorcière Linux
  | 'recycler'   // Maître Recycleur
  | 'merchant'   // Marchand Open Source
  | 'sage'       // Sage de la Sobriété
  | 'knight'     // Chevalier du Cloud
  | 'priestess'  // Prêtresse Privacy
  | 'blacksmith'; // Forgeron du Code

interface NPCSpriteProps {
  type: NPCType;
  size?: number;
  isCompleted?: boolean;
  isNear?: boolean;
}

// Map quest IDs to NPC types
export function getNPCType(questId: string): NPCType {
  const mapping: Record<string, NPCType> = {
    'quest1': 'druid',
    'quest2': 'guardian',
    'quest3': 'witch',
    'quest4': 'recycler',
    'quest5': 'merchant',
    'quest6': 'sage',
    'quest7': 'knight',
    'quest8': 'priestess',
    'quest9': 'blacksmith',
  };
  return mapping[questId] || 'druid';
}

export function NPCSprite({ type, size = 48, isCompleted = false, isNear = false }: NPCSpriteProps) {
  const renderNPC = () => {
    switch (type) {
      case 'druid':
        return <DruidSprite size={size} />;
      case 'guardian':
        return <GuardianSprite size={size} />;
      case 'witch':
        return <WitchSprite size={size} />;
      case 'recycler':
        return <RecyclerSprite size={size} />;
      case 'merchant':
        return <MerchantSprite size={size} />;
      case 'sage':
        return <SageSprite size={size} />;
      case 'knight':
        return <KnightSprite size={size} />;
      case 'priestess':
        return <PriestessSprite size={size} />;
      case 'blacksmith':
        return <BlacksmithSprite size={size} />;
      default:
        return <DruidSprite size={size} />;
    }
  };

  return (
    <div
      className={cn(
        'relative transition-all duration-200',
        isCompleted && 'opacity-50 grayscale',
        isNear && !isCompleted && 'scale-110'
      )}
      style={{ width: size, height: size }}
    >
      {renderNPC()}

      {/* Completed checkmark */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#22c55e] rounded-full flex items-center justify-center border-2 border-white">
          <span className="text-white text-xs">✓</span>
        </div>
      )}

      {/* Interaction indicator */}
      {isNear && !isCompleted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="text-[#ffd700] font-retro text-[8px]">!</div>
        </div>
      )}
    </div>
  );
}

// Druide du Libre - Green robes, staff, beard
function DruidSprite({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size} height={size * 1.25} style={{ imageRendering: 'pixelated' }}>
      {/* Hood */}
      <rect x="4" y="0" width="8" height="3" fill="#228B22" />
      <rect x="3" y="2" width="10" height="2" fill="#228B22" />

      {/* Face */}
      <rect x="5" y="3" width="6" height="4" fill="#FFDAB9" />

      {/* Eyes */}
      <rect x="6" y="4" width="1" height="1" fill="#000" />
      <rect x="9" y="4" width="1" height="1" fill="#000" />

      {/* Beard */}
      <rect x="5" y="6" width="6" height="3" fill="#CCCCCC" />
      <rect x="6" y="8" width="4" height="2" fill="#CCCCCC" />

      {/* Robe */}
      <rect x="3" y="8" width="10" height="8" fill="#228B22" />
      <rect x="4" y="8" width="8" height="8" fill="#2E8B2E" />

      {/* Staff */}
      <rect x="13" y="4" width="2" height="14" fill="#8B4513" />
      <rect x="12" y="2" width="4" height="3" fill="#ffd700" />

      {/* Feet */}
      <rect x="4" y="16" width="3" height="2" fill="#654321" />
      <rect x="9" y="16" width="3" height="2" fill="#654321" />
    </svg>
  );
}

// Gardien des Données - Armored, shield
function GuardianSprite({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size} height={size * 1.25} style={{ imageRendering: 'pixelated' }}>
      {/* Helmet */}
      <rect x="4" y="0" width="8" height="4" fill="#4A90D9" />
      <rect x="3" y="2" width="10" height="3" fill="#4A90D9" />
      <rect x="5" y="4" width="6" height="1" fill="#2a5a99" />

      {/* Face visor */}
      <rect x="5" y="3" width="6" height="3" fill="#1a1a2e" />
      <rect x="6" y="4" width="1" height="1" fill="#ffd700" />
      <rect x="9" y="4" width="1" height="1" fill="#ffd700" />

      {/* Armor body */}
      <rect x="3" y="6" width="10" height="8" fill="#4A90D9" />
      <rect x="5" y="7" width="6" height="1" fill="#ffd700" />

      {/* Shield */}
      <rect x="0" y="7" width="4" height="6" fill="#2a5a99" />
      <rect x="1" y="8" width="2" height="4" fill="#ffd700" />

      {/* Sword */}
      <rect x="13" y="5" width="2" height="10" fill="#C0C0C0" />
      <rect x="12" y="8" width="4" height="2" fill="#ffd700" />

      {/* Legs */}
      <rect x="4" y="14" width="3" height="4" fill="#4A90D9" />
      <rect x="9" y="14" width="3" height="4" fill="#4A90D9" />

      {/* Feet */}
      <rect x="3" y="17" width="4" height="2" fill="#2a5a99" />
      <rect x="9" y="17" width="4" height="2" fill="#2a5a99" />
    </svg>
  );
}

// Sorcière Linux - Purple robes, pointy hat
function WitchSprite({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size} height={size * 1.25} style={{ imageRendering: 'pixelated' }}>
      {/* Pointy hat */}
      <rect x="7" y="0" width="2" height="2" fill="#9333EA" />
      <rect x="6" y="1" width="4" height="2" fill="#9333EA" />
      <rect x="5" y="2" width="6" height="2" fill="#9333EA" />
      <rect x="4" y="3" width="8" height="2" fill="#9333EA" />

      {/* Hat brim */}
      <rect x="2" y="4" width="12" height="1" fill="#7928CA" />

      {/* Face */}
      <rect x="5" y="5" width="6" height="4" fill="#98FB98" />

      {/* Eyes */}
      <rect x="6" y="6" width="1" height="1" fill="#000" />
      <rect x="9" y="6" width="1" height="1" fill="#000" />

      {/* Smile */}
      <rect x="7" y="8" width="2" height="1" fill="#000" />

      {/* Robe */}
      <rect x="3" y="9" width="10" height="8" fill="#9333EA" />
      <rect x="5" y="10" width="6" height="1" fill="#ffd700" />

      {/* Wand */}
      <rect x="13" y="8" width="1" height="8" fill="#8B4513" />
      <rect x="12" y="7" width="3" height="2" fill="#ff69b4" />

      {/* Feet */}
      <rect x="4" y="16" width="3" height="2" fill="#7928CA" />
      <rect x="9" y="16" width="3" height="2" fill="#7928CA" />
    </svg>
  );
}

// Maître Recycleur - Work apron, tools
function RecyclerSprite({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size} height={size * 1.25} style={{ imageRendering: 'pixelated' }}>
      {/* Cap */}
      <rect x="4" y="1" width="8" height="2" fill="#22C55E" />
      <rect x="3" y="2" width="10" height="1" fill="#22C55E" />

      {/* Face */}
      <rect x="5" y="3" width="6" height="4" fill="#FFDAB9" />

      {/* Eyes */}
      <rect x="6" y="4" width="1" height="1" fill="#000" />
      <rect x="9" y="4" width="1" height="1" fill="#000" />

      {/* Smile */}
      <rect x="7" y="6" width="2" height="1" fill="#000" />

      {/* Body/Shirt */}
      <rect x="3" y="7" width="10" height="3" fill="#8B4513" />

      {/* Apron */}
      <rect x="4" y="9" width="8" height="7" fill="#22C55E" />
      <rect x="5" y="10" width="6" height="1" fill="#16a34a" />

      {/* Recycle symbol on apron */}
      <rect x="6" y="12" width="4" height="3" fill="#16a34a" />
      <rect x="7" y="13" width="2" height="1" fill="#22C55E" />

      {/* Arms */}
      <rect x="1" y="8" width="2" height="4" fill="#FFDAB9" />
      <rect x="13" y="8" width="2" height="4" fill="#FFDAB9" />

      {/* Wrench in hand */}
      <rect x="13" y="10" width="3" height="1" fill="#C0C0C0" />
      <rect x="14" y="9" width="2" height="3" fill="#C0C0C0" />

      {/* Legs */}
      <rect x="5" y="16" width="2" height="3" fill="#654321" />
      <rect x="9" y="16" width="2" height="3" fill="#654321" />
    </svg>
  );
}

// Marchand Open Source - Merchant robes, bag
function MerchantSprite({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size} height={size * 1.25} style={{ imageRendering: 'pixelated' }}>
      {/* Hat */}
      <rect x="4" y="0" width="8" height="2" fill="#F59E0B" />
      <rect x="3" y="1" width="10" height="2" fill="#F59E0B" />

      {/* Face */}
      <rect x="5" y="3" width="6" height="4" fill="#FFDAB9" />

      {/* Eyes */}
      <rect x="6" y="4" width="1" height="1" fill="#000" />
      <rect x="9" y="4" width="1" height="1" fill="#000" />

      {/* Mustache */}
      <rect x="5" y="6" width="2" height="1" fill="#8B4513" />
      <rect x="9" y="6" width="2" height="1" fill="#8B4513" />

      {/* Robe */}
      <rect x="3" y="7" width="10" height="9" fill="#F59E0B" />
      <rect x="5" y="8" width="6" height="1" fill="#ffd700" />

      {/* Belt with pouch */}
      <rect x="3" y="11" width="10" height="1" fill="#8B4513" />
      <rect x="5" y="10" width="3" height="3" fill="#8B4513" />
      <rect x="6" y="11" width="1" height="1" fill="#ffd700" />

      {/* Bag */}
      <rect x="12" y="8" width="4" height="5" fill="#8B4513" />
      <rect x="13" y="9" width="2" height="1" fill="#ffd700" />

      {/* Feet */}
      <rect x="4" y="16" width="3" height="2" fill="#8B4513" />
      <rect x="9" y="16" width="3" height="2" fill="#8B4513" />
    </svg>
  );
}

// Sage de la Sobriété - Elder with simple robes
function SageSprite({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size} height={size * 1.25} style={{ imageRendering: 'pixelated' }}>
      {/* Bald head */}
      <rect x="5" y="1" width="6" height="3" fill="#FFDAB9" />
      <rect x="4" y="2" width="8" height="2" fill="#FFDAB9" />

      {/* White hair sides */}
      <rect x="3" y="3" width="2" height="2" fill="#FFFFFF" />
      <rect x="11" y="3" width="2" height="2" fill="#FFFFFF" />

      {/* Face */}
      <rect x="5" y="4" width="6" height="4" fill="#FFDAB9" />

      {/* Eyes (wise, squinting) */}
      <rect x="6" y="5" width="1" height="1" fill="#000" />
      <rect x="9" y="5" width="1" height="1" fill="#000" />

      {/* Long white beard */}
      <rect x="5" y="7" width="6" height="2" fill="#FFFFFF" />
      <rect x="6" y="9" width="4" height="3" fill="#FFFFFF" />
      <rect x="7" y="12" width="2" height="2" fill="#FFFFFF" />

      {/* Simple robe */}
      <rect x="3" y="8" width="10" height="8" fill="#EF4444" />
      <rect x="4" y="8" width="8" height="8" fill="#dc2626" />

      {/* Walking stick */}
      <rect x="0" y="6" width="2" height="12" fill="#8B4513" />

      {/* Feet */}
      <rect x="4" y="16" width="3" height="2" fill="#8B4513" />
      <rect x="9" y="16" width="3" height="2" fill="#8B4513" />
    </svg>
  );
}

// Chevalier du Cloud - Knight in blue armor
function KnightSprite({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size} height={size * 1.25} style={{ imageRendering: 'pixelated' }}>
      {/* Helmet with plume */}
      <rect x="7" y="0" width="2" height="2" fill="#3B82F6" />
      <rect x="4" y="1" width="8" height="4" fill="#3B82F6" />
      <rect x="3" y="3" width="10" height="2" fill="#3B82F6" />

      {/* Visor */}
      <rect x="5" y="4" width="6" height="2" fill="#1e3a5f" />
      <rect x="6" y="4" width="1" height="1" fill="#87CEEB" />
      <rect x="9" y="4" width="1" height="1" fill="#87CEEB" />

      {/* Armor body */}
      <rect x="3" y="6" width="10" height="8" fill="#3B82F6" />
      <rect x="5" y="7" width="6" height="2" fill="#60a5fa" />

      {/* Cloud emblem */}
      <rect x="6" y="8" width="4" height="2" fill="#FFFFFF" />
      <rect x="7" y="7" width="2" height="1" fill="#FFFFFF" />

      {/* Cape */}
      <rect x="1" y="7" width="2" height="8" fill="#1e40af" />
      <rect x="13" y="7" width="2" height="8" fill="#1e40af" />

      {/* Sword */}
      <rect x="14" y="4" width="2" height="10" fill="#C0C0C0" />
      <rect x="13" y="7" width="3" height="2" fill="#ffd700" />

      {/* Legs */}
      <rect x="4" y="14" width="3" height="4" fill="#3B82F6" />
      <rect x="9" y="14" width="3" height="4" fill="#3B82F6" />

      {/* Feet */}
      <rect x="3" y="17" width="4" height="2" fill="#1e40af" />
      <rect x="9" y="17" width="4" height="2" fill="#1e40af" />
    </svg>
  );
}

// Prêtresse Privacy - Hooded figure with lock symbol
function PriestessSprite({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size} height={size * 1.25} style={{ imageRendering: 'pixelated' }}>
      {/* Hood */}
      <rect x="5" y="0" width="6" height="2" fill="#C4B5FD" />
      <rect x="3" y="1" width="10" height="4" fill="#C4B5FD" />
      <rect x="2" y="3" width="12" height="2" fill="#C4B5FD" />

      {/* Face in shadow */}
      <rect x="5" y="4" width="6" height="4" fill="#FFDAB9" />

      {/* Glowing eyes */}
      <rect x="6" y="5" width="1" height="1" fill="#8B5CF6" />
      <rect x="9" y="5" width="1" height="1" fill="#8B5CF6" />

      {/* Mysterious smile */}
      <rect x="7" y="7" width="2" height="1" fill="#000" />

      {/* Robe */}
      <rect x="2" y="7" width="12" height="10" fill="#C4B5FD" />
      <rect x="3" y="8" width="10" height="9" fill="#a78bfa" />

      {/* Lock symbol on chest */}
      <rect x="6" y="9" width="4" height="4" fill="#ffd700" />
      <rect x="7" y="8" width="2" height="2" fill="#ffd700" />
      <rect x="7" y="10" width="2" height="2" fill="#1a1a2e" />

      {/* Mystical staff */}
      <rect x="13" y="5" width="2" height="12" fill="#8B5CF6" />
      <rect x="12" y="4" width="4" height="2" fill="#ffd700" />

      {/* Feet hidden under robe */}
      <rect x="5" y="17" width="6" height="2" fill="#7c3aed" />
    </svg>
  );
}

// Forgeron du Code - Muscular blacksmith with hammer
function BlacksmithSprite({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 20" width={size} height={size * 1.25} style={{ imageRendering: 'pixelated' }}>
      {/* Bandana */}
      <rect x="4" y="1" width="8" height="2" fill="#FB923C" />
      <rect x="3" y="2" width="10" height="1" fill="#FB923C" />

      {/* Face */}
      <rect x="5" y="3" width="6" height="4" fill="#D2691E" />

      {/* Eyes */}
      <rect x="6" y="4" width="1" height="1" fill="#000" />
      <rect x="9" y="4" width="1" height="1" fill="#000" />

      {/* Beard stubble */}
      <rect x="5" y="6" width="6" height="1" fill="#8B4513" />

      {/* Muscular body */}
      <rect x="2" y="7" width="12" height="6" fill="#D2691E" />

      {/* Apron */}
      <rect x="4" y="8" width="8" height="8" fill="#4a4a4a" />
      <rect x="5" y="9" width="6" height="1" fill="#FB923C" />

      {/* Code symbol </> on apron */}
      <rect x="5" y="11" width="1" height="2" fill="#FB923C" />
      <rect x="6" y="12" width="1" height="1" fill="#FB923C" />
      <rect x="8" y="12" width="1" height="1" fill="#FB923C" />
      <rect x="9" y="11" width="1" height="2" fill="#FB923C" />

      {/* Arms (muscular) */}
      <rect x="0" y="7" width="3" height="5" fill="#D2691E" />
      <rect x="13" y="7" width="3" height="5" fill="#D2691E" />

      {/* Hammer */}
      <rect x="14" y="3" width="2" height="8" fill="#8B4513" />
      <rect x="13" y="2" width="4" height="3" fill="#C0C0C0" />

      {/* Legs */}
      <rect x="5" y="16" width="2" height="3" fill="#4a4a4a" />
      <rect x="9" y="16" width="2" height="3" fill="#4a4a4a" />

      {/* Boots */}
      <rect x="4" y="18" width="3" height="2" fill="#654321" />
      <rect x="9" y="18" width="3" height="2" fill="#654321" />
    </svg>
  );
}

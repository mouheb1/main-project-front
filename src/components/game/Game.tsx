import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Shape } from './Shape';
import { DPad } from './DPad';
import { NPCCharacter } from './NPCCharacter';
import { ZeldaDialog } from './ZeldaDialog';
import { LoginModal } from './LoginModal';
import { useGameControls } from '@/hooks/useGameControls';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useMultiplayer, type PlayerIdentity, type RemotePlayer } from '@/hooks/useMultiplayer';
import { QUESTS } from '@/data/quests';
import { gameApi, type GameUser } from '@/services/gameApi';
import type { Player, Direction, NPC, Position } from '@/types/game';
import {
  SHAPES,
  MOVEMENT_SPEED,
  PLAYER_SIZE,
  NPC_SIZE,
  INTERACTION_DISTANCE,
} from '@/types/game';

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate identity from auth user or create fresh one
function generateIdentity(authUser: GameUser | null): PlayerIdentity {
  if (authUser) {
    return {
      odUserId: authUser.id,
      odUsername: authUser.name,
      shape: getRandomItem(SHAPES),
      color: authUser.team.color,
    };
  }
  // Fallback for unauthenticated (shouldn't happen with login modal)
  return {
    odUserId: crypto.randomUUID(),
    odUsername: `Player_${Math.floor(Math.random() * 9000) + 1000}`,
    shape: getRandomItem(SHAPES),
    color: '#3b82f6',
  };
}

function createPlayer(
  canvasWidth: number,
  canvasHeight: number,
  identity: PlayerIdentity
): Player {
  return {
    id: identity.odUserId,
    shape: identity.shape,
    color: identity.color,
    size: PLAYER_SIZE,
    position: {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
    },
  };
}

function createNPCs(canvasWidth: number, canvasHeight: number, count: number): NPC[] {
  const padding = NPC_SIZE * 2;
  const selectedQuests = shuffleArray(QUESTS).slice(0, count);
  const npcs: NPC[] = [];

  // Create a grid to ensure NPCs are spread out
  const gridCols = Math.ceil(Math.sqrt(count));
  const gridRows = Math.ceil(count / gridCols);
  const cellWidth = (canvasWidth - padding * 2) / gridCols;
  const cellHeight = (canvasHeight - padding * 2) / gridRows;

  selectedQuests.forEach((quest, index) => {
    const col = index % gridCols;
    const row = Math.floor(index / gridCols);

    // Random position within the grid cell
    const x = padding + col * cellWidth + Math.random() * cellWidth * 0.6 + cellWidth * 0.2;
    const y = padding + row * cellHeight + Math.random() * cellHeight * 0.6 + cellHeight * 0.2;

    npcs.push({
      id: crypto.randomUUID(),
      quest,
      position: { x, y },
    });
  });

  return npcs;
}

function getDistance(p1: Position, p2: Position): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function Game() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [player, setPlayer] = useState<Player | null>(null);
  const [npcs, setNPCs] = useState<NPC[]>([]);
  const [activeDirections, setActiveDirections] = useState<Set<Direction>>(new Set());

  // Auth state
  const [authUser, setAuthUser] = useState<GameUser | null>(() => gameApi.getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => gameApi.isAuthenticated());

  // Score feedback toast
  const [scoreFeedback, setScoreFeedback] = useState<{ points: number; teamName: string } | null>(null);

  // Generate identity from auth user
  const [identity, setIdentity] = useState<PlayerIdentity>(() => generateIdentity(authUser));

  // User progress tracking (multi-user ready)
  const { isQuestCompleted, completeQuest, completedCount } = useUserProgress();

  // Quest/Dialog state
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Track nearby NPC for ENTER key interaction
  const [nearbyNPC, setNearbyNPC] = useState<NPC | null>(null);

  // Initial position for multiplayer (center of canvas)
  const initialPosition = useMemo(
    () => ({
      x: canvasSize.width / 2 || 400,
      y: canvasSize.height / 2 || 300,
    }),
    [canvasSize]
  );

  // Handle logout - defined before useMultiplayer to be used in onKicked
  const handleLogout = useCallback(() => {
    gameApi.clearToken();
    setAuthUser(null);
    setIsAuthenticated(false);
    setPlayer(null);
    setIdentity(generateIdentity(null));
  }, []);

  // Handle being kicked (another player from same team connected)
  const handleKicked = useCallback((reason: string) => {
    alert(`You have been disconnected: ${reason}`);
    handleLogout();
  }, [handleLogout]);

  // Multiplayer hook - connects only when authenticated
  const {
    remotePlayers,
    connectionStatus,
    playerCount,
    emitMove,
    emitQuestComplete,
  } = useMultiplayer({
    identity,
    initialPosition,
    autoConnect: isAuthenticated,
    onKicked: handleKicked,
  });

  // Initialize canvas size
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initialize player and NPCs when canvas size is ready
  useEffect(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0 && !player) {
      setPlayer(createPlayer(canvasSize.width, canvasSize.height, identity));
      setNPCs(createNPCs(canvasSize.width, canvasSize.height, 9)); // All 9 quests
    }
  }, [canvasSize, player, identity]);

  // Update nearby NPC based on player position
  const updateNearbyNPC = useCallback(
    (playerPos: Position) => {
      if (isDialogOpen) return;

      let closestNPC: NPC | null = null;
      let closestDistance = Infinity;

      for (const npc of npcs) {
        const distance = getDistance(playerPos, npc.position);
        const collisionDistance = (PLAYER_SIZE + NPC_SIZE) / 2;

        if (distance < collisionDistance && distance < closestDistance) {
          closestNPC = npc;
          closestDistance = distance;
        }
      }

      setNearbyNPC(closestNPC);
    },
    [npcs, isDialogOpen]
  );

  // ENTER key listener for NPC interaction
  useEffect(() => {
    if (isDialogOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && nearbyNPC) {
        e.preventDefault();
        setActiveNPC(nearbyNPC);
        setIsDialogOpen(true);
        setAnsweredCorrectly(null);
        setShowFeedback(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearbyNPC, isDialogOpen]);

  const movePlayer = useCallback(
    (direction: Direction) => {
      if (isDialogOpen) return;

      setPlayer((prev) => {
        if (!prev) return prev;

        let { x, y } = prev.position;
        const halfSize = prev.size / 2;

        switch (direction) {
          case 'up':
            y = Math.max(halfSize, y - MOVEMENT_SPEED);
            break;
          case 'down':
            y = Math.min(canvasSize.height - halfSize, y + MOVEMENT_SPEED);
            break;
          case 'left':
            x = Math.max(halfSize, x - MOVEMENT_SPEED);
            break;
          case 'right':
            x = Math.min(canvasSize.width - halfSize, x + MOVEMENT_SPEED);
            break;
        }

        const newPosition = { x, y };
        // Update nearby NPC after move
        setTimeout(() => updateNearbyNPC(newPosition), 0);

        // Emit position to other players
        emitMove(x, y);

        return { ...prev, position: newPosition };
      });
    },
    [canvasSize, isDialogOpen, updateNearbyNPC, emitMove]
  );

  const { startMovement, stopMovement } = useGameControls({ onMove: movePlayer });

  const handleDirectionStart = useCallback(
    (direction: Direction) => {
      if (isDialogOpen) return;
      setActiveDirections((prev) => new Set(prev).add(direction));
      startMovement(direction);
    },
    [startMovement, isDialogOpen]
  );

  const handleDirectionEnd = useCallback(
    (direction: Direction) => {
      setActiveDirections((prev) => {
        const next = new Set(prev);
        next.delete(direction);
        return next;
      });
      stopMovement(direction);
    },
    [stopMovement]
  );

  // Handle login success
  const handleLogin = useCallback((user: GameUser) => {
    setAuthUser(user);
    setIsAuthenticated(true);
    // Update identity with new user info
    setIdentity(generateIdentity(user));
    // Hard reload to ensure proper initialization
    window.location.reload();
  }, []);

  const handleAnswer = useCallback(
    async (answerIndex: number) => {
      if (!activeNPC) return;

      const isCorrect = answerIndex === activeNPC.quest.correctAnswer;
      setAnsweredCorrectly(isCorrect);
      setShowFeedback(true);

      // Mark quest as completed and update team score if correct
      if (isCorrect) {
        completeQuest(activeNPC.quest.id);
        // Emit quest completion to other players
        emitQuestComplete(activeNPC.quest.id);

        // Update team score via API
        if (authUser) {
          try {
            const points = activeNPC.quest.points;
            await gameApi.updateTeamScore(
              authUser.teamId,
              points,
              `Quest completed: ${activeNPC.quest.npcName}`
            );
            // Show feedback toast
            setScoreFeedback({ points, teamName: authUser.team.name });
            setTimeout(() => setScoreFeedback(null), 3000);
          } catch (err) {
            console.error('Failed to update team score:', err);
          }
        }
      }
    },
    [activeNPC, completeQuest, emitQuestComplete, authUser]
  );

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setActiveNPC(null);
    setAnsweredCorrectly(null);
    setShowFeedback(false);
  }, []);

  // Calculate which NPCs are near the player (for visual indicator)
  const npcsNearPlayer = useMemo(() => {
    if (!player) return new Set<string>();

    const nearSet = new Set<string>();
    for (const npc of npcs) {
      const distance = getDistance(player.position, npc.position);
      if (distance < INTERACTION_DISTANCE) {
        nearSet.add(npc.id);
      }
    }
    return nearSet;
  }, [player, npcs]);

  const totalQuests = npcs.length;

  // Check if active NPC's quest is already completed
  const isActiveQuestCompleted = activeNPC ? isQuestCompleted(activeNPC.quest.id) : false;

  // Connection status indicator
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return '#22c55e';
      case 'connecting':
        return '#eab308';
      default:
        return '#ef4444';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Online';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Offline';
    }
  };

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="w-full h-screen bg-[#1a1a2e] flex flex-col overflow-hidden">
      {/* Score feedback toast */}
      {scoreFeedback && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-[#22c55e] text-white px-4 py-2 font-retro text-xs sm:text-sm shadow-lg border-2 border-[#16a34a]">
            +{scoreFeedback.points} pts for {scoreFeedback.teamName}!
          </div>
        </div>
      )}

      {/* Retro Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0f0f1e] border-b-4 border-[#ffd700]">
        <div className="flex items-center gap-3 sm:gap-4">
          <h1 className="font-retro text-[#ffd700] text-xs sm:text-sm tracking-wider">
            QUEST RPG
          </h1>
          {player && authUser && (
            <div className="flex items-center gap-2 px-2 py-1 bg-[#1a1a2e] border-2 border-[#4a4a6a]">
              <div
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm"
                style={{ backgroundColor: authUser.team.color }}
              />
              <span className="font-retro text-[8px] sm:text-[10px] text-[#f0f0f0]">
                {authUser.name}
              </span>
              <span className="font-retro text-[8px] sm:text-[10px] text-[#888]">
                ({authUser.team.name})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Connection status and player count */}
          <div className="flex items-center gap-2 px-2 py-1 bg-[#1a1a2e] border-2 border-[#4a4a6a]">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getStatusColor() }}
            />
            <span className="font-retro text-[8px] sm:text-[10px] text-[#f0f0f0]">
              {getStatusText()}
            </span>
            <span className="font-retro text-[8px] sm:text-[10px] text-[#888]">
              ({playerCount})
            </span>
          </div>

          {/* Hearts/Score display - Zelda style */}
          <div className="flex items-center gap-1 sm:gap-2">
            {Array.from({ length: totalQuests }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  i < completedCount ? 'text-[#ff0000]' : 'text-[#4a4a6a]'
                }`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 font-retro text-[8px] text-[#888]">
            <span className="px-1 py-0.5 bg-[#2a2a3e] border border-[#4a4a6a]">WASD</span>
            <span className="px-1 py-0.5 bg-[#2a2a3e] border border-[#4a4a6a]">ARROWS</span>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-2 py-1 bg-[#ef4444] hover:bg-[#dc2626] text-white font-retro text-[8px] sm:text-[10px] transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Game canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden"
        style={{
          background: `
            linear-gradient(to bottom, #1a1a2e 0%, #0f0f1e 100%)
          `,
        }}
      >
        {/* Pixel grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #2a2a4e 1px, transparent 1px),
              linear-gradient(to bottom, #2a2a4e 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Decorative corner borders */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#ffd700]/30" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#ffd700]/30" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#ffd700]/30" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#ffd700]/30" />

        {/* NPCs */}
        {npcs.map((npc) => (
          <NPCCharacter
            key={npc.id}
            npc={npc}
            isNearPlayer={npcsNearPlayer.has(npc.id)}
            isCompleted={isQuestCompleted(npc.quest.id)}
          />
        ))}

        {/* Remote Players */}
        {Array.from(remotePlayers.values()).map((remotePlayer: RemotePlayer) => (
          <div
            key={remotePlayer.odUserId}
            className="absolute z-10 transition-all duration-100 ease-out"
            style={{
              left: remotePlayer.x,
              top: remotePlayer.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Username label */}
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-retro text-[8px] px-1 py-0.5 bg-black/50 rounded"
              style={{ color: remotePlayer.color }}
            >
              {remotePlayer.odUsername}
            </div>
            <Shape
              type={remotePlayer.shape}
              color={remotePlayer.color}
              size={PLAYER_SIZE}
            />
          </div>
        ))}

        {/* Local Player */}
        {player && (
          <div
            className="absolute z-10"
            style={{
              left: player.position.x,
              top: player.position.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Username label */}
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-retro text-[8px] px-1 py-0.5 bg-black/50 rounded"
              style={{ color: player.color }}
            >
              {identity.odUsername} (You)
            </div>
            <Shape
              type={player.shape}
              color={player.color}
              size={player.size}
            />
          </div>
        )}

        {/* D-Pad controls */}
        <DPad
          onDirectionStart={handleDirectionStart}
          onDirectionEnd={handleDirectionEnd}
          activeDirections={activeDirections}
        />

        {/* Victory message - Retro style */}
        {completedCount === totalQuests && totalQuests > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
            <div className="bg-[#0f0f1e] border-4 border-[#ffd700] p-6 sm:p-8 text-center shadow-[0_0_30px_rgba(255,215,0,0.3)]">
              <div className="font-retro text-[#ffd700] text-sm sm:text-base mb-4 animate-pulse">
                VICTORY
              </div>
              <p className="font-retro text-[#00ff00] text-xs sm:text-sm mb-2">
                ALL QUESTS COMPLETE!
              </p>
              <p className="font-retro text-white text-[10px] sm:text-xs">
                SCORE: {completedCount}/{totalQuests}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Zelda-style Dialog */}
      <ZeldaDialog
        npc={activeNPC}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAnswer={handleAnswer}
        answeredCorrectly={answeredCorrectly}
        showFeedback={showFeedback}
        isAlreadyCompleted={isActiveQuestCompleted}
      />

      {/* Mobile hint */}
      <footer className="sm:hidden px-4 py-2 bg-[#0f0f1e] border-t-2 border-[#4a4a6a]">
        <p className="font-retro text-[8px] text-[#888] text-center">
          APPROACH NPC + PRESS ENTER TO TALK
        </p>
      </footer>
    </div>
  );
}

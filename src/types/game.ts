export type ShapeType = 'circle' | 'square' | 'triangle' | 'star' | 'hexagon' | 'diamond';

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  shape: ShapeType;
  position: Position;
  color: string;
  size: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameState {
  player: Player;
  canvasSize: {
    width: number;
    height: number;
  };
}

export const SHAPES: ShapeType[] = ['circle', 'square', 'triangle', 'star', 'hexagon', 'diamond'];

export const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export const MOVEMENT_SPEED = 8;
export const PLAYER_SIZE = 40;
export const NPC_SIZE = 50;
export const INTERACTION_DISTANCE = 60;

export interface Quest {
  id: string;
  npcName: string;
  npcShape: ShapeType;
  npcColor: string;
  question: string;
  options: string[];
  correctAnswer: number;
  correctResponse: string;
  wrongResponse: string;
  points: number;
}

export interface NPC {
  id: string;
  quest: Quest;
  position: Position;
}

export interface QuestState {
  activeNPC: NPC | null;
  answeredCorrectly: boolean | null;
  showFeedback: boolean;
}

/**
 * User progress tracking - designed for multi-user support
 * Currently uses single user, but structure supports multiple users
 *
 * To extend for multiplayer:
 * 1. Replace DEFAULT_USER_ID with actual user authentication
 * 2. Load/save progress per authenticated user
 * 3. Each user maintains their own completedQuests array
 */
export interface UserProgress {
  odUserId: string;
  completedQuests: string[]; // Array of quest IDs
}

export interface GameProgress {
  currentUserId: string;
  users: {
    [userId: string]: UserProgress;
  };
}

/**
 * Quest completion record - tracks who completed each quest
 * Useful for multiplayer leaderboards or statistics
 */
export interface QuestCompletion {
  odQuestId: string;
  completedBy: string[]; // Array of user IDs who completed this quest
}

export const DEFAULT_USER_ID = 'player1';
export const STORAGE_KEY = 'rpg-game-progress';

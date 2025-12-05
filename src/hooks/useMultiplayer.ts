import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ShapeType } from '@/types/game';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3009';

// Remote player data received from server
export interface RemotePlayer {
  odUserId: string;
  odUsername: string;
  x: number;
  y: number;
  shape: ShapeType;
  color: string;
  completedQuests: string[];
}

// Player identity to be provided on connection
export interface PlayerIdentity {
  odUserId: string;
  odUsername: string;
  shape: ShapeType;
  color: string;
}

// Connection status
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

// Hook options
interface UseMultiplayerOptions {
  identity: PlayerIdentity;
  initialPosition: { x: number; y: number };
  autoConnect?: boolean;
  onQuestCompleted?: (odUserId: string, odQuestId: string) => void;
  onKicked?: (reason: string) => void;
}

// Hook return value
interface UseMultiplayerReturn {
  remotePlayers: Map<string, RemotePlayer>;
  connectionStatus: ConnectionStatus;
  playerCount: number;
  connect: () => void;
  disconnect: () => void;
  emitMove: (x: number, y: number) => void;
  emitQuestComplete: (odQuestId: string) => void;
}

// Throttle helper for move events
function throttleMove(
  fn: (x: number, y: number) => void,
  delay: number
): (x: number, y: number) => void {
  let lastCall = 0;
  return (x: number, y: number) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(x, y);
    }
  };
}

export function useMultiplayer(options: UseMultiplayerOptions): UseMultiplayerReturn {
  const { identity, initialPosition, autoConnect = true, onQuestCompleted, onKicked } = options;

  // State
  const [remotePlayers, setRemotePlayers] = useState<Map<string, RemotePlayer>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');

  // Refs to persist across renders
  const socketRef = useRef<Socket | null>(null);
  const identityRef = useRef(identity);
  const initialPositionRef = useRef(initialPosition);
  const hasConnectedRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const wasKickedRef = useRef(false); // Prevent reconnection after being kicked

  // Update refs when identity changes (shouldn't happen, but just in case)
  useEffect(() => {
    identityRef.current = identity;
  }, [identity]);

  useEffect(() => {
    initialPositionRef.current = initialPosition;
  }, [initialPosition]);

  // Connect function - creates socket only if not already connected
  const connect = useCallback(() => {
    // Don't reconnect if user was kicked
    if (wasKickedRef.current) {
      console.log('[useMultiplayer] Not reconnecting - user was kicked');
      return;
    }

    // Prevent multiple connections
    if (socketRef.current?.connected) {
      console.log('[useMultiplayer] Already connected');
      return;
    }

    if (hasConnectedRef.current && socketRef.current) {
      console.log('[useMultiplayer] Connection already in progress');
      return;
    }

    hasConnectedRef.current = true;
    setConnectionStatus('connecting');
    console.log('[useMultiplayer] Connecting to', WEBSOCKET_URL);

    // Create socket instance ONCE
    const socket = io(WEBSOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Connection established
    socket.on('connect', () => {
      console.log('[useMultiplayer] Connected, socket.id:', socket.id);
      setConnectionStatus('connected');

      // Emit player:join with full identity
      const joinData = {
        odUserId: identityRef.current.odUserId,
        odUsername: identityRef.current.odUsername,
        shape: identityRef.current.shape,
        color: identityRef.current.color,
        x: initialPositionRef.current.x,
        y: initialPositionRef.current.y,
      };
      console.log('[useMultiplayer] Emitting player:join', joinData);
      socket.emit('player:join', joinData);
    });

    // Receive list of existing players
    socket.on('players:list', (players: RemotePlayer[]) => {
      console.log('[useMultiplayer] Received players:list', players.length, 'players');
      setRemotePlayers((prev) => {
        const newMap = new Map(prev);
        players.forEach((player) => {
          // Don't add ourselves
          if (player.odUserId !== identityRef.current.odUserId) {
            newMap.set(player.odUserId, player);
          }
        });
        return newMap;
      });
    });

    // New player joined
    socket.on('player:joined', (player: RemotePlayer) => {
      console.log('[useMultiplayer] player:joined', player.odUsername);
      // Don't add ourselves
      if (player.odUserId === identityRef.current.odUserId) return;

      setRemotePlayers((prev) => {
        const newMap = new Map(prev);
        newMap.set(player.odUserId, player);
        return newMap;
      });
    });

    // Player moved
    socket.on('player:moved', (data: { odUserId: string; x: number; y: number }) => {
      setRemotePlayers((prev) => {
        const player = prev.get(data.odUserId);
        if (!player) return prev;

        const newMap = new Map(prev);
        newMap.set(data.odUserId, {
          ...player,
          x: data.x,
          y: data.y,
        });
        return newMap;
      });
    });

    // Player left
    socket.on('player:left', (odUserId: string) => {
      console.log('[useMultiplayer] player:left', odUserId);
      setRemotePlayers((prev) => {
        const newMap = new Map(prev);
        newMap.delete(odUserId);
        return newMap;
      });
    });

    // Quest completed
    socket.on('quest:completed', (data: { odUserId: string; odQuestId: string }) => {
      console.log('[useMultiplayer] quest:completed', data);
      // Update remote player's completed quests
      setRemotePlayers((prev) => {
        const player = prev.get(data.odUserId);
        if (!player) return prev;

        if (!player.completedQuests.includes(data.odQuestId)) {
          const newMap = new Map(prev);
          newMap.set(data.odUserId, {
            ...player,
            completedQuests: [...player.completedQuests, data.odQuestId],
          });
          return newMap;
        }
        return prev;
      });

      // Notify callback
      onQuestCompleted?.(data.odUserId, data.odQuestId);
    });

    // Handle errors
    socket.on('error', (message: string) => {
      console.error('[useMultiplayer] Server error:', message);
    });

    // Handle being kicked (same team player connected)
    socket.on('kicked', (reason: string) => {
      // Only handle kick once
      if (wasKickedRef.current) {
        console.log('[useMultiplayer] Already handled kick, ignoring');
        return;
      }
      console.log('[useMultiplayer] Kicked:', reason);
      // Mark as kicked to prevent auto-reconnection
      wasKickedRef.current = true;
      // Disable reconnection
      socket.io.opts.reconnection = false;
      // Remove all listeners to prevent further events
      socket.removeAllListeners();
      // Disconnect immediately
      socket.disconnect();
      socketRef.current = null;
      hasConnectedRef.current = false;
      setConnectionStatus('disconnected');
      setRemotePlayers(new Map());
      // Call callback after cleanup
      onKicked?.(reason);
    });

    // Disconnection
    socket.on('disconnect', (reason) => {
      console.log('[useMultiplayer] Disconnected:', reason);
      setConnectionStatus('disconnected');

      // Don't auto-reconnect if kicked
      if (wasKickedRef.current) {
        console.log('[useMultiplayer] Not reconnecting - was kicked');
        return;
      }

      // Auto-reconnect handling is built into socket.io
      if (reason === 'io server disconnect') {
        // Server forcibly disconnected, try to reconnect
        socket.connect();
      }
    });

    // Reconnection events
    socket.on('reconnect', (attemptNumber) => {
      // Don't rejoin if we were kicked
      if (wasKickedRef.current) {
        console.log('[useMultiplayer] Not rejoining - was kicked');
        socket.disconnect();
        return;
      }

      console.log('[useMultiplayer] Reconnected after', attemptNumber, 'attempts');
      setConnectionStatus('connected');

      // Re-emit player:join on reconnect
      const joinData = {
        odUserId: identityRef.current.odUserId,
        odUsername: identityRef.current.odUsername,
        shape: identityRef.current.shape,
        color: identityRef.current.color,
        x: lastPositionRef.current.x || initialPositionRef.current.x,
        y: lastPositionRef.current.y || initialPositionRef.current.y,
      };
      socket.emit('player:join', joinData);
    });

    socket.on('reconnect_attempt', () => {
      setConnectionStatus('connecting');
    });

    socket.on('reconnect_failed', () => {
      console.error('[useMultiplayer] Reconnection failed');
      setConnectionStatus('disconnected');
    });
  }, []); // Empty deps - connect function never changes

  // Disconnect function
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('[useMultiplayer] Disconnecting...');
      socketRef.current.emit('player:disconnect');
      socketRef.current.disconnect();
      socketRef.current = null;
      hasConnectedRef.current = false;
      setConnectionStatus('disconnected');
      setRemotePlayers(new Map());
    }
  }, []);

  // Emit move - throttled
  const emitMoveThrottled = useCallback(
    throttleMove((x: number, y: number) => {
      if (!socketRef.current?.connected) return;

      // Only emit if position changed significantly
      const dx = Math.abs(x - lastPositionRef.current.x);
      const dy = Math.abs(y - lastPositionRef.current.y);
      if (dx < 2 && dy < 2) return;

      lastPositionRef.current = { x, y };

      socketRef.current.emit('player:move', {
        odUserId: identityRef.current.odUserId,
        x,
        y,
      });
    }, 50),
    []
  );

  const emitMove = useCallback(
    (x: number, y: number) => {
      emitMoveThrottled(x, y);
    },
    [emitMoveThrottled]
  );

  // Emit quest complete
  const emitQuestComplete = useCallback((odQuestId: string) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('quest:complete', {
      odUserId: identityRef.current.odUserId,
      odQuestId,
    });
  }, []);

  // Auto-connect based on autoConnect prop
  useEffect(() => {
    if (autoConnect && !wasKickedRef.current) {
      connect();
    } else if (!autoConnect && socketRef.current) {
      // Disconnect when autoConnect becomes false (e.g., logout)
      console.log('[useMultiplayer] autoConnect is false, disconnecting');
      socketRef.current.emit('player:disconnect');
      socketRef.current.disconnect();
      socketRef.current = null;
      hasConnectedRef.current = false;
      setConnectionStatus('disconnected');
      setRemotePlayers(new Map());
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('player:disconnect');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [autoConnect, connect]); // React to autoConnect changes

  return {
    remotePlayers,
    connectionStatus,
    playerCount: remotePlayers.size + 1, // Include local player
    connect,
    disconnect,
    emitMove,
    emitQuestComplete,
  };
}

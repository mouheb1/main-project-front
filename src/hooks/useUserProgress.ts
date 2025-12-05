import { useState, useEffect, useCallback } from 'react';
import type { GameProgress } from '@/types/game';
import { DEFAULT_USER_ID, STORAGE_KEY } from '@/types/game';

/**
 * Hook for managing user quest progress with localStorage persistence
 *
 * Multi-user ready:
 * - To add multiple users, call setCurrentUser(newUserId) when user logs in
 * - Each user's progress is stored separately in the users object
 * - Progress persists across browser sessions via localStorage
 *
 * Future enhancements:
 * - Replace localStorage with API calls for server-side persistence
 * - Add user authentication integration
 * - Sync progress across devices
 */
export function useUserProgress() {
  const [progress, setProgress] = useState<GameProgress>(() => {
    // Initialize from localStorage or create default state
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Invalid JSON, use default
        }
      }
    }

    // Default state with single user
    return {
      currentUserId: DEFAULT_USER_ID,
      users: {
        [DEFAULT_USER_ID]: {
          odUserId: DEFAULT_USER_ID,
          completedQuests: [],
        },
      },
    };
  });

  // Persist to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  /**
   * Check if a quest is completed by the current user
   */
  const isQuestCompleted = useCallback(
    (questId: string, userId?: string): boolean => {
      const targetUserId = userId ?? progress.currentUserId;
      const userProgress = progress.users[targetUserId];
      return userProgress?.completedQuests.includes(questId) ?? false;
    },
    [progress]
  );

  /**
   * Mark a quest as completed for the current user
   */
  const completeQuest = useCallback(
    (questId: string, userId?: string): void => {
      const targetUserId = userId ?? progress.currentUserId;

      setProgress((prev) => {
        // Ensure user exists in the users object
        const userProgress = prev.users[targetUserId] ?? {
          odUserId: targetUserId,
          completedQuests: [],
        };

        // Don't add duplicate completions
        if (userProgress.completedQuests.includes(questId)) {
          return prev;
        }

        return {
          ...prev,
          users: {
            ...prev.users,
            [targetUserId]: {
              ...userProgress,
              completedQuests: [...userProgress.completedQuests, questId],
            },
          },
        };
      });
    },
    [progress.currentUserId]
  );

  /**
   * Get all completed quest IDs for the current user
   */
  const getCompletedQuests = useCallback(
    (userId?: string): string[] => {
      const targetUserId = userId ?? progress.currentUserId;
      return progress.users[targetUserId]?.completedQuests ?? [];
    },
    [progress]
  );

  /**
   * Set the current user (for multi-user support)
   * Creates a new user entry if they don't exist
   */
  const setCurrentUser = useCallback((userId: string): void => {
    setProgress((prev) => {
      // Create user if doesn't exist
      const userExists = userId in prev.users;
      return {
        ...prev,
        currentUserId: userId,
        users: userExists
          ? prev.users
          : {
              ...prev.users,
              [userId]: {
                odUserId: userId,
                completedQuests: [],
              },
            },
      };
    });
  }, []);

  /**
   * Reset progress for current user (useful for testing/replay)
   */
  const resetProgress = useCallback(
    (userId?: string): void => {
      const targetUserId = userId ?? progress.currentUserId;
      setProgress((prev) => ({
        ...prev,
        users: {
          ...prev.users,
          [targetUserId]: {
            odUserId: targetUserId,
            completedQuests: [],
          },
        },
      }));
    },
    [progress.currentUserId]
  );

  return {
    currentUserId: progress.currentUserId,
    isQuestCompleted,
    completeQuest,
    getCompletedQuests,
    setCurrentUser,
    resetProgress,
    completedCount: getCompletedQuests().length,
  };
}

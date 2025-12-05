import { useState, useEffect } from 'react';
import { gameApi, type Team, type GameUser } from '@/services/gameApi';

interface LoginModalProps {
  onLogin: (user: GameUser) => void;
}

export function LoginModal({ onLogin }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [error, setError] = useState('');

  // Load teams on mount
  useEffect(() => {
    async function loadTeams() {
      try {
        const fetchedTeams = await gameApi.getTeams();
        setTeams(fetchedTeams);
        if (fetchedTeams.length > 0) {
          setSelectedTeamId(fetchedTeams[0].id);
        }
      } catch (err) {
        setError('Failed to load teams. Please try again.');
        console.error('Failed to load teams:', err);
      } finally {
        setIsLoadingTeams(false);
      }
    }
    loadTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!selectedTeamId) {
      setError('Please select a team');
      return;
    }

    setIsLoading(true);
    try {
      const response = await gameApi.login(username.trim(), selectedTeamId);
      onLogin(response.data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f0f1e] border-4 border-[#ffd700] p-6 sm:p-8 max-w-md w-full mx-4 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-retro text-[#ffd700] text-lg sm:text-xl mb-2">
            QUEST RPG
          </h2>
          <p className="font-retro text-[#888] text-[10px] sm:text-xs">
            Enter your name and join a team
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block font-retro text-[#f0f0f0] text-xs mb-2">
              HERO NAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              className="w-full px-4 py-3 bg-[#1a1a2e] border-2 border-[#4a4a6a] text-[#f0f0f0] font-retro text-sm focus:border-[#ffd700] focus:outline-none placeholder-[#666]"
              disabled={isLoading}
            />
          </div>

          {/* Team Selection */}
          <div>
            <label className="block font-retro text-[#f0f0f0] text-xs mb-2">
              SELECT TEAM
            </label>
            {isLoadingTeams ? (
              <div className="text-center py-4">
                <span className="font-retro text-[#888] text-xs animate-pulse">
                  Loading teams...
                </span>
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center py-4">
                <span className="font-retro text-[#ff4444] text-xs">
                  No teams available
                </span>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => setSelectedTeamId(team.id)}
                    disabled={isLoading}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-2 transition-colors ${
                      selectedTeamId === team.id
                        ? 'border-[#ffd700] bg-[#2a2a3e]'
                        : 'border-[#4a4a6a] bg-[#1a1a2e] hover:border-[#6a6a8a]'
                    }`}
                  >
                    {/* Team color indicator */}
                    <div
                      className="w-4 h-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: team.color }}
                    />
                    <div className="flex-1 text-left">
                      <span className="font-retro text-[#f0f0f0] text-xs block">
                        {team.name}
                      </span>
                      <span className="font-retro text-[#888] text-[8px]">
                        Score: {team.score} pts
                      </span>
                    </div>
                    {selectedTeamId === team.id && (
                      <div className="text-[#ffd700]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#ff4444]/20 border-2 border-[#ff4444]">
              <p className="font-retro text-[#ff4444] text-[10px] text-center">
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isLoadingTeams || !username.trim() || !selectedTeamId}
            className="w-full py-3 bg-[#ffd700] text-[#0f0f1e] font-retro text-sm hover:bg-[#ffed4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'JOINING...' : 'START ADVENTURE'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center font-retro text-[#666] text-[8px]">
          Complete quests to earn points for your team!
        </p>
      </div>
    </div>
  );
}

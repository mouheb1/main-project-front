const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Team {
  id: string;
  name: string;
  description?: string;
  color: string;
  score: number;
  _count?: {
    members: number;
  };
}

export interface GameUser {
  id: string;
  name: string;
  teamId: string;
  team: {
    id: string;
    name: string;
    color: string;
  };
}

export interface LoginResponse {
  status: string;
  data: {
    user: GameUser;
    token: string;
  };
}

export interface TeamsResponse {
  status: string;
  data: {
    teams: Team[];
  };
}

export interface UpdateScoreResponse {
  status: string;
  data: {
    team: Team;
  };
}

class GameApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    this.token = localStorage.getItem('rpg-game-token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('rpg-game-token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('rpg-game-token');
    localStorage.removeItem('rpg-game-user');
  }

  async login(username: string, teamId: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/game-login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, teamId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    const data: LoginResponse = await response.json();

    // Store token and user
    this.setToken(data.data.token);
    localStorage.setItem('rpg-game-user', JSON.stringify(data.data.user));

    return data;
  }

  async getTeams(): Promise<Team[]> {
    const response = await fetch(`${API_URL}/teams`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }

    const data: TeamsResponse = await response.json();
    return data.data.teams;
  }

  async updateTeamScore(teamId: string, points: number, description: string): Promise<UpdateScoreResponse> {
    const response = await fetch(`${API_URL}/teams/${teamId}/member-score`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ points, description }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update score' }));
      throw new Error(error.message || 'Failed to update score');
    }

    return response.json();
  }

  getStoredUser(): GameUser | null {
    const stored = localStorage.getItem('rpg-game-user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.getStoredUser();
  }
}

export const gameApi = new GameApiClient();

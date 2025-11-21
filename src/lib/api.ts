// Configuração das URLs base dos microserviços
const API_CONFIG = {
  auth: import.meta.env.VITE_AUTH_URL || 'http://localhost:8081',
  bets: import.meta.env.VITE_BETS_URL || 'http://localhost:8082',
  matches: import.meta.env.VITE_MATCHES_URL || 'http://localhost:8083',
  history: import.meta.env.VITE_HISTORY_URL || 'http://localhost:8084',
};

// Tipos
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  startsAt: string;
  status: string;
}

export interface Market {
  id: number;
  matchId: number;
  type: string;
  selections: Array<{
    code: string;
    odds: number;
  }>;
}

export interface CreateBetRequest {
  matchId: number;
  marketId: number;
  selectionCode: string;
  odds: number;
  stake: number;
}

export interface BetResponse {
  id: number;
  userId: number;
  matchId: number;
  marketId: number;
  selectionCode: string;
  odds: number;
  stake: number;
  potentialReturn: number;
  status: string;
  result: string | null;
  createdAt: string;
  settledAt: string | null;
}

// Auth Service
export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_CONFIG.auth}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao fazer login' }));
      throw new Error(error.message || 'Erro ao fazer login');
    }
    
    return response.json();
  },

  register: async (data: RegisterRequest): Promise<void> => {
    const response = await fetch(`${API_CONFIG.auth}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao criar conta' }));
      
      // Tratamento específico para email duplicado
      if (response.status === 500 && error.message?.includes('Unique index')) {
        throw new Error('Este email já está cadastrado');
      }
      
      throw new Error(error.message || 'Erro ao criar conta');
    }
  },
};

// Bets Service
export const betsService = {
  listMatches: async (): Promise<Match[]> => {
    const response = await fetch(`${API_CONFIG.bets}/matches`);
    if (!response.ok) throw new Error('Erro ao buscar partidas');
    return response.json();
  },

  listMarkets: async (matchId: number): Promise<Market[]> => {
    const response = await fetch(`${API_CONFIG.bets}/markets?matchId=${matchId}`);
    if (!response.ok) throw new Error('Erro ao buscar mercados');
    return response.json();
  },

  createBet: async (data: CreateBetRequest): Promise<BetResponse> => {
    const response = await fetch(`${API_CONFIG.bets}/bets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao criar aposta' }));
      
      if (response.status === 409) {
        throw new Error('As odds mudaram. Por favor, tente novamente.');
      }
      
      throw new Error(error.message || 'Erro ao criar aposta');
    }
    
    return response.json();
  },

  listBets: async (): Promise<BetResponse[]> => {
    const response = await fetch(`${API_CONFIG.bets}/bets`);
    if (!response.ok) throw new Error('Erro ao buscar apostas');
    return response.json();
  },

  getBet: async (id: number): Promise<BetResponse> => {
    const response = await fetch(`${API_CONFIG.bets}/bets/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar aposta');
    return response.json();
  },

  cashout: async (id: number, acceptAmount: number): Promise<BetResponse> => {
    const response = await fetch(`${API_CONFIG.bets}/bets/${id}/cashout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acceptAmount }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao fazer cashout' }));
      throw new Error(error.message || 'Erro ao fazer cashout');
    }
    
    return response.json();
  },
};

// History Service
export const historyService = {
  getHistory: async (): Promise<Match[]> => {
    const response = await fetch(`${API_CONFIG.history}/history`);
    if (!response.ok) throw new Error('Erro ao buscar histórico');
    return response.json();
  },
};

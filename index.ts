export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  settings?: UserSettings;
}

export interface UserSettings {
  defaultAccount?: string;
  defaultTimeframe?: string;
  theme?: string;
  notifications?: boolean;
}

export interface Account {
  _id: string;
  userId: string;
  name: string;
  broker: string;
  accountType: string;
  currency: string;
  initialBalance: number;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  _id: string;
  userId: string;
  accountId: string;
  symbol: string;
  assetClass: string;
  direction: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  entryDate: string;
  exitPrice?: number;
  exitDate?: string;
  stopLoss?: number;
  takeProfit?: number;
  fees?: number;
  pnl?: number;
  pnlPercentage?: number;
  rMultiple?: number;
  status: 'open' | 'closed';
  setupId?: string;
  tags?: string[];
  mistakes?: string[];
  notes?: string;
  rating?: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  _id: string;
  userId: string;
  title: string;
  content: string;
  type: 'daily' | 'weekly' | 'monthly' | 'pre-market' | 'post-session' | 'other';
  tags?: string[];
  relatedTrades?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Setup {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  rules?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin?: number;
  largestLoss?: number;
  netProfit: number;
  grossProfit: number;
  grossLoss: number;
  expectancy: number;
  sharpeRatio?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface TradeFormData {
  accountId: string;
  symbol: string;
  assetClass: string;
  direction: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  entryDate: string;
  exitPrice?: number;
  exitDate?: string;
  stopLoss?: number;
  takeProfit?: number;
  fees?: number;
  setupId?: string;
  tags?: string[];
  mistakes?: string[];
  notes?: string;
  rating?: number;
  images?: string[];
}

export interface JournalEntryFormData {
  title: string;
  content: string;
  type: 'daily' | 'weekly' | 'monthly' | 'pre-market' | 'post-session' | 'other';
  tags?: string[];
  relatedTrades?: string[];
}

export interface AccountFormData {
  name: string;
  broker: string;
  accountType: string;
  currency: string;
  initialBalance: number;
}

export interface SetupFormData {
  name: string;
  description?: string;
  rules?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  total?: number;
  pagination?: {
    next?: {
      page: number;
      limit: number;
    };
    prev?: {
      page: number;
      limit: number;
    };
  };
}

// Exportações de todos os tipos

// Tipos de usuário
export * from './user';

// Tipos de autenticação
export * from './auth';

// Tipos de banco de dados
export * from './database';

// Tipos de exercícios
export * from './exercise';

// Tipos de treinos
export * from './workout';

// Tipos de gráficos
export * from './charts';

// Tipos gerais da aplicação
export interface AppConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  features: {
    offlineMode: boolean;
    analytics: boolean;
    socialFeatures: boolean;
    premiumFeatures: boolean;
  };
}

export interface AppState {
  isLoading: boolean;
  isOnline: boolean;
  lastSync: Date | null;
  pendingSyncItems: number;
  error: string | null;
}

export interface NavigationState {
  currentRoute: string;
  previousRoute?: string;
  params?: Record<string, any>;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    fontWeight: {
      light: string;
      normal: string;
      medium: string;
      bold: string;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  units: {
    weight: 'kg' | 'lbs';
    distance: 'km' | 'miles';
    temperature: 'celsius' | 'fahrenheit';
  };
  notifications: {
    workoutReminders: boolean;
    achievementAlerts: boolean;
    weeklyReports: boolean;
    socialUpdates: boolean;
  };
  privacy: {
    shareWorkouts: boolean;
    shareProgress: boolean;
    allowAnalytics: boolean;
  };
  workout: {
    defaultRestTime: number;
    autoStartTimer: boolean;
    soundEffects: boolean;
    vibration: boolean;
  };
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export interface SearchOptions {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface QueryOptions {
  sort?: SortOptions;
  filter?: FilterOptions;
  search?: SearchOptions;
  pagination?: PaginationOptions;
}
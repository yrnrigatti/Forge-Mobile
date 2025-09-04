// Constantes da aplicação

// Configurações de tempo
export const TIME_CONSTANTS = {
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutos
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  RETRY_DELAY: 1000, // 1 segundo
  MAX_RETRIES: 3,
} as const;

// Configurações de UI
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  TOAST_DURATION: 3000,
} as const;

// Configurações de banco de dados
export const DB_CONSTANTS = {
  BATCH_SIZE: 100,
  MAX_CACHE_SIZE: 1000,
} as const;

// Configurações de exercícios
export const EXERCISE_CONSTANTS = {
  MIN_WEIGHT: 0,
  MAX_WEIGHT: 1000,
  MIN_REPS: 1,
  MAX_REPS: 100,
  MIN_SETS: 1,
  MAX_SETS: 20,
  DEFAULT_REST_TIME: 60, // segundos
} as const;

// Grupos musculares
export const MUSCLE_GROUPS = [
  'Peito',
  'Costas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Pernas',
  'Glúteos',
  'Abdômen',
  'Cardio',
] as const;

export type MuscleGroup = typeof MUSCLE_GROUPS[number];

// Tipos de exercício
export const EXERCISE_TYPES = [
  'Força',
  'Cardio',
  'Flexibilidade',
  'Funcional',
] as const;

export type ExerciseType = typeof EXERCISE_TYPES[number];

// Status de sincronização
export const SYNC_STATUS = {
  PENDING: 'pending',
  SYNCING: 'syncing',
  SYNCED: 'synced',
  ERROR: 'error',
} as const;

export type SyncStatus = typeof SYNC_STATUS[keyof typeof SYNC_STATUS];

// Configurações de gráficos
export const CHART_CONSTANTS = {
  DEFAULT_CHART_HEIGHT: 200,
  DEFAULT_CHART_WIDTH: 300,
  ANIMATION_DURATION: 1000,
} as const;
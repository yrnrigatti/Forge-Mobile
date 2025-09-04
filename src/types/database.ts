// Tipos relacionados ao banco de dados

export interface DatabaseUser {
  id: string;
  supabaseId: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  syncedAt: Date;
}

export interface DatabaseExercise {
  id: string;
  supabaseId?: string;
  name: string;
  description?: string;
  muscleGroup: string;
  type: string;
  instructions?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export interface DatabaseWorkout {
  id: string;
  supabaseId?: string;
  userId: string;
  name: string;
  date: Date;
  duration: number; // em minutos
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export interface DatabaseWorkoutExercise {
  id: string;
  supabaseId?: string;
  workoutId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number; // em kg
  restTime: number; // em segundos
  notes?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export interface DatabaseSyncQueue {
  id: string;
  table: string;
  recordId: string;
  operation: 'create' | 'update' | 'delete';
  data: any;
  attempts: number;
  lastAttempt?: Date;
  createdAt: Date;
}

// Tipos para operações de sincronização
export type SyncOperation = 'create' | 'update' | 'delete';

export interface SyncQueueItem {
  table: string;
  recordId: string;
  operation: SyncOperation;
  data: any;
  attempts?: number;
  lastAttempt?: Date;
}

// Tipos para estatísticas do banco de dados
export interface DatabaseWorkoutStats {
  totalWorkouts: number;
  totalDuration: number; // em minutos
  averageDuration: number;
  totalVolume: number; // peso total levantado
  favoriteExercises: Array<{
    exerciseId: string;
    exerciseName: string;
    count: number;
  }>;
  muscleGroupDistribution: Array<{
    muscleGroup: string;
    count: number;
    percentage: number;
  }>;
  weeklyFrequency: number;
  monthlyFrequency: number;
}

export interface DatabaseExerciseStats {
  exerciseId: string;
  exerciseName: string;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  maxWeight: number;
  averageWeight: number;
  lastPerformed?: Date;
  progressData: Array<{
    date: Date;
    weight: number;
    volume: number;
  }>;
}

// Tipos para filtros e consultas do banco de dados
export interface DatabaseWorkoutFilter {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  muscleGroups?: string[];
  exerciseIds?: string[];
  minDuration?: number;
  maxDuration?: number;
}

export interface DatabaseExerciseFilter {
  muscleGroups?: string[];
  types?: string[];
  searchTerm?: string;
}

// Tipos para backup e restore
export interface DatabaseBackup {
  version: string;
  timestamp: Date;
  users: DatabaseUser[];
  exercises: DatabaseExercise[];
  workouts: DatabaseWorkout[];
  workoutExercises: DatabaseWorkoutExercise[];
}

export interface RestoreOptions {
  clearExisting: boolean;
  mergeStrategy: 'overwrite' | 'skip' | 'merge';
  validateData: boolean;
}
// Tipos relacionados a treinos

import { Exercise, WorkoutExercise, ExerciseSet } from './exercise';

export interface Workout {
  id: string;
  userId: string;
  name: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  duration: number; // em minutos
  exercises: WorkoutExercise[];
  notes?: string;
  templateId?: string;
  status: WorkoutStatus;
  totalVolume: number; // peso total levantado
  totalSets: number;
  totalReps: number;
  averageRestTime: number;
  muscleGroups: string[];
  tags?: string[];
  rating?: number; // 1-5 estrelas
  createdAt: Date;
  updatedAt: Date;
}

export type WorkoutStatus = 
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'paused';

export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exercises: WorkoutExerciseTemplate[];
  estimatedDuration: number; // em minutos
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: WorkoutCategory;
  tags?: string[];
  isPublic: boolean;
  usageCount: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutExerciseTemplate {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  targetSets: number;
  targetReps: number;
  targetWeight?: number;
  targetRestTime: number;
  notes?: string;
  order: number;
  supersetGroup?: string;
}

export type WorkoutCategory = 
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'powerlifting'
  | 'bodybuilding'
  | 'crossfit'
  | 'hiit'
  | 'circuit'
  | 'full_body'
  | 'upper_body'
  | 'lower_body'
  | 'push'
  | 'pull'
  | 'legs'
  | 'custom';

export interface WorkoutSession {
  id: string;
  workoutId: string;
  startTime: Date;
  endTime?: Date;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isPaused: boolean;
  pausedAt?: Date;
  totalPauseTime: number; // em segundos
  restTimer?: {
    startTime: Date;
    duration: number;
    isActive: boolean;
  };
}

export interface WorkoutFilter {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: WorkoutStatus[];
  categories?: WorkoutCategory[];
  muscleGroups?: string[];
  exerciseIds?: string[];
  templateIds?: string[];
  minDuration?: number;
  maxDuration?: number;
  minVolume?: number;
  maxVolume?: number;
  tags?: string[];
  searchTerm?: string;
}

export interface WorkoutSort {
  field: 'date' | 'name' | 'duration' | 'volume' | 'rating' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number; // em minutos
  averageDuration: number;
  totalVolume: number;
  averageVolume: number;
  totalSets: number;
  totalReps: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
  currentStreak: number;
  longestStreak: number;
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
  categoryDistribution: Array<{
    category: WorkoutCategory;
    count: number;
    percentage: number;
  }>;
  weeklyFrequency: number;
  monthlyFrequency: number;
  progressTrend: 'improving' | 'declining' | 'stable';
}

export interface WorkoutProgress {
  date: Date;
  volume: number;
  duration: number;
  exercises: number;
  sets: number;
  reps: number;
  averageWeight: number;
  workoutId: string;
}

export interface WorkoutAnalysis {
  workoutId: string;
  volumeComparison: {
    current: number;
    previous: number;
    change: number;
    changePercentage: number;
  };
  durationComparison: {
    current: number;
    average: number;
    change: number;
  };
  exercisePerformance: Array<{
    exerciseId: string;
    exerciseName: string;
    improvement: number;
    trend: 'improving' | 'declining' | 'stable';
  }>;
  recommendations: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  type: 'volume' | 'duration' | 'frequency' | 'streak' | 'pr' | 'milestone';
  title: string;
  description: string;
  value: number;
  unit: string;
  date: Date;
  workoutId?: string;
  exerciseId?: string;
}

// Tipos para criação e edição
export interface CreateWorkoutData {
  name: string;
  date?: Date;
  templateId?: string;
  notes?: string;
  exercises?: CreateWorkoutExerciseData[];
}

export interface CreateWorkoutExerciseData {
  exerciseId: string;
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  targetRestTime?: number;
  notes?: string;
  order: number;
}

export interface UpdateWorkoutData extends Partial<CreateWorkoutData> {
  id: string;
  status?: WorkoutStatus;
  startTime?: Date;
  endTime?: Date;
  rating?: number;
  tags?: string[];
}

export interface CreateTemplateData {
  name: string;
  description?: string;
  category: WorkoutCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: CreateWorkoutExerciseData[];
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateTemplateData extends Partial<CreateTemplateData> {
  id: string;
}

// Tipos para validação
export interface WorkoutValidation {
  name: { isValid: boolean; errors: string[] };
  date: { isValid: boolean; errors: string[] };
  exercises: { isValid: boolean; errors: string[] };
  duration: { isValid: boolean; errors: string[] };
}

export interface TemplateValidation {
  name: { isValid: boolean; errors: string[] };
  category: { isValid: boolean; errors: string[] };
  difficulty: { isValid: boolean; errors: string[] };
  exercises: { isValid: boolean; errors: string[] };
}

// Tipos para relatórios
export interface WorkoutReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: WorkoutStats;
  workouts: Workout[];
  progress: WorkoutProgress[];
  achievements: Achievement[];
  insights: string[];
  recommendations: string[];
}

export interface WeeklyReport extends WorkoutReport {
  weekNumber: number;
  year: number;
  dailyBreakdown: Array<{
    date: Date;
    workouts: number;
    duration: number;
    volume: number;
  }>;
}

export interface MonthlyReport extends WorkoutReport {
  month: number;
  year: number;
  weeklyBreakdown: Array<{
    week: number;
    workouts: number;
    duration: number;
    volume: number;
  }>;
}

// Tipos para exportação/importação
export interface WorkoutExport {
  version: string;
  exportDate: Date;
  userId: string;
  workouts: Workout[];
  templates: WorkoutTemplate[];
  exercises: Exercise[];
}

export interface ImportOptions {
  mergeStrategy: 'overwrite' | 'skip' | 'merge';
  validateData: boolean;
  preserveIds: boolean;
}

// Tipos para notificações
export interface WorkoutReminder {
  id: string;
  userId: string;
  workoutId?: string;
  templateId?: string;
  title: string;
  message: string;
  scheduledTime: Date;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[]; // 0-6, domingo = 0
    interval: number;
  };
  isActive: boolean;
  createdAt: Date;
}
// Hooks disponíveis
export { useAuth } from './useAuth';
export { useWorkout } from './useWorkout';
export { useOfflineSync } from './useOfflineSync';
export { useDatabase } from './useDatabase';
export { useCharts } from './useCharts';

// Re-export types
export type {
  WorkoutChartData,
  ExerciseProgressData,
  MuscleGroupStats,
  WorkoutStats,
} from './useCharts';
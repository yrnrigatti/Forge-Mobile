import { useState, useEffect, useCallback } from 'react';
import { database } from '../database';
import { Workout, WorkoutExercise, Exercise } from '../database/models';

// Tipos para dados de gráficos
export interface WorkoutChartData {
  date: string;
  duration: number;
  exercises: number;
  volume: number;
}

export interface ExerciseProgressData {
  date: string;
  exercise: string;
  weight: number;
  reps: number;
  volume: number;
}

export interface MuscleGroupStats {
  muscleGroup: string;
  exercises: number;
  workouts: number;
  totalVolume: number;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalExercises: number;
  totalVolume: number;
  averageDuration: number;
  longestWorkout: number;
  heaviestLift: number;
  favoriteExercise: string;
  mostTrainedMuscle: string;
}

interface UseChartsOptions {
  userId?: string;
  timeRange?: 'week' | 'month' | 'quarter' | 'year' | 'all';
  exerciseId?: string;
}

interface UseChartsReturn {
  // Dados
  workoutData: WorkoutChartData[];
  exerciseProgress: ExerciseProgressData[];
  muscleGroupStats: MuscleGroupStats[];
  workoutStats: WorkoutStats;
  
  // Estados
  isLoading: boolean;
  error: string | null;
  
  // Ações
  refreshData: () => Promise<void>;
  setTimeRange: (range: 'week' | 'month' | 'quarter' | 'year' | 'all') => void;
  getExerciseProgress: (exerciseId: string) => Promise<ExerciseProgressData[]>;
}

export const useCharts = (options: UseChartsOptions = {}): UseChartsReturn => {
  const { userId, exerciseId } = options;
  const [timeRange, setTimeRangeState] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>(
    options.timeRange || 'month'
  );
  
  const [workoutData, setWorkoutData] = useState<WorkoutChartData[]>([]);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgressData[]>([]);
  const [muscleGroupStats, setMuscleGroupStats] = useState<MuscleGroupStats[]>([]);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalExercises: 0,
    totalVolume: 0,
    averageDuration: 0,
    longestWorkout: 0,
    heaviestLift: 0,
    favoriteExercise: '',
    mostTrainedMuscle: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calcular período baseado no timeRange
  const getDateRange = useCallback(() => {
    const now = new Date();
    const start = new Date();
    
    switch (timeRange) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        start.setFullYear(2020); // Data bem antiga
        break;
    }
    
    return { start: start.getTime(), end: now.getTime() };
  }, [timeRange]);

  // Carregar dados de treinos
  const loadWorkoutData = useCallback(async () => {
    try {
      const { start, end } = getDateRange();
      
      // Buscar treinos no período
      const workouts = await database.collections
        .get<Workout>('workouts')
        .query(
          // Adicionar filtros quando Q estiver disponível
          // Q.where('date', Q.gte(start)),
          // Q.where('date', Q.lte(end)),
          // userId ? Q.where('user_id', userId) : Q.where('user_id', Q.notEq(''))
        )
        .fetch();

      // Filtrar por período manualmente (temporário)
      const filteredWorkouts = workouts.filter(w => 
        w.date.getTime() >= start && w.date.getTime() <= end && (!userId || w.userId === userId)
      );

      // Buscar exercícios dos treinos
      const workoutIds = filteredWorkouts.map(w => w.id);
      const workoutExercises = await database.collections
        .get<WorkoutExercise>('workout_exercises')
        .query()
        .fetch();

      const filteredWorkoutExercises = workoutExercises.filter(we => 
        workoutIds.includes(we.workoutId)
      );

      // Agrupar dados por data
      const dataByDate = new Map<string, {
        duration: number;
        exercises: number;
        volume: number;
      }>();

      filteredWorkouts.forEach(workout => {
        const dateKey = new Date(workout.date).toISOString().split('T')[0];
        const workoutExs = filteredWorkoutExercises.filter(we => we.workoutId === workout.id);
        
        const volume = workoutExs.reduce((sum, we) => {
          try {
            const weights = JSON.parse(String(we.weight) || '[]');
            const reps = JSON.parse(String(we.reps) || '[]');
            
            return sum + weights.reduce((exSum: number, weight: number, index: number) => {
              const rep = reps[index] || 0;
              return exSum + (weight * rep);
            }, 0);
          } catch {
            return sum;
          }
        }, 0);

        const existing = dataByDate.get(dateKey) || { duration: 0, exercises: 0, volume: 0 };
        dataByDate.set(dateKey, {
          duration: existing.duration + (workout.duration || 0),
          exercises: existing.exercises + workoutExs.length,
          volume: existing.volume + volume,
        });
      });

      // Converter para array ordenado
      const chartData: WorkoutChartData[] = Array.from(dataByDate.entries())
        .map(([date, data]) => ({
          date,
          duration: data.duration,
          exercises: data.exercises,
          volume: data.volume,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setWorkoutData(chartData);
      
    } catch (err) {
      console.error('Erro ao carregar dados de treino:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  }, [getDateRange, userId]);

  // Carregar estatísticas de grupos musculares
  const loadMuscleGroupStats = useCallback(async () => {
    try {
      const { start, end } = getDateRange();
      
      // Buscar todos os exercícios
      const exercises = await database.collections
        .get<Exercise>('exercises')
        .query()
        .fetch();

      // Buscar treinos e exercícios do período
      const workouts = await database.collections
        .get<Workout>('workouts')
        .query()
        .fetch();

      const filteredWorkouts = workouts.filter(w => 
        w.date.getTime() >= start && w.date.getTime() <= end && (!userId || w.userId === userId)
      );

      const workoutIds = filteredWorkouts.map(w => w.id);
      const workoutExercises = await database.collections
        .get<WorkoutExercise>('workout_exercises')
        .query()
        .fetch();

      const filteredWorkoutExercises = workoutExercises.filter(we => 
        workoutIds.includes(we.workoutId)
      );

      // Agrupar por grupo muscular
      const muscleGroupMap = new Map<string, {
        exercises: Set<string>;
        workouts: Set<string>;
        totalVolume: number;
      }>();

      filteredWorkoutExercises.forEach(we => {
        const exercise = exercises.find(e => e.id === we.exerciseId);
        if (!exercise) return;

        const current = muscleGroupMap.get(exercise.muscleGroup) || {
          exercises: new Set(),
          workouts: new Set(),
          totalVolume: 0,
        };

        current.exercises.add(we.exerciseId);
        current.workouts.add(we.workoutId);
        
        // Calcular volume
        try {
          const weights = JSON.parse(String(we.weight) || '[]');
          const reps = JSON.parse(String(we.reps) || '[]');
          
          const volume = weights.reduce((sum: number, weight: number, index: number) => {
            const rep = reps[index] || 0;
            return sum + (weight * rep);
          }, 0);
          
          current.totalVolume += volume;
        } catch {
          // Ignorar erros de parsing
        }

        muscleGroupMap.set(exercise.muscleGroup, current);
      });

      const muscleStats: MuscleGroupStats[] = Array.from(muscleGroupMap.entries())
        .map(([muscleGroup, data]) => ({
          muscleGroup,
          exercises: data.exercises.size,
          workouts: data.workouts.size,
          totalVolume: data.totalVolume,
        }))
        .sort((a, b) => b.exercises - a.exercises);

      setMuscleGroupStats(muscleStats);
      
    } catch (err) {
      console.error('Erro ao carregar estatísticas de grupos musculares:', err);
    }
  }, [getDateRange, userId]);

  // Carregar estatísticas gerais
  const loadWorkoutStats = useCallback(async () => {
    try {
      const { start, end } = getDateRange();
      
      // Buscar dados
      const workouts = await database.collections
        .get<Workout>('workouts')
        .query()
        .fetch();

      const filteredWorkouts = workouts.filter(w => 
        w.date.getTime() >= start && w.date.getTime() <= end && (!userId || w.userId === userId)
      );

      const workoutIds = filteredWorkouts.map(w => w.id);
      const workoutExercises = await database.collections
        .get<WorkoutExercise>('workout_exercises')
        .query()
        .fetch();

      const filteredWorkoutExercises = workoutExercises.filter(we => 
        workoutIds.includes(we.workoutId)
      );

      const exercises = await database.collections
        .get<Exercise>('exercises')
        .query()
        .fetch();

      // Calcular estatísticas
      const totalWorkouts = filteredWorkouts.length;
      const totalExercises = filteredWorkoutExercises.length;
      
      let totalVolume = 0;
      let heaviestLift = 0;
      const exerciseCounts = new Map<string, number>();
      const muscleCounts = new Map<string, number>();

      filteredWorkoutExercises.forEach(we => {
        const exercise = exercises.find(e => e.id === we.exerciseId);
        if (!exercise) return;

        // Contar exercícios
        exerciseCounts.set(exercise.name, (exerciseCounts.get(exercise.name) || 0) + 1);
        muscleCounts.set(exercise.muscleGroup, (muscleCounts.get(exercise.muscleGroup) || 0) + 1);

        try {
          const weights = JSON.parse(String(we.weight) || '[]');
          const reps = JSON.parse(String(we.reps) || '[]');
          
          weights.forEach((weight: number, index: number) => {
            const rep = reps[index] || 0;
            totalVolume += weight * rep;
            heaviestLift = Math.max(heaviestLift, weight);
          });
        } catch {
          // Ignorar erros
        }
      });

      const totalDuration = filteredWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
      const averageDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
      const longestWorkout = Math.max(...filteredWorkouts.map(w => w.duration || 0), 0);
      
      const favoriteExercise = Array.from(exerciseCounts.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '';
      
      const mostTrainedMuscle = Array.from(muscleCounts.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      setWorkoutStats({
        totalWorkouts,
        totalExercises,
        totalVolume,
        averageDuration,
        longestWorkout,
        heaviestLift,
        favoriteExercise,
        mostTrainedMuscle,
      });
      
    } catch (err) {
      console.error('Erro ao carregar estatísticas gerais:', err);
    }
  }, [getDateRange, userId]);

  // Buscar progresso de exercício específico
  const getExerciseProgress = useCallback(async (exerciseId: string): Promise<ExerciseProgressData[]> => {
    try {
      const workoutExercises = await database.collections
        .get<WorkoutExercise>('workout_exercises')
        .query(
          // Q.where('exercise_id', exerciseId)
        )
        .fetch();

      const filteredWE = workoutExercises.filter(we => we.exerciseId === exerciseId);

      // Buscar treinos relacionados
      const workoutIds = filteredWE.map(we => we.workoutId);
      const workouts = await database.collections
        .get<Workout>('workouts')
        .query()
        .fetch();

      const relatedWorkouts = workouts.filter(w => workoutIds.includes(w.id));

      // Buscar dados do exercício
      const exercise = await database.collections
        .get<Exercise>('exercises')
        .find(exerciseId);

      const progressData: ExerciseProgressData[] = [];

      filteredWE.forEach(we => {
        const workout = relatedWorkouts.find(w => w.id === we.workoutId);
        if (!workout) return;

        try {
          const weights = JSON.parse(String(we.weight) || '[]');
          const reps = JSON.parse(String(we.reps) || '[]');
          
          const maxWeight = Math.max(...weights, 0);
          const totalReps = reps.reduce((sum: number, rep: number) => sum + rep, 0);
          const volume = weights.reduce((sum: number, weight: number, index: number) => {
            const rep = reps[index] || 0;
            return sum + (weight * rep);
          }, 0);

          progressData.push({
            date: new Date(workout.date).toISOString(),
            exercise: exercise.name,
            weight: maxWeight,
            reps: totalReps,
            volume,
          });
        } catch {
          // Ignorar erros
        }
      });

      return progressData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
    } catch (err) {
      console.error('Erro ao buscar progresso do exercício:', err);
      return [];
    }
  }, []);

  // Carregar progresso do exercício específico
  const loadExerciseProgress = useCallback(async () => {
    if (!exerciseId) {
      setExerciseProgress([]);
      return;
    }
    
    const progress = await getExerciseProgress(exerciseId);
    setExerciseProgress(progress);
  }, [exerciseId, getExerciseProgress]);

  // Atualizar todos os dados
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await Promise.all([
        loadWorkoutData(),
        loadMuscleGroupStats(),
        loadWorkoutStats(),
        loadExerciseProgress(),
      ]);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [loadWorkoutData, loadMuscleGroupStats, loadWorkoutStats, loadExerciseProgress]);

  // Atualizar timeRange
  const setTimeRange = useCallback((range: 'week' | 'month' | 'quarter' | 'year' | 'all') => {
    setTimeRangeState(range);
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    workoutData,
    exerciseProgress,
    muscleGroupStats,
    workoutStats,
    isLoading,
    error,
    refreshData,
    setTimeRange,
    getExerciseProgress,
  };
};
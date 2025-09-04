import React, { createContext, useContext, useState, ReactNode } from 'react';
import { database, Workout, Exercise, WorkoutExercise } from '../database';
import { syncService } from '../services/syncService';
import { useAuth } from './AuthContext';
import { Q } from '@nozbe/watermelondb';

interface WorkoutContextType {
  // Estado
  currentWorkout: Workout | null;
  workouts: Workout[];
  exercises: Exercise[];
  loading: boolean;
  
  // Ações de Workout
  createWorkout: (name: string, date?: Date) => Promise<Workout | null>;
  updateWorkout: (workoutId: string, updates: Partial<{ name: string; notes: string; duration: number }>) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  setCurrentWorkout: (workout: Workout | null) => void;
  
  // Ações de Exercise
  addExerciseToWorkout: (workoutId: string, exerciseId: string, sets: number, reps: number, weight: number, restTime?: number, notes?: string) => Promise<void>;
  updateWorkoutExercise: (workoutExerciseId: string, updates: Partial<{ sets: number; reps: number; weight: number; restTime: number; notes: string }>) => Promise<void>;
  removeExerciseFromWorkout: (workoutExerciseId: string) => Promise<void>;
  
  // Carregamento de dados
  loadWorkouts: () => Promise<void>;
  loadExercises: () => Promise<void>;
  loadWorkoutById: (workoutId: string) => Promise<Workout | null>;
}

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
  children: ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
  const { user } = useAuth();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  // Criar novo treino
  const createWorkout = async (name: string, date: Date = new Date()): Promise<Workout | null> => {
    if (!user) return null;
    
    setLoading(true);
    try {
      let newWorkout: Workout | null = null;
      
      await database.write(async () => {
        newWorkout = await database.collections.get<Workout>('workouts').create(record => {
          record.userId = user.id;
          record.name = name;
          record.date = date;
          record.duration = 0;
          record.notes = '';
        });
      });
      
      if (newWorkout) {
        // Adicionar à fila de sincronização
        await syncService.addToSyncQueue('workouts', (newWorkout as any).id, 'create', {
          user_id: user.id,
          name,
          date: date.toISOString(),
          duration: 0,
          notes: '',
        });
        
        // Atualizar lista local
        await loadWorkouts();
        
        return newWorkout;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar treino
  const updateWorkout = async (workoutId: string, updates: Partial<{ name: string; notes: string; duration: number }>) => {
    setLoading(true);
    try {
      const workout = await database.collections.get<Workout>('workouts').find(workoutId);
      
      await database.write(async () => {
        await workout.update(record => {
          if (updates.name !== undefined) (record as any).name = updates.name;
          if (updates.notes !== undefined) (record as any).notes = updates.notes;
          if (updates.duration !== undefined) (record as any).duration = updates.duration;
          (record as any).updatedAt = new Date();
        });
      });
      
      // Adicionar à fila de sincronização
      const syncData: any = {};
      if ((workout as any).supabaseId) {
        syncData.supabase_id = (workout as any).supabaseId;
      }
      if (updates.name !== undefined) syncData.name = updates.name;
      if (updates.notes !== undefined) syncData.notes = updates.notes;
      if (updates.duration !== undefined) syncData.duration = updates.duration;
      
      await syncService.addToSyncQueue('workouts', workoutId, 'update', syncData);
      
      // Atualizar lista local
      await loadWorkouts();
      
      // Atualizar treino atual se for o mesmo
      if (currentWorkout?.id === workoutId) {
        const updatedWorkout = await database.collections.get<Workout>('workouts').find(workoutId);
        setCurrentWorkout(updatedWorkout);
      }
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
    } finally {
      setLoading(false);
    }
  };

  // Deletar treino
  const deleteWorkout = async (workoutId: string) => {
    setLoading(true);
    try {
      const workout = await database.collections.get<Workout>('workouts').find(workoutId);
      
      // Deletar exercícios do treino primeiro
      const workoutExercises = await database.collections
        .get<WorkoutExercise>('workout_exercises')
        .query(Q.where('workout_id', workoutId))
        .fetch();
      
      await database.write(async () => {
        // Deletar exercícios do treino
        for (const workoutExercise of workoutExercises) {
          await workoutExercise.destroyPermanently();
        }
        
        // Deletar treino
        await workout.destroyPermanently();
      });
      
      // Adicionar à fila de sincronização se tiver ID do Supabase
      if ((workout as any).supabaseId) {
        await syncService.addToSyncQueue('workouts', workoutId, 'delete', {
          supabase_id: (workout as any).supabaseId,
        });
      }
      
      // Atualizar lista local
      await loadWorkouts();
      
      // Limpar treino atual se for o mesmo
      if (currentWorkout?.id === workoutId) {
        setCurrentWorkout(null);
      }
    } catch (error) {
      console.error('Erro ao deletar treino:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar exercício ao treino
  const addExerciseToWorkout = async (
    workoutId: string,
    exerciseId: string,
    sets: number,
    reps: number,
    weight: number,
    restTime?: number,
    notes?: string
  ) => {
    setLoading(true);
    try {
      let newWorkoutExercise: WorkoutExercise | null = null;
      
      await database.write(async () => {
        newWorkoutExercise = await database.collections.get<WorkoutExercise>('workout_exercises').create(record => {
          (record as any).workoutId = workoutId;
          (record as any).exerciseId = exerciseId;
          (record as any).sets = sets;
          (record as any).reps = reps.toString();
          (record as any).weight = weight.toString();
          (record as any).restTime = restTime || 60;
          (record as any).notes = notes || '';
        });
      });
      
      if (newWorkoutExercise) {
        // Adicionar à fila de sincronização
        await syncService.addToSyncQueue('workout_exercises', (newWorkoutExercise as any).id, 'create', {
          workout_id: workoutId,
          exercise_id: exerciseId,
          sets,
          reps,
          weight,
          rest_time: restTime || 60,
          notes: notes || '',
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar exercício ao treino:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar exercício do treino
  const updateWorkoutExercise = async (
    workoutExerciseId: string,
    updates: Partial<{ sets: number; reps: number; weight: number; restTime: number; notes: string }>
  ) => {
    setLoading(true);
    try {
      const workoutExercise = await database.collections.get<WorkoutExercise>('workout_exercises').find(workoutExerciseId);
      
      await database.write(async () => {
        await workoutExercise.update(record => {
          if (updates.sets !== undefined) (record as any).sets = updates.sets;
          if (updates.reps !== undefined) (record as any).reps = updates.reps.toString();
          if (updates.weight !== undefined) (record as any).weight = updates.weight.toString();
          if (updates.restTime !== undefined) (record as any).restTime = updates.restTime;
          if (updates.notes !== undefined) (record as any).notes = updates.notes;
        });
      });
      
      // Adicionar à fila de sincronização
      const syncData: any = {};
      if ((workoutExercise as any).supabaseId) {
        syncData.supabase_id = (workoutExercise as any).supabaseId;
      }
      if (updates.sets !== undefined) syncData.sets = updates.sets;
      if (updates.reps !== undefined) syncData.reps = updates.reps;
      if (updates.weight !== undefined) syncData.weight = updates.weight;
      if (updates.restTime !== undefined) syncData.rest_time = updates.restTime;
      if (updates.notes !== undefined) syncData.notes = updates.notes;
      
      await syncService.addToSyncQueue('workout_exercises', workoutExerciseId, 'update', syncData);
    } catch (error) {
      console.error('Erro ao atualizar exercício do treino:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remover exercício do treino
  const removeExerciseFromWorkout = async (workoutExerciseId: string) => {
    setLoading(true);
    try {
      const workoutExercise = await database.collections.get<WorkoutExercise>('workout_exercises').find(workoutExerciseId);
      
      await database.write(async () => {
        await workoutExercise.destroyPermanently();
      });
      
      // Adicionar à fila de sincronização se tiver ID do Supabase
      if ((workoutExercise as any).supabaseId) {
        await syncService.addToSyncQueue('workout_exercises', workoutExerciseId, 'delete', {
          supabase_id: (workoutExercise as any).supabaseId,
        });
      }
    } catch (error) {
      console.error('Erro ao remover exercício do treino:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar treinos do usuário
  const loadWorkouts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userWorkouts = await database.collections
        .get<Workout>('workouts')
        .query(Q.where('user_id', user.id), Q.sortBy('date', Q.desc))
        .fetch();
      
      setWorkouts(userWorkouts);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar exercícios
  const loadExercises = async () => {
    setLoading(true);
    try {
      const allExercises = await database.collections
        .get<Exercise>('exercises')
        .query(Q.sortBy('name'))
        .fetch();
      
      setExercises(allExercises);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar treino por ID
  const loadWorkoutById = async (workoutId: string): Promise<Workout | null> => {
    try {
      const workout = await database.collections.get<Workout>('workouts').find(workoutId);
      return workout;
    } catch (error) {
      console.error('Erro ao carregar treino:', error);
      return null;
    }
  };

  const value: WorkoutContextType = {
    currentWorkout,
    workouts,
    exercises,
    loading,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    setCurrentWorkout,
    addExerciseToWorkout,
    updateWorkoutExercise,
    removeExerciseFromWorkout,
    loadWorkouts,
    loadExercises,
    loadWorkoutById,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout(): WorkoutContextType {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout deve ser usado dentro de um WorkoutProvider');
  }
  return context;
}
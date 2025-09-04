import { database, User, Exercise, Workout, WorkoutExercise, SyncQueue } from '../database';
import { supabase } from './supabase';
import { Q } from '@nozbe/watermelondb';
import NetInfo from '@react-native-community/netinfo';

class SyncService {
  private isOnline = false;
  private syncInProgress = false;

  constructor() {
    this.initNetworkListener();
  }

  // Inicializar listener de conectividade
  private initNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      // Se voltou online, tentar sincronizar
      if (wasOffline && this.isOnline) {
        this.syncAll();
      }
    });
  }

  // Sincronizar todos os dados
  async syncAll() {
    if (this.syncInProgress || !this.isOnline) return;
    
    this.syncInProgress = true;
    
    try {
      // 1. Baixar dados do servidor
      await this.downloadFromServer();
      
      // 2. Enviar dados locais para o servidor
      await this.uploadToServer();
      
      console.log('Sincronização completa!');
    } catch (error) {
      console.error('Erro na sincronização:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Baixar dados do servidor
  private async downloadFromServer() {
    try {
      // Baixar exercícios
      const { data: exercises } = await supabase
        .from('exercises')
        .select('*');
      
      if (exercises) {
        await this.syncExercisesToLocal(exercises);
      }

      // Baixar treinos do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: workouts } = await supabase
          .from('workouts')
          .select(`
            *,
            workout_exercises (*)
          `)
          .eq('user_id', user.id);
        
        if (workouts) {
          await this.syncWorkoutsToLocal(workouts);
        }
      }
    } catch (error) {
      console.error('Erro ao baixar do servidor:', error);
    }
  }

  // Enviar dados locais para o servidor
  private async uploadToServer() {
    try {
      const syncQueue = await database.collections
        .get<SyncQueue>('sync_queue')
        .query()
        .fetch();

      for (const item of syncQueue) {
        try {
          await this.processSyncItem(item);
          await item.destroyPermanently();
        } catch (error) {
          console.error(`Erro ao sincronizar item ${item.id}:`, error);
          // Incrementar tentativas
          await database.write(async () => {
            await item.update(record => {
              record.attempts += 1;
            });
          });
        }
      }
    } catch (error) {
      console.error('Erro ao enviar para o servidor:', error);
    }
  }

  // Processar item da fila de sincronização
  private async processSyncItem(item: SyncQueue) {
    const data = item.data ? JSON.parse(item.data) : null;
    
    switch (item.tableName) {
      case 'workouts':
        await this.syncWorkoutToServer(item.action, item.recordId, data);
        break;
      case 'workout_exercises':
        await this.syncWorkoutExerciseToServer(item.action, item.recordId, data);
        break;
      default:
        console.warn(`Tabela não suportada para sincronização: ${item.tableName}`);
    }
  }

  // Sincronizar exercícios para o banco local
  private async syncExercisesToLocal(exercises: any[]) {
    await database.write(async () => {
      for (const exercise of exercises) {
        const existingExercise = await database.collections
          .get<Exercise>('exercises')
          .query(Q.where('supabase_id', exercise.id))
          .fetch();

        if (existingExercise.length === 0) {
          await database.collections.get<Exercise>('exercises').create(record => {
            record.supabaseId = exercise.id;
            record.name = exercise.name;
            record.description = exercise.description;
            record.muscleGroup = exercise.muscle_group;
            record.equipment = exercise.equipment;
            record.syncedAt = new Date();
          });
        }
      }
    });
  }

  // Sincronizar treinos para o banco local
  private async syncWorkoutsToLocal(workouts: any[]) {
    await database.write(async () => {
      for (const workout of workouts) {
        const existingWorkout = await database.collections
          .get<Workout>('workouts')
          .query(Q.where('supabase_id', workout.id))
          .fetch();

        if (existingWorkout.length === 0) {
          const newWorkout = await database.collections.get<Workout>('workouts').create(record => {
            record.supabaseId = workout.id;
            record.userId = workout.user_id;
            record.name = workout.name;
            record.date = new Date(workout.date);
            record.duration = workout.duration;
            record.notes = workout.notes;
            record.syncedAt = new Date();
          });

          // Sincronizar exercícios do treino
          for (const workoutExercise of workout.workout_exercises || []) {
            await database.collections.get<WorkoutExercise>('workout_exercises').create(record => {
              record.supabaseId = workoutExercise.id;
              record.workoutId = newWorkout.id;
              record.exerciseId = workoutExercise.exercise_id;
              record.sets = workoutExercise.sets;
              record.reps = workoutExercise.reps;
              record.weight = workoutExercise.weight;
              record.restTime = workoutExercise.rest_time;
              record.notes = workoutExercise.notes;
              record.syncedAt = new Date();
            });
          }
        }
      }
    });
  }

  // Sincronizar treino para o servidor
  private async syncWorkoutToServer(action: string, recordId: string, data: any) {
    switch (action) {
      case 'create':
        const { data: newWorkout, error: createError } = await supabase
          .from('workouts')
          .insert(data)
          .select()
          .single();
        
        if (!createError && newWorkout) {
          // Atualizar o registro local com o ID do Supabase
          const localWorkout = await database.collections
            .get<Workout>('workouts')
            .find(recordId);
          
          await database.write(async () => {
            await localWorkout.update(record => {
              record.supabaseId = newWorkout.id;
              record.syncedAt = new Date();
            });
          });
        }
        break;
        
      case 'update':
        await supabase
          .from('workouts')
          .update(data)
          .eq('id', data.supabase_id);
        break;
        
      case 'delete':
        await supabase
          .from('workouts')
          .delete()
          .eq('id', data.supabase_id);
        break;
    }
  }

  // Sincronizar exercício do treino para o servidor
  private async syncWorkoutExerciseToServer(action: string, recordId: string, data: any) {
    switch (action) {
      case 'create':
        const { data: newWorkoutExercise, error: createError } = await supabase
          .from('workout_exercises')
          .insert(data)
          .select()
          .single();
        
        if (!createError && newWorkoutExercise) {
          const localWorkoutExercise = await database.collections
            .get<WorkoutExercise>('workout_exercises')
            .find(recordId);
          
          await database.write(async () => {
            await localWorkoutExercise.update(record => {
              record.supabaseId = newWorkoutExercise.id;
              record.syncedAt = new Date();
            });
          });
        }
        break;
        
      case 'update':
        await supabase
          .from('workout_exercises')
          .update(data)
          .eq('id', data.supabase_id);
        break;
        
      case 'delete':
        await supabase
          .from('workout_exercises')
          .delete()
          .eq('id', data.supabase_id);
        break;
    }
  }

  // Adicionar item à fila de sincronização
  async addToSyncQueue(tableName: string, recordId: string, action: 'create' | 'update' | 'delete', data?: any) {
    await database.write(async () => {
      await database.collections.get<SyncQueue>('sync_queue').create(record => {
        record.tableName = tableName;
        record.recordId = recordId;
        record.action = action;
        record.data = data ? JSON.stringify(data) : undefined;
        record.attempts = 0;
      });
    });

    // Tentar sincronizar imediatamente se estiver online
    if (this.isOnline) {
      this.syncAll();
    }
  }

  // Verificar se está online
  getIsOnline() {
    return this.isOnline;
  }
}

export const syncService = new SyncService();
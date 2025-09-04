import { supabase, Database } from './supabase';

type Tables = Database['public']['Tables'];
type Exercise = Tables['exercises']['Row'];
type Workout = Tables['workouts']['Row'];
type WorkoutExercise = Tables['workout_exercises']['Row'];
type User = Tables['users']['Row'];

class DatabaseService {
  // ===== EXERCISES =====
  async getExercises() {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');
    
    return { data, error };
  }

  async getExerciseById(id: string) {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  async createExercise(exercise: Tables['exercises']['Insert']) {
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercise)
      .select()
      .single();
    
    return { data, error };
  }

  async updateExercise(id: string, updates: Tables['exercises']['Update']) {
    const { data, error } = await supabase
      .from('exercises')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  async deleteExercise(id: string) {
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);
    
    return { error };
  }

  // ===== WORKOUTS =====
  async getWorkouts(userId: string) {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    return { data, error };
  }

  async getWorkoutById(id: string) {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  async createWorkout(workout: Tables['workouts']['Insert']) {
    const { data, error } = await supabase
      .from('workouts')
      .insert(workout)
      .select()
      .single();
    
    return { data, error };
  }

  async updateWorkout(id: string, updates: Tables['workouts']['Update']) {
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  async deleteWorkout(id: string) {
    // Primeiro deletar os exercícios do treino
    await supabase
      .from('workout_exercises')
      .delete()
      .eq('workout_id', id);
    
    // Depois deletar o treino
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);
    
    return { error };
  }

  // ===== WORKOUT EXERCISES =====
  async getWorkoutExercises(workoutId: string) {
    const { data, error } = await supabase
      .from('workout_exercises')
      .select(`
        *,
        exercises (*)
      `)
      .eq('workout_id', workoutId);
    
    return { data, error };
  }

  async addExerciseToWorkout(workoutExercise: Tables['workout_exercises']['Insert']) {
    const { data, error } = await supabase
      .from('workout_exercises')
      .insert(workoutExercise)
      .select(`
        *,
        exercises (*)
      `)
      .single();
    
    return { data, error };
  }

  async updateWorkoutExercise(id: string, updates: Tables['workout_exercises']['Update']) {
    const { data, error } = await supabase
      .from('workout_exercises')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        exercises (*)
      `)
      .single();
    
    return { data, error };
  }

  async removeExerciseFromWorkout(id: string) {
    const { error } = await supabase
      .from('workout_exercises')
      .delete()
      .eq('id', id);
    
    return { error };
  }

  // ===== USERS =====
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  }

  async updateUserProfile(userId: string, updates: Tables['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  }

  // ===== ANALYTICS =====
  async getWorkoutStats(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('workouts')
      .select('id, date, duration')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString())
      .order('date');
    
    return { data, error };
  }

  async getMuscleGroupStats(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        workout_exercises (
          exercises (
            muscle_group
          )
        )
      `)
      .eq('user_id', userId)
      .gte('date', startDate.toISOString());
    
    return { data, error };
  }
}

export const databaseService = new DatabaseService();
export type { Exercise, Workout, WorkoutExercise, User };
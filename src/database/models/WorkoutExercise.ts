import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import { Workout } from './Workout';
import { Exercise } from './Exercise';

export class WorkoutExercise extends Model {
  static table = 'workout_exercises';
  static associations = {
    workouts: { type: 'belongs_to' as const, key: 'workout_id' },
    exercises: { type: 'belongs_to' as const, key: 'exercise_id' },
  };

  @field('supabase_id') supabaseId?: string;
  @field('workout_id') workoutId?: string;
  @field('exercise_id') exerciseId?: string;
  @field('sets') sets?: number;
  @field('reps') reps?: string;
  @field('weight') weight?: string;
  @field('rest_time') restTime?: number;
  @field('notes') notes?: string;
  @readonly @date('created_at') createdAt?: Date;
  @date('synced_at') syncedAt?: Date;

  @relation('workouts', 'workout_id') workout?: Workout;
  @relation('exercises', 'exercise_id') exercise?: Exercise;
}
import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';
import { WorkoutExercise } from './WorkoutExercise';

export class Workout extends Model {
  static table = 'workouts';
  static associations = {
    workout_exercises: { type: 'has_many' as const, foreignKey: 'workout_id' },
  };

  @field('supabase_id') supabaseId?: string;
  @field('user_id') userId?: string;
  @field('name') name?: string;
  @date('date') date?: Date;
  @field('duration') duration?: number;
  @field('notes') notes?: string;
  @readonly @date('created_at') createdAt?: Date;
  @date('updated_at') updatedAt?: Date;
  @date('synced_at') syncedAt?: Date;

  @children('workout_exercises') workoutExercises?: WorkoutExercise[];
}
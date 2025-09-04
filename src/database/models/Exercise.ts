import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export class Exercise extends Model {
  static table = 'exercises';

  @field('supabase_id') supabaseId?: string;
  @field('name') name?: string;
  @field('description') description?: string;
  @field('muscle_group') muscleGroup?: string;
  @field('equipment') equipment?: string;
  @readonly @date('created_at') createdAt?: Date;
  @date('synced_at') syncedAt?: Date;
}
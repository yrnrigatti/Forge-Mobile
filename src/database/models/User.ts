import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export class User extends Model {
  static table = 'users';

  @field('supabase_id') supabaseId?: string;
  @field('email') email?: string;
  @field('name') name?: string;
  @readonly @date('created_at') createdAt?: Date;
  @date('updated_at') updatedAt?: Date;
  @date('synced_at') syncedAt?: Date;
}
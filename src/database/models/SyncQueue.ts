import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export class SyncQueue extends Model {
  static table = 'sync_queue';

  @field('table_name') tableName?: string;
  @field('record_id') recordId?: string;
  @field('action') action?: 'create' | 'update' | 'delete';
  @field('data') data?: string;
  @readonly @date('created_at') createdAt?: Date;
  @field('attempts') attempts?: number;
}
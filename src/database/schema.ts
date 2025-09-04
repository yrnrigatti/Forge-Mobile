import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 2,
  tables: [
    // Tabela de usuários
    tableSchema({
      name: 'users',
      columns: [
        { name: 'supabase_id', type: 'string', isIndexed: true },
        { name: 'email', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'synced_at', type: 'number', isOptional: true },
      ],
    }),

    // Tabela de exercícios
    tableSchema({
      name: 'exercises',
      columns: [
        { name: 'supabase_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'muscle_group', type: 'string' },
        { name: 'equipment', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'synced_at', type: 'number', isOptional: true },
      ],
    }),

    // Tabela de treinos
    tableSchema({
      name: 'workouts',
      columns: [
        { name: 'supabase_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'date', type: 'number' },
        { name: 'duration', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'synced_at', type: 'number', isOptional: true },
      ],
    }),

    // Tabela de exercícios do treino
    tableSchema({
      name: 'workout_exercises',
      columns: [
        { name: 'supabase_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'workout_id', type: 'string', isIndexed: true },
        { name: 'exercise_id', type: 'string', isIndexed: true },
        { name: 'sets', type: 'number' },
        { name: 'reps', type: 'number' },
        { name: 'weight', type: 'number' },
        { name: 'rest_time', type: 'number', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'synced_at', type: 'number', isOptional: true },
      ],
    }),

    // Tabela de sincronização (para controlar o que precisa ser sincronizado)
    tableSchema({
      name: 'sync_queue',
      columns: [
        { name: 'table_name', type: 'string' },
        { name: 'record_id', type: 'string' },
        { name: 'action', type: 'string' }, // 'create', 'update', 'delete'
        { name: 'data', type: 'string', isOptional: true }, // JSON string
        { name: 'created_at', type: 'number' },
        { name: 'attempts', type: 'number' },
      ],
    }),
  ],
});
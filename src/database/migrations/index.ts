import { schemaMigrations, addColumns, createTable } from '@nozbe/watermelondb/Schema/migrations';

// Migração inicial - versão 1
const migration1 = schemaMigrations({
  migrations: [
    // Versão 2: Criação das tabelas iniciais
    {
      toVersion: 2,
      steps: [
        // Tabela de usuários
        createTable({
          name: 'users',
          columns: [
            { name: 'supabase_id', type: 'string', isIndexed: true },
            { name: 'email', type: 'string', isIndexed: true },
            { name: 'name', type: 'string' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
            { name: 'synced_at', type: 'number', isOptional: true },
          ],
        }),
        
        // Tabela de exercícios
        createTable({
          name: 'exercises',
          columns: [
            { name: 'supabase_id', type: 'string', isOptional: true, isIndexed: true },
            { name: 'name', type: 'string', isIndexed: true },
            { name: 'description', type: 'string', isOptional: true },
            { name: 'muscle_group', type: 'string', isIndexed: true },
            { name: 'equipment', type: 'string', isOptional: true },
            { name: 'created_at', type: 'number' },
            { name: 'synced_at', type: 'number', isOptional: true },
          ],
        }),
        
        // Tabela de treinos
        createTable({
          name: 'workouts',
          columns: [
            { name: 'supabase_id', type: 'string', isOptional: true, isIndexed: true },
            { name: 'user_id', type: 'string', isIndexed: true },
            { name: 'name', type: 'string' },
            { name: 'date', type: 'number', isIndexed: true },
            { name: 'duration', type: 'number', isOptional: true },
            { name: 'notes', type: 'string', isOptional: true },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
            { name: 'synced_at', type: 'number', isOptional: true },
          ],
        }),
        
        // Tabela de exercícios do treino
        createTable({
          name: 'workout_exercises',
          columns: [
            { name: 'supabase_id', type: 'string', isOptional: true, isIndexed: true },
            { name: 'workout_id', type: 'string', isIndexed: true },
            { name: 'exercise_id', type: 'string', isIndexed: true },
            { name: 'sets', type: 'number' },
            { name: 'reps', type: 'string' }, // JSON string para arrays de reps
            { name: 'weight', type: 'string' }, // JSON string para arrays de pesos
            { name: 'rest_time', type: 'number', isOptional: true },
            { name: 'notes', type: 'string', isOptional: true },
            { name: 'created_at', type: 'number' },
            { name: 'synced_at', type: 'number', isOptional: true },
          ],
        }),
        
        // Tabela de fila de sincronização
        createTable({
          name: 'sync_queue',
          columns: [
            { name: 'table_name', type: 'string', isIndexed: true },
            { name: 'record_id', type: 'string', isIndexed: true },
            { name: 'action', type: 'string' }, // 'create', 'update', 'delete'
            { name: 'data', type: 'string' }, // JSON string dos dados
            { name: 'created_at', type: 'number' },
            { name: 'attempts', type: 'number' },
          ],
        }),
      ],
    },
  ],
});

// Futuras migrações podem ser adicionadas aqui
// Exemplo de migração para versão 2:
/*
const migration2 = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'exercises',
          columns: [
            { name: 'difficulty_level', type: 'string', isOptional: true },
            { name: 'instructions', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
  ],
});
*/

export { migration1 };

// Exportar todas as migrações em ordem
export const migrations = migration1;

// Função utilitária para verificar se o banco precisa de migração
export const needsMigration = async (database: any): Promise<boolean> => {
  try {
    // Verificar se as tabelas existem
    const tables = ['users', 'exercises', 'workouts', 'workout_exercises', 'sync_queue'];
    
    for (const tableName of tables) {
      try {
        await database.collections.get(tableName).query().fetch();
      } catch (error) {
        console.log(`Tabela ${tableName} não encontrada, migração necessária`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.log('Erro ao verificar migração:', error);
    return true;
  }
};

// Função para executar migrações pendentes
export const runMigrations = async (database: any): Promise<void> => {
  try {
    console.log('🔄 Verificando migrações pendentes...');
    
    const needsUpdate = await needsMigration(database);
    
    if (needsUpdate) {
      console.log('📦 Executando migrações do banco de dados...');
      // As migrações são executadas automaticamente pelo WatermelonDB
      // quando o banco é inicializado com o schema atualizado
      console.log('✅ Migrações concluídas!');
    } else {
      console.log('✅ Banco de dados já está atualizado');
    }
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    throw error;
  }
};
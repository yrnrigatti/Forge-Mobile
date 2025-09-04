import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schema } from './schema';
import { migrations } from './migrations';
import { User, Exercise, Workout, WorkoutExercise, SyncQueue } from './models';

// Configuração do adaptador LokiJS para web
const adapter = new LokiJSAdapter({
  schema,
  migrations,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  dbName: 'forge_fitness_db',
  onSetUpError: (error) => {
    console.error('Erro ao configurar banco de dados:', error);
  },
});

// Criação da instância do banco de dados
export const database = new Database({
  adapter,
  modelClasses: [
    User,
    Exercise,
    Workout,
    WorkoutExercise,
    SyncQueue,
  ],
});

// Exportar modelos e schema
export { User, Exercise, Workout, WorkoutExercise, SyncQueue };
export { schema };

// Tipos úteis
export type DatabaseCollections = {
  users: User;
  exercises: Exercise;
  workouts: Workout;
  workout_exercises: WorkoutExercise;
  sync_queue: SyncQueue;
};
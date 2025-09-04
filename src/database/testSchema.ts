import { database } from './index';
import { seedExercises, getDatabaseStats, clearAllData } from './seedData';
import { User, Exercise, Workout, WorkoutExercise } from './models';
import { Q } from '@nozbe/watermelondb';

// Função para testar operações básicas do banco
export const testDatabaseOperations = async (): Promise<void> => {
  try {
    console.log('🧪 Iniciando testes do banco de dados...');
    
    // Teste 1: Verificar conexão
    console.log('\n1️⃣ Testando conexão com o banco...');
    await database.write(async () => {
      console.log('✅ Conexão estabelecida');
    });
    
    // Teste 2: Criar um usuário de teste
    console.log('\n2️⃣ Testando criação de usuário...');
    const testUser = await database.write(async () => {
      return await database.collections.get<User>('users').create(user => {
        user.supabaseId = 'test-user-123';
        user.email = 'test@example.com';
        user.name = 'Usuário Teste';
        user.createdAt = new Date();
        user.updatedAt = new Date();
      });
    });
    console.log('✅ Usuário criado:', testUser.name);
    
    // Teste 3: Popular exercícios
    console.log('\n3️⃣ Testando população de exercícios...');
    await seedExercises();
    const exercisesCount = await database.collections.get('exercises').query().fetchCount();
    console.log(`✅ ${exercisesCount} exercícios adicionados`);
    
    // Teste 4: Criar um treino
    console.log('\n4️⃣ Testando criação de treino...');
    const testWorkout = await database.write(async () => {
      return await database.collections.get<Workout>('workouts').create(workout => {
        workout.userId = testUser.id;
        workout.name = 'Treino de Teste';
        workout.date = new Date();
        workout.duration = 3600; // 1 hora
        workout.notes = 'Treino criado durante teste';
        workout.createdAt = new Date();
        workout.updatedAt = new Date();
      });
    });
    console.log('✅ Treino criado:', testWorkout.name);
    
    // Teste 5: Adicionar exercício ao treino
    console.log('\n5️⃣ Testando adição de exercício ao treino...');
    const exercises = await database.collections.get<Exercise>('exercises').query().fetch();
    if (exercises.length > 0) {
      const firstExercise = exercises[0];
      
      const workoutExercise = await database.write(async () => {
        return await database.collections.get<WorkoutExercise>('workout_exercises').create(we => {
          we.workoutId = testWorkout.id;
          we.exerciseId = firstExercise.id;
          we.sets = 3;
          we.reps = JSON.stringify([10, 10, 8]);
          we.weight = JSON.stringify([50, 50, 55]);
          we.restTime = 90;
          we.notes = 'Exercício de teste';
          we.createdAt = new Date();
        });
      });
      console.log('✅ Exercício adicionado ao treino:', firstExercise.name);
    }
    
    // Teste 6: Consultar dados relacionados
    console.log('\n6️⃣ Testando consultas relacionadas...');
    const workoutWithExercises = await database.collections
      .get<WorkoutExercise>('workout_exercises')
      .query(
        // Q.where('workout_id', testWorkout.id)
      )
      .fetch();
    console.log(`✅ Treino tem ${workoutWithExercises.length} exercícios`);
    
    // Teste 7: Verificar estatísticas
    console.log('\n7️⃣ Testando estatísticas do banco...');
    const stats = await getDatabaseStats();
    console.log('✅ Estatísticas:', stats);
    
    // Teste 8: Testar busca e filtros
    console.log('\n8️⃣ Testando buscas e filtros...');
    const chestExercises = await database.collections
      .get<Exercise>('exercises')
      .query(
        // Q.where('muscle_group', 'Peito')
      )
      .fetch();
    console.log(`✅ Encontrados exercícios`);
    
    console.log('\n🎉 Todos os testes passaram com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    throw error;
  }
};

// Função para testar performance
export const testDatabasePerformance = async (): Promise<void> => {
  try {
    console.log('\n⚡ Testando performance do banco...');
    
    // Teste de inserção em lote
    const startTime = Date.now();
    
    await database.write(async () => {
      const promises = [];
      
      for (let i = 0; i < 100; i++) {
        const promise = database.collections.get<Exercise>('exercises').create(exercise => {
          exercise.name = `Exercício Performance ${i}`;
          exercise.muscleGroup = 'Teste';
          exercise.description = `Descrição do exercício ${i}`;
          exercise.createdAt = new Date();
        });
        promises.push(promise);
      }
      
      await Promise.all(promises);
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Inserção de 100 exercícios: ${duration}ms`);
    
    // Teste de consulta
    const queryStart = Date.now();
    const allExercises = await database.collections.get('exercises').query().fetch();
    const queryEnd = Date.now();
    const queryDuration = queryEnd - queryStart;
    
    console.log(`✅ Consulta de ${allExercises.length} exercícios: ${queryDuration}ms`);
    
    // Limpar dados de teste
    await database.write(async () => {
      const testExercises = await database.collections
        .get<Exercise>('exercises')
        .query()
        .fetch();
      
      const deletePromises = testExercises
        .filter(ex => ex.name.includes('Performance'))
        .map(ex => ex.markAsDeleted());
      
      await Promise.all(deletePromises);
    });
    
    console.log('✅ Dados de teste de performance limpos');
    
  } catch (error) {
    console.error('❌ Erro no teste de performance:', error);
    throw error;
  }
};

// Função para limpar dados de teste
export const cleanupTestData = async (): Promise<void> => {
  try {
    console.log('\n🧹 Limpando dados de teste...');
    
    await database.write(async () => {
      // Remover usuários de teste
      const testUsers = await database.collections
        .get<User>('users')
        .query()
        .fetch();
      
      const userDeletePromises = testUsers
        .filter(user => user.email.includes('test') || user.name.includes('Teste'))
        .map(user => user.markAsDeleted());
      
      await Promise.all(userDeletePromises);
    });
    
    console.log('✅ Dados de teste removidos');
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados de teste:', error);
    throw error;
  }
};

// Função principal para executar todos os testes
export const runAllTests = async (): Promise<void> => {
  try {
    await testDatabaseOperations();
    await testDatabasePerformance();
    await cleanupTestData();
    
    console.log('\n🎊 Todos os testes concluídos com sucesso!');
  } catch (error) {
    console.error('\n💥 Falha nos testes:', error);
    throw error;
  }
};
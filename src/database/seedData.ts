import { database } from './index';
import { Exercise } from './models';

// Dados iniciais de exercícios
const initialExercises = [
  // Peito
  {
    name: 'Supino Reto',
    description: 'Exercício fundamental para desenvolvimento do peitoral maior',
    muscleGroup: 'Peito',
    equipment: 'Barra',
  },
  {
    name: 'Supino Inclinado',
    description: 'Foca na porção superior do peitoral',
    muscleGroup: 'Peito',
    equipment: 'Barra',
  },
  {
    name: 'Flexão de Braço',
    description: 'Exercício clássico usando peso corporal',
    muscleGroup: 'Peito',
    equipment: 'Peso corporal',
  },
  {
    name: 'Crucifixo com Halteres',
    description: 'Isolamento do peitoral com amplitude completa',
    muscleGroup: 'Peito',
    equipment: 'Halteres',
  },
  {
    name: 'Supino com Halteres',
    description: 'Variação do supino com maior amplitude de movimento',
    muscleGroup: 'Peito',
    equipment: 'Halteres',
  },

  // Costas
  {
    name: 'Puxada na Polia Alta',
    description: 'Exercício para desenvolvimento da largura das costas',
    muscleGroup: 'Costas',
    equipment: 'Polia',
  },
  {
    name: 'Remada Curvada',
    description: 'Fortalece a musculatura das costas e posterior de ombros',
    muscleGroup: 'Costas',
    equipment: 'Barra',
  },
  {
    name: 'Levantamento Terra',
    description: 'Exercício composto que trabalha múltiplos grupos musculares',
    muscleGroup: 'Costas',
    equipment: 'Barra',
  },
  {
    name: 'Remada com Halteres',
    description: 'Exercício unilateral para desenvolvimento das costas',
    muscleGroup: 'Costas',
    equipment: 'Halteres',
  },
  {
    name: 'Barra Fixa',
    description: 'Exercício clássico para largura das costas',
    muscleGroup: 'Costas',
    equipment: 'Peso corporal',
  },

  // Ombros
  {
    name: 'Desenvolvimento com Barra',
    description: 'Exercício fundamental para ombros',
    muscleGroup: 'Ombros',
    equipment: 'Barra',
  },
  {
    name: 'Desenvolvimento com Halteres',
    description: 'Maior amplitude de movimento para os ombros',
    muscleGroup: 'Ombros',
    equipment: 'Halteres',
  },
  {
    name: 'Elevação Lateral',
    description: 'Isolamento do deltóide médio',
    muscleGroup: 'Ombros',
    equipment: 'Halteres',
  },
  {
    name: 'Elevação Frontal',
    description: 'Foca no deltóide anterior',
    muscleGroup: 'Ombros',
    equipment: 'Halteres',
  },
  {
    name: 'Crucifixo Inverso',
    description: 'Trabalha o deltóide posterior',
    muscleGroup: 'Ombros',
    equipment: 'Halteres',
  },

  // Braços - Bíceps
  {
    name: 'Rosca Direta',
    description: 'Exercício clássico para bíceps',
    muscleGroup: 'Bíceps',
    equipment: 'Barra',
  },
  {
    name: 'Rosca com Halteres',
    description: 'Permite trabalho unilateral dos bíceps',
    muscleGroup: 'Bíceps',
    equipment: 'Halteres',
  },
  {
    name: 'Rosca Martelo',
    description: 'Trabalha bíceps e antebraços',
    muscleGroup: 'Bíceps',
    equipment: 'Halteres',
  },
  {
    name: 'Rosca no Cabo',
    description: 'Tensão constante durante todo o movimento',
    muscleGroup: 'Bíceps',
    equipment: 'Polia',
  },

  // Braços - Tríceps
  {
    name: 'Tríceps Testa',
    description: 'Isolamento eficaz do tríceps',
    muscleGroup: 'Tríceps',
    equipment: 'Barra',
  },
  {
    name: 'Mergulho em Paralelas',
    description: 'Exercício composto para tríceps e peito',
    muscleGroup: 'Tríceps',
    equipment: 'Peso corporal',
  },
  {
    name: 'Tríceps no Cabo',
    description: 'Exercício de isolamento com cabo',
    muscleGroup: 'Tríceps',
    equipment: 'Polia',
  },
  {
    name: 'Tríceps com Halteres',
    description: 'Trabalho unilateral do tríceps',
    muscleGroup: 'Tríceps',
    equipment: 'Halteres',
  },

  // Pernas - Quadríceps
  {
    name: 'Agachamento',
    description: 'Rei dos exercícios para pernas',
    muscleGroup: 'Quadríceps',
    equipment: 'Barra',
  },
  {
    name: 'Leg Press',
    description: 'Exercício seguro para desenvolvimento das pernas',
    muscleGroup: 'Quadríceps',
    equipment: 'Máquina',
  },
  {
    name: 'Extensão de Pernas',
    description: 'Isolamento do quadríceps',
    muscleGroup: 'Quadríceps',
    equipment: 'Máquina',
  },
  {
    name: 'Afundo',
    description: 'Exercício unilateral para pernas',
    muscleGroup: 'Quadríceps',
    equipment: 'Halteres',
  },
  {
    name: 'Agachamento Búlgaro',
    description: 'Variação unilateral do agachamento',
    muscleGroup: 'Quadríceps',
    equipment: 'Halteres',
  },

  // Pernas - Posterior
  {
    name: 'Stiff',
    description: 'Exercício para posterior de coxa e glúteos',
    muscleGroup: 'Posterior de Coxa',
    equipment: 'Barra',
  },
  {
    name: 'Mesa Flexora',
    description: 'Isolamento do posterior de coxa',
    muscleGroup: 'Posterior de Coxa',
    equipment: 'Máquina',
  },
  {
    name: 'Flexão de Pernas',
    description: 'Exercício para posterior de coxa',
    muscleGroup: 'Posterior de Coxa',
    equipment: 'Máquina',
  },

  // Glúteos
  {
    name: 'Hip Thrust',
    description: 'Exercício específico para glúteos',
    muscleGroup: 'Glúteos',
    equipment: 'Barra',
  },
  {
    name: 'Elevação Pélvica',
    description: 'Exercício com peso corporal para glúteos',
    muscleGroup: 'Glúteos',
    equipment: 'Peso corporal',
  },
  {
    name: 'Agachamento Sumo',
    description: 'Variação que enfatiza glúteos e adutores',
    muscleGroup: 'Glúteos',
    equipment: 'Halteres',
  },

  // Panturrilha
  {
    name: 'Panturrilha em Pé',
    description: 'Exercício para gastrocnêmio',
    muscleGroup: 'Panturrilha',
    equipment: 'Máquina',
  },
  {
    name: 'Panturrilha Sentado',
    description: 'Foca no músculo sóleo',
    muscleGroup: 'Panturrilha',
    equipment: 'Máquina',
  },
  {
    name: 'Elevação de Panturrilha',
    description: 'Exercício com peso corporal',
    muscleGroup: 'Panturrilha',
    equipment: 'Peso corporal',
  },

  // Core/Abdômen
  {
    name: 'Prancha',
    description: 'Exercício isométrico para core',
    muscleGroup: 'Abdômen',
    equipment: 'Peso corporal',
  },
  {
    name: 'Abdominal Tradicional',
    description: 'Exercício clássico para abdômen',
    muscleGroup: 'Abdômen',
    equipment: 'Peso corporal',
  },
  {
    name: 'Elevação de Pernas',
    description: 'Trabalha a porção inferior do abdômen',
    muscleGroup: 'Abdômen',
    equipment: 'Peso corporal',
  },
  {
    name: 'Russian Twist',
    description: 'Exercício para oblíquos',
    muscleGroup: 'Abdômen',
    equipment: 'Peso corporal',
  },
  {
    name: 'Mountain Climber',
    description: 'Exercício dinâmico para core',
    muscleGroup: 'Abdômen',
    equipment: 'Peso corporal',
  },

  // Cardio
  {
    name: 'Corrida',
    description: 'Exercício cardiovascular clássico',
    muscleGroup: 'Cardio',
    equipment: 'Peso corporal',
  },
  {
    name: 'Burpee',
    description: 'Exercício funcional de corpo inteiro',
    muscleGroup: 'Cardio',
    equipment: 'Peso corporal',
  },
  {
    name: 'Jumping Jacks',
    description: 'Exercício cardiovascular simples',
    muscleGroup: 'Cardio',
    equipment: 'Peso corporal',
  },
  {
    name: 'Bicicleta Ergométrica',
    description: 'Cardio de baixo impacto',
    muscleGroup: 'Cardio',
    equipment: 'Máquina',
  },
];

// Função para popular o banco com exercícios iniciais
export const seedExercises = async (): Promise<void> => {
  try {
    console.log('Iniciando população do banco com exercícios...');
    
    // Verificar se já existem exercícios
    const existingExercises = await database.collections
      .get<Exercise>('exercises')
      .query()
      .fetchCount();
    
    if (existingExercises > 0) {
      console.log(`Banco já possui ${existingExercises} exercícios. Pulando população inicial.`);
      return;
    }
    
    // Criar exercícios em lote
    await database.write(async () => {
      const exercisesCollection = database.collections.get<Exercise>('exercises');
      
      for (const exerciseData of initialExercises) {
        await exercisesCollection.create(exercise => {
          exercise.name = exerciseData.name;
          exercise.description = exerciseData.description;
          exercise.muscleGroup = exerciseData.muscleGroup;
          exercise.equipment = exerciseData.equipment;
        });
      }
    });
    
    console.log(`✅ ${initialExercises.length} exercícios adicionados com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao popular banco com exercícios:', error);
    throw error;
  }
};

// Função para limpar todos os dados (útil para desenvolvimento)
export const clearAllData = async (): Promise<void> => {
  try {
    console.log('Limpando todos os dados do banco...');
    
    await database.write(async () => {
      await database.unsafeResetDatabase();
    });
    
    console.log('✅ Banco de dados limpo com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao limpar banco de dados:', error);
    throw error;
  }
};

// Função para recriar dados (limpar + popular)
export const recreateData = async (): Promise<void> => {
  try {
    await clearAllData();
    await seedExercises();
    console.log('✅ Dados recriados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao recriar dados:', error);
    throw error;
  }
};

// Função para obter estatísticas do banco
export const getDatabaseStats = async (): Promise<{
  exercises: number;
  workouts: number;
  workoutExercises: number;
  users: number;
}> => {
  try {
    const [exercises, workouts, workoutExercises, users] = await Promise.all([
      database.collections.get('exercises').query().fetchCount(),
      database.collections.get('workouts').query().fetchCount(),
      database.collections.get('workout_exercises').query().fetchCount(),
      database.collections.get('users').query().fetchCount(),
    ]);
    
    return {
      exercises,
      workouts,
      workoutExercises,
      users,
    };
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas do banco:', error);
    return {
      exercises: 0,
      workouts: 0,
      workoutExercises: 0,
      users: 0,
    };
  }
};
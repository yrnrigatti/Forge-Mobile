import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { WorkoutChart, WeightProgressChart } from './WorkoutChart';
import { PieChart, MuscleGroupPieChart, SimpleBarChart } from './PieChart';
import { useWorkout, useExercise } from '../../contexts';
import { database } from '../../database';
import { Workout, WorkoutExercise, Exercise } from '../../database/models';

interface DashboardStats {
  totalWorkouts: number;
  totalExercises: number;
  totalVolume: number;
  averageDuration: number;
  workoutFrequency: number; // treinos por semana
  favoriteExercises: Array<{ name: string; count: number }>;
  muscleGroupDistribution: Array<{ muscleGroup: string; exercises: number; workouts: number }>;
  weeklyProgress: Array<{ date: string; duration: number; exercises: number; volume: number }>;
}

interface StatsDashboardProps {
  userId?: string;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  userId,
  timeRange = 'month',
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChart, setSelectedChart] = useState<'duration' | 'volume' | 'exercises'>('duration');
  
  const { workouts } = useWorkout();
  const { exercises } = useExercise();

  // Calcular período baseado no timeRange
  const getDateRange = () => {
    const now = new Date();
    const start = new Date();
    
    switch (timeRange) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return { start: start.getTime(), end: now.getTime() };
  };

  // Carregar estatísticas
  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      const { start, end } = getDateRange();
      
      // Buscar treinos no período
      const periodWorkouts = await database.collections
        .get<Workout>('workouts')
        .query(
          // Q.where('date', Q.gte(start)),
          // Q.where('date', Q.lte(end)),
          // userId ? Q.where('user_id', userId) : Q.where('user_id', Q.notEq(''))
        )
        .fetch();

      // Buscar exercícios dos treinos
      const workoutIds = periodWorkouts.map(w => w.id);
      const workoutExercises = await database.collections
        .get<WorkoutExercise>('workout_exercises')
        .query(
          // Q.where('workout_id', Q.oneOf(workoutIds))
        )
        .fetch();

      // Buscar dados dos exercícios
      const exerciseIds = [...new Set(workoutExercises.map(we => we.exerciseId))];
      const exerciseData = await database.collections
        .get<Exercise>('exercises')
        .query(
          // Q.where('id', Q.oneOf(exerciseIds))
        )
        .fetch();

      // Calcular estatísticas
      const totalWorkouts = periodWorkouts.length;
      const totalExercises = workoutExercises.length;
      
      // Calcular volume total
      const totalVolume = workoutExercises.reduce((sum, we) => {
        try {
          const weights = JSON.parse(we.weight || '[]');
          const reps = JSON.parse(we.reps || '[]');
          
          const exerciseVolume = weights.reduce((exSum: number, weight: number, index: number) => {
            const rep = reps[index] || 0;
            return exSum + (weight * rep);
          }, 0);
          
          return sum + exerciseVolume;
        } catch {
          return sum;
        }
      }, 0);

      // Calcular duração média
      const totalDuration = periodWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
      const averageDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

      // Calcular frequência semanal
      const daysInPeriod = (end - start) / (1000 * 60 * 60 * 24);
      const weeksInPeriod = daysInPeriod / 7;
      const workoutFrequency = totalWorkouts / weeksInPeriod;

      // Exercícios favoritos
      const exerciseCounts = new Map<string, number>();
      for (const we of workoutExercises) {
        const exercise = exerciseData.find(e => e.id === we.exerciseId);
        if (exercise) {
          const count = exerciseCounts.get(exercise.name) || 0;
          exerciseCounts.set(exercise.name, count + 1);
        }
      }
      
      const favoriteExercises = Array.from(exerciseCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Distribuição por grupo muscular
      const muscleGroupCounts = new Map<string, { exercises: number; workouts: Set<string> }>();
      
      for (const we of workoutExercises) {
        const exercise = exerciseData.find(e => e.id === we.exerciseId);
        if (exercise) {
          const current = muscleGroupCounts.get(exercise.muscleGroup) || { exercises: 0, workouts: new Set() };
          current.exercises += 1;
          current.workouts.add(we.workoutId);
          muscleGroupCounts.set(exercise.muscleGroup, current);
        }
      }
      
      const muscleGroupDistribution = Array.from(muscleGroupCounts.entries())
        .map(([muscleGroup, data]) => ({
          muscleGroup,
          exercises: data.exercises,
          workouts: data.workouts.size,
        }));

      // Progresso semanal
      const weeklyProgress = [];
      const weeksToShow = Math.min(8, Math.ceil(weeksInPeriod));
      
      for (let i = weeksToShow - 1; i >= 0; i--) {
        const weekStart = new Date(end - (i * 7 * 24 * 60 * 60 * 1000));
        const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));
        
        const weekWorkouts = periodWorkouts.filter(w => 
          w.date.getTime() >= weekStart.getTime() && w.date.getTime() < weekEnd.getTime()
        );
        
        const weekWorkoutIds = weekWorkouts.map(w => w.id);
        const weekExercises = workoutExercises.filter(we => 
          weekWorkoutIds.includes(we.workoutId)
        );
        
        const weekVolume = weekExercises.reduce((sum, we) => {
          try {
            const weights = JSON.parse(we.weight || '[]');
            const reps = JSON.parse(we.reps || '[]');
            
            return sum + weights.reduce((exSum: number, weight: number, index: number) => {
              const rep = reps[index] || 0;
              return exSum + (weight * rep);
            }, 0);
          } catch {
            return sum;
          }
        }, 0);
        
        const weekDuration = weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        
        weeklyProgress.push({
          date: weekStart.toISOString(),
          duration: weekDuration,
          exercises: weekExercises.length,
          volume: weekVolume,
        });
      }

      const dashboardStats: DashboardStats = {
        totalWorkouts,
        totalExercises,
        totalVolume,
        averageDuration,
        workoutFrequency,
        favoriteExercises,
        muscleGroupDistribution,
        weeklyProgress,
      };

      setStats(dashboardStats);
      
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar dados
  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadStats();
  }, [timeRange, userId]);

  if (isLoading && !stats) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Carregando estatísticas...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">
          Nenhuma estatística disponível
        </Text>
        <Text className="text-gray-600 text-center mb-4">
          Comece a treinar para ver suas estatísticas!
        </Text>
        <TouchableOpacity 
          onPress={onRefresh}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-medium">Atualizar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Cards de resumo */}
      <View className="p-4">
        <View className="flex-row flex-wrap justify-between mb-4">
          <View className="bg-white rounded-xl p-4 shadow-sm w-[48%] mb-4">
            <Text className="text-sm text-gray-500 mb-1">Total de Treinos</Text>
            <Text className="text-2xl font-bold text-blue-600">{stats.totalWorkouts}</Text>
          </View>
          
          <View className="bg-white rounded-xl p-4 shadow-sm w-[48%] mb-4">
            <Text className="text-sm text-gray-500 mb-1">Exercícios Feitos</Text>
            <Text className="text-2xl font-bold text-green-600">{stats.totalExercises}</Text>
          </View>
          
          <View className="bg-white rounded-xl p-4 shadow-sm w-[48%] mb-4">
            <Text className="text-sm text-gray-500 mb-1">Volume Total</Text>
            <Text className="text-2xl font-bold text-purple-600">{Math.round(stats.totalVolume)} kg</Text>
          </View>
          
          <View className="bg-white rounded-xl p-4 shadow-sm w-[48%] mb-4">
            <Text className="text-sm text-gray-500 mb-1">Duração Média</Text>
            <Text className="text-2xl font-bold text-orange-600">{Math.round(stats.averageDuration)} min</Text>
          </View>
        </View>

        {/* Seletor de gráfico */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Progresso Semanal</Text>
          
          <View className="flex-row mb-4">
            {(['duration', 'volume', 'exercises'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedChart(type)}
                className={`flex-1 py-2 px-3 rounded-lg mr-2 ${
                  selectedChart === type ? 'bg-blue-600' : 'bg-gray-100'
                }`}
              >
                <Text className={`text-center text-sm font-medium ${
                  selectedChart === type ? 'text-white' : 'text-gray-600'
                }`}>
                  {type === 'duration' ? 'Duração' : type === 'volume' ? 'Volume' : 'Exercícios'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <WorkoutChart
            data={stats.weeklyProgress}
            type={selectedChart}
            showArea={true}
          />
        </View>

        {/* Distribuição de grupos musculares */}
        {stats.muscleGroupDistribution.length > 0 && (
          <View className="mb-4">
            <MuscleGroupPieChart
              data={stats.muscleGroupDistribution}
              type="exercises"
            />
          </View>
        )}

        {/* Exercícios favoritos */}
        {stats.favoriteExercises.length > 0 && (
          <View className="mb-4">
            <SimpleBarChart
              data={stats.favoriteExercises.map(ex => ({
                label: ex.name,
                value: ex.count,
              }))}
              title="Exercícios Mais Realizados"
              maxBars={5}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};
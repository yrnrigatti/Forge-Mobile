import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { chartColors, chartConfig } from './chartConfig';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 40;

interface WorkoutData {
  date: string;
  duration: number; // em minutos
  exercises: number;
  volume: number; // peso total levantado
}

interface WorkoutChartProps {
  data: WorkoutData[];
  type: 'duration' | 'volume' | 'exercises';
  title?: string;
  color?: string;
  showArea?: boolean;
}

export const WorkoutChart: React.FC<WorkoutChartProps> = ({
  data,
  type,
  title,
  color = '#3B82F6',
  showArea = false,
}) => {
  // Preparar dados para react-native-chart-kit
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })),
    datasets: [{
      data: data.map(item => item[type]),
      color: (opacity = 1) => color.replace('rgb', 'rgba').replace(')', `, ${opacity})`),
      strokeWidth: 2,
    }],
  };

  function getUnit(chartType: string): string {
    switch (chartType) {
      case 'duration':
        return ' min';
      case 'volume':
        return ' kg';
      case 'exercises':
        return ' ex';
      default:
        return '';
    }
  }

  function getYAxisLabel(chartType: string): string {
    switch (chartType) {
      case 'duration':
        return 'Duração (min)';
      case 'volume':
        return 'Volume (kg)';
      case 'exercises':
        return 'Exercícios';
      default:
        return '';
    }
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {title || `Gráfico de ${getYAxisLabel(type)}`}
        </Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum dado disponível{"\n"}Comece a treinar para ver seus gráficos!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title || `Gráfico de ${getYAxisLabel(type)}`}
      </Text>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={200}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => color.replace('rgb', 'rgba').replace(')', `, ${opacity})`),
          }}
          bezier={!showArea}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          withDots={true}
          withShadow={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={false}
        />
      </View>
      
      {/* Estatísticas resumidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Média</Text>
          <Text style={styles.statValue}>
            {(data.reduce((sum, item) => sum + item[type], 0) / data.length).toFixed(1)}
            {getUnit(type)}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Máximo</Text>
          <Text style={[styles.statValue, { color: chartColors.secondary }]}>
            {Math.max(...data.map(item => item[type]))}
            {getUnit(type)}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Treinos</Text>
          <Text style={[styles.statValue, { color: chartColors.primary }]}>
            {data.length}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  chartContainer: {
    alignItems: 'center',
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
});

// Componente para gráfico de progresso de peso
interface WeightProgressData {
  date: string;
  exercise: string;
  weight: number;
}

interface WeightProgressChartProps {
  data: WeightProgressData[];
  exerciseName: string;
  color?: string;
}

export const WeightProgressChart: React.FC<WeightProgressChartProps> = ({
  data,
  exerciseName,
  color = '#10B981',
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Progresso - {exerciseName}
        </Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Nenhum dado de progresso{"\n"}Faça este exercício para ver sua evolução!
          </Text>
        </View>
      </View>
    );
  }

  const chartData = {
    labels: data.map((_, index) => `${index + 1}`),
    datasets: [
      {
        data: data.map(item => item.weight),
        color: (opacity = 1) => color,
        strokeWidth: 3,
      },
    ],
  };

  const weightIncrease = data.length > 1 
    ? data[data.length - 1].weight - data[0].weight 
    : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Progresso - {exerciseName}
      </Text>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => color,
            labelColor: (opacity = 1) => '#6B7280',
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: color,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
      
      {/* Estatísticas de progresso */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Inicial</Text>
          <Text style={styles.statValue}>
            {data[0].weight} kg
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Atual</Text>
          <Text style={[styles.statValue, { color: '#2563EB' }]}>
            {data[data.length - 1].weight} kg
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Progresso</Text>
          <Text style={[styles.statValue, {
            color: weightIncrease >= 0 ? '#10B981' : '#EF4444'
          }]}>
            {weightIncrease >= 0 ? '+' : ''}{weightIncrease} kg
          </Text>
        </View>
      </View>
    </View>
  );
};
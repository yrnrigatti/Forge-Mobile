import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';
import { chartColors, pieChartConfig } from './chartConfig';

const { width: screenWidth } = Dimensions.get('window');
const chartSize = Math.min(screenWidth - 80, 250);

interface PieData {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieData[];
  title?: string;
  showLegend?: boolean;
  showPercentage?: boolean;
  colors?: string[];
}

// Cores padrão para o gráfico
const defaultColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  showLegend = true,
  showPercentage = true,
  colors = defaultColors,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        {title && (
          <Text style={styles.title}>
            {title}
          </Text>
        )}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum dado disponível{"\n"}Comece a treinar para ver a distribuição!
          </Text>
        </View>
      </View>
    );
  }

  // Calcular total para percentuais
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Preparar dados para react-native-chart-kit
  const chartData = data.map((item, index) => ({
    name: item.label,
    population: item.value,
    color: item.color || colors[index % colors.length],
    legendFontColor: chartColors.text,
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      {title && (
        <Text style={styles.title}>
          {title}
        </Text>
      )}
      
      <View style={styles.chartContainer}>
        <RNPieChart
          data={chartData}
          width={chartSize}
          height={chartSize}
          chartConfig={pieChartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute={!showPercentage}
        />
      </View>

      {/* Estatísticas resumidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>
            {total}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Categorias</Text>
          <Text style={[styles.statValue, { color: chartColors.primary }]}>
            {data.length}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Maior</Text>
          <Text style={[styles.statValue, { color: chartColors.secondary }]}>
            {Math.max(...data.map(item => item.value))}
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
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: chartColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: chartColors.lightText,
    textAlign: 'center',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: chartColors.lightText,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: chartColors.text,
  },
});

// Componente específico para distribuição de grupos musculares
interface MuscleGroupData {
  muscleGroup: string;
  exercises: number;
  workouts: number;
}

interface MuscleGroupPieChartProps {
  data: MuscleGroupData[];
  type: 'exercises' | 'workouts';
}

export const MuscleGroupPieChart: React.FC<MuscleGroupPieChartProps> = ({
  data,
  type,
}) => {
  const pieData: PieData[] = data.map(item => ({
    label: item.muscleGroup,
    value: type === 'exercises' ? item.exercises : item.workouts,
  }));

  const title = type === 'exercises' 
    ? 'Distribuição de Exercícios por Grupo Muscular'
    : 'Distribuição de Treinos por Grupo Muscular';

  return (
    <PieChart
      data={pieData}
      title={title}
      showLegend={true}
      showPercentage={true}
    />
  );
};

// Componente para gráfico de barras horizontal simples
interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarData[];
  title?: string;
  maxBars?: number;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  title,
  maxBars = 5,
}) => {
  if (!data || data.length === 0) {
    return (
      <View className="bg-white rounded-xl p-4 shadow-sm">
        {title && (
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            {title}
          </Text>
        )}
        <View className="h-32 justify-center items-center">
          <Text className="text-gray-500 text-center">
            Nenhum dado disponível
          </Text>
        </View>
      </View>
    );
  }

  // Ordenar por valor e pegar apenas os top N
  const sortedData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, maxBars);

  const maxValue = Math.max(...sortedData.map(item => item.value));

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      {title && (
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          {title}
        </Text>
      )}
      
      <View className="space-y-3">
        {sortedData.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const color = item.color || defaultColors[index % defaultColors.length];
          
          return (
            <View key={index} className="">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm font-medium text-gray-700 flex-1">
                  {item.label}
                </Text>
                <Text className="text-sm font-semibold text-gray-800 ml-2">
                  {item.value}
                </Text>
              </View>
              
              <View className="bg-gray-200 rounded-full h-2">
                <View 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    backgroundColor: color,
                    width: `${percentage}%`,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
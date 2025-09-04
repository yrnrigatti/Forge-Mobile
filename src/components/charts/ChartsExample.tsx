import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useCharts } from '../../hooks';
import { WorkoutChart, PieChart, StatsDashboard } from './';

interface ChartsExampleProps {
  userId?: string;
}

const ChartsExample: React.FC<ChartsExampleProps> = ({ userId }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('month');
  const [selectedChart, setSelectedChart] = useState<'workout' | 'muscle' | 'stats'>('workout');
  
  const {
    workoutData,
    muscleGroupStats,
    workoutStats,
    isLoading,
    error,
    setTimeRange,
    refreshData,
  } = useCharts({ userId, timeRange: selectedTimeRange });

  const handleTimeRangeChange = (range: 'week' | 'month' | 'quarter' | 'year' | 'all') => {
    setSelectedTimeRange(range);
    setTimeRange(range);
  };

  const timeRangeOptions = [
    { key: 'week', label: '7 dias' },
    { key: 'month', label: '30 dias' },
    { key: 'quarter', label: '3 meses' },
    { key: 'year', label: '1 ano' },
    { key: 'all', label: 'Todos' },
  ] as const;

  const chartOptions = [
    { key: 'workout', label: 'Treinos' },
    { key: 'muscle', label: 'Músculos' },
    { key: 'stats', label: 'Estatísticas' },
  ] as const;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderChart = () => {
    switch (selectedChart) {
      case 'workout':
        return (
          <WorkoutChart
            data={workoutData}
            type="duration"
            title="Duração dos Treinos"
            color="#3B82F6"
            showArea
          />
        );
      case 'muscle':
        return (
          <PieChart
            data={muscleGroupStats.map(stat => ({
              label: stat.muscleGroup,
              value: stat.exercises,
              color: getRandomColor(),
            }))}
            title="Distribuição por Grupo Muscular"
            showLegend
            showPercentage
          />
        );
      case 'stats':
        return (
          <StatsDashboard
            userId={userId}
            timeRange={selectedTimeRange === 'all' ? 'year' : selectedTimeRange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Análise de Treinos</Text>
        <Text style={styles.subtitle}>Visualize seu progresso e estatísticas</Text>
      </View>

      {/* Time Range Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Período:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {timeRangeOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.selectorButton,
                selectedTimeRange === option.key && styles.selectorButtonActive,
              ]}
              onPress={() => handleTimeRangeChange(option.key)}
            >
              <Text
                style={[
                  styles.selectorButtonText,
                  selectedTimeRange === option.key && styles.selectorButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chart Type Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Visualização:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {chartOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.selectorButton,
                selectedChart === option.key && styles.selectorButtonActive,
              ]}
              onPress={() => setSelectedChart(option.key)}
            >
              <Text
                style={[
                  styles.selectorButtonText,
                  selectedChart === option.key && styles.selectorButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chart Container */}
      <View style={styles.chartContainer}>
        {renderChart()}
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStatsContainer}>
        <Text style={styles.quickStatsTitle}>Resumo Rápido</Text>
        <View style={styles.quickStatsGrid}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{workoutStats.totalWorkouts}</Text>
            <Text style={styles.quickStatLabel}>Treinos</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{workoutStats.totalExercises}</Text>
            <Text style={styles.quickStatLabel}>Exercícios</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>
              {(workoutStats.totalVolume / 1000).toFixed(1)}k
            </Text>
            <Text style={styles.quickStatLabel}>Volume (kg)</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>
              {Math.round(workoutStats.averageDuration)}
            </Text>
            <Text style={styles.quickStatLabel}>Min/Treino</Text>
          </View>
        </View>
      </View>

      {/* Refresh Button */}
      <View style={styles.refreshContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshData}>
          <Text style={styles.refreshButtonText}>Atualizar Dados</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Função auxiliar para gerar cores aleatórias
const getRandomColor = () => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#F43F5E',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  selectorContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  selectorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectorButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  selectorButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  selectorButtonTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  quickStatsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  quickStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  refreshContainer: {
    padding: 20,
  },
  refreshButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChartsExample;
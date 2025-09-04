// Exportações dos componentes de gráficos
export * from './WorkoutChart';
export * from './PieChart';
export * from './StatsDashboard';
export * from './ChartsExample';

// Tipos úteis para gráficos
export interface ChartData {
  x: number | string;
  y: number;
  label?: string;
}

export interface ChartColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

// Cores padrão do tema
export const chartTheme: ChartColors = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
};

// Configuração e tema dos gráficos
export { chartConfig, chartColors, chartDefaults, formatters } from './chartConfig';

// Utilitários de formatação (mantidos para compatibilidade)
export const formatWeight = (weight: number): string => `${weight.toFixed(1)} kg`;
export const formatDuration = (minutes: number): string => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
  return `${minutes}m`;
};
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};
export const formatPercentage = (value: number, total: number): string => {
  const percent = total > 0 ? (value / total) * 100 : 0;
  return `${percent.toFixed(1)}%`;
};
export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
};
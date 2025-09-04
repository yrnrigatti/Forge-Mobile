// Tipos relacionados a gráficos e visualizações

export interface ChartData {
  x: string | number | Date;
  y: number;
  label?: string;
  color?: string;
}

export interface LineChartData extends ChartData {
  strokeWidth?: number;
  strokeDasharray?: string;
}

export interface BarChartData extends ChartData {
  fill?: string;
}

export interface PieChartData {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface AreaChartData extends ChartData {
  y0?: number; // para área empilhada
}

export interface ScatterChartData extends ChartData {
  size?: number;
  symbol?: string;
}

export type ChartType = 
  | 'line'
  | 'bar'
  | 'area'
  | 'pie'
  | 'scatter'
  | 'histogram'
  | 'heatmap';

export interface ChartConfig {
  type: ChartType;
  title?: string;
  subtitle?: string;
  width: number;
  height: number;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors?: string[];
  theme?: 'light' | 'dark';
  animate?: boolean;
  interactive?: boolean;
}

export interface AxisConfig {
  label?: string;
  tickCount?: number;
  tickFormat?: string | ((value: any) => string);
  domain?: [number, number] | [Date, Date];
  scale?: 'linear' | 'log' | 'time';
  grid?: boolean;
  orientation?: 'top' | 'bottom' | 'left' | 'right';
}

export interface ChartAxis {
  x: AxisConfig;
  y: AxisConfig;
}

export interface ChartLegend {
  show: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  orientation: 'horizontal' | 'vertical';
}

export interface ChartTooltip {
  show: boolean;
  format?: (data: ChartData) => string;
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
  };
}

export interface ProgressChartData {
  date: Date;
  value: number;
  target?: number;
  category?: string;
}

export interface VolumeChartData {
  date: Date;
  volume: number;
  exerciseCount: number;
  duration: number;
}

export interface StrengthProgressData {
  exerciseId: string;
  exerciseName: string;
  data: Array<{
    date: Date;
    maxWeight: number;
    volume: number;
    reps: number;
  }>;
}

export interface MuscleGroupData {
  muscleGroup: string;
  workouts: number;
  volume: number;
  percentage: number;
  color: string;
}

export interface FrequencyData {
  period: string; // 'Week 1', 'January', etc.
  workouts: number;
  target?: number;
}

export interface WorkoutHeatmapData {
  date: Date;
  value: number; // intensidade do treino (0-1)
  workouts: number;
}

export interface ExerciseComparisonData {
  exerciseId: string;
  exerciseName: string;
  currentPeriod: {
    volume: number;
    frequency: number;
    maxWeight: number;
  };
  previousPeriod: {
    volume: number;
    frequency: number;
    maxWeight: number;
  };
  change: {
    volume: number;
    frequency: number;
    maxWeight: number;
  };
}

// Tipos para configurações específicas de gráficos
export interface ProgressChartConfig extends ChartConfig {
  showTarget: boolean;
  showTrend: boolean;
  trendColor?: string;
  targetColor?: string;
}

export interface VolumeChartConfig extends ChartConfig {
  showMovingAverage: boolean;
  movingAveragePeriod: number;
  stackedBars: boolean;
}

export interface StrengthChartConfig extends ChartConfig {
  showPersonalRecords: boolean;
  prColor?: string;
  compareExercises: boolean;
  maxExercises: number;
}

export interface HeatmapConfig extends ChartConfig {
  cellSize: number;
  monthsToShow: number;
  colorScale: string[];
  showWeekdays: boolean;
  showMonthLabels: boolean;
}

// Tipos para filtros de gráficos
export interface ChartFilter {
  dateRange: {
    start: Date;
    end: Date;
  };
  exerciseIds?: string[];
  muscleGroups?: string[];
  workoutTypes?: string[];
  aggregation: 'daily' | 'weekly' | 'monthly';
}

// Tipos para métricas calculadas
export interface ChartMetrics {
  total: number;
  average: number;
  maximum: number;
  minimum: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  standardDeviation: number;
}

export interface TrendAnalysis {
  slope: number;
  correlation: number;
  prediction: number[];
  confidence: number;
}

// Tipos para exportação de gráficos
export interface ChartExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  width: number;
  height: number;
  quality?: number; // para jpg
  backgroundColor?: string;
  includeTitle: boolean;
  includeLegend: boolean;
}

export interface ChartExportData {
  chartConfig: ChartConfig;
  data: ChartData[];
  exportOptions: ChartExportOptions;
  timestamp: Date;
}

// Tipos para dashboards
export interface DashboardWidget {
  id: string;
  type: ChartType | 'metric' | 'summary';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: ChartConfig;
  dataSource: string;
  refreshInterval?: number; // em segundos
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  layout: 'grid' | 'flex';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para animações
export interface ChartAnimation {
  duration: number; // em milliseconds
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
  onComplete?: () => void;
}

// Tipos para interatividade
export interface ChartInteraction {
  hover: boolean;
  click: boolean;
  zoom: boolean;
  pan: boolean;
  brush: boolean;
  onHover?: (data: ChartData) => void;
  onClick?: (data: ChartData) => void;
  onZoom?: (domain: [number, number]) => void;
}

// Tipos para responsividade
export interface ResponsiveConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  configs: {
    mobile: Partial<ChartConfig>;
    tablet: Partial<ChartConfig>;
    desktop: Partial<ChartConfig>;
  };
}
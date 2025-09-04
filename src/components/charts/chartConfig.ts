export const chartColors = {
  primary: '#007AFF',
  secondary: '#34C759',
  tertiary: '#FF9500',
  quaternary: '#FF3B30',
  background: '#F2F2F7',
  text: '#000000',
  lightText: '#8E8E93',
};

export const chartConfig = {
  backgroundGradientFrom: chartColors.background,
  backgroundGradientTo: chartColors.background,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
  style: {
    borderRadius: 16,
  },
  propsForLabels: {
    fontSize: 12,
    fill: chartColors.text,
  },
  propsForBackgroundLines: {
    stroke: chartColors.lightText,
    strokeWidth: 0.5,
  },
};

export const pieChartConfig = {
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  strokeWidth: 2,
  style: {
    borderRadius: 16,
  },
};

// Configurações padrão para diferentes tipos de gráfico
export const chartDefaults = {
  // Configurações gerais
  width: 350,
  height: 250,
  
  // Configurações específicas por tipo
  line: {
    bezier: true,
    withDots: true,
    withInnerLines: true,
    withOuterLines: true,
  },
  
  bar: {
    withInnerLines: true,
    showBarTops: true,
    fromZero: true,
  },
  
  pie: {
    hasLegend: true,
    absolute: false,
  },
};

// Utilitários para formatação
export const formatters = {
  // Formatar números grandes
  largeNumber: (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  },
  
  // Formatar peso
  weight: (value: number): string => {
    return `${value.toFixed(1)} kg`;
  },
  
  // Formatar duração
  duration: (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  },
  
  // Formatar data
  date: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  },
  
  // Formatar data completa
  fullDate: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  },
  
  // Formatar percentual
  percentage: (value: number, total: number): string => {
    const percent = total > 0 ? (value / total) * 100 : 0;
    return `${percent.toFixed(1)}%`;
  },
  
  // Formatar volume
  volume: (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k kg`;
    }
    return `${value.toFixed(0)} kg`;
  },
};

// Configurações de responsividade
export const responsiveConfig = {
  small: {
    width: 300,
    height: 200,
    padding: { left: 50, top: 15, right: 30, bottom: 50 },
    fontSize: {
      axis: 10,
      label: 12,
      title: 14,
    },
  },
  medium: {
    width: 350,
    height: 250,
    padding: { left: 60, top: 20, right: 40, bottom: 60 },
    fontSize: {
      axis: 12,
      label: 14,
      title: 16,
    },
  },
  large: {
    width: 400,
    height: 300,
    padding: { left: 70, top: 25, right: 50, bottom: 70 },
    fontSize: {
      axis: 14,
      label: 16,
      title: 18,
    },
  },
};

// Configurações de acessibilidade
export const accessibilityConfig = {
  // Cores para daltonismo
  colorBlindFriendly: [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
    '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
    '#bcbd22', '#17becf',
  ],
  
  // Padrões para gráficos em preto e branco
  patterns: [
    'solid',
    'diagonal',
    'vertical',
    'horizontal',
    'grid',
    'dots',
  ],
  
  // Configurações de contraste alto
  highContrast: {
    background: '#FFFFFF',
    foreground: '#000000',
    accent: '#0066CC',
    border: '#333333',
  },
};

// Exportar configuração completa
export const chartConfigComplete = {
  colors: chartColors,
  defaults: chartDefaults,
  formatters,
  responsive: responsiveConfig,
  accessibility: accessibilityConfig,
};

export default chartConfig;
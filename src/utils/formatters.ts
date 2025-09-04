// Funções de formatação

/**
 * Formata peso para exibição
 */
export const formatWeight = (weight: number): string => {
  if (weight === 0) return '0 kg';
  if (weight < 1) return `${(weight * 1000).toFixed(0)}g`;
  return `${weight.toFixed(weight % 1 === 0 ? 0 : 1)} kg`;
};

/**
 * Formata duração em minutos para exibição
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Formata data para exibição
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

/**
 * Formata data e hora para exibição
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Formata data relativa (hoje, ontem, etc.)
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Hoje';
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? '1 semana atrás' : `${weeks} semanas atrás`;
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? '1 mês atrás' : `${months} meses atrás`;
  }
  
  const years = Math.floor(diffInDays / 365);
  return years === 1 ? '1 ano atrás' : `${years} anos atrás`;
};

/**
 * Formata número para exibição com separadores de milhares
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('pt-BR').format(num);
};

/**
 * Formata percentual para exibição
 */
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Formata volume total (peso × reps × sets)
 */
export const formatVolume = (volume: number): string => {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k kg`;
  }
  return `${volume.toFixed(0)} kg`;
};

/**
 * Formata tempo de descanso
 */
export const formatRestTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (remainingSeconds === 0) {
    return `${minutes}min`;
  }
  
  return `${minutes}min ${remainingSeconds}s`;
};

/**
 * Formata nome próprio (primeira letra maiúscula)
 */
export const formatProperName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formata texto para título (primeira letra de cada palavra maiúscula)
 */
export const formatTitle = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formata número ordinal (1º, 2º, 3º, etc.)
 */
export const formatOrdinal = (num: number): string => {
  return `${num}º`;
};

/**
 * Formata série/repetição para exibição
 */
export const formatSetsReps = (sets: number, reps: number): string => {
  return `${sets}x${reps}`;
};

/**
 * Formata exercício completo para exibição
 */
export const formatExerciseDisplay = (data: {
  sets: number;
  reps: number;
  weight: number;
}): string => {
  return `${formatSetsReps(data.sets, data.reps)} - ${formatWeight(data.weight)}`;
};

/**
 * Formata estatística com unidade
 */
export const formatStat = (value: number, unit: string): string => {
  return `${formatNumber(value)} ${unit}`;
};

/**
 * Formata progresso percentual
 */
export const formatProgress = (current: number, target: number): string => {
  if (target === 0) return '0%';
  const progress = Math.min((current / target) * 100, 100);
  return `${progress.toFixed(0)}%`;
};

/**
 * Formata diferença/variação
 */
export const formatDifference = (current: number, previous: number): string => {
  if (previous === 0) return '+100%';
  
  const diff = ((current - previous) / previous) * 100;
  const sign = diff >= 0 ? '+' : '';
  
  return `${sign}${diff.toFixed(1)}%`;
};

/**
 * Formata tempo decorrido
 */
export const formatElapsedTime = (startTime: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }
  
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  
  if (minutes < 60) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Formata tamanho de arquivo
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${size.toFixed(1)} ${sizes[i]}`;
};

/**
 * Formata moeda (Real brasileiro)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata número com precisão específica
 */
export const formatPrecision = (num: number, precision: number): string => {
  return num.toFixed(precision);
};

/**
 * Formata lista de itens
 */
export const formatList = (items: string[], conjunction: string = 'e'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1).join(', ');
  
  return `${otherItems} ${conjunction} ${lastItem}`;
};
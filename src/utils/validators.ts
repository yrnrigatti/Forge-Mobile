// Funções de validação

/**
 * Valida se um email é válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida se uma senha é forte
 */
export const isStrongPassword = (password: string): boolean => {
  // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Valida se um nome é válido
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

/**
 * Valida se um peso é válido
 */
export const isValidWeight = (weight: number): boolean => {
  return weight >= 0 && weight <= 1000 && !isNaN(weight);
};

/**
 * Valida se o número de repetições é válido
 */
export const isValidReps = (reps: number): boolean => {
  return Number.isInteger(reps) && reps >= 1 && reps <= 100;
};

/**
 * Valida se o número de séries é válido
 */
export const isValidSets = (sets: number): boolean => {
  return Number.isInteger(sets) && sets >= 1 && sets <= 20;
};

/**
 * Valida se o tempo de descanso é válido (em segundos)
 */
export const isValidRestTime = (restTime: number): boolean => {
  return Number.isInteger(restTime) && restTime >= 0 && restTime <= 600; // máximo 10 minutos
};

/**
 * Valida se uma duração é válida (em minutos)
 */
export const isValidDuration = (duration: number): boolean => {
  return duration >= 0 && duration <= 480; // máximo 8 horas
};

/**
 * Valida se uma data é válida
 */
export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Valida se uma data não é no futuro
 */
export const isNotFutureDate = (date: Date): boolean => {
  return date <= new Date();
};

/**
 * Valida se um texto não está vazio
 */
export const isNotEmpty = (text: string): boolean => {
  return text.trim().length > 0;
};

/**
 * Valida se um texto tem um comprimento específico
 */
export const hasValidLength = (text: string, min: number, max: number): boolean => {
  const length = text.trim().length;
  return length >= min && length <= max;
};

/**
 * Valida se um número está dentro de um intervalo
 */
export const isInRange = (num: number, min: number, max: number): boolean => {
  return num >= min && num <= max;
};

/**
 * Valida se um valor é um número positivo
 */
export const isPositiveNumber = (num: number): boolean => {
  return !isNaN(num) && num > 0;
};

/**
 * Valida se um valor é um número não negativo
 */
export const isNonNegativeNumber = (num: number): boolean => {
  return !isNaN(num) && num >= 0;
};

/**
 * Valida se um ID é válido (não vazio e não null)
 */
export const isValidId = (id: string | null | undefined): boolean => {
  return typeof id === 'string' && id.trim().length > 0;
};

/**
 * Valida se um URL é válido
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida se um objeto tem todas as propriedades obrigatórias
 */
export const hasRequiredProperties = <T extends Record<string, any>>(
  obj: T,
  requiredProps: (keyof T)[]
): boolean => {
  return requiredProps.every(prop => obj[prop] !== undefined && obj[prop] !== null);
};

/**
 * Valida dados de exercício
 */
export const validateExerciseData = (data: {
  name: string;
  muscleGroup: string;
  type: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!isValidName(data.name)) {
    errors.push('Nome do exercício deve ter entre 2 e 50 caracteres');
  }
  
  if (!isNotEmpty(data.muscleGroup)) {
    errors.push('Grupo muscular é obrigatório');
  }
  
  if (!isNotEmpty(data.type)) {
    errors.push('Tipo de exercício é obrigatório');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida dados de treino
 */
export const validateWorkoutData = (data: {
  name: string;
  date: Date;
  duration?: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!isValidName(data.name)) {
    errors.push('Nome do treino deve ter entre 2 e 50 caracteres');
  }
  
  if (!isValidDate(data.date)) {
    errors.push('Data inválida');
  }
  
  if (!isNotFutureDate(data.date)) {
    errors.push('Data não pode ser no futuro');
  }
  
  if (data.duration !== undefined && !isValidDuration(data.duration)) {
    errors.push('Duração deve ser entre 0 e 480 minutos');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida dados de exercício do treino
 */
export const validateWorkoutExerciseData = (data: {
  sets: number;
  reps: number;
  weight: number;
  restTime?: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!isValidSets(data.sets)) {
    errors.push('Número de séries deve ser entre 1 e 20');
  }
  
  if (!isValidReps(data.reps)) {
    errors.push('Número de repetições deve ser entre 1 e 100');
  }
  
  if (!isValidWeight(data.weight)) {
    errors.push('Peso deve ser entre 0 e 1000 kg');
  }
  
  if (data.restTime !== undefined && !isValidRestTime(data.restTime)) {
    errors.push('Tempo de descanso deve ser entre 0 e 600 segundos');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
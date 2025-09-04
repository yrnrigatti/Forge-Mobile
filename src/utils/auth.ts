// Utilitários para autenticação

import { SignUpData, SignInData, AuthError, ValidationResult } from '../types';

/**
 * Valida um endereço de email
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email é obrigatório');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Email deve ter um formato válido');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida uma senha
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Senha é obrigatória');
  } else {
    if (password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial (@$!%*?&)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida um nome de usuário
 */
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Nome é obrigatório');
  } else {
    if (name.length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    if (name.length > 50) {
      errors.push('Nome deve ter no máximo 50 caracteres');
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
      errors.push('Nome deve conter apenas letras e espaços');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida dados de cadastro
 */
export const validateSignUpData = (data: SignUpData): ValidationResult => {
  const errors: string[] = [];
  
  const emailValidation = validateEmail(data.email);
  const passwordValidation = validatePassword(data.password);
  const nameValidation = validateName(data.name);
  
  errors.push(...emailValidation.errors);
  errors.push(...passwordValidation.errors);
  errors.push(...nameValidation.errors);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida dados de login
 */
export const validateSignInData = (data: SignInData): ValidationResult => {
  const errors: string[] = [];
  
  const emailValidation = validateEmail(data.email);
  const passwordValidation = validatePassword(data.password);
  
  errors.push(...emailValidation.errors);
  errors.push(...passwordValidation.errors);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Gera uma senha aleatória segura
 */
export const generateSecurePassword = (length: number = 12): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '@$!%*?&';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  
  let password = '';
  
  // Garantir pelo menos um caractere de cada tipo
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Preencher o resto aleatoriamente
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Embaralhar a senha
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Calcula a força de uma senha
 */
export const calculatePasswordStrength = (password: string): {
  score: number; // 0-100
  level: 'very_weak' | 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
} => {
  let score = 0;
  const feedback: string[] = [];
  
  if (password.length >= 8) {
    score += 20;
  } else {
    feedback.push('Use pelo menos 8 caracteres');
  }
  
  if (password.length >= 12) {
    score += 10;
  }
  
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Adicione letras minúsculas');
  }
  
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Adicione letras maiúsculas');
  }
  
  if (/\d/.test(password)) {
    score += 15;
  } else {
    feedback.push('Adicione números');
  }
  
  if (/[@$!%*?&]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Adicione caracteres especiais');
  }
  
  if (!/(..).*\1/.test(password)) {
    score += 10;
  } else {
    feedback.push('Evite repetir caracteres');
  }
  
  let level: 'very_weak' | 'weak' | 'fair' | 'good' | 'strong';
  
  if (score < 30) {
    level = 'very_weak';
  } else if (score < 50) {
    level = 'weak';
  } else if (score < 70) {
    level = 'fair';
  } else if (score < 90) {
    level = 'good';
  } else {
    level = 'strong';
  }
  
  return { score, level, feedback };
};

/**
 * Formata erros de autenticação para exibição
 */
export const formatAuthError = (error: any): AuthError => {
  let message = 'Ocorreu um erro inesperado';
  let code = 'unknown_error';
  
  if (error?.message) {
    switch (error.message) {
      case 'Invalid login credentials':
        message = 'Email ou senha incorretos';
        code = 'invalid_credentials';
        break;
      case 'Email not confirmed':
        message = 'Por favor, confirme seu email antes de fazer login';
        code = 'email_not_confirmed';
        break;
      case 'User already registered':
        message = 'Este email já está cadastrado';
        code = 'user_already_exists';
        break;
      case 'Password should be at least 6 characters':
        message = 'A senha deve ter pelo menos 6 caracteres';
        code = 'password_too_short';
        break;
      case 'Signup requires a valid password':
        message = 'Por favor, forneça uma senha válida';
        code = 'invalid_password';
        break;
      case 'Unable to validate email address: invalid format':
        message = 'Formato de email inválido';
        code = 'invalid_email_format';
        break;
      case 'Email rate limit exceeded':
        message = 'Muitas tentativas. Tente novamente em alguns minutos';
        code = 'rate_limit_exceeded';
        break;
      default:
        message = error.message;
    }
  }
  
  return {
    message,
    code,
    status: error?.status
  };
};

/**
 * Sanitiza dados de entrada removendo espaços e caracteres especiais
 */
export const sanitizeAuthInput = (input: string): string => {
  return input.trim().toLowerCase();
};

/**
 * Verifica se um token JWT está expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

/**
 * Extrai informações de um token JWT
 */
export const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

/**
 * Gera um ID de sessão único
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calcula o tempo restante até a expiração do token
 */
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - currentTime);
  } catch {
    return 0;
  }
};

/**
 * Verifica se o usuário deve renovar o token
 */
export const shouldRefreshToken = (token: string, thresholdMinutes: number = 5): boolean => {
  const timeRemaining = getTokenTimeRemaining(token);
  return timeRemaining < (thresholdMinutes * 60);
};
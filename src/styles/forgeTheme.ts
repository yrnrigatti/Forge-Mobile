/**
 * Forge Design System - Tema Global
 * 
 * Sistema de cores e estilos baseado no tema "forja"
 * Inspirado no conceito de forjar o corpo através do treino
 */

export const ForgeColors = {
  // Cores principais - Tema Forja
  steel: '#1A1A1A',           // Preto/Cinza Aço - fundo principal
  steelLight: '#2C2C2C',      // Cinza aço mais claro
  ember: '#FF6B00',           // Laranja Brasa - destaques e botões principais
  incandescent: '#E63946',    // Vermelho Incandescente - alertas e métricas críticas
  metallic: '#B0B0B0',        // Cinza Metalizado - tipografia secundária, bordas
  light: '#F5F5F5',           // Branco Suave - contraste para texto
  
  // Cores de estado
  success: '#10b981',         // Verde para sucesso
  warning: '#f59e0b',         // Amarelo para avisos
  error: '#ef4444',           // Vermelho para erros
  danger: '#ef4444',          // Alias para error
  info: '#3b82f6',            // Azul para informações
  
  // Tons de cinza
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
};

export const ForgeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const ForgeBorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const ForgeFontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
};

export const ForgeFontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const ForgeShadows = {
  sm: {
    shadowColor: ForgeColors.steel,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: ForgeColors.steel,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: ForgeColors.steel,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Estilos de componentes comuns
export const ForgeComponents = {
  // Container principal
  container: {
    flex: 1,
    backgroundColor: ForgeColors.steel,
    padding: ForgeSpacing.xl,
  },
  
  // Card/Container de conteúdo
  card: {
    backgroundColor: ForgeColors.steelLight,
    borderRadius: ForgeBorderRadius.lg,
    padding: ForgeSpacing.xl,
    ...ForgeShadows.md,
  },
  
  // Títulos
  title: {
    fontSize: ForgeFontSizes.xxxl,
    fontWeight: ForgeFontWeights.bold,
    color: ForgeColors.light,
    textAlign: 'center' as const,
    marginBottom: ForgeSpacing.huge,
  },
  
  subtitle: {
    fontSize: ForgeFontSizes.xl,
    fontWeight: ForgeFontWeights.semibold,
    color: ForgeColors.light,
    marginBottom: ForgeSpacing.lg,
  },
  
  // Labels de formulário
  label: {
    fontSize: ForgeFontSizes.base,
    fontWeight: ForgeFontWeights.medium,
    color: ForgeColors.metallic,
    marginBottom: ForgeSpacing.sm,
  },
  
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: ForgeColors.metallic,
    borderRadius: ForgeBorderRadius.md,
    padding: ForgeSpacing.md,
    fontSize: ForgeFontSizes.base,
    backgroundColor: ForgeColors.steelLight,
    color: ForgeColors.light,
  },
  
  inputError: {
    borderColor: ForgeColors.error,
  },
  
  inputFocused: {
    borderColor: ForgeColors.ember,
    shadowColor: ForgeColors.ember,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Botões
  buttonPrimary: {
    backgroundColor: ForgeColors.ember,
    borderRadius: ForgeBorderRadius.md,
    padding: ForgeSpacing.lg,
    alignItems: 'center' as const,
    ...ForgeShadows.md,
  },
  
  buttonPrimaryDisabled: {
    backgroundColor: ForgeColors.gray400,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: ForgeColors.ember,
    borderRadius: ForgeBorderRadius.md,
    padding: ForgeSpacing.lg,
    alignItems: 'center' as const,
  },
  
  buttonText: {
    fontSize: ForgeFontSizes.base,
    fontWeight: ForgeFontWeights.semibold,
    color: ForgeColors.light,
  },
  
  buttonTextSecondary: {
    fontSize: ForgeFontSizes.base,
    fontWeight: ForgeFontWeights.semibold,
    color: ForgeColors.ember,
  },
  
  // Links
  link: {
    fontSize: ForgeFontSizes.base,
    color: ForgeColors.ember,
    textAlign: 'center' as const,
  },
  
  linkSecondary: {
    fontSize: ForgeFontSizes.sm,
    color: ForgeColors.metallic,
    textAlign: 'center' as const,
  },
  
  // Mensagens de erro
  errorText: {
    fontSize: ForgeFontSizes.sm,
    color: ForgeColors.error,
    marginTop: ForgeSpacing.xs,
  },
  
  // Mensagens de sucesso
  successText: {
    fontSize: ForgeFontSizes.sm,
    color: ForgeColors.success,
    textAlign: 'center' as const,
  },
  
  // Indicador de força da senha
  passwordStrength: {
    marginTop: ForgeSpacing.sm,
  },
  
  passwordStrengthBar: {
    height: 4,
    borderRadius: ForgeBorderRadius.sm,
    marginRight: ForgeSpacing.sm,
    flex: 1,
  },
  
  passwordStrengthText: {
    fontSize: ForgeFontSizes.xs,
    fontWeight: ForgeFontWeights.medium,
  },
};

// Utilitários para criar variações de estilo
export const createInputStyle = (hasError: boolean, isFocused: boolean = false) => {
  return {
    ...ForgeComponents.input,
    ...(hasError ? ForgeComponents.inputError : {}),
    ...(isFocused ? ForgeComponents.inputFocused : {}),
  };
};

export const createButtonStyle = (disabled: boolean = false) => {
  return {
    ...ForgeComponents.buttonPrimary,
    ...(disabled ? ForgeComponents.buttonPrimaryDisabled : {}),
  };
};

export const getPasswordStrengthColor = (strength: 'weak' | 'medium' | 'strong') => {
  switch (strength) {
    case 'weak':
      return ForgeColors.error;
    case 'medium':
      return ForgeColors.warning;
    case 'strong':
      return ForgeColors.success;
    default:
      return ForgeColors.metallic;
  }
};
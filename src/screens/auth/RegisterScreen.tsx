import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { ForgeColors, ForgeComponents, createInputStyle, createButtonStyle, getPasswordStrengthColor } from '../../styles/forgeTheme';

/**
 * Tela de Cadastro - Implementação seguindo TDD
 * 
 * Esta implementação foi criada para passar nos testes do Playwright
 * definidos em tests/register-screen.spec.ts
 */

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Função para calcular força da senha
  const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length < 6) return 'weak';
    
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const criteriaCount = [hasLetter, hasNumber, hasSymbol, isLongEnough].filter(Boolean).length;
    
    if (criteriaCount >= 3) return 'strong';
    if (criteriaCount >= 2) return 'medium';
    return 'weak';
  };



  // Validação de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    // Validação da senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    // Validação da confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função de cadastro
  const handleRegister = async () => {
    if (!validateForm()) return;

    setErrors({});
    setSuccessMessage('');

    try {
      const response = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      
      if (response.error) {
        setErrors({ general: response.error.message });
      } else {
        // Sucesso
        setSuccessMessage('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
        
        // Redirecionar após sucesso
        setTimeout(() => {
          navigation.goBack();
        }, 3000);
      }
      
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Erro no servidor' });
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <View style={ForgeComponents.container}>
      <View role="main">
        <Text role="heading" aria-level={1} style={ForgeComponents.title}>
          🔥 Criar Conta
        </Text>
        <Text style={[ForgeComponents.subtitle, { textAlign: 'center', marginBottom: 30 }]}>
          Forje sua jornada
        </Text>
        
        <View role="form" testID="register-form" aria-label="Formulário de cadastro">

      {/* Campo Nome */}
      <View style={{ marginBottom: 20 }}>
        <Text style={ForgeComponents.label}>Nome Completo</Text>
        <TextInput
          testID="name-input"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Digite seu nome completo"
          placeholderTextColor={ForgeColors.metallic}
          style={createInputStyle(!!errors.name)}
          accessibilityLabel="Campo de nome completo"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <Text testID="name-error" role="alert" aria-live="polite" style={ForgeComponents.errorText}>
            {errors.name}
          </Text>
        )}
      </View>

      {/* Campo Email */}
      <View style={{ marginBottom: 20 }}>
        <Text style={ForgeComponents.label}>Email</Text>
        <TextInput
          testID="register-email-input"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          placeholder="Digite seu email"
          placeholderTextColor={ForgeColors.metallic}
          keyboardType="email-address"
          autoCapitalize="none"
          style={createInputStyle(!!errors.email)}
          accessibilityLabel="Campo de email"
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <Text testID="email-error" role="alert" aria-live="polite" style={ForgeComponents.errorText}>
            {errors.email}
          </Text>
        )}
      </View>

      {/* Campo Senha */}
      <View style={{ marginBottom: 20 }}>
        <Text style={ForgeComponents.label}>Senha</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            testID="register-password-input"
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            placeholder="Digite sua senha"
            placeholderTextColor={ForgeColors.metallic}
            secureTextEntry={!showPassword}
            style={[createInputStyle(!!errors.password), { paddingRight: 50 }]}
            accessibilityLabel="Campo de senha"
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          <TouchableOpacity
            testID="toggle-password-visibility"
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 12,
              top: 12,
              padding: 4
            }}
            accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Text style={{ color: ForgeColors.metallic }}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Indicador de força da senha */}
        {formData.password && (
          <View testID="password-strength" style={ForgeComponents.passwordStrength}>
            <Text style={[ForgeComponents.label, { marginBottom: 4 }]}>Força da senha:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[
                ForgeComponents.passwordStrengthBar,
                { backgroundColor: getPasswordStrengthColor(passwordStrength) }
              ]} />
              <Text style={[
                ForgeComponents.passwordStrengthText,
                { color: getPasswordStrengthColor(passwordStrength) }
              ]}>
                {passwordStrength === 'weak' ? 'Fraca' : 
                 passwordStrength === 'medium' ? 'Média' : 'Forte'}
              </Text>
            </View>
          </View>
        )}
        
        {errors.password && (
          <Text testID="password-error" role="alert" aria-live="polite" style={ForgeComponents.errorText}>
            {errors.password}
          </Text>
        )}
      </View>

      {/* Campo Confirmar Senha */}
      <View style={{ marginBottom: 30 }}>
        <Text style={ForgeComponents.label}>Confirmar Senha</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            testID="confirm-password-input"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
            placeholder="Confirme sua senha"
            placeholderTextColor={ForgeColors.metallic}
            secureTextEntry={!showConfirmPassword}
            style={[createInputStyle(!!errors.confirmPassword), { paddingRight: 50 }]}
            accessibilityLabel="Campo de confirmação de senha"
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: 12,
              top: 12,
              padding: 4
            }}
            accessibilityLabel={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
          >
            <Text style={{ color: ForgeColors.metallic }}>
              {showConfirmPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text testID="confirm-password-error" role="alert" aria-live="polite" style={ForgeComponents.errorText}>
            {errors.confirmPassword}
          </Text>
        )}
      </View>

      {/* Mensagens de erro geral */}
      {errors.general && (
        <Text testID="error-message" role="alert" aria-live="assertive" style={{ color: '#ef4444', fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
          {errors.general}
        </Text>
      )}

      {/* Mensagem de sucesso */}
      {successMessage && (
        <Text testID="success-message" style={{ color: '#10b981', fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
          {successMessage}
        </Text>
      )}

          {/* Botão Cadastrar */}
          <TouchableOpacity
            testID="register-button"
            onPress={handleRegister}
             disabled={loading}
             style={createButtonStyle(loading)}
             accessibilityLabel="Botão de cadastro"
             accessibilityState={{ disabled: loading }}
           >
             <Text style={ForgeComponents.buttonText}>
               {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Link para Login */}
        <View style={{ alignItems: 'center' }}>
          <Text style={ForgeComponents.linkSecondary}>Já tem uma conta?</Text>
          <TouchableOpacity
            testID="login-link"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Ir para tela de login"
          >
            <Text style={ForgeComponents.link}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
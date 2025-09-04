import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * EXEMPLO DE IMPLEMENTAÇÃO DA TELA DE CADASTRO
 * 
 * Este arquivo serve como referência para implementar a RegisterScreen
 * que passará nos testes do Playwright criados.
 * 
 * IMPORTANTE: Renomeie este arquivo para RegisterScreen.tsx quando implementar
 */

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
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
    const newErrors: FormErrors = {};

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

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular erro de email já cadastrado (para teste)
      if (formData.email === 'teste@existente.com') {
        throw new Error('Email já está cadastrado');
      }
      
      // Sucesso
      setSuccessMessage('Cadastro realizado com sucesso!');
      
      // Redirecionar após sucesso (opcional)
      setTimeout(() => {
        navigation.goBack(); // ou navigation.navigate('Login')
      }, 2000);
      
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Erro no servidor' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }} testID="register-form">
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
        Criar Conta
      </Text>

      {/* Campo Nome */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 5, fontWeight: '500' }}>Nome Completo</Text>
        <TextInput
          testID="name-input"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Digite seu nome completo"
          style={{
            borderWidth: 1,
            borderColor: errors.name ? '#ef4444' : '#d1d5db',
            borderRadius: 8,
            padding: 12,
            fontSize: 16
          }}
          accessibilityLabel="Campo de nome completo"
        />
        {errors.name && (
          <Text testID="name-error" style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>
            {errors.name}
          </Text>
        )}
      </View>

      {/* Campo Email */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 5, fontWeight: '500' }}>Email</Text>
        <TextInput
          testID="email-input"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          placeholder="Digite seu email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: errors.email ? '#ef4444' : '#d1d5db',
            borderRadius: 8,
            padding: 12,
            fontSize: 16
          }}
          accessibilityLabel="Campo de email"
        />
        {errors.email && (
          <Text testID="email-error" style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>
            {errors.email}
          </Text>
        )}
      </View>

      {/* Campo Senha */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 5, fontWeight: '500' }}>Senha</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            testID="password-input"
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            placeholder="Digite sua senha"
            secureTextEntry={!showPassword}
            style={{
              borderWidth: 1,
              borderColor: errors.password ? '#ef4444' : '#d1d5db',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              paddingRight: 50
            }}
            accessibilityLabel="Campo de senha"
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
            <Text style={{ color: '#6b7280' }}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Indicador de força da senha */}
        {formData.password && (
          <View testID="password-strength" style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 14, marginBottom: 4 }}>Força da senha:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                flex: 1,
                height: 4,
                backgroundColor: passwordStrength === 'weak' ? '#ef4444' : 
                                passwordStrength === 'medium' ? '#f59e0b' : '#10b981',
                borderRadius: 2,
                marginRight: 8
              }} />
              <Text style={{
                fontSize: 12,
                color: passwordStrength === 'weak' ? '#ef4444' : 
                       passwordStrength === 'medium' ? '#f59e0b' : '#10b981',
                fontWeight: '500'
              }}>
                {passwordStrength === 'weak' ? 'Fraca' : 
                 passwordStrength === 'medium' ? 'Média' : 'Forte'}
              </Text>
            </View>
          </View>
        )}
        
        {errors.password && (
          <Text testID="password-error" style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>
            {errors.password}
          </Text>
        )}
      </View>

      {/* Campo Confirmar Senha */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ marginBottom: 5, fontWeight: '500' }}>Confirmar Senha</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            testID="confirm-password-input"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
            placeholder="Confirme sua senha"
            secureTextEntry={!showConfirmPassword}
            style={{
              borderWidth: 1,
              borderColor: errors.confirmPassword ? '#ef4444' : '#d1d5db',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              paddingRight: 50
            }}
            accessibilityLabel="Campo de confirmação de senha"
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
            <Text style={{ color: '#6b7280' }}>
              {showConfirmPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text testID="confirm-password-error" style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>
            {errors.confirmPassword}
          </Text>
        )}
      </View>

      {/* Mensagens de erro geral */}
      {errors.general && (
        <Text testID="error-message" style={{ color: '#ef4444', fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
          {errors.general}
        </Text>
      )}

      {/* Mensagem de sucesso */}
      {successMessage && (
        <Text testID="success-message" style={{ color: '#10b981', fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
          {successMessage}
        </Text>
      )}

      {/* Botão de Cadastro */}
      <TouchableOpacity
        testID="register-button"
        onPress={handleRegister}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 20
        }}
        accessibilityLabel="Botão de cadastro"
      >
        {isLoading ? (
          <Text testID="loading-spinner" style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
            Cadastrando...
          </Text>
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
            Criar Conta
          </Text>
        )}
      </TouchableOpacity>

      {/* Link para Login */}
      <TouchableOpacity
        testID="login-link"
        onPress={() => navigation.goBack()}
        style={{ alignItems: 'center' }}
        accessibilityLabel="Voltar para login"
      >
        <Text style={{ color: '#3b82f6', fontSize: 16 }}>
          Já tem uma conta? Fazer login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
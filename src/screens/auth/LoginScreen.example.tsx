import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * EXEMPLO DE IMPLEMENTAÇÃO DA TELA DE LOGIN
 * 
 * Este arquivo serve como referência para implementar a LoginScreen
 * que inclui o link para a tela de cadastro esperado pelos testes.
 * 
 * IMPORTANTE: Renomeie este arquivo para LoginScreen.tsx quando implementar
 */

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validação de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função de login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular credenciais inválidas (para teste)
      if (formData.email !== 'admin@teste.com' || formData.password !== '123456') {
        throw new Error('Email ou senha incorretos');
      }
      
      // Sucesso - redirecionar para dashboard
      // navigation.navigate('Dashboard');
      
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Erro no servidor' });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    // navigation.navigate('Register');
    console.log('Navegar para tela de cadastro');
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', color: '#1f2937' }}>
        Forge v2
      </Text>

      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 30, textAlign: 'center', color: '#374151' }}>
        Fazer Login
      </Text>

      {/* Campo Email */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 5, fontWeight: '500', color: '#374151' }}>Email</Text>
        <TextInput
          testID="login-email-input"
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
            fontSize: 16,
            backgroundColor: '#f9fafb'
          }}
          accessibilityLabel="Campo de email para login"
        />
        {errors.email && (
          <Text testID="login-email-error" style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>
            {errors.email}
          </Text>
        )}
      </View>

      {/* Campo Senha */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ marginBottom: 5, fontWeight: '500', color: '#374151' }}>Senha</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            testID="login-password-input"
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
              paddingRight: 50,
              backgroundColor: '#f9fafb'
            }}
            accessibilityLabel="Campo de senha para login"
          />
          <TouchableOpacity
            testID="login-toggle-password-visibility"
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
        {errors.password && (
          <Text testID="login-password-error" style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>
            {errors.password}
          </Text>
        )}
      </View>

      {/* Mensagem de erro geral */}
      {errors.general && (
        <Text testID="login-error-message" style={{ color: '#ef4444', fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
          {errors.general}
        </Text>
      )}

      {/* Botão de Login */}
      <TouchableOpacity
        testID="login-button"
        onPress={handleLogin}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 20
        }}
        accessibilityLabel="Botão de login"
      >
        {isLoading ? (
          <Text testID="login-loading-spinner" style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
            Entrando...
          </Text>
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
            Entrar
          </Text>
        )}
      </TouchableOpacity>

      {/* Link para Esqueci a Senha */}
      <TouchableOpacity
        testID="forgot-password-link"
        onPress={() => console.log('Esqueci a senha')}
        style={{ alignItems: 'center', marginBottom: 30 }}
        accessibilityLabel="Esqueci minha senha"
      >
        <Text style={{ color: '#6b7280', fontSize: 14 }}>
          Esqueci minha senha
        </Text>
      </TouchableOpacity>

      {/* Divisor */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
        <Text style={{ marginHorizontal: 16, color: '#6b7280', fontSize: 14 }}>ou</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
      </View>

      {/* Link para Cadastro */}
      <TouchableOpacity
        testID="register-link"
        onPress={navigateToRegister}
        style={{
          borderWidth: 1,
          borderColor: '#3b82f6',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center'
        }}
        accessibilityLabel="Criar nova conta"
      >
        <Text style={{ color: '#3b82f6', fontSize: 16, fontWeight: '500' }}>
          Criar nova conta
        </Text>
      </TouchableOpacity>

      {/* Informações de teste */}
      <View style={{ marginTop: 40, padding: 16, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
        <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', marginBottom: 8 }}>
          Para teste:
        </Text>
        <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
          Email: admin@teste.com
        </Text>
        <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
          Senha: 123456
        </Text>
      </View>
    </View>
  );
}
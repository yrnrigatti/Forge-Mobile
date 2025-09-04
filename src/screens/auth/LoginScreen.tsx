import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { ForgeColors, ForgeComponents, createInputStyle, createButtonStyle } from '../../styles/forgeTheme';

/**
 * Tela de Login - Implementação básica
 * 
 * Esta implementação serve como ponto de partida para o fluxo de autenticação
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
  const { signIn, loading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  // Validação de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    // Validação da senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função de login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setErrors({});

    try {
      const response = await signIn({
        email: formData.email,
        password: formData.password
      });
      
      if (response.error) {
        setErrors({ general: response.error.message });
      } else {
        // Sucesso - o AuthContext já gerencia a navegação
        console.log('Login realizado com sucesso');
      }
      
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Erro no servidor' });
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <View style={ForgeComponents.container}>
      <View role="main" style={{ flex: 1, justifyContent: 'center' }}>
        <Text role="heading" aria-level={1} style={ForgeComponents.title}>
          🔥 Forge
        </Text>
        <Text style={[ForgeComponents.subtitle, { textAlign: 'center', marginBottom: 40 }]}>
          Forje sua melhor versão
        </Text>
        
        <View role="form" testID="login-form" aria-label="Formulário de login">

      {/* Campo Email */}
      <View style={{ marginBottom: 20 }}>
        <Text style={ForgeComponents.label}>Email</Text>
        <TextInput
          testID="login-email-input"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          placeholder="Digite seu email"
          placeholderTextColor={ForgeColors.metallic}
          keyboardType="email-address"
          autoCapitalize="none"
          tabIndex={0}
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
      <View style={{ marginBottom: 30 }}>
        <Text style={ForgeComponents.label}>Senha</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            testID="login-password-input"
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            placeholder="Digite sua senha"
            placeholderTextColor={ForgeColors.metallic}
            secureTextEntry={!showPassword}
            tabIndex={0}
            style={[createInputStyle(!!errors.password), { paddingRight: 50 }]}
            accessibilityLabel="Campo de senha"
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          <TouchableOpacity
            testID="toggle-password-visibility"
            onPress={() => setShowPassword(!showPassword)}
            accessible={true}
            focusable={true}
            style={{
              position: 'absolute',
              right: 12,
              top: 12,
              padding: 4
            }}
            accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            accessibilityRole="button"
          >
            <Text style={{ color: ForgeColors.metallic }}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text testID="password-error" role="alert" aria-live="polite" style={ForgeComponents.errorText}>
            {errors.password}
          </Text>
        )}
      </View>

      {/* Mensagens de erro geral */}
      {errors.general && (
        <Text testID="error-message" role="alert" aria-live="assertive" style={[ForgeComponents.errorText, { textAlign: 'center', marginBottom: 20 }]}>
          {errors.general}
        </Text>
      )}

          {/* Botão de Login */}
          <TouchableOpacity
            testID="login-button"
            onPress={handleLogin}
            disabled={loading}
            accessible={true}
            focusable={true}
            style={[createButtonStyle(loading), { marginBottom: 20 }]}
            accessibilityLabel="Botão de login"
            accessibilityRole="button"
          >
            {loading ? (
              <Text testID="loading-spinner" style={ForgeComponents.buttonText}>
                Entrando...
              </Text>
            ) : (
              <Text style={ForgeComponents.buttonText}>
                Entrar
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Link para Cadastro */}
        <TouchableOpacity
          testID="register-link"
          onPress={navigateToRegister}
          accessible={true}
          focusable={true}
          style={{ alignItems: 'center', marginBottom: 20 }}
          accessibilityLabel="Ir para cadastro"
          accessibilityRole="button"
        >
        <Text style={ForgeComponents.link}>
          Não tem uma conta? Cadastre-se
        </Text>
        </TouchableOpacity>

        {/* Link para Esqueci a Senha */}
        <TouchableOpacity
          testID="forgot-password-link"
          onPress={() => Alert.alert('Info', 'Funcionalidade em desenvolvimento')}
          accessible={true}
          focusable={true}
          style={{ alignItems: 'center' }}
          accessibilityLabel="Esqueci minha senha"
          accessibilityRole="button"
        >
          <Text style={ForgeComponents.linkSecondary}>
            Esqueci minha senha
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
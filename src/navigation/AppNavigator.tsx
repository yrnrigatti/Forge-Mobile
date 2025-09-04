import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Importar telas de autenticação
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { ExerciseNavigator } from './ExerciseNavigator';

// Tipos de navegação
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Workout: undefined;
  Exercises: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Telas temporárias para as tabs principais

const DashboardScreen = () => (
  <Text className="flex-1 bg-forge-steel text-forge-light text-center pt-20">
    📊 Dashboard
  </Text>
);

const WorkoutScreen = () => (
  <Text className="flex-1 bg-forge-steel text-forge-light text-center pt-20">
    💪 Workout
  </Text>
);

const ProfileScreen = () => (
  <Text className="flex-1 bg-forge-steel text-forge-light text-center pt-20">
    👤 Profile
  </Text>
);

// Navegação de autenticação
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1A1A1A', // forge-steel
        },
        headerTintColor: '#F5F5F5', // forge-light
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ 
          title: 'Criar Conta',
          headerBackTitle: 'Voltar'
        }}
      />
    </AuthStack.Navigator>
  );
}

// Navegação principal com tabs
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1A1A1A', // forge-steel
        },
        headerTintColor: '#F5F5F5', // forge-light
        tabBarStyle: {
          backgroundColor: '#2C2C2C', // forge-steel-light
          borderTopColor: '#FF6B00', // forge-ember
        },
        tabBarActiveTintColor: '#FF6B00', // forge-ember
        tabBarInactiveTintColor: '#B0B0B0', // forge-metal
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Exercises" component={ExerciseNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navegação principal
export function AppNavigator() {
  const { user, loading } = useAuth();
  
  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' }}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={{ color: '#F5F5F5', marginTop: 16, fontSize: 16 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar as telas de exercício
import ExerciseListScreen from '../screens/exercise/ExerciseListScreen';
import ExerciseDetailScreen from '../screens/exercise/ExerciseDetailScreen';
import ExerciseCreateScreen from '../screens/exercise/ExerciseCreateScreen';
import ExerciseEditScreen from '../screens/exercise/ExerciseEditScreen';

export type ExerciseStackParamList = {
  ExerciseList: undefined;
  ExerciseDetail: { exerciseId: string };
  ExerciseCreate: undefined;
  ExerciseEdit: { exerciseId: string };
};

const Stack = createNativeStackNavigator<ExerciseStackParamList>();

export function ExerciseNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1A1A1A', // forge-steel
        },
        headerTintColor: '#F5F5F5', // forge-light
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen
        name="ExerciseList"
        component={ExerciseListScreen}
        options={{ headerShown: false }} // A Tab já mostra o título
      />
      <Stack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={{ title: 'Detalhes do Exercício' }}
      />
      <Stack.Screen
        name="ExerciseCreate"
        component={ExerciseCreateScreen}
        options={{ title: 'Novo Exercício' }}
      />
      <Stack.Screen
        name="ExerciseEdit"
        component={ExerciseEditScreen}
        options={{ title: 'Editar Exercício' }}
      />
    </Stack.Navigator>
  );
}

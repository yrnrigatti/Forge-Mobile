import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useExercise } from '../../contexts/ExerciseContext';
import { Exercise } from '../../database/models/Exercise';
import { ForgeComponents, ForgeColors, createButtonStyle } from '../../styles/forgeTheme';

type ExerciseDetailScreenRouteProp = RouteProp<{ params: { exerciseId: string } }, 'params'>;

export default function ExerciseDetailScreen() {
  const route = useRoute<ExerciseDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { exerciseId } = route.params;

  const { loadExerciseById, deleteExercise, loading } = useExercise();
  const [exercise, setExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      const fetchedExercise = await loadExerciseById(exerciseId);
      setExercise(fetchedExercise);
    };

    fetchExercise();
  }, [exerciseId, loadExerciseById]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o exercício "${exercise?.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteExercise(exerciseId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (loading && !exercise) {
    return (
      <View style={ForgeComponents.container}>
        <ActivityIndicator size="large" color={ForgeColors.ember} />
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={ForgeComponents.container}>
        <Text style={{ color: ForgeColors.light }}>Exercício não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={ForgeComponents.container}>
      <Text style={ForgeComponents.title}>{exercise.name}</Text>

      <View style={ForgeComponents.card}>
        <Text style={ForgeComponents.label}>Descrição</Text>
        <Text style={{ color: ForgeColors.light, marginBottom: 20 }}>{exercise.description || 'N/A'}</Text>

        <Text style={ForgeComponents.label}>Grupo Muscular</Text>
        <Text style={{ color: ForgeColors.light }}>{exercise.muscleGroup}</Text>
      </View>

      <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity
          style={[createButtonStyle(false), { flex: 1, marginRight: 10 }]}
          onPress={() => navigation.navigate('ExerciseEdit' as never, { exerciseId: exercise.id } as never)}
        >
          <Text style={ForgeComponents.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[createButtonStyle(false), { flex: 1, marginLeft: 10, backgroundColor: ForgeColors.danger }]}
          onPress={handleDelete}
          disabled={loading}
        >
          <Text style={ForgeComponents.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useExercise } from '../../contexts/ExerciseContext';
import { ForgeComponents, createInputStyle, createButtonStyle, ForgeColors } from '../../styles/forgeTheme';

type ExerciseEditScreenRouteProp = RouteProp<{ params: { exerciseId: string } }, 'params'>;

interface ExerciseFormData {
  name: string;
  description: string;
  muscleGroup: string;
  equipment: string;
}

interface FormErrors {
  name?: string;
  muscleGroup?: string;
}

export default function ExerciseEditScreen() {
  const route = useRoute<ExerciseEditScreenRouteProp>();
  const navigation = useNavigation();
  const { exerciseId } = route.params;

  const { updateExercise, loadExerciseById, loading } = useExercise();
  const [formData, setFormData] = useState<ExerciseFormData | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchExercise = async () => {
      const exercise = await loadExerciseById(exerciseId);
      if (exercise) {
        setFormData({
          name: exercise.name || '',
          description: exercise.description || '',
          muscleGroup: exercise.muscleGroup || '',
          equipment: exercise.equipment || '',
        });
      }
    };
    fetchExercise();
  }, [exerciseId, loadExerciseById]);

  const validateForm = (): boolean => {
    if (!formData) return false;
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'O nome do exercício é obrigatório.';
    }
    if (!formData.muscleGroup.trim()) {
      newErrors.muscleGroup = 'O grupo muscular é obrigatório.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!formData || !validateForm()) {
      return;
    }

    await updateExercise(exerciseId, {
      name: formData.name,
      description: formData.description,
      muscleGroup: formData.muscleGroup,
      equipment: formData.equipment,
    });

    Alert.alert('Sucesso', 'Exercício atualizado com sucesso!');
    navigation.goBack();
  };

  if (!formData) {
    return (
      <View style={ForgeComponents.container}>
        <ActivityIndicator size="large" color={ForgeColors.ember} />
      </View>
    );
  }

  return (
    <ScrollView style={ForgeComponents.container}>
      <Text style={ForgeComponents.title}>Editar Exercício</Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={ForgeComponents.label}>Nome do Exercício</Text>
        <TextInput
          value={formData.name}
          onChangeText={(text) => setFormData(prev => prev ? { ...prev, name: text } : null)}
          placeholder="Ex: Supino Reto"
          style={createInputStyle(!!errors.name)}
        />
        {errors.name && <Text style={ForgeComponents.errorText}>{errors.name}</Text>}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={ForgeComponents.label}>Descrição</Text>
        <TextInput
          value={formData.description}
          onChangeText={(text) => setFormData(prev => prev ? { ...prev, description: text } : null)}
          placeholder="Ex: Deite-se no banco..."
          multiline
          style={[createInputStyle(false), { height: 100 }]}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={ForgeComponents.label}>Grupo Muscular</Text>
        <TextInput
          value={formData.muscleGroup}
          onChangeText={(text) => setFormData(prev => prev ? { ...prev, muscleGroup: text } : null)}
          placeholder="Ex: Peito"
          style={createInputStyle(!!errors.muscleGroup)}
        />
        {errors.muscleGroup && <Text style={ForgeComponents.errorText}>{errors.muscleGroup}</Text>}
      </View>

      <View style={{ marginBottom: 30 }}>
        <Text style={ForgeComponents.label}>Equipamento (Opcional)</Text>
        <TextInput
          value={formData.equipment}
          onChangeText={(text) => setFormData(prev => prev ? { ...prev, equipment: text } : null)}
          placeholder="Ex: Barra e anilhas"
          style={createInputStyle(false)}
        />
      </View>

      <TouchableOpacity
        style={createButtonStyle(loading)}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={ForgeComponents.buttonText}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

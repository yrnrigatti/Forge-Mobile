import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExercise } from '../../contexts/ExerciseContext';
import { ForgeComponents, createInputStyle, createButtonStyle } from '../../styles/forgeTheme';

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

export default function ExerciseCreateScreen() {
  const navigation = useNavigation();
  const { createExercise, loading } = useExercise();
  const [formData, setFormData] = useState<ExerciseFormData>({
    name: '',
    description: '',
    muscleGroup: '',
    equipment: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
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
    if (!validateForm()) {
      return;
    }

    const newExercise = await createExercise({
      name: formData.name,
      description: formData.description,
      muscleGroup: formData.muscleGroup,
      equipment: formData.equipment || 'Peso corporal',
    });

    if (newExercise) {
      Alert.alert('Sucesso', 'Exercício criado com sucesso!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', 'Não foi possível criar o exercício. Tente novamente.');
    }
  };

  return (
    <ScrollView style={ForgeComponents.container}>
      <Text style={ForgeComponents.title}>Novo Exercício</Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={ForgeComponents.label}>Nome do Exercício</Text>
        <TextInput
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Ex: Supino Reto"
          style={createInputStyle(!!errors.name)}
        />
        {errors.name && <Text style={ForgeComponents.errorText}>{errors.name}</Text>}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={ForgeComponents.label}>Descrição</Text>
        <TextInput
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Ex: Deite-se no banco..."
          multiline
          style={[createInputStyle(false), { height: 100 }]}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={ForgeComponents.label}>Grupo Muscular</Text>
        <TextInput
          value={formData.muscleGroup}
          onChangeText={(text) => setFormData(prev => ({ ...prev, muscleGroup: text }))}
          placeholder="Ex: Peito"
          style={createInputStyle(!!errors.muscleGroup)}
        />
        {errors.muscleGroup && <Text style={ForgeComponents.errorText}>{errors.muscleGroup}</Text>}
      </View>

      <View style={{ marginBottom: 30 }}>
        <Text style={ForgeComponents.label}>Equipamento (Opcional)</Text>
        <TextInput
          value={formData.equipment}
          onChangeText={(text) => setFormData(prev => ({ ...prev, equipment: text }))}
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
          {loading ? 'Salvando...' : 'Salvar Exercício'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

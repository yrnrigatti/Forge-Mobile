import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExercise } from '../../contexts/ExerciseContext';
import { ForgeComponents, createInputStyle, createButtonStyle } from '../../styles/forgeTheme';

interface ExerciseFormData {
  name: string;
  description: string;
  muscleGroup: string;
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
    console.log('[handleSave] Botão de salvar pressionado.');

    const isFormValid = validateForm();
    console.log(`[handleSave] Formulário é válido? ${isFormValid}`);

    if (!isFormValid) {
      console.log('[handleSave] Validação falhou. Abortando.');
      return;
    }

    try {
      console.log('[handleSave] Chamando createExercise com os dados:', formData);
      const newExercise = await createExercise({
        name: formData.name,
        description: formData.description,
        muscleGroup: formData.muscleGroup,
      });

      console.log('[handleSave] Resultado de createExercise:', newExercise);

      if (newExercise) {
        Alert.alert('Sucesso', 'Exercício criado com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Não foi possível criar o exercício. Verifique os logs para mais detalhes.');
      }
    } catch (error) {
      console.error('[handleSave] Erro ao criar exercício:', error);
      Alert.alert('Erro Crítico', 'Ocorreu um erro inesperado. Verifique os logs.');
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

      <TouchableOpacity
        style={[createButtonStyle(loading), { marginTop: 30 }]}
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

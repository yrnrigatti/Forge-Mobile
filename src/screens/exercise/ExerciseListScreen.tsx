import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExercise } from '../../contexts/ExerciseContext';
import { Exercise } from '../../database/models/Exercise';
import { ForgeComponents, ForgeColors, createInputStyle, createButtonStyle } from '../../styles/forgeTheme';

export default function ExerciseListScreen() {
  const navigation = useNavigation();
  const {
    filteredExercises,
    loading,
    searchQuery,
    setSearchQuery,
    loadExercises,
  } = useExercise();

  useEffect(() => {
    // Carregar exercícios quando a tela for montada
    loadExercises();
  }, []);

  const renderItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={ForgeComponents.listItem}
      onPress={() => navigation.navigate('ExerciseDetail' as never, { exerciseId: item.id } as never)}
    >
      <View>
        <Text style={ForgeComponents.listItemTitle}>{item.name}</Text>
        <Text style={ForgeComponents.listItemSubtitle}>{item.muscleGroup}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={ForgeComponents.container}>
      <Text role="heading" aria-level={1} style={ForgeComponents.title}>
        Exercícios
      </Text>

      {/* Barra de Busca */}
      <TextInput
        placeholder="Buscar exercício..."
        placeholderTextColor={ForgeColors.metallic}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[createInputStyle(false), { marginBottom: 20 }]}
      />

      {/* Botão de Adicionar Novo */}
      <TouchableOpacity
        style={createButtonStyle(false)}
        onPress={() => navigation.navigate('ExerciseCreate' as never)}
      >
        <Text style={ForgeComponents.buttonText}>Adicionar Novo Exercício</Text>
      </TouchableOpacity>

      {/* Lista de Exercícios */}
      {loading ? (
        <ActivityIndicator size="large" color={ForgeColors.ember} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredExercises}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 20 }}
          ListEmptyComponent={
            <Text style={{ color: ForgeColors.light, textAlign: 'center', marginTop: 40 }}>
              Nenhum exercício encontrado.
            </Text>
          }
        />
      )}
    </View>
  );
}

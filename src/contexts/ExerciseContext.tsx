import React, { createContext, useContext, useState, ReactNode } from 'react';
import { database, Exercise } from '../database';
import { syncService } from '../services/syncService';
import { Q } from '@nozbe/watermelondb';

interface ExerciseContextType {
  // Estado
  exercises: Exercise[];
  filteredExercises: Exercise[];
  loading: boolean;
  searchQuery: string;
  selectedMuscleGroup: string | null;
  
  // Ações
  createExercise: (data: {
    name: string;
    description?: string;
    muscleGroup: string;
  }) => Promise<Exercise | null>;
  updateExercise: (exerciseId: string, updates: Partial<{
    name: string;
    description: string;
    muscleGroup: string;
  }>) => Promise<void>;
  deleteExercise: (exerciseId: string) => Promise<void>;
  
  // Filtros e busca
  setSearchQuery: (query: string) => void;
  setMuscleGroupFilter: (muscleGroup: string | null) => void;
  clearFilters: () => void;
  
  // Carregamento
  loadExercises: () => Promise<void>;
  loadExerciseById: (exerciseId: string) => Promise<Exercise | null>;
  
  // Utilitários
  getMuscleGroups: () => string[];
}

export const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

interface ExerciseProviderProps {
  children: ReactNode;
}

export function ExerciseProvider({ children }: ExerciseProviderProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

  // Aplicar filtros
  const applyFilters = (exerciseList: Exercise[]) => {
    let filtered = exerciseList;
    
    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(query) ||
        exercise.description.toLowerCase().includes(query) ||
        exercise.muscleGroup.toLowerCase().includes(query)
      );
    }
    
    // Filtro por grupo muscular
    if (selectedMuscleGroup) {
      filtered = filtered.filter(exercise => 
        exercise.muscleGroup.toLowerCase() === selectedMuscleGroup.toLowerCase()
      );
    }
    
    setFilteredExercises(filtered);
  };

  // Atualizar filtros quando dados ou filtros mudarem
  React.useEffect(() => {
    applyFilters(exercises);
  }, [exercises, searchQuery, selectedMuscleGroup]);

  // Criar novo exercício
  const createExercise = async (data: {
    name: string;
    description?: string;
    muscleGroup: string;
  }): Promise<Exercise | null> => {
    setLoading(true);
    try {
      let newExercise: Exercise | null = null;
      
      await database.write(async () => {
        newExercise = await database.collections.get<Exercise>('exercises').create(record => {
          (record as any).name = data.name;
          (record as any).description = data.description || '';
          (record as any).muscleGroup = data.muscleGroup;
        });
      });
      
      if (newExercise) {
        // Adicionar à fila de sincronização
        await syncService.addToSyncQueue('exercises', (newExercise as any).id, 'create', {
          name: data.name,
          description: data.description || '',
          muscle_group: data.muscleGroup,
        });
        
        // Atualizar lista local
        await loadExercises();
        
        return newExercise;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao criar exercício:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar exercício
  const updateExercise = async (exerciseId: string, updates: Partial<{
    name: string;
    description: string;
    muscleGroup: string;
  }>) => {
    setLoading(true);
    try {
      const exercise = await database.collections.get<Exercise>('exercises').find(exerciseId);
      
      await database.write(async () => {
        await exercise.update(record => {
          if (updates.name !== undefined) (record as any).name = updates.name;
          if (updates.description !== undefined) (record as any).description = updates.description;
          if (updates.muscleGroup !== undefined) (record as any).muscleGroup = updates.muscleGroup;
        });
      });
      
      // Adicionar à fila de sincronização
      const syncData: any = {};
      if ((exercise as any).supabaseId) {
        syncData.supabase_id = (exercise as any).supabaseId;
      }
      if (updates.name !== undefined) syncData.name = updates.name;
      if (updates.description !== undefined) syncData.description = updates.description;
      if (updates.muscleGroup !== undefined) syncData.muscle_group = updates.muscleGroup;
      
      await syncService.addToSyncQueue('exercises', exerciseId, 'update', syncData);
      
      // Atualizar lista local
      await loadExercises();
    } catch (error) {
      console.error('Erro ao atualizar exercício:', error);
    } finally {
      setLoading(false);
    }
  };

  // Deletar exercício
  const deleteExercise = async (exerciseId: string) => {
    setLoading(true);
    try {
      const exercise = await database.collections.get<Exercise>('exercises').find(exerciseId);
      
      await database.write(async () => {
        await exercise.destroyPermanently();
      });
      
      // Adicionar à fila de sincronização se tiver ID do Supabase
      if ((exercise as any).supabaseId) {
        await syncService.addToSyncQueue('exercises', exerciseId, 'delete', {
          supabase_id: (exercise as any).supabaseId,
        });
      }
      
      // Atualizar lista local
      await loadExercises();
    } catch (error) {
      console.error('Erro ao deletar exercício:', error);
    } finally {
      setLoading(false);
    }
  };

  // Definir query de busca
  const handleSetSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  // Definir filtro de grupo muscular
  const setMuscleGroupFilter = (muscleGroup: string | null) => {
    setSelectedMuscleGroup(muscleGroup);
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMuscleGroup(null);
  };

  // Carregar exercícios
  const loadExercises = async () => {
    setLoading(true);
    try {
      const allExercises = await database.collections
        .get<Exercise>('exercises')
        .query(Q.sortBy('name'))
        .fetch();
      
      setExercises(allExercises);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar exercício por ID
  const loadExerciseById = async (exerciseId: string): Promise<Exercise | null> => {
    try {
      const exercise = await database.collections.get<Exercise>('exercises').find(exerciseId);
      return exercise;
    } catch (error) {
      console.error('Erro ao carregar exercício:', error);
      return null;
    }
  };

  // Obter grupos musculares únicos
  const getMuscleGroups = (): string[] => {
    const muscleGroups = exercises.map(exercise => (exercise as any).muscleGroup);
    return [...new Set(muscleGroups)].sort();
  };

  const value: ExerciseContextType = {
    exercises,
    filteredExercises,
    loading,
    searchQuery,
    selectedMuscleGroup,
    createExercise,
    updateExercise,
    deleteExercise,
    setSearchQuery: handleSetSearchQuery,
    setMuscleGroupFilter,
    clearFilters,
    loadExercises,
    loadExerciseById,
    getMuscleGroups,
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercise(): ExerciseContextType {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error('useExercise deve ser usado dentro de um ExerciseProvider');
  }
  return context;
}
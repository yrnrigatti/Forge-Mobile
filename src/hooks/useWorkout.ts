import { useContext } from 'react';
import { WorkoutContext } from '../contexts/WorkoutContext';

/**
 * Hook para acessar o contexto de treinos
 * 
 * @returns Contexto de treinos com workouts, exercises e métodos de gerenciamento
 * @throws Error se usado fora do WorkoutProvider
 */
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  
  if (!context) {
    throw new Error('useWorkout deve ser usado dentro de um WorkoutProvider');
  }
  
  return context;
};

export default useWorkout;
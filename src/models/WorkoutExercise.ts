// Modelo de dados para WorkoutExercise

import { WorkoutExercise as WorkoutExerciseType } from '../types/exercise';

// Placeholder - implementar modelo de dados para WorkoutExercise
export class WorkoutExercise {
  // Implementar métodos do modelo WorkoutExercise
  static async create(data: Partial<WorkoutExerciseType>): Promise<WorkoutExerciseType> {
    throw new Error('Not implemented');
  }

  static async findById(id: string): Promise<WorkoutExerciseType | null> {
    throw new Error('Not implemented');
  }

  static async findByWorkoutId(workoutId: string): Promise<WorkoutExerciseType[]> {
    throw new Error('Not implemented');
  }

  static async findByExerciseId(exerciseId: string): Promise<WorkoutExerciseType[]> {
    throw new Error('Not implemented');
  }

  static async update(id: string, data: Partial<WorkoutExerciseType>): Promise<WorkoutExerciseType> {
    throw new Error('Not implemented');
  }

  static async delete(id: string): Promise<boolean> {
    throw new Error('Not implemented');
  }
}
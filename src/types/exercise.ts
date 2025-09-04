// Tipos relacionados a exercícios

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroup: MuscleGroup;
  type: ExerciseType;
  instructions?: string;
  imageUrl?: string;
  videoUrl?: string;
  equipment?: Equipment[];
  difficulty: Difficulty;
  isCustom: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number; // em kg
  restTime: number; // em segundos
  completed: boolean;
  notes?: string;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  tempo?: string; // ex: "3-1-2-1" (eccentric-pause-concentric-pause)
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  order: number;
  notes?: string;
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  targetRestTime?: number;
  supersetGroup?: string; // para agrupar exercícios em superset
}

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'cardio'
  | 'full_body';

export type ExerciseType = 
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'balance'
  | 'plyometric'
  | 'powerlifting'
  | 'olympic'
  | 'bodyweight'
  | 'isolation'
  | 'compound';

export type Equipment = 
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'resistance_band'
  | 'medicine_ball'
  | 'suspension_trainer'
  | 'pull_up_bar'
  | 'bench'
  | 'squat_rack'
  | 'smith_machine'
  | 'cardio_machine'
  | 'other';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface ExerciseFilter {
  muscleGroups?: MuscleGroup[];
  types?: ExerciseType[];
  equipment?: Equipment[];
  difficulty?: Difficulty[];
  searchTerm?: string;
  isCustom?: boolean;
  createdBy?: string;
}

export interface ExerciseSort {
  field: 'name' | 'muscleGroup' | 'type' | 'difficulty' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface ExerciseStats {
  exerciseId: string;
  exerciseName: string;
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number; // peso total levantado
  maxWeight: number;
  averageWeight: number;
  maxReps: number;
  averageReps: number;
  lastPerformed?: Date;
  firstPerformed?: Date;
  personalRecords: PersonalRecord[];
  progressData: ExerciseProgress[];
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  type: 'max_weight' | 'max_reps' | 'max_volume' | 'best_set';
  value: number;
  reps?: number;
  weight?: number;
  date: Date;
  workoutId: string;
}

export interface ExerciseProgress {
  date: Date;
  weight: number;
  reps: number;
  volume: number;
  sets: number;
  averageRpe?: number;
  workoutId: string;
}

export interface ExerciseTemplate {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  targetSets: number;
  targetReps: number;
  targetWeight?: number;
  targetRestTime: number;
  notes?: string;
  order: number;
}

export interface ExerciseLibrary {
  exercises: Exercise[];
  categories: ExerciseCategory[];
  muscleGroups: MuscleGroupInfo[];
  equipment: EquipmentInfo[];
}

export interface ExerciseCategory {
  id: string;
  name: string;
  description?: string;
  exercises: string[]; // IDs dos exercícios
}

export interface MuscleGroupInfo {
  id: MuscleGroup;
  name: string;
  description?: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  imageUrl?: string;
}

export interface EquipmentInfo {
  id: Equipment;
  name: string;
  description?: string;
  imageUrl?: string;
  category: 'free_weights' | 'machines' | 'cardio' | 'bodyweight' | 'accessories';
}

// Tipos para criação e edição
export interface CreateExerciseData {
  name: string;
  description?: string;
  muscleGroup: MuscleGroup;
  type: ExerciseType;
  instructions?: string;
  equipment?: Equipment[];
  difficulty: Difficulty;
  imageUrl?: string;
  videoUrl?: string;
}

export interface UpdateExerciseData extends Partial<CreateExerciseData> {
  id: string;
}

export interface CreateSetData {
  reps: number;
  weight: number;
  restTime?: number;
  notes?: string;
  rpe?: number;
  tempo?: string;
}

export interface UpdateSetData extends Partial<CreateSetData> {
  id: string;
}

// Tipos para validação
export interface ExerciseValidation {
  name: { isValid: boolean; errors: string[] };
  muscleGroup: { isValid: boolean; errors: string[] };
  type: { isValid: boolean; errors: string[] };
  difficulty: { isValid: boolean; errors: string[] };
}

export interface SetValidation {
  reps: { isValid: boolean; errors: string[] };
  weight: { isValid: boolean; errors: string[] };
  restTime: { isValid: boolean; errors: string[] };
  rpe: { isValid: boolean; errors: string[] };
}

// Tipos para análise e relatórios
export interface ExerciseAnalysis {
  exerciseId: string;
  trend: 'improving' | 'declining' | 'stable';
  progressRate: number; // % de melhoria por semana
  consistency: number; // % de treinos onde o exercício foi realizado
  volumeTrend: 'increasing' | 'decreasing' | 'stable';
  strengthTrend: 'increasing' | 'decreasing' | 'stable';
  recommendations: string[];
}
// Tipos relacionados ao usuário

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  is_active: boolean;
  email_verified: boolean;
  phone?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height?: number; // em cm
  weight?: number; // em kg
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  preferences: UserPreferences;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  privacy_settings: {
    profile_visibility: 'public' | 'friends' | 'private';
    workout_visibility: 'public' | 'friends' | 'private';
    progress_visibility: 'public' | 'friends' | 'private';
  };
  created_at: Date;
  updated_at: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  units: {
    weight: 'kg' | 'lbs';
    distance: 'km' | 'miles';
    temperature: 'celsius' | 'fahrenheit';
  };
  notifications: {
    workout_reminders: boolean;
    achievement_alerts: boolean;
    weekly_reports: boolean;
    social_updates: boolean;
    email_notifications: boolean;
    push_notifications: boolean;
  };
  workout: {
    default_rest_time: number; // em segundos
    auto_start_timer: boolean;
    sound_effects: boolean;
    vibration: boolean;
    show_weight_suggestions: boolean;
    track_cardio: boolean;
  };
  privacy: {
    share_workouts: boolean;
    share_progress: boolean;
    allow_analytics: boolean;
    data_collection: boolean;
  };
}

export interface UserStats {
  user_id: string;
  total_workouts: number;
  total_duration: number; // em minutos
  total_volume: number; // peso total levantado em kg
  current_streak: number; // dias consecutivos
  longest_streak: number;
  workouts_this_week: number;
  workouts_this_month: number;
  workouts_this_year: number;
  favorite_exercises: Array<{
    exercise_id: string;
    exercise_name: string;
    count: number;
  }>;
  muscle_group_distribution: Array<{
    muscle_group: string;
    percentage: number;
  }>;
  personal_records: Array<{
    exercise_id: string;
    exercise_name: string;
    type: 'max_weight' | 'max_reps' | 'max_volume';
    value: number;
    date: Date;
  }>;
  achievements: UserAchievement[];
  last_calculated: Date;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: 'workout_count' | 'streak' | 'volume' | 'personal_record' | 'consistency';
  title: string;
  description: string;
  icon: string;
  earned_at: Date;
  value?: number;
  metadata?: Record<string, any>;
}

export interface UserGoal {
  id: string;
  user_id: string;
  type: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'flexibility' | 'custom';
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  target_date?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface UserFollower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: Date;
  follower: Pick<User, 'id' | 'name' | 'avatar_url'>;
  following: Pick<User, 'id' | 'name' | 'avatar_url'>;
}

export interface UserActivity {
  id: string;
  user_id: string;
  type: 'workout_completed' | 'achievement_earned' | 'goal_reached' | 'personal_record';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  is_public: boolean;
  created_at: Date;
}

// Tipos para criação e atualização
export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  phone?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

export interface UpdateUserData {
  name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height?: number;
  weight?: number;
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
}

export interface UpdateUserPreferencesData {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  units?: Partial<UserPreferences['units']>;
  notifications?: Partial<UserPreferences['notifications']>;
  workout?: Partial<UserPreferences['workout']>;
  privacy?: Partial<UserPreferences['privacy']>;
}

export interface UpdateUserProfileData {
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  social_links?: Partial<UserProfile['social_links']>;
  privacy_settings?: Partial<UserProfile['privacy_settings']>;
}

// Tipos para validação
export interface UserValidation {
  name: { isValid: boolean; errors: string[] };
  email: { isValid: boolean; errors: string[] };
  phone: { isValid: boolean; errors: string[] };
  height: { isValid: boolean; errors: string[] };
  weight: { isValid: boolean; errors: string[] };
}

// Tipos para filtros e busca
export interface UserFilter {
  search?: string;
  fitness_level?: ('beginner' | 'intermediate' | 'advanced')[];
  location?: string;
  is_active?: boolean;
  created_after?: Date;
  created_before?: Date;
}

export interface UserSort {
  field: 'name' | 'created_at' | 'last_login' | 'total_workouts';
  direction: 'asc' | 'desc';
}

// Tipos para relatórios
export interface UserReport {
  user_id: string;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    workouts_completed: number;
    total_duration: number;
    total_volume: number;
    days_active: number;
    consistency_percentage: number;
  };
  progress: {
    weight_change?: number;
    strength_improvement: number;
    endurance_improvement: number;
  };
  achievements: UserAchievement[];
  goals_progress: Array<{
    goal: UserGoal;
    progress_percentage: number;
  }>;
  insights: string[];
  recommendations: string[];
}

// Tipos para exportação de dados
export interface UserDataExport {
  user: User;
  profile: UserProfile;
  stats: UserStats;
  workouts: any[]; // referência aos workouts
  achievements: UserAchievement[];
  goals: UserGoal[];
  preferences: UserPreferences;
  export_date: Date;
  version: string;
}
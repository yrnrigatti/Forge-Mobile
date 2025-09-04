import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      exercises: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          equipment: string
          id: string
          image_url: string | null
          instructions: string[] | null
          is_active: boolean | null
          muscle_group: string
          name: string
          tips: string[] | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          equipment: string
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          is_active?: boolean | null
          muscle_group: string
          name: string
          tips?: string[] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          equipment?: string
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          is_active?: boolean | null
          muscle_group?: string
          name?: string
          tips?: string[] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_type: string
          description: string | null
          earned_at: string | null
          icon: string | null
          id: string
          is_completed: boolean | null
          progress: number | null
          target: number | null
          title: string
          user_id: string
        }
        Insert: {
          achievement_type: string
          description?: string | null
          earned_at?: string | null
          icon?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          target?: number | null
          title: string
          user_id: string
        }
        Update: {
          achievement_type?: string
          description?: string | null
          earned_at?: string | null
          icon?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          target?: number | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          title: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          title: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_followers: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_value: number | null
          description: string | null
          goal_type: string
          id: string
          is_completed: boolean | null
          target_date: string | null
          target_value: number
          title: string
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          goal_type: string
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          target_value: number
          title: string
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          goal_type?: string
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          target_value?: number
          title?: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          location: string | null
          privacy_settings: Json | null
          social_links: Json | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          location?: string | null
          privacy_settings?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          location?: string | null
          privacy_settings?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          current_streak: number | null
          favorite_exercises: Json | null
          id: string
          last_calculated: string | null
          longest_streak: number | null
          muscle_group_distribution: Json | null
          personal_records: Json | null
          total_duration: number | null
          total_volume: number | null
          total_workouts: number | null
          user_id: string
          workouts_this_month: number | null
          workouts_this_week: number | null
          workouts_this_year: number | null
        }
        Insert: {
          current_streak?: number | null
          favorite_exercises?: Json | null
          id?: string
          last_calculated?: string | null
          longest_streak?: number | null
          muscle_group_distribution?: Json | null
          personal_records?: Json | null
          total_duration?: number | null
          total_volume?: number | null
          total_workouts?: number | null
          user_id: string
          workouts_this_month?: number | null
          workouts_this_week?: number | null
          workouts_this_year?: number | null
        }
        Update: {
          current_streak?: number | null
          favorite_exercises?: Json | null
          id?: string
          last_calculated?: string | null
          longest_streak?: number | null
          muscle_group_distribution?: Json | null
          personal_records?: Json | null
          total_duration?: number | null
          total_volume?: number | null
          total_workouts?: number | null
          user_id?: string
          workouts_this_month?: number | null
          workouts_this_week?: number | null
          workouts_this_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          email_verified: boolean | null
          fitness_level: string | null
          gender: string | null
          goals: string[] | null
          height: number | null
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          phone: string | null
          preferences: Json | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          email_verified?: boolean | null
          fitness_level?: string | null
          gender?: string | null
          goals?: string[] | null
          height?: number | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          email_verified?: boolean | null
          fitness_level?: string | null
          gender?: string | null
          goals?: string[] | null
          height?: number | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          created_at: string | null
          exercise_id: string
          id: string
          notes: string | null
          order_index: number | null
          reps: number
          rest_time: number | null
          sets: number
          weight: number
          workout_id: string
        }
        Insert: {
          created_at?: string | null
          exercise_id: string
          id?: string
          notes?: string | null
          order_index?: number | null
          reps: number
          rest_time?: number | null
          sets: number
          weight: number
          workout_id: string
        }
        Update: {
          created_at?: string | null
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number | null
          reps?: number
          rest_time?: number | null
          sets?: number
          weight?: number
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          created_at: string | null
          date: string
          duration: number
          id: string
          name: string
          notes: string | null
          total_reps: number | null
          total_sets: number | null
          total_volume: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          duration: number
          id?: string
          name: string
          notes?: string | null
          total_reps?: number | null
          total_sets?: number | null
          total_volume?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          duration?: number
          id?: string
          name?: string
          notes?: string | null
          total_reps?: number | null
          total_sets?: number | null
          total_volume?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
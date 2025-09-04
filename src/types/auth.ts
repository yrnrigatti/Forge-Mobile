// Tipos relacionados à autenticação

import { User, Session } from '@supabase/supabase-js';

export interface AuthUser extends User {
  // Extensões personalizadas se necessário
}

export interface AuthSession extends Session {
  // Extensões personalizadas se necessário
}

export interface AuthUserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
  error: any;
}

export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

export interface UserSession {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp em milliseconds
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: AuthError | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signIn: (data: SignInData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: UpdateProfileData) => Promise<{ error: any }>;
  updatePassword: (data: UpdatePasswordData) => Promise<{ error: any }>;
  refreshSession: () => Promise<AuthResponse>;
}

export type AuthEvent = 
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY';

export interface AuthEventData {
  event: AuthEvent;
  session: AuthSession | null;
  user: AuthUser | null;
}

export type AuthStateChangeCallback = (event: AuthEvent, session: AuthSession | null) => void;

// Tipos para validação
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface AuthValidation {
  email: ValidationResult;
  password: ValidationResult;
  name: ValidationResult;
}

// Tipos para configuração de autenticação
export interface AuthConfig {
  requireEmailConfirmation: boolean;
  passwordMinLength: number;
  sessionTimeout: number; // em milliseconds
  maxLoginAttempts: number;
  lockoutDuration: number; // em milliseconds
}

// Tipos para OAuth providers
export type OAuthProvider = 
  | 'google'
  | 'facebook'
  | 'apple'
  | 'github'
  | 'discord';

export interface OAuthOptions {
  provider: OAuthProvider;
  redirectTo?: string;
  scopes?: string;
}

// Tipos para recuperação de senha
export interface PasswordRecovery {
  email: string;
  token: string;
  expiresAt: Date;
}

// Tipos para auditoria de autenticação
export interface AuthAuditLog {
  id: string;
  userId: string;
  event: AuthEvent;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}
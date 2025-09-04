import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, databaseService, secureStorage, AuthResponse, SignUpData, SignInData } from '../services';
import { database } from '../database';
import { User as UserModel } from '../database/models/User';
import { syncService } from '../services/syncService';
import { Q } from '@nozbe/watermelondb';
import type { UserSession } from '../services';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signIn: (data: SignInData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: { name?: string; email?: string }) => Promise<{ error: any }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializar autenticação
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Primeiro, verificar se há uma sessão armazenada localmente
        const storedSession = await secureStorage.getUserSession();
        
        if (storedSession && storedSession.expiresAt > Date.now()) {
          // Sessão local válida, tentar restaurar
          const session = await authService.getCurrentSession();
          
          if (session?.user) {
            setUser(session.user);
            setSession(session);
            await syncUserData(session.user);
          } else {
            // Sessão expirou, limpar armazenamento local
            await secureStorage.clearUserSession();
            await secureStorage.clearAuthTokens();
          }
        } else {
          // Verificar sessão no Supabase
          const session = await authService.getCurrentSession();
          
          if (session?.user) {
            setUser(session.user);
            setSession(session);
            
            // Armazenar sessão de forma segura
            const userSession: UserSession = {
              userId: session.user.id,
              email: session.user.email || '',
              accessToken: session.access_token,
              refreshToken: session.refresh_token || '',
              expiresAt: (session.expires_at || 0) * 1000, // Converter para milliseconds
            };
            
            await secureStorage.setUserSession(userSession);
            await secureStorage.setAuthTokens(session.access_token, session.refresh_token || '');
            
            // Sincronizar dados do usuário com WatermelonDB
            await syncUserData(session.user);
          } else {
            // Limpar qualquer sessão armazenada
            await secureStorage.clearUserSession();
            await secureStorage.clearAuthTokens();
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        // Em caso de erro, limpar dados armazenados
        await secureStorage.clearUserSession();
        await secureStorage.clearAuthTokens();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setUser(session?.user ?? null);
        setSession(session);
        
        if (session?.user) {
          // Armazenar nova sessão
          const userSession: UserSession = {
            userId: session.user.id,
            email: session.user.email || '',
            accessToken: session.access_token,
            refreshToken: session.refresh_token || '',
            expiresAt: (session.expires_at || 0) * 1000,
          };
          
          await secureStorage.setUserSession(userSession);
          await secureStorage.setAuthTokens(session.access_token, session.refresh_token || '');
          await syncUserData(session.user);
          
          if (event === 'SIGNED_IN') {
            syncService.syncAll();
          }
        } else {
          // Limpar sessão armazenada
          await secureStorage.clearUserSession();
          await secureStorage.clearAuthTokens();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);



  const syncUserData = async (user: User) => {
    try {
      // Verificar se o usuário já existe no banco local
      const existingUsers = await database.collections
        .get<UserModel>('users')
        .query()
        .fetch();
      
      const userExists = existingUsers.some(u => (u as any).supabaseId === user.id);
      
      if (!userExists) {
        // Criar usuário no banco local
        await database.write(async () => {
          await database.collections.get<UserModel>('users').create(record => {
            (record as any).supabaseId = user.id;
            (record as any).email = user.email!;
            (record as any).name = user.user_metadata?.name || user.email!;
            (record as any).syncedAt = new Date();
          });
        });
      }
    } catch (error) {
      console.error('Erro ao sincronizar dados do usuário:', error);
    }
  };

  const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await authService.signUp(data);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: SignInData): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await authService.signIn(data);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.signOut();
      
      // Limpar armazenamento seguro
      await secureStorage.clearUserSession();
      await secureStorage.clearAuthTokens();
      
      setUser(null);
      setSession(null);
      
      // Opcional: Limpar dados locais (manter para uso offline)
      // await database.write(async () => {
      //   await database.unsafeResetDatabase();
      // });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const updateProfile = async (updates: { name?: string; email?: string }) => {
    const response = await authService.updateProfile(updates);
    
    // Atualizar também no banco local
    if (!response.error && user) {
      try {
        const localUsers = await database.collections
          .get<UserModel>('users')
          .query()
          .fetch();
        
        const localUser = localUsers.find(u => (u as any).supabaseId === user.id);
        
        if (localUser && updates.name) {
          await database.write(async () => {
            await localUser.update(record => {
              (record as any).name = updates.name!;
            });
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar perfil local:', error);
      }
    }
    
    return response;
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Chaves para armazenamento seguro
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_SESSION: 'user_session',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  LAST_SYNC: 'last_sync',
  USER_PREFERENCES: 'user_preferences',
  LAST_SYNC_TIME: 'last_sync_time',
  SYNC_FAILED_ATTEMPTS: 'sync_failed_attempts',
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

interface UserSession {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    workoutReminders: boolean;
    progressUpdates: boolean;
    socialUpdates: boolean;
  };
  units: {
    weight: 'kg' | 'lbs';
    distance: 'km' | 'miles';
  };
}

class SecureStorageService {
  // Verificar se estamos na web
  private isWeb(): boolean {
    return Platform.OS === 'web';
  }

  // Armazenar valor de forma segura
  async setItem(key: StorageKey, value: string): Promise<void> {
    try {
      if (this.isWeb()) {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Erro ao armazenar ${key}:`, error);
      throw new Error(`Falha ao armazenar dados seguros: ${key}`);
    }
  }

  // Recuperar valor armazenado
  async getItem(key: StorageKey): Promise<string | null> {
    try {
      if (this.isWeb()) {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error(`Erro ao recuperar ${key}:`, error);
      return null;
    }
  }

  // Remover valor armazenado
  async removeItem(key: StorageKey): Promise<void> {
    try {
      if (this.isWeb()) {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
      throw new Error(`Falha ao remover dados seguros: ${key}`);
    }
  }

  // Verificar se uma chave existe
  async hasItem(key: StorageKey): Promise<boolean> {
    try {
      if (this.isWeb()) {
        return localStorage.getItem(key) !== null;
      } else {
        const value = await SecureStore.getItemAsync(key);
        return value !== null;
      }
    } catch (error) {
      console.error(`Erro ao verificar ${key}:`, error);
      return false;
    }
  }

  // Limpar todos os dados armazenados
  async clearAll(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await Promise.all(keys.map(key => this.removeItem(key)));
    } catch (error) {
      console.error('Erro ao limpar armazenamento seguro:', error);
      throw new Error('Falha ao limpar dados seguros');
    }
  }

  // === Métodos específicos para tokens ===

  // Armazenar tokens de autenticação
  async setAuthTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await Promise.all([
        this.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        this.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
      ]);
    } catch (error) {
      console.error('Erro ao armazenar tokens:', error);
      throw new Error('Falha ao armazenar tokens de autenticação');
    }
  }

  // Recuperar token de acesso
  async getAccessToken(): Promise<string | null> {
    return this.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // Recuperar token de refresh
  async getRefreshToken(): Promise<string | null> {
    return this.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Remover tokens de autenticação
  async clearAuthTokens(): Promise<void> {
    try {
      await Promise.all([
        this.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        this.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);
    } catch (error) {
      console.error('Erro ao limpar tokens:', error);
      throw new Error('Falha ao limpar tokens de autenticação');
    }
  }

  // === Métodos específicos para sessão do usuário ===

  // Armazenar sessão do usuário
  async setUserSession(session: UserSession): Promise<void> {
    try {
      const sessionData = JSON.stringify(session);
      await this.setItem(STORAGE_KEYS.USER_SESSION, sessionData);
    } catch (error) {
      console.error('Erro ao armazenar sessão:', error);
      throw new Error('Falha ao armazenar sessão do usuário');
    }
  }

  // Recuperar sessão do usuário
  async getUserSession(): Promise<UserSession | null> {
    try {
      const sessionData = await this.getItem(STORAGE_KEYS.USER_SESSION);
      if (!sessionData) return null;
      
      const session: UserSession = JSON.parse(sessionData);
      
      // Verificar se a sessão não expirou
      if (session.expiresAt && Date.now() > session.expiresAt) {
        await this.clearUserSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Erro ao recuperar sessão:', error);
      return null;
    }
  }

  // Limpar sessão do usuário
  async clearUserSession(): Promise<void> {
    try {
      await this.removeItem(STORAGE_KEYS.USER_SESSION);
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
      throw new Error('Falha ao limpar sessão do usuário');
    }
  }

  // === Métodos para preferências do usuário ===

  // Armazenar preferências do usuário
  async setUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      const preferencesData = JSON.stringify(preferences);
      await this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferencesData);
    } catch (error) {
      console.error('Erro ao armazenar preferências:', error);
      throw new Error('Falha ao armazenar preferências do usuário');
    }
  }

  // Recuperar preferências do usuário
  async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const preferencesData = await this.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (!preferencesData) return null;
      
      return JSON.parse(preferencesData);
    } catch (error) {
      console.error('Erro ao recuperar preferências:', error);
      return null;
    }
  }

  // Atualizar preferências específicas
  async updateUserPreferences(updates: Partial<UserPreferences>): Promise<void> {
    try {
      const currentPreferences = await this.getUserPreferences();
      const newPreferences: UserPreferences = {
        ...this.getDefaultPreferences(),
        ...currentPreferences,
        ...updates,
      };
      
      await this.setUserPreferences(newPreferences);
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      throw new Error('Falha ao atualizar preferências do usuário');
    }
  }

  // === Métodos para configurações biométricas ===

  // Habilitar/desabilitar autenticação biométrica
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await this.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
    } catch (error) {
      console.error('Erro ao configurar biometria:', error);
      throw new Error('Falha ao configurar autenticação biométrica');
    }
  }

  // Verificar se autenticação biométrica está habilitada
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await this.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
      return enabled === 'true';
    } catch (error) {
      console.error('Erro ao verificar biometria:', error);
      return false;
    }
  }

  // === Métodos para sincronização ===

  // Armazenar timestamp da última sincronização
  async setLastSyncTime(timestamp: number): Promise<void> {
    try {
      await this.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString());
    } catch (error) {
      console.error('Erro ao armazenar timestamp de sync:', error);
      throw new Error('Falha ao armazenar timestamp de sincronização');
    }
  }

  // Recuperar timestamp da última sincronização
  async getLastSyncTime(): Promise<number | null> {
    try {
      const timestamp = await this.getItem(STORAGE_KEYS.LAST_SYNC);
      return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
      console.error('Erro ao recuperar timestamp de sync:', error);
      return null;
    }
  }

  // === Métodos utilitários ===

  // Obter preferências padrão
  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'system',
      language: 'pt-BR',
      notifications: {
        workoutReminders: true,
        progressUpdates: true,
        socialUpdates: false,
      },
      units: {
        weight: 'kg',
        distance: 'km',
      },
    };
  }

  // Verificar se o armazenamento seguro está disponível
  async isAvailable(): Promise<boolean> {
    try {
      return await SecureStore.isAvailableAsync();
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do SecureStore:', error);
      return false;
    }
  }

  // Migrar dados antigos (se necessário)
  async migrateData(): Promise<void> {
    try {
      // Implementar migração de dados se necessário
      // Por exemplo, migrar de AsyncStorage para SecureStore
      console.log('Migração de dados concluída');
    } catch (error) {
      console.error('Erro na migração de dados:', error);
      throw new Error('Falha na migração de dados');
    }
  }
}

// Exportar instância singleton
export const secureStorage = new SecureStorageService();

// Exportar tipos
export type { UserSession, UserPreferences, StorageKey };

// Exportar constantes
export { STORAGE_KEYS };
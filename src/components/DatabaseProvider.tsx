import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { database } from '../database';
import { useDatabase } from '../hooks';
import { runMigrations } from '../database/migrations';

interface DatabaseContextType {
  isReady: boolean;
  error: string | null;
  retryInitialization: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

interface DatabaseProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ 
  children, 
  fallback 
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const { isInitialized, isLoading, error: dbError } = useDatabase();

  const initializeDatabase = async (): Promise<void> => {
    try {
      setIsInitializing(true);
      setError(null);
      
      console.log('🚀 Inicializando DatabaseProvider...');
      
      // Executar migrações se necessário
      await runMigrations(database);
      
      // Aguardar inicialização completa
      if (isInitialized && !isLoading && !dbError) {
        setIsReady(true);
        console.log('✅ DatabaseProvider pronto!');
      } else if (dbError) {
        throw new Error(dbError);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ Erro no DatabaseProvider:', err);
      setError(errorMessage);
      setIsReady(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const retryInitialization = async (): Promise<void> => {
    await initializeDatabase();
  };

  // Inicializar quando o hook do banco estiver pronto
  useEffect(() => {
    if (isInitialized && !isLoading) {
      initializeDatabase();
    }
  }, [isInitialized, isLoading, dbError]);

  // Mostrar erro se houver
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Erro no Banco de Dados',
        `Falha ao inicializar o banco de dados: ${error}`,
        [
          {
            text: 'Tentar Novamente',
            onPress: retryInitialization,
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    }
  }, [error]);

  // Renderizar loading ou erro
  if (isInitializing || isLoading || !isReady) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-lg font-medium text-gray-700">
          Inicializando banco de dados...
        </Text>
        {error && (
          <Text className="mt-2 text-sm text-red-600 text-center px-4">
            {error}
          </Text>
        )}
      </View>
    );
  }

  const contextValue: DatabaseContextType = {
    isReady,
    error,
    retryInitialization,
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Hook para usar o contexto do banco
export const useDatabaseContext = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  
  if (!context) {
    throw new Error('useDatabaseContext deve ser usado dentro de DatabaseProvider');
  }
  
  return context;
};

// Componente de loading personalizado
export const DatabaseLoadingScreen: React.FC<{
  message?: string;
}> = ({ message = 'Carregando...' }) => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="bg-blue-50 p-8 rounded-2xl shadow-sm">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-lg font-semibold text-gray-800 text-center">
          {message}
        </Text>
        <Text className="mt-2 text-sm text-gray-600 text-center">
          Configurando seu ambiente de treino
        </Text>
      </View>
    </View>
  );
};

// Componente de erro personalizado
export const DatabaseErrorScreen: React.FC<{
  error: string;
  onRetry: () => void;
}> = ({ error, onRetry }) => {
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <View className="bg-red-50 p-8 rounded-2xl shadow-sm max-w-sm">
        <Text className="text-xl font-bold text-red-800 text-center mb-4">
          Ops! Algo deu errado
        </Text>
        <Text className="text-sm text-red-600 text-center mb-6">
          {error}
        </Text>
        <View className="flex-row space-x-3">
          <View className="flex-1">
            <Text 
              className="bg-red-600 text-white text-center py-3 px-4 rounded-lg font-medium"
              onPress={onRetry}
            >
              Tentar Novamente
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
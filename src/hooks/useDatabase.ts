import { useState, useEffect } from 'react';
import { database } from '../database';
import { seedExercises, getDatabaseStats } from '../database/seedData';
import { syncService } from '../services';

interface DatabaseStats {
  exercises: number;
  workouts: number;
  workoutExercises: number;
  users: number;
}

interface UseDatabaseReturn {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  stats: DatabaseStats;
  initializeDatabase: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

export const useDatabase = (): UseDatabaseReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DatabaseStats>({
    exercises: 0,
    workouts: 0,
    workoutExercises: 0,
    users: 0,
  });

  // Inicializar banco de dados
  const initializeDatabase = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Inicializando banco de dados...');
      
      // Verificar se o banco está funcionando
      await database.write(async () => {
        // Operação simples para testar conectividade
        console.log('✅ Conexão com banco estabelecida');
      });
      
      // Popular com exercícios iniciais se necessário
      await seedExercises();
      
      // Atualizar estatísticas
      await refreshStats();
      
      setIsInitialized(true);
      console.log('✅ Banco de dados inicializado com sucesso!');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ Erro ao inicializar banco:', err);
      setError(errorMessage);
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar estatísticas do banco
  const refreshStats = async (): Promise<void> => {
    try {
      const newStats = await getDatabaseStats();
      setStats(newStats);
      
      console.log('📊 Estatísticas do banco:', newStats);
    } catch (err) {
      console.error('❌ Erro ao atualizar estatísticas:', err);
    }
  };

  // Inicializar automaticamente quando o hook é montado
  useEffect(() => {
    initializeDatabase();
  }, []);

  // Configurar listener para mudanças no banco (opcional)
  useEffect(() => {
    if (!isInitialized) return;

    // Atualizar estatísticas periodicamente
    const interval = setInterval(() => {
      refreshStats();
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, [isInitialized]);

  return {
    isInitialized,
    isLoading,
    error,
    stats,
    initializeDatabase,
    refreshStats,
  };
};

// Hook para verificar status de sincronização
export const useSyncStatus = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const startSync = async (): Promise<void> => {
    try {
      setIsSyncing(true);
      setSyncError(null);
      
      await syncService.syncAll();
      
      setLastSyncTime(new Date());
      console.log('✅ Sincronização concluída');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na sincronização';
      console.error('❌ Erro na sincronização:', err);
      setSyncError(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  // Verificar status da rede e sincronizar automaticamente
  useEffect(() => {
    const checkAndSync = async () => {
      try {
        // Verificar se há itens na fila de sincronização
        const queueCount = await database.collections
          .get('sync_queue')
          .query()
          .fetchCount();
        
        if (queueCount > 0) {
          console.log(`📤 ${queueCount} itens na fila de sincronização`);
          // Tentar sincronizar automaticamente se houver conexão
          await startSync();
        }
      } catch (err) {
        console.error('❌ Erro ao verificar fila de sincronização:', err);
      }
    };

    // Verificar a cada 2 minutos
    const interval = setInterval(checkAndSync, 120000);
    
    // Verificar imediatamente
    checkAndSync();

    return () => clearInterval(interval);
  }, []);

  return {
    isSyncing,
    lastSyncTime,
    syncError,
    startSync,
  };
};

// Hook para monitorar performance do banco
export const useDatabasePerformance = () => {
  const [queryTimes, setQueryTimes] = useState<number[]>([]);
  const [averageQueryTime, setAverageQueryTime] = useState(0);

  const measureQuery = async <T>(queryFn: () => Promise<T>): Promise<T> => {
    const startTime = Date.now();
    
    try {
      const result = await queryFn();
      const endTime = Date.now();
      const queryTime = endTime - startTime;
      
      setQueryTimes(prev => {
        const newTimes = [...prev, queryTime].slice(-10); // Manter apenas os últimos 10
        const average = newTimes.reduce((sum, time) => sum + time, 0) / newTimes.length;
        setAverageQueryTime(average);
        return newTimes;
      });
      
      if (queryTime > 1000) {
        console.warn(`⚠️ Query lenta detectada: ${queryTime}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = Date.now();
      const queryTime = endTime - startTime;
      console.error(`❌ Query falhou após ${queryTime}ms:`, error);
      throw error;
    }
  };

  return {
    queryTimes,
    averageQueryTime,
    measureQuery,
  };
};
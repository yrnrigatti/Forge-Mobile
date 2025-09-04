import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { database } from '../database';
import { supabase } from '../services/supabase';
import { secureStorage } from '../services/secureStorage';

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingChanges: number;
  syncError: string | null;
}

interface UseOfflineSyncReturn {
  syncStatus: SyncStatus;
  forcSync: () => Promise<void>;
  clearSyncQueue: () => Promise<void>;
  getSyncStats: () => Promise<{
    totalPending: number;
    lastSync: Date | null;
    failedAttempts: number;
  }>;
}

/**
 * Hook para gerenciar sincronização offline
 * 
 * Monitora conectividade, gerencia fila de sincronização e
 * sincroniza dados entre banco local e Supabase
 */
export const useOfflineSync = (): UseOfflineSyncReturn => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: false,
    isSyncing: false,
    lastSyncTime: null,
    pendingChanges: 0,
    syncError: null,
  });

  const loadSyncStatus = useCallback(async () => {
    try {
      // Buscar última sincronização
      const lastSyncStr = await secureStorage.getItem('last_sync_time');
      const lastSyncTime = lastSyncStr ? new Date(lastSyncStr) : null;
      
      // Contar mudanças pendentes na fila de sync
      const syncQueue = await database.collections
        .get('sync_queue')
        .query()
        .fetch();
      
      setSyncStatus(prev => ({
        ...prev,
        lastSyncTime,
        pendingChanges: syncQueue.length,
      }));
      
    } catch (error) {
      console.error('Erro ao carregar status de sync:', error);
      setSyncStatus(prev => ({
        ...prev,
        syncError: error instanceof Error ? error.message : 'Erro desconhecido',
      }));
    }
  }, []);

  const forcSync = useCallback(async () => {
    if (syncStatus.isSyncing) {
      return; // Já está sincronizando
    }

    try {
      setSyncStatus(prev => ({ ...prev, isSyncing: true, syncError: null }));
      
      // Verificar se está online
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('Sem conexão com a internet');
      }

      // Buscar itens da fila de sincronização
      const syncQueue = await database.collections
        .get('sync_queue')
        .query()
        .fetch();

      let syncedCount = 0;
      const errors: string[] = [];

      // Processar cada item da fila
      for (const item of syncQueue) {
        try {
          await processSyncItem(item);
          
          // Remover da fila após sucesso
          await database.write(async () => {
            await item.destroyPermanently();
          });
          
          syncedCount++;
        } catch (error) {
          console.error(`Erro ao sincronizar item ${item.id}:`, error);
          errors.push(`Item ${item.id}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }

      // Atualizar timestamp da última sincronização
      const now = new Date();
      await secureStorage.setItem('last_sync_time', now.toISOString());
      
      // Atualizar status
      setSyncStatus(prev => ({
        ...prev,
        lastSyncTime: now,
        pendingChanges: syncQueue.length - syncedCount,
        syncError: errors.length > 0 ? errors.join('; ') : null,
      }));
      
      console.log(`Sincronização concluída: ${syncedCount}/${syncQueue.length} itens`);
      
    } catch (error) {
      console.error('Erro na sincronização:', error);
      setSyncStatus(prev => ({
        ...prev,
        syncError: error instanceof Error ? error.message : 'Erro na sincronização',
      }));
    } finally {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  }, [syncStatus.isSyncing]);

  const processSyncItem = async (syncItem: any) => {
    const { table, operation, data, recordId } = syncItem;
    
    switch (operation) {
      case 'CREATE':
        await supabase.from(table).insert(data);
        break;
        
      case 'UPDATE':
        await supabase.from(table).update(data).eq('id', recordId);
        break;
        
      case 'DELETE':
        await supabase.from(table).delete().eq('id', recordId);
        break;
        
      default:
        throw new Error(`Operação desconhecida: ${operation}`);
    }
  };

  const clearSyncQueue = useCallback(async () => {
    try {
      const syncQueue = await database.collections
        .get('sync_queue')
        .query()
        .fetch();
      
      await database.write(async () => {
        for (const item of syncQueue) {
          await item.destroyPermanently();
        }
      });
      
      setSyncStatus(prev => ({
        ...prev,
        pendingChanges: 0,
        syncError: null,
      }));
      
      console.log('Fila de sincronização limpa');
      
    } catch (error) {
      console.error('Erro ao limpar fila de sync:', error);
      setSyncStatus(prev => ({
        ...prev,
        syncError: error instanceof Error ? error.message : 'Erro ao limpar fila',
      }));
    }
  }, []);

  const getSyncStats = useCallback(async () => {
    try {
      const syncQueue = await database.collections
        .get('sync_queue')
        .query()
        .fetch();
      
      const lastSyncStr = await secureStorage.getItem('last_sync_time');
      const lastSync = lastSyncStr ? new Date(lastSyncStr) : null;
      
      const failedAttemptsStr = await secureStorage.getItem('sync_failed_attempts');
      const failedAttempts = failedAttemptsStr ? parseInt(failedAttemptsStr, 10) : 0;
      
      return {
        totalPending: syncQueue.length,
        lastSync,
        failedAttempts,
      };
      
    } catch (error) {
      console.error('Erro ao obter estatísticas de sync:', error);
      return {
        totalPending: 0,
        lastSync: null,
        failedAttempts: 0,
      };
    }
  }, []);

  // Monitorar conectividade
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setSyncStatus(prev => {
        const newStatus = {
          ...prev,
          isOnline: state.isConnected ?? false,
        };
        
        // Auto-sync quando voltar online
        if (state.isConnected && prev.pendingChanges > 0) {
          forcSync();
        }
        
        return newStatus;
      });
    });

    return unsubscribe;
  }, [forcSync]);

  // Carregar status inicial
  useEffect(() => {
    loadSyncStatus();
  }, [loadSyncStatus]);

  return {
    syncStatus,
    forcSync,
    clearSyncQueue,
    getSyncStats,
  };
};

export default useOfflineSync;
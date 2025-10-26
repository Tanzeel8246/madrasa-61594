import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/untypedClient';
import { 
  getSyncQueue, 
  clearSyncQueue, 
  removeFromSyncQueue,
  getAllFromOfflineStorage,
  saveToOfflineStorage,
  clearOfflineStorage
} from '@/lib/offlineStorage';
import { toast } from 'sonner';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('آن لائن ہو گئے! ڈیٹا sync ہو رہا ہے...');
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('آف لائن ہو گئے! تبدیلیاں محفوظ ہو رہی ہیں');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending changes on mount
    checkPendingChanges();

    // Auto-sync every 30 seconds if online
    const syncInterval = setInterval(() => {
      if (navigator.onLine) {
        syncOfflineData();
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, []);

  const checkPendingChanges = async () => {
    const queue = await getSyncQueue();
    setPendingChanges(queue.length);
  };

  const syncOfflineData = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      const queue = await getSyncQueue();
      
      if (queue.length === 0) {
        setIsSyncing(false);
        return;
      }

      for (const item of queue) {
        try {
          const { table, operation, data } = item;

          if (operation === 'insert') {
            const { error } = await (supabase as any).from(table).insert(data);
            if (error) throw error;
          } else if (operation === 'update') {
            const { error } = await (supabase as any).from(table).update(data).eq('id', data.id);
            if (error) throw error;
          } else if (operation === 'delete') {
            const { error } = await (supabase as any).from(table).delete().eq('id', data.id);
            if (error) throw error;
          }

          await removeFromSyncQueue(item.id);
        } catch (error) {
          console.error('Sync error:', error);
        }
      }

      // Fetch fresh data from server
      await refreshDataFromServer();

      setPendingChanges(0);
      toast.success('تمام تبدیلیاں sync ہو گئیں');
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Sync میں مسئلہ');
    } finally {
      setIsSyncing(false);
    }
  };

  const refreshDataFromServer = async () => {
    try {
      // Fetch and cache all tables
      const tables = ['students', 'teachers', 'classes', 'attendance', 'courses', 'fees', 'education_reports'];
      
      for (const table of tables) {
        const { data, error } = await (supabase as any).from(table).select('*');
        
        if (!error && data) {
          await clearOfflineStorage(table);
          for (const item of data) {
            await saveToOfflineStorage(table, item.id, item);
          }
        }
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  const forceSyncNow = async () => {
    if (navigator.onLine) {
      await syncOfflineData();
    } else {
      toast.error('آف لائن ہیں! sync نہیں ہو سکتا');
    }
  };

  return {
    isOnline,
    isSyncing,
    pendingChanges,
    syncNow: forceSyncNow,
  };
}

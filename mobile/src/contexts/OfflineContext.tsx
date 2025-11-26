import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';

let AsyncStorage: any;
let NetInfo: any;
let SQLite: any;

if (Platform.OS !== 'web') {
  try {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
    NetInfo = require('@react-native-community/netinfo');
    SQLite = require('expo-sqlite');
  } catch (e) {
    console.warn('Mobile modules not available');
  }
} else {
  // Web Mocks
  AsyncStorage = {
    getItem: async (key: string) => localStorage.getItem(key),
    setItem: async (key: string, value: string) => localStorage.setItem(key, value),
  };
  NetInfo = {
    addEventListener: (callback: any) => {
      window.addEventListener('online', () => callback({ isConnected: true }));
      window.addEventListener('offline', () => callback({ isConnected: false }));
      return () => {}; // cleanup
    },
  };
}

interface OfflineContextType {
  isOnline: boolean;
  pendingSyncs: number;
  queueAction: (action: any) => Promise<void>;
  syncNow: () => Promise<void>;
  lastSyncTime: Date | null;
  saveOfflineData: (table: string, data: any) => Promise<void>;
  getOfflineData: (table: string, id?: string) => Promise<any>;
  markForSync: (table: string, id: string, action: 'create' | 'update' | 'delete') => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

interface OfflineProviderProps {
  children: ReactNode;
}

export function OfflineProvider({ children }: OfflineProviderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [db, setDb] = useState<any>(null);
  const [pendingSyncs, setPendingSyncs] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSync, setIsSync] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      initDatabase();
    }
    setupNetworkListener();
  }, []);

  const initDatabase = () => {
    try {
      if (SQLite.openDatabase) {
        const database = SQLite.openDatabase('crm.db');
        setDb(database);
        createTables(database);
      }
    } catch (e) {
      console.warn('Failed to init database:', e);
    }
  };

  const createTables = (database: any) => {
    database.transaction((tx: any) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS customers (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          last_updated INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS activities (
          id TEXT PRIMARY KEY,
          customer_id TEXT NOT NULL,
          data TEXT NOT NULL,
          last_updated INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS pending_changes (
          id TEXT PRIMARY KEY,
          table_name TEXT NOT NULL,
          record_id TEXT NOT NULL,
          action TEXT NOT NULL,
          data TEXT,
          timestamp INTEGER NOT NULL
        );
      `);
      loadPendingChanges(database);
    });
  };

  const setupNetworkListener = () => {
    NetInfo.addEventListener((state: any) => {
      setIsOnline(!!state.isConnected);
      if (state.isConnected) {
        syncNow();
      }
    });
  };

  const loadPendingChanges = (database: any) => {
    if (!database) return;
    
    try {
      database.transaction((tx: any) => {
        tx.executeSql(
          'SELECT * FROM pending_changes ORDER BY timestamp ASC;',
          [],
          (_: any, { rows }: any) => {
            setPendingChanges(rows._array);
            setPendingSyncs(rows.length);
          }
        );
      });
    } catch (e) {
      console.error('Error loading pending changes', e);
    }
  };

  const syncNow = async () => {
    if (!isOnline || !db || isSync) return;
    
    setIsSync(true);
    try {
      // Mock sync logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPendingSyncs(0);
      setPendingChanges([]);
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSync(false);
    }
  };

  const saveOfflineData = async (table: string, data: any) => {
    try {
      if (!db) return;
      
      const serializedData = JSON.stringify(data);
      const timestamp = Date.now();
      
      await db.runAsync(
        `INSERT OR REPLACE INTO ${table} (id, data, last_updated) VALUES (?, ?, ?)`,
        [data.id, serializedData, timestamp]
      );
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const getOfflineData = async (table: string, id?: string) => {
    try {
      if (!db) return null;
      
      let query = `SELECT data FROM ${table}`;
      let params: any[] = [];
      
      if (id) {
        query += ' WHERE id = ?';
        params = [id];
      }
      
      const result = await db.getAllAsync(query, params);
      
      if (id) {
        return result.length > 0 ? JSON.parse((result[0] as any).data) : null;
      } else {
        return result.map((row: any) => JSON.parse(row.data));
      }
    } catch (error) {
      console.error('Error getting offline data:', error);
      return null;
    }
  };

  const markForSync = async (table: string, id: string, action: 'create' | 'update' | 'delete') => {
    try {
      if (!db) return;
      
      const timestamp = Date.now();
      
      await db.runAsync(
        'INSERT INTO sync_queue (table_name, record_id, action, created_at) VALUES (?, ?, ?, ?)',
        [table, id, action, timestamp]
      );
      
      loadPendingChanges();
    } catch (error) {
      console.error('Error marking for sync:', error);
    }
  };

  const syncData = async () => {
    if (!isOnline || isSync || !db) return;
    
    try {
      setIsSync(true);
      
      // Get all pending sync items
      const syncItems = await db.getAllAsync('SELECT * FROM sync_queue ORDER BY created_at ASC');
      
      for (const item of syncItems as any[]) {
        try {
          // Mock API call - replace with actual sync logic
          console.log(`Syncing ${item.action} for ${item.table_name}:${item.record_id}`);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Remove from sync queue on success
          await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [item.id]);
        } catch (error) {
          console.error(`Sync failed for item ${item.id}:`, error);
          // Keep in queue for retry
        }
      }
      
      loadPendingChanges();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSync(false);
    }
  };

  const value: OfflineContextType = {
    isOnline,
    isSync,
    pendingChanges,
    syncData,
    saveOfflineData,
    getOfflineData,
    markForSync,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline(): OfflineContextType {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
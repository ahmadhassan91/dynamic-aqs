import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface OfflineContextType {
  isOnline: boolean;
  isSync: boolean;
  pendingChanges: number;
  syncData: () => Promise<void>;
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
  const [isSync, setIsSync] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    initializeDatabase();
    setupNetworkListener();
    loadPendingChanges();
  }, []);

  const initializeDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('offline_crm.db');
      
      // Create tables for offline storage
      await database.execAsync(`
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
        
        CREATE TABLE IF NOT EXISTS sync_queue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          table_name TEXT NOT NULL,
          record_id TEXT NOT NULL,
          action TEXT NOT NULL,
          data TEXT,
          created_at INTEGER NOT NULL
        );
      `);
      
      setDb(database);
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };

  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = !isOnline;
      setIsOnline(state.isConnected ?? false);
      
      // Auto-sync when coming back online
      if (wasOffline && state.isConnected && pendingChanges > 0) {
        syncData();
      }
    });

    return unsubscribe;
  };

  const loadPendingChanges = async () => {
    try {
      if (db) {
        const result = await db.getAllAsync('SELECT COUNT(*) as count FROM sync_queue');
        setPendingChanges((result[0] as any)?.count || 0);
      }
    } catch (error) {
      console.error('Error loading pending changes:', error);
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
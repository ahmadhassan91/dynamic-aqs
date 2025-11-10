import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOffline } from '../../contexts/OfflineContext';

interface SyncItem {
  id: string;
  type: 'customer' | 'activity' | 'training';
  action: 'create' | 'update' | 'delete';
  title: string;
  description: string;
  timestamp: Date;
}

export default function SyncScreen() {
  const [syncItems, setSyncItems] = useState<SyncItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOnline, pendingChanges, syncData } = useOffline();

  useEffect(() => {
    loadSyncItems();
  }, []);

  const loadSyncItems = () => {
    // Mock sync items - replace with actual data from offline context
    const mockItems: SyncItem[] = [
      {
        id: '1',
        type: 'customer',
        action: 'update',
        title: 'John Smith - Contact Update',
        description: 'Updated phone number and email address',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: '2',
        type: 'activity',
        action: 'create',
        title: 'Customer Visit - Sarah Johnson',
        description: 'Logged training session completion',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: '3',
        type: 'training',
        action: 'update',
        title: 'Training Completion - Mike Wilson',
        description: 'Marked heat pump training as completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      },
    ];
    setSyncItems(mockItems);
  };

  const handleSyncAll = async () => {
    if (!isOnline) {
      Alert.alert('Offline', 'You need an internet connection to sync data.');
      return;
    }

    setIsSyncing(true);
    try {
      await syncData();
      setSyncItems([]); // Clear items after successful sync
      Alert.alert('Success', 'All data synchronized successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to sync data. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearPending = () => {
    Alert.alert(
      'Clear Pending Changes',
      'This will discard all pending changes. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setSyncItems([]);
            Alert.alert('Cleared', 'All pending changes have been discarded.');
          },
        },
      ]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'customer': return 'person-outline';
      case 'activity': return 'calendar-outline';
      case 'training': return 'school-outline';
      default: return 'document-outline';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return '#10b981';
      case 'update': return '#f59e0b';
      case 'delete': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Data Synchronization</Text>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#10b981' : '#ef4444' }]} />
          <Text style={styles.statusText}>
            {isOnline ? 'Online' : 'Offline'} • {pendingChanges} items pending
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.syncButton, (!isOnline || isSyncing) && styles.syncButtonDisabled]}
          onPress={handleSyncAll}
          disabled={!isOnline || isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="sync" size={20} color="#ffffff" />
          )}
          <Text style={styles.syncButtonText}>
            {isSyncing ? 'Syncing...' : 'Sync All'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearPending}
          disabled={syncItems.length === 0}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={styles.clearButtonText}>Clear Pending</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {syncItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#10b981" />
            <Text style={styles.emptyTitle}>All Synced</Text>
            <Text style={styles.emptyDescription}>
              No pending changes to synchronize
            </Text>
          </View>
        ) : (
          <View style={styles.syncList}>
            <Text style={styles.sectionTitle}>Pending Changes</Text>
            {syncItems.map((item) => (
              <View key={item.id} style={styles.syncItem}>
                <View style={styles.syncItemLeft}>
                  <Ionicons
                    name={getTypeIcon(item.type) as any}
                    size={24}
                    color="#6b7280"
                  />
                  <View style={styles.syncItemInfo}>
                    <Text style={styles.syncItemTitle}>{item.title}</Text>
                    <Text style={styles.syncItemDescription}>{item.description}</Text>
                    <Text style={styles.syncItemTimestamp}>
                      {formatTimestamp(item.timestamp)}
                    </Text>
                  </View>
                </View>
                
                <View style={[styles.actionBadge, { backgroundColor: getActionColor(item.action) }]}>
                  <Text style={styles.actionText}>{item.action.toUpperCase()}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  syncButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  syncButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  clearButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  syncList: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  syncItem: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  syncItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  syncItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  syncItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  syncItemDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  syncItemTimestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
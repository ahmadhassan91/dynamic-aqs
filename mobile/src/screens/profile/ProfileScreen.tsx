import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useOffline } from '../../contexts/OfflineContext';
import { useLocation } from '../../contexts/LocationContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isOnline, pendingChanges, syncData } = useOffline();
  const { locationPermission, requestLocationPermission } = useLocation();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const handleSyncData = async () => {
    if (!isOnline) {
      Alert.alert('Offline', 'You need an internet connection to sync data.');
      return;
    }
    
    await syncData();
    Alert.alert('Success', 'Data synchronized successfully.');
  };

  const handleLocationPermission = async () => {
    const granted = await requestLocationPermission();
    if (granted) {
      Alert.alert('Success', 'Location permission granted.');
    } else {
      Alert.alert('Permission Denied', 'Location permission is required for route planning and visit tracking.');
    }
  };

  const menuItems = [
    {
      icon: 'sync-outline',
      title: 'Sync Data',
      subtitle: `${pendingChanges} items pending`,
      onPress: handleSyncData,
      showBadge: pendingChanges > 0,
    },
    {
      icon: 'location-outline',
      title: 'Location Permission',
      subtitle: locationPermission === 'granted' ? 'Enabled' : 'Disabled',
      onPress: handleLocationPermission,
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'App preferences and configuration',
      onPress: () => Alert.alert('Settings', 'Settings screen coming soon'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Help', 'Help screen coming soon'),
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      subtitle: 'App version and information',
      onPress: () => Alert.alert('About', 'Dynamic AQS CRM Mobile v1.0.0'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#ffffff" />
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.userRole}>{user?.role?.replace('_', ' ').toUpperCase()}</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusItem}>
          <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#10b981' : '#ef4444' }]} />
          <Text style={styles.statusText}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
        
        {pendingChanges > 0 && (
          <View style={styles.statusItem}>
            <Ionicons name="sync-outline" size={16} color="#f59e0b" />
            <Text style={styles.statusText}>
              {pendingChanges} items pending sync
            </Text>
          </View>
        )}
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon as any} size={24} color="#6b7280" />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            
            <View style={styles.menuItemRight}>
              {item.showBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pendingChanges}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  userRole: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    color: '#374151',
  },
  menu: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
});
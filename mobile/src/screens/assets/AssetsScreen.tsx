import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileAssetList } from '../../components/assets/MobileAssetList';
import { OfflineAssetManager } from '../../services/OfflineAssetManager';

interface DigitalAsset {
  id: string;
  title: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  cdnUrl: string;
  description?: string;
  tags: string[];
  brands: string[];
  category: string;
  status: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface AssetsScreenProps {
  navigation: any;
  route?: {
    params?: {
      customerId?: string;
      customerName?: string;
    };
  };
}

export const AssetsScreen: React.FC<AssetsScreenProps> = ({ navigation, route }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);
  const [cachedAssetsCount, setCachedAssetsCount] = useState(0);
  const [offlineMode, setOfflineMode] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalDownloads: 0,
    totalShares: 0,
    mostViewedAssets: [] as Array<{ assetId: string; count: number }>,
    recentActivity: [] as any[]
  });

  const customerId = route?.params?.customerId;
  const customerName = route?.params?.customerName;

  useEffect(() => {
    loadCacheInfo();
    loadAnalytics();
  }, []);

  const loadCacheInfo = async () => {
    try {
      const size = await OfflineAssetManager.getCacheSize();
      const cachedAssets = await OfflineAssetManager.getCachedAssets();
      setCacheSize(size);
      setCachedAssetsCount(cachedAssets.length);
    } catch (error) {
      console.error('Error loading cache info:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const analyticsData = await OfflineAssetManager.getAssetUsageAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleAssetShare = async (asset: DigitalAsset) => {
    try {
      // Track usage
      await OfflineAssetManager.trackAssetUsage(asset.id, 'share', {
        customerId,
        customerName,
        sharedAt: new Date().toISOString()
      });

      // If we have a customer context, log this interaction
      if (customerId) {
        Alert.alert(
          'Asset Shared',
          `${asset.title} has been shared with ${customerName || 'customer'}`,
          [
            {
              text: 'Log Interaction',
              onPress: () => {
                navigation.navigate('CustomerDetail', {
                  customerId,
                  newInteraction: {
                    type: 'asset_shared',
                    assetId: asset.id,
                    assetTitle: asset.title,
                    timestamp: new Date().toISOString()
                  }
                });
              }
            },
            { text: 'OK', style: 'default' }
          ]
        );
      }

      // Refresh analytics
      loadAnalytics();
    } catch (error) {
      console.error('Error handling asset share:', error);
    }
  };

  const handleAssetDownload = async (asset: DigitalAsset) => {
    try {
      // Cache the asset for offline access
      const cachedAsset = await OfflineAssetManager.cacheAsset(asset);
      
      if (cachedAsset) {
        // Track usage
        await OfflineAssetManager.trackAssetUsage(asset.id, 'download', {
          customerId,
          customerName,
          downloadedAt: new Date().toISOString()
        });

        Alert.alert(
          'Download Complete',
          `${asset.title} is now available offline`,
          [{ text: 'OK' }]
        );

        // Refresh cache info and analytics
        loadCacheInfo();
        loadAnalytics();
      } else {
        Alert.alert('Error', 'Failed to download asset');
      }
    } catch (error) {
      console.error('Error handling asset download:', error);
      Alert.alert('Error', 'Failed to download asset');
    }
  };

  const clearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all downloaded assets from your device. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            const success = await OfflineAssetManager.clearCache();
            if (success) {
              Alert.alert('Success', 'Cache cleared successfully');
              loadCacheInfo();
              loadAnalytics();
            } else {
              Alert.alert('Error', 'Failed to clear cache');
            }
          }
        }
      ]
    );
  };

  const renderSettings = () => (
    <ScrollView style={styles.settingsContainer}>
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Offline Storage</Text>
        
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Cache Size</Text>
          <Text style={styles.settingsValue}>
            {OfflineAssetManager.formatCacheSize(cacheSize)}
          </Text>
        </View>
        
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Cached Assets</Text>
          <Text style={styles.settingsValue}>{cachedAssetsCount}</Text>
        </View>
        
        <TouchableOpacity style={styles.clearCacheButton} onPress={clearCache}>
          <Text style={styles.clearCacheText}>Clear Cache</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Usage Analytics</Text>
        
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>{analytics.totalViews}</Text>
            <Text style={styles.analyticsLabel}>Views</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>{analytics.totalDownloads}</Text>
            <Text style={styles.analyticsLabel}>Downloads</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>{analytics.totalShares}</Text>
            <Text style={styles.analyticsLabel}>Shares</Text>
          </View>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Preferences</Text>
        
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Offline Mode</Text>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
            thumbColor={offlineMode ? '#FFFFFF' : '#F3F4F6'}
          />
        </View>
        
        <Text style={styles.settingsDescription}>
          When enabled, only cached assets will be shown
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Assets</Text>
          {customerName && (
            <Text style={styles.headerSubtitle}>for {customerName}</Text>
          )}
        </View>
        
        <TouchableOpacity
          onPress={() => setShowSettings(!showSettings)}
          style={styles.settingsButton}
        >
          <Ionicons 
            name={showSettings ? "close" : "settings-outline"} 
            size={24} 
            color="#374151" 
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {showSettings ? (
        renderSettings()
      ) : (
        <MobileAssetList
          onAssetShare={handleAssetShare}
          onAssetDownload={handleAssetDownload}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  backButton: {
    padding: 8,
    marginRight: 8
  },
  headerContent: {
    flex: 1
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827'
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2
  },
  settingsButton: {
    padding: 8,
    marginLeft: 8
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  settingsLabel: {
    fontSize: 16,
    color: '#374151'
  },
  settingsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  settingsDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 20
  },
  clearCacheButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center'
  },
  clearCacheText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  analyticsItem: {
    alignItems: 'center'
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6'
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  }
});
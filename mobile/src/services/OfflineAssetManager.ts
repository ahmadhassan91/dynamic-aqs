import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface CachedAsset {
  id: string;
  title: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  localUri: string;
  cdnUrl: string;
  cachedAt: string;
  lastAccessed: string;
  downloadCount: number;
}

interface AssetUsageRecord {
  assetId: string;
  action: 'view' | 'download' | 'share';
  timestamp: string;
  metadata?: Record<string, any>;
}

export class OfflineAssetManager {
  private static readonly CACHE_KEY = 'cached_assets';
  private static readonly USAGE_KEY = 'asset_usage';
  private static readonly MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB
  private static readonly CACHE_EXPIRY_DAYS = 30;

  static async getCachedAssets(): Promise<CachedAsset[]> {
    try {
      const cachedData = await AsyncStorage.getItem(this.CACHE_KEY);
      if (!cachedData) return [];
      
      const assets: CachedAsset[] = JSON.parse(cachedData);
      
      // Filter out expired assets
      const now = new Date();
      const validAssets = assets.filter(asset => {
        const cachedDate = new Date(asset.cachedAt);
        const daysDiff = (now.getTime() - cachedDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= this.CACHE_EXPIRY_DAYS;
      });

      // Update storage if we filtered out expired assets
      if (validAssets.length !== assets.length) {
        await this.saveCachedAssets(validAssets);
      }

      return validAssets;
    } catch (error) {
      console.error('Error getting cached assets:', error);
      return [];
    }
  }

  static async cacheAsset(asset: {
    id: string;
    title: string;
    originalFileName: string;
    fileSize: number;
    mimeType: string;
    cdnUrl: string;
  }): Promise<CachedAsset | null> {
    try {
      // Check if already cached
      const cachedAssets = await this.getCachedAssets();
      const existingAsset = cachedAssets.find(cached => cached.id === asset.id);
      
      if (existingAsset) {
        // Update last accessed time
        existingAsset.lastAccessed = new Date().toISOString();
        await this.saveCachedAssets(cachedAssets);
        return existingAsset;
      }

      // Check cache size limit
      await this.cleanupCache();

      // Download the file
      const fileExtension = asset.originalFileName.split('.').pop() || 'file';
      const localFileName = `${asset.id}.${fileExtension}`;
      const localUri = `${FileSystem.documentDirectory}assets/${localFileName}`;

      // Ensure assets directory exists
      const assetsDir = `${FileSystem.documentDirectory}assets/`;
      const dirInfo = await FileSystem.getInfoAsync(assetsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(assetsDir, { intermediates: true });
      }

      // Download the file
      const downloadResult = await FileSystem.downloadAsync(asset.cdnUrl, localUri);
      
      if (downloadResult.status === 200) {
        const cachedAsset: CachedAsset = {
          ...asset,
          localUri: downloadResult.uri,
          cachedAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          downloadCount: 0
        };

        // Add to cached assets
        cachedAssets.push(cachedAsset);
        await this.saveCachedAssets(cachedAssets);

        return cachedAsset;
      }

      return null;
    } catch (error) {
      console.error('Error caching asset:', error);
      return null;
    }
  }

  static async removeCachedAsset(assetId: string): Promise<boolean> {
    try {
      const cachedAssets = await this.getCachedAssets();
      const assetIndex = cachedAssets.findIndex(asset => asset.id === assetId);
      
      if (assetIndex === -1) return false;

      const asset = cachedAssets[assetIndex];
      
      // Delete the local file
      const fileInfo = await FileSystem.getInfoAsync(asset.localUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(asset.localUri);
      }

      // Remove from cached assets
      cachedAssets.splice(assetIndex, 1);
      await this.saveCachedAssets(cachedAssets);

      return true;
    } catch (error) {
      console.error('Error removing cached asset:', error);
      return false;
    }
  }

  static async getCacheSize(): Promise<number> {
    try {
      const cachedAssets = await this.getCachedAssets();
      let totalSize = 0;

      for (const asset of cachedAssets) {
        const fileInfo = await FileSystem.getInfoAsync(asset.localUri);
        if (fileInfo.exists) {
          totalSize += fileInfo.size || 0;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  }

  static async cleanupCache(): Promise<void> {
    try {
      const cacheSize = await this.getCacheSize();
      
      if (cacheSize <= this.MAX_CACHE_SIZE) return;

      const cachedAssets = await this.getCachedAssets();
      
      // Sort by last accessed (oldest first)
      cachedAssets.sort((a, b) => 
        new Date(a.lastAccessed).getTime() - new Date(b.lastAccessed).getTime()
      );

      // Remove oldest assets until we're under the limit
      let currentSize = cacheSize;
      const assetsToRemove = [];

      for (const asset of cachedAssets) {
        if (currentSize <= this.MAX_CACHE_SIZE * 0.8) break; // Leave 20% buffer
        
        assetsToRemove.push(asset.id);
        currentSize -= asset.fileSize;
      }

      // Remove the assets
      for (const assetId of assetsToRemove) {
        await this.removeCachedAsset(assetId);
      }
    } catch (error) {
      console.error('Error cleaning up cache:', error);
    }
  }

  static async shareAsset(assetId: string): Promise<boolean> {
    try {
      const cachedAssets = await this.getCachedAssets();
      const asset = cachedAssets.find(cached => cached.id === assetId);
      
      if (!asset) return false;

      const fileInfo = await FileSystem.getInfoAsync(asset.localUri);
      if (!fileInfo.exists) return false;

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) return false;

      // Share the file
      await Sharing.shareAsync(asset.localUri, {
        mimeType: asset.mimeType,
        dialogTitle: `Share ${asset.title}`,
        UTI: asset.mimeType
      });

      // Track usage
      await this.trackAssetUsage(assetId, 'share');

      return true;
    } catch (error) {
      console.error('Error sharing asset:', error);
      return false;
    }
  }

  static async trackAssetUsage(
    assetId: string, 
    action: 'view' | 'download' | 'share',
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const usageRecord: AssetUsageRecord = {
        assetId,
        action,
        timestamp: new Date().toISOString(),
        metadata
      };

      // Get existing usage records
      const existingUsage = await AsyncStorage.getItem(this.USAGE_KEY);
      const usageRecords: AssetUsageRecord[] = existingUsage ? JSON.parse(existingUsage) : [];

      // Add new record
      usageRecords.push(usageRecord);

      // Keep only last 1000 records to prevent storage bloat
      if (usageRecords.length > 1000) {
        usageRecords.splice(0, usageRecords.length - 1000);
      }

      // Save updated records
      await AsyncStorage.setItem(this.USAGE_KEY, JSON.stringify(usageRecords));

      // Update asset download count if it's a download action
      if (action === 'download') {
        const cachedAssets = await this.getCachedAssets();
        const assetIndex = cachedAssets.findIndex(asset => asset.id === assetId);
        
        if (assetIndex !== -1) {
          cachedAssets[assetIndex].downloadCount += 1;
          cachedAssets[assetIndex].lastAccessed = new Date().toISOString();
          await this.saveCachedAssets(cachedAssets);
        }
      }
    } catch (error) {
      console.error('Error tracking asset usage:', error);
    }
  }

  static async getAssetUsageAnalytics(): Promise<{
    totalViews: number;
    totalDownloads: number;
    totalShares: number;
    mostViewedAssets: Array<{ assetId: string; count: number }>;
    recentActivity: AssetUsageRecord[];
  }> {
    try {
      const existingUsage = await AsyncStorage.getItem(this.USAGE_KEY);
      const usageRecords: AssetUsageRecord[] = existingUsage ? JSON.parse(existingUsage) : [];

      const analytics = {
        totalViews: usageRecords.filter(r => r.action === 'view').length,
        totalDownloads: usageRecords.filter(r => r.action === 'download').length,
        totalShares: usageRecords.filter(r => r.action === 'share').length,
        mostViewedAssets: [] as Array<{ assetId: string; count: number }>,
        recentActivity: usageRecords.slice(-20).reverse() // Last 20 activities
      };

      // Calculate most viewed assets
      const assetViews: Record<string, number> = {};
      usageRecords.forEach(record => {
        if (record.action === 'view') {
          assetViews[record.assetId] = (assetViews[record.assetId] || 0) + 1;
        }
      });

      analytics.mostViewedAssets = Object.entries(assetViews)
        .map(([assetId, count]) => ({ assetId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return analytics;
    } catch (error) {
      console.error('Error getting usage analytics:', error);
      return {
        totalViews: 0,
        totalDownloads: 0,
        totalShares: 0,
        mostViewedAssets: [],
        recentActivity: []
      };
    }
  }

  static async clearCache(): Promise<boolean> {
    try {
      const cachedAssets = await this.getCachedAssets();
      
      // Delete all cached files
      for (const asset of cachedAssets) {
        const fileInfo = await FileSystem.getInfoAsync(asset.localUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(asset.localUri);
        }
      }

      // Clear storage
      await AsyncStorage.removeItem(this.CACHE_KEY);
      await AsyncStorage.removeItem(this.USAGE_KEY);

      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  private static async saveCachedAssets(assets: CachedAsset[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(assets));
    } catch (error) {
      console.error('Error saving cached assets:', error);
    }
  }

  static formatCacheSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileAssetViewer } from './MobileAssetViewer';

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

interface MobileAssetListProps {
  onAssetShare?: (asset: DigitalAsset) => void;
  onAssetDownload?: (asset: DigitalAsset) => void;
}

export const MobileAssetList: React.FC<MobileAssetListProps> = ({
  onAssetShare,
  onAssetDownload
}) => {
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<DigitalAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'technical', label: 'Technical' },
    { id: 'training', label: 'Training' },
    { id: 'product_sheets', label: 'Product Sheets' },
    { id: 'brochures', label: 'Brochures' }
  ];

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [assets, searchQuery, selectedCategory]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      
      // Mock data - in real implementation, this would come from API
      const mockAssets: DigitalAsset[] = [
        {
          id: '1',
          title: 'Dynamic AQS Product Brochure 2024',
          originalFileName: 'Dynamic AQS Product Brochure 2024.pdf',
          fileSize: 2048576,
          mimeType: 'application/pdf',
          cdnUrl: 'https://cdn.dynamicaqs.com/assets/marketing/product-brochure-2024.pdf',
          description: 'Comprehensive product overview for residential HVAC systems',
          tags: ['product', 'brochure', '2024', 'residential'],
          brands: ['Dynamic AQS', 'AQS Residential'],
          category: 'brochures',
          status: 'published',
          downloadCount: 245,
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          title: 'Installation Guide v2.1',
          originalFileName: 'Installation Guide v2.1.pdf',
          fileSize: 1536000,
          mimeType: 'application/pdf',
          cdnUrl: 'https://cdn.dynamicaqs.com/assets/technical/installation-guide-v2.pdf',
          description: 'Step-by-step installation instructions for HVAC systems',
          tags: ['installation', 'technical', 'guide', 'hvac'],
          brands: ['Dynamic AQS'],
          category: 'technical',
          status: 'published',
          downloadCount: 189,
          createdAt: '2024-01-25T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z'
        },
        {
          id: '3',
          title: 'Q1 2024 Training Presentation',
          originalFileName: 'Q1 2024 Training Presentation.pptx',
          fileSize: 5242880,
          mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          cdnUrl: 'https://cdn.dynamicaqs.com/assets/training/q1-2024-training.pptx',
          description: 'Quarterly training materials for territory managers',
          tags: ['training', 'q1', '2024', 'presentation'],
          brands: ['Dynamic AQS'],
          category: 'training',
          status: 'published',
          downloadCount: 67,
          createdAt: '2024-02-20T00:00:00Z',
          updatedAt: '2024-03-01T00:00:00Z'
        },
        {
          id: '4',
          title: 'Product Specification Sheet - Model AQS-2000',
          originalFileName: 'AQS-2000-Spec-Sheet.pdf',
          fileSize: 892000,
          mimeType: 'application/pdf',
          cdnUrl: 'https://cdn.dynamicaqs.com/assets/product-sheets/aqs-2000-spec.pdf',
          description: 'Technical specifications for AQS-2000 residential unit',
          tags: ['specifications', 'aqs-2000', 'residential', 'technical'],
          brands: ['Dynamic AQS'],
          category: 'product_sheets',
          status: 'published',
          downloadCount: 156,
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z'
        },
        {
          id: '5',
          title: 'Marketing Campaign Assets - Spring 2024',
          originalFileName: 'Spring-2024-Marketing-Assets.zip',
          fileSize: 15728640,
          mimeType: 'application/zip',
          cdnUrl: 'https://cdn.dynamicaqs.com/assets/marketing/spring-2024-assets.zip',
          description: 'Complete marketing asset package for spring campaign',
          tags: ['marketing', 'campaign', 'spring', '2024', 'assets'],
          brands: ['Dynamic AQS', 'AQS Residential'],
          category: 'marketing',
          status: 'published',
          downloadCount: 89,
          createdAt: '2024-03-01T00:00:00Z',
          updatedAt: '2024-03-05T00:00:00Z'
        }
      ];

      setAssets(mockAssets);
    } catch (error) {
      Alert.alert('Error', 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const filterAssets = () => {
    let filtered = assets;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(asset => asset.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.title.toLowerCase().includes(query) ||
        asset.description?.toLowerCase().includes(query) ||
        asset.tags.some(tag => tag.toLowerCase().includes(query)) ||
        asset.originalFileName.toLowerCase().includes(query)
      );
    }

    setFilteredAssets(filtered);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return 'image-outline';
    } else if (mimeType === 'application/pdf') {
      return 'document-text-outline';
    } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
      return 'easel-outline';
    } else if (mimeType.startsWith('video/')) {
      return 'videocam-outline';
    } else if (mimeType === 'application/zip') {
      return 'archive-outline';
    }
    return 'document-outline';
  };

  const renderAssetItem = ({ item }: { item: DigitalAsset }) => (
    <TouchableOpacity
      style={styles.assetItem}
      onPress={() => setSelectedAsset(item)}
    >
      <View style={styles.assetIcon}>
        <Ionicons 
          name={getFileIcon(item.mimeType) as any} 
          size={24} 
          color="#6B7280" 
        />
      </View>
      
      <View style={styles.assetInfo}>
        <Text style={styles.assetTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.assetFileName} numberOfLines={1}>
          {item.originalFileName}
        </Text>
        <View style={styles.assetMeta}>
          <Text style={styles.assetSize}>{formatFileSize(item.fileSize)}</Text>
          <Text style={styles.assetDivider}>•</Text>
          <Text style={styles.assetDownloads}>{item.downloadCount} downloads</Text>
        </View>
        
        {/* Tags */}
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 3} more</Text>
          )}
        </View>
      </View>
      
      <View style={styles.assetActions}>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilter}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === item.id && styles.categoryButtonTextActive
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );

  if (selectedAsset) {
    return (
      <MobileAssetViewer
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onShare={onAssetShare}
        onDownload={onAssetDownload}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      {renderCategoryFilter()}

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Asset List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading assets...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAssets}
          keyExtractor={(item) => item.id}
          renderItem={renderAssetItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No assets found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Try adjusting your search' : 'No assets available'}
              </Text>
            </View>
          }
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827'
  },
  clearButton: {
    padding: 4
  },
  categoryFilter: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6'
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280'
  },
  categoryButtonTextActive: {
    color: '#FFFFFF'
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF'
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500'
  },
  listContainer: {
    paddingBottom: 20
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  assetInfo: {
    flex: 1
  },
  assetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4
  },
  assetFileName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6
  },
  assetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  assetSize: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  assetDivider: {
    fontSize: 12,
    color: '#D1D5DB',
    marginHorizontal: 6
  },
  assetDownloads: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 2
  },
  tagText: {
    fontSize: 10,
    color: '#1E40AF',
    fontWeight: '500'
  },
  moreTagsText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic'
  },
  assetActions: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 4
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center'
  }
});
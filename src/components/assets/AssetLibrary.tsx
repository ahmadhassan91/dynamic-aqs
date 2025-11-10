'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Group,
  Title,
  Text,
  Button,
  ActionIcon,
  Badge,
  Flex,
  Paper,
  Stack,
  Alert,
  Loader,
  Center,
} from '@mantine/core';
import {
  IconUpload,
  IconChartBar,
  IconGitBranch,
  IconDownload,
  IconApi,
  IconGrid3x3,
  IconList,
  IconTrash,
  IconSettings,
  IconAlertCircle,
} from '@tabler/icons-react';
import { DigitalAsset, AssetFilter } from '@/types/assets';
import { AssetService } from '@/lib/services/assetService';
import { AssetGrid } from './AssetGrid';
import { AssetFilters } from './AssetFilters';
import { AssetUploadModal } from './AssetUploadModal';
import { AssetPreviewModal } from './AssetPreviewModal';
import { AssetMetadataModal } from './AssetMetadataModal';
import { AssetWorkflowManager } from './AssetWorkflowManager';
import { AssetVersionControl } from './AssetVersionControl';
import { AssetAnalyticsDashboard } from './AssetAnalyticsDashboard';
import { AssetMigrationTool } from './AssetMigrationTool';
import { BulkAssetManager } from './BulkAssetManager';
import { AssetAPIIntegration } from './AssetAPIIntegration';

export const AssetLibrary: React.FC = () => {
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<DigitalAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AssetFilter>({});
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<DigitalAsset | null>(null);
  const [editAsset, setEditAsset] = useState<DigitalAsset | null>(null);
  const [showWorkflowManager, setShowWorkflowManager] = useState(false);
  const [versionControlAsset, setVersionControlAsset] = useState<DigitalAsset | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showMigrationTool, setShowMigrationTool] = useState(false);
  const [showBulkManager, setShowBulkManager] = useState(false);
  const [showAPIIntegration, setShowAPIIntegration] = useState(false);

  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AssetService.getAssets(filter);
      setAssets(data);
      setFilteredAssets(data);
    } catch (err) {
      setError('Failed to load assets');
      console.error('Error loading assets:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const handleFilterChange = (newFilter: AssetFilter) => {
    setFilter(newFilter);
  };

  const handleAssetSelect = (assetId: string, selected: boolean) => {
    const newSelection = new Set(selectedAssets);
    if (selected) {
      newSelection.add(assetId);
    } else {
      newSelection.delete(assetId);
    }
    setSelectedAssets(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedAssets.size === filteredAssets.length) {
      setSelectedAssets(new Set());
    } else {
      setSelectedAssets(new Set(filteredAssets.map(asset => asset.id)));
    }
  };

  const handleAssetPreview = (asset: DigitalAsset) => {
    setPreviewAsset(asset);
  };

  const handleAssetEdit = (asset: DigitalAsset) => {
    setEditAsset(asset);
  };

  const handleVersionControl = (asset: DigitalAsset) => {
    setVersionControlAsset(asset);
  };

  const handleAssetDelete = async (assetId: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await AssetService.deleteAsset(assetId);
        await loadAssets();
        setSelectedAssets(prev => {
          const newSet = new Set(prev);
          newSet.delete(assetId);
          return newSet;
        });
      } catch (err) {
        setError('Failed to delete asset');
        console.error('Error deleting asset:', err);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAssets.size === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedAssets.size} selected assets?`)) {
      try {
        await Promise.all(
          Array.from(selectedAssets).map(id => AssetService.deleteAsset(id))
        );
        await loadAssets();
        setSelectedAssets(new Set());
      } catch (err) {
        setError('Failed to delete selected assets');
        console.error('Error deleting assets:', err);
      }
    }
  };

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    loadAssets();
  };

  const handleMetadataUpdate = async (assetId: string, updates: Partial<DigitalAsset>) => {
    try {
      await AssetService.updateAsset(assetId, updates);
      await loadAssets();
      setEditAsset(null);
    } catch (err) {
      setError('Failed to update asset');
      console.error('Error updating asset:', err);
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {/* Header */}
        <Paper shadow="sm" p="md">
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Title order={1}>Asset Library</Title>
              <Text size="sm" c="dimmed">
                Manage and organize your digital marketing and technical assets
              </Text>
            </Stack>
            <Group gap="sm">
              <Button
                leftSection={<IconUpload size={16} />}
                onClick={() => setShowUploadModal(true)}
              >
                Upload Assets
              </Button>
            </Group>
          </Group>
        </Paper>

        {/* Action Bar */}
        <Paper shadow="sm" p="md">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              {selectedAssets.size > 0 && (
                <>
                  <Badge variant="light" size="lg">
                    {selectedAssets.size} selected
                  </Badge>
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => setShowBulkManager(true)}
                    leftSection={<IconSettings size={14} />}
                  >
                    Bulk Actions
                  </Button>
                  <Button
                    size="sm"
                    color="red"
                    variant="light"
                    onClick={handleBulkDelete}
                    leftSection={<IconTrash size={14} />}
                  >
                    Delete Selected
                  </Button>
                </>
              )}
            </Group>

            <Group gap="sm">
              <ActionIcon.Group>
                <ActionIcon
                  variant={viewMode === 'grid' ? 'filled' : 'light'}
                  onClick={() => setViewMode('grid')}
                >
                  <IconGrid3x3 size={16} />
                </ActionIcon>
                <ActionIcon
                  variant={viewMode === 'list' ? 'filled' : 'light'}
                  onClick={() => setViewMode('list')}
                >
                  <IconList size={16} />
                </ActionIcon>
              </ActionIcon.Group>

              <Button.Group>
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconDownload size={16} />}
                  onClick={() => setShowMigrationTool(true)}
                >
                  Import
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconApi size={16} />}
                  onClick={() => setShowAPIIntegration(true)}
                >
                  API
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconChartBar size={16} />}
                  onClick={() => setShowAnalytics(true)}
                >
                  Analytics
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconGitBranch size={16} />}
                  onClick={() => setShowWorkflowManager(true)}
                >
                  Workflow
                </Button>
              </Button.Group>
            </Group>
          </Group>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
          >
            {error}
          </Alert>
        )}

        {/* Content */}
        <Paper shadow="sm" p="md">
          <Flex gap="md">
            {/* Filters Sidebar */}
            <Paper
              w={280}
              p="md"
              withBorder
              style={{ overflowY: 'auto', maxHeight: '70vh' }}
            >
              <AssetFilters
                filter={filter}
                onFilterChange={handleFilterChange}
                totalAssets={assets.length}
                filteredAssets={filteredAssets.length}
              />
            </Paper>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '70vh' }}>
              {loading ? (
                <Center h={400}>
                  <Loader size="lg" />
                </Center>
              ) : (
                <AssetGrid
                  assets={filteredAssets}
                  viewMode={viewMode}
                  selectedAssets={selectedAssets}
                  onAssetSelect={handleAssetSelect}
                  onSelectAll={handleSelectAll}
                  onAssetPreview={handleAssetPreview}
                  onAssetEdit={handleAssetEdit}
                  onAssetDelete={handleAssetDelete}
                  onVersionControl={handleVersionControl}
                />
              )}
            </div>
          </Flex>
        </Paper>
      </Stack>

      {/* Modals */}
      {showUploadModal && (
        <AssetUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {previewAsset && (
        <AssetPreviewModal
          asset={previewAsset}
          onClose={() => setPreviewAsset(null)}
        />
      )}

      {editAsset && (
        <AssetMetadataModal
          asset={editAsset}
          onClose={() => setEditAsset(null)}
          onSave={handleMetadataUpdate}
        />
      )}

      {showWorkflowManager && (
        <AssetWorkflowManager
          onClose={() => setShowWorkflowManager(false)}
        />
      )}

      {versionControlAsset && (
        <AssetVersionControl
          asset={versionControlAsset}
          onClose={() => setVersionControlAsset(null)}
          onVersionRestore={() => {
            setVersionControlAsset(null);
            loadAssets();
          }}
        />
      )}

      {showAnalytics && (
        <AssetAnalyticsDashboard
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {showMigrationTool && (
        <AssetMigrationTool
          onClose={() => setShowMigrationTool(false)}
        />
      )}

      {showBulkManager && selectedAssets.size > 0 && (
        <BulkAssetManager
          selectedAssets={Array.from(selectedAssets)}
          onClose={() => setShowBulkManager(false)}
          onComplete={() => {
            setShowBulkManager(false);
            setSelectedAssets(new Set());
            loadAssets();
          }}
        />
      )}

      {showAPIIntegration && (
        <AssetAPIIntegration
          onClose={() => setShowAPIIntegration(false)}
        />
      )}
    </Container>
  );
};
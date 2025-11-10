'use client';

import React from 'react';
import { 
  SimpleGrid, 
  Card, 
  Text, 
  Group, 
  Badge, 
  ActionIcon, 
  Stack,
  Center,
  Checkbox,
  Box
} from '@mantine/core';
import { 
  IconFile, 
  IconPhoto, 
  IconFileTypePdf, 
  IconPresentation,
  IconEye,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import { DigitalAsset } from '@/types/assets';

interface AssetGridProps {
  assets: DigitalAsset[];
  viewMode: 'grid' | 'list';
  selectedAssets: Set<string>;
  onAssetSelect: (assetId: string, selected: boolean) => void;
  onSelectAll: () => void;
  onAssetPreview: (asset: DigitalAsset) => void;
  onAssetEdit: (asset: DigitalAsset) => void;
  onAssetDelete: (assetId: string) => void;
  onVersionControl?: (asset: DigitalAsset) => void;
}

export const AssetGrid: React.FC<AssetGridProps> = ({
  assets,
  viewMode,
  selectedAssets,
  onAssetSelect,
  onAssetPreview,
  onAssetEdit,
  onAssetDelete,
}) => {
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <IconPhoto size={32} color="green" />;
    }
    if (mimeType === 'application/pdf') {
      return <IconFileTypePdf size={32} color="red" />;
    }
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
      return <IconPresentation size={32} color="orange" />;
    }
    return <IconFile size={32} color="gray" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'green';
      case 'draft': return 'yellow';
      case 'review': return 'blue';
      case 'approved': return 'teal';
      default: return 'gray';
    }
  };

  if (assets.length === 0) {
    return (
      <Center h={300}>
        <Stack align="center" gap="md">
          <IconFile size={48} color="gray" />
          <Text size="lg" c="dimmed">No assets found</Text>
          <Text size="sm" c="dimmed">Upload some assets to get started</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
      {assets.map((asset) => (
        <Card key={asset.id} withBorder shadow="sm" padding="md">
          <Stack gap="sm">
            <Group justify="space-between" align="flex-start">
              <Checkbox
                checked={selectedAssets.has(asset.id)}
                onChange={(e) => onAssetSelect(asset.id, e.currentTarget.checked)}
              />
              <Group gap="xs">
                <ActionIcon
                  variant="light"
                  size="sm"
                  onClick={() => onAssetPreview(asset)}
                >
                  <IconEye size={14} />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  size="sm"
                  onClick={() => onAssetEdit(asset)}
                >
                  <IconEdit size={14} />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  size="sm"
                  onClick={() => onAssetDelete(asset.id)}
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
            </Group>

            <Center>
              {getFileIcon(asset.mimeType)}
            </Center>

            <Stack gap="xs">
              <Text size="sm" fw={500} lineClamp={2}>
                {asset.title}
              </Text>
              
              <Group justify="space-between">
                <Badge 
                  size="xs" 
                  color={getStatusColor(asset.status)}
                  variant="light"
                >
                  {asset.status}
                </Badge>
                <Text size="xs" c="dimmed">
                  {asset.fileSize ? `${Math.round(asset.fileSize / 1024)} KB` : 'Unknown size'}
                </Text>
              </Group>

              {asset.tags && asset.tags.length > 0 && (
                <Group gap="xs">
                  {asset.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} size="xs" variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {asset.tags.length > 2 && (
                    <Text size="xs" c="dimmed">
                      +{asset.tags.length - 2} more
                    </Text>
                  )}
                </Group>
              )}

              <Text size="xs" c="dimmed">
                Modified: {new Date(asset.updatedAt).toLocaleDateString()}
              </Text>
            </Stack>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
};
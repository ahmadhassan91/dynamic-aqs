'use client';

import React from 'react';
import { Modal, Title, Text, Stack, Group, Badge } from '@mantine/core';
import { DigitalAsset } from '@/types/assets';

interface AssetPreviewModalProps {
  asset: DigitalAsset;
  onClose: () => void;
}

export const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({
  asset,
  onClose,
}) => {
  return (
    <Modal opened={true} onClose={onClose} title="Asset Preview" size="lg">
      <Stack gap="md">
        <Title order={3}>{asset.title}</Title>
        <Group>
          <Badge color="blue">{asset.status}</Badge>
          <Text size="sm" c="dimmed">
            {asset.fileSize ? `${Math.round(asset.fileSize / 1024)} KB` : 'Unknown size'}
          </Text>
        </Group>
        {asset.description && (
          <Text>{asset.description}</Text>
        )}
        <Text size="sm" c="dimmed">
          Last modified: {new Date(asset.updatedAt).toLocaleDateString()}
        </Text>
      </Stack>
    </Modal>
  );
};
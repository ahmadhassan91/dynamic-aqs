'use client';

import React from 'react';
import { Modal, Title, Text, Button, Stack } from '@mantine/core';
import { DigitalAsset } from '@/types/assets';

interface AssetMetadataModalProps {
  asset: DigitalAsset;
  onClose: () => void;
  onSave: (assetId: string, updates: Partial<DigitalAsset>) => void;
}

export const AssetMetadataModal: React.FC<AssetMetadataModalProps> = ({
  asset,
  onClose,
  onSave,
}) => {
  return (
    <Modal opened={true} onClose={onClose} title="Edit Asset Metadata" size="md">
      <Stack gap="md">
        <Title order={4}>{asset.title}</Title>
        <Text>Edit asset metadata here.</Text>
        <Button onClick={() => onSave(asset.id, {})}>
          Save Changes
        </Button>
      </Stack>
    </Modal>
  );
};
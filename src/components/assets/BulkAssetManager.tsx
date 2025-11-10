'use client';

import React from 'react';
import { Modal, Title, Text, Stack, Button } from '@mantine/core';

interface BulkAssetManagerProps {
  selectedAssets: string[];
  onClose: () => void;
  onComplete: () => void;
}

export const BulkAssetManager: React.FC<BulkAssetManagerProps> = ({
  selectedAssets,
  onClose,
  onComplete,
}) => {
  return (
    <Modal opened={true} onClose={onClose} title="Bulk Asset Manager" size="md">
      <Stack gap="md">
        <Title order={3}>Bulk Actions</Title>
        <Text>Manage {selectedAssets.length} selected assets.</Text>
        <Button onClick={onComplete}>
          Complete Actions
        </Button>
      </Stack>
    </Modal>
  );
};
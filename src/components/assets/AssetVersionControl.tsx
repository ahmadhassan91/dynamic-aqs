'use client';

import React from 'react';
import { Modal, Title, Text, Stack } from '@mantine/core';
import { DigitalAsset } from '@/types/assets';

interface AssetVersionControlProps {
  asset: DigitalAsset;
  onClose: () => void;
  onVersionRestore: () => void;
}

export const AssetVersionControl: React.FC<AssetVersionControlProps> = ({
  asset,
  onClose,
}) => {
  return (
    <Modal opened={true} onClose={onClose} title="Version Control" size="lg">
      <Stack gap="md">
        <Title order={3}>Version Control for {asset.title}</Title>
        <Text>Manage asset versions and history.</Text>
      </Stack>
    </Modal>
  );
};
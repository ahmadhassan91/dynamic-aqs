'use client';

import React from 'react';
import { Modal, Title, Text, Stack } from '@mantine/core';

interface AssetMigrationToolProps {
  onClose: () => void;
}

export const AssetMigrationTool: React.FC<AssetMigrationToolProps> = ({
  onClose,
}) => {
  return (
    <Modal opened={true} onClose={onClose} title="Asset Migration" size="lg">
      <Stack gap="md">
        <Title order={3}>Asset Migration Tool</Title>
        <Text>Import assets from external sources like Widen, Dropbox, and more.</Text>
      </Stack>
    </Modal>
  );
};
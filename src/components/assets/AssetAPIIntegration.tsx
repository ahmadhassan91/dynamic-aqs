'use client';

import React from 'react';
import { Modal, Title, Text, Stack } from '@mantine/core';

interface AssetAPIIntegrationProps {
  onClose: () => void;
}

export const AssetAPIIntegration: React.FC<AssetAPIIntegrationProps> = ({
  onClose,
}) => {
  return (
    <Modal opened={true} onClose={onClose} title="API Integration" size="lg">
      <Stack gap="md">
        <Title order={3}>Asset API Integration</Title>
        <Text>Configure API integrations for asset management.</Text>
      </Stack>
    </Modal>
  );
};
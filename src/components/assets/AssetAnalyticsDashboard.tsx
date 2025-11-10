'use client';

import React from 'react';
import { Modal, Title, Text, Stack } from '@mantine/core';

interface AssetAnalyticsDashboardProps {
  onClose: () => void;
}

export const AssetAnalyticsDashboard: React.FC<AssetAnalyticsDashboardProps> = ({
  onClose,
}) => {
  return (
    <Modal opened={true} onClose={onClose} title="Asset Analytics" size="xl">
      <Stack gap="md">
        <Title order={3}>Asset Analytics Dashboard</Title>
        <Text>View asset usage statistics and performance metrics.</Text>
      </Stack>
    </Modal>
  );
};
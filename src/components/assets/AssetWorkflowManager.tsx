'use client';

import React from 'react';
import { Modal, Title, Text, Stack } from '@mantine/core';

interface AssetWorkflowManagerProps {
  onClose: () => void;
}

export const AssetWorkflowManager: React.FC<AssetWorkflowManagerProps> = ({
  onClose,
}) => {
  return (
    <Modal opened={true} onClose={onClose} title="Workflow Manager" size="lg">
      <Stack gap="md">
        <Title order={3}>Asset Workflow Management</Title>
        <Text>Manage asset approval workflows and status tracking.</Text>
      </Stack>
    </Modal>
  );
};
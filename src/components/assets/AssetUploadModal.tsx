'use client';

import React from 'react';
import { Modal, Title, Text, Button, Stack } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';

interface AssetUploadModalProps {
  onClose: () => void;
  onUploadComplete: () => void;
}

export const AssetUploadModal: React.FC<AssetUploadModalProps> = ({
  onClose,
  onUploadComplete,
}) => {
  return (
    <Modal opened={true} onClose={onClose} title="Upload Assets" size="md">
      <Stack gap="md">
        <Text>Upload your digital assets here.</Text>
        <Button 
          leftSection={<IconUpload size={16} />}
          onClick={() => {
            // Mock upload
            setTimeout(() => {
              onUploadComplete();
            }, 1000);
          }}
        >
          Upload Files
        </Button>
      </Stack>
    </Modal>
  );
};
'use client';

import React, { useState } from 'react';
import {
  Modal,
  Text,
  Button,
  Stack,
  Group,
  FileInput,
  Alert,
  Progress
} from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { UserImportResult } from '@/types/admin';

interface UserImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (result: UserImportResult) => void;
}

export default function UserImportModal({ isOpen, onClose, onImportComplete }: UserImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);

    // Mock import process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Mock import result
          const result: UserImportResult = {
            totalProcessed: 10,
            successful: 8,
            failed: 2,
            errors: [
              { row: 3, message: 'Invalid email format' },
              { row: 7, message: 'Duplicate email address' }
            ]
          };
          onImportComplete(result);
          setImporting(false);
          setProgress(0);
          setFile(null);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Import Users"
      size="md"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Upload a CSV file to import multiple users at once. The file should contain columns for email, firstName, lastName, and role.
        </Text>

        <FileInput
          label="Select CSV File"
          placeholder="Choose file..."
          value={file}
          onChange={setFile}
          accept=".csv"
          leftSection={<IconUpload size={16} />}
        />

        {importing && (
          <Stack gap="xs">
            <Text size="sm">Importing users...</Text>
            <Progress value={progress} animated />
          </Stack>
        )}

        <Alert color="blue" title="File Format">
          <Text size="sm">
            CSV should have headers: email, firstName, lastName, role, status (optional)
          </Text>
        </Alert>

        <Group justify="flex-end" gap="sm">
          <Button variant="light" onClick={onClose} disabled={importing}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!file || importing}
            loading={importing}
          >
            Import Users
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
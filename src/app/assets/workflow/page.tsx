'use client';

import React, { useState } from 'react';
import { Container, Paper, Title, Text, Button, Center, Stack } from '@mantine/core';
import { IconGitBranch } from '@tabler/icons-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AssetWorkflowManager } from '@/components/assets/AssetWorkflowManager';

export default function AssetWorkflowPage() {
  const [showWorkflow, setShowWorkflow] = useState(true);

  if (!showWorkflow) {
    return (
      <AppLayout>
        <Container size="md" py="xl">
          <Center>
            <Paper p="xl" shadow="md" radius="md" style={{ textAlign: 'center' }}>
              <Stack gap="md">
                <Title order={2}>Asset Workflow Management</Title>
                <Text c="dimmed">
                  Manage asset approval workflows and status tracking
                </Text>
                <Button
                  leftSection={<IconGitBranch size={16} />}
                  onClick={() => setShowWorkflow(true)}
                >
                  Open Workflow Manager
                </Button>
              </Stack>
            </Paper>
          </Center>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AssetWorkflowManager
        onClose={() => setShowWorkflow(false)}
      />
    </AppLayout>
  );
}
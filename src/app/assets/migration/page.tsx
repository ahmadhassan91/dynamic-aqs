'use client';

import React, { useState } from 'react';
import { Container, Paper, Title, Text, Button, Center, Stack } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AssetMigrationTool } from '@/components/assets/AssetMigrationTool';

export default function AssetMigrationPage() {
  const [showMigration, setShowMigration] = useState(true);

  if (!showMigration) {
    return (
      <AppLayout>
        <Container size="md" py="xl">
          <Center>
            <Paper p="xl" shadow="md" radius="md" style={{ textAlign: 'center' }}>
              <Stack gap="md">
                <Title order={2}>Asset Migration</Title>
                <Text c="dimmed">
                  Import assets from external sources like Widen, Dropbox, and more
                </Text>
                <Button
                  leftSection={<IconDownload size={16} />}
                  onClick={() => setShowMigration(true)}
                >
                  Open Migration Tool
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
      <AssetMigrationTool
        onClose={() => setShowMigration(false)}
      />
    </AppLayout>
  );
}
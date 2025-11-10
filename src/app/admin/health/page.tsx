'use client';

import React from 'react';
import { Title, Text, Stack, Paper } from '@mantine/core';
import { AppLayout } from '@/components/layout/AppLayout';
import SystemHealthMonitor from '@/components/admin/SystemHealthMonitor';

export default function AdminHealthPage() {
  return (
    <AppLayout>
      <Stack gap="md">
        <Paper shadow="sm" p="md">
          <Stack gap="xs">
            <Title order={1}>System Health</Title>
            <Text size="sm" c="dimmed">
              Monitor system performance and health metrics
            </Text>
          </Stack>
        </Paper>
        <SystemHealthMonitor />
      </Stack>
    </AppLayout>
  );
}
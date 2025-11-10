'use client';

import React from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';
import IntegrationStatusMonitor from '@/components/admin/IntegrationStatusMonitor';

export default function AdminIntegrationsPage() {
  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <div>
          <Title order={1}>Integration Status</Title>
          <Text size="sm" c="dimmed">
            Monitor and manage system integrations
          </Text>
        </div>
        <IntegrationStatusMonitor />
      </Stack>
    </Container>
  );
}
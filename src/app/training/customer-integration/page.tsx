'use client';

import { Container, Title, Text, Paper, Stack } from '@mantine/core';
import { AppLayout } from '@/components/layout/AppLayout';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';
import { CustomerTrainingIntegration } from '@/components/training/CustomerTrainingIntegration';

export default function CustomerTrainingIntegrationPage() {
  return (
    <MockDataProvider>
      <AppLayout>
        <Container size="xl" py="md">
          <Stack gap="md">
            {/* Header */}
            <Paper shadow="sm" p="md">
              <Stack gap="xs">
                <Title order={1}>Customer Training Integration</Title>
                <Text size="sm" c="dimmed">
                  Schedule training directly from customer records, track requirements, and manage compliance
                </Text>
              </Stack>
            </Paper>

            {/* Main Content */}
            <CustomerTrainingIntegration />
          </Stack>
        </Container>
      </AppLayout>
    </MockDataProvider>
  );
}
'use client';

import { Container, Title, Text, Stack } from '@mantine/core';
import { TrainingCalendar } from '@/components/training/TrainingCalendar';
import { AppLayout } from '@/components/layout/AppLayout';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';
import { ClientOnlyWrapper } from '@/components/ui/ClientOnlyWrapper';

export default function TrainingSchedulePage() {
  return (
    <MockDataProvider>
      <AppLayout>
        <Container size="xl" py="md">
          <Stack gap="md">
            <div>
              <Title order={1}>Schedule Training</Title>
              <Text c="dimmed">Schedule and manage training sessions</Text>
            </div>
            
            <ClientOnlyWrapper>
              <TrainingCalendar />
            </ClientOnlyWrapper>
          </Stack>
        </Container>
      </AppLayout>
    </MockDataProvider>
  );
}
'use client';

import { Title, Text, Stack, Paper } from '@mantine/core';
import { AppLayout } from '@/components/layout/AppLayout';
import { ExecutiveDashboard } from '@/components/reports/ExecutiveDashboard';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';


export default function ExecutiveReportsPage() {
  return (
    <MockDataProvider>
      <AppLayout>
        <Stack gap="md">
          <Paper shadow="sm" p="md">
            <Stack gap="xs">
              <Title order={1}>Executive Dashboard</Title>
              <Text c="dimmed">High-level business metrics and KPIs</Text>
            </Stack>
          </Paper>
          
          <ExecutiveDashboard />
        </Stack>
      </AppLayout>
    </MockDataProvider>
  );
}
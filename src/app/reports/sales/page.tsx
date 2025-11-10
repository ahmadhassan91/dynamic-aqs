'use client';

import { Title, Text, Stack, Paper } from '@mantine/core';
import { SalesReports } from '@/components/reports/SalesReports';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';
import { AppLayout } from '@/components/layout/AppLayout';

export default function SalesReportsPage() {
  return (
    <MockDataProvider>
      <AppLayout>
        <Stack gap="md">
          <Paper shadow="sm" p="md">
            <Stack gap="xs">
              <Title order={1}>Sales Reports</Title>
              <Text c="dimmed">Detailed sales performance and analytics</Text>
            </Stack>
          </Paper>
          
          <SalesReports />
        </Stack>
      </AppLayout>
    </MockDataProvider>
  );
}
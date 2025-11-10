'use client';

import { Title, Text, Stack, Paper } from '@mantine/core';
import { AppLayout } from '@/components/layout/AppLayout';
import { CustomReportBuilder } from '@/components/reports/CustomReportBuilder';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';


export default function CustomReportsPage() {
  return (
    <MockDataProvider>
      <AppLayout>
        <Stack gap="md">
          <Paper shadow="sm" p="md">
            <Stack gap="xs">
              <Title order={1}>Custom Reports</Title>
              <Text c="dimmed">Build and customize your own reports</Text>
            </Stack>
          </Paper>
          
          <CustomReportBuilder />
        </Stack>
      </AppLayout>
    </MockDataProvider>
  );
}
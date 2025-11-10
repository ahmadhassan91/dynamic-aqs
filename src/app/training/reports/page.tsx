'use client';

import { Container, Title, Text, Stack, Tabs } from '@mantine/core';
import { TrainingAnalyticsDashboard } from '@/components/training/TrainingAnalyticsDashboard';
import { TrainingROIMetrics } from '@/components/training/TrainingROIMetrics';
import { CustomTrainingReports } from '@/components/training/CustomTrainingReports';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';
import { AppLayout } from '@/components/layout/AppLayout';

export default function TrainingReportsPage() {
  return (
    <MockDataProvider>
      <AppLayout>
        <Container size="xl" py="md">
          <Stack gap="md">
            <div>
              <Title order={1}>Training Reports</Title>
              <Text c="dimmed">Analyze training effectiveness and performance metrics</Text>
            </div>
            
            <Tabs defaultValue="analytics">
              <Tabs.List>
                <Tabs.Tab value="analytics">Analytics Dashboard</Tabs.Tab>
                <Tabs.Tab value="roi">ROI Metrics</Tabs.Tab>
                <Tabs.Tab value="custom">Custom Reports</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="analytics" pt="md">
                <TrainingAnalyticsDashboard />
              </Tabs.Panel>

              <Tabs.Panel value="roi" pt="md">
                <TrainingROIMetrics />
              </Tabs.Panel>

              <Tabs.Panel value="custom" pt="md">
                <CustomTrainingReports />
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </Container>
      </AppLayout>
    </MockDataProvider>
  );
}
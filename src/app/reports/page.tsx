'use client';

import { useState } from 'react';
import { Container, Title, Text, Stack, Tabs, Paper } from '@mantine/core';
import { IconChartBar, IconTrendingUp, IconTool } from '@tabler/icons-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ExecutiveDashboard } from '@/components/reports/ExecutiveDashboard';
import { SalesReports } from '@/components/reports/SalesReports';
import { CustomReportBuilder } from '@/components/reports/CustomReportBuilder';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<string | null>('dashboard');

  return (
    <MockDataProvider>
      <AppLayout>
        <Stack gap="md" p="md">
          {/* Header */}
          <Paper shadow="sm" p="md">
            <Stack gap="xs">
              <Title order={1}>Reports & Analytics</Title>
              <Text c="dimmed">
                Comprehensive reporting and analytics for Dynamic AQS CRM
              </Text>
            </Stack>
          </Paper>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="dashboard" leftSection={<IconChartBar size={16} />}>
                Executive Dashboard
              </Tabs.Tab>
              <Tabs.Tab value="sales" leftSection={<IconTrendingUp size={16} />}>
                Sales Reports
              </Tabs.Tab>
              <Tabs.Tab value="builder" leftSection={<IconTool size={16} />}>
                Report Builder
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="dashboard" pt="lg">
              <ExecutiveDashboard />
            </Tabs.Panel>

            <Tabs.Panel value="sales" pt="lg">
              <SalesReports />
            </Tabs.Panel>

            <Tabs.Panel value="builder" pt="lg">
              <CustomReportBuilder />
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </AppLayout>
    </MockDataProvider>
  );
}
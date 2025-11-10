'use client';

import { useState } from 'react';
import { Title, Text, Stack, Tabs, ThemeIcon, Card } from '@mantine/core';
import { IconChartBar, IconUsers, IconTool } from '@tabler/icons-react';
import { CommercialLayout } from '@/components/layout/CommercialLayout';
import { RepPerformanceDashboard } from '@/components/commercial/RepPerformanceDashboard';
import { CommercialReportingDashboard } from '@/components/commercial/CommercialReportingDashboard';
import { CustomReportBuilder } from '@/components/commercial/CustomReportBuilder';

export default function CommercialReportsPage() {
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  return (
    <CommercialLayout>
      <div className="residential-content-container">
        <Stack gap="xl" className="commercial-stack-large">
          {/* Header */}
          <div>
            <Title order={1}>Commercial Reports</Title>
            <Text size="lg" c="dimmed">
              Comprehensive reporting and analytics for commercial operations
            </Text>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
                Overview
              </Tabs.Tab>
              <Tabs.Tab value="reps" leftSection={<IconUsers size={16} />}>
                Rep Performance
              </Tabs.Tab>
              <Tabs.Tab value="custom" leftSection={<IconTool size={16} />}>
                Custom Reports
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="overview" pt="xl">
              <CommercialReportingDashboard />
            </Tabs.Panel>

            <Tabs.Panel value="reps" pt="xl">
              <RepPerformanceDashboard />
            </Tabs.Panel>

            <Tabs.Panel value="custom" pt="xl">
              <CustomReportBuilder />
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </div>
    </CommercialLayout>
  );
}
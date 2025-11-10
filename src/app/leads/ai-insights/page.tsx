// AI Insights Page
'use client';

import React from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Breadcrumbs, 
  Anchor,
  Tabs,
  Badge,
  Group
} from '@mantine/core';
import Link from 'next/link';
import { 
  IconSparkles, 
  IconBrain, 
  IconChartBar,
  IconRobot
} from '@tabler/icons-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AIPredictiveInsightsDashboard } from '@/components/ai/AIPredictiveInsightsDashboard';

export default function AIInsightsPage() {
  return (
    <AppLayout>
      <div className="residential-content-container">
        <Container size="xl" py="xl">
          <Stack gap="xl">
            {/* Breadcrumb Navigation */}
            <Breadcrumbs>
              <Anchor component={Link} href="/leads">
                Leads
              </Anchor>
              <Text>AI Insights</Text>
            </Breadcrumbs>
            
            {/* Page Header */}
            <div>
              <Group gap="sm" mb="xs">
                <IconSparkles size={32} color="var(--mantine-color-violet-6)" />
                <Title order={1}>AI Insights & Predictions</Title>
                <Badge size="lg" variant="gradient" gradient={{ from: 'violet', to: 'blue' }}>
                  Powered by ML
                </Badge>
              </Group>
              <Text size="lg" c="dimmed">
                Machine learning-powered lead scoring, predictive analytics, and intelligent recommendations
              </Text>
            </div>
            
            {/* Main Content */}
            <Tabs defaultValue="dashboard" variant="pills">
              <Tabs.List>
                <Tabs.Tab 
                  value="dashboard" 
                  leftSection={<IconChartBar size={16} />}
                >
                  Dashboard
                </Tabs.Tab>
                <Tabs.Tab 
                  value="predictions" 
                  leftSection={<IconBrain size={16} />}
                >
                  Predictions
                </Tabs.Tab>
                <Tabs.Tab 
                  value="automation" 
                  leftSection={<IconRobot size={16} />}
                >
                  Automation
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="dashboard" pt="xl">
                <AIPredictiveInsightsDashboard />
              </Tabs.Panel>

              <Tabs.Panel value="predictions" pt="xl">
                <Text c="dimmed">Detailed predictions coming soon...</Text>
              </Tabs.Panel>

              <Tabs.Panel value="automation" pt="xl">
                <Text c="dimmed">Automation rules coming soon...</Text>
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </Container>
      </div>
    </AppLayout>
  );
}

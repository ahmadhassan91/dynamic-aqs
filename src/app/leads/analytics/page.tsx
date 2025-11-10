'use client';

import React from 'react';
import { Title, Text, Stack, Breadcrumbs, Anchor, Tabs, Badge, Group, Button } from '@mantine/core';
import Link from 'next/link';
import { IconSparkles, IconChartBar, IconBrain } from '@tabler/icons-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ConversionAnalytics } from '@/components/leads/ConversionAnalytics';
import { AIPredictiveInsightsDashboard } from '@/components/ai/AIPredictiveInsightsDashboard';

export default function LeadAnalyticsPage() {
  return (
    <AppLayout>
      <div className="residential-content-container">
        <Stack gap="md">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs>
            <Anchor component={Link} href="/leads">
              Leads
            </Anchor>
            <Text>Analytics</Text>
          </Breadcrumbs>
          
          {/* Page Header */}
          <Group justify="space-between">
            <div>
              <Title order={1}>Lead Analytics & AI Insights</Title>
              <Text size="lg" c="dimmed">
                Analyze conversion performance, track trends, and get AI-powered predictions
              </Text>
            </div>
            <Button
              component={Link}
              href="/leads/ai-insights"
              leftSection={<IconSparkles size={16} />}
              variant="gradient"
              gradient={{ from: 'violet', to: 'blue' }}
            >
              Full AI Dashboard
            </Button>
          </Group>
          
          {/* Main Content with Tabs */}
          <Tabs defaultValue="conversion" variant="pills">
            <Tabs.List>
              <Tabs.Tab value="conversion" leftSection={<IconChartBar size={16} />}>
                Conversion Analytics
              </Tabs.Tab>
              <Tabs.Tab 
                value="ai-insights" 
                leftSection={<IconBrain size={16} />}
              >
                AI Insights
                <Badge size="xs" variant="gradient" gradient={{ from: 'violet', to: 'blue' }} ml={8}>
                  New
                </Badge>
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="conversion" pt="xl">
              <ConversionAnalytics />
            </Tabs.Panel>

            <Tabs.Panel value="ai-insights" pt="xl">
              <AIPredictiveInsightsDashboard />
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </div>
    </AppLayout>
  );
}
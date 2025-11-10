'use client';

import { useState } from 'react';
import { Container, Tabs, Title, Text, Paper, Group, Button, Stack } from '@mantine/core';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  IconSchool,
  IconCalendar,
  IconUsers,
  IconLink,
  IconCheck,
  IconCertificate,
  IconChartBar,
  IconCalculator,
} from '@tabler/icons-react';

import { MockDataProvider } from '@/lib/mockData/MockDataProvider';

// Lazy load components to avoid initialization issues
import dynamic from 'next/dynamic';

const TrainingDashboard = dynamic(
  () => import('@/components/training/TrainingDashboard')
    .then(mod => ({ default: mod.TrainingDashboard }))
    .catch(err => {
      console.error('Failed to load TrainingDashboard:', err);
      return { default: () => <div>Error loading component: {err.message}</div> };
    }),
  {
    loading: () => <div>Loading Dashboard...</div>,
    ssr: false
  }
);

const TrainingCalendar = dynamic(() => import('@/components/training/TrainingCalendar').then(mod => ({ default: mod.TrainingCalendar })), {
  loading: () => <div>Loading...</div>
});

const TrainerManagement = dynamic(() => import('@/components/training/TrainerManagement').then(mod => ({ default: mod.TrainerManagement })), {
  loading: () => <div>Loading...</div>
});

const CustomerTrainingIntegration = dynamic(() => import('@/components/training/CustomerTrainingIntegration').then(mod => ({ default: mod.CustomerTrainingIntegration })), {
  loading: () => <div>Loading...</div>
});

const TrainingCompletionTracker = dynamic(() => import('@/components/training/TrainingCompletionTracker').then(mod => ({ default: mod.TrainingCompletionTracker })), {
  loading: () => <div>Loading...</div>
});

const CertificationManager = dynamic(() => import('@/components/training/CertificationManager').then(mod => ({ default: mod.CertificationManager })), {
  loading: () => <div>Loading...</div>
});

const TrainingEffectivenessReporter = dynamic(() => import('@/components/training/TrainingEffectivenessReporter').then(mod => ({ default: mod.TrainingEffectivenessReporter })), {
  loading: () => <div>Loading...</div>
});

const TrainingAnalyticsDashboard = dynamic(() => import('@/components/training/TrainingAnalyticsDashboard').then(mod => ({ default: mod.TrainingAnalyticsDashboard })), {
  loading: () => <div>Loading...</div>
});

const TrainingROICalculator = dynamic(() => import('@/components/training/TrainingROICalculator').then(mod => ({ default: mod.TrainingROICalculator })), {
  loading: () => <div>Loading...</div>
});

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<string | null>('dashboard');

  return (
    <MockDataProvider>
      <AppLayout>
        <Container size="xl" py="md">
          <Stack gap="md">
            {/* Header */}
            <Paper shadow="sm" p="md">
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                  <Title order={1}>Training Management</Title>
                  <Text size="sm" c="dimmed">
                    Manage training sessions, trainers, and track progress
                  </Text>
                </Stack>
                <Button leftSection={<IconSchool size={16} />}>
                  Schedule Training
                </Button>
              </Group>
            </Paper>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Tab value="dashboard" leftSection={<IconSchool size={16} />}>
                  Dashboard
                </Tabs.Tab>
                <Tabs.Tab value="calendar" leftSection={<IconCalendar size={16} />}>
                  Calendar
                </Tabs.Tab>
                <Tabs.Tab value="trainers" leftSection={<IconUsers size={16} />}>
                  Trainers
                </Tabs.Tab>
                <Tabs.Tab value="integration" leftSection={<IconLink size={16} />}>
                  Customer Integration
                </Tabs.Tab>
                <Tabs.Tab value="completion" leftSection={<IconCheck size={16} />}>
                  Completion Tracking
                </Tabs.Tab>
                <Tabs.Tab value="certifications" leftSection={<IconCertificate size={16} />}>
                  Certifications
                </Tabs.Tab>
                <Tabs.Tab value="effectiveness" leftSection={<IconChartBar size={16} />}>
                  Effectiveness
                </Tabs.Tab>
                <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
                  Analytics
                </Tabs.Tab>
                <Tabs.Tab value="roi" leftSection={<IconCalculator size={16} />}>
                  ROI Calculator
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="dashboard" pt="lg">
                <TrainingDashboard />
              </Tabs.Panel>

              <Tabs.Panel value="calendar" pt="lg">
                <TrainingCalendar />
              </Tabs.Panel>

              <Tabs.Panel value="trainers" pt="lg">
                <TrainerManagement />
              </Tabs.Panel>

              <Tabs.Panel value="integration" pt="lg">
                <CustomerTrainingIntegration />
              </Tabs.Panel>

              <Tabs.Panel value="completion" pt="lg">
                <TrainingCompletionTracker />
              </Tabs.Panel>

              <Tabs.Panel value="certifications" pt="lg">
                <CertificationManager />
              </Tabs.Panel>

              <Tabs.Panel value="effectiveness" pt="lg">
                <TrainingEffectivenessReporter />
              </Tabs.Panel>

              <Tabs.Panel value="analytics" pt="lg">
                <TrainingAnalyticsDashboard />
              </Tabs.Panel>

              <Tabs.Panel value="roi" pt="lg">
                <TrainingROICalculator />
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </Container>
      </AppLayout>
    </MockDataProvider>
  );
}
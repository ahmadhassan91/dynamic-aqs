'use client';

import { useState } from 'react';
import { Container, Tabs, Title, Text, Paper, Group, Button, Stack, Loader, Center, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
import { TrainingScheduleForm } from '@/components/training/TrainingScheduleForm';

// Lazy load components to avoid initialization issues
import dynamic from 'next/dynamic';

const LoadingFallback = () => (
  <Center py="xl">
    <Loader size="lg" />
  </Center>
);

const TrainingDashboard = dynamic(
  () => import('@/components/training/TrainingDashboard')
    .then(mod => ({ default: mod.TrainingDashboard }))
    .catch(err => {
      console.error('Failed to load TrainingDashboard:', err);
      return { default: () => <div>Error loading component</div> };
    }),
  {
    loading: LoadingFallback,
    ssr: false
  }
);

const TrainingCalendar = dynamic(
  () => import('@/components/training/TrainingCalendar').then(mod => ({ default: mod.TrainingCalendar })),
  { loading: LoadingFallback, ssr: false }
);

const TrainerManagement = dynamic(
  () => import('@/components/training/TrainerManagement').then(mod => ({ default: mod.TrainerManagement })),
  { loading: LoadingFallback, ssr: false }
);

const CustomerTrainingIntegration = dynamic(
  () => import('@/components/training/CustomerTrainingIntegration').then(mod => ({ default: mod.CustomerTrainingIntegration })),
  { loading: LoadingFallback, ssr: false }
);

const TrainingCompletionTracker = dynamic(
  () => import('@/components/training/TrainingCompletionTracker').then(mod => ({ default: mod.TrainingCompletionTracker })),
  { loading: LoadingFallback, ssr: false }
);

const CertificationManager = dynamic(
  () => import('@/components/training/CertificationManager').then(mod => ({ default: mod.CertificationManager })),
  { loading: LoadingFallback, ssr: false }
);

const TrainingEffectivenessReporter = dynamic(
  () => import('@/components/training/TrainingEffectivenessReporter').then(mod => ({ default: mod.TrainingEffectivenessReporter })),
  { loading: LoadingFallback, ssr: false }
);

const TrainingAnalyticsDashboard = dynamic(
  () => import('@/components/training/TrainingAnalyticsDashboard').then(mod => ({ default: mod.TrainingAnalyticsDashboard })),
  { loading: LoadingFallback, ssr: false }
);

const TrainingROICalculator = dynamic(
  () => import('@/components/training/TrainingROICalculator').then(mod => ({ default: mod.TrainingROICalculator })),
  { loading: LoadingFallback, ssr: false }
);

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<string | null>('dashboard');
  const [scheduleModalOpened, { open: openScheduleModal, close: closeScheduleModal }] = useDisclosure(false);

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
                <Button leftSection={<IconSchool size={16} />} onClick={openScheduleModal}>
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
                {activeTab === 'dashboard' && <TrainingDashboard />}
              </Tabs.Panel>
              <Tabs.Panel value="calendar" pt="lg">
                {activeTab === 'calendar' && <TrainingCalendar />}
              </Tabs.Panel>
              <Tabs.Panel value="trainers" pt="lg">
                {activeTab === 'trainers' && <TrainerManagement />}
              </Tabs.Panel>
              <Tabs.Panel value="integration" pt="lg">
                {activeTab === 'integration' && <CustomerTrainingIntegration />}
              </Tabs.Panel>
              <Tabs.Panel value="completion" pt="lg">
                {activeTab === 'completion' && <TrainingCompletionTracker />}
              </Tabs.Panel>
              <Tabs.Panel value="certifications" pt="lg">
                {activeTab === 'certifications' && <CertificationManager />}
              </Tabs.Panel>
              <Tabs.Panel value="effectiveness" pt="lg">
                {activeTab === 'effectiveness' && <TrainingEffectivenessReporter />}
              </Tabs.Panel>
              <Tabs.Panel value="analytics" pt="lg">
                {activeTab === 'analytics' && <TrainingAnalyticsDashboard />}
              </Tabs.Panel>
              <Tabs.Panel value="roi" pt="lg">
                {activeTab === 'roi' && <TrainingROICalculator />}
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </Container>

        {/* Schedule Training Modal */}
        <Modal
          opened={scheduleModalOpened}
          onClose={closeScheduleModal}
          title="Schedule New Training Session"
          size="lg"
        >
          {scheduleModalOpened && (
            <TrainingScheduleForm
              onClose={closeScheduleModal}
              onSubmit={(data) => {
                console.log('Training scheduled:', data);
                closeScheduleModal();
              }}
            />
          )}
        </Modal>
      </AppLayout>
    </MockDataProvider>
  );
}
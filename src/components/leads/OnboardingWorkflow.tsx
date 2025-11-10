'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  Button,
  Badge,
  Progress,
  SimpleGrid,
  ActionIcon,
  Menu,
  Modal,
  Tabs,
  Box,
  ThemeIcon,
  Timeline,
  Stepper,
} from '@mantine/core';
import {
  IconDots,
  IconEye,
  IconEdit,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconPlus,
  IconMail,
  IconPhone,
  IconCalendar,
  IconFileText,
  IconUser,
  IconBuilding,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { MockLead, generateMockLeads } from '@/lib/mockData/generators';
import { OnboardingWizard } from './OnboardingWizard';
import { CustomerInformationSheet } from './CustomerInformationSheet';

interface OnboardingRecord {
  id: string;
  leadId: string;
  leadName: string;
  companyName: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  currentStep: number;
  totalSteps: number;
  assignedTo: string;
  startDate: Date;
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  cisSubmitted: boolean;
  cisSubmittedDate?: Date;
  tasks: OnboardingTask[];
}

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  type: 'document' | 'call' | 'email' | 'meeting' | 'training' | 'system';
}

export function OnboardingWorkflow() {
  const [onboardingRecords, setOnboardingRecords] = useState<OnboardingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<OnboardingRecord | null>(null);
  const [wizardOpened, { open: openWizard, close: closeWizard }] = useDisclosure(false);
  const [cisOpened, { open: openCis, close: closeCis }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>('active');

  useEffect(() => {
    // Generate mock onboarding records
    const mockLeads = generateMockLeads(20);
    const mockRecords: OnboardingRecord[] = mockLeads
      .filter(lead => ['qualified', 'discovery', 'proposal', 'won'].includes(lead.status))
      .map((lead, index) => {
        const startDate = new Date(lead.createdAt);
        startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 10));
        
        const expectedDays = 14 + Math.floor(Math.random() * 21); // 14-35 days
        const expectedCompletionDate = new Date(startDate);
        expectedCompletionDate.setDate(expectedCompletionDate.getDate() + expectedDays);
        
        const currentStep = Math.floor(Math.random() * 6) + 1;
        const totalSteps = 6;
        
        const status: OnboardingRecord['status'] = 
          currentStep === totalSteps ? 'completed' :
          currentStep > 0 ? 'in_progress' :
          'not_started';

        const tasks: OnboardingTask[] = [
          {
            id: `${lead.id}-task-1`,
            title: 'Welcome Email',
            description: 'Send welcome email with onboarding checklist',
            status: currentStep >= 1 ? 'completed' : 'pending',
            assignedTo: lead.assignedTo,
            dueDate: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000),
            completedDate: currentStep >= 1 ? new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000) : undefined,
            type: 'email',
          },
          {
            id: `${lead.id}-task-2`,
            title: 'Customer Information Sheet',
            description: 'Send and collect Customer Information Sheet',
            status: currentStep >= 2 ? 'completed' : currentStep === 1 ? 'in_progress' : 'pending',
            assignedTo: lead.assignedTo,
            dueDate: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
            completedDate: currentStep >= 2 ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000) : undefined,
            type: 'document',
          },
          {
            id: `${lead.id}-task-3`,
            title: 'Account Setup',
            description: 'Create customer account in Acumatica',
            status: currentStep >= 3 ? 'completed' : currentStep === 2 ? 'in_progress' : 'pending',
            assignedTo: 'system-admin',
            dueDate: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
            completedDate: currentStep >= 3 ? new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000) : undefined,
            type: 'system',
          },
          {
            id: `${lead.id}-task-4`,
            title: 'Kickoff Call',
            description: 'Schedule and conduct onboarding kickoff call',
            status: currentStep >= 4 ? 'completed' : currentStep === 3 ? 'in_progress' : 'pending',
            assignedTo: lead.assignedTo,
            dueDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
            completedDate: currentStep >= 4 ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000) : undefined,
            type: 'call',
          },
          {
            id: `${lead.id}-task-5`,
            title: 'Training Schedule',
            description: 'Schedule initial product training session',
            status: currentStep >= 5 ? 'completed' : currentStep === 4 ? 'in_progress' : 'pending',
            assignedTo: 'training-coordinator',
            dueDate: new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
            completedDate: currentStep >= 5 ? new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000) : undefined,
            type: 'training',
          },
          {
            id: `${lead.id}-task-6`,
            title: 'Onboarding Complete',
            description: 'Finalize onboarding and transition to regular customer',
            status: currentStep >= 6 ? 'completed' : currentStep === 5 ? 'in_progress' : 'pending',
            assignedTo: lead.assignedTo,
            dueDate: expectedCompletionDate,
            completedDate: currentStep >= 6 ? expectedCompletionDate : undefined,
            type: 'system',
          },
        ];

        return {
          id: `onboarding-${lead.id}`,
          leadId: lead.id,
          leadName: lead.contactName,
          companyName: lead.companyName,
          status,
          currentStep,
          totalSteps,
          assignedTo: lead.assignedTo,
          startDate,
          expectedCompletionDate,
          actualCompletionDate: status === 'completed' ? expectedCompletionDate : undefined,
          cisSubmitted: currentStep >= 2,
          cisSubmittedDate: currentStep >= 2 ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000) : undefined,
          tasks,
        };
      });

    setOnboardingRecords(mockRecords);
  }, []);

  const getStatusColor = (status: OnboardingRecord['status']) => {
    switch (status) {
      case 'not_started': return 'gray';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'on_hold': return 'yellow';
      default: return 'gray';
    }
  };

  const getTaskStatusColor = (status: OnboardingTask['status']) => {
    switch (status) {
      case 'pending': return 'gray';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'skipped': return 'yellow';
      default: return 'gray';
    }
  };

  const getTaskIcon = (type: OnboardingTask['type']) => {
    switch (type) {
      case 'document': return IconFileText;
      case 'call': return IconPhone;
      case 'email': return IconMail;
      case 'meeting': return IconCalendar;
      case 'training': return IconUser;
      case 'system': return IconBuilding;
      default: return IconFileText;
    }
  };

  const filteredRecords = onboardingRecords.filter(record => {
    switch (activeTab) {
      case 'active': return ['not_started', 'in_progress'].includes(record.status);
      case 'completed': return record.status === 'completed';
      case 'on_hold': return record.status === 'on_hold';
      default: return true;
    }
  });

  const handleViewRecord = (record: OnboardingRecord) => {
    setSelectedRecord(record);
    openWizard();
  };

  const handleViewCis = (record: OnboardingRecord) => {
    setSelectedRecord(record);
    openCis();
  };

  return (
    <>
      <Stack gap="md">
        {/* Summary Cards */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Active
                </Text>
                <Text size="xl" fw={700}>
                  {onboardingRecords.filter(r => ['not_started', 'in_progress'].includes(r.status)).length}
                </Text>
              </Box>
              <ThemeIcon color="blue" variant="light" size="lg">
                <IconClock size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Completed
                </Text>
                <Text size="xl" fw={700} c="green">
                  {onboardingRecords.filter(r => r.status === 'completed').length}
                </Text>
              </Box>
              <ThemeIcon color="green" variant="light" size="lg">
                <IconCheck size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  On Hold
                </Text>
                <Text size="xl" fw={700} c="yellow">
                  {onboardingRecords.filter(r => r.status === 'on_hold').length}
                </Text>
              </Box>
              <ThemeIcon color="yellow" variant="light" size="lg">
                <IconAlertCircle size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Avg. Duration
                </Text>
                <Text size="xl" fw={700}>
                  18 days
                </Text>
              </Box>
              <ThemeIcon color="indigo" variant="light" size="lg">
                <IconCalendar size={20} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="active">
              Active ({onboardingRecords.filter(r => ['not_started', 'in_progress'].includes(r.status)).length})
            </Tabs.Tab>
            <Tabs.Tab value="completed">
              Completed ({onboardingRecords.filter(r => r.status === 'completed').length})
            </Tabs.Tab>
            <Tabs.Tab value="on_hold">
              On Hold ({onboardingRecords.filter(r => r.status === 'on_hold').length})
            </Tabs.Tab>
          </Tabs.List>

          <Box mt="md">
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
              {filteredRecords.map((record) => (
                <Card key={record.id} withBorder p="md">
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                      <Box flex={1}>
                        <Text fw={600} size="sm" lineClamp={1}>
                          {record.companyName}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {record.leadName}
                        </Text>
                      </Box>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" size="sm">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconEye size={14} />} onClick={() => handleViewRecord(record)}>
                            View Progress
                          </Menu.Item>
                          <Menu.Item leftSection={<IconEdit size={14} />}>
                            Edit Tasks
                          </Menu.Item>
                          <Menu.Item leftSection={<IconFileText size={14} />} onClick={() => handleViewCis(record)}>
                            View CIS
                          </Menu.Item>
                          <Menu.Item leftSection={<IconMail size={14} />}>
                            Send Update
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>

                    <Group justify="space-between" align="center">
                      <Badge size="sm" color={getStatusColor(record.status)} variant="light">
                        {record.status.replace('_', ' ')}
                      </Badge>
                      <Text size="xs" c="dimmed">
                        Step {record.currentStep}/{record.totalSteps}
                      </Text>
                    </Group>

                    <Progress
                      value={(record.currentStep / record.totalSteps) * 100}
                      size="sm"
                      color={getStatusColor(record.status)}
                      radius="xl"
                    />

                    <Group justify="space-between" align="center">
                      <Text size="xs" c="dimmed">
                        Started: {record.startDate.toLocaleDateString()}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Due: {record.expectedCompletionDate.toLocaleDateString()}
                      </Text>
                    </Group>

                    {/* Recent Tasks */}
                    <Box>
                      <Text size="xs" fw={600} mb="xs">Recent Tasks:</Text>
                      <Stack gap={4}>
                        {record.tasks.slice(0, 2).map((task) => {
                          const TaskIcon = getTaskIcon(task.type);
                          return (
                            <Group key={task.id} gap="xs">
                              <ThemeIcon size="xs" color={getTaskStatusColor(task.status)} variant="light">
                                <TaskIcon size={10} />
                              </ThemeIcon>
                              <Text size="xs" lineClamp={1} flex={1}>
                                {task.title}
                              </Text>
                              <Badge size="xs" color={getTaskStatusColor(task.status)} variant="dot">
                                {task.status}
                              </Badge>
                            </Group>
                          );
                        })}
                      </Stack>
                    </Box>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </Tabs>
      </Stack>

      {/* Onboarding Wizard Modal */}
      <Modal
        opened={wizardOpened}
        onClose={closeWizard}
        title="Onboarding Progress"
        size="xl"
      >
        {selectedRecord && (
          <OnboardingWizard
            record={selectedRecord}
            onClose={closeWizard}
            onUpdate={(updatedRecord) => {
              setOnboardingRecords(prev =>
                prev.map(r => r.id === updatedRecord.id ? updatedRecord : r)
              );
            }}
          />
        )}
      </Modal>

      {/* Customer Information Sheet Modal */}
      <Modal
        opened={cisOpened}
        onClose={closeCis}
        title="Customer Information Sheet"
        size="xl"
      >
        {selectedRecord && (
          <CustomerInformationSheet
            record={selectedRecord}
            onClose={closeCis}
          />
        )}
      </Modal>
    </>
  );
}
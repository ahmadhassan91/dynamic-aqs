'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  Button,
  Badge,
  SimpleGrid,
  ActionIcon,
  Menu,
  Modal,
  Select,
  TextInput,
  Textarea,
  Checkbox,
  NumberInput,
  Divider,
  Timeline,
  Stepper,
  Alert,
  ThemeIcon,
  Box,
  Tabs,
  Progress,
} from '@mantine/core';
import {
  IconDots,
  IconEye,
  IconEdit,
  IconPlus,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconUser,
  IconBuilding,
  IconMail,
  IconPhone,
  IconCalendar,
  IconFileText,
  IconSettings,
  IconPlayerPlay,
  IconPlayerPause,
  IconX,
  IconCopy,
  IconTrash,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { MockCustomer, territories } from '@/lib/mockData/generators';

interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  type: 'email' | 'call' | 'document' | 'training' | 'system' | 'meeting';
  assignedRole: 'territory_manager' | 'admin' | 'training_coordinator' | 'system';
  daysFromStart: number;
  estimatedDuration: number; // in minutes
  required: boolean;
  dependencies: string[]; // task IDs that must be completed first
  autoComplete: boolean;
  template?: string; // email template, document template, etc.
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  customerType: 'residential' | 'commercial' | 'both';
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number; // in days
  tasks: WorkflowTask[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

interface OnboardingInstance {
  id: string;
  customerId: string;
  customerName: string;
  companyName: string;
  templateId: string;
  templateName: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
  currentTaskIndex: number;
  startDate: Date;
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  assignedTo: string;
  tasks: (WorkflowTask & {
    status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';
    startedAt?: Date;
    completedAt?: Date;
    assignedUser?: string;
    notes?: string;
  })[];
  progressPercentage: number;
}

export function OnboardingWorkflowInitiation() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [instances, setInstances] = useState<OnboardingInstance[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<OnboardingInstance | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null);
  
  const [templateOpened, { open: openTemplate, close: closeTemplate }] = useDisclosure(false);
  const [instanceOpened, { open: openInstance, close: closeInstance }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>('templates');

  useEffect(() => {
    // Generate mock workflow templates
    const mockTemplates: WorkflowTemplate[] = [
      {
        id: 'template-1',
        name: 'Standard Residential Onboarding',
        description: 'Standard onboarding process for residential customers',
        customerType: 'residential',
        priority: 'medium',
        estimatedDuration: 14,
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        usageCount: 45,
        tasks: [
          {
            id: 'task-1',
            title: 'Welcome Email',
            description: 'Send welcome email with onboarding checklist and next steps',
            type: 'email',
            assignedRole: 'territory_manager',
            daysFromStart: 0,
            estimatedDuration: 15,
            required: true,
            dependencies: [],
            autoComplete: true,
            template: 'welcome-email-residential',
          },
          {
            id: 'task-2',
            title: 'Customer Information Sheet',
            description: 'Send CIS form and follow up for completion',
            type: 'document',
            assignedRole: 'territory_manager',
            daysFromStart: 1,
            estimatedDuration: 30,
            required: true,
            dependencies: ['task-1'],
            autoComplete: false,
          },
          {
            id: 'task-3',
            title: 'Account Setup',
            description: 'Create customer account in Acumatica system',
            type: 'system',
            assignedRole: 'admin',
            daysFromStart: 3,
            estimatedDuration: 20,
            required: true,
            dependencies: ['task-2'],
            autoComplete: true,
          },
          {
            id: 'task-4',
            title: 'Kickoff Call',
            description: 'Schedule and conduct onboarding kickoff call',
            type: 'call',
            assignedRole: 'territory_manager',
            daysFromStart: 5,
            estimatedDuration: 60,
            required: true,
            dependencies: ['task-3'],
            autoComplete: false,
          },
          {
            id: 'task-5',
            title: 'Training Schedule',
            description: 'Schedule initial product training session',
            type: 'training',
            assignedRole: 'training_coordinator',
            daysFromStart: 7,
            estimatedDuration: 30,
            required: false,
            dependencies: ['task-4'],
            autoComplete: false,
          },
          {
            id: 'task-6',
            title: 'Onboarding Complete',
            description: 'Mark onboarding as complete and transition to regular customer',
            type: 'system',
            assignedRole: 'territory_manager',
            daysFromStart: 14,
            estimatedDuration: 10,
            required: true,
            dependencies: ['task-4'],
            autoComplete: false,
          },
        ],
      },
      {
        id: 'template-2',
        name: 'Expedited Onboarding',
        description: 'Fast-track onboarding for high-priority customers',
        customerType: 'both',
        priority: 'high',
        estimatedDuration: 7,
        isActive: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        usageCount: 12,
        tasks: [
          {
            id: 'task-1',
            title: 'Immediate Welcome Call',
            description: 'Call customer within 2 hours of conversion',
            type: 'call',
            assignedRole: 'territory_manager',
            daysFromStart: 0,
            estimatedDuration: 30,
            required: true,
            dependencies: [],
            autoComplete: false,
          },
          {
            id: 'task-2',
            title: 'Express Account Setup',
            description: 'Priority account creation in all systems',
            type: 'system',
            assignedRole: 'admin',
            daysFromStart: 0,
            estimatedDuration: 15,
            required: true,
            dependencies: [],
            autoComplete: true,
          },
          {
            id: 'task-3',
            title: 'Same-Day CIS Collection',
            description: 'Collect customer information via phone or video call',
            type: 'call',
            assignedRole: 'territory_manager',
            daysFromStart: 0,
            estimatedDuration: 45,
            required: true,
            dependencies: ['task-1'],
            autoComplete: false,
          },
          {
            id: 'task-4',
            title: 'Priority Training Schedule',
            description: 'Schedule training within 48 hours',
            type: 'training',
            assignedRole: 'training_coordinator',
            daysFromStart: 1,
            estimatedDuration: 20,
            required: true,
            dependencies: ['task-2', 'task-3'],
            autoComplete: false,
          },
          {
            id: 'task-5',
            title: 'Expedited Complete',
            description: 'Complete onboarding and activate all services',
            type: 'system',
            assignedRole: 'territory_manager',
            daysFromStart: 7,
            estimatedDuration: 15,
            required: true,
            dependencies: ['task-4'],
            autoComplete: false,
          },
        ],
      },
      {
        id: 'template-3',
        name: 'Commercial Enterprise Onboarding',
        description: 'Comprehensive onboarding for large commercial customers',
        customerType: 'commercial',
        priority: 'high',
        estimatedDuration: 30,
        isActive: true,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        usageCount: 8,
        tasks: [
          {
            id: 'task-1',
            title: 'Executive Welcome',
            description: 'Executive-level welcome call and relationship establishment',
            type: 'call',
            assignedRole: 'territory_manager',
            daysFromStart: 1,
            estimatedDuration: 60,
            required: true,
            dependencies: [],
            autoComplete: false,
          },
          {
            id: 'task-2',
            title: 'Comprehensive CIS',
            description: 'Detailed customer information and requirements gathering',
            type: 'document',
            assignedRole: 'territory_manager',
            daysFromStart: 2,
            estimatedDuration: 90,
            required: true,
            dependencies: ['task-1'],
            autoComplete: false,
          },
          {
            id: 'task-3',
            title: 'Enterprise Account Setup',
            description: 'Full enterprise account configuration with custom settings',
            type: 'system',
            assignedRole: 'admin',
            daysFromStart: 5,
            estimatedDuration: 120,
            required: true,
            dependencies: ['task-2'],
            autoComplete: false,
          },
          {
            id: 'task-4',
            title: 'Stakeholder Meeting',
            description: 'Multi-stakeholder onboarding and planning meeting',
            type: 'meeting',
            assignedRole: 'territory_manager',
            daysFromStart: 7,
            estimatedDuration: 120,
            required: true,
            dependencies: ['task-3'],
            autoComplete: false,
          },
          {
            id: 'task-5',
            title: 'Custom Training Program',
            description: 'Develop and schedule custom training program',
            type: 'training',
            assignedRole: 'training_coordinator',
            daysFromStart: 10,
            estimatedDuration: 180,
            required: true,
            dependencies: ['task-4'],
            autoComplete: false,
          },
          {
            id: 'task-6',
            title: 'Enterprise Activation',
            description: 'Full enterprise service activation and go-live',
            type: 'system',
            assignedRole: 'territory_manager',
            daysFromStart: 30,
            estimatedDuration: 60,
            required: true,
            dependencies: ['task-5'],
            autoComplete: false,
          },
        ],
      },
    ];

    setTemplates(mockTemplates);

    // Generate mock onboarding instances
    const mockInstances: OnboardingInstance[] = [
      {
        id: 'instance-1',
        customerId: 'customer-1',
        customerName: 'John Smith',
        companyName: 'Smith HVAC Solutions',
        templateId: 'template-1',
        templateName: 'Standard Residential Onboarding',
        status: 'in_progress',
        currentTaskIndex: 2,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expectedCompletionDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        assignedTo: 'tm-1',
        progressPercentage: 40,
        tasks: mockTemplates[0].tasks.map((task, index) => ({
          ...task,
          status: index < 2 ? 'completed' : index === 2 ? 'in_progress' : 'pending',
          startedAt: index < 2 ? new Date(Date.now() - (5 - index) * 24 * 60 * 60 * 1000) : undefined,
          completedAt: index < 2 ? new Date(Date.now() - (4 - index) * 24 * 60 * 60 * 1000) : undefined,
          assignedUser: index === 2 ? 'admin-1' : undefined,
        })),
      },
      {
        id: 'instance-2',
        customerId: 'customer-2',
        customerName: 'Sarah Johnson',
        companyName: 'Johnson Commercial Systems',
        templateId: 'template-2',
        templateName: 'Expedited Onboarding',
        status: 'completed',
        currentTaskIndex: 5,
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        expectedCompletionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        actualCompletionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        assignedTo: 'tm-2',
        progressPercentage: 100,
        tasks: mockTemplates[1].tasks.map((task, index) => ({
          ...task,
          status: 'completed',
          startedAt: new Date(Date.now() - (10 - index) * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - (9 - index) * 24 * 60 * 60 * 1000),
        })),
      },
    ];

    setInstances(mockInstances);
  }, []);

  const getStatusColor = (status: OnboardingInstance['status']) => {
    switch (status) {
      case 'not_started': return 'gray';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'paused': return 'yellow';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'gray';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'skipped': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getTaskTypeIcon = (type: WorkflowTask['type']) => {
    switch (type) {
      case 'email': return IconMail;
      case 'call': return IconPhone;
      case 'document': return IconFileText;
      case 'training': return IconUser;
      case 'system': return IconSettings;
      case 'meeting': return IconCalendar;
      default: return IconFileText;
    }
  };

  const handleCreateTemplate = () => {
    const newTemplate: WorkflowTemplate = {
      id: `template-${Date.now()}`,
      name: 'New Workflow Template',
      description: 'Custom workflow template',
      customerType: 'both',
      priority: 'medium',
      estimatedDuration: 14,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      tasks: [],
    };
    
    setEditingTemplate(newTemplate);
    openEdit();
  };

  const handleEditTemplate = (template: WorkflowTemplate) => {
    setEditingTemplate({ ...template });
    openEdit();
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    if (templates.find(t => t.id === editingTemplate.id)) {
      // Update existing template
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t));
    } else {
      // Add new template
      setTemplates(prev => [...prev, editingTemplate]);
    }

    notifications.show({
      title: 'Template Saved',
      message: 'Workflow template has been saved successfully.',
      color: 'green',
      icon: <IconCheck size={16} />,
    });

    closeEdit();
    setEditingTemplate(null);
  };

  const handleDuplicateTemplate = (template: WorkflowTemplate) => {
    const duplicatedTemplate: WorkflowTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
    };

    setTemplates(prev => [...prev, duplicatedTemplate]);
    
    notifications.show({
      title: 'Template Duplicated',
      message: 'Template has been duplicated successfully.',
      color: 'blue',
      icon: <IconCopy size={16} />,
    });
  };

  const handleStartWorkflow = (customerId: string, templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newInstance: OnboardingInstance = {
      id: `instance-${Date.now()}`,
      customerId,
      customerName: 'New Customer',
      companyName: 'New Company',
      templateId: template.id,
      templateName: template.name,
      status: 'not_started',
      currentTaskIndex: 0,
      startDate: new Date(),
      expectedCompletionDate: new Date(Date.now() + template.estimatedDuration * 24 * 60 * 60 * 1000),
      assignedTo: 'tm-1',
      progressPercentage: 0,
      tasks: template.tasks.map(task => ({
        ...task,
        status: 'pending',
      })),
    };

    setInstances(prev => [...prev, newInstance]);
    
    notifications.show({
      title: 'Workflow Started',
      message: `Onboarding workflow "${template.name}" has been initiated.`,
      color: 'green',
      icon: <IconPlayerPlay size={16} />,
    });
  };

  const handleViewInstance = (instance: OnboardingInstance) => {
    setSelectedInstance(instance);
    openInstance();
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
                  Active Templates
                </Text>
                <Text size="xl" fw={700}>
                  {templates.filter(t => t.isActive).length}
                </Text>
              </Box>
              <ThemeIcon color="blue" variant="light" size="lg">
                <IconSettings size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Active Workflows
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {instances.filter(i => i.status === 'in_progress').length}
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
                  {instances.filter(i => i.status === 'completed').length}
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
                  Success Rate
                </Text>
                <Text size="xl" fw={700} c="green">
                  94%
                </Text>
              </Box>
              <ThemeIcon color="green" variant="light" size="lg">
                <IconCheck size={20} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="templates">
              Workflow Templates ({templates.length})
            </Tabs.Tab>
            <Tabs.Tab value="instances">
              Active Workflows ({instances.filter(i => ['not_started', 'in_progress', 'paused'].includes(i.status)).length})
            </Tabs.Tab>
            <Tabs.Tab value="completed">
              Completed ({instances.filter(i => i.status === 'completed').length})
            </Tabs.Tab>
          </Tabs.List>

          {/* Workflow Templates Tab */}
          <Tabs.Panel value="templates">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600} size="lg">Workflow Templates</Text>
                <Button leftSection={<IconPlus size={16} />} onClick={handleCreateTemplate}>
                  Create Template
                </Button>
              </Group>

              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                {templates.map((template) => (
                  <Card key={template.id} withBorder p="md">
                    <Stack gap="sm">
                      <Group justify="space-between" align="flex-start">
                        <Box flex={1}>
                          <Text fw={600} size="sm" lineClamp={1}>
                            {template.name}
                          </Text>
                          <Text size="xs" c="dimmed" lineClamp={2}>
                            {template.description}
                          </Text>
                        </Box>
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" size="sm">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<IconEye size={14} />} onClick={() => { setSelectedTemplate(template); openTemplate(); }}>
                              View Details
                            </Menu.Item>
                            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => handleEditTemplate(template)}>
                              Edit Template
                            </Menu.Item>
                            <Menu.Item leftSection={<IconCopy size={14} />} onClick={() => handleDuplicateTemplate(template)}>
                              Duplicate
                            </Menu.Item>
                            <Menu.Item leftSection={<IconPlayerPlay size={14} />} onClick={() => handleStartWorkflow('customer-new', template.id)}>
                              Start Workflow
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>

                      <Group justify="space-between" align="center">
                        <Badge size="sm" color={template.customerType === 'both' ? 'blue' : template.customerType === 'commercial' ? 'orange' : 'green'} variant="light">
                          {template.customerType}
                        </Badge>
                        <Badge size="sm" color={template.priority === 'high' ? 'red' : template.priority === 'medium' ? 'yellow' : 'gray'} variant="light">
                          {template.priority} priority
                        </Badge>
                      </Group>

                      <Group justify="space-between" align="center">
                        <Text size="xs" c="dimmed">
                          {template.tasks.length} tasks
                        </Text>
                        <Text size="xs" c="dimmed">
                          ~{template.estimatedDuration} days
                        </Text>
                      </Group>

                      <Group justify="space-between" align="center">
                        <Text size="xs" c="dimmed">
                          Used {template.usageCount} times
                        </Text>
                        <Badge size="xs" color={template.isActive ? 'green' : 'gray'} variant="dot">
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>

          {/* Active Workflows Tab */}
          <Tabs.Panel value="instances">
            <Stack gap="md">
              <Text fw={600} size="lg">Active Onboarding Workflows</Text>

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                {instances.filter(i => ['not_started', 'in_progress', 'paused'].includes(i.status)).map((instance) => (
                  <Card key={instance.id} withBorder p="md">
                    <Stack gap="sm">
                      <Group justify="space-between" align="flex-start">
                        <Box flex={1}>
                          <Text fw={600} size="sm" lineClamp={1}>
                            {instance.companyName}
                          </Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {instance.customerName}
                          </Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            Template: {instance.templateName}
                          </Text>
                        </Box>
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" size="sm">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<IconEye size={14} />} onClick={() => handleViewInstance(instance)}>
                              View Progress
                            </Menu.Item>
                            <Menu.Item leftSection={<IconEdit size={14} />}>
                              Edit Tasks
                            </Menu.Item>
                            {instance.status === 'in_progress' && (
                              <Menu.Item leftSection={<IconPlayerPause size={14} />}>
                                Pause Workflow
                              </Menu.Item>
                            )}
                            {instance.status === 'paused' && (
                              <Menu.Item leftSection={<IconPlayerPlay size={14} />}>
                                Resume Workflow
                              </Menu.Item>
                            )}
                          </Menu.Dropdown>
                        </Menu>
                      </Group>

                      <Group justify="space-between" align="center">
                        <Badge size="sm" color={getStatusColor(instance.status)} variant="light">
                          {instance.status.replace('_', ' ')}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          Task {instance.currentTaskIndex + 1}/{instance.tasks.length}
                        </Text>
                      </Group>

                      <Progress
                        value={instance.progressPercentage}
                        size="sm"
                        color={getStatusColor(instance.status)}
                        radius="xl"
                      />

                      <Group justify="space-between" align="center">
                        <Text size="xs" c="dimmed">
                          Started: {instance.startDate.toLocaleDateString()}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Due: {instance.expectedCompletionDate.toLocaleDateString()}
                        </Text>
                      </Group>

                      {/* Current Task */}
                      {instance.currentTaskIndex < instance.tasks.length && (
                        <Alert variant="light" p="xs">
                          <Group gap="xs">
                            <ThemeIcon size="sm" color="blue" variant="light">
                              {React.createElement(getTaskTypeIcon(instance.tasks[instance.currentTaskIndex].type), { size: 12 })}
                            </ThemeIcon>
                            <Text size="xs" flex={1}>
                              Current: {instance.tasks[instance.currentTaskIndex].title}
                            </Text>
                          </Group>
                        </Alert>
                      )}
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>

          {/* Completed Workflows Tab */}
          <Tabs.Panel value="completed">
            <Stack gap="md">
              <Text fw={600} size="lg">Completed Onboarding Workflows</Text>

              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                {instances.filter(i => i.status === 'completed').map((instance) => (
                  <Card key={instance.id} withBorder p="md">
                    <Stack gap="sm">
                      <Group justify="space-between" align="flex-start">
                        <Box flex={1}>
                          <Text fw={600} size="sm" lineClamp={1}>
                            {instance.companyName}
                          </Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {instance.customerName}
                          </Text>
                        </Box>
                        <Badge size="sm" color="green" variant="light">
                          Completed
                        </Badge>
                      </Group>

                      <Text size="xs" c="dimmed">
                        Template: {instance.templateName}
                      </Text>

                      <Group justify="space-between" align="center">
                        <Text size="xs" c="dimmed">
                          Started: {instance.startDate.toLocaleDateString()}
                        </Text>
                        <Text size="xs" c="green">
                          Completed: {instance.actualCompletionDate?.toLocaleDateString()}
                        </Text>
                      </Group>

                      <Button
                        size="xs"
                        variant="light"
                        leftSection={<IconEye size={14} />}
                        onClick={() => handleViewInstance(instance)}
                      >
                        View Details
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Template Details Modal */}
      <Modal
        opened={templateOpened}
        onClose={closeTemplate}
        title="Workflow Template Details"
        size="lg"
      >
        {selectedTemplate && (
          <Stack gap="md">
            <Card withBorder p="md">
              <Group justify="space-between" mb="sm">
                <Text fw={600} size="lg">{selectedTemplate.name}</Text>
                <Badge color={selectedTemplate.isActive ? 'green' : 'gray'} variant="light">
                  {selectedTemplate.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="md">{selectedTemplate.description}</Text>
              
              <SimpleGrid cols={3} spacing="sm">
                <div>
                  <Text size="xs" c="dimmed">Customer Type</Text>
                  <Text size="sm">{selectedTemplate.customerType}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">Priority</Text>
                  <Text size="sm">{selectedTemplate.priority}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">Duration</Text>
                  <Text size="sm">{selectedTemplate.estimatedDuration} days</Text>
                </div>
              </SimpleGrid>
            </Card>

            <Card withBorder p="md">
              <Text fw={600} mb="sm">Workflow Tasks ({selectedTemplate.tasks.length})</Text>
              <Timeline active={-1} bulletSize={24} lineWidth={2}>
                {selectedTemplate.tasks.map((task, index) => {
                  const TaskIcon = getTaskTypeIcon(task.type);
                  return (
                    <Timeline.Item
                      key={task.id}
                      bullet={<TaskIcon size={12} />}
                      title={task.title}
                    >
                      <Text size="xs" c="dimmed" mb={4}>
                        {task.description}
                      </Text>
                      <Group gap="xs" mb="xs">
                        <Badge size="xs" variant="light">
                          Day {task.daysFromStart}
                        </Badge>
                        <Badge size="xs" variant="light">
                          {task.estimatedDuration}min
                        </Badge>
                        <Badge size="xs" variant="light" color={task.required ? 'red' : 'gray'}>
                          {task.required ? 'Required' : 'Optional'}
                        </Badge>
                        <Badge size="xs" variant="light">
                          {task.assignedRole.replace('_', ' ')}
                        </Badge>
                      </Group>
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            </Card>
          </Stack>
        )}
      </Modal>

      {/* Instance Details Modal */}
      <Modal
        opened={instanceOpened}
        onClose={closeInstance}
        title="Onboarding Progress"
        size="xl"
      >
        {selectedInstance && (
          <Stack gap="md">
            <Card withBorder p="md">
              <Group justify="space-between" mb="sm">
                <div>
                  <Text fw={600} size="lg">{selectedInstance.companyName}</Text>
                  <Text size="sm" c="dimmed">{selectedInstance.customerName}</Text>
                </div>
                <Badge color={getStatusColor(selectedInstance.status)} variant="light">
                  {selectedInstance.status.replace('_', ' ')}
                </Badge>
              </Group>
              
              <Progress
                value={selectedInstance.progressPercentage}
                size="lg"
                color={getStatusColor(selectedInstance.status)}
                radius="xl"
                mb="sm"
              />
              
              <Text size="sm" c="dimmed">
                Progress: {selectedInstance.currentTaskIndex}/{selectedInstance.tasks.length} tasks completed
              </Text>
            </Card>

            <Card withBorder p="md">
              <Text fw={600} mb="sm">Task Progress</Text>
              <Timeline active={selectedInstance.currentTaskIndex} bulletSize={24} lineWidth={2}>
                {selectedInstance.tasks.map((task, index) => {
                  const TaskIcon = getTaskTypeIcon(task.type);
                  return (
                    <Timeline.Item
                      key={task.id}
                      bullet={
                        task.status === 'completed' ? <IconCheck size={12} /> :
                        task.status === 'failed' ? <IconX size={12} /> :
                        task.status === 'in_progress' ? <IconClock size={12} /> :
                        <TaskIcon size={12} />
                      }
                      title={task.title}
                      color={getTaskStatusColor(task.status)}
                    >
                      <Text size="xs" c="dimmed" mb={4}>
                        {task.description}
                      </Text>
                      <Group gap="xs" mb="xs">
                        <Badge size="xs" color={getTaskStatusColor(task.status)} variant="light">
                          {task.status}
                        </Badge>
                        <Badge size="xs" variant="light">
                          {task.estimatedDuration}min
                        </Badge>
                        {task.assignedUser && (
                          <Badge size="xs" variant="light">
                            {task.assignedUser}
                          </Badge>
                        )}
                      </Group>
                      {task.completedAt && (
                        <Text size="xs" c="dimmed">
                          Completed: {task.completedAt.toLocaleString()}
                        </Text>
                      )}
                      {task.notes && (
                        <Text size="xs" c="dimmed" mt="xs">
                          Notes: {task.notes}
                        </Text>
                      )}
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            </Card>
          </Stack>
        )}
      </Modal>

      {/* Template Edit Modal */}
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title={editingTemplate?.id.startsWith('template-') ? 'Edit Template' : 'Create Template'}
        size="xl"
      >
        {editingTemplate && (
          <Stack gap="md">
            <SimpleGrid cols={2} spacing="md">
              <TextInput
                label="Template Name"
                value={editingTemplate.name}
                onChange={(event) => setEditingTemplate(prev => prev ? { ...prev, name: event.currentTarget.value } : null)}
              />
              <Select
                label="Customer Type"
                value={editingTemplate.customerType}
                onChange={(value) => setEditingTemplate(prev => prev ? { ...prev, customerType: value as any } : null)}
                data={[
                  { value: 'residential', label: 'Residential' },
                  { value: 'commercial', label: 'Commercial' },
                  { value: 'both', label: 'Both' },
                ]}
              />
            </SimpleGrid>

            <Textarea
              label="Description"
              value={editingTemplate.description}
              onChange={(event) => setEditingTemplate(prev => prev ? { ...prev, description: event.currentTarget.value } : null)}
              rows={3}
            />

            <SimpleGrid cols={3} spacing="md">
              <Select
                label="Priority"
                value={editingTemplate.priority}
                onChange={(value) => setEditingTemplate(prev => prev ? { ...prev, priority: value as any } : null)}
                data={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
              />
              <NumberInput
                label="Estimated Duration (days)"
                value={editingTemplate.estimatedDuration}
                onChange={(value) => setEditingTemplate(prev => prev ? { ...prev, estimatedDuration: Number(value) } : null)}
                min={1}
                max={365}
              />
              <Checkbox
                label="Active Template"
                checked={editingTemplate.isActive}
                onChange={(event) => setEditingTemplate(prev => prev ? { ...prev, isActive: event.currentTarget.checked } : null)}
                mt="xl"
              />
            </SimpleGrid>

            <Divider />

            <Group justify="space-between">
              <Text fw={600}>Workflow Tasks</Text>
              <Button size="xs" leftSection={<IconPlus size={14} />}>
                Add Task
              </Button>
            </Group>

            {/* Task list would go here - simplified for this implementation */}
            <Text size="sm" c="dimmed">
              Task management interface would be implemented here with drag-and-drop reordering,
              task configuration, and dependency management.
            </Text>

            <Group justify="flex-end">
              <Button variant="light" onClick={closeEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>
                Save Template
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}
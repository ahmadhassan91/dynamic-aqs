'use client';

import React, { useState, useEffect } from 'react';
import {
  Stack,
  Group,
  Button,
  Paper,
  Title,
  Text,
  Badge,
  Progress,
  Card,
  LoadingOverlay,
  SimpleGrid,
  Modal,
  TextInput,
  Textarea,
  Select,
  ActionIcon,
  Divider,
  NumberInput,
  Menu
} from '@mantine/core';
import {
  IconRefresh,
  IconChartBar,
  IconPlayerPlay,
  IconPlus,
  IconTrash,
  IconEdit,
  IconDots,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import {
  WorkflowTemplate,
  WorkflowCategory,
  InteractionType,
  WorkflowStep
} from '@/types/commercial';

interface WorkflowPerformanceMetrics {
  templateId: string;
  templateName: string;
  totalExecutions: number;
  completionRate: number;
  averageCompletionTime: number;
  ratingImprovements: number;
  successRate: number;
}

interface WorkflowExecutionData {
  id: string;
  templateId: string;
  engineerId: string;
  engineerName: string;
  currentStep: number;
  totalSteps: number;
  status: 'active' | 'completed' | 'paused' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  progress: number;
}

export default function WorkflowManagementSystem() {
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([]);
  const [activeExecutions, setActiveExecutions] = useState<WorkflowExecutionData[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<WorkflowPerformanceMetrics[]>([]);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showExecutionMonitor, setShowExecutionMonitor] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state for template creation/editing
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState<WorkflowCategory | ''>('');
  const [templateSteps, setTemplateSteps] = useState<WorkflowStep[]>([]);

  useEffect(() => {
    loadWorkflowData();
  }, []);

  const loadWorkflowData = async () => {
    try {
      setLoading(true);
      
      const templates = await loadWorkflowTemplates();
      setWorkflowTemplates(templates);

      const executions = await loadActiveExecutions();
      setActiveExecutions(executions);

      const metrics = await loadPerformanceMetrics();
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('Error loading workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflowTemplates = async (): Promise<WorkflowTemplate[]> => {
    return [
      {
        id: 'template_rating_improvement',
        name: 'Rating Improvement Workflow',
        description: 'Systematic approach to improve engineer ratings from hostile/unfavorable to champion',
        category: WorkflowCategory.RATING_IMPROVEMENT,
        isActive: true,
        steps: [
          {
            id: 'step_1',
            order: 1,
            title: 'Initial Assessment',
            description: 'Understand current concerns and objections',
            suggestedAction: InteractionType.PHONE_CALL,
            estimatedDuration: 30,
            expectedOutcome: 'Identify specific issues',
            isRequired: true
          },
          {
            id: 'step_2',
            order: 2,
            title: 'Address Concerns',
            description: 'Provide solutions to identified issues',
            suggestedAction: InteractionType.MEETING,
            estimatedDuration: 60,
            expectedOutcome: 'Build trust and credibility',
            isRequired: true
          },
          {
            id: 'step_3',
            order: 3,
            title: 'Value Demonstration',
            description: 'Technical presentation or lunch & learn',
            suggestedAction: InteractionType.LUNCH_AND_LEARN,
            estimatedDuration: 90,
            expectedOutcome: 'Showcase product value',
            isRequired: true
          }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'template_new_contact',
        name: 'New Contact Onboarding',
        description: 'Structured introduction sequence for new engineer relationships',
        category: WorkflowCategory.NEW_CONTACT_ONBOARDING,
        isActive: true,
        steps: [
          {
            id: 'step_1',
            order: 1,
            title: 'Initial Introduction',
            description: 'Introduce yourself and company',
            suggestedAction: InteractionType.PHONE_CALL,
            estimatedDuration: 20,
            expectedOutcome: 'Establish initial contact',
            isRequired: true
          },
          {
            id: 'step_2',
            order: 2,
            title: 'Company Overview',
            description: 'Present company capabilities',
            suggestedAction: InteractionType.MEETING,
            estimatedDuration: 45,
            expectedOutcome: 'Build credibility',
            isRequired: true
          }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  };

  const loadActiveExecutions = async (): Promise<WorkflowExecutionData[]> => {
    return [
      {
        id: 'exec_1',
        templateId: 'template_rating_improvement',
        engineerId: 'eng_1',
        engineerName: 'John Smith',
        currentStep: 2,
        totalSteps: 3,
        status: 'active',
        startedAt: new Date('2025-11-23'),
        progress: 66
      },
      {
        id: 'exec_2',
        templateId: 'template_new_contact',
        engineerId: 'eng_2',
        engineerName: 'Sarah Johnson',
        currentStep: 1,
        totalSteps: 2,
        status: 'active',
        startedAt: new Date('2025-11-26'),
        progress: 50
      }
    ];
  };

  const loadPerformanceMetrics = async (): Promise<WorkflowPerformanceMetrics[]> => {
    return [
      {
        templateId: 'template_rating_improvement',
        templateName: 'Rating Improvement Workflow',
        totalExecutions: 28,
        completionRate: 82,
        averageCompletionTime: 21,
        ratingImprovements: 19,
        successRate: 86
      },
      {
        templateId: 'template_new_contact',
        templateName: 'New Contact Onboarding',
        totalExecutions: 42,
        completionRate: 95,
        averageCompletionTime: 14,
        ratingImprovements: 35,
        successRate: 88
      }
    ];
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateDescription('');
    setTemplateCategory('');
    setTemplateSteps([]);
    setShowTemplateModal(true);
  };

  const handleEditTemplate = (template: WorkflowTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateCategory(template.category);
    setTemplateSteps(template.steps || []);
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = () => {
    if (!templateName || !templateDescription || !templateCategory) {
      alert('Please fill in all required fields');
      return;
    }

    const template: WorkflowTemplate = {
      id: editingTemplate?.id || `template_${Date.now()}`,
      name: templateName,
      description: templateDescription,
      category: templateCategory as WorkflowCategory,
      isActive: editingTemplate?.isActive ?? true,
      steps: templateSteps,
      createdBy: 'current_user',
      createdAt: editingTemplate?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingTemplate) {
      setWorkflowTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      setWorkflowTemplates(prev => [...prev, template]);
    }

    setShowTemplateModal(false);
    resetForm();
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this workflow template?')) {
      setWorkflowTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  const handleToggleTemplateStatus = (templateId: string) => {
    setWorkflowTemplates(prev =>
      prev.map(template =>
        template.id === templateId
          ? { ...template, isActive: !template.isActive }
          : template
      )
    );
  };

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      order: templateSteps.length + 1,
      title: '',
      description: '',
      suggestedAction: InteractionType.PHONE_CALL,
      estimatedDuration: 30,
      expectedOutcome: '',
      isRequired: true
    };
    setTemplateSteps([...templateSteps, newStep]);
  };

  const handleUpdateStep = (index: number, field: keyof WorkflowStep, value: any) => {
    const updatedSteps = [...templateSteps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setTemplateSteps(updatedSteps);
  };

  const handleRemoveStep = (index: number) => {
    setTemplateSteps(templateSteps.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTemplateName('');
    setTemplateDescription('');
    setTemplateCategory('');
    setTemplateSteps([]);
    setEditingTemplate(null);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'blue',
      completed: 'green',
      paused: 'yellow',
      failed: 'red'
    };
    return colors[status] || 'gray';
  };

  const getCategoryColor = (category: WorkflowCategory) => {
    const colors = {
      [WorkflowCategory.RATING_IMPROVEMENT]: 'red',
      [WorkflowCategory.NEW_CONTACT_ONBOARDING]: 'blue',
      [WorkflowCategory.RELATIONSHIP_MAINTENANCE]: 'green',
      [WorkflowCategory.OPPORTUNITY_DEVELOPMENT]: 'violet',
      [WorkflowCategory.RE_ENGAGEMENT]: 'orange'
    };
    return colors[category] || 'gray';
  };

  if (loading) {
    return (
      <Paper p="md" withBorder style={{ minHeight: 400, position: 'relative' }}>
        <LoadingOverlay visible={true} />
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      {/* Header Actions */}
      <Group>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreateTemplate}
        >
          Create Template
        </Button>
        <Button
          variant={showMetrics ? 'filled' : 'light'}
          leftSection={<IconChartBar size={16} />}
          onClick={() => setShowMetrics(!showMetrics)}
        >
          {showMetrics ? 'Hide' : 'Show'} Analytics
        </Button>
        <Button
          variant={showExecutionMonitor ? 'filled' : 'light'}
          leftSection={<IconPlayerPlay size={16} />}
          onClick={() => setShowExecutionMonitor(!showExecutionMonitor)}
          color="green"
        >
          {showExecutionMonitor ? 'Hide' : 'Show'} Executions
        </Button>
        <Button
          variant="light"
          leftSection={<IconRefresh size={16} />}
          onClick={loadWorkflowData}
          color="gray"
        >
          Refresh
        </Button>
      </Group>

      {/* Workflow Templates */}
      <Paper p="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={4}>Workflow Templates</Title>
          <Text size="sm" c="dimmed">{workflowTemplates.length} templates</Text>
        </Group>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          {workflowTemplates.map(template => (
            <Card key={template.id} withBorder padding="md">
              <Stack gap="xs">
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Text fw={600} size="sm">{template.name}</Text>
                    <Text size="xs" c="dimmed" lineClamp={2}>{template.description}</Text>
                  </div>
                  <Menu position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" size="sm">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        onClick={() => handleEditTemplate(template)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        leftSection={template.isActive ? <IconX size={14} /> : <IconCheck size={14} />}
                        onClick={() => handleToggleTemplateStatus(template.id)}
                      >
                        {template.isActive ? 'Deactivate' : 'Activate'}
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
                <Group gap="xs">
                  <Badge size="sm" color={getCategoryColor(template.category)} variant="light">
                    {template.category}
                  </Badge>
                  <Badge size="sm" color={template.isActive ? 'green' : 'gray'} variant="dot">
                    {template.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed">
                  {template.steps?.length || 0} steps
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Paper>

      {/* Performance Metrics */}
      {showMetrics && (
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Workflow Performance Analytics</Title>
          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }}>
            {performanceMetrics.map(metric => (
              <Card key={metric.templateId} withBorder padding="sm">
                <Text fw={600} size="sm" mb="xs">{metric.templateName}</Text>
                <Stack gap={4}>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Executions:</Text>
                    <Text size="xs" fw={500}>{metric.totalExecutions}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Completion Rate:</Text>
                    <Text size="xs" fw={500} c="green">{metric.completionRate}%</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Avg. Time:</Text>
                    <Text size="xs" fw={500}>{metric.averageCompletionTime} days</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Success Rate:</Text>
                    <Text size="xs" fw={500} c="blue">{metric.successRate}%</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Rating Improvements:</Text>
                    <Text size="xs" fw={500} c="violet">{metric.ratingImprovements}</Text>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Paper>
      )}

      {/* Active Executions */}
      <Paper p="md" withBorder>
        <Title order={4} mb="md">Active Workflow Executions</Title>
        {activeExecutions.length === 0 ? (
          <Text c="dimmed">No active workflow executions</Text>
        ) : (
          <Stack gap="md">
            {activeExecutions.map(execution => {
              const template = workflowTemplates.find(t => t.id === execution.templateId);
              
              return (
                <Card key={execution.id} withBorder padding="md">
                  <Stack gap="xs">
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Text fw={600}>{execution.engineerName}</Text>
                        <Text size="sm" c="dimmed">{template?.name}</Text>
                      </div>
                      <Badge color={getStatusColor(execution.status)}>
                        {execution.status.toUpperCase()}
                      </Badge>
                    </Group>
                    
                    <div>
                      <Group justify="space-between" mb={4}>
                        <Text size="sm" c="dimmed">
                          Progress: Step {execution.currentStep} of {execution.totalSteps}
                        </Text>
                        <Text size="sm" fw={500}>{execution.progress}%</Text>
                      </Group>
                      <Progress value={execution.progress} size="sm" color="blue" />
                    </div>
                    
                    <Text size="sm" c="dimmed">
                      Started: {execution.startedAt.toLocaleDateString()}
                    </Text>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}
      </Paper>

      {/* Template Creation/Edit Modal */}
      <Modal
        opened={showTemplateModal}
        onClose={() => {
          setShowTemplateModal(false);
          resetForm();
        }}
        title={editingTemplate ? 'Edit Workflow Template' : 'Create Workflow Template'}
        size="xl"
      >
        <Stack gap="md">
          <TextInput
            label="Template Name"
            placeholder="e.g., Rating Improvement Workflow"
            value={templateName}
            onChange={(e) => setTemplateName(e.currentTarget.value)}
            required
          />
          
          <Textarea
            label="Description"
            placeholder="Describe the purpose and outcomes of this workflow"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.currentTarget.value)}
            required
            minRows={3}
          />
          
          <Select
            label="Category"
            placeholder="Select workflow category"
            value={templateCategory}
            onChange={(value) => setTemplateCategory(value as WorkflowCategory)}
            data={[
              { value: WorkflowCategory.RATING_IMPROVEMENT, label: 'Rating Improvement' },
              { value: WorkflowCategory.NEW_CONTACT_ONBOARDING, label: 'New Contact Onboarding' },
              { value: WorkflowCategory.RELATIONSHIP_MAINTENANCE, label: 'Relationship Maintenance' },
              { value: WorkflowCategory.OPPORTUNITY_DEVELOPMENT, label: 'Opportunity Development' },
              { value: WorkflowCategory.RE_ENGAGEMENT, label: 'Re-engagement' }
            ]}
            required
          />

          <Divider label="Workflow Steps" labelPosition="center" />

          <Stack gap="md">
            {templateSteps.map((step, index) => (
              <Card key={step.id} withBorder padding="md">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text fw={600} size="sm">Step {index + 1}</Text>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => handleRemoveStep(index)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                  
                  <TextInput
                    label="Step Title"
                    placeholder="e.g., Initial Assessment"
                    value={step.title}
                    onChange={(e) => handleUpdateStep(index, 'title', e.currentTarget.value)}
                    required
                  />
                  
                  <Textarea
                    label="Description"
                    placeholder="What happens in this step?"
                    value={step.description}
                    onChange={(e) => handleUpdateStep(index, 'description', e.currentTarget.value)}
                    minRows={2}
                  />
                  
                  <Select
                    label="Suggested Action"
                    value={step.suggestedAction}
                    onChange={(value) => handleUpdateStep(index, 'suggestedAction', value)}
                    data={[
                      { value: InteractionType.PHONE_CALL, label: 'Phone Call' },
                      { value: InteractionType.EMAIL, label: 'Email' },
                      { value: InteractionType.MEETING, label: 'Meeting' },
                      { value: InteractionType.LUNCH_AND_LEARN, label: 'Lunch & Learn' },
                      { value: InteractionType.SITE_VISIT, label: 'Site Visit' },
                      { value: InteractionType.TRADE_SHOW, label: 'Trade Show' },
                      { value: InteractionType.WEBINAR, label: 'Webinar' }
                    ]}
                  />
                  
                  <NumberInput
                    label="Estimated Duration (minutes)"
                    value={step.estimatedDuration}
                    onChange={(value) => handleUpdateStep(index, 'estimatedDuration', value)}
                    min={5}
                    step={5}
                  />
                  
                  <TextInput
                    label="Expected Outcome"
                    placeholder="What should be achieved?"
                    value={step.expectedOutcome}
                    onChange={(e) => handleUpdateStep(index, 'expectedOutcome', e.currentTarget.value)}
                  />
                </Stack>
              </Card>
            ))}
          </Stack>

          <Button
            variant="light"
            leftSection={<IconPlus size={16} />}
            onClick={handleAddStep}
          >
            Add Step
          </Button>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => {
              setShowTemplateModal(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              {editingTemplate ? 'Save Changes' : 'Create Template'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

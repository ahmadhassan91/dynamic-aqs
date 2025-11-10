'use client';

import { useState } from 'react';
import {
  Stack,
  Group,
  Text,
  Button,
  Stepper,
  Card,
  Badge,
  Timeline,
  ThemeIcon,
  Box,
  Progress,
  ActionIcon,
  Tooltip,
  Textarea,
  Select,
} from '@mantine/core';
import {
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconMail,
  IconPhone,
  IconCalendar,
  IconFileText,
  IconUser,
  IconBuilding,
  IconEdit,
  IconPlayerPlay,
  IconPlayerPause,
} from '@tabler/icons-react';

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

interface OnboardingWizardProps {
  record: OnboardingRecord;
  onClose: () => void;
  onUpdate: (record: OnboardingRecord) => void;
}

export function OnboardingWizard({ record, onClose, onUpdate }: OnboardingWizardProps) {
  const [activeStep, setActiveStep] = useState(record.currentStep);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [taskNotes, setTaskNotes] = useState<{ [key: string]: string }>({});

  const getStatusColor = (status: OnboardingTask['status'] | OnboardingRecord['status']) => {
    switch (status) {
      case 'pending': return 'gray';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'skipped': return 'yellow';
      case 'not_started': return 'gray';
      case 'on_hold': return 'orange';
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

  const handleTaskStatusChange = (taskId: string, newStatus: OnboardingTask['status']) => {
    const updatedTasks = record.tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: newStatus,
          completedDate: newStatus === 'completed' ? new Date() : undefined,
        };
      }
      return task;
    });

    // Calculate new current step based on completed tasks
    const completedTasks = updatedTasks.filter(task => task.status === 'completed').length;
    const newCurrentStep = Math.min(completedTasks, record.totalSteps);
    
    // Determine new overall status
    let newOverallStatus: OnboardingRecord['status'] = record.status;
    if (newCurrentStep === record.totalSteps) {
      newOverallStatus = 'completed';
    } else if (newCurrentStep > 0) {
      newOverallStatus = 'in_progress';
    }

    const updatedRecord: OnboardingRecord = {
      ...record,
      tasks: updatedTasks,
      currentStep: newCurrentStep,
      status: newOverallStatus,
      actualCompletionDate: newOverallStatus === 'completed' ? new Date() : undefined,
    };

    onUpdate(updatedRecord);
    setActiveStep(newCurrentStep);
  };

  const handleAddNote = (taskId: string, note: string) => {
    setTaskNotes(prev => ({ ...prev, [taskId]: note }));
  };

  const stepperSteps = record.tasks.map((task, index) => ({
    label: `Step ${index + 1}`,
    description: task.title,
    completedOn: task.completedDate?.toLocaleDateString(),
  }));

  return (
    <Stack gap="md">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <Box>
          <Text size="xl" fw={700}>
            {record.companyName}
          </Text>
          <Text c="dimmed" size="sm">
            {record.leadName} • Assigned to {record.assignedTo}
          </Text>
        </Box>
        <Badge size="lg" color={getStatusColor(record.status)} variant="light">
          {record.status.replace('_', ' ')}
        </Badge>
      </Group>

      {/* Progress Overview */}
      <Card withBorder p="md">
        <Group justify="space-between" mb="md">
          <Text fw={600}>Overall Progress</Text>
          <Text size="sm" c="dimmed">
            {record.currentStep} of {record.totalSteps} steps completed
          </Text>
        </Group>
        <Progress
          value={(record.currentStep / record.totalSteps) * 100}
          size="lg"
          color={getStatusColor(record.status)}
          radius="xl"
          mb="md"
        />
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Started: {record.startDate.toLocaleDateString()}
          </Text>
          <Text size="sm" c="dimmed">
            Expected: {record.expectedCompletionDate.toLocaleDateString()}
          </Text>
          {record.actualCompletionDate && (
            <Text size="sm" c="green">
              Completed: {record.actualCompletionDate.toLocaleDateString()}
            </Text>
          )}
        </Group>
      </Card>

      {/* Stepper */}
      <Stepper active={activeStep} onStepClick={setActiveStep} orientation="vertical" size="sm">
        {record.tasks.map((task, index) => {
          const TaskIcon = getTaskIcon(task.type);
          const isEditing = editingTask === task.id;
          
          return (
            <Stepper.Step
              key={task.id}
              label={task.title}
              description={task.description}
              completedIcon={<IconCheck size={16} />}
              icon={<TaskIcon size={16} />}
              color={getStatusColor(task.status)}
            >
              <Card withBorder p="md" mt="md">
                <Stack gap="sm">
                  <Group justify="space-between" align="flex-start">
                    <Box flex={1}>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" color={getStatusColor(task.status)} variant="light">
                          <TaskIcon size={12} />
                        </ThemeIcon>
                        <Text fw={600} size="sm">
                          {task.title}
                        </Text>
                        <Badge size="xs" color={getStatusColor(task.status)} variant="light">
                          {task.status}
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed" mb="xs">
                        {task.description}
                      </Text>
                      <Group gap="md">
                        <Text size="xs" c="dimmed">
                          Assigned to: {task.assignedTo}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Due: {task.dueDate.toLocaleDateString()}
                        </Text>
                        {task.completedDate && (
                          <Text size="xs" c="green">
                            Completed: {task.completedDate.toLocaleDateString()}
                          </Text>
                        )}
                      </Group>
                    </Box>
                    <Group gap="xs">
                      <Tooltip label="Edit task">
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={() => setEditingTask(isEditing ? null : task.id)}
                        >
                          <IconEdit size={14} />
                        </ActionIcon>
                      </Tooltip>
                      {task.status === 'pending' && (
                        <Tooltip label="Start task">
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            color="blue"
                            onClick={() => handleTaskStatusChange(task.id, 'in_progress')}
                          >
                            <IconPlayerPlay size={14} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      {task.status === 'in_progress' && (
                        <Tooltip label="Complete task">
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            color="green"
                            onClick={() => handleTaskStatusChange(task.id, 'completed')}
                          >
                            <IconCheck size={14} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Group>
                  </Group>

                  {isEditing && (
                    <Stack gap="xs">
                      <Select
                        label="Status"
                        value={task.status}
                        onChange={(value) => value && handleTaskStatusChange(task.id, value as OnboardingTask['status'])}
                        data={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'in_progress', label: 'In Progress' },
                          { value: 'completed', label: 'Completed' },
                          { value: 'skipped', label: 'Skipped' },
                        ]}
                      />
                      <Textarea
                        label="Notes"
                        placeholder="Add notes about this task..."
                        value={taskNotes[task.id] || ''}
                        onChange={(event) => handleAddNote(task.id, event.currentTarget.value)}
                        minRows={2}
                      />
                      <Group justify="flex-end">
                        <Button size="xs" variant="default" onClick={() => setEditingTask(null)}>
                          Cancel
                        </Button>
                        <Button size="xs" onClick={() => setEditingTask(null)}>
                          Save
                        </Button>
                      </Group>
                    </Stack>
                  )}

                  {taskNotes[task.id] && !isEditing && (
                    <Card withBorder p="xs" bg="gray.0">
                      <Text size="xs" fw={600} mb={4}>Notes:</Text>
                      <Text size="xs" c="dimmed">
                        {taskNotes[task.id]}
                      </Text>
                    </Card>
                  )}
                </Stack>
              </Card>
            </Stepper.Step>
          );
        })}
      </Stepper>

      {/* Action Buttons */}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Close
        </Button>
        <Button leftSection={<IconMail size={16} />}>
          Send Update Email
        </Button>
        <Button leftSection={<IconCalendar size={16} />}>
          Schedule Check-in
        </Button>
      </Group>
    </Stack>
  );
}
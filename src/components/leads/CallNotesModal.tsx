'use client';

import {
  Stack,
  Group,
  Text,
  Button,
  Card,
  Badge,
  Timeline,
  ThemeIcon,
  Box,
  Divider,
  ActionIcon,
  Tooltip,
  SimpleGrid,
  Progress,
} from '@mantine/core';
import {
  IconPhone,
  IconCalendar,
  IconClock,
  IconUser,
  IconBuilding,
  IconNotes,
  IconMicrophone,
  IconFileText,
  IconEdit,
  IconDownload,
  IconPlayerPlay,
  IconCheck,
  IconMail,
  IconAlertCircle,
} from '@tabler/icons-react';

interface DiscoveryCall {
  id: string;
  leadId: string;
  leadName: string;
  companyName: string;
  scheduledDate: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  assignedTo: string;
  callType: 'initial' | 'follow_up' | 'technical' | 'closing';
  outcome?: 'qualified' | 'not_qualified' | 'needs_follow_up' | 'ready_for_proposal';
  notes?: string;
  recordingUrl?: string;
  transcriptUrl?: string;
  followUpTasks?: FollowUpTask[];
  createdAt: Date;
  updatedAt: Date;
}

interface FollowUpTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  assignedTo: string;
  status: 'pending' | 'completed';
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'demo';
}

interface CallNotesModalProps {
  call: DiscoveryCall;
  onClose: () => void;
  onEdit: () => void;
}

export function CallNotesModal({ call, onClose, onEdit }: CallNotesModalProps) {
  const getStatusColor = (status: DiscoveryCall['status']) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      case 'no_show': return 'orange';
      case 'rescheduled': return 'yellow';
      default: return 'gray';
    }
  };

  const getOutcomeColor = (outcome: DiscoveryCall['outcome']) => {
    switch (outcome) {
      case 'qualified': return 'green';
      case 'not_qualified': return 'red';
      case 'needs_follow_up': return 'yellow';
      case 'ready_for_proposal': return 'blue';
      default: return 'gray';
    }
  };

  const getTaskStatusColor = (status: FollowUpTask['status']) => {
    return status === 'completed' ? 'green' : 'blue';
  };

  const getTaskIcon = (type: FollowUpTask['type']) => {
    switch (type) {
      case 'call': return IconPhone;
      case 'email': return IconMail;
      case 'meeting': return IconCalendar;
      case 'proposal': return IconFileText;
      case 'demo': return IconPlayerPlay;
      default: return IconCheck;
    }
  };

  // Mock call timeline
  const callTimeline = [
    {
      id: '1',
      action: 'Call Scheduled',
      description: `Discovery call scheduled with ${call.leadName}`,
      date: call.createdAt,
      user: call.assignedTo,
      icon: IconCalendar,
      color: 'blue',
    },
    {
      id: '2',
      action: 'Reminder Sent',
      description: 'Automated reminder email sent to prospect',
      date: new Date(call.scheduledDate.getTime() - 24 * 60 * 60 * 1000),
      user: 'System',
      icon: IconMail,
      color: 'cyan',
    },
  ];

  if (call.status === 'completed') {
    callTimeline.push({
      id: '3',
      action: 'Call Completed',
      description: `${call.duration} minute call completed`,
      date: call.scheduledDate,
      user: call.assignedTo,
      icon: IconPhone,
      color: 'green',
    });

    if (call.recordingUrl) {
      callTimeline.push({
        id: '4',
        action: 'Recording Available',
        description: 'Call recording processed and available',
        date: new Date(call.scheduledDate.getTime() + 5 * 60 * 1000),
        user: 'System',
        icon: IconMicrophone,
        color: 'purple',
      });
    }

    if (call.transcriptUrl) {
      callTimeline.push({
        id: '5',
        action: 'Transcript Generated',
        description: 'AI transcript generated from call recording',
        date: new Date(call.scheduledDate.getTime() + 10 * 60 * 1000),
        user: 'System',
        icon: IconFileText,
        color: 'indigo',
      });
    }
  }

  return (
    <Stack gap="md">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <Box>
          <Group gap="xs" mb="xs">
            <Text size="xl" fw={700}>
              {call.companyName}
            </Text>
            <Badge color={getStatusColor(call.status)} variant="light">
              {call.status.replace('_', ' ')}
            </Badge>
            {call.outcome && (
              <Badge color={getOutcomeColor(call.outcome)} variant="light">
                {call.outcome.replace('_', ' ')}
              </Badge>
            )}
          </Group>
          <Text c="dimmed" size="sm">
            {call.leadName} • {call.callType.replace('_', ' ')} call
          </Text>
        </Box>
        <Button leftSection={<IconEdit size={16} />} onClick={onEdit}>
          Edit Call
        </Button>
      </Group>

      <Divider />

      {/* Call Details */}
      <SimpleGrid cols={2} spacing="md">
        <Card withBorder p="md">
          <Stack gap="xs">
            <Group gap="xs">
              <ThemeIcon variant="light" color="blue">
                <IconCalendar size={16} />
              </ThemeIcon>
              <Text fw={600} size="sm">Call Information</Text>
            </Group>
            <Stack gap={4}>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Date & Time:</Text>
                <Text size="sm" fw={500}>
                  {call.scheduledDate.toLocaleString()}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Duration:</Text>
                <Text size="sm" fw={500}>
                  {call.duration} minutes
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Assigned to:</Text>
                <Text size="sm" fw={500}>
                  {call.assignedTo}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Call Type:</Text>
                <Text size="sm" fw={500} tt="capitalize">
                  {call.callType.replace('_', ' ')}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Card>

        <Card withBorder p="md">
          <Stack gap="xs">
            <Group gap="xs">
              <ThemeIcon variant="light" color="green">
                <IconUser size={16} />
              </ThemeIcon>
              <Text fw={600} size="sm">Contact Details</Text>
            </Group>
            <Stack gap={4}>
              <Group gap="xs">
                <IconUser size={14} />
                <Text size="sm">{call.leadName}</Text>
              </Group>
              <Group gap="xs">
                <IconBuilding size={14} />
                <Text size="sm">{call.companyName}</Text>
              </Group>
              <Group gap="xs">
                <IconClock size={14} />
                <Text size="sm">Created: {call.createdAt.toLocaleDateString()}</Text>
              </Group>
              <Group gap="xs">
                <IconClock size={14} />
                <Text size="sm">Updated: {call.updatedAt.toLocaleDateString()}</Text>
              </Group>
            </Stack>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Call Notes */}
      {call.notes && (
        <Card withBorder p="md">
          <Group gap="xs" mb="md">
            <ThemeIcon variant="light" color="yellow">
              <IconNotes size={16} />
            </ThemeIcon>
            <Text fw={600} size="sm">Call Notes</Text>
          </Group>
          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
            {call.notes}
          </Text>
        </Card>
      )}

      {/* Recording and Transcript */}
      {(call.recordingUrl || call.transcriptUrl) && (
        <Card withBorder p="md">
          <Group gap="xs" mb="md">
            <ThemeIcon variant="light" color="purple">
              <IconMicrophone size={16} />
            </ThemeIcon>
            <Text fw={600} size="sm">Recording & Transcript</Text>
          </Group>
          <Group gap="md">
            {call.recordingUrl && (
              <Button
                variant="light"
                leftSection={<IconPlayerPlay size={16} />}
                size="sm"
              >
                Play Recording
              </Button>
            )}
            {call.transcriptUrl && (
              <Button
                variant="light"
                leftSection={<IconFileText size={16} />}
                size="sm"
              >
                View Transcript
              </Button>
            )}
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              size="sm"
            >
              Download
            </Button>
          </Group>
        </Card>
      )}

      {/* Follow-up Tasks */}
      {call.followUpTasks && call.followUpTasks.length > 0 && (
        <Card withBorder p="md">
          <Group gap="xs" mb="md">
            <ThemeIcon variant="light" color="orange">
              <IconCheck size={16} />
            </ThemeIcon>
            <Text fw={600} size="sm">Follow-up Tasks</Text>
          </Group>
          <Stack gap="sm">
            {call.followUpTasks.map((task) => {
              const TaskIcon = getTaskIcon(task.type);
              const isOverdue = task.status === 'pending' && task.dueDate < new Date();
              
              return (
                <Card key={task.id} withBorder p="sm" bg={task.status === 'completed' ? 'green.0' : isOverdue ? 'red.0' : undefined}>
                  <Group justify="space-between" align="flex-start">
                    <Group gap="xs" flex={1}>
                      <ThemeIcon size="sm" color={getTaskStatusColor(task.status)} variant="light">
                        <TaskIcon size={12} />
                      </ThemeIcon>
                      <Box flex={1}>
                        <Group gap="xs" mb={4}>
                          <Text fw={500} size="sm">
                            {task.title}
                          </Text>
                          <Badge size="xs" color={getTaskStatusColor(task.status)} variant="light">
                            {task.status}
                          </Badge>
                          {isOverdue && (
                            <Badge size="xs" color="red" variant="light">
                              Overdue
                            </Badge>
                          )}
                        </Group>
                        <Text size="xs" c="dimmed" mb={4}>
                          {task.description}
                        </Text>
                        <Group gap="md">
                          <Text size="xs" c="dimmed">
                            Due: {task.dueDate.toLocaleDateString()}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Assigned to: {task.assignedTo}
                          </Text>
                          {task.status === 'completed' && (
                            <Text size="xs" c="green">
                              Completed
                            </Text>
                          )}
                        </Group>
                      </Box>
                    </Group>
                    {task.status === 'pending' && (
                      <Tooltip label="Mark as completed">
                        <ActionIcon variant="subtle" size="sm" color="green">
                          <IconCheck size={14} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                </Card>
              );
            })}
          </Stack>
        </Card>
      )}

      {/* Call Timeline */}
      <Card withBorder p="md">
        <Group gap="xs" mb="md">
          <ThemeIcon variant="light" color="indigo">
            <IconClock size={16} />
          </ThemeIcon>
          <Text fw={600} size="sm">Call Timeline</Text>
        </Group>
        <Timeline active={callTimeline.length - 1} bulletSize={24} lineWidth={2}>
          {callTimeline.map((item) => (
            <Timeline.Item
              key={item.id}
              bullet={
                <ThemeIcon size={24} color={item.color} variant="light">
                  <item.icon size={12} />
                </ThemeIcon>
              }
              title={item.action}
            >
              <Text c="dimmed" size="sm">
                {item.description}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                {item.date.toLocaleString()} • {item.user}
              </Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* Action Buttons */}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Close
        </Button>
        <Button leftSection={<IconPhone size={16} />}>
          Schedule Follow-up
        </Button>
        <Button leftSection={<IconMail size={16} />}>
          Send Summary
        </Button>
        <Button leftSection={<IconFileText size={16} />}>
          Create Proposal
        </Button>
      </Group>
    </Stack>
  );
}
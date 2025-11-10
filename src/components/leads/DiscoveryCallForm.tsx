'use client';

import { useState } from 'react';
import {
  Stack,
  TextInput,
  Select,
  Textarea,
  Button,
  Group,
  NumberInput,
  Grid,
  Card,
  Text,
  Checkbox,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';

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

interface DiscoveryCallFormProps {
  call?: DiscoveryCall | null;
  onSave: (call: DiscoveryCall) => void;
  onCancel: () => void;
}

export function DiscoveryCallForm({ call, onSave, onCancel }: DiscoveryCallFormProps) {
  const [generateFollowUp, setGenerateFollowUp] = useState(false);

  const form = useForm({
    initialValues: {
      leadName: call?.leadName || '',
      companyName: call?.companyName || '',
      scheduledDate: call?.scheduledDate || new Date(),
      duration: call?.duration || 30,
      assignedTo: call?.assignedTo || '',
      callType: call?.callType || 'initial',
      status: call?.status || 'scheduled',
      outcome: call?.outcome || '',
      notes: call?.notes || '',
    },
    validate: {
      leadName: (value) => (value.length < 2 ? 'Lead name must have at least 2 letters' : null),
      companyName: (value) => (value.length < 2 ? 'Company name must have at least 2 letters' : null),
      scheduledDate: (value) => (!value ? 'Scheduled date is required' : null),
      duration: (value) => (value < 15 || value > 180 ? 'Duration must be between 15 and 180 minutes' : null),
      assignedTo: (value) => (value.length < 2 ? 'Assigned to is required' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const followUpTasks: FollowUpTask[] = [];

    // Generate follow-up tasks based on outcome
    if (generateFollowUp && values.outcome === 'qualified') {
      followUpTasks.push(
        {
          id: crypto.randomUUID(),
          title: 'Send Product Information',
          description: 'Email detailed product specifications and pricing',
          dueDate: new Date(values.scheduledDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          assignedTo: values.assignedTo,
          status: 'pending',
          type: 'email',
        },
        {
          id: crypto.randomUUID(),
          title: 'Schedule Follow-up Call',
          description: 'Schedule next call to discuss proposal',
          dueDate: new Date(values.scheduledDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          assignedTo: values.assignedTo,
          status: 'pending',
          type: 'call',
        }
      );
    } else if (generateFollowUp && values.outcome === 'needs_follow_up') {
      followUpTasks.push({
        id: crypto.randomUUID(),
        title: 'Follow-up Call',
        description: 'Address concerns and provide additional information',
        dueDate: new Date(values.scheduledDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        assignedTo: values.assignedTo,
        status: 'pending',
        type: 'call',
      });
    } else if (generateFollowUp && values.outcome === 'ready_for_proposal') {
      followUpTasks.push({
        id: crypto.randomUUID(),
        title: 'Prepare Proposal',
        description: 'Create and send formal proposal',
        dueDate: new Date(values.scheduledDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        assignedTo: values.assignedTo,
        status: 'pending',
        type: 'proposal',
      });
    }

    const updatedCall: DiscoveryCall = {
      id: call?.id || crypto.randomUUID(),
      leadId: call?.leadId || crypto.randomUUID(),
      leadName: values.leadName,
      companyName: values.companyName,
      scheduledDate: values.scheduledDate,
      duration: values.duration,
      status: values.status as DiscoveryCall['status'],
      assignedTo: values.assignedTo,
      callType: values.callType as DiscoveryCall['callType'],
      outcome: values.outcome ? values.outcome as DiscoveryCall['outcome'] : undefined,
      notes: values.notes,
      followUpTasks: followUpTasks.length > 0 ? followUpTasks : call?.followUpTasks,
      createdAt: call?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(updatedCall);
  };

  const callTypeOptions = [
    { value: 'initial', label: 'Initial Discovery' },
    { value: 'follow_up', label: 'Follow-up Call' },
    { value: 'technical', label: 'Technical Discussion' },
    { value: 'closing', label: 'Closing Call' },
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' },
    { value: 'rescheduled', label: 'Rescheduled' },
  ];

  const outcomeOptions = [
    { value: '', label: 'No outcome yet' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'not_qualified', label: 'Not Qualified' },
    { value: 'needs_follow_up', label: 'Needs Follow-up' },
    { value: 'ready_for_proposal', label: 'Ready for Proposal' },
  ];

  // Mock territory managers for assignment
  const territoryManagers = [
    { value: 'tm-1', label: 'John Smith (Northeast)' },
    { value: 'tm-2', label: 'Sarah Johnson (Southeast)' },
    { value: 'tm-3', label: 'Mike Davis (Midwest)' },
    { value: 'tm-4', label: 'Lisa Wilson (Southwest)' },
    { value: 'tm-5', label: 'David Brown (West Coast)' },
    { value: 'tm-6', label: 'Emily Taylor (Northwest)' },
  ];

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        {/* Basic Information */}
        <Card withBorder p="md">
          <Text fw={600} mb="md">Call Information</Text>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Lead Name"
                placeholder="Enter lead name"
                required
                {...form.getInputProps('leadName')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Company Name"
                placeholder="Enter company name"
                required
                {...form.getInputProps('companyName')}
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Scheduling Details */}
        <Card withBorder p="md">
          <Text fw={600} mb="md">Scheduling</Text>
          <Grid>
            <Grid.Col span={6}>
              <DateTimePicker
                label="Scheduled Date & Time"
                placeholder="Select date and time"
                required
                {...form.getInputProps('scheduledDate')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Duration (minutes)"
                placeholder="30"
                min={15}
                max={180}
                step={15}
                required
                {...form.getInputProps('duration')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Assigned To"
                placeholder="Select territory manager"
                data={territoryManagers}
                searchable
                required
                {...form.getInputProps('assignedTo')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Call Type"
                placeholder="Select call type"
                data={callTypeOptions}
                required
                {...form.getInputProps('callType')}
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Call Status and Outcome */}
        <Card withBorder p="md">
          <Text fw={600} mb="md">Status & Outcome</Text>
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Status"
                placeholder="Select status"
                data={statusOptions}
                required
                {...form.getInputProps('status')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Outcome"
                placeholder="Select outcome"
                data={outcomeOptions}
                {...form.getInputProps('outcome')}
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Notes */}
        <Card withBorder p="md">
          <Text fw={600} mb="md">Call Notes</Text>
          <Textarea
            label="Notes"
            placeholder="Enter call notes, key discussion points, next steps..."
            minRows={4}
            {...form.getInputProps('notes')}
          />
        </Card>

        {/* Follow-up Tasks */}
        {form.values.status === 'completed' && form.values.outcome && (
          <Card withBorder p="md">
            <Text fw={600} mb="md">Follow-up Actions</Text>
            <Checkbox
              label="Generate automatic follow-up tasks based on call outcome"
              checked={generateFollowUp}
              onChange={(event) => setGenerateFollowUp(event.currentTarget.checked)}
            />
            {generateFollowUp && (
              <Text size="sm" c="dimmed" mt="xs">
                Follow-up tasks will be created automatically based on the selected outcome.
              </Text>
            )}
          </Card>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {call ? 'Update Call' : 'Schedule Call'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
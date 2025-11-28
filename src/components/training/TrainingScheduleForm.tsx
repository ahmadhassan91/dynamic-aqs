'use client';

import { useState } from 'react';
import {
  Stack,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  NumberInput,
  Button,
  Group,
  Grid,
  Card,
  Text,
  Badge,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendar, IconClock, IconUsers, IconBook } from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface TrainingScheduleFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function TrainingScheduleForm({ onClose, onSubmit }: TrainingScheduleFormProps) {
  const mockData = useMockData();
  const users = mockData?.users ?? [];
  const customers = mockData?.customers ?? [];
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      type: '',
      trainer: '',
      scheduledDate: new Date(),
      duration: 60,
      maxAttendees: 20,
      location: '',
      attendees: [] as string[],
      materials: '',
      objectives: '',
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : null),
      type: (value) => (!value ? 'Training type is required' : null),
      trainer: (value) => (!value ? 'Trainer is required' : null),
      scheduledDate: (value) => (!value ? 'Date and time is required' : null),
      duration: (value) => (value < 15 ? 'Duration must be at least 15 minutes' : null),
    },
  });

  const trainingTypes = [
    { value: 'product_training', label: 'Product Training' },
    { value: 'sales_training', label: 'Sales Training' },
    { value: 'technical_training', label: 'Technical Training' },
    { value: 'compliance_training', label: 'Compliance Training' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'certification', label: 'Certification' },
  ];

  // Compute options directly with safeguards
  const trainerOptions: Array<{value: string; label: string}> = Array.isArray(users) 
    ? users
        .filter(user => user && user.role === 'admin' || user.role === 'regional_manager')
        .map(user => ({
          value: user.id || '',
          label: `${user.firstName || ''} ${user.lastName || ''}`,
        }))
    : [];

  // Simple array of attendee options without grouping to avoid potential Mantine issues
  const attendeeOptions: string[] = [];

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const trainingData = {
        ...values,
        id: `training-${Date.now()}`,
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onSubmit(trainingData);
      
      notifications.show({
        title: 'Training Scheduled',
        message: 'Training session has been successfully scheduled',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to schedule training session',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        {/* Basic Information */}
        <Card withBorder p="md">
          <Text fw={600} mb="md">Basic Information</Text>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Training Title"
                placeholder="Enter training session title"
                leftSection={<IconBook size={16} />}
                {...form.getInputProps('title')}
                required
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Description"
                placeholder="Describe the training session"
                rows={3}
                {...form.getInputProps('description')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Training Type"
                placeholder="Select training type"
                data={trainingTypes}
                value={form.values.type || null}
                onChange={(val) => form.setFieldValue('type', val || '')}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Trainer"
                placeholder="Select trainer"
                data={trainerOptions}
                value={form.values.trainer || null}
                onChange={(val) => form.setFieldValue('trainer', val || '')}
                required
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Schedule & Logistics */}
        <Card withBorder p="md">
          <Text fw={600} mb="md">Schedule & Logistics</Text>
          <Grid>
            <Grid.Col span={6}>
              <DateTimePicker
                label="Date & Time"
                placeholder="Select date and time"
                leftSection={<IconCalendar size={16} />}
                {...form.getInputProps('scheduledDate')}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Duration (minutes)"
                placeholder="60"
                leftSection={<IconClock size={16} />}
                min={15}
                max={480}
                {...form.getInputProps('duration')}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Max Attendees"
                placeholder="20"
                leftSection={<IconUsers size={16} />}
                min={1}
                max={100}
                {...form.getInputProps('maxAttendees')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Location"
                placeholder="Training room, online, etc."
                {...form.getInputProps('location')}
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Attendees */}
        <Card withBorder p="md">
          <Text fw={600} mb="md">Attendees</Text>
          <MultiSelect
            label="Select Attendees"
            placeholder="Choose who should attend this training"
            data={[]}
            searchable
            clearable
            value={[]}
            onChange={() => {}}
          />
        </Card>

        {/* Training Materials & Objectives */}
        <Card withBorder p="md">
          <Text fw={600} mb="md">Training Details</Text>
          <Grid>
            <Grid.Col span={12}>
              <Textarea
                label="Learning Objectives"
                placeholder="What will attendees learn from this training?"
                rows={3}
                {...form.getInputProps('objectives')}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Materials & Resources"
                placeholder="List any materials, documents, or resources needed"
                rows={2}
                {...form.getInputProps('materials')}
              />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Action Buttons */}
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Schedule Training
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
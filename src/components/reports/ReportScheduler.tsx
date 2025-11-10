'use client';

import { useState } from 'react';
import {
  Modal,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Select,
  TextInput,
  Textarea,
  Checkbox,
  Paper,
  ActionIcon,
  Divider
} from '@mantine/core';
import { IconX, IconTrash, IconPlus } from '@tabler/icons-react';

interface ReportSchedulerProps {
  reportType: string;
  onClose: () => void;
  onSchedule: (schedule: any) => void;
}

export function ReportScheduler({ reportType, onClose, onSchedule }: ReportSchedulerProps) {
  const [schedule, setSchedule] = useState({
    frequency: 'weekly',
    dayOfWeek: 'monday',
    dayOfMonth: '1',
    time: '09:00',
    recipients: [''],
    format: 'pdf',
    includeCharts: true,
    includeRawData: false,
    customMessage: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(schedule);
  };

  const addRecipient = () => {
    setSchedule(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }));
  };

  const updateRecipient = (index: number, email: string) => {
    setSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.map((r, i) => i === index ? email : r)
    }));
  };

  const removeRecipient = (index: number) => {
    setSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const getOrdinalSuffix = (day: string): string => {
    const num = parseInt(day);
    if (num >= 11 && num <= 13) return 'th';
    switch (num % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={`Schedule ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`}
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {/* Frequency */}
          <Select
            label="Frequency"
            value={schedule.frequency}
            onChange={(value) => setSchedule(prev => ({ ...prev, frequency: value || 'weekly' }))}
            data={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' }
            ]}
          />

          {/* Schedule Details */}
          <Group grow>
            {schedule.frequency === 'weekly' && (
              <Select
                label="Day of Week"
                value={schedule.dayOfWeek}
                onChange={(value) => setSchedule(prev => ({ ...prev, dayOfWeek: value || 'monday' }))}
                data={[
                  { value: 'monday', label: 'Monday' },
                  { value: 'tuesday', label: 'Tuesday' },
                  { value: 'wednesday', label: 'Wednesday' },
                  { value: 'thursday', label: 'Thursday' },
                  { value: 'friday', label: 'Friday' },
                  { value: 'saturday', label: 'Saturday' },
                  { value: 'sunday', label: 'Sunday' }
                ]}
              />
            )}

            {schedule.frequency === 'monthly' && (
              <Select
                label="Day of Month"
                value={schedule.dayOfMonth}
                onChange={(value) => setSchedule(prev => ({ ...prev, dayOfMonth: value || '1' }))}
                data={[
                  ...Array.from({ length: 28 }, (_, i) => ({
                    value: (i + 1).toString(),
                    label: (i + 1).toString()
                  })),
                  { value: 'last', label: 'Last day of month' }
                ]}
              />
            )}

            <TextInput
              label="Time"
              type="time"
              value={schedule.time}
              onChange={(e) => setSchedule(prev => ({ ...prev, time: e.currentTarget.value }))}
            />
          </Group>

          {/* Recipients */}
          <Stack gap="xs">
            <Text fw={500} size="sm">Email Recipients</Text>
            {schedule.recipients.map((recipient, index) => (
              <Group key={index} gap="xs">
                <TextInput
                  flex={1}
                  type="email"
                  value={recipient}
                  onChange={(e) => updateRecipient(index, e.currentTarget.value)}
                  placeholder="Enter email address"
                />
                {schedule.recipients.length > 1 && (
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => removeRecipient(index)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                )}
              </Group>
            ))}
            <Button
              variant="subtle"
              leftSection={<IconPlus size={16} />}
              onClick={addRecipient}
              size="sm"
            >
              Add another recipient
            </Button>
          </Stack>

          {/* Format Options */}
          <Select
            label="Report Format"
            value={schedule.format}
            onChange={(value) => setSchedule(prev => ({ ...prev, format: value || 'pdf' }))}
            data={[
              { value: 'pdf', label: 'PDF' },
              { value: 'excel', label: 'Excel' },
              { value: 'csv', label: 'CSV' },
              { value: 'email', label: 'Email Summary' }
            ]}
          />

          {/* Content Options */}
          <Stack gap="xs">
            <Text fw={500} size="sm">Content Options</Text>
            <Checkbox
              label="Include charts and visualizations"
              checked={schedule.includeCharts}
              onChange={(e) => setSchedule(prev => ({ ...prev, includeCharts: e.currentTarget.checked }))}
            />
            <Checkbox
              label="Include raw data tables"
              checked={schedule.includeRawData}
              onChange={(e) => setSchedule(prev => ({ ...prev, includeRawData: e.currentTarget.checked }))}
            />
          </Stack>

          {/* Custom Message */}
          <Textarea
            label="Custom Message (Optional)"
            value={schedule.customMessage}
            onChange={(e) => setSchedule(prev => ({ ...prev, customMessage: e.currentTarget.value }))}
            placeholder="Add a custom message to include with the report..."
            rows={3}
          />

          {/* Preview */}
          <Paper bg="gray.0" p="md">
            <Title order={5} mb="xs">Schedule Preview</Title>
            <Text size="sm" c="dimmed">
              This {reportType} report will be sent {schedule.frequency}
              {schedule.frequency === 'weekly' && ` on ${schedule.dayOfWeek}s`}
              {schedule.frequency === 'monthly' && ` on the ${schedule.dayOfMonth}${schedule.dayOfMonth === 'last' ? '' : getOrdinalSuffix(schedule.dayOfMonth)} of each month`}
              {' '}at {schedule.time} to {schedule.recipients.filter(r => r).length} recipient(s) in {schedule.format.toUpperCase()} format.
            </Text>
          </Paper>

          <Divider />

          {/* Actions */}
          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Report
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
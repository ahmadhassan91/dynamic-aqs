'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  Stack,
  Group,
  Text,
  Switch,
  Select,

  Paper,
  Button,
  Divider,
  Grid,
  Badge,
  Alert,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconClock, IconInfoCircle } from '@tabler/icons-react';
import { 
  NotificationPreferences as INotificationPreferences, 
  NotificationCategory, 
  NotificationPriority 
} from '@/types/notifications';
import { notificationService } from '@/lib/services/notificationService';

interface NotificationPreferencesProps {
  opened: boolean;
  onClose: () => void;
}

export function NotificationPreferences({ opened, onClose }: NotificationPreferencesProps) {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<INotificationPreferences | null>(null);

  const form = useForm<INotificationPreferences>({
    initialValues: {
      id: '',
      userId: '',
      emailNotifications: true,
      pushNotifications: true,
      categories: {
        [NotificationCategory.ORDER]: {
          enabled: true,
          email: true,
          push: true,
          priority: NotificationPriority.HIGH
        },
        [NotificationCategory.TRAINING]: {
          enabled: true,
          email: true,
          push: false,
          priority: NotificationPriority.MEDIUM
        },
        [NotificationCategory.CUSTOMER]: {
          enabled: true,
          email: false,
          push: true,
          priority: NotificationPriority.MEDIUM
        },
        [NotificationCategory.SYSTEM]: {
          enabled: true,
          email: true,
          push: false,
          priority: NotificationPriority.LOW
        },
        [NotificationCategory.LEAD]: {
          enabled: true,
          email: true,
          push: true,
          priority: NotificationPriority.HIGH
        },
        [NotificationCategory.INTEGRATION]: {
          enabled: true,
          email: true,
          push: true,
          priority: NotificationPriority.URGENT
        },
        [NotificationCategory.COMMERCIAL_OPPORTUNITY]: {
          enabled: true,
          email: true,
          push: true,
          priority: NotificationPriority.HIGH
        },
        [NotificationCategory.COMMERCIAL_QUOTE]: {
          enabled: true,
          email: true,
          push: false,
          priority: NotificationPriority.MEDIUM
        },
        [NotificationCategory.COMMERCIAL_ENGINEER]: {
          enabled: true,
          email: false,
          push: true,
          priority: NotificationPriority.MEDIUM
        },
        [NotificationCategory.COMMERCIAL_REP]: {
          enabled: true,
          email: true,
          push: false,
          priority: NotificationPriority.LOW
        }
      },
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '07:00'
      },
      frequency: 'immediate'
    },
  });

  useEffect(() => {
    if (opened) {
      loadPreferences();
    }
  }, [opened]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const prefs = await notificationService.getPreferences();
      if (prefs) {
        setPreferences(prefs);
        form.setValues(prefs);
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load notification preferences',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: INotificationPreferences) => {
    setLoading(true);
    try {
      await notificationService.updatePreferences(values);
      notifications.show({
        title: 'Success',
        message: 'Notification preferences updated successfully',
        color: 'green',
      });
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update notification preferences',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: NotificationCategory) => {
    switch (category) {
      case NotificationCategory.ORDER:
        return 'Orders';
      case NotificationCategory.TRAINING:
        return 'Training';
      case NotificationCategory.CUSTOMER:
        return 'Customers';
      case NotificationCategory.SYSTEM:
        return 'System';
      case NotificationCategory.LEAD:
        return 'Leads';
      case NotificationCategory.INTEGRATION:
        return 'Integration';
      default:
        return category;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return 'red';
      case NotificationPriority.HIGH:
        return 'orange';
      case NotificationPriority.MEDIUM:
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Notification Preferences"
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSave)}>
        <Stack>
          {/* Global Settings */}
          <Paper p="md" withBorder>
            <Text fw={500} mb="md">Global Settings</Text>
            <Stack>
              <Switch
                label="Enable Email Notifications"
                description="Receive notifications via email"
                {...form.getInputProps('emailNotifications', { type: 'checkbox' })}
              />
              <Switch
                label="Enable Push Notifications"
                description="Receive browser push notifications"
                {...form.getInputProps('pushNotifications', { type: 'checkbox' })}
              />
              <Select
                label="Notification Frequency"
                description="How often to receive notification summaries"
                data={[
                  { value: 'immediate', label: 'Immediate' },
                  { value: 'hourly', label: 'Hourly Summary' },
                  { value: 'daily', label: 'Daily Summary' },
                ]}
                {...form.getInputProps('frequency')}
              />
            </Stack>
          </Paper>

          {/* Quiet Hours */}
          <Paper p="md" withBorder>
            <Group mb="md">
              <IconClock size={16} />
              <Text fw={500}>Quiet Hours</Text>
            </Group>
            <Stack>
              <Switch
                label="Enable Quiet Hours"
                description="Suppress notifications during specified hours"
                {...form.getInputProps('quietHours.enabled', { type: 'checkbox' })}
              />
              {form.values.quietHours.enabled && (
                <Grid>
                  <Grid.Col span={6}>
                    <TimeInput
                      label="Start Time"
                      {...form.getInputProps('quietHours.startTime')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TimeInput
                      label="End Time"
                      {...form.getInputProps('quietHours.endTime')}
                    />
                  </Grid.Col>
                </Grid>
              )}
            </Stack>
          </Paper>

          {/* Category Settings */}
          <Paper p="md" withBorder>
            <Text fw={500} mb="md">Category Settings</Text>
            <Stack>
              {Object.entries(form.values.categories).map(([category, settings]) => (
                <Paper key={category} p="sm" withBorder>
                  <Group justify="space-between" mb="sm">
                    <Group>
                      <Text fw={500}>{getCategoryLabel(category as NotificationCategory)}</Text>
                      <Badge
                        size="xs"
                        color={getPriorityColor(settings.priority)}
                        variant="light"
                      >
                        {settings.priority}
                      </Badge>
                    </Group>
                    <Switch
                      size="sm"
                      {...form.getInputProps(`categories.${category}.enabled`, { type: 'checkbox' })}
                    />
                  </Group>
                  
                  {settings.enabled && (
                    <Grid>
                      <Grid.Col span={4}>
                        <Switch
                          label="Email"
                          size="sm"
                          {...form.getInputProps(`categories.${category}.email`, { type: 'checkbox' })}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Switch
                          label="Push"
                          size="sm"
                          {...form.getInputProps(`categories.${category}.push`, { type: 'checkbox' })}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Select
                          label="Priority"
                          size="xs"
                          data={[
                            { value: NotificationPriority.LOW, label: 'Low' },
                            { value: NotificationPriority.MEDIUM, label: 'Medium' },
                            { value: NotificationPriority.HIGH, label: 'High' },
                            { value: NotificationPriority.URGENT, label: 'Urgent' },
                          ]}
                          {...form.getInputProps(`categories.${category}.priority`)}
                        />
                      </Grid.Col>
                    </Grid>
                  )}
                </Paper>
              ))}
            </Stack>
          </Paper>

          <Alert icon={<IconInfoCircle size={16} />} color="blue">
            Changes to notification preferences will take effect immediately. 
            You can always modify these settings later.
          </Alert>

          <Divider />

          <Group justify="flex-end">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Save Preferences
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
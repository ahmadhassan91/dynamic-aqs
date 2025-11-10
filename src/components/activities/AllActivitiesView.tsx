'use client';

import { useState, useEffect } from 'react';
import {
  Title,
  Text,
  Stack,
  Group,
  Card,
  Grid,
  ThemeIcon,
  Select,
  Button,
} from '@mantine/core';
import {
  IconPhone,
  IconMail,
  IconCalendar,
  IconSchool,
  IconNotes,
  IconTrendingUp,
  IconClock,
  IconAlertCircle,
} from '@tabler/icons-react';
import { ActivityTimeline } from './ActivityTimeline';
import { activityService, initializeMockActivities, type Activity } from '@/lib/services/activityService';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import { notifications } from '@mantine/notifications';

export function AllActivitiesView() {
  const { customers, users } = useMockData();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    byType: { call: 0, email: 0, meeting: 0, training: 0, note: 0 },
    byOutcome: { positive: 0, negative: 0, neutral: 0, completed: 0 },
    thisWeek: 0,
    thisMonth: 0,
    followUpsPending: 0,
  });

  useEffect(() => {
    // Initialize mock activities if not already done
    const customerIds = customers.map(c => c.id);
    const customerNames = customers.map(c => c.companyName);
    initializeMockActivities(customerIds, customerNames);
    
    // Get all activities or customer-specific activities
    const allActivities = selectedCustomer 
      ? activityService.getCustomerActivities(selectedCustomer)
      : activityService.getAllActivities();
    
    setActivities(allActivities);
    
    // Get statistics
    const activityStats = activityService.getActivityStats(selectedCustomer || undefined);
    setStats(activityStats);
  }, [customers, selectedCustomer]);

  const handleActivityCreate = (activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newActivity = activityService.createActivity(activityData);
      setActivities(prev => [newActivity, ...prev]);
      
      // Update stats
      const activityStats = activityService.getActivityStats(selectedCustomer || undefined);
      setStats(activityStats);
      
      notifications.show({
        title: 'Activity Logged',
        message: 'Activity has been successfully logged.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to log activity. Please try again.',
        color: 'red',
      });
    }
  };

  const handleActivityUpdate = (id: string, updates: Partial<Activity>) => {
    try {
      const updatedActivity = activityService.updateActivity(id, updates);
      if (updatedActivity) {
        setActivities(prev => 
          prev.map(activity => 
            activity.id === id ? updatedActivity : activity
          )
        );
        
        // Update stats
        const activityStats = activityService.getActivityStats(selectedCustomer || undefined);
        setStats(activityStats);
        
        notifications.show({
          title: 'Activity Updated',
          message: 'Activity has been successfully updated.',
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update activity. Please try again.',
        color: 'red',
      });
    }
  };

  const handleActivityDelete = (id: string) => {
    try {
      const success = activityService.deleteActivity(id);
      if (success) {
        setActivities(prev => prev.filter(activity => activity.id !== id));
        
        // Update stats
        const activityStats = activityService.getActivityStats(selectedCustomer || undefined);
        setStats(activityStats);
        
        notifications.show({
          title: 'Activity Deleted',
          message: 'Activity has been successfully deleted.',
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete activity. Please try again.',
        color: 'red',
      });
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.companyName || 'Unknown Customer';
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="residential-content-container">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Customer Activities</Title>
            <Text c="dimmed" size="lg">
              Track and manage all customer interactions
            </Text>
          </div>
          <Group>
            <Button 
              variant="light" 
              leftSection={<IconTrendingUp size={16} />}
              component="a"
              href="/customers/activities/reports"
            >
              View Reports
            </Button>
            <Select
              placeholder="All Customers"
              data={[
                { value: '', label: 'All Customers' },
                ...customers.map(customer => ({
                  value: customer.id,
                  label: customer.companyName,
                })),
              ]}
              value={selectedCustomer || ''}
              onChange={(value) => setSelectedCustomer(value || null)}
              w={250}
              clearable
            />
          </Group>
        </Group>

        {/* Statistics Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 2.4 }}>
            <Card withBorder p="md" ta="center">
              <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
                <IconTrendingUp size={24} />
              </ThemeIcon>
              <Text size="xl" fw={700} c="blue">
                {formatNumber(stats.total)}
              </Text>
              <Text size="sm" c="dimmed">
                Total Activities
              </Text>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, lg: 2.4 }}>
            <Card withBorder p="md" ta="center">
              <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
                <IconClock size={24} />
              </ThemeIcon>
              <Text size="xl" fw={700} c="green">
                {formatNumber(stats.thisWeek)}
              </Text>
              <Text size="sm" c="dimmed">
                This Week
              </Text>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, lg: 2.4 }}>
            <Card withBorder p="md" ta="center">
              <ThemeIcon color="orange" variant="light" size="xl" mx="auto" mb="sm">
                <IconCalendar size={24} />
              </ThemeIcon>
              <Text size="xl" fw={700} c="orange">
                {formatNumber(stats.thisMonth)}
              </Text>
              <Text size="sm" c="dimmed">
                This Month
              </Text>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, lg: 2.4 }}>
            <Card withBorder p="md" ta="center">
              <ThemeIcon color="red" variant="light" size="xl" mx="auto" mb="sm">
                <IconAlertCircle size={24} />
              </ThemeIcon>
              <Text size="xl" fw={700} c="red">
                {formatNumber(stats.followUpsPending)}
              </Text>
              <Text size="sm" c="dimmed">
                Follow-ups Due
              </Text>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, lg: 2.4 }}>
            <Card withBorder p="md" ta="center">
              <ThemeIcon color="violet" variant="light" size="xl" mx="auto" mb="sm">
                <IconPhone size={24} />
              </ThemeIcon>
              <Text size="xl" fw={700} c="violet">
                {formatNumber(stats.byType.call)}
              </Text>
              <Text size="sm" c="dimmed">
                Phone Calls
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Activity Breakdown */}
        <Grid>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Card withBorder p="lg">
              <Title order={4} mb="md">Activity Types</Title>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon color="blue" variant="light" size="sm">
                      <IconPhone size={14} />
                    </ThemeIcon>
                    <Text size="sm">Phone Calls</Text>
                  </Group>
                  <Text fw={500}>{stats.byType.call}</Text>
                </Group>
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon color="green" variant="light" size="sm">
                      <IconMail size={14} />
                    </ThemeIcon>
                    <Text size="sm">Emails</Text>
                  </Group>
                  <Text fw={500}>{stats.byType.email}</Text>
                </Group>
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon color="orange" variant="light" size="sm">
                      <IconCalendar size={14} />
                    </ThemeIcon>
                    <Text size="sm">Meetings</Text>
                  </Group>
                  <Text fw={500}>{stats.byType.meeting}</Text>
                </Group>
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon color="violet" variant="light" size="sm">
                      <IconSchool size={14} />
                    </ThemeIcon>
                    <Text size="sm">Training</Text>
                  </Group>
                  <Text fw={500}>{stats.byType.training}</Text>
                </Group>
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon color="gray" variant="light" size="sm">
                      <IconNotes size={14} />
                    </ThemeIcon>
                    <Text size="sm">Notes</Text>
                  </Group>
                  <Text fw={500}>{stats.byType.note}</Text>
                </Group>
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon color="teal" variant="light" size="sm">
                      <IconCalendar size={14} />
                    </ThemeIcon>
                    <Text size="sm">Site Visits</Text>
                  </Group>
                  <Text fw={500}>{(stats.byType as any).visit || 0}</Text>
                </Group>
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon color="yellow" variant="light" size="sm">
                      <IconNotes size={14} />
                    </ThemeIcon>
                    <Text size="sm">Quotes</Text>
                  </Group>
                  <Text fw={500}>{(stats.byType as any).quote || 0}</Text>
                </Group>
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon color="red" variant="light" size="sm">
                      <IconCalendar size={14} />
                    </ThemeIcon>
                    <Text size="sm">Orders</Text>
                  </Group>
                  <Text fw={500}>{(stats.byType as any).order || 0}</Text>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Card withBorder p="lg">
              <Title order={4} mb="md">Activity Outcomes</Title>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm" c="green">Positive</Text>
                  <Text fw={500}>{stats.byOutcome.positive}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="blue">Completed</Text>
                  <Text fw={500}>{stats.byOutcome.completed}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="gray">Neutral</Text>
                  <Text fw={500}>{stats.byOutcome.neutral}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="red">Negative</Text>
                  <Text fw={500}>{stats.byOutcome.negative}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="yellow">Pending</Text>
                  <Text fw={500}>{(stats.byOutcome as any).pending || 0}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="orange">Cancelled</Text>
                  <Text fw={500}>{(stats.byOutcome as any).cancelled || 0}</Text>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Activity Timeline */}
        <ActivityTimeline
          customerId={selectedCustomer || undefined}
          activities={activities}
          onActivityCreate={handleActivityCreate}
          onActivityUpdate={handleActivityUpdate}
          onActivityDelete={handleActivityDelete}
          showCustomerFilter={!selectedCustomer}
          showAdvancedSearch={true}
          availableTags={[
            'discovery', 'follow-up', 'proposal', 'product-info',
            'consultation', 'training', 'feedback', 'support',
            'installation', 'maintenance', 'quote', 'order',
            'site-visit', 'assessment', 'technical-support'
          ]}
          availableParticipants={users.map(u => `${u.firstName} ${u.lastName}`)}
          availableCustomers={customers.map(c => ({ 
            value: c.id, 
            label: c.companyName 
          }))}
          availableUsers={users.map(u => ({ 
            value: u.id, 
            label: `${u.firstName} ${u.lastName}` 
          }))}
        />
      </Stack>
    </div>
  );
}
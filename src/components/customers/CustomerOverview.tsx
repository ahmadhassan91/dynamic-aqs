'use client';

import {
  Grid,
  Card,
  Title,
  Text,
  Stack,
  Group,
  Progress,
  ThemeIcon,
  Timeline,
  Badge,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconShoppingCart,
  IconSchool,
  IconCalendar,
  IconCheck,
  IconClock,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import type { MockCustomer } from '@/lib/mockData/generators';

interface CustomerOverviewProps {
  customer: MockCustomer;
}

export function CustomerOverview({ customer }: CustomerOverviewProps) {
  const { orders, trainingSessions } = useMockData();

  // Get customer-specific data
  const customerOrders = orders.filter(order => order.customerId === customer.id);
  const customerTraining = trainingSessions.filter(session => session.customerId === customer.id);

  // Calculate metrics
  const recentOrders = customerOrders
    .filter(order => {
      const orderDate = new Date(order.orderDate);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return orderDate >= sixMonthsAgo;
    })
    .length;

  const completedTraining = customerTraining.filter(session => session.status === 'completed').length;
  const totalTraining = customerTraining.length;
  const trainingProgress = totalTraining > 0 ? (completedTraining / totalTraining) * 100 : 0;

  const upcomingTraining = customerTraining.filter(session => {
    const sessionDate = new Date(session.scheduledDate);
    const now = new Date();
    return sessionDate > now && session.status === 'scheduled';
  });

  const recentActivity = [
    ...customerOrders.slice(0, 3).map(order => ({
      type: 'order',
      title: `Order ${order.orderNumber}`,
      description: `${order.items.length} items - ${formatCurrency(order.totalAmount)}`,
      date: order.orderDate,
      status: order.status,
    })),
    ...customerTraining.slice(0, 3).map(session => ({
      type: 'training',
      title: session.title,
      description: `${session.type} training - ${session.duration} minutes`,
      date: session.scheduledDate,
      status: session.status,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }

  function getActivityIcon(type: string) {
    switch (type) {
      case 'order':
        return <IconShoppingCart size={16} />;
      case 'training':
        return <IconSchool size={16} />;
      default:
        return <IconCalendar size={16} />;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'green';
      case 'scheduled':
      case 'processing':
        return 'blue';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <Stack gap="lg">
          {/* Key Metrics */}
          <Card withBorder p="lg">
            <Title order={3} mb="md">Key Metrics</Title>
            <Grid>
              <Grid.Col span={6}>
                <Group gap="sm">
                  <ThemeIcon color="blue" variant="light" size="lg">
                    <IconShoppingCart size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="xl" fw={700}>
                      {recentOrders}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Orders (6 months)
                    </Text>
                  </div>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="sm">
                  <ThemeIcon color="green" variant="light" size="lg">
                    <IconTrendingUp size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="xl" fw={700}>
                      {formatCurrency(customer.totalRevenue)}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Total Revenue
                    </Text>
                  </div>
                </Group>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Training Progress */}
          <Card withBorder p="lg">
            <Title order={3} mb="md">Training Progress</Title>
            <Stack gap="md">
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Completion Rate</Text>
                  <Text size="sm" fw={500}>
                    {completedTraining}/{totalTraining} sessions
                  </Text>
                </Group>
                <Progress value={trainingProgress} color="blue" size="lg" />
              </div>
              <Group gap="lg">
                <Group gap="sm">
                  <ThemeIcon color="green" variant="light" size="sm">
                    <IconCheck size={14} />
                  </ThemeIcon>
                  <Text size="sm">
                    {completedTraining} Completed
                  </Text>
                </Group>
                <Group gap="sm">
                  <ThemeIcon color="blue" variant="light" size="sm">
                    <IconClock size={14} />
                  </ThemeIcon>
                  <Text size="sm">
                    {upcomingTraining.length} Upcoming
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Card>

          {/* Recent Activity */}
          <Card withBorder p="lg">
            <Title order={3} mb="md">Recent Activity</Title>
            {recentActivity.length > 0 ? (
              <Timeline active={-1} bulletSize={24} lineWidth={2}>
                {recentActivity.map((activity, index) => (
                  <Timeline.Item
                    key={index}
                    bullet={getActivityIcon(activity.type)}
                    title={
                      <Group gap="sm">
                        <Text fw={500}>{activity.title}</Text>
                        <Badge color={getStatusColor(activity.status)} variant="light" size="sm">
                          {activity.status}
                        </Badge>
                      </Group>
                    }
                  >
                    <Text c="dimmed" size="sm">
                      {activity.description}
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      {formatDate(activity.date)}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No recent activity
              </Text>
            )}
          </Card>
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, lg: 4 }}>
        <Stack gap="lg">
          {/* Customer Status */}
          <Card withBorder p="lg">
            <Title order={4} mb="md">Customer Status</Title>
            <Stack gap="md">
              <Group justify="space-between">
                <Text size="sm">Account Status</Text>
                <Badge color={customer.status === 'active' ? 'green' : customer.status === 'prospect' ? 'blue' : 'gray'}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Onboarding</Text>
                <Badge color={
                  customer.onboardingStatus === 'completed' ? 'green' :
                  customer.onboardingStatus === 'in_progress' ? 'yellow' : 'gray'
                }>
                  {customer.onboardingStatus === 'not_started' ? 'Not Started' :
                   customer.onboardingStatus === 'in_progress' ? 'In Progress' : 'Completed'}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Total Orders</Text>
                <Text fw={500}>{customer.totalOrders}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Last Contact</Text>
                <Text size="sm">{formatDate(customer.lastContactDate)}</Text>
              </Group>
            </Stack>
          </Card>

          {/* Upcoming Training */}
          {upcomingTraining.length > 0 && (
            <Card withBorder p="lg">
              <Title order={4} mb="md">Upcoming Training</Title>
              <Stack gap="sm">
                {upcomingTraining.slice(0, 3).map((session) => (
                  <Group key={session.id} justify="space-between">
                    <div>
                      <Text size="sm" fw={500}>
                        {session.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {session.type} - {session.duration}min
                      </Text>
                    </div>
                    <Text size="xs" c="dimmed">
                      {formatDate(session.scheduledDate)}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          )}

          {/* Quick Actions */}
          <Card withBorder p="lg">
            <Title order={4} mb="md">Quick Actions</Title>
            <Stack gap="xs">
              <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>
                Schedule Training Session
              </Text>
              <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>
                Log Customer Interaction
              </Text>
              <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>
                View Order History
              </Text>
              <Text size="sm" c="blue" style={{ cursor: 'pointer' }}>
                Send Follow-up Email
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
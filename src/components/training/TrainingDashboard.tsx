'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Grid,
  Text,
  ThemeIcon,
  Stack,
  Badge,
  Progress,
  SimpleGrid,
  ActionIcon,
  Menu,
  rem,
  Tabs,
} from '@mantine/core';
import {
  IconSchool,
  IconCalendar,
  IconUsers,
  IconCertificate,
  IconTrendingUp,
  IconClock,
  IconPlus,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

export function TrainingDashboard() {
  const { trainingSessions, users, customers } = useMockData();
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    try {
      if (!Array.isArray(trainingSessions)) {
      return {
        totalSessions: 0,
        completedSessions: 0,
        scheduledSessions: 0,
        thisMonthSessions: 0,
        completionRate: 0,
        totalTrainingHours: 0,
        certificationsAwarded: 0,
        averageRating: 0,
        activeTrainers: 0,
      };
    }

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const totalSessions = trainingSessions.length;
    const completedSessions = trainingSessions.filter(s => s.status === 'completed').length;
    const scheduledSessions = trainingSessions.filter(s => s.status === 'scheduled').length;
    const thisMonthSessions = trainingSessions.filter(s => 
      s.scheduledDate >= thisMonth && s.scheduledDate < nextMonth
    ).length;

    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    
    const totalTrainingHours = trainingSessions
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.duration, 0) / 60;

    const certificationsAwarded = trainingSessions
      .filter(s => s.certificationAwarded)
      .length;

    const sessionsWithRatings = trainingSessions.filter(s => s.feedback?.rating);
    const averageRating = sessionsWithRatings.length > 0
      ? sessionsWithRatings.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / sessionsWithRatings.length
      : 0;

    const activeTrainers = new Set(
      trainingSessions
        .filter(s => s.status === 'scheduled' || 
          (s.status === 'completed' && s.completedDate && s.completedDate >= thisMonth))
        .map(s => s.trainerId)
    ).size;

    return {
      totalSessions,
      completedSessions,
      scheduledSessions,
      thisMonthSessions,
      completionRate,
      totalTrainingHours,
      certificationsAwarded,
      averageRating,
      activeTrainers,
    };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      return {
        totalSessions: 0,
        completedSessions: 0,
        scheduledSessions: 0,
        thisMonthSessions: 0,
        completionRate: 0,
        totalTrainingHours: 0,
        certificationsAwarded: 0,
        averageRating: 0,
        activeTrainers: 0,
      };
    }
  }, [trainingSessions]);

  // Get upcoming sessions (next 7 days)
  const upcomingSessions = useMemo(() => {
    if (!Array.isArray(trainingSessions)) return [];
    
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return trainingSessions
      .filter(s => s.status === 'scheduled' && s.scheduledDate >= now && s.scheduledDate <= nextWeek)
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, 5);
  }, [trainingSessions]);

  // Get recent completions
  const recentCompletions = useMemo(() => {
    if (!Array.isArray(trainingSessions)) return [];
    
    return trainingSessions
      .filter(s => s.status === 'completed' && s.completedDate)
      .sort((a, b) => (b.completedDate?.getTime() || 0) - (a.completedDate?.getTime() || 0))
      .slice(0, 5);
  }, [trainingSessions]);

  const getCustomerName = (customerId: string) => {
    if (!Array.isArray(customers)) return 'Unknown Customer';
    const customer = customers.find(c => c.id === customerId);
    return customer?.companyName || 'Unknown Customer';
  };

  const getTrainerName = (trainerId: string) => {
    if (!Array.isArray(users)) return 'Unknown Trainer';
    const trainer = users.find(u => u.id === trainerId);
    return trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown Trainer';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'installation': return 'blue';
      case 'maintenance': return 'orange';
      case 'sales': return 'green';
      case 'product_knowledge': return 'violet';
      default: return 'gray';
    }
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Training Dashboard</Title>
          <Text c="dimmed" size="sm">
            Manage training sessions, track progress, and monitor effectiveness
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />}>
          Schedule Training
        </Button>
      </Group>

      {/* Key Metrics */}
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }}>
        <Card withBorder p="md" ta="center">
          <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
            <IconSchool size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="blue">
            {metrics.totalSessions}
          </Text>
          <Text size="sm" c="dimmed">
            Total Sessions
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
            <IconTrendingUp size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="green">
            {metrics.completionRate.toFixed(1)}%
          </Text>
          <Text size="sm" c="dimmed">
            Completion Rate
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="orange" variant="light" size="xl" mx="auto" mb="sm">
            <IconClock size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="orange">
            {metrics.totalTrainingHours.toFixed(0)}h
          </Text>
          <Text size="sm" c="dimmed">
            Training Hours
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="violet" variant="light" size="xl" mx="auto" mb="sm">
            <IconCertificate size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="violet">
            {metrics.certificationsAwarded}
          </Text>
          <Text size="sm" c="dimmed">
            Certifications
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="teal" variant="light" size="xl" mx="auto" mb="sm">
            <IconUsers size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="teal">
            {metrics.activeTrainers}
          </Text>
          <Text size="sm" c="dimmed">
            Active Trainers
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="yellow" variant="light" size="xl" mx="auto" mb="sm">
            <IconCalendar size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="yellow">
            {metrics.thisMonthSessions}
          </Text>
          <Text size="sm" c="dimmed">
            This Month
          </Text>
        </Card>
      </SimpleGrid>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconSchool size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="upcoming" leftSection={<IconCalendar size={16} />}>
            Upcoming Sessions
          </Tabs.Tab>
          <Tabs.Tab value="recent" leftSection={<IconClock size={16} />}>
            Recent Completions
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="lg">
          <Grid>
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Training Progress Overview</Title>
                <Stack gap="md">
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Overall Completion Rate</Text>
                      <Text size="sm" fw={500}>{metrics.completionRate.toFixed(1)}%</Text>
                    </Group>
                    <Progress value={metrics.completionRate} color="blue" size="lg" />
                  </div>
                  
                  <SimpleGrid cols={2}>
                    <div>
                      <Text size="sm" c="dimmed">Completed Sessions</Text>
                      <Text size="lg" fw={700} c="green">{metrics.completedSessions}</Text>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed">Scheduled Sessions</Text>
                      <Text size="lg" fw={700} c="blue">{metrics.scheduledSessions}</Text>
                    </div>
                  </SimpleGrid>

                  <div>
                    <Text size="sm" c="dimmed" mb="xs">Average Session Rating</Text>
                    <Group gap="xs">
                      <Text size="lg" fw={700} c="yellow">
                        {metrics.averageRating.toFixed(1)}/5.0
                      </Text>
                      <Progress 
                        value={(metrics.averageRating / 5) * 100} 
                        color="yellow" 
                        size="sm" 
                        style={{ flex: 1 }}
                      />
                    </Group>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Quick Actions</Title>
                <Stack gap="sm">
                  <Button variant="light" leftSection={<IconPlus size={16} />} fullWidth>
                    Schedule New Training
                  </Button>
                  <Button variant="light" leftSection={<IconCalendar size={16} />} fullWidth>
                    View Calendar
                  </Button>
                  <Button variant="light" leftSection={<IconUsers size={16} />} fullWidth>
                    Manage Trainers
                  </Button>
                  <Button variant="light" leftSection={<IconCertificate size={16} />} fullWidth>
                    View Certifications
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="upcoming" pt="lg">
          <Card withBorder>
            <Card.Section withBorder inheritPadding py="md">
              <Group justify="space-between">
                <Title order={4}>Upcoming Training Sessions</Title>
                <Text size="sm" c="dimmed">Next 7 days</Text>
              </Group>
            </Card.Section>

            <Card.Section inheritPadding py="md">
              {upcomingSessions.length === 0 ? (
                <Text ta="center" c="dimmed" py="xl">
                  No upcoming training sessions scheduled
                </Text>
              ) : (
                <Stack gap="md">
                  {upcomingSessions.map((session) => (
                    <Group key={session.id} justify="space-between" p="md" style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: 'var(--mantine-radius-md)' }}>
                      <div style={{ flex: 1 }}>
                        <Group gap="sm" mb="xs">
                          <Text fw={500}>{session.title}</Text>
                          <Badge color={getTypeColor(session.type)} variant="light" size="sm">
                            {session.type.replace('_', ' ')}
                          </Badge>
                        </Group>
                        <Text size="sm" c="dimmed" mb="xs">
                          {getCustomerName(session.customerId)} • {getTrainerName(session.trainerId)}
                        </Text>
                        <Group gap="md">
                          <Text size="sm">
                            <IconCalendar size={14} style={{ marginRight: 4 }} />
                            {formatDate(session.scheduledDate)}
                          </Text>
                          <Text size="sm">
                            <IconClock size={14} style={{ marginRight: 4 }} />
                            {formatDuration(session.duration)}
                          </Text>
                          <Text size="sm">
                            <IconUsers size={14} style={{ marginRight: 4 }} />
                            {session.attendees.length} attendees
                          </Text>
                        </Group>
                      </div>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                            View Details
                          </Menu.Item>
                          <Menu.Item leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                            Edit Session
                          </Menu.Item>
                          <Menu.Item 
                            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                            color="red"
                          >
                            Cancel Session
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  ))}
                </Stack>
              )}
            </Card.Section>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="recent" pt="lg">
          <Card withBorder>
            <Card.Section withBorder inheritPadding py="md">
              <Title order={4}>Recent Completions</Title>
            </Card.Section>

            <Card.Section inheritPadding py="md">
              {recentCompletions.length === 0 ? (
                <Text ta="center" c="dimmed" py="xl">
                  No recent training completions
                </Text>
              ) : (
                <Stack gap="md">
                  {recentCompletions.map((session) => (
                    <Group key={session.id} justify="space-between" p="md" style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: 'var(--mantine-radius-md)' }}>
                      <div style={{ flex: 1 }}>
                        <Group gap="sm" mb="xs">
                          <Text fw={500}>{session.title}</Text>
                          <Badge color={getTypeColor(session.type)} variant="light" size="sm">
                            {session.type.replace('_', ' ')}
                          </Badge>
                          {session.certificationAwarded && (
                            <Badge color="gold" variant="light" size="sm">
                              <IconCertificate size={12} style={{ marginRight: 4 }} />
                              Certified
                            </Badge>
                          )}
                        </Group>
                        <Text size="sm" c="dimmed" mb="xs">
                          {getCustomerName(session.customerId)} • {getTrainerName(session.trainerId)}
                        </Text>
                        <Group gap="md">
                          <Text size="sm">
                            Completed: {session.completedDate ? formatDate(session.completedDate) : 'N/A'}
                          </Text>
                          <Text size="sm">
                            Duration: {formatDuration(session.duration)}
                          </Text>
                          {session.feedback?.rating && (
                            <Text size="sm">
                              Rating: {session.feedback.rating}/5
                            </Text>
                          )}
                        </Group>
                      </div>
                      <ActionIcon variant="subtle">
                        <IconEye size={16} />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              )}
            </Card.Section>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
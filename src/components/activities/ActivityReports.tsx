'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Grid,
  Select,
  Button,
  ThemeIcon,
  Progress,
  Table,
  Badge,
  ActionIcon,
  Modal,
  Tabs,
  RingProgress,
  Divider,
  Alert,
  NumberInput,
  Switch,
} from '@mantine/core';
import { BarChart, LineChart, AreaChart, DonutChart } from '@mantine/charts';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconCalendar,
  IconUsers,
  IconPhone,
  IconMail,
  IconSchool,
  IconNotes,
  IconDownload,
  IconPrinter,
  IconShare,
  IconFilter,
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconTarget,
  IconClock,
  IconAlertCircle,
  IconInfoCircle,
} from '@tabler/icons-react';
import type { Activity } from './ActivityTimeline';
import { ActivityAnalyticsService } from '@/lib/services/activityAnalytics';

interface ActivityReportsProps {
  activities: Activity[];
  customers?: { id: string; companyName: string }[];
  users?: { id: string; name: string }[];
}

interface ReportMetrics {
  totalActivities: number;
  activitiesThisWeek: number;
  activitiesThisMonth: number;
  averageActivitiesPerDay: number;
  followUpsPending: number;
  completionRate: number;
  responseTime: number;
  customerEngagement: number;
  activityTrends: Array<{ date: string; count: number }>;
  typeDistribution: Array<{ type: string; count: number; percentage: number }>;
  outcomeDistribution: Array<{ outcome: string; count: number; percentage: number }>;
  categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
  priorityDistribution: Array<{ priority: string; count: number; percentage: number }>;
  userPerformance: Array<{ user: string; activities: number; completionRate: number }>;
  customerActivity: Array<{ customer: string; activities: number; lastActivity: Date }>;
  timeAnalysis: Array<{ hour: number; count: number }>;
  durationAnalysis: { average: number; median: number; total: number };
}

export function ActivityReports({ activities, customers = [], users = [] }: ActivityReportsProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    new Date(),
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [reportType, setReportType] = useState<'overview' | 'performance' | 'trends' | 'compliance'>('overview');
  const [exportModalOpened, { open: openExportModal, close: closeExportModal }] = useDisclosure(false);

  const exportForm = useForm({
    initialValues: {
      format: 'pdf',
      includeCharts: true,
      includeDetails: false,
      dateRange: 'current',
    },
  });

  // Filter activities based on selected criteria
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      
      // Date range filter
      if (dateRange[0] && activityDate < dateRange[0]) return false;
      if (dateRange[1] && activityDate > dateRange[1]) return false;
      
      // Customer filter
      if (selectedCustomer && activity.customerId !== selectedCustomer) return false;
      
      // User filter
      if (selectedUser && activity.createdBy !== selectedUser) return false;
      
      return true;
    });
  }, [activities, dateRange, selectedCustomer, selectedUser]);

  // Calculate comprehensive metrics
  const metrics = useMemo((): ReportMetrics => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Basic counts
    const totalActivities = filteredActivities.length;
    const activitiesThisWeek = filteredActivities.filter(a => new Date(a.date) >= weekAgo).length;
    const activitiesThisMonth = filteredActivities.filter(a => new Date(a.date) >= monthAgo).length;
    
    // Calculate average activities per day
    const daysDiff = dateRange[0] && dateRange[1] 
      ? Math.ceil((dateRange[1].getTime() - dateRange[0].getTime()) / (1000 * 60 * 60 * 24))
      : 30;
    const averageActivitiesPerDay = totalActivities / daysDiff;

    // Follow-ups and completion metrics
    const followUpsPending = filteredActivities.filter(a => 
      a.followUpRequired && a.followUpDate && new Date(a.followUpDate) <= now
    ).length;
    
    const completedActivities = filteredActivities.filter(a => 
      a.outcome === 'completed' || a.outcome === 'positive'
    ).length;
    const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

    // Response time (mock calculation)
    const responseTime = 2.5; // hours average

    // Customer engagement (activities per customer)
    const uniqueCustomers = new Set(filteredActivities.map(a => a.customerId)).size;
    const customerEngagement = uniqueCustomers > 0 ? totalActivities / uniqueCustomers : 0;

    // Activity trends (daily counts over date range)
    const activityTrends: Array<{ date: string; count: number }> = [];
    const startDate = dateRange[0] || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const endDate = dateRange[1] || now;
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const count = filteredActivities.filter(a => 
        a.date.toISOString().split('T')[0] === dateStr
      ).length;
      activityTrends.push({ date: dateStr, count });
    }

    // Type distribution
    const typeCounts = filteredActivities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const typeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: (count / totalActivities) * 100,
    }));

    // Outcome distribution
    const outcomeCounts = filteredActivities.reduce((acc, activity) => {
      acc[activity.outcome] = (acc[activity.outcome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const outcomeDistribution = Object.entries(outcomeCounts).map(([outcome, count]) => ({
      outcome,
      count,
      percentage: (count / totalActivities) * 100,
    }));

    // Category distribution
    const categoryCounts = filteredActivities.reduce((acc, activity) => {
      const category = activity.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      percentage: (count / totalActivities) * 100,
    }));

    // Priority distribution
    const priorityCounts = filteredActivities.reduce((acc, activity) => {
      const priority = activity.priority || 'medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const priorityDistribution = Object.entries(priorityCounts).map(([priority, count]) => ({
      priority,
      count,
      percentage: (count / totalActivities) * 100,
    }));

    // User performance
    const userCounts = filteredActivities.reduce((acc, activity) => {
      acc[activity.createdBy] = (acc[activity.createdBy] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const userPerformance = Object.entries(userCounts).map(([userId, count]) => {
      const userActivities = filteredActivities.filter(a => a.createdBy === userId);
      const userCompleted = userActivities.filter(a => 
        a.outcome === 'completed' || a.outcome === 'positive'
      ).length;
      const userCompletionRate = count > 0 ? (userCompleted / count) * 100 : 0;
      
      const user = users.find(u => u.id === userId);
      return {
        user: user?.name || userId,
        activities: count,
        completionRate: userCompletionRate,
      };
    });

    // Customer activity
    const customerCounts = filteredActivities.reduce((acc, activity) => {
      if (!acc[activity.customerId]) {
        acc[activity.customerId] = {
          count: 0,
          lastActivity: activity.date,
        };
      }
      acc[activity.customerId].count++;
      if (activity.date > acc[activity.customerId].lastActivity) {
        acc[activity.customerId].lastActivity = activity.date;
      }
      return acc;
    }, {} as Record<string, { count: number; lastActivity: Date }>);
    
    const customerActivity = Object.entries(customerCounts).map(([customerId, data]) => {
      const customer = customers.find(c => c.id === customerId);
      return {
        customer: customer?.companyName || customerId,
        activities: data.count,
        lastActivity: data.lastActivity,
      };
    });

    // Time analysis (activities by hour of day)
    const hourCounts = Array(24).fill(0);
    filteredActivities.forEach(activity => {
      const hour = new Date(activity.date).getHours();
      hourCounts[hour]++;
    });
    
    const timeAnalysis = hourCounts.map((count, hour) => ({ hour, count }));

    // Duration analysis
    const durationsWithValues = filteredActivities
      .filter(a => a.duration && a.duration > 0)
      .map(a => a.duration!);
    
    const totalDuration = durationsWithValues.reduce((sum, duration) => sum + duration, 0);
    const averageDuration = durationsWithValues.length > 0 
      ? totalDuration / durationsWithValues.length 
      : 0;
    
    const sortedDurations = [...durationsWithValues].sort((a, b) => a - b);
    const medianDuration = sortedDurations.length > 0
      ? sortedDurations[Math.floor(sortedDurations.length / 2)]
      : 0;

    return {
      totalActivities,
      activitiesThisWeek,
      activitiesThisMonth,
      averageActivitiesPerDay,
      followUpsPending,
      completionRate,
      responseTime,
      customerEngagement,
      activityTrends,
      typeDistribution,
      outcomeDistribution,
      categoryDistribution,
      priorityDistribution,
      userPerformance,
      customerActivity,
      timeAnalysis,
      durationAnalysis: {
        average: averageDuration,
        median: medianDuration,
        total: totalDuration,
      },
    };
  }, [filteredActivities, dateRange, customers, users]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <IconPhone size={16} />;
      case 'email': return <IconMail size={16} />;
      case 'meeting': return <IconCalendar size={16} />;
      case 'training': return <IconSchool size={16} />;
      default: return <IconNotes size={16} />;
    }
  };

  const handleExport = (values: typeof exportForm.values) => {
    // In a real app, this would generate and download the report
    console.log('Exporting report with options:', values);
    closeExportModal();
  };

  return (
    <Stack gap="lg">
      {/* Header and Controls */}
      <Card withBorder p="md">
        <Group justify="space-between" mb="md">
          <Title order={2}>Activity Reports & Analytics</Title>
          <Group>
            <Button variant="light" leftSection={<IconDownload size={16} />} onClick={openExportModal}>
              Export Report
            </Button>
            <Button variant="light" leftSection={<IconPrinter size={16} />}>
              Print
            </Button>
            <Button variant="light" leftSection={<IconShare size={16} />}>
              Share
            </Button>
          </Group>
        </Group>

        {/* Filters */}
        <Group gap="md">
          <DatePickerInput
            type="range"
            label="Date Range"
            placeholder="Select date range"
            value={dateRange}
            onChange={(value) => setDateRange(value as [Date | null, Date | null])}
            w={250}
          />
          <Select
            label="Customer"
            placeholder="All Customers"
            data={[
              { value: '', label: 'All Customers' },
              ...customers.map(c => ({ value: c.id, label: c.companyName })),
            ]}
            value={selectedCustomer || ''}
            onChange={setSelectedCustomer}
            w={200}
            clearable
          />
          <Select
            label="User"
            placeholder="All Users"
            data={[
              { value: '', label: 'All Users' },
              ...users.map(u => ({ value: u.id, label: u.name })),
            ]}
            value={selectedUser || ''}
            onChange={setSelectedUser}
            w={200}
            clearable
          />
        </Group>
      </Card>

      {/* Key Performance Indicators */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
              <IconTrendingUp size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="blue">
              {formatNumber(metrics.totalActivities)}
            </Text>
            <Text size="sm" c="dimmed">Total Activities</Text>
            <Text size="xs" c="green" mt="xs">
              +{formatNumber(metrics.activitiesThisWeek)} this week
            </Text>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
              <IconTarget size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="green">
              {metrics.completionRate.toFixed(1)}%
            </Text>
            <Text size="sm" c="dimmed">Completion Rate</Text>
            <Progress value={metrics.completionRate} size="sm" mt="xs" />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="violet" variant="light" size="xl" mx="auto" mb="sm">
              <IconChartBar size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="violet">
              {ActivityAnalyticsService.calculatePerformanceScore(filteredActivities)}
            </Text>
            <Text size="sm" c="dimmed">Performance Score</Text>
            <Progress 
              value={ActivityAnalyticsService.calculatePerformanceScore(filteredActivities)} 
              size="sm" 
              mt="xs" 
              color="violet"
            />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="red" variant="light" size="xl" mx="auto" mb="sm">
              <IconAlertCircle size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="red">
              {formatNumber(metrics.followUpsPending)}
            </Text>
            <Text size="sm" c="dimmed">Follow-ups Due</Text>
            <Text size="xs" c="dimmed" mt="xs">
              {metrics.customerEngagement.toFixed(1)} per customer
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Analytics Insights */}
      {(() => {
        const insights = ActivityAnalyticsService.generateInsights(filteredActivities);
        const kpis = ActivityAnalyticsService.calculateKPIs(filteredActivities);
        const benchmarks = ActivityAnalyticsService.getBenchmarks(filteredActivities);
        
        return insights.length > 0 && (
          <Card withBorder p="lg">
            <Title order={4} mb="md">Key Insights & Recommendations</Title>
            <Grid>
              {insights.slice(0, 3).map((insight, index) => (
                <Grid.Col key={index} span={{ base: 12, lg: 4 }}>
                  <Alert
                    icon={
                      insight.type === 'success' ? <IconTarget size={16} /> :
                      insight.type === 'warning' ? <IconAlertCircle size={16} /> :
                      insight.type === 'error' ? <IconAlertCircle size={16} /> :
                      <IconInfoCircle size={16} />
                    }
                    color={
                      insight.type === 'success' ? 'green' :
                      insight.type === 'warning' ? 'yellow' :
                      insight.type === 'error' ? 'red' : 'blue'
                    }
                    title={insight.title}
                  >
                    <Text size="sm" mb="xs">{insight.description}</Text>
                    {insight.recommendation && (
                      <Text size="xs" c="dimmed" fs="italic">
                        💡 {insight.recommendation}
                      </Text>
                    )}
                  </Alert>
                </Grid.Col>
              ))}
            </Grid>
          </Card>
        );
      })()}

      {/* Report Tabs */}
      <Tabs value={reportType} onChange={(value) => setReportType(value as any)}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="performance" leftSection={<IconTrendingUp size={16} />}>
            Performance
          </Tabs.Tab>
          <Tabs.Tab value="trends" leftSection={<IconChartLine size={16} />}>
            Trends
          </Tabs.Tab>
          <Tabs.Tab value="compliance" leftSection={<IconTarget size={16} />}>
            Compliance
          </Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview">
          <Grid mt="md">
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Activity Distribution by Type</Title>
                <DonutChart
                  data={metrics.typeDistribution.map(item => ({
                    name: item.type,
                    value: item.count,
                    color: item.type === 'call' ? 'blue' : 
                           item.type === 'email' ? 'green' :
                           item.type === 'meeting' ? 'orange' :
                           item.type === 'training' ? 'violet' : 'gray'
                  }))}
                  thickness={30}
                  size={200}
                  mx="auto"
                />
                <Stack gap="xs" mt="md">
                  {metrics.typeDistribution.map((item) => (
                    <Group key={item.type} justify="space-between">
                      <Group gap="xs">
                        {getActivityTypeIcon(item.type)}
                        <Text size="sm" tt="capitalize">{item.type}</Text>
                      </Group>
                      <Group gap="xs">
                        <Text size="sm" fw={500}>{item.count}</Text>
                        <Text size="xs" c="dimmed">({item.percentage.toFixed(1)}%)</Text>
                      </Group>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Outcome Analysis</Title>
                <RingProgress
                  size={200}
                  thickness={20}
                  sections={metrics.outcomeDistribution.map(item => ({
                    value: item.percentage,
                    color: item.outcome === 'positive' ? 'green' :
                           item.outcome === 'completed' ? 'blue' :
                           item.outcome === 'negative' ? 'red' :
                           item.outcome === 'pending' ? 'yellow' : 'gray',
                    tooltip: `${item.outcome}: ${item.count} (${item.percentage.toFixed(1)}%)`
                  }))}
                  label={
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xs" c="dimmed">Success Rate</Text>
                      <Text size="lg" fw={700}>
                        {metrics.completionRate.toFixed(1)}%
                      </Text>
                    </div>
                  }
                />
                <Stack gap="xs" mt="md">
                  {metrics.outcomeDistribution.map((item) => (
                    <Group key={item.outcome} justify="space-between">
                      <Badge 
                        variant="light" 
                        color={item.outcome === 'positive' ? 'green' :
                               item.outcome === 'completed' ? 'blue' :
                               item.outcome === 'negative' ? 'red' :
                               item.outcome === 'pending' ? 'yellow' : 'gray'}
                        size="sm"
                      >
                        {item.outcome}
                      </Badge>
                      <Group gap="xs">
                        <Text size="sm" fw={500}>{item.count}</Text>
                        <Text size="xs" c="dimmed">({item.percentage.toFixed(1)}%)</Text>
                      </Group>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* Performance Tab */}
        <Tabs.Panel value="performance">
          <Grid mt="md">
            <Grid.Col span={12}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">User Performance</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>User</Table.Th>
                      <Table.Th>Activities</Table.Th>
                      <Table.Th>Completion Rate</Table.Th>
                      <Table.Th>Performance</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {metrics.userPerformance
                      .sort((a, b) => b.activities - a.activities)
                      .map((user) => (
                        <Table.Tr key={user.user}>
                          <Table.Td>{user.user}</Table.Td>
                          <Table.Td>{user.activities}</Table.Td>
                          <Table.Td>{user.completionRate.toFixed(1)}%</Table.Td>
                          <Table.Td>
                            <Progress 
                              value={user.completionRate} 
                              size="sm" 
                              color={user.completionRate >= 80 ? 'green' : 
                                     user.completionRate >= 60 ? 'yellow' : 'red'}
                            />
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={12}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Customer Engagement</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Activities</Table.Th>
                      <Table.Th>Last Activity</Table.Th>
                      <Table.Th>Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {metrics.customerActivity
                      .sort((a, b) => b.activities - a.activities)
                      .slice(0, 10)
                      .map((customer) => {
                        const daysSinceLastActivity = Math.floor(
                          (Date.now() - customer.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
                        );
                        return (
                          <Table.Tr key={customer.customer}>
                            <Table.Td>{customer.customer}</Table.Td>
                            <Table.Td>{customer.activities}</Table.Td>
                            <Table.Td>
                              {customer.lastActivity.toLocaleDateString()}
                            </Table.Td>
                            <Table.Td>
                              <Badge 
                                color={daysSinceLastActivity <= 7 ? 'green' : 
                                       daysSinceLastActivity <= 30 ? 'yellow' : 'red'}
                                variant="light"
                                size="sm"
                              >
                                {daysSinceLastActivity <= 7 ? 'Active' : 
                                 daysSinceLastActivity <= 30 ? 'Moderate' : 'Inactive'}
                              </Badge>
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* Trends Tab */}
        <Tabs.Panel value="trends">
          <Grid mt="md">
            <Grid.Col span={12}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Activity Trends Over Time</Title>
                <AreaChart
                  h={300}
                  data={metrics.activityTrends.map(item => ({
                    date: new Date(item.date).toLocaleDateString(),
                    activities: item.count,
                  }))}
                  dataKey="date"
                  series={[{ name: 'activities', color: 'blue.6' }]}
                  curveType="monotone"
                />
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Activity by Time of Day</Title>
                <BarChart
                  h={250}
                  data={metrics.timeAnalysis.map(item => ({
                    hour: `${item.hour}:00`,
                    count: item.count,
                  }))}
                  dataKey="hour"
                  series={[{ name: 'count', color: 'orange.6' }]}
                />
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Duration Analysis</Title>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text size="sm">Average Duration</Text>
                    <Text fw={500}>{formatDuration(metrics.durationAnalysis.average)}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Median Duration</Text>
                    <Text fw={500}>{formatDuration(metrics.durationAnalysis.median)}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Total Time Spent</Text>
                    <Text fw={500}>{formatDuration(metrics.durationAnalysis.total)}</Text>
                  </Group>
                  <Divider />
                  <Alert icon={<IconInfoCircle size={16} />} color="blue">
                    Activities with duration tracking: {
                      filteredActivities.filter(a => a.duration && a.duration > 0).length
                    } of {filteredActivities.length}
                  </Alert>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* Compliance Tab */}
        <Tabs.Panel value="compliance">
          <Grid mt="md">
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Follow-up Compliance</Title>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text size="sm">Follow-ups Required</Text>
                    <Text fw={500}>
                      {filteredActivities.filter(a => a.followUpRequired).length}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Follow-ups Overdue</Text>
                    <Text fw={500} c="red">
                      {metrics.followUpsPending}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Compliance Rate</Text>
                    <Text fw={500} c="green">
                      {(((filteredActivities.filter(a => a.followUpRequired).length - metrics.followUpsPending) / 
                         Math.max(filteredActivities.filter(a => a.followUpRequired).length, 1)) * 100).toFixed(1)}%
                    </Text>
                  </Group>
                  <Progress 
                    value={((filteredActivities.filter(a => a.followUpRequired).length - metrics.followUpsPending) / 
                            Math.max(filteredActivities.filter(a => a.followUpRequired).length, 1)) * 100}
                    size="lg"
                    color="green"
                  />
                </Stack>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Priority Distribution</Title>
                <Stack gap="xs">
                  {metrics.priorityDistribution.map((item) => (
                    <Group key={item.priority} justify="space-between">
                      <Badge 
                        variant="filled" 
                        color={item.priority === 'urgent' ? 'red' :
                               item.priority === 'high' ? 'orange' :
                               item.priority === 'medium' ? 'blue' : 'gray'}
                        size="sm"
                        tt="capitalize"
                      >
                        {item.priority}
                      </Badge>
                      <Group gap="xs">
                        <Text size="sm" fw={500}>{item.count}</Text>
                        <Text size="xs" c="dimmed">({item.percentage.toFixed(1)}%)</Text>
                      </Group>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={12}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Category Performance</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Category</Table.Th>
                      <Table.Th>Activities</Table.Th>
                      <Table.Th>Percentage</Table.Th>
                      <Table.Th>Success Rate</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {metrics.categoryDistribution.map((category) => {
                      const categoryActivities = filteredActivities.filter(a => 
                        (a.category || 'uncategorized') === category.category
                      );
                      const successfulActivities = categoryActivities.filter(a => 
                        a.outcome === 'completed' || a.outcome === 'positive'
                      );
                      const successRate = categoryActivities.length > 0 
                        ? (successfulActivities.length / categoryActivities.length) * 100 
                        : 0;
                      
                      return (
                        <Table.Tr key={category.category}>
                          <Table.Td>
                            <Text tt="capitalize">{category.category}</Text>
                          </Table.Td>
                          <Table.Td>{category.count}</Table.Td>
                          <Table.Td>{category.percentage.toFixed(1)}%</Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Text size="sm">{successRate.toFixed(1)}%</Text>
                              <Progress 
                                value={successRate} 
                                size="sm" 
                                w={100}
                                color={successRate >= 80 ? 'green' : 
                                       successRate >= 60 ? 'yellow' : 'red'}
                              />
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>

      {/* Export Modal */}
      <Modal
        opened={exportModalOpened}
        onClose={closeExportModal}
        title="Export Activity Report"
        size="md"
      >
        <form onSubmit={exportForm.onSubmit(handleExport)}>
          <Stack gap="md">
            <Select
              label="Export Format"
              data={[
                { value: 'pdf', label: 'PDF Document' },
                { value: 'excel', label: 'Excel Spreadsheet' },
                { value: 'csv', label: 'CSV File' },
                { value: 'json', label: 'JSON Data' },
              ]}
              {...exportForm.getInputProps('format')}
              required
            />
            
            <Select
              label="Date Range"
              data={[
                { value: 'current', label: 'Current Selection' },
                { value: 'week', label: 'Last 7 Days' },
                { value: 'month', label: 'Last 30 Days' },
                { value: 'quarter', label: 'Last 90 Days' },
                { value: 'year', label: 'Last 365 Days' },
              ]}
              {...exportForm.getInputProps('dateRange')}
              required
            />
            
            <Switch
              label="Include Charts and Visualizations"
              {...exportForm.getInputProps('includeCharts', { type: 'checkbox' })}
            />
            
            <Switch
              label="Include Detailed Activity List"
              {...exportForm.getInputProps('includeDetails', { type: 'checkbox' })}
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeExportModal}>
                Cancel
              </Button>
              <Button type="submit" leftSection={<IconDownload size={16} />}>
                Export Report
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
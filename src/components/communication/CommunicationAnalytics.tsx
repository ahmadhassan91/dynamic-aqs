'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  Group,
  Text,
  Paper,
  Grid,
  Card,
  RingProgress,
  Select,
  Badge,
  Table,
  Progress,
  Alert,
} from '@mantine/core';
import { BarChart, LineChart } from '@mantine/charts';
import {
  IconTrendingUp,
  IconClock,
  IconCheckbox,
  IconAlertTriangle,
  IconInfoCircle,
} from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { 
  CommunicationAnalytics as ICommunicationAnalytics,
  CommunicationType,
  CommunicationStatus,
  CommunicationPriority 
} from '@/types/communication';
import { communicationService } from '@/lib/services/communicationService';

export function CommunicationAnalytics() {
  const [analytics, setAnalytics] = useState<ICommunicationAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const range = dateRange.start && dateRange.end ? {
        start: dateRange.start,
        end: dateRange.end,
      } : undefined;
      
      const data = await communicationService.getAnalytics(range);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: CommunicationType) => {
    switch (type) {
      case CommunicationType.EMAIL:
        return 'blue';
      case CommunicationType.PHONE_CALL:
        return 'green';
      case CommunicationType.MEETING:
        return 'purple';
      case CommunicationType.SMS:
        return 'cyan';
      case CommunicationType.NOTE:
        return 'gray';
      case CommunicationType.TASK:
        return 'orange';
      case CommunicationType.TRAINING:
        return 'teal';
      case CommunicationType.VISIT:
        return 'red';
      case CommunicationType.FOLLOW_UP:
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: CommunicationStatus) => {
    switch (status) {
      case CommunicationStatus.PENDING:
        return 'yellow';
      case CommunicationStatus.IN_PROGRESS:
        return 'blue';
      case CommunicationStatus.COMPLETED:
        return 'green';
      case CommunicationStatus.CANCELLED:
        return 'gray';
      case CommunicationStatus.OVERDUE:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: CommunicationPriority) => {
    switch (priority) {
      case CommunicationPriority.LOW:
        return 'gray';
      case CommunicationPriority.MEDIUM:
        return 'blue';
      case CommunicationPriority.HIGH:
        return 'orange';
      case CommunicationPriority.URGENT:
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatLabel = (key: string) => {
    return key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!analytics) {
    return (
      <Stack>
        <Text size="xl" fw={600}>Communication Analytics</Text>
        <Paper p="xl" ta="center">
          <Text c="dimmed">Loading analytics...</Text>
        </Paper>
      </Stack>
    );
  }

  // Prepare chart data
  const typeChartData = Object.entries(analytics.byType)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      type: formatLabel(type),
      count,
      color: getTypeColor(type as CommunicationType),
    }));

  const statusChartData = Object.entries(analytics.byStatus)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      status: formatLabel(status),
      count,
      color: getStatusColor(status as CommunicationStatus),
    }));

  const trendsChartData = analytics.trendsData.reduce((acc, item) => {
    const existing = acc.find(d => d.date === item.date);
    if (existing) {
      existing[item.type] = item.count;
    } else {
      acc.push({
        date: item.date,
        [item.type]: item.count,
      });
    }
    return acc;
  }, [] as any[]);

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl" fw={600}>Communication Analytics</Text>
        <Group>
          <DatePickerInput
            label="From"
            placeholder="Start date"
            value={dateRange.start}
            onChange={(value) => setDateRange(prev => ({ ...prev, start: value as Date | null }))}
            size="sm"
          />
          <DatePickerInput
            label="To"
            placeholder="End date"
            value={dateRange.end}
            onChange={(value) => setDateRange(prev => ({ ...prev, end: value as Date | null }))}
            size="sm"
          />
        </Group>
      </Group>

      {/* Key Metrics */}
      <Grid>
        <Grid.Col span={3}>
          <Card withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Total Communications
                </Text>
                <Text fw={700} size="xl">
                  {analytics.totalCommunications}
                </Text>
              </div>
              <IconTrendingUp size={32} color="blue" />
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Completion Rate
                </Text>
                <Text fw={700} size="xl">
                  {analytics.completionRate.toFixed(1)}%
                </Text>
              </div>
              <RingProgress
                size={60}
                roundCaps
                thickness={6}
                sections={[{ value: analytics.completionRate, color: 'green' }]}
              />
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Avg Response Time
                </Text>
                <Text fw={700} size="xl">
                  {analytics.averageResponseTime.toFixed(1)}h
                </Text>
              </div>
              <IconClock size={32} color="orange" />
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Overdue Items
                </Text>
                <Text fw={700} size="xl" c={analytics.overdueCount > 0 ? 'red' : 'green'}>
                  {analytics.overdueCount}
                </Text>
              </div>
              <IconAlertTriangle 
                size={32} 
                color={analytics.overdueCount > 0 ? 'red' : 'gray'} 
              />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Charts */}
      <Grid>
        <Grid.Col span={6}>
          <Paper p="md" withBorder>
            <Text fw={500} mb="md">Communications by Type</Text>
            <BarChart
              h={300}
              data={typeChartData}
              dataKey="type"
              series={[{ name: 'count', color: 'blue' }]}
              tickLine="none"
              gridAxis="xy"
            />
          </Paper>
        </Grid.Col>

        <Grid.Col span={6}>
          <Paper p="md" withBorder>
            <Text fw={500} mb="md">Communications by Status</Text>
            <BarChart
              h={300}
              data={statusChartData}
              dataKey="status"
              series={[{ name: 'count', color: 'green' }]}
              tickLine="none"
              gridAxis="xy"
            />
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Trends Chart */}
      {trendsChartData.length > 0 && (
        <Paper p="md" withBorder>
          <Text fw={500} mb="md">Communication Trends (Last 7 Days)</Text>
          <LineChart
            h={300}
            data={trendsChartData}
            dataKey="date"
            series={Object.values(CommunicationType).map(type => ({
              name: type,
              color: getTypeColor(type),
            }))}
            curveType="linear"
            gridAxis="xy"
          />
        </Paper>
      )}

      {/* Detailed Breakdown */}
      <Grid>
        <Grid.Col span={4}>
          <Paper p="md" withBorder>
            <Text fw={500} mb="md">By Communication Type</Text>
            <Stack gap="sm">
              {Object.entries(analytics.byType)
                .filter(([_, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <Group key={type} justify="space-between">
                    <Group>
                      <Badge 
                        color={getTypeColor(type as CommunicationType)} 
                        variant="light"
                        size="sm"
                      >
                        {formatLabel(type)}
                      </Badge>
                    </Group>
                    <Text fw={500}>{count}</Text>
                  </Group>
                ))}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={4}>
          <Paper p="md" withBorder>
            <Text fw={500} mb="md">By Status</Text>
            <Stack gap="sm">
              {Object.entries(analytics.byStatus)
                .filter(([_, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => (
                  <Group key={status} justify="space-between">
                    <Group>
                      <Badge 
                        color={getStatusColor(status as CommunicationStatus)} 
                        variant="light"
                        size="sm"
                      >
                        {formatLabel(status)}
                      </Badge>
                    </Group>
                    <Text fw={500}>{count}</Text>
                  </Group>
                ))}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={4}>
          <Paper p="md" withBorder>
            <Text fw={500} mb="md">By Priority</Text>
            <Stack gap="sm">
              {Object.entries(analytics.byPriority)
                .filter(([_, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([priority, count]) => (
                  <Group key={priority} justify="space-between">
                    <Group>
                      <Badge 
                        color={getPriorityColor(priority as CommunicationPriority)} 
                        variant="light"
                        size="sm"
                      >
                        {formatLabel(priority)}
                      </Badge>
                    </Group>
                    <Text fw={500}>{count}</Text>
                  </Group>
                ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Alerts */}
      {analytics.overdueCount > 0 && (
        <Alert icon={<IconAlertTriangle size={16} />} color="red">
          You have {analytics.overdueCount} overdue communication{analytics.overdueCount > 1 ? 's' : ''} 
          that require immediate attention.
        </Alert>
      )}

      {analytics.upcomingCount > 0 && (
        <Alert icon={<IconInfoCircle size={16} />} color="blue">
          You have {analytics.upcomingCount} upcoming communication{analytics.upcomingCount > 1 ? 's' : ''} 
          scheduled for the next 7 days.
        </Alert>
      )}
    </Stack>
  );
}
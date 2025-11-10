'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Stack,
  Badge,
  Grid,
  Select,
  Progress,
  ThemeIcon,
  SimpleGrid,
  Tabs,
  RingProgress,
  Center,
  Table,
  Avatar,
  Alert,
} from '@mantine/core';
import {
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconStar,
  IconUsers,
  IconClock,
  IconTarget,
  IconDownload,
  IconCalendar,
  IconSchool,
  IconCertificate,
  IconAlertTriangle,
  IconCheck,
  IconBulb,
  IconArrowUp,
  IconArrowDown,
  IconMinus,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface TrainingAnalyticsDashboardProps {
  customerId?: string;
  trainerId?: string;
}

interface AnalyticsData {
  period: string;
  completedSessions: number;
  averageRating: number;
  certificationRate: number;
  attendanceRate: number;
  customerSatisfaction: number;
  trainingHours: number;
}

interface OptimizationRecommendation {
  id: string;
  type: 'performance' | 'efficiency' | 'quality' | 'cost';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  expectedROI: number;
  actionItems: string[];
}

export function TrainingAnalyticsDashboard({ customerId, trainerId }: TrainingAnalyticsDashboardProps) {
  const { trainingSessions, customers, users } = useMockData();
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [timeRange, setTimeRange] = useState<string>('last_6_months');
  const [comparisonPeriod, setComparisonPeriod] = useState<string>('previous_period');

  // Generate time series data for analytics
  const analyticsData = useMemo(() => {
    const data: AnalyticsData[] = [];
    const now = new Date();
    
    // Generate data for the last 12 months
    for (let i = 11; i >= 0; i--) {
      const periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const periodSessions = trainingSessions.filter(s => {
        const sessionDate = s.completedDate || s.scheduledDate;
        return sessionDate >= periodStart && sessionDate <= periodEnd && s.status === 'completed';
      });

      const completedSessions = periodSessions.length;
      const averageRating = completedSessions > 0 
        ? periodSessions.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / completedSessions
        : 0;
      const certificationRate = completedSessions > 0 
        ? (periodSessions.filter(s => s.certificationAwarded).length / completedSessions) * 100
        : 0;
      const attendanceRate = 85 + Math.random() * 10; // Mock data
      const customerSatisfaction = averageRating * 20; // Convert to percentage
      const trainingHours = periodSessions.reduce((sum, s) => sum + s.duration, 0) / 60;

      data.push({
        period: periodStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        completedSessions,
        averageRating,
        certificationRate,
        attendanceRate,
        customerSatisfaction,
        trainingHours,
      });
    }

    return data;
  }, [trainingSessions]);

  // Filter data based on time range
  const filteredAnalyticsData = useMemo(() => {
    const monthsToShow = timeRange === 'last_3_months' ? 3 : 
                       timeRange === 'last_6_months' ? 6 : 12;
    return analyticsData.slice(-monthsToShow);
  }, [analyticsData, timeRange]);

  // Calculate current period metrics
  const currentMetrics = useMemo(() => {
    const currentData = filteredAnalyticsData[filteredAnalyticsData.length - 1];
    const previousData = filteredAnalyticsData[filteredAnalyticsData.length - 2];
    
    if (!currentData) return null;

    const calculateTrend = (current: number, previous: number) => {
      if (!previous) return { value: 0, direction: 'stable' as const };
      const change = ((current - previous) / previous) * 100;
      return {
        value: Math.abs(change),
        direction: change > 5 ? 'up' as const : change < -5 ? 'down' as const : 'stable' as const
      };
    };

    return {
      completedSessions: currentData.completedSessions,
      averageRating: currentData.averageRating,
      certificationRate: currentData.certificationRate,
      attendanceRate: currentData.attendanceRate,
      customerSatisfaction: currentData.customerSatisfaction,
      trainingHours: currentData.trainingHours,
      trends: {
        completedSessions: calculateTrend(currentData.completedSessions, previousData?.completedSessions || 0),
        averageRating: calculateTrend(currentData.averageRating, previousData?.averageRating || 0),
        certificationRate: calculateTrend(currentData.certificationRate, previousData?.certificationRate || 0),
        customerSatisfaction: calculateTrend(currentData.customerSatisfaction, previousData?.customerSatisfaction || 0),
      }
    };
  }, [filteredAnalyticsData]);

  // Generate optimization recommendations
  const optimizationRecommendations = useMemo(() => {
    const recommendations: OptimizationRecommendation[] = [];
    
    if (!currentMetrics) return recommendations;

    // Low completion rate recommendation
    if (currentMetrics.completedSessions < 10) {
      recommendations.push({
        id: 'increase-completion',
        type: 'performance',
        priority: 'high',
        title: 'Increase Training Session Volume',
        description: 'Current training session completion rate is below target. Consider increasing training frequency.',
        impact: 'Improve skill development and compliance rates',
        effort: 'medium',
        expectedROI: 180,
        actionItems: [
          'Schedule more frequent training sessions',
          'Implement mandatory training programs',
          'Create incentives for training completion',
          'Develop micro-learning modules'
        ]
      });
    }

    // Low rating recommendation
    if (currentMetrics.averageRating < 3.5) {
      recommendations.push({
        id: 'improve-quality',
        type: 'quality',
        priority: 'high',
        title: 'Enhance Training Quality',
        description: 'Training ratings are below acceptable levels. Focus on improving content and delivery.',
        impact: 'Increase learner satisfaction and knowledge retention',
        effort: 'high',
        expectedROI: 220,
        actionItems: [
          'Review and update training materials',
          'Provide trainer coaching and development',
          'Implement interactive training methods',
          'Gather detailed feedback from participants'
        ]
      });
    }

    // Low certification rate recommendation
    if (currentMetrics.certificationRate < 60) {
      recommendations.push({
        id: 'boost-certifications',
        type: 'performance',
        priority: 'medium',
        title: 'Improve Certification Success Rate',
        description: 'Many training sessions are not resulting in certifications. Review certification criteria.',
        impact: 'Increase compliance and professional development',
        effort: 'medium',
        expectedROI: 150,
        actionItems: [
          'Review certification requirements',
          'Provide pre-certification preparation',
          'Implement practice assessments',
          'Offer remedial training for failed attempts'
        ]
      });
    }

    // Efficiency recommendation
    if (currentMetrics.trainingHours > 50) {
      recommendations.push({
        id: 'optimize-efficiency',
        type: 'efficiency',
        priority: 'medium',
        title: 'Optimize Training Duration',
        description: 'Training sessions may be longer than necessary. Consider optimizing content delivery.',
        impact: 'Reduce training costs and improve participant engagement',
        effort: 'medium',
        expectedROI: 130,
        actionItems: [
          'Analyze training content for redundancy',
          'Implement blended learning approaches',
          'Create focused, outcome-based modules',
          'Use technology to enhance learning efficiency'
        ]
      });
    }

    // Cost optimization recommendation
    recommendations.push({
      id: 'cost-optimization',
      type: 'cost',
      priority: 'low',
      title: 'Implement Cost-Effective Training Methods',
      description: 'Explore digital and self-paced learning options to reduce training costs.',
      impact: 'Reduce per-participant training costs while maintaining quality',
      effort: 'high',
      expectedROI: 200,
      actionItems: [
        'Develop e-learning modules',
        'Implement virtual reality training',
        'Create self-assessment tools',
        'Establish peer-to-peer learning programs'
      ]
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [currentMetrics]);

  // Training type performance analysis
  const typePerformance = useMemo(() => {
    const types = ['installation', 'maintenance', 'sales', 'product_knowledge'];
    
    return types.map(type => {
      const typeSessions = trainingSessions.filter(s => s.type === type && s.status === 'completed');
      const avgRating = typeSessions.length > 0 
        ? typeSessions.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / typeSessions.length
        : 0;
      const certRate = typeSessions.length > 0 
        ? (typeSessions.filter(s => s.certificationAwarded).length / typeSessions.length) * 100
        : 0;
      
      return {
        type,
        name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        sessions: typeSessions.length,
        avgRating,
        certificationRate: certRate,
        avgDuration: typeSessions.length > 0 
          ? typeSessions.reduce((sum, s) => sum + s.duration, 0) / typeSessions.length / 60
          : 0
      };
    });
  }, [trainingSessions]);

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return IconArrowUp;
      case 'down': return IconArrowDown;
      default: return IconMinus;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'green';
      case 'down': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'blue';
      case 'quality': return 'green';
      case 'efficiency': return 'orange';
      case 'cost': return 'violet';
      default: return 'gray';
    }
  };

  if (!currentMetrics) {
    return (
      <Alert icon={<IconAlertTriangle size={16} />} color="orange">
        No training data available for the selected period.
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      {/* Controls */}
      <Card withBorder p="md">
        <Group justify="space-between">
          <Title order={3}>Training Analytics Dashboard</Title>
          <Group gap="sm">
            <Select
              placeholder="Time Range"
              data={[
                { value: 'last_3_months', label: 'Last 3 Months' },
                { value: 'last_6_months', label: 'Last 6 Months' },
                { value: 'last_12_months', label: 'Last 12 Months' },
              ]}
              value={timeRange}
              onChange={(value) => setTimeRange(value || 'last_6_months')}
              w={150}
            />
            <Button leftSection={<IconDownload size={16} />} variant="light">
              Export Analytics
            </Button>
          </Group>
        </Group>
      </Card>

      {/* Key Performance Indicators */}
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }}>
        <Card withBorder p="md">
          <Group justify="space-between" mb="sm">
            <ThemeIcon color="blue" variant="light" size="lg">
              <IconSchool size={20} />
            </ThemeIcon>
            <div style={{ textAlign: 'right' }}>
              <Text size="xl" fw={700} c="blue">
                {currentMetrics.completedSessions}
              </Text>
              <Text size="sm" c="dimmed">Sessions Completed</Text>
              <Group gap="xs" justify="flex-end">
                {React.createElement(getTrendIcon(currentMetrics.trends.completedSessions.direction), {
                  size: 12,
                  color: getTrendColor(currentMetrics.trends.completedSessions.direction)
                })}
                <Text size="xs" c={getTrendColor(currentMetrics.trends.completedSessions.direction)}>
                  {currentMetrics.trends.completedSessions.value.toFixed(1)}%
                </Text>
              </Group>
            </div>
          </Group>
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between" mb="sm">
            <ThemeIcon color="yellow" variant="light" size="lg">
              <IconStar size={20} />
            </ThemeIcon>
            <div style={{ textAlign: 'right' }}>
              <Text size="xl" fw={700} c="yellow">
                {currentMetrics.averageRating.toFixed(1)}
              </Text>
              <Text size="sm" c="dimmed">Average Rating</Text>
              <Group gap="xs" justify="flex-end">
                {React.createElement(getTrendIcon(currentMetrics.trends.averageRating.direction), {
                  size: 12,
                  color: getTrendColor(currentMetrics.trends.averageRating.direction)
                })}
                <Text size="xs" c={getTrendColor(currentMetrics.trends.averageRating.direction)}>
                  {currentMetrics.trends.averageRating.value.toFixed(1)}%
                </Text>
              </Group>
            </div>
          </Group>
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between" mb="sm">
            <ThemeIcon color="green" variant="light" size="lg">
              <IconCertificate size={20} />
            </ThemeIcon>
            <div style={{ textAlign: 'right' }}>
              <Text size="xl" fw={700} c="green">
                {currentMetrics.certificationRate.toFixed(0)}%
              </Text>
              <Text size="sm" c="dimmed">Certification Rate</Text>
              <Group gap="xs" justify="flex-end">
                {React.createElement(getTrendIcon(currentMetrics.trends.certificationRate.direction), {
                  size: 12,
                  color: getTrendColor(currentMetrics.trends.certificationRate.direction)
                })}
                <Text size="xs" c={getTrendColor(currentMetrics.trends.certificationRate.direction)}>
                  {currentMetrics.trends.certificationRate.value.toFixed(1)}%
                </Text>
              </Group>
            </div>
          </Group>
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between" mb="sm">
            <ThemeIcon color="teal" variant="light" size="lg">
              <IconUsers size={20} />
            </ThemeIcon>
            <div style={{ textAlign: 'right' }}>
              <Text size="xl" fw={700} c="teal">
                {currentMetrics.customerSatisfaction.toFixed(0)}%
              </Text>
              <Text size="sm" c="dimmed">Satisfaction</Text>
              <Group gap="xs" justify="flex-end">
                {React.createElement(getTrendIcon(currentMetrics.trends.customerSatisfaction.direction), {
                  size: 12,
                  color: getTrendColor(currentMetrics.trends.customerSatisfaction.direction)
                })}
                <Text size="xs" c={getTrendColor(currentMetrics.trends.customerSatisfaction.direction)}>
                  {currentMetrics.trends.customerSatisfaction.value.toFixed(1)}%
                </Text>
              </Group>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="trends" leftSection={<IconTrendingUp size={16} />}>
            Trends
          </Tabs.Tab>
          <Tabs.Tab value="performance" leftSection={<IconTarget size={16} />}>
            Performance
          </Tabs.Tab>
          <Tabs.Tab value="optimization" leftSection={<IconBulb size={16} />}>
            Optimization
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="lg">
          <Grid>
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Training Volume Trend</Title>
                <Stack gap="md">
                  {filteredAnalyticsData.map((data, index) => (
                    <div key={data.period}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">{data.period}</Text>
                        <Group gap="md">
                          <Text size="sm">Sessions: {data.completedSessions}</Text>
                          <Text size="sm">Hours: {data.trainingHours.toFixed(1)}</Text>
                        </Group>
                      </Group>
                      <Progress 
                        value={Math.max(5, (data.completedSessions / Math.max(...filteredAnalyticsData.map(d => d.completedSessions))) * 100)} 
                        color="blue" 
                        size="lg" 
                      />
                    </div>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Training Hours Distribution</Title>
                <Stack gap="md">
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Installation</Text>
                      <Text size="sm" fw={500}>35%</Text>
                    </Group>
                    <Progress value={35} color="blue" size="lg" />
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Maintenance</Text>
                      <Text size="sm" fw={500}>30%</Text>
                    </Group>
                    <Progress value={30} color="orange" size="lg" />
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Sales</Text>
                      <Text size="sm" fw={500}>20%</Text>
                    </Group>
                    <Progress value={20} color="green" size="lg" />
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Product Knowledge</Text>
                      <Text size="sm" fw={500}>15%</Text>
                    </Group>
                    <Progress value={15} color="violet" size="lg" />
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="trends" pt="lg">
          <Grid>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Quality Metrics Trend</Title>
                <Stack gap="md">
                  {filteredAnalyticsData.map((data) => (
                    <div key={data.period}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">{data.period}</Text>
                        <Group gap="md">
                          <Text size="sm">Rating: {data.averageRating.toFixed(1)}</Text>
                          <Text size="sm">Satisfaction: {data.customerSatisfaction.toFixed(0)}%</Text>
                        </Group>
                      </Group>
                      <Group gap="sm">
                        <Progress 
                          value={(data.averageRating / 5) * 100} 
                          color="yellow" 
                          size="sm" 
                          style={{ flex: 1 }}
                        />
                        <Progress 
                          value={data.customerSatisfaction} 
                          color="teal" 
                          size="sm" 
                          style={{ flex: 1 }}
                        />
                      </Group>
                    </div>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Success Metrics Trend</Title>
                <Stack gap="md">
                  {filteredAnalyticsData.map((data) => (
                    <div key={data.period}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">{data.period}</Text>
                        <Group gap="md">
                          <Text size="sm">Cert: {data.certificationRate.toFixed(0)}%</Text>
                          <Text size="sm">Attend: {data.attendanceRate.toFixed(0)}%</Text>
                        </Group>
                      </Group>
                      <Group gap="sm">
                        <Progress 
                          value={data.certificationRate} 
                          color="green" 
                          size="sm" 
                          style={{ flex: 1 }}
                        />
                        <Progress 
                          value={data.attendanceRate} 
                          color="blue" 
                          size="sm" 
                          style={{ flex: 1 }}
                        />
                      </Group>
                    </div>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="performance" pt="lg">
          <Card withBorder p="md">
            <Title order={4} mb="md">Training Type Performance Analysis</Title>
            <Table.ScrollContainer minWidth={800}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Training Type</Table.Th>
                    <Table.Th>Sessions</Table.Th>
                    <Table.Th>Avg Rating</Table.Th>
                    <Table.Th>Certification Rate</Table.Th>
                    <Table.Th>Avg Duration</Table.Th>
                    <Table.Th>Performance</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {typePerformance.map((type) => {
                    const overallScore = (type.avgRating * 20 + type.certificationRate) / 2;
                    const performanceColor = overallScore >= 80 ? 'green' : 
                                           overallScore >= 60 ? 'orange' : 'red';
                    
                    return (
                      <Table.Tr key={type.type}>
                        <Table.Td>
                          <Text fw={500}>{type.name}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text>{type.sessions}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <IconStar size={14} fill="gold" color="gold" />
                            <Text>{type.avgRating.toFixed(1)}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text>{type.certificationRate.toFixed(0)}%</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text>{type.avgDuration.toFixed(1)}h</Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="sm">
                            <Progress 
                              value={overallScore} 
                              color={performanceColor} 
                              size="sm" 
                              w={100}
                            />
                            <Badge color={performanceColor} variant="light" size="sm">
                              {overallScore.toFixed(0)}%
                            </Badge>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="optimization" pt="lg">
          <Stack gap="lg">
            <Card withBorder p="md">
              <Group justify="space-between" mb="md">
                <Title order={4}>Optimization Recommendations</Title>
                <Text size="sm" c="dimmed">
                  {optimizationRecommendations.length} recommendations found
                </Text>
              </Group>
              
              <Stack gap="md">
                {optimizationRecommendations.map((rec) => (
                  <Card key={rec.id} withBorder p="md" bg="gray.0">
                    <Group justify="space-between" mb="sm">
                      <Group gap="sm">
                        <Badge color={getPriorityColor(rec.priority)} variant="light">
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <Badge color={getTypeColor(rec.type)} variant="outline">
                          {rec.type.toUpperCase()}
                        </Badge>
                      </Group>
                      <Group gap="xs">
                        <Text size="sm" c="dimmed">Expected ROI:</Text>
                        <Text size="sm" fw={500} c="green">
                          {rec.expectedROI}%
                        </Text>
                      </Group>
                    </Group>
                    
                    <Title order={5} mb="xs">{rec.title}</Title>
                    <Text size="sm" c="dimmed" mb="sm">{rec.description}</Text>
                    
                    <Group justify="space-between" mb="md">
                      <div>
                        <Text size="xs" c="dimmed">Impact</Text>
                        <Text size="sm">{rec.impact}</Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">Effort</Text>
                        <Badge 
                          color={rec.effort === 'low' ? 'green' : rec.effort === 'medium' ? 'orange' : 'red'} 
                          variant="light" 
                          size="sm"
                        >
                          {rec.effort}
                        </Badge>
                      </div>
                    </Group>
                    
                    <div>
                      <Text size="sm" fw={500} mb="xs">Action Items:</Text>
                      <Stack gap="xs">
                        {rec.actionItems.map((item, index) => (
                          <Group key={index} gap="xs">
                            <Text size="xs" c="dimmed">•</Text>
                            <Text size="sm">{item}</Text>
                          </Group>
                        ))}
                      </Stack>
                    </div>
                  </Card>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
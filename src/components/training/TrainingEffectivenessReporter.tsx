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
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface TrainingEffectivenessReporterProps {
  customerId?: string;
  trainerId?: string;
}

interface EffectivenessMetrics {
  completionRate: number;
  averageRating: number;
  certificationRate: number;
  attendanceRate: number;
  knowledgeRetention: number;
  customerSatisfaction: number;
  timeToCompetency: number; // days
  trainingROI: number;
}

interface TrainingOutcome {
  sessionId: string;
  customerId: string;
  customerName: string;
  trainerId: string;
  trainerName: string;
  type: string;
  completedDate: Date;
  preAssessmentScore?: number;
  postAssessmentScore?: number;
  improvementScore: number;
  rating: number;
  certificationAwarded: boolean;
  followUpCompleted: boolean;
  businessImpact: 'high' | 'medium' | 'low';
}

export function TrainingEffectivenessReporter({ customerId, trainerId }: TrainingEffectivenessReporterProps) {
  const { trainingSessions, customers, users } = useMockData();
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [timeRange, setTimeRange] = useState<string>('last_3_months');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Filter sessions based on props and time range
  const filteredSessions = useMemo(() => {
    let sessions = trainingSessions.filter(s => s.status === 'completed');
    
    if (customerId) {
      sessions = sessions.filter(s => s.customerId === customerId);
    }
    
    if (trainerId) {
      sessions = sessions.filter(s => s.trainerId === trainerId);
    }

    // Apply time range filter
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'last_month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'last_3_months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'last_6_months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'last_year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 3);
    }

    sessions = sessions.filter(s => 
      s.completedDate && s.completedDate >= startDate
    );

    if (typeFilter) {
      sessions = sessions.filter(s => s.type === typeFilter);
    }

    return sessions;
  }, [trainingSessions, customerId, trainerId, timeRange, typeFilter]);

  // Calculate effectiveness metrics
  const effectivenessMetrics = useMemo(() => {
    const totalSessions = filteredSessions.length;
    
    if (totalSessions === 0) {
      return {
        completionRate: 0,
        averageRating: 0,
        certificationRate: 0,
        attendanceRate: 0,
        knowledgeRetention: 0,
        customerSatisfaction: 0,
        timeToCompetency: 0,
        trainingROI: 0,
      };
    }

    const completionRate = 100; // All filtered sessions are completed
    const averageRating = filteredSessions.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / totalSessions;
    const certificationRate = (filteredSessions.filter(s => s.certificationAwarded).length / totalSessions) * 100;
    
    // Mock additional metrics (in a real app, these would come from assessments and business data)
    const attendanceRate = 85 + Math.random() * 10; // 85-95%
    const knowledgeRetention = 70 + Math.random() * 20; // 70-90%
    const customerSatisfaction = averageRating * 20; // Convert 5-point scale to percentage
    const timeToCompetency = 14 + Math.random() * 21; // 14-35 days
    const trainingROI = 150 + Math.random() * 100; // 150-250%

    return {
      completionRate,
      averageRating,
      certificationRate,
      attendanceRate,
      knowledgeRetention,
      customerSatisfaction,
      timeToCompetency,
      trainingROI,
    };
  }, [filteredSessions]);

  // Generate training outcomes data
  const trainingOutcomes = useMemo(() => {
    return filteredSessions.map(session => {
      const customer = customers.find(c => c.id === session.customerId);
      const trainer = users.find(u => u.id === session.trainerId);
      
      // Mock assessment scores
      const preScore = 40 + Math.random() * 30; // 40-70%
      const postScore = Math.max(preScore + 10, 60 + Math.random() * 30); // Improvement of at least 10%
      const improvement = postScore - preScore;
      
      // Determine business impact based on improvement and certification
      let businessImpact: 'high' | 'medium' | 'low' = 'low';
      if (improvement > 25 && session.certificationAwarded) {
        businessImpact = 'high';
      } else if (improvement > 15 || session.certificationAwarded) {
        businessImpact = 'medium';
      }

      return {
        sessionId: session.id,
        customerId: session.customerId,
        customerName: customer?.companyName || 'Unknown Customer',
        trainerId: session.trainerId,
        trainerName: trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown Trainer',
        type: session.type,
        completedDate: session.completedDate || new Date(),
        preAssessmentScore: preScore,
        postAssessmentScore: postScore,
        improvementScore: improvement,
        rating: session.feedback?.rating || 0,
        certificationAwarded: session.certificationAwarded || false,
        followUpCompleted: Math.random() > 0.3, // 70% follow-up completion rate
        businessImpact,
      };
    });
  }, [filteredSessions, customers, users]);

  // Calculate trend data (comparing with previous period)
  const trendData = useMemo(() => {
    // Mock trend calculations (in a real app, this would compare with previous period data)
    return {
      completionRateTrend: Math.random() > 0.5 ? 'up' : 'down',
      ratingTrend: Math.random() > 0.5 ? 'up' : 'down',
      certificationTrend: Math.random() > 0.5 ? 'up' : 'down',
      satisfactionTrend: Math.random() > 0.5 ? 'up' : 'down',
    };
  }, [timeRange]);

  const getMetricColor = (value: number, type: 'percentage' | 'rating' | 'days' | 'roi') => {
    switch (type) {
      case 'percentage':
        return value >= 80 ? 'green' : value >= 60 ? 'orange' : 'red';
      case 'rating':
        return value >= 4 ? 'green' : value >= 3 ? 'orange' : 'red';
      case 'days':
        return value <= 21 ? 'green' : value <= 35 ? 'orange' : 'red';
      case 'roi':
        return value >= 200 ? 'green' : value >= 150 ? 'orange' : 'red';
      default:
        return 'blue';
    }
  };

  const getBusinessImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'green';
      case 'medium': return 'orange';
      case 'low': return 'red';
      default: return 'gray';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? IconTrendingUp : IconTrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'green' : 'red';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Stack gap="lg">
      {/* Controls */}
      <Card withBorder p="md">
        <Group justify="space-between">
          <Title order={3}>Training Effectiveness Report</Title>
          <Group gap="sm">
            <Select
              placeholder="Time Range"
              data={[
                { value: 'last_month', label: 'Last Month' },
                { value: 'last_3_months', label: 'Last 3 Months' },
                { value: 'last_6_months', label: 'Last 6 Months' },
                { value: 'last_year', label: 'Last Year' },
              ]}
              value={timeRange}
              onChange={(value) => setTimeRange(value || 'last_3_months')}
              w={150}
            />
            <Select
              placeholder="Training Type"
              data={[
                { value: 'installation', label: 'Installation' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'sales', label: 'Sales' },
                { value: 'product_knowledge', label: 'Product Knowledge' },
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
              clearable
              w={150}
            />
            <Button leftSection={<IconDownload size={16} />} variant="light">
              Export Report
            </Button>
          </Group>
        </Group>
      </Card>

      {/* Key Metrics */}
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }}>
        <Card withBorder p="md" ta="center">
          <Group justify="center" mb="sm">
            <RingProgress
              size={80}
              thickness={8}
              sections={[
                { 
                  value: effectivenessMetrics.completionRate, 
                  color: getMetricColor(effectivenessMetrics.completionRate, 'percentage') 
                }
              ]}
              label={
                <Center>
                  <Text size="xs" fw={700}>
                    {effectivenessMetrics.completionRate.toFixed(0)}%
                  </Text>
                </Center>
              }
            />
            <div>
              <Text size="sm" fw={500}>Completion Rate</Text>
              <Group gap="xs">
                {React.createElement(getTrendIcon(trendData.completionRateTrend), {
                  size: 14,
                  color: getTrendColor(trendData.completionRateTrend)
                })}
                <Text size="xs" c={getTrendColor(trendData.completionRateTrend)}>
                  vs previous period
                </Text>
              </Group>
            </div>
          </Group>
        </Card>

        <Card withBorder p="md" ta="center">
          <Group justify="center" mb="sm">
            <RingProgress
              size={80}
              thickness={8}
              sections={[
                { 
                  value: (effectivenessMetrics.averageRating / 5) * 100, 
                  color: getMetricColor(effectivenessMetrics.averageRating, 'rating') 
                }
              ]}
              label={
                <Center>
                  <Text size="xs" fw={700}>
                    {effectivenessMetrics.averageRating.toFixed(1)}
                  </Text>
                </Center>
              }
            />
            <div>
              <Text size="sm" fw={500}>Avg Rating</Text>
              <Group gap="xs">
                {React.createElement(getTrendIcon(trendData.ratingTrend), {
                  size: 14,
                  color: getTrendColor(trendData.ratingTrend)
                })}
                <Text size="xs" c={getTrendColor(trendData.ratingTrend)}>
                  vs previous period
                </Text>
              </Group>
            </div>
          </Group>
        </Card>

        <Card withBorder p="md" ta="center">
          <Group justify="center" mb="sm">
            <RingProgress
              size={80}
              thickness={8}
              sections={[
                { 
                  value: effectivenessMetrics.certificationRate, 
                  color: getMetricColor(effectivenessMetrics.certificationRate, 'percentage') 
                }
              ]}
              label={
                <Center>
                  <Text size="xs" fw={700}>
                    {effectivenessMetrics.certificationRate.toFixed(0)}%
                  </Text>
                </Center>
              }
            />
            <div>
              <Text size="sm" fw={500}>Certification Rate</Text>
              <Group gap="xs">
                {React.createElement(getTrendIcon(trendData.certificationTrend), {
                  size: 14,
                  color: getTrendColor(trendData.certificationTrend)
                })}
                <Text size="xs" c={getTrendColor(trendData.certificationTrend)}>
                  vs previous period
                </Text>
              </Group>
            </div>
          </Group>
        </Card>

        <Card withBorder p="md" ta="center">
          <Group justify="center" mb="sm">
            <RingProgress
              size={80}
              thickness={8}
              sections={[
                { 
                  value: effectivenessMetrics.customerSatisfaction, 
                  color: getMetricColor(effectivenessMetrics.customerSatisfaction, 'percentage') 
                }
              ]}
              label={
                <Center>
                  <Text size="xs" fw={700}>
                    {effectivenessMetrics.customerSatisfaction.toFixed(0)}%
                  </Text>
                </Center>
              }
            />
            <div>
              <Text size="sm" fw={500}>Satisfaction</Text>
              <Group gap="xs">
                {React.createElement(getTrendIcon(trendData.satisfactionTrend), {
                  size: 14,
                  color: getTrendColor(trendData.satisfactionTrend)
                })}
                <Text size="xs" c={getTrendColor(trendData.satisfactionTrend)}>
                  vs previous period
                </Text>
              </Group>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Additional Metrics */}
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card withBorder p="lg">
            <Title order={4} mb="md">Performance Metrics</Title>
            <Stack gap="md">
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Knowledge Retention</Text>
                  <Text size="sm" fw={500}>
                    {effectivenessMetrics.knowledgeRetention.toFixed(1)}%
                  </Text>
                </Group>
                <Progress 
                  value={effectivenessMetrics.knowledgeRetention} 
                  color={getMetricColor(effectivenessMetrics.knowledgeRetention, 'percentage')} 
                  size="lg" 
                />
              </div>
              
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Attendance Rate</Text>
                  <Text size="sm" fw={500}>
                    {effectivenessMetrics.attendanceRate.toFixed(1)}%
                  </Text>
                </Group>
                <Progress 
                  value={effectivenessMetrics.attendanceRate} 
                  color={getMetricColor(effectivenessMetrics.attendanceRate, 'percentage')} 
                  size="lg" 
                />
              </div>

              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Time to Competency</Text>
                  <Text size="sm" fw={500}>
                    {effectivenessMetrics.timeToCompetency.toFixed(0)} days
                  </Text>
                </Group>
                <Progress 
                  value={Math.max(0, 100 - (effectivenessMetrics.timeToCompetency / 50) * 100)} 
                  color={getMetricColor(effectivenessMetrics.timeToCompetency, 'days')} 
                  size="lg" 
                />
              </div>

              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Training ROI</Text>
                  <Text size="sm" fw={500}>
                    {effectivenessMetrics.trainingROI.toFixed(0)}%
                  </Text>
                </Group>
                <Progress 
                  value={Math.min(100, (effectivenessMetrics.trainingROI / 300) * 100)} 
                  color={getMetricColor(effectivenessMetrics.trainingROI, 'roi')} 
                  size="lg" 
                />
              </div>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card withBorder p="lg">
            <Title order={4} mb="md">Business Impact Distribution</Title>
            <Stack gap="md">
              {['high', 'medium', 'low'].map(impact => {
                const count = trainingOutcomes.filter(o => o.businessImpact === impact).length;
                const percentage = trainingOutcomes.length > 0 ? (count / trainingOutcomes.length) * 100 : 0;
                
                return (
                  <div key={impact}>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm" tt="capitalize">{impact} Impact</Text>
                      <Text size="sm" fw={500}>{count} sessions ({percentage.toFixed(0)}%)</Text>
                    </Group>
                    <Progress 
                      value={percentage} 
                      color={getBusinessImpactColor(impact)} 
                      size="lg" 
                    />
                  </div>
                );
              })}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Training Outcomes Table */}
      <Card withBorder p="md">
        <Title order={4} mb="md">Training Outcomes</Title>
        <Table.ScrollContainer minWidth={1200}>
          <Table verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Training Type</Table.Th>
                <Table.Th>Completion Date</Table.Th>
                <Table.Th>Improvement</Table.Th>
                <Table.Th>Rating</Table.Th>
                <Table.Th>Certification</Table.Th>
                <Table.Th>Business Impact</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {trainingOutcomes.slice(0, 10).map((outcome) => (
                <Table.Tr key={outcome.sessionId}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar size={24} radius="xl" color="blue">
                        {outcome.customerName.charAt(0)}
                      </Avatar>
                      <Text size="sm">{outcome.customerName}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" tt="capitalize">
                      {outcome.type.replace('_', ' ')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatDate(outcome.completedDate)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Text size="sm" fw={500} c="green">
                        +{outcome.improvementScore.toFixed(1)}%
                      </Text>
                      <Text size="xs" c="dimmed">
                        ({outcome.preAssessmentScore?.toFixed(0)}% → {outcome.postAssessmentScore?.toFixed(0)}%)
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconStar size={14} fill="gold" color="gold" />
                      <Text size="sm">{outcome.rating}/5</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {outcome.certificationAwarded ? (
                      <Badge color="gold" variant="light" size="sm">
                        <IconCertificate size={12} style={{ marginRight: 4 }} />
                        Awarded
                      </Badge>
                    ) : (
                      <Text size="sm" c="dimmed">None</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getBusinessImpactColor(outcome.businessImpact)} variant="light">
                      {outcome.businessImpact.charAt(0).toUpperCase() + outcome.businessImpact.slice(1)}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      {/* Summary Insights */}
      <Card withBorder p="lg">
        <Title order={4} mb="md">Key Insights</Title>
        <Stack gap="md">
          {effectivenessMetrics.averageRating >= 4 && (
            <Alert icon={<IconCheck size={16} />} color="green" variant="light">
              <Text fw={500}>Excellent Training Quality</Text>
              <Text size="sm">
                Average rating of {effectivenessMetrics.averageRating.toFixed(1)}/5 indicates high-quality training delivery.
              </Text>
            </Alert>
          )}
          
          {effectivenessMetrics.certificationRate < 50 && (
            <Alert icon={<IconAlertTriangle size={16} />} color="orange" variant="light">
              <Text fw={500}>Low Certification Rate</Text>
              <Text size="sm">
                Only {effectivenessMetrics.certificationRate.toFixed(0)}% of training sessions result in certification. 
                Consider reviewing certification criteria or training content.
              </Text>
            </Alert>
          )}
          
          {effectivenessMetrics.timeToCompetency > 30 && (
            <Alert icon={<IconClock size={16} />} color="red" variant="light">
              <Text fw={500}>Extended Time to Competency</Text>
              <Text size="sm">
                Average time to competency is {effectivenessMetrics.timeToCompetency.toFixed(0)} days. 
                Consider optimizing training programs for faster skill development.
              </Text>
            </Alert>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
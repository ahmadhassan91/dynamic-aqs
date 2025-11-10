// AI Predictive Insights Dashboard Component
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Button,
  ThemeIcon,
  Progress,
  Paper,
  Divider,
  ActionIcon,
  Tooltip,
  RingProgress,
  Timeline,
  Alert,
  NumberFormatter,
  SimpleGrid
} from '@mantine/core';
import {
  IconSparkles,
  IconTrendingUp,
  IconAlertTriangle,
  IconBulb,
  IconChartBar,
  IconRocket,
  IconTarget,
  IconBrain,
  IconRefresh,
  IconInfoCircle,
  IconArrowUp,
  IconArrowDown,
  IconMinus,
  IconDots
} from '@tabler/icons-react';
import { AIAnalytics, PredictiveInsight } from '@/types/ai';
import { aiService } from '@/lib/services/aiService';

export function AIPredictiveInsightsDashboard() {
  const [analytics, setAnalytics] = useState<AIAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await aiService.getAIAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading AI analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return IconRocket;
      case 'risk': return IconAlertTriangle;
      case 'trend': return IconTrendingUp;
      case 'recommendation': return IconBulb;
      default: return IconSparkles;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'green';
      case 'risk': return 'red';
      case 'trend': return 'blue';
      case 'recommendation': return 'violet';
      default: return 'gray';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <IconArrowUp size={16} />;
    if (trend === 'down') return <IconArrowDown size={16} />;
    return <IconMinus size={16} />;
  };

  if (loading || !analytics) {
    return (
      <Card withBorder shadow="sm" p="xl">
        <Stack align="center" py={40}>
          <ThemeIcon size={60} radius="xl" variant="light" color="blue">
            <IconBrain size={30} />
          </ThemeIcon>
          <Text c="dimmed">Loading AI insights...</Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack gap="lg">
      {/* Header */}
      <Paper withBorder p="lg" radius="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Group justify="space-between">
          <Group>
            <ThemeIcon size={50} radius="md" variant="white" color="violet">
              <IconSparkles size={28} />
            </ThemeIcon>
            <div>
              <Title order={3} c="white">AI Predictive Analytics</Title>
              <Text size="sm" c="white" opacity={0.9}>
                Machine learning-powered insights and recommendations
              </Text>
            </div>
          </Group>
          <Button 
            variant="white" 
            leftSection={<IconRefresh size={16} />}
            onClick={loadAnalytics}
          >
            Refresh
          </Button>
        </Group>
      </Paper>

      {/* Key Metrics */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        <Card withBorder shadow="sm" p="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Predicted Revenue
              </Text>
              <ThemeIcon size="sm" variant="light" color="green">
                <IconTarget size={14} />
              </ThemeIcon>
            </Group>
            <Title order={2}>
              <NumberFormatter value={analytics.predictedRevenue.nextMonth} prefix="$" thousandSeparator />
            </Title>
            <Text size="xs" c="dimmed">
              Next 30 days • {analytics.predictedRevenue.confidence}% confidence
            </Text>
            <Progress value={analytics.predictedRevenue.confidence} size="xs" color="green" />
          </Stack>
        </Card>

        <Card withBorder shadow="sm" p="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Engagement Rate
              </Text>
              <ThemeIcon size="sm" variant="light" color="blue">
                <IconChartBar size={14} />
              </ThemeIcon>
            </Group>
            <Title order={2}>{analytics.engagementMetrics.overallEngagement}%</Title>
            <Text size="xs" c="dimmed">
              Avg. response time: {analytics.engagementMetrics.averageResponseTime}h
            </Text>
            <Progress value={analytics.engagementMetrics.overallEngagement} size="xs" color="blue" />
          </Stack>
        </Card>

        <Card withBorder shadow="sm" p="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                High-Quality Leads
              </Text>
              <ThemeIcon size="sm" variant="light" color="violet">
                <IconSparkles size={14} />
              </ThemeIcon>
            </Group>
            <Title order={2}>{analytics.leadQualityDistribution.high}</Title>
            <Text size="xs" c="dimmed">
              {analytics.leadQualityDistribution.percentages.high}% of total pipeline
            </Text>
            <Progress value={analytics.leadQualityDistribution.percentages.high} size="xs" color="violet" />
          </Stack>
        </Card>

        <Card withBorder shadow="sm" p="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                At-Risk Leads
              </Text>
              <ThemeIcon size="sm" variant="light" color="red">
                <IconAlertTriangle size={14} />
              </ThemeIcon>
            </Group>
            <Title order={2}>{analytics.churnRisk.length}</Title>
            <Text size="xs" c="dimmed">
              Require immediate attention
            </Text>
            {analytics.churnRisk.length > 0 && (
              <Badge size="sm" color="red" variant="light">
                Action needed
              </Badge>
            )}
          </Stack>
        </Card>
      </SimpleGrid>

      {/* AI Insights & Top Segments */}
      <Grid gutter="lg">
        {/* Predictive Insights */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder shadow="sm" h="100%">
            <Card.Section withBorder p="md" bg="gray.0">
              <Group justify="space-between">
                <Group gap="xs">
                  <ThemeIcon size="sm" variant="light" color="violet">
                    <IconBrain size={16} />
                  </ThemeIcon>
                  <Title order={4}>AI-Powered Insights</Title>
                </Group>
                <Badge size="sm" variant="light" color="violet">
                  {analytics.opportunities.length} insights
                </Badge>
              </Group>
            </Card.Section>

            <Card.Section p="md">
              <Stack gap="md">
                {analytics.opportunities.map((insight) => {
                  const IconComponent = getInsightIcon(insight.type);
                  const color = getInsightColor(insight.type);

                  return (
                    <Paper key={insight.id} withBorder p="md" radius="md">
                      <Stack gap="sm">
                        <Group justify="space-between" align="flex-start">
                          <Group gap="sm" align="flex-start" style={{ flex: 1 }}>
                            <ThemeIcon size="lg" variant="light" color={color}>
                              <IconComponent size={20} />
                            </ThemeIcon>
                            <div style={{ flex: 1 }}>
                              <Text size="sm" fw={600}>{insight.title}</Text>
                              <Text size="xs" c="dimmed" mt={4}>
                                {insight.description}
                              </Text>
                            </div>
                          </Group>
                          <Group gap={4}>
                            <Badge size="xs" variant="light" color={color} tt="capitalize">
                              {insight.type}
                            </Badge>
                            <Tooltip label={`${insight.confidence}% confidence`}>
                              <Badge size="xs" variant="outline" color="gray">
                                {insight.confidence}%
                              </Badge>
                            </Tooltip>
                          </Group>
                        </Group>

                        {insight.actionable && insight.suggestedActions.length > 0 && (
                          <>
                            <Divider />
                            <Stack gap={4}>
                              <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                                Suggested Actions:
                              </Text>
                              {insight.suggestedActions.map((action, idx) => (
                                <Group key={idx} gap={6}>
                                  <Text size="xs" c="dimmed">•</Text>
                                  <Text size="xs">{action}</Text>
                                </Group>
                              ))}
                            </Stack>
                          </>
                        )}
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </Card.Section>
          </Card>
        </Grid.Col>

        {/* Top Performing Segments */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder shadow="sm" h="100%">
            <Card.Section withBorder p="md" bg="gray.0">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="blue">
                  <IconTrendingUp size={16} />
                </ThemeIcon>
                <Title order={4}>Top Performing Segments</Title>
              </Group>
            </Card.Section>

            <Card.Section p="md">
              <Stack gap="md">
                {analytics.topPerformingSegments.map((segment, index) => (
                  <Paper key={index} withBorder p="md" radius="md">
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm" fw={600}>{segment.name}</Text>
                        <Badge 
                          size="sm" 
                          variant="light" 
                          color={segment.trend === 'up' ? 'green' : segment.trend === 'down' ? 'red' : 'gray'}
                          leftSection={getTrendIcon(segment.trend)}
                        >
                          {segment.trend}
                        </Badge>
                      </Group>

                      <SimpleGrid cols={2} spacing="xs">
                        <div>
                          <Text size="xs" c="dimmed">Conversion Rate</Text>
                          <Text size="sm" fw={600} c="green">
                            {segment.conversionRate}%
                          </Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">Avg. Value</Text>
                          <Text size="sm" fw={600}>
                            <NumberFormatter value={segment.averageValue} prefix="$" thousandSeparator />
                          </Text>
                        </div>
                      </SimpleGrid>

                      <Group gap="xs">
                        <Text size="xs" c="dimmed">{segment.leadCount} leads</Text>
                      </Group>

                      <Progress 
                        value={segment.conversionRate} 
                        size="sm" 
                        color={segment.trend === 'up' ? 'green' : 'blue'}
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Lead Quality Distribution */}
      <Card withBorder shadow="sm">
        <Card.Section withBorder p="md" bg="gray.0">
          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color="violet">
              <IconTarget size={16} />
            </ThemeIcon>
            <Title order={4}>Lead Quality Distribution</Title>
          </Group>
        </Card.Section>

        <Card.Section p="lg">
          <Group justify="space-around" align="center">
            <Stack align="center">
              <RingProgress
                size={140}
                thickness={14}
                sections={[
                  { value: analytics.leadQualityDistribution.percentages.high, color: 'green', tooltip: 'High Quality' },
                  { value: analytics.leadQualityDistribution.percentages.medium, color: 'yellow', tooltip: 'Medium Quality' },
                  { value: analytics.leadQualityDistribution.percentages.low, color: 'red', tooltip: 'Low Quality' },
                ]}
                label={
                  <Text size="xs" ta="center" fw={700}>
                    Total Leads
                  </Text>
                }
              />
            </Stack>

            <Stack gap="md" style={{ flex: 1 }}>
              <Group justify="space-between">
                <Group gap="xs">
                  <Badge size="lg" color="green" variant="filled">
                    {analytics.leadQualityDistribution.high}
                  </Badge>
                  <Text size="sm">High Quality ({analytics.leadQualityDistribution.percentages.high}%)</Text>
                </Group>
                <Progress value={analytics.leadQualityDistribution.percentages.high} w={150} color="green" />
              </Group>

              <Group justify="space-between">
                <Group gap="xs">
                  <Badge size="lg" color="yellow" variant="filled">
                    {analytics.leadQualityDistribution.medium}
                  </Badge>
                  <Text size="sm">Medium Quality ({analytics.leadQualityDistribution.percentages.medium}%)</Text>
                </Group>
                <Progress value={analytics.leadQualityDistribution.percentages.medium} w={150} color="yellow" />
              </Group>

              <Group justify="space-between">
                <Group gap="xs">
                  <Badge size="lg" color="red" variant="filled">
                    {analytics.leadQualityDistribution.low}
                  </Badge>
                  <Text size="sm">Low Quality ({analytics.leadQualityDistribution.percentages.low}%)</Text>
                </Group>
                <Progress value={analytics.leadQualityDistribution.percentages.low} w={150} color="red" />
              </Group>
            </Stack>
          </Group>
        </Card.Section>
      </Card>

      {/* Model Performance */}
      <Alert icon={<IconInfoCircle size={16} />} title="AI Model Performance" color="blue" variant="light">
        <Text size="sm">
          The AI model has been trained on {aiService.getModelMetrics().samplesProcessed.toLocaleString()} data points
          with {aiService.getModelMetrics().accuracy}% accuracy. Last updated: {aiService.getModelMetrics().lastTrained.toLocaleDateString()}
        </Text>
      </Alert>
    </Stack>
  );
}

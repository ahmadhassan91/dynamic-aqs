// AI Predictions Page - Advanced Lead Predictions and Forecasting
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
  Table,
  Select,
  SegmentedControl,
  NumberFormatter,
  SimpleGrid,
  Alert,
  Timeline,
  RingProgress,
  Box,
  Divider,
  NavLink,
  ScrollArea,
  Anchor,
} from '@mantine/core';
import Link from 'next/link';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconCalendar,
  IconCurrencyDollar,
  IconTarget,
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconArrowRight,
  IconSparkles,
  IconBrain,
  IconChartBar,
  IconUsers,
  IconRefresh,
} from '@tabler/icons-react';

interface LeadPrediction {
  id: string;
  leadName: string;
  companyName: string;
  currentStage: string;
  predictedCloseDate: Date;
  predictedValue: number;
  winProbability: number;
  confidence: number;
  nextBestAction: string;
  riskFactors: string[];
  opportunities: string[];
}

interface RevenueForecast {
  period: string;
  conservative: number;
  likely: number;
  optimistic: number;
  confidence: number;
}

export default function AIPredictionsPage() {
  const [timeframe, setTimeframe] = useState('30');
  const [viewMode, setViewMode] = useState('leads');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock lead predictions
  const leadPredictions: LeadPrediction[] = [
    {
      id: '1',
      leadName: 'John Smith',
      companyName: 'Acme Corporation',
      currentStage: 'Proposal',
      predictedCloseDate: new Date('2025-11-25'),
      predictedValue: 125000,
      winProbability: 87,
      confidence: 92,
      nextBestAction: 'Schedule executive meeting',
      riskFactors: ['Budget approval pending'],
      opportunities: ['Cross-sell opportunity identified', 'Referral potential high']
    },
    {
      id: '2',
      leadName: 'Sarah Johnson',
      companyName: 'TechStart Inc',
      currentStage: 'Discovery',
      predictedCloseDate: new Date('2025-12-15'),
      predictedValue: 85000,
      winProbability: 72,
      confidence: 85,
      nextBestAction: 'Send ROI calculator',
      riskFactors: ['Competitor evaluation in progress'],
      opportunities: ['Strong engagement metrics', 'Decision maker involved']
    },
    {
      id: '3',
      leadName: 'Michael Chen',
      companyName: 'Global Systems',
      currentStage: 'Negotiation',
      predictedCloseDate: new Date('2025-11-18'),
      predictedValue: 250000,
      winProbability: 94,
      confidence: 88,
      nextBestAction: 'Finalize contract terms',
      riskFactors: [],
      opportunities: ['Multi-year deal potential', 'Enterprise expansion opportunity']
    },
  ];

  // Revenue forecasts
  const revenueForecasts: RevenueForecast[] = [
    {
      period: 'Next 30 Days',
      conservative: 450000,
      likely: 520000,
      optimistic: 610000,
      confidence: 87
    },
    {
      period: 'Next Quarter',
      conservative: 1680000,
      likely: 2100000,
      optimistic: 2450000,
      confidence: 82
    },
    {
      period: 'Next 6 Months',
      conservative: 3200000,
      likely: 4100000,
      optimistic: 4950000,
      confidence: 75
    },
  ];

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'green';
    if (probability >= 60) return 'yellow';
    return 'orange';
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'New': 'blue',
      'Qualified': 'cyan',
      'Discovery': 'yellow',
      'Proposal': 'orange',
      'Negotiation': 'grape',
      'Won': 'green',
    };
    return colors[stage] || 'gray';
  };

  const renderLeadPredictions = () => (
    <Stack gap="md">
      {leadPredictions.map((prediction) => (
        <Card key={prediction.id} withBorder shadow="sm" p="lg">
          <Stack gap="md">
            {/* Header */}
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="lg" fw={700}>{prediction.companyName}</Text>
                <Text size="sm" c="dimmed">{prediction.leadName}</Text>
              </div>
              <Group gap="xs">
                <Badge size="lg" color={getStageColor(prediction.currentStage)} variant="light">
                  {prediction.currentStage}
                </Badge>
                <Badge size="lg" color={getProbabilityColor(prediction.winProbability)} variant="filled">
                  {prediction.winProbability}% Win
                </Badge>
              </Group>
            </Group>

            <Divider />

            {/* Prediction Metrics */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
              <Box>
                <Group gap={8} mb={4}>
                  <ThemeIcon size="sm" variant="light" color="blue">
                    <IconCalendar size={14} />
                  </ThemeIcon>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Expected Close</Text>
                </Group>
                <Text size="sm" fw={600}>
                  {prediction.predictedCloseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </Box>

              <Box>
                <Group gap={8} mb={4}>
                  <ThemeIcon size="sm" variant="light" color="green">
                    <IconCurrencyDollar size={14} />
                  </ThemeIcon>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Predicted Value</Text>
                </Group>
                <Text size="sm" fw={600}>
                  <NumberFormatter value={prediction.predictedValue} prefix="$" thousandSeparator />
                </Text>
              </Box>

              <Box>
                <Group gap={8} mb={4}>
                  <ThemeIcon size="sm" variant="light" color="violet">
                    <IconTarget size={14} />
                  </ThemeIcon>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Confidence</Text>
                </Group>
                <Text size="sm" fw={600}>{prediction.confidence}%</Text>
              </Box>

              <Box>
                <Group gap={8} mb={4}>
                  <ThemeIcon size="sm" variant="light" color="orange">
                    <IconSparkles size={14} />
                  </ThemeIcon>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>AI Score</Text>
                </Group>
                <Progress value={prediction.winProbability} size="md" color={getProbabilityColor(prediction.winProbability)} />
              </Box>
            </SimpleGrid>

            <Divider />

            {/* Next Best Action */}
            <Alert icon={<IconSparkles size={16} />} color="violet" variant="light" title="Recommended Next Action">
              <Text size="sm">{prediction.nextBestAction}</Text>
            </Alert>

            {/* Risk Factors & Opportunities */}
            <Grid>
              {prediction.riskFactors.length > 0 && (
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder p="md" radius="md" bg="red.0">
                    <Group gap="xs" mb="sm">
                      <ThemeIcon size="sm" variant="light" color="red">
                        <IconAlertTriangle size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600}>Risk Factors</Text>
                    </Group>
                    <Stack gap={4}>
                      {prediction.riskFactors.map((risk, idx) => (
                        <Text key={idx} size="xs">• {risk}</Text>
                      ))}
                    </Stack>
                  </Paper>
                </Grid.Col>
              )}

              {prediction.opportunities.length > 0 && (
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder p="md" radius="md" bg="green.0">
                    <Group gap="xs" mb="sm">
                      <ThemeIcon size="sm" variant="light" color="green">
                        <IconCheck size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600}>Opportunities</Text>
                    </Group>
                    <Stack gap={4}>
                      {prediction.opportunities.map((opp, idx) => (
                        <Text key={idx} size="xs">• {opp}</Text>
                      ))}
                    </Stack>
                  </Paper>
                </Grid.Col>
              )}
            </Grid>

            <Button variant="light" leftSection={<IconArrowRight size={16} />} fullWidth>
              View Full Analysis
            </Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  );

  const renderRevenueForecast = () => (
    <Stack gap="lg">
      {/* Summary Cards */}
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        <Card withBorder shadow="sm" p="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">Conservative</Text>
              <ThemeIcon size="sm" variant="light" color="orange">
                <IconTrendingDown size={14} />
              </ThemeIcon>
            </Group>
            <Title order={2} c="orange">
              <NumberFormatter value={revenueForecasts[0].conservative} prefix="$" thousandSeparator />
            </Title>
            <Text size="xs" c="dimmed">Low-risk scenario</Text>
          </Stack>
        </Card>

        <Card withBorder shadow="sm" p="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">Likely</Text>
              <ThemeIcon size="sm" variant="light" color="blue">
                <IconTarget size={14} />
              </ThemeIcon>
            </Group>
            <Title order={2} c="blue">
              <NumberFormatter value={revenueForecasts[0].likely} prefix="$" thousandSeparator />
            </Title>
            <Text size="xs" c="dimmed">Most probable outcome</Text>
          </Stack>
        </Card>

        <Card withBorder shadow="sm" p="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">Optimistic</Text>
              <ThemeIcon size="sm" variant="light" color="green">
                <IconTrendingUp size={14} />
              </ThemeIcon>
            </Group>
            <Title order={2} c="green">
              <NumberFormatter value={revenueForecasts[0].optimistic} prefix="$" thousandSeparator />
            </Title>
            <Text size="xs" c="dimmed">Best-case scenario</Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Detailed Forecast Table */}
      <Card withBorder shadow="sm">
        <Card.Section withBorder p="md" bg="gray.0">
          <Title order={4}>Revenue Forecast by Period</Title>
        </Card.Section>
        <Card.Section>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Period</Table.Th>
                <Table.Th>Conservative</Table.Th>
                <Table.Th>Likely</Table.Th>
                <Table.Th>Optimistic</Table.Th>
                <Table.Th>Confidence</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {revenueForecasts.map((forecast, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Text fw={600}>{forecast.period}</Text>
                  </Table.Td>
                  <Table.Td>
                    <NumberFormatter value={forecast.conservative} prefix="$" thousandSeparator />
                  </Table.Td>
                  <Table.Td>
                    <Text fw={600} c="blue">
                      <NumberFormatter value={forecast.likely} prefix="$" thousandSeparator />
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <NumberFormatter value={forecast.optimistic} prefix="$" thousandSeparator />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Progress value={forecast.confidence} w={100} size="sm" />
                      <Text size="sm">{forecast.confidence}%</Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card.Section>
      </Card>

      {/* Forecast Methodology */}
      <Alert icon={<IconBrain size={16} />} color="blue" variant="light" title="Forecast Methodology">
        <Text size="sm">
          Revenue predictions are calculated using historical conversion data, current pipeline velocity, 
          seasonal trends, and individual lead scores. Confidence levels reflect data quality and historical accuracy.
        </Text>
      </Alert>
    </Stack>
  );

  return (
    <Stack gap="lg">
      {/* Header */}
      <Paper withBorder p="lg" radius="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Group justify="space-between">
          <Group>
            <ThemeIcon size={50} radius="md" variant="white" color="violet">
              <IconBrain size={28} />
            </ThemeIcon>
            <div>
              <Title order={3} c="white">AI Predictions & Forecasting</Title>
              <Text size="sm" c="white" opacity={0.9}>
                Advanced lead predictions and revenue forecasting powered by machine learning
              </Text>
            </div>
          </Group>
          <Button variant="white" leftSection={<IconRefresh size={16} />}>
            Refresh
          </Button>
        </Group>
      </Paper>

      {/* Controls */}
      <Card withBorder shadow="sm" p="md">
        <Group justify="space-between" wrap="wrap">
          <SegmentedControl
            value={viewMode}
            onChange={setViewMode}
            data={[
              { label: 'Lead Predictions', value: 'leads' },
              { label: 'Revenue Forecast', value: 'revenue' },
            ]}
          />

          <Group gap="md">
            <Select
              value={timeframe}
              onChange={(value) => setTimeframe(value || '30')}
              data={[
                { value: '30', label: 'Next 30 Days' },
                { value: '60', label: 'Next 60 Days' },
                { value: '90', label: 'Next Quarter' },
                { value: '180', label: 'Next 6 Months' },
              ]}
              w={150}
            />
            <Select
              value={selectedSegment}
              onChange={(value) => setSelectedSegment(value || 'all')}
              data={[
                { value: 'all', label: 'All Segments' },
                { value: 'enterprise', label: 'Enterprise' },
                { value: 'mid-market', label: 'Mid-Market' },
                { value: 'smb', label: 'SMB' },
              ]}
              w={150}
            />
          </Group>
        </Group>
      </Card>

      {/* Main Content */}
      {viewMode === 'leads' ? renderLeadPredictions() : renderRevenueForecast()}
    </Stack>
  );
}

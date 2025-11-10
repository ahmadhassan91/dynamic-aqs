'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  SimpleGrid,
  Select,
  Button,
  ThemeIcon,
  Box,
  Progress,
  Badge,
  Table,
  ActionIcon,
  Menu,
  Modal,
  Tabs,
  Alert,
  RingProgress,
  Center,
  Divider,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconTarget,
  IconClock,
  IconChartBar,
  IconCalendar,
  IconDownload,
  IconEye,
  IconDots,
  IconArrowUp,
  IconArrowDown,
  IconMinus,
  IconFilter,
  IconRefresh,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { DatePickerInput } from '@mantine/dates';

interface ConversionMetrics {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageConversionTime: number; // in days
  conversionValue: number; // total revenue from converted leads
  periodComparison: {
    leadsChange: number;
    conversionRateChange: number;
    timeChange: number;
    valueChange: number;
  };
}

interface ConversionFunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropoffRate: number;
  averageTimeInStage: number; // in days
}

interface ConversionTrend {
  date: string;
  leads: number;
  conversions: number;
  rate: number;
  value: number;
}

interface ConversionSource {
  source: string;
  leads: number;
  conversions: number;
  rate: number;
  averageValue: number;
  totalValue: number;
}

interface ConversionPerformance {
  territoryManager: string;
  territory: string;
  leads: number;
  conversions: number;
  rate: number;
  averageTime: number;
  totalValue: number;
}

export function ConversionAnalytics() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date(),
  ]);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [metrics, setMetrics] = useState<ConversionMetrics | null>(null);
  const [funnelData, setFunnelData] = useState<ConversionFunnelStage[]>([]);
  const [trendData, setTrendData] = useState<ConversionTrend[]>([]);
  const [sourceData, setSourceData] = useState<ConversionSource[]>([]);
  const [performanceData, setPerformanceData] = useState<ConversionPerformance[]>([]);
  
  const [detailOpened, { open: openDetail, close: closeDetail }] = useDisclosure(false);
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  useEffect(() => {
    // Generate mock analytics data
    const mockMetrics: ConversionMetrics = {
      totalLeads: 247,
      convertedLeads: 58,
      conversionRate: 23.5,
      averageConversionTime: 12.3,
      conversionValue: 2840000,
      periodComparison: {
        leadsChange: 8.2,
        conversionRateChange: 2.1,
        timeChange: -1.5,
        valueChange: 15.7,
      },
    };

    const mockFunnel: ConversionFunnelStage[] = [
      {
        stage: 'New Leads',
        count: 247,
        percentage: 100,
        dropoffRate: 0,
        averageTimeInStage: 1.2,
      },
      {
        stage: 'Qualified',
        count: 189,
        percentage: 76.5,
        dropoffRate: 23.5,
        averageTimeInStage: 3.1,
      },
      {
        stage: 'Discovery',
        count: 142,
        percentage: 57.5,
        dropoffRate: 24.9,
        averageTimeInStage: 5.8,
      },
      {
        stage: 'Proposal',
        count: 89,
        percentage: 36.0,
        dropoffRate: 37.3,
        averageTimeInStage: 4.2,
      },
      {
        stage: 'Won',
        count: 58,
        percentage: 23.5,
        dropoffRate: 34.8,
        averageTimeInStage: 2.1,
      },
    ];

    const mockTrends: ConversionTrend[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
      const leads = Math.floor(Math.random() * 15) + 5;
      const conversions = Math.floor(leads * (0.15 + Math.random() * 0.2));
      return {
        date: date.toISOString().split('T')[0],
        leads,
        conversions,
        rate: (conversions / leads) * 100,
        value: conversions * (30000 + Math.random() * 20000),
      };
    });

    const mockSources: ConversionSource[] = [
      {
        source: 'Website',
        leads: 89,
        conversions: 24,
        rate: 27.0,
        averageValue: 42000,
        totalValue: 1008000,
      },
      {
        source: 'Referral',
        leads: 67,
        conversions: 19,
        rate: 28.4,
        averageValue: 48000,
        totalValue: 912000,
      },
      {
        source: 'Trade Show',
        leads: 45,
        conversions: 8,
        rate: 17.8,
        averageValue: 38000,
        totalValue: 304000,
      },
      {
        source: 'HubSpot',
        leads: 46,
        conversions: 7,
        rate: 15.2,
        averageValue: 35000,
        totalValue: 245000,
      },
    ];

    const mockPerformance: ConversionPerformance[] = [
      {
        territoryManager: 'John Smith',
        territory: 'Northeast',
        leads: 52,
        conversions: 15,
        rate: 28.8,
        averageTime: 10.5,
        totalValue: 720000,
      },
      {
        territoryManager: 'Sarah Johnson',
        territory: 'Southeast',
        leads: 48,
        conversions: 13,
        rate: 27.1,
        averageTime: 11.2,
        totalValue: 624000,
      },
      {
        territoryManager: 'Mike Wilson',
        territory: 'Midwest',
        leads: 41,
        conversions: 10,
        rate: 24.4,
        averageTime: 13.8,
        totalValue: 480000,
      },
      {
        territoryManager: 'Lisa Davis',
        territory: 'West Coast',
        leads: 39,
        conversions: 9,
        rate: 23.1,
        averageTime: 12.9,
        totalValue: 432000,
      },
      {
        territoryManager: 'Tom Brown',
        territory: 'Southwest',
        leads: 35,
        conversions: 6,
        rate: 17.1,
        averageTime: 15.2,
        totalValue: 288000,
      },
      {
        territoryManager: 'Amy Chen',
        territory: 'Northwest',
        leads: 32,
        conversions: 5,
        rate: 15.6,
        averageTime: 16.1,
        totalValue: 240000,
      },
    ];

    setMetrics(mockMetrics);
    setFunnelData(mockFunnel);
    setTrendData(mockTrends);
    setSourceData(mockSources);
    setPerformanceData(mockPerformance);
  }, [dateRange, selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <IconArrowUp size={14} color="green" />;
    if (change < 0) return <IconArrowDown size={14} color="red" />;
    return <IconMinus size={14} color="gray" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'green';
    if (change < 0) return 'red';
    return 'gray';
  };

  if (!metrics) return null;

  return (
    <Stack gap="md">
      {/* Header Controls */}
      <Card withBorder p="md">
        <Group justify="space-between">
          <div>
            <Text fw={600} size="lg">Conversion Analytics</Text>
            <Text size="sm" c="dimmed">
              Track lead conversion performance and identify optimization opportunities
            </Text>
          </div>
          
          <Group gap="sm">
            <Select
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value || '30d')}
              data={[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 90 days' },
                { value: '1y', label: 'Last year' },
                { value: 'custom', label: 'Custom range' },
              ]}
              w={150}
            />
            
            <Button variant="light" leftSection={<IconDownload size={16} />}>
              Export
            </Button>
            
            <ActionIcon variant="light">
              <IconRefresh size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Card>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="funnel" leftSection={<IconTarget size={16} />}>
            Conversion Funnel
          </Tabs.Tab>
          <Tabs.Tab value="sources" leftSection={<IconUsers size={16} />}>
            Lead Sources
          </Tabs.Tab>
          <Tabs.Tab value="performance" leftSection={<IconTrendingUp size={16} />}>
            Team Performance
          </Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview">
          <Stack gap="md">
            {/* Key Metrics Cards */}
            <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
              <Card withBorder p="md">
                <Group justify="space-between" mb="xs">
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Total Leads
                  </Text>
                  <ThemeIcon color="blue" variant="light" size="sm">
                    <IconUsers size={16} />
                  </ThemeIcon>
                </Group>
                <Text size="xl" fw={700} mb="xs">
                  {metrics.totalLeads.toLocaleString()}
                </Text>
                <Group gap={4}>
                  {getChangeIcon(metrics.periodComparison.leadsChange)}
                  <Text size="xs" c={getChangeColor(metrics.periodComparison.leadsChange)}>
                    {Math.abs(metrics.periodComparison.leadsChange)}% vs last period
                  </Text>
                </Group>
              </Card>

              <Card withBorder p="md">
                <Group justify="space-between" mb="xs">
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Conversion Rate
                  </Text>
                  <ThemeIcon color="green" variant="light" size="sm">
                    <IconTarget size={16} />
                  </ThemeIcon>
                </Group>
                <Text size="xl" fw={700} mb="xs">
                  {formatPercentage(metrics.conversionRate)}
                </Text>
                <Group gap={4}>
                  {getChangeIcon(metrics.periodComparison.conversionRateChange)}
                  <Text size="xs" c={getChangeColor(metrics.periodComparison.conversionRateChange)}>
                    {Math.abs(metrics.periodComparison.conversionRateChange)}% vs last period
                  </Text>
                </Group>
              </Card>

              <Card withBorder p="md">
                <Group justify="space-between" mb="xs">
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Avg. Conversion Time
                  </Text>
                  <ThemeIcon color="orange" variant="light" size="sm">
                    <IconClock size={16} />
                  </ThemeIcon>
                </Group>
                <Text size="xl" fw={700} mb="xs">
                  {metrics.averageConversionTime.toFixed(1)} days
                </Text>
                <Group gap={4}>
                  {getChangeIcon(-metrics.periodComparison.timeChange)}
                  <Text size="xs" c={getChangeColor(-metrics.periodComparison.timeChange)}>
                    {Math.abs(metrics.periodComparison.timeChange)} days vs last period
                  </Text>
                </Group>
              </Card>

              <Card withBorder p="md">
                <Group justify="space-between" mb="xs">
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Conversion Value
                  </Text>
                  <ThemeIcon color="violet" variant="light" size="sm">
                    <IconTrendingUp size={16} />
                  </ThemeIcon>
                </Group>
                <Text size="xl" fw={700} mb="xs">
                  {formatCurrency(metrics.conversionValue)}
                </Text>
                <Group gap={4}>
                  {getChangeIcon(metrics.periodComparison.valueChange)}
                  <Text size="xs" c={getChangeColor(metrics.periodComparison.valueChange)}>
                    {Math.abs(metrics.periodComparison.valueChange)}% vs last period
                  </Text>
                </Group>
              </Card>
            </SimpleGrid>

            {/* Conversion Rate Visualization */}
            <Card withBorder p="md">
              <Group justify="space-between" mb="md">
                <Text fw={600} size="lg">Conversion Rate Overview</Text>
                <Badge color="green" variant="light">
                  {formatPercentage(metrics.conversionRate)}
                </Badge>
              </Group>
              
              <Center>
                <RingProgress
                  size={200}
                  thickness={20}
                  sections={[
                    { value: metrics.conversionRate, color: 'green', tooltip: `${metrics.convertedLeads} conversions` },
                    { value: 100 - metrics.conversionRate, color: 'gray.3', tooltip: `${metrics.totalLeads - metrics.convertedLeads} not converted` },
                  ]}
                  label={
                    <Center>
                      <div style={{ textAlign: 'center' }}>
                        <Text size="xl" fw={700}>
                          {formatPercentage(metrics.conversionRate)}
                        </Text>
                        <Text size="sm" c="dimmed">
                          Conversion Rate
                        </Text>
                      </div>
                    </Center>
                  }
                />
              </Center>
              
              <SimpleGrid cols={2} spacing="md" mt="md">
                <div style={{ textAlign: 'center' }}>
                  <Text size="lg" fw={600} c="green">
                    {metrics.convertedLeads}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Converted Leads
                  </Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text size="lg" fw={600} c="gray">
                    {metrics.totalLeads - metrics.convertedLeads}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Not Converted
                  </Text>
                </div>
              </SimpleGrid>
            </Card>

            {/* Recent Trends */}
            <Card withBorder p="md">
              <Text fw={600} size="lg" mb="md">Recent Conversion Trends</Text>
              <Text size="sm" c="dimmed" mb="md">
                Daily conversion performance over the last 30 days
              </Text>
              
              {/* Simplified trend visualization */}
              <Stack gap="xs">
                {trendData.slice(-7).map((trend, index) => (
                  <Group key={trend.date} justify="space-between" p="xs" style={{ backgroundColor: index % 2 === 0 ? 'var(--mantine-color-gray-0)' : 'transparent' }}>
                    <Text size="sm">{new Date(trend.date).toLocaleDateString()}</Text>
                    <Group gap="md">
                      <Text size="sm">{trend.leads} leads</Text>
                      <Text size="sm" c="green">{trend.conversions} conversions</Text>
                      <Badge size="sm" color={trend.rate > 20 ? 'green' : trend.rate > 15 ? 'yellow' : 'red'} variant="light">
                        {formatPercentage(trend.rate)}
                      </Badge>
                      <Text size="sm" c="dimmed">{formatCurrency(trend.value)}</Text>
                    </Group>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Conversion Funnel Tab */}
        <Tabs.Panel value="funnel">
          <Stack gap="md">
            <Card withBorder p="md">
              <Text fw={600} size="lg" mb="md">Conversion Funnel Analysis</Text>
              <Text size="sm" c="dimmed" mb="md">
                Track leads through each stage of the conversion process
              </Text>
              
              <Stack gap="md">
                {funnelData.map((stage, index) => (
                  <Card key={stage.stage} withBorder p="md" bg={index === 0 ? 'blue.0' : undefined}>
                    <Group justify="space-between" mb="sm">
                      <Text fw={600}>{stage.stage}</Text>
                      <Group gap="md">
                        <Badge color="blue" variant="light">
                          {stage.count} leads
                        </Badge>
                        <Badge color="green" variant="light">
                          {formatPercentage(stage.percentage)}
                        </Badge>
                        {index > 0 && (
                          <Badge color="red" variant="light">
                            -{formatPercentage(stage.dropoffRate)} dropoff
                          </Badge>
                        )}
                      </Group>
                    </Group>
                    
                    <Progress
                      value={stage.percentage}
                      size="lg"
                      color={stage.percentage > 50 ? 'green' : stage.percentage > 25 ? 'yellow' : 'red'}
                      radius="xl"
                      mb="sm"
                    />
                    
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Avg. time in stage: {stage.averageTimeInStage.toFixed(1)} days
                      </Text>
                      {index < funnelData.length - 1 && (
                        <Text size="sm" c="red">
                          {funnelData[index + 1] ? stage.count - funnelData[index + 1].count : 0} leads lost to next stage
                        </Text>
                      )}
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Card>

            {/* Funnel Optimization Insights */}
            <Card withBorder p="md">
              <Text fw={600} size="lg" mb="md">Optimization Insights</Text>
              <Stack gap="sm">
                <Alert color="yellow" variant="light">
                  <Text size="sm" fw={500}>High dropoff at Discovery stage</Text>
                  <Text size="xs" c="dimmed">
                    24.9% of qualified leads are lost during discovery. Consider improving discovery call processes.
                  </Text>
                </Alert>
                
                <Alert color="blue" variant="light">
                  <Text size="sm" fw={500}>Strong proposal conversion</Text>
                  <Text size="xs" c="dimmed">
                    65.2% of leads that reach proposal stage convert successfully. Proposal quality is high.
                  </Text>
                </Alert>
                
                <Alert color="orange" variant="light">
                  <Text size="sm" fw={500}>Long qualification time</Text>
                  <Text size="xs" c="dimmed">
                    Average 3.1 days in qualification stage. Consider streamlining qualification criteria.
                  </Text>
                </Alert>
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Lead Sources Tab */}
        <Tabs.Panel value="sources">
          <Stack gap="md">
            <Card withBorder p="md">
              <Text fw={600} size="lg" mb="md">Lead Source Performance</Text>
              
              <Table.ScrollContainer minWidth={600}>
                <Table verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Source</Table.Th>
                      <Table.Th>Leads</Table.Th>
                      <Table.Th>Conversions</Table.Th>
                      <Table.Th>Rate</Table.Th>
                      <Table.Th>Avg. Value</Table.Th>
                      <Table.Th>Total Value</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {sourceData.map((source) => (
                      <Table.Tr key={source.source}>
                        <Table.Td>
                          <Text fw={500}>{source.source}</Text>
                        </Table.Td>
                        <Table.Td>{source.leads}</Table.Td>
                        <Table.Td>
                          <Text c="green">{source.conversions}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={source.rate > 25 ? 'green' : source.rate > 20 ? 'yellow' : 'red'}
                            variant="light"
                          >
                            {formatPercentage(source.rate)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>{formatCurrency(source.averageValue)}</Table.Td>
                        <Table.Td>
                          <Text fw={500}>{formatCurrency(source.totalValue)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Menu shadow="md" width={200}>
                            <Menu.Target>
                              <ActionIcon variant="subtle" size="sm">
                                <IconDots size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item leftSection={<IconEye size={14} />}>
                                View Details
                              </Menu.Item>
                              <Menu.Item leftSection={<IconChartBar size={14} />}>
                                Source Analytics
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Card>

            {/* Source Insights */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              <Card withBorder p="md">
                <Text fw={600} mb="md">Top Performing Source</Text>
                <Group justify="space-between" mb="sm">
                  <Text size="lg" fw={600}>Referral</Text>
                  <Badge color="green" variant="light">Best ROI</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="sm">
                  Highest conversion rate at 28.4% with strong average deal value
                </Text>
                <SimpleGrid cols={2} spacing="sm">
                  <div>
                    <Text size="xs" c="dimmed">Conversion Rate</Text>
                    <Text size="sm" fw={500}>28.4%</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">Avg. Deal Value</Text>
                    <Text size="sm" fw={500}>{formatCurrency(48000)}</Text>
                  </div>
                </SimpleGrid>
              </Card>

              <Card withBorder p="md">
                <Text fw={600} mb="md">Improvement Opportunity</Text>
                <Group justify="space-between" mb="sm">
                  <Text size="lg" fw={600}>HubSpot</Text>
                  <Badge color="orange" variant="light">Needs Attention</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="sm">
                  Lowest conversion rate at 15.2% despite good lead volume
                </Text>
                <SimpleGrid cols={2} spacing="sm">
                  <div>
                    <Text size="xs" c="dimmed">Conversion Rate</Text>
                    <Text size="sm" fw={500} c="orange">15.2%</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">Potential Value</Text>
                    <Text size="sm" fw={500}>{formatCurrency(161000)}</Text>
                  </div>
                </SimpleGrid>
              </Card>
            </SimpleGrid>
          </Stack>
        </Tabs.Panel>

        {/* Team Performance Tab */}
        <Tabs.Panel value="performance">
          <Stack gap="md">
            <Card withBorder p="md">
              <Text fw={600} size="lg" mb="md">Territory Manager Performance</Text>
              
              <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Manager</Table.Th>
                      <Table.Th>Territory</Table.Th>
                      <Table.Th>Leads</Table.Th>
                      <Table.Th>Conversions</Table.Th>
                      <Table.Th>Rate</Table.Th>
                      <Table.Th>Avg. Time</Table.Th>
                      <Table.Th>Total Value</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {performanceData.map((perf) => (
                      <Table.Tr key={perf.territoryManager}>
                        <Table.Td>
                          <Text fw={500}>{perf.territoryManager}</Text>
                        </Table.Td>
                        <Table.Td>{perf.territory}</Table.Td>
                        <Table.Td>{perf.leads}</Table.Td>
                        <Table.Td>
                          <Text c="green">{perf.conversions}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={perf.rate > 25 ? 'green' : perf.rate > 20 ? 'yellow' : 'red'}
                            variant="light"
                          >
                            {formatPercentage(perf.rate)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text c={perf.averageTime < 12 ? 'green' : perf.averageTime < 15 ? 'yellow' : 'red'}>
                            {perf.averageTime.toFixed(1)} days
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={500}>{formatCurrency(perf.totalValue)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Menu shadow="md" width={200}>
                            <Menu.Target>
                              <ActionIcon variant="subtle" size="sm">
                                <IconDots size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item leftSection={<IconEye size={14} />}>
                                View Details
                              </Menu.Item>
                              <Menu.Item leftSection={<IconChartBar size={14} />}>
                                Performance Report
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Card>

            {/* Performance Insights */}
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
              <Card withBorder p="md">
                <Text fw={600} mb="md">Top Performer</Text>
                <Group justify="space-between" mb="sm">
                  <Text size="lg" fw={600}>John Smith</Text>
                  <Badge color="green" variant="light">🏆 #1</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="sm">
                  Northeast territory with 28.8% conversion rate
                </Text>
                <Text size="xs" c="green">
                  +5.3% above average conversion rate
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={600} mb="md">Fastest Converter</Text>
                <Group justify="space-between" mb="sm">
                  <Text size="lg" fw={600}>John Smith</Text>
                  <Badge color="blue" variant="light">⚡ Fastest</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="sm">
                  Average conversion time of 10.5 days
                </Text>
                <Text size="xs" c="blue">
                  1.8 days faster than average
                </Text>
              </Card>

              <Card withBorder p="md">
                <Text fw={600} mb="md">Needs Support</Text>
                <Group justify="space-between" mb="sm">
                  <Text size="lg" fw={600}>Amy Chen</Text>
                  <Badge color="orange" variant="light">📈 Focus</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="sm">
                  Northwest territory with 15.6% conversion rate
                </Text>
                <Text size="xs" c="orange">
                  -7.9% below average conversion rate
                </Text>
              </Card>
            </SimpleGrid>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
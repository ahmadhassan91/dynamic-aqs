'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Stack,
  Group,
  Text,
  Title,
  Badge,
  Progress,
  Grid,
  Select,
  Button,
  ActionIcon,
  Tooltip,
  Alert,
  RingProgress,
  Table,
  ScrollArea,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconTarget,
  IconCurrency,
  IconCalendar,
  IconDownload,
  IconRefresh,
  IconInfoCircle,
  IconChartBar,
  IconMapPin,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import type { MockCustomer, MockUser } from '@/lib/mockData/generators';

interface TerritoryMetrics {
  territoryId: string;
  territoryName: string;
  managerId: string;
  managerName: string;
  totalCustomers: number;
  activeCustomers: number;
  prospectCustomers: number;
  totalRevenue: number;
  averageRevenue: number;
  conversionRate: number;
  customerGrowth: number;
  revenueGrowth: number;
  coverage: number;
  efficiency: number;
  lastUpdated: Date;
}

interface PerformanceComparison {
  territoryId: string;
  territoryName: string;
  metric: string;
  value: number;
  benchmark: number;
  variance: number;
  trend: 'up' | 'down' | 'stable';
}

export function TerritoryPerformanceAnalytics() {
  const { customers, territories, users } = useMockData();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const territoryManagers = users.filter(user => user.role === 'territory_manager');
  
  const regions = [
    { id: '1', name: 'Eastern Region' },
    { id: '2', name: 'Central Region' },
    { id: '3', name: 'Western Region' },
  ];

  // Calculate territory metrics
  const territoryMetrics = useMemo((): TerritoryMetrics[] => {
    return territories.map(territory => {
      const manager = territoryManagers.find(tm => tm.id === `tm-${territory.id}`);
      const territoryCustomers = customers.filter(c => c.territoryManagerId === `tm-${territory.id}`);
      
      const activeCustomers = territoryCustomers.filter(c => c.status === 'active');
      const prospectCustomers = territoryCustomers.filter(c => c.status === 'prospect');
      const totalRevenue = territoryCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);
      const averageRevenue = territoryCustomers.length > 0 ? totalRevenue / territoryCustomers.length : 0;
      
      // Mock calculations for demonstration
      const conversionRate = prospectCustomers.length > 0 ? 
        (activeCustomers.length / (activeCustomers.length + prospectCustomers.length)) * 100 : 100;
      const customerGrowth = Math.random() * 20 - 5; // -5% to +15%
      const revenueGrowth = Math.random() * 30 - 10; // -10% to +20%
      const coverage = Math.random() * 40 + 60; // 60% to 100%
      const efficiency = Math.random() * 30 + 70; // 70% to 100%

      return {
        territoryId: territory.id,
        territoryName: territory.name,
        managerId: manager?.id || '',
        managerName: manager ? `${manager.firstName} ${manager.lastName}` : 'Unassigned',
        totalCustomers: territoryCustomers.length,
        activeCustomers: activeCustomers.length,
        prospectCustomers: prospectCustomers.length,
        totalRevenue,
        averageRevenue,
        conversionRate,
        customerGrowth,
        revenueGrowth,
        coverage,
        efficiency,
        lastUpdated: new Date(),
      };
    });
  }, [territories, customers, territoryManagers]);

  // Filter metrics by region
  const filteredMetrics = territoryMetrics.filter(metric => {
    const territory = territories.find(t => t.id === metric.territoryId);
    return !selectedRegion || territory?.regionId === selectedRegion;
  });

  // Calculate performance comparisons
  const performanceComparisons = useMemo((): PerformanceComparison[] => {
    const comparisons: PerformanceComparison[] = [];
    const avgRevenue = filteredMetrics.reduce((sum, m) => sum + m.totalRevenue, 0) / filteredMetrics.length;
    const avgCustomers = filteredMetrics.reduce((sum, m) => sum + m.totalCustomers, 0) / filteredMetrics.length;
    const avgConversion = filteredMetrics.reduce((sum, m) => sum + m.conversionRate, 0) / filteredMetrics.length;

    filteredMetrics.forEach(metric => {
      comparisons.push({
        territoryId: metric.territoryId,
        territoryName: metric.territoryName,
        metric: 'Revenue',
        value: metric.totalRevenue,
        benchmark: avgRevenue,
        variance: ((metric.totalRevenue - avgRevenue) / avgRevenue) * 100,
        trend: metric.revenueGrowth > 0 ? 'up' : metric.revenueGrowth < -2 ? 'down' : 'stable',
      });
    });

    return comparisons;
  }, [filteredMetrics]);

  // Prepare chart data
  const revenueChartData = filteredMetrics.map(metric => ({
    territory: metric.territoryName.substring(0, 10),
    revenue: Math.round(metric.totalRevenue / 1000), // Convert to thousands
    customers: metric.totalCustomers,
  }));

  const conversionChartData = filteredMetrics.map(metric => ({
    territory: metric.territoryName.substring(0, 10),
    conversion: Math.round(metric.conversionRate),
    coverage: Math.round(metric.coverage),
  }));

  const donutChartData = filteredMetrics.map((metric, index) => ({
    name: metric.territoryName,
    value: metric.totalRevenue,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index % 5],
  }));

  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleExportReport = () => {
    // Simulate export
    setTimeout(() => {
      alert('Performance report exported successfully!');
    }, 500);
  };

  // Calculate overall metrics
  const totalCustomers = filteredMetrics.reduce((sum, m) => sum + m.totalCustomers, 0);
  const totalRevenue = filteredMetrics.reduce((sum, m) => sum + m.totalRevenue, 0);
  const avgConversionRate = filteredMetrics.reduce((sum, m) => sum + m.conversionRate, 0) / filteredMetrics.length;
  const avgCoverage = filteredMetrics.reduce((sum, m) => sum + m.coverage, 0) / filteredMetrics.length;

  return (
    <Stack gap="lg">
      {/* Controls */}
      <Card withBorder p="md">
        <Group justify="space-between">
          <Group gap="md">
            <Select
              label="Time Period"
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value || '30')}
              data={[
                { value: '7', label: 'Last 7 days' },
                { value: '30', label: 'Last 30 days' },
                { value: '90', label: 'Last 90 days' },
                { value: '365', label: 'Last year' },
              ]}
              w={150}
            />
            <Select
              label="Region"
              placeholder="All Regions"
              value={selectedRegion}
              onChange={setSelectedRegion}
              data={regions.map(r => ({ value: r.id, label: r.name }))}
              clearable
              w={150}
            />
            <Select
              label="Primary Metric"
              value={selectedMetric}
              onChange={(value) => setSelectedMetric(value || 'revenue')}
              data={[
                { value: 'revenue', label: 'Revenue' },
                { value: 'customers', label: 'Customers' },
                { value: 'conversion', label: 'Conversion Rate' },
                { value: 'coverage', label: 'Coverage' },
              ]}
              w={150}
            />
          </Group>
          <Group gap="sm">
            <Tooltip label="Refresh Data">
              <ActionIcon
                variant="light"
                onClick={handleRefreshData}
                loading={isLoading}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            </Tooltip>
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={handleExportReport}
            >
              Export Report
            </Button>
          </Group>
        </Group>
      </Card>

      {/* Key Metrics Overview */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group gap="sm">
              <IconUsers size={24} color="blue" />
              <div>
                <Text size="xs" c="dimmed">Total Customers</Text>
                <Text fw={700} size="xl">{totalCustomers.toLocaleString()}</Text>
                <Text size="xs" c="green">
                  <IconTrendingUp size={12} /> +5.2% vs last period
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group gap="sm">
              <IconCurrency size={24} color="green" />
              <div>
                <Text size="xs" c="dimmed">Total Revenue</Text>
                <Text fw={700} size="xl">
                  ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Text>
                <Text size="xs" c="green">
                  <IconTrendingUp size={12} /> +8.1% vs last period
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group gap="sm">
              <IconTarget size={24} color="orange" />
              <div>
                <Text size="xs" c="dimmed">Avg Conversion Rate</Text>
                <Text fw={700} size="xl">{avgConversionRate.toFixed(1)}%</Text>
                <Text size="xs" c="red">
                  <IconTrendingDown size={12} /> -1.3% vs last period
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card withBorder p="md">
            <Group gap="sm">
              <IconMapPin size={24} color="purple" />
              <div>
                <Text size="xs" c="dimmed">Avg Coverage</Text>
                <Text fw={700} size="xl">{avgCoverage.toFixed(1)}%</Text>
                <Text size="xs" c="green">
                  <IconTrendingUp size={12} /> +2.7% vs last period
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Charts Section */}
      <Grid>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card withBorder p="md" h={400}>
            <Stack gap="md" h="100%">
              <Group justify="space-between">
                <Title order={4}>Territory Performance Comparison</Title>
                <Badge variant="light" leftSection={<IconChartBar size={12} />}>
                  {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                </Badge>
              </Group>
              
              {selectedMetric === 'revenue' && (
                <Stack gap="sm">
                  {revenueChartData.map((item, index) => (
                    <div key={index}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">{item.territory}</Text>
                        <Text size="sm" fw={500}>${item.revenue}K</Text>
                      </Group>
                      <Progress 
                        value={(item.revenue / Math.max(...revenueChartData.map(d => d.revenue))) * 100} 
                        color="blue" 
                        size="md"
                      />
                    </div>
                  ))}
                </Stack>
              )}
              
              {selectedMetric === 'conversion' && (
                <Stack gap="sm">
                  {conversionChartData.map((item, index) => (
                    <div key={index}>
                      <Text size="sm" mb="xs">{item.territory}</Text>
                      <Group gap="md">
                        <div style={{ flex: 1 }}>
                          <Group justify="space-between" mb="xs">
                            <Text size="xs" c="dimmed">Conversion</Text>
                            <Text size="xs" fw={500}>{item.conversion}%</Text>
                          </Group>
                          <Progress value={item.conversion} color="green" size="sm" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <Group justify="space-between" mb="xs">
                            <Text size="xs" c="dimmed">Coverage</Text>
                            <Text size="xs" fw={500}>{item.coverage}%</Text>
                          </Group>
                          <Progress value={item.coverage} color="orange" size="sm" />
                        </div>
                      </Group>
                    </div>
                  ))}
                </Stack>
              )}
              
              {(selectedMetric === 'customers' || selectedMetric === 'coverage') && (
                <Stack gap="sm">
                  {revenueChartData.map((item, index) => (
                    <div key={index}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">{item.territory}</Text>
                        <Text size="sm" fw={500}>{item.customers || Math.floor(item.revenue / 10)} customers</Text>
                      </Group>
                      <Progress 
                        value={((item.customers || Math.floor(item.revenue / 10)) / Math.max(...revenueChartData.map(d => d.customers || Math.floor(d.revenue / 10)))) * 100} 
                        color="purple" 
                        size="md"
                      />
                    </div>
                  ))}
                </Stack>
              )}
            </Stack>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card withBorder p="md" h={400}>
            <Stack gap="md" h="100%">
              <Title order={4}>Revenue Distribution</Title>
              <Stack gap="xs">
                {donutChartData.slice(0, 5).map((item, index) => {
                  const total = donutChartData.reduce((sum, d) => sum + d.value, 0);
                  const percentage = ((item.value / total) * 100).toFixed(1);
                  return (
                    <Group key={index} justify="space-between">
                      <Group gap="xs">
                        <div 
                          style={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                          }} 
                        />
                        <Text size="sm">{item.name}</Text>
                      </Group>
                      <Text size="sm" fw={500}>{percentage}%</Text>
                    </Group>
                  );
                })}
              </Stack>
              <Text size="sm" c="dimmed" ta="center">
                Revenue breakdown by territory
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Performance Table */}
      <Card withBorder p="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={4}>Territory Performance Details</Title>
            <Badge variant="light">
              {filteredMetrics.length} territories
            </Badge>
          </Group>
          
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Territory</Table.Th>
                  <Table.Th>Manager</Table.Th>
                  <Table.Th>Customers</Table.Th>
                  <Table.Th>Revenue</Table.Th>
                  <Table.Th>Conversion</Table.Th>
                  <Table.Th>Coverage</Table.Th>
                  <Table.Th>Efficiency</Table.Th>
                  <Table.Th>Growth</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredMetrics.map((metric) => (
                  <Table.Tr key={metric.territoryId}>
                    <Table.Td>
                      <Text fw={500}>{metric.territoryName}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{metric.managerName}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Text>{metric.totalCustomers}</Text>
                        <Badge size="xs" color="blue">
                          {metric.activeCustomers} active
                        </Badge>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>
                        ${metric.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Progress
                          value={metric.conversionRate}
                          size="sm"
                          w={60}
                          color={metric.conversionRate > 70 ? 'green' : metric.conversionRate > 50 ? 'yellow' : 'red'}
                        />
                        <Text size="sm">{metric.conversionRate.toFixed(1)}%</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <RingProgress
                        size={40}
                        thickness={4}
                        sections={[
                          { value: metric.coverage, color: metric.coverage > 80 ? 'green' : 'orange' }
                        ]}
                        label={
                          <Text size="xs" ta="center">
                            {metric.coverage.toFixed(0)}%
                          </Text>
                        }
                      />
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={metric.efficiency > 85 ? 'green' : metric.efficiency > 70 ? 'yellow' : 'red'}
                        variant="light"
                      >
                        {metric.efficiency.toFixed(0)}%
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {metric.revenueGrowth > 0 ? (
                          <IconTrendingUp size={14} color="green" />
                        ) : (
                          <IconTrendingDown size={14} color="red" />
                        )}
                        <Text
                          size="sm"
                          c={metric.revenueGrowth > 0 ? 'green' : 'red'}
                        >
                          {metric.revenueGrowth > 0 ? '+' : ''}{metric.revenueGrowth.toFixed(1)}%
                        </Text>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>
      </Card>

      {/* Optimization Recommendations */}
      <Card withBorder p="md">
        <Stack gap="md">
          <Group gap="sm">
            <IconInfoCircle size={20} color="blue" />
            <Title order={4}>Optimization Recommendations</Title>
          </Group>
          
          <Grid>
            {performanceComparisons
              .filter(comp => Math.abs(comp.variance) > 15)
              .slice(0, 3)
              .map((comp, index) => (
                <Grid.Col key={index} span={{ base: 12, md: 4 }}>
                  <Alert
                    color={comp.variance > 0 ? 'green' : 'orange'}
                    title={comp.territoryName}
                  >
                    <Text size="sm">
                      {comp.variance > 0 ? 'Outperforming' : 'Underperforming'} by{' '}
                      <strong>{Math.abs(comp.variance).toFixed(1)}%</strong> in {comp.metric.toLowerCase()}.
                      {comp.variance < 0 && ' Consider territory restructuring or additional support.'}
                      {comp.variance > 0 && ' Great performance! Share best practices with other territories.'}
                    </Text>
                  </Alert>
                </Grid.Col>
              ))}
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}
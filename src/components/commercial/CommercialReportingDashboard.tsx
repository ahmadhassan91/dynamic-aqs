'use client';

import React, { useState, useEffect } from 'react';
import {
  Title, Text, Card, Group, Stack, Select, Button, ThemeIcon,
  Loader, Center, SimpleGrid, Badge, Progress
} from '@mantine/core';
import {
  IconBriefcase, IconCurrencyDollar, IconTrendingUp,
  IconFileTypePdf, IconFileTypeXls, IconFileTypeCsv, IconChartPie
} from '@tabler/icons-react';
import { 
  CommercialReportData,
  OpportunityFilters
} from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

export function CommercialReportingDashboard() {
  const [reportData, setReportData] = useState<CommercialReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('6m');

  useEffect(() => {
    loadReportData();
  }, [selectedTimeRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const data = await commercialService.generateCommercialReport({});
      setReportData(data);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exportReport = (format: string) => {
    alert(`Report exported as ${format.toUpperCase()}`);
  };

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!reportData) {
    return (
      <Card withBorder padding="xl" className="commercial-card-static">
        <Center h={200}>
          <Stack align="center">
            <ThemeIcon size={60} radius="xl" variant="light" color="gray">
              <IconBriefcase size={30} />
            </ThemeIcon>
            <Text size="lg" fw={500}>No report data available</Text>
            <Text size="sm" c="dimmed">Try adjusting your filters</Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  const { metrics } = reportData;

  return (
    <Stack gap="xl">
      {/* Controls */}
      <Group justify="space-between">
        <Select
          value={selectedTimeRange}
          onChange={(value) => setSelectedTimeRange(value || '6m')}
          data={[
            { value: '3m', label: 'Last 3 Months' },
            { value: '6m', label: 'Last 6 Months' },
            { value: '12m', label: 'Last 12 Months' }
          ]}
          w={200}
        />
        <Group>
          <Button variant="light" leftSection={<IconFileTypePdf size={16} />} onClick={() => exportReport('pdf')}>
            PDF
          </Button>
          <Button variant="light" leftSection={<IconFileTypeXls size={16} />} onClick={() => exportReport('excel')}>
            Excel
          </Button>
          <Button variant="light" leftSection={<IconFileTypeCsv size={16} />} onClick={() => exportReport('csv')}>
            CSV
          </Button>
        </Group>
      </Group>

      {/* Key Metrics */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        <Card withBorder padding="md" className="commercial-stat-card">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Total Opportunities</Text>
            <ThemeIcon variant="light" color="blue" size="sm">
              <IconBriefcase size={16} />
            </ThemeIcon>
          </Group>
          <Text className="commercial-stat-value">{metrics.totalOpportunities}</Text>
          <Text size="xs" c="dimmed" mt="xs">Active in pipeline</Text>
        </Card>

        <Card withBorder padding="md" className="commercial-stat-card">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Pipeline Value</Text>
            <ThemeIcon variant="light" color="green" size="sm">
              <IconCurrencyDollar size={16} />
            </ThemeIcon>
          </Group>
          <Text className="commercial-stat-value">{formatCurrency(metrics.totalValue)}</Text>
          <Text size="xs" c="dimmed" mt="xs">Total estimated value</Text>
        </Card>

        <Card withBorder padding="md" className="commercial-stat-card">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Conversion Rate</Text>
            <ThemeIcon variant="light" color="violet" size="sm">
              <IconTrendingUp size={16} />
            </ThemeIcon>
          </Group>
          <Text className="commercial-stat-value">{formatPercentage(metrics.conversionRate)}</Text>
          <Progress value={metrics.conversionRate} size="sm" color="violet" mt="xs" />
        </Card>

        <Card withBorder padding="md" className="commercial-stat-card">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Avg Deal Size</Text>
            <ThemeIcon variant="light" color="orange" size="sm">
              <IconChartPie size={16} />
            </ThemeIcon>
          </Group>
          <Text className="commercial-stat-value">{formatCurrency(metrics.averageValue)}</Text>
          <Text size="xs" c="dimmed" mt="xs">Per opportunity</Text>
        </Card>
      </SimpleGrid>

      {/* Pipeline by Phase */}
      <Card withBorder padding="lg" className="commercial-card-static">
        <Title order={3} mb="md">Pipeline by Sales Phase</Title>
        <Stack gap="md">
          {Object.entries(metrics.pipelineByPhase).map(([phase, count]) => {
            const value = metrics.valueByPhase[phase as keyof typeof metrics.valueByPhase] || 0;
            const percentage = (count / metrics.totalOpportunities) * 100;
            
            return (
              <div key={phase}>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>{phase}</Text>
                  <Group gap="md">
                    <Text size="sm" c="dimmed">{count} opportunities</Text>
                    <Text size="sm" fw={600}>{formatCurrency(value)}</Text>
                  </Group>
                </Group>
                <Progress value={percentage} size="lg" color="blue" />
              </div>
            );
          })}
        </Stack>
      </Card>

      {/* Market Segments */}
      <Card withBorder padding="lg" className="commercial-card-static">
        <Title order={3} mb="md">Opportunities by Market Segment</Title>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {Object.entries(metrics.opportunitiesBySegment).map(([segment, count]) => {
            const percentage = (count / metrics.totalOpportunities) * 100;
            
            return (
              <Card key={segment} withBorder padding="md" className="commercial-card">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>{segment}</Text>
                  <Badge variant="light" className={`badge-segment-${segment.toLowerCase().replace(' ', '-')}`}>
                    {count}
                  </Badge>
                </Group>
                <Progress value={percentage} size="md" color="green" />
                <Text size="xs" c="dimmed" mt="xs">{formatPercentage(percentage)} of total</Text>
              </Card>
            );
          })}
        </SimpleGrid>
      </Card>
    </Stack>
  );
}

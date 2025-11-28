'use client';

import { useState } from 'react';
import { Paper, Text, Group, Stack, ThemeIcon, ActionIcon, Collapse, Grid, Badge, RingProgress, Center } from '@mantine/core';
import { LineChart, PieChart, BarChart } from '@mantine/charts';
import { IconChevronDown, IconChevronUp, IconX, IconMaximize, IconDotsVertical } from '@tabler/icons-react';

interface DashboardWidgetProps {
  type: 'metric' | 'line-chart' | 'pie-chart' | 'bar-chart' | 'metric-grid';
  title: string;
  data: any;
  isCustomizing?: boolean;
}

export function DashboardWidget({ type, title, data, isCustomizing }: DashboardWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const renderMetric = (metric: any) => {
    const IconComponent = metric.icon;
    const isIncrease = metric.changeType === 'increase';
    
    return (
      <Stack align="center" gap="xs">
        <ThemeIcon size={48} radius="md" variant="light" color={metric.color}>
          {typeof metric.icon === 'string' ? (
            <Text size="xl">{metric.icon}</Text>
          ) : IconComponent ? (
            <IconComponent size={28} />
          ) : null}
        </ThemeIcon>
        
        <Text size="xl" fw={700}>{metric.value}</Text>
        <Text size="sm" c="dimmed">{metric.title}</Text>
        
        <Badge 
          color={isIncrease ? 'green' : 'red'} 
          variant="light"
          leftSection={isIncrease ? '↗' : '↘'}
        >
          {Math.abs(metric.change)}%
        </Badge>
      </Stack>
    );
  };

  const renderLineChart = (chartData: any[]) => (
    <LineChart
      h={250}
      data={chartData}
      dataKey="name"
      series={[
        { name: 'value', color: 'blue.6', label: 'Revenue' }
      ]}
      curveType="monotone"
      withLegend={false}
      tickLine="y"
      gridAxis="xy"
    />
  );

  const renderPieChart = (chartData: any[]) => (
    <Center>
      <PieChart
        h={250}
        data={chartData}
        withTooltip
        withLabels
        labelsPosition="outside"
        labelsType="percent"
      />
    </Center>
  );

  const renderBarChart = (chartData: any[]) => (
    <BarChart
      h={250}
      data={chartData}
      dataKey="name"
      series={[
        { name: 'value', color: 'teal.6', label: 'Sessions' }
      ]}
      tickLine="y"
    />
  );

  const renderMetricGrid = (metrics: any[]) => (
    <Grid>
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Grid.Col span={6} key={index}>
            <Paper withBorder p="sm" radius="md" bg="var(--mantine-color-gray-0)">
              <Stack align="center" gap={4}>
                <ThemeIcon size="lg" variant="white" color={metric.color}>
                  {typeof metric.icon === 'string' ? (
                    <Text>{metric.icon}</Text>
                  ) : IconComponent ? (
                    <IconComponent size={20} />
                  ) : null}
                </ThemeIcon>
                <Text fw={700}>{metric.value}</Text>
                <Text size="xs" c="dimmed" ta="center" lh={1.2}>{metric.title}</Text>
              </Stack>
            </Paper>
          </Grid.Col>
        );
      })}
    </Grid>
  );

  const renderContent = () => {
    switch (type) {
      case 'metric':
        return renderMetric(data);
      case 'line-chart':
        return renderLineChart(data);
      case 'pie-chart':
        return renderPieChart(data);
      case 'bar-chart':
        return renderBarChart(data);
      case 'metric-grid':
        return renderMetricGrid(data);
      default:
        return <Text>Unsupported widget type</Text>;
    }
  };

  return (
    <Paper 
      shadow="sm" 
      radius="md" 
      p="md" 
      withBorder 
      style={{ 
        borderColor: isCustomizing ? 'var(--mantine-color-blue-4)' : undefined,
        borderWidth: isCustomizing ? 2 : 1
      }}
    >
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">{title}</Text>
        <Group gap="xs">
          {isCustomizing && (
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical size={16} />
            </ActionIcon>
          )}
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          </ActionIcon>
        </Group>
      </Group>
      
      <Collapse in={isExpanded}>
        {renderContent()}
      </Collapse>
      
      {isExpanded && (
        <Group justify="space-between" mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <Text size="xs" c="dimmed">Last updated: {new Date().toLocaleTimeString()}</Text>
          <Text size="xs" c="blue" style={{ cursor: 'pointer' }}>View Details</Text>
        </Group>
      )}
    </Paper>
  );
}

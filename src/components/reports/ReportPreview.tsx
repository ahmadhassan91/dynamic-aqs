'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Table,
  Card,
  SimpleGrid,
  Loader,
  Center,
  Badge,
  Select
} from '@mantine/core';
import {
  IconFileTypeCsv,
  IconFileTypeXls,
  IconFileTypePdf,
  IconTable,
  IconChartBar,
  IconReportAnalytics
} from '@tabler/icons-react';

interface ReportPreviewProps {
  config: any;
  fields: any[];
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
}

export function ReportPreview({ config, fields, onExport }: ReportPreviewProps) {
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewFormat, setViewFormat] = useState<'table' | 'chart' | 'summary'>('table');

  useEffect(() => {
    generatePreviewData();
  }, [config]);

  const generatePreviewData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockData = Array.from({ length: 20 }, (_, i) => {
        const row: any = {};
        
        config.fields.forEach((fieldId: string) => {
          const field = fields.find(f => f.id === fieldId);
          if (field) {
            switch (field.type) {
              case 'string':
                if (fieldId.includes('name') || fieldId.includes('Name')) {
                  row[fieldId] = `Sample ${field.name} ${i + 1}`;
                } else if (fieldId.includes('status') || fieldId.includes('Status')) {
                  row[fieldId] = ['Active', 'Inactive', 'Pending', 'Completed'][Math.floor(Math.random() * 4)];
                } else {
                  row[fieldId] = `${field.name} Value ${i + 1}`;
                }
                break;
              case 'number':
                if (fieldId.includes('revenue') || fieldId.includes('amount') || fieldId.includes('Amount')) {
                  row[fieldId] = (Math.random() * 100000 + 1000).toFixed(2);
                } else if (fieldId.includes('score') || fieldId.includes('rating')) {
                  row[fieldId] = (Math.random() * 100).toFixed(1);
                } else {
                  row[fieldId] = Math.floor(Math.random() * 1000);
                }
                break;
              case 'date':
                const randomDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
                row[fieldId] = randomDate.toISOString().split('T')[0];
                break;
              case 'boolean':
                row[fieldId] = Math.random() > 0.5;
                break;
              default:
                row[fieldId] = `Value ${i + 1}`;
            }
          }
        });
        
        return row;
      });
      
      setPreviewData(mockData);
      setIsLoading(false);
    }, 500);
  };

  const renderTablePreview = () => (
    <Paper shadow="sm" withBorder>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {config.fields.map((fieldId: string) => {
              const field = fields.find(f => f.id === fieldId);
              return (
                <Table.Th key={fieldId}>
                  {field?.name || fieldId}
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {previewData.slice(0, 10).map((row, index) => (
            <Table.Tr key={index}>
              {config.fields.map((fieldId: string) => (
                <Table.Td key={fieldId}>
                  {formatCellValue(row[fieldId], fields.find(f => f.id === fieldId)?.type)}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {previewData.length > 10 && (
        <Paper p="sm" bg="gray.0">
          <Text ta="center" size="sm" c="dimmed">
            Showing 10 of {previewData.length} rows
          </Text>
        </Paper>
      )}
    </Paper>
  );

  const renderChartPreview = () => {
    if (config.groupBy.length === 0) {
      return (
        <Paper p="xl" withBorder>
          <Text ta="center" c="dimmed">
            Charts require at least one "Group By" field. Please add grouping fields in the Fields step.
          </Text>
        </Paper>
      );
    }

    // Generate chart data based on groupBy fields
    const chartData = generateChartData();

    return (
      <Stack gap="md">
        <Group justify="center" gap="sm">
          {['bar', 'line', 'pie', 'area'].map(type => (
            <Button
              key={type}
              size="xs"
              variant={config.chartType === type ? 'filled' : 'light'}
              onClick={() => {/* Chart type change should be handled by parent */}}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </Group>
        
        <Paper p="md" withBorder style={{ height: 300 }}>
          <Center h="100%">
            {config.chartType === 'bar' && renderBarChart(chartData)}
            {config.chartType === 'line' && renderLineChart(chartData)}
            {config.chartType === 'pie' && renderPieChart(chartData)}
            {config.chartType === 'area' && renderAreaChart(chartData)}
          </Center>
        </Paper>
      </Stack>
    );
  };

  const generateChartData = () => {
    const groupField = config.groupBy[0];
    const field = fields.find(f => f.id === groupField);
    
    if (field?.type === 'string') {
      return [
        { name: 'Category A', value: Math.floor(Math.random() * 100) + 20 },
        { name: 'Category B', value: Math.floor(Math.random() * 100) + 20 },
        { name: 'Category C', value: Math.floor(Math.random() * 100) + 20 },
        { name: 'Category D', value: Math.floor(Math.random() * 100) + 20 },
      ];
    }
    
    return Array.from({ length: 6 }, (_, i) => ({
      name: `Group ${i + 1}`,
      value: Math.floor(Math.random() * 100) + 20
    }));
  };

  const renderBarChart = (data: any[]) => (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%' }}>
      {data.map((item, index) => {
        const barHeight = (item.value / Math.max(...data.map(d => d.value))) * 150;
        const x = 50 + index * 60;
        const y = 170 - barHeight;
        
        return (
          <g key={index}>
            <rect
              x={x}
              y={y}
              width="40"
              height={barHeight}
              fill="var(--mantine-color-blue-6)"
              rx="4"
            />
            <text
              x={x + 20}
              y="185"
              textAnchor="middle"
              fontSize="10"
              fill="var(--mantine-color-gray-6)"
            >
              {item.name}
            </text>
            <text
              x={x + 20}
              y={y - 5}
              textAnchor="middle"
              fontSize="10"
              fill="var(--mantine-color-dark-7)"
            >
              {item.value}
            </text>
          </g>
        );
      })}
    </svg>
  );

  const renderLineChart = (data: any[]) => (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%' }}>
      <polyline
        fill="none"
        stroke="var(--mantine-color-blue-6)"
        strokeWidth="3"
        points={data.map((item, index) => 
          `${50 + index * 60},${170 - (item.value / Math.max(...data.map(d => d.value))) * 150}`
        ).join(' ')}
      />
      {data.map((item, index) => (
        <g key={index}>
          <circle
            cx={50 + index * 60}
            cy={170 - (item.value / Math.max(...data.map(d => d.value))) * 150}
            r="4"
            fill="var(--mantine-color-blue-6)"
          />
          <text
            x={50 + index * 60}
            y="185"
            textAnchor="middle"
            fontSize="10"
            fill="var(--mantine-color-gray-6)"
          >
            {item.name}
          </text>
        </g>
      ))}
    </svg>
  );

  const renderPieChart = (data: any[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <Center>
        <svg viewBox="0 0 200 200" style={{ width: 200, height: 200 }}>
          {data.map((item, index) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={`hsl(${index * 60}, 70%, 50%)`}
              />
            );
          })}
        </svg>
      </Center>
    );
  };

  const renderAreaChart = (data: any[]) => (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--mantine-color-blue-6)" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="var(--mantine-color-blue-6)" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      <polygon
        fill="url(#areaGradient)"
        points={`50,170 ${data.map((item, index) => 
          `${50 + index * 60},${170 - (item.value / Math.max(...data.map(d => d.value))) * 150}`
        ).join(' ')} ${50 + (data.length - 1) * 60},170`}
      />
      <polyline
        fill="none"
        stroke="var(--mantine-color-blue-6)"
        strokeWidth="2"
        points={data.map((item, index) => 
          `${50 + index * 60},${170 - (item.value / Math.max(...data.map(d => d.value))) * 150}`
        ).join(' ')}
      />
    </svg>
  );

  const renderSummaryPreview = () => {
    const summaryStats = calculateSummaryStats();
    
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {summaryStats.map((stat, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="xs">
              <Text size="sm" c="dimmed" fw={500}>{stat.label}</Text>
              <Text size="xl" fw={700}>{stat.value}</Text>
              <Text size="sm" c="dimmed">{stat.description}</Text>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    );
  };

  const calculateSummaryStats = () => {
    const stats = [];
    
    // Total records
    stats.push({
      label: 'Total Records',
      value: previewData.length.toLocaleString(),
      description: 'Total number of records in the report'
    });
    
    // Calculate stats for numeric fields
    const numericFields = config.fields.filter((fieldId: string) => {
      const field = fields.find(f => f.id === fieldId);
      return field?.type === 'number';
    });
    
    numericFields.slice(0, 3).forEach((fieldId: string) => {
      const field = fields.find(f => f.id === fieldId);
      const values = previewData.map(row => parseFloat(row[fieldId]) || 0);
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      
      stats.push({
        label: `Avg ${field?.name}`,
        value: fieldId.includes('revenue') || fieldId.includes('amount') 
          ? `$${avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
          : avg.toFixed(1),
        description: `Average value across all records`
      });
    });
    
    return stats;
  };

  const formatCellValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'number':
        if (typeof value === 'string' && (value.includes('revenue') || value.includes('amount'))) {
          return `$${parseFloat(value).toLocaleString()}`;
        }
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return value;
    }
  };

  if (config.fields.length === 0) {
    return (
      <Paper p="xl" withBorder>
        <Center>
          <Stack align="center" gap="md">
            <IconTable size={48} color="var(--mantine-color-gray-4)" />
            <Title order={4}>No Fields Selected</Title>
            <Text c="dimmed" ta="center">
              Please select fields in the Fields & Grouping step to preview your report.
            </Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      {/* Format Selection */}
      <Group justify="space-between">
        <Group gap="sm">
          <Button
            variant={viewFormat === 'table' ? 'filled' : 'light'}
            leftSection={<IconTable size={16} />}
            onClick={() => setViewFormat('table')}
          >
            Table View
          </Button>
          <Button
            variant={viewFormat === 'chart' ? 'filled' : 'light'}
            leftSection={<IconChartBar size={16} />}
            onClick={() => setViewFormat('chart')}
          >
            Chart View
          </Button>
          <Button
            variant={viewFormat === 'summary' ? 'filled' : 'light'}
            leftSection={<IconReportAnalytics size={16} />}
            onClick={() => setViewFormat('summary')}
          >
            Summary View
          </Button>
        </Group>
        
        <Group gap="xs">
          <Button
            size="xs"
            color="green"
            leftSection={<IconFileTypeCsv size={14} />}
            onClick={() => onExport('csv')}
          >
            CSV
          </Button>
          <Button
            size="xs"
            color="blue"
            leftSection={<IconFileTypeXls size={14} />}
            onClick={() => onExport('excel')}
          >
            Excel
          </Button>
          <Button
            size="xs"
            color="red"
            leftSection={<IconFileTypePdf size={14} />}
            onClick={() => onExport('pdf')}
          >
            PDF
          </Button>
        </Group>
      </Group>

      {/* Preview Content */}
      {isLoading ? (
        <Paper p="xl" withBorder>
          <Center>
            <Group gap="md">
              <Loader size="sm" />
              <Text c="dimmed">Generating preview...</Text>
            </Group>
          </Center>
        </Paper>
      ) : (
        <>
          {viewFormat === 'table' && renderTablePreview()}
          {viewFormat === 'chart' && renderChartPreview()}
          {viewFormat === 'summary' && renderSummaryPreview()}
        </>
      )}

      {/* Report Configuration Summary */}
      <Paper p="md" bg="gray.0" radius="md">
        <Title order={5} mb="sm">Report Configuration</Title>
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          <Group gap="xs">
            <Text fw={500} size="sm">Fields:</Text>
            <Badge variant="light">{config.fields.length}</Badge>
          </Group>
          <Group gap="xs">
            <Text fw={500} size="sm">Grouping:</Text>
            <Badge variant="light">{config.groupBy.length || 'None'}</Badge>
          </Group>
          <Group gap="xs">
            <Text fw={500} size="sm">Filters:</Text>
            <Badge variant="light">{config.filters.length || 'None'}</Badge>
          </Group>
          <Group gap="xs">
            <Text fw={500} size="sm">Records:</Text>
            <Badge variant="light">{previewData.length}</Badge>
          </Group>
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
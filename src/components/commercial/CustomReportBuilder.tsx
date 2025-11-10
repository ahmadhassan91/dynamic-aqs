'use client';

import React, { useState } from 'react';
import {
  Title, Text, Card, Group, Stack, Select, Button, MultiSelect,
  Checkbox, Paper, Divider, Badge, Alert
} from '@mantine/core';
import {
  IconFilter, IconDownload, IconChartBar, IconTable,
  IconCalendar, IconBuilding, IconUsers, IconInfoCircle
} from '@tabler/icons-react';

interface ReportConfig {
  reportType: string;
  dateRange: string;
  metrics: string[];
  groupBy: string[];
  filters: {
    markets?: string[];
    reps?: string[];
    opportunityStages?: string[];
  };
}

export function CustomReportBuilder() {
  const [config, setConfig] = useState<ReportConfig>({
    reportType: 'opportunities',
    dateRange: '6m',
    metrics: [],
    groupBy: [],
    filters: {}
  });

  const reportTypes = [
    { value: 'opportunities', label: 'Opportunities Analysis' },
    { value: 'revenue', label: 'Revenue Report' },
    { value: 'pipeline', label: 'Pipeline Analysis' },
    { value: 'rep-performance', label: 'Rep Performance' },
    { value: 'market-segments', label: 'Market Segments' },
    { value: 'conversion', label: 'Conversion Rates' }
  ];

  const dateRanges = [
    { value: '1m', label: 'Last Month' },
    { value: '3m', label: 'Last 3 Months' },
    { value: '6m', label: 'Last 6 Months' },
    { value: 'ytd', label: 'Year to Date' },
    { value: '1y', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const availableMetrics = {
    opportunities: [
      { value: 'total_value', label: 'Total Opportunity Value' },
      { value: 'count', label: 'Opportunity Count' },
      { value: 'avg_value', label: 'Average Deal Size' },
      { value: 'win_rate', label: 'Win Rate' },
      { value: 'conversion_time', label: 'Average Conversion Time' },
      { value: 'stage_distribution', label: 'Stage Distribution' }
    ],
    revenue: [
      { value: 'total_revenue', label: 'Total Revenue' },
      { value: 'recurring_revenue', label: 'Recurring Revenue' },
      { value: 'growth_rate', label: 'Growth Rate' },
      { value: 'revenue_by_market', label: 'Revenue by Market' }
    ],
    pipeline: [
      { value: 'pipeline_value', label: 'Total Pipeline Value' },
      { value: 'weighted_pipeline', label: 'Weighted Pipeline' },
      { value: 'velocity', label: 'Pipeline Velocity' },
      { value: 'coverage_ratio', label: 'Pipeline Coverage Ratio' }
    ]
  };

  const groupByOptions = [
    { value: 'rep', label: 'Manufacturer Rep' },
    { value: 'market', label: 'Market Segment' },
    { value: 'stage', label: 'Opportunity Stage' },
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'organization', label: 'Organization' }
  ];

  const markets = [
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'commercial', label: 'Commercial Office' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'retail', label: 'Retail' },
    { value: 'hospitality', label: 'Hospitality' }
  ];

  const opportunityStages = [
    { value: 'prospecting', label: 'Prospecting' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ];

  const handleGenerateReport = () => {
    console.log('Generating report with config:', config);
    // Implement report generation logic
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting report as ${format}`);
    // Implement export logic
  };

  const getCurrentMetrics = () => {
    const type = config.reportType as keyof typeof availableMetrics;
    return availableMetrics[type] || availableMetrics.opportunities;
  };

  return (
    <Stack gap="xl">
      <div>
        <Title order={2}>Custom Report Builder</Title>
        <Text size="sm" c="dimmed" mt="xs">
          Create tailored reports based on your specific business needs and metrics
        </Text>
      </div>

      <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
        Select your report parameters below and click "Generate Report" to create a custom analysis
      </Alert>

      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Stack gap="lg">
          {/* Report Type Selection */}
          <div>
            <Group mb="xs">
              <IconChartBar size={20} />
              <Text fw={500}>Report Type</Text>
            </Group>
            <Select
              placeholder="Select report type"
              data={reportTypes}
              value={config.reportType}
              onChange={(value) => setConfig({ ...config, reportType: value || 'opportunities', metrics: [] })}
            />
          </div>

          <Divider />

          {/* Date Range Selection */}
          <div>
            <Group mb="xs">
              <IconCalendar size={20} />
              <Text fw={500}>Date Range</Text>
            </Group>
            <Select
              placeholder="Select date range"
              data={dateRanges}
              value={config.dateRange}
              onChange={(value) => setConfig({ ...config, dateRange: value || '6m' })}
            />
          </div>

          <Divider />

          {/* Metrics Selection */}
          <div>
            <Group mb="xs">
              <IconTable size={20} />
              <Text fw={500}>Metrics to Include</Text>
            </Group>
            <MultiSelect
              placeholder="Select metrics"
              data={getCurrentMetrics()}
              value={config.metrics}
              onChange={(value) => setConfig({ ...config, metrics: value })}
              searchable
              clearable
            />
          </div>

          <Divider />

          {/* Group By Options */}
          <div>
            <Group mb="xs">
              <IconFilter size={20} />
              <Text fw={500}>Group Results By</Text>
            </Group>
            <MultiSelect
              placeholder="Select grouping options"
              data={groupByOptions}
              value={config.groupBy}
              onChange={(value) => setConfig({ ...config, groupBy: value })}
              searchable
              clearable
            />
          </div>

          <Divider />

          {/* Filters */}
          <div>
            <Text fw={500} mb="md">Filters</Text>
            
            <Stack gap="md">
              <div>
                <Group mb="xs">
                  <IconBuilding size={18} />
                  <Text size="sm">Market Segments</Text>
                </Group>
                <MultiSelect
                  placeholder="Filter by market segments"
                  data={markets}
                  value={config.filters.markets || []}
                  onChange={(value) => setConfig({ 
                    ...config, 
                    filters: { ...config.filters, markets: value }
                  })}
                  searchable
                  clearable
                />
              </div>

              <div>
                <Group mb="xs">
                  <IconUsers size={18} />
                  <Text size="sm">Opportunity Stages</Text>
                </Group>
                <MultiSelect
                  placeholder="Filter by stages"
                  data={opportunityStages}
                  value={config.filters.opportunityStages || []}
                  onChange={(value) => setConfig({ 
                    ...config, 
                    filters: { ...config.filters, opportunityStages: value }
                  })}
                  searchable
                  clearable
                />
              </div>
            </Stack>
          </div>
        </Stack>
      </Paper>

      {/* Action Buttons */}
      <Group justify="space-between">
        <Group>
          <Button
            leftSection={<IconChartBar size={18} />}
            onClick={handleGenerateReport}
            size="md"
            disabled={config.metrics.length === 0}
          >
            Generate Report
          </Button>
          <Button
            variant="light"
            onClick={() => setConfig({
              reportType: 'opportunities',
              dateRange: '6m',
              metrics: [],
              groupBy: [],
              filters: {}
            })}
          >
            Reset
          </Button>
        </Group>

        <Group>
          <Button
            variant="outline"
            leftSection={<IconDownload size={18} />}
            onClick={() => handleExport('pdf')}
            disabled={config.metrics.length === 0}
          >
            Export PDF
          </Button>
          <Button
            variant="outline"
            leftSection={<IconDownload size={18} />}
            onClick={() => handleExport('excel')}
            disabled={config.metrics.length === 0}
          >
            Export Excel
          </Button>
        </Group>
      </Group>

      {/* Preview Section */}
      {config.metrics.length > 0 && (
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={600} size="lg">Report Preview</Text>
              <Badge color="blue" variant="light">
                {config.metrics.length} Metric{config.metrics.length !== 1 ? 's' : ''} Selected
              </Badge>
            </Group>
            
            <Divider />
            
            <div>
              <Text size="sm" fw={500} mb="xs">Report Configuration:</Text>
              <Stack gap="xs">
                <Group gap="xs">
                  <Text size="sm" c="dimmed">Type:</Text>
                  <Badge size="sm" variant="dot">
                    {reportTypes.find(t => t.value === config.reportType)?.label}
                  </Badge>
                </Group>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">Date Range:</Text>
                  <Badge size="sm" variant="dot">
                    {dateRanges.find(d => d.value === config.dateRange)?.label}
                  </Badge>
                </Group>
                {config.groupBy.length > 0 && (
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">Grouped By:</Text>
                    {config.groupBy.map((g) => (
                      <Badge key={g} size="sm" variant="dot">
                        {groupByOptions.find(o => o.value === g)?.label}
                      </Badge>
                    ))}
                  </Group>
                )}
              </Stack>
            </div>
            
            <Text size="xs" c="dimmed" ta="center" mt="md">
              Click "Generate Report" to view the complete analysis
            </Text>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}

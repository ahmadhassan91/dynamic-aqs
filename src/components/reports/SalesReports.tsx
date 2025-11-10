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
  Badge,
  Select,
  SimpleGrid,
  Card,
  Tabs
} from '@mantine/core';
import { ReportFilters } from './ReportFilters';
import { ReportScheduler } from './ReportScheduler';
import { generateAllMockData } from '@/lib/mockData/generators';

interface SalesData {
  territoryManager: string;
  territory: string;
  region: string;
  totalRevenue: number;
  totalOrders: number;
  avgDealSize: number;
  conversionRate: number;
  customersAcquired: number;
  trainingCompleted: number;
}

interface PerformanceMetrics {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  leads: number;
}

export function SalesReports() {
  const [activeReport, setActiveReport] = useState<'sales' | 'performance' | 'comparative'>('sales');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics[]>([]);
  const [filters, setFilters] = useState({
    dateRange: 'last-30-days',
    territory: 'all',
    region: 'all',
    manager: 'all'
  });
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    // Generate mock sales and performance data
    const mockData = generateAllMockData();

    // Calculate sales data by territory manager
    const salesByManager: { [key: string]: SalesData } = {};

    mockData.customers.forEach(customer => {
      const manager = mockData.users.find(u => u.id === customer.territoryManagerId);
      const territory = mockData.territories.find(t => t.id === manager?.territoryId);
      const region = mockData.regions.find(r => r.id === territory?.regionId);

      if (manager && territory && region) {
        const key = manager.id;
        if (!salesByManager[key]) {
          salesByManager[key] = {
            territoryManager: `${manager.firstName} ${manager.lastName}`,
            territory: territory.name,
            region: region.name,
            totalRevenue: 0,
            totalOrders: 0,
            avgDealSize: 0,
            conversionRate: 0,
            customersAcquired: 0,
            trainingCompleted: 0
          };
        }

        salesByManager[key].totalRevenue += customer.totalRevenue;
        salesByManager[key].totalOrders += customer.totalOrders;
        if (customer.status === 'active') {
          salesByManager[key].customersAcquired += 1;
        }
      }
    });

    // Calculate training completion
    mockData.trainingSessions.forEach(session => {
      const customer = mockData.customers.find(c => c.id === session.customerId);
      if (customer && session.status === 'completed') {
        const key = customer.territoryManagerId;
        if (salesByManager[key]) {
          salesByManager[key].trainingCompleted += 1;
        }
      }
    });

    // Calculate derived metrics
    Object.values(salesByManager).forEach(data => {
      data.avgDealSize = data.totalOrders > 0 ? data.totalRevenue / data.totalOrders : 0;
      data.conversionRate = Math.random() * 30 + 70; // Mock conversion rate
    });

    setSalesData(Object.values(salesByManager));

    // Generate performance data over time
    const performanceMetrics: PerformanceMetrics[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      performanceMetrics.push({
        period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: Math.floor(Math.random() * 500000) + 200000,
        orders: Math.floor(Math.random() * 100) + 50,
        customers: Math.floor(Math.random() * 20) + 10,
        leads: Math.floor(Math.random() * 50) + 25
      });
    }

    setPerformanceData(performanceMetrics);
  }, []);

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Mock export functionality
    const filename = `${activeReport}-report-${new Date().toISOString().split('T')[0]}.${format}`;

    if (format === 'csv') {
      const csvContent = activeReport === 'sales'
        ? convertSalesDataToCSV(salesData)
        : convertPerformanceDataToCSV(performanceData);

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Mock PDF/Excel export
      alert(`${format.toUpperCase()} export functionality would be implemented here. File: ${filename}`);
    }
  };

  const convertSalesDataToCSV = (data: SalesData[]): string => {
    const headers = ['Territory Manager', 'Territory', 'Region', 'Total Revenue', 'Total Orders', 'Avg Deal Size', 'Conversion Rate', 'Customers Acquired', 'Training Completed'];
    const rows = data.map(row => [
      row.territoryManager,
      row.territory,
      row.region,
      row.totalRevenue.toFixed(2),
      row.totalOrders.toString(),
      row.avgDealSize.toFixed(2),
      row.conversionRate.toFixed(1) + '%',
      row.customersAcquired.toString(),
      row.trainingCompleted.toString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const convertPerformanceDataToCSV = (data: PerformanceMetrics[]): string => {
    const headers = ['Period', 'Revenue', 'Orders', 'Customers', 'Leads'];
    const rows = data.map(row => [
      row.period,
      row.revenue.toString(),
      row.orders.toString(),
      row.customers.toString(),
      row.leads.toString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const renderSalesReport = () => (
    <Stack gap="md">
      <Paper shadow="sm" p="md">
        <Title order={3} mb="md">Sales Performance by Territory Manager</Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Territory Manager</Table.Th>
              <Table.Th>Territory</Table.Th>
              <Table.Th>Region</Table.Th>
              <Table.Th>Total Revenue</Table.Th>
              <Table.Th>Orders</Table.Th>
              <Table.Th>Avg Deal Size</Table.Th>
              <Table.Th>Conversion Rate</Table.Th>
              <Table.Th>Training Completed</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {salesData.map((row, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Text fw={500}>{row.territoryManager}</Text>
                </Table.Td>
                <Table.Td>
                  <Text c="dimmed">{row.territory}</Text>
                </Table.Td>
                <Table.Td>
                  <Text c="dimmed">{row.region}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>${row.totalRevenue.toLocaleString()}</Text>
                </Table.Td>
                <Table.Td>
                  <Text c="dimmed">{row.totalOrders}</Text>
                </Table.Td>
                <Table.Td>
                  <Text c="dimmed">${row.avgDealSize.toLocaleString()}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={
                      row.conversionRate >= 80 ? 'green' :
                        row.conversionRate >= 70 ? 'yellow' :
                          'red'
                    }
                    variant="light"
                  >
                    {row.conversionRate.toFixed(1)}%
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text c="dimmed">{row.trainingCompleted}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );

  const renderPerformanceReport = () => (
    <Stack gap="md">
      {/* Performance Chart */}
      <Paper shadow="sm" p="md">
        <Title order={3} mb="md">Performance Trends</Title>
        <div style={{ height: 320 }}>
          <svg viewBox="0 0 800 300" style={{ width: '100%', height: '100%' }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <line
                key={i}
                x1="60"
                y1={50 + i * 40}
                x2="750"
                y2={50 + i * 40}
                stroke="var(--mantine-color-gray-3)"
                strokeWidth="1"
              />
            ))}

            {/* Revenue line */}
            <polyline
              fill="none"
              stroke="var(--mantine-color-blue-6)"
              strokeWidth="3"
              points={performanceData.map((item, index) =>
                `${60 + (index * 58)},${250 - (item.revenue / 500000 * 200)}`
              ).join(' ')}
            />

            {/* Orders line */}
            <polyline
              fill="none"
              stroke="var(--mantine-color-green-6)"
              strokeWidth="3"
              points={performanceData.map((item, index) =>
                `${60 + (index * 58)},${250 - (item.orders / 150 * 200)}`
              ).join(' ')}
            />

            {/* Data points */}
            {performanceData.map((item, index) => (
              <g key={index}>
                <circle
                  cx={60 + (index * 58)}
                  cy={250 - (item.revenue / 500000 * 200)}
                  r="4"
                  fill="var(--mantine-color-blue-6)"
                />
                <circle
                  cx={60 + (index * 58)}
                  cy={250 - (item.orders / 150 * 200)}
                  r="4"
                  fill="var(--mantine-color-green-6)"
                />
              </g>
            ))}

            {/* X-axis labels */}
            {performanceData.map((item, index) => (
              <text
                key={index}
                x={60 + (index * 58)}
                y="275"
                textAnchor="middle"
                fontSize="12"
                fill="var(--mantine-color-gray-6)"
              >
                {item.period}
              </text>
            ))}

            {/* Legend */}
            <g transform="translate(60, 20)">
              <circle cx="0" cy="0" r="4" fill="var(--mantine-color-blue-6)" />
              <text x="10" y="4" fontSize="12" fill="var(--mantine-color-dark-7)">Revenue</text>
              <circle cx="80" cy="0" r="4" fill="var(--mantine-color-green-6)" />
              <text x="90" y="4" fontSize="12" fill="var(--mantine-color-dark-7)">Orders</text>
            </g>
          </svg>
        </div>
      </Paper>

      {/* Performance Summary */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {[
          { title: 'Total Revenue', value: `$${performanceData.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}`, change: '+12.5%', color: 'green' },
          { title: 'Total Orders', value: performanceData.reduce((sum, p) => sum + p.orders, 0).toString(), change: '+8.3%', color: 'blue' },
          { title: 'New Customers', value: performanceData.reduce((sum, p) => sum + p.customers, 0).toString(), change: '+15.7%', color: 'violet' },
          { title: 'Leads Generated', value: performanceData.reduce((sum, p) => sum + p.leads, 0).toString(), change: '+6.2%', color: 'orange' }
        ].map((metric, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="xs">
              <Text size="sm" c="dimmed" fw={500}>{metric.title}</Text>
              <Text size="xl" fw={700}>{metric.value}</Text>
              <Text
                size="sm"
                c={metric.change.startsWith('+') ? 'green' : 'red'}
              >
                {metric.change} from last period
              </Text>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );

  const renderComparativeReport = () => (
    <Stack gap="md">
      <Paper shadow="sm" p="md">
        <Title order={3} mb="md">Period-over-Period Comparison</Title>

        {/* Comparison Controls */}
        <Group mb="md">
          <Select
            placeholder="Select comparison period"
            data={[
              { value: 'month', label: 'Current Month vs Previous Month' },
              { value: 'quarter', label: 'Current Quarter vs Previous Quarter' },
              { value: 'year', label: 'Current Year vs Previous Year' }
            ]}
            defaultValue="month"
          />
          <Select
            placeholder="Select territory"
            data={[
              { value: 'all', label: 'All Territories' },
              { value: 'northeast', label: 'Northeast' },
              { value: 'southeast', label: 'Southeast' },
              { value: 'midwest', label: 'Midwest' }
            ]}
            defaultValue="all"
          />
        </Group>

        {/* Comparison Chart */}
        <div style={{ height: 200 }}>
          <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%' }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="60"
                y1={40 + i * 32}
                x2="550"
                y2={40 + i * 32}
                stroke="var(--mantine-color-gray-3)"
                strokeWidth="1"
              />
            ))}

            {/* Comparison bars */}
            {['Revenue', 'Orders', 'Customers', 'Training'].map((metric, index) => {
              const currentValue = Math.random() * 100 + 50;
              const previousValue = Math.random() * 100 + 50;
              const x = 80 + index * 120;

              return (
                <g key={index}>
                  {/* Previous period bar */}
                  <rect
                    x={x}
                    y={180 - previousValue}
                    width="30"
                    height={previousValue}
                    fill="var(--mantine-color-gray-4)"
                    rx="4"
                  />
                  {/* Current period bar */}
                  <rect
                    x={x + 35}
                    y={180 - currentValue}
                    width="30"
                    height={currentValue}
                    fill="var(--mantine-color-blue-6)"
                    rx="4"
                  />
                  {/* Labels */}
                  <text
                    x={x + 32.5}
                    y="195"
                    textAnchor="middle"
                    fontSize="12"
                    fill="var(--mantine-color-gray-6)"
                  >
                    {metric}
                  </text>
                  {/* Values */}
                  <text
                    x={x + 15}
                    y={175 - previousValue}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--mantine-color-gray-6)"
                  >
                    {previousValue.toFixed(0)}
                  </text>
                  <text
                    x={x + 50}
                    y={175 - currentValue}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--mantine-color-dark-7)"
                  >
                    {currentValue.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(60, 20)">
              <rect x="0" y="0" width="15" height="10" fill="var(--mantine-color-gray-4)" rx="2" />
              <text x="20" y="8" fontSize="12" fill="var(--mantine-color-dark-7)">Previous Period</text>
              <rect x="120" y="0" width="15" height="10" fill="var(--mantine-color-blue-6)" rx="2" />
              <text x="140" y="8" fontSize="12" fill="var(--mantine-color-dark-7)">Current Period</text>
            </g>
          </svg>
        </div>
      </Paper>
    </Stack>
  );

  return (
    <Stack gap="md">
      {/* Report Header */}
      <Paper shadow="sm" p="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={2}>Sales & Performance Reports</Title>
            <Text c="dimmed">Comprehensive sales analytics and performance metrics</Text>
          </Stack>
          <Group gap="sm">
            <Button
              variant="light"
              color="violet"
              onClick={() => setShowScheduler(true)}
            >
              Schedule Report
            </Button>
            <Select
              placeholder="Export Report"
              data={[
                { value: 'pdf', label: 'Export as PDF' },
                { value: 'excel', label: 'Export as Excel' },
                { value: 'csv', label: 'Export as CSV' }
              ]}
              onChange={(value) => value && handleExportReport(value as 'pdf' | 'excel' | 'csv')}
            />
          </Group>
        </Group>
      </Paper>

      {/* Filters */}
      <ReportFilters filters={filters} onFiltersChange={setFilters} />

      {/* Report Type Tabs */}
      <Tabs value={activeReport} onChange={(value) => setActiveReport(value as 'sales' | 'performance' | 'comparative')}>
        <Tabs.List>
          <Tabs.Tab value="sales">📊 Sales Performance</Tabs.Tab>
          <Tabs.Tab value="performance">📈 Performance Analytics</Tabs.Tab>
          <Tabs.Tab value="comparative">📉 Comparative Analysis</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="sales" pt="lg">
          {renderSalesReport()}
        </Tabs.Panel>

        <Tabs.Panel value="performance" pt="lg">
          {renderPerformanceReport()}
        </Tabs.Panel>

        <Tabs.Panel value="comparative" pt="lg">
          {renderComparativeReport()}
        </Tabs.Panel>
      </Tabs>

      {/* Report Scheduler Modal */}
      {showScheduler && (
        <ReportScheduler
          reportType={activeReport}
          onClose={() => setShowScheduler(false)}
          onSchedule={(schedule) => {
            console.log('Report scheduled:', schedule);
            setShowScheduler(false);
            alert('Report scheduled successfully!');
          }}
        />
      )}
    </Stack>
  );
}
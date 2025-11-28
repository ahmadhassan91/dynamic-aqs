'use client';

import { useState, useEffect } from 'react';
import { Stack, Group, Title, Text, Button, SimpleGrid, Paper, ThemeIcon } from '@mantine/core';
import { DashboardWidget } from './DashboardWidget';
import { DashboardCustomizer } from './DashboardCustomizer';
import { generateAllMockData } from '@/lib/mockData/generators';
import {
  IconCurrencyDollar,
  IconUsers,
  IconTarget,
  IconSchool,
  IconPackage,
  IconChartBar,
  IconClock
} from '@tabler/icons-react';

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.FC<any>;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export function ExecutiveDashboard() {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [widgets, setWidgets] = useState<string[]>([
    'revenue',
    'customers',
    'leads',
    'training',
    'orders',
    'performance'
  ]);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [chartData, setChartData] = useState<{
    revenue: ChartData[];
    leadConversion: ChartData[];
    trainingCompletion: ChartData[];
  }>({
    revenue: [],
    leadConversion: [],
    trainingCompletion: []
  });

  useEffect(() => {
    // Generate mock data for dashboard
    const mockData = generateAllMockData();
    
    // Calculate metrics
    const totalRevenue = mockData.customers.reduce((sum, customer) => sum + customer.totalRevenue, 0);
    const activeCustomers = mockData.customers.filter(c => c.status === 'active').length;
    const totalLeads = mockData.leads.length;
    const convertedLeads = mockData.leads.filter(l => l.status === 'won').length;
    const completedTraining = mockData.trainingSessions.filter(t => t.status === 'completed').length;
    const totalOrders = mockData.orders.length;
    const deliveredOrders = mockData.orders.filter(o => o.status === 'delivered').length;

    const dashboardMetrics: DashboardMetric[] = [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: `$${(totalRevenue / 1000000).toFixed(1)}M`,
        change: 12.5,
        changeType: 'increase',
        icon: IconCurrencyDollar,
        color: 'green'
      },
      {
        id: 'customers',
        title: 'Active Customers',
        value: activeCustomers,
        change: 8.2,
        changeType: 'increase',
        icon: IconUsers,
        color: 'blue'
      },
      {
        id: 'leads',
        title: 'Lead Conversion',
        value: `${((convertedLeads / totalLeads) * 100).toFixed(1)}%`,
        change: -2.1,
        changeType: 'decrease',
        icon: IconTarget,
        color: 'orange'
      },
      {
        id: 'training',
        title: 'Training Completion',
        value: `${((completedTraining / mockData.trainingSessions.length) * 100).toFixed(1)}%`,
        change: 15.3,
        changeType: 'increase',
        icon: IconSchool,
        color: 'purple'
      },
      {
        id: 'orders',
        title: 'Order Fulfillment',
        value: `${((deliveredOrders / totalOrders) * 100).toFixed(1)}%`,
        change: 5.7,
        changeType: 'increase',
        icon: IconPackage,
        color: 'indigo'
      },
      {
        id: 'performance',
        title: 'Avg Deal Size',
        value: `$${(totalRevenue / mockData.orders.length).toFixed(0)}`,
        change: 3.4,
        changeType: 'increase',
        icon: IconChartBar,
        color: 'teal'
      }
    ];

    setMetrics(dashboardMetrics);

    // Generate chart data
    const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
      value: Math.floor(Math.random() * 500000) + 200000
    }));

    const leadsByStatus = [
      { name: 'New', value: mockData.leads.filter(l => l.status === 'new').length, color: '#3B82F6' },
      { name: 'Qualified', value: mockData.leads.filter(l => l.status === 'qualified').length, color: '#10B981' },
      { name: 'Discovery', value: mockData.leads.filter(l => l.status === 'discovery').length, color: '#F59E0B' },
      { name: 'Proposal', value: mockData.leads.filter(l => l.status === 'proposal').length, color: '#8B5CF6' },
      { name: 'Won', value: convertedLeads, color: '#059669' },
      { name: 'Lost', value: mockData.leads.filter(l => l.status === 'lost').length, color: '#EF4444' }
    ];

    const trainingByType = [
      { name: 'Installation', value: mockData.trainingSessions.filter(t => t.type === 'installation').length, color: '#3B82F6' },
      { name: 'Maintenance', value: mockData.trainingSessions.filter(t => t.type === 'maintenance').length, color: '#10B981' },
      { name: 'Sales', value: mockData.trainingSessions.filter(t => t.type === 'sales').length, color: '#F59E0B' },
      { name: 'Product Knowledge', value: mockData.trainingSessions.filter(t => t.type === 'product_knowledge').length, color: '#8B5CF6' }
    ];

    setChartData({
      revenue: revenueByMonth,
      leadConversion: leadsByStatus,
      trainingCompletion: trainingByType
    });
  }, []);

  const handleWidgetReorder = (newWidgets: string[]) => {
    setWidgets(newWidgets);
  };

  const handleExportDashboard = () => {
    // Mock export functionality
    const dashboardData = {
      metrics,
      chartData,
      widgets,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dashboardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareDashboard = () => {
    // Mock share functionality
    const shareUrl = `${window.location.origin}/reports/shared/${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Dashboard share link copied to clipboard!');
  };

  return (
    <Stack gap="lg">
      {/* Dashboard Header */}
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs">
          <Title order={2}>Executive Dashboard</Title>
          <Text c="dimmed">Real-time key performance indicators and metrics</Text>
        </Stack>
        <Group gap="sm">
          <Button
            onClick={() => setIsCustomizing(!isCustomizing)}
            variant={isCustomizing ? "filled" : "light"}
          >
            {isCustomizing ? 'Done Customizing' : 'Customize'}
          </Button>
          <Button
            onClick={handleShareDashboard}
            color="green"
            variant="light"
          >
            Share
          </Button>
          <Button
            onClick={handleExportDashboard}
            color="gray"
            variant="light"
          >
            Export
          </Button>
        </Group>
      </Group>

      {/* Customization Panel */}
      {isCustomizing && (
        <DashboardCustomizer
          widgets={widgets}
          onWidgetReorder={handleWidgetReorder}
          onClose={() => setIsCustomizing(false)}
        />
      )}

      {/* Key Metrics Grid */}
      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
        {metrics.map((metric) => (
          <DashboardWidget
            key={metric.id}
            type="metric"
            title={metric.title}
            data={metric}
            isCustomizing={isCustomizing}
          />
        ))}
      </SimpleGrid>

      {/* Charts Grid */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <DashboardWidget
          type="line-chart"
          title="Revenue Trend"
          data={chartData.revenue}
          isCustomizing={isCustomizing}
        />
        <DashboardWidget
          type="pie-chart"
          title="Lead Pipeline"
          data={chartData.leadConversion}
          isCustomizing={isCustomizing}
        />
        <DashboardWidget
          type="bar-chart"
          title="Training Sessions by Type"
          data={chartData.trainingCompletion}
          isCustomizing={isCustomizing}
        />
        <DashboardWidget
          type="metric-grid"
          title="Performance Summary"
          data={metrics.slice(0, 4)}
          isCustomizing={isCustomizing}
        />
      </SimpleGrid>

      {/* Recent Activity */}
      <Paper shadow="sm" p="md">
        <Title order={3} mb="md">Recent Activity</Title>
        <Stack gap="sm">
          {[
            { type: 'order', message: 'New order #ORD-12345 from Comfort Systems Inc.', time: '2 minutes ago' },
            { type: 'training', message: 'Training session completed for ABC HVAC', time: '15 minutes ago' },
            { type: 'lead', message: 'New lead assigned to Territory Manager John Smith', time: '1 hour ago' },
            { type: 'customer', message: 'Customer onboarding completed for XYZ Contractors', time: '2 hours ago' },
          ].map((activity, index) => (
            <Group key={index} gap="sm" p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: 'var(--mantine-radius-sm)' }}>
              <ThemeIcon
                size={8}
                radius="xl"
                color={
                  activity.type === 'order' ? 'green' :
                  activity.type === 'training' ? 'blue' :
                  activity.type === 'lead' ? 'orange' : 'violet'
                }
              />
              <Stack gap={2} style={{ flex: 1 }}>
                <Text size="sm">{activity.message}</Text>
                <Text size="xs" c="dimmed">{activity.time}</Text>
              </Stack>
            </Group>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
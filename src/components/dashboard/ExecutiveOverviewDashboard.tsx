'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    Title,
    Text,
    Group,
    Stack,
    Badge,
    Button,
    ThemeIcon,
    SimpleGrid,
    Paper,
    Progress,
    Tabs,
    Center,
    Loader,
    Select,
    RingProgress,
    Flex,
    ActionIcon,
    Menu,
} from '@mantine/core';
import { AreaChart, BarChart, DonutChart } from '@mantine/charts';
import {
    IconTrendingUp,
    IconTrendingDown,
    IconUsers,
    IconCurrencyDollar,
    IconTarget,
    IconChartBar,
    IconBuildingStore,
    IconHome,
    IconCalendar,
    IconArrowUpRight,
    IconArrowDownRight,
    IconDots,
    IconDownload,
    IconRefresh,
    IconFilter,
} from '@tabler/icons-react';

interface ExecutiveMetrics {
    // Overall metrics
    totalRevenue: number;
    revenueGrowth: number;
    totalCustomers: number;
    customerGrowth: number;
    totalOpportunities: number;
    opportunityValue: number;

    // Residential metrics
    residential: {
        revenue: number;
        customers: number;
        trainingsSessions: number;
        activeDeals: number;
        conversionRate: number;
    };

    // Commercial metrics
    commercial: {
        revenue: number;
        opportunities: number;
        pipelineValue: number;
        averageDealSize: number;
        winRate: number;
    };

    // Performance by period
    monthlyRevenue: Array<{ month: string; residential: number; commercial: number; total: number }>;
    quarterlyMetrics: Array<{ quarter: string; revenue: number; growth: number }>;

    // Top performers
    topTerritories: Array<{ name: string; revenue: number; growth: number }>;
    topReps: Array<{ name: string; deals: number; value: number }>;
}

interface DashboardFilters {
    timeRange: string;
    businessUnit: string;
    region?: string;
}

export const ExecutiveOverviewDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DashboardFilters>({
        timeRange: 'ytd',
        businessUnit: 'all'
    });
    const [activeTab, setActiveTab] = useState<string>('overview');

    useEffect(() => {
        loadDashboardData();
    }, [filters]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            // Simulate API call - replace with actual service call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data - replace with actual API call
            const mockMetrics: ExecutiveMetrics = {
                totalRevenue: 12500000,
                revenueGrowth: 15.2,
                totalCustomers: 1250,
                customerGrowth: 8.5,
                totalOpportunities: 89,
                opportunityValue: 3200000,

                residential: {
                    revenue: 8500000,
                    customers: 1100,
                    trainingsSessions: 245,
                    activeDeals: 156,
                    conversionRate: 78.5
                },

                commercial: {
                    revenue: 4000000,
                    opportunities: 89,
                    pipelineValue: 3200000,
                    averageDealSize: 125000,
                    winRate: 42.5
                },

                monthlyRevenue: [
                    { month: 'Jan', residential: 750000, commercial: 320000, total: 1070000 },
                    { month: 'Feb', residential: 820000, commercial: 280000, total: 1100000 },
                    { month: 'Mar', residential: 890000, commercial: 410000, total: 1300000 },
                    { month: 'Apr', residential: 780000, commercial: 380000, total: 1160000 },
                    { month: 'May', residential: 920000, commercial: 450000, total: 1370000 },
                    { month: 'Jun', residential: 850000, commercial: 390000, total: 1240000 },
                ],

                quarterlyMetrics: [
                    { quarter: 'Q1 2024', revenue: 3470000, growth: 12.5 },
                    { quarter: 'Q2 2024', revenue: 3770000, growth: 15.2 },
                    { quarter: 'Q3 2023', revenue: 3200000, growth: 8.1 },
                    { quarter: 'Q4 2023', revenue: 3850000, growth: 18.3 },
                ],

                topTerritories: [
                    { name: 'Northeast Region', revenue: 2100000, growth: 22.1 },
                    { name: 'Southeast Region', revenue: 1950000, growth: 18.5 },
                    { name: 'Midwest Region', revenue: 1800000, growth: 12.3 },
                    { name: 'West Region', revenue: 1650000, growth: 9.8 },
                ],

                topReps: [
                    { name: 'Sarah Johnson', deals: 23, value: 890000 },
                    { name: 'Mike Chen', deals: 19, value: 750000 },
                    { name: 'Lisa Rodriguez', deals: 21, value: 680000 },
                    { name: 'David Kim', deals: 17, value: 620000 },
                ]
            };

            setMetrics(mockMetrics);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
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
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
    };

    const renderOverviewTab = () => {
        if (!metrics) return null;

        return (
            <Stack gap="xl">
                {/* Key Performance Indicators */}
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Text size="sm" c="dimmed" fw={500}>Total Revenue</Text>
                            <ThemeIcon size="sm" variant="light" color="blue">
                                <IconCurrencyDollar size={16} />
                            </ThemeIcon>
                        </Group>
                        <Text size="xl" fw={700} c="blue">
                            {formatCurrency(metrics.totalRevenue)}
                        </Text>
                        <Group gap="xs" mt="xs">
                            <ThemeIcon size="xs" variant="light" color={metrics.revenueGrowth > 0 ? 'green' : 'red'}>
                                {metrics.revenueGrowth > 0 ? <IconArrowUpRight size={12} /> : <IconArrowDownRight size={12} />}
                            </ThemeIcon>
                            <Text size="sm" c={metrics.revenueGrowth > 0 ? 'green' : 'red'}>
                                {formatPercentage(metrics.revenueGrowth)} vs last year
                            </Text>
                        </Group>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Text size="sm" c="dimmed" fw={500}>Total Customers</Text>
                            <ThemeIcon size="sm" variant="light" color="green">
                                <IconUsers size={16} />
                            </ThemeIcon>
                        </Group>
                        <Text size="xl" fw={700} c="green">
                            {metrics.totalCustomers.toLocaleString()}
                        </Text>
                        <Group gap="xs" mt="xs">
                            <ThemeIcon size="xs" variant="light" color={metrics.customerGrowth > 0 ? 'green' : 'red'}>
                                {metrics.customerGrowth > 0 ? <IconArrowUpRight size={12} /> : <IconArrowDownRight size={12} />}
                            </ThemeIcon>
                            <Text size="sm" c={metrics.customerGrowth > 0 ? 'green' : 'red'}>
                                {formatPercentage(metrics.customerGrowth)} growth
                            </Text>
                        </Group>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Text size="sm" c="dimmed" fw={500}>Pipeline Value</Text>
                            <ThemeIcon size="sm" variant="light" color="violet">
                                <IconTarget size={16} />
                            </ThemeIcon>
                        </Group>
                        <Text size="xl" fw={700} c="violet">
                            {formatCurrency(metrics.opportunityValue)}
                        </Text>
                        <Text size="sm" c="dimmed" mt="xs">
                            {metrics.totalOpportunities} active opportunities
                        </Text>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Text size="sm" c="dimmed" fw={500}>Avg Deal Size</Text>
                            <ThemeIcon size="sm" variant="light" color="orange">
                                <IconChartBar size={16} />
                            </ThemeIcon>
                        </Group>
                        <Text size="xl" fw={700} c="orange">
                            {formatCurrency(metrics.commercial.averageDealSize)}
                        </Text>
                        <Text size="sm" c="dimmed" mt="xs">
                            Commercial average
                        </Text>
                    </Card>
                </SimpleGrid>

                {/* Business Unit Comparison */}
                <Grid>
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Group justify="space-between" mb="md">
                                <Title order={4}>Revenue Trend</Title>
                                <Menu shadow="md" width={200}>
                                    <Menu.Target>
                                        <ActionIcon variant="subtle" color="gray">
                                            <IconDots size={16} />
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item leftSection={<IconDownload size={14} />}>
                                            Export Data
                                        </Menu.Item>
                                        <Menu.Item leftSection={<IconFilter size={14} />}>
                                            Filter Options
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>
                            <AreaChart
                                h={300}
                                data={metrics.monthlyRevenue}
                                dataKey="month"
                                series={[
                                    { name: 'residential', label: 'Residential', color: 'blue.6' },
                                    { name: 'commercial', label: 'Commercial', color: 'green.6' },
                                    { name: 'total', label: 'Total', color: 'violet.6' }
                                ]}
                                curveType="linear"
                                tickLine="xy"
                                gridAxis="xy"
                                withXAxis
                                withYAxis
                                withTooltip
                                withLegend
                            />
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={4} mb="md">Business Unit Split</Title>
                            <DonutChart
                                data={[
                                    { name: 'Residential', value: metrics.residential.revenue, color: 'blue.6' },
                                    { name: 'Commercial', value: metrics.commercial.revenue, color: 'green.6' }
                                ]}
                                thickness={30}
                                size={200}
                                withLabelsLine
                                withLabels
                            />
                            <Stack gap="xs" mt="md">
                                <Group justify="space-between">
                                    <Group gap="xs">
                                        <div style={{ width: 12, height: 12, backgroundColor: 'var(--mantine-color-blue-6)', borderRadius: 2 }} />
                                        <Text size="sm">Residential</Text>
                                    </Group>
                                    <Text size="sm" fw={500}>{formatCurrency(metrics.residential.revenue)}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Group gap="xs">
                                        <div style={{ width: 12, height: 12, backgroundColor: 'var(--mantine-color-green-6)', borderRadius: 2 }} />
                                        <Text size="sm">Commercial</Text>
                                    </Group>
                                    <Text size="sm" fw={500}>{formatCurrency(metrics.commercial.revenue)}</Text>
                                </Group>
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Stack>
        );
    };

    const renderResidentialTab = () => {
        if (!metrics) return null;

        return (
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <ThemeIcon size="lg" variant="light" color="blue">
                            <IconHome size={24} />
                        </ThemeIcon>
                        <Badge variant="light" color="blue">Residential</Badge>
                    </Group>
                    <Title order={3} c="blue">{formatCurrency(metrics.residential.revenue)}</Title>
                    <Text size="sm" c="dimmed">Total Revenue</Text>
                    <Progress value={68} size="sm" mt="md" color="blue" />
                    <Text size="xs" c="dimmed" mt="xs">68% of total revenue</Text>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <ThemeIcon size="lg" variant="light" color="green">
                            <IconUsers size={24} />
                        </ThemeIcon>
                        <Badge variant="light" color="green">Active</Badge>
                    </Group>
                    <Title order={3} c="green">{metrics.residential.customers.toLocaleString()}</Title>
                    <Text size="sm" c="dimmed">Total Customers</Text>
                    <Text size="sm" c="green" mt="md">
                        {metrics.residential.activeDeals} active deals
                    </Text>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <ThemeIcon size="lg" variant="light" color="violet">
                            <IconCalendar size={24} />
                        </ThemeIcon>
                        <Badge variant="light" color="violet">Training</Badge>
                    </Group>
                    <Title order={3} c="violet">{metrics.residential.trainingsSessions}</Title>
                    <Text size="sm" c="dimmed">Training Sessions</Text>
                    <Group gap="xs" mt="md">
                        <RingProgress
                            size={60}
                            thickness={6}
                            sections={[{ value: metrics.residential.conversionRate, color: 'violet' }]}
                        />
                        <Stack gap={0}>
                            <Text size="sm" fw={500}>{metrics.residential.conversionRate}%</Text>
                            <Text size="xs" c="dimmed">Conversion Rate</Text>
                        </Stack>
                    </Group>
                </Card>
            </SimpleGrid>
        );
    };

    const renderCommercialTab = () => {
        if (!metrics) return null;

        return (
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <ThemeIcon size="lg" variant="light" color="orange">
                            <IconBuildingStore size={24} />
                        </ThemeIcon>
                        <Badge variant="light" color="orange">Commercial</Badge>
                    </Group>
                    <Title order={3} c="orange">{formatCurrency(metrics.commercial.revenue)}</Title>
                    <Text size="sm" c="dimmed">Total Revenue</Text>
                    <Progress value={32} size="sm" mt="md" color="orange" />
                    <Text size="xs" c="dimmed" mt="xs">32% of total revenue</Text>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <ThemeIcon size="lg" variant="light" color="teal">
                            <IconTarget size={24} />
                        </ThemeIcon>
                        <Badge variant="light" color="teal">Pipeline</Badge>
                    </Group>
                    <Title order={3} c="teal">{formatCurrency(metrics.commercial.pipelineValue)}</Title>
                    <Text size="sm" c="dimmed">Pipeline Value</Text>
                    <Text size="sm" c="teal" mt="md">
                        {metrics.commercial.opportunities} opportunities
                    </Text>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <ThemeIcon size="lg" variant="light" color="red">
                            <IconTrendingUp size={24} />
                        </ThemeIcon>
                        <Badge variant="light" color="red">Performance</Badge>
                    </Group>
                    <Title order={3} c="red">{formatCurrency(metrics.commercial.averageDealSize)}</Title>
                    <Text size="sm" c="dimmed">Avg Deal Size</Text>
                    <Group gap="xs" mt="md">
                        <RingProgress
                            size={60}
                            thickness={6}
                            sections={[{ value: metrics.commercial.winRate, color: 'red' }]}
                        />
                        <Stack gap={0}>
                            <Text size="sm" fw={500}>{metrics.commercial.winRate}%</Text>
                            <Text size="xs" c="dimmed">Win Rate</Text>
                        </Stack>
                    </Group>
                </Card>
            </SimpleGrid>
        );
    };

    const renderPerformanceTab = () => {
        if (!metrics) return null;

        return (
            <Grid>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={4} mb="md">Top Performing Territories</Title>
                        <Stack gap="md">
                            {metrics.topTerritories.map((territory, index) => (
                                <Group key={territory.name} justify="space-between">
                                    <Group gap="sm">
                                        <Badge variant="filled" color="blue" size="sm">
                                            #{index + 1}
                                        </Badge>
                                        <Stack gap={0}>
                                            <Text size="sm" fw={500}>{territory.name}</Text>
                                            <Text size="xs" c="dimmed">{formatCurrency(territory.revenue)}</Text>
                                        </Stack>
                                    </Group>
                                    <Group gap="xs">
                                        <ThemeIcon size="xs" variant="light" color={territory.growth > 0 ? 'green' : 'red'}>
                                            {territory.growth > 0 ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
                                        </ThemeIcon>
                                        <Text size="sm" c={territory.growth > 0 ? 'green' : 'red'}>
                                            {formatPercentage(territory.growth)}
                                        </Text>
                                    </Group>
                                </Group>
                            ))}
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={4} mb="md">Top Sales Representatives</Title>
                        <Stack gap="md">
                            {metrics.topReps.map((rep, index) => (
                                <Group key={rep.name} justify="space-between">
                                    <Group gap="sm">
                                        <Badge variant="filled" color="green" size="sm">
                                            #{index + 1}
                                        </Badge>
                                        <Stack gap={0}>
                                            <Text size="sm" fw={500}>{rep.name}</Text>
                                            <Text size="xs" c="dimmed">{rep.deals} deals closed</Text>
                                        </Stack>
                                    </Group>
                                    <Text size="sm" fw={500} c="green">
                                        {formatCurrency(rep.value)}
                                    </Text>
                                </Group>
                            ))}
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={4} mb="md">Quarterly Performance</Title>
                        <BarChart
                            h={300}
                            data={metrics.quarterlyMetrics}
                            dataKey="quarter"
                            series={[
                                { name: 'revenue', label: 'Revenue', color: 'blue.6' }
                            ]}
                            tickLine="y"
                            gridAxis="y"
                            withXAxis
                            withYAxis
                            withTooltip
                        />
                    </Card>
                </Grid.Col>
            </Grid>
        );
    };

    if (loading) {
        return (
            <Center h={400}>
                <Stack align="center">
                    <Loader size="lg" />
                    <Text>Loading executive dashboard...</Text>
                </Stack>
            </Center>
        );
    }

    return (
        <Stack gap="xl">
            {/* Header */}
            <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                    <Title order={1}>Executive Overview</Title>
                    <Text c="dimmed">Consolidated performance metrics across residential and commercial operations</Text>
                </Stack>

                <Group gap="sm">
                    <Select
                        placeholder="Time Range"
                        value={filters.timeRange}
                        onChange={(value) => setFilters(prev => ({ ...prev, timeRange: value || 'ytd' }))}
                        data={[
                            { value: 'mtd', label: 'Month to Date' },
                            { value: 'qtd', label: 'Quarter to Date' },
                            { value: 'ytd', label: 'Year to Date' },
                            { value: 'last12', label: 'Last 12 Months' }
                        ]}
                        w={150}
                    />
                    <Select
                        placeholder="Business Unit"
                        value={filters.businessUnit}
                        onChange={(value) => setFilters(prev => ({ ...prev, businessUnit: value || 'all' }))}
                        data={[
                            { value: 'all', label: 'All Units' },
                            { value: 'residential', label: 'Residential' },
                            { value: 'commercial', label: 'Commercial' }
                        ]}
                        w={150}
                    />
                    <ActionIcon variant="light" onClick={loadDashboardData}>
                        <IconRefresh size={16} />
                    </ActionIcon>
                </Group>
            </Group>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')}>
                <Tabs.List>
                    <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
                        Overview
                    </Tabs.Tab>
                    <Tabs.Tab value="residential" leftSection={<IconHome size={16} />}>
                        Residential
                    </Tabs.Tab>
                    <Tabs.Tab value="commercial" leftSection={<IconBuildingStore size={16} />}>
                        Commercial
                    </Tabs.Tab>
                    <Tabs.Tab value="performance" leftSection={<IconTrendingUp size={16} />}>
                        Performance
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" pt="md">
                    {renderOverviewTab()}
                </Tabs.Panel>

                <Tabs.Panel value="residential" pt="md">
                    {renderResidentialTab()}
                </Tabs.Panel>

                <Tabs.Panel value="commercial" pt="md">
                    {renderCommercialTab()}
                </Tabs.Panel>

                <Tabs.Panel value="performance" pt="md">
                    {renderPerformanceTab()}
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
};
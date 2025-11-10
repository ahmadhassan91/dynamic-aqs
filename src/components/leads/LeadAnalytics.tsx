'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  SimpleGrid,
  Progress,
  Badge,
  ThemeIcon,
  Box,
  Select,
  RingProgress,
  Center,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconTarget,
  IconChartPie,
  IconCalendar,
} from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MockLead, generateMockLeads } from '@/lib/mockData/generators';

interface LeadAnalyticsProps {
  leads?: MockLead[];
}

export function LeadAnalytics({ leads: propLeads }: LeadAnalyticsProps) {
  const [leads, setLeads] = useState<MockLead[]>([]);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    if (propLeads) {
      setLeads(propLeads);
    } else {
      const mockLeads = generateMockLeads(200);
      setLeads(mockLeads);
    }
  }, [propLeads]);

  // Filter leads based on time range
  const filteredLeads = leads.filter(lead => {
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return new Date(lead.createdAt) >= cutoffDate;
  });

  // Calculate metrics
  const totalLeads = filteredLeads.length;
  const wonLeads = filteredLeads.filter(lead => lead.status === 'won').length;
  const lostLeads = filteredLeads.filter(lead => lead.status === 'lost').length;
  const activeLeads = filteredLeads.filter(lead => !['won', 'lost'].includes(lead.status)).length;
  const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

  // Lead source distribution
  const sourceData = [
    { name: 'HubSpot', value: filteredLeads.filter(l => l.source === 'hubspot').length, color: '#fd7e14' },
    { name: 'Referral', value: filteredLeads.filter(l => l.source === 'referral').length, color: '#51cf66' },
    { name: 'Website', value: filteredLeads.filter(l => l.source === 'website').length, color: '#339af0' },
    { name: 'Trade Show', value: filteredLeads.filter(l => l.source === 'trade_show').length, color: '#9775fa' },
  ].filter(item => item.value > 0);

  // Lead status distribution
  const statusData = [
    { name: 'New', count: filteredLeads.filter(l => l.status === 'new').length, color: '#339af0' },
    { name: 'Qualified', count: filteredLeads.filter(l => l.status === 'qualified').length, color: '#22b8cf' },
    { name: 'Discovery', count: filteredLeads.filter(l => l.status === 'discovery').length, color: '#fab005' },
    { name: 'Proposal', count: filteredLeads.filter(l => l.status === 'proposal').length, color: '#fd7e14' },
    { name: 'Won', count: filteredLeads.filter(l => l.status === 'won').length, color: '#51cf66' },
    { name: 'Lost', count: filteredLeads.filter(l => l.status === 'lost').length, color: '#f03e3e' },
  ].filter(item => item.count > 0);

  // Lead score distribution
  const scoreRanges = [
    { range: '0-20', count: filteredLeads.filter(l => l.score >= 0 && l.score < 20).length },
    { range: '20-40', count: filteredLeads.filter(l => l.score >= 20 && l.score < 40).length },
    { range: '40-60', count: filteredLeads.filter(l => l.score >= 40 && l.score < 60).length },
    { range: '60-80', count: filteredLeads.filter(l => l.score >= 60 && l.score < 80).length },
    { range: '80-100', count: filteredLeads.filter(l => l.score >= 80 && l.score <= 100).length },
  ];

  const averageScore = filteredLeads.length > 0 
    ? filteredLeads.reduce((sum, lead) => sum + lead.score, 0) / filteredLeads.length 
    : 0;

  return (
    <Stack gap="md">
      {/* Time Range Selector */}
      <Group justify="space-between" align="center">
        <Text size="lg" fw={600}>Lead Analytics</Text>
        <Select
          value={timeRange}
          onChange={(value) => setTimeRange(value || '30')}
          data={[
            { value: '7', label: 'Last 7 days' },
            { value: '30', label: 'Last 30 days' },
            { value: '90', label: 'Last 90 days' },
            { value: '365', label: 'Last year' },
          ]}
          w={150}
        />
      </Group>

      {/* Key Metrics */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        <Card withBorder p="md">
          <Group justify="space-between">
            <Box>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Total Leads
              </Text>
              <Text size="xl" fw={700}>
                {totalLeads}
              </Text>
            </Box>
            <ThemeIcon color="blue" variant="light" size="lg">
              <IconUsers size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between">
            <Box>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Conversion Rate
              </Text>
              <Text size="xl" fw={700} c={conversionRate >= 20 ? 'green' : conversionRate >= 10 ? 'yellow' : 'red'}>
                {conversionRate.toFixed(1)}%
              </Text>
            </Box>
            <ThemeIcon color={conversionRate >= 20 ? 'green' : conversionRate >= 10 ? 'yellow' : 'red'} variant="light" size="lg">
              <IconTarget size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between">
            <Box>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Won Leads
              </Text>
              <Text size="xl" fw={700} c="green">
                {wonLeads}
              </Text>
            </Box>
            <ThemeIcon color="green" variant="light" size="lg">
              <IconTrendingUp size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between">
            <Box>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Average Score
              </Text>
              <Text size="xl" fw={700} c={averageScore >= 70 ? 'green' : averageScore >= 50 ? 'yellow' : 'red'}>
                {averageScore.toFixed(0)}
              </Text>
            </Box>
            <ThemeIcon color={averageScore >= 70 ? 'green' : averageScore >= 50 ? 'yellow' : 'red'} variant="light" size="lg">
              <IconChartPie size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Charts */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {/* Lead Sources */}
        <Card withBorder p="md">
          <Text fw={600} mb="md">Lead Sources</Text>
          <Box h={200}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Stack gap="xs" mt="md">
            {sourceData.map((source) => (
              <Group key={source.name} justify="space-between">
                <Group gap="xs">
                  <Box w={12} h={12} bg={source.color} style={{ borderRadius: 2 }} />
                  <Text size="sm">{source.name}</Text>
                </Group>
                <Text size="sm" fw={500}>{source.value}</Text>
              </Group>
            ))}
          </Stack>
        </Card>

        {/* Lead Status Pipeline */}
        <Card withBorder p="md">
          <Text fw={600} mb="md">Pipeline Status</Text>
          <Box h={200}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#339af0" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </SimpleGrid>

      {/* Lead Score Distribution */}
      <Card withBorder p="md">
        <Text fw={600} mb="md">Lead Score Distribution</Text>
        <SimpleGrid cols={5} spacing="md">
          {scoreRanges.map((range, index) => {
            const percentage = totalLeads > 0 ? (range.count / totalLeads) * 100 : 0;
            const color = index === 4 ? 'green' : index === 3 ? 'yellow' : index === 2 ? 'orange' : 'red';
            
            return (
              <Box key={range.range} ta="center">
                <RingProgress
                  size={80}
                  thickness={8}
                  sections={[{ value: percentage, color }]}
                  label={
                    <Center>
                      <Text size="xs" fw={700}>
                        {range.count}
                      </Text>
                    </Center>
                  }
                />
                <Text size="xs" c="dimmed" mt="xs">
                  {range.range}
                </Text>
              </Box>
            );
          })}
        </SimpleGrid>
      </Card>

      {/* Conversion Funnel */}
      <Card withBorder p="md">
        <Text fw={600} mb="md">Conversion Funnel</Text>
        <Stack gap="sm">
          {statusData.map((status, index) => {
            const percentage = totalLeads > 0 ? (status.count / totalLeads) * 100 : 0;
            return (
              <Box key={status.name}>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={500}>{status.name}</Text>
                  <Group gap="xs">
                    <Text size="sm">{status.count}</Text>
                    <Text size="xs" c="dimmed">({percentage.toFixed(1)}%)</Text>
                  </Group>
                </Group>
                <Progress value={percentage} color={status.color} size="lg" />
              </Box>
            );
          })}
        </Stack>
      </Card>
    </Stack>
  );
}
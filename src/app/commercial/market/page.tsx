'use client';

import { useState } from 'react';
import { Container, Title, Text, Stack, Card, Group, Badge, Button, SimpleGrid, ThemeIcon, Grid, Progress, RingProgress, Center } from '@mantine/core';
import { IconChartBar, IconTrendingUp, IconTarget, IconCurrencyDollar, IconBuilding, IconUsers, IconCalendar, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { CommercialLayout } from '@/components/layout/CommercialLayout';

// Mock data for market analysis
const marketSegments = [
  {
    name: 'Healthcare',
    opportunities: 8,
    totalValue: 3200000,
    avgValue: 400000,
    winRate: 75,
    growth: 15,
    color: 'red'
  },
  {
    name: 'Education',
    opportunities: 12,
    totalValue: 2800000,
    avgValue: 233333,
    winRate: 68,
    growth: 8,
    color: 'blue'
  },
  {
    name: 'Commercial Office',
    opportunities: 6,
    totalValue: 2400000,
    avgValue: 400000,
    winRate: 60,
    growth: -5,
    color: 'green'
  },
  {
    name: 'Industrial',
    opportunities: 4,
    totalValue: 1600000,
    avgValue: 400000,
    winRate: 45,
    growth: 22,
    color: 'orange'
  },
  {
    name: 'Government',
    opportunities: 3,
    totalValue: 900000,
    avgValue: 300000,
    winRate: 80,
    growth: 12,
    color: 'violet'
  }
];

const quarterlyData = [
  { quarter: 'Q4 2023', opportunities: 28, value: 8500000, closed: 18 },
  { quarter: 'Q1 2024', opportunities: 33, value: 10900000, closed: 22 },
  { quarter: 'Q2 2024 (Proj)', opportunities: 38, value: 12200000, closed: 26 },
  { quarter: 'Q3 2024 (Proj)', opportunities: 42, value: 13800000, closed: 29 }
];

export default function CommercialMarketPage() {
  const totalOpportunities = marketSegments.reduce((sum, segment) => sum + segment.opportunities, 0);
  const totalValue = marketSegments.reduce((sum, segment) => sum + segment.totalValue, 0);
  const avgWinRate = marketSegments.reduce((sum, segment) => sum + segment.winRate, 0) / marketSegments.length;

  const stats = [
    { title: 'Total Pipeline', value: `$${(totalValue / 1000000).toFixed(1)}M`, icon: IconCurrencyDollar, color: 'blue' },
    { title: 'Active Opportunities', value: totalOpportunities.toString(), icon: IconTarget, color: 'green' },
    { title: 'Avg Win Rate', value: `${Math.round(avgWinRate)}%`, icon: IconTrendingUp, color: 'orange' },
    { title: 'Market Segments', value: marketSegments.length.toString(), icon: IconChartBar, color: 'red' },
  ];

  return (
    <CommercialLayout>
      <Container size="xl" py="md">
        <Stack gap="xl">
          {/* Header */}
          <div>
            <Title order={1}>Market Analysis</Title>
            <Text size="sm" c="dimmed">
              Analyze market segments and performance trends
            </Text>
          </div>

          {/* Stats */}
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
            {stats.map((stat) => (
              <Card key={stat.title} withBorder padding="lg">
                <Group justify="space-between">
                  <Stack gap="xs">
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                      {stat.title}
                    </Text>
                    <Text size="xl" fw={700}>
                      {stat.value}
                    </Text>
                  </Stack>
                  <ThemeIcon size="lg" variant="light" color={stat.color}>
                    <stat.icon size={20} />
                  </ThemeIcon>
                </Group>
              </Card>
            ))}
          </SimpleGrid>

          {/* Market Segments Analysis */}
          <div>
            <Title order={3} mb="md">Market Segments Performance</Title>
            <Grid>
              {marketSegments.map((segment) => (
                <Grid.Col key={segment.name} span={{ base: 12, md: 6, lg: 4 }}>
                  <Card withBorder padding="lg" radius="md" h="100%">
                    <Stack gap="md">
                      {/* Header */}
                      <Group justify="space-between">
                        <Text fw={600} size="lg">
                          {segment.name}
                        </Text>
                        <Badge variant="light" color={segment.color}>
                          {segment.opportunities} opps
                        </Badge>
                      </Group>

                      {/* Win Rate Ring */}
                      <Center>
                        <RingProgress
                          size={120}
                          thickness={12}
                          sections={[{ value: segment.winRate, color: segment.color }]}
                          label={
                            <Center>
                              <Stack gap={0} align="center">
                                <Text size="xl" fw={700}>
                                  {segment.winRate}%
                                </Text>
                                <Text size="xs" c="dimmed">
                                  Win Rate
                                </Text>
                              </Stack>
                            </Center>
                          }
                        />
                      </Center>

                      {/* Metrics */}
                      <SimpleGrid cols={2} spacing="md">
                        <div>
                          <Text size="xs" c="dimmed">Total Value</Text>
                          <Text size="sm" fw={600}>
                            ${(segment.totalValue / 1000000).toFixed(1)}M
                          </Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">Avg Deal Size</Text>
                          <Text size="sm" fw={600}>
                            ${(segment.avgValue / 1000).toFixed(0)}K
                          </Text>
                        </div>
                      </SimpleGrid>

                      {/* Growth */}
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>YoY Growth</Text>
                        <Group gap="xs">
                          {segment.growth > 0 ? (
                            <IconArrowUp size={16} color="green" />
                          ) : (
                            <IconArrowDown size={16} color="red" />
                          )}
                          <Text 
                            size="sm" 
                            fw={600} 
                            c={segment.growth > 0 ? 'green' : 'red'}
                          >
                            {Math.abs(segment.growth)}%
                          </Text>
                        </Group>
                      </Group>

                      <Button variant="light" size="sm" fullWidth>
                        View Details
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </div>

          {/* Quarterly Trends */}
          <Card withBorder padding="lg" radius="md">
            <Title order={4} mb="md">Quarterly Performance Trends</Title>
            <Grid>
              {quarterlyData.map((quarter, index) => (
                <Grid.Col key={quarter.quarter} span={{ base: 12, sm: 6, md: 3 }}>
                  <Card withBorder={false} bg="gray.0" padding="md" radius="md">
                    <Stack gap="sm">
                      <Text fw={600} size="sm" ta="center">
                        {quarter.quarter}
                      </Text>
                      
                      <SimpleGrid cols={1} spacing="xs">
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">Opportunities</Text>
                          <Text size="sm" fw={600}>{quarter.opportunities}</Text>
                        </Group>
                        
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">Pipeline Value</Text>
                          <Text size="sm" fw={600}>
                            ${(quarter.value / 1000000).toFixed(1)}M
                          </Text>
                        </Group>
                        
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">Closed Deals</Text>
                          <Text size="sm" fw={600}>{quarter.closed}</Text>
                        </Group>
                        
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">Close Rate</Text>
                          <Text size="sm" fw={600}>
                            {Math.round((quarter.closed / quarter.opportunities) * 100)}%
                          </Text>
                        </Group>
                      </SimpleGrid>

                      {index < quarterlyData.length - 1 && (
                        <Progress 
                          value={(quarter.closed / quarter.opportunities) * 100} 
                          size="sm" 
                          color="blue" 
                        />
                      )}
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Card>

          {/* Market Insights */}
          <Card withBorder padding="lg" radius="md">
            <Title order={4} mb="md">Market Insights</Title>
            <Stack gap="md">
              <Group>
                <ThemeIcon size="sm" variant="light" color="green">
                  <IconTrendingUp size={16} />
                </ThemeIcon>
                <Text size="sm">
                  <strong>Healthcare</strong> segment shows strongest performance with 75% win rate and 15% growth
                </Text>
              </Group>
              
              <Group>
                <ThemeIcon size="sm" variant="light" color="orange">
                  <IconTarget size={16} />
                </ThemeIcon>
                <Text size="sm">
                  <strong>Industrial</strong> segment has highest growth potential at 22% YoY but lower win rates
                </Text>
              </Group>
              
              <Group>
                <ThemeIcon size="sm" variant="light" color="blue">
                  <IconBuilding size={16} />
                </ThemeIcon>
                <Text size="sm">
                  <strong>Commercial Office</strong> segment experiencing decline (-5%) - requires strategic review
                </Text>
              </Group>
              
              <Group>
                <ThemeIcon size="sm" variant="light" color="violet">
                  <IconUsers size={16} />
                </ThemeIcon>
                <Text size="sm">
                  <strong>Government</strong> segment has highest win rate (80%) but limited volume
                </Text>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </CommercialLayout>
  );
}
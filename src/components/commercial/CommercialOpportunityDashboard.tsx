'use client';

import { useState, useEffect } from 'react';
import {
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
  ActionIcon,
  Tabs,
  Center,
  Loader,
  Modal,
  Select,
  TextInput,
  Table,
  Menu,
} from '@mantine/core';
import {
  IconBuildingStore,
  IconTrendingUp,
  IconTarget,
  IconChartBar,
  IconCurrencyDollar,
  IconSearch,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { 
  CommercialOpportunity, 
  OpportunityFilters, 
  OpportunityMetrics,
  SalesPhase,
  MarketSegment 
} from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

export default function CommercialOpportunityDashboard() {
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [metrics, setMetrics] = useState<OpportunityMetrics | null>(null);
  const [filters, setFilters] = useState<OpportunityFilters>({});
  const [loading, setLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<CommercialOpportunity | null>(null);
  const [viewMode, setViewMode] = useState<'pipeline' | 'list' | 'analytics'>('pipeline');

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [opportunitiesData, metricsData] = await Promise.all([
        commercialService.getOpportunities(filters),
        commercialService.getOpportunityMetrics(filters)
      ]);
      setOpportunities(opportunitiesData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading commercial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<OpportunityFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };



  const renderPipelineView = () => {
    const phases = Object.values(SalesPhase);
    const opportunitiesByPhase = phases.reduce((acc, phase) => {
      acc[phase] = opportunities.filter(opp => opp.salesPhase === phase);
      return acc;
    }, {} as Record<SalesPhase, CommercialOpportunity[]>);

    return (
      <SimpleGrid cols={{ base: 1, md: 2, lg: 6 }} spacing="md">
        {phases.map(phase => (
          <Paper key={phase} shadow="sm" p="md" bg="gray.0">
            <Group justify="space-between" mb="md">
              <Text size="sm" fw={600}>
                {phase}
              </Text>
              <Badge variant="filled" color="gray" size="sm">
                {opportunitiesByPhase[phase]?.length || 0}
              </Badge>
            </Group>
            <Stack gap="xs">
              {opportunitiesByPhase[phase]?.map(opportunity => (
                <Card
                  key={opportunity.id}
                  shadow="sm"
                  p="sm"
                  radius="md"
                  withBorder
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedOpportunity(opportunity)}
                >
                  <Text size="sm" fw={500} mb="xs">
                    {opportunity.jobSiteName}
                  </Text>
                  <Text size="xs" c="dimmed" mb="xs">
                    {opportunity.marketSegment}
                  </Text>
                  <Group justify="space-between">
                    <Text size="sm" fw={600} c="green">
                      {formatCurrency(opportunity.estimatedValue)}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {opportunity.probability}%
                    </Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    );
  };

  const renderListView = () => (
    <Paper shadow="sm" radius="md" withBorder>
      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Job Site</Table.Th>
              <Table.Th>Market Segment</Table.Th>
              <Table.Th>Phase</Table.Th>
              <Table.Th>Value</Table.Th>
              <Table.Th>Probability</Table.Th>
              <Table.Th>Expected Close</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {opportunities.map(opportunity => (
              <Table.Tr
                key={opportunity.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedOpportunity(opportunity)}
              >
                <Table.Td>
                  <Stack gap="xs">
                    <Text size="sm" fw={500}>
                      {opportunity.jobSiteName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {opportunity.description}
                    </Text>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color="blue" size="sm">
                    {opportunity.marketSegment}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge variant="filled" color="blue" size="sm">
                    {opportunity.salesPhase}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {formatCurrency(opportunity.estimatedValue)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Progress value={opportunity.probability} size="sm" w={60} />
                    <Text size="sm" c="dimmed">
                      {opportunity.probability}%
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {opportunity.expectedCloseDate?.toLocaleDateString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEye size={14} />}>
                        View Details
                      </Menu.Item>
                      <Menu.Item leftSection={<IconEdit size={14} />}>
                        Edit
                      </Menu.Item>
                      <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );

  const renderAnalyticsView = () => {
    if (!metrics) return <Center><Loader /></Center>;

    return (
      <Grid>
        {/* Key Metrics */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card shadow="sm" padding="lg">
            <Title order={4} mb="md">Key Metrics</Title>
            <Stack gap="md">
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="xl" fw={700} c="blue">{metrics.totalOpportunities}</Text>
                  <Text size="sm" c="dimmed">Total Opportunities</Text>
                </Stack>
                <ThemeIcon size="lg" variant="light" color="blue">
                  <IconTarget size={20} />
                </ThemeIcon>
              </Group>
              
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="xl" fw={700} c="green">{formatCurrency(metrics.totalValue)}</Text>
                  <Text size="sm" c="dimmed">Total Pipeline Value</Text>
                </Stack>
                <ThemeIcon size="lg" variant="light" color="green">
                  <IconCurrencyDollar size={20} />
                </ThemeIcon>
              </Group>
              
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="xl" fw={700} c="violet">{formatCurrency(metrics.averageValue)}</Text>
                  <Text size="sm" c="dimmed">Average Deal Size</Text>
                </Stack>
                <ThemeIcon size="lg" variant="light" color="violet">
                  <IconChartBar size={20} />
                </ThemeIcon>
              </Group>
              
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text size="xl" fw={700} c="orange">{metrics.conversionRate.toFixed(1)}%</Text>
                  <Text size="sm" c="dimmed">Conversion Rate</Text>
                </Stack>
                <ThemeIcon size="lg" variant="light" color="orange">
                  <IconTrendingUp size={20} />
                </ThemeIcon>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Pipeline by Phase */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card shadow="sm" padding="lg">
            <Title order={4} mb="md">Pipeline by Phase</Title>
            <Stack gap="sm">
              {Object.entries(metrics.pipelineByPhase).map(([phase, count]) => (
                <Group key={phase} justify="space-between">
                  <Text size="sm" c="dimmed">{phase}</Text>
                  <Group gap="xs">
                    <Progress
                      value={(count / metrics.totalOpportunities) * 100}
                      size="sm"
                      w={80}
                      color="blue"
                    />
                    <Text size="sm" fw={500}>{count}</Text>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Market Segments */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card shadow="sm" padding="lg">
            <Title order={4} mb="md">Opportunities by Segment</Title>
            <Stack gap="sm">
              {Object.entries(metrics.opportunitiesBySegment).map(([segment, count]) => (
                <Group key={segment} justify="space-between">
                  <Text size="sm" c="dimmed">{segment}</Text>
                  <Group gap="xs">
                    <Progress
                      value={(count / metrics.totalOpportunities) * 100}
                      size="sm"
                      w={80}
                      color="green"
                    />
                    <Text size="sm" fw={500}>{count}</Text>
                  </Group>
                </Group>
              ))}
            </Stack>
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
          <Text>Loading commercial opportunities...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <Stack gap="xs">
          <Title order={1}>Commercial Opportunities</Title>
          <Text c="dimmed">Manage and track your commercial pipeline</Text>
        </Stack>
        
        <Tabs value={viewMode} onChange={(value) => setViewMode(value as any)}>
          <Tabs.List>
            <Tabs.Tab value="pipeline" leftSection={<IconTarget size={16} />}>
              Pipeline
            </Tabs.Tab>
            <Tabs.Tab value="list" leftSection={<IconBuildingStore size={16} />}>
              List
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
              Analytics
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Group>

      {/* Filters */}
      <Paper p="md" mb="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Market Segment"
              placeholder="All Segments"
              data={Object.values(MarketSegment)}
              onChange={(value) => handleFilterChange({
                marketSegments: value ? [value as MarketSegment] : undefined
              })}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Select
              label="Sales Phase"
              placeholder="All Phases"
              data={Object.values(SalesPhase)}
              onChange={(value) => handleFilterChange({
                salesPhases: value ? [value as SalesPhase] : undefined
              })}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Search"
              placeholder="Search opportunities..."
              leftSection={<IconSearch size={16} />}
              onChange={(e) => handleFilterChange({ searchTerm: e.currentTarget.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 2 }} style={{ display: 'flex', alignItems: 'end' }}>
            <Button
              variant="light"
              fullWidth
              onClick={() => setFilters({})}
            >
              Clear Filters
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Content */}
      <Tabs.Panel value="pipeline">
        {renderPipelineView()}
      </Tabs.Panel>
      
      <Tabs.Panel value="list">
        {renderListView()}
      </Tabs.Panel>
      
      <Tabs.Panel value="analytics">
        {renderAnalyticsView()}
      </Tabs.Panel>

      {/* Opportunity Detail Modal */}
      <Modal
        opened={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        title={selectedOpportunity?.jobSiteName}
        size="xl"
      >
        {selectedOpportunity && (
          <Grid>
            <Grid.Col span={6}>
              <Stack gap="md">
                <Title order={4}>Opportunity Details</Title>
                <Stack gap="xs">
                  <Group>
                    <Text size="sm" fw={500} c="dimmed">Description:</Text>
                    <Text size="sm">{selectedOpportunity.description}</Text>
                  </Group>
                  <Group>
                    <Text size="sm" fw={500} c="dimmed">Market Segment:</Text>
                    <Badge variant="light">{selectedOpportunity.marketSegment}</Badge>
                  </Group>
                  <Group>
                    <Text size="sm" fw={500} c="dimmed">Estimated Value:</Text>
                    <Text size="sm" fw={600} c="green">{formatCurrency(selectedOpportunity.estimatedValue)}</Text>
                  </Group>
                  <Group>
                    <Text size="sm" fw={500} c="dimmed">Probability:</Text>
                    <Group gap="xs">
                      <Progress value={selectedOpportunity.probability} size="sm" w={60} />
                      <Text size="sm">{selectedOpportunity.probability}%</Text>
                    </Group>
                  </Group>
                  <Group>
                    <Text size="sm" fw={500} c="dimmed">Sales Phase:</Text>
                    <Badge color={selectedOpportunity.salesPhase === SalesPhase.WON ? 'green' : 'blue'}>
                      {selectedOpportunity.salesPhase}
                    </Badge>
                  </Group>
                </Stack>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={6}>
              <Stack gap="md">
                <Title order={4}>Stakeholders</Title>
                <Stack gap="xs">
                  <Group>
                    <Text size="sm" fw={500} c="dimmed">Engineering Firm:</Text>
                    <Text size="sm">{selectedOpportunity.engineeringFirmId}</Text>
                  </Group>
                  <Group>
                    <Text size="sm" fw={500} c="dimmed">Manufacturer Rep:</Text>
                    <Text size="sm">{selectedOpportunity.manufacturerRepId}</Text>
                  </Group>
                  <Group>
                    <Text size="sm" fw={500} c="dimmed">Regional Sales Manager:</Text>
                    <Text size="sm">{selectedOpportunity.regionalSalesManagerId}</Text>
                  </Group>
                </Stack>
              </Stack>
            </Grid.Col>
          </Grid>
        )}
      </Modal>
    </>
  );
}
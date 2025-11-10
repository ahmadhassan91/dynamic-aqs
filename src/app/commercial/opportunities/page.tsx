'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Title, Text, Stack, Card, Group, Badge, Button, Grid, TextInput, Select, Menu, ActionIcon, Table, Pagination } from '@mantine/core';
import { IconBriefcase, IconCurrencyDollar, IconTrendingUp, IconTarget, IconPlus, IconSearch, IconFilter, IconDots, IconEye, IconEdit, IconDownload } from '@tabler/icons-react';
import { CommercialLayout } from '@/components/layout/CommercialLayout';

const ITEMS_PER_PAGE = 10;

// Mock data for opportunities
const mockOpportunities = [
  {
    id: '1',
    jobSiteName: 'University Medical Center HVAC Upgrade',
    description: 'Complete HVAC system replacement for 500-bed medical facility',
    marketSegment: 'Healthcare',
    estimatedValue: 850000,
    probability: 75,
    salesPhase: 'Final Quote',
    engineeringFirm: 'MEP Engineering Solutions',
    manufacturerRep: 'Johnson Controls Rep',
    expectedCloseDate: '2024-02-15',
    createdAt: '2024-01-10',
    status: 'active'
  },
  {
    id: '2',
    jobSiteName: 'Downtown Office Complex',
    description: 'New construction HVAC system for 20-story office building',
    marketSegment: 'Commercial Office',
    estimatedValue: 1200000,
    probability: 60,
    salesPhase: 'Proposal',
    engineeringFirm: 'Urban Design Engineers',
    manufacturerRep: 'Carrier Commercial Rep',
    expectedCloseDate: '2024-03-01',
    createdAt: '2024-01-05',
    status: 'active'
  },
  {
    id: '3',
    jobSiteName: 'Manufacturing Plant Expansion',
    description: 'Industrial HVAC system for new production facility',
    marketSegment: 'Industrial',
    estimatedValue: 650000,
    probability: 45,
    salesPhase: 'Prospect',
    engineeringFirm: 'Industrial Systems Inc',
    manufacturerRep: 'Trane Industrial Rep',
    expectedCloseDate: '2024-04-15',
    createdAt: '2024-01-08',
    status: 'active'
  },
  {
    id: '4',
    jobSiteName: 'School District Retrofit',
    description: 'Energy-efficient HVAC upgrades across 12 school buildings',
    marketSegment: 'Education',
    estimatedValue: 450000,
    probability: 80,
    salesPhase: 'Negotiation',
    engineeringFirm: 'Educational Facilities Engineering',
    manufacturerRep: 'Lennox Education Rep',
    expectedCloseDate: '2024-01-30',
    createdAt: '2023-12-15',
    status: 'active'
  },
  {
    id: '5',
    jobSiteName: 'Hotel Renovation Project',
    description: 'Complete HVAC replacement for 200-room hotel',
    marketSegment: 'Hospitality',
    estimatedValue: 380000,
    probability: 50,
    salesPhase: 'Qualification',
    engineeringFirm: 'Hospitality Engineering Group',
    manufacturerRep: 'York Hospitality Rep',
    expectedCloseDate: '2024-05-01',
    createdAt: '2024-01-12',
    status: 'active'
  },
  {
    id: '6',
    jobSiteName: 'Shopping Mall Climate Control',
    description: 'Advanced HVAC system for new retail complex',
    marketSegment: 'Retail',
    estimatedValue: 920000,
    probability: 65,
    salesPhase: 'Proposal',
    engineeringFirm: 'Retail Systems Engineering',
    manufacturerRep: 'Daikin Retail Rep',
    expectedCloseDate: '2024-03-20',
    createdAt: '2024-01-03',
    status: 'active'
  }
];

export default function CommercialOpportunitiesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string | null>(null);
  const [segmentFilter, setSegmentFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return mockOpportunities.filter(opp => {
      const matchesSearch = !searchQuery || 
        opp.jobSiteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.engineeringFirm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPhase = !phaseFilter || opp.salesPhase === phaseFilter;
      const matchesSegment = !segmentFilter || opp.marketSegment === segmentFilter;
      
      return matchesSearch && matchesPhase && matchesSegment;
    });
  }, [searchQuery, phaseFilter, segmentFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE);
  const paginatedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const stats = [
    { 
      title: 'Total Opportunities', 
      value: filteredOpportunities.length.toString(), 
      icon: IconBriefcase, 
      color: 'blue' 
    },
    { 
      title: 'Pipeline Value', 
      value: `$${(filteredOpportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0) / 1000000).toFixed(1)}M`, 
      icon: IconCurrencyDollar, 
      color: 'green' 
    },
    { 
      title: 'Avg. Probability', 
      value: filteredOpportunities.length > 0 
        ? `${Math.round(filteredOpportunities.reduce((sum, opp) => sum + opp.probability, 0) / filteredOpportunities.length)}%`
        : '0%', 
      icon: IconTrendingUp, 
      color: 'orange' 
    },
    { 
      title: 'High Value (>$500K)', 
      value: filteredOpportunities.filter(opp => opp.estimatedValue > 500000).length.toString(), 
      icon: IconTarget, 
      color: 'red' 
    },
  ];

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      'Prospect': 'gray',
      'Qualification': 'cyan',
      'Proposal': 'blue',
      'Negotiation': 'orange',
      'Final Quote': 'yellow',
      'Won': 'green',
      'Lost': 'red'
    };
    return colors[phase] || 'gray';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <CommercialLayout>
      <div className="residential-content-container">
        <Stack gap="xl" className="commercial-stack-large">
          {/* Header */}
          <Group justify="space-between" className="commercial-section-header">
            <div>
              <Title order={1}>Commercial Opportunities</Title>
              <Text size="lg" c="dimmed">
                Manage and track your commercial sales pipeline
              </Text>
            </div>
            <Button leftSection={<IconPlus size={16} />} size="md" color="blue">
              New Opportunity
            </Button>
          </Group>

          {/* Stats */}
          <Grid>
            {stats.map((stat) => (
              <Grid.Col key={stat.title} span={{ base: 12, xs: 6, md: 3 }}>
                <div className="commercial-stat-card">
                  <Group justify="space-between" align="flex-start">
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Text className="commercial-stat-label">
                        {stat.title}
                      </Text>
                      <Text className="commercial-stat-value">
                        {stat.value}
                      </Text>
                    </Stack>
                    <stat.icon size={24} color={`var(--mantine-color-${stat.color}-6)`} />
                  </Group>
                </div>
              </Grid.Col>
            ))}
          </Grid>

          {/* Search and Filters */}
          <Card withBorder padding="md" className="commercial-card-static">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  placeholder="Search opportunities, firms, or descriptions..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  size="md"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Select
                  placeholder="Filter by Phase"
                  leftSection={<IconFilter size={16} />}
                  data={[
                    { value: '', label: 'All Phases' },
                    { value: 'Prospect', label: 'Prospect' },
                    { value: 'Qualification', label: 'Qualification' },
                    { value: 'Proposal', label: 'Proposal' },
                    { value: 'Negotiation', label: 'Negotiation' },
                    { value: 'Final Quote', label: 'Final Quote' },
                  ]}
                  value={phaseFilter}
                  onChange={setPhaseFilter}
                  clearable
                  size="md"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Select
                  placeholder="Filter by Segment"
                  leftSection={<IconFilter size={16} />}
                  data={[
                    { value: '', label: 'All Segments' },
                    { value: 'Healthcare', label: 'Healthcare' },
                    { value: 'Education', label: 'Education' },
                    { value: 'Commercial Office', label: 'Commercial Office' },
                    { value: 'Industrial', label: 'Industrial' },
                    { value: 'Retail', label: 'Retail' },
                    { value: 'Hospitality', label: 'Hospitality' },
                  ]}
                  value={segmentFilter}
                  onChange={setSegmentFilter}
                  clearable
                  size="md"
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* Opportunities Table */}
          <Card withBorder padding="lg" className="commercial-card-static">
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={3}>Opportunities List</Title>
                <Button variant="light" leftSection={<IconDownload size={16} />} size="sm">
                  Export
                </Button>
              </Group>

              <Table.ScrollContainer minWidth={800}>
                <Table highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Job Site</Table.Th>
                      <Table.Th>Engineering Firm</Table.Th>
                      <Table.Th>Segment</Table.Th>
                      <Table.Th>Phase</Table.Th>
                      <Table.Th>Value</Table.Th>
                      <Table.Th>Probability</Table.Th>
                      <Table.Th>Close Date</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedOpportunities.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={8}>
                          <div className="commercial-empty-state">
                            <IconBriefcase className="commercial-empty-state-icon" />
                            <div className="commercial-empty-state-title">No opportunities found</div>
                            <div className="commercial-empty-state-description">
                              Try adjusting your filters or search criteria
                            </div>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      paginatedOpportunities.map((opp) => (
                        <Table.Tr key={opp.id} style={{ cursor: 'pointer' }}>
                          <Table.Td>
                            <div>
                              <Text fw={500} size="sm">{opp.jobSiteName}</Text>
                              <Text size="xs" c="dimmed" lineClamp={1}>{opp.description}</Text>
                            </div>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{opp.engineeringFirm}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge 
                              variant="light" 
                              className={`badge-segment-${opp.marketSegment.toLowerCase().replace(' ', '-')}`}
                            >
                              {opp.marketSegment}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Badge 
                              variant="light"
                              color={getPhaseColor(opp.salesPhase)}
                              className={`badge-opportunity-${opp.salesPhase.toLowerCase().replace(' ', '-')}`}
                            >
                              {opp.salesPhase}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={500} size="sm">{formatCurrency(opp.estimatedValue)}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Text size="sm">{opp.probability}%</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{formatDate(opp.expectedCloseDate)}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Menu position="bottom-end" withinPortal>
                              <Menu.Target>
                                <ActionIcon variant="subtle" size="sm">
                                  <IconDots size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item 
                                  leftSection={<IconEye size={14} />}
                                  onClick={() => router.push(`/commercial/opportunities/${opp.id}`)}
                                >
                                  View Details
                                </Menu.Item>
                                <Menu.Item leftSection={<IconEdit size={14} />}>
                                  Edit
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Table.Td>
                        </Table.Tr>
                      ))
                    )}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Group justify="center" mt="md">
                  <Pagination 
                    total={totalPages} 
                    value={currentPage} 
                    onChange={setCurrentPage}
                    size="sm"
                  />
                </Group>
              )}
            </Stack>
          </Card>
        </Stack>
      </div>
    </CommercialLayout>
  );
}

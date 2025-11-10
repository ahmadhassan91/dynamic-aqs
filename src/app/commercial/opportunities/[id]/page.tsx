'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Title, Text, Stack, Card, Group, Badge, Button, Tabs, Grid, 
  Progress, ActionIcon, Timeline, Table, ThemeIcon, Divider, Avatar,
  SimpleGrid, Paper, Textarea
} from '@mantine/core';
import { 
  IconArrowLeft, IconEdit, IconBriefcase, IconCurrencyDollar, IconBuilding,
  IconUser, IconCalendar, IconTrendingUp, IconFileText, IconHistory,
  IconTarget, IconChartBar, IconPhone, IconMail, IconCheck, IconX,
  IconClock, IconNotes
} from '@tabler/icons-react';
import { CommercialLayout } from '@/components/layout/CommercialLayout';

// Mock data - in production, fetch based on params.id
const mockOpportunityDetail = {
  id: '1',
  jobSiteName: 'University Medical Center HVAC Upgrade',
  description: 'Complete HVAC system replacement for 500-bed medical facility including rooftop units, air handling systems, and building automation controls.',
  marketSegment: 'Healthcare',
  productInterest: ['Rooftop Units', 'Air Handlers', 'Building Controls'],
  currentHVACSystem: 'Legacy 20-year-old system, multiple manufacturers',
  estimatedValue: 850000,
  probability: 75,
  salesPhase: 'Final Quote',
  status: 'active',
  
  // Stakeholders
  engineeringFirm: { id: 'firm-1', name: 'MEP Engineering Solutions', contact: 'John Smith', email: 'john.smith@mepeng.com', phone: '(555) 123-4567' },
  buildingOwner: { id: 'owner-1', name: 'University Health System', contact: 'Jane Doe', email: 'jane.doe@universityhealth.org', phone: '(555) 987-6543' },
  mechanicalContractor: { id: 'contractor-1', name: 'Premier Mechanical Inc', contact: 'Bob Wilson', email: 'bob@premiermech.com', phone: '(555) 456-7890' },
  manufacturerRep: { id: 'rep-1', name: 'Johnson Controls Rep', contact: 'Mike Davis', email: 'mike@jcrep.com', phone: '(555) 234-5678' },
  facilitiesManager: { id: 'fm-1', name: 'Sarah Johnson', contact: 'Sarah Johnson', email: 'sarah.j@universityhealth.org', phone: '(555) 345-6789' },
  
  regionalSalesManager: 'Tom Anderson',
  
  expectedCloseDate: '2024-02-15',
  createdAt: '2024-01-10',
  updatedAt: '2024-01-15',
  
  quotes: [
    { id: 'q-1', quoteNumber: 'Q-2024-001', amount: 850000, status: 'Submitted', submittedDate: '2024-01-15', validUntil: '2024-02-15', items: 5 },
    { id: 'q-2', quoteNumber: 'Q-2023-087', amount: 920000, status: 'Rejected', submittedDate: '2023-12-10', validUntil: '2024-01-10', items: 5 }
  ],
  
  notes: [
    { id: 'n-1', type: 'Meeting', author: 'Tom Anderson', content: 'Met with engineering team. Very positive response to our energy efficiency solutions. They are particularly interested in the variable speed drives.', createdAt: '2024-01-15', isPrivate: false },
    { id: 'n-2', type: 'Phone Call', author: 'Mike Davis', content: 'Facilities manager confirmed budget approval. Moving to final quote stage.', createdAt: '2024-01-12', isPrivate: false },
    { id: 'n-3', type: 'Email', author: 'Tom Anderson', content: 'Sent updated specifications and energy calculations.', createdAt: '2024-01-08', isPrivate: false },
    { id: 'n-4', type: 'Follow Up', author: 'Mike Davis', content: 'Internal note: Need to follow up on warranty terms next week.', createdAt: '2024-01-05', isPrivate: true }
  ],
  
  timeline: [
    { date: '2024-01-15', event: 'Quote Submitted', description: 'Final quote Q-2024-001 submitted for $850,000', user: 'Tom Anderson' },
    { date: '2024-01-12', event: 'Phase Changed', description: 'Moved to Final Quote stage', user: 'Tom Anderson' },
    { date: '2024-01-10', event: 'Budget Approved', description: 'Building owner confirmed budget approval', user: 'Mike Davis' },
    { date: '2023-12-20', event: 'Proposal Presented', description: 'Presented detailed proposal to engineering team', user: 'Tom Anderson' },
    { date: '2023-12-10', event: 'Initial Quote', description: 'Preliminary quote submitted', user: 'Tom Anderson' },
    { date: '2024-01-10', event: 'Opportunity Created', description: 'New opportunity identified', user: 'Tom Anderson' }
  ],
  
  competitors: [
    { name: 'Trane', products: 'Rooftop Units, Controls', estimatedPrice: 820000, strength: 'Existing relationship', weakness: 'Higher maintenance costs' },
    { name: 'Carrier', products: 'Complete System', estimatedPrice: 880000, strength: 'Local presence', weakness: 'Limited energy efficiency options' }
  ]
};

const getPhaseColor = (phase: string) => {
  const colors: Record<string, string> = {
    'Prospect': 'blue',
    'Qualification': 'cyan',
    'Proposal': 'grape',
    'Negotiation': 'violet',
    'Final Quote': 'indigo',
    'Won': 'green',
    'Lost': 'red'
  };
  return colors[phase] || 'gray';
};

const getQuoteStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Draft': 'gray',
    'Submitted': 'blue',
    'Accepted': 'green',
    'Rejected': 'red',
    'Expired': 'orange'
  };
  return colors[status] || 'gray';
};

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  
  const opportunity = mockOpportunityDetail;

  return (
    <CommercialLayout>
      <div className="residential-content-container">
        <Stack gap="xl" className="commercial-stack-large">
          
          {/* Header */}
          <div>
            <Button 
              variant="subtle" 
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.back()}
              mb="md"
            >
              Back to Opportunities
            </Button>
            
            <Card withBorder padding="xl" className="commercial-card-static">
              <Group justify="space-between" wrap="nowrap" align="flex-start">
                <div style={{ flex: 1 }}>
                  <Group gap="sm" mb="xs">
                    <Title order={1}>{opportunity.jobSiteName}</Title>
                    <Badge 
                      size="lg" 
                      variant="light" 
                      color={getPhaseColor(opportunity.salesPhase)}
                      className={`badge-opportunity-${opportunity.salesPhase.toLowerCase().replace(' ', '-')}`}
                    >
                      {opportunity.salesPhase}
                    </Badge>
                    <Badge 
                      size="lg" 
                      variant="light"
                      className={`badge-segment-${opportunity.marketSegment.toLowerCase()}`}
                    >
                      {opportunity.marketSegment}
                    </Badge>
                  </Group>
                  <Text size="md" c="dimmed" mb="md">{opportunity.description}</Text>
                  <Group gap="md">
                    <Group gap="xs">
                      <IconCurrencyDollar size={16} />
                      <Text size="sm" fw={600}>
                        ${(opportunity.estimatedValue / 1000).toFixed(0)}K
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <IconTarget size={16} />
                      <Text size="sm">
                        {opportunity.probability}% Probability
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <Text size="sm">
                        Expected: {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                      </Text>
                    </Group>
                  </Group>
                </div>
                <Button leftSection={<IconEdit size={16} />} size="md">
                  Edit Opportunity
                </Button>
              </Group>
            </Card>
          </div>

          {/* Key Metrics */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="md" className="commercial-stat-card">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">Estimated Value</Text>
                  <ThemeIcon variant="light" color="blue" size="sm">
                    <IconCurrencyDollar size={16} />
                  </ThemeIcon>
                </Group>
                <Text className="commercial-stat-value">
                  ${(opportunity.estimatedValue / 1000).toFixed(0)}K
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  Total project value
                </Text>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="md" className="commercial-stat-card">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">Probability</Text>
                  <ThemeIcon variant="light" color="green" size="sm">
                    <IconTrendingUp size={16} />
                  </ThemeIcon>
                </Group>
                <Text className="commercial-stat-value">{opportunity.probability}%</Text>
                <Progress value={opportunity.probability} size="sm" color="green" mt="xs" />
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="md" className="commercial-stat-card">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">Weighted Value</Text>
                  <ThemeIcon variant="light" color="violet" size="sm">
                    <IconChartBar size={16} />
                  </ThemeIcon>
                </Group>
                <Text className="commercial-stat-value">
                  ${((opportunity.estimatedValue * opportunity.probability) / 100000).toFixed(0)}K
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  Value × Probability
                </Text>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="md" className="commercial-stat-card">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">Days in Stage</Text>
                  <ThemeIcon variant="light" color="orange" size="sm">
                    <IconClock size={16} />
                  </ThemeIcon>
                </Group>
                <Text className="commercial-stat-value">
                  {Math.floor((new Date().getTime() - new Date(opportunity.updatedAt).getTime()) / (1000 * 60 * 60 * 24))}
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  Since last update
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="overview" leftSection={<IconBriefcase size={16} />}>
                Overview
              </Tabs.Tab>
              <Tabs.Tab value="stakeholders" leftSection={<IconUser size={16} />}>
                Stakeholders
              </Tabs.Tab>
              <Tabs.Tab value="quotes" leftSection={<IconFileText size={16} />}>
                Quotes
              </Tabs.Tab>
              <Tabs.Tab value="notes" leftSection={<IconNotes size={16} />}>
                Notes & Activity
              </Tabs.Tab>
              <Tabs.Tab value="timeline" leftSection={<IconHistory size={16} />}>
                Timeline
              </Tabs.Tab>
              <Tabs.Tab value="competitive" leftSection={<IconTarget size={16} />}>
                Competitive Analysis
              </Tabs.Tab>
            </Tabs.List>

            {/* Overview Tab */}
            <Tabs.Panel value="overview" pt="xl">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg" className="commercial-card-static">
                    <Title order={3} mb="md">Project Details</Title>
                    <Stack gap="md">
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Job Site Name</Text>
                        <Text fw={500}>{opportunity.jobSiteName}</Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Description</Text>
                        <Text>{opportunity.description}</Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Market Segment</Text>
                        <Badge 
                          variant="light" 
                          size="lg"
                          className={`badge-segment-${opportunity.marketSegment.toLowerCase()}`}
                        >
                          {opportunity.marketSegment}
                        </Badge>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Products of Interest</Text>
                        <Group gap="xs">
                          {opportunity.productInterest.map((product, index) => (
                            <Badge key={index} variant="light" size="sm">
                              {product}
                            </Badge>
                          ))}
                        </Group>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Current HVAC System</Text>
                        <Text>{opportunity.currentHVACSystem}</Text>
                      </div>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg" className="commercial-card-static">
                    <Title order={3} mb="md">Sales Information</Title>
                    <Stack gap="md">
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Sales Phase</Text>
                        <Badge 
                          size="lg" 
                          variant="light" 
                          color={getPhaseColor(opportunity.salesPhase)}
                          className={`badge-opportunity-${opportunity.salesPhase.toLowerCase().replace(' ', '-')}`}
                        >
                          {opportunity.salesPhase}
                        </Badge>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Estimated Value</Text>
                        <Text fw={600} size="xl">
                          ${opportunity.estimatedValue.toLocaleString()}
                        </Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Win Probability</Text>
                        <Group gap="md">
                          <Progress 
                            value={opportunity.probability} 
                            size="xl" 
                            color="green" 
                            style={{ flex: 1 }}
                          />
                          <Text fw={600} size="xl">{opportunity.probability}%</Text>
                        </Group>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Regional Sales Manager</Text>
                        <Text fw={500}>{opportunity.regionalSalesManager}</Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Expected Close Date</Text>
                        <Group gap="xs">
                          <IconCalendar size={16} />
                          <Text fw={500}>
                            {new Date(opportunity.expectedCloseDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Text>
                        </Group>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Created</Text>
                        <Text size="sm">
                          {new Date(opportunity.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </Text>
                      </div>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            {/* Stakeholders Tab */}
            <Tabs.Panel value="stakeholders" pt="xl">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg" className="commercial-card">
                    <Title order={4} mb="md">Engineering Firm</Title>
                    <Stack gap="sm">
                      <Group gap="xs">
                        <IconBuilding size={16} />
                        <Text fw={600}>{opportunity.engineeringFirm.name}</Text>
                      </Group>
                      <div>
                        <Text size="sm" c="dimmed">Contact</Text>
                        <Text fw={500}>{opportunity.engineeringFirm.contact}</Text>
                      </div>
                      <Group gap="xs">
                        <IconMail size={14} />
                        <Text size="sm">{opportunity.engineeringFirm.email}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconPhone size={14} />
                        <Text size="sm">{opportunity.engineeringFirm.phone}</Text>
                      </Group>
                      <Button 
                        variant="light" 
                        size="xs" 
                        fullWidth
                        onClick={() => router.push(`/commercial/engineers/${opportunity.engineeringFirm.id}`)}
                      >
                        View Engineer Profile
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg" className="commercial-card">
                    <Title order={4} mb="md">Building Owner</Title>
                    <Stack gap="sm">
                      <Group gap="xs">
                        <IconBuilding size={16} />
                        <Text fw={600}>{opportunity.buildingOwner.name}</Text>
                      </Group>
                      <div>
                        <Text size="sm" c="dimmed">Contact</Text>
                        <Text fw={500}>{opportunity.buildingOwner.contact}</Text>
                      </div>
                      <Group gap="xs">
                        <IconMail size={14} />
                        <Text size="sm">{opportunity.buildingOwner.email}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconPhone size={14} />
                        <Text size="sm">{opportunity.buildingOwner.phone}</Text>
                      </Group>
                      <Button variant="light" size="xs" fullWidth>
                        View Organization
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg" className="commercial-card">
                    <Title order={4} mb="md">Mechanical Contractor</Title>
                    <Stack gap="sm">
                      <Group gap="xs">
                        <IconBuilding size={16} />
                        <Text fw={600}>{opportunity.mechanicalContractor.name}</Text>
                      </Group>
                      <div>
                        <Text size="sm" c="dimmed">Contact</Text>
                        <Text fw={500}>{opportunity.mechanicalContractor.contact}</Text>
                      </div>
                      <Group gap="xs">
                        <IconMail size={14} />
                        <Text size="sm">{opportunity.mechanicalContractor.email}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconPhone size={14} />
                        <Text size="sm">{opportunity.mechanicalContractor.phone}</Text>
                      </Group>
                      <Button variant="light" size="xs" fullWidth>
                        View Organization
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg" className="commercial-card">
                    <Title order={4} mb="md">Manufacturer Rep</Title>
                    <Stack gap="sm">
                      <Group gap="xs">
                        <IconUser size={16} />
                        <Text fw={600}>{opportunity.manufacturerRep.name}</Text>
                      </Group>
                      <div>
                        <Text size="sm" c="dimmed">Contact</Text>
                        <Text fw={500}>{opportunity.manufacturerRep.contact}</Text>
                      </div>
                      <Group gap="xs">
                        <IconMail size={14} />
                        <Text size="sm">{opportunity.manufacturerRep.email}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconPhone size={14} />
                        <Text size="sm">{opportunity.manufacturerRep.phone}</Text>
                      </Group>
                      <Button variant="light" size="xs" fullWidth>
                        View Rep Profile
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg" className="commercial-card">
                    <Title order={4} mb="md">Facilities Manager</Title>
                    <Stack gap="sm">
                      <Group gap="xs">
                        <IconUser size={16} />
                        <Text fw={600}>{opportunity.facilitiesManager.name}</Text>
                      </Group>
                      <div>
                        <Text size="sm" c="dimmed">Contact</Text>
                        <Text fw={500}>{opportunity.facilitiesManager.contact}</Text>
                      </div>
                      <Group gap="xs">
                        <IconMail size={14} />
                        <Text size="sm">{opportunity.facilitiesManager.email}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconPhone size={14} />
                        <Text size="sm">{opportunity.facilitiesManager.phone}</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            {/* Quotes Tab */}
            <Tabs.Panel value="quotes" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Group justify="space-between" mb="md">
                  <Title order={3}>Quotes</Title>
                  <Button variant="light" leftSection={<IconFileText size={16} />}>
                    Create New Quote
                  </Button>
                </Group>
                
                {opportunity.quotes.length === 0 ? (
                  <div className="commercial-empty-state">
                    <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                      <IconFileText size={30} />
                    </ThemeIcon>
                    <Text size="lg" fw={500}>No quotes yet</Text>
                    <Text size="sm" c="dimmed">Create your first quote for this opportunity</Text>
                    <Button variant="light" mt="md">
                      Create Quote
                    </Button>
                  </div>
                ) : (
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Quote Number</Table.Th>
                        <Table.Th>Amount</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Submitted</Table.Th>
                        <Table.Th>Valid Until</Table.Th>
                        <Table.Th>Items</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {opportunity.quotes.map((quote) => (
                        <Table.Tr key={quote.id}>
                          <Table.Td>
                            <Text fw={500}>{quote.quoteNumber}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={600}>${quote.amount.toLocaleString()}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge 
                              variant="light" 
                              color={getQuoteStatusColor(quote.status)}
                            >
                              {quote.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {new Date(quote.submittedDate).toLocaleDateString()}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {new Date(quote.validUntil).toLocaleDateString()}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{quote.items} items</Text>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Button variant="light" size="xs">
                                View
                              </Button>
                              <Button variant="light" size="xs">
                                Download
                              </Button>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </Card>
            </Tabs.Panel>

            {/* Notes Tab */}
            <Tabs.Panel value="notes" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Group justify="space-between" mb="md">
                  <Title order={3}>Notes & Activity</Title>
                  <Button variant="light" leftSection={<IconNotes size={16} />}>
                    Add Note
                  </Button>
                </Group>
                
                <Stack gap="md">
                  {opportunity.notes.map((note) => (
                    <Card key={note.id} withBorder padding="md" radius="md">
                      <Group justify="space-between" mb="xs">
                        <Group gap="xs">
                          <Badge variant="light" size="sm">
                            {note.type}
                          </Badge>
                          {note.isPrivate && (
                            <Badge variant="filled" color="orange" size="sm">
                              Private
                            </Badge>
                          )}
                        </Group>
                        <Text size="xs" c="dimmed">
                          {new Date(note.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </Group>
                      <Text size="sm" mb="xs">
                        {note.content}
                      </Text>
                      <Text size="xs" c="dimmed">
                        by {note.author}
                      </Text>
                    </Card>
                  ))}
                </Stack>
              </Card>
            </Tabs.Panel>

            {/* Timeline Tab */}
            <Tabs.Panel value="timeline" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Title order={3} mb="md">Opportunity Timeline</Title>
                
                <Timeline active={opportunity.timeline.length} bulletSize={24} lineWidth={2}>
                  {opportunity.timeline.map((event, index) => (
                    <Timeline.Item 
                      key={index} 
                      bullet={<IconCalendar size={12} />}
                      title={event.event}
                    >
                      <Text c="dimmed" size="sm" mb="xs">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Text>
                      <Text size="sm" mb="xs">
                        {event.description}
                      </Text>
                      <Text size="xs" c="dimmed">
                        by {event.user}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Tabs.Panel>

            {/* Competitive Analysis Tab */}
            <Tabs.Panel value="competitive" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Title order={3} mb="md">Competitive Analysis</Title>
                
                {opportunity.competitors.length === 0 ? (
                  <div className="commercial-empty-state">
                    <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                      <IconTarget size={30} />
                    </ThemeIcon>
                    <Text size="lg" fw={500}>No competitor data</Text>
                    <Text size="sm" c="dimmed">Add competitor information to track the competitive landscape</Text>
                  </div>
                ) : (
                  <Stack gap="md">
                    {opportunity.competitors.map((competitor, index) => (
                      <Card key={index} withBorder padding="md" radius="md">
                        <Group justify="space-between" mb="md">
                          <Title order={4}>{competitor.name}</Title>
                          <Text fw={600} size="lg">
                            ${(competitor.estimatedPrice / 1000).toFixed(0)}K
                          </Text>
                        </Group>
                        
                        <SimpleGrid cols={3} spacing="md">
                          <div>
                            <Text size="sm" c="dimmed" mb={4}>Products</Text>
                            <Text size="sm" fw={500}>{competitor.products}</Text>
                          </div>
                          <div>
                            <Text size="sm" c="dimmed" mb={4}>Strength</Text>
                            <Badge variant="light" color="green" size="sm">
                              {competitor.strength}
                            </Badge>
                          </div>
                          <div>
                            <Text size="sm" c="dimmed" mb={4}>Weakness</Text>
                            <Badge variant="light" color="red" size="sm">
                              {competitor.weakness}
                            </Badge>
                          </div>
                        </SimpleGrid>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Card>
            </Tabs.Panel>
          </Tabs>

        </Stack>
      </div>
    </CommercialLayout>
  );
}

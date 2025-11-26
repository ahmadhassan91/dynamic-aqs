'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Title, Text, Stack, Card, Group, Badge, Button, Tabs, Grid, 
  Avatar, Progress, ActionIcon, Timeline, Table, ThemeIcon, Divider,
  SimpleGrid, Paper
} from '@mantine/core';
import { 
  IconArrowLeft, IconEdit, IconStar, IconBuilding, IconPhone, IconMail, 
  IconCalendar, IconTrendingUp, IconBriefcase, IconFileText, IconHistory,
  IconUser, IconTarget, IconChartBar
} from '@tabler/icons-react';
import { CommercialLayout } from '@/components/layout/CommercialLayout';

// Mock data - in production, fetch based on params.id
const mockEngineerDetail = {
  id: '1',
  name: 'John Smith',
  title: 'Senior Mechanical Engineer',
  company: 'MEP Engineering Solutions',
  companyId: 'firm-1',
  email: 'john.smith@mepeng.com',
  phone: '(555) 123-4567',
  rating: 5,
  totalOpportunities: 12,
  wonOpportunities: 8,
  lostOpportunities: 2,
  activeOpportunities: 2,
  totalValue: 2400000,
  wonValue: 1850000,
  lastContact: '2024-01-15',
  nextFollowUp: '2024-02-01',
  marketSegments: ['Healthcare', 'Education'],
  createdAt: '2023-06-15',
  // Organizational Assignments
  territoryManager: 'Sarah Wilson',
  territoryManagerId: 'tm-1',
  repFirm: 'Acme Representatives - San Francisco Office',
  repFirmId: 'rep-sf-001',
  repFirmParent: 'Acme Representatives (National)',
  architectFirm: 'Smith & Associates Architecture',
  architectFirmId: 'arch-001',
  engineeringFirm: 'MEP Engineering Solutions - West Coast Division',
  engineeringFirmId: 'eng-wc-001',
  engineeringFirmParent: 'MEP Engineering Solutions (Global)',
  contractor: 'BuildRight Construction Company',
  contractorId: 'con-001',
  ratingHistory: [
    { date: '2023-06-15', rating: 3, reason: 'Initial contact - neutral stance', changedBy: 'Sarah Wilson' },
    { date: '2023-09-20', rating: 4, reason: 'Positive meeting at lunch & learn', changedBy: 'Mike Johnson' },
    { date: '2023-12-10', rating: 5, reason: 'Specified our products on major project', changedBy: 'Sarah Wilson' }
  ],
  recentInteractions: [
    { id: '1', type: 'Meeting', date: '2024-01-15', description: 'Project review for University Medical Center', outcome: 'Positive - moving to final quote stage', followUpRequired: true, followUpDate: '2024-02-01' },
    { id: '2', type: 'Phone Call', date: '2024-01-08', description: 'Discussed new healthcare project specifications', outcome: 'Interested in our energy-efficient solutions', followUpRequired: false },
    { id: '3', type: 'Lunch and Learn', date: '2023-12-20', description: 'Product demonstration at MEP office', outcome: 'Well attended, 8 engineers present', followUpRequired: true, followUpDate: '2024-01-15' },
    { id: '4', type: 'Email', date: '2023-12-10', description: 'Sent technical documentation for new product line', outcome: 'Acknowledged receipt', followUpRequired: false }
  ],
  opportunities: [
    { id: 'opp-1', name: 'University Medical Center HVAC Upgrade', phase: 'Final Quote', value: 850000, probability: 75, segment: 'Healthcare', expectedClose: '2024-02-15', status: 'active' },
    { id: 'opp-2', name: 'Regional Hospital Expansion', phase: 'Proposal', value: 620000, probability: 60, segment: 'Healthcare', expectedClose: '2024-03-01', status: 'active' },
    { id: 'opp-3', name: 'Community College Science Building', phase: 'Won', value: 480000, probability: 100, segment: 'Education', expectedClose: '2023-11-30', status: 'won' },
    { id: 'opp-4', name: 'High School Renovation', phase: 'Won', value: 380000, probability: 100, segment: 'Education', expectedClose: '2023-09-15', status: 'won' }
  ],
  specifications: [
    { project: 'City Hospital Renovation', product: 'Rooftop Units - Energy Star Certified', value: 380000, date: '2023-11-01', status: 'Awarded' },
    { project: 'University Library HVAC', product: 'Chiller System - Variable Speed', value: 520000, date: '2023-08-15', status: 'Awarded' },
    { project: 'Medical Office Building', product: 'Air Handling Units - Premium Line', value: 280000, date: '2023-05-20', status: 'Specified' }
  ]
};

const getRatingColor = (rating: number) => {
  if (rating === 5) return 'yellow';
  if (rating === 4) return 'green';
  if (rating === 3) return 'blue';
  if (rating === 2) return 'orange';
  return 'red';
};

const getRatingLabel = (rating: number) => {
  if (rating === 5) return 'Champion';
  if (rating === 4) return 'Favorable';
  if (rating === 3) return 'Neutral';
  if (rating === 2) return 'Unfavorable';
  return 'Hostile';
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

export default function EngineerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  
  const engineer = mockEngineerDetail;
  const winRate = engineer.totalOpportunities > 0 
    ? Math.round((engineer.wonOpportunities / engineer.totalOpportunities) * 100) 
    : 0;
  const avgDealSize = engineer.wonOpportunities > 0 
    ? Math.round(engineer.wonValue / engineer.wonOpportunities) 
    : 0;

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
              Back to Engineers
            </Button>
            
            <Card withBorder padding="xl" className="commercial-card-static">
              <Group justify="space-between" wrap="nowrap">
                <Group gap="lg">
                  <Avatar size={80} radius="xl" color="blue">
                    {engineer.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <div>
                    <Group gap="sm" mb="xs">
                      <Title order={1}>{engineer.name}</Title>
                      <Badge 
                        size="lg" 
                        variant="filled" 
                        color={getRatingColor(engineer.rating)}
                        className={`badge-engineer-rating-${engineer.rating}`}
                      >
                        <Group gap={4}>
                          <IconStar size={14} />
                          {engineer.rating}/5 - {getRatingLabel(engineer.rating)}
                        </Group>
                      </Badge>
                    </Group>
                    <Text size="lg" fw={500} c="dimmed" mb="xs">{engineer.title}</Text>
                    <Group gap="md">
                      <Group gap="xs">
                        <IconBuilding size={16} />
                        <Text size="sm" fw={500}>{engineer.company}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconMail size={16} />
                        <Text size="sm">{engineer.email}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconPhone size={16} />
                        <Text size="sm">{engineer.phone}</Text>
                      </Group>
                    </Group>
                  </div>
                </Group>
                <Button leftSection={<IconEdit size={16} />} size="md">
                  Edit Contact
                </Button>
              </Group>
            </Card>
          </div>

          {/* Key Metrics */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="md" className="commercial-stat-card">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">Win Rate</Text>
                  <ThemeIcon variant="light" color="green" size="sm">
                    <IconTrendingUp size={16} />
                  </ThemeIcon>
                </Group>
                <Text className="commercial-stat-value">{winRate}%</Text>
                <Progress value={winRate} size="sm" color="green" mt="xs" />
                <Text size="xs" c="dimmed" mt="xs">
                  {engineer.wonOpportunities} of {engineer.totalOpportunities} opportunities
                </Text>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="md" className="commercial-stat-card">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">Total Value</Text>
                  <ThemeIcon variant="light" color="blue" size="sm">
                    <IconTarget size={16} />
                  </ThemeIcon>
                </Group>
                <Text className="commercial-stat-value">
                  ${(engineer.totalValue / 1000000).toFixed(2)}M
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  Won: ${(engineer.wonValue / 1000000).toFixed(2)}M
                </Text>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="md" className="commercial-stat-card">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">Avg Deal Size</Text>
                  <ThemeIcon variant="light" color="violet" size="sm">
                    <IconChartBar size={16} />
                  </ThemeIcon>
                </Group>
                <Text className="commercial-stat-value">
                  ${(avgDealSize / 1000).toFixed(0)}K
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  Based on won opportunities
                </Text>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder padding="md" className="commercial-stat-card">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">Active Pipeline</Text>
                  <ThemeIcon variant="light" color="orange" size="sm">
                    <IconBriefcase size={16} />
                  </ThemeIcon>
                </Group>
                <Text className="commercial-stat-value">{engineer.activeOpportunities}</Text>
                <Text size="xs" c="dimmed" mt="xs">
                  Opportunities in progress
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="overview" leftSection={<IconUser size={16} />}>
                Overview
              </Tabs.Tab>
              <Tabs.Tab value="opportunities" leftSection={<IconBriefcase size={16} />}>
                Opportunities
              </Tabs.Tab>
              <Tabs.Tab value="interactions" leftSection={<IconCalendar size={16} />}>
                Interactions
              </Tabs.Tab>
              <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
                Rating History
              </Tabs.Tab>
              <Tabs.Tab value="specifications" leftSection={<IconFileText size={16} />}>
                Specifications
              </Tabs.Tab>
            </Tabs.List>

            {/* Overview Tab */}
            <Tabs.Panel value="overview" pt="xl">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg" className="commercial-card-static">
                    <Title order={3} mb="md">Contact Information</Title>
                    <Stack gap="md">
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Full Name</Text>
                        <Text fw={500}>{engineer.name}</Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Title</Text>
                        <Text fw={500}>{engineer.title}</Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Company</Text>
                        <Text fw={500}>{engineer.company}</Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Email</Text>
                        <Text fw={500}>{engineer.email}</Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Phone</Text>
                        <Text fw={500}>{engineer.phone}</Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Market Segments</Text>
                        <Group gap="xs">
                          {engineer.marketSegments.map((segment) => (
                            <Badge key={segment} variant="light" size="lg">
                              {segment}
                            </Badge>
                          ))}
                        </Group>
                      </div>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg" className="commercial-card-static">
                    <Title order={3} mb="md">Relationship Status</Title>
                    <Stack gap="lg">
                      <div>
                        <Group justify="space-between" mb="xs">
                          <Text size="sm" fw={500}>Current Rating</Text>
                          <Badge 
                            size="lg" 
                            variant="filled" 
                            color={getRatingColor(engineer.rating)}
                            className={`badge-engineer-rating-${engineer.rating}`}
                          >
                            {engineer.rating}/5 - {getRatingLabel(engineer.rating)}
                          </Badge>
                        </Group>
                        <Text size="sm" c="dimmed">
                          This engineer is a {getRatingLabel(engineer.rating).toLowerCase()} contact with strong potential.
                        </Text>
                      </div>

                      <Divider />

                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Last Contact</Text>
                        <Group gap="xs">
                          <IconCalendar size={16} />
                          <Text fw={500}>
                            {new Date(engineer.lastContact).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Text>
                        </Group>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Next Follow-Up</Text>
                        <Group gap="xs">
                          <IconCalendar size={16} />
                          <Text fw={500} c="orange">
                            {new Date(engineer.nextFollowUp).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Text>
                        </Group>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Relationship Duration</Text>
                        <Text fw={500}>
                          {Math.floor((new Date().getTime() - new Date(engineer.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                        </Text>
                      </div>

                      <Button variant="light" fullWidth>
                        Log Interaction
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>

                {/* Organizational Assignments */}
                <Grid.Col span={{ base: 12 }}>
                  <Card withBorder padding="lg" className="commercial-card-static">
                    <Group justify="space-between" mb="md">
                      <Title order={3}>Organizational Assignments</Title>
                      <Button variant="light" size="sm" leftSection={<IconEdit size={16} />}>
                        Edit Assignments
                      </Button>
                    </Group>
                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="md">
                          <div>
                            <Text size="sm" c="dimmed" mb={4}>Territory Manager</Text>
                            <Group gap="xs">
                              <IconUser size={16} />
                              <Text fw={500}>{engineer.territoryManager}</Text>
                            </Group>
                          </div>
                          <Divider />
                          <div>
                            <Text size="sm" c="dimmed" mb={4}>Manufacturer Rep Firm</Text>
                            <Stack gap="xs">
                              <Group gap="xs">
                                <IconBuilding size={16} />
                                <Text fw={500}>{engineer.repFirm}</Text>
                              </Group>
                              <Group gap="xs" pl="xl">
                                <Text size="sm" c="dimmed">↳ Parent Organization:</Text>
                                <Badge variant="light" color="blue">{engineer.repFirmParent}</Badge>
                              </Group>
                            </Stack>
                          </div>
                          <Divider />
                          <div>
                            <Text size="sm" c="dimmed" mb={4}>Engineering Firm (MEP)</Text>
                            <Stack gap="xs">
                              <Group gap="xs">
                                <IconBuilding size={16} />
                                <Text fw={500}>{engineer.engineeringFirm}</Text>
                              </Group>
                              <Group gap="xs" pl="xl">
                                <Text size="sm" c="dimmed">↳ Parent Organization:</Text>
                                <Badge variant="light" color="green">{engineer.engineeringFirmParent}</Badge>
                              </Group>
                            </Stack>
                          </div>
                        </Stack>
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="md">
                          <div>
                            <Text size="sm" c="dimmed" mb={4}>Architect Firm</Text>
                            <Group gap="xs">
                              <IconBuilding size={16} />
                              <Text fw={500}>{engineer.architectFirm}</Text>
                            </Group>
                          </div>
                          <Divider />
                          <div>
                            <Text size="sm" c="dimmed" mb={4}>Contractor</Text>
                            <Group gap="xs">
                              <IconBuilding size={16} />
                              <Text fw={500}>{engineer.contractor}</Text>
                            </Group>
                          </div>
                          <Divider />
                          <div>
                            <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
                              <Text size="sm" fw={500} mb="xs">Parent-Child Relationships</Text>
                              <Text size="xs" c="dimmed">
                                This contact can be reported on at both the division and parent organization level. 
                                For example, all sales to {engineer.repFirm} roll up to {engineer.repFirmParent} for national reporting.
                              </Text>
                            </Paper>
                          </div>
                        </Stack>
                      </Grid.Col>
                    </Grid>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            {/* Opportunities Tab */}
            <Tabs.Panel value="opportunities" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Title order={3} mb="md">Associated Opportunities</Title>
                
                {engineer.opportunities.length === 0 ? (
                  <div className="commercial-empty-state">
                    <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                      <IconBriefcase size={30} />
                    </ThemeIcon>
                    <Text size="lg" fw={500}>No opportunities yet</Text>
                    <Text size="sm" c="dimmed">Create a new opportunity for this engineer</Text>
                    <Button variant="light" mt="md">
                      Create Opportunity
                    </Button>
                  </div>
                ) : (
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Opportunity</Table.Th>
                        <Table.Th>Phase</Table.Th>
                        <Table.Th>Segment</Table.Th>
                        <Table.Th>Value</Table.Th>
                        <Table.Th>Probability</Table.Th>
                        <Table.Th>Expected Close</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {engineer.opportunities.map((opp) => (
                        <Table.Tr key={opp.id}>
                          <Table.Td>
                            <Text fw={500}>{opp.name}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge 
                              variant="light" 
                              color={getPhaseColor(opp.phase)}
                              className={`badge-opportunity-${opp.phase.toLowerCase().replace(' ', '-')}`}
                            >
                              {opp.phase}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="light" className={`badge-segment-${opp.segment.toLowerCase()}`}>
                              {opp.segment}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={500}>${(opp.value / 1000).toFixed(0)}K</Text>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Progress value={opp.probability} size="sm" style={{ flex: 1 }} />
                              <Text size="sm">{opp.probability}%</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {new Date(opp.expectedClose).toLocaleDateString()}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Button 
                              variant="light" 
                              size="xs"
                              onClick={() => router.push(`/commercial/opportunities/${opp.id}`)}
                            >
                              View
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </Card>
            </Tabs.Panel>

            {/* Interactions Tab */}
            <Tabs.Panel value="interactions" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Group justify="space-between" mb="md">
                  <Title order={3}>Interaction History</Title>
                  <Button variant="light" leftSection={<IconCalendar size={16} />}>
                    Log New Interaction
                  </Button>
                </Group>
                
                <Timeline active={engineer.recentInteractions.length} bulletSize={24} lineWidth={2}>
                  {engineer.recentInteractions.map((interaction, index) => (
                    <Timeline.Item 
                      key={interaction.id} 
                      bullet={<IconCalendar size={12} />}
                      title={interaction.type}
                    >
                      <Text c="dimmed" size="sm" mb="xs">
                        {new Date(interaction.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Text>
                      <Text size="sm" mb="xs">
                        <strong>Description:</strong> {interaction.description}
                      </Text>
                      {interaction.outcome && (
                        <Text size="sm" mb="xs">
                          <strong>Outcome:</strong> {interaction.outcome}
                        </Text>
                      )}
                      {interaction.followUpRequired && interaction.followUpDate && (
                        <Badge variant="light" color="orange" size="sm">
                          Follow-up: {new Date(interaction.followUpDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Tabs.Panel>

            {/* Rating History Tab */}
            <Tabs.Panel value="history" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Title order={3} mb="md">Rating Change History</Title>
                
                <Timeline active={engineer.ratingHistory.length} bulletSize={30} lineWidth={2}>
                  {engineer.ratingHistory.map((change, index) => (
                    <Timeline.Item 
                      key={index}
                      bullet={<IconStar size={14} />}
                      title={
                        <Group gap="xs">
                          <Text fw={500}>Rating changed to {change.rating}/5</Text>
                          <Badge 
                            variant="filled" 
                            color={getRatingColor(change.rating)}
                            className={`badge-engineer-rating-${change.rating}`}
                          >
                            {getRatingLabel(change.rating)}
                          </Badge>
                        </Group>
                      }
                    >
                      <Text c="dimmed" size="sm" mb="xs">
                        {new Date(change.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} by {change.changedBy}
                      </Text>
                      <Text size="sm">
                        <strong>Reason:</strong> {change.reason}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Tabs.Panel>

            {/* Specifications Tab */}
            <Tabs.Panel value="specifications" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Title order={3} mb="md">Product Specifications</Title>
                
                {engineer.specifications.length === 0 ? (
                  <div className="commercial-empty-state">
                    <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                      <IconFileText size={30} />
                    </ThemeIcon>
                    <Text size="lg" fw={500}>No specifications yet</Text>
                    <Text size="sm" c="dimmed">No product specifications recorded for this engineer</Text>
                  </div>
                ) : (
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Project</Table.Th>
                        <Table.Th>Product</Table.Th>
                        <Table.Th>Value</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {engineer.specifications.map((spec, index) => (
                        <Table.Tr key={index}>
                          <Table.Td>
                            <Text fw={500}>{spec.project}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{spec.product}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={500}>${(spec.value / 1000).toFixed(0)}K</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {new Date(spec.date).toLocaleDateString()}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge 
                              variant="light" 
                              color={spec.status === 'Awarded' ? 'green' : 'blue'}
                            >
                              {spec.status}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </Card>
            </Tabs.Panel>
          </Tabs>

        </Stack>
      </div>
    </CommercialLayout>
  );
}

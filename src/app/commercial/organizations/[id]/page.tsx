'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Title, Text, Stack, Card, Group, Badge, Button, Tabs, Grid, 
  Avatar, ActionIcon, Timeline, Table, ThemeIcon, Divider, Tree
} from '@mantine/core';
import { 
  IconArrowLeft, IconEdit, IconBuilding, IconPhone, IconMail, 
  IconMapPin, IconUsers, IconBriefcase, IconHistory, IconChartBar,
  IconTrendingUp, IconTarget, IconNotes, IconSitemap
} from '@tabler/icons-react';
import { CommercialLayout } from '@/components/layout/CommercialLayout';

// Mock data - in production, fetch based on params.id
const mockOrganizationDetail = {
  id: 'org-1',
  name: 'MEP Engineering Solutions',
  type: 'Engineering Firm',
  isActive: true,
  
  contactInfo: {
    address: {
      street: '123 Main Street, Suite 400',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      country: 'USA'
    },
    phone: '(555) 123-4567',
    email: 'info@mepeng.com',
    website: 'www.mepeng.com'
  },
  
  territory: 'North Texas',
  
  parentOrganization: null,
  childOrganizations: [
    { id: 'child-1', name: 'MEP Engineering - Houston Office', type: 'Branch Office' },
    { id: 'child-2', name: 'MEP Engineering - Austin Office', type: 'Branch Office' }
  ],
  
  stats: {
    totalContacts: 12,
    activeContacts: 10,
    totalOpportunities: 28,
    activeOpportunities: 8,
    wonOpportunities: 15,
    totalValue: 4250000,
    wonValue: 2850000,
    avgDealSize: 190000
  },
  
  keyContacts: [
    { 
      id: 'contact-1', 
      name: 'John Smith', 
      title: 'Senior Mechanical Engineer', 
      email: 'john.smith@mepeng.com', 
      phone: '(555) 123-4567',
      rating: 5,
      isPrimary: true,
      opportunities: 12,
      wonValue: 1850000
    },
    { 
      id: 'contact-2', 
      name: 'Sarah Williams', 
      title: 'Project Manager', 
      email: 'sarah.w@mepeng.com', 
      phone: '(555) 234-5678',
      rating: 4,
      isPrimary: false,
      opportunities: 8,
      wonValue: 680000
    },
    { 
      id: 'contact-3', 
      name: 'Mike Johnson', 
      title: 'Lead Engineer', 
      email: 'mike.j@mepeng.com', 
      phone: '(555) 345-6789',
      rating: 4,
      isPrimary: false,
      opportunities: 6,
      wonValue: 320000
    },
    { 
      id: 'contact-4', 
      name: 'Emily Chen', 
      title: 'Associate Engineer', 
      email: 'emily.c@mepeng.com', 
      phone: '(555) 456-7890',
      rating: 3,
      isPrimary: false,
      opportunities: 2,
      wonValue: 0
    }
  ],
  
  recentOpportunities: [
    { 
      id: 'opp-1', 
      name: 'University Medical Center HVAC Upgrade', 
      phase: 'Final Quote', 
      value: 850000, 
      probability: 75,
      contact: 'John Smith',
      segment: 'Healthcare',
      expectedClose: '2024-02-15'
    },
    { 
      id: 'opp-2', 
      name: 'Regional Hospital Expansion', 
      phase: 'Proposal', 
      value: 620000, 
      probability: 60,
      contact: 'John Smith',
      segment: 'Healthcare',
      expectedClose: '2024-03-01'
    },
    { 
      id: 'opp-3', 
      name: 'Downtown Office Complex Phase 2', 
      phase: 'Negotiation', 
      value: 480000, 
      probability: 65,
      contact: 'Sarah Williams',
      segment: 'Commercial Office',
      expectedClose: '2024-02-28'
    }
  ],
  
  recentActivity: [
    { 
      id: 'act-1', 
      type: 'Meeting', 
      date: '2024-01-15', 
      description: 'Quarterly review meeting with engineering team',
      contact: 'John Smith',
      user: 'Tom Anderson'
    },
    { 
      id: 'act-2', 
      type: 'Phone Call', 
      date: '2024-01-12', 
      description: 'Discussed new healthcare project opportunity',
      contact: 'John Smith',
      user: 'Mike Davis'
    },
    { 
      id: 'act-3', 
      type: 'Lunch and Learn', 
      date: '2023-12-20', 
      description: 'Product demonstration at MEP office - 8 engineers attended',
      contact: 'Sarah Williams',
      user: 'Tom Anderson'
    },
    { 
      id: 'act-4', 
      type: 'Email', 
      date: '2023-12-15', 
      description: 'Sent updated product catalog and pricing',
      contact: 'Mike Johnson',
      user: 'Sarah Wilson'
    }
  ],
  
  marketSegments: ['Healthcare', 'Education', 'Commercial Office', 'Industrial'],
  
  performance: {
    winRate: 54,
    avgSalesCycle: 45,
    totalProjects: 28,
    activeProjects: 8
  },
  
  createdAt: '2022-03-15',
  updatedAt: '2024-01-15'
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

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  
  const org = mockOrganizationDetail;

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
              Back to Organizations
            </Button>
            
            <Card withBorder padding="xl" className="commercial-card-static">
              <Group justify="space-between" wrap="nowrap">
                <Group gap="lg">
                  <Avatar size={80} radius="md" color="blue">
                    <IconBuilding size={40} />
                  </Avatar>
                  <div>
                    <Group gap="sm" mb="xs">
                      <Title order={1}>{org.name}</Title>
                      <Badge 
                        size="lg" 
                        variant="light" 
                        color={org.isActive ? 'green' : 'gray'}
                      >
                        {org.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge size="lg" variant="light">
                        {org.type}
                      </Badge>
                    </Group>
                    <Text size="lg" c="dimmed" mb="xs">
                      {org.contactInfo.address.city}, {org.contactInfo.address.state}
                    </Text>
                    <Group gap="md">
                      <Group gap="xs">
                        <IconMapPin size={16} />
                        <Text size="sm">{org.territory}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconUsers size={16} />
                        <Text size="sm">{org.stats.totalContacts} Contacts</Text>
                      </Group>
                      <Group gap="xs">
                        <IconBriefcase size={16} />
                        <Text size="sm">{org.stats.totalOpportunities} Opportunities</Text>
                      </Group>
                    </Group>
                  </div>
                </Group>
                <Button leftSection={<IconEdit size={16} />} size="md">
                  Edit Organization
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
                <Text className="commercial-stat-value">{org.performance.winRate}%</Text>
                <Text size="xs" c="dimmed" mt="xs">
                  {org.stats.wonOpportunities} of {org.stats.totalOpportunities} won
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
                  ${(org.stats.totalValue / 1000000).toFixed(2)}M
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  Won: ${(org.stats.wonValue / 1000000).toFixed(2)}M
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
                  ${(org.stats.avgDealSize / 1000).toFixed(0)}K
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
                <Text className="commercial-stat-value">{org.stats.activeOpportunities}</Text>
                <Text size="xs" c="dimmed" mt="xs">
                  ${((org.stats.totalValue - org.stats.wonValue) / 1000000).toFixed(2)}M pipeline
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="overview" leftSection={<IconBuilding size={16} />}>
                Overview
              </Tabs.Tab>
              <Tabs.Tab value="contacts" leftSection={<IconUsers size={16} />}>
                Contacts
              </Tabs.Tab>
              <Tabs.Tab value="opportunities" leftSection={<IconBriefcase size={16} />}>
                Opportunities
              </Tabs.Tab>
              <Tabs.Tab value="activity" leftSection={<IconHistory size={16} />}>
                Activity
              </Tabs.Tab>
              <Tabs.Tab value="hierarchy" leftSection={<IconSitemap size={16} />}>
                Hierarchy
              </Tabs.Tab>
            </Tabs.List>

            {/* Overview Tab */}
            <Tabs.Panel value="overview" pt="xl">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg" className="commercial-card-static">
                    <Title order={3} mb="md">Organization Information</Title>
                    <Stack gap="md">
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Name</Text>
                        <Text fw={500}>{org.name}</Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Type</Text>
                        <Badge variant="light" size="lg">
                          {org.type}
                        </Badge>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Territory</Text>
                        <Text fw={500}>{org.territory}</Text>
                      </div>
                      <Divider />
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Address</Text>
                        <Text>{org.contactInfo.address.street}</Text>
                        <Text>
                          {org.contactInfo.address.city}, {org.contactInfo.address.state} {org.contactInfo.address.zipCode}
                        </Text>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Phone</Text>
                        <Group gap="xs">
                          <IconPhone size={16} />
                          <Text fw={500}>{org.contactInfo.phone}</Text>
                        </Group>
                      </div>
                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Email</Text>
                        <Group gap="xs">
                          <IconMail size={16} />
                          <Text fw={500}>{org.contactInfo.email}</Text>
                        </Group>
                      </div>
                      {org.contactInfo.website && (
                        <div>
                          <Text size="sm" c="dimmed" mb={4}>Website</Text>
                          <Text fw={500} c="blue" style={{ cursor: 'pointer' }}>
                            {org.contactInfo.website}
                          </Text>
                        </div>
                      )}
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="lg" className="commercial-card-static">
                    <Title order={3} mb="md">Performance Metrics</Title>
                    <Stack gap="lg">
                      <div>
                        <Group justify="space-between" mb="xs">
                          <Text size="sm" fw={500}>Total Contacts</Text>
                          <Text fw={600} size="xl">{org.stats.totalContacts}</Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                          {org.stats.activeContacts} active contacts
                        </Text>
                      </div>

                      <Divider />

                      <div>
                        <Group justify="space-between" mb="xs">
                          <Text size="sm" fw={500}>Total Opportunities</Text>
                          <Text fw={600} size="xl">{org.stats.totalOpportunities}</Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                          {org.stats.activeOpportunities} currently active
                        </Text>
                      </div>

                      <Divider />

                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Market Segments</Text>
                        <Group gap="xs">
                          {org.marketSegments.map((segment) => (
                            <Badge 
                              key={segment} 
                              variant="light" 
                              size="sm"
                              className={`badge-segment-${segment.toLowerCase().replace(' ', '-')}`}
                            >
                              {segment}
                            </Badge>
                          ))}
                        </Group>
                      </div>

                      <Divider />

                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Average Sales Cycle</Text>
                        <Text fw={600} size="xl">{org.performance.avgSalesCycle} days</Text>
                      </div>

                      <Divider />

                      <div>
                        <Text size="sm" c="dimmed" mb={4}>Relationship Duration</Text>
                        <Text fw={500}>
                          {Math.floor((new Date().getTime() - new Date(org.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                        </Text>
                        <Text size="xs" c="dimmed">
                          Since {new Date(org.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </Text>
                      </div>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            {/* Contacts Tab */}
            <Tabs.Panel value="contacts" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Group justify="space-between" mb="md">
                  <Title order={3}>Key Contacts ({org.keyContacts.length})</Title>
                  <Button variant="light" leftSection={<IconUsers size={16} />}>
                    Add Contact
                  </Button>
                </Group>
                
                <Grid>
                  {org.keyContacts.map((contact) => (
                    <Grid.Col key={contact.id} span={{ base: 12, md: 6 }}>
                      <Card withBorder padding="md" className="commercial-card">
                        <Group justify="space-between" mb="md">
                          <Group gap="sm">
                            <Avatar size="md" radius="xl" color="blue">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <div>
                              <Group gap="xs">
                                <Text fw={600}>{contact.name}</Text>
                                {contact.isPrimary && (
                                  <Badge variant="filled" color="blue" size="xs">
                                    Primary
                                  </Badge>
                                )}
                              </Group>
                              <Text size="sm" c="dimmed">{contact.title}</Text>
                            </div>
                          </Group>
                          <Badge 
                            variant="filled" 
                            color={getRatingColor(contact.rating)}
                            className={`badge-engineer-rating-${contact.rating}`}
                          >
                            {contact.rating}/5
                          </Badge>
                        </Group>

                        <Stack gap="xs">
                          <Group gap="xs">
                            <IconMail size={14} />
                            <Text size="sm">{contact.email}</Text>
                          </Group>
                          <Group gap="xs">
                            <IconPhone size={14} />
                            <Text size="sm">{contact.phone}</Text>
                          </Group>
                        </Stack>

                        <Divider my="sm" />

                        <Grid>
                          <Grid.Col span={6}>
                            <Text size="xs" c="dimmed">Opportunities</Text>
                            <Text fw={600}>{contact.opportunities}</Text>
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <Text size="xs" c="dimmed">Won Value</Text>
                            <Text fw={600}>${(contact.wonValue / 1000).toFixed(0)}K</Text>
                          </Grid.Col>
                        </Grid>

                        <Button 
                          variant="light" 
                          size="xs" 
                          fullWidth 
                          mt="sm"
                          onClick={() => router.push(`/commercial/engineers/${contact.id}`)}
                        >
                          View Details
                        </Button>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              </Card>
            </Tabs.Panel>

            {/* Opportunities Tab */}
            <Tabs.Panel value="opportunities" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Group justify="space-between" mb="md">
                  <Title order={3}>Recent Opportunities</Title>
                  <Button variant="light" leftSection={<IconBriefcase size={16} />}>
                    Create Opportunity
                  </Button>
                </Group>
                
                {org.recentOpportunities.length === 0 ? (
                  <div className="commercial-empty-state">
                    <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                      <IconBriefcase size={30} />
                    </ThemeIcon>
                    <Text size="lg" fw={500}>No opportunities yet</Text>
                    <Text size="sm" c="dimmed">Create a new opportunity for this organization</Text>
                    <Button variant="light" mt="md">
                      Create Opportunity
                    </Button>
                  </div>
                ) : (
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Opportunity</Table.Th>
                        <Table.Th>Contact</Table.Th>
                        <Table.Th>Phase</Table.Th>
                        <Table.Th>Segment</Table.Th>
                        <Table.Th>Value</Table.Th>
                        <Table.Th>Probability</Table.Th>
                        <Table.Th>Expected Close</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {org.recentOpportunities.map((opp) => (
                        <Table.Tr key={opp.id}>
                          <Table.Td>
                            <Text fw={500}>{opp.name}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{opp.contact}</Text>
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
                            <Badge 
                              variant="light"
                              className={`badge-segment-${opp.segment.toLowerCase().replace(' ', '-')}`}
                            >
                              {opp.segment}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={500}>${(opp.value / 1000).toFixed(0)}K</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{opp.probability}%</Text>
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

            {/* Activity Tab */}
            <Tabs.Panel value="activity" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Title order={3} mb="md">Recent Activity</Title>
                
                <Timeline active={org.recentActivity.length} bulletSize={24} lineWidth={2}>
                  {org.recentActivity.map((activity) => (
                    <Timeline.Item 
                      key={activity.id} 
                      bullet={<IconNotes size={12} />}
                      title={activity.type}
                    >
                      <Text c="dimmed" size="sm" mb="xs">
                        {new Date(activity.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Text>
                      <Text size="sm" mb="xs">
                        <strong>Contact:</strong> {activity.contact}
                      </Text>
                      <Text size="sm" mb="xs">
                        {activity.description}
                      </Text>
                      <Text size="xs" c="dimmed">
                        by {activity.user}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Tabs.Panel>

            {/* Hierarchy Tab */}
            <Tabs.Panel value="hierarchy" pt="xl">
              <Card withBorder padding="lg" className="commercial-card-static">
                <Title order={3} mb="md">Organization Hierarchy</Title>
                
                {org.parentOrganization && (
                  <Card withBorder padding="md" mb="md" bg="gray.0">
                    <Group gap="xs">
                      <IconBuilding size={16} />
                      <Text size="sm" fw={500}>Parent Organization:</Text>
                      <Text size="sm">{org.parentOrganization}</Text>
                    </Group>
                  </Card>
                )}

                <Card withBorder padding="md" bg="blue.0" mb="md">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconBuilding size={20} />
                      <Text fw={600} size="lg">{org.name}</Text>
                    </Group>
                    <Badge variant="filled" size="lg">
                      Current Organization
                    </Badge>
                  </Group>
                </Card>

                {org.childOrganizations && org.childOrganizations.length > 0 && (
                  <div>
                    <Text size="sm" fw={500} mb="md">
                      Child Organizations ({org.childOrganizations.length})
                    </Text>
                    <Stack gap="xs">
                      {org.childOrganizations.map((child) => (
                        <Card key={child.id} withBorder padding="sm" className="commercial-card">
                          <Group justify="space-between">
                            <Group gap="xs">
                              <IconBuilding size={16} />
                              <div>
                                <Text size="sm" fw={500}>{child.name}</Text>
                                <Text size="xs" c="dimmed">{child.type}</Text>
                              </div>
                            </Group>
                            <Button variant="light" size="xs">
                              View
                            </Button>
                          </Group>
                        </Card>
                      ))}
                    </Stack>
                  </div>
                )}

                {(!org.parentOrganization && (!org.childOrganizations || org.childOrganizations.length === 0)) && (
                  <div className="commercial-empty-state">
                    <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                      <IconSitemap size={30} />
                    </ThemeIcon>
                    <Text size="lg" fw={500}>No hierarchy data</Text>
                    <Text size="sm" c="dimmed">This organization has no parent or child organizations</Text>
                  </div>
                )}
              </Card>
            </Tabs.Panel>
          </Tabs>

        </Stack>
      </div>
    </CommercialLayout>
  );
}

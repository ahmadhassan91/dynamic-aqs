'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Grid,
  Card,
  Text,
  Badge,
  Stack,
  Avatar,
  Progress,
  Timeline,
  ActionIcon,
  Menu,
  Paper,
  NumberFormatter,
  Modal,
  Textarea,
  Rating,
  Divider,
  Alert,
  Tooltip,
  Table,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconPlus,
  IconPhone,
  IconMail,
  IconBuilding,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconDots,
  IconEye,
  IconEdit,
  IconCalendar,
  IconUser,
  IconStar,
  IconTarget,
  IconMessage,
  IconVideo,
  IconMapPin,
  IconCurrencyDollar,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

// Mock engineer data with relationship tracking
const mockEngineers = [
  {
    id: 'ENG-001',
    name: 'Dr. Sarah Chen',
    title: 'Senior Mechanical Engineer',
    company: 'Johnson Controls Engineering',
    companyId: 'FIRM-001',
    email: 'sarah.chen@jce.com',
    phone: '(555) 234-5678',
    location: 'Chicago, IL',
    
    // Relationship Metrics
    currentRating: 4,
    previousRating: 3,
    ratingTrend: 'up',
    relationshipStrength: 85,
    lastContactDate: '2024-01-18',
    nextFollowUpDate: '2024-02-01',
    
    // Performance Metrics
    totalOpportunities: 12,
    wonOpportunities: 8,
    totalOpportunityValue: 2400000,
    wonOpportunityValue: 1850000,
    winRate: 67,
    averageDealSize: 200000,
    
    // Interaction Summary
    totalInteractions: 24,
    lastInteractionType: 'lunch_meeting',
    interactionFrequency: 'Monthly',
    preferredContactMethod: 'Email',
    
    // Specializations
    specializations: ['Healthcare HVAC', 'Energy Efficiency', 'Smart Controls'],
    marketSegments: ['Healthcare', 'Education'],
    
    // Recent Activities
    recentActivities: [
      {
        id: 1,
        type: 'lunch_meeting',
        title: 'Lunch & Learn Session',
        description: 'Presented new energy-efficient product line to engineering team',
        date: '2024-01-18',
        outcome: 'Positive - expressed interest in pilot project',
        ratingChange: '+1',
      },
      {
        id: 2,
        type: 'email',
        title: 'Technical Specifications Sent',
        description: 'Provided detailed specs for university project',
        date: '2024-01-10',
        outcome: 'Acknowledged - under review',
        ratingChange: null,
      },
      {
        id: 3,
        type: 'phone_call',
        title: 'Project Discussion',
        description: 'Discussed requirements for new hospital wing',
        date: '2024-01-05',
        outcome: 'Scheduled site visit',
        ratingChange: null,
      },
    ],
    
    // Current Opportunities
    activeOpportunities: [
      {
        id: 'OPP-001',
        name: 'University Hospital Expansion',
        value: 450000,
        phase: 'Final Quote',
        probability: 75,
      },
      {
        id: 'OPP-002',
        name: 'Medical Center Retrofit',
        value: 280000,
        phase: 'Preliminary Quote',
        probability: 60,
      },
    ],
    
    // Relationship Goals
    relationshipGoals: [
      {
        id: 1,
        goal: 'Increase rating to 5 (Specifies a lot)',
        targetDate: '2024-06-30',
        progress: 80,
        status: 'In Progress',
      },
      {
        id: 2,
        goal: 'Secure pilot project for new product line',
        targetDate: '2024-03-31',
        progress: 60,
        status: 'In Progress',
      },
    ],
  },
  {
    id: 'ENG-002',
    name: 'Michael Rodriguez',
    title: 'Principal Engineer',
    company: 'Sustainable Design Partners',
    companyId: 'FIRM-002',
    email: 'mrodriguez@sdp.com',
    phone: '(555) 345-6789',
    location: 'Milwaukee, WI',
    
    currentRating: 5,
    previousRating: 5,
    ratingTrend: 'stable',
    relationshipStrength: 95,
    lastContactDate: '2024-01-20',
    nextFollowUpDate: '2024-02-15',
    
    totalOpportunities: 18,
    wonOpportunities: 15,
    totalOpportunityValue: 3200000,
    wonOpportunityValue: 2950000,
    winRate: 83,
    averageDealSize: 178000,
    
    totalInteractions: 36,
    lastInteractionType: 'site_visit',
    interactionFrequency: 'Bi-weekly',
    preferredContactMethod: 'Phone',
    
    specializations: ['Green Building', 'LEED Certification', 'Renewable Energy'],
    marketSegments: ['Commercial Office', 'Industrial'],
    
    recentActivities: [
      {
        id: 1,
        type: 'site_visit',
        title: 'Green Building Project Site Visit',
        description: 'Conducted on-site assessment for LEED Platinum project',
        date: '2024-01-20',
        outcome: 'Excellent - confirmed product selection',
        ratingChange: null,
      },
      {
        id: 2,
        type: 'conference',
        title: 'ASHRAE Conference Meeting',
        description: 'Met at annual conference, discussed industry trends',
        date: '2024-01-15',
        outcome: 'Great networking - new project leads',
        ratingChange: null,
      },
    ],
    
    activeOpportunities: [
      {
        id: 'OPP-003',
        name: 'Corporate Headquarters HVAC',
        value: 650000,
        phase: 'PO in Hand',
        probability: 95,
      },
    ],
    
    relationshipGoals: [
      {
        id: 1,
        goal: 'Maintain champion status',
        targetDate: '2024-12-31',
        progress: 100,
        status: 'Achieved',
      },
      {
        id: 2,
        goal: 'Expand to new market segments',
        targetDate: '2024-09-30',
        progress: 40,
        status: 'In Progress',
      },
    ],
  },
  {
    id: 'ENG-003',
    name: 'Jennifer Park',
    title: 'Mechanical Engineer',
    company: 'Healthcare Engineering Group',
    companyId: 'FIRM-003',
    email: 'jpark@heg.com',
    phone: '(555) 456-7890',
    location: 'Indianapolis, IN',
    
    currentRating: 2,
    previousRating: 1,
    ratingTrend: 'up',
    relationshipStrength: 35,
    lastContactDate: '2024-01-12',
    nextFollowUpDate: '2024-01-25',
    
    totalOpportunities: 3,
    wonOpportunities: 0,
    totalOpportunityValue: 180000,
    wonOpportunityValue: 0,
    winRate: 0,
    averageDealSize: 60000,
    
    totalInteractions: 8,
    lastInteractionType: 'email',
    interactionFrequency: 'Quarterly',
    preferredContactMethod: 'Email',
    
    specializations: ['Hospital Systems', 'Clean Room Design', 'Medical Gas'],
    marketSegments: ['Healthcare'],
    
    recentActivities: [
      {
        id: 1,
        type: 'email',
        title: 'Introduction Email',
        description: 'Initial introduction and company overview',
        date: '2024-01-12',
        outcome: 'Neutral - requested more information',
        ratingChange: '+1',
      },
      {
        id: 2,
        type: 'phone_call',
        title: 'Follow-up Call',
        description: 'Discussed potential collaboration opportunities',
        date: '2024-01-08',
        outcome: 'Cautious but interested',
        ratingChange: null,
      },
    ],
    
    activeOpportunities: [
      {
        id: 'OPP-004',
        name: 'Regional Medical Center',
        value: 120000,
        phase: 'Prospect',
        probability: 25,
      },
    ],
    
    relationshipGoals: [
      {
        id: 1,
        goal: 'Build trust and credibility',
        targetDate: '2024-04-30',
        progress: 30,
        status: 'In Progress',
      },
      {
        id: 2,
        goal: 'Secure first project',
        targetDate: '2024-08-31',
        progress: 15,
        status: 'Planning',
      },
    ],
  },
];

const ratingLabels = {
  1: "Doesn't like Dynamic",
  2: "Just met",
  3: "Presented to",
  4: "Has Specified",
  5: "Specifies a lot"
};

const ratingColors = {
  1: 'red',
  2: 'orange',
  3: 'yellow',
  4: 'blue',
  5: 'green'
};

interface EngineerCardProps {
  engineer: typeof mockEngineers[0];
  onViewDetails: (engineer: typeof mockEngineers[0]) => void;
  onLogInteraction: (engineer: typeof mockEngineers[0]) => void;
}

function EngineerCard({ engineer, onViewDetails, onLogInteraction }: EngineerCardProps) {
  const getTrendIcon = () => {
    switch (engineer.ratingTrend) {
      case 'up': return <IconTrendingUp size={16} color="var(--mantine-color-green-6)" />;
      case 'down': return <IconTrendingDown size={16} color="var(--mantine-color-red-6)" />;
      default: return <IconMinus size={16} color="var(--mantine-color-gray-6)" />;
    }
  };

  const getRelationshipStrengthColor = (strength: number) => {
    if (strength >= 80) return 'green';
    if (strength >= 60) return 'blue';
    if (strength >= 40) return 'yellow';
    return 'red';
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Stack gap="md" h="100%">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Group align="flex-start">
            <Avatar size="lg" radius="md">
              {engineer.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Group gap="xs" mb={4}>
                <Text fw={600} size="sm">{engineer.name}</Text>
                <Badge color={ratingColors[engineer.currentRating as keyof typeof ratingColors]} size="sm">
                  {engineer.currentRating}/5
                </Badge>
                {getTrendIcon()}
              </Group>
              <Text size="xs" c="dimmed" mb={2}>{engineer.title}</Text>
              <Text size="xs" c="dimmed">{engineer.company}</Text>
              <Text size="xs" c="dimmed">{engineer.location}</Text>
            </div>
          </Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => onViewDetails(engineer)}>
                View Details
              </Menu.Item>
              <Menu.Item leftSection={<IconMessage size={14} />} onClick={() => onLogInteraction(engineer)}>
                Log Interaction
              </Menu.Item>
              <Menu.Item leftSection={<IconPhone size={14} />}>
                Call Engineer
              </Menu.Item>
              <Menu.Item leftSection={<IconMail size={14} />}>
                Send Email
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconEdit size={14} />}>
                Edit Profile
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        {/* Relationship Strength */}
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Relationship Strength</Text>
            <Text size="sm" fw={600}>{engineer.relationshipStrength}%</Text>
          </Group>
          <Progress 
            value={engineer.relationshipStrength} 
            color={getRelationshipStrengthColor(engineer.relationshipStrength)}
            size="sm"
          />
        </div>

        {/* Key Metrics */}
        <Grid>
          <Grid.Col span={6}>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Win Rate</Text>
              <Text fw={600} size="lg">{engineer.winRate}%</Text>
              <Text size="xs" c="dimmed">{engineer.wonOpportunities}/{engineer.totalOpportunities} won</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={6}>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Total Value</Text>
              <Text fw={600} size="lg">
                <NumberFormatter
                  value={engineer.wonOpportunityValue}
                  prefix="$"
                  thousandSeparator
                  suffix="K"

                />
              </Text>
              <Text size="xs" c="dimmed">
                <NumberFormatter
                  value={engineer.averageDealSize}
                  prefix="$"
                  thousandSeparator
                  decimalScale={0}
                />
                {' '}avg
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Specializations */}
        <div>
          <Text size="sm" fw={500} mb="xs">Specializations</Text>
          <Group gap="xs">
            {engineer.specializations.slice(0, 2).map((spec, idx) => (
              <Badge key={idx} size="xs" variant="light">
                {spec}
              </Badge>
            ))}
            {engineer.specializations.length > 2 && (
              <Text size="xs" c="dimmed">
                +{engineer.specializations.length - 2} more
              </Text>
            )}
          </Group>
        </div>

        {/* Active Opportunities */}
        <div>
          <Text size="sm" fw={500} mb="xs">Active Opportunities ({engineer.activeOpportunities.length})</Text>
          <Stack gap="xs">
            {engineer.activeOpportunities.slice(0, 2).map((opp, idx) => (
              <Group key={idx} justify="space-between">
                <Text size="xs" lineClamp={1} style={{ flex: 1 }}>
                  {opp.name}
                </Text>
                <Group gap="xs">
                  <Badge size="xs" variant="outline">{opp.phase}</Badge>
                  <Text size="xs" fw={500}>
                    <NumberFormatter
                      value={opp.value}
                      prefix="$"
                      thousandSeparator
                      suffix="K"

                    />
                  </Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </div>

        {/* Last Contact */}
        <div style={{ marginTop: 'auto' }}>
          <Group justify="space-between" mb="xs">
            <Text size="xs" c="dimmed">Last Contact:</Text>
            <Text size="xs">{new Date(engineer.lastContactDate).toLocaleDateString()}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Next Follow-up:</Text>
            <Text size="xs" fw={500}>{new Date(engineer.nextFollowUpDate).toLocaleDateString()}</Text>
          </Group>
        </div>

        {/* Quick Actions */}
        <Group justify="space-between" pt="xs">
          <Button
            variant="light"
            size="xs"
            leftSection={<IconMessage size={14} />}
            onClick={() => onLogInteraction(engineer)}
          >
            Log Interaction
          </Button>
          <Button
            variant="outline"
            size="xs"
            leftSection={<IconEye size={14} />}
            onClick={() => onViewDetails(engineer)}
          >
            View Details
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}

export default function EngineerRelationshipsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [selectedEngineer, setSelectedEngineer] = useState<typeof mockEngineers[0] | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [interactionOpened, { open: openInteraction, close: closeInteraction }] = useDisclosure(false);

  const getRelationshipStrengthColor = (strength: number) => {
    if (strength >= 80) return 'green';
    if (strength >= 60) return 'blue';
    if (strength >= 40) return 'yellow';
    return 'red';
  };

  // Filter engineers
  const filteredEngineers = mockEngineers.filter(engineer => {
    const matchesSearch = engineer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         engineer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         engineer.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRating = ratingFilter === 'All' || engineer.currentRating.toString() === ratingFilter;
    const matchesCompany = companyFilter === 'All' || engineer.company === companyFilter;
    
    return matchesSearch && matchesRating && matchesCompany;
  });

  const handleViewDetails = (engineer: typeof mockEngineers[0]) => {
    setSelectedEngineer(engineer);
    openDetails();
  };

  const handleLogInteraction = (engineer: typeof mockEngineers[0]) => {
    setSelectedEngineer(engineer);
    openInteraction();
  };

  const ratingOptions = ['All', '1', '2', '3', '4', '5'];
  const companyOptions = ['All', ...Array.from(new Set(mockEngineers.map(e => e.company)))];

  // Calculate summary stats
  const totalEngineers = filteredEngineers.length;
  const averageRating = filteredEngineers.reduce((sum, e) => sum + e.currentRating, 0) / totalEngineers;
  const highPerformers = filteredEngineers.filter(e => e.currentRating >= 4).length;
  const needsAttention = filteredEngineers.filter(e => e.currentRating <= 2).length;

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={2}>Engineer Relationships</Title>
            <Text c="dimmed">
              Track and manage relationships with key engineering contacts
            </Text>
          </div>
          <Button leftSection={<IconPlus size={16} />}>
            Add Engineer
          </Button>
        </Group>

        {/* Summary Stats */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Stack gap="xs" align="center">
                <IconUser size={32} color="var(--mantine-color-blue-6)" />
                <Text fw={600} size="xl">{totalEngineers}</Text>
                <Text size="sm" c="dimmed">Total Engineers</Text>
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Stack gap="xs" align="center">
                <IconStar size={32} color="var(--mantine-color-yellow-6)" />
                <Text fw={600} size="xl">{averageRating.toFixed(1)}</Text>
                <Text size="sm" c="dimmed">Average Rating</Text>
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Stack gap="xs" align="center">
                <IconTarget size={32} color="var(--mantine-color-green-6)" />
                <Text fw={600} size="xl">{highPerformers}</Text>
                <Text size="sm" c="dimmed">High Performers (4-5)</Text>
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Stack gap="xs" align="center">
                <IconTrendingUp size={32} color="var(--mantine-color-red-6)" />
                <Text fw={600} size="xl">{needsAttention}</Text>
                <Text size="sm" c="dimmed">Needs Attention (1-2)</Text>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Filters */}
        <Paper p="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                placeholder="Search engineers, companies, or specializations..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                placeholder="Filter by rating"
                data={ratingOptions.map(r => ({ value: r, label: r === 'All' ? 'All Ratings' : `Rating ${r}` }))}
                value={ratingFilter}
                onChange={(value) => setRatingFilter(value || 'All')}
                leftSection={<IconFilter size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                placeholder="Filter by company"
                data={companyOptions}
                value={companyFilter}
                onChange={(value) => setCompanyFilter(value || 'All')}
                leftSection={<IconBuilding size={16} />}
              />
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Engineers Grid */}
        <Grid>
          {filteredEngineers.map((engineer) => (
            <Grid.Col key={engineer.id} span={{ base: 12, md: 6, lg: 4 }}>
              <EngineerCard
                engineer={engineer}
                onViewDetails={handleViewDetails}
                onLogInteraction={handleLogInteraction}
              />
            </Grid.Col>
          ))}
        </Grid>

        {filteredEngineers.length === 0 && (
          <Paper p="xl" withBorder>
            <Stack align="center" gap="md">
              <IconUser size={48} color="var(--mantine-color-gray-5)" />
              <Text size="lg" fw={600}>No engineers found</Text>
              <Text c="dimmed" ta="center">
                No engineers match your current search criteria.
              </Text>
            </Stack>
          </Paper>
        )}

        {/* Engineer Details Modal */}
        <Modal
          opened={detailsOpened}
          onClose={closeDetails}
          title={selectedEngineer?.name}
          size="xl"
        >
          {selectedEngineer && (
            <Stack gap="lg">
              {/* Engineer Summary */}
              <Paper p="md" withBorder>
                <Grid>
                  <Grid.Col span={8}>
                    <Group align="flex-start">
                      <Avatar size="xl" radius="md">
                        {selectedEngineer.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Stack gap="xs">
                        <Group gap="xs">
                          <Text fw={600} size="lg">{selectedEngineer.name}</Text>
                          <Badge color={ratingColors[selectedEngineer.currentRating as keyof typeof ratingColors]}>
                            Rating: {selectedEngineer.currentRating}/5
                          </Badge>
                        </Group>
                        <Text c="dimmed">{selectedEngineer.title}</Text>
                        <Text fw={500}>{selectedEngineer.company}</Text>
                        <Group gap="xl">
                          <Group gap="xs">
                            <IconMail size={16} />
                            <Text size="sm">{selectedEngineer.email}</Text>
                          </Group>
                          <Group gap="xs">
                            <IconPhone size={16} />
                            <Text size="sm">{selectedEngineer.phone}</Text>
                          </Group>
                          <Group gap="xs">
                            <IconMapPin size={16} />
                            <Text size="sm">{selectedEngineer.location}</Text>
                          </Group>
                        </Group>
                      </Stack>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Stack gap="md">
                      <div>
                        <Text size="sm" c="dimmed" mb="xs">Relationship Strength</Text>
                        <Progress 
                          value={selectedEngineer.relationshipStrength} 
                          color={getRelationshipStrengthColor(selectedEngineer.relationshipStrength)}
                          size="lg"
                        />
                        <Text size="sm" fw={600} mt="xs">{selectedEngineer.relationshipStrength}%</Text>
                      </div>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Last Contact:</Text>
                        <Text size="sm" fw={500}>{new Date(selectedEngineer.lastContactDate).toLocaleDateString()}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Next Follow-up:</Text>
                        <Text size="sm" fw={500}>{new Date(selectedEngineer.nextFollowUpDate).toLocaleDateString()}</Text>
                      </Group>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Paper>

              {/* Performance Metrics */}
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">Performance Metrics</Text>
                <Grid>
                  <Grid.Col span={3}>
                    <Stack gap="xs" align="center">
                      <Text fw={600} size="xl">{selectedEngineer.totalOpportunities}</Text>
                      <Text size="sm" c="dimmed">Total Opportunities</Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Stack gap="xs" align="center">
                      <Text fw={600} size="xl" c="green">{selectedEngineer.wonOpportunities}</Text>
                      <Text size="sm" c="dimmed">Won Opportunities</Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Stack gap="xs" align="center">
                      <Text fw={600} size="xl">{selectedEngineer.winRate}%</Text>
                      <Text size="sm" c="dimmed">Win Rate</Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Stack gap="xs" align="center">
                      <Text fw={600} size="xl">
                        <NumberFormatter
                          value={selectedEngineer.averageDealSize}
                          prefix="$"
                          thousandSeparator
                          suffix="K"

                        />
                      </Text>
                      <Text size="sm" c="dimmed">Avg Deal Size</Text>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Paper>

              {/* Recent Activities */}
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">Recent Activities</Text>
                <Timeline>
                  {selectedEngineer.recentActivities.map((activity) => (
                    <Timeline.Item
                      key={activity.id}
                      title={activity.title}
                    >
                      <Text size="sm" c="dimmed" mb={4}>
                        {activity.description}
                      </Text>
                      <Group gap="md" mb={4}>
                        <Text size="xs" c="dimmed">
                          {new Date(activity.date).toLocaleDateString()}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Outcome: {activity.outcome}
                        </Text>
                        {activity.ratingChange && (
                          <Badge size="xs" color="green">
                            Rating {activity.ratingChange}
                          </Badge>
                        )}
                      </Group>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Paper>

              {/* Active Opportunities */}
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">Active Opportunities</Text>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Opportunity</Table.Th>
                      <Table.Th>Value</Table.Th>
                      <Table.Th>Phase</Table.Th>
                      <Table.Th>Probability</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {selectedEngineer.activeOpportunities.map((opp) => (
                      <Table.Tr key={opp.id}>
                        <Table.Td>{opp.name}</Table.Td>
                        <Table.Td>
                          <NumberFormatter
                            value={opp.value}
                            prefix="$"
                            thousandSeparator
                            decimalScale={0}
                          />
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light">{opp.phase}</Badge>
                        </Table.Td>
                        <Table.Td>{opp.probability}%</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Paper>

              {/* Relationship Goals */}
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">Relationship Goals</Text>
                <Stack gap="md">
                  {selectedEngineer.relationshipGoals.map((goal) => (
                    <div key={goal.id}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>{goal.goal}</Text>
                        <Badge color={goal.status === 'Achieved' ? 'green' : 'blue'}>
                          {goal.status}
                        </Badge>
                      </Group>
                      <Progress value={goal.progress} mb="xs" />
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">Progress: {goal.progress}%</Text>
                        <Text size="xs" c="dimmed">Target: {new Date(goal.targetDate).toLocaleDateString()}</Text>
                      </Group>
                    </div>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          )}
        </Modal>

        {/* Log Interaction Modal */}
        <Modal
          opened={interactionOpened}
          onClose={closeInteraction}
          title={`Log Interaction - ${selectedEngineer?.name}`}
          size="md"
        >
          <Stack gap="md">
            <Select
              label="Interaction Type"
              placeholder="Select interaction type"
              data={[
                'Phone Call',
                'Email',
                'Meeting',
                'Lunch & Learn',
                'Site Visit',
                'Conference',
                'Trade Show',
                'Other'
              ]}
            />
            <TextInput
              label="Title"
              placeholder="Brief title for this interaction"
            />
            <Textarea
              label="Description"
              placeholder="Describe the interaction and key points discussed"
              minRows={3}
            />
            <Textarea
              label="Outcome"
              placeholder="What was the outcome or next steps?"
              minRows={2}
            />
            <Group>
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500} mb="xs">Rating Change</Text>
                <Rating size="lg" />
              </div>
            </Group>
            <Group justify="flex-end">
              <Button variant="outline" onClick={closeInteraction}>
                Cancel
              </Button>
              <Button onClick={closeInteraction}>
                Log Interaction
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}
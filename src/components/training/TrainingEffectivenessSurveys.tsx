'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Badge,
  ActionIcon,
  Menu,
  rem,
  Stack,
  Grid,
  Select,
  TextInput,
  Modal,
  Table,
  Progress,
  ThemeIcon,
  Tabs,
  Rating,
  Textarea,
  Checkbox,
  NumberInput,
  Alert,
  Anchor,
} from '@mantine/core';
import {
  IconMessageCircle,
  IconPlus,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconSearch,
  IconStar,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconChartBar,
  IconUsers,
  IconClock,
  IconThumbUp,
  IconThumbDown,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface SurveyResponse {
  id: string;
  trainingSessionId: string;
  respondentName: string;
  respondentEmail: string;
  submittedAt: Date;
  responses: {
    overallRating: number;
    contentQuality: number;
    trainerEffectiveness: number;
    materialQuality: number;
    paceAppropriate: number;
    objectivesMet: number;
    wouldRecommend: boolean;
    mostValuable: string;
    improvements: string;
    additionalComments: string;
  };
}

interface TrainingSurvey {
  id: string;
  trainingSessionId: string;
  sessionTitle: string;
  sessionType: string;
  trainerId: string;
  customerId: string;
  sessionDate: Date;
  totalAttendees: number;
  responseCount: number;
  responseRate: number;
  averageRating: number;
  responses: SurveyResponse[];
  status: 'pending' | 'active' | 'completed';
}

// Mock survey data
const mockSurveys: TrainingSurvey[] = [
  {
    id: '1',
    trainingSessionId: 'session-1',
    sessionTitle: 'AQS Pro Series Installation Fundamentals',
    sessionType: 'installation',
    trainerId: 'tm-1',
    customerId: 'cust-1',
    sessionDate: new Date('2024-02-15'),
    totalAttendees: 8,
    responseCount: 6,
    responseRate: 75,
    averageRating: 4.5,
    responses: [
      {
        id: 'resp-1',
        trainingSessionId: 'session-1',
        respondentName: 'Mike Johnson',
        respondentEmail: 'mike@abchvac.com',
        submittedAt: new Date('2024-02-16'),
        responses: {
          overallRating: 5,
          contentQuality: 5,
          trainerEffectiveness: 4,
          materialQuality: 5,
          paceAppropriate: 4,
          objectivesMet: 5,
          wouldRecommend: true,
          mostValuable: 'Hands-on installation practice with real equipment',
          improvements: 'More time for Q&A session',
          additionalComments: 'Excellent training, very practical and well-organized'
        }
      }
    ],
    status: 'completed'
  },
  {
    id: '2',
    trainingSessionId: 'session-2',
    sessionTitle: 'Advanced Sales Techniques',
    sessionType: 'sales',
    trainerId: 'tm-2',
    customerId: 'cust-2',
    sessionDate: new Date('2024-02-20'),
    totalAttendees: 12,
    responseCount: 9,
    responseRate: 75,
    averageRating: 4.2,
    responses: [],
    status: 'completed'
  },
  {
    id: '3',
    trainingSessionId: 'session-3',
    sessionTitle: 'Preventive Maintenance Best Practices',
    sessionType: 'maintenance',
    trainerId: 'tm-1',
    customerId: 'cust-3',
    sessionDate: new Date('2024-02-25'),
    totalAttendees: 6,
    responseCount: 2,
    responseRate: 33,
    averageRating: 3.8,
    responses: [],
    status: 'active'
  }
];

export function TrainingEffectivenessSurveys() {
  const { customers, users } = useMockData();
  const [surveys] = useState<TrainingSurvey[]>(mockSurveys);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [selectedSurvey, setSelectedSurvey] = useState<TrainingSurvey | null>(null);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Filter surveys
  const filteredSurveys = useMemo(() => {
    return surveys.filter(survey => {
      const matchesSearch = !searchQuery || 
        survey.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCustomerName(survey.customerId).toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = !typeFilter || survey.sessionType === typeFilter;
      const matchesStatus = !statusFilter || survey.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [surveys, searchQuery, typeFilter, statusFilter]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    const totalSurveys = surveys.length;
    const totalResponses = surveys.reduce((sum, s) => sum + s.responseCount, 0);
    const totalAttendees = surveys.reduce((sum, s) => sum + s.totalAttendees, 0);
    const averageResponseRate = totalAttendees > 0 ? (totalResponses / totalAttendees) * 100 : 0;
    const averageRating = surveys.length > 0 ? 
      surveys.reduce((sum, s) => sum + s.averageRating, 0) / surveys.length : 0;

    const lowResponseSurveys = surveys.filter(s => s.responseRate < 50).length;

    return {
      totalSurveys,
      totalResponses,
      averageResponseRate,
      averageRating,
      lowResponseSurveys
    };
  }, [surveys]);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.companyName || 'Unknown Customer';
  };

  const getTrainerName = (trainerId: string) => {
    const trainer = users.find(u => u.id === trainerId);
    return trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown Trainer';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'installation': return 'blue';
      case 'maintenance': return 'orange';
      case 'sales': return 'green';
      case 'product_knowledge': return 'violet';
      case 'safety': return 'red';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'active': return 'blue';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'green';
    if (rating >= 4.0) return 'yellow';
    if (rating >= 3.5) return 'orange';
    return 'red';
  };

  const getResponseRateColor = (rate: number) => {
    if (rate >= 80) return 'green';
    if (rate >= 60) return 'yellow';
    if (rate >= 40) return 'orange';
    return 'red';
  };

  const formatTypeLabel = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleViewSurvey = (survey: TrainingSurvey) => {
    setSelectedSurvey(survey);
    setShowSurveyModal(true);
  };

  const trainingTypes = [
    { value: 'installation', label: 'Installation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'sales', label: 'Sales' },
    { value: 'product_knowledge', label: 'Product Knowledge' },
    { value: 'safety', label: 'Safety' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Training Effectiveness Surveys</Title>
          <Text c="dimmed" size="sm">
            Collect and analyze feedback on training effectiveness
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />}>
          Create Survey
        </Button>
      </Group>

      {/* Statistics Cards */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
              <IconMessageCircle size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="blue">
              {stats.totalSurveys}
            </Text>
            <Text size="sm" c="dimmed">
              Total Surveys
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
              <IconUsers size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="green">
              {stats.averageResponseRate.toFixed(1)}%
            </Text>
            <Text size="sm" c="dimmed">
              Avg Response Rate
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="yellow" variant="light" size="xl" mx="auto" mb="sm">
              <IconStar size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="yellow">
              {stats.averageRating.toFixed(1)}/5
            </Text>
            <Text size="sm" c="dimmed">
              Avg Rating
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="red" variant="light" size="xl" mx="auto" mb="sm">
              <IconTrendingDown size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="red">
              {stats.lowResponseSurveys}
            </Text>
            <Text size="sm" c="dimmed">
              Low Response Rate
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filters */}
      <Card withBorder p="md">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              placeholder="Search surveys..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Filter by type"
              data={trainingTypes}
              value={typeFilter}
              onChange={setTypeFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Filter by status"
              data={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Button variant="light" leftSection={<IconChartBar size={16} />} fullWidth>
              Analytics
            </Button>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconMessageCircle size={16} />}>
            Survey Overview
          </Tabs.Tab>
          <Tabs.Tab value="responses" leftSection={<IconMessageCircle size={16} />}>
            Response Analysis
          </Tabs.Tab>
          <Tabs.Tab value="trends" leftSection={<IconTrendingUp size={16} />}>
            Trends & Insights
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="lg">
          {stats.lowResponseSurveys > 0 && (
            <Alert
              icon={<IconTrendingDown size={16} />}
              title="Low Response Rate Alert"
              color="red"
              variant="light"
              mb="md"
            >
              {stats.lowResponseSurveys} survey(s) have response rates below 50%. 
              Consider sending follow-up reminders to improve participation.
            </Alert>
          )}

          <Card withBorder p={0}>
            <Table.ScrollContainer minWidth={1200}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Training Session</Table.Th>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Trainer</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Response Rate</Table.Th>
                    <Table.Th>Avg Rating</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredSurveys.map((survey) => (
                    <Table.Tr key={survey.id}>
                      <Table.Td>
                        <div>
                          <Text fw={500} size="sm">
                            {survey.sessionTitle}
                          </Text>
                          <Badge color={getTypeColor(survey.sessionType)} variant="light" size="sm">
                            {formatTypeLabel(survey.sessionType)}
                          </Badge>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500} size="sm">
                          {getCustomerName(survey.customerId)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {getTrainerName(survey.trainerId)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Intl.DateTimeFormat('en-US').format(survey.sessionDate)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Group gap="xs" mb="xs">
                            <Text size="sm" fw={500}>
                              {survey.responseCount}/{survey.totalAttendees}
                            </Text>
                            <Badge 
                              color={getResponseRateColor(survey.responseRate)} 
                              variant="light" 
                              size="sm"
                            >
                              {survey.responseRate}%
                            </Badge>
                          </Group>
                          <Progress 
                            value={survey.responseRate} 
                            color={getResponseRateColor(survey.responseRate)}
                            size="xs"
                          />
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <IconStar size={14} fill="gold" color="gold" />
                          <Text 
                            size="sm" 
                            fw={500}
                            c={getRatingColor(survey.averageRating)}
                          >
                            {survey.averageRating.toFixed(1)}/5
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(survey.status)} variant="light">
                          {formatStatusLabel(survey.status)}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon 
                            variant="subtle" 
                            onClick={() => handleViewSurvey(survey)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <Menu position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <IconDots size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                leftSection={<IconMessageCircle style={{ width: rem(14), height: rem(14) }} />}
                              >
                                Send Reminder
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconChartBar style={{ width: rem(14), height: rem(14) }} />}
                              >
                                View Analytics
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                              >
                                Edit Survey
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item
                                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                color="red"
                              >
                                Delete Survey
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="responses" pt="lg">
          <Card withBorder p="lg">
            <Title order={4} mb="md">Response Analysis</Title>
            <Text c="dimmed" mb="lg">
              Detailed analysis of survey responses and feedback patterns
            </Text>

            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder p="md">
                  <Title order={5} mb="md">Rating Distribution</Title>
                  <Stack gap="sm">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = surveys.filter(s => Math.round(s.averageRating) === rating).length;
                      const percentage = surveys.length > 0 ? (count / surveys.length) * 100 : 0;
                      return (
                        <Group key={rating} justify="space-between">
                          <Group gap="xs">
                            <IconStar size={14} fill="gold" color="gold" />
                            <Text size="sm">{rating} stars</Text>
                          </Group>
                          <Group gap="sm">
                            <Progress value={percentage} w={100} size="sm" />
                            <Text size="sm" w={40}>{count}</Text>
                          </Group>
                        </Group>
                      );
                    })}
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder p="md">
                  <Title order={5} mb="md">Response Rate by Type</Title>
                  <Stack gap="sm">
                    {trainingTypes.map((type) => {
                      const typeSurveys = surveys.filter(s => s.sessionType === type.value);
                      const avgResponseRate = typeSurveys.length > 0 ? 
                        typeSurveys.reduce((sum, s) => sum + s.responseRate, 0) / typeSurveys.length : 0;
                      
                      return (
                        <Group key={type.value} justify="space-between">
                          <Badge color={getTypeColor(type.value)} variant="light" size="sm">
                            {type.label}
                          </Badge>
                          <Group gap="sm">
                            <Progress value={avgResponseRate} w={100} size="sm" />
                            <Text size="sm" w={40}>{avgResponseRate.toFixed(0)}%</Text>
                          </Group>
                        </Group>
                      );
                    })}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="trends" pt="lg">
          <Card withBorder p="lg">
            <Title order={4} mb="md">Trends & Insights</Title>
            <Text c="dimmed" mb="lg">
              Key insights and trends from training effectiveness data
            </Text>

            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder p="md" ta="center">
                  <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
                    <IconThumbUp size={24} />
                  </ThemeIcon>
                  <Text size="lg" fw={700} c="green" mb="xs">
                    {surveys.filter(s => s.averageRating >= 4.5).length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Highly Rated Sessions
                  </Text>
                  <Text size="xs" c="dimmed">
                    (4.5+ stars)
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder p="md" ta="center">
                  <ThemeIcon color="yellow" variant="light" size="xl" mx="auto" mb="sm">
                    <IconMinus size={24} />
                  </ThemeIcon>
                  <Text size="lg" fw={700} c="yellow" mb="xs">
                    {surveys.filter(s => s.averageRating >= 3.5 && s.averageRating < 4.5).length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Average Sessions
                  </Text>
                  <Text size="xs" c="dimmed">
                    (3.5-4.4 stars)
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder p="md" ta="center">
                  <ThemeIcon color="red" variant="light" size="xl" mx="auto" mb="sm">
                    <IconThumbDown size={24} />
                  </ThemeIcon>
                  <Text size="lg" fw={700} c="red" mb="xs">
                    {surveys.filter(s => s.averageRating < 3.5).length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Needs Improvement
                  </Text>
                  <Text size="xs" c="dimmed">
                    (Below 3.5 stars)
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>

            <Card withBorder p="md" mt="lg">
              <Title order={5} mb="md">Key Insights</Title>
              <Stack gap="sm">
                <Text size="sm">
                  • Installation training sessions have the highest average rating ({
                    surveys.filter(s => s.sessionType === 'installation')
                      .reduce((sum, s) => sum + s.averageRating, 0) / 
                    surveys.filter(s => s.sessionType === 'installation').length || 0
                  }.toFixed(1)/5)
                </Text>
                <Text size="sm">
                  • Response rates are highest for hands-on training sessions
                </Text>
                <Text size="sm">
                  • Most common improvement suggestion: "More time for Q&A"
                </Text>
                <Text size="sm">
                  • 85% of respondents would recommend the training to colleagues
                </Text>
              </Stack>
            </Card>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Survey Detail Modal */}
      <Modal
        opened={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        title="Survey Details"
        size="lg"
      >
        {selectedSurvey && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Title order={3}>{selectedSurvey.sessionTitle}</Title>
                <Group gap="xs" mt="xs">
                  <Badge color={getTypeColor(selectedSurvey.sessionType)} variant="light">
                    {formatTypeLabel(selectedSurvey.sessionType)}
                  </Badge>
                  <Badge color={getStatusColor(selectedSurvey.status)} variant="light">
                    {formatStatusLabel(selectedSurvey.status)}
                  </Badge>
                </Group>
              </div>
              <ThemeIcon color="blue" variant="light" size="xl">
                <IconMessageCircle size={24} />
              </ThemeIcon>
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Customer</Text>
                <Text fw={500}>{getCustomerName(selectedSurvey.customerId)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Trainer</Text>
                <Text fw={500}>{getTrainerName(selectedSurvey.trainerId)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Session Date</Text>
                <Text fw={500}>
                  {new Intl.DateTimeFormat('en-US').format(selectedSurvey.sessionDate)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Response Rate</Text>
                <Group gap="xs">
                  <Text fw={500}>
                    {selectedSurvey.responseCount}/{selectedSurvey.totalAttendees}
                  </Text>
                  <Badge color={getResponseRateColor(selectedSurvey.responseRate)} variant="light">
                    {selectedSurvey.responseRate}%
                  </Badge>
                </Group>
              </Grid.Col>
            </Grid>

            <Card withBorder p="md">
              <Group justify="space-between" mb="md">
                <Text fw={500}>Overall Rating</Text>
                <Group gap="xs">
                  <Rating value={selectedSurvey.averageRating} readOnly />
                  <Text fw={500}>{selectedSurvey.averageRating.toFixed(1)}/5</Text>
                </Group>
              </Group>
              <Progress 
                value={(selectedSurvey.averageRating / 5) * 100} 
                color={getRatingColor(selectedSurvey.averageRating)}
                size="lg"
              />
            </Card>

            {selectedSurvey.responses.length > 0 && (
              <Card withBorder p="md">
                <Title order={5} mb="md">Sample Response</Title>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Respondent</Text>
                    <Text size="sm" fw={500}>{selectedSurvey.responses[0].respondentName}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Most Valuable</Text>
                    <Text size="sm" style={{ maxWidth: '60%', textAlign: 'right' }}>
                      {selectedSurvey.responses[0].responses.mostValuable}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Improvements</Text>
                    <Text size="sm" style={{ maxWidth: '60%', textAlign: 'right' }}>
                      {selectedSurvey.responses[0].responses.improvements}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setShowSurveyModal(false)}>
                Close
              </Button>
              <Button leftSection={<IconChartBar size={16} />}>
                View Full Analytics
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Table,
  Badge,
  Text,
  Stack,
  ActionIcon,
  Menu,
  rem,
  Pagination,
  Progress,
  ThemeIcon,
  Grid,
  Avatar,
} from '@mantine/core';
import {
  IconSearch,
  IconPlus,
  IconEye,
  IconEdit,
  IconDots,
  IconSchool,
  IconCertificate,
  IconClock,
  IconUsers,
  IconStar,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface CustomerTrainingProps {
  customerId: string;
}

const ITEMS_PER_PAGE = 10;

export function CustomerTraining({ customerId }: CustomerTrainingProps) {
  const { trainingSessions, users } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Get customer training sessions
  const customerTraining = useMemo(() => {
    return trainingSessions.filter(session => session.customerId === customerId);
  }, [trainingSessions, customerId]);

  // Filter training sessions
  const filteredTraining = useMemo(() => {
    return customerTraining.filter(session => {
      const matchesSearch = !searchQuery || 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || session.status === statusFilter;
      const matchesType = !typeFilter || session.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [customerTraining, searchQuery, statusFilter, typeFilter]);

  // Paginate results
  const totalPages = Math.ceil(filteredTraining.length / ITEMS_PER_PAGE);
  const paginatedTraining = filteredTraining.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get trainer name
  const getTrainerName = (trainerId: string) => {
    const trainer = users.find(user => user.id === trainerId);
    return trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'installation':
        return 'blue';
      case 'maintenance':
        return 'orange';
      case 'sales':
        return 'green';
      case 'product_knowledge':
        return 'violet';
      default:
        return 'gray';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatTypeLabel = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Calculate summary statistics
  const completedSessions = customerTraining.filter(s => s.status === 'completed').length;
  const totalSessions = customerTraining.length;
  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
  const totalTrainingHours = customerTraining
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + s.duration, 0) / 60;
  const certificationsEarned = customerTraining
    .filter(s => s.certificationAwarded)
    .length;

  return (
    <Stack gap="lg">
      {/* Summary Cards */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
              <IconSchool size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="blue">
              {completedSessions}/{totalSessions}
            </Text>
            <Text size="sm" c="dimmed">
              Sessions Completed
            </Text>
            <Progress value={completionRate} color="blue" size="sm" mt="xs" />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="orange" variant="light" size="xl" mx="auto" mb="sm">
              <IconClock size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="orange">
              {totalTrainingHours.toFixed(1)}h
            </Text>
            <Text size="sm" c="dimmed">
              Training Hours
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
              <IconCertificate size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="green">
              {certificationsEarned}
            </Text>
            <Text size="sm" c="dimmed">
              Certifications
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="violet" variant="light" size="xl" mx="auto" mb="sm">
              <IconStar size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="violet">
              {customerTraining
                .filter(s => s.feedback?.rating)
                .reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / 
               customerTraining.filter(s => s.feedback?.rating).length || 0}
            </Text>
            <Text size="sm" c="dimmed">
              Avg Rating
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Header and Filters */}
      <Card withBorder p="md">
        <Group justify="space-between" mb="md">
          <Title order={3}>Training History</Title>
          <Button leftSection={<IconPlus size={16} />}>
            Schedule Training
          </Button>
        </Group>
        
        <Group gap="md">
          <TextInput
            placeholder="Search training sessions..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Status"
            data={[
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            w={120}
          />
          <Select
            placeholder="Type"
            data={[
              { value: 'installation', label: 'Installation' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'sales', label: 'Sales' },
              { value: 'product_knowledge', label: 'Product Knowledge' },
            ]}
            value={typeFilter}
            onChange={setTypeFilter}
            clearable
            w={150}
          />
        </Group>
      </Card>

      {/* Training Sessions Table */}
      <Card withBorder p={0}>
        <Table.ScrollContainer minWidth={1000}>
          <Table verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Training Session</Table.Th>
                <Table.Th>Trainer</Table.Th>
                <Table.Th>Date & Time</Table.Th>
                <Table.Th>Duration</Table.Th>
                <Table.Th>Attendees</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Rating</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedTraining.map((session) => (
                <Table.Tr key={session.id}>
                  <Table.Td>
                    <div>
                      <Text fw={500} size="sm">
                        {session.title}
                      </Text>
                      <Badge color={getTypeColor(session.type)} variant="light" size="sm">
                        {formatTypeLabel(session.type)}
                      </Badge>
                      {session.certificationAwarded && (
                        <Badge color="gold" variant="light" size="sm" ml="xs">
                          <IconCertificate size={12} style={{ marginRight: 4 }} />
                          Certified
                        </Badge>
                      )}
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar size={24} radius="xl" color="blue">
                        {getTrainerName(session.trainerId).charAt(0)}
                      </Avatar>
                      <Text size="sm">
                        {getTrainerName(session.trainerId)}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {formatDate(session.scheduledDate)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconClock size={14} />
                      <Text size="sm">
                        {formatDuration(session.duration)}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconUsers size={14} />
                      <Text size="sm">
                        {session.attendees.length}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(session.status)} variant="light">
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {session.feedback?.rating ? (
                      <Group gap="xs">
                        <IconStar size={14} fill="gold" color="gold" />
                        <Text size="sm" fw={500}>
                          {session.feedback.rating}/5
                        </Text>
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">
                        No rating
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Menu position="bottom-end">
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                        >
                          View Details
                        </Menu.Item>
                        {session.status === 'scheduled' && (
                          <Menu.Item
                            leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                          >
                            Edit Session
                          </Menu.Item>
                        )}
                        {session.status === 'completed' && session.certificationAwarded && (
                          <Menu.Item
                            leftSection={<IconCertificate style={{ width: rem(14), height: rem(14) }} />}
                          >
                            View Certificate
                          </Menu.Item>
                        )}
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
          />
        </Group>
      )}

      {/* Training Recommendations */}
      <Card withBorder p="lg">
        <Title order={4} mb="md">Recommended Training</Title>
        <Stack gap="sm">
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500}>Advanced Installation Techniques</Text>
              <Text size="xs" c="dimmed">Based on recent product purchases</Text>
            </div>
            <Button size="xs" variant="light">
              Schedule
            </Button>
          </Group>
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500}>Maintenance Best Practices</Text>
              <Text size="xs" c="dimmed">Annual refresher training</Text>
            </div>
            <Button size="xs" variant="light">
              Schedule
            </Button>
          </Group>
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500}>New Product Features</Text>
              <Text size="xs" c="dimmed">Latest AQS Pro Series updates</Text>
            </div>
            <Button size="xs" variant="light">
              Schedule
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}
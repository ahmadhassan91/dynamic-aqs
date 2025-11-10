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
  Avatar,
  Progress,
  ThemeIcon,
  Tabs,
  Switch,
  NumberInput,
  Textarea,
} from '@mantine/core';
import {
  IconUsers,
  IconPlus,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconSearch,
  IconCalendar,
  IconClock,
  IconStar,
  IconSchool,
  IconCertificate,
  IconPhone,
  IconMail,
  IconMapPin,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface TrainerAvailability {
  trainerId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export function TrainerManagement() {
  const { users, trainingSessions, territories, regions } = useMockData();
  const [activeTab, setActiveTab] = useState<string | null>('trainers');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [territoryFilter, setTerritoryFilter] = useState<string | null>(null);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  // Get trainers (Territory Managers and Regional Managers who conduct training)
  const trainers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter(user => 
      user.role === 'territory_manager' || user.role === 'regional_manager'
    );
  }, [users]);

  // Filter trainers
  const filteredTrainers = useMemo(() => {
    return trainers.filter(trainer => {
      const matchesSearch = !searchQuery || 
        `${trainer.firstName} ${trainer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = !regionFilter || trainer.regionId === regionFilter;
      const matchesTerritory = !territoryFilter || trainer.territoryId === territoryFilter;

      return matchesSearch && matchesRegion && matchesTerritory;
    });
  }, [trainers, searchQuery, regionFilter, territoryFilter]);

  // Calculate trainer statistics
  const getTrainerStats = (trainerId: string) => {
    if (!Array.isArray(trainingSessions)) {
      return {
        totalSessions: 0,
        completedSessions: 0,
        scheduledSessions: 0,
        totalHours: '0.0',
        averageRating: '0.0',
        certificationsAwarded: 0,
      };
    }

    const trainerSessions = trainingSessions.filter(s => s.trainerId === trainerId);
    const completedSessions = trainerSessions.filter(s => s.status === 'completed');
    const scheduledSessions = trainerSessions.filter(s => s.status === 'scheduled');
    
    const totalHours = completedSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    
    const sessionsWithRatings = completedSessions.filter(s => s.feedback?.rating);
    const averageRating = sessionsWithRatings.length > 0
      ? sessionsWithRatings.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / sessionsWithRatings.length
      : 0;
    
    const certificationsAwarded = completedSessions.filter(s => s.certificationAwarded).length;

    return {
      totalSessions: trainerSessions.length,
      completedSessions: completedSessions.length,
      scheduledSessions: scheduledSessions.length,
      totalHours: totalHours.toFixed(1),
      averageRating: averageRating.toFixed(1),
      certificationsAwarded,
    };
  };

  const getRegionName = (regionId?: string) => {
    if (!regionId || !Array.isArray(regions)) return 'N/A';
    const region = regions.find(r => r.id === regionId);
    return region?.name || 'Unknown Region';
  };

  const getTerritoryName = (territoryId?: string) => {
    if (!territoryId || !Array.isArray(territories)) return 'N/A';
    const territory = territories.find(t => t.id === territoryId);
    return territory?.name || 'Unknown Territory';
  };

  // Mock availability data (in a real app, this would come from the database)
  const mockAvailability: TrainerAvailability[] = [
    { trainerId: 'tm-1', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { trainerId: 'tm-1', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { trainerId: 'tm-1', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { trainerId: 'tm-1', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
    { trainerId: 'tm-1', dayOfWeek: 5, startTime: '09:00', endTime: '15:00', isAvailable: true },
  ];

  const getTrainerAvailability = (trainerId: string) => {
    return mockAvailability.filter(a => a.trainerId === trainerId);
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Trainer Management</Title>
          <Text c="dimmed" size="sm">
            Manage trainer assignments, availability, and performance
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />}>
          Add Trainer
        </Button>
      </Group>

      {/* Filters */}
      <Card withBorder p="md">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              placeholder="Search trainers..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Select
              placeholder="Filter by region"
              data={regions.map(r => ({ value: r.id, label: r.name }))}
              value={regionFilter}
              onChange={setRegionFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Select
              placeholder="Filter by territory"
              data={territories.map(t => ({ value: t.id, label: t.name }))}
              value={territoryFilter}
              onChange={setTerritoryFilter}
              clearable
            />
          </Grid.Col>
        </Grid>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="trainers" leftSection={<IconUsers size={16} />}>
            Trainers
          </Tabs.Tab>
          <Tabs.Tab value="availability" leftSection={<IconCalendar size={16} />}>
            Availability
          </Tabs.Tab>
          <Tabs.Tab value="performance" leftSection={<IconStar size={16} />}>
            Performance
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="trainers" pt="lg">
          <Card withBorder p={0}>
            <Table.ScrollContainer minWidth={1000}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Trainer</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Region/Territory</Table.Th>
                    <Table.Th>Contact</Table.Th>
                    <Table.Th>Sessions</Table.Th>
                    <Table.Th>Rating</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredTrainers.map((trainer) => {
                    const stats = getTrainerStats(trainer.id);
                    return (
                      <Table.Tr key={trainer.id}>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar size={32} radius="xl" color="blue">
                              {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
                            </Avatar>
                            <div>
                              <Text fw={500} size="sm">
                                {trainer.firstName} {trainer.lastName}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {trainer.email}
                              </Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={trainer.role === 'regional_manager' ? 'violet' : 'blue'} 
                            variant="light"
                          >
                            {trainer.role === 'regional_manager' ? 'Regional Manager' : 'Territory Manager'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <div>
                            <Text size="sm" fw={500}>
                              {getRegionName(trainer.regionId)}
                            </Text>
                            {trainer.territoryId && (
                              <Text size="xs" c="dimmed">
                                {getTerritoryName(trainer.territoryId)}
                              </Text>
                            )}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Stack gap="xs">
                            <Group gap="xs">
                              <IconMail size={12} />
                              <Text size="xs">{trainer.email}</Text>
                            </Group>
                            <Group gap="xs">
                              <IconPhone size={12} />
                              <Text size="xs">+1 (555) 123-4567</Text>
                            </Group>
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          <div>
                            <Text size="sm" fw={500}>
                              {stats.completedSessions}/{stats.totalSessions}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {stats.totalHours}h total
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          {stats.averageRating !== '0.0' ? (
                            <Group gap="xs">
                              <IconStar size={14} fill="gold" color="gold" />
                              <Text size="sm" fw={500}>
                                {stats.averageRating}/5
                              </Text>
                            </Group>
                          ) : (
                            <Text size="sm" c="dimmed">
                              No ratings
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={trainer.isActive ? 'green' : 'red'} 
                            variant="light"
                          >
                            {trainer.isActive ? 'Active' : 'Inactive'}
                          </Badge>
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
                                onClick={() => {
                                  setSelectedTrainer(trainer);
                                  setShowTrainerModal(true);
                                }}
                              >
                                View Profile
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconCalendar style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => {
                                  setSelectedTrainer(trainer);
                                  setShowAvailabilityModal(true);
                                }}
                              >
                                Manage Availability
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                              >
                                Edit Trainer
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="availability" pt="lg">
          <Grid>
            {filteredTrainers.map((trainer) => {
              const availability = getTrainerAvailability(trainer.id);
              return (
                <Grid.Col key={trainer.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <Card withBorder p="md">
                    <Group justify="space-between" mb="md">
                      <div>
                        <Text fw={500}>{trainer.firstName} {trainer.lastName}</Text>
                        <Text size="sm" c="dimmed">{getTerritoryName(trainer.territoryId)}</Text>
                      </div>
                      <ActionIcon 
                        variant="light" 
                        onClick={() => {
                          setSelectedTrainer(trainer);
                          setShowAvailabilityModal(true);
                        }}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Group>
                    
                    <Stack gap="xs">
                      {dayNames.map((day, index) => {
                        const dayAvailability = availability.find(a => a.dayOfWeek === index);
                        return (
                          <Group key={day} justify="space-between">
                            <Text size="sm">{day}</Text>
                            {dayAvailability?.isAvailable ? (
                              <Badge color="green" variant="light" size="sm">
                                {dayAvailability.startTime} - {dayAvailability.endTime}
                              </Badge>
                            ) : (
                              <Badge color="gray" variant="light" size="sm">
                                Unavailable
                              </Badge>
                            )}
                          </Group>
                        );
                      })}
                    </Stack>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="performance" pt="lg">
          <Grid>
            {filteredTrainers.map((trainer) => {
              const stats = getTrainerStats(trainer.id);
              const completionRate = stats.totalSessions > 0 ? 
                (stats.completedSessions / stats.totalSessions) * 100 : 0;
              
              return (
                <Grid.Col key={trainer.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <Card withBorder p="md">
                    <Group gap="sm" mb="md">
                      <Avatar size={40} radius="xl" color="blue">
                        {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
                      </Avatar>
                      <div>
                        <Text fw={500}>{trainer.firstName} {trainer.lastName}</Text>
                        <Text size="sm" c="dimmed">{getTerritoryName(trainer.territoryId)}</Text>
                      </div>
                    </Group>

                    <Stack gap="md">
                      <div>
                        <Group justify="space-between" mb="xs">
                          <Text size="sm">Completion Rate</Text>
                          <Text size="sm" fw={500}>{completionRate.toFixed(1)}%</Text>
                        </Group>
                        <Progress value={completionRate} color="blue" size="sm" />
                      </div>

                      <Grid>
                        <Grid.Col span={6}>
                          <div style={{ textAlign: 'center' }}>
                            <ThemeIcon color="blue" variant="light" size="lg" mx="auto" mb="xs">
                              <IconSchool size={20} />
                            </ThemeIcon>
                            <Text size="lg" fw={700} c="blue">{stats.totalSessions}</Text>
                            <Text size="xs" c="dimmed">Total Sessions</Text>
                          </div>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <div style={{ textAlign: 'center' }}>
                            <ThemeIcon color="orange" variant="light" size="lg" mx="auto" mb="xs">
                              <IconClock size={20} />
                            </ThemeIcon>
                            <Text size="lg" fw={700} c="orange">{stats.totalHours}h</Text>
                            <Text size="xs" c="dimmed">Training Hours</Text>
                          </div>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <div style={{ textAlign: 'center' }}>
                            <ThemeIcon color="yellow" variant="light" size="lg" mx="auto" mb="xs">
                              <IconStar size={20} />
                            </ThemeIcon>
                            <Text size="lg" fw={700} c="yellow">{stats.averageRating}/5</Text>
                            <Text size="xs" c="dimmed">Avg Rating</Text>
                          </div>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <div style={{ textAlign: 'center' }}>
                            <ThemeIcon color="green" variant="light" size="lg" mx="auto" mb="xs">
                              <IconCertificate size={20} />
                            </ThemeIcon>
                            <Text size="lg" fw={700} c="green">{stats.certificationsAwarded}</Text>
                            <Text size="xs" c="dimmed">Certifications</Text>
                          </div>
                        </Grid.Col>
                      </Grid>
                    </Stack>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>
        </Tabs.Panel>
      </Tabs>

      {/* Trainer Profile Modal */}
      <Modal
        opened={showTrainerModal}
        onClose={() => setShowTrainerModal(false)}
        title="Trainer Profile"
        size="lg"
      >
        {selectedTrainer && (
          <Stack gap="md">
            <Group gap="md">
              <Avatar size={60} radius="xl" color="blue">
                {selectedTrainer.firstName.charAt(0)}{selectedTrainer.lastName.charAt(0)}
              </Avatar>
              <div>
                <Title order={3}>{selectedTrainer.firstName} {selectedTrainer.lastName}</Title>
                <Text c="dimmed">{selectedTrainer.email}</Text>
                <Badge 
                  color={selectedTrainer.role === 'regional_manager' ? 'violet' : 'blue'} 
                  variant="light"
                  mt="xs"
                >
                  {selectedTrainer.role === 'regional_manager' ? 'Regional Manager' : 'Territory Manager'}
                </Badge>
              </div>
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Region</Text>
                <Text fw={500}>{getRegionName(selectedTrainer.regionId)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Territory</Text>
                <Text fw={500}>{getTerritoryName(selectedTrainer.territoryId)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Status</Text>
                <Badge color={selectedTrainer.isActive ? 'green' : 'red'} variant="light">
                  {selectedTrainer.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Last Login</Text>
                <Text fw={500}>
                  {selectedTrainer.lastLogin ? 
                    new Intl.DateTimeFormat('en-US').format(selectedTrainer.lastLogin) : 
                    'Never'
                  }
                </Text>
              </Grid.Col>
            </Grid>

            {(() => {
              const stats = getTrainerStats(selectedTrainer.id);
              return (
                <Card withBorder p="md">
                  <Title order={5} mb="md">Training Statistics</Title>
                  <Grid>
                    <Grid.Col span={3}>
                      <Text ta="center" size="lg" fw={700} c="blue">{stats.totalSessions}</Text>
                      <Text ta="center" size="xs" c="dimmed">Total Sessions</Text>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Text ta="center" size="lg" fw={700} c="green">{stats.completedSessions}</Text>
                      <Text ta="center" size="xs" c="dimmed">Completed</Text>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Text ta="center" size="lg" fw={700} c="orange">{stats.totalHours}h</Text>
                      <Text ta="center" size="xs" c="dimmed">Training Hours</Text>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Text ta="center" size="lg" fw={700} c="yellow">{stats.averageRating}/5</Text>
                      <Text ta="center" size="xs" c="dimmed">Avg Rating</Text>
                    </Grid.Col>
                  </Grid>
                </Card>
              );
            })()}
          </Stack>
        )}
      </Modal>

      {/* Availability Management Modal */}
      <Modal
        opened={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        title="Manage Availability"
        size="md"
      >
        {selectedTrainer && (
          <Stack gap="md">
            <Text fw={500}>
              {selectedTrainer.firstName} {selectedTrainer.lastName} - Weekly Availability
            </Text>
            
            <Stack gap="sm">
              {dayNames.map((day, index) => {
                const availability = getTrainerAvailability(selectedTrainer.id);
                const dayAvailability = availability.find(a => a.dayOfWeek === index);
                
                return (
                  <Card key={day} withBorder p="md">
                    <Group justify="space-between" mb="sm">
                      <Text fw={500}>{day}</Text>
                      <Switch 
                        checked={dayAvailability?.isAvailable || false}
                        size="sm"
                      />
                    </Group>
                    
                    {dayAvailability?.isAvailable && (
                      <Group gap="sm">
                        <TextInput
                          label="Start Time"
                          value={dayAvailability.startTime}
                          placeholder="09:00"
                          size="sm"
                          style={{ flex: 1 }}
                        />
                        <TextInput
                          label="End Time"
                          value={dayAvailability.endTime}
                          placeholder="17:00"
                          size="sm"
                          style={{ flex: 1 }}
                        />
                      </Group>
                    )}
                  </Card>
                );
              })}
            </Stack>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setShowAvailabilityModal(false)}>
                Cancel
              </Button>
              <Button>
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
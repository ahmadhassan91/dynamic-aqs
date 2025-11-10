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
  Tooltip,
} from '@mantine/core';
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import { TrainingScheduleForm } from './TrainingScheduleForm';
import { formatTime as formatTimeUtil } from '@/lib/utils/dateUtils';
import { ClientOnlyTime } from '@/components/ui/ClientOnlyTime';
import { ClientOnlyCalendarHeader } from '@/components/ui/ClientOnlyCalendarHeader';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  sessions: any[];
}

export function TrainingCalendar() {
  const { trainingSessions, users, customers } = useMockData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [trainerFilter, setTrainerFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    if (!trainingSessions) return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // End at the last Saturday of the week containing the last day
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days: CalendarDay[] = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      const dayStart = new Date(currentDay);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDay);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Filter sessions for this day
      let daySessions = trainingSessions.filter(session => {
        const sessionDate = new Date(session.scheduledDate);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });

      // Apply filters
      if (trainerFilter) {
        daySessions = daySessions.filter(s => s.trainerId === trainerFilter);
      }
      if (typeFilter) {
        daySessions = daySessions.filter(s => s.type === typeFilter);
      }
      if (searchQuery) {
        daySessions = daySessions.filter(s => 
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          getCustomerName(s.customerId).toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        sessions: daySessions,
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  }, [currentDate, trainingSessions, trainerFilter, typeFilter, searchQuery]);

  const getCustomerName = (customerId: string) => {
    if (!customers) return 'Unknown Customer';
    const customer = customers.find(c => c.id === customerId);
    return customer?.companyName || 'Unknown Customer';
  };

  const getTrainerName = (trainerId: string) => {
    if (!users) return 'Unknown Trainer';
    const trainer = users.find(u => u.id === trainerId);
    return trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown Trainer';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'installation': return 'blue';
      case 'maintenance': return 'orange';
      case 'sales': return 'green';
      case 'product_knowledge': return 'violet';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const formatTime = formatTimeUtil;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get unique trainers and types for filters
  const trainers = useMemo(() => {
    if (!trainingSessions || !users) return [];
    const trainerIds = [...new Set(trainingSessions.map(s => s.trainerId))];
    return trainerIds.map(id => {
      const trainer = users.find(u => u.id === id);
      return {
        value: id,
        label: trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown',
      };
    });
  }, [trainingSessions, users]);

  const trainingTypes = [
    { value: 'installation', label: 'Installation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'sales', label: 'Sales' },
    { value: 'product_knowledge', label: 'Product Knowledge' },
  ];

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Training Calendar</Title>
          <Text c="dimmed" size="sm">
            Schedule and manage training sessions
          </Text>
        </div>
        <Button 
          leftSection={<IconPlus size={16} />}
          onClick={() => setShowScheduleModal(true)}
        >
          Schedule Training
        </Button>
      </Group>

      {/* Filters */}
      <Card withBorder p="md">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <TextInput
              placeholder="Search sessions..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Filter by trainer"
              data={trainers}
              value={trainerFilter}
              onChange={setTrainerFilter}
              clearable
              leftSection={<IconFilter size={16} />}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Filter by type"
              data={trainingTypes}
              value={typeFilter}
              onChange={setTypeFilter}
              clearable
              leftSection={<IconFilter size={16} />}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Button variant="light" onClick={goToToday} fullWidth>
              Today
            </Button>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Calendar */}
      <Card withBorder p={0}>
        {/* Calendar Header */}
        <div style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', padding: 'var(--mantine-spacing-md)' }}>
          <Group justify="space-between">
            <ClientOnlyCalendarHeader 
              currentDate={currentDate}
              onNavigate={navigateMonth}
            />
            <Group gap="xs">
              <Badge color="blue" variant="light">Scheduled</Badge>
              <Badge color="green" variant="light">Completed</Badge>
              <Badge color="red" variant="light">Cancelled</Badge>
            </Group>
          </Group>
        </div>

        {/* Week Days Header */}
        <Grid gutter={0} style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
          {weekDays.map((day) => (
            <Grid.Col key={day} span={12/7}>
              <Text ta="center" fw={500} p="sm" size="sm" c="dimmed">
                {day}
              </Text>
            </Grid.Col>
          ))}
        </Grid>

        {/* Calendar Days */}
        <Grid gutter={0}>
          {calendarDays.map((day, index) => (
            <Grid.Col key={index} span={12/7} style={{ 
              borderRight: (index + 1) % 7 !== 0 ? '1px solid var(--mantine-color-gray-2)' : 'none',
              borderBottom: index < calendarDays.length - 7 ? '1px solid var(--mantine-color-gray-2)' : 'none',
              minHeight: '120px',
            }}>
              <div style={{ padding: '8px', height: '100%' }}>
                <Text 
                  size="sm" 
                  fw={500} 
                  c={day.isCurrentMonth ? 'dark' : 'dimmed'}
                  mb="xs"
                >
                  {day.date.getDate()}
                </Text>
                
                <Stack gap="xs">
                  {day.sessions.slice(0, 3).map((session) => (
                    <Tooltip
                      key={session.id}
                      label={`${session.title} - ${getCustomerName(session.customerId)}`}
                      position="top"
                    >
                      <div
                        style={{
                          padding: '4px 6px',
                          borderRadius: '4px',
                          backgroundColor: `var(--mantine-color-${getTypeColor(session.type)}-1)`,
                          border: `1px solid var(--mantine-color-${getTypeColor(session.type)}-3)`,
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setSelectedSession(session);
                          setShowSessionModal(true);
                        }}
                      >
                        <Text size="xs" fw={500} truncate>
                          <ClientOnlyTime date={session.scheduledDate} /> {session.title}
                        </Text>
                        <Text size="xs" c="dimmed" truncate>
                          {getCustomerName(session.customerId)}
                        </Text>
                      </div>
                    </Tooltip>
                  ))}
                  
                  {day.sessions.length > 3 && (
                    <Text size="xs" c="dimmed" ta="center">
                      +{day.sessions.length - 3} more
                    </Text>
                  )}
                </Stack>
              </div>
            </Grid.Col>
          ))}
        </Grid>
      </Card>

      {/* Session Detail Modal */}
      <Modal
        opened={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        title="Training Session Details"
        size="md"
      >
        {selectedSession && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Title order={4}>{selectedSession.title}</Title>
                <Group gap="xs" mt="xs">
                  <Badge color={getTypeColor(selectedSession.type)} variant="light">
                    {selectedSession.type.replace('_', ' ')}
                  </Badge>
                  <Badge color={getStatusColor(selectedSession.status)} variant="light">
                    {selectedSession.status}
                  </Badge>
                  {selectedSession.certificationAwarded && (
                    <Badge color="gold" variant="light">
                      Certification
                    </Badge>
                  )}
                </Group>
              </div>
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                    Edit Session
                  </Menu.Item>
                  <Menu.Item 
                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                    color="red"
                  >
                    Cancel Session
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Customer</Text>
                <Text fw={500}>{getCustomerName(selectedSession.customerId)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Trainer</Text>
                <Text fw={500}>{getTrainerName(selectedSession.trainerId)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Date & Time</Text>
                <Text fw={500}>
                  <ClientOnlyTime date={selectedSession.scheduledDate}>
                    {(time) => selectedSession.scheduledDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'America/New_York',
                    }) + ' at ' + time}
                  </ClientOnlyTime>
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Duration</Text>
                <Text fw={500}>{formatDuration(selectedSession.duration)}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">Attendees ({selectedSession.attendees.length})</Text>
                <Text fw={500}>{selectedSession.attendees.join(', ')}</Text>
              </Grid.Col>
              {selectedSession.feedback && (
                <>
                  <Grid.Col span={6}>
                    <Text size="sm" c="dimmed">Rating</Text>
                    <Text fw={500}>{selectedSession.feedback.rating}/5</Text>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text size="sm" c="dimmed">Feedback</Text>
                    <Text fw={500}>{selectedSession.feedback.comments}</Text>
                  </Grid.Col>
                </>
              )}
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setShowSessionModal(false)}>
                Close
              </Button>
              {selectedSession.status === 'scheduled' && (
                <Button>
                  Mark Complete
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Schedule Training Modal */}
      <Modal
        opened={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule New Training Session"
        size="lg"
      >
        <TrainingScheduleForm 
          onClose={() => setShowScheduleModal(false)}
          onSubmit={(data) => {
            console.log('Training scheduled:', data);
            setShowScheduleModal(false);
          }}
        />
      </Modal>
    </Stack>
  );
}
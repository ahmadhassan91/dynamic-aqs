'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Badge,
  Stack,
  Grid,
  Select,
  TextInput,
  Progress,
  ThemeIcon,
  Timeline,
  Avatar,
  Tooltip,
  RingProgress,
  Center,
} from '@mantine/core';
import {
  IconHistory,
  IconSearch,
  IconCalendar,
  IconSchool,
  IconCertificate,
  IconTrendingUp,
  IconClock,
  IconUsers,
  IconStar,
  IconCheck,
  IconX,
  IconMinus,
  IconChartLine,
  IconTarget,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface TrainingProgressData {
  customerId: string;
  customerName: string;
  totalSessions: number;
  completedSessions: number;
  scheduledSessions: number;
  cancelledSessions: number;
  totalHours: number;
  certificationsEarned: number;
  averageRating: number;
  lastTrainingDate?: Date;
  nextTrainingDate?: Date;
  progressPercentage: number;
  trainingHistory: {
    id: string;
    title: string;
    type: string;
    date: Date;
    status: string;
    duration: number;
    trainer: string;
    rating?: number;
    certificationEarned?: string;
  }[];
}

export function TrainingHistoryProgress() {
  const { trainingSessions, customers, users } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  // Process training data by customer
  const customerProgressData = useMemo(() => {
    const customerMap = new Map<string, TrainingProgressData>();

    customers.forEach(customer => {
      const customerSessions = trainingSessions.filter(s => s.customerId === customer.id);
      const completedSessions = customerSessions.filter(s => s.status === 'completed');
      const scheduledSessions = customerSessions.filter(s => s.status === 'scheduled');
      const cancelledSessions = customerSessions.filter(s => s.status === 'cancelled');

      const totalHours = completedSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
      const certificationsEarned = completedSessions.filter(s => s.certificationAwarded).length;
      
      const ratingsSum = completedSessions
        .filter(s => s.feedback?.rating)
        .reduce((sum, s) => sum + (s.feedback?.rating || 0), 0);
      const averageRating = completedSessions.filter(s => s.feedback?.rating).length > 0 ? 
        ratingsSum / completedSessions.filter(s => s.feedback?.rating).length : 0;

      const lastTrainingDate = completedSessions.length > 0 ? 
        new Date(Math.max(...completedSessions.map(s => s.completedDate?.getTime() || 0))) : undefined;
      
      const nextTrainingDate = scheduledSessions.length > 0 ? 
        new Date(Math.min(...scheduledSessions.map(s => s.scheduledDate.getTime()))) : undefined;

      const progressPercentage = customerSessions.length > 0 ? 
        (completedSessions.length / customerSessions.length) * 100 : 0;

      const trainingHistory = customerSessions
        .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
        .map(session => ({
          id: session.id,
          title: session.title,
          type: session.type,
          date: session.completedDate || session.scheduledDate,
          status: session.status,
          duration: session.duration,
          trainer: getTrainerName(session.trainerId),
          rating: session.feedback?.rating,
          certificationEarned: session.certificationAwarded,
        }));

      customerMap.set(customer.id, {
        customerId: customer.id,
        customerName: customer.companyName,
        totalSessions: customerSessions.length,
        completedSessions: completedSessions.length,
        scheduledSessions: scheduledSessions.length,
        cancelledSessions: cancelledSessions.length,
        totalHours: totalHours,
        certificationsEarned,
        averageRating,
        lastTrainingDate,
        nextTrainingDate,
        progressPercentage,
        trainingHistory,
      });
    });

    return Array.from(customerMap.values());
  }, [trainingSessions, customers]);

  // Filter customer progress data
  const filteredCustomerData = useMemo(() => {
    return customerProgressData.filter(data => {
      const matchesSearch = !searchQuery || 
        data.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCustomer = !customerFilter || data.customerId === customerFilter;
      
      const matchesType = !typeFilter || 
        data.trainingHistory.some(h => h.type === typeFilter);

      return matchesSearch && matchesCustomer && matchesType;
    });
  }, [customerProgressData, searchQuery, customerFilter, typeFilter]);

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
      case 'scheduled': return 'blue';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return IconCheck;
      case 'scheduled': return IconClock;
      case 'cancelled': return IconX;
      default: return IconMinus;
    }
  };

  const formatTypeLabel = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'green';
    if (percentage >= 60) return 'yellow';
    if (percentage >= 40) return 'orange';
    return 'red';
  };

  const trainingTypes = [
    { value: 'installation', label: 'Installation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'sales', label: 'Sales' },
    { value: 'product_knowledge', label: 'Product Knowledge' },
    { value: 'safety', label: 'Safety' },
  ];

  const customerOptions = customers.map(c => ({
    value: c.id,
    label: c.companyName,
  }));

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const totalCustomers = customerProgressData.length;
    const activeCustomers = customerProgressData.filter(c => c.totalSessions > 0).length;
    const avgCompletionRate = customerProgressData.length > 0 ? 
      customerProgressData.reduce((sum, c) => sum + c.progressPercentage, 0) / customerProgressData.length : 0;
    const totalCertifications = customerProgressData.reduce((sum, c) => sum + c.certificationsEarned, 0);

    return {
      totalCustomers,
      activeCustomers,
      avgCompletionRate,
      totalCertifications,
    };
  }, [customerProgressData]);

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Training History & Progress</Title>
          <Text c="dimmed" size="sm">
            Track customer training progress and history
          </Text>
        </div>
        <Button leftSection={<IconChartLine size={16} />}>
          Export Report
        </Button>
      </Group>

      {/* Overall Statistics */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
              <IconUsers size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="blue">
              {overallStats.activeCustomers}/{overallStats.totalCustomers}
            </Text>
            <Text size="sm" c="dimmed">
              Active Customers
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
              <IconTrendingUp size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="green">
              {overallStats.avgCompletionRate.toFixed(1)}%
            </Text>
            <Text size="sm" c="dimmed">
              Avg Completion Rate
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="violet" variant="light" size="xl" mx="auto" mb="sm">
              <IconCertificate size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="violet">
              {overallStats.totalCertifications}
            </Text>
            <Text size="sm" c="dimmed">
              Total Certifications
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="orange" variant="light" size="xl" mx="auto" mb="sm">
              <IconClock size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="orange">
              {customerProgressData.reduce((sum, c) => sum + c.totalHours, 0).toFixed(0)}h
            </Text>
            <Text size="sm" c="dimmed">
              Total Training Hours
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filters */}
      <Card withBorder p="md">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              placeholder="Search customers..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Select
              placeholder="Select customer"
              data={customerOptions}
              value={customerFilter}
              onChange={setCustomerFilter}
              clearable
              searchable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Select
              placeholder="Filter by training type"
              data={trainingTypes}
              value={typeFilter}
              onChange={setTypeFilter}
              clearable
            />
          </Grid.Col>
        </Grid>
      </Card>

      {/* Customer Progress Cards */}
      <Grid>
        {filteredCustomerData.map((customerData) => (
          <Grid.Col key={customerData.customerId} span={{ base: 12, lg: 6 }}>
            <Card withBorder p="lg" h="100%">
              <Stack gap="md" h="100%">
                {/* Customer Header */}
                <Group justify="space-between">
                  <div>
                    <Title order={4}>{customerData.customerName}</Title>
                    <Text size="sm" c="dimmed">
                      {customerData.totalSessions} total sessions
                    </Text>
                  </div>
                  <RingProgress
                    size={60}
                    thickness={6}
                    sections={[
                      { 
                        value: customerData.progressPercentage, 
                        color: getProgressColor(customerData.progressPercentage) 
                      }
                    ]}
                    label={
                      <Center>
                        <Text size="xs" fw={700}>
                          {customerData.progressPercentage.toFixed(0)}%
                        </Text>
                      </Center>
                    }
                  />
                </Group>

                {/* Progress Stats */}
                <Grid>
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <ThemeIcon color="green" variant="light" size="sm">
                        <IconCheck size={14} />
                      </ThemeIcon>
                      <div>
                        <Text size="sm" fw={500}>{customerData.completedSessions}</Text>
                        <Text size="xs" c="dimmed">Completed</Text>
                      </div>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <ThemeIcon color="blue" variant="light" size="sm">
                        <IconClock size={14} />
                      </ThemeIcon>
                      <div>
                        <Text size="sm" fw={500}>{customerData.scheduledSessions}</Text>
                        <Text size="xs" c="dimmed">Scheduled</Text>
                      </div>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <ThemeIcon color="orange" variant="light" size="sm">
                        <IconClock size={14} />
                      </ThemeIcon>
                      <div>
                        <Text size="sm" fw={500}>{customerData.totalHours.toFixed(1)}h</Text>
                        <Text size="xs" c="dimmed">Total Hours</Text>
                      </div>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <ThemeIcon color="violet" variant="light" size="sm">
                        <IconCertificate size={14} />
                      </ThemeIcon>
                      <div>
                        <Text size="sm" fw={500}>{customerData.certificationsEarned}</Text>
                        <Text size="xs" c="dimmed">Certificates</Text>
                      </div>
                    </Group>
                  </Grid.Col>
                </Grid>

                {/* Rating and Dates */}
                <Group justify="space-between">
                  <Group gap="xs">
                    <IconStar size={14} fill="gold" color="gold" />
                    <Text size="sm" fw={500}>
                      {customerData.averageRating > 0 ? customerData.averageRating.toFixed(1) : 'N/A'}/5
                    </Text>
                  </Group>
                  {customerData.nextTrainingDate && (
                    <Group gap="xs">
                      <IconCalendar size={14} />
                      <Text size="sm">
                        Next: {new Intl.DateTimeFormat('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        }).format(customerData.nextTrainingDate)}
                      </Text>
                    </Group>
                  )}
                </Group>

                {/* Recent Training History */}
                <div style={{ flex: 1 }}>
                  <Text fw={500} size="sm" mb="md">Recent Training History</Text>
                  <Timeline active={-1} bulletSize={20} lineWidth={2}>
                    {customerData.trainingHistory.slice(0, 3).map((training) => {
                      const StatusIcon = getStatusIcon(training.status);
                      return (
                        <Timeline.Item
                          key={training.id}
                          bullet={
                            <ThemeIcon 
                              color={getStatusColor(training.status)} 
                              variant="light" 
                              size="sm"
                            >
                              <StatusIcon size={12} />
                            </ThemeIcon>
                          }
                        >
                          <div>
                            <Group justify="space-between" mb="xs">
                              <Text fw={500} size="sm">{training.title}</Text>
                              <Badge 
                                color={getTypeColor(training.type)} 
                                variant="light" 
                                size="xs"
                              >
                                {formatTypeLabel(training.type)}
                              </Badge>
                            </Group>
                            <Group gap="md" mb="xs">
                              <Text size="xs" c="dimmed">
                                {new Intl.DateTimeFormat('en-US').format(training.date)}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {formatDuration(training.duration)}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {training.trainer}
                              </Text>
                            </Group>
                            <Group gap="xs">
                              <Badge 
                                color={getStatusColor(training.status)} 
                                variant="light" 
                                size="xs"
                              >
                                {training.status}
                              </Badge>
                              {training.rating && (
                                <Group gap="xs">
                                  <IconStar size={10} fill="gold" color="gold" />
                                  <Text size="xs">{training.rating}/5</Text>
                                </Group>
                              )}
                              {training.certificationEarned && (
                                <Badge color="gold" variant="light" size="xs">
                                  <IconCertificate size={10} style={{ marginRight: 2 }} />
                                  Certified
                                </Badge>
                              )}
                            </Group>
                          </div>
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                  
                  {customerData.trainingHistory.length > 3 && (
                    <Button 
                      variant="subtle" 
                      size="xs" 
                      mt="sm"
                      onClick={() => setSelectedCustomer(customerData.customerId)}
                    >
                      View all {customerData.trainingHistory.length} sessions
                    </Button>
                  )}
                </div>

                {/* Action Buttons */}
                <Group justify="space-between" mt="auto">
                  <Button 
                    variant="light" 
                    size="sm"
                    leftSection={<IconHistory size={14} />}
                    onClick={() => setSelectedCustomer(customerData.customerId)}
                  >
                    Full History
                  </Button>
                  <Button 
                    size="sm"
                    leftSection={<IconSchool size={14} />}
                  >
                    Schedule Training
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {filteredCustomerData.length === 0 && (
        <Card withBorder p="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size="xl" variant="light" color="gray">
              <IconHistory size={32} />
            </ThemeIcon>
            <div style={{ textAlign: 'center' }}>
              <Text fw={500} mb="xs">No training history found</Text>
              <Text size="sm" c="dimmed" mb="md">
                {searchQuery || customerFilter || typeFilter ? 
                  'Try adjusting your search criteria or filters.' :
                  'No customers have completed training sessions yet.'
                }
              </Text>
            </div>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
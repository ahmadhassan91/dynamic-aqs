'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Stack,
  Badge,
  Grid,
  Select,
  Table,
  Avatar,
  ActionIcon,
  Menu,
  rem,
  Modal,
  Textarea,
  NumberInput,
  Checkbox,
  Alert,
  Progress,
  ThemeIcon,
  SimpleGrid,
  Tabs,
  Rating,
} from '@mantine/core';
import {
  IconCheck,
  IconClock,
  IconStar,
  IconCertificate,
  IconEdit,
  IconEye,
  IconDots,
  IconAlertTriangle,
  IconTrendingUp,
  IconUsers,
  IconSchool,
  IconCalendar,
  IconFileText,
  IconDownload,
} from '@tabler/icons-react';
import { DateTimePicker } from '@mantine/dates';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface TrainingCompletionTrackerProps {
  customerId?: string;
}

interface CompletionData {
  sessionId: string;
  completedDate: Date;
  actualDuration: number;
  attendeeCount: number;
  rating: number;
  feedback: string;
  certificationAwarded: boolean;
  certificationNumber?: string;
  trainerNotes: string;
  followUpRequired: boolean;
  followUpNotes?: string;
}

export function TrainingCompletionTracker({ customerId }: TrainingCompletionTrackerProps) {
  const { trainingSessions, customers, users } = useMockData();
  const [activeTab, setActiveTab] = useState<string | null>('pending');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [completionData, setCompletionData] = useState<Partial<CompletionData>>({});

  // Filter sessions based on customerId if provided
  const filteredSessions = useMemo(() => {
    let sessions = trainingSessions;
    if (customerId) {
      sessions = sessions.filter(s => s.customerId === customerId);
    }
    return sessions;
  }, [trainingSessions, customerId]);

  // Categorize sessions
  const sessionCategories = useMemo(() => {
    const pending = filteredSessions.filter(s => s.status === 'scheduled');
    const completed = filteredSessions.filter(s => s.status === 'completed');
    const overdue = filteredSessions.filter(s => 
      s.status === 'scheduled' && s.scheduledDate < new Date()
    );

    return { pending, completed, overdue };
  }, [filteredSessions]);

  // Calculate completion metrics
  const completionMetrics = useMemo(() => {
    const totalSessions = filteredSessions.length;
    const completedSessions = sessionCategories.completed.length;
    const pendingSessions = sessionCategories.pending.length;
    const overdueSessions = sessionCategories.overdue.length;
    
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    
    const certificationsAwarded = sessionCategories.completed.filter(s => s.certificationAwarded).length;
    const averageRating = sessionCategories.completed.length > 0
      ? sessionCategories.completed.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / sessionCategories.completed.length
      : 0;
    
    const totalTrainingHours = sessionCategories.completed.reduce((sum, s) => sum + s.duration, 0) / 60;
    
    const thisMonthCompletions = sessionCategories.completed.filter(s => {
      const completedDate = s.completedDate || new Date();
      const thisMonth = new Date();
      return completedDate.getMonth() === thisMonth.getMonth() && 
             completedDate.getFullYear() === thisMonth.getFullYear();
    }).length;

    return {
      totalSessions,
      completedSessions,
      pendingSessions,
      overdueSessions,
      completionRate,
      certificationsAwarded,
      averageRating,
      totalTrainingHours,
      thisMonthCompletions,
    };
  }, [filteredSessions, sessionCategories]);

  // Get customer and trainer names
  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.companyName || 'Unknown Customer';
  };

  const getTrainerName = (trainerId: string) => {
    const trainer = users.find(u => u.id === trainerId);
    return trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown Trainer';
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
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
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

  const handleCompleteSession = (session: any) => {
    setSelectedSession(session);
    setCompletionData({
      sessionId: session.id,
      completedDate: new Date(),
      actualDuration: session.duration,
      attendeeCount: session.attendees.length,
      rating: 0,
      feedback: '',
      certificationAwarded: false,
      trainerNotes: '',
      followUpRequired: false,
    });
    setCompletionModalOpen(true);
  };

  const handleSubmitCompletion = () => {
    // In a real application, this would make an API call to update the session
    console.log('Completing training session:', {
      sessionId: selectedSession?.id,
      ...completionData,
    });

    // Reset and close modal
    setCompletionModalOpen(false);
    setSelectedSession(null);
    setCompletionData({});
  };

  const renderSessionTable = (sessions: any[], showActions = true) => (
    <Table.ScrollContainer minWidth={1000}>
      <Table verticalSpacing="sm" horizontalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Training Session</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Trainer</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Duration</Table.Th>
            <Table.Th>Attendees</Table.Th>
            {activeTab === 'completed' && <Table.Th>Rating</Table.Th>}
            {activeTab === 'completed' && <Table.Th>Certification</Table.Th>}
            {showActions && <Table.Th>Actions</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sessions.map((session) => (
            <Table.Tr key={session.id}>
              <Table.Td>
                <div>
                  <Text fw={500} size="sm">
                    {session.title}
                  </Text>
                  <Badge color={getTypeColor(session.type)} variant="light" size="sm">
                    {session.type.replace('_', ' ')}
                  </Badge>
                </div>
              </Table.Td>
              <Table.Td>
                <Group gap="sm">
                  <Avatar size={24} radius="xl" color="blue">
                    {getCustomerName(session.customerId).charAt(0)}
                  </Avatar>
                  <Text size="sm">
                    {getCustomerName(session.customerId)}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Text size="sm">
                  {getTrainerName(session.trainerId)}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">
                  {formatDate(session.scheduledDate)}
                </Text>
                {session.status === 'scheduled' && session.scheduledDate < new Date() && (
                  <Badge color="red" variant="light" size="xs" mt="xs">
                    Overdue
                  </Badge>
                )}
              </Table.Td>
              <Table.Td>
                <Text size="sm">
                  {formatDuration(session.duration)}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">
                  {session.attendees.length}
                </Text>
              </Table.Td>
              {activeTab === 'completed' && (
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
              )}
              {activeTab === 'completed' && (
                <Table.Td>
                  {session.certificationAwarded ? (
                    <Badge color="gold" variant="light" size="sm">
                      <IconCertificate size={12} style={{ marginRight: 4 }} />
                      Awarded
                    </Badge>
                  ) : (
                    <Text size="sm" c="dimmed">
                      None
                    </Text>
                  )}
                </Table.Td>
              )}
              {showActions && (
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
                          leftSection={<IconCheck style={{ width: rem(14), height: rem(14) }} />}
                          onClick={() => handleCompleteSession(session)}
                        >
                          Mark Complete
                        </Menu.Item>
                      )}
                      {session.status === 'completed' && (
                        <>
                          <Menu.Item
                            leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                          >
                            Edit Completion
                          </Menu.Item>
                          {session.certificationAwarded && (
                            <Menu.Item
                              leftSection={<IconDownload style={{ width: rem(14), height: rem(14) }} />}
                            >
                              Download Certificate
                            </Menu.Item>
                          )}
                        </>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );

  return (
    <Stack gap="lg">
      {/* Completion Metrics */}
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }}>
        <Card withBorder p="md" ta="center">
          <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
            <IconSchool size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="blue">
            {completionMetrics.totalSessions}
          </Text>
          <Text size="sm" c="dimmed">
            Total Sessions
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
            <IconCheck size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="green">
            {completionMetrics.completionRate.toFixed(1)}%
          </Text>
          <Text size="sm" c="dimmed">
            Completion Rate
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="orange" variant="light" size="xl" mx="auto" mb="sm">
            <IconClock size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="orange">
            {completionMetrics.pendingSessions}
          </Text>
          <Text size="sm" c="dimmed">
            Pending Sessions
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="red" variant="light" size="xl" mx="auto" mb="sm">
            <IconAlertTriangle size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="red">
            {completionMetrics.overdueSessions}
          </Text>
          <Text size="sm" c="dimmed">
            Overdue Sessions
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="violet" variant="light" size="xl" mx="auto" mb="sm">
            <IconCertificate size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="violet">
            {completionMetrics.certificationsAwarded}
          </Text>
          <Text size="sm" c="dimmed">
            Certifications
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="yellow" variant="light" size="xl" mx="auto" mb="sm">
            <IconStar size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="yellow">
            {completionMetrics.averageRating.toFixed(1)}
          </Text>
          <Text size="sm" c="dimmed">
            Avg Rating
          </Text>
        </Card>
      </SimpleGrid>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab 
            value="pending" 
            leftSection={<IconClock size={16} />}
            rightSection={
              <Badge color="orange" variant="light" size="sm">
                {completionMetrics.pendingSessions}
              </Badge>
            }
          >
            Pending
          </Tabs.Tab>
          <Tabs.Tab 
            value="overdue" 
            leftSection={<IconAlertTriangle size={16} />}
            rightSection={
              completionMetrics.overdueSessions > 0 ? (
                <Badge color="red" variant="light" size="sm">
                  {completionMetrics.overdueSessions}
                </Badge>
              ) : null
            }
          >
            Overdue
          </Tabs.Tab>
          <Tabs.Tab 
            value="completed" 
            leftSection={<IconCheck size={16} />}
            rightSection={
              <Badge color="green" variant="light" size="sm">
                {completionMetrics.completedSessions}
              </Badge>
            }
          >
            Completed
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending" pt="lg">
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>Pending Training Sessions</Title>
              <Text size="sm" c="dimmed">
                {sessionCategories.pending.length} sessions awaiting completion
              </Text>
            </Group>
            {sessionCategories.pending.length === 0 ? (
              <Text ta="center" c="dimmed" py="xl">
                No pending training sessions
              </Text>
            ) : (
              renderSessionTable(sessionCategories.pending)
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="overdue" pt="lg">
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>Overdue Training Sessions</Title>
              {sessionCategories.overdue.length > 0 && (
                <Alert
                  icon={<IconAlertTriangle size={16} />}
                  color="red"
                  variant="light"
                  style={{ flex: 1, maxWidth: 400 }}
                >
                  {sessionCategories.overdue.length} sessions are overdue and need immediate attention
                </Alert>
              )}
            </Group>
            {sessionCategories.overdue.length === 0 ? (
              <Text ta="center" c="dimmed" py="xl">
                No overdue training sessions
              </Text>
            ) : (
              renderSessionTable(sessionCategories.overdue)
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="completed" pt="lg">
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>Completed Training Sessions</Title>
              <Group gap="sm">
                <Text size="sm" c="dimmed">
                  {completionMetrics.thisMonthCompletions} completed this month
                </Text>
                <Button leftSection={<IconDownload size={16} />} variant="light" size="sm">
                  Export Report
                </Button>
              </Group>
            </Group>
            {sessionCategories.completed.length === 0 ? (
              <Text ta="center" c="dimmed" py="xl">
                No completed training sessions
              </Text>
            ) : (
              renderSessionTable(sessionCategories.completed)
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Training Completion Modal */}
      <Modal
        opened={completionModalOpen}
        onClose={() => setCompletionModalOpen(false)}
        title={
          <Group gap="sm">
            <IconCheck size={20} />
            <Title order={3}>Complete Training Session</Title>
          </Group>
        }
        size="lg"
        centered
      >
        {selectedSession && (
          <Stack gap="md">
            {/* Session Info */}
            <Card withBorder p="md" bg="gray.0">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>{selectedSession.title}</Text>
                  <Text size="sm" c="dimmed">
                    {getCustomerName(selectedSession.customerId)} • {getTrainerName(selectedSession.trainerId)}
                  </Text>
                </div>
                <Badge color={getTypeColor(selectedSession.type)} variant="light">
                  {selectedSession.type.replace('_', ' ')}
                </Badge>
              </Group>
            </Card>

            {/* Completion Details */}
            <Grid>
              <Grid.Col span={6}>
                <DateTimePicker
                  label="Completion Date & Time"
                  value={completionData.completedDate}
                  onChange={(date) => setCompletionData(prev => ({ ...prev, completedDate: date ? new Date(date) : new Date() }))}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Actual Duration (minutes)"
                  value={completionData.actualDuration}
                  onChange={(value) => setCompletionData(prev => ({ ...prev, actualDuration: Number(value) || 0 }))}
                  min={15}
                  max={480}
                  required
                />
              </Grid.Col>
            </Grid>

            <NumberInput
              label="Number of Attendees"
              value={completionData.attendeeCount}
              onChange={(value) => setCompletionData(prev => ({ ...prev, attendeeCount: Number(value) || 0 }))}
              min={1}
              max={20}
              required
            />

            <div>
              <Text size="sm" fw={500} mb="xs">Training Rating</Text>
              <Rating
                value={completionData.rating}
                onChange={(value) => setCompletionData(prev => ({ ...prev, rating: value }))}
                size="lg"
              />
            </div>

            <Textarea
              label="Training Feedback"
              placeholder="Enter feedback about the training session..."
              value={completionData.feedback}
              onChange={(e) => setCompletionData(prev => ({ ...prev, feedback: e.currentTarget.value }))}
              minRows={3}
            />

            <Textarea
              label="Trainer Notes"
              placeholder="Internal notes about the session..."
              value={completionData.trainerNotes}
              onChange={(e) => setCompletionData(prev => ({ ...prev, trainerNotes: e.currentTarget.value }))}
              minRows={2}
            />

            <Group gap="md">
              <Checkbox
                label="Award Certification"
                checked={completionData.certificationAwarded}
                onChange={(e) => setCompletionData(prev => ({ ...prev, certificationAwarded: e.currentTarget.checked }))}
              />
              <Checkbox
                label="Follow-up Required"
                checked={completionData.followUpRequired}
                onChange={(e) => setCompletionData(prev => ({ ...prev, followUpRequired: e.currentTarget.checked }))}
              />
            </Group>

            {completionData.followUpRequired && (
              <Textarea
                label="Follow-up Notes"
                placeholder="Describe what follow-up is needed..."
                value={completionData.followUpNotes}
                onChange={(e) => setCompletionData(prev => ({ ...prev, followUpNotes: e.currentTarget.value }))}
                minRows={2}
              />
            )}

            {/* Action Buttons */}
            <Group justify="flex-end" gap="sm">
              <Button variant="outline" onClick={() => setCompletionModalOpen(false)}>
                Cancel
              </Button>
              <Button
                leftSection={<IconCheck size={16} />}
                onClick={handleSubmitCompletion}
              >
                Complete Session
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
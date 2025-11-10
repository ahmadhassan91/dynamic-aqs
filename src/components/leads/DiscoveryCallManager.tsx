'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  Button,
  Badge,
  SimpleGrid,
  ActionIcon,
  Menu,
  Modal,
  Tabs,
  Box,
  ThemeIcon,
  Select,
  TextInput,
  Textarea,
  Grid,
  Timeline,
  Progress,
} from '@mantine/core';
import { Calendar } from '@mantine/dates';
import {
  IconDots,
  IconEye,
  IconEdit,
  IconPhone,
  IconCalendar,
  IconPlus,
  IconClock,
  IconCheck,
  IconX,
  IconUser,
  IconBuilding,
  IconNotes,
  IconMicrophone,
  IconFileText,
  IconAlertCircle,
} from '@tabler/icons-react';
import { DateTimePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { MockLead, generateMockLeads } from '@/lib/mockData/generators';
import { DiscoveryCallForm } from './DiscoveryCallForm';
import { CallNotesModal } from './CallNotesModal';

interface DiscoveryCall {
  id: string;
  leadId: string;
  leadName: string;
  companyName: string;
  scheduledDate: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  assignedTo: string;
  callType: 'initial' | 'follow_up' | 'technical' | 'closing';
  outcome?: 'qualified' | 'not_qualified' | 'needs_follow_up' | 'ready_for_proposal';
  notes?: string;
  recordingUrl?: string;
  transcriptUrl?: string;
  followUpTasks?: FollowUpTask[];
  createdAt: Date;
  updatedAt: Date;
}

interface FollowUpTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  assignedTo: string;
  status: 'pending' | 'completed';
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'demo';
}

export function DiscoveryCallManager() {
  const [calls, setCalls] = useState<DiscoveryCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<DiscoveryCall | null>(null);
  const [editingCall, setEditingCall] = useState<DiscoveryCall | null>(null);
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [notesOpened, { open: openNotes, close: closeNotes }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>('upcoming');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    // Generate mock discovery calls
    const mockLeads = generateMockLeads(30);
    const mockCalls: DiscoveryCall[] = mockLeads
      .filter(lead => ['qualified', 'discovery'].includes(lead.status))
      .map((lead, index) => {
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30) - 15);
        scheduledDate.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0, 0);
        
        const status: DiscoveryCall['status'] = 
          scheduledDate < new Date() 
            ? Math.random() > 0.8 ? 'no_show' : Math.random() > 0.1 ? 'completed' : 'cancelled'
            : 'scheduled';

        const outcome: DiscoveryCall['outcome'] | undefined = 
          status === 'completed' 
            ? ['qualified', 'not_qualified', 'needs_follow_up', 'ready_for_proposal'][Math.floor(Math.random() * 4)] as DiscoveryCall['outcome']
            : undefined;

        const followUpTasks: FollowUpTask[] = status === 'completed' && outcome === 'qualified' ? [
          {
            id: `${lead.id}-task-1`,
            title: 'Send Product Information',
            description: 'Email detailed product specifications and pricing',
            dueDate: new Date(scheduledDate.getTime() + 2 * 24 * 60 * 60 * 1000),
            assignedTo: lead.assignedTo,
            status: 'pending',
            type: 'email',
          },
          {
            id: `${lead.id}-task-2`,
            title: 'Schedule Technical Demo',
            description: 'Set up product demonstration call',
            dueDate: new Date(scheduledDate.getTime() + 7 * 24 * 60 * 60 * 1000),
            assignedTo: lead.assignedTo,
            status: 'pending',
            type: 'demo',
          },
        ] : [];

        return {
          id: `call-${lead.id}`,
          leadId: lead.id,
          leadName: lead.contactName,
          companyName: lead.companyName,
          scheduledDate,
          duration: 30 + Math.floor(Math.random() * 30), // 30-60 minutes
          status,
          assignedTo: lead.assignedTo,
          callType: index % 4 === 0 ? 'follow_up' : 'initial',
          outcome,
          notes: status === 'completed' ? 'Call went well. Customer showed strong interest in our heat pump solutions.' : undefined,
          recordingUrl: status === 'completed' ? '/recordings/call-recording.mp3' : undefined,
          transcriptUrl: status === 'completed' ? '/transcripts/call-transcript.txt' : undefined,
          followUpTasks,
          createdAt: new Date(scheduledDate.getTime() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        };
      });

    setCalls(mockCalls);
  }, []);

  const getStatusColor = (status: DiscoveryCall['status']) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      case 'no_show': return 'orange';
      case 'rescheduled': return 'yellow';
      default: return 'gray';
    }
  };

  const getOutcomeColor = (outcome: DiscoveryCall['outcome']) => {
    switch (outcome) {
      case 'qualified': return 'green';
      case 'not_qualified': return 'red';
      case 'needs_follow_up': return 'yellow';
      case 'ready_for_proposal': return 'blue';
      default: return 'gray';
    }
  };

  const getCallTypeIcon = (type: DiscoveryCall['callType']) => {
    switch (type) {
      case 'initial': return IconPhone;
      case 'follow_up': return IconClock;
      case 'technical': return IconUser;
      case 'closing': return IconCheck;
      default: return IconPhone;
    }
  };

  const filteredCalls = calls.filter(call => {
    const now = new Date();
    switch (activeTab) {
      case 'upcoming': 
        return call.status === 'scheduled' && call.scheduledDate >= now;
      case 'today':
        return call.scheduledDate.toDateString() === now.toDateString();
      case 'completed':
        return call.status === 'completed';
      case 'cancelled':
        return ['cancelled', 'no_show'].includes(call.status);
      default:
        return true;
    }
  });

  const calendarCalls = calls.filter(call => 
    call.scheduledDate.toDateString() === selectedDate.toDateString()
  );

  const handleViewCall = (call: DiscoveryCall) => {
    setSelectedCall(call);
    openNotes();
  };

  const handleEditCall = (call: DiscoveryCall) => {
    setEditingCall(call);
    openForm();
  };

  const handleSaveCall = (updatedCall: DiscoveryCall) => {
    setCalls(prevCalls =>
      prevCalls.map(call =>
        call.id === updatedCall.id ? updatedCall : call
      )
    );
    setEditingCall(null);
    closeForm();
  };

  const handleNewCall = () => {
    setEditingCall(null);
    openForm();
  };

  return (
    <>
      <Stack gap="md">
        {/* Summary Cards */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Upcoming
                </Text>
                <Text size="xl" fw={700}>
                  {calls.filter(c => c.status === 'scheduled' && c.scheduledDate >= new Date()).length}
                </Text>
              </Box>
              <ThemeIcon color="blue" variant="light" size="lg">
                <IconCalendar size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Today
                </Text>
                <Text size="xl" fw={700}>
                  {calls.filter(c => c.scheduledDate.toDateString() === new Date().toDateString()).length}
                </Text>
              </Box>
              <ThemeIcon color="green" variant="light" size="lg">
                <IconClock size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Completed
                </Text>
                <Text size="xl" fw={700} c="green">
                  {calls.filter(c => c.status === 'completed').length}
                </Text>
              </Box>
              <ThemeIcon color="green" variant="light" size="lg">
                <IconCheck size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Success Rate
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {calls.filter(c => c.outcome === 'qualified').length > 0 
                    ? Math.round((calls.filter(c => c.outcome === 'qualified').length / calls.filter(c => c.status === 'completed').length) * 100)
                    : 0}%
                </Text>
              </Box>
              <ThemeIcon color="blue" variant="light" size="lg">
                <IconUser size={20} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Main Content */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Group justify="space-between" mb="md">
            <Tabs.List>
              <Tabs.Tab value="upcoming">
                Upcoming ({calls.filter(c => c.status === 'scheduled' && c.scheduledDate >= new Date()).length})
              </Tabs.Tab>
              <Tabs.Tab value="today">
                Today ({calls.filter(c => c.scheduledDate.toDateString() === new Date().toDateString()).length})
              </Tabs.Tab>
              <Tabs.Tab value="completed">
                Completed ({calls.filter(c => c.status === 'completed').length})
              </Tabs.Tab>
              <Tabs.Tab value="calendar">
                Calendar
              </Tabs.Tab>
            </Tabs.List>
            <Button leftSection={<IconPlus size={16} />} onClick={handleNewCall}>
              Schedule Call
            </Button>
          </Group>

          <Box>
            <Tabs.Panel value="upcoming">
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                {filteredCalls.map((call) => (
                  <CallCard
                    key={call.id}
                    call={call}
                    onView={handleViewCall}
                    onEdit={handleEditCall}
                  />
                ))}
              </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value="today">
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                {filteredCalls.map((call) => (
                  <CallCard
                    key={call.id}
                    call={call}
                    onView={handleViewCall}
                    onEdit={handleEditCall}
                  />
                ))}
              </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value="completed">
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                {filteredCalls.map((call) => (
                  <CallCard
                    key={call.id}
                    call={call}
                    onView={handleViewCall}
                    onEdit={handleEditCall}
                  />
                ))}
              </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value="calendar">
              <Grid>
                <Grid.Col span={8}>
                  <Calendar
                    date={selectedDate}
                    onChange={(date) => setSelectedDate(date as any)}
                    size="lg"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Card withBorder p="md">
                    <Text fw={600} mb="md">
                      {selectedDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit' 
                      })} Schedule
                    </Text>
                    <Stack gap="sm">
                      {calendarCalls.length === 0 ? (
                        <Text size="sm" c="dimmed" ta="center" py="md">
                          No calls scheduled for this date
                        </Text>
                      ) : (
                        calendarCalls.map((call) => (
                          <Card key={call.id} withBorder p="sm">
                            <Group justify="space-between" align="flex-start">
                              <Box flex={1}>
                                <Text fw={500} size="sm">
                                  {call.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {call.companyName}
                                </Text>
                              </Box>
                              <Badge size="xs" color={getStatusColor(call.status)}>
                                {call.status}
                              </Badge>
                            </Group>
                          </Card>
                        ))
                      )}
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Stack>

      {/* Discovery Call Form Modal */}
      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={editingCall ? 'Edit Discovery Call' : 'Schedule Discovery Call'}
        size="lg"
      >
        <DiscoveryCallForm
          call={editingCall}
          onSave={handleSaveCall}
          onCancel={closeForm}
        />
      </Modal>

      {/* Call Notes Modal */}
      <Modal
        opened={notesOpened}
        onClose={closeNotes}
        title="Call Details"
        size="xl"
      >
        {selectedCall && (
          <CallNotesModal
            call={selectedCall}
            onClose={closeNotes}
            onEdit={() => {
              closeNotes();
              handleEditCall(selectedCall);
            }}
          />
        )}
      </Modal>
    </>
  );
}

interface CallCardProps {
  call: DiscoveryCall;
  onView: (call: DiscoveryCall) => void;
  onEdit: (call: DiscoveryCall) => void;
}

function CallCard({ call, onView, onEdit }: CallCardProps) {
  const getStatusColor = (status: DiscoveryCall['status']) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      case 'no_show': return 'orange';
      case 'rescheduled': return 'yellow';
      default: return 'gray';
    }
  };

  const getCallTypeIcon = (type: DiscoveryCall['callType']) => {
    switch (type) {
      case 'initial': return IconPhone;
      case 'follow_up': return IconClock;
      case 'technical': return IconUser;
      case 'closing': return IconCheck;
      default: return IconPhone;
    }
  };

  const CallTypeIcon = getCallTypeIcon(call.callType);

  return (
    <Card withBorder p="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Box flex={1}>
            <Text fw={600} size="sm" lineClamp={1}>
              {call.companyName}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {call.leadName}
            </Text>
          </Box>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => onView(call)}>
                View Details
              </Menu.Item>
              <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => onEdit(call)}>
                Edit Call
              </Menu.Item>
              <Menu.Item leftSection={<IconPhone size={14} />}>
                Start Call
              </Menu.Item>
              <Menu.Item leftSection={<IconCalendar size={14} />}>
                Reschedule
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="sm" color={getStatusColor(call.status)} variant="light">
              <CallTypeIcon size={12} />
            </ThemeIcon>
            <Text size="xs" tt="capitalize">
              {call.callType.replace('_', ' ')}
            </Text>
          </Group>
          <Badge size="sm" color={getStatusColor(call.status)} variant="light">
            {call.status.replace('_', ' ')}
          </Badge>
        </Group>

        <Box>
          <Text size="sm" fw={500}>
            {call.scheduledDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit' 
            })}
          </Text>
          <Text size="xs" c="dimmed">
            {call.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {call.duration} min
          </Text>
        </Box>

        {call.outcome && (
          <Badge size="sm" color={getStatusColor(call.status)} variant="dot">
            {call.outcome.replace('_', ' ')}
          </Badge>
        )}

        {call.followUpTasks && call.followUpTasks.length > 0 && (
          <Box>
            <Text size="xs" fw={600} mb={4}>Follow-up Tasks:</Text>
            <Stack gap={2}>
              {call.followUpTasks.slice(0, 2).map((task) => (
                <Group key={task.id} gap="xs">
                  <ThemeIcon size="xs" color={task.status === 'completed' ? 'green' : 'blue'} variant="light">
                    {task.status === 'completed' ? <IconCheck size={8} /> : <IconClock size={8} />}
                  </ThemeIcon>
                  <Text size="xs" lineClamp={1} flex={1}>
                    {task.title}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
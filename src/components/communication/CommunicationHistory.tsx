'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  Group,
  Text,
  Button,
  Paper,
  Timeline,
  Badge,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  Switch,
  Divider,
  Alert,
  Tabs,
  ScrollArea,
  Card,
  Avatar,
  Tooltip,
  Chip,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDots,
  IconMail,
  IconPhone,
  IconCalendar,
  IconMessage,
  IconNotes,
  IconChecklist,
  IconSchool,
  IconMapPin,
  IconArrowRight,
  IconFilter,
  IconSearch,
  IconClock,
  IconUser,
  IconTag,
} from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  Communication,
  CommunicationType,
  CommunicationDirection,
  CommunicationStatus,
  CommunicationPriority,
  CommunicationFilter,
} from '@/types/communication';
import { communicationService } from '@/lib/services/communicationService';

interface CommunicationHistoryProps {
  customerId?: string;
  showFilters?: boolean;
  maxHeight?: number;
}

export function CommunicationHistory({ 
  customerId, 
  showFilters = true, 
  maxHeight = 600 
}: CommunicationHistoryProps) {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [filterOpened, { toggle: toggleFilter }] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  const [filter, setFilter] = useState<CommunicationFilter>({
    customerId,
  });

  const form = useForm<Omit<Communication, 'id' | 'createdAt' | 'updatedAt'>>({
    initialValues: {
      customerId: customerId || '',
      customerName: '',
      type: CommunicationType.NOTE,
      direction: CommunicationDirection.OUTBOUND,
      subject: '',
      content: '',
      status: CommunicationStatus.COMPLETED,
      priority: CommunicationPriority.MEDIUM,
      createdBy: 'current-user',
      assignedTo: undefined,
      dueDate: undefined,
      completedAt: undefined,
      metadata: {},
      attachments: [],
      tags: [],
    },
    validate: {
      subject: (value) => (value.length < 1 ? 'Subject is required' : null),
      content: (value) => (value.length < 1 ? 'Content is required' : null),
    },
  });

  useEffect(() => {
    loadCommunications();
  }, [filter, customerId]);

  const loadCommunications = async () => {
    setLoading(true);
    try {
      const currentFilter = { ...filter };
      if (customerId) {
        currentFilter.customerId = customerId;
      }
      
      // Apply tab-based filtering
      if (activeTab !== 'all') {
        if (activeTab === 'pending') {
          currentFilter.statuses = [CommunicationStatus.PENDING];
        } else if (activeTab === 'overdue') {
          currentFilter.statuses = [CommunicationStatus.OVERDUE];
        } else {
          currentFilter.types = [activeTab as CommunicationType];
        }
      }

      const data = await communicationService.getCommunications(currentFilter);
      setCommunications(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load communications',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    form.reset();
    if (customerId) {
      form.setFieldValue('customerId', customerId);
    }
    setSelectedCommunication(null);
    setIsEditing(false);
    openModal();
  };

  const handleEdit = (communication: Communication) => {
    form.setValues({
      customerId: communication.customerId,
      customerName: communication.customerName,
      type: communication.type,
      direction: communication.direction,
      subject: communication.subject,
      content: communication.content,
      status: communication.status,
      priority: communication.priority,
      createdBy: communication.createdBy,
      assignedTo: communication.assignedTo,
      dueDate: communication.dueDate,
      completedAt: communication.completedAt,
      metadata: communication.metadata || {},
      attachments: communication.attachments || [],
      tags: communication.tags || [],
    });
    setSelectedCommunication(communication);
    setIsEditing(true);
    openModal();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (isEditing && selectedCommunication) {
        await communicationService.updateCommunication(selectedCommunication.id, values);
        notifications.show({
          title: 'Success',
          message: 'Communication updated successfully',
          color: 'green',
        });
      } else {
        await communicationService.createCommunication(values);
        notifications.show({
          title: 'Success',
          message: 'Communication created successfully',
          color: 'green',
        });
      }
      closeModal();
      loadCommunications();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save communication',
        color: 'red',
      });
    }
  };

  const handleDelete = async (communication: Communication) => {
    try {
      await communicationService.deleteCommunication(communication.id);
      notifications.show({
        title: 'Success',
        message: 'Communication deleted successfully',
        color: 'green',
      });
      loadCommunications();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete communication',
        color: 'red',
      });
    }
  };

  const getTypeIcon = (type: CommunicationType) => {
    switch (type) {
      case CommunicationType.EMAIL:
        return <IconMail size={16} />;
      case CommunicationType.PHONE_CALL:
        return <IconPhone size={16} />;
      case CommunicationType.MEETING:
        return <IconCalendar size={16} />;
      case CommunicationType.SMS:
        return <IconMessage size={16} />;
      case CommunicationType.NOTE:
        return <IconNotes size={16} />;
      case CommunicationType.TASK:
        return <IconChecklist size={16} />;
      case CommunicationType.TRAINING:
        return <IconSchool size={16} />;
      case CommunicationType.VISIT:
        return <IconMapPin size={16} />;
      case CommunicationType.FOLLOW_UP:
        return <IconArrowRight size={16} />;
      default:
        return <IconNotes size={16} />;
    }
  };

  const getTypeColor = (type: CommunicationType) => {
    switch (type) {
      case CommunicationType.EMAIL:
        return 'blue';
      case CommunicationType.PHONE_CALL:
        return 'green';
      case CommunicationType.MEETING:
        return 'purple';
      case CommunicationType.SMS:
        return 'cyan';
      case CommunicationType.NOTE:
        return 'gray';
      case CommunicationType.TASK:
        return 'orange';
      case CommunicationType.TRAINING:
        return 'teal';
      case CommunicationType.VISIT:
        return 'red';
      case CommunicationType.FOLLOW_UP:
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: CommunicationStatus) => {
    switch (status) {
      case CommunicationStatus.PENDING:
        return 'yellow';
      case CommunicationStatus.IN_PROGRESS:
        return 'blue';
      case CommunicationStatus.COMPLETED:
        return 'green';
      case CommunicationStatus.CANCELLED:
        return 'gray';
      case CommunicationStatus.OVERDUE:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: CommunicationPriority) => {
    switch (priority) {
      case CommunicationPriority.LOW:
        return 'gray';
      case CommunicationPriority.MEDIUM:
        return 'blue';
      case CommunicationPriority.HIGH:
        return 'orange';
      case CommunicationPriority.URGENT:
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const renderFilters = () => (
    <Paper p="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Text fw={500}>Filters</Text>
        <Button size="xs" variant="light" onClick={() => setFilter({ customerId })}>
          Clear All
        </Button>
      </Group>
      
      <Stack gap="sm">
        <TextInput
          placeholder="Search communications..."
          leftSection={<IconSearch size={16} />}
          value={filter.searchQuery || ''}
          onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.currentTarget.value }))}
        />
        
        <Group grow>
          <MultiSelect
            label="Types"
            placeholder="Select types"
            data={Object.values(CommunicationType).map(type => ({
              value: type,
              label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            }))}
            value={filter.types || []}
            onChange={(value) => setFilter(prev => ({ ...prev, types: value as CommunicationType[] }))}
          />
          
          <MultiSelect
            label="Status"
            placeholder="Select status"
            data={Object.values(CommunicationStatus).map(status => ({
              value: status,
              label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            }))}
            value={filter.statuses || []}
            onChange={(value) => setFilter(prev => ({ ...prev, statuses: value as CommunicationStatus[] }))}
          />
        </Group>
        
        <Group grow>
          <DatePickerInput
            label="From Date"
            placeholder="Select start date"
            value={filter.dateRange?.start}
            onChange={(value) => setFilter(prev => ({
              ...prev,
              dateRange: { 
                start: value ? new Date(value) : new Date(),
                end: prev.dateRange?.end || new Date()
              }
            }))}
          />
          
          <DatePickerInput
            label="To Date"
            placeholder="Select end date"
            value={filter.dateRange?.end}
            onChange={(value) => setFilter(prev => ({
              ...prev,
              dateRange: { 
                start: prev.dateRange?.start || new Date(),
                end: value ? new Date(value) : new Date()
              }
            }))}
          />
        </Group>
      </Stack>
    </Paper>
  );

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl" fw={600}>Communication History</Text>
        <Group>
          {showFilters && (
            <ActionIcon
              variant="light"
              onClick={toggleFilter}
              color={filterOpened ? 'blue' : 'gray'}
            >
              <IconFilter size={16} />
            </ActionIcon>
          )}
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
            Add Communication
          </Button>
        </Group>
      </Group>

      {showFilters && filterOpened && renderFilters()}

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'all')}>
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="overdue">Overdue</Tabs.Tab>
          <Tabs.Tab value={CommunicationType.EMAIL}>Email</Tabs.Tab>
          <Tabs.Tab value={CommunicationType.PHONE_CALL}>Calls</Tabs.Tab>
          <Tabs.Tab value={CommunicationType.MEETING}>Meetings</Tabs.Tab>
          <Tabs.Tab value={CommunicationType.TRAINING}>Training</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <ScrollArea style={{ height: maxHeight }}>
        <Timeline active={-1} bulletSize={24} lineWidth={2}>
          {communications.map((communication) => (
            <Timeline.Item
              key={communication.id}
              bullet={getTypeIcon(communication.type)}
              title={
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Group gap="xs" mb="xs">
                      <Badge
                        color={getTypeColor(communication.type)}
                        variant="light"
                        size="sm"
                      >
                        {communication.type.replace('_', ' ')}
                      </Badge>
                      <Badge
                        color={getStatusColor(communication.status)}
                        variant="light"
                        size="sm"
                      >
                        {communication.status}
                      </Badge>
                      <Badge
                        color={getPriorityColor(communication.priority)}
                        variant="light"
                        size="sm"
                      >
                        {communication.priority}
                      </Badge>
                    </Group>
                    
                    <Text fw={500} mb="xs">{communication.subject}</Text>
                    <Text size="sm" c="dimmed" mb="xs" lineClamp={2}>
                      {communication.content}
                    </Text>
                    
                    <Group gap="xs" mb="xs">
                      <Group gap={4}>
                        <IconUser size={12} />
                        <Text size="xs" c="dimmed">{communication.customerName}</Text>
                      </Group>
                      <Group gap={4}>
                        <IconClock size={12} />
                        <Text size="xs" c="dimmed">{formatTimeAgo(communication.createdAt)}</Text>
                      </Group>
                    </Group>
                    
                    {communication.tags && communication.tags.length > 0 && (
                      <Group gap="xs">
                        {communication.tags.map((tag) => (
                          <Chip key={tag} size="xs" variant="light">
                            {tag}
                          </Chip>
                        ))}
                      </Group>
                    )}
                  </div>
                  
                  <Menu position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" size="sm">
                        <IconDots size={14} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        onClick={() => handleEdit(communication)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        onClick={() => handleDelete(communication)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              }
            />
          ))}
        </Timeline>
        
        {communications.length === 0 && (
          <Paper p="xl" ta="center">
            <Text c="dimmed">No communications found</Text>
          </Paper>
        )}
      </ScrollArea>

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={isEditing ? 'Edit Communication' : 'Add Communication'}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Group grow>
              <Select
                label="Type"
                data={Object.values(CommunicationType).map(type => ({
                  value: type,
                  label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                }))}
                {...form.getInputProps('type')}
              />
              <Select
                label="Direction"
                data={Object.values(CommunicationDirection).map(dir => ({
                  value: dir,
                  label: dir.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                }))}
                {...form.getInputProps('direction')}
              />
            </Group>

            <TextInput
              label="Subject"
              placeholder="Enter communication subject"
              {...form.getInputProps('subject')}
            />

            <Textarea
              label="Content"
              placeholder="Enter communication details"
              minRows={4}
              {...form.getInputProps('content')}
            />

            <Group grow>
              <Select
                label="Status"
                data={Object.values(CommunicationStatus).map(status => ({
                  value: status,
                  label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                }))}
                {...form.getInputProps('status')}
              />
              <Select
                label="Priority"
                data={Object.values(CommunicationPriority).map(priority => ({
                  value: priority,
                  label: priority.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                }))}
                {...form.getInputProps('priority')}
              />
            </Group>

            <DatePickerInput
              label="Due Date (Optional)"
              placeholder="Select due date"
              {...form.getInputProps('dueDate')}
            />

            <MultiSelect
              label="Tags"
              placeholder="Add tags"
              data={[]}
              searchable
              {...form.getInputProps('tags')}
            />

            <Divider />

            <Group justify="flex-end">
              <Button variant="light" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Communication' : 'Add Communication'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
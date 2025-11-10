'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Timeline,
  Text,
  Badge,
  ThemeIcon,
  Stack,
  ActionIcon,
  Menu,
  rem,
  Pagination,
  Modal,
  Textarea,
  NumberInput,
  MultiSelect,
  Divider,
  Alert,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  IconSearch,
  IconPlus,
  IconPhone,
  IconMail,
  IconCalendar,
  IconSchool,
  IconNotes,
  IconDots,
  IconEdit,
  IconTrash,
  IconFilter,
  IconClock,
  IconUser,
  IconInfoCircle,
} from '@tabler/icons-react';
import { ActivitySearchFilters, type ActivitySearchCriteria } from './ActivitySearchFilters';

export interface Activity {
  id: string;
  customerId: string;
  customerName?: string;
  type: 'call' | 'email' | 'meeting' | 'training' | 'note' | 'system' | 'visit' | 'quote' | 'order';
  title: string;
  description: string;
  date: Date;
  duration?: number; // in minutes
  outcome: 'positive' | 'negative' | 'neutral' | 'completed' | 'pending' | 'cancelled';
  participants?: string[];
  followUpRequired?: boolean;
  followUpDate?: Date;
  tags?: string[];
  category?: 'sales' | 'support' | 'training' | 'administrative' | 'technical' | 'marketing';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  source: 'manual' | 'automatic' | 'system' | 'integration';
  relatedRecords?: {
    type: 'lead' | 'opportunity' | 'order' | 'quote' | 'training';
    id: string;
    name: string;
  }[];
  location?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ActivityTimelineProps {
  customerId?: string;
  activities: Activity[];
  onActivityCreate?: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onActivityUpdate?: (id: string, activity: Partial<Activity>) => void;
  onActivityDelete?: (id: string) => void;
  showCustomerFilter?: boolean;
  showAdvancedSearch?: boolean;
  availableTags?: string[];
  availableParticipants?: string[];
  availableCustomers?: { value: string; label: string }[];
  availableUsers?: { value: string; label: string }[];
}

const ITEMS_PER_PAGE = 15;

const activityTemplates = [
  {
    type: 'call' as const,
    title: 'Discovery Call',
    description: 'Initial discovery call to understand customer needs and requirements.',
    duration: 30,
    tags: ['discovery', 'initial-contact'],
    category: 'sales' as const,
    priority: 'high' as const,
  },
  {
    type: 'call' as const,
    title: 'Follow-up Call',
    description: 'Follow-up call to discuss proposal and answer questions.',
    duration: 20,
    tags: ['follow-up', 'proposal'],
    category: 'sales' as const,
    priority: 'medium' as const,
  },
  {
    type: 'email' as const,
    title: 'Product Information Sent',
    description: 'Sent product brochures and technical specifications.',
    tags: ['product-info', 'documentation'],
    category: 'marketing' as const,
    priority: 'low' as const,
  },
  {
    type: 'meeting' as const,
    title: 'On-site Consultation',
    description: 'On-site visit to assess installation requirements and provide consultation.',
    duration: 120,
    tags: ['on-site', 'consultation'],
    category: 'sales' as const,
    priority: 'high' as const,
  },
  {
    type: 'visit' as const,
    title: 'Customer Site Visit',
    description: 'Scheduled visit to customer location for assessment or service.',
    duration: 90,
    tags: ['site-visit', 'assessment'],
    category: 'technical' as const,
    priority: 'medium' as const,
  },
  {
    type: 'training' as const,
    title: 'Product Training Session',
    description: 'Training session on product installation and maintenance.',
    duration: 240,
    tags: ['training', 'installation'],
    category: 'training' as const,
    priority: 'medium' as const,
  },
  {
    type: 'quote' as const,
    title: 'Quote Preparation',
    description: 'Prepared and sent detailed quote for customer requirements.',
    tags: ['quote', 'pricing'],
    category: 'sales' as const,
    priority: 'high' as const,
  },
  {
    type: 'order' as const,
    title: 'Order Processing',
    description: 'Processed customer order and initiated fulfillment.',
    tags: ['order', 'fulfillment'],
    category: 'administrative' as const,
    priority: 'high' as const,
  },
  {
    type: 'note' as const,
    title: 'Customer Feedback',
    description: 'Customer provided feedback on service or product experience.',
    tags: ['feedback', 'customer-satisfaction'],
    category: 'support' as const,
    priority: 'medium' as const,
  },
];

export function ActivityTimeline({
  customerId,
  activities,
  onActivityCreate,
  onActivityUpdate,
  onActivityDelete,
  showCustomerFilter = false,
  showAdvancedSearch = false,
  availableTags = [],
  availableParticipants = [],
  availableCustomers = [],
  availableUsers = [],
}: ActivityTimelineProps) {
  const [searchCriteria, setSearchCriteria] = useState<ActivitySearchCriteria>({
    searchQuery: '',
    activityTypes: [],
    outcomes: [],
    categories: [],
    priorities: [],
    sources: [],
    dateRange: { start: null, end: null },
    durationRange: { min: null, max: null },
    tags: [],
    participants: [],
    customers: [],
    createdBy: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof activityTemplates[0] | null>(null);
  
  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const createForm = useForm({
    initialValues: {
      type: 'call' as Activity['type'],
      title: '',
      description: '',
      date: new Date(),
      duration: 30,
      outcome: 'neutral' as Activity['outcome'],
      participants: [] as string[],
      followUpRequired: false,
      followUpDate: undefined as Date | undefined,
      tags: [] as string[],
      category: 'sales' as Activity['category'],
      priority: 'medium' as Activity['priority'],
      location: '',
      source: 'manual' as Activity['source'],
    },
  });

  // Filter activities based on search criteria
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (customerId && activity.customerId !== customerId) return false;

      // Text search
      const matchesSearch = !searchCriteria.searchQuery || 
        activity.title.toLowerCase().includes(searchCriteria.searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchCriteria.searchQuery.toLowerCase()) ||
        activity.tags?.some(tag => tag.toLowerCase().includes(searchCriteria.searchQuery.toLowerCase())) ||
        activity.customerName?.toLowerCase().includes(searchCriteria.searchQuery.toLowerCase());

      // Activity types
      const matchesType = searchCriteria.activityTypes.length === 0 || 
        searchCriteria.activityTypes.includes(activity.type);

      // Outcomes
      const matchesOutcome = searchCriteria.outcomes.length === 0 || 
        searchCriteria.outcomes.includes(activity.outcome);

      // Categories
      const matchesCategory = searchCriteria.categories.length === 0 || 
        (activity.category && searchCriteria.categories.includes(activity.category));

      // Priorities
      const matchesPriority = searchCriteria.priorities.length === 0 || 
        (activity.priority && searchCriteria.priorities.includes(activity.priority));

      // Sources
      const matchesSource = searchCriteria.sources.length === 0 || 
        searchCriteria.sources.includes(activity.source);

      // Date range
      let matchesDateRange = true;
      if (searchCriteria.dateRange.start || searchCriteria.dateRange.end) {
        const activityDate = new Date(activity.date);
        if (searchCriteria.dateRange.start) {
          matchesDateRange = matchesDateRange && activityDate >= searchCriteria.dateRange.start;
        }
        if (searchCriteria.dateRange.end) {
          const endDate = new Date(searchCriteria.dateRange.end);
          endDate.setHours(23, 59, 59, 999); // Include the entire end date
          matchesDateRange = matchesDateRange && activityDate <= endDate;
        }
      }

      // Duration range
      let matchesDuration = true;
      if (searchCriteria.durationRange.min !== null || searchCriteria.durationRange.max !== null) {
        const duration = activity.duration || 0;
        if (searchCriteria.durationRange.min !== null) {
          matchesDuration = matchesDuration && duration >= searchCriteria.durationRange.min;
        }
        if (searchCriteria.durationRange.max !== null) {
          matchesDuration = matchesDuration && duration <= searchCriteria.durationRange.max;
        }
      }

      // Tags
      const matchesTags = searchCriteria.tags.length === 0 || 
        (activity.tags && searchCriteria.tags.some(tag => activity.tags!.includes(tag)));

      // Participants
      const matchesParticipants = searchCriteria.participants.length === 0 || 
        (activity.participants && searchCriteria.participants.some(participant => 
          activity.participants!.includes(participant)));

      // Customers (for global view)
      const matchesCustomers = searchCriteria.customers.length === 0 || 
        searchCriteria.customers.includes(activity.customerId);

      // Follow-up required
      const matchesFollowUp = searchCriteria.followUpRequired === undefined || 
        activity.followUpRequired === searchCriteria.followUpRequired;

      // Has participants
      const matchesHasParticipants = searchCriteria.hasParticipants === undefined || 
        (searchCriteria.hasParticipants ? 
          (activity.participants && activity.participants.length > 0) : 
          (!activity.participants || activity.participants.length === 0));

      // Has tags
      const matchesHasTags = searchCriteria.hasTags === undefined || 
        (searchCriteria.hasTags ? 
          (activity.tags && activity.tags.length > 0) : 
          (!activity.tags || activity.tags.length === 0));

      return matchesSearch && matchesType && matchesOutcome && matchesCategory && 
             matchesPriority && matchesSource && matchesDateRange && matchesDuration && 
             matchesTags && matchesParticipants && matchesCustomers && matchesFollowUp && 
             matchesHasParticipants && matchesHasTags;
    });
  }, [activities, customerId, searchCriteria]);

  // Sort activities by date (newest first)
  const sortedActivities = useMemo(() => {
    return [...filteredActivities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredActivities]);

  // Paginate results
  const totalPages = Math.ceil(sortedActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = sortedActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <IconPhone size={16} />;
      case 'email':
        return <IconMail size={16} />;
      case 'meeting':
        return <IconCalendar size={16} />;
      case 'training':
        return <IconSchool size={16} />;
      case 'note':
        return <IconNotes size={16} />;
      case 'system':
        return <IconInfoCircle size={16} />;
      case 'visit':
        return <IconUser size={16} />;
      case 'quote':
        return <IconNotes size={16} />;
      case 'order':
        return <IconCalendar size={16} />;
      default:
        return <IconCalendar size={16} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'blue';
      case 'email':
        return 'green';
      case 'meeting':
        return 'orange';
      case 'training':
        return 'violet';
      case 'note':
        return 'gray';
      case 'system':
        return 'cyan';
      case 'visit':
        return 'teal';
      case 'quote':
        return 'yellow';
      case 'order':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    const colors = {
      positive: 'green',
      negative: 'red',
      neutral: 'gray',
      completed: 'blue',
      pending: 'yellow',
      cancelled: 'orange',
    };

    const labels = {
      positive: 'Positive',
      negative: 'Negative',
      neutral: 'Neutral',
      completed: 'Completed',
      pending: 'Pending',
      cancelled: 'Cancelled',
    };

    return (
      <Badge color={colors[outcome as keyof typeof colors]} variant="light" size="sm">
        {labels[outcome as keyof typeof labels]}
      </Badge>
    );
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

  const handleTemplateSelect = (template: typeof activityTemplates[0]) => {
    setSelectedTemplate(template);
    createForm.setValues({
      type: template.type,
      title: template.title,
      description: template.description,
      duration: template.duration || 30,
      tags: template.tags || [],
      category: template.category,
      priority: template.priority,
      date: new Date(),
      outcome: 'neutral',
      participants: [],
      followUpRequired: false,
      followUpDate: undefined,
      location: '',
      source: 'manual',
    });
    openCreateModal();
  };

  const handleCreateActivity = (values: typeof createForm.values) => {
    if (onActivityCreate) {
      onActivityCreate({
        customerId: customerId || '',
        type: values.type,
        title: values.title,
        description: values.description,
        date: values.date,
        duration: values.duration,
        outcome: values.outcome,
        participants: values.participants,
        followUpRequired: values.followUpRequired,
        followUpDate: values.followUpDate,
        tags: values.tags,
        category: values.category,
        priority: values.priority,
        location: values.location,
        source: values.source,
        createdBy: 'current-user', // In real app, get from auth context
      });
    }
    closeCreateModal();
    createForm.reset();
    setSelectedTemplate(null);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    createForm.setValues({
      type: activity.type,
      title: activity.title,
      description: activity.description,
      date: activity.date,
      duration: activity.duration || 30,
      outcome: activity.outcome,
      participants: activity.participants || [],
      followUpRequired: activity.followUpRequired || false,
      followUpDate: activity.followUpDate,
      tags: activity.tags || [],
      category: activity.category || 'sales',
      priority: activity.priority || 'medium',
      location: activity.location || '',
      source: activity.source || 'manual',
    });
    openCreateModal();
  };

  const handleUpdateActivity = (values: typeof createForm.values) => {
    if (editingActivity && onActivityUpdate) {
      onActivityUpdate(editingActivity.id, {
        type: values.type,
        title: values.title,
        description: values.description,
        date: values.date,
        duration: values.duration,
        outcome: values.outcome,
        participants: values.participants,
        followUpRequired: values.followUpRequired,
        followUpDate: values.followUpDate,
        tags: values.tags,
        category: values.category,
        priority: values.priority,
        location: values.location,
        source: values.source,
        updatedAt: new Date(),
      });
    }
    closeCreateModal();
    createForm.reset();
    setEditingActivity(null);
  };

  const handleDeleteActivity = (activityId: string) => {
    if (onActivityDelete) {
      onActivityDelete(activityId);
    }
  };

  const handleSearch = (criteria: ActivitySearchCriteria) => {
    setSearchCriteria(criteria);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleResetSearch = () => {
    setSearchCriteria({
      searchQuery: '',
      activityTypes: [],
      outcomes: [],
      categories: [],
      priorities: [],
      sources: [],
      dateRange: { start: null, end: null },
      durationRange: { min: null, max: null },
      tags: [],
      participants: [],
      customers: [],
      createdBy: [],
    });
    setCurrentPage(1);
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Card withBorder p="md">
        <Group justify="space-between" mb="md">
          <Title order={3}>Activity Timeline</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
            Log Activity
          </Button>
        </Group>

        {/* Activity Templates */}
        <div>
          <Text size="sm" fw={500} mb="xs">Quick Templates:</Text>
          <Group gap="xs">
            {activityTemplates.map((template, index) => (
              <Button
                key={index}
                variant="light"
                size="xs"
                leftSection={getActivityIcon(template.type)}
                onClick={() => handleTemplateSelect(template)}
              >
                {template.title}
              </Button>
            ))}
          </Group>
        </div>
      </Card>

      {/* Advanced Search Filters */}
      {showAdvancedSearch && (
        <ActivitySearchFilters
          onSearch={handleSearch}
          onReset={handleResetSearch}
          availableTags={availableTags}
          availableParticipants={availableParticipants}
          availableCustomers={availableCustomers}
          availableUsers={availableUsers}
          initialCriteria={searchCriteria}
        />
      )}

      {/* Results Summary */}
      <Text size="sm" c="dimmed">
        Showing {paginatedActivities.length} of {sortedActivities.length} activities
      </Text>

      {/* Activities Timeline */}
      <Card withBorder p="lg">
        {paginatedActivities.length > 0 ? (
          <Timeline active={-1} bulletSize={32} lineWidth={2}>
            {paginatedActivities.map((activity) => (
              <Timeline.Item
                key={activity.id}
                bullet={
                  <ThemeIcon
                    color={getActivityColor(activity.type)}
                    variant="light"
                    size={32}
                    radius="xl"
                  >
                    {getActivityIcon(activity.type)}
                  </ThemeIcon>
                }
                title={
                  <Group justify="space-between">
                    <Group gap="sm">
                      <Text fw={500}>{activity.title}</Text>
                      {getOutcomeBadge(activity.outcome)}
                      {activity.category && (
                        <Badge variant="dot" size="sm" color="blue">
                          {activity.category}
                        </Badge>
                      )}
                      {activity.priority && activity.priority !== 'medium' && (
                        <Badge 
                          variant="filled" 
                          size="sm" 
                          color={activity.priority === 'urgent' ? 'red' : activity.priority === 'high' ? 'orange' : 'gray'}
                        >
                          {activity.priority}
                        </Badge>
                      )}
                      {activity.duration && (
                        <Badge variant="outline" size="sm">
                          <IconClock size={12} style={{ marginRight: 4 }} />
                          {formatDuration(activity.duration)}
                        </Badge>
                      )}
                      {activity.followUpRequired && (
                        <Badge color="yellow" variant="light" size="sm">
                          Follow-up Required
                        </Badge>
                      )}
                      {activity.source === 'automatic' && (
                        <Badge color="cyan" variant="light" size="sm">
                          Auto-logged
                        </Badge>
                      )}
                    </Group>
                    <Menu position="bottom-end">
                      <Menu.Target>
                        <ActionIcon variant="subtle" size="sm">
                          <IconDots size={14} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                          onClick={() => handleEditActivity(activity)}
                        >
                          Edit Activity
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                          color="red"
                          onClick={() => handleDeleteActivity(activity.id)}
                        >
                          Delete Activity
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                }
              >
                <Text c="dimmed" size="sm" mb="xs">
                  {activity.description}
                </Text>
                
                {activity.tags && activity.tags.length > 0 && (
                  <Group gap="xs" mb="xs">
                    {activity.tags.map((tag, index) => (
                      <Badge key={index} variant="dot" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                )}

                <Group gap="md" mb="xs">
                  {activity.participants && activity.participants.length > 0 && (
                    <Group gap="xs">
                      <IconUser size={12} />
                      <Text size="xs" c="dimmed">
                        Participants: {activity.participants.join(', ')}
                      </Text>
                    </Group>
                  )}
                  {activity.location && (
                    <Group gap="xs">
                      <IconCalendar size={12} />
                      <Text size="xs" c="dimmed">
                        Location: {activity.location}
                      </Text>
                    </Group>
                  )}
                  {!customerId && activity.customerName && (
                    <Group gap="xs">
                      <IconUser size={12} />
                      <Text size="xs" c="dimmed">
                        Customer: {activity.customerName}
                      </Text>
                    </Group>
                  )}
                </Group>

                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    {formatDate(activity.date)}
                  </Text>
                  {activity.followUpDate && (
                    <Text size="xs" c="orange">
                      Follow-up: {formatDate(activity.followUpDate)}
                    </Text>
                  )}
                </Group>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Alert icon={<IconInfoCircle size={16} />} title="No Activities Found">
            {searchCriteria.searchQuery || 
             searchCriteria.activityTypes.length > 0 || 
             searchCriteria.outcomes.length > 0 || 
             searchCriteria.dateRange.start || 
             searchCriteria.dateRange.end
              ? 'No activities match your current filters. Try adjusting your search criteria.'
              : 'No activities have been logged yet. Use the templates above or click "Log Activity" to get started.'
            }
          </Alert>
        )}
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

      {/* Create/Edit Activity Modal */}
      <Modal
        opened={createModalOpened}
        onClose={() => {
          closeCreateModal();
          createForm.reset();
          setEditingActivity(null);
          setSelectedTemplate(null);
        }}
        title={editingActivity ? 'Edit Activity' : 'Log New Activity'}
        size="lg"
      >
        <form onSubmit={createForm.onSubmit(editingActivity ? handleUpdateActivity : handleCreateActivity)}>
          <Stack gap="md">
            <Group grow>
              <Select
                label="Activity Type"
                placeholder="Select type"
                data={[
                  { value: 'call', label: 'Phone Call' },
                  { value: 'email', label: 'Email' },
                  { value: 'meeting', label: 'Meeting' },
                  { value: 'training', label: 'Training' },
                  { value: 'visit', label: 'Site Visit' },
                  { value: 'quote', label: 'Quote' },
                  { value: 'order', label: 'Order' },
                  { value: 'note', label: 'Note' },
                  { value: 'system', label: 'System Activity' },
                ]}
                {...createForm.getInputProps('type')}
                required
              />
              <Select
                label="Category"
                placeholder="Select category"
                data={[
                  { value: 'sales', label: 'Sales' },
                  { value: 'support', label: 'Support' },
                  { value: 'training', label: 'Training' },
                  { value: 'administrative', label: 'Administrative' },
                  { value: 'technical', label: 'Technical' },
                  { value: 'marketing', label: 'Marketing' },
                ]}
                {...createForm.getInputProps('category')}
                required
              />
              <Select
                label="Priority"
                placeholder="Select priority"
                data={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
                {...createForm.getInputProps('priority')}
                required
              />
            </Group>

            <Group grow>
              <Select
                label="Outcome"
                placeholder="Select outcome"
                data={[
                  { value: 'positive', label: 'Positive' },
                  { value: 'negative', label: 'Negative' },
                  { value: 'neutral', label: 'Neutral' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                {...createForm.getInputProps('outcome')}
                required
              />
              <Select
                label="Source"
                placeholder="Select source"
                data={[
                  { value: 'manual', label: 'Manual Entry' },
                  { value: 'automatic', label: 'Automatic' },
                  { value: 'system', label: 'System Generated' },
                  { value: 'integration', label: 'Integration' },
                ]}
                {...createForm.getInputProps('source')}
                required
              />
            </Group>

            <TextInput
              label="Title"
              placeholder="Activity title"
              {...createForm.getInputProps('title')}
              required
            />

            <Textarea
              label="Description"
              placeholder="Describe the activity..."
              minRows={3}
              {...createForm.getInputProps('description')}
              required
            />

            <Group grow>
              <DateTimePicker
                label="Date & Time"
                placeholder="Select date and time"
                {...createForm.getInputProps('date')}
                required
              />
              <NumberInput
                label="Duration (minutes)"
                placeholder="30"
                min={0}
                {...createForm.getInputProps('duration')}
              />
            </Group>

            <Group grow>
              <MultiSelect
                label="Participants"
                placeholder="Add participants"
                data={[]} // In real app, this would be populated with user data
                {...createForm.getInputProps('participants')}
              />
              <TextInput
                label="Location"
                placeholder="Meeting location or address"
                {...createForm.getInputProps('location')}
              />
            </Group>

            <MultiSelect
              label="Tags"
              placeholder="Add tags"
              data={[
                'discovery', 'follow-up', 'proposal', 'product-info',
                'consultation', 'training', 'feedback', 'support',
                'installation', 'maintenance', 'quote', 'order',
                'site-visit', 'assessment', 'technical-support'
              ]}
              {...createForm.getInputProps('tags')}
            />

            <Divider />

            <Group>
              <input
                type="checkbox"
                {...createForm.getInputProps('followUpRequired', { type: 'checkbox' })}
              />
              <Text size="sm">Follow-up required</Text>
            </Group>

            {createForm.values.followUpRequired && (
              <DateTimePicker
                label="Follow-up Date"
                placeholder="Select follow-up date"
                {...createForm.getInputProps('followUpDate')}
              />
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => {
                closeCreateModal();
                createForm.reset();
                setEditingActivity(null);
                setSelectedTemplate(null);
              }}>
                Cancel
              </Button>
              <Button type="submit">
                {editingActivity ? 'Update Activity' : 'Log Activity'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
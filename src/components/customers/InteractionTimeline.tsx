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
  Tabs,
  Paper,
  Grid,
  Checkbox,
  Anchor,
  Box,
  Progress,
  RingProgress,
  SegmentedControl,
} from '@mantine/core';
import { DateTimePicker, DatePickerInput } from '@mantine/dates';
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
  IconMapPin,
  IconVideo,
  IconFileText,
  IconMessage,
  IconShoppingCart,
  IconAlertTriangle,
  IconEye,
  IconTag,
  IconSortDescending,
  IconSortAscending,
  IconRefresh,
  IconDownload,
  IconShare,
  IconStar,
  IconChartBar,
  IconCalendarStats,
  IconBulb,
  IconTarget,
  IconFlag,
} from '@tabler/icons-react';

export interface Interaction {
  id: string;
  customerId: string;
  type: 'call' | 'email' | 'meeting' | 'training' | 'note' | 'order' | 'quote' | 'visit' | 'support' | 'system';
  category: 'sales' | 'support' | 'training' | 'administrative' | 'marketing' | 'technical';
  title: string;
  description: string;
  date: Date;
  duration?: number; // in minutes
  outcome: 'positive' | 'negative' | 'neutral' | 'completed' | 'pending' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  participants?: string[];
  followUpRequired?: boolean;
  followUpDate?: Date;
  tags?: string[];
  attachments?: string[];
  relatedRecords?: {
    type: 'order' | 'quote' | 'training' | 'document';
    id: string;
    title: string;
  }[];
  location?: string;
  channel: 'phone' | 'email' | 'in-person' | 'video' | 'chat' | 'system' | 'mobile';
  sentiment?: 'positive' | 'negative' | 'neutral';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InteractionTimelineProps {
  customerId?: string;
  interactions: Interaction[];
  onInteractionCreate?: (interaction: Omit<Interaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onInteractionUpdate?: (id: string, interaction: Partial<Interaction>) => void;
  onInteractionDelete?: (id: string) => void;
  showAdvancedFilters?: boolean;
}

const ITEMS_PER_PAGE = 20;

const interactionTemplates = [
  {
    type: 'call' as const,
    category: 'sales' as const,
    title: 'Discovery Call',
    description: 'Initial discovery call to understand customer needs and requirements.',
    duration: 30,
    tags: ['discovery', 'initial-contact'],
    channel: 'phone' as const,
  },
  {
    type: 'email' as const,
    category: 'sales' as const,
    title: 'Product Information Sent',
    description: 'Sent product brochures and technical specifications.',
    tags: ['product-info', 'documentation'],
    channel: 'email' as const,
  },
  {
    type: 'meeting' as const,
    category: 'sales' as const,
    title: 'On-site Consultation',
    description: 'On-site visit to assess installation requirements and provide consultation.',
    duration: 120,
    tags: ['on-site', 'consultation'],
    channel: 'in-person' as const,
  },
  {
    type: 'training' as const,
    category: 'training' as const,
    title: 'Product Training Session',
    description: 'Training session on product installation and maintenance.',
    duration: 240,
    tags: ['training', 'installation'],
    channel: 'in-person' as const,
  },
  {
    type: 'support' as const,
    category: 'support' as const,
    title: 'Technical Support Call',
    description: 'Customer called for technical support and troubleshooting.',
    duration: 20,
    tags: ['support', 'troubleshooting'],
    channel: 'phone' as const,
  },
  {
    type: 'note' as const,
    category: 'administrative' as const,
    title: 'Customer Feedback',
    description: 'Customer provided feedback on service or product experience.',
    tags: ['feedback', 'customer-satisfaction'],
    channel: 'system' as const,
  },
];

export function InteractionTimeline({
  customerId,
  interactions,
  onInteractionCreate,
  onInteractionUpdate,
  onInteractionDelete,
  showAdvancedFilters = true,
}: InteractionTimelineProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [outcomeFilter, setOutcomeFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [channelFilter, setChannelFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [dateRangeFilter, setDateRangeFilter] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof interactionTemplates[0] | null>(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [viewMode, setViewMode] = useState<'detailed' | 'compact' | 'cards'>('detailed');
  const [groupBy, setGroupBy] = useState<'none' | 'date' | 'type' | 'category'>('none');
  
  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);
  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(false);
  const [analyticsOpened, { toggle: toggleAnalytics }] = useDisclosure(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);

  const createForm = useForm({
    initialValues: {
      type: 'call' as Interaction['type'],
      category: 'sales' as Interaction['category'],
      title: '',
      description: '',
      date: new Date(),
      duration: 30,
      outcome: 'neutral' as Interaction['outcome'],
      priority: 'medium' as Interaction['priority'],
      participants: [] as string[],
      followUpRequired: false,
      followUpDate: undefined as Date | undefined,
      tags: [] as string[],
      location: '',
      channel: 'phone' as Interaction['channel'],
      sentiment: 'neutral' as Interaction['sentiment'],
    },
  });

  // Get all unique tags from interactions
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    interactions.forEach(interaction => {
      interaction.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [interactions]);

  // Filter interactions
  const filteredInteractions = useMemo(() => {
    return interactions.filter(interaction => {
      if (customerId && interaction.customerId !== customerId) return false;

      const matchesSearch = !searchQuery || 
        interaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interaction.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        interaction.participants?.some(participant => participant.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter.length === 0 || typeFilter.includes(interaction.type);
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(interaction.category);
      const matchesOutcome = outcomeFilter.length === 0 || outcomeFilter.includes(interaction.outcome);
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(interaction.priority);
      const matchesChannel = channelFilter.length === 0 || channelFilter.includes(interaction.channel);
      const matchesTags = tagFilter.length === 0 || tagFilter.some(tag => interaction.tags?.includes(tag));

      let matchesDateRange = true;
      if (dateRangeFilter) {
        const now = new Date();
        const interactionDate = new Date(interaction.date);
        switch (dateRangeFilter) {
          case 'today':
            matchesDateRange = interactionDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDateRange = interactionDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDateRange = interactionDate >= monthAgo;
            break;
          case 'quarter':
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            matchesDateRange = interactionDate >= quarterAgo;
            break;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            matchesDateRange = interactionDate >= yearAgo;
            break;
        }
      }

      if (dateFrom && dateTo) {
        const interactionDate = new Date(interaction.date);
        matchesDateRange = interactionDate >= dateFrom && interactionDate <= dateTo;
      }

      return matchesSearch && matchesType && matchesCategory && matchesOutcome && 
             matchesPriority && matchesChannel && matchesTags && matchesDateRange;
    });
  }, [interactions, customerId, searchQuery, typeFilter, categoryFilter, outcomeFilter, 
      priorityFilter, channelFilter, tagFilter, dateRangeFilter, dateFrom, dateTo]);

  // Sort interactions
  const sortedInteractions = useMemo(() => {
    return [...filteredInteractions].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredInteractions, sortOrder]);

  // Paginate results
  const totalPages = Math.ceil(sortedInteractions.length / ITEMS_PER_PAGE);
  const paginatedInteractions = sortedInteractions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Group interactions by category for summary view
  const interactionsByCategory = useMemo(() => {
    const grouped = filteredInteractions.reduce((acc, interaction) => {
      if (!acc[interaction.category]) {
        acc[interaction.category] = [];
      }
      acc[interaction.category].push(interaction);
      return acc;
    }, {} as Record<string, Interaction[]>);

    return Object.entries(grouped).map(([category, items]) => ({
      category,
      count: items.length,
      recent: items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3),
    }));
  }, [filteredInteractions]);

  // Analytics data
  const analyticsData = useMemo(() => {
    const totalInteractions = filteredInteractions.length;
    const totalDuration = filteredInteractions.reduce((sum, interaction) => sum + (interaction.duration || 0), 0);
    
    // Interaction frequency by type
    const typeFrequency = filteredInteractions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Outcome distribution
    const outcomeDistribution = filteredInteractions.reduce((acc, interaction) => {
      acc[interaction.outcome] = (acc[interaction.outcome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Channel usage
    const channelUsage = filteredInteractions.reduce((acc, interaction) => {
      acc[interaction.channel] = (acc[interaction.channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent activity trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentInteractions = filteredInteractions.filter(
      interaction => new Date(interaction.date) >= thirtyDaysAgo
    );

    // Follow-up required count
    const followUpRequired = filteredInteractions.filter(interaction => interaction.followUpRequired).length;

    // Average response time (mock calculation)
    const avgResponseTime = totalInteractions > 0 ? Math.round(totalDuration / totalInteractions) : 0;

    return {
      totalInteractions,
      totalDuration,
      typeFrequency,
      outcomeDistribution,
      channelUsage,
      recentActivity: recentInteractions.length,
      followUpRequired,
      avgResponseTime,
      positiveInteractions: filteredInteractions.filter(i => i.sentiment === 'positive').length,
      negativeInteractions: filteredInteractions.filter(i => i.sentiment === 'negative').length,
    };
  }, [filteredInteractions]);

  // Group interactions for grouped view
  const groupedInteractions = useMemo(() => {
    if (groupBy === 'none') return { 'All Interactions': sortedInteractions };

    return sortedInteractions.reduce((acc, interaction) => {
      let groupKey = '';
      
      switch (groupBy) {
        case 'date':
          groupKey = new Date(interaction.date).toDateString();
          break;
        case 'type':
          groupKey = interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1);
          break;
        case 'category':
          groupKey = interaction.category.charAt(0).toUpperCase() + interaction.category.slice(1);
          break;
        default:
          groupKey = 'All Interactions';
      }

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(interaction);
      return acc;
    }, {} as Record<string, Interaction[]>);
  }, [sortedInteractions, groupBy]);

  const getInteractionIcon = (type: string) => {
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
      case 'order':
        return <IconShoppingCart size={16} />;
      case 'quote':
        return <IconFileText size={16} />;
      case 'visit':
        return <IconMapPin size={16} />;
      case 'support':
        return <IconAlertTriangle size={16} />;
      case 'system':
        return <IconRefresh size={16} />;
      default:
        return <IconCalendar size={16} />;
    }
  };

  const getInteractionColor = (type: string) => {
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
      case 'order':
        return 'teal';
      case 'quote':
        return 'indigo';
      case 'visit':
        return 'cyan';
      case 'support':
        return 'red';
      case 'system':
        return 'dark';
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
      cancelled: 'red',
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

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'gray',
      medium: 'blue',
      high: 'orange',
      urgent: 'red',
    };

    return (
      <Badge color={colors[priority as keyof typeof colors]} variant="outline" size="xs">
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'phone':
        return <IconPhone size={12} />;
      case 'email':
        return <IconMail size={12} />;
      case 'in-person':
        return <IconUser size={12} />;
      case 'video':
        return <IconVideo size={12} />;
      case 'chat':
        return <IconMessage size={12} />;
      case 'system':
        return <IconRefresh size={12} />;
      case 'mobile':
        return <IconMapPin size={12} />;
      default:
        return <IconCalendar size={12} />;
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

  const clearAllFilters = () => {
    setSearchQuery('');
    setTypeFilter([]);
    setCategoryFilter([]);
    setOutcomeFilter([]);
    setPriorityFilter([]);
    setChannelFilter([]);
    setTagFilter([]);
    setDateRangeFilter(null);
    setDateFrom(null);
    setDateTo(null);
    setCurrentPage(1);
  };

  const handleTemplateSelect = (template: typeof interactionTemplates[0]) => {
    setSelectedTemplate(template);
    createForm.setValues({
      type: template.type,
      category: template.category,
      title: template.title,
      description: template.description,
      duration: template.duration || 30,
      tags: template.tags || [],
      channel: template.channel,
      date: new Date(),
      outcome: 'neutral',
      priority: 'medium',
      participants: [],
      followUpRequired: false,
      followUpDate: undefined,
      location: '',
      sentiment: 'neutral',
    });
    openCreateModal();
  };

  const handleCreateInteraction = (values: typeof createForm.values) => {
    if (onInteractionCreate) {
      onInteractionCreate({
        customerId: customerId || '',
        type: values.type,
        category: values.category,
        title: values.title,
        description: values.description,
        date: values.date,
        duration: values.duration,
        outcome: values.outcome,
        priority: values.priority,
        participants: values.participants,
        followUpRequired: values.followUpRequired,
        followUpDate: values.followUpDate,
        tags: values.tags,
        location: values.location,
        channel: values.channel,
        sentiment: values.sentiment,
        createdBy: 'current-user', // In real app, get from auth context
      });
    }
    closeCreateModal();
    createForm.reset();
    setSelectedTemplate(null);
  };

  const handleEditInteraction = (interaction: Interaction) => {
    setEditingInteraction(interaction);
    createForm.setValues({
      type: interaction.type,
      category: interaction.category,
      title: interaction.title,
      description: interaction.description,
      date: interaction.date,
      duration: interaction.duration || 30,
      outcome: interaction.outcome,
      priority: interaction.priority,
      participants: interaction.participants || [],
      followUpRequired: interaction.followUpRequired || false,
      followUpDate: interaction.followUpDate,
      tags: interaction.tags || [],
      location: interaction.location || '',
      channel: interaction.channel,
      sentiment: interaction.sentiment || 'neutral',
    });
    openCreateModal();
  };

  const handleUpdateInteraction = (values: typeof createForm.values) => {
    if (editingInteraction && onInteractionUpdate) {
      onInteractionUpdate(editingInteraction.id, {
        type: values.type,
        category: values.category,
        title: values.title,
        description: values.description,
        date: values.date,
        duration: values.duration,
        outcome: values.outcome,
        priority: values.priority,
        participants: values.participants,
        followUpRequired: values.followUpRequired,
        followUpDate: values.followUpDate,
        tags: values.tags,
        location: values.location,
        channel: values.channel,
        sentiment: values.sentiment,
        updatedAt: new Date(),
      });
    }
    closeCreateModal();
    createForm.reset();
    setEditingInteraction(null);
  };

  const handleDeleteInteraction = (interactionId: string) => {
    if (onInteractionDelete) {
      onInteractionDelete(interactionId);
    }
  };

  return (
    <Stack gap="lg">
      {/* Header and Quick Filters */}
      <Card withBorder p="md">
        <Group justify="space-between" mb="md">
          <Title order={3}>Customer Interactions</Title>
          <Group>
            <Button 
              variant="light" 
              leftSection={<IconChartBar size={16} />}
              onClick={toggleAnalytics}
            >
              {analyticsOpened ? 'Hide Analytics' : 'Show Analytics'}
            </Button>
            <Button 
              variant="light" 
              leftSection={<IconFilter size={16} />}
              onClick={toggleFilters}
            >
              {filtersOpened ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
              Log Interaction
            </Button>
          </Group>
        </Group>

        {/* Analytics Panel */}
        {analyticsOpened && (
          <Paper p="md" withBorder mb="md">
            <Title order={4} mb="md">Interaction Analytics</Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card withBorder p="sm">
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c="dimmed">Total Interactions</Text>
                      <Text size="xl" fw={700}>{analyticsData.totalInteractions}</Text>
                    </div>
                    <ThemeIcon variant="light" size="lg">
                      <IconCalendarStats size={20} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card withBorder p="sm">
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c="dimmed">Total Duration</Text>
                      <Text size="xl" fw={700}>{formatDuration(analyticsData.totalDuration)}</Text>
                    </div>
                    <ThemeIcon variant="light" size="lg" color="blue">
                      <IconClock size={20} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card withBorder p="sm">
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c="dimmed">Follow-ups Required</Text>
                      <Text size="xl" fw={700} c={analyticsData.followUpRequired > 0 ? 'orange' : 'green'}>
                        {analyticsData.followUpRequired}
                      </Text>
                    </div>
                    <ThemeIcon variant="light" size="lg" color="orange">
                      <IconFlag size={20} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card withBorder p="sm">
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c="dimmed">Positive Sentiment</Text>
                      <Text size="xl" fw={700} c="green">
                        {Math.round((analyticsData.positiveInteractions / analyticsData.totalInteractions) * 100) || 0}%
                      </Text>
                    </div>
                    <RingProgress
                      size={40}
                      thickness={4}
                      sections={[
                        { 
                          value: (analyticsData.positiveInteractions / analyticsData.totalInteractions) * 100 || 0, 
                          color: 'green' 
                        }
                      ]}
                    />
                  </Group>
                </Card>
              </Grid.Col>
            </Grid>

            <Grid mt="md">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text size="sm" fw={500} mb="xs">Interaction Types</Text>
                <Stack gap="xs">
                  {Object.entries(analyticsData.typeFrequency)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([type, count]) => (
                      <Group key={type} justify="space-between">
                        <Group gap="xs">
                          {getInteractionIcon(type)}
                          <Text size="sm" tt="capitalize">{type}</Text>
                        </Group>
                        <Badge variant="light">{count}</Badge>
                      </Group>
                    ))}
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text size="sm" fw={500} mb="xs">Outcomes</Text>
                <Stack gap="xs">
                  {Object.entries(analyticsData.outcomeDistribution)
                    .sort(([,a], [,b]) => b - a)
                    .map(([outcome, count]) => (
                      <Group key={outcome} justify="space-between">
                        <Text size="sm" tt="capitalize">{outcome}</Text>
                        <Group gap="xs">
                          <Progress 
                            value={(count / analyticsData.totalInteractions) * 100} 
                            size="sm" 
                            style={{ width: 60 }}
                          />
                          <Badge variant="light">{count}</Badge>
                        </Group>
                      </Group>
                    ))}
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text size="sm" fw={500} mb="xs">Communication Channels</Text>
                <Stack gap="xs">
                  {Object.entries(analyticsData.channelUsage)
                    .sort(([,a], [,b]) => b - a)
                    .map(([channel, count]) => (
                      <Group key={channel} justify="space-between">
                        <Group gap="xs">
                          {getChannelIcon(channel)}
                          <Text size="sm" tt="capitalize">{channel}</Text>
                        </Group>
                        <Badge variant="light">{count}</Badge>
                      </Group>
                    ))}
                </Stack>
              </Grid.Col>
            </Grid>
          </Paper>
        )}
        
        <Group gap="md" mb="md">
          <TextInput
            placeholder="Search interactions..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Group by"
            data={[
              { value: 'none', label: 'No Grouping' },
              { value: 'date', label: 'By Date' },
              { value: 'type', label: 'By Type' },
              { value: 'category', label: 'By Category' },
            ]}
            value={groupBy}
            onChange={(value) => setGroupBy(value as typeof groupBy)}
            w={140}
          />
          <SegmentedControl
            data={[
              { label: 'Detailed', value: 'detailed' },
              { label: 'Compact', value: 'compact' },
              { label: 'Cards', value: 'cards' },
            ]}
            value={viewMode}
            onChange={(value) => setViewMode(value as typeof viewMode)}
          />
          <ActionIcon
            variant="light"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
          >
            {sortOrder === 'desc' ? <IconSortDescending size={16} /> : <IconSortAscending size={16} />}
          </ActionIcon>
          <Button variant="light" size="sm" onClick={clearAllFilters}>
            Clear Filters
          </Button>
        </Group>

        {/* Advanced Filters */}
        {filtersOpened && showAdvancedFilters && (
          <Paper p="md" withBorder>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <MultiSelect
                  label="Type"
                  placeholder="Select types"
                  data={[
                    { value: 'call', label: 'Phone Call' },
                    { value: 'email', label: 'Email' },
                    { value: 'meeting', label: 'Meeting' },
                    { value: 'training', label: 'Training' },
                    { value: 'note', label: 'Note' },
                    { value: 'order', label: 'Order' },
                    { value: 'quote', label: 'Quote' },
                    { value: 'visit', label: 'Site Visit' },
                    { value: 'support', label: 'Support' },
                    { value: 'system', label: 'System' },
                  ]}
                  value={typeFilter}
                  onChange={setTypeFilter}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <MultiSelect
                  label="Category"
                  placeholder="Select categories"
                  data={[
                    { value: 'sales', label: 'Sales' },
                    { value: 'support', label: 'Support' },
                    { value: 'training', label: 'Training' },
                    { value: 'administrative', label: 'Administrative' },
                    { value: 'marketing', label: 'Marketing' },
                    { value: 'technical', label: 'Technical' },
                  ]}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <MultiSelect
                  label="Outcome"
                  placeholder="Select outcomes"
                  data={[
                    { value: 'positive', label: 'Positive' },
                    { value: 'negative', label: 'Negative' },
                    { value: 'neutral', label: 'Neutral' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                  value={outcomeFilter}
                  onChange={setOutcomeFilter}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <MultiSelect
                  label="Priority"
                  placeholder="Select priorities"
                  data={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <MultiSelect
                  label="Channel"
                  placeholder="Select channels"
                  data={[
                    { value: 'phone', label: 'Phone' },
                    { value: 'email', label: 'Email' },
                    { value: 'in-person', label: 'In Person' },
                    { value: 'video', label: 'Video Call' },
                    { value: 'chat', label: 'Chat' },
                    { value: 'system', label: 'System' },
                    { value: 'mobile', label: 'Mobile App' },
                  ]}
                  value={channelFilter}
                  onChange={setChannelFilter}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <MultiSelect
                  label="Tags"
                  placeholder="Select tags"
                  data={allTags.map(tag => ({ value: tag, label: tag }))}
                  value={tagFilter}
                  onChange={setTagFilter}
                  searchable
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Select
                  label="Date Range"
                  placeholder="Select range"
                  data={[
                    { value: 'today', label: 'Today' },
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' },
                    { value: 'quarter', label: 'This Quarter' },
                    { value: 'year', label: 'This Year' },
                  ]}
                  value={dateRangeFilter}
                  onChange={(value) => setDateRangeFilter(value)}
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <DatePickerInput
                  label="From Date"
                  placeholder="Select start date"
                  value={dateFrom}
                  onChange={(value) => setDateFrom(value ? new Date(value) : null)}
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <DatePickerInput
                  label="To Date"
                  placeholder="Select end date"
                  value={dateTo}
                  onChange={(value) => setDateTo(value ? new Date(value) : null)}
                  clearable
                />
              </Grid.Col>
            </Grid>
          </Paper>
        )}

        {/* Quick Templates */}
        <div>
          <Text size="sm" fw={500} mb="xs">Quick Templates:</Text>
          <Group gap="xs">
            {interactionTemplates.map((template, index) => (
              <Button
                key={index}
                variant="light"
                size="xs"
                leftSection={getInteractionIcon(template.type)}
                onClick={() => handleTemplateSelect(template)}
              >
                {template.title}
              </Button>
            ))}
          </Group>
        </div>
      </Card>

      {/* Results Summary */}
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Showing {paginatedInteractions.length} of {sortedInteractions.length} interactions
        </Text>
        <Group gap="xs">
          <Button variant="subtle" size="xs" leftSection={<IconDownload size={14} />}>
            Export
          </Button>
          <Button variant="subtle" size="xs" leftSection={<IconShare size={14} />}>
            Share
          </Button>
        </Group>
      </Group>

      {/* Tabbed View */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'timeline')}>
        <Tabs.List>
          <Tabs.Tab value="timeline">Timeline View</Tabs.Tab>
          <Tabs.Tab value="summary">Category Summary</Tabs.Tab>
          <Tabs.Tab value="insights">Insights & Trends</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="timeline" pt="md">
          {/* Interactions Timeline */}
          <Card withBorder p="lg">
            {paginatedInteractions.length > 0 ? (
              groupBy === 'none' ? (
                viewMode === 'cards' ? (
                  <Grid>
                    {paginatedInteractions.map((interaction) => (
                      <Grid.Col key={interaction.id} span={{ base: 12, md: 6, lg: 4 }}>
                        <Card withBorder p="md" h="100%">
                          <Group justify="space-between" mb="xs">
                            <Group gap="xs">
                              <ThemeIcon
                                color={getInteractionColor(interaction.type)}
                                variant="light"
                                size="sm"
                              >
                                {getInteractionIcon(interaction.type)}
                              </ThemeIcon>
                              <Text fw={500} size="sm" lineClamp={1}>{interaction.title}</Text>
                            </Group>
                            <Menu position="bottom-end">
                              <Menu.Target>
                                <ActionIcon variant="subtle" size="sm">
                                  <IconDots size={14} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                                >
                                  View Details
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                  onClick={() => handleEditInteraction(interaction)}
                                >
                                  Edit Interaction
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                  color="red"
                                  onClick={() => handleDeleteInteraction(interaction.id)}
                                >
                                  Delete
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                          
                          <Text size="sm" c="dimmed" mb="xs" lineClamp={2}>
                            {interaction.description}
                          </Text>
                          
                          <Group gap="xs" mb="xs">
                            {getOutcomeBadge(interaction.outcome)}
                            <Badge variant="dot" size="xs" color={getInteractionColor(interaction.category)}>
                              {interaction.category}
                            </Badge>
                            {interaction.duration && (
                              <Badge variant="outline" size="xs">
                                {formatDuration(interaction.duration)}
                              </Badge>
                            )}
                          </Group>
                          
                          <Text size="xs" c="dimmed">
                            {formatDate(interaction.date)} • {interaction.createdBy}
                          </Text>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid>
                ) : (
                  <Timeline 
                    active={-1} 
                    bulletSize={viewMode === 'compact' ? 24 : 36} 
                    lineWidth={2}
                  >
                    {paginatedInteractions.map((interaction) => (
                  <Timeline.Item
                    key={interaction.id}
                    bullet={
                      <ThemeIcon
                        color={getInteractionColor(interaction.type)}
                        variant="light"
                        size={36}
                        radius="xl"
                      >
                        {getInteractionIcon(interaction.type)}
                      </ThemeIcon>
                    }
                    title={
                      <Group justify="space-between" align="flex-start">
                        <Box style={{ flex: 1 }}>
                          <Group gap="sm" mb="xs">
                            <Text fw={500} size="sm">{interaction.title}</Text>
                            {getOutcomeBadge(interaction.outcome)}
                            {getPriorityBadge(interaction.priority)}
                            {interaction.duration && (
                              <Badge variant="outline" size="sm">
                                <IconClock size={12} style={{ marginRight: 4 }} />
                                {formatDuration(interaction.duration)}
                              </Badge>
                            )}
                            {interaction.followUpRequired && (
                              <Badge color="yellow" variant="light" size="sm">
                                Follow-up Required
                              </Badge>
                            )}
                          </Group>
                          
                          <Group gap="xs" mb="xs">
                            <Badge variant="dot" size="sm" color={getInteractionColor(interaction.category)}>
                              {interaction.category}
                            </Badge>
                            <Group gap={4}>
                              {getChannelIcon(interaction.channel)}
                              <Text size="xs" c="dimmed">{interaction.channel}</Text>
                            </Group>
                            {interaction.location && (
                              <Group gap={4}>
                                <IconMapPin size={12} />
                                <Text size="xs" c="dimmed">{interaction.location}</Text>
                              </Group>
                            )}
                          </Group>
                        </Box>
                        
                        <Menu position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" size="sm">
                              <IconDots size={14} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                              onClick={() => handleEditInteraction(interaction)}
                            >
                              Edit Interaction
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                              color="red"
                              onClick={() => handleDeleteInteraction(interaction.id)}
                            >
                              Delete Interaction
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    }
                  >
                    <Text c="dimmed" size="sm" mb="xs">
                      {interaction.description}
                    </Text>
                    
                    {interaction.tags && interaction.tags.length > 0 && (
                      <Group gap="xs" mb="xs">
                        <IconTag size={12} />
                        {interaction.tags.map((tag, index) => (
                          <Badge key={index} variant="dot" size="xs">
                            {tag}
                          </Badge>
                        ))}
                      </Group>
                    )}

                    {interaction.participants && interaction.participants.length > 0 && (
                      <Group gap="xs" mb="xs">
                        <IconUser size={12} />
                        <Text size="xs" c="dimmed">
                          Participants: {interaction.participants.join(', ')}
                        </Text>
                      </Group>
                    )}

                    {interaction.relatedRecords && interaction.relatedRecords.length > 0 && (
                      <Group gap="xs" mb="xs">
                        <Text size="xs" c="dimmed">Related:</Text>
                        {interaction.relatedRecords.map((record, index) => (
                          <Anchor key={index} size="xs">
                            {record.title}
                          </Anchor>
                        ))}
                      </Group>
                    )}

                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">
                          {formatDate(interaction.date)}
                        </Text>
                        <Text size="xs" c="dimmed">•</Text>
                        <Text size="xs" c="dimmed">
                          by {interaction.createdBy}
                        </Text>
                        {interaction.sentiment && interaction.sentiment !== 'neutral' && (
                          <>
                            <Text size="xs" c="dimmed">•</Text>
                            <Group gap={2}>
                              <IconStar size={10} color={interaction.sentiment === 'positive' ? 'green' : 'red'} />
                              <Text size="xs" c={interaction.sentiment === 'positive' ? 'green' : 'red'}>
                                {interaction.sentiment}
                              </Text>
                            </Group>
                          </>
                        )}
                      </Group>
                      {interaction.followUpDate && (
                        <Text size="xs" c="orange">
                          Follow-up: {formatDate(interaction.followUpDate)}
                        </Text>
                      )}
                    </Group>
                    </Timeline.Item>
                  ))}
                  </Timeline>
                )
              ) : (
                <Stack gap="lg">
                  {Object.entries(groupedInteractions).map(([groupKey, groupInteractions]) => (
                    <div key={groupKey}>
                      <Group mb="md">
                        <Title order={4}>{groupKey}</Title>
                        <Badge variant="light">{groupInteractions.length} interactions</Badge>
                      </Group>
                      
                      {viewMode === 'cards' ? (
                        <Grid>
                          {groupInteractions.slice(0, ITEMS_PER_PAGE).map((interaction) => (
                            <Grid.Col key={interaction.id} span={{ base: 12, md: 6, lg: 4 }}>
                              <Card withBorder p="md" h="100%">
                                <Group justify="space-between" mb="xs">
                                  <Group gap="xs">
                                    <ThemeIcon
                                      color={getInteractionColor(interaction.type)}
                                      variant="light"
                                      size="sm"
                                    >
                                      {getInteractionIcon(interaction.type)}
                                    </ThemeIcon>
                                    <Text fw={500} size="sm" lineClamp={1}>{interaction.title}</Text>
                                  </Group>
                                  <Menu position="bottom-end">
                                    <Menu.Target>
                                      <ActionIcon variant="subtle" size="sm">
                                        <IconDots size={14} />
                                      </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                      <Menu.Item
                                        leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                                      >
                                        View Details
                                      </Menu.Item>
                                      <Menu.Item
                                        leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                        onClick={() => handleEditInteraction(interaction)}
                                      >
                                        Edit Interaction
                                      </Menu.Item>
                                      <Menu.Item
                                        leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                        color="red"
                                        onClick={() => handleDeleteInteraction(interaction.id)}
                                      >
                                        Delete
                                      </Menu.Item>
                                    </Menu.Dropdown>
                                  </Menu>
                                </Group>
                                
                                <Text size="sm" c="dimmed" mb="xs" lineClamp={2}>
                                  {interaction.description}
                                </Text>
                                
                                <Group gap="xs" mb="xs">
                                  {getOutcomeBadge(interaction.outcome)}
                                  <Badge variant="dot" size="xs" color={getInteractionColor(interaction.category)}>
                                    {interaction.category}
                                  </Badge>
                                  {interaction.duration && (
                                    <Badge variant="outline" size="xs">
                                      {formatDuration(interaction.duration)}
                                    </Badge>
                                  )}
                                </Group>
                                
                                <Text size="xs" c="dimmed">
                                  {formatDate(interaction.date)} • {interaction.createdBy}
                                </Text>
                              </Card>
                            </Grid.Col>
                          ))}
                        </Grid>
                      ) : (
                        <Timeline 
                          active={-1} 
                          bulletSize={viewMode === 'compact' ? 24 : 36} 
                          lineWidth={2}
                        >
                          {groupInteractions.slice(0, ITEMS_PER_PAGE).map((interaction) => (
                            <Timeline.Item
                              key={interaction.id}
                              bullet={
                                <ThemeIcon
                                  color={getInteractionColor(interaction.type)}
                                  variant="light"
                                  size={viewMode === 'compact' ? 24 : 36}
                                  radius="xl"
                                >
                                  {getInteractionIcon(interaction.type)}
                                </ThemeIcon>
                              }
                              title={
                                <Group justify="space-between" align="flex-start">
                                  <Box style={{ flex: 1 }}>
                                    <Group gap="sm" mb="xs">
                                      <Text fw={500} size={viewMode === 'compact' ? 'xs' : 'sm'}>
                                        {interaction.title}
                                      </Text>
                                      {getOutcomeBadge(interaction.outcome)}
                                      {viewMode !== 'compact' && getPriorityBadge(interaction.priority)}
                                      {viewMode !== 'compact' && interaction.duration && (
                                        <Badge variant="outline" size="sm">
                                          <IconClock size={12} style={{ marginRight: 4 }} />
                                          {formatDuration(interaction.duration)}
                                        </Badge>
                                      )}
                                      {viewMode !== 'compact' && interaction.followUpRequired && (
                                        <Badge color="yellow" variant="light" size="sm">
                                          Follow-up Required
                                        </Badge>
                                      )}
                                    </Group>
                                    
                                    {viewMode !== 'compact' && (
                                      <Group gap="xs" mb="xs">
                                        <Badge variant="dot" size="sm" color={getInteractionColor(interaction.category)}>
                                          {interaction.category}
                                        </Badge>
                                        <Group gap={4}>
                                          {getChannelIcon(interaction.channel)}
                                          <Text size="xs" c="dimmed">{interaction.channel}</Text>
                                        </Group>
                                        {interaction.location && (
                                          <Group gap={4}>
                                            <IconMapPin size={12} />
                                            <Text size="xs" c="dimmed">{interaction.location}</Text>
                                          </Group>
                                        )}
                                      </Group>
                                    )}
                                  </Box>
                                  
                                  <Menu position="bottom-end">
                                    <Menu.Target>
                                      <ActionIcon variant="subtle" size="sm">
                                        <IconDots size={14} />
                                      </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                      <Menu.Item
                                        leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                                      >
                                        View Details
                                      </Menu.Item>
                                      <Menu.Item
                                        leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                        onClick={() => handleEditInteraction(interaction)}
                                      >
                                        Edit Interaction
                                      </Menu.Item>
                                      <Menu.Item
                                        leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                        color="red"
                                        onClick={() => handleDeleteInteraction(interaction.id)}
                                      >
                                        Delete
                                      </Menu.Item>
                                    </Menu.Dropdown>
                                  </Menu>
                                </Group>
                              }
                            >
                              <Text c="dimmed" size={viewMode === 'compact' ? 'xs' : 'sm'} mb="xs">
                                {viewMode === 'compact' 
                                  ? interaction.description.substring(0, 100) + (interaction.description.length > 100 ? '...' : '')
                                  : interaction.description
                                }
                              </Text>
                              
                              {viewMode !== 'compact' && interaction.tags && interaction.tags.length > 0 && (
                                <Group gap="xs" mb="xs">
                                  <IconTag size={12} />
                                  {interaction.tags.map((tag, index) => (
                                    <Badge key={index} variant="dot" size="xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </Group>
                              )}

                              {viewMode !== 'compact' && interaction.participants && interaction.participants.length > 0 && (
                                <Group gap="xs" mb="xs">
                                  <IconUser size={12} />
                                  <Text size="xs" c="dimmed">
                                    Participants: {interaction.participants.join(', ')}
                                  </Text>
                                </Group>
                              )}

                              {viewMode !== 'compact' && interaction.relatedRecords && interaction.relatedRecords.length > 0 && (
                                <Group gap="xs" mb="xs">
                                  <Text size="xs" c="dimmed">Related:</Text>
                                  {interaction.relatedRecords.map((record, index) => (
                                    <Anchor key={index} size="xs">
                                      {record.title}
                                    </Anchor>
                                  ))}
                                </Group>
                              )}

                              <Group justify="space-between" align="center">
                                <Group gap="xs">
                                  <Text size="xs" c="dimmed">
                                    {formatDate(interaction.date)}
                                  </Text>
                                  <Text size="xs" c="dimmed">•</Text>
                                  <Text size="xs" c="dimmed">
                                    by {interaction.createdBy}
                                  </Text>
                                  {viewMode !== 'compact' && interaction.sentiment && interaction.sentiment !== 'neutral' && (
                                    <>
                                      <Text size="xs" c="dimmed">•</Text>
                                      <Group gap={2}>
                                        <IconStar size={10} color={interaction.sentiment === 'positive' ? 'green' : 'red'} />
                                        <Text size="xs" c={interaction.sentiment === 'positive' ? 'green' : 'red'}>
                                          {interaction.sentiment}
                                        </Text>
                                      </Group>
                                    </>
                                  )}
                                </Group>
                                {viewMode !== 'compact' && interaction.followUpDate && (
                                  <Text size="xs" c="orange">
                                    Follow-up: {formatDate(interaction.followUpDate)}
                                  </Text>
                                )}
                              </Group>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      )}
                    </div>
                  ))}
                </Stack>
              )
            ) : (
              <Alert icon={<IconInfoCircle size={16} />} title="No Interactions Found">
                {searchQuery || typeFilter.length > 0 || categoryFilter.length > 0 || outcomeFilter.length > 0
                  ? 'No interactions match your current filters. Try adjusting your search criteria.'
                  : 'No interactions have been logged yet. Use the templates above or click "Log Interaction" to get started.'
                }
              </Alert>
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="summary" pt="md">
          {/* Category Summary */}
          <Grid>
            {interactionsByCategory.map(({ category, count, recent }) => (
              <Grid.Col key={category} span={{ base: 12, md: 6, lg: 4 }}>
                <Card withBorder p="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={600} tt="capitalize">{category}</Text>
                    <Badge variant="light">{count} interactions</Badge>
                  </Group>
                  
                  <Stack gap="xs">
                    {recent.map((interaction) => (
                      <Group key={interaction.id} gap="xs">
                        <ThemeIcon
                          size="sm"
                          variant="light"
                          color={getInteractionColor(interaction.type)}
                        >
                          {getInteractionIcon(interaction.type)}
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                          <Text size="sm" lineClamp={1}>{interaction.title}</Text>
                          <Text size="xs" c="dimmed">
                            {formatDate(interaction.date)}
                          </Text>
                        </div>
                        {getOutcomeBadge(interaction.outcome)}
                      </Group>
                    ))}
                    {count > 3 && (
                      <Text size="xs" c="dimmed" ta="center">
                        +{count - 3} more interactions
                      </Text>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="insights" pt="md">
          {/* Insights and Trends */}
          <Grid>
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Stack gap="md">
                {/* Interaction Trends */}
                <Card withBorder p="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={600}>Interaction Trends</Text>
                    <Badge variant="light">Last 30 Days</Badge>
                  </Group>
                  
                  <Group gap="xl" mb="md">
                    <div>
                      <Text size="xs" c="dimmed">Recent Activity</Text>
                      <Text size="xl" fw={700}>{analyticsData.recentActivity}</Text>
                      <Text size="xs" c="dimmed">interactions</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">Avg Response Time</Text>
                      <Text size="xl" fw={700}>{formatDuration(analyticsData.avgResponseTime)}</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">Success Rate</Text>
                      <Text size="xl" fw={700} c="green">
                        {Math.round(((analyticsData.positiveInteractions + filteredInteractions.filter(i => i.outcome === 'completed').length) / analyticsData.totalInteractions) * 100) || 0}%
                      </Text>
                    </div>
                  </Group>

                  {/* Most Used Tags */}
                  <div>
                    <Text size="sm" fw={500} mb="xs">Popular Tags</Text>
                    <Group gap="xs">
                      {allTags.slice(0, 10).map(tag => {
                        const count = filteredInteractions.filter(i => i.tags?.includes(tag)).length;
                        return (
                          <Badge key={tag} variant="light" size="sm">
                            {tag} ({count})
                          </Badge>
                        );
                      })}
                    </Group>
                  </div>
                </Card>

                {/* Communication Patterns */}
                <Card withBorder p="md">
                  <Text fw={600} mb="md">Communication Patterns</Text>
                  
                  <Grid>
                    <Grid.Col span={6}>
                      <Text size="sm" fw={500} mb="xs">Preferred Channels</Text>
                      <Stack gap="xs">
                        {Object.entries(analyticsData.channelUsage)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 3)
                          .map(([channel, count]) => (
                            <Group key={channel} justify="space-between">
                              <Group gap="xs">
                                {getChannelIcon(channel)}
                                <Text size="sm" tt="capitalize">{channel}</Text>
                              </Group>
                              <Group gap="xs">
                                <Progress 
                                  value={(count / analyticsData.totalInteractions) * 100} 
                                  size="sm" 
                                  style={{ width: 80 }}
                                />
                                <Text size="sm" fw={500}>{Math.round((count / analyticsData.totalInteractions) * 100)}%</Text>
                              </Group>
                            </Group>
                          ))}
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="sm" fw={500} mb="xs">Interaction Outcomes</Text>
                      <Stack gap="xs">
                        {Object.entries(analyticsData.outcomeDistribution)
                          .sort(([,a], [,b]) => b - a)
                          .map(([outcome, count]) => (
                            <Group key={outcome} justify="space-between">
                              <Text size="sm" tt="capitalize">{outcome}</Text>
                              <Group gap="xs">
                                <Progress 
                                  value={(count / analyticsData.totalInteractions) * 100} 
                                  size="sm" 
                                  style={{ width: 80 }}
                                  color={outcome === 'positive' || outcome === 'completed' ? 'green' : 
                                         outcome === 'negative' || outcome === 'cancelled' ? 'red' : 'blue'}
                                />
                                <Text size="sm" fw={500}>{Math.round((count / analyticsData.totalInteractions) * 100)}%</Text>
                              </Group>
                            </Group>
                          ))}
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Card>

                {/* Follow-up Management */}
                {analyticsData.followUpRequired > 0 && (
                  <Card withBorder p="md">
                    <Group justify="space-between" mb="md">
                      <Text fw={600}>Follow-up Required</Text>
                      <Badge color="orange">{analyticsData.followUpRequired} pending</Badge>
                    </Group>
                    
                    <Stack gap="xs">
                      {filteredInteractions
                        .filter(interaction => interaction.followUpRequired)
                        .slice(0, 5)
                        .map(interaction => (
                          <Group key={interaction.id} justify="space-between" p="xs" style={{ backgroundColor: 'var(--mantine-color-orange-0)', borderRadius: 4 }}>
                            <div>
                              <Text size="sm" fw={500}>{interaction.title}</Text>
                              <Text size="xs" c="dimmed">
                                Due: {interaction.followUpDate ? formatDate(interaction.followUpDate) : 'Not scheduled'}
                              </Text>
                            </div>
                            <Button size="xs" variant="light">
                              Schedule
                            </Button>
                          </Group>
                        ))}
                    </Stack>
                  </Card>
                )}
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap="md">
                {/* Quick Insights */}
                <Card withBorder p="md">
                  <Text fw={600} mb="md">Quick Insights</Text>
                  
                  <Stack gap="md">
                    <Alert icon={<IconBulb size={16} />} color="blue" variant="light">
                      <Text size="sm">
                        Most interactions happen via {Object.entries(analyticsData.channelUsage)
                          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'phone'}. 
                        Consider optimizing this channel.
                      </Text>
                    </Alert>

                    {analyticsData.negativeInteractions > analyticsData.positiveInteractions && (
                      <Alert icon={<IconAlertTriangle size={16} />} color="red" variant="light">
                        <Text size="sm">
                          More negative interactions than positive. Review recent touchpoints for improvement opportunities.
                        </Text>
                      </Alert>
                    )}

                    {analyticsData.followUpRequired > 0 && (
                      <Alert icon={<IconFlag size={16} />} color="orange" variant="light">
                        <Text size="sm">
                          {analyticsData.followUpRequired} interactions need follow-up. Schedule these to maintain momentum.
                        </Text>
                      </Alert>
                    )}

                    <Alert icon={<IconTarget size={16} />} color="green" variant="light">
                      <Text size="sm">
                        {Math.round((analyticsData.positiveInteractions / analyticsData.totalInteractions) * 100) || 0}% positive sentiment. 
                        Keep up the great relationship building!
                      </Text>
                    </Alert>
                  </Stack>
                </Card>

                {/* Relationship Health Score */}
                <Card withBorder p="md">
                  <Text fw={600} mb="md">Relationship Health</Text>
                  
                  <Group justify="center" mb="md">
                    <RingProgress
                      size={120}
                      thickness={12}
                      sections={[
                        { 
                          value: Math.min(100, (analyticsData.positiveInteractions / Math.max(1, analyticsData.totalInteractions)) * 100 + 
                                 (analyticsData.recentActivity / 10) * 20), 
                          color: 'green' 
                        }
                      ]}
                      label={
                        <Text size="xl" fw={700} ta="center">
                          {Math.min(100, Math.round((analyticsData.positiveInteractions / Math.max(1, analyticsData.totalInteractions)) * 100 + 
                                   (analyticsData.recentActivity / 10) * 20))}
                        </Text>
                      }
                    />
                  </Group>
                  
                  <Text size="sm" c="dimmed" ta="center">
                    Based on interaction frequency, sentiment, and engagement patterns
                  </Text>
                </Card>

                {/* Recent Activity Summary */}
                <Card withBorder p="md">
                  <Text fw={600} mb="md">Recent Activity</Text>
                  
                  <Stack gap="xs">
                    {filteredInteractions
                      .slice(0, 3)
                      .map(interaction => (
                        <Group key={interaction.id} gap="xs">
                          <ThemeIcon size="sm" variant="light" color={getInteractionColor(interaction.type)}>
                            {getInteractionIcon(interaction.type)}
                          </ThemeIcon>
                          <div style={{ flex: 1 }}>
                            <Text size="sm" lineClamp={1}>{interaction.title}</Text>
                            <Text size="xs" c="dimmed">
                              {formatDate(interaction.date)}
                            </Text>
                          </div>
                          {getOutcomeBadge(interaction.outcome)}
                        </Group>
                      ))}
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>

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

      {/* Create/Edit Interaction Modal */}
      <Modal
        opened={createModalOpened}
        onClose={() => {
          closeCreateModal();
          createForm.reset();
          setEditingInteraction(null);
          setSelectedTemplate(null);
        }}
        title={editingInteraction ? 'Edit Interaction' : 'Log New Interaction'}
        size="xl"
      >
        <form onSubmit={createForm.onSubmit(editingInteraction ? handleUpdateInteraction : handleCreateInteraction)}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Interaction Type"
                  placeholder="Select type"
                  data={[
                    { value: 'call', label: 'Phone Call' },
                    { value: 'email', label: 'Email' },
                    { value: 'meeting', label: 'Meeting' },
                    { value: 'training', label: 'Training' },
                    { value: 'note', label: 'Note' },
                    { value: 'order', label: 'Order' },
                    { value: 'quote', label: 'Quote' },
                    { value: 'visit', label: 'Site Visit' },
                    { value: 'support', label: 'Support' },
                    { value: 'system', label: 'System' },
                  ]}
                  {...createForm.getInputProps('type')}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Category"
                  placeholder="Select category"
                  data={[
                    { value: 'sales', label: 'Sales' },
                    { value: 'support', label: 'Support' },
                    { value: 'training', label: 'Training' },
                    { value: 'administrative', label: 'Administrative' },
                    { value: 'marketing', label: 'Marketing' },
                    { value: 'technical', label: 'Technical' },
                  ]}
                  {...createForm.getInputProps('category')}
                  required
                />
              </Grid.Col>
            </Grid>

            <TextInput
              label="Title"
              placeholder="Interaction title"
              {...createForm.getInputProps('title')}
              required
            />

            <Textarea
              label="Description"
              placeholder="Describe the interaction..."
              minRows={3}
              {...createForm.getInputProps('description')}
              required
            />

            <Grid>
              <Grid.Col span={4}>
                <DateTimePicker
                  label="Date & Time"
                  placeholder="Select date and time"
                  {...createForm.getInputProps('date')}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Duration (minutes)"
                  placeholder="30"
                  min={0}
                  {...createForm.getInputProps('duration')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Location"
                  placeholder="Meeting location"
                  {...createForm.getInputProps('location')}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={4}>
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
              </Grid.Col>
              <Grid.Col span={4}>
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
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Channel"
                  placeholder="Select channel"
                  data={[
                    { value: 'phone', label: 'Phone' },
                    { value: 'email', label: 'Email' },
                    { value: 'in-person', label: 'In Person' },
                    { value: 'video', label: 'Video Call' },
                    { value: 'chat', label: 'Chat' },
                    { value: 'system', label: 'System' },
                    { value: 'mobile', label: 'Mobile App' },
                  ]}
                  {...createForm.getInputProps('channel')}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <MultiSelect
                  label="Participants"
                  placeholder="Add participants"
                  data={[]} // In real app, this would be populated with user data
                  {...createForm.getInputProps('participants')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Sentiment"
                  placeholder="Select sentiment"
                  data={[
                    { value: 'positive', label: 'Positive' },
                    { value: 'negative', label: 'Negative' },
                    { value: 'neutral', label: 'Neutral' },
                  ]}
                  {...createForm.getInputProps('sentiment')}
                />
              </Grid.Col>
            </Grid>

            <MultiSelect
              label="Tags"
              placeholder="Add tags"
              data={allTags.map(tag => ({ value: tag, label: tag }))}
              {...createForm.getInputProps('tags')}
              searchable
            />

            <Divider />

            <Checkbox
              label="Follow-up required"
              {...createForm.getInputProps('followUpRequired', { type: 'checkbox' })}
            />

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
                setEditingInteraction(null);
                setSelectedTemplate(null);
              }}>
                Cancel
              </Button>
              <Button type="submit">
                {editingInteraction ? 'Update Interaction' : 'Log Interaction'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
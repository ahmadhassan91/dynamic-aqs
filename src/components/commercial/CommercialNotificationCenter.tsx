'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Tabs,
  ScrollArea,
  Menu,
  ActionIcon,
  TextInput,
  Select,
  Switch,
  Alert,
  Card,
  Grid,
  Divider,
  Box,
  Tooltip,
  Modal,
  NumberInput,
  MultiSelect,
  Textarea,
} from '@mantine/core';
import {
  IconBell,
  IconSettings,
  IconFilter,
  IconSearch,
  IconCheck,
  IconArchive,
  IconTrash,
  IconDots,
  IconRefresh,
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconExclamationMark,
  IconPlus,
  IconEdit,
  IconEye,
  IconBellRinging,
  IconMail,
  IconPhone,
  IconClock,
  IconTrendingUp,
  IconUsers,
  IconBuilding,
  IconCurrencyDollar,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { 
  Notification, 
  NotificationFilter, 
  NotificationCategory, 
  NotificationType, 
  NotificationPriority,
  NotificationPreferences,
  EscalationRule,
  NotificationTemplate,
  CommercialNotificationData
} from '@/types/notifications';
import { notificationService } from '@/lib/services/notificationService';

export function CommercialNotificationCenter() {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<NotificationFilter>({});
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    urgent: 0,
    opportunities: 0,
    engineers: 0,
    quotes: 0
  });

  const [filterOpened, { toggle: toggleFilter }] = useDisclosure(false);
  const [preferencesOpened, { open: openPreferences, close: closePreferences }] = useDisclosure(false);
  const [escalationOpened, { open: openEscalation, close: closeEscalation }] = useDisclosure(false);
  const [templateOpened, { open: openTemplate, close: closeTemplate }] = useDisclosure(false);

  useEffect(() => {
    loadData();
  }, [filter, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadNotifications(),
        loadPreferences(),
        loadEscalationRules(),
        loadTemplates(),
        loadStats()
      ]);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load notification data',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    let currentFilter = { ...filter };
    
    // Apply tab-based filtering for commercial categories
    if (activeTab === 'unread') {
      currentFilter.read = false;
    } else if (activeTab === 'archived') {
      currentFilter.archived = true;
    } else if (activeTab === 'opportunities') {
      currentFilter.categories = [NotificationCategory.COMMERCIAL_OPPORTUNITY];
    } else if (activeTab === 'engineers') {
      currentFilter.categories = [NotificationCategory.COMMERCIAL_ENGINEER];
    } else if (activeTab === 'quotes') {
      currentFilter.categories = [NotificationCategory.COMMERCIAL_QUOTE];
    } else if (activeTab === 'reps') {
      currentFilter.categories = [NotificationCategory.COMMERCIAL_REP];
    } else if (activeTab !== 'all') {
      currentFilter.categories = [activeTab as NotificationCategory];
    }

    const data = await notificationService.getNotifications(currentFilter);
    
    // Apply search filtering
    let filtered = data;
    if (searchQuery) {
      filtered = data.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setNotificationList(filtered);
  };

  const loadPreferences = async () => {
    const prefs = await notificationService.getPreferences();
    setPreferences(prefs);
  };

  const loadEscalationRules = async () => {
    const rules = await notificationService.getEscalationRules();
    setEscalationRules(rules);
  };

  const loadTemplates = async () => {
    const templateList = await notificationService.getNotificationTemplates();
    setTemplates(templateList);
  };

  const loadStats = async () => {
    const allNotifications = await notificationService.getNotifications();
    const commercialNotifications = allNotifications.filter(n => 
      [
        NotificationCategory.COMMERCIAL_OPPORTUNITY,
        NotificationCategory.COMMERCIAL_ENGINEER,
        NotificationCategory.COMMERCIAL_QUOTE,
        NotificationCategory.COMMERCIAL_REP
      ].includes(n.category)
    );

    setStats({
      total: commercialNotifications.length,
      unread: commercialNotifications.filter(n => !n.read && !n.archived).length,
      urgent: commercialNotifications.filter(n => n.priority === NotificationPriority.URGENT).length,
      opportunities: commercialNotifications.filter(n => n.category === NotificationCategory.COMMERCIAL_OPPORTUNITY).length,
      engineers: commercialNotifications.filter(n => n.category === NotificationCategory.COMMERCIAL_ENGINEER).length,
      quotes: commercialNotifications.filter(n => n.category === NotificationCategory.COMMERCIAL_QUOTE).length
    });
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      loadNotifications();
      loadStats();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to mark notification as read',
        color: 'red',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      loadNotifications();
      loadStats();
      notifications.show({
        title: 'Success',
        message: 'All notifications marked as read',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to mark all notifications as read',
        color: 'red',
      });
    }
  };

  const handleArchive = async (notificationId: string) => {
    try {
      await notificationService.archiveNotification(notificationId);
      loadNotifications();
      loadStats();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to archive notification',
        color: 'red',
      });
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      loadNotifications();
      loadStats();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete notification',
        color: 'red',
      });
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return <IconCircleCheck size={16} color="green" />;
      case NotificationType.WARNING:
        return <IconAlertTriangle size={16} color="orange" />;
      case NotificationType.ERROR:
        return <IconExclamationMark size={16} color="red" />;
      default:
        return <IconInfoCircle size={16} color="blue" />;
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case NotificationCategory.COMMERCIAL_OPPORTUNITY:
        return <IconTrendingUp size={16} />;
      case NotificationCategory.COMMERCIAL_ENGINEER:
        return <IconUsers size={16} />;
      case NotificationCategory.COMMERCIAL_QUOTE:
        return <IconCurrencyDollar size={16} />;
      case NotificationCategory.COMMERCIAL_REP:
        return <IconBuilding size={16} />;
      default:
        return <IconBell size={16} />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return 'red';
      case NotificationPriority.HIGH:
        return 'orange';
      case NotificationPriority.MEDIUM:
        return 'yellow';
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

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Title order={2}>Commercial Notification Center</Title>
          <Group>
            <Button
              variant="light"
              leftSection={<IconRefresh size={16} />}
              onClick={loadData}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              variant="light"
              leftSection={<IconSettings size={16} />}
              onClick={openPreferences}
            >
              Preferences
            </Button>
          </Group>
        </Group>

        {/* Statistics Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Total
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.total}
                  </Text>
                </div>
                <IconBell size={24} color="gray" />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Unread
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.unread}
                  </Text>
                </div>
                <IconBellRinging size={24} color="blue" />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Urgent
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.urgent}
                  </Text>
                </div>
                <IconExclamationMark size={24} color="red" />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Opportunities
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.opportunities}
                  </Text>
                </div>
                <IconTrendingUp size={24} color="green" />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Engineers
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.engineers}
                  </Text>
                </div>
                <IconUsers size={24} color="orange" />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Quotes
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.quotes}
                  </Text>
                </div>
                <IconCurrencyDollar size={24} color="purple" />
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Main Content */}
        <Paper withBorder>
          <Stack gap={0}>
            {/* Header Actions */}
            <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
              <Group justify="space-between" mb="sm">
                <Group>
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<IconCheck size={14} />}
                    onClick={handleMarkAllAsRead}
                  >
                    Mark All Read
                  </Button>
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<IconPlus size={14} />}
                    onClick={openEscalation}
                  >
                    Escalation Rules
                  </Button>
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<IconEdit size={14} />}
                    onClick={openTemplate}
                  >
                    Templates
                  </Button>
                </Group>
                <Group>
                  <ActionIcon
                    variant="light"
                    onClick={toggleFilter}
                    color={filterOpened ? 'blue' : 'gray'}
                  >
                    <IconFilter size={16} />
                  </ActionIcon>
                </Group>
              </Group>

              <TextInput
                placeholder="Search commercial notifications..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                mb="sm"
              />

              {/* Filter Panel */}
              {filterOpened && (
                <Paper p="sm" withBorder>
                  <Text size="sm" fw={500} mb="xs">Commercial Filters</Text>
                  <Group>
                    <Select
                      placeholder="Category"
                      data={[
                        { value: '', label: 'All Categories' },
                        { value: NotificationCategory.COMMERCIAL_OPPORTUNITY, label: 'Opportunities' },
                        { value: NotificationCategory.COMMERCIAL_ENGINEER, label: 'Engineers' },
                        { value: NotificationCategory.COMMERCIAL_QUOTE, label: 'Quotes' },
                        { value: NotificationCategory.COMMERCIAL_REP, label: 'Manufacturer Reps' },
                      ]}
                      value={filter.categories?.[0] || ''}
                      onChange={(value) => 
                        setFilter(prev => ({
                          ...prev,
                          categories: value ? [value as NotificationCategory] : undefined
                        }))
                      }
                      size="xs"
                    />
                    <Select
                      placeholder="Priority"
                      data={[
                        { value: '', label: 'All Priorities' },
                        { value: NotificationPriority.URGENT, label: 'Urgent' },
                        { value: NotificationPriority.HIGH, label: 'High' },
                        { value: NotificationPriority.MEDIUM, label: 'Medium' },
                        { value: NotificationPriority.LOW, label: 'Low' },
                      ]}
                      value={filter.priorities?.[0] || ''}
                      onChange={(value) => 
                        setFilter(prev => ({
                          ...prev,
                          priorities: value ? [value as NotificationPriority] : undefined
                        }))
                      }
                      size="xs"
                    />
                  </Group>
                </Paper>
              )}
            </Box>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'all')}>
              <Tabs.List px="md">
                <Tabs.Tab value="all">All</Tabs.Tab>
                <Tabs.Tab value="unread">Unread</Tabs.Tab>
                <Tabs.Tab value="opportunities">Opportunities</Tabs.Tab>
                <Tabs.Tab value="engineers">Engineers</Tabs.Tab>
                <Tabs.Tab value="quotes">Quotes</Tabs.Tab>
                <Tabs.Tab value="reps">Reps</Tabs.Tab>
                <Tabs.Tab value="archived">Archived</Tabs.Tab>
              </Tabs.List>
            </Tabs>

            {/* Notifications List */}
            <ScrollArea style={{ height: '600px' }}>
              <Stack gap={0}>
                {notificationList.length === 0 ? (
                  <Box p="xl" ta="center">
                    <Text c="dimmed">No commercial notifications found</Text>
                  </Box>
                ) : (
                  notificationList.map((notification) => (
                    <Paper
                      key={notification.id}
                      p="md"
                      style={{
                        borderBottom: '1px solid var(--mantine-color-gray-2)',
                        backgroundColor: notification.read ? 'transparent' : 'var(--mantine-color-blue-0)',
                      }}
                    >
                      <Group align="flex-start" justify="space-between">
                        <Group align="flex-start" flex={1}>
                          <Group>
                            {getNotificationIcon(notification.type)}
                            {getCategoryIcon(notification.category)}
                          </Group>
                          <Box flex={1}>
                            <Group justify="space-between" mb="xs">
                              <Text fw={500} size="sm">
                                {notification.title}
                              </Text>
                              <Group gap="xs">
                                <Badge
                                  size="xs"
                                  color={getPriorityColor(notification.priority)}
                                  variant="light"
                                >
                                  {notification.priority}
                                </Badge>
                                <Text size="xs" c="dimmed">
                                  {formatTimeAgo(notification.createdAt)}
                                </Text>
                              </Group>
                            </Group>
                            <Text size="sm" c="dimmed" mb="xs">
                              {notification.message}
                            </Text>
                            
                            {/* Commercial-specific metadata display */}
                            {notification.metadata && (
                              <Group gap="xs" mb="xs">
                                {(notification.metadata as CommercialNotificationData).estimatedValue && (
                                  <Badge size="xs" variant="outline" color="green">
                                    ${(notification.metadata as CommercialNotificationData).estimatedValue?.toLocaleString()}
                                  </Badge>
                                )}
                                {(notification.metadata as CommercialNotificationData).marketSegment && (
                                  <Badge size="xs" variant="outline" color="blue">
                                    {(notification.metadata as CommercialNotificationData).marketSegment}
                                  </Badge>
                                )}
                                {(notification.metadata as CommercialNotificationData).salesPhase && (
                                  <Badge size="xs" variant="outline" color="orange">
                                    {(notification.metadata as CommercialNotificationData).salesPhase}
                                  </Badge>
                                )}
                              </Group>
                            )}
                            
                            {notification.actionUrl && (
                              <Button
                                variant="light"
                                size="xs"
                                component="a"
                                href={notification.actionUrl}
                              >
                                {notification.actionLabel || 'View Details'}
                              </Button>
                            )}
                          </Box>
                        </Group>
                        <Menu position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" size="sm">
                              <IconDots size={14} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            {!notification.read && (
                              <Menu.Item
                                leftSection={<IconCheck size={14} />}
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                Mark as Read
                              </Menu.Item>
                            )}
                            <Menu.Item
                              leftSection={<IconArchive size={14} />}
                              onClick={() => handleArchive(notification.id)}
                            >
                              Archive
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              onClick={() => handleDelete(notification.id)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Paper>
                  ))
                )}
              </Stack>
            </ScrollArea>
          </Stack>
        </Paper>
      </Stack>

      {/* Preferences Modal */}
      <Modal
        opened={preferencesOpened}
        onClose={closePreferences}
        title="Commercial Notification Preferences"
        size="lg"
      >
        <CommercialNotificationPreferences
          preferences={preferences}
          onSave={async (prefs) => {
            await notificationService.updatePreferences(prefs);
            setPreferences((prev) => prev ? { ...prev, ...prefs } : null);
            closePreferences();
            notifications.show({
              title: 'Success',
              message: 'Preferences updated successfully',
              color: 'green',
            });
          }}
        />
      </Modal>

      {/* Escalation Rules Modal */}
      <Modal
        opened={escalationOpened}
        onClose={closeEscalation}
        title="Commercial Escalation Rules"
        size="xl"
      >
        <EscalationRulesManager
          rules={escalationRules}
          onUpdate={loadEscalationRules}
        />
      </Modal>

      {/* Templates Modal */}
      <Modal
        opened={templateOpened}
        onClose={closeTemplate}
        title="Commercial Notification Templates"
        size="xl"
      >
        <NotificationTemplatesManager
          templates={templates}
          onUpdate={loadTemplates}
        />
      </Modal>
    </Container>
  );
}

// Sub-components for modals
function CommercialNotificationPreferences({ 
  preferences, 
  onSave 
}: { 
  preferences: NotificationPreferences | null;
  onSave: (prefs: Partial<NotificationPreferences>) => void;
}) {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  if (!localPrefs) return <Text>Loading preferences...</Text>;

  return (
    <Stack gap="md">
      <Group>
        <Switch
          label="Email Notifications"
          checked={localPrefs.emailNotifications}
          onChange={(event) => 
            setLocalPrefs(prev => prev ? { ...prev, emailNotifications: event.currentTarget.checked } : null)
          }
        />
        <Switch
          label="Push Notifications"
          checked={localPrefs.pushNotifications}
          onChange={(event) => 
            setLocalPrefs(prev => prev ? { ...prev, pushNotifications: event.currentTarget.checked } : null)
          }
        />
      </Group>

      <Divider label="Commercial Categories" />

      {Object.entries(localPrefs.categories)
        .filter(([category]) => category.startsWith('commercial_'))
        .map(([category, settings]) => (
          <Card key={category} withBorder p="sm">
            <Group justify="space-between" mb="xs">
              <Text fw={500} tt="capitalize">
                {category.replace('commercial_', '').replace('_', ' ')}
              </Text>
              <Switch
                checked={settings.enabled}
                onChange={(event) => 
                  setLocalPrefs(prev => prev ? {
                    ...prev,
                    categories: {
                      ...prev.categories,
                      [category as NotificationCategory]: {
                        ...settings,
                        enabled: event.currentTarget.checked
                      }
                    }
                  } : null)
                }
              />
            </Group>
            {settings.enabled && (
              <Group>
                <Switch
                  label="Email"
                  size="sm"
                  checked={settings.email}
                  onChange={(event) => 
                    setLocalPrefs(prev => prev ? {
                      ...prev,
                      categories: {
                        ...prev.categories,
                        [category as NotificationCategory]: {
                          ...settings,
                          email: event.currentTarget.checked
                        }
                      }
                    } : null)
                  }
                />
                <Switch
                  label="Push"
                  size="sm"
                  checked={settings.push}
                  onChange={(event) => 
                    setLocalPrefs(prev => prev ? {
                      ...prev,
                      categories: {
                        ...prev.categories,
                        [category as NotificationCategory]: {
                          ...settings,
                          push: event.currentTarget.checked
                        }
                      }
                    } : null)
                  }
                />
                <Select
                  label="Priority"
                  size="sm"
                  data={[
                    { value: NotificationPriority.LOW, label: 'Low' },
                    { value: NotificationPriority.MEDIUM, label: 'Medium' },
                    { value: NotificationPriority.HIGH, label: 'High' },
                    { value: NotificationPriority.URGENT, label: 'Urgent' },
                  ]}
                  value={settings.priority}
                  onChange={(value) => 
                    setLocalPrefs(prev => prev ? {
                      ...prev,
                      categories: {
                        ...prev.categories,
                        [category as NotificationCategory]: {
                          ...settings,
                          priority: value as NotificationPriority
                        }
                      }
                    } : null)
                  }
                />
              </Group>
            )}
          </Card>
        ))}

      <Group justify="flex-end" mt="md">
        <Button onClick={() => onSave(localPrefs)}>
          Save Preferences
        </Button>
      </Group>
    </Stack>
  );
}

function EscalationRulesManager({ 
  rules, 
  onUpdate 
}: { 
  rules: EscalationRule[];
  onUpdate: () => void;
}) {
  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Manage escalation rules for commercial notifications
        </Text>
        <Button size="xs" leftSection={<IconPlus size={14} />}>
          Add Rule
        </Button>
      </Group>

      {rules.length === 0 ? (
        <Text ta="center" c="dimmed">No escalation rules configured</Text>
      ) : (
        rules.map((rule) => (
          <Card key={rule.id} withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>{rule.name}</Text>
              <Group>
                <Switch checked={rule.isActive} size="sm" />
                <ActionIcon size="sm" variant="light">
                  <IconEdit size={14} />
                </ActionIcon>
                <ActionIcon size="sm" variant="light" color="red">
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
            </Group>
            <Text size="sm" c="dimmed" mb="xs">
              Category: {rule.category.replace('commercial_', '').replace('_', ' ')}
            </Text>
            <Text size="sm" c="dimmed">
              {rule.escalationSteps.length} escalation step(s)
            </Text>
          </Card>
        ))
      )}
    </Stack>
  );
}

function NotificationTemplatesManager({ 
  templates, 
  onUpdate 
}: { 
  templates: NotificationTemplate[];
  onUpdate: () => void;
}) {
  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Manage notification templates for commercial events
        </Text>
        <Button size="xs" leftSection={<IconPlus size={14} />}>
          Add Template
        </Button>
      </Group>

      {templates.length === 0 ? (
        <Text ta="center" c="dimmed">No templates configured</Text>
      ) : (
        templates.map((template) => (
          <Card key={template.id} withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>{template.name}</Text>
              <Group>
                <Switch checked={template.isActive} size="sm" />
                <ActionIcon size="sm" variant="light">
                  <IconEye size={14} />
                </ActionIcon>
                <ActionIcon size="sm" variant="light">
                  <IconEdit size={14} />
                </ActionIcon>
                <ActionIcon size="sm" variant="light" color="red">
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
            </Group>
            <Text size="sm" c="dimmed" mb="xs">
              Category: {template.category.replace('commercial_', '').replace('_', ' ')}
            </Text>
            <Text size="sm" c="dimmed">
              Variables: {template.variables.join(', ')}
            </Text>
          </Card>
        ))
      )}
    </Stack>
  );
}
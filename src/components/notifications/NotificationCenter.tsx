'use client';

import { useState, useEffect } from 'react';
import {
  Drawer,
  Stack,
  Group,
  Text,
  ActionIcon,
  Badge,
  Button,
  Tabs,
  ScrollArea,
  Menu,
  Divider,
  TextInput,
  Select,
  Checkbox,
  Paper,
  Box,
  Tooltip,
  Alert,
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
  IconX,
  IconRefresh,
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconExclamationMark,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { 
  Notification, 
  NotificationFilter, 
  NotificationCategory, 
  NotificationType, 
  NotificationPriority 
} from '@/types/notifications';
import { notificationService } from '@/lib/services/notificationService';

interface NotificationCenterProps {
  opened: boolean;
  onClose: () => void;
}

export function NotificationCenter({ opened, onClose }: NotificationCenterProps) {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpened, { toggle: toggleFilter }] = useDisclosure(false);
  const [filter, setFilter] = useState<NotificationFilter>({});

  useEffect(() => {
    if (opened) {
      loadNotifications();
    }
  }, [opened, filter, activeTab]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      let currentFilter = { ...filter };
      
      // Apply tab-based filtering
      if (activeTab === 'unread') {
        currentFilter.read = false;
      } else if (activeTab === 'archived') {
        currentFilter.archived = true;
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
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load notifications',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      loadNotifications();
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
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Notifications"
      position="right"
      size="lg"
      styles={{
        header: {
          paddingBottom: 0,
        },
        body: {
          padding: 0,
        },
      }}
    >
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
              <ActionIcon
                variant="light"
                onClick={loadNotifications}
                loading={loading}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            </Group>
            <Group>
              <ActionIcon
                variant="light"
                onClick={toggleFilter}
                color={filterOpened ? 'blue' : 'gray'}
              >
                <IconFilter size={16} />
              </ActionIcon>
              <ActionIcon variant="light">
                <IconSettings size={16} />
              </ActionIcon>
            </Group>
          </Group>

          <TextInput
            placeholder="Search notifications..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            mb="sm"
          />

          {/* Filter Panel */}
          {filterOpened && (
            <Paper p="sm" withBorder>
              <Text size="sm" fw={500} mb="xs">Filters</Text>
              <Group>
                <Select
                  placeholder="Category"
                  data={[
                    { value: '', label: 'All Categories' },
                    { value: NotificationCategory.ORDER, label: 'Orders' },
                    { value: NotificationCategory.TRAINING, label: 'Training' },
                    { value: NotificationCategory.CUSTOMER, label: 'Customers' },
                    { value: NotificationCategory.SYSTEM, label: 'System' },
                    { value: NotificationCategory.LEAD, label: 'Leads' },
                    { value: NotificationCategory.INTEGRATION, label: 'Integration' },
                    { value: NotificationCategory.COMMERCIAL_OPPORTUNITY, label: 'Commercial Opportunities' },
                    { value: NotificationCategory.COMMERCIAL_QUOTE, label: 'Commercial Quotes' },
                    { value: NotificationCategory.COMMERCIAL_ENGINEER, label: 'Engineers' },
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
            <Tabs.Tab value={NotificationCategory.ORDER}>Orders</Tabs.Tab>
            <Tabs.Tab value={NotificationCategory.TRAINING}>Training</Tabs.Tab>
            <Tabs.Tab value={NotificationCategory.CUSTOMER}>Customers</Tabs.Tab>
            <Tabs.Tab value={NotificationCategory.COMMERCIAL_OPPORTUNITY}>Commercial</Tabs.Tab>
            <Tabs.Tab value="archived">Archived</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {/* Notifications List */}
        <ScrollArea flex={1} style={{ height: 'calc(100vh - 200px)' }}>
          <Stack gap={0}>
            {notificationList.length === 0 ? (
              <Box p="xl" ta="center">
                <Text c="dimmed">No notifications found</Text>
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
                      {getNotificationIcon(notification.type)}
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
    </Drawer>
  );
}
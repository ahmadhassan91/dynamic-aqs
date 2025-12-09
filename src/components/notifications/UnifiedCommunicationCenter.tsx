'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Badge,
  Button,
  Tabs,
  Stack,
  ActionIcon,
  Menu,
  Select,
  TextInput,
  Paper,
  Box,
  Alert,
  Progress,
  Divider,
  Tooltip,
  Modal,
  Textarea,
  MultiSelect,
} from '@mantine/core';
import {
  IconBell,
  IconSettings,
  IconFilter,
  IconSearch,
  IconRefresh,
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlertTriangle,
  IconInfoCircle,
  IconUsers,
  IconBuilding,
  IconChartBar,
  IconMessage,
  IconMail,
  IconPhone,
  IconCalendar,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications as mantineNotifications } from '@mantine/notifications';
import { 
  Notification, 
  NotificationCategory, 
  NotificationPriority,
  EscalationRule,
  NotificationTemplate,
  CommercialNotificationData
} from '@/types/notifications';
import { notificationService } from '@/lib/services/notificationService';

interface UnifiedCommunicationCenterProps {
  userRole?: 'residential' | 'commercial' | 'admin' | 'executive';
}

export function UnifiedCommunicationCenter({ userRole = 'admin' }: UnifiedCommunicationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [ruleModalOpened, { open: openRuleModal, close: closeRuleModal }] = useDisclosure(false);
  const [templateModalOpened, { open: openTemplateModal, close: closeTemplateModal }] = useDisclosure(false);
  const [selectedRule, setSelectedRule] = useState<EscalationRule | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [notifData, rulesData, templatesData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getEscalationRules(),
        notificationService.getNotificationTemplates()
      ]);
      
      setNotifications(notifData);
      setEscalationRules(rulesData);
      setTemplates(templatesData);
    } catch (error) {
      mantineNotifications.show({
        title: 'Error',
        message: 'Failed to load communication center data',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const getNotificationStats = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const urgent = notifications.filter(n => n.priority === NotificationPriority.URGENT).length;
    const commercial = notifications.filter(n => 
      n.category.startsWith('commercial_') || 
      n.category === NotificationCategory.COMMERCIAL_OPPORTUNITY
    ).length;
    const residential = notifications.filter(n => 
      [NotificationCategory.ORDER, NotificationCategory.TRAINING, NotificationCategory.CUSTOMER].includes(n.category)
    ).length;

    return { total, unread, urgent, commercial, residential };
  };

  const getCategoryStats = () => {
    const categoryCount = notifications.reduce((acc, notif) => {
      acc[notif.category] = (acc[notif.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      label: getCategoryLabel(category)
    }));
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      [NotificationCategory.ORDER]: 'Orders',
      [NotificationCategory.TRAINING]: 'Training',
      [NotificationCategory.CUSTOMER]: 'Customers',
      [NotificationCategory.COMMERCIAL_OPPORTUNITY]: 'Commercial Opportunities',
      [NotificationCategory.COMMERCIAL_QUOTE]: 'Commercial Quotes',
      [NotificationCategory.COMMERCIAL_ENGINEER]: 'Engineers',
      [NotificationCategory.COMMERCIAL_REP]: 'Manufacturer Reps',
      [NotificationCategory.SYSTEM]: 'System',
      [NotificationCategory.INTEGRATION]: 'Integration',
      [NotificationCategory.LEAD]: 'Leads'
    };
    return labels[category] || category;
  };

  const getPriorityColor = (priority: NotificationPriority): string => {
    switch (priority) {
      case NotificationPriority.URGENT: return 'red';
      case NotificationPriority.HIGH: return 'orange';
      case NotificationPriority.MEDIUM: return 'yellow';
      default: return 'gray';
    }
  };

  const handleCreateTestNotification = async () => {
    try {
      await notificationService.createCommercialOpportunityNotification('high_value', {
        opportunityId: 'test-opp-1',
        opportunityName: 'Test High-Value Opportunity',
        estimatedValue: 850000,
        marketSegment: 'Healthcare',
        salesPhase: 'Preliminary Quote'
      });
      
      await loadData();
      mantineNotifications.show({
        title: 'Success',
        message: 'Test notification created',
        color: 'green',
      });
    } catch (error) {
      mantineNotifications.show({
        title: 'Error',
        message: 'Failed to create test notification',
        color: 'red',
      });
    }
  };

  const handleCreateLargeOpportunityAlert = async () => {
    try {
      await notificationService.notifyLargeOpportunityTeam({
        opportunityId: 'large-opp-1',
        opportunityName: 'Major Hospital Complex HVAC System',
        estimatedValue: 1200000,
        marketSegment: 'Healthcare',
        salesPhase: 'Final Quote',
        manufacturerRepName: 'John Smith Rep Co.',
        engineerName: 'Sarah Johnson, PE'
      });
      
      await loadData();
      mantineNotifications.show({
        title: 'Success',
        message: 'Large opportunity team notifications sent',
        color: 'green',
      });
    } catch (error) {
      mantineNotifications.show({
        title: 'Error',
        message: 'Failed to send team notifications',
        color: 'red',
      });
    }
  };

  const stats = getNotificationStats();
  const categoryStats = getCategoryStats();

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Text size="xl" fw={700}>Unified Communication Center</Text>
          <Text c="dimmed">Manage notifications across residential and commercial operations</Text>
        </div>
        <Group>
          <Button
            leftSection={<IconRefresh size={16} />}
            variant="light"
            onClick={loadData}
            loading={loading}
          >
            Refresh
          </Button>
          <Menu>
            <Menu.Target>
              <Button leftSection={<IconPlus size={16} />}>
                Create Test
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={handleCreateTestNotification}>
                High-Value Opportunity Alert
              </Menu.Item>
              <Menu.Item onClick={handleCreateLargeOpportunityAlert}>
                Large Opportunity Team Alert
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      {/* Overview Stats */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
          <Card withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">Total</Text>
                <Text size="xl" fw={700}>{stats.total}</Text>
              </div>
              <IconBell size={24} color="gray" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
          <Card withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">Unread</Text>
                <Text size="xl" fw={700} c="blue">{stats.unread}</Text>
              </div>
              <IconMail size={24} color="blue" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
          <Card withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">Urgent</Text>
                <Text size="xl" fw={700} c="red">{stats.urgent}</Text>
              </div>
              <IconAlertTriangle size={24} color="red" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
          <Card withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">Commercial</Text>
                <Text size="xl" fw={700} c="green">{stats.commercial}</Text>
              </div>
              <IconBuilding size={24} color="green" />
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
          <Card withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">Residential</Text>
                <Text size="xl" fw={700} c="orange">{stats.residential}</Text>
              </div>
              <IconUsers size={24} color="orange" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
            Notifications
          </Tabs.Tab>
          <Tabs.Tab value="escalations" leftSection={<IconAlertTriangle size={16} />}>
            Escalation Rules
          </Tabs.Tab>
          <Tabs.Tab value="templates" leftSection={<IconMessage size={16} />}>
            Templates
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card withBorder>
                <Text fw={600} mb="md">Recent Notifications</Text>
                <Stack gap="sm">
                  {notifications.slice(0, 5).map((notification) => (
                    <Paper key={notification.id} p="sm" withBorder>
                      <Group justify="space-between">
                        <div style={{ flex: 1 }}>
                          <Group gap="xs" mb="xs">
                            <Text fw={500} size="sm">{notification.title}</Text>
                            <Badge size="xs" color={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            <Badge size="xs" variant="light">
                              {getCategoryLabel(notification.category)}
                            </Badge>
                          </Group>
                          <Text size="xs" c="dimmed">{notification.message}</Text>
                        </div>
                        <Text size="xs" c="dimmed">
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder>
                <Text fw={600} mb="md">Category Distribution</Text>
                <Stack gap="xs">
                  {categoryStats.map(({ category, count, label }) => (
                    <Group key={category} justify="space-between">
                      <Text size="sm">{label}</Text>
                      <Badge variant="light">{count}</Badge>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="notifications" pt="md">
          <Card withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={600}>All Notifications</Text>
              <Group>
                <TextInput
                  placeholder="Search notifications..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />
                <Select
                  placeholder="Filter by category"
                  data={[
                    { value: '', label: 'All Categories' },
                    ...categoryStats.map(stat => ({ value: stat.category, label: stat.label }))
                  ]}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value || '')}
                />
              </Group>
            </Group>
            
            <Stack gap="sm">
              {notifications
                .filter(n => 
                  (!selectedCategory || n.category === selectedCategory) &&
                  (!searchQuery || 
                    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    n.message.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                )
                .map((notification) => (
                  <Paper key={notification.id} p="md" withBorder>
                    <Group justify="space-between" align="flex-start">
                      <div style={{ flex: 1 }}>
                        <Group gap="xs" mb="xs">
                          <Text fw={500}>{notification.title}</Text>
                          <Badge size="xs" color={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          <Badge size="xs" variant="light">
                            {getCategoryLabel(notification.category)}
                          </Badge>
                          {!notification.read && (
                            <Badge size="xs" color="blue">New</Badge>
                          )}
                        </Group>
                        <Text size="sm" c="dimmed" mb="xs">{notification.message}</Text>
                        <Text size="xs" c="dimmed">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Text>
                        {notification.metadata && (
                          <Box mt="xs">
                            <Text size="xs" c="dimmed">
                              Metadata: {JSON.stringify(notification.metadata, null, 2)}
                            </Text>
                          </Box>
                        )}
                      </div>
                      <Menu>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconSettings size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item>Mark as Read</Menu.Item>
                          <Menu.Item>Archive</Menu.Item>
                          <Menu.Item color="red">Delete</Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Paper>
                ))}
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="escalations" pt="md">
          <Card withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={600}>Escalation Rules</Text>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={() => {
                  setSelectedRule(null);
                  openRuleModal();
                }}
              >
                Add Rule
              </Button>
            </Group>
            
            <Stack gap="sm">
              {escalationRules.map((rule) => (
                <Paper key={rule.id} p="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>{rule.name}</Text>
                      <Text size="sm" c="dimmed">
                        Category: {getCategoryLabel(rule.category)} | 
                        Steps: {rule.escalationSteps.length} | 
                        Status: {rule.isActive ? 'Active' : 'Inactive'}
                      </Text>
                      {rule.conditions.valueThreshold && (
                        <Text size="xs" c="dimmed">
                          Value threshold: ${rule.conditions.valueThreshold.toLocaleString()}
                        </Text>
                      )}
                    </div>
                    <Group>
                      <ActionIcon
                        variant="light"
                        onClick={() => {
                          setSelectedRule(rule);
                          openRuleModal();
                        }}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="light" color="red">
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="templates" pt="md">
          <Card withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={600}>Notification Templates</Text>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={() => {
                  setSelectedTemplate(null);
                  openTemplateModal();
                }}
              >
                Add Template
              </Button>
            </Group>
            
            <Stack gap="sm">
              {templates.map((template) => (
                <Paper key={template.id} p="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>{template.name}</Text>
                      <Text size="sm" c="dimmed">
                        Category: {getCategoryLabel(template.category)} | 
                        Variables: {template.variables.join(', ')}
                      </Text>
                      <Text size="xs" c="dimmed" mt="xs">
                        {template.subject}
                      </Text>
                    </div>
                    <Group>
                      <ActionIcon
                        variant="light"
                        onClick={() => {
                          setSelectedTemplate(template);
                          openTemplateModal();
                        }}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="light" color="red">
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder>
                <Text fw={600} mb="md">Cross-Functional Team Settings</Text>
                <Stack gap="md">
                  <div>
                    <Text size="sm" fw={500} mb="xs">Large Opportunity Threshold</Text>
                    <TextInput
                      placeholder="Enter value threshold"
                      defaultValue="250000"
                      leftSection="$"
                    />
                  </div>
                  <div>
                    <Text size="sm" fw={500} mb="xs">Team Notification Recipients</Text>
                    <MultiSelect
                      placeholder="Select team members"
                      data={[
                        { value: 'sales-team', label: 'Sales Team' },
                        { value: 'engineering-support', label: 'Engineering Support' },
                        { value: 'management', label: 'Management' },
                        { value: 'regional-managers', label: 'Regional Directors' },
                      ]}
                      defaultValue={['sales-team', 'management']}
                    />
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder>
                <Text fw={600} mb="md">Integration Settings</Text>
                <Stack gap="md">
                  <div>
                    <Text size="sm" fw={500} mb="xs">Email Service</Text>
                    <Select
                      data={[
                        { value: 'sendgrid', label: 'SendGrid' },
                        { value: 'ses', label: 'Amazon SES' },
                        { value: 'smtp', label: 'SMTP' },
                      ]}
                      defaultValue="sendgrid"
                    />
                  </div>
                  <div>
                    <Text size="sm" fw={500} mb="xs">SMS Provider</Text>
                    <Select
                      data={[
                        { value: 'twilio', label: 'Twilio' },
                        { value: 'aws-sns', label: 'AWS SNS' },
                      ]}
                      defaultValue="twilio"
                    />
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>

      {/* Escalation Rule Modal */}
      <Modal
        opened={ruleModalOpened}
        onClose={closeRuleModal}
        title={selectedRule ? 'Edit Escalation Rule' : 'Create Escalation Rule'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Rule Name"
            placeholder="Enter rule name"
            defaultValue={selectedRule?.name}
          />
          <Select
            label="Category"
            data={Object.values(NotificationCategory).map(cat => ({
              value: cat,
              label: getCategoryLabel(cat)
            }))}
            defaultValue={selectedRule?.category}
          />
          <TextInput
            label="Value Threshold"
            placeholder="Enter minimum value"
            leftSection="$"
            defaultValue={selectedRule?.conditions.valueThreshold?.toString()}
          />
          <Button>Save Rule</Button>
        </Stack>
      </Modal>

      {/* Template Modal */}
      <Modal
        opened={templateModalOpened}
        onClose={closeTemplateModal}
        title={selectedTemplate ? 'Edit Template' : 'Create Template'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Template Name"
            placeholder="Enter template name"
            defaultValue={selectedTemplate?.name}
          />
          <Select
            label="Category"
            data={Object.values(NotificationCategory).map(cat => ({
              value: cat,
              label: getCategoryLabel(cat)
            }))}
            defaultValue={selectedTemplate?.category}
          />
          <TextInput
            label="Subject"
            placeholder="Enter email subject"
            defaultValue={selectedTemplate?.subject}
          />
          <Textarea
            label="Body"
            placeholder="Enter template body with {{variables}}"
            rows={4}
            defaultValue={selectedTemplate?.body}
          />
          <Button>Save Template</Button>
        </Stack>
      </Modal>
    </Container>
  );
}
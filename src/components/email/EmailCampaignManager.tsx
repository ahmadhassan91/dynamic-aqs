'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  Group,
  Text,
  Button,
  Table,
  Badge,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Textarea,
  Select,
  Paper,
  Progress,
  Grid,
  Card,
  RingProgress,
  Center,
  Alert,
  Divider,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDots,
  IconEye,
  IconSend,
  IconPlayerPause,
  IconPlayerPlay,
  IconChartBar,
  IconMail,
  IconMailOpened,
  IconClick,
  IconArrowBounce,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { 
  EmailCampaign, 
  EmailTemplate, 
  CampaignStatus, 
  RecipientStatus,
  EmailCategory 
} from '@/types/email';
import { emailService } from '@/lib/services/emailService';

export function EmailCampaignManager() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [analyticsOpened, { open: openAnalytics, close: closeAnalytics }] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt' | 'analytics'>>({
    initialValues: {
      name: '',
      description: '',
      templateId: '',
      recipients: [],
      status: CampaignStatus.DRAFT,
      scheduledAt: undefined,
      sentAt: undefined,
      completedAt: undefined,
      createdBy: 'current-user',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 characters' : null),
      templateId: (value) => (!value ? 'Template is required' : null),
      recipients: (value) => (value.length === 0 ? 'At least one recipient is required' : null),
    },
  });

  useEffect(() => {
    loadCampaigns();
    loadTemplates();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await emailService.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load campaigns',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await emailService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleCreate = () => {
    form.reset();
    setSelectedCampaign(null);
    setIsEditing(false);
    openModal();
  };

  const handleEdit = (campaign: EmailCampaign) => {
    form.setValues({
      name: campaign.name,
      description: campaign.description,
      templateId: campaign.templateId,
      recipients: campaign.recipients,
      status: campaign.status,
      scheduledAt: campaign.scheduledAt,
      sentAt: campaign.sentAt,
      completedAt: campaign.completedAt,
      createdBy: campaign.createdBy,
    });
    setSelectedCampaign(campaign);
    setIsEditing(true);
    openModal();
  };

  const handleViewAnalytics = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    openAnalytics();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (isEditing && selectedCampaign) {
        // Update campaign logic would go here
        notifications.show({
          title: 'Success',
          message: 'Campaign updated successfully',
          color: 'green',
        });
      } else {
        await emailService.createCampaign(values);
        notifications.show({
          title: 'Success',
          message: 'Campaign created successfully',
          color: 'green',
        });
      }
      closeModal();
      loadCampaigns();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save campaign',
        color: 'red',
      });
    }
  };

  const handleSendCampaign = async (campaign: EmailCampaign) => {
    try {
      await emailService.sendCampaign(campaign.id);
      notifications.show({
        title: 'Success',
        message: 'Campaign is being sent',
        color: 'green',
      });
      loadCampaigns();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to send campaign',
        color: 'red',
      });
    }
  };

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.DRAFT:
        return 'gray';
      case CampaignStatus.SCHEDULED:
        return 'blue';
      case CampaignStatus.SENDING:
        return 'orange';
      case CampaignStatus.SENT:
        return 'green';
      case CampaignStatus.COMPLETED:
        return 'green';
      case CampaignStatus.CANCELLED:
        return 'red';
      case CampaignStatus.FAILED:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: CampaignStatus) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCategoryLabel = (category: EmailCategory) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderAnalytics = () => {
    if (!selectedCampaign) return null;

    const { analytics } = selectedCampaign;

    return (
      <Stack>
        <Grid>
          <Grid.Col span={6}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Delivery Rate
                  </Text>
                  <Text fw={700} size="xl">
                    {analytics.deliveryRate.toFixed(1)}%
                  </Text>
                </div>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[{ value: analytics.deliveryRate, color: 'blue' }]}
                />
              </Group>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Open Rate
                  </Text>
                  <Text fw={700} size="xl">
                    {analytics.openRate.toFixed(1)}%
                  </Text>
                </div>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[{ value: analytics.openRate, color: 'green' }]}
                />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Click Rate
                  </Text>
                  <Text fw={700} size="xl">
                    {analytics.clickRate.toFixed(1)}%
                  </Text>
                </div>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[{ value: analytics.clickRate, color: 'orange' }]}
                />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Bounce Rate
                  </Text>
                  <Text fw={700} size="xl">
                    {analytics.bounceRate.toFixed(1)}%
                  </Text>
                </div>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[{ value: analytics.bounceRate, color: 'red' }]}
                />
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Paper p="md" withBorder>
          <Text fw={500} mb="md">Campaign Statistics</Text>
          <Grid>
            <Grid.Col span={3}>
              <Group>
                <IconMail size={20} color="blue" />
                <div>
                  <Text size="sm" c="dimmed">Total Recipients</Text>
                  <Text fw={500}>{analytics.totalRecipients}</Text>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col span={3}>
              <Group>
                <IconSend size={20} color="green" />
                <div>
                  <Text size="sm" c="dimmed">Sent</Text>
                  <Text fw={500}>{analytics.sent}</Text>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col span={3}>
              <Group>
                <IconMailOpened size={20} color="orange" />
                <div>
                  <Text size="sm" c="dimmed">Opened</Text>
                  <Text fw={500}>{analytics.opened}</Text>
                </div>
              </Group>
            </Grid.Col>
            <Grid.Col span={3}>
              <Group>
                <IconClick size={20} color="purple" />
                <div>
                  <Text size="sm" c="dimmed">Clicked</Text>
                  <Text fw={500}>{analytics.clicked}</Text>
                </div>
              </Group>
            </Grid.Col>
          </Grid>
        </Paper>

        <Paper p="md" withBorder>
          <Text fw={500} mb="md">Recipient Details</Text>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Email</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Sent At</Table.Th>
                <Table.Th>Opened At</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {selectedCampaign.recipients.map((recipient) => (
                <Table.Tr key={recipient.id}>
                  <Table.Td>{recipient.email}</Table.Td>
                  <Table.Td>{recipient.name}</Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(recipient.status as any)} variant="light">
                      {getStatusLabel(recipient.status as any)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {recipient.sentAt ? recipient.sentAt.toLocaleString() : '-'}
                  </Table.Td>
                  <Table.Td>
                    {recipient.openedAt ? recipient.openedAt.toLocaleString() : '-'}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    );
  };

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl" fw={600}>Email Campaigns</Text>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Create Campaign
        </Button>
      </Group>

      <Paper withBorder>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Campaign Name</Table.Th>
              <Table.Th>Template</Table.Th>
              <Table.Th>Recipients</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Progress</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {campaigns.map((campaign) => {
              const template = templates.find(t => t.id === campaign.templateId);
              const progress = campaign.analytics.totalRecipients > 0 
                ? (campaign.analytics.sent / campaign.analytics.totalRecipients) * 100 
                : 0;

              return (
                <Table.Tr key={campaign.id}>
                  <Table.Td>
                    <div>
                      <Text fw={500}>{campaign.name}</Text>
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {campaign.description}
                      </Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{template?.name || 'Unknown'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{campaign.recipients.length}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(campaign.status)} variant="light">
                      {getStatusLabel(campaign.status)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Progress value={progress} size="sm" />
                    <Text size="xs" c="dimmed" mt={2}>
                      {campaign.analytics.sent}/{campaign.analytics.totalRecipients}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {campaign.createdAt.toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        onClick={() => handleViewAnalytics(campaign)}
                      >
                        <IconChartBar size={16} />
                      </ActionIcon>
                      {campaign.status === CampaignStatus.DRAFT && (
                        <ActionIcon
                          variant="subtle"
                          color="green"
                          onClick={() => handleSendCampaign(campaign)}
                        >
                          <IconSend size={16} />
                        </ActionIcon>
                      )}
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => handleEdit(campaign)}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconChartBar size={14} />}
                            onClick={() => handleViewAnalytics(campaign)}
                          >
                            View Analytics
                          </Menu.Item>
                          {campaign.status === CampaignStatus.DRAFT && (
                            <Menu.Item
                              leftSection={<IconSend size={14} />}
                              onClick={() => handleSendCampaign(campaign)}
                            >
                              Send Campaign
                            </Menu.Item>
                          )}
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={isEditing ? 'Edit Campaign' : 'Create Campaign'}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Campaign Name"
              placeholder="Enter campaign name"
              {...form.getInputProps('name')}
            />

            <Textarea
              label="Description"
              placeholder="Enter campaign description"
              {...form.getInputProps('description')}
            />

            <Select
              label="Email Template"
              placeholder="Select a template"
              data={templates.map(t => ({
                value: t.id,
                label: `${t.name} (${getCategoryLabel(t.category)})`,
              }))}
              {...form.getInputProps('templateId')}
            />

            <Alert color="blue">
              Recipients will be added in the next step after creating the campaign.
            </Alert>

            <Divider />

            <Group justify="flex-end">
              <Button variant="light" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Campaign' : 'Create Campaign'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Analytics Modal */}
      <Modal
        opened={analyticsOpened}
        onClose={closeAnalytics}
        title={`Campaign Analytics - ${selectedCampaign?.name}`}
        size="xl"
      >
        {renderAnalytics()}
      </Modal>
    </Stack>
  );
}
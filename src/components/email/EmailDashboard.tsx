'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  Group,
  Text,
  Button,
  Tabs,
  Paper,
  Grid,
  Card,
  RingProgress,
  Table,
  Badge,
  ActionIcon,
  Select,
} from '@mantine/core';
import {
  IconMail,
  IconSend,
  IconTemplate,
  IconChartBar,
  IconPlus,
  IconEye,
  IconMailOpened,
  IconClick,
  IconArrowBounce,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { EmailTemplateManager } from './EmailTemplateManager';
import { EmailCampaignManager } from './EmailCampaignManager';
import { EmailComposer } from './EmailComposer';
import { emailService } from '@/lib/services/emailService';

export function EmailDashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [composerOpened, { open: openComposer, close: closeComposer }] = useDisclosure(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentEmails, setRecentEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
    loadRecentEmails();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await emailService.getEmailAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const loadRecentEmails = async () => {
    try {
      const data = await emailService.getEmailLogs();
      setRecentEmails(data.slice(0, 10)); // Get last 10 emails
    } catch (error) {
      console.error('Failed to load recent emails:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'green';
      case 'opened':
        return 'blue';
      case 'clicked':
        return 'purple';
      case 'bounced':
        return 'red';
      case 'sent':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const renderOverview = () => (
    <Stack>
      {/* Quick Actions */}
      <Paper p="md" withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={500}>Quick Actions</Text>
        </Group>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openComposer}
          >
            Compose Email
          </Button>
          <Button
            variant="light"
            leftSection={<IconTemplate size={16} />}
            onClick={() => setActiveTab('templates')}
          >
            Manage Templates
          </Button>
          <Button
            variant="light"
            leftSection={<IconSend size={16} />}
            onClick={() => setActiveTab('campaigns')}
          >
            Create Campaign
          </Button>
        </Group>
      </Paper>

      {/* Analytics Cards */}
      {analytics && (
        <Grid>
          <Grid.Col span={3}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Total Emails
                  </Text>
                  <Text fw={700} size="xl">
                    {analytics.total}
                  </Text>
                </div>
                <IconMail size={32} color="blue" />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
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
                  size={60}
                  roundCaps
                  thickness={6}
                  sections={[{ value: analytics.deliveryRate, color: 'green' }]}
                />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
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
                  size={60}
                  roundCaps
                  thickness={6}
                  sections={[{ value: analytics.openRate, color: 'blue' }]}
                />
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
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
                  size={60}
                  roundCaps
                  thickness={6}
                  sections={[{ value: analytics.clickRate, color: 'orange' }]}
                />
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      )}

      {/* Recent Email Activity */}
      <Paper withBorder>
        <Group justify="space-between" p="md" pb={0}>
          <Text fw={500}>Recent Email Activity</Text>
          <Select
            placeholder="Filter by status"
            data={[
              { value: 'all', label: 'All Status' },
              { value: 'sent', label: 'Sent' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'opened', label: 'Opened' },
              { value: 'clicked', label: 'Clicked' },
              { value: 'bounced', label: 'Bounced' },
            ]}
            size="xs"
            w={150}
          />
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Recipient</Table.Th>
              <Table.Th>Subject</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Sent At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recentEmails.map((email) => (
              <Table.Tr key={email.id}>
                <Table.Td>
                  <div>
                    <Text size="sm" fw={500}>{email.recipientName}</Text>
                    <Text size="xs" c="dimmed">{email.recipientEmail}</Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" lineClamp={1}>{email.subject}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(email.status)} variant="light">
                    {email.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {email.sentAt ? new Date(email.sentAt).toLocaleString() : '-'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon variant="subtle" size="sm">
                    <IconEye size={14} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl" fw={600}>Email Management</Text>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openComposer}
        >
          Compose Email
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="templates" leftSection={<IconTemplate size={16} />}>
            Templates
          </Tabs.Tab>
          <Tabs.Tab value="campaigns" leftSection={<IconSend size={16} />}>
            Campaigns
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          {renderOverview()}
        </Tabs.Panel>

        <Tabs.Panel value="templates" pt="md">
          <EmailTemplateManager />
        </Tabs.Panel>

        <Tabs.Panel value="campaigns" pt="md">
          <EmailCampaignManager />
        </Tabs.Panel>
      </Tabs>

      <EmailComposer
        opened={composerOpened}
        onClose={closeComposer}
      />
    </Stack>
  );
}
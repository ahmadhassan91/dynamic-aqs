'use client';

import { useState } from 'react';
import {
  Paper,
  Title,
  Text,
  Group,
  Button,
  Tabs,
  Stack,
  SimpleGrid,
  Card,
  Container
} from '@mantine/core';
import {
  IconDashboard,
  IconUsers,
  IconActivity,
  IconSettings,
  IconPlus,
  IconFileImport
} from '@tabler/icons-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleUserManagement } from '@/components/admin/SimpleUserManagement';

type AdminTab = 'overview' | 'users' | 'activity' | 'config';

export default function TestAdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const renderOverview = () => (
    <Stack gap="md">
      {/* Quick Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Stack gap="xs">
              <Text size="xl" fw={700} c="blue">24</Text>
              <Text size="sm" c="dimmed">Active Users</Text>
            </Stack>
            <IconUsers size={24} color="var(--mantine-color-blue-6)" />
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Stack gap="xs">
              <Text size="xl" fw={700} c="green">5</Text>
              <Text size="sm" c="dimmed">Integrations</Text>
            </Stack>
            <IconSettings size={24} color="var(--mantine-color-green-6)" />
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Stack gap="xs">
              <Text size="xl" fw={700} c="yellow">3</Text>
              <Text size="sm" c="dimmed">Data Issues</Text>
            </Stack>
            <IconActivity size={24} color="var(--mantine-color-yellow-6)" />
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Stack gap="xs">
              <Text size="xl" fw={700} c="violet">2h ago</Text>
              <Text size="sm" c="dimmed">Last Backup</Text>
            </Stack>
            <IconDashboard size={24} color="var(--mantine-color-violet-6)" />
          </Group>
        </Card>
      </SimpleGrid>

      {/* Quick Actions */}
      <Paper shadow="sm" p="md">
        <Title order={3} mb="md">Quick Actions</Title>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('users')}
          >
            <Group>
              <IconUsers size={32} color="var(--mantine-color-blue-6)" />
              <Stack gap="xs">
                <Text fw={500}>Manage Users</Text>
                <Text size="sm" c="dimmed">Add, edit, or deactivate user accounts</Text>
              </Stack>
            </Group>
          </Card>

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('activity')}
          >
            <Group>
              <IconActivity size={32} color="var(--mantine-color-green-6)" />
              <Stack gap="xs">
                <Text fw={500}>System Health</Text>
                <Text size="sm" c="dimmed">Monitor system performance and alerts</Text>
              </Stack>
            </Group>
          </Card>

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('config')}
          >
            <Group>
              <IconSettings size={32} color="var(--mantine-color-violet-6)" />
              <Stack gap="xs">
                <Text fw={500}>Configuration</Text>
                <Text size="sm" c="dimmed">System settings and configuration</Text>
              </Stack>
            </Group>
          </Card>
        </SimpleGrid>
      </Paper>

      {/* Recent Activity */}
      <Paper shadow="sm" p="md">
        <Title order={3} mb="md">Recent System Activity</Title>
        <Stack gap="md">
          <Group>
            <IconUsers size={20} color="var(--mantine-color-blue-6)" />
            <Stack gap="xs">
              <Text size="sm">User login: john.doe@dynamicaqs.com</Text>
              <Text size="xs" c="dimmed">2 minutes ago</Text>
            </Stack>
          </Group>
          <Group>
            <IconSettings size={20} color="var(--mantine-color-green-6)" />
            <Stack gap="xs">
              <Text size="sm">Configuration updated: SMTP settings</Text>
              <Text size="xs" c="dimmed">15 minutes ago</Text>
            </Stack>
          </Group>
          <Group>
            <IconDashboard size={20} color="var(--mantine-color-violet-6)" />
            <Stack gap="xs">
              <Text size="sm">Backup completed successfully</Text>
              <Text size="xs" c="dimmed">1 hour ago</Text>
            </Stack>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );

  const renderUsers = () => <SimpleUserManagement />;

  const renderActivity = () => (
    <Paper shadow="sm" p="md">
      <Title order={3} mb="md">Activity Monitor</Title>
      <Text>Activity monitoring functionality would go here.</Text>
    </Paper>
  );

  const renderConfig = () => (
    <Paper shadow="sm" p="md">
      <Title order={3} mb="md">System Configuration</Title>
      <Text>System configuration functionality would go here.</Text>
    </Paper>
  );

  return (
    <AppLayout>
      <Container size="xl" py="md">
        <Stack gap="md">
          {/* Header */}
          <Paper shadow="sm" p="md">
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Title order={1}>System Administration (Test)</Title>
                <Text size="sm" c="dimmed">
                  Test page for admin functionality with proper Mantine styling
                </Text>
              </Stack>
              <Group gap="sm">
                <Button leftSection={<IconPlus size={16} />}>
                  Add User
                </Button>
                <Button variant="light" leftSection={<IconFileImport size={16} />}>
                  Import Users
                </Button>
              </Group>
            </Group>
          </Paper>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value as AdminTab)}>
            <Tabs.List>
              <Tabs.Tab value="overview" leftSection={<IconDashboard size={16} />}>
                Overview
              </Tabs.Tab>
              <Tabs.Tab value="users" leftSection={<IconUsers size={16} />}>
                User Management
              </Tabs.Tab>
              <Tabs.Tab value="activity" leftSection={<IconActivity size={16} />}>
                Activity Monitor
              </Tabs.Tab>
              <Tabs.Tab value="config" leftSection={<IconSettings size={16} />}>
                Configuration
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="overview" pt="lg">
              {renderOverview()}
            </Tabs.Panel>
            
            <Tabs.Panel value="users" pt="lg">
              {renderUsers()}
            </Tabs.Panel>
            
            <Tabs.Panel value="activity" pt="lg">
              {renderActivity()}
            </Tabs.Panel>
            
            <Tabs.Panel value="config" pt="lg">
              {renderConfig()}
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </AppLayout>
  );
}
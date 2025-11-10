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
  Card
} from '@mantine/core';
import {
  IconDashboard,
  IconUsers,
  IconActivity,
  IconSettings,
  IconPlug,
  IconHeartbeat,
  IconSearch,
  IconDatabase,
  IconPlus,
  IconFileImport
} from '@tabler/icons-react';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';
import UserManagementDashboard from '@/components/admin/UserManagementDashboard';
import UserFormModal from '@/components/admin/UserFormModal';
import UserImportModal from '@/components/admin/UserImportModal';
import UserActivityMonitor from '@/components/admin/UserActivityMonitor';
import SystemConfigurationDashboard from '@/components/admin/SystemConfigurationDashboard';
import IntegrationStatusMonitor from '@/components/admin/IntegrationStatusMonitor';
import SystemHealthMonitor from '@/components/admin/SystemHealthMonitor';
import DataQualityDashboard from '@/components/admin/DataQualityDashboard';
import BackupManagement from '@/components/admin/BackupManagement';
import { User, UserImportResult } from '@/types/admin';
import { AppLayout } from '@/components/layout/AppLayout';

type AdminTab = 'overview' | 'users' | 'activity' | 'config' | 'integrations' | 'health' | 'data-quality' | 'backups';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showUserImport, setShowUserImport] = useState(false);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleUserSave = (user: User) => {
    // Handle user save
    console.log('User saved:', user);
    setShowUserForm(false);
    setSelectedUser(null);
  };

  const handleImportComplete = (result: UserImportResult) => {
    console.log('Import completed:', result);
    setShowUserImport(false);
  };



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
            <IconPlug size={24} color="var(--mantine-color-green-6)" />
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Stack gap="xs">
              <Text size="xl" fw={700} c="yellow">3</Text>
              <Text size="sm" c="dimmed">Data Issues</Text>
            </Stack>
            <IconSearch size={24} color="var(--mantine-color-yellow-6)" />
          </Group>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Stack gap="xs">
              <Text size="xl" fw={700} c="violet">2h ago</Text>
              <Text size="sm" c="dimmed">Last Backup</Text>
            </Stack>
            <IconDatabase size={24} color="var(--mantine-color-violet-6)" />
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
            onClick={() => setActiveTab('health')}
          >
            <Group>
              <IconHeartbeat size={32} color="var(--mantine-color-green-6)" />
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
            onClick={() => setActiveTab('backups')}
          >
            <Group>
              <IconDatabase size={32} color="var(--mantine-color-violet-6)" />
              <Stack gap="xs">
                <Text fw={500}>Create Backup</Text>
                <Text size="sm" c="dimmed">Backup system data and configurations</Text>
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
            <IconDatabase size={20} color="var(--mantine-color-violet-6)" />
            <Stack gap="xs">
              <Text size="sm">Backup completed successfully</Text>
              <Text size="xs" c="dimmed">1 hour ago</Text>
            </Stack>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );



  return (
    <MockDataProvider>
      <AppLayout>
        <Stack gap="md" p="md">
          {/* Header */}
          <Paper shadow="sm" p="md">
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Title order={1}>System Administration</Title>
                <Text size="sm" c="dimmed">
                  Manage users, system configuration, and monitor system health
                </Text>
              </Stack>
              <Group gap="sm">
                <Button leftSection={<IconPlus size={16} />} onClick={() => setShowUserForm(true)}>
                  Add User
                </Button>
                <Button variant="light" leftSection={<IconFileImport size={16} />} onClick={() => setShowUserImport(true)}>
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
              <Tabs.Tab value="integrations" leftSection={<IconPlug size={16} />}>
                Integrations
              </Tabs.Tab>
              <Tabs.Tab value="health" leftSection={<IconHeartbeat size={16} />}>
                System Health
              </Tabs.Tab>
              <Tabs.Tab value="data-quality" leftSection={<IconSearch size={16} />}>
                Data Quality
              </Tabs.Tab>
              <Tabs.Tab value="backups" leftSection={<IconDatabase size={16} />}>
                Backups
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="overview" pt="lg">
              {renderOverview()}
            </Tabs.Panel>
            
            <Tabs.Panel value="users" pt="lg">
              <UserManagementDashboard onUserSelect={handleUserSelect} />
            </Tabs.Panel>
            
            <Tabs.Panel value="activity" pt="lg">
              <UserActivityMonitor />
            </Tabs.Panel>
            
            <Tabs.Panel value="config" pt="lg">
              <SystemConfigurationDashboard />
            </Tabs.Panel>
            
            <Tabs.Panel value="integrations" pt="lg">
              <IntegrationStatusMonitor />
            </Tabs.Panel>
            
            <Tabs.Panel value="health" pt="lg">
              <SystemHealthMonitor />
            </Tabs.Panel>
            
            <Tabs.Panel value="data-quality" pt="lg">
              <DataQualityDashboard />
            </Tabs.Panel>
            
            <Tabs.Panel value="backups" pt="lg">
              <BackupManagement />
            </Tabs.Panel>
          </Tabs>

            {/* Modals */}
            <UserFormModal
              isOpen={showUserForm}
              onClose={() => {
                setShowUserForm(false);
                setSelectedUser(null);
              }}
              user={selectedUser}
              onSave={handleUserSave}
            />

            <UserImportModal
              isOpen={showUserImport}
              onClose={() => setShowUserImport(false)}
              onImportComplete={handleImportComplete}
            />
        </Stack>
      </AppLayout>
    </MockDataProvider>
  );
}
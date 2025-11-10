'use client';

import React from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Table,
  Badge,
  Progress,
  Card,
  SimpleGrid
} from '@mantine/core';
import { IconDatabase, IconDownload, IconTrash, IconPlus, IconClock } from '@tabler/icons-react';

export default function BackupManagement() {
  const backups = [
    {
      id: '1',
      name: 'Daily Backup - Nov 4, 2024',
      type: 'Automatic',
      size: '2.4 GB',
      created: '2024-11-04 02:00:00',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Weekly Backup - Nov 1, 2024',
      type: 'Automatic',
      size: '2.3 GB',
      created: '2024-11-01 02:00:00',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Manual Backup - Oct 30, 2024',
      type: 'Manual',
      size: '2.2 GB',
      created: '2024-10-30 14:30:00',
      status: 'completed'
    },
    {
      id: '4',
      name: 'System Backup - Oct 28, 2024',
      type: 'System',
      size: '1.8 GB',
      created: '2024-10-28 02:00:00',
      status: 'completed'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Automatic': return 'blue';
      case 'Manual': return 'green';
      case 'System': return 'violet';
      default: return 'gray';
    }
  };

  return (
    <Stack gap="md">
      <Paper shadow="sm" p="md">
        <Group justify="space-between" mb="md">
          <div>
            <Title order={2}>Backup Management</Title>
            <Text c="dimmed">Manage system backups and data recovery</Text>
          </div>
          <Button leftSection={<IconPlus size={16} />}>
            Create Backup
          </Button>
        </Group>

        {/* Backup Statistics */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md" mb="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <IconDatabase size={24} color="var(--mantine-color-blue-6)" />
              <Text size="xl" fw={700}>12</Text>
            </Group>
            <Text size="sm" c="dimmed">Total Backups</Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <IconClock size={24} color="var(--mantine-color-green-6)" />
              <Text size="xl" fw={700}>2h ago</Text>
            </Group>
            <Text size="sm" c="dimmed">Last Backup</Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <IconDatabase size={24} color="var(--mantine-color-violet-6)" />
              <Text size="xl" fw={700}>28.5 GB</Text>
            </Group>
            <Text size="sm" c="dimmed">Total Size</Text>
          </Card>
        </SimpleGrid>

        {/* Backup Schedule Status */}
        <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
          <Group justify="space-between" mb="sm">
            <Text fw={500}>Next Scheduled Backup</Text>
            <Badge color="blue" variant="light">Active</Badge>
          </Group>
          <Text size="sm" c="dimmed" mb="sm">Daily backup scheduled for tomorrow at 2:00 AM</Text>
          <Stack gap="xs">
            <Progress value={75} />
            <Text size="xs" c="dimmed">6 hours remaining</Text>
          </Stack>
        </Card>

        {/* Backup List */}
        <Title order={4} mb="md">Backup History</Title>
        <Paper shadow="sm">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Backup Name</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Size</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {backups.map((backup) => (
                <Table.Tr key={backup.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <IconDatabase size={16} />
                      <Text fw={500}>{backup.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getTypeColor(backup.type)} variant="light">
                      {backup.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text>{backup.size}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {new Date(backup.created).toLocaleString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="green" variant="light">
                      {backup.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button size="xs" variant="light" leftSection={<IconDownload size={14} />}>
                        Download
                      </Button>
                      <Button size="xs" color="red" variant="light" leftSection={<IconTrash size={14} />}>
                        Delete
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Paper>
    </Stack>
  );
}
'use client';

import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  TextInput,
  Select,
  Table,
  Badge,
  ActionIcon
} from '@mantine/core';
import { IconSearch, IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';

interface SimpleUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const mockUsers: SimpleUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@dynamicaqs.com',
    role: 'Territory Manager',
    status: 'active',
    lastLogin: '15/01/2024'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@dynamicaqs.com',
    role: 'Regional Director',
    status: 'active',
    lastLogin: '14/01/2024'
  }
];

export function SimpleUserManagement() {
  return (
    <Stack gap="md">
      <Paper shadow="sm" p="md">
        <Group justify="space-between" mb="md">
          <Title order={3}>User Management</Title>
          <Text size="sm" c="dimmed">
            Manage user accounts, roles, and permissions
          </Text>
        </Group>

        <Group mb="md">
          <Button leftSection={<IconPlus size={16} />}>Import Users</Button>
          <Button leftSection={<IconPlus size={16} />}>Add User</Button>
        </Group>

        <Group mb="md">
          <TextInput
            placeholder="Search users..."
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="All Roles"
            data={[
              { value: 'all', label: 'All Roles' },
              { value: 'territory_manager', label: 'Territory Manager' },
              { value: 'regional_manager', label: 'Regional Director' },
              { value: 'admin', label: 'Admin' }
            ]}
          />
          <Select
            placeholder="All Statuses"
            data={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
          <Button variant="subtle">Clear Filters</Button>
        </Group>

        <Text size="sm" c="dimmed" mb="md">
          Users ({mockUsers.length})
        </Text>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Last Login</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockUsers.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Stack gap="xs">
                    <Text fw={500}>{user.name}</Text>
                    <Text size="sm" c="dimmed">{user.email}</Text>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Text>{user.role}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={user.status === 'active' ? 'green' : 'red'}
                    variant="light"
                  >
                    {user.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text c="dimmed">{user.lastLogin}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="subtle" size="sm">
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" size="sm" color="red">
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Text size="sm" c="dimmed" mt="md">
          Showing 1 to 2 of 2 results
        </Text>
      </Paper>
    </Stack>
  );
}
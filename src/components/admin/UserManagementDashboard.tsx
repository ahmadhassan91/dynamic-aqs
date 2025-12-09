'use client';

import React, { useState, useEffect } from 'react';
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
  Checkbox,
  Badge,
  Avatar,
  ActionIcon,
  Pagination,
  Loader,
  Alert
} from '@mantine/core';
import { IconSearch, IconEdit, IconTrash, IconDownload, IconPlus, IconFileImport } from '@tabler/icons-react';
import { User, UserRole, UserStatus, BulkUserOperation } from '@/types/admin';
import { adminService } from '@/lib/services/adminService';

interface UserManagementDashboardProps {
  onUserSelect?: (user: User) => void;
}

export default function UserManagementDashboard({ onUserSelect }: UserManagementDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    role: '',
    status: '' as UserStatus | '',
    search: '',
    page: 1,
    limit: 20
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock data for now since the service might not be fully implemented
      const mockUsers: User[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@dynamicaqs.com',
          role: { id: '1', name: 'Territory Manager', permissions: [] },
          status: UserStatus.ACTIVE,
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@dynamicaqs.com',
          role: { id: '2', name: 'Regional Director', permissions: [] },
          status: UserStatus.ACTIVE,
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      const mockRoles: UserRole[] = [
        { id: '1', name: 'Territory Manager', permissions: [] },
        { id: '2', name: 'Regional Director', permissions: [] },
        { id: '3', name: 'Admin', permissions: [] }
      ];

      setUsers(mockUsers);
      setRoles(mockRoles);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkOperation = async (operation: string) => {
    if (selectedUsers.length === 0) return;

    try {
      // Mock bulk operation
      console.log('Bulk operation:', operation, selectedUsers);
      setSelectedUsers([]);
      loadData();
    } catch (error) {
      console.error('Bulk operation failed:', error);
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    try {
      // Mock export
      console.log('Exporting users as:', format);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const statusColors = {
      [UserStatus.ACTIVE]: 'green',
      [UserStatus.INACTIVE]: 'gray',
      [UserStatus.PENDING]: 'yellow',
      [UserStatus.SUSPENDED]: 'red'
    };

    return (
      <Badge color={statusColors[status]} variant="light">
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Stack align="center" justify="center" h={300}>
        <Loader size="lg" />
        <Text>Loading users...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      {/* Header */}
      <Paper shadow="sm" p="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={2}>User Management</Title>
            <Text c="dimmed">Manage user accounts, roles, and permissions</Text>
          </Stack>
          <Group gap="sm">
            <Button variant="light" leftSection={<IconFileImport size={16} />}>
              Import Users
            </Button>
            <Button leftSection={<IconPlus size={16} />}>
              Add User
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* Filters */}
      <Paper shadow="sm" p="md">
        <Group grow>
          <TextInput
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.currentTarget.value, page: 1 })}
            leftSection={<IconSearch size={16} />}
          />
          <Select
            placeholder="All Roles"
            value={filters.role}
            onChange={(value) => setFilters({ ...filters, role: value || '', page: 1 })}
            data={[
              { value: '', label: 'All Roles' },
              ...roles.map(role => ({ value: role.id, label: role.name }))
            ]}
          />
          <Select
            placeholder="All Statuses"
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: (value as UserStatus) || '', page: 1 })}
            data={[
              { value: '', label: 'All Statuses' },
              ...Object.values(UserStatus).map(status => ({ value: status, label: status }))
            ]}
          />
          <Button
            variant="light"
            onClick={() => setFilters({ role: '', status: '', search: '', page: 1, limit: 20 })}
          >
            Clear Filters
          </Button>
        </Group>
      </Paper>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Alert color="blue" title={`${selectedUsers.length} user(s) selected`}>
          <Group gap="sm">
            <Button size="xs" color="green" onClick={() => handleBulkOperation('activate')}>
              Activate
            </Button>
            <Button size="xs" color="yellow" onClick={() => handleBulkOperation('deactivate')}>
              Deactivate
            </Button>
            <Button size="xs" color="red" onClick={() => handleBulkOperation('delete')}>
              Delete
            </Button>
          </Group>
        </Alert>
      )}

      {/* Users Table */}
      <Paper shadow="sm">
        <Group justify="space-between" p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
          <Title order={3}>Users ({users.length})</Title>
          <Group gap="sm">
            <Button variant="light" size="sm" leftSection={<IconDownload size={16} />} onClick={() => handleExport('csv')}>
              Export CSV
            </Button>
            <Button variant="light" size="sm" leftSection={<IconDownload size={16} />} onClick={() => handleExport('xlsx')}>
              Export Excel
            </Button>
          </Group>
        </Group>
        
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  checked={selectedUsers.length === users.length && users.length > 0}
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                  onChange={(event) => {
                    if (event.currentTarget.checked) {
                      setSelectedUsers(users.map(u => u.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Last Login</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={(event) => {
                      if (event.currentTarget.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                  />
                </Table.Td>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar size="sm" radius="xl">
                      {user.firstName[0]}{user.lastName[0]}
                    </Avatar>
                    <Stack gap={0}>
                      <Text fw={500} size="sm">{user.firstName} {user.lastName}</Text>
                      <Text c="dimmed" size="xs">{user.email}</Text>
                    </Stack>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{user.role.name}</Text>
                </Table.Td>
                <Table.Td>
                  {getStatusBadge(user.status)}
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => onUserSelect?.(user)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red">
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {/* Pagination */}
        <Group justify="space-between" p="md">
          <Text size="sm" c="dimmed">
            Showing {((filters.page - 1) * filters.limit) + 1} to {Math.min(filters.page * filters.limit, users.length)} of {users.length} results
          </Text>
          <Pagination
            value={filters.page}
            onChange={(page) => setFilters({ ...filters, page })}
            total={Math.ceil(users.length / filters.limit)}
            size="sm"
          />
        </Group>
      </Paper>
    </Stack>
  );
}
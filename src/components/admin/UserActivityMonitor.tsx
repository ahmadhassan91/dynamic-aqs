'use client';

import React from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  Table,
  Badge,
  Group,
  Avatar
} from '@mantine/core';

export default function UserActivityMonitor() {
  const mockActivities = [
    {
      id: '1',
      user: 'John Doe',
      action: 'User Login',
      timestamp: new Date().toISOString(),
      details: 'Successful login from 192.168.1.100'
    },
    {
      id: '2',
      user: 'Jane Smith',
      action: 'Data Export',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      details: 'Exported customer data to CSV'
    },
    {
      id: '3',
      user: 'Mike Davis',
      action: 'User Created',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      details: 'Created new user account for Sarah Wilson'
    }
  ];

  return (
    <Stack gap="md">
      <Paper shadow="sm" p="md">
        <Title order={2} mb="md">User Activity Monitor</Title>
        <Text c="dimmed" mb="lg">
          Monitor user activities and system access logs
        </Text>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Action</Table.Th>
              <Table.Th>Timestamp</Table.Th>
              <Table.Th>Details</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockActivities.map((activity) => (
              <Table.Tr key={activity.id}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar size="sm" radius="xl">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Text fw={500} size="sm">{activity.user}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" color="blue">
                    {activity.action}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {new Date(activity.timestamp).toLocaleString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{activity.details}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
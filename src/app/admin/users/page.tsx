'use client';

import React from 'react';
import { Title, Text, Stack, Paper } from '@mantine/core';
import { AppLayout } from '@/components/layout/AppLayout';
import UserManagementDashboard from '@/components/admin/UserManagementDashboard';

export default function AdminUsersPage() {
  return (
    <AppLayout>
      <Stack gap="md">
        <Paper shadow="sm" p="md">
          <Stack gap="xs">
            <Title order={1}>User Management</Title>
            <Text size="sm" c="dimmed">
              Manage users, roles, and permissions
            </Text>
          </Stack>
        </Paper>
        <UserManagementDashboard />
      </Stack>
    </AppLayout>
  );
}
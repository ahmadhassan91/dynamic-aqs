'use client';

import React from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Card,
  Group,
  Switch,
  Button,
  TextInput
} from '@mantine/core';
import { IconSettings, IconMail, IconDatabase, IconShield } from '@tabler/icons-react';

export default function SystemConfigurationDashboard() {
  return (
    <Stack gap="md">
      <Paper shadow="sm" p="md">
        <Title order={2} mb="md">System Configuration</Title>
        <Text c="dimmed" mb="lg">
          Manage system settings and configuration options
        </Text>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconMail size={24} color="var(--mantine-color-blue-6)" />
              <Title order={4}>Email Settings</Title>
            </Group>
            <Stack gap="sm">
              <TextInput label="SMTP Server" placeholder="smtp.example.com" />
              <TextInput label="SMTP Port" placeholder="587" />
              <TextInput label="Username" placeholder="user@example.com" />
              <Switch label="Enable SSL/TLS" />
              <Button size="sm">Test Connection</Button>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconDatabase size={24} color="var(--mantine-color-green-6)" />
              <Title order={4}>Database Settings</Title>
            </Group>
            <Stack gap="sm">
              <TextInput label="Connection String" placeholder="Server=localhost;Database=..." />
              <Switch label="Enable Connection Pooling" defaultChecked />
              <Switch label="Enable Query Logging" />
              <Button size="sm">Test Connection</Button>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconShield size={24} color="var(--mantine-color-red-6)" />
              <Title order={4}>Security Settings</Title>
            </Group>
            <Stack gap="sm">
              <Switch label="Require Two-Factor Authentication" />
              <Switch label="Enable Session Timeout" defaultChecked />
              <TextInput label="Session Timeout (minutes)" placeholder="30" />
              <Switch label="Enable IP Whitelisting" />
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconSettings size={24} color="var(--mantine-color-violet-6)" />
              <Title order={4}>General Settings</Title>
            </Group>
            <Stack gap="sm">
              <TextInput label="Application Name" placeholder="Dynamic AQS CRM" />
              <TextInput label="Support Email" placeholder="support@dynamicaqs.com" />
              <Switch label="Enable Maintenance Mode" />
              <Switch label="Enable Debug Logging" />
            </Stack>
          </Card>
        </SimpleGrid>

        <Group justify="flex-end" mt="lg">
          <Button variant="light">Reset to Defaults</Button>
          <Button>Save Configuration</Button>
        </Group>
      </Paper>
    </Stack>
  );
}
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
  Badge,
  Button,
  Progress
} from '@mantine/core';
import { IconPlug, IconCheck, IconX, IconRefresh } from '@tabler/icons-react';

export default function IntegrationStatusMonitor() {
  const integrations = [
    { name: 'HubSpot CRM', status: 'connected', lastSync: '2 minutes ago', health: 100 },
    { name: 'QuickBooks', status: 'connected', lastSync: '5 minutes ago', health: 95 },
    { name: 'Salesforce', status: 'error', lastSync: '2 hours ago', health: 0 },
    { name: 'Mailchimp', status: 'connected', lastSync: '10 minutes ago', health: 88 },
    { name: 'Slack', status: 'warning', lastSync: '30 minutes ago', health: 65 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'green';
      case 'warning': return 'yellow';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <IconCheck size={16} />;
      case 'error': return <IconX size={16} />;
      default: return <IconRefresh size={16} />;
    }
  };

  return (
    <Stack gap="md">
      <Paper shadow="sm" p="md">
        <Group justify="space-between" mb="md">
          <div>
            <Title order={2}>Integration Status Monitor</Title>
            <Text c="dimmed">Monitor the health and status of system integrations</Text>
          </div>
          <Button leftSection={<IconRefresh size={16} />}>
            Refresh All
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {integrations.map((integration, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Group gap="sm">
                  <IconPlug size={20} />
                  <Text fw={500}>{integration.name}</Text>
                </Group>
                <Badge 
                  color={getStatusColor(integration.status)} 
                  variant="light"
                  leftSection={getStatusIcon(integration.status)}
                >
                  {integration.status}
                </Badge>
              </Group>

              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Health</Text>
                  <Text size="sm" fw={500}>{integration.health}%</Text>
                </Group>
                <Progress value={integration.health} color={getStatusColor(integration.status)} />
                
                <Group justify="space-between" mt="sm">
                  <Text size="sm" c="dimmed">Last Sync</Text>
                  <Text size="sm">{integration.lastSync}</Text>
                </Group>

                <Button size="xs" variant="light" fullWidth mt="sm">
                  View Details
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
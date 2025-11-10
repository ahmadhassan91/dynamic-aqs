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
  Progress,
  Badge,
  RingProgress,
  Center
} from '@mantine/core';
import { IconServer, IconDatabase, IconCpu, IconDeviceDesktop } from '@tabler/icons-react';

export default function SystemHealthMonitor() {
  const systemMetrics = [
    { name: 'CPU Usage', value: 45, icon: IconCpu, color: 'blue' },
    { name: 'Memory Usage', value: 68, icon: IconDeviceDesktop, color: 'green' },
    { name: 'Disk Usage', value: 32, icon: IconServer, color: 'violet' },
    { name: 'Database Load', value: 23, icon: IconDatabase, color: 'orange' }
  ];

  const services = [
    { name: 'Web Server', status: 'healthy', uptime: '99.9%' },
    { name: 'Database', status: 'healthy', uptime: '99.8%' },
    { name: 'Cache Server', status: 'warning', uptime: '98.5%' },
    { name: 'Email Service', status: 'healthy', uptime: '99.7%' },
    { name: 'File Storage', status: 'healthy', uptime: '99.9%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'green';
      case 'warning': return 'yellow';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Stack gap="md">
      <Paper shadow="sm" p="md">
        <Title order={2} mb="md">System Health Monitor</Title>
        <Text c="dimmed" mb="lg">
          Monitor system performance and service health
        </Text>

        {/* System Metrics */}
        <Title order={4} mb="md">System Metrics</Title>
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md" mb="xl">
          {systemMetrics.map((metric, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <metric.icon size={24} color={`var(--mantine-color-${metric.color}-6)`} />
                <Text size="xl" fw={700}>{metric.value}%</Text>
              </Group>
              <Text size="sm" c="dimmed">{metric.name}</Text>
              <Progress value={metric.value} color={metric.color} mt="sm" />
            </Card>
          ))}
        </SimpleGrid>

        {/* Overall System Health */}
        <Group justify="space-between" mb="md">
          <Title order={4}>Overall System Health</Title>
          <Badge color="green" size="lg">Healthy</Badge>
        </Group>

        <Group justify="center" mb="xl">
          <RingProgress
            size={200}
            thickness={16}
            sections={[
              { value: 95, color: 'green' }
            ]}
            label={
              <Center>
                <Stack gap={0} align="center">
                  <Text size="xl" fw={700}>95%</Text>
                  <Text size="sm" c="dimmed">Healthy</Text>
                </Stack>
              </Center>
            }
          />
        </Group>

        {/* Service Status */}
        <Title order={4} mb="md">Service Status</Title>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {services.map((service, index) => (
            <Card key={index} shadow="sm" padding="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>{service.name}</Text>
                <Badge color={getStatusColor(service.status)} variant="light">
                  {service.status}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Uptime</Text>
                <Text size="sm" fw={500}>{service.uptime}</Text>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
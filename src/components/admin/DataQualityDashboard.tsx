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
  Button,
  Table
} from '@mantine/core';
import { IconSearch, IconAlertTriangle, IconCheck, IconX } from '@tabler/icons-react';

export default function DataQualityDashboard() {
  const qualityMetrics = [
    { name: 'Customer Data', score: 92, issues: 12, color: 'green' },
    { name: 'Lead Data', score: 78, issues: 45, color: 'yellow' },
    { name: 'Order Data', score: 95, issues: 8, color: 'green' },
    { name: 'User Data', score: 88, issues: 18, color: 'blue' }
  ];

  const dataIssues = [
    { type: 'Missing Email', count: 23, severity: 'high', table: 'customers' },
    { type: 'Invalid Phone Format', count: 15, severity: 'medium', table: 'leads' },
    { type: 'Duplicate Records', count: 8, severity: 'high', table: 'customers' },
    { type: 'Missing Address', count: 31, severity: 'low', table: 'customers' },
    { type: 'Invalid Date Format', count: 5, severity: 'medium', table: 'orders' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'green';
    if (score >= 70) return 'yellow';
    return 'red';
  };

  return (
    <Stack gap="md">
      <Paper shadow="sm" p="md">
        <Group justify="space-between" mb="md">
          <div>
            <Title order={2}>Data Quality Dashboard</Title>
            <Text c="dimmed">Monitor and manage data quality across the system</Text>
          </div>
          <Button leftSection={<IconSearch size={16} />}>
            Run Quality Check
          </Button>
        </Group>

        {/* Quality Metrics */}
        <Title order={4} mb="md">Data Quality Scores</Title>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="md" mb="xl">
          {qualityMetrics.map((metric, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={500}>{metric.name}</Text>
                <Badge color={getScoreColor(metric.score)} variant="light">
                  {metric.score}%
                </Badge>
              </Group>
              <Progress value={metric.score} color={getScoreColor(metric.score)} mb="sm" />
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Issues Found</Text>
                <Text size="sm" fw={500}>{metric.issues}</Text>
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        {/* Data Issues */}
        <Title order={4} mb="md">Data Quality Issues</Title>
        <Paper shadow="sm">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Issue Type</Table.Th>
                <Table.Th>Count</Table.Th>
                <Table.Th>Severity</Table.Th>
                <Table.Th>Table</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {dataIssues.map((issue, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Group gap="sm">
                      <IconAlertTriangle size={16} color={`var(--mantine-color-${getSeverityColor(issue.severity)}-6)`} />
                      <Text fw={500}>{issue.type}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>{issue.count}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getSeverityColor(issue.severity)} variant="light">
                      {issue.severity}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text c="dimmed">{issue.table}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button size="xs" variant="light">
                        View Details
                      </Button>
                      <Button size="xs" color="green">
                        Fix Issues
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
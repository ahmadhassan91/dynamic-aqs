'use client';

import React, { useState, useEffect } from 'react';
import {
  Title, Text, Card, Group, Stack, Select, Button, ThemeIcon,
  Loader, Center, SimpleGrid, Badge, Progress, Table
} from '@mantine/core';
import {
  IconUsers, IconTrendingUp, IconTarget, IconCurrencyDollar
} from '@tabler/icons-react';
import { ManufacturerRep } from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

export function RepPerformanceDashboard() {
  const [reps, setReps] = useState<ManufacturerRep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReps();
  }, []);

  const loadReps = async () => {
    try {
      setLoading(true);
      const data = await commercialService.getManufacturerReps();
      setReps(data);
    } catch (error) {
      console.error('Error loading reps:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (reps.length === 0) {
    return (
      <Card withBorder padding="xl" className="commercial-card-static">
        <Center h={200}>
          <Stack align="center">
            <ThemeIcon size={60} radius="xl" variant="light" color="gray">
              <IconUsers size={30} />
            </ThemeIcon>
            <Text size="lg" fw={500}>No rep data available</Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  return (
    <Stack gap="xl">
      {/* Rep Performance Table */}
      <Card withBorder padding="lg" className="commercial-card-static">
        <Title order={3} mb="md">Manufacturer Rep Performance</Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Representative</Table.Th>
              <Table.Th>Quota Progress</Table.Th>
              <Table.Th>Quotes</Table.Th>
              <Table.Th>POs</Table.Th>
              <Table.Th>Conversion Rate</Table.Th>
              <Table.Th>YTD Revenue</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {reps.map(rep => {
              const quotaProgress = (rep.performance.ytdRevenue / rep.quota.annualQuota) * 100;
              
              return (
                <Table.Tr key={rep.id}>
                  <Table.Td>
                    <div>
                      <Text fw={500} size="sm">
                        {rep.personalInfo.firstName} {rep.personalInfo.lastName}
                      </Text>
                      <Text size="xs" c="dimmed">{rep.organizationId}</Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <Progress 
                          value={Math.min(quotaProgress, 100)} 
                          size="sm" 
                          color={quotaProgress >= 100 ? 'green' : quotaProgress >= 75 ? 'yellow' : 'red'}
                          style={{ flex: 1 }}
                          w={80}
                        />
                        <Text size="sm" fw={500}>{formatPercentage(quotaProgress)}</Text>
                      </Group>
                      <Text size="xs" c="dimmed">
                        {formatCurrency(rep.performance.ytdRevenue)} / {formatCurrency(rep.quota.annualQuota)}
                      </Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{rep.performance.totalQuotes}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{rep.performance.totalPOs}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      variant="light"
                      color={rep.performance.conversionRate >= 50 ? 'green' : rep.performance.conversionRate >= 30 ? 'yellow' : 'red'}
                    >
                      {formatPercentage(rep.performance.conversionRate)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={600}>{formatCurrency(rep.performance.ytdRevenue)}</Text>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}

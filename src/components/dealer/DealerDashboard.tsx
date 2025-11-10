'use client';

import { useState } from 'react';
import {
  Grid,
  Card,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  Button,
  ActionIcon,
  Table,
  Progress,
  NumberFormatter,
  Anchor,
} from '@mantine/core';
import {
  IconShoppingCart,
  IconTruck,
  IconCreditCard,
  IconTrendingUp,
  IconEye,
  IconDownload,
  IconRefresh,
} from '@tabler/icons-react';

interface DealerDashboardProps {
  dealerInfo: {
    companyName: string;
    accountNumber: string;
    creditLimit: number;
    availableCredit: number;
    paymentTerms: string;
    territoryManager: {
      name: string;
      email: string;
      phone: string;
    };
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    date: Date;
    total: number;
    status: string;
    itemCount: number;
  }>;
  accountSummary: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: Date;
  };
  onViewOrder: (orderId: string) => void;
  onCreateOrder: () => void;
  onViewAllOrders: () => void;
}

export function DealerDashboard({
  dealerInfo,
  recentOrders,
  accountSummary,
  onViewOrder,
  onCreateOrder,
  onViewAllOrders,
}: DealerDashboardProps) {
  const creditUtilization = ((dealerInfo.creditLimit - dealerInfo.availableCredit) / dealerInfo.creditLimit) * 100;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'green';
      case 'shipped':
        return 'blue';
      case 'processing':
        return 'yellow';
      case 'pending':
        return 'orange';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Stack>
      {/* Welcome Section */}
      <Card withBorder p="lg">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>Welcome back!</Title>
            <Text size="lg" fw={500} mt="xs">
              {dealerInfo.companyName}
            </Text>
            <Text size="sm" c="dimmed">
              Account: {dealerInfo.accountNumber}
            </Text>
          </div>
          <Button leftSection={<IconShoppingCart size={16} />} onClick={onCreateOrder}>
            New Order
          </Button>
        </Group>
      </Card>

      {/* Key Metrics */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Total Orders
                </Text>
                <Text fw={700} size="xl">
                  {accountSummary.totalOrders}
                </Text>
              </div>
              <IconShoppingCart size={24} color="blue" />
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Total Spent
                </Text>
                <Text fw={700} size="xl">
                  <NumberFormatter value={accountSummary.totalSpent} prefix="$" thousandSeparator />
                </Text>
              </div>
              <IconCreditCard size={24} color="green" />
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Avg Order Value
                </Text>
                <Text fw={700} size="xl">
                  <NumberFormatter value={accountSummary.averageOrderValue} prefix="$" thousandSeparator />
                </Text>
              </div>
              <IconTrendingUp size={24} color="orange" />
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Available Credit
                </Text>
                <Text fw={700} size="xl">
                  <NumberFormatter value={dealerInfo.availableCredit} prefix="$" thousandSeparator />
                </Text>
              </div>
              <IconCreditCard size={24} color="teal" />
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        {/* Recent Orders */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Recent Orders</Title>
              <Button variant="light" size="sm" onClick={onViewAllOrders}>
                View All Orders
              </Button>
            </Group>

            {recentOrders.length > 0 ? (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Order #</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Items</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {recentOrders.map((order) => (
                    <Table.Tr key={order.id}>
                      <Table.Td>
                        <Text fw={500}>{order.orderNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {order.date.toLocaleDateString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{order.itemCount} items</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>
                          <NumberFormatter value={order.total} prefix="$" thousandSeparator />
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(order.status)} variant="light">
                          {order.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          variant="light"
                          onClick={() => onViewOrder(order.id)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text ta="center" c="dimmed" py="xl">
                No recent orders found
              </Text>
            )}
          </Card>
        </Grid.Col>

        {/* Account Information */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack>
            {/* Credit Information */}
            <Card withBorder>
              <Title order={4} mb="md">Credit Information</Title>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm">Credit Limit</Text>
                  <Text fw={500}>
                    <NumberFormatter value={dealerInfo.creditLimit} prefix="$" thousandSeparator />
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Available Credit</Text>
                  <Text fw={500} c="green">
                    <NumberFormatter value={dealerInfo.availableCredit} prefix="$" thousandSeparator />
                  </Text>
                </Group>
                <div>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm">Credit Utilization</Text>
                    <Text size="sm">{creditUtilization.toFixed(1)}%</Text>
                  </Group>
                  <Progress 
                    value={creditUtilization} 
                    color={creditUtilization > 80 ? 'red' : creditUtilization > 60 ? 'yellow' : 'green'}
                  />
                </div>
                <Group justify="space-between">
                  <Text size="sm">Payment Terms</Text>
                  <Text fw={500}>{dealerInfo.paymentTerms}</Text>
                </Group>
              </Stack>
            </Card>

            {/* Territory Manager */}
            <Card withBorder>
              <Title order={4} mb="md">Your Territory Manager</Title>
              <Stack gap="xs">
                <Text fw={500}>{dealerInfo.territoryManager.name}</Text>
                <Anchor href={`mailto:${dealerInfo.territoryManager.email}`} size="sm">
                  {dealerInfo.territoryManager.email}
                </Anchor>
                <Anchor href={`tel:${dealerInfo.territoryManager.phone}`} size="sm">
                  {dealerInfo.territoryManager.phone}
                </Anchor>
              </Stack>
            </Card>

            {/* Quick Actions */}
            <Card withBorder>
              <Title order={4} mb="md">Quick Actions</Title>
              <Stack gap="xs">
                <Button variant="light" fullWidth leftSection={<IconDownload size={16} />}>
                  Download Catalog
                </Button>
                <Button variant="light" fullWidth leftSection={<IconRefresh size={16} />}>
                  Request Credit Review
                </Button>
                <Button variant="light" fullWidth leftSection={<IconTruck size={16} />}>
                  Track Shipments
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
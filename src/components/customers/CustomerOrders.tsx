'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Table,
  Badge,
  Text,
  Stack,
  ActionIcon,
  Menu,
  rem,
  Pagination,
  Collapse,
  Divider,
} from '@mantine/core';
import {
  IconSearch,
  IconPlus,
  IconEye,
  IconDownload,
  IconDots,
  IconChevronDown,
  IconChevronRight,
  IconPackage,
  IconTruck,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface CustomerOrdersProps {
  customerId: string;
}

const ITEMS_PER_PAGE = 10;

export function CustomerOrders({ customerId }: CustomerOrdersProps) {
  const { orders } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Get customer orders
  const customerOrders = useMemo(() => {
    return orders.filter(order => order.customerId === customerId);
  }, [orders, customerId]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return customerOrders.filter(order => {
      const matchesSearch = !searchQuery || 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesStatus = !statusFilter || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customerOrders, searchQuery, statusFilter]);

  // Paginate results
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'orange';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Calculate summary statistics
  const totalRevenue = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = customerOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <Stack gap="lg">
      {/* Summary Cards */}
      <Group grow>
        <Card withBorder p="md" ta="center">
          <Text size="xl" fw={700} c="blue">
            {totalOrders}
          </Text>
          <Text size="sm" c="dimmed">
            Total Orders
          </Text>
        </Card>
        <Card withBorder p="md" ta="center">
          <Text size="xl" fw={700} c="green">
            {formatCurrency(totalRevenue)}
          </Text>
          <Text size="sm" c="dimmed">
            Total Revenue
          </Text>
        </Card>
        <Card withBorder p="md" ta="center">
          <Text size="xl" fw={700} c="orange">
            {formatCurrency(averageOrderValue)}
          </Text>
          <Text size="sm" c="dimmed">
            Average Order Value
          </Text>
        </Card>
      </Group>

      {/* Header and Filters */}
      <Card withBorder p="md">
        <Group justify="space-between" mb="md">
          <Title order={3}>Order History</Title>
          <Button leftSection={<IconPlus size={16} />}>
            Create Order
          </Button>
        </Group>
        
        <Group gap="md">
          <TextInput
            placeholder="Search orders..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Status"
            data={[
              { value: 'pending', label: 'Pending' },
              { value: 'processing', label: 'Processing' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            w={150}
          />
        </Group>
      </Card>

      {/* Orders Table */}
      <Card withBorder p={0}>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" horizontalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Order</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Items</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Shipping</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedOrders.map((order) => (
                <>
                  <Table.Tr key={order.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={() => toggleOrderExpansion(order.id)}
                        >
                          {expandedOrders.has(order.id) ? (
                            <IconChevronDown size={14} />
                          ) : (
                            <IconChevronRight size={14} />
                          )}
                        </ActionIcon>
                        <div>
                          <Text fw={500} size="sm">
                            {order.orderNumber}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {formatDate(order.orderDate)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>
                        {formatCurrency(order.totalAmount)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(order.status)} variant="light">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {order.trackingNumber ? (
                        <Group gap="xs">
                          <IconTruck size={14} />
                          <Text size="sm">{order.trackingNumber}</Text>
                        </Group>
                      ) : order.expectedShipDate ? (
                        <Group gap="xs">
                          <IconPackage size={14} />
                          <Text size="sm">
                            Expected: {formatDate(order.expectedShipDate)}
                          </Text>
                        </Group>
                      ) : (
                        <Text size="sm" c="dimmed">
                          Not shipped
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                          >
                            View Details
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconDownload style={{ width: rem(14), height: rem(14) }} />}
                          >
                            Download Invoice
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                  
                  {/* Expanded Order Details */}
                  <Table.Tr>
                    <Table.Td colSpan={7} p={0}>
                      <Collapse in={expandedOrders.has(order.id)}>
                        <Card p="md" radius={0}>
                          <Stack gap="sm">
                            <Title order={5}>Order Items</Title>
                            <Table>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>Product</Table.Th>
                                  <Table.Th>Quantity</Table.Th>
                                  <Table.Th>Unit Price</Table.Th>
                                  <Table.Th>Total</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {order.items.map((item, index) => (
                                  <Table.Tr key={index}>
                                    <Table.Td>{item.productName}</Table.Td>
                                    <Table.Td>{item.quantity}</Table.Td>
                                    <Table.Td>{formatCurrency(item.unitPrice)}</Table.Td>
                                    <Table.Td>{formatCurrency(item.totalPrice)}</Table.Td>
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            </Table>
                            
                            {(order.expectedShipDate || order.actualShipDate || order.trackingNumber) && (
                              <>
                                <Divider />
                                <Group gap="lg">
                                  {order.expectedShipDate && (
                                    <div>
                                      <Text size="sm" c="dimmed">Expected Ship Date</Text>
                                      <Text size="sm" fw={500}>
                                        {formatDate(order.expectedShipDate)}
                                      </Text>
                                    </div>
                                  )}
                                  {order.actualShipDate && (
                                    <div>
                                      <Text size="sm" c="dimmed">Actual Ship Date</Text>
                                      <Text size="sm" fw={500}>
                                        {formatDate(order.actualShipDate)}
                                      </Text>
                                    </div>
                                  )}
                                  {order.trackingNumber && (
                                    <div>
                                      <Text size="sm" c="dimmed">Tracking Number</Text>
                                      <Text size="sm" fw={500}>
                                        {order.trackingNumber} ({order.shippingCarrier})
                                      </Text>
                                    </div>
                                  )}
                                </Group>
                              </>
                            )}
                          </Stack>
                        </Card>
                      </Collapse>
                    </Table.Td>
                  </Table.Tr>
                </>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
          />
        </Group>
      )}
    </Stack>
  );
}
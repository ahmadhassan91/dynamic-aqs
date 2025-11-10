'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  Button,
  Table,
  ActionIcon,
  TextInput,
  Select,
  Pagination,
  NumberFormatter,
  Modal,
  Tabs,
  List,
  Divider,
  Alert,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconSearch,
  IconEye,
  IconDownload,
  IconRefresh,
  IconTruck,
  IconPackage,
  IconInfoCircle,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  trackingNumber?: string;
  shippingCarrier?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  specialInstructions?: string;
}

interface OrderHistoryProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
  onReorder: (order: Order) => void;
  onDownloadInvoice: (orderId: string) => void;
}

export function OrderHistory({
  orders,
  onViewOrder,
  onCancelOrder,
  onReorder,
  onDownloadInvoice,
}: OrderHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  
  const itemsPerPage = 10;

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort by date (newest first)
    filtered.sort((a, b) => b.date.getTime() - a.date.getTime());

    return filtered;
  }, [orders, searchQuery, statusFilter]);

  // Paginate orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <IconCheck size={14} />;
      case 'shipped':
        return <IconTruck size={14} />;
      case 'processing':
        return <IconPackage size={14} />;
      case 'cancelled':
        return <IconX size={14} />;
      default:
        return <IconInfoCircle size={14} />;
    }
  };

  const canCancelOrder = (order: Order) => {
    return order.status === 'pending' || order.status === 'processing';
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    openDetails();
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title={`Order ${selectedOrder.orderNumber}`}
        size="lg"
        centered
      >
        <Tabs defaultValue="details">
          <Tabs.List>
            <Tabs.Tab value="details">Order Details</Tabs.Tab>
            <Tabs.Tab value="tracking">Tracking</Tabs.Tab>
            <Tabs.Tab value="shipping">Shipping Info</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" pt="md">
            <Stack>
              <Group justify="space-between">
                <div>
                  <Text fw={500}>Order Date:</Text>
                  <Text>{selectedOrder.date.toLocaleDateString()}</Text>
                </div>
                <Badge 
                  color={getStatusColor(selectedOrder.status)} 
                  variant="light"
                  leftSection={getStatusIcon(selectedOrder.status)}
                >
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </Badge>
              </Group>

              <Divider />

              <Title order={4}>Items Ordered</Title>
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
                  {selectedOrder.items.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{item.productName}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>
                        <NumberFormatter value={item.unitPrice} prefix="$" thousandSeparator />
                      </Table.Td>
                      <Table.Td>
                        <NumberFormatter value={item.totalPrice} prefix="$" thousandSeparator />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Divider />

              <Group justify="space-between">
                <Text>Subtotal:</Text>
                <Text><NumberFormatter value={selectedOrder.subtotal} prefix="$" thousandSeparator /></Text>
              </Group>
              <Group justify="space-between">
                <Text>Tax:</Text>
                <Text><NumberFormatter value={selectedOrder.tax} prefix="$" thousandSeparator /></Text>
              </Group>
              <Group justify="space-between">
                <Text>Shipping:</Text>
                <Text><NumberFormatter value={selectedOrder.shipping} prefix="$" thousandSeparator /></Text>
              </Group>
              <Group justify="space-between">
                <Text size="lg" fw={700}>Total:</Text>
                <Text size="lg" fw={700} c="blue">
                  <NumberFormatter value={selectedOrder.total} prefix="$" thousandSeparator />
                </Text>
              </Group>

              {selectedOrder.specialInstructions && (
                <>
                  <Divider />
                  <div>
                    <Text fw={500} mb="xs">Special Instructions:</Text>
                    <Text size="sm" c="dimmed">{selectedOrder.specialInstructions}</Text>
                  </div>
                </>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="tracking" pt="md">
            <Stack>
              {selectedOrder.trackingNumber ? (
                <>
                  <Group>
                    <Text fw={500}>Tracking Number:</Text>
                    <Text>{selectedOrder.trackingNumber}</Text>
                  </Group>
                  <Group>
                    <Text fw={500}>Carrier:</Text>
                    <Text>{selectedOrder.shippingCarrier}</Text>
                  </Group>
                  {selectedOrder.estimatedDelivery && (
                    <Group>
                      <Text fw={500}>Estimated Delivery:</Text>
                      <Text>{selectedOrder.estimatedDelivery.toLocaleDateString()}</Text>
                    </Group>
                  )}
                  {selectedOrder.actualDelivery && (
                    <Group>
                      <Text fw={500}>Delivered:</Text>
                      <Text c="green">{selectedOrder.actualDelivery.toLocaleDateString()}</Text>
                    </Group>
                  )}
                  <Button
                    leftSection={<IconTruck size={16} />}
                    variant="light"
                    onClick={() => window.open(`https://tracking.${selectedOrder.shippingCarrier?.toLowerCase()}.com/${selectedOrder.trackingNumber}`, '_blank')}
                  >
                    Track Package
                  </Button>
                </>
              ) : (
                <Alert icon={<IconInfoCircle size="1rem" />}>
                  Tracking information will be available once your order ships.
                </Alert>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="shipping" pt="md">
            <Stack>
              <Title order={4}>Shipping Address</Title>
              <Text>{selectedOrder.shippingAddress.name}</Text>
              {selectedOrder.shippingAddress.company && (
                <Text>{selectedOrder.shippingAddress.company}</Text>
              )}
              <Text>{selectedOrder.shippingAddress.address}</Text>
              <Text>
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
              </Text>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Group justify="space-between" mt="lg">
          <Group>
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={() => onDownloadInvoice(selectedOrder.id)}
            >
              Download Invoice
            </Button>
            <Button
              variant="light"
              leftSection={<IconRefresh size={16} />}
              onClick={() => onReorder(selectedOrder)}
            >
              Reorder
            </Button>
          </Group>
          {canCancelOrder(selectedOrder) && (
            <Button
              color="red"
              variant="light"
              onClick={() => {
                onCancelOrder(selectedOrder.id);
                closeDetails();
              }}
            >
              Cancel Order
            </Button>
          )}
        </Group>
      </Modal>
    );
  };

  return (
    <>
      <Stack>
        <Group justify="space-between">
          <Title order={2}>Order History</Title>
          <Text c="dimmed">{filteredOrders.length} orders found</Text>
        </Group>

        {/* Filters */}
        <Card withBorder>
          <Group>
            <TextInput
              placeholder="Search orders..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="All Statuses"
              data={[
                { value: '', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'shipped', label: 'Shipped' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Group>
        </Card>

        {/* Orders Table */}
        <Card withBorder>
          {paginatedOrders.length > 0 ? (
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
                {paginatedOrders.map((order) => (
                  <Table.Tr key={order.id}>
                    <Table.Td>
                      <Text fw={500}>{order.orderNumber}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{order.date.toLocaleDateString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{order.items.length} items</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>
                        <NumberFormatter value={order.total} prefix="$" thousandSeparator />
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={getStatusColor(order.status)} 
                        variant="light"
                        leftSection={getStatusIcon(order.status)}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          onClick={() => handleViewOrder(order)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          onClick={() => onDownloadInvoice(order.id)}
                        >
                          <IconDownload size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          onClick={() => onReorder(order)}
                        >
                          <IconRefresh size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text ta="center" c="dimmed" py="xl">
              No orders found matching your criteria
            </Text>
          )}
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

      <OrderDetailsModal />
    </>
  );
}
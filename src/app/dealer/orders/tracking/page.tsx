'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Grid,
  Card,
  Text,
  Badge,
  Stack,
  Paper,
  Timeline,
  Progress,
  Alert,
  NumberFormatter,
  Table,
  ActionIcon,
  Tooltip,
  Modal,
  Divider,
  Anchor,
  CopyButton,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconTruck,
  IconPackage,
  IconMapPin,
  IconCalendar,
  IconClock,
  IconCheck,
  IconAlertTriangle,
  IconEye,
  IconCopy,
  IconUser,
  IconExternalLink,
  IconPhone,
  IconMail,
  IconRefresh,
  IconSettings,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { ShippingCarrierIntegration } from '@/components/dealer/ShippingCarrierIntegration';
import { shippingCarrierService, type CarrierTrackingInfo } from '@/lib/services/shippingCarrierService';

// Mock order tracking data
const mockOrders = [
  {
    id: 'ORD-2024-001',
    orderDate: '2024-01-15',
    status: 'In Transit',
    estimatedDelivery: '2024-01-22',
    actualDelivery: null,
    trackingNumber: 'DYN1234567890',
    carrier: 'FedEx Freight',
    carrierUrl: 'https://fedex.com/track',
    
    // Order Details
    items: [
      { name: 'AirMax Pro 2500 Air Handling Unit', quantity: 2, price: 12500 },
      { name: 'SmartControl 200 System', quantity: 1, price: 3200 },
    ],
    totalValue: 28200,
    
    // Shipping Details
    shippingAddress: {
      name: 'Comfort Zone HVAC Services',
      street: '1234 Main Street',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      phone: '(555) 123-4567',
    },
    
    // Delivery Preferences
    deliveryWindow: 'Morning (8 AM - 12 PM)',
    specialInstructions: 'Call before delivery. Loading dock access required.',
    
    // Tracking Timeline
    trackingEvents: [
      {
        date: '2024-01-15T10:30:00',
        status: 'Order Confirmed',
        location: 'Dynamic AQS Warehouse - Chicago, IL',
        description: 'Order has been confirmed and is being prepared for shipment',
        icon: IconCheck,
        color: 'green',
      },
      {
        date: '2024-01-16T14:15:00',
        status: 'Picked Up',
        location: 'Dynamic AQS Warehouse - Chicago, IL',
        description: 'Package picked up by FedEx Freight',
        icon: IconPackage,
        color: 'blue',
      },
      {
        date: '2024-01-17T08:45:00',
        status: 'In Transit',
        location: 'FedEx Facility - Indianapolis, IN',
        description: 'Package is in transit to destination facility',
        icon: IconTruck,
        color: 'orange',
      },
      {
        date: '2024-01-18T16:20:00',
        status: 'At Destination Facility',
        location: 'FedEx Facility - Springfield, IL',
        description: 'Package has arrived at destination facility',
        icon: IconMapPin,
        color: 'blue',
      },
      {
        date: '2024-01-19T09:00:00',
        status: 'Out for Delivery',
        location: 'Springfield, IL',
        description: 'Package is out for delivery',
        icon: IconTruck,
        color: 'orange',
      },
    ],
    
    // Delivery Contact
    deliveryContact: {
      name: 'Mike Johnson',
      phone: '(555) 987-6543',
      email: 'mike.johnson@fedex.com',
    },
  },
  {
    id: 'ORD-2024-002',
    orderDate: '2024-01-10',
    status: 'Delivered',
    estimatedDelivery: '2024-01-18',
    actualDelivery: '2024-01-17T14:30:00',
    trackingNumber: 'DYN0987654321',
    carrier: 'UPS Freight',
    carrierUrl: 'https://ups.com/track',
    
    items: [
      { name: 'EcoMax 5000 Rooftop Unit', quantity: 1, price: 18750 },
    ],
    totalValue: 18750,
    
    shippingAddress: {
      name: 'Comfort Zone HVAC Services',
      street: '1234 Main Street',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      phone: '(555) 123-4567',
    },
    
    deliveryWindow: 'Afternoon (1 PM - 5 PM)',
    specialInstructions: 'Signature required. Heavy equipment - crane access needed.',
    
    trackingEvents: [
      {
        date: '2024-01-10T11:00:00',
        status: 'Order Confirmed',
        location: 'Dynamic AQS Warehouse - Chicago, IL',
        description: 'Order confirmed and prepared for shipment',
        icon: IconCheck,
        color: 'green',
      },
      {
        date: '2024-01-11T13:30:00',
        status: 'Picked Up',
        location: 'Dynamic AQS Warehouse - Chicago, IL',
        description: 'Package picked up by UPS Freight',
        icon: IconPackage,
        color: 'blue',
      },
      {
        date: '2024-01-15T10:15:00',
        status: 'In Transit',
        location: 'UPS Facility - Rockford, IL',
        description: 'Package in transit',
        icon: IconTruck,
        color: 'orange',
      },
      {
        date: '2024-01-17T14:30:00',
        status: 'Delivered',
        location: 'Springfield, IL',
        description: 'Package delivered successfully. Signed by: J. Mitchell',
        icon: IconCheck,
        color: 'green',
      },
    ],
    
    deliveryContact: {
      name: 'Sarah Davis',
      phone: '(555) 456-7890',
      email: 'sarah.davis@ups.com',
    },
  },
  {
    id: 'ORD-2024-003',
    orderDate: '2024-01-20',
    status: 'Processing',
    estimatedDelivery: '2024-01-28',
    actualDelivery: null,
    trackingNumber: null,
    carrier: 'TBD',
    carrierUrl: null,
    
    items: [
      { name: 'ClimateMax 3000 Heat Pump', quantity: 3, price: 8900 },
      { name: 'Installation Kit', quantity: 3, price: 450 },
    ],
    totalValue: 28050,
    
    shippingAddress: {
      name: 'Comfort Zone HVAC Services',
      street: '1234 Main Street',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      phone: '(555) 123-4567',
    },
    
    deliveryWindow: 'Any Time',
    specialInstructions: 'Standard delivery acceptable.',
    
    trackingEvents: [
      {
        date: '2024-01-20T15:45:00',
        status: 'Order Received',
        location: 'Dynamic AQS Order Processing',
        description: 'Order received and being processed',
        icon: IconClock,
        color: 'yellow',
      },
    ],
    
    deliveryContact: null,
  },
];

const statusColors = {
  'Processing': 'yellow',
  'In Transit': 'blue',
  'Out for Delivery': 'orange',
  'Delivered': 'green',
  'Delayed': 'red',
  'Exception': 'red',
};

interface OrderTrackingCardProps {
  order: typeof mockOrders[0];
  onViewDetails: (order: typeof mockOrders[0]) => void;
  realTimeTracking?: CarrierTrackingInfo;
}

function OrderTrackingCard({ order, onViewDetails, realTimeTracking }: OrderTrackingCardProps) {
  const getProgressValue = () => {
    const status = realTimeTracking?.status || order.status;
    switch (status.toLowerCase()) {
      case 'processing': return 20;
      case 'picked up': return 30;
      case 'in transit': return 60;
      case 'out for delivery': return 80;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const currentStatus = realTimeTracking?.status || order.status;
  const currentEstimatedDelivery = realTimeTracking?.estimatedDelivery || order.estimatedDelivery;
  const isDelayed = currentEstimatedDelivery && new Date(currentEstimatedDelivery) < new Date() && currentStatus !== 'Delivered';

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs" mb="xs">
              <Text fw={600} size="lg">{order.id}</Text>
              <Badge color={statusColors[currentStatus as keyof typeof statusColors] || 'gray'}>
                {currentStatus}
              </Badge>
              {realTimeTracking && (
                <Badge color="blue" variant="light" size="xs">
                  Live
                </Badge>
              )}
              {isDelayed && (
                <Badge color="red" variant="light">
                  Delayed
                </Badge>
              )}
            </Group>
            <Text size="sm" c="dimmed">
              Ordered: {new Date(order.orderDate).toLocaleDateString()}
            </Text>
          </div>
          <Group gap="xs">
            <Text fw={600}>
              <NumberFormatter
                value={order.totalValue}
                prefix="$"
                thousandSeparator
                decimalScale={0}
              />
            </Text>
          </Group>
        </Group>

        {/* Progress Bar */}
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Delivery Progress</Text>
            <Text size="sm" c="dimmed">{getProgressValue()}%</Text>
          </Group>
          <Progress value={getProgressValue()} color={statusColors[currentStatus as keyof typeof statusColors] || 'gray'} />
        </div>

        {/* Delivery Information */}
        <Grid>
          <Grid.Col span={6}>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Estimated Delivery</Text>
              <Group gap="xs">
                <IconCalendar size={14} />
                <Text size="sm">
                  {currentEstimatedDelivery ? new Date(currentEstimatedDelivery).toLocaleDateString() : 'TBD'}
                </Text>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={6}>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Tracking Number</Text>
              <Group gap="xs">
                <IconPackage size={14} />
                {order.trackingNumber ? (
                  <Group gap="xs">
                    <Text size="sm" ff="monospace">{order.trackingNumber}</Text>
                    <CopyButton value={order.trackingNumber}>
                      {({ copied, copy }) => (
                        <ActionIcon size="sm" variant="subtle" onClick={copy}>
                          <IconCopy size={12} />
                        </ActionIcon>
                      )}
                    </CopyButton>
                  </Group>
                ) : (
                  <Text size="sm" c="dimmed">Not assigned yet</Text>
                )}
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Items Summary */}
        <div>
          <Text size="sm" fw={500} mb="xs">Items ({order.items.length})</Text>
          <Stack gap={4}>
            {order.items.slice(0, 2).map((item, idx) => (
              <Group key={idx} justify="space-between">
                <Text size="sm" lineClamp={1} style={{ flex: 1 }}>
                  {item.quantity}x {item.name}
                </Text>
                <Text size="sm" fw={500}>
                  <NumberFormatter
                    value={item.price * item.quantity}
                    prefix="$"
                    thousandSeparator
                    decimalScale={0}
                  />
                </Text>
              </Group>
            ))}
            {order.items.length > 2 && (
              <Text size="sm" c="dimmed">
                +{order.items.length - 2} more items
              </Text>
            )}
          </Stack>
        </div>

        {/* Actions */}
        <Group justify="space-between">
          <Group gap="xs">
            {order.trackingNumber && (
              <Button
                variant="light"
                size="xs"
                leftSection={<IconExternalLink size={14} />}
                component="a"
                href={shippingCarrierService.getTrackingUrl(order.trackingNumber, order.carrier)}
                target="_blank"
              >
                Track with {order.carrier}
              </Button>
            )}
          </Group>
          <Button
            variant="outline"
            size="xs"
            leftSection={<IconEye size={14} />}
            onClick={() => onViewDetails(order)}
          >
            View Details
          </Button>
        </Group>

        {/* Alerts */}
        {isDelayed && (
          <Alert
            icon={<IconAlertTriangle size={16} />}
            color="red"
            variant="light"
          >
            This order is past its estimated delivery date. Contact customer service if needed.
          </Alert>
        )}
      </Stack>
    </Card>
  );
}

export default function OrderTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [showCarrierIntegration, setShowCarrierIntegration] = useState(false);
  const [realTimeTracking, setRealTimeTracking] = useState<Map<string, CarrierTrackingInfo>>(new Map());

  // Filter orders
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: typeof mockOrders[0]) => {
    setSelectedOrder(order);
    openDetails();
  };

  const handleTrackingUpdate = (trackingInfo: CarrierTrackingInfo) => {
    setRealTimeTracking(prev => new Map(prev.set(trackingInfo.trackingNumber, trackingInfo)));
  };

  const getOrderTrackingNumbers = () => {
    return mockOrders
      .filter(order => order.trackingNumber)
      .map(order => ({
        number: order.trackingNumber!,
        carrier: order.carrier,
        orderId: order.id,
      }));
  };

  const statusOptions = ['All', ...Array.from(new Set(mockOrders.map(order => order.status)))];

  return (
    <DealerLayout>
      <Container size="xl" py="md">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={2}>Order Tracking</Title>
              <Text c="dimmed">
                Track your orders from placement to delivery
              </Text>
            </div>
            <Group>
              <Button 
                leftSection={<IconRefresh size={16} />}
                onClick={() => window.location.reload()}
              >
                Refresh Status
              </Button>
              <Button
                variant="outline"
                leftSection={<IconTruck size={16} />}
                onClick={() => setShowCarrierIntegration(!showCarrierIntegration)}
              >
                {showCarrierIntegration ? 'Hide' : 'Show'} Carrier Integration
              </Button>
              <Button
                variant="outline"
                leftSection={<IconSettings size={16} />}
                component="a"
                href="/dealer/preferences"
              >
                Delivery Preferences
              </Button>
            </Group>
          </Group>

          {/* Filters */}
          <Paper p="md" withBorder>
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <TextInput
                  placeholder="Search by order ID, tracking number, or product..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  placeholder="Filter by status"
                  data={statusOptions}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value || 'All')}
                  leftSection={<IconFilter size={16} />}
                />
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Carrier Integration */}
          {showCarrierIntegration && (
            <ShippingCarrierIntegration
              orderTrackingNumbers={getOrderTrackingNumbers()}
              onTrackingUpdate={handleTrackingUpdate}
            />
          )}

          {/* Summary Stats */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper p="md" withBorder>
                <Stack gap="xs" align="center">
                  <IconPackage size={32} color="var(--mantine-color-blue-6)" />
                  <Text fw={600} size="xl">{mockOrders.length}</Text>
                  <Text size="sm" c="dimmed">Total Orders</Text>
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper p="md" withBorder>
                <Stack gap="xs" align="center">
                  <IconTruck size={32} color="var(--mantine-color-orange-6)" />
                  <Text fw={600} size="xl">
                    {mockOrders.filter(o => o.status === 'In Transit' || o.status === 'Out for Delivery').length}
                  </Text>
                  <Text size="sm" c="dimmed">In Transit</Text>
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper p="md" withBorder>
                <Stack gap="xs" align="center">
                  <IconCheck size={32} color="var(--mantine-color-green-6)" />
                  <Text fw={600} size="xl">
                    {mockOrders.filter(o => o.status === 'Delivered').length}
                  </Text>
                  <Text size="sm" c="dimmed">Delivered</Text>
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper p="md" withBorder>
                <Stack gap="xs" align="center">
                  <IconAlertTriangle size={32} color="var(--mantine-color-red-6)" />
                  <Text fw={600} size="xl">
                    {mockOrders.filter(o => {
                      const isDelayed = o.estimatedDelivery && new Date(o.estimatedDelivery) < new Date() && o.status !== 'Delivered';
                      return isDelayed;
                    }).length}
                  </Text>
                  <Text size="sm" c="dimmed">Delayed</Text>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>

          {/* Orders Grid */}
          <Grid>
            {filteredOrders.map((order) => (
              <Grid.Col key={order.id} span={{ base: 12, lg: 6 }}>
                <OrderTrackingCard
                  order={order}
                  onViewDetails={handleViewDetails}
                  realTimeTracking={order.trackingNumber ? realTimeTracking.get(order.trackingNumber) : undefined}
                />
              </Grid.Col>
            ))}
          </Grid>

          {filteredOrders.length === 0 && (
            <Paper p="xl" withBorder>
              <Stack align="center" gap="md">
                <IconPackage size={48} color="var(--mantine-color-gray-5)" />
                <Text size="lg" fw={600}>No orders found</Text>
                <Text c="dimmed" ta="center">
                  No orders match your current search criteria.
                </Text>
              </Stack>
            </Paper>
          )}
        </Stack>

        {/* Order Details Modal */}
        <Modal
          opened={detailsOpened}
          onClose={closeDetails}
          title={`Order Details - ${selectedOrder?.id}`}
          size="lg"
        >
          {selectedOrder && (
            <Stack gap="lg">
              {/* Order Summary */}
              <Paper p="md" withBorder>
                <Grid>
                  <Grid.Col span={6}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed" tt="uppercase" fw={600}>Order Information</Text>
                      <Group justify="space-between">
                        <Text size="sm">Order Date:</Text>
                        <Text size="sm" fw={500}>{new Date(selectedOrder.orderDate).toLocaleDateString()}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Status:</Text>
                        <Badge color={statusColors[selectedOrder.status as keyof typeof statusColors]}>
                          {selectedOrder.status}
                        </Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Total Value:</Text>
                        <Text size="sm" fw={600}>
                          <NumberFormatter
                            value={selectedOrder.totalValue}
                            prefix="$"
                            thousandSeparator
                            decimalScale={0}
                          />
                        </Text>
                      </Group>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed" tt="uppercase" fw={600}>Shipping Information</Text>
                      <Group justify="space-between">
                        <Text size="sm">Carrier:</Text>
                        <Text size="sm" fw={500}>{selectedOrder.carrier}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Tracking:</Text>
                        {selectedOrder.trackingNumber ? (
                          <Group gap="xs">
                            <Text size="sm" ff="monospace">{selectedOrder.trackingNumber}</Text>
                            <CopyButton value={selectedOrder.trackingNumber}>
                              {({ copied, copy }) => (
                                <ActionIcon size="sm" variant="subtle" onClick={copy}>
                                  <IconCopy size={12} />
                                </ActionIcon>
                              )}
                            </CopyButton>
                          </Group>
                        ) : (
                          <Text size="sm" c="dimmed">Not assigned</Text>
                        )}
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Est. Delivery:</Text>
                        <Text size="sm" fw={500}>
                          {selectedOrder.estimatedDelivery ? new Date(selectedOrder.estimatedDelivery).toLocaleDateString() : 'TBD'}
                        </Text>
                      </Group>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Paper>

              {/* Items */}
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">Order Items</Text>
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
                    {selectedOrder.items.map((item, idx) => (
                      <Table.Tr key={idx}>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>{item.quantity}</Table.Td>
                        <Table.Td>
                          <NumberFormatter
                            value={item.price}
                            prefix="$"
                            thousandSeparator
                            decimalScale={0}
                          />
                        </Table.Td>
                        <Table.Td>
                          <NumberFormatter
                            value={item.price * item.quantity}
                            prefix="$"
                            thousandSeparator
                            decimalScale={0}
                          />
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Paper>

              {/* Shipping Address */}
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">Shipping Address</Text>
                <Stack gap="xs">
                  <Text size="sm">{selectedOrder.shippingAddress.name}</Text>
                  <Text size="sm">{selectedOrder.shippingAddress.street}</Text>
                  <Text size="sm">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                  </Text>
                  <Text size="sm">{selectedOrder.shippingAddress.phone}</Text>
                </Stack>
                
                {selectedOrder.deliveryWindow && (
                  <div>
                    <Text size="sm" fw={500} mt="md">Delivery Window:</Text>
                    <Text size="sm">{selectedOrder.deliveryWindow}</Text>
                  </div>
                )}
                
                {selectedOrder.specialInstructions && (
                  <div>
                    <Text size="sm" fw={500} mt="md">Special Instructions:</Text>
                    <Text size="sm">{selectedOrder.specialInstructions}</Text>
                  </div>
                )}
              </Paper>

              {/* Tracking Timeline */}
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">Tracking Timeline</Text>
                <Timeline>
                  {selectedOrder.trackingEvents.map((event, idx) => (
                    <Timeline.Item
                      key={idx}
                      bullet={<event.icon size={16} />}
                      title={event.status}
                    >
                      <Text size="sm" c="dimmed" mb={4}>
                        {event.description}
                      </Text>
                      <Group gap="md">
                        <Group gap="xs">
                          <IconMapPin size={14} />
                          <Text size="xs" c="dimmed">{event.location}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconClock size={14} />
                          <Text size="xs" c="dimmed">
                            {new Date(event.date).toLocaleString()}
                          </Text>
                        </Group>
                      </Group>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Paper>

              {/* Contact Information */}
              {selectedOrder.deliveryContact && (
                <Paper p="md" withBorder>
                  <Text fw={600} mb="md">Delivery Contact</Text>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconUser size={16} />
                      <Text size="sm">{selectedOrder.deliveryContact.name}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconPhone size={16} />
                      <Anchor href={`tel:${selectedOrder.deliveryContact.phone}`} size="sm">
                        {selectedOrder.deliveryContact.phone}
                      </Anchor>
                    </Group>
                    <Group gap="xs">
                      <IconMail size={16} />
                      <Anchor href={`mailto:${selectedOrder.deliveryContact.email}`} size="sm">
                        {selectedOrder.deliveryContact.email}
                      </Anchor>
                    </Group>
                  </Stack>
                </Paper>
              )}

              {/* Actions */}
              <Group justify="flex-end">
                {selectedOrder.carrierUrl && selectedOrder.trackingNumber && (
                  <Button
                    variant="outline"
                    leftSection={<IconExternalLink size={16} />}
                    component="a"
                    href={`${selectedOrder.carrierUrl}?trackingNumber=${selectedOrder.trackingNumber}`}
                    target="_blank"
                  >
                    Track with {selectedOrder.carrier}
                  </Button>
                )}
                <Button onClick={closeDetails}>
                  Close
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Container>
    </DealerLayout>
  );
}
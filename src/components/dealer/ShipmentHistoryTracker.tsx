'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  Group,
  Stack,
  Button,
  Badge,
  Table,
  ActionIcon,
  Tooltip,
  Modal,
  TextInput,
  Select,
  Tabs,
  Paper,
  Grid,
  Progress,
  Timeline,
  Alert,
  Anchor,
  FileButton,
  Image,
  Divider,
  RingProgress,
  SimpleGrid,
  ThemeIcon
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DatePickerInput, DateInput } from '@mantine/dates';
import {
  IconSearch,
  IconDownload,
  IconEye,
  IconTruck,
  IconPackage,
  IconMapPin,
  IconCalendar,
  IconClock,
  IconCheck,
  IconAlertTriangle,
  IconFileText,
  IconPhoto,
  IconFilter,
  IconRefresh,
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconTarget
} from '@tabler/icons-react';

interface ShipmentHistory {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  status: 'delivered' | 'in_transit' | 'delayed' | 'returned' | 'cancelled';
  shippedDate: Date;
  deliveredDate?: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  items: Array<{
    name: string;
    quantity: number;
    weight: number;
  }>;
  totalWeight: number;
  shippingCost: number;
  deliveryAddress: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  deliveryConfirmation?: {
    signedBy: string;
    signatureImage?: string;
    deliveryNotes: string;
    proofOfDelivery: string[];
    timestamp: Date;
  };
  trackingEvents: Array<{
    timestamp: Date;
    location: string;
    status: string;
    description: string;
  }>;
  performanceMetrics: {
    onTimeDelivery: boolean;
    deliveryDays: number;
    customerSatisfaction?: number;
  };
}

interface ShipmentAnalytics {
  totalShipments: number;
  onTimeDeliveryRate: number;
  averageDeliveryTime: number;
  totalShippingCost: number;
  carrierPerformance: Array<{
    carrier: string;
    shipments: number;
    onTimeRate: number;
    avgCost: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    shipments: number;
    onTimeRate: number;
    avgCost: number;
  }>;
}

export function ShipmentHistoryTracker() {
  const [shipmentHistory, setShipmentHistory] = useState<ShipmentHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ShipmentHistory[]>([]);
  const [analytics, setAnalytics] = useState<ShipmentAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('history');
  
  // Modal states
  const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
  const [analyticsModalOpened, { open: openAnalyticsModal, close: closeAnalyticsModal }] = useDisclosure(false);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentHistory | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [carrierFilter, setCarrierFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    loadShipmentHistory();
    loadAnalytics();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [shipmentHistory, searchQuery, statusFilter, carrierFilter, dateRange]);

  const loadShipmentHistory = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockHistory: ShipmentHistory[] = [
      {
        id: 'ship-1',
        orderNumber: 'ORD-2024-001',
        trackingNumber: '1Z999AA1234567890',
        carrier: 'UPS',
        status: 'delivered',
        shippedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        deliveredDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        actualDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        items: [
          { name: 'AQS Pro Series Heat Pump', quantity: 1, weight: 150 },
          { name: 'Installation Kit', quantity: 1, weight: 25 }
        ],
        totalWeight: 175,
        shippingCost: 85.50,
        deliveryAddress: {
          name: 'John Smith',
          company: 'Smith HVAC',
          address: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701'
        },
        deliveryConfirmation: {
          signedBy: 'J. Smith',
          deliveryNotes: 'Left at loading dock as requested',
          proofOfDelivery: ['pod-image-1.jpg', 'pod-image-2.jpg'],
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        trackingEvents: [
          {
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            location: 'Chicago, IL',
            status: 'Shipped',
            description: 'Package shipped from origin facility'
          },
          {
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            location: 'Indianapolis, IN',
            status: 'In Transit',
            description: 'Package in transit to destination facility'
          },
          {
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            location: 'Springfield, IL',
            status: 'Delivered',
            description: 'Package delivered successfully'
          }
        ],
        performanceMetrics: {
          onTimeDelivery: false,
          deliveryDays: 2,
          customerSatisfaction: 4.5
        }
      },
      {
        id: 'ship-2',
        orderNumber: 'ORD-2024-002',
        trackingNumber: '1Z999AA1234567891',
        carrier: 'FedEx',
        status: 'delivered',
        shippedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        deliveredDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        actualDelivery: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        items: [
          { name: 'AQS Smart Thermostat', quantity: 3, weight: 15 }
        ],
        totalWeight: 45,
        shippingCost: 32.75,
        deliveryAddress: {
          name: 'Mike Johnson',
          company: 'ABC HVAC Solutions',
          address: '456 Industrial Blvd',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62702'
        },
        deliveryConfirmation: {
          signedBy: 'M. Johnson',
          deliveryNotes: 'Delivered to front office',
          proofOfDelivery: ['pod-image-3.jpg'],
          timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
        },
        trackingEvents: [
          {
            timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            location: 'Memphis, TN',
            status: 'Shipped',
            description: 'Package shipped from FedEx facility'
          },
          {
            timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
            location: 'St. Louis, MO',
            status: 'In Transit',
            description: 'Package in transit'
          },
          {
            timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
            location: 'Springfield, IL',
            status: 'Delivered',
            description: 'Package delivered on time'
          }
        ],
        performanceMetrics: {
          onTimeDelivery: true,
          deliveryDays: 3,
          customerSatisfaction: 5.0
        }
      },
      {
        id: 'ship-3',
        orderNumber: 'ORD-2024-003',
        trackingNumber: '1Z999AA1234567892',
        carrier: 'UPS',
        status: 'delayed',
        shippedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        items: [
          { name: 'AQS Commercial Unit', quantity: 1, weight: 300 }
        ],
        totalWeight: 300,
        shippingCost: 125.00,
        deliveryAddress: {
          name: 'Sarah Wilson',
          company: 'Wilson Commercial HVAC',
          address: '789 Business Park Dr',
          city: 'Peoria',
          state: 'IL',
          zipCode: '61614'
        },
        trackingEvents: [
          {
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            location: 'Chicago, IL',
            status: 'Shipped',
            description: 'Package shipped from origin facility'
          },
          {
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            location: 'Rockford, IL',
            status: 'Delayed',
            description: 'Package delayed due to weather conditions'
          }
        ],
        performanceMetrics: {
          onTimeDelivery: false,
          deliveryDays: 0
        }
      }
    ];
    
    setShipmentHistory(mockHistory);
    setLoading(false);
  };

  const loadAnalytics = async () => {
    const mockAnalytics: ShipmentAnalytics = {
      totalShipments: 156,
      onTimeDeliveryRate: 87.2,
      averageDeliveryTime: 2.8,
      totalShippingCost: 12450.75,
      carrierPerformance: [
        { carrier: 'UPS', shipments: 89, onTimeRate: 85.4, avgCost: 78.50 },
        { carrier: 'FedEx', shipments: 45, onTimeRate: 91.1, avgCost: 82.25 },
        { carrier: 'USPS', shipments: 22, onTimeRate: 86.4, avgCost: 45.75 }
      ],
      monthlyTrends: [
        { month: 'Jan', shipments: 28, onTimeRate: 89.3, avgCost: 75.25 },
        { month: 'Feb', shipments: 32, onTimeRate: 87.5, avgCost: 78.50 },
        { month: 'Mar', shipments: 35, onTimeRate: 85.7, avgCost: 82.75 },
        { month: 'Apr', shipments: 38, onTimeRate: 88.2, avgCost: 79.25 },
        { month: 'May', shipments: 23, onTimeRate: 87.0, avgCost: 81.50 }
      ]
    };
    
    setAnalytics(mockAnalytics);
  };

  const applyFilters = () => {
    let filtered = [...shipmentHistory];

    if (searchQuery) {
      filtered = filtered.filter(shipment =>
        shipment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.deliveryAddress.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(shipment => shipment.status === statusFilter);
    }

    if (carrierFilter) {
      filtered = filtered.filter(shipment => shipment.carrier === carrierFilter);
    }

    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(shipment =>
        shipment.shippedDate >= dateRange[0]! && shipment.shippedDate <= dateRange[1]!
      );
    }

    setFilteredHistory(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'green';
      case 'in_transit': return 'blue';
      case 'delayed': return 'orange';
      case 'returned': return 'red';
      case 'cancelled': return 'gray';
      default: return 'gray';
    }
  };

  const handleViewDetails = (shipment: ShipmentHistory) => {
    setSelectedShipment(shipment);
    openDetailsModal();
  };

  const handleDownloadPOD = (shipment: ShipmentHistory) => {
    // Simulate downloading proof of delivery
    const link = document.createElement('a');
    link.href = '#';
    link.download = `POD-${shipment.orderNumber}.pdf`;
    link.click();
  };

  const exportShipmentData = () => {
    // Simulate exporting shipment data
    const csvContent = filteredHistory.map(shipment => 
      `${shipment.orderNumber},${shipment.trackingNumber},${shipment.carrier},${shipment.status},${shipment.shippedDate.toLocaleDateString()},${shipment.deliveredDate?.toLocaleDateString() || 'N/A'}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shipment-history.csv';
    link.click();
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={3}>Shipment History & Tracking</Title>
          <Text c="dimmed">Comprehensive shipment tracking and performance analytics</Text>
        </div>
        <Group>
          <Button
            variant="light"
            leftSection={<IconChartBar size={16} />}
            onClick={openAnalyticsModal}
          >
            View Analytics
          </Button>
          <Button
            leftSection={<IconDownload size={16} />}
            onClick={exportShipmentData}
          >
            Export Data
          </Button>
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="history" leftSection={<IconPackage size={16} />}>
            Shipment History
          </Tabs.Tab>
          <Tabs.Tab value="tracking" leftSection={<IconMapPin size={16} />}>
            Active Tracking
          </Tabs.Tab>
          <Tabs.Tab value="performance" leftSection={<IconTarget size={16} />}>
            Performance Metrics
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="history">
          <Stack gap="md">
            {/* Filters */}
            <Card withBorder>
              <Group>
                <TextInput
                  placeholder="Search orders, tracking numbers..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.currentTarget.value)}
                  style={{ flex: 1 }}
                />
                <Select
                  placeholder="Status"
                  data={[
                    { value: '', label: 'All Statuses' },
                    { value: 'delivered', label: 'Delivered' },
                    { value: 'in_transit', label: 'In Transit' },
                    { value: 'delayed', label: 'Delayed' },
                    { value: 'returned', label: 'Returned' },
                    { value: 'cancelled', label: 'Cancelled' }
                  ]}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value || '')}
                  w={150}
                />
                <Select
                  placeholder="Carrier"
                  data={[
                    { value: '', label: 'All Carriers' },
                    { value: 'UPS', label: 'UPS' },
                    { value: 'FedEx', label: 'FedEx' },
                    { value: 'USPS', label: 'USPS' }
                  ]}
                  value={carrierFilter}
                  onChange={(value) => setCarrierFilter(value || '')}
                  w={120}
                />
                <DatePickerInput
                  type="range"
                  placeholder="Date range"
                  value={dateRange}
                  onChange={(value) => setDateRange(value as [Date | null, Date | null])}
                  w={200}
                />
              </Group>
            </Card>

            {/* Shipment History Table */}
            <Card withBorder>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Order</Table.Th>
                    <Table.Th>Tracking</Table.Th>
                    <Table.Th>Carrier</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Shipped</Table.Th>
                    <Table.Th>Delivered</Table.Th>
                    <Table.Th>Performance</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredHistory.map((shipment) => (
                    <Table.Tr key={shipment.id}>
                      <Table.Td>
                        <Text fw={500}>{shipment.orderNumber}</Text>
                        <Text size="xs" c="dimmed">{shipment.deliveryAddress.company}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" ff="monospace">{shipment.trackingNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <IconTruck size={16} />
                          <Text size="sm">{shipment.carrier}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(shipment.status)} variant="light">
                          {shipment.status.replace('_', ' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{shipment.shippedDate.toLocaleDateString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {shipment.deliveredDate?.toLocaleDateString() || 'Pending'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          {shipment.performanceMetrics.onTimeDelivery ? (
                            <ThemeIcon color="green" size="sm" variant="light">
                              <IconCheck size={12} />
                            </ThemeIcon>
                          ) : (
                            <ThemeIcon color="red" size="sm" variant="light">
                              <IconAlertTriangle size={12} />
                            </ThemeIcon>
                          )}
                          <Text size="xs">
                            {shipment.performanceMetrics.deliveryDays}d
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Tooltip label="View Details">
                            <ActionIcon
                              variant="light"
                              onClick={() => handleViewDetails(shipment)}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          {shipment.deliveryConfirmation && (
                            <Tooltip label="Download POD">
                              <ActionIcon
                                variant="light"
                                onClick={() => handleDownloadPOD(shipment)}
                              >
                                <IconDownload size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {filteredHistory.length === 0 && (
                <Text ta="center" c="dimmed" py="xl">
                  No shipments found matching your criteria
                </Text>
              )}
            </Card>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="tracking">
          <Stack gap="md">
            {filteredHistory
              .filter(shipment => ['in_transit', 'delayed'].includes(shipment.status))
              .map((shipment) => (
                <Card key={shipment.id} withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={500}>{shipment.orderNumber}</Text>
                      <Text size="sm" c="dimmed">{shipment.trackingNumber}</Text>
                    </div>
                    <Badge color={getStatusColor(shipment.status)} variant="light">
                      {shipment.status.replace('_', ' ')}
                    </Badge>
                  </Group>

                  <Timeline active={shipment.trackingEvents.length - 1}>
                    {shipment.trackingEvents.map((event, index) => (
                      <Timeline.Item
                        key={index}
                        title={event.status}
                        bullet={
                          event.status === 'Delivered' ? <IconCheck size={12} /> :
                          event.status === 'Delayed' ? <IconAlertTriangle size={12} /> :
                          <IconMapPin size={12} />
                        }
                      >
                        <Text size="sm" c="dimmed">{event.location}</Text>
                        <Text size="sm">{event.description}</Text>
                        <Text size="xs" c="dimmed">
                          {event.timestamp.toLocaleString()}
                        </Text>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              ))}

            {filteredHistory.filter(shipment => ['in_transit', 'delayed'].includes(shipment.status)).length === 0 && (
              <Card withBorder>
                <Text ta="center" c="dimmed" py="xl">
                  No active shipments to track
                </Text>
              </Card>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="performance">
          {analytics && (
            <SimpleGrid cols={2} spacing="md">
              <Card withBorder>
                <Group justify="space-between" mb="md">
                  <Text fw={500}>On-Time Delivery Rate</Text>
                  <ThemeIcon color="blue" variant="light">
                    <IconTarget size={16} />
                  </ThemeIcon>
                </Group>
                <RingProgress
                  size={120}
                  thickness={12}
                  sections={[{ value: analytics.onTimeDeliveryRate, color: 'blue' }]}
                  label={
                    <Text ta="center" fw={700} size="lg">
                      {analytics.onTimeDeliveryRate}%
                    </Text>
                  }
                />
              </Card>

              <Card withBorder>
                <Group justify="space-between" mb="md">
                  <Text fw={500}>Average Delivery Time</Text>
                  <ThemeIcon color="green" variant="light">
                    <IconClock size={16} />
                  </ThemeIcon>
                </Group>
                <Text size="xl" fw={700} ta="center">
                  {analytics.averageDeliveryTime} days
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  Across {analytics.totalShipments} shipments
                </Text>
              </Card>

              <Card withBorder>
                <Text fw={500} mb="md">Carrier Performance</Text>
                <Stack gap="sm">
                  {analytics.carrierPerformance.map((carrier) => (
                    <Paper key={carrier.carrier} p="sm" withBorder>
                      <Group justify="space-between" mb="xs">
                        <Text fw={500}>{carrier.carrier}</Text>
                        <Badge variant="light">{carrier.shipments} shipments</Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">On-time: {carrier.onTimeRate}%</Text>
                        <Text size="sm">Avg cost: ${carrier.avgCost}</Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Card>

              <Card withBorder>
                <Text fw={500} mb="md">Monthly Trends</Text>
                <Stack gap="xs">
                  {analytics.monthlyTrends.slice(-3).map((month) => (
                    <Group key={month.month} justify="space-between">
                      <Text size="sm">{month.month}</Text>
                      <Group gap="md">
                        <Text size="sm">{month.shipments} shipments</Text>
                        <Text size="sm">{month.onTimeRate}% on-time</Text>
                      </Group>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </SimpleGrid>
          )}
        </Tabs.Panel>
      </Tabs>

      {/* Shipment Details Modal */}
      <Modal
        opened={detailsModalOpened}
        onClose={closeDetailsModal}
        title="Shipment Details"
        size="xl"
      >
        {selectedShipment && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text fw={500} size="lg">{selectedShipment.orderNumber}</Text>
                <Text size="sm" c="dimmed">{selectedShipment.trackingNumber}</Text>
              </div>
              <Badge color={getStatusColor(selectedShipment.status)} size="lg">
                {selectedShipment.status.replace('_', ' ')}
              </Badge>
            </Group>

            <Divider />

            <Grid>
              <Grid.Col span={6}>
                <Stack gap="sm">
                  <Text fw={500}>Delivery Information</Text>
                  <Text size="sm">
                    <strong>Company:</strong> {selectedShipment.deliveryAddress.company}
                  </Text>
                  <Text size="sm">
                    <strong>Contact:</strong> {selectedShipment.deliveryAddress.name}
                  </Text>
                  <Text size="sm">
                    <strong>Address:</strong> {selectedShipment.deliveryAddress.address}, {selectedShipment.deliveryAddress.city}, {selectedShipment.deliveryAddress.state} {selectedShipment.deliveryAddress.zipCode}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap="sm">
                  <Text fw={500}>Shipment Details</Text>
                  <Text size="sm">
                    <strong>Carrier:</strong> {selectedShipment.carrier}
                  </Text>
                  <Text size="sm">
                    <strong>Weight:</strong> {selectedShipment.totalWeight} lbs
                  </Text>
                  <Text size="sm">
                    <strong>Shipping Cost:</strong> ${selectedShipment.shippingCost}
                  </Text>
                  <Text size="sm">
                    <strong>Shipped:</strong> {selectedShipment.shippedDate.toLocaleDateString()}
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>

            <Divider />

            <div>
              <Text fw={500} mb="md">Items Shipped</Text>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Item</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Weight</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedShipment.items.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>{item.weight} lbs</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>

            <Divider />

            <div>
              <Text fw={500} mb="md">Tracking History</Text>
              <Timeline>
                {selectedShipment.trackingEvents.map((event, index) => (
                  <Timeline.Item
                    key={index}
                    title={event.status}
                    bullet={
                      event.status === 'Delivered' ? <IconCheck size={12} /> :
                      event.status === 'Delayed' ? <IconAlertTriangle size={12} /> :
                      <IconMapPin size={12} />
                    }
                  >
                    <Text size="sm" c="dimmed">{event.location}</Text>
                    <Text size="sm">{event.description}</Text>
                    <Text size="xs" c="dimmed">
                      {event.timestamp.toLocaleString()}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>

            {selectedShipment.deliveryConfirmation && (
              <>
                <Divider />
                <div>
                  <Text fw={500} mb="md">Delivery Confirmation</Text>
                  <Paper p="md" withBorder>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm"><strong>Signed by:</strong> {selectedShipment.deliveryConfirmation.signedBy}</Text>
                        <Text size="sm"><strong>Time:</strong> {selectedShipment.deliveryConfirmation.timestamp.toLocaleString()}</Text>
                      </Group>
                      <Text size="sm"><strong>Notes:</strong> {selectedShipment.deliveryConfirmation.deliveryNotes}</Text>
                      {selectedShipment.deliveryConfirmation.proofOfDelivery.length > 0 && (
                        <Group>
                          <Text size="sm"><strong>Proof of Delivery:</strong></Text>
                          {selectedShipment.deliveryConfirmation.proofOfDelivery.map((pod, index) => (
                            <Anchor key={index} size="sm" onClick={() => {}}>
                              {pod}
                            </Anchor>
                          ))}
                        </Group>
                      )}
                    </Stack>
                  </Paper>
                </div>
              </>
            )}
          </Stack>
        )}
      </Modal>

      {/* Analytics Modal */}
      <Modal
        opened={analyticsModalOpened}
        onClose={closeAnalyticsModal}
        title="Shipment Analytics"
        size="xl"
      >
        {analytics && (
          <Stack gap="md">
            <SimpleGrid cols={3} spacing="md">
              <Paper p="md" withBorder ta="center">
                <Text size="xl" fw={700} c="blue">{analytics.totalShipments}</Text>
                <Text size="sm" c="dimmed">Total Shipments</Text>
              </Paper>
              <Paper p="md" withBorder ta="center">
                <Text size="xl" fw={700} c="green">{analytics.onTimeDeliveryRate}%</Text>
                <Text size="sm" c="dimmed">On-Time Rate</Text>
              </Paper>
              <Paper p="md" withBorder ta="center">
                <Text size="xl" fw={700} c="orange">${analytics.totalShippingCost.toLocaleString()}</Text>
                <Text size="sm" c="dimmed">Total Shipping Cost</Text>
              </Paper>
            </SimpleGrid>

            <Grid>
              <Grid.Col span={6}>
                <Card withBorder>
                  <Text fw={500} mb="md">Carrier Performance Comparison</Text>
                  <Stack gap="md">
                    {analytics.carrierPerformance.map((carrier) => (
                      <div key={carrier.carrier}>
                        <Group justify="space-between" mb="xs">
                          <Text fw={500}>{carrier.carrier}</Text>
                          <Text size="sm">{carrier.onTimeRate}% on-time</Text>
                        </Group>
                        <Progress value={carrier.onTimeRate} color="blue" />
                        <Group justify="space-between" mt="xs">
                          <Text size="xs" c="dimmed">{carrier.shipments} shipments</Text>
                          <Text size="xs" c="dimmed">Avg: ${carrier.avgCost}</Text>
                        </Group>
                      </div>
                    ))}
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card withBorder>
                  <Text fw={500} mb="md">Monthly Performance Trends</Text>
                  <Stack gap="sm">
                    {analytics.monthlyTrends.map((month) => (
                      <Paper key={month.month} p="sm" withBorder>
                        <Group justify="space-between">
                          <Text fw={500}>{month.month}</Text>
                          <Group gap="md">
                            <Text size="sm">{month.shipments} shipments</Text>
                            <Badge color={month.onTimeRate >= 90 ? 'green' : month.onTimeRate >= 80 ? 'yellow' : 'red'} variant="light">
                              {month.onTimeRate}%
                            </Badge>
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
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
  Select,
  Textarea,
  Checkbox,
  Grid,
  Alert,
  Tabs,
  Indicator,
  Paper,
  Divider,
  NumberInput,
  Switch
} from '@mantine/core';
import { DatePicker, Calendar } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCalendar,
  IconTruck,
  IconPackage,
  IconClock,
  IconMapPin,
  IconEdit,
  IconPlus,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconRefresh
} from '@tabler/icons-react';

interface DeliveryWindow {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  available: boolean;
  cost: number;
}

interface ShipmentSchedule {
  id: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    weight: number;
  }>;
  scheduledDate: Date;
  deliveryWindow: DeliveryWindow;
  specialInstructions: string;
  consolidatedWith: string[];
  status: 'scheduled' | 'confirmed' | 'in_transit' | 'delivered' | 'rescheduled';
  address: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  estimatedWeight: number;
  requiresSignature: boolean;
  isConsolidated: boolean;
}

interface ConsolidationOption {
  id: string;
  orderNumbers: string[];
  totalWeight: number;
  estimatedSavings: number;
  suggestedDate: Date;
  deliveryWindow: DeliveryWindow;
}

const deliveryWindows: DeliveryWindow[] = [
  { id: '1', name: 'Morning (8:00 AM - 12:00 PM)', startTime: '08:00', endTime: '12:00', available: true, cost: 0 },
  { id: '2', name: 'Afternoon (12:00 PM - 5:00 PM)', startTime: '12:00', endTime: '17:00', available: true, cost: 0 },
  { id: '3', name: 'Evening (5:00 PM - 8:00 PM)', startTime: '17:00', endTime: '20:00', available: true, cost: 25 },
  { id: '4', name: 'Early Morning (6:00 AM - 8:00 AM)', startTime: '06:00', endTime: '08:00', available: true, cost: 35 },
  { id: '5', name: 'Saturday Delivery', startTime: '09:00', endTime: '15:00', available: true, cost: 50 },
];

export function ShipmentScheduleManager() {
  const [schedules, setSchedules] = useState<ShipmentSchedule[]>([]);
  const [consolidationOptions, setConsolidationOptions] = useState<ConsolidationOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [activeTab, setActiveTab] = useState<string | null>('calendar');
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [scheduleModalOpened, { open: openScheduleModal, close: closeScheduleModal }] = useDisclosure(false);
  const [consolidationModalOpened, { open: openConsolidationModal, close: closeConsolidationModal }] = useDisclosure(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ShipmentSchedule | null>(null);
  
  // Form states
  const [selectedWindow, setSelectedWindow] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [requiresSignature, setRequiresSignature] = useState(false);
  const [enableConsolidation, setEnableConsolidation] = useState(false);

  useEffect(() => {
    loadSchedules();
    loadConsolidationOptions();
  }, []);

  const loadSchedules = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockSchedules: ShipmentSchedule[] = [
      {
        id: 'sch-1',
        orderNumber: 'ORD-2024-001',
        items: [
          { name: 'AQS Pro Series Heat Pump', quantity: 1, weight: 150 },
          { name: 'Installation Kit', quantity: 1, weight: 25 }
        ],
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        deliveryWindow: deliveryWindows[0],
        specialInstructions: 'Call before delivery',
        consolidatedWith: [],
        status: 'scheduled',
        address: {
          name: 'John Smith',
          company: 'Smith HVAC',
          address: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          phone: '555-0123'
        },
        estimatedWeight: 175,
        requiresSignature: true,
        isConsolidated: false
      },
      {
        id: 'sch-2',
        orderNumber: 'ORD-2024-002',
        items: [
          { name: 'AQS Smart Thermostat', quantity: 3, weight: 15 }
        ],
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        deliveryWindow: deliveryWindows[1],
        specialInstructions: 'Leave at loading dock',
        consolidatedWith: ['ORD-2024-003'],
        status: 'confirmed',
        address: {
          name: 'Mike Johnson',
          company: 'ABC HVAC Solutions',
          address: '456 Industrial Blvd',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62702',
          phone: '555-0456'
        },
        estimatedWeight: 45,
        requiresSignature: false,
        isConsolidated: true
      }
    ];
    
    setSchedules(mockSchedules);
    setLoading(false);
  };

  const loadConsolidationOptions = async () => {
    const mockOptions: ConsolidationOption[] = [
      {
        id: 'cons-1',
        orderNumbers: ['ORD-2024-004', 'ORD-2024-005'],
        totalWeight: 200,
        estimatedSavings: 45,
        suggestedDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        deliveryWindow: deliveryWindows[0]
      },
      {
        id: 'cons-2',
        orderNumbers: ['ORD-2024-006', 'ORD-2024-007', 'ORD-2024-008'],
        totalWeight: 350,
        estimatedSavings: 75,
        suggestedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        deliveryWindow: deliveryWindows[1]
      }
    ];
    
    setConsolidationOptions(mockOptions);
  };

  const handleScheduleShipment = () => {
    if (!selectedWindow) {
      notifications.show({
        title: 'Error',
        message: 'Please select a delivery window',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    // Simulate scheduling
    notifications.show({
      title: 'Success',
      message: 'Shipment scheduled successfully',
      color: 'green',
      icon: <IconCheck size={16} />
    });

    closeScheduleModal();
    loadSchedules();
  };

  const handleConsolidateShipments = (option: ConsolidationOption) => {
    notifications.show({
      title: 'Success',
      message: `Consolidated ${option.orderNumbers.length} orders. Estimated savings: $${option.estimatedSavings}`,
      color: 'green',
      icon: <IconCheck size={16} />
    });

    closeConsolidationModal();
    loadSchedules();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'green';
      case 'confirmed': return 'blue';
      case 'scheduled': return 'yellow';
      case 'in_transit': return 'cyan';
      case 'rescheduled': return 'orange';
      default: return 'gray';
    }
  };

  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(schedule => 
      schedule.scheduledDate.toDateString() === date.toDateString()
    );
  };

  const renderCalendarDay = (date: string) => {
    const dateObj = new Date(date);
    const daySchedules = getSchedulesForDate(dateObj);
    if (daySchedules.length === 0) return null;

    return (
      <Indicator size={6} color="blue" offset={-2}>
        <div />
      </Indicator>
    );
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={3}>Shipment Schedule</Title>
          <Text c="dimmed">Manage delivery schedules and consolidation options</Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openScheduleModal}
          >
            Schedule Shipment
          </Button>
          <Button
            variant="light"
            leftSection={<IconPackage size={16} />}
            onClick={openConsolidationModal}
          >
            View Consolidation Options
          </Button>
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="calendar" leftSection={<IconCalendar size={16} />}>
            Calendar View
          </Tabs.Tab>
          <Tabs.Tab value="list" leftSection={<IconTruck size={16} />}>
            Schedule List
          </Tabs.Tab>
          <Tabs.Tab value="consolidation" leftSection={<IconPackage size={16} />}>
            Consolidation
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="calendar">
          <Grid>
            <Grid.Col span={8}>
              <Card withBorder>
                <Calendar
                  date={selectedDate || undefined}
                  onDateChange={(date) => setSelectedDate(new Date(date))}
                  renderDay={renderCalendarDay}
                  size="lg"
                />
              </Card>
            </Grid.Col>
            <Grid.Col span={4}>
              <Card withBorder>
                <Title order={4} mb="md">
                  {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}
                </Title>
                {selectedDate && (
                  <Stack gap="sm">
                    {getSchedulesForDate(selectedDate).map((schedule) => (
                      <Paper key={schedule.id} p="sm" withBorder>
                        <Group justify="space-between" mb="xs">
                          <Text fw={500} size="sm">{schedule.orderNumber}</Text>
                          <Badge color={getStatusColor(schedule.status)} size="sm">
                            {schedule.status}
                          </Badge>
                        </Group>
                        <Text size="xs" c="dimmed" mb="xs">
                          {schedule.deliveryWindow.name}
                        </Text>
                        <Text size="xs">
                          {schedule.address.company}
                        </Text>
                        {schedule.isConsolidated && (
                          <Badge variant="light" color="blue" size="xs" mt="xs">
                            Consolidated
                          </Badge>
                        )}
                      </Paper>
                    ))}
                    {getSchedulesForDate(selectedDate).length === 0 && (
                      <Text c="dimmed" size="sm">No shipments scheduled</Text>
                    )}
                  </Stack>
                )}
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="list">
          <Card withBorder>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Order</Table.Th>
                  <Table.Th>Scheduled Date</Table.Th>
                  <Table.Th>Delivery Window</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Weight</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {schedules.map((schedule) => (
                  <Table.Tr key={schedule.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <Text fw={500}>{schedule.orderNumber}</Text>
                        {schedule.isConsolidated && (
                          <Badge variant="light" color="blue" size="xs">
                            Consolidated
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{schedule.scheduledDate.toLocaleDateString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{schedule.deliveryWindow.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(schedule.status)} variant="light">
                        {schedule.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{schedule.estimatedWeight} lbs</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Edit Schedule">
                          <ActionIcon
                            variant="light"
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              openScheduleModal();
                            }}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Reschedule">
                          <ActionIcon variant="light" color="orange">
                            <IconRefresh size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="consolidation">
          <Stack gap="md">
            {consolidationOptions.length > 0 && (
              <Alert icon={<IconAlertCircle size={16} />} color="blue">
                We found {consolidationOptions.length} consolidation opportunities that could save you money on shipping costs.
              </Alert>
            )}
            
            {consolidationOptions.map((option) => (
              <Card key={option.id} withBorder>
                <Group justify="space-between" mb="md">
                  <div>
                    <Title order={5}>Consolidation Opportunity</Title>
                    <Text size="sm" c="dimmed">
                      {option.orderNumbers.length} orders • {option.totalWeight} lbs total
                    </Text>
                  </div>
                  <Badge color="green" size="lg">
                    Save ${option.estimatedSavings}
                  </Badge>
                </Group>
                
                <Grid>
                  <Grid.Col span={6}>
                    <Text size="sm" fw={500} mb="xs">Orders to Consolidate:</Text>
                    <Stack gap="xs">
                      {option.orderNumbers.map((orderNum) => (
                        <Text key={orderNum} size="sm">{orderNum}</Text>
                      ))}
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="sm" fw={500} mb="xs">Suggested Schedule:</Text>
                    <Text size="sm">{option.suggestedDate.toLocaleDateString()}</Text>
                    <Text size="sm" c="dimmed">{option.deliveryWindow.name}</Text>
                  </Grid.Col>
                </Grid>
                
                <Divider my="md" />
                
                <Group justify="flex-end">
                  <Button
                    variant="light"
                    leftSection={<IconPackage size={16} />}
                    onClick={() => handleConsolidateShipments(option)}
                  >
                    Consolidate Orders
                  </Button>
                </Group>
              </Card>
            ))}
            
            {consolidationOptions.length === 0 && (
              <Card withBorder>
                <Text ta="center" c="dimmed">
                  No consolidation opportunities available at this time.
                </Text>
              </Card>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Schedule Shipment Modal */}
      <Modal
        opened={scheduleModalOpened}
        onClose={closeScheduleModal}
        title="Schedule Shipment"
        size="lg"
      >
        <Stack gap="md">
          <div>
            <Text size="sm" fw={500} mb={5}>Delivery Date *</Text>
            <DatePicker
              minDate={new Date()}
            />
          </div>
          
          <Select
            label="Delivery Window"
            placeholder="Select delivery window"
            data={deliveryWindows.map(window => ({
              value: window.id,
              label: `${window.name}${window.cost > 0 ? ` (+$${window.cost})` : ''}`
            }))}
            value={selectedWindow}
            onChange={(value) => setSelectedWindow(value || '')}
            required
          />
          
          <Textarea
            label="Special Instructions"
            placeholder="Any special delivery instructions..."
            value={specialInstructions}
            onChange={(event) => setSpecialInstructions(event.currentTarget.value)}
            rows={3}
          />
          
          <Checkbox
            label="Signature required"
            checked={requiresSignature}
            onChange={(event) => setRequiresSignature(event.currentTarget.checked)}
          />
          
          <Switch
            label="Enable consolidation with other orders"
            description="Combine with other orders to save on shipping costs"
            checked={enableConsolidation}
            onChange={(event) => setEnableConsolidation(event.currentTarget.checked)}
          />
          
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeScheduleModal}>
              Cancel
            </Button>
            <Button onClick={handleScheduleShipment}>
              Schedule Shipment
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Consolidation Options Modal */}
      <Modal
        opened={consolidationModalOpened}
        onClose={closeConsolidationModal}
        title="Consolidation Options"
        size="xl"
      >
        <Stack gap="md">
          {consolidationOptions.map((option) => (
            <Card key={option.id} withBorder>
              <Group justify="space-between" mb="md">
                <div>
                  <Text fw={500}>
                    Consolidate {option.orderNumbers.length} orders
                  </Text>
                  <Text size="sm" c="dimmed">
                    Total weight: {option.totalWeight} lbs
                  </Text>
                </div>
                <Badge color="green" size="lg">
                  Save ${option.estimatedSavings}
                </Badge>
              </Group>
              
              <Text size="sm" mb="xs">Orders: {option.orderNumbers.join(', ')}</Text>
              <Text size="sm" mb="md">
                Suggested delivery: {option.suggestedDate.toLocaleDateString()} - {option.deliveryWindow.name}
              </Text>
              
              <Button
                fullWidth
                onClick={() => handleConsolidateShipments(option)}
              >
                Apply Consolidation
              </Button>
            </Card>
          ))}
        </Stack>
      </Modal>
    </Stack>
  );
}
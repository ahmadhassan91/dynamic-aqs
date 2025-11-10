'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Grid,
  Card,
  Group,
  Button,
  Paper,
  Select,
  Modal,
  Alert,
  Badge,
  Table,
  Switch,
  Textarea,
  ActionIcon,
  Tooltip,
  Divider,
  TextInput,
  MultiSelect,
} from '@mantine/core';
import { Calendar, TimeInput } from '@mantine/dates';
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconTruck,
  IconEdit,
  IconTrash,
  IconPlus,
  IconCheck,
  IconAlertTriangle,
  IconX,
  IconSettings,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DatePickerInput } from '@mantine/dates';

export interface DeliveryWindow {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxDeliveries?: number;
  currentDeliveries?: number;
  specialInstructions?: string;
  requiresAppointment: boolean;
  priority: 'standard' | 'preferred' | 'rush';
}

export interface ScheduledDelivery {
  id: string;
  orderId: string;
  trackingNumber: string;
  deliveryWindowId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'confirmed' | 'in_transit' | 'delivered' | 'rescheduled' | 'failed';
  deliveryAddress: string;
  contactName: string;
  contactPhone: string;
  specialRequirements?: string[];
  estimatedDuration?: number; // minutes
  createdAt: string;
  updatedAt: string;
}

// Mock delivery windows data
const mockDeliveryWindows: DeliveryWindow[] = [
  {
    id: 'dw-001',
    date: '2024-01-22',
    startTime: '08:00',
    endTime: '12:00',
    isAvailable: true,
    maxDeliveries: 5,
    currentDeliveries: 2,
    requiresAppointment: false,
    priority: 'standard',
  },
  {
    id: 'dw-002',
    date: '2024-01-22',
    startTime: '13:00',
    endTime: '17:00',
    isAvailable: true,
    maxDeliveries: 5,
    currentDeliveries: 3,
    requiresAppointment: false,
    priority: 'standard',
  },
  {
    id: 'dw-003',
    date: '2024-01-23',
    startTime: '08:00',
    endTime: '12:00',
    isAvailable: true,
    maxDeliveries: 3,
    currentDeliveries: 0,
    specialInstructions: 'Loading dock access required',
    requiresAppointment: true,
    priority: 'preferred',
  },
  {
    id: 'dw-004',
    date: '2024-01-23',
    startTime: '13:00',
    endTime: '17:00',
    isAvailable: false,
    maxDeliveries: 5,
    currentDeliveries: 5,
    requiresAppointment: false,
    priority: 'standard',
  },
];

// Mock scheduled deliveries
const mockScheduledDeliveries: ScheduledDelivery[] = [
  {
    id: 'sd-001',
    orderId: 'ORD-2024-001',
    trackingNumber: 'DYN1234567890',
    deliveryWindowId: 'dw-001',
    scheduledDate: '2024-01-22',
    scheduledTime: '10:00',
    status: 'confirmed',
    deliveryAddress: '1234 Main Street, Springfield, IL 62701',
    contactName: 'John Smith',
    contactPhone: '(555) 123-4567',
    specialRequirements: ['Forklift', 'Loading Dock'],
    estimatedDuration: 30,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: 'sd-002',
    orderId: 'ORD-2024-003',
    trackingNumber: 'DYN0987654321',
    deliveryWindowId: 'dw-002',
    scheduledDate: '2024-01-22',
    scheduledTime: '15:00',
    status: 'scheduled',
    deliveryAddress: '456 Business Ave, Springfield, IL 62702',
    contactName: 'Mike Johnson',
    contactPhone: '(555) 987-6543',
    specialRequirements: ['Crane', 'Safety Equipment'],
    estimatedDuration: 45,
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
  },
];

interface DeliveryWindowSchedulerProps {
  orderId?: string;
  trackingNumber?: string;
  onScheduleConfirmed?: (delivery: ScheduledDelivery) => void;
}

export function DeliveryWindowScheduler({
  orderId,
  trackingNumber,
  onScheduleConfirmed,
}: DeliveryWindowSchedulerProps) {
  const [deliveryWindows, setDeliveryWindows] = useState<DeliveryWindow[]>(mockDeliveryWindows);
  const [scheduledDeliveries, setScheduledDeliveries] = useState<ScheduledDelivery[]>(mockScheduledDeliveries);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedWindow, setSelectedWindow] = useState<DeliveryWindow | null>(null);
  const [scheduleModalOpened, { open: openScheduleModal, close: closeScheduleModal }] = useDisclosure(false);
  const [rescheduleModalOpened, { open: openRescheduleModal, close: closeRescheduleModal }] = useDisclosure(false);
  const [selectedDelivery, setSelectedDelivery] = useState<ScheduledDelivery | null>(null);

  // Form state for scheduling
  const [schedulingData, setSchedulingData] = useState({
    contactName: '',
    contactPhone: '',
    deliveryAddress: '',
    specialRequirements: [] as string[],
    specialInstructions: '',
    preferredTime: '',
  });

  const getAvailableWindows = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return deliveryWindows.filter(window => 
      window.date === dateStr && 
      window.isAvailable && 
      (window.currentDeliveries || 0) < (window.maxDeliveries || 0)
    );
  };

  const getScheduledDeliveriesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledDeliveries.filter(delivery => delivery.scheduledDate === dateStr);
  };

  const handleScheduleDelivery = (window: DeliveryWindow) => {
    setSelectedWindow(window);
    setSchedulingData({
      contactName: '',
      contactPhone: '',
      deliveryAddress: '',
      specialRequirements: [],
      specialInstructions: '',
      preferredTime: window.startTime,
    });
    openScheduleModal();
  };

  const handleConfirmSchedule = () => {
    if (!selectedWindow || !orderId) return;

    const newDelivery: ScheduledDelivery = {
      id: `sd-${Date.now()}`,
      orderId,
      trackingNumber: trackingNumber || '',
      deliveryWindowId: selectedWindow.id,
      scheduledDate: selectedWindow.date,
      scheduledTime: schedulingData.preferredTime,
      status: 'scheduled',
      deliveryAddress: schedulingData.deliveryAddress,
      contactName: schedulingData.contactName,
      contactPhone: schedulingData.contactPhone,
      specialRequirements: schedulingData.specialRequirements,
      estimatedDuration: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setScheduledDeliveries(prev => [...prev, newDelivery]);
    
    // Update window availability
    setDeliveryWindows(prev => prev.map(window => 
      window.id === selectedWindow.id 
        ? { ...window, currentDeliveries: (window.currentDeliveries || 0) + 1 }
        : window
    ));

    onScheduleConfirmed?.(newDelivery);
    closeScheduleModal();

    notifications.show({
      title: 'Delivery Scheduled',
      message: `Delivery scheduled for ${new Date(selectedWindow.date).toLocaleDateString()} at ${schedulingData.preferredTime}`,
      color: 'green',
      icon: <IconCheck size={16} />,
    });
  };

  const handleReschedule = (delivery: ScheduledDelivery) => {
    setSelectedDelivery(delivery);
    openRescheduleModal();
  };

  const handleCancelDelivery = (deliveryId: string) => {
    const delivery = scheduledDeliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    setScheduledDeliveries(prev => prev.filter(d => d.id !== deliveryId));
    
    // Update window availability
    setDeliveryWindows(prev => prev.map(window => 
      window.id === delivery.deliveryWindowId 
        ? { ...window, currentDeliveries: Math.max(0, (window.currentDeliveries || 0) - 1) }
        : window
    ));

    notifications.show({
      title: 'Delivery Cancelled',
      message: 'Delivery has been cancelled and the time slot is now available',
      color: 'orange',
      icon: <IconX size={16} />,
    });
  };

  const getStatusColor = (status: ScheduledDelivery['status']) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'confirmed': return 'green';
      case 'in_transit': return 'orange';
      case 'delivered': return 'green';
      case 'rescheduled': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: DeliveryWindow['priority']) => {
    switch (priority) {
      case 'rush': return 'red';
      case 'preferred': return 'blue';
      case 'standard': return 'gray';
      default: return 'gray';
    }
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={2}>Delivery Window Scheduler</Title>
            <Text c="dimmed">
              Schedule and manage delivery appointments for your orders
            </Text>
          </div>
        </Group>

        <Grid>
          {/* Calendar and Date Selection */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Select Delivery Date</Title>
              <Calendar
                date={selectedDate || undefined}
                onDateChange={(date) => setSelectedDate(new Date(date))}
                minDate={new Date()}
                maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
                getDayProps={(date) => {
                  const dateObj = new Date(date);
                  const availableWindows = getAvailableWindows(dateObj);
                  const scheduledDeliveries = getScheduledDeliveriesForDate(dateObj);
                  
                  return {
                    style: {
                      backgroundColor: availableWindows.length > 0 
                        ? 'var(--mantine-color-green-1)' 
                        : scheduledDeliveries.length > 0 
                          ? 'var(--mantine-color-blue-1)' 
                          : undefined,
                    },
                  };
                }}
              />
              
              <Stack gap="xs" mt="md">
                <Group gap="xs">
                  <div style={{ width: 12, height: 12, backgroundColor: 'var(--mantine-color-green-1)', borderRadius: 2 }} />
                  <Text size="xs">Available windows</Text>
                </Group>
                <Group gap="xs">
                  <div style={{ width: 12, height: 12, backgroundColor: 'var(--mantine-color-blue-1)', borderRadius: 2 }} />
                  <Text size="xs">Scheduled deliveries</Text>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Available Windows */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper p="md" withBorder>
              <Title order={4} mb="md">
                Available Windows - {selectedDate?.toLocaleDateString()}
              </Title>
              
              {selectedDate && (
                <Stack gap="md">
                  {getAvailableWindows(selectedDate).map((window) => (
                    <Card key={window.id} shadow="sm" padding="md" radius="md" withBorder>
                      <Group justify="space-between" align="flex-start">
                        <div style={{ flex: 1 }}>
                          <Group gap="md" mb="xs">
                            <Group gap="xs">
                              <IconClock size={16} />
                              <Text fw={600}>{formatTimeRange(window.startTime, window.endTime)}</Text>
                            </Group>
                            <Badge color={getPriorityColor(window.priority)} size="sm">
                              {window.priority}
                            </Badge>
                            {window.requiresAppointment && (
                              <Badge color="orange" size="sm">
                                Appointment Required
                              </Badge>
                            )}
                          </Group>
                          
                          <Group gap="md" mb="xs">
                            <Text size="sm" c="dimmed">
                              Capacity: {window.currentDeliveries || 0} / {window.maxDeliveries || 0}
                            </Text>
                            <Text size="sm" c="dimmed">
                              Available: {(window.maxDeliveries || 0) - (window.currentDeliveries || 0)} slots
                            </Text>
                          </Group>
                          
                          {window.specialInstructions && (
                            <Text size="sm" c="dimmed" mt="xs">
                              <strong>Note:</strong> {window.specialInstructions}
                            </Text>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => handleScheduleDelivery(window)}
                          disabled={!orderId}
                        >
                          Schedule
                        </Button>
                      </Group>
                    </Card>
                  ))}
                  
                  {getAvailableWindows(selectedDate).length === 0 && (
                    <Alert
                      icon={<IconAlertTriangle size={16} />}
                      color="yellow"
                      variant="light"
                    >
                      No available delivery windows for this date. Please select a different date.
                    </Alert>
                  )}
                </Stack>
              )}
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Scheduled Deliveries */}
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Scheduled Deliveries</Title>
          
          {scheduledDeliveries.length > 0 ? (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Order ID</Table.Th>
                  <Table.Th>Date & Time</Table.Th>
                  <Table.Th>Contact</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {scheduledDeliveries.map((delivery) => (
                  <Table.Tr key={delivery.id}>
                    <Table.Td>
                      <Text fw={500}>{delivery.orderId}</Text>
                      {delivery.trackingNumber && (
                        <Text size="xs" c="dimmed" ff="monospace">
                          {delivery.trackingNumber}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {new Date(delivery.scheduledDate).toLocaleDateString()}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {delivery.scheduledTime}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{delivery.contactName}</Text>
                      <Text size="xs" c="dimmed">{delivery.contactPhone}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(delivery.status)} size="sm">
                        {delivery.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Reschedule">
                          <ActionIcon
                            variant="subtle"
                            onClick={() => handleReschedule(delivery)}
                            disabled={delivery.status === 'delivered'}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Cancel">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleCancelDelivery(delivery.id)}
                            disabled={delivery.status === 'delivered' || delivery.status === 'in_transit'}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Alert
              icon={<IconCalendar size={16} />}
              color="blue"
              variant="light"
            >
              No scheduled deliveries. Use the calendar above to schedule delivery windows.
            </Alert>
          )}
        </Paper>
      </Stack>

      {/* Schedule Delivery Modal */}
      <Modal
        opened={scheduleModalOpened}
        onClose={closeScheduleModal}
        title="Schedule Delivery"
        size="lg"
      >
        {selectedWindow && (
          <Stack gap="lg">
            <Alert
              icon={<IconCalendar size={16} />}
              color="blue"
              variant="light"
            >
              Scheduling delivery for {new Date(selectedWindow.date).toLocaleDateString()} 
              between {formatTimeRange(selectedWindow.startTime, selectedWindow.endTime)}
            </Alert>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Contact Name"
                  placeholder="Enter contact name"
                  value={schedulingData.contactName}
                  onChange={(e) => setSchedulingData(prev => ({ ...prev, contactName: e.target.value }))}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Contact Phone"
                  placeholder="Enter phone number"
                  value={schedulingData.contactPhone}
                  onChange={(e) => setSchedulingData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  required
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Delivery Address"
                  placeholder="Enter full delivery address"
                  value={schedulingData.deliveryAddress}
                  onChange={(e) => setSchedulingData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                  required
                  rows={2}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TimeInput
                  label="Preferred Time"
                  value={schedulingData.preferredTime}
                  onChange={(event) => setSchedulingData(prev => ({ ...prev, preferredTime: event.currentTarget.value }))}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <MultiSelect
                  label="Special Requirements"
                  placeholder="Select requirements"
                  data={['Forklift', 'Loading Dock', 'Crane', 'Safety Equipment', 'Inside Delivery']}
                  value={schedulingData.specialRequirements}
                  onChange={(value) => setSchedulingData(prev => ({ ...prev, specialRequirements: value }))}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Special Instructions"
                  placeholder="Any additional delivery instructions..."
                  value={schedulingData.specialInstructions}
                  onChange={(e) => setSchedulingData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  rows={3}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end">
              <Button variant="outline" onClick={closeScheduleModal}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmSchedule}
                disabled={!schedulingData.contactName || !schedulingData.contactPhone || !schedulingData.deliveryAddress}
              >
                Confirm Schedule
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        opened={rescheduleModalOpened}
        onClose={closeRescheduleModal}
        title="Reschedule Delivery"
        size="md"
      >
        {selectedDelivery && (
          <Stack gap="lg">
            <Alert
              icon={<IconAlertTriangle size={16} />}
              color="orange"
              variant="light"
            >
              Rescheduling delivery for order {selectedDelivery.orderId}. 
              Current schedule: {new Date(selectedDelivery.scheduledDate).toLocaleDateString()} at {selectedDelivery.scheduledTime}
            </Alert>

            <Text c="dimmed">
              Please contact customer service to reschedule this delivery. 
              Rescheduling may be subject to availability and additional fees.
            </Text>

            <Group justify="flex-end">
              <Button variant="outline" onClick={closeRescheduleModal}>
                Cancel
              </Button>
              <Button color="orange">
                Contact Customer Service
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
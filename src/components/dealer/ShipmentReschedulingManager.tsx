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
  Modal,
  Select,
  Textarea,
  Alert,
  Timeline,
  Paper,
  Divider,
  ActionIcon,
  Tooltip,
  Stepper,
  Radio,
  Checkbox,
  NumberInput
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCalendar,
  IconClock,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconRefresh,
  IconPhone,
  IconMail,
  IconInfoCircle,
  IconTruck,
  IconUser,
  IconBuilding
} from '@tabler/icons-react';

interface RescheduleRequest {
  id: string;
  orderNumber: string;
  currentSchedule: {
    date: Date;
    window: string;
    status: string;
  };
  requestedSchedule: {
    date: Date;
    window: string;
    reason: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  submittedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  estimatedWeight: number;
  requiresApproval: boolean;
  additionalCost: number;
}

interface AvailabilitySlot {
  date: Date;
  window: string;
  available: boolean;
  cost: number;
  reason?: string;
}

interface ReschedulingWorkflow {
  step: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

const deliveryWindows = [
  { value: 'morning', label: 'Morning (8:00 AM - 12:00 PM)', cost: 0 },
  { value: 'afternoon', label: 'Afternoon (12:00 PM - 5:00 PM)', cost: 0 },
  { value: 'evening', label: 'Evening (5:00 PM - 8:00 PM)', cost: 25 },
  { value: 'early', label: 'Early Morning (6:00 AM - 8:00 AM)', cost: 35 },
  { value: 'saturday', label: 'Saturday Delivery', cost: 50 },
];

const rescheduleReasons = [
  { value: 'customer_request', label: 'Customer requested different time' },
  { value: 'weather', label: 'Weather conditions' },
  { value: 'access_issues', label: 'Site access issues' },
  { value: 'equipment_delay', label: 'Equipment not ready' },
  { value: 'staff_unavailable', label: 'Staff not available' },
  { value: 'other', label: 'Other reason' },
];

export function ShipmentReschedulingManager() {
  const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [rescheduleModalOpened, { open: openRescheduleModal, close: closeRescheduleModal }] = useDisclosure(false);
  const [availabilityModalOpened, { open: openAvailabilityModal, close: closeAvailabilityModal }] = useDisclosure(false);
  
  // Form states
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newWindow, setNewWindow] = useState<string>('');
  const [rescheduleReason, setRescheduleReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [urgentRequest, setUrgentRequest] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Workflow steps
  const workflowSteps: ReschedulingWorkflow[] = [
    {
      step: 0,
      title: 'Select Order',
      description: 'Choose the order to reschedule',
      completed: false,
      active: true
    },
    {
      step: 1,
      title: 'Check Availability',
      description: 'Verify new delivery slot availability',
      completed: false,
      active: false
    },
    {
      step: 2,
      title: 'Provide Reason',
      description: 'Explain the reason for rescheduling',
      completed: false,
      active: false
    },
    {
      step: 3,
      title: 'Review & Submit',
      description: 'Review details and submit request',
      completed: false,
      active: false
    }
  ];

  useEffect(() => {
    loadRescheduleRequests();
    loadAvailabilitySlots();
  }, []);

  const loadRescheduleRequests = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockRequests: RescheduleRequest[] = [
      {
        id: 'req-1',
        orderNumber: 'ORD-2024-001',
        currentSchedule: {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          window: 'Morning (8:00 AM - 12:00 PM)',
          status: 'scheduled'
        },
        requestedSchedule: {
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          window: 'Afternoon (12:00 PM - 5:00 PM)',
          reason: 'Customer requested different time'
        },
        status: 'pending',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        estimatedWeight: 175,
        requiresApproval: true,
        additionalCost: 0
      },
      {
        id: 'req-2',
        orderNumber: 'ORD-2024-002',
        currentSchedule: {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          window: 'Afternoon (12:00 PM - 5:00 PM)',
          status: 'confirmed'
        },
        requestedSchedule: {
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          window: 'Saturday Delivery',
          reason: 'Weather conditions'
        },
        status: 'approved',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        approvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        estimatedWeight: 45,
        requiresApproval: false,
        additionalCost: 50
      }
    ];
    
    setRescheduleRequests(mockRequests);
    setLoading(false);
  };

  const loadAvailabilitySlots = async () => {
    // Simulate checking availability for next 14 days
    const slots: AvailabilitySlot[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      
      deliveryWindows.forEach(window => {
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const available = window.value !== 'saturday' || isWeekend;
        
        slots.push({
          date,
          window: window.label,
          available: available && Math.random() > 0.3, // Simulate some unavailable slots
          cost: window.cost,
          reason: !available ? 'No weekend delivery for this window' : undefined
        });
      });
    }
    
    setAvailabilitySlots(slots);
  };

  const handleCheckAvailability = async () => {
    if (!newDate || !newWindow) {
      notifications.show({
        title: 'Error',
        message: 'Please select both date and time window',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const slot = availabilitySlots.find(s => 
      s.date.toDateString() === newDate.toDateString() && 
      s.window === deliveryWindows.find(w => w.value === newWindow)?.label
    );

    if (slot?.available) {
      notifications.show({
        title: 'Available',
        message: `Delivery slot is available${slot.cost > 0 ? ` (Additional cost: $${slot.cost})` : ''}`,
        color: 'green',
        icon: <IconCheck size={16} />
      });
      setCurrentStep(2);
    } else {
      notifications.show({
        title: 'Not Available',
        message: slot?.reason || 'This delivery slot is not available',
        color: 'red',
        icon: <IconX size={16} />
      });
    }
    
    setLoading(false);
  };

  const handleSubmitReschedule = async () => {
    if (!rescheduleReason || (rescheduleReason === 'other' && !customReason)) {
      notifications.show({
        title: 'Error',
        message: 'Please provide a reason for rescheduling',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newRequest: RescheduleRequest = {
      id: `req-${Date.now()}`,
      orderNumber: selectedOrder,
      currentSchedule: {
        date: new Date(),
        window: 'Morning (8:00 AM - 12:00 PM)',
        status: 'scheduled'
      },
      requestedSchedule: {
        date: newDate!,
        window: deliveryWindows.find(w => w.value === newWindow)?.label || '',
        reason: rescheduleReason === 'other' ? customReason : rescheduleReasons.find(r => r.value === rescheduleReason)?.label || ''
      },
      status: urgentRequest ? 'processing' : 'pending',
      submittedAt: new Date(),
      estimatedWeight: 100,
      requiresApproval: urgentRequest,
      additionalCost: deliveryWindows.find(w => w.value === newWindow)?.cost || 0
    };

    setRescheduleRequests(prev => [newRequest, ...prev]);

    notifications.show({
      title: 'Success',
      message: `Reschedule request submitted${urgentRequest ? ' for urgent processing' : ''}`,
      color: 'green',
      icon: <IconCheck size={16} />
    });

    // Reset form
    setSelectedOrder('');
    setNewDate(null);
    setNewWindow('');
    setRescheduleReason('');
    setCustomReason('');
    setNotifyCustomer(true);
    setUrgentRequest(false);
    setCurrentStep(0);
    setLoading(false);
    closeRescheduleModal();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'yellow';
      case 'processing': return 'blue';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <IconCheck size={16} />;
      case 'pending': return <IconClock size={16} />;
      case 'processing': return <IconRefresh size={16} />;
      case 'rejected': return <IconX size={16} />;
      default: return <IconInfoCircle size={16} />;
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={3}>Shipment Rescheduling</Title>
          <Text c="dimmed">Manage delivery reschedule requests and approvals</Text>
        </div>
        <Group>
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={openRescheduleModal}
          >
            Request Reschedule
          </Button>
          <Button
            variant="light"
            leftSection={<IconCalendar size={16} />}
            onClick={openAvailabilityModal}
          >
            Check Availability
          </Button>
        </Group>
      </Group>

      {/* Active Reschedule Requests */}
      <Card withBorder>
        <Title order={4} mb="md">Recent Reschedule Requests</Title>
        <Stack gap="md">
          {rescheduleRequests.map((request) => (
            <Paper key={request.id} p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Group>
                  <Text fw={500}>{request.orderNumber}</Text>
                  <Badge 
                    color={getStatusColor(request.status)} 
                    variant="light"
                    leftSection={getStatusIcon(request.status)}
                  >
                    {request.status}
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed">
                  Submitted {request.submittedAt.toLocaleDateString()}
                </Text>
              </Group>

              <Group grow>
                <div>
                  <Text size="sm" fw={500} mb="xs">Current Schedule</Text>
                  <Text size="sm">{request.currentSchedule.date.toLocaleDateString()}</Text>
                  <Text size="sm" c="dimmed">{request.currentSchedule.window}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500} mb="xs">Requested Schedule</Text>
                  <Text size="sm">{request.requestedSchedule.date.toLocaleDateString()}</Text>
                  <Text size="sm" c="dimmed">{request.requestedSchedule.window}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500} mb="xs">Reason</Text>
                  <Text size="sm">{request.requestedSchedule.reason}</Text>
                  {request.additionalCost > 0 && (
                    <Text size="sm" c="orange">Additional cost: ${request.additionalCost}</Text>
                  )}
                </div>
              </Group>

              {request.status === 'rejected' && request.rejectionReason && (
                <Alert icon={<IconAlertTriangle size={16} />} color="red" mt="md">
                  <Text size="sm" fw={500}>Rejection Reason:</Text>
                  <Text size="sm">{request.rejectionReason}</Text>
                </Alert>
              )}

              {request.status === 'approved' && (
                <Alert icon={<IconCheck size={16} />} color="green" mt="md">
                  <Text size="sm">
                    Reschedule approved{request.approvedAt && ` on ${request.approvedAt.toLocaleDateString()}`}
                  </Text>
                </Alert>
              )}
            </Paper>
          ))}

          {rescheduleRequests.length === 0 && (
            <Text ta="center" c="dimmed" py="xl">
              No reschedule requests found
            </Text>
          )}
        </Stack>
      </Card>

      {/* Reschedule Request Modal */}
      <Modal
        opened={rescheduleModalOpened}
        onClose={closeRescheduleModal}
        title="Request Shipment Reschedule"
        size="lg"
      >
        <Stack gap="md">
          <Stepper active={currentStep} size="sm" mb="md">
            <Stepper.Step label="Select Order" description="Choose order to reschedule" />
            <Stepper.Step label="Check Availability" description="Verify new slot" />
            <Stepper.Step label="Provide Reason" description="Explain reschedule" />
            <Stepper.Step label="Submit" description="Review and submit" />
          </Stepper>

          {currentStep === 0 && (
            <Stack gap="md">
              <Select
                label="Order Number"
                placeholder="Select order to reschedule"
                data={[
                  { value: 'ORD-2024-001', label: 'ORD-2024-001 - Heat Pump Installation' },
                  { value: 'ORD-2024-002', label: 'ORD-2024-002 - Thermostat Replacement' },
                  { value: 'ORD-2024-003', label: 'ORD-2024-003 - HVAC Maintenance Kit' },
                ]}
                value={selectedOrder}
                onChange={(value) => setSelectedOrder(value || '')}
                required
              />
              <Button 
                onClick={() => setCurrentStep(1)} 
                disabled={!selectedOrder}
                fullWidth
              >
                Next: Check Availability
              </Button>
            </Stack>
          )}

          {currentStep === 1 && (
            <Stack gap="md">
              <div>
                <Text size="sm" fw={500} mb={5}>New Delivery Date *</Text>
                <DatePicker
                  value={newDate}
                  onChange={(value) => setNewDate(value ? new Date(value) : null)}
                  minDate={new Date()}
                />
              </div>
              
              <Select
                label="Delivery Window"
                placeholder="Select delivery window"
                data={deliveryWindows.map(window => ({
                  value: window.value,
                  label: `${window.label}${window.cost > 0 ? ` (+$${window.cost})` : ''}`
                }))}
                value={newWindow}
                onChange={(value) => setNewWindow(value || '')}
                required
              />

              <Group grow>
                <Button variant="light" onClick={() => setCurrentStep(0)}>
                  Back
                </Button>
                <Button onClick={handleCheckAvailability} loading={loading}>
                  Check Availability
                </Button>
              </Group>
            </Stack>
          )}

          {currentStep === 2 && (
            <Stack gap="md">
              <Radio.Group
                label="Reason for Rescheduling"
                value={rescheduleReason}
                onChange={setRescheduleReason}
                required
              >
                <Stack gap="xs" mt="xs">
                  {rescheduleReasons.map((reason) => (
                    <Radio key={reason.value} value={reason.value} label={reason.label} />
                  ))}
                </Stack>
              </Radio.Group>

              {rescheduleReason === 'other' && (
                <Textarea
                  label="Custom Reason"
                  placeholder="Please explain the reason for rescheduling..."
                  value={customReason}
                  onChange={(event) => setCustomReason(event.currentTarget.value)}
                  required
                  rows={3}
                />
              )}

              <Checkbox
                label="Notify customer of schedule change"
                checked={notifyCustomer}
                onChange={(event) => setNotifyCustomer(event.currentTarget.checked)}
              />

              <Checkbox
                label="Mark as urgent request"
                description="Urgent requests are processed faster but may incur additional fees"
                checked={urgentRequest}
                onChange={(event) => setUrgentRequest(event.currentTarget.checked)}
              />

              <Group grow>
                <Button variant="light" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Next: Review
                </Button>
              </Group>
            </Stack>
          )}

          {currentStep === 3 && (
            <Stack gap="md">
              <Alert icon={<IconInfoCircle size={16} />} color="blue">
                Please review your reschedule request before submitting
              </Alert>

              <Paper p="md" withBorder>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text fw={500}>Order:</Text>
                    <Text>{selectedOrder}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fw={500}>New Date:</Text>
                    <Text>{newDate?.toLocaleDateString()}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fw={500}>New Window:</Text>
                    <Text>{deliveryWindows.find(w => w.value === newWindow)?.label}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fw={500}>Reason:</Text>
                    <Text>{rescheduleReason === 'other' ? customReason : rescheduleReasons.find(r => r.value === rescheduleReason)?.label}</Text>
                  </Group>
                  {deliveryWindows.find(w => w.value === newWindow)?.cost! > 0 && (
                    <Group justify="space-between">
                      <Text fw={500}>Additional Cost:</Text>
                      <Text c="orange">${deliveryWindows.find(w => w.value === newWindow)?.cost}</Text>
                    </Group>
                  )}
                </Stack>
              </Paper>

              <Group grow>
                <Button variant="light" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button onClick={handleSubmitReschedule} loading={loading}>
                  Submit Request
                </Button>
              </Group>
            </Stack>
          )}
        </Stack>
      </Modal>

      {/* Availability Check Modal */}
      <Modal
        opened={availabilityModalOpened}
        onClose={closeAvailabilityModal}
        title="Check Delivery Availability"
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Check available delivery slots for the next 14 days
          </Text>
          
          <Stack gap="xs">
            {Array.from({ length: 14 }, (_, i) => {
              const date = new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000);
              const daySlots = availabilitySlots.filter(slot => 
                slot.date.toDateString() === date.toDateString()
              );
              
              return (
                <Paper key={i} p="sm" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text fw={500}>{date.toLocaleDateString()}</Text>
                    <Text size="sm" c="dimmed">
                      {date.toLocaleDateString('en-US', { weekday: 'long' })}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    {daySlots.map((slot, index) => (
                      <Badge
                        key={index}
                        color={slot.available ? 'green' : 'red'}
                        variant="light"
                        size="sm"
                      >
                        {slot.window.split(' ')[0]} {slot.available ? '✓' : '✗'}
                      </Badge>
                    ))}
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
}
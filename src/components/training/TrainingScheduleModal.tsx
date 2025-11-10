'use client';

import { useState, useMemo } from 'react';
import {
  Modal,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Textarea,
  Stack,
  Text,
  Card,
  Badge,
  Grid,
  NumberInput,
  MultiSelect,
  Alert,
  Divider,
  Avatar,
  Checkbox,
} from '@mantine/core';
import {
  IconCalendar,
  IconClock,
  IconUsers,
  IconSchool,
  IconAlertTriangle,
  IconUser,
  IconCheck,
} from '@tabler/icons-react';
import { DateTimePicker } from '@mantine/dates';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface TrainingScheduleModalProps {
  opened: boolean;
  onClose: () => void;
  customerId?: string | null;
}

export function TrainingScheduleModal({ opened, onClose, customerId }: TrainingScheduleModalProps) {
  const { customers, users, trainingSessions } = useMockData();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(customerId || null);
  const [trainingType, setTrainingType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState<string | Date | null>(null);
  const [duration, setDuration] = useState<number>(120);
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<string[]>([]);
  const [requiresCertification, setRequiresCertification] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  // Get customer data
  const customer = useMemo(() => {
    return selectedCustomer ? customers.find(c => c.id === selectedCustomer) : null;
  }, [customers, selectedCustomer]);

  // Get available trainers (territory managers and other qualified users)
  const availableTrainers = useMemo(() => {
    return users.filter(user => 
      user.role === 'territory_manager' || user.role === 'admin'
    ).map(user => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
      role: user.role,
    }));
  }, [users]);

  // Get customer training history for recommendations
  const customerTrainingHistory = useMemo(() => {
    if (!selectedCustomer) return [];
    return trainingSessions.filter(s => s.customerId === selectedCustomer);
  }, [trainingSessions, selectedCustomer]);

  // Training type options with descriptions
  const trainingTypes = [
    {
      value: 'installation',
      label: 'Installation Training',
      description: 'Hands-on training for proper equipment installation',
      duration: 240,
      requiresCert: true,
    },
    {
      value: 'maintenance',
      label: 'Maintenance Training',
      description: 'Preventive maintenance and troubleshooting',
      duration: 180,
      requiresCert: true,
    },
    {
      value: 'sales',
      label: 'Sales Training',
      description: 'Product knowledge and sales techniques',
      duration: 120,
      requiresCert: false,
    },
    {
      value: 'product_knowledge',
      label: 'Product Knowledge',
      description: 'Latest product features and specifications',
      duration: 90,
      requiresCert: false,
    },
  ];

  // Get training recommendations based on customer profile
  const getTrainingRecommendations = () => {
    if (!customer) return [];

    const completedTypes = new Set(
      customerTrainingHistory
        .filter(s => s.status === 'completed')
        .map(s => s.type)
    );

    const recommendations = [];

    // Check for missing required training
    const requiredTypes: ('installation' | 'maintenance')[] = ['installation', 'maintenance'];
    requiredTypes.forEach(type => {
      if (!completedTypes.has(type)) {
        recommendations.push({
          type,
          reason: 'Required training not completed',
          priority: 'high',
        });
      }
    });

    // Check for refresher training (over 1 year old)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    customerTrainingHistory
      .filter(s => s.status === 'completed' && s.completedDate && s.completedDate < oneYearAgo)
      .forEach(s => {
        recommendations.push({
          type: s.type,
          reason: 'Refresher training due (over 1 year)',
          priority: 'medium',
        });
      });

    // Check for new product training based on recent orders
    if (customer.totalOrders > 0) {
      recommendations.push({
        type: 'product_knowledge',
        reason: 'Recent orders indicate need for product updates',
        priority: 'low',
      });
    }

    return recommendations;
  };

  const recommendations = getTrainingRecommendations();

  // Handle training type selection
  const handleTrainingTypeChange = (value: string | null) => {
    setTrainingType(value);
    const selectedType = trainingTypes.find(t => t.value === value);
    if (selectedType) {
      setTitle(selectedType.label);
      setDuration(selectedType.duration);
      setRequiresCertification(selectedType.requiresCert);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // In a real application, this would make an API call
    console.log('Scheduling training:', {
      customerId: selectedCustomer,
      trainingType,
      title,
      description,
      scheduledDate,
      duration,
      trainerId,
      attendees,
      requiresCertification,
      isUrgent,
    });

    // Reset form and close modal
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedCustomer(customerId || null);
    setTrainingType(null);
    setTitle('');
    setDescription('');
    setScheduledDate(null);
    setDuration(120);
    setTrainerId(null);
    setAttendees([]);
    setRequiresCertification(false);
    setIsUrgent(false);
  };

  const isFormValid = selectedCustomer && trainingType && title && scheduledDate && trainerId;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconCalendar size={20} />
          <Title order={3}>Schedule Training Session</Title>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Customer Selection */}
        {!customerId && (
          <Select
            label="Customer"
            placeholder="Select customer"
            data={customers.map(c => ({
              value: c.id,
              label: `${c.companyName} - ${c.contactName}`,
            }))}
            value={selectedCustomer}
            onChange={setSelectedCustomer}
            searchable
            required
          />
        )}

        {/* Customer Info Card */}
        {customer && (
          <Card withBorder p="md">
            <Group gap="sm">
              <Avatar size={40} radius="xl" color="blue">
                {customer.companyName.charAt(0)}
              </Avatar>
              <div style={{ flex: 1 }}>
                <Text fw={500}>{customer.companyName}</Text>
                <Text size="sm" c="dimmed">{customer.contactName}</Text>
                <Group gap="md" mt="xs">
                  <Text size="xs" c="dimmed">
                    Territory: {customer.territoryManagerId}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Status: {customer.status}
                  </Text>
                </Group>
              </div>
            </Group>
          </Card>
        )}

        {/* Training Recommendations */}
        {recommendations.length > 0 && (
          <Alert
            icon={<IconAlertTriangle size={16} />}
            title="Training Recommendations"
            color="blue"
          >
            <Stack gap="xs">
              {recommendations.slice(0, 3).map((rec, index) => (
                <Group key={index} gap="xs">
                  <Badge 
                    color={rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'orange' : 'blue'}
                    variant="light"
                    size="sm"
                  >
                    {rec.priority}
                  </Badge>
                  <Text size="sm">
                    <strong>{trainingTypes.find(t => t.value === rec.type)?.label}:</strong> {rec.reason}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Alert>
        )}

        <Divider />

        {/* Training Details */}
        <Grid>
          <Grid.Col span={6}>
            <Select
              label="Training Type"
              placeholder="Select training type"
              data={trainingTypes.map(t => ({
                value: t.value,
                label: t.label,
                description: t.description,
              }))}
              value={trainingType}
              onChange={handleTrainingTypeChange}
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Training Title"
              placeholder="Enter training title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
            />
          </Grid.Col>
        </Grid>

        <Textarea
          label="Description"
          placeholder="Enter training description and objectives"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          minRows={3}
        />

        <Grid>
          <Grid.Col span={8}>
            <DateTimePicker
              label="Scheduled Date & Time"
              placeholder="Select date and time"
              value={scheduledDate}
              onChange={setScheduledDate}
              minDate={new Date()}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="Duration (minutes)"
              placeholder="120"
              value={duration}
              onChange={(value) => setDuration(Number(value) || 120)}
              min={30}
              max={480}
              step={30}
            />
          </Grid.Col>
        </Grid>

        <Select
          label="Trainer"
          placeholder="Select trainer"
          data={availableTrainers}
          value={trainerId}
          onChange={setTrainerId}
          required
          renderOption={({ option }) => {
            const trainer = availableTrainers.find(t => t.value === option.value);
            return (
              <Group gap="sm">
                <Avatar size={24} radius="xl" color="blue">
                  {option.label.charAt(0)}
                </Avatar>
                <div>
                  <Text size="sm">{option.label}</Text>
                  {trainer && <Text size="xs" c="dimmed">{trainer.role.replace('_', ' ')}</Text>}
                </div>
              </Group>
            );
          }}
        />

        <MultiSelect
          label="Additional Attendees"
          placeholder="Add attendee names (comma-separated)"
          data={attendees.map(a => ({ value: a, label: a }))}
          value={attendees}
          onChange={setAttendees}
          searchable
        />

        <Group gap="md">
          <Checkbox
            label="Certification Required"
            checked={requiresCertification}
            onChange={(e) => setRequiresCertification(e.currentTarget.checked)}
          />
          <Checkbox
            label="Mark as Urgent"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.currentTarget.checked)}
          />
        </Group>

        {/* Training Summary */}
        {trainingType && (
          <Card withBorder p="md" bg="gray.0">
            <Title order={5} mb="sm">Training Summary</Title>
            <Grid>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <IconSchool size={16} />
                  <Text size="sm">
                    {trainingTypes.find(t => t.value === trainingType)?.label}
                  </Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <IconClock size={16} />
                  <Text size="sm">
                    {Math.floor(duration / 60)}h {duration % 60}m
                  </Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <IconUsers size={16} />
                  <Text size="sm">
                    {attendees.length + 1} attendees
                  </Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <IconUser size={16} />
                  <Text size="sm">
                    {availableTrainers.find(t => t.value === trainerId)?.label || 'No trainer selected'}
                  </Text>
                </Group>
              </Grid.Col>
            </Grid>
          </Card>
        )}

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            leftSection={<IconCheck size={16} />}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Schedule Training
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
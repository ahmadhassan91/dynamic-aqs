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
  TextInput,
  Textarea,
  Select,
  Switch,
  Modal,
  Alert,
  Badge,
  ActionIcon,
  Tooltip,
  Table,
  Divider,
  NumberInput,
} from '@mantine/core';
import {
  IconMapPin,
  IconClock,
  IconTruck,
  IconEdit,
  IconTrash,
  IconPlus,
  IconCheck,
  IconAlertTriangle,
  IconPhone,
  IconMail,
  IconUser,
  IconCalendar,
  IconSettings,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

export interface DeliveryPreference {
  id: string;
  name: string;
  isDefault: boolean;
  
  // Address Information
  deliveryAddress: {
    name: string;
    company?: string;
    street: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  
  // Contact Information
  contactInfo: {
    name: string;
    phone: string;
    email?: string;
    alternatePhone?: string;
  };
  
  // Delivery Windows
  deliveryWindows: {
    monday?: { start: string; end: string; enabled: boolean };
    tuesday?: { start: string; end: string; enabled: boolean };
    wednesday?: { start: string; end: string; enabled: boolean };
    thursday?: { start: string; end: string; enabled: boolean };
    friday?: { start: string; end: string; enabled: boolean };
    saturday?: { start: string; end: string; enabled: boolean };
    sunday?: { start: string; end: string; enabled: boolean };
  };
  
  // Special Instructions
  specialInstructions?: string;
  accessInstructions?: string;
  equipmentRequirements?: string[];
  
  // Preferences
  signatureRequired: boolean;
  callBeforeDelivery: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  
  // Restrictions
  noDeliveryDates?: string[];
  minimumAdvanceNotice?: number; // hours
  
  createdAt: string;
  updatedAt: string;
}

// Mock delivery preferences data
const mockPreferences: DeliveryPreference[] = [
  {
    id: 'pref-001',
    name: 'Main Warehouse',
    isDefault: true,
    deliveryAddress: {
      name: 'Comfort Zone HVAC Services',
      company: 'Comfort Zone HVAC Services',
      street: '1234 Main Street',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      country: 'US',
    },
    contactInfo: {
      name: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john@comfortzonehvac.com',
      alternatePhone: '(555) 123-4568',
    },
    deliveryWindows: {
      monday: { start: '08:00', end: '17:00', enabled: true },
      tuesday: { start: '08:00', end: '17:00', enabled: true },
      wednesday: { start: '08:00', end: '17:00', enabled: true },
      thursday: { start: '08:00', end: '17:00', enabled: true },
      friday: { start: '08:00', end: '17:00', enabled: true },
      saturday: { start: '09:00', end: '12:00', enabled: true },
      sunday: { start: '09:00', end: '12:00', enabled: false },
    },
    specialInstructions: 'Loading dock access required. Call before delivery.',
    accessInstructions: 'Use rear entrance. Loading dock is on the east side of building.',
    equipmentRequirements: ['Forklift', 'Loading Dock'],
    signatureRequired: true,
    callBeforeDelivery: true,
    emailNotifications: true,
    smsNotifications: true,
    minimumAdvanceNotice: 24,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'pref-002',
    name: 'Job Site - Downtown Project',
    isDefault: false,
    deliveryAddress: {
      name: 'Downtown Office Complex',
      company: 'Metro Construction',
      street: '456 Business Ave',
      city: 'Springfield',
      state: 'IL',
      zip: '62702',
      country: 'US',
    },
    contactInfo: {
      name: 'Mike Johnson',
      phone: '(555) 987-6543',
      email: 'mike@metroconstruction.com',
    },
    deliveryWindows: {
      monday: { start: '07:00', end: '15:00', enabled: true },
      tuesday: { start: '07:00', end: '15:00', enabled: true },
      wednesday: { start: '07:00', end: '15:00', enabled: true },
      thursday: { start: '07:00', end: '15:00', enabled: true },
      friday: { start: '07:00', end: '15:00', enabled: true },
      saturday: { start: '07:00', end: '15:00', enabled: false },
      sunday: { start: '07:00', end: '15:00', enabled: false },
    },
    specialInstructions: 'Construction site delivery. Hard hat required.',
    accessInstructions: 'Enter through main gate. Check in with security.',
    equipmentRequirements: ['Crane', 'Safety Equipment'],
    signatureRequired: true,
    callBeforeDelivery: true,
    emailNotifications: true,
    smsNotifications: false,
    noDeliveryDates: ['2024-02-15', '2024-02-16'], // Holiday weekend
    minimumAdvanceNotice: 48,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
  },
];

const equipmentOptions = [
  'Forklift',
  'Loading Dock',
  'Crane',
  'Liftgate',
  'Safety Equipment',
  'Inside Delivery',
  'White Glove Service',
];

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

interface DeliveryPreferenceManagerProps {
  onPreferenceSelect?: (preference: DeliveryPreference) => void;
  selectedPreferenceId?: string;
}

export function DeliveryPreferenceManager({
  onPreferenceSelect,
  selectedPreferenceId,
}: DeliveryPreferenceManagerProps) {
  const [preferences, setPreferences] = useState<DeliveryPreference[]>(mockPreferences);
  const [selectedPreference, setSelectedPreference] = useState<DeliveryPreference | null>(null);
  const [editingPreference, setEditingPreference] = useState<Partial<DeliveryPreference> | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [deleteConfirmOpened, { open: openDeleteConfirm, close: closeDeleteConfirm }] = useDisclosure(false);
  const [preferenceToDelete, setPreferenceToDelete] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingPreference({
      name: '',
      isDefault: false,
      deliveryAddress: {
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
      },
      contactInfo: {
        name: '',
        phone: '',
      },
      deliveryWindows: {
        monday: { start: '08:00', end: '17:00', enabled: true },
        tuesday: { start: '08:00', end: '17:00', enabled: true },
        wednesday: { start: '08:00', end: '17:00', enabled: true },
        thursday: { start: '08:00', end: '17:00', enabled: true },
        friday: { start: '08:00', end: '17:00', enabled: true },
        saturday: { start: '09:00', end: '12:00', enabled: false },
        sunday: { start: '09:00', end: '12:00', enabled: false },
      },
      signatureRequired: true,
      callBeforeDelivery: true,
      emailNotifications: true,
      smsNotifications: false,
      equipmentRequirements: [],
    });
    openModal();
  };

  const handleEdit = (preference: DeliveryPreference) => {
    setEditingPreference({ ...preference });
    openModal();
  };

  const handleSave = () => {
    if (!editingPreference) return;

    const isNew = !editingPreference.id;
    const now = new Date().toISOString();
    
    const savedPreference: DeliveryPreference = {
      ...editingPreference,
      id: editingPreference.id || `pref-${Date.now()}`,
      createdAt: editingPreference.createdAt || now,
      updatedAt: now,
    } as DeliveryPreference;

    if (isNew) {
      setPreferences(prev => [...prev, savedPreference]);
      notifications.show({
        title: 'Preference Created',
        message: `Delivery preference "${savedPreference.name}" has been created`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } else {
      setPreferences(prev => prev.map(p => p.id === savedPreference.id ? savedPreference : p));
      notifications.show({
        title: 'Preference Updated',
        message: `Delivery preference "${savedPreference.name}" has been updated`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    }

    closeModal();
    setEditingPreference(null);
  };

  const handleDelete = (preferenceId: string) => {
    setPreferenceToDelete(preferenceId);
    openDeleteConfirm();
  };

  const confirmDelete = () => {
    if (!preferenceToDelete) return;

    const preference = preferences.find(p => p.id === preferenceToDelete);
    setPreferences(prev => prev.filter(p => p.id !== preferenceToDelete));
    
    notifications.show({
      title: 'Preference Deleted',
      message: `Delivery preference "${preference?.name}" has been deleted`,
      color: 'red',
      icon: <IconTrash size={16} />,
    });

    closeDeleteConfirm();
    setPreferenceToDelete(null);
  };

  const handleSetDefault = (preferenceId: string) => {
    setPreferences(prev => prev.map(p => ({
      ...p,
      isDefault: p.id === preferenceId,
    })));

    const preference = preferences.find(p => p.id === preferenceId);
    notifications.show({
      title: 'Default Updated',
      message: `"${preference?.name}" is now the default delivery preference`,
      color: 'blue',
      icon: <IconCheck size={16} />,
    });
  };

  const formatDeliveryWindows = (windows: DeliveryPreference['deliveryWindows']) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const enabledDays = days.filter(day => windows[day as keyof typeof windows]?.enabled);
    
    if (enabledDays.length === 0) return 'No delivery windows set';
    if (enabledDays.length === 7) return 'All days';
    if (enabledDays.length === 5 && !enabledDays.includes('saturday') && !enabledDays.includes('sunday')) {
      return 'Weekdays only';
    }
    
    return enabledDays.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', ');
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={2}>Delivery Preferences</Title>
            <Text c="dimmed">
              Manage your delivery addresses, schedules, and special requirements
            </Text>
          </div>
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreateNew}>
            Add New Preference
          </Button>
        </Group>

        {/* Preferences Grid */}
        <Grid>
          {preferences.map((preference) => (
            <Grid.Col key={preference.id} span={{ base: 12, md: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <Stack gap="md" h="100%">
                  {/* Header */}
                  <Group justify="space-between" align="flex-start">
                    <div style={{ flex: 1 }}>
                      <Group gap="xs" mb="xs">
                        <Text fw={600} size="lg" lineClamp={1}>
                          {preference.name}
                        </Text>
                        {preference.isDefault && (
                          <Badge color="blue" size="sm">
                            Default
                          </Badge>
                        )}
                      </Group>
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {preference.deliveryAddress.company || preference.deliveryAddress.name}
                      </Text>
                    </div>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        onClick={() => handleEdit(preference)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      {!preference.isDefault && (
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(preference.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  </Group>

                  {/* Address */}
                  <div>
                    <Group gap="xs" mb="xs">
                      <IconMapPin size={16} />
                      <Text size="sm" fw={500}>Address</Text>
                    </Group>
                    <Text size="sm" c="dimmed" lineClamp={3}>
                      {preference.deliveryAddress.street}<br />
                      {preference.deliveryAddress.city}, {preference.deliveryAddress.state} {preference.deliveryAddress.zip}
                    </Text>
                  </div>

                  {/* Contact */}
                  <div>
                    <Group gap="xs" mb="xs">
                      <IconUser size={16} />
                      <Text size="sm" fw={500}>Contact</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {preference.contactInfo.name}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {preference.contactInfo.phone}
                    </Text>
                  </div>

                  {/* Delivery Windows */}
                  <div>
                    <Group gap="xs" mb="xs">
                      <IconClock size={16} />
                      <Text size="sm" fw={500}>Delivery Windows</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {formatDeliveryWindows(preference.deliveryWindows)}
                    </Text>
                  </div>

                  {/* Equipment Requirements */}
                  {preference.equipmentRequirements && preference.equipmentRequirements.length > 0 && (
                    <div>
                      <Group gap="xs" mb="xs">
                        <IconTruck size={16} />
                        <Text size="sm" fw={500}>Equipment</Text>
                      </Group>
                      <Group gap="xs">
                        {preference.equipmentRequirements.slice(0, 2).map((equipment) => (
                          <Badge key={equipment} size="xs" variant="light">
                            {equipment}
                          </Badge>
                        ))}
                        {preference.equipmentRequirements.length > 2 && (
                          <Badge size="xs" variant="light" color="gray">
                            +{preference.equipmentRequirements.length - 2} more
                          </Badge>
                        )}
                      </Group>
                    </div>
                  )}

                  {/* Actions */}
                  <Group justify="space-between" mt="auto">
                    {!preference.isDefault && (
                      <Button
                        variant="light"
                        size="xs"
                        onClick={() => handleSetDefault(preference.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onPreferenceSelect?.(preference)}
                      ml="auto"
                    >
                      Select
                    </Button>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {preferences.length === 0 && (
          <Paper p="xl" withBorder>
            <Stack align="center" gap="md">
              <IconMapPin size={48} color="var(--mantine-color-gray-5)" />
              <Text size="lg" fw={600}>No Delivery Preferences</Text>
              <Text c="dimmed" ta="center">
                Create your first delivery preference to streamline your order deliveries.
              </Text>
              <Button leftSection={<IconPlus size={16} />} onClick={handleCreateNew}>
                Add Delivery Preference
              </Button>
            </Stack>
          </Paper>
        )}
      </Stack>

      {/* Edit/Create Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={editingPreference?.id ? 'Edit Delivery Preference' : 'Create Delivery Preference'}
        size="xl"
      >
        {editingPreference && (
          <Stack gap="lg">
            {/* Basic Information */}
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Basic Information</Title>
              <Grid>
                <Grid.Col span={8}>
                  <TextInput
                    label="Preference Name"
                    placeholder="e.g., Main Warehouse, Job Site Alpha"
                    value={editingPreference.name || ''}
                    onChange={(e) => setEditingPreference(prev => prev ? { ...prev, name: e.target.value } : null)}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Switch
                    label="Set as Default"
                    checked={editingPreference.isDefault || false}
                    onChange={(e) => setEditingPreference(prev => prev ? { ...prev, isDefault: e.target.checked } : null)}
                    mt="xl"
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Address Information */}
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Delivery Address</Title>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Contact Name"
                    value={editingPreference.deliveryAddress?.name || ''}
                    onChange={(e) => setEditingPreference(prev => prev ? {
                      ...prev,
                      deliveryAddress: { ...prev.deliveryAddress!, name: e.target.value }
                    } : null)}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Company (Optional)"
                    value={editingPreference.deliveryAddress?.company || ''}
                    onChange={(e) => setEditingPreference(prev => prev ? {
                      ...prev,
                      deliveryAddress: { ...prev.deliveryAddress!, company: e.target.value }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Street Address"
                    value={editingPreference.deliveryAddress?.street || ''}
                    onChange={(e) => setEditingPreference(prev => prev ? {
                      ...prev,
                      deliveryAddress: { ...prev.deliveryAddress!, street: e.target.value }
                    } : null)}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="City"
                    value={editingPreference.deliveryAddress?.city || ''}
                    onChange={(e) => setEditingPreference(prev => prev ? {
                      ...prev,
                      deliveryAddress: { ...prev.deliveryAddress!, city: e.target.value }
                    } : null)}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="State"
                    value={editingPreference.deliveryAddress?.state || ''}
                    onChange={(e) => setEditingPreference(prev => prev ? {
                      ...prev,
                      deliveryAddress: { ...prev.deliveryAddress!, state: e.target.value }
                    } : null)}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="ZIP Code"
                    value={editingPreference.deliveryAddress?.zip || ''}
                    onChange={(e) => setEditingPreference(prev => prev ? {
                      ...prev,
                      deliveryAddress: { ...prev.deliveryAddress!, zip: e.target.value }
                    } : null)}
                    required
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Contact Information */}
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Contact Information</Title>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Contact Name"
                    value={editingPreference.contactInfo?.name || ''}
                    onChange={(e) => setEditingPreference(prev => prev ? {
                      ...prev,
                      contactInfo: { ...prev.contactInfo!, name: e.target.value }
                    } : null)}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Phone Number"
                    value={editingPreference.contactInfo?.phone || ''}
                    onChange={(e) => setEditingPreference(prev => prev ? {
                      ...prev,
                      contactInfo: { ...prev.contactInfo!, phone: e.target.value }
                    } : null)}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Email (Optional)"
                    type="email"
                    value={editingPreference.contactInfo?.email || ''}
                    onChange={(e) => setEditingPreference(prev => prev ? {
                      ...prev,
                      contactInfo: { ...prev.contactInfo!, email: e.target.value }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Alternate Phone (Optional)"
                    value={editingPreference.contactInfo?.alternatePhone || ''}
                    onChange={(e) => setEditingPreference(prev => prev ? {
                      ...prev,
                      contactInfo: { ...prev.contactInfo!, alternatePhone: e.target.value }
                    } : null)}
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Special Instructions */}
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Special Instructions</Title>
              <Stack gap="md">
                <Textarea
                  label="Delivery Instructions"
                  placeholder="Any special instructions for delivery..."
                  value={editingPreference.specialInstructions || ''}
                  onChange={(e) => setEditingPreference(prev => prev ? { ...prev, specialInstructions: e.target.value } : null)}
                  rows={3}
                />
                <Textarea
                  label="Access Instructions"
                  placeholder="How to access the delivery location..."
                  value={editingPreference.accessInstructions || ''}
                  onChange={(e) => setEditingPreference(prev => prev ? { ...prev, accessInstructions: e.target.value } : null)}
                  rows={2}
                />
              </Stack>
            </Paper>

            {/* Preferences */}
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Delivery Preferences</Title>
              <Grid>
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Switch
                      label="Signature Required"
                      checked={editingPreference.signatureRequired || false}
                      onChange={(e) => setEditingPreference(prev => prev ? { ...prev, signatureRequired: e.target.checked } : null)}
                    />
                    <Switch
                      label="Call Before Delivery"
                      checked={editingPreference.callBeforeDelivery || false}
                      onChange={(e) => setEditingPreference(prev => prev ? { ...prev, callBeforeDelivery: e.target.checked } : null)}
                    />
                  </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Switch
                      label="Email Notifications"
                      checked={editingPreference.emailNotifications || false}
                      onChange={(e) => setEditingPreference(prev => prev ? { ...prev, emailNotifications: e.target.checked } : null)}
                    />
                    <Switch
                      label="SMS Notifications"
                      checked={editingPreference.smsNotifications || false}
                      onChange={(e) => setEditingPreference(prev => prev ? { ...prev, smsNotifications: e.target.checked } : null)}
                    />
                  </Stack>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Actions */}
            <Group justify="flex-end">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingPreference.id ? 'Update' : 'Create'} Preference
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteConfirmOpened}
        onClose={closeDeleteConfirm}
        title="Delete Delivery Preference"
        size="sm"
      >
        <Stack gap="md">
          <Alert
            icon={<IconAlertTriangle size={16} />}
            color="red"
            variant="light"
          >
            Are you sure you want to delete this delivery preference? This action cannot be undone.
          </Alert>
          <Group justify="flex-end">
            <Button variant="outline" onClick={closeDeleteConfirm}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
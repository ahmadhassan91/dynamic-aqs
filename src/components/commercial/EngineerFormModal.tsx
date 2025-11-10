'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Select,
  Stack,
  Group,
  Button,
  Title,
  Text,
  Divider,
  MultiSelect,
  Textarea,
  Grid,
  Badge
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconUser, IconBuilding, IconMail, IconPhone, IconStar, IconCalendar } from '@tabler/icons-react';

interface EngineerFormData {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  engineeringFirmId: string;
  rating: number;
  marketSegments: string[];
  notes?: string;
  lastContactDate?: Date | string | null;
  nextFollowUpDate?: Date | string | null;
}

interface EngineerFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: EngineerFormData) => void;
  initialData?: Partial<EngineerFormData>;
  mode?: 'create' | 'edit';
}

const RATING_OPTIONS = [
  { value: '1', label: '1 - Hostile', color: 'red' },
  { value: '2', label: '2 - Unfavorable', color: 'orange' },
  { value: '3', label: '3 - Neutral', color: 'blue' },
  { value: '4', label: '4 - Favorable', color: 'green' },
  { value: '5', label: '5 - Champion', color: 'yellow' }
];

const MARKET_SEGMENT_OPTIONS = [
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Commercial Office', label: 'Commercial Office' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Hospitality', label: 'Hospitality' },
  { value: 'Data Center', label: 'Data Center' },
  { value: 'Cannabis', label: 'Cannabis' }
];

// Mock data - in production, fetch from API
const ENGINEERING_FIRMS = [
  { value: 'firm-1', label: 'MEP Engineering Solutions' },
  { value: 'firm-2', label: 'Urban Design Engineers' },
  { value: 'firm-3', label: 'Industrial Systems Inc' },
  { value: 'firm-4', label: 'Healthcare Engineering Group' },
  { value: 'firm-5', label: 'Educational Facilities Engineering' }
];

export function EngineerFormModal({
  opened,
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}: EngineerFormModalProps) {
  const [formData, setFormData] = useState<EngineerFormData>({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    engineeringFirmId: '',
    rating: 3,
    marketSegments: [],
    notes: '',
    lastContactDate: null,
    nextFollowUpDate: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EngineerFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        title: initialData.title || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        engineeringFirmId: initialData.engineeringFirmId || '',
        rating: initialData.rating || 3,
        marketSegments: initialData.marketSegments || [],
        notes: initialData.notes || '',
        lastContactDate: initialData.lastContactDate || null,
        nextFollowUpDate: initialData.nextFollowUpDate || null
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EngineerFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.engineeringFirmId) {
      newErrors.engineeringFirmId = 'Engineering firm is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: '',
      engineeringFirmId: '',
      rating: 3,
      marketSegments: [],
      notes: '',
      lastContactDate: null,
      nextFollowUpDate: null
    });
    setErrors({});
    onClose();
  };

  const getRatingColor = (rating: number) => {
    if (rating === 5) return 'yellow';
    if (rating === 4) return 'green';
    if (rating === 3) return 'blue';
    if (rating === 2) return 'orange';
    return 'red';
  };

  const getRatingLabel = (rating: number) => {
    if (rating === 5) return 'Champion';
    if (rating === 4) return 'Favorable';
    if (rating === 3) return 'Neutral';
    if (rating === 2) return 'Unfavorable';
    return 'Hostile';
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <IconUser size={24} />
          <Title order={3}>
            {mode === 'create' ? 'Add New Engineer Contact' : 'Edit Engineer Contact'}
          </Title>
        </Group>
      }
      size="lg"
      padding="xl"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {mode === 'create'
            ? 'Add a new engineering contact to your database'
            : 'Update engineer contact information'}
        </Text>

        <Divider label="Personal Information" labelPosition="left" />

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="First Name"
              placeholder="John"
              leftSection={<IconUser size={16} />}
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.currentTarget.value })}
              error={errors.firstName}
              required
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Last Name"
              placeholder="Smith"
              leftSection={<IconUser size={16} />}
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.currentTarget.value })}
              error={errors.lastName}
              required
              size="md"
            />
          </Grid.Col>
        </Grid>

        <TextInput
          label="Job Title"
          placeholder="Senior Mechanical Engineer"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.currentTarget.value })}
          error={errors.title}
          required
          size="md"
        />

        <Divider label="Contact Information" labelPosition="left" />

        <TextInput
          label="Email Address"
          placeholder="john.smith@company.com"
          leftSection={<IconMail size={16} />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.currentTarget.value })}
          error={errors.email}
          required
          size="md"
          type="email"
        />

        <TextInput
          label="Phone Number"
          placeholder="(555) 123-4567"
          leftSection={<IconPhone size={16} />}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.currentTarget.value })}
          error={errors.phone}
          required
          size="md"
        />

        <Select
          label="Engineering Firm"
          placeholder="Select engineering firm"
          leftSection={<IconBuilding size={16} />}
          data={ENGINEERING_FIRMS}
          value={formData.engineeringFirmId}
          onChange={(value) => setFormData({ ...formData, engineeringFirmId: value || '' })}
          error={errors.engineeringFirmId}
          searchable
          required
          size="md"
        />

        <Divider label="Relationship Details" labelPosition="left" />

        <div>
          <Group gap="xs" mb="xs">
            <Text size="sm" fw={500}>
              Engineer Rating
            </Text>
            <Text size="sm" c="dimmed">
              *
            </Text>
          </Group>
          <Select
            placeholder="Select rating"
            leftSection={<IconStar size={16} />}
            data={RATING_OPTIONS}
            value={formData.rating.toString()}
            onChange={(value) => setFormData({ ...formData, rating: parseInt(value || '3') })}
            size="md"
            renderOption={({ option }) => {
              const rating = parseInt(option.value);
              return (
                <Group gap="xs">
                  <Badge
                    variant="filled"
                    color={getRatingColor(rating)}
                    className={`badge-engineer-rating-${rating}`}
                  >
                    {option.label}
                  </Badge>
                </Group>
              );
            }}
          />
          {formData.rating > 0 && (
            <Group gap="xs" mt="xs">
              <Text size="xs" c="dimmed">
                Current Rating:
              </Text>
              <Badge
                variant="filled"
                color={getRatingColor(formData.rating)}
                className={`badge-engineer-rating-${formData.rating}`}
              >
                {formData.rating}/5 - {getRatingLabel(formData.rating)}
              </Badge>
            </Group>
          )}
        </div>

        <MultiSelect
          label="Market Segments"
          placeholder="Select market segments"
          data={MARKET_SEGMENT_OPTIONS}
          value={formData.marketSegments}
          onChange={(value) => setFormData({ ...formData, marketSegments: value })}
          size="md"
          searchable
          clearable
        />

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DateInput
              label="Last Contact Date"
              placeholder="Select date"
              leftSection={<IconCalendar size={16} />}
              value={formData.lastContactDate}
              onChange={(value) => setFormData({ ...formData, lastContactDate: value })}
              size="md"
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DateInput
              label="Next Follow-Up Date"
              placeholder="Select date"
              leftSection={<IconCalendar size={16} />}
              value={formData.nextFollowUpDate}
              onChange={(value) => setFormData({ ...formData, nextFollowUpDate: value })}
              size="md"
              clearable
            />
          </Grid.Col>
        </Grid>

        <Textarea
          label="Notes"
          placeholder="Add any additional notes about this contact..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.currentTarget.value })}
          minRows={3}
          size="md"
        />

        <Divider />

        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleClose} size="md" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} size="md" loading={isSubmitting}>
            {mode === 'create' ? 'Add Engineer' : 'Save Changes'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

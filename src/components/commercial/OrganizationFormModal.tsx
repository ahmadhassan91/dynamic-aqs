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
  Grid,
  Switch
} from '@mantine/core';
import {
  IconBuilding,
  IconMail,
  IconPhone,
  IconMapPin,
  IconWorld
} from '@tabler/icons-react';

interface OrganizationFormData {
  name: string;
  type: string;
  parentId?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  website?: string;
  territoryId?: string;
  isActive: boolean;
}

interface OrganizationFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: OrganizationFormData) => void;
  initialData?: Partial<OrganizationFormData>;
  mode?: 'create' | 'edit';
}

const ORGANIZATION_TYPES = [
  { value: 'Engineering Firm', label: 'Engineering Firm' },
  { value: 'Manufacturer Rep', label: 'Manufacturer Rep' },
  { value: 'Building Owner', label: 'Building Owner' },
  { value: 'Architect', label: 'Architect' },
  { value: 'Mechanical Contractor', label: 'Mechanical Contractor' },
  { value: 'Facilities Manager', label: 'Facilities Manager' }
];

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

// Mock data
const TERRITORIES = [
  { value: 'territory-1', label: 'North Texas' },
  { value: 'territory-2', label: 'South Texas' },
  { value: 'territory-3', label: 'Houston Metro' },
  { value: 'territory-4', label: 'Dallas Metro' }
];

const PARENT_ORGANIZATIONS = [
  { value: '', label: 'None (Root Organization)' },
  { value: 'org-1', label: 'MEP Engineering Solutions' },
  { value: 'org-2', label: 'Urban Design Engineers' }
];

export function OrganizationFormModal({
  opened,
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}: OrganizationFormModalProps) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    type: '',
    parentId: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    phone: '',
    email: '',
    website: '',
    territoryId: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || '',
        parentId: initialData.parentId || '',
        address: initialData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
        phone: initialData.phone || '',
        email: initialData.email || '',
        website: initialData.website || '',
        territoryId: initialData.territoryId || '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }
    if (!formData.type) {
      newErrors.type = 'Organization type is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street address is required';
    }
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }
    if (!formData.address.state) {
      newErrors['address.state'] = 'State is required';
    }
    if (!formData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = 'ZIP code is required';
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
      name: '',
      type: '',
      parentId: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      phone: '',
      email: '',
      website: '',
      territoryId: '',
      isActive: true
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <IconBuilding size={24} />
          <Title order={3}>
            {mode === 'create' ? 'Add New Organization' : 'Edit Organization'}
          </Title>
        </Group>
      }
      size="lg"
      padding="xl"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {mode === 'create'
            ? 'Add a new organization to your database'
            : 'Update organization information'}
        </Text>

        <Divider label="Basic Information" labelPosition="left" />

        <TextInput
          label="Organization Name"
          placeholder="MEP Engineering Solutions"
          leftSection={<IconBuilding size={16} />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
          error={errors.name}
          required
          size="md"
        />

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Organization Type"
              placeholder="Select type"
              data={ORGANIZATION_TYPES}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value || '' })}
              error={errors.type}
              searchable
              required
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Parent Organization"
              placeholder="Select parent (optional)"
              data={PARENT_ORGANIZATIONS}
              value={formData.parentId}
              onChange={(value) => setFormData({ ...formData, parentId: value || '' })}
              searchable
              clearable
              size="md"
            />
          </Grid.Col>
        </Grid>

        <Divider label="Contact Information" labelPosition="left" />

        <TextInput
          label="Email Address"
          placeholder="info@organization.com"
          leftSection={<IconMail size={16} />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.currentTarget.value })}
          error={errors.email}
          required
          size="md"
          type="email"
        />

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
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
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Website"
              placeholder="www.organization.com"
              leftSection={<IconWorld size={16} />}
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.currentTarget.value })}
              size="md"
            />
          </Grid.Col>
        </Grid>

        <Divider label="Address" labelPosition="left" />

        <TextInput
          label="Street Address"
          placeholder="123 Main Street, Suite 400"
          leftSection={<IconMapPin size={16} />}
          value={formData.address.street}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, street: e.currentTarget.value }
            })
          }
          error={errors['address.street']}
          required
          size="md"
        />

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="City"
              placeholder="Dallas"
              value={formData.address.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.currentTarget.value }
                })
              }
              error={errors['address.city']}
              required
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 3 }}>
            <Select
              label="State"
              placeholder="TX"
              data={US_STATES}
              value={formData.address.state}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, state: value || '' }
                })
              }
              error={errors['address.state']}
              searchable
              required
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 3 }}>
            <TextInput
              label="ZIP Code"
              placeholder="75201"
              value={formData.address.zipCode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, zipCode: e.currentTarget.value }
                })
              }
              error={errors['address.zipCode']}
              required
              size="md"
            />
          </Grid.Col>
        </Grid>

        <Divider label="Additional Settings" labelPosition="left" />

        <Select
          label="Territory"
          placeholder="Select territory (optional)"
          data={TERRITORIES}
          value={formData.territoryId}
          onChange={(value) => setFormData({ ...formData, territoryId: value || '' })}
          searchable
          clearable
          size="md"
        />

        <Switch
          label="Active Organization"
          description="Inactive organizations won't appear in search results"
          checked={formData.isActive}
          onChange={(event) => setFormData({ ...formData, isActive: event.currentTarget.checked })}
          size="md"
        />

        <Divider />

        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleClose} size="md" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} size="md" loading={isSubmitting}>
            {mode === 'create' ? 'Add Organization' : 'Save Changes'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

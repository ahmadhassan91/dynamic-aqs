'use client';

import { useState } from 'react';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Alert,
  Group,
  Select,
  Textarea,
  Checkbox,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle, IconBuilding, IconCheck } from '@tabler/icons-react';

interface DealerRegistrationFormProps {
  onSubmit?: (values: DealerRegistrationData) => void;
  loading?: boolean;
  error?: string;
  success?: boolean;
}

interface DealerRegistrationData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  businessType: string;
  yearsInBusiness: string;
  currentSuppliers: string;
  estimatedAnnualVolume: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const businessTypes = [
  'HVAC Contractor',
  'Plumbing Contractor',
  'Electrical Contractor',
  'General Contractor',
  'Distributor',
  'Other',
];

const volumeRanges = [
  'Under $100K',
  '$100K - $500K',
  '$500K - $1M',
  '$1M - $5M',
  'Over $5M',
];

export function DealerRegistrationForm({ onSubmit, loading = false, error, success }: DealerRegistrationFormProps) {
  const form = useForm({
    initialValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      businessType: '',
      yearsInBusiness: '',
      currentSuppliers: '',
      estimatedAnnualVolume: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    validate: {
      companyName: (value) => (value.length < 2 ? 'Company name is required' : null),
      contactName: (value) => (value.length < 2 ? 'Contact name is required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (value.length < 10 ? 'Valid phone number is required' : null),
      password: (value) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
      confirmPassword: (value, values) => 
        value !== values.password ? 'Passwords do not match' : null,
      agreeToTerms: (value) => (!value ? 'You must agree to the terms and conditions' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onSubmit?.(values);
  };

  if (success) {
    return (
      <Paper radius="md" p="xl" withBorder>
        <Group justify="center" mb="md">
          <IconCheck size={48} color="green" />
        </Group>
        <Title order={2} ta="center" mb="md">
          Registration Submitted
        </Title>
        <Text ta="center" mb="xl">
          Thank you for your interest in becoming a Dynamic AQS dealer. 
          Your application has been submitted and will be reviewed by our team.
          You will receive an email confirmation within 24-48 hours.
        </Text>
        <Text ta="center" size="sm" c="dimmed">
          Questions? Contact your local Territory Manager or call 1-800-DYNAMIC
        </Text>
      </Paper>
    );
  }

  return (
    <Paper radius="md" p="xl" withBorder>
      <Group justify="center" mb="md">
        <IconBuilding size={32} />
        <Title order={2}>Dealer Registration</Title>
      </Group>
      
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Apply for a Dynamic AQS dealer account
      </Text>

      {error && (
        <Alert icon={<IconInfoCircle size="1rem" />} color="red" mb="md">
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Title order={4}>Company Information</Title>
          
          <TextInput
            required
            label="Company Name"
            placeholder="Your Company LLC"
            {...form.getInputProps('companyName')}
          />

          <TextInput
            required
            label="Primary Contact Name"
            placeholder="John Smith"
            {...form.getInputProps('contactName')}
          />

          <Group grow>
            <TextInput
              required
              label="Email Address"
              placeholder="contact@company.com"
              {...form.getInputProps('email')}
            />
            <TextInput
              required
              label="Phone Number"
              placeholder="(555) 123-4567"
              {...form.getInputProps('phone')}
            />
          </Group>

          <TextInput
            required
            label="Business Address"
            placeholder="123 Main Street"
            {...form.getInputProps('address')}
          />

          <Group grow>
            <TextInput
              required
              label="City"
              placeholder="City"
              {...form.getInputProps('city')}
            />
            <TextInput
              required
              label="State"
              placeholder="State"
              {...form.getInputProps('state')}
            />
            <TextInput
              required
              label="ZIP Code"
              placeholder="12345"
              {...form.getInputProps('zipCode')}
            />
          </Group>

          <Title order={4} mt="md">Business Details</Title>

          <Group grow>
            <Select
              required
              label="Business Type"
              placeholder="Select business type"
              data={businessTypes}
              {...form.getInputProps('businessType')}
            />
            <TextInput
              required
              label="Years in Business"
              placeholder="5"
              {...form.getInputProps('yearsInBusiness')}
            />
          </Group>

          <Textarea
            label="Current Suppliers"
            placeholder="List your current HVAC suppliers..."
            {...form.getInputProps('currentSuppliers')}
          />

          <Select
            required
            label="Estimated Annual Volume"
            placeholder="Select volume range"
            data={volumeRanges}
            {...form.getInputProps('estimatedAnnualVolume')}
          />

          <Title order={4} mt="md">Account Security</Title>

          <Group grow>
            <PasswordInput
              required
              label="Password"
              placeholder="Create a secure password"
              {...form.getInputProps('password')}
            />
            <PasswordInput
              required
              label="Confirm Password"
              placeholder="Confirm your password"
              {...form.getInputProps('confirmPassword')}
            />
          </Group>

          <Checkbox
            required
            label="I agree to the Terms and Conditions and Privacy Policy"
            {...form.getInputProps('agreeToTerms', { type: 'checkbox' })}
          />

          <Button type="submit" fullWidth loading={loading} size="md">
            Submit Registration
          </Button>

          <Text ta="center" size="xs" c="dimmed">
            Registration is subject to approval. You will be contacted within 24-48 hours.
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
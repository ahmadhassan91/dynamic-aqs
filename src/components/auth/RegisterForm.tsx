'use client';

import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Select,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle } from '@tabler/icons-react';
import Link from 'next/link';

interface RegisterFormProps {
  onSubmit?: (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) => void;
  loading?: boolean;
  error?: string;
}

export function RegisterForm({ onSubmit, loading = false, error }: RegisterFormProps) {
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
    validate: {
      firstName: (value) => (value.length < 2 ? 'First name must be at least 2 characters' : null),
      lastName: (value) => (value.length < 2 ? 'Last name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
      role: (value) => (!value ? 'Please select a role' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onSubmit?.(values);
  };

  const roleOptions = [
    { value: 'territory_manager', label: 'Territory Manager' },
    { value: 'regional_manager', label: 'Regional Manager' },
    { value: 'admin', label: 'Administrator' },
    { value: 'dealer', label: 'Dealer' },
  ];

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mb="md">
        Create Account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Join Dynamic AQS CRM
      </Text>

      {error && (
        <Alert icon={<IconInfoCircle size="1rem" />} color="red" mb="md">
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="First Name"
            placeholder="John"
            {...form.getInputProps('firstName')}
          />

          <TextInput
            required
            label="Last Name"
            placeholder="Doe"
            {...form.getInputProps('lastName')}
          />

          <TextInput
            required
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />

          <Select
            required
            label="Role"
            placeholder="Select your role"
            data={roleOptions}
            {...form.getInputProps('role')}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
          />

          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Confirm your password"
            {...form.getInputProps('confirmPassword')}
          />

          <Button type="submit" fullWidth loading={loading}>
            Create Account
          </Button>

          <Text ta="center" size="sm">
            Already have an account?{' '}
            <Anchor component={Link} href="/auth/login" size="sm">
              Sign in
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
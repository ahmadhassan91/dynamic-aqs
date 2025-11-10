'use client';

import { useState } from 'react';
import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
  Group,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle, IconBuilding } from '@tabler/icons-react';
import Link from 'next/link';

interface DealerLoginFormProps {
  onSubmit?: (values: { email: string; password: string; rememberMe: boolean }) => void;
  loading?: boolean;
  error?: string;
}

export function DealerLoginForm({ onSubmit, loading = false, error }: DealerLoginFormProps) {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onSubmit?.(values);
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Group justify="center" mb="md">
        <IconBuilding size={32} />
        <Title order={2}>Dealer Portal</Title>
      </Group>
      
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Access your Dynamic AQS dealer account
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
            label="Email Address"
            placeholder="dealer@company.com"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
          />

          <Checkbox
            label="Keep me signed in"
            {...form.getInputProps('rememberMe', { type: 'checkbox' })}
          />

          <Button type="submit" fullWidth loading={loading} size="md">
            Sign In to Dealer Portal
          </Button>

          <Divider label="Need Help?" labelPosition="center" />

          <Group justify="space-between">
            <Anchor component={Link} href="/dealer/register" size="sm">
              Request Dealer Account
            </Anchor>
            <Anchor component={Link} href="/dealer/forgot-password" size="sm">
              Forgot Password?
            </Anchor>
          </Group>

          <Text ta="center" size="xs" c="dimmed">
            For technical support, contact your Territory Manager
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
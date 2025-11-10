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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle } from '@tabler/icons-react';
import Link from 'next/link';

interface LoginFormProps {
  onSubmit?: (values: { email: string; password: string; rememberMe: boolean }) => void;
  loading?: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, loading = false, error }: LoginFormProps) {
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
      <Title order={2} ta="center" mb="md">
        Welcome to Dynamic AQS CRM
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Sign in to access your account
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
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
          />

          <Checkbox
            label="Remember me"
            {...form.getInputProps('rememberMe', { type: 'checkbox' })}
          />

          <Button type="submit" fullWidth loading={loading}>
            Sign in
          </Button>

          <Text ta="center" size="sm">
            Don&apos;t have an account?{' '}
            <Anchor component={Link} href="/auth/register" size="sm">
              Create account
            </Anchor>
          </Text>

          <Text ta="center" size="sm">
            <Anchor component={Link} href="/auth/forgot-password" size="sm">
              Forgot your password?
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
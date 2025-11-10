'use client';

import {
  Paper,
  TextInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle, IconCheck } from '@tabler/icons-react';
import Link from 'next/link';

interface ForgotPasswordFormProps {
  onSubmit?: (values: { email: string }) => void;
  loading?: boolean;
  error?: string;
  success?: boolean;
}

export function ForgotPasswordForm({ 
  onSubmit, 
  loading = false, 
  error, 
  success = false 
}: ForgotPasswordFormProps) {
  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onSubmit?.(values);
  };

  if (success) {
    return (
      <Paper radius="md" p="xl" withBorder>
        <Alert icon={<IconCheck size="1rem" />} color="green" mb="md">
          Password reset instructions have been sent to your email address.
        </Alert>
        <Text ta="center" size="sm">
          <Anchor component={Link} href="/auth/login" size="sm">
            Back to login
          </Anchor>
        </Text>
      </Paper>
    );
  }

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mb="md">
        Reset Password
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Enter your email address and we&apos;ll send you a link to reset your password
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

          <Button type="submit" fullWidth loading={loading}>
            Send Reset Link
          </Button>

          <Text ta="center" size="sm">
            Remember your password?{' '}
            <Anchor component={Link} href="/auth/login" size="sm">
              Back to login
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
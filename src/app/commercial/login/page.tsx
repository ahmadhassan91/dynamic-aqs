'use client';

import { useState } from 'react';
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  Stack,
  Anchor,
  Alert,
  Center,
  Box,
} from '@mantine/core';
import { IconBuildingStore, IconAlertCircle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CommercialLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock authentication - replace with real auth
    if (email && password) {
      localStorage.setItem('commercialAuth', JSON.stringify({
        user: { email, name: 'Commercial User', role: 'commercial' },
        token: 'mock-token'
      }));
      router.push('/commercial/dashboard');
    } else {
      setError('Please enter both email and password');
    }
    
    setLoading(false);
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Container size={420}>
        <Center mb="xl">
          <Group gap="md">
            <IconBuildingStore size={48} color="white" />
            <Title order={1} c="white">Commercial CRM</Title>
          </Group>
        </Center>

        <Paper withBorder shadow="xl" p={40} radius="md" bg="white">
          <Title order={2} ta="center" mb="md">
            Sign In
          </Title>
          <Text c="dimmed" size="sm" ta="center" mb="xl">
            Access your commercial opportunities and contacts
          </Text>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
                size="md"
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                size="md"
              />
              <Button type="submit" fullWidth loading={loading} size="md" mt="md">
                Sign In
              </Button>
            </Stack>
          </form>

          <Text c="dimmed" size="sm" ta="center" mt="md">
            Don't have access?{' '}
            <Anchor size="sm" component={Link} href="/commercial/request-access">
              Request Access
            </Anchor>
          </Text>

          <Text c="dimmed" size="sm" ta="center" mt="xs">
            <Anchor size="sm" component={Link} href="/">
              ← Back to Main CRM
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </Box>
  );
}
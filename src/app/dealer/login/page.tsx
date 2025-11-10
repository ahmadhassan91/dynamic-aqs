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
  Checkbox,
} from '@mantine/core';
import { IconTruck, IconAlertCircle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DealerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock authentication - replace with real auth
      if (email && password) {
        localStorage.setItem('dealerAuth', JSON.stringify({
          user: { email, name: 'Dealer User', role: 'dealer' },
          token: 'mock-dealer-token',
          loginTime: new Date().toISOString(),
        }));
        router.push('/dealer/dashboard');
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Container size={420}>
        <Center mb="xl">
          <Group gap="md">
            <IconTruck size={48} color="white" />
            <Title order={1} c="white">Dealer Portal</Title>
          </Group>
        </Center>

        <Paper withBorder shadow="xl" p={40} radius="md" bg="white">
          <Title order={2} ta="center" mb="md">
            Dealer Sign In
          </Title>
          <Text c="dimmed" size="sm" ta="center" mb="xl">
            Access your dealer dashboard and manage orders
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
                placeholder="dealer@company.com"
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
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.currentTarget.checked)}
              />
              <Button type="submit" fullWidth loading={loading} size="md" mt="md">
                Sign In
              </Button>
            </Stack>
          </form>

          <Text c="dimmed" size="sm" ta="center" mt="md">
            New dealer?{' '}
            <Anchor size="sm" component={Link} href="/dealer/register">
              Register Here
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
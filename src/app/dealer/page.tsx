'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Center, Loader, Stack, Text, Title, Card, Button, Group, Grid } from '@mantine/core';
import { IconBuilding, IconLogin, IconUserPlus, IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

export default function DealerPortalPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem('dealerAuth');
    if (auth) {
      router.push('/dealer/dashboard');
    }
  }, [router]);

  return (
    <Container size="md" py="xl">
      <Stack gap="xl" align="center">
        {/* Header */}
        <Stack gap="md" align="center">
          <Group>
            <IconBuilding size={48} color="var(--mantine-color-blue-6)" />
            <Title order={1} size="h1">
              Dynamic AQS Dealer Portal
            </Title>
          </Group>
          <Text size="lg" c="dimmed" ta="center">
            Access your account, browse products, manage orders, and track shipments
          </Text>
        </Stack>

        {/* Authentication Cards */}
        <Grid gutter="lg" style={{ width: '100%', maxWidth: 600 }}>
          <Grid.Col span={6}>
            <Card withBorder padding="xl" radius="md" h="100%">
              <Stack gap="md" align="center" h="100%" justify="center">
                <IconLogin size={48} color="var(--mantine-color-blue-6)" />
                <Title order={3}>Sign In</Title>
                <Text size="sm" c="dimmed" ta="center">
                  Access your existing dealer account
                </Text>
                <Button
                  component={Link}
                  href="/dealer/login"
                  rightSection={<IconArrowRight size={16} />}
                  fullWidth
                >
                  Sign In
                </Button>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card withBorder padding="xl" radius="md" h="100%">
              <Stack gap="md" align="center" h="100%" justify="center">
                <IconUserPlus size={48} color="var(--mantine-color-green-6)" />
                <Title order={3}>Register</Title>
                <Text size="sm" c="dimmed" ta="center">
                  Create a new dealer account
                </Text>
                <Button
                  component={Link}
                  href="/dealer/register"
                  rightSection={<IconArrowRight size={16} />}
                  variant="outline"
                  fullWidth
                >
                  Register
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Features */}
        <Card withBorder padding="xl" radius="md" style={{ width: '100%' }}>
          <Stack gap="md">
            <Title order={3} ta="center">What You Can Do</Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Stack gap="xs" align="center">
                  <IconBuilding size={32} color="var(--mantine-color-blue-6)" />
                  <Text fw={500} ta="center">Browse Catalog</Text>
                  <Text size="sm" c="dimmed" ta="center">
                    View our complete product catalog with pricing
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Stack gap="xs" align="center">
                  <IconBuilding size={32} color="var(--mantine-color-green-6)" />
                  <Text fw={500} ta="center">Place Orders</Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Easy online ordering with real-time inventory
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Stack gap="xs" align="center">
                  <IconBuilding size={32} color="var(--mantine-color-orange-6)" />
                  <Text fw={500} ta="center">Track Shipments</Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Monitor your orders from placement to delivery
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Stack gap="xs" align="center">
                  <IconBuilding size={32} color="var(--mantine-color-purple-6)" />
                  <Text fw={500} ta="center">Account Management</Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Manage your account, billing, and preferences
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Contact Information */}
        <Card withBorder padding="lg" radius="md" style={{ width: '100%' }}>
          <Stack gap="sm">
            <Title order={4} ta="center">Need Help?</Title>
            <Text size="sm" ta="center" c="dimmed">
              Contact our dealer support team for assistance with your account or orders
            </Text>
            <Group justify="center">
              <Text size="sm">
                <strong>Phone:</strong> 1-800-DYNAMIC
              </Text>
              <Text size="sm">
                <strong>Email:</strong> dealers@dynamicaqs.com
              </Text>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
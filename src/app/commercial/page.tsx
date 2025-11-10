'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Stack, Text, Title, Card, Button, Group } from '@mantine/core';
import { IconBuildingStore, IconLogin, IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

export default function CommercialPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem('commercialAuth');
    if (auth) {
      router.push('/commercial/dashboard');
    }
  }, [router]);

  return (
    <Container size="md" py="xl">
      <Stack gap="xl" align="center">
        {/* Header */}
        <Stack gap="md" align="center">
          <Group>
            <IconBuildingStore size={48} color="var(--mantine-color-green-6)" />
            <Title order={1} size="h1" c="green">
              Commercial CRM
            </Title>
          </Group>
          <Text size="lg" c="dimmed" ta="center">
            Manage commercial opportunities, engineer relationships, and market analysis
          </Text>
        </Stack>

        {/* Login Card */}
        <Card withBorder padding="xl" radius="md" style={{ width: '100%', maxWidth: 400 }}>
          <Stack gap="md" align="center">
            <IconLogin size={48} color="var(--mantine-color-green-6)" />
            <Title order={3}>Access Commercial CRM</Title>
            <Text size="sm" c="dimmed" ta="center">
              Sign in to manage your commercial opportunities and contacts
            </Text>
            <Button
              component={Link}
              href="/commercial/login"
              rightSection={<IconArrowRight size={16} />}
              fullWidth
              size="lg"
            >
              Sign In
            </Button>
          </Stack>
        </Card>

        {/* Features */}
        <Card withBorder padding="xl" radius="md" style={{ width: '100%' }}>
          <Stack gap="md">
            <Title order={3} ta="center">Commercial CRM Features</Title>
            <Group justify="center" gap="xl">
              <Stack gap="xs" align="center">
                <IconBuildingStore size={32} color="var(--mantine-color-green-6)" />
                <Text fw={500} ta="center">Opportunity Management</Text>
                <Text size="sm" c="dimmed" ta="center">
                  Track complex commercial opportunities
                </Text>
              </Stack>
              <Stack gap="xs" align="center">
                <IconBuildingStore size={32} color="var(--mantine-color-blue-6)" />
                <Text fw={500} ta="center">Engineer Contacts</Text>
                <Text size="sm" c="dimmed" ta="center">
                  Manage relationships with engineers
                </Text>
              </Stack>
              <Stack gap="xs" align="center">
                <IconBuildingStore size={32} color="var(--mantine-color-orange-6)" />
                <Text fw={500} ta="center">Market Analysis</Text>
                <Text size="sm" c="dimmed" ta="center">
                  Analyze market segments and trends
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Card>

        {/* Back to Main CRM */}
        <Text size="sm" c="dimmed">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ← Back to Main CRM
          </Link>
        </Text>
      </Stack>
    </Container>
  );
}
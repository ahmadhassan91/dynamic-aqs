'use client';

import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Card, 
  Group, 
  Button, 
  Badge,
  SimpleGrid,
  ThemeIcon,
  List,
  Anchor
} from '@mantine/core';
import { 
  IconDeviceMobile, 
  IconDownload, 
  IconQrcode, 
  IconUsers,
  IconMapPin,
  IconRefresh,
  IconShield,
  IconExternalLink
} from '@tabler/icons-react';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';
import { AppLayout } from '@/components/layout/AppLayout';

export default function MobileAppPage() {
  return (
    <MockDataProvider>
      <AppLayout>
        <Stack gap="xl" p="md">
          <div>
            <Title order={1}>Mobile App</Title>
            <Text c="dimmed">Field sales and customer management on the go</Text>
          </div>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group justify="space-between">
                <Text fw={500}>iOS App</Text>
                <Badge color="blue" variant="light">Available</Badge>
              </Group>
            </Card.Section>

            <Stack gap="md" mt="md">
              <Group>
                <ThemeIcon size="lg" variant="light" color="blue">
                  <IconDeviceMobile size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Dynamic AQS CRM</Text>
                  <Text size="sm" c="dimmed">Version 2.1.0</Text>
                </div>
              </Group>

              <List spacing="xs" size="sm">
                <List.Item icon={<IconUsers size={16} />}>Customer management</List.Item>
                <List.Item icon={<IconMapPin size={16} />}>Route optimization</List.Item>
                <List.Item icon={<IconRefresh size={16} />}>Offline sync</List.Item>
                <List.Item icon={<IconShield size={16} />}>Secure authentication</List.Item>
              </List>

              <Group>
                <Button leftSection={<IconDownload size={16} />} variant="filled">
                  Download iOS App
                </Button>
                <Button leftSection={<IconQrcode size={16} />} variant="outline">
                  QR Code
                </Button>
              </Group>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group justify="space-between">
                <Text fw={500}>Android App</Text>
                <Badge color="green" variant="light">Available</Badge>
              </Group>
            </Card.Section>

            <Stack gap="md" mt="md">
              <Group>
                <ThemeIcon size="lg" variant="light" color="green">
                  <IconDeviceMobile size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Dynamic AQS CRM</Text>
                  <Text size="sm" c="dimmed">Version 2.1.0</Text>
                </div>
              </Group>

              <List spacing="xs" size="sm">
                <List.Item icon={<IconUsers size={16} />}>Customer management</List.Item>
                <List.Item icon={<IconMapPin size={16} />}>Route optimization</List.Item>
                <List.Item icon={<IconRefresh size={16} />}>Offline sync</List.Item>
                <List.Item icon={<IconShield size={16} />}>Secure authentication</List.Item>
              </List>

              <Group>
                <Button leftSection={<IconDownload size={16} />} variant="filled" color="green">
                  Download Android App
                </Button>
                <Button leftSection={<IconQrcode size={16} />} variant="outline">
                  QR Code
                </Button>
              </Group>
            </Stack>
          </Card>
        </SimpleGrid>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>Getting Started</Title>
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
              <div>
                <Text fw={500} mb="xs">1. Download the App</Text>
                <Text size="sm" c="dimmed">
                  Download the mobile app from your device's app store or use the QR code above.
                </Text>
              </div>
              <div>
                <Text fw={500} mb="xs">2. Sign In</Text>
                <Text size="sm" c="dimmed">
                  Use your existing CRM credentials to sign in to the mobile app.
                </Text>
              </div>
              <div>
                <Text fw={500} mb="xs">3. Sync Data</Text>
                <Text size="sm" c="dimmed">
                  Your customer data and routes will automatically sync to your device.
                </Text>
              </div>
            </SimpleGrid>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>Support & Documentation</Title>
            <Group>
              <Anchor href="#" target="_blank">
                <Group gap="xs">
                  <Text>User Guide</Text>
                  <IconExternalLink size={16} />
                </Group>
              </Anchor>
              <Anchor href="#" target="_blank">
                <Group gap="xs">
                  <Text>Video Tutorials</Text>
                  <IconExternalLink size={16} />
                </Group>
              </Anchor>
              <Anchor href="#" target="_blank">
                <Group gap="xs">
                  <Text>Technical Support</Text>
                  <IconExternalLink size={16} />
                </Group>
              </Anchor>
            </Group>
          </Stack>
        </Card>
        </Stack>
      </AppLayout>
    </MockDataProvider>
  );
}
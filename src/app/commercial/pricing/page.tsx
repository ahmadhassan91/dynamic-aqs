'use client';

import { Container, Title, Text, Grid, Card, Group, Badge, Button, Stack, Tabs, Paper } from '@mantine/core';
import { IconCalculator, IconFileText, IconHistory, IconSettings, IconActivity, IconBug } from '@tabler/icons-react';
import { PricingToolInterface } from '@/components/commercial/PricingToolInterface';
import { QuoteHistory } from '@/components/commercial/QuoteHistory';
import { PricingSettings } from '@/components/commercial/PricingSettings';
import { PricingIntegrationMonitor } from '@/components/commercial/PricingIntegrationMonitor';
import { PricingIntegrationDiagnostics } from '@/components/commercial/PricingIntegrationDiagnostics';

export default function CommercialPricingPage() {
  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="xs">Quote Generator & Pricing Tool</Title>
          <Text c="dimmed" size="lg">
            Generate quotes for Dynamic AQS products with real-time pricing integration
          </Text>
        </div>

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Group>
                  <IconCalculator size={24} />
                  <Title order={3}>Product Quote Generator</Title>
                </Group>
                <Badge color="green" variant="light">
                  Integration Active
                </Badge>
              </Group>
              
              <Tabs defaultValue="generator" variant="outline">
                <Tabs.List>
                  <Tabs.Tab value="generator" leftSection={<IconCalculator size={16} />}>
                    Quote Generator
                  </Tabs.Tab>
                  <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
                    Quote History
                  </Tabs.Tab>
                  <Tabs.Tab value="monitor" leftSection={<IconActivity size={16} />}>
                    Integration Monitor
                  </Tabs.Tab>
                  <Tabs.Tab value="diagnostics" leftSection={<IconBug size={16} />}>
                    Diagnostics
                  </Tabs.Tab>
                  <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
                    Settings
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="generator" pt="md">
                  <PricingToolInterface />
                </Tabs.Panel>

                <Tabs.Panel value="history" pt="md">
                  <QuoteHistory />
                </Tabs.Panel>

                <Tabs.Panel value="monitor" pt="md">
                  <PricingIntegrationMonitor />
                </Tabs.Panel>

                <Tabs.Panel value="diagnostics" pt="md">
                  <PricingIntegrationDiagnostics />
                </Tabs.Panel>

                <Tabs.Panel value="settings" pt="md">
                  <PricingSettings />
                </Tabs.Panel>
              </Tabs>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={4}>Integration Status</Title>
                  <Badge color="green" size="sm">Online</Badge>
                </Group>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm">Pricing Database</Text>
                    <Badge color="green" size="xs">Connected</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Product Catalog</Text>
                    <Badge color="green" size="xs">Synced</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Last Update</Text>
                    <Text size="xs" c="dimmed">2 minutes ago</Text>
                  </Group>
                </Stack>
              </Card>

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Quick Actions</Title>
                <Stack gap="xs">
                  <Button variant="light" fullWidth leftSection={<IconFileText size={16} />}>
                    Create New Quote
                  </Button>
                  <Button variant="outline" fullWidth>
                    View All Quotes
                  </Button>
                  <Button variant="outline" fullWidth>
                    Pricing Reports
                  </Button>
                </Stack>
              </Card>

              <Paper p="md" withBorder>
                <Title order={5} mb="xs">Featured Products</Title>
                <Text size="sm" c="dimmed" mb="md">
                  Popular Dynamic AQS products for quoting
                </Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>PMAC Air Cleaner</Text>
                    <Badge size="xs" color="blue">Popular</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>RS4 IAQ System</Text>
                    <Badge size="xs" color="orange">New</Badge>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
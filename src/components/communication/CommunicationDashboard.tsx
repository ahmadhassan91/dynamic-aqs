'use client';

import { useState } from 'react';
import {
  Stack,
  Group,
  Text,
  Button,
  Tabs,
  Card,
  Grid,
  Badge,
  Alert,
} from '@mantine/core';
import {
  IconHistory,
  IconTemplate,
  IconChartBar,
  IconPlus,
  IconBell,
  IconAlertTriangle,
  IconUsers,
  IconBuilding,
  IconInfoCircle,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import { CommunicationHistory } from './CommunicationHistory';
import { CommunicationTemplates } from './CommunicationTemplates';
import { CommunicationAnalytics } from './CommunicationAnalytics';

export function CommunicationDashboard() {
  const [activeTab, setActiveTab] = useState<string>('history');

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl" fw={600}>Communication Management</Text>
        <Group>
          <Button
            component={Link}
            href="/communication/unified"
            leftSection={<IconBell size={16} />}
            variant="light"
          >
            Unified Center
          </Button>
          <Button
            component={Link}
            href="/communication/escalations"
            leftSection={<IconAlertTriangle size={16} />}
            variant="light"
          >
            Escalations
          </Button>
        </Group>
      </Group>

      {/* Unified Communication Features */}
      <Alert icon={<IconInfoCircle size={16} />} color="blue" mb="md">
        New unified communication features are now available for managing both residential and commercial notifications.
      </Alert>

      <Grid mb="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="md">
            <Group justify="space-between" mb="sm">
              <div>
                <Text fw={600} mb="xs">Unified Communication Center</Text>
                <Text size="sm" c="dimmed">
                  Centralized notification management for both residential and commercial operations
                </Text>
              </div>
              <IconUsers size={24} color="blue" />
            </Group>
            <Group>
              <Button
                component={Link}
                href="/communication/unified"
                size="xs"
                variant="light"
              >
                Open Center
              </Button>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="md">
            <Group justify="space-between" mb="sm">
              <div>
                <Text fw={600} mb="xs">Escalation Manager</Text>
                <Text size="sm" c="dimmed">
                  Automated escalation workflows for high-value commercial deals
                </Text>
              </div>
              <IconAlertTriangle size={24} color="orange" />
            </Group>
            <Group>
              <Button
                component={Link}
                href="/communication/escalations"
                size="xs"
                variant="light"
              >
                Manage Escalations
              </Button>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'history')}>
        <Tabs.List>
          <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
            Communication History
          </Tabs.Tab>
          <Tabs.Tab value="templates" leftSection={<IconTemplate size={16} />}>
            Templates
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
          <Tabs.Tab value="commercial" leftSection={<IconBuilding size={16} />}>
            Commercial Notifications
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="history" pt="md">
          <CommunicationHistory />
        </Tabs.Panel>

        <Tabs.Panel value="templates" pt="md">
          <CommunicationTemplates />
        </Tabs.Panel>

        <Tabs.Panel value="analytics" pt="md">
          <CommunicationAnalytics />
        </Tabs.Panel>

        <Tabs.Panel value="commercial" pt="md">
          <Stack gap="md">
            <Text fw={600}>Commercial Notification Features</Text>
            
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder p="md">
                  <Text fw={500} mb="xs">Opportunity Alerts</Text>
                  <Text size="sm" c="dimmed" mb="md">
                    Automated notifications for high-value commercial opportunities
                  </Text>
                  <Badge color="green">Active</Badge>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder p="md">
                  <Text fw={500} mb="xs">Engineer Follow-ups</Text>
                  <Text size="sm" c="dimmed" mb="md">
                    Reminders for engineer contact and relationship management
                  </Text>
                  <Badge color="green">Active</Badge>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder p="md">
                  <Text fw={500} mb="xs">Team Coordination</Text>
                  <Text size="sm" c="dimmed" mb="md">
                    Cross-functional notifications for large opportunities
                  </Text>
                  <Badge color="green">Active</Badge>
                </Card>
              </Grid.Col>
            </Grid>

            <Alert icon={<IconInfoCircle size={16} />} color="blue">
              Commercial notifications are automatically triggered based on opportunity values, 
              sales phases, and engineer interactions. Configure escalation rules in the 
              Escalation Manager for automated workflows.
            </Alert>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
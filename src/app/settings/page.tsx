'use client';

import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Tabs, 
  Card, 
  Group, 
  Switch, 
  Select, 
  TextInput, 
  Button,
  Divider,
  Badge,
  SimpleGrid
} from '@mantine/core';
import { 
  IconUser, 
  IconBell, 
  IconShield, 
  IconPalette, 
  IconDatabase,
  IconMail,
  IconKey,
  IconGlobe
} from '@tabler/icons-react';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { useState } from 'react';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/New_York');

  return (
    <MockDataProvider>
      <AppLayout>
        <Container size="xl" py="md">
          <Stack gap="md">
            <div>
              <Title order={1}>Settings</Title>
              <Text c="dimmed">Manage your account and application preferences</Text>
            </div>
        
        <Tabs defaultValue="profile">
          <Tabs.List>
            <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
              Profile
            </Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
              Notifications
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
              Security
            </Tabs.Tab>
            <Tabs.Tab value="appearance" leftSection={<IconPalette size={16} />}>
              Appearance
            </Tabs.Tab>
            <Tabs.Tab value="integrations" leftSection={<IconDatabase size={16} />}>
              Integrations
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={3}>Profile Information</Title>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  <TextInput
                    label="First Name"
                    placeholder="John"
                    defaultValue="John"
                  />
                  <TextInput
                    label="Last Name"
                    placeholder="Doe"
                    defaultValue="Doe"
                  />
                  <TextInput
                    label="Email"
                    placeholder="john.doe@company.com"
                    defaultValue="john.doe@company.com"
                  />
                  <TextInput
                    label="Phone"
                    placeholder="+1 (555) 123-4567"
                    defaultValue="+1 (555) 123-4567"
                  />
                </SimpleGrid>
                <Group>
                  <Button>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </Group>
              </Stack>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="notifications" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={3}>Notification Preferences</Title>
                
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>Email Notifications</Text>
                    <Text size="sm" c="dimmed">Receive notifications via email</Text>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onChange={(event) => setEmailNotifications(event.currentTarget.checked)}
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text fw={500}>Push Notifications</Text>
                    <Text size="sm" c="dimmed">Receive push notifications in browser</Text>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onChange={(event) => setPushNotifications(event.currentTarget.checked)}
                  />
                </Group>

                <Divider />

                <Select
                  label="Notification Frequency"
                  placeholder="Select frequency"
                  data={[
                    { value: 'immediate', label: 'Immediate' },
                    { value: 'hourly', label: 'Hourly Digest' },
                    { value: 'daily', label: 'Daily Digest' },
                    { value: 'weekly', label: 'Weekly Digest' },
                  ]}
                  defaultValue="immediate"
                />

                <Button>Save Notification Settings</Button>
              </Stack>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="security" pt="md">
            <Stack gap="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3}>Password & Authentication</Title>
                  <Button leftSection={<IconKey size={16} />} variant="outline">
                    Change Password
                  </Button>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>Two-Factor Authentication</Text>
                      <Text size="sm" c="dimmed">Add an extra layer of security</Text>
                    </div>
                    <Badge color="red" variant="light">Disabled</Badge>
                  </Group>
                  <Button variant="outline">Enable 2FA</Button>
                </Stack>
              </Card>

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3}>Active Sessions</Title>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>Current Session</Text>
                      <Text size="sm" c="dimmed">Chrome on macOS • Last active now</Text>
                    </div>
                    <Badge color="green" variant="light">Active</Badge>
                  </Group>
                  <Button variant="outline" color="red">
                    Sign Out All Other Sessions
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="appearance" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={3}>Appearance Settings</Title>
                
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>Dark Mode</Text>
                    <Text size="sm" c="dimmed">Use dark theme across the application</Text>
                  </div>
                  <Switch
                    checked={darkMode}
                    onChange={(event) => setDarkMode(event.currentTarget.checked)}
                  />
                </Group>

                <Select
                  label="Language"
                  leftSection={<IconGlobe size={16} />}
                  value={language}
                  onChange={(value) => setLanguage(value || 'en')}
                  data={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Español' },
                    { value: 'fr', label: 'Français' },
                    { value: 'de', label: 'Deutsch' },
                  ]}
                />

                <Select
                  label="Timezone"
                  value={timezone}
                  onChange={(value) => setTimezone(value || 'America/New_York')}
                  data={[
                    { value: 'America/New_York', label: 'Eastern Time (ET)' },
                    { value: 'America/Chicago', label: 'Central Time (CT)' },
                    { value: 'America/Denver', label: 'Mountain Time (MT)' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                  ]}
                />

                <Button>Save Appearance Settings</Button>
              </Stack>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="integrations" pt="md">
            <Stack gap="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3}>Email Integration</Title>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>Microsoft Outlook</Text>
                      <Text size="sm" c="dimmed">Sync emails and calendar events</Text>
                    </div>
                    <Badge color="green" variant="light">Connected</Badge>
                  </Group>
                  <Button leftSection={<IconMail size={16} />} variant="outline">
                    Configure Email Settings
                  </Button>
                </Stack>
              </Card>

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3}>CRM Integrations</Title>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>Salesforce</Text>
                      <Text size="sm" c="dimmed">Sync customer data and opportunities</Text>
                    </div>
                    <Badge color="gray" variant="light">Not Connected</Badge>
                  </Group>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500}>HubSpot</Text>
                      <Text size="sm" c="dimmed">Marketing automation and lead tracking</Text>
                    </div>
                    <Badge color="gray" variant="light">Not Connected</Badge>
                  </Group>
                  <Button variant="outline">Manage Integrations</Button>
                </Stack>
              </Card>
            </Stack>
          </Tabs.Panel>
        </Tabs>
          </Stack>
        </Container>
      </AppLayout>
    </MockDataProvider>
  );
}
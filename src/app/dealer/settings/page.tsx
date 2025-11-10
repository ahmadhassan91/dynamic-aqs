'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Card,
  Text,
  Stack,
  Group,
  Button,
  Switch,
  Select,
  Divider,
  LoadingOverlay,
  ThemeIcon,
  Paper,
} from '@mantine/core';
import {
  IconSettings,
  IconBell,
  IconMail,
  IconShield,
  IconPalette,
  IconLanguage,
} from '@tabler/icons-react';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderConfirmations: true,
    shipmentUpdates: true,
    promotionalEmails: false,
    weeklyDigest: true,
    twoFactorAuth: false,
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
  });
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('dealerAuth');
    if (!auth) {
      router.push('/dealer/login');
      return;
    }

    // Load settings
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Load saved settings from localStorage if available
      const savedSettings = localStorage.getItem('dealerSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    // Save to localStorage
    localStorage.setItem('dealerSettings', JSON.stringify(newSettings));
    
    notifications.show({
      title: 'Settings Updated',
      message: 'Your preferences have been saved',
      color: 'green',
    });
  };

  return (
    <DealerLayout>
      <Container size="md">
        <LoadingOverlay visible={loading} />
        
        <Stack gap="xl">
          {/* Header */}
          <Group>
            <ThemeIcon size="xl" variant="light" color="blue">
              <IconSettings size={24} />
            </ThemeIcon>
            <Title order={2}>Settings & Preferences</Title>
          </Group>

          {/* Notification Settings */}
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Group>
                <ThemeIcon size="lg" variant="light" color="blue">
                  <IconBell size={20} />
                </ThemeIcon>
                <Title order={4}>Notification Preferences</Title>
              </Group>
              <Divider />
              
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>Email Notifications</Text>
                    <Text size="sm" c="dimmed">Receive email notifications for account activity</Text>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.currentTarget.checked)}
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text fw={500}>Order Confirmations</Text>
                    <Text size="sm" c="dimmed">Get notified when orders are placed</Text>
                  </div>
                  <Switch
                    checked={settings.orderConfirmations}
                    onChange={(e) => handleSettingChange('orderConfirmations', e.currentTarget.checked)}
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text fw={500}>Shipment Updates</Text>
                    <Text size="sm" c="dimmed">Receive updates on shipment status</Text>
                  </div>
                  <Switch
                    checked={settings.shipmentUpdates}
                    onChange={(e) => handleSettingChange('shipmentUpdates', e.currentTarget.checked)}
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text fw={500}>Weekly Digest</Text>
                    <Text size="sm" c="dimmed">Get a weekly summary of your account</Text>
                  </div>
                  <Switch
                    checked={settings.weeklyDigest}
                    onChange={(e) => handleSettingChange('weeklyDigest', e.currentTarget.checked)}
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text fw={500}>Promotional Emails</Text>
                    <Text size="sm" c="dimmed">Receive promotional offers and newsletters</Text>
                  </div>
                  <Switch
                    checked={settings.promotionalEmails}
                    onChange={(e) => handleSettingChange('promotionalEmails', e.currentTarget.checked)}
                  />
                </Group>
              </Stack>
            </Stack>
          </Card>

          {/* Security Settings */}
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Group>
                <ThemeIcon size="lg" variant="light" color="green">
                  <IconShield size={20} />
                </ThemeIcon>
                <Title order={4}>Security</Title>
              </Group>
              <Divider />
              
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>Two-Factor Authentication</Text>
                    <Text size="sm" c="dimmed">Add an extra layer of security to your account</Text>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('twoFactorAuth', e.currentTarget.checked)}
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text fw={500}>Password</Text>
                    <Text size="sm" c="dimmed">Change your account password</Text>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text fw={500}>Active Sessions</Text>
                    <Text size="sm" c="dimmed">Manage devices logged into your account</Text>
                  </div>
                  <Button variant="outline" size="sm">
                    View Sessions
                  </Button>
                </Group>
              </Stack>
            </Stack>
          </Card>

          {/* Regional Settings */}
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Group>
                <ThemeIcon size="lg" variant="light" color="orange">
                  <IconLanguage size={20} />
                </ThemeIcon>
                <Title order={4}>Regional Settings</Title>
              </Group>
              <Divider />
              
              <Stack gap="md">
                <div>
                  <Text fw={500} mb="xs">Language</Text>
                  <Select
                    data={[
                      { value: 'en', label: 'English (US)' },
                      { value: 'es', label: 'Español' },
                      { value: 'fr', label: 'Français' },
                    ]}
                    value={settings.language}
                    onChange={(value) => value && handleSettingChange('language', value)}
                  />
                </div>

                <div>
                  <Text fw={500} mb="xs">Currency</Text>
                  <Select
                    data={[
                      { value: 'USD', label: 'US Dollar (USD)' },
                      { value: 'CAD', label: 'Canadian Dollar (CAD)' },
                      { value: 'EUR', label: 'Euro (EUR)' },
                    ]}
                    value={settings.currency}
                    onChange={(value) => value && handleSettingChange('currency', value)}
                  />
                </div>

                <div>
                  <Text fw={500} mb="xs">Date Format</Text>
                  <Select
                    data={[
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                    ]}
                    value={settings.dateFormat}
                    onChange={(value) => value && handleSettingChange('dateFormat', value)}
                  />
                </div>
              </Stack>
            </Stack>
          </Card>

          {/* Data & Privacy */}
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Title order={4}>Data & Privacy</Title>
              <Divider />
              
              <Stack gap="sm">
                <Button variant="outline" fullWidth>
                  Download My Data
                </Button>
                <Button variant="outline" color="red" fullWidth>
                  Delete Account
                </Button>
              </Stack>
              
              <Text size="xs" c="dimmed" ta="center">
                For more information about how we handle your data, please review our{' '}
                <Text component="a" href="#" c="blue" td="underline" span>Privacy Policy</Text>.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </DealerLayout>
  );
}

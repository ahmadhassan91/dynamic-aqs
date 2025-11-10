'use client';

import { Container, Title, Text, Stack, Tabs } from '@mantine/core';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { useState } from 'react';

export default function NotificationsPage() {
  const [notificationCenterOpened, setNotificationCenterOpened] = useState(true);
  const [preferencesOpened, setPreferencesOpened] = useState(true);

  return (
    <MockDataProvider>
      <AppLayout>
        <Stack gap="md" p="md">
          <div>
            <Title order={1}>Notifications</Title>
            <Text c="dimmed">Manage your notifications and preferences</Text>
          </div>
          
          <Tabs defaultValue="center">
            <Tabs.List>
              <Tabs.Tab value="center">Notification Center</Tabs.Tab>
              <Tabs.Tab value="preferences">Preferences</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="center" pt="md">
              <NotificationCenter 
                opened={notificationCenterOpened}
                onClose={() => setNotificationCenterOpened(false)}
              />
            </Tabs.Panel>

            <Tabs.Panel value="preferences" pt="md">
              <NotificationPreferences 
                opened={preferencesOpened}
                onClose={() => setPreferencesOpened(false)}
              />
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </AppLayout>
    </MockDataProvider>
  );
}
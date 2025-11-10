'use client';

import { useEffect, useState } from 'react';
import { MantineProvider, Loader, Center, Stack, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '@/theme/theme';
import { MockDataProvider } from '@/lib/mockData/MockDataProvider';


interface HydrationProviderProps {
  children: React.ReactNode;
}

export function HydrationProvider({ children }: HydrationProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <MantineProvider theme={theme}>
        <Center style={{ height: '100vh', backgroundColor: 'var(--mantine-color-gray-0)' }}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text size="sm" c="dimmed">Loading Dynamic AQS CRM...</Text>
          </Stack>
        </Center>
      </MantineProvider>
    );
  }

  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <MockDataProvider>
        {children}
      </MockDataProvider>
    </MantineProvider>
  );
}
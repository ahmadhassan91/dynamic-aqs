'use client';

import { useState } from 'react';
import {
  AppShell,
  Burger,
  Group,
  Text,
  UnstyledButton,
  Avatar,
  Menu,
  rem,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconSettings,
  IconUser,
  IconChevronDown,
  IconBell,
} from '@tabler/icons-react';
import { Navigation } from './Navigation';
import { Logo } from '../ui/Logo';
import { NotificationBell } from '../notifications/NotificationBell';
import { ClientOnlyWrapper } from '../ui/ClientOnlyWrapper';
import { NavigationProvider } from './NavigationContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <NavigationProvider>
      <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding={0}
      style={{ minHeight: '100vh' }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Logo />
          </Group>

          <Group>
            <ClientOnlyWrapper fallback={<ActionIcon variant="subtle" size="sm"><IconBell size={16} /></ActionIcon>}>
              <NotificationBell />
            </ClientOnlyWrapper>
            <Menu
              width={200}
              position="bottom-end"
              transitionProps={{ transition: 'pop-top-right' }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={7}>
                    <Avatar size={26} radius="xl" />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      John Doe
                    </Text>
                    <IconChevronDown
                      style={{ width: rem(12), height: rem(12) }}
                      stroke={1.5}
                    />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconUser style={{ width: rem(16), height: rem(16) }} />
                  }
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconSettings style={{ width: rem(16), height: rem(16) }} />
                  }
                >
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={
                    <IconLogout style={{ width: rem(16), height: rem(16) }} />
                  }
                  color="red"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 60px)' }}>
        <Navigation />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
    </NavigationProvider>
  );
}
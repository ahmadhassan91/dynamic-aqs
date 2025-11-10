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
  Box,
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
import { DealerNavigation } from './DealerNavigation';
import { DealerLogo } from '../ui/DealerLogo';
import { ClientOnlyWrapper } from '../ui/ClientOnlyWrapper';

interface DealerLayoutProps {
  children: React.ReactNode;
}

export function DealerLayout({ children }: DealerLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
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
            <DealerLogo />
          </Group>

          <Group>
            <ClientOnlyWrapper fallback={<ActionIcon variant="subtle" size="sm"><IconBell size={16} /></ActionIcon>}>
              <ActionIcon variant="subtle" size="sm">
                <IconBell size={16} />
              </ActionIcon>
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
                      Dealer User
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

      <AppShell.Navbar p="md">
        <DealerNavigation />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
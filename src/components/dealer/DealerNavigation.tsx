'use client';

import { useState } from 'react';
import {
  AppShell,
  Text,
  Group,
  Button,
  Menu,
  Avatar,
  UnstyledButton,
  Stack,
  NavLink,
  Burger,
  Drawer,
  Indicator,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import {
  IconDashboard,
  IconShoppingCart,
  IconPackage,
  IconTruck,
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconBuilding,
  IconReceipt,
  IconCreditCard,
  IconHeart,
  IconSearch,
  IconBolt,
  IconScale,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DealerNavigationProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    companyName: string;
    role: string;
  };
  onLogout: () => void;
}

const navigationItems = [
  {
    label: 'Dashboard',
    icon: IconDashboard,
    href: '/dealer/dashboard',
  },
  {
    label: 'Product Catalog',
    icon: IconPackage,
    href: '/dealer/catalog',
  },
  {
    label: 'Advanced Search',
    icon: IconSearch,
    href: '/dealer/catalog/search',
  },
  {
    label: 'Favorites & Lists',
    icon: IconHeart,
    href: '/dealer/catalog/favorites',
  },
  {
    label: 'Quick Order',
    icon: IconBolt,
    href: '/dealer/catalog/quick-order',
  },
  {
    label: 'Compare Products',
    icon: IconScale,
    href: '/dealer/catalog/compare',
  },
  {
    label: 'Shopping Cart',
    icon: IconShoppingCart,
    href: '/dealer/cart',
  },
  {
    label: 'Orders',
    icon: IconReceipt,
    href: '/dealer/orders',
  },
  {
    label: 'Shipments',
    icon: IconTruck,
    href: '/dealer/shipments',
  },
  {
    label: 'Account',
    icon: IconCreditCard,
    href: '/dealer/account',
  },
];

export function DealerNavigation({ children, user, onLogout }: DealerNavigationProps) {
  const [opened, { toggle, close }] = useDisclosure();
  const [cartItemCount, setCartItemCount] = useState(0);
  const pathname = usePathname();

  // Update cart count when component mounts and when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('dealerCart');
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartItemCount(totalItems);
        } catch {
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };

    updateCartCount();

    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);

    // Custom event for cart updates within the same tab
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const UserMenu = () => (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Group>
            <Avatar size="sm" radius="xl">
              {user.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {user.name}
              </Text>
              <Text size="xs" c="dimmed">
                {user.companyName}
              </Text>
            </div>
            <IconChevronDown size={14} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item leftSection={<IconUser size={14} />} component={Link} href="/dealer/profile">
          Profile Settings
        </Menu.Item>
        <Menu.Item leftSection={<IconBuilding size={14} />} component={Link} href="/dealer/company">
          Company Settings
        </Menu.Item>
        <Menu.Item leftSection={<IconSettings size={14} />} component={Link} href="/dealer/preferences">
          Preferences
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          leftSection={<IconLogout size={14} />}
          color="red"
          onClick={onLogout}
        >
          Sign Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  const NavigationLinks = () => (
    <Stack gap={0}>
      {navigationItems.map((item) => (
        <NavLink
          key={item.href}
          component={Link}
          href={item.href}
          label={item.label}
          leftSection={
            item.href === '/dealer/cart' && cartItemCount > 0 ? (
              <Indicator label={cartItemCount} size={16}>
                <item.icon size={20} />
              </Indicator>
            ) : (
              <item.icon size={20} />
            )
          }
          active={pathname === item.href}
          onClick={close}
        />
      ))}
    </Stack>
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'md' }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
            <Group>
              <IconBuilding size={24} />
              <Text size="lg" fw={700}>
                Dynamic AQS Dealer Portal
              </Text>
            </Group>
          </Group>

          <UserMenu />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" hiddenFrom="md">
        <NavigationLinks />
      </AppShell.Navbar>

      <AppShell.Navbar p="md" visibleFrom="md">
        <NavigationLinks />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="xs"
        hiddenFrom="md"
        title="Navigation"
      >
        <NavigationLinks />
      </Drawer>
    </AppShell>
  );
}
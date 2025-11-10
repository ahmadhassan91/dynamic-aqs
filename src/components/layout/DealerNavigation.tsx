'use client';

import { useState } from 'react';
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  rem,
  Stack,
} from '@mantine/core';
import {
  IconDashboard,
  IconShoppingCart,
  IconPackage,
  IconTruck,
  IconUser,
  IconSettings,
  IconReceipt,
  IconCreditCard,
  IconChevronRight,
  IconHome,
  IconBuilding,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from './Navigation.module.css';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  link?: string;
}

function LinksGroup({ icon: Icon, label, initiallyOpened, links, link }: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const pathname = usePathname();

  const items = (hasLinks ? links : []).map((linkItem) => (
    <Text
      component={Link}
      className={classes.link}
      href={linkItem.link}
      key={linkItem.label}
      data-active={pathname === linkItem.link || undefined}
    >
      {linkItem.label}
    </Text>
  ));

  if (!hasLinks && link) {
    return (
      <UnstyledButton
        component={Link}
        href={link}
        className={classes.control}
        data-active={pathname === link || undefined}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
        </Group>
      </UnstyledButton>
    );
  }

  return (
    <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? 'rotate(90deg)' : 'none',
                transition: 'transform 200ms ease',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

const dealerNavData = [
  { label: 'Dashboard', icon: IconHome, link: '/dealer/dashboard' },
  {
    label: 'Product Catalog',
    icon: IconPackage,
    links: [
      { label: 'Browse Products', link: '/dealer/catalog' },
      { label: 'Product Search', link: '/dealer/catalog/search' },
      { label: 'Favorites', link: '/dealer/catalog/favorites' },
    ],
  },
  {
    label: 'Orders',
    icon: IconShoppingCart,
    links: [
      { label: 'Shopping Cart', link: '/dealer/cart' },
      { label: 'Order History', link: '/dealer/orders' },
      { label: 'Track Orders', link: '/dealer/orders/tracking' },
    ],
  },
  {
    label: 'Shipments',
    icon: IconTruck,
    links: [
      { label: 'Active Shipments', link: '/dealer/shipments' },
      { label: 'Delivery Schedule', link: '/dealer/shipments/schedule' },
      { label: 'Shipping History', link: '/dealer/shipments/history' },
    ],
  },
  {
    label: 'Account',
    icon: IconUser,
    links: [
      { label: 'Account Overview', link: '/dealer/account' },
      { label: 'Profile Settings', link: '/dealer/profile' },
      { label: 'Billing & Payments', link: '/dealer/account/billing' },
    ],
  },
  {
    label: 'Invoices & Statements',
    icon: IconReceipt,
    links: [
      { label: 'Recent Invoices', link: '/dealer/invoices' },
      { label: 'Account Statements', link: '/dealer/statements' },
      { label: 'Payment History', link: '/dealer/payments' },
    ],
  },
  { label: 'Settings', icon: IconSettings, link: '/dealer/settings' },
];

export function DealerNavigation() {
  const links = dealerNavData.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Stack gap="xs">
      {links}
    </Stack>
  );
}
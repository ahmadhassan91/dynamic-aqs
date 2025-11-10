'use client';

import React, { useState } from 'react';
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
  IconUsers,
  IconUserPlus,
  IconSchool,
  IconDeviceMobile,
  IconShoppingCart,
  IconChartBar,
  IconBell,
  IconSettings,
  IconChevronRight,
  IconHome,
  IconFiles,
  IconBuildingStore,
  IconShield,
  IconMail,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from './Navigation.module.css';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string; external?: boolean }[];
  link?: string;
  external?: boolean;
}

function LinksGroup({ icon: Icon, label, initiallyOpened, links, link, external }: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const pathname = usePathname();
  
  // Enhanced active state detection
  const isGroupActive = () => {
    if (link && pathname === link) return true;
    if (hasLinks) {
      return links.some(linkItem => {
        if (linkItem.link === pathname) return true;
        // Check for nested paths (e.g., /customers/123 should activate /customers)
        return pathname.startsWith(linkItem.link + '/');
      });
    }
    return false;
  };

  const [opened, setOpened] = useState(initiallyOpened || isGroupActive());

  // Auto-open groups that contain active links
  React.useEffect(() => {
    if (isGroupActive() && !opened) {
      setOpened(true);
    }
  }, [pathname, opened]);

  const items = (hasLinks ? links : []).map((linkItem) => {
    const isLinkActive = pathname === linkItem.link || pathname.startsWith(linkItem.link + '/');
    
    if (linkItem.external) {
      return (
        <Text
          component="a"
          className={classes.link}
          href={linkItem.link}
          key={linkItem.label}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkItem.label}
        </Text>
      );
    }
    
    return (
      <Text
        component={Link}
        className={classes.link}
        href={linkItem.link}
        key={linkItem.label}
        data-active={isLinkActive || undefined}
      >
        {linkItem.label}
      </Text>
    );
  });

  if (!hasLinks && link) {
    const isActive = pathname === link || pathname.startsWith(link + '/');
    
    if (external) {
      return (
        <UnstyledButton
          component="a"
          href={link}
          className={classes.control}
          target="_blank"
          rel="noopener noreferrer"
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
      <UnstyledButton
        component={Link}
        href={link}
        className={classes.control}
        data-active={isActive || undefined}
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

  const groupActive = isGroupActive();

  return (
    <>
      <UnstyledButton 
        onClick={() => setOpened((o) => !o)} 
        className={classes.control}
        data-active={groupActive || undefined}
      >
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

const mockdata = [
  { label: 'Dashboard', icon: IconHome, link: '/' },
  {
    label: 'Customer Management',
    icon: IconUsers,
    links: [
      { label: 'Customer List', link: '/customers' },
      { label: 'Customer Activities', link: '/customers/activities' },
      { label: 'Territory Management', link: '/customers/territories' },
    ],
  },
  {
    label: 'Lead Management',
    icon: IconUserPlus,
    links: [
      { label: 'Lead Pipeline', link: '/leads' },
      { label: 'Onboarding', link: '/leads/onboarding' },
      { label: 'Discovery Calls', link: '/leads/discovery' },
    ],
  },
  {
    label: 'Training Management',
    icon: IconSchool,
    links: [
      { label: 'Training Dashboard', link: '/training' },
      { label: 'Schedule Training', link: '/training/schedule' },
      { label: 'Training Reports', link: '/training/reports' },
    ],
  },
  {
    label: 'Digital Assets',
    icon: IconFiles,
    links: [
      { label: 'Asset Library', link: '/assets' },
      { label: 'Asset Analytics', link: '/assets/analytics' },
      { label: 'Asset Workflow', link: '/assets/workflow' },
      { label: 'Asset Migration', link: '/assets/migration' },
    ],
  },
  {
    label: 'Commercial CRM',
    icon: IconBuildingStore,
    link: '/commercial',
    external: true,
  },
  { label: 'Mobile App', icon: IconDeviceMobile, link: '/mobile' },
  {
    label: 'Dealer Portal',
    icon: IconShoppingCart,
    link: '/dealer',
    external: true,
  },
  {
    label: 'Communication',
    icon: IconMail,
    links: [
      { label: 'Email Campaigns', link: '/email' },
      { label: 'Communication Hub', link: '/communication' },
      { label: 'Templates', link: '/communication/templates' },
    ],
  },
  {
    label: 'Reports & Analytics',
    icon: IconChartBar,
    links: [
      { label: 'Executive Overview', link: '/dashboard/executive' },
      { label: 'Executive Dashboard', link: '/reports/executive' },
      { label: 'Sales Reports', link: '/reports/sales' },
      { label: 'Custom Reports', link: '/reports/custom' },
    ],
  },
  {
    label: 'Administration',
    icon: IconShield,
    links: [
      { label: 'Admin Dashboard', link: '/admin' },
      { label: 'User Management', link: '/admin/users' },
      { label: 'System Health', link: '/admin/health' },
      { label: 'Integrations', link: '/admin/integrations' },
    ],
  },
  { label: 'Notifications', icon: IconBell, link: '/notifications' },
  { label: 'Settings', icon: IconSettings, link: '/settings' },
];

export function Navigation() {
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Stack gap="xs">
      {links}
    </Stack>
  );
}
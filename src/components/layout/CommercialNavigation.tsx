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
  IconBriefcase,
  IconUsers,
  IconBuilding,
  IconChartBar,
  IconReportAnalytics,
  IconCurrencyDollar,
  IconBell,
  IconChecklist,
  IconChevronRight,
  IconHome,
  IconSettings,
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
            <ThemeIcon variant="light" size={24}>
              <Icon style={{ width: rem(14), height: rem(14) }} />
            </ThemeIcon>
            <Box ml="sm" style={{ fontSize: rem(13) }}>{label}</Box>
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
            <ThemeIcon variant="light" size={24}>
              <Icon style={{ width: rem(14), height: rem(14) }} />
            </ThemeIcon>
            <Box ml="sm" style={{ fontSize: rem(13) }}>{label}</Box>
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

const commercialNavData = [
  { label: 'Dashboard', icon: IconHome, link: '/commercial' },
  {
    label: 'Opportunities',
    icon: IconBriefcase,
    links: [
      { label: 'All Opportunities', link: '/commercial/opportunities' },
      { label: 'Pipeline View', link: '/commercial/opportunities/pipeline' },
      { label: 'Create New', link: '/commercial/opportunities/new' },
    ],
  },
  {
    label: 'Engineer Contacts',
    icon: IconUsers,
    links: [
      { label: 'Contact Database', link: '/commercial/engineers' },
      { label: 'Relationship Tracker', link: '/commercial/engineers/relationships' },
      { label: 'Rating Management', link: '/commercial/engineers/ratings' },
    ],
  },
  {
    label: 'Organizations',
    icon: IconBuilding,
    links: [
      { label: 'Engineering Firms', link: '/commercial/organizations/firms' },
      { label: 'Manufacturer Reps', link: '/commercial/organizations/reps' },
      { label: 'Hierarchy View', link: '/commercial/organizations/hierarchy' },
    ],
  },
  {
    label: 'Market Analysis',
    icon: IconChartBar,
    links: [
      { label: 'Market Segments', link: '/commercial/market' },
      { label: 'Performance Analytics', link: '/commercial/market/analytics' },
      { label: 'Trends & Insights', link: '/commercial/market/trends' },
    ],
  },
  {
    label: 'Reports',
    icon: IconReportAnalytics,
    links: [
      { label: 'Commercial Dashboard', link: '/commercial/reports' },
      { label: 'Rep Performance', link: '/commercial/reports/reps' },
      { label: 'Custom Reports', link: '/commercial/reports/custom' },
    ],
  },
  {
    label: 'Pricing Tool',
    icon: IconCurrencyDollar,
    links: [
      { label: 'Quote Generator', link: '/commercial/pricing' },
      { label: 'Price Management', link: '/commercial/pricing/management' },
      { label: 'Integration Status', link: '/commercial/pricing/integration' },
    ],
  },
  {
    label: 'Tasks & Workflow',
    icon: IconChecklist,
    links: [
      { label: 'Task Generator', link: '/commercial/tasks' },
      { label: 'Workflow Management', link: '/commercial/workflow' },
      { label: 'Automated Actions', link: '/commercial/automation' },
    ],
  },
  { label: 'Notifications', icon: IconBell, link: '/commercial/notifications' },
  { label: 'Settings', icon: IconSettings, link: '/commercial/settings' },
];

export function CommercialNavigation() {
  const links = commercialNavData.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Stack gap={2}>
      {links}
    </Stack>
  );
}
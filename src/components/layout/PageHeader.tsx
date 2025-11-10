'use client';

import React from 'react';
import {
  Group,
  Title,
  Text,
  Breadcrumbs,
  Anchor,
  ActionIcon,
  Button,
  Stack,
  Divider,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useNavigation, useBackNavigation } from './NavigationContext';
import { ResponsiveActions } from './ResponsiveActions';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'filled' | 'outline' | 'light' | 'subtle';
  color?: string;
  disabled?: boolean;
  priority?: 'primary' | 'secondary' | 'tertiary';
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  backButton?: {
    href: string;
    label?: string;
  };
  actions?: QuickAction[];
  children?: React.ReactNode;
  showDivider?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  backButton,
  actions = [],
  children,
  showDivider = true,
}: PageHeaderProps) {
  const { navigationState } = useNavigation();
  const autoBackButton = useBackNavigation();

  // Use provided breadcrumbs or fall back to navigation context
  const effectiveBreadcrumbs = breadcrumbs || navigationState.breadcrumbs;
  
  // Use provided back button or auto-generate one
  const effectiveBackButton = backButton || (effectiveBreadcrumbs.length > 1 ? autoBackButton : undefined);

  const renderBreadcrumbs = () => {
    if (!effectiveBreadcrumbs || effectiveBreadcrumbs.length === 0) return null;

    return (
      <Breadcrumbs mb="xs">
        {effectiveBreadcrumbs.map((item, index) => {
          if (!item.href || index === effectiveBreadcrumbs.length - 1) {
            return (
              <Text key={index} c="dimmed" size="sm">
                {item.label}
              </Text>
            );
          }
          
          return (
            <Anchor
              key={index}
              component={Link}
              href={item.href}
              size="sm"
              c="blue"
            >
              {item.label}
            </Anchor>
          );
        })}
      </Breadcrumbs>
    );
  };

  const renderActions = () => {
    if (actions.length === 0) return null;

    return (
      <ResponsiveActions
        actions={actions}
        mobileMaxVisible={1}
        tabletMaxVisible={3}
        desktopMaxVisible={5}
      />
    );
  };

  return (
    <Stack gap="md" mb="lg">
      {/* Breadcrumbs */}
      {renderBreadcrumbs()}

      {/* Main Header */}
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start" gap="md">
          {/* Back Button */}
          {effectiveBackButton && (
            <ActionIcon
              component={Link}
              href={effectiveBackButton.href}
              variant="subtle"
              size="lg"
              aria-label={effectiveBackButton.label || 'Go back'}
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
          )}

          {/* Title and Subtitle */}
          <Stack gap="xs">
            <Title order={1} size="h2">
              {title}
            </Title>
            {subtitle && (
              <Text size="sm" c="dimmed">
                {subtitle}
              </Text>
            )}
          </Stack>
        </Group>

        {/* Actions */}
        {renderActions()}
      </Group>

      {/* Custom Children Content */}
      {children}

      {/* Divider */}
      {showDivider && <Divider />}
    </Stack>
  );
}

// Convenience component for common residential page patterns
export interface ResidentialPageHeaderProps extends Omit<PageHeaderProps, 'breadcrumbs'> {
  section?: 'customers' | 'leads' | 'training' | 'territories' | 'activities';
  subsection?: string;
  customBreadcrumbs?: BreadcrumbItem[];
}

export function ResidentialPageHeader({
  section,
  subsection,
  customBreadcrumbs,
  ...props
}: ResidentialPageHeaderProps) {
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customBreadcrumbs) return customBreadcrumbs;

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/' },
    ];

    if (section) {
      const sectionMap = {
        customers: { label: 'Customers', href: '/customers' },
        leads: { label: 'Leads', href: '/leads' },
        training: { label: 'Training', href: '/training' },
        territories: { label: 'Territories', href: '/customers/territories' },
        activities: { label: 'Activities', href: '/customers/activities' },
      };

      const sectionInfo = sectionMap[section];
      if (sectionInfo) {
        breadcrumbs.push(sectionInfo);
      }
    }

    if (subsection) {
      breadcrumbs.push({ label: subsection, active: true });
    }

    return breadcrumbs;
  };

  return (
    <PageHeader
      {...props}
      breadcrumbs={generateBreadcrumbs()}
    />
  );
}
'use client';

import React from 'react';
import {
  Group,
  Button,
  ActionIcon,
  Menu,
  Paper,
  Stack,
  Text,
  Divider,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDownload,
  IconShare,
  IconPrinter,
  IconDots,
  IconPhone,
  IconMail,
  IconCalendar,
  IconFileText,
  IconMapPin,
  IconSchool,
  IconShoppingCart,
  IconNotes,
} from '@tabler/icons-react';
import Link from 'next/link';

export interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'filled' | 'outline' | 'light' | 'subtle' | 'default';
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  priority?: 'primary' | 'secondary' | 'tertiary';
  external?: boolean;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  maxVisible?: number;
  orientation?: 'horizontal' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'buttons' | 'menu' | 'mixed';
  className?: string;
}

export function QuickActions({
  actions,
  maxVisible = 4,
  orientation = 'horizontal',
  size = 'sm',
  variant = 'mixed',
  className,
}: QuickActionsProps) {
  // Sort actions by priority
  const sortedActions = [...actions].sort((a, b) => {
    const priorityOrder = { primary: 0, secondary: 1, tertiary: 2 };
    const aPriority = priorityOrder[a.priority || 'secondary'];
    const bPriority = priorityOrder[b.priority || 'secondary'];
    return aPriority - bPriority;
  });

  const visibleActions = sortedActions.slice(0, maxVisible);
  const hiddenActions = sortedActions.slice(maxVisible);

  const renderAction = (action: QuickAction, isInMenu = false) => {
    const buttonProps = {
      variant: action.variant || (action.priority === 'primary' ? 'filled' : 'outline'),
      color: action.color,
      disabled: action.disabled,
      loading: action.loading,
      size: isInMenu ? 'sm' : size,
      leftSection: action.icon,
    };

    if (action.href) {
      if (action.external) {
        return (
          <Button
            key={action.id}
            {...buttonProps}
            component="a"
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {action.label}
          </Button>
        );
      }
      
      return (
        <Button
          key={action.id}
          {...buttonProps}
          component={Link}
          href={action.href}
        >
          {action.label}
        </Button>
      );
    }

    return (
      <Button
        key={action.id}
        {...buttonProps}
        onClick={action.onClick}
      >
        {action.label}
      </Button>
    );
  };

  const renderMenuAction = (action: QuickAction) => {
    if (action.href) {
      if (action.external) {
        return (
          <Menu.Item
            key={action.id}
            leftSection={action.icon}
            disabled={action.disabled}
            component="a"
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {action.label}
          </Menu.Item>
        );
      }
      
      return (
        <Menu.Item
          key={action.id}
          leftSection={action.icon}
          disabled={action.disabled}
          component={Link}
          href={action.href}
        >
          {action.label}
        </Menu.Item>
      );
    }

    return (
      <Menu.Item
        key={action.id}
        leftSection={action.icon}
        onClick={action.onClick}
        disabled={action.disabled}
      >
        {action.label}
      </Menu.Item>
    );
  };

  if (variant === 'menu') {
    return (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="outline" size={size}>
            <IconDots size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {actions.map(renderMenuAction)}
        </Menu.Dropdown>
      </Menu>
    );
  }

  if (variant === 'buttons') {
    const Container = orientation === 'vertical' ? Stack : Group;
    return (
      <Container gap="sm" className={className}>
        {actions.map(action => renderAction(action))}
      </Container>
    );
  }

  // Mixed variant (default)
  const Container = orientation === 'vertical' ? Stack : Group;
  
  return (
    <Container gap="sm" className={className}>
      {visibleActions.map(action => renderAction(action))}
      
      {hiddenActions.length > 0 && (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="outline" size={size}>
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {hiddenActions.map(renderMenuAction)}
          </Menu.Dropdown>
        </Menu>
      )}
    </Container>
  );
}

// Predefined action sets for common scenarios
export const CommonActions = {
  // Customer-related actions
  customer: {
    call: (onClick?: () => void): QuickAction => ({
      id: 'call',
      label: 'Call Customer',
      icon: <IconPhone size={16} />,
      onClick,
      priority: 'primary',
    }),
    email: (onClick?: () => void): QuickAction => ({
      id: 'email',
      label: 'Send Email',
      icon: <IconMail size={16} />,
      onClick,
      priority: 'primary',
    }),
    schedule: (onClick?: () => void): QuickAction => ({
      id: 'schedule',
      label: 'Schedule Training',
      icon: <IconCalendar size={16} />,
      onClick,
      priority: 'secondary',
    }),
    quote: (onClick?: () => void): QuickAction => ({
      id: 'quote',
      label: 'Create Quote',
      icon: <IconFileText size={16} />,
      onClick,
      priority: 'secondary',
    }),
    route: (onClick?: () => void): QuickAction => ({
      id: 'route',
      label: 'Plan Route',
      icon: <IconMapPin size={16} />,
      onClick,
      priority: 'tertiary',
    }),
  },

  // CRUD actions
  crud: {
    create: (label = 'Create', onClick?: () => void, href?: string): QuickAction => ({
      id: 'create',
      label,
      icon: <IconPlus size={16} />,
      onClick,
      href,
      priority: 'primary',
      variant: 'filled',
    }),
    edit: (label = 'Edit', onClick?: () => void, href?: string): QuickAction => ({
      id: 'edit',
      label,
      icon: <IconEdit size={16} />,
      onClick,
      href,
      priority: 'secondary',
    }),
    delete: (label = 'Delete', onClick?: () => void): QuickAction => ({
      id: 'delete',
      label,
      icon: <IconTrash size={16} />,
      onClick,
      priority: 'tertiary',
      color: 'red',
      variant: 'outline',
    }),
  },

  // Export/Share actions
  export: {
    download: (onClick?: () => void): QuickAction => ({
      id: 'download',
      label: 'Download',
      icon: <IconDownload size={16} />,
      onClick,
      priority: 'tertiary',
    }),
    print: (onClick?: () => void): QuickAction => ({
      id: 'print',
      label: 'Print',
      icon: <IconPrinter size={16} />,
      onClick,
      priority: 'tertiary',
    }),
    share: (onClick?: () => void): QuickAction => ({
      id: 'share',
      label: 'Share',
      icon: <IconShare size={16} />,
      onClick,
      priority: 'tertiary',
    }),
  },

  // Activity actions
  activity: {
    logActivity: (onClick?: () => void): QuickAction => ({
      id: 'log-activity',
      label: 'Log Activity',
      icon: <IconPlus size={16} />,
      onClick,
      priority: 'primary',
    }),
    addNote: (onClick?: () => void): QuickAction => ({
      id: 'add-note',
      label: 'Add Note',
      icon: <IconNotes size={16} />,
      onClick,
      priority: 'secondary',
    }),
    scheduleTraining: (onClick?: () => void): QuickAction => ({
      id: 'schedule-training',
      label: 'Schedule Training',
      icon: <IconSchool size={16} />,
      onClick,
      priority: 'secondary',
    }),
    createOrder: (onClick?: () => void): QuickAction => ({
      id: 'create-order',
      label: 'Create Order',
      icon: <IconShoppingCart size={16} />,
      onClick,
      priority: 'secondary',
    }),
  },
};

// Quick Actions Bar component for consistent placement
export interface QuickActionsBarProps extends QuickActionsProps {
  title?: string;
  withPaper?: boolean;
}

export function QuickActionsBar({
  title,
  withPaper = true,
  actions,
  ...props
}: QuickActionsBarProps) {
  const content = (
    <Stack gap="sm">
      {title && (
        <>
          <Text fw={600} size="sm">
            {title}
          </Text>
          <Divider />
        </>
      )}
      <QuickActions actions={actions} {...props} />
    </Stack>
  );

  if (withPaper) {
    return (
      <Paper p="md" withBorder>
        {content}
      </Paper>
    );
  }

  return content;
}
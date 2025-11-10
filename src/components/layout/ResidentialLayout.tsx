'use client';

import React from 'react';
import { Container, Stack } from '@mantine/core';
import { AppLayout } from './AppLayout';
import { PageHeader, type PageHeaderProps } from './PageHeader';

export interface ResidentialLayoutProps {
  children: React.ReactNode;
  header?: PageHeaderProps;
  containerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  withContainer?: boolean;
  className?: string;
}

export function ResidentialLayout({
  children,
  header,
  containerSize = 'xl',
  withContainer = true,
  className,
}: ResidentialLayoutProps) {
  const content = (
    <div className={`residential-content-container ${className || ''}`}>
      <Stack gap="lg">
        {header && <PageHeader {...header} />}
        {children}
      </Stack>
    </div>
  );

  if (withContainer) {
    return (
      <AppLayout>
        <Container size={containerSize} py="md">
          {content}
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {content}
    </AppLayout>
  );
}

// Convenience wrapper for pages that need minimal setup
export interface SimpleResidentialPageProps {
  title: string;
  subtitle?: string;
  section?: 'customers' | 'leads' | 'training' | 'territories' | 'activities';
  subsection?: string;
  actions?: PageHeaderProps['actions'];
  backButton?: PageHeaderProps['backButton'];
  children: React.ReactNode;
}

export function SimpleResidentialPage({
  title,
  subtitle,
  section,
  subsection,
  actions,
  backButton,
  children,
}: SimpleResidentialPageProps) {
  const breadcrumbs = [];
  
  // Generate breadcrumbs based on section
  breadcrumbs.push({ label: 'Dashboard', href: '/' });
  
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

  return (
    <ResidentialLayout
      header={{
        title,
        subtitle,
        breadcrumbs,
        actions,
        backButton,
      }}
    >
      {children}
    </ResidentialLayout>
  );
}
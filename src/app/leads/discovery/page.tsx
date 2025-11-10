'use client';

import React from 'react';
import { Title, Text, Stack, Breadcrumbs, Anchor } from '@mantine/core';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { DiscoveryCallManager } from '@/components/leads/DiscoveryCallManager';
import { ClientOnlyWrapper } from '@/components/ui/ClientOnlyWrapper';

export default function LeadsDiscoveryPage() {
  return (
    <AppLayout>
      <div className="residential-content-container">
        <Stack gap="md">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs>
            <Anchor component={Link} href="/leads">
              Leads
            </Anchor>
            <Text>Discovery Calls</Text>
          </Breadcrumbs>
          
          {/* Page Header */}
          <div>
            <Title order={1}>Discovery Calls</Title>
            <Text size="sm" c="dimmed">
              Manage discovery calls and track lead qualification progress
            </Text>
          </div>
          
          {/* Main Content */}
          <ClientOnlyWrapper>
            <DiscoveryCallManager />
          </ClientOnlyWrapper>
        </Stack>
      </div>
    </AppLayout>
  );
}
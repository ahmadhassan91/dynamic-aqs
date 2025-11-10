'use client';

import React from 'react';
import { Title, Text, Stack, Breadcrumbs, Anchor } from '@mantine/core';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { ConversionAnalytics } from '@/components/leads/ConversionAnalytics';

export default function LeadAnalyticsPage() {
  return (
    <AppLayout>
      <div className="residential-content-container">
        <Stack gap="md">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs>
            <Anchor component={Link} href="/leads">
              Leads
            </Anchor>
            <Text>Analytics</Text>
          </Breadcrumbs>
          
          {/* Page Header */}
          <div>
            <Title order={1}>Lead Conversion Analytics</Title>
            <Text size="lg" c="dimmed">
              Analyze conversion performance, track trends, and identify optimization opportunities
            </Text>
          </div>
          
          {/* Main Content */}
          <ConversionAnalytics />
        </Stack>
      </div>
    </AppLayout>
  );
}
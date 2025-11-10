'use client';

import React from 'react';
import { Title, Text, Stack, Breadcrumbs, Anchor } from '@mantine/core';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { LeadConversionWorkflow } from '@/components/leads/LeadConversionWorkflow';

export default function LeadConvertPage() {
  return (
    <AppLayout>
      <div className="residential-content-container">
        <Stack gap="md">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs>
            <Anchor component={Link} href="/leads">
              Leads
            </Anchor>
            <Text>Convert</Text>
          </Breadcrumbs>
          
          {/* Page Header */}
          <div>
            <Title order={1}>Lead to Customer Conversion</Title>
            <Text size="lg" c="dimmed">
              Convert qualified leads into active customers with automated workflow
            </Text>
          </div>
          
          {/* Main Content */}
          <LeadConversionWorkflow />
        </Stack>
      </div>
    </AppLayout>
  );
}
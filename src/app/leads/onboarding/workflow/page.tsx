'use client';

import React from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';
import { AppLayout } from '@/components/layout/AppLayout';
import { OnboardingWorkflowInitiation } from '@/components/leads/OnboardingWorkflowInitiation';

export default function OnboardingWorkflowPage() {
  return (
    <AppLayout>
      <Container size="xl" py="md">
        <Stack gap="md">
          <div>
            <Title order={1}>Onboarding Workflow Management</Title>
            <Text size="lg" c="dimmed">
              Manage onboarding workflow templates and track customer onboarding progress
            </Text>
          </div>
          
          <OnboardingWorkflowInitiation />
        </Stack>
      </Container>
    </AppLayout>
  );
}
'use client';

import React from 'react';
import { IconPlus, IconFileText, IconCalendar } from '@tabler/icons-react';
import { SimpleResidentialPage } from '@/components/layout/ResidentialLayout';
import { OnboardingWorkflow } from '@/components/leads/OnboardingWorkflow';
import { ClientOnlyWrapper } from '@/components/ui/ClientOnlyWrapper';

export default function LeadsOnboardingPage() {
  const actions = [
    {
      id: 'new-lead',
      label: 'New Lead',
      icon: <IconPlus size={16} />,
      onClick: () => console.log('Create new lead'),
      priority: 'primary' as const,
      variant: 'filled' as const,
    },
    {
      id: 'schedule-call',
      label: 'Schedule Call',
      icon: <IconCalendar size={16} />,
      onClick: () => console.log('Schedule discovery call'),
      priority: 'secondary' as const,
    },
    {
      id: 'export-report',
      label: 'Export Report',
      icon: <IconFileText size={16} />,
      onClick: () => console.log('Export onboarding report'),
      priority: 'tertiary' as const,
    },
  ];

  return (
    <SimpleResidentialPage
      title="Lead Onboarding"
      subtitle="Manage the customer onboarding process and track progress"
      section="leads"
      subsection="Onboarding"
      actions={actions}
    >
      <ClientOnlyWrapper>
        <OnboardingWorkflow />
      </ClientOnlyWrapper>
    </SimpleResidentialPage>
  );
}
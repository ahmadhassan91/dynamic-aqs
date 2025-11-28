'use client';

import React from 'react';
import { Title, Text, Stack, Alert, List } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { CommercialLayout } from '@/components/layout/CommercialLayout';
import WorkflowManagementSystem from '@/components/commercial/WorkflowManagementSystem';

export default function WorkflowPage() {
  return (
    <CommercialLayout>
      <Stack gap="lg">
        <div>
          <Title order={2}>Commercial Workflow Management</Title>
          <Text c="dimmed">
            Design, configure, and monitor automated workflows for commercial processes
          </Text>
        </div>

        <Alert variant="light" color="blue" icon={<IconInfoCircle size={20} />} title="What is Workflow Automation?">
          <Text size="sm" mb="xs">
            Workflow automation helps you systematically build and maintain relationships with engineers through proven sequences of interactions. Instead of manually tracking when to call, email, or meet with contacts, workflows guide you through structured touchpoints designed to achieve specific outcomes.
          </Text>
          <Text size="sm" fw={500} mb="xs">Common Workflow Types:</Text>
          <List size="sm" spacing="xs">
            <List.Item>
              <strong>Rating Improvement:</strong> Convert unfavorable engineers into champions through systematic engagement
            </List.Item>
            <List.Item>
              <strong>New Contact Onboarding:</strong> Structured introduction sequence for new relationships
            </List.Item>
            <List.Item>
              <strong>Opportunity Development:</strong> Nurture leads toward concrete projects with strategic touchpoints
            </List.Item>
            <List.Item>
              <strong>Relationship Maintenance:</strong> Regular check-ins to maintain positive ratings and engagement
            </List.Item>
          </List>
          <Text size="sm" mt="xs" c="dimmed">
            Each workflow tracks progress, measures effectiveness, and provides data-driven insights to improve your commercial outcomes.
          </Text>
        </Alert>
        
        <WorkflowManagementSystem />
      </Stack>
    </CommercialLayout>
  );
}
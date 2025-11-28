'use client';

import React from 'react';
import { Title, Text, Stack, Group } from '@mantine/core';
import { CommercialLayout } from '@/components/layout/CommercialLayout';
import TaskGenerator from '@/components/commercial/TaskGenerator';

export default function TasksPage() {
  return (
    <CommercialLayout>
      <Stack gap="lg">
        <div>
          <Title order={2}>Commercial Task Automation</Title>
          <Text c="dimmed">
            AI-generated tasks to improve engineer relationships and drive opportunity development
          </Text>
        </div>
        
        <TaskGenerator />
      </Stack>
    </CommercialLayout>
  );
}
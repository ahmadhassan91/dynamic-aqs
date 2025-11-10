'use client';

import { useState, useEffect } from 'react';
import { Title, Text, Stack, Breadcrumbs, Anchor } from '@mantine/core';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { ActivityReports } from '@/components/activities/ActivityReports';
import { activityService, initializeMockActivities } from '@/lib/services/activityService';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import type { Activity } from '@/components/activities/ActivityTimeline';

export default function ActivityReportsPage() {
  const { customers, users } = useMockData();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Initialize mock activities if not already done
    const customerIds = customers.map(c => c.id);
    const customerNames = customers.map(c => c.companyName);
    initializeMockActivities(customerIds, customerNames);
    
    // Get all activities
    const allActivities = activityService.getAllActivities();
    setActivities(allActivities);
  }, [customers]);

  return (
    <AppLayout>
      <div className="residential-content-container">
        <Stack gap="lg">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs>
            <Anchor component={Link} href="/customers">
              Customers
            </Anchor>
            <Anchor component={Link} href="/customers/activities">
              Activities
            </Anchor>
            <Text>Reports</Text>
          </Breadcrumbs>
          
          {/* Page Header */}
          <div>
            <Title order={1}>Activity Reports & Analytics</Title>
            <Text c="dimmed" size="lg">
              Comprehensive insights into customer activity patterns and performance metrics
            </Text>
          </div>

          {/* Main Content */}
          <ActivityReports 
            activities={activities}
            customers={customers}
            users={users.map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}` }))}
          />
        </Stack>
      </div>
    </AppLayout>
  );
}
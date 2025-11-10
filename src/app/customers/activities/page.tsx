'use client';

import { AllActivitiesView } from '@/components/activities/AllActivitiesView';
import { AppLayout } from '@/components/layout/AppLayout';

export default function CustomerActivitiesPage() {
  return (
    <AppLayout>
      <AllActivitiesView />
    </AppLayout>
  );
}
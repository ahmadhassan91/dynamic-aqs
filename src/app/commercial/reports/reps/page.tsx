'use client';

import { CommercialLayout } from '@/components/layout/CommercialLayout';
import { RepPerformanceDashboard } from '@/components/commercial/RepPerformanceDashboard';

export default function RepPerformancePage() {
  return (
    <CommercialLayout>
      <RepPerformanceDashboard />
    </CommercialLayout>
  );
}
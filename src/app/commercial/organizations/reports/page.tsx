'use client';

import React from 'react';
import { CommercialLayout } from '@/components/layout/CommercialLayout';
import ConsolidatedReportingView from '@/components/commercial/ConsolidatedReportingView';

export default function OrganizationReportsPage() {
  return (
    <CommercialLayout>
      <div className="residential-content-container">
        <ConsolidatedReportingView />
      </div>
    </CommercialLayout>
  );
}
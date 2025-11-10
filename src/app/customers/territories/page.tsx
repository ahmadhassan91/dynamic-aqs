'use client';

import { TerritoryManagement } from '@/components/territories/TerritoryManagement';
import { AppLayout } from '@/components/layout/AppLayout';

export default function CustomerTerritoriesPage() {
  return (
    <AppLayout>
      <TerritoryManagement />
    </AppLayout>
  );
}
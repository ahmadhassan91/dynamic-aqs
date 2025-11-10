'use client';

import { CustomerList } from '@/components/customers/CustomerList';
import { AppLayout } from '@/components/layout/AppLayout';

export default function CustomersPage() {
  return (
    <AppLayout>
      <CustomerList />
    </AppLayout>
  );
}
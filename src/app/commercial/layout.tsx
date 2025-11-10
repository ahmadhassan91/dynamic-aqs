'use client';

import { CommercialLayout as CommercialLayoutComponent } from '@/components/layout/CommercialLayout';

export default function CommercialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommercialLayoutComponent>{children}</CommercialLayoutComponent>;
}

'use client';

import { lazy, Suspense } from 'react';
import { LoadingSpinner, DashboardSkeleton, CardSkeleton, TableSkeleton } from '@/components/ui/LoadingStates';

// Lazy load heavy dashboard components
export const LazyExecutiveDashboard = lazy(() => 
  import('@/components/reports/ExecutiveDashboard').then(module => ({ 
    default: module.ExecutiveDashboard 
  }))
);

export const LazyCustomReportBuilder = lazy(() => 
  import('@/components/reports/CustomReportBuilder').then(module => ({ 
    default: module.CustomReportBuilder 
  }))
);

export const LazyTrainingDashboard = lazy(() => 
  import('@/components/training/TrainingDashboard').then(module => ({ 
    default: module.TrainingDashboard 
  }))
);

export const LazyLeadPipeline = lazy(() => 
  import('@/components/leads/LeadPipeline').then(module => ({ 
    default: module.LeadPipeline 
  }))
);

export const LazyCustomerList = lazy(() => 
  import('@/components/customers/CustomerList').then(module => ({ 
    default: module.CustomerList 
  }))
);

export const LazyProductCatalog = lazy(() => 
  import('@/components/dealer/ProductCatalog').then(module => ({ 
    default: module.ProductCatalog 
  }))
);

export const LazyUserManagementDashboard = lazy(() => 
  import('@/components/admin/UserManagementDashboard')
);

export const LazyIntegrationSimulationDashboard = lazy(() => 
  import('@/components/admin/IntegrationSimulationDashboard')
);

// Wrapper components with appropriate loading states
export function ExecutiveDashboardWithSuspense() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <LazyExecutiveDashboard />
    </Suspense>
  );
}

export function CustomReportBuilderWithSuspense() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <LazyCustomReportBuilder />
    </Suspense>
  );
}

export function TrainingDashboardWithSuspense() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <LazyTrainingDashboard />
    </Suspense>
  );
}

export function LeadPipelineWithSuspense() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <LazyLeadPipeline />
    </Suspense>
  );
}

export function CustomerListWithSuspense() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <LazyCustomerList />
    </Suspense>
  );
}

interface ProductCatalogWithSuspenseProps {
  products: any[];
  cartItems: any[];
  onAddToCart: (product: any, quantity: number) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onViewProduct: (product: any) => void;
  comparisonProducts: any[];
  onAddToComparison: (product: any) => void;
  onRemoveFromComparison: (productId: string) => void;
  onOpenComparison: () => void;
}

export function ProductCatalogWithSuspense(props: ProductCatalogWithSuspenseProps) {
  return (
    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>}>
      <LazyProductCatalog {...props} />
    </Suspense>
  );
}

export function UserManagementDashboardWithSuspense() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <LazyUserManagementDashboard />
    </Suspense>
  );
}

export function IntegrationSimulationDashboardWithSuspense() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <LazyIntegrationSimulationDashboard />
    </Suspense>
  );
}

// Generic lazy wrapper
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyWrapper({ children, fallback = <LoadingSpinner size="lg" /> }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}
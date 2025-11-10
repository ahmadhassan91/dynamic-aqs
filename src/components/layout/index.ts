// Layout Components
export { AppLayout } from './AppLayout';
export { Navigation } from './Navigation';

// Page Structure Components
export { PageHeader, ResidentialPageHeader } from './PageHeader';
export { ResidentialLayout, SimpleResidentialPage } from './ResidentialLayout';

// Navigation Context
export { NavigationProvider, useNavigation, useBackNavigation } from './NavigationContext';

// Action Components
export { QuickActions, QuickActionsBar, CommonActions } from './QuickActions';
export { ResponsiveActions, useResponsiveActions } from './ResponsiveActions';

// Types
export type { BreadcrumbItem, QuickAction, PageHeaderProps } from './PageHeader';
export type { ResidentialLayoutProps, SimpleResidentialPageProps } from './ResidentialLayout';
export type { NavigationState, NavigationContextType } from './NavigationContext';
export type { QuickActionsProps, QuickActionsBarProps } from './QuickActions';
export type { ResponsiveActionsProps } from './ResponsiveActions';
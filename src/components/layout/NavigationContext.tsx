'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export interface NavigationState {
  currentSection: string | null;
  currentSubsection: string | null;
  breadcrumbs: Array<{ label: string; href?: string }>;
  pageTitle: string | null;
}

export interface NavigationContextType {
  navigationState: NavigationState;
  setNavigationState: (state: Partial<NavigationState>) => void;
  updateFromPath: (pathname: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const pathname = usePathname();
  const [navigationState, setNavigationStateInternal] = useState<NavigationState>({
    currentSection: null,
    currentSubsection: null,
    breadcrumbs: [],
    pageTitle: null,
  });

  const setNavigationState = (state: Partial<NavigationState>) => {
    setNavigationStateInternal(prev => ({ ...prev, ...state }));
  };

  const updateFromPath = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length === 0) {
      setNavigationState({
        currentSection: 'dashboard',
        currentSubsection: null,
        breadcrumbs: [{ label: 'Dashboard', href: '/' }],
        pageTitle: 'Dashboard',
      });
      return;
    }

    const section = segments[0];
    const subsection = segments[1];

    // Map sections to readable names
    const sectionMap: Record<string, string> = {
      customers: 'Customer Management',
      leads: 'Lead Management',
      training: 'Training Management',
      assets: 'Digital Assets',
      commercial: 'Commercial CRM',
      dealer: 'Dealer Portal',
      communication: 'Communication',
      reports: 'Reports & Analytics',
      admin: 'Administration',
      notifications: 'Notifications',
      settings: 'Settings',
      mobile: 'Mobile App',
      email: 'Email Campaigns',
      dashboard: 'Dashboard',
    };

    // Generate breadcrumbs based on path
    const breadcrumbs = [{ label: 'Dashboard', href: '/' }];
    
    if (section && sectionMap[section]) {
      breadcrumbs.push({ 
        label: sectionMap[section], 
        href: `/${section}` 
      });
    }

    // Subsection mapping
    const subsectionMap: Record<string, Record<string, string>> = {
      customers: {
        activities: 'Customer Activities',
        territories: 'Territory Management',
      },
      leads: {
        onboarding: 'Lead Onboarding',
        discovery: 'Discovery Calls',
        convert: 'Lead Conversion',
        analytics: 'Lead Analytics',
      },
      training: {
        schedule: 'Schedule Training',
        reports: 'Training Reports',
        'customer-integration': 'Customer Integration',
      },
      assets: {
        analytics: 'Asset Analytics',
        workflow: 'Asset Workflow',
        migration: 'Asset Migration',
      },
      communication: {
        templates: 'Communication Templates',
        escalations: 'Escalation Management',
        unified: 'Unified Communication',
      },
      reports: {
        executive: 'Executive Reports',
        sales: 'Sales Reports',
        custom: 'Custom Reports',
      },
      admin: {
        users: 'User Management',
        health: 'System Health',
        integrations: 'Integrations',
      },
    };

    // Handle specific subsection patterns
    if (subsection) {
      const subsectionName = subsectionMap[section]?.[subsection] || subsection;
      breadcrumbs.push({ 
        label: subsectionName,
        href: `/${section}/${subsection}`
      });
    }

    // Handle dynamic routes (e.g., /customers/[id])
    if (segments.length > 2 && !subsectionMap[section]?.[subsection]) {
      // This is likely a dynamic route
      const dynamicPath = segments.slice(0, 3).join('/');
      breadcrumbs.push({ 
        label: 'Details',
        href: `/${dynamicPath}`
      });
    }

    setNavigationState({
      currentSection: section,
      currentSubsection: subsection,
      breadcrumbs,
      pageTitle: breadcrumbs[breadcrumbs.length - 1]?.label || 'Page',
    });
  };

  // Update navigation state when pathname changes
  useEffect(() => {
    updateFromPath(pathname);
  }, [pathname]);

  return (
    <NavigationContext.Provider
      value={{
        navigationState,
        setNavigationState,
        updateFromPath,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

// Hook for getting back navigation info
export function useBackNavigation() {
  const { navigationState } = useNavigation();
  const pathname = usePathname();

  const getBackNavigation = () => {
    const segments = pathname.split('/').filter(Boolean);
    
    // If we're on a detail page (e.g., /customers/123), go back to list
    if (segments.length >= 2) {
      const parentPath = `/${segments.slice(0, -1).join('/')}`;
      const parentLabel = navigationState.breadcrumbs[navigationState.breadcrumbs.length - 2]?.label;
      
      return {
        href: parentPath,
        label: `Back to ${parentLabel || 'Previous Page'}`,
      };
    }

    // If we're on a subsection, go back to main section
    if (segments.length === 2) {
      return {
        href: `/${segments[0]}`,
        label: `Back to ${navigationState.breadcrumbs[navigationState.breadcrumbs.length - 2]?.label || 'Previous Page'}`,
      };
    }

    // Default to dashboard
    return {
      href: '/',
      label: 'Back to Dashboard',
    };
  };

  return getBackNavigation();
}
'use client';

import React from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { QuickActions, type QuickAction } from './QuickActions';

export interface ResponsiveActionsProps {
  actions: QuickAction[];
  breakpoints?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  mobileMaxVisible?: number;
  tabletMaxVisible?: number;
  desktopMaxVisible?: number;
  className?: string;
}

export function ResponsiveActions({
  actions,
  breakpoints = {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
  },
  mobileMaxVisible = 1,
  tabletMaxVisible = 3,
  desktopMaxVisible = 5,
  className,
}: ResponsiveActionsProps) {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.mobile}px)`);
  const isTablet = useMediaQuery(`(max-width: ${breakpoints.tablet}px)`);
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.desktop}px)`);

  // Determine max visible actions based on screen size
  let maxVisible = desktopMaxVisible;
  let size: 'xs' | 'sm' | 'md' | 'lg' = 'sm';

  if (isMobile) {
    maxVisible = mobileMaxVisible;
    size = 'xs';
  } else if (isTablet) {
    maxVisible = tabletMaxVisible;
    size = 'sm';
  } else if (isDesktop) {
    maxVisible = desktopMaxVisible;
    size = 'md';
  }

  return (
    <QuickActions
      actions={actions}
      maxVisible={maxVisible}
      size={size}
      variant="mixed"
      className={className}
    />
  );
}

// Hook for managing responsive action behavior
export function useResponsiveActions() {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  const getActionConfig = () => {
    if (isMobile) {
      return {
        maxVisible: 1,
        size: 'xs' as const,
        orientation: 'horizontal' as const,
        variant: 'mixed' as const,
      };
    }

    if (isTablet) {
      return {
        maxVisible: 3,
        size: 'sm' as const,
        orientation: 'horizontal' as const,
        variant: 'mixed' as const,
      };
    }

    return {
      maxVisible: 5,
      size: 'sm' as const,
      orientation: 'horizontal' as const,
      variant: 'mixed' as const,
    };
  };

  return {
    isMobile,
    isTablet,
    actionConfig: getActionConfig(),
  };
}
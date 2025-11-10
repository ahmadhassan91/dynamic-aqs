'use client';

import { useEffect, useState, ReactNode } from 'react';
import { Loader, Center, Box } from '@mantine/core';

interface ClientOnlyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  suppressHydrationWarning?: boolean;
}

export function ClientOnlyWrapper({ 
  children, 
  fallback,
  suppressHydrationWarning = true 
}: ClientOnlyWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback || (
      <Center h={200}>
        <Loader size="md" />
      </Center>
    );
  }

  return (
    <Box suppressHydrationWarning={suppressHydrationWarning}>
      {children}
    </Box>
  );
}
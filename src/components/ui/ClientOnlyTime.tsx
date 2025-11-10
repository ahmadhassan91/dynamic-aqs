'use client';

import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/utils/dateUtils';

interface ClientOnlyTimeProps {
  date: Date;
  children?: (formattedTime: string) => React.ReactNode;
}

export function ClientOnlyTime({ date, children }: ClientOnlyTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return nothing on server-side
  }

  const formattedTime = formatTime(date);
  
  if (children) {
    return <>{children(formattedTime)}</>;
  }
  
  return <>{formattedTime}</>;
}
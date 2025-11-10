/**
 * Utility functions for consistent date formatting across server and client
 */

export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Use consistent locale and options to prevent hydration mismatches
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  };
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (date: Date | string): string => {
  return formatDate(date, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York', // Use consistent timezone
  });
};
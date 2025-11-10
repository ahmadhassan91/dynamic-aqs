'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { performanceMonitor } from '@/lib/performance/monitoring';

interface PerformanceContextType {
  recordMetric: (name: string, value: number, metadata?: Record<string, any>) => void;
  getMetrics: (name?: string) => any[];
  measureFunction: <T extends (...args: any[]) => any>(fn: T, name: string) => T;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

interface PerformanceProviderProps {
  children: ReactNode;
  enableWebVitals?: boolean;
  enableConsoleReporting?: boolean;
}

export function PerformanceProvider({ 
  children, 
  enableWebVitals = true,
  enableConsoleReporting = process.env.NODE_ENV === 'development'
}: PerformanceProviderProps) {
  useEffect(() => {
    if (enableWebVitals) {
      performanceMonitor.measureWebVitals();
    }

    // Report metrics periodically in development
    if (enableConsoleReporting) {
      const interval = setInterval(() => {
        const metrics = performanceMonitor.getMetrics();
        if (metrics.length > 0) {
          console.group('Performance Metrics');
          console.table(metrics.slice(-10)); // Show last 10 metrics
          console.groupEnd();
        }
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }

    return () => {
      performanceMonitor.disconnect();
    };
  }, [enableWebVitals, enableConsoleReporting]);

  const contextValue: PerformanceContextType = {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    measureFunction: performanceMonitor.measureFunction.bind(performanceMonitor),
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
}

// HOC for measuring component render performance
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const WrappedComponent = (props: P) => {
    const { recordMetric } = usePerformance();

    useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        recordMetric(`component_render_${componentName}`, endTime - startTime);
      };
    }, [recordMetric]);

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return WrappedComponent;
}
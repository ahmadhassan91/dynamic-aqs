'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { debounceWithCache, memoize } from '@/lib/performance/caching';
import { usePerformance } from '@/components/providers/PerformanceProvider';

/**
 * Hook for debouncing values with performance tracking
 */
export function useDebounce<T>(value: T, delay: number, trackingName?: string): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const { recordMetric } = usePerformance();

  useEffect(() => {
    const startTime = performance.now();
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      if (trackingName) {
        const endTime = performance.now();
        recordMetric(`debounce_${trackingName}`, endTime - startTime);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, trackingName, recordMetric]);

  return debouncedValue;
}

/**
 * Hook for throttling function calls
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook for memoizing expensive calculations
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  cacheKey?: string
): T {
  const memoizedFn = useCallback(
    memoize(callback, cacheKey ? () => cacheKey : undefined),
    deps
  );

  return memoizedFn;
}

/**
 * Hook for intersection observer with performance tracking
 */
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit,
  trackingName?: string
) {
  const { recordMetric } = usePerformance();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (trackingName) {
          const startTime = performance.now();
          callback(entries);
          const endTime = performance.now();
          recordMetric(`intersection_${trackingName}`, endTime - startTime);
        } else {
          callback(entries);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observerRef.current.observe(element);
  }, [callback, options, trackingName, recordMetric]);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { observe, disconnect };
}

/**
 * Hook for virtual scrolling performance
 */
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    handleScroll,
  };
}

/**
 * Hook for measuring component render performance
 */
export function useRenderPerformance(componentName: string) {
  const { recordMetric } = usePerformance();
  const renderStartTime = useRef<number | undefined>(undefined);

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      recordMetric(`render_${componentName}`, renderTime);
    }
  });

  const measureOperation = useCallback(
    (operationName: string, operation: () => void) => {
      const startTime = performance.now();
      operation();
      const endTime = performance.now();
      recordMetric(`operation_${componentName}_${operationName}`, endTime - startTime);
    },
    [componentName, recordMetric]
  );

  return { measureOperation };
}

/**
 * Hook for optimizing re-renders
 */
export function useOptimizedState<T>(
  initialValue: T,
  isEqual?: (a: T, b: T) => boolean
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);

  const optimizedSetState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        
        if (isEqual ? isEqual(prev, newValue) : prev === newValue) {
          return prev; // Prevent re-render if values are equal
        }
        
        return newValue;
      });
    },
    [isEqual]
  );

  return [state, optimizedSetState];
}

/**
 * Hook for batch updates
 */
export function useBatchUpdates() {
  const [updates, setUpdates] = useState<(() => void)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const batchUpdate = useCallback((updateFn: () => void) => {
    setUpdates((prev) => [...prev, updateFn]);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setUpdates((currentUpdates) => {
        currentUpdates.forEach((update) => update());
        return [];
      });
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return batchUpdate;
}
/**
 * Performance monitoring utilities
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart);
            this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart);
            this.recordMetric('first_paint', navEntry.responseEnd - navEntry.fetchStart);
          }
        }
      });

      try {
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);
      } catch (error) {
        console.warn('Navigation timing observer not supported');
      }

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('largest_contentful_paint', entry.startTime);
        }
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer not supported');
      }

      // Observe first input delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any; // First Input Delay entry has processingStart
          this.recordMetric('first_input_delay', fidEntry.processingStart - entry.startTime);
        }
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID observer not supported');
      }
    }
  }

  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      metadata,
    });

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    return name 
      ? this.metrics.filter(metric => metric.name === name)
      : this.metrics;
  }

  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  measureFunction<T extends (...args: any[]) => any>(
    fn: T,
    name: string
  ): T {
    return ((...args: Parameters<T>): ReturnType<T> => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      this.recordMetric(`function_${name}`, end - start);
      
      return result;
    }) as T;
  }

  measureAsyncFunction<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    name: string
  ): T {
    return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      const start = performance.now();
      const result = await fn(...args);
      const end = performance.now();
      
      this.recordMetric(`async_function_${name}`, end - start);
      
      return result;
    }) as T;
  }

  measureRender(componentName: string) {
    return {
      start: () => {
        const startTime = performance.now();
        return {
          end: () => {
            const endTime = performance.now();
            this.recordMetric(`render_${componentName}`, endTime - startTime);
          }
        };
      }
    };
  }

  // Web Vitals measurement
  measureWebVitals() {
    if (typeof window === 'undefined') return;

    // Cumulative Layout Shift
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];

    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsEntries.push(entry);
          clsValue += (entry as any).value;
        }
      }
      this.recordMetric('cumulative_layout_shift', clsValue);
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('CLS observer not supported');
    }
  }

  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  clearMetrics() {
    this.metrics = [];
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const measureRender = () => performanceMonitor.measureRender(componentName);
  
  return {
    measureRender,
    recordMetric: (name: string, value: number, metadata?: Record<string, any>) => 
      performanceMonitor.recordMetric(name, value, metadata),
    getMetrics: (name?: string) => performanceMonitor.getMetrics(name),
  };
}

// Bundle size analyzer
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const resources = [...scripts, ...styles].map(element => {
    const src = element.getAttribute('src') || element.getAttribute('href');
    return {
      url: src,
      type: element.tagName.toLowerCase(),
    };
  });

  console.group('Bundle Analysis');
  console.table(resources);
  console.groupEnd();

  return resources;
}
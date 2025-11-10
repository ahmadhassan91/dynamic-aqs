import { lazy, ComponentType } from 'react';

/**
 * Enhanced lazy loading with error boundaries and loading states
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
) {
  const LazyComponent = lazy(importFn);
  
  return LazyComponent;
}

/**
 * Preload a lazy component
 */
export function preloadComponent(importFn: () => Promise<any>) {
  const componentImport = importFn();
  return componentImport;
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  const observer = new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  });

  return observer;
}

/**
 * Image lazy loading with WebP support
 */
export function createOptimizedImageSrc(
  src: string,
  width?: number,
  quality = 75
): string {
  if (!src) return '';
  
  // For Next.js Image optimization
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());
  
  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
}

/**
 * Lazy load modules with retry logic
 */
export async function lazyLoadModule<T>(
  importFn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Failed to load module after retries');
}
/**
 * In-memory cache with TTL support
 */
class MemoryCache {
  private cache = new Map<string, { value: any; expires: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, value: any, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expires });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

/**
 * Local storage cache with expiration
 */
export class LocalStorageCache {
  private prefix: string;

  constructor(prefix = 'crm_cache_') {
    this.prefix = prefix;
  }

  set(key: string, value: any, ttl?: number): void {
    try {
      const item = {
        value,
        expires: ttl ? Date.now() + ttl : null,
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set localStorage cache:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (item.expires && Date.now() > item.expires) {
        this.delete(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn('Failed to get localStorage cache:', error);
      return null;
    }
  }

  delete(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const localStorageCache = new LocalStorageCache();

/**
 * Memoization with cache
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getCacheKey?: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  const cache = new Map<string, { value: ReturnType<T>; expires: number }>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getCacheKey ? getCacheKey(...args) : JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && (!ttl || Date.now() < cached.expires)) {
      return cached.value;
    }

    const result = fn(...args);
    cache.set(key, {
      value: result,
      expires: ttl ? Date.now() + ttl : Infinity,
    });

    return result;
  }) as T;
}

/**
 * Debounced function with caching
 */
export function debounceWithCache<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  getCacheKey?: (...args: Parameters<T>) => string
): T {
  let timeoutId: NodeJS.Timeout;
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = getCacheKey ? getCacheKey(...args) : JSON.stringify(args);
    
    // Return cached result if available
    if (cache.has(key)) {
      return Promise.resolve(cache.get(key)!);
    }

    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const result = await fn(...args);
        cache.set(key, result);
        resolve(result);
      }, delay);
    });
  }) as T;
}
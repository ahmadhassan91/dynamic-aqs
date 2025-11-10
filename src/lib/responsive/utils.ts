/**
 * Responsive design utilities
 */
import React from 'react';

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Media query utilities
 */
export function createMediaQuery(minWidth: string): string {
  return `(min-width: ${minWidth})`;
}

export function useMediaQuery(query: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia(query);
  const [matches, setMatches] = React.useState(mediaQuery.matches);

  React.useEffect(() => {
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mediaQuery]);

  return matches;
}

/**
 * Responsive value utilities
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export function getResponsiveValue<T>(
  value: ResponsiveValue<T>,
  currentBreakpoint: Breakpoint,
  defaultValue: T
): T {
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }

  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  // Find the closest breakpoint value
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (typeof value === 'object' && value !== null && bp in value) {
      const responsiveValue = (value as Record<string, T>)[bp];
      if (responsiveValue !== undefined) {
        return responsiveValue;
      }
    }
  }

  return defaultValue;
}

/**
 * Container utilities
 */
export const containerSizes = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export function getContainerClass(maxWidth?: Breakpoint): string {
  const baseClasses = 'mx-auto px-4 sm:px-6 lg:px-8';
  
  if (!maxWidth) {
    return `${baseClasses} max-w-7xl`;
  }

  const maxWidthClass = `max-w-${maxWidth}`;
  return `${baseClasses} ${maxWidthClass}`;
}

/**
 * Grid utilities
 */
export interface GridConfig {
  columns?: ResponsiveValue<number>;
  gap?: ResponsiveValue<string>;
  rows?: ResponsiveValue<number>;
}

export function generateGridClasses(config: GridConfig): string {
  const { columns = 1, gap = '1rem', rows } = config;
  
  let classes = 'grid';
  
  // Handle responsive columns
  if (typeof columns === 'number') {
    classes += ` grid-cols-${columns}`;
  } else {
    Object.entries(columns).forEach(([bp, cols]) => {
      if (bp === 'xs') {
        classes += ` grid-cols-${cols}`;
      } else {
        classes += ` ${bp}:grid-cols-${cols}`;
      }
    });
  }

  // Handle responsive gap
  if (typeof gap === 'string') {
    classes += ` gap-${gap}`;
  } else {
    Object.entries(gap).forEach(([bp, gapValue]) => {
      if (bp === 'xs') {
        classes += ` gap-${gapValue}`;
      } else {
        classes += ` ${bp}:gap-${gapValue}`;
      }
    });
  }

  // Handle responsive rows
  if (rows) {
    if (typeof rows === 'number') {
      classes += ` grid-rows-${rows}`;
    } else {
      Object.entries(rows).forEach(([bp, rowCount]) => {
        if (bp === 'xs') {
          classes += ` grid-rows-${rowCount}`;
        } else {
          classes += ` ${bp}:grid-rows-${rowCount}`;
        }
      });
    }
  }

  return classes;
}

/**
 * Flexbox utilities
 */
export interface FlexConfig {
  direction?: ResponsiveValue<'row' | 'col' | 'row-reverse' | 'col-reverse'>;
  wrap?: ResponsiveValue<'wrap' | 'nowrap' | 'wrap-reverse'>;
  justify?: ResponsiveValue<'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'>;
  align?: ResponsiveValue<'start' | 'end' | 'center' | 'baseline' | 'stretch'>;
  gap?: ResponsiveValue<string>;
}

export function generateFlexClasses(config: FlexConfig): string {
  const { direction = 'row', wrap, justify, align, gap } = config;
  
  let classes = 'flex';

  // Handle responsive direction
  if (typeof direction === 'string') {
    classes += ` flex-${direction}`;
  } else {
    Object.entries(direction).forEach(([bp, dir]) => {
      if (bp === 'xs') {
        classes += ` flex-${dir}`;
      } else {
        classes += ` ${bp}:flex-${dir}`;
      }
    });
  }

  // Handle other flex properties similarly...
  if (wrap) {
    if (typeof wrap === 'string') {
      classes += ` flex-${wrap}`;
    } else {
      Object.entries(wrap).forEach(([bp, wrapValue]) => {
        if (bp === 'xs') {
          classes += ` flex-${wrapValue}`;
        } else {
          classes += ` ${bp}:flex-${wrapValue}`;
        }
      });
    }
  }

  if (justify) {
    if (typeof justify === 'string') {
      classes += ` justify-${justify}`;
    } else {
      Object.entries(justify).forEach(([bp, justifyValue]) => {
        if (bp === 'xs') {
          classes += ` justify-${justifyValue}`;
        } else {
          classes += ` ${bp}:justify-${justifyValue}`;
        }
      });
    }
  }

  if (align) {
    if (typeof align === 'string') {
      classes += ` items-${align}`;
    } else {
      Object.entries(align).forEach(([bp, alignValue]) => {
        if (bp === 'xs') {
          classes += ` items-${alignValue}`;
        } else {
          classes += ` ${bp}:items-${alignValue}`;
        }
      });
    }
  }

  if (gap) {
    if (typeof gap === 'string') {
      classes += ` gap-${gap}`;
    } else {
      Object.entries(gap).forEach(([bp, gapValue]) => {
        if (bp === 'xs') {
          classes += ` gap-${gapValue}`;
        } else {
          classes += ` ${bp}:gap-${gapValue}`;
        }
      });
    }
  }

  return classes;
}

/**
 * Typography utilities
 */
export interface TypographyConfig {
  size?: ResponsiveValue<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'>;
  weight?: ResponsiveValue<'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'>;
  align?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>;
  lineHeight?: ResponsiveValue<'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'>;
}

export function generateTypographyClasses(config: TypographyConfig): string {
  const { size, weight, align, lineHeight } = config;
  let classes = '';

  if (size) {
    if (typeof size === 'string') {
      classes += ` text-${size}`;
    } else {
      Object.entries(size).forEach(([bp, sizeValue]) => {
        if (bp === 'xs') {
          classes += ` text-${sizeValue}`;
        } else {
          classes += ` ${bp}:text-${sizeValue}`;
        }
      });
    }
  }

  if (weight) {
    if (typeof weight === 'string') {
      classes += ` font-${weight}`;
    } else {
      Object.entries(weight).forEach(([bp, weightValue]) => {
        if (bp === 'xs') {
          classes += ` font-${weightValue}`;
        } else {
          classes += ` ${bp}:font-${weightValue}`;
        }
      });
    }
  }

  if (align) {
    if (typeof align === 'string') {
      classes += ` text-${align}`;
    } else {
      Object.entries(align).forEach(([bp, alignValue]) => {
        if (bp === 'xs') {
          classes += ` text-${alignValue}`;
        } else {
          classes += ` ${bp}:text-${alignValue}`;
        }
      });
    }
  }

  if (lineHeight) {
    if (typeof lineHeight === 'string') {
      classes += ` leading-${lineHeight}`;
    } else {
      Object.entries(lineHeight).forEach(([bp, lhValue]) => {
        if (bp === 'xs') {
          classes += ` leading-${lhValue}`;
        } else {
          classes += ` ${bp}:leading-${lhValue}`;
        }
      });
    }
  }

  return classes.trim();
}

/**
 * Device detection utilities
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'lg';
  
  const width = window.innerWidth;
  
  if (width >= 1536) return '2xl';
  if (width >= 1280) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  if (width >= 640) return 'sm';
  return 'xs';
}
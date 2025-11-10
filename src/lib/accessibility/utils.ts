/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

/**
 * Generate unique IDs for form elements
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Announce content to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof window === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Focus management utilities
 */
export class FocusManager {
  private static focusStack: HTMLElement[] = [];

  static pushFocus(element: HTMLElement) {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus) {
      this.focusStack.push(currentFocus);
    }
    element.focus();
  }

  static popFocus() {
    const previousFocus = this.focusStack.pop();
    if (previousFocus) {
      previousFocus.focus();
    }
  }

  static trapFocus(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
}

/**
 * Color contrast utilities
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function isAccessibleContrast(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(foreground, background);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Keyboard navigation utilities
 */
export function handleArrowNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  orientation: 'horizontal' | 'vertical' = 'vertical'
): number {
  const { key } = event;
  let newIndex = currentIndex;

  if (orientation === 'vertical') {
    if (key === 'ArrowDown') {
      newIndex = (currentIndex + 1) % items.length;
      event.preventDefault();
    } else if (key === 'ArrowUp') {
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      event.preventDefault();
    }
  } else {
    if (key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % items.length;
      event.preventDefault();
    } else if (key === 'ArrowLeft') {
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      event.preventDefault();
    }
  }

  if (key === 'Home') {
    newIndex = 0;
    event.preventDefault();
  } else if (key === 'End') {
    newIndex = items.length - 1;
    event.preventDefault();
  }

  if (newIndex !== currentIndex) {
    items[newIndex]?.focus();
  }

  return newIndex;
}

/**
 * ARIA utilities
 */
export function setAriaExpanded(element: HTMLElement, expanded: boolean) {
  element.setAttribute('aria-expanded', expanded.toString());
}

export function setAriaSelected(element: HTMLElement, selected: boolean) {
  element.setAttribute('aria-selected', selected.toString());
}

export function setAriaChecked(element: HTMLElement, checked: boolean | 'mixed') {
  element.setAttribute('aria-checked', checked.toString());
}

/**
 * Reduced motion utilities
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * High contrast mode detection
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Screen reader detection
 */
export function isScreenReaderActive(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for common screen reader indicators
  const indicators = [
    'speechSynthesis' in window,
    navigator.userAgent.includes('NVDA'),
    navigator.userAgent.includes('JAWS'),
    navigator.userAgent.includes('VoiceOver'),
  ];

  return indicators.some(Boolean);
}
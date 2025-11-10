'use client';

import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category?: string;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, preventDefault = true } = options;
  const shortcutsRef = useRef(shortcuts);

  // Update shortcuts ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when user is typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    const matchingShortcut = shortcutsRef.current.find(shortcut => {
      const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
      const altMatches = !!shortcut.altKey === event.altKey;
      const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
      const metaMatches = !!shortcut.metaKey === event.metaKey;

      return keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches;
    });

    if (matchingShortcut) {
      if (preventDefault || matchingShortcut.preventDefault !== false) {
        event.preventDefault();
      }
      matchingShortcut.action();
    }
  }, [enabled, preventDefault]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);

  return {
    shortcuts: shortcutsRef.current,
  };
}

// Global keyboard shortcuts hook
export function useGlobalKeyboardShortcuts() {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '/',
      action: () => {
        // Focus search input
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: 'Focus search',
      category: 'Navigation',
    },
    {
      key: 'Escape',
      action: () => {
        // Close modals, dropdowns, etc.
        const closeButtons = document.querySelectorAll('[data-close-on-escape]');
        closeButtons.forEach(button => {
          if (button instanceof HTMLElement) {
            button.click();
          }
        });
      },
      description: 'Close modals/dropdowns',
      category: 'Navigation',
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        // Trigger "new" action
        const newButton = document.querySelector('[data-new-action]') as HTMLElement;
        if (newButton) {
          newButton.click();
        }
      },
      description: 'Create new item',
      category: 'Actions',
    },
    {
      key: 's',
      ctrlKey: true,
      action: () => {
        // Trigger save action
        const saveButton = document.querySelector('[data-save-action]') as HTMLElement;
        if (saveButton) {
          saveButton.click();
        }
      },
      description: 'Save current form',
      category: 'Actions',
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        // Open command palette
        const commandPalette = document.querySelector('[data-command-palette]') as HTMLElement;
        if (commandPalette) {
          commandPalette.click();
        }
      },
      description: 'Open command palette',
      category: 'Navigation',
    },
    {
      key: '?',
      shiftKey: true,
      action: () => {
        // Show keyboard shortcuts help
        const helpButton = document.querySelector('[data-shortcuts-help]') as HTMLElement;
        if (helpButton) {
          helpButton.click();
        }
      },
      description: 'Show keyboard shortcuts',
      category: 'Help',
    },
  ];

  return useKeyboardShortcuts(shortcuts);
}

// Navigation shortcuts hook
export function useNavigationShortcuts(routes: { key: string; path: string; description: string }[]) {
  const shortcuts: KeyboardShortcut[] = routes.map(route => ({
    key: route.key,
    altKey: true,
    action: () => {
      // Navigate to route (you'll need to implement navigation logic)
      window.location.href = route.path;
    },
    description: `Go to ${route.description}`,
    category: 'Navigation',
  }));

  return useKeyboardShortcuts(shortcuts);
}

// Form shortcuts hook
export function useFormShortcuts(formRef: React.RefObject<HTMLFormElement>) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Enter',
      ctrlKey: true,
      action: () => {
        if (formRef.current) {
          const submitButton = formRef.current.querySelector('[type="submit"]') as HTMLButtonElement;
          if (submitButton) {
            submitButton.click();
          }
        }
      },
      description: 'Submit form',
      category: 'Form',
    },
    {
      key: 'r',
      ctrlKey: true,
      action: () => {
        if (formRef.current) {
          const resetButton = formRef.current.querySelector('[type="reset"]') as HTMLButtonElement;
          if (resetButton) {
            resetButton.click();
          } else {
            formRef.current.reset();
          }
        }
      },
      description: 'Reset form',
      category: 'Form',
    },
  ];

  return useKeyboardShortcuts(shortcuts);
}

// Table shortcuts hook
export function useTableShortcuts(
  onSelectAll?: () => void,
  onDelete?: () => void,
  onEdit?: () => void
) {
  const shortcuts: KeyboardShortcut[] = [
    ...(onSelectAll ? [{
      key: 'a',
      ctrlKey: true,
      action: onSelectAll,
      description: 'Select all items',
      category: 'Table',
    }] : []),
    ...(onDelete ? [{
      key: 'Delete',
      action: onDelete,
      description: 'Delete selected items',
      category: 'Table',
    }] : []),
    ...(onEdit ? [{
      key: 'Enter',
      action: onEdit,
      description: 'Edit selected item',
      category: 'Table',
    }] : []),
  ];

  return useKeyboardShortcuts(shortcuts);
}

// Utility function to format shortcut display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.metaKey) parts.push('Cmd');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(' + ');
}

// Keyboard shortcuts help component data
export function getShortcutsByCategory(shortcuts: KeyboardShortcut[]) {
  const categories: Record<string, KeyboardShortcut[]> = {};
  
  shortcuts.forEach(shortcut => {
    const category = shortcut.category || 'General';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(shortcut);
  });
  
  return categories;
}
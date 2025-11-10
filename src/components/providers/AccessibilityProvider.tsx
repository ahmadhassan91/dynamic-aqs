'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { prefersReducedMotion, prefersHighContrast, isScreenReaderActive } from '@/lib/accessibility/utils';

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'normal' | 'large' | 'larger';
  screenReader: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  fontSize: 'normal',
  screenReader: false,
  keyboardNavigation: false,
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Initialize settings based on system preferences
  useEffect(() => {
    const initialSettings: AccessibilitySettings = {
      ...defaultSettings,
      highContrast: prefersHighContrast(),
      reducedMotion: prefersReducedMotion(),
      screenReader: isScreenReaderActive(),
    };

    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        Object.assign(initialSettings, parsed);
      } catch (error) {
        console.warn('Failed to parse saved accessibility settings');
      }
    }

    setSettings(initialSettings);
  }, []);

  // Apply settings to document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;

    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Font size
    root.classList.remove('font-large', 'font-larger');
    if (settings.fontSize !== 'normal') {
      root.classList.add(`font-${settings.fontSize}`);
    }

    // Screen reader mode
    if (settings.screenReader) {
      root.classList.add('screen-reader');
    } else {
      root.classList.remove('screen-reader');
    }

    // Keyboard navigation
    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }

    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQueries = [
      {
        query: '(prefers-reduced-motion: reduce)',
        handler: (e: MediaQueryListEvent) => {
          if (e.matches) {
            updateSetting('reducedMotion', true);
          }
        },
      },
      {
        query: '(prefers-contrast: high)',
        handler: (e: MediaQueryListEvent) => {
          if (e.matches) {
            updateSetting('highContrast', true);
          }
        },
      },
    ];

    mediaQueries.forEach(({ query, handler }) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', handler);
    });

    return () => {
      mediaQueries.forEach(({ query, handler }) => {
        const mq = window.matchMedia(query);
        mq.removeEventListener('change', handler);
      });
    };
  }, []);

  // Keyboard navigation detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        updateSetting('keyboardNavigation', true);
      }
    };

    const handleMouseDown = () => {
      updateSetting('keyboardNavigation', false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Accessibility Settings Panel Component
export function AccessibilitySettingsPanel() {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <h2 className="text-lg font-semibold mb-4">Accessibility Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="high-contrast" className="text-sm font-medium">
            High Contrast Mode
          </label>
          <input
            id="high-contrast"
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => updateSetting('highContrast', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="reduced-motion" className="text-sm font-medium">
            Reduce Motion
          </label>
          <input
            id="reduced-motion"
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="font-size" className="text-sm font-medium">
            Font Size
          </label>
          <select
            id="font-size"
            value={settings.fontSize}
            onChange={(e) => updateSetting('fontSize', e.target.value as AccessibilitySettings['fontSize'])}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="larger">Larger</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="screen-reader" className="text-sm font-medium">
            Screen Reader Mode
          </label>
          <input
            id="screen-reader"
            type="checkbox"
            checked={settings.screenReader}
            onChange={(e) => updateSetting('screenReader', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>

        <button
          onClick={resetSettings}
          className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
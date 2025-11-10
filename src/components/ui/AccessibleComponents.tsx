'use client';

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { generateId, FocusManager, announceToScreenReader, handleArrowNavigation } from '@/lib/accessibility/utils';

// Accessible Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, loadingText, children, className = '', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={loading || props.disabled}
        aria-busy={loading}
        aria-describedby={loading && loadingText ? `${generateId('loading')}` : undefined}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="sr-only">{loadingText || 'Loading...'}</span>
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

// Accessible Modal Component
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AccessibleModal({ isOpen, onClose, title, children, size = 'md' }: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = generateId('modal-title');
  const descriptionId = generateId('modal-description');

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = FocusManager.trapFocus(modalRef.current);
      announceToScreenReader(`Modal opened: ${title}`);
      
      return () => {
        cleanup();
        announceToScreenReader('Modal closed');
      };
    }
  }, [isOpen, title]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div
          ref={modalRef}
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} sm:w-full`}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id={titleId}>
                  {title}
                </h3>
                <div className="mt-2" id={descriptionId}>
                  {children}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <AccessibleButton onClick={onClose} variant="secondary">
              Close
            </AccessibleButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// Accessible Form Field Component
interface AccessibleFormFieldProps {
  label: string;
  children: React.ReactElement;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function AccessibleFormField({ label, children, error, hint, required }: AccessibleFormFieldProps) {
  const fieldId = generateId('field');
  const errorId = generateId('error');
  const hintId = generateId('hint');

  const childWithProps = React.cloneElement(children, {
    ...(children.props || {}),
    id: fieldId,
    'aria-describedby': [
      hint ? hintId : null,
      error ? errorId : null,
    ].filter(Boolean).join(' ') || undefined,
    'aria-invalid': error ? 'true' : undefined,
    'aria-required': required,
  } as any);

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-gray-500">
          {hint}
        </p>
      )}
      
      {childWithProps}
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Accessible Tab Component
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccessibleTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function AccessibleTabs({ tabs, defaultTab, onChange }: AccessibleTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
    announceToScreenReader(`Switched to ${tabs.find(t => t.id === tabId)?.label} tab`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    const tabElements = Array.from(tabListRef.current?.querySelectorAll('[role="tab"]') || []) as HTMLElement[];
    const currentIndex = tabs.findIndex(tab => tab.id === tabId);
    
    const newIndex = handleArrowNavigation(e.nativeEvent, tabElements, currentIndex, 'horizontal');
    if (newIndex !== currentIndex) {
      const newTab = tabs[newIndex];
      if (newTab && !newTab.disabled) {
        handleTabChange(newTab.id);
      }
    }
  };

  return (
    <div>
      <div ref={tabListRef} className="border-b border-gray-200" role="tablist">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              disabled={tab.disabled}
              className={`py-2 px-1 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className="mt-4"
        >
          {activeTab === tab.id && tab.content}
        </div>
      ))}
    </div>
  );
}

// Skip Link Component
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Skip to main content
    </a>
  );
}
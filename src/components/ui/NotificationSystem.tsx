'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { FadeIn, SlideIn } from './Animations';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message?: string, options?: Partial<Notification>) => string;
  error: (title: string, message?: string, options?: Partial<Notification>) => string;
  warning: (title: string, message?: string, options?: Partial<Notification>) => string;
  info: (title: string, message?: string, options?: Partial<Notification>) => string;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
}

export function NotificationProvider({ 
  children, 
  maxNotifications = 5, 
  defaultDuration = 5000 
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? defaultDuration,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });

    // Auto-remove notification after duration
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [defaultDuration, maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const success = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'success', title, message });
  }, [addNotification]);

  const error = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'error', title, message, persistent: true });
  }, [addNotification]);

  const warning = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'warning', title, message });
  }, [addNotification]);

  const info = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'info', title, message });
  }, [addNotification]);

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification, index) => (
        <SlideIn key={notification.id} direction="right" delay={index * 100}>
          <NotificationItem
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        </SlideIn>
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  const Icon = icons[notification.type];

  return (
    <div
      className={`relative rounded-lg border p-4 shadow-lg ${colors[notification.type]}`}
      role="alert"
      aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColors[notification.type]}`} />
        </div>
        
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium">{notification.title}</h4>
          {notification.message && (
            <p className="mt-1 text-sm opacity-90">{notification.message}</p>
          )}
          
          {notification.action && (
            <div className="mt-3">
              <button
                onClick={notification.action.onClick}
                className="text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>

        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress bar for timed notifications */}
      {!notification.persistent && notification.duration && notification.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-current opacity-50 animate-shrink-width"
            style={{
              animationDuration: `${notification.duration}ms`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shrink-width {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink-width {
          animation: shrink-width linear forwards;
        }
      `}</style>
    </div>
  );
}

// Toast notification hook for quick usage
export function useToast() {
  const { success, error, warning, info } = useNotifications();

  return {
    success: (message: string) => success('Success', message),
    error: (message: string) => error('Error', message),
    warning: (message: string) => warning('Warning', message),
    info: (message: string) => info('Info', message),
  };
}

// Confirmation dialog hook
export function useConfirmation() {
  const { addNotification, removeNotification } = useNotifications();

  const confirm = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    const id = addNotification({
      type: 'warning',
      title,
      message,
      persistent: true,
      action: {
        label: 'Confirm',
        onClick: () => {
          onConfirm();
          removeNotification(id);
        },
      },
    });

    // Add cancel functionality
    setTimeout(() => {
      const notification = document.querySelector(`[data-notification-id="${id}"]`);
      if (notification) {
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'ml-2 text-sm font-medium underline hover:no-underline';
        cancelButton.onclick = () => {
          onCancel?.();
          removeNotification(id);
        };
        
        const actionContainer = notification.querySelector('.mt-3');
        if (actionContainer) {
          actionContainer.appendChild(cancelButton);
        }
      }
    }, 0);

    return id;
  }, [addNotification, removeNotification]);

  return { confirm };
}

// Progress notification hook
export function useProgressNotification() {
  const { addNotification, removeNotification } = useNotifications();

  const showProgress = useCallback((title: string, initialMessage?: string) => {
    const id = addNotification({
      type: 'info',
      title,
      message: initialMessage,
      persistent: true,
    });

    const updateProgress = (message: string, progress?: number) => {
      // Update notification message
      // This would require extending the notification system to support updates
    };

    const complete = (successMessage?: string) => {
      removeNotification(id);
      if (successMessage) {
        addNotification({
          type: 'success',
          title: 'Complete',
          message: successMessage,
        });
      }
    };

    const fail = (errorMessage: string) => {
      removeNotification(id);
      addNotification({
        type: 'error',
        title: 'Failed',
        message: errorMessage,
        persistent: true,
      });
    };

    return { updateProgress, complete, fail };
  }, [addNotification, removeNotification]);

  return { showProgress };
}
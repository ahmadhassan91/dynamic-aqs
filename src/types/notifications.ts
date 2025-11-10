export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  read: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum NotificationCategory {
  ORDER = 'order',
  TRAINING = 'training',
  CUSTOMER = 'customer',
  SYSTEM = 'system',
  LEAD = 'lead',
  INTEGRATION = 'integration',
  COMMERCIAL_OPPORTUNITY = 'commercial_opportunity',
  COMMERCIAL_QUOTE = 'commercial_quote',
  COMMERCIAL_ENGINEER = 'commercial_engineer',
  COMMERCIAL_REP = 'commercial_rep',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  categories: {
    [key in NotificationCategory]: {
      enabled: boolean;
      email: boolean;
      push: boolean;
      priority: NotificationPriority;
    };
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily';
}

export interface NotificationFilter {
  categories?: NotificationCategory[];
  types?: NotificationType[];
  priorities?: NotificationPriority[];
  read?: boolean;
  archived?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface CommercialNotificationData {
  opportunityId?: string;
  opportunityName?: string;
  engineerId?: string;
  engineerName?: string;
  manufacturerRepId?: string;
  manufacturerRepName?: string;
  quoteId?: string;
  quoteAmount?: number;
  salesPhase?: string;
  marketSegment?: string;
  estimatedValue?: number;
  probability?: number;
}

export interface EscalationRule {
  id: string;
  name: string;
  category: NotificationCategory;
  conditions: {
    valueThreshold?: number;
    timeThreshold?: number; // hours
    priorityLevel?: NotificationPriority;
    salesPhase?: string[];
    marketSegment?: string[];
  };
  escalationSteps: EscalationStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EscalationStep {
  stepNumber: number;
  delayMinutes: number;
  recipients: string[]; // user IDs or email addresses
  notificationMethods: ('email' | 'push' | 'sms')[];
  template: string;
  conditions?: {
    stillUnread?: boolean;
    noResponse?: boolean;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  category: NotificationCategory;
  subject: string;
  body: string;
  variables: string[]; // Available template variables
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
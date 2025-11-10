export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: EmailCategory;
  variables: EmailVariable[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface EmailVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export enum EmailCategory {
  ONBOARDING = 'onboarding',
  TRAINING = 'training',
  ORDER_CONFIRMATION = 'order_confirmation',
  FOLLOW_UP = 'follow_up',
  REMINDER = 'reminder',
  MARKETING = 'marketing',
  SYSTEM = 'system',
}

export interface EmailCampaign {
  id: string;
  name: string;
  description: string;
  templateId: string;
  recipients: EmailRecipient[];
  status: CampaignStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  completedAt?: Date;
  analytics: CampaignAnalytics;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface EmailRecipient {
  id: string;
  email: string;
  name: string;
  customerId?: string;
  variables?: Record<string, any>;
  status: RecipientStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bouncedAt?: Date;
  unsubscribedAt?: Date;
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENDING = 'sending',
  SENT = 'sent',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum RecipientStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  OPENED = 'opened',
  CLICKED = 'clicked',
  BOUNCED = 'bounced',
  UNSUBSCRIBED = 'unsubscribed',
  FAILED = 'failed',
}

export interface CampaignAnalytics {
  totalRecipients: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  failed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
}

export interface EmailLog {
  id: string;
  campaignId?: string;
  templateId?: string;
  recipientEmail: string;
  recipientName: string;
  customerId?: string;
  subject: string;
  status: EmailStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bouncedAt?: Date;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export enum EmailStatus {
  QUEUED = 'queued',
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  OPENED = 'opened',
  CLICKED = 'clicked',
  BOUNCED = 'bounced',
  FAILED = 'failed',
}

export interface EmailComposer {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  templateId?: string;
  variables?: Record<string, any>;
  attachments?: EmailAttachment[];
  scheduledAt?: Date;
  trackOpens: boolean;
  trackClicks: boolean;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  url: string;
}
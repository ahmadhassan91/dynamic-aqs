export interface Communication {
  id: string;
  customerId: string;
  customerName: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  subject: string;
  content: string;
  status: CommunicationStatus;
  priority: CommunicationPriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string;
  dueDate?: Date;
  completedAt?: Date;
  metadata?: CommunicationMetadata;
  attachments?: CommunicationAttachment[];
  tags?: string[];
}

export enum CommunicationType {
  EMAIL = 'email',
  PHONE_CALL = 'phone_call',
  MEETING = 'meeting',
  SMS = 'sms',
  NOTE = 'note',
  TASK = 'task',
  TRAINING = 'training',
  VISIT = 'visit',
  FOLLOW_UP = 'follow_up',
}

export enum CommunicationDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  INTERNAL = 'internal',
}

export enum CommunicationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue',
}

export enum CommunicationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface CommunicationMetadata {
  emailId?: string;
  phoneNumber?: string;
  meetingLocation?: string;
  meetingUrl?: string;
  duration?: number; // in minutes
  outcome?: string;
  nextAction?: string;
  trainingType?: string;
  visitType?: string;
  orderNumber?: string;
  leadId?: string;
}

export interface CommunicationAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: CommunicationType;
  subject: string;
  content: string;
  category: string;
  isActive: boolean;
  variables: TemplateVariable[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface CommunicationFilter {
  customerId?: string;
  types?: CommunicationType[];
  directions?: CommunicationDirection[];
  statuses?: CommunicationStatus[];
  priorities?: CommunicationPriority[];
  assignedTo?: string;
  createdBy?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  searchQuery?: string;
}

export interface CommunicationAnalytics {
  totalCommunications: number;
  byType: Record<CommunicationType, number>;
  byStatus: Record<CommunicationStatus, number>;
  byPriority: Record<CommunicationPriority, number>;
  averageResponseTime: number; // in hours
  completionRate: number; // percentage
  overdueCount: number;
  upcomingCount: number;
  trendsData: {
    date: string;
    count: number;
    type: CommunicationType;
  }[];
}

export interface QuickResponse {
  id: string;
  name: string;
  content: string;
  type: CommunicationType;
  category: string;
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
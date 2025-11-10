import { activityService } from './activityService';
import type { Activity } from '@/components/activities/ActivityTimeline';

// Activity logging service for automatic activity tracking
export class ActivityLogger {
  private static instance: ActivityLogger;
  private logQueue: Array<Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>> = [];
  private isProcessing = false;

  static getInstance(): ActivityLogger {
    if (!ActivityLogger.instance) {
      ActivityLogger.instance = new ActivityLogger();
    }
    return ActivityLogger.instance;
  }

  // Log system activities automatically
  async logSystemActivity(
    customerId: string,
    customerName: string,
    type: Activity['type'],
    title: string,
    description: string,
    options: {
      category?: Activity['category'];
      priority?: Activity['priority'];
      tags?: string[];
      relatedRecords?: Activity['relatedRecords'];
      outcome?: Activity['outcome'];
    } = {}
  ): Promise<void> {
    const activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'> = {
      customerId,
      customerName,
      type,
      title,
      description,
      date: new Date(),
      outcome: options.outcome || 'completed',
      category: options.category || 'administrative',
      priority: options.priority || 'medium',
      source: 'automatic',
      tags: options.tags || [],
      relatedRecords: options.relatedRecords,
      createdBy: 'system',
    };

    this.logQueue.push(activity);
    await this.processQueue();
  }

  // Log user interactions automatically
  async logUserInteraction(
    customerId: string,
    customerName: string,
    interactionType: 'page_view' | 'form_submit' | 'download' | 'email_open' | 'link_click',
    details: {
      page?: string;
      form?: string;
      file?: string;
      email?: string;
      link?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    let title = '';
    let description = '';
    let tags: string[] = [];

    switch (interactionType) {
      case 'page_view':
        title = 'Page Viewed';
        description = `Customer viewed ${details.page || 'page'}`;
        tags = ['page-view', 'engagement'];
        break;
      case 'form_submit':
        title = 'Form Submitted';
        description = `Customer submitted ${details.form || 'form'}`;
        tags = ['form-submission', 'engagement'];
        break;
      case 'download':
        title = 'File Downloaded';
        description = `Customer downloaded ${details.file || 'file'}`;
        tags = ['download', 'content-engagement'];
        break;
      case 'email_open':
        title = 'Email Opened';
        description = `Customer opened email: ${details.email || 'email'}`;
        tags = ['email-engagement', 'communication'];
        break;
      case 'link_click':
        title = 'Link Clicked';
        description = `Customer clicked link: ${details.link || 'link'}`;
        tags = ['link-click', 'engagement'];
        break;
    }

    await this.logSystemActivity(
      customerId,
      customerName,
      'system',
      title,
      description,
      {
        category: 'marketing',
        priority: 'low',
        tags,
        outcome: 'completed',
      }
    );
  }

  // Log workflow activities
  async logWorkflowActivity(
    customerId: string,
    customerName: string,
    workflowName: string,
    stepName: string,
    status: 'started' | 'completed' | 'failed' | 'skipped',
    details?: string
  ): Promise<void> {
    const title = `Workflow: ${workflowName}`;
    const description = details || `${stepName} ${status}`;
    
    await this.logSystemActivity(
      customerId,
      customerName,
      'system',
      title,
      description,
      {
        category: 'administrative',
        priority: status === 'failed' ? 'high' : 'medium',
        tags: ['workflow', workflowName.toLowerCase().replace(/\s+/g, '-'), status],
        outcome: status === 'completed' ? 'completed' : status === 'failed' ? 'negative' : 'pending',
      }
    );
  }

  // Log communication activities
  async logCommunication(
    customerId: string,
    customerName: string,
    type: 'email' | 'call' | 'sms',
    direction: 'inbound' | 'outbound',
    subject: string,
    details: {
      duration?: number;
      outcome?: Activity['outcome'];
      tags?: string[];
      followUpRequired?: boolean;
      followUpDate?: Date;
    } = {}
  ): Promise<void> {
    const title = `${direction === 'inbound' ? 'Received' : 'Sent'} ${type.toUpperCase()}`;
    const description = subject;

    await this.logSystemActivity(
      customerId,
      customerName,
      type === 'sms' ? 'email' : type, // Map SMS to email for now
      title,
      description,
      {
        category: 'support',
        priority: 'medium',
        tags: [direction, ...(details.tags || [])],
        outcome: details.outcome || 'completed',
      }
    );
  }

  // Log order/quote activities
  async logBusinessActivity(
    customerId: string,
    customerName: string,
    activityType: 'quote' | 'order',
    action: 'created' | 'updated' | 'sent' | 'approved' | 'rejected' | 'completed',
    recordId: string,
    recordName: string,
    amount?: number
  ): Promise<void> {
    const title = `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} ${action}`;
    const description = `${recordName}${amount ? ` - $${amount.toLocaleString()}` : ''}`;

    await this.logSystemActivity(
      customerId,
      customerName,
      activityType,
      title,
      description,
      {
        category: 'sales',
        priority: ['approved', 'completed'].includes(action) ? 'high' : 'medium',
        tags: [activityType, action, amount ? 'revenue' : ''].filter(Boolean),
        relatedRecords: [{
          type: activityType,
          id: recordId,
          name: recordName,
        }],
        outcome: action === 'rejected' ? 'negative' : action === 'completed' ? 'completed' : 'positive',
      }
    );
  }

  // Log training activities
  async logTrainingActivity(
    customerId: string,
    customerName: string,
    trainingName: string,
    action: 'scheduled' | 'started' | 'completed' | 'cancelled',
    details?: {
      duration?: number;
      location?: string;
      instructor?: string;
      outcome?: Activity['outcome'];
    }
  ): Promise<void> {
    const title = `Training ${action}: ${trainingName}`;
    const description = details?.instructor 
      ? `Instructor: ${details.instructor}${details.location ? ` at ${details.location}` : ''}`
      : details?.location || '';

    await this.logSystemActivity(
      customerId,
      customerName,
      'training',
      title,
      description,
      {
        category: 'training',
        priority: 'medium',
        tags: ['training', action, trainingName.toLowerCase().replace(/\s+/g, '-')],
        outcome: details?.outcome || (action === 'completed' ? 'completed' : action === 'cancelled' ? 'cancelled' : 'pending'),
      }
    );
  }

  // Process the activity queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.logQueue.length > 0) {
        const activity = this.logQueue.shift();
        if (activity) {
          activityService.createActivity(activity);
        }
      }
    } catch (error) {
      console.error('Error processing activity queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Batch log multiple activities
  async logBatch(activities: Array<Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    this.logQueue.push(...activities);
    await this.processQueue();
  }

  // Get queue status
  getQueueStatus(): { pending: number; processing: boolean } {
    return {
      pending: this.logQueue.length,
      processing: this.isProcessing,
    };
  }
}

// Export singleton instance
export const activityLogger = ActivityLogger.getInstance();

// Convenience functions for common logging scenarios
export const logActivity = {
  // System activities
  system: (customerId: string, customerName: string, title: string, description: string, options?: any) =>
    activityLogger.logSystemActivity(customerId, customerName, 'system', title, description, options),

  // User interactions
  pageView: (customerId: string, customerName: string, page: string) =>
    activityLogger.logUserInteraction(customerId, customerName, 'page_view', { page }),

  formSubmit: (customerId: string, customerName: string, form: string) =>
    activityLogger.logUserInteraction(customerId, customerName, 'form_submit', { form }),

  download: (customerId: string, customerName: string, file: string) =>
    activityLogger.logUserInteraction(customerId, customerName, 'download', { file }),

  // Communications
  emailSent: (customerId: string, customerName: string, subject: string, options?: any) =>
    activityLogger.logCommunication(customerId, customerName, 'email', 'outbound', subject, options),

  emailReceived: (customerId: string, customerName: string, subject: string, options?: any) =>
    activityLogger.logCommunication(customerId, customerName, 'email', 'inbound', subject, options),

  callMade: (customerId: string, customerName: string, purpose: string, duration: number, outcome?: Activity['outcome']) =>
    activityLogger.logCommunication(customerId, customerName, 'call', 'outbound', purpose, { duration, outcome }),

  callReceived: (customerId: string, customerName: string, purpose: string, duration: number, outcome?: Activity['outcome']) =>
    activityLogger.logCommunication(customerId, customerName, 'call', 'inbound', purpose, { duration, outcome }),

  // Business activities
  quoteCreated: (customerId: string, customerName: string, quoteId: string, quoteName: string, amount?: number) =>
    activityLogger.logBusinessActivity(customerId, customerName, 'quote', 'created', quoteId, quoteName, amount),

  quoteSent: (customerId: string, customerName: string, quoteId: string, quoteName: string, amount?: number) =>
    activityLogger.logBusinessActivity(customerId, customerName, 'quote', 'sent', quoteId, quoteName, amount),

  orderReceived: (customerId: string, customerName: string, orderId: string, orderName: string, amount?: number) =>
    activityLogger.logBusinessActivity(customerId, customerName, 'order', 'created', orderId, orderName, amount),

  orderCompleted: (customerId: string, customerName: string, orderId: string, orderName: string, amount?: number) =>
    activityLogger.logBusinessActivity(customerId, customerName, 'order', 'completed', orderId, orderName, amount),

  // Training activities
  trainingScheduled: (customerId: string, customerName: string, trainingName: string, details?: any) =>
    activityLogger.logTrainingActivity(customerId, customerName, trainingName, 'scheduled', details),

  trainingCompleted: (customerId: string, customerName: string, trainingName: string, details?: any) =>
    activityLogger.logTrainingActivity(customerId, customerName, trainingName, 'completed', details),

  // Workflow activities
  workflowStarted: (customerId: string, customerName: string, workflowName: string, stepName: string) =>
    activityLogger.logWorkflowActivity(customerId, customerName, workflowName, stepName, 'started'),

  workflowCompleted: (customerId: string, customerName: string, workflowName: string, stepName: string) =>
    activityLogger.logWorkflowActivity(customerId, customerName, workflowName, stepName, 'completed'),
};
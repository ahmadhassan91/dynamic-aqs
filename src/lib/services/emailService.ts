import {
  EmailTemplate,
  EmailCampaign,
  EmailLog,
  EmailComposer,
  EmailCategory,
  CampaignStatus,
  RecipientStatus,
  EmailStatus,
  CampaignAnalytics,
} from '@/types/email';

class EmailService {
  private templates: EmailTemplate[] = [];
  private campaigns: EmailCampaign[] = [];
  private logs: EmailLog[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock email templates
    this.templates = [
      {
        id: 'tpl-1',
        name: 'Welcome Onboarding',
        subject: 'Welcome to Dynamic AQS - {{customerName}}',
        body: `
          <h2>Welcome {{customerName}}!</h2>
          <p>Thank you for choosing Dynamic AQS. We're excited to partner with you.</p>
          <p>Your Territory Manager, {{territoryManager}}, will be in touch within 24 hours to schedule your initial training session.</p>
          <p>In the meantime, please review the attached getting started guide.</p>
          <p>Best regards,<br>The Dynamic AQS Team</p>
        `,
        category: EmailCategory.ONBOARDING,
        variables: [
          { name: 'customerName', label: 'Customer Name', type: 'text', required: true },
          { name: 'territoryManager', label: 'Territory Manager', type: 'text', required: true },
        ],
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        createdBy: 'admin',
      },
      {
        id: 'tpl-2',
        name: 'Training Reminder',
        subject: 'Training Session Reminder - {{trainingDate}}',
        body: `
          <h2>Training Session Reminder</h2>
          <p>Hi {{customerName}},</p>
          <p>This is a friendly reminder about your upcoming training session:</p>
          <ul>
            <li><strong>Date:</strong> {{trainingDate}}</li>
            <li><strong>Time:</strong> {{trainingTime}}</li>
            <li><strong>Location:</strong> {{location}}</li>
            <li><strong>Trainer:</strong> {{trainerName}}</li>
          </ul>
          <p>Please ensure you have the following materials ready:</p>
          <ul>
            <li>Equipment manuals</li>
            <li>Installation tools</li>
            <li>Safety equipment</li>
          </ul>
          <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
        `,
        category: EmailCategory.TRAINING,
        variables: [
          { name: 'customerName', label: 'Customer Name', type: 'text', required: true },
          { name: 'trainingDate', label: 'Training Date', type: 'date', required: true },
          { name: 'trainingTime', label: 'Training Time', type: 'text', required: true },
          { name: 'location', label: 'Location', type: 'text', required: true },
          { name: 'trainerName', label: 'Trainer Name', type: 'text', required: true },
        ],
        isActive: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        createdBy: 'admin',
      },
      {
        id: 'tpl-3',
        name: 'Order Confirmation',
        subject: 'Order Confirmation - {{orderNumber}}',
        body: `
          <h2>Order Confirmation</h2>
          <p>Dear {{customerName}},</p>
          <p>Thank you for your order! Here are the details:</p>
          <ul>
            <li><strong>Order Number:</strong> {{orderNumber}}</li>
            <li><strong>Order Date:</strong> {{orderDate}}</li>
            <li><strong>Total Amount:</strong> $\{{totalAmount}}</li>
            <li><strong>Expected Ship Date:</strong> {{expectedShipDate}}</li>
          </ul>
          <p>You will receive tracking information once your order ships.</p>
          <p>Thank you for your business!</p>
        `,
        category: EmailCategory.ORDER_CONFIRMATION,
        variables: [
          { name: 'customerName', label: 'Customer Name', type: 'text', required: true },
          { name: 'orderNumber', label: 'Order Number', type: 'text', required: true },
          { name: 'orderDate', label: 'Order Date', type: 'date', required: true },
          { name: 'totalAmount', label: 'Total Amount', type: 'number', required: true },
          { name: 'expectedShipDate', label: 'Expected Ship Date', type: 'date', required: true },
        ],
        isActive: true,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
        createdBy: 'admin',
      },
    ];

    // Mock campaigns
    this.campaigns = [
      {
        id: 'camp-1',
        name: 'Q1 Training Reminders',
        description: 'Quarterly training reminder campaign for all active customers',
        templateId: 'tpl-2',
        recipients: [
          {
            id: 'rec-1',
            email: 'john@abchvac.com',
            name: 'John Smith',
            customerId: 'CUST-001',
            status: RecipientStatus.DELIVERED,
            sentAt: new Date('2024-01-28T10:00:00'),
            deliveredAt: new Date('2024-01-28T10:05:00'),
            openedAt: new Date('2024-01-28T14:30:00'),
          },
          {
            id: 'rec-2',
            email: 'mary@johnsonhvac.com',
            name: 'Mary Johnson',
            customerId: 'CUST-002',
            status: RecipientStatus.OPENED,
            sentAt: new Date('2024-01-28T10:00:00'),
            deliveredAt: new Date('2024-01-28T10:03:00'),
            openedAt: new Date('2024-01-28T16:45:00'),
          },
        ],
        status: CampaignStatus.COMPLETED,
        scheduledAt: new Date('2024-01-28T10:00:00'),
        sentAt: new Date('2024-01-28T10:00:00'),
        completedAt: new Date('2024-01-28T10:30:00'),
        analytics: {
          totalRecipients: 2,
          sent: 2,
          delivered: 2,
          opened: 2,
          clicked: 0,
          bounced: 0,
          unsubscribed: 0,
          failed: 0,
          deliveryRate: 100,
          openRate: 100,
          clickRate: 0,
          bounceRate: 0,
          unsubscribeRate: 0,
        },
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-28'),
        createdBy: 'user-1',
      },
    ];

    // Mock email logs
    this.logs = [
      {
        id: 'log-1',
        campaignId: 'camp-1',
        templateId: 'tpl-2',
        recipientEmail: 'john@abchvac.com',
        recipientName: 'John Smith',
        customerId: 'CUST-001',
        subject: 'Training Session Reminder - February 15, 2024',
        status: EmailStatus.DELIVERED,
        sentAt: new Date('2024-01-28T10:00:00'),
        deliveredAt: new Date('2024-01-28T10:05:00'),
        openedAt: new Date('2024-01-28T14:30:00'),
      },
      {
        id: 'log-2',
        templateId: 'tpl-1',
        recipientEmail: 'new@customer.com',
        recipientName: 'New Customer',
        customerId: 'CUST-003',
        subject: 'Welcome to Dynamic AQS - New Customer',
        status: EmailStatus.SENT,
        sentAt: new Date('2024-01-29T09:15:00'),
      },
    ];
  }

  // Template Management
  async getTemplates(category?: EmailCategory): Promise<EmailTemplate[]> {
    let filtered = this.templates.filter(t => t.isActive);
    if (category) {
      filtered = filtered.filter(t => t.category === category);
    }
    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getTemplate(id: string): Promise<EmailTemplate | null> {
    return this.templates.find(t => t.id === id) || null;
  }

  async createTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `tpl-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    const template = this.templates.find(t => t.id === id);
    if (template) {
      Object.assign(template, updates, { updatedAt: new Date() });
      return template;
    }
    return null;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const index = this.templates.findIndex(t => t.id === id);
    if (index > -1) {
      this.templates.splice(index, 1);
      return true;
    }
    return false;
  }

  // Campaign Management
  async getCampaigns(): Promise<EmailCampaign[]> {
    return this.campaigns.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getCampaign(id: string): Promise<EmailCampaign | null> {
    return this.campaigns.find(c => c.id === id) || null;
  }

  async createCampaign(campaign: Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt' | 'analytics'>): Promise<EmailCampaign> {
    const newCampaign: EmailCampaign = {
      ...campaign,
      id: `camp-${Date.now()}`,
      analytics: {
        totalRecipients: campaign.recipients.length,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        failed: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
        unsubscribeRate: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  async sendCampaign(id: string): Promise<boolean> {
    const campaign = this.campaigns.find(c => c.id === id);
    if (campaign && campaign.status === CampaignStatus.DRAFT) {
      campaign.status = CampaignStatus.SENDING;
      campaign.sentAt = new Date();
      
      // Simulate sending process
      setTimeout(() => {
        campaign.status = CampaignStatus.SENT;
        campaign.completedAt = new Date();
        
        // Update analytics
        campaign.analytics.sent = campaign.recipients.length;
        campaign.analytics.delivered = Math.floor(campaign.recipients.length * 0.95);
        campaign.analytics.opened = Math.floor(campaign.recipients.length * 0.6);
        campaign.analytics.clicked = Math.floor(campaign.recipients.length * 0.1);
        
        campaign.analytics.deliveryRate = (campaign.analytics.delivered / campaign.analytics.totalRecipients) * 100;
        campaign.analytics.openRate = (campaign.analytics.opened / campaign.analytics.delivered) * 100;
        campaign.analytics.clickRate = (campaign.analytics.clicked / campaign.analytics.opened) * 100;
      }, 2000);
      
      return true;
    }
    return false;
  }

  // Email Logs
  async getEmailLogs(customerId?: string): Promise<EmailLog[]> {
    let filtered = this.logs;
    if (customerId) {
      filtered = this.logs.filter(l => l.customerId === customerId);
    }
    return filtered.sort((a, b) => (b.sentAt?.getTime() || 0) - (a.sentAt?.getTime() || 0));
  }

  // Email Composition
  async sendEmail(composer: EmailComposer): Promise<boolean> {
    // Create email log entry
    const log: EmailLog = {
      id: `log-${Date.now()}`,
      templateId: composer.templateId,
      recipientEmail: composer.to[0],
      recipientName: composer.to[0],
      subject: composer.subject,
      status: EmailStatus.QUEUED,
      metadata: {
        trackOpens: composer.trackOpens,
        trackClicks: composer.trackClicks,
        scheduledAt: composer.scheduledAt,
      },
    };

    this.logs.push(log);

    // Simulate sending
    setTimeout(() => {
      log.status = EmailStatus.SENT;
      log.sentAt = new Date();
      
      setTimeout(() => {
        log.status = EmailStatus.DELIVERED;
        log.deliveredAt = new Date();
      }, 1000);
    }, 500);

    return true;
  }

  // Analytics
  async getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics | null> {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    return campaign?.analytics || null;
  }

  async getEmailAnalytics(dateRange?: { start: Date; end: Date }) {
    let filtered = this.logs;
    
    if (dateRange) {
      filtered = this.logs.filter(l => 
        l.sentAt && 
        l.sentAt >= dateRange.start && 
        l.sentAt <= dateRange.end
      );
    }

    const total = filtered.length;
    const sent = filtered.filter(l => l.status !== EmailStatus.QUEUED).length;
    const delivered = filtered.filter(l => l.status === EmailStatus.DELIVERED || l.deliveredAt).length;
    const opened = filtered.filter(l => l.openedAt).length;
    const clicked = filtered.filter(l => l.clickedAt).length;
    const bounced = filtered.filter(l => l.status === EmailStatus.BOUNCED).length;

    return {
      total,
      sent,
      delivered,
      opened,
      clicked,
      bounced,
      deliveryRate: sent > 0 ? (delivered / sent) * 100 : 0,
      openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
      clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
      bounceRate: sent > 0 ? (bounced / sent) * 100 : 0,
    };
  }
}

export const emailService = new EmailService();
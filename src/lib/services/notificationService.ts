import { 
  Notification, 
  NotificationPreferences, 
  NotificationFilter, 
  NotificationType, 
  NotificationCategory, 
  NotificationPriority,
  CommercialNotificationData,
  EscalationRule,
  EscalationStep,
  NotificationTemplate
} from '@/types/notifications';

class NotificationService {
  private notifications: Notification[] = [];
  private preferences: NotificationPreferences | null = null;
  private escalationRules: EscalationRule[] = [];
  private notificationTemplates: NotificationTemplate[] = [];
  private activeEscalations: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeMockData();
    this.initializeCommercialData();
  }

  private initializeMockData() {
    // Mock notifications for demonstration
    this.notifications = [
      {
        id: '1',
        title: 'New Order Submitted',
        message: 'ABC HVAC has submitted a new order for $15,000 worth of equipment.',
        type: NotificationType.INFO,
        category: NotificationCategory.ORDER,
        priority: NotificationPriority.HIGH,
        read: false,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 30),
        actionUrl: '/dealer/orders/ORD-2024-001',
        actionLabel: 'View Order',
        metadata: { orderId: 'ORD-2024-001', customerId: 'CUST-001' }
      },
      {
        id: '2',
        title: 'Training Session Reminder',
        message: 'You have a training session scheduled with Johnson HVAC tomorrow at 2:00 PM.',
        type: NotificationType.WARNING,
        category: NotificationCategory.TRAINING,
        priority: NotificationPriority.MEDIUM,
        read: false,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        actionUrl: '/training',
        actionLabel: 'View Schedule',
        metadata: { trainingId: 'TRN-001', customerId: 'CUST-002' }
      },
      {
        id: '3',
        title: 'Customer Follow-up Required',
        message: 'Smith & Sons HVAC requires follow-up training after their recent equipment installation.',
        type: NotificationType.INFO,
        category: NotificationCategory.CUSTOMER,
        priority: NotificationPriority.MEDIUM,
        read: true,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        actionUrl: '/customers/CUST-003',
        actionLabel: 'View Customer',
        metadata: { customerId: 'CUST-003' }
      },
      {
        id: '4',
        title: 'System Maintenance Scheduled',
        message: 'Scheduled system maintenance will occur tonight from 11:00 PM to 1:00 AM EST.',
        type: NotificationType.WARNING,
        category: NotificationCategory.SYSTEM,
        priority: NotificationPriority.LOW,
        read: true,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        metadata: { maintenanceWindow: '23:00-01:00' }
      },
      {
        id: '5',
        title: 'Integration Error',
        message: 'Failed to sync order data with Acumatica. Manual intervention required.',
        type: NotificationType.ERROR,
        category: NotificationCategory.INTEGRATION,
        priority: NotificationPriority.URGENT,
        read: false,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 15),
        actionUrl: '/admin/integrations',
        actionLabel: 'View Details',
        metadata: { integration: 'acumatica', errorCode: 'SYNC_001' }
      }
    ];

    // Mock preferences
    this.preferences = {
      id: 'pref-1',
      userId: 'user-1',
      emailNotifications: true,
      pushNotifications: true,
      categories: {
        [NotificationCategory.ORDER]: {
          enabled: true,
          email: true,
          push: true,
          priority: NotificationPriority.HIGH
        },
        [NotificationCategory.TRAINING]: {
          enabled: true,
          email: true,
          push: false,
          priority: NotificationPriority.MEDIUM
        },
        [NotificationCategory.CUSTOMER]: {
          enabled: true,
          email: false,
          push: true,
          priority: NotificationPriority.MEDIUM
        },
        [NotificationCategory.SYSTEM]: {
          enabled: true,
          email: true,
          push: false,
          priority: NotificationPriority.LOW
        },
        [NotificationCategory.LEAD]: {
          enabled: true,
          email: true,
          push: true,
          priority: NotificationPriority.HIGH
        },
        [NotificationCategory.INTEGRATION]: {
          enabled: true,
          email: true,
          push: true,
          priority: NotificationPriority.URGENT
        },
        [NotificationCategory.COMMERCIAL_OPPORTUNITY]: {
          enabled: true,
          email: true,
          push: true,
          priority: NotificationPriority.HIGH
        },
        [NotificationCategory.COMMERCIAL_QUOTE]: {
          enabled: true,
          email: true,
          push: true,
          priority: NotificationPriority.HIGH
        },
        [NotificationCategory.COMMERCIAL_ENGINEER]: {
          enabled: true,
          email: false,
          push: true,
          priority: NotificationPriority.MEDIUM
        },
        [NotificationCategory.COMMERCIAL_REP]: {
          enabled: true,
          email: true,
          push: true,
          priority: NotificationPriority.MEDIUM
        }
      },
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '07:00'
      },
      frequency: 'immediate'
    };
  }

  async getNotifications(filter?: NotificationFilter): Promise<Notification[]> {
    let filtered = [...this.notifications];

    if (filter) {
      if (filter.categories) {
        filtered = filtered.filter(n => filter.categories!.includes(n.category));
      }
      if (filter.types) {
        filtered = filtered.filter(n => filter.types!.includes(n.type));
      }
      if (filter.priorities) {
        filtered = filtered.filter(n => filter.priorities!.includes(n.priority));
      }
      if (filter.read !== undefined) {
        filtered = filtered.filter(n => n.read === filter.read);
      }
      if (filter.archived !== undefined) {
        filtered = filtered.filter(n => n.archived === filter.archived);
      }
      if (filter.dateRange) {
        filtered = filtered.filter(n => 
          n.createdAt >= filter.dateRange!.start && 
          n.createdAt <= filter.dateRange!.end
        );
      }
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUnreadCount(): Promise<number> {
    return this.notifications.filter(n => !n.read && !n.archived).length;
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      notification.updatedAt = new Date();
    }
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(n => {
      if (!n.archived) {
        n.read = true;
        n.updatedAt = new Date();
      }
    });
  }

  async archiveNotification(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.archived = true;
      notification.updatedAt = new Date();
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  async getPreferences(): Promise<NotificationPreferences | null> {
    return this.preferences;
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    if (this.preferences) {
      this.preferences = { ...this.preferences, ...preferences };
    }
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.notifications.unshift(newNotification);
    
    // Check for escalation rules
    this.checkEscalationRules(newNotification);
    
    return newNotification;
  }

  // Commercial Notification Methods
  async createCommercialOpportunityNotification(
    type: 'created' | 'updated' | 'phase_changed' | 'high_value' | 'quote_received',
    data: CommercialNotificationData
  ): Promise<Notification> {
    let title: string;
    let message: string;
    let priority = NotificationPriority.MEDIUM;
    let actionUrl: string | undefined;

    switch (type) {
      case 'created':
        title = 'New Commercial Opportunity';
        message = `New opportunity "${data.opportunityName}" created with estimated value of $${data.estimatedValue?.toLocaleString()}`;
        actionUrl = `/commercial/opportunities/${data.opportunityId}`;
        break;
      case 'updated':
        title = 'Opportunity Updated';
        message = `Opportunity "${data.opportunityName}" has been updated`;
        actionUrl = `/commercial/opportunities/${data.opportunityId}`;
        break;
      case 'phase_changed':
        title = 'Sales Phase Changed';
        message = `Opportunity "${data.opportunityName}" moved to ${data.salesPhase} phase`;
        priority = NotificationPriority.HIGH;
        actionUrl = `/commercial/opportunities/${data.opportunityId}`;
        break;
      case 'high_value':
        title = 'High-Value Opportunity Alert';
        message = `High-value opportunity "${data.opportunityName}" ($${data.estimatedValue?.toLocaleString()}) requires attention`;
        priority = NotificationPriority.URGENT;
        actionUrl = `/commercial/opportunities/${data.opportunityId}`;
        break;
      case 'quote_received':
        title = 'Quote Received';
        message = `New quote received for "${data.opportunityName}" - $${data.quoteAmount?.toLocaleString()}`;
        priority = NotificationPriority.HIGH;
        actionUrl = `/commercial/opportunities/${data.opportunityId}`;
        break;
    }

    return this.createNotification({
      title,
      message,
      type: NotificationType.INFO,
      category: NotificationCategory.COMMERCIAL_OPPORTUNITY,
      priority,
      read: false,
      archived: false,
      actionUrl,
      actionLabel: 'View Opportunity',
      metadata: { ...data, notificationType: type }
    });
  }

  async createEngineerContactNotification(
    type: 'rating_changed' | 'follow_up_due' | 'interaction_logged' | 'opportunity_associated',
    data: CommercialNotificationData
  ): Promise<Notification> {
    let title: string;
    let message: string;
    let priority = NotificationPriority.MEDIUM;

    switch (type) {
      case 'rating_changed':
        title = 'Engineer Rating Updated';
        message = `Engineer ${data.engineerName} rating has been updated`;
        break;
      case 'follow_up_due':
        title = 'Engineer Follow-up Due';
        message = `Follow-up with engineer ${data.engineerName} is due`;
        priority = NotificationPriority.HIGH;
        break;
      case 'interaction_logged':
        title = 'New Engineer Interaction';
        message = `New interaction logged with engineer ${data.engineerName}`;
        break;
      case 'opportunity_associated':
        title = 'Engineer Associated with Opportunity';
        message = `Engineer ${data.engineerName} associated with opportunity "${data.opportunityName}"`;
        break;
    }

    return this.createNotification({
      title,
      message,
      type: NotificationType.INFO,
      category: NotificationCategory.COMMERCIAL_ENGINEER,
      priority,
      read: false,
      archived: false,
      actionUrl: `/commercial/engineers/${data.engineerId}`,
      actionLabel: 'View Engineer',
      metadata: { ...data, notificationType: type }
    });
  }

  async createManufacturerRepNotification(
    type: 'quota_alert' | 'performance_update' | 'territory_change' | 'opportunity_assigned',
    data: CommercialNotificationData
  ): Promise<Notification> {
    let title: string;
    let message: string;
    let priority = NotificationPriority.MEDIUM;

    switch (type) {
      case 'quota_alert':
        title = 'Quota Performance Alert';
        message = `Manufacturer rep ${data.manufacturerRepName} quota performance needs attention`;
        priority = NotificationPriority.HIGH;
        break;
      case 'performance_update':
        title = 'Rep Performance Update';
        message = `Performance metrics updated for ${data.manufacturerRepName}`;
        break;
      case 'territory_change':
        title = 'Territory Assignment Changed';
        message = `Territory assignment updated for ${data.manufacturerRepName}`;
        priority = NotificationPriority.HIGH;
        break;
      case 'opportunity_assigned':
        title = 'Opportunity Assigned';
        message = `New opportunity "${data.opportunityName}" assigned to ${data.manufacturerRepName}`;
        break;
    }

    return this.createNotification({
      title,
      message,
      type: NotificationType.INFO,
      category: NotificationCategory.COMMERCIAL_REP,
      priority,
      read: false,
      archived: false,
      actionUrl: `/commercial/reps/${data.manufacturerRepId}`,
      actionLabel: 'View Rep',
      metadata: { ...data, notificationType: type }
    });
  }

  // Escalation Management
  async getEscalationRules(): Promise<EscalationRule[]> {
    return this.escalationRules;
  }

  async createEscalationRule(rule: Omit<EscalationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<EscalationRule> {
    const newRule: EscalationRule = {
      ...rule,
      id: `escalation-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.escalationRules.push(newRule);
    return newRule;
  }

  async updateEscalationRule(id: string, updates: Partial<EscalationRule>): Promise<EscalationRule> {
    const ruleIndex = this.escalationRules.findIndex(r => r.id === id);
    if (ruleIndex === -1) {
      throw new Error('Escalation rule not found');
    }
    
    this.escalationRules[ruleIndex] = {
      ...this.escalationRules[ruleIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    return this.escalationRules[ruleIndex];
  }

  async deleteEscalationRule(id: string): Promise<void> {
    const ruleIndex = this.escalationRules.findIndex(r => r.id === id);
    if (ruleIndex > -1) {
      this.escalationRules.splice(ruleIndex, 1);
    }
  }

  private checkEscalationRules(notification: Notification): void {
    const applicableRules = this.escalationRules.filter(rule => 
      rule.isActive && 
      rule.category === notification.category &&
      this.meetsEscalationConditions(notification, rule.conditions)
    );

    applicableRules.forEach(rule => {
      this.startEscalationProcess(notification, rule);
    });
  }

  private meetsEscalationConditions(notification: Notification, conditions: EscalationRule['conditions']): boolean {
    const metadata = notification.metadata as CommercialNotificationData;
    
    if (conditions.valueThreshold && metadata?.estimatedValue && metadata.estimatedValue < conditions.valueThreshold) {
      return false;
    }
    
    if (conditions.priorityLevel && notification.priority !== conditions.priorityLevel) {
      return false;
    }
    
    if (conditions.salesPhase && metadata?.salesPhase && !conditions.salesPhase.includes(metadata.salesPhase)) {
      return false;
    }
    
    if (conditions.marketSegment && metadata?.marketSegment && !conditions.marketSegment.includes(metadata.marketSegment)) {
      return false;
    }
    
    return true;
  }

  private startEscalationProcess(notification: Notification, rule: EscalationRule): void {
    rule.escalationSteps.forEach(step => {
      const timeout = setTimeout(() => {
        this.executeEscalationStep(notification, step, rule);
      }, step.delayMinutes * 60 * 1000);
      
      this.activeEscalations.set(`${notification.id}-${step.stepNumber}`, timeout);
    });
  }

  private executeEscalationStep(notification: Notification, step: EscalationStep, rule: EscalationRule): void {
    // Check if escalation conditions are still met
    if (step.conditions?.stillUnread && notification.read) {
      return;
    }
    
    // Create escalation notification
    this.createNotification({
      title: `Escalation: ${notification.title}`,
      message: `Escalated notification from rule "${rule.name}": ${notification.message}`,
      type: NotificationType.WARNING,
      category: notification.category,
      priority: NotificationPriority.URGENT,
      read: false,
      archived: false,
      actionUrl: notification.actionUrl,
      actionLabel: notification.actionLabel,
      metadata: {
        ...notification.metadata,
        escalationRuleId: rule.id,
        escalationStep: step.stepNumber,
        originalNotificationId: notification.id
      }
    });
    
    // In a real implementation, this would send emails/SMS to recipients
    console.log(`Escalation executed for notification ${notification.id}, step ${step.stepNumber}`);
  }

  // Template Management
  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    return this.notificationTemplates;
  }

  async createNotificationTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationTemplate> {
    const newTemplate: NotificationTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.notificationTemplates.push(newTemplate);
    return newTemplate;
  }

  // Cross-functional team notifications for large opportunities
  async notifyLargeOpportunityTeam(opportunityData: CommercialNotificationData): Promise<void> {
    if (!opportunityData.estimatedValue || opportunityData.estimatedValue < 250000) {
      return; // Only notify for opportunities over $250k
    }

    const teamNotifications = [
      {
        title: 'Large Opportunity Alert - Sales Team',
        message: `High-value opportunity "${opportunityData.opportunityName}" ($${opportunityData.estimatedValue.toLocaleString()}) requires sales team coordination`,
        recipients: ['sales-team']
      },
      {
        title: 'Large Opportunity Alert - Engineering Support',
        message: `Technical support may be needed for opportunity "${opportunityData.opportunityName}" ($${opportunityData.estimatedValue.toLocaleString()})`,
        recipients: ['engineering-support']
      },
      {
        title: 'Large Opportunity Alert - Management',
        message: `Management attention requested for opportunity "${opportunityData.opportunityName}" ($${opportunityData.estimatedValue.toLocaleString()})`,
        recipients: ['management']
      }
    ];

    for (const notif of teamNotifications) {
      await this.createNotification({
        title: notif.title,
        message: notif.message,
        type: NotificationType.INFO,
        category: NotificationCategory.COMMERCIAL_OPPORTUNITY,
        priority: NotificationPriority.URGENT,
        read: false,
        archived: false,
        actionUrl: `/commercial/opportunities/${opportunityData.opportunityId}`,
        actionLabel: 'View Opportunity',
        metadata: {
          ...opportunityData,
          teamNotification: true,
          recipients: notif.recipients
        }
      });
    }
  }

  private initializeCommercialData(): void {
    // Initialize escalation rules
    this.escalationRules = [
      {
        id: 'escalation-1',
        name: 'High-Value Opportunity Escalation',
        category: NotificationCategory.COMMERCIAL_OPPORTUNITY,
        conditions: {
          valueThreshold: 500000,
          priorityLevel: NotificationPriority.HIGH
        },
        escalationSteps: [
          {
            stepNumber: 1,
            delayMinutes: 30,
            recipients: ['regional-sales-manager'],
            notificationMethods: ['email', 'push'],
            template: 'high-value-opportunity-alert',
            conditions: { stillUnread: true }
          },
          {
            stepNumber: 2,
            delayMinutes: 120,
            recipients: ['sales-director'],
            notificationMethods: ['email', 'push', 'sms'],
            template: 'urgent-opportunity-alert',
            conditions: { stillUnread: true }
          }
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'escalation-2',
        name: 'Quote Response Escalation',
        category: NotificationCategory.COMMERCIAL_QUOTE,
        conditions: {
          timeThreshold: 24,
          priorityLevel: NotificationPriority.HIGH
        },
        escalationSteps: [
          {
            stepNumber: 1,
            delayMinutes: 60,
            recipients: ['manufacturer-rep'],
            notificationMethods: ['email'],
            template: 'quote-follow-up-reminder'
          }
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize notification templates
    this.notificationTemplates = [
      {
        id: 'template-1',
        name: 'High-Value Opportunity Alert',
        category: NotificationCategory.COMMERCIAL_OPPORTUNITY,
        subject: 'High-Value Opportunity Requires Attention',
        body: 'A high-value opportunity "{{opportunityName}}" worth ${{estimatedValue}} has been created and requires immediate attention. Market segment: {{marketSegment}}. Current phase: {{salesPhase}}.',
        variables: ['opportunityName', 'estimatedValue', 'marketSegment', 'salesPhase'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'template-2',
        name: 'Engineer Follow-up Reminder',
        category: NotificationCategory.COMMERCIAL_ENGINEER,
        subject: 'Engineer Follow-up Due',
        body: 'Follow-up with engineer {{engineerName}} is now due. Last contact was on {{lastContactDate}}. Current rating: {{rating}}.',
        variables: ['engineerName', 'lastContactDate', 'rating'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Add some commercial notifications to the mock data
    this.notifications.unshift(
      {
        id: 'comm-1',
        title: 'High-Value Commercial Opportunity',
        message: 'New $750,000 healthcare facility opportunity requires immediate attention from the commercial team.',
        type: NotificationType.INFO,
        category: NotificationCategory.COMMERCIAL_OPPORTUNITY,
        priority: NotificationPriority.URGENT,
        read: false,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 15),
        actionUrl: '/commercial/opportunities/opp_1',
        actionLabel: 'View Opportunity',
        metadata: { 
          opportunityId: 'opp_1', 
          opportunityName: 'Regional Medical Center HVAC Upgrade',
          estimatedValue: 750000,
          marketSegment: 'Healthcare',
          salesPhase: 'Preliminary Quote'
        }
      },
      {
        id: 'comm-2',
        title: 'Engineer Follow-up Required',
        message: 'Follow-up with John Smith at ABC Engineering is overdue. Last contact was 2 weeks ago.',
        type: NotificationType.WARNING,
        category: NotificationCategory.COMMERCIAL_ENGINEER,
        priority: NotificationPriority.HIGH,
        read: false,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60),
        actionUrl: '/commercial/engineers/eng_1',
        actionLabel: 'View Engineer',
        metadata: { 
          engineerId: 'eng_1', 
          engineerName: 'John Smith',
          lastContactDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        }
      },
      {
        id: 'comm-3',
        title: 'Quote Submitted Successfully',
        message: 'Quote for $125,000 submitted for University Campus Renovation project.',
        type: NotificationType.SUCCESS,
        category: NotificationCategory.COMMERCIAL_QUOTE,
        priority: NotificationPriority.MEDIUM,
        read: true,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        actionUrl: '/commercial/opportunities/opp_2',
        actionLabel: 'View Quote',
        metadata: { 
          opportunityId: 'opp_2', 
          quoteId: 'quote_1',
          quoteAmount: 125000,
          opportunityName: 'University Campus Renovation'
        }
      }
    );
  }
}

export const notificationService = new NotificationService();
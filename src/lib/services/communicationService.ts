import {
  Communication,
  CommunicationType,
  CommunicationDirection,
  CommunicationStatus,
  CommunicationPriority,
  CommunicationFilter,
  CommunicationTemplate,
  CommunicationAnalytics,
  QuickResponse,
} from '@/types/communication';

class CommunicationService {
  private communications: Communication[] = [];
  private templates: CommunicationTemplate[] = [];
  private quickResponses: QuickResponse[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock communications
    this.communications = [
      {
        id: 'comm-1',
        customerId: 'CUST-001',
        customerName: 'ABC HVAC',
        type: CommunicationType.EMAIL,
        direction: CommunicationDirection.OUTBOUND,
        subject: 'Training Session Confirmation',
        content: 'Hi John, this is to confirm your training session scheduled for tomorrow at 2:00 PM. Please ensure you have all the necessary equipment ready.',
        status: CommunicationStatus.COMPLETED,
        priority: CommunicationPriority.MEDIUM,
        createdAt: new Date('2024-01-28T10:00:00'),
        updatedAt: new Date('2024-01-28T10:00:00'),
        createdBy: 'user-1',
        completedAt: new Date('2024-01-28T10:05:00'),
        metadata: {
          emailId: 'email-123',
          duration: 5,
        },
        tags: ['training', 'confirmation'],
      },
      {
        id: 'comm-2',
        customerId: 'CUST-002',
        customerName: 'Johnson HVAC',
        type: CommunicationType.PHONE_CALL,
        direction: CommunicationDirection.INBOUND,
        subject: 'Equipment Installation Question',
        content: 'Customer called asking about proper installation procedures for the new heat pump unit. Provided detailed guidance and scheduled follow-up training.',
        status: CommunicationStatus.COMPLETED,
        priority: CommunicationPriority.HIGH,
        createdAt: new Date('2024-01-27T14:30:00'),
        updatedAt: new Date('2024-01-27T15:00:00'),
        createdBy: 'user-1',
        completedAt: new Date('2024-01-27T15:00:00'),
        metadata: {
          phoneNumber: '+1-555-0123',
          duration: 30,
          outcome: 'Scheduled follow-up training',
          nextAction: 'Schedule training session within 1 week',
        },
        tags: ['installation', 'support'],
      },
      {
        id: 'comm-3',
        customerId: 'CUST-003',
        customerName: 'Smith & Sons HVAC',
        type: CommunicationType.VISIT,
        direction: CommunicationDirection.OUTBOUND,
        subject: 'On-site Training Visit',
        content: 'Conducted comprehensive on-site training for new equipment installation. Covered safety procedures, installation best practices, and troubleshooting.',
        status: CommunicationStatus.COMPLETED,
        priority: CommunicationPriority.HIGH,
        createdAt: new Date('2024-01-26T09:00:00'),
        updatedAt: new Date('2024-01-26T12:00:00'),
        createdBy: 'user-1',
        completedAt: new Date('2024-01-26T12:00:00'),
        metadata: {
          visitType: 'training',
          duration: 180,
          trainingType: 'installation',
          outcome: 'Successfully completed training',
        },
        tags: ['training', 'on-site', 'installation'],
      },
      {
        id: 'comm-4',
        customerId: 'CUST-001',
        customerName: 'ABC HVAC',
        type: CommunicationType.FOLLOW_UP,
        direction: CommunicationDirection.OUTBOUND,
        subject: 'Post-Training Follow-up',
        content: 'Follow up on last week\'s training session. Check if there are any questions or additional support needed.',
        status: CommunicationStatus.PENDING,
        priority: CommunicationPriority.MEDIUM,
        createdAt: new Date('2024-01-29T08:00:00'),
        updatedAt: new Date('2024-01-29T08:00:00'),
        createdBy: 'user-1',
        assignedTo: 'user-1',
        dueDate: new Date('2024-02-02T17:00:00'),
        tags: ['follow-up', 'training'],
      },
      {
        id: 'comm-5',
        customerId: 'CUST-004',
        customerName: 'Elite HVAC Services',
        type: CommunicationType.MEETING,
        direction: CommunicationDirection.OUTBOUND,
        subject: 'Quarterly Business Review',
        content: 'Scheduled quarterly business review meeting to discuss performance, upcoming opportunities, and training needs.',
        status: CommunicationStatus.PENDING,
        priority: CommunicationPriority.HIGH,
        createdAt: new Date('2024-01-29T10:00:00'),
        updatedAt: new Date('2024-01-29T10:00:00'),
        createdBy: 'user-1',
        assignedTo: 'user-1',
        dueDate: new Date('2024-02-05T14:00:00'),
        metadata: {
          meetingLocation: 'Customer Office',
          duration: 60,
        },
        tags: ['meeting', 'quarterly-review'],
      },
    ];

    // Mock templates
    this.templates = [
      {
        id: 'tpl-comm-1',
        name: 'Training Reminder Call',
        type: CommunicationType.PHONE_CALL,
        subject: 'Training Session Reminder - {{trainingDate}}',
        content: 'Hi {{customerName}}, this is a reminder about your upcoming training session on {{trainingDate}} at {{trainingTime}}. Please ensure you have {{equipment}} ready. If you need to reschedule, please let us know at least 24 hours in advance.',
        category: 'Training',
        isActive: true,
        variables: [
          { name: 'customerName', label: 'Customer Name', type: 'text', required: true },
          { name: 'trainingDate', label: 'Training Date', type: 'date', required: true },
          { name: 'trainingTime', label: 'Training Time', type: 'text', required: true },
          { name: 'equipment', label: 'Required Equipment', type: 'text', required: false },
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        createdBy: 'admin',
      },
      {
        id: 'tpl-comm-2',
        name: 'Follow-up Email',
        type: CommunicationType.EMAIL,
        subject: 'Following up on {{subject}}',
        content: 'Hi {{customerName}},\n\nI wanted to follow up on our recent {{interactionType}} regarding {{subject}}. {{followUpMessage}}\n\nPlease let me know if you have any questions or need additional support.\n\nBest regards,\n{{senderName}}',
        category: 'Follow-up',
        isActive: true,
        variables: [
          { name: 'customerName', label: 'Customer Name', type: 'text', required: true },
          { name: 'subject', label: 'Subject', type: 'text', required: true },
          { name: 'interactionType', label: 'Interaction Type', type: 'text', required: true },
          { name: 'followUpMessage', label: 'Follow-up Message', type: 'text', required: true },
          { name: 'senderName', label: 'Sender Name', type: 'text', required: true },
        ],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        createdBy: 'admin',
      },
    ];

    // Mock quick responses
    this.quickResponses = [
      {
        id: 'qr-1',
        name: 'Training Confirmation',
        content: 'Thank you for confirming your training session. We look forward to working with you.',
        type: CommunicationType.EMAIL,
        category: 'Training',
        isActive: true,
        usageCount: 15,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        createdBy: 'admin',
      },
      {
        id: 'qr-2',
        name: 'Installation Support',
        content: 'I understand you\'re having installation questions. Let me connect you with our technical support team who can provide detailed guidance.',
        type: CommunicationType.PHONE_CALL,
        category: 'Support',
        isActive: true,
        usageCount: 8,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
        createdBy: 'admin',
      },
      {
        id: 'qr-3',
        name: 'Schedule Follow-up',
        content: 'I\'ll schedule a follow-up call within the next few days to check on your progress and answer any additional questions.',
        type: CommunicationType.FOLLOW_UP,
        category: 'Follow-up',
        isActive: true,
        usageCount: 12,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
        createdBy: 'admin',
      },
    ];
  }

  // Communication Management
  async getCommunications(filter?: CommunicationFilter): Promise<Communication[]> {
    let filtered = [...this.communications];

    if (filter) {
      if (filter.customerId) {
        filtered = filtered.filter(c => c.customerId === filter.customerId);
      }
      if (filter.types && filter.types.length > 0) {
        filtered = filtered.filter(c => filter.types!.includes(c.type));
      }
      if (filter.directions && filter.directions.length > 0) {
        filtered = filtered.filter(c => filter.directions!.includes(c.direction));
      }
      if (filter.statuses && filter.statuses.length > 0) {
        filtered = filtered.filter(c => filter.statuses!.includes(c.status));
      }
      if (filter.priorities && filter.priorities.length > 0) {
        filtered = filtered.filter(c => filter.priorities!.includes(c.priority));
      }
      if (filter.assignedTo) {
        filtered = filtered.filter(c => c.assignedTo === filter.assignedTo);
      }
      if (filter.createdBy) {
        filtered = filtered.filter(c => c.createdBy === filter.createdBy);
      }
      if (filter.dateRange) {
        filtered = filtered.filter(c => 
          c.createdAt >= filter.dateRange!.start && 
          c.createdAt <= filter.dateRange!.end
        );
      }
      if (filter.tags && filter.tags.length > 0) {
        filtered = filtered.filter(c => 
          c.tags && c.tags.some(tag => filter.tags!.includes(tag))
        );
      }
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        filtered = filtered.filter(c => 
          c.subject.toLowerCase().includes(query) ||
          c.content.toLowerCase().includes(query) ||
          c.customerName.toLowerCase().includes(query)
        );
      }
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getCommunication(id: string): Promise<Communication | null> {
    return this.communications.find(c => c.id === id) || null;
  }

  async createCommunication(communication: Omit<Communication, 'id' | 'createdAt' | 'updatedAt'>): Promise<Communication> {
    const newCommunication: Communication = {
      ...communication,
      id: `comm-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.communications.unshift(newCommunication);
    return newCommunication;
  }

  async updateCommunication(id: string, updates: Partial<Communication>): Promise<Communication | null> {
    const communication = this.communications.find(c => c.id === id);
    if (communication) {
      Object.assign(communication, updates, { updatedAt: new Date() });
      return communication;
    }
    return null;
  }

  async deleteCommunication(id: string): Promise<boolean> {
    const index = this.communications.findIndex(c => c.id === id);
    if (index > -1) {
      this.communications.splice(index, 1);
      return true;
    }
    return false;
  }

  // Template Management
  async getTemplates(type?: CommunicationType): Promise<CommunicationTemplate[]> {
    let filtered = this.templates.filter(t => t.isActive);
    if (type) {
      filtered = filtered.filter(t => t.type === type);
    }
    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async createTemplate(template: Omit<CommunicationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommunicationTemplate> {
    const newTemplate: CommunicationTemplate = {
      ...template,
      id: `tpl-comm-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  // Quick Responses
  async getQuickResponses(type?: CommunicationType): Promise<QuickResponse[]> {
    let filtered = this.quickResponses.filter(qr => qr.isActive);
    if (type) {
      filtered = filtered.filter(qr => qr.type === type);
    }
    return filtered.sort((a, b) => b.usageCount - a.usageCount);
  }

  async createQuickResponse(quickResponse: Omit<QuickResponse, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<QuickResponse> {
    const newQuickResponse: QuickResponse = {
      ...quickResponse,
      id: `qr-${Date.now()}`,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.quickResponses.push(newQuickResponse);
    return newQuickResponse;
  }

  async useQuickResponse(id: string): Promise<void> {
    const quickResponse = this.quickResponses.find(qr => qr.id === id);
    if (quickResponse) {
      quickResponse.usageCount++;
      quickResponse.updatedAt = new Date();
    }
  }

  // Analytics
  async getAnalytics(dateRange?: { start: Date; end: Date }): Promise<CommunicationAnalytics> {
    let filtered = this.communications;
    
    if (dateRange) {
      filtered = this.communications.filter(c => 
        c.createdAt >= dateRange.start && 
        c.createdAt <= dateRange.end
      );
    }

    const byType = {} as Record<CommunicationType, number>;
    const byStatus = {} as Record<CommunicationStatus, number>;
    const byPriority = {} as Record<CommunicationPriority, number>;

    // Initialize counters
    Object.values(CommunicationType).forEach(type => byType[type] = 0);
    Object.values(CommunicationStatus).forEach(status => byStatus[status] = 0);
    Object.values(CommunicationPriority).forEach(priority => byPriority[priority] = 0);

    // Count communications
    filtered.forEach(comm => {
      byType[comm.type]++;
      byStatus[comm.status]++;
      byPriority[comm.priority]++;
    });

    const completed = filtered.filter(c => c.status === CommunicationStatus.COMPLETED);
    const overdue = filtered.filter(c => 
      c.status === CommunicationStatus.PENDING && 
      c.dueDate && 
      c.dueDate < new Date()
    );
    const upcoming = filtered.filter(c => 
      c.status === CommunicationStatus.PENDING && 
      c.dueDate && 
      c.dueDate > new Date() && 
      c.dueDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
    );

    // Calculate average response time (mock calculation)
    const avgResponseTime = completed.length > 0 ? 
      completed.reduce((sum, c) => {
        if (c.completedAt && c.createdAt) {
          return sum + (c.completedAt.getTime() - c.createdAt.getTime()) / (1000 * 60 * 60);
        }
        return sum;
      }, 0) / completed.length : 0;

    const completionRate = filtered.length > 0 ? (completed.length / filtered.length) * 100 : 0;

    // Generate trends data (mock)
    const trendsData: Array<{ date: string; count: number; type: CommunicationType }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayComms = filtered.filter(c => 
        c.createdAt.toDateString() === date.toDateString()
      );
      
      Object.values(CommunicationType).forEach(type => {
        const count = dayComms.filter(c => c.type === type).length;
        if (count > 0) {
          trendsData.push({
            date: date.toISOString().split('T')[0],
            count,
            type,
          });
        }
      });
    }

    return {
      totalCommunications: filtered.length,
      byType,
      byStatus,
      byPriority,
      averageResponseTime: avgResponseTime,
      completionRate,
      overdueCount: overdue.length,
      upcomingCount: upcoming.length,
      trendsData,
    };
  }
}

export const communicationService = new CommunicationService();
import { faker } from '@faker-js/faker';
import type { Activity } from '@/components/activities/ActivityTimeline';

// Mock activity data store
let mockActivities: Activity[] = [];

// Initialize with some sample activities
export function initializeMockActivities(customerIds: string[], customerNames?: string[]) {
  if (mockActivities.length > 0) return mockActivities;

  const activityTypes: Activity['type'][] = ['call', 'email', 'meeting', 'training', 'note', 'visit', 'quote', 'order', 'system'];
  const outcomes: Activity['outcome'][] = ['positive', 'negative', 'neutral', 'completed', 'pending', 'cancelled'];
  const categories: Activity['category'][] = ['sales', 'support', 'training', 'administrative', 'technical', 'marketing'];
  const priorities: Activity['priority'][] = ['low', 'medium', 'high', 'urgent'];
  const sources: Activity['source'][] = ['manual', 'automatic', 'system', 'integration'];
  
  const sampleTitles = {
    call: [
      'Discovery Call',
      'Follow-up Call',
      'Technical Support Call',
      'Sales Call',
      'Check-in Call',
    ],
    email: [
      'Product Information Sent',
      'Proposal Follow-up',
      'Technical Documentation',
      'Meeting Confirmation',
      'Thank You Email',
    ],
    meeting: [
      'On-site Consultation',
      'Product Demonstration',
      'Contract Review Meeting',
      'Quarterly Business Review',
      'Installation Planning',
    ],
    training: [
      'Product Installation Training',
      'Maintenance Training',
      'Sales Training Session',
      'Technical Certification',
      'Safety Training',
    ],
    note: [
      'Customer Feedback',
      'Installation Notes',
      'Service Request',
      'Complaint Resolution',
      'General Update',
    ],
    visit: [
      'Site Assessment Visit',
      'Installation Visit',
      'Maintenance Visit',
      'Customer Site Inspection',
      'Technical Consultation Visit',
    ],
    quote: [
      'Quote Prepared',
      'Pricing Proposal Sent',
      'Custom Quote Generated',
      'Revised Quote Submitted',
      'Quote Follow-up',
    ],
    order: [
      'Order Received',
      'Order Processed',
      'Order Shipped',
      'Order Delivered',
      'Order Completed',
    ],
    system: [
      'Account Created',
      'Status Updated',
      'Workflow Triggered',
      'Integration Sync',
      'Automated Notification',
    ],
  };

  const sampleDescriptions = {
    call: [
      'Discussed customer requirements and provided initial consultation.',
      'Followed up on previous proposal and answered technical questions.',
      'Provided technical support for installation issues.',
      'Presented new product features and pricing options.',
      'Regular check-in to ensure customer satisfaction.',
    ],
    email: [
      'Sent comprehensive product brochures and technical specifications.',
      'Followed up on proposal with additional pricing options.',
      'Provided installation guides and technical documentation.',
      'Confirmed meeting details and agenda items.',
      'Thanked customer for their business and feedback.',
    ],
    meeting: [
      'Conducted on-site assessment and provided detailed consultation.',
      'Demonstrated product features and capabilities.',
      'Reviewed contract terms and conditions with customer.',
      'Quarterly review of account performance and future opportunities.',
      'Planned installation timeline and resource requirements.',
    ],
    training: [
      'Comprehensive training on product installation procedures.',
      'Maintenance best practices and troubleshooting techniques.',
      'Sales training on product features and competitive advantages.',
      'Technical certification program completion.',
      'Safety protocols and compliance training.',
    ],
    note: [
      'Customer provided positive feedback on service quality.',
      'Documented installation specifications and requirements.',
      'Customer requested additional service support.',
      'Successfully resolved customer complaint.',
      'General account update and status notes.',
    ],
    visit: [
      'Conducted comprehensive site assessment for installation requirements.',
      'Performed installation and system setup at customer location.',
      'Completed scheduled maintenance and system inspection.',
      'Inspected customer site for compliance and safety requirements.',
      'Provided on-site technical consultation and recommendations.',
    ],
    quote: [
      'Prepared detailed quote based on customer requirements.',
      'Generated pricing proposal with multiple configuration options.',
      'Created custom quote for specialized customer needs.',
      'Submitted revised quote with updated pricing and terms.',
      'Followed up on quote status and addressed customer questions.',
    ],
    order: [
      'Received and confirmed customer order details.',
      'Processed order and initiated fulfillment workflow.',
      'Order shipped with tracking information provided.',
      'Order successfully delivered to customer location.',
      'Order completed and customer satisfaction confirmed.',
    ],
    system: [
      'Customer account automatically created in system.',
      'Customer status updated based on workflow progression.',
      'Automated workflow triggered by customer action.',
      'Data synchronized from external integration.',
      'Automated notification sent to customer and team.',
    ],
  };

  const commonTags = [
    'discovery', 'follow-up', 'proposal', 'product-info', 'consultation',
    'training', 'feedback', 'support', 'installation', 'maintenance',
    'sales', 'technical', 'certification', 'compliance', 'planning',
    'site-visit', 'assessment', 'quote', 'order', 'delivery', 'urgent',
    'high-priority', 'customer-satisfaction', 'technical-support'
  ];

  // Generate activities for each customer
  customerIds.forEach((customerId, index) => {
    const customerName = customerNames?.[index] || `Customer ${index + 1}`;
    const numActivities = faker.number.int({ min: 8, max: 25 });
    
    for (let i = 0; i < numActivities; i++) {
      const type = faker.helpers.arrayElement(activityTypes);
      const title = faker.helpers.arrayElement(sampleTitles[type]);
      const description = faker.helpers.arrayElement(sampleDescriptions[type]);
      const category = faker.helpers.arrayElement(categories);
      const priority = faker.helpers.arrayElement(priorities);
      const source = faker.helpers.arrayElement(sources);
      const date = faker.date.between({ 
        from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), 
        to: new Date() 
      });
      
      const activity: Activity = {
        id: faker.string.uuid(),
        customerId,
        customerName,
        type,
        title,
        description,
        date,
        duration: ['call', 'meeting', 'training', 'visit'].includes(type) 
          ? faker.number.int({ min: 15, max: 240 }) 
          : undefined,
        outcome: faker.helpers.arrayElement(outcomes),
        participants: faker.helpers.maybe(() => 
          Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => 
            faker.person.fullName()
          ), { probability: 0.4 }
        ),
        followUpRequired: faker.datatype.boolean(0.3),
        followUpDate: faker.helpers.maybe(() => {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + faker.number.int({ min: 1, max: 30 }));
          return futureDate;
        }, { probability: 0.3 }),
        tags: faker.helpers.arrayElements(commonTags, { min: 1, max: 4 }),
        category,
        priority,
        source,
        location: ['meeting', 'visit', 'training'].includes(type) && faker.datatype.boolean(0.6)
          ? faker.location.streetAddress()
          : undefined,
        relatedRecords: faker.helpers.maybe(() => [
          {
            type: faker.helpers.arrayElement(['lead', 'opportunity', 'order', 'quote', 'training'] as const),
            id: faker.string.uuid(),
            name: faker.commerce.productName(),
          }
        ], { probability: 0.3 }),
        createdBy: faker.string.uuid(),
        createdAt: faker.date.recent({ days: 7 }),
        updatedAt: faker.date.recent({ days: 3 }),
      };

      mockActivities.push(activity);
    }
  });

  // Sort by date (newest first)
  mockActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return mockActivities;
}

// Activity service functions
export const activityService = {
  // Get all activities
  getAllActivities(): Activity[] {
    return mockActivities;
  },

  // Get activities for a specific customer
  getCustomerActivities(customerId: string): Activity[] {
    return mockActivities.filter(activity => activity.customerId === customerId);
  },

  // Get recent activities (last 30 days)
  getRecentActivities(limit: number = 50): Activity[] {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return mockActivities
      .filter(activity => new Date(activity.date) >= thirtyDaysAgo)
      .slice(0, limit);
  },

  // Create new activity
  createActivity(activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Activity {
    const newActivity: Activity = {
      ...activityData,
      id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockActivities.unshift(newActivity); // Add to beginning (newest first)
    return newActivity;
  },

  // Update existing activity
  updateActivity(id: string, updates: Partial<Activity>): Activity | null {
    const index = mockActivities.findIndex(activity => activity.id === id);
    if (index === -1) return null;

    mockActivities[index] = {
      ...mockActivities[index],
      ...updates,
      updatedAt: new Date(),
    };

    return mockActivities[index];
  },

  // Delete activity
  deleteActivity(id: string): boolean {
    const index = mockActivities.findIndex(activity => activity.id === id);
    if (index === -1) return false;

    mockActivities.splice(index, 1);
    return true;
  },

  // Get activities by type
  getActivitiesByType(type: Activity['type']): Activity[] {
    return mockActivities.filter(activity => activity.type === type);
  },

  // Get activities requiring follow-up
  getFollowUpActivities(): Activity[] {
    return mockActivities.filter(activity => 
      activity.followUpRequired && 
      activity.followUpDate && 
      new Date(activity.followUpDate) <= new Date()
    );
  },

  // Search activities
  searchActivities(query: string): Activity[] {
    const lowercaseQuery = query.toLowerCase();
    return mockActivities.filter(activity =>
      activity.title.toLowerCase().includes(lowercaseQuery) ||
      activity.description.toLowerCase().includes(lowercaseQuery) ||
      activity.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Get activity statistics
  getActivityStats(customerId?: string): {
    total: number;
    byType: Record<Activity['type'], number>;
    byOutcome: Record<Activity['outcome'], number>;
    thisWeek: number;
    thisMonth: number;
    followUpsPending: number;
  } {
    const activities = customerId 
      ? mockActivities.filter(a => a.customerId === customerId)
      : mockActivities;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const byType: Record<Activity['type'], number> = {
      call: 0,
      email: 0,
      meeting: 0,
      training: 0,
      note: 0,
      system: 0,
      visit: 0,
      quote: 0,
      order: 0,
    };

    const byOutcome: Record<Activity['outcome'], number> = {
      positive: 0,
      negative: 0,
      neutral: 0,
      completed: 0,
      pending: 0,
      cancelled: 0,
    };

    let thisWeek = 0;
    let thisMonth = 0;
    let followUpsPending = 0;

    activities.forEach(activity => {
      byType[activity.type]++;
      byOutcome[activity.outcome]++;

      const activityDate = new Date(activity.date);
      if (activityDate >= weekAgo) thisWeek++;
      if (activityDate >= monthAgo) thisMonth++;

      if (activity.followUpRequired && activity.followUpDate && 
          new Date(activity.followUpDate) <= now) {
        followUpsPending++;
      }
    });

    return {
      total: activities.length,
      byType,
      byOutcome,
      thisWeek,
      thisMonth,
      followUpsPending,
    };
  },
};

// Export types
export type { Activity };
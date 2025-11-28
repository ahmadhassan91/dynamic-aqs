import {
  CommercialOpportunity,
  EngineerContact,
  Organization,
  ManufacturerRep,
  Quote,
  OpportunityFilters,
  EngineerFilters,
  OpportunityMetrics,
  CommercialReportData,
  SalesPhase,
  MarketSegment,
  EngineerRating,
  OrganizationType,
  QuoteStatus,
  InteractionType,
  NoteType,
  RatingChange,
  PipelineAnalytics,
  RelationshipTask,
  WorkflowTemplate,
  TaskExecution,
  TaskMetrics,
  TaskPriority,
  TaskCategory,
  LeadSource,
  RepRating
} from '@/types/commercial';
import { pricingIntegrationService } from './pricingIntegrationService';

class CommercialService {
  private baseUrl = '/api/commercial';

  // Opportunity Management
  async getOpportunities(filters?: OpportunityFilters): Promise<CommercialOpportunity[]> {
    // Mock data for frontend development
    return this.generateMockOpportunities();
  }

  async getOpportunityById(id: string): Promise<CommercialOpportunity | null> {
    const opportunities = await this.getOpportunities();
    return opportunities.find(opp => opp.id === id) || null;
  }

  async createOpportunity(opportunity: Omit<CommercialOpportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommercialOpportunity> {
    const newOpportunity: CommercialOpportunity = {
      ...opportunity,
      id: `opp_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newOpportunity;
  }

  async updateOpportunity(id: string, updates: Partial<CommercialOpportunity>): Promise<CommercialOpportunity> {
    const opportunity = await this.getOpportunityById(id);
    if (!opportunity) {
      throw new Error('Opportunity not found');
    }
    return {
      ...opportunity,
      ...updates,
      updatedAt: new Date()
    };
  }

  async deleteOpportunity(id: string): Promise<void> {
    // Mock implementation
    console.log(`Deleting opportunity ${id}`);
  }

  // Engineer Contact Management
  async getEngineers(filters?: EngineerFilters): Promise<EngineerContact[]> {
    return this.generateMockEngineers();
  }

  async getEngineerById(id: string): Promise<EngineerContact | null> {
    const engineers = await this.getEngineers();
    return engineers.find(eng => eng.id === id) || null;
  }

  async createEngineer(engineer: Omit<EngineerContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<EngineerContact> {
    const newEngineer: EngineerContact = {
      ...engineer,
      id: `eng_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newEngineer;
  }

  async updateEngineer(id: string, updates: Partial<EngineerContact>): Promise<EngineerContact> {
    const engineer = await this.getEngineerById(id);
    if (!engineer) {
      throw new Error('Engineer not found');
    }
    return {
      ...engineer,
      ...updates,
      updatedAt: new Date()
    };
  }

  async updateEngineerRating(id: string, newRating: EngineerRating, reason: string, changedBy: string): Promise<EngineerContact> {
    const engineer = await this.getEngineerById(id);
    if (!engineer) {
      throw new Error('Engineer not found');
    }

    const ratingChange: RatingChange = {
      previousRating: engineer.rating,
      newRating,
      reason,
      changedBy,
      changedAt: new Date()
    };

    return {
      ...engineer,
      rating: newRating,
      ratingHistory: [...engineer.ratingHistory, ratingChange],
      updatedAt: new Date()
    };
  }

  async bulkUpdateEngineerRatings(engineerIds: string[], newRating: EngineerRating, reason: string, changedBy: string): Promise<EngineerContact[]> {
    const updates = await Promise.all(
      engineerIds.map(id => this.updateEngineerRating(id, newRating, reason, changedBy))
    );
    return updates;
  }

  // Organization Management
  async getOrganizations(type?: OrganizationType): Promise<Organization[]> {
    return this.generateMockOrganizations(type);
  }

  async getOrganizationById(id: string): Promise<Organization | null> {
    const organizations = await this.getOrganizations();
    return organizations.find(org => org.id === id) || null;
  }

  async getOrganizationHierarchy(parentId?: string): Promise<Organization[]> {
    const organizations = await this.getOrganizations();
    return organizations.filter(org => org.parentId === parentId);
  }

  async createOrganization(organization: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Organization> {
    const newOrganization: Organization = {
      ...organization,
      id: `org_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newOrganization;
  }

  async updateOrganization(organization: Organization): Promise<Organization> {
    // Mock implementation - in real app, this would make API call
    return {
      ...organization,
      updatedAt: new Date()
    };
  }

  async deleteOrganization(id: string): Promise<void> {
    // Mock implementation
    console.log(`Deleting organization ${id}`);
  }

  async validateOrganizationHierarchy(organizations: Organization[]): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const detectCircularReference = (orgId: string, path: string[] = []): boolean => {
      if (recursionStack.has(orgId)) {
        errors.push(`Circular reference detected in path: ${path.join(' -> ')} -> ${orgId}`);
        return true;
      }

      if (visited.has(orgId)) {
        return false;
      }

      visited.add(orgId);
      recursionStack.add(orgId);

      const org = organizations.find(o => o.id === orgId);
      if (org?.parentId) {
        const parent = organizations.find(o => o.id === org.parentId);
        if (!parent) {
          errors.push(`Organization ${org.name} has invalid parent ID: ${org.parentId}`);
        } else {
          const newPath = [...path, org.name];
          if (detectCircularReference(org.parentId, newPath)) {
            return true;
          }
        }
      }

      recursionStack.delete(orgId);
      return false;
    };

    // Check for circular references and orphaned parents
    organizations.forEach(org => {
      if (!visited.has(org.id)) {
        detectCircularReference(org.id);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Manufacturer Rep Management
  async getManufacturerReps(): Promise<ManufacturerRep[]> {
    return this.generateMockManufacturerReps();
  }

  async getManufacturerRepById(id: string): Promise<ManufacturerRep | null> {
    const reps = await this.getManufacturerReps();
    return reps.find(rep => rep.id === id) || null;
  }

  // Quote Management
  async getQuotesByOpportunity(opportunityId: string): Promise<Quote[]> {
    return this.generateMockQuotes(opportunityId);
  }

  async createQuote(quote: Omit<Quote, 'id'>): Promise<Quote> {
    const newQuote: Quote = {
      ...quote,
      id: `quote_${Date.now()}`
    };
    return newQuote;
  }

  // Pipeline Analytics
  async getPipelineAnalytics(filters?: OpportunityFilters): Promise<PipelineAnalytics> {
    const opportunities = await this.getOpportunities(filters);
    
    // Calculate conversion rates between phases
    const phaseOrder = [SalesPhase.PROSPECT, SalesPhase.PRELIMINARY_QUOTE, SalesPhase.FINAL_QUOTE, SalesPhase.PO_IN_HAND];
    const conversionRates = [];
    
    for (let i = 0; i < phaseOrder.length - 1; i++) {
      const currentPhase = phaseOrder[i];
      const nextPhase = phaseOrder[i + 1];
      
      const currentCount = opportunities.filter(opp => opp.salesPhase === currentPhase).length;
      const nextCount = opportunities.filter(opp => opp.salesPhase === nextPhase).length;
      
      // Mock conversion rate calculation - in real implementation, this would use historical data
      const conversionRate = currentCount > 0 ? Math.min((nextCount / currentCount) * 100, 100) : 0;
      
      conversionRates.push({
        fromPhase: currentPhase,
        toPhase: nextPhase,
        conversionRate,
        fromCount: currentCount,
        toCount: nextCount
      });
    }
    
    // Calculate pipeline velocity (average days in each phase)
    const pipelineVelocity = phaseOrder.map(phase => {
      const phaseOpportunities = opportunities.filter(opp => opp.salesPhase === phase);
      // Mock calculation - in real implementation, this would track actual time spent in each phase
      const avgDaysInPhase = phaseOpportunities.length > 0 
        ? Math.floor(Math.random() * 30) + 15 // Mock: 15-45 days
        : 0;
      
      return {
        phase,
        avgDaysInPhase,
        opportunityCount: phaseOpportunities.length
      };
    });
    
    // Calculate phase totals
    const phaseTotals = phaseOrder.map(phase => {
      const phaseOpportunities = opportunities.filter(opp => opp.salesPhase === phase);
      const totalValue = phaseOpportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);
      
      return {
        phase,
        count: phaseOpportunities.length,
        totalValue,
        averageValue: phaseOpportunities.length > 0 ? totalValue / phaseOpportunities.length : 0
      };
    });
    
    return {
      conversionRates,
      pipelineVelocity,
      phaseTotals,
      totalPipelineValue: opportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0),
      totalOpportunities: opportunities.length,
      averageDealSize: opportunities.length > 0 
        ? opportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0) / opportunities.length 
        : 0
    };
  }

  // Task Management
  async getTasks(engineerId?: string): Promise<RelationshipTask[]> {
    // Mock implementation - in real app, this would fetch from API
    return [];
  }

  async createTask(task: Omit<RelationshipTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<RelationshipTask> {
    const newTask: RelationshipTask = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newTask;
  }

  async updateTask(id: string, updates: Partial<RelationshipTask>): Promise<RelationshipTask> {
    // Mock implementation
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return {
      ...task,
      ...updates,
      updatedAt: new Date()
    };
  }

  async getTaskById(id: string): Promise<RelationshipTask | null> {
    // Mock implementation
    return null;
  }

  async completeTask(id: string, outcome: string, actualDuration?: number): Promise<TaskExecution> {
    const execution: TaskExecution = {
      id: `exec_${id}_${Date.now()}`,
      taskId: id,
      engineerId: 'mock_engineer_id',
      executedBy: 'current_user',
      executedAt: new Date(),
      outcome,
      actualDuration,
      followUpRequired: false
    };
    return execution;
  }

  async getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    // Mock implementation - in real app, this would fetch from API
    return [];
  }

  async createWorkflowTemplate(template: Omit<WorkflowTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkflowTemplate> {
    const newTemplate: WorkflowTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newTemplate;
  }

  async getTaskMetrics(engineerId?: string): Promise<TaskMetrics> {
    // Mock implementation
    return {
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      completionRate: 0,
      averageCompletionTime: 0,
      tasksByPriority: {
        [TaskPriority.LOW]: 0,
        [TaskPriority.MEDIUM]: 0,
        [TaskPriority.HIGH]: 0,
        [TaskPriority.URGENT]: 0
      },
      tasksByCategory: {
        [TaskCategory.RATING_IMPROVEMENT]: 0,
        [TaskCategory.FOLLOW_UP]: 0,
        [TaskCategory.OPPORTUNITY_DEVELOPMENT]: 0,
        [TaskCategory.RELATIONSHIP_BUILDING]: 0,
        [TaskCategory.MAINTENANCE]: 0
      },
      ratingImprovements: 0,
      relationshipTrend: 'stable'
    };
  }

  // Analytics and Reporting
  async getOpportunityMetrics(filters?: OpportunityFilters): Promise<OpportunityMetrics> {
    const opportunities = await this.getOpportunities(filters);
    
    const totalOpportunities = opportunities.length;
    const totalValue = opportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);
    const averageValue = totalValue / totalOpportunities || 0;
    
    const wonOpportunities = opportunities.filter(opp => opp.salesPhase === SalesPhase.WON);
    const conversionRate = (wonOpportunities.length / totalOpportunities) * 100 || 0;
    
    const pipelineByPhase = opportunities.reduce((acc, opp) => {
      acc[opp.salesPhase] = (acc[opp.salesPhase] || 0) + 1;
      return acc;
    }, {} as Record<SalesPhase, number>);
    
    const valueByPhase = opportunities.reduce((acc, opp) => {
      acc[opp.salesPhase] = (acc[opp.salesPhase] || 0) + opp.estimatedValue;
      return acc;
    }, {} as Record<SalesPhase, number>);
    
    const opportunitiesBySegment = opportunities.reduce((acc, opp) => {
      acc[opp.marketSegment] = (acc[opp.marketSegment] || 0) + 1;
      return acc;
    }, {} as Record<MarketSegment, number>);

    return {
      totalOpportunities,
      totalValue,
      averageValue,
      conversionRate,
      pipelineByPhase,
      valueByPhase,
      opportunitiesBySegment,
      topEngineers: [],
      topReps: []
    };
  }

  async generateCommercialReport(filters?: OpportunityFilters): Promise<CommercialReportData> {
    const [opportunities, engineers, organizations, manufacturerReps, metrics] = await Promise.all([
      this.getOpportunities(filters),
      this.getEngineers(),
      this.getOrganizations(),
      this.getManufacturerReps(),
      this.getOpportunityMetrics(filters)
    ]);

    return {
      opportunities,
      engineers,
      organizations,
      manufacturerReps,
      metrics,
      generatedAt: new Date()
    };
  }

  // Mock data generators
  private generateMockOpportunities(): CommercialOpportunity[] {
    const opportunities: CommercialOpportunity[] = [];
    const marketSegments = Object.values(MarketSegment);
    const salesPhases = Object.values(SalesPhase);
    const leadSources = Object.values(LeadSource);
    
    for (let i = 1; i <= 50; i++) {
      opportunities.push({
        id: `opp_${i}`,
        jobSiteName: `Project ${i} - ${this.getRandomElement(['Hospital', 'University', 'Office Building', 'Manufacturing Plant', 'Data Center'])}`,
        description: `Commercial HVAC project for ${this.getRandomElement(['new construction', 'renovation', 'expansion', 'retrofit'])}`,
        marketSegment: this.getRandomElement(marketSegments),
        productInterest: this.getRandomElements(['Air Handlers', 'Chillers', 'Heat Pumps', 'Controls', 'Coils'], 2),
        currentHVACSystem: this.getRandomElement(['Existing Chiller Plant', 'Rooftop Units', 'Split Systems', 'VRF System']),
        estimatedValue: Math.floor(Math.random() * 500000) + 50000,
        probability: Math.floor(Math.random() * 100),
        salesPhase: this.getRandomElement(salesPhases),
        leadSource: this.getRandomElement(leadSources),
        engineeringFirmId: `eng_firm_${Math.floor(Math.random() * 10) + 1}`,
        manufacturerRepId: `rep_${Math.floor(Math.random() * 5) + 1}`,
        regionalSalesManagerId: `rsm_${Math.floor(Math.random() * 3) + 1}`,
        quotes: [],
        notes: [],
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        expectedCloseDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000)
      });
    }
    
    return opportunities;
  }

  private generateMockEngineers(): EngineerContact[] {
    const engineers: EngineerContact[] = [];
    const ratings = Object.values(EngineerRating).filter(r => typeof r === 'number') as EngineerRating[];
    
    for (let i = 1; i <= 30; i++) {
      engineers.push({
        id: `eng_${i}`,
        personalInfo: {
          firstName: `Engineer${i}`,
          lastName: `Contact`,
          email: `engineer${i}@firm.com`,
          phone: `555-${String(i).padStart(3, '0')}-0000`,
          title: this.getRandomElement(['Senior Engineer', 'Project Manager', 'Principal', 'Associate'])
        },
        engineeringFirmId: `eng_firm_${Math.floor(Math.random() * 10) + 1}`,
        manufacturerRepId: `rep_${Math.floor(Math.random() * 5) + 1}`,
        territoryManagerId: `tm_${Math.floor(Math.random() * 5) + 1}`,
        architectId: `arch_${Math.floor(Math.random() * 5) + 1}`,
        contractorId: `contractor_${Math.floor(Math.random() * 5) + 1}`,
        rating: this.getRandomElement(ratings),
        ratingHistory: [],
        opportunities: [],
        interactions: [],
        lastContactDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        nextFollowUpDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        totalOpportunityValue: Math.floor(Math.random() * 1000000),
        wonOpportunityValue: Math.floor(Math.random() * 500000),
        specificationHistory: [],
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
    
    return engineers;
  }

  private generateMockOrganizations(type?: OrganizationType): Organization[] {
    const organizations: Organization[] = [];
    const types = type ? [type] : Object.values(OrganizationType);
    
    types.forEach((orgType, typeIndex) => {
      for (let i = 1; i <= 10; i++) {
        const id = `${orgType.toLowerCase().replace(/\s+/g, '_')}_${i}`;
        
        // Create some parent-child relationships for demonstration
        let parentId: string | undefined;
        if (i > 5 && Math.random() > 0.5) {
          // Some organizations have parents (create hierarchy)
          const parentIndex = Math.floor(Math.random() * 5) + 1;
          parentId = `${orgType.toLowerCase().replace(/\s+/g, '_')}_${parentIndex}`;
        }
        
        organizations.push({
          id,
          name: `${orgType} ${i}${parentId ? ' (Division)' : ''}`,
          type: orgType,
          parentId,
          contactInfo: {
            firstName: 'Contact',
            lastName: `Person${i}`,
            email: `contact@${id}.com`,
            phone: `555-${String(typeIndex * 100 + i).padStart(3, '0')}-0000`,
            company: `${orgType} ${i}`,
            title: parentId ? 'Division Manager' : 'President',
            address: {
              street: `${i}00 Business St`,
              city: 'Business City',
              state: 'BC',
              zipCode: `${String(typeIndex).padStart(2, '0')}${String(i).padStart(3, '0')}`,
              country: 'USA'
            }
          },
          territoryId: `territory_${typeIndex + 1}`,
          isActive: Math.random() > 0.1, // 90% active
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      }
    });
    
    return organizations;
  }

  private generateMockManufacturerReps(): ManufacturerRep[] {
    const reps: ManufacturerRep[] = [];
    const repRatings = Object.values(RepRating).filter(r => typeof r === 'number') as RepRating[];
    
    for (let i = 1; i <= 10; i++) {
      reps.push({
        id: `rep_${i}`,
        organizationId: `manufacturer_rep_${i}`,
        personalInfo: {
          firstName: `Rep${i}`,
          lastName: 'Representative',
          email: `rep${i}@company.com`,
          phone: `555-REP-${String(i).padStart(4, '0')}`,
          title: 'Manufacturer Representative'
        },
        territoryIds: [`territory_${i}`, `territory_${i + 10}`],
        territory: {
          counties: [`County${i}A`, `County${i}B`],
          state: this.getRandomElement(['California', 'Texas', 'Florida', 'New York']),
          isExclusive: true
        },
        rating: this.getRandomElement(repRatings),
        ratingHistory: [],
        leadsThisMonth: Math.floor(Math.random() * 20) + 5,
        leadsThisQuarter: Math.floor(Math.random() * 60) + 15,
        leadsThisYear: Math.floor(Math.random() * 200) + 50,
        missedLeads: Math.floor(Math.random() * 5),
        missedLeadHistory: [],
        quota: {
          fiscalYear: new Date().getFullYear(),
          annualQuota: 1000000 + (i * 100000),
          quarterlyQuotas: [250000, 250000, 250000, 250000],
          currentProgress: Math.floor(Math.random() * 800000),
          lastUpdated: new Date()
        },
        performance: {
          totalQuotes: Math.floor(Math.random() * 50) + 10,
          totalPOs: Math.floor(Math.random() * 30) + 5,
          totalShipments: Math.floor(Math.random() * 25) + 3,
          conversionRate: Math.random() * 50 + 25,
          averageDealSize: Math.floor(Math.random() * 100000) + 25000,
          ytdRevenue: Math.floor(Math.random() * 500000) + 100000,
          lastCalculated: new Date()
        },
        engineeringFirms: [`eng_firm_${i}`, `eng_firm_${i + 5}`],
        targetAccounts: [`target_${i}`, `target_${i + 10}`],
        isActive: true,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
    
    return reps;
  }

  private generateMockQuotes(opportunityId: string): Quote[] {
    const quotes: Quote[] = [];
    const statuses = Object.values(QuoteStatus);
    
    for (let i = 1; i <= Math.floor(Math.random() * 3) + 1; i++) {
      quotes.push({
        id: `quote_${opportunityId}_${i}`,
        opportunityId,
        quoteNumber: `Q-${Date.now()}-${i}`,
        amount: Math.floor(Math.random() * 200000) + 25000,
        status: this.getRandomElement(statuses),
        submittedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [
          {
            productId: `prod_${i}`,
            productName: `HVAC Unit ${i}`,
            quantity: Math.floor(Math.random() * 5) + 1,
            unitPrice: Math.floor(Math.random() * 50000) + 10000,
            totalPrice: 0,
            specifications: 'Standard commercial specifications'
          }
        ],
        notes: `Quote ${i} for ${opportunityId}`,
        pricingToolId: `pricing_${Date.now()}_${i}`
      });
    }
    
    return quotes;
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Pricing Integration Methods
  async testPricingIntegration(): Promise<{ success: boolean; message: string; responseTime?: number }> {
    try {
      const startTime = Date.now();
      await pricingIntegrationService.testDatabaseConnection({});
      const responseTime = Date.now() - startTime;
      
      return {
        success: true,
        message: 'Pricing integration test successful',
        responseTime
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async syncPricingData(): Promise<{ success: boolean; message: string; syncedCount?: number }> {
    try {
      await pricingIntegrationService.syncQuotes(50);
      
      return {
        success: true,
        message: 'Pricing data synchronized successfully',
        syncedCount: 50
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Sync failed'
      };
    }
  }

  async getPricingIntegrationStatus(): Promise<{
    database: { connected: boolean; responseTime: number };
    api: { connected: boolean; responseTime: number };
    sync: { connected: boolean; lastSync: Date };
  }> {
    try {
      const healthStatus = await pricingIntegrationService.checkAllIntegrations();
      
      const dbHealth = healthStatus.get('pricing-mysql');
      const apiHealth = healthStatus.get('pricing-api');
      const syncHealth = healthStatus.get('quote-sync');
      
      return {
        database: {
          connected: dbHealth?.isConnected || false,
          responseTime: dbHealth?.responseTime || 0
        },
        api: {
          connected: apiHealth?.isConnected || false,
          responseTime: apiHealth?.responseTime || 0
        },
        sync: {
          connected: syncHealth?.isConnected || false,
          lastSync: syncHealth?.lastChecked || new Date()
        }
      };
    } catch (error) {
      return {
        database: { connected: false, responseTime: 0 },
        api: { connected: false, responseTime: 0 },
        sync: { connected: false, lastSync: new Date() }
      };
    }
  }

  async getPricingIntegrationErrors(): Promise<Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
    resolved: boolean;
  }>> {
    try {
      const errors = pricingIntegrationService.getUnresolvedErrors();
      
      return errors.map(error => ({
        id: error.id,
        type: error.errorType,
        message: error.message,
        timestamp: error.timestamp,
        resolved: error.resolved
      }));
    } catch (error) {
      console.error('Error fetching pricing integration errors:', error);
      return [];
    }
  }

  async retryPricingOperation(operationId: string): Promise<{ success: boolean; message: string }> {
    try {
      // In a real implementation, this would retry the specific failed operation
      // For now, we'll simulate a retry by resolving the error
      const resolved = pricingIntegrationService.resolveError(operationId);
      
      if (resolved) {
        return {
          success: true,
          message: 'Operation retried successfully'
        };
      } else {
        return {
          success: false,
          message: 'Operation not found or already resolved'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Retry failed'
      };
    }
  }
}

export const commercialService = new CommercialService();
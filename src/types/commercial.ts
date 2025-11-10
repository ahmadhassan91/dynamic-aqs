export interface CommercialOpportunity {
  id: string;
  jobSiteName: string;
  description: string;
  marketSegment: MarketSegment;
  productInterest: string[];
  currentHVACSystem?: string;
  estimatedValue: number;
  probability: number;
  salesPhase: SalesPhase;
  
  // Stakeholders
  buildingOwnerId?: string;
  architectId?: string;
  engineeringFirmId: string;
  mechanicalContractorId?: string;
  manufacturerRepId: string;
  facilitiesManagerId?: string;
  
  // Sales tracking
  regionalSalesManagerId: string;
  quotes: Quote[];
  notes: OpportunityNote[];
  
  createdAt: Date;
  updatedAt: Date;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
}

export interface EngineerContact {
  id: string;
  personalInfo: ContactInfo;
  engineeringFirmId: string;
  manufacturerRepId?: string;
  rating: EngineerRating;
  ratingHistory: RatingChange[];
  
  // Relationship tracking
  opportunities: string[];
  interactions: Interaction[];
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
  
  // Performance metrics
  totalOpportunityValue: number;
  wonOpportunityValue: number;
  specificationHistory: SpecificationRecord[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  parentId?: string;
  children?: Organization[];
  contactInfo: ContactInfo;
  territoryId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ManufacturerRep {
  id: string;
  organizationId: string;
  personalInfo: ContactInfo;
  territoryIds: string[];
  quota: RepQuota;
  performance: RepPerformance;
  engineeringFirms: string[];
  targetAccounts: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: string;
  opportunityId: string;
  quoteNumber: string;
  amount: number;
  status: QuoteStatus;
  submittedDate: Date;
  validUntil: Date;
  items: QuoteItem[];
  notes?: string;
  pricingToolId?: string;
}

export interface OpportunityNote {
  id: string;
  opportunityId: string;
  authorId: string;
  content: string;
  type: NoteType;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title?: string;
  company?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Interaction {
  id: string;
  type: InteractionType;
  date: Date;
  description: string;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  createdBy: string;
}

export interface RatingChange {
  previousRating: EngineerRating;
  newRating: EngineerRating;
  reason: string;
  changedBy: string;
  changedAt: Date;
}

export interface SpecificationRecord {
  projectName: string;
  productSpecified: string;
  value: number;
  date: Date;
  status: SpecificationStatus;
}

export interface RepQuota {
  fiscalYear: number;
  annualQuota: number;
  quarterlyQuotas: number[];
  currentProgress: number;
  lastUpdated: Date;
}

export interface RepPerformance {
  totalQuotes: number;
  totalPOs: number;
  totalShipments: number;
  conversionRate: number;
  averageDealSize: number;
  ytdRevenue: number;
  lastCalculated: Date;
}

export interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: string;
}

// Enums
export enum MarketSegment {
  HEALTHCARE = 'Healthcare',
  CANNABIS = 'Cannabis',
  UNIVERSITY = 'University',
  COMMERCIAL_OFFICE = 'Commercial Office',
  MANUFACTURING = 'Manufacturing',
  RETAIL = 'Retail',
  HOSPITALITY = 'Hospitality',
  DATA_CENTER = 'Data Center',
  OTHER = 'Other'
}

export enum SalesPhase {
  PROSPECT = 'Prospect',
  PRELIMINARY_QUOTE = 'Preliminary Quote',
  FINAL_QUOTE = 'Final Quote',
  PO_IN_HAND = 'PO in Hand',
  WON = 'Won',
  LOST = 'Lost'
}

export enum EngineerRating {
  HOSTILE = 1,
  UNFAVORABLE = 2,
  NEUTRAL = 3,
  FAVORABLE = 4,
  CHAMPION = 5
}

export enum OrganizationType {
  ENGINEERING_FIRM = 'Engineering Firm',
  MANUFACTURER_REP = 'Manufacturer Rep',
  BUILDING_OWNER = 'Building Owner',
  ARCHITECT = 'Architect',
  MECHANICAL_CONTRACTOR = 'Mechanical Contractor',
  FACILITIES_MANAGER = 'Facilities Manager'
}

export enum QuoteStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  EXPIRED = 'Expired'
}

export enum NoteType {
  GENERAL = 'General',
  MEETING = 'Meeting',
  PHONE_CALL = 'Phone Call',
  EMAIL = 'Email',
  PROPOSAL = 'Proposal',
  FOLLOW_UP = 'Follow Up'
}

export enum InteractionType {
  PHONE_CALL = 'Phone Call',
  EMAIL = 'Email',
  MEETING = 'Meeting',
  LUNCH_AND_LEARN = 'Lunch and Learn',
  SITE_VISIT = 'Site Visit',
  TRADE_SHOW = 'Trade Show',
  WEBINAR = 'Webinar'
}

export enum SpecificationStatus {
  SPECIFIED = 'Specified',
  AWARDED = 'Awarded',
  LOST = 'Lost',
  PENDING = 'Pending'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskCategory {
  RATING_IMPROVEMENT = 'rating_improvement',
  FOLLOW_UP = 'follow_up',
  OPPORTUNITY_DEVELOPMENT = 'opportunity_development',
  RELATIONSHIP_BUILDING = 'relationship_building',
  MAINTENANCE = 'maintenance'
}

export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

export enum WorkflowCategory {
  RATING_IMPROVEMENT = 'rating_improvement',
  NEW_CONTACT_ONBOARDING = 'new_contact_onboarding',
  RELATIONSHIP_MAINTENANCE = 'relationship_maintenance',
  OPPORTUNITY_DEVELOPMENT = 'opportunity_development',
  RE_ENGAGEMENT = 're_engagement'
}

// Filter and search interfaces
export interface OpportunityFilters {
  marketSegments?: MarketSegment[];
  salesPhases?: SalesPhase[];
  regionalSalesManagerIds?: string[];
  manufacturerRepIds?: string[];
  engineeringFirmIds?: string[];
  estimatedValueRange?: {
    min: number;
    max: number;
  };
  probabilityRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

export interface EngineerFilters {
  ratings?: EngineerRating[];
  engineeringFirmIds?: string[];
  manufacturerRepIds?: string[];
  lastContactDateRange?: {
    start: Date;
    end: Date;
  };
  hasOpportunities?: boolean;
  searchTerm?: string;
}

// Pipeline analytics interfaces
export interface PipelineAnalytics {
  conversionRates: ConversionRate[];
  pipelineVelocity: PhaseVelocity[];
  phaseTotals: PhaseTotal[];
  totalPipelineValue: number;
  totalOpportunities: number;
  averageDealSize: number;
}

export interface ConversionRate {
  fromPhase: SalesPhase;
  toPhase: SalesPhase;
  conversionRate: number;
  fromCount: number;
  toCount: number;
}

export interface PhaseVelocity {
  phase: SalesPhase;
  avgDaysInPhase: number;
  opportunityCount: number;
}

export interface PhaseTotal {
  phase: SalesPhase;
  count: number;
  totalValue: number;
  averageValue: number;
}

// Task Management interfaces
export interface RelationshipTask {
  id: string;
  engineerId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  suggestedAction: InteractionType;
  dueDate: Date;
  estimatedDuration: number; // minutes
  expectedOutcome: string;
  status: TaskStatus;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  workflowTemplateId?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  targetRating?: EngineerRating;
  isActive: boolean;
  steps: WorkflowStep[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  order: number;
  title: string;
  description: string;
  suggestedAction: InteractionType;
  estimatedDuration: number;
  expectedOutcome: string;
  isRequired: boolean;
  dependsOn?: string[]; // step IDs that must be completed first
  conditions?: WorkflowCondition[];
}

export interface WorkflowCondition {
  type: 'rating' | 'days_since_contact' | 'opportunity_count' | 'interaction_count';
  operator: 'equals' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal';
  value: number | string;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  engineerId: string;
  executedBy: string;
  executedAt: Date;
  outcome: string;
  actualDuration?: number;
  followUpRequired: boolean;
  followUpDate?: Date;
  notes?: string;
  ratingChange?: {
    previousRating: EngineerRating;
    newRating: EngineerRating;
    reason: string;
  };
}

export interface TaskMetrics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageCompletionTime: number; // days
  tasksByPriority: Record<TaskPriority, number>;
  tasksByCategory: Record<TaskCategory, number>;
  ratingImprovements: number;
  relationshipTrend: 'improving' | 'stable' | 'declining';
}

// Dashboard and analytics interfaces
export interface OpportunityMetrics {
  totalOpportunities: number;
  totalValue: number;
  averageValue: number;
  conversionRate: number;
  pipelineByPhase: Record<SalesPhase, number>;
  valueByPhase: Record<SalesPhase, number>;
  opportunitiesBySegment: Record<MarketSegment, number>;
  topEngineers: Array<{
    engineerId: string;
    name: string;
    opportunityCount: number;
    totalValue: number;
  }>;
  topReps: Array<{
    repId: string;
    name: string;
    opportunityCount: number;
    totalValue: number;
  }>;
}

export interface CommercialReportData {
  opportunities: CommercialOpportunity[];
  engineers: EngineerContact[];
  organizations: Organization[];
  manufacturerReps: ManufacturerRep[];
  metrics: OpportunityMetrics;
  generatedAt: Date;
}
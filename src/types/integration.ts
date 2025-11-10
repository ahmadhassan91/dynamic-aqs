export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  endpoint: string;
  lastSync: Date | null;
  nextSync: Date | null;
  configuration: IntegrationConfiguration;
  healthCheck: HealthCheckResult;
  metrics: IntegrationMetrics;
}

export type IntegrationType = 'acumatica' | 'hubspot' | 'mapmycustomers' | 'outlook' | 'sendgrid';

export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'maintenance' | 'testing';

export interface IntegrationConfiguration {
  apiKey?: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  batchSize: number;
  syncInterval: number; // in minutes
  enabledFeatures: string[];
  fieldMappings: FieldMapping[];
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  required: boolean;
}

export interface HealthCheckResult {
  isHealthy: boolean;
  lastCheck: Date;
  responseTime: number;
  errorMessage?: string;
  details: Record<string, any>;
}

export interface IntegrationMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastHourRequests: number;
  errorRate: number;
}

export interface SyncOperation {
  id: string;
  integrationId: string;
  type: SyncType;
  status: SyncStatus;
  startTime: Date;
  endTime?: Date;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors: SyncError[];
  metadata: Record<string, any>;
}

export type SyncType = 'full' | 'incremental' | 'manual' | 'test';

export type SyncStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface SyncError {
  id: string;
  recordId?: string;
  errorCode: string;
  errorMessage: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export interface DataFlowVisualization {
  nodes: FlowNode[];
  edges: FlowEdge[];
  metrics: FlowMetrics;
}

export interface FlowNode {
  id: string;
  type: 'source' | 'target' | 'transformer' | 'validator';
  label: string;
  status: 'active' | 'inactive' | 'error';
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  status: 'active' | 'inactive' | 'error';
  throughput: number;
}

export interface FlowMetrics {
  totalThroughput: number;
  averageLatency: number;
  errorRate: number;
  activeConnections: number;
}

export interface IntegrationTest {
  id: string;
  integrationId: string;
  name: string;
  description: string;
  testType: TestType;
  configuration: TestConfiguration;
  results: TestResult[];
  status: TestStatus;
  createdAt: Date;
  lastRun?: Date;
}

export type TestType = 'connectivity' | 'authentication' | 'data_flow' | 'performance' | 'error_handling';

export type TestStatus = 'draft' | 'ready' | 'running' | 'passed' | 'failed' | 'skipped';

export interface TestConfiguration {
  endpoint?: string;
  method?: string;
  headers?: Record<string, string>;
  payload?: any;
  expectedResponse?: any;
  timeout?: number;
  assertions: TestAssertion[];
}

export interface TestAssertion {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'not_null';
  value: any;
  description: string;
}

export interface TestResult {
  id: string;
  testId: string;
  runDate: Date;
  status: TestStatus;
  duration: number;
  assertions: AssertionResult[];
  errorMessage?: string;
  response?: any;
}

export interface AssertionResult {
  assertion: TestAssertion;
  passed: boolean;
  actualValue: any;
  errorMessage?: string;
}

export interface ConflictResolution {
  id: string;
  syncOperationId: string;
  recordId: string;
  conflictType: ConflictType;
  sourceData: Record<string, any>;
  targetData: Record<string, any>;
  resolution: ResolutionStrategy;
  resolvedBy?: string;
  resolvedAt?: Date;
  status: 'pending' | 'resolved' | 'ignored';
}

export type ConflictType = 'duplicate' | 'field_mismatch' | 'version_conflict' | 'validation_error';

export type ResolutionStrategy = 'source_wins' | 'target_wins' | 'merge' | 'manual' | 'ignore';
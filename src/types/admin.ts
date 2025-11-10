export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  territoryId?: string;
  regionalManagerId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface BulkUserOperation {
  operation: 'activate' | 'deactivate' | 'delete' | 'updateRole';
  userIds: string[];
  parameters?: Record<string, any>;
}

export interface UserImportResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors: UserImportError[];
}

export interface UserImportError {
  row: number;
  message: string;
}

export interface SystemConfiguration {
  id: string;
  category: string;
  key: string;
  value: string;
  description: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
  isEditable: boolean;
  updatedAt: Date;
  updatedBy: string;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  type: 'acumatica' | 'hubspot' | 'mapmycustomers' | 'outlook' | 'sendgrid';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSyncAt?: Date;
  lastError?: string;
  configuration: Record<string, any>;
  healthCheck: {
    status: 'healthy' | 'warning' | 'critical';
    message: string;
    lastChecked: Date;
  };
}

export interface DataQualityIssue {
  id: string;
  type: 'duplicate' | 'incomplete' | 'invalid' | 'orphaned';
  severity: 'low' | 'medium' | 'high' | 'critical';
  entity: string;
  entityId: string;
  description: string;
  suggestedAction: string;
  detectedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface BackupInfo {
  id: string;
  type: 'full' | 'incremental';
  status: 'running' | 'completed' | 'failed';
  size: number;
  startedAt: Date;
  completedAt?: Date;
  location: string;
  error?: string;
}
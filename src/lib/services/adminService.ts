import { 
  User, 
  UserRole, 
  Permission, 
  UserActivity, 
  BulkUserOperation, 
  UserImportResult,
  SystemConfiguration,
  IntegrationStatus,
  DataQualityIssue,
  BackupInfo,
  UserStatus 
} from '@/types/admin';

class AdminService {
  // User Management
  async getUsers(filters?: {
    role?: string;
    status?: UserStatus;
    territory?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: User[]; total: number }> {
    // Mock implementation - replace with actual API calls
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'john.doe@dynamicaqs.com',
        firstName: 'John',
        lastName: 'Doe',
        role: {
          id: 'tm',
          name: 'Territory Manager',
          permissions: []
        },
        status: UserStatus.ACTIVE,
        territoryId: 'territory-1',
        lastLoginAt: '2024-01-15T10:30:00Z',
        createdAt: '2023-06-01T09:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        email: 'jane.smith@dynamicaqs.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: {
          id: 'rm',
          name: 'Regional Manager',
          permissions: []
        },
        status: UserStatus.ACTIVE,
        regionalManagerId: 'rm-1',
        lastLoginAt: '2024-01-14T14:20:00Z',
        createdAt: '2023-05-15T09:00:00Z',
        updatedAt: '2024-01-14T14:20:00Z'
      }
    ];

    return {
      users: mockUsers,
      total: mockUsers.length
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const { users } = await this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Mock implementation
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) throw new Error('User not found');
    
    return {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  }

  async deleteUser(id: string): Promise<void> {
    // Mock implementation
    console.log(`Deleting user ${id}`);
  }

  async bulkUserOperation(operation: BulkUserOperation): Promise<void> {
    // Mock implementation
    console.log('Bulk operation:', operation);
  }

  async importUsers(csvData: string): Promise<UserImportResult> {
    // Mock implementation
    return {
      totalProcessed: 10,
      successful: 8,
      failed: 2,
      errors: [
        { row: 3, message: 'Invalid email format' },
        { row: 7, message: 'Email already exists' }
      ]
    };
  }

  async exportUsers(format: 'csv' | 'xlsx'): Promise<Blob> {
    // Mock implementation
    const csvContent = 'Email,First Name,Last Name,Role,Status\n';
    return new Blob([csvContent], { type: 'text/csv' });
  }

  // Role Management
  async getRoles(): Promise<UserRole[]> {
    return [
      {
        id: 'admin',
        name: 'Administrator',
        permissions: []
      },
      {
        id: 'rm',
        name: 'Regional Manager',
        permissions: []
      },
      {
        id: 'tm',
        name: 'Territory Manager',
        permissions: []
      }
    ];
  }

  async getPermissions(): Promise<Permission[]> {
    return [
      {
        id: 'users.read',
        name: 'View Users',
        resource: 'users',
        action: 'read',
        description: 'Can view user information'
      },
      {
        id: 'users.write',
        name: 'Manage Users',
        resource: 'users',
        action: 'write',
        description: 'Can create and edit users'
      },
      {
        id: 'customers.read',
        name: 'View Customers',
        resource: 'customers',
        action: 'read',
        description: 'Can view customer information'
      }
    ];
  }

  // User Activity
  async getUserActivity(userId?: string, filters?: {
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ activities: UserActivity[]; total: number }> {
    const mockActivities: UserActivity[] = [
      {
        id: '1',
        userId: '1',
        action: 'login',
        resource: 'auth',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date('2024-01-15T10:30:00Z')
      },
      {
        id: '2',
        userId: '1',
        action: 'update',
        resource: 'customer',
        resourceId: 'customer-123',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date('2024-01-15T11:15:00Z'),
        details: { field: 'status', oldValue: 'active', newValue: 'inactive' }
      }
    ];

    return {
      activities: mockActivities,
      total: mockActivities.length
    };
  }

  // System Configuration
  async getSystemConfiguration(): Promise<SystemConfiguration[]> {
    return [
      {
        id: '1',
        category: 'email',
        key: 'smtp_host',
        value: 'smtp.sendgrid.net',
        description: 'SMTP server hostname',
        dataType: 'string',
        isEditable: true,
        updatedAt: new Date(),
        updatedBy: 'admin'
      },
      {
        id: '2',
        category: 'integration',
        key: 'acumatica_sync_interval',
        value: '15',
        description: 'Sync interval in minutes',
        dataType: 'number',
        isEditable: true,
        updatedAt: new Date(),
        updatedBy: 'admin'
      }
    ];
  }

  async updateSystemConfiguration(id: string, value: string): Promise<SystemConfiguration> {
    const configs = await this.getSystemConfiguration();
    const config = configs.find(c => c.id === id);
    if (!config) throw new Error('Configuration not found');
    
    return {
      ...config,
      value,
      updatedAt: new Date(),
      updatedBy: 'current-user'
    };
  }

  // Integration Status
  async getIntegrationStatus(): Promise<IntegrationStatus[]> {
    return [
      {
        id: 'acumatica',
        name: 'Acumatica ERP',
        type: 'acumatica',
        status: 'connected',
        lastSyncAt: new Date('2024-01-15T12:00:00Z'),
        configuration: { endpoint: 'https://api.acumatica.com' },
        healthCheck: {
          status: 'healthy',
          message: 'All systems operational',
          lastChecked: new Date()
        }
      },
      {
        id: 'hubspot',
        name: 'HubSpot CRM',
        type: 'hubspot',
        status: 'error',
        lastError: 'Authentication failed',
        configuration: { apiKey: '***' },
        healthCheck: {
          status: 'critical',
          message: 'Authentication error - please check API key',
          lastChecked: new Date()
        }
      }
    ];
  }

  // Data Quality
  async getDataQualityIssues(): Promise<DataQualityIssue[]> {
    return [
      {
        id: '1',
        type: 'duplicate',
        severity: 'medium',
        entity: 'customer',
        entityId: 'customer-123',
        description: 'Potential duplicate customer record found',
        suggestedAction: 'Review and merge records',
        detectedAt: new Date('2024-01-14T09:00:00Z')
      },
      {
        id: '2',
        type: 'incomplete',
        severity: 'low',
        entity: 'customer',
        entityId: 'customer-456',
        description: 'Missing phone number',
        suggestedAction: 'Contact customer to update information',
        detectedAt: new Date('2024-01-13T15:30:00Z')
      }
    ];
  }

  // Backup Management
  async getBackups(): Promise<BackupInfo[]> {
    return [
      {
        id: '1',
        type: 'full',
        status: 'completed',
        size: 1024 * 1024 * 500, // 500MB
        startedAt: new Date('2024-01-15T02:00:00Z'),
        completedAt: new Date('2024-01-15T02:45:00Z'),
        location: 's3://backups/full-20240115.sql'
      },
      {
        id: '2',
        type: 'incremental',
        status: 'running',
        size: 0,
        startedAt: new Date('2024-01-15T14:00:00Z'),
        location: 's3://backups/inc-20240115-1400.sql'
      }
    ];
  }

  async createBackup(type: 'full' | 'incremental'): Promise<BackupInfo> {
    return {
      id: `backup-${Date.now()}`,
      type,
      status: 'running',
      size: 0,
      startedAt: new Date(),
      location: `s3://backups/${type}-${new Date().toISOString().split('T')[0]}.sql`
    };
  }
}

export const adminService = new AdminService();
import { 
  Integration, 
  IntegrationType, 
  SyncOperation, 
  IntegrationTest, 
  TestResult,
  DataFlowVisualization,
  ConflictResolution,
  HealthCheckResult,
  IntegrationMetrics
} from '@/types/integration';

class IntegrationService {
  private mockIntegrations: Integration[] = [
    {
      id: 'acumatica-prod',
      name: 'Acumatica ERP Production',
      type: 'acumatica',
      status: 'active',
      endpoint: 'https://api.acumatica.com/v1',
      lastSync: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      nextSync: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      configuration: {
        baseUrl: 'https://api.acumatica.com/v1',
        timeout: 30000,
        retryAttempts: 3,
        batchSize: 100,
        syncInterval: 60,
        enabledFeatures: ['orders', 'customers', 'inventory', 'shipping'],
        fieldMappings: [
          { sourceField: 'CustomerID', targetField: 'customerId', required: true },
          { sourceField: 'CompanyName', targetField: 'companyName', required: true },
          { sourceField: 'OrderNumber', targetField: 'orderNumber', required: true }
        ]
      },
      healthCheck: {
        isHealthy: true,
        lastCheck: new Date(),
        responseTime: 245,
        details: { version: '2023.1', uptime: '99.9%' }
      },
      metrics: {
        totalRequests: 15420,
        successfulRequests: 15398,
        failedRequests: 22,
        averageResponseTime: 234,
        lastHourRequests: 45,
        errorRate: 0.14
      }
    },
    {
      id: 'hubspot-prod',
      name: 'HubSpot CRM',
      type: 'hubspot',
      status: 'active',
      endpoint: 'https://api.hubapi.com/crm/v3',
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      nextSync: new Date(Date.now() + 25 * 60 * 1000), // 25 minutes from now
      configuration: {
        baseUrl: 'https://api.hubapi.com/crm/v3',
        timeout: 15000,
        retryAttempts: 2,
        batchSize: 50,
        syncInterval: 30,
        enabledFeatures: ['contacts', 'deals', 'companies', 'activities'],
        fieldMappings: [
          { sourceField: 'email', targetField: 'contactEmail', required: true },
          { sourceField: 'firstname', targetField: 'firstName', required: false },
          { sourceField: 'lastname', targetField: 'lastName', required: false }
        ]
      },
      healthCheck: {
        isHealthy: true,
        lastCheck: new Date(),
        responseTime: 156,
        details: { rateLimit: '100/10s', quotaUsed: '45%' }
      },
      metrics: {
        totalRequests: 8934,
        successfulRequests: 8901,
        failedRequests: 33,
        averageResponseTime: 167,
        lastHourRequests: 28,
        errorRate: 0.37
      }
    },
    {
      id: 'mapmycustomers-prod',
      name: 'MapMyCustomers',
      type: 'mapmycustomers',
      status: 'maintenance',
      endpoint: 'https://api.mapmycustomers.com/v2',
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      nextSync: null,
      configuration: {
        baseUrl: 'https://api.mapmycustomers.com/v2',
        timeout: 20000,
        retryAttempts: 3,
        batchSize: 25,
        syncInterval: 120,
        enabledFeatures: ['routes', 'visits', 'locations'],
        fieldMappings: [
          { sourceField: 'customer_id', targetField: 'customerId', required: true },
          { sourceField: 'visit_date', targetField: 'visitDate', required: true },
          { sourceField: 'notes', targetField: 'visitNotes', required: false }
        ]
      },
      healthCheck: {
        isHealthy: false,
        lastCheck: new Date(),
        responseTime: 0,
        errorMessage: 'Service temporarily unavailable for maintenance',
        details: { maintenanceWindow: '2024-01-15 02:00-04:00 UTC' }
      },
      metrics: {
        totalRequests: 3456,
        successfulRequests: 3401,
        failedRequests: 55,
        averageResponseTime: 892,
        lastHourRequests: 0,
        errorRate: 1.59
      }
    }
  ];

  private mockSyncOperations: SyncOperation[] = [
    {
      id: 'sync-001',
      integrationId: 'acumatica-prod',
      type: 'incremental',
      status: 'completed',
      startTime: new Date(Date.now() - 20 * 60 * 1000),
      endTime: new Date(Date.now() - 15 * 60 * 1000),
      recordsProcessed: 156,
      recordsSuccessful: 154,
      recordsFailed: 2,
      errors: [
        {
          id: 'err-001',
          recordId: 'ORD-12345',
          errorCode: 'VALIDATION_ERROR',
          errorMessage: 'Invalid customer ID format',
          timestamp: new Date(Date.now() - 18 * 60 * 1000),
          severity: 'medium',
          resolved: false
        }
      ],
      metadata: { batchId: 'batch-789', triggeredBy: 'scheduled' }
    }
  ];

  private mockTests: IntegrationTest[] = [
    {
      id: 'test-001',
      integrationId: 'acumatica-prod',
      name: 'Customer Data Sync Test',
      description: 'Validates customer data synchronization from Acumatica',
      testType: 'data_flow',
      status: 'passed',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
      configuration: {
        endpoint: '/customers',
        method: 'GET',
        timeout: 5000,
        assertions: [
          {
            field: 'data.length',
            operator: 'greater_than',
            value: 0,
            description: 'Should return at least one customer'
          }
        ]
      },
      results: []
    }
  ];

  async getIntegrations(): Promise<Integration[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockIntegrations;
  }

  async getIntegration(id: string): Promise<Integration | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockIntegrations.find(integration => integration.id === id) || null;
  }

  async updateIntegrationStatus(id: string, status: Integration['status']): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const integration = this.mockIntegrations.find(i => i.id === id);
    if (integration) {
      integration.status = status;
    }
  }

  async testIntegrationConnection(id: string): Promise<HealthCheckResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate different test results
    const integration = this.mockIntegrations.find(i => i.id === id);
    if (!integration) {
      throw new Error('Integration not found');
    }

    const isHealthy = Math.random() > 0.2; // 80% success rate
    const responseTime = Math.floor(Math.random() * 1000) + 100;

    const result: HealthCheckResult = {
      isHealthy,
      lastCheck: new Date(),
      responseTime,
      errorMessage: isHealthy ? undefined : 'Connection timeout',
      details: {
        endpoint: integration.endpoint,
        timestamp: new Date().toISOString()
      }
    };

    integration.healthCheck = result;
    return result;
  }

  async getSyncOperations(integrationId?: string): Promise<SyncOperation[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return integrationId 
      ? this.mockSyncOperations.filter(op => op.integrationId === integrationId)
      : this.mockSyncOperations;
  }

  async triggerSync(integrationId: string, type: SyncOperation['type'] = 'manual'): Promise<SyncOperation> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newSync: SyncOperation = {
      id: `sync-${Date.now()}`,
      integrationId,
      type,
      status: 'running',
      startTime: new Date(),
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      errors: [],
      metadata: { triggeredBy: 'manual', userId: 'current-user' }
    };

    this.mockSyncOperations.unshift(newSync);
    
    // Simulate sync completion after 3 seconds
    setTimeout(() => {
      newSync.status = 'completed';
      newSync.endTime = new Date();
      newSync.recordsProcessed = Math.floor(Math.random() * 100) + 10;
      newSync.recordsSuccessful = newSync.recordsProcessed - Math.floor(Math.random() * 3);
      newSync.recordsFailed = newSync.recordsProcessed - newSync.recordsSuccessful;
    }, 3000);

    return newSync;
  }

  async getIntegrationTests(integrationId?: string): Promise<IntegrationTest[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return integrationId 
      ? this.mockTests.filter(test => test.integrationId === integrationId)
      : this.mockTests;
  }

  async runIntegrationTest(testId: string): Promise<TestResult> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const test = this.mockTests.find(t => t.id === testId);
    if (!test) {
      throw new Error('Test not found');
    }

    const passed = Math.random() > 0.3; // 70% success rate
    
    const result: TestResult = {
      id: `result-${Date.now()}`,
      testId,
      runDate: new Date(),
      status: passed ? 'passed' : 'failed',
      duration: Math.floor(Math.random() * 5000) + 1000,
      assertions: test.configuration.assertions.map(assertion => ({
        assertion,
        passed: passed && Math.random() > 0.1,
        actualValue: passed ? assertion.value : 'unexpected_value',
        errorMessage: passed ? undefined : 'Assertion failed'
      })),
      errorMessage: passed ? undefined : 'Test execution failed',
      response: passed ? { status: 'success', data: [] } : { status: 'error', message: 'API error' }
    };

    test.results.unshift(result);
    test.lastRun = new Date();
    test.status = result.status;

    return result;
  }

  async getDataFlowVisualization(integrationId: string): Promise<DataFlowVisualization> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      nodes: [
        {
          id: 'source-1',
          type: 'source',
          label: 'Acumatica ERP',
          status: 'active',
          position: { x: 100, y: 100 },
          data: { recordCount: 1500, lastUpdate: new Date() }
        },
        {
          id: 'transformer-1',
          type: 'transformer',
          label: 'Data Mapper',
          status: 'active',
          position: { x: 300, y: 100 },
          data: { transformationRules: 15, processingTime: '2.3s' }
        },
        {
          id: 'validator-1',
          type: 'validator',
          label: 'Data Validator',
          status: 'active',
          position: { x: 500, y: 100 },
          data: { validationRules: 8, errorRate: '0.2%' }
        },
        {
          id: 'target-1',
          type: 'target',
          label: 'CRM Database',
          status: 'active',
          position: { x: 700, y: 100 },
          data: { recordsStored: 1497, lastSync: new Date() }
        }
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'source-1',
          target: 'transformer-1',
          label: '1500 records/min',
          status: 'active',
          throughput: 1500
        },
        {
          id: 'edge-2',
          source: 'transformer-1',
          target: 'validator-1',
          label: '1500 records/min',
          status: 'active',
          throughput: 1500
        },
        {
          id: 'edge-3',
          source: 'validator-1',
          target: 'target-1',
          label: '1497 records/min',
          status: 'active',
          throughput: 1497
        }
      ],
      metrics: {
        totalThroughput: 1497,
        averageLatency: 2.3,
        errorRate: 0.2,
        activeConnections: 3
      }
    };
  }

  async getConflictResolutions(syncOperationId?: string): Promise<ConflictResolution[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 'conflict-001',
        syncOperationId: 'sync-001',
        recordId: 'CUST-12345',
        conflictType: 'field_mismatch',
        sourceData: { companyName: 'ABC Corp', phone: '555-0123' },
        targetData: { companyName: 'ABC Corporation', phone: '555-0124' },
        resolution: 'manual',
        status: 'pending'
      }
    ];
  }

  async resolveConflict(conflictId: string, resolution: ConflictResolution['resolution']): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Implementation would update the conflict resolution
  }
}

export const integrationService = new IntegrationService();
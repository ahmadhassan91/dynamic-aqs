'use client';

import React, { useState, useEffect } from 'react';
import { 
  Integration, 
  SyncOperation, 
  IntegrationTest, 
  DataFlowVisualization,
  HealthCheckResult 
} from '@/types/integration';
import { integrationService } from '@/lib/services/integrationService';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100';
    case 'inactive': return 'text-gray-600 bg-gray-100';
    case 'error': return 'text-red-600 bg-red-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'completed': return 'text-green-600 bg-green-100';
    case 'running': return 'text-blue-600 bg-blue-100';
    case 'failed': return 'text-red-600 bg-red-100';
    case 'passed': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const IntegrationSimulationDashboard: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [syncOperations, setSyncOperations] = useState<SyncOperation[]>([]);
  const [tests, setTests] = useState<IntegrationTest[]>([]);
  const [dataFlow, setDataFlow] = useState<DataFlowVisualization | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sync' | 'tests' | 'dataflow' | 'config'>('overview');

  useEffect(() => {
    loadIntegrations();
  }, []);

  useEffect(() => {
    if (selectedIntegration) {
      loadIntegrationData(selectedIntegration.id);
    }
  }, [selectedIntegration]);

  const loadIntegrations = async () => {
    try {
      const data = await integrationService.getIntegrations();
      setIntegrations(data);
      if (data.length > 0) {
        setSelectedIntegration(data[0]);
      }
    } catch (error) {
      console.error('Failed to load integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIntegrationData = async (integrationId: string) => {
    try {
      const [syncOps, integrationTests, flowData] = await Promise.all([
        integrationService.getSyncOperations(integrationId),
        integrationService.getIntegrationTests(integrationId),
        integrationService.getDataFlowVisualization(integrationId)
      ]);
      
      setSyncOperations(syncOps);
      setTests(integrationTests);
      setDataFlow(flowData);
    } catch (error) {
      console.error('Failed to load integration data:', error);
    }
  };

  const handleTestConnection = async (integrationId: string) => {
    try {
      const result = await integrationService.testIntegrationConnection(integrationId);
      
      // Update the integration with new health check result
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, healthCheck: result }
          : integration
      ));
      
      if (selectedIntegration?.id === integrationId) {
        setSelectedIntegration(prev => prev ? { ...prev, healthCheck: result } : null);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  const handleTriggerSync = async (type: SyncOperation['type'] = 'manual') => {
    if (!selectedIntegration) return;
    
    try {
      const syncOp = await integrationService.triggerSync(selectedIntegration.id, type);
      setSyncOperations(prev => [syncOp, ...prev]);
    } catch (error) {
      console.error('Failed to trigger sync:', error);
    }
  };

  const handleRunTest = async (testId: string) => {
    try {
      await integrationService.runIntegrationTest(testId);
      // Reload tests to get updated results
      if (selectedIntegration) {
        const updatedTests = await integrationService.getIntegrationTests(selectedIntegration.id);
        setTests(updatedTests);
      }
    } catch (error) {
      console.error('Failed to run test:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Integration Simulation Dashboard
          </h3>
          
          {/* Integration Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Integration
            </label>
            <select
              value={selectedIntegration?.id || ''}
              onChange={(e) => {
                const integration = integrations.find(i => i.id === e.target.value);
                setSelectedIntegration(integration || null);
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {integrations.map(integration => (
                <option key={integration.id} value={integration.id}>
                  {integration.name} ({integration.type})
                </option>
              ))}
            </select>
          </div>

          {/* Integration Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {integrations.map(integration => (
              <div
                key={integration.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedIntegration?.id === integration.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedIntegration(integration)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{integration.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{integration.type}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Response: {integration.healthCheck.responseTime}ms</span>
                  <span>Success: {((integration.metrics.successfulRequests / integration.metrics.totalRequests) * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          {selectedIntegration && (
            <>
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'sync', label: 'Sync Operations' },
                    { id: 'tests', label: 'Integration Tests' },
                    { id: 'dataflow', label: 'Data Flow' },
                    { id: 'config', label: 'Configuration' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <IntegrationOverview 
                  integration={selectedIntegration}
                  onTestConnection={handleTestConnection}
                />
              )}

              {activeTab === 'sync' && (
                <SyncOperationsPanel 
                  operations={syncOperations}
                  onTriggerSync={handleTriggerSync}
                />
              )}

              {activeTab === 'tests' && (
                <IntegrationTestsPanel 
                  tests={tests}
                  onRunTest={handleRunTest}
                />
              )}

              {activeTab === 'dataflow' && dataFlow && (
                <DataFlowVisualizationComponent 
                  data={dataFlow}
                />
              )}

              {activeTab === 'config' && (
                <IntegrationConfiguration 
                  integration={selectedIntegration}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components for different tabs
const IntegrationOverview: React.FC<{
  integration: Integration;
  onTestConnection: (id: string) => void;
}> = ({ integration, onTestConnection }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Health Status</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              integration.healthCheck.isHealthy ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
            }`}>
              {integration.healthCheck.isHealthy ? 'Healthy' : 'Unhealthy'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Response Time:</span>
            <span className="text-sm font-medium">{integration.healthCheck.responseTime}ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Last Check:</span>
            <span className="text-sm">{integration.healthCheck.lastCheck.toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={() => onTestConnection(integration.id)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          Test Connection
        </button>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Metrics</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Requests:</span>
            <span className="text-sm font-medium">{integration.metrics.totalRequests.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Success Rate:</span>
            <span className="text-sm font-medium">
              {((integration.metrics.successfulRequests / integration.metrics.totalRequests) * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Error Rate:</span>
            <span className="text-sm font-medium">{integration.metrics.errorRate.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Avg Response:</span>
            <span className="text-sm font-medium">{integration.metrics.averageResponseTime}ms</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SyncOperationsPanel: React.FC<{
  operations: SyncOperation[];
  onTriggerSync: (type: SyncOperation['type']) => void;
}> = ({ operations, onTriggerSync }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h4 className="font-medium text-gray-900">Sync Operations</h4>
      <div className="space-x-2">
        <button
          onClick={() => onTriggerSync('manual')}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          Manual Sync
        </button>
        <button
          onClick={() => onTriggerSync('test')}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
        >
          Test Sync
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Operation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Records
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Started
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {operations.map(operation => (
            <tr key={operation.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{operation.type}</div>
                <div className="text-sm text-gray-500">{operation.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(operation.status)}`}>
                  {operation.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>Processed: {operation.recordsProcessed}</div>
                <div className="text-green-600">Success: {operation.recordsSuccessful}</div>
                <div className="text-red-600">Failed: {operation.recordsFailed}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {operation.endTime 
                  ? `${Math.round((operation.endTime.getTime() - operation.startTime.getTime()) / 1000)}s`
                  : 'Running...'
                }
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {operation.startTime.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const IntegrationTestsPanel: React.FC<{
  tests: IntegrationTest[];
  onRunTest: (testId: string) => void;
}> = ({ tests, onRunTest }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h4 className="font-medium text-gray-900">Integration Tests</h4>
      <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
        Run All Tests
      </button>
    </div>

    <div className="grid gap-4">
      {tests.map(test => (
        <div key={test.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h5 className="font-medium text-gray-900">{test.name}</h5>
              <p className="text-sm text-gray-600">{test.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                {test.status}
              </span>
              <button
                onClick={() => onRunTest(test.id)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
              >
                Run Test
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Type:</span> {test.testType}
            </div>
            <div>
              <span className="text-gray-600">Last Run:</span> {test.lastRun?.toLocaleString() || 'Never'}
            </div>
          </div>

          {test.results.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm">
                <span className="text-gray-600">Latest Result:</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  test.results[0].status === 'passed' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                  {test.results[0].status}
                </span>
                <span className="ml-2 text-gray-500">({test.results[0].duration}ms)</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const DataFlowVisualizationComponent: React.FC<{
  data: DataFlowVisualization;
}> = ({ data }) => (
  <div className="space-y-6">
    <div>
      <h4 className="font-medium text-gray-900 mb-4">Data Flow Metrics</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{data.metrics.totalThroughput}</div>
          <div className="text-sm text-gray-600">Records/min</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{data.metrics.averageLatency}s</div>
          <div className="text-sm text-gray-600">Avg Latency</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{data.metrics.errorRate}%</div>
          <div className="text-sm text-gray-600">Error Rate</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{data.metrics.activeConnections}</div>
          <div className="text-sm text-gray-600">Active Connections</div>
        </div>
      </div>
    </div>

    <div>
      <h4 className="font-medium text-gray-900 mb-4">Flow Diagram</h4>
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center justify-between space-x-4">
          {data.nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-medium ${
                  node.status === 'active' ? 'bg-green-500' : 
                  node.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                }`}>
                  {node.type === 'source' ? 'SRC' :
                   node.type === 'transformer' ? 'TRF' :
                   node.type === 'validator' ? 'VAL' : 'TGT'}
                </div>
                <div className="mt-2 text-sm font-medium">{node.label}</div>
                <div className="text-xs text-gray-500">
                  {node.type === 'source' && `${node.data.recordCount} records`}
                  {node.type === 'transformer' && `${node.data.processingTime}`}
                  {node.type === 'validator' && `${node.data.errorRate} error rate`}
                  {node.type === 'target' && `${node.data.recordsStored} stored`}
                </div>
              </div>
              {index < data.nodes.length - 1 && (
                <div className="flex-1 flex items-center">
                  <div className="w-full h-0.5 bg-gray-300"></div>
                  <div className="text-xs text-gray-500 bg-white px-2">
                    {data.edges[index]?.label}
                  </div>
                  <div className="w-full h-0.5 bg-gray-300"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const IntegrationConfiguration: React.FC<{
  integration: Integration;
}> = ({ integration }) => (
  <div className="space-y-6">
    <div>
      <h4 className="font-medium text-gray-900 mb-4">Configuration Settings</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
          <input
            type="text"
            value={integration.configuration.baseUrl}
            readOnly
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (ms)</label>
          <input
            type="number"
            value={integration.configuration.timeout}
            readOnly
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Retry Attempts</label>
          <input
            type="number"
            value={integration.configuration.retryAttempts}
            readOnly
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Batch Size</label>
          <input
            type="number"
            value={integration.configuration.batchSize}
            readOnly
            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
      </div>
    </div>

    <div>
      <h4 className="font-medium text-gray-900 mb-4">Field Mappings</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source Field
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target Field
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Required
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transformation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {integration.configuration.fieldMappings.map((mapping, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {mapping.sourceField}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mapping.targetField}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    mapping.required ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100'
                  }`}>
                    {mapping.required ? 'Required' : 'Optional'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mapping.transformation || 'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <h4 className="font-medium text-gray-900 mb-4">Enabled Features</h4>
      <div className="flex flex-wrap gap-2">
        {integration.configuration.enabledFeatures.map(feature => (
          <span
            key={feature}
            className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default IntegrationSimulationDashboard;
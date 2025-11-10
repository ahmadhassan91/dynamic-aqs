'use client';

import React, { useState, useEffect } from 'react';
import { 
  SyncOperation, 
  ConflictResolution, 
  Integration,
  SyncError 
} from '@/types/integration';
import { integrationService } from '@/lib/services/integrationService';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': case 'resolved': return 'text-green-600 bg-green-100';
    case 'running': case 'pending': return 'text-blue-600 bg-blue-100';
    case 'failed': case 'error': return 'text-red-600 bg-red-100';
    case 'cancelled': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const DataSynchronizationInterface: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [syncOperations, setSyncOperations] = useState<SyncOperation[]>([]);
  const [conflicts, setConflicts] = useState<ConflictResolution[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<SyncOperation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'operations' | 'conflicts' | 'history' | 'mapping'>('operations');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [integrationsData, syncOpsData, conflictsData] = await Promise.all([
        integrationService.getIntegrations(),
        integrationService.getSyncOperations(),
        integrationService.getConflictResolutions()
      ]);
      
      setIntegrations(integrationsData);
      setSyncOperations(syncOpsData);
      setConflicts(conflictsData);
    } catch (error) {
      console.error('Failed to load synchronization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSync = async (integrationId: string, type: SyncOperation['type']) => {
    try {
      const syncOp = await integrationService.triggerSync(integrationId, type);
      setSyncOperations(prev => [syncOp, ...prev]);
    } catch (error) {
      console.error('Failed to trigger sync:', error);
    }
  };

  const handleResolveConflict = async (conflictId: string, resolution: ConflictResolution['resolution']) => {
    try {
      await integrationService.resolveConflict(conflictId, resolution);
      setConflicts(prev => prev.map(conflict => 
        conflict.id === conflictId 
          ? { ...conflict, resolution, status: 'resolved', resolvedAt: new Date() }
          : conflict
      ));
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
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
            Data Synchronization Interface
          </h3>

          {/* Quick Actions */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {integrations.map(integration => (
                <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{integration.name}</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(integration.status)}`}>
                      {integration.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Last sync: {integration.lastSync?.toLocaleString() || 'Never'}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTriggerSync(integration.id, 'manual')}
                      disabled={integration.status !== 'active'}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      Manual Sync
                    </button>
                    <button
                      onClick={() => handleTriggerSync(integration.id, 'full')}
                      disabled={integration.status !== 'active'}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 disabled:bg-gray-400"
                    >
                      Full Sync
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'operations', label: 'Sync Operations', count: syncOperations.length },
                { id: 'conflicts', label: 'Conflicts', count: conflicts.filter(c => c.status === 'pending').length },
                { id: 'history', label: 'Sync History' },
                { id: 'mapping', label: 'Data Mapping' }
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
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'operations' && (
            <SyncOperationsTab 
              operations={syncOperations}
              onSelectOperation={setSelectedOperation}
              selectedOperation={selectedOperation}
            />
          )}

          {activeTab === 'conflicts' && (
            <ConflictResolutionTab 
              conflicts={conflicts}
              onResolveConflict={handleResolveConflict}
            />
          )}

          {activeTab === 'history' && (
            <SyncHistoryTab 
              operations={syncOperations}
            />
          )}

          {activeTab === 'mapping' && (
            <DataMappingTab 
              integrations={integrations}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components for different tabs
const SyncOperationsTab: React.FC<{
  operations: SyncOperation[];
  onSelectOperation: (operation: SyncOperation) => void;
  selectedOperation: SyncOperation | null;
}> = ({ operations, onSelectOperation, selectedOperation }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Operations List */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Active Operations</h4>
        <div className="space-y-3">
          {operations.slice(0, 10).map(operation => (
            <div
              key={operation.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedOperation?.id === operation.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectOperation(operation)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{operation.type}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(operation.status)}`}>
                    {operation.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {operation.startTime.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Processed:</span>
                  <div className="font-medium">{operation.recordsProcessed}</div>
                </div>
                <div>
                  <span className="text-gray-600">Success:</span>
                  <div className="font-medium text-green-600">{operation.recordsSuccessful}</div>
                </div>
                <div>
                  <span className="text-gray-600">Failed:</span>
                  <div className="font-medium text-red-600">{operation.recordsFailed}</div>
                </div>
              </div>

              {operation.status === 'running' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((operation.recordsProcessed / (operation.recordsProcessed + 50)) * 100, 90)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Operation Details */}
      <div>
        {selectedOperation ? (
          <SyncOperationDetails operation={selectedOperation} />
        ) : (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Select an operation to view details</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const SyncOperationDetails: React.FC<{ operation: SyncOperation }> = ({ operation }) => (
  <div className="space-y-4">
    <h4 className="font-medium text-gray-900">Operation Details</h4>
    
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Operation ID:</span>
          <div className="font-mono text-xs">{operation.id}</div>
        </div>
        <div>
          <span className="text-gray-600">Integration:</span>
          <div className="font-medium">{operation.integrationId}</div>
        </div>
        <div>
          <span className="text-gray-600">Type:</span>
          <div className="font-medium">{operation.type}</div>
        </div>
        <div>
          <span className="text-gray-600">Status:</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(operation.status)}`}>
            {operation.status}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Started:</span>
          <div>{operation.startTime.toLocaleString()}</div>
        </div>
        <div>
          <span className="text-gray-600">Duration:</span>
          <div>
            {operation.endTime 
              ? `${Math.round((operation.endTime.getTime() - operation.startTime.getTime()) / 1000)}s`
              : 'Running...'
            }
          </div>
        </div>
      </div>
    </div>

    <div>
      <h5 className="font-medium text-gray-900 mb-2">Progress</h5>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Records Processed</span>
          <span>{operation.recordsProcessed}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-green-600">Successful</span>
          <span>{operation.recordsSuccessful}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-red-600">Failed</span>
          <span>{operation.recordsFailed}</span>
        </div>
        
        {operation.recordsProcessed > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full"
              style={{ 
                width: `${(operation.recordsSuccessful / operation.recordsProcessed) * 100}%` 
              }}
            ></div>
          </div>
        )}
      </div>
    </div>

    {operation.errors.length > 0 && (
      <div>
        <h5 className="font-medium text-gray-900 mb-2">Errors ({operation.errors.length})</h5>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {operation.errors.map(error => (
            <div key={error.id} className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-red-800">{error.errorCode}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  error.severity === 'critical' ? 'text-red-600 bg-red-100' :
                  error.severity === 'high' ? 'text-orange-600 bg-orange-100' :
                  error.severity === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                  'text-gray-600 bg-gray-100'
                }`}>
                  {error.severity}
                </span>
              </div>
              <p className="text-sm text-red-700">{error.errorMessage}</p>
              {error.recordId && (
                <p className="text-xs text-red-600 mt-1">Record: {error.recordId}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    <div>
      <h5 className="font-medium text-gray-900 mb-2">Metadata</h5>
      <div className="bg-gray-50 p-3 rounded-md">
        <pre className="text-xs text-gray-600 whitespace-pre-wrap">
          {JSON.stringify(operation.metadata, null, 2)}
        </pre>
      </div>
    </div>
  </div>
);

const ConflictResolutionTab: React.FC<{
  conflicts: ConflictResolution[];
  onResolveConflict: (conflictId: string, resolution: ConflictResolution['resolution']) => void;
}> = ({ conflicts, onResolveConflict }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h4 className="font-medium text-gray-900">Data Conflicts</h4>
      <div className="text-sm text-gray-600">
        {conflicts.filter(c => c.status === 'pending').length} pending conflicts
      </div>
    </div>

    <div className="space-y-4">
      {conflicts.map(conflict => (
        <ConflictResolutionCard
          key={conflict.id}
          conflict={conflict}
          onResolve={onResolveConflict}
        />
      ))}
    </div>

    {conflicts.length === 0 && (
      <div className="text-center py-8">
        <div className="text-gray-400 text-lg mb-2">✓</div>
        <p className="text-gray-500">No data conflicts found</p>
      </div>
    )}
  </div>
);

const ConflictResolutionCard: React.FC<{
  conflict: ConflictResolution;
  onResolve: (conflictId: string, resolution: ConflictResolution['resolution']) => void;
}> = ({ conflict, onResolve }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h5 className="font-medium text-gray-900">
          {conflict.conflictType.replace('_', ' ').toUpperCase()} Conflict
        </h5>
        <p className="text-sm text-gray-600">Record ID: {conflict.recordId}</p>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(conflict.status)}`}>
        {conflict.status}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <h6 className="font-medium text-gray-900 mb-2">Source Data</h6>
        <div className="bg-blue-50 p-3 rounded-md">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(conflict.sourceData, null, 2)}
          </pre>
        </div>
      </div>
      <div>
        <h6 className="font-medium text-gray-900 mb-2">Target Data</h6>
        <div className="bg-green-50 p-3 rounded-md">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(conflict.targetData, null, 2)}
          </pre>
        </div>
      </div>
    </div>

    {conflict.status === 'pending' && (
      <div className="flex space-x-2">
        <button
          onClick={() => onResolve(conflict.id, 'source_wins')}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          Use Source
        </button>
        <button
          onClick={() => onResolve(conflict.id, 'target_wins')}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
        >
          Use Target
        </button>
        <button
          onClick={() => onResolve(conflict.id, 'merge')}
          className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
        >
          Merge
        </button>
        <button
          onClick={() => onResolve(conflict.id, 'ignore')}
          className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
        >
          Ignore
        </button>
      </div>
    )}

    {conflict.status === 'resolved' && (
      <div className="text-sm text-gray-600">
        Resolved using <span className="font-medium">{conflict.resolution}</span>
        {conflict.resolvedAt && ` on ${conflict.resolvedAt.toLocaleString()}`}
      </div>
    )}
  </div>
);

const SyncHistoryTab: React.FC<{
  operations: SyncOperation[];
}> = ({ operations }) => (
  <div className="space-y-4">
    <h4 className="font-medium text-gray-900">Synchronization History</h4>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Operation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Integration
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {operation.integrationId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(operation.status)}`}>
                  {operation.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>Total: {operation.recordsProcessed}</div>
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

const DataMappingTab: React.FC<{
  integrations: Integration[];
}> = ({ integrations }) => (
  <div className="space-y-6">
    <h4 className="font-medium text-gray-900">Data Mapping Configuration</h4>
    
    {integrations.map(integration => (
      <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-4">{integration.name}</h5>
        
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
                  Transformation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mapping.transformation || 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      mapping.required ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100'
                    }`}>
                      {mapping.required ? 'Required' : 'Optional'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
            Add Field Mapping
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default DataSynchronizationInterface;
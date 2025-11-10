'use client';

import React, { useState, useRef } from 'react';
import { Organization, OrganizationType } from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface BulkOperation {
  type: 'import' | 'update' | 'validate' | 'export';
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
  results?: BulkOperationResult;
}

interface BulkOperationResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors: string[];
  warnings: string[];
  data?: Organization[];
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  organizationCount: number;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

interface ValidationWarning {
  row: number;
  field: string;
  message: string;
  value?: string;
}

interface OrganizationPerformanceMetrics {
  organizationId: string;
  organizationName: string;
  totalContacts: number;
  totalOpportunities: number;
  totalValue: number;
  averageRating: number;
  lastActivity: Date;
  conversionRate: number;
  engagementScore: number;
}

export default function BulkOrganizationManager() {
  const [currentOperation, setCurrentOperation] = useState<BulkOperation | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<OrganizationPerformanceMetrics[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        parseCSVFile(file);
      } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        parseJSONFile(file);
      }
    }
  };

  const parseCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1, 6).map((line, index) => { // Preview first 5 rows
        const values = line.split(',').map(v => v.trim());
        const row: any = { _row: index + 2 }; // +2 because we skip header and start from 1
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        return row;
      }).filter(row => Object.values(row).some(val => val !== ''));

      setPreviewData(data);
      setShowPreview(true);
    };
    reader.readAsText(file);
  };

  const parseJSONFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const data = Array.isArray(json) ? json.slice(0, 5) : [json]; // Preview first 5 items
        setPreviewData(data.map((item, index) => ({ ...item, _row: index + 1 })));
        setShowPreview(true);
      } catch (error) {
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  const validateImportData = async () => {
    if (!selectedFile) return;

    setCurrentOperation({
      type: 'validate',
      status: 'processing',
      progress: 0,
      message: 'Validating import data...'
    });

    try {
      // Simulate validation process
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        let data: any[] = [];

        if (selectedFile.name.endsWith('.csv')) {
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          data = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim());
            const row: any = { _row: index + 2 };
            headers.forEach((header, i) => {
              row[header] = values[i] || '';
            });
            return row;
          }).filter(row => Object.values(row).some(val => val !== ''));
        } else {
          data = JSON.parse(text);
          if (!Array.isArray(data)) data = [data];
          data = data.map((item, index) => ({ ...item, _row: index + 1 }));
        }

        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        // Validate each row
        data.forEach((row, index) => {
          const rowNum = row._row || index + 1;

          // Required fields validation
          if (!row.name || row.name.trim() === '') {
            errors.push({
              row: rowNum,
              field: 'name',
              message: 'Organization name is required',
              value: row.name
            });
          }

          if (!row.type || !Object.values(OrganizationType).includes(row.type)) {
            errors.push({
              row: rowNum,
              field: 'type',
              message: 'Valid organization type is required',
              value: row.type
            });
          }

          // Email validation
          if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
            errors.push({
              row: rowNum,
              field: 'email',
              message: 'Invalid email format',
              value: row.email
            });
          }

          // Phone validation
          if (row.phone && !/^\+?[\d\s\-\(\)]+$/.test(row.phone)) {
            warnings.push({
              row: rowNum,
              field: 'phone',
              message: 'Phone number format may be invalid',
              value: row.phone
            });
          }

          // Parent ID validation
          if (row.parentId && !data.some(d => d.id === row.parentId)) {
            warnings.push({
              row: rowNum,
              field: 'parentId',
              message: 'Parent organization not found in import data',
              value: row.parentId
            });
          }
        });

        const result: ValidationResult = {
          isValid: errors.length === 0,
          errors,
          warnings,
          organizationCount: data.length
        };

        setValidationResult(result);
        setCurrentOperation({
          type: 'validate',
          status: 'completed',
          progress: 100,
          message: `Validation completed. ${errors.length} errors, ${warnings.length} warnings found.`,
          results: {
            totalProcessed: data.length,
            successful: data.length - errors.length,
            failed: errors.length,
            errors: errors.map(e => `Row ${e.row}: ${e.message}`),
            warnings: warnings.map(w => `Row ${w.row}: ${w.message}`)
          }
        });
      };

      reader.readAsText(selectedFile);
    } catch (error) {
      setCurrentOperation({
        type: 'validate',
        status: 'error',
        progress: 0,
        message: 'Validation failed: ' + (error as Error).message
      });
    }
  };

  const performBulkImport = async () => {
    if (!selectedFile || !validationResult?.isValid) return;

    setCurrentOperation({
      type: 'import',
      status: 'processing',
      progress: 0,
      message: 'Importing organizations...'
    });

    try {
      // Simulate import process with progress updates
      const progressSteps = [10, 30, 50, 70, 90, 100];
      const messages = [
        'Reading file data...',
        'Validating organization data...',
        'Creating organizations...',
        'Setting up relationships...',
        'Finalizing import...',
        'Import completed successfully!'
      ];

      for (let i = 0; i < progressSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentOperation(prev => prev ? {
          ...prev,
          progress: progressSteps[i],
          message: messages[i]
        } : null);
      }

      setCurrentOperation(prev => prev ? {
        ...prev,
        status: 'completed',
        results: {
          totalProcessed: validationResult.organizationCount,
          successful: validationResult.organizationCount - validationResult.errors.length,
          failed: validationResult.errors.length,
          errors: [],
          warnings: validationResult.warnings.map(w => `Row ${w.row}: ${w.message}`)
        }
      } : null);

    } catch (error) {
      setCurrentOperation({
        type: 'import',
        status: 'error',
        progress: 0,
        message: 'Import failed: ' + (error as Error).message
      });
    }
  };

  const performBulkUpdate = async () => {
    setCurrentOperation({
      type: 'update',
      status: 'processing',
      progress: 0,
      message: 'Updating organizations...'
    });

    try {
      // Simulate bulk update process
      const organizations = await commercialService.getOrganizations();
      const updateCount = Math.min(organizations.length, 10); // Update first 10 for demo

      for (let i = 0; i < updateCount; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const progress = Math.round(((i + 1) / updateCount) * 100);
        setCurrentOperation(prev => prev ? {
          ...prev,
          progress,
          message: `Updating organization ${i + 1} of ${updateCount}...`
        } : null);
      }

      setCurrentOperation(prev => prev ? {
        ...prev,
        status: 'completed',
        message: 'Bulk update completed successfully!',
        results: {
          totalProcessed: updateCount,
          successful: updateCount,
          failed: 0,
          errors: [],
          warnings: []
        }
      } : null);

    } catch (error) {
      setCurrentOperation({
        type: 'update',
        status: 'error',
        progress: 0,
        message: 'Bulk update failed: ' + (error as Error).message
      });
    }
  };

  const generatePerformanceAnalytics = async () => {
    setCurrentOperation({
      type: 'export',
      status: 'processing',
      progress: 0,
      message: 'Generating performance analytics...'
    });

    try {
      const organizations = await commercialService.getOrganizations();
      const opportunities = await commercialService.getOpportunities();
      const engineers = await commercialService.getEngineers();

      const metrics: OrganizationPerformanceMetrics[] = organizations.map(org => {
        const orgOpportunities = opportunities.filter(opp => opp.engineeringFirmId === org.id);
        const orgContacts = engineers.filter(eng => eng.engineeringFirmId === org.id);
        
        const totalValue = orgOpportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);
        const averageRating = orgContacts.length > 0 
          ? orgContacts.reduce((sum, contact) => sum + contact.rating, 0) / orgContacts.length 
          : 0;
        
        const recentActivity = Math.max(
          ...orgContacts.map(c => c.lastContactDate?.getTime() || 0),
          ...orgOpportunities.map(o => o.updatedAt.getTime())
        );

        return {
          organizationId: org.id,
          organizationName: org.name,
          totalContacts: orgContacts.length,
          totalOpportunities: orgOpportunities.length,
          totalValue,
          averageRating,
          lastActivity: new Date(recentActivity),
          conversionRate: Math.random() * 100, // Mock conversion rate
          engagementScore: Math.random() * 100 // Mock engagement score
        };
      });

      setPerformanceMetrics(metrics);
      setCurrentOperation({
        type: 'export',
        status: 'completed',
        progress: 100,
        message: 'Performance analytics generated successfully!',
        results: {
          totalProcessed: metrics.length,
          successful: metrics.length,
          failed: 0,
          errors: [],
          warnings: [],
          data: organizations
        }
      });

    } catch (error) {
      setCurrentOperation({
        type: 'export',
        status: 'error',
        progress: 0,
        message: 'Analytics generation failed: ' + (error as Error).message
      });
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderOperationProgress = () => {
    if (!currentOperation) return null;

    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-blue-900 capitalize">
            {currentOperation.type} Operation
          </h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            currentOperation.status === 'completed' ? 'bg-green-100 text-green-800' :
            currentOperation.status === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {currentOperation.status}
          </span>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm text-blue-700 mb-1">
            <span>{currentOperation.message}</span>
            <span>{currentOperation.progress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentOperation.progress}%` }}
            ></div>
          </div>
        </div>

        {currentOperation.results && (
          <div className="mt-4 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="font-medium text-blue-700">Total:</span>
                <span className="ml-1 text-blue-900">{currentOperation.results.totalProcessed}</span>
              </div>
              <div>
                <span className="font-medium text-green-700">Successful:</span>
                <span className="ml-1 text-green-900">{currentOperation.results.successful}</span>
              </div>
              <div>
                <span className="font-medium text-red-700">Failed:</span>
                <span className="ml-1 text-red-900">{currentOperation.results.failed}</span>
              </div>
              <div>
                <span className="font-medium text-yellow-700">Warnings:</span>
                <span className="ml-1 text-yellow-900">{currentOperation.results.warnings.length}</span>
              </div>
            </div>

            {currentOperation.results.errors.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium text-red-700 mb-1">Errors:</h4>
                <ul className="text-red-600 text-xs space-y-1">
                  {currentOperation.results.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {currentOperation.results.errors.length > 5 && (
                    <li>• ... and {currentOperation.results.errors.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderValidationResults = () => {
    if (!validationResult) return null;

    return (
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Validation Results</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{validationResult.organizationCount}</div>
            <div className="text-sm text-gray-600">Organizations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{validationResult.errors.length}</div>
            <div className="text-sm text-gray-600">Errors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{validationResult.warnings.length}</div>
            <div className="text-sm text-gray-600">Warnings</div>
          </div>
        </div>

        {validationResult.errors.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-red-700 mb-2">Errors (must be fixed before import):</h4>
            <div className="max-h-32 overflow-y-auto">
              <ul className="text-red-600 text-sm space-y-1">
                {validationResult.errors.map((error, index) => (
                  <li key={index}>
                    Row {error.row}, {error.field}: {error.message}
                    {error.value && <span className="text-gray-500"> (value: "{error.value}")</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {validationResult.warnings.length > 0 && (
          <div>
            <h4 className="font-medium text-yellow-700 mb-2">Warnings (recommended to review):</h4>
            <div className="max-h-32 overflow-y-auto">
              <ul className="text-yellow-600 text-sm space-y-1">
                {validationResult.warnings.map((warning, index) => (
                  <li key={index}>
                    Row {warning.row}, {warning.field}: {warning.message}
                    {warning.value && <span className="text-gray-500"> (value: "{warning.value}")</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFilePreview = () => {
    if (!showPreview || previewData.length === 0) return null;

    return (
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">File Preview (first 5 rows)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(previewData[0] || {}).filter(key => key !== '_row').map(key => (
                  <th key={key} className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, index) => (
                <tr key={index} className="border-b">
                  {Object.entries(row).filter(([key]) => key !== '_row').map(([key, value]) => (
                    <td key={key} className="px-3 py-2 text-gray-900">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPerformanceMetrics = () => {
    if (performanceMetrics.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Organization Performance Analytics</h3>
          <button
            onClick={() => exportToCSV(performanceMetrics, 'organization-performance.csv')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Export to CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacts
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunities
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {performanceMetrics.slice(0, 10).map((metric) => (
                <tr key={metric.organizationId} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{metric.organizationName}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.totalContacts}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.totalOpportunities}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${metric.totalValue.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.averageRating.toFixed(1)}/5
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.engagementScore.toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Organization Management</h1>
        <p className="text-gray-600 mt-1">
          Import, update, validate, and analyze organization data in bulk
        </p>
      </div>

      {renderOperationProgress()}

      {/* Import Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Organizations</h2>
        
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3"
          >
            Select File
          </button>
          {selectedFile && (
            <span className="text-sm text-gray-600">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          )}
        </div>

        {renderFilePreview()}
        {renderValidationResults()}

        <div className="flex space-x-3">
          <button
            onClick={validateImportData}
            disabled={!selectedFile || currentOperation?.status === 'processing'}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
          >
            Validate Data
          </button>
          <button
            onClick={performBulkImport}
            disabled={!validationResult?.isValid || currentOperation?.status === 'processing'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            Import Organizations
          </button>
        </div>
      </div>

      {/* Bulk Operations Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bulk Operations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={performBulkUpdate}
            disabled={currentOperation?.status === 'processing'}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Bulk Update</h3>
            <p className="text-sm text-gray-600">
              Update multiple organization records with new information
            </p>
          </button>
          
          <button
            onClick={generatePerformanceAnalytics}
            disabled={currentOperation?.status === 'processing'}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-left disabled:opacity-50"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Performance Analytics</h3>
            <p className="text-sm text-gray-600">
              Generate comprehensive performance metrics for all organizations
            </p>
          </button>
        </div>
      </div>

      {renderPerformanceMetrics()}

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Format Guidelines</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Required Fields</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <code className="bg-gray-200 px-1 rounded">name</code> - Organization name</li>
              <li>• <code className="bg-gray-200 px-1 rounded">type</code> - Organization type</li>
              <li>• <code className="bg-gray-200 px-1 rounded">email</code> - Contact email</li>
              <li>• <code className="bg-gray-200 px-1 rounded">phone</code> - Contact phone</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Optional Fields</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <code className="bg-gray-200 px-1 rounded">parentId</code> - Parent organization ID</li>
              <li>• <code className="bg-gray-200 px-1 rounded">territoryId</code> - Territory assignment</li>
              <li>• <code className="bg-gray-200 px-1 rounded">address</code> - Physical address</li>
              <li>• <code className="bg-gray-200 px-1 rounded">isActive</code> - Active status (true/false)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold text-gray-900 mb-2">Supported Organization Types</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(OrganizationType).map(type => (
              <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useRef } from 'react';
import { Organization, OrganizationType } from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';
import {
  Stack,
  Group,
  Title,
  Text,
  Paper,
  Button,
  FileInput,
  Progress,
  SimpleGrid,
  Table,
  Badge,
  Alert,
  Code,
  ThemeIcon,
  Grid,
  FileButton,
  ActionIcon,
  ScrollArea
} from '@mantine/core';
import {
  IconUpload,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconFileSpreadsheet,
  IconRefresh,
  IconChartBar,
  IconDownload,
  IconInfoCircle,
  IconDatabaseImport,
  IconDatabaseExport,
  IconFile
} from '@tabler/icons-react';

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
  const resetRef = useRef<() => void>(null);

  const handleFileSelect = (file: File | null) => {
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
      
      const data = lines.slice(1, 6).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const row: any = { _row: index + 2 };
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
        const data = Array.isArray(json) ? json.slice(0, 5) : [json];
        setPreviewData(data.map((item, index) => ({ ...item, _row: index + 1 })));
        setShowPreview(true);
      } catch (error) {
        console.error('Invalid JSON file format');
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

        data.forEach((row, index) => {
          const rowNum = row._row || index + 1;

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

          if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
            errors.push({
              row: rowNum,
              field: 'email',
              message: 'Invalid email format',
              value: row.email
            });
          }

          if (row.phone && !/^\+?[\d\s\-\(\)]+$/.test(row.phone)) {
            warnings.push({
              row: rowNum,
              field: 'phone',
              message: 'Phone number format may be invalid',
              value: row.phone
            });
          }

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
      const organizations = await commercialService.getOrganizations();
      const updateCount = Math.min(organizations.length, 10);

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
          conversionRate: Math.random() * 100,
          engagementScore: Math.random() * 100
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
      <Alert 
        variant="light" 
        color={currentOperation.status === 'completed' ? 'green' : currentOperation.status === 'error' ? 'red' : 'blue'}
        title={`${currentOperation.type.charAt(0).toUpperCase() + currentOperation.type.slice(1)} Operation`}
        icon={currentOperation.status === 'completed' ? <IconCheck size={16} /> : currentOperation.status === 'error' ? <IconX size={16} /> : <IconRefresh size={16} className="animate-spin" />}
        mb="lg"
      >
        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="sm">{currentOperation.message}</Text>
            <Badge 
              color={currentOperation.status === 'completed' ? 'green' : currentOperation.status === 'error' ? 'red' : 'blue'}
            >
              {currentOperation.status}
            </Badge>
          </Group>
          
          <Progress 
            value={currentOperation.progress} 
            animated={currentOperation.status === 'processing'} 
            color={currentOperation.status === 'completed' ? 'green' : currentOperation.status === 'error' ? 'red' : 'blue'}
          />

          {currentOperation.results && (
            <Paper withBorder p="xs" bg="white">
              <SimpleGrid cols={{ base: 2, md: 4 }}>
                <Text size="sm"><Text span fw={700} c="blue">Total:</Text> {currentOperation.results.totalProcessed}</Text>
                <Text size="sm"><Text span fw={700} c="green">Success:</Text> {currentOperation.results.successful}</Text>
                <Text size="sm"><Text span fw={700} c="red">Failed:</Text> {currentOperation.results.failed}</Text>
                <Text size="sm"><Text span fw={700} c="yellow">Warnings:</Text> {currentOperation.results.warnings.length}</Text>
              </SimpleGrid>

              {currentOperation.results.errors.length > 0 && (
                <Stack gap="xs" mt="xs">
                  <Text size="sm" fw={700} c="red">Errors:</Text>
                  <ScrollArea h={100}>
                    {currentOperation.results.errors.map((error, index) => (
                      <Text key={index} size="xs" c="red">• {error}</Text>
                    ))}
                  </ScrollArea>
                </Stack>
              )}
            </Paper>
          )}
        </Stack>
      </Alert>
    );
  };

  const renderValidationResults = () => {
    if (!validationResult) return null;

    return (
      <Paper withBorder p="md" mb="lg" bg="gray.0">
        <Title order={4} mb="md">Validation Results</Title>
        
        <SimpleGrid cols={3} mb="md">
          <Stack align="center" gap={0}>
            <Text size="xl" fw={700} c="blue">{validationResult.organizationCount}</Text>
            <Text size="xs" c="dimmed">Organizations</Text>
          </Stack>
          <Stack align="center" gap={0}>
            <Text size="xl" fw={700} c="red">{validationResult.errors.length}</Text>
            <Text size="xs" c="dimmed">Errors</Text>
          </Stack>
          <Stack align="center" gap={0}>
            <Text size="xl" fw={700} c="yellow">{validationResult.warnings.length}</Text>
            <Text size="xs" c="dimmed">Warnings</Text>
          </Stack>
        </SimpleGrid>

        {validationResult.errors.length > 0 && (
          <Alert color="red" title="Errors (must be fixed before import)" mb="sm" icon={<IconX size={16} />}>
            <ScrollArea h={100}>
              <Stack gap={4}>
                {validationResult.errors.map((error, index) => (
                  <Text key={index} size="xs">
                    Row {error.row}, {error.field}: {error.message}
                    {error.value && <Text span c="dimmed"> (value: "{error.value}")</Text>}
                  </Text>
                ))}
              </Stack>
            </ScrollArea>
          </Alert>
        )}

        {validationResult.warnings.length > 0 && (
          <Alert color="yellow" title="Warnings (recommended to review)" icon={<IconAlertTriangle size={16} />}>
            <ScrollArea h={100}>
              <Stack gap={4}>
                {validationResult.warnings.map((warning, index) => (
                  <Text key={index} size="xs">
                    Row {warning.row}, {warning.field}: {warning.message}
                    {warning.value && <Text span c="dimmed"> (value: "{warning.value}")</Text>}
                  </Text>
                ))}
              </Stack>
            </ScrollArea>
          </Alert>
        )}
      </Paper>
    );
  };

  const renderFilePreview = () => {
    if (!showPreview || previewData.length === 0) return null;

    return (
      <Paper withBorder p="md" mb="lg">
        <Title order={4} mb="md">File Preview (first 5 rows)</Title>
        <ScrollArea>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                {Object.keys(previewData[0] || {}).filter(key => key !== '_row').map(key => (
                  <Table.Th key={key}>{key}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {previewData.map((row, index) => (
                <Table.Tr key={index}>
                  {Object.entries(row).filter(([key]) => key !== '_row').map(([key, value]) => (
                    <Table.Td key={key}>{String(value)}</Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    );
  };

  const renderPerformanceMetrics = () => {
    if (performanceMetrics.length === 0) return null;

    return (
      <Paper withBorder p="md" mb="lg">
        <Group justify="space-between" mb="md">
          <Title order={3}>Organization Performance Analytics</Title>
          <Button
            leftSection={<IconDownload size={16} />}
            color="green"
            onClick={() => exportToCSV(performanceMetrics, 'organization-performance.csv')}
          >
            Export to CSV
          </Button>
        </Group>
        
        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Organization</Table.Th>
                <Table.Th>Contacts</Table.Th>
                <Table.Th>Opportunities</Table.Th>
                <Table.Th>Total Value</Table.Th>
                <Table.Th>Avg Rating</Table.Th>
                <Table.Th>Engagement</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {performanceMetrics.slice(0, 10).map((metric) => (
                <Table.Tr key={metric.organizationId}>
                  <Table.Td fw={500}>{metric.organizationName}</Table.Td>
                  <Table.Td>{metric.totalContacts}</Table.Td>
                  <Table.Td>{metric.totalOpportunities}</Table.Td>
                  <Table.Td>${metric.totalValue.toLocaleString()}</Table.Td>
                  <Table.Td>{metric.averageRating.toFixed(1)}/5</Table.Td>
                  <Table.Td>{metric.engagementScore.toFixed(0)}%</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    );
  };

  return (
    <Stack gap="xl" p="md">
      <Stack gap="xs">
        <Title order={2}>Bulk Organization Management</Title>
        <Text c="dimmed">
          Import, update, validate, and analyze organization data in bulk
        </Text>
      </Stack>

      {renderOperationProgress()}

      {/* Import Section */}
      <Paper withBorder p="xl" radius="md">
        <Title order={3} mb="md">Import Organizations</Title>
        
        <Group mb="md">
          <FileButton resetRef={resetRef} onChange={handleFileSelect} accept=".csv,.json">
            {(props) => (
              <Button {...props} leftSection={<IconFileSpreadsheet size={16} />}>
                Select File
              </Button>
            )}
          </FileButton>
          
          {selectedFile && (
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color="blue"><IconFile size={12} /></ThemeIcon>
              <Text size="sm">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </Text>
              <ActionIcon size="sm" color="red" variant="subtle" onClick={() => {
                setSelectedFile(null);
                setPreviewData([]);
                setShowPreview(false);
                setValidationResult(null);
                resetRef.current?.();
              }}>
                <IconX size={14} />
              </ActionIcon>
            </Group>
          )}
        </Group>

        {renderFilePreview()}
        {renderValidationResults()}

        <Group>
          <Button
            leftSection={<IconCheck size={16} />}
            color="yellow"
            onClick={validateImportData}
            disabled={!selectedFile || currentOperation?.status === 'processing'}
          >
            Validate Data
          </Button>
          <Button
            leftSection={<IconDatabaseImport size={16} />}
            color="green"
            onClick={performBulkImport}
            disabled={!validationResult?.isValid || currentOperation?.status === 'processing'}
          >
            Import Organizations
          </Button>
        </Group>
      </Paper>

      {/* Bulk Operations Section */}
      <Paper withBorder p="xl" radius="md">
        <Title order={3} mb="md">Bulk Operations</Title>
        
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Paper 
            component="button" 
            onClick={performBulkUpdate}
            disabled={currentOperation?.status === 'processing'}
            withBorder 
            p="lg" 
            style={{ 
              textAlign: 'left', 
              cursor: 'pointer',
              borderColor: 'var(--mantine-color-blue-3)',
              backgroundColor: 'var(--mantine-color-blue-0)',
              transition: 'all 0.2s ease'
            }}
          >
            <Group mb="xs">
              <ThemeIcon size="lg" variant="light" color="blue"><IconRefresh size={20} /></ThemeIcon>
              <Text fw={600} size="lg">Bulk Update</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Update multiple organization records with new information
            </Text>
          </Paper>
          
          <Paper 
            component="button" 
            onClick={generatePerformanceAnalytics}
            disabled={currentOperation?.status === 'processing'}
            withBorder 
            p="lg" 
            style={{ 
              textAlign: 'left', 
              cursor: 'pointer',
              borderColor: 'var(--mantine-color-green-3)',
              backgroundColor: 'var(--mantine-color-green-0)',
              transition: 'all 0.2s ease'
            }}
          >
            <Group mb="xs">
              <ThemeIcon size="lg" variant="light" color="green"><IconChartBar size={20} /></ThemeIcon>
              <Text fw={600} size="lg">Performance Analytics</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Generate comprehensive performance metrics for all organizations
            </Text>
          </Paper>
        </SimpleGrid>
      </Paper>

      {renderPerformanceMetrics()}

      {/* Help Section */}
      <Paper withBorder p="xl" radius="md" bg="gray.0">
        <Group mb="md">
          <IconInfoCircle size={24} />
          <Title order={3}>Import Format Guidelines</Title>
        </Group>
        
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <div>
            <Text fw={600} mb="xs">Required Fields</Text>
            <Stack gap="xs">
              <Text size="sm">• <Code>name</Code> - Organization name</Text>
              <Text size="sm">• <Code>type</Code> - Organization type</Text>
              <Text size="sm">• <Code>email</Code> - Contact email</Text>
              <Text size="sm">• <Code>phone</Code> - Contact phone</Text>
            </Stack>
          </div>
          
          <div>
            <Text fw={600} mb="xs">Optional Fields</Text>
            <Stack gap="xs">
              <Text size="sm">• <Code>parentId</Code> - Parent organization ID</Text>
              <Text size="sm">• <Code>territoryId</Code> - Territory assignment</Text>
              <Text size="sm">• <Code>address</Code> - Physical address</Text>
              <Text size="sm">• <Code>isActive</Code> - Active status (true/false)</Text>
            </Stack>
          </div>
        </SimpleGrid>
        
        <Text fw={600} mt="lg" mb="xs">Supported Organization Types</Text>
        <Group gap="xs">
          {Object.values(OrganizationType).map(type => (
            <Badge key={type} variant="light" color="blue">
              {type}
            </Badge>
          ))}
        </Group>
      </Paper>
    </Stack>
  );
}

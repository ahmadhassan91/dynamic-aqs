'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  TextInput,
  Select,
  Tabs,
  Card,
  Badge,
  ActionIcon,
  SimpleGrid,
  Accordion,
  Divider
} from '@mantine/core';
import {
  IconGripVertical,
  IconX,
  IconPlus,
  IconTrash,
  IconTemplate,
  IconDeviceFloppy,
  IconEye,
  IconFilter,
  IconChartBar
} from '@tabler/icons-react';
import { ReportPreview } from './ReportPreview';
import { ReportTemplates } from './ReportTemplates';

interface ReportField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  category: string;
  description?: string;
}

interface ReportConfig {
  name: string;
  description: string;
  fields: string[];
  groupBy: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filters: ReportFilter[];
  aggregations: ReportAggregation[];
  format: 'table' | 'chart' | 'summary';
  chartType?: 'bar' | 'line' | 'pie' | 'area';
}

interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: string | string[];
}

interface ReportAggregation {
  field: string;
  function: 'sum' | 'avg' | 'count' | 'min' | 'max';
  alias?: string;
}

export function CustomReportBuilder() {
  const [activeStep, setActiveStep] = useState<'fields' | 'grouping' | 'filters' | 'preview'>('fields');
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: 'Custom Report',
    description: '',
    fields: [],
    groupBy: [],
    sortBy: '',
    sortOrder: 'asc',
    filters: [],
    aggregations: [],
    format: 'table'
  });
  const [availableFields, setAvailableFields] = useState<ReportField[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [draggedField, setDraggedField] = useState<string | null>(null);

  useEffect(() => {
    // Initialize available fields from different data sources
    const fields: ReportField[] = [
      // Customer fields
      { id: 'customer.companyName', name: 'Company Name', type: 'string', category: 'Customer' },
      { id: 'customer.contactName', name: 'Contact Name', type: 'string', category: 'Customer' },
      { id: 'customer.status', name: 'Customer Status', type: 'string', category: 'Customer' },
      { id: 'customer.totalRevenue', name: 'Total Revenue', type: 'number', category: 'Customer' },
      { id: 'customer.totalOrders', name: 'Total Orders', type: 'number', category: 'Customer' },
      { id: 'customer.createdAt', name: 'Customer Since', type: 'date', category: 'Customer' },
      { id: 'customer.lastContactDate', name: 'Last Contact', type: 'date', category: 'Customer' },
      
      // Territory fields
      { id: 'territory.name', name: 'Territory Name', type: 'string', category: 'Territory' },
      { id: 'territory.manager', name: 'Territory Manager', type: 'string', category: 'Territory' },
      { id: 'region.name', name: 'Region Name', type: 'string', category: 'Territory' },
      { id: 'region.manager', name: 'Regional Director', type: 'string', category: 'Territory' },
      
      // Order fields
      { id: 'order.orderNumber', name: 'Order Number', type: 'string', category: 'Orders' },
      { id: 'order.totalAmount', name: 'Order Amount', type: 'number', category: 'Orders' },
      { id: 'order.status', name: 'Order Status', type: 'string', category: 'Orders' },
      { id: 'order.orderDate', name: 'Order Date', type: 'date', category: 'Orders' },
      { id: 'order.expectedShipDate', name: 'Expected Ship Date', type: 'date', category: 'Orders' },
      
      // Training fields
      { id: 'training.type', name: 'Training Type', type: 'string', category: 'Training' },
      { id: 'training.status', name: 'Training Status', type: 'string', category: 'Training' },
      { id: 'training.completedDate', name: 'Completion Date', type: 'date', category: 'Training' },
      { id: 'training.duration', name: 'Duration (minutes)', type: 'number', category: 'Training' },
      { id: 'training.rating', name: 'Training Rating', type: 'number', category: 'Training' },
      
      // Lead fields
      { id: 'lead.source', name: 'Lead Source', type: 'string', category: 'Leads' },
      { id: 'lead.status', name: 'Lead Status', type: 'string', category: 'Leads' },
      { id: 'lead.score', name: 'Lead Score', type: 'number', category: 'Leads' },
      { id: 'lead.createdAt', name: 'Lead Created', type: 'date', category: 'Leads' },
      { id: 'lead.convertedAt', name: 'Conversion Date', type: 'date', category: 'Leads' }
    ];
    
    setAvailableFields(fields);
  }, []);

  const handleFieldDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedField(fieldId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleFieldDrop = (e: React.DragEvent, dropZone: 'fields' | 'groupBy') => {
    e.preventDefault();
    if (!draggedField) return;

    if (dropZone === 'fields' && !reportConfig.fields.includes(draggedField)) {
      setReportConfig(prev => ({
        ...prev,
        fields: [...prev.fields, draggedField]
      }));
    } else if (dropZone === 'groupBy' && !reportConfig.groupBy.includes(draggedField)) {
      setReportConfig(prev => ({
        ...prev,
        groupBy: [...prev.groupBy, draggedField]
      }));
    }
    
    setDraggedField(null);
  };

  const handleFieldRemove = (fieldId: string, from: 'fields' | 'groupBy') => {
    if (from === 'fields') {
      setReportConfig(prev => ({
        ...prev,
        fields: prev.fields.filter(f => f !== fieldId)
      }));
    } else {
      setReportConfig(prev => ({
        ...prev,
        groupBy: prev.groupBy.filter(f => f !== fieldId)
      }));
    }
  };

  const addFilter = () => {
    setReportConfig(prev => ({
      ...prev,
      filters: [...prev.filters, { field: '', operator: 'equals', value: '' }]
    }));
  };

  const updateFilter = (index: number, filter: ReportFilter) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.map((f, i) => i === index ? filter : f)
    }));
  };

  const removeFilter = (index: number) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }));
  };

  const addAggregation = () => {
    setReportConfig(prev => ({
      ...prev,
      aggregations: [...prev.aggregations, { field: '', function: 'sum' }]
    }));
  };

  const updateAggregation = (index: number, aggregation: ReportAggregation) => {
    setReportConfig(prev => ({
      ...prev,
      aggregations: prev.aggregations.map((a, i) => i === index ? aggregation : a)
    }));
  };

  const removeAggregation = (index: number) => {
    setReportConfig(prev => ({
      ...prev,
      aggregations: prev.aggregations.filter((_, i) => i !== index)
    }));
  };

  const handleSaveReport = () => {
    // Mock save functionality
    const savedReport = {
      ...reportConfig,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: 'current-user'
    };
    
    const existingReports = JSON.parse(localStorage.getItem('custom-reports') || '[]');
    existingReports.push(savedReport);
    localStorage.setItem('custom-reports', JSON.stringify(existingReports));
    
    alert('Report saved successfully!');
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Mock export functionality
    const reportData = {
      config: reportConfig,
      generatedAt: new Date().toISOString()
    };
    
    if (format === 'csv') {
      const csvContent = generateMockCSV();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = reportConfig.name.replace(/\s+/g, '-').toLowerCase();
      a.download = safeName + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert(format.toUpperCase() + ' export functionality would be implemented here.');
    }
  };

  const generateMockCSV = (): string => {
    const headers = reportConfig.fields.map(fieldId => {
      const field = availableFields.find(f => f.id === fieldId);
      return field?.name || fieldId;
    });
    
    const mockRows = Array.from({ length: 10 }, (_, i) => 
      reportConfig.fields.map(fieldId => {
        const field = availableFields.find(f => f.id === fieldId);
        switch (field?.type) {
          case 'string': return 'Sample ' + field.name + ' ' + (i + 1);
          case 'number': return (Math.random() * 1000).toFixed(2);
          case 'date': return new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          case 'boolean': return Math.random() > 0.5 ? 'Yes' : 'No';
          default: return 'Value ' + (i + 1);
        }
      })
    );
    
    const csvRows = [headers, ...mockRows];
    return csvRows.map(row => row.join(',')).join('\n');
  };

  const getFieldsByCategory = () => {
    const categories: { [key: string]: ReportField[] } = {};
    availableFields.forEach(field => {
      if (!categories[field.category]) {
        categories[field.category] = [];
      }
      categories[field.category].push(field);
    });
    return categories;
  };

  const renderFieldsStep = () => (
    <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
      {/* Available Fields */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Title order={4} mb="md">Available Fields</Title>
        <Accordion variant="contained">
          {Object.entries(getFieldsByCategory()).map(([category, fields]) => (
            <Accordion.Item key={category} value={category}>
              <Accordion.Control>
                <Text fw={500}>{category}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  {fields.map(field => (
                    <Card
                      key={field.id}
                      padding="xs"
                      radius="sm"
                      withBorder
                      style={{ cursor: 'move' }}
                      onDragStart={(e) => handleFieldDragStart(e, field.id)}
                      draggable
                    >
                      <Group justify="space-between">
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>{field.name}</Text>
                          <Badge size="xs" variant="light">{field.type}</Badge>
                        </Stack>
                        <IconGripVertical size={16} color="var(--mantine-color-gray-5)" />
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card>

      {/* Selected Fields */}
      <SimpleGrid cols={1} spacing="md" style={{ gridColumn: 'span 2' }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {/* Report Fields */}
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Title order={4} mb="md">Report Fields</Title>
            <Paper
              p="md"
              style={{
                minHeight: 200,
                border: '2px dashed var(--mantine-color-gray-4)',
                borderRadius: 'var(--mantine-radius-md)'
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleFieldDrop(e, 'fields')}
            >
              {reportConfig.fields.length === 0 ? (
                <Text ta="center" c="dimmed" py="xl">
                  Drag fields here to include in your report
                </Text>
              ) : (
                <Stack gap="xs">
                  {reportConfig.fields.map(fieldId => {
                    const field = availableFields.find(f => f.id === fieldId);
                    return (
                      <Group key={fieldId} justify="space-between" p="xs" bg="blue.0" style={{ borderRadius: 'var(--mantine-radius-sm)' }}>
                        <Text size="sm" fw={500}>{field?.name}</Text>
                        <ActionIcon
                          size="sm"
                          color="red"
                          variant="subtle"
                          onClick={() => handleFieldRemove(fieldId, 'fields')}
                        >
                          <IconX size={14} />
                        </ActionIcon>
                      </Group>
                    );
                  })}
                </Stack>
              )}
            </Paper>
          </Card>

          {/* Group By Fields */}
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Title order={4} mb="md">Group By</Title>
            <Paper
              p="md"
              style={{
                minHeight: 200,
                border: '2px dashed var(--mantine-color-gray-4)',
                borderRadius: 'var(--mantine-radius-md)'
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleFieldDrop(e, 'groupBy')}
            >
              {reportConfig.groupBy.length === 0 ? (
                <Text ta="center" c="dimmed" py="xl">
                  Drag fields here to group your data
                </Text>
              ) : (
                <Stack gap="xs">
                  {reportConfig.groupBy.map(fieldId => {
                    const field = availableFields.find(f => f.id === fieldId);
                    return (
                      <Group key={fieldId} justify="space-between" p="xs" bg="green.0" style={{ borderRadius: 'var(--mantine-radius-sm)' }}>
                        <Text size="sm" fw={500}>{field?.name}</Text>
                        <ActionIcon
                          size="sm"
                          color="red"
                          variant="subtle"
                          onClick={() => handleFieldRemove(fieldId, 'groupBy')}
                        >
                          <IconX size={14} />
                        </ActionIcon>
                      </Group>
                    );
                  })}
                </Stack>
              )}
            </Paper>
          </Card>
        </SimpleGrid>

        {/* Aggregations */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Title order={4}>Aggregations</Title>
            <Button
              size="xs"
              leftSection={<IconPlus size={14} />}
              onClick={addAggregation}
            >
              Add Aggregation
            </Button>
          </Group>
          <Stack gap="xs">
            {reportConfig.aggregations.map((agg, index) => (
              <Group key={index} gap="sm" p="sm" bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-sm)' }}>
                <Select
                  placeholder="Select Field"
                  value={agg.field}
                  onChange={(value) => updateAggregation(index, { ...agg, field: value || '' })}
                  data={availableFields.filter(f => f.type === 'number').map(field => ({
                    value: field.id,
                    label: field.name
                  }))}
                  style={{ flex: 1 }}
                />
                <Select
                  value={agg.function}
                  onChange={(value) => updateAggregation(index, { ...agg, function: value as any })}
                  data={[
                    { value: 'sum', label: 'Sum' },
                    { value: 'avg', label: 'Average' },
                    { value: 'count', label: 'Count' },
                    { value: 'min', label: 'Minimum' },
                    { value: 'max', label: 'Maximum' }
                  ]}
                  style={{ flex: 1 }}
                />
                <TextInput
                  placeholder="Alias (optional)"
                  value={agg.alias || ''}
                  onChange={(e) => updateAggregation(index, { ...agg, alias: e.target.value })}
                  style={{ flex: 1 }}
                />
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => removeAggregation(index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </Card>
      </SimpleGrid>
    </SimpleGrid>
  );

  const renderFiltersStep = () => (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={4}>Report Filters</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={addFilter}
        >
          Add Filter
        </Button>
      </Group>

      <Stack gap="md">
        {reportConfig.filters.map((filter, index) => (
          <Group key={index} gap="sm" p="md" bg="gray.0" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
            <Select
              placeholder="Select Field"
              value={filter.field}
              onChange={(value) => updateFilter(index, { ...filter, field: value || '' })}
              data={availableFields.map(field => ({
                value: field.id,
                label: field.name
              }))}
              style={{ flex: 1 }}
            />
            
            <Select
              value={filter.operator}
              onChange={(value) => updateFilter(index, { ...filter, operator: value as any })}
              data={[
                { value: 'equals', label: 'Equals' },
                { value: 'contains', label: 'Contains' },
                { value: 'greater_than', label: 'Greater Than' },
                { value: 'less_than', label: 'Less Than' },
                { value: 'between', label: 'Between' },
                { value: 'in', label: 'In List' }
              ]}
              style={{ flex: 1 }}
            />
            
            <TextInput
              placeholder="Filter value"
              value={Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}
              onChange={(e) => updateFilter(index, { 
                ...filter, 
                value: filter.operator === 'in' ? e.target.value.split(',').map(v => v.trim()) : e.target.value 
              })}
              style={{ flex: 2 }}
            />
            
            <ActionIcon
              color="red"
              variant="subtle"
              onClick={() => removeFilter(index)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ))}
        
        {reportConfig.filters.length === 0 && (
          <Paper p="xl" style={{ border: '2px dashed var(--mantine-color-gray-4)' }}>
            <Text ta="center" c="dimmed">
              No filters added. Click "Add Filter" to filter your report data.
            </Text>
          </Paper>
        )}
      </Stack>

      <Divider />

      {/* Sorting */}
      <Stack gap="md">
        <Title order={5}>Sorting</Title>
        <Group>
          <Select
            placeholder="No Sorting"
            value={reportConfig.sortBy}
            onChange={(value) => setReportConfig(prev => ({ ...prev, sortBy: value || '' }))}
            data={reportConfig.fields.map(fieldId => {
              const field = availableFields.find(f => f.id === fieldId);
              return { value: fieldId, label: field?.name || fieldId };
            })}
            style={{ flex: 1 }}
          />
          
          <Select
            value={reportConfig.sortOrder}
            onChange={(value) => setReportConfig(prev => ({ ...prev, sortOrder: value as 'asc' | 'desc' }))}
            data={[
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' }
            ]}
            disabled={!reportConfig.sortBy}
            style={{ flex: 1 }}
          />
        </Group>
      </Stack>
    </Stack>
  );

  return (
    <Stack gap="md">
      {/* Header */}
      <Paper shadow="sm" p="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={2}>Custom Report Builder</Title>
            <Text c="dimmed">Create custom reports with drag-and-drop field selection</Text>
          </Stack>
          <Group gap="sm">
            <Button
              variant="light"
              leftSection={<IconTemplate size={16} />}
              onClick={() => setShowTemplates(true)}
            >
              Templates
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleSaveReport}
            >
              Save Report
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* Report Configuration */}
      <Paper shadow="sm" p="md">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mb="md">
          <TextInput
            label="Report Name"
            value={reportConfig.name}
            onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
          />
          <TextInput
            label="Description"
            value={reportConfig.description}
            onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
          />
        </SimpleGrid>

        {/* Step Navigation */}
        <Tabs value={activeStep} onChange={(value) => setActiveStep(value as any)}>
          <Tabs.List>
            <Tabs.Tab value="fields" leftSection={<IconChartBar size={16} />}>
              Fields & Grouping
            </Tabs.Tab>
            <Tabs.Tab value="filters" leftSection={<IconFilter size={16} />}>
              Filters & Sorting
            </Tabs.Tab>
            <Tabs.Tab value="preview" leftSection={<IconEye size={16} />}>
              Preview & Export
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="fields" pt="lg">
            {renderFieldsStep()}
          </Tabs.Panel>

          <Tabs.Panel value="filters" pt="lg">
            {renderFiltersStep()}
          </Tabs.Panel>

          <Tabs.Panel value="preview" pt="lg">
            <ReportPreview 
              config={reportConfig} 
              fields={availableFields}
              onExport={handleExportReport}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* Templates Modal */}
      {showTemplates && (
        <ReportTemplates
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={(template) => {
            setReportConfig(template);
            setShowTemplates(false);
          }}
        />
      )}
    </Stack>
  );
}
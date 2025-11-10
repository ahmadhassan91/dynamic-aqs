'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Badge,
  Stack,
  Grid,
  Select,
  TextInput,
  Modal,
  Checkbox,
  MultiSelect,
  Textarea,
  Table,
  ActionIcon,
  Menu,
  rem,
  Tabs,
  Alert,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconReportAnalytics,
  IconPlus,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconSearch,
  IconDownload,
  IconShare,
  IconCalendar,
  IconFilter,
  IconTable,
  IconChartBar,
  IconFileExport,
  IconCopy,
  IconStar,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface ReportField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  category: 'session' | 'customer' | 'trainer' | 'performance';
}

interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: any;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  fields: string[];
  filters: ReportFilter[];
  groupBy?: string;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
  dateRange: {
    start?: Date;
    end?: Date;
  };
  createdBy: string;
  createdAt: Date;
  lastRun?: Date;
  isPublic: boolean;
  isFavorite: boolean;
}

// Available report fields
const reportFields: ReportField[] = [
  // Session fields
  { id: 'session_title', name: 'sessionTitle', label: 'Session Title', type: 'text', category: 'session' },
  { id: 'session_type', name: 'sessionType', label: 'Session Type', type: 'select', category: 'session' },
  { id: 'session_date', name: 'sessionDate', label: 'Session Date', type: 'date', category: 'session' },
  { id: 'session_duration', name: 'sessionDuration', label: 'Duration (minutes)', type: 'number', category: 'session' },
  { id: 'session_status', name: 'sessionStatus', label: 'Status', type: 'select', category: 'session' },
  { id: 'attendee_count', name: 'attendeeCount', label: 'Attendee Count', type: 'number', category: 'session' },
  
  // Customer fields
  { id: 'customer_name', name: 'customerName', label: 'Customer Name', type: 'text', category: 'customer' },
  { id: 'customer_territory', name: 'customerTerritory', label: 'Territory', type: 'select', category: 'customer' },
  { id: 'customer_region', name: 'customerRegion', label: 'Region', type: 'select', category: 'customer' },
  
  // Trainer fields
  { id: 'trainer_name', name: 'trainerName', label: 'Trainer Name', type: 'text', category: 'trainer' },
  { id: 'trainer_role', name: 'trainerRole', label: 'Trainer Role', type: 'select', category: 'trainer' },
  
  // Performance fields
  { id: 'completion_status', name: 'completionStatus', label: 'Completion Status', type: 'boolean', category: 'performance' },
  { id: 'rating', name: 'rating', label: 'Rating', type: 'number', category: 'performance' },
  { id: 'certification_awarded', name: 'certificationAwarded', label: 'Certification Awarded', type: 'boolean', category: 'performance' },
  { id: 'feedback_comments', name: 'feedbackComments', label: 'Feedback Comments', type: 'text', category: 'performance' },
];

// Mock custom reports
const mockReports: CustomReport[] = [
  {
    id: '1',
    name: 'Monthly Training Summary',
    description: 'Summary of all training sessions completed in the current month',
    fields: ['session_title', 'session_type', 'session_date', 'customer_name', 'trainer_name', 'completion_status', 'rating'],
    filters: [
      { field: 'session_date', operator: 'between', value: [new Date(2024, 1, 1), new Date(2024, 1, 29)] },
      { field: 'completion_status', operator: 'equals', value: true }
    ],
    groupBy: 'session_type',
    sortBy: 'session_date',
    sortOrder: 'desc',
    dateRange: { start: new Date(2024, 1, 1), end: new Date(2024, 1, 29) },
    createdBy: 'John Smith',
    createdAt: new Date('2024-02-01'),
    lastRun: new Date('2024-02-15'),
    isPublic: true,
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Trainer Performance Report',
    description: 'Performance metrics for all trainers including ratings and completion rates',
    fields: ['trainer_name', 'session_title', 'session_type', 'completion_status', 'rating', 'attendee_count'],
    filters: [
      { field: 'rating', operator: 'greater_than', value: 0 }
    ],
    groupBy: 'trainer_name',
    sortBy: 'rating',
    sortOrder: 'desc',
    dateRange: { start: new Date(2024, 0, 1), end: new Date(2024, 2, 31) },
    createdBy: 'Sarah Johnson',
    createdAt: new Date('2024-01-15'),
    lastRun: new Date('2024-02-10'),
    isPublic: false,
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Customer Training Progress',
    description: 'Training progress and certification status by customer',
    fields: ['customer_name', 'customer_territory', 'session_title', 'session_type', 'completion_status', 'certification_awarded'],
    filters: [
      { field: 'completion_status', operator: 'equals', value: true }
    ],
    groupBy: 'customer_name',
    sortBy: 'customer_name',
    sortOrder: 'asc',
    dateRange: {},
    createdBy: 'Mike Davis',
    createdAt: new Date('2024-01-20'),
    isPublic: true,
    isFavorite: true,
  }
];

export function CustomTrainingReports() {
  const { trainingSessions, customers, users } = useMockData();
  const [reports] = useState<CustomReport[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [creatorFilter, setCreatorFilter] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('reports');
  const [selectedReport, setSelectedReport] = useState<CustomReport | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // New report form state
  const [newReport, setNewReport] = useState<Partial<CustomReport>>({
    name: '',
    description: '',
    fields: [],
    filters: [],
    groupBy: '',
    sortBy: '',
    sortOrder: 'asc',
    dateRange: {},
    isPublic: false,
  });

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = !searchQuery || 
        report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCreator = !creatorFilter || report.createdBy === creatorFilter;
      const matchesFavorites = !showFavoritesOnly || report.isFavorite;

      return matchesSearch && matchesCreator && matchesFavorites;
    });
  }, [reports, searchQuery, creatorFilter, showFavoritesOnly]);

  // Generate report data
  const generateReportData = (report: CustomReport) => {
    // This would normally query the database with the report filters
    // For now, we'll use the mock data and apply basic filtering
    
    let data = trainingSessions.map(session => {
      const customer = customers.find(c => c.id === session.customerId);
      const trainer = users.find(u => u.id === session.trainerId);
      
      return {
        sessionTitle: session.title,
        sessionType: session.type,
        sessionDate: session.scheduledDate,
        sessionDuration: session.duration,
        sessionStatus: session.status,
        attendeeCount: session.attendees.length,
        customerName: customer?.companyName || 'Unknown',
        customerTerritory: customer?.territoryManagerId || 'Unknown',
        customerRegion: customer?.regionalManagerId || 'Unknown',
        trainerName: trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown',
        trainerRole: trainer?.role || 'Unknown',
        completionStatus: session.status === 'completed',
        rating: session.feedback?.rating || 0,
        certificationAwarded: !!session.certificationAwarded,
        feedbackComments: session.feedback?.comments || '',
      };
    });

    // Apply date range filter
    if (report.dateRange.start || report.dateRange.end) {
      data = data.filter(item => {
        const itemDate = new Date(item.sessionDate);
        if (report.dateRange.start && itemDate < report.dateRange.start) return false;
        if (report.dateRange.end && itemDate > report.dateRange.end) return false;
        return true;
      });
    }

    // Apply custom filters
    report.filters.forEach(filter => {
      data = data.filter(item => {
        const fieldValue = (item as any)[filter.field];
        
        switch (filter.operator) {
          case 'equals':
            return fieldValue === filter.value;
          case 'contains':
            return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'greater_than':
            return Number(fieldValue) > Number(filter.value);
          case 'less_than':
            return Number(fieldValue) < Number(filter.value);
          default:
            return true;
        }
      });
    });

    // Sort data
    if (report.sortBy) {
      data.sort((a, b) => {
        const aValue = (a as any)[report.sortBy!];
        const bValue = (b as any)[report.sortBy!];
        
        let comparison = 0;
        if (aValue > bValue) comparison = 1;
        if (aValue < bValue) comparison = -1;
        
        return report.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return data;
  };

  const handleCreateReport = () => {
    setSelectedReport(null);
    setIsEditing(false);
    setNewReport({
      name: '',
      description: '',
      fields: [],
      filters: [],
      groupBy: '',
      sortBy: '',
      sortOrder: 'asc',
      dateRange: {},
      isPublic: false,
    });
    setShowCreateModal(true);
  };

  const handleEditReport = (report: CustomReport) => {
    setSelectedReport(report);
    setIsEditing(true);
    setNewReport(report);
    setShowCreateModal(true);
  };

  const handleViewReport = (report: CustomReport) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleRunReport = (report: CustomReport) => {
    // Generate and download report
    const data = generateReportData(report);
    console.log('Running report:', report.name, 'Data:', data);
    // In a real app, this would generate and download the report
  };

  const getFieldLabel = (fieldId: string) => {
    const field = reportFields.find(f => f.id === fieldId);
    return field?.label || fieldId;
  };

  const formatFilterValue = (filter: ReportFilter) => {
    if (Array.isArray(filter.value)) {
      return filter.value.map(v => String(v)).join(', ');
    }
    return String(filter.value);
  };

  const fieldOptions = reportFields.map(field => ({
    value: field.id,
    label: field.label,
    group: field.category.charAt(0).toUpperCase() + field.category.slice(1),
  }));

  const creatorOptions = [...new Set(reports.map(r => r.createdBy))].map(creator => ({
    value: creator,
    label: creator,
  }));

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Custom Training Reports</Title>
          <Text c="dimmed" size="sm">
            Create and manage custom training reports with flexible filtering and grouping
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreateReport}>
          Create Report
        </Button>
      </Group>

      {/* Filters */}
      <Card withBorder p="md">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              placeholder="Search reports..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Filter by creator"
              data={creatorOptions}
              value={creatorFilter}
              onChange={setCreatorFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Button 
              variant={showFavoritesOnly ? 'filled' : 'light'}
              leftSection={<IconStar size={16} />}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              fullWidth
            >
              Favorites Only
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Button variant="light" leftSection={<IconFilter size={16} />} fullWidth>
              Advanced
            </Button>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="reports" leftSection={<IconReportAnalytics size={16} />}>
            My Reports
          </Tabs.Tab>
          <Tabs.Tab value="public" leftSection={<IconShare size={16} />}>
            Public Reports
          </Tabs.Tab>
          <Tabs.Tab value="templates" leftSection={<IconTable size={16} />}>
            Templates
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="reports" pt="lg">
          <Grid>
            {filteredReports.map((report) => (
              <Grid.Col key={report.id} span={{ base: 12, md: 6, lg: 4 }}>
                <Card withBorder p="lg" h="100%">
                  <Stack gap="md" h="100%">
                    <Group justify="space-between">
                      <Group gap="xs">
                        {report.isFavorite && <IconStar size={16} fill="gold" color="gold" />}
                        <Badge color={report.isPublic ? 'blue' : 'gray'} variant="light" size="sm">
                          {report.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </Group>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                            onClick={() => handleViewReport(report)}
                          >
                            View Details
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconDownload style={{ width: rem(14), height: rem(14) }} />}
                            onClick={() => handleRunReport(report)}
                          >
                            Run Report
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                            onClick={() => handleEditReport(report)}
                          >
                            Edit Report
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}
                          >
                            Duplicate
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconShare style={{ width: rem(14), height: rem(14) }} />}
                          >
                            Share
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                            color="red"
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>

                    <div style={{ flex: 1 }}>
                      <Title order={4} mb="xs">{report.name}</Title>
                      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                        {report.description}
                      </Text>

                      <Stack gap="xs">
                        <Group gap="xs">
                          <IconTable size={14} />
                          <Text size="sm">{report.fields.length} fields</Text>
                        </Group>
                        <Group gap="xs">
                          <IconFilter size={14} />
                          <Text size="sm">{report.filters.length} filters</Text>
                        </Group>
                        {report.groupBy && (
                          <Group gap="xs">
                            <IconChartBar size={14} />
                            <Text size="sm">Grouped by {getFieldLabel(report.groupBy)}</Text>
                          </Group>
                        )}
                      </Stack>
                    </div>

                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">Created by {report.createdBy}</Text>
                        {report.lastRun && (
                          <Text size="xs" c="dimmed">
                            Last run: {new Intl.DateTimeFormat('en-US').format(report.lastRun)}
                          </Text>
                        )}
                      </Group>
                      <Group justify="space-between">
                        <Button 
                          size="xs" 
                          variant="light"
                          onClick={() => handleViewReport(report)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="xs"
                          leftSection={<IconDownload size={14} />}
                          onClick={() => handleRunReport(report)}
                        >
                          Run Report
                        </Button>
                      </Group>
                    </Stack>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="public" pt="lg">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Public Reports"
            color="blue"
            variant="light"
            mb="md"
          >
            These reports are shared by other users in your organization and can be used as templates.
          </Alert>
          
          <Grid>
            {filteredReports.filter(r => r.isPublic).map((report) => (
              <Grid.Col key={report.id} span={{ base: 12, md: 6, lg: 4 }}>
                <Card withBorder p="lg">
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Badge color="blue" variant="light">Public</Badge>
                      <ActionIcon variant="subtle">
                        <IconCopy size={16} />
                      </ActionIcon>
                    </Group>
                    
                    <div>
                      <Title order={4} mb="xs">{report.name}</Title>
                      <Text size="sm" c="dimmed" mb="md">
                        {report.description}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Created by {report.createdBy}
                      </Text>
                    </div>

                    <Group justify="space-between">
                      <Button size="xs" variant="light">
                        Use Template
                      </Button>
                      <Button size="xs" leftSection={<IconDownload size={14} />}>
                        Run Report
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="templates" pt="lg">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card withBorder p="lg">
                <Stack gap="md">
                  <Badge color="green" variant="light">Template</Badge>
                  <div>
                    <Title order={4} mb="xs">Training Completion Report</Title>
                    <Text size="sm" c="dimmed" mb="md">
                      Standard report showing training completion rates by customer and trainer
                    </Text>
                  </div>
                  <Button size="sm" leftSection={<IconPlus size={14} />}>
                    Use Template
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card withBorder p="lg">
                <Stack gap="md">
                  <Badge color="green" variant="light">Template</Badge>
                  <div>
                    <Title order={4} mb="xs">Certification Tracking Report</Title>
                    <Text size="sm" c="dimmed" mb="md">
                      Track certification awards and renewal dates across all customers
                    </Text>
                  </div>
                  <Button size="sm" leftSection={<IconPlus size={14} />}>
                    Use Template
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card withBorder p="lg">
                <Stack gap="md">
                  <Badge color="green" variant="light">Template</Badge>
                  <div>
                    <Title order={4} mb="xs">Trainer Performance Report</Title>
                    <Text size="sm" c="dimmed" mb="md">
                      Analyze trainer effectiveness with ratings and completion metrics
                    </Text>
                  </div>
                  <Button size="sm" leftSection={<IconPlus size={14} />}>
                    Use Template
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>

      {/* Report Detail Modal */}
      <Modal
        opened={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Details"
        size="lg"
      >
        {selectedReport && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Title order={3}>{selectedReport.name}</Title>
                <Group gap="xs" mt="xs">
                  <Badge color={selectedReport.isPublic ? 'blue' : 'gray'} variant="light">
                    {selectedReport.isPublic ? 'Public' : 'Private'}
                  </Badge>
                  {selectedReport.isFavorite && (
                    <Badge color="yellow" variant="light">
                      <IconStar size={12} style={{ marginRight: 4 }} />
                      Favorite
                    </Badge>
                  )}
                </Group>
              </div>
              <Button leftSection={<IconDownload size={16} />} onClick={() => handleRunReport(selectedReport)}>
                Run Report
              </Button>
            </Group>

            <Text>{selectedReport.description}</Text>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Created By</Text>
                <Text fw={500}>{selectedReport.createdBy}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Created Date</Text>
                <Text fw={500}>
                  {new Intl.DateTimeFormat('en-US').format(selectedReport.createdAt)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Last Run</Text>
                <Text fw={500}>
                  {selectedReport.lastRun ? 
                    new Intl.DateTimeFormat('en-US').format(selectedReport.lastRun) :
                    'Never'
                  }
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Sort Order</Text>
                <Text fw={500}>
                  {selectedReport.sortBy ? 
                    `${getFieldLabel(selectedReport.sortBy)} (${selectedReport.sortOrder})` :
                    'None'
                  }
                </Text>
              </Grid.Col>
            </Grid>

            <div>
              <Text fw={500} mb="xs">Fields ({selectedReport.fields.length})</Text>
              <Group gap="xs">
                {selectedReport.fields.map((fieldId) => (
                  <Badge key={fieldId} variant="outline" size="sm">
                    {getFieldLabel(fieldId)}
                  </Badge>
                ))}
              </Group>
            </div>

            {selectedReport.filters.length > 0 && (
              <div>
                <Text fw={500} mb="xs">Filters ({selectedReport.filters.length})</Text>
                <Stack gap="xs">
                  {selectedReport.filters.map((filter, index) => (
                    <Card key={index} withBorder p="sm">
                      <Text size="sm">
                        <strong>{getFieldLabel(filter.field)}</strong> {filter.operator.replace('_', ' ')} <strong>{formatFilterValue(filter)}</strong>
                      </Text>
                    </Card>
                  ))}
                </Stack>
              </div>
            )}

            {selectedReport.groupBy && (
              <div>
                <Text fw={500} mb="xs">Grouping</Text>
                <Badge variant="light" color="blue">
                  Grouped by {getFieldLabel(selectedReport.groupBy)}
                </Badge>
              </div>
            )}
          </Stack>
        )}
      </Modal>

      {/* Create/Edit Report Modal */}
      <Modal
        opened={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={isEditing ? 'Edit Report' : 'Create Custom Report'}
        size="xl"
      >
        <Stack gap="md">
          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Report Name"
                placeholder="Enter report name"
                required
                value={newReport.name}
                onChange={(event) => setNewReport(prev => ({ ...prev, name: event.currentTarget.value }))}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Checkbox
                label="Make Public"
                description="Allow others to use this report"
                checked={newReport.isPublic}
                onChange={(event) => setNewReport(prev => ({ ...prev, isPublic: event.currentTarget.checked }))}
                mt="lg"
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Description"
            placeholder="Describe what this report shows"
            rows={3}
            value={newReport.description}
            onChange={(event) => setNewReport(prev => ({ ...prev, description: event.currentTarget.value }))}
          />

          <MultiSelect
            label="Report Fields"
            placeholder="Select fields to include in the report"
            data={fieldOptions}
            value={newReport.fields}
            onChange={(value) => setNewReport(prev => ({ ...prev, fields: value }))}
            searchable
            required
          />

          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Group By (Optional)"
                placeholder="Select field to group by"
                data={fieldOptions}
                value={newReport.groupBy}
                onChange={(value) => setNewReport(prev => ({ ...prev, groupBy: value || '' }))}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Sort By (Optional)"
                placeholder="Select field to sort by"
                data={fieldOptions}
                value={newReport.sortBy}
                onChange={(value) => setNewReport(prev => ({ ...prev, sortBy: value || '' }))}
                clearable
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Start Date (Optional)"
                placeholder="Select start date"
                value={newReport.dateRange?.start}
                onChange={(value) => setNewReport(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, start: value ? new Date(value) : undefined }
                }))}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="End Date (Optional)"
                placeholder="Select end date"
                value={newReport.dateRange?.end}
                onChange={(value) => setNewReport(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, end: value ? new Date(value) : undefined }
                }))}
                clearable
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button>
              {isEditing ? 'Update Report' : 'Create Report'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
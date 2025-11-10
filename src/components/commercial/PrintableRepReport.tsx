'use client';

import { useState, useEffect } from 'react';
import { 
  ManufacturerRep,
  CommercialOpportunity,
  EngineerContact,
  Organization
} from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';
import { 
  Modal, 
  Button, 
  Select, 
  Group, 
  Stack, 
  Text, 
  Title, 
  Checkbox, 
  TextInput,
  Textarea,
  ActionIcon,
  Paper,
  Badge,
  Divider,
  Card,
  SimpleGrid
} from '@mantine/core';
import { 
  IconSettings, 
  IconCalendar, 
  IconDownload, 
  IconMail, 
  IconTemplate,
  IconPlus,
  IconTrash,
  IconEdit
} from '@tabler/icons-react';

interface PrintableRepReportProps {
  repId?: string;
  className?: string;
}

interface RepReportData {
  rep: ManufacturerRep;
  opportunities: CommercialOpportunity[];
  engineers: EngineerContact[];
  organizations: Organization[];
  reportPeriod: {
    start: Date;
    end: Date;
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: {
    executiveSummary: boolean;
    performanceMetrics: boolean;
    territoryCoverage: boolean;
    recentOpportunities: boolean;
    engineerRelationships: boolean;
    actionItems: boolean;
    customSections: string[];
  };
  format: 'standard' | 'executive' | 'detailed' | 'custom';
  includeCharts: boolean;
  includeRawData: boolean;
  customFields: string[];
}

interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: string;
  dayOfMonth?: string;
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'email';
  includeCharts: boolean;
  includeRawData: boolean;
  customMessage: string;
  isActive: boolean;
}

// Template Customization Form Component
function CustomizeTemplateForm({ 
  template, 
  onSave, 
  onCancel 
}: { 
  template: ReportTemplate; 
  onSave: (template: ReportTemplate) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<ReportTemplate>(template);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Group grow>
          <TextInput
            label="Template Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.currentTarget.value }))}
            required
          />
          <Select
            label="Format"
            value={formData.format}
            onChange={(value) => setFormData(prev => ({ ...prev, format: value as any }))}
            data={[
              { value: 'standard', label: 'Standard' },
              { value: 'executive', label: 'Executive' },
              { value: 'detailed', label: 'Detailed' },
              { value: 'custom', label: 'Custom' }
            ]}
          />
        </Group>

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.currentTarget.value }))}
          rows={2}
        />

        <Stack gap="xs">
          <Text fw={500} size="sm">Report Sections</Text>
          <SimpleGrid cols={2} spacing="xs">
            {Object.entries(formData.sections).map(([key, value]) => {
              if (key === 'customSections') return null;
              return (
                <Checkbox
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  checked={value as boolean}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sections: { ...prev.sections, [key]: e.currentTarget.checked }
                  }))}
                />
              );
            })}
          </SimpleGrid>
        </Stack>

        <Group grow>
          <Checkbox
            label="Include Charts"
            checked={formData.includeCharts}
            onChange={(e) => setFormData(prev => ({ ...prev, includeCharts: e.currentTarget.checked }))}
          />
          <Checkbox
            label="Include Raw Data"
            checked={formData.includeRawData}
            onChange={(e) => setFormData(prev => ({ ...prev, includeRawData: e.currentTarget.checked }))}
          />
        </Group>

        <Divider />

        <Group justify="flex-end">
          <Button variant="subtle" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save Template
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

// Schedule Report Form Component
function ScheduleReportForm({ 
  onSchedule, 
  onCancel, 
  existingSchedules,
  onDeleteSchedule,
  onToggleSchedule
}: { 
  onSchedule: (schedule: ScheduleConfig) => void; 
  onCancel: () => void;
  existingSchedules: ScheduleConfig[];
  onDeleteSchedule: (index: number) => void;
  onToggleSchedule: (index: number) => void;
}) {
  const [formData, setFormData] = useState<ScheduleConfig>({
    frequency: 'weekly',
    dayOfWeek: 'monday',
    time: '09:00',
    recipients: [''],
    format: 'pdf',
    includeCharts: true,
    includeRawData: false,
    customMessage: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(formData);
  };

  const addRecipient = () => {
    setFormData(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }));
  };

  const updateRecipient = (index: number, email: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.map((r, i) => i === index ? email : r)
    }));
  };

  const removeRecipient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  return (
    <Stack gap="md">
      {/* Existing Schedules */}
      {existingSchedules.length > 0 && (
        <Stack gap="xs">
          <Title order={5}>Existing Schedules</Title>
          {existingSchedules.map((schedule, index) => (
            <Card key={index} withBorder p="sm">
              <Group justify="space-between">
                <Stack gap={2}>
                  <Group gap="sm">
                    <Badge color={schedule.isActive ? 'green' : 'gray'} size="sm">
                      {schedule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Text size="sm" fw={500}>
                      {schedule.frequency} at {schedule.time}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed">
                    {schedule.recipients.length} recipient(s) • {schedule.format.toUpperCase()}
                  </Text>
                </Stack>
                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    color={schedule.isActive ? 'orange' : 'green'}
                    onClick={() => onToggleSchedule(index)}
                  >
                    <IconSettings size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => onDeleteSchedule(index)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          ))}
          <Divider />
        </Stack>
      )}

      {/* New Schedule Form */}
      <Title order={5}>Create New Schedule</Title>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Group grow>
            <Select
              label="Frequency"
              value={formData.frequency}
              onChange={(value) => setFormData(prev => ({ ...prev, frequency: value as any }))}
              data={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' }
              ]}
            />
            {formData.frequency === 'weekly' && (
              <Select
                label="Day of Week"
                value={formData.dayOfWeek}
                onChange={(value) => setFormData(prev => ({ ...prev, dayOfWeek: value || 'monday' }))}
                data={[
                  { value: 'monday', label: 'Monday' },
                  { value: 'tuesday', label: 'Tuesday' },
                  { value: 'wednesday', label: 'Wednesday' },
                  { value: 'thursday', label: 'Thursday' },
                  { value: 'friday', label: 'Friday' }
                ]}
              />
            )}
            <TextInput
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.currentTarget.value }))}
            />
          </Group>

          <Stack gap="xs">
            <Text fw={500} size="sm">Email Recipients</Text>
            {formData.recipients.map((recipient, index) => (
              <Group key={index} gap="xs">
                <TextInput
                  flex={1}
                  type="email"
                  value={recipient}
                  onChange={(e) => updateRecipient(index, e.currentTarget.value)}
                  placeholder="Enter email address"
                />
                {formData.recipients.length > 1 && (
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => removeRecipient(index)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                )}
              </Group>
            ))}
            <Button
              variant="subtle"
              leftSection={<IconPlus size={16} />}
              onClick={addRecipient}
              size="sm"
            >
              Add Recipient
            </Button>
          </Stack>

          <Group grow>
            <Select
              label="Format"
              value={formData.format}
              onChange={(value) => setFormData(prev => ({ ...prev, format: value as any }))}
              data={[
                { value: 'pdf', label: 'PDF' },
                { value: 'excel', label: 'Excel' },
                { value: 'csv', label: 'CSV' },
                { value: 'email', label: 'Email Summary' }
              ]}
            />
          </Group>

          <Group grow>
            <Checkbox
              label="Include Charts"
              checked={formData.includeCharts}
              onChange={(e) => setFormData(prev => ({ ...prev, includeCharts: e.currentTarget.checked }))}
            />
            <Checkbox
              label="Include Raw Data"
              checked={formData.includeRawData}
              onChange={(e) => setFormData(prev => ({ ...prev, includeRawData: e.currentTarget.checked }))}
            />
          </Group>

          <Textarea
            label="Custom Message (Optional)"
            value={formData.customMessage}
            onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.currentTarget.value }))}
            placeholder="Add a custom message to include with the report..."
            rows={3}
          />

          <Divider />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Report
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}

export default function PrintableRepReport({ repId, className = '' }: PrintableRepReportProps) {
  const [reportData, setReportData] = useState<RepReportData | null>(null);
  const [selectedRep, setSelectedRep] = useState<string>(repId || '');
  const [availableReps, setAvailableReps] = useState<ManufacturerRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState<'month' | 'quarter' | 'year'>('quarter');
  
  // Template and scheduling state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<ReportTemplate>(getDefaultTemplate());
  const [savedTemplates, setSavedTemplates] = useState<ReportTemplate[]>([]);
  const [schedules, setSchedules] = useState<ScheduleConfig[]>([]);

  useEffect(() => {
    loadAvailableReps();
    loadSavedTemplates();
    loadSchedules();
  }, []);

  useEffect(() => {
    if (selectedRep) {
      loadRepReportData();
    }
  }, [selectedRep, reportPeriod]);

  function getDefaultTemplate(): ReportTemplate {
    return {
      id: 'default',
      name: 'Standard Rep Report',
      description: 'Standard manufacturer representative status report',
      sections: {
        executiveSummary: true,
        performanceMetrics: true,
        territoryCoverage: true,
        recentOpportunities: true,
        engineerRelationships: true,
        actionItems: true,
        customSections: []
      },
      format: 'standard',
      includeCharts: true,
      includeRawData: false,
      customFields: []
    };
  }

  const loadSavedTemplates = async () => {
    // Mock implementation - in real app, this would fetch from API
    const templates: ReportTemplate[] = [
      getDefaultTemplate(),
      {
        id: 'executive',
        name: 'Executive Summary',
        description: 'High-level overview for executives',
        sections: {
          executiveSummary: true,
          performanceMetrics: true,
          territoryCoverage: false,
          recentOpportunities: false,
          engineerRelationships: false,
          actionItems: true,
          customSections: []
        },
        format: 'executive',
        includeCharts: true,
        includeRawData: false,
        customFields: []
      },
      {
        id: 'detailed',
        name: 'Detailed Analysis',
        description: 'Comprehensive report with all data',
        sections: {
          executiveSummary: true,
          performanceMetrics: true,
          territoryCoverage: true,
          recentOpportunities: true,
          engineerRelationships: true,
          actionItems: true,
          customSections: ['Market Analysis', 'Competitive Intelligence']
        },
        format: 'detailed',
        includeCharts: true,
        includeRawData: true,
        customFields: ['Market Share', 'Competitive Position']
      }
    ];
    setSavedTemplates(templates);
  };

  const loadSchedules = async () => {
    // Mock implementation - in real app, this would fetch from API
    const mockSchedules: ScheduleConfig[] = [
      {
        frequency: 'weekly',
        dayOfWeek: 'monday',
        time: '09:00',
        recipients: ['manager@company.com'],
        format: 'pdf',
        includeCharts: true,
        includeRawData: false,
        customMessage: 'Weekly rep performance update',
        isActive: true
      }
    ];
    setSchedules(mockSchedules);
  };

  const loadAvailableReps = async () => {
    try {
      const reps = await commercialService.getManufacturerReps();
      setAvailableReps(reps);
      if (!selectedRep && reps.length > 0) {
        setSelectedRep(reps[0].id);
      }
    } catch (error) {
      console.error('Error loading reps:', error);
    }
  };

  const loadRepReportData = async () => {
    try {
      setLoading(true);
      
      const [rep, allOpportunities, allEngineers, allOrganizations] = await Promise.all([
        commercialService.getManufacturerRepById(selectedRep),
        commercialService.getOpportunities(),
        commercialService.getEngineers(),
        commercialService.getOrganizations()
      ]);

      if (!rep) {
        setReportData(null);
        return;
      }

      // Filter opportunities for this rep
      const repOpportunities = allOpportunities.filter(opp => 
        opp.manufacturerRepId === selectedRep
      );

      // Filter engineers for this rep
      const repEngineers = allEngineers.filter(eng => 
        eng.manufacturerRepId === selectedRep
      );

      // Calculate report period
      const now = new Date();
      let start: Date;
      
      switch (reportPeriod) {
        case 'month':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          start = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'year':
          start = new Date(now.getFullYear(), 0, 1);
          break;
      }

      setReportData({
        rep,
        opportunities: repOpportunities,
        engineers: repEngineers,
        organizations: allOrganizations,
        reportPeriod: { start, end: now }
      });
    } catch (error) {
      console.error('Error loading rep report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // In a real implementation, this would generate a PDF
    console.log('Exporting to PDF...');
    window.print();
  };

  const handleExportExcel = () => {
    // In a real implementation, this would generate an Excel file
    console.log('Exporting to Excel...');
    alert('Excel export functionality would be implemented here');
  };

  const handleSaveTemplate = (template: ReportTemplate) => {
    const updatedTemplates = [...savedTemplates];
    const existingIndex = updatedTemplates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      updatedTemplates[existingIndex] = template;
    } else {
      updatedTemplates.push({ ...template, id: `template_${Date.now()}` });
    }
    
    setSavedTemplates(updatedTemplates);
    setCurrentTemplate(template);
    setShowCustomizeModal(false);
    
    // In real implementation, save to API
    console.log('Template saved:', template);
  };

  const handleScheduleReport = (schedule: ScheduleConfig) => {
    const newSchedule = { ...schedule, isActive: true };
    setSchedules(prev => [...prev, newSchedule]);
    setShowScheduleModal(false);
    
    // In real implementation, save to API
    console.log('Report scheduled:', newSchedule);
    alert('Report scheduled successfully!');
  };

  const handleDeleteSchedule = (index: number) => {
    setSchedules(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleSchedule = (index: number) => {
    setSchedules(prev => prev.map((schedule, i) => 
      i === index ? { ...schedule, isActive: !schedule.isActive } : schedule
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Manufacturer Rep Status Report</h2>
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Representative
            </label>
            <select
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Select a rep...</option>
              {availableReps.map(rep => (
                <option key={rep.id} value={rep.id}>
                  {rep.personalInfo.firstName} {rep.personalInfo.lastName} - {rep.organizationId}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  const { rep, opportunities, engineers } = reportData;
  const quotaProgress = (rep.performance.ytdRevenue / rep.quota.annualQuota) * 100;
  
  // Calculate period-specific metrics
  const periodOpportunities = opportunities.filter(opp => 
    new Date(opp.createdAt) >= reportData.reportPeriod.start
  );
  const wonOpportunities = periodOpportunities.filter(opp => opp.salesPhase === 'Won');
  const periodRevenue = wonOpportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);

  return (
    <div className={`${className}`}>
      {/* Report Controls - Hidden when printing */}
      <div className="no-print mb-6">
        <Card withBorder p="md">
          <Stack gap="md">
            {/* Basic Controls */}
            <Group justify="space-between">
              <Group gap="md">
                <Select
                  label="Representative"
                  value={selectedRep}
                  onChange={(value) => setSelectedRep(value || '')}
                  data={availableReps.map(rep => ({
                    value: rep.id,
                    label: `${rep.personalInfo.firstName} ${rep.personalInfo.lastName}`
                  }))}
                  style={{ minWidth: 200 }}
                />
                <Select
                  label="Report Period"
                  value={reportPeriod}
                  onChange={(value) => setReportPeriod(value as any)}
                  data={[
                    { value: 'month', label: 'This Month' },
                    { value: 'quarter', label: 'This Quarter' },
                    { value: 'year', label: 'This Year' }
                  ]}
                />
                <Select
                  label="Template"
                  value={currentTemplate.id}
                  onChange={(value) => {
                    const template = savedTemplates.find(t => t.id === value);
                    if (template) setCurrentTemplate(template);
                  }}
                  data={savedTemplates.map(template => ({
                    value: template.id,
                    label: template.name
                  }))}
                />
              </Group>
              
              <Group gap="sm">
                <Button
                  variant="light"
                  leftSection={<IconTemplate size={16} />}
                  onClick={() => setShowTemplateModal(true)}
                >
                  Templates
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconSettings size={16} />}
                  onClick={() => setShowCustomizeModal(true)}
                >
                  Customize
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconCalendar size={16} />}
                  onClick={() => setShowScheduleModal(true)}
                >
                  Schedule
                </Button>
              </Group>
            </Group>

            {/* Export Actions */}
            <Group justify="space-between">
              <Group gap="sm">
                <Button
                  leftSection={<IconDownload size={16} />}
                  onClick={handlePrint}
                >
                  Print
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconDownload size={16} />}
                  onClick={handleExportPDF}
                >
                  Export PDF
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconDownload size={16} />}
                  onClick={handleExportExcel}
                >
                  Export Excel
                </Button>
              </Group>

              {/* Active Schedules */}
              {schedules.filter(s => s.isActive).length > 0 && (
                <Group gap="xs">
                  <Text size="sm" c="dimmed">Active Schedules:</Text>
                  {schedules.filter(s => s.isActive).map((schedule, index) => (
                    <Badge key={index} color="green" variant="light" size="sm">
                      {schedule.frequency} at {schedule.time}
                    </Badge>
                  ))}
                </Group>
              )}
            </Group>
          </Stack>
        </Card>
      </div>

      {/* Printable Report */}
      <div className="bg-white p-8 shadow-lg print:shadow-none print:p-0">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manufacturer Representative Status Report
              </h1>
              <h2 className="text-xl text-gray-700 mt-2">
                {rep.personalInfo.firstName} {rep.personalInfo.lastName}
              </h2>
              <p className="text-gray-600">{rep.organizationId}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Report Period</div>
              <div className="font-medium">
                {reportData.reportPeriod.start.toLocaleDateString()} - {reportData.reportPeriod.end.toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600 mt-2">Generated: {new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        {currentTemplate.sections.executiveSummary && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Executive Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{formatPercentage(quotaProgress)}</div>
              <div className="text-sm text-gray-600">Quota Achievement</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatCurrency(rep.performance.ytdRevenue)} / {formatCurrency(rep.quota.annualQuota)}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{periodOpportunities.length}</div>
              <div className="text-sm text-gray-600">New Opportunities</div>
              <div className="text-xs text-gray-500 mt-1">This {reportPeriod}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(periodRevenue)}</div>
              <div className="text-sm text-gray-600">Period Revenue</div>
              <div className="text-xs text-gray-500 mt-1">{wonOpportunities.length} deals won</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">{formatPercentage(rep.performance.conversionRate)}</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
              <div className="text-xs text-gray-500 mt-1">Overall performance</div>
            </div>
          </div>
        </div>
        )}

        {/* Performance Metrics */}
        {currentTemplate.sections.performanceMetrics && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Quota Progress</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Annual Quota</span>
                    <span>{formatCurrency(rep.quota.annualQuota)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        quotaProgress >= 100 ? 'bg-green-500' : 
                        quotaProgress >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(quotaProgress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {formatCurrency(rep.performance.ytdRevenue)} achieved ({formatPercentage(quotaProgress)})
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Activity Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Quotes:</span>
                  <span className="font-medium">{rep.performance.totalQuotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase Orders:</span>
                  <span className="font-medium">{rep.performance.totalPOs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipments:</span>
                  <span className="font-medium">{rep.performance.totalShipments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Deal Size:</span>
                  <span className="font-medium">{formatCurrency(rep.performance.averageDealSize)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Territory Coverage */}
        {currentTemplate.sections.territoryCoverage && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Territory Coverage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Assigned Territories</h4>
              <div className="space-y-2">
                {rep.territoryIds.map((territoryId, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-900">{territoryId}</span>
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Engineering Firm Relationships</h4>
              <div className="space-y-2">
                {engineers.slice(0, 5).map(engineer => (
                  <div key={engineer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {engineer.personalInfo.firstName} {engineer.personalInfo.lastName}
                      </div>
                      <div className="text-xs text-gray-600">{engineer.engineeringFirmId}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{engineer.rating}★</div>
                      <div className="text-xs text-gray-600">{engineer.opportunities.length} opps</div>
                    </div>
                  </div>
                ))}
                {engineers.length > 5 && (
                  <div className="text-sm text-gray-600 text-center">
                    +{engineers.length - 5} more engineers
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Recent Opportunities */}
        {currentTemplate.sections.recentOpportunities && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Opportunities</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                    Project Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                    Market Segment
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                    Value
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                    Phase
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                    Probability
                  </th>
                </tr>
              </thead>
              <tbody>
                {periodOpportunities.slice(0, 10).map((opp, index) => (
                  <tr key={opp.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-sm text-gray-900 border-b">{opp.jobSiteName}</td>
                    <td className="px-4 py-2 text-sm text-gray-600 border-b">{opp.marketSegment}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b">
                      {formatCurrency(opp.estimatedValue)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600 border-b">{opp.salesPhase}</td>
                    <td className="px-4 py-2 text-sm text-gray-600 border-b">{opp.probability}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {periodOpportunities.length > 10 && (
            <div className="text-sm text-gray-600 text-center mt-2">
              Showing 10 of {periodOpportunities.length} opportunities
            </div>
          )}
        </div>
        )}

        {/* Action Items & Recommendations */}
        {currentTemplate.sections.actionItems && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Action Items & Recommendations</h3>
          <div className="space-y-3">
            {quotaProgress < 75 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <div className="font-medium text-red-800">Quota Performance</div>
                <div className="text-sm text-red-700">
                  Currently at {formatPercentage(quotaProgress)} of annual quota. 
                  Recommend focusing on high-value opportunities and accelerating sales cycle.
                </div>
              </div>
            )}
            
            {rep.performance.conversionRate < 30 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                <div className="font-medium text-orange-800">Conversion Rate</div>
                <div className="text-sm text-orange-700">
                  Conversion rate of {formatPercentage(rep.performance.conversionRate)} is below target. 
                  Consider additional training on qualification and closing techniques.
                </div>
              </div>
            )}
            
            {engineers.filter(e => e.rating >= 4).length < 3 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="font-medium text-blue-800">Engineer Relationships</div>
                <div className="text-sm text-blue-700">
                  Limited number of champion engineers. Focus on relationship building activities 
                  such as lunch & learns and technical presentations.
                </div>
              </div>
            )}
            
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <div className="font-medium text-green-800">Strengths</div>
              <div className="text-sm text-green-700">
                Strong activity level with {rep.performance.totalQuotes} quotes generated. 
                Continue leveraging existing relationships and territory coverage.
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Custom Sections */}
        {currentTemplate.sections.customSections.map((sectionName, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{sectionName}</h3>
            <div className="p-4 bg-gray-50 rounded border">
              <Text size="sm" c="dimmed">
                Custom section content for "{sectionName}" would be implemented here based on specific requirements.
              </Text>
            </div>
          </div>
        ))}

        {/* Raw Data Section */}
        {currentTemplate.includeRawData && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Raw Data Export</h3>
            <div className="p-4 bg-gray-50 rounded border">
              <Text size="sm" c="dimmed">
                Raw data tables and detailed metrics would be included here when this option is enabled.
                This could include CSV-style data exports, detailed transaction logs, and comprehensive datasets.
              </Text>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-4 text-center text-sm text-gray-600">
          <p>This report is confidential and intended for internal use only.</p>
          <p>Dynamic AQS Commercial CRM System - Generated {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Template Selection Modal */}
      <Modal
        opened={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Report Templates"
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Choose from pre-built templates or create your own custom template.
          </Text>
          
          <SimpleGrid cols={1} spacing="md">
            {savedTemplates.map(template => (
              <Card
                key={template.id}
                withBorder
                p="md"
                style={{ cursor: 'pointer' }}
                bg={currentTemplate.id === template.id ? 'blue.0' : undefined}
                onClick={() => {
                  setCurrentTemplate(template);
                  setShowTemplateModal(false);
                }}
              >
                <Group justify="space-between" align="flex-start">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Group gap="sm">
                      <Title order={5}>{template.name}</Title>
                      <Badge
                        color={template.format === 'executive' ? 'violet' : 
                               template.format === 'detailed' ? 'orange' : 'blue'}
                        variant="light"
                        size="sm"
                      >
                        {template.format}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">{template.description}</Text>
                    <Group gap="md">
                      <Text size="xs" c="dimmed">
                        Sections: {Object.values(template.sections).filter(Boolean).length}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Charts: {template.includeCharts ? 'Yes' : 'No'}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Raw Data: {template.includeRawData ? 'Yes' : 'No'}
                      </Text>
                    </Group>
                  </Stack>
                  <ActionIcon
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTemplate(template);
                      setShowTemplateModal(false);
                      setShowCustomizeModal(true);
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
          
          <Divider />
          
          <Group justify="flex-end">
            <Button
              variant="light"
              leftSection={<IconPlus size={16} />}
              onClick={() => {
                setShowTemplateModal(false);
                setShowCustomizeModal(true);
              }}
            >
              Create New Template
            </Button>
            <Button onClick={() => setShowTemplateModal(false)}>
              Close
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Template Customization Modal */}
      <Modal
        opened={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        title="Customize Report Template"
        size="lg"
      >
        <CustomizeTemplateForm
          template={currentTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => setShowCustomizeModal(false)}
        />
      </Modal>

      {/* Schedule Report Modal */}
      <Modal
        opened={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Report"
        size="lg"
      >
        <ScheduleReportForm
          onSchedule={handleScheduleReport}
          onCancel={() => setShowScheduleModal(false)}
          existingSchedules={schedules}
          onDeleteSchedule={handleDeleteSchedule}
          onToggleSchedule={handleToggleSchedule}
        />
      </Modal>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          @page {
            margin: 0.5in;
            size: letter;
          }
        }
      `}</style>
    </div>
  );
}
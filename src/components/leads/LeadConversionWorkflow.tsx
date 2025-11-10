'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  Button,
  Badge,
  SimpleGrid,
  ActionIcon,
  Menu,
  Modal,
  Tabs,
  Box,
  ThemeIcon,
  Progress,
  Alert,
  Stepper,
  Select,
  TextInput,
  Textarea,
  Checkbox,
  Divider,
  Timeline,
} from '@mantine/core';
import {
  IconDots,
  IconEye,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconUser,
  IconBuilding,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconFileText,
  IconSettings,
  IconTrendingUp,
  IconX,
  IconRefresh,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { MockLead, MockCustomer, generateMockLeads, territories } from '@/lib/mockData/generators';

interface ConversionStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  required: boolean;
  estimatedDuration: number; // in minutes
  completedAt?: Date;
  errorMessage?: string;
}

interface ConversionRecord {
  id: string;
  leadId: string;
  lead: MockLead;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  startedAt?: Date;
  completedAt?: Date;
  customerId?: string;
  steps: ConversionStep[];
  validationErrors: string[];
  assignedTo: string;
}

interface ConversionFormData {
  customerType: 'residential' | 'commercial';
  territoryId: string;
  onboardingTemplate: string;
  priorityLevel: 'low' | 'medium' | 'high';
  notes: string;
  autoStartOnboarding: boolean;
  notifyTerritoryManager: boolean;
}

export function LeadConversionWorkflow() {
  const [conversionRecords, setConversionRecords] = useState<ConversionRecord[]>([]);
  const [availableLeads, setAvailableLeads] = useState<MockLead[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ConversionRecord | null>(null);
  const [conversionFormData, setConversionFormData] = useState<ConversionFormData>({
    customerType: 'residential',
    territoryId: '',
    onboardingTemplate: 'standard',
    priorityLevel: 'medium',
    notes: '',
    autoStartOnboarding: true,
    notifyTerritoryManager: true,
  });
  
  const [conversionOpened, { open: openConversion, close: closeConversion }] = useDisclosure(false);
  const [detailOpened, { open: openDetail, close: closeDetail }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>('pending');

  useEffect(() => {
    // Generate mock leads that are ready for conversion
    const mockLeads = generateMockLeads(30).filter(lead => 
      ['qualified', 'discovery', 'proposal', 'won'].includes(lead.status)
    );
    setAvailableLeads(mockLeads);

    // Generate mock conversion records
    const mockRecords: ConversionRecord[] = mockLeads.slice(0, 15).map((lead, index) => {
      const currentStep = Math.floor(Math.random() * 6);
      const status: ConversionRecord['status'] = 
        currentStep === 6 ? 'completed' :
        currentStep > 0 ? 'in_progress' :
        Math.random() > 0.8 ? 'failed' :
        'not_started';

      const steps: ConversionStep[] = [
        {
          id: 'validate-lead',
          title: 'Validate Lead Data',
          description: 'Verify lead information is complete and accurate',
          status: currentStep >= 1 ? 'completed' : status === 'failed' && currentStep === 0 ? 'failed' : 'pending',
          required: true,
          estimatedDuration: 5,
          completedAt: currentStep >= 1 ? new Date(Date.now() - (6 - currentStep) * 24 * 60 * 60 * 1000) : undefined,
          errorMessage: status === 'failed' && currentStep === 0 ? 'Missing required contact information' : undefined,
        },
        {
          id: 'check-duplicates',
          title: 'Check for Duplicates',
          description: 'Ensure customer does not already exist in system',
          status: currentStep >= 2 ? 'completed' : currentStep === 1 ? 'in_progress' : 'pending',
          required: true,
          estimatedDuration: 3,
          completedAt: currentStep >= 2 ? new Date(Date.now() - (6 - currentStep) * 24 * 60 * 60 * 1000) : undefined,
        },
        {
          id: 'assign-territory',
          title: 'Assign Territory',
          description: 'Determine appropriate territory and manager assignment',
          status: currentStep >= 3 ? 'completed' : currentStep === 2 ? 'in_progress' : 'pending',
          required: true,
          estimatedDuration: 2,
          completedAt: currentStep >= 3 ? new Date(Date.now() - (6 - currentStep) * 24 * 60 * 60 * 1000) : undefined,
        },
        {
          id: 'create-customer',
          title: 'Create Customer Record',
          description: 'Generate new customer record with lead data',
          status: currentStep >= 4 ? 'completed' : currentStep === 3 ? 'in_progress' : 'pending',
          required: true,
          estimatedDuration: 5,
          completedAt: currentStep >= 4 ? new Date(Date.now() - (6 - currentStep) * 24 * 60 * 60 * 1000) : undefined,
        },
        {
          id: 'setup-onboarding',
          title: 'Setup Onboarding',
          description: 'Initialize customer onboarding workflow',
          status: currentStep >= 5 ? 'completed' : currentStep === 4 ? 'in_progress' : 'pending',
          required: false,
          estimatedDuration: 3,
          completedAt: currentStep >= 5 ? new Date(Date.now() - (6 - currentStep) * 24 * 60 * 60 * 1000) : undefined,
        },
        {
          id: 'notify-team',
          title: 'Notify Team',
          description: 'Send notifications to territory manager and team',
          status: currentStep >= 6 ? 'completed' : currentStep === 5 ? 'in_progress' : 'pending',
          required: false,
          estimatedDuration: 1,
          completedAt: currentStep >= 6 ? new Date(Date.now() - (6 - currentStep) * 24 * 60 * 60 * 1000) : undefined,
        },
      ];

      return {
        id: `conversion-${lead.id}`,
        leadId: lead.id,
        lead,
        status,
        currentStep,
        totalSteps: 6,
        startedAt: currentStep > 0 ? new Date(Date.now() - currentStep * 24 * 60 * 60 * 1000) : undefined,
        completedAt: status === 'completed' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
        customerId: status === 'completed' ? `customer-${lead.id}` : undefined,
        steps,
        validationErrors: status === 'failed' ? ['Missing required contact information', 'Invalid email format'] : [],
        assignedTo: lead.assignedTo,
      };
    });

    setConversionRecords(mockRecords);
  }, []);

  const getStatusColor = (status: ConversionRecord['status']) => {
    switch (status) {
      case 'not_started': return 'gray';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getStepStatusColor = (status: ConversionStep['status']) => {
    switch (status) {
      case 'pending': return 'gray';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const filteredRecords = conversionRecords.filter(record => {
    switch (activeTab) {
      case 'pending': return record.status === 'not_started';
      case 'in_progress': return record.status === 'in_progress';
      case 'completed': return record.status === 'completed';
      case 'failed': return record.status === 'failed';
      default: return true;
    }
  });

  const handleStartConversion = (lead: MockLead) => {
    setSelectedRecord({
      id: `conversion-${lead.id}`,
      leadId: lead.id,
      lead,
      status: 'not_started',
      currentStep: 0,
      totalSteps: 6,
      steps: [
        {
          id: 'validate-lead',
          title: 'Validate Lead Data',
          description: 'Verify lead information is complete and accurate',
          status: 'pending',
          required: true,
          estimatedDuration: 5,
        },
        {
          id: 'check-duplicates',
          title: 'Check for Duplicates',
          description: 'Ensure customer does not already exist in system',
          status: 'pending',
          required: true,
          estimatedDuration: 3,
        },
        {
          id: 'assign-territory',
          title: 'Assign Territory',
          description: 'Determine appropriate territory and manager assignment',
          status: 'pending',
          required: true,
          estimatedDuration: 2,
        },
        {
          id: 'create-customer',
          title: 'Create Customer Record',
          description: 'Generate new customer record with lead data',
          status: 'pending',
          required: true,
          estimatedDuration: 5,
        },
        {
          id: 'setup-onboarding',
          title: 'Setup Onboarding',
          description: 'Initialize customer onboarding workflow',
          status: 'pending',
          required: false,
          estimatedDuration: 3,
        },
        {
          id: 'notify-team',
          title: 'Notify Team',
          description: 'Send notifications to territory manager and team',
          status: 'pending',
          required: false,
          estimatedDuration: 1,
        },
      ],
      validationErrors: [],
      assignedTo: lead.assignedTo,
    });
    
    // Set default territory based on lead assignment
    const territory = territories.find(t => `tm-${t.id}` === lead.assignedTo);
    if (territory) {
      setConversionFormData(prev => ({ ...prev, territoryId: territory.id }));
    }
    
    openConversion();
  };

  const handleViewRecord = (record: ConversionRecord) => {
    setSelectedRecord(record);
    openDetail();
  };

  const handleExecuteConversion = async () => {
    if (!selectedRecord) return;

    try {
      // Simulate conversion process
      const updatedRecord = { ...selectedRecord };
      updatedRecord.status = 'in_progress';
      updatedRecord.startedAt = new Date();

      // Update the record in state
      setConversionRecords(prev => {
        const existing = prev.find(r => r.id === updatedRecord.id);
        if (existing) {
          return prev.map(r => r.id === updatedRecord.id ? updatedRecord : r);
        } else {
          return [...prev, updatedRecord];
        }
      });

      // Simulate step-by-step execution
      for (let i = 0; i < updatedRecord.steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
        
        updatedRecord.steps[i].status = 'completed';
        updatedRecord.steps[i].completedAt = new Date();
        updatedRecord.currentStep = i + 1;
        
        // Update state during execution
        setConversionRecords(prev => 
          prev.map(r => r.id === updatedRecord.id ? { ...updatedRecord } : r)
        );
        
        if (selectedRecord.id === updatedRecord.id) {
          setSelectedRecord({ ...updatedRecord });
        }
      }

      // Mark as completed
      updatedRecord.status = 'completed';
      updatedRecord.completedAt = new Date();
      updatedRecord.customerId = `customer-${updatedRecord.lead.id}`;

      setConversionRecords(prev => 
        prev.map(r => r.id === updatedRecord.id ? updatedRecord : r)
      );
      
      if (selectedRecord.id === updatedRecord.id) {
        setSelectedRecord(updatedRecord);
      }

      notifications.show({
        title: 'Conversion Completed',
        message: `${updatedRecord.lead.companyName} has been successfully converted to a customer.`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      closeConversion();
    } catch (error) {
      notifications.show({
        title: 'Conversion Failed',
        message: 'An error occurred during the conversion process.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleRetryConversion = (record: ConversionRecord) => {
    const updatedRecord = { ...record };
    updatedRecord.status = 'not_started';
    updatedRecord.currentStep = 0;
    updatedRecord.validationErrors = [];
    updatedRecord.steps = updatedRecord.steps.map(step => ({
      ...step,
      status: 'pending',
      completedAt: undefined,
      errorMessage: undefined,
    }));

    setConversionRecords(prev => 
      prev.map(r => r.id === updatedRecord.id ? updatedRecord : r)
    );

    notifications.show({
      title: 'Conversion Reset',
      message: 'The conversion has been reset and is ready to retry.',
      color: 'blue',
      icon: <IconRefresh size={16} />,
    });
  };

  return (
    <>
      <Stack gap="md">
        {/* Summary Cards */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Ready to Convert
                </Text>
                <Text size="xl" fw={700}>
                  {availableLeads.length}
                </Text>
              </Box>
              <ThemeIcon color="blue" variant="light" size="lg">
                <IconUser size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  In Progress
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {conversionRecords.filter(r => r.status === 'in_progress').length}
                </Text>
              </Box>
              <ThemeIcon color="blue" variant="light" size="lg">
                <IconClock size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Completed
                </Text>
                <Text size="xl" fw={700} c="green">
                  {conversionRecords.filter(r => r.status === 'completed').length}
                </Text>
              </Box>
              <ThemeIcon color="green" variant="light" size="lg">
                <IconCheck size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Success Rate
                </Text>
                <Text size="xl" fw={700} c="green">
                  87%
                </Text>
              </Box>
              <ThemeIcon color="green" variant="light" size="lg">
                <IconTrendingUp size={20} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Available Leads for Conversion */}
        <Card withBorder p="md">
          <Group justify="space-between" mb="md">
            <Text fw={600} size="lg">Available Leads for Conversion</Text>
            <Badge color="blue" variant="light">
              {availableLeads.length} leads ready
            </Badge>
          </Group>
          
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
            {availableLeads.slice(0, 6).map((lead) => (
              <Card key={lead.id} withBorder p="sm">
                <Stack gap="xs">
                  <Group justify="space-between" align="flex-start">
                    <Box flex={1}>
                      <Text fw={600} size="sm" lineClamp={1}>
                        {lead.companyName}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {lead.contactName}
                      </Text>
                    </Box>
                    <Badge size="sm" color="green" variant="light">
                      {lead.status}
                    </Badge>
                  </Group>

                  <Group gap={4}>
                    <IconMail size={12} />
                    <Text size="xs" lineClamp={1}>{lead.email}</Text>
                  </Group>

                  <Group gap={4}>
                    <IconTrendingUp size={12} />
                    <Text size="xs">Score: {lead.score}</Text>
                  </Group>

                  <Button
                    size="xs"
                    fullWidth
                    leftSection={<IconArrowRight size={14} />}
                    onClick={() => handleStartConversion(lead)}
                  >
                    Convert to Customer
                  </Button>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Card>

        {/* Conversion Records */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="pending">
              Pending ({conversionRecords.filter(r => r.status === 'not_started').length})
            </Tabs.Tab>
            <Tabs.Tab value="in_progress">
              In Progress ({conversionRecords.filter(r => r.status === 'in_progress').length})
            </Tabs.Tab>
            <Tabs.Tab value="completed">
              Completed ({conversionRecords.filter(r => r.status === 'completed').length})
            </Tabs.Tab>
            <Tabs.Tab value="failed">
              Failed ({conversionRecords.filter(r => r.status === 'failed').length})
            </Tabs.Tab>
          </Tabs.List>

          <Box mt="md">
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
              {filteredRecords.map((record) => (
                <Card key={record.id} withBorder p="md">
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                      <Box flex={1}>
                        <Text fw={600} size="sm" lineClamp={1}>
                          {record.lead.companyName}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {record.lead.contactName}
                        </Text>
                      </Box>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" size="sm">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconEye size={14} />} onClick={() => handleViewRecord(record)}>
                            View Details
                          </Menu.Item>
                          {record.status === 'failed' && (
                            <Menu.Item leftSection={<IconRefresh size={14} />} onClick={() => handleRetryConversion(record)}>
                              Retry Conversion
                            </Menu.Item>
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    </Group>

                    <Group justify="space-between" align="center">
                      <Badge size="sm" color={getStatusColor(record.status)} variant="light">
                        {record.status.replace('_', ' ')}
                      </Badge>
                      <Text size="xs" c="dimmed">
                        Step {record.currentStep}/{record.totalSteps}
                      </Text>
                    </Group>

                    <Progress
                      value={(record.currentStep / record.totalSteps) * 100}
                      size="sm"
                      color={getStatusColor(record.status)}
                      radius="xl"
                    />

                    {record.validationErrors.length > 0 && (
                      <Alert color="red" variant="light" p="xs">
                        <Text size="xs">{record.validationErrors[0]}</Text>
                      </Alert>
                    )}

                    <Group justify="space-between" align="center">
                      <Text size="xs" c="dimmed">
                        {record.startedAt ? `Started: ${record.startedAt.toLocaleDateString()}` : 'Not started'}
                      </Text>
                      {record.completedAt && (
                        <Text size="xs" c="green">
                          Completed: {record.completedAt.toLocaleDateString()}
                        </Text>
                      )}
                    </Group>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </Tabs>
      </Stack>

      {/* Conversion Configuration Modal */}
      <Modal
        opened={conversionOpened}
        onClose={closeConversion}
        title="Convert Lead to Customer"
        size="lg"
      >
        {selectedRecord && (
          <Stack gap="md">
            {/* Lead Information */}
            <Card withBorder p="md">
              <Text fw={600} mb="sm">Lead Information</Text>
              <Group>
                <Box flex={1}>
                  <Text size="sm" fw={500}>{selectedRecord.lead.companyName}</Text>
                  <Text size="xs" c="dimmed">{selectedRecord.lead.contactName}</Text>
                  <Text size="xs" c="dimmed">{selectedRecord.lead.email}</Text>
                </Box>
                <Badge color="blue" variant="light">
                  Score: {selectedRecord.lead.score}
                </Badge>
              </Group>
            </Card>

            {/* Conversion Configuration */}
            <Card withBorder p="md">
              <Text fw={600} mb="sm">Conversion Configuration</Text>
              <Stack gap="sm">
                <Select
                  label="Customer Type"
                  value={conversionFormData.customerType}
                  onChange={(value) => setConversionFormData(prev => ({ ...prev, customerType: value as any }))}
                  data={[
                    { value: 'residential', label: 'Residential' },
                    { value: 'commercial', label: 'Commercial' },
                  ]}
                />

                <Select
                  label="Territory"
                  value={conversionFormData.territoryId}
                  onChange={(value) => setConversionFormData(prev => ({ ...prev, territoryId: value || '' }))}
                  data={territories.map(t => ({ value: t.id, label: t.name }))}
                />

                <Select
                  label="Onboarding Template"
                  value={conversionFormData.onboardingTemplate}
                  onChange={(value) => setConversionFormData(prev => ({ ...prev, onboardingTemplate: value || 'standard' }))}
                  data={[
                    { value: 'standard', label: 'Standard Onboarding' },
                    { value: 'expedited', label: 'Expedited Onboarding' },
                    { value: 'enterprise', label: 'Enterprise Onboarding' },
                  ]}
                />

                <Select
                  label="Priority Level"
                  value={conversionFormData.priorityLevel}
                  onChange={(value) => setConversionFormData(prev => ({ ...prev, priorityLevel: value as any }))}
                  data={[
                    { value: 'low', label: 'Low Priority' },
                    { value: 'medium', label: 'Medium Priority' },
                    { value: 'high', label: 'High Priority' },
                  ]}
                />

                <Textarea
                  label="Conversion Notes"
                  placeholder="Add any special notes or instructions..."
                  value={conversionFormData.notes}
                  onChange={(event) => setConversionFormData(prev => ({ ...prev, notes: event.currentTarget.value }))}
                  rows={3}
                />

                <Checkbox
                  label="Automatically start onboarding workflow"
                  checked={conversionFormData.autoStartOnboarding}
                  onChange={(event) => setConversionFormData(prev => ({ ...prev, autoStartOnboarding: event.currentTarget.checked }))}
                />

                <Checkbox
                  label="Notify territory manager"
                  checked={conversionFormData.notifyTerritoryManager}
                  onChange={(event) => setConversionFormData(prev => ({ ...prev, notifyTerritoryManager: event.currentTarget.checked }))}
                />
              </Stack>
            </Card>

            {/* Conversion Steps Preview */}
            <Card withBorder p="md">
              <Text fw={600} mb="sm">Conversion Steps</Text>
              <Stepper active={selectedRecord.currentStep} orientation="vertical" size="sm">
                {selectedRecord.steps.map((step, index) => (
                  <Stepper.Step
                    key={step.id}
                    label={step.title}
                    description={step.description}
                    color={getStepStatusColor(step.status)}
                    completedIcon={step.status === 'completed' ? <IconCheck size={16} /> : undefined}
                  />
                ))}
              </Stepper>
            </Card>

            <Group justify="flex-end">
              <Button variant="light" onClick={closeConversion}>
                Cancel
              </Button>
              <Button
                leftSection={<IconArrowRight size={16} />}
                onClick={handleExecuteConversion}
                loading={selectedRecord.status === 'in_progress'}
              >
                Start Conversion
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Conversion Details Modal */}
      <Modal
        opened={detailOpened}
        onClose={closeDetail}
        title="Conversion Details"
        size="lg"
      >
        {selectedRecord && (
          <Stack gap="md">
            {/* Lead Information */}
            <Card withBorder p="md">
              <Text fw={600} mb="sm">Lead Information</Text>
              <SimpleGrid cols={2} spacing="sm">
                <div>
                  <Text size="xs" c="dimmed">Company</Text>
                  <Text size="sm">{selectedRecord.lead.companyName}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">Contact</Text>
                  <Text size="sm">{selectedRecord.lead.contactName}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">Email</Text>
                  <Text size="sm">{selectedRecord.lead.email}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">Score</Text>
                  <Text size="sm">{selectedRecord.lead.score}</Text>
                </div>
              </SimpleGrid>
            </Card>

            {/* Conversion Status */}
            <Card withBorder p="md">
              <Group justify="space-between" mb="sm">
                <Text fw={600}>Conversion Status</Text>
                <Badge color={getStatusColor(selectedRecord.status)} variant="light">
                  {selectedRecord.status.replace('_', ' ')}
                </Badge>
              </Group>
              
              <Progress
                value={(selectedRecord.currentStep / selectedRecord.totalSteps) * 100}
                size="lg"
                color={getStatusColor(selectedRecord.status)}
                radius="xl"
                mb="sm"
              />
              
              <Text size="sm" c="dimmed">
                Step {selectedRecord.currentStep} of {selectedRecord.totalSteps} completed
              </Text>
            </Card>

            {/* Step Timeline */}
            <Card withBorder p="md">
              <Text fw={600} mb="sm">Step Timeline</Text>
              <Timeline active={selectedRecord.currentStep} bulletSize={24} lineWidth={2}>
                {selectedRecord.steps.map((step, index) => (
                  <Timeline.Item
                    key={step.id}
                    bullet={
                      step.status === 'completed' ? <IconCheck size={12} /> :
                      step.status === 'failed' ? <IconX size={12} /> :
                      step.status === 'in_progress' ? <IconClock size={12} /> :
                      <div />
                    }
                    title={step.title}
                    color={getStepStatusColor(step.status)}
                  >
                    <Text size="xs" c="dimmed" mb={4}>
                      {step.description}
                    </Text>
                    {step.completedAt && (
                      <Text size="xs" c="dimmed">
                        Completed: {step.completedAt.toLocaleString()}
                      </Text>
                    )}
                    {step.errorMessage && (
                      <Alert color="red" variant="light" p="xs" mt="xs">
                        <Text size="xs">{step.errorMessage}</Text>
                      </Alert>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            {selectedRecord.customerId && (
              <Alert color="green" variant="light">
                <Group>
                  <IconCheck size={16} />
                  <div>
                    <Text size="sm" fw={500}>Conversion Completed Successfully</Text>
                    <Text size="xs">Customer ID: {selectedRecord.customerId}</Text>
                  </div>
                </Group>
              </Alert>
            )}
          </Stack>
        )}
      </Modal>
    </>
  );
}
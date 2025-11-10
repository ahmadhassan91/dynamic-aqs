'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Stack,
  Group,
  Button,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Grid,
  Card,
  Text,
  Badge,
  MultiSelect,
  Stepper,
  Divider,
  Alert,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconArrowLeft,
  IconCheck,
  IconBuilding,
  IconUsers,
  IconCurrencyDollar,
  IconCalendar,
  IconInfoCircle,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock data for dropdowns
const marketSegments = [
  'Healthcare',
  'Education',
  'Cannabis',
  'Commercial Office',
  'Hospitality',
  'Industrial',
  'Government',
  'Retail',
];

const productCategories = [
  'Air Handling Units',
  'Rooftop Units',
  'Heat Pumps',
  'Chillers',
  'Boilers',
  'Controls Systems',
  'Ventilation Systems',
  'Energy Recovery',
];

const salesPhases = [
  { value: 'prospect', label: 'Prospect' },
  { value: 'preliminary-quote', label: 'Preliminary Quote' },
  { value: 'final-quote', label: 'Final Quote' },
  { value: 'po-in-hand', label: 'PO in Hand' },
];

const mockStakeholders = {
  buildingOwners: [
    'University Medical Center',
    'TechCorp Industries',
    'Green Valley Cultivation',
    'Metropolitan Hotels Group',
    'Advanced Manufacturing Corp',
    'State University',
    'City Government',
    'Regional Hospital System',
  ],
  engineeringFirms: [
    'Johnson Controls Engineering',
    'Modern MEP Solutions',
    'Specialized Systems Engineering',
    'Hospitality Engineering Solutions',
    'Industrial Systems Design',
    'Academic Facilities Engineering',
    'Healthcare Engineering Group',
    'Sustainable Design Partners',
  ],
  manufacturerReps: [
    'HVAC Solutions Inc.',
    'Commercial HVAC Partners',
    'Industrial HVAC Specialists',
    'Hotel Systems Inc.',
    'Heavy Industry HVAC',
    'Education HVAC Solutions',
    'Healthcare Systems Rep',
    'Green Building Solutions',
  ],
  architects: [
    'Healthcare Design Group',
    'Urban Design Associates',
    'Agricultural Facility Design',
    'Renovation Specialists LLC',
    'Industrial Architecture Group',
    'Campus Design Partners',
    'Sustainable Architecture Inc.',
    'Modern Building Design',
  ],
  mechanicalContractors: [
    'Premier Mechanical Services',
    'Industrial Installation Corp',
    'Healthcare Mechanical Systems',
    'Commercial HVAC Contractors',
    'Specialized Installation Services',
    'University Mechanical Services',
    'Green Systems Installation',
    'Advanced Mechanical Solutions',
  ],
};

const regionalSalesManagers = [
  'Sarah Johnson',
  'Mike Chen',
  'David Rodriguez',
  'Lisa Wang',
  'Robert Kim',
  'Jennifer Martinez',
  'Alex Thompson',
  'Maria Garcia',
];

interface OpportunityFormData {
  // Basic Information
  jobSiteName: string;
  description: string;
  marketSegment: string;
  productInterest: string[];
  currentHVACSystem: string;
  
  // Financial Information
  estimatedValue: number;
  probability: number;
  salesPhase: string;
  expectedCloseDate: Date | null;
  
  // Stakeholders
  buildingOwnerId: string;
  architectId: string;
  engineeringFirmId: string;
  mechanicalContractorId: string;
  manufacturerRepId: string;
  facilitiesManagerId: string;
  
  // Assignment
  regionalSalesManagerId: string;
  
  // Additional Information
  notes: string;
  tags: string[];
}

export default function NewOpportunityPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<OpportunityFormData>({
    jobSiteName: '',
    description: '',
    marketSegment: '',
    productInterest: [],
    currentHVACSystem: '',
    estimatedValue: 0,
    probability: 50,
    salesPhase: 'prospect',
    expectedCloseDate: null,
    buildingOwnerId: '',
    architectId: '',
    engineeringFirmId: '',
    mechanicalContractorId: '',
    manufacturerRepId: '',
    facilitiesManagerId: '',
    regionalSalesManagerId: '',
    notes: '',
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.jobSiteName.trim()) {
          newErrors.jobSiteName = 'Job site name is required';
        }
        if (!formData.description.trim()) {
          newErrors.description = 'Description is required';
        }
        if (!formData.marketSegment) {
          newErrors.marketSegment = 'Market segment is required';
        }
        if (formData.productInterest.length === 0) {
          newErrors.productInterest = 'At least one product category is required';
        }
        break;
      
      case 1: // Financial Information
        if (!formData.estimatedValue || formData.estimatedValue <= 0) {
          newErrors.estimatedValue = 'Estimated value must be greater than 0';
        }
        if (!formData.probability || formData.probability < 0 || formData.probability > 100) {
          newErrors.probability = 'Probability must be between 0 and 100';
        }
        if (!formData.expectedCloseDate) {
          newErrors.expectedCloseDate = 'Expected close date is required';
        }
        break;
      
      case 2: // Stakeholders
        if (!formData.buildingOwnerId) {
          newErrors.buildingOwnerId = 'Building owner is required';
        }
        if (!formData.engineeringFirmId) {
          newErrors.engineeringFirmId = 'Engineering firm is required';
        }
        if (!formData.manufacturerRepId) {
          newErrors.manufacturerRepId = 'Manufacturer rep is required';
        }
        if (!formData.regionalSalesManagerId) {
          newErrors.regionalSalesManagerId = 'Regional sales manager is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      // Here you would typically submit to your API
      console.log('Submitting opportunity:', formData);
      
      // Simulate success and redirect
      router.push('/commercial/opportunities/pipeline');
    }
  };

  const updateFormData = (field: keyof OpportunityFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Container size="lg" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group>
          <ActionIcon
            component={Link}
            href="/commercial/opportunities/pipeline"
            variant="subtle"
            size="lg"
          >
            <IconArrowLeft size={20} />
          </ActionIcon>
          <div>
            <Title order={2}>Create New Opportunity</Title>
            <Text c="dimmed">
              Add a new commercial opportunity to the pipeline
            </Text>
          </div>
        </Group>

        {/* Progress Stepper */}
        <Paper p="md" withBorder>
          <Stepper active={activeStep} onStepClick={setActiveStep} allowNextStepsSelect={false}>
            <Stepper.Step
              label="Basic Information"
              description="Job details and market info"
              icon={<IconBuilding size={18} />}
            />
            <Stepper.Step
              label="Financial Details"
              description="Value and timeline"
              icon={<IconCurrencyDollar size={18} />}
            />
            <Stepper.Step
              label="Stakeholders"
              description="Key contacts and assignments"
              icon={<IconUsers size={18} />}
            />
            <Stepper.Step
              label="Review & Submit"
              description="Confirm and create"
              icon={<IconCheck size={18} />}
            />
          </Stepper>
        </Paper>

        {/* Form Content */}
        <Paper p="xl" withBorder>
          {activeStep === 0 && (
            <Stack gap="md">
              <Title order={3}>Basic Information</Title>
              
              <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <TextInput
                    label="Job Site Name"
                    placeholder="Enter the project or job site name"
                    required
                    value={formData.jobSiteName}
                    onChange={(e) => updateFormData('jobSiteName', e.target.value)}
                    error={errors.jobSiteName}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Market Segment"
                    placeholder="Select market segment"
                    required
                    data={marketSegments}
                    value={formData.marketSegment}
                    onChange={(value) => updateFormData('marketSegment', value)}
                    error={errors.marketSegment}
                  />
                </Grid.Col>
              </Grid>

              <Textarea
                label="Project Description"
                placeholder="Describe the project scope, requirements, and key details"
                required
                minRows={3}
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                error={errors.description}
              />

              <MultiSelect
                label="Product Interest"
                placeholder="Select product categories"
                required
                data={productCategories}
                value={formData.productInterest}
                onChange={(value) => updateFormData('productInterest', value)}
                error={errors.productInterest}
              />

              <TextInput
                label="Current HVAC System"
                placeholder="Describe the existing HVAC system (if any)"
                value={formData.currentHVACSystem}
                onChange={(e) => updateFormData('currentHVACSystem', e.target.value)}
              />

              <MultiSelect
                label="Tags"
                placeholder="Add tags for categorization"
                data={['High Priority', 'New Construction', 'Renovation', 'Energy Efficiency', 'Green Building', 'Historic Building']}
                value={formData.tags}
                onChange={(value) => updateFormData('tags', value)}
                searchable
              />
            </Stack>
          )}

          {activeStep === 1 && (
            <Stack gap="md">
              <Title order={3}>Financial Details</Title>
              
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Estimated Value"
                    placeholder="Enter estimated project value"
                    required
                    prefix="$"
                    thousandSeparator=","
                    decimalScale={0}
                    min={0}
                    value={formData.estimatedValue}
                    onChange={(value) => updateFormData('estimatedValue', value)}
                    error={errors.estimatedValue}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Probability (%)"
                    placeholder="Enter win probability"
                    required
                    suffix="%"
                    min={0}
                    max={100}
                    value={formData.probability}
                    onChange={(value) => updateFormData('probability', value)}
                    error={errors.probability}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Current Sales Phase"
                    placeholder="Select current phase"
                    required
                    data={salesPhases}
                    value={formData.salesPhase}
                    onChange={(value) => updateFormData('salesPhase', value)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <DateInput
                    label="Expected Close Date"
                    placeholder="Select expected close date"
                    required
                    value={formData.expectedCloseDate}
                    onChange={(value) => updateFormData('expectedCloseDate', value)}
                    error={errors.expectedCloseDate}
                    leftSection={<IconCalendar size={16} />}
                  />
                </Grid.Col>
              </Grid>

              <Alert icon={<IconInfoCircle size={16} />} color="blue">
                The estimated value and probability will be used to calculate weighted pipeline value and forecasting metrics.
              </Alert>
            </Stack>
          )}

          {activeStep === 2 && (
            <Stack gap="md">
              <Title order={3}>Stakeholders & Assignment</Title>
              
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Building Owner"
                    placeholder="Select building owner"
                    required
                    data={mockStakeholders.buildingOwners}
                    value={formData.buildingOwnerId}
                    onChange={(value) => updateFormData('buildingOwnerId', value)}
                    error={errors.buildingOwnerId}
                    searchable
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Engineering Firm"
                    placeholder="Select engineering firm"
                    required
                    data={mockStakeholders.engineeringFirms}
                    value={formData.engineeringFirmId}
                    onChange={(value) => updateFormData('engineeringFirmId', value)}
                    error={errors.engineeringFirmId}
                    searchable
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Manufacturer Rep"
                    placeholder="Select manufacturer rep"
                    required
                    data={mockStakeholders.manufacturerReps}
                    value={formData.manufacturerRepId}
                    onChange={(value) => updateFormData('manufacturerRepId', value)}
                    error={errors.manufacturerRepId}
                    searchable
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Architect"
                    placeholder="Select architect (optional)"
                    data={mockStakeholders.architects}
                    value={formData.architectId}
                    onChange={(value) => updateFormData('architectId', value)}
                    searchable
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Mechanical Contractor"
                    placeholder="Select mechanical contractor (optional)"
                    data={mockStakeholders.mechanicalContractors}
                    value={formData.mechanicalContractorId}
                    onChange={(value) => updateFormData('mechanicalContractorId', value)}
                    searchable
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Regional Sales Manager"
                    placeholder="Assign to RSM"
                    required
                    data={regionalSalesManagers}
                    value={formData.regionalSalesManagerId}
                    onChange={(value) => updateFormData('regionalSalesManagerId', value)}
                    error={errors.regionalSalesManagerId}
                  />
                </Grid.Col>
              </Grid>

              <Textarea
                label="Additional Notes"
                placeholder="Add any additional notes or special considerations"
                minRows={3}
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
              />
            </Stack>
          )}

          {activeStep === 3 && (
            <Stack gap="md">
              <Title order={3}>Review & Confirm</Title>
              
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder>
                    <Stack gap="xs">
                      <Text fw={600} size="sm">Basic Information</Text>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Job Site:</Text>
                        <Text size="sm">{formData.jobSiteName}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Market Segment:</Text>
                        <Badge size="sm">{formData.marketSegment}</Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Products:</Text>
                        <Text size="sm">{formData.productInterest.length} categories</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder>
                    <Stack gap="xs">
                      <Text fw={600} size="sm">Financial Details</Text>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Estimated Value:</Text>
                        <Text size="sm" fw={600}>${formData.estimatedValue.toLocaleString()}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Probability:</Text>
                        <Text size="sm">{formData.probability}%</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Expected Close:</Text>
                        <Text size="sm">{formData.expectedCloseDate?.toLocaleDateString()}</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>

              <Card withBorder>
                <Stack gap="xs">
                  <Text fw={600} size="sm">Key Stakeholders</Text>
                  <Grid>
                    <Grid.Col span={6}>
                      <Text size="sm" c="dimmed">Building Owner: {formData.buildingOwnerId}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="sm" c="dimmed">Engineering Firm: {formData.engineeringFirmId}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="sm" c="dimmed">Manufacturer Rep: {formData.manufacturerRepId}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="sm" c="dimmed">Assigned RSM: {formData.regionalSalesManagerId}</Text>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Card>

              {formData.description && (
                <Card withBorder>
                  <Stack gap="xs">
                    <Text fw={600} size="sm">Project Description</Text>
                    <Text size="sm">{formData.description}</Text>
                  </Stack>
                </Card>
              )}
            </Stack>
          )}
        </Paper>

        {/* Navigation Buttons */}
        <Group justify="space-between">
          <Button
            variant="subtle"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          
          <Group>
            {activeStep < 3 ? (
              <Button onClick={handleNext}>
                Next Step
              </Button>
            ) : (
              <Button onClick={handleSubmit} color="green">
                Create Opportunity
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Container>
  );
}
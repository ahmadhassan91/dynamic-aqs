'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Select,
  Stack,
  Group,
  Button,
  Title,
  Text,
  Divider,
  MultiSelect,
  Textarea,
  Grid,
  NumberInput,
  Slider,
  Badge
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconBriefcase,
  IconBuilding,
  IconCurrencyDollar,
  IconCalendar,
  IconTarget,
  IconFileText
} from '@tabler/icons-react';

interface OpportunityFormData {
  jobSiteName: string;
  description: string;
  marketSegment: string;
  productInterest: string[];
  currentHVACSystem?: string;
  estimatedValue: number;
  probability: number;
  salesPhase: string;
  engineeringFirmId: string;
  manufacturerRepId: string;
  regionalSalesManagerId: string;
  expectedCloseDate?: Date | string | null;
  notes?: string;
}

interface OpportunityFormModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: OpportunityFormData) => void;
  initialData?: Partial<OpportunityFormData>;
  mode?: 'create' | 'edit';
}

const SALES_PHASE_OPTIONS = [
  { value: 'Prospect', label: 'Prospect' },
  { value: 'Qualification', label: 'Qualification' },
  { value: 'Proposal', label: 'Proposal' },
  { value: 'Negotiation', label: 'Negotiation' },
  { value: 'Final Quote', label: 'Final Quote' },
  { value: 'Won', label: 'Won' },
  { value: 'Lost', label: 'Lost' }
];

const MARKET_SEGMENT_OPTIONS = [
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Commercial Office', label: 'Commercial Office' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Hospitality', label: 'Hospitality' },
  { value: 'Data Center', label: 'Data Center' },
  { value: 'Cannabis', label: 'Cannabis' }
];

const PRODUCT_OPTIONS = [
  { value: 'Rooftop Units', label: 'Rooftop Units' },
  { value: 'Air Handlers', label: 'Air Handlers' },
  { value: 'Chillers', label: 'Chillers' },
  { value: 'Building Controls', label: 'Building Controls' },
  { value: 'VAV Systems', label: 'VAV Systems' },
  { value: 'Split Systems', label: 'Split Systems' },
  { value: 'Heat Pumps', label: 'Heat Pumps' },
  { value: 'Ductless Systems', label: 'Ductless Systems' }
];

// Mock data
const ENGINEERING_FIRMS = [
  { value: 'firm-1', label: 'MEP Engineering Solutions' },
  { value: 'firm-2', label: 'Urban Design Engineers' },
  { value: 'firm-3', label: 'Industrial Systems Inc' }
];

const MANUFACTURER_REPS = [
  { value: 'rep-1', label: 'Johnson Controls Rep' },
  { value: 'rep-2', label: 'Carrier Commercial Rep' },
  { value: 'rep-3', label: 'Trane Industrial Rep' }
];

const SALES_MANAGERS = [
  { value: 'mgr-1', label: 'Tom Anderson' },
  { value: 'mgr-2', label: 'Sarah Wilson' },
  { value: 'mgr-3', label: 'Mike Davis' }
];

export function OpportunityFormModal({
  opened,
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}: OpportunityFormModalProps) {
  const [formData, setFormData] = useState<OpportunityFormData>({
    jobSiteName: '',
    description: '',
    marketSegment: '',
    productInterest: [],
    currentHVACSystem: '',
    estimatedValue: 0,
    probability: 50,
    salesPhase: 'Prospect',
    engineeringFirmId: '',
    manufacturerRepId: '',
    regionalSalesManagerId: '',
    expectedCloseDate: null,
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OpportunityFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        jobSiteName: initialData.jobSiteName || '',
        description: initialData.description || '',
        marketSegment: initialData.marketSegment || '',
        productInterest: initialData.productInterest || [],
        currentHVACSystem: initialData.currentHVACSystem || '',
        estimatedValue: initialData.estimatedValue || 0,
        probability: initialData.probability || 50,
        salesPhase: initialData.salesPhase || 'Prospect',
        engineeringFirmId: initialData.engineeringFirmId || '',
        manufacturerRepId: initialData.manufacturerRepId || '',
        regionalSalesManagerId: initialData.regionalSalesManagerId || '',
        expectedCloseDate: initialData.expectedCloseDate || null,
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OpportunityFormData, string>> = {};

    if (!formData.jobSiteName.trim()) {
      newErrors.jobSiteName = 'Job site name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.marketSegment) {
      newErrors.marketSegment = 'Market segment is required';
    }
    if (!formData.engineeringFirmId) {
      newErrors.engineeringFirmId = 'Engineering firm is required';
    }
    if (!formData.manufacturerRepId) {
      newErrors.manufacturerRepId = 'Manufacturer rep is required';
    }
    if (!formData.regionalSalesManagerId) {
      newErrors.regionalSalesManagerId = 'Sales manager is required';
    }
    if (formData.estimatedValue <= 0) {
      newErrors.estimatedValue = 'Estimated value must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      jobSiteName: '',
      description: '',
      marketSegment: '',
      productInterest: [],
      currentHVACSystem: '',
      estimatedValue: 0,
      probability: 50,
      salesPhase: 'Prospect',
      engineeringFirmId: '',
      manufacturerRepId: '',
      regionalSalesManagerId: '',
      expectedCloseDate: null,
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      'Prospect': 'blue',
      'Qualification': 'cyan',
      'Proposal': 'grape',
      'Negotiation': 'violet',
      'Final Quote': 'indigo',
      'Won': 'green',
      'Lost': 'red'
    };
    return colors[phase] || 'gray';
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <IconBriefcase size={24} />
          <Title order={3}>
            {mode === 'create' ? 'Create New Opportunity' : 'Edit Opportunity'}
          </Title>
        </Group>
      }
      size="xl"
      padding="xl"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {mode === 'create'
            ? 'Add a new commercial opportunity to your pipeline'
            : 'Update opportunity information'}
        </Text>

        <Divider label="Project Information" labelPosition="left" />

        <TextInput
          label="Job Site Name"
          placeholder="University Medical Center HVAC Upgrade"
          leftSection={<IconBuilding size={16} />}
          value={formData.jobSiteName}
          onChange={(e) => setFormData({ ...formData, jobSiteName: e.currentTarget.value })}
          error={errors.jobSiteName}
          required
          size="md"
        />

        <Textarea
          label="Project Description"
          placeholder="Describe the scope of work, requirements, and key details..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
          error={errors.description}
          required
          minRows={3}
          size="md"
        />

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Market Segment"
              placeholder="Select market segment"
              data={MARKET_SEGMENT_OPTIONS}
              value={formData.marketSegment}
              onChange={(value) => setFormData({ ...formData, marketSegment: value || '' })}
              error={errors.marketSegment}
              searchable
              required
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DateInput
              label="Expected Close Date"
              placeholder="Select date"
              leftSection={<IconCalendar size={16} />}
              value={formData.expectedCloseDate}
              onChange={(value) => setFormData({ ...formData, expectedCloseDate: value })}
              size="md"
              clearable
            />
          </Grid.Col>
        </Grid>

        <MultiSelect
          label="Products of Interest"
          placeholder="Select products"
          data={PRODUCT_OPTIONS}
          value={formData.productInterest}
          onChange={(value) => setFormData({ ...formData, productInterest: value })}
          size="md"
          searchable
          clearable
        />

        <TextInput
          label="Current HVAC System"
          placeholder="e.g., Legacy 20-year-old system"
          value={formData.currentHVACSystem}
          onChange={(e) => setFormData({ ...formData, currentHVACSystem: e.currentTarget.value })}
          size="md"
        />

        <Divider label="Sales Information" labelPosition="left" />

        <div>
          <Group gap="xs" mb="xs">
            <Text size="sm" fw={500}>
              Sales Phase
            </Text>
            <Text size="sm" c="dimmed">
              *
            </Text>
          </Group>
          <Select
            placeholder="Select sales phase"
            data={SALES_PHASE_OPTIONS}
            value={formData.salesPhase}
            onChange={(value) => setFormData({ ...formData, salesPhase: value || 'Prospect' })}
            size="md"
            renderOption={({ option }) => (
              <Group gap="xs">
                <Badge
                  variant="light"
                  color={getPhaseColor(option.value)}
                  className={`badge-opportunity-${option.value.toLowerCase().replace(' ', '-')}`}
                >
                  {option.label}
                </Badge>
              </Group>
            )}
          />
          <Group gap="xs" mt="xs">
            <Text size="xs" c="dimmed">
              Current Phase:
            </Text>
            <Badge
              variant="light"
              color={getPhaseColor(formData.salesPhase)}
              className={`badge-opportunity-${formData.salesPhase.toLowerCase().replace(' ', '-')}`}
            >
              {formData.salesPhase}
            </Badge>
          </Group>
        </div>

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <NumberInput
              label="Estimated Value"
              placeholder="850000"
              leftSection={<IconCurrencyDollar size={16} />}
              value={formData.estimatedValue}
              onChange={(value) => setFormData({ ...formData, estimatedValue: Number(value) || 0 })}
              error={errors.estimatedValue}
              required
              min={0}
              step={1000}
              thousandSeparator=","
              prefix="$"
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <div>
              <Group gap="xs" mb="xs">
                <Text size="sm" fw={500}>
                  Win Probability
                </Text>
                <Badge variant="light" color="blue">
                  {formData.probability}%
                </Badge>
              </Group>
              <Slider
                value={formData.probability}
                onChange={(value) => setFormData({ ...formData, probability: value })}
                min={0}
                max={100}
                step={5}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' }
                ]}
                size="md"
                color="blue"
              />
            </div>
          </Grid.Col>
        </Grid>

        {formData.estimatedValue > 0 && formData.probability > 0 && (
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Weighted Value:
            </Text>
            <Text size="sm" fw={600}>
              ${((formData.estimatedValue * formData.probability) / 100).toLocaleString()}
            </Text>
          </Group>
        )}

        <Divider label="Stakeholders" labelPosition="left" />

        <Select
          label="Engineering Firm"
          placeholder="Select engineering firm"
          leftSection={<IconBuilding size={16} />}
          data={ENGINEERING_FIRMS}
          value={formData.engineeringFirmId}
          onChange={(value) => setFormData({ ...formData, engineeringFirmId: value || '' })}
          error={errors.engineeringFirmId}
          searchable
          required
          size="md"
        />

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Manufacturer Rep"
              placeholder="Select rep"
              data={MANUFACTURER_REPS}
              value={formData.manufacturerRepId}
              onChange={(value) => setFormData({ ...formData, manufacturerRepId: value || '' })}
              error={errors.manufacturerRepId}
              searchable
              required
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Regional Sales Manager"
              placeholder="Select manager"
              data={SALES_MANAGERS}
              value={formData.regionalSalesManagerId}
              onChange={(value) => setFormData({ ...formData, regionalSalesManagerId: value || '' })}
              error={errors.regionalSalesManagerId}
              searchable
              required
              size="md"
            />
          </Grid.Col>
        </Grid>

        <Divider label="Additional Notes" labelPosition="left" />

        <Textarea
          label="Notes"
          placeholder="Add any additional notes about this opportunity..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.currentTarget.value })}
          minRows={3}
          size="md"
        />

        <Divider />

        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleClose} size="md" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} size="md" loading={isSubmitting}>
            {mode === 'create' ? 'Create Opportunity' : 'Save Changes'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

'use client';

import { useState } from 'react';
import {
  Stack,
  Group,
  Text,
  Button,
  Card,
  Grid,
  TextInput,
  Select,
  Textarea,
  Checkbox,
  NumberInput,
  Divider,
  Badge,
  Box,
  ThemeIcon,
  Timeline,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconBuilding,
  IconUser,
  IconPhone,
  IconMail,
  IconMapPin,
  IconFileText,
  IconCheck,
  IconEdit,
  IconDownload,
  IconSend,
  IconClock,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';

interface OnboardingRecord {
  id: string;
  leadId: string;
  leadName: string;
  companyName: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  currentStep: number;
  totalSteps: number;
  assignedTo: string;
  startDate: Date;
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  cisSubmitted: boolean;
  cisSubmittedDate?: Date;
  tasks: OnboardingTask[];
}

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  type: 'document' | 'call' | 'email' | 'meeting' | 'training' | 'system';
}

interface CustomerInformationSheetProps {
  record: OnboardingRecord;
  onClose: () => void;
}

interface CISData {
  // Company Information
  companyName: string;
  businessType: string;
  yearsInBusiness: number;
  numberOfEmployees: string;
  annualRevenue: string;
  
  // Contact Information
  primaryContactName: string;
  primaryContactTitle: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  
  // Business Address
  businessAddress: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Business Details
  currentHvacBrands: string[];
  primaryCustomerBase: string;
  serviceArea: string;
  businessChallenges: string;
  growthGoals: string;
  
  // Technical Information
  technicalStaffCount: number;
  certificationLevels: string[];
  trainingNeeds: string[];
  
  // Partnership Interests
  productInterests: string[];
  supportNeeds: string[];
  marketingSupport: boolean;
  trainingSupport: boolean;
  
  // Additional Information
  additionalComments: string;
  referralSource: string;
  
  // Submission Details
  submittedBy: string;
  submissionDate: Date;
  reviewedBy?: string;
  reviewDate?: Date;
  approved: boolean;
}

export function CustomerInformationSheet({ record, onClose }: CustomerInformationSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [cisData, setCisData] = useState<CISData>({
    // Mock data for demonstration
    companyName: record.companyName,
    businessType: 'HVAC Contractor',
    yearsInBusiness: 15,
    numberOfEmployees: '10-25',
    annualRevenue: '$1M-$5M',
    
    primaryContactName: record.leadName,
    primaryContactTitle: 'Owner',
    primaryContactEmail: 'contact@example.com',
    primaryContactPhone: '(555) 123-4567',
    
    businessAddress: '123 Main Street',
    city: 'Anytown',
    state: 'TX',
    zipCode: '12345',
    
    currentHvacBrands: ['Carrier', 'Trane'],
    primaryCustomerBase: 'Residential',
    serviceArea: '50 mile radius',
    businessChallenges: 'Finding qualified technicians, increasing competition',
    growthGoals: 'Expand service area, add commercial services',
    
    technicalStaffCount: 8,
    certificationLevels: ['EPA 608', 'NATE Certified'],
    trainingNeeds: ['Heat Pump Technology', 'Smart Controls'],
    
    productInterests: ['Heat Pumps', 'Smart Thermostats', 'Air Quality'],
    supportNeeds: ['Technical Training', 'Marketing Materials', 'Lead Generation'],
    marketingSupport: true,
    trainingSupport: true,
    
    additionalComments: 'Looking to partner with a reliable manufacturer for long-term growth.',
    referralSource: 'Trade Show',
    
    submittedBy: record.leadName,
    submissionDate: record.cisSubmittedDate || new Date(),
    reviewedBy: record.assignedTo,
    reviewDate: record.cisSubmittedDate ? new Date(record.cisSubmittedDate.getTime() + 24 * 60 * 60 * 1000) : undefined,
    approved: true,
  });

  const form = useForm({
    initialValues: cisData,
  });

  const businessTypeOptions = [
    { value: 'HVAC Contractor', label: 'HVAC Contractor' },
    { value: 'Plumbing Contractor', label: 'Plumbing Contractor' },
    { value: 'Electrical Contractor', label: 'Electrical Contractor' },
    { value: 'General Contractor', label: 'General Contractor' },
    { value: 'Distributor', label: 'Distributor' },
    { value: 'Other', label: 'Other' },
  ];

  const employeeRanges = [
    { value: '1-5', label: '1-5 employees' },
    { value: '6-10', label: '6-10 employees' },
    { value: '11-25', label: '11-25 employees' },
    { value: '26-50', label: '26-50 employees' },
    { value: '51-100', label: '51-100 employees' },
    { value: '100+', label: '100+ employees' },
  ];

  const revenueRanges = [
    { value: 'Under $500K', label: 'Under $500K' },
    { value: '$500K-$1M', label: '$500K-$1M' },
    { value: '$1M-$5M', label: '$1M-$5M' },
    { value: '$5M-$10M', label: '$5M-$10M' },
    { value: '$10M+', label: '$10M+' },
  ];

  const stateOptions = [
    { value: 'TX', label: 'Texas' },
    { value: 'CA', label: 'California' },
    { value: 'FL', label: 'Florida' },
    { value: 'NY', label: 'New York' },
    // Add more states as needed
  ];

  const submissionHistory = [
    {
      id: '1',
      action: 'CIS Sent',
      description: 'Customer Information Sheet sent to prospect',
      date: new Date(record.startDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      user: record.assignedTo,
      icon: IconSend,
      color: 'blue',
    },
    {
      id: '2',
      action: 'CIS Submitted',
      description: 'Customer completed and submitted information sheet',
      date: cisData.submissionDate,
      user: cisData.submittedBy,
      icon: IconFileText,
      color: 'green',
    },
    {
      id: '3',
      action: 'CIS Reviewed',
      description: 'Information sheet reviewed and approved',
      date: cisData.reviewDate || new Date(),
      user: cisData.reviewedBy || 'System',
      icon: IconCheck,
      color: 'green',
    },
  ];

  const handleSave = (values: typeof form.values) => {
    setCisData(values);
    setIsEditing(false);
  };

  return (
    <Stack gap="md">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <Box>
          <Group gap="xs" mb="xs">
            <ThemeIcon color="blue" variant="light">
              <IconFileText size={20} />
            </ThemeIcon>
            <Text size="xl" fw={700}>
              Customer Information Sheet
            </Text>
          </Group>
          <Text c="dimmed" size="sm">
            {record.companyName} • Submitted {cisData.submissionDate.toLocaleDateString()}
          </Text>
        </Box>
        <Group gap="xs">
          <Badge color={cisData.approved ? 'green' : 'yellow'} variant="light">
            {cisData.approved ? 'Approved' : 'Pending Review'}
          </Badge>
          <Tooltip label="Download PDF">
            <ActionIcon variant="subtle">
              <IconDownload size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit CIS">
            <ActionIcon variant="subtle" onClick={() => setIsEditing(!isEditing)}>
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Divider />

      {isEditing ? (
        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack gap="md">
            {/* Company Information */}
            <Card withBorder p="md">
              <Text fw={600} mb="md">Company Information</Text>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Company Name"
                    {...form.getInputProps('companyName')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Business Type"
                    data={businessTypeOptions}
                    {...form.getInputProps('businessType')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Years in Business"
                    min={0}
                    {...form.getInputProps('yearsInBusiness')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Number of Employees"
                    data={employeeRanges}
                    {...form.getInputProps('numberOfEmployees')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Annual Revenue"
                    data={revenueRanges}
                    {...form.getInputProps('annualRevenue')}
                  />
                </Grid.Col>
              </Grid>
            </Card>

            {/* Contact Information */}
            <Card withBorder p="md">
              <Text fw={600} mb="md">Primary Contact</Text>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Contact Name"
                    {...form.getInputProps('primaryContactName')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Title"
                    {...form.getInputProps('primaryContactTitle')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Email"
                    {...form.getInputProps('primaryContactEmail')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Phone"
                    {...form.getInputProps('primaryContactPhone')}
                  />
                </Grid.Col>
              </Grid>
            </Card>

            {/* Business Address */}
            <Card withBorder p="md">
              <Text fw={600} mb="md">Business Address</Text>
              <Grid>
                <Grid.Col span={12}>
                  <TextInput
                    label="Street Address"
                    {...form.getInputProps('businessAddress')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="City"
                    {...form.getInputProps('city')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="State"
                    data={stateOptions}
                    {...form.getInputProps('state')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="ZIP Code"
                    {...form.getInputProps('zipCode')}
                  />
                </Grid.Col>
              </Grid>
            </Card>

            {/* Business Details */}
            <Card withBorder p="md">
              <Text fw={600} mb="md">Business Details</Text>
              <Stack gap="md">
                <Textarea
                  label="Current HVAC Brands"
                  placeholder="List current brands you work with"
                  value={cisData.currentHvacBrands.join(', ')}
                  onChange={(event) => setCisData(prev => ({
                    ...prev,
                    currentHvacBrands: event.currentTarget.value.split(', ')
                  }))}
                />
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Primary Customer Base"
                      {...form.getInputProps('primaryCustomerBase')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Service Area"
                      {...form.getInputProps('serviceArea')}
                    />
                  </Grid.Col>
                </Grid>
                <Textarea
                  label="Business Challenges"
                  {...form.getInputProps('businessChallenges')}
                />
                <Textarea
                  label="Growth Goals"
                  {...form.getInputProps('growthGoals')}
                />
              </Stack>
            </Card>

            <Group justify="flex-end">
              <Button variant="default" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      ) : (
        <Stack gap="md">
          {/* Company Information */}
          <Card withBorder p="md">
            <Group gap="xs" mb="md">
              <ThemeIcon color="blue" variant="light" size="sm">
                <IconBuilding size={16} />
              </ThemeIcon>
              <Text fw={600}>Company Information</Text>
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Company Name</Text>
                <Text fw={500}>{cisData.companyName}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Business Type</Text>
                <Text fw={500}>{cisData.businessType}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Years in Business</Text>
                <Text fw={500}>{cisData.yearsInBusiness} years</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Employees</Text>
                <Text fw={500}>{cisData.numberOfEmployees}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Annual Revenue</Text>
                <Text fw={500}>{cisData.annualRevenue}</Text>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Contact Information */}
          <Card withBorder p="md">
            <Group gap="xs" mb="md">
              <ThemeIcon color="green" variant="light" size="sm">
                <IconUser size={16} />
              </ThemeIcon>
              <Text fw={600}>Primary Contact</Text>
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <IconUser size={14} />
                  <Text size="sm">{cisData.primaryContactName} - {cisData.primaryContactTitle}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <IconMail size={14} />
                  <Text size="sm">{cisData.primaryContactEmail}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <IconPhone size={14} />
                  <Text size="sm">{cisData.primaryContactPhone}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <IconMapPin size={14} />
                  <Text size="sm">{cisData.businessAddress}, {cisData.city}, {cisData.state} {cisData.zipCode}</Text>
                </Group>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Business Details */}
          <Card withBorder p="md">
            <Text fw={600} mb="md">Business Details</Text>
            <Stack gap="md">
              <Box>
                <Text size="sm" c="dimmed" mb={4}>Current HVAC Brands</Text>
                <Group gap="xs">
                  {cisData.currentHvacBrands.map((brand, index) => (
                    <Badge key={index} variant="light">{brand}</Badge>
                  ))}
                </Group>
              </Box>
              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">Primary Customer Base</Text>
                  <Text fw={500}>{cisData.primaryCustomerBase}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">Service Area</Text>
                  <Text fw={500}>{cisData.serviceArea}</Text>
                </Grid.Col>
              </Grid>
              <Box>
                <Text size="sm" c="dimmed" mb={4}>Business Challenges</Text>
                <Text size="sm">{cisData.businessChallenges}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed" mb={4}>Growth Goals</Text>
                <Text size="sm">{cisData.growthGoals}</Text>
              </Box>
            </Stack>
          </Card>

          {/* Submission History */}
          <Card withBorder p="md">
            <Group gap="xs" mb="md">
              <ThemeIcon color="indigo" variant="light" size="sm">
                <IconClock size={16} />
              </ThemeIcon>
              <Text fw={600}>Submission History</Text>
            </Group>
            <Timeline active={submissionHistory.length - 1} bulletSize={24} lineWidth={2}>
              {submissionHistory.map((item) => (
                <Timeline.Item
                  key={item.id}
                  bullet={
                    <ThemeIcon size={24} color={item.color} variant="light">
                      <item.icon size={12} />
                    </ThemeIcon>
                  }
                  title={item.action}
                >
                  <Text c="dimmed" size="sm">
                    {item.description}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>
                    {item.date.toLocaleString()} • {item.user}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Stack>
      )}

      {/* Action Buttons */}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Close
        </Button>
        <Button leftSection={<IconDownload size={16} />}>
          Download PDF
        </Button>
        <Button leftSection={<IconSend size={16} />}>
          Send Copy
        </Button>
      </Group>
    </Stack>
  );
}
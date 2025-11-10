'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Stack,
  Badge,
  Grid,
  Select,
  Alert,
  Progress,
  ThemeIcon,
  Table,
  Avatar,
  Tabs,
  SimpleGrid,
  ActionIcon,
  Tooltip,
  RingProgress,
  Center,
} from '@mantine/core';
import {
  IconCertificate,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconClock,
  IconUsers,
  IconTrendingUp,
  IconShield,
  IconCalendar,
  IconDownload,
  IconEye,
  IconRefresh,
} from '@tabler/icons-react';

interface CustomerWithTraining {
  id: string;
  companyName: string;
  contactName: string;
  status: string;
  totalOrders: number;
  trainingStats: {
    totalSessions: number;
    completedSessions: number;
    scheduledSessions: number;
    overdueSessions: number;
    totalTrainingHours: number;
    certifications: number;
    averageRating: number;
    complianceStatus: string;
    missingTypes: string[];
    daysSinceLastTraining: number;
    needsRefresher: boolean;
    hasRecentOrders: boolean;
  };
}

interface TrainingComplianceTrackerProps {
  customers: CustomerWithTraining[];
}

interface ComplianceRequirement {
  type: string;
  name: string;
  required: boolean;
  renewalPeriod: number; // days
  description: string;
}

const COMPLIANCE_REQUIREMENTS: ComplianceRequirement[] = [
  {
    type: 'installation',
    name: 'Installation Certification',
    required: true,
    renewalPeriod: 730, // 2 years
    description: 'Required for all equipment installation work',
  },
  {
    type: 'maintenance',
    name: 'Maintenance Certification',
    required: true,
    renewalPeriod: 730, // 2 years
    description: 'Required for preventive maintenance and repairs',
  },
  {
    type: 'sales',
    name: 'Sales Training',
    required: false,
    renewalPeriod: 365, // 1 year
    description: 'Recommended for customer-facing roles',
  },
  {
    type: 'product_knowledge',
    name: 'Product Knowledge',
    required: false,
    renewalPeriod: 180, // 6 months
    description: 'Stay current with latest product updates',
  },
];

export function TrainingComplianceTracker({ customers }: TrainingComplianceTrackerProps) {
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [complianceFilter, setComplianceFilter] = useState<string | null>(null);
  const [requirementFilter, setRequirementFilter] = useState<string | null>(null);

  // Calculate detailed compliance data
  const complianceData = useMemo(() => {
    return customers.map(customer => {
      const requirements = COMPLIANCE_REQUIREMENTS.map(req => {
        const hasCompleted = !customer.trainingStats.missingTypes.includes(req.type);
        const isRequired = req.required;
        
        // Calculate renewal status
        let renewalStatus = 'current';
        let daysUntilRenewal = 999;
        
        if (hasCompleted && customer.trainingStats.daysSinceLastTraining < 999) {
          daysUntilRenewal = req.renewalPeriod - customer.trainingStats.daysSinceLastTraining;
          if (daysUntilRenewal <= 0) {
            renewalStatus = 'expired';
          } else if (daysUntilRenewal <= 30) {
            renewalStatus = 'expiring_soon';
          }
        }

        return {
          ...req,
          hasCompleted,
          renewalStatus,
          daysUntilRenewal,
          isCompliant: hasCompleted && (renewalStatus === 'current' || renewalStatus === 'expiring_soon'),
        };
      });

      const requiredRequirements = requirements.filter(r => r.required);
      const compliantRequired = requiredRequirements.filter(r => r.isCompliant).length;
      const totalRequired = requiredRequirements.length;
      
      const overallCompliance = totalRequired > 0 ? (compliantRequired / totalRequired) * 100 : 100;
      const complianceStatus = overallCompliance === 100 ? 'compliant' : 
                              overallCompliance >= 50 ? 'partial' : 'non_compliant';

      const expiringCertifications = requirements.filter(r => 
        r.renewalStatus === 'expiring_soon' || r.renewalStatus === 'expired'
      ).length;

      return {
        ...customer,
        requirements,
        overallCompliance,
        complianceStatus,
        expiringCertifications,
        compliantRequired,
        totalRequired,
      };
    });
  }, [customers]);

  // Filter compliance data
  const filteredComplianceData = useMemo(() => {
    return complianceData.filter(customer => {
      const matchesCompliance = !complianceFilter || customer.complianceStatus === complianceFilter;
      const matchesRequirement = !requirementFilter || 
        customer.requirements.some(r => r.type === requirementFilter && !r.isCompliant);
      return matchesCompliance && matchesRequirement;
    });
  }, [complianceData, complianceFilter, requirementFilter]);

  // Calculate overview metrics
  const overviewMetrics = useMemo(() => {
    const totalCustomers = complianceData.length;
    const compliantCustomers = complianceData.filter(c => c.complianceStatus === 'compliant').length;
    const partialCompliantCustomers = complianceData.filter(c => c.complianceStatus === 'partial').length;
    const nonCompliantCustomers = complianceData.filter(c => c.complianceStatus === 'non_compliant').length;
    
    const totalExpiringCerts = complianceData.reduce((sum, c) => sum + c.expiringCertifications, 0);
    const averageCompliance = totalCustomers > 0 
      ? complianceData.reduce((sum, c) => sum + c.overallCompliance, 0) / totalCustomers 
      : 0;

    // Calculate requirement-specific metrics
    const requirementMetrics = COMPLIANCE_REQUIREMENTS.map(req => {
      const customersWithReq = complianceData.filter(c => 
        c.requirements.find(r => r.type === req.type)?.isCompliant
      ).length;
      const complianceRate = totalCustomers > 0 ? (customersWithReq / totalCustomers) * 100 : 0;
      
      const expiring = complianceData.filter(c => {
        const customerReq = c.requirements.find(r => r.type === req.type);
        return customerReq && (customerReq.renewalStatus === 'expiring_soon' || customerReq.renewalStatus === 'expired');
      }).length;

      return {
        ...req,
        complianceRate,
        compliantCustomers: customersWithReq,
        expiringCount: expiring,
      };
    });

    return {
      totalCustomers,
      compliantCustomers,
      partialCompliantCustomers,
      nonCompliantCustomers,
      totalExpiringCerts,
      averageCompliance,
      requirementMetrics,
    };
  }, [complianceData]);

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'green';
      case 'partial': return 'yellow';
      case 'non_compliant': return 'red';
      default: return 'gray';
    }
  };

  const getRenewalStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'green';
      case 'expiring_soon': return 'orange';
      case 'expired': return 'red';
      default: return 'gray';
    }
  };

  const getRenewalStatusLabel = (status: string) => {
    switch (status) {
      case 'current': return 'Current';
      case 'expiring_soon': return 'Expiring Soon';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const formatDaysUntilRenewal = (days: number) => {
    if (days <= 0) return 'Expired';
    if (days === 999) return 'N/A';
    if (days > 365) return `${Math.floor(days / 365)}y ${Math.floor((days % 365) / 30)}m`;
    if (days > 30) return `${Math.floor(days / 30)}m`;
    return `${days}d`;
  };

  return (
    <Stack gap="lg">
      {/* Overview Metrics */}
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }}>
        <Card withBorder p="md" ta="center">
          <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
            <IconUsers size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="blue">
            {overviewMetrics.totalCustomers}
          </Text>
          <Text size="sm" c="dimmed">
            Total Customers
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
            <IconCheck size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="green">
            {overviewMetrics.compliantCustomers}
          </Text>
          <Text size="sm" c="dimmed">
            Fully Compliant
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="yellow" variant="light" size="xl" mx="auto" mb="sm">
            <IconShield size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="yellow">
            {overviewMetrics.partialCompliantCustomers}
          </Text>
          <Text size="sm" c="dimmed">
            Partially Compliant
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="red" variant="light" size="xl" mx="auto" mb="sm">
            <IconX size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="red">
            {overviewMetrics.nonCompliantCustomers}
          </Text>
          <Text size="sm" c="dimmed">
            Non-Compliant
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="orange" variant="light" size="xl" mx="auto" mb="sm">
            <IconAlertTriangle size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="orange">
            {overviewMetrics.totalExpiringCerts}
          </Text>
          <Text size="sm" c="dimmed">
            Expiring Certs
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="teal" variant="light" size="xl" mx="auto" mb="sm">
            <IconTrendingUp size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="teal">
            {overviewMetrics.averageCompliance.toFixed(1)}%
          </Text>
          <Text size="sm" c="dimmed">
            Avg Compliance
          </Text>
        </Card>
      </SimpleGrid>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconShield size={16} />}>
            Compliance Overview
          </Tabs.Tab>
          <Tabs.Tab value="requirements" leftSection={<IconCertificate size={16} />}>
            Requirements
          </Tabs.Tab>
          <Tabs.Tab value="renewals" leftSection={<IconClock size={16} />}>
            Renewals
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="lg">
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>Customer Compliance Status</Title>
              <Group gap="sm">
                <Select
                  placeholder="Compliance Status"
                  data={[
                    { value: 'compliant', label: 'Compliant' },
                    { value: 'partial', label: 'Partial' },
                    { value: 'non_compliant', label: 'Non-Compliant' },
                  ]}
                  value={complianceFilter}
                  onChange={setComplianceFilter}
                  clearable
                  w={150}
                />
                <Button leftSection={<IconDownload size={16} />} variant="light">
                  Export Report
                </Button>
              </Group>
            </Group>

            <Table.ScrollContainer minWidth={1000}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Overall Compliance</Table.Th>
                    <Table.Th>Required Training</Table.Th>
                    <Table.Th>Expiring Certs</Table.Th>
                    <Table.Th>Last Training</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredComplianceData.map((customer) => (
                    <Table.Tr key={customer.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar size={32} radius="xl" color="blue">
                            {customer.companyName.charAt(0)}
                          </Avatar>
                          <div>
                            <Text fw={500} size="sm">
                              {customer.companyName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {customer.contactName}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="sm">
                          <RingProgress
                            size={40}
                            thickness={4}
                            sections={[
                              { 
                                value: customer.overallCompliance, 
                                color: getComplianceColor(customer.complianceStatus) 
                              }
                            ]}
                          />
                          <div>
                            <Text size="sm" fw={500}>
                              {customer.overallCompliance.toFixed(0)}%
                            </Text>
                            <Badge 
                              color={getComplianceColor(customer.complianceStatus)} 
                              variant="light" 
                              size="xs"
                            >
                              {customer.complianceStatus.replace('_', ' ')}
                            </Badge>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {customer.compliantRequired}/{customer.totalRequired}
                        </Text>
                        <Progress 
                          value={customer.totalRequired > 0 ? (customer.compliantRequired / customer.totalRequired) * 100 : 0}
                          color={getComplianceColor(customer.complianceStatus)}
                          size="sm"
                          mt="xs"
                        />
                      </Table.Td>
                      <Table.Td>
                        {customer.expiringCertifications > 0 ? (
                          <Badge color="orange" variant="light">
                            {customer.expiringCertifications} expiring
                          </Badge>
                        ) : (
                          <Text size="sm" c="dimmed">None</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {customer.trainingStats.daysSinceLastTraining < 999 
                            ? `${customer.trainingStats.daysSinceLastTraining} days ago`
                            : 'Never'
                          }
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Tooltip label="View Details">
                            <ActionIcon variant="light" color="blue">
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Schedule Training">
                            <ActionIcon variant="light" color="green">
                              <IconCalendar size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="requirements" pt="lg">
          <Grid>
            {overviewMetrics.requirementMetrics.map((req) => (
              <Grid.Col key={req.type} span={{ base: 12, sm: 6, lg: 3 }}>
                <Card withBorder p="lg" h="100%">
                  <Stack gap="md">
                    <Group justify="space-between">
                      <ThemeIcon 
                        color={req.required ? 'red' : 'blue'} 
                        variant="light" 
                        size="lg"
                      >
                        <IconCertificate size={20} />
                      </ThemeIcon>
                      {req.required && (
                        <Badge color="red" variant="light" size="xs">
                          Required
                        </Badge>
                      )}
                    </Group>
                    
                    <div>
                      <Text fw={500} size="sm" mb="xs">
                        {req.name}
                      </Text>
                      <Text size="xs" c="dimmed" mb="md">
                        {req.description}
                      </Text>
                    </div>

                    <div>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">Compliance Rate</Text>
                        <Text size="sm" fw={500}>
                          {req.complianceRate.toFixed(1)}%
                        </Text>
                      </Group>
                      <Progress 
                        value={req.complianceRate} 
                        color={req.complianceRate >= 80 ? 'green' : req.complianceRate >= 50 ? 'orange' : 'red'}
                        size="lg"
                      />
                    </div>

                    <Group justify="space-between">
                      <div>
                        <Text size="xs" c="dimmed">Compliant</Text>
                        <Text size="sm" fw={500} c="green">
                          {req.compliantCustomers}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">Expiring</Text>
                        <Text size="sm" fw={500} c="orange">
                          {req.expiringCount}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">Renewal</Text>
                        <Text size="sm" fw={500}>
                          {Math.floor(req.renewalPeriod / 30)}m
                        </Text>
                      </div>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="renewals" pt="lg">
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>Certification Renewals</Title>
              <Button leftSection={<IconRefresh size={16} />} variant="light">
                Check Renewals
              </Button>
            </Group>

            <Alert
              icon={<IconAlertTriangle size={16} />}
              title="Upcoming Renewals"
              color="orange"
              mb="md"
            >
              {overviewMetrics.totalExpiringCerts} certifications are expiring soon or have expired.
              Review and schedule renewal training to maintain compliance.
            </Alert>

            <Table.ScrollContainer minWidth={800}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Certification</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Time Until Renewal</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {complianceData
                    .flatMap(customer => 
                      customer.requirements
                        .filter(req => req.renewalStatus !== 'current')
                        .map(req => ({ customer, requirement: req }))
                    )
                    .sort((a, b) => a.requirement.daysUntilRenewal - b.requirement.daysUntilRenewal)
                    .map(({ customer, requirement }, index) => (
                      <Table.Tr key={`${customer.id}-${requirement.type}`}>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar size={24} radius="xl" color="blue">
                              {customer.companyName.charAt(0)}
                            </Avatar>
                            <Text size="sm">{customer.companyName}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500}>
                            {requirement.name}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getRenewalStatusColor(requirement.renewalStatus)} 
                            variant="light"
                          >
                            {getRenewalStatusLabel(requirement.renewalStatus)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {formatDaysUntilRenewal(requirement.daysUntilRenewal)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Tooltip label="Schedule Renewal">
                              <ActionIcon variant="light" color="blue">
                                <IconCalendar size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="View History">
                              <ActionIcon variant="light" color="gray">
                                <IconEye size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
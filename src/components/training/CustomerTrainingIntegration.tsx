'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Table,
  Badge,
  Text,
  Stack,
  ActionIcon,
  Menu,
  rem,
  Pagination,
  Grid,
  Avatar,
  Modal,
  Tabs,
  Alert,
  Progress,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core';
import {
  IconSearch,
  IconPlus,
  IconEye,
  IconEdit,
  IconDots,
  IconSchool,
  IconCertificate,
  IconClock,
  IconUsers,
  IconStar,
  IconCalendar,
  IconAlertTriangle,
  IconTrendingUp,
  IconFilter,
  IconBulb,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import { TrainingScheduleModal } from './TrainingScheduleModal';
import { TrainingRecommendationEngine } from './TrainingRecommendationEngine';
import { TrainingComplianceTracker } from './TrainingComplianceTracker';

const ITEMS_PER_PAGE = 10;

export function CustomerTrainingIntegration() {
  const { customers, trainingSessions, users } = useMockData();
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [complianceFilter, setComplianceFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Calculate customer training metrics
  const customerTrainingData = useMemo(() => {
    return customers.map(customer => {
      const customerSessions = trainingSessions.filter(s => s.customerId === customer.id);
      const completedSessions = customerSessions.filter(s => s.status === 'completed');
      const scheduledSessions = customerSessions.filter(s => s.status === 'scheduled');
      const overdueSessions = customerSessions.filter(s => 
        s.status === 'scheduled' && s.scheduledDate < new Date()
      );
      
      const totalTrainingHours = completedSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
      const certifications = completedSessions.filter(s => s.certificationAwarded).length;
      const averageRating = completedSessions.length > 0 
        ? completedSessions.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0) / completedSessions.length
        : 0;

      // Calculate compliance status
      const requiredTrainingTypes: ('installation' | 'maintenance' | 'sales')[] = ['installation', 'maintenance', 'sales'];
      const completedTypes = new Set(completedSessions.map(s => s.type));
      const missingTypes = requiredTrainingTypes.filter(type => !completedTypes.has(type));
      
      const complianceStatus = missingTypes.length === 0 ? 'compliant' : 
                              missingTypes.length === 1 ? 'partial' : 'non_compliant';

      // Training recommendations
      const lastTrainingDate = completedSessions.length > 0 
        ? Math.max(...completedSessions.map(s => s.completedDate?.getTime() || 0))
        : 0;
      const daysSinceLastTraining = lastTrainingDate > 0 
        ? Math.floor((Date.now() - lastTrainingDate) / (1000 * 60 * 60 * 24))
        : 999;

      const needsRefresher = daysSinceLastTraining > 365;
      const hasRecentOrders = customer.totalOrders > 0; // Simplified check

      return {
        ...customer,
        trainingStats: {
          totalSessions: customerSessions.length,
          completedSessions: completedSessions.length,
          scheduledSessions: scheduledSessions.length,
          overdueSessions: overdueSessions.length,
          totalTrainingHours,
          certifications,
          averageRating,
          complianceStatus,
          missingTypes,
          daysSinceLastTraining,
          needsRefresher,
          hasRecentOrders,
        }
      };
    });
  }, [customers, trainingSessions]);

  // Filter customers based on search and filters
  const filteredCustomers = useMemo(() => {
    return customerTrainingData.filter(customer => {
      const matchesSearch = !searchQuery || 
        customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.contactName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || 
        (statusFilter === 'needs_training' && customer.trainingStats.scheduledSessions === 0) ||
        (statusFilter === 'scheduled' && customer.trainingStats.scheduledSessions > 0) ||
        (statusFilter === 'overdue' && customer.trainingStats.overdueSessions > 0);

      const matchesCompliance = !complianceFilter || 
        customer.trainingStats.complianceStatus === complianceFilter;

      return matchesSearch && matchesStatus && matchesCompliance;
    });
  }, [customerTrainingData, searchQuery, statusFilter, complianceFilter]);

  // Paginate results
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Calculate overview metrics
  const overviewMetrics = useMemo(() => {
    const totalCustomers = customerTrainingData.length;
    const compliantCustomers = customerTrainingData.filter(c => c.trainingStats.complianceStatus === 'compliant').length;
    const customersNeedingTraining = customerTrainingData.filter(c => 
      c.trainingStats.scheduledSessions === 0 && c.trainingStats.complianceStatus !== 'compliant'
    ).length;
    const overdueTraining = customerTrainingData.reduce((sum, c) => sum + c.trainingStats.overdueSessions, 0);
    const totalCertifications = customerTrainingData.reduce((sum, c) => sum + c.trainingStats.certifications, 0);
    const averageCompletionRate = totalCustomers > 0 
      ? customerTrainingData.reduce((sum, c) => {
          const rate = c.trainingStats.totalSessions > 0 
            ? (c.trainingStats.completedSessions / c.trainingStats.totalSessions) * 100 
            : 0;
          return sum + rate;
        }, 0) / totalCustomers
      : 0;

    return {
      totalCustomers,
      compliantCustomers,
      customersNeedingTraining,
      overdueTraining,
      totalCertifications,
      averageCompletionRate,
      complianceRate: totalCustomers > 0 ? (compliantCustomers / totalCustomers) * 100 : 0,
    };
  }, [customerTrainingData]);

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'green';
      case 'partial': return 'yellow';
      case 'non_compliant': return 'red';
      default: return 'gray';
    }
  };

  const getComplianceLabel = (status: string) => {
    switch (status) {
      case 'compliant': return 'Compliant';
      case 'partial': return 'Partial';
      case 'non_compliant': return 'Non-Compliant';
      default: return 'Unknown';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleScheduleTraining = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setScheduleModalOpen(true);
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
            {overviewMetrics.complianceRate.toFixed(1)}%
          </Text>
          <Text size="sm" c="dimmed">
            Compliance Rate
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="orange" variant="light" size="xl" mx="auto" mb="sm">
            <IconSchool size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="orange">
            {overviewMetrics.customersNeedingTraining}
          </Text>
          <Text size="sm" c="dimmed">
            Need Training
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="red" variant="light" size="xl" mx="auto" mb="sm">
            <IconAlertTriangle size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="red">
            {overviewMetrics.overdueTraining}
          </Text>
          <Text size="sm" c="dimmed">
            Overdue Sessions
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="violet" variant="light" size="xl" mx="auto" mb="sm">
            <IconCertificate size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="violet">
            {overviewMetrics.totalCertifications}
          </Text>
          <Text size="sm" c="dimmed">
            Certifications
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="teal" variant="light" size="xl" mx="auto" mb="sm">
            <IconTrendingUp size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="teal">
            {overviewMetrics.averageCompletionRate.toFixed(1)}%
          </Text>
          <Text size="sm" c="dimmed">
            Avg Completion
          </Text>
        </Card>
      </SimpleGrid>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconUsers size={16} />}>
            Customer Overview
          </Tabs.Tab>
          <Tabs.Tab value="recommendations" leftSection={<IconBulb size={16} />}>
            Recommendations
          </Tabs.Tab>
          <Tabs.Tab value="compliance" leftSection={<IconCertificate size={16} />}>
            Compliance Tracking
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="lg">
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>Customer Training Status</Title>
              <Button 
                leftSection={<IconPlus size={16} />}
                onClick={() => setScheduleModalOpen(true)}
              >
                Schedule Training
              </Button>
            </Group>
            
            <Group gap="md" mb="md">
              <TextInput
                placeholder="Search customers..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Training Status"
                data={[
                  { value: 'needs_training', label: 'Needs Training' },
                  { value: 'scheduled', label: 'Has Scheduled' },
                  { value: 'overdue', label: 'Overdue' },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                clearable
                w={150}
              />
              <Select
                placeholder="Compliance"
                data={[
                  { value: 'compliant', label: 'Compliant' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'non_compliant', label: 'Non-Compliant' },
                ]}
                value={complianceFilter}
                onChange={setComplianceFilter}
                clearable
                w={130}
              />
            </Group>

            <Table.ScrollContainer minWidth={1200}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Training Progress</Table.Th>
                    <Table.Th>Compliance Status</Table.Th>
                    <Table.Th>Last Training</Table.Th>
                    <Table.Th>Certifications</Table.Th>
                    <Table.Th>Scheduled</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedCustomers.map((customer) => (
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
                        <div>
                          <Group gap="xs" mb="xs">
                            <Text size="sm">
                              {customer.trainingStats.completedSessions}/{customer.trainingStats.totalSessions}
                            </Text>
                            <Text size="xs" c="dimmed">
                              ({customer.trainingStats.totalTrainingHours.toFixed(1)}h)
                            </Text>
                          </Group>
                          <Progress 
                            value={customer.trainingStats.totalSessions > 0 
                              ? (customer.trainingStats.completedSessions / customer.trainingStats.totalSessions) * 100 
                              : 0
                            } 
                            color="blue" 
                            size="sm" 
                          />
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getComplianceColor(customer.trainingStats.complianceStatus)} variant="light">
                          {getComplianceLabel(customer.trainingStats.complianceStatus)}
                        </Badge>
                        {customer.trainingStats.missingTypes.length > 0 && (
                          <Text size="xs" c="dimmed" mt="xs">
                            Missing: {customer.trainingStats.missingTypes.join(', ')}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {customer.trainingStats.daysSinceLastTraining < 999 
                            ? `${customer.trainingStats.daysSinceLastTraining} days ago`
                            : 'Never'
                          }
                        </Text>
                        {customer.trainingStats.needsRefresher && (
                          <Badge color="orange" variant="light" size="xs" mt="xs">
                            Refresher Due
                          </Badge>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <IconCertificate size={14} />
                          <Text size="sm">
                            {customer.trainingStats.certifications}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Text size="sm">
                            {customer.trainingStats.scheduledSessions}
                          </Text>
                          {customer.trainingStats.overdueSessions > 0 && (
                            <Badge color="red" variant="light" size="xs">
                              {customer.trainingStats.overdueSessions} overdue
                            </Badge>
                          )}
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Menu position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                            >
                              View Training History
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconCalendar style={{ width: rem(14), height: rem(14) }} />}
                              onClick={() => handleScheduleTraining(customer.id)}
                            >
                              Schedule Training
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconBulb style={{ width: rem(14), height: rem(14) }} />}
                            >
                              View Recommendations
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Group justify="center" mt="md">
                <Pagination
                  value={currentPage}
                  onChange={setCurrentPage}
                  total={totalPages}
                />
              </Group>
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="recommendations" pt="lg">
          <TrainingRecommendationEngine customers={customerTrainingData} />
        </Tabs.Panel>

        <Tabs.Panel value="compliance" pt="lg">
          <TrainingComplianceTracker customers={customerTrainingData} />
        </Tabs.Panel>
      </Tabs>

      {/* Training Schedule Modal */}
      <TrainingScheduleModal
        opened={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false);
          setSelectedCustomerId(null);
        }}
        customerId={selectedCustomerId}
      />
    </Stack>
  );
}
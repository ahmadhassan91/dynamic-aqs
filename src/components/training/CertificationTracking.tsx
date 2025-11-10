'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Badge,
  ActionIcon,
  Menu,
  rem,
  Stack,
  Grid,
  Select,
  TextInput,
  Modal,
  Table,
  Avatar,
  Progress,
  ThemeIcon,
  Tabs,
  Alert,
  Anchor,
  Tooltip,
} from '@mantine/core';
import {
  IconCertificate,
  IconPlus,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconSearch,
  IconDownload,
  IconCalendar,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconStar,
  IconAward,
  IconClock,
  IconRefresh,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface Certification {
  id: string;
  name: string;
  type: 'installation' | 'maintenance' | 'sales' | 'product_knowledge' | 'safety';
  description: string;
  customerId: string;
  trainerId: string;
  trainingSessionId: string;
  issuedDate: Date;
  expiryDate?: Date;
  status: 'active' | 'expired' | 'revoked' | 'pending_renewal';
  certificateUrl?: string;
  renewalRequired: boolean;
  renewalPeriodMonths?: number;
  prerequisites: string[];
  competencies: string[];
  verificationCode: string;
}

// Mock certifications data
const mockCertifications: Certification[] = [
  {
    id: '1',
    name: 'AQS Pro Series Installation Certified',
    type: 'installation',
    description: 'Certified to install AQS Pro Series heat pump systems',
    customerId: 'cust-1',
    trainerId: 'tm-1',
    trainingSessionId: 'session-1',
    issuedDate: new Date('2024-01-15'),
    expiryDate: new Date('2025-01-15'),
    status: 'active',
    certificateUrl: '/certificates/aqs-pro-installation-cert-001.pdf',
    renewalRequired: true,
    renewalPeriodMonths: 12,
    prerequisites: ['Basic HVAC Knowledge', 'Safety Certification'],
    competencies: ['System Installation', 'Electrical Connections', 'Refrigerant Handling'],
    verificationCode: 'AQS-INST-2024-001'
  },
  {
    id: '2',
    name: 'Advanced HVAC Sales Professional',
    type: 'sales',
    description: 'Advanced sales certification for HVAC professionals',
    customerId: 'cust-2',
    trainerId: 'tm-2',
    trainingSessionId: 'session-2',
    issuedDate: new Date('2024-02-01'),
    expiryDate: new Date('2026-02-01'),
    status: 'active',
    certificateUrl: '/certificates/advanced-sales-cert-002.pdf',
    renewalRequired: true,
    renewalPeriodMonths: 24,
    prerequisites: ['Basic Sales Experience', 'Product Knowledge'],
    competencies: ['Consultative Selling', 'Objection Handling', 'Closing Techniques'],
    verificationCode: 'AQS-SALES-2024-002'
  },
  {
    id: '3',
    name: 'Preventive Maintenance Specialist',
    type: 'maintenance',
    description: 'Certified in preventive maintenance procedures',
    customerId: 'cust-3',
    trainerId: 'tm-1',
    trainingSessionId: 'session-3',
    issuedDate: new Date('2023-06-15'),
    expiryDate: new Date('2024-06-15'),
    status: 'expired',
    certificateUrl: '/certificates/maintenance-cert-003.pdf',
    renewalRequired: true,
    renewalPeriodMonths: 12,
    prerequisites: ['Basic HVAC Knowledge'],
    competencies: ['System Inspection', 'Filter Replacement', 'Performance Testing'],
    verificationCode: 'AQS-MAINT-2023-003'
  }
];

export function CertificationTracking() {
  const { customers, users } = useMockData();
  const [certifications] = useState<Certification[]>(mockCertifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  // Filter certifications
  const filteredCertifications = useMemo(() => {
    return certifications.filter(cert => {
      const matchesSearch = !searchQuery ||
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.verificationCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = !typeFilter || cert.type === typeFilter;
      const matchesStatus = !statusFilter || cert.status === statusFilter;

      // Tab filtering
      let matchesTab = true;
      if (activeTab === 'active') {
        matchesTab = cert.status === 'active';
      } else if (activeTab === 'expiring') {
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        matchesTab = !!(cert.expiryDate && cert.expiryDate <= thirtyDaysFromNow && cert.status === 'active');
      } else if (activeTab === 'expired') {
        matchesTab = cert.status === 'expired';
      }

      return matchesSearch && matchesType && matchesStatus && matchesTab;
    });
  }, [certifications, searchQuery, typeFilter, statusFilter, activeTab]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = certifications.length;
    const active = certifications.filter(c => c.status === 'active').length;
    const expired = certifications.filter(c => c.status === 'expired').length;

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiring = certifications.filter(c =>
      c.expiryDate && c.expiryDate <= thirtyDaysFromNow && c.status === 'active'
    ).length;

    return { total, active, expired, expiring };
  }, [certifications]);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.companyName || 'Unknown Customer';
  };

  const getTrainerName = (trainerId: string) => {
    const trainer = users.find(u => u.id === trainerId);
    return trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown Trainer';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'installation': return 'blue';
      case 'maintenance': return 'orange';
      case 'sales': return 'green';
      case 'product_knowledge': return 'violet';
      case 'safety': return 'red';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'expired': return 'red';
      case 'revoked': return 'dark';
      case 'pending_renewal': return 'yellow';
      default: return 'gray';
    }
  };

  const formatTypeLabel = (type: string) => {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatStatusLabel = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getDaysUntilExpiry = (expiryDate?: Date) => {
    if (!expiryDate) return null;
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleViewCertification = (certification: Certification) => {
    setSelectedCertification(certification);
    setShowCertModal(true);
  };

  const handleRenewCertification = (certification: Certification) => {
    setSelectedCertification(certification);
    setShowRenewalModal(true);
  };

  const certificationTypes = [
    { value: 'installation', label: 'Installation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'sales', label: 'Sales' },
    { value: 'product_knowledge', label: 'Product Knowledge' },
    { value: 'safety', label: 'Safety' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'revoked', label: 'Revoked' },
    { value: 'pending_renewal', label: 'Pending Renewal' },
  ];

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Certification Tracking</Title>
          <Text c="dimmed" size="sm">
            Track and manage training certifications and renewals
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />}>
          Issue Certificate
        </Button>
      </Group>

      {/* Statistics Cards */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
              <IconCertificate size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="blue">
              {stats.total}
            </Text>
            <Text size="sm" c="dimmed">
              Total Certificates
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
              <IconCheck size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="green">
              {stats.active}
            </Text>
            <Text size="sm" c="dimmed">
              Active Certificates
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="yellow" variant="light" size="xl" mx="auto" mb="sm">
              <IconAlertTriangle size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="yellow">
              {stats.expiring}
            </Text>
            <Text size="sm" c="dimmed">
              Expiring Soon
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card withBorder p="md" ta="center">
            <ThemeIcon color="red" variant="light" size="xl" mx="auto" mb="sm">
              <IconX size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} c="red">
              {stats.expired}
            </Text>
            <Text size="sm" c="dimmed">
              Expired Certificates
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Filters */}
      <Card withBorder p="md">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              placeholder="Search certifications..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Filter by type"
              data={certificationTypes}
              value={typeFilter}
              onChange={setTypeFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Filter by status"
              data={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Button variant="light" leftSection={<IconRefresh size={16} />} fullWidth>
              Refresh
            </Button>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="all" leftSection={<IconCertificate size={16} />}>
            All Certificates ({stats.total})
          </Tabs.Tab>
          <Tabs.Tab value="active" leftSection={<IconCheck size={16} />}>
            Active ({stats.active})
          </Tabs.Tab>
          <Tabs.Tab value="expiring" leftSection={<IconAlertTriangle size={16} />}>
            Expiring Soon ({stats.expiring})
          </Tabs.Tab>
          <Tabs.Tab value="expired" leftSection={<IconX size={16} />}>
            Expired ({stats.expired})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={activeTab || 'all'} pt="lg">
          {stats.expiring > 0 && activeTab === 'all' && (
            <Alert
              icon={<IconAlertTriangle size={16} />}
              title="Certificates Expiring Soon"
              color="yellow"
              variant="light"
              mb="md"
            >
              {stats.expiring} certificate(s) will expire within the next 30 days.
              <Anchor ml="xs" onClick={() => setActiveTab('expiring')}>
                View expiring certificates
              </Anchor>
            </Alert>
          )}

          <Card withBorder p={0}>
            <Table.ScrollContainer minWidth={1200}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Certificate</Table.Th>
                    <Table.Th>Holder</Table.Th>
                    <Table.Th>Trainer</Table.Th>
                    <Table.Th>Issued Date</Table.Th>
                    <Table.Th>Expiry Date</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Verification</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredCertifications.map((cert) => {
                    const daysUntilExpiry = getDaysUntilExpiry(cert.expiryDate);
                    return (
                      <Table.Tr key={cert.id}>
                        <Table.Td>
                          <div>
                            <Text fw={500} size="sm">
                              {cert.name}
                            </Text>
                            <Group gap="xs" mt="xs">
                              <Badge color={getTypeColor(cert.type)} variant="light" size="sm">
                                {formatTypeLabel(cert.type)}
                              </Badge>
                              {cert.renewalRequired && (
                                <Badge color="blue" variant="outline" size="sm">
                                  Renewable
                                </Badge>
                              )}
                            </Group>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={500} size="sm">
                            {getCustomerName(cert.customerId)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar size={24} radius="xl" color="blue">
                              {getTrainerName(cert.trainerId).charAt(0)}
                            </Avatar>
                            <Text size="sm">
                              {getTrainerName(cert.trainerId)}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Intl.DateTimeFormat('en-US').format(cert.issuedDate)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          {cert.expiryDate ? (
                            <div>
                              <Text size="sm">
                                {new Intl.DateTimeFormat('en-US').format(cert.expiryDate)}
                              </Text>
                              {daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                                <Text size="xs" c="yellow">
                                  {daysUntilExpiry} days left
                                </Text>
                              )}
                              {daysUntilExpiry !== null && daysUntilExpiry <= 0 && (
                                <Text size="xs" c="red">
                                  Expired
                                </Text>
                              )}
                            </div>
                          ) : (
                            <Text size="sm" c="dimmed">
                              No expiry
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(cert.status)} variant="light">
                            {formatStatusLabel(cert.status)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Tooltip label="Click to copy verification code">
                            <Text
                              size="sm"
                              fw={500}
                              style={{ cursor: 'pointer', fontFamily: 'monospace' }}
                              onClick={() => navigator.clipboard.writeText(cert.verificationCode)}
                            >
                              {cert.verificationCode}
                            </Text>
                          </Tooltip>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Tooltip label="View Certificate">
                              <ActionIcon
                                variant="subtle"
                                onClick={() => handleViewCertification(cert)}
                              >
                                <IconEye size={16} />
                              </ActionIcon>
                            </Tooltip>
                            {cert.certificateUrl && (
                              <Tooltip label="Download Certificate">
                                <ActionIcon variant="subtle">
                                  <IconDownload size={16} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                            <Menu position="bottom-end">
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <IconDots size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                {cert.status === 'expired' && cert.renewalRequired && (
                                  <Menu.Item
                                    leftSection={<IconRefresh style={{ width: rem(14), height: rem(14) }} />}
                                    onClick={() => handleRenewCertification(cert)}
                                  >
                                    Renew Certificate
                                  </Menu.Item>
                                )}
                                <Menu.Item
                                  leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                >
                                  Edit Certificate
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconCalendar style={{ width: rem(14), height: rem(14) }} />}
                                >
                                  Schedule Renewal
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                  leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                  color="red"
                                >
                                  Revoke Certificate
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Certificate Detail Modal */}
      <Modal
        opened={showCertModal}
        onClose={() => setShowCertModal(false)}
        title="Certificate Details"
        size="lg"
      >
        {selectedCertification && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Title order={3}>{selectedCertification.name}</Title>
                <Group gap="xs" mt="xs">
                  <Badge color={getTypeColor(selectedCertification.type)} variant="light">
                    {formatTypeLabel(selectedCertification.type)}
                  </Badge>
                  <Badge color={getStatusColor(selectedCertification.status)} variant="light">
                    {formatStatusLabel(selectedCertification.status)}
                  </Badge>
                </Group>
              </div>
              <ThemeIcon color="gold" variant="light" size="xl">
                <IconAward size={24} />
              </ThemeIcon>
            </Group>

            <Text>{selectedCertification.description}</Text>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Certificate Holder</Text>
                <Text fw={500}>{getCustomerName(selectedCertification.customerId)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Issuing Trainer</Text>
                <Text fw={500}>{getTrainerName(selectedCertification.trainerId)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Issue Date</Text>
                <Text fw={500}>
                  {new Intl.DateTimeFormat('en-US').format(selectedCertification.issuedDate)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Expiry Date</Text>
                <Text fw={500}>
                  {selectedCertification.expiryDate ?
                    new Intl.DateTimeFormat('en-US').format(selectedCertification.expiryDate) :
                    'No expiry'
                  }
                </Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" c="dimmed">Verification Code</Text>
                <Text fw={500} style={{ fontFamily: 'monospace' }}>
                  {selectedCertification.verificationCode}
                </Text>
              </Grid.Col>
            </Grid>

            {selectedCertification.prerequisites.length > 0 && (
              <div>
                <Text fw={500} mb="xs">Prerequisites</Text>
                <Group gap="xs">
                  {selectedCertification.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {prereq}
                    </Badge>
                  ))}
                </Group>
              </div>
            )}

            {selectedCertification.competencies.length > 0 && (
              <div>
                <Text fw={500} mb="xs">Competencies</Text>
                <Group gap="xs">
                  {selectedCertification.competencies.map((competency, index) => (
                    <Badge key={index} variant="light" color="blue" size="sm">
                      {competency}
                    </Badge>
                  ))}
                </Group>
              </div>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setShowCertModal(false)}>
                Close
              </Button>
              {selectedCertification.certificateUrl && (
                <Button leftSection={<IconDownload size={16} />}>
                  Download Certificate
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Renewal Modal */}
      <Modal
        opened={showRenewalModal}
        onClose={() => setShowRenewalModal(false)}
        title="Certificate Renewal"
        size="md"
      >
        {selectedCertification && (
          <Stack gap="md">
            <Alert
              icon={<IconAlertTriangle size={16} />}
              title="Certificate Renewal Required"
              color="yellow"
              variant="light"
            >
              This certificate has expired and requires renewal training to reactivate.
            </Alert>

            <div>
              <Text fw={500} mb="xs">Certificate: {selectedCertification.name}</Text>
              <Text size="sm" c="dimmed">
                Expired on: {selectedCertification.expiryDate ?
                  new Intl.DateTimeFormat('en-US').format(selectedCertification.expiryDate) :
                  'N/A'
                }
              </Text>
            </div>

            <div>
              <Text fw={500} mb="xs">Renewal Requirements</Text>
              <Text size="sm">
                Complete a renewal training session to reactivate this certificate.
                The new certificate will be valid for {selectedCertification.renewalPeriodMonths} months.
              </Text>
            </div>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setShowRenewalModal(false)}>
                Cancel
              </Button>
              <Button leftSection={<IconCalendar size={16} />}>
                Schedule Renewal Training
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
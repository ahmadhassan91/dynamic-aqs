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
  Table,
  Avatar,
  ActionIcon,
  Menu,
  rem,
  Modal,
  TextInput,
  Textarea,
  Alert,
  Progress,
  ThemeIcon,
  SimpleGrid,
  Tabs,
  Tooltip,
  RingProgress,
  Center,
} from '@mantine/core';
import {
  IconCertificate,
  IconCalendar,
  IconDownload,
  IconEdit,
  IconEye,
  IconDots,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconRefresh,
  IconPlus,
  IconStar,
  IconClock,
  IconUsers,
  IconTrendingUp,
} from '@tabler/icons-react';

import { useMockData } from '@/lib/mockData/MockDataProvider';

interface CertificationManagerProps {
  customerId?: string;
}

interface Certification {
  id: string;
  customerId: string;
  customerName: string;
  type: string;
  name: string;
  number: string;
  issuedDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'expiring_soon';
  renewalRequired: boolean;
  trainingSessionId?: string;
  issuer: string;
  level: 'basic' | 'intermediate' | 'advanced';
  notes?: string;
}

export function CertificationManager({ customerId }: CertificationManagerProps) {
  const { trainingSessions, customers, users } = useMockData();
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Generate mock certifications based on completed training sessions
  const certifications = useMemo(() => {
    const certs: Certification[] = [];
    
    const completedSessions = trainingSessions.filter(s => 
      s.status === 'completed' && 
      s.certificationAwarded &&
      (!customerId || s.customerId === customerId)
    );

    completedSessions.forEach((session, index) => {
      const customer = customers.find(c => c.id === session.customerId);
      const issuedDate = session.completedDate || new Date();
      const expiryDate = new Date(issuedDate);
      
      // Set expiry based on certification type
      switch (session.type) {
        case 'installation':
        case 'maintenance':
          expiryDate.setFullYear(expiryDate.getFullYear() + 2); // 2 years
          break;
        case 'sales':
          expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year
          break;
        case 'product_knowledge':
          expiryDate.setMonth(expiryDate.getMonth() + 6); // 6 months
          break;
        default:
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }

      // Determine status
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      let status: 'active' | 'expired' | 'expiring_soon' = 'active';
      
      if (daysUntilExpiry <= 0) {
        status = 'expired';
      } else if (daysUntilExpiry <= 30) {
        status = 'expiring_soon';
      }

      certs.push({
        id: `cert-${session.id}`,
        customerId: session.customerId,
        customerName: customer?.companyName || 'Unknown Customer',
        type: session.type,
        name: `${session.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Certification`,
        number: `AQS-${session.type.toUpperCase().substring(0, 3)}-${String(index + 1).padStart(4, '0')}`,
        issuedDate,
        expiryDate,
        status,
        renewalRequired: status === 'expired' || status === 'expiring_soon',
        trainingSessionId: session.id,
        issuer: 'AQS Training Institute',
        level: session.type === 'installation' || session.type === 'maintenance' ? 'advanced' : 
               session.type === 'sales' ? 'intermediate' : 'basic',
        notes: session.feedback?.comments,
      });
    });

    return certs.sort((a, b) => b.issuedDate.getTime() - a.issuedDate.getTime());
  }, [trainingSessions, customers, customerId]);

  // Filter certifications
  const filteredCertifications = useMemo(() => {
    return certifications.filter(cert => {
      const matchesStatus = !statusFilter || cert.status === statusFilter;
      const matchesType = !typeFilter || cert.type === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [certifications, statusFilter, typeFilter]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalCerts = certifications.length;
    const activeCerts = certifications.filter(c => c.status === 'active').length;
    const expiredCerts = certifications.filter(c => c.status === 'expired').length;
    const expiringSoonCerts = certifications.filter(c => c.status === 'expiring_soon').length;
    const renewalRequired = certifications.filter(c => c.renewalRequired).length;

    const certsByType = certifications.reduce((acc, cert) => {
      acc[cert.type] = (acc[cert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const certsByLevel = certifications.reduce((acc, cert) => {
      acc[cert.level] = (acc[cert.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const thisMonthIssued = certifications.filter(c => {
      const thisMonth = new Date();
      return c.issuedDate.getMonth() === thisMonth.getMonth() && 
             c.issuedDate.getFullYear() === thisMonth.getFullYear();
    }).length;

    return {
      totalCerts,
      activeCerts,
      expiredCerts,
      expiringSoonCerts,
      renewalRequired,
      certsByType,
      certsByLevel,
      thisMonthIssued,
    };
  }, [certifications]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'expiring_soon': return 'orange';
      case 'expired': return 'red';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'installation': return 'blue';
      case 'maintenance': return 'orange';
      case 'sales': return 'green';
      case 'product_knowledge': return 'violet';
      default: return 'gray';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'blue';
      case 'intermediate': return 'orange';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const now = new Date();
    return Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleViewCertificate = (cert: Certification) => {
    setSelectedCert(cert);
    setIsEditing(false);
    setCertModalOpen(true);
  };

  const handleEditCertificate = (cert: Certification) => {
    setSelectedCert(cert);
    setIsEditing(true);
    setCertModalOpen(true);
  };

  const handleDownloadCertificate = (cert: Certification) => {
    // In a real application, this would generate and download a PDF certificate
    console.log('Downloading certificate:', cert.number);
  };

  const renderCertificationTable = (certs: Certification[]) => (
    <Table.ScrollContainer minWidth={1000}>
      <Table verticalSpacing="sm" horizontalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Certificate</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Type & Level</Table.Th>
            <Table.Th>Issued Date</Table.Th>
            <Table.Th>Expiry Date</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {certs.map((cert) => {
            const daysUntilExpiry = getDaysUntilExpiry(cert.expiryDate);
            
            return (
              <Table.Tr key={cert.id}>
                <Table.Td>
                  <div>
                    <Text fw={500} size="sm">
                      {cert.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      #{cert.number}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar size={24} radius="xl" color="blue">
                      {cert.customerName.charAt(0)}
                    </Avatar>
                    <Text size="sm">
                      {cert.customerName}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Stack gap="xs">
                    <Badge color={getTypeColor(cert.type)} variant="light" size="sm">
                      {cert.type.replace('_', ' ')}
                    </Badge>
                    <Badge color={getLevelColor(cert.level)} variant="outline" size="xs">
                      {cert.level}
                    </Badge>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {formatDate(cert.issuedDate)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <div>
                    <Text size="sm">
                      {formatDate(cert.expiryDate)}
                    </Text>
                    {cert.status === 'expiring_soon' && (
                      <Text size="xs" c="orange">
                        {daysUntilExpiry} days left
                      </Text>
                    )}
                    {cert.status === 'expired' && (
                      <Text size="xs" c="red">
                        Expired {Math.abs(daysUntilExpiry)} days ago
                      </Text>
                    )}
                  </div>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(cert.status)} variant="light">
                    {cert.status === 'expiring_soon' ? 'Expiring Soon' : 
                     cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                  </Badge>
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
                        onClick={() => handleViewCertificate(cert)}
                      >
                        View Certificate
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconDownload style={{ width: rem(14), height: rem(14) }} />}
                        onClick={() => handleDownloadCertificate(cert)}
                      >
                        Download PDF
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                        onClick={() => handleEditCertificate(cert)}
                      >
                        Edit Details
                      </Menu.Item>
                      {cert.renewalRequired && (
                        <Menu.Item
                          leftSection={<IconRefresh style={{ width: rem(14), height: rem(14) }} />}
                          color="orange"
                        >
                          Schedule Renewal
                        </Menu.Item>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );

  return (
    <Stack gap="lg">
      {/* Certification Metrics */}
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }}>
        <Card withBorder p="md" ta="center">
          <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
            <IconCertificate size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="blue">
            {metrics.totalCerts}
          </Text>
          <Text size="sm" c="dimmed">
            Total Certificates
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
            <IconCheck size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="green">
            {metrics.activeCerts}
          </Text>
          <Text size="sm" c="dimmed">
            Active
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="orange" variant="light" size="xl" mx="auto" mb="sm">
            <IconClock size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="orange">
            {metrics.expiringSoonCerts}
          </Text>
          <Text size="sm" c="dimmed">
            Expiring Soon
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="red" variant="light" size="xl" mx="auto" mb="sm">
            <IconX size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="red">
            {metrics.expiredCerts}
          </Text>
          <Text size="sm" c="dimmed">
            Expired
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="yellow" variant="light" size="xl" mx="auto" mb="sm">
            <IconRefresh size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="yellow">
            {metrics.renewalRequired}
          </Text>
          <Text size="sm" c="dimmed">
            Need Renewal
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="teal" variant="light" size="xl" mx="auto" mb="sm">
            <IconTrendingUp size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="teal">
            {metrics.thisMonthIssued}
          </Text>
          <Text size="sm" c="dimmed">
            Issued This Month
          </Text>
        </Card>
      </SimpleGrid>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconCertificate size={16} />}>
            All Certificates
          </Tabs.Tab>
          <Tabs.Tab 
            value="expiring" 
            leftSection={<IconAlertTriangle size={16} />}
            rightSection={
              metrics.expiringSoonCerts > 0 ? (
                <Badge color="orange" variant="light" size="sm">
                  {metrics.expiringSoonCerts}
                </Badge>
              ) : null
            }
          >
            Expiring Soon
          </Tabs.Tab>
          <Tabs.Tab 
            value="expired" 
            leftSection={<IconX size={16} />}
            rightSection={
              metrics.expiredCerts > 0 ? (
                <Badge color="red" variant="light" size="sm">
                  {metrics.expiredCerts}
                </Badge>
              ) : null
            }
          >
            Expired
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconTrendingUp size={16} />}>
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="lg">
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>All Certificates</Title>
              <Group gap="sm">
                <Select
                  placeholder="Status"
                  data={[
                    { value: 'active', label: 'Active' },
                    { value: 'expiring_soon', label: 'Expiring Soon' },
                    { value: 'expired', label: 'Expired' },
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  clearable
                  w={120}
                />
                <Select
                  placeholder="Type"
                  data={[
                    { value: 'installation', label: 'Installation' },
                    { value: 'maintenance', label: 'Maintenance' },
                    { value: 'sales', label: 'Sales' },
                    { value: 'product_knowledge', label: 'Product Knowledge' },
                  ]}
                  value={typeFilter}
                  onChange={setTypeFilter}
                  clearable
                  w={150}
                />
                <Button leftSection={<IconPlus size={16} />} variant="light">
                  Issue Certificate
                </Button>
              </Group>
            </Group>
            {renderCertificationTable(filteredCertifications)}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="expiring" pt="lg">
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>Expiring Soon</Title>
              {metrics.expiringSoonCerts > 0 && (
                <Alert
                  icon={<IconAlertTriangle size={16} />}
                  color="orange"
                  variant="light"
                  style={{ flex: 1, maxWidth: 400 }}
                >
                  {metrics.expiringSoonCerts} certificates expire within 30 days
                </Alert>
              )}
            </Group>
            {renderCertificationTable(certifications.filter(c => c.status === 'expiring_soon'))}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="expired" pt="lg">
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>Expired Certificates</Title>
              {metrics.expiredCerts > 0 && (
                <Alert
                  icon={<IconX size={16} />}
                  color="red"
                  variant="light"
                  style={{ flex: 1, maxWidth: 400 }}
                >
                  {metrics.expiredCerts} certificates have expired and need renewal
                </Alert>
              )}
            </Group>
            {renderCertificationTable(certifications.filter(c => c.status === 'expired'))}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="analytics" pt="lg">
          <Grid>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Certificates by Type</Title>
                <Stack gap="md">
                  {Object.entries(metrics.certsByType).map(([type, count]) => (
                    <div key={type}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" tt="capitalize">
                          {type.replace('_', ' ')}
                        </Text>
                        <Text size="sm" fw={500}>{count}</Text>
                      </Group>
                      <Progress 
                        value={metrics.totalCerts > 0 ? (count / metrics.totalCerts) * 100 : 0} 
                        color={getTypeColor(type)} 
                        size="lg" 
                      />
                    </div>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Certificates by Level</Title>
                <Stack gap="md">
                  {Object.entries(metrics.certsByLevel).map(([level, count]) => (
                    <div key={level}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" tt="capitalize">{level}</Text>
                        <Text size="sm" fw={500}>{count}</Text>
                      </Group>
                      <Progress 
                        value={metrics.totalCerts > 0 ? (count / metrics.totalCerts) * 100 : 0} 
                        color={getLevelColor(level)} 
                        size="lg" 
                      />
                    </div>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>

      {/* Certificate Details Modal */}
      <Modal
        opened={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title={
          <Group gap="sm">
            <IconCertificate size={20} />
            <Title order={3}>
              {isEditing ? 'Edit Certificate' : 'Certificate Details'}
            </Title>
          </Group>
        }
        size="lg"
        centered
      >
        {selectedCert && (
          <Stack gap="md">
            {/* Certificate Header */}
            <Card withBorder p="md" bg="gray.0">
              <Group justify="space-between">
                <div>
                  <Text fw={500} size="lg">{selectedCert.name}</Text>
                  <Text size="sm" c="dimmed">Certificate #{selectedCert.number}</Text>
                </div>
                <Badge color={getStatusColor(selectedCert.status)} variant="light" size="lg">
                  {selectedCert.status === 'expiring_soon' ? 'Expiring Soon' : 
                   selectedCert.status.charAt(0).toUpperCase() + selectedCert.status.slice(1)}
                </Badge>
              </Group>
            </Card>

            {/* Certificate Details */}
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Customer"
                  value={selectedCert.customerName}
                  readOnly={!isEditing}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Issuer"
                  value={selectedCert.issuer}
                  readOnly={!isEditing}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={4}>
                <Select
                  label="Type"
                  value={selectedCert.type}
                  data={[
                    { value: 'installation', label: 'Installation' },
                    { value: 'maintenance', label: 'Maintenance' },
                    { value: 'sales', label: 'Sales' },
                    { value: 'product_knowledge', label: 'Product Knowledge' },
                  ]}
                  readOnly={!isEditing}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Level"
                  value={selectedCert.level}
                  data={[
                    { value: 'basic', label: 'Basic' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                  readOnly={!isEditing}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Certificate Number"
                  value={selectedCert.number}
                  readOnly={!isEditing}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Issued Date"
                  value={selectedCert.issuedDate.toLocaleDateString()}
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Expiry Date"
                  value={selectedCert.expiryDate.toLocaleDateString()}
                  readOnly
                />
              </Grid.Col>
            </Grid>

            {selectedCert.notes && (
              <Textarea
                label="Notes"
                value={selectedCert.notes}
                readOnly={!isEditing}
                minRows={3}
              />
            )}

            {/* Action Buttons */}
            <Group justify="flex-end" gap="sm">
              <Button variant="outline" onClick={() => setCertModalOpen(false)}>
                Close
              </Button>
              {!isEditing && (
                <>
                  <Button
                    leftSection={<IconDownload size={16} />}
                    variant="light"
                    onClick={() => handleDownloadCertificate(selectedCert)}
                  >
                    Download PDF
                  </Button>
                  <Button
                    leftSection={<IconEdit size={16} />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                </>
              )}
              {isEditing && (
                <Button
                  leftSection={<IconCheck size={16} />}
                  onClick={() => setIsEditing(false)}
                >
                  Save Changes
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
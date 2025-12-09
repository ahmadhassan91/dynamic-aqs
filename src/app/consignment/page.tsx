'use client';

import React, { useState } from 'react';
import {
  Title,
  Text,
  Stack,
  Tabs,
  Button,
  Group,
  Paper,
  Grid,
  Card,
  ThemeIcon,
  SimpleGrid,
  Badge,
  Table,
  TextInput,
  Select,
  ActionIcon,
  Tooltip,
  Progress,
  Avatar,
  Modal,
  Textarea,
  Switch,
} from '@mantine/core';
import {
  IconPackage,
  IconClipboardCheck,
  IconAlertTriangle,
  IconCalendar,
  IconPlus,
  IconSearch,
  IconFilter,
  IconEye,
  IconEdit,
  IconMapPin,
  IconUser,
  IconPhone,
  IconMail,
  IconBuilding,
  IconChartBar,
  IconClock,
  IconCheck,
  IconX,
  IconFileDescription,
  IconRefresh,
} from '@tabler/icons-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useDisclosure } from '@mantine/hooks';

// Mock data based on the CSV structure
const consignmentLocations = [
  {
    id: '1',
    tm: 'Adam Tims',
    seNumber: '90',
    description: 'Service Experts (90) - Strand Brothers',
    warehouseId: 'C-SE-AUSTI',
    inceptionDate: '2025-06-16',
    warehouseType: 'HN',
    locationType: 'SE',
    customerId: 'C3363',
    city: 'Austin',
    state: 'TX',
    warehouseManager: 'N/A',
    email: '',
    phone: '',
    currentReconciliation: {
      auditDueDate: '2025-11-25',
      scheduledDate: '',
      actualDate: '2025-11-26',
      status: 'Pending',
      auditType: 'On-Site',
      resultsReturned: 'Form Completed',
      outcome: 'Discrepancy',
      reason: 'Items Missing',
      activity: 'Waiting for PO',
      action: 'Follow-up',
      lastContact: '2025-11-26',
      contactedBy: 'Adam',
    },
    previousReconciliation: {
      auditDueDate: '2025-09-14',
      actualDate: '2025-08-27',
      status: 'Completed',
      outcome: 'Discrepancy',
      reason: 'Items Missing',
      activity: "PO's Submitted",
      action: 'No Further Action',
    },
  },
  {
    id: '2',
    tm: 'Adam Tims',
    seNumber: '246',
    description: 'Service Experts (246) - Levy&Son, Dallas - STS',
    warehouseId: 'C-SE-DALLA',
    inceptionDate: '2025-06-13',
    warehouseType: 'HN',
    locationType: 'SE',
    customerId: 'C3022',
    city: 'Richardson',
    state: 'TX',
    warehouseManager: 'Patrick Barnes',
    email: 'patrick.barnes@serviceexperts.com',
    phone: '469-928-6933',
    currentReconciliation: {
      auditDueDate: '2025-11-26',
      scheduledDate: '',
      actualDate: '2025-12-04',
      status: 'Pending',
      auditType: 'On-Site',
      resultsReturned: 'Form Completed',
      outcome: 'Discrepancy',
      reason: 'Items Missing',
      activity: 'Waiting for PO',
      action: 'Follow-up',
      lastContact: '2025-12-08',
      contactedBy: 'Adam',
    },
    previousReconciliation: {
      auditDueDate: '2025-09-11',
      actualDate: '2025-08-28',
      status: 'Completed',
      outcome: 'Discrepancy',
      reason: 'Items Missing',
      activity: "PO's Submitted",
      action: 'No Further Action',
    },
  },
  {
    id: '3',
    tm: 'Brett Larsen',
    seNumber: '108',
    description: 'Service Experts (SE108) - Bluffton',
    warehouseId: 'C-SE-EPPER',
    inceptionDate: '2025-01-16',
    warehouseType: 'FB',
    locationType: 'SE',
    customerId: 'C0930',
    city: 'Bluffton',
    state: 'SC',
    warehouseManager: 'Eric Eckert',
    email: 'Eric.eckert@serviceexperts.com',
    phone: '843-368-5935',
    currentReconciliation: {
      auditDueDate: '2026-01-08',
      scheduledDate: '',
      actualDate: '',
      status: 'Scheduled',
      auditType: 'Remote',
      resultsReturned: '',
      outcome: '',
      reason: '',
      activity: '',
      action: '',
      lastContact: '',
      contactedBy: '',
    },
    previousReconciliation: {
      auditDueDate: '2025-04-16',
      actualDate: '2025-10-10',
      status: 'Completed',
      outcome: 'Reconciled',
      reason: '',
      activity: '',
      action: 'No Further Action',
    },
  },
  {
    id: '4',
    tm: 'Brad Jacko',
    seNumber: '35',
    description: 'Service Experts (SE035) - Amherst',
    warehouseId: 'C-SE-AMHER',
    inceptionDate: '2025-05-28',
    warehouseType: 'PR',
    locationType: 'SE',
    customerId: 'C0929',
    city: 'Depew',
    state: 'NY',
    warehouseManager: 'Matt Kulik',
    email: 'matt.kulik@serviceexperts.com',
    phone: '(716) 310-9203',
    currentReconciliation: {
      auditDueDate: '2026-01-20',
      scheduledDate: '',
      actualDate: '',
      status: 'Scheduled',
      auditType: 'Remote',
      resultsReturned: '',
      outcome: '',
      reason: '',
      activity: '',
      action: '',
      lastContact: '',
      contactedBy: '',
    },
    previousReconciliation: {
      auditDueDate: '2025-08-26',
      actualDate: '2025-10-22',
      status: 'Completed',
      outcome: 'Reconciled',
      reason: '',
      activity: '',
      action: 'No Further Action',
    },
  },
  {
    id: '5',
    tm: 'Kyle Victor',
    seNumber: '154',
    description: 'Service Experts (154) - Parker Pearce',
    warehouseId: 'C-SE-PARK',
    inceptionDate: '2025-01-19',
    warehouseType: 'PR',
    locationType: 'SE',
    customerId: 'C0949',
    city: 'Gaithersburg',
    state: 'MD',
    warehouseManager: 'William Corbin',
    email: 'william.corbin@serviceexperts.com',
    phone: '703-848-3914',
    currentReconciliation: {
      auditDueDate: '2026-02-03',
      scheduledDate: '2025-12-16',
      actualDate: '2025-11-05',
      status: 'Pending',
      auditType: 'Remote',
      resultsReturned: 'Form Completed',
      outcome: 'Discrepancy',
      reason: 'Items Missing',
      activity: 'Waiting for PO',
      action: 'Follow-up',
      lastContact: '2025-11-10',
      contactedBy: 'Nicole',
    },
    previousReconciliation: {
      auditDueDate: '2025-04-19',
      actualDate: '',
      status: 'Pending',
      outcome: '',
      reason: '',
      activity: '',
      action: '',
    },
  },
  {
    id: '6',
    tm: 'Jarrod Matthews',
    seNumber: '',
    description: 'Golden Rule Plumbing - NEX',
    warehouseId: 'C-GOLD-IA',
    inceptionDate: '2025-09-10',
    warehouseType: 'HN',
    locationType: 'OTH',
    customerId: 'C0529',
    city: 'Grimes',
    state: 'IA',
    warehouseManager: 'Curtis Depaw',
    email: 'depauw@goldenrulephc.com',
    phone: '641-990-3622',
    currentReconciliation: {
      auditDueDate: '2025-12-09',
      scheduledDate: '2025-12-18',
      actualDate: '',
      status: 'Scheduled',
      auditType: 'On-Site',
      resultsReturned: '',
      outcome: '',
      reason: '',
      activity: '',
      action: '',
      lastContact: '',
      contactedBy: '',
    },
    previousReconciliation: null,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'Completed':
      return 'green';
    case 'Pending':
      return 'yellow';
    case 'Scheduled':
      return 'blue';
    case 'Overdue':
      return 'red';
    default:
      return 'gray';
  }
}

function getOutcomeColor(outcome: string) {
  switch (outcome) {
    case 'Reconciled':
      return 'green';
    case 'Discrepancy':
      return 'orange';
    default:
      return 'gray';
  }
}

export default function ConsignmentPage() {
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTM, setFilterTM] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<typeof consignmentLocations[0] | null>(null);
  const [detailOpened, { open: openDetail, close: closeDetail }] = useDisclosure(false);
  const [auditFormOpened, { open: openAuditForm, close: closeAuditForm }] = useDisclosure(false);

  // Get unique TMs for filter
  const uniqueTMs = [...new Set(consignmentLocations.map((loc) => loc.tm))];

  // Filter locations
  const filteredLocations = consignmentLocations.filter((loc) => {
    const matchesSearch =
      loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.warehouseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTM = !filterTM || loc.tm === filterTM;
    const matchesStatus = !filterStatus || loc.currentReconciliation.status === filterStatus;
    return matchesSearch && matchesTM && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalLocations: consignmentLocations.length,
    pendingAudits: consignmentLocations.filter((loc) => loc.currentReconciliation.status === 'Pending').length,
    scheduledAudits: consignmentLocations.filter((loc) => loc.currentReconciliation.status === 'Scheduled').length,
    completedThisMonth: consignmentLocations.filter(
      (loc) =>
        loc.currentReconciliation.status === 'Completed' &&
        loc.currentReconciliation.actualDate?.startsWith('2025-12')
    ).length,
    discrepancies: consignmentLocations.filter((loc) => loc.currentReconciliation.outcome === 'Discrepancy').length,
    waitingForPO: consignmentLocations.filter((loc) => loc.currentReconciliation.activity === 'Waiting for PO').length,
  };

  const handleViewDetails = (location: typeof consignmentLocations[0]) => {
    setSelectedLocation(location);
    openDetail();
  };

  const handleLogAudit = (location: typeof consignmentLocations[0]) => {
    setSelectedLocation(location);
    openAuditForm();
  };

  return (
    <AppLayout>
      <div className="residential-content-container">
        <Stack gap="md">
          {/* Header */}
          <Paper shadow="sm" p="md">
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Title order={2}>Consignment Management</Title>
                <Text c="dimmed">Track and manage consignment inventory at dealer locations</Text>
              </Stack>
              <Group>
                <Button leftSection={<IconRefresh size={16} />} variant="light">
                  Sync Data
                </Button>
                <Button leftSection={<IconPlus size={16} />}>Add Location</Button>
              </Group>
            </Group>
          </Paper>

          {/* Stats Cards */}
          <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }}>
            <Card shadow="sm" p="md">
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <IconPackage size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">
                    Total Locations
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.totalLocations}
                  </Text>
                </div>
              </Group>
            </Card>
            <Card shadow="sm" p="md">
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="yellow">
                  <IconClock size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">
                    Pending Audits
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.pendingAudits}
                  </Text>
                </div>
              </Group>
            </Card>
            <Card shadow="sm" p="md">
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <IconCalendar size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">
                    Scheduled
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.scheduledAudits}
                  </Text>
                </div>
              </Group>
            </Card>
            <Card shadow="sm" p="md">
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="green">
                  <IconCheck size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">
                    Completed (Dec)
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.completedThisMonth}
                  </Text>
                </div>
              </Group>
            </Card>
            <Card shadow="sm" p="md">
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="orange">
                  <IconAlertTriangle size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">
                    Discrepancies
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.discrepancies}
                  </Text>
                </div>
              </Group>
            </Card>
            <Card shadow="sm" p="md">
              <Group>
                <ThemeIcon size="lg" radius="md" variant="light" color="red">
                  <IconFileDescription size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">
                    Waiting for PO
                  </Text>
                  <Text fw={700} size="xl">
                    {stats.waitingForPO}
                  </Text>
                </div>
              </Group>
            </Card>
          </SimpleGrid>

          {/* Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
                Overview
              </Tabs.Tab>
              <Tabs.Tab value="locations" leftSection={<IconPackage size={16} />}>
                All Locations
              </Tabs.Tab>
              <Tabs.Tab value="audits" leftSection={<IconClipboardCheck size={16} />}>
                Audit Schedule
              </Tabs.Tab>
              <Tabs.Tab value="alerts" leftSection={<IconAlertTriangle size={16} />}>
                Alerts & Actions
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="overview" pt="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Paper shadow="sm" p="md">
                    <Title order={4} mb="md">
                      Recent Activity
                    </Title>
                    <Stack gap="sm">
                      {consignmentLocations.slice(0, 5).map((loc) => (
                        <Paper key={loc.id} withBorder p="sm">
                          <Group justify="space-between">
                            <Group>
                              <Avatar color="blue" radius="xl">
                                {loc.tm
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </Avatar>
                              <div>
                                <Text fw={500}>{loc.description}</Text>
                                <Text size="sm" c="dimmed">
                                  {loc.city}, {loc.state} • {loc.tm}
                                </Text>
                              </div>
                            </Group>
                            <Group>
                              <Badge color={getStatusColor(loc.currentReconciliation.status)}>
                                {loc.currentReconciliation.status}
                              </Badge>
                              {loc.currentReconciliation.outcome && (
                                <Badge color={getOutcomeColor(loc.currentReconciliation.outcome)} variant="outline">
                                  {loc.currentReconciliation.outcome}
                                </Badge>
                              )}
                            </Group>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Stack gap="md">
                    <Paper shadow="sm" p="md">
                      <Title order={4} mb="md">
                        Audit Progress
                      </Title>
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text size="sm">Completed</Text>
                          <Text size="sm" fw={500}>
                            {consignmentLocations.filter((l) => l.previousReconciliation?.status === 'Completed').length}{' '}
                            / {consignmentLocations.length}
                          </Text>
                        </Group>
                        <Progress
                          value={
                            (consignmentLocations.filter((l) => l.previousReconciliation?.status === 'Completed').length /
                              consignmentLocations.length) *
                            100
                          }
                          color="green"
                        />
                      </Stack>
                    </Paper>
                    <Paper shadow="sm" p="md">
                      <Title order={4} mb="md">
                        By Territory Manager
                      </Title>
                      <Stack gap="xs">
                        {uniqueTMs.map((tm) => (
                          <Group key={tm} justify="space-between">
                            <Text size="sm">{tm}</Text>
                            <Badge variant="light">
                              {consignmentLocations.filter((l) => l.tm === tm).length} locations
                            </Badge>
                          </Group>
                        ))}
                      </Stack>
                    </Paper>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="locations" pt="md">
              <Paper shadow="sm" p="md">
                {/* Filters */}
                <Group mb="md">
                  <TextInput
                    placeholder="Search locations..."
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Select
                    placeholder="Filter by TM"
                    data={uniqueTMs}
                    value={filterTM}
                    onChange={setFilterTM}
                    clearable
                    leftSection={<IconUser size={16} />}
                    w={200}
                  />
                  <Select
                    placeholder="Filter by Status"
                    data={['Pending', 'Scheduled', 'Completed', 'Overdue']}
                    value={filterStatus}
                    onChange={setFilterStatus}
                    clearable
                    leftSection={<IconFilter size={16} />}
                    w={180}
                  />
                </Group>

                {/* Table */}
                <Table.ScrollContainer minWidth={1000}>
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Location</Table.Th>
                        <Table.Th>Warehouse ID</Table.Th>
                        <Table.Th>TM</Table.Th>
                        <Table.Th>City, State</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Next Audit Due</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Outcome</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {filteredLocations.map((loc) => (
                        <Table.Tr key={loc.id}>
                          <Table.Td>
                            <Text fw={500} lineClamp={1} style={{ maxWidth: 250 }}>
                              {loc.description}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" c="dimmed">
                              {loc.warehouseId}
                            </Text>
                          </Table.Td>
                          <Table.Td>{loc.tm}</Table.Td>
                          <Table.Td>
                            {loc.city}, {loc.state}
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="light" size="sm">
                              {loc.locationType}
                            </Badge>
                          </Table.Td>
                          <Table.Td>{loc.currentReconciliation.auditDueDate || '-'}</Table.Td>
                          <Table.Td>
                            <Badge color={getStatusColor(loc.currentReconciliation.status)}>
                              {loc.currentReconciliation.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            {loc.currentReconciliation.outcome ? (
                              <Badge color={getOutcomeColor(loc.currentReconciliation.outcome)} variant="outline">
                                {loc.currentReconciliation.outcome}
                              </Badge>
                            ) : (
                              '-'
                            )}
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Tooltip label="View Details">
                                <ActionIcon variant="light" onClick={() => handleViewDetails(loc)}>
                                  <IconEye size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Log Audit">
                                <ActionIcon variant="light" color="green" onClick={() => handleLogAudit(loc)}>
                                  <IconClipboardCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="audits" pt="md">
              <Paper shadow="sm" p="md">
                <Title order={4} mb="md">
                  Upcoming Audits
                </Title>
                <Stack gap="sm">
                  {consignmentLocations
                    .filter((loc) => loc.currentReconciliation.status === 'Scheduled')
                    .sort(
                      (a, b) =>
                        new Date(a.currentReconciliation.auditDueDate).getTime() -
                        new Date(b.currentReconciliation.auditDueDate).getTime()
                    )
                    .map((loc) => (
                      <Paper key={loc.id} withBorder p="md">
                        <Group justify="space-between">
                          <Group>
                            <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                              <IconCalendar size={20} />
                            </ThemeIcon>
                            <div>
                              <Text fw={500}>{loc.description}</Text>
                              <Group gap="xs">
                                <Text size="sm" c="dimmed">
                                  Due: {loc.currentReconciliation.auditDueDate}
                                </Text>
                                {loc.currentReconciliation.scheduledDate && (
                                  <>
                                    <Text size="sm" c="dimmed">
                                      •
                                    </Text>
                                    <Text size="sm" c="blue">
                                      Scheduled: {loc.currentReconciliation.scheduledDate}
                                    </Text>
                                  </>
                                )}
                              </Group>
                            </div>
                          </Group>
                          <Group>
                            <Badge>{loc.currentReconciliation.auditType}</Badge>
                            <Button size="xs" variant="light">
                              View
                            </Button>
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                </Stack>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="alerts" pt="md">
              <Paper shadow="sm" p="md">
                <Title order={4} mb="md">
                  Items Requiring Action
                </Title>
                <Stack gap="sm">
                  {consignmentLocations
                    .filter((loc) => loc.currentReconciliation.action === 'Follow-up')
                    .map((loc) => (
                      <Paper key={loc.id} withBorder p="md" style={{ borderLeft: '4px solid var(--mantine-color-orange-6)' }}>
                        <Group justify="space-between">
                          <Group>
                            <ThemeIcon size="lg" radius="md" variant="light" color="orange">
                              <IconAlertTriangle size={20} />
                            </ThemeIcon>
                            <div>
                              <Text fw={500}>{loc.description}</Text>
                              <Group gap="xs">
                                <Text size="sm" c="dimmed">
                                  {loc.currentReconciliation.activity}
                                </Text>
                                <Text size="sm" c="dimmed">
                                  •
                                </Text>
                                <Text size="sm" c="dimmed">
                                  Last Contact: {loc.currentReconciliation.lastContact || 'N/A'}
                                </Text>
                              </Group>
                            </div>
                          </Group>
                          <Group>
                            <Badge color="orange">{loc.currentReconciliation.reason}</Badge>
                            <Button size="xs" color="orange">
                              Take Action
                            </Button>
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                </Stack>
              </Paper>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </div>

      {/* Location Detail Modal */}
      <Modal opened={detailOpened} onClose={closeDetail} title="Location Details" size="lg">
        {selectedLocation && (
          <Stack gap="md">
            <Paper withBorder p="md">
              <Title order={5} mb="sm">
                {selectedLocation.description}
              </Title>
              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Warehouse ID
                  </Text>
                  <Text>{selectedLocation.warehouseId}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Customer ID
                  </Text>
                  <Text>{selectedLocation.customerId}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Location
                  </Text>
                  <Text>
                    {selectedLocation.city}, {selectedLocation.state}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Inception Date
                  </Text>
                  <Text>{selectedLocation.inceptionDate}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Territory Manager
                  </Text>
                  <Text>{selectedLocation.tm}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Type
                  </Text>
                  <Badge>{selectedLocation.locationType}</Badge>
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper withBorder p="md">
              <Title order={5} mb="sm">
                Warehouse Manager Contact
              </Title>
              <Stack gap="xs">
                <Group>
                  <IconUser size={16} />
                  <Text>{selectedLocation.warehouseManager || 'N/A'}</Text>
                </Group>
                <Group>
                  <IconMail size={16} />
                  <Text>{selectedLocation.email || 'N/A'}</Text>
                </Group>
                <Group>
                  <IconPhone size={16} />
                  <Text>{selectedLocation.phone || 'N/A'}</Text>
                </Group>
              </Stack>
            </Paper>

            <Paper withBorder p="md">
              <Title order={5} mb="sm">
                Current Reconciliation
              </Title>
              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Status
                  </Text>
                  <Badge color={getStatusColor(selectedLocation.currentReconciliation.status)}>
                    {selectedLocation.currentReconciliation.status}
                  </Badge>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Outcome
                  </Text>
                  {selectedLocation.currentReconciliation.outcome ? (
                    <Badge color={getOutcomeColor(selectedLocation.currentReconciliation.outcome)} variant="outline">
                      {selectedLocation.currentReconciliation.outcome}
                    </Badge>
                  ) : (
                    <Text>-</Text>
                  )}
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Audit Due Date
                  </Text>
                  <Text>{selectedLocation.currentReconciliation.auditDueDate}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Audit Type
                  </Text>
                  <Text>{selectedLocation.currentReconciliation.auditType || '-'}</Text>
                </Grid.Col>
                {selectedLocation.currentReconciliation.reason && (
                  <Grid.Col span={12}>
                    <Text size="sm" c="dimmed">
                      Reason
                    </Text>
                    <Badge color="orange">{selectedLocation.currentReconciliation.reason}</Badge>
                  </Grid.Col>
                )}
                {selectedLocation.currentReconciliation.activity && (
                  <Grid.Col span={12}>
                    <Text size="sm" c="dimmed">
                      Activity
                    </Text>
                    <Text>{selectedLocation.currentReconciliation.activity}</Text>
                  </Grid.Col>
                )}
              </Grid>
            </Paper>

            <Group justify="flex-end">
              <Button variant="light" onClick={closeDetail}>
                Close
              </Button>
              <Button onClick={() => { closeDetail(); handleLogAudit(selectedLocation); }}>
                Log Audit Result
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Audit Form Modal */}
      <Modal opened={auditFormOpened} onClose={closeAuditForm} title="Log Audit Result" size="md">
        {selectedLocation && (
          <Stack gap="md">
            <Text fw={500}>{selectedLocation.description}</Text>
            <Select
              label="Audit Type"
              placeholder="Select audit type"
              data={['On-Site', 'Remote']}
              defaultValue={selectedLocation.currentReconciliation.auditType}
            />
            <Select
              label="Outcome"
              placeholder="Select outcome"
              data={['Reconciled', 'Discrepancy']}
            />
            <Select
              label="Reason (if discrepancy)"
              placeholder="Select reason"
              data={['Items Missing', 'Inventory Mismatch', 'Documentation Issue', 'Other']}
            />
            <Select
              label="Activity"
              placeholder="Select activity"
              data={['PO Submitted', 'Waiting for PO', 'Rcvd PO', 'N/A']}
            />
            <Select
              label="Next Action"
              placeholder="Select next action"
              data={['Follow-up', 'No Further Action']}
            />
            <Textarea label="Notes" placeholder="Add any additional notes..." rows={3} />
            <Group justify="flex-end">
              <Button variant="light" onClick={closeAuditForm}>
                Cancel
              </Button>
              <Button onClick={closeAuditForm}>Save Audit Result</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </AppLayout>
  );
}

'use client';

import { useState } from 'react';
import {
  Title,
  Group,
  Button,
  Paper,
  Stack,
  Grid,
  Card,
  Text,
  Badge,
  Avatar,
  Tabs,
  Timeline,
  Table,
  ActionIcon,
  Progress,
  Alert,
  NumberFormatter,
  Modal,
  TextInput,
  Textarea,
  Select,
  Container,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconArrowLeft,
  IconEdit,
  IconPhone,
  IconMail,
  IconMapPin,
  IconCalendar,
  IconUser,
  IconPlus,
  IconEye,
  IconDownload,
  IconStar,
  IconCheck,
  IconAlertTriangle,
  IconFileText,
  IconSchool,
  IconNotes,
  IconShoppingCart,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { InteractionTimeline, type Interaction } from '@/components/customers/InteractionTimeline';

// Mock customer data
const mockCustomer = {
  id: 'CUST-001',
  companyName: 'Comfort Zone HVAC Services',
  contactPerson: 'John Mitchell',
  email: 'john@comfortzonehvac.com',
  phone: '(555) 123-4567',
  address: '1234 Main Street, Springfield, IL 62701',
  website: 'www.comfortzonehvac.com',
  
  // Business Information
  businessType: 'HVAC Contractor',
  yearEstablished: 2015,
  employeeCount: 12,
  annualRevenue: 850000,
  
  // CRM Information
  status: 'Active',
  customerSince: '2020-03-15',
  territoryManager: 'Sarah Johnson',
  regionalManager: 'Mike Chen',
  affinityGroup: 'Midwest HVAC Alliance',
  ownershipGroup: 'Independent',
  
  // Performance Metrics
  totalOrders: 47,
  totalRevenue: 125000,
  averageOrderValue: 2660,
  lastOrderDate: '2024-01-10',
  
  // Training & Certification
  certificationLevel: 'Gold Certified',
  certificationExpiry: '2024-12-31',
  trainingHours: 48,
  lastTrainingDate: '2023-11-15',
  
  // Onboarding Status
  onboardingProgress: 100,
  onboardingSteps: [
    { step: 'Initial Contact', completed: true, date: '2020-03-15' },
    { step: 'Discovery Call', completed: true, date: '2020-03-18' },
    { step: 'Information Sheet', completed: true, date: '2020-03-20' },
    { step: 'Technical Training', completed: true, date: '2020-04-05' },
    { step: 'First Order', completed: true, date: '2020-04-12' },
  ],
};

// Mock interactions data
const mockInteractions: Interaction[] = [
  {
    id: '1',
    customerId: 'CUST-001',
    type: 'training',
    category: 'training',
    title: 'Advanced Controls Training Completed',
    description: 'Completed 8-hour advanced controls training session with certification',
    date: new Date('2024-01-15T09:00:00'),
    duration: 480,
    outcome: 'completed',
    priority: 'medium',
    participants: ['John Mitchell', 'Sarah Johnson'],
    tags: ['training', 'certification', 'advanced-controls'],
    location: 'Training Center',
    channel: 'in-person',
    sentiment: 'positive',
    createdBy: 'Sarah Johnson',
    createdAt: new Date('2024-01-15T17:00:00'),
    updatedAt: new Date('2024-01-15T17:00:00'),
  },
  {
    id: '2',
    customerId: 'CUST-001',
    type: 'order',
    category: 'sales',
    title: 'Order #ORD-2024-001 Placed',
    description: 'Customer placed order for 3x AirMax Pro 2500 units totaling $37,500',
    date: new Date('2024-01-10T14:30:00'),
    outcome: 'completed',
    priority: 'high',
    tags: ['order', 'airmax-pro', 'large-order'],
    channel: 'system',
    sentiment: 'positive',
    relatedRecords: [
      { type: 'order', id: 'ORD-2024-001', title: 'AirMax Pro 2500 Order' }
    ],
    createdBy: 'System',
    createdAt: new Date('2024-01-10T14:30:00'),
    updatedAt: new Date('2024-01-10T14:30:00'),
  },
  {
    id: '3',
    customerId: 'CUST-001',
    type: 'call',
    category: 'sales',
    title: 'Follow-up Call - Project Requirements',
    description: 'Discussed upcoming commercial project requirements, timeline, and equipment specifications',
    date: new Date('2024-01-08T11:00:00'),
    duration: 25,
    outcome: 'positive',
    priority: 'medium',
    participants: ['John Mitchell', 'Sarah Johnson'],
    followUpRequired: true,
    followUpDate: new Date('2024-01-15T10:00:00'),
    tags: ['follow-up', 'project-planning', 'commercial'],
    channel: 'phone',
    sentiment: 'positive',
    createdBy: 'Sarah Johnson',
    createdAt: new Date('2024-01-08T11:25:00'),
    updatedAt: new Date('2024-01-08T11:25:00'),
  },
  {
    id: '4',
    customerId: 'CUST-001',
    type: 'email',
    category: 'sales',
    title: 'Product Information Sent',
    description: 'Sent technical specifications and pricing for new heat pump product line',
    date: new Date('2024-01-05T16:45:00'),
    outcome: 'neutral',
    priority: 'low',
    tags: ['product-info', 'heat-pump', 'specifications'],
    channel: 'email',
    attachments: ['heat-pump-specs.pdf', 'pricing-sheet.xlsx'],
    createdBy: 'Sarah Johnson',
    createdAt: new Date('2024-01-05T16:45:00'),
    updatedAt: new Date('2024-01-05T16:45:00'),
  },
  {
    id: '5',
    customerId: 'CUST-001',
    type: 'visit',
    category: 'sales',
    title: 'Site Visit - Commercial Assessment',
    description: 'Conducted on-site assessment for commercial HVAC project, measured spaces and evaluated existing systems',
    date: new Date('2023-12-20T10:00:00'),
    duration: 180,
    outcome: 'positive',
    priority: 'high',
    participants: ['John Mitchell', 'Sarah Johnson', 'Mike Chen'],
    tags: ['site-visit', 'assessment', 'commercial', 'hvac'],
    location: 'Customer Site - 1234 Main Street',
    channel: 'in-person',
    sentiment: 'positive',
    createdBy: 'Sarah Johnson',
    createdAt: new Date('2023-12-20T13:00:00'),
    updatedAt: new Date('2023-12-20T13:00:00'),
  },
  {
    id: '6',
    customerId: 'CUST-001',
    type: 'support',
    category: 'support',
    title: 'Technical Support - Installation Question',
    description: 'Customer called with questions about proper installation procedures for new unit',
    date: new Date('2023-12-15T14:20:00'),
    duration: 15,
    outcome: 'completed',
    priority: 'medium',
    participants: ['John Mitchell'],
    tags: ['support', 'installation', 'technical'],
    channel: 'phone',
    sentiment: 'neutral',
    createdBy: 'Tech Support',
    createdAt: new Date('2023-12-15T14:35:00'),
    updatedAt: new Date('2023-12-15T14:35:00'),
  },
  {
    id: '7',
    customerId: 'CUST-001',
    type: 'quote',
    category: 'sales',
    title: 'Quote Generated - Residential Package',
    description: 'Generated comprehensive quote for residential HVAC package including installation',
    date: new Date('2023-12-10T09:30:00'),
    outcome: 'pending',
    priority: 'medium',
    tags: ['quote', 'residential', 'package'],
    channel: 'system',
    relatedRecords: [
      { type: 'quote', id: 'QUO-2023-045', title: 'Residential HVAC Package Quote' }
    ],
    createdBy: 'Sarah Johnson',
    createdAt: new Date('2023-12-10T09:30:00'),
    updatedAt: new Date('2023-12-10T09:30:00'),
  },
  {
    id: '8',
    customerId: 'CUST-001',
    type: 'note',
    category: 'administrative',
    title: 'Customer Feedback - Service Excellence',
    description: 'Customer provided positive feedback about recent service call and technician professionalism',
    date: new Date('2023-12-05T16:00:00'),
    outcome: 'positive',
    priority: 'low',
    tags: ['feedback', 'service', 'positive', 'technician'],
    channel: 'system',
    sentiment: 'positive',
    createdBy: 'Sarah Johnson',
    createdAt: new Date('2023-12-05T16:00:00'),
    updatedAt: new Date('2023-12-05T16:00:00'),
  },
];

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-10',
    status: 'Delivered',
    items: 3,
    total: 37500,
    products: ['AirMax Pro 2500 (x3)'],
    trackingNumber: 'DYN123456789',
  },
  {
    id: 'ORD-2023-045',
    date: '2023-12-15',
    status: 'Delivered',
    items: 1,
    total: 12500,
    products: ['EcoMax 5000 Rooftop Unit'],
    trackingNumber: 'DYN987654321',
  },
  {
    id: 'ORD-2023-038',
    date: '2023-11-20',
    status: 'Delivered',
    items: 5,
    total: 8900,
    products: ['SmartControl 200 System (x5)'],
    trackingNumber: 'DYN456789123',
  },
];

// Mock training records
const mockTrainingRecords = [
  {
    id: 1,
    title: 'Advanced Controls Training',
    date: '2024-01-15',
    duration: 8,
    instructor: 'John McNutt',
    status: 'Completed',
    score: 95,
    certificate: 'CERT-2024-001',
  },
  {
    id: 2,
    title: 'Heat Pump Installation Basics',
    date: '2023-11-15',
    duration: 6,
    instructor: 'Sarah Johnson',
    status: 'Completed',
    score: 88,
    certificate: 'CERT-2023-045',
  },
  {
    id: 3,
    title: 'Energy Efficiency Best Practices',
    date: '2023-09-10',
    duration: 4,
    instructor: 'Mike Chen',
    status: 'Completed',
    score: 92,
    certificate: 'CERT-2023-032',
  },
];

// Mock documents
const mockDocuments = [
  {
    id: 1,
    name: 'Service Agreement 2024',
    type: 'Contract',
    date: '2024-01-01',
    size: '2.4 MB',
    url: '#',
  },
  {
    id: 2,
    name: 'Gold Certification',
    type: 'Certificate',
    date: '2023-12-31',
    size: '1.1 MB',
    url: '#',
  },
  {
    id: 3,
    name: 'Training Completion Records',
    type: 'Training',
    date: '2024-01-15',
    size: '856 KB',
    url: '#',
  },
];

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [newActivityOpened, { open: openNewActivity, close: closeNewActivity }] = useDisclosure(false);
  const [editCustomerOpened, { open: openEditCustomer, close: closeEditCustomer }] = useDisclosure(false);
  const [interactions, setInteractions] = useState<Interaction[]>(mockInteractions);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const getCertificationColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'gold certified': return 'yellow';
      case 'silver certified': return 'gray';
      case 'bronze certified': return 'orange';
      default: return 'blue';
    }
  };

  const handleInteractionCreate = (interaction: Omit<Interaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInteraction: Interaction = {
      ...interaction,
      id: `interaction-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setInteractions(prev => [newInteraction, ...prev]);
  };

  const handleInteractionUpdate = (id: string, updates: Partial<Interaction>) => {
    setInteractions(prev => prev.map(interaction => 
      interaction.id === id 
        ? { ...interaction, ...updates, updatedAt: new Date() }
        : interaction
    ));
  };

  const handleInteractionDelete = (id: string) => {
    setInteractions(prev => prev.filter(interaction => interaction.id !== id));
  };

  return (
    <AppLayout>
      <Container size="xl" py="md" className="residential-content-container">
        <Stack className="residential-stack-medium">
          {/* Header */}
          <PageHeader
            title={mockCustomer.companyName}
            subtitle={`Customer ID: ${mockCustomer.id}`}
            backButton={{
              href: '/customers',
              label: 'Back to Customers',
            }}
            actions={[
              {
                id: 'log-activity',
                label: 'Log Activity',
                icon: <IconPlus size={16} />,
                onClick: openNewActivity,
                priority: 'secondary',
                variant: 'outline',
              },
              {
                id: 'edit-customer',
                label: 'Edit Customer',
                icon: <IconEdit size={16} />,
                onClick: openEditCustomer,
                priority: 'primary',
                variant: 'filled',
              },
            ]}
          />

        {/* Customer Summary Card */}
        <Paper p="xl" withBorder className="residential-section">
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Group align="flex-start" className="residential-group-medium">
                <Avatar size="xl" radius="md">
                  {mockCustomer.companyName.split(' ').map(word => word[0]).join('').substring(0, 2)}
                </Avatar>
                <Stack className="residential-stack-compact" style={{ flex: 1 }}>
                  <Group className="residential-group-small">
                    <Title order={3}>{mockCustomer.companyName}</Title>
                    <Badge color={getStatusColor(mockCustomer.status)}>
                      {mockCustomer.status}
                    </Badge>
                    <Badge color={getCertificationColor(mockCustomer.certificationLevel)}>
                      {mockCustomer.certificationLevel}
                    </Badge>
                  </Group>
                  
                  <Group className="residential-group-large">
                    <Group className="residential-group-compact">
                      <IconUser size={16} />
                      <Text size="sm">{mockCustomer.contactPerson}</Text>
                    </Group>
                    <Group className="residential-group-compact">
                      <IconMail size={16} />
                      <Text size="sm">{mockCustomer.email}</Text>
                    </Group>
                    <Group className="residential-group-compact">
                      <IconPhone size={16} />
                      <Text size="sm">{mockCustomer.phone}</Text>
                    </Group>
                  </Group>
                  
                  <Group className="residential-group-compact">
                    <IconMapPin size={16} />
                    <Text size="sm" c="dimmed">{mockCustomer.address}</Text>
                  </Group>
                  
                  <Group className="residential-group-large">
                    <div>
                      <Text size="xs" c="dimmed">Territory Manager</Text>
                      <Text size="sm" fw={500}>{mockCustomer.territoryManager}</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">Affinity Group</Text>
                      <Text size="sm" fw={500}>{mockCustomer.affinityGroup}</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">Customer Since</Text>
                      <Text size="sm" fw={500}>{new Date(mockCustomer.customerSince).toLocaleDateString()}</Text>
                    </div>
                  </Group>
                </Stack>
              </Group>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack className="residential-stack-medium">
                <Card withBorder className="residential-card-content">
                  <Stack className="residential-stack-compact">
                    <Text fw={600} size="sm">Performance Metrics</Text>
                    <Group justify="space-between" className="residential-group-compact">
                      <Text size="sm" c="dimmed">Total Orders:</Text>
                      <Text size="sm" fw={600}>{mockCustomer.totalOrders}</Text>
                    </Group>
                    <Group justify="space-between" className="residential-group-compact">
                      <Text size="sm" c="dimmed">Total Revenue:</Text>
                      <Text size="sm" fw={600}>
                        <NumberFormatter
                          value={mockCustomer.totalRevenue}
                          prefix="$"
                          thousandSeparator
                        />
                      </Text>
                    </Group>
                    <Group justify="space-between" className="residential-group-compact">
                      <Text size="sm" c="dimmed">Avg Order Value:</Text>
                      <Text size="sm" fw={600}>
                        <NumberFormatter
                          value={mockCustomer.averageOrderValue}
                          prefix="$"
                          thousandSeparator
                        />
                      </Text>
                    </Group>
                    <Group justify="space-between" className="residential-group-compact">
                      <Text size="sm" c="dimmed">Last Order:</Text>
                      <Text size="sm">{new Date(mockCustomer.lastOrderDate).toLocaleDateString()}</Text>
                    </Group>
                  </Stack>
                </Card>
                
                <Card withBorder className="residential-card-content">
                  <Stack className="residential-stack-compact">
                    <Text fw={600} size="sm">Training Status</Text>
                    <Group justify="space-between" className="residential-group-compact">
                      <Text size="sm" c="dimmed">Training Hours:</Text>
                      <Text size="sm" fw={600}>{mockCustomer.trainingHours}h</Text>
                    </Group>
                    <Group justify="space-between" className="residential-group-compact">
                      <Text size="sm" c="dimmed">Last Training:</Text>
                      <Text size="sm">{new Date(mockCustomer.lastTrainingDate).toLocaleDateString()}</Text>
                    </Group>
                    <Group justify="space-between" className="residential-group-compact">
                      <Text size="sm" c="dimmed">Cert. Expires:</Text>
                      <Text size="sm">{new Date(mockCustomer.certificationExpiry).toLocaleDateString()}</Text>
                    </Group>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Quick Actions */}
        <Paper p="md" withBorder className="residential-subsection">
          <Group className="residential-button-group primary">
            <Button variant="light" leftSection={<IconPhone size={16} />}>
              Call Customer
            </Button>
            <Button variant="light" leftSection={<IconMail size={16} />}>
              Send Email
            </Button>
            <Button variant="light" leftSection={<IconCalendar size={16} />}>
              Schedule Training
            </Button>
            <Button variant="light" leftSection={<IconFileText size={16} />}>
              Create Quote
            </Button>
            <Button variant="light" leftSection={<IconMapPin size={16} />}>
              Plan Route
            </Button>
          </Group>
        </Paper>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')} style={{ overflow: 'visible' }}>
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="activities">Activities</Tabs.Tab>
            <Tabs.Tab value="orders">Orders</Tabs.Tab>
            <Tabs.Tab value="training">Training</Tabs.Tab>
            <Tabs.Tab value="documents">Documents</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Grid>
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Stack gap="md">
                  {/* Recent Activities */}
                  <Paper p="md" withBorder>
                    <Group justify="space-between" mb="md">
                      <Text fw={600}>Recent Interactions</Text>
                      <Button variant="subtle" size="sm" onClick={() => setActiveTab('activities')}>
                        View All
                      </Button>
                    </Group>
                    <div className="activity-timeline-container">
                      <Timeline>
                        {interactions.slice(0, 5).map((interaction) => {
                        const getIcon = () => {
                          switch (interaction.type) {
                            case 'call': return <IconPhone size={16} />;
                            case 'email': return <IconMail size={16} />;
                            case 'meeting': return <IconCalendar size={16} />;
                            case 'training': return <IconSchool size={16} />;
                            case 'note': return <IconNotes size={16} />;
                            case 'order': return <IconShoppingCart size={16} />;
                            case 'quote': return <IconFileText size={16} />;
                            case 'visit': return <IconMapPin size={16} />;
                            case 'support': return <IconAlertTriangle size={16} />;
                            default: return <IconCalendar size={16} />;
                          }
                        };
                        
                        return (
                          <Timeline.Item
                            key={interaction.id}
                            bullet={getIcon()}
                            title={interaction.title}
                          >
                            <Text size="sm" c="dimmed" mb={4}>
                              {interaction.description}
                            </Text>
                            <Group gap="xs" mb={4}>
                              <Badge variant="dot" size="xs">
                                {interaction.category}
                              </Badge>
                              <Badge variant="outline" size="xs">
                                {interaction.outcome}
                              </Badge>
                            </Group>
                            <Text size="xs" c="dimmed">
                              {interaction.date.toLocaleDateString()} • {interaction.createdBy}
                            </Text>
                          </Timeline.Item>
                        );
                        })}
                      </Timeline>
                    </div>
                  </Paper>

                  {/* Onboarding Progress */}
                  <Paper p="md" withBorder>
                    <Text fw={600} mb="md">Onboarding Progress</Text>
                    <Progress value={mockCustomer.onboardingProgress} mb="md" />
                    <Stack gap="xs">
                      {mockCustomer.onboardingSteps.map((step, index) => (
                        <Group key={index} justify="space-between">
                          <Group gap="xs">
                            <IconCheck size={16} color="var(--mantine-color-green-6)" />
                            <Text size="sm">{step.step}</Text>
                          </Group>
                          <Text size="xs" c="dimmed">
                            {new Date(step.date).toLocaleDateString()}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </Paper>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Stack gap="md">
                  {/* Business Information */}
                  <Paper p="md" withBorder>
                    <Text fw={600} mb="md">Business Information</Text>
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Business Type:</Text>
                        <Text size="sm">{mockCustomer.businessType}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Established:</Text>
                        <Text size="sm">{mockCustomer.yearEstablished}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Employees:</Text>
                        <Text size="sm">{mockCustomer.employeeCount}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Annual Revenue:</Text>
                        <Text size="sm">
                          <NumberFormatter
                            value={mockCustomer.annualRevenue}
                            prefix="$"
                            thousandSeparator
                          />
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Website:</Text>
                        <Text size="sm">{mockCustomer.website}</Text>
                      </Group>
                    </Stack>
                  </Paper>

                  {/* Alerts */}
                  <Alert
                    icon={<IconAlertTriangle size={16} />}
                    title="Certification Expiring Soon"
                    color="yellow"
                  >
                    Gold certification expires on {new Date(mockCustomer.certificationExpiry).toLocaleDateString()}. 
                    Schedule renewal training.
                  </Alert>
                </Stack>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="activities" pt="md">
            <InteractionTimeline
              customerId={customerId}
              interactions={interactions}
              onInteractionCreate={handleInteractionCreate}
              onInteractionUpdate={handleInteractionUpdate}
              onInteractionDelete={handleInteractionDelete}
              showAdvancedFilters={true}
            />
          </Tabs.Panel>

          <Tabs.Panel value="orders" pt="md">
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600}>Order History</Text>
                <Button leftSection={<IconPlus size={16} />}>
                  Create Order
                </Button>
              </Group>
              <div className="table-horizontal-scroll">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Order ID</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Products</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Total</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockOrders.map((order) => (
                      <Table.Tr key={order.id}>
                        <Table.Td>{order.id}</Table.Td>
                        <Table.Td>{new Date(order.date).toLocaleDateString()}</Table.Td>
                        <Table.Td className="no-truncate">
                          <Text size="sm">
                            {order.products.join(', ')}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge color="green">{order.status}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <NumberFormatter
                            value={order.total}
                            prefix="$"
                            thousandSeparator
                          />
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon variant="subtle" size="sm">
                              <IconEye size={16} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" size="sm">
                              <IconDownload size={16} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="training" pt="md">
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600}>Training Records</Text>
                <Button leftSection={<IconCalendar size={16} />}>
                  Schedule Training
                </Button>
              </Group>
              <div className="table-horizontal-scroll">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Training</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Duration</Table.Th>
                      <Table.Th>Instructor</Table.Th>
                      <Table.Th>Score</Table.Th>
                      <Table.Th>Certificate</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockTrainingRecords.map((record) => (
                      <Table.Tr key={record.id}>
                        <Table.Td className="no-truncate">{record.title}</Table.Td>
                        <Table.Td>{new Date(record.date).toLocaleDateString()}</Table.Td>
                        <Table.Td>{record.duration}h</Table.Td>
                        <Table.Td>{record.instructor}</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <IconStar size={16} color="var(--mantine-color-yellow-6)" />
                            <Text>{record.score}%</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Button variant="subtle" size="xs">
                            {record.certificate}
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="documents" pt="md">
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={600}>Documents</Text>
                <Button leftSection={<IconPlus size={16} />}>
                  Upload Document
                </Button>
              </Group>
              <div className="table-horizontal-scroll">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Document Name</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Size</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockDocuments.map((doc) => (
                      <Table.Tr key={doc.id}>
                        <Table.Td className="no-truncate">{doc.name}</Table.Td>
                        <Table.Td>
                          <Badge variant="light">{doc.type}</Badge>
                        </Table.Td>
                        <Table.Td>{new Date(doc.date).toLocaleDateString()}</Table.Td>
                        <Table.Td>{doc.size}</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon variant="subtle" size="sm">
                              <IconEye size={16} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" size="sm">
                              <IconDownload size={16} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
              </div>
            </Paper>
          </Tabs.Panel>
        </Tabs>

        {/* New Activity Modal */}
        <Modal
          opened={newActivityOpened}
          onClose={closeNewActivity}
          title="Log New Activity"
          size="md"
          styles={{
            content: {
              maxHeight: '90vh',
              overflow: 'visible',
            },
            body: {
              maxHeight: 'calc(90vh - 120px)',
              overflow: 'auto',
            },
          }}
        >
          <Stack className="residential-form">
            <Select
              label="Activity Type"
              placeholder="Select activity type"
              data={[
                'Phone Call',
                'Email',
                'Meeting',
                'Training',
                'Site Visit',
                'Follow-up',
                'Other'
              ]}
            />
            <TextInput
              label="Title"
              placeholder="Enter activity title"
            />
            <Textarea
              label="Description"
              placeholder="Describe the activity"
              minRows={3}
            />
            <DatePickerInput
              label="Date"
              placeholder="Select date"
            />
            <Group justify="flex-end" className="residential-button-group">
              <Button variant="outline" onClick={closeNewActivity}>
                Cancel
              </Button>
              <Button onClick={closeNewActivity}>
                Log Activity
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Edit Customer Modal */}
        <Modal
          opened={editCustomerOpened}
          onClose={closeEditCustomer}
          title="Edit Customer Information"
          size="lg"
          styles={{
            content: {
              maxHeight: '90vh',
              overflow: 'visible',
            },
            body: {
              maxHeight: 'calc(90vh - 120px)',
              overflow: 'auto',
            },
          }}
        >
          <Stack className="residential-form">
            <Grid className="residential-form">
              <Grid.Col span={6}>
                <TextInput
                  label="Company Name"
                  defaultValue={mockCustomer.companyName}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Contact Person"
                  defaultValue={mockCustomer.contactPerson}
                />
              </Grid.Col>
            </Grid>
            <Grid className="residential-form">
              <Grid.Col span={6}>
                <TextInput
                  label="Email"
                  defaultValue={mockCustomer.email}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Phone"
                  defaultValue={mockCustomer.phone}
                />
              </Grid.Col>
            </Grid>
            <TextInput
              label="Address"
              defaultValue={mockCustomer.address}
            />
            <Grid className="residential-form">
              <Grid.Col span={6}>
                <Select
                  label="Status"
                  defaultValue={mockCustomer.status}
                  data={['Active', 'Inactive', 'Pending']}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Territory Manager"
                  defaultValue={mockCustomer.territoryManager}
                  data={['Sarah Johnson', 'Mike Chen', 'David Rodriguez']}
                />
              </Grid.Col>
            </Grid>
            <Group justify="flex-end" className="residential-button-group">
              <Button variant="outline" onClick={closeEditCustomer}>
                Cancel
              </Button>
              <Button onClick={closeEditCustomer}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </Modal>
        </Stack>
      </Container>
    </AppLayout>
  );
}
'use client';

import { useState, useMemo } from 'react';
import {
  Container,
  Title,
  Group,
  Button,
  Tabs,
  Card,
  Stack,
  Text,
  Avatar,
  Badge,
  Grid,
  ActionIcon,
  Divider,
  Alert,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconEdit,
  IconPhone,
  IconMail,
  IconMapPin,
  IconBuilding,
  IconUsers,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import { CustomerOverview } from './CustomerOverview';
import { CustomerActivities } from './CustomerActivities';
import { CustomerOrders } from './CustomerOrders';
import { CustomerTraining } from './CustomerTraining';
import Link from 'next/link';

interface CustomerDetailProps {
  customerId: string;
}

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const { customers, users, territories, affinityGroups, ownershipGroups } = useMockData();
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  const customer = useMemo(() => {
    return customers.find(c => c.id === customerId);
  }, [customers, customerId]);

  const territoryManager = useMemo(() => {
    if (!customer) return null;
    return users.find(u => u.id === customer.territoryManagerId);
  }, [users, customer]);

  const territory = useMemo(() => {
    if (!customer) return null;
    return territories.find(t => `tm-${t.id}` === customer.territoryManagerId);
  }, [territories, customer]);

  const affinityGroup = useMemo(() => {
    if (!customer?.affinityGroupId) return null;
    return affinityGroups.find(ag => ag.id === customer.affinityGroupId);
  }, [affinityGroups, customer]);

  const ownershipGroup = useMemo(() => {
    if (!customer?.ownershipGroupId) return null;
    return ownershipGroups.find(og => og.id === customer.ownershipGroupId);
  }, [ownershipGroups, customer]);

  if (!customer) {
    return (
      <Container size="xl">
        <Alert icon={<IconInfoCircle size={16} />} title="Customer Not Found" color="red">
          The customer you're looking for doesn't exist or may have been removed.
        </Alert>
      </Container>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'green',
      inactive: 'gray',
      prospect: 'blue',
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  const getOnboardingStatusColor = (status: string) => {
    const colors = {
      not_started: 'gray',
      in_progress: 'yellow',
      completed: 'green',
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  const getOnboardingStatusLabel = (status: string) => {
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      completed: 'Completed',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Group>
            <ActionIcon
              variant="subtle"
              component={Link}
              href="/customers"
              size="lg"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <div>
              <Title order={1}>{customer.companyName}</Title>
              <Text c="dimmed" size="lg">
                Customer Details
              </Text>
            </div>
          </Group>
          <Group>
            <Button variant="light" leftSection={<IconPhone size={16} />}>
              Call
            </Button>
            <Button variant="light" leftSection={<IconMail size={16} />}>
              Email
            </Button>
            <Button leftSection={<IconEdit size={16} />}>
              Edit Customer
            </Button>
          </Group>
        </Group>

        {/* Customer Summary Card */}
        <Card withBorder p="lg">
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Group gap="lg">
                <Avatar size={80} radius="md" color="blue">
                  {customer.companyName.charAt(0)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Group gap="md" mb="sm">
                    <Title order={2}>{customer.companyName}</Title>
                    <Badge color={getStatusColor(customer.status)} variant="light">
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </Badge>
                    <Badge color={getOnboardingStatusColor(customer.onboardingStatus)} variant="light">
                      {getOnboardingStatusLabel(customer.onboardingStatus)}
                    </Badge>
                  </Group>
                  
                  <Stack gap="xs">
                    <Group gap="sm">
                      <IconUsers size={16} />
                      <Text size="sm">
                        <strong>Contact:</strong> {customer.contactName}
                      </Text>
                    </Group>
                    <Group gap="sm">
                      <IconMail size={16} />
                      <Text size="sm">{customer.email}</Text>
                    </Group>
                    <Group gap="sm">
                      <IconPhone size={16} />
                      <Text size="sm">{customer.phone}</Text>
                    </Group>
                    <Group gap="sm">
                      <IconMapPin size={16} />
                      <Text size="sm">
                        {customer.address.street}, {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                      </Text>
                    </Group>
                  </Stack>
                </div>
              </Group>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                <div>
                  <Text size="sm" c="dimmed" mb={4}>Territory Manager</Text>
                  <Text fw={500}>
                    {territoryManager ? `${territoryManager.firstName} ${territoryManager.lastName}` : 'Unknown'}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {territory?.name || 'Unknown Territory'}
                  </Text>
                </div>
                
                <Divider />
                
                <div>
                  <Text size="sm" c="dimmed" mb={4}>Total Revenue</Text>
                  <Text size="xl" fw={700} c="green">
                    {formatCurrency(customer.totalRevenue)}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {customer.totalOrders} orders
                  </Text>
                </div>
                
                <Divider />
                
                <div>
                  <Text size="sm" c="dimmed" mb={4}>Last Contact</Text>
                  <Text fw={500}>
                    {formatDate(customer.lastContactDate)}
                  </Text>
                </div>

                {(affinityGroup || ownershipGroup) && (
                  <>
                    <Divider />
                    <div>
                      <Text size="sm" c="dimmed" mb={4}>Groups</Text>
                      <Stack gap="xs">
                        {affinityGroup && (
                          <Group gap="sm">
                            <IconBuilding size={14} />
                            <Text size="sm">{affinityGroup.name}</Text>
                          </Group>
                        )}
                        {ownershipGroup && (
                          <Group gap="sm">
                            <IconUsers size={14} />
                            <Text size="sm">{ownershipGroup.name}</Text>
                          </Group>
                        )}
                      </Stack>
                    </div>
                  </>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="activities">Activities</Tabs.Tab>
            <Tabs.Tab value="orders">Orders</Tabs.Tab>
            <Tabs.Tab value="training">Training</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="lg">
            <CustomerOverview customer={customer} />
          </Tabs.Panel>

          <Tabs.Panel value="activities" pt="lg">
            <CustomerActivities customerId={customer.id} />
          </Tabs.Panel>

          <Tabs.Panel value="orders" pt="lg">
            <CustomerOrders customerId={customer.id} />
          </Tabs.Panel>

          <Tabs.Panel value="training" pt="lg">
            <CustomerTraining customerId={customer.id} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
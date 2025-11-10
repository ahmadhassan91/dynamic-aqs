'use client';

import { useState, useMemo } from 'react';
import {
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Table,
  Badge,
  ActionIcon,
  Pagination,
  Card,
  Stack,
  Text,
  Avatar,
  Tooltip,
  Menu,
  rem,
} from '@mantine/core';
import {
  IconSearch,
  IconPlus,
  IconEye,
  IconEdit,
  IconDots,
  IconPhone,
  IconMail,
  IconMapPin,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import type { MockCustomer } from '@/lib/mockData/generators';
import { CustomerFormModal } from './CustomerFormModal';
import Link from 'next/link';

const ITEMS_PER_PAGE = 20;

function CustomerStatusBadge({ status }: { status: MockCustomer['status'] }) {
  const colors = {
    active: 'green',
    inactive: 'gray',
    prospect: 'blue',
  };

  return (
    <Badge color={colors[status]} variant="light">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function OnboardingStatusBadge({ status }: { status: MockCustomer['onboardingStatus'] }) {
  const colors = {
    not_started: 'gray',
    in_progress: 'yellow',
    completed: 'green',
  };

  const labels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
  };

  return (
    <Badge color={colors[status]} variant="light" size="sm">
      {labels[status]}
    </Badge>
  );
}

export function CustomerList() {
  const { customers, territories, users } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [territoryFilter, setTerritoryFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerModalOpened, setCustomerModalOpened] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<MockCustomer | undefined>();

  // Get territory managers for filter
  const territoryManagers = users.filter(user => user.role === 'territory_manager');

  // Filter customers based on search and filters
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = !searchQuery || 
        customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || customer.status === statusFilter;
      
      const matchesTerritory = !territoryFilter || customer.territoryManagerId === territoryFilter;

      return matchesSearch && matchesStatus && matchesTerritory;
    });
  }, [customers, searchQuery, statusFilter, territoryFilter]);

  // Paginate results
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get territory manager name
  const getTerritoryManagerName = (managerId: string) => {
    const manager = territoryManagers.find(tm => tm.id === managerId);
    return manager ? `${manager.firstName} ${manager.lastName}` : 'Unknown';
  };

  // Get territory name
  const getTerritoryName = (managerId: string) => {
    const territory = territories.find(t => `tm-${t.id}` === managerId);
    return territory?.name || 'Unknown';
  };

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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleSaveCustomer = (customerData: Partial<MockCustomer>) => {
    // In a real app, this would make an API call to save the customer
    console.log('Saving customer:', customerData);
    // For now, just close the modal
    setCustomerModalOpened(false);
    setEditingCustomer(undefined);
  };

  return (
    <div className="residential-content-container">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Customers</Title>
            <Text c="dimmed" size="lg">
              Manage your customer relationships and accounts
            </Text>
          </div>
          <Button 
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setEditingCustomer(undefined);
              setCustomerModalOpened(true);
            }}
          >
            Add Customer
          </Button>
        </Group>

        {/* Filters */}
        <Card withBorder p="md">
          <Group gap="md">
            <TextInput
              placeholder="Search customers..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Status"
              data={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'prospect', label: 'Prospect' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
              w={150}
            />
            <Select
              placeholder="Territory"
              data={territoryManagers.map(tm => ({
                value: tm.id,
                label: getTerritoryName(tm.id),
              }))}
              value={territoryFilter}
              onChange={setTerritoryFilter}
              clearable
              w={200}
            />
          </Group>
        </Card>

        {/* Results Summary */}
        <Text size="sm" c="dimmed">
          Showing {paginatedCustomers.length} of {filteredCustomers.length} customers
        </Text>

        {/* Customer Table */}
        <Card withBorder p={0}>
          <Table.ScrollContainer minWidth={1000}>
            <Table verticalSpacing="sm" horizontalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Customer</Table.Th>
                  <Table.Th>Contact Info</Table.Th>
                  <Table.Th>Territory</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Onboarding</Table.Th>
                  <Table.Th>Revenue</Table.Th>
                  <Table.Th>Last Contact</Table.Th>
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
                      <Stack gap={2}>
                        <Group gap={4}>
                          <IconMail size={12} />
                          <Text size="xs">{customer.email}</Text>
                        </Group>
                        <Group gap={4}>
                          <IconPhone size={12} />
                          <Text size="xs">{customer.phone}</Text>
                        </Group>
                        <Group gap={4}>
                          <IconMapPin size={12} />
                          <Text size="xs">
                            {customer.address.city}, {customer.address.state}
                          </Text>
                        </Group>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={500}>
                          {getTerritoryName(customer.territoryManagerId)}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {getTerritoryManagerName(customer.territoryManagerId)}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <CustomerStatusBadge status={customer.status} />
                    </Table.Td>
                    <Table.Td>
                      <OnboardingStatusBadge status={customer.onboardingStatus} />
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={500}>
                          {formatCurrency(customer.totalRevenue)}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {customer.totalOrders} orders
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {formatDate(customer.lastContactDate)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <Tooltip label="View Details">
                          <ActionIcon
                            variant="subtle"
                            component={Link}
                            href={`/customers/${customer.id}`}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Menu position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                              onClick={() => {
                                setEditingCustomer(customer);
                                setCustomerModalOpened(true);
                              }}
                            >
                              Edit Customer
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconPhone style={{ width: rem(14), height: rem(14) }} />}
                            >
                              Call Customer
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconMail style={{ width: rem(14), height: rem(14) }} />}
                            >
                              Send Email
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Group justify="center">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
            />
          </Group>
        )}
      </Stack>

      <CustomerFormModal
        opened={customerModalOpened}
        onClose={() => {
          setCustomerModalOpened(false);
          setEditingCustomer(undefined);
        }}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
      />
    </div>
  );
}
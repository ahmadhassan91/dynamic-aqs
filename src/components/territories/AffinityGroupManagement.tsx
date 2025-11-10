'use client';

import { useState, useMemo } from 'react';
import {
  Grid,
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Avatar,
  Button,
  TextInput,
  Select,
  ActionIcon,
  Modal,
  Tooltip,
  Table,
  Checkbox,
  ScrollArea,
} from '@mantine/core';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconUsers,
  IconBuilding,
  IconChevronRight,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import type { MockCustomer } from '@/lib/mockData/generators';

interface AffinityGroupCardProps {
  group: { id: string; name: string };
  customers: MockCustomer[];
  onEdit: () => void;
  onDelete: () => void;
  onManageCustomers: () => void;
}

function AffinityGroupCard({ group, customers, onEdit, onDelete, onManageCustomers }: AffinityGroupCardProps) {
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalRevenue, 0);
  const activeCustomers = customers.filter(c => c.status === 'active').length;

  return (
    <Card withBorder>
      <Stack gap="md">
        {/* Group Header */}
        <Group justify="space-between">
          <div>
            <Title order={4}>{group.name}</Title>
            <Text size="sm" c="dimmed">
              Affinity Group
            </Text>
          </div>
          <Group gap="xs">
            <Tooltip label="Edit Group">
              <ActionIcon variant="subtle" onClick={onEdit}>
                <IconEdit size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete Group">
              <ActionIcon variant="subtle" color="red" onClick={onDelete}>
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        {/* Group Stats */}
        <Group gap="lg">
          <div>
            <Text size="xs" c="dimmed">Total Customers</Text>
            <Text fw={500} size="lg">{customers.length}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Active Customers</Text>
            <Text fw={500} size="lg" c="green">{activeCustomers}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Total Revenue</Text>
            <Text fw={500} size="lg">
              ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Text>
          </div>
        </Group>

        {/* Recent Customers */}
        <div>
          <Text size="sm" fw={500} mb="xs">Recent Customers</Text>
          <Stack gap="xs">
            {customers.slice(0, 3).map((customer) => (
              <Group key={customer.id} gap="sm">
                <Avatar size={24} radius="xl" color="blue">
                  {customer.companyName.charAt(0)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text size="sm">{customer.companyName}</Text>
                  <Text size="xs" c="dimmed">{customer.contactName}</Text>
                </div>
                <Badge size="sm" color={customer.status === 'active' ? 'green' : 'gray'}>
                  {customer.status}
                </Badge>
              </Group>
            ))}
            {customers.length > 3 && (
              <Text size="xs" c="dimmed">
                +{customers.length - 3} more customers
              </Text>
            )}
          </Stack>
        </div>

        {/* Actions */}
        <Button
          variant="light"
          leftSection={<IconUsers size={16} />}
          rightSection={<IconChevronRight size={16} />}
          onClick={onManageCustomers}
          fullWidth
        >
          Manage Customers ({customers.length})
        </Button>
      </Stack>
    </Card>
  );
}

interface CustomerSelectionModalProps {
  opened: boolean;
  onClose: () => void;
  group: { id: string; name: string } | null;
  customers: MockCustomer[];
  selectedCustomers: string[];
  onSelectionChange: (customerIds: string[]) => void;
  onSave: () => void;
}

function CustomerSelectionModal({
  opened,
  onClose,
  group,
  customers,
  selectedCustomers,
  onSelectionChange,
  onSave,
}: CustomerSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchQuery || 
      customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredCustomers.map(c => c.id));
    }
  };

  const handleCustomerToggle = (customerId: string) => {
    if (selectedCustomers.includes(customerId)) {
      onSelectionChange(selectedCustomers.filter(id => id !== customerId));
    } else {
      onSelectionChange([...selectedCustomers, customerId]);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={`Manage Customers - ${group?.name}`} size="xl">
      <Stack gap="md">
        {/* Filters */}
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
        </Group>

        {/* Customer Table */}
        <ScrollArea h={400}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Checkbox
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < filteredCustomers.length}
                    onChange={handleSelectAll}
                  />
                </Table.Th>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Revenue</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredCustomers.map((customer) => (
                <Table.Tr key={customer.id}>
                  <Table.Td>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleCustomerToggle(customer.id)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar size={32} radius="xl" color="blue">
                        {customer.companyName.charAt(0)}
                      </Avatar>
                      <div>
                        <Text fw={500} size="sm">{customer.companyName}</Text>
                        <Text size="xs" c="dimmed">
                          {customer.address.city}, {customer.address.state}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Text size="sm">{customer.contactName}</Text>
                      <Text size="xs" c="dimmed">{customer.email}</Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={customer.status === 'active' ? 'green' : customer.status === 'prospect' ? 'blue' : 'gray'}>
                      {customer.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>
                      ${customer.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        {/* Actions */}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {selectedCustomers.length} of {filteredCustomers.length} customers selected
          </Text>
          <Group>
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              Save Changes
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
}

export function AffinityGroupManagement() {
  const { customers, affinityGroups } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGroup, setEditingGroup] = useState<{ id: string; name: string } | null>(null);
  const [managingGroup, setManagingGroup] = useState<{ id: string; name: string } | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [manageOpened, { open: openManage, close: closeManage }] = useDisclosure(false);

  // Group customers by affinity group
  const customersByGroup = useMemo(() => {
    const grouped: Record<string, MockCustomer[]> = {};
    
    affinityGroups.forEach(group => {
      const groupCustomers = customers.filter(customer => 
        customer.affinityGroupId === group.id &&
        (!searchQuery || 
          customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      grouped[group.id] = groupCustomers;
    });
    
    return grouped;
  }, [customers, affinityGroups, searchQuery]);

  const handleEditGroup = (group: { id: string; name: string }) => {
    setEditingGroup(group);
    openEdit();
  };

  const handleDeleteGroup = (groupId: string) => {
    notifications.show({
      title: 'Group Deleted',
      message: 'Affinity group has been deleted',
      color: 'red',
    });
  };

  const handleManageCustomers = (group: { id: string; name: string }) => {
    setManagingGroup(group);
    const groupCustomers = customersByGroup[group.id] || [];
    setSelectedCustomers(groupCustomers.map(c => c.id));
    openManage();
  };

  const handleSaveCustomers = () => {
    notifications.show({
      title: 'Customers Updated',
      message: 'Customer assignments have been updated',
      color: 'green',
    });
    closeManage();
  };

  const handleCreateGroup = () => {
    notifications.show({
      title: 'Group Created',
      message: 'New affinity group has been created',
      color: 'green',
    });
  };

  return (
    <Stack gap="lg">
      {/* Controls */}
      <Card withBorder p="md">
        <Group justify="space-between">
          <TextInput
            placeholder="Search affinity groups..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            style={{ flex: 1, maxWidth: 400 }}
          />
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreateGroup}>
            Create Affinity Group
          </Button>
        </Group>
      </Card>

      {/* Groups Grid */}
      <Grid>
        {affinityGroups.map((group) => (
          <Grid.Col key={group.id} span={{ base: 12, md: 6, lg: 4 }}>
            <AffinityGroupCard
              group={group}
              customers={customersByGroup[group.id] || []}
              onEdit={() => handleEditGroup(group)}
              onDelete={() => handleDeleteGroup(group.id)}
              onManageCustomers={() => handleManageCustomers(group)}
            />
          </Grid.Col>
        ))}
      </Grid>

      {/* Edit Group Modal */}
      <Modal opened={editOpened} onClose={closeEdit} title="Edit Affinity Group">
        <Stack gap="md">
          <TextInput
            label="Group Name"
            value={editingGroup?.name || ''}
            onChange={() => {}}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeEdit}>
              Cancel
            </Button>
            <Button onClick={closeEdit}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Manage Customers Modal */}
      <CustomerSelectionModal
        opened={manageOpened}
        onClose={closeManage}
        group={managingGroup}
        customers={customers}
        selectedCustomers={selectedCustomers}
        onSelectionChange={setSelectedCustomers}
        onSave={handleSaveCustomers}
      />
    </Stack>
  );
}
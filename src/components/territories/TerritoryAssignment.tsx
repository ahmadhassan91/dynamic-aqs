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
  Alert,
  ScrollArea,
} from '@mantine/core';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconUsers,
  IconMapPin,
  IconInfoCircle,
  IconGripVertical,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import type { MockCustomer, MockUser } from '@/lib/mockData/generators';
import { CustomerFormModal } from '@/components/customers/CustomerFormModal';

interface SortableCustomerProps {
  customer: MockCustomer;
  territoryManagerName: string;
  onEdit: (customer: MockCustomer) => void;
  onRemove: (customerId: string) => void;
}

function SortableCustomer({ customer, territoryManagerName, onEdit, onRemove }: SortableCustomerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: customer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card withBorder p="sm" mb="xs">
        <Group justify="space-between">
          <Group gap="sm">
            <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
              <IconGripVertical size={16} color="gray" />
            </div>
            <Avatar size={32} radius="xl" color="blue">
              {customer.companyName.charAt(0)}
            </Avatar>
            <div>
              <Text fw={500} size="sm">
                {customer.companyName}
              </Text>
              <Text size="xs" c="dimmed">
                {customer.contactName} • {customer.address.city}, {customer.address.state}
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            <Badge color={customer.status === 'active' ? 'green' : customer.status === 'prospect' ? 'blue' : 'gray'} size="sm">
              {customer.status}
            </Badge>
            <Tooltip label="Edit Assignment">
              <ActionIcon variant="subtle" size="sm" onClick={() => onEdit(customer)}>
                <IconEdit size={14} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Remove from Territory">
              <ActionIcon variant="subtle" size="sm" color="red" onClick={() => onRemove(customer.id)}>
                <IconTrash size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Card>
    </div>
  );
}

interface TerritoryCardProps {
  territory: { id: string; name: string; regionId: string };
  manager: MockUser;
  customers: MockCustomer[];
  onCustomerEdit: (customer: MockCustomer) => void;
  onCustomerRemove: (customerId: string, territoryId: string) => void;
  onCustomersReorder: (territoryId: string, customerIds: string[]) => void;
  onAddCustomer: (territoryId: string) => void;
}

function DroppableTerritoryCard({
  territory,
  manager,
  customers,
  onCustomerEdit,
  onCustomerRemove,
  onCustomersReorder,
  onAddCustomer
}: TerritoryCardProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: territory.id,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = customers.findIndex(c => c.id === active.id);
      const newIndex = customers.findIndex(c => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(customers, oldIndex, newIndex);
        onCustomersReorder(territory.id, newOrder.map(c => c.id));
      }
    }
  };

  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalRevenue, 0);
  const activeCustomers = customers.filter(c => c.status === 'active').length;

  return (
    <Card 
      ref={setNodeRef}
      withBorder 
      h="600px"
      style={{
        backgroundColor: isOver ? 'var(--mantine-color-blue-0)' : 'var(--mantine-color-gray-0)',
        border: isOver ? '2px dashed var(--mantine-color-blue-4)' : '1px solid var(--mantine-color-gray-3)',
        transition: 'all 0.2s ease',
      }}
    >
      <Stack gap="md" h="100%">
        {/* Territory Header */}
        <div>
          <Group justify="space-between" mb="xs">
            <Title order={4}>{territory.name}</Title>
            <Group gap="xs">
              <ActionIcon variant="subtle" size="sm">
                <IconEdit size={14} />
              </ActionIcon>
            </Group>
          </Group>

          <Group gap="sm" mb="md">
            <Avatar size={24} radius="xl" color="blue">
              {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
            </Avatar>
            <Text size="sm" fw={500}>
              {manager.firstName} {manager.lastName}
            </Text>
          </Group>

          {/* Territory Stats */}
          <Group gap="lg" mb="md">
            <div>
              <Text size="xs" c="dimmed">Customers</Text>
              <Text fw={500}>{customers.length}</Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">Active</Text>
              <Text fw={500} c="green">{activeCustomers}</Text>
            </div>
            <div>
              <Text size="xs" c="dimmed">Revenue</Text>
              <Text fw={500}>
                ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </Text>
            </div>
          </Group>
        </div>

        {/* Customer List */}
        <ScrollArea flex={1}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={customers.map(c => c.id)} strategy={verticalListSortingStrategy}>
              {customers.map((customer) => (
                <SortableCustomer
                  key={customer.id}
                  customer={customer}
                  territoryManagerName={`${manager.firstName} ${manager.lastName}`}
                  onEdit={onCustomerEdit}
                  onRemove={(customerId) => onCustomerRemove(customerId, territory.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          {customers.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              No customers assigned to this territory
            </Text>
          )}
        </ScrollArea>

        {/* Add Customer Button */}
        <Button variant="light" leftSection={<IconPlus size={16} />} fullWidth onClick={() => onAddCustomer(territory.id)}>
          Add Customer
        </Button>
      </Stack>
    </Card>
  );
}

export function TerritoryAssignment() {
  const { customers, territories, users } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<MockCustomer | null>(null);
  const [draggedCustomer, setDraggedCustomer] = useState<MockCustomer | null>(null);
  const [customerAssignments, setCustomerAssignments] = useState<Record<string, string>>({});
  const [opened, { open, close }] = useDisclosure(false);
  const [addCustomerOpened, { open: openAddCustomer, close: closeAddCustomer }] = useDisclosure(false);
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(null);

  // Get territory managers
  const territoryManagers = users.filter(user => user.role === 'territory_manager');

  // Get regions for filter
  const regions = [
    { id: '1', name: 'Eastern Region' },
    { id: '2', name: 'Central Region' },
    { id: '3', name: 'Western Region' },
  ];

  // Filter territories by region
  const filteredTerritories = territories.filter(territory =>
    !selectedRegion || territory.regionId === selectedRegion
  );

  // Initialize customer assignments
  useMemo(() => {
    const assignments: Record<string, string> = {};
    customers.forEach(customer => {
      const territoryId = customer.territoryManagerId?.replace('tm-', '') || '';
      assignments[customer.id] = territoryId;
    });
    setCustomerAssignments(assignments);
  }, [customers]);

  // Group customers by territory
  const customersByTerritory = useMemo(() => {
    const grouped: Record<string, MockCustomer[]> = {};

    filteredTerritories.forEach(territory => {
      const territoryCustomers = customers.filter(customer => {
        const assignedTerritory = customerAssignments[customer.id] || customer.territoryManagerId?.replace('tm-', '');
        return assignedTerritory === territory.id &&
          (!searchQuery ||
            customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.contactName.toLowerCase().includes(searchQuery.toLowerCase())
          );
      });
      grouped[territory.id] = territoryCustomers;
    });

    return grouped;
  }, [customers, filteredTerritories, searchQuery, customerAssignments]);

  const handleCustomerEdit = (customer: MockCustomer) => {
    setEditingCustomer(customer);
    open();
  };

  const handleDragStart = (event: DragStartEvent) => {
    const customer = customers.find(c => c.id === event.active.id);
    setDraggedCustomer(customer || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dragging over a territory
    const overTerritory = filteredTerritories.find(t => t.id === overId);
    if (overTerritory) {
      setCustomerAssignments(prev => ({
        ...prev,
        [activeId]: overId,
      }));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedCustomer(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dropping on a territory
    const overTerritory = filteredTerritories.find(t => t.id === overId);
    if (overTerritory) {
      const customer = customers.find(c => c.id === activeId);
      if (customer) {
        notifications.show({
          title: 'Customer Reassigned',
          message: `${customer.companyName} has been assigned to ${overTerritory.name}`,
          color: 'green',
        });
      }
    }
  };

  const handleCustomerRemove = (customerId: string, territoryId: string) => {
    setCustomerAssignments(prev => ({
      ...prev,
      [customerId]: '', // Unassign customer
    }));
    notifications.show({
      title: 'Customer Removed',
      message: 'Customer has been removed from the territory',
      color: 'blue',
    });
  };

  const handleCustomersReorder = (territoryId: string, customerIds: string[]) => {
    // In a real app, this would update the backend
    notifications.show({
      title: 'Order Updated',
      message: 'Customer order has been updated',
      color: 'green',
    });
  };

  const handleBulkTransfer = () => {
    notifications.show({
      title: 'Bulk Transfer',
      message: 'Bulk customer transfer functionality would be implemented here',
      color: 'blue',
    });
  };

  const handleAddCustomer = (territoryId: string) => {
    setSelectedTerritoryId(territoryId);
    openAddCustomer();
  };

  const handleSaveNewCustomer = (customerData: Partial<MockCustomer>) => {
    // Assign the customer to the selected territory
    if (selectedTerritoryId) {
      const manager = territoryManagers.find(tm => tm.id === `tm-${selectedTerritoryId}`);
      if (manager) {
        customerData.territoryManagerId = manager.id;
      }
    }
    notifications.show({
      title: 'Customer Added',
      message: `Customer has been added to the territory`,
      color: 'green',
    });
    closeAddCustomer();
  };

  return (
    <Stack gap="lg">
      {/* Controls */}
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
            placeholder="Filter by Region"
            data={regions.map(region => ({ value: region.id, label: region.name }))}
            value={selectedRegion}
            onChange={setSelectedRegion}
            clearable
            w={200}
          />
          <Button variant="light" leftSection={<IconUsers size={16} />} onClick={handleBulkTransfer}>
            Bulk Transfer
          </Button>
        </Group>
      </Card>

      {/* Info Alert */}
      <Alert icon={<IconInfoCircle size={16} />} title="Drag & Drop" color="blue">
        Drag customers between territories to reassign them. You can also reorder customers within territories.
      </Alert>

      {/* Territory Grid with Drag and Drop */}
      <DndContext
        sensors={useSensors(
          useSensor(PointerSensor),
          useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
          })
        )}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Grid>
          {filteredTerritories.map((territory) => {
            const manager = territoryManagers.find(tm => tm.id === `tm-${territory.id}`);
            if (!manager) return null;

            return (
              <Grid.Col key={territory.id} span={{ base: 12, md: 6, lg: 4 }}>
                <DroppableTerritoryCard
                  territory={territory}
                  manager={manager}
                  customers={customersByTerritory[territory.id] || []}
                  onCustomerEdit={handleCustomerEdit}
                  onCustomerRemove={handleCustomerRemove}
                  onCustomersReorder={handleCustomersReorder}
                  onAddCustomer={handleAddCustomer}
                />
              </Grid.Col>
            );
          })}
        </Grid>
      </DndContext>

      {/* Edit Customer Modal */}
      <Modal opened={opened} onClose={close} title="Edit Customer Assignment" size="md">
        {editingCustomer && (
          <Stack gap="md">
            <Text>
              <strong>Customer:</strong> {editingCustomer.companyName}
            </Text>
            <Text>
              <strong>Contact:</strong> {editingCustomer.contactName}
            </Text>
            <Select
              label="Territory Manager"
              data={territoryManagers.map(tm => ({
                value: tm.id,
                label: `${tm.firstName} ${tm.lastName}`,
              }))}
              value={editingCustomer.territoryManagerId}
            />
            <Group justify="flex-end">
              <Button variant="light" onClick={close}>
                Cancel
              </Button>
              <Button onClick={close}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Add Customer Modal */}
      <CustomerFormModal
        opened={addCustomerOpened}
        onClose={closeAddCustomer}
        onSave={handleSaveNewCustomer}
      />
    </Stack>
  );
}
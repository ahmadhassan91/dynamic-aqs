'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Stack,
  Group,
  Text,
  Title,
  Button,
  Checkbox,
  Select,
  TextInput,
  Modal,
  Badge,
  Alert,
  Progress,
  Table,
  ScrollArea,
  ActionIcon,
  Tooltip,
  Stepper,
  Divider,
  Tabs,
  MultiSelect,
} from '@mantine/core';
import {
  IconUsers,
  IconTransfer,
  IconTrash,
  IconEdit,
  IconDownload,
  IconUpload,
  IconSearch,
  IconFilter,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconHistory,
  IconRestore,
  IconSettings,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import type { MockCustomer, MockUser } from '@/lib/mockData/generators';

interface BulkOperation {
  id: string;
  type: 'transfer' | 'restructure' | 'merge' | 'split';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  description: string;
  affectedCustomers: number;
  sourceTerritory?: string;
  targetTerritory?: string;
  createdAt: Date;
  completedAt?: Date;
  createdBy: string;
  progress: number;
  errors?: string[];
}

interface TerritoryRestructure {
  operation: 'merge' | 'split' | 'boundary_change';
  sourceIds: string[];
  targetConfig: {
    name: string;
    managerId: string;
    boundaries?: Array<{ lat: number; lng: number }>;
  }[];
  customerReassignments: Array<{
    customerId: string;
    fromTerritory: string;
    toTerritory: string;
  }>;
}

export function BulkTerritoryOperations() {
  const { customers, territories, users } = useMockData();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterTerritory, setFilterTerritory] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [currentOperation, setCurrentOperation] = useState<BulkOperation | null>(null);
  
  // Modal states
  const [transferModalOpened, { open: openTransferModal, close: closeTransferModal }] = useDisclosure(false);
  const [restructureModalOpened, { open: openRestructureModal, close: closeRestructureModal }] = useDisclosure(false);
  const [historyModalOpened, { open: openHistoryModal, close: closeHistoryModal }] = useDisclosure(false);

  const territoryManagers = users.filter(user => user.role === 'territory_manager');

  // Filter customers based on search and filters
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = !searchQuery || 
        customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.contactName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !filterStatus || customer.status === filterStatus;
      
      const matchesTerritory = !filterTerritory || 
        customer.territoryManagerId === `tm-${filterTerritory}`;

      return matchesSearch && matchesStatus && matchesTerritory;
    });
  }, [customers, searchQuery, filterStatus, filterTerritory]);

  // Mock bulk operations history
  useMemo(() => {
    const mockOperations: BulkOperation[] = [
      {
        id: '1',
        type: 'transfer',
        status: 'completed',
        description: 'Transferred 15 customers from Territory A to Territory B',
        affectedCustomers: 15,
        sourceTerritory: 'Territory A',
        targetTerritory: 'Territory B',
        createdAt: new Date(Date.now() - 86400000 * 2),
        completedAt: new Date(Date.now() - 86400000 * 2 + 3600000),
        createdBy: 'John Smith',
        progress: 100,
      },
      {
        id: '2',
        type: 'restructure',
        status: 'in_progress',
        description: 'Merging Territory C and Territory D',
        affectedCustomers: 32,
        createdAt: new Date(Date.now() - 3600000),
        createdBy: 'Jane Doe',
        progress: 65,
      },
      {
        id: '3',
        type: 'transfer',
        status: 'failed',
        description: 'Bulk transfer operation failed due to validation errors',
        affectedCustomers: 8,
        sourceTerritory: 'Territory E',
        targetTerritory: 'Territory F',
        createdAt: new Date(Date.now() - 7200000),
        createdBy: 'Mike Johnson',
        progress: 0,
        errors: ['Invalid customer assignments', 'Territory capacity exceeded'],
      },
    ];
    setBulkOperations(mockOperations);
  }, []);

  const handleSelectAllCustomers = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleCustomerSelect = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleBulkTransfer = (targetTerritoryId: string) => {
    const newOperation: BulkOperation = {
      id: Date.now().toString(),
      type: 'transfer',
      status: 'in_progress',
      description: `Transferring ${selectedCustomers.length} customers to new territory`,
      affectedCustomers: selectedCustomers.length,
      targetTerritory: territories.find(t => t.id === targetTerritoryId)?.name,
      createdAt: new Date(),
      createdBy: 'Current User',
      progress: 0,
    };

    setBulkOperations(prev => [newOperation, ...prev]);
    setCurrentOperation(newOperation);

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setBulkOperations(prev => 
          prev.map(op => 
            op.id === newOperation.id 
              ? { ...op, status: 'completed', progress: 100, completedAt: new Date() }
              : op
          )
        );
        notifications.show({
          title: 'Transfer Complete',
          message: `Successfully transferred ${selectedCustomers.length} customers`,
          color: 'green',
        });
        setSelectedCustomers([]);
        closeTransferModal();
      } else {
        setBulkOperations(prev => 
          prev.map(op => 
            op.id === newOperation.id 
              ? { ...op, progress }
              : op
          )
        );
      }
    }, 500);
  };

  const handleTerritoryRestructure = (restructureConfig: TerritoryRestructure) => {
    const newOperation: BulkOperation = {
      id: Date.now().toString(),
      type: 'restructure',
      status: 'in_progress',
      description: `Territory ${restructureConfig.operation}: ${restructureConfig.sourceIds.length} territories affected`,
      affectedCustomers: restructureConfig.customerReassignments.length,
      createdAt: new Date(),
      createdBy: 'Current User',
      progress: 0,
    };

    setBulkOperations(prev => [newOperation, ...prev]);
    
    notifications.show({
      title: 'Restructure Started',
      message: 'Territory restructuring operation has been initiated',
      color: 'blue',
    });
    
    closeRestructureModal();
  };

  const handleDeleteOperation = (operationId: string) => {
    setBulkOperations(prev => prev.filter(op => op.id !== operationId));
    notifications.show({
      title: 'Operation Deleted',
      message: 'Bulk operation has been removed from history',
      color: 'red',
    });
  };

  const handleRetryOperation = (operationId: string) => {
    setBulkOperations(prev => 
      prev.map(op => 
        op.id === operationId 
          ? { ...op, status: 'pending', progress: 0, errors: undefined }
          : op
      )
    );
    notifications.show({
      title: 'Operation Queued',
      message: 'Operation has been queued for retry',
      color: 'blue',
    });
  };

  const getStatusColor = (status: BulkOperation['status']) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getOperationIcon = (type: BulkOperation['type']) => {
    switch (type) {
      case 'transfer': return <IconTransfer size={16} />;
      case 'restructure': return <IconSettings size={16} />;
      case 'merge': return <IconUsers size={16} />;
      case 'split': return <IconEdit size={16} />;
      default: return <IconUsers size={16} />;
    }
  };

  return (
    <Stack gap="lg">
      {/* Header with Actions */}
      <Card withBorder p="md">
        <Group justify="space-between">
          <div>
            <Title order={3}>Bulk Territory Operations</Title>
            <Text c="dimmed" size="sm">
              Manage customer assignments and territory restructuring in bulk
            </Text>
          </div>
          <Group gap="sm">
            <Button
              variant="light"
              leftSection={<IconHistory size={16} />}
              onClick={openHistoryModal}
            >
              View History
            </Button>
            <Button
              variant="light"
              leftSection={<IconUpload size={16} />}
            >
              Import
            </Button>
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
            >
              Export
            </Button>
          </Group>
        </Group>
      </Card>

      <Tabs defaultValue="transfer" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="transfer" leftSection={<IconTransfer size={16} />}>
            Bulk Transfer
          </Tabs.Tab>
          <Tabs.Tab value="restructure" leftSection={<IconSettings size={16} />}>
            Territory Restructure
          </Tabs.Tab>
          <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
            Operation History
          </Tabs.Tab>
        </Tabs.List>

        {/* Bulk Transfer Tab */}
        <Tabs.Panel value="transfer" pt="lg">
          <Stack gap="lg">
            {/* Filters and Search */}
            <Card withBorder p="md">
              <Group gap="md">
                <TextInput
                  placeholder="Search customers..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  style={{ flex: 1 }}
                />
                <Select
                  placeholder="Filter by Status"
                  data={[
                    { value: 'active', label: 'Active' },
                    { value: 'prospect', label: 'Prospect' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  clearable
                  w={150}
                />
                <Select
                  placeholder="Filter by Territory"
                  data={territories.map(t => ({ value: t.id, label: t.name }))}
                  value={filterTerritory}
                  onChange={setFilterTerritory}
                  clearable
                  w={200}
                />
              </Group>
            </Card>

            {/* Selection Actions */}
            <Card withBorder p="md">
              <Group justify="space-between">
                <Group gap="md">
                  <Checkbox
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < filteredCustomers.length}
                    onChange={(e) => handleSelectAllCustomers(e.currentTarget.checked)}
                    label={`Select All (${filteredCustomers.length})`}
                  />
                  {selectedCustomers.length > 0 && (
                    <Badge color="blue">
                      {selectedCustomers.length} selected
                    </Badge>
                  )}
                </Group>
                <Group gap="sm">
                  <Button
                    disabled={selectedCustomers.length === 0}
                    leftSection={<IconTransfer size={16} />}
                    onClick={openTransferModal}
                  >
                    Transfer Selected
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    disabled={selectedCustomers.length === 0}
                    leftSection={<IconTrash size={16} />}
                  >
                    Remove from Territory
                  </Button>
                </Group>
              </Group>
            </Card>

            {/* Customer List */}
            <Card withBorder p="md">
              <ScrollArea h={400}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th w={40}></Table.Th>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Contact</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Territory</Table.Th>
                      <Table.Th>Revenue</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredCustomers.map((customer) => {
                      const territory = territories.find(t => `tm-${t.id}` === customer.territoryManagerId);
                      return (
                        <Table.Tr key={customer.id}>
                          <Table.Td>
                            <Checkbox
                              checked={selectedCustomers.includes(customer.id)}
                              onChange={(e) => handleCustomerSelect(customer.id, e.currentTarget.checked)}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Text fw={500}>{customer.companyName}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{customer.contactName}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge color={customer.status === 'active' ? 'green' : 'blue'} size="sm">
                              {customer.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{territory?.name || 'Unassigned'}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              ${customer.totalRevenue.toLocaleString()}
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Territory Restructure Tab */}
        <Tabs.Panel value="restructure" pt="lg">
          <Stack gap="lg">
            <Alert icon={<IconAlertTriangle size={16} />} color="orange">
              Territory restructuring operations affect multiple customers and should be planned carefully.
              Consider the impact on territory managers and customer relationships.
            </Alert>

            <Group gap="lg">
              <Button
                size="lg"
                leftSection={<IconUsers size={20} />}
                onClick={openRestructureModal}
              >
                Merge Territories
              </Button>
              <Button
                size="lg"
                variant="light"
                leftSection={<IconEdit size={20} />}
                onClick={openRestructureModal}
              >
                Split Territory
              </Button>
              <Button
                size="lg"
                variant="light"
                leftSection={<IconSettings size={20} />}
                onClick={openRestructureModal}
              >
                Boundary Changes
              </Button>
            </Group>

            {/* Territory Overview */}
            <Card withBorder p="md">
              <Title order={4} mb="md">Territory Overview</Title>
              <ScrollArea>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Territory</Table.Th>
                      <Table.Th>Manager</Table.Th>
                      <Table.Th>Customers</Table.Th>
                      <Table.Th>Revenue</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {territories.map((territory) => {
                      const manager = territoryManagers.find(tm => tm.id === `tm-${territory.id}`);
                      const territoryCustomers = customers.filter(c => c.territoryManagerId === `tm-${territory.id}`);
                      const totalRevenue = territoryCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);

                      return (
                        <Table.Tr key={territory.id}>
                          <Table.Td>
                            <Text fw={500}>{territory.name}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {manager ? `${manager.firstName} ${manager.lastName}` : 'Unassigned'}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="light">{territoryCustomers.length}</Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">${totalRevenue.toLocaleString()}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Tooltip label="Edit Territory">
                                <ActionIcon variant="subtle" size="sm">
                                  <IconEdit size={14} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Delete Territory">
                                <ActionIcon variant="subtle" size="sm" color="red">
                                  <IconTrash size={14} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Operation History Tab */}
        <Tabs.Panel value="history" pt="lg">
          <Card withBorder p="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={4}>Recent Operations</Title>
                <Badge variant="light">{bulkOperations.length} operations</Badge>
              </Group>

              <ScrollArea>
                <Stack gap="sm">
                  {bulkOperations.map((operation) => (
                    <Card key={operation.id} withBorder p="md">
                      <Group justify="space-between">
                        <Group gap="md">
                          {getOperationIcon(operation.type)}
                          <div>
                            <Text fw={500}>{operation.description}</Text>
                            <Text size="sm" c="dimmed">
                              {operation.createdAt.toLocaleDateString()} • {operation.createdBy}
                            </Text>
                          </div>
                        </Group>
                        <Group gap="sm">
                          <Badge color={getStatusColor(operation.status)}>
                            {operation.status}
                          </Badge>
                          {operation.status === 'in_progress' && (
                            <Progress value={operation.progress} w={100} size="sm" />
                          )}
                          {operation.status === 'failed' && (
                            <Tooltip label="Retry Operation">
                              <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={() => handleRetryOperation(operation.id)}
                              >
                                <IconRestore size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                          <Tooltip label="Delete Operation">
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => handleDeleteOperation(operation.id)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Group>
                      
                      {operation.errors && (
                        <Alert color="red" mt="sm">
                          <Stack gap={4}>
                            <Text size="sm" fw={700}>Errors:</Text>
                            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                              {operation.errors.map((error, index) => (
                                <li key={index}><Text size="sm" component="span">{error}</Text></li>
                              ))}
                            </ul>
                          </Stack>
                        </Alert>
                      )}
                    </Card>
                  ))}
                </Stack>
              </ScrollArea>
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Transfer Modal */}
      <Modal
        opened={transferModalOpened}
        onClose={closeTransferModal}
        title="Bulk Customer Transfer"
        size="md"
      >
        <Stack gap="md">
          <Alert icon={<IconAlertTriangle size={16} />} color="blue">
            You are about to transfer {selectedCustomers.length} customers to a new territory.
            This action will update their territory assignments and notify the relevant managers.
          </Alert>

          <Select
            label="Target Territory"
            placeholder="Select destination territory"
            data={territories.map(t => ({ value: t.id, label: t.name }))}
            required
          />

          <TextInput
            label="Transfer Reason"
            placeholder="Optional reason for the transfer"
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={closeTransferModal}>
              Cancel
            </Button>
            <Button onClick={() => handleBulkTransfer('1')}>
              Transfer Customers
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Restructure Modal */}
      <Modal
        opened={restructureModalOpened}
        onClose={closeRestructureModal}
        title="Territory Restructure"
        size="lg"
      >
        <Stack gap="md">
          <Stepper active={activeStep} onStepClick={setActiveStep}>
            <Stepper.Step label="Select Operation" description="Choose restructure type">
              <Stack gap="md" mt="md">
                <Text>Select the type of territory restructuring operation:</Text>
                <Group gap="md">
                  <Button variant="light" fullWidth>Merge Territories</Button>
                  <Button variant="light" fullWidth>Split Territory</Button>
                  <Button variant="light" fullWidth>Boundary Changes</Button>
                </Group>
              </Stack>
            </Stepper.Step>
            
            <Stepper.Step label="Configure" description="Set parameters">
              <Stack gap="md" mt="md">
                <MultiSelect
                  label="Source Territories"
                  placeholder="Select territories to restructure"
                  data={territories.map(t => ({ value: t.id, label: t.name }))}
                />
                <TextInput
                  label="New Territory Name"
                  placeholder="Enter name for new territory"
                />
                <Select
                  label="Assign Manager"
                  placeholder="Select territory manager"
                  data={territoryManagers.map(tm => ({
                    value: tm.id,
                    label: `${tm.firstName} ${tm.lastName}`,
                  }))}
                />
              </Stack>
            </Stepper.Step>
            
            <Stepper.Step label="Review" description="Confirm changes">
              <Stack gap="md" mt="md">
                <Alert icon={<IconCheck size={16} />} color="green">
                  Review the restructuring configuration before proceeding.
                </Alert>
                <Text size="sm">
                  This operation will affect customer assignments and territory boundaries.
                  Make sure all configurations are correct.
                </Text>
              </Stack>
            </Stepper.Step>
          </Stepper>

          <Group justify="space-between" mt="xl">
            <Button variant="light" onClick={closeRestructureModal}>
              Cancel
            </Button>
            <Group gap="sm">
              {activeStep > 0 && (
                <Button variant="light" onClick={() => setActiveStep(activeStep - 1)}>
                  Back
                </Button>
              )}
              {activeStep < 2 ? (
                <Button onClick={() => setActiveStep(activeStep + 1)}>
                  Next
                </Button>
              ) : (
                <Button onClick={() => handleTerritoryRestructure({
                  operation: 'merge',
                  sourceIds: ['1', '2'],
                  targetConfig: [{
                    name: 'Merged Territory',
                    managerId: 'tm-1',
                  }],
                  customerReassignments: [],
                })}>
                  Execute Restructure
                </Button>
              )}
            </Group>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
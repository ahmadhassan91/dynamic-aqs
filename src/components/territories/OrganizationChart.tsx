'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Avatar,
  Button,
  Select,
  ActionIcon,
  Tooltip,
  Box,
  Center,
  Divider,
} from '@mantine/core';
import {
  IconUsers,
  IconUser,
  IconBuilding,
  IconChevronDown,
  IconChevronRight,
  IconEdit,
  IconPlus,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import type { MockUser, MockCustomer } from '@/lib/mockData/generators';

interface ManagerNodeProps {
  manager: MockUser;
  territories: Array<{ id: string; name: string; regionId: string }>;
  territoryManagers: MockUser[];
  customers: MockCustomer[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
}

function ManagerNode({ 
  manager, 
  territories, 
  territoryManagers, 
  customers, 
  isExpanded, 
  onToggleExpand, 
  onEdit 
}: ManagerNodeProps) {
  const regionTerritories = territories.filter(t => t.regionId === manager.regionId);
  const regionTMs = territoryManagers.filter(tm => tm.regionId === manager.regionId);
  const regionCustomers = customers.filter(c => 
    regionTMs.some(tm => tm.id === c.territoryManagerId)
  );

  const totalRevenue = regionCustomers.reduce((sum, customer) => sum + customer.totalRevenue, 0);
  const activeCustomers = regionCustomers.filter(c => c.status === 'active').length;

  return (
    <Card withBorder p="md" style={{ minWidth: 300 }}>
      <Stack gap="sm">
        {/* Manager Header */}
        <Group justify="space-between">
          <Group gap="sm">
            <Avatar size={40} radius="xl" color="blue">
              {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
            </Avatar>
            <div>
              <Text fw={600}>{manager.firstName} {manager.lastName}</Text>
              <Text size="sm" c="dimmed">Regional Director</Text>
              <Text size="xs" c="dimmed">
                {territories.find(t => t.regionId === manager.regionId)?.name?.replace(' Region', '') || 'Unknown'} Region
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            <Tooltip label="Edit Manager">
              <ActionIcon variant="subtle" onClick={onEdit}>
                <IconEdit size={16} />
              </ActionIcon>
            </Tooltip>
            <ActionIcon variant="subtle" onClick={onToggleExpand}>
              {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
            </ActionIcon>
          </Group>
        </Group>

        {/* Manager Stats */}
        <Group gap="lg">
          <div>
            <Text size="xs" c="dimmed">Territory Managers</Text>
            <Text fw={500}>{regionTMs.length}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Customers</Text>
            <Text fw={500}>{regionCustomers.length}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Active</Text>
            <Text fw={500} c="green">{activeCustomers}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Revenue</Text>
            <Text fw={500} size="sm">
              ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Text>
          </div>
        </Group>

        {/* Territory Managers (when expanded) */}
        {isExpanded && (
          <>
            <Divider />
            <Stack gap="sm">
              <Group justify="space-between">
                <Text fw={500} size="sm">Territory Managers</Text>
                <Button size="xs" variant="light" leftSection={<IconPlus size={12} />}>
                  Add TM
                </Button>
              </Group>
              
              {regionTMs.map((tm) => {
                const territory = regionTerritories.find(t => `tm-${t.id}` === tm.id);
                const tmCustomers = customers.filter(c => c.territoryManagerId === tm.id);
                const tmRevenue = tmCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);
                const tmActive = tmCustomers.filter(c => c.status === 'active').length;

                return (
                  <Card key={tm.id} withBorder p="sm" bg="gray.0">
                    <Group justify="space-between">
                      <Group gap="sm">
                        <Avatar size={32} radius="xl" color="teal">
                          {tm.firstName.charAt(0)}{tm.lastName.charAt(0)}
                        </Avatar>
                        <div>
                          <Text fw={500} size="sm">{tm.firstName} {tm.lastName}</Text>
                          <Text size="xs" c="dimmed">{territory?.name || 'Unknown Territory'}</Text>
                        </div>
                      </Group>
                      <Group gap="md">
                        <div style={{ textAlign: 'center' }}>
                          <Text size="xs" c="dimmed">Customers</Text>
                          <Text fw={500} size="sm">{tmCustomers.length}</Text>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <Text size="xs" c="dimmed">Active</Text>
                          <Text fw={500} size="sm" c="green">{tmActive}</Text>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <Text size="xs" c="dimmed">Revenue</Text>
                          <Text fw={500} size="xs">
                            ${tmRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                          </Text>
                        </div>
                        <ActionIcon variant="subtle" size="sm">
                          <IconEdit size={12} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Card>
                );
              })}
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
}

interface ExecutiveNodeProps {
  title: string;
  name: string;
  email: string;
  totalManagers: number;
  totalCustomers: number;
  totalRevenue: number;
  onEdit: () => void;
}

function ExecutiveNode({ 
  title, 
  name, 
  email, 
  totalManagers, 
  totalCustomers, 
  totalRevenue, 
  onEdit 
}: ExecutiveNodeProps) {
  return (
    <Card withBorder p="lg" style={{ minWidth: 350 }}>
      <Stack gap="md">
        {/* Executive Header */}
        <Group justify="space-between">
          <Group gap="md">
            <Avatar size={50} radius="xl" color="grape">
              {name.split(' ').map(n => n.charAt(0)).join('')}
            </Avatar>
            <div>
              <Text fw={700} size="lg">{name}</Text>
              <Text fw={500} c="dimmed">{title}</Text>
              <Text size="sm" c="dimmed">{email}</Text>
            </div>
          </Group>
          <ActionIcon variant="subtle" onClick={onEdit}>
            <IconEdit size={18} />
          </ActionIcon>
        </Group>

        {/* Executive Stats */}
        <Group gap="xl" justify="center">
          <div style={{ textAlign: 'center' }}>
            <Text size="xs" c="dimmed">Regional Directors</Text>
            <Text fw={700} size="xl">{totalManagers}</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text size="xs" c="dimmed">Total Customers</Text>
            <Text fw={700} size="xl">{totalCustomers}</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text size="xs" c="dimmed">Total Revenue</Text>
            <Text fw={700} size="lg">
              ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Text>
          </div>
        </Group>
      </Stack>
    </Card>
  );
}

export function OrganizationChart() {
  const { customers, territories, users } = useMockData();
  const [viewMode, setViewMode] = useState<string>('hierarchy');
  const [expandedManagers, setExpandedManagers] = useState<Set<string>>(new Set());

  const regionalManagers = users.filter(user => user.role === 'regional_manager');
  const territoryManagers = users.filter(user => user.role === 'territory_manager');

  // Calculate totals for executive level
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalRevenue, 0);

  const handleToggleExpand = (managerId: string) => {
    const newExpanded = new Set(expandedManagers);
    if (newExpanded.has(managerId)) {
      newExpanded.delete(managerId);
    } else {
      newExpanded.add(managerId);
    }
    setExpandedManagers(newExpanded);
  };

  const handleEditUser = () => {
    notifications.show({
      title: 'Edit User',
      message: 'User editing functionality would be implemented here',
      color: 'blue',
    });
  };

  const handleExpandAll = () => {
    setExpandedManagers(new Set(regionalManagers.map(rm => rm.id)));
  };

  const handleCollapseAll = () => {
    setExpandedManagers(new Set());
  };

  return (
    <Stack gap="lg">
      {/* Controls */}
      <Card withBorder p="md">
        <Group justify="space-between">
          <Group gap="md">
            <Select
              label="View Mode"
              data={[
                { value: 'hierarchy', label: 'Hierarchical View' },
                { value: 'flat', label: 'Flat View' },
                { value: 'territory', label: 'Territory View' },
              ]}
              value={viewMode}
              onChange={(value) => setViewMode(value || 'hierarchy')}
              w={200}
            />
          </Group>
          <Group gap="sm">
            <Button variant="light" size="sm" onClick={handleExpandAll}>
              Expand All
            </Button>
            <Button variant="light" size="sm" onClick={handleCollapseAll}>
              Collapse All
            </Button>
          </Group>
        </Group>
      </Card>

      {/* Organization Chart */}
      {viewMode === 'hierarchy' && (
        <Stack gap="xl" align="center">
          {/* Executive Level */}
          <ExecutiveNode
            title="VP of Operations"
            name="Sarah Johnson"
            email="sarah.johnson@dynamicaqs.com"
            totalManagers={regionalManagers.length}
            totalCustomers={customers.length}
            totalRevenue={totalRevenue}
            onEdit={handleEditUser}
          />

          {/* Connection Line */}
          <Box h={30} w={2} bg="gray.3" />

          {/* Regional Managers Level */}
          <Group gap="xl" align="flex-start" justify="center">
            {regionalManagers.map((manager, index) => (
              <div key={manager.id}>
                {/* Connection Lines */}
                {index > 0 && (
                  <Box 
                    pos="absolute" 
                    top={-15} 
                    left={-50} 
                    w={100} 
                    h={2} 
                    bg="gray.3" 
                    style={{ transform: 'translateY(-50%)' }}
                  />
                )}
                
                <ManagerNode
                  manager={manager}
                  territories={territories}
                  territoryManagers={territoryManagers}
                  customers={customers}
                  isExpanded={expandedManagers.has(manager.id)}
                  onToggleExpand={() => handleToggleExpand(manager.id)}
                  onEdit={handleEditUser}
                />
              </div>
            ))}
          </Group>
        </Stack>
      )}

      {viewMode === 'flat' && (
        <Stack gap="md">
          {/* Executive Level */}
          <Card withBorder p="md">
            <Group justify="space-between">
              <Group gap="md">
                <Avatar size={40} radius="xl" color="grape">
                  SJ
                </Avatar>
                <div>
                  <Text fw={600}>Sarah Johnson</Text>
                  <Text size="sm" c="dimmed">VP of Operations</Text>
                  <Text size="xs" c="dimmed">sarah.johnson@dynamicaqs.com</Text>
                </div>
              </Group>
              <Group gap="md">
                <div style={{ textAlign: 'center' }}>
                  <Text size="xs" c="dimmed">Regional Directors</Text>
                  <Text fw={500}>{regionalManagers.length}</Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text size="xs" c="dimmed">Total Customers</Text>
                  <Text fw={500}>{customers.length}</Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text size="xs" c="dimmed">Total Revenue</Text>
                  <Text fw={500}>${totalRevenue.toLocaleString()}</Text>
                </div>
                <ActionIcon variant="subtle" onClick={handleEditUser}>
                  <IconEdit size={16} />
                </ActionIcon>
              </Group>
            </Group>
          </Card>

          {/* Regional Managers */}
          {regionalManagers.map((manager) => {
            const regionTMs = territoryManagers.filter(tm => tm.regionId === manager.regionId);
            const regionCustomers = customers.filter(c => 
              regionTMs.some(tm => tm.id === c.territoryManagerId)
            );
            const regionRevenue = regionCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);

            return (
              <Card key={manager.id} withBorder p="md" ml="xl">
                <Group justify="space-between">
                  <Group gap="md">
                    <Avatar size={36} radius="xl" color="blue">
                      {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
                    </Avatar>
                    <div>
                      <Text fw={500}>{manager.firstName} {manager.lastName}</Text>
                      <Text size="sm" c="dimmed">Regional Director</Text>
                      <Text size="xs" c="dimmed">
                        {territories.find(t => t.regionId === manager.regionId)?.name?.replace(' Region', '') || 'Unknown'} Region
                      </Text>
                    </div>
                  </Group>
                  <Group gap="md">
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xs" c="dimmed">Territory Managers</Text>
                      <Text fw={500}>{regionTMs.length}</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xs" c="dimmed">Customers</Text>
                      <Text fw={500}>{regionCustomers.length}</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xs" c="dimmed">Revenue</Text>
                      <Text fw={500}>${regionRevenue.toLocaleString()}</Text>
                    </div>
                    <ActionIcon variant="subtle" onClick={handleEditUser}>
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Group>
                </Group>

                {/* Territory Managers under this Regional Manager */}
                <Stack gap="xs" mt="md" ml="md">
                  {regionTMs.map((tm) => {
                    const territory = territories.find(t => `tm-${t.id}` === tm.id);
                    const tmCustomers = customers.filter(c => c.territoryManagerId === tm.id);
                    const tmRevenue = tmCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);

                    return (
                      <Card key={tm.id} withBorder p="sm" bg="gray.0">
                        <Group justify="space-between">
                          <Group gap="sm">
                            <Avatar size={28} radius="xl" color="teal">
                              {tm.firstName.charAt(0)}{tm.lastName.charAt(0)}
                            </Avatar>
                            <div>
                              <Text fw={500} size="sm">{tm.firstName} {tm.lastName}</Text>
                              <Text size="xs" c="dimmed">Territory Manager - {territory?.name || 'Unknown Territory'}</Text>
                            </div>
                          </Group>
                          <Group gap="md">
                            <div style={{ textAlign: 'center' }}>
                              <Text size="xs" c="dimmed">Customers</Text>
                              <Text fw={500} size="sm">{tmCustomers.length}</Text>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <Text size="xs" c="dimmed">Revenue</Text>
                              <Text fw={500} size="sm">${tmRevenue.toLocaleString()}</Text>
                            </div>
                            <ActionIcon variant="subtle" size="sm" onClick={handleEditUser}>
                              <IconEdit size={12} />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Card>
                    );
                  })}
                </Stack>
              </Card>
            );
          })}
        </Stack>
      )}

      {viewMode === 'territory' && (
        <Stack gap="md">
          {territories.map((territory) => {
            const territoryTM = territoryManagers.find(tm => `tm-${territory.id}` === tm.id);
            const territoryCustomers = customers.filter(c => c.territoryManagerId === territoryTM?.id);
            const territoryRevenue = territoryCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);
            const activeCustomers = territoryCustomers.filter(c => c.status === 'active').length;
            const regionalManager = regionalManagers.find(rm => rm.regionId === territory.regionId);

            return (
              <Card key={territory.id} withBorder p="md">
                <Group justify="space-between" mb="md">
                  <div>
                    <Text fw={600} size="lg">{territory.name}</Text>
                    <Text size="sm" c="dimmed">
                      Region: {territory.regionId?.replace('region-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
                    </Text>
                  </div>
                  <Badge variant="light" color="blue">
                    Territory
                  </Badge>
                </Group>

                <Group gap="xl" mb="md">
                  <div>
                    <Text size="xs" c="dimmed">Territory Manager</Text>
                    <Group gap="xs">
                      {territoryTM ? (
                        <>
                          <Avatar size={24} radius="xl" color="teal">
                            {territoryTM.firstName.charAt(0)}{territoryTM.lastName.charAt(0)}
                          </Avatar>
                          <Text fw={500} size="sm">
                            {territoryTM.firstName} {territoryTM.lastName}
                          </Text>
                        </>
                      ) : (
                        <Text size="sm" c="dimmed">Unassigned</Text>
                      )}
                    </Group>
                  </div>

                  <div>
                    <Text size="xs" c="dimmed">Regional Director</Text>
                    <Group gap="xs">
                      {regionalManager ? (
                        <>
                          <Avatar size={24} radius="xl" color="blue">
                            {regionalManager.firstName.charAt(0)}{regionalManager.lastName.charAt(0)}
                          </Avatar>
                          <Text fw={500} size="sm">
                            {regionalManager.firstName} {regionalManager.lastName}
                          </Text>
                        </>
                      ) : (
                        <Text size="sm" c="dimmed">Unassigned</Text>
                      )}
                    </Group>
                  </div>

                  <div>
                    <Text size="xs" c="dimmed">Total Customers</Text>
                    <Text fw={500}>{territoryCustomers.length}</Text>
                  </div>

                  <div>
                    <Text size="xs" c="dimmed">Active Customers</Text>
                    <Text fw={500} c="green">{activeCustomers}</Text>
                  </div>

                  <div>
                    <Text size="xs" c="dimmed">Territory Revenue</Text>
                    <Text fw={500}>${territoryRevenue.toLocaleString()}</Text>
                  </div>

                  <ActionIcon variant="subtle" onClick={handleEditUser}>
                    <IconEdit size={16} />
                  </ActionIcon>
                </Group>

                {/* Top Customers in Territory */}
                {territoryCustomers.length > 0 && (
                  <div>
                    <Text fw={500} size="sm" mb="xs">Top Customers</Text>
                    <Group gap="xs">
                      {territoryCustomers
                        .sort((a, b) => b.totalRevenue - a.totalRevenue)
                        .slice(0, 3)
                        .map((customer) => (
                          <Badge key={customer.id} variant="outline" size="sm">
                            {customer.companyName} (${customer.totalRevenue.toLocaleString()})
                          </Badge>
                        ))}
                      {territoryCustomers.length > 3 && (
                        <Badge variant="outline" size="sm" color="gray">
                          +{territoryCustomers.length - 3} more
                        </Badge>
                      )}
                    </Group>
                  </div>
                )}
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Summary Stats */}
      <Card withBorder p="md" w="100%" maw={800}>
        <Title order={4} mb="md">Organization Summary</Title>
        <Group gap="xl" justify="center">
          <div style={{ textAlign: 'center' }}>
            <IconBuilding size={24} color="blue" style={{ margin: '0 auto 8px' }} />
            <Text size="xs" c="dimmed">Regions</Text>
            <Text fw={600} size="lg">3</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconUser size={24} color="teal" style={{ margin: '0 auto 8px' }} />
            <Text size="xs" c="dimmed">Regional Directors</Text>
            <Text fw={600} size="lg">{regionalManagers.length}</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconUsers size={24} color="green" style={{ margin: '0 auto 8px' }} />
            <Text size="xs" c="dimmed">Territory Managers</Text>
            <Text fw={600} size="lg">{territoryManagers.length}</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconBuilding size={24} color="orange" style={{ margin: '0 auto 8px' }} />
            <Text size="xs" c="dimmed">Territories</Text>
            <Text fw={600} size="lg">{territories.length}</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconUsers size={24} color="purple" style={{ margin: '0 auto 8px' }} />
            <Text size="xs" c="dimmed">Total Customers</Text>
            <Text fw={600} size="lg">{customers.length}</Text>
          </div>
        </Group>
      </Card>
    </Stack>
  );
}
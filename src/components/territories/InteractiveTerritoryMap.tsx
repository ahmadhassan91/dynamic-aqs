'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Card,
  Stack,
  Group,
  Button,
  Text,
  Badge,
  ActionIcon,
  Tooltip,
  Modal,
  TextInput,
  Select,
  ColorInput,
  Switch,
  Alert,
  Loader,
  Box,
} from '@mantine/core';
import {
  IconMap,
  IconEdit,
  IconPlus,
  IconTrash,
  IconMapPin,
  IconUsers,
  IconTarget,
  IconSettings,
  IconInfoCircle,
  IconDownload,
  IconUpload,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMockData } from '@/lib/mockData/MockDataProvider';
import type { MockCustomer, MockUser } from '@/lib/mockData/generators';

interface Territory {
  id: string;
  name: string;
  regionId: string;
  managerId: string;
  color: string;
  boundaries: Array<{ lat: number; lng: number }>;
  isActive: boolean;
}

interface TerritoryBoundaryEditorProps {
  territory: Territory | null;
  onSave: (territory: Territory) => void;
  onClose: () => void;
  opened: boolean;
}

function TerritoryBoundaryEditor({ territory, onSave, onClose, opened }: TerritoryBoundaryEditorProps) {
  const [editingTerritory, setEditingTerritory] = useState<Territory | null>(territory);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    setEditingTerritory(territory);
  }, [territory]);

  const handleSave = () => {
    if (editingTerritory) {
      onSave(editingTerritory);
      notifications.show({
        title: 'Territory Updated',
        message: 'Territory boundaries have been saved successfully',
        color: 'green',
      });
    }
    onClose();
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    notifications.show({
      title: 'Drawing Mode',
      message: 'Click on the map to draw territory boundaries',
      color: 'blue',
    });
  };

  const handleClearBoundaries = () => {
    if (editingTerritory) {
      setEditingTerritory({
        ...editingTerritory,
        boundaries: [],
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Territory Boundaries" size="xl">
      {editingTerritory && (
        <Stack gap="md">
          <Group gap="md">
            <TextInput
              label="Territory Name"
              value={editingTerritory.name}
              onChange={(e) =>
                setEditingTerritory({
                  ...editingTerritory,
                  name: e.currentTarget.value,
                })
              }
              style={{ flex: 1 }}
            />
            <ColorInput
              label="Territory Color"
              value={editingTerritory.color}
              onChange={(color) =>
                setEditingTerritory({
                  ...editingTerritory,
                  color,
                })
              }
            />
          </Group>

          <Switch
            label="Active Territory"
            checked={editingTerritory.isActive}
            onChange={(e) =>
              setEditingTerritory({
                ...editingTerritory,
                isActive: e.currentTarget.checked,
              })
            }
          />

          {/* Map Container - In a real implementation, this would contain an interactive map */}
          <Card withBorder h={400} p="md">
            <Stack align="center" justify="center" h="100%">
              <IconMap size={48} color="gray" />
              <Stack gap={4} align="center">
                <Text c="dimmed" ta="center">
                  Interactive Map View
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  In a real implementation, this would show an interactive map
                  <br />
                  with territory boundaries and customer locations
                </Text>
              </Stack>
              <Group gap="sm">
                <Button
                  variant={isDrawing ? 'filled' : 'light'}
                  leftSection={<IconEdit size={16} />}
                  onClick={handleStartDrawing}
                >
                  {isDrawing ? 'Drawing...' : 'Draw Boundaries'}
                </Button>
                <Button
                  variant="light"
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  onClick={handleClearBoundaries}
                >
                  Clear
                </Button>
              </Group>
            </Stack>
          </Card>

          <Alert icon={<IconInfoCircle size={16} />} color="blue">
            <Text size="sm">
              <strong>Boundary Points:</strong> {editingTerritory.boundaries.length} points defined
              <br />
              Click "Draw Boundaries" to start defining the territory area on the map.
            </Text>
          </Alert>

          <Group justify="flex-end">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Territory
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}

interface CustomerMapMarkerProps {
  customer: MockCustomer;
  onClick: (customer: MockCustomer) => void;
  isSelected: boolean;
}

function CustomerMapMarker({ customer, onClick, isSelected }: CustomerMapMarkerProps) {
  return (
    <Tooltip label={`${customer.companyName} - ${customer.contactName}`}>
      <ActionIcon
        variant={isSelected ? 'filled' : 'light'}
        color={customer.status === 'active' ? 'green' : customer.status === 'prospect' ? 'blue' : 'gray'}
        size="sm"
        onClick={() => onClick(customer)}
        style={{
          position: 'absolute',
          // In a real implementation, these would be calculated from lat/lng
          left: `${Math.random() * 80 + 10}%`,
          top: `${Math.random() * 80 + 10}%`,
        }}
      >
        <IconMapPin size={12} />
      </ActionIcon>
    </Tooltip>
  );
}

export function InteractiveTerritoryMap() {
  const { customers, territories: mockTerritories, users } = useMockData();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<MockCustomer | null>(null);
  const [editingTerritory, setEditingTerritory] = useState<Territory | null>(null);
  const [showCustomers, setShowCustomers] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  // Initialize territories with mock data
  useEffect(() => {
    const initialTerritories: Territory[] = mockTerritories.map((territory, index) => ({
      id: territory.id,
      name: territory.name,
      regionId: territory.regionId,
      managerId: `tm-${territory.id}`,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index % 5],
      boundaries: [
        // Mock boundary points - in real implementation, these would come from the database
        { lat: 40.7128 + Math.random() * 0.1, lng: -74.0060 + Math.random() * 0.1 },
        { lat: 40.7228 + Math.random() * 0.1, lng: -74.0160 + Math.random() * 0.1 },
        { lat: 40.7328 + Math.random() * 0.1, lng: -74.0260 + Math.random() * 0.1 },
        { lat: 40.7428 + Math.random() * 0.1, lng: -74.0360 + Math.random() * 0.1 },
      ],
      isActive: true,
    }));
    setTerritories(initialTerritories);
  }, [mockTerritories]);

  const territoryManagers = users.filter(user => user.role === 'territory_manager');

  const handleTerritoryClick = (territoryId: string) => {
    setSelectedTerritory(selectedTerritory === territoryId ? null : territoryId);
  };

  const handleCustomerClick = (customer: MockCustomer) => {
    setSelectedCustomer(selectedCustomer?.id === customer.id ? null : customer);
  };

  const handleEditTerritory = (territory: Territory) => {
    setEditingTerritory(territory);
    open();
  };

  const handleCreateTerritory = () => {
    const newTerritory: Territory = {
      id: `territory-${Date.now()}`,
      name: 'New Territory',
      regionId: '1',
      managerId: territoryManagers[0]?.id || '',
      color: '#FF6B6B',
      boundaries: [],
      isActive: true,
    };
    setEditingTerritory(newTerritory);
    open();
  };

  const handleSaveTerritory = (territory: Territory) => {
    setTerritories(prev => {
      const existing = prev.find(t => t.id === territory.id);
      if (existing) {
        return prev.map(t => t.id === territory.id ? territory : t);
      } else {
        return [...prev, territory];
      }
    });
  };

  const handleDeleteTerritory = (territoryId: string) => {
    setTerritories(prev => prev.filter(t => t.id !== territoryId));
    notifications.show({
      title: 'Territory Deleted',
      message: 'Territory has been removed successfully',
      color: 'red',
    });
  };

  const handleExportTerritories = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      notifications.show({
        title: 'Export Complete',
        message: 'Territory data has been exported successfully',
        color: 'green',
      });
    }, 2000);
  };

  const handleImportTerritories = () => {
    notifications.show({
      title: 'Import Territories',
      message: 'Territory import functionality would be implemented here',
      color: 'blue',
    });
  };

  const getCustomersInTerritory = (territoryId: string) => {
    return customers.filter(customer => customer.territoryManagerId === `tm-${territoryId}`);
  };

  const selectedTerritoryData = territories.find(t => t.id === selectedTerritory);

  return (
    <Stack gap="lg">
      {/* Controls */}
      <Card withBorder p="md">
        <Group justify="space-between">
          <Group gap="md">
            <Switch
              label="Show Customers"
              checked={showCustomers}
              onChange={(e) => setShowCustomers(e.currentTarget.checked)}
            />
            <Switch
              label="Show Boundaries"
              checked={showBoundaries}
              onChange={(e) => setShowBoundaries(e.currentTarget.checked)}
            />
          </Group>
          <Group gap="sm">
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={handleExportTerritories}
              loading={isLoading}
            >
              Export
            </Button>
            <Button
              variant="light"
              leftSection={<IconUpload size={16} />}
              onClick={handleImportTerritories}
            >
              Import
            </Button>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleCreateTerritory}
            >
              New Territory
            </Button>
          </Group>
        </Group>
      </Card>

      <Group align="flex-start" gap="lg">
        {/* Map View */}
        <Card withBorder style={{ flex: 1 }} h={600}>
          <Stack gap="md" h="100%">
            <Group justify="space-between">
              <Text fw={500}>Territory Map View</Text>
              <ActionIcon variant="subtle">
                <IconSettings size={16} />
              </ActionIcon>
            </Group>

            {/* Interactive Map Container */}
            <Box
              style={{
                flex: 1,
                position: 'relative',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {/* Territory Boundaries */}
              {showBoundaries && territories.map((territory) => (
                <div
                  key={territory.id}
                  style={{
                    position: 'absolute',
                    left: '10%',
                    top: '10%',
                    width: '30%',
                    height: '30%',
                    border: `3px solid ${territory.color}`,
                    borderRadius: '8px',
                    backgroundColor: `${territory.color}20`,
                    cursor: 'pointer',
                    opacity: selectedTerritory === territory.id ? 1 : 0.7,
                  }}
                  onClick={() => handleTerritoryClick(territory.id)}
                >
                  <Text
                    size="xs"
                    fw={500}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      color: territory.color,
                    }}
                  >
                    {territory.name}
                  </Text>
                </div>
              ))}

              {/* Customer Markers */}
              {showCustomers && customers.map((customer) => (
                <CustomerMapMarker
                  key={customer.id}
                  customer={customer}
                  onClick={handleCustomerClick}
                  isSelected={selectedCustomer?.id === customer.id}
                />
              ))}

              {/* Map Placeholder */}
              <Stack align="center" justify="center" h="100%" style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                <IconMap size={48} color="gray" />
                <Stack gap={4} align="center">
                  <Text c="dimmed" ta="center">
                    Interactive Territory Map
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Click territories to select • Drag customers to reassign
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Card>

        {/* Territory List */}
        <Card withBorder w={300} h={600}>
          <Stack gap="md" h="100%">
            <Text fw={500}>Territories</Text>
            
            <Stack gap="xs" style={{ flex: 1, overflow: 'auto' }}>
              {territories.map((territory) => {
                const manager = territoryManagers.find(tm => tm.id === territory.managerId);
                const territoryCustomers = getCustomersInTerritory(territory.id);
                const isSelected = selectedTerritory === territory.id;

                return (
                  <Card
                    key={territory.id}
                    withBorder
                    p="sm"
                    style={{
                      cursor: 'pointer',
                      borderColor: isSelected ? territory.color : undefined,
                      backgroundColor: isSelected ? `${territory.color}10` : undefined,
                    }}
                    onClick={() => handleTerritoryClick(territory.id)}
                  >
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Group gap="xs">
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: territory.color,
                            }}
                          />
                          <Text fw={500} size="sm">
                            {territory.name}
                          </Text>
                        </Group>
                        <Group gap="xs">
                          <Tooltip label="Edit Territory">
                            <ActionIcon
                              variant="subtle"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTerritory(territory);
                              }}
                            >
                              <IconEdit size={12} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete Territory">
                            <ActionIcon
                              variant="subtle"
                              size="xs"
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTerritory(territory.id);
                              }}
                            >
                              <IconTrash size={12} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Group>

                      {manager && (
                        <Text size="xs" c="dimmed">
                          {manager.firstName} {manager.lastName}
                        </Text>
                      )}

                      <Group gap="lg">
                        <Group gap="xs">
                          <IconUsers size={12} />
                          <Text size="xs">{territoryCustomers.length}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconTarget size={12} />
                          <Text size="xs">
                            {territoryCustomers.filter(c => c.status === 'active').length} active
                          </Text>
                        </Group>
                      </Group>

                      {!territory.isActive && (
                        <Badge color="gray" size="xs">
                          Inactive
                        </Badge>
                      )}
                    </Stack>
                  </Card>
                );
              })}
            </Stack>
          </Stack>
        </Card>
      </Group>

      {/* Selected Customer Info */}
      {selectedCustomer && (
        <Card withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text fw={500}>{selectedCustomer.companyName}</Text>
              <Text size="sm" c="dimmed">
                {selectedCustomer.contactName} • {selectedCustomer.address.city}, {selectedCustomer.address.state}
              </Text>
            </div>
            <Group gap="sm">
              <Badge color={selectedCustomer.status === 'active' ? 'green' : 'blue'}>
                {selectedCustomer.status}
              </Badge>
              <Button size="xs" variant="light">
                Reassign Territory
              </Button>
            </Group>
          </Group>
        </Card>
      )}

      {/* Territory Boundary Editor Modal */}
      <TerritoryBoundaryEditor
        territory={editingTerritory}
        onSave={handleSaveTerritory}
        onClose={close}
        opened={opened}
      />
    </Stack>
  );
}
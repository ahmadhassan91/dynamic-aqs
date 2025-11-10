'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Text,
  Group,
  Button,
  TextInput,
  Select,
  Card,
  Avatar,
  Badge,
  Stack,
  Grid,
  ActionIcon,
  Menu,
  Modal,
  LoadingOverlay,
  Center,
  Loader,
  SegmentedControl,
  SimpleGrid,
  Table,
  Anchor
} from '@mantine/core';
import {
  IconSearch,
  IconPlus,
  IconFilter,
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconPhone,
  IconMail,
  IconBuilding,
  IconStar,
  IconGrid3x3,
  IconList,
  IconUser
} from '@tabler/icons-react';
import { 
  EngineerContact, 
  EngineerFilters, 
  EngineerRating,
  InteractionType,
  Interaction 
} from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface EngineerContactDatabaseProps {
  className?: string;
}

export default function EngineerContactDatabase({ className = '' }: EngineerContactDatabaseProps) {
  const [engineers, setEngineers] = useState<EngineerContact[]>([]);
  const [filteredEngineers, setFilteredEngineers] = useState<EngineerContact[]>([]);
  const [filters, setFilters] = useState<EngineerFilters>({});
  const [selectedEngineer, setSelectedEngineer] = useState<EngineerContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadEngineers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [engineers, filters]);

  const loadEngineers = async () => {
    try {
      setLoading(true);
      const data = await commercialService.getEngineers();
      setEngineers(data);
    } catch (error) {
      console.error('Error loading engineers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...engineers];

    if (filters.ratings && filters.ratings.length > 0) {
      filtered = filtered.filter(eng => filters.ratings!.includes(eng.rating));
    }

    if (filters.engineeringFirmIds && filters.engineeringFirmIds.length > 0) {
      filtered = filtered.filter(eng => filters.engineeringFirmIds!.includes(eng.engineeringFirmId));
    }

    if (filters.manufacturerRepIds && filters.manufacturerRepIds.length > 0) {
      filtered = filtered.filter(eng => 
        eng.manufacturerRepId && filters.manufacturerRepIds!.includes(eng.manufacturerRepId)
      );
    }

    if (filters.hasOpportunities !== undefined) {
      filtered = filtered.filter(eng => 
        filters.hasOpportunities ? eng.opportunities.length > 0 : eng.opportunities.length === 0
      );
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(eng =>
        eng.personalInfo.firstName.toLowerCase().includes(searchLower) ||
        eng.personalInfo.lastName.toLowerCase().includes(searchLower) ||
        eng.personalInfo.email.toLowerCase().includes(searchLower) ||
        eng.personalInfo.company?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.lastContactDateRange) {
      filtered = filtered.filter(eng => {
        if (!eng.lastContactDate) return false;
        const contactDate = new Date(eng.lastContactDate);
        return contactDate >= filters.lastContactDateRange!.start && 
               contactDate <= filters.lastContactDateRange!.end;
      });
    }

    setFilteredEngineers(filtered);
  };

  const renderEngineerCard = (engineer: EngineerContact) => (
    <Card
      key={engineer.id}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: 'pointer' }}
      onClick={() => setSelectedEngineer(engineer)}
    >
      <Group mb="md">
        <Avatar size="lg" color="blue">
          {engineer.personalInfo.firstName[0]}{engineer.personalInfo.lastName[0]}
        </Avatar>
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text fw={500}>
            {engineer.personalInfo.firstName} {engineer.personalInfo.lastName}
          </Text>
          <Text size="sm" c="dimmed">
            {engineer.personalInfo.title}
          </Text>
          <Badge variant="light" size="sm">
            {engineer.rating}
          </Badge>
        </Stack>
      </Group>
      
      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Company:</Text>
          <Text size="sm">{engineer.personalInfo.company}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Opportunities:</Text>
          <Text size="sm" fw={500}>{engineer.opportunities.length}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Pipeline Value:</Text>
          <Text size="sm" fw={500} c="green">
            ${engineer.totalOpportunityValue.toLocaleString()}
          </Text>
        </Group>
      </Stack>
      
      <Group mt="md" gap="xs">
        <ActionIcon variant="light" color="blue">
          <IconPhone size={16} />
        </ActionIcon>
        <ActionIcon variant="light" color="blue">
          <IconMail size={16} />
        </ActionIcon>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="light" color="gray">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEye size={14} />}>
              View Details
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={14} />}>
              Edit
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={14} />} color="red">
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  );

  const renderEngineerList = () => (
    <Paper shadow="sm" radius="md" withBorder>
      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Engineer</Table.Th>
              <Table.Th>Company</Table.Th>
              <Table.Th>Rating</Table.Th>
              <Table.Th>Opportunities</Table.Th>
              <Table.Th>Pipeline Value</Table.Th>
              <Table.Th>Last Contact</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredEngineers.map(engineer => (
              <Table.Tr
                key={engineer.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedEngineer(engineer)}
              >
                <Table.Td>
                  <Group gap="sm">
                    <Avatar size="sm" color="blue">
                      {engineer.personalInfo.firstName[0]}{engineer.personalInfo.lastName[0]}
                    </Avatar>
                    <Stack gap="xs">
                      <Text size="sm" fw={500}>
                        {engineer.personalInfo.firstName} {engineer.personalInfo.lastName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {engineer.personalInfo.title}
                      </Text>
                    </Stack>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{engineer.personalInfo.company}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm">
                    {engineer.rating}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{engineer.opportunities.length}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500} c="green">
                    ${engineer.totalOpportunityValue.toLocaleString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {engineer.lastContactDate?.toLocaleDateString() || 'Never'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEye size={14} />}>
                        View Details
                      </Menu.Item>
                      <Menu.Item leftSection={<IconEdit size={14} />}>
                        Edit
                      </Menu.Item>
                      <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );

  const handleFilterChange = (newFilters: Partial<EngineerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getRatingColor = (rating: EngineerRating) => {
    const colors = {
      [EngineerRating.HOSTILE]: 'bg-red-100 text-red-800 border-red-200',
      [EngineerRating.UNFAVORABLE]: 'bg-orange-100 text-orange-800 border-orange-200',
      [EngineerRating.NEUTRAL]: 'bg-gray-100 text-gray-800 border-gray-200',
      [EngineerRating.FAVORABLE]: 'bg-blue-100 text-blue-800 border-blue-200',
      [EngineerRating.CHAMPION]: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[rating] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRatingLabel = (rating: EngineerRating) => {
    const labels = {
      [EngineerRating.HOSTILE]: 'Hostile (1)',
      [EngineerRating.UNFAVORABLE]: 'Unfavorable (2)',
      [EngineerRating.NEUTRAL]: 'Neutral (3)',
      [EngineerRating.FAVORABLE]: 'Favorable (4)',
      [EngineerRating.CHAMPION]: 'Champion (5)'
    };
    return labels[rating] || 'Unknown';
  };





  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center">
          <Loader size="lg" />
          <Text>Loading engineer contacts...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <LoadingOverlay visible={loading} />
      
      {/* Header */}
      <Paper shadow="sm" p="md" mb="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={2}>Engineer Contact Database</Title>
            <Text size="sm" c="dimmed">
              Manage relationships with engineering contacts and track interactions
            </Text>
          </Stack>
          <Group gap="sm">
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => setShowAddModal(true)}
            >
              Add Engineer
            </Button>
            <Button variant="light">
              Import Contacts
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* Summary Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="md">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Stack gap="xs">
              <Text size="xl" fw={700} c="blue">
                {engineers.length}
              </Text>
              <Text size="sm" c="dimmed">
                Total Engineers
              </Text>
            </Stack>
            <IconUser size={24} color="var(--mantine-color-blue-6)" />
          </Group>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Stack gap="xs">
              <Text size="xl" fw={700} c="green">
                {engineers.filter(e => e.rating >= EngineerRating.FAVORABLE).length}
              </Text>
              <Text size="sm" c="dimmed">
                Favorable+ Rating
              </Text>
            </Stack>
            <IconStar size={24} color="var(--mantine-color-green-6)" />
          </Group>
        </Card>
        
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Stack gap="xs">
              <Text size="xl" fw={700} c="violet">
                {engineers.filter(e => e.opportunities.length > 0).length}
              </Text>
              <Text size="sm" c="dimmed">
                With Opportunities
              </Text>
            </Stack>
            <IconBuilding size={24} color="var(--mantine-color-violet-6)" />
          </Group>
        </Card>
        
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <Stack gap="xs">
              <Text size="xl" fw={700} c="orange">
                ${engineers.reduce((sum, e) => sum + e.totalOpportunityValue, 0).toLocaleString()}
              </Text>
              <Text size="sm" c="dimmed">
                Total Pipeline Value
              </Text>
            </Stack>
            <IconBuilding size={24} color="var(--mantine-color-orange-6)" />
          </Group>
        </Card>
      </SimpleGrid>



      {/* View Mode Controls */}
      <Paper shadow="sm" p="md" mb="md">
        <Group justify="space-between">
          <Group gap="md">
            <TextInput
              placeholder="Search engineers..."
              leftSection={<IconSearch size={16} />}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.currentTarget.value }))}
            />
            <Select
              placeholder="Rating"
              data={Object.values(EngineerRating).map(rating => ({ value: String(rating), label: String(rating) }))}
              onChange={(value) => setFilters(prev => ({ 
                ...prev, 
                ratings: value ? [value as unknown as EngineerRating] : undefined 
              }))}
              clearable
            />
          </Group>
          
          <SegmentedControl
            value={viewMode}
            onChange={(value) => setViewMode(value as 'grid' | 'list')}
            data={[
              {
                value: 'grid',
                label: (
                  <Group gap="xs">
                    <IconGrid3x3 size={16} />
                    <span>Grid</span>
                  </Group>
                )
              },
              {
                value: 'list',
                label: (
                  <Group gap="xs">
                    <IconList size={16} />
                    <span>List</span>
                  </Group>
                )
              }
            ]}
          />
        </Group>
      </Paper>

      {/* Engineers List/Grid */}
      {filteredEngineers.length === 0 ? (
        <Paper shadow="sm" p="xl">
          <Center>
            <Stack align="center" gap="md">
              <IconUser size={48} color="var(--mantine-color-gray-4)" />
              <Title order={3} c="dimmed">No engineers found</Title>
              <Text c="dimmed" ta="center">
                Try adjusting your filters or add new engineer contacts
              </Text>
              <Button onClick={() => setShowAddModal(true)}>
                Add Engineer
              </Button>
            </Stack>
          </Center>
        </Paper>
      ) : viewMode === 'grid' ? (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {filteredEngineers.map(engineer => renderEngineerCard(engineer))}
        </SimpleGrid>
      ) : (
        renderEngineerList()
      )}

      {/* Engineer Detail Modal */}
      <Modal
        opened={!!selectedEngineer && !showInteractionModal}
        onClose={() => setSelectedEngineer(null)}
        title={selectedEngineer ? `${selectedEngineer.personalInfo.firstName} ${selectedEngineer.personalInfo.lastName}` : ''}
        size="xl"
      >
        {selectedEngineer && (
          <Stack gap="md">
            <Group>
              <Avatar size="lg" color="blue">
                {selectedEngineer.personalInfo.firstName[0]}{selectedEngineer.personalInfo.lastName[0]}
              </Avatar>
              <Stack gap="xs">
                <Text size="lg" fw={500}>
                  {selectedEngineer.personalInfo.firstName} {selectedEngineer.personalInfo.lastName}
                </Text>
                <Text c="dimmed">{selectedEngineer.personalInfo.title}</Text>
                <Text size="sm" c="dimmed">{selectedEngineer.engineeringFirmId}</Text>
              </Stack>
            </Group>
            
            <Grid>
              <Grid.Col span={6}>
                <Stack gap="md">
                  <Title order={4}>Contact Information</Title>
                  <Stack gap="xs">
                    <Group>
                      <Text size="sm" fw={500} c="dimmed">Email:</Text>
                      <Anchor href={`mailto:${selectedEngineer.personalInfo.email}`} size="sm">
                        {selectedEngineer.personalInfo.email}
                      </Anchor>
                    </Group>
                    <Group>
                      <Text size="sm" fw={500} c="dimmed">Phone:</Text>
                      <Anchor href={`tel:${selectedEngineer.personalInfo.phone}`} size="sm">
                        {selectedEngineer.personalInfo.phone}
                      </Anchor>
                    </Group>
                    <Group>
                      <Text size="sm" fw={500} c="dimmed">Rating:</Text>
                      <Badge variant="light">{selectedEngineer.rating}</Badge>
                    </Group>
                  </Stack>
                </Stack>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <Stack gap="md">
                  <Title order={4}>Performance Metrics</Title>
                  <Stack gap="xs">
                    <Group>
                      <Text size="sm" fw={500} c="dimmed">Opportunities:</Text>
                      <Text size="sm">{selectedEngineer.opportunities.length}</Text>
                    </Group>
                    <Group>
                      <Text size="sm" fw={500} c="dimmed">Total Value:</Text>
                      <Text size="sm" fw={600} c="green">
                        ${selectedEngineer.totalOpportunityValue.toLocaleString()}
                      </Text>
                    </Group>
                    <Group>
                      <Text size="sm" fw={500} c="dimmed">Won Value:</Text>
                      <Text size="sm" fw={600} c="green">
                        ${selectedEngineer.wonOpportunityValue.toLocaleString()}
                      </Text>
                    </Group>
                    <Group>
                      <Text size="sm" fw={500} c="dimmed">Last Contact:</Text>
                      <Text size="sm">
                        {selectedEngineer.lastContactDate?.toLocaleDateString() || 'Never'}
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              </Grid.Col>
            </Grid>

            <Group mt="md" gap="sm">
              <Button onClick={() => setShowInteractionModal(true)}>
                Log Interaction
              </Button>
              <Button variant="light">
                Edit Contact
              </Button>
              <Button variant="light">
                View Opportunities
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}
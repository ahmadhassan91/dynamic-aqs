'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Badge,
  Button,
  SimpleGrid,
  Grid,
  Avatar,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  Select,
  Table,
  Checkbox,
  NumberInput,
  Divider,
  Alert,
  Tabs,
  Timeline,
  ThemeIcon,
  Tooltip,
  Menu,
  Pagination
} from '@mantine/core';
import {
  IconUsers,
  IconStar,
  IconTrendingUp,
  IconBuilding,
  IconPhone,
  IconMail,
  IconEdit,
  IconHistory,
  IconPackages,
  IconFilter,
  IconSearch,
  IconCheck,
  IconX,
  IconClock,
  IconUser,
  IconChevronDown,
  IconStarFilled,
  IconRefresh
} from '@tabler/icons-react';
import { CommercialLayout } from '@/components/layout/CommercialLayout';
import { commercialService } from '@/lib/services/commercialService';
import { EngineerContact, EngineerRating, RatingChange } from '@/types/commercial';

interface EngineerRatingData extends EngineerContact {
  selected?: boolean;
}

export default function EngineerRatingsPage() {
  const [engineers, setEngineers] = useState<EngineerRatingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEngineers, setSelectedEngineers] = useState<string[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [bulkUpdateModalOpen, setBulkUpdateModalOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<EngineerRatingData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Form states
  const [editRating, setEditRating] = useState<EngineerRating>(EngineerRating.NEUTRAL);
  const [editReason, setEditReason] = useState('');
  const [bulkRating, setBulkRating] = useState<EngineerRating>(EngineerRating.NEUTRAL);
  const [bulkReason, setBulkReason] = useState('');

  useEffect(() => {
    loadEngineers();
  }, []);

  const loadEngineers = async () => {
    try {
      setLoading(true);
      const engineerData = await commercialService.getEngineers();
      setEngineers(engineerData.map(eng => ({ ...eng, selected: false })));
    } catch (error) {
      console.error('Failed to load engineers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEngineers = engineers.filter(engineer => {
    const matchesSearch = !searchTerm || 
      engineer.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.personalInfo.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = !ratingFilter || engineer.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  const paginatedEngineers = filteredEngineers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);

  const handleEditRating = (engineer: EngineerRatingData) => {
    setSelectedEngineer(engineer);
    setEditRating(engineer.rating);
    setEditReason('');
    setEditModalOpen(true);
  };

  const handleViewHistory = (engineer: EngineerRatingData) => {
    setSelectedEngineer(engineer);
    setHistoryModalOpen(true);
  };

  const handleSaveRating = async () => {
    if (!selectedEngineer) return;

    try {
      const ratingChange: RatingChange = {
        previousRating: selectedEngineer.rating,
        newRating: editRating,
        reason: editReason,
        changedBy: 'current_user', // In real app, get from auth context
        changedAt: new Date()
      };

      const updatedEngineer = {
        ...selectedEngineer,
        rating: editRating,
        ratingHistory: [...selectedEngineer.ratingHistory, ratingChange],
        updatedAt: new Date()
      };

      await commercialService.updateEngineer(selectedEngineer.id, updatedEngineer);
      
      setEngineers(prev => prev.map(eng => 
        eng.id === selectedEngineer.id ? updatedEngineer : eng
      ));
      
      setEditModalOpen(false);
      setSelectedEngineer(null);
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedEngineers.length === 0) return;

    try {
      const updates = selectedEngineers.map(async (engineerId) => {
        const engineer = engineers.find(eng => eng.id === engineerId);
        if (!engineer) return;

        const ratingChange: RatingChange = {
          previousRating: engineer.rating,
          newRating: bulkRating,
          reason: bulkReason,
          changedBy: 'current_user',
          changedAt: new Date()
        };

        const updatedEngineer = {
          ...engineer,
          rating: bulkRating,
          ratingHistory: [...engineer.ratingHistory, ratingChange],
          updatedAt: new Date()
        };

        await commercialService.updateEngineer(engineer.id, updatedEngineer);
        return updatedEngineer;
      });

      const results = await Promise.all(updates);
      
      setEngineers(prev => prev.map(eng => {
        const updated = results.find(result => result?.id === eng.id);
        return updated || eng;
      }));

      setSelectedEngineers([]);
      setBulkUpdateModalOpen(false);
      setBulkReason('');
    } catch (error) {
      console.error('Failed to bulk update ratings:', error);
    }
  };

  const toggleEngineerSelection = (engineerId: string) => {
    setSelectedEngineers(prev => 
      prev.includes(engineerId) 
        ? prev.filter(id => id !== engineerId)
        : [...prev, engineerId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEngineers.length === paginatedEngineers.length) {
      setSelectedEngineers([]);
    } else {
      setSelectedEngineers(paginatedEngineers.map(eng => eng.id));
    }
  };

  const getRatingColor = (rating: EngineerRating) => {
    switch (rating) {
      case EngineerRating.CHAMPION: return 'green';
      case EngineerRating.FAVORABLE: return 'blue';
      case EngineerRating.NEUTRAL: return 'yellow';
      case EngineerRating.UNFAVORABLE: return 'orange';
      case EngineerRating.HOSTILE: return 'red';
      default: return 'gray';
    }
  };

  const getRatingLabel = (rating: EngineerRating) => {
    switch (rating) {
      case EngineerRating.CHAMPION: return 'Champion';
      case EngineerRating.FAVORABLE: return 'Favorable';
      case EngineerRating.NEUTRAL: return 'Neutral';
      case EngineerRating.UNFAVORABLE: return 'Unfavorable';
      case EngineerRating.HOSTILE: return 'Hostile';
      default: return 'Unknown';
    }
  };

  const getRatingStars = (rating: EngineerRating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconStar
        key={i}
        size={14}
        fill={i < rating ? 'currentColor' : 'none'}
        color={i < rating ? '#ffd43b' : '#ced4da'}
      />
    ));
  };

  const stats = [
    { 
      title: 'Total Engineers', 
      value: engineers.length.toString(), 
      icon: IconUsers, 
      color: 'blue' 
    },
    { 
      title: 'Champions (5)', 
      value: engineers.filter(eng => eng.rating === EngineerRating.CHAMPION).length.toString(), 
      icon: IconStarFilled, 
      color: 'green' 
    },
    { 
      title: 'Favorable (4+)', 
      value: engineers.filter(eng => eng.rating >= EngineerRating.FAVORABLE).length.toString(), 
      icon: IconTrendingUp, 
      color: 'blue' 
    },
    { 
      title: 'Need Attention (≤2)', 
      value: engineers.filter(eng => eng.rating <= EngineerRating.UNFAVORABLE).length.toString(), 
      icon: IconX, 
      color: 'red' 
    },
  ];

  return (
    <CommercialLayout>
      <Container size="xl" py="md">
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={1}>Engineer Rating Management</Title>
              <Text size="sm" c="dimmed">
                Manage and track engineer relationship ratings
              </Text>
            </div>
            <Group>
              <Button 
                leftSection={<IconRefresh size={16} />}
                variant="light"
                onClick={loadEngineers}
                loading={loading}
              >
                Refresh
              </Button>
              <Button 
                leftSection={<IconPackages size={16} />}
                disabled={selectedEngineers.length === 0}
                onClick={() => setBulkUpdateModalOpen(true)}
              >
                Bulk Update ({selectedEngineers.length})
              </Button>
            </Group>
          </Group>

          {/* Stats */}
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
            {stats.map((stat) => (
              <Card key={stat.title} withBorder padding="lg">
                <Group justify="space-between">
                  <Stack gap="xs">
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                      {stat.title}
                    </Text>
                    <Text size="xl" fw={700}>
                      {stat.value}
                    </Text>
                  </Stack>
                  <ThemeIcon size="lg" variant="light" color={stat.color}>
                    <stat.icon size={20} />
                  </ThemeIcon>
                </Group>
              </Card>
            ))}
          </SimpleGrid>

          {/* Filters */}
          <Card withBorder padding="md">
            <Group justify="space-between">
              <Group>
                <TextInput
                  placeholder="Search engineers..."
                  leftSection={<IconSearch size={16} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ minWidth: 250 }}
                />
                <Select
                  placeholder="Filter by rating"
                  leftSection={<IconFilter size={16} />}
                  data={[
                    { value: '', label: 'All Ratings' },
                    { value: '5', label: '5 - Champion' },
                    { value: '4', label: '4 - Favorable' },
                    { value: '3', label: '3 - Neutral' },
                    { value: '2', label: '2 - Unfavorable' },
                    { value: '1', label: '1 - Hostile' }
                  ]}
                  value={ratingFilter}
                  onChange={(value) => setRatingFilter(value || '')}
                  clearable
                />
              </Group>
              <Group>
                <Checkbox
                  label="Select All"
                  checked={selectedEngineers.length === paginatedEngineers.length && paginatedEngineers.length > 0}
                  indeterminate={selectedEngineers.length > 0 && selectedEngineers.length < paginatedEngineers.length}
                  onChange={toggleSelectAll}
                />
                <Text size="sm" c="dimmed">
                  {filteredEngineers.length} engineers
                </Text>
              </Group>
            </Group>
          </Card>

          {/* Engineers Grid */}
          <div>
            <Grid>
              {paginatedEngineers.map((engineer) => (
                <Grid.Col key={engineer.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <Card withBorder padding="lg" radius="md" h="100%">
                    <Stack gap="md">
                      {/* Header with Selection */}
                      <Group justify="space-between">
                        <Group gap="sm">
                          <Checkbox
                            checked={selectedEngineers.includes(engineer.id)}
                            onChange={() => toggleEngineerSelection(engineer.id)}
                          />
                          <Avatar size="md" radius="xl" color="blue">
                            {engineer.personalInfo.firstName[0]}{engineer.personalInfo.lastName[0]}
                          </Avatar>
                          <div>
                            <Text fw={600} size="sm">
                              {engineer.personalInfo.firstName} {engineer.personalInfo.lastName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {engineer.personalInfo.title}
                            </Text>
                          </div>
                        </Group>
                        <Menu>
                          <Menu.Target>
                            <ActionIcon variant="subtle" size="sm">
                              <IconChevronDown size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item 
                              leftSection={<IconEdit size={14} />}
                              onClick={() => handleEditRating(engineer)}
                            >
                              Edit Rating
                            </Menu.Item>
                            <Menu.Item 
                              leftSection={<IconHistory size={14} />}
                              onClick={() => handleViewHistory(engineer)}
                            >
                              View History
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>

                      {/* Company */}
                      <Group gap="xs">
                        <IconBuilding size={14} />
                        <Text size="sm" fw={500}>{engineer.personalInfo.company}</Text>
                      </Group>

                      {/* Current Rating */}
                      <Card withBorder padding="sm" bg="gray.0">
                        <Group justify="space-between" mb="xs">
                          <Text size="sm" fw={600}>Current Rating</Text>
                          <Badge variant="filled" color={getRatingColor(engineer.rating)} size="lg">
                            {engineer.rating}/5
                          </Badge>
                        </Group>
                        <Group justify="space-between">
                          <Group gap="xs">
                            {getRatingStars(engineer.rating)}
                          </Group>
                          <Text size="sm" fw={500} c={getRatingColor(engineer.rating)}>
                            {getRatingLabel(engineer.rating)}
                          </Text>
                        </Group>
                      </Card>

                      {/* Rating History Summary */}
                      {engineer.ratingHistory.length > 0 && (
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">
                            Last updated: {new Date(engineer.ratingHistory[engineer.ratingHistory.length - 1].changedAt).toLocaleDateString()}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {engineer.ratingHistory.length} changes
                          </Text>
                        </Group>
                      )}

                      {/* Performance Metrics */}
                      <SimpleGrid cols={2} spacing="xs">
                        <div>
                          <Text size="xs" c="dimmed">Opportunities</Text>
                          <Text size="sm" fw={600}>{engineer.opportunities.length}</Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">Total Value</Text>
                          <Text size="sm" fw={600}>${(engineer.totalOpportunityValue / 1000).toFixed(0)}K</Text>
                        </div>
                      </SimpleGrid>

                      {/* Contact Info */}
                      <Stack gap="xs">
                        <Group gap="xs">
                          <IconMail size={14} />
                          <Text size="xs" c="dimmed" truncate>{engineer.personalInfo.email}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconPhone size={14} />
                          <Text size="xs" c="dimmed">{engineer.personalInfo.phone}</Text>
                        </Group>
                      </Stack>

                      {/* Action Buttons */}
                      <Group grow>
                        <Button 
                          variant="light" 
                          size="xs"
                          leftSection={<IconEdit size={14} />}
                          onClick={() => handleEditRating(engineer)}
                        >
                          Edit Rating
                        </Button>
                        <Button 
                          variant="outline" 
                          size="xs"
                          leftSection={<IconHistory size={14} />}
                          onClick={() => handleViewHistory(engineer)}
                        >
                          History
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Group justify="center" mt="xl">
                <Pagination
                  value={currentPage}
                  onChange={setCurrentPage}
                  total={totalPages}
                  size="sm"
                />
              </Group>
            )}
          </div>
        </Stack>
      </Container>

      {/* Edit Rating Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Engineer Rating"
        size="md"
      >
        {selectedEngineer && (
          <Stack gap="md">
            <Group>
              <Avatar size="lg" radius="xl" color="blue">
                {selectedEngineer.personalInfo.firstName[0]}{selectedEngineer.personalInfo.lastName[0]}
              </Avatar>
              <div>
                <Text fw={600}>
                  {selectedEngineer.personalInfo.firstName} {selectedEngineer.personalInfo.lastName}
                </Text>
                <Text size="sm" c="dimmed">
                  {selectedEngineer.personalInfo.company}
                </Text>
                <Group gap="xs" mt="xs">
                  <Text size="sm">Current:</Text>
                  <Badge color={getRatingColor(selectedEngineer.rating)}>
                    {selectedEngineer.rating}/5 - {getRatingLabel(selectedEngineer.rating)}
                  </Badge>
                </Group>
              </div>
            </Group>

            <Divider />

            <Select
              label="New Rating"
              placeholder="Select rating"
              data={[
                { value: '5', label: '5 - Champion' },
                { value: '4', label: '4 - Favorable' },
                { value: '3', label: '3 - Neutral' },
                { value: '2', label: '2 - Unfavorable' },
                { value: '1', label: '1 - Hostile' }
              ]}
              value={editRating.toString()}
              onChange={(value) => setEditRating(parseInt(value || '3') as EngineerRating)}
              required
            />

            <Textarea
              label="Reason for Change"
              placeholder="Explain why you're changing this rating..."
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              required
              minRows={3}
            />

            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveRating}
                disabled={!editReason.trim()}
              >
                Save Rating
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Rating History Modal */}
      <Modal
        opened={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title="Rating History"
        size="lg"
      >
        {selectedEngineer && (
          <Stack gap="md">
            <Group>
              <Avatar size="lg" radius="xl" color="blue">
                {selectedEngineer.personalInfo.firstName[0]}{selectedEngineer.personalInfo.lastName[0]}
              </Avatar>
              <div>
                <Text fw={600}>
                  {selectedEngineer.personalInfo.firstName} {selectedEngineer.personalInfo.lastName}
                </Text>
                <Text size="sm" c="dimmed">
                  {selectedEngineer.personalInfo.company}
                </Text>
              </div>
            </Group>

            <Divider />

            {selectedEngineer.ratingHistory.length === 0 ? (
              <Alert icon={<IconClock size={16} />} color="blue">
                No rating history available. This engineer has not had any rating changes yet.
              </Alert>
            ) : (
              <Timeline active={selectedEngineer.ratingHistory.length} bulletSize={24} lineWidth={2}>
                {selectedEngineer.ratingHistory.map((change, index) => (
                  <Timeline.Item
                    key={index}
                    bullet={<IconUser size={12} />}
                    title={
                      <Group gap="xs">
                        <Text size="sm" fw={500}>
                          Rating changed from {change.previousRating} to {change.newRating}
                        </Text>
                        <Badge color={getRatingColor(change.newRating)} size="sm">
                          {getRatingLabel(change.newRating)}
                        </Badge>
                      </Group>
                    }
                  >
                    <Text size="xs" c="dimmed" mb="xs">
                      {new Date(change.changedAt).toLocaleString()} by {change.changedBy}
                    </Text>
                    <Text size="sm">{change.reason}</Text>
                  </Timeline.Item>
                ))}
                
                {/* Initial rating */}
                <Timeline.Item
                  bullet={<IconStarFilled size={12} />}
                  title="Initial Rating"
                >
                  <Text size="xs" c="dimmed">
                    Engineer added to system
                  </Text>
                </Timeline.Item>
              </Timeline>
            )}
          </Stack>
        )}
      </Modal>

      {/* Bulk Update Modal */}
      <Modal
        opened={bulkUpdateModalOpen}
        onClose={() => setBulkUpdateModalOpen(false)}
        title="Bulk Rating Update"
        size="md"
      >
        <Stack gap="md">
          <Alert icon={<IconPackages size={16} />} color="blue">
            You are about to update ratings for {selectedEngineers.length} engineers.
          </Alert>

          <Select
            label="New Rating"
            placeholder="Select rating for all selected engineers"
            data={[
              { value: '5', label: '5 - Champion' },
              { value: '4', label: '4 - Favorable' },
              { value: '3', label: '3 - Neutral' },
              { value: '2', label: '2 - Unfavorable' },
              { value: '1', label: '1 - Hostile' }
            ]}
            value={bulkRating.toString()}
            onChange={(value) => setBulkRating(parseInt(value || '3') as EngineerRating)}
            required
          />

          <Textarea
            label="Reason for Bulk Change"
            placeholder="Explain why you're changing these ratings..."
            value={bulkReason}
            onChange={(e) => setBulkReason(e.target.value)}
            required
            minRows={3}
          />

          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setBulkUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkUpdate}
              disabled={!bulkReason.trim()}
              color="orange"
            >
              Update {selectedEngineers.length} Engineers
            </Button>
          </Group>
        </Stack>
      </Modal>
    </CommercialLayout>
  );
}
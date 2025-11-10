'use client';

import { useState } from 'react';
import {
  Card,
  Group,
  Button,
  TextInput,
  Select,
  MultiSelect,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Collapse,
  Divider,
  NumberInput,
  Switch,
  Modal,
  Title,
} from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  IconSearch,
  IconFilter,
  IconX,
  IconDeviceFloppy,
  IconTrash,
  IconChevronDown,
  IconChevronUp,
  IconSettings,
} from '@tabler/icons-react';
import type { Activity } from './ActivityTimeline';

export interface ActivitySearchCriteria {
  searchQuery: string;
  activityTypes: string[];
  outcomes: string[];
  categories: string[];
  priorities: string[];
  sources: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  followUpRequired?: boolean;
  hasParticipants?: boolean;
  hasTags?: boolean;
  durationRange: {
    min: number | null;
    max: number | null;
  };
  tags: string[];
  participants: string[];
  customers: string[];
  createdBy: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  criteria: ActivitySearchCriteria;
  isDefault?: boolean;
  createdAt: Date;
  lastUsed: Date;
}

interface ActivitySearchFiltersProps {
  onSearch: (criteria: ActivitySearchCriteria) => void;
  onReset: () => void;
  availableTags?: string[];
  availableParticipants?: string[];
  availableCustomers?: { value: string; label: string }[];
  availableUsers?: { value: string; label: string }[];
  initialCriteria?: Partial<ActivitySearchCriteria>;
}

const defaultCriteria: ActivitySearchCriteria = {
  searchQuery: '',
  activityTypes: [],
  outcomes: [],
  categories: [],
  priorities: [],
  sources: [],
  dateRange: { start: null, end: null },
  followUpRequired: undefined,
  hasParticipants: undefined,
  hasTags: undefined,
  durationRange: { min: null, max: null },
  tags: [],
  participants: [],
  customers: [],
  createdBy: [],
};

// Mock saved searches - in real app, this would come from a service
const mockSavedSearches: SavedSearch[] = [
  {
    id: '1',
    name: 'High Priority Follow-ups',
    criteria: {
      ...defaultCriteria,
      priorities: ['high', 'urgent'],
      followUpRequired: true,
    },
    createdAt: new Date('2024-01-15'),
    lastUsed: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'This Week Sales Activities',
    criteria: {
      ...defaultCriteria,
      categories: ['sales'],
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    },
    isDefault: true,
    createdAt: new Date('2024-01-10'),
    lastUsed: new Date('2024-01-22'),
  },
  {
    id: '3',
    name: 'Training Sessions',
    criteria: {
      ...defaultCriteria,
      activityTypes: ['training'],
      outcomes: ['completed', 'positive'],
    },
    createdAt: new Date('2024-01-12'),
    lastUsed: new Date('2024-01-18'),
  },
];

export function ActivitySearchFilters({
  onSearch,
  onReset,
  availableTags = [],
  availableParticipants = [],
  availableCustomers = [],
  availableUsers = [],
  initialCriteria = {},
}: ActivitySearchFiltersProps) {
  const [criteria, setCriteria] = useState<ActivitySearchCriteria>({
    ...defaultCriteria,
    ...initialCriteria,
  });
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(mockSavedSearches);
  const [advancedOpen, { toggle: toggleAdvanced }] = useDisclosure(false);
  const [saveModalOpened, { open: openSaveModal, close: closeSaveModal }] = useDisclosure(false);

  const saveForm = useForm({
    initialValues: {
      name: '',
      setAsDefault: false,
    },
  });

  const activityTypeOptions = [
    { value: 'call', label: 'Phone Call' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'training', label: 'Training' },
    { value: 'visit', label: 'Site Visit' },
    { value: 'quote', label: 'Quote' },
    { value: 'order', label: 'Order' },
    { value: 'note', label: 'Note' },
    { value: 'system', label: 'System Activity' },
  ];

  const outcomeOptions = [
    { value: 'positive', label: 'Positive' },
    { value: 'negative', label: 'Negative' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const categoryOptions = [
    { value: 'sales', label: 'Sales' },
    { value: 'support', label: 'Support' },
    { value: 'training', label: 'Training' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'technical', label: 'Technical' },
    { value: 'marketing', label: 'Marketing' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const sourceOptions = [
    { value: 'manual', label: 'Manual Entry' },
    { value: 'automatic', label: 'Automatic' },
    { value: 'system', label: 'System Generated' },
    { value: 'integration', label: 'Integration' },
  ];

  const handleSearch = () => {
    onSearch(criteria);
  };

  const handleReset = () => {
    setCriteria(defaultCriteria);
    onReset();
  };

  const handleQuickFilter = (filterName: string, value: any) => {
    const newCriteria = { ...criteria };
    
    switch (filterName) {
      case 'today':
        newCriteria.dateRange = {
          start: new Date(),
          end: new Date(),
        };
        break;
      case 'thisWeek':
        newCriteria.dateRange = {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date(),
        };
        break;
      case 'thisMonth':
        newCriteria.dateRange = {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(),
        };
        break;
      case 'followUps':
        newCriteria.followUpRequired = true;
        break;
      case 'highPriority':
        newCriteria.priorities = ['high', 'urgent'];
        break;
      case 'sales':
        newCriteria.categories = ['sales'];
        break;
      case 'support':
        newCriteria.categories = ['support'];
        break;
    }
    
    setCriteria(newCriteria);
    onSearch(newCriteria);
  };

  const handleSavedSearchSelect = (searchId: string) => {
    const savedSearch = savedSearches.find(s => s.id === searchId);
    if (savedSearch) {
      setCriteria(savedSearch.criteria);
      onSearch(savedSearch.criteria);
      
      // Update last used date
      setSavedSearches(prev => 
        prev.map(s => 
          s.id === searchId 
            ? { ...s, lastUsed: new Date() }
            : s
        )
      );
    }
  };

  const handleSaveSearch = (values: typeof saveForm.values) => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: values.name,
      criteria: { ...criteria },
      isDefault: values.setAsDefault,
      createdAt: new Date(),
      lastUsed: new Date(),
    };

    setSavedSearches(prev => {
      const updated = values.setAsDefault 
        ? prev.map(s => ({ ...s, isDefault: false }))
        : prev;
      return [...updated, newSearch];
    });

    closeSaveModal();
    saveForm.reset();
  };

  const handleDeleteSavedSearch = (searchId: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== searchId));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (criteria.searchQuery) count++;
    if (criteria.activityTypes.length > 0) count++;
    if (criteria.outcomes.length > 0) count++;
    if (criteria.categories.length > 0) count++;
    if (criteria.priorities.length > 0) count++;
    if (criteria.sources.length > 0) count++;
    if (criteria.dateRange.start || criteria.dateRange.end) count++;
    if (criteria.followUpRequired !== undefined) count++;
    if (criteria.hasParticipants !== undefined) count++;
    if (criteria.hasTags !== undefined) count++;
    if (criteria.durationRange.min !== null || criteria.durationRange.max !== null) count++;
    if (criteria.tags.length > 0) count++;
    if (criteria.participants.length > 0) count++;
    if (criteria.customers.length > 0) count++;
    if (criteria.createdBy.length > 0) count++;
    return count;
  };

  return (
    <Card withBorder p="md">
      {/* Basic Search */}
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={500} size="lg">Search & Filter Activities</Text>
          <Group gap="xs">
            {getActiveFiltersCount() > 0 && (
              <Badge variant="filled" size="sm">
                {getActiveFiltersCount()} active
              </Badge>
            )}
            <Button
              variant="light"
              size="sm"
              leftSection={<IconSettings size={14} />}
              onClick={openSaveModal}
            >
              Save Search
            </Button>
          </Group>
        </Group>

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div>
            <Text size="sm" fw={500} mb="xs">Quick Searches:</Text>
            <Group gap="xs">
              {savedSearches.map((search) => (
                <Group key={search.id} gap={4}>
                  <Button
                    variant={search.isDefault ? "filled" : "light"}
                    size="xs"
                    onClick={() => handleSavedSearchSelect(search.id)}
                  >
                    {search.name}
                  </Button>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={() => handleDeleteSavedSearch(search.id)}
                  >
                    <IconX size={10} />
                  </ActionIcon>
                </Group>
              ))}
            </Group>
          </div>
        )}

        {/* Quick Filters */}
        <div>
          <Text size="sm" fw={500} mb="xs">Quick Filters:</Text>
          <Group gap="xs">
            <Button variant="light" size="xs" onClick={() => handleQuickFilter('today', null)}>
              Today
            </Button>
            <Button variant="light" size="xs" onClick={() => handleQuickFilter('thisWeek', null)}>
              This Week
            </Button>
            <Button variant="light" size="xs" onClick={() => handleQuickFilter('thisMonth', null)}>
              This Month
            </Button>
            <Button variant="light" size="xs" onClick={() => handleQuickFilter('followUps', null)}>
              Follow-ups Due
            </Button>
            <Button variant="light" size="xs" onClick={() => handleQuickFilter('highPriority', null)}>
              High Priority
            </Button>
            <Button variant="light" size="xs" onClick={() => handleQuickFilter('sales', null)}>
              Sales Activities
            </Button>
            <Button variant="light" size="xs" onClick={() => handleQuickFilter('support', null)}>
              Support Activities
            </Button>
          </Group>
        </div>

        {/* Main Search */}
        <Group gap="md" align="end">
          <TextInput
            placeholder="Search activities, descriptions, tags..."
            leftSection={<IconSearch size={16} />}
            value={criteria.searchQuery}
            onChange={(event) => setCriteria(prev => ({ 
              ...prev, 
              searchQuery: event.currentTarget.value 
            }))}
            style={{ flex: 1 }}
          />
          <MultiSelect
            placeholder="Activity Types"
            data={activityTypeOptions}
            value={criteria.activityTypes}
            onChange={(value) => setCriteria(prev => ({ 
              ...prev, 
              activityTypes: value 
            }))}
            w={150}
            clearable
          />
          <MultiSelect
            placeholder="Outcomes"
            data={outcomeOptions}
            value={criteria.outcomes}
            onChange={(value) => setCriteria(prev => ({ 
              ...prev, 
              outcomes: value 
            }))}
            w={150}
            clearable
          />
          <Button
            leftSection={advancedOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            variant="light"
            onClick={toggleAdvanced}
          >
            Advanced
          </Button>
        </Group>

        {/* Advanced Filters */}
        <Collapse in={advancedOpen}>
          <Divider my="md" />
          <Stack gap="md">
            <Group grow>
              <MultiSelect
                label="Categories"
                placeholder="Select categories"
                data={categoryOptions}
                value={criteria.categories}
                onChange={(value) => setCriteria(prev => ({ 
                  ...prev, 
                  categories: value 
                }))}
                clearable
              />
              <MultiSelect
                label="Priorities"
                placeholder="Select priorities"
                data={priorityOptions}
                value={criteria.priorities}
                onChange={(value) => setCriteria(prev => ({ 
                  ...prev, 
                  priorities: value 
                }))}
                clearable
              />
              <MultiSelect
                label="Sources"
                placeholder="Select sources"
                data={sourceOptions}
                value={criteria.sources}
                onChange={(value) => setCriteria(prev => ({ 
                  ...prev, 
                  sources: value 
                }))}
                clearable
              />
            </Group>

            <Group grow>              <DatePickerInput
                label="Start Date"
                placeholder="Select start date"
                value={criteria.dateRange.start}
                onChange={(value) => setCriteria(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, start: value as Date | null }
                }))}
                clearable
              />
              <DatePickerInput
                label="End Date"
                placeholder="Select end date"
                value={criteria.dateRange.end}
                onChange={(value) => setCriteria(prev => ({ 
                  ...prev,
                  dateRange: { ...prev.dateRange, end: value as Date | null }
                }))}
                clearable
              />
            </Group>

            <Group grow>
              <NumberInput
                label="Min Duration (minutes)"
                placeholder="0"
                min={0}
                value={criteria.durationRange.min ?? undefined}
                onChange={(value) => setCriteria(prev => ({ 
                  ...prev, 
                  durationRange: { ...prev.durationRange, min: typeof value === 'number' ? value : null }
                }))}
              />
              <NumberInput
                label="Max Duration (minutes)"
                placeholder="480"
                min={0}
                value={criteria.durationRange.max ?? undefined}
                onChange={(value) => setCriteria(prev => ({ 
                  ...prev, 
                  durationRange: { ...prev.durationRange, max: typeof value === 'number' ? value : null }
                }))}
              />
            </Group>

            <Group grow>
              <MultiSelect
                label="Tags"
                placeholder="Select tags"
                data={availableTags}
                value={criteria.tags}
                onChange={(value) => setCriteria(prev => ({ 
                  ...prev, 
                  tags: value 
                }))}
                searchable
                clearable
              />
              <MultiSelect
                label="Participants"
                placeholder="Select participants"
                data={availableParticipants}
                value={criteria.participants}
                onChange={(value) => setCriteria(prev => ({ 
                  ...prev, 
                  participants: value 
                }))}
                searchable
                clearable
              />
            </Group>

            {availableCustomers.length > 0 && (
              <Group grow>
                <MultiSelect
                  label="Customers"
                  placeholder="Select customers"
                  data={availableCustomers}
                  value={criteria.customers}
                  onChange={(value) => setCriteria(prev => ({ 
                    ...prev, 
                    customers: value 
                  }))}
                  searchable
                  clearable
                />
                <MultiSelect
                  label="Created By"
                  placeholder="Select users"
                  data={availableUsers}
                  value={criteria.createdBy}
                  onChange={(value) => setCriteria(prev => ({ 
                    ...prev, 
                    createdBy: value 
                  }))}
                  searchable
                  clearable
                />
              </Group>
            )}

            <Group>
              <Switch
                label="Has follow-up required"
                checked={criteria.followUpRequired === true}
                onChange={(event) => setCriteria(prev => ({ 
                  ...prev, 
                  followUpRequired: event.currentTarget.checked ? true : undefined
                }))}
              />
              <Switch
                label="Has participants"
                checked={criteria.hasParticipants === true}
                onChange={(event) => setCriteria(prev => ({ 
                  ...prev, 
                  hasParticipants: event.currentTarget.checked ? true : undefined
                }))}
              />
              <Switch
                label="Has tags"
                checked={criteria.hasTags === true}
                onChange={(event) => setCriteria(prev => ({ 
                  ...prev, 
                  hasTags: event.currentTarget.checked ? true : undefined
                }))}
              />
            </Group>
          </Stack>
        </Collapse>

        {/* Action Buttons */}
        <Group justify="flex-end">
          <Button variant="light" onClick={handleReset} leftSection={<IconX size={16} />}>
            Clear All
          </Button>
          <Button onClick={handleSearch} leftSection={<IconFilter size={16} />}>
            Apply Filters
          </Button>
        </Group>
      </Stack>

      {/* Save Search Modal */}
      <Modal
        opened={saveModalOpened}
        onClose={closeSaveModal}
        title="Save Search"
        size="sm"
      >
        <form onSubmit={saveForm.onSubmit(handleSaveSearch)}>
          <Stack gap="md">
            <TextInput
              label="Search Name"
              placeholder="Enter a name for this search"
              {...saveForm.getInputProps('name')}
              required
            />
            <Switch
              label="Set as default search"
              description="This search will be applied automatically when you visit the activities page"
              {...saveForm.getInputProps('setAsDefault')}
            />
            <Group justify="flex-end">
              <Button variant="light" onClick={closeSaveModal}>
                Cancel
              </Button>
              <Button type="submit" leftSection={<IconDeviceFloppy size={16} />}>
                Save Search
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Card>
  );
}
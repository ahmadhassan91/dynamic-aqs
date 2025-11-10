'use client';

import { useState } from 'react';
import {
  Paper,
  Title,
  Stack,
  Group,
  Button,
  Select,
  NumberInput,
  Collapse,
  Badge,
  CloseButton,
  SimpleGrid,
  TextInput
} from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface ReportFiltersProps {
  filters: {
    dateRange: string;
    territory: string;
    region: string;
    manager: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function ReportFilters({ filters, onFiltersChange }: ReportFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: 'last-30-days',
      territory: 'all',
      region: 'all',
      manager: 'all'
    };
    onFiltersChange(defaultFilters);
  };

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'this-quarter', label: 'This Quarter' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'this-year', label: 'This Year' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const territoryOptions = [
    { value: 'all', label: 'All Territories' },
    { value: 'northeast', label: 'Northeast' },
    { value: 'southeast', label: 'Southeast' },
    { value: 'midwest', label: 'Midwest' },
    { value: 'southwest', label: 'Southwest' },
    { value: 'west-coast', label: 'West Coast' },
    { value: 'northwest', label: 'Northwest' }
  ];

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'eastern', label: 'Eastern Region' },
    { value: 'central', label: 'Central Region' },
    { value: 'western', label: 'Western Region' }
  ];

  const managerOptions = [
    { value: 'all', label: 'All Managers' },
    { value: 'john-smith', label: 'John Smith' },
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'mike-davis', label: 'Mike Davis' },
    { value: 'lisa-wilson', label: 'Lisa Wilson' },
    { value: 'david-brown', label: 'David Brown' }
  ];

  return (
    <Paper shadow="sm" p="md">
      <Group justify="space-between" mb="md">
        <Title order={3}>Report Filters</Title>
        <Group gap="sm">
          <Button variant="subtle" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button
            variant="light"
            onClick={() => setIsExpanded(!isExpanded)}
            rightSection={isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          >
            {isExpanded ? 'Collapse' : 'Expand'} Filters
          </Button>
        </Group>
      </Group>

      {/* Basic Filters - Always Visible */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="md">
        <Select
          label="Date Range"
          value={filters.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value || 'last-30-days')}
          data={dateRangeOptions}
        />

        <Select
          label="Territory"
          value={filters.territory}
          onChange={(value) => handleFilterChange('territory', value || 'all')}
          data={territoryOptions}
        />

        <Select
          label="Region"
          value={filters.region}
          onChange={(value) => handleFilterChange('region', value || 'all')}
          data={regionOptions}
        />

        <Select
          label="Manager"
          value={filters.manager}
          onChange={(value) => handleFilterChange('manager', value || 'all')}
          data={managerOptions}
        />
      </SimpleGrid>

      {/* Advanced Filters - Expandable */}
      <Collapse in={isExpanded}>
        <Stack gap="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          <Title order={4}>Advanced Filters</Title>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            <Select
              label="Customer Status"
              placeholder="All Statuses"
              data={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'prospect', label: 'Prospect' }
              ]}
            />

            <Select
              label="Affinity Group"
              placeholder="All Groups"
              data={[
                { value: 'all', label: 'All Groups' },
                { value: 'hvac-excellence', label: 'HVAC Excellence Alliance' },
                { value: 'comfort-systems', label: 'Comfort Systems Network' },
                { value: 'independent', label: 'Independent Dealers Association' }
              ]}
            />

            <Select
              label="Order Status"
              placeholder="All Orders"
              data={[
                { value: 'all', label: 'All Orders' },
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'shipped', label: 'Shipped' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
            />

            <Select
              label="Training Status"
              placeholder="All Training"
              data={[
                { value: 'all', label: 'All Training' },
                { value: 'completed', label: 'Completed' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'overdue', label: 'Overdue' }
              ]}
            />

            <Select
              label="Lead Source"
              placeholder="All Sources"
              data={[
                { value: 'all', label: 'All Sources' },
                { value: 'hubspot', label: 'HubSpot' },
                { value: 'referral', label: 'Referral' },
                { value: 'website', label: 'Website' },
                { value: 'trade-show', label: 'Trade Show' }
              ]}
            />
          </SimpleGrid>

          {/* Revenue Range */}
          <Group grow>
            <NumberInput
              label="Min Revenue"
              placeholder="0"
              min={0}
              thousandSeparator=","
              prefix="$"
            />
            <NumberInput
              label="Max Revenue"
              placeholder="No limit"
              min={0}
              thousandSeparator=","
              prefix="$"
            />
          </Group>

          {/* Custom Date Range */}
          {filters.dateRange === 'custom' && (
            <Paper p="md" bg="gray.0">
              <Title order={5} mb="md">Custom Date Range</Title>
              <Group grow>
                <TextInput
                  label="Start Date"
                  placeholder="YYYY-MM-DD"
                  type="date"
                />
                <TextInput
                  label="End Date"
                  placeholder="YYYY-MM-DD"
                  type="date"
                />
              </Group>
            </Paper>
          )}
        </Stack>
      </Collapse>

      {/* Filter Summary */}
      <Group gap="xs" mt="md">
        {Object.entries(filters).map(([key, value]) => {
          if (value === 'all' || !value) return null;

          const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
          const displayValue = value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

          return (
            <Badge
              key={key}
              variant="light"
              color="blue"
              rightSection={
                <CloseButton
                  size="xs"
                  onClick={() => handleFilterChange(key, 'all')}
                />
              }
            >
              {label}: {displayValue}
            </Badge>
          );
        })}
      </Group>
    </Paper>
  );
}
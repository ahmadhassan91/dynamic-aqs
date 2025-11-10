'use client';

import { useState, useEffect } from 'react';
import {
  Menu,
  Button,
  Text,
  Group,
  Badge,
  ActionIcon,
  Divider,
  Stack,
  Box,
} from '@mantine/core';
import {
  IconBookmark,
  IconSearch,
  IconStar,
  IconClock,
  IconChevronDown,
} from '@tabler/icons-react';
import { SavedSearch, SearchCriteria } from './SavedSearchManager';
import { SavedSearchService } from '@/lib/services/savedSearchService';

interface QuickSearchAccessProps {
  onApplySearch: (criteria: SearchCriteria) => void;
}

export function QuickSearchAccess({ onApplySearch }: QuickSearchAccessProps) {
  const [favoriteSearches, setFavoriteSearches] = useState<SavedSearch[]>([]);
  const [frequentSearches, setFrequentSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuickAccessSearches();
  }, []);

  const loadQuickAccessSearches = async () => {
    try {
      setLoading(true);
      const [favorites, frequent] = await Promise.all([
        SavedSearchService.getFavoriteSearches(),
        SavedSearchService.getFrequentlyUsedSearches(),
      ]);
      setFavoriteSearches(favorites.slice(0, 3));
      setFrequentSearches(frequent.slice(0, 3));
    } catch (error) {
      console.error('Failed to load quick access searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySearch = async (search: SavedSearch) => {
    try {
      await SavedSearchService.recordSearchUsage(search.id);
      onApplySearch(search.criteria);
      // Refresh the lists to update usage counts
      loadQuickAccessSearches();
    } catch (error) {
      console.error('Failed to record search usage:', error);
      // Still apply the search even if usage tracking fails
      onApplySearch(search.criteria);
    }
  };

  const formatSearchSummary = (criteria: SearchCriteria) => {
    const parts = [];
    if (criteria.searchQuery) parts.push(`"${criteria.searchQuery}"`);
    if (criteria.selectedCategory !== 'All Categories') parts.push(criteria.selectedCategory);
    if (criteria.selectedBrand !== 'All Brands') parts.push(criteria.selectedBrand);
    return parts.join(' • ') || 'All Products';
  };

  if (loading) {
    return (
      <Button variant="subtle" size="sm" loading>
        Quick Search
      </Button>
    );
  }

  const hasQuickSearches = favoriteSearches.length > 0 || frequentSearches.length > 0;

  if (!hasQuickSearches) {
    return null;
  }

  return (
    <Menu shadow="md" width={320} position="bottom-end">
      <Menu.Target>
        <Button
          variant="subtle"
          size="sm"
          leftSection={<IconBookmark size={16} />}
          rightSection={<IconChevronDown size={14} />}
        >
          Quick Search
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Quick Access to Saved Searches</Menu.Label>

        {favoriteSearches.length > 0 && (
          <>
            <Menu.Label>
              <Group gap="xs">
                <IconStar size={14} />
                <Text>Favorites</Text>
              </Group>
            </Menu.Label>
            {favoriteSearches.map((search) => (
              <Menu.Item
                key={`fav-${search.id}`}
                onClick={() => handleApplySearch(search)}
              >
                <Stack gap={2}>
                  <Group justify="space-between" align="center">
                    <Text size="sm" fw={500} lineClamp={1}>
                      {search.name}
                    </Text>
                    <Badge size="xs" variant="dot">
                      {search.useCount}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {formatSearchSummary(search.criteria)}
                  </Text>
                </Stack>
              </Menu.Item>
            ))}
          </>
        )}

        {favoriteSearches.length > 0 && frequentSearches.length > 0 && (
          <Menu.Divider />
        )}

        {frequentSearches.length > 0 && (
          <>
            <Menu.Label>
              <Group gap="xs">
                <IconClock size={14} />
                <Text>Frequently Used</Text>
              </Group>
            </Menu.Label>
            {frequentSearches.map((search) => (
              <Menu.Item
                key={`freq-${search.id}`}
                onClick={() => handleApplySearch(search)}
              >
                <Stack gap={2}>
                  <Group justify="space-between" align="center">
                    <Text size="sm" fw={500} lineClamp={1}>
                      {search.name}
                    </Text>
                    <Badge size="xs" variant="dot">
                      {search.useCount}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {formatSearchSummary(search.criteria)}
                  </Text>
                </Stack>
              </Menu.Item>
            ))}
          </>
        )}

        <Menu.Divider />
        <Menu.Item
          leftSection={<IconSearch size={14} />}
          component="a"
          href="/dealer/catalog/search"
        >
          <Text size="sm">View All Saved Searches</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
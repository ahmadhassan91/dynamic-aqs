'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  Stack,
  TextInput,
  Button,
  Group,
  Text,
  Card,
  ActionIcon,
  Badge,
  Alert,
  Menu,
  Divider,
  ScrollArea,
  Tooltip,
  Paper,
  Box,
} from '@mantine/core';
import {
  IconBookmark,
  IconBookmarkFilled,
  IconTrash,
  IconEdit,
  IconSearch,
  IconDots,
  IconShare,
  IconCopy,
  IconCheck,
  IconAlertCircle,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { SavedSearchService } from '@/lib/services/savedSearchService';

export interface SearchCriteria {
  searchQuery: string;
  selectedCategory: string;
  selectedBrand: string;
  selectedApplication: string;
  priceRange: [number, number];
  showInStockOnly: boolean;
  sortBy: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  criteria: SearchCriteria;
  createdAt: Date;
  lastUsed: Date;
  useCount: number;
  isFavorite: boolean;
  tags: string[];
}

interface SavedSearchManagerProps {
  currentCriteria: SearchCriteria;
  onApplySearch: (criteria: SearchCriteria) => void;
  onSaveSearch: (search: Omit<SavedSearch, 'id' | 'createdAt' | 'lastUsed' | 'useCount'>) => void;
}



function SavedSearchCard({ 
  search, 
  onApply, 
  onEdit, 
  onDelete, 
  onToggleFavorite,
  onDuplicate,
  onShare,
}: {
  search: SavedSearch;
  onApply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onDuplicate: () => void;
  onShare: () => void;
}) {
  const formatCriteria = (criteria: SearchCriteria) => {
    const parts = [];
    if (criteria.searchQuery) parts.push(`"${criteria.searchQuery}"`);
    if (criteria.selectedCategory !== 'All Categories') parts.push(criteria.selectedCategory);
    if (criteria.selectedBrand !== 'All Brands') parts.push(criteria.selectedBrand);
    if (criteria.selectedApplication !== 'All Applications') parts.push(criteria.selectedApplication);
    if (criteria.showInStockOnly) parts.push('In Stock Only');
    return parts.join(' • ');
  };

  return (
    <Card withBorder p="md" radius="md">
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Group gap="xs" align="center">
              <Text fw={600} size="sm" lineClamp={1}>
                {search.name}
              </Text>
              <ActionIcon
                variant="subtle"
                size="sm"
                color={search.isFavorite ? 'yellow' : 'gray'}
                onClick={onToggleFavorite}
              >
                {search.isFavorite ? <IconStarFilled size={14} /> : <IconStar size={14} />}
              </ActionIcon>
            </Group>
            {search.description && (
              <Text size="xs" c="dimmed" lineClamp={2} mt={2}>
                {search.description}
              </Text>
            )}
          </div>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <IconDots size={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEdit size={14} />} onClick={onEdit}>
                Edit Search
              </Menu.Item>
              <Menu.Item leftSection={<IconCopy size={14} />} onClick={onDuplicate}>
                Duplicate
              </Menu.Item>
              <Menu.Item leftSection={<IconShare size={14} />} onClick={onShare}>
                Share
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                leftSection={<IconTrash size={14} />} 
                color="red"
                onClick={onDelete}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Text size="xs" c="dimmed" lineClamp={1}>
          {formatCriteria(search.criteria)}
        </Text>

        <Group gap="xs">
          {search.tags.map((tag, idx) => (
            <Badge key={idx} size="xs" variant="dot">
              {tag}
            </Badge>
          ))}
        </Group>

        <Group justify="space-between" align="center" mt="xs">
          <Group gap="xs">
            <Text size="xs" c="dimmed">
              Used {search.useCount} times
            </Text>
            <Text size="xs" c="dimmed">
              Last: {search.lastUsed.toLocaleDateString()}
            </Text>
          </Group>
          <Button size="xs" variant="light" onClick={onApply}>
            Apply Search
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}

export function SavedSearchManager({ currentCriteria, onApplySearch, onSaveSearch }: SavedSearchManagerProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveModalOpened, { open: openSaveModal, close: closeSaveModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);
  
  const [searchName, setSearchName] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [searchTags, setSearchTags] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Load saved searches on component mount
  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    try {
      setLoading(true);
      const searches = await SavedSearchService.getSavedSearches();
      setSavedSearches(searches);
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort searches: favorites first, then by last used
  const sortedSearches = [...savedSearches].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.lastUsed.getTime() - a.lastUsed.getTime();
  });

  const handleSaveSearch = async () => {
    if (!searchName.trim()) return;

    try {
      const newSearchData: Omit<SavedSearch, 'id' | 'createdAt' | 'lastUsed' | 'useCount'> = {
        name: searchName.trim(),
        description: searchDescription.trim() || undefined,
        criteria: currentCriteria,
        isFavorite: false,
        tags: searchTags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      const savedSearch = await SavedSearchService.saveSearch(newSearchData);
      setSavedSearches(prev => [savedSearch, ...prev]);
      onSaveSearch(newSearchData);

      // Reset form and show success
      setSearchName('');
      setSearchDescription('');
      setSearchTags('');
      setShowSaveSuccess(true);
      closeSaveModal();
      
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  };

  const handleEditSearch = async () => {
    if (!editingSearch || !searchName.trim()) return;

    try {
      const updates = {
        name: searchName.trim(),
        description: searchDescription.trim() || undefined,
        tags: searchTags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      const updatedSearch = await SavedSearchService.updateSearch(editingSearch.id, updates);
      setSavedSearches(prev => 
        prev.map(search => search.id === editingSearch.id ? updatedSearch : search)
      );

      setEditingSearch(null);
      setSearchName('');
      setSearchDescription('');
      setSearchTags('');
      closeEditModal();
    } catch (error) {
      console.error('Failed to update search:', error);
    }
  };

  const handleApplySearch = async (search: SavedSearch) => {
    try {
      // Update usage statistics
      const updatedSearch = await SavedSearchService.recordSearchUsage(search.id);
      setSavedSearches(prev => 
        prev.map(s => s.id === search.id ? updatedSearch : s)
      );
      
      onApplySearch(search.criteria);
    } catch (error) {
      console.error('Failed to record search usage:', error);
      // Still apply the search even if usage tracking fails
      onApplySearch(search.criteria);
    }
  };

  const handleDeleteSearch = async (searchId: string) => {
    try {
      await SavedSearchService.deleteSearch(searchId);
      setSavedSearches(prev => prev.filter(s => s.id !== searchId));
    } catch (error) {
      console.error('Failed to delete search:', error);
    }
  };

  const handleToggleFavorite = async (searchId: string) => {
    try {
      const updatedSearch = await SavedSearchService.toggleFavorite(searchId);
      setSavedSearches(prev => 
        prev.map(s => s.id === searchId ? updatedSearch : s)
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDuplicateSearch = async (searchId: string) => {
    try {
      const duplicatedSearch = await SavedSearchService.duplicateSearch(searchId);
      setSavedSearches(prev => [duplicatedSearch, ...prev]);
    } catch (error) {
      console.error('Failed to duplicate search:', error);
    }
  };

  const handleShareSearch = (search: SavedSearch) => {
    const shareableUrl = SavedSearchService.exportSearchCriteria(search.criteria);
    const fullUrl = `${window.location.origin}${window.location.pathname}?${shareableUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Shared Search: ${search.name}`,
        text: search.description || `Check out this product search: ${search.name}`,
        url: fullUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(fullUrl).then(() => {
        // Show success message
        console.log('Search URL copied to clipboard');
      });
    }
  };

  const openEditSearchModal = (search: SavedSearch) => {
    setEditingSearch(search);
    setSearchName(search.name);
    setSearchDescription(search.description || '');
    setSearchTags(search.tags.join(', '));
    openEditModal();
  };

  const hasActiveFilters = () => {
    return currentCriteria.searchQuery ||
           currentCriteria.selectedCategory !== 'All Categories' ||
           currentCriteria.selectedBrand !== 'All Brands' ||
           currentCriteria.selectedApplication !== 'All Applications' ||
           currentCriteria.showInStockOnly ||
           currentCriteria.priceRange[0] > 0 ||
           currentCriteria.priceRange[1] < 60000;
  };

  return (
    <>
      <Paper p="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={600} size="sm">Saved Searches</Text>
              <Text size="xs" c="dimmed">
                Quick access to your frequently used searches
              </Text>
            </div>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconBookmark size={14} />}
              onClick={openSaveModal}
              disabled={!hasActiveFilters()}
            >
              Save Current Search
            </Button>
          </Group>

          {showSaveSuccess && (
            <Alert
              icon={<IconCheck size={16} />}
              color="green"
              variant="light"
              withCloseButton
              onClose={() => setShowSaveSuccess(false)}
            >
              Search saved successfully!
            </Alert>
          )}

          {loading ? (
            <Box ta="center" py="md">
              <Text size="sm" c="dimmed">
                Loading saved searches...
              </Text>
            </Box>
          ) : sortedSearches.length > 0 ? (
            <ScrollArea.Autosize mah={300}>
              <Stack gap="xs">
                {sortedSearches.slice(0, 5).map((search) => (
                  <SavedSearchCard
                    key={search.id}
                    search={search}
                    onApply={() => handleApplySearch(search)}
                    onEdit={() => openEditSearchModal(search)}
                    onDelete={() => handleDeleteSearch(search.id)}
                    onToggleFavorite={() => handleToggleFavorite(search.id)}
                    onDuplicate={() => handleDuplicateSearch(search.id)}
                    onShare={() => handleShareSearch(search)}
                  />
                ))}
                {sortedSearches.length > 5 && (
                  <Text size="xs" c="dimmed" ta="center">
                    +{sortedSearches.length - 5} more saved searches
                  </Text>
                )}
              </Stack>
            </ScrollArea.Autosize>
          ) : (
            <Box ta="center" py="md">
              <IconBookmark size={32} color="var(--mantine-color-gray-5)" />
              <Text size="sm" c="dimmed" mt="xs">
                No saved searches yet
              </Text>
              <Text size="xs" c="dimmed">
                Apply some filters and save your first search
              </Text>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Save Search Modal */}
      <Modal
        opened={saveModalOpened}
        onClose={closeSaveModal}
        title="Save Search"
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Search Name"
            placeholder="e.g., High-Efficiency Air Handlers"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            required
          />
          
          <TextInput
            label="Description (Optional)"
            placeholder="Brief description of this search"
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
          />
          
          <TextInput
            label="Tags (Optional)"
            placeholder="commercial, efficiency, budget (comma-separated)"
            value={searchTags}
            onChange={(e) => setSearchTags(e.target.value)}
          />

          <Alert
            icon={<IconAlertCircle size={16} />}
            variant="light"
          >
            <Text size="sm" fw={600} mb="xs">Current Search Criteria:</Text>
            <Text size="xs" c="dimmed">
              {currentCriteria.searchQuery && `Search: "${currentCriteria.searchQuery}"`}
              {currentCriteria.selectedCategory !== 'All Categories' && ` • Category: ${currentCriteria.selectedCategory}`}
              {currentCriteria.selectedBrand !== 'All Brands' && ` • Brand: ${currentCriteria.selectedBrand}`}
              {currentCriteria.selectedApplication !== 'All Applications' && ` • Application: ${currentCriteria.selectedApplication}`}
              {currentCriteria.showInStockOnly && ` • In Stock Only`}
            </Text>
          </Alert>

          <Group justify="flex-end">
            <Button variant="outline" onClick={closeSaveModal}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSearch}
              disabled={!searchName.trim()}
            >
              Save Search
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Search Modal */}
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title="Edit Search"
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Search Name"
            placeholder="e.g., High-Efficiency Air Handlers"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            required
          />
          
          <TextInput
            label="Description (Optional)"
            placeholder="Brief description of this search"
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
          />
          
          <TextInput
            label="Tags (Optional)"
            placeholder="commercial, efficiency, budget (comma-separated)"
            value={searchTags}
            onChange={(e) => setSearchTags(e.target.value)}
          />

          <Group justify="flex-end">
            <Button variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSearch}
              disabled={!searchName.trim()}
            >
              Update Search
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
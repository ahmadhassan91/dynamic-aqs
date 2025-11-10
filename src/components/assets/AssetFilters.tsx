'use client';

import React from 'react';
import { 
  Stack, 
  Title, 
  Text, 
  Checkbox, 
  Divider, 
  Group,
  Badge
} from '@mantine/core';
import { AssetFilter, AssetCategory, AssetStatus } from '@/types/assets';

interface AssetFiltersProps {
  filter: AssetFilter;
  onFilterChange: (filter: AssetFilter) => void;
  totalAssets: number;
  filteredAssets: number;
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  filter,
  onFilterChange,
  totalAssets,
  filteredAssets,
}) => {
  const handleCategoryChange = (category: AssetCategory, checked: boolean) => {
    const categories = filter.categories || [];
    const newCategories = checked
      ? [...categories, category]
      : categories.filter(c => c !== category);
    
    onFilterChange({ ...filter, categories: newCategories as AssetCategory[] });
  };

  const handleStatusChange = (status: AssetStatus, checked: boolean) => {
    const statuses = filter.statuses || [];
    const newStatuses = checked
      ? [...statuses, status]
      : statuses.filter(s => s !== status);
    
    onFilterChange({ ...filter, statuses: newStatuses as AssetStatus[] });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const brands = filter.brands || [];
    const newBrands = checked
      ? [...brands, brand]
      : brands.filter(b => b !== brand);
    
    onFilterChange({ ...filter, brands: newBrands });
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={4}>Filters</Title>
        <Badge variant="light">
          {filteredAssets} of {totalAssets}
        </Badge>
      </Group>

      <Divider />

      <Stack gap="sm">
        <Title order={5}>Asset Types</Title>
        <Checkbox
          label="Product Sheets"
          checked={filter.categories?.includes(AssetCategory.PRODUCT_SHEETS) || false}
          onChange={(e) => handleCategoryChange(AssetCategory.PRODUCT_SHEETS, e.currentTarget.checked)}
        />
        <Checkbox
          label="Brochures"
          checked={filter.categories?.includes(AssetCategory.BROCHURES) || false}
          onChange={(e) => handleCategoryChange(AssetCategory.BROCHURES, e.currentTarget.checked)}
        />
        <Checkbox
          label="Presentations"
          checked={filter.categories?.includes(AssetCategory.PRESENTATIONS) || false}
          onChange={(e) => handleCategoryChange(AssetCategory.PRESENTATIONS, e.currentTarget.checked)}
        />
        <Checkbox
          label="Videos"
          checked={filter.categories?.includes(AssetCategory.VIDEOS) || false}
          onChange={(e) => handleCategoryChange(AssetCategory.VIDEOS, e.currentTarget.checked)}
        />
        <Checkbox
          label="Images"
          checked={filter.categories?.includes(AssetCategory.IMAGES) || false}
          onChange={(e) => handleCategoryChange(AssetCategory.IMAGES, e.currentTarget.checked)}
        />
        <Checkbox
          label="Documents"
          checked={filter.categories?.includes(AssetCategory.DOCUMENTS) || false}
          onChange={(e) => handleCategoryChange(AssetCategory.DOCUMENTS, e.currentTarget.checked)}
        />
      </Stack>

      <Divider />

      <Stack gap="sm">
        <Title order={5}>Brands</Title>
        <Checkbox
          label="Dynamic AQS"
          checked={filter.brands?.includes('dynamic-aqs') || false}
          onChange={(e) => handleBrandChange('dynamic-aqs', e.currentTarget.checked)}
        />
        <Checkbox
          label="AQS Residential"
          checked={filter.brands?.includes('aqs-residential') || false}
          onChange={(e) => handleBrandChange('aqs-residential', e.currentTarget.checked)}
        />
        <Checkbox
          label="AQS Commercial"
          checked={filter.brands?.includes('aqs-commercial') || false}
          onChange={(e) => handleBrandChange('aqs-commercial', e.currentTarget.checked)}
        />
        <Checkbox
          label="AQS Industrial"
          checked={filter.brands?.includes('aqs-industrial') || false}
          onChange={(e) => handleBrandChange('aqs-industrial', e.currentTarget.checked)}
        />
      </Stack>

      <Divider />

      <Stack gap="sm">
        <Title order={5}>Status</Title>
        <Checkbox
          label="Draft"
          checked={filter.statuses?.includes(AssetStatus.DRAFT) || false}
          onChange={(e) => handleStatusChange(AssetStatus.DRAFT, e.currentTarget.checked)}
        />
        <Checkbox
          label="Review"
          checked={filter.statuses?.includes(AssetStatus.REVIEW) || false}
          onChange={(e) => handleStatusChange(AssetStatus.REVIEW, e.currentTarget.checked)}
        />
        <Checkbox
          label="Approved"
          checked={filter.statuses?.includes(AssetStatus.APPROVED) || false}
          onChange={(e) => handleStatusChange(AssetStatus.APPROVED, e.currentTarget.checked)}
        />
        <Checkbox
          label="Published"
          checked={filter.statuses?.includes(AssetStatus.PUBLISHED) || false}
          onChange={(e) => handleStatusChange(AssetStatus.PUBLISHED, e.currentTarget.checked)}
        />
      </Stack>
    </Stack>
  );
};
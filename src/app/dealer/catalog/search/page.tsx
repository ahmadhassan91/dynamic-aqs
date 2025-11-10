'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Grid,
  Card,
  Text,
  Badge,
  Stack,
  ActionIcon,
  Menu,
  Paper,
  Box,
  Image,
  NumberFormatter,
  Pagination,
  Drawer,
  Checkbox,
  RangeSlider,
  Divider,
  Alert,
  Tooltip,
  Modal,
  Table,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconHeart,
  IconHeartFilled,
  IconShoppingCart,
  IconEye,
  IconGitCompare,
  IconAdjustments,
  IconX,
  IconCheck,
  IconAlertCircle,
  IconBookmark,
  IconShare,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { SavedSearchManager, SearchCriteria, SavedSearch } from '@/components/dealer/SavedSearchManager';
import { SavedSearchService } from '@/lib/services/savedSearchService';
import { QuickSearchAccess } from '@/components/dealer/QuickSearchAccess';

// Mock product data
const mockProducts = [
  {
    id: 'AHU-2500-001',
    name: 'AirMax Pro 2500 Air Handling Unit',
    category: 'Air Handling Units',
    brand: 'Dynamic AQS',
    price: 12500,
    listPrice: 15000,
    image: '/api/placeholder/300/200',
    inStock: true,
    stockLevel: 15,
    description: 'High-efficiency air handling unit with variable speed drive and advanced filtration',
    specifications: {
      cfm: '2500',
      voltage: '460V/3Ph/60Hz',
      efficiency: '92% AFUE',
      dimensions: '48" x 36" x 72"',
      weight: '850 lbs',
      warranty: '5 years',
    },
    features: ['Variable Speed Drive', 'MERV 13 Filtration', 'Energy Star Certified', 'Smart Controls'],
    applications: ['Commercial Office', 'Healthcare', 'Education'],
    tags: ['Energy Efficient', 'Smart Controls', 'High Performance'],
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 'RTU-5000-002',
    name: 'EcoMax 5000 Rooftop Unit',
    category: 'Rooftop Units',
    brand: 'Dynamic AQS',
    price: 18750,
    listPrice: 22500,
    image: '/api/placeholder/300/200',
    inStock: true,
    stockLevel: 8,
    description: 'Premium rooftop unit with heat recovery and advanced diagnostics',
    specifications: {
      cfm: '5000',
      voltage: '460V/3Ph/60Hz',
      efficiency: '16 SEER',
      dimensions: '96" x 48" x 48"',
      weight: '1250 lbs',
      warranty: '10 years',
    },
    features: ['Heat Recovery', 'Advanced Diagnostics', 'Modular Design', 'Remote Monitoring'],
    applications: ['Retail', 'Industrial', 'Hospitality'],
    tags: ['Heat Recovery', 'Diagnostics', 'Modular'],
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 'HP-3000-003',
    name: 'ClimateMax 3000 Heat Pump',
    category: 'Heat Pumps',
    brand: 'Dynamic AQS',
    price: 8900,
    listPrice: 10500,
    image: '/api/placeholder/300/200',
    inStock: false,
    stockLevel: 0,
    expectedDate: '2024-02-15',
    description: 'High-efficiency heat pump with inverter technology and quiet operation',
    specifications: {
      cfm: '3000',
      voltage: '230V/1Ph/60Hz',
      efficiency: '20 SEER',
      dimensions: '36" x 36" x 36"',
      weight: '180 lbs',
      warranty: '7 years',
    },
    features: ['Inverter Technology', 'Quiet Operation', 'All-Weather Performance', 'Smart Thermostat'],
    applications: ['Residential', 'Small Commercial', 'Multi-Family'],
    tags: ['Quiet', 'Inverter', 'All-Weather'],
    rating: 4.7,
    reviews: 32,
  },
  {
    id: 'CHI-1000-004',
    name: 'AquaCool 1000 Chiller',
    category: 'Chillers',
    brand: 'Dynamic AQS',
    price: 45000,
    listPrice: 52000,
    image: '/api/placeholder/300/200',
    inStock: true,
    stockLevel: 3,
    description: 'Industrial-grade chiller with magnetic bearing technology and IoT connectivity',
    specifications: {
      capacity: '1000 Tons',
      voltage: '460V/3Ph/60Hz',
      efficiency: '0.45 kW/Ton',
      dimensions: '120" x 60" x 84"',
      weight: '8500 lbs',
      warranty: '15 years',
    },
    features: ['Magnetic Bearings', 'IoT Connectivity', 'Variable Speed', 'Predictive Maintenance'],
    applications: ['Industrial', 'Data Centers', 'Hospitals'],
    tags: ['Industrial', 'IoT', 'Predictive Maintenance'],
    rating: 4.9,
    reviews: 12,
  },
  {
    id: 'BOI-800-005',
    name: 'SteamMax 800 Boiler',
    category: 'Boilers',
    brand: 'Dynamic AQS',
    price: 28500,
    listPrice: 32000,
    image: '/api/placeholder/300/200',
    inStock: true,
    stockLevel: 6,
    description: 'High-efficiency condensing boiler with modular design and smart controls',
    specifications: {
      output: '800 MBH',
      voltage: '120V/1Ph/60Hz',
      efficiency: '95% AFUE',
      dimensions: '72" x 48" x 84"',
      weight: '1850 lbs',
      warranty: '12 years',
    },
    features: ['Condensing Technology', 'Modular Design', 'Smart Controls', 'Low NOx'],
    applications: ['Healthcare', 'Education', 'Government'],
    tags: ['Condensing', 'Low NOx', 'Modular'],
    rating: 4.6,
    reviews: 15,
  },
  {
    id: 'CTL-200-006',
    name: 'SmartControl 200 System',
    category: 'Control Systems',
    brand: 'Dynamic AQS',
    price: 3200,
    listPrice: 3800,
    image: '/api/placeholder/300/200',
    inStock: true,
    stockLevel: 25,
    description: 'Advanced building automation system with cloud connectivity and AI optimization',
    specifications: {
      points: '200 I/O Points',
      voltage: '24VAC',
      connectivity: 'WiFi/Ethernet/BACnet',
      dimensions: '12" x 8" x 4"',
      weight: '8 lbs',
      warranty: '3 years',
    },
    features: ['Cloud Connectivity', 'AI Optimization', 'Mobile App', 'Energy Analytics'],
    applications: ['All Building Types', 'Retrofit', 'New Construction'],
    tags: ['Smart', 'Cloud', 'AI', 'Mobile'],
    rating: 4.8,
    reviews: 45,
  },
];

const categories = ['All Categories', 'Air Handling Units', 'Rooftop Units', 'Heat Pumps', 'Chillers', 'Boilers', 'Control Systems'];
const brands = ['All Brands', 'Dynamic AQS', 'Partner Brand A', 'Partner Brand B'];
const applications = ['All Applications', 'Commercial Office', 'Healthcare', 'Education', 'Retail', 'Industrial', 'Hospitality', 'Residential'];
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

interface ProductCardProps {
  product: typeof mockProducts[0];
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
  onAddToCompare: (productId: string) => void;
  isFavorite: boolean;
  isInCompare: boolean;
}

function ProductCard({ product, onAddToCart, onToggleFavorite, onAddToCompare, isFavorite, isInCompare }: ProductCardProps) {
  const [viewDetailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);

  const discountPercentage = Math.round(((product.listPrice - product.price) / product.listPrice) * 100);

  return (
    <>
      <Card shadow="sm" padding="md" radius="md" withBorder h="100%">
        <Card.Section>
          <Box pos="relative">
            <Image
              src={product.image}
              height={200}
              alt={product.name}
              fallbackSrc="https://placehold.co/300x200/e9ecef/6c757d?text=Product+Image"
            />
            <Group pos="absolute" top={8} right={8} gap="xs">
              <ActionIcon
                variant={isFavorite ? 'filled' : 'subtle'}
                color="red"
                onClick={() => onToggleFavorite(product.id)}
              >
                {isFavorite ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
              </ActionIcon>
              <ActionIcon
                variant={isInCompare ? 'filled' : 'subtle'}
                color="blue"
                onClick={() => onAddToCompare(product.id)}
                disabled={isInCompare}
              >
                <IconGitCompare size={16} />
              </ActionIcon>
            </Group>
            {!product.inStock && (
              <Badge
                pos="absolute"
                top={8}
                left={8}
                color="red"
                variant="filled"
              >
                Out of Stock
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge
                pos="absolute"
                bottom={8}
                left={8}
                color="green"
                variant="filled"
              >
                {discountPercentage}% OFF
              </Badge>
            )}
          </Box>
        </Card.Section>

        <Stack gap="xs" mt="md" style={{ flex: 1 }}>
          <Group justify="space-between" align="flex-start">
            <Text fw={600} size="sm" lineClamp={2} style={{ flex: 1 }}>
              {product.name}
            </Text>
            <Badge size="xs" variant="light">
              {product.category}
            </Badge>
          </Group>

          <Text size="xs" c="dimmed" lineClamp={2}>
            {product.description}
          </Text>

          <Group gap="xs">
            {product.features.slice(0, 2).map((feature, idx) => (
              <Badge key={idx} size="xs" variant="dot">
                {feature}
              </Badge>
            ))}
            {product.features.length > 2 && (
              <Text size="xs" c="dimmed">
                +{product.features.length - 2} more
              </Text>
            )}
          </Group>

          <Group justify="space-between" align="center">
            <div>
              <Group gap="xs" align="baseline">
                <Text fw={700} size="lg">
                  <NumberFormatter
                    value={product.price}
                    prefix="$"
                    thousandSeparator
                    decimalScale={0}
                  />
                </Text>
                {discountPercentage > 0 && (
                  <Text size="sm" td="line-through" c="dimmed">
                    <NumberFormatter
                      value={product.listPrice}
                      prefix="$"
                      thousandSeparator
                      decimalScale={0}
                    />
                  </Text>
                )}
              </Group>
              {product.inStock ? (
                <Text size="xs" c="green">
                  In Stock ({product.stockLevel} available)
                </Text>
              ) : (
                <Text size="xs" c="red">
                  Expected: {product.expectedDate}
                </Text>
              )}
            </div>
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                ★ {product.rating} ({product.reviews})
              </Text>
            </Group>
          </Group>

          <Group justify="space-between" mt="auto" pt="xs">
            <Button
              variant="light"
              size="xs"
              onClick={openDetails}
              leftSection={<IconEye size={14} />}
            >
              Details
            </Button>
            <Button
              size="xs"
              onClick={() => onAddToCart(product.id)}
              disabled={!product.inStock}
              leftSection={<IconShoppingCart size={14} />}
            >
              Add to Cart
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Product Details Modal */}
      <Modal
        opened={viewDetailsOpened}
        onClose={closeDetails}
        title={product.name}
        size="lg"
      >
        <Stack gap="md">
          <Group>
            <Image
              src={product.image}
              width={200}
              height={150}
              alt={product.name}
              fallbackSrc="https://placehold.co/200x150/e9ecef/6c757d?text=Product"
            />
            <Stack gap="xs" style={{ flex: 1 }}>
              <Text size="lg" fw={600}>{product.name}</Text>
              <Text c="dimmed">{product.description}</Text>
              <Group>
                <Text fw={700} size="xl">
                  <NumberFormatter
                    value={product.price}
                    prefix="$"
                    thousandSeparator
                    decimalScale={0}
                  />
                </Text>
                {discountPercentage > 0 && (
                  <Badge color="green">{discountPercentage}% OFF</Badge>
                )}
              </Group>
              <Group>
                <Badge>{product.category}</Badge>
                <Text size="sm" c={product.inStock ? 'green' : 'red'}>
                  {product.inStock ? `In Stock (${product.stockLevel})` : 'Out of Stock'}
                </Text>
              </Group>
            </Stack>
          </Group>

          <Divider />

          <div>
            <Text fw={600} mb="xs">Specifications</Text>
            <Table>
              <Table.Tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <Table.Tr key={key}>
                    <Table.Td fw={500} style={{ textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Table.Td>
                    <Table.Td>{value}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>

          <div>
            <Text fw={600} mb="xs">Features</Text>
            <Group gap="xs">
              {product.features.map((feature, idx) => (
                <Badge key={idx} variant="light">
                  {feature}
                </Badge>
              ))}
            </Group>
          </div>

          <div>
            <Text fw={600} mb="xs">Applications</Text>
            <Group gap="xs">
              {product.applications.map((app, idx) => (
                <Badge key={idx} variant="outline">
                  {app}
                </Badge>
              ))}
            </Group>
          </div>

          <Group justify="flex-end">
            <Button
              variant="outline"
              onClick={() => onAddToCompare(product.id)}
              disabled={isInCompare}
              leftSection={<IconGitCompare size={16} />}
            >
              {isInCompare ? 'In Comparison' : 'Compare'}
            </Button>
            <Button
              onClick={() => onAddToCart(product.id)}
              disabled={!product.inStock}
              leftSection={<IconShoppingCart size={16} />}
            >
              Add to Cart
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default function ProductSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedApplication, setSelectedApplication] = useState('All Applications');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpened, { open: openFilters, close: closeFilters }] = useDisclosure(false);
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);

  const itemsPerPage = 12;

  // Get current search criteria for saved search functionality
  const getCurrentCriteria = (): SearchCriteria => ({
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedApplication,
    priceRange,
    showInStockOnly,
    sortBy,
  });

  // Apply saved search criteria
  const handleApplySavedSearch = (criteria: SearchCriteria) => {
    setSearchQuery(criteria.searchQuery);
    setSelectedCategory(criteria.selectedCategory);
    setSelectedBrand(criteria.selectedBrand);
    setSelectedApplication(criteria.selectedApplication);
    setPriceRange(criteria.priceRange);
    setShowInStockOnly(criteria.showInStockOnly);
    setSortBy(criteria.sortBy);
    setCurrentPage(1);
  };

  // Handle saving a search (in real app, this would persist to backend)
  const handleSaveSearch = (search: Omit<SavedSearch, 'id' | 'createdAt' | 'lastUsed' | 'useCount'>) => {
    console.log('Saving search:', search);
    // In a real application, this would make an API call to save the search
  };

  // Load search criteria from URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.toString()) {
        try {
          const importedCriteria = SavedSearchService.importSearchCriteria(urlParams.toString());
          handleApplySavedSearch(importedCriteria);
        } catch (error) {
          console.error('Failed to import search criteria from URL:', error);
        }
      }
    }
  }, []);

  // Filter and sort products
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All Brands' || product.brand === selectedBrand;
    const matchesApplication = selectedApplication === 'All Applications' || 
                              product.applications.includes(selectedApplication);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesStock = !showInStockOnly || product.inStock;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesApplication && matchesPrice && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (productId: string) => {
    setCartItems(prev => [...prev, productId]);
    // Show success notification
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCompare = (productId: string) => {
    if (compareList.length < 4 && !compareList.includes(productId)) {
      setCompareList(prev => [...prev, productId]);
    }
  };

  const handleRemoveFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(id => id !== productId));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedBrand('All Brands');
    setSelectedApplication('All Applications');
    setPriceRange([0, 60000]);
    setShowInStockOnly(false);
    setSortBy('relevance');
    setCurrentPage(1);
  };

  return (
    <DealerLayout>
      <Container size="xl" py="md">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={2}>Product Search</Title>
              <Text c="dimmed">
                Find the perfect HVAC solutions for your projects
              </Text>
            </div>
            <Group>
              <QuickSearchAccess onApplySearch={handleApplySavedSearch} />
              <Button
                variant="outline"
                leftSection={<IconAdjustments size={16} />}
                onClick={openFilters}
              >
                Advanced Filters
              </Button>
              {compareList.length > 0 && (
                <Button
                  variant="light"
                  leftSection={<IconGitCompare size={16} />}
                >
                  Compare ({compareList.length})
                </Button>
              )}
            </Group>
          </Group>

          {/* Saved Search Manager */}
          <SavedSearchManager
            currentCriteria={getCurrentCriteria()}
            onApplySearch={handleApplySavedSearch}
            onSaveSearch={handleSaveSearch}
          />

          {/* Quick Search and Filters */}
          <Paper p="md" withBorder>
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  placeholder="Search products, features, or model numbers..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 2 }}>
                <Select
                  placeholder="Category"
                  data={categories}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value || 'All Categories')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 2 }}>
                <Select
                  placeholder="Brand"
                  data={brands}
                  value={selectedBrand}
                  onChange={(value) => setSelectedBrand(value || 'All Brands')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 2 }}>
                <Select
                  placeholder="Application"
                  data={applications}
                  value={selectedApplication}
                  onChange={(value) => setSelectedApplication(value || 'All Applications')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 2 }}>
                <Select
                  placeholder="Sort by"
                  data={sortOptions}
                  value={sortBy}
                  onChange={(value) => setSortBy(value || 'relevance')}
                />
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Results Summary */}
          <Group justify="space-between">
            <Text>
              Showing {paginatedProducts.length} of {sortedProducts.length} products
              {searchQuery && ` for "${searchQuery}"`}
            </Text>
            {(searchQuery || selectedCategory !== 'All Categories' || selectedBrand !== 'All Brands' || 
              selectedApplication !== 'All Applications' || showInStockOnly) && (
              <Button variant="subtle" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </Group>

          {/* Compare Bar */}
          {compareList.length > 0 && (
            <Alert
              icon={<IconGitCompare size={16} />}
              title={`${compareList.length} products selected for comparison`}
              color="blue"
              withCloseButton={false}
            >
              <Group justify="space-between">
                <Group gap="xs">
                  {compareList.map(productId => {
                    const product = mockProducts.find(p => p.id === productId);
                    return product ? (
                      <Badge
                        key={productId}
                        variant="light"
                        rightSection={
                          <ActionIcon
                            size="xs"
                            color="blue"
                            radius="xl"
                            variant="transparent"
                            onClick={() => handleRemoveFromCompare(productId)}
                          >
                            <IconX size={10} />
                          </ActionIcon>
                        }
                      >
                        {product.name.substring(0, 20)}...
                      </Badge>
                    ) : null;
                  })}
                </Group>
                <Button size="sm">Compare Now</Button>
              </Group>
            </Alert>
          )}

          {/* Product Grid */}
          {paginatedProducts.length > 0 ? (
            <Grid>
              {paginatedProducts.map((product) => (
                <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    onAddToCompare={handleAddToCompare}
                    isFavorite={favorites.includes(product.id)}
                    isInCompare={compareList.includes(product.id)}
                  />
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            <Paper p="xl" withBorder>
              <Stack align="center" gap="md">
                <IconAlertCircle size={48} color="var(--mantine-color-gray-5)" />
                <Text size="lg" fw={600}>No products found</Text>
                <Text c="dimmed" ta="center">
                  Try adjusting your search criteria or filters to find more products.
                </Text>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </Stack>
            </Paper>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Group justify="center">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
                size="sm"
              />
            </Group>
          )}
        </Stack>

        {/* Advanced Filters Drawer */}
        <Drawer
          opened={filtersOpened}
          onClose={closeFilters}
          title="Advanced Filters"
          position="right"
          size="md"
        >
          <Stack gap="lg">
            <div>
              <Text fw={600} mb="xs">Price Range</Text>
              <RangeSlider
                value={priceRange}
                onChange={setPriceRange}
                min={0}
                max={60000}
                step={1000}
                marks={[
                  { value: 0, label: '$0' },
                  { value: 15000, label: '$15K' },
                  { value: 30000, label: '$30K' },
                  { value: 45000, label: '$45K' },
                  { value: 60000, label: '$60K+' },
                ]}
                mb="xl"
              />
              <Group justify="space-between">
                <Text size="sm">
                  Min: <NumberFormatter value={priceRange[0]} prefix="$" thousandSeparator />
                </Text>
                <Text size="sm">
                  Max: <NumberFormatter value={priceRange[1]} prefix="$" thousandSeparator />
                </Text>
              </Group>
            </div>

            <Divider />

            <div>
              <Text fw={600} mb="xs">Availability</Text>
              <Checkbox
                label="In stock only"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.currentTarget.checked)}
              />
            </div>

            <Divider />

            <Group justify="space-between">
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
              <Button onClick={closeFilters}>
                Apply Filters
              </Button>
            </Group>
          </Stack>
        </Drawer>
      </Container>
    </DealerLayout>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Stack,
  Group,
  Text,
  Title,
  Button,
  Table,
  Badge,
  Image,
  ActionIcon,
  Card,
  Grid,
  Divider,
  NumberFormatter,
  Checkbox,
  Select,
  Paper,
  ScrollArea,
} from '@mantine/core';
import {
  IconX,
  IconDownload,
  IconShare,
  IconShoppingCart,
  IconHeart,
  IconHeartFilled,
} from '@tabler/icons-react';
import { MockProduct } from '@/lib/mockData/generators';

interface ProductComparisonProps {
  products: MockProduct[];
  opened: boolean;
  onClose: () => void;
  onAddToCart: (product: MockProduct, quantity: number) => void;
  onRemoveFromComparison: (productId: string) => void;
  favoriteProducts: string[];
  onToggleFavorite: (product: MockProduct) => void;
}

interface ComparisonCriteria {
  specifications: boolean;
  pricing: boolean;
  features: boolean;
  availability: boolean;
  warranty: boolean;
}

export function ProductComparison({
  products,
  opened,
  onClose,
  onAddToCart,
  onRemoveFromComparison,
  favoriteProducts,
  onToggleFavorite,
}: ProductComparisonProps) {
  const [selectedCriteria, setSelectedCriteria] = useState<ComparisonCriteria>({
    specifications: true,
    pricing: true,
    features: true,
    availability: true,
    warranty: true,
  });
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Get all unique specification keys
  const allSpecKeys = Array.from(
    new Set(
      products.flatMap(product => Object.keys(product.specifications))
    )
  );

  // Get all unique features
  const allFeatures = Array.from(
    new Set(
      products.flatMap(product => product.features)
    )
  );

  const handleCriteriaChange = (criteria: keyof ComparisonCriteria, checked: boolean) => {
    setSelectedCriteria(prev => ({
      ...prev,
      [criteria]: checked,
    }));
  };

  const handleExportComparison = () => {
    // Create comparison data for export
    const comparisonData = {
      products: products.map(product => ({
        name: product.name,
        category: product.category,
        price: product.dealerPrice,
        specifications: product.specifications,
        features: product.features,
        inStock: product.inStock,
        warranty: product.warranty,
      })),
      criteria: selectedCriteria,
      exportDate: new Date().toISOString(),
    };

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(comparisonData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-comparison-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareComparison = async () => {
    const shareData = {
      title: 'Product Comparison',
      text: `Comparing ${products.length} products: ${products.map(p => p.name).join(', ')}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareData.url);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareData.url);
    }
  };

  const TableView = () => (
    <ScrollArea>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            {products.map(product => (
              <Table.Th key={product.id} style={{ minWidth: 200 }}>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <ActionIcon
                      variant="light"
                      color={favoriteProducts.includes(product.id) ? 'red' : 'gray'}
                      onClick={() => onToggleFavorite(product)}
                    >
                      {favoriteProducts.includes(product.id) ? (
                        <IconHeartFilled size={16} />
                      ) : (
                        <IconHeart size={16} />
                      )}
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => onRemoveFromComparison(product.id)}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Group>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    height={80}
                    fallbackSrc="/images/placeholder-product.jpg"
                  />
                  <Text fw={500} size="sm" ta="center">
                    {product.name}
                  </Text>
                  <Badge size="xs" variant="light">
                    {product.category}
                  </Badge>
                </Stack>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {/* Pricing Section */}
          {selectedCriteria.pricing && (
            <>
              <Table.Tr>
                <Table.Td fw={500}>Dealer Price</Table.Td>
                {products.map(product => (
                  <Table.Td key={product.id}>
                    <Text fw={700} c="blue">
                      <NumberFormatter value={product.dealerPrice} prefix="$" thousandSeparator />
                    </Text>
                  </Table.Td>
                ))}
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500}>Base Price</Table.Td>
                {products.map(product => (
                  <Table.Td key={product.id}>
                    <Text c="dimmed" td="line-through">
                      <NumberFormatter value={product.basePrice} prefix="$" thousandSeparator />
                    </Text>
                  </Table.Td>
                ))}
              </Table.Tr>
            </>
          )}

          {/* Availability Section */}
          {selectedCriteria.availability && (
            <>
              <Table.Tr>
                <Table.Td fw={500}>Availability</Table.Td>
                {products.map(product => (
                  <Table.Td key={product.id}>
                    <Badge color={product.inStock ? 'green' : 'red'} variant="light">
                      {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                    </Badge>
                  </Table.Td>
                ))}
              </Table.Tr>
            </>
          )}

          {/* Warranty Section */}
          {selectedCriteria.warranty && (
            <Table.Tr>
              <Table.Td fw={500}>Warranty</Table.Td>
              {products.map(product => (
                <Table.Td key={product.id}>
                  <Text>{product.warranty}</Text>
                </Table.Td>
              ))}
            </Table.Tr>
          )}

          {/* Specifications Section */}
          {selectedCriteria.specifications && allSpecKeys.map(specKey => (
            <Table.Tr key={specKey}>
              <Table.Td fw={500}>{specKey}</Table.Td>
              {products.map(product => (
                <Table.Td key={product.id}>
                  <Text>{product.specifications[specKey] || '-'}</Text>
                </Table.Td>
              ))}
            </Table.Tr>
          ))}

          {/* Features Section */}
          {selectedCriteria.features && allFeatures.map(feature => (
            <Table.Tr key={feature}>
              <Table.Td fw={500}>{feature}</Table.Td>
              {products.map(product => (
                <Table.Td key={product.id}>
                  <Text c={product.features.includes(feature) ? 'green' : 'red'}>
                    {product.features.includes(feature) ? '✓' : '✗'}
                  </Text>
                </Table.Td>
              ))}
            </Table.Tr>
          ))}

          {/* Actions Section */}
          <Table.Tr>
            <Table.Td fw={500}>Actions</Table.Td>
            {products.map(product => (
              <Table.Td key={product.id}>
                <Button
                  size="xs"
                  leftSection={<IconShoppingCart size={14} />}
                  onClick={() => onAddToCart(product, 1)}
                  disabled={!product.inStock}
                  fullWidth
                >
                  Add to Cart
                </Button>
              </Table.Td>
            ))}
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );

  const CardsView = () => (
    <Grid>
      {products.map(product => (
        <Grid.Col key={product.id} span={{ base: 12, md: 6, lg: 4 }}>
          <Card withBorder h="100%">
            <Card.Section>
              <Group justify="space-between" p="md">
                <ActionIcon
                  variant="light"
                  color={favoriteProducts.includes(product.id) ? 'red' : 'gray'}
                  onClick={() => onToggleFavorite(product)}
                >
                  {favoriteProducts.includes(product.id) ? (
                    <IconHeartFilled size={16} />
                  ) : (
                    <IconHeart size={16} />
                  )}
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => onRemoveFromComparison(product.id)}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Group>
              <Image
                src={product.imageUrl}
                alt={product.name}
                height={150}
                fallbackSrc="/images/placeholder-product.jpg"
              />
            </Card.Section>

            <Stack p="md" gap="sm">
              <div>
                <Text fw={500} size="sm">
                  {product.name}
                </Text>
                <Badge size="xs" variant="light" mt="xs">
                  {product.category}
                </Badge>
              </div>

              {selectedCriteria.pricing && (
                <div>
                  <Text fw={700} c="blue">
                    <NumberFormatter value={product.dealerPrice} prefix="$" thousandSeparator />
                  </Text>
                  <Text size="xs" c="dimmed" td="line-through">
                    <NumberFormatter value={product.basePrice} prefix="$" thousandSeparator />
                  </Text>
                </div>
              )}

              {selectedCriteria.availability && (
                <Badge color={product.inStock ? 'green' : 'red'} variant="light">
                  {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                </Badge>
              )}

              {selectedCriteria.warranty && (
                <Text size="sm">
                  <Text span fw={500}>Warranty:</Text> {product.warranty}
                </Text>
              )}

              {selectedCriteria.specifications && (
                <div>
                  <Text fw={500} size="sm" mb="xs">Specifications:</Text>
                  <Stack gap="xs">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <Group key={key} justify="space-between">
                        <Text size="xs" c="dimmed">{key}:</Text>
                        <Text size="xs">{value}</Text>
                      </Group>
                    ))}
                  </Stack>
                </div>
              )}

              {selectedCriteria.features && (
                <div>
                  <Text fw={500} size="sm" mb="xs">Features:</Text>
                  <Stack gap="xs">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <Text key={index} size="xs">• {feature}</Text>
                    ))}
                    {product.features.length > 3 && (
                      <Text size="xs" c="dimmed">
                        +{product.features.length - 3} more features
                      </Text>
                    )}
                  </Stack>
                </div>
              )}

              <Button
                size="xs"
                leftSection={<IconShoppingCart size={14} />}
                onClick={() => onAddToCart(product, 1)}
                disabled={!product.inStock}
                fullWidth
              >
                Add to Cart
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Product Comparison"
      size="xl"
      fullScreen
    >
      <Stack>
        {/* Controls */}
        <Paper withBorder p="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={4}>Comparison Criteria</Title>
              <Group>
                <Select
                  value={viewMode}
                  onChange={(value) => setViewMode(value as 'table' | 'cards')}
                  data={[
                    { value: 'table', label: 'Table View' },
                    { value: 'cards', label: 'Cards View' },
                  ]}
                />
                <Button
                  variant="light"
                  leftSection={<IconDownload size={16} />}
                  onClick={handleExportComparison}
                >
                  Export
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconShare size={16} />}
                  onClick={handleShareComparison}
                >
                  Share
                </Button>
              </Group>
            </Group>

            <Group>
              <Checkbox
                label="Specifications"
                checked={selectedCriteria.specifications}
                onChange={(event) => handleCriteriaChange('specifications', event.currentTarget.checked)}
              />
              <Checkbox
                label="Pricing"
                checked={selectedCriteria.pricing}
                onChange={(event) => handleCriteriaChange('pricing', event.currentTarget.checked)}
              />
              <Checkbox
                label="Features"
                checked={selectedCriteria.features}
                onChange={(event) => handleCriteriaChange('features', event.currentTarget.checked)}
              />
              <Checkbox
                label="Availability"
                checked={selectedCriteria.availability}
                onChange={(event) => handleCriteriaChange('availability', event.currentTarget.checked)}
              />
              <Checkbox
                label="Warranty"
                checked={selectedCriteria.warranty}
                onChange={(event) => handleCriteriaChange('warranty', event.currentTarget.checked)}
              />
            </Group>
          </Stack>
        </Paper>

        {/* Comparison Content */}
        {products.length === 0 ? (
          <Text ta="center" c="dimmed" py="xl">
            No products selected for comparison
          </Text>
        ) : (
          <>
            <Text size="sm" c="dimmed">
              Comparing {products.length} products
            </Text>
            {viewMode === 'table' ? <TableView /> : <CardsView />}
          </>
        )}
      </Stack>
    </Modal>
  );
}
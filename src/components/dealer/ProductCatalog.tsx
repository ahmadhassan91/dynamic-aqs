'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Grid,
  Card,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  Button,
  TextInput,
  Select,
  NumberInput,
  Image,
  ActionIcon,
  Pagination,
  NumberFormatter,
  Drawer,
  List,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconSearch,
  IconFilter,
  IconShoppingCart,
  IconEye,
  IconPlus,
  IconMinus,
  IconX,
  IconHeart,
  IconHeartFilled,
  IconScale,
} from '@tabler/icons-react';
import { MockProduct } from '@/lib/mockData/generators';

interface CartItem {
  product: MockProduct;
  quantity: number;
}

interface ProductCatalogProps {
  products: MockProduct[];
  cartItems: CartItem[];
  onAddToCart: (product: MockProduct, quantity: number) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onViewProduct: (product: MockProduct) => void;
  comparisonProducts: MockProduct[];
  onAddToComparison: (product: MockProduct) => void;
  onRemoveFromComparison: (productId: string) => void;
  onOpenComparison: () => void;
}

export function ProductCatalog({
  products,
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onViewProduct,
  comparisonProducts,
  onAddToComparison,
  onRemoveFromComparison,
  onOpenComparison,
}: ProductCatalogProps) {
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [cartOpened, { open: openCart, close: closeCart }] = useDisclosure(false);
  
  const itemsPerPage = 12;

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('dealerFavorites');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        setFavoriteProducts(favorites.map((fav: any) => fav.product.id));
      } catch {
        setFavoriteProducts([]);
      }
    }
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return cats.map(cat => ({ value: cat, label: cat }));
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.dealerPrice - b.dealerPrice;
        case 'price-high':
          return b.dealerPrice - a.dealerPrice;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Cart calculations
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.dealerPrice * item.quantity), 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product: MockProduct, quantity: number) => {
    onAddToCart(product, quantity);
  };

  const handleToggleFavorite = (product: MockProduct) => {
    const isFavorite = favoriteProducts.includes(product.id);
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavoriteIds = favoriteProducts.filter(id => id !== product.id);
      setFavoriteProducts(updatedFavoriteIds);
      
      // Update localStorage
      const savedFavorites = localStorage.getItem('dealerFavorites');
      if (savedFavorites) {
        try {
          const favorites = JSON.parse(savedFavorites);
          const updatedFavorites = favorites.filter((fav: any) => fav.product.id !== product.id);
          localStorage.setItem('dealerFavorites', JSON.stringify(updatedFavorites));
        } catch {
          // Handle error silently
        }
      }
    } else {
      // Add to favorites
      const updatedFavoriteIds = [...favoriteProducts, product.id];
      setFavoriteProducts(updatedFavoriteIds);
      
      // Update localStorage
      const savedFavorites = localStorage.getItem('dealerFavorites');
      let favorites = [];
      if (savedFavorites) {
        try {
          favorites = JSON.parse(savedFavorites);
        } catch {
          favorites = [];
        }
      }
      
      const newFavorite = {
        id: `fav-${Date.now()}`,
        product,
        addedDate: new Date().toISOString(),
        customListIds: [],
      };
      
      favorites.push(newFavorite);
      localStorage.setItem('dealerFavorites', JSON.stringify(favorites));
    }
  };

  const isInComparison = (productId: string) => {
    return comparisonProducts.some(p => p.id === productId);
  };

  const handleToggleComparison = (product: MockProduct) => {
    if (isInComparison(product.id)) {
      onRemoveFromComparison(product.id);
    } else {
      if (comparisonProducts.length >= 4) {
        // Limit comparison to 4 products
        return;
      }
      onAddToComparison(product);
    }
  };

  const ProductCard = ({ product }: { product: MockProduct }) => {
    const [quantity, setQuantity] = useState(1);
    const cartQuantity = getCartQuantity(product.id);

    return (
      <Card withBorder h="100%">
        <Card.Section>
          <Image
            src={product.imageUrl}
            alt={product.name}
            height={200}
            fallbackSrc="/images/placeholder-product.jpg"
          />
        </Card.Section>

        <Stack mt="md" justify="space-between" h="calc(100% - 200px)">
          <div>
            <Group justify="space-between" align="flex-start">
              <div style={{ flex: 1 }}>
                <Text fw={500} size="sm" lineClamp={2}>
                  {product.name}
                </Text>
                <Badge size="xs" variant="light" mt="xs">
                  {product.category}
                </Badge>
              </div>
              <Group gap="xs">
                <ActionIcon
                  variant="light"
                  color={favoriteProducts.includes(product.id) ? 'red' : 'gray'}
                  onClick={() => handleToggleFavorite(product)}
                >
                  {favoriteProducts.includes(product.id) ? (
                    <IconHeartFilled size={16} />
                  ) : (
                    <IconHeart size={16} />
                  )}
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color={isInComparison(product.id) ? 'blue' : 'gray'}
                  onClick={() => handleToggleComparison(product)}
                  disabled={!isInComparison(product.id) && comparisonProducts.length >= 4}
                >
                  <IconScale size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  onClick={() => onViewProduct(product)}
                >
                  <IconEye size={16} />
                </ActionIcon>
              </Group>
            </Group>

            <Text size="xs" c="dimmed" mt="xs" lineClamp={2}>
              {product.description}
            </Text>

            <Group justify="space-between" mt="md">
              <div>
                <Text size="lg" fw={700} c="blue">
                  <NumberFormatter value={product.dealerPrice} prefix="$" thousandSeparator />
                </Text>
                <Text size="xs" c="dimmed" td="line-through">
                  <NumberFormatter value={product.basePrice} prefix="$" thousandSeparator />
                </Text>
              </div>
              <Badge color={product.inStock ? 'green' : 'red'} variant="light">
                {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </Badge>
            </Group>
          </div>

          <div>
            {cartQuantity > 0 && (
              <Group justify="space-between" mb="xs">
                <Text size="sm">In cart: {cartQuantity}</Text>
                <Group gap="xs">
                  <ActionIcon
                    size="sm"
                    variant="light"
                    onClick={() => onUpdateCartQuantity(product.id, cartQuantity - 1)}
                  >
                    <IconMinus size={12} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="light"
                    onClick={() => onUpdateCartQuantity(product.id, cartQuantity + 1)}
                  >
                    <IconPlus size={12} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="light"
                    color="red"
                    onClick={() => onRemoveFromCart(product.id)}
                  >
                    <IconX size={12} />
                  </ActionIcon>
                </Group>
              </Group>
            )}

            <Group>
              <NumberInput
                value={quantity}
                onChange={(value) => setQuantity(Number(value) || 1)}
                min={1}
                max={product.stockQuantity}
                size="xs"
                style={{ flex: 1 }}
                disabled={!product.inStock}
              />
              <Button
                size="xs"
                leftSection={<IconShoppingCart size={14} />}
                onClick={() => handleAddToCart(product, quantity)}
                disabled={!product.inStock}
              >
                Add
              </Button>
            </Group>
          </div>
        </Stack>
      </Card>
    );
  };

  const CartDrawer = () => (
    <Drawer opened={cartOpened} onClose={closeCart} title="Shopping Cart" position="right" size="md">
      <Stack>
        {cartItems.length === 0 ? (
          <Text ta="center" c="dimmed" py="xl">
            Your cart is empty
          </Text>
        ) : (
          <>
            {cartItems.map((item) => (
              <Card key={item.product.id} withBorder>
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Text fw={500} size="sm">
                      {item.product.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      <NumberFormatter value={item.product.dealerPrice} prefix="$" thousandSeparator /> each
                    </Text>
                  </div>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => onRemoveFromCart(item.product.id)}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Group>

                <Group justify="space-between" mt="md">
                  <Group gap="xs">
                    <ActionIcon
                      size="sm"
                      variant="light"
                      onClick={() => onUpdateCartQuantity(item.product.id, item.quantity - 1)}
                    >
                      <IconMinus size={12} />
                    </ActionIcon>
                    <Text fw={500}>{item.quantity}</Text>
                    <ActionIcon
                      size="sm"
                      variant="light"
                      onClick={() => onUpdateCartQuantity(item.product.id, item.quantity + 1)}
                    >
                      <IconPlus size={12} />
                    </ActionIcon>
                  </Group>
                  <Text fw={500}>
                    <NumberFormatter 
                      value={item.product.dealerPrice * item.quantity} 
                      prefix="$" 
                      thousandSeparator 
                    />
                  </Text>
                </Group>
              </Card>
            ))}

            <Divider />

            <Group justify="space-between">
              <Text size="lg" fw={700}>Total:</Text>
              <Text size="lg" fw={700} c="blue">
                <NumberFormatter value={cartTotal} prefix="$" thousandSeparator />
              </Text>
            </Group>

            <Button fullWidth size="md">
              Proceed to Checkout
            </Button>
          </>
        )}
      </Stack>
    </Drawer>
  );

  return (
    <>
      <Stack>
        {/* Header */}
        <Group justify="space-between">
          <Title order={2}>Product Catalog</Title>
          <Group>
            {comparisonProducts.length > 0 && (
              <Button
                leftSection={<IconScale size={16} />}
                onClick={onOpenComparison}
                variant="light"
                color="blue"
              >
                Compare ({comparisonProducts.length})
              </Button>
            )}
            <Button
              leftSection={<IconShoppingCart size={16} />}
              onClick={openCart}
              variant="light"
            >
              Cart ({cartItemCount})
            </Button>
          </Group>
        </Group>

        {/* Filters */}
        <Card withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <TextInput
                placeholder="Search products..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                placeholder="All Categories"
                data={[{ value: '', label: 'All Categories' }, ...categories]}
                value={selectedCategory}
                onChange={setSelectedCategory}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                placeholder="Sort by"
                data={[
                  { value: 'name', label: 'Name A-Z' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'category', label: 'Category' },
                ]}
                value={sortBy}
                onChange={(value) => setSortBy(value || 'name')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text size="sm" c="dimmed">
                {filteredProducts.length} products found
              </Text>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Products Grid */}
        <Grid>
          {paginatedProducts.map((product) => (
            <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} />
            </Grid.Col>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Group justify="center">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
            />
          </Group>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">
            No products found matching your criteria
          </Text>
        )}
      </Stack>

      <CartDrawer />
    </>
  );
}
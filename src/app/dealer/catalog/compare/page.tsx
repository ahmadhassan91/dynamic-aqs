'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay, Stack, Title, Text, Button, Group } from '@mantine/core';
import { ProductComparison } from '@/components/dealer/ProductComparison';
import { DealerNavigation } from '@/components/dealer/DealerNavigation';
import { useRouter } from 'next/navigation';
import { generateMockProducts, MockProduct } from '@/lib/mockData/generators';
import { IconArrowLeft } from '@tabler/icons-react';

interface CartItem {
  product: MockProduct;
  quantity: number;
}

export default function DealerComparisonPage() {
  const [loading, setLoading] = useState(true);
  const [comparisonProducts, setComparisonProducts] = useState<MockProduct[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('dealerAuth');
    if (!auth) {
      router.push('/dealer/login');
      return;
    }

    // Load data
    const loadData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load comparison products from localStorage
      const savedComparison = localStorage.getItem('dealerComparison');
      if (savedComparison) {
        setComparisonProducts(JSON.parse(savedComparison));
      }

      // Load favorites from localStorage
      const savedFavorites = localStorage.getItem('dealerFavorites');
      if (savedFavorites) {
        try {
          const favorites = JSON.parse(savedFavorites);
          setFavoriteProducts(favorites.map((fav: any) => fav.product.id));
        } catch {
          setFavoriteProducts([]);
        }
      }

      // Load cart from localStorage
      const savedCart = localStorage.getItem('dealerCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }

      setUser({
        name: 'Mike Johnson',
        email: 'mike@abchvac.com',
        companyName: 'ABC HVAC Solutions',
        role: 'Owner',
      });

      setLoading(false);
    };

    loadData();
  }, [router]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('dealerCart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('dealerCart');
    }
    // Dispatch custom event to update cart count in navigation
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cartItems]);

  // Save comparison products to localStorage whenever they change
  useEffect(() => {
    if (comparisonProducts.length > 0) {
      localStorage.setItem('dealerComparison', JSON.stringify(comparisonProducts));
    } else {
      localStorage.removeItem('dealerComparison');
    }
  }, [comparisonProducts]);

  const handleLogout = () => {
    localStorage.removeItem('dealerAuth');
    localStorage.removeItem('dealerCart');
    localStorage.removeItem('dealerComparison');
    router.push('/dealer/login');
  };

  const handleAddToCart = (product: MockProduct, quantity: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const handleRemoveFromComparison = (productId: string) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== productId));
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

  const handleBackToCatalog = () => {
    router.push('/dealer/catalog');
  };

  if (loading || !user) {
    return <LoadingOverlay visible />;
  }

  return (
    <DealerNavigation user={user} onLogout={handleLogout}>
      <Container size="xl">
        <Stack>
          <Group>
            <Button
              variant="light"
              leftSection={<IconArrowLeft size={16} />}
              onClick={handleBackToCatalog}
            >
              Back to Catalog
            </Button>
            <Title order={2}>Product Comparison</Title>
          </Group>

          {comparisonProducts.length === 0 ? (
            <Stack align="center" py="xl">
              <Text size="lg" c="dimmed">
                No products selected for comparison
              </Text>
              <Text size="sm" c="dimmed">
                Go back to the catalog and select products to compare
              </Text>
              <Button onClick={handleBackToCatalog}>
                Browse Products
              </Button>
            </Stack>
          ) : (
            <ProductComparison
              products={comparisonProducts}
              opened={true}
              onClose={() => {}} // Not used in standalone page
              onAddToCart={handleAddToCart}
              onRemoveFromComparison={handleRemoveFromComparison}
              favoriteProducts={favoriteProducts}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </Stack>
      </Container>
    </DealerNavigation>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay } from '@mantine/core';
import { ProductCatalog } from '@/components/dealer/ProductCatalog';
import { ProductDetailModal } from '@/components/dealer/ProductDetailModal';
import { ProductComparison } from '@/components/dealer/ProductComparison';
import { DealerNavigation } from '@/components/dealer/DealerNavigation';
import { useRouter } from 'next/navigation';
import { generateMockProducts, MockProduct } from '@/lib/mockData/generators';

interface CartItem {
  product: MockProduct;
  quantity: number;
}

export default function DealerCatalogPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MockProduct | null>(null);
  const [comparisonProducts, setComparisonProducts] = useState<MockProduct[]>([]);
  const [comparisonOpened, setComparisonOpened] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts = generateMockProducts(50);
      setProducts(mockProducts);
      
      // Load cart from localStorage
      const savedCart = localStorage.getItem('dealerCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }

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

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleViewProduct = (product: MockProduct) => {
    setSelectedProduct(product);
  };

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToComparison = (product: MockProduct) => {
    if (comparisonProducts.length >= 4) return;
    setComparisonProducts(prev => [...prev, product]);
  };

  const handleRemoveFromComparison = (productId: string) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleOpenComparison = () => {
    setComparisonOpened(true);
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

  if (loading || !user) {
    return <LoadingOverlay visible />;
  }

  return (
    <DealerNavigation user={user} onLogout={handleLogout}>
      <Container size="xl">
        <ProductCatalog
          products={products}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onViewProduct={handleViewProduct}
          comparisonProducts={comparisonProducts}
          onAddToComparison={handleAddToComparison}
          onRemoveFromComparison={handleRemoveFromComparison}
          onOpenComparison={handleOpenComparison}
        />

        <ProductDetailModal
          product={selectedProduct}
          opened={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          cartQuantity={selectedProduct ? getCartQuantity(selectedProduct.id) : 0}
        />

        <ProductComparison
          products={comparisonProducts}
          opened={comparisonOpened}
          onClose={() => setComparisonOpened(false)}
          onAddToCart={handleAddToCart}
          onRemoveFromComparison={handleRemoveFromComparison}
          favoriteProducts={favoriteProducts}
          onToggleFavorite={handleToggleFavorite}
        />
      </Container>
    </DealerNavigation>
  );
}
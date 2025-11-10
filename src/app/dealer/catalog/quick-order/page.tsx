'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay } from '@mantine/core';
import { QuickOrderManager, QuickOrderItem } from '@/components/dealer/QuickOrderManager';
import { DealerNavigation } from '@/components/dealer/DealerNavigation';
import { useRouter } from 'next/navigation';
import { generateMockProducts, MockProduct } from '@/lib/mockData/generators';

interface CartItem {
  product: MockProduct;
  quantity: number;
}

export default function DealerQuickOrderPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<MockProduct[]>([]);
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

  const handleLogout = () => {
    localStorage.removeItem('dealerAuth');
    localStorage.removeItem('dealerCart');
    localStorage.removeItem('dealerFavorites');
    localStorage.removeItem('dealerProductLists');
    localStorage.removeItem('dealerQuickOrderTemplates');
    router.push('/dealer/login');
  };

  const handleAddToCart = (items: QuickOrderItem[]) => {
    // Get existing cart
    const savedCart = localStorage.getItem('dealerCart');
    let cartItems: CartItem[] = [];
    
    if (savedCart) {
      try {
        cartItems = JSON.parse(savedCart);
      } catch {
        cartItems = [];
      }
    }

    // Add quick order items to cart
    items.forEach(quickOrderItem => {
      const existingItemIndex = cartItems.findIndex(
        cartItem => cartItem.product.id === quickOrderItem.productId
      );

      if (existingItemIndex >= 0) {
        // Update existing cart item
        cartItems[existingItemIndex].quantity += quickOrderItem.quantity;
      } else {
        // Add new cart item
        cartItems.push({
          product: quickOrderItem.product,
          quantity: quickOrderItem.quantity,
        });
      }
    });

    // Save updated cart
    localStorage.setItem('dealerCart', JSON.stringify(cartItems));
    
    // Dispatch event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));

    // Redirect to cart
    router.push('/dealer/cart');
  };

  if (loading || !user) {
    return <LoadingOverlay visible />;
  }

  return (
    <DealerNavigation user={user} onLogout={handleLogout}>
      <Container size="xl">
        <QuickOrderManager
          products={products}
          onAddToCart={handleAddToCart}
        />
      </Container>
    </DealerNavigation>
  );
}
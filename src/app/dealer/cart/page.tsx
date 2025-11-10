'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay } from '@mantine/core';
import { ShoppingCart } from '@/components/dealer/ShoppingCart';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { useRouter } from 'next/navigation';
import { MockProduct } from '@/lib/mockData/generators';

interface CartItem {
  product: MockProduct;
  quantity: number;
}

interface OrderData {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  specialInstructions: string;
  requestedDeliveryDate: string;
}

export default function DealerCartPage() {
  const [loading, setLoading] = useState(true);
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

  const handleLogout = () => {
    localStorage.removeItem('dealerAuth');
    localStorage.removeItem('dealerCart');
    router.push('/dealer/login');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
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

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = async (orderData: OrderData) => {
    console.log('Processing order:', orderData);
    
    // Simulate API call to create order
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;
    
    // Clear cart
    setCartItems([]);
    
    // Redirect to order confirmation
    router.push(`/dealer/orders/${orderNumber}?new=true`);
  };

  if (loading || !user) {
    return <LoadingOverlay visible />;
  }

  return (
    <DealerLayout>
      <Container size="lg">
        <ShoppingCart
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
        />
      </Container>
    </DealerLayout>
  );
}
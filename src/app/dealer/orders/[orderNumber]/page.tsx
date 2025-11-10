'use client';

import { useState, useEffect, use } from 'react';
import { Container, LoadingOverlay } from '@mantine/core';
import { OrderConfirmation } from '@/components/dealer/OrderConfirmation';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { useRouter, useSearchParams } from 'next/navigation';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
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
  trackingNumber?: string;
  shippingCarrier?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  specialInstructions?: string;
}

interface OrderDetailPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

// Mock function to find order by order number
const findOrderByNumber = (orderNumber: string): Order | null => {
  // In a real app, this would fetch from an API
  const mockOrder: Order = {
    id: 'order-1',
    orderNumber: orderNumber,
    date: new Date(),
    status: 'processing',
    items: [
      {
        productId: 'prod-1',
        productName: 'AQS Pro Series Heat Pump',
        quantity: 1,
        unitPrice: 3500,
        totalPrice: 3500,
      },
      {
        productId: 'prod-2',
        productName: 'AQS Smart Thermostat',
        quantity: 2,
        unitPrice: 250,
        totalPrice: 500,
      },
    ],
    subtotal: 4000,
    tax: 320,
    shipping: 0,
    total: 4320,
    shippingAddress: {
      name: 'Mike Johnson',
      company: 'ABC HVAC Solutions',
      address: '123 Industrial Blvd',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
    },
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    specialInstructions: 'Please deliver to rear entrance',
  };
  
  return mockOrder;
};

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = use(params);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewOrder = searchParams.get('new') === 'true';

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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundOrder = findOrderByNumber(orderNumber);
      setOrder(foundOrder);

      setUser({
        name: 'Mike Johnson',
        email: 'mike@abchvac.com',
        companyName: 'ABC HVAC Solutions',
        role: 'Owner',
      });

      setLoading(false);
    };

    loadData();
  }, [router, orderNumber]);

  const handleLogout = () => {
    localStorage.removeItem('dealerAuth');
    localStorage.removeItem('dealerCart');
    router.push('/dealer/login');
  };

  const handleDownloadInvoice = (orderId: string) => {
    console.log('Downloading invoice for order:', orderId);
    // In a real app, this would generate and download a PDF invoice
    alert('Invoice download would start here');
  };

  const handleReorder = (order: Order) => {
    console.log('Reordering:', order);
    
    // Add items to cart
    const cartItems = order.items.map(item => ({
      product: {
        id: item.productId,
        name: item.productName,
        dealerPrice: item.unitPrice,
        // Add other required product properties with defaults
        category: 'Unknown',
        description: '',
        specifications: {},
        basePrice: item.unitPrice * 1.25,
        inStock: true,
        stockQuantity: 10,
        imageUrl: '',
        features: [],
        warranty: '1 Year',
        createdAt: new Date(),
      },
      quantity: item.quantity,
    }));
    
    localStorage.setItem('dealerCart', JSON.stringify(cartItems));
    router.push('/dealer/cart');
  };

  const handleContinueShopping = () => {
    router.push('/dealer/catalog');
  };

  const handleViewAllOrders = () => {
    router.push('/dealer/orders');
  };

  if (loading || !user) {
    return <LoadingOverlay visible />;
  }

  if (!order) {
    return (
      <DealerLayout>
        <Container size="lg">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Order Not Found</h2>
            <p>The order {orderNumber} could not be found.</p>
            <button onClick={() => router.push('/dealer/orders')}>
              Back to Orders
            </button>
          </div>
        </Container>
      </DealerLayout>
    );
  }

  return (
    <DealerLayout>
      <Container size="lg">
        <OrderConfirmation
          order={order}
          isNewOrder={isNewOrder}
          onDownloadInvoice={handleDownloadInvoice}
          onReorder={handleReorder}
          onContinueShopping={handleContinueShopping}
          onViewAllOrders={handleViewAllOrders}
        />
      </Container>
    </DealerLayout>
  );
}
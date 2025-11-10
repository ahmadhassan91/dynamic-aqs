'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay } from '@mantine/core';
import { OrderHistory } from '@/components/dealer/OrderHistory';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { useRouter } from 'next/navigation';

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

// Mock data generator for orders
const generateMockOrders = (): Order[] => {
  const orders: Order[] = [];
  const statuses: Array<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'> = 
    ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  const products = [
    'AQS Pro Series Heat Pump',
    'AQS Comfort Air Handler',
    'AQS Smart Thermostat',
    'AQS Ductwork Kit',
    'AQS Installation Tools',
  ];

  for (let i = 1; i <= 25; i++) {
    const orderDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const itemCount = Math.floor(Math.random() * 4) + 1;
    
    const items: OrderItem[] = [];
    let subtotal = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const productName = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const unitPrice = Math.floor(Math.random() * 3000) + 500;
      const totalPrice = quantity * unitPrice;
      
      items.push({
        productId: `prod-${j}`,
        productName,
        quantity,
        unitPrice,
        totalPrice,
      });
      
      subtotal += totalPrice;
    }
    
    const tax = subtotal * 0.08;
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + tax + shipping;
    
    orders.push({
      id: `order-${i}`,
      orderNumber: `ORD-2024-${String(i).padStart(3, '0')}`,
      date: orderDate,
      status,
      items,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress: {
        name: 'Mike Johnson',
        company: 'ABC HVAC Solutions',
        address: '123 Industrial Blvd',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
      },
      trackingNumber: ['shipped', 'delivered'].includes(status) ? 
        `1Z${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,
      shippingCarrier: ['shipped', 'delivered'].includes(status) ? 
        ['UPS', 'FedEx', 'USPS'][Math.floor(Math.random() * 3)] : undefined,
      estimatedDelivery: status !== 'cancelled' ? 
        new Date(orderDate.getTime() + (5 + Math.random() * 5) * 24 * 60 * 60 * 1000) : undefined,
      actualDelivery: status === 'delivered' ? 
        new Date(orderDate.getTime() + (3 + Math.random() * 7) * 24 * 60 * 60 * 1000) : undefined,
      specialInstructions: Math.random() > 0.7 ? 'Please deliver to rear entrance' : undefined,
    });
  }
  
  return orders;
};

export default function DealerOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
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
      
      const mockOrders = generateMockOrders();
      setOrders(mockOrders);

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
    router.push('/dealer/login');
  };

  const handleViewOrder = (order: Order) => {
    router.push(`/dealer/orders/${order.orderNumber}`);
  };

  const handleCancelOrder = async (orderId: string) => {
    console.log('Cancelling order:', orderId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update order status
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as const }
          : order
      )
    );
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

  const handleDownloadInvoice = (orderId: string) => {
    console.log('Downloading invoice for order:', orderId);
    // In a real app, this would generate and download a PDF invoice
    alert('Invoice download would start here');
  };

  if (loading || !user) {
    return <LoadingOverlay visible />;
  }

  return (
    <DealerLayout>
      <Container size="xl">
        <OrderHistory
          orders={orders}
          onViewOrder={handleViewOrder}
          onCancelOrder={handleCancelOrder}
          onReorder={handleReorder}
          onDownloadInvoice={handleDownloadInvoice}
        />
      </Container>
    </DealerLayout>
  );
}
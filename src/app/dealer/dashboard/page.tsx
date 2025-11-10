'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay } from '@mantine/core';
import { DealerDashboard } from '@/components/dealer/DealerDashboard';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { useRouter } from 'next/navigation';

// Mock data generator for dealer dashboard
const generateMockDealerData = () => {
  const now = new Date();
  
  return {
    dealerInfo: {
      companyName: 'ABC HVAC Solutions',
      accountNumber: 'DLR-12345',
      creditLimit: 50000,
      availableCredit: 35000,
      paymentTerms: 'Net 30',
      territoryManager: {
        name: 'John Smith',
        email: 'john.smith@dynamicaqs.com',
        phone: '(555) 123-4567',
      },
    },
    recentOrders: [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        total: 4250.00,
        status: 'Shipped',
        itemCount: 3,
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        total: 1850.00,
        status: 'Delivered',
        itemCount: 2,
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        total: 3200.00,
        status: 'Processing',
        itemCount: 4,
      },
    ],
    accountSummary: {
      totalOrders: 24,
      totalSpent: 125000,
      averageOrderValue: 5208,
      lastOrderDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    user: {
      name: 'Mike Johnson',
      email: 'mike@abchvac.com',
      companyName: 'ABC HVAC Solutions',
      role: 'Owner',
    },
  };
};

export default function DealerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dealerData, setDealerData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('dealerAuth');
    if (!auth) {
      router.push('/dealer/login');
      return;
    }

    // Load dealer data
    const loadData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDealerData(generateMockDealerData());
      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dealerAuth');
    router.push('/dealer/login');
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/dealer/orders/${orderId}`);
  };

  const handleCreateOrder = () => {
    router.push('/dealer/catalog');
  };

  const handleViewAllOrders = () => {
    router.push('/dealer/orders');
  };

  if (loading || !dealerData) {
    return <LoadingOverlay visible />;
  }

  return (
    <DealerLayout>
      <Container size="xl">
        <DealerDashboard
          dealerInfo={dealerData.dealerInfo}
          recentOrders={dealerData.recentOrders}
          accountSummary={dealerData.accountSummary}
          onViewOrder={handleViewOrder}
          onCreateOrder={handleCreateOrder}
          onViewAllOrders={handleViewAllOrders}
        />
      </Container>
    </DealerLayout>
  );
}
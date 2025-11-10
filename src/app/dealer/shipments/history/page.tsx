'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay } from '@mantine/core';
import { DealerNavigation } from '@/components/dealer/DealerNavigation';
import { ShipmentHistoryTracker } from '@/components/dealer/ShipmentHistoryTracker';
import { useRouter } from 'next/navigation';

export default function DealerShipmentHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('dealerAuth');
    if (!auth) {
      router.push('/dealer/login');
      return;
    }

    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
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
    router.push('/dealer/login');
  };

  if (loading || !user) {
    return <LoadingOverlay visible />;
  }

  return (
    <DealerNavigation user={user} onLogout={handleLogout}>
      <Container size="xl">
        <ShipmentHistoryTracker />
      </Container>
    </DealerNavigation>
  );
}
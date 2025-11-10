'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay, Tabs } from '@mantine/core';
import { DealerNavigation } from '@/components/dealer/DealerNavigation';
import { ShipmentScheduleManager } from '@/components/dealer/ShipmentScheduleManager';
import { ShipmentReschedulingManager } from '@/components/dealer/ShipmentReschedulingManager';
import { useRouter } from 'next/navigation';
import { IconCalendar, IconRefresh } from '@tabler/icons-react';

export default function DealerShipmentSchedulePage() {
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
        <Tabs defaultValue="schedule">
          <Tabs.List>
            <Tabs.Tab value="schedule" leftSection={<IconCalendar size={16} />}>
              Schedule Management
            </Tabs.Tab>
            <Tabs.Tab value="reschedule" leftSection={<IconRefresh size={16} />}>
              Rescheduling
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="schedule" pt="md">
            <ShipmentScheduleManager />
          </Tabs.Panel>

          <Tabs.Panel value="reschedule" pt="md">
            <ShipmentReschedulingManager />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </DealerNavigation>
  );
}
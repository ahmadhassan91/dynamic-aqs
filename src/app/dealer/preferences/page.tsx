'use client';

import { useState } from 'react';
import { Tabs } from '@mantine/core';
import { IconMapPin, IconCalendar } from '@tabler/icons-react';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { DeliveryPreferenceManager } from '@/components/dealer/DeliveryPreferenceManager';
import { DeliveryWindowScheduler } from '@/components/dealer/DeliveryWindowScheduler';

export default function DeliveryPreferencesPage() {
  return (
    <DealerLayout>
      <Tabs defaultValue="preferences">
        <Tabs.List>
          <Tabs.Tab value="preferences" leftSection={<IconMapPin size={16} />}>
            Delivery Preferences
          </Tabs.Tab>
          <Tabs.Tab value="scheduler" leftSection={<IconCalendar size={16} />}>
            Delivery Scheduler
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="preferences" pt="md">
          <DeliveryPreferenceManager />
        </Tabs.Panel>

        <Tabs.Panel value="scheduler" pt="md">
          <DeliveryWindowScheduler />
        </Tabs.Panel>
      </Tabs>
    </DealerLayout>
  );
}
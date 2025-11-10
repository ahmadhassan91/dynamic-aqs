'use client';

import { useState } from 'react';
import {
  Title,
  Text,
  Tabs,
  Stack,
} from '@mantine/core';
import { TerritoryAssignment } from './TerritoryAssignment';
import { InteractiveTerritoryMap } from './InteractiveTerritoryMap';
import { TerritoryPerformanceAnalytics } from './TerritoryPerformanceAnalytics';
import { BulkTerritoryOperations } from './BulkTerritoryOperations';
import { AffinityGroupManagement } from './AffinityGroupManagement';
import { OwnershipGroupManagement } from './OwnershipGroupManagement';
import { OrganizationChart } from './OrganizationChart';

export function TerritoryManagement() {
  return (
    <Stack gap="lg">
        {/* Header */}
        <div>
          <Title order={1}>Territory Management System</Title>
          <Text c="dimmed" size="lg">
            Interactive territory management with map view, boundary editing, and customer assignment
          </Text>
        </div>

        {/* Tabs for different management areas */}
        <Tabs defaultValue="map" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="map">Interactive Map</Tabs.Tab>
            <Tabs.Tab value="territories">Territory Assignment</Tabs.Tab>
            <Tabs.Tab value="analytics">Performance Analytics</Tabs.Tab>
            <Tabs.Tab value="bulk">Bulk Operations</Tabs.Tab>
            <Tabs.Tab value="affinity">Affinity Groups</Tabs.Tab>
            <Tabs.Tab value="ownership">Ownership Groups</Tabs.Tab>
            <Tabs.Tab value="organization">Organization Chart</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="map" pt="lg">
            <InteractiveTerritoryMap />
          </Tabs.Panel>

          <Tabs.Panel value="territories" pt="lg">
            <TerritoryAssignment />
          </Tabs.Panel>

          <Tabs.Panel value="analytics" pt="lg">
            <TerritoryPerformanceAnalytics />
          </Tabs.Panel>

          <Tabs.Panel value="bulk" pt="lg">
            <BulkTerritoryOperations />
          </Tabs.Panel>

          <Tabs.Panel value="affinity" pt="lg">
            <AffinityGroupManagement />
          </Tabs.Panel>

          <Tabs.Panel value="ownership" pt="lg">
            <OwnershipGroupManagement />
          </Tabs.Panel>

          <Tabs.Panel value="organization" pt="lg">
            <OrganizationChart />
          </Tabs.Panel>
        </Tabs>
    </Stack>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import {
  Title, Text, Card, Group, Stack, Select, Button, ThemeIcon,
  Loader, Center, SimpleGrid, Badge, Progress, Table, Tooltip,
  ActionIcon, Modal, Textarea, Rating
} from '@mantine/core';
import {
  IconUsers, IconTrendingUp, IconTarget, IconCurrencyDollar,
  IconAlertTriangle, IconStar, IconMapPin, IconArrowUp, IconArrowDown,
  IconMinus, IconEdit, IconHistory
} from '@tabler/icons-react';
import { ManufacturerRep, RepRating } from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

// Mock data with new fields for demo
const mockRepsWithRatings: ManufacturerRep[] = [
  {
    id: '1',
    organizationId: 'ABC Rep Group',
    personalInfo: { firstName: 'John', lastName: 'Smith', email: 'john@abc.com', phone: '555-0101' },
    territoryIds: ['TX-01'],
    territory: { counties: ['Harris', 'Fort Bend', 'Montgomery'], state: 'TX', isExclusive: true },
    rating: RepRating.CHAMPION,
    ratingHistory: [
      { previousRating: RepRating.STRONG_PERFORMER, newRating: RepRating.CHAMPION, reason: 'Exceeded quota, brought 12 leads', changedBy: 'Dan', changedAt: new Date('2024-01-15') }
    ],
    leadsThisMonth: 8,
    leadsThisQuarter: 24,
    leadsThisYear: 67,
    missedLeads: 0,
    missedLeadHistory: [],
    quota: { fiscalYear: 2024, annualQuota: 500000, quarterlyQuotas: [125000, 125000, 125000, 125000], currentProgress: 420000, lastUpdated: new Date() },
    performance: { totalQuotes: 45, totalPOs: 32, totalShipments: 28, conversionRate: 71, averageDealSize: 15000, ytdRevenue: 420000, lastCalculated: new Date() },
    engineeringFirms: [],
    targetAccounts: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    organizationId: 'Southwest Reps LLC',
    personalInfo: { firstName: 'Maria', lastName: 'Garcia', email: 'maria@swreps.com', phone: '555-0102' },
    territoryIds: ['AZ-01'],
    territory: { counties: ['Maricopa', 'Pima', 'Pinal'], state: 'AZ', isExclusive: true },
    rating: RepRating.STRONG_PERFORMER,
    ratingHistory: [],
    leadsThisMonth: 5,
    leadsThisQuarter: 15,
    leadsThisYear: 42,
    missedLeads: 1,
    missedLeadHistory: [
      { id: '1', opportunityId: 'opp-1', opportunityName: 'Phoenix Convention Center', leadSource: 'Trade Show (Domestic)' as any, county: 'Maricopa', state: 'AZ', dateIdentified: new Date('2024-01-10'), wasAddressed: true, notes: 'Discussed with rep' }
    ],
    quota: { fiscalYear: 2024, annualQuota: 400000, quarterlyQuotas: [100000, 100000, 100000, 100000], currentProgress: 280000, lastUpdated: new Date() },
    performance: { totalQuotes: 35, totalPOs: 22, totalShipments: 20, conversionRate: 63, averageDealSize: 12000, ytdRevenue: 280000, lastCalculated: new Date() },
    engineeringFirms: [],
    targetAccounts: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    organizationId: 'Midwest Partners',
    personalInfo: { firstName: 'Robert', lastName: 'Johnson', email: 'robert@midwest.com', phone: '555-0103' },
    territoryIds: ['IL-01'],
    territory: { counties: ['Cook', 'DuPage', 'Lake', 'Will'], state: 'IL', isExclusive: true },
    rating: RepRating.ACTIVE,
    ratingHistory: [],
    leadsThisMonth: 3,
    leadsThisQuarter: 9,
    leadsThisYear: 28,
    missedLeads: 2,
    missedLeadHistory: [
      { id: '2', opportunityId: 'opp-2', opportunityName: 'Chicago Hospital Expansion', leadSource: 'Trade Show (Domestic)' as any, county: 'Cook', state: 'IL', dateIdentified: new Date('2024-01-05'), wasAddressed: false },
      { id: '3', opportunityId: 'opp-3', opportunityName: 'Naperville School District', leadSource: 'Trade Show (Domestic)' as any, county: 'DuPage', state: 'IL', dateIdentified: new Date('2024-01-12'), wasAddressed: false }
    ],
    quota: { fiscalYear: 2024, annualQuota: 450000, quarterlyQuotas: [112500, 112500, 112500, 112500], currentProgress: 180000, lastUpdated: new Date() },
    performance: { totalQuotes: 28, totalPOs: 15, totalShipments: 12, conversionRate: 54, averageDealSize: 11000, ytdRevenue: 180000, lastCalculated: new Date() },
    engineeringFirms: [],
    targetAccounts: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    organizationId: 'Eastern Sales Co',
    personalInfo: { firstName: 'Sarah', lastName: 'Williams', email: 'sarah@eastern.com', phone: '555-0104' },
    territoryIds: ['NY-01'],
    territory: { counties: ['New York', 'Kings', 'Queens', 'Bronx'], state: 'NY', isExclusive: true },
    rating: RepRating.MINIMAL_ACTIVITY,
    ratingHistory: [
      { previousRating: RepRating.ACTIVE, newRating: RepRating.MINIMAL_ACTIVITY, reason: 'Declining lead volume, missed 3 trade show leads', changedBy: 'Dan', changedAt: new Date('2024-01-08') }
    ],
    leadsThisMonth: 1,
    leadsThisQuarter: 4,
    leadsThisYear: 12,
    missedLeads: 4,
    missedLeadHistory: [],
    quota: { fiscalYear: 2024, annualQuota: 600000, quarterlyQuotas: [150000, 150000, 150000, 150000], currentProgress: 95000, lastUpdated: new Date() },
    performance: { totalQuotes: 12, totalPOs: 6, totalShipments: 5, conversionRate: 50, averageDealSize: 14000, ytdRevenue: 95000, lastCalculated: new Date() },
    engineeringFirms: [],
    targetAccounts: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    organizationId: 'Pacific Reps Inc',
    personalInfo: { firstName: 'David', lastName: 'Lee', email: 'david@pacific.com', phone: '555-0105' },
    territoryIds: ['CA-01'],
    territory: { counties: ['Los Angeles', 'Orange', 'San Diego'], state: 'CA', isExclusive: true },
    rating: RepRating.NOT_ENGAGED,
    ratingHistory: [],
    leadsThisMonth: 0,
    leadsThisQuarter: 2,
    leadsThisYear: 5,
    missedLeads: 6,
    missedLeadHistory: [],
    quota: { fiscalYear: 2024, annualQuota: 700000, quarterlyQuotas: [175000, 175000, 175000, 175000], currentProgress: 45000, lastUpdated: new Date() },
    performance: { totalQuotes: 8, totalPOs: 3, totalShipments: 2, conversionRate: 38, averageDealSize: 12000, ytdRevenue: 45000, lastCalculated: new Date() },
    engineeringFirms: [],
    targetAccounts: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export function RepPerformanceDashboard() {
  const [reps, setReps] = useState<ManufacturerRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRep, setSelectedRep] = useState<ManufacturerRep | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    loadReps();
  }, []);

  const loadReps = async () => {
    try {
      setLoading(true);
      // Use mock data with new fields for demo
      setReps(mockRepsWithRatings);
    } catch (error) {
      console.error('Error loading reps:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRatingLabel = (rating: RepRating): string => {
    const labels: Record<number, string> = {
      1: 'Not Engaged',
      2: 'Minimal Activity',
      3: 'Active',
      4: 'Strong Performer',
      5: 'Champion'
    };
    return labels[rating] || 'Unknown';
  };

  const getRatingColor = (rating: RepRating): string => {
    const colors: Record<number, string> = {
      1: 'red',
      2: 'orange',
      3: 'yellow',
      4: 'teal',
      5: 'green'
    };
    return colors[rating] || 'gray';
  };

  const getRatingTrend = (rep: ManufacturerRep): 'up' | 'down' | 'stable' => {
    if (rep.ratingHistory.length === 0) return 'stable';
    const lastChange = rep.ratingHistory[rep.ratingHistory.length - 1];
    if (lastChange.newRating > lastChange.previousRating) return 'up';
    if (lastChange.newRating < lastChange.previousRating) return 'down';
    return 'stable';
  };

  // Calculate summary stats
  const avgRating = reps.length > 0 
    ? (reps.reduce((sum, rep) => sum + rep.rating, 0) / reps.length).toFixed(1)
    : '0';
  const totalLeads = reps.reduce((sum, rep) => sum + rep.leadsThisMonth, 0);
  const totalMissedLeads = reps.reduce((sum, rep) => sum + rep.missedLeads, 0);
  const repsNeedingAttention = reps.filter(rep => rep.rating <= 2 || rep.missedLeads >= 3).length;

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Stack gap="xl">
      {/* Summary Stats - Rep Focused */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        <Card withBorder padding="lg" className="commercial-stat-card">
          <Group justify="space-between">
            <Stack gap={4}>
              <Text size="sm" c="dimmed" fw={500}>Active Reps</Text>
              <Text size="xl" fw={700}>{reps.length}</Text>
            </Stack>
            <ThemeIcon size="xl" radius="md" color="blue" variant="light">
              <IconUsers size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder padding="lg" className="commercial-stat-card">
          <Group justify="space-between">
            <Stack gap={4}>
              <Text size="sm" c="dimmed" fw={500}>Avg Rep Rating</Text>
              <Group gap="xs">
                <Text size="xl" fw={700}>{avgRating}</Text>
                <Rating value={parseFloat(avgRating)} fractions={2} readOnly size="sm" />
              </Group>
            </Stack>
            <ThemeIcon size="xl" radius="md" color="yellow" variant="light">
              <IconStar size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder padding="lg" className="commercial-stat-card">
          <Group justify="space-between">
            <Stack gap={4}>
              <Text size="sm" c="dimmed" fw={500}>Leads This Month</Text>
              <Text size="xl" fw={700}>{totalLeads}</Text>
              <Text size="xs" c="dimmed">From Reps (expected source)</Text>
            </Stack>
            <ThemeIcon size="xl" radius="md" color="green" variant="light">
              <IconTarget size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder padding="lg" className="commercial-stat-card" style={{ borderColor: totalMissedLeads > 0 ? 'var(--mantine-color-red-5)' : undefined }}>
          <Group justify="space-between">
            <Stack gap={4}>
              <Text size="sm" c="dimmed" fw={500}>Missed Leads</Text>
              <Text size="xl" fw={700} c={totalMissedLeads > 0 ? 'red' : undefined}>{totalMissedLeads}</Text>
              <Text size="xs" c="red">Trade show leads in rep territory</Text>
            </Stack>
            <ThemeIcon size="xl" radius="md" color="red" variant="light">
              <IconAlertTriangle size={24} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Alert for reps needing attention */}
      {repsNeedingAttention > 0 && (
        <Card withBorder padding="md" bg="red.0" style={{ borderColor: 'var(--mantine-color-red-5)' }}>
          <Group>
            <IconAlertTriangle size={20} color="var(--mantine-color-red-6)" />
            <Text size="sm" fw={500} c="red.8">
              {repsNeedingAttention} rep(s) need attention: Low rating or frequent missed leads
            </Text>
          </Group>
        </Card>
      )}

      {/* Rep Performance Table */}
      <Card withBorder padding="lg" className="commercial-card-static">
        <Group justify="space-between" mb="md">
          <Title order={3}>Manufacturer Rep Performance</Title>
          <Text size="sm" c="dimmed">Core metric: Move reps from 1 → 5</Text>
        </Group>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Representative</Table.Th>
              <Table.Th>Territory</Table.Th>
              <Table.Th>Rating (1-5)</Table.Th>
              <Table.Th>Leads Brought</Table.Th>
              <Table.Th>Missed Leads</Table.Th>
              <Table.Th>Quota Progress</Table.Th>
              <Table.Th>YTD Revenue</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {reps.map(rep => {
              const quotaProgress = (rep.performance.ytdRevenue / rep.quota.annualQuota) * 100;
              const trend = getRatingTrend(rep);
              
              return (
                <Table.Tr key={rep.id} style={{ backgroundColor: rep.missedLeads >= 3 ? 'var(--mantine-color-red-0)' : undefined }}>
                  <Table.Td>
                    <div>
                      <Text fw={500} size="sm">
                        {rep.personalInfo.firstName} {rep.personalInfo.lastName}
                      </Text>
                      <Text size="xs" c="dimmed">{rep.organizationId}</Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label={rep.territory.counties.join(', ')}>
                      <Group gap="xs">
                        <IconMapPin size={14} />
                        <Text size="sm">{rep.territory.state}</Text>
                        <Badge size="xs" variant="light">{rep.territory.counties.length} counties</Badge>
                      </Group>
                    </Tooltip>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Rating value={rep.rating} readOnly size="sm" />
                      <Badge color={getRatingColor(rep.rating)} variant="light" size="sm">
                        {getRatingLabel(rep.rating)}
                      </Badge>
                      {trend === 'up' && <IconArrowUp size={14} color="green" />}
                      {trend === 'down' && <IconArrowDown size={14} color="red" />}
                      {trend === 'stable' && <IconMinus size={14} color="gray" />}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={2}>
                      <Text size="sm" fw={500}>{rep.leadsThisMonth} this month</Text>
                      <Text size="xs" c="dimmed">{rep.leadsThisQuarter} this quarter</Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    {rep.missedLeads > 0 ? (
                      <Tooltip label={`${rep.missedLeads} trade show leads in their territory - Rep should have brought these`}>
                        <Badge 
                          color="red" 
                          variant={rep.missedLeads >= 3 ? 'filled' : 'light'}
                          leftSection={<IconAlertTriangle size={12} />}
                        >
                          {rep.missedLeads} missed
                        </Badge>
                      </Tooltip>
                    ) : (
                      <Badge color="green" variant="light">None</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <Progress 
                          value={Math.min(quotaProgress, 100)} 
                          size="sm" 
                          color={quotaProgress >= 100 ? 'green' : quotaProgress >= 75 ? 'yellow' : 'red'}
                          w={60}
                        />
                        <Text size="sm" fw={500}>{quotaProgress.toFixed(0)}%</Text>
                      </Group>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={600}>{formatCurrency(rep.performance.ytdRevenue)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Tooltip label="Update Rating">
                        <ActionIcon 
                          variant="light" 
                          color="blue" 
                          size="sm"
                          onClick={() => { setSelectedRep(rep); setShowRatingModal(true); }}
                        >
                          <IconEdit size={14} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="View History">
                        <ActionIcon variant="light" color="gray" size="sm">
                          <IconHistory size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Rating Legend */}
      <Card withBorder padding="md">
        <Title order={5} mb="sm">Rating Scale (Core Metric)</Title>
        <Group gap="lg">
          {[1, 2, 3, 4, 5].map(rating => (
            <Group key={rating} gap="xs">
              <Rating value={rating} readOnly size="xs" />
              <Badge color={getRatingColor(rating as RepRating)} variant="light" size="sm">
                {getRatingLabel(rating as RepRating)}
              </Badge>
            </Group>
          ))}
        </Group>
        <Text size="xs" c="dimmed" mt="sm">
          <strong>⚠️ Replacement Trigger:</strong> Frequent missed leads = "probably not the right rep for us" — Dan
        </Text>
      </Card>

      {/* Rating Update Modal */}
      <Modal
        opened={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        title={`Update Rating: ${selectedRep?.personalInfo.firstName} ${selectedRep?.personalInfo.lastName}`}
      >
        {selectedRep && (
          <Stack gap="md">
            <div>
              <Text size="sm" fw={500} mb="xs">Current Rating</Text>
              <Group>
                <Rating value={selectedRep.rating} readOnly />
                <Badge color={getRatingColor(selectedRep.rating)}>{getRatingLabel(selectedRep.rating)}</Badge>
              </Group>
            </div>
            <div>
              <Text size="sm" fw={500} mb="xs">New Rating</Text>
              <Rating defaultValue={selectedRep.rating} size="lg" />
            </div>
            <Textarea
              label="Reason for Change"
              placeholder="e.g., Increased lead volume, missed 2 trade show leads..."
              minRows={3}
            />
            <Group justify="flex-end">
              <Button variant="light" onClick={() => setShowRatingModal(false)}>Cancel</Button>
              <Button onClick={() => setShowRatingModal(false)}>Save Rating</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}

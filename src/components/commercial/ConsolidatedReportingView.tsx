'use client';

import React, { useState, useEffect } from 'react';
import { Organization, OrganizationType, CommercialOpportunity, EngineerContact } from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';
import {
  Stack,
  Group,
  Title,
  Text,
  Card,
  Paper,
  SimpleGrid,
  ThemeIcon,
  Badge,
  ActionIcon,
  Select,
  Checkbox,
  Button,
  LoadingOverlay,
  Divider,
  Grid
} from '@mantine/core';
import {
  IconBuildingSkyscraper,
  IconBuildingFactory,
  IconBuildingCommunity,
  IconTools,
  IconX,
  IconUsers,
  IconTarget,
  IconChartBar,
  IconHistory,
  IconArrowLeft,
  IconBuilding
} from '@tabler/icons-react';

interface ConsolidatedData {
  organization: Organization;
  children: Organization[];
  totalContacts: number;
  totalOpportunities: number;
  totalOpportunityValue: number;
  activeContacts: number;
  recentOpportunities: CommercialOpportunity[];
  topContacts: EngineerContact[];
  historicalRelationships: HistoricalRelationship[];
}

interface HistoricalRelationship {
  id: string;
  organizationId: string;
  organizationName: string;
  relationshipType: 'parent' | 'child' | 'sibling';
  startDate: Date;
  endDate?: Date;
  reason?: string;
}

interface ConsolidatedReportingViewProps {
  organizationId?: string;
  organizationType?: OrganizationType;
  className?: string;
}

export default function ConsolidatedReportingView({ 
  organizationId, 
  organizationType,
  className = '' 
}: ConsolidatedReportingViewProps) {
  const [consolidatedData, setConsolidatedData] = useState<ConsolidatedData[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<ConsolidatedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('name');
  const [filterActive, setFilterActive] = useState(true);

  useEffect(() => {
    loadConsolidatedData();
  }, [organizationId, organizationType, filterActive]);

  const loadConsolidatedData = async () => {
    try {
      setLoading(true);
      const organizations = await commercialService.getOrganizations(organizationType);
      const opportunities = await commercialService.getOpportunities();
      const engineers = await commercialService.getEngineers();

      let filteredOrgs = organizations;
      if (organizationId) {
        filteredOrgs = organizations.filter(org => 
          org.id === organizationId || org.parentId === organizationId
        );
      }
      if (filterActive) {
        filteredOrgs = filteredOrgs.filter(org => org.isActive);
      }

      const parentOrgs = filteredOrgs.filter(org => 
        !org.parentId || org.parentId === organizationId
      );

      const consolidated = await Promise.all(
        parentOrgs.map(async (org) => {
          const children = organizations.filter(child => child.parentId === org.id);
          const allOrgIds = [org.id, ...children.map(c => c.id)];
          
          const orgContacts = engineers.filter(eng => 
            allOrgIds.includes(eng.engineeringFirmId)
          );
          
          const orgOpportunities = opportunities.filter(opp => 
            allOrgIds.includes(opp.engineeringFirmId)
          );

          const totalOpportunityValue = orgOpportunities.reduce(
            (sum, opp) => sum + opp.estimatedValue, 0
          );

          const activeContacts = orgContacts.filter(contact => 
            contact.lastContactDate && 
            contact.lastContactDate > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          ).length;

          const recentOpportunities = orgOpportunities
            .filter(opp => opp.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5);

          const topContacts = orgContacts
            .sort((a, b) => b.totalOpportunityValue - a.totalOpportunityValue)
            .slice(0, 5);

          const historicalRelationships = generateMockHistoricalRelationships(org.id);

          return {
            organization: org,
            children,
            totalContacts: orgContacts.length,
            totalOpportunities: orgOpportunities.length,
            totalOpportunityValue,
            activeContacts,
            recentOpportunities,
            topContacts,
            historicalRelationships
          };
        })
      );

      const sorted = consolidated.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.organization.name.localeCompare(b.organization.name);
          case 'value':
            return b.totalOpportunityValue - a.totalOpportunityValue;
          case 'contacts':
            return b.totalContacts - a.totalContacts;
          case 'opportunities':
            return b.totalOpportunities - a.totalOpportunities;
          default:
            return 0;
        }
      });

      setConsolidatedData(sorted);
    } catch (error) {
      console.error('Error loading consolidated data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockHistoricalRelationships = (orgId: string): HistoricalRelationship[] => {
    return [
      {
        id: `hist_${orgId}_1`,
        organizationId: `parent_${orgId}`,
        organizationName: 'Former Parent Company',
        relationshipType: 'parent',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2022-06-30'),
        reason: 'Corporate restructuring'
      },
      {
        id: `hist_${orgId}_2`,
        organizationId: `child_${orgId}`,
        organizationName: 'Acquired Division',
        relationshipType: 'child',
        startDate: new Date('2021-03-15'),
        reason: 'Acquisition'
      }
    ];
  };

  const getOrganizationIcon = (type: OrganizationType) => {
    const icons = {
      [OrganizationType.ENGINEERING_FIRM]: IconBuildingSkyscraper,
      [OrganizationType.MANUFACTURER_REP]: IconBuildingFactory,
      [OrganizationType.BUILDING_OWNER]: IconBuildingCommunity,
      [OrganizationType.ARCHITECT]: IconTools,
      [OrganizationType.MECHANICAL_CONTRACTOR]: IconTools,
      [OrganizationType.FACILITIES_MANAGER]: IconBuildingFactory
    };
    return icons[type] || IconBuilding;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderSummaryCard = (data: ConsolidatedData) => {
    const Icon = getOrganizationIcon(data.organization.type);
    
    return (
      <Card
        key={data.organization.id}
        withBorder
        radius="md"
        padding="lg"
        style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
        onClick={() => setSelectedOrganization(data)}
      >
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Group>
              <ThemeIcon size={48} radius="md" variant="light" color="blue">
                <Icon size={28} />
              </ThemeIcon>
              <div>
                <Text fw={600} size="lg">{data.organization.name}</Text>
                <Text size="sm" c="dimmed">{data.organization.type}</Text>
              </div>
            </Group>
            {data.children.length > 0 && (
              <Badge variant="light" color="blue">
                {data.children.length} {data.children.length === 1 ? 'Division' : 'Divisions'}
              </Badge>
            )}
          </Group>

          <SimpleGrid cols={2} spacing="sm">
            <Paper withBorder p="xs" radius="sm" bg="gray.0">
              <Text size="xs" c="dimmed" ta="center">Contacts</Text>
              <Text fw={700} size="lg" ta="center" c="blue">{data.totalContacts}</Text>
            </Paper>
            <Paper withBorder p="xs" radius="sm" bg="gray.0">
              <Text size="xs" c="dimmed" ta="center">Active</Text>
              <Text fw={700} size="lg" ta="center" c="green">{data.activeContacts}</Text>
            </Paper>
            <Paper withBorder p="xs" radius="sm" bg="gray.0">
              <Text size="xs" c="dimmed" ta="center">Opps</Text>
              <Text fw={700} size="lg" ta="center" c="purple">{data.totalOpportunities}</Text>
            </Paper>
            <Paper withBorder p="xs" radius="sm" bg="gray.0">
              <Text size="xs" c="dimmed" ta="center">Value</Text>
              <Text fw={700} size="lg" ta="center" c="orange">{formatCurrency(data.totalOpportunityValue)}</Text>
            </Paper>
          </SimpleGrid>

          {data.recentOpportunities.length > 0 && (
            <Stack gap="xs" pt="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
              <Text size="xs" c="dimmed" fw={500}>Recent Activity</Text>
              {data.recentOpportunities.slice(0, 2).map(opp => (
                <Group key={opp.id} justify="space-between" wrap="nowrap">
                  <Text size="xs" truncate style={{ flex: 1 }}>{opp.jobSiteName}</Text>
                  <Text size="xs" fw={500}>{formatCurrency(opp.estimatedValue)}</Text>
                </Group>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>
    );
  };

  const renderDetailedView = () => {
    if (!selectedOrganization) return null;

    const data = selectedOrganization;
    const Icon = getOrganizationIcon(data.organization.type);

    return (
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <ActionIcon 
              variant="subtle" 
              color="gray" 
              size="lg"
              onClick={() => setSelectedOrganization(null)}
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <ThemeIcon size={48} radius="md" variant="light" color="blue">
              <Icon size={28} />
            </ThemeIcon>
            <div>
              <Title order={2}>{data.organization.name}</Title>
              <Text c="dimmed">{data.organization.type}</Text>
            </div>
          </Group>
        </Group>

        {/* Metrics */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          <Paper p="md" withBorder radius="md">
            <Group>
              <ThemeIcon size="lg" variant="light" color="blue"><IconUsers size={20} /></ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">Total Contacts</Text>
                <Text fw={700} size="xl">{data.totalContacts}</Text>
                <Text size="xs" c="blue">{data.activeContacts} active</Text>
              </div>
            </Group>
          </Paper>
          <Paper p="md" withBorder radius="md">
            <Group>
              <ThemeIcon size="lg" variant="light" color="green"><IconTarget size={20} /></ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">Opportunities</Text>
                <Text fw={700} size="xl">{data.totalOpportunities}</Text>
                <Text size="xs" c="green">{data.recentOpportunities.length} recent</Text>
              </div>
            </Group>
          </Paper>
          <Paper p="md" withBorder radius="md">
            <Group>
              <ThemeIcon size="lg" variant="light" color="purple"><IconChartBar size={20} /></ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">Pipeline Value</Text>
                <Text fw={700} size="xl">{formatCurrency(data.totalOpportunityValue)}</Text>
                <Text size="xs" c="purple">Total potential</Text>
              </div>
            </Group>
          </Paper>
          <Paper p="md" withBorder radius="md">
            <Group>
              <ThemeIcon size="lg" variant="light" color="orange"><IconHistory size={20} /></ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">Engagement Rate</Text>
                <Text fw={700} size="xl">
                  {Math.round((data.activeContacts / Math.max(data.totalContacts, 1)) * 100)}%
                </Text>
                <Text size="xs" c="orange">Active ratio</Text>
              </div>
            </Group>
          </Paper>
        </SimpleGrid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="xl">
              {/* Hierarchy */}
              {data.children.length > 0 && (
                <Paper p="md" withBorder radius="md">
                  <Title order={4} mb="md">Organization Structure</Title>
                  <Stack gap="sm">
                    {data.children.map(child => {
                      const ChildIcon = getOrganizationIcon(child.type);
                      return (
                        <Paper key={child.id} p="sm" bg="gray.0" radius="sm">
                          <Group justify="space-between">
                            <Group>
                              <ThemeIcon size="md" variant="white" color="gray">
                                <ChildIcon size={16} />
                              </ThemeIcon>
                              <div>
                                <Text fw={500}>{child.name}</Text>
                                <Text size="xs" c="dimmed">{child.type}</Text>
                              </div>
                            </Group>
                            <Badge 
                              color={child.isActive ? 'green' : 'red'} 
                              variant="light"
                            >
                              {child.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </Group>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Paper>
              )}

              {/* Recent Opportunities */}
              {data.recentOpportunities.length > 0 && (
                <Paper p="md" withBorder radius="md">
                  <Title order={4} mb="md">Recent Opportunities</Title>
                  <Stack gap="sm">
                    {data.recentOpportunities.map(opp => (
                      <Paper key={opp.id} p="sm" withBorder radius="sm">
                        <Group justify="space-between" align="flex-start">
                          <div>
                            <Text fw={500}>{opp.jobSiteName}</Text>
                            <Text size="sm" c="dimmed">{opp.description}</Text>
                            <Group gap="xs" mt={4}>
                              <Badge size="sm" variant="dot">{opp.marketSegment}</Badge>
                              <Badge size="sm" variant="dot" color="gray">{opp.salesPhase}</Badge>
                            </Group>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <Text fw={700}>{formatCurrency(opp.estimatedValue)}</Text>
                            <Text size="xs" c="dimmed">{opp.probability}% prob.</Text>
                          </div>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              {/* Top Contacts */}
              {data.topContacts.length > 0 && (
                <Paper p="md" withBorder radius="md">
                  <Title order={4} mb="md">Top Contacts</Title>
                  <Stack gap="sm">
                    {data.topContacts.map(contact => (
                      <Group key={contact.id} justify="space-between" wrap="nowrap">
                        <div>
                          <Text fw={500} size="sm">
                            {contact.personalInfo.firstName} {contact.personalInfo.lastName}
                          </Text>
                          <Text size="xs" c="dimmed">{contact.personalInfo.title}</Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Text fw={600} size="sm">{formatCurrency(contact.totalOpportunityValue)}</Text>
                          <Text size="xs" c="dimmed">Rating: {contact.rating}/5</Text>
                        </div>
                      </Group>
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* Historical */}
              {data.historicalRelationships.length > 0 && (
                <Paper p="md" withBorder radius="md">
                  <Title order={4} mb="md">History</Title>
                  <Stack gap="sm">
                    {data.historicalRelationships.map(rel => (
                      <Paper key={rel.id} p="xs" bg="gray.0" radius="sm">
                        <Text size="sm" fw={500}>{rel.organizationName}</Text>
                        <Text size="xs" c="dimmed" tt="capitalize">{rel.relationshipType}</Text>
                        <Text size="xs" mt={4}>
                          {rel.startDate.toLocaleDateString()} - {rel.endDate ? rel.endDate.toLocaleDateString() : 'Present'}
                        </Text>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    );
  };

  if (loading) {
    return (
      <Paper p="xl" style={{ minHeight: 400, position: 'relative' }}>
        <LoadingOverlay visible={true} />
      </Paper>
    );
  }

  return (
    <div className={className}>
      {!selectedOrganization ? (
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2}>Consolidated Organization Reports</Title>
              <Text c="dimmed">Parent organization rollup with consolidated metrics and relationships</Text>
            </div>
            <Group>
              <Checkbox
                label="Active only"
                checked={filterActive}
                onChange={(e) => setFilterActive(e.currentTarget.checked)}
              />
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value || 'name')}
                data={[
                  { value: 'name', label: 'Sort by Name' },
                  { value: 'value', label: 'Sort by Value' },
                  { value: 'contacts', label: 'Sort by Contacts' },
                  { value: 'opportunities', label: 'Sort by Opportunities' }
                ]}
              />
            </Group>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
            {consolidatedData.map(data => renderSummaryCard(data))}
          </SimpleGrid>

          {consolidatedData.length === 0 && (
            <Paper p="xl" withBorder ta="center" bg="gray.0">
              <Text c="dimmed">No organizations found matching the current filters</Text>
            </Paper>
          )}
        </Stack>
      ) : (
        renderDetailedView()
      )}
    </div>
  );
}

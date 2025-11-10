'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Stack,
  Badge,
  Grid,
  Select,
  Alert,
  Progress,
  ThemeIcon,
  ActionIcon,
  Tooltip,
  Table,
  Avatar,
  Tabs,
  SimpleGrid,
} from '@mantine/core';
import {
  IconBulb,
  IconTrendingUp,
  IconAlertTriangle,
  IconCalendar,
  IconClock,
  IconUsers,
  IconTarget,
  IconChartBar,
  IconRefresh,
  IconStar,
  IconArrowUp,
  IconArrowDown,
  IconMinus,
} from '@tabler/icons-react';

interface CustomerWithTraining {
  id: string;
  companyName: string;
  contactName: string;
  status: string;
  totalOrders: number;
  trainingStats: {
    totalSessions: number;
    completedSessions: number;
    scheduledSessions: number;
    overdueSessions: number;
    totalTrainingHours: number;
    certifications: number;
    averageRating: number;
    complianceStatus: string;
    missingTypes: string[];
    daysSinceLastTraining: number;
    needsRefresher: boolean;
    hasRecentOrders: boolean;
  };
}

interface TrainingRecommendationEngineProps {
  customers: CustomerWithTraining[];
}

interface Recommendation {
  id: string;
  customerId: string;
  customerName: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  impact: string;
  urgency: number; // days
  estimatedDuration: number; // minutes
  requiredCertification: boolean;
  businessValue: number; // 1-10 scale
}

export function TrainingRecommendationEngine({ customers }: TrainingRecommendationEngineProps) {
  const [activeTab, setActiveTab] = useState<string | null>('recommendations');
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Generate training recommendations
  const recommendations = useMemo(() => {
    const recs: Recommendation[] = [];

    customers.forEach(customer => {
      const { trainingStats } = customer;

      // High Priority: Missing required training
      if (trainingStats.missingTypes.includes('installation')) {
        recs.push({
          id: `${customer.id}-installation`,
          customerId: customer.id,
          customerName: customer.companyName,
          type: 'installation',
          priority: 'high',
          reason: 'Required installation training not completed',
          impact: 'Critical for equipment installation compliance',
          urgency: 30,
          estimatedDuration: 240,
          requiredCertification: true,
          businessValue: 9,
        });
      }

      if (trainingStats.missingTypes.includes('maintenance')) {
        recs.push({
          id: `${customer.id}-maintenance`,
          customerId: customer.id,
          customerName: customer.companyName,
          type: 'maintenance',
          priority: 'high',
          reason: 'Required maintenance training not completed',
          impact: 'Essential for proper equipment maintenance',
          urgency: 45,
          estimatedDuration: 180,
          requiredCertification: true,
          businessValue: 8,
        });
      }

      // Medium Priority: Refresher training needed
      if (trainingStats.needsRefresher) {
        recs.push({
          id: `${customer.id}-refresher`,
          customerId: customer.id,
          customerName: customer.companyName,
          type: 'refresher',
          priority: 'medium',
          reason: `Last training was ${trainingStats.daysSinceLastTraining} days ago`,
          impact: 'Keeps skills current and maintains certification',
          urgency: 90,
          estimatedDuration: 120,
          requiredCertification: false,
          businessValue: 6,
        });
      }

      // Medium Priority: Low performance indicators
      if (trainingStats.averageRating < 3.5 && trainingStats.completedSessions > 0) {
        recs.push({
          id: `${customer.id}-performance`,
          customerId: customer.id,
          customerName: customer.companyName,
          type: 'remedial',
          priority: 'medium',
          reason: `Low training performance (${trainingStats.averageRating.toFixed(1)}/5.0)`,
          impact: 'Improve skills and knowledge retention',
          urgency: 60,
          estimatedDuration: 180,
          requiredCertification: false,
          businessValue: 7,
        });
      }

      // Low Priority: Product knowledge updates
      if (trainingStats.hasRecentOrders && !trainingStats.missingTypes.includes('product_knowledge')) {
        recs.push({
          id: `${customer.id}-product`,
          customerId: customer.id,
          customerName: customer.companyName,
          type: 'product_knowledge',
          priority: 'low',
          reason: 'Recent orders indicate need for product updates',
          impact: 'Stay current with latest product features',
          urgency: 120,
          estimatedDuration: 90,
          requiredCertification: false,
          businessValue: 5,
        });
      }

      // Low Priority: Sales training for active customers
      if (customer.status === 'active' && trainingStats.missingTypes.includes('sales')) {
        recs.push({
          id: `${customer.id}-sales`,
          customerId: customer.id,
          customerName: customer.companyName,
          type: 'sales',
          priority: 'low',
          reason: 'Active customer without sales training',
          impact: 'Improve customer relationship and sales opportunities',
          urgency: 180,
          estimatedDuration: 120,
          requiredCertification: false,
          businessValue: 6,
        });
      }
    });

    return recs.sort((a, b) => {
      // Sort by priority first, then by urgency
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.urgency - b.urgency;
    });
  }, [customers]);

  // Filter recommendations
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const matchesPriority = !priorityFilter || rec.priority === priorityFilter;
      const matchesType = !typeFilter || rec.type === typeFilter;
      return matchesPriority && matchesType;
    });
  }, [recommendations, priorityFilter, typeFilter]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalRecs = recommendations.length;
    const highPriority = recommendations.filter(r => r.priority === 'high').length;
    const mediumPriority = recommendations.filter(r => r.priority === 'medium').length;
    const lowPriority = recommendations.filter(r => r.priority === 'low').length;
    
    const urgentRecs = recommendations.filter(r => r.urgency <= 30).length;
    const avgBusinessValue = recommendations.reduce((sum, r) => sum + r.businessValue, 0) / totalRecs || 0;
    
    const totalEstimatedHours = recommendations.reduce((sum, r) => sum + r.estimatedDuration, 0) / 60;
    const certificationRequired = recommendations.filter(r => r.requiredCertification).length;

    const typeBreakdown = recommendations.reduce((acc, rec) => {
      acc[rec.type] = (acc[rec.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRecs,
      highPriority,
      mediumPriority,
      lowPriority,
      urgentRecs,
      avgBusinessValue,
      totalEstimatedHours,
      certificationRequired,
      typeBreakdown,
    };
  }, [recommendations]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'installation': return IconTarget;
      case 'maintenance': return IconRefresh;
      case 'sales': return IconTrendingUp;
      case 'product_knowledge': return IconBulb;
      case 'refresher': return IconClock;
      case 'remedial': return IconAlertTriangle;
      default: return IconBulb;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getUrgencyIndicator = (urgency: number) => {
    if (urgency <= 30) return { icon: IconArrowUp, color: 'red', label: 'Urgent' };
    if (urgency <= 90) return { icon: IconMinus, color: 'orange', label: 'Soon' };
    return { icon: IconArrowDown, color: 'green', label: 'Later' };
  };

  return (
    <Stack gap="lg">
      {/* Analytics Overview */}
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }}>
        <Card withBorder p="md" ta="center">
          <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
            <IconBulb size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="blue">
            {analytics.totalRecs}
          </Text>
          <Text size="sm" c="dimmed">
            Total Recommendations
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="red" variant="light" size="xl" mx="auto" mb="sm">
            <IconAlertTriangle size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="red">
            {analytics.highPriority}
          </Text>
          <Text size="sm" c="dimmed">
            High Priority
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="orange" variant="light" size="xl" mx="auto" mb="sm">
            <IconClock size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="orange">
            {analytics.urgentRecs}
          </Text>
          <Text size="sm" c="dimmed">
            Urgent (≤30 days)
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
            <IconStar size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="green">
            {analytics.avgBusinessValue.toFixed(1)}
          </Text>
          <Text size="sm" c="dimmed">
            Avg Business Value
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="violet" variant="light" size="xl" mx="auto" mb="sm">
            <IconChartBar size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="violet">
            {analytics.totalEstimatedHours.toFixed(0)}h
          </Text>
          <Text size="sm" c="dimmed">
            Estimated Hours
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="teal" variant="light" size="xl" mx="auto" mb="sm">
            <IconUsers size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="teal">
            {analytics.certificationRequired}
          </Text>
          <Text size="sm" c="dimmed">
            Need Certification
          </Text>
        </Card>
      </SimpleGrid>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="recommendations" leftSection={<IconBulb size={16} />}>
            Recommendations
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="recommendations" pt="lg">
          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Title order={3}>Training Recommendations</Title>
              <Group gap="sm">
                <Select
                  placeholder="Priority"
                  data={[
                    { value: 'high', label: 'High Priority' },
                    { value: 'medium', label: 'Medium Priority' },
                    { value: 'low', label: 'Low Priority' },
                  ]}
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  clearable
                  w={130}
                />
                <Select
                  placeholder="Type"
                  data={[
                    { value: 'installation', label: 'Installation' },
                    { value: 'maintenance', label: 'Maintenance' },
                    { value: 'sales', label: 'Sales' },
                    { value: 'product_knowledge', label: 'Product Knowledge' },
                    { value: 'refresher', label: 'Refresher' },
                    { value: 'remedial', label: 'Remedial' },
                  ]}
                  value={typeFilter}
                  onChange={setTypeFilter}
                  clearable
                  w={150}
                />
              </Group>
            </Group>

            <Table.ScrollContainer minWidth={1000}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Training Type</Table.Th>
                    <Table.Th>Priority</Table.Th>
                    <Table.Th>Urgency</Table.Th>
                    <Table.Th>Duration</Table.Th>
                    <Table.Th>Business Value</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredRecommendations.map((rec) => {
                    const TypeIcon = getTypeIcon(rec.type);
                    const urgencyInfo = getUrgencyIndicator(rec.urgency);
                    
                    return (
                      <Table.Tr key={rec.id}>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar size={32} radius="xl" color="blue">
                              {rec.customerName.charAt(0)}
                            </Avatar>
                            <div>
                              <Text fw={500} size="sm">
                                {rec.customerName}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {rec.reason}
                              </Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <TypeIcon size={16} />
                            <div>
                              <Text size="sm" fw={500}>
                                {rec.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Text>
                              {rec.requiredCertification && (
                                <Badge color="gold" variant="light" size="xs">
                                  Certification
                                </Badge>
                              )}
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getPriorityColor(rec.priority)} variant="light">
                            {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <urgencyInfo.icon size={14} color={urgencyInfo.color} />
                            <div>
                              <Text size="sm">{rec.urgency} days</Text>
                              <Text size="xs" c="dimmed">{urgencyInfo.label}</Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{formatDuration(rec.estimatedDuration)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Progress 
                              value={rec.businessValue * 10} 
                              color="green" 
                              size="sm" 
                              w={60}
                            />
                            <Text size="sm">{rec.businessValue}/10</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Tooltip label="Schedule Training">
                              <ActionIcon variant="light" color="blue">
                                <IconCalendar size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="View Details">
                              <ActionIcon variant="light" color="gray">
                                <IconBulb size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="analytics" pt="lg">
          <Grid>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Priority Distribution</Title>
                <Stack gap="md">
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">High Priority</Text>
                      <Text size="sm" fw={500}>{analytics.highPriority}</Text>
                    </Group>
                    <Progress 
                      value={analytics.totalRecs > 0 ? (analytics.highPriority / analytics.totalRecs) * 100 : 0} 
                      color="red" 
                      size="lg" 
                    />
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Medium Priority</Text>
                      <Text size="sm" fw={500}>{analytics.mediumPriority}</Text>
                    </Group>
                    <Progress 
                      value={analytics.totalRecs > 0 ? (analytics.mediumPriority / analytics.totalRecs) * 100 : 0} 
                      color="orange" 
                      size="lg" 
                    />
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Low Priority</Text>
                      <Text size="sm" fw={500}>{analytics.lowPriority}</Text>
                    </Group>
                    <Progress 
                      value={analytics.totalRecs > 0 ? (analytics.lowPriority / analytics.totalRecs) * 100 : 0} 
                      color="blue" 
                      size="lg" 
                    />
                  </div>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Training Type Breakdown</Title>
                <Stack gap="sm">
                  {Object.entries(analytics.typeBreakdown).map(([type, count]) => (
                    <Group key={type} justify="space-between">
                      <Text size="sm" tt="capitalize">
                        {type.replace('_', ' ')}
                      </Text>
                      <Badge variant="light" color="blue">
                        {count}
                      </Badge>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
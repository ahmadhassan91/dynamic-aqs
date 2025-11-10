'use client';

import React, { useState } from 'react';
import { 
  Title, 
  Text, 
  Stack, 
  Tabs, 
  Button, 
  Group, 
  Paper,
  Grid,
  Card,
  ThemeIcon,
  SimpleGrid
} from '@mantine/core';
import { 
  IconUserPlus, 
  IconTimeline, 
  IconChartBar, 
  IconPlus,
  IconDownload,
  IconUsers,
  IconTrendingUp,
  IconTarget,
  IconCalendar,
  IconSettings
} from '@tabler/icons-react';
import { LeadPipeline } from '@/components/leads/LeadPipeline';
import { LeadAnalytics } from '@/components/leads/LeadAnalytics';
import { ClientOnlyWrapper } from '@/components/ui/ClientOnlyWrapper';
import { AppLayout } from '@/components/layout/AppLayout';

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analytics' | 'overview'>('overview');

  const stats = [
    { title: 'Total Leads', value: '247', icon: IconUsers, color: 'blue' },
    { title: 'Conversion Rate', value: '23.5%', icon: IconTrendingUp, color: 'green' },
    { title: 'Active Opportunities', value: '89', icon: IconTarget, color: 'orange' },
    { title: 'This Month', value: '+34', icon: IconCalendar, color: 'violet' },
  ];

  return (
    <AppLayout>
      <div className="residential-content-container">
        <Stack gap="md">
          {/* Header */}
          <Paper shadow="sm" p="md">
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Title order={1}>Lead Management</Title>
                <Text size="sm" c="dimmed">
                  Manage your sales pipeline and track lead progression
                </Text>
              </Stack>
              <Group gap="sm">
                <Button leftSection={<IconPlus size={16} />}>
                  New Lead
                </Button>
                <Button variant="light" leftSection={<IconDownload size={16} />}>
                  Export Report
                </Button>
              </Group>
            </Group>
          </Paper>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as any)}>
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="pipeline" leftSection={<IconTimeline size={16} />}>
              Pipeline
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
              Analytics
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview">
            <Stack gap="lg">
              {/* Stats Cards */}
              <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
                {stats.map((stat, index) => (
                  <Card key={index} withBorder padding="lg">
                    <Group justify="space-between">
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed">{stat.title}</Text>
                        <Text size="xl" fw={700}>{stat.value}</Text>
                      </Stack>
                      <ThemeIcon size="lg" variant="light" color={stat.color}>
                        <stat.icon size={20} />
                      </ThemeIcon>
                    </Group>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Quick Actions */}
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card withBorder padding="lg" h="100%">
                    <Stack gap="md" align="center" justify="center" h="100%">
                      <ThemeIcon size="xl" variant="light" color="blue">
                        <IconTimeline size={32} />
                      </ThemeIcon>
                      <Title order={4}>View Pipeline</Title>
                      <Text size="sm" c="dimmed" ta="center">
                        Manage leads through your sales pipeline
                      </Text>
                      <Button 
                        variant="light" 
                        fullWidth
                        onClick={() => setActiveTab('pipeline')}
                      >
                        Open Pipeline
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card withBorder padding="lg" h="100%">
                    <Stack gap="md" align="center" justify="center" h="100%">
                      <ThemeIcon size="xl" variant="light" color="green">
                        <IconUserPlus size={32} />
                      </ThemeIcon>
                      <Title order={4}>Lead Onboarding</Title>
                      <Text size="sm" c="dimmed" ta="center">
                        Manage customer onboarding workflows
                      </Text>
                      <Button 
                        variant="light" 
                        fullWidth
                        component="a"
                        href="/leads/onboarding"
                      >
                        Manage Onboarding
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card withBorder padding="lg" h="100%">
                    <Stack gap="md" align="center" justify="center" h="100%">
                      <ThemeIcon size="xl" variant="light" color="orange">
                        <IconCalendar size={32} />
                      </ThemeIcon>
                      <Title order={4}>Discovery Calls</Title>
                      <Text size="sm" c="dimmed" ta="center">
                        Schedule and manage discovery calls
                      </Text>
                      <Button 
                        variant="light" 
                        fullWidth
                        component="a"
                        href="/leads/discovery"
                      >
                        Manage Calls
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>

              {/* Additional Quick Actions */}
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card withBorder padding="lg" h="100%">
                    <Stack gap="md" align="center" justify="center" h="100%">
                      <ThemeIcon size="xl" variant="light" color="violet">
                        <IconUserPlus size={32} />
                      </ThemeIcon>
                      <Title order={4}>Lead Conversion</Title>
                      <Text size="sm" c="dimmed" ta="center">
                        Convert qualified leads to customers
                      </Text>
                      <Button 
                        variant="light" 
                        fullWidth
                        component="a"
                        href="/leads/convert"
                      >
                        Convert Leads
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card withBorder padding="lg" h="100%">
                    <Stack gap="md" align="center" justify="center" h="100%">
                      <ThemeIcon size="xl" variant="light" color="teal">
                        <IconChartBar size={32} />
                      </ThemeIcon>
                      <Title order={4}>Conversion Analytics</Title>
                      <Text size="sm" c="dimmed" ta="center">
                        Track conversion performance and trends
                      </Text>
                      <Button 
                        variant="light" 
                        fullWidth
                        component="a"
                        href="/leads/analytics"
                      >
                        View Analytics
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card withBorder padding="lg" h="100%">
                    <Stack gap="md" align="center" justify="center" h="100%">
                      <ThemeIcon size="xl" variant="light" color="indigo">
                        <IconSettings size={32} />
                      </ThemeIcon>
                      <Title order={4}>Workflow Management</Title>
                      <Text size="sm" c="dimmed" ta="center">
                        Manage onboarding workflow templates
                      </Text>
                      <Button 
                        variant="light" 
                        fullWidth
                        component="a"
                        href="/leads/onboarding/workflow"
                      >
                        Manage Workflows
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="pipeline">
            <ClientOnlyWrapper>
              <LeadPipeline />
            </ClientOnlyWrapper>
          </Tabs.Panel>

          <Tabs.Panel value="analytics">
            <ClientOnlyWrapper>
              <LeadAnalytics />
            </ClientOnlyWrapper>
          </Tabs.Panel>
        </Tabs>
        </Stack>
      </div>
    </AppLayout>
  );
}
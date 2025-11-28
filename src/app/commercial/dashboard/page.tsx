'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Title, Text, Grid, Card, Group, Stack, Button, ThemeIcon, SimpleGrid } from '@mantine/core';
import { 
  IconBriefcase, 
  IconUsers, 
  IconBuilding, 
  IconChartBar,
  IconTrendingUp,
  IconTarget,
  IconCurrencyDollar,
  IconCalendar
} from '@tabler/icons-react';
import { CommercialLayout } from '@/components/layout/CommercialLayout';

export default function CommercialDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('commercialAuth');
    if (!auth) {
      router.push('/commercial/login');
    }
  }, [router]);

  const stats = [
    { title: 'Active Opportunities', value: '47', icon: IconBriefcase, color: 'blue' },
    { title: 'Manufacturer Reps', value: '28', icon: IconUsers, color: 'green', subtitle: 'Avg Rating: 3.4 ★' },
    { title: 'Leads from Reps', value: '17', icon: IconTarget, color: 'teal', subtitle: 'This month' },
    { title: 'Missed Leads', value: '3', icon: IconTrendingUp, color: 'red', subtitle: '⚠️ Trade show in rep territory' },
  ];

  const quickActions = [
    { title: 'New Opportunity', description: 'Create a new commercial opportunity', icon: IconBriefcase, link: '/commercial/opportunities/new' },
    { title: 'Rep Performance', description: 'View and update rep ratings (1-5)', icon: IconUsers, link: '/commercial/reports/reps' },
    { title: 'Generate Quote', description: 'Use pricing tool for quotes', icon: IconCurrencyDollar, link: '/commercial/pricing' },
    { title: 'View Reports', description: 'Access commercial reports', icon: IconChartBar, link: '/commercial/reports' },
  ];

  return (
    <CommercialLayout>
      <Stack gap="md" p="md">
        {/* Header */}
        <div>
          <Title order={2}>Commercial Dashboard</Title>
          <Text size="sm" c="dimmed">
            Welcome to your commercial CRM dashboard
          </Text>
        </div>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {stats.map((stat) => (
            <Card 
              key={stat.title} 
              withBorder 
              padding="md" 
              radius="md"
              style={{ borderColor: stat.color === 'red' ? 'var(--mantine-color-red-5)' : undefined }}
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                    {stat.title}
                  </Text>
                  <Text size="xl" fw={700} c={stat.color === 'red' ? 'red' : undefined}>
                    {stat.value}
                  </Text>
                  {stat.subtitle && (
                    <Text size="xs" c={stat.color === 'red' ? 'red' : 'dimmed'}>
                      {stat.subtitle}
                    </Text>
                  )}
                </Stack>
                <ThemeIcon size="lg" radius="md" color={stat.color} variant="light">
                  <stat.icon size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        {/* Quick Actions */}
        <div>
          <Title order={4} mb="sm">Quick Actions</Title>
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
            {quickActions.map((action) => (
              <Card key={action.title} withBorder padding="md" radius="md">
                <Stack gap="xs" align="center" ta="center">
                  <ThemeIcon size={40} radius="md" variant="light" color="blue">
                    <action.icon size={20} />
                  </ThemeIcon>
                  <Text fw={600} size="sm">{action.title}</Text>
                  <Text size="xs" c="dimmed" lineClamp={2}>{action.description}</Text>
                  <Button variant="light" size="xs" fullWidth color="blue">
                    Go
                  </Button>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </div>

        {/* Recent Activity */}
        <Card withBorder padding="md" radius="md">
          <Title order={4} mb="sm">Recent Activity</Title>
          <Stack gap="xs">
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm">🟢 <strong>John Smith (TX)</strong> brought lead: "University Medical Center" - $850K</Text>
              <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>2h ago</Text>
            </Group>
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm">⭐ Rep rating updated: <strong>Maria Garcia</strong> → 4 (Strong)</Text>
              <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>4h ago</Text>
            </Group>
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm" c="red">⚠️ Missed lead: Trade show lead in <strong>IL territory</strong></Text>
              <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>1d ago</Text>
            </Group>
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm">📝 Quote: Downtown Office Complex - $125K</Text>
              <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>1d ago</Text>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </CommercialLayout>
  );
}

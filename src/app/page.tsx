'use client';

import Link from 'next/link';
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Stack,
  Button,
  ThemeIcon,
  SimpleGrid,
  Paper,
  Center,
  Anchor,
} from '@mantine/core';
import {
  IconFiles,
  IconBuildingStore,
  IconUsers,
  IconUserPlus,
  IconMail,
  IconChartBar,
  IconShield,
  IconDeviceMobile,
  IconArrowRight,
  IconPackage,
} from '@tabler/icons-react';

export default function HomePage() {
  const features = [
    {
      title: 'Territory Management',
      description: 'Territory assignments, customer management, training coordination, and TM performance tracking',
      icon: IconUsers,
      color: 'violet',
      links: [
        { label: 'Territory Overview', href: '/customers/territories' },
        { label: 'Customer List', href: '/customers' },
        { label: 'Customer Activities', href: '/customers/activities' },
        { label: 'Training Dashboard', href: '/training' }
      ]
    },
    {
      title: 'Lead Pipeline',
      description: 'New dealer leads, onboarding workflow, discovery calls, and lead conversion tracking',
      icon: IconUserPlus,
      color: 'teal',
      links: [
        { label: 'Lead Pipeline', href: '/leads' },
        { label: 'Onboarding', href: '/leads/onboarding' },
        { label: 'Discovery Calls', href: '/leads/discovery' },
        { label: 'AI Insights', href: '/leads/ai-insights' }
      ]
    },
    {
      title: 'Reports & Analytics',
      description: 'Executive dashboards, sales reports, and custom analytics',
      icon: IconChartBar,
      color: 'red',
      links: [
        { label: 'Executive Dashboard', href: '/reports/executive' },
        { label: 'Sales Reports', href: '/reports' },
        { label: 'Custom Report Builder', href: '/reports/custom' }
      ]
    },
    {
      title: 'Consignment Tracking',
      description: 'Consignment inventory locations, audit scheduling, and reconciliation tracking',
      icon: IconPackage,
      color: 'orange',
      links: [
        { label: 'Consignment Dashboard', href: '/consignment' },
        { label: 'Audit Schedule', href: '/consignment?tab=audits' },
        { label: 'Alerts & Actions', href: '/consignment?tab=alerts' }
      ]
    },
    {
      title: 'Communication Hub',
      description: 'Email campaigns, communication templates, and messaging workflows',
      icon: IconMail,
      color: 'indigo',
      links: [
        { label: 'Email Campaigns', href: '/email' },
        { label: 'Communication Hub', href: '/communication' },
        { label: 'Templates', href: '/communication/templates' }
      ]
    },
    {
      title: 'Dealer Portal',
      description: 'Product catalog, order management, and dealer resources',
      icon: IconBuildingStore,
      color: 'green',
      links: [
        { label: 'Product Catalog', href: '/dealer/catalog' },
        { label: 'Order Management', href: '/dealer/orders' },
        { label: 'Dealer Dashboard', href: '/dealer/dashboard' }
      ]
    },
    {
      title: 'Administration',
      description: 'User management, system health monitoring, and integrations',
      icon: IconShield,
      color: 'gray',
      links: [
        { label: 'Admin Dashboard', href: '/admin' },
        { label: 'User Management', href: '/admin/users' },
        { label: 'System Health', href: '/admin/health' },
        { label: 'Integrations', href: '/admin/integrations' }
      ]
    },
    {
      title: 'Digital Asset Management',
      description: 'Complete asset library with workflow management, version control, and analytics',
      icon: IconFiles,
      color: 'blue',
      links: [
        { label: 'Asset Library', href: '/assets' },
        { label: 'Asset Analytics', href: '/assets/analytics' },
        { label: 'Asset Workflow', href: '/assets/workflow' }
      ]
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      overflowY: 'auto',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <Container size="xl">
        {/* Header */}
        <Paper shadow="sm" p="xl" mb="xl">
          <Center>
            <Stack align="center" gap="md">
              <Title order={1} size="h1">Dynamic AQS CRM</Title>
              <Text size="lg" c="dimmed">
                Comprehensive Customer Relationship Management System
              </Text>
            </Stack>
          </Center>
        </Paper>

      {/* Features Grid */}
      <Grid gutter="lg" mb="xl">
        {features.map((feature, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group mb="md">
                <ThemeIcon size="lg" variant="light" color={feature.color}>
                  <feature.icon size={24} />
                </ThemeIcon>
                <Title order={3} size="h4">
                  {feature.title}
                </Title>
              </Group>
              
              <Text size="sm" c="dimmed" mb="md">
                {feature.description}
              </Text>
              
              <Stack gap="xs">
                {feature.links.map((link, linkIndex) => (
                  <Anchor
                    key={linkIndex}
                    component={Link}
                    href={link.href}
                    size="sm"
                    c={feature.color}
                  >
                    <Group gap="xs">
                      <IconArrowRight size={14} />
                      <Text>{link.label}</Text>
                    </Group>
                  </Anchor>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Quick Stats */}
      <Paper shadow="sm" p="xl" mb="xl">
        <Title order={2} ta="center" mb="xl">
          System Overview
        </Title>
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="lg">
          <Center>
            <Stack align="center" gap="xs">
              <Text size="xl" fw={700} c="blue">15+</Text>
              <Text size="sm" c="dimmed">Core Modules</Text>
            </Stack>
          </Center>
          <Center>
            <Stack align="center" gap="xs">
              <Text size="xl" fw={700} c="green">50+</Text>
              <Text size="sm" c="dimmed">Components</Text>
            </Stack>
          </Center>
          <Center>
            <Stack align="center" gap="xs">
              <Text size="xl" fw={700} c="violet">100%</Text>
              <Text size="sm" c="dimmed">TypeScript</Text>
            </Stack>
          </Center>
          <Center>
            <Stack align="center" gap="xs">
              <Text size="xl" fw={700} c="orange">Mobile</Text>
              <Text size="sm" c="dimmed">Ready</Text>
            </Stack>
          </Center>
        </SimpleGrid>
      </Paper>

      {/* Mobile App Link */}
      <Center mb="xl">
        <Button
          component={Link}
          href="/mobile"
          size="lg"
          leftSection={<IconDeviceMobile size={20} />}
        >
          Access Mobile App
        </Button>
      </Center>
      </Container>
    </div>
  );
}
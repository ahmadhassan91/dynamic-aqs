'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Stack, Card, Group, Badge, Button, SimpleGrid, ThemeIcon, Grid, Avatar, Progress, ActionIcon } from '@mantine/core';
import { IconUsers, IconStar, IconTrendingUp, IconBuilding, IconPhone, IconMail, IconPlus, IconEdit } from '@tabler/icons-react';
import { CommercialLayout } from '@/components/layout/CommercialLayout';

// Mock data for engineer contacts
const mockEngineers = [
  {
    id: '1',
    name: 'John Smith',
    title: 'Senior Mechanical Engineer',
    company: 'MEP Engineering Solutions',
    email: 'john.smith@mepeng.com',
    phone: '(555) 123-4567',
    rating: 5,
    totalOpportunities: 12,
    wonOpportunities: 8,
    totalValue: 2400000,
    lastContact: '2024-01-15',
    nextFollowUp: '2024-02-01',
    marketSegments: ['Healthcare', 'Education']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'Project Manager',
    company: 'Urban Design Engineers',
    email: 'sarah.j@urbandesign.com',
    phone: '(555) 234-5678',
    rating: 4,
    totalOpportunities: 8,
    wonOpportunities: 5,
    totalValue: 1800000,
    lastContact: '2024-01-12',
    nextFollowUp: '2024-01-25',
    marketSegments: ['Commercial Office', 'Retail']
  },
  {
    id: '3',
    name: 'Mike Chen',
    title: 'Principal Engineer',
    company: 'Industrial Systems Inc',
    email: 'mchen@industrialsys.com',
    phone: '(555) 345-6789',
    rating: 3,
    totalOpportunities: 6,
    wonOpportunities: 2,
    totalValue: 950000,
    lastContact: '2024-01-08',
    nextFollowUp: '2024-01-30',
    marketSegments: ['Industrial', 'Manufacturing']
  },
  {
    id: '4',
    name: 'Lisa Rodriguez',
    title: 'Lead Engineer',
    company: 'Educational Facilities Engineering',
    email: 'lrodriguez@edfacilities.com',
    phone: '(555) 456-7890',
    rating: 5,
    totalOpportunities: 15,
    wonOpportunities: 12,
    totalValue: 3200000,
    lastContact: '2024-01-18',
    nextFollowUp: '2024-02-05',
    marketSegments: ['Education', 'Government']
  },
  {
    id: '5',
    name: 'David Park',
    title: 'Mechanical Engineer',
    company: 'Healthcare Engineering Group',
    email: 'dpark@healtheng.com',
    phone: '(555) 567-8901',
    rating: 2,
    totalOpportunities: 4,
    wonOpportunities: 1,
    totalValue: 420000,
    lastContact: '2024-01-05',
    nextFollowUp: '2024-01-28',
    marketSegments: ['Healthcare']
  }
];

export default function CommercialEngineersPage() {
  const router = useRouter();
  const [engineers, setEngineers] = useState(mockEngineers);

  const stats = [
    { title: 'Total Contacts', value: engineers.length.toString(), icon: IconUsers, color: 'blue' },
    { title: 'High Rated (4-5)', value: engineers.filter(eng => eng.rating >= 4).length.toString(), icon: IconStar, color: 'yellow' },
    { title: 'Avg Win Rate', value: `${Math.round(engineers.reduce((sum, eng) => sum + (eng.wonOpportunities / eng.totalOpportunities * 100), 0) / engineers.length)}%`, icon: IconTrendingUp, color: 'green' },
    { title: 'Total Pipeline', value: `$${(engineers.reduce((sum, eng) => sum + eng.totalValue, 0) / 1000000).toFixed(1)}M`, icon: IconBuilding, color: 'red' },
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'yellow';
    return 'red';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconStar
        key={i}
        size={14}
        fill={i < rating ? 'currentColor' : 'none'}
        color={i < rating ? '#ffd43b' : '#ced4da'}
      />
    ));
  };

  return (
    <CommercialLayout>
      <div className="residential-content-container">
        <Stack gap="xl" className="commercial-stack-large">
          {/* Header */}
          <Group justify="space-between" className="commercial-section-header">
            <div>
              <Title order={1}>Engineer Contacts</Title>
              <Text size="lg" c="dimmed">
                Manage relationships with engineering contacts
              </Text>
            </div>
            <Button leftSection={<IconPlus size={16} />} size="md" color="blue">
              Add Engineer
            </Button>
          </Group>

          {/* Stats */}
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="lg">
            {stats.map((stat) => (
              <div key={stat.title} className="commercial-stat-card">
                <Group justify="space-between" align="flex-start">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text className="commercial-stat-label">
                      {stat.title}
                    </Text>
                    <Text className="commercial-stat-value">
                      {stat.value}
                    </Text>
                  </Stack>
                  <ThemeIcon size="xl" radius="md" variant="light" color={stat.color}>
                    <stat.icon size={24} />
                  </ThemeIcon>
                </Group>
              </div>
            ))}
          </SimpleGrid>

          {/* Engineers Grid */}
          <div className="commercial-section">
            <Title order={2} mb="lg">Engineer Database</Title>
            <Grid>
              {engineers.map((engineer) => (
                <Grid.Col key={engineer.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <Card withBorder padding="lg" radius="md" h="100%" className="commercial-card">
                    <Stack gap="md">
                      {/* Header */}
                      <Group justify="space-between">
                        <Group gap="sm">
                          <Avatar size="md" radius="xl" color="blue">
                            {engineer.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <div>
                            <Text fw={600} size="sm">
                              {engineer.name}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {engineer.title}
                            </Text>
                          </div>
                        </Group>
                        <ActionIcon variant="subtle" size="sm">
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Group>

                      {/* Company */}
                      <Group gap="xs">
                        <IconBuilding size={14} />
                        <Text size="sm" fw={500}>{engineer.company}</Text>
                      </Group>

                      {/* Rating */}
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>Rating:</Text>
                        <Group gap="xs">
                          {getRatingStars(engineer.rating)}
                          <Badge variant="filled" color={getRatingColor(engineer.rating)} size="sm" className={`badge-engineer-rating-${engineer.rating}`}>
                            {engineer.rating}/5
                          </Badge>
                        </Group>
                      </Group>

                      {/* Performance */}
                      <div>
                        <Group justify="space-between" mb="xs">
                          <Text size="sm">Win Rate</Text>
                          <Text size="sm" fw={500}>
                            {Math.round((engineer.wonOpportunities / engineer.totalOpportunities) * 100)}%
                          </Text>
                        </Group>
                        <Progress 
                          value={(engineer.wonOpportunities / engineer.totalOpportunities) * 100} 
                          size="sm" 
                          color="green" 
                        />
                      </div>

                      {/* Stats */}
                      <SimpleGrid cols={2} spacing="xs">
                        <div>
                          <Text size="xs" c="dimmed">Opportunities</Text>
                          <Text size="sm" fw={600}>{engineer.totalOpportunities}</Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">Total Value</Text>
                          <Text size="sm" fw={600}>${(engineer.totalValue / 1000).toFixed(0)}K</Text>
                        </div>
                      </SimpleGrid>

                      {/* Market Segments */}
                      <Group gap="xs">
                        {engineer.marketSegments.map((segment) => (
                          <Badge key={segment} variant="light" size="xs">
                            {segment}
                          </Badge>
                        ))}
                      </Group>

                      {/* Contact Info */}
                      <Stack gap="xs">
                        <Group gap="xs">
                          <IconMail size={14} />
                          <Text size="xs" c="dimmed">{engineer.email}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconPhone size={14} />
                          <Text size="xs" c="dimmed">{engineer.phone}</Text>
                        </Group>
                      </Stack>

                      {/* Last Contact */}
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">
                          Last: {new Date(engineer.lastContact).toLocaleDateString()}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Next: {new Date(engineer.nextFollowUp).toLocaleDateString()}
                        </Text>
                      </Group>

                      <Button 
                        variant="light" 
                        size="xs" 
                        fullWidth
                        onClick={() => router.push(`/commercial/engineers/${engineer.id}`)}
                      >
                        View Details
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </div>
        </Stack>
      </div>
    </CommercialLayout>
  );
}
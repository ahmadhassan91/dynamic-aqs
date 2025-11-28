'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CommercialLayout } from '@/components/layout/CommercialLayout';
import { OrganizationType } from '@/types/commercial';
import {
  Stack,
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  ThemeIcon,
  Button,
  Paper,
  UnstyledButton,
  Alert,
  Modal,
  TextInput,
  Select,
  NumberInput
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconHierarchy,
  IconChartBar,
  IconDatabaseImport,
  IconBuildingSkyscraper,
  IconBuildingFactory,
  IconBuildingCommunity,
  IconTools,
  IconRefresh,
  IconPlus,
  IconInfoCircle,
  IconDeviceFloppy
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function OrganizationsPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const handleAddOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      close();
      // In a real app, we would show a success notification here
      alert('Organization added successfully!');
    }, 1000);
  };

  const organizationFeatures = [
    {
      title: 'Organization Hierarchy',
      description: 'Interactive organization chart with drag-and-drop restructuring and hierarchy validation',
      href: '/commercial/organizations/hierarchy',
      icon: IconHierarchy,
      color: 'blue'
    },
    {
      title: 'Consolidated Reports',
      description: 'Parent organization rollup displays with consolidated contact and opportunity views',
      href: '/commercial/organizations/reports',
      icon: IconChartBar,
      color: 'green'
    },
    {
      title: 'Bulk Management',
      description: 'Import, update, and validate organization data in bulk with performance analytics',
      href: '/commercial/organizations/bulk',
      icon: IconDatabaseImport,
      color: 'violet'
    }
  ];

  const organizationTypes = [
    {
      type: OrganizationType.ENGINEERING_FIRM,
      icon: IconBuildingSkyscraper,
      description: 'Engineering consulting firms and design companies',
      color: 'indigo'
    },
    {
      type: OrganizationType.MANUFACTURER_REP,
      icon: IconBuildingFactory,
      description: 'Manufacturer representative organizations',
      color: 'orange'
    },
    {
      type: OrganizationType.BUILDING_OWNER,
      icon: IconBuildingCommunity,
      description: 'Building owners and property management companies',
      color: 'cyan'
    },
    {
      type: OrganizationType.ARCHITECT,
      icon: IconTools,
      description: 'Architectural firms and design studios',
      color: 'grape'
    },
    {
      type: OrganizationType.MECHANICAL_CONTRACTOR,
      icon: IconTools,
      description: 'Mechanical contractors and installation companies',
      color: 'teal'
    },
    {
      type: OrganizationType.FACILITIES_MANAGER,
      icon: IconBuildingFactory,
      description: 'Facilities management and maintenance organizations',
      color: 'yellow'
    }
  ];

  return (
    <CommercialLayout>
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={2}>Organization Management</Title>
          <Text c="dimmed">
            Manage organization hierarchies, relationships, and performance analytics
          </Text>
        </Stack>

        {/* Main Features */}
        <Stack gap="md">
          <Title order={3} size="h4">Management Tools</Title>
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
            {organizationFeatures.map((feature) => (
              <Card
                key={feature.href}
                component={Link}
                href={feature.href}
                padding="lg"
                radius="md"
                withBorder
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <Stack align="center" gap="md">
                  <ThemeIcon size={60} radius="md" variant="light" color={feature.color}>
                    <feature.icon size={32} />
                  </ThemeIcon>
                  <Stack align="center" gap="xs">
                    <Text fw={600} size="lg">{feature.title}</Text>
                    <Text size="sm" c="dimmed" ta="center">
                      {feature.description}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>

        {/* Organization Types Overview */}
        <Stack gap="md">
          <Title order={3} size="h4">Organization Types</Title>
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
            {organizationTypes.map((orgType) => (
              <Paper
                key={orgType.type}
                p="md"
                withBorder
                radius="md"
                style={{ transition: 'all 0.2s ease' }}
              >
                <Group align="flex-start" wrap="nowrap">
                  <ThemeIcon size="xl" variant="light" color={orgType.color}>
                    <orgType.icon size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>{orgType.type}</Text>
                    <Text size="sm" c="dimmed" lh={1.4}>
                      {orgType.description}
                    </Text>
                  </div>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>

        {/* Quick Actions */}
        <Paper p="xl" radius="md" bg="var(--mantine-color-gray-0)">
          <Stack gap="md">
            <Title order={3} size="h4">Quick Actions</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
              <UnstyledButton
                component={Link}
                href="/commercial/organizations/hierarchy"
                p="md"
                bg="white"
                style={{
                  border: '1px solid var(--mantine-color-gray-3)',
                  borderRadius: 'var(--mantine-radius-md)',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Stack align="center" gap="xs">
                  <ThemeIcon size="lg" variant="light" color="blue">
                    <IconRefresh size={20} />
                  </ThemeIcon>
                  <Text size="sm" fw={500}>Restructure Hierarchy</Text>
                </Stack>
              </UnstyledButton>

              <UnstyledButton
                component={Link}
                href="/commercial/organizations/reports"
                p="md"
                bg="white"
                style={{
                  border: '1px solid var(--mantine-color-gray-3)',
                  borderRadius: 'var(--mantine-radius-md)',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Stack align="center" gap="xs">
                  <ThemeIcon size="lg" variant="light" color="green">
                    <IconChartBar size={20} />
                  </ThemeIcon>
                  <Text size="sm" fw={500}>View Analytics</Text>
                </Stack>
              </UnstyledButton>

              <UnstyledButton
                component={Link}
                href="/commercial/organizations/bulk"
                p="md"
                bg="white"
                style={{
                  border: '1px solid var(--mantine-color-gray-3)',
                  borderRadius: 'var(--mantine-radius-md)',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Stack align="center" gap="xs">
                  <ThemeIcon size="lg" variant="light" color="violet">
                    <IconDatabaseImport size={20} />
                  </ThemeIcon>
                  <Text size="sm" fw={500}>Import Data</Text>
                </Stack>
              </UnstyledButton>

              <UnstyledButton
                onClick={open}
                p="md"
                bg="white"
                style={{
                  border: '1px solid var(--mantine-color-gray-3)',
                  borderRadius: 'var(--mantine-radius-md)',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Stack align="center" gap="xs">
                  <ThemeIcon size="lg" variant="light" color="gray">
                    <IconPlus size={20} />
                  </ThemeIcon>
                  <Text size="sm" fw={500}>Add Organization</Text>
                </Stack>
              </UnstyledButton>
            </SimpleGrid>
          </Stack>
        </Paper>

        {/* Help Section */}
        <Alert icon={<IconInfoCircle size={16} />} title="Getting Started" color="blue" variant="light">
          <Stack gap="xs">
            <Text size="sm">
              <Text span fw={700}>Organization Hierarchy:</Text> Use the interactive chart to visualize and manage parent-child relationships between organizations. Drag and drop to restructure, with automatic validation to prevent circular references.
            </Text>
            <Text size="sm">
              <Text span fw={700}>Consolidated Reports:</Text> View rollup data for parent organizations, including all contacts, opportunities, and performance metrics from child organizations.
            </Text>
            <Text size="sm">
              <Text span fw={700}>Bulk Management:</Text> Import large datasets, perform bulk updates, and generate comprehensive performance analytics across all organizations.
            </Text>
          </Stack>
        </Alert>

        {/* Add Organization Modal */}
        <Modal 
          opened={opened} 
          onClose={close} 
          title="Add New Organization"
          size="md"
        >
          <form onSubmit={handleAddOrganization}>
            <Stack gap="md">
              <TextInput
                label="Organization Name"
                placeholder="Enter organization name"
                required
                data-autofocus
              />
              
              <Select
                label="Organization Type"
                placeholder="Select type"
                required
                data={Object.values(OrganizationType).map(type => ({ value: type, label: type }))}
              />
              
              <TextInput
                label="Website"
                placeholder="https://example.com"
              />

              <SimpleGrid cols={2}>
                <TextInput
                  label="Phone"
                  placeholder="+1 (555) 000-0000"
                />
                <TextInput
                  label="Email"
                  placeholder="contact@example.com"
                  type="email"
                />
              </SimpleGrid>

              <TextInput
                label="Address"
                placeholder="Street Address"
              />

              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={close}>Cancel</Button>
                <Button type="submit" loading={loading} leftSection={<IconDeviceFloppy size={16} />}>
                  Create Organization
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </CommercialLayout>
  );
}

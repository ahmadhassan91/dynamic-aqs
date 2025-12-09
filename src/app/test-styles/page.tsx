'use client';

import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Paper, 
  Button, 
  SimpleGrid, 
  Card, 
  Group,
  Table,
  Badge,
  Select,
  TextInput,
  Tabs
} from '@mantine/core';
import { IconUsers, IconSettings, IconDatabase, IconSearch } from '@tabler/icons-react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function TestStylesPage() {
  return (
    <AppLayout>
      <Container size="xl" py="md">
        <Stack gap="md">
          {/* Header */}
          <Paper shadow="sm" p="md">
            <Stack gap="xs">
              <Title order={1}>Style Test Page</Title>
              <Text c="dimmed">Testing Mantine components and styling</Text>
            </Stack>
          </Paper>

          {/* Test Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="xl" fw={700} c="blue">24</Text>
                  <Text size="sm" c="dimmed">Active Users</Text>
                </Stack>
                <IconUsers size={24} color="var(--mantine-color-blue-6)" />
              </Group>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="xl" fw={700} c="green">5</Text>
                  <Text size="sm" c="dimmed">Integrations</Text>
                </Stack>
                <IconSettings size={24} color="var(--mantine-color-green-6)" />
              </Group>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="xl" fw={700} c="yellow">3</Text>
                  <Text size="sm" c="dimmed">Data Issues</Text>
                </Stack>
                <IconDatabase size={24} color="var(--mantine-color-yellow-6)" />
              </Group>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Stack gap="xs">
                  <Text size="xl" fw={700} c="violet">2h ago</Text>
                  <Text size="sm" c="dimmed">Last Backup</Text>
                </Stack>
                <IconDatabase size={24} color="var(--mantine-color-violet-6)" />
              </Group>
            </Card>
          </SimpleGrid>

          {/* Test Buttons */}
          <Paper shadow="sm" p="md">
            <Title order={3} mb="md">Test Buttons</Title>
            <Group gap="sm">
              <Button>Primary Button</Button>
              <Button variant="light">Light Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button color="green">Green Button</Button>
              <Button color="red">Red Button</Button>
            </Group>
          </Paper>

          {/* Test Form Elements */}
          <Paper shadow="sm" p="md">
            <Title order={3} mb="md">Test Form Elements</Title>
            <Group grow>
              <TextInput
                label="Search"
                placeholder="Search users..."
                leftSection={<IconSearch size={16} />}
              />
              <Select
                label="Status"
                placeholder="Select status"
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'pending', label: 'Pending' }
                ]}
              />
            </Group>
          </Paper>

          {/* Test Table */}
          <Paper shadow="sm" p="md">
            <Title order={3} mb="md">Test Table</Title>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Role</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>
                    <Text fw={500}>John Doe</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text c="dimmed">john.doe@example.com</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="green" variant="light">Active</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text c="dimmed">Territory Manager</Text>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>
                    <Text fw={500}>Jane Smith</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text c="dimmed">jane.smith@example.com</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="yellow" variant="light">Pending</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text c="dimmed">Regional Director</Text>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Paper>

          {/* Test Tabs */}
          <Paper shadow="sm" p="md">
            <Title order={3} mb="md">Test Tabs</Title>
            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="users">Users</Tabs.Tab>
                <Tabs.Tab value="settings">Settings</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="md">
                <Text>Overview content goes here</Text>
              </Tabs.Panel>

              <Tabs.Panel value="users" pt="md">
                <Text>Users content goes here</Text>
              </Tabs.Panel>

              <Tabs.Panel value="settings" pt="md">
                <Text>Settings content goes here</Text>
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </Stack>
      </Container>
    </AppLayout>
  );
}
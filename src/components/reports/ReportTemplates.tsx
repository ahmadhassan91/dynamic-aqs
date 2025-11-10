'use client';

import { useState } from 'react';
import {
  Modal,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Card,
  Badge,
  SimpleGrid,
  ScrollArea,
  ActionIcon,
  Divider,
  Center
} from '@mantine/core';
import { IconX, IconTemplate } from '@tabler/icons-react';

interface ReportTemplatesProps {
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
}

export function ReportTemplates({ onClose, onSelectTemplate }: ReportTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState('sales');

  const templates = {
    sales: [
      {
        id: 'sales-by-territory',
        name: 'Sales by Territory',
        description: 'Revenue and order metrics grouped by territory and manager',
        fields: ['customer.companyName', 'territory.name', 'territory.manager', 'customer.totalRevenue', 'customer.totalOrders'],
        groupBy: ['territory.name'],
        filters: [{ field: 'customer.status', operator: 'equals', value: 'active' }],
        aggregations: [
          { field: 'customer.totalRevenue', function: 'sum', alias: 'Total Revenue' },
          { field: 'customer.totalOrders', function: 'sum', alias: 'Total Orders' }
        ],
        format: 'table',
        sortBy: 'customer.totalRevenue',
        sortOrder: 'desc'
      },
      {
        id: 'monthly-sales-trend',
        name: 'Monthly Sales Trend',
        description: 'Sales performance trends over the last 12 months',
        fields: ['order.orderDate', 'order.totalAmount', 'territory.name'],
        groupBy: ['order.orderDate'],
        filters: [],
        aggregations: [
          { field: 'order.totalAmount', function: 'sum', alias: 'Monthly Revenue' }
        ],
        format: 'chart',
        chartType: 'line',
        sortBy: 'order.orderDate',
        sortOrder: 'asc'
      },
      {
        id: 'top-customers',
        name: 'Top Customers by Revenue',
        description: 'Highest revenue generating customers across all territories',
        fields: ['customer.companyName', 'customer.contactName', 'customer.totalRevenue', 'customer.totalOrders', 'territory.name'],
        groupBy: [],
        filters: [{ field: 'customer.status', operator: 'equals', value: 'active' }],
        aggregations: [],
        format: 'table',
        sortBy: 'customer.totalRevenue',
        sortOrder: 'desc'
      }
    ],
    training: [
      {
        id: 'training-completion-rates',
        name: 'Training Completion Rates',
        description: 'Training completion statistics by type and territory',
        fields: ['training.type', 'training.status', 'territory.name', 'customer.companyName'],
        groupBy: ['training.type', 'territory.name'],
        filters: [],
        aggregations: [
          { field: 'training.status', function: 'count', alias: 'Total Sessions' }
        ],
        format: 'chart',
        chartType: 'bar',
        sortBy: 'training.type',
        sortOrder: 'asc'
      },
      {
        id: 'overdue-training',
        name: 'Overdue Training Sessions',
        description: 'Customers with overdue or missing training requirements',
        fields: ['customer.companyName', 'training.type', 'training.scheduledDate', 'territory.manager'],
        groupBy: [],
        filters: [
          { field: 'training.status', operator: 'equals', value: 'scheduled' },
          { field: 'training.scheduledDate', operator: 'less_than', value: new Date().toISOString().split('T')[0] }
        ],
        aggregations: [],
        format: 'table',
        sortBy: 'training.scheduledDate',
        sortOrder: 'asc'
      },
      {
        id: 'training-effectiveness',
        name: 'Training Effectiveness Report',
        description: 'Training ratings and feedback analysis',
        fields: ['training.type', 'training.rating', 'training.completedDate', 'customer.companyName'],
        groupBy: ['training.type'],
        filters: [{ field: 'training.status', operator: 'equals', value: 'completed' }],
        aggregations: [
          { field: 'training.rating', function: 'avg', alias: 'Average Rating' },
          { field: 'training.rating', function: 'count', alias: 'Total Completed' }
        ],
        format: 'summary',
        sortBy: 'training.rating',
        sortOrder: 'desc'
      }
    ],
    customers: [
      {
        id: 'customer-acquisition',
        name: 'Customer Acquisition Report',
        description: 'New customer acquisition trends and sources',
        fields: ['customer.companyName', 'customer.createdAt', 'lead.source', 'territory.name'],
        groupBy: ['lead.source', 'territory.name'],
        filters: [],
        aggregations: [
          { field: 'customer.companyName', function: 'count', alias: 'New Customers' }
        ],
        format: 'chart',
        chartType: 'pie',
        sortBy: 'customer.createdAt',
        sortOrder: 'desc'
      },
      {
        id: 'customer-activity-summary',
        name: 'Customer Activity Summary',
        description: 'Recent customer interactions and engagement levels',
        fields: ['customer.companyName', 'customer.lastContactDate', 'customer.status', 'territory.manager'],
        groupBy: ['customer.status'],
        filters: [],
        aggregations: [],
        format: 'table',
        sortBy: 'customer.lastContactDate',
        sortOrder: 'desc'
      },
      {
        id: 'inactive-customers',
        name: 'Inactive Customers Report',
        description: 'Customers with no recent activity or orders',
        fields: ['customer.companyName', 'customer.lastContactDate', 'customer.totalRevenue', 'territory.manager'],
        groupBy: [],
        filters: [
          { field: 'customer.status', operator: 'equals', value: 'inactive' }
        ],
        aggregations: [],
        format: 'table',
        sortBy: 'customer.lastContactDate',
        sortOrder: 'asc'
      }
    ],
    performance: [
      {
        id: 'manager-performance',
        name: 'Manager Performance Dashboard',
        description: 'Comprehensive performance metrics for territory and regional managers',
        fields: ['territory.manager', 'region.name', 'customer.totalRevenue', 'customer.totalOrders', 'training.status'],
        groupBy: ['territory.manager', 'region.name'],
        filters: [],
        aggregations: [
          { field: 'customer.totalRevenue', function: 'sum', alias: 'Total Revenue' },
          { field: 'customer.totalOrders', function: 'sum', alias: 'Total Orders' },
          { field: 'training.status', function: 'count', alias: 'Training Sessions' }
        ],
        format: 'summary',
        sortBy: 'customer.totalRevenue',
        sortOrder: 'desc'
      },
      {
        id: 'regional-comparison',
        name: 'Regional Performance Comparison',
        description: 'Side-by-side comparison of regional performance metrics',
        fields: ['region.name', 'customer.totalRevenue', 'customer.totalOrders', 'lead.status'],
        groupBy: ['region.name'],
        filters: [],
        aggregations: [
          { field: 'customer.totalRevenue', function: 'sum', alias: 'Revenue' },
          { field: 'customer.totalOrders', function: 'sum', alias: 'Orders' },
          { field: 'lead.status', function: 'count', alias: 'Leads' }
        ],
        format: 'chart',
        chartType: 'bar',
        sortBy: 'customer.totalRevenue',
        sortOrder: 'desc'
      }
    ]
  };

  const categories = [
    { id: 'sales', name: 'Sales Reports', icon: '💰', description: 'Revenue and sales performance' },
    { id: 'training', name: 'Training Reports', icon: '🎓', description: 'Training completion and effectiveness' },
    { id: 'customers', name: 'Customer Reports', icon: '👥', description: 'Customer activity and acquisition' },
    { id: 'performance', name: 'Performance Reports', icon: '📊', description: 'Manager and regional performance' }
  ];

  const handleSelectTemplate = (template: any) => {
    const fullTemplate = {
      name: template.name,
      description: template.description,
      fields: template.fields,
      groupBy: template.groupBy,
      sortBy: template.sortBy,
      sortOrder: template.sortOrder,
      filters: template.filters,
      aggregations: template.aggregations,
      format: template.format,
      chartType: template.chartType
    };
    
    onSelectTemplate(fullTemplate);
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      size="xl"
      title={
        <Group gap="sm">
          <IconTemplate size={20} />
          <Title order={3}>Report Templates</Title>
        </Group>
      }
      styles={{
        body: { height: 'calc(90vh - 60px)', padding: 0 }
      }}
    >
      <Group align="stretch" gap={0} style={{ height: '100%' }}>
        {/* Category Sidebar */}
        <Card
          shadow="none"
          radius={0}
          style={{ 
            width: 280, 
            borderRight: '1px solid var(--mantine-color-gray-3)',
            height: '100%'
          }}
          p="md"
        >
          <Title order={5} mb="md">Categories</Title>
          <Stack gap="xs">
            {categories.map(category => (
              <Card
                key={category.id}
                padding="sm"
                radius="md"
                style={{ cursor: 'pointer' }}
                bg={selectedCategory === category.id ? 'blue.0' : undefined}
                withBorder={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Group gap="sm">
                  <Text size="lg">{category.icon}</Text>
                  <Stack gap={2}>
                    <Text fw={500} size="sm">{category.name}</Text>
                    <Text size="xs" c="dimmed">{category.description}</Text>
                  </Stack>
                </Group>
              </Card>
            ))}
          </Stack>
        </Card>

        {/* Templates Grid */}
        <ScrollArea style={{ flex: 1 }} p="md">
          <Stack gap="md">
            <Stack gap="xs">
              <Title order={4}>
                {categories.find(c => c.id === selectedCategory)?.name}
              </Title>
              <Text c="dimmed">
                {categories.find(c => c.id === selectedCategory)?.description}
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
              {templates[selectedCategory as keyof typeof templates]?.map(template => (
                <Card
                  key={template.id}
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                  style={{ cursor: 'pointer', height: 'fit-content' }}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                      <Title order={5}>{template.name}</Title>
                      <Badge
                        color={
                          template.format === 'table' ? 'blue' :
                          template.format === 'chart' ? 'green' :
                          'violet'
                        }
                        variant="light"
                        size="sm"
                      >
                        {template.format}
                      </Badge>
                    </Group>
                    
                    <Text size="sm" c="dimmed">{template.description}</Text>
                    
                    <Stack gap="xs">
                      <Group gap="md">
                        <Text size="xs" c="dimmed">
                          <Text component="span" fw={500}>Fields:</Text> {template.fields.length}
                        </Text>
                        <Text size="xs" c="dimmed">
                          <Text component="span" fw={500}>Grouping:</Text> {template.groupBy.length || 'None'}
                        </Text>
                      </Group>
                      <Group gap="md">
                        <Text size="xs" c="dimmed">
                          <Text component="span" fw={500}>Filters:</Text> {template.filters.length || 'None'}
                        </Text>
                        {template.aggregations.length > 0 && (
                          <Text size="xs" c="dimmed">
                            <Text component="span" fw={500}>Aggregations:</Text> {template.aggregations.length}
                          </Text>
                        )}
                      </Group>
                    </Stack>
                    
                    <Divider />
                    
                    <Button fullWidth size="sm">
                      Use This Template
                    </Button>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>

            {templates[selectedCategory as keyof typeof templates]?.length === 0 && (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <IconTemplate size={48} color="var(--mantine-color-gray-4)" />
                  <Title order={4}>No Templates Available</Title>
                  <Text c="dimmed" ta="center">Templates for this category are coming soon.</Text>
                </Stack>
              </Center>
            )}
          </Stack>
        </ScrollArea>
      </Group>

      {/* Footer */}
      <Divider />
      <Group justify="space-between" p="md" bg="gray.0">
        <Text size="sm" c="dimmed">
          Select a template to get started quickly, or close this dialog to build a custom report from scratch.
        </Text>
        <Button variant="light" onClick={onClose}>
          Close
        </Button>
      </Group>
    </Modal>
  );
}
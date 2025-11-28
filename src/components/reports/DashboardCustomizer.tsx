'use client';

import { useState } from 'react';
import { Paper, Text, Group, Stack, Button, Grid, Title, ThemeIcon, ActionIcon, Badge, Alert } from '@mantine/core';
import { IconDeviceFloppy, IconRotateClockwise, IconX, IconGripVertical, IconMinus, IconPlus, IconInfoCircle } from '@tabler/icons-react';

interface DashboardCustomizerProps {
  widgets: string[];
  onWidgetReorder: (widgets: string[]) => void;
  onClose: () => void;
}

interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export function DashboardCustomizer({ widgets, onWidgetReorder, onClose }: DashboardCustomizerProps) {
  const [availableWidgets, setAvailableWidgets] = useState<WidgetConfig[]>([
    {
      id: 'revenue',
      name: 'Revenue Metrics',
      description: 'Total revenue and growth trends',
      icon: '💰',
      enabled: widgets.includes('revenue')
    },
    {
      id: 'customers',
      name: 'Customer Metrics',
      description: 'Active customers and acquisition rates',
      icon: '👥',
      enabled: widgets.includes('customers')
    },
    {
      id: 'leads',
      name: 'Lead Conversion',
      description: 'Lead pipeline and conversion rates',
      icon: '🎯',
      enabled: widgets.includes('leads')
    },
    {
      id: 'training',
      name: 'Training Completion',
      description: 'Training sessions and completion rates',
      icon: '🎓',
      enabled: widgets.includes('training')
    },
    {
      id: 'orders',
      name: 'Order Fulfillment',
      description: 'Order processing and delivery metrics',
      icon: '📦',
      enabled: widgets.includes('orders')
    },
    {
      id: 'performance',
      name: 'Performance Metrics',
      description: 'Overall business performance indicators',
      icon: '📊',
      enabled: widgets.includes('performance')
    },
    {
      id: 'territories',
      name: 'Territory Performance',
      description: 'Performance by territory and region',
      icon: '🗺️',
      enabled: widgets.includes('territories')
    },
    {
      id: 'dealers',
      name: 'Dealer Analytics',
      description: 'Dealer engagement and ordering patterns',
      icon: '🏪',
      enabled: widgets.includes('dealers')
    }
  ]);

  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const handleWidgetToggle = (widgetId: string) => {
    const updatedWidgets = availableWidgets.map(widget =>
      widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
    );
    setAvailableWidgets(updatedWidgets);

    const enabledWidgets = updatedWidgets
      .filter(widget => widget.enabled)
      .map(widget => widget.id);
    
    onWidgetReorder(enabledWidgets);
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault();
    
    if (!draggedWidget || draggedWidget === targetWidgetId) return;

    const enabledWidgets = availableWidgets.filter(w => w.enabled).map(w => w.id);
    const draggedIndex = enabledWidgets.indexOf(draggedWidget);
    const targetIndex = enabledWidgets.indexOf(targetWidgetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...enabledWidgets];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedWidget);

    onWidgetReorder(newOrder);
    setDraggedWidget(null);
  };

  const handleSaveLayout = () => {
    const layout = {
      widgets: availableWidgets.filter(w => w.enabled).map(w => w.id),
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('dashboard-layout', JSON.stringify(layout));
    alert('Dashboard layout saved successfully!');
  };

  const handleResetLayout = () => {
    const defaultWidgets = ['revenue', 'customers', 'leads', 'training', 'orders', 'performance'];
    const resetWidgets = availableWidgets.map(widget => ({
      ...widget,
      enabled: defaultWidgets.includes(widget.id)
    }));
    
    setAvailableWidgets(resetWidgets);
    onWidgetReorder(defaultWidgets);
  };

  const enabledWidgets = availableWidgets.filter(w => w.enabled);
  const disabledWidgets = availableWidgets.filter(w => !w.enabled);

  return (
    <Paper p="md" radius="md" withBorder mb="lg">
      <Group justify="space-between" mb="md">
        <Title order={3}>Customize Dashboard</Title>
        <Group>
          <Button
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={handleSaveLayout}
            color="green"
            variant="light"
          >
            Save Layout
          </Button>
          <Button
            leftSection={<IconRotateClockwise size={16} />}
            onClick={handleResetLayout}
            color="gray"
            variant="light"
          >
            Reset
          </Button>
          <ActionIcon onClick={onClose} variant="subtle" color="gray">
            <IconX size={20} />
          </ActionIcon>
        </Group>
      </Group>

      <Grid>
        {/* Enabled Widgets */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text fw={500} mb="sm">Active Widgets</Text>
          <Stack gap="xs" style={{ minHeight: 200, border: '2px dashed var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-md)', padding: 'var(--mantine-spacing-sm)' }}>
            {enabledWidgets.map((widget, index) => (
              <Paper
                key={widget.id}
                draggable
                onDragStart={(e) => handleDragStart(e, widget.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, widget.id)}
                p="sm"
                withBorder
                style={{ 
                  cursor: 'move',
                  backgroundColor: 'var(--mantine-color-blue-0)',
                  borderColor: 'var(--mantine-color-blue-2)'
                }}
              >
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="light" size="lg" color="blue">{widget.icon}</ThemeIcon>
                    <div>
                      <Text fw={500}>{widget.name}</Text>
                      <Text size="xs" c="dimmed">{widget.description}</Text>
                    </div>
                  </Group>
                  <Group gap="xs">
                    <Badge size="sm" variant="light" color="gray">#{index + 1}</Badge>
                    <ActionIcon 
                      color="red" 
                      variant="subtle"
                      onClick={() => handleWidgetToggle(widget.id)}
                    >
                      <IconMinus size={16} />
                    </ActionIcon>
                    <IconGripVertical size={16} style={{ color: 'var(--mantine-color-gray-5)' }} />
                  </Group>
                </Group>
              </Paper>
            ))}
            {enabledWidgets.length === 0 && (
              <Text c="dimmed" ta="center" py="xl">
                No widgets selected. Add widgets from the available list.
              </Text>
            )}
          </Stack>
        </Grid.Col>

        {/* Available Widgets */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text fw={500} mb="sm">Available Widgets</Text>
          <Stack gap="xs" style={{ minHeight: 200 }}>
            {disabledWidgets.map((widget) => (
              <Paper
                key={widget.id}
                p="sm"
                withBorder
                style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}
              >
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="light" size="lg" color="gray">{widget.icon}</ThemeIcon>
                    <div>
                      <Text fw={500}>{widget.name}</Text>
                      <Text size="xs" c="dimmed">{widget.description}</Text>
                    </div>
                  </Group>
                  <ActionIcon 
                    color="green" 
                    variant="subtle"
                    onClick={() => handleWidgetToggle(widget.id)}
                  >
                    <IconPlus size={16} />
                  </ActionIcon>
                </Group>
              </Paper>
            ))}
            {disabledWidgets.length === 0 && (
              <Text c="dimmed" ta="center" py="xl">
                All available widgets are currently active.
              </Text>
            )}
          </Stack>
        </Grid.Col>
      </Grid>

      <Alert icon={<IconInfoCircle size={16} />} title="Customization Instructions" color="blue" mt="lg" variant="light">
        <Stack gap={4}>
          <Text size="sm">• Drag and drop widgets in the Active Widgets section to reorder them</Text>
          <Text size="sm">• Click the + button to add widgets from the Available Widgets section</Text>
          <Text size="sm">• Click the minus button to remove widgets from your dashboard</Text>
          <Text size="sm">• Use Save Layout to persist your changes</Text>
        </Stack>
      </Alert>
    </Paper>
  );
}

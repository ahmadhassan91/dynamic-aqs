'use client';

import { useState } from 'react';
import {
  Stack,
  Card,
  Title,
  Text,
  Switch,
  NumberInput,
  Select,
  TextInput,
  Button,
  Group,
  Divider,
  Alert,
  Badge,
  Grid,
  ActionIcon,
  Table,
  Modal,
  Textarea
} from '@mantine/core';
import {
  IconSettings,
  IconDatabase,
  IconRefresh,
  IconCheck,
  IconX,
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconInfoCircle
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

interface PricingRule {
  id: string;
  name: string;
  type: 'volume' | 'customer' | 'product' | 'seasonal';
  condition: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  active: boolean;
  description: string;
}

const mockPricingRules: PricingRule[] = [
  {
    id: '1',
    name: 'Volume Discount - 5+ Units',
    type: 'volume',
    condition: 'quantity >= 5',
    discountType: 'percentage',
    discountValue: 10,
    active: true,
    description: 'Apply 10% discount for orders of 5 or more units'
  },
  {
    id: '2',
    name: 'Preferred Customer Discount',
    type: 'customer',
    condition: 'customer_tier = "preferred"',
    discountType: 'percentage',
    discountValue: 15,
    active: true,
    description: 'Special pricing for preferred customers'
  },
  {
    id: '3',
    name: 'PMAC Promotional Pricing',
    type: 'product',
    condition: 'product_model = "PMAC"',
    discountType: 'fixed',
    discountValue: 200,
    active: false,
    description: 'Temporary promotional pricing for PMAC units'
  }
];

export function PricingSettings() {
  const [integrationSettings, setIntegrationSettings] = useState({
    autoSync: true,
    syncInterval: 15,
    connectionTimeout: 30,
    retryAttempts: 3,
    enableRealTimePricing: true,
    cacheExpiry: 60
  });

  const [pricingRules, setPricingRules] = useState<PricingRule[]>(mockPricingRules);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected');
  const [lastSync, setLastSync] = useState(new Date());
  
  const [opened, { open, close }] = useDisclosure(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);

  const testConnection = async () => {
    setConnectionStatus('testing');
    // Simulate connection test
    setTimeout(() => {
      setConnectionStatus('connected');
      setLastSync(new Date());
    }, 2000);
  };

  const syncPricing = async () => {
    console.log('Syncing pricing data...');
    setLastSync(new Date());
  };

  const toggleRule = (ruleId: string) => {
    setPricingRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  const editRule = (rule: PricingRule) => {
    setEditingRule(rule);
    open();
  };

  const deleteRule = (ruleId: string) => {
    setPricingRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const addNewRule = () => {
    setEditingRule(null);
    open();
  };

  return (
    <Stack gap="lg">
      {/* Integration Settings */}
      <Card withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <IconDatabase size={20} />
            <Title order={4}>Database Integration</Title>
          </Group>
          <Badge 
            color={connectionStatus === 'connected' ? 'green' : connectionStatus === 'testing' ? 'yellow' : 'red'}
            variant="light"
          >
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'testing' ? 'Testing...' : 'Disconnected'}
          </Badge>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              <Switch
                label="Auto-sync pricing data"
                description="Automatically sync pricing from external database"
                checked={integrationSettings.autoSync}
                onChange={(event) =>
                  setIntegrationSettings(prev => ({
                    ...prev,
                    autoSync: event.currentTarget.checked
                  }))
                }
              />

              <NumberInput
                label="Sync Interval (minutes)"
                description="How often to sync pricing data"
                value={integrationSettings.syncInterval}
                onChange={(value) =>
                  setIntegrationSettings(prev => ({
                    ...prev,
                    syncInterval: Number(value) || 15
                  }))
                }
                min={5}
                max={1440}
              />

              <NumberInput
                label="Connection Timeout (seconds)"
                description="Database connection timeout"
                value={integrationSettings.connectionTimeout}
                onChange={(value) =>
                  setIntegrationSettings(prev => ({
                    ...prev,
                    connectionTimeout: Number(value) || 30
                  }))
                }
                min={10}
                max={300}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              <Switch
                label="Real-time pricing updates"
                description="Enable real-time pricing updates during quote generation"
                checked={integrationSettings.enableRealTimePricing}
                onChange={(event) =>
                  setIntegrationSettings(prev => ({
                    ...prev,
                    enableRealTimePricing: event.currentTarget.checked
                  }))
                }
              />

              <NumberInput
                label="Cache Expiry (minutes)"
                description="How long to cache pricing data"
                value={integrationSettings.cacheExpiry}
                onChange={(value) =>
                  setIntegrationSettings(prev => ({
                    ...prev,
                    cacheExpiry: Number(value) || 60
                  }))
                }
                min={5}
                max={1440}
              />

              <NumberInput
                label="Retry Attempts"
                description="Number of retry attempts for failed connections"
                value={integrationSettings.retryAttempts}
                onChange={(value) =>
                  setIntegrationSettings(prev => ({
                    ...prev,
                    retryAttempts: Number(value) || 3
                  }))
                }
                min={1}
                max={10}
              />
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="md" />

        <Group gap="md">
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={testConnection}
            loading={connectionStatus === 'testing'}
          >
            Test Connection
          </Button>
          <Button variant="outline" onClick={syncPricing}>
            Sync Now
          </Button>
          <Text size="sm" c="dimmed">
            Last sync: {lastSync.toLocaleString()}
          </Text>
        </Group>
      </Card>

      {/* Pricing Rules */}
      <Card withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <IconSettings size={20} />
            <Title order={4}>Pricing Rules</Title>
          </Group>
          <Button leftSection={<IconPlus size={16} />} onClick={addNewRule}>
            Add Rule
          </Button>
        </Group>

        <Alert icon={<IconInfoCircle size={16} />} color="blue" mb="md">
          Pricing rules are applied automatically during quote generation. Rules are processed in order of priority.
        </Alert>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Rule Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Discount</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pricingRules.map((rule) => (
              <Table.Tr key={rule.id}>
                <Table.Td>
                  <div>
                    <Text fw={500} size="sm">{rule.name}</Text>
                    <Text size="xs" c="dimmed">{rule.description}</Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  <Badge size="sm" variant="light">
                    {rule.type}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {rule.discountType === 'percentage' 
                      ? `${rule.discountValue}%` 
                      : `$${rule.discountValue}`}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Switch
                    checked={rule.active}
                    onChange={() => toggleRule(rule.id)}
                    size="sm"
                  />
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      size="sm"
                      onClick={() => editRule(rule)}
                    >
                      <IconEdit size={14} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* System Status */}
      <Card withBorder>
        <Title order={4} mb="md">System Status</Title>
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Group gap="xs">
              <IconCheck size={16} color="green" />
              <div>
                <Text size="sm" fw={500}>Database Connection</Text>
                <Text size="xs" c="dimmed">Active and responsive</Text>
              </div>
            </Group>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Group gap="xs">
              <IconCheck size={16} color="green" />
              <div>
                <Text size="sm" fw={500}>Pricing Data</Text>
                <Text size="xs" c="dimmed">Up to date</Text>
              </div>
            </Group>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Group gap="xs">
              <IconAlertCircle size={16} color="orange" />
              <div>
                <Text size="sm" fw={500}>Cache Status</Text>
                <Text size="xs" c="dimmed">75% full</Text>
              </div>
            </Group>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Rule Editor Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Rule Name"
            placeholder="Enter rule name"
            required
          />
          
          <Select
            label="Rule Type"
            placeholder="Select rule type"
            data={[
              { value: 'volume', label: 'Volume Discount' },
              { value: 'customer', label: 'Customer Tier' },
              { value: 'product', label: 'Product Specific' },
              { value: 'seasonal', label: 'Seasonal Promotion' }
            ]}
            required
          />
          
          <TextInput
            label="Condition"
            placeholder="e.g., quantity >= 5"
            description="Define the condition for this rule to apply"
            required
          />
          
          <Group grow>
            <Select
              label="Discount Type"
              data={[
                { value: 'percentage', label: 'Percentage' },
                { value: 'fixed', label: 'Fixed Amount' }
              ]}
              required
            />
            
            <NumberInput
              label="Discount Value"
              placeholder="Enter discount value"
              min={0}
              required
            />
          </Group>
          
          <Textarea
            label="Description"
            placeholder="Describe what this rule does"
            rows={3}
          />
          
          <Switch
            label="Active"
            description="Enable this rule for quote generation"
            defaultChecked
          />
          
          <Group gap="xs" mt="md">
            <Button>Save Rule</Button>
            <Button variant="outline" onClick={close}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Stack,
  Group,
  Text,
  Button,
  Tabs,
  Switch,
  Select,
  TextInput,
  NumberInput,
  Textarea,
  Card,
  Grid,
  Divider,
  Box,
  Alert,
  Modal,
  Badge,
  ActionIcon,
  Tooltip,
  MultiSelect,
  PasswordInput,
  JsonInput,
  Code,
  Accordion,
} from '@mantine/core';
import {
  IconSettings,
  IconDatabase,
  IconMail,
  IconBell,
  IconUsers,
  IconBuilding,
  IconCurrencyDollar,
  IconTrendingUp,
  IconDeviceFloppy,
  IconRefresh,
  IconEdit,
  IconTrash,
  IconPlus,
  IconInfoCircle,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconKey,
  IconServer,
  IconCloud,
  IconShield,
  IconClock,
  IconChartBar,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

interface CommercialSettings {
  id: string;
  general: {
    companyName: string;
    defaultCurrency: string;
    fiscalYearStart: string;
    timeZone: string;
    dateFormat: string;
    numberFormat: string;
  };
  opportunities: {
    defaultProbability: number;
    autoAssignReps: boolean;
    requireApprovalThreshold: number;
    defaultSalesPhases: string[];
    marketSegments: string[];
    pipelineStages: string[];
    quotationValidityDays: number;
  };
  engineers: {
    defaultRating: number;
    ratingScale: number;
    followUpIntervalDays: number;
    autoGenerateTasks: boolean;
    interactionTypes: string[];
    relationshipLevels: string[];
  };
  manufacturerReps: {
    quotaTrackingEnabled: boolean;
    performanceMetrics: string[];
    reportingFrequency: string;
    territoryManagement: boolean;
    commissionTracking: boolean;
  };
  integrations: {
    pricingTool: {
      enabled: boolean;
      connectionString: string;
      syncInterval: number;
      lastSync?: Date;
      status: 'connected' | 'disconnected' | 'error';
    };
    acumatica: {
      enabled: boolean;
      apiUrl: string;
      username: string;
      syncInterval: number;
      lastSync?: Date;
      status: 'connected' | 'disconnected' | 'error';
    };
    email: {
      enabled: boolean;
      smtpServer: string;
      smtpPort: number;
      username: string;
      useSSL: boolean;
      fromAddress: string;
      templates: Record<string, string>;
    };
  };
  notifications: {
    realTimeEnabled: boolean;
    emailDigestFrequency: string;
    escalationRules: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
    highValueThreshold: number;
    urgentResponseTime: number;
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    twoFactorAuth: boolean;
    auditLogging: boolean;
    dataRetentionDays: number;
  };
  reporting: {
    defaultDashboard: string;
    autoRefreshInterval: number;
    exportFormats: string[];
    scheduledReports: boolean;
    dataVisualization: {
      chartTypes: string[];
      colorScheme: string;
      animations: boolean;
    };
  };
}

export function CommercialSettingsManager() {
  const [settings, setSettings] = useState<CommercialSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [connectionResults, setConnectionResults] = useState<Record<string, any>>({});

  const [backupOpened, { open: openBackup, close: closeBackup }] = useDisclosure(false);
  const [importOpened, { open: openImport, close: closeImport }] = useDisclosure(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from an API
      const mockSettings: CommercialSettings = {
        id: 'commercial-settings-1',
        general: {
          companyName: 'Dynamic AQS',
          defaultCurrency: 'USD',
          fiscalYearStart: 'January',
          timeZone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          numberFormat: 'US',
        },
        opportunities: {
          defaultProbability: 25,
          autoAssignReps: true,
          requireApprovalThreshold: 500000,
          defaultSalesPhases: ['Prospect', 'Preliminary Quote', 'Final Quote', 'PO in Hand'],
          marketSegments: ['Healthcare', 'Education', 'Office Buildings', 'Industrial', 'Retail'],
          pipelineStages: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
          quotationValidityDays: 30,
        },
        engineers: {
          defaultRating: 3,
          ratingScale: 5,
          followUpIntervalDays: 14,
          autoGenerateTasks: true,
          interactionTypes: ['Phone Call', 'Email', 'Meeting', 'Site Visit', 'Trade Show'],
          relationshipLevels: ['Cold', 'Warm', 'Hot', 'Champion', 'Advocate'],
        },
        manufacturerReps: {
          quotaTrackingEnabled: true,
          performanceMetrics: ['Revenue', 'Opportunities', 'Quotes', 'Win Rate', 'Activity Level'],
          reportingFrequency: 'Monthly',
          territoryManagement: true,
          commissionTracking: false,
        },
        integrations: {
          pricingTool: {
            enabled: true,
            connectionString: 'mysql://pricing-db:3306/pricing',
            syncInterval: 60,
            lastSync: new Date(Date.now() - 1000 * 60 * 30),
            status: 'connected',
          },
          acumatica: {
            enabled: true,
            apiUrl: 'https://api.acumatica.com/v1',
            username: 'api_user',
            syncInterval: 120,
            lastSync: new Date(Date.now() - 1000 * 60 * 45),
            status: 'connected',
          },
          email: {
            enabled: true,
            smtpServer: 'smtp.office365.com',
            smtpPort: 587,
            username: 'notifications@dynamicaqs.com',
            useSSL: true,
            fromAddress: 'notifications@dynamicaqs.com',
            templates: {
              opportunityCreated: 'New opportunity {{opportunityName}} has been created.',
              quoteSubmitted: 'Quote for {{opportunityName}} has been submitted.',
              engineerFollowUp: 'Follow-up with {{engineerName}} is due.',
            },
          },
        },
        notifications: {
          realTimeEnabled: true,
          emailDigestFrequency: 'Daily',
          escalationRules: true,
          quietHoursStart: '22:00',
          quietHoursEnd: '07:00',
          highValueThreshold: 250000,
          urgentResponseTime: 30,
        },
        security: {
          sessionTimeout: 480,
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
          },
          twoFactorAuth: false,
          auditLogging: true,
          dataRetentionDays: 2555, // 7 years
        },
        reporting: {
          defaultDashboard: 'Commercial Overview',
          autoRefreshInterval: 300,
          exportFormats: ['PDF', 'Excel', 'CSV'],
          scheduledReports: true,
          dataVisualization: {
            chartTypes: ['Bar', 'Line', 'Pie', 'Scatter', 'Heatmap'],
            colorScheme: 'Blue',
            animations: true,
          },
        },
      };

      setSettings(mockSettings);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load commercial settings',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      // In a real implementation, this would save to an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notifications.show({
        title: 'Success',
        message: 'Commercial settings saved successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save commercial settings',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (integration: string) => {
    setTestingConnection(integration);
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      setConnectionResults(prev => ({
        ...prev,
        [integration]: {
          success,
          message: success ? 'Connection successful' : 'Connection failed - check credentials',
          timestamp: new Date(),
        }
      }));

      if (settings) {
        setSettings(prev => {
          if (!prev) return null;
          const currentIntegration = prev.integrations[integration as keyof typeof prev.integrations];
          const updatedIntegration: any = {
            ...currentIntegration,
            status: success ? 'connected' : 'error',
          };
          if ('lastSync' in currentIntegration) {
            updatedIntegration.lastSync = success ? new Date() : currentIntegration.lastSync;
          }
          return {
            ...prev,
            integrations: {
              ...prev.integrations,
              [integration]: updatedIntegration,
            }
          };
        });
      }
    } catch (error) {
      setConnectionResults(prev => ({
        ...prev,
        [integration]: {
          success: false,
          message: 'Connection test failed',
          timestamp: new Date(),
        }
      }));
    } finally {
      setTestingConnection(null);
    }
  };

  const resetToDefaults = () => {
    loadSettings();
    notifications.show({
      title: 'Settings Reset',
      message: 'Settings have been reset to defaults',
      color: 'blue',
    });
  };

  if (loading || !settings) {
    return (
      <Container size="xl" py="md">
        <Text>Loading commercial settings...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Title order={2}>Commercial Settings</Title>
          <Group>
            <Button
              variant="light"
              leftSection={<IconRefresh size={16} />}
              onClick={loadSettings}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              variant="light"
              leftSection={<IconDatabase size={16} />}
              onClick={openBackup}
            >
              Backup
            </Button>
            <Button
              variant="light"
              leftSection={<IconCloud size={16} />}
              onClick={openImport}
            >
              Import
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={saveSettings}
              loading={saving}
            >
              Save Settings
            </Button>
          </Group>
        </Group>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'general')}>
          <Tabs.List>
            <Tabs.Tab value="general" leftSection={<IconSettings size={16} />}>
              General
            </Tabs.Tab>
            <Tabs.Tab value="opportunities" leftSection={<IconTrendingUp size={16} />}>
              Opportunities
            </Tabs.Tab>
            <Tabs.Tab value="engineers" leftSection={<IconUsers size={16} />}>
              Engineers
            </Tabs.Tab>
            <Tabs.Tab value="reps" leftSection={<IconBuilding size={16} />}>
              Manufacturer Reps
            </Tabs.Tab>
            <Tabs.Tab value="integrations" leftSection={<IconServer size={16} />}>
              Integrations
            </Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
              Notifications
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
              Security
            </Tabs.Tab>
            <Tabs.Tab value="reporting" leftSection={<IconChartBar size={16} />}>
              Reporting
            </Tabs.Tab>
          </Tabs.List>

          {/* General Settings */}
          <Tabs.Panel value="general">
            <Paper withBorder p="md" mt="md">
              <Title order={4} mb="md">General Configuration</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Company Name"
                    value={settings.general.companyName}
                    onChange={(e) => setSettings(prev => prev ? {
                      ...prev,
                      general: { ...prev.general, companyName: e.currentTarget.value }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Default Currency"
                    data={['USD', 'EUR', 'GBP', 'CAD', 'AUD']}
                    value={settings.general.defaultCurrency}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      general: { ...prev.general, defaultCurrency: value || 'USD' }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Fiscal Year Start"
                    data={[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ]}
                    value={settings.general.fiscalYearStart}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      general: { ...prev.general, fiscalYearStart: value || 'January' }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Time Zone"
                    data={[
                      'America/New_York',
                      'America/Chicago',
                      'America/Denver',
                      'America/Los_Angeles',
                      'Europe/London',
                      'Europe/Paris',
                      'Asia/Tokyo',
                    ]}
                    value={settings.general.timeZone}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      general: { ...prev.general, timeZone: value || 'America/New_York' }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Date Format"
                    data={['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']}
                    value={settings.general.dateFormat}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      general: { ...prev.general, dateFormat: value || 'MM/DD/YYYY' }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Number Format"
                    data={['US', 'EU', 'UK']}
                    value={settings.general.numberFormat}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      general: { ...prev.general, numberFormat: value || 'US' }
                    } : null)}
                  />
                </Grid.Col>
              </Grid>
            </Paper>
          </Tabs.Panel>

          {/* Opportunities Settings */}
          <Tabs.Panel value="opportunities">
            <Paper withBorder p="md" mt="md">
              <Title order={4} mb="md">Opportunity Management</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Default Probability (%)"
                    min={0}
                    max={100}
                    value={settings.opportunities.defaultProbability}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      opportunities: { ...prev.opportunities, defaultProbability: Number(value) }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Approval Threshold ($)"
                    min={0}
                    value={settings.opportunities.requireApprovalThreshold}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      opportunities: { ...prev.opportunities, requireApprovalThreshold: Number(value) }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Quotation Validity (Days)"
                    min={1}
                    max={365}
                    value={settings.opportunities.quotationValidityDays}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      opportunities: { ...prev.opportunities, quotationValidityDays: Number(value) }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Switch
                    label="Auto-assign Manufacturer Reps"
                    checked={settings.opportunities.autoAssignReps}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      opportunities: { ...prev.opportunities, autoAssignReps: event.currentTarget.checked }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <MultiSelect
                    label="Market Segments"
                    data={settings.opportunities.marketSegments}
                    value={settings.opportunities.marketSegments}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      opportunities: { ...prev.opportunities, marketSegments: value }
                    } : null)}
                    searchable
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <MultiSelect
                    label="Sales Phases"
                    data={settings.opportunities.defaultSalesPhases}
                    value={settings.opportunities.defaultSalesPhases}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      opportunities: { ...prev.opportunities, defaultSalesPhases: value }
                    } : null)}
                    searchable
                  />
                </Grid.Col>
              </Grid>
            </Paper>
          </Tabs.Panel>

          {/* Engineers Settings */}
          <Tabs.Panel value="engineers">
            <Paper withBorder p="md" mt="md">
              <Title order={4} mb="md">Engineer Relationship Management</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Default Rating"
                    min={1}
                    max={settings.engineers.ratingScale}
                    value={settings.engineers.defaultRating}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      engineers: { ...prev.engineers, defaultRating: Number(value) }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Rating Scale (Max)"
                    min={3}
                    max={10}
                    value={settings.engineers.ratingScale}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      engineers: { ...prev.engineers, ratingScale: Number(value) }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Follow-up Interval (Days)"
                    min={1}
                    max={365}
                    value={settings.engineers.followUpIntervalDays}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      engineers: { ...prev.engineers, followUpIntervalDays: Number(value) }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Switch
                    label="Auto-generate Follow-up Tasks"
                    checked={settings.engineers.autoGenerateTasks}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      engineers: { ...prev.engineers, autoGenerateTasks: event.currentTarget.checked }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <MultiSelect
                    label="Interaction Types"
                    data={settings.engineers.interactionTypes}
                    value={settings.engineers.interactionTypes}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      engineers: { ...prev.engineers, interactionTypes: value }
                    } : null)}
                    searchable
                  />
                </Grid.Col>
              </Grid>
            </Paper>
          </Tabs.Panel>

          {/* Manufacturer Reps Settings */}
          <Tabs.Panel value="reps">
            <Paper withBorder p="md" mt="md">
              <Title order={4} mb="md">Manufacturer Representative Management</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Switch
                    label="Enable Quota Tracking"
                    checked={settings.manufacturerReps.quotaTrackingEnabled}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      manufacturerReps: { ...prev.manufacturerReps, quotaTrackingEnabled: event.currentTarget.checked }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Switch
                    label="Enable Territory Management"
                    checked={settings.manufacturerReps.territoryManagement}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      manufacturerReps: { ...prev.manufacturerReps, territoryManagement: event.currentTarget.checked }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Switch
                    label="Enable Commission Tracking"
                    checked={settings.manufacturerReps.commissionTracking}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      manufacturerReps: { ...prev.manufacturerReps, commissionTracking: event.currentTarget.checked }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Reporting Frequency"
                    data={['Weekly', 'Monthly', 'Quarterly', 'Annually']}
                    value={settings.manufacturerReps.reportingFrequency}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      manufacturerReps: { ...prev.manufacturerReps, reportingFrequency: value || 'Monthly' }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <MultiSelect
                    label="Performance Metrics"
                    data={settings.manufacturerReps.performanceMetrics}
                    value={settings.manufacturerReps.performanceMetrics}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      manufacturerReps: { ...prev.manufacturerReps, performanceMetrics: value }
                    } : null)}
                    searchable
                  />
                </Grid.Col>
              </Grid>
            </Paper>
          </Tabs.Panel>

          {/* Integrations Settings */}
          <Tabs.Panel value="integrations">
            <Stack gap="md" mt="md">
              {/* Pricing Tool Integration */}
              <Paper withBorder p="md">
                <Group justify="space-between" mb="md">
                  <Title order={4}>Pricing Tool Integration</Title>
                  <Group>
                    <Badge color={settings.integrations.pricingTool.status === 'connected' ? 'green' : 'red'}>
                      {settings.integrations.pricingTool.status}
                    </Badge>
                    <Switch
                      checked={settings.integrations.pricingTool.enabled}
                      onChange={(event) => setSettings(prev => prev ? {
                        ...prev,
                        integrations: {
                          ...prev.integrations,
                          pricingTool: { ...prev.integrations.pricingTool, enabled: event.currentTarget.checked }
                        }
                      } : null)}
                    />
                  </Group>
                </Group>
                
                {settings.integrations.pricingTool.enabled && (
                  <Grid>
                    <Grid.Col span={12}>
                      <PasswordInput
                        label="Connection String"
                        value={settings.integrations.pricingTool.connectionString}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            pricingTool: { ...prev.integrations.pricingTool, connectionString: e.currentTarget.value }
                          }
                        } : null)}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <NumberInput
                        label="Sync Interval (minutes)"
                        min={5}
                        max={1440}
                        value={settings.integrations.pricingTool.syncInterval}
                        onChange={(value) => setSettings(prev => prev ? {
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            pricingTool: { ...prev.integrations.pricingTool, syncInterval: Number(value) }
                          }
                        } : null)}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Group>
                        <Button
                          size="sm"
                          variant="light"
                          onClick={() => testConnection('pricingTool')}
                          loading={testingConnection === 'pricingTool'}
                        >
                          Test Connection
                        </Button>
                        {connectionResults.pricingTool && (
                          <Alert
                            color={connectionResults.pricingTool.success ? 'green' : 'red'}
                            icon={connectionResults.pricingTool.success ? <IconCheck size={16} /> : <IconX size={16} />}
                          >
                            {connectionResults.pricingTool.message}
                          </Alert>
                        )}
                      </Group>
                    </Grid.Col>
                    {settings.integrations.pricingTool.lastSync && (
                      <Grid.Col span={12}>
                        <Text size="sm" c="dimmed">
                          Last sync: {settings.integrations.pricingTool.lastSync.toLocaleString()}
                        </Text>
                      </Grid.Col>
                    )}
                  </Grid>
                )}
              </Paper>

              {/* Acumatica Integration */}
              <Paper withBorder p="md">
                <Group justify="space-between" mb="md">
                  <Title order={4}>Acumatica ERP Integration</Title>
                  <Group>
                    <Badge color={settings.integrations.acumatica.status === 'connected' ? 'green' : 'red'}>
                      {settings.integrations.acumatica.status}
                    </Badge>
                    <Switch
                      checked={settings.integrations.acumatica.enabled}
                      onChange={(event) => setSettings(prev => prev ? {
                        ...prev,
                        integrations: {
                          ...prev.integrations,
                          acumatica: { ...prev.integrations.acumatica, enabled: event.currentTarget.checked }
                        }
                      } : null)}
                    />
                  </Group>
                </Group>
                
                {settings.integrations.acumatica.enabled && (
                  <Grid>
                    <Grid.Col span={12}>
                      <TextInput
                        label="API URL"
                        value={settings.integrations.acumatica.apiUrl}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            acumatica: { ...prev.integrations.acumatica, apiUrl: e.currentTarget.value }
                          }
                        } : null)}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Username"
                        value={settings.integrations.acumatica.username}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            acumatica: { ...prev.integrations.acumatica, username: e.currentTarget.value }
                          }
                        } : null)}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <NumberInput
                        label="Sync Interval (minutes)"
                        min={5}
                        max={1440}
                        value={settings.integrations.acumatica.syncInterval}
                        onChange={(value) => setSettings(prev => prev ? {
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            acumatica: { ...prev.integrations.acumatica, syncInterval: Number(value) }
                          }
                        } : null)}
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Group>
                        <Button
                          size="sm"
                          variant="light"
                          onClick={() => testConnection('acumatica')}
                          loading={testingConnection === 'acumatica'}
                        >
                          Test Connection
                        </Button>
                        {connectionResults.acumatica && (
                          <Alert
                            color={connectionResults.acumatica.success ? 'green' : 'red'}
                            icon={connectionResults.acumatica.success ? <IconCheck size={16} /> : <IconX size={16} />}
                          >
                            {connectionResults.acumatica.message}
                          </Alert>
                        )}
                      </Group>
                    </Grid.Col>
                  </Grid>
                )}
              </Paper>

              {/* Email Integration */}
              <Paper withBorder p="md">
                <Group justify="space-between" mb="md">
                  <Title order={4}>Email Integration</Title>
                  <Switch
                    checked={settings.integrations.email.enabled}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      integrations: {
                        ...prev.integrations,
                        email: { ...prev.integrations.email, enabled: event.currentTarget.checked }
                      }
                    } : null)}
                  />
                </Group>
                
                {settings.integrations.email.enabled && (
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="SMTP Server"
                        value={settings.integrations.email.smtpServer}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            email: { ...prev.integrations.email, smtpServer: e.currentTarget.value }
                          }
                        } : null)}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <NumberInput
                        label="SMTP Port"
                        min={1}
                        max={65535}
                        value={settings.integrations.email.smtpPort}
                        onChange={(value) => setSettings(prev => prev ? {
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            email: { ...prev.integrations.email, smtpPort: Number(value) }
                          }
                        } : null)}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Username"
                        value={settings.integrations.email.username}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            email: { ...prev.integrations.email, username: e.currentTarget.value }
                          }
                        } : null)}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="From Address"
                        value={settings.integrations.email.fromAddress}
                        onChange={(e) => setSettings(prev => prev ? {
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            email: { ...prev.integrations.email, fromAddress: e.currentTarget.value }
                          }
                        } : null)}
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Switch
                        label="Use SSL/TLS"
                        checked={settings.integrations.email.useSSL}
                        onChange={(event) => setSettings(prev => prev ? {
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            email: { ...prev.integrations.email, useSSL: event.currentTarget.checked }
                          }
                        } : null)}
                      />
                    </Grid.Col>
                  </Grid>
                )}
              </Paper>
            </Stack>
          </Tabs.Panel>

          {/* Notifications Settings */}
          <Tabs.Panel value="notifications">
            <Paper withBorder p="md" mt="md">
              <Title order={4} mb="md">Notification Configuration</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Switch
                    label="Enable Real-time Notifications"
                    checked={settings.notifications.realTimeEnabled}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      notifications: { ...prev.notifications, realTimeEnabled: event.currentTarget.checked }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Switch
                    label="Enable Escalation Rules"
                    checked={settings.notifications.escalationRules}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      notifications: { ...prev.notifications, escalationRules: event.currentTarget.checked }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Email Digest Frequency"
                    data={['Never', 'Hourly', 'Daily', 'Weekly']}
                    value={settings.notifications.emailDigestFrequency}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      notifications: { ...prev.notifications, emailDigestFrequency: value || 'Daily' }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="High-Value Threshold ($)"
                    min={0}
                    value={settings.notifications.highValueThreshold}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      notifications: { ...prev.notifications, highValueThreshold: Number(value) }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Quiet Hours Start"
                    placeholder="22:00"
                    value={settings.notifications.quietHoursStart}
                    onChange={(e) => setSettings(prev => prev ? {
                      ...prev,
                      notifications: { ...prev.notifications, quietHoursStart: e.currentTarget.value }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Quiet Hours End"
                    placeholder="07:00"
                    value={settings.notifications.quietHoursEnd}
                    onChange={(e) => setSettings(prev => prev ? {
                      ...prev,
                      notifications: { ...prev.notifications, quietHoursEnd: e.currentTarget.value }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <NumberInput
                    label="Urgent Response Time (minutes)"
                    min={1}
                    max={1440}
                    value={settings.notifications.urgentResponseTime}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      notifications: { ...prev.notifications, urgentResponseTime: Number(value) }
                    } : null)}
                  />
                </Grid.Col>
              </Grid>
            </Paper>
          </Tabs.Panel>

          {/* Security Settings */}
          <Tabs.Panel value="security">
            <Paper withBorder p="md" mt="md">
              <Title order={4} mb="md">Security Configuration</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Session Timeout (minutes)"
                    min={5}
                    max={1440}
                    value={settings.security.sessionTimeout}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      security: { ...prev.security, sessionTimeout: Number(value) }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Data Retention (days)"
                    min={30}
                    max={3650}
                    value={settings.security.dataRetentionDays}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      security: { ...prev.security, dataRetentionDays: Number(value) }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Switch
                    label="Enable Two-Factor Authentication"
                    checked={settings.security.twoFactorAuth}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      security: { ...prev.security, twoFactorAuth: event.currentTarget.checked }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Switch
                    label="Enable Audit Logging"
                    checked={settings.security.auditLogging}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      security: { ...prev.security, auditLogging: event.currentTarget.checked }
                    } : null)}
                  />
                </Grid.Col>
                
                <Grid.Col span={12}>
                  <Divider label="Password Policy" />
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Minimum Length"
                    min={6}
                    max={32}
                    value={settings.security.passwordPolicy.minLength}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      security: { 
                        ...prev.security, 
                        passwordPolicy: { ...prev.security.passwordPolicy, minLength: Number(value) }
                      }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Stack gap="xs">
                    <Switch
                      label="Require Uppercase"
                      size="sm"
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onChange={(event) => setSettings(prev => prev ? {
                        ...prev,
                        security: { 
                          ...prev.security, 
                          passwordPolicy: { ...prev.security.passwordPolicy, requireUppercase: event.currentTarget.checked }
                        }
                      } : null)}
                    />
                    <Switch
                      label="Require Numbers"
                      size="sm"
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onChange={(event) => setSettings(prev => prev ? {
                        ...prev,
                        security: { 
                          ...prev.security, 
                          passwordPolicy: { ...prev.security.passwordPolicy, requireNumbers: event.currentTarget.checked }
                        }
                      } : null)}
                    />
                    <Switch
                      label="Require Special Characters"
                      size="sm"
                      checked={settings.security.passwordPolicy.requireSpecialChars}
                      onChange={(event) => setSettings(prev => prev ? {
                        ...prev,
                        security: { 
                          ...prev.security, 
                          passwordPolicy: { ...prev.security.passwordPolicy, requireSpecialChars: event.currentTarget.checked }
                        }
                      } : null)}
                    />
                  </Stack>
                </Grid.Col>
              </Grid>
            </Paper>
          </Tabs.Panel>

          {/* Reporting Settings */}
          <Tabs.Panel value="reporting">
            <Paper withBorder p="md" mt="md">
              <Title order={4} mb="md">Reporting Configuration</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Default Dashboard"
                    data={[
                      'Commercial Overview',
                      'Opportunity Pipeline',
                      'Engineer Relationships',
                      'Rep Performance',
                      'Market Analysis'
                    ]}
                    value={settings.reporting.defaultDashboard}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      reporting: { ...prev.reporting, defaultDashboard: value || 'Commercial Overview' }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Auto-refresh Interval (seconds)"
                    min={30}
                    max={3600}
                    value={settings.reporting.autoRefreshInterval}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      reporting: { ...prev.reporting, autoRefreshInterval: Number(value) }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Switch
                    label="Enable Scheduled Reports"
                    checked={settings.reporting.scheduledReports}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      reporting: { ...prev.reporting, scheduledReports: event.currentTarget.checked }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Switch
                    label="Enable Chart Animations"
                    checked={settings.reporting.dataVisualization.animations}
                    onChange={(event) => setSettings(prev => prev ? {
                      ...prev,
                      reporting: { 
                        ...prev.reporting, 
                        dataVisualization: { 
                          ...prev.reporting.dataVisualization, 
                          animations: event.currentTarget.checked 
                        }
                      }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <MultiSelect
                    label="Export Formats"
                    data={['PDF', 'Excel', 'CSV', 'PowerPoint', 'Word']}
                    value={settings.reporting.exportFormats}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      reporting: { ...prev.reporting, exportFormats: value }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <MultiSelect
                    label="Available Chart Types"
                    data={['Bar', 'Line', 'Pie', 'Scatter', 'Heatmap', 'Gauge', 'Funnel', 'Waterfall']}
                    value={settings.reporting.dataVisualization.chartTypes}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      reporting: { 
                        ...prev.reporting, 
                        dataVisualization: { 
                          ...prev.reporting.dataVisualization, 
                          chartTypes: value 
                        }
                      }
                    } : null)}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Select
                    label="Color Scheme"
                    data={['Blue', 'Green', 'Orange', 'Purple', 'Red', 'Teal', 'Gray']}
                    value={settings.reporting.dataVisualization.colorScheme}
                    onChange={(value) => setSettings(prev => prev ? {
                      ...prev,
                      reporting: { 
                        ...prev.reporting, 
                        dataVisualization: { 
                          ...prev.reporting.dataVisualization, 
                          colorScheme: value || 'Blue' 
                        }
                      }
                    } : null)}
                  />
                </Grid.Col>
              </Grid>
            </Paper>
          </Tabs.Panel>
        </Tabs>

        {/* Action Buttons */}
        <Group justify="space-between">
          <Button variant="light" color="red" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Group>
            <Button variant="light" onClick={loadSettings}>
              Cancel Changes
            </Button>
            <Button onClick={saveSettings} loading={saving}>
              Save All Settings
            </Button>
          </Group>
        </Group>
      </Stack>

      {/* Backup Modal */}
      <Modal opened={backupOpened} onClose={closeBackup} title="Backup Settings">
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Export your commercial settings configuration for backup or migration purposes.
          </Text>
          <Button leftSection={<IconDatabase size={16} />}>
            Download Settings Backup
          </Button>
        </Stack>
      </Modal>

      {/* Import Modal */}
      <Modal opened={importOpened} onClose={closeImport} title="Import Settings">
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Import commercial settings from a backup file. This will overwrite current settings.
          </Text>
          <Alert color="orange" icon={<IconAlertTriangle size={16} />}>
            Warning: Importing settings will replace all current configuration. Make sure to backup first.
          </Alert>
          <Button leftSection={<IconCloud size={16} />}>
            Choose Settings File
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}
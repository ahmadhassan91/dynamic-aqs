'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    Grid,
    Text,
    Badge,
    Button,
    Group,
    Stack,
    Alert,
    Progress,
    Table,
    ScrollArea,
    ActionIcon,
    Tooltip,
    Modal,
    Textarea,
    Select,
    NumberInput,
    Switch,
    Tabs,
    Paper,
    Title,
    Divider,
    Code,
    Timeline,
    ThemeIcon
} from '@mantine/core';
import {
    IconDatabase,
    IconAlertTriangle,
    IconCheck,
    IconX,
    IconRefresh,
    IconSettings,
    IconEye,
    IconDownload,
    IconClock,
    IconBug,
    IconActivity,
    IconServer,
    IconWifi,
    IconWifiOff,
    IconCircleCheck,
    IconCircleX,
    IconCircleDot
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

interface IntegrationStatus {
    id: string;
    name: string;
    type: 'database' | 'api' | 'service';
    status: 'connected' | 'disconnected' | 'error' | 'warning';
    lastChecked: Date;
    responseTime: number;
    uptime: number;
    errorCount: number;
    configuration: Record<string, any>;
    healthMetrics: HealthMetric[];
}

interface HealthMetric {
    name: string;
    value: number;
    unit: string;
    status: 'good' | 'warning' | 'critical';
    threshold: number;
}

interface IntegrationError {
    id: string;
    integrationId: string;
    timestamp: Date;
    errorType: 'connection' | 'timeout' | 'authentication' | 'data' | 'unknown';
    message: string;
    details: string;
    resolved: boolean;
    resolvedAt?: Date;
    retryCount: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

interface RetryConfiguration {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
    timeoutSeconds: number;
    enableAutoRetry: boolean;
}

export function PricingIntegrationMonitor() {
    const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
    const [errors, setErrors] = useState<IntegrationError[]>([]);
    const [retryConfig, setRetryConfig] = useState<RetryConfiguration>({
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
        timeoutSeconds: 30,
        enableAutoRetry: true
    });
    const [selectedIntegration, setSelectedIntegration] = useState<IntegrationStatus | null>(null);
    const [selectedError, setSelectedError] = useState<IntegrationError | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
    const [errorOpened, { open: openError, close: closeError }] = useDisclosure(false);
    const [configOpened, { open: openConfig, close: closeConfig }] = useDisclosure(false);

    useEffect(() => {
        loadIntegrationData();
        const interval = setInterval(loadIntegrationData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const loadIntegrationData = async () => {
        try {
            // Mock data - in real implementation, this would fetch from actual monitoring service
            const mockIntegrations: IntegrationStatus[] = [
                {
                    id: 'pricing-mysql',
                    name: 'Pricing Tool MySQL Database',
                    type: 'database',
                    status: 'connected',
                    lastChecked: new Date(),
                    responseTime: 45,
                    uptime: 99.8,
                    errorCount: 2,
                    configuration: {
                        host: 'pricing-db.company.com',
                        port: 3306,
                        database: 'pricing_tool',
                        connectionPool: 10,
                        timeout: 30000
                    },
                    healthMetrics: [
                        { name: 'Response Time', value: 45, unit: 'ms', status: 'good', threshold: 100 },
                        { name: 'Connection Pool', value: 7, unit: 'connections', status: 'good', threshold: 8 },
                        { name: 'Query Rate', value: 125, unit: 'queries/min', status: 'good', threshold: 200 }
                    ]
                },
                {
                    id: 'pricing-api',
                    name: 'Pricing Tool REST API',
                    type: 'api',
                    status: 'warning',
                    lastChecked: new Date(Date.now() - 2 * 60 * 1000),
                    responseTime: 850,
                    uptime: 97.2,
                    errorCount: 8,
                    configuration: {
                        baseUrl: 'https://pricing-api.company.com/v1',
                        apiKey: '***masked***',
                        timeout: 30000,
                        rateLimit: 100
                    },
                    healthMetrics: [
                        { name: 'Response Time', value: 850, unit: 'ms', status: 'warning', threshold: 500 },
                        { name: 'Rate Limit Usage', value: 78, unit: '%', status: 'warning', threshold: 80 },
                        { name: 'Success Rate', value: 97.2, unit: '%', status: 'good', threshold: 95 }
                    ]
                },
                {
                    id: 'quote-sync',
                    name: 'Quote Synchronization Service',
                    type: 'service',
                    status: 'error',
                    lastChecked: new Date(Date.now() - 5 * 60 * 1000),
                    responseTime: 0,
                    uptime: 85.4,
                    errorCount: 15,
                    configuration: {
                        syncInterval: 300000,
                        batchSize: 50,
                        retryAttempts: 3,
                        enableRealTime: true
                    },
                    healthMetrics: [
                        { name: 'Sync Lag', value: 12, unit: 'minutes', status: 'critical', threshold: 5 },
                        { name: 'Queue Size', value: 45, unit: 'items', status: 'warning', threshold: 20 },
                        { name: 'Error Rate', value: 14.6, unit: '%', status: 'critical', threshold: 5 }
                    ]
                }
            ];

            const mockErrors: IntegrationError[] = [
                {
                    id: 'err_001',
                    integrationId: 'quote-sync',
                    timestamp: new Date(Date.now() - 10 * 60 * 1000),
                    errorType: 'connection',
                    message: 'Connection timeout to pricing database',
                    details: 'Failed to establish connection to pricing-db.company.com:3306 after 30 seconds',
                    resolved: false,
                    retryCount: 3,
                    severity: 'high'
                },
                {
                    id: 'err_002',
                    integrationId: 'pricing-api',
                    timestamp: new Date(Date.now() - 25 * 60 * 1000),
                    errorType: 'timeout',
                    message: 'API request timeout',
                    details: 'GET /quotes/search timed out after 30 seconds',
                    resolved: true,
                    resolvedAt: new Date(Date.now() - 20 * 60 * 1000),
                    retryCount: 2,
                    severity: 'medium'
                },
                {
                    id: 'err_003',
                    integrationId: 'pricing-mysql',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    errorType: 'authentication',
                    message: 'Authentication failed',
                    details: 'Access denied for user \'crm_user\'@\'10.0.1.15\' (using password: YES)',
                    resolved: true,
                    resolvedAt: new Date(Date.now() - 90 * 60 * 1000),
                    retryCount: 1,
                    severity: 'critical'
                }
            ];

            setIntegrations(mockIntegrations);
            setErrors(mockErrors);
        } catch (error) {
            console.error('Error loading integration data:', error);
        }
    };

    const testConnection = async (integrationId: string) => {
        setLoading(true);
        try {
            // Mock connection test
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setIntegrations(prev => prev.map(integration => 
                integration.id === integrationId 
                    ? { 
                        ...integration, 
                        status: 'connected' as const,
                        lastChecked: new Date(),
                        responseTime: Math.floor(Math.random() * 100) + 20
                      }
                    : integration
            ));
        } catch (error) {
            console.error('Connection test failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const retryFailedOperation = async (errorId: string) => {
        setLoading(true);
        try {
            // Mock retry operation
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setErrors(prev => prev.map(error => 
                error.id === errorId 
                    ? { 
                        ...error, 
                        resolved: true,
                        resolvedAt: new Date(),
                        retryCount: error.retryCount + 1
                      }
                    : error
            ));
        } catch (error) {
            console.error('Retry failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected':
                return <IconCircleCheck size={20} color="green" />;
            case 'warning':
                return <IconCircleDot size={20} color="orange" />;
            case 'error':
                return <IconCircleX size={20} color="red" />;
            default:
                return <IconCircleDot size={20} color="gray" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected':
                return 'green';
            case 'warning':
                return 'yellow';
            case 'error':
                return 'red';
            default:
                return 'gray';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'red';
            case 'high':
                return 'orange';
            case 'medium':
                return 'yellow';
            case 'low':
                return 'blue';
            default:
                return 'gray';
        }
    };

    const formatUptime = (uptime: number) => {
        return `${uptime.toFixed(1)}%`;
    };

    const formatTimestamp = (date: Date) => {
        return date.toLocaleString();
    };

    const renderOverviewTab = () => (
        <Stack gap="lg">
            {/* Status Cards */}
            <Grid>
                {integrations.map((integration) => (
                    <Grid.Col key={integration.id} span={{ base: 12, md: 4 }}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Group justify="space-between" mb="xs">
                                <Group gap="xs">
                                    {getStatusIcon(integration.status)}
                                    <Text fw={500} size="sm">
                                        {integration.name}
                                    </Text>
                                </Group>
                                <Badge color={getStatusColor(integration.status)} size="sm">
                                    {integration.status.toUpperCase()}
                                </Badge>
                            </Group>

                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Text size="xs" c="dimmed">Response Time:</Text>
                                    <Text size="xs">{integration.responseTime}ms</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="xs" c="dimmed">Uptime:</Text>
                                    <Text size="xs">{formatUptime(integration.uptime)}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="xs" c="dimmed">Errors (24h):</Text>
                                    <Text size="xs" c={integration.errorCount > 0 ? 'red' : 'green'}>
                                        {integration.errorCount}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="xs" c="dimmed">Last Check:</Text>
                                    <Text size="xs">{integration.lastChecked.toLocaleTimeString()}</Text>
                                </Group>
                            </Stack>

                            <Group gap="xs" mt="md">
                                <Button
                                    size="xs"
                                    variant="light"
                                    leftSection={<IconRefresh size={14} />}
                                    onClick={() => testConnection(integration.id)}
                                    loading={loading}
                                >
                                    Test
                                </Button>
                                <Button
                                    size="xs"
                                    variant="outline"
                                    leftSection={<IconEye size={14} />}
                                    onClick={() => {
                                        setSelectedIntegration(integration);
                                        openDetails();
                                    }}
                                >
                                    Details
                                </Button>
                            </Group>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>

            {/* Recent Errors */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                    <Title order={4}>Recent Errors</Title>
                    <Button
                        size="xs"
                        variant="light"
                        leftSection={<IconSettings size={14} />}
                        onClick={openConfig}
                    >
                        Configure
                    </Button>
                </Group>

                <ScrollArea>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Integration</Table.Th>
                                <Table.Th>Error</Table.Th>
                                <Table.Th>Severity</Table.Th>
                                <Table.Th>Time</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {errors.slice(0, 10).map((error) => (
                                <Table.Tr key={error.id}>
                                    <Table.Td>
                                        <Text size="sm">
                                            {integrations.find(i => i.id === error.integrationId)?.name}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm" lineClamp={1}>
                                            {error.message}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color={getSeverityColor(error.severity)} size="sm">
                                            {error.severity.toUpperCase()}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="xs" c="dimmed">
                                            {error.timestamp.toLocaleTimeString()}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        {error.resolved ? (
                                            <Badge color="green" size="sm">RESOLVED</Badge>
                                        ) : (
                                            <Badge color="red" size="sm">ACTIVE</Badge>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <Tooltip label="View Details">
                                                <ActionIcon
                                                    size="sm"
                                                    variant="light"
                                                    onClick={() => {
                                                        setSelectedError(error);
                                                        openError();
                                                    }}
                                                >
                                                    <IconEye size={14} />
                                                </ActionIcon>
                                            </Tooltip>
                                            {!error.resolved && (
                                                <Tooltip label="Retry">
                                                    <ActionIcon
                                                        size="sm"
                                                        variant="light"
                                                        color="blue"
                                                        onClick={() => retryFailedOperation(error.id)}
                                                        loading={loading}
                                                    >
                                                        <IconRefresh size={14} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>

                {errors.length === 0 && (
                    <Text ta="center" c="dimmed" py="xl">
                        No recent errors found
                    </Text>
                )}
            </Card>
        </Stack>
    );

    const renderHealthTab = () => (
        <Stack gap="lg">
            {integrations.map((integration) => (
                <Card key={integration.id} shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <Group gap="xs">
                            {getStatusIcon(integration.status)}
                            <Title order={5}>{integration.name}</Title>
                        </Group>
                        <Badge color={getStatusColor(integration.status)}>
                            {integration.status.toUpperCase()}
                        </Badge>
                    </Group>

                    <Grid>
                        {integration.healthMetrics.map((metric, index) => (
                            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                                <Paper p="md" withBorder>
                                    <Group justify="space-between" mb="xs">
                                        <Text size="sm" fw={500}>{metric.name}</Text>
                                        <ThemeIcon
                                            size="sm"
                                            color={
                                                metric.status === 'good' ? 'green' :
                                                metric.status === 'warning' ? 'yellow' : 'red'
                                            }
                                            variant="light"
                                        >
                                            {metric.status === 'good' ? <IconCheck size={12} /> :
                                             metric.status === 'warning' ? <IconAlertTriangle size={12} /> :
                                             <IconX size={12} />}
                                        </ThemeIcon>
                                    </Group>
                                    <Text size="lg" fw={700}>
                                        {metric.value} {metric.unit}
                                    </Text>
                                    <Progress
                                        value={(metric.value / metric.threshold) * 100}
                                        color={
                                            metric.status === 'good' ? 'green' :
                                            metric.status === 'warning' ? 'yellow' : 'red'
                                        }
                                        size="sm"
                                        mt="xs"
                                    />
                                    <Text size="xs" c="dimmed" mt="xs">
                                        Threshold: {metric.threshold} {metric.unit}
                                    </Text>
                                </Paper>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Card>
            ))}
        </Stack>
    );

    const renderLogsTab = () => (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
                <Title order={4}>Integration Logs</Title>
                <Group gap="xs">
                    <Button size="xs" variant="light" leftSection={<IconDownload size={14} />}>
                        Export
                    </Button>
                    <Button size="xs" variant="light" leftSection={<IconRefresh size={14} />}>
                        Refresh
                    </Button>
                </Group>
            </Group>

            <Timeline active={-1} bulletSize={24} lineWidth={2}>
                {errors.map((error, index) => (
                    <Timeline.Item
                        key={error.id}
                        bullet={
                            error.resolved ? 
                                <IconCircleCheck size={16} /> : 
                                <IconCircleX size={16} />
                        }
                        title={error.message}
                        color={error.resolved ? 'green' : 'red'}
                    >
                        <Text c="dimmed" size="sm">
                            {integrations.find(i => i.id === error.integrationId)?.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {formatTimestamp(error.timestamp)}
                        </Text>
                        {error.resolved && error.resolvedAt && (
                            <Text size="xs" c="green">
                                Resolved at {formatTimestamp(error.resolvedAt)}
                            </Text>
                        )}
                    </Timeline.Item>
                ))}
            </Timeline>
        </Card>
    );

    return (
        <Stack gap="lg">
            <Group justify="space-between">
                <div>
                    <Title order={3}>Pricing Integration Monitor</Title>
                    <Text size="sm" c="dimmed">
                        Monitor and manage pricing tool integrations
                    </Text>
                </div>
                <Group gap="xs">
                    <Button
                        leftSection={<IconRefresh size={16} />}
                        onClick={loadIntegrationData}
                        loading={loading}
                        variant="light"
                    >
                        Refresh All
                    </Button>
                    <Button
                        leftSection={<IconSettings size={16} />}
                        onClick={openConfig}
                        variant="outline"
                    >
                        Settings
                    </Button>
                </Group>
            </Group>

            <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')}>
                <Tabs.List>
                    <Tabs.Tab value="overview" leftSection={<IconActivity size={16} />}>
                        Overview
                    </Tabs.Tab>
                    <Tabs.Tab value="health" leftSection={<IconServer size={16} />}>
                        Health Metrics
                    </Tabs.Tab>
                    <Tabs.Tab value="logs" leftSection={<IconBug size={16} />}>
                        Error Logs
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" pt="md">
                    {renderOverviewTab()}
                </Tabs.Panel>

                <Tabs.Panel value="health" pt="md">
                    {renderHealthTab()}
                </Tabs.Panel>

                <Tabs.Panel value="logs" pt="md">
                    {renderLogsTab()}
                </Tabs.Panel>
            </Tabs>

            {/* Integration Details Modal */}
            <Modal
                opened={detailsOpened}
                onClose={closeDetails}
                title={selectedIntegration?.name}
                size="lg"
            >
                {selectedIntegration && (
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Text fw={500}>Status</Text>
                            <Badge color={getStatusColor(selectedIntegration.status)}>
                                {selectedIntegration.status.toUpperCase()}
                            </Badge>
                        </Group>

                        <Divider />

                        <div>
                            <Text fw={500} mb="xs">Configuration</Text>
                            <Code block>
                                {JSON.stringify(selectedIntegration.configuration, null, 2)}
                            </Code>
                        </div>

                        <div>
                            <Text fw={500} mb="xs">Health Metrics</Text>
                            <Stack gap="xs">
                                {selectedIntegration.healthMetrics.map((metric, index) => (
                                    <Group key={index} justify="space-between">
                                        <Text size="sm">{metric.name}</Text>
                                        <Group gap="xs">
                                            <Text size="sm">
                                                {metric.value} {metric.unit}
                                            </Text>
                                            <ThemeIcon
                                                size="sm"
                                                color={
                                                    metric.status === 'good' ? 'green' :
                                                    metric.status === 'warning' ? 'yellow' : 'red'
                                                }
                                                variant="light"
                                            >
                                                {metric.status === 'good' ? <IconCheck size={12} /> :
                                                 metric.status === 'warning' ? <IconAlertTriangle size={12} /> :
                                                 <IconX size={12} />}
                                            </ThemeIcon>
                                        </Group>
                                    </Group>
                                ))}
                            </Stack>
                        </div>

                        <Group justify="flex-end" mt="md">
                            <Button variant="outline" onClick={closeDetails}>
                                Close
                            </Button>
                            <Button
                                leftSection={<IconRefresh size={16} />}
                                onClick={() => testConnection(selectedIntegration.id)}
                                loading={loading}
                            >
                                Test Connection
                            </Button>
                        </Group>
                    </Stack>
                )}
            </Modal>

            {/* Error Details Modal */}
            <Modal
                opened={errorOpened}
                onClose={closeError}
                title="Error Details"
                size="lg"
            >
                {selectedError && (
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Text fw={500}>Severity</Text>
                            <Badge color={getSeverityColor(selectedError.severity)}>
                                {selectedError.severity.toUpperCase()}
                            </Badge>
                        </Group>

                        <div>
                            <Text fw={500} mb="xs">Error Message</Text>
                            <Text size="sm">{selectedError.message}</Text>
                        </div>

                        <div>
                            <Text fw={500} mb="xs">Details</Text>
                            <Code block>{selectedError.details}</Code>
                        </div>

                        <Group justify="space-between">
                            <Text fw={500}>Timestamp</Text>
                            <Text size="sm">{formatTimestamp(selectedError.timestamp)}</Text>
                        </Group>

                        <Group justify="space-between">
                            <Text fw={500}>Retry Count</Text>
                            <Text size="sm">{selectedError.retryCount}</Text>
                        </Group>

                        {selectedError.resolved && selectedError.resolvedAt && (
                            <Group justify="space-between">
                                <Text fw={500}>Resolved At</Text>
                                <Text size="sm" c="green">
                                    {formatTimestamp(selectedError.resolvedAt)}
                                </Text>
                            </Group>
                        )}

                        <Group justify="flex-end" mt="md">
                            <Button variant="outline" onClick={closeError}>
                                Close
                            </Button>
                            {!selectedError.resolved && (
                                <Button
                                    leftSection={<IconRefresh size={16} />}
                                    onClick={() => retryFailedOperation(selectedError.id)}
                                    loading={loading}
                                >
                                    Retry Operation
                                </Button>
                            )}
                        </Group>
                    </Stack>
                )}
            </Modal>

            {/* Configuration Modal */}
            <Modal
                opened={configOpened}
                onClose={closeConfig}
                title="Retry Configuration"
                size="md"
            >
                <Stack gap="md">
                    <NumberInput
                        label="Max Retries"
                        description="Maximum number of retry attempts"
                        value={retryConfig.maxRetries}
                        onChange={(value) => setRetryConfig(prev => ({ 
                            ...prev, 
                            maxRetries: Number(value) || 0 
                        }))}
                        min={0}
                        max={10}
                    />

                    <NumberInput
                        label="Retry Delay (ms)"
                        description="Initial delay between retries"
                        value={retryConfig.retryDelay}
                        onChange={(value) => setRetryConfig(prev => ({ 
                            ...prev, 
                            retryDelay: Number(value) || 0 
                        }))}
                        min={100}
                        max={10000}
                    />

                    <NumberInput
                        label="Backoff Multiplier"
                        description="Multiplier for exponential backoff"
                        value={retryConfig.backoffMultiplier}
                        onChange={(value) => setRetryConfig(prev => ({ 
                            ...prev, 
                            backoffMultiplier: Number(value) || 1 
                        }))}
                        min={1}
                        max={5}
                        step={0.1}
                        decimalScale={1}
                    />

                    <NumberInput
                        label="Timeout (seconds)"
                        description="Request timeout in seconds"
                        value={retryConfig.timeoutSeconds}
                        onChange={(value) => setRetryConfig(prev => ({ 
                            ...prev, 
                            timeoutSeconds: Number(value) || 0 
                        }))}
                        min={5}
                        max={300}
                    />

                    <Switch
                        label="Enable Auto Retry"
                        description="Automatically retry failed operations"
                        checked={retryConfig.enableAutoRetry}
                        onChange={(event) => setRetryConfig(prev => ({ 
                            ...prev, 
                            enableAutoRetry: event.currentTarget.checked 
                        }))}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="outline" onClick={closeConfig}>
                            Cancel
                        </Button>
                        <Button onClick={closeConfig}>
                            Save Configuration
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Stack>
    );
}
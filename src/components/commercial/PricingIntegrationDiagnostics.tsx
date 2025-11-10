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
    Table,
    ScrollArea,
    ActionIcon,
    Tooltip,
    Modal,
    Select,
    TextInput,
    Textarea,
    Switch,
    Tabs,
    Paper,
    Title,
    Divider,
    Code,
    Timeline,
    ThemeIcon,
    Progress,
    RingProgress,
    Loader,
    Notification
} from '@mantine/core';
import {
    IconBug,
    IconDownload,
    IconRefresh,
    IconSearch,
    IconFilter,
    IconAlertTriangle,
    IconCheck,
    IconX,
    IconClock,
    IconDatabase,
    IconApi,
    IconServer,
    IconChartLine,
    IconSettings,
    IconClipboard,
    IconTrash,
    IconEye,
    IconFileText,
    IconActivity
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { pricingIntegrationService, IntegrationLog, IntegrationError } from '@/lib/services/pricingIntegrationService';

interface DiagnosticResult {
    integrationId: string;
    name: string;
    status: 'healthy' | 'warning' | 'critical';
    checks: DiagnosticCheck[];
    recommendations: string[];
    lastRun: Date;
}

interface DiagnosticCheck {
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
    details?: any;
    duration: number;
}

export function PricingIntegrationDiagnostics() {
    const [logs, setLogs] = useState<IntegrationLog[]>([]);
    const [errors, setErrors] = useState<IntegrationError[]>([]);
    const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('logs');
    
    // Filters
    const [logFilter, setLogFilter] = useState({
        integrationId: '',
        level: '',
        searchTerm: '',
        dateRange: 'today'
    });
    
    const [selectedLog, setSelectedLog] = useState<IntegrationLog | null>(null);
    const [selectedError, setSelectedError] = useState<IntegrationError | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(false);

    const [logOpened, { open: openLog, close: closeLog }] = useDisclosure(false);
    const [errorOpened, { open: openError, close: closeError }] = useDisclosure(false);
    const [exportOpened, { open: openExport, close: closeExport }] = useDisclosure(false);

    useEffect(() => {
        loadData();
        
        let interval: NodeJS.Timeout;
        if (autoRefresh) {
            interval = setInterval(loadData, 10000); // Refresh every 10 seconds
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Load logs
            const allLogs = pricingIntegrationService.getLogs();
            setLogs(allLogs);
            
            // Load errors
            const allErrors = pricingIntegrationService.getErrors();
            setErrors(allErrors);
            
            // Run diagnostics
            await runDiagnostics();
        } catch (error) {
            console.error('Error loading diagnostic data:', error);
        } finally {
            setLoading(false);
        }
    };

    const runDiagnostics = async () => {
        try {
            const diagnosticResults = await pricingIntegrationService.runDiagnostics();
            
            // Convert to diagnostic result format
            const results: DiagnosticResult[] = [];
            
            for (const [integrationId, health] of diagnosticResults.integrations) {
                const checks: DiagnosticCheck[] = [
                    {
                        name: 'Connection Test',
                        status: health.isConnected ? 'pass' : 'fail',
                        message: health.isConnected ? 'Connection successful' : 'Connection failed',
                        duration: health.responseTime
                    },
                    {
                        name: 'Response Time',
                        status: health.responseTime < 500 ? 'pass' : health.responseTime < 1000 ? 'warning' : 'fail',
                        message: `${health.responseTime}ms`,
                        duration: health.responseTime
                    },
                    {
                        name: 'Error Rate',
                        status: health.errorCount < 5 ? 'pass' : health.errorCount < 10 ? 'warning' : 'fail',
                        message: `${health.errorCount} errors in last 24h`,
                        duration: 0
                    }
                ];

                const overallStatus = checks.some(c => c.status === 'fail') ? 'critical' :
                                   checks.some(c => c.status === 'warning') ? 'warning' : 'healthy';

                results.push({
                    integrationId,
                    name: getIntegrationName(integrationId),
                    status: overallStatus,
                    checks,
                    recommendations: diagnosticResults.recommendations.filter(r => r.includes(integrationId)),
                    lastRun: new Date()
                });
            }
            
            setDiagnostics(results);
        } catch (error) {
            console.error('Error running diagnostics:', error);
        }
    };

    const getIntegrationName = (id: string): string => {
        const names: Record<string, string> = {
            'pricing-mysql': 'Pricing Tool MySQL Database',
            'pricing-api': 'Pricing Tool REST API',
            'quote-sync': 'Quote Synchronization Service'
        };
        return names[id] || id;
    };

    const filteredLogs = logs.filter(log => {
        if (logFilter.integrationId && log.integrationId !== logFilter.integrationId) return false;
        if (logFilter.level && log.level !== logFilter.level) return false;
        if (logFilter.searchTerm && !log.message.toLowerCase().includes(logFilter.searchTerm.toLowerCase())) return false;
        
        // Date range filter
        const now = new Date();
        const logDate = new Date(log.timestamp);
        
        switch (logFilter.dateRange) {
            case 'today':
                return logDate.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return logDate >= weekAgo;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return logDate >= monthAgo;
            default:
                return true;
        }
    });

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'error': return 'red';
            case 'warn': return 'yellow';
            case 'info': return 'blue';
            case 'debug': return 'gray';
            default: return 'gray';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': case 'pass': return 'green';
            case 'warning': return 'yellow';
            case 'critical': case 'fail': return 'red';
            default: return 'gray';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'red';
            case 'high': return 'orange';
            case 'medium': return 'yellow';
            case 'low': return 'blue';
            default: return 'gray';
        }
    };

    const exportLogs = (format: 'json' | 'csv') => {
        const exportData = pricingIntegrationService.exportLogs(format);
        const blob = new Blob([exportData], { 
            type: format === 'json' ? 'application/json' : 'text/csv' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `integration-logs-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearOldLogs = async () => {
        const removedCount = pricingIntegrationService.clearLogs(30);
        await loadData();
        // Show notification about cleared logs
        console.log(`Cleared ${removedCount} old log entries`);
    };

    const renderLogsTab = () => (
        <Stack gap="md">
            {/* Filters */}
            <Card shadow="sm" padding="md" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                    <Title order={5}>Log Filters</Title>
                    <Group gap="xs">
                        <Switch
                            label="Auto Refresh"
                            checked={autoRefresh}
                            onChange={(event) => setAutoRefresh(event.currentTarget.checked)}
                            size="sm"
                        />
                        <Button
                            size="xs"
                            variant="light"
                            leftSection={<IconRefresh size={14} />}
                            onClick={loadData}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                    </Group>
                </Group>

                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                            label="Integration"
                            placeholder="All integrations"
                            value={logFilter.integrationId}
                            onChange={(value) => setLogFilter(prev => ({ ...prev, integrationId: value || '' }))}
                            data={[
                                { value: '', label: 'All Integrations' },
                                { value: 'pricing-mysql', label: 'MySQL Database' },
                                { value: 'pricing-api', label: 'REST API' },
                                { value: 'quote-sync', label: 'Quote Sync' }
                            ]}
                            clearable
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                            label="Level"
                            placeholder="All levels"
                            value={logFilter.level}
                            onChange={(value) => setLogFilter(prev => ({ ...prev, level: value || '' }))}
                            data={[
                                { value: '', label: 'All Levels' },
                                { value: 'error', label: 'Error' },
                                { value: 'warn', label: 'Warning' },
                                { value: 'info', label: 'Info' },
                                { value: 'debug', label: 'Debug' }
                            ]}
                            clearable
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                            label="Date Range"
                            value={logFilter.dateRange}
                            onChange={(value) => setLogFilter(prev => ({ ...prev, dateRange: value || 'today' }))}
                            data={[
                                { value: 'today', label: 'Today' },
                                { value: 'week', label: 'Last Week' },
                                { value: 'month', label: 'Last Month' },
                                { value: 'all', label: 'All Time' }
                            ]}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <TextInput
                            label="Search"
                            placeholder="Search logs..."
                            value={logFilter.searchTerm}
                            onChange={(event) => setLogFilter(prev => ({ ...prev, searchTerm: event.currentTarget.value }))}
                            leftSection={<IconSearch size={16} />}
                        />
                    </Grid.Col>
                </Grid>
            </Card>

            {/* Logs Table */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                    <Title order={4}>Integration Logs ({filteredLogs.length})</Title>
                    <Group gap="xs">
                        <Button
                            size="xs"
                            variant="light"
                            leftSection={<IconDownload size={14} />}
                            onClick={openExport}
                        >
                            Export
                        </Button>
                        <Button
                            size="xs"
                            variant="light"
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={clearOldLogs}
                        >
                            Clear Old
                        </Button>
                    </Group>
                </Group>

                <ScrollArea>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Timestamp</Table.Th>
                                <Table.Th>Integration</Table.Th>
                                <Table.Th>Level</Table.Th>
                                <Table.Th>Message</Table.Th>
                                <Table.Th>Operation</Table.Th>
                                <Table.Th>Duration</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredLogs.slice(0, 100).map((log) => (
                                <Table.Tr key={log.id}>
                                    <Table.Td>
                                        <Text size="xs" c="dimmed">
                                            {log.timestamp.toLocaleString()}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">
                                            {getIntegrationName(log.integrationId)}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color={getLevelColor(log.level)} size="sm">
                                            {log.level.toUpperCase()}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm" lineClamp={1}>
                                            {log.message}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="xs" c="dimmed">
                                            {log.operation || '-'}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="xs" c="dimmed">
                                            {log.duration ? `${log.duration}ms` : '-'}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <ActionIcon
                                            size="sm"
                                            variant="light"
                                            onClick={() => {
                                                setSelectedLog(log);
                                                openLog();
                                            }}
                                        >
                                            <IconEye size={14} />
                                        </ActionIcon>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>

                {filteredLogs.length === 0 && (
                    <Text ta="center" c="dimmed" py="xl">
                        No logs found matching the current filters
                    </Text>
                )}
            </Card>
        </Stack>
    );

    const renderErrorsTab = () => (
        <Stack gap="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                    <Title order={4}>Integration Errors</Title>
                    <Text size="sm" c="dimmed">
                        {errors.filter(e => !e.resolved).length} unresolved of {errors.length} total
                    </Text>
                </Group>

                <ScrollArea>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Integration</Table.Th>
                                <Table.Th>Error Type</Table.Th>
                                <Table.Th>Message</Table.Th>
                                <Table.Th>Severity</Table.Th>
                                <Table.Th>Retries</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Time</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {errors.map((error) => (
                                <Table.Tr key={error.id}>
                                    <Table.Td>
                                        <Text size="sm">
                                            {getIntegrationName(error.integrationId)}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge variant="light" size="sm">
                                            {error.errorType}
                                        </Badge>
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
                                        <Text size="sm">{error.retryCount}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        {error.resolved ? (
                                            <Badge color="green" size="sm">RESOLVED</Badge>
                                        ) : (
                                            <Badge color="red" size="sm">ACTIVE</Badge>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="xs" c="dimmed">
                                            {error.timestamp.toLocaleString()}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
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
                                            {!error.resolved && (
                                                <ActionIcon
                                                    size="sm"
                                                    variant="light"
                                                    color="green"
                                                    onClick={() => {
                                                        pricingIntegrationService.resolveError(error.id);
                                                        loadData();
                                                    }}
                                                >
                                                    <IconCheck size={14} />
                                                </ActionIcon>
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
                        No errors recorded
                    </Text>
                )}
            </Card>
        </Stack>
    );

    const renderDiagnosticsTab = () => (
        <Stack gap="md">
            <Group justify="space-between">
                <Title order={4}>System Diagnostics</Title>
                <Button
                    leftSection={<IconActivity size={16} />}
                    onClick={runDiagnostics}
                    loading={loading}
                >
                    Run Diagnostics
                </Button>
            </Group>

            {diagnostics.map((diagnostic) => (
                <Card key={diagnostic.integrationId} shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                        <Group gap="xs">
                            <ThemeIcon
                                color={getStatusColor(diagnostic.status)}
                                variant="light"
                                size="lg"
                            >
                                {diagnostic.status === 'healthy' ? <IconCheck size={20} /> :
                                 diagnostic.status === 'warning' ? <IconAlertTriangle size={20} /> :
                                 <IconX size={20} />}
                            </ThemeIcon>
                            <div>
                                <Title order={5}>{diagnostic.name}</Title>
                                <Text size="xs" c="dimmed">
                                    Last run: {diagnostic.lastRun.toLocaleString()}
                                </Text>
                            </div>
                        </Group>
                        <Badge color={getStatusColor(diagnostic.status)} size="lg">
                            {diagnostic.status.toUpperCase()}
                        </Badge>
                    </Group>

                    <Grid>
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Title order={6} mb="xs">Diagnostic Checks</Title>
                            <Stack gap="xs">
                                {diagnostic.checks.map((check, index) => (
                                    <Group key={index} justify="space-between">
                                        <Group gap="xs">
                                            <ThemeIcon
                                                size="sm"
                                                color={getStatusColor(check.status)}
                                                variant="light"
                                            >
                                                {check.status === 'pass' ? <IconCheck size={12} /> :
                                                 check.status === 'warning' ? <IconAlertTriangle size={12} /> :
                                                 <IconX size={12} />}
                                            </ThemeIcon>
                                            <Text size="sm">{check.name}</Text>
                                        </Group>
                                        <Text size="sm" c="dimmed">
                                            {check.message}
                                        </Text>
                                    </Group>
                                ))}
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 4 }}>
                            {diagnostic.recommendations.length > 0 && (
                                <div>
                                    <Title order={6} mb="xs">Recommendations</Title>
                                    <Stack gap="xs">
                                        {diagnostic.recommendations.map((rec, index) => (
                                            <Alert key={index} icon={<IconAlertTriangle size={16} />} color="yellow">
                                                <Text size="xs">{rec}</Text>
                                            </Alert>
                                        ))}
                                    </Stack>
                                </div>
                            )}
                        </Grid.Col>
                    </Grid>
                </Card>
            ))}

            {diagnostics.length === 0 && (
                <Card shadow="sm" padding="xl" radius="md" withBorder>
                    <Text ta="center" c="dimmed">
                        No diagnostic results available. Click "Run Diagnostics" to start.
                    </Text>
                </Card>
            )}
        </Stack>
    );

    return (
        <Stack gap="lg">
            <Group justify="space-between">
                <div>
                    <Title order={3}>Integration Diagnostics</Title>
                    <Text size="sm" c="dimmed">
                        Monitor logs, errors, and system health
                    </Text>
                </div>
                {loading && <Loader size="sm" />}
            </Group>

            <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'logs')}>
                <Tabs.List>
                    <Tabs.Tab value="logs" leftSection={<IconFileText size={16} />}>
                        Logs ({logs.length})
                    </Tabs.Tab>
                    <Tabs.Tab value="errors" leftSection={<IconBug size={16} />}>
                        Errors ({errors.filter(e => !e.resolved).length})
                    </Tabs.Tab>
                    <Tabs.Tab value="diagnostics" leftSection={<IconActivity size={16} />}>
                        Diagnostics
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="logs" pt="md">
                    {renderLogsTab()}
                </Tabs.Panel>

                <Tabs.Panel value="errors" pt="md">
                    {renderErrorsTab()}
                </Tabs.Panel>

                <Tabs.Panel value="diagnostics" pt="md">
                    {renderDiagnosticsTab()}
                </Tabs.Panel>
            </Tabs>

            {/* Log Details Modal */}
            <Modal
                opened={logOpened}
                onClose={closeLog}
                title="Log Details"
                size="lg"
            >
                {selectedLog && (
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Text fw={500}>Level</Text>
                            <Badge color={getLevelColor(selectedLog.level)}>
                                {selectedLog.level.toUpperCase()}
                            </Badge>
                        </Group>

                        <Group justify="space-between">
                            <Text fw={500}>Integration</Text>
                            <Text>{getIntegrationName(selectedLog.integrationId)}</Text>
                        </Group>

                        <Group justify="space-between">
                            <Text fw={500}>Timestamp</Text>
                            <Text>{selectedLog.timestamp.toLocaleString()}</Text>
                        </Group>

                        {selectedLog.operation && (
                            <Group justify="space-between">
                                <Text fw={500}>Operation</Text>
                                <Text>{selectedLog.operation}</Text>
                            </Group>
                        )}

                        {selectedLog.duration && (
                            <Group justify="space-between">
                                <Text fw={500}>Duration</Text>
                                <Text>{selectedLog.duration}ms</Text>
                            </Group>
                        )}

                        <div>
                            <Text fw={500} mb="xs">Message</Text>
                            <Text size="sm">{selectedLog.message}</Text>
                        </div>

                        {selectedLog.details && (
                            <div>
                                <Text fw={500} mb="xs">Details</Text>
                                <Code block>
                                    {JSON.stringify(selectedLog.details, null, 2)}
                                </Code>
                            </div>
                        )}

                        <Group justify="flex-end" mt="md">
                            <Button variant="outline" onClick={closeLog}>
                                Close
                            </Button>
                            <Button
                                leftSection={<IconClipboard size={16} />}
                                onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
                                }}
                            >
                                Copy to Clipboard
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

                        <Group justify="space-between">
                            <Text fw={500}>Error Type</Text>
                            <Badge variant="light">{selectedError.errorType}</Badge>
                        </Group>

                        <Group justify="space-between">
                            <Text fw={500}>Integration</Text>
                            <Text>{getIntegrationName(selectedError.integrationId)}</Text>
                        </Group>

                        <Group justify="space-between">
                            <Text fw={500}>Retry Count</Text>
                            <Text>{selectedError.retryCount}</Text>
                        </Group>

                        <div>
                            <Text fw={500} mb="xs">Error Message</Text>
                            <Text size="sm">{selectedError.message}</Text>
                        </div>

                        <div>
                            <Text fw={500} mb="xs">Details</Text>
                            <Code block>{selectedError.details}</Code>
                        </div>

                        <Group justify="flex-end" mt="md">
                            <Button variant="outline" onClick={closeError}>
                                Close
                            </Button>
                            {!selectedError.resolved && (
                                <Button
                                    color="green"
                                    onClick={() => {
                                        pricingIntegrationService.resolveError(selectedError.id);
                                        loadData();
                                        closeError();
                                    }}
                                >
                                    Mark as Resolved
                                </Button>
                            )}
                        </Group>
                    </Stack>
                )}
            </Modal>

            {/* Export Modal */}
            <Modal
                opened={exportOpened}
                onClose={closeExport}
                title="Export Logs"
                size="sm"
            >
                <Stack gap="md">
                    <Text size="sm" c="dimmed">
                        Export integration logs for external analysis or archival.
                    </Text>

                    <Group justify="center" gap="md">
                        <Button
                            leftSection={<IconDownload size={16} />}
                            onClick={() => {
                                exportLogs('json');
                                closeExport();
                            }}
                        >
                            Export as JSON
                        </Button>
                        <Button
                            variant="outline"
                            leftSection={<IconDownload size={16} />}
                            onClick={() => {
                                exportLogs('csv');
                                closeExport();
                            }}
                        >
                            Export as CSV
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Stack>
    );
}
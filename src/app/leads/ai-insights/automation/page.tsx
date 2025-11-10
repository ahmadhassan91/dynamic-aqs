// AI Automation Page - Smart Workflows and Automated Actions
'use client';

import { useState } from 'react';
import {
  Card,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Button,
  ThemeIcon,
  Switch,
  Paper,
  ActionIcon,
  Menu,
  Select,
  NumberInput,
  Textarea,
  Modal,
  Alert,
  Timeline,
  Code,
  Divider,
  SimpleGrid,
  TextInput,
  Box,
} from '@mantine/core';
import {
  IconRobot,
  IconBolt,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUsers,
  IconTrendingUp,
  IconAlertTriangle,
  IconCheck,
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconCopy,
  IconPlayerPlay,
  IconPlayerPause,
  IconSparkles,
  IconBrain,
  IconClock,
  IconTarget,
  IconRefresh,
  IconSettings,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  isActive: boolean;
  executionCount: number;
  successRate: number;
  lastExecuted: Date | null;
  category: 'lead-scoring' | 'follow-up' | 'assignment' | 'notification' | 'custom';
}

interface AutomationSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  estimatedTimeSaved: string;
  leadsAffected: number;
}

export default function AIAutomationPage() {
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  // Mock automation rules
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Hot Lead Auto-Assignment',
      description: 'Automatically assign leads with AI score >80 to senior sales reps',
      trigger: 'Lead score updated',
      conditions: ['AI Score > 80', 'Stage = New or Qualified'],
      actions: ['Assign to senior rep', 'Send notification', 'Schedule follow-up call'],
      isActive: true,
      executionCount: 127,
      successRate: 94,
      lastExecuted: new Date('2025-11-10T09:30:00'),
      category: 'assignment'
    },
    {
      id: '2',
      name: 'Engagement Drop Alert',
      description: 'Alert sales rep when lead engagement drops below threshold',
      trigger: 'Engagement score change',
      conditions: ['Engagement drop > 20%', 'Stage = Discovery or Proposal'],
      actions: ['Send alert to rep', 'Create task', 'Suggest re-engagement email'],
      isActive: true,
      executionCount: 45,
      successRate: 88,
      lastExecuted: new Date('2025-11-09T14:15:00'),
      category: 'notification'
    },
    {
      id: '3',
      name: 'Smart Follow-Up Scheduler',
      description: 'Schedule follow-ups based on AI-predicted optimal contact time',
      trigger: 'Lead moves to Qualified',
      conditions: ['Conversion probability > 60%'],
      actions: ['Schedule call at optimal time', 'Send prep email', 'Add to calendar'],
      isActive: true,
      executionCount: 89,
      successRate: 92,
      lastExecuted: new Date('2025-11-10T11:00:00'),
      category: 'follow-up'
    },
    {
      id: '4',
      name: 'Win Probability Escalation',
      description: 'Escalate high-value deals when win probability increases',
      trigger: 'Win probability updated',
      conditions: ['Win probability > 85%', 'Deal value > $100K'],
      actions: ['Notify sales manager', 'Create executive briefing', 'Schedule review'],
      isActive: false,
      executionCount: 23,
      successRate: 96,
      lastExecuted: new Date('2025-11-08T16:45:00'),
      category: 'notification'
    },
  ]);

  // AI suggestions for new automations
  const aiSuggestions: AutomationSuggestion[] = [
    {
      id: '1',
      title: 'Automate Low-Score Lead Nurturing',
      description: 'Put leads with score <40 into automated nurture sequence',
      impact: 'high',
      estimatedTimeSaved: '5 hours/week',
      leadsAffected: 34
    },
    {
      id: '2',
      title: 'Weekend Engagement Follow-Up',
      description: 'Auto-send follow-up emails for weekend website visits on Monday morning',
      impact: 'medium',
      estimatedTimeSaved: '2 hours/week',
      leadsAffected: 12
    },
    {
      id: '3',
      title: 'Competitor Mention Alert',
      description: 'Notify reps when competitor is mentioned in lead communications',
      impact: 'high',
      estimatedTimeSaved: '3 hours/week',
      leadsAffected: 8
    },
  ];

  const toggleRuleStatus = (ruleId: string) => {
    setAutomationRules(rules =>
      rules.map(rule =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'lead-scoring': 'violet',
      'follow-up': 'blue',
      'assignment': 'green',
      'notification': 'orange',
      'custom': 'gray'
    };
    return colors[category] || 'gray';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'lead-scoring': IconTrendingUp,
      'follow-up': IconCalendar,
      'assignment': IconUsers,
      'notification': IconBolt,
      'custom': IconSettings
    };
    return icons[category] || IconSettings;
  };

  const getImpactColor = (impact: string) => {
    if (impact === 'high') return 'green';
    if (impact === 'medium') return 'yellow';
    return 'orange';
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Paper withBorder p="lg" radius="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Group justify="space-between">
          <Group>
            <ThemeIcon size={50} radius="md" variant="white" color="violet">
              <IconRobot size={28} />
            </ThemeIcon>
            <div>
              <Title order={3} c="white">AI Automation Hub</Title>
              <Text size="sm" c="white" opacity={0.9}>
                Intelligent workflows and automated actions powered by AI
              </Text>
            </div>
          </Group>
          <Button 
            variant="white" 
            leftSection={<IconPlus size={16} />}
            onClick={openForm}
          >
            Create Rule
          </Button>
        </Group>
      </Paper>

      {/* Automation Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        <Card withBorder shadow="sm" p="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">Active Rules</Text>
              <ThemeIcon size="sm" variant="light" color="green">
                <IconCheck size={14} />
              </ThemeIcon>
            </Group>
            <Title order={2}>{automationRules.filter(r => r.isActive).length}</Title>
            <Text size="xs" c="dimmed">Running automations</Text>
          </Stack>
        </Card>

        <Card withBorder shadow="sm" p="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">Executions Today</Text>
              <ThemeIcon size="sm" variant="light" color="blue">
                <IconBolt size={14} />
              </ThemeIcon>
            </Group>
            <Title order={2}>284</Title>
            <Text size="xs" c="dimmed">+23% vs yesterday</Text>
          </Stack>
        </Card>

        <Card withBorder shadow="sm" p="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">Success Rate</Text>
              <ThemeIcon size="sm" variant="light" color="violet">
                <IconTarget size={14} />
              </ThemeIcon>
            </Group>
            <Title order={2}>91.5%</Title>
            <Text size="xs" c="dimmed">Avg. across all rules</Text>
          </Stack>
        </Card>

        <Card withBorder shadow="sm" p="lg">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">Time Saved</Text>
              <ThemeIcon size="sm" variant="light" color="orange">
                <IconClock size={14} />
              </ThemeIcon>
            </Group>
            <Title order={2}>18.5h</Title>
            <Text size="xs" c="dimmed">This week</Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* AI Suggestions */}
      <Card withBorder shadow="sm">
        <Card.Section withBorder p="md" bg="violet.0">
          <Group justify="space-between">
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color="violet">
                <IconSparkles size={16} />
              </ThemeIcon>
              <Title order={4}>AI-Suggested Automations</Title>
            </Group>
            <Badge size="sm" variant="gradient" gradient={{ from: 'violet', to: 'blue' }}>
              {aiSuggestions.length} suggestions
            </Badge>
          </Group>
        </Card.Section>

        <Card.Section p="md">
          <Stack gap="md">
            {aiSuggestions.map((suggestion) => (
              <Paper key={suggestion.id} withBorder p="md" radius="md">
                <Group justify="space-between" align="flex-start">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Group gap="xs">
                      <ThemeIcon size="md" variant="light" color={getImpactColor(suggestion.impact)}>
                        <IconBrain size={18} />
                      </ThemeIcon>
                      <div>
                        <Text size="sm" fw={600}>{suggestion.title}</Text>
                        <Text size="xs" c="dimmed">{suggestion.description}</Text>
                      </div>
                    </Group>

                    <Group gap="md">
                      <Group gap={4}>
                        <IconClock size={14} />
                        <Text size="xs" fw={500}>{suggestion.estimatedTimeSaved} saved</Text>
                      </Group>
                      <Group gap={4}>
                        <IconUsers size={14} />
                        <Text size="xs" fw={500}>{suggestion.leadsAffected} leads affected</Text>
                      </Group>
                      <Badge size="xs" color={getImpactColor(suggestion.impact)} variant="light">
                        {suggestion.impact} impact
                      </Badge>
                    </Group>
                  </Stack>

                  <Button size="xs" variant="light" leftSection={<IconPlus size={14} />}>
                    Create
                  </Button>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Card.Section>
      </Card>

      {/* Active Automation Rules */}
      <Card withBorder shadow="sm">
        <Card.Section withBorder p="md" bg="gray.0">
          <Group justify="space-between">
            <Title order={4}>Automation Rules</Title>
            <Group gap="xs">
              <Button size="xs" variant="light" leftSection={<IconRefresh size={14} />}>
                Refresh
              </Button>
            </Group>
          </Group>
        </Card.Section>

        <Card.Section p="md">
          <Stack gap="md">
            {automationRules.map((rule) => {
              const CategoryIcon = getCategoryIcon(rule.category);
              
              return (
                <Paper key={rule.id} withBorder p="lg" radius="md">
                  <Stack gap="md">
                    {/* Header */}
                    <Group justify="space-between" align="flex-start">
                      <Group gap="sm" style={{ flex: 1 }}>
                        <ThemeIcon size="lg" variant="light" color={getCategoryColor(rule.category)}>
                          <CategoryIcon size={20} />
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                          <Group gap="xs" mb={4}>
                            <Text size="md" fw={700}>{rule.name}</Text>
                            <Badge size="sm" color={getCategoryColor(rule.category)} variant="light" tt="capitalize">
                              {rule.category.replace('-', ' ')}
                            </Badge>
                          </Group>
                          <Text size="sm" c="dimmed">{rule.description}</Text>
                        </div>
                      </Group>

                      <Group gap="xs">
                        <Switch
                          checked={rule.isActive}
                          onChange={() => toggleRuleStatus(rule.id)}
                          color="green"
                          size="md"
                        />
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<IconEdit size={14} />}>Edit Rule</Menu.Item>
                            <Menu.Item leftSection={<IconCopy size={14} />}>Duplicate</Menu.Item>
                            <Menu.Item leftSection={<IconPlayerPlay size={14} />}>Test Run</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Group>

                    <Divider />

                    {/* Rule Details */}
                    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                      <Box>
                        <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={8}>Trigger</Text>
                        <Paper bg="blue.0" p="sm" radius="md">
                          <Group gap={6}>
                            <IconBolt size={14} />
                            <Text size="xs" fw={500}>{rule.trigger}</Text>
                          </Group>
                        </Paper>
                      </Box>

                      <Box>
                        <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={8}>Conditions ({rule.conditions.length})</Text>
                        <Stack gap={4}>
                          {rule.conditions.map((condition, idx) => (
                            <Paper key={idx} bg="yellow.0" p="xs" radius="sm">
                              <Text size="xs">{condition}</Text>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>

                      <Box>
                        <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={8}>Actions ({rule.actions.length})</Text>
                        <Stack gap={4}>
                          {rule.actions.map((action, idx) => (
                            <Paper key={idx} bg="green.0" p="xs" radius="sm">
                              <Text size="xs">{action}</Text>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>
                    </SimpleGrid>

                    <Divider />

                    {/* Performance Metrics */}
                    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                      <Box>
                        <Text size="xs" c="dimmed" mb={4}>Executions</Text>
                        <Text size="lg" fw={700}>{rule.executionCount}</Text>
                      </Box>
                      <Box>
                        <Text size="xs" c="dimmed" mb={4}>Success Rate</Text>
                        <Group gap={4}>
                          <Text size="lg" fw={700} c="green">{rule.successRate}%</Text>
                        </Group>
                      </Box>
                      <Box>
                        <Text size="xs" c="dimmed" mb={4}>Status</Text>
                        <Badge color={rule.isActive ? 'green' : 'gray'} variant="filled">
                          {rule.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </Box>
                      <Box>
                        <Text size="xs" c="dimmed" mb={4}>Last Run</Text>
                        <Text size="xs" fw={500}>
                          {rule.lastExecuted 
                            ? rule.lastExecuted.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                            : 'Never'
                          }
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Card.Section>
      </Card>

      {/* Create Rule Modal */}
      <Modal
        opened={formOpened}
        onClose={closeForm}
        title="Create Automation Rule"
        size="lg"
      >
        <Stack gap="md">
          <Alert icon={<IconSparkles size={16} />} color="violet" variant="light">
            <Text size="sm">AI will help optimize your automation rules based on historical performance data.</Text>
          </Alert>

          <Select
            label="Rule Template"
            placeholder="Choose a template or start from scratch"
            data={[
              { value: 'custom', label: 'Custom Rule' },
              { value: 'hot-lead', label: 'Hot Lead Assignment' },
              { value: 'follow-up', label: 'Smart Follow-Up' },
              { value: 'engagement', label: 'Engagement Alert' },
            ]}
          />

          <TextInput
            label="Rule Name"
            placeholder="e.g., Auto-assign hot leads"
            required
          />

          <Textarea
            label="Description"
            placeholder="Describe what this automation does"
            rows={3}
          />

          <Select
            label="Trigger"
            placeholder="When should this rule run?"
            data={[
              { value: 'score-change', label: 'Lead Score Changes' },
              { value: 'stage-change', label: 'Stage Changes' },
              { value: 'engagement', label: 'Engagement Event' },
              { value: 'time-based', label: 'Time-Based' },
            ]}
          />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeForm}>Cancel</Button>
            <Button leftSection={<IconCheck size={16} />}>Create Rule</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

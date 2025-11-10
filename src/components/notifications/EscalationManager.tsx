'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Text,
  Group,
  Badge,
  Button,
  Stack,
  ActionIcon,
  Menu,
  Select,
  TextInput,
  NumberInput,
  Switch,
  Modal,
  Textarea,
  MultiSelect,
  Grid,
  Alert,
  Timeline,
  Progress,
  Divider,
  Box,
  Paper,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconClock,
  IconUsers,
  IconMail,
  IconPhone,
  IconMessage,
  IconPlus,
  IconEdit,
  IconTrash,
  IconPlayerPlay,
  IconPlayerPause,
  IconSettings,
  IconChevronRight,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications as mantineNotifications } from '@mantine/notifications';
import { 
  EscalationRule,
  EscalationStep,
  NotificationCategory,
  NotificationPriority,
  CommercialNotificationData
} from '@/types/notifications';
import { notificationService } from '@/lib/services/notificationService';

interface EscalationManagerProps {
  opportunityId?: string;
  opportunityData?: CommercialNotificationData;
}

export function EscalationManager({ opportunityId, opportunityData }: EscalationManagerProps) {
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>([]);
  const [activeEscalations, setActiveEscalations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRule, setSelectedRule] = useState<EscalationRule | null>(null);
  
  // Modal states
  const [ruleModalOpened, { open: openRuleModal, close: closeRuleModal }] = useDisclosure(false);
  const [testModalOpened, { open: openTestModal, close: closeTestModal }] = useDisclosure(false);

  // Form states
  const [ruleName, setRuleName] = useState('');
  const [ruleCategory, setRuleCategory] = useState<NotificationCategory>(NotificationCategory.COMMERCIAL_OPPORTUNITY);
  const [valueThreshold, setValueThreshold] = useState<number>(250000);
  const [timeThreshold, setTimeThreshold] = useState<number>(24);
  const [priorityLevel, setPriorityLevel] = useState<NotificationPriority>(NotificationPriority.HIGH);
  const [marketSegments, setMarketSegments] = useState<string[]>([]);
  const [salesPhases, setSalesPhases] = useState<string[]>([]);
  const [escalationSteps, setEscalationSteps] = useState<EscalationStep[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadEscalationRules();
    loadActiveEscalations();
  }, []);

  const loadEscalationRules = async () => {
    setLoading(true);
    try {
      const rules = await notificationService.getEscalationRules();
      setEscalationRules(rules);
    } catch (error) {
      mantineNotifications.show({
        title: 'Error',
        message: 'Failed to load escalation rules',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadActiveEscalations = async () => {
    // Mock active escalations data
    setActiveEscalations([
      {
        id: 'esc-1',
        ruleId: 'escalation-1',
        ruleName: 'High-Value Opportunity Escalation',
        opportunityId: 'opp_1',
        opportunityName: 'Regional Medical Center HVAC Upgrade',
        currentStep: 1,
        totalSteps: 2,
        startedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        nextStepAt: new Date(Date.now() + 1000 * 60 * 75), // 75 minutes from now
        status: 'active'
      },
      {
        id: 'esc-2',
        ruleId: 'escalation-2',
        ruleName: 'Quote Response Escalation',
        opportunityId: 'opp_2',
        opportunityName: 'University Campus Renovation',
        currentStep: 1,
        totalSteps: 1,
        startedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        nextStepAt: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes from now
        status: 'active'
      }
    ]);
  };

  const handleCreateRule = async () => {
    try {
      const newRule: Omit<EscalationRule, 'id' | 'createdAt' | 'updatedAt'> = {
        name: ruleName,
        category: ruleCategory,
        conditions: {
          valueThreshold,
          timeThreshold,
          priorityLevel,
          marketSegment: marketSegments,
          salesPhase: salesPhases
        },
        escalationSteps,
        isActive
      };

      await notificationService.createEscalationRule(newRule);
      await loadEscalationRules();
      closeRuleModal();
      resetForm();
      
      mantineNotifications.show({
        title: 'Success',
        message: 'Escalation rule created successfully',
        color: 'green',
      });
    } catch (error) {
      mantineNotifications.show({
        title: 'Error',
        message: 'Failed to create escalation rule',
        color: 'red',
      });
    }
  };

  const handleUpdateRule = async () => {
    if (!selectedRule) return;

    try {
      const updates: Partial<EscalationRule> = {
        name: ruleName,
        category: ruleCategory,
        conditions: {
          valueThreshold,
          timeThreshold,
          priorityLevel,
          marketSegment: marketSegments,
          salesPhase: salesPhases
        },
        escalationSteps,
        isActive
      };

      await notificationService.updateEscalationRule(selectedRule.id, updates);
      await loadEscalationRules();
      closeRuleModal();
      resetForm();
      
      mantineNotifications.show({
        title: 'Success',
        message: 'Escalation rule updated successfully',
        color: 'green',
      });
    } catch (error) {
      mantineNotifications.show({
        title: 'Error',
        message: 'Failed to update escalation rule',
        color: 'red',
      });
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await notificationService.deleteEscalationRule(ruleId);
      await loadEscalationRules();
      
      mantineNotifications.show({
        title: 'Success',
        message: 'Escalation rule deleted successfully',
        color: 'green',
      });
    } catch (error) {
      mantineNotifications.show({
        title: 'Error',
        message: 'Failed to delete escalation rule',
        color: 'red',
      });
    }
  };

  const handleTestEscalation = async () => {
    try {
      // Create a test high-value opportunity notification to trigger escalation
      await notificationService.createCommercialOpportunityNotification('high_value', {
        opportunityId: 'test-escalation-opp',
        opportunityName: 'Test Escalation Opportunity',
        estimatedValue: 750000,
        marketSegment: 'Healthcare',
        salesPhase: 'Preliminary Quote'
      });

      closeTestModal();
      mantineNotifications.show({
        title: 'Success',
        message: 'Test escalation triggered successfully',
        color: 'green',
      });
    } catch (error) {
      mantineNotifications.show({
        title: 'Error',
        message: 'Failed to trigger test escalation',
        color: 'red',
      });
    }
  };

  const resetForm = () => {
    setRuleName('');
    setRuleCategory(NotificationCategory.COMMERCIAL_OPPORTUNITY);
    setValueThreshold(250000);
    setTimeThreshold(24);
    setPriorityLevel(NotificationPriority.HIGH);
    setMarketSegments([]);
    setSalesPhases([]);
    setEscalationSteps([]);
    setIsActive(true);
    setSelectedRule(null);
  };

  const openEditModal = (rule: EscalationRule) => {
    setSelectedRule(rule);
    setRuleName(rule.name);
    setRuleCategory(rule.category);
    setValueThreshold(rule.conditions.valueThreshold || 250000);
    setTimeThreshold(rule.conditions.timeThreshold || 24);
    setPriorityLevel(rule.conditions.priorityLevel || NotificationPriority.HIGH);
    setMarketSegments(rule.conditions.marketSegment || []);
    setSalesPhases(rule.conditions.salesPhase || []);
    setEscalationSteps(rule.escalationSteps);
    setIsActive(rule.isActive);
    openRuleModal();
  };

  const addEscalationStep = () => {
    const newStep: EscalationStep = {
      stepNumber: escalationSteps.length + 1,
      delayMinutes: 60,
      recipients: [],
      notificationMethods: ['email'],
      template: '',
      conditions: { stillUnread: true }
    };
    setEscalationSteps([...escalationSteps, newStep]);
  };

  const updateEscalationStep = (index: number, updates: Partial<EscalationStep>) => {
    const updatedSteps = [...escalationSteps];
    updatedSteps[index] = { ...updatedSteps[index], ...updates };
    setEscalationSteps(updatedSteps);
  };

  const removeEscalationStep = (index: number) => {
    const updatedSteps = escalationSteps.filter((_, i) => i !== index);
    // Renumber steps
    updatedSteps.forEach((step, i) => {
      step.stepNumber = i + 1;
    });
    setEscalationSteps(updatedSteps);
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 0) return 'Overdue';
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Text size="xl" fw={700}>Escalation Manager</Text>
          <Text c="dimmed">Manage automated escalation workflows for high-value commercial deals</Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlayerPlay size={16} />}
            variant="light"
            onClick={openTestModal}
          >
            Test Escalation
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              resetForm();
              openRuleModal();
            }}
          >
            Create Rule
          </Button>
        </Group>
      </Group>

      <Grid>
        {/* Active Escalations */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card withBorder mb="lg">
            <Text fw={600} mb="md">Active Escalations</Text>
            {activeEscalations.length === 0 ? (
              <Alert icon={<IconInfoCircle size={16} />} color="blue">
                No active escalations at this time.
              </Alert>
            ) : (
              <Stack gap="md">
                {activeEscalations.map((escalation) => (
                  <Paper key={escalation.id} p="md" withBorder>
                    <Group justify="space-between" mb="sm">
                      <div>
                        <Text fw={500}>{escalation.opportunityName}</Text>
                        <Text size="sm" c="dimmed">Rule: {escalation.ruleName}</Text>
                      </div>
                      <Badge color="orange">Active</Badge>
                    </Group>
                    
                    <Group mb="sm">
                      <Text size="sm">
                        Step {escalation.currentStep} of {escalation.totalSteps}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Next step in: {formatTimeRemaining(escalation.nextStepAt)}
                      </Text>
                    </Group>
                    
                    <Progress
                      value={(escalation.currentStep / escalation.totalSteps) * 100}
                      size="sm"
                      mb="sm"
                    />
                    
                    <Group>
                      <Button size="xs" variant="light">
                        View Details
                      </Button>
                      <Button size="xs" variant="light" color="red">
                        Cancel Escalation
                      </Button>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </Card>

          {/* Escalation Rules */}
          <Card withBorder>
            <Text fw={600} mb="md">Escalation Rules</Text>
            <Stack gap="md">
              {escalationRules.map((rule) => (
                <Paper key={rule.id} p="md" withBorder>
                  <Group justify="space-between" mb="sm">
                    <div>
                      <Group gap="xs" mb="xs">
                        <Text fw={500}>{rule.name}</Text>
                        <Badge color={rule.isActive ? 'green' : 'gray'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed">
                        Category: {rule.category} | Steps: {rule.escalationSteps.length}
                      </Text>
                      {rule.conditions.valueThreshold && (
                        <Text size="xs" c="dimmed">
                          Triggers for opportunities ≥ ${rule.conditions.valueThreshold.toLocaleString()}
                        </Text>
                      )}
                    </div>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconSettings size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEdit size={14} />}
                          onClick={() => openEditModal(rule)}
                        >
                          Edit Rule
                        </Menu.Item>
                        <Menu.Item
                          leftSection={rule.isActive ? <IconPlayerPause size={14} /> : <IconPlayerPlay size={14} />}
                        >
                          {rule.isActive ? 'Deactivate' : 'Activate'}
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconTrash size={14} />}
                          color="red"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          Delete Rule
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                  
                  <Timeline active={rule.escalationSteps.length} bulletSize={24} lineWidth={2}>
                    {rule.escalationSteps.map((step, index) => (
                      <Timeline.Item
                        key={index}
                        bullet={<IconClock size={12} />}
                        title={`Step ${step.stepNumber}`}
                      >
                        <Text size="xs" c="dimmed">
                          After {step.delayMinutes} minutes → {step.recipients.join(', ')}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Methods: {step.notificationMethods.join(', ')}
                        </Text>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Escalation Statistics */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="md">
            <Card withBorder>
              <Text fw={600} mb="md">Escalation Statistics</Text>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm">Active Escalations</Text>
                  <Badge>{activeEscalations.length}</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Total Rules</Text>
                  <Badge>{escalationRules.length}</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Active Rules</Text>
                  <Badge color="green">
                    {escalationRules.filter(r => r.isActive).length}
                  </Badge>
                </Group>
              </Stack>
            </Card>

            <Card withBorder>
              <Text fw={600} mb="md">Quick Actions</Text>
              <Stack gap="sm">
                <Button
                  fullWidth
                  variant="light"
                  leftSection={<IconAlertTriangle size={16} />}
                  onClick={() => {
                    // Trigger high-value opportunity alert
                    notificationService.createCommercialOpportunityNotification('high_value', {
                      opportunityId: 'demo-opp-1',
                      opportunityName: 'Demo High-Value Opportunity',
                      estimatedValue: 850000,
                      marketSegment: 'Healthcare'
                    });
                  }}
                >
                  Trigger High-Value Alert
                </Button>
                <Button
                  fullWidth
                  variant="light"
                  leftSection={<IconUsers size={16} />}
                  onClick={() => {
                    // Trigger team notification
                    notificationService.notifyLargeOpportunityTeam({
                      opportunityId: 'demo-opp-2',
                      opportunityName: 'Large Team Opportunity',
                      estimatedValue: 1200000,
                      marketSegment: 'University'
                    });
                  }}
                >
                  Notify Large Opp Team
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Rule Creation/Edit Modal */}
      <Modal
        opened={ruleModalOpened}
        onClose={closeRuleModal}
        title={selectedRule ? 'Edit Escalation Rule' : 'Create Escalation Rule'}
        size="xl"
      >
        <Stack gap="md">
          <TextInput
            label="Rule Name"
            placeholder="Enter rule name"
            value={ruleName}
            onChange={(e) => setRuleName(e.currentTarget.value)}
            required
          />
          
          <Select
            label="Category"
            data={[
              { value: NotificationCategory.COMMERCIAL_OPPORTUNITY, label: 'Commercial Opportunities' },
              { value: NotificationCategory.COMMERCIAL_QUOTE, label: 'Commercial Quotes' },
              { value: NotificationCategory.COMMERCIAL_ENGINEER, label: 'Engineers' },
              { value: NotificationCategory.COMMERCIAL_REP, label: 'Manufacturer Reps' },
            ]}
            value={ruleCategory}
            onChange={(value) => setRuleCategory(value as NotificationCategory)}
            required
          />

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Value Threshold"
                placeholder="Minimum opportunity value"
                value={valueThreshold}
                onChange={(value) => setValueThreshold(Number(value))}
                leftSection="$"
                thousandSeparator=","
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Time Threshold (hours)"
                placeholder="Time before escalation"
                value={timeThreshold}
                onChange={(value) => setTimeThreshold(Number(value))}
              />
            </Grid.Col>
          </Grid>

          <Select
            label="Priority Level"
            data={Object.values(NotificationPriority).map(p => ({ value: p, label: p.toUpperCase() }))}
            value={priorityLevel}
            onChange={(value) => setPriorityLevel(value as NotificationPriority)}
          />

          <MultiSelect
            label="Market Segments"
            placeholder="Select applicable market segments"
            data={[
              { value: 'Healthcare', label: 'Healthcare' },
              { value: 'University', label: 'University' },
              { value: 'Cannabis', label: 'Cannabis' },
              { value: 'Manufacturing', label: 'Manufacturing' },
              { value: 'Office', label: 'Office' },
            ]}
            value={marketSegments}
            onChange={setMarketSegments}
          />

          <MultiSelect
            label="Sales Phases"
            placeholder="Select applicable sales phases"
            data={[
              { value: 'Prospect', label: 'Prospect' },
              { value: 'Preliminary Quote', label: 'Preliminary Quote' },
              { value: 'Final Quote', label: 'Final Quote' },
              { value: 'PO in Hand', label: 'PO in Hand' },
            ]}
            value={salesPhases}
            onChange={setSalesPhases}
          />

          <Switch
            label="Active"
            description="Enable this escalation rule"
            checked={isActive}
            onChange={(e) => setIsActive(e.currentTarget.checked)}
          />

          <Divider label="Escalation Steps" />

          <Stack gap="sm">
            {escalationSteps.map((step, index) => (
              <Paper key={index} p="md" withBorder>
                <Group justify="space-between" mb="sm">
                  <Text fw={500}>Step {step.stepNumber}</Text>
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => removeEscalationStep(index)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
                
                <Grid>
                  <Grid.Col span={6}>
                    <NumberInput
                      label="Delay (minutes)"
                      value={step.delayMinutes}
                      onChange={(value) => updateEscalationStep(index, { delayMinutes: Number(value) })}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <MultiSelect
                      label="Notification Methods"
                      data={[
                        { value: 'email', label: 'Email' },
                        { value: 'push', label: 'Push Notification' },
                        { value: 'sms', label: 'SMS' },
                      ]}
                      value={step.notificationMethods}
                      onChange={(value) => updateEscalationStep(index, { notificationMethods: value as any })}
                    />
                  </Grid.Col>
                </Grid>
                
                <MultiSelect
                  label="Recipients"
                  placeholder="Select recipients"
                  data={[
                    { value: 'regional-sales-manager', label: 'Regional Sales Manager' },
                    { value: 'sales-director', label: 'Sales Director' },
                    { value: 'manufacturer-rep', label: 'Manufacturer Rep' },
                    { value: 'engineering-support', label: 'Engineering Support' },
                    { value: 'management', label: 'Management' },
                  ]}
                  value={step.recipients}
                  onChange={(value) => updateEscalationStep(index, { recipients: value })}
                  mt="sm"
                />
              </Paper>
            ))}
            
            <Button
              variant="light"
              leftSection={<IconPlus size={16} />}
              onClick={addEscalationStep}
            >
              Add Escalation Step
            </Button>
          </Stack>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeRuleModal}>
              Cancel
            </Button>
            <Button onClick={selectedRule ? handleUpdateRule : handleCreateRule}>
              {selectedRule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Test Escalation Modal */}
      <Modal
        opened={testModalOpened}
        onClose={closeTestModal}
        title="Test Escalation"
        size="md"
      >
        <Stack gap="md">
          <Alert icon={<IconInfoCircle size={16} />} color="blue">
            This will create a test high-value opportunity notification to trigger escalation rules.
          </Alert>
          
          <Text size="sm">
            A test opportunity with a value of $750,000 will be created to test the escalation workflow.
            This will trigger any active escalation rules that match the criteria.
          </Text>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeTestModal}>
              Cancel
            </Button>
            <Button onClick={handleTestEscalation}>
              Trigger Test Escalation
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
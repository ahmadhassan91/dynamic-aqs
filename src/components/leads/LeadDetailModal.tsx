'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Card,
  Divider,
  Progress,
  Timeline,
  ActionIcon,
  Tooltip,
  SimpleGrid,
  Box,
  ThemeIcon,
  Alert,
  List,
} from '@mantine/core';
import {
  IconUser,
  IconBuilding,
  IconMail,
  IconPhone,
  IconCalendar,
  IconTrendingUp,
  IconEdit,
  IconNotes,
  IconClock,
  IconCheck,
  IconX,
  IconSparkles,
  IconBulb,
  IconInfoCircle,
} from '@tabler/icons-react';
import { MockLead } from '@/lib/mockData/generators';
import { AILeadScore } from '@/types/ai';
import { aiService } from '@/lib/services/aiService';
import { AILeadScoreBadge } from '@/components/ai/AILeadScoreBadge';

interface LeadDetailModalProps {
  lead: MockLead;
  onClose: () => void;
  onEdit: () => void;
}

export function LeadDetailModal({ lead, onClose, onEdit }: LeadDetailModalProps) {
  const [aiScore, setAiScore] = useState<AILeadScore | null>(null);

  useEffect(() => {
    // Calculate AI score for the lead
    const score = aiService.calculateLeadScore(lead);
    setAiScore(score);
  }, [lead]);

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'hubspot': return 'orange';
      case 'referral': return 'green';
      case 'website': return 'blue';
      case 'trade_show': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'blue';
      case 'qualified': return 'cyan';
      case 'discovery': return 'yellow';
      case 'proposal': return 'orange';
      case 'won': return 'green';
      case 'lost': return 'red';
      default: return 'gray';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const mockActivities = [
    {
      id: '1',
      type: 'created',
      title: 'Lead Created',
      description: `Lead imported from ${lead.source}`,
      date: lead.createdAt,
      icon: IconUser,
      color: 'blue',
    },
    {
      id: '2',
      type: 'email',
      title: 'Welcome Email Sent',
      description: 'Automated welcome email sent to prospect',
      date: new Date(lead.createdAt.getTime() + 1000 * 60 * 30),
      icon: IconMail,
      color: 'green',
    },
    {
      id: '3',
      type: 'call',
      title: 'Initial Contact Attempt',
      description: 'First outreach call attempted',
      date: new Date(lead.createdAt.getTime() + 1000 * 60 * 60 * 24),
      icon: IconPhone,
      color: 'orange',
    },
  ];

  if (lead.discoveryCallDate) {
    mockActivities.push({
      id: '4',
      type: 'meeting',
      title: 'Discovery Call Scheduled',
      description: 'Discovery call scheduled with prospect',
      date: lead.discoveryCallDate,
      icon: IconCalendar,
      color: 'purple',
    });
  }

  return (
    <Stack gap="md">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <Box>
          <Group gap="xs" mb="xs">
            <Text size="xl" fw={700}>
              {lead.companyName}
            </Text>
            <Badge color={getStatusColor(lead.status)} variant="light">
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </Badge>
          </Group>
          <Text c="dimmed" size="sm">
            {lead.contactName}
          </Text>
        </Box>
        <Button leftSection={<IconEdit size={16} />} onClick={onEdit}>
          Edit Lead
        </Button>
      </Group>

      <Divider />

      {/* AI Lead Score */}
      {aiScore && (
        <Card withBorder style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' }}>
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Group gap="xs">
                <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'violet', to: 'blue' }}>
                  <IconSparkles size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={700} size="lg">AI Lead Score</Text>
                  <Text size="xs" c="dimmed">Powered by machine learning</Text>
                </div>
              </Group>
              <Badge size="lg" variant="gradient" gradient={{ from: 'violet', to: 'blue' }}>
                {aiScore.overallScore}/100
              </Badge>
            </Group>

            <SimpleGrid cols={3} spacing="sm">
              <Box>
                <Text size="xs" c="dimmed" mb={4}>Conversion Probability</Text>
                <Text fw={700} size="lg" c="green">{aiScore.conversionProbability}%</Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed" mb={4}>Predicted Revenue</Text>
                <Text fw={700} size="lg">${aiScore.predictedRevenue.toLocaleString()}</Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed" mb={4}>Expected Close</Text>
                <Text fw={700} size="sm">
                  {aiScore.expectedCloseDate ? aiScore.expectedCloseDate.toLocaleDateString() : 'TBD'}
                </Text>
              </Box>
            </SimpleGrid>

            <Progress.Root size="xl">
              <Progress.Section value={aiScore.engagementScore / 3} color="blue">
                <Progress.Label>Engagement</Progress.Label>
              </Progress.Section>
              <Progress.Section value={aiScore.behaviorScore / 3} color="violet">
                <Progress.Label>Behavior</Progress.Label>
              </Progress.Section>
              <Progress.Section value={aiScore.demographicScore / 3} color="teal">
                <Progress.Label>Demographics</Progress.Label>
              </Progress.Section>
            </Progress.Root>

            <Alert 
              icon={<IconBulb size={16} />} 
              title="AI Recommendations" 
              color="violet"
              variant="light"
            >
              <List size="sm" spacing="xs">
                {aiScore.recommendations.slice(0, 3).map((rec, idx) => (
                  <List.Item key={idx}>{rec}</List.Item>
                ))}
              </List>
            </Alert>
          </Stack>
        </Card>
      )}

      {/* Traditional Lead Score */}
      <Card withBorder>
        <Group justify="space-between" mb="xs">
          <Group gap="xs">
            <ThemeIcon color={getScoreColor(lead.score)} variant="light">
              <IconTrendingUp size={16} />
            </ThemeIcon>
            <Text fw={600}>Traditional Lead Score</Text>
          </Group>
          <Text fw={700} size="lg" c={getScoreColor(lead.score)}>
            {lead.score}/100
          </Text>
        </Group>
        <Progress
          value={lead.score}
          color={getScoreColor(lead.score)}
          size="lg"
          radius="xl"
        />
      </Card>

      {/* Contact Information */}
      <SimpleGrid cols={2} spacing="md">
        <Card withBorder>
          <Stack gap="xs">
            <Group gap="xs">
              <ThemeIcon variant="light" color="blue">
                <IconUser size={16} />
              </ThemeIcon>
              <Text fw={600} size="sm">Contact Information</Text>
            </Group>
            <Stack gap={4}>
              <Group gap="xs">
                <IconMail size={14} />
                <Text size="sm">{lead.email}</Text>
              </Group>
              <Group gap="xs">
                <IconPhone size={14} />
                <Text size="sm">{lead.phone}</Text>
              </Group>
              <Group gap="xs">
                <IconBuilding size={14} />
                <Text size="sm">{lead.companyName}</Text>
              </Group>
            </Stack>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="xs">
            <Group gap="xs">
              <ThemeIcon variant="light" color="green">
                <IconNotes size={16} />
              </ThemeIcon>
              <Text fw={600} size="sm">Lead Details</Text>
            </Group>
            <Stack gap={4}>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Source:</Text>
                <Badge size="sm" color={getSourceColor(lead.source)} variant="light">
                  {lead.source.replace('_', ' ')}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Assigned to:</Text>
                <Text size="sm">{lead.assignedTo}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Created:</Text>
                <Text size="sm">{new Date(lead.createdAt).toLocaleDateString()}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Last Updated:</Text>
                <Text size="sm">{new Date(lead.updatedAt).toLocaleDateString()}</Text>
              </Group>
            </Stack>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Notes */}
      {lead.notes && (
        <Card withBorder>
          <Group gap="xs" mb="xs">
            <ThemeIcon variant="light" color="yellow">
              <IconNotes size={16} />
            </ThemeIcon>
            <Text fw={600} size="sm">Notes</Text>
          </Group>
          <Text size="sm" c="dimmed">
            {lead.notes}
          </Text>
        </Card>
      )}

      {/* Discovery Call Information */}
      {lead.discoveryCallDate && (
        <Card withBorder>
          <Group gap="xs" mb="xs">
            <ThemeIcon variant="light" color="purple">
              <IconCalendar size={16} />
            </ThemeIcon>
            <Text fw={600} size="sm">Discovery Call</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Scheduled for:</Text>
            <Text size="sm" fw={500}>
              {new Date(lead.discoveryCallDate).toLocaleString()}
            </Text>
          </Group>
        </Card>
      )}

      {/* Customer Information Sheet */}
      {lead.cisSubmittedDate && (
        <Card withBorder>
          <Group gap="xs" mb="xs">
            <ThemeIcon variant="light" color="green">
              <IconCheck size={16} />
            </ThemeIcon>
            <Text fw={600} size="sm">Customer Information Sheet</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Submitted:</Text>
            <Text size="sm" fw={500}>
              {new Date(lead.cisSubmittedDate).toLocaleString()}
            </Text>
          </Group>
        </Card>
      )}

      {/* Activity Timeline */}
      <Card withBorder>
        <Group gap="xs" mb="md">
          <ThemeIcon variant="light" color="indigo">
            <IconClock size={16} />
          </ThemeIcon>
          <Text fw={600} size="sm">Activity Timeline</Text>
        </Group>
        <Timeline active={mockActivities.length - 1} bulletSize={24} lineWidth={2}>
          {mockActivities.map((activity) => (
            <Timeline.Item
              key={activity.id}
              bullet={
                <ThemeIcon size={24} color={activity.color} variant="light">
                  <activity.icon size={12} />
                </ThemeIcon>
              }
              title={activity.title}
            >
              <Text c="dimmed" size="sm">
                {activity.description}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                {new Date(activity.date).toLocaleString()}
              </Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* Action Buttons */}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Close
        </Button>
        <Button leftSection={<IconPhone size={16} />}>
          Call Lead
        </Button>
        <Button leftSection={<IconMail size={16} />}>
          Send Email
        </Button>
        <Button leftSection={<IconCalendar size={16} />}>
          Schedule Meeting
        </Button>
      </Group>
    </Stack>
  );
}
// AI Lead Score Badge Component
'use client';

import { Badge, Group, Tooltip, ThemeIcon, Progress, Text, Stack } from '@mantine/core';
import { IconSparkles, IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react';
import { AILeadScore } from '@/types/ai';

interface AILeadScoreBadgeProps {
  score: AILeadScore;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function AILeadScoreBadge({ score, size = 'sm', showDetails = false }: AILeadScoreBadgeProps) {
  const getScoreColor = (value: number) => {
    if (value >= 75) return 'green';
    if (value >= 50) return 'yellow';
    if (value >= 25) return 'orange';
    return 'red';
  };

  const getScoreLabel = (value: number) => {
    if (value >= 75) return 'Hot Lead';
    if (value >= 50) return 'Warm Lead';
    if (value >= 25) return 'Cool Lead';
    return 'Cold Lead';
  };

  const getTrendIcon = (factors: any[]) => {
    const positiveCount = factors.filter(f => f.impact === 'positive').length;
    const negativeCount = factors.filter(f => f.impact === 'negative').length;
    
    if (positiveCount > negativeCount) return <IconTrendingUp size={14} />;
    if (negativeCount > positiveCount) return <IconTrendingDown size={14} />;
    return <IconMinus size={14} />;
  };

  if (!showDetails) {
    return (
      <Tooltip
        label={
          <Stack gap={4}>
            <Text size="xs" fw={600}>AI Lead Score: {score.overallScore}/100</Text>
            <Text size="xs">Conversion Probability: {score.conversionProbability}%</Text>
            <Text size="xs">Confidence: {score.confidence}</Text>
          </Stack>
        }
        withinPortal
      >
        <Badge
          size={size}
          color={getScoreColor(score.overallScore)}
          variant="light"
          leftSection={<IconSparkles size={14} />}
        >
          {score.overallScore}
        </Badge>
      </Tooltip>
    );
  }

  return (
    <Group gap="xs" wrap="nowrap">
      <ThemeIcon 
        size="lg" 
        radius="md" 
        variant="light" 
        color={getScoreColor(score.overallScore)}
      >
        <IconSparkles size={20} />
      </ThemeIcon>
      <Stack gap={4} style={{ flex: 1 }}>
        <Group justify="space-between" gap="xs">
          <Text size="sm" fw={600}>{getScoreLabel(score.overallScore)}</Text>
          <Badge size="xs" color={getScoreColor(score.overallScore)} variant="filled">
            {score.overallScore}/100
          </Badge>
        </Group>
        <Progress 
          value={score.overallScore} 
          color={getScoreColor(score.overallScore)}
          size="sm"
          radius="xl"
        />
        <Group gap="xs">
          <Badge size="xs" variant="dot" color="blue">
            {score.conversionProbability}% Conv.
          </Badge>
          <Badge size="xs" variant="outline" color="gray" leftSection={getTrendIcon(score.factors)}>
            {score.confidence}
          </Badge>
        </Group>
      </Stack>
    </Group>
  );
}

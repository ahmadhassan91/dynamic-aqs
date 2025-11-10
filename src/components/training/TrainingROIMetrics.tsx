'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Badge,
  Stack,
  Grid,
  Select,
  Progress,
  ThemeIcon,
  SimpleGrid,
  RingProgress,
  Center,
  Tooltip,
  NumberFormatter,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconCurrencyDollar,
  IconUsers,
  IconSchool,
  IconCertificate,
  IconStar,
  IconClock,
  IconTarget,
  IconDownload,
  IconCalculator,
  IconChartLine,
  IconArrowUp,
  IconArrowDown,
  IconMinus,
  IconPercentage,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface ROIMetrics {
  totalInvestment: number;
  trainingCosts: number;
  trainerCosts: number;
  materialCosts: number;
  opportunityCosts: number;
  
  totalReturns: number;
  productivityGains: number;
  qualityImprovements: number;
  customerSatisfactionGains: number;
  retentionSavings: number;
  
  roi: number;
  roiPercentage: number;
  paybackPeriod: number; // in months
  
  effectivenessMetrics: {
    completionRate: number;
    averageRating: number;
    knowledgeRetention: number;
    skillApplication: number;
    behaviorChange: number;
  };
  
  businessImpact: {
    salesIncrease: number;
    errorReduction: number;
    timeToCompetency: number;
    employeeEngagement: number;
    customerSatisfaction: number;
  };
}

export function TrainingROIMetrics() {
  const { trainingSessions, customers, users } = useMockData();
  const [dateRange, setDateRange] = useState<string>('last_year');
  const [metricType, setMetricType] = useState<string>('financial');

  // Calculate ROI metrics
  const roiMetrics = useMemo((): ROIMetrics => {
    // Filter sessions based on date range
    const now = new Date();
    let startDate: Date;
    
    switch (dateRange) {
      case 'last_quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'last_6_months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case 'last_year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      case 'last_2_years':
        startDate = new Date(now.getFullYear() - 2, now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    }

    const filteredSessions = trainingSessions.filter(s => s.scheduledDate >= startDate);
    const completedSessions = filteredSessions.filter(s => s.status === 'completed');

    // Calculate costs (mock calculations)
    const totalHours = completedSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    const averageTrainerRate = 75; // $75/hour
    const averageMaterialCost = 50; // $50 per session
    const averageOpportunityCost = 25; // $25/hour for attendee time
    
    const trainerCosts = totalHours * averageTrainerRate;
    const materialCosts = completedSessions.length * averageMaterialCost;
    const opportunityCosts = totalHours * averageOpportunityCost * 
      (completedSessions.reduce((sum, s) => sum + s.attendees.length, 0) / completedSessions.length || 1);
    const trainingCosts = trainerCosts + materialCosts;
    const totalInvestment = trainingCosts + opportunityCosts;

    // Calculate returns (mock calculations based on industry benchmarks)
    const productivityGainPerHour = 150; // $150 productivity gain per training hour
    const qualityImprovementValue = 200; // $200 per session in quality improvements
    const customerSatisfactionValue = 100; // $100 per session in customer satisfaction
    const retentionSavingPerCertification = 2000; // $2000 saved per certification (reduced turnover)
    
    const productivityGains = totalHours * productivityGainPerHour;
    const qualityImprovements = completedSessions.length * qualityImprovementValue;
    const customerSatisfactionGains = completedSessions.length * customerSatisfactionValue;
    const certificationsEarned = completedSessions.filter(s => s.certificationAwarded).length;
    const retentionSavings = certificationsEarned * retentionSavingPerCertification;
    
    const totalReturns = productivityGains + qualityImprovements + customerSatisfactionGains + retentionSavings;

    // Calculate ROI
    const roi = totalInvestment > 0 ? (totalReturns - totalInvestment) / totalInvestment : 0;
    const roiPercentage = roi * 100;
    const paybackPeriod = totalReturns > 0 ? (totalInvestment / (totalReturns / 12)) : 0; // months

    // Calculate effectiveness metrics
    const completionRate = filteredSessions.length > 0 ? 
      (completedSessions.length / filteredSessions.length) * 100 : 0;
    
    const ratingsSum = completedSessions
      .filter(s => s.feedback?.rating)
      .reduce((sum, s) => sum + (s.feedback?.rating || 0), 0);
    const averageRating = completedSessions.filter(s => s.feedback?.rating).length > 0 ? 
      ratingsSum / completedSessions.filter(s => s.feedback?.rating).length : 0;

    // Mock effectiveness metrics (would be measured through assessments and surveys)
    const knowledgeRetention = 85; // 85% knowledge retention rate
    const skillApplication = 78; // 78% skill application rate
    const behaviorChange = 72; // 72% behavior change rate

    // Mock business impact metrics
    const salesIncrease = 12; // 12% sales increase
    const errorReduction = 25; // 25% error reduction
    const timeToCompetency = 30; // 30% faster time to competency
    const employeeEngagement = 18; // 18% increase in engagement
    const customerSatisfaction = 15; // 15% increase in customer satisfaction

    return {
      totalInvestment,
      trainingCosts,
      trainerCosts,
      materialCosts,
      opportunityCosts,
      totalReturns,
      productivityGains,
      qualityImprovements,
      customerSatisfactionGains,
      retentionSavings,
      roi,
      roiPercentage,
      paybackPeriod,
      effectivenessMetrics: {
        completionRate,
        averageRating: (averageRating / 5) * 100, // Convert to percentage
        knowledgeRetention,
        skillApplication,
        behaviorChange,
      },
      businessImpact: {
        salesIncrease,
        errorReduction,
        timeToCompetency,
        employeeEngagement,
        customerSatisfaction,
      },
    };
  }, [trainingSessions, dateRange]);

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'green';
    if (roi >= 100) return 'yellow';
    if (roi >= 0) return 'orange';
    return 'red';
  };

  const getMetricColor = (value: number, threshold: number = 70) => {
    if (value >= threshold + 20) return 'green';
    if (value >= threshold) return 'yellow';
    if (value >= threshold - 20) return 'orange';
    return 'red';
  };

  const getTrendIcon = (value: number, isPositive: boolean = true) => {
    const threshold = isPositive ? 0 : 100;
    if ((isPositive && value > threshold) || (!isPositive && value < threshold)) {
      return { icon: IconArrowUp, color: 'green' };
    }
    if ((isPositive && value < threshold) || (!isPositive && value > threshold)) {
      return { icon: IconArrowDown, color: 'red' };
    }
    return { icon: IconMinus, color: 'gray' };
  };

  const dateRangeOptions = [
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'last_2_years', label: 'Last 2 Years' },
  ];

  const metricTypeOptions = [
    { value: 'financial', label: 'Financial Metrics' },
    { value: 'effectiveness', label: 'Effectiveness Metrics' },
    { value: 'business_impact', label: 'Business Impact' },
  ];

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Training ROI & Effectiveness Metrics</Title>
          <Text c="dimmed" size="sm">
            Measure the return on investment and effectiveness of training programs
          </Text>
        </div>
        <Group gap="sm">
          <Select
            data={dateRangeOptions}
            value={dateRange}
            onChange={(value) => setDateRange(value || 'last_year')}
            w={150}
          />
          <Select
            data={metricTypeOptions}
            value={metricType}
            onChange={(value) => setMetricType(value || 'financial')}
            w={180}
          />
          <Button leftSection={<IconDownload size={16} />}>
            Export Report
          </Button>
        </Group>
      </Group>

      {/* ROI Overview */}
      <Grid>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card withBorder p="lg">
            <Title order={4} mb="md">Return on Investment Overview</Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Card withBorder p="md" ta="center">
                  <ThemeIcon color="red" variant="light" size="xl" mx="auto" mb="sm">
                    <IconCurrencyDollar size={24} />
                  </ThemeIcon>
                  <Text size="xl" fw={700} c="red">
                    <NumberFormatter value={roiMetrics.totalInvestment} prefix="$" thousandSeparator />
                  </Text>
                  <Text size="sm" c="dimmed">
                    Total Investment
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Card withBorder p="md" ta="center">
                  <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
                    <IconTrendingUp size={24} />
                  </ThemeIcon>
                  <Text size="xl" fw={700} c="green">
                    <NumberFormatter value={roiMetrics.totalReturns} prefix="$" thousandSeparator />
                  </Text>
                  <Text size="sm" c="dimmed">
                    Total Returns
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>

            <Card withBorder p="md" mt="md">
              <Group justify="space-between" mb="md">
                <Text fw={500}>Net ROI</Text>
                <Group gap="xs">
                  {(() => {
                    const trend = getTrendIcon(roiMetrics.roiPercentage);
                    const TrendIcon = trend.icon;
                    return (
                      <>
                        <TrendIcon size={16} color={trend.color} />
                        <Text fw={700} c={getROIColor(roiMetrics.roiPercentage)}>
                          {roiMetrics.roiPercentage.toFixed(1)}%
                        </Text>
                      </>
                    );
                  })()}
                </Group>
              </Group>
              <Progress 
                value={Math.min(roiMetrics.roiPercentage, 300)} 
                color={getROIColor(roiMetrics.roiPercentage)}
                size="lg"
              />
              <Text size="sm" c="dimmed" mt="xs">
                Payback period: {roiMetrics.paybackPeriod.toFixed(1)} months
              </Text>
            </Card>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card withBorder p="lg" h="100%">
            <Title order={4} mb="md">ROI Breakdown</Title>
            <Stack gap="md">
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Productivity Gains</Text>
                  <Text size="sm" fw={500}>
                    <NumberFormatter value={roiMetrics.productivityGains} prefix="$" thousandSeparator />
                  </Text>
                </Group>
                <Progress 
                  value={(roiMetrics.productivityGains / roiMetrics.totalReturns) * 100} 
                  color="blue" 
                  size="sm"
                />
              </div>

              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Quality Improvements</Text>
                  <Text size="sm" fw={500}>
                    <NumberFormatter value={roiMetrics.qualityImprovements} prefix="$" thousandSeparator />
                  </Text>
                </Group>
                <Progress 
                  value={(roiMetrics.qualityImprovements / roiMetrics.totalReturns) * 100} 
                  color="green" 
                  size="sm"
                />
              </div>

              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Customer Satisfaction</Text>
                  <Text size="sm" fw={500}>
                    <NumberFormatter value={roiMetrics.customerSatisfactionGains} prefix="$" thousandSeparator />
                  </Text>
                </Group>
                <Progress 
                  value={(roiMetrics.customerSatisfactionGains / roiMetrics.totalReturns) * 100} 
                  color="orange" 
                  size="sm"
                />
              </div>

              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Retention Savings</Text>
                  <Text size="sm" fw={500}>
                    <NumberFormatter value={roiMetrics.retentionSavings} prefix="$" thousandSeparator />
                  </Text>
                </Group>
                <Progress 
                  value={(roiMetrics.retentionSavings / roiMetrics.totalReturns) * 100} 
                  color="violet" 
                  size="sm"
                />
              </div>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Metrics Based on Selection */}
      {metricType === 'financial' && (
        <Card withBorder p="lg">
          <Title order={4} mb="md">Financial Metrics Breakdown</Title>
          <SimpleGrid cols={{ base: 2, sm: 3, lg: 5 }}>
            <Card withBorder p="md" ta="center">
              <ThemeIcon color="blue" variant="light" size="lg" mx="auto" mb="sm">
                <IconUsers size={20} />
              </ThemeIcon>
              <Text size="lg" fw={700} c="blue">
                <NumberFormatter value={roiMetrics.trainerCosts} prefix="$" thousandSeparator />
              </Text>
              <Text size="sm" c="dimmed">Trainer Costs</Text>
            </Card>

            <Card withBorder p="md" ta="center">
              <ThemeIcon color="orange" variant="light" size="lg" mx="auto" mb="sm">
                <IconSchool size={20} />
              </ThemeIcon>
              <Text size="lg" fw={700} c="orange">
                <NumberFormatter value={roiMetrics.materialCosts} prefix="$" thousandSeparator />
              </Text>
              <Text size="sm" c="dimmed">Material Costs</Text>
            </Card>

            <Card withBorder p="md" ta="center">
              <ThemeIcon color="red" variant="light" size="lg" mx="auto" mb="sm">
                <IconClock size={20} />
              </ThemeIcon>
              <Text size="lg" fw={700} c="red">
                <NumberFormatter value={roiMetrics.opportunityCosts} prefix="$" thousandSeparator />
              </Text>
              <Text size="sm" c="dimmed">Opportunity Costs</Text>
            </Card>

            <Card withBorder p="md" ta="center">
              <ThemeIcon color="green" variant="light" size="lg" mx="auto" mb="sm">
                <IconTrendingUp size={20} />
              </ThemeIcon>
              <Text size="lg" fw={700} c="green">
                <NumberFormatter value={roiMetrics.totalReturns - roiMetrics.totalInvestment} prefix="$" thousandSeparator />
              </Text>
              <Text size="sm" c="dimmed">Net Profit</Text>
            </Card>

            <Card withBorder p="md" ta="center">
              <ThemeIcon color="violet" variant="light" size="lg" mx="auto" mb="sm">
                <IconCalculator size={20} />
              </ThemeIcon>
              <Text size="lg" fw={700} c="violet">
                {roiMetrics.paybackPeriod.toFixed(1)}
              </Text>
              <Text size="sm" c="dimmed">Payback (Months)</Text>
            </Card>
          </SimpleGrid>
        </Card>
      )}

      {metricType === 'effectiveness' && (
        <Card withBorder p="lg">
          <Title order={4} mb="md">Training Effectiveness Metrics</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Card withBorder p="md" ta="center">
                <RingProgress
                  size={120}
                  thickness={12}
                  sections={[
                    { 
                      value: roiMetrics.effectivenessMetrics.completionRate, 
                      color: getMetricColor(roiMetrics.effectivenessMetrics.completionRate, 80)
                    }
                  ]}
                  label={
                    <Center>
                      <Text size="sm" fw={700}>
                        {roiMetrics.effectivenessMetrics.completionRate.toFixed(1)}%
                      </Text>
                    </Center>
                  }
                />
                <Text size="sm" fw={500} mt="sm">Completion Rate</Text>
                <Text size="xs" c="dimmed">Target: 80%</Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Card withBorder p="md" ta="center">
                <RingProgress
                  size={120}
                  thickness={12}
                  sections={[
                    { 
                      value: roiMetrics.effectivenessMetrics.averageRating, 
                      color: getMetricColor(roiMetrics.effectivenessMetrics.averageRating, 70)
                    }
                  ]}
                  label={
                    <Center>
                      <Text size="sm" fw={700}>
                        {roiMetrics.effectivenessMetrics.averageRating.toFixed(1)}%
                      </Text>
                    </Center>
                  }
                />
                <Text size="sm" fw={500} mt="sm">Satisfaction Rating</Text>
                <Text size="xs" c="dimmed">Target: 70%</Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Card withBorder p="md" ta="center">
                <RingProgress
                  size={120}
                  thickness={12}
                  sections={[
                    { 
                      value: roiMetrics.effectivenessMetrics.knowledgeRetention, 
                      color: getMetricColor(roiMetrics.effectivenessMetrics.knowledgeRetention, 75)
                    }
                  ]}
                  label={
                    <Center>
                      <Text size="sm" fw={700}>
                        {roiMetrics.effectivenessMetrics.knowledgeRetention}%
                      </Text>
                    </Center>
                  }
                />
                <Text size="sm" fw={500} mt="sm">Knowledge Retention</Text>
                <Text size="xs" c="dimmed">Target: 75%</Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <Card withBorder p="md" ta="center">
                <RingProgress
                  size={120}
                  thickness={12}
                  sections={[
                    { 
                      value: roiMetrics.effectivenessMetrics.skillApplication, 
                      color: getMetricColor(roiMetrics.effectivenessMetrics.skillApplication, 70)
                    }
                  ]}
                  label={
                    <Center>
                      <Text size="sm" fw={700}>
                        {roiMetrics.effectivenessMetrics.skillApplication}%
                      </Text>
                    </Center>
                  }
                />
                <Text size="sm" fw={500} mt="sm">Skill Application</Text>
                <Text size="xs" c="dimmed">Target: 70%</Text>
              </Card>
            </Grid.Col>
          </Grid>

          <Card withBorder p="md" mt="md">
            <Title order={5} mb="md">Behavior Change Impact</Title>
            <Group justify="space-between" mb="xs">
              <Text size="sm">Behavior Change Rate</Text>
              <Text size="sm" fw={500}>{roiMetrics.effectivenessMetrics.behaviorChange}%</Text>
            </Group>
            <Progress 
              value={roiMetrics.effectivenessMetrics.behaviorChange} 
              color={getMetricColor(roiMetrics.effectivenessMetrics.behaviorChange, 65)}
              size="lg"
            />
            <Text size="xs" c="dimmed" mt="xs">
              Measures sustained behavior change 3 months post-training
            </Text>
          </Card>
        </Card>
      )}

      {metricType === 'business_impact' && (
        <Card withBorder p="lg">
          <Title order={4} mb="md">Business Impact Metrics</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            <Card withBorder p="md">
              <Group gap="sm" mb="md">
                <ThemeIcon color="green" variant="light" size="lg">
                  <IconTrendingUp size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Sales Increase</Text>
                  <Text size="sm" c="dimmed">Post-training performance</Text>
                </div>
              </Group>
              <Group justify="space-between" mb="xs">
                <Text size="lg" fw={700} c="green">+{roiMetrics.businessImpact.salesIncrease}%</Text>
                {(() => {
                  const trend = getTrendIcon(roiMetrics.businessImpact.salesIncrease);
                  const TrendIcon = trend.icon;
                  return <TrendIcon size={20} color={trend.color} />;
                })()}
              </Group>
              <Progress value={roiMetrics.businessImpact.salesIncrease * 2} color="green" size="sm" />
            </Card>

            <Card withBorder p="md">
              <Group gap="sm" mb="md">
                <ThemeIcon color="red" variant="light" size="lg">
                  <IconTrendingDown size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Error Reduction</Text>
                  <Text size="sm" c="dimmed">Quality improvements</Text>
                </div>
              </Group>
              <Group justify="space-between" mb="xs">
                <Text size="lg" fw={700} c="green">-{roiMetrics.businessImpact.errorReduction}%</Text>
                <IconArrowDown size={20} color="green" />
              </Group>
              <Progress value={roiMetrics.businessImpact.errorReduction * 2} color="green" size="sm" />
            </Card>

            <Card withBorder p="md">
              <Group gap="sm" mb="md">
                <ThemeIcon color="blue" variant="light" size="lg">
                  <IconTarget size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Time to Competency</Text>
                  <Text size="sm" c="dimmed">Faster skill development</Text>
                </div>
              </Group>
              <Group justify="space-between" mb="xs">
                <Text size="lg" fw={700} c="blue">-{roiMetrics.businessImpact.timeToCompetency}%</Text>
                <IconArrowDown size={20} color="green" />
              </Group>
              <Progress value={roiMetrics.businessImpact.timeToCompetency * 2} color="blue" size="sm" />
            </Card>

            <Card withBorder p="md">
              <Group gap="sm" mb="md">
                <ThemeIcon color="orange" variant="light" size="lg">
                  <IconUsers size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Employee Engagement</Text>
                  <Text size="sm" c="dimmed">Satisfaction & retention</Text>
                </div>
              </Group>
              <Group justify="space-between" mb="xs">
                <Text size="lg" fw={700} c="orange">+{roiMetrics.businessImpact.employeeEngagement}%</Text>
                <IconArrowUp size={20} color="green" />
              </Group>
              <Progress value={roiMetrics.businessImpact.employeeEngagement * 2} color="orange" size="sm" />
            </Card>

            <Card withBorder p="md">
              <Group gap="sm" mb="md">
                <ThemeIcon color="yellow" variant="light" size="lg">
                  <IconStar size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Customer Satisfaction</Text>
                  <Text size="sm" c="dimmed">Service quality impact</Text>
                </div>
              </Group>
              <Group justify="space-between" mb="xs">
                <Text size="lg" fw={700} c="yellow">+{roiMetrics.businessImpact.customerSatisfaction}%</Text>
                <IconArrowUp size={20} color="green" />
              </Group>
              <Progress value={roiMetrics.businessImpact.customerSatisfaction * 2} color="yellow" size="sm" />
            </Card>

            <Card withBorder p="md">
              <Group gap="sm" mb="md">
                <ThemeIcon color="violet" variant="light" size="lg">
                  <IconPercentage size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Overall ROI</Text>
                  <Text size="sm" c="dimmed">Combined impact</Text>
                </div>
              </Group>
              <Group justify="space-between" mb="xs">
                <Text size="lg" fw={700} c={getROIColor(roiMetrics.roiPercentage)}>
                  {roiMetrics.roiPercentage.toFixed(1)}%
                </Text>
                {(() => {
                  const trend = getTrendIcon(roiMetrics.roiPercentage);
                  const TrendIcon = trend.icon;
                  return <TrendIcon size={20} color={trend.color} />;
                })()}
              </Group>
              <Progress 
                value={Math.min(roiMetrics.roiPercentage, 300)} 
                color={getROIColor(roiMetrics.roiPercentage)} 
                size="sm" 
              />
            </Card>
          </SimpleGrid>
        </Card>
      )}

      {/* Key Insights */}
      <Card withBorder p="lg">
        <Title order={4} mb="md">Key Insights & Recommendations</Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text fw={500} size="sm" c="green">✓ Strong Performance Areas</Text>
              <Text size="sm">
                • ROI of {roiMetrics.roiPercentage.toFixed(1)}% exceeds industry benchmark of 150%
              </Text>
              <Text size="sm">
                • Knowledge retention rate of {roiMetrics.effectivenessMetrics.knowledgeRetention}% is above target
              </Text>
              <Text size="sm">
                • Customer satisfaction improved by {roiMetrics.businessImpact.customerSatisfaction}%
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Text fw={500} size="sm" c="orange">⚠ Areas for Improvement</Text>
              <Text size="sm">
                • Focus on increasing completion rates to reach 85% target
              </Text>
              <Text size="sm">
                • Enhance skill application tracking and follow-up programs
              </Text>
              <Text size="sm">
                • Consider reducing opportunity costs through more efficient delivery
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
    </Stack>
  );
}
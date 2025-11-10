'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Stack,
  Badge,
  Grid,
  Select,
  NumberInput,
  Table,
  ThemeIcon,
  SimpleGrid,
  Progress,
  Alert,
  Tabs,
  RingProgress,
  Center,
} from '@mantine/core';
import {
  IconCalculator,
  IconTrendingUp,
  IconCurrencyDollar,
  IconClock,
  IconUsers,
  IconTarget,
  IconDownload,
  IconChartBar,
  IconAlertTriangle,
  IconCheck,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface TrainingROICalculatorProps {
  customerId?: string;
  trainerId?: string;
}

interface ROIMetrics {
  totalInvestment: number;
  totalBenefits: number;
  netBenefit: number;
  roiPercentage: number;
  paybackPeriod: number; // months
  breakEvenPoint: Date;
}

interface CostBreakdown {
  trainerCosts: number;
  materialCosts: number;
  facilityCosts: number;
  technologyCosts: number;
  opportunityCosts: number;
  administrativeCosts: number;
}

interface BenefitBreakdown {
  productivityGains: number;
  qualityImprovements: number;
  complianceValue: number;
  retentionSavings: number;
  revenueIncrease: number;
  costReductions: number;
}

export function TrainingROICalculator({ customerId, trainerId }: TrainingROICalculatorProps) {
  const { trainingSessions, customers, users } = useMockData();
  const [activeTab, setActiveTab] = useState<string | null>('calculator');
  const [timeRange, setTimeRange] = useState<string>('last_12_months');
  
  // ROI Calculation Parameters
  const [avgTrainerHourlyRate, setAvgTrainerHourlyRate] = useState(75);
  const [avgParticipantHourlyRate, setAvgParticipantHourlyRate] = useState(35);
  const [materialCostPerSession, setMaterialCostPerSession] = useState(50);
  const [facilityCostPerHour, setFacilityCostPerHour] = useState(25);
  const [technologyCostPerSession, setTechnologyCostPerSession] = useState(30);
  const [adminCostPercentage, setAdminCostPercentage] = useState(15);
  
  // Benefit Parameters
  const [productivityImprovementPercent, setProductivityImprovementPercent] = useState(12);
  const [qualityImprovementValue, setQualityImprovementValue] = useState(2500);
  const [complianceValuePerCert, setComplianceValuePerCert] = useState(1500);
  const [retentionImprovementPercent, setRetentionImprovementPercent] = useState(8);
  const [avgReplacementCost, setAvgReplacementCost] = useState(15000);
  const [revenueImprovementPercent, setRevenueImprovementPercent] = useState(5);

  // Filter training sessions
  const filteredSessions = useMemo(() => {
    let sessions = trainingSessions.filter(s => s.status === 'completed');
    
    if (customerId) {
      sessions = sessions.filter(s => s.customerId === customerId);
    }
    
    if (trainerId) {
      sessions = sessions.filter(s => s.trainerId === trainerId);
    }

    // Apply time range filter
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'last_6_months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'last_12_months':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'last_24_months':
        startDate.setFullYear(now.getFullYear() - 2);
        break;
      default:
        startDate.setFullYear(now.getFullYear() - 1);
    }

    return sessions.filter(s => 
      s.completedDate && s.completedDate >= startDate
    );
  }, [trainingSessions, customerId, trainerId, timeRange]);

  // Calculate cost breakdown
  const costBreakdown = useMemo(() => {
    const totalTrainingHours = filteredSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    const totalParticipants = filteredSessions.reduce((sum, s) => sum + s.attendees.length, 0);
    const totalSessions = filteredSessions.length;

    const trainerCosts = totalTrainingHours * avgTrainerHourlyRate;
    const materialCosts = totalSessions * materialCostPerSession;
    const facilityCosts = totalTrainingHours * facilityCostPerHour;
    const technologyCosts = totalSessions * technologyCostPerSession;
    const opportunityCosts = totalTrainingHours * totalParticipants * avgParticipantHourlyRate;
    
    const subtotal = trainerCosts + materialCosts + facilityCosts + technologyCosts + opportunityCosts;
    const administrativeCosts = subtotal * (adminCostPercentage / 100);

    return {
      trainerCosts,
      materialCosts,
      facilityCosts,
      technologyCosts,
      opportunityCosts,
      administrativeCosts,
    };
  }, [filteredSessions, avgTrainerHourlyRate, avgParticipantHourlyRate, materialCostPerSession, 
      facilityCostPerHour, technologyCostPerSession, adminCostPercentage]);

  // Calculate benefit breakdown
  const benefitBreakdown = useMemo(() => {
    const totalParticipants = filteredSessions.reduce((sum, s) => sum + s.attendees.length, 0);
    const totalCertifications = filteredSessions.filter(s => s.certificationAwarded).length;
    const avgAnnualSalary = avgParticipantHourlyRate * 2080; // 40 hours/week * 52 weeks
    
    // Productivity gains
    const productivityGains = totalParticipants * avgAnnualSalary * (productivityImprovementPercent / 100);
    
    // Quality improvements (reduced errors, rework, etc.)
    const qualityImprovements = totalParticipants * qualityImprovementValue;
    
    // Compliance value
    const complianceValue = totalCertifications * complianceValuePerCert;
    
    // Retention savings
    const retentionSavings = totalParticipants * (retentionImprovementPercent / 100) * avgReplacementCost;
    
    // Revenue increase (for sales training)
    const salesTrainingSessions = filteredSessions.filter(s => s.type === 'sales').length;
    const revenueIncrease = salesTrainingSessions * avgAnnualSalary * (revenueImprovementPercent / 100);
    
    // Cost reductions (efficiency improvements)
    const costReductions = totalParticipants * avgAnnualSalary * 0.03; // 3% cost reduction

    return {
      productivityGains,
      qualityImprovements,
      complianceValue,
      retentionSavings,
      revenueIncrease,
      costReductions,
    };
  }, [filteredSessions, avgParticipantHourlyRate, productivityImprovementPercent, 
      qualityImprovementValue, complianceValuePerCert, retentionImprovementPercent, 
      avgReplacementCost, revenueImprovementPercent]);

  // Calculate ROI metrics
  const roiMetrics = useMemo(() => {
    const totalInvestment = Object.values(costBreakdown).reduce((sum, cost) => sum + cost, 0);
    const totalBenefits = Object.values(benefitBreakdown).reduce((sum, benefit) => sum + benefit, 0);
    const netBenefit = totalBenefits - totalInvestment;
    const roiPercentage = totalInvestment > 0 ? (netBenefit / totalInvestment) * 100 : 0;
    
    // Calculate payback period (months)
    const monthlyBenefit = totalBenefits / 12; // Assuming benefits are annual
    const paybackPeriod = monthlyBenefit > 0 ? totalInvestment / monthlyBenefit : 0;
    
    // Calculate break-even point
    const breakEvenPoint = new Date();
    breakEvenPoint.setMonth(breakEvenPoint.getMonth() + Math.ceil(paybackPeriod));

    return {
      totalInvestment,
      totalBenefits,
      netBenefit,
      roiPercentage,
      paybackPeriod,
      breakEvenPoint,
    };
  }, [costBreakdown, benefitBreakdown]);

  // Training type ROI analysis
  const typeROIAnalysis = useMemo(() => {
    const types = ['installation', 'maintenance', 'sales', 'product_knowledge'];
    
    return types.map(type => {
      const typeSessions = filteredSessions.filter(s => s.type === type);
      const typeParticipants = typeSessions.reduce((sum, s) => sum + s.attendees.length, 0);
      const typeCertifications = typeSessions.filter(s => s.certificationAwarded).length;
      
      // Simplified ROI calculation per type
      const typeCosts = typeSessions.length * 500; // Average cost per session
      const typeBenefits = typeParticipants * 2000; // Average benefit per participant
      const typeROI = typeCosts > 0 ? ((typeBenefits - typeCosts) / typeCosts) * 100 : 0;
      
      return {
        type,
        name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        sessions: typeSessions.length,
        participants: typeParticipants,
        certifications: typeCertifications,
        investment: typeCosts,
        benefits: typeBenefits,
        roi: typeROI,
      };
    }).filter(t => t.sessions > 0);
  }, [filteredSessions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'green';
    if (roi >= 100) return 'teal';
    if (roi >= 50) return 'orange';
    return 'red';
  };

  return (
    <Stack gap="lg">
      {/* Controls */}
      <Card withBorder p="md">
        <Group justify="space-between">
          <Title order={3}>Training ROI Calculator</Title>
          <Group gap="sm">
            <Select
              placeholder="Time Range"
              data={[
                { value: 'last_6_months', label: 'Last 6 Months' },
                { value: 'last_12_months', label: 'Last 12 Months' },
                { value: 'last_24_months', label: 'Last 24 Months' },
              ]}
              value={timeRange}
              onChange={(value) => setTimeRange(value || 'last_12_months')}
              w={150}
            />
            <Button leftSection={<IconDownload size={16} />} variant="light">
              Export ROI Report
            </Button>
          </Group>
        </Group>
      </Card>

      {/* ROI Summary */}
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 5 }}>
        <Card withBorder p="md" ta="center">
          <ThemeIcon color="blue" variant="light" size="xl" mx="auto" mb="sm">
            <IconCurrencyDollar size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="blue">
            {formatCurrency(roiMetrics.totalInvestment)}
          </Text>
          <Text size="sm" c="dimmed">
            Total Investment
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="green" variant="light" size="xl" mx="auto" mb="sm">
            <IconTrendingUp size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="green">
            {formatCurrency(roiMetrics.totalBenefits)}
          </Text>
          <Text size="sm" c="dimmed">
            Total Benefits
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color={getROIColor(roiMetrics.roiPercentage)} variant="light" size="xl" mx="auto" mb="sm">
            <IconCalculator size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c={getROIColor(roiMetrics.roiPercentage)}>
            {roiMetrics.roiPercentage.toFixed(0)}%
          </Text>
          <Text size="sm" c="dimmed">
            ROI Percentage
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="orange" variant="light" size="xl" mx="auto" mb="sm">
            <IconClock size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="orange">
            {roiMetrics.paybackPeriod.toFixed(1)}
          </Text>
          <Text size="sm" c="dimmed">
            Payback (Months)
          </Text>
        </Card>

        <Card withBorder p="md" ta="center">
          <ThemeIcon color="violet" variant="light" size="xl" mx="auto" mb="sm">
            <IconTarget size={24} />
          </ThemeIcon>
          <Text size="xl" fw={700} c="violet">
            {formatCurrency(roiMetrics.netBenefit)}
          </Text>
          <Text size="sm" c="dimmed">
            Net Benefit
          </Text>
        </Card>
      </SimpleGrid>

      {/* Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="calculator" leftSection={<IconCalculator size={16} />}>
            ROI Calculator
          </Tabs.Tab>
          <Tabs.Tab value="breakdown" leftSection={<IconChartBar size={16} />}>
            Cost/Benefit Breakdown
          </Tabs.Tab>
          <Tabs.Tab value="analysis" leftSection={<IconTrendingUp size={16} />}>
            Type Analysis
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="calculator" pt="lg">
          <Grid>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Cost Parameters</Title>
                <Stack gap="md">
                  <NumberInput
                    label="Average Trainer Hourly Rate"
                    value={avgTrainerHourlyRate}
                    onChange={(value) => setAvgTrainerHourlyRate(Number(value) || 0)}
                    prefix="$"
                    min={0}
                  />
                  <NumberInput
                    label="Average Participant Hourly Rate"
                    value={avgParticipantHourlyRate}
                    onChange={(value) => setAvgParticipantHourlyRate(Number(value) || 0)}
                    prefix="$"
                    min={0}
                  />
                  <NumberInput
                    label="Material Cost per Session"
                    value={materialCostPerSession}
                    onChange={(value) => setMaterialCostPerSession(Number(value) || 0)}
                    prefix="$"
                    min={0}
                  />
                  <NumberInput
                    label="Facility Cost per Hour"
                    value={facilityCostPerHour}
                    onChange={(value) => setFacilityCostPerHour(Number(value) || 0)}
                    prefix="$"
                    min={0}
                  />
                  <NumberInput
                    label="Technology Cost per Session"
                    value={technologyCostPerSession}
                    onChange={(value) => setTechnologyCostPerSession(Number(value) || 0)}
                    prefix="$"
                    min={0}
                  />
                  <NumberInput
                    label="Administrative Cost Percentage"
                    value={adminCostPercentage}
                    onChange={(value) => setAdminCostPercentage(Number(value) || 0)}
                    suffix="%"
                    min={0}
                    max={50}
                  />
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Benefit Parameters</Title>
                <Stack gap="md">
                  <NumberInput
                    label="Productivity Improvement %"
                    value={productivityImprovementPercent}
                    onChange={(value) => setProductivityImprovementPercent(Number(value) || 0)}
                    suffix="%"
                    min={0}
                    max={100}
                  />
                  <NumberInput
                    label="Quality Improvement Value per Person"
                    value={qualityImprovementValue}
                    onChange={(value) => setQualityImprovementValue(Number(value) || 0)}
                    prefix="$"
                    min={0}
                  />
                  <NumberInput
                    label="Compliance Value per Certification"
                    value={complianceValuePerCert}
                    onChange={(value) => setComplianceValuePerCert(Number(value) || 0)}
                    prefix="$"
                    min={0}
                  />
                  <NumberInput
                    label="Retention Improvement %"
                    value={retentionImprovementPercent}
                    onChange={(value) => setRetentionImprovementPercent(Number(value) || 0)}
                    suffix="%"
                    min={0}
                    max={100}
                  />
                  <NumberInput
                    label="Average Replacement Cost"
                    value={avgReplacementCost}
                    onChange={(value) => setAvgReplacementCost(Number(value) || 0)}
                    prefix="$"
                    min={0}
                  />
                  <NumberInput
                    label="Revenue Improvement % (Sales Training)"
                    value={revenueImprovementPercent}
                    onChange={(value) => setRevenueImprovementPercent(Number(value) || 0)}
                    suffix="%"
                    min={0}
                    max={100}
                  />
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="breakdown" pt="lg">
          <Grid>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Cost Breakdown</Title>
                <Stack gap="md">
                  {Object.entries(costBreakdown).map(([key, value]) => (
                    <Group key={key} justify="space-between">
                      <Text size="sm" tt="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Text>
                      <Text size="sm" fw={500}>
                        {formatCurrency(value)}
                      </Text>
                    </Group>
                  ))}
                  <Group justify="space-between" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
                    <Text fw={700}>Total Investment</Text>
                    <Text fw={700} c="blue">
                      {formatCurrency(roiMetrics.totalInvestment)}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Card withBorder p="lg">
                <Title order={4} mb="md">Benefit Breakdown</Title>
                <Stack gap="md">
                  {Object.entries(benefitBreakdown).map(([key, value]) => (
                    <Group key={key} justify="space-between">
                      <Text size="sm" tt="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Text>
                      <Text size="sm" fw={500}>
                        {formatCurrency(value)}
                      </Text>
                    </Group>
                  ))}
                  <Group justify="space-between" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
                    <Text fw={700}>Total Benefits</Text>
                    <Text fw={700} c="green">
                      {formatCurrency(roiMetrics.totalBenefits)}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          {/* ROI Summary */}
          <Card withBorder p="lg" mt="lg">
            <Title order={4} mb="md">ROI Summary</Title>
            <Grid>
              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Center>
                  <RingProgress
                    size={200}
                    thickness={20}
                    sections={[
                      { 
                        value: Math.min(100, Math.max(0, roiMetrics.roiPercentage)), 
                        color: getROIColor(roiMetrics.roiPercentage) 
                      }
                    ]}
                    label={
                      <Center>
                        <div style={{ textAlign: 'center' }}>
                          <Text size="xl" fw={700} c={getROIColor(roiMetrics.roiPercentage)}>
                            {roiMetrics.roiPercentage.toFixed(0)}%
                          </Text>
                          <Text size="sm" c="dimmed">ROI</Text>
                        </div>
                      </Center>
                    }
                  />
                </Center>
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Stack gap="md">
                  <Alert
                    icon={roiMetrics.roiPercentage >= 100 ? <IconCheck size={16} /> : <IconAlertTriangle size={16} />}
                    color={roiMetrics.roiPercentage >= 100 ? 'green' : 'orange'}
                    variant="light"
                  >
                    <Text fw={500}>
                      {roiMetrics.roiPercentage >= 100 ? 'Positive ROI Achieved' : 'ROI Below Target'}
                    </Text>
                    <Text size="sm">
                      {roiMetrics.roiPercentage >= 100 
                        ? `Training investment is generating ${roiMetrics.roiPercentage.toFixed(0)}% return.`
                        : `Consider optimizing training programs to improve ROI.`
                      }
                    </Text>
                  </Alert>
                  
                  <Group justify="space-between">
                    <div>
                      <Text size="sm" c="dimmed">Break-even Point</Text>
                      <Text fw={500}>
                        {roiMetrics.breakEvenPoint.toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed">Payback Period</Text>
                      <Text fw={500}>
                        {roiMetrics.paybackPeriod.toFixed(1)} months
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed">Net Benefit</Text>
                      <Text fw={500} c={roiMetrics.netBenefit >= 0 ? 'green' : 'red'}>
                        {formatCurrency(roiMetrics.netBenefit)}
                      </Text>
                    </div>
                  </Group>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="analysis" pt="lg">
          <Card withBorder p="md">
            <Title order={4} mb="md">Training Type ROI Analysis</Title>
            <Table.ScrollContainer minWidth={1000}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Training Type</Table.Th>
                    <Table.Th>Sessions</Table.Th>
                    <Table.Th>Participants</Table.Th>
                    <Table.Th>Certifications</Table.Th>
                    <Table.Th>Investment</Table.Th>
                    <Table.Th>Benefits</Table.Th>
                    <Table.Th>ROI</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {typeROIAnalysis.map((type) => (
                    <Table.Tr key={type.type}>
                      <Table.Td>
                        <Text fw={500}>{type.name}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text>{type.sessions}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text>{type.participants}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text>{type.certifications}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text>{formatCurrency(type.investment)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text>{formatCurrency(type.benefits)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="sm">
                          <Badge color={getROIColor(type.roi)} variant="light">
                            {type.roi.toFixed(0)}%
                          </Badge>
                          {type.roi >= 100 ? (
                            <IconArrowUp size={16} color="green" />
                          ) : (
                            <IconArrowDown size={16} color="red" />
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
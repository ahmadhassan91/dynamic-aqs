'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Grid,
  Card,
  Text,
  Badge,
  Stack,
  ActionIcon,
  Menu,
  Paper,
  Box,
  Avatar,
  Tooltip,
  NumberFormatter,
  Tabs,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconPlus,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconBuilding,
  IconUser,
  IconCalendar,
  IconCurrencyDollar,
  IconChartBar,
  IconChartLine,
} from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Link from 'next/link';
import { PipelineAnalyticsDashboard } from '@/components/commercial/PipelineAnalyticsDashboard';

// Mock data for opportunities
const mockOpportunities = [
  {
    id: '1',
    title: 'University Hospital HVAC Upgrade',
    value: 450000,
    probability: 75,
    phase: 'preliminary-quote',
    marketSegment: 'Healthcare',
    buildingOwner: 'University Medical Center',
    engineeringFirm: 'Johnson Controls Engineering',
    manufacturerRep: 'HVAC Solutions Inc.',
    architect: 'Healthcare Design Group',
    expectedCloseDate: '2024-03-15',
    lastActivity: '2024-01-15',
    assignedTo: 'Sarah Johnson',
    description: 'Complete HVAC system replacement for 200-bed hospital facility',
    tags: ['High Priority', 'Healthcare', 'Large Project'],
  },
  {
    id: '2',
    title: 'Tech Campus Phase 2',
    value: 280000,
    probability: 60,
    phase: 'prospect',
    marketSegment: 'Commercial Office',
    buildingOwner: 'TechCorp Industries',
    engineeringFirm: 'Modern MEP Solutions',
    manufacturerRep: 'Commercial HVAC Partners',
    architect: 'Urban Design Associates',
    expectedCloseDate: '2024-04-20',
    lastActivity: '2024-01-12',
    assignedTo: 'Mike Chen',
    description: 'HVAC installation for new 150,000 sq ft office building',
    tags: ['Tech Sector', 'New Construction'],
  },
  {
    id: '3',
    title: 'Cannabis Facility Expansion',
    value: 320000,
    probability: 85,
    phase: 'final-quote',
    marketSegment: 'Cannabis',
    buildingOwner: 'Green Valley Cultivation',
    engineeringFirm: 'Specialized Systems Engineering',
    manufacturerRep: 'Industrial HVAC Specialists',
    architect: 'Agricultural Facility Design',
    expectedCloseDate: '2024-02-28',
    lastActivity: '2024-01-18',
    assignedTo: 'David Rodriguez',
    description: 'Climate control system for 50,000 sq ft cultivation facility',
    tags: ['Cannabis', 'Climate Critical', 'Expansion'],
  },
  {
    id: '4',
    title: 'Downtown Hotel Renovation',
    value: 180000,
    probability: 40,
    phase: 'prospect',
    marketSegment: 'Hospitality',
    buildingOwner: 'Metropolitan Hotels Group',
    engineeringFirm: 'Hospitality Engineering Solutions',
    manufacturerRep: 'Hotel Systems Inc.',
    architect: 'Renovation Specialists LLC',
    expectedCloseDate: '2024-05-10',
    lastActivity: '2024-01-10',
    assignedTo: 'Lisa Wang',
    description: 'HVAC modernization for historic 120-room hotel',
    tags: ['Hospitality', 'Historic Building', 'Renovation'],
  },
  {
    id: '5',
    title: 'Manufacturing Plant Upgrade',
    value: 520000,
    probability: 90,
    phase: 'po-in-hand',
    marketSegment: 'Industrial',
    buildingOwner: 'Advanced Manufacturing Corp',
    engineeringFirm: 'Industrial Systems Design',
    manufacturerRep: 'Heavy Industry HVAC',
    architect: 'Industrial Architecture Group',
    expectedCloseDate: '2024-02-15',
    lastActivity: '2024-01-20',
    assignedTo: 'Robert Kim',
    description: 'Complete HVAC overhaul for 300,000 sq ft manufacturing facility',
    tags: ['Industrial', 'Large Scale', 'Won'],
  },
  {
    id: '6',
    title: 'University Research Lab',
    value: 95000,
    probability: 70,
    phase: 'preliminary-quote',
    marketSegment: 'Education',
    buildingOwner: 'State University',
    engineeringFirm: 'Academic Facilities Engineering',
    manufacturerRep: 'Education HVAC Solutions',
    architect: 'Campus Design Partners',
    expectedCloseDate: '2024-03-30',
    lastActivity: '2024-01-14',
    assignedTo: 'Jennifer Martinez',
    description: 'Specialized HVAC for new chemistry research laboratory',
    tags: ['Education', 'Research', 'Specialized'],
  },
];

const pipelinePhases = [
  { id: 'prospect', title: 'Prospect', color: 'gray' },
  { id: 'preliminary-quote', title: 'Preliminary Quote', color: 'blue' },
  { id: 'final-quote', title: 'Final Quote', color: 'orange' },
  { id: 'po-in-hand', title: 'PO in Hand', color: 'green' },
];

const marketSegments = [
  'All Segments',
  'Healthcare',
  'Education',
  'Cannabis',
  'Commercial Office',
  'Hospitality',
  'Industrial',
];

interface OpportunityCardProps {
  opportunity: typeof mockOpportunities[0];
  index: number;
}

function OpportunityCard({ opportunity, index }: OpportunityCardProps) {
  const phaseColor = pipelinePhases.find(p => p.id === opportunity.phase)?.color || 'gray';

  return (
    <Draggable draggableId={opportunity.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
          mb="sm"
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} rotate(5deg)`
              : provided.draggableProps.style?.transform,
          }}
        >
          <Stack gap="xs">
            {/* Header */}
            <Group justify="space-between" align="flex-start">
              <Text fw={600} size="sm" style={{ flex: 1 }}>
                {opportunity.title}
              </Text>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" size="sm">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconEye size={14} />}>
                    View Details
                  </Menu.Item>
                  <Menu.Item leftSection={<IconEdit size={14} />}>
                    Edit Opportunity
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            {/* Value and Probability */}
            <Group justify="space-between">
              <Group gap="xs">
                <IconCurrencyDollar size={14} color="var(--mantine-color-green-6)" />
                <NumberFormatter
                  value={opportunity.value}
                  prefix="$"
                  thousandSeparator
                  decimalScale={0}
                />
              </Group>
              <Badge color={phaseColor} size="sm">
                {opportunity.probability}% prob
              </Badge>
            </Group>

            {/* Market Segment */}
            <Badge variant="light" size="sm" style={{ alignSelf: 'flex-start' }}>
              {opportunity.marketSegment}
            </Badge>

            {/* Key Stakeholders */}
            <Stack gap={4}>
              <Group gap="xs">
                <IconBuilding size={12} />
                <Text size="xs" c="dimmed" truncate>
                  {opportunity.buildingOwner}
                </Text>
              </Group>
              <Group gap="xs">
                <IconUser size={12} />
                <Text size="xs" c="dimmed" truncate>
                  {opportunity.engineeringFirm}
                </Text>
              </Group>
            </Stack>

            {/* Assigned To and Date */}
            <Group justify="space-between" mt="xs">
              <Group gap="xs">
                <Avatar size={20} radius="xl" />
                <Text size="xs" c="dimmed">
                  {opportunity.assignedTo}
                </Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={12} />
                <Text size="xs" c="dimmed">
                  {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                </Text>
              </Group>
            </Group>

            {/* Tags */}
            {opportunity.tags && opportunity.tags.length > 0 && (
              <Group gap={4}>
                {opportunity.tags.slice(0, 2).map((tag, idx) => (
                  <Badge key={idx} size="xs" variant="dot">
                    {tag}
                  </Badge>
                ))}
                {opportunity.tags.length > 2 && (
                  <Text size="xs" c="dimmed">
                    +{opportunity.tags.length - 2} more
                  </Text>
                )}
              </Group>
            )}
          </Stack>
        </Card>
      )}
    </Draggable>
  );
}

export default function OpportunityPipelinePage() {
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('All Segments');
  const [selectedRep, setSelectedRep] = useState('All Reps');
  const [activeTab, setActiveTab] = useState('pipeline');

  // Filter opportunities based on search and filters
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.buildingOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.engineeringFirm.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSegment = selectedSegment === 'All Segments' || opp.marketSegment === selectedSegment;
    const matchesRep = selectedRep === 'All Reps' || opp.assignedTo === selectedRep;
    
    return matchesSearch && matchesSegment && matchesRep;
  });

  // Group opportunities by phase
  const opportunitiesByPhase = pipelinePhases.reduce((acc, phase) => {
    acc[phase.id] = filteredOpportunities.filter(opp => opp.phase === phase.id);
    return acc;
  }, {} as Record<string, typeof mockOpportunities>);

  // Calculate totals for each phase
  const phaseTotals = pipelinePhases.map(phase => ({
    ...phase,
    count: opportunitiesByPhase[phase.id].length,
    value: opportunitiesByPhase[phase.id].reduce((sum, opp) => sum + opp.value, 0),
  }));

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same phase
      const phaseOpportunities = [...opportunitiesByPhase[source.droppableId]];
      const [removed] = phaseOpportunities.splice(source.index, 1);
      phaseOpportunities.splice(destination.index, 0, removed);
      
      // Update the main opportunities array
      const updatedOpportunities = opportunities.map(opp => {
        if (opp.id === draggableId) {
          return { ...opp };
        }
        return opp;
      });
      setOpportunities(updatedOpportunities);
    } else {
      // Moving between phases
      const updatedOpportunities = opportunities.map(opp => {
        if (opp.id === draggableId) {
          return { ...opp, phase: destination.droppableId };
        }
        return opp;
      });
      setOpportunities(updatedOpportunities);
    }
  };

  const totalPipelineValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const averageDealSize = filteredOpportunities.length > 0 ? totalPipelineValue / filteredOpportunities.length : 0;

  return (
    <div className="residential-content-container">
      <Stack gap="xl" className="commercial-stack-large">
        {/* Header */}
        <Group justify="space-between" className="commercial-section-header">
          <div>
            <Title order={1}>Opportunity Pipeline</Title>
            <Text size="lg" c="dimmed">
              Manage and track commercial opportunities through the sales process
            </Text>
          </div>
          <Button
            component={Link}
            href="/commercial/opportunities/new"
            leftSection={<IconPlus size={16} />}
            size="md"
            color="blue"
          >
            New Opportunity
          </Button>
        </Group>

        {/* Tabs for Pipeline and Analytics */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'pipeline')}>
          <Tabs.List>
            <Tabs.Tab value="pipeline" leftSection={<IconChartBar size={16} />}>
              Pipeline Board
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconChartLine size={16} />}>
              Analytics & Reporting
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pipeline" pt="md">
            <Stack gap="lg">

        {/* Filters and Search */}
        <Paper p="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder="Search opportunities..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                placeholder="Market Segment"
                data={marketSegments}
                value={selectedSegment}
                onChange={(value) => setSelectedSegment(value || 'All Segments')}
                leftSection={<IconFilter size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                placeholder="Assigned Rep"
                data={['All Reps', 'Sarah Johnson', 'Mike Chen', 'David Rodriguez', 'Lisa Wang', 'Robert Kim', 'Jennifer Martinez']}
                value={selectedRep}
                onChange={(value) => setSelectedRep(value || 'All Reps')}
                leftSection={<IconUser size={16} />}
              />
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Pipeline Summary */}
        <Paper p="md" withBorder>
          <Group justify="space-between" mb="md">
            <Text fw={600}>Pipeline Summary</Text>
            <Group gap="xl">
              <div>
                <Text size="sm" c="dimmed">Total Pipeline Value</Text>
                <Text fw={700} size="lg">
                  <NumberFormatter
                    value={totalPipelineValue}
                    prefix="$"
                    thousandSeparator
                    decimalScale={0}
                  />
                </Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">Average Deal Size</Text>
                <Text fw={700} size="lg">
                  <NumberFormatter
                    value={averageDealSize}
                    prefix="$"
                    thousandSeparator
                    decimalScale={0}
                  />
                </Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">Total Opportunities</Text>
                <Text fw={700} size="lg">{filteredOpportunities.length}</Text>
              </div>
            </Group>
          </Group>
        </Paper>

            {/* Pipeline Board */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Grid gutter="md">
                {phaseTotals.map((phase) => (
                  <Grid.Col key={phase.id} span={{ base: 12, sm: 6, lg: 3 }}>
                    <Paper p="md" withBorder style={{ minHeight: '600px' }}>
                      {/* Phase Header */}
                      <Group justify="space-between" mb="md">
                        <div>
                          <Text fw={600} size="sm">
                            {phase.title}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {phase.count} opportunities
                          </Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Text size="xs" c="dimmed">Total Value</Text>
                          <Text fw={600} size="sm">
                            <NumberFormatter
                              value={phase.value}
                              prefix="$"
                              thousandSeparator
                              decimalScale={0}
                            />
                          </Text>
                        </div>
                      </Group>

                      {/* Droppable Area */}
                      <Droppable droppableId={phase.id}>
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                              minHeight: '500px',
                              backgroundColor: snapshot.isDraggingOver 
                                ? 'var(--mantine-color-blue-0)' 
                                : 'transparent',
                              borderRadius: '8px',
                              padding: '8px',
                              transition: 'background-color 0.2s ease',
                            }}
                          >
                            {opportunitiesByPhase[phase.id].map((opportunity, index) => (
                              <OpportunityCard
                                key={opportunity.id}
                                opportunity={opportunity}
                                index={index}
                              />
                            ))}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>
            </DragDropContext>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="analytics" pt="md">
            <PipelineAnalyticsDashboard 
              opportunities={filteredOpportunities}
              phaseTotals={phaseTotals}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </div>
  );
}
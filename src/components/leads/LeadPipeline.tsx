'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  Text,
  Badge,
  Group,
  Stack,
  ActionIcon,
  Menu,
  Progress,
  Avatar,
  Tooltip,
  Button,
  Modal,
  SimpleGrid,
} from '@mantine/core';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconDots,
  IconEye,
  IconEdit,
  IconPhone,
  IconMail,
  IconCalendar,
  IconPlus,
  IconTrendingUp,
  IconUser,
  IconBuilding,
  IconSparkles,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { MockLead, generateMockLeads } from '@/lib/mockData/generators';
import { LeadDetailModal } from './LeadDetailModal';
import { LeadFormModal } from './LeadFormModal';
import { aiService } from '@/lib/services/aiService';

type LeadStatus = 'new' | 'qualified' | 'discovery' | 'proposal' | 'won' | 'lost';

interface PipelineColumn {
  id: LeadStatus;
  title: string;
  color: string;
  leads: MockLead[];
}

interface LeadCardProps {
  lead: MockLead;
  onEdit: (lead: MockLead) => void;
  onView: (lead: MockLead) => void;
}

function LeadCard({ lead, onEdit, onView }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  // Calculate AI score for this lead
  const aiScore = useMemo(() => aiService.calculateLeadScore(lead), [lead]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'hubspot': return 'orange';
      case 'referral': return 'green';
      case 'website': return 'blue';
      case 'trade_show': return 'purple';
      default: return 'gray';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    if (score >= 40) return 'orange';
    return 'red';
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <Stack gap="sm">
        {/* Header with company name and menu */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text fw={600} size="sm" lineClamp={2} mb={2}>
              {lead.companyName}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {lead.contactName}
            </Text>
          </Box>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm" onClick={(e) => e.stopPropagation()}>
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => onView(lead)}>
                View Details
              </Menu.Item>
              <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => onEdit(lead)}>
                Edit Lead
              </Menu.Item>
              <Menu.Item leftSection={<IconPhone size={14} />}>
                Call Lead
              </Menu.Item>
              <Menu.Item leftSection={<IconMail size={14} />}>
                Send Email
              </Menu.Item>
              <Menu.Item leftSection={<IconCalendar size={14} />}>
                Schedule Call
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        {/* Source and AI Score badges */}
        <Group justify="space-between" align="center" gap="xs">
          <Badge 
            size="sm" 
            color={getSourceColor(lead.source)} 
            variant="light"
            style={{ textTransform: 'capitalize' }}
          >
            {lead.source.replace('_', ' ')}
          </Badge>
          <Tooltip 
            label={
              <Stack gap={4}>
                <Text size="xs">AI Score: {aiScore.overallScore}/100</Text>
                <Text size="xs">Conversion: {aiScore.conversionProbability}%</Text>
                <Text size="xs">Confidence: {aiScore.confidence}</Text>
              </Stack>
            }
            withinPortal
          >
            <Badge 
              size="sm" 
              color={getScoreColor(aiScore.overallScore)} 
              variant="gradient"
              gradient={{ from: 'violet', to: 'blue' }}
              leftSection={<IconSparkles size={12} />}
            >
              {aiScore.overallScore}
            </Badge>
          </Tooltip>
        </Group>

        {/* Conversion probability progress bar */}
        <Box>
          <Group justify="space-between" mb={4}>
            <Text size="xs" c="dimmed">Conversion Probability</Text>
            <Text size="xs" fw={600} c={getScoreColor(aiScore.overallScore)}>
              {aiScore.conversionProbability}%
            </Text>
          </Group>
          <Progress
            value={aiScore.conversionProbability}
            size="sm"
            color={getScoreColor(aiScore.overallScore)}
            radius="xl"
          />
        </Box>

        {/* Footer with assigned user and date */}
        <Group justify="space-between" align="center" gap="xs">
          <Group gap={4}>
            <IconUser size={14} />
            <Text size="xs" c="dimmed" lineClamp={1}>
              {lead.assignedTo.split(' ')[0]}
            </Text>
          </Group>
          <Text size="xs" c="dimmed">
            {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}

interface PipelineColumnProps {
  column: PipelineColumn;
  onEdit: (lead: MockLead) => void;
  onView: (lead: MockLead) => void;
}

function PipelineColumn({ column, onEdit, onView }: PipelineColumnProps) {
  return (
    <Stack gap={0} style={{ height: '100%' }}>
      {/* Column Header */}
      <Card withBorder radius="md" p="md" mb="sm" bg="gray.0">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs">
            <Text fw={700} size="md">
              {column.title}
            </Text>
            <Badge size="lg" color={column.color} variant="filled">
              {column.leads.length}
            </Badge>
          </Group>
          <ActionIcon variant="subtle" size="md" color={column.color}>
            <IconPlus size={18} />
          </ActionIcon>
        </Group>
      </Card>

      {/* Column Content */}
      <Box style={{ flex: 1, minHeight: 400 }}>
        <SortableContext items={column.leads.map(lead => lead.id)} strategy={verticalListSortingStrategy}>
          <Stack gap="md">
            {column.leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={onEdit}
                onView={onView}
              />
            ))}
          </Stack>
        </SortableContext>
      </Box>
    </Stack>
  );
}

export function LeadPipeline() {
  const [leads, setLeads] = useState<MockLead[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<MockLead | null>(null);
  const [editingLead, setEditingLead] = useState<MockLead | null>(null);
  const [detailOpened, { open: openDetail, close: closeDetail }] = useDisclosure(false);
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const mockLeads = generateMockLeads(50);
    setLeads(mockLeads);
  }, []);

  const columns: PipelineColumn[] = [
    {
      id: 'new',
      title: 'New Leads',
      color: 'blue',
      leads: leads.filter(lead => lead.status === 'new'),
    },
    {
      id: 'qualified',
      title: 'Qualified',
      color: 'cyan',
      leads: leads.filter(lead => lead.status === 'qualified'),
    },
    {
      id: 'discovery',
      title: 'Discovery',
      color: 'yellow',
      leads: leads.filter(lead => lead.status === 'discovery'),
    },
    {
      id: 'proposal',
      title: 'Proposal',
      color: 'orange',
      leads: leads.filter(lead => lead.status === 'proposal'),
    },
    {
      id: 'won',
      title: 'Won',
      color: 'green',
      leads: leads.filter(lead => lead.status === 'won'),
    },
    {
      id: 'lost',
      title: 'Lost',
      color: 'red',
      leads: leads.filter(lead => lead.status === 'lost'),
    },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the lead being dragged
    const activeLead = leads.find(lead => lead.id === activeId);
    if (!activeLead) return;

    // Determine the new status based on the drop target
    let newStatus: LeadStatus = activeLead.status;
    
    // Check if dropped on a column or another lead
    const targetColumn = columns.find(col => col.id === overId);
    if (targetColumn) {
      newStatus = targetColumn.id;
    } else {
      // Dropped on another lead, find which column it belongs to
      const targetLead = leads.find(lead => lead.id === overId);
      if (targetLead) {
        newStatus = targetLead.status;
      }
    }

    // Update the lead status
    if (newStatus !== activeLead.status) {
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === activeId
            ? { ...lead, status: newStatus, updatedAt: new Date() }
            : lead
        )
      );
    }

    setActiveId(null);
  };

  const handleViewLead = (lead: MockLead) => {
    setSelectedLead(lead);
    openDetail();
  };

  const handleEditLead = (lead: MockLead) => {
    setEditingLead(lead);
    openForm();
  };

  const handleSaveLead = (updatedLead: MockLead) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );
    setEditingLead(null);
    closeForm();
  };

  const activeLead = activeId ? leads.find(lead => lead.id === activeId) : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box 
          style={{ 
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: '1rem',
            scrollbarWidth: 'thin',
          }}
        >
          <Group 
            align="flex-start" 
            gap="lg" 
            wrap="nowrap" 
            style={{ 
              minWidth: 'fit-content',
              paddingBottom: '0.5rem'
            }}
          >
            {columns.map((column) => (
              <Box key={column.id} style={{ minWidth: 300, width: 300, flexShrink: 0 }}>
                <PipelineColumn
                  column={column}
                  onEdit={handleEditLead}
                  onView={handleViewLead}
                />
              </Box>
            ))}
          </Group>
        </Box>

        <DragOverlay>
          {activeLead ? (
            <LeadCard
              lead={activeLead}
              onEdit={handleEditLead}
              onView={handleViewLead}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal
        opened={detailOpened}
        onClose={closeDetail}
        title="Lead Details"
        size="lg"
      >
        {selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={closeDetail}
            onEdit={() => {
              closeDetail();
              handleEditLead(selectedLead);
            }}
          />
        )}
      </Modal>

      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={editingLead ? 'Edit Lead' : 'New Lead'}
        size="lg"
      >
        <LeadFormModal
          lead={editingLead}
          onSave={handleSaveLead}
          onCancel={closeForm}
        />
      </Modal>
    </>
  );
}
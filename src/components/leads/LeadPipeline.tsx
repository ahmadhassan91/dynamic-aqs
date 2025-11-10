'use client';

import { useState, useEffect } from 'react';
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
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { MockLead, generateMockLeads } from '@/lib/mockData/generators';
import { LeadDetailModal } from './LeadDetailModal';
import { LeadFormModal } from './LeadFormModal';

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
      padding="sm"
      radius="md"
      withBorder
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <Box flex={1}>
            <Text fw={600} size="sm" lineClamp={1}>
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

        <Group justify="space-between" align="center">
          <Badge size="xs" color={getSourceColor(lead.source)} variant="light">
            {lead.source.replace('_', ' ')}
          </Badge>
          <Group gap={4}>
            <IconTrendingUp size={12} />
            <Text size="xs" fw={600} c={getScoreColor(lead.score)}>
              {lead.score}
            </Text>
          </Group>
        </Group>

        <Progress
          value={lead.score}
          size="xs"
          color={getScoreColor(lead.score)}
          radius="xl"
        />

        <Group justify="space-between" align="center">
          <Group gap={4}>
            <IconUser size={12} />
            <Text size="xs" c="dimmed">
              {lead.assignedTo}
            </Text>
          </Group>
          <Text size="xs" c="dimmed">
            {new Date(lead.createdAt).toLocaleDateString()}
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
    <Box>
      <Card withBorder radius="md" p="md" bg="gray.0">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <Text fw={600} size="sm">
              {column.title}
            </Text>
            <Badge size="sm" color={column.color} variant="light">
              {column.leads.length}
            </Badge>
          </Group>
          <ActionIcon variant="subtle" size="sm">
            <IconPlus size={16} />
          </ActionIcon>
        </Group>

        <SortableContext items={column.leads.map(lead => lead.id)} strategy={verticalListSortingStrategy}>
          <Stack gap="sm">
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
      </Card>
    </Box>
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
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing="md">
          {columns.map((column) => (
            <PipelineColumn
              key={column.id}
              column={column}
              onEdit={handleEditLead}
              onView={handleViewLead}
            />
          ))}
        </SimpleGrid>

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
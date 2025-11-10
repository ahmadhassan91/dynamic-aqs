'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Badge,
  ActionIcon,
  Menu,
  rem,
  Stack,
  Grid,
  Select,
  TextInput,
  Modal,
  Textarea,
  NumberInput,
  MultiSelect,
  Checkbox,
  Divider,
  List,
  ThemeIcon,
} from '@mantine/core';
import {
  IconTemplate,
  IconPlus,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconSearch,
  IconCopy,
  IconDownload,
  IconUpload,
  IconClock,
  IconUsers,
  IconSchool,
  IconCertificate,
  IconChecklist,
  IconFileText,
} from '@tabler/icons-react';

interface TrainingTemplate {
  id: string;
  name: string;
  type: 'installation' | 'maintenance' | 'sales' | 'product_knowledge';
  description: string;
  duration: number; // in minutes
  maxAttendees: number;
  prerequisites: string[];
  objectives: string[];
  materials: string[];
  agenda: {
    title: string;
    duration: number;
    description: string;
  }[];
  certificationOffered: boolean;
  certificationName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock training templates
const mockTemplates: TrainingTemplate[] = [
  {
    id: '1',
    name: 'AQS Pro Series Installation Fundamentals',
    type: 'installation',
    description: 'Comprehensive training on proper installation techniques for AQS Pro Series heat pumps',
    duration: 240, // 4 hours
    maxAttendees: 8,
    prerequisites: ['Basic HVAC Knowledge', 'Safety Certification'],
    objectives: [
      'Understand AQS Pro Series components and specifications',
      'Master proper installation procedures and best practices',
      'Learn troubleshooting techniques for common installation issues',
      'Complete hands-on installation exercise'
    ],
    materials: [
      'AQS Pro Series Installation Manual',
      'Installation Tools Kit',
      'Safety Equipment',
      'Practice Unit for Hands-on Training'
    ],
    agenda: [
      { title: 'Welcome and Safety Overview', duration: 30, description: 'Introduction and safety protocols' },
      { title: 'AQS Pro Series Overview', duration: 45, description: 'Product features and specifications' },
      { title: 'Installation Planning', duration: 60, description: 'Site assessment and preparation' },
      { title: 'Hands-on Installation', duration: 90, description: 'Practical installation exercise' },
      { title: 'Testing and Commissioning', duration: 15, description: 'System testing procedures' }
    ],
    certificationOffered: true,
    certificationName: 'AQS Pro Series Installation Certified',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '2',
    name: 'Preventive Maintenance Best Practices',
    type: 'maintenance',
    description: 'Training on preventive maintenance schedules and procedures for optimal system performance',
    duration: 180, // 3 hours
    maxAttendees: 12,
    prerequisites: ['Basic HVAC Knowledge'],
    objectives: [
      'Understand maintenance schedules and intervals',
      'Learn proper cleaning and inspection techniques',
      'Master filter replacement and system optimization',
      'Develop customer communication skills for maintenance recommendations'
    ],
    materials: [
      'Maintenance Checklist Templates',
      'Cleaning Supplies and Tools',
      'Replacement Parts Samples',
      'Customer Communication Scripts'
    ],
    agenda: [
      { title: 'Maintenance Overview', duration: 30, description: 'Importance of preventive maintenance' },
      { title: 'Inspection Procedures', duration: 60, description: 'System inspection techniques' },
      { title: 'Cleaning and Replacement', duration: 60, description: 'Hands-on maintenance tasks' },
      { title: 'Customer Communication', duration: 30, description: 'Explaining maintenance to customers' }
    ],
    certificationOffered: false,
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '3',
    name: 'Advanced Sales Techniques for HVAC Professionals',
    type: 'sales',
    description: 'Develop advanced sales skills and product knowledge to increase conversion rates',
    duration: 300, // 5 hours
    maxAttendees: 15,
    prerequisites: ['Basic Sales Experience', 'Product Knowledge Certification'],
    objectives: [
      'Master consultative selling techniques',
      'Learn to identify customer needs and pain points',
      'Develop compelling value propositions',
      'Practice objection handling and closing techniques'
    ],
    materials: [
      'Sales Playbook',
      'Product Comparison Charts',
      'ROI Calculation Tools',
      'Customer Case Studies'
    ],
    agenda: [
      { title: 'Sales Process Overview', duration: 45, description: 'Understanding the sales funnel' },
      { title: 'Customer Needs Assessment', duration: 75, description: 'Identifying customer requirements' },
      { title: 'Product Positioning', duration: 60, description: 'Presenting solutions effectively' },
      { title: 'Objection Handling', duration: 60, description: 'Overcoming customer concerns' },
      { title: 'Closing Techniques', duration: 60, description: 'Securing the sale' }
    ],
    certificationOffered: true,
    certificationName: 'Advanced HVAC Sales Professional',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  }
];

export function TrainingTemplates() {
  const [templates] = useState<TrainingTemplate[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TrainingTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = !searchQuery || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = !typeFilter || template.type === typeFilter;

      return matchesSearch && matchesType && template.isActive;
    });
  }, [templates, searchQuery, typeFilter]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'installation': return 'blue';
      case 'maintenance': return 'orange';
      case 'sales': return 'green';
      case 'product_knowledge': return 'violet';
      default: return 'gray';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatTypeLabel = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const handleEditTemplate = (template: TrainingTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const handleViewTemplate = (template: TrainingTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const trainingTypes = [
    { value: 'installation', label: 'Installation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'sales', label: 'Sales' },
    { value: 'product_knowledge', label: 'Product Knowledge' },
  ];

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Training Templates</Title>
          <Text c="dimmed" size="sm">
            Create and manage reusable training session templates
          </Text>
        </div>
        <Group gap="sm">
          <Button variant="light" leftSection={<IconUpload size={16} />}>
            Import
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreateTemplate}>
            Create Template
          </Button>
        </Group>
      </Group>

      {/* Filters */}
      <Card withBorder p="md">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 8, md: 9 }}>
            <TextInput
              placeholder="Search templates..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
            <Select
              placeholder="Filter by type"
              data={trainingTypes}
              value={typeFilter}
              onChange={setTypeFilter}
              clearable
            />
          </Grid.Col>
        </Grid>
      </Card>

      {/* Templates Grid */}
      <Grid>
        {filteredTemplates.map((template) => (
          <Grid.Col key={template.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder p="lg" h="100%">
              <Stack gap="md" h="100%">
                <Group justify="space-between">
                  <Badge color={getTypeColor(template.type)} variant="light">
                    {formatTypeLabel(template.type)}
                  </Badge>
                  <Menu position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                        onClick={() => handleViewTemplate(template)}
                      >
                        View Details
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                        onClick={() => handleEditTemplate(template)}
                      >
                        Edit Template
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}
                      >
                        Duplicate
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconDownload style={{ width: rem(14), height: rem(14) }} />}
                      >
                        Export
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                        color="red"
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>

                <div style={{ flex: 1 }}>
                  <Title order={4} mb="xs">{template.name}</Title>
                  <Text size="sm" c="dimmed" mb="md" lineClamp={3}>
                    {template.description}
                  </Text>

                  <Stack gap="xs">
                    <Group gap="md">
                      <Group gap="xs">
                        <IconClock size={14} />
                        <Text size="sm">{formatDuration(template.duration)}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconUsers size={14} />
                        <Text size="sm">Max {template.maxAttendees}</Text>
                      </Group>
                    </Group>

                    {template.certificationOffered && (
                      <Group gap="xs">
                        <IconCertificate size={14} color="gold" />
                        <Text size="sm" c="dimmed">Certification Available</Text>
                      </Group>
                    )}

                    <Group gap="xs">
                      <IconChecklist size={14} />
                      <Text size="sm" c="dimmed">{template.objectives.length} objectives</Text>
                    </Group>
                  </Stack>
                </div>

                <Group justify="space-between" mt="auto">
                  <Text size="xs" c="dimmed">
                    Updated {new Intl.DateTimeFormat('en-US').format(template.updatedAt)}
                  </Text>
                  <Button size="xs" variant="light" onClick={() => handleViewTemplate(template)}>
                    View Details
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {filteredTemplates.length === 0 && (
        <Card withBorder p="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size="xl" variant="light" color="gray">
              <IconTemplate size={32} />
            </ThemeIcon>
            <div style={{ textAlign: 'center' }}>
              <Text fw={500} mb="xs">No templates found</Text>
              <Text size="sm" c="dimmed" mb="md">
                {searchQuery || typeFilter ? 
                  'Try adjusting your search criteria or filters.' :
                  'Create your first training template to get started.'
                }
              </Text>
              <Button leftSection={<IconPlus size={16} />} onClick={handleCreateTemplate}>
                Create Template
              </Button>
            </div>
          </Stack>
        </Card>
      )}

      {/* Template Detail Modal */}
      <Modal
        opened={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Training Template Details"
        size="lg"
      >
        {selectedTemplate && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Title order={3}>{selectedTemplate.name}</Title>
                <Group gap="xs" mt="xs">
                  <Badge color={getTypeColor(selectedTemplate.type)} variant="light">
                    {formatTypeLabel(selectedTemplate.type)}
                  </Badge>
                  {selectedTemplate.certificationOffered && (
                    <Badge color="gold" variant="light">
                      <IconCertificate size={12} style={{ marginRight: 4 }} />
                      Certification
                    </Badge>
                  )}
                </Group>
              </div>
              <Button leftSection={<IconSchool size={16} />}>
                Schedule Session
              </Button>
            </Group>

            <Text>{selectedTemplate.description}</Text>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Duration</Text>
                <Text fw={500}>{formatDuration(selectedTemplate.duration)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Max Attendees</Text>
                <Text fw={500}>{selectedTemplate.maxAttendees} people</Text>
              </Grid.Col>
            </Grid>

            {selectedTemplate.prerequisites.length > 0 && (
              <div>
                <Text fw={500} mb="xs">Prerequisites</Text>
                <List size="sm">
                  {selectedTemplate.prerequisites.map((prereq, index) => (
                    <List.Item key={index}>{prereq}</List.Item>
                  ))}
                </List>
              </div>
            )}

            <div>
              <Text fw={500} mb="xs">Learning Objectives</Text>
              <List size="sm">
                {selectedTemplate.objectives.map((objective, index) => (
                  <List.Item key={index}>{objective}</List.Item>
                ))}
              </List>
            </div>

            <div>
              <Text fw={500} mb="xs">Required Materials</Text>
              <List size="sm">
                {selectedTemplate.materials.map((material, index) => (
                  <List.Item key={index}>{material}</List.Item>
                ))}
              </List>
            </div>

            <div>
              <Text fw={500} mb="xs">Training Agenda</Text>
              <Stack gap="xs">
                {selectedTemplate.agenda.map((item, index) => (
                  <Card key={index} withBorder p="sm">
                    <Group justify="space-between" mb="xs">
                      <Text fw={500} size="sm">{item.title}</Text>
                      <Badge variant="light" size="sm">
                        {formatDuration(item.duration)}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">{item.description}</Text>
                  </Card>
                ))}
              </Stack>
            </div>

            {selectedTemplate.certificationOffered && (
              <Card withBorder p="md" style={{ backgroundColor: 'var(--mantine-color-yellow-0)' }}>
                <Group gap="sm">
                  <IconCertificate size={20} color="gold" />
                  <div>
                    <Text fw={500} size="sm">Certification Offered</Text>
                    <Text size="sm" c="dimmed">{selectedTemplate.certificationName}</Text>
                  </div>
                </Group>
              </Card>
            )}
          </Stack>
        )}
      </Modal>

      {/* Create/Edit Template Modal */}
      <Modal
        opened={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={isEditing ? 'Edit Training Template' : 'Create Training Template'}
        size="xl"
      >
        <Stack gap="md">
          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Template Name"
                placeholder="Enter template name"
                required
                defaultValue={selectedTemplate?.name}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Training Type"
                placeholder="Select type"
                data={trainingTypes}
                required
                defaultValue={selectedTemplate?.type}
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Description"
            placeholder="Describe the training session"
            rows={3}
            required
            defaultValue={selectedTemplate?.description}
          />

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Duration (minutes)"
                placeholder="120"
                min={30}
                max={480}
                required
                defaultValue={selectedTemplate?.duration}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Maximum Attendees"
                placeholder="10"
                min={1}
                max={50}
                required
                defaultValue={selectedTemplate?.maxAttendees}
              />
            </Grid.Col>
          </Grid>

          <MultiSelect
            label="Prerequisites"
            placeholder="Add prerequisites"
            data={[
              'Basic HVAC Knowledge',
              'Safety Certification',
              'Product Knowledge Certification',
              'Basic Sales Experience',
              'Installation Experience'
            ]}
            defaultValue={selectedTemplate?.prerequisites}
          />

          <Textarea
            label="Learning Objectives"
            placeholder="Enter each objective on a new line"
            rows={4}
            description="List the key learning outcomes for this training"
            defaultValue={selectedTemplate?.objectives.join('\n')}
          />

          <Textarea
            label="Required Materials"
            placeholder="Enter each material on a new line"
            rows={3}
            description="List all materials needed for the training"
            defaultValue={selectedTemplate?.materials.join('\n')}
          />

          <Checkbox
            label="Offer Certification"
            description="Check if this training offers a certification upon completion"
            defaultChecked={selectedTemplate?.certificationOffered}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button>
              {isEditing ? 'Update Template' : 'Create Template'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
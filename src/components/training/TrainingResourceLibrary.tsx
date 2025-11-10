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
  Table,
  Avatar,
  Progress,
  ThemeIcon,
  Tabs,
  FileInput,
  Textarea,
  Anchor,
  Tooltip,
} from '@mantine/core';
import {
  IconFolder,
  IconFile,
  IconPlus,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconSearch,
  IconDownload,
  IconUpload,
  IconVideo,
  IconFileText,
  IconPhoto,
  IconFileTypePdf,
  IconFileZip,
  IconExternalLink,
  IconStar,
  IconStarFilled,
  IconShare,
  IconCopy,
} from '@tabler/icons-react';

interface TrainingResource {
  id: string;
  name: string;
  type: 'document' | 'video' | 'image' | 'presentation' | 'manual' | 'checklist';
  category: 'installation' | 'maintenance' | 'sales' | 'product_knowledge' | 'safety' | 'general';
  description: string;
  fileSize: number; // in bytes
  fileUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  isFavorite: boolean;
  downloadCount: number;
  rating: number;
  ratingCount: number;
  uploadedBy: string;
  uploadedAt: Date;
  lastModified: Date;
}

// Mock training resources
const mockResources: TrainingResource[] = [
  {
    id: '1',
    name: 'AQS Pro Series Installation Manual',
    type: 'manual',
    category: 'installation',
    description: 'Comprehensive installation guide for AQS Pro Series heat pumps with step-by-step instructions and diagrams.',
    fileSize: 15728640, // 15MB
    fileUrl: '/resources/manuals/aqs-pro-installation-manual.pdf',
    thumbnailUrl: '/resources/thumbnails/manual-thumb.jpg',
    tags: ['installation', 'pro-series', 'manual', 'heat-pump'],
    isFavorite: true,
    downloadCount: 245,
    rating: 4.8,
    ratingCount: 32,
    uploadedBy: 'John Smith',
    uploadedAt: new Date('2024-01-15'),
    lastModified: new Date('2024-02-01')
  },
  {
    id: '2',
    name: 'Safety Protocols Training Video',
    type: 'video',
    category: 'safety',
    description: 'Essential safety procedures and protocols for HVAC installation and maintenance work.',
    fileSize: 524288000, // 500MB
    fileUrl: '/resources/videos/safety-protocols.mp4',
    thumbnailUrl: '/resources/thumbnails/safety-video-thumb.jpg',
    tags: ['safety', 'protocols', 'training', 'video'],
    isFavorite: false,
    downloadCount: 189,
    rating: 4.6,
    ratingCount: 28,
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-20'),
    lastModified: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Maintenance Checklist Template',
    type: 'checklist',
    category: 'maintenance',
    description: 'Standardized checklist for routine maintenance procedures and inspections.',
    fileSize: 2097152, // 2MB
    fileUrl: '/resources/checklists/maintenance-checklist.pdf',
    tags: ['maintenance', 'checklist', 'template', 'inspection'],
    isFavorite: true,
    downloadCount: 156,
    rating: 4.9,
    ratingCount: 18,
    uploadedBy: 'Mike Davis',
    uploadedAt: new Date('2024-01-25'),
    lastModified: new Date('2024-02-05')
  },
  {
    id: '4',
    name: 'Sales Presentation Template',
    type: 'presentation',
    category: 'sales',
    description: 'Professional presentation template for customer meetings and product demonstrations.',
    fileSize: 8388608, // 8MB
    fileUrl: '/resources/presentations/sales-template.pptx',
    thumbnailUrl: '/resources/thumbnails/presentation-thumb.jpg',
    tags: ['sales', 'presentation', 'template', 'customer'],
    isFavorite: false,
    downloadCount: 98,
    rating: 4.4,
    ratingCount: 15,
    uploadedBy: 'Lisa Wilson',
    uploadedAt: new Date('2024-02-01'),
    lastModified: new Date('2024-02-10')
  },
  {
    id: '5',
    name: 'Product Comparison Chart',
    type: 'document',
    category: 'product_knowledge',
    description: 'Detailed comparison of AQS product lines with specifications and features.',
    fileSize: 1048576, // 1MB
    fileUrl: '/resources/documents/product-comparison.pdf',
    tags: ['product', 'comparison', 'specifications', 'features'],
    isFavorite: true,
    downloadCount: 203,
    rating: 4.7,
    ratingCount: 25,
    uploadedBy: 'Tom Anderson',
    uploadedAt: new Date('2024-02-05'),
    lastModified: new Date('2024-02-15')
  }
];

export function TrainingResourceLibrary() {
  const [resources] = useState<TrainingResource[]>(mockResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<TrainingResource | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = !searchQuery || 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = !categoryFilter || resource.category === categoryFilter;
      const matchesType = !typeFilter || resource.type === typeFilter;
      const matchesFavorites = !showFavoritesOnly || resource.isFavorite;

      return matchesSearch && matchesCategory && matchesType && matchesFavorites;
    });
  }, [resources, searchQuery, categoryFilter, typeFilter, showFavoritesOnly]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return IconVideo;
      case 'document': return IconFileText;
      case 'image': return IconPhoto;
      case 'presentation': return IconFileText;
      case 'manual': return IconFileTypePdf;
      case 'checklist': return IconFileText;
      default: return IconFile;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'red';
      case 'document': return 'blue';
      case 'image': return 'green';
      case 'presentation': return 'orange';
      case 'manual': return 'violet';
      case 'checklist': return 'teal';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'installation': return 'blue';
      case 'maintenance': return 'orange';
      case 'sales': return 'green';
      case 'product_knowledge': return 'violet';
      case 'safety': return 'red';
      case 'general': return 'gray';
      default: return 'gray';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatCategoryLabel = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleViewResource = (resource: TrainingResource) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
  };

  const categories = [
    { value: 'installation', label: 'Installation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'sales', label: 'Sales' },
    { value: 'product_knowledge', label: 'Product Knowledge' },
    { value: 'safety', label: 'Safety' },
    { value: 'general', label: 'General' },
  ];

  const types = [
    { value: 'document', label: 'Document' },
    { value: 'video', label: 'Video' },
    { value: 'image', label: 'Image' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'manual', label: 'Manual' },
    { value: 'checklist', label: 'Checklist' },
  ];

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Training Resource Library</Title>
          <Text c="dimmed" size="sm">
            Access training materials, manuals, and resources
          </Text>
        </div>
        <Group gap="sm">
          <Button variant="light" leftSection={<IconFolder size={16} />}>
            Create Folder
          </Button>
          <Button leftSection={<IconUpload size={16} />} onClick={() => setShowUploadModal(true)}>
            Upload Resource
          </Button>
        </Group>
      </Group>

      {/* Filters */}
      <Card withBorder p="md">
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              placeholder="Search resources..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Category"
              data={categories}
              value={categoryFilter}
              onChange={setCategoryFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Type"
              data={types}
              value={typeFilter}
              onChange={setTypeFilter}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Button 
              variant={showFavoritesOnly ? 'filled' : 'light'}
              leftSection={<IconStar size={16} />}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              fullWidth
            >
              Favorites
            </Button>
          </Grid.Col>
        </Grid>
      </Card>

      {/* View Toggle */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="grid" leftSection={<IconFolder size={16} />}>
            Grid View
          </Tabs.Tab>
          <Tabs.Tab value="list" leftSection={<IconFile size={16} />}>
            List View
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="grid" pt="lg">
          <Grid>
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <Grid.Col key={resource.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card withBorder p="md" h="100%">
                    <Stack gap="sm" h="100%">
                      <Group justify="space-between">
                        <ThemeIcon 
                          color={getTypeColor(resource.type)} 
                          variant="light" 
                          size="lg"
                        >
                          <TypeIcon size={20} />
                        </ThemeIcon>
                        <Group gap="xs">
                          <ActionIcon 
                            variant="subtle" 
                            color={resource.isFavorite ? 'yellow' : 'gray'}
                          >
                            {resource.isFavorite ? <IconStarFilled size={16} /> : <IconStar size={16} />}
                          </ActionIcon>
                          <Menu position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <IconDots size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => handleViewResource(resource)}
                              >
                                View Details
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconDownload style={{ width: rem(14), height: rem(14) }} />}
                              >
                                Download
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconShare style={{ width: rem(14), height: rem(14) }} />}
                              >
                                Share
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}
                              >
                                Copy Link
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item
                                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                              >
                                Edit
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                color="red"
                              >
                                Delete
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Group>

                      <div style={{ flex: 1 }}>
                        <Text fw={500} size="sm" mb="xs" lineClamp={2}>
                          {resource.name}
                        </Text>
                        <Text size="xs" c="dimmed" mb="sm" lineClamp={3}>
                          {resource.description}
                        </Text>

                        <Group gap="xs" mb="sm">
                          <Badge 
                            color={getCategoryColor(resource.category)} 
                            variant="light" 
                            size="xs"
                          >
                            {formatCategoryLabel(resource.category)}
                          </Badge>
                          <Badge 
                            color={getTypeColor(resource.type)} 
                            variant="light" 
                            size="xs"
                          >
                            {formatTypeLabel(resource.type)}
                          </Badge>
                        </Group>
                      </div>

                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">{formatFileSize(resource.fileSize)}</Text>
                          <Group gap="xs">
                            <IconStar size={12} fill="gold" color="gold" />
                            <Text size="xs">{resource.rating}</Text>
                          </Group>
                        </Group>
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">{resource.downloadCount} downloads</Text>
                          <Button 
                            size="xs" 
                            variant="light"
                            onClick={() => handleViewResource(resource)}
                          >
                            View
                          </Button>
                        </Group>
                      </Stack>
                    </Stack>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="list" pt="lg">
          <Card withBorder p={0}>
            <Table.ScrollContainer minWidth={1000}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Size</Table.Th>
                    <Table.Th>Rating</Table.Th>
                    <Table.Th>Downloads</Table.Th>
                    <Table.Th>Modified</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredResources.map((resource) => {
                    const TypeIcon = getTypeIcon(resource.type);
                    return (
                      <Table.Tr key={resource.id}>
                        <Table.Td>
                          <Group gap="sm">
                            <ThemeIcon 
                              color={getTypeColor(resource.type)} 
                              variant="light" 
                              size="sm"
                            >
                              <TypeIcon size={16} />
                            </ThemeIcon>
                            <div>
                              <Text fw={500} size="sm">{resource.name}</Text>
                              <Text size="xs" c="dimmed" lineClamp={1}>
                                {resource.description}
                              </Text>
                            </div>
                            {resource.isFavorite && (
                              <IconStarFilled size={14} color="gold" />
                            )}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getTypeColor(resource.type)} 
                            variant="light" 
                            size="sm"
                          >
                            {formatTypeLabel(resource.type)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={getCategoryColor(resource.category)} 
                            variant="light" 
                            size="sm"
                          >
                            {formatCategoryLabel(resource.category)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{formatFileSize(resource.fileSize)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <IconStar size={14} fill="gold" color="gold" />
                            <Text size="sm">{resource.rating} ({resource.ratingCount})</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{resource.downloadCount}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {new Intl.DateTimeFormat('en-US').format(resource.lastModified)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Tooltip label="View Details">
                              <ActionIcon 
                                variant="subtle" 
                                onClick={() => handleViewResource(resource)}
                              >
                                <IconEye size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Download">
                              <ActionIcon variant="subtle">
                                <IconDownload size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Menu position="bottom-end">
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <IconDots size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  leftSection={<IconShare style={{ width: rem(14), height: rem(14) }} />}
                                >
                                  Share
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                >
                                  Edit
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                  color="red"
                                >
                                  Delete
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {filteredResources.length === 0 && (
        <Card withBorder p="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size="xl" variant="light" color="gray">
              <IconFile size={32} />
            </ThemeIcon>
            <div style={{ textAlign: 'center' }}>
              <Text fw={500} mb="xs">No resources found</Text>
              <Text size="sm" c="dimmed" mb="md">
                {searchQuery || categoryFilter || typeFilter ? 
                  'Try adjusting your search criteria or filters.' :
                  'Upload your first training resource to get started.'
                }
              </Text>
              <Button leftSection={<IconUpload size={16} />} onClick={() => setShowUploadModal(true)}>
                Upload Resource
              </Button>
            </div>
          </Stack>
        </Card>
      )}

      {/* Upload Resource Modal */}
      <Modal
        opened={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Training Resource"
        size="lg"
      >
        <Stack gap="md">
          <FileInput
            label="Select File"
            placeholder="Choose file to upload"
            required
          />

          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Resource Name"
                placeholder="Enter resource name"
                required
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Category"
                placeholder="Select category"
                data={categories}
                required
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Description"
            placeholder="Describe the resource"
            rows={3}
            required
          />

          <TextInput
            label="Tags"
            placeholder="Enter tags separated by commas"
            description="Add relevant tags to help others find this resource"
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button>
              Upload Resource
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Resource Detail Modal */}
      <Modal
        opened={showResourceModal}
        onClose={() => setShowResourceModal(false)}
        title="Resource Details"
        size="lg"
      >
        {selectedResource && (
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="sm">
                <ThemeIcon 
                  color={getTypeColor(selectedResource.type)} 
                  variant="light" 
                  size="xl"
                >
                  {(() => {
                    const TypeIcon = getTypeIcon(selectedResource.type);
                    return <TypeIcon size={24} />;
                  })()}
                </ThemeIcon>
                <div>
                  <Title order={3}>{selectedResource.name}</Title>
                  <Group gap="xs" mt="xs">
                    <Badge 
                      color={getCategoryColor(selectedResource.category)} 
                      variant="light"
                    >
                      {formatCategoryLabel(selectedResource.category)}
                    </Badge>
                    <Badge 
                      color={getTypeColor(selectedResource.type)} 
                      variant="light"
                    >
                      {formatTypeLabel(selectedResource.type)}
                    </Badge>
                  </Group>
                </div>
              </Group>
              <Group gap="sm">
                <Button variant="light" leftSection={<IconDownload size={16} />}>
                  Download
                </Button>
                <Button leftSection={<IconExternalLink size={16} />}>
                  Open
                </Button>
              </Group>
            </Group>

            <Text>{selectedResource.description}</Text>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">File Size</Text>
                <Text fw={500}>{formatFileSize(selectedResource.fileSize)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Downloads</Text>
                <Text fw={500}>{selectedResource.downloadCount}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Rating</Text>
                <Group gap="xs">
                  <IconStar size={16} fill="gold" color="gold" />
                  <Text fw={500}>{selectedResource.rating}/5 ({selectedResource.ratingCount} reviews)</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Uploaded By</Text>
                <Text fw={500}>{selectedResource.uploadedBy}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Upload Date</Text>
                <Text fw={500}>
                  {new Intl.DateTimeFormat('en-US').format(selectedResource.uploadedAt)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Last Modified</Text>
                <Text fw={500}>
                  {new Intl.DateTimeFormat('en-US').format(selectedResource.lastModified)}
                </Text>
              </Grid.Col>
            </Grid>

            {selectedResource.tags.length > 0 && (
              <div>
                <Text size="sm" c="dimmed" mb="xs">Tags</Text>
                <Group gap="xs">
                  {selectedResource.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </Group>
              </div>
            )}
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
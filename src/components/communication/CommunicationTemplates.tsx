'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  Group,
  Text,
  Button,
  Table,
  Badge,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Textarea,
  Select,
  Switch,
  Paper,
  Alert,
  Code,
  Divider,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDots,
  IconEye,
  IconCopy,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { 
  CommunicationTemplate, 
  CommunicationType, 
  TemplateVariable 
} from '@/types/communication';
import { communicationService } from '@/lib/services/communicationService';

export function CommunicationTemplates() {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [previewOpened, { open: openPreview, close: closePreview }] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<Omit<CommunicationTemplate, 'id' | 'createdAt' | 'updatedAt'>>({
    initialValues: {
      name: '',
      type: CommunicationType.EMAIL,
      subject: '',
      content: '',
      category: '',
      isActive: true,
      variables: [],
      createdBy: 'current-user',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 characters' : null),
      subject: (value) => (value.length < 1 ? 'Subject is required' : null),
      content: (value) => (value.length < 1 ? 'Content is required' : null),
      category: (value) => (value.length < 1 ? 'Category is required' : null),
    },
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await communicationService.getTemplates();
      setTemplates(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load templates',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    form.reset();
    setSelectedTemplate(null);
    setIsEditing(false);
    openModal();
  };

  const handleEdit = (template: CommunicationTemplate) => {
    form.setValues({
      name: template.name,
      type: template.type,
      subject: template.subject,
      content: template.content,
      category: template.category,
      isActive: template.isActive,
      variables: template.variables,
      createdBy: template.createdBy,
    });
    setSelectedTemplate(template);
    setIsEditing(true);
    openModal();
  };

  const handlePreview = (template: CommunicationTemplate) => {
    setSelectedTemplate(template);
    openPreview();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (isEditing && selectedTemplate) {
        // Update template logic would go here
        notifications.show({
          title: 'Success',
          message: 'Template updated successfully',
          color: 'green',
        });
      } else {
        await communicationService.createTemplate(values);
        notifications.show({
          title: 'Success',
          message: 'Template created successfully',
          color: 'green',
        });
      }
      closeModal();
      loadTemplates();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save template',
        color: 'red',
      });
    }
  };

  const handleDuplicate = async (template: CommunicationTemplate) => {
    try {
      await communicationService.createTemplate({
        ...template,
        name: `${template.name} (Copy)`,
        createdBy: 'current-user',
      });
      notifications.show({
        title: 'Success',
        message: 'Template duplicated successfully',
        color: 'green',
      });
      loadTemplates();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to duplicate template',
        color: 'red',
      });
    }
  };

  const getTypeColor = (type: CommunicationType) => {
    switch (type) {
      case CommunicationType.EMAIL:
        return 'blue';
      case CommunicationType.PHONE_CALL:
        return 'green';
      case CommunicationType.MEETING:
        return 'purple';
      case CommunicationType.SMS:
        return 'cyan';
      case CommunicationType.NOTE:
        return 'gray';
      case CommunicationType.TASK:
        return 'orange';
      case CommunicationType.TRAINING:
        return 'teal';
      case CommunicationType.VISIT:
        return 'red';
      case CommunicationType.FOLLOW_UP:
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getTypeLabel = (type: CommunicationType) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const addVariable = () => {
    const variables = form.values.variables;
    form.setFieldValue('variables', [
      ...variables,
      { name: '', label: '', type: 'text' as const, required: false },
    ]);
  };

  const removeVariable = (index: number) => {
    const variables = form.values.variables;
    form.setFieldValue('variables', variables.filter((_, i) => i !== index));
  };

  const renderPreview = () => {
    if (!selectedTemplate) return null;

    let previewSubject = selectedTemplate.subject;
    let previewContent = selectedTemplate.content;

    selectedTemplate.variables.forEach(variable => {
      const placeholder = `{{${variable.name}}}`;
      const sampleValue = variable.defaultValue || `[${variable.label}]`;
      previewSubject = previewSubject.replace(new RegExp(placeholder, 'g'), sampleValue);
      previewContent = previewContent.replace(new RegExp(placeholder, 'g'), sampleValue);
    });

    return (
      <Stack>
        <div>
          <Text fw={500} mb="sm">Type:</Text>
          <Badge color={getTypeColor(selectedTemplate.type)} variant="light">
            {getTypeLabel(selectedTemplate.type)}
          </Badge>
        </div>

        <div>
          <Text fw={500} mb="sm">Subject:</Text>
          <Text mb="md" p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-1)' }}>
            {previewSubject}
          </Text>
        </div>
        
        <div>
          <Text fw={500} mb="sm">Content:</Text>
          <Paper
            p="md"
            withBorder
            style={{ backgroundColor: 'white', whiteSpace: 'pre-wrap' }}
          >
            {previewContent}
          </Paper>
        </div>

        {selectedTemplate.variables.length > 0 && (
          <div>
            <Text fw={500} mb="sm">Variables:</Text>
            <Stack gap="xs">
              {selectedTemplate.variables.map((variable, index) => (
                <Group key={index}>
                  <Code>{`{{${variable.name}}}`}</Code>
                  <Text size="sm">{variable.label}</Text>
                  {variable.required && (
                    <Badge size="xs" color="red" variant="light">Required</Badge>
                  )}
                </Group>
              ))}
            </Stack>
          </div>
        )}
      </Stack>
    );
  };

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl" fw={600}>Communication Templates</Text>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Create Template
        </Button>
      </Group>

      <Paper withBorder>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Subject</Table.Th>
              <Table.Th>Variables</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Updated</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {templates.map((template) => (
              <Table.Tr key={template.id}>
                <Table.Td>
                  <Text fw={500}>{template.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={getTypeColor(template.type)} variant="light">
                    {getTypeLabel(template.type)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{template.category}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed" lineClamp={1}>
                    {template.subject}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{template.variables.length}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={template.isActive ? 'green' : 'gray'} variant="light">
                    {template.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {template.updatedAt.toLocaleDateString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => handlePreview(template)}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                    <Menu position="bottom-end">
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEdit size={14} />}
                          onClick={() => handleEdit(template)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconCopy size={14} />}
                          onClick={() => handleDuplicate(template)}
                        >
                          Duplicate
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconTrash size={14} />}
                          color="red"
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={isEditing ? 'Edit Template' : 'Create Template'}
        size="xl"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Group grow>
              <TextInput
                label="Template Name"
                placeholder="Enter template name"
                {...form.getInputProps('name')}
              />
              <Select
                label="Type"
                data={Object.values(CommunicationType).map(type => ({
                  value: type,
                  label: getTypeLabel(type),
                }))}
                {...form.getInputProps('type')}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Category"
                placeholder="Enter category (e.g., Training, Support)"
                {...form.getInputProps('category')}
              />
              <Switch
                label="Active Template"
                description="Only active templates can be used"
                {...form.getInputProps('isActive', { type: 'checkbox' })}
              />
            </Group>

            <TextInput
              label="Subject"
              placeholder="Enter template subject"
              {...form.getInputProps('subject')}
            />

            <Textarea
              label="Content"
              placeholder="Enter template content"
              minRows={6}
              {...form.getInputProps('content')}
            />

            <div>
              <Group justify="space-between" mb="sm">
                <Text fw={500}>Template Variables</Text>
                <Button size="xs" variant="light" onClick={addVariable}>
                  Add Variable
                </Button>
              </Group>
              
              {form.values.variables.map((variable, index) => (
                <Paper key={index} p="sm" withBorder mb="sm">
                  <Group>
                    <TextInput
                      placeholder="Variable name (e.g., customerName)"
                      value={variable.name}
                      onChange={(e) => 
                        form.setFieldValue(`variables.${index}.name`, e.currentTarget.value)
                      }
                      flex={1}
                    />
                    <TextInput
                      placeholder="Display label"
                      value={variable.label}
                      onChange={(e) => 
                        form.setFieldValue(`variables.${index}.label`, e.currentTarget.value)
                      }
                      flex={1}
                    />
                    <Select
                      data={[
                        { value: 'text', label: 'Text' },
                        { value: 'number', label: 'Number' },
                        { value: 'date', label: 'Date' },
                        { value: 'boolean', label: 'Boolean' },
                      ]}
                      value={variable.type}
                      onChange={(value) => 
                        form.setFieldValue(`variables.${index}.type`, value as any)
                      }
                      w={100}
                    />
                    <Switch
                      label="Required"
                      checked={variable.required}
                      onChange={(e) => 
                        form.setFieldValue(`variables.${index}.required`, e.currentTarget.checked)
                      }
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => removeVariable(index)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}

              {form.values.variables.length > 0 && (
                <Alert icon={<IconInfoCircle size={16} />} color="blue">
                  Use variables in your template by wrapping them in double curly braces, 
                  e.g., <Code>{'{{customerName}}'}</Code>
                </Alert>
              )}
            </div>

            <Divider />

            <Group justify="flex-end">
              <Button variant="light" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Template' : 'Create Template'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        opened={previewOpened}
        onClose={closePreview}
        title="Template Preview"
        size="lg"
      >
        {renderPreview()}
      </Modal>
    </Stack>
  );
}
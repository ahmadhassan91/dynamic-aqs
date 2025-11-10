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
  Tabs,
  ScrollArea,
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
  IconCode,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { EmailTemplate, EmailCategory, EmailVariable } from '@/types/email';
import { emailService } from '@/lib/services/emailService';

export function EmailTemplateManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [previewOpened, { open: openPreview, close: closePreview }] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>>({
    initialValues: {
      name: '',
      subject: '',
      body: '',
      category: EmailCategory.ONBOARDING,
      variables: [],
      isActive: true,
      createdBy: 'current-user',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 characters' : null),
      subject: (value) => (value.length < 1 ? 'Subject is required' : null),
      body: (value) => (value.length < 1 ? 'Body is required' : null),
    },
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await emailService.getTemplates();
      setTemplates(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load email templates',
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

  const handleEdit = (template: EmailTemplate) => {
    form.setValues({
      name: template.name,
      subject: template.subject,
      body: template.body,
      category: template.category,
      variables: template.variables,
      isActive: template.isActive,
      createdBy: template.createdBy,
    });
    setSelectedTemplate(template);
    setIsEditing(true);
    openModal();
  };

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    openPreview();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (isEditing && selectedTemplate) {
        await emailService.updateTemplate(selectedTemplate.id, values);
        notifications.show({
          title: 'Success',
          message: 'Template updated successfully',
          color: 'green',
        });
      } else {
        await emailService.createTemplate(values);
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

  const handleDelete = async (template: EmailTemplate) => {
    try {
      await emailService.deleteTemplate(template.id);
      notifications.show({
        title: 'Success',
        message: 'Template deleted successfully',
        color: 'green',
      });
      loadTemplates();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete template',
        color: 'red',
      });
    }
  };

  const handleDuplicate = async (template: EmailTemplate) => {
    try {
      await emailService.createTemplate({
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

  const getCategoryColor = (category: EmailCategory) => {
    switch (category) {
      case EmailCategory.ONBOARDING:
        return 'blue';
      case EmailCategory.TRAINING:
        return 'green';
      case EmailCategory.ORDER_CONFIRMATION:
        return 'orange';
      case EmailCategory.FOLLOW_UP:
        return 'purple';
      case EmailCategory.REMINDER:
        return 'yellow';
      case EmailCategory.MARKETING:
        return 'pink';
      case EmailCategory.SYSTEM:
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getCategoryLabel = (category: EmailCategory) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
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

    let previewBody = selectedTemplate.body;
    selectedTemplate.variables.forEach(variable => {
      const placeholder = `{{${variable.name}}}`;
      const sampleValue = variable.defaultValue || `[${variable.label}]`;
      previewBody = previewBody.replace(new RegExp(placeholder, 'g'), sampleValue);
    });

    return (
      <div>
        <Text fw={500} mb="sm">Subject:</Text>
        <Text mb="md" p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-1)' }}>
          {selectedTemplate.subject}
        </Text>
        
        <Text fw={500} mb="sm">Body:</Text>
        <div
          style={{
            border: '1px solid var(--mantine-color-gray-3)',
            borderRadius: '4px',
            padding: '1rem',
            backgroundColor: 'white',
          }}
          dangerouslySetInnerHTML={{ __html: previewBody }}
        />
      </div>
    );
  };

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl" fw={600}>Email Templates</Text>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Create Template
        </Button>
      </Group>

      <Paper withBorder>
        <ScrollArea>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
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
                    <Badge color={getCategoryColor(template.category)} variant="light">
                      {getCategoryLabel(template.category)}
                    </Badge>
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
                            onClick={() => handleDelete(template)}
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
        </ScrollArea>
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
                label="Category"
                data={Object.values(EmailCategory).map(cat => ({
                  value: cat,
                  label: getCategoryLabel(cat),
                }))}
                {...form.getInputProps('category')}
              />
            </Group>

            <TextInput
              label="Subject Line"
              placeholder="Enter email subject"
              {...form.getInputProps('subject')}
            />

            <Textarea
              label="Email Body"
              placeholder="Enter email body (HTML supported)"
              minRows={8}
              {...form.getInputProps('body')}
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

            <Switch
              label="Active Template"
              description="Only active templates can be used in campaigns"
              {...form.getInputProps('isActive', { type: 'checkbox' })}
            />

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
'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  Stack,
  Group,
  Text,
  TextInput,
  Textarea,
  Button,
  Select,
  MultiSelect,
  Switch,
  Paper,
  Tabs,
  Alert,
  Code,
  Divider,
  ActionIcon,
  FileInput,
  Badge,
} from '@mantine/core';
import {
  IconSend,
  IconClock,
  IconEye,
  IconCode,
  IconPaperclip,
  IconX,
  IconInfoCircle,
} from '@tabler/icons-react';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { EmailTemplate, EmailComposer as IEmailComposer, EmailCategory } from '@/types/email';
import { emailService } from '@/lib/services/emailService';

interface EmailComposerProps {
  opened: boolean;
  onClose: () => void;
  initialRecipients?: string[];
  templateId?: string;
}

export function EmailComposer({ opened, onClose, initialRecipients = [], templateId }: EmailComposerProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('compose');
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<IEmailComposer>({
    initialValues: {
      to: initialRecipients,
      cc: [],
      bcc: [],
      subject: '',
      body: '',
      templateId: templateId || undefined,
      variables: {},
      attachments: [],
      scheduledAt: undefined,
      trackOpens: true,
      trackClicks: true,
    },
    validate: {
      to: (value) => (value.length === 0 ? 'At least one recipient is required' : null),
      subject: (value) => (value.length < 1 ? 'Subject is required' : null),
      body: (value) => (value.length < 1 ? 'Message body is required' : null),
    },
  });

  useEffect(() => {
    if (opened) {
      loadTemplates();
      if (templateId) {
        loadTemplate(templateId);
      }
    }
  }, [opened, templateId]);

  const loadTemplates = async () => {
    try {
      const data = await emailService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadTemplate = async (id: string) => {
    try {
      const template = await emailService.getTemplate(id);
      if (template) {
        setSelectedTemplate(template);
        form.setFieldValue('templateId', template.id);
        form.setFieldValue('subject', template.subject);
        form.setFieldValue('body', template.body);
        
        // Initialize variables with default values
        const variables: Record<string, any> = {};
        template.variables.forEach(variable => {
          variables[variable.name] = variable.defaultValue || '';
        });
        form.setFieldValue('variables', variables);
      }
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  };

  const handleTemplateChange = (templateId: string | null) => {
    if (templateId) {
      loadTemplate(templateId);
    } else {
      setSelectedTemplate(null);
      form.setFieldValue('templateId', undefined);
      form.setFieldValue('variables', {});
    }
  };

  const handleSend = async (values: IEmailComposer) => {
    setLoading(true);
    try {
      await emailService.sendEmail(values);
      notifications.show({
        title: 'Success',
        message: values.scheduledAt ? 'Email scheduled successfully' : 'Email sent successfully',
        color: 'green',
      });
      onClose();
      form.reset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to send email',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAttachmentAdd = (files: File[]) => {
    setAttachments(prev => [...prev, ...files]);
  };

  const handleAttachmentRemove = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const renderPreview = () => {
    let previewSubject = form.values.subject;
    let previewBody = form.values.body;

    if (selectedTemplate && form.values.variables) {
      selectedTemplate.variables.forEach(variable => {
        const placeholder = `{{${variable.name}}}`;
        const value = form.values.variables?.[variable.name] || `[${variable.label}]`;
        previewSubject = previewSubject.replace(new RegExp(placeholder, 'g'), value);
        previewBody = previewBody.replace(new RegExp(placeholder, 'g'), value);
      });
    }

    return (
      <Stack>
        <div>
          <Text fw={500} mb="xs">To:</Text>
          <Text size="sm" c="dimmed">{form.values.to.join(', ')}</Text>
        </div>
        
        {form.values.cc && form.values.cc.length > 0 && (
          <div>
            <Text fw={500} mb="xs">CC:</Text>
            <Text size="sm" c="dimmed">{form.values.cc.join(', ')}</Text>
          </div>
        )}

        <div>
          <Text fw={500} mb="xs">Subject:</Text>
          <Text size="sm">{previewSubject}</Text>
        </div>

        <div>
          <Text fw={500} mb="xs">Message:</Text>
          <Paper
            p="md"
            withBorder
            style={{ backgroundColor: 'white' }}
          >
            <div dangerouslySetInnerHTML={{ __html: previewBody }} />
          </Paper>
        </div>

        {attachments.length > 0 && (
          <div>
            <Text fw={500} mb="xs">Attachments:</Text>
            <Group>
              {attachments.map((file, index) => (
                <Badge key={index} variant="light">
                  {file.name}
                </Badge>
              ))}
            </Group>
          </div>
        )}
      </Stack>
    );
  };

  const getCategoryLabel = (category: EmailCategory) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Compose Email"
      size="xl"
    >
      <form onSubmit={form.onSubmit(handleSend)}>
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'compose')}>
          <Tabs.List>
            <Tabs.Tab value="compose" leftSection={<IconCode size={16} />}>
              Compose
            </Tabs.Tab>
            <Tabs.Tab value="preview" leftSection={<IconEye size={16} />}>
              Preview
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="compose" pt="md">
            <Stack>
              {/* Template Selection */}
              <Select
                label="Email Template (Optional)"
                placeholder="Select a template or compose from scratch"
                data={templates.map(t => ({
                  value: t.id,
                  label: `${t.name} (${getCategoryLabel(t.category)})`,
                }))}
                value={form.values.templateId || null}
                onChange={handleTemplateChange}
                clearable
              />

              {/* Recipients */}
              <MultiSelect
                label="To"
                placeholder="Enter email addresses"
                data={[]}
                searchable
                {...form.getInputProps('to')}
              />

              <Group grow>
                <MultiSelect
                  label="CC (Optional)"
                  placeholder="Enter email addresses"
                  data={[]}
                  searchable
                  {...form.getInputProps('cc')}
                />
                <MultiSelect
                  label="BCC (Optional)"
                  placeholder="Enter email addresses"
                  data={[]}
                  searchable
                  {...form.getInputProps('bcc')}
                />
              </Group>

              {/* Template Variables */}
              {selectedTemplate && selectedTemplate.variables.length > 0 && (
                <Paper p="md" withBorder>
                  <Text fw={500} mb="sm">Template Variables</Text>
                  <Stack gap="sm">
                    {selectedTemplate.variables.map((variable) => (
                      <TextInput
                        key={variable.name}
                        label={variable.label}
                        placeholder={`Enter ${variable.label.toLowerCase()}`}
                        required={variable.required}
                        value={form.values.variables?.[variable.name] || ''}
                        onChange={(e) => 
                          form.setFieldValue(`variables.${variable.name}`, e.currentTarget.value)
                        }
                      />
                    ))}
                  </Stack>
                  <Alert icon={<IconInfoCircle size={16} />} color="blue" mt="sm">
                    These variables will replace placeholders like <Code>{'{{customerName}}'}</Code> in your template.
                  </Alert>
                </Paper>
              )}

              {/* Subject and Body */}
              <TextInput
                label="Subject"
                placeholder="Enter email subject"
                {...form.getInputProps('subject')}
              />

              <Textarea
                label="Message"
                placeholder="Enter your message (HTML supported)"
                minRows={8}
                {...form.getInputProps('body')}
              />

              {/* Attachments */}
              <div>
                <Text fw={500} mb="sm">Attachments</Text>
                <FileInput
                  placeholder="Select files to attach"
                  multiple
                  onChange={handleAttachmentAdd}
                  leftSection={<IconPaperclip size={16} />}
                />
                {attachments.length > 0 && (
                  <Group mt="sm">
                    {attachments.map((file, index) => (
                      <Badge
                        key={index}
                        variant="light"
                        rightSection={
                          <ActionIcon
                            size="xs"
                            color="red"
                            variant="transparent"
                            onClick={() => handleAttachmentRemove(index)}
                          >
                            <IconX size={10} />
                          </ActionIcon>
                        }
                      >
                        {file.name}
                      </Badge>
                    ))}
                  </Group>
                )}
              </div>

              {/* Scheduling */}
              <DateTimePicker
                label="Schedule Send (Optional)"
                placeholder="Send immediately or schedule for later"
                clearable
                {...form.getInputProps('scheduledAt')}
              />

              {/* Tracking Options */}
              <Group>
                <Switch
                  label="Track Opens"
                  {...form.getInputProps('trackOpens', { type: 'checkbox' })}
                />
                <Switch
                  label="Track Clicks"
                  {...form.getInputProps('trackClicks', { type: 'checkbox' })}
                />
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="preview" pt="md">
            {renderPreview()}
          </Tabs.Panel>
        </Tabs>

        <Divider my="md" />

        <Group justify="space-between">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Group>
            <Button
              variant="light"
              onClick={() => setActiveTab('preview')}
              leftSection={<IconEye size={16} />}
            >
              Preview
            </Button>
            <Button
              type="submit"
              loading={loading}
              leftSection={form.values.scheduledAt ? <IconClock size={16} /> : <IconSend size={16} />}
            >
              {form.values.scheduledAt ? 'Schedule Email' : 'Send Email'}
            </Button>
          </Group>
        </Group>
      </form>
    </Modal>
  );
}